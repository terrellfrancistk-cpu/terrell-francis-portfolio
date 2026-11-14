import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

// R5: every skill group links to the role or case study that proves it.
test('each skill group has at least one proof link that resolves', async ({ page }) => {
  await open(page);
  const groups = page.locator('.toolkit > li');
  const n = await groups.count();
  expect(n).toBe(5);
  for (let i = 0; i < n; i++) {
    const links = groups.nth(i).locator('.proof a');
    expect(await links.count()).toBeGreaterThan(0);
    for (const href of await links.evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
      expect(await page.locator(href).count(), href).toBe(1);
    }
  }
});

test('a proof link to a case study opens that tab and scrolls to it', async ({ page }) => {
  await open(page);
  await page.locator('.toolkit .proof a[href="#case-golive"]').click();
  await expect(page.locator('#tab-golive')).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('#case-golive')).toBeVisible();
  await expect(page.locator('#case-golive')).toBeInViewport({ ratio: 0.1 });
  // Clicking a second proof switches again, even without a page reload.
  await page.locator('.toolkit .proof a[href="#case-handoff"]').click();
  await expect(page.locator('#tab-handoff')).toHaveAttribute('aria-selected', 'true');
});

test('the role proof link lands on the current role', async ({ page }) => {
  await open(page);
  await page.locator('.toolkit .proof a[href="#role-current"]').click();
  await expect(page.locator('#role-current')).toBeInViewport({ ratio: 0.1 });
});
