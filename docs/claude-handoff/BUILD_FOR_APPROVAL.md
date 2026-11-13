# BUILD_FOR_APPROVAL — terrellfrancis.app

**Rule (Terrell, 2026-11-13):** never publish, deploy or push any website live unless Terrell has seen and approved that exact build. This file shows him the exact build. Nothing here is live.

## The build

| | |
|---|---|
| Build fingerprint | **`2ca0bbddacb801f0`** |
| First commit with this build | `ece07a2` on `claude/sharp-franklin-6cwtfa` (PR [terrellfrancistk-cpu/terrell-francis-portfolio#7](https://github.com/terrellfrancistk-cpu/terrell-francis-portfolio/pull/7)) |
| Live site today | `main` @ `05fdba4`, fingerprint `57aeb1c21d5fadae` |
| What the fingerprint covers | Every file `pages.yml` would publish (the committed tree minus `docs/`, `tests/`, `HANDOFF_TO_HOUSE_OFFICER.md`), by git blob hash. Doc-only and test-only commits keep the same fingerprint. Any change to the site's own files changes it. |
| Check a commit before merging | `bash tests/build-fingerprint.sh <commit>` must print `fingerprint: 2ca0bbddacb801f0`. If it prints anything else, that build has not been approved. |
| Files | `build-preview/2ca0bbddacb801f0/published-files.txt` (source, by blob hash); `minified-files.sha256` (the minified output as built on 2026-11-13; the deploy runs terser 5 / clean-css 5 again, so these bytes are informational) |

## See it (screenshots of the minified build exactly as pages.yml would publish it)

All in `docs/claude-handoff/build-preview/2ca0bbddacb801f0/`:

| Screen | File |
|---|---|
| First screen, desktop (1440 px, 2×) | `desktop-first-screen@2x.jpg` |
| First screen, phone (iPhone 13, 3×) | `phone-first-screen@3x.jpg` |
| Whole page, desktop, light / dark | `desktop-light-full.jpg`, `desktop-dark-full.jpg` |
| Whole page, phone, light / dark | `phone-light-full.jpg`, `phone-dark-full.jpg` |
| Splash: TF mark, then black TK Hub screen | `splash-1-tf-mark.jpg`, `splash-2-tk-hub.jpg` |
| Privacy & terms (phone) | `privacy-phone-full.jpg` |
| 404 page (desktop) | `404-desktop.jpg` |

## What is different from the live site

Add or fix only; nothing removed. His email, phone and résumé PDF are byte-for-byte unchanged (guarded by `tests/e2e/contact.spec.mjs`). Hero copy unchanged.

- Light / Dark / System theme switch in the footer (System is the default).
- Footer link to a new **Privacy & terms** page; a real 404 page; robots.txt and sitemap.xml.
- After tapping **Email me**, a small "Copy address" fallback for computers with no mail app.
- On phones, each job shows three bullets with **Show more** (desktop and print show everything).
- Each Skills group has one short **Proof** link to the case study or role behind it.
- Bigger tap targets on phones; outlines on selected states in Windows high contrast.
- New link-preview image (`og-image-2026-11.png`) with his current title; the old image file stays.
- `pages.yml` stops publishing internal notes and tests.

## Tests on this build

Sandbox: 126 passed, 11 width-specific skips, 0 failed; the same suite passes on the minified build. CI on PR #7: green on every commit. axe WCAG 2.1 AA: 0 violations in light and dark.

## Approval

To approve, Terrell replies in his own words naming the fingerprint, for example: *"Approved build 2ca0bbddacb801f0 for terrellfrancis.app."* Only then may PR #7 be merged (merging `main` publishes the site). If any site file changes after that, the fingerprint changes and a new approval is needed.

Status: **waiting for Terrell to see and approve.**
