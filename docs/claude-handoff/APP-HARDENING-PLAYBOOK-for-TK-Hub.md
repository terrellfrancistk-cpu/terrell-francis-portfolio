# App hardening playbook (TK Hub)

These Claude Code sessions are **TK Hub only**. Do not work on any other company's product here, and do not use personal Claude or other personal accounts for any non-TK-Hub employer work.

Use this process on Terrell's TK Hub apps (Curb, Booked, AfterGlow, NOIR, Zilt, ROLE, APEX, Our People, TORQ, RADR, the TK Hub site, and any later TK Hub app he adds). The process is generic: security review, a separate staging database, k6 load tests, performance fixes, iOS / Android / web parity, store and privacy checks, and how to use Rork (simulators only).

Apply it per app. Keep each app's own product rules. Do not copy another product's policy, legal questions, or vendor setups blindly.

## TK Hub versioning

**TK Hub versioning stays as it is.** After 1.9.9 the next official number is 2.1.1, and only with Terrell's OK. Several mains already carry a 2.0.0 label — never revert it, and do not bump further without his OK. Do not bump a version after routine fixes. Ignore any other product's version scheme.

**Rule #1:** Never remove features, screens, files, code, data, DB tables or columns, routes, dependencies, or assets without Terrell's explicit approval. Add or fix only. Proposed deletions go in `PROPOSED_REMOVALS.md` and wait.


## Hard rules (every app)

- Nothing is merged, and no migration or function is applied to production, without Terrell's OK.
- Review every pull request before merge.
- Removals need Terrell's OK first. List what, where, why, and what replaces it, then wait. Close gaps by adding or improving, never by removing a feature to make apps match.
- Never load-test production. Never use real people's data in tests.
- Never print, commit, or paste secrets. Keys stay in env vars or the secret store. Only publishable keys belong in the client.
- Do not spend money, subscribe, enter a card, or buy compute without Terrell's OK.
- No app-builder or outside-model names in user-facing text (no Rork, no Grok, and no leftover partner or template brands).
- English only. One PR per topic, plain description, branch from current `main`, squash merge, no force-push.
- Check what already exists before writing anything new.

## Recommended order

Do this on one app at a time, in this order:

1. Security review (section 1). Open PRs, staging only.
2. Stand up staging, separate from production (section 2).
3. Load-test kit and a baseline on today's code, before fixing speed (section 3).
4. Phase 1 performance fixes, one PR each, measured on staging (section 4).
5. Platform parity: iOS, Android, and web, 1-for-1 (section 5).
6. Store and compliance checklist (section 6).
7. Keep the Rork and working rules for the whole run (sections 7–8).

Use this shape: small PRs, review first, nothing merged or applied to production until Terrell's OK.

---

## 1. Security review

**Why.** App screens are not enough. If a policy is only in the client, anyone can call the API with a password and skip it. Staff checks that trust an editable profile email, or a shared review account with extra rights, are enough to become an admin.

**How.** Audit the database policies, auth hooks, and every privileged function. Fix one issue per PR. Re-run the isolation test after each change. Typical fixes (S1–S8):

1. **Privileged checks use the confirmed sign-in email**, not a profile email the user can change. Lock the profile email column, or keep it in step only after Auth confirms a change.
2. **Only executives can reset someone else's second step (2FA).** Log who reset whom, and when, *before* the reset. Email the person who was reset. Do not let a review or QA account do this. Remove any "reset every account" action.
3. **Only executives can change the staff or admin allowlist.** Every change is logged. Ordinary staff can read the list, not edit it.
4. **The audit log is written by the database**, not by the app. Apps must not be able to invent or skip audit rows. Triggers log the sensitive actions (role changes, staff-list edits, 2FA resets, and similar).
5. **Give a privileged role only after the email is confirmed.** In the Auth dashboard, **Confirm email must be ON**. If it is off, this fix does nothing.
6. **Real accounts never see sample or made-up numbers** as if they were live. Demo data is labeled and off by default.
7. **Enforce the second step in the database, not just on the screens.** Add a restrictive policy (AND with existing rules, so nobody gains access) on every signed-in table and on storage. Add an API pre-request hook that refuses signed-in calls until the second step has passed, including security-definer functions that row policies cannot reach. Leave a short allow-list for the sign-in and second-step endpoints themselves. **Important:** the apps must wait for that gate before they load account data, or a failed early load can wipe the local cache. Ship the app change first, then the database rule, then the hook. Test sign-in right after, and keep an undo script ready.
8. **Only executives can change roles.** Staff cannot create or delete profiles through the API. A privileged role can be assigned only to someone already on the allowlist.

