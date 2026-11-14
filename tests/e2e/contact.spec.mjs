import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { open } from './helpers.mjs';

// Terrell, 2026-11-13: "Keep his email and phone exactly as they are."
// These tests fail if any of them, or the résumé PDF, ever changes or a link to them disappears.
// Values are compared by SHA-256 so this file holds no contact details in plain text.
const sha = (s) => createHash('sha256').update(s).digest('hex');
const KEEP = {
  email: 'd6372ae66a318b5e8de8b456dd0a3697018a5361c5374f896b334ccaa76ae0d0',
  tel: '6fb545b6baa62a4a0a9055088ff21115a92c3e95007f0151fbbf804ae440df1a',
  phoneText: '615fa4abdb86596e0e584e67e9034d48560ec341d1b8b640011b4861456904c2',
  ldEmail: '30acbe9c8e449d3e77a28b5835bb1550587686dd6495c015ff7d3d71cd2334c1',
  ldTel: '26c9af1712cc867417061c15e23e7ccb4e255ba8ba874e75df90c14b6bb1a4a8',
  resumePdf: '08a78dd1a0980ac17ff83bb8555746be24780c097cbe5402b1a443ed78cbcab9',
};

test('email: hero, contact and dock links all present and unchanged; shown address unchanged', async ({ page }) => {
  await open(page);
  const hrefs = await page.$$eval('a[href^="mailto:"]', (as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThanOrEqual(3);
  for (const h of hrefs) expect(sha(decodeURIComponent(h.slice(7).split('?')[0]))).toBe(KEEP.email);
  for (const where of ['.hero', '.contact', '.dock']) await expect(page.locator(`${where} a[href^="mailto:"]`)).toHaveCount(1);
  const shown = (await page.locator('.contact-email').textContent()).replace(/\s|​/g, '');
  expect(sha(shown)).toBe(KEEP.email);
});

test('phone: contact and dock links present and unchanged; shown number unchanged', async ({ page }) => {
  await open(page);
  const hrefs = await page.$$eval('a[href^="tel:"]', (as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs.length).toBeGreaterThanOrEqual(2);
  for (const h of hrefs) expect(sha(h.slice(4))).toBe(KEEP.tel);
  for (const where of ['.contact', '.dock']) await expect(page.locator(`${where} a[href^="tel:"]`)).toHaveCount(1);
  expect(sha((await page.locator('.contact-phone').textContent()).trim())).toBe(KEEP.phoneText);
});

test('structured data keeps the same email and phone', async ({ page }) => {
  await open(page);
  const ld = JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());
  expect(sha(ld.email)).toBe(KEEP.ldEmail);
  expect(sha(ld.telephone)).toBe(KEEP.ldTel);
});

test('résumé PDF is byte-for-byte the one Terrell published', async ({ request }) => {
  const r = await request.get('/assets/Terrell_Francis_Resume.pdf');
  expect(r.status()).toBe(200);
  expect(sha(await r.body())).toBe(KEEP.resumePdf);
});
