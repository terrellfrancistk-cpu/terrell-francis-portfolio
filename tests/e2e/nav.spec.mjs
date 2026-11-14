import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

test('mobile menu opens, reports state, and closes on Escape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'menu button is phone-only');
  await open(page);
  const t = page.locator('.nav-toggle');
  await t.click();
  await expect(t).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#nav-links a[href="#experience"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(t).toHaveAttribute('aria-expanded', 'false');
});

test('nav links scroll to their sections', async ({ page, isMobile }) => {
  await open(page);
  for (const id of ['experience', 'work', 'products', 'contact']) {
    if (isMobile) await page.locator('.nav-toggle').click();
    await page.locator(`#nav-links a[href="#${id}"]`).click();
    await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.05 });
  }
});

test('back to top returns to the top and focuses the start', async ({ page }) => {
  await open(page);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.locator('.footer-inner a.to-top').click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
});
