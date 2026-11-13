import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

test('every in-page anchor points at an element that exists', async ({ page }) => {
  await open(page);
  const missing = await page.$$eval('a[href^="#"]', (as) => as
    .map((a) => a.getAttribute('href'))
    .filter((h) => h.length > 1 && !document.getElementById(h.slice(1))));
  expect(missing).toEqual([]);
});

test('every local asset referenced by the page returns 200', async ({ page, request }) => {
  await open(page);
  const urls = await page.evaluate(() => {
    const out = new Set();
    document.querySelectorAll('[src],[href]').forEach((el) => {
      const v = el.getAttribute('src') || el.getAttribute('href');
      if (!v || v.startsWith('#') || v.startsWith('mailto:') || v.startsWith('tel:')) return;
      const u = new URL(v, location.href);
      if (u.origin === location.origin) out.add(u.pathname);
    });
    document.querySelectorAll('meta[property="og:image"],meta[name="twitter:image"]').forEach((m) => {
      out.add(new URL(m.content).pathname);
    });
    return [...out];
  });
  expect(urls.length).toBeGreaterThan(5);
  for (const u of urls) {
    const r = await request.get(u);
    expect(r.status(), u).toBe(200);
  }
});

test('external links open safely in a new tab and announce it', async ({ page }) => {
  await open(page);
  const bad = await page.$$eval('a[href^="http"]', (as) => as
    .filter((a) => a.target !== '_blank' || !/noopener/.test(a.rel) || !/new tab/i.test(a.textContent + (a.getAttribute('aria-label') || '')))
    .map((a) => a.href));
  expect(bad).toEqual([]);
});

test('mailto and tel links are well formed', async ({ page }) => {
  await open(page);
  const mail = await page.$$eval('a[href^="mailto:"]', (as) => as.map((a) => a.getAttribute('href')));
  const tel = await page.$$eval('a[href^="tel:"]', (as) => as.map((a) => a.getAttribute('href')));
  for (const m of mail) expect(m).toMatch(/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}(\?.*)?$/i);
  for (const t of tel) expect(t).toMatch(/^tel:\+\d{11}$/);
});

test('deep links: /#case-golive opens that case study on load', async ({ page }) => {
  await page.goto('/#case-golive');
  await expect(page.locator('#tab-golive')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#case-golive')).toBeVisible();
  await expect(page.locator('#case-playbook')).toBeHidden();
});

test('deep links: every section id in the nav works from a cold load', async ({ page }) => {
  for (const id of ['experience', 'work', 'products', 'contact', 'education', 'skills']) {
    await page.goto('about:blank');
    await page.goto(`/#${id}`);
    await expect(page.locator(`#${id}`)).toBeInViewport({ ratio: 0.01 });
  }
});
