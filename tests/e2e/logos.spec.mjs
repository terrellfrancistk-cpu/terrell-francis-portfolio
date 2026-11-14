import { test, expect } from '@playwright/test';

// Terrell, Nov 13 10:01 PM CT: the real logo everywhere, sharp. TF mark = this site's logo (vector in the header,
// splash and SVG favicon); square PNG icons are rendered from that vector (never upscaled); manifest icons 192/512.
const PAGES = [['/', ''], ['/privacy/', '../'], ['/404.html', '/']];

for (const [path] of PAGES) {
  test(`icons on ${path}: SVG favicon, 32 px, apple-touch 180 px, manifest`, async ({ page, request }) => {
    await page.goto(path);
    const hrefs = await page.evaluate(() => Object.fromEntries(
      ['link[rel="icon"][type="image/svg+xml"]', 'link[rel="icon"][sizes="32x32"]', 'link[rel="apple-touch-icon"]', 'link[rel="manifest"]']
        .map((s) => [s, document.querySelector(s)?.href])));
    for (const [sel, href] of Object.entries(hrefs)) {
      expect(href, sel).toBeTruthy();
      expect((await request.get(href)).status(), href).toBe(200);
    }
    expect(hrefs['link[rel="apple-touch-icon"]']).toContain('apple-touch-icon-180.png');
  });
}

test('manifest lists sharp square icons (192, 512, maskable 512) that load at their stated size', async ({ page, request }) => {
  const m = await (await request.get('/site.webmanifest')).json();
  expect(m.name).toBe('Terrell Francis');
  const sizes = m.icons.map((i) => i.sizes);
  expect(sizes).toEqual(expect.arrayContaining(['192x192', '512x512']));
  expect(m.icons.some((i) => i.purpose === 'maskable')).toBe(true);
  await page.goto('/');
  for (const icon of m.icons) {
    const dim = await page.evaluate(async (src) => { const i = new Image(); i.src = src; await i.decode(); return `${i.naturalWidth}x${i.naturalHeight}`; }, '/' + icon.src);
    expect(dim, icon.src).toBe(icon.sizes);
  }
});

test('square icons have no white bands (logo fills a navy square edge to edge)', async ({ page }) => {
  await page.goto('/');
  for (const src of ['/assets/icons/apple-touch-icon-180.png', '/assets/icons/favicon-32.png', '/assets/icons/icon-512.png']) {
    const corners = await page.evaluate(async (s) => {
      const i = new Image(); i.src = s; await i.decode();
      const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight;
      const x = c.getContext('2d'); x.drawImage(i, 0, 0);
      const px = (a, b) => [...x.getImageData(a, b, 1, 1).data].slice(0, 3).join(',');
      return [px(0, 0), px(c.width >> 1, 0), px(c.width - 1, c.height - 1), px(c.width >> 1, c.height - 1)];
    }, src);
    for (const p of corners) expect(p, src).toBe('14,34,56');
  }
});

test('root favicon.ico exists for clients that ask for it by name', async ({ request }) => {
  const r = await request.get('/favicon.ico');
  expect(r.status()).toBe(200);
});

// Terrell, Nov 14: the TK Hub logo master (vector rebuild, same look) replaces the 300 px-derived raster everywhere.
test('TK Hub logo (splash "by TK Hub" and footer) is the vector master, sharp at any size', async ({ request }) => {
  const html = await (await request.get('/')).text();
  const srcs = [...html.matchAll(/<img[^>]+src="([^"]*tkhub-logo[^"]*)"/g)].map((m) => m[1]);
  expect(srcs.length).toBeGreaterThanOrEqual(2);
  for (const s of srcs) expect(s).toMatch(/assets\/brand\/tkhub-logo-badge\.svg$/);
  const svg = await (await request.get('/assets/brand/tkhub-logo-badge.svg')).text();
  expect(svg).toContain('#00CBF6');
  expect(svg).not.toContain('<image'); // pure vector, no embedded raster
});

test('privacy page link preview shows the real logo image too', async ({ page }) => {
  await page.goto('/privacy/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://terrellfrancis.app/assets/og-image-logo.png');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Privacy & terms · Terrell Francis');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
});
