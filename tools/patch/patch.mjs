#!/usr/bin/env node
// Patch tool for department sites (responder-engine 0.11.0). Run from anywhere; paths are resolved from the cwd.
//
//   node tools/patch/patch.mjs import <image> --out <site>/public [--tolerance 60]
//       A department's existing art (Facebook logo, old site header, a photo of the patch): cuts away a plain
//       background, trims, and writes patch.svg, favicon.png and apple-touch-icon.png into --out.
//
//   node tools/patch/patch.mjs options --config <patch.json> --out <site>/public/patch-options
//       For a department with no patch: draws original options (round badge, Maltese cross, shield) from the
//       department's facts and writes <id>.svg, <id>.png and options.json. Text is converted to outlines, so the
//       SVG looks the same in every browser and in print.
//
//   node tools/patch/patch.mjs build --config <patch.json> --style badge --out <site>/public
//       Draws one style straight to patch.svg + icons (use once the chief has picked).
//
// patch.json: { "name": "HEGINS VALLEY", "kind": "FIRE-RESCUE", "est": 2015, "station": "13", "state": "PA",
//               "motif": "ridges|river|pines|plains|none",
//               "colors": { "primary": "#b3261e", "accent": "#c9a06a", "ground": "#f4ead8", "ink": "#1b1a19" } }
// Every word on a drafted patch comes from patch.json; nothing is invented. Drafts are starting points for the
// department to change or replace, never their official patch until they say so.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import opentype from 'opentype.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const cmd = args[0];
const opt = (k, d) => { const i = args.indexOf('--' + k); return i > -1 && args[i + 1] !== undefined ? args[i + 1] : d; };
const fontFile = (w) => path.join(HERE, 'node_modules/@fontsource/barlow-condensed/files', `barlow-condensed-latin-${w}-normal.woff`);
const loadFont = (w) => { const b = fs.readFileSync(fontFile(w)); return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };

// ---------------------------------------------------------------- import
async function importArt(file, out, tol) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, px = (x, y) => (y * w + x) * 4;
  const corner = [px(0, 0), px(w - 1, 0), px(0, h - 1), px(w - 1, h - 1)];
  const opaque = corner.some((i) => data[i + 3] > 20);
  if (opaque) {
    // Background = the average corner colour; flood from every edge pixel within `tol` (sum of RGB differences).
    const bg = [0, 1, 2].map((c) => Math.round(corner.reduce((s, i) => s + data[i + c], 0) / 4));
    const near = (i) => Math.abs(data[i] - bg[0]) + Math.abs(data[i + 1] - bg[1]) + Math.abs(data[i + 2] - bg[2]) <= tol;
    const seen = new Uint8Array(w * h), q = [];
    const push = (x, y) => { const k = y * w + x; if (!seen[k] && near(k * 4)) { seen[k] = 1; q.push(k); } };
    for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
    for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
    while (q.length) {
      const k = q.pop(), x = k % w, y = (k / w) | 0;
      data[k * 4 + 3] = 0;
      if (x > 0) push(x - 1, y); if (x < w - 1) push(x + 1, y); if (y > 0) push(x, y - 1); if (y < h - 1) push(x, y + 1);
    }
  }
  let x0 = w, y0 = h, x1 = 0, y1 = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (data[px(x, y) + 3] > 20) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  if (x1 <= x0) throw new Error('nothing left after removing the background; try a lower --tolerance');
  const art = sharp(data, { raw: { width: w, height: h, channels: 4 } }).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 });
  const png = await art.clone().resize(400, 400, { fit: 'inside' }).png({ palette: true, quality: 92, effort: 10 }).toBuffer();
  const meta = await sharp(png).metadata();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${meta.width} ${meta.height}" width="${meta.width}" height="${meta.height}"><image width="${meta.width}" height="${meta.height}" href="data:image/png;base64,${png.toString('base64')}"/></svg>`;
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'patch.svg'), svg);
  await icons(png, out);
  return { width: meta.width, height: meta.height, kb: Math.round(svg.length / 1024), cutBackground: opaque };
}