Also do:

- **Row-level security review.** Confirm isolation with a two-user SQL test (strangers cannot read or write each other's rows; nobody can act as someone else; staff only see what they should). The test must roll itself back.
- **Secrets out of git.** Scan the repo, history, CI, example env files, and any app-builder project secrets. Git-ignore `.env`, `.env.staging`, and generated test-user files. Keep only publishable keys on the client. Rotate anything that was ever committed or stored in a personal builder project, then remove it from that account.

**Checks**

- Isolation test passes before and after each policy change.
- A non-admin cannot grant themselves a privileged role, change their profile email to match an admin, or reset someone else's 2FA.
- A password-only token cannot read or write account data; it gets a clear refusal.
- Review or QA accounts have no extra rights beyond what they need.
- `git` and CI contain no private keys, service-role keys, or passwords.
- Typecheck, lint, and the existing test suite still pass.

---

## 2. Staging, separate from production

**Why.** Load tests, seed data, and raised Auth limits must never touch production. A second project also shows whether a fresh database can be built from migrations alone.

**How**

1. Create a second Supabase project (or a branch). Same migrations as production, applied in order. No real people's data.
2. On staging only, raise Auth rate limits so a burst of test sign-ins is not refused.
3. Keep staging credentials in the shell or a git-ignored `.env.staging`. Never commit them.
4. Put guards in the seed and in the k6 scripts so they refuse the production URL, and refuse a database that already has more than a small number of real accounts. The seed should also require an explicit confirm flag (for example `-v confirm=staging`). Add a test that these guards stay in place.
5. If production has tables that were loaded outside migrations, a fresh project will fail to migrate. Add **empty stub tables** on staging with the columns the migrations read, and no data. Then put those tables into a real migration so the next environment does not need a special stub.
6. Test-only exemptions (skip 2FA, add staff to an allowlist so k6 can sign in with a password) belong on staging only. Never apply those to production.

**Checks**

- Pointing a script at the production URL is refused.
- Staging has no production rows and no real emails.
- `migrate` from an empty project succeeds (stubs included if needed).
- Sign in to one seeded test account by hand before a full seed; seeding `auth.users` directly depends on the Auth version.

---

## 3. Load testing with k6

**Why.** Passing unit tests does not prove the app holds up. A first baseline of 50 concurrent users on a small database often fails the speed limits even when errors, sign-in, and realtime look fine. That baseline is the honest starting point.

**Tiers**

| Tier | Seeded accounts | Concurrent users | When | Rule |
|---|---|---|---|---|
| CI smoke | enough for the mix | 50 for 2 minutes | Every PR and nightly | Gates block merge |
| Tier 1 | 10,000 | 2,000 | Before launch | Must pass. Launch is blocked until it does. |
| Tier 2 | 50,000 | 10,000 | Before major growth | Must pass before the growth push |
| Tier 3 | 100,000 | ramp 5,000 → 25,000 | After Tier 2 | Stress only: find the breaking point and the upgrade path |

**Pass limits (Tier 1; use these as the default gate)**

- Reads p95 < 500 ms
- Writes p95 < 800 ms
- HTTP errors (5xx and timeouts) < 0.5%
- Sign-in success ≥ 99.5%
- Realtime delivery p95 < 1 s (message reaches the other member)
- CI smoke (50 users, 2 min): p95 < 500 ms, errors < 1%

Tier 2 can be slightly looser (reads < 800 ms, writes < 1,000 ms, errors < 1%, sign-in ≥ 99%, realtime < 2 s). Tier 3 has no pass/fail; record where it breaks and which part fails first (database CPU, pooler, realtime connections, Auth rate limit, or functions).

Tier 1 at 2,000 concurrent users needs a **paid** database (Pro-class, Medium compute to start; try a smaller size after the polling fix). A free project is fine for the smoke run and the first baseline. Do not upgrade or buy compute without Terrell's OK. Downsize staging right after each run. Production only moves up when real traffic is within about 50% of the last tier that passed.

**How**

1. Build a `loadtest/` kit: seed SQL, k6 traffic mix, a realtime (websocket) script, and a `results/` folder.
2. Seed fake accounts only (use a reserved test domain). Reuse one password hash so large seeds finish in minutes. Export the user list without passwords; git-ignore that file.
3. Run a **baseline on today's code** before any speed fix. A fail is expected. Save `results/<date>-baseline.md`.
4. Run the smoke test (50 users, 2 minutes) and the realtime script.
5. After each Phase 1 fix, re-run the same smoke test and record old vs new.
6. Hold Tier 1 until the smoke gate passes and a paid database is approved.
7. After each run, write the result file: commit, compute size, data size, k6 summary, CPU / IO / pooler, first bottleneck, cost, pass or fail.

**Checks**

- Scripts refuse production.
- Baseline is saved before fixes.
- Smoke limits are either met or explained with numbers.
- Realtime connection refusals are counted.
- No keys or passwords in the repo.

---

## 4. Phase 1 performance fixes

**Why.** The usual failure is "reload everything, often." A client that reloads the whole account every few dozen seconds, or a staff desk that does it even faster, will generate hundreds of requests a second at a few thousand online users, mostly for data that has not changed. Missing indexes and per-row security checks make hot lists time out. Long lists that pull every related row (for example every RSVP on an event) make it worse.

Do one PR per fix. Measure on staging after each one. Keep the same behavior for the user.

1. **Stop full-account polling.** Add a small change log (scopes only, no personal row data): which area changed, for whom. A `my_changes(since)` call tells a signed-in person whether to reload nothing, one screen (board, inbox, feed), or everything. Use it on the timer, on returning to the tab, and on any fast staff-desk refresh. If the check is not deployed yet, fall back to a full reload so the app and database can ship in either order.
2. **Load per screen**, not the whole account, on first open and on pull-to-refresh.
3. **Indexes.** Add an index for every foreign key and every column used in a filter or security check. Add composite indexes for hot lists (for example messages by thread and time). Use the database advisor, then measure.
4. **Page lists that grow.** Keyset cursor on `(created_at, id)`, 20–50 per page, for inbox, messages, feed, comments, directory, and similar. Inbox loads the latest page first, with "show earlier."
5. **Counts, not rows, where a count is enough.** Event RSVPs should return a count plus the viewer's own row, not every attendee to every viewer.
6. **Move typing and presence off a database table.** Use Broadcast / Presence. Keep Postgres Changes only where a durable row is needed. Reconnect with backoff. Scope updates to the open thread.
7. **Sentry and uptime.** Add a crash and error reporter to web, iOS, and Android (free plan to start; DSN from env; tag releases). Add an uptime monitor and a public status page (free tier). Signing up for those accounts needs Terrell's OK if you are using his email or a paid plan.

In a measured 50-user smoke, indexes plus a one-per-query security rewrite moved reads from about 3.3 seconds to about 200 ms, writes from about 1.8 seconds to about 300 ms, and cleared inbox timeouts (0% errors). A change-check then cut full account loads roughly in half, with most later refreshes becoming a cheap check or a single-screen reload. Paging cut list load further and stopped sending every related row. Tier 1 itself should not be run on a free database (too few realtime connections, and 2,000 concurrent users need a paid plan — do not buy compute without Terrell's OK).

**Checks**

- Same smoke test, before and after each PR.
- Isolation test still passes (security rules must not change when you speed them up).
- A change is visible to the right people and not to an unrelated account.
- A failed partial reload keeps the last good rows.
- Overlapping PRs that edit the same refresh code get a conflict pass before merge.

---

## 5. Platform parity (iOS, Android, web)

**Why.** Users should get the same product on every surface. Often one platform has features the others are missing, or one platform has no automated tests. Close every gap by adding or improving. Never remove a feature to match.

**Rule.** The three surfaces match 1-for-1. No exceptions except features that only make sense on one surface, and those must hand off cleanly and report back. Close every gap by **adding or improving** the weaker app. Never remove a feature to match. Any removal needs Terrell's OK.

**How**

1. Build a feature matrix from the code, not from memory. Mark each row present, partial, missing, or "opens the shared web screen inside the app." Verify every row before building.
2. Allowed difference: something like ID or selfie capture can be mobile-only if the web app shows a QR code or deep link that continues in the app, and the desktop updates when it is done (target: a few seconds, with polling as a fallback).
3. Mobile-first features (camera, location clock-in, push, biometric unlock, offline next-shift info) hand off from web to the phone. Web-first features (wide dashboards, bulk tools, reports, admin) get a usable phone version plus "open on computer" or "email me this."
4. Handoff once, reuse everywhere: a short-lived, single-use token; Universal Links and App Links; the native router opens the exact step, including after sign-in; the same URL works in the mobile browser if the app is not installed.
5. One PR per gap (or a small group), with tests on every platform touched.
6. Add Android UI tests if they are missing (Compose or Maestro). Grow iOS UI tests. Keep web tests in CI.
7. Test layouts at phone, tablet, and desktop widths; large text; dark mode; VoiceOver and TalkBack; 44-point targets; keyboard use on web.

**Checks**

- Final matrix: every feature is present on iOS, Android, and web (or an allowed N/A with a working handoff).
- No feature was removed to reach parity.
- Deep links work with the app installed and not installed, signed in and out, and with expired or reused tokens.

---

## 6. Store and compliance checklist

**Why.** Apple and Google reject template-looking apps, missing account deletion, hidden data use, and unpaid digital goods sold outside their billing. Reviewers also notice sample data, unused permissions, and leftover builder names. Legal rules (privacy, biometrics, health data, messages) apply whether or not a store asks.

Re-open the official policy pages before relying on a date. Policies change.

Do this after the security fixes, and before any store submission. Draft the store answers and review notes; **submit nothing** without Terrell's OK. Base every answer on the code, not on guesses.

### Apple and Google (always)

- **Account deletion** in the app (deactivation is not enough). Google also needs a public web page so a person can request deletion without reinstalling.
- **Privacy policy** linked in the store and in the app. It must match real data flows and name the processors.
- **Privacy Manifest** (`PrivacyInfo.xcprivacy`) and required-reason APIs on iOS. No tracking unless you truly track (then ATT applies).
- **App Privacy label** (Apple) and **Data safety form** (Google), including SDKs. Precise and approximate location declared separately if used.
- **Report and block** on every user-generated surface (chat, posts, profiles, ratings), plus a moderation path and a support contact.
- **AI data consent** before personal data is sent to a third-party model. Name the providers, say what is sent, and make it revocable. Strip sensitive fields from prompts. If an app can hold health or patient data (for example APEX), do not send that data to outside AI.
- **Biometric consent** before face or similar capture: purpose, retention, and vendor, plus a public retention and deletion policy. Prefer app-only capture with a QR handoff on the web.
- **No fake or sample data** shown as real. No placeholder copy. Hide unfinished work behind a flag, not "coming soon."
- **Permissions:** request only what the shipping feature needs, just in time. Use the system photo picker instead of broad photo access. No background location unless there is a real, explained need.
- **Payments:** goods and services used outside the app must not use in-app purchase. Digital features and subscriptions sold in the iOS or Android app must follow Apple IAP and Google Play Billing (or an approved alternative). Do not ship a pay button until that choice is decided.
- **Submit from the business developer account**, not a personal account or an app-builder account. One binary per app, not a near-copy with a second listing.
- **Core flows should be native**, not a website wrapped in a web view. Embedded web areas need a native bar, back gesture, offline state, and no browser chrome.
- Support contact works. Push payloads carry no sensitive data. Recording has on-screen consent and an indicator.

### Health, privacy, and other laws (check per app)

- **HIPAA and health data.** If the app creates, receives, keeps, or sends patient information, it may need business-associate agreements and a HIPAA-eligible backend. If it does not, say so clearly in the product (a "no patient info" rule in notes and chat). Do not put patient data in AI tools. Worker health records (if collected) need their own consent and access limits even when HIPAA does not apply.
- Privacy-rights requests (access, delete, correct) on the web, if a privacy law applies.
- SMS and email: consent language, STOP/HELP, marketing vs transactional, unsubscribe.
- Accessibility: WCAG 2.1 AA, VoiceOver, TalkBack, contrast, large text, 44-pt / 48-dp targets.
- Age: adults-only apps must actually block minors. Do not target children.

### App-builder leftovers (scan and fix)

Started in an app builder, then finished in GitHub, is fine — if the binary no longer looks like a template.

Scan for, and fix:

- Builder bundle IDs and package names. Change to the app's own ID **before the first public release**. The Android application ID cannot change once the app is on Play. Draft the change; do not merge until Terrell OKs the ID. Then update push certs, Associated Domains, return URLs, Auth redirect allow-lists, and `apple-app-site-association` / `assetlinks.json`.
- Builder hostnames hardcoded in sign-in return URLs or scripts. Move them to one config value. Do not flip a live return URL until the new domain is on the Auth allow-list.
- Theme names, generator comments, default icons, "Hello World" / "Lorem ipsum" / "TODO."
- User-visible vendor or partner names. Keep provider IDs on the server. Do not break tests whose job is to strip those names from AI output.
- Unused permissions, unused analytics or ad SDKs, dead screens.
- Secrets in the client (see section 1).

**Checks**

- A pass / fail / partial table with file paths, the fix, and risk.
- Store drafts written from the code, unsubmitted.
- A branding scan test fails if builder or leftover vendor names show up in user-facing strings.
- Bundle ID change stays a draft until Terrell OKs it.

---

## 7. Rork usage

**Why.** Rork is useful for cloud iOS and Android simulators. It is a poor place to edit a finished native app. Its "import from GitHub" path can rebuild the app instead of copying it, and a stale Rork copy can overwrite `main` if two-way sync is on.

**How**

- **GitHub is the source of truth.** Claude (or House Officer) makes all code changes in GitHub.
- **Rork is only for simulators and previews.** Do not use Rork chat for further edits. Do not publish the store build from Rork unless Terrell explicitly asks.
- If you import a repo to get a preview, treat that copy as **read-only**. Confirm whether anything was committed or pushed. Approve no push until someone has checked the diff.
- After a GitHub connect: pull the latest repo into Rork first. Never let a stale Rork copy push over `main`.
- Prefer a company-owned Rork account, not a personal one. If a project has to move, ask Rork support about a real transfer first; there is no self-serve transfer in the current docs. A clone belongs to the person who clones it. Collaborators spend the owner's credits and can read Secrets, so do not leave production secrets on a personal project.
- Set the real bundle ID / package name in Project Settings before any store build. Confirm simulators still build with it.
- Stop the simulator when the test is done. Credits are charged per minute while it runs (iPhone costs more than Android). Do not turn on auto top-up without a cap. Do not subscribe or buy credits without Terrell's OK. A free plan may not run simulators at all.
- After a project lives on the right account, rotate keys that were stored in the old project's Secrets, then remove the old project and any Editor access.

**Checks**

- `git` history on the real repo shows no unexpected Rork commits.
- User-facing screens have no Rork branding.
- Simulators are stopped when idle.

---

## 8. Working rules

**How to run the work**

- Give Claude a **local session** a zip plus a prompt file (what to do, hard rules, and the supporting notes). Claude works in the app repo. House Officer (or Terrell) reviews the result.
- Small PRs, one topic each. Branch from current `main`. Check `main` again before starting so you do not rebuild something that already shipped.
- **Review every PR before merge.** Read the diff, the tests, and the "how to test" notes.
- **Nothing is merged, and nothing is applied to production, without Terrell's OK.** That includes migrations, Auth hooks, Edge Functions, store submissions, and DNS.
- Staging first. Production applies only from reviewed, approved PRs, in the order the PR describes, with the checks run right after.
- If two open PRs edit the same files, the one merged second needs a conflict fix before it lands.
- Do not send email, change DNS, spend money, or invent credentials. Drafts are fine; sending is not, until Terrell says so.
- Do not claim a feature is done from a handoff line alone. Check the code or a running build.
- Do not claim a merged PR is live until it is applied to production and checked there.
- Device and simulator time is for tests, not for rewriting the app.

**When an app is "done" with this playbook**

- Security PRs reviewed; isolation test green; secrets out of git.
- Staging exists, guarded, and can be built from migrations.
- A baseline and a post-fix smoke test are on file. Tier 1 is either passed on a paid database or explicitly waiting on approval.
- iOS, Android, and web match, or the remaining gaps are listed with PRs and no removals pending without OK.
- Compliance checklist is filled, store drafts are ready, and nothing has been submitted without OK.
- Rork, if used, is simulator-only and not pushing to `main`.

