import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

// Design grade pass (2026-11-18): alignment rules that must keep holding.

test('phone: the implementation strip keeps the page gutter (first card not flush to the screen edge)', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) > 720, 'phone layout only');
  await open(page);
  const gutter = await page.locator('.hero h1').evaluate((e) => Math.round(e.getBoundingClientRect().left));
  const first = await page.locator('.phase-list li').first().evaluate((e) => Math.round(e.getBoundingClientRect().left));
  expect(first).toBe(gutter);
});

test('desktop: the app picker is two even rows of five, all ten apps visible', async ({ page }) => {
  test.skip((page.viewportSize()?.width ?? 0) < 961, 'desktop layout only');
  await open(page);
  const tops = await page.locator('.studio-index .studio-pick').evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
  expect(tops).toHaveLength(10);
  const rows = [...new Set(tops)];
  expect(rows).toHaveLength(2);
  expect(tops.filter((t) => t === rows[0])).toHaveLength(5);
  expect(tops.filter((t) => t === rows[1])).toHaveLength(5);
});
