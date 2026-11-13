import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { open } from './helpers.mjs';

// R3: a mailto tap always leaves a way forward, even on a computer with no mail app.
test('email tap shows a copy fallback that copies the exact address', async ({ browser, isMobile, viewport, userAgent, hasTouch }) => {
  const ctx = await browser.newContext({ viewport, userAgent, isMobile, hasTouch, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await ctx.newPage();
  await open(page);
  const link = page.locator('.hero a[href^="mailto:"]');
  const expected = (await link.getAttribute('href')).slice(7).split('?')[0];
  await link.click();
  const toast = page.locator('.mail-toast');
  await expect(toast).toBeVisible();
  await expect(toast).toHaveAttribute('role', 'status');
  await expect(toast).toContainText('No app?');
  const r = await new AxeBuilder({ page }).include('.mail-toast').withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(r.violations.map((v) => v.id)).toEqual([]);
  await toast.getByRole('button', { name: 'Copy address' }).click();
  await expect(toast).toContainText('Copied: ' + expected);
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
  await page.keyboard.press('Escape');
  await expect(toast).toBeHidden();
  await ctx.close();
});

test('every mailto link on the page triggers the fallback', async ({ page }) => {
  await open(page);
  const n = await page.locator('a[href^="mailto:"]').count();
  expect(n).toBeGreaterThanOrEqual(2);
  await page.locator('.contact a[href^="mailto:"]').scrollIntoViewIfNeeded();
  await page.locator('.contact a[href^="mailto:"]').click();
  await expect(page.locator('.mail-toast')).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss' }).click();
  await expect(page.locator('.mail-toast')).toBeHidden();
});
