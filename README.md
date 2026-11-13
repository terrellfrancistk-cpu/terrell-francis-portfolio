# Terrell Francis: portfolio site (static)

Live: https://terrellfrancis.app/

Plain static site, no build step. Deployed to GitHub Pages by `.github/workflows/pages.yml`.

- `index.html`, `styles.css`, `script.js`: the whole site
- `assets/Terrell_Francis_Resume.pdf`: resume (PDF)
- `assets/fonts/`: self-hosted Inter + Instrument Serif (Latin subset, woff2, SIL OFL)
- `assets/og-image.png` (1200x630), `assets/favicon.svg`, `assets/apple-touch-icon.png`
- `assets/tkhub-logo.png`: TK Hub LLC logo (footer), cropped from https://tkhub.app/logos/tkhub.png

## Tests (added 2026-11-13)

`tests/` holds a Playwright + axe kit that runs against a local static server. Production hosts are refused (`tests/guard.mjs`).

```bash
cd tests && npm install && npm test
```

- Smoke, links, résumé download, WCAG 2.1 AA (light and dark), keyboard, 44 px phone targets, splash order (`?splash=1` replays it), theme, privacy and 404 pages, deep links, perf budgets, and visual baselines (`npm run test:update` to accept intended changes).
- `node tests/check-external-links.mjs` does one read-only GET per external link.
- `docs/`, `tests/` and `HANDOFF_TO_HOUSE_OFFICER.md` are never published: `pages.yml` drops them from the gh-pages commit.
- Handoff, audit and progress files: `docs/claude-handoff/`.
