# Changelog

One entry per tag. Read the newest entry before building a department; read the README section it points to before
touching the engine. Department repos pin a tag (`github:t8m5nmgn47-cloud/responder-engine#v0.10.2`).

## v0.12.0 — 2026-10-17 — nothing untrue

The template stops speaking for departments. Found by reading every line on the Thomasville, Hegins Valley and
Crains Creek drafts that did not come from their own data: all three told residents about a Knox Box program,
station tours, weekly training nights, an issued air pack and pager, an aerial, free smoke-alarm installs with
10-year batteries and a Spanish site "planned". README "Nothing untrue (0.12.0)" has the fields.

- Breaking (content): `copy.js` defaults are now neutral or empty; Paw Paw's wording moved into
  `example/content/dept.json` (with `join`, `community`, `youth`, `safety` blocks) so the example renders as before.
  A department on 0.11 that relied on a default will lose that sentence, which is the point; run the provenance
  audit after upgrading.
- `join`, `community.facts`, `youth`, `safety.alarm_checks`: department data replaces hardcoded sentences. The join
  form now mails `email`.
- `/members/`, `/responses/`, `/youth/`, `/memorial/` are routed (and linked) only when there is something on them.
- New: `signature` home story band, `home.order`, `theme` colors with contrast guards (incl. `charcoal`), `email` on
  contact/footer/community, `review.json` `reviewer`.
- Accessibility: the header brand link's name now contains its visible text (axe `label-content-name-mismatch`);
  Thomasville scans clean with axe (WCAG 2.1 AA) on every page at 1366 and 390.
- The weather page only asks for "a permit" when `weather.fire.permit_required` is true.
- Rating page: no default year-of-work calendar, inspection-day steps or "Tuesday nights and Saturday mornings"
  line (they were a guess at Crains Creek's schedule). `iso_page.work.year` / `.inspection` / `.intro` bring them
  back with the department's own facts.
- One photo once per page: the about history aside (`photos.history`, else `glow`), the about station band, the join
  steps aside, the contact aside and the responses aside no longer repeat the page's hero photo (the blurred hero
  backdrop is the same photo by design).
- Fixed: "within a few minutes of Station Station 13"; "honored at the the Pennsylvania…"; an empty NFFF number
  printed `tel:+1` and a broken sentence on the memorial page; "Chief since" for a president; "career and volunteer"
  on every about page; the safety page's seasonal box showed all year; the footer printed "in , Pennsylvania" without
  a county; a hard-coded "Chief's officers" heading; "News and events are kept in two plain data files the
  department edits"; contact page's "Station tours" row repeated the station number.
- Verified: Thomasville rebuilt with its own join/community/signature/theme content, 14 pages at 1366 and 390, no
  overflow (the printable escape-plan sheet is fixed-width by design), no broken images, no console errors. Hegins
  Valley and Crains Creek build clean; their content passes follow.

## v0.11.1 — 2026-10-16

- Fixed: `/patch-options/` failed to build in 0.11.0 (a helper was used before it was defined). Found by the Hegins
  Valley rebuild before anything was published.

## v0.11.0 — 2026-10-16

- `tools/patch` (not part of the published package): `import` turns a department's existing art into `patch.svg` +
  icons with the background cut away; `options` draws original drafts (round badge, Maltese cross, shield; river,
  pines, ridgeline or plains scene; department colors) from `patch.json` facts with text as outlines; `build` writes
  the chosen style as the site's patch. See README "Patches".
- `patch_options` in `dept.json` adds a noindex `/patch-options/` page for the chief to pick from; the review
  checklist names it "Patch options".
- Verified: Crains Creek builds byte-identical (normalized) to 0.10.5; Hegins Valley gains only `/patch-options/`.

## v0.10.5 — 2026-10-16

- Finishes 0.10.4's optional street: the community page's "Didn't find it?" card, the home map caption (when
  `map_embed.note` is empty) and the default `copy.district_note` no longer print a leading ", ".

## v0.10.4 — 2026-10-16

Found by the Thomasville (MO) build: a department with no street address on file, no members count and a
line-of-duty death whose join date is known only to the year. Verified by building Hegins Valley and Crains Creek
against 0.10.3 and 0.10.4: Crains is byte-identical (normalized), Hegins changes only in the two bugs below.

- `founded` is optional: 0 or missing drops "Since …" from the home kicker, the "Years of service" tile, the about
  page's "<founded> to now" heading (now `copy.history_title`, default "Our history") and years figure, the JSON-LD
  `foundingDate`, and "Est. …" from the default header tagline.
- The home stat band renders only when it has at least two tiles (no lone "24/7" tile).
- `address.street` and `address.zip` are optional: the top bar, footer, contact page, map title, directions link and
  escape-plan footer join what is there instead of printing ", Thomasville".
- `lodd[].joined` may be a full date, a bare year (`"2019"`) or empty; empty leaves out "Member since".
- Fixed: a chief or officer with no phone printed an empty `tel:+1` link (contact page and about page). Live on
  Hegins Valley.
- Fixed: the about page's "By the numbers" card printed "0 members, career and volunteer" when `stats.members` is 0;
  the sentence (and the card, when there are no years either) is now left out. Live on Hegins Valley.

