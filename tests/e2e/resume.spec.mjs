import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

test('resume link serves a real PDF', async ({ request }) => {
  const r = await request.get('/assets/Terrell_Francis_Resume.pdf');
  expect(r.status()).toBe(200);
  expect(r.headers()['content-type']).toContain('pdf');
  const body = await r.body();
  expect(body.subarray(0, 5).toString()).toBe('%PDF-');
  expect(body.length).toBeGreaterThan(20_000);
});

test('clicking Download resume downloads the PDF', async ({ page, isMobile }) => {
  await open(page);
  const link = page.locator('.hero a[download]').first();
  await expect(link).toBeVisible();
  const [dl] = await Promise.all([page.waitForEvent('download'), link.click()]);
  expect(dl.suggestedFilename()).toMatch(/Terrell_Francis_Resume\.pdf$/);
});
