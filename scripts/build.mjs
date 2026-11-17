// Build: copy src/ to _site/, stamp the version, write version.json.
// SITE_VERSION is set by CI only (v0.1.N); a local build says "dev".
import { cpSync, rmSync, readdirSync, readFileSync, writeFileSync, statSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { render, frontMatter } from './md.mjs';
const version = process.env.SITE_VERSION || 'dev';
rmSync('_site', { recursive: true, force: true });
cpSync('src', '_site', { recursive: true });
const walk = d => readdirSync(d).flatMap(f => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
for (const f of walk('_site')) {
  if (!/\.(html|js|css|json|md|txt)$/.test(f)) continue;
  const s = readFileSync(f, 'utf8');
  if (s.includes('__VERSION__')) writeFileSync(f, s.replaceAll('__VERSION__', version));
}
// The specialist's Markdown (policy, guidance, examples, mistakes, pack, reviews) is published
// twice: the .md file as it is (the twin agents read) and a rendered .html page for people.
// README.md in a folder becomes that folder's index.html. Added by specialist.security@, 2026-11-16.
const DOCS = ['abp', 'guidance', 'examples', 'mistakes', 'pack', 'reviews'];
// Link previews (the cells@ roll-out, at Dinis's word, 17 Nov 2026): every page carries canonical,
// Open Graph and Twitter tags with absolute https URLs and the site's 1200x630 share card.
const SITE = JSON.parse(readFileSync('hub.json', 'utf8')).live_address.replace(/\/?$/, '/');
const CARD = 'assets/share/specialist-security-1200x630.jpg';
const share = (url, title, description) => [
  `<link rel="canonical" href="${url}">`,
  '<meta property="og:type" content="website">',
  '<meta property="og:site_name" content="Specialist: Security">',
  '<meta property="og:locale" content="en_GB">',
  `<meta property="og:url" content="${url}">`,
  `<meta property="og:title" content="${title}">`,
  `<meta property="og:description" content="${description}">`,
  `<meta property="og:image" content="${SITE}${CARD}">`,
  '<meta property="og:image:type" content="image/jpeg">',
  '<meta property="og:image:width" content="1200">',
  '<meta property="og:image:height" content="630">',
  '<meta property="og:image:alt" content="Specialist: Security. Reviews, keys, secrets and leak scans for every AgentiCCells team, with a padlock.">',
  '<meta name="twitter:card" content="summary_large_image">',
].join('\n');
const page = (title, description, depth, body, mdName, url) => `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title} · Specialist: Security</title>
<meta name="description" content="${description}">
${share(url, title, description)}
<link rel="stylesheet" href="${'../'.repeat(depth)}style.css">
</head>
<body>
<main>
<p class="crumbs"><a href="${'../'.repeat(depth)}index.html">Specialist: Security</a> · <a href="${mdName}">Markdown twin</a></p>
${body}
<footer><p class="muted">Version ${version} · Text CC BY 4.0 · Written by specialist.security@AgentiCCells.dinis</p></footer>
</main>
</body>
</html>
`;
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
for (const dir of DOCS) {
  if (!statSafe(dir)) continue;
  for (const f of walk(dir)) {
    const out = join('_site', f);
    mkdirSync(dirname(out), { recursive: true });
    cpSync(f, out);
    if (!f.endsWith('.md')) continue;
    const src = readFileSync(f, 'utf8').replaceAll('__VERSION__', version);
    writeFileSync(out, src);
    const { meta, body } = frontMatter(src);
    const h1 = body.match(/^#\s+(.+)$/m);
    const title = (meta.title || (h1 && h1[1]) || basename(f, '.md')).replace(/[`*]/g, '');
    const firstPara = body.split('\n\n').map((p) => p.trim()).find((p) => p && !/^[#|>`-]/.test(p)) || title;
    const description = escAttr((meta.description || firstPara).replace(/[`*\[\]]/g, '').replace(/\(([^)]+)\)/g, '').replace(/\s+/g, ' '));
    const depth = f.split('/').length - 1;
    const target = basename(f) === 'README.md' ? join(dirname(out), 'index.html') : out.replace(/\.md$/, '.html');
    const url = SITE + target.slice('_site/'.length).replace(/(^|\/)index\.html$/, '$1');
    const html = page(escAttr(title), description, depth, render(body), basename(f), url);
    writeFileSync(target, html);
  }
}
function statSafe(p) { try { return statSync(p).isDirectory(); } catch { return false; } }
writeFileSync('_site/version.json', JSON.stringify({ version, commit: process.env.GITHUB_SHA || 'local', built: new Date().toISOString() }, null, 2) + '\n');
writeFileSync('_site/.nojekyll', '');
console.log(`built _site/ (${version})`);
