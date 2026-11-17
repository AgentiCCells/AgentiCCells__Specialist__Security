// Gate: fails the build on any problem. Never weaken a check to get a release out.
// From scripts/validate.mjs in the site repositories made by sites@AgentiCCells.dinis
// (2026-11-16); factory@ added the hub.json fields, the description check and the
// placeholder check (a seeded site must hold no __SITE_*__ placeholder).
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const problems = [];
// Width and height from a JPEG's start-of-frame marker, or null if it is not a JPEG.
function jpegSize(b) {
  if (b[0] !== 0xff || b[1] !== 0xd8) return null;
  for (let i = 2; i + 9 < b.length;) {
    if (b[i] !== 0xff) return null;
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}
const fail = m => problems.push(m);
const hype = /\b(revolutionary|cutting[- ]edge|seamless(?:ly)?|world[- ]class|game[- ]changing)\b/i;
const isTemplate = existsSync('.factory-template');
if (!existsSync('_site')) { console.error('FAILED: _site/ is not built: run node scripts/build.mjs'); process.exit(1); }
const files = walk('_site');
for (const f of [...files, 'hub.json', 'README.md']) {
  if (!existsSync(f) || !/\.(html|js|css|json|md)$/.test(f)) continue;
  const s = readFileSync(f, 'utf8');
  s.split('\n').forEach((line, i) => {
    if (line.includes('—')) fail(`${f}:${i + 1}: em dash`);
    const m = line.match(hype); if (m) fail(`${f}:${i + 1}: hype word "${m[0]}"`);
    if (!isTemplate && /__SITE_[A-Z]+__/.test(line)) fail(`${f}:${i + 1}: template placeholder left in a seeded site`);
  });
  if (f.endsWith('.html')) {
    if (!/<title>[^<]+<\/title>/.test(s)) fail(`${f}: no <title>`);
    if (!/<meta name="description" content="[^"]+"/.test(s)) fail(`${f}: no description`);
    if (!/<html lang="/.test(s)) fail(`${f}: no lang on <html>`);
    // Link previews (the cells@ roll-out, Dinis, 17 Nov 2026; from site@AgentiCCells.gabriel-dacruz's
    // check, 16fb163): every tag present, absolute https URLs, a 110 to 150 character description,
    // and a share card served by this site, JPEG, exactly 1200x630, at most 300 KB.
    const tag = (n) => (s.match(new RegExp(`<meta (?:property|name)="${n}" content="([^"]*)"`)) || [])[1];
    const canonical = (s.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
    if (!canonical) fail(`${f}: no canonical link (link previews)`);
    for (const n of ['og:type', 'og:site_name', 'og:locale', 'og:url', 'og:title', 'og:description', 'og:image', 'og:image:type', 'og:image:width', 'og:image:height', 'og:image:alt', 'twitter:card']) if (!tag(n)) fail(`${f}: no ${n} (link previews)`);
    for (const [n, v] of [['canonical', canonical], ['og:url', tag('og:url')], ['og:image', tag('og:image')]]) if (v && !/^https:\/\/[^/]+\//.test(v)) fail(`${f}: ${n} must be an absolute https URL`);
    if (tag('twitter:card') && tag('twitter:card') !== 'summary_large_image') fail(`${f}: twitter:card must be summary_large_image`);
    const ogd = tag('og:description');
    if (ogd) { const len = [...ogd.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&#39;/g, "'")].length; if (len < 110 || len > 150) fail(`${f}: og:description is ${len} characters; keep it 110 to 150`); }
    if (tag('og:image:width') && tag('og:image:width') !== '1200') fail(`${f}: og:image:width must be 1200`);
    if (tag('og:image:height') && tag('og:image:height') !== '630') fail(`${f}: og:image:height must be 630`);
    if (tag('og:image:type') && tag('og:image:type') !== 'image/jpeg') fail(`${f}: og:image:type must be image/jpeg`);
    const img = tag('og:image');
    if (img && /^https:\/\//.test(img) && canonical && /^https:\/\//.test(canonical)) {
      if (new URL(img).host !== new URL(canonical).host) fail(`${f}: og:image must be served by this site`);
      else {
        const local = join('_site', decodeURIComponent(new URL(img).pathname));
        if (!existsSync(local)) fail(`${f}: og:image ${img} is not in the site`);
        else {
          const kb = statSync(local).size / 1024;
          if (kb > 300) fail(`${f}: og:image is ${Math.round(kb)} KB; keep it at most 300 KB`);
          const dim = jpegSize(readFileSync(local));
          if (!dim) fail(`${f}: og:image is not a JPEG`);
          else if (dim.w !== 1200 || dim.h !== 630) fail(`${f}: og:image is ${dim.w}x${dim.h}; it must be 1200x630`);
        }
      }
    }
    for (const m of s.matchAll(/<script[^>]+src="([^"]+)"/g)) if (/^(https?:)?\/\//.test(m[1])) fail(`${f}: third-party script ${m[1]}`);
    for (const m of s.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)) if (/^(https?:)?\/\//.test(m[1])) fail(`${f}: third-party stylesheet ${m[1]}`);
    for (const m of s.matchAll(/(?:href|src)="([^"#?]+)/g)) {
      const u = m[1]; if (/^(https?:|mailto:|data:|\/\/)/.test(u)) continue;
      const target = u.startsWith('/') ? join('_site', u) : join(dirname(f), u);
      if (!existsSync(target) && !existsSync(join(target, 'index.html'))) fail(`${f}: broken link ${u}`);
    }
  }
}
if (!existsSync('_site/version.json')) fail('no version.json');
if (!existsSync('_site/index.html')) fail('no index.html');
try {
  const h = JSON.parse(readFileSync('hub.json', 'utf8'));
  for (const k of ['name', 'what_it_does', 'owner', 'repository', 'live_address', 'version_from']) if (typeof h[k] !== 'string' || !h[k].trim()) fail(`hub.json: ${k} must be a non-empty string`);
  if (h.owner !== 'AgentiCCells') fail('hub.json: owner must be AgentiCCells');
  if (!h.licence || h.licence.code !== 'Apache-2.0' || h.licence.text !== 'CC BY 4.0') fail('hub.json: licence must be code Apache-2.0, text CC BY 4.0');
} catch (e) { fail(`hub.json is missing or not JSON (${e.message})`); }
if (problems.length) { console.error(problems.join('\n')); console.error(`FAILED: ${problems.length} problem(s)`); process.exit(1); }
console.log(`OK${isTemplate ? ' (template)' : ''}`);
