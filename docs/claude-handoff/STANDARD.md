# STANDARD — What every production TK Hub app must have

**Date:** Friday, Nov 13, 2026, America/Chicago  
**Scope:** These sessions are **TK Hub only**. Do not work on any other company's product in personal Claude or any personal account.

**Use:** Each app zip has an `AUDIT.md` that marks every item below **Present**, **Partial**, or **Missing**, explains why (with evidence), and tells Claude how to add or fix it. Product features unique to one app live in that app's `SPEC.md` and are also audited there (BUILT / PARTIAL / MISSING / BLOCKED).

## Rule #1 — NEVER remove without Terrell's explicit approval

This rule sits above every other rail, including the hardening playbook, store checklists, and parity work.

Claude (and any model in a Claude Code cloud session, including with bypass permissions) must **never remove** any of the following without Terrell's explicit approval, in his own words, for that specific item:

- features or screens
- files or code
- data
- database tables or columns
- routes or APIs
- dependencies
- assets, copy, or configuration that a user could notice

**Add or fix only.** Close gaps by adding or improving. If something looks unused, dead, dangerous, or duplicative, do not delete it. Write it up in `PROPOSED_REMOVALS.md` (what, where, why, what would replace it, risk if left, risk if removed) and wait. A security fix that seems to "need" a deletion is still a proposal until he approves it — prefer adding a tighter policy, a gate, or a flag over deleting.

Bypass permissions in Claude Code does **not** grant removal, merge, production deploy, store submit, or spend.

---

## 0. Safety rails (how work is done)

These are not optional features. They are the way Claude is allowed to work so fine-tuning cannot break a live app.

| ID | Requirement | Present means |
|---|---|---|
| RAIL-0 | **NEVER remove without Terrell's explicit approval** | Add or fix only. Proposed deletions go in `PROPOSED_REMOVALS.md` and wait. This outranks every other rail. |
| RAIL-1 | Staging database or branch only | Changes are developed and tested against a staging project/branch, never against production data. Scripts refuse the production URL. |
| RAIL-2 | Add-only parity | iOS / Android / web gaps are closed by adding or improving. No feature is removed to match. Removals need Terrell's OK. |
| RAIL-3 | k6 baseline before and after speed work | A baseline on today's code is saved before any performance fix. The same smoke test is re-run after each fix. Never load-test production. Never use real people's data. |
| RAIL-4 | Tests before and after each change | Existing tests are run before the change and after. Typecheck, lint, and isolation tests still pass. |
| RAIL-5 | No production deploys, merges, or store submits without Terrell's OK | PRs stay open for review. Migrations, functions, DNS, publishes, and store submits wait. |
| RAIL-6 | Never revert existing work, especially Claude's | Fix forward. Keep 2.0.0 where it already landed. Keep title/bundle changes (for example TORQ: Drive the World, `com.tkhub.torq`). |
| RAIL-7 | Small, reviewable PRs | One topic per PR, branch from current `main`, plain description, squash merge only after OK, no force-push. |
| RAIL-8 | Rork is simulators only | GitHub is the source of truth. Claude codes in GitHub. Rork is not used to edit or publish unless Terrell explicitly asks. |
| RAIL-9 | No secrets in git or in chat | Vault entry names only. `.env` is gitignored. Only publishable keys belong in the client. |
| RAIL-10 | One app at a time; Ultracode off for routine work | Do not start the next app until this app's gap build is done or blocked. |

---

## 1. Auth and accounts

| ID | Requirement | Present means |
|---|---|---|
| AUTH-1 | Real sign-in | Google, Apple, X, email+password, create account, magic link, as the SPEC requires. Buttons that are not wired are visibly off, never faked. |
| AUTH-2 | Working demo / review login | A reviewer can sign in with the vault account. The same credentials are entered in Play Console and App Store Connect. Store rejection for a missing demo login is a P0 hole. |
| AUTH-3 | Email confirmation | Confirm-email is on in Auth. Privileged roles are granted only after the email is confirmed. |
| AUTH-4 | Second step (MFA) | Email or text code, plus "trust this device." If SMS is not approved, email still works and the UI says why text is off. Enforcement is in the database / API, not only on screens. |
| AUTH-5 | Session security | Lockout after bad passwords, invalid sessions rejected, no password-only token can read account data if MFA is required. |
| AUTH-6 | Account deletion | In-app deletion after the person types DELETE, that account only. A public web page can request deletion without reinstalling. Deactivation is not enough. |
| AUTH-7 | Sign-out and session revoke | Sign-out works on every surface. Stolen or expired sessions do not keep working. |
| AUTH-8 | Post-sign-in landing | After Google / Apple / magic link, the person lands in the app, not on a dead marketing page, an expired-link error, or a "you're counted" interstitial that is not home. |

