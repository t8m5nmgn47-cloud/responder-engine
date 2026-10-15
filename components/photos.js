// 0.10.2: photo lookup that tolerates a department with no photos at all.
// pick(d, 'structure', 'squad') returns the first of those keys that has a src, else hero_photo, else null.
export const pick = (d, ...keys) => {
  const p = (d && d.photos) || {};
  for (const k of keys) if (p[k] && p[k].src) return p[k];
  return d && d.hero_photo && d.hero_photo.src ? d.hero_photo : null;
};
export const p800 = (ph) => (ph && ph.src ? ph.src.replace(/\.jpg$/, '-800.jpg') : '');
