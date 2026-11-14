# CLOUD_SETUP — Claude Code cloud has no GUI browser

**Date:** Friday, Nov 13, 2026, America/Chicago  
**Where this work runs:** A Claude Code cloud session at claude.ai/code, opened on the app's GitHub repo, so Terrell can follow it from any device. That environment has a terminal and the repo. It does **not** have a GUI browser, a signed-in Play Console, App Store Connect, Rork, or Porkbun session.

**Rule #1:** Never remove features, screens, files, code, data, DB tables or columns, routes, dependencies, or assets without Terrell's explicit approval. Add or fix only. Proposed deletions go in `PROPOSED_REMOVALS.md` and wait. Bypass permissions do not grant removal.

This file is **step 0**. Do it before the hole-finding audit and before any product patch. These sessions are **TK Hub only**. Do not work on any other company's product here.

Every workaround below stays inside the playbook safety rails: staging only, add-only parity, tests before and after, k6 baseline before speed work, small PRs, never revert Claude's work, and **no production deploy, merge, store submit, DNS change, or spend without Terrell's OK**.

---

## What you can do in the cloud session (no GUI needed)

1. **Headless browser in the sandbox** — install Playwright and Chromium, then run E2E flows, take screenshots, and check live or staging sites. You cannot click through a GUI, but you can still see pages as artifacts.
2. **GitHub Actions** — add workflows (in a PR, not merged until OK) that run Playwright, Android emulator or EAS build checks, and k6. Upload screenshots, videos, and k6 summaries as artifacts that you read back with `gh`.
3. **CLIs** — `gh`, `supabase`, `vercel`, `eas`, `stripe`, `k6`. Credentials live as GitHub Actions or environment secrets, never in the repo.
4. **Hand off GUI-only work** — anything that truly needs a signed-in graphical console goes in `HANDOFF_TO_HOUSE_OFFICER.md` in the repo, for House Officer to do on its box. Do not stall the whole app because you cannot open Play Console yourself.

---

## 0.1 Install Playwright + Chromium headless (in the cloud sandbox)

Run this in the session when you need to look at a site or an authenticated staging flow. Prefer a dev-dependency in the app's web package if one already exists; otherwise a session-local install is fine. Do not commit Playwright browsers into the repo.

```bash
# Node is already available in most Claude Code sandboxes.
# Use the app's existing package manager if it has one.
npm init -y 2>/dev/null || true
npx --yes playwright@latest install --with-deps chromium
```

Minimal smoke (save under `artifacts/` and gitignore that folder, or write to `/tmp`):

```bash
npx playwright screenshot --viewport-size=390,844 https://STAGING_OR_PUBLIC_URL /tmp/home-phone.png
npx playwright screenshot --viewport-size=1280,720 https://STAGING_OR_PUBLIC_URL /tmp/home-desktop.png
```

For real flows (sign-in, delete-account, checkout on **staging**), add `e2e/playwright.config.ts` and specs that:

- Read base URL and test-user names from env (`E2E_BASE_URL`, `E2E_USER`, `E2E_PASSWORD` from secrets).
- **Refuse to run** if `E2E_BASE_URL` is a production host (getoncurb.app, tryzilt.app, apexpeakofcare.app, and the other live domains). Fail closed. A dedicated allow-list of staging / preview hosts is required.
- Never log passwords, OTP codes, or tokens. Mask them in traces.
- Capture screenshots and video on failure, and a short screenshot trail on success for the audit.
- Do not exercise live Stripe, live IAP, or real people's data.

You will read the PNGs with the session's file tools. If a flow needs a human-only captcha, Turnstile that blocks automation, or a passkey, record it as BLOCKED and put the signed-in visual check on the House Officer handoff — do not fight the captcha or disable it on production.

---

## 0.2 GitHub Actions workflows (add as a PR, do not merge or spend)

Add the example workflows from `examples/github-workflows/` in this zip (or an equivalent) to `.github/workflows/` in the app repo. One PR, reviewable, **left open**. Do not merge, do not enable billing, do not buy GitHub minutes, larger runners, or Firebase Test Lab, without Terrell's OK.

Historically, GitHub Actions on these private repos has failed with `startup_failure` when payment authorization failed. If Actions will not start, say so, keep running Playwright and unit tests in the cloud sandbox, and put "fix Actions billing" on the House Officer handoff. **Do not update a card or buy a plan.**

Required workflows (start in `workflow_dispatch` plus pull_request, and keep them off `main` auto-deploy):

| Workflow | What it does | Artifacts Claude reads |
|---|---|---|
| `playwright-e2e.yml` | Headless Chromium E2E against **staging / preview only** | screenshots, videos, HTML report, trace |
| `android-check.yml` | Unit tests + a debug assemble, or an EAS/Gradle check on `workflow_dispatch` | test reports, APK/AAB path (unsigned is fine), logs |
| `k6-load.yml` | Short smoke (50 VUs, 2 minutes) against **staging only**, after a baseline file exists | `k6` summary JSON/MD, compared to the last baseline |