---

## 2. Security, RLS, and admin

| ID | Requirement | Present means |
|---|---|---|
| SEC-1 | Row-level security | Every user table and storage bucket is isolated. A two-user SQL test (rolled back) proves strangers cannot read or write each other's rows. |
| SEC-2 | Privileged checks use the confirmed sign-in email | Not a profile email the user can change. |
| SEC-3 | Staff / admin allowlists | Only executives can change roles or the allowlist. Changes are logged. QA and review accounts have no extra rights. |
| SEC-4 | Audit log written by the database | Apps cannot invent or skip audit rows for sensitive actions. |
| SEC-5 | Secrets out of git | Repo, history, CI, example env files, and builder project secrets scanned. Private keys rotated if they were ever committed. |
| SEC-6 | Admin and studio routes gated server-side | Fail closed. A valid non-owner session gets 403, not data. |
| SEC-7 | Report and block | On every user-generated surface (chat, posts, profiles, ratings), plus a moderation path and a support contact. |
| SEC-8 | Health / sensitive data | If the app can hold patient or health data (APEX and similar), no such data goes to an outside AI. HIPAA path, BAAs, and access logs as required. Demo data never sits in a live clinic chart. |

---

## 3. Error handling and states

| ID | Requirement | Present means |
|---|---|---|
| UX-1 | Visible errors | Failures show a clear message and a way forward. No silent fail, no blank screen, no crash on a bad API. |
| UX-2 | Loading states | First open and refresh show a real loading state, not a stuck spinner or an empty flash. |
| UX-3 | Empty states | Honest empty copy. No sample or bot data when Demo is off. |
| UX-4 | Offline / network failure | A failed load keeps the last good rows. Offline is explained. Retry works. |
| UX-5 | Pull-to-refresh and return-to-tab | Refresh does not wipe the screen if the request fails. |

---

## 4. Observability

| ID | Requirement | Present means |
|---|---|---|
| OBS-1 | Crash and error reporting | Sentry or equivalent on web, iOS, and Android. DSN from env. Releases tagged. Free plan until Terrell OKs a paid plan. |
| OBS-2 | Uptime | An uptime check and, when approved, a public status page. |
| OBS-3 | No PII in logs, analytics, or push payloads | Push carries no sensitive data. Analytics events are enumerated, not raw message bodies or health data. |

---

## 5. Push, email, and messaging

| ID | Requirement | Present means |
|---|---|---|
| COM-1 | Transactional email works | Sign-in codes, magic links, receipts, and security notices send from the owned domain, not a rork.live preview. From / Reply-To use the app support inbox. |
| COM-2 | Push | Consent, APNs / FCM configured in the secret store (not printed), payloads have no sensitive data, a visible indicator if the app records. |
| COM-3 | SMS | Only after the campaign is approved. Consent language, STOP/HELP, marketing vs transactional. If not approved, email remains the path. |

---

## 6. Payments (if the app sells anything)

| ID | Requirement | Present means |
|---|---|---|
| PAY-1 | Honest paywall | Uses the existing Stripe account. No second Stripe account. Missing keys produce an honest closed paywall, not a fake "opens soon." |
| PAY-2 | Store vs web billing | IAP / Play Billing for in-app digital goods; web checkout only where policy allows. A purchase on one surface unlocks the others. Android never tells a Play user to buy on iPhone. |
| PAY-3 | Test vs live keys separated | Staging only accepts test keys. Never exercise live payments in QA. |
| PAY-4 | Restore purchases and receipts | Restore works. Server verifies store receipts. |
| PAY-5 | Pricing matches what Terrell accepted | Do not raise a yearly price or invent a new product id. Confirm against the SPEC and the live billing plans. |

TORQ is an exception in the SPEC: no ads, no IAP, no subscriptions, no cash-out, house money only.

---

## 7. Accessibility, performance, parity