async function icons(src, out) {
  await sharp(src).resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toFile(path.join(out, 'favicon.png'));
  const inner = await sharp(src).resize(156, 156, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: '#1f1f22' } }).composite([{ input: inner, gravity: 'center' }]).png().toFile(path.join(out, 'apple-touch-icon.png'));
}

// ---------------------------------------------------------------- lettering (text as outlines)
const F7 = () => (F7.f ||= loadFont(700));
const F6 = () => (F6.f ||= loadFont(600));
const n2 = (v) => Math.round(v * 100) / 100;
function measure(font, str, size, track) {
  const g = font.stringToGlyphs(str), s = size / font.unitsPerEm;
  let wsum = 0;
  g.forEach((gl, i) => { wsum += gl.advanceWidth * s + (i ? track : 0); if (i) wsum += font.getKerningValue(g[i - 1], gl) * s; });
  return { glyphs: g, s, width: wsum };
}
// Straight line of text centred on (cx, baseline y).
function line(font, str, size, cx, y, fill, track = 0) {
  const m = measure(font, str, size, track);
  let x = cx - m.width / 2, d = '';
  m.glyphs.forEach((gl, i) => { if (i) x += font.getKerningValue(m.glyphs[i - 1], gl) * m.s + track; d += gl.getPath(x, y, size).toPathData(2); x += gl.advanceWidth * m.s; });
  return `<path fill="${fill}" d="${d}"/>`;
}
// Text along a circle around (cx, cy). side 'top' reads clockwise over the top with letters standing outward;
// 'bottom' reads left to right under the centre with letters standing inward. r = baseline radius.
function arc(font, str, size, cx, cy, r, side, fill, track = 0) {
  const m = measure(font, str, size, track);
  const span = m.width / r;
  let cum = 0, out = '';
  m.glyphs.forEach((gl, i) => {
    if (i) cum += font.getKerningValue(m.glyphs[i - 1], gl) * m.s + track;
    const adv = gl.advanceWidth * m.s, mid = (cum + adv / 2) / r;
    const th = side === 'top' ? -span / 2 + mid : Math.PI + span / 2 - mid;
    const x = cx + r * Math.sin(th), y = cy - r * Math.cos(th);
    const rot = side === 'top' ? th : th - Math.PI;
    const d = gl.getPath(-adv / 2, 0, size).toPathData(2);
    if (d) out += `<path fill="${fill}" transform="translate(${n2(x)} ${n2(y)}) rotate(${n2((rot * 180) / Math.PI)})" d="${d}"/>`;
    cum += adv;
  });
  return out;
}
// The largest size at which `str` fits `maxW`, capped at `cap`.
const fit = (font, str, cap, maxW, track) => Math.min(cap, (cap * maxW) / measure(font, str, cap, track).width);

