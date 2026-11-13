import { test, expect } from '@playwright/test';

// PERF-1 for a static site: page-weight and Core Web Vitals budgets, measured on the local server.
// (k6 load testing does not apply: there is no backend, and production load tests are not allowed.)
// htmlKB raised 100 -> 130 on 2026-11-13: the restored About, phase strip and product studio add ~18 KB of HTML.
const BUDGET = { totalKB: 700, htmlKB: 130, cssKB: 80, jsKB: 30, lcpMs: 2500, cls: 0.1 };

test('first-load page weight stays under budget', async ({ page }) => {
  const sizes = { html: 0, css: 0, js: 0, font: 0, img: 0, other: 0 };
  page.on('response', async (r) => {
    if (new URL(r.url()).hostname !== new URL(page.url() || 'http://127.0.0.1').hostname && r.request().frame() !== page.mainFrame()) return;
    if (!['127.0.0.1', 'localhost'].includes(new URL(r.url()).hostname)) return;
    const t = r.request().resourceType();
    const len = (await r.body().catch(() => Buffer.alloc(0))).length;
    const k = t === 'document' ? 'html' : t === 'stylesheet' ? 'css' : t === 'script' ? 'js' : t === 'font' ? 'font' : t === 'image' ? 'img' : 'other';
    sizes[k] += len;
  });
  await page.goto('/', { waitUntil: 'networkidle' });
  const kb = Object.fromEntries(Object.entries(sizes).map(([k, v]) => [k, Math.round(v / 1024)]));
  const total = Object.values(kb).reduce((a, b) => a + b, 0);
  console.log('weight KB', JSON.stringify(kb), 'total', total);
  expect(total).toBeLessThan(BUDGET.totalKB);
  expect(kb.html).toBeLessThan(BUDGET.htmlKB);
  expect(kb.css).toBeLessThan(BUDGET.cssKB);
  expect(kb.js).toBeLessThan(BUDGET.jsKB);
});

test('LCP and CLS within Core Web Vitals "good" on a throttled phone-like CPU', async ({ page, browserName }) => {
  const client = await page.context().newCDPSession(page);
  await client.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await client.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 });
  await page.addInitScript(() => {
    window.__cls = 0; window.__lcp = 0; window.__shifts = [];
    const describe = (n) => !n ? '?' : (n.nodeName.toLowerCase() + (n.id ? '#' + n.id : '') + (typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/).join('.') : ''));
    new PerformanceObserver((l) => l.getEntries().forEach((e) => {
      if (e.hadRecentInput) return;
      window.__cls += e.value;
      // Record what moved, so a failure (here or in CI) names the element instead of just a number.
      window.__shifts.push({ v: +e.value.toFixed(4), t: Math.round(e.startTime), sources: (e.sources || []).map((s) => `${describe(s.node)} y ${Math.round(s.previousRect.y)}->${Math.round(s.currentRect.y)} h ${Math.round(s.previousRect.height)}->${Math.round(s.currentRect.height)}`) });
    })).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { const es = l.getEntries(); window.__lcp = es[es.length - 1].startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  const { lcp, cls, shifts } = await page.evaluate(() => ({ lcp: window.__lcp, cls: window.__cls, shifts: window.__shifts }));
  console.log('LCP ms', Math.round(lcp), 'CLS', cls.toFixed(4));
  for (const s of shifts.filter((x) => x.v >= 0.005)) console.log('  shift', s.v, '@', s.t, 'ms:', s.sources.join(' | '));
  expect(lcp).toBeGreaterThan(0);
  expect(lcp).toBeLessThan(BUDGET.lcpMs);
  expect(cls).toBeLessThan(BUDGET.cls);
});
