# AUDIT — terrellfrancis.app

**Packed:** Friday, Nov 13, 2026, America/Chicago  
**Targets:** `VISION.md` + `STANDARD.md` + this app's `SPEC.md` (official TKHub Solutions production spec, sanitized)  
**Rule #1:** Never remove anything without Terrell's explicit approval. Add or fix only. Proposed deletions go in `PROPOSED_REMOVALS.md`.

These sessions are **TK Hub only**.

Marks use dated file evidence. They are not a fresh live probe of every row. If you cannot open the repo or a URL, say so. Do not guess Present or BUILT. Re-score `PROGRESS.md` in the first work block.

## Holes to patch (priority)

Play-usage fixes are permanent priority #1 when this app is on Play production. Store-review fixes are next. Then the holes in `CLAUDE_START_HERE.md`. Then every Partial / Missing row below.

P0. These sessions must not work on any other company's product, and must not add confidential employer, salary, or client details to this site or this zip. If a current-role line already exists on the live site, do not remove it (Rule #1). Do not add confidential internals.
P0. A push to GitHub Pages is a production publish. No push without Terrell's OK.
P1. Run a full visual and link audit (phone and desktop widths, console errors, résumé download, splash: product/personal mark then TK Hub ~1s then content). Fix broken links and accessibility additively.
P1. Personal contact belongs only if it is already his choice for this site — confirm on the live page; do not invent or harvest new personal data into the zip or the repo docs.
P2. Website quality rounds until further high-impact changes would add clutter (then stop). 100% means AUDIT items Present, visual regression on the site, and a verification report — still not a live push without OK.

## Re-score — 2026-11-13 (Claude, branch `claude/sharp-franklin-6cwtfa`)

Probed against the repo and a local static server (the staging host for a static site). The live domain is blocked by this sandbox's network proxy (HTTP 403), so live-only checks are on HANDOFF_TO_HOUSE_OFFICER.md. Test kit: `tests/` (Playwright 1.63 + axe 4.10), run with `cd tests && npm test`. Every "Present" below names its test.

terrellfrancis.app is a static, single-page résumé site: no accounts, no forms, no database, no payments, no messaging, no native app. Rows for those surfaces are **N/A**, and `smoke.spec.mjs › no accounts, forms, or inputs` keeps that claim true.