| ID | Requirement | Present means |
|---|---|---|
| A11Y-1 | WCAG 2.1 AA | VoiceOver, TalkBack, contrast, large text, 44-pt / 48-dp targets, keyboard on web, labels on controls. |
| PERF-1 | Speed targets | After a k6 baseline: CI smoke (50 users, 2 min) p95 < 500 ms, errors < 1%. Tier 1 (when a paid DB is approved): reads p95 < 500 ms, writes p95 < 800 ms, HTTP errors < 0.5%, sign-in ≥ 99.5%. |
| PERF-2 | No full-account polling | Load per screen. Page long lists. Indexes on foreign keys and filters. Change-check instead of reloading everything. |
| PAR-1 | iOS, Android, and web match 1-for-1 | Feature matrix from the code. Allowed N/A only with a working handoff. Gaps closed by adding, never by removing. |
| PAR-2 | Deep links | Universal Links / App Links work installed and not installed, signed in and out. |

---

## 8. Privacy, legal, and store listing

| ID | Requirement | Present means |
|---|---|---|
| LEG-1 | Privacy policy and terms | Linked in the store and in the app. They match real data flows and name processors. Pages render, they do not bounce home. |
| LEG-2 | App Privacy label / Play Data safety | Filled from the code, including SDKs. Precise and approximate location declared separately if used. |
| LEG-3 | Privacy Manifest and required-reason APIs on iOS | `PrivacyInfo.xcprivacy` present. No tracking unless you truly track (then ATT). |
| LEG-4 | AI data consent | Before personal data is sent to a third-party model: name the providers, say what is sent, make it revocable. Strip sensitive fields. Health/patient data never goes to an outside model. |
| LEG-5 | Biometric consent | Purpose, retention, vendor, and a deletion path before face or similar capture. |
| LEG-6 | Children and age | Adults-only apps actually block minors. Kids products (Air Kids, Curb Kids, Jolt) follow the kids policy, parent PIN, and Play/Apple child-safety declarations. |
| LEG-7 | Store listing assets | Screenshots, description, support URL, and privacy URL match the current binary. No template look, no leftover builder names, no unused permissions. |
| LEG-8 | Unique value (Apple 4.3 / 4.2.6) | The app is not a recolor of its siblings. Differentiation work stays add-only. Apps that carry an Extended Review / Developer Program removal warning are not resubmitted without a substantial change and Terrell's own words. |
| LEG-9 | Permissions | Request only what a shipping feature needs, just in time. No background location unless there is a real, explained need. |

---

## 9. Onboarding, settings, support, admin

| ID | Requirement | Present means |
|---|---|---|
| ONB-1 | Splash | Product logo → solid black centered TK Hub logo ~1s → real content. No bar, gradient, or caption. Correct order on web and native. |
| ONB-2 | First-run | Permissions just in time. Usage-data / analytics door is an explicit choice, remembered, and not a dark pattern. |
| SET-1 | Settings | Account, notifications, privacy, theme (Light / Dark / System), legal links, delete account, sign out. |
| SUP-1 | Support | A working support path and inbox. Contact actually receives mail. |
| ADM-1 | Admin tooling | Gated server-side, audited, no extra rights for QA accounts. |

---

## 10. Staging, backups, CI, versioning

| ID | Requirement | Present means |
|---|---|---|
| STG-1 | Staging database | Second Supabase project or branch, same migrations, no real people's data, seed and k6 scripts refuse production. |
| STG-2 | Backups and rollback | Database backups exist. An undo script is ready before a dangerous policy or hook change. |
| CI-1 | CI and tests | Unit tests, isolation test, web tests in CI. Android UI tests if missing. iOS tests grow. Store or release builds are not the first time tests run. |
| VER-1 | Versioning | Do not bump after routine fixes. Never revert 2.0.0 where it landed. Next official bump is 2.1.1 only with Terrell's OK. |

---

## 11. Hosting and deploy notes (all apps)

- **GitHub is the source of truth.** Org `terrellfrancistk-cpu`. Claude codes in GitHub.
- **Rork is for cloud iOS/Android simulators and previews only.** A stale Rork copy must never push over `main`. Stop simulators when idle. Credits need Terrell's OK.
- **APEX:** merging to `main` auto-deploys apexpeakofcare.app. Treat any further merge as a production publish.
- **tkhub.app:** a push to `porkbun-live` deploys immediately. `/wrace` and `/torq` stay redirect stubs to `/`. Never republish those routes as a playable web game.
- **Zilt Play 2.0.0** was in review as of Nov 9, 2026. Do not touch that review (do not pull, replace, or alter the submission) until Terrell says otherwise.
- **ROLE publish** and the **NOIR Rork rebuild** have been on hold until Terrell says go.

---

## Work inside each app (order)

