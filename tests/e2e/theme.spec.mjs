import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { open } from './helpers.mjs';

const reveal = '.reveal{opacity:1!important;transform:none!important;transition:none!important}';

test('System is the default and follows the device (light)', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'light' });
  const page = await ctx.newPage();
  await open(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await expect(page.locator('[data-theme-set="system"]')).toHaveAttribute('aria-pressed', 'true');
  await ctx.close();
});

test('System follows the device (dark), and live changes', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await open(page);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  await ctx.close();
});

test('choosing Dark persists across reloads; choosing System clears it', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'light' });
  const page = await ctx.newPage();
  await open(page);
  await page.locator('[data-theme-set="dark"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('[data-theme-set="dark"]')).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  // Theme does not change when the device changes while a manual choice is set.
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.locator('[data-theme-set="system"]').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(() => localStorage.getItem('tf-theme'))).toBeNull();
  await ctx.close();
});

test('dark theme: axe WCAG 2.1 AA clean, and body background is dark', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await open(page);
  await page.addStyleTag({ content: reveal });
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(10, 20, 34)');
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([]);
  await ctx.close();
});

test('no flash: data-theme is set before the stylesheet paints', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await page.goto('/', { waitUntil: 'commit' });
  await page.waitForSelector('body');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await ctx.close();
});

test('dark theme: every button and link keeps readable contrast against its own background', async ({ browser }) => {
  const ctx = await browser.newContext({ colorScheme: 'dark' });
  const page = await ctx.newPage();
  await open(page);
  await page.addStyleTag({ content: reveal });
  // Element-level check axe can miss when a background comes from the element itself.
  const bad = await page.$$eval('a.btn, button', (els) => {
    const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
    return els.filter((e) => e.getClientRects().length).map((e) => {
      const s = getComputedStyle(e);
      if (s.backgroundColor === 'rgba(0, 0, 0, 0)' || /, 0\)$/.test(s.backgroundColor)) return null;
      if (/rgba\(.*, 0?\.\d+\)$/.test(s.backgroundColor)) return null; // translucent: axe covers it
      const a = lum(s.color), b = lum(s.backgroundColor);
      const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      return ratio < 4.5 ? `${e.textContent.trim().slice(0, 30)}: ${ratio.toFixed(2)}` : null;
    }).filter(Boolean);
  });
  expect(bad).toEqual([]);
  await ctx.close();
});
