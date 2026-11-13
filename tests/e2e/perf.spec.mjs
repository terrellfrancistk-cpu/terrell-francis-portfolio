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

// The CI failure of Nov 13: on a system whose fallback sans is much wider than Inter (DejaVu Sans, as on GitHub's Linux
// runner), text re-wrapped when the web font arrived (CLS 0.22). The metric-matched "Inter Fallback" / "Inter Display
// Fallback" faces prevent that. This holds the web fonts back and makes DejaVu the system fallback to prove it.
test('no layout jump when the web font arrives late on a system with a wide fallback font', async ({ page }) => {
  await page.route('**/*.woff2', async (r) => { await new Promise((x) => setTimeout(x, 1500)); await r.continue(); });
  await page.addInitScript(() => {
    window.__cls = 0; window.__shifts = [];
    const d = (n) => !n ? '?' : n.nodeName.toLowerCase() + (n.id ? '#' + n.id : '') + (typeof n.className === 'string' && n.className ? '.' + n.className.trim().split(/\s+/).join('.') : '') + (n.nodeType === 3 ? ` "${n.textContent.trim().slice(0, 24)}"` : '');
    new PerformanceObserver((l) => l.getEntries().forEach((e) => {
      if (e.hadRecentInput) return; window.__cls += e.value;
      window.__shifts.push(`${e.value.toFixed(4)} @${Math.round(e.startTime)}ms: ` + (e.sources || []).map((s) => `${d(s.node)} x${Math.round(s.previousRect.x)}->${Math.round(s.currentRect.x)} y${Math.round(s.previousRect.y)}->${Math.round(s.currentRect.y)} w${Math.round(s.previousRect.width)}->${Math.round(s.currentRect.width)} h${Math.round(s.previousRect.height)}->${Math.round(s.currentRect.height)}`).join(' | '));
    })).observe({ type: 'layout-shift', buffered: true });
    document.addEventListener('DOMContentLoaded', () => {
      const s = document.createElement('style');
      s.textContent = ':root{--font:"Inter","Inter Fallback","Inter Fallback FS","DejaVu Sans",sans-serif}'
        + '.hero h1,.hero-promise,.section h2,.contact h2,.metric-num,.case-stat span,.doc h1{font-family:"Inter","Inter Display Fallback","Inter Display Fallback FS","DejaVu Sans",sans-serif}';
      document.head.appendChild(s);
    });
  });
  await page.goto('/', { waitUntil: 'load' });
  await page.waitForTimeout(2800);
  const { cls, fontsLoaded, shifts, faces } = await page.evaluate(() => ({ cls: window.__cls, shifts: window.__shifts,
    fontsLoaded: [...document.fonts].some((f) => f.family === 'Inter' && f.status === 'loaded'),
    faces: [...document.fonts].filter((f) => /Fallback/.test(f.family)).map((f) => `${f.family}/${f.weight}:${f.status}`).join(' ') }));
  for (const line of shifts.filter((x) => parseFloat(x) >= 0.005)) console.log('  shift', line);
  console.log('  fallback faces:', faces);
  const avail = await page.evaluate(async () => {
    const out = [];
    for (const n of ['Arial', 'Liberation Sans', 'Arimo', 'FreeSans', 'DejaVu Sans']) {
      try { await new FontFace('probe', `local("${n}")`).load(); out.push(n + ':yes'); } catch { out.push(n + ':no'); }
    }
    return out.join(' ');
  });
  console.log('late-font CLS', cls.toFixed(4), '| local fonts:', avail);
  expect(fontsLoaded).toBe(true);
  expect(cls).toBeLessThan(0.05);
});
