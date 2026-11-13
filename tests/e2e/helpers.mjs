// Shared helpers: collect console errors, page errors and failed same-origin requests.
export function watch(page) {
  const problems = [];
  page.on('console', (m) => { if (m.type() === 'error') problems.push(`console: ${m.text()}`); });
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => {
    if (sameOrigin(page, r.url())) problems.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`);
  });
  page.on('response', (r) => {
    if (sameOrigin(page, r.url()) && r.status() >= 400) problems.push(`http ${r.status()}: ${r.url()}`);
  });
  return problems;
}
export function sameOrigin(page, url) {
  try { return new URL(url).origin === new URL(page.url() || 'http://127.0.0.1:4173').origin; } catch { return false; }
}
// Load and settle: skip the once-per-session splash so content tests see the page.
export async function open(page, path = '/') {
  await page.goto(path, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts && document.fonts.ready);
}