// ---------------------------------------------------------------- shapes
function star(cx, cy, r, fill) {
  let d = '';
  for (let i = 0; i < 10; i++) { const a = (Math.PI / 5) * i - Math.PI / 2, rr = i % 2 ? r * 0.42 : r; d += `${i ? 'L' : 'M'}${n2(cx + rr * Math.cos(a))} ${n2(cy + rr * Math.sin(a))}`; }
  return `<path fill="${fill}" d="${d}Z"/>`;
}
// Maltese cross: four flared arms, each ending in a V notch.
function cross(cx, cy, R) {
  const a = R * 0.6, notch = R * 0.72, inner = R * 0.13;
  const pts = [];
  for (let k = 0; k < 4; k++) {
    const rot = (k * Math.PI) / 2, c = Math.cos(rot), s = Math.sin(rot);
    const p = (x, y) => [cx + x * c - y * s, cy + x * s + y * c];
    pts.push(p(-a, -R), p(0, -notch), p(a, -R), p(inner, -inner));
  }
  return 'M' + pts.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L') + 'Z';
}
function shieldPath(cx, y0, w, h) {
  const l = cx - w / 2, r = cx + w / 2, yb = y0 + h;
  return `M${l} ${y0 + 18}Q${cx} ${y0 - 14} ${r} ${y0 + 18}L${r} ${y0 + h * 0.52}C${r} ${y0 + h * 0.8} ${cx + w * 0.22} ${yb - 30} ${cx} ${yb}C${cx - w * 0.22} ${yb - 30} ${l} ${y0 + h * 0.8} ${l} ${y0 + h * 0.52}Z`;
}
// Local scene drawn into a clip: river, pines, ridges, plains. Silhouettes only; no invented landmarks.
function motif(kind, cx, base, wd, c) {
  const l = cx - wd / 2, r = cx + wd / 2;
  if (kind === 'river') {
    const wave = (y, amp) => { let d = `M${l} ${y}`; for (let x = l; x < r; x += 30) d += `q15 ${-amp} 30 0`; return d; };
    return `<path fill="${c.ink}" fill-opacity=".85" d="M${l} ${base - 46}C${cx - 60} ${base - 76} ${cx + 10} ${base - 40} ${cx + 60} ${base - 62}S${r} ${base - 58} ${r} ${base - 50}V${base + 40}H${l}Z"/>`
      + `<path fill="none" stroke="${c.accent}" stroke-width="5" stroke-linecap="round" d="${wave(base - 26, 7)}"/>`
      + `<path fill="none" stroke="${c.ground}" stroke-width="4" stroke-linecap="round" stroke-opacity=".9" d="${wave(base - 10, 6)}"/>`
      + `<path fill="none" stroke="${c.accent}" stroke-width="4" stroke-linecap="round" d="${wave(base + 6, 5)}"/>`;
  }
  if (kind === 'pines') {
    const tree = (x, hgt) => { const y = base, w = hgt * 0.42; return `M${x} ${y - hgt}L${x + w * 0.55} ${y - hgt * 0.55}H${x + w * 0.3}L${x + w * 0.8} ${y - hgt * 0.15}H${x + w * 0.45}L${x + w} ${y + 4}H${x - w}L${x - w * 0.45} ${y - hgt * 0.15}H${x - w * 0.8}L${x - w * 0.3} ${y - hgt * 0.55}H${x - w * 0.55}Z`; };
    const xs = [-0.42, -0.29, -0.15, 0.02, 0.17, 0.31, 0.44], hs = [52, 70, 58, 80, 62, 72, 50];
    return `<path fill="${c.ink}" fill-opacity=".85" d="M${l} ${base}H${r}V${base + 40}H${l}Z${xs.map((f, i) => tree(cx + f * wd, hs[i])).join('')}"/>`;
  }
  if (kind === 'ridges') {
    return `<path fill="${c.ink}" fill-opacity=".45" d="M${l} ${base - 40}L${cx - wd * 0.22} ${base - 78}L${cx + 4} ${base - 52}L${cx + wd * 0.26} ${base - 84}L${r} ${base - 46}V${base + 40}H${l}Z"/>`
      + `<path fill="${c.ink}" fill-opacity=".85" d="M${l} ${base - 12}C${cx - wd * 0.3} ${base - 40} ${cx - wd * 0.1} ${base - 26} ${cx} ${base - 30}S${cx + wd * 0.3} ${base - 44} ${r} ${base - 20}V${base + 40}H${l}Z"/>`;
  }
  if (kind === 'plains') {
    let rows = '';
    for (let i = -6; i <= 6; i++) rows += `M${cx + i * 10} ${base - 34}L${cx + i * 48} ${base + 40}`;
    return `<path fill="${c.ink}" fill-opacity=".85" d="M${l} ${base - 34}H${r}V${base + 40}H${l}Z"/><path stroke="${c.accent}" stroke-width="2.5" stroke-opacity=".8" d="${rows}"/>`;
  }
  return '';
}

// ---------------------------------------------------------------- styles
const COLORS = { primary: '#b3261e', accent: '#c9a06a', ground: '#f4ead8', ink: '#1b1a19' };
function words(cfg) {
  return {
    name: String(cfg.name || '').toUpperCase(),
    kind: String(cfg.kind || 'FIRE DEPT.').toUpperCase(),
    est: cfg.est ? String(cfg.est) : '',
    center: String(cfg.station || cfg.state || '').toUpperCase(),
  };
}

