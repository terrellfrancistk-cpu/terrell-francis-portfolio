import { test, expect } from '@playwright/test';
import { createHash } from 'node:crypto';
import { open } from './helpers.mjs';

// Content-Security-Policy (meta tag; GitHub Pages cannot send headers). Scripts may only come from
// this site or the exact inline theme scripts below, so injected markup cannot run code.
const PAGES = ['/', '/privacy/', '/404.html', '/?splash=1'];

async function violations(page) {
  await page.addInitScript(() => {
    window.__csp = [];
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
}

for (const path of PAGES) {
  test(`CSP: ${path} has a policy and nothing on it is blocked`, async ({ page }) => {
    await violations(page);
    await open(page, path);
    const csp = await page.locator('meta[http-equiv="Content-Security-Policy"]').getAttribute('content');
    expect(csp).toContain("script-src 'self'");
    expect(csp).toContain("object-src 'none'");
    // Every inline script on the page is allowed by its exact hash (edit one, update its hash).
    const inline = await page.locator('script:not([src]):not([type])').evaluateAll((s) => s.map((x) => x.textContent));
    for (const code of inline) {
      const h = createHash('sha256').update(code).digest('base64');
      expect(csp, 'inline script hash missing from CSP').toContain(`'sha256-${h}'`);
    }
    await page.waitForTimeout(path.includes('splash') ? 3000 : 300);
    expect(await page.evaluate(() => window.__csp)).toEqual([]);
  });
}

test('CSP: theme switch, studio picks and case tabs run with no violations', async ({ page }) => {
  await violations(page);
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (r) => r.abort());
  await open(page);
  for (const id of ['app-curb', 'app-wrace', 'app-apex']) await page.locator(`label.studio-pick:has(#${id})`).click();
  const theme = page.locator('[data-theme-set="dark"]');
  if (await theme.count()) await theme.first().click();
  const tab = page.locator('[role="tab"]');
  if (await tab.count() > 1) await tab.nth(1).click();
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.__csp)).toEqual([]);
});
