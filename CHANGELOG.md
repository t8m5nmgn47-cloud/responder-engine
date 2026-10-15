# Changelog

One entry per tag. Read the newest entry before building a department; read the README section it points to before
touching the engine. Department repos pin a tag (`github:t8m5nmgn47-cloud/responder-engine#v0.10.2`).

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
