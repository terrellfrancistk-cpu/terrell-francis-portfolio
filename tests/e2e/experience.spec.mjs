import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

// Terrell's rule: nothing hidden without his approval. By default every bullet shows on every screen (as live).
// R4 (collapse on phones) only runs with the opt-in <html data-collapse-roles="on">, which nothing sets; the
// opt-in tests below keep that proposal working in case he approves it.
// Serves the page with the opt-in attribute on <html>; extra(body) can edit the HTML further.
const optIn = (page, extra = (b) => b) => page.route('**/', async (route) => {
  const res = await route.fetch();
  await route.fulfill({ response: res, body: extra((await res.text()).replace('<html lang="en">', '<html lang="en" data-collapse-roles="on">')) });
});

test('default: every bullet visible on every screen, no Show more buttons', async ({ page }) => {
  await open(page);
  const all = await page.locator('.tl-body > ul > li').count();
  expect(all).toBeGreaterThan(20);
  await expect(page.locator('.tl-body > ul > li:visible')).toHaveCount(all);
  await expect(page.locator('.tl-more')).toHaveCount(0);
});

test('opt-in (proposal): phone roles show three bullets and a Show more that reveals the rest', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone behaviour');
  await optIn(page);
  await open(page);
  const lists = page.locator('.tl-body > ul.tl-clamp');
  const n = await lists.count();
  expect(n).toBeGreaterThanOrEqual(3);
  for (let i = 0; i < n; i++) {
    const ul = lists.nth(i);
    const total = await ul.locator('> li').count();
    await expect(ul.locator('> li:visible')).toHaveCount(3);
    const btn = page.locator(`.tl-more[aria-controls="${await ul.getAttribute('id')}"]`);
    await expect(btn).toHaveAttribute('aria-expanded', 'false');
    await expect(btn).toContainText(`Show ${total - 3} more`);
    await btn.click();
    await expect(btn).toHaveAttribute('aria-expanded', 'true');
    await expect(ul.locator('> li:visible')).toHaveCount(total);
  }
});

test('opt-in (proposal): headline metrics stay in the first three lines', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone behaviour');
  await optIn(page);
  await open(page);
  const visible = await page.locator('.timeline > li li:visible').allTextContents();
  const text = visible.join(' ');
  for (const fact of ['85+ concurrent', '~85%', '700+', '~800-device']) expect(text).toContain(fact);
});

test('desktop: every bullet visible, no toggles', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop behaviour');
  await open(page);
  const all = await page.locator('.tl-body > ul > li').count();
  await expect(page.locator('.tl-body > ul > li:visible')).toHaveCount(all);
  await expect(page.locator('.tl-more:visible')).toHaveCount(0);
});

test('print shows every bullet on any width', async ({ page }) => {
  await open(page);
  await page.emulateMedia({ media: 'print' });
  const all = await page.locator('.tl-body > ul > li').count();
  await expect(page.locator('.tl-body > ul > li:visible')).toHaveCount(all);
});

test('opt-in (proposal): Show more labels name their role, as text not markup', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone behaviour');
  // Serve the page with markup characters in the first role title (escaped in HTML, so they are text).
  await optIn(page, (b) => b.replace('<h3>Director of Technology Development &amp; Operations', '<h3>Director &lt;b&gt;X&lt;/b&gt; Operations'));
  await open(page);
  const btn = page.locator('.tl-more').first();
  await expect(btn).toHaveAccessibleName(/^Show \d+ more for Director <b>X<\/b> Operations/);
  await expect(btn.locator('b')).toHaveCount(0);
  // The unmodified page reads normally too.
  await page.unroute('**/');
  await optIn(page);
  await open(page);
  await expect(page.locator('.tl-more').first()).toHaveAccessibleName(/^Show \d+ more for Director of Technology Development & Operations$/);
});
