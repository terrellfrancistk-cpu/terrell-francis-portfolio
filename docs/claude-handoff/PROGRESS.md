# PROGRESS — terrellfrancis.app

Opening figure (stale dated scorecard, **replace after the first re-score against AUDIT.md + SPEC.md**):

**About 85% suggested Nov 11 (live, title present, splash not verified). Re-score against AUDIT.md first. That figure is a suggestion, not a measured score.**

Definition of 100%: every applicable AUDIT STANDARD item Present and passing tests; every SPEC item BUILT (or BLOCKED with a named human click) and tested; parity where this product has those surfaces; final verification report written. For Unreal games, proof includes a played local build. 100% on the branch/staging (or a local package) is not a production publish or store submit.

## Log

| Date (America/Chicago) | Old % | New % | What changed | Tests run | What's left |
|---|---|---|---|---|---|
| 2026-11-13 | — | opening (stale) | Pack assembled; no re-score yet | — | Full audit + Play data drop + store-review fixes |
| 2026-11-13 (block 1) | ~85% (stale, unmeasured) | **88% strict** (21/24); 100% of cloud-doable rows | Pack committed to `docs/claude-handoff/`. Step 0: Playwright + axe kit in `tests/` with production-host guard; draft `site-tests` and `uptime` workflows; `pages.yml` never publishes `docs/` or `tests/`. Holes: 44 px phone targets; `?splash=1` makes ONB-1 testable; Light/Dark/System theme; `/privacy/` (privacy and terms); `404.html`; robots.txt and sitemap.xml; perf budgets. REMOVAL_AUDIT filled (nothing SPEC requires was dropped; 4 design trims listed for decision). PROPOSED_REMOVALS: 4 rows, nothing removed. AUDIT re-scored row by row. | Before: 35 pass / 17 fail (12 missing baselines, 4 splash, 1 touch). After: 88 pass, 4 width-specific skips, 0 fail (92 total). Secret scan of full history: clean. External links: 10 OK / 0 broken / 5 unverified (sandbox network). | OBS-2 uptime needs merge OK; store-badge wording needs Terrell (Q1); first CI run on the draft PR; UX PERFECT rounds; live-site checks on the handoff |
| 2026-11-13 (block 2) | 88% strict | **88% strict** (21/24, unchanged: the 3 open rows need Terrell); 100% of cloud-doable rows | UX PERFECT rounds R3–R5 shipped (R1–R2 were Nov 7): R3 email never dead-ends (copy fallback); R4 phone roles open to three lines (timeline −23%); R5 every skill group links to its proof. Round 6 review: **PERFECT** (the remaining big ideas need Terrell's decision; anything else adds clutter). New share image `assets/og-image-2026-11.png` matching today's title; old one kept and proposed. Fixed a timing-dependent deep-link test. | 105 pass, 5 width-specific skips, 0 fail (110 total, 13 files); 16 visual baselines; axe 0 in light and dark; external links 10 OK / 0 broken / 5 unverified | Terrell: Q1 store wording, Q2 decisions, H5 merge OK; House Officer: H1–H4, H6–H8 |
| 2026-11-13 (block 3) | 88% strict | **88% strict** (21/24; the 3 open rows still need Terrell) | CI confirmed green on PR #7 (GitHub runner: 89 passed, 5 skips). New: whole suite run against the **minified build pages.yml publishes** (105/105, baselines pixel-identical) as a script, npm script and CI step. New `robustness.spec`: reflow at 320/375/768/1024/1440/1920, JS off, visible focus on every control, forced colors. Found and fixed: selected case-study tab and pressed theme button were indistinguishable in Windows high contrast (added a forced-colors outline layer). | 117 pass, 11 width-specific skips, 0 fail (128 total, 14 files); prod-build run 105/105 at the previous head | Same: Q1, Q2, H5 merge OK; House Officer H1–H4, H6–H8 |
| 2026-11-13 (block 4) | 88% strict | **88% strict** (21/24; unchanged, open rows need Terrell) | New standing rule from Terrell: never work on Talencia. Audited this session's own additions: the R5 proof link and its anchor named the employer, so they are now employer-neutral ("current role, week one", `#role-current`); his existing page lines about his role are untouched (Rule #1). The external link checker never contacts that company's site (`NEVER_CONTACT`), and HANDOFF H2 no longer asks anyone to visit it. PR #7 check-in #1 at 08:36 UTC: CI green, no conflicts, no comments. | Full suite and the minified-build run (see commit) | Same: Q1, Q2, H5 merge OK; House Officer H1–H4, H6–H8 |
| 2026-11-13 (block 5) | 88% strict | **88% strict** (21/24; unchanged) | CI green on PR #7 head `24b82d6` (actions v5; source run + minified-build run). PR has no conflicts, no comments, no reviews. Added HANDOFF H10 (stale GitHub repo description). Cloud-doable work order is complete; every remaining row needs Terrell (Q1, Q2, H5) or House Officer (H1–H4, H6–H10). | CI green on head; local sandbox suite 117 pass / 11 skips at the previous block | Terrell: Q1, Q2, H5 |
| 2026-11-13 (block 6) | 88% strict | **92% strict** (22/24) | Terrell answered Q2: keep everything as is; keep his email and phone exactly as they are and stop flagging them. Recorded "Keep" on all 5 PROPOSED_REMOVALS rows and all 5 pending REMOVAL_AUDIT rows; the contact question is closed for good. Added `contact.spec.mjs`: fails if the email, phone (links in hero/contact/dock, shown text, structured data) or the résumé PDF bytes ever change; values are compared by SHA-256 so no contact details sit in the test file; mutation-checked (an altered phone digit fails). CI-1 counted (green on every PR head). | 125 pass, 11 width-specific skips, 0 fail (136 total, 15 files) | Terrell: Q1 store wording, H5 merge OK. House Officer: H1–H4, H6–H10 |
| 2026-11-13 (block 7) | 92% strict | **96% strict** (23/24) | New standing rules from Terrell: critical security fixes may be merged/deployed; store resubmits OK once a review fix is in; other merges, deploys, spending and removals need his OK; product decisions (pricing, copy, layout, proposed removals) stay as they currently are, without waiting. Applied: Q1 closed (hero copy kept as is), SPEC store-badges row BUILT. Security look at live `main`: nothing critical, so nothing merged. Hardened R4's "Show more" label to build DOM nodes instead of `innerHTML` from page text, with a test that serves a role title containing markup and fails on the old code. | Full suite (see commit); CI on push | Only OBS-2 (needs merge OK). House Officer: H1–H4, H6–H10 |

Update this table after every work block.


## UX PERFECT rounds (UX_PERFECT_ROUNDS_PROMPT.md)

| Round | Date | Change (one bold move) | Why it works | Commit |
|---|---|---|---|---|
| R1 | 2026-11-07 | Measurable first paint (earlier session) | The name is the page's largest paint again | `7e656b3` |
| R2 | 2026-11-07 | Paragraphs ≤ 3 lines; case studies as rows; skills as chips; one primary action (earlier session) | Scannable in seconds | `bb4a49a` |
| R3 | 2026-11-13 | Email never dead-ends: after any email tap, a toast offers Copy address | `mailto:` silently fails on computers without a mail app, and email is the main conversion | `6a37a58` |
| R4 | 2026-11-13 | On phones each role opens to its first three lines (Show N more) | The phone timeline was the longest stretch; headline facts stay visible; timeline −23% | `aee096d` |
| R5 | 2026-11-13 | Every skill group links to its proof (case study or role) | Turns a wall of claims into evidence one tap away | `7ab5508` |
| R6 | 2026-11-13 | **PERFECT** | The remaining high-impact moves (app one-liners in Products, bringing back the implementation phase strip) are REMOVAL_AUDIT decisions for Terrell. Anything else would add clutter or bring diminishing returns. Subtractive ideas (dead CSS/JS, splash caption, old share image) are in PROPOSED_REMOVALS.md, not shipped. | — |

## Paid tools (PAID_TOOLS.md)

No paid tool was needed or used for this site, and nothing was spent. The one asset that needed refreshing, the social share image, was rendered with Playwright from the site's own fonts and TF mark (`assets/og-image-2026-11.png`). No Higgsfield, Meshy or Holo generation was requested: a résumé site gains nothing from AI video or 3D, and adding them would be the clutter the UX rounds rule out. If Terrell wants a short reel for the hero or LinkedIn, it would be a Higgsfield request that needs his credit OK (see HANDOFF Q3).


## Verification report — 2026-11-13 (end of session work blocks 1–2)

**Score: 88% strict (21 of 24 applicable rows Present/BUILT). Every row the cloud session can close is closed.** The three open rows each wait on a named human step:

| Open row | Blocked on | Where |
|---|---|---|
| OBS-2 uptime | Terrell's OK to merge (a dispatch-only workflow runs only from `main`), then one manual run | HANDOFF H5, H6 |
| SPEC "honest store badges" | Terrell's answer on the "10 apps shipped, idea to store" wording | HANDOFF Q1 |
| CI-1 (marked Present, first remote run pending) | First `site-tests` run on the draft PR; if Actions billing blocks it, do not pay | PR [terrellfrancistk-cpu/terrell-francis-portfolio#7](https://github.com/terrellfrancistk-cpu/terrell-francis-portfolio/pull/7), HANDOFF H7 |

**Tests run (sandbox, local static server = staging):** `cd tests && npm test` → 105 passed, 5 width-specific skips, 0 failed (110 tests, 13 spec files, desktop 1280×800 and Pixel 7 projects). Covers: zero console/page errors and failed requests; every anchor and local asset; résumé PDF serves and downloads; axe WCAG 2.1 A/AA = 0 violations (home light and dark, privacy both themes, 404, email toast); keyboard case-study tabs; 44 px phone targets; no horizontal scroll; splash order and once-per-session; theme default, persistence and live device follow; no forms, inputs, iframes or cookies; zero third-party requests; deep links; perf (298 KB first load, LCP ~1.5 s throttled, CLS ~0); 16 visual baselines.

**Other checks:** full-history secret scan clean. External links: 10 OK, 0 broken, 5 unverified because the sandbox cannot reach those hosts (HANDOFF H2). Résumé PDF and page agree on every role, date and metric.

**Live vs staging:** none of this is live. The live domain returns 403 through this sandbox's proxy, so the live look is HANDOFF H1. Nothing was merged, deployed, submitted or spent. Pushes went only to `claude/sharp-franklin-6cwtfa`, which `pages.yml` does not deploy.

**Removals:** none made. 6 rows wait in PROPOSED_REMOVALS.md; 4 "restore?" decisions wait in REMOVAL_AUDIT.md.

**Evidence paths:** `tests/e2e/*.spec.mjs`, `tests/e2e/__screenshots__/`, `tests/check-external-links.mjs`, `docs/claude-handoff/AUDIT.md` (re-score), git log on the branch.
