import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { watch } from './helpers.mjs';

for (const scheme of ['light', 'dark']) {
  test(`privacy & terms renders, links home, axe clean (${scheme})`, async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: scheme });
    const page = await ctx.newPage();
    const problems = watch(page);
    const res = await page.goto('/privacy/');
    expect(res.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('collects nothing');
    await expect(page.getByRole('heading', { name: 'Terms of use' })).toBeVisible();
    await expect(page.locator('a.brand')).toHaveAttribute('href', '../');
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(r.violations.map((v) => v.id)).toEqual([]);
    expect(problems).toEqual([]);
    await ctx.close();
  });
}

test('the home footer links to privacy & terms', async ({ page }) => {
  await page.goto('/');
  await page.locator('.footer-legal a[href="privacy/"]').click();
  await expect(page).toHaveURL(/\/privacy\/$/);
});

test('unknown paths get the site 404 page with a way home', async ({ page }) => {
  const res = await page.goto('/some/old/link');
  expect(res.status()).toBe(404);
  await expect(page.locator('h1')).toContainText("isn't here");
  await expect(page.getByRole('link', { name: 'Go to terrellfrancis.app' })).toHaveAttribute('href', '/');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  // Styles and icons load from root-absolute paths at any depth.
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector('.site-footer')).backgroundColor);
  expect(bg).not.toBe('rgba(0, 0, 0, 0)');
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations.map((v) => v.id)).toEqual([]);
});

test('the page loads nothing from third parties (privacy claim)', async ({ page }) => {
  const foreign = [];
  page.on('request', (r) => { const u = new URL(r.url()); if (!['127.0.0.1', 'localhost'].includes(u.hostname) && !u.protocol.startsWith('data')) foreign.push(r.url()); });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.mouse.wheel(0, 20000);
  await page.waitForTimeout(500);
  expect(foreign).toEqual([]);
});

test('robots.txt and sitemap.xml are served and list only public pages', async ({ request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap: https://terrellfrancis.app/sitemap.xml');
  const sm = await request.get('/sitemap.xml');
  expect(sm.status()).toBe(200);
  const xml = await sm.text();
  expect(xml).toContain('<loc>https://terrellfrancis.app/</loc>');
  expect(xml).toContain('<loc>https://terrellfrancis.app/privacy/</loc>');
  expect(xml).not.toMatch(/docs|tests|handoff/i);
});
