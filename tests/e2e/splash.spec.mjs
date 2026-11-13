import { test, expect } from '@playwright/test';

// ONB-1: personal mark → solid black TK Hub ~1s → content. ?splash=1 forces it for automation.
test('splash order: TF mark, then black TK Hub screen, then the page', async ({ page }) => {
  await page.goto('/?splash=1', { waitUntil: 'commit' });
  await expect(page.locator('html')).toHaveClass(/splash-on/);
  const splash = page.locator('#splash');
  await expect(splash).toBeVisible();
  await expect(page.locator('.splash-a .splash-mark')).toBeVisible();
  // At ~1.3s the black TK Hub screen is fully up.
  await page.waitForTimeout(1300);
  const b = await page.locator('.splash-b').evaluate((el) => ({ bg: getComputedStyle(el).backgroundColor, op: getComputedStyle(el).opacity }));
  expect(b.bg).toBe('rgb(0, 0, 0)');
  expect(Number(b.op)).toBeGreaterThan(0.95);
  await expect(page.locator('.splash-b img')).toBeVisible();
  // Gone by 2.7s at the latest, and the page is usable.
  await expect(splash).toHaveCount(0, { timeout: 2000 });
  await expect(page.locator('html')).toHaveClass(/splash-done/);
  await expect(page.locator('h1')).toBeVisible();
});

test('splash runs once per session and never under reduced motion', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/?splash=1');
  await expect(page.locator('html')).not.toHaveClass(/splash-on/);
  await ctx.close();
});

test('a tap skips the splash', async ({ page }) => {
  await page.goto('/?splash=1', { waitUntil: 'commit' });
  await expect(page.locator('#splash')).toBeVisible();
  await page.locator('#splash').click({ force: true });
  await expect(page.locator('#splash')).toHaveCount(0);
});
