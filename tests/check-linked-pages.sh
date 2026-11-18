#!/usr/bin/env bash
# Report only: fetches each page this site links to (one read-only GET each) and reports any build-tool name
# (Rork, Grok) or personal Gmail address in its HTML. Those sites belong to other projects; this script changes
# nothing, it just tells us what to pass on. The current employer's site is never contacted.
# Usage: bash tests/check-linked-pages.sh
set -uo pipefail
here=$(cd "$(dirname "$0")" && pwd); repo=$(cd "$here/.." && pwd)
tmp=$(mktemp -d); trap 'rm -rf "$tmp"' EXIT
urls=$(grep -o -h 'href="https\?://[^"]*"\|data-demo="https\?://[^"]*"' "$repo/index.html" "$repo/privacy/index.html" "$repo/404.html" \
  | sed 's/^[a-z-]*="//; s/"$//' | sort -u | grep -v -E 'gotalencia\.com|terrellfrancis\.app|docs\.github\.com')
hits=0
for u in $urls; do
  code=$(curl -s -L -m 25 -o "$tmp/p.html" -w '%{http_code}' "$u" 2>/dev/null || true)
  if [ "$code" != "200" ]; then echo "UNREACHED  $u ($code)"; continue; fi
  v=$(grep -o -i 'rork\|grok' "$tmp/p.html" | tr 'A-Z' 'a-z' | sort | uniq -c | tr -s ' ' | tr '\n' ',')
  g=$(grep -o -i -E '[A-Za-z0-9._%+-]+@gmail\.com' "$tmp/p.html" | sort -u | wc -l)
  if [ -n "$v" ] || [ "$g" != "0" ]; then hits=$((hits+1)); echo "FOUND      $u  names:${v:- none}  gmail addresses: $g"; else echo "CLEAN      $u"; fi
done
echo "pages with findings: $hits"
