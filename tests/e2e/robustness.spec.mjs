import { test, expect } from '@playwright/test';

const reveal = '.reveal{transition:none!important}';

// Reflow (WCAG 1.4.10) and layout sanity from a 320 px phone to a 1920 px monitor.
for (const width of [320, 375, 768, 1024, 1440, 1920]) {
  test(`width ${width}: no horizontal scroll, one visible way to navigate`, async ({ browser }) => {
    test.skip(test.info().project.name !== 'desktop', 'width sweep runs once');
    const ctx = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const toggle = await page.locator('.nav-toggle').isVisible();
    const links = await page.locator('#nav-links a[href="#experience"]').isVisible();
    expect(toggle || links).toBe(true);
    // Nothing wider than the viewport inside main.
    // Elements inside a deliberate sideways scroller (the case-study tab row on phones) are allowed past the edge.
    const wide = await page.$$eval('main *', (els) => els.filter((e) => {
      if (e.getBoundingClientRect().right <= document.documentElement.clientWidth + 1 || getComputedStyle(e).position === 'fixed') return false;
      for (let a = e.parentElement; a && a !== document.body; a = a.parentElement) { if (/(auto|scroll)/.test(getComputedStyle(a).overflowX)) return false; }
      return true;
    }).map((e) => e.className || e.tagName).slice(0, 5));
    expect(wide).toEqual([]);
    await ctx.close();
  });
}

test('with JavaScript off, every section and all case studies are readable', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  for (const id of ['experience', 'work', 'products', 'contact']) await expect(page.locator(`#${id} h2`)).toBeVisible();
  for (const id of ['case-playbook', 'case-portfolio', 'case-golive', 'case-handoff']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id} h3`)).toBeVisible();
  }
  const faded = await page.$$eval('.reveal', (els) => els.filter((e) => Number(getComputedStyle(e).opacity) < 0.99).length);
  expect(faded).toBe(0);
  await expect(page.locator('#splash')).toBeHidden();
  await ctx.close();
});

test('keyboard: every focusable control shows a visible focus indicator', async ({ page }) => {
  await page.goto('/');
  await page.addStyleTag({ content: reveal });
  const count = await page.evaluate(() => document.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])').length);
  const missing = [];
  await page.keyboard.press('Tab');
  for (let i = 0; i < count + 5; i++) {
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      let ring = (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== 'none');
      // An iframe's focus can sit inside the embedded page; its visible ring is on the phone frame around it.
      if (!ring && el.tagName === 'IFRAME' && el.closest('.phone')) { const ph = el.closest('.phone'); const ps = getComputedStyle(ph); ring = ph.classList.contains('frame-focused') && ps.outlineStyle !== 'none' && parseFloat(ps.outlineWidth) > 0; }
      return { ring, label: (el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 40), visible: el.getClientRects().length > 0 };
    });
    if (info && info.visible && !info.ring) missing.push(info.label);
    await page.keyboard.press('Tab');
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
  }
  expect([...new Set(missing)]).toEqual([]);
});

test('forced colors (Windows high contrast): selected states stay visible', async ({ page }) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/');
  // A pressed theme button and the selected case-study tab must differ from their siblings by more than background color,
  // because forced colors replaces backgrounds.
  const differs = async (on, off) => page.evaluate(([a, b]) => {
    const p = (el) => { const s = getComputedStyle(el); return [s.outlineStyle, s.outlineWidth, s.borderTopStyle, s.borderTopWidth, s.textDecorationLine, s.fontWeight].join('|'); };
    return p(document.querySelector(a)) !== p(document.querySelector(b));
  }, [on, off]);
  expect(await differs('[data-theme-set="system"]', '[data-theme-set="light"]')).toBe(true);
  expect(await differs('#tab-playbook', '#tab-portfolio')).toBe(true);
});