Rules for every workflow:

- Production URLs are refused in script (same guards as the hardening playbook).
- Secrets are GitHub Environment secrets on a `staging` environment, not committed files.
- Android emulator and EAS jobs are `workflow_dispatch` only until Terrell OKs the minutes they will burn. A unit-test / assemble job may run on pull_request if it stays on the free or already-paid budget.
- iOS Xcode jobs need a Mac runner. Do not buy `macos-latest` minutes without OK. Put device/Xcode work on the House Officer handoff (Ciara's Mac) until then.
- Upload artifacts with `actions/upload-artifact` (retention 7 days). Claude downloads them with `gh run download`.

Example: read the last failed run's screenshots.

```bash
gh run list --workflow=playwright-e2e.yml --limit 5
gh run download <run-id> --dir /tmp/e2e-artifacts
# then inspect the PNGs
```

---

## 0.3 CLIs, with secrets in the host — never in git

Install only what this app needs. Use official installers. Never echo secret values. Never write them into markdown, screenshots of terminals, or commit logs.

| CLI | Typical use in this work | Secret names (names only) |
|---|---|---|
| `gh` | PRs, Actions logs, artifact download, checks | `GITHUB_TOKEN` (provided) |
| `supabase` | Link **staging** project, `db dump` / `db push` on staging, typings | staging project ref + access token in env, not the production service role |
| `vercel` | Preview deploys only. No production alias. APEX `main` auto-deploys — do not merge to main | `VERCEL_TOKEN` in secrets; never production deploy |
| `eas` / `npx expo` | If the app uses EAS, run a **preview or simulator** profile, not a store submit | `EXPO_TOKEN` in secrets. No `eas submit` |
| `stripe` | Test-mode only (`sk_test`, never live) on staging | test key in staging secrets |
| `k6` | Load baseline and smoke on staging | no production host |

Set secrets with `gh secret set` into the `staging` environment, or ask House Officer / Terrell to paste them in the repo Settings GUI. **Do not put production service-role keys, live Stripe keys, or store upload keystores into Actions** unless Terrell explicitly OKs that narrow use. Staging first.

`gh secret set STRIPE_TEST_KEY --env staging` is allowed only after Terrell OKs storing that test key, and only if you do not print it.

If a CLI would change production (supabase db push to prod, vercel --prod, eas submit, stripe live), stop and write the command, the target, and the risk into `HANDOFF_TO_HOUSE_OFFICER.md`. Do not run it.

---

## 0.4 HANDOFF_TO_HOUSE_OFFICER.md (keep this current in the repo)

Create or update `HANDOFF_TO_HOUSE_OFFICER.md` at the root of the app repo (and keep the copy in this zip in sync). It is the list of work the cloud session cannot finish because it needs a signed-in GUI or a physical/simulator device.

Typical House Officer / box items:

- Google Play Console: demo login, Data safety, declarations, review replies, resubmit (never without Terrell's OK).
- App Store Connect: review replies, TestFlight, screenshots, IAP, resubmit (never without OK). Several apps carry an Extended Review warning — no resubmit without a substantial change and Terrell's own words.
- Rork cloud simulators and any Rork rebuild (credits need OK). GitHub remains the source of truth.
- Porkbun, DNS, GitHub Connect, or a `porkbun-live` publish (tkhub.app deploys on push — do not push there).
- Visual QA on a real phone, foldable hinge, VoiceOver / TalkBack, NFC / background-modes demo video.
- Turnstile / captcha challenges that block headless login.
- Store billing / license-tester purchases.
- Anything that needs Terrell's Apple, Google, or bank 2FA.

Each handoff row must include: what to do, why the cloud session cannot, the exact URL or console, the evidence you already collected (screenshots, logs, PR links), and whether it is blocked on Terrell's OK. Do not ask Terrell for a password you already have a vault name for — give House Officer the **vault entry name**.

---

## Safety rails (repeat — they override convenience)

- **NEVER remove without Terrell's explicit approval.** Add or fix only. Proposed deletions go in `PROPOSED_REMOVALS.md`.
- Staging database or branch only. Scripts and workflows refuse production URLs.
- Add-only parity. Never remove a feature to make platforms match.
- k6 baseline before and after speed fixes. Never load-test production. Never use real people's data.
- Tests before and after each change.
- No production deploys, merges, store submits, or spend without Terrell's OK.
- Never revert existing work, especially Claude's. Never revert 2.0.0 where it already landed.
- Small reviewable PRs. One topic. No force-push.
- Ultracode off for routine work. One app at a time.
- No secrets in git, chat, or artifacts.

When a workaround would violate a rail (for example "just deploy to production so Playwright can see it"), do not take it. Use staging, or hand it to House Officer.
