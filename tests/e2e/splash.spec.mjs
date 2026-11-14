import { test, expect } from '@playwright/test';

// ONB-1, per Terrell (Nov 13, 10:01 PM CT): ONE splash screen (TF mark large and centred, "by TK Hub" and the
// TK Hub logo beneath), shown only while the page is loading: no minimum time, no forced animation, skipped on
// reloads and repeat visits. ?splash=1 forces it for automation (automated browsers skip it otherwise).

test('one splash screen: TF mark, "by TK Hub", TK Hub logo', async ({ page }) => {
  await page.goto('/?splash=1', { waitUntil: 'commit' });
  await expect(page.locator('html')).toHaveClass(/splash-on/);
  const splash = page.locator('#splash');
  await expect(splash.locator('.splash-one .splash-mark')).toBeAttached();
  await expect(splash.locator('.splash-by')).toHaveText('by TK Hub');
  await expect(splash.locator('img.splash-tk')).toHaveAttribute('srcset', /tkhub-logo@hd\.webp 209w/);
  // Single screen: no second (black) screen and no timeline animation on the splash.
  expect(await splash.locator('.splash-b').count()).toBe(0);
  expect(await splash.evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
});

test('no added wait: the splash leaves as soon as the page is ready', async ({ page }) => {
  await page.goto('/?splash=1', { waitUntil: 'commit' });
  const t = await page.evaluate(async () => {
    await new Promise((r) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', r) : r()));
    await document.fonts.ready;
    const ready = performance.now();
    await new Promise((r) => { const tick = () => (document.getElementById('splash') ? requestAnimationFrame(tick) : r()); tick(); });
    return { ready, gone: performance.now() };
  });
  expect(t.gone - t.ready).toBeLessThan(400); // a 0.15 s fade, nothing more
  await expect(page.locator('html')).toHaveClass(/splash-done/);
  await expect(page.locator('h1')).toBeVisible();
});

test('on a slow load it stays only until the page is ready', async ({ page }) => {
  await page.route('**/assets/fonts/inter-var.woff2', async (r) => { await new Promise((s) => setTimeout(s, 900)); await r.continue(); });
  await page.goto('/?splash=1', { waitUntil: 'commit' });
  await page.waitForTimeout(500);
  await expect(page.locator('#splash')).toBeAttached(); // still loading: the splash covers it
  await expect(page.locator('#splash')).toHaveCount(0, { timeout: 2500 });
});

test('hero entrance plays as the splash lifts, not on a fixed 2 s timer', async ({ page }) => {
  await page.goto('/?splash=1', { waitUntil: 'commit' });
  await expect(page.locator('#splash')).toHaveCount(0, { timeout: 2500 });
  const gone = Date.now();
  await expect.poll(() => page.locator('.hero-promise').evaluate((el) => Number(getComputedStyle(el).opacity)), { timeout: 2000 }).toBeGreaterThan(0.99);
  expect(Date.now() - gone).toBeLessThan(1500);
});

test('skipped on reload and on a repeat visit in the same session', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  await page.goto('/', { waitUntil: 'commit' });
  await expect(page.locator('html')).toHaveClass(/splash-on/); // first fresh visit
  await page.waitForLoadState('load');
  await page.reload({ waitUntil: 'commit' });
  await expect(page.locator('html')).not.toHaveClass(/splash-on/);
  await page.goto('/privacy/'); await page.goto('/', { waitUntil: 'commit' });
  await expect(page.locator('html')).not.toHaveClass(/splash-on/);
});

test('never under reduced motion', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/?splash=1');
  await expect(page.locator('html')).not.toHaveClass(/splash-on/);
  await ctx.close();
});

test('a tap skips the splash', async ({ page }) => {
  await page.route('**/assets/fonts/inter-var.woff2', async (r) => { await new Promise((s) => setTimeout(s, 1500)); await r.continue(); });
  await page.goto('/?splash=1', { waitUntil: 'commit' });
  await expect(page.locator('#splash')).toBeVisible();
  await page.locator('#splash').click({ force: true });
  await expect(page.locator('#splash')).toHaveCount(0);
});

test('dark theme: the splash is dark too (the TF mark stays visible)', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.route('**/script.js', async (r) => { await new Promise((s) => setTimeout(s, 1500)); await r.continue(); });
  await page.goto('/?splash=1', { waitUntil: 'commit' });
  const bg = await page.locator('#splash').evaluate((el) => getComputedStyle(el).backgroundColor);
  expect(bg).not.toBe('rgb(255, 255, 255)');
  await ctx.close();
});
