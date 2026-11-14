(() => {
  // Splash: remove from the DOM as soon as the page is ready, or on tap/key; never block the page past ~2.5s.
  const splash = document.getElementById('splash');
  if (splash) {
    const html = document.documentElement;
    const done = () => { if (!splash.isConnected) return; splash.remove(); html.classList.remove('splash-on'); html.classList.add('splash-done'); };
    if (html.classList.contains('splash-on')) {
      splash.addEventListener('animationend', (e) => { if (e.animationName === 'splashOut') done(); });
      splash.addEventListener('click', done);
      document.addEventListener('keydown', done, { once: true });
      // Only while loading (Terrell, Nov 13 10:01 PM CT): leave as soon as the page is ready (DOM parsed, fonts in).
      // No minimum time. A quick fade, then gone. The timer below is only a safety net if the fonts never settle.
      const leave = () => { if (!splash.isConnected || splash.classList.contains('is-leaving')) return; splash.classList.add('is-leaving'); setTimeout(done, 160); };
      const domReady = new Promise((r) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', r, { once: true }) : r()));
      Promise.all([domReady, document.fonts ? document.fonts.ready : Promise.resolve()]).then(leave, leave);
      setTimeout(done, 2600);
    } else done();
  }

  // Theme switch: System (default, follows the device), Light, Dark. The choice is remembered on this device only.
  const themeButtons = [...document.querySelectorAll('[data-theme-set]')];
  const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
  const applyTheme = (pref) => {
    const html = document.documentElement;
    const dark = pref === 'dark' || (pref === 'system' && darkMQ.matches);
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    html.setAttribute('data-theme-pref', pref);
    themeButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeSet === pref)));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0A1422' : '#0E2238');
  };
  applyTheme(document.documentElement.getAttribute('data-theme-pref') || 'system');
  themeButtons.forEach((b) => b.addEventListener('click', () => {
    const pref = b.dataset.themeSet;
    try { if (pref === 'system') localStorage.removeItem('tf-theme'); else localStorage.setItem('tf-theme', pref); } catch (e) {}
    applyTheme(pref);
  }));
  const onSystemChange = () => { if ((document.documentElement.getAttribute('data-theme-pref') || 'system') === 'system') applyTheme('system'); };
  if (darkMQ.addEventListener) darkMQ.addEventListener('change', onSystemChange); else if (darkMQ.addListener) darkMQ.addListener(onSystemChange);

  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toTopBtn = document.querySelector('.back-to-top');
  const topAnchor = document.getElementById('top');

  // Sticky header shadow + floating back-to-top visibility
  const dock = document.querySelector('.dock');
  let contactInView = false;
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
    if (toTopBtn) toTopBtn.classList.toggle('show', window.scrollY > 600 && !footerInView);
    if (dock) dock.classList.toggle('show', window.scrollY > 520 && !contactInView && !footerInView);
  };
  const contact = document.getElementById('contact');
  if (contact && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { contactInView = entry.isIntersecting; onScroll(); }).observe(contact);
  }
  // The footer has its own "Back to top" link, so the floating button steps aside there.
  let footerInView = false;
  const footer = document.querySelector('.site-footer');
  if (footer && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { footerInView = entry.isIntersecting; onScroll(); }).observe(footer);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  const closeMenu = () => { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', (e) => { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Back to top: scroll to the very top (the header is sticky, so it can't be the scroll target)
  // and move keyboard focus back to the start of the page.
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href="#top"]');
    if (!a) return;
    e.preventDefault();
    closeMenu();
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    if (topAnchor) topAnchor.focus({ preventScroll: true });
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  });

  // Reveal on scroll (staggered within groups)
  const items = document.querySelectorAll('.reveal');
  const groups = new Map();
  items.forEach((el) => {
    const parent = el.parentElement;
    const i = groups.get(parent) || 0;
    el.style.setProperty('--d', `${Math.min(i, 6) * 70}ms`);
    groups.set(parent, i + 1);
  });
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); io.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add('in'));
  }

  // Active nav link (based on scroll position; nothing highlighted while in the hero)
  const navAnchors = [...links.querySelectorAll('a[href^="#"]')];
  const targets = navAnchors.map((a) => [a, document.querySelector(a.getAttribute('href'))]).filter(([, s]) => s);
  let ticking = false;
  const spy = () => {
    ticking = false;
    const mark = window.innerHeight * 0.4;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let current = null;
    targets.forEach(([a, s]) => { if (s.getBoundingClientRect().top <= mark) current = a; });
    if (atBottom) current = targets[targets.length - 1][0];
    navAnchors.forEach((a) => {
      const on = a === current;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
  spy();

  // ---------- Motion & polish layer (2026-10 redesign) ----------
  const rm = reduceMotion.matches;

  // Staggered word reveal for the hero headline: only while the splash plays (the words land as it lifts). Without the
  // splash the name is simply there at first paint, which is also what makes it the page's measurable largest paint.
  const h1 = document.querySelector('.hero h1');
  if (h1 && !rm && document.documentElement.classList.contains('splash-on')) {
    let i = 0;
    const wrap = (node) => { const w = document.createElement('span'); w.className = 'w'; node.style.setProperty('--i', i++); w.appendChild(node); return w; };
    [...h1.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (!part.trim()) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span'); s.textContent = part; frag.appendChild(wrap(s));
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) {
        const ph = document.createTextNode(''); h1.replaceChild(ph, n); h1.replaceChild(wrap(n), ph);
      }
    });
    h1.setAttribute('aria-label', h1.textContent.replace(/\s+/g, ' ').trim());
    h1.classList.add('split');
    requestAnimationFrame(() => requestAnimationFrame(() => h1.classList.add('in')));
  }

  // Reading progress bar + timeline fill
  let bar = document.querySelector('.scroll-progress');
  if (!bar) { bar = document.createElement('div'); bar.className = 'scroll-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.prepend(bar); }
  const tl = document.querySelector('.timeline');
  let fill = null;
  if (tl) { fill = document.createElement('span'); fill.className = 'tl-progress'; fill.setAttribute('aria-hidden', 'true'); tl.prepend(fill); }
  let raf = false;
  const progress = () => {
    raf = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    if (fill) {
      const r = tl.getBoundingClientRect();
      const p = Math.min(Math.max((window.innerHeight * 0.6 - r.top) / r.height, 0), 1);
      fill.style.height = `${p * Math.max(r.height - 16, 0)}px`;
    }
  };
  window.addEventListener('scroll', () => { if (!raf) { raf = true; requestAnimationFrame(progress); } }, { passive: true });
  window.addEventListener('resize', progress, { passive: true });
  progress();

  // Count-up on impact metrics (always ends on the exact original text)
  const countUp = (el) => {
    const final = el.textContent;
    const m = final.match(/^(\D*?)(\d+(?:\.\d+)?)(.*)$/);
    if (!m) return;
    const end = parseFloat(m[2]), dec = (m[2].split('.')[1] || '').length, t0 = performance.now(), dur = 1400;
    el.setAttribute('aria-label', final);
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? m[1] + (end * e).toFixed(dec) + m[3] : final;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!rm && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { countUp(en.target); cio.unobserve(en.target); } }), { threshold: 0.4 });
    document.querySelectorAll('.metric-num').forEach((n) => cio.observe(n));
  }

  // Hero card: walk the implementation phases one by one
  const phases = document.querySelector('.phase-list');
  if (phases && !rm) {
    phases.classList.add('phase-anim');
    requestAnimationFrame(() => requestAnimationFrame(() => phases.classList.add('go')));
  }

  // Case studies: one chapter on stage. Arrow keys move the index.
  const chapterTabs = [...document.querySelectorAll('.chapter-tab')];
  const showChapter = (tab, focus, writeHash) => {
    chapterTabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (!panel) return;
      panel.classList.toggle('is-on', on);
      if (on) panel.classList.add('in');
    });
    if (focus) tab.focus();
    const id = tab.getAttribute('aria-controls');
    if (writeHash && id) history.replaceState(null, '', '#' + id);
  };
  if (chapterTabs.length) {
    const fromHash = chapterTabs.find((t) => '#' + t.getAttribute('aria-controls') === location.hash);
    showChapter(fromHash || chapterTabs[0], false, false);
    chapterTabs.forEach((tab) => tab.addEventListener('click', () => showChapter(tab, false, true)));
    // R5: in-page links to a case study (e.g. the Proof links under Skills) open that tab, even if the hash is unchanged.
    const openFromHash = (hash) => { const t = chapterTabs.find((x) => '#' + x.getAttribute('aria-controls') === hash); if (t) showChapter(t, false, false); return t; };
    window.addEventListener('hashchange', () => openFromHash(location.hash));
    document.addEventListener('click', (e) => { const a = e.target.closest('a[href^="#case-"]'); if (a) openFromHash(a.getAttribute('href')); });
    document.querySelector('.chapter-nav').addEventListener('keydown', (e) => {
      const i = chapterTabs.indexOf(document.activeElement);
      if (i < 0) return;
      const key = e.key;
      let next = null;
      if (key === 'ArrowDown' || key === 'ArrowRight') next = chapterTabs[(i + 1) % chapterTabs.length];
      else if (key === 'ArrowUp' || key === 'ArrowLeft') next = chapterTabs[(i - 1 + chapterTabs.length) % chapterTabs.length];
      else if (key === 'Home') next = chapterTabs[0];
      else if (key === 'End') next = chapterTabs[chapterTabs.length - 1];
      if (!next) return;
      e.preventDefault();
      showChapter(next, true, true);
    });
  }

  // Product studio: the phone frame follows the selected app (live site in an iframe)
  const frame = document.getElementById('studio-frame');
  const openLink = document.getElementById('studio-open');
  if (frame) {
    // Keyboard focus that moves into the embedded app page can't be styled with CSS from here (cross-origin),
    // so the phone frame gets a class while the demo has focus. Restored studio, accessibility fix 2026-11-13.
    const phone = frame.closest('.phone');
    if (phone) {
      const mark = () => phone.classList.toggle('frame-focused', document.activeElement === frame);
      window.addEventListener('blur', () => { mark(); setTimeout(mark, 0); });
      window.addEventListener('focus', () => phone.classList.remove('frame-focused'));
    }
    const screen = frame.parentElement;
    // Show the loading shimmer until the first demo has loaded (no blank white phone). Added 2026-11-13.
    screen.classList.add('loading');
    frame.addEventListener('load', () => screen.classList.remove('loading'));
    document.querySelectorAll('input[name="studio"][data-demo]').forEach((r) => r.addEventListener('change', () => {
      if (!r.checked || frame.getAttribute('src') === r.dataset.demo) return;
      screen.classList.add('loading');
      frame.title = `Live demo: ${r.dataset.name}`;
      frame.src = r.dataset.demo;
      if (openLink) { openLink.href = r.dataset.demo; openLink.firstChild.textContent = `Open ${r.dataset.name} in a new tab`; }
    }));
  }

  // Cursor-follow glow on cards (fine pointers only)
  if (!rm && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.case, .principle, .product, .edu-card').forEach((c) => {
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', `${e.clientX - r.left}px`);
        c.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
  }

  // ---------- R3 (2026-11-13): email never dead-ends ----------
  // A mailto: link does nothing on a computer with no mail app set up. After any email tap, offer the address to copy.
  const mailLinks = document.querySelectorAll('a[href^="mailto:"]');
  if (mailLinks.length) {
    const toast = document.createElement('div');
    toast.className = 'mail-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.hidden = true;
    toast.innerHTML = '<span class="mail-toast-msg"></span><button type="button" class="mail-toast-copy">Copy address</button><button type="button" class="mail-toast-close" aria-label="Dismiss">×</button>';
    document.body.appendChild(toast);
    const msg = toast.querySelector('.mail-toast-msg');
    const copyBtn = toast.querySelector('.mail-toast-copy');
    let address = '';
    let hideTimer = 0;
    const hide = () => { toast.classList.remove('show'); clearTimeout(hideTimer); hideTimer = setTimeout(() => { toast.hidden = true; }, 250); };
    const show = (addr) => {
      address = addr;
      msg.textContent = 'Opening your email app. No app?';
      copyBtn.textContent = 'Copy address';
      copyBtn.disabled = false;
      clearTimeout(hideTimer);
      toast.hidden = false;
      requestAnimationFrame(() => toast.classList.add('show'));
      hideTimer = setTimeout(hide, 10000);
    };
    const copyText = async (text) => {
      try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall through */ }
      try {
        const ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        const ok = document.execCommand('copy'); ta.remove(); return ok;
      } catch (e) { return false; }
    };
    copyBtn.addEventListener('click', async () => {
      const ok = await copyText(address);
      msg.textContent = ok ? 'Copied: ' + address : 'Select and copy: ' + address;
      copyBtn.textContent = ok ? 'Copied' : 'Copy address';
      copyBtn.disabled = ok;
      clearTimeout(hideTimer);
      hideTimer = setTimeout(hide, 6000);
    });
    toast.querySelector('.mail-toast-close').addEventListener('click', hide);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !toast.hidden) hide(); });
    mailLinks.forEach((a) => a.addEventListener('click', () => {
      const addr = decodeURIComponent(a.getAttribute('href').slice(7).split('?')[0]);
      if (addr) show(addr);
    }));
  }

  // ---------- R4 (2026-11-13): OFF. Proposal only, waiting for Terrell ----------
  // Terrell's rule: never hide anything without his approval. This collapse (three bullets on phones, rest behind
  // "Show more") hid content, so it does not run. Every bullet shows on every screen, as on the live site.
  // It only runs if <html data-collapse-roles="on"> is set, which nothing does. See PROPOSED_REMOVALS.md.
  if (document.documentElement.dataset.collapseRoles === 'on') document.querySelectorAll('.tl-body > ul').forEach((ul, i) => {
    const extra = ul.children.length - 3;
    if (extra < 1) return;
    const title = ul.parentElement.querySelector('h3');
    const role = title ? title.firstChild.textContent.trim() : 'this role';
    if (!ul.id) ul.id = `tl-list-${i}`;
    ul.classList.add('tl-clamp');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tl-more';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', ul.id);
    // Built from DOM nodes (not innerHTML) so a role title can never be parsed as markup.
    const label = (open) => {
      btn.replaceChildren(document.createTextNode(open ? 'Show less' : `Show ${extra} more`));
      if (!open) { const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = ` for ${role}`; btn.appendChild(sr); }
    };
    label(false);
    btn.addEventListener('click', () => {
      const open = ul.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      label(open);
      if (open) { const next = ul.children[3]; if (next) { next.setAttribute('tabindex', '-1'); next.focus({ preventScroll: true }); } }
    });
    ul.after(btn);
  });
})();
