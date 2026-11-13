// Read-only external link check (one GET per unique URL, no load). Prints a table; exit 1 on a confirmed broken link.
// A blocked host (sandbox proxy 403/000) is reported as UNVERIFIED, not broken.
// Usage: node check-external-links.mjs [path-to-index.html]
import { readFile } from 'node:fs/promises';
const file = process.argv[2] || new URL('../index.html', import.meta.url);
const html = await readFile(file, 'utf8');
const urls = [...new Set([...html.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]))]
  .filter((u) => !u.startsWith('https://terrellfrancis.app/'));
let broken = 0;
for (const u of urls) {
  let status = 0, note = '';
  try {
    const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(15000), headers: { 'user-agent': 'Mozilla/5.0 (link-check)' } });
    status = r.status;
  } catch (e) { note = e.cause?.code || e.name; }
  const verdict = status >= 200 && status < 400 ? 'OK' : (status === 404 || status === 410) ? 'BROKEN' : 'UNVERIFIED';
  if (verdict === 'BROKEN') broken++;
  console.log(`${verdict.padEnd(10)} ${String(status || '-').padEnd(4)} ${u} ${note}`);
}
process.exit(broken ? 1 : 0);
