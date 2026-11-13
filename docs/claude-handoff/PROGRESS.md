# PROGRESS — terrellfrancis.app

Opening figure (stale dated scorecard, **replace after the first re-score against AUDIT.md + SPEC.md**):

**About 85% suggested Nov 11 (live, title present, splash not verified). Re-score against AUDIT.md first. That figure is a suggestion, not a measured score.**

Definition of 100%: every applicable AUDIT STANDARD item Present and passing tests; every SPEC item BUILT (or BLOCKED with a named human click) and tested; parity where this product has those surfaces; final verification report written. For Unreal games, proof includes a played local build. 100% on the branch/staging (or a local package) is not a production publish or store submit.

## Log

| Date (America/Chicago) | Old % | New % | What changed | Tests run | What's left |
|---|---|---|---|---|---|
| 2026-11-13 | — | opening (stale) | Pack assembled; no re-score yet | — | Full audit + Play data drop + store-review fixes |
| 2026-11-13 (block 1) | ~85% (stale, unmeasured) | **88% strict** (21/24); 100% of cloud-doable rows | Pack committed to `docs/claude-handoff/`. Step 0: Playwright + axe kit in `tests/` with production-host guard; draft `site-tests` and `uptime` workflows; `pages.yml` never publishes `docs/` or `tests/`. Holes: 44 px phone targets; `?splash=1` makes ONB-1 testable; Light/Dark/System theme; `/privacy/` (privacy and terms); `404.html`; robots.txt and sitemap.xml; perf budgets. REMOVAL_AUDIT filled (nothing SPEC requires was dropped; 4 design trims listed for decision). PROPOSED_REMOVALS: 4 rows, nothing removed. AUDIT re-scored row by row. | Before: 35 pass / 17 fail (12 missing baselines, 4 splash, 1 touch). After: 88 pass, 4 width-specific skips, 0 fail (92 total). Secret scan of full history: clean. External links: 10 OK / 0 broken / 5 unverified (sandbox network). | OBS-2 uptime needs merge OK; store-badge wording needs Terrell (Q1); first CI run on the draft PR; UX PERFECT rounds; live-site checks on the handoff |

Update this table after every work block.
