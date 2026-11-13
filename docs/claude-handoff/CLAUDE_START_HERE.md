# CLAUDE_START_HERE — terrellfrancis.app (website only)

Paste this file into the Claude Code cloud session for this site repo (or attach this zip and start with this file). Work in GitHub. terrellfrancis.app is the personal portfolio site. Do not add confidential employer, salary, or client details. Other sessions are **TK Hub only**.

## Rule #1 — NEVER remove without Terrell's explicit approval

This outranks every other rail, including store cleanup, parity, and "old marks get replaced."

Do not remove features, screens, files, code, data, database tables or columns, routes, dependencies, or assets without Terrell's explicit approval, in his own words, for that specific item. **Add or fix only.** If something looks unused, dangerous, or duplicative, write it in `PROPOSED_REMOVALS.md` (what, where, why, what would replace it, risks) and wait. Prefer a tighter policy, a flag, or an additive fix over a deletion. Bypass permissions in Claude Code do **not** grant removal, merge, production deploy, store submit, or spend.

## Safety rails (non-negotiable)

- These sessions are **TK Hub only**. Do not work on any other company's product in personal Claude or any personal account.
- Staging database or branch only. Scripts and workflows refuse production URLs. Never load-test production. Never use real people's data.
- Add-only parity. Close iOS / Android / web / marketing-site gaps by adding or improving. Never remove a feature to match.
- k6 baseline on today's code before any speed fix, and the same smoke after.
- Tests before and after each change (unit, integration, and the suites in STANDARD.md).
- No production deploys, merges to production, live-domain publishes, store submits, App Review / Play replies posted, DNS changes, or spend without Terrell's OK. Drafts are fine. APEX `main` auto-deploys — do not merge. tkhub.app `porkbun-live` deploys on push — do not push.
- Never revert existing work, especially Claude's. Never revert 2.0.0 where it already landed. Next official bump is 2.1.1 only with his OK. Do not bump after routine fixes.
- Small reviewable PRs, one topic, branch from current `main`, no force-push.
- Rork is simulators only. GitHub is the source of truth. Do not type in a Rork chat or press Publish.
- No secrets in git, chat, or artifacts. Vault entry names only.
- Ultracode off for routine work. One app (and its website) at a time.
- English product language unless a language switch already exists — do not drop one.

## Permanent priority #1 — Play production data and usage

Checking Google Play production data (acquisitions, uninstalls, active users, ratings and reviews, Android vitals / crash / ANR, policy) and **fixing anything that is reducing usage is always priority #1**, above feature work and polish. House Officer drops numbers into `PLAY_DATA_INPUT.md`. You cannot open the Play Console GUI. When data is missing, say so, do not invent rates, and still fix known production defects already in `STORE_REVIEW.md`. Then update `PROGRESS.md`.

This product is not a confirmed Play production listing at pack time. If PLAY_DATA_INPUT.md later shows it is in production, this priority applies immediately. Until then, still keep listings honest and fix any rejection or policy warning in STORE_REVIEW.md.

## Store review (priority after safety rails and Play-usage fixes)

Read `STORE_REVIEW.md` next. Your job includes getting this app through Apple App Review and Google Play review: map every known rejection or policy warning to the guideline, fix it in code or metadata (add-only), prepare demo / review accounts (vault names only), Data safety / privacy labels, account deletion, and **draft** the reviewer reply. House Officer posts replies and resubmits **only after Terrell's OK**. Apps with an Extended Review / Developer Program warning are not resubmitted without a substantial change and Terrell's own words. Do not touch an in-review submission he has frozen (see STORE_REVIEW.md).

## REMOVAL_AUDIT — restore what Claude dropped from the original prompts

This is a top work item. Read `REMOVAL_AUDIT.md` early (after Play-usage fixes on production listings, and in parallel with store-review prep).

Diff git history and the current app against Terrell's original prompts and specs in this zip (`SPEC.md`, `VISION.md`, and `docs/`). Find everything that was removed or left behind (especially during Claude's Nov 5–9 work, and any later drops). 

- If it was in his original prompt or SPEC for what this app should do, **restore it additively** on top of current work. Do not revert other Claude improvements to do that.
- If a removal has a reason (policy, store, safety), do **not** silently restore or silently leave it gone. Put the item, the reason, and the evidence in `PROPOSED_REMOVALS.md` and wait for Terrell to decide.
- Never remove anything else without his approval.

## Step 0 — Claude Code cloud has no GUI browser

Read `CLOUD_SETUP.md` and do it first: Playwright + Chromium headless against this site; draft GitHub Actions (Playwright visual/link checks) as a PR left open; keep `HANDOFF_TO_HOUSE_OFFICER.md` current for DNS / Porkbun / Pages. A push can be a production publish. Do not enable paid runners or spend without OK.

## What you own