## v0.10.3 — 2026-10-15

Found by the Hegins Valley build (first photo-free, patch-free department).

- The home members stat tile renders only when `stats.members > 0`; the stat grid fits three or four tiles.
- A home page with no `hero_bg` sets `--hero-bg:none` so the hero no longer requests `/photos/structure-fire.jpg`
  (the `url()` fallback stays in the CSS for older content, so vite still prints a harmless "didn't resolve" warning).
- `"patch": false` also drops the favicon and apple-touch-icon links.
- The apparatus page's reserved rig slots follow the 0.10.2 rule (only when some rig has a photo); the 0.10.2 change
  missed that template, so a photo-free roster still requested `/patch.svg`.
- Support and seasonal bands: a long headline no longer pushes the button onto its own row.

## v0.10.2 — 2026-10-15

- Photos are truly optional: every template renders a department with `photos: {}`, no `hero_photo`/`hero_bg`, and no
  rig, program, chief, news, door or feature photos (`components/photos.js` `pick`/`p800` guard every reference).
  Reserved "photograph goes here" slots appear only when at least one item in that set has a photo; a photo-free
  set renders text cards (rigs, programs, doors) and the feature band becomes title-left/text-right.
- `site.config.json` `"patch": false` omits the patch from header, hero, footer and favicon until one exists.
- `copy.support_h2` / `copy.support_h2b` override the home support headline ("The rigs are paid for." / "The rest is us.").
- An empty or missing `phones.fax` hides the fax line in the footer and on the contact page.
- Long department names: `short` over 18 characters adds `brand-long` (smaller name, may wrap, tighter nav);
  over 26 adds `brand-xlong`.
- Fixed: the header rail had zero side gutter at exactly the container width, so at 1366 the Join button sat flush
  against (and clipped by) the viewport edge.
- Fixed: a nine-item nav between 1025 and 1344px hid its links without showing the Menu button (doubled selector).
- README: "Working with more than one session or agent" — the one-writer, tags-are-the-contract rules.

## v0.10.1 — 2026-10-14

- `iso_page.nav_main: true` puts the rating page in the main nav as "ISO Class N"; `store.nav: false` moves the shop
  to the footer list.

## v0.10.0 — 2026-10-14

- `.split` layout for long single-column sections: readable column plus a sticky aside, so sections no longer sit
  half empty.

## v0.9.2 — 2026-10-14

- Rating page leads with the work: year strip and inspection day before the rate table and calculator; bands re-alternated.

## v0.9.1 — 2026-10-14

- Rating page "What it takes": year strip, inspection day, comparison by department type (`iso_page.work`,
  `.hours_member`, `.hours_dept`, `.peers[]`, `.state_stats[]`, `.kind`).

## v0.9.0 — 2026-10-14

- `/rating` page from `iso_page`: what the protection class saves residents, in dollars, with the state rate-bureau
  factors and a calculator.

## v0.8.0 — 2026-10-13

- `/shop` page from a `store` block: Stripe Payment Links, featured edition, reserved photo slots, home strip.
- Nine-or-more-item nav collapses to the menu button sooner (`header.nav-wide`).

## v0.7.0 — 2026-10-13

- Content-driven home sections (`home.hide`), seasonal photo band (`seasonal.photo`), address map embed
  (`district.map_embed`), responses kinds/list/report, memorial H1.

## v0.6.0

- `/weather` page (opt-in via `weather`): live NWS conditions, alerts, tropical outlook and burn rules.

## v0.5.3

- Style fix in `global.css`.

## v0.5.2

- Optional local-hazard sections on the safety page (`hazards[]`).

## v0.5.1

- Feedback widget and review page refinements.

## v0.5.0

- Feedback widget: guided review plus page markup (see README "Feedback widget (0.5.0)").

## v0.4.0

- "Suggest a change" feedback button on every page (`feedback` in `site.config.json`).

## v0.3.4

- Optional `/review` page from `content/review.json`; `notices[]` band; `careers` section on join; `feature.photo`.

## v0.3.3

- Facebook iframe only for canonical page URLs; empty board rows, captains and honor guard hidden; program
  `photo_position`; incident number/units/members/source handling.

## v0.3.2

- `hero_patch_scale`; hero CTA copy overrides.

## v0.3.1

- Smooth motion (group stagger, no mid-flight snap); content-driven hero photo and patch; copy overrides;
  I-want-to tasks, board-meeting card, Facebook feed, dispatch feed, programs grid, ISO line.

## v0.2.0

- Motion layer: hero entrance, scroll reveal, hover/focus feedback, stat counters; off under
  `prefers-reduced-motion`; `site.config` motion switches.

## v0.1.4

- Stand-in image library (43 licensed photos, `credits.json`).

## v0.1.3

- Home hero spans the full screen; lighter gradient.

## v0.1.2

- Memorial page in stone: engraved roll, line-of-duty tribute.

## v0.1.1

- Optional Vercel Web Analytics snippet via `site.config` `analytics`.

## v0.1.0

- First engine: department template as an Astro integration.