function badge(cfg) {
  const c = { ...COLORS, ...(cfg.colors || {}) }, t = words(cfg), cx = 200, cy = 200;
  const bandIn = 130, bandOut = 184, band = bandOut - bandIn, cap = 0.7; // Barlow cap height ~ 0.7 em
  const sTop = fit(F7(), t.name, (band * 0.62) / cap, (bandIn + band * 0.2) * 2.55, 3);
  const sBot = fit(F7(), t.kind, (band * 0.5) / cap, (bandOut - band * 0.2) * 1.75, 3);
  const rTop = bandIn + (band - sTop * cap) / 2, rBot = bandOut - (band - sBot * cap) / 2;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">`;
  s += `<defs><clipPath id="field"><circle cx="${cx}" cy="${cy}" r="${bandIn - 7}"/></clipPath></defs>`;
  s += `<circle cx="${cx}" cy="${cy}" r="197" fill="${c.ink}"/><circle cx="${cx}" cy="${cy}" r="191" fill="${c.primary}"/>`;
  s += `<circle cx="${cx}" cy="${cy}" r="${bandOut + 3}" fill="none" stroke="${c.accent}" stroke-width="3"/>`;
  s += arc(F7(), t.name, sTop, cx, cy, rTop, 'top', c.ground, 3);
  s += arc(F7(), t.kind, sBot, cx, cy, rBot, 'bottom', c.ground, 3);
  const mid = (bandIn + bandOut) / 2;
  if (t.est) {
    s += line(F7(), 'EST.', 18, cx - mid, cy + 6.5, c.accent, 1);
    s += line(F7(), t.est, 18, cx + mid, cy + 6.5, c.accent, 1);
  } else { s += star(cx - mid, cy, 9, c.accent) + star(cx + mid, cy, 9, c.accent); }
  s += `<circle cx="${cx}" cy="${cy}" r="${bandIn - 2}" fill="${c.ground}" stroke="${c.accent}" stroke-width="4"/>`;
  s += `<g clip-path="url(#field)">${motif(cfg.motif, cx, cy + 92, 2 * bandIn, c)}</g>`;
  s += `<path d="${cross(cx, cy - 4, 82)}" fill="${c.primary}" stroke="${c.ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="${cross(cx, cy - 4, 70)}" fill="none" stroke="${c.accent}" stroke-width="2.5" stroke-linejoin="round"/>`;
  s += `<circle cx="${cx}" cy="${cy - 4}" r="27" fill="${c.ground}" stroke="${c.ink}" stroke-width="3"/>`;
  if (t.center) s += line(F7(), t.center, fit(F7(), t.center, 30, 40, 0), cx, cy - 4 + 10.5, c.ink);
  return s + '</svg>';
}

