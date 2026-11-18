# Nov 18 brief audit — terrellfrancis.app

Brief from Terrell (via Chief), Nov 18, 2026: (a) no trace of the build tools named in the brief anywhere on the site, copy, assets, URLs, emails or linked pages; privacy and support hosted on terrellfrancis.app or tkhub.app. (b) every TK Hub or product contact email is `support@tkhub.app`; never a personal Gmail in a product or support field. (c)/(d) no App Store or Play listing, so no store work here.

## (a) Build-tool names

| Where | Result | How checked |
|---|---|---|
| Every published file (HTML, CSS, JS, manifest, robots, sitemap, README, CNAME) | **None** | case-insensitive search of every file `pages.yml` publishes |
| File names and URLs on the site | **None** | file list; every `href` / `data-demo` |
| Images, icons, fonts, résumé PDF (embedded text and metadata) | **None** | strings scan of every asset; PDF text + info |
| Privacy page | Hosted at `terrellfrancis.app/privacy/` | canonical tag; `support.spec.mjs` |
| Guard | `tests/e2e/vendor-names.spec.mjs` fails the build if a name appears in any published file | runs in CI |

**Linked pages (other projects' sites, not editable here).** `bash tests/check-linked-pages.sh` (one read-only GET each), Nov 18:

| Linked page | Finding (page source only; nothing a visitor sees) |
|---|---|
| tkhub.app, /noir/, /radr/, /torq/, apexpeakofcare.app | Clean |
| getoncurb.app | 1: a `data-…-toolkit-auth` attribute on a script tag |
| tryzilt.app | 5: toolkit sign-in shim (attribute + variable names) |
| tryafterglow.app, trynoir.app, tryourpeople.app | 7 each: toolkit sign-in shim, one HTML comment, one API host in a comment |
| trybooked.app | 17: toolkit sign-in shim plus host checks for the builder's domains and a storage key |
| tryrole.app, the older personal site, LinkedIn x2 | Not reachable from this sandbox |

These need the sessions that own those sites; passed up in the reply to Chief.

**This repository's internal handoff docs** (`docs/claude-handoff/`, never published to the site, but the repo is public) quote the names many times: the pack's own VISION / STANDARD text, the removal audit, and this file. Rewording or moving them is a removal of pack content, so it waits for Terrell's yes.

## (b) Contact emails

| Field | Address | Status |
|---|---|---|
| Hero "Email me", Contact section, phone dock, Person structured data, résumé PDF | Terrell's personal address | His own résumé contact, not a product or support field. Kept exactly as is under his Nov 13 and Nov 14 orders (guarded by `contact.spec.mjs`). Changing it needs his yes |
| TK Hub / product contact | none existed | **Added** `support@tkhub.app`: footer line under the TK Hub brand, privacy page, and TK Hub LLC's `contactPoint` in the structured data (address confirmed on tkhub.app's own footer) |
| Guard | `tests/e2e/support.spec.mjs`: support link present; no Gmail anywhere in the products section, studio or footer; structured data support contact | runs in CI |

## Release testing

Every build runs the full suite in phone emulation (390 px, touch) and desktop, on the source and on the minified build, before any release. There is no native app, so no device simulator applies.
