// Tiny dependency-free static server for the site root (the parent of tests/).
// This is the "staging" host for every test: http://127.0.0.1:4173
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml',
  '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    let p = normalize(join(root, decodeURIComponent(url.pathname)));
    if (!p.startsWith(root + sep) && p !== root) { res.writeHead(403).end(); return; }
    let s = await stat(p).catch(() => null);
    if (s && s.isDirectory()) { p = join(p, 'index.html'); s = await stat(p).catch(() => null); }
    if (!s) {
      const nf = await readFile(join(root, '404.html')).catch(() => null);
      res.writeHead(404, { 'content-type': types['.html'] }).end(nf || 'Not found');
      return;
    }
    res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(await readFile(p));
  } catch (e) {
    res.writeHead(500).end('error');
  }
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
