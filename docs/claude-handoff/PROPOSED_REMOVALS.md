# PROPOSED_REMOVALS — wait for Terrell's explicit approval

**App:** terrellfrancis.app (personal portfolio website)  
**Rule #1:** Nothing in this file may be deleted, dropped, reverted, or unshipped until Terrell approves the specific row in his own words. Add or fix only until then.

If a change looks like it needs a removal (dead code, unused route, dangerous endpoint, duplicate screen, leftover builder asset), add a row and keep building around it. Prefer a flag, a tighter policy, or an additive fix.

| Date (America/Chicago) | What | Path / table / route | Why you think it should go | What would replace it | Risk if left | Risk if removed | Terrell's decision |
|---|---|---|---|---|---|---|---|
| 2026-11-13 | Small "TK HUB" caption text under the logo on the black splash screen | `index.html` `.splash-b span`; `styles.css` `.splash-b span` | STANDARD ONB-1 says the black TK Hub screen has "no bar, gradient, or caption". The logo image already says TK HUB. | Nothing (logo alone) | Minor deviation from the house splash rule | Very low: the logo already reads TK HUB | Pending |
| 2026-11-13 | Dead JS from cut sections: studio iframe switcher, hero phase-list animation, glow on `.principle` / `.product` cards | `script.js` ("Product studio", "Hero card: walk the implementation phases", `.case, .principle, .product, .edu-card` glow list) | Matches nothing on the page since Nov 6 (verified by DOM scan); about 1 KB | Nothing. Keep if he wants the studio or phase strip back (REMOVAL_AUDIT rows 2 and 4). | ~1 KB of unused JS; none at runtime (each block exits early) | Low; but it is the code needed to bring those sections back | Pending |
| 2026-11-13 | Dead CSS from cut sections (no element on any page uses these classes) | `styles.css`: `.studio*`, `.panel-*`, `.phone*`, `.product*`, `.products-note`, `.principle*`, `.launch*`, `.phase-*`, `.pill*`, `.about-*`, `.contact-grid`, `.contact-list`, `.cl-label`, `.skill-card`, `.skill-grid`, `.chips`, `.edu-grid`, `.status`, `.btn-outline-light` | Unused since the Nov 1–7 rounds (verified with a stylesheet-vs-DOM scan across `/`, `/privacy/`, 404 and splash) | Nothing | ~10–12 KB of unused CSS (about 2–3 KB after the deploy minifier and gzip) | Low; same caveat: needed to restore those sections | Pending |
| 2026-11-13 | **Decision only, not a recommendation:** personal phone, email and city on the public page, in the JSON-LD (machine-readable for scrapers), and in the résumé PDF | `index.html` contact, dock, JSON-LD `email` / `telephone` / `address`; `assets/Terrell_Francis_Resume.pdf` | Listed only because the Nov 13 brief says to keep work free of personal info. REMOVAL_AUDIT says this is his call, and he restored these himself in PR #3. | If he wants less exposure: keep the email and LinkedIn, drop the phone from JSON-LD only, or move it to the résumé PDF only | Phone and email stay public and scrapable (as he chose in PR #3) | Recruiters lose the one-tap Call button | Pending (no change made) |

Not proposed (kept on purpose): `assets/apps/wrace.png` (still the TORQ tile image; renaming is not needed), the tkhub.app/torq/ redirect link (STANDARD says /torq stays a redirect stub), `.nojekyll`, `CNAME`.

No rows approved in this pack at pack time.
