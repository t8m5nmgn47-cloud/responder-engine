// 0.12.0: a department's own colors, from dept.json `theme` = { accent, accent_deep?, gold?, cream?, source? }.
// accent  replaces the engine red (buttons, the stat band, kickers, rules). It must carry white text and read as text
//         on the cream backgrounds at 4.5:1 (WCAG AA); if it can't, it is darkened in small steps until it does.
// gold    replaces the brass line (kickers and accents on charcoal); it must read at 4.5:1 on charcoal, and its light
//         tint must read on the accent. Lightened in steps if not.
// cream   replaces the page background; the card and band shades are derived from it. Must stay light.
// Everything that had to move is listed in `notes` (the build logs them) so nobody is surprised by a shade.
const hex = (s) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(s || '').trim()); return m ? '#' + m[1].toLowerCase() : null; };
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
const mix = (a, b, t) => { const x = rgb(a), y = rgb(b); return toHex(x.map((v, i) => v + (y[i] - v) * t)); };
const lum = (h) => { const [r, g, b] = rgb(h).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const CHAR = '#1d1d1f', INK = '#242424', WHITE = '#ffffff';
const HOUSE = { bg: '#f6f3ec', bg2: '#ece7dc', card: '#fbf9f4' };

export function themeVars(t) {
  const out = { css: '', accent: '#b3261e', notes: [] };
  if (!t || typeof t !== 'object') return out;
  const v = {};
  let { bg, bg2, card } = HOUSE;
  const cream = hex(t.cream);
  if (cream) {
    if (contrast(INK, cream) >= 12) { bg = cream; bg2 = mix(cream, '#000000', 0.045); card = mix(cream, WHITE, 0.45); Object.assign(v, { '--bg': bg, '--bg-2': bg2, '--card': card }); }
    else out.notes.push(`theme.cream ${cream} is too dark for body text; kept the house cream.`);
  }
  // charcoal: the dark of the header, footer and page heads (a pine green, a navy). Cream text must read at 7:1 on it.
  let char = CHAR;
  const dark = hex(t.charcoal);
  if (dark) {
    if (contrast('#f3efe6', dark) >= 7) {
      char = dark;
      const [r, g, b] = rgb(dark);
      Object.assign(v, { '--char': dark, '--char-2': mix(dark, WHITE, 0.07), '--char-glass': `rgba(${r},${g},${b},.97)`, '--char-a80': `rgba(${r},${g},${b},.8)`, '--char-a20': `rgba(${r},${g},${b},.2)` });
    } else out.notes.push(`theme.charcoal ${dark} is too light for cream text; kept the house charcoal.`);
  }
  let accent = hex(t.accent);
  if (accent) {
    const ok = (a) => contrast(WHITE, a) >= 4.5 && contrast(a, bg2) >= 4.5;
    let a = accent, k = 0;
    while (!ok(a) && k < 12) { k++; a = mix(accent, '#000000', 0.05 * k); }
    if (ok(a)) {
      if (a !== accent) out.notes.push(`theme.accent ${accent} darkened to ${a} so white text and red-on-cream text pass 4.5:1.`);
      const deep = hex(t.accent_deep) && contrast(WHITE, hex(t.accent_deep)) >= 4.5 ? hex(t.accent_deep) : mix(a, '#000000', 0.22);
      Object.assign(v, { '--red': a, '--red-deep': deep, '--red-ink': mix(WHITE, a, 0.04) });
      out.accent = a; accent = a;
    } else { out.notes.push(`theme.accent ${accent} can't reach 4.5:1; kept the house red.`); accent = null; }
  }
  // A new charcoal re-checks the house brass against it even when no gold is given.
  const gold = hex(t.gold) || (char !== CHAR ? '#c7a35a' : null);
  if (gold) {
    let g = gold, k = 0;
    while (contrast(g, char) < 4.5 && k < 12) { k++; g = mix(gold, WHITE, 0.06 * k); }
    if (contrast(g, char) >= 4.5) {
      if (g !== gold) out.notes.push(`theme.gold ${gold} lightened to ${g} to read on charcoal.`);
      const onAccent = accent || '#b3261e';
      let hi = mix(g, WHITE, 0.35), j = 0;
      while (contrast(hi, onAccent) < 4.5 && j < 12) { j++; hi = mix(g, WHITE, 0.35 + 0.05 * j); }
      Object.assign(v, { '--brass': g, '--brass-hi': hi });
    } else out.notes.push(`theme.gold ${gold} can't read on charcoal; kept the house brass.`);
  }
  const entries = Object.entries(v);
  // html:root outranks the stylesheet's :root wherever the bundler puts the two.
  if (entries.length) out.css = `html:root{${entries.map(([k, c]) => `${k}:${c}`).join(';')}}`;
  return out;
}
