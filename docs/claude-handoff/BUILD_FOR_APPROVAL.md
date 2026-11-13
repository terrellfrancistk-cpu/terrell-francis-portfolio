# BUILD_FOR_APPROVAL — terrellfrancis.app

**Terrell's rule:** never publish, deploy or push any website live unless he has personally seen and approved that exact build. Nothing here is live. The live site is still `main` @ `05fdba4`.

## Build waiting for approval: **`93e440e45e7721b9`**

| | |
|---|---|
| Fingerprint | **`93e440e45e7721b9`** (every file `pages.yml` would publish, by git blob hash; doc-only and test-only commits keep it) |
| First commit with this build | `6aae927` on `claude/sharp-franklin-6cwtfa` — PR [terrellfrancistk-cpu/terrell-francis-portfolio#7](https://github.com/terrellfrancistk-cpu/terrell-francis-portfolio/pull/7) |
| Live today | `main` @ `05fdba4`, fingerprint `57aeb1c21d5fadae` |
| Check before any merge | `bash tests/build-fingerprint.sh <commit>` must print `fingerprint: 93e440e45e7721b9`; anything else is not the approved build |
| Superseded | `7c738a17bd7183e5` and `0bc8c580c9651294` (same finished page; this build finishes the late-font fix so it also holds on GitHub's Linux runner: CI late-font jump 0.0268 desktop / 0.0022 phone), `ecc9f1c15aae6963` (same finished page; this build adds metric-matched fallback fonts so text no longer jumps when the web font arrives late), `7759189c3d8b5e34` (same page; this build only removes a vendor name from page-source comments, workflow headers and the README, per Terrell's Nov 13 decision), `224a05f0a8707b30` and `2ca0bbddacb801f0` (earlier today; folders kept as a record). This build adds the Terrell-approved restore PR [terrellfrancistk-cpu/terrell-francis-portfolio#10](https://github.com/terrellfrancistk-cpu/terrell-francis-portfolio/pull/10) (`restore/2026-11-13`), merged in full. |

## See it: `docs/claude-handoff/build-preview/93e440e45e7721b9/`

Built exactly as `pages.yml` would publish (minified), on this sandbox, from the committed tree.

| Live vs new, same view | Files |
|---|---|
| First screen, desktop 2× | `compare-first-screen-LIVE.jpg` / `compare-first-screen-NEW.jpg` |
| Products section | `compare-products-LIVE.jpg` / `compare-products-NEW.jpg` |
| Phone app icons, 3× | `compare-phone-icons-LIVE.jpg` / `compare-phone-icons-NEW.jpg` |
| Footer | `compare-footer-LIVE.jpg` / `compare-footer-NEW.jpg` |

| New build only | Files |
|---|---|
| Whole page desktop, light / dark | `new-desktop-light-full.jpg`, `new-desktop-dark-full.jpg` |
| Whole page phone, light / dark | `new-phone-light-full.jpg`, `new-phone-dark-full.jpg` |
| First screen, desktop 2× / phone 3× | `new-desktop-first-screen@2x.jpg`, `new-phone-first-screen@3x.jpg` |
| Splash: TF mark, then black TK Hub | `new-splash-1-tf-mark.jpg`, `new-splash-2-tk-hub.jpg` |
| Privacy & terms (phone), 404 (desktop) | `new-privacy-phone-full.jpg`, `new-404-desktop.jpg` |

## What is different from the live site (add or improve only; nothing removed, hidden or downgraded)

**Restored (past Claude removals, word for word from git):**
- "How I run an implementation" five-phase strip after the hero.
- About section (after Experience, where the restore PR puts it) with its three principle cards. Its second paragraph (current employer) is held for Terrell, as the restore PR decided.
- Product studio: each app's description and a live demo of the selected app in a phone frame (with a loading shimmer, never a blank screen), plus the "why it matters" note with Visit TK Hub. The TORQ panel is held, as the restore PR decided (WRACE/TORQ removal approved Nov 13); the live TORQ app tile and footer link stay.
- "…with live demos below." in the TK Hub Now card.

**Added / improved:**
- Sharper icons on phones and retina screens: high-resolution versions of the same artwork for APEX, Curb, Zilt, Our People, Afterglow, Booked and the TK Hub logo (original files still used on standard screens).
- Light / Dark / System theme (System default) in the footer.
- Privacy & terms page (footer link), real 404 page, robots.txt, sitemap.xml.
- "Copy address" fallback after tapping Email me.
- "Proof" link under each Skills group.
- No text jump while the page loads: metric-matched fallback fonts keep text in place until the web font arrives (fixes a 0.22 layout-shift on slower machines; tuned per text block in the first screen).
- Bigger tap targets on phones; keyboard focus rings; high-contrast mode outlines.
- New link-preview image with his current title (the old image file stays; see PROPOSED_REMOVALS).

**Vendor names:** no build-tool or AI vendor names anywhere a visitor can see, including page source and published files (Terrell, Nov 13); guarded by a test.

**Unchanged:** his email, phone and résumé PDF (byte for byte, guarded by a test); every existing section, link, app tile and line of copy; the hero wording.

## Tests on this build
- Sandbox: 142 passed, 0 failed (12 width-specific skips), on the source and on the minified build (`6aae927`).
- CI on `6aae927`: green, source and minified runs.
- CI on PR #7: runs on every push.
- axe WCAG 2.1 AA: 0 violations in light and dark; keyboard focus visible everywhere, including inside the live demo.

## Waiting on Terrell, separately from the build
Rows in `PROPOSED_REMOVALS.md`: phone bullet collapse (off), 4 icon-mark swaps (not done), RADR wording (restored as written), link-preview image swap, and two items held by the restore PR (TORQ studio panel, About's second paragraph), kept word for word in `HELD_FOR_TERRELL.md`.

## Approval
To approve, Terrell replies in his own words naming the fingerprint, e.g. *"Approved build 93e440e45e7721b9 for terrellfrancis.app."* Only then may PR #7 be merged (merging `main` publishes the site). Any change to the site's files after that changes the fingerprint and needs a new approval.

Status: **waiting for Terrell to see and approve.**
