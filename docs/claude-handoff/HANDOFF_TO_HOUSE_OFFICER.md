# HANDOFF_TO_HOUSE_OFFICER — terrellfrancis.app

This is a website-only session. There is no app-store binary and no Rork build. A push to the live branch can be a production publish — do not push without Terrell's OK. Play Console rows below are N/A unless this site links a real listing.

## terrellfrancis.app: open items from the Claude cloud session (2026-11-13)

Work branch: `claude/sharp-franklin-6cwtfa` (pushing there does **not** deploy; `pages.yml` deploys only from `main`). Test kit: `tests/` (`cd tests && npm install && npm test`). Nothing below may publish, merge, or spend without Terrell's OK.

| # | Item | Why cloud cannot | Where | Evidence already collected | Needs Terrell's OK? | Status |
|---|---|---|---|---|---|---|
| Q1 | ~~Is "10 apps shipped, idea to store" accurate?~~ **Closed 2026-11-13** under Terrell's standing rule: "For product decisions (pricing, copy, layout, proposed removals) keep everything as currently is and keep working, don't wait." The hero wording stays exactly as he wrote it. | — | — | STORE_REVIEW.md "Claude check" | — | **Done (kept as is)** |
| Q2 | ~~Decide each PROPOSED_REMOVALS row and the REMOVAL_AUDIT restore rows~~ **Answered 2026-11-13:** keep everything as is; keep his email and phone exactly as they are and stop flagging them | — | — | Decisions recorded in both files | — | **Done** |
| Q3 | **Optional, needs credit OK:** does Terrell want a 6–10 s Higgsfield reel (TF mark → name → three metrics, brand navy) for LinkedIn or the hero? Not needed for 100%; Claude did not request it | Signed-in paid tool | Higgsfield (Google SSO) | New share image already made without paid tools | **Yes** (credits) | Optional |
| H1 | Look-only live check: open https://terrellfrancis.app on a phone and a desktop. Confirm HTTP 200, the splash (TF mark → black TK Hub → page) in a fresh tab, and that the résumé downloads | This sandbox's network proxy returns 403 for the live domain | Phone + desktop browser | Local-server run: 88/88 pass, screenshots in `tests/e2e/__screenshots__` | No (look only) | Open |
| H2 | Click the 4 external links the sandbox could not reach: LinkedIn profile, TK Hub LinkedIn page, tryrole.app, and the older personal site in the footer. (The current employer's link in the timeline is Terrell's own content; these sessions do not work on that company, so automation skips it and it is not on this list.) | Sandbox DNS/proxy blocks those hosts | Live page footer | `node tests/check-external-links.mjs`: 10 OK, 0 broken, 4 unverified, 1 skipped by rule | No (look only) | Open |
| H3 | Send one test email to the address on the contact section and confirm it arrives (SUP-1) | Needs his inbox | His mail app | mailto/tel links are well-formed (test) | No, unless he prefers to do it himself | Open |
| H4 | VoiceOver (iPhone) and TalkBack (Android) pass on the live page: nav menu, case-study tabs, theme switch, contact | Physical device | Terrell's phone | axe = 0 violations in light and dark | No | Open |
| H5 | **Terrell sees and approves the exact build, then merges** PR [terrellfrancistk-cpu/terrell-francis-portfolio#7](https://github.com/terrellfrancistk-cpu/terrell-francis-portfolio/pull/7). Standing rule: nothing goes live unless he has seen and approved that exact build. Open the public preview https://terrellfrancistk-cpu.github.io/tkhub-preview/terrellfrancis-1113b/ (and `docs/claude-handoff/BUILD_FOR_APPROVAL.md`), approve fingerprint `db03980d4050be2b` in his own words, and check `bash tests/build-fingerprint.sh` prints `db03980d4050be2b` right before merging (merging `main` publishes the site) | Production publish | GitHub PR page | Approval sheet + screenshots of the minified build; CI green | **Yes** (approval of that exact build) | Waiting for Terrell |
| H6 | After H5: run the `uptime` workflow once (Actions → uptime → Run workflow). Decide whether to turn on its schedule (every 6 h; it uses Actions minutes) | Dispatch-only workflows appear only on the default branch | GitHub Actions tab | `.github/workflows/uptime.yml` | Schedule: **Yes** | Blocked on H5 |
| H7 | If `site-tests` shows `startup_failure` on the PR, Actions billing is blocking runs. **Do not** add a card or buy minutes; tell Terrell | Billing GUI | GitHub Settings → Billing | Same symptom noted on other repos in PAID_TOOLS.md | **Yes** for any spend | Watch |
| H8 | Look-only: GitHub repo Settings → Pages shows source `gh-pages` / root, custom domain terrellfrancis.app, "Enforce HTTPS" on | Signed-in GUI | Repo Settings → Pages | `CNAME`, `pages.yml` | Changes: **Yes** | Open |
| H9 | Optional, low priority: `pages.yml` (the live deploy) still uses `actions/checkout@v4`, which GitHub warns runs on deprecated Node 20. `site-tests.yml` was moved to v5 on this branch and stays green. Bumping `pages.yml` too would only take effect at a production merge | Changes the production deploy workflow | `.github/workflows/pages.yml` | CI warning text on PR #7 runs | **Yes** | Not done |
| H10 | Optional: the GitHub repo description still says "Implementation & Onboarding Leader · portfolio site" (his older title). Suggested: "Terrell Francis · Technology & Operations Leader · portfolio site (terrellfrancis.app)" | Repo settings (outward-facing metadata) | Repo page → About → edit | `mcp` PR read on 2026-11-13 shows the old text | **Yes** (his wording) | Not done |
| H11 | **Asset request (quality bar):** full-resolution originals (≥ 512×512 PNG, square, no added padding) of the **current** icons for Role (cream ROLE wordmark), RADR (green satellite dish), Noir (gold chip with diamond) and TORQ (lightning between neon posts), and of the TK Hub logo (≥ 336 px). Destination: `assets/apps/hd/<app>.png` / `assets/tkhub-logo@hd.png` on the work branch. Only from Terrell's own design files or his paid tools (Higgsfield/Meshy/Holo) with his credit OK; no stock, no AI re-draws of his marks without his OK | The only hi-res files online are different (newer) marks; generating needs his tools and credits | Design files or paid tools | Icon sheet comparing current vs official files (`tests/e2e/icons.spec.mjs` lists these four as pending) | **Yes** for any credits | Open |
| H12 | ~~PR #8 findings~~ **Resolved 2026-11-13 (Terrell/House Officer, 11:05–11:06 AM CT):** Asurion removal approved (preview first); "Talencia by KAD" is correct; role labelled **Full-time (W-2)**, never Contract; add-only otherwise. Done on PR #8's branch: base branch merged in, W-2 label added, every other bullet kept. Public preview: https://terrellfrancistk-cpu.github.io/tkhub-preview/terrellfrancis-pr8-1113/ (build `01f1e9bb491a9c68`); **waiting for Terrell to approve that exact build before any merge** | — | PR [terrellfrancistk-cpu/terrell-francis-portfolio#8](https://github.com/terrellfrancistk-cpu/terrell-francis-portfolio/pull/8) | PR #8 branch commits | **Yes** (approve the PR #8 preview build) | Waiting for approval |

Generic rows below come from the house template. For this website, rows about Play Console, App Store Connect, demo logins, store replies, Rork, and Unreal are **N/A** (no app binary, no listing).

Each row: what to do, why cloud cannot, exact console or URL, evidence already collected, and whether it needs Terrell's OK. Give **vault entry names**, never passwords.

| Item | Why cloud cannot | Where | Evidence | Needs Terrell's OK? | Status |
|---|---|---|---|---|---|
| First Play Console look-only pass (acquisitions, uninstalls, active users, ratings, vitals, policy) and drop into PLAY_DATA_INPUT.md | No GUI browser / no signed-in Console | Google Play Console for this listing | None in pack | Look-only does not, if he already authorized data collection; any edit or resubmit does | Open |
| Enter proven demo login in Play / ASC sign-in details | Signed-in Console | Play Console; App Store Connect | Vault names in STORE_REVIEW.md | Yes before resubmit | Open |
| Post Resolution Center or Play policy reply | Signed-in Console | ASC / Play | Drafts in STORE_REVIEW.md | **Yes** | Do not post |
| Resubmit a store build | Signed-in Console + billing | ASC / Play | STORE_REVIEW.md | **Yes** | Do not submit |
| Rork simulator / rebuild | Credits and Rork GUI | Rork | GitHub is source of truth | **Yes** for credits or rebuilds | Open if needed |
| Porkbun / DNS / porkbun-live | Signed-in DNS / host | Porkbun | Hosting notes in STATUS.md | **Yes** | Do not push |
| Device / VoiceOver / TalkBack / fold / NFC demo video | Physical device or Mac | Ciara's Mac / Terrell's phone | STATUS.md | Video and submits: **Yes** | Open |
| Turnstile / captcha signed-in visual | Often blocks headless | Staging or live look-only | — | If a production flag must change: **Yes** | Open |

Additional app-specific Console or device work: see STORE_REVIEW.md and the holes in CLAUDE_START_HERE.md.

### Unreal / local machine (TORQ and Ascendium only)

| Item | Why cloud cannot | Where | Evidence | Needs Terrell's OK? | Status |
|---|---|---|---|---|---|
| Install or verify Unreal Engine on the assigned desktop (TORQ: TK desktop, approved if missing; Ascendium: Razer laptop) | Local editor and toolchains | Assigned desktop | UNREAL_PLAN.md | Install on TK desktop is already approved; paid Marketplace/Fab is not | Open for those two packs only |
| Compile, cook, play, and package the game | Local GPU / editor | Assigned desktop, project path in UNREAL_PLAN.md | "Code written ≠ compiled ≠ played" | Spend, store submit, and dev kits: **Yes** | Do not submit |
| Steam partner setup, first Steam depot, console dev kits (PS5/PS6, Xbox, Nintendo) | Accounts and spend | Steamworks / platform portals | UNREAL_PLAN.md | **Yes**, every time | Do not create paid accounts |
