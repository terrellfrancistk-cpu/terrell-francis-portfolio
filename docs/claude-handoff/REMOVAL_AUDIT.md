# REMOVAL_AUDIT — terrellfrancis.app

**Top work item.** Claude's earlier passes removed or left behind features that were in Terrell's original prompts. This session must find that, and either restore it or present it to him.

## Rule

- Never remove features, screens, files, code, data, DB tables or columns, routes, dependencies, or assets without Terrell's explicit approval.
- If it was in his **original prompt or SPEC** for what this app should do, **restore it additively** (on top of current work). Do not revert other good Claude work to do that.
- If a removal has a **reason** (policy, store, safety, uniqueness), do not silently restore and do not silently drop it from the record. Write the item, the reason, and the evidence in `PROPOSED_REMOVALS.md` and wait for his decision.
- Bypass permissions do not grant removal.

## How to run the audit

1. Read `SPEC.md`, `VISION.md`, and any original prompt material in `docs/`.
2. Diff git history on this app's repo(s), especially Nov 5–9 Claude work and later "landing-only" or uniqueness PRs. Use `git log`, `git log --diff-filter=D`, and PR discussions. Note files, screens, routes, and features that disappeared.
3. Compare the current app (code + staging / allowed public URLs) to the SPEC must-have list.
4. Fill the table below. For each dropped original-prompt item: restore in a small PR, or file it in `PROPOSED_REMOVALS.md` with a reason.
5. Update `PROGRESS.md`.

## Pack-time leads (start here, then do the full diff)

- Do not strip a current-role entry that is already on the live site. If someone proposes removing personal contact or the city line, list it in PROPOSED_REMOVALS.md and wait — this is the one site where he has historically wanted personal contact, and it is his call.

## Findings table (fill in the session)

| Date | Item | Was in original SPEC/prompt? | What happened (commit / PR) | Restore / propose / already present | Evidence | Terrell's decision |
|---|---|---|---|---|---|---|
| 2026-11-13 | Personal contact (email, phone, city) on the page and in the résumé PDF | Yes, his choice (he restored it; reconfirmed 2026-11-13: keep exactly as is, stop flagging) | Removed in PR #2 (`0cbaa63`, Oct 24), restored in PR #3 (`2744db5`, same day) | **Already present.** Not touched. | `index.html` contact block, dock, JSON-LD; `assets/Terrell_Francis_Resume.pdf` | n/a (present) |
| 2026-11-13 | Live product studio: phone-frame iframe demo that followed the selected app, plus a per-app panel | Not in SPEC.md (SPEC asks for working links and honest badges) | Cut in `a881646` (Nov 6), "app demos move to tkhub.app" | **Present elsewhere:** tkhub.app runs every app in a phone frame, and the Products section links there ("Try every app live, in a phone frame, at tkhub.app"). Not restored, to avoid a second copy of the house shelf. Leftover JS/CSS kept (see PROPOSED_REMOVALS row 2). | `git show a881646 -- index.html`; `index.html` products-foot link; tkhub.app returns 200 | **Keep as is — Terrell, 2026-11-13:** "Keep everything else as is too." (No restore, no further trim.) |
| 2026-11-13 | One-line description per app (what each app does) | Not in SPEC.md | Cut with the studio in `a881646` (Nov 6); tiles now show name + category | **Propose.** Restorable additively as one short line per tile. Two old lines would break VISION if restored verbatim (RADR described as a police/radar map; "WRACE"), so a restore needs rewritten copy. | `git show a881646` | **Keep as is — Terrell, 2026-11-13:** "Keep everything else as is too." (No restore, no further trim.) |
| 2026-11-13 | "How I run an implementation" phase strip (kickoff → configuration → training → go-live → support) | Not in SPEC.md | Cut in `787eba0` (Nov 6), "cut implementation strip … ENOUGH IS ENOUGH" | **Propose.** The method is still told in case studies 01–04. The commit title suggests a deliberate trim, so not silently restored. Its CSS/JS is still in the repo (PROPOSED_REMOVALS row 2). | `git show 787eba0 -- index.html` | **Keep as is — Terrell, 2026-11-13:** "Keep everything else as is too." (No restore, no further trim.) |
| 2026-11-13 | About section ("Implementation that fits how the business actually runs.") | Not in SPEC.md | Cut in `5f2d6ce` (Nov 6), "cut the About detour; its one new fact moves into the case-studies intro" | **Content preserved:** its facts (700+ MB2 locations, Wellfit contract-to-live) are in the case-studies intro and the Experience timeline. | `index.html` #work section-sub; timeline | n/a unless he wants the section back |
| 2026-11-13 | Three principle cards: Configure to the real process; Keep everyone aligned; Train to independence | Not in SPEC.md | Replaced in PR #4 redesign (`5f7d17f`, Nov 1, merged by Terrell) | **Content preserved** in case studies 02 (configure, align) and 04 (train to independence) and in the Wellfit bullets. | `index.html` #case-portfolio, #case-handoff | n/a (merged PR) |
| 2026-11-13 | "Open to new roles · Remote (US) or DFW hybrid" status line and hiring call to action | Not in SPEC.md | Dropped Nov 6 when the Talencia role was added | **Not restored: no longer true.** He holds a current role; restoring would misstate it. | `d0860c8`, `a881646` | **Keep as is — Terrell, 2026-11-13:** "Keep everything else as is too." (No restore, no further trim.) |
| 2026-11-13 | Internal details of the current employer: an internal app's feature list, a named vendor rollout, an HR/payroll build-out line | Not in SPEC.md | Trimmed Nov 6 (`a881646`, `787eba0`) | **Not restored, by rail:** CLAUDE_START_HERE P0 says not to add confidential employer details. The public current-role line stays (Rule #1). | `git show a881646` | **Keep as is — Terrell, 2026-11-13:** "Keep everything else as is too." (No restore, no further trim.) |
| 2026-11-13 | Title "Implementation Supervisor" at Wellfit | n/a | Changed to "Implementation Manager" in `a881646`; the résumé PDF was updated to match in `68c9af6` | **Present (as corrected).** Site and PDF agree. | `pdftotext assets/Terrell_Francis_Resume.pdf` | n/a |
| 2026-11-13 | Case-study labels "Client profile" / "Typical timeline" | n/a | Folded into prose in PERFECT R2 (`bb4a49a`, PR #6, merged) | **Content preserved:** "~10–50 employees" and "~1 month" are in case study 02 and the metrics band. | `index.html` #case-portfolio | n/a |
| 2026-11-13 | One-time import workflows (`import-*.yml`) and their `.txt` payloads | n/a | Added and removed Oct 1–2 as one-shot helpers | **No restore needed.** Their job (importing the site, logos and résumé) is done and the results are in the repo. | `git log --diff-filter=D` | n/a |

**Result (2026-11-13):** nothing that SPEC.md asks for was dropped. SPEC is narrow (accurate résumé, working links, honest badges, splash, visual QA), and all of it is present. The dropped sections above were design trims with a stated reason, so per this file's rule they are listed for Terrell's decision, not silently restored. Removal-check method: `git log --diff-filter=D`, visible-text diff of every historical `index.html` against today (142 dropped lines reviewed), and a scan for CSS/JS that no longer matches the page.