1. Hole-finding audit against VISION, STANDARD, SPEC, and known QA holes. Patch before new features.
2. Security review (playbook §1). Open PRs, staging only.
3. Stand up staging, separate from production (playbook §2).
4. k6 load-test kit and a baseline on today's code (playbook §3).
5. Phase 1 performance fixes, one PR each, measured on staging (playbook §4).
6. Platform parity: iOS, Android, and web, add only (playbook §5).
7. Store and privacy checklist, drafts only (playbook §6). Submit nothing without OK.

---

## 12. Scope, testing rigor, and definition of done

Each Claude Code cloud session owns **one TK Hub app and that app's marketing website** (the owned domain and how it is hosted). It is responsible for getting **both** to 100%. Do not start a second app in the same session. These sessions are TK Hub only.

### What to implement

Every feature Terrell wants, as written in `VISION.md`, this `STANDARD.md`, the app `SPEC.md` (from the TKHub Solutions production spec), and the holes and gap table in `AUDIT.md`. Add or fix only. Never remove anything without his explicit approval.

### Testing rigor (playbook level and beyond)

Before calling an item Present, it must have passing tests at least this deep, and more where the app's risk is higher (payments, health data, kids, live location, account deletion):

- Unit tests for new and changed logic
- Integration tests for API, auth, and database paths
- Security / RLS isolation tests (two-user, rolled back)
- Playwright E2E on the web app **and** the marketing site (staging / preview hosts only; production URLs refused)
- Visual regression on the marketing site and key web-app screens (phone and desktop widths; screenshots stored as artifacts)
- Accessibility checks (axe or equivalent on web, plus VoiceOver / TalkBack on the House Officer handoff when a device is needed)
- Android emulator or Gradle/EAS checks (emulator on `workflow_dispatch` only until minutes are approved)
- iOS checks: unit/Swift tests in the sandbox where they run; Xcode / device / TestFlight on the House Officer handoff until a Mac runner is approved
- k6 load: a baseline on today's code, then the same smoke after speed work, staging only
- Performance budgets from this standard (CI smoke p95 < 500 ms, errors < 1%)

iOS, Android, and web (including the marketing site) stay at parity. Close gaps by adding, never by removing.

### Definition of done (100%)

The app and its website are at 100% only when all of the following are true:

1. Every `AUDIT.md` STANDARD item is **Present** and covered by passing tests.
2. Every `SPEC.md` product item is **BUILT** (or **BLOCKED** with a named human click that only Terrell or House Officer can do) and tested.
3. iOS, Android, and web/marketing-site parity holds, with no removals pending without OK.
4. `PROGRESS.md` shows **100%**, with a final verification report: tests run, evidence paths, live-vs-staging notes, and remaining BLOCKED rows.
5. A scored `PROGRESS.md` was updated after **every** work block, not only at the end.

**100% on the work branch and on staging is not a production publish.** Merge, deploy to a live domain, store submit, or spend still waits for Terrell's OK.

### PROGRESS.md

Keep a running production-ready percent: `Present` (and BUILT) items divided by all applicable AUDIT + SPEC items, excluding N/A. After each work block write: date (America/Chicago), old % → new %, items that changed, tests run, and what is left. Opening % values in this pack are stale dated scorecards; re-score against `AUDIT.md` in the first work block and replace the opening number.


---

## 13. Permanent priority #1 — Play production usage

For every app that has (or has ever had) a Google Play production listing, **checking Play production data and fixing anything that is reducing usage is always priority #1.** This sits above feature work, polish, and even store-reply drafting, but it does **not** outrank Rule #1 (never remove without approval) or the safety rails (no production deploy, merge, store submit, or spend without Terrell's OK).

House Officer drops the latest Play Console numbers into `PLAY_DATA_INPUT.md` (acquisitions, uninstalls, active users, ratings and reviews, Android vitals / crash / ANR, policy status). Claude cannot open the Play Console GUI. After each drop, Claude must:

1. Identify what is costing users (crashes, ANRs, policy flags, broken sign-in, slow loads, uninstall spikes, 1-star reviews).
2. Fix those issues additively on a branch, with tests, on staging.
3. Leave a short action log in `PLAY_DATA_INPUT.md` and update `PROGRESS.md`.
4. Put any Console click (reply, resubmit, listing edit, staged rollout) on `HANDOFF_TO_HOUSE_OFFICER.md` for Terrell's OK.

If House Officer has not yet dropped numbers, say the data is missing, do not invent rates, and still fix known production issues already in `STORE_REVIEW.md` (for example a rejected build, a missing demo login, a crash that was already logged).
