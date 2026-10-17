// 0.12.0: pages that exist only when the department has given us something true to put on them.
// Used by index.js (which routes to inject) and by the templates (nav links, home doors, cross-links).
export const youthOn = (d) => !!(d && d.youth && (d.youth.lede || (d.youth.facts || []).length));
export const memorialOn = (d) => !!(d && ((d.lodd || []).length > 0 || (d.memorial || []).length > 0));
// Members: captains, an honor guard or honorary members. A hero and nothing else is not a page.
export const membersOn = (d) => !!(d && (((d.captains || []).length > 0) || d.honor_guard || (d.copy && d.copy.honorary)));
// incidents.json: a call log or calls-by-year. Without either, /responses would be an empty list.
export const responsesOn = (inc) => !!(inc && (((inc.incidents || []).length > 0) || ((inc.year_counts || []).length > 0)));
