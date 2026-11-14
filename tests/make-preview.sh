#!/usr/bin/env bash
# Builds a public-preview folder for the tkhub-preview repo from a commit, exactly as pages.yml publishes it
# (terser + clean-css; docs/tests/handoff left out) plus that repo's preview conventions:
#   - noindex, nofollow on every page (replaces the page's own robots tag)
#   - 404.html root links ("/...") made relative so they work under /tkhub-preview/<folder>/
#   - files that do nothing in a subfolder left out: CNAME, .github, README.md, .nojekyll
# Writes PREVIEW-BUILD.txt with the build fingerprint. Never pushes and never touches the live site.
# Usage: bash tests/make-preview.sh <commit> <out-dir>     e.g. bash tests/make-preview.sh HEAD ../tkhub-preview/terrellfrancis-1115
set -euo pipefail
here=$(cd "$(dirname "$0")" && pwd); repo=$(cd "$here/.." && pwd)
rev="${1:?commit}"; out="${2:?out dir}"
[ -e "$out" ] && { echo "refusing: $out already exists (preview folders are never overwritten)"; exit 1; }
commit=$(git -C "$repo" rev-parse --short "$rev")
fp=$(bash "$here/build-fingerprint.sh" "$rev" | awk '{print $NF}')
mkdir -p "$out"
git -C "$repo" archive "$rev" | tar -x -C "$out"
(cd "$out" && rm -rf docs tests HANDOFF_TO_HOUSE_OFFICER.md CNAME .github README.md .nojekyll)
(cd "$out" && npx --yes terser@5 script.js --compress --mangle --output script.min.js 2>/dev/null \
  && npx --yes clean-css-cli@5 --output styles.min.css styles.css 2>/dev/null \
  && mv script.min.js script.js && mv styles.min.css styles.css)
python3 -I - "$out" <<'PY'
import re, sys, pathlib
out = pathlib.Path(sys.argv[1])
for page in sorted(out.rglob('*.html')):
    s = page.read_text()
    tags = re.findall(r'^\s*<meta name="robots" content="[^"]*">\s*$', s, re.M)
    if len(tags) > 1: sys.exit(f'{page}: more than one robots tag')
    if tags: s = s.replace(tags[0], '  ', 1)
    lines = s.split('\n'); i = next(n for n, l in enumerate(lines) if '<meta charset' in l)
    lines.insert(i + 1, '  <meta name="robots" content="noindex, nofollow">'); s = '\n'.join(lines)
    if page.name == '404.html' and page.parent == out:
        s = s.replace('href="/', 'href="./').replace('src="/', 'src="./')
    page.write_text(s)
    print('preview edits:', page.relative_to(out))
PY
cat > "$out/PREVIEW-BUILD.txt" <<TXT
terrellfrancis.app preview (not the live site)

Build fingerprint: $fp
Source: terrellfrancistk-cpu/terrell-francis-portfolio, branch claude/sharp-franklin-6cwtfa,
commit $commit (PR #7). Check before any merge: bash tests/build-fingerprint.sh prints the same.

Built exactly as pages.yml publishes it (terser + clean-css), minus files that do nothing in a
subfolder (CNAME, .github, README.md, .nojekyll). Preview-only edits, per this repo's convention:
- noindex, nofollow on every page
- 404.html: root links made relative so they work under /tkhub-preview/

Nothing goes live until Terrell has seen and approved this exact build.
TXT
echo "preview folder $out  build $fp  commit $commit"