| ID | Mark | Evidence (test or file) |
|---|---|---|
| RAIL-0 | Present | PROPOSED_REMOVALS.md filled; nothing removed (every change is additive; diffs in git log) |
| AUTH-1…AUTH-8 | N/A | No sign-in or accounts. `smoke.spec.mjs` asserts no form/input/iframe and no cookies |
| SEC-1…SEC-4, SEC-6, SEC-7 | N/A | No database, admin routes, or user-generated content |
| SEC-5 | Present | Full-history scan for API keys, tokens and private keys: none. No env files. |
| SEC-8 | N/A | No health or sensitive data handled |
| UX-1 | Present | `404.html` (`pages.spec.mjs › unknown paths get the site 404`); splash has a 2.6 s failsafe and tap/key skip (`splash.spec.mjs`) |
| UX-2 | Present | Content is in the HTML at first paint; LCP ~1.5 s throttled (`perf.spec.mjs`); no spinners |
| UX-3 | Present | No sample or placeholder data; every figure is attributed to its employer |
| UX-4, UX-5 | N/A | Nothing loads after first paint; no lists to refresh |
| OBS-1 | N/A | No crash SDK exists, and VISION says not to add one unasked |
| OBS-2 | **BLOCKED** (merge) | `.github/workflows/uptime.yml` drafted (read-only GETs, manual). A dispatch-only workflow can only run from the default branch, so it needs Terrell's OK to merge; the schedule stays commented until he OKs it |
| OBS-3 | Present | No analytics, logs or push; zero third-party requests (`pages.spec.mjs › loads nothing from third parties`) |
| COM-1…COM-3, PAY-1…PAY-5 | N/A | No email sending, push, SMS or purchases |
| A11Y-1 | Present (web) | axe WCAG 2.1 A/AA = 0 violations in light and dark, on home, privacy and 404 (`a11y`, `theme`, `pages` specs); keyboard tabs; 44 px phone targets; element-level contrast; visible focus on every control; reflow at 320–1920 px; readable with JS off; selected states visible in forced colors (`robustness.spec.mjs`). VoiceOver/TalkBack on a real phone is on the handoff |
| PERF-1 | Present | Budgets: < 700 KB first load (today 298 KB unminified), LCP < 2.5 s, CLS < 0.1 on a 4× CPU / slow network (today ~1.5 s / ~0). k6 N/A: no backend, and production load tests are banned |
| PERF-2 | N/A | No polling or lists |
| PAR-1 | N/A | No native apps. Phone and desktop are both covered by every spec |
| PAR-2 | Present | Section and case-study deep links work from a cold load (`links.spec.mjs › deep links`) |
| LEG-1 | Present | `/privacy/` (privacy and terms) states only what the code does; footer link; renders in both themes (`pages.spec.mjs`) |
| LEG-2…LEG-9 | N/A | No store binary, AI, biometrics, age-gated content, or permissions |
| ONB-1 | Present | TF mark → solid black TK Hub (~1.2 s) → page, once per session, skipped for reduced motion (`splash.spec.mjs`, forced with `?splash=1`). Caption question in PROPOSED_REMOVALS row 1 |
| ONB-2 | N/A | No permissions or analytics to opt into |
| SET-1 | Present (applicable part) | Theme Light / Dark / System, System default, remembered, live-follows the device (`theme.spec.mjs`); legal link in footer. Account, notifications, delete and sign-out are N/A |
| SUP-1 | Present | Contact mailto/tel links well-formed (`links.spec.mjs`); whether the inbox receives mail is on the handoff |
| ADM-1 | N/A | No admin tooling |
| STG-1 | Present | Local static server is staging; `tests/guard.mjs` refuses every production host (fails closed) |
| STG-2 | Present | Git history is the backup; rollback = revert the merge on `main` (pages.yml republishes) |
| CI-1 | Present (CI green on PR #7: 89 passed, 5 skips; visual is sandbox-only) | 128 tests in 14 spec files (117 run per pass; 11 are width-specific skips), plus the same suite against the minified production build (`npm run test:prod-build`, also a CI step); `.github/workflows/site-tests.yml` runs them on pull requests (production hosts refused) |
| VER-1 | Present | Footer stays `v2.0.0`; no bump |
| WEB-1 | Present | No rork hostnames (`smoke.spec.mjs`); bare domain is the site. Live HTTP 200 is on the handoff (sandbox proxy blocks the live host) |

### SPEC items

| SPEC item | Mark | Evidence |
|---|---|---|
| Accurate public résumé | BUILT | Every role, date, company and metric on the page matches `assets/Terrell_Francis_Resume.pdf` (pdftotext). Minor: the PDF lists "Forms" under M365 and gives 2016–2020 for the B.S.; the page says 2020 |
| Working links | BUILT | Internal anchors and every local asset 200 (`links.spec.mjs`); external: 10 OK, 0 broken, 4 unverified from the sandbox, 1 (current employer's site) never contacted by rule (`tests/check-external-links.mjs`) → handoff |
| Honest store badges | **BLOCKED** (Terrell's answer) | No store badges on the site. The hero card says "10 apps shipped, idea to store". Pack docs show several iOS builds rejected Nov 3–5, so whether "to store" is accurate today is Terrell's call (handoff Q1) |
| Splash | BUILT | See ONB-1 |
| Clean visual QA | BUILT | 16 visual baselines (updated after each UX round) (phone + desktop, light + dark, privacy) in `tests/e2e/__screenshots__`; 0 console errors |

**Score:** 19 applicable STANDARD rows + 5 SPEC rows = 24. Present/BUILT: 21. BLOCKED on a named human step: OBS-2 (merge OK) and SPEC "honest store badges" (Terrell's answer). CI-1 is Present once the PR run is green. **21/24 = 88% strict; 100% of what the cloud session can do without Terrell.**

---

## Pack-time marks (2026-11-13, superseded by the re-score above; kept for the record)

## STANDARD checklist

| ID | Requirement | Mark | Why (evidence) | Claude instruction |
|---|---|---|---|---|
| RAIL-0 | Never remove without approval; proposed removals file exists | Present (process) | This pack includes PROPOSED_REMOVALS.md and states Rule #1. | Keep the rule. Do not remove anything without a filled, approved row. |
| AUTH-1 | Real sign-in (Google, Apple, X, email, magic link) as SPEC requires; unwired buttons visibly off | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| AUTH-2 | Working demo / review login documented for stores | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| AUTH-3 | Email confirmation on; privileged roles after confirm | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| AUTH-4 | MFA (email/text code + trust device); server-side enforcement if claimed | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| AUTH-5 | Session security, lockout, invalid sessions rejected | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| AUTH-6 | Account deletion in-app (type DELETE) + public web page | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| AUTH-7 | Sign-out and session revoke | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| AUTH-8 | Post-sign-in lands in the product, not a counter or expired-link dead end | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SEC-1 | RLS / isolation test (two-user, rolled back) | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SEC-2 | Privileged checks use confirmed sign-in email | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SEC-3 | Staff allowlists; QA/review accounts have no extra rights | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SEC-4 | Audit log written by the database for sensitive actions | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SEC-5 | Secrets out of git | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SEC-6 | Admin / studio routes gated server-side, fail closed | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SEC-7 | Report and block on user-generated surfaces | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SEC-8 | Health / sensitive data: no patient data to outside AI; demo never in a live chart | N/A or limited | Not a clinic chart app. Still do not send unexpected sensitive data to outside models. | Follow SPEC if any health-adjacent data appears (e.g. Our People medical ID). |
| UX-1 | Visible, recoverable errors | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| UX-2 | Loading states | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| UX-3 | Honest empty states; no sample people when Demo is off | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| UX-4 | Offline / failed load keeps last good rows | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| UX-5 | Pull-to-refresh / return-to-tab does not wipe on failure | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| OBS-1 | Crash reporting only if already present or Terrell OKs a new SDK | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| OBS-2 | Uptime check (needs OK if a new paid tool) | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| OBS-3 | No PII in logs, analytics, or push | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| COM-1 | Transactional email from the owned domain | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| COM-2 | Push with consent; no sensitive payloads | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| COM-3 | SMS only if the campaign is approved; else email remains | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| PAY-1 | Honest paywall; existing Stripe account only | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| PAY-2 | Store vs web billing policy; purchase unlocks sibling clients of the same app | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| PAY-3 | Test vs live keys separated | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| PAY-4 | Restore purchases / receipt verify | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| PAY-5 | Pricing matches what he accepted | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| A11Y-1 | WCAG 2.1 AA, VoiceOver, TalkBack, 44-pt targets | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| PERF-1 | k6 / speed targets on staging | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| PERF-2 | No full-account polling; paged lists; indexes | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| PAR-1 | iOS, Android, and web 1-for-1, add-only | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| PAR-2 | Deep links work | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| LEG-1 | Privacy and terms render and match data flows | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| LEG-2 | App Privacy label / Play Data safety | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| LEG-3 | Privacy Manifest on iOS | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| LEG-4 | AI data consent; no health data to outside models | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| LEG-5 | Biometric consent if used | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| LEG-6 | Age gates / kids policy where required | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| LEG-7 | Store listing assets match the binary | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| LEG-8 | Unique value (4.3 / 4.2.6) without removing siblings' features | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| LEG-9 | Permissions just in time, honest declarations | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| ONB-1 | Splash: product logo → black TK Hub ~1s → content | Partial / UNVERIFIED | Splash order was a recurring fail across the house. Confirm product logo first, then black TK Hub ~1s, then content, on web and native. Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| ONB-2 | First-run permissions and usage-data door are explicit | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SET-1 | Settings: account, notifications, privacy, theme, legal, delete, sign out | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| SUP-1 | Working support path | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| ADM-1 | Admin tooling gated and audited | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| STG-1 | Staging database / branch with production guards | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| STG-2 | Backups / undo script before dangerous policy changes | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| CI-1 | CI and tests (unit, e2e drafts, isolation) | Partial / UNVERIFIED | Not re-probed on current main at pack time. Re-check in the first work block against the repo and a staging or allowed public URL. Do not guess Present. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| VER-1 | Versioning: no freelance bumps; never revert 2.0.0 | Partial | Not an app-store binary. Do not invent a version bump. Never revert prior Claude work on the portfolio. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |
| WEB-1 | Marketing site + web app as SPEC requires; no Rork hostnames | Partial / UNVERIFIED | Owned site: https://terrellfrancis.app. GitHub Pages from terrell-francis-portfolio (CNAME terrellfrancis.app). Last known live with HTTP 200 (Nov 11). This is the one site that may show his personal contact if it is already on the live page — confirm, do not invent new personal data, and do not put personal contact on TK Hub product sites. | Add or fix until Present, with tests. If a deletion seems required, use PROPOSED_REMOVALS.md and wait. |

## SPEC audit (official production spec)

The full sanitized SPEC is in `SPEC.md`. For every must-have screen, role, monetization rule, and “Finished means” line in that file, mark **BUILT**, **PARTIAL**, **MISSING**, or **BLOCKED** in the first work block, with a file path or URL. Do not guess BUILT. Then build every MISSING and PARTIAL item you can without a blocked console.

Pack-time notes (not a complete SPEC score):

Terrell's personal portfolio website. Not a TK Hub product app. Make the site 100% perfect. This session does not work on any other company's product.

Finished-means and screens are in SPEC.md. Known SPEC-level gaps are listed in the holes above (for example missing demo login, missing web posting, missing Auto Apply against real boards, AfterGlow night-standing vs older game surfaces — add, do not delete).

## Instruction

1. Re-probe each row on the current `main` and on staging / allowed public URLs (Playwright headless; refuse production writes).
2. Update this file and `PROGRESS.md`.
3. Patch holes and Missing / Partial rows additively, with tests, one PR per topic.
4. Stop at merge, live publish, and store submit for Terrell's OK.
