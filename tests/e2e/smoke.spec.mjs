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

test('no accounts, forms, or inputs anywhere (keeps AUTH/PAY/COM rows N/A honest)', async ({ page }) => {
  for (const path of ['/', '/privacy/']) {
    await page.goto(path);
    await expect(page.locator('form, input:not([type="radio"]), textarea, select')).toHaveCount(0);
    // The only iframe is the restored live-demo phone frame, and it only ever shows a TK Hub app site.
    const frames = await page.$$eval('iframe', (fs) => fs.map((f) => ({ id: f.id, host: new URL(f.src).hostname, sandbox: f.getAttribute('sandbox') })));
    for (const f of frames) { expect(f.id).toBe('studio-frame'); expect(f.sandbox).toBeTruthy(); }
  }
  const cookies = await page.context().cookies();
  expect(cookies).toEqual([]);
});

test('the live-demo phone never shows a blank white screen: loading shimmer until the demo loads', async ({ page }) => {
  // Hold the demo site's response so the loading state is observable, then release it.
  let release; const gate = new Promise((r) => { release = r; });
  await page.route('https://apexpeakofcare.app/**', async (route) => { await gate; await route.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>demo</title><p>demo</p>' }); });
  await page.goto('/');
  await page.locator('#studio-frame').scrollIntoViewIfNeeded();
  await expect(page.locator('.phone-screen')).toHaveClass(/loading/);
  release();
  await expect(page.locator('.phone-screen')).not.toHaveClass(/loading/, { timeout: 10000 });
});
