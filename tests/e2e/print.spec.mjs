import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

// Printing (or "Save as PDF") must keep every case study: on screen they are tabs, on paper all four print.
test('print: all four case studies print, fully visible, and the case tabs are not clipped', async ({ page }) => {
  await open(page);
  await page.emulateMedia({ media: 'print' });
  const cases = page.locator('.chapter-panels .case');
  expect(await cases.count()).toBe(4);
  for (const s of await cases.evaluateAll((els) => els.map((e) => {
    const cs = getComputedStyle(e);
    return { id: e.id, display: cs.display, opacity: cs.opacity, animation: cs.animationName, h: e.getBoundingClientRect().height };
  }))) {
    expect(s.display, s.id).not.toBe('none');
    expect(s.opacity, s.id).toBe('1');
    expect(s.animation, s.id).toBe('none');
    expect(s.h, s.id).toBeGreaterThan(100);
  }
  const nav = await page.locator('.chapter-nav').evaluate((n) => ({ sw: n.scrollWidth, cw: n.clientWidth }));
  expect(nav.sw).toBeLessThanOrEqual(nav.cw + 1);
});

test('print does not change the screen: one case study at a time', async ({ page }) => {
  await open(page);
  const shown = await page.locator('.chapter-panels .case').evaluateAll((els) => els.filter((e) => getComputedStyle(e).display !== 'none').length);
  expect(shown).toBe(1);
});
