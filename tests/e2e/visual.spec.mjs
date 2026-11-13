import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

// Visual regression at phone and desktop widths. Baselines live in e2e/__screenshots__.
const settle = async (page) => {
  await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}.reveal{opacity:1!important;transform:none!important}.tl-progress,.scroll-progress,.dock,.back-to-top{visibility:hidden!important}.site-header{position:static!important}' });
  await page.evaluate(() => document.querySelectorAll('.metric-num').forEach((n) => { if (n.getAttribute('aria-label')) n.textContent = n.getAttribute('aria-label'); }));
};

test('hero (above the fold)', async ({ page }) => {
  await open(page);
  await settle(page);
  await expect(page).toHaveScreenshot('hero.png');
});

for (const id of ['experience', 'work', 'products', 'contact']) {
  test(`section: ${id}`, async ({ page }) => {
    await open(page);
    await settle(page);
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toHaveScreenshot(`${id}.png`);
  });
}

test('footer', async ({ page }) => {
  await open(page);
  await settle(page);
  await expect(page.locator('.site-footer')).toHaveScreenshot('footer.png');
});