function maltese(cfg) {
  const c = { ...COLORS, ...(cfg.colors || {}) }, t = words(cfg), cx = 200, cy = 200;
  const disc = 96, bandIn = 66, band = disc - 6 - bandIn, cap = 0.7;
  const sTop = fit(F7(), t.name, (band * 0.66) / cap, (bandIn + band * 0.2) * 2.7, 2);
  const sBot = fit(F7(), t.kind, (band * 0.55) / cap, (disc - 6) * 1.9, 2);
  const rTop = bandIn + (band - sTop * cap) / 2, rBot = disc - 6 - (band - sBot * cap) / 2;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">`;
  s += `<defs><clipPath id="field"><circle cx="${cx}" cy="${cy}" r="${bandIn - 4}"/></clipPath></defs>`;
  s += `<path d="${cross(cx, cy, 196)}" fill="${c.ink}" stroke="${c.ink}" stroke-width="6" stroke-linejoin="round"/>`;
  s += `<path d="${cross(cx, cy, 188)}" fill="${c.primary}" stroke="${c.accent}" stroke-width="3" stroke-linejoin="round"/>`;
  if (t.est) s += line(F7(), `EST. ${t.est}`, 24, cx, cy - 128, c.ground, 2);
  if (cfg.station) s += line(F7(), `STATION ${String(cfg.station).toUpperCase()}`, 22, cx, cy + 140, c.ground, 2);
  else if (cfg.state) s += line(F7(), String(cfg.state).toUpperCase(), 24, cx, cy + 140, c.ground, 2);
  s += star(cx - 142, cy, 12, c.accent) + star(cx + 142, cy, 12, c.accent);
  s += `<circle cx="${cx}" cy="${cy}" r="${disc}" fill="${c.ink}"/><circle cx="${cx}" cy="${cy}" r="${disc - 4}" fill="${c.primary}" stroke="${c.accent}" stroke-width="2"/>`;
  s += arc(F7(), t.name, sTop, cx, cy, rTop, 'top', c.ground, 2);
  s += arc(F7(), t.kind, sBot, cx, cy, rBot, 'bottom', c.ground, 2);
  s += `<circle cx="${cx}" cy="${cy}" r="${bandIn}" fill="${c.ground}" stroke="${c.accent}" stroke-width="3"/>`;
  s += `<g clip-path="url(#field)">${motif(cfg.motif, cx, cy + 46, 2 * bandIn, c)}</g>`;
  s += `<path d="${cross(cx, cy - 6, 36)}" fill="${c.primary}" stroke="${c.ink}" stroke-width="2.5" stroke-linejoin="round"/>`;
  return s + '</svg>';
}

function shield(cfg) {
  const c = { ...COLORS, ...(cfg.colors || {}) }, t = words(cfg), cx = 200, W = 330, H = 392, y0 = 24;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 440" width="400" height="440">`;
  s += `<defs><clipPath id="field"><path d="${shieldPath(cx, y0 + 12, W - 24, H - 24)}"/></clipPath></defs>`;
  s += `<path d="${shieldPath(cx, y0 - 6, W + 14, H + 14)}" fill="${c.ink}"/>`;
  s += `<path d="${shieldPath(cx, y0, W, H)}" fill="${c.primary}"/>`;
  s += `<path d="${shieldPath(cx, y0 + 12, W - 24, H - 24)}" fill="${c.ground}" stroke="${c.accent}" stroke-width="3"/>`;
  // Rocker: a curved band across the top carrying the name (the ring between two circles, clipped to the shield).
  const R = 560, bandH = 58, yTop = y0 + 30, ccy = yTop + R;
  s += `<g clip-path="url(#field)">${motif(cfg.motif, cx, y0 + H - 92, W, c)}`;
  s += `<path fill="${c.ink}" fill-rule="evenodd" d="M${cx - R} ${ccy}a${R} ${R} 0 1 0 ${2 * R} 0a${R} ${R} 0 1 0 ${-2 * R} 0ZM${cx - (R - bandH)} ${ccy}a${R - bandH} ${R - bandH} 0 1 0 ${2 * (R - bandH)} 0a${R - bandH} ${R - bandH} 0 1 0 ${-2 * (R - bandH)} 0Z"/></g>`;
  const sName = fit(F7(), t.name, (bandH * 0.62) / 0.7, W - 80, 3);
  s += arc(F7(), t.name, sName, cx, ccy, R - bandH + (bandH - sName * 0.7) / 2, 'top', c.ground, 3);
  s += line(F6(), t.kind, fit(F6(), t.kind, 24, W - 110, 3), cx, y0 + 132, c.ink, 3);
  s += `<path d="${cross(cx, y0 + 214, 66)}" fill="${c.primary}" stroke="${c.ink}" stroke-width="4" stroke-linejoin="round"/>`;
  s += `<path d="${cross(cx, y0 + 214, 55)}" fill="none" stroke="${c.accent}" stroke-width="2.5" stroke-linejoin="round"/>`;
  s += `<circle cx="${cx}" cy="${y0 + 214}" r="22" fill="${c.ground}" stroke="${c.ink}" stroke-width="3"/>`;
  if (t.center) s += line(F7(), t.center, fit(F7(), t.center, 26, 34, 0), cx, y0 + 214 + 9, c.ink);
  if (t.est) {
    const ry = y0 + H - 52, rw = 190;
    s += `<path fill="${c.ink}" d="M${cx - rw / 2 - 26} ${ry - 4}L${cx - rw / 2} ${ry - 4}V${ry + 30}H${cx - rw / 2 - 26}L${cx - rw / 2 - 14} ${ry + 13}Z M${cx + rw / 2 + 26} ${ry - 4}L${cx + rw / 2} ${ry - 4}V${ry + 30}H${cx + rw / 2 + 26}L${cx + rw / 2 + 14} ${ry + 13}Z"/>`;
    s += `<rect x="${cx - rw / 2}" y="${ry - 10}" width="${rw}" height="34" rx="3" fill="${c.primary}" stroke="${c.accent}" stroke-width="2"/>`;
    s += line(F7(), `EST. ${t.est}`, 22, cx, ry + 15, c.ground, 3);
  }
  return s + '</svg>';
}

