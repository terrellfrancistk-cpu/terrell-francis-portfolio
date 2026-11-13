# HANDOFF_TO_HOUSE_OFFICER — terrellfrancis.app

This is a website-only session. There is no app-store binary and no Rork build. A push to the live branch can be a production publish — do not push without Terrell's OK. Play Console rows below are N/A unless this site links a real listing.

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
