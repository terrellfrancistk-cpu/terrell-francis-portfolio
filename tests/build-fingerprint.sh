#!/usr/bin/env bash
# Prints the fingerprint of the files a commit would publish to terrellfrancis.app (pages.yml publishes
# the committed tree minus docs/, tests/ and HANDOFF_TO_HOUSE_OFFICER.md). Commits that touch only those
# excluded paths keep the same fingerprint, so an approval of a build stays valid across doc-only commits.
# Usage: bash tests/build-fingerprint.sh [commit]   (default HEAD)   add --list to print every file hash
set -euo pipefail
rev="${1:-HEAD}"; [ "$rev" = "--list" ] && rev=HEAD
repo=$(cd "$(dirname "$0")/.." && pwd)
list=$(git -C "$repo" ls-tree -r "$rev" | awk '{print $3"  "$4}' \
  | grep -vE '  (docs/|tests/|HANDOFF_TO_HOUSE_OFFICER\.md$)' | sort -k2)
if [[ " $* " == *" --list "* ]]; then echo "$list"; fi
fp=$(printf '%s\n' "$list" | sha256sum | cut -c1-16)
echo "commit $(git -C "$repo" rev-parse --short "$rev")  published files: $(printf '%s\n' "$list" | wc -l)  fingerprint: $fp"
