import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

// Terrell (Nov 18, 2026): every TK Hub or product contact on this site is support@tkhub.app; never a personal
// Gmail in a product or support field. Terrell's own résumé contact (hero, contact, dock) is guarded by contact.spec.

test('footer offers TK Hub product support at support@tkhub.app', async ({ page }) => {
  await open(page);
  const link = page.locator('.site-footer .footer-support a');
  await expect(link).toHaveAttribute('href', 'mailto:support@tkhub.app');
  await expect(link).toHaveText('support@tkhub.app');
  await link.scrollIntoViewIfNeeded();
  await expect(link).toBeVisible();
});

test('no personal Gmail in any TK Hub or product area (products, studio, footer)', async ({ page }) => {
  await open(page);
  for (const sel of ['#products', '.site-footer']) {
    const html = await page.locator(sel).first().evaluate((e) => e.outerHTML);
    expect(html, sel).not.toMatch(/gmail\.com/i);
  }
});

test('structured data: TK Hub LLC lists support@tkhub.app as its support contact', async ({ page }) => {
  await open(page);
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  const hub = ld.worksFor.find((o) => o.name === 'TK Hub LLC');
  expect(hub.contactPoint.email).toBe('support@tkhub.app');
  expect(JSON.stringify(hub)).not.toMatch(/gmail\.com/i);
});

test('privacy page sends product questions to support@tkhub.app and is hosted on this site', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.locator('main a[href="mailto:support@tkhub.app"]')).toHaveCount(1);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://terrellfrancis.app/privacy/');
});
