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
|  |  |  |  |  |  | Pending |

