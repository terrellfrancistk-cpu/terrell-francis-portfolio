#!/usr/bin/env bash
# Rebuild exactly what pages.yml publishes (committed tree, minus docs/ and tests/, then terser + clean-css)
# and run the whole suite against it on 127.0.0.1:4174. Nothing is deployed.
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd)
repo=$(cd "$here/.." && pwd)
out="$here/.prod-build"
rm -rf "$out" && mkdir -p "$out"
git -C "$repo" archive HEAD | tar -x -C "$out"
rm -rf "$out/docs" "$out/tests" "$out/HANDOFF_TO_HOUSE_OFFICER.md"
(
  cd "$out"
  npx --yes terser@5 script.js --compress --mangle --output script.min.js
  npx --yes clean-css-cli@5 --output styles.min.css styles.css
  mv script.min.js script.js
  mv styles.min.css styles.css
)
SITE_ROOT="$out" PORT=4174 node "$here/serve.mjs" &
pid=$!
trap 'kill $pid 2>/dev/null || true' EXIT
for _ in $(seq 1 20); do curl -s -o /dev/null http://127.0.0.1:4174/ && break; sleep 0.25; done
cd "$here"
E2E_BASE_URL=http://127.0.0.1:4174 npx playwright test --trace off "$@"
