import { test, expect } from '@playwright/test';

// Quality bar (Terrell, 2026-11-13): sharp, full-resolution icons. On a 3x phone each icon must come from a file at
// least as large as its displayed size x DPR (2x allowed for the smaller files Booked and TK Hub have officially).
// Exceptions: these apps' official high-res files are DIFFERENT artwork (new marks). Swapping marks needs Terrell's
// OK (PROPOSED_REMOVALS.md); until then they use the current 128px art. Remove a name here only when it's resolved.
const PENDING_TERRELL = ['role', 'radr', 'wrace', 'noir'];

test('icons are sharp on a 3x screen (except the four pending Terrell)', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto('/');
  await page.evaluate(async () => {
    for (const img of document.querySelectorAll('img')) { img.loading = 'eager'; }
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
  // naturalWidth of a srcset image is density-corrected, so measure the chosen file's real pixel width separately.
  const rows = await page.$$eval('img[src^="assets/"]', (imgs) => Promise.all(imgs.map((i) => new Promise((res) => {
    const url = i.currentSrc || i.src; const probe = new Image();
    probe.onload = () => res({ file: url.split('/assets/')[1], shown: Number(i.getAttribute('width')), natural: probe.naturalWidth });
    probe.onerror = () => res({ file: url.split('/assets/')[1], shown: Number(i.getAttribute('width')), natural: 0 });
    probe.src = url;
  }))));
  const soft = rows.filter((r) => r.natural > 0 && !PENDING_TERRELL.some((a) => r.file.startsWith(`apps/${a}.`)))
    .filter((r) => r.natural < r.shown * (r.file.includes('booked') || r.file.includes('tkhub-logo') ? 1.6 : 2.9))
    .map((r) => `${r.file} ${r.natural}px for ${r.shown}px`);
  expect([...new Set(soft)]).toEqual([]);
  // The six same-artwork apps really load their HD files on this screen.
  for (const a of ['apex', 'curb', 'zilt', 'our-people', 'afterglow', 'booked']) {
    expect(rows.some((r) => r.file === `apps/hd/${a}.webp`), a).toBe(true);
  }
  await ctx.close();
});

test('every original icon file is still referenced (nothing replaced)', async ({ page }) => {
  await page.goto('/');
  const srcs = await page.$$eval('img', (imgs) => imgs.map((i) => i.getAttribute('src')));
  for (const a of ['apex', 'role', 'booked', 'curb', 'zilt', 'our-people', 'radr', 'wrace', 'afterglow', 'noir']) {
    expect(srcs).toContain(`assets/apps/${a}.png`);
  }
  expect(srcs).toContain('assets/tkhub-logo.png');
});
