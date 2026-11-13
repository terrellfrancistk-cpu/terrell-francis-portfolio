import { test, expect } from '@playwright/test';
import { watch, open } from './helpers.mjs';

test('home loads clean: 200, title, h1, no console errors or failed requests', async ({ page }) => {
  const problems = watch(page);
  const res = await page.goto('/', { waitUntil: 'load' });
  expect(res.status()).toBe(200);
  await expect(page).toHaveTitle(/Terrell Francis/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText('Terrell');
  await page.mouse.wheel(0, 20000);
  await page.waitForTimeout(400);
  expect(problems).toEqual([]);
});

test('exactly one main landmark and the skip link targets it', async ({ page }) => {
  await open(page);
  await expect(page.locator('main#main')).toHaveCount(1);
  await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#main');
});

test('no builder hostnames, no salary, no confidential markers in the page', async ({ page }) => {
  await open(page);
  const html = await page.content();
  expect(html).not.toMatch(/rork\.(app|live|work|com)/i);
  expect(html).not.toMatch(/salary|\$\s?\d{2,3},\d{3}|per year|\/yr\b/i);
});

test('the internal handoff folders are never linked from the page', async ({ page }) => {
  await open(page);
  const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.getAttribute('href')));
  for (const h of hrefs) expect(h).not.toMatch(/^\/?(docs|tests)\//);
});
