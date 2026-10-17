// Every line of text on a built site that does NOT come from the department's own content files.
// Those lines are the engine speaking; each one must be true for every department or come off.
// Usage: node tools/provenance-audit.mjs <slug> [--all]  run from a folder holding sources/<slug>/content and sites/<slug>,
//        or SRC=<content dir> SITE=<built dist dir> node tools/provenance-audit.mjs <name>
import fs from 'node:fs';
import path from 'node:path';
const slug = process.argv[2];
const showAll = process.argv.includes('--all');
const src = process.env.SRC || `sources/${slug}/content`, site = process.env.SITE || `sites/${slug}`;
const norm = (s) => s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/[–—]/g, '-').replace(/ /g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const strs = new Set();
(function collect(v) { if (typeof v === 'string') { const n = norm(v); if (n.length >= 4) strs.add(n); } else if (Array.isArray(v)) v.forEach(collect); else if (v && typeof v === 'object') Object.values(v).forEach(collect); })(
  fs.readdirSync(src).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(src, f), 'utf8'))));
const dept = [...strs].sort((a, b) => b.length - a.length);
const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) { if (!/^(_astro|photos|patch-options|node_modules|review|\.vercel)$/.test(f)) walk(p); } else if (f === 'index.html' || f === '404.html') pages.push(p); } })(site);
const dec = (s) => s.replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const found = new Map();
for (const p of pages) {
  const page = '/' + path.relative(site, path.dirname(p)).replace(/\\/g, '/');
  let h = fs.readFileSync(p, 'utf8');
  const meta = [...h.matchAll(/<meta name="description" content="([^"]*)"/g)].map((m) => 'META: ' + dec(m[1]));
  h = h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<\/?(p|h[1-6]|li|dt|dd|figcaption|summary|div|section|header|footer|nav|br|label|button|a|td|th|option)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  for (const raw of [...meta, ...dec(h).split('\n')]) {
    const line = raw.replace(/\s+/g, ' ').trim();
    if (!line || line.split(' ').length < 2) continue;
    let rest = norm(line.replace(/^META: /, ''));
    for (const s of dept) if (rest.includes(s)) rest = rest.split(s).join(' | ');
    const left = rest.replace(/[|.,:;()\-–·'"!?]/g, ' ').replace(/\b\d[\d,]*\b/g, ' ').replace(/\s+/g, ' ').trim();
    if (!showAll && left.split(' ').filter(Boolean).length < 3) continue;
    const key = line.slice(0, 400);
    if (!found.has(key)) found.set(key, new Set());
    found.get(key).add(page === '/' ? '/' : page + '/');
  }
}
const rows = [...found].map(([l, ps]) => ({ l, ps: [...ps] })).sort((a, b) => b.ps.length - a.ps.length || a.l.localeCompare(b.l));
for (const r of rows) console.log(`[${r.ps.length > 3 ? r.ps.length + ' pages' : r.ps.join(' ')}] ${r.l}`);
console.log(`\n${rows.length} engine lines on ${pages.length} pages (${slug})`);
