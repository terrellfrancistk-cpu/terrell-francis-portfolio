// Fail closed: tests never run against a production host unless an explicit read-only opt-in is set.
// terrellfrancis.app is a static site with no writes, so a read-only look is the only thing the opt-in allows.
export const PRODUCTION_HOSTS = [
  'terrellfrancis.app', 'www.terrellfrancis.app', 'terrellfrancistk-cpu.github.io',
  'tkhub.app', 'apexpeakofcare.app', 'tryrole.app', 'trybooked.app', 'getoncurb.app', 'tryzilt.app',
  'tryourpeople.app', 'tryafterglow.app', 'trynoir.app',
];

export function resolveBaseURL(env = process.env) {
  const base = env.E2E_BASE_URL || 'http://127.0.0.1:4173';
  const host = new URL(base).hostname.toLowerCase();
  const isProd = PRODUCTION_HOSTS.some((h) => host === h || host.endsWith('.' + h));
  if (isProd && env.E2E_ALLOW_LIVE_READONLY !== '1') {
    throw new Error(`Refusing to test production host ${host}. Use the local server (default) or a preview host. ` +
      'A read-only look at the live site needs E2E_ALLOW_LIVE_READONLY=1 and Terrell\'s OK.');
  }
  return { base, isProd, isLocal: host === '127.0.0.1' || host === 'localhost' };
}
