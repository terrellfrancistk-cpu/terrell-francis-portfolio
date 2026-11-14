import { test, expect } from '@playwright/test';

// Terrell, 2026-11-13: no build-tool or AI vendor names anywhere a visitor can see (page text, page source including
// comments, published files); technical IDs stay as they are; nothing should reveal a template.
const VENDORS = /\b(rork|grok|claude|anthropic|openai|chat\s?gpt|copilot|lovable|replit|gemini|midjourney|higgsfield|meshy|bolt\.new|v0\.dev)\b/i;
const PUBLISHED_TEXT = ['/', '/privacy/', '/404.html', '/README.md', '/robots.txt', '/sitemap.xml', '/script.js', '/styles.css',
  '/.github/workflows/pages.yml', '/.github/workflows/site-tests.yml', '/.github/workflows/uptime.yml'];

test('no vendor or build-tool names in any published file (source, comments, workflows, README)', async ({ request }) => {
  const hits = [];
  for (const path of PUBLISHED_TEXT) {
    const r = await request.get(path); expect(r.status(), path).toBe(200);
    (await r.text()).split('\n').forEach((line, i) => { const m = line.match(VENDORS); if (m) hits.push(`${path}:${i + 1} "${m[0]}"`); });
  }
  expect(hits).toEqual([]);
});

test('no vendor or tool names in what a visitor reads (text, alt, titles, labels), incl. Cursor', async ({ page }) => {
  for (const path of ['/', '/privacy/', '/nope']) {
    await page.goto(path);
    const visible = await page.evaluate(() => [document.body.innerText, document.title,
      ...[...document.querySelectorAll('[alt],[title],[aria-label],meta[content]')].map((e) => e.getAttribute('alt') || e.getAttribute('title') || e.getAttribute('aria-label') || e.getAttribute('content'))].join('\n'));
    expect(visible.match(new RegExp(VENDORS.source.replace(')\\b', '|cursor)\\b'), 'i'))?.[0] ?? null, path).toBeNull();
  }
});

// Terrell, 2026-11-13: the Talencia role is Full-time (W-2), never Contract.
test('current role is never labelled Contract; any employment type shown says Full-time (W-2)', async ({ page }) => {
  await page.goto('/');
  for (const sel of ['#role-current', '.now-talencia']) {
    const text = await page.locator(sel).innerText();
    expect(text, sel).not.toMatch(/\bcontract(or)?\b/i);
    const type = text.match(/\b(full[- ]time|part[- ]time|w-?2|1099|freelance|temporary)\b[^\n]*/i);
    if (type) expect(type[0], sel).toMatch(/Full-time \(W-2\)/);
  }
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(JSON.stringify(ld)).not.toMatch(/contract(or)?/i);
});
