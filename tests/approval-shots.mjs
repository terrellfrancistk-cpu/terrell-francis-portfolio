// Screenshots for BUILD_FOR_APPROVAL: the new build alone, plus live-vs-new pairs. Run by approval-preview.sh.
import { chromium, devices } from '@playwright/test';
const [out, live, next] = process.argv.slice(2);
const settle = '*,*::before,*::after{transition:none!important}.reveal,.phase-anim li{opacity:1!important;transform:none!important}';
const b = await chromium.launch();
const desk = { viewport: { width: 1440, height: 900 } }; const phone = devices['iPhone 13'];
async function shot(base, ctxOpts, path, file, opts = {}) {
  const ctx = await b.newContext(ctxOpts); const p = await ctx.newPage();
  await p.goto(base + path); await p.addStyleTag({ content: settle }); await p.evaluate(() => document.fonts.ready);
  if (opts.scrollAll) { await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); } window.scrollTo(0, 0); }); }
  await p.waitForTimeout(opts.wait ?? 600);
  if (opts.selector === '#products' && await p.locator('#studio-frame').count()) {
    await p.locator('#studio-frame').scrollIntoViewIfNeeded();
    await p.waitForFunction(() => { const s = document.querySelector('.phone-screen'); return !s || !s.classList.contains('loading'); }, null, { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(1500);
  }
  // Fixed overlays (progress bar, header, floating buttons) would be painted across element shots; hide them there only.
  if (opts.selector) await p.addStyleTag({ content: '.scroll-progress,.back-to-top,.dock,.mail-toast{visibility:hidden!important}.site-header{position:static!important}' });
  if (opts.selector) await p.locator(opts.selector).screenshot({ path: `${out}/${file}`, type: 'jpeg', quality: 84 });
  else await p.screenshot({ path: `${out}/${file}`, fullPage: !!opts.full, type: 'jpeg', quality: opts.full ? 80 : 86 });
  await ctx.close();
}
for (const scheme of ['light', 'dark']) {
  await shot(next, { ...desk, deviceScaleFactor: 1, colorScheme: scheme }, '/', `new-desktop-${scheme}-full.jpg`, { full: true, scrollAll: true, wait: 2500 });
  await shot(next, { ...phone, deviceScaleFactor: 1, colorScheme: scheme }, '/', `new-phone-${scheme}-full.jpg`, { full: true, scrollAll: true, wait: 2500 });
}
await shot(next, { ...desk, deviceScaleFactor: 2 }, '/', 'new-desktop-first-screen@2x.jpg', { wait: 1800 });
await shot(next, { ...phone }, '/', 'new-phone-first-screen@3x.jpg', { wait: 1800 });
// Same view, live vs new, for each place the build changes something.
for (const [name, sel, opts] of [['first-screen', null, {}], ['products', '#products', { scrollAll: true, wait: 3000 }], ['footer', '.site-footer', {}]]) {
  await shot(live, { ...desk, deviceScaleFactor: 2 }, '/', `compare-${name}-LIVE.jpg`, { selector: sel, ...opts });
  await shot(next, { ...desk, deviceScaleFactor: 2 }, '/', `compare-${name}-NEW.jpg`, { selector: sel, ...opts });
}
await shot(live, { ...phone }, '/', 'compare-phone-icons-LIVE.jpg', { selector: '.app-grid', scrollAll: true });
await shot(next, { ...phone }, '/', 'compare-phone-icons-NEW.jpg', { selector: '.app-grid', scrollAll: true });
// Splash, privacy, 404 (new build).
{ const ctx = await b.newContext({ ...phone, deviceScaleFactor: 1 }); const p = await ctx.newPage();
  await p.goto(next + '/?splash=1', { waitUntil: 'commit' }); await p.waitForTimeout(350); await p.screenshot({ path: `${out}/new-splash-1-tf-mark.jpg`, type: 'jpeg', quality: 86 });
  await p.waitForTimeout(950); await p.screenshot({ path: `${out}/new-splash-2-tk-hub.jpg`, type: 'jpeg', quality: 86 }); await ctx.close(); }
await shot(next, { ...phone, deviceScaleFactor: 1 }, '/privacy/', 'new-privacy-phone-full.jpg', { full: true });
await shot(next, { ...desk, deviceScaleFactor: 1 }, '/old-link', 'new-404-desktop.jpg', {});
await b.close();
