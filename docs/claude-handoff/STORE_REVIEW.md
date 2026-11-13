# STORE_REVIEW — terrellfrancis.app

Priority: after Rule #1, safety rails, and Play-usage fixes (permanent #1), get this app through **Apple App Review** and **Google Play review**.

Claude (cloud session): fix causes in code and metadata (add-only), prepare demo / review accounts (vault names only), Data safety / privacy labels, account deletion, and **draft** Resolution Center / Play Console reply text in this file. House Officer posts replies and resubmits **only after Terrell's OK**. Do not send, click Reply, or resubmit from a CLI.

Re-open official policy pages before relying on a date. Policies change.

## Known issues for this app (dated evidence, not a fresh Console probe)

### Google Play / Apple
- Not an app. Honest store links only. No fake downloads.

## Vault names for demo / review accounts (no passwords)

- GitHub org terrellfrancistk-cpu (name only)

Prove sign-in on staging or in a headless Playwright run against a **non-production** host first, or record BLOCKED if captcha / 2FA needs a human. Then ask House Officer to put the same vault account in Play Console and App Store Connect sign-in details.

## Draft reply (fill in; do not send)

### Apple Resolution Center
- Guideline(s) cited:
- What we changed (PRs, build number, unique behavior):
- Answers to Apple's questions (all 9 if 4.3 + 4.2.6):
- Demo account (vault name only):
- Terrell's OK to send: pending

### Google Play Console
- Policy / access issue cited:
- What we changed:
- Demo login (vault name only):
- Data safety / declarations updated (yes/no, what):
- Terrell's OK to send or resubmit: pending

## Pre-submission checklist — Apple

- [ ] The binary is the current intended build, not a stale attached build
- [ ] Unique value vs siblings is real (not a recolor). 4.3 / 4.2.6 addressed
- [ ] If this account has an Extended Review warning: substantial change exists, and Terrell wrote or approved the reply
- [ ] Demo / review login works; credentials are in the review notes (House Officer)
- [ ] Account deletion in the app (type DELETE) and a public web deletion page
- [ ] Privacy policy URL renders; App Privacy label matches the code; Privacy Manifest present
- [ ] Sign in with Apple uses a correct system-style control if Apple sign-in is offered
- [ ] No leftover builder names, no Rork hostnames, no personal contact, no fake data as live
- [ ] IAP / subscriptions only if the product actually sells digital goods that way; TORQ must not add IAP
- [ ] Permissions and required-reason APIs are honest
- [ ] Support contact works
- [ ] Nothing submitted without Terrell's OK

## Pre-submission checklist — Google Play

- [ ] Demo / review login in Sign-in details; proven working
- [ ] Data safety form matches the binary (including SDKs, location precise vs approximate, Health Connect only if truly used)
- [ ] Account deletion in-app and a public web URL that renders
- [ ] Policy warnings (AD_ID, child safety, photos, location, FGS) declared and consistent with the manifest
- [ ] Android Auto / Automotive claims match the binary (exclude if the feature was removed — and do not delete leftover code without approval; hide or stop claiming it)
- [ ] Production usage vitals reviewed in PLAY_DATA_INPUT.md
- [ ] Privacy policy and terms URLs render
- [ ] Package / applicationId is the existing listing (do not rename a published id)
- [ ] No in-review submission is altered if Terrell froze it
- [ ] Nothing submitted without Terrell's OK