const STYLES = { badge: { draw: badge, label: 'Round badge' }, cross: { draw: maltese, label: 'Maltese cross' }, shield: { draw: shield, label: 'Shield' } };
const MOTIF_WORDS = { river: 'river', pines: 'pines', ridges: 'ridgelines', plains: 'open fields', none: 'no scene' };

// ---------------------------------------------------------------- main
(async () => {
  try {
    if (cmd === 'import') {
      const file = args[1]; const out = opt('out');
      if (!file || !out) throw new Error('usage: patch.mjs import <image> --out <site>/public [--tolerance 60]');
      const r = await importArt(path.resolve(file), path.resolve(out), Number(opt('tolerance', 60)));
      console.log(`patch.svg ${r.width}x${r.height} (${r.kb} KB)${r.cutBackground ? ', background removed' : ', already transparent'}; favicon.png, apple-touch-icon.png → ${out}`);
    } else if (cmd === 'options' || cmd === 'build') {
      const cfgFile = opt('config'); const out = opt('out');
      if (!cfgFile || !out) throw new Error(`usage: patch.mjs ${cmd} --config <patch.json> --out <dir>${cmd === 'build' ? ' --style badge|cross|shield' : ''}`);
      const cfg = JSON.parse(fs.readFileSync(path.resolve(cfgFile), 'utf8'));
      if (!cfg.name) throw new Error('patch.json needs at least "name"');
      fs.mkdirSync(path.resolve(out), { recursive: true });
      if (cmd === 'build') {
        const st = STYLES[opt('style', 'badge')]; if (!st) throw new Error('style must be badge, cross or shield');
        const svg = st.draw(cfg);
        fs.writeFileSync(path.resolve(out, 'patch.svg'), svg);
        await icons(Buffer.from(svg), path.resolve(out));
        console.log(`patch.svg (${st.label}) + icons → ${out}`);
      } else {
        const styles = cfg.styles || ['badge', 'cross', 'shield'];
        const list = [];
        for (const [i, key] of styles.entries()) {
          const id = String.fromCharCode(97 + i), st = STYLES[key]; if (!st) continue;
          const svg = st.draw(cfg);
          fs.writeFileSync(path.resolve(out, `${id}.svg`), svg);
          await sharp(Buffer.from(svg)).resize(800).png().toFile(path.resolve(out, `${id}.png`));
          list.push({ id, style: key, label: `${st.label}${cfg.motif && cfg.motif !== 'none' ? ', ' + MOTIF_WORDS[cfg.motif] : ''}`, src: `/${path.basename(path.resolve(out))}/${id}.svg` });
        }
        fs.writeFileSync(path.resolve(out, 'options.json'), JSON.stringify(list, null, 2) + '\n');
        console.log(`${list.length} options → ${out}: ${list.map((o) => `${o.id} ${o.label}`).join('; ')}`);
      }
    } else {
      console.log('patch.mjs import <image> --out <dir> | options --config <patch.json> --out <dir> | build --config <patch.json> --style badge --out <dir>');
      process.exitCode = cmd ? 1 : 0;
    }
  } catch (e) { console.error(String(e.message || e)); process.exitCode = 1; }
})();
