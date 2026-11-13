# PROPOSED_REMOVALS — wait for Terrell's explicit approval

**App:** terrellfrancis.app (personal portfolio website)  
**Rule #1:** Nothing in this file may be deleted, dropped, reverted, or unshipped until Terrell approves the specific row in his own words. Add or fix only until then.

If a change looks like it needs a removal (dead code, unused route, dangerous endpoint, duplicate screen, leftover builder asset), add a row and keep building around it. Prefer a flag, a tighter policy, or an additive fix.

| Date (America/Chicago) | What | Path / table / route | Why you think it should go | What would replace it | Risk if left | Risk if removed | Terrell's decision |
|---|---|---|---|---|---|---|---|
| 2026-11-13 | Small "TK HUB" caption text under the logo on the black splash screen | `index.html` `.splash-b span`; `styles.css` `.splash-b span` | STANDARD ONB-1 says the black TK Hub screen has "no bar, gradient, or caption". The logo image already says TK HUB. | Nothing (logo alone) | Minor deviation from the house splash rule | Very low: the logo already reads TK HUB | **Keep as is — Terrell, 2026-11-13:** "Keep everything else as is too (Rule #1: nothing removed)." Not removed. |
| 2026-11-13 | Dead JS from cut sections: studio iframe switcher, hero phase-list animation, glow on `.principle` / `.product` cards | `script.js` ("Product studio", "Hero card: walk the implementation phases", `.case, .principle, .product, .edu-card` glow list) | Matches nothing on the page since Nov 6 (verified by DOM scan); about 1 KB | Nothing. Keep if he wants the studio or phase strip back (REMOVAL_AUDIT rows 2 and 4). | ~1 KB of unused JS; none at runtime (each block exits early) | Low; but it is the code needed to bring those sections back | **Keep as is — Terrell, 2026-11-13:** "Keep everything else as is too (Rule #1: nothing removed)." Not removed. |
| 2026-11-13 | Dead CSS from cut sections (no element on any page uses these classes) | `styles.css`: `.studio*`, `.panel-*`, `.phone*`, `.product*`, `.products-note`, `.principle*`, `.launch*`, `.phase-*`, `.pill*`, `.about-*`, `.contact-grid`, `.contact-list`, `.cl-label`, `.skill-card`, `.skill-grid`, `.chips`, `.edu-grid`, `.status`, `.btn-outline-light` | Unused since the Nov 1–7 rounds (verified with a stylesheet-vs-DOM scan across `/`, `/privacy/`, 404 and splash) | Nothing | ~10–12 KB of unused CSS (about 2–3 KB after the deploy minifier and gzip) | Low; same caveat: needed to restore those sections | **Keep as is — Terrell, 2026-11-13:** "Keep everything else as is too (Rule #1: nothing removed)." Not removed. |
| 2026-11-13 | personal phone, email and city on the public page, in the JSON-LD (machine-readable for scrapers), and in the résumé PDF | `index.html` contact, dock, JSON-LD `email` / `telephone` / `address`; `assets/Terrell_Francis_Resume.pdf` | Listed only because the Nov 13 brief says to keep work free of personal info. REMOVAL_AUDIT says this is his call, and he restored these himself in PR #3. | If he wants less exposure: keep the email and LinkedIn, drop the phone from JSON-LD only, or move it to the résumé PDF only | Phone and email stay public and scrapable (as he chose in PR #3) | Recruiters lose the one-tap Call button | **Keep — Terrell, 2026-11-13:** "terrellfrancis.app is his live portfolio and resume. Keep his email and phone exactly as they are and stop flagging them." Closed; not to be raised again. |
| 2026-11-13 | Old share image (says "Implementation & onboarding leader", plain TF badge) | `assets/og-image.png` | Superseded: `og:image` / `twitter:image` now point to `assets/og-image-2026-11.png`, which matches today's title and mark. Old file kept so any cached link still resolves. | `assets/og-image-2026-11.png` (already live on this branch) | 125 KB unused file; old previews cached by LinkedIn keep the old look until re-scraped | None for visitors; old cached previews may 404 until re-scraped | **Keep as is — Terrell, 2026-11-13:** "Keep everything else as is too (Rule #1: nothing removed)." Not removed. |

## Proposed changes that hide, replace or swap something (same rule: wait for Terrell)

Terrell's hard rule (2026-11-13): never remove, delete, hide, redirect, stub, disable, rename or downgrade anything without his explicit approval; only improve or add.

| Date | What | Where | Why it was proposed | Current state | Risk if approved | Terrell's decision |
|---|---|---|---|---|---|---|
| 2026-11-13 | **R4: collapse job bullets on phones** (three shown, the rest behind "Show more") | `script.js` "R4", `styles.css` "R4" | Phone page was long (timeline −23% with it on) | **Off.** It hid content, so this session turned it off as soon as the rule arrived. Every bullet shows on every screen, as live. The code stays and only runs with `<html data-collapse-roles="on">`, which nothing sets; opt-in tests keep it working | Recruiters on phones see three bullets per role until they tap | Pending |
| 2026-11-13 | **Link-preview image swap**: `og:image` / `twitter:image` point to the new `assets/og-image-2026-11.png` instead of `og-image.png` | `index.html` head | Old preview says "Implementation & onboarding leader"; new one matches his current title and mark | On the work branch only; old file kept unchanged. Shown in `BUILD_FOR_APPROVAL.md` | LinkedIn/Slack previews change look after re-scrape | Pending (part of the build approval) |

Not proposed (kept on purpose): `assets/apps/wrace.png` (still the TORQ tile image; renaming is not needed), the tkhub.app/torq/ redirect link (STANDARD says /torq stays a redirect stub), `.nojekyll`, `CNAME`.

No rows approved in this pack at pack time.

**2026-11-13: Terrell decided every row above: keep. Nothing in this file was removed.** New proposals, if any, go in new rows.
