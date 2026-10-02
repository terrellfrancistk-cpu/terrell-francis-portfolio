(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toTopBtn = document.querySelector('.back-to-top');
  const topAnchor = document.getElementById('top');

  // Sticky header shadow + floating back-to-top visibility
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
    if (toTopBtn) toTopBtn.classList.toggle('show', window.scrollY > 600 && !footerInView);
  };
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
})();
