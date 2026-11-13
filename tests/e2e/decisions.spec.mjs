import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

// Terrell, Nov 13 2026, 1:05 PM CT: NO on removing or changing the link-preview image, the four app
// marks, RADR wording, the TORQ studio panel and About's second paragraph (add-only rule).
// These checks fail if a later change quietly undoes that decision.

test('link-preview image stays the live one', async ({ page }) => {
  await open(page);
  for (const sel of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
    await expect(page.locator(sel)).toHaveAttribute('content', 'https://terrellfrancis.app/assets/og-image.png');
  }
  await expect(page.locator('meta[property="og:image:alt"]'))
    .toHaveAttribute('content', 'Terrell Francis, technology, operations and implementation leader');
});

test('the four app marks keep their current files', async ({ page }) => {
  await open(page);
  for (const app of ['role', 'radr', 'noir', 'wrace']) {
    const n = await page.locator(`img[src="assets/apps/${app}.png"]`).count();
    expect(n, app).toBeGreaterThan(0);
  }
});

test('RADR description keeps its wording', async ({ page }) => {
  await open(page);
  await expect(page.locator('.studio-panel.panel-radr')).toContainText('a live map of police, radar, cameras, and hazards');
});

test('TORQ studio panel and picker are on the page', async ({ page }) => {
  await open(page);
  await expect(page.locator('.studio-panel.panel-wrace h3')).toHaveText('TORQ');
  await page.locator('label.studio-pick:has(#app-wrace)').click();
  await expect(page.locator('#app-wrace')).toBeChecked();
  await expect(page.locator('.studio-panel.panel-wrace')).toBeVisible();
});

test("About's second paragraph is on the page", async ({ page }) => {
  await open(page);
  await expect(page.locator('#about')).toContainText("Now I'm Director of Technology Development & Operations at Talencia");
});
