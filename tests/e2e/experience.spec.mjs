import { test, expect } from '@playwright/test';
import { open } from './helpers.mjs';

// R4: on phones each role opens to three lines; the rest are one tap away. Desktop shows everything.
test('phone: long roles show three bullets and a Show more that reveals the rest', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone behaviour');
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

test('phone: headline metrics stay in the first three lines', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone behaviour');
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

test('phone: Show more labels name their role for screen readers, as text not markup', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'phone behaviour');
  // Serve the page with markup characters in the first role title (escaped in HTML, so they are text).
  await page.route('**/', async (route) => {
    const res = await route.fetch();
    const body = (await res.text()).replace('<h3>Director of Technology Development &amp; Operations', '<h3>Director &lt;b&gt;X&lt;/b&gt; Operations');
    await route.fulfill({ response: res, body });
  });
  await open(page);
  const btn = page.locator('.tl-more').first();
  await expect(btn).toHaveAccessibleName(/^Show \d+ more for Director <b>X<\/b> Operations/);
  await expect(btn.locator('b')).toHaveCount(0);
  // The unmodified page reads normally too.
  await page.unroute('**/');
  await open(page);
  await expect(page.locator('.tl-more').first()).toHaveAccessibleName(/^Show \d+ more for Director of Technology Development & Operations$/);
});
