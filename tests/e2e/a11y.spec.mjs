import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { open } from './helpers.mjs';

test('axe: no WCAG 2.1 A/AA violations on the full page', async ({ page }) => {
  await open(page);
  // Reveal everything so axe checks final colors, not mid-animation ones.
  await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important;transition:none!important}' });
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
  const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.length} → ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`);
  expect(summary).toEqual([]);
});

test('axe best-practice rules: no serious issues', async ({ page }) => {
  await open(page);
  await page.addStyleTag({ content: '.reveal{opacity:1!important;transform:none!important;transition:none!important}' });
  const results = await new AxeBuilder({ page }).withTags(['best-practice']).analyze();
  const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => `${v.id}: ${v.nodes.length}`);
  expect(serious).toEqual([]);
});

test('keyboard: case-study tabs move with arrow keys and keep one panel visible', async ({ page }) => {
  await open(page);
  const first = page.locator('#tab-playbook');
  await first.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#tab-portfolio')).toBeFocused();
  await expect(page.locator('#tab-portfolio')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#case-portfolio')).toBeVisible();
  await expect(page.locator('#case-playbook')).toBeHidden();
  await page.keyboard.press('End');
  await expect(page.locator('#tab-handoff')).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.locator('#tab-playbook')).toBeFocused();
});

test('touch targets: every visible control in the primary flow is at least 44px tall on phones', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone rule');
  await open(page);
  const small = await page.$$eval('a.btn, button, .nav-toggle, .chapter-tab, .app-tile, .contact-links a, .footer-nav a, .to-top, .hero-meta a, .contact-email, .contact-phone, a.brand, .footer-logo, .now-card', (els) => els
    .filter((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width > 0 && s.visibility !== 'hidden' && s.display !== 'none'; })
    .map((e) => ({ t: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 30), h: Math.round(e.getBoundingClientRect().height) }))
    .filter((x) => x.h < 44));
  expect(small).toEqual([]);
});

test('no horizontal scroll at phone width', async ({ page }) => {
  await open(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});