You own **only** the website terrellfrancis.app (https://terrellfrancis.app). You are responsible for getting it to 100%. Do not start an app, a second site, or another product in this session.

Implement every feature in `VISION.md`, `STANDARD.md`, `SPEC.md`, and the gaps in `AUDIT.md` that apply to this website. Test at playbook rigor and beyond: Playwright visual and link checks, accessibility, console-error free loads, and performance budgets. There is no iOS/Android binary in this session.

## Definition of done (100%)

1. Every applicable `AUDIT.md` STANDARD item is Present and covered by passing tests (N/A items stay N/A).
2. Every `SPEC.md` item is BUILT (or BLOCKED with a named human click) and tested.
3. No removals pending without OK.
4. `PROGRESS.md` is at 100% with a final verification report.
5. `PROGRESS.md` was updated after every work block.

100% on the work branch and staging is **not** a production publish. Merge, live deploy, and store submit still wait for Terrell's OK.

## Holes to patch first (after Play-usage and store-review work)

Do a full hole-finding audit against VISION, STANDARD, SPEC, STORE_REVIEW, and the list below before new features. Update AUDIT.md. Do not guess BUILT or Present.

P0. These sessions must not work on any other company's product, and must not add confidential employer, salary, or client details to this site or this zip. If a current-role line already exists on the live site, do not remove it (Rule #1). Do not add confidential internals.
P0. A push to GitHub Pages is a production publish. No push without Terrell's OK.
P1. Run a full visual and link audit (phone and desktop widths, console errors, résumé download, splash: product/personal mark then TK Hub ~1s then content). Fix broken links and accessibility additively.
P1. Personal contact belongs only if it is already his choice for this site — confirm on the live page; do not invent or harvest new personal data into the zip or the repo docs.
P2. Website quality rounds until further high-impact changes would add clutter (then stop). 100% means AUDIT items Present, visual regression on the site, and a verification report — still not a live push without OK.

## Work order inside this session

1. Rule #1 and safety rails (always).
2. Permanent #1: Play production data in PLAY_DATA_INPUT.md and fixes for anything reducing usage (if this app is on Play production).
3. REMOVAL_AUDIT.md: diff git history vs original prompts/specs; restore dropped original features; list reasoned removals for Terrell.
4. STORE_REVIEW.md: fix rejection/policy causes; draft replies; do not post or resubmit.
5. Step 0 cloud setup (Playwright, workflow PRs, CLIs, handoff file) — except TORQ and Ascendium Unreal builds, which run locally on the assigned desktop, not in the cloud sandbox.
6. Full hole-finding audit; patch holes additively (security / RLS / auth / broken flows first).
7. Staging DB or branch, if not already, with production-URL guards.
8. k6 baseline on today's code, then Phase 1 speed fixes measured on staging.
9. Add-only iOS / Android / web / website parity and remaining SPEC features.
10. Store and privacy checklist drafts (account deletion, Data safety, labels). Still no submit.
11. Keep PROGRESS.md scored. When AUDIT is all Present/BUILT, write the 100% verification report and stop for Terrell's OK to publish.

## Status at pack time

- Opening production-ready (stale, re-score): About 85% suggested Nov 11 (live, title present, splash not verified). Re-score against AUDIT.md first. That figure is a suggestion, not a measured score.
- Website: https://terrellfrancis.app
- Hosting: GitHub Pages. A push to the Pages branch can go live — treat any push as a production publish. Do not push without Terrell's OK.
- Repos: https://github.com/terrellfrancistk-cpu/terrell-francis-portfolio
- Version: Not an app-store binary. Do not invent a version bump. Never revert prior Claude work on the portfolio.
- Play: Not an app listing. Play data does not apply. Store badges on the résumé must be honest (only if a listing is really open).
- Vault entry names only: GitHub org terrellfrancistk-cpu (name only)

## Files in this zip

CLAUDE_START_HERE.md, AUDIT.md, SPEC.md, STATUS.md, STORE_REVIEW.md, PLAY_DATA_INPUT.md, REMOVAL_AUDIT.md, PROGRESS.md, HANDOFF_TO_HOUSE_OFFICER.md, PROPOSED_REMOVALS.md, VISION.md, STANDARD.md, APP-HARDENING-PLAYBOOK-for-TK-Hub.md, CLOUD_SETUP.md, examples/github-workflows/, docs/. TORQ and Ascendium also include UNREAL_PLAN.md.


## Design perfection rounds (required, after Play data, store review, removal audit, and AUDIT holes)
Run UX_PERFECT_ROUNDS_PROMPT.md on the website until each outputs PERFECT. Rule #1 (no removals without Terrell's approval) overrides any subtractive round: log it in PROPOSED_REMOVALS.md instead.


## Use every paid tool
See PAID_TOOLS.md: use all of Terrell's paid tools (Higgsfield, Meshy, Unreal, etc.) for the most realistic assets. No new spending without his OK.
