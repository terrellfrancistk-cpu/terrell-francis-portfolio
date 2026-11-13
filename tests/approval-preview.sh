#!/usr/bin/env bash
# Builds the live tree (origin/main) and a candidate commit exactly as pages.yml publishes them (minified),
# screenshots both the same way, and writes side-by-side comparisons. Nothing is deployed.
# Usage: bash tests/approval-preview.sh [commit] [out-dir]   (defaults: HEAD, docs/claude-handoff/build-preview/<fingerprint>)
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd); repo=$(cd "$here/.." && pwd)
rev="${1:-HEAD}"
fp=$(bash "$here/build-fingerprint.sh" "$rev" | awk '{print $NF}')
out="${2:-$repo/docs/claude-handoff/build-preview/$fp}"
work=$(mktemp -d)
build() { # $1 rev, $2 dir
  mkdir -p "$2"; git -C "$repo" archive "$1" | tar -x -C "$2"; rm -rf "$2/docs" "$2/tests" "$2/HANDOFF_TO_HOUSE_OFFICER.md"
  (cd "$2" && npx --yes terser@5 script.js --compress --mangle --output script.min.js 2>/dev/null && npx --yes clean-css-cli@5 --output styles.min.css styles.css 2>/dev/null && mv script.min.js script.js && mv styles.min.css styles.css)
}
build origin/main "$work/live"; build "$rev" "$work/new"
SITE_ROOT="$work/live" PORT=4177 node "$here/serve.mjs" >/dev/null 2>&1 & p1=$!
SITE_ROOT="$work/new" PORT=4178 node "$here/serve.mjs" >/dev/null 2>&1 & p2=$!
trap 'kill $p1 $p2 2>/dev/null || true; rm -rf "$work"' EXIT
for port in 4177 4178; do for _ in $(seq 1 40); do curl -s -o /dev/null "http://127.0.0.1:$port/" && break; sleep 0.25; done; done
mkdir -p "$out"
node "$here/approval-shots.mjs" "$out" http://127.0.0.1:4177 http://127.0.0.1:4178
bash "$here/build-fingerprint.sh" "$rev" --list > "$out/published-files.txt"
(cd "$work/new" && find . -type f -not -path './.github/*' | sort | xargs sha256sum | sed 's#  \./#  #') > "$out/minified-files.sha256"
echo "fingerprint $fp -> $out"
