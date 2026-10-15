# @sightline/responder-engine

One engine, many content-only department sites.

This package is an [Astro](https://astro.build) integration that carries every page, layout, component and
stylesheet of a volunteer fire department website. A department's own repository holds only its data
(`site.config.json`, `content/*.json`), its photos and patch (`public/`), and a six-line `astro.config.mjs`.
Upgrading every department site is a version bump of this package.

Templates shipped today (0.3.4 adds an optional `/review` page, see `content/review.json`; 0.7.0 adds `home.hide`, `seasonal.photo`, `district.map_embed`, `responses.kinds` and friends, see the content contract):

| template     | pages |
|--------------|-------|
| `department` | `/`, `/about`, `/apparatus`, `/responses`, `/safety`, `/weather`, `/community`, `/news`, `/join`, `/members`, `/youth`, `/memorial`, `/support`, `/contact`, `/accessibility`, `/escape-plan` (printable), `/shop` (0.8.0, when `store` is set), `/404` |

## Consuming the engine

A department repo looks like this:

```
pawpaw-fire/
  astro.config.mjs
  package.json
  site.config.json
  content/
    dept.json
    status.json
    incidents.json
    events.json
  public/
    patch.svg  patch-512.png  favicon.png  favicon.svg  apple-touch-icon.png
    photos/*.jpg
```

`astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import engine from '@sightline/responder-engine';
export default defineConfig({
  site: 'https://pawpaw-fire.vercel.app',   // Base.astro uses Astro.site for canonical URLs
  output: 'static',
  trailingSlash: 'always',
  integrations: [engine({ template: 'department' })],
});
```

`package.json`:

```json
{
  "type": "module",
  "scripts": { "dev": "astro dev", "build": "astro build", "preview": "astro preview" },
  "dependencies": { "astro": "^7.3.5", "@sightline/responder-engine": "^0.1.0" }
}
```

While the engine is unpublished, point at a checkout instead: `"@sightline/responder-engine": "file:../../engine"`.
`npm install` then symlinks it into `node_modules`, and Astro resolves the template pages through the package's
`exports` map.

`site.config.json` (available to templates as `import cfg from '@siteconfig'`; the `department` template reads
`analytics`, `motion`, `facebook` and `patch` (0.3.1: the header, hero and footer mark and, when it ends in `.svg`, the SVG favicon; defaults to `/patch.svg`) from it and takes everything else from `content/dept.json`):

```json
{ "name": "Paw Paw Fire Department", "domain": "https://pawpaw-fire.vercel.app",
  "template": "department", "formRecipient": "", "patch": "/patch.svg",
  "facebook": "https://facebook.com/pawpawfd" }
```

`facebook` (0.3): when set, the home page and the community page end with a "Follow us" section holding the
Facebook Page Plugin timeline as a lazy-loaded `<iframe>` (plugin URL form, no SDK script, `title` set) with a plain
"Open our Facebook page" link beside it as the fallback. Falls back to `dept.json` `facebook`; hidden when neither is
set. 0.3.3: the iframe is rendered only for a canonical `https://www.facebook.com/<pagename>` URL; `profile.php?id=`
and `/p/…` URLs (which the plugin refuses to frame) get the "Follow us" section with the button alone.

### What the integration does

In `astro:config:setup` it:

1. calls `injectRoute` for every page of the chosen template, with `entrypoint` set to
   `@sightline/responder-engine/templates/<template>/<page>.astro` and `prerender: true`;
2. adds Vite resolve aliases `@content/*` to `<site root>/content/*` and `@siteconfig` to
   `<site root>/site.config.json`, so the engine's pages import the site's data;
3. relies on `layouts/Base.astro` importing `../styles/global.css`, so the global stylesheet is bundled exactly as
   it was when the layout lived inside the site.

No `src/` directory is needed in the department repo.

## Content contract

Every field the `department` template reads. Paths are relative to the JSON root. Any top-level key beginning with
`_` (such as `_how`) is a note for editors and is ignored.

### `content/dept.json`

| field | type | used for |
|---|---|---|
| `name` | string | titles, header, footer, JSON-LD, print page |
| `company` | string | footer "about" line |
| `founded` | number | header tagline, JSON-LD, home, about (0.3.3: the about history heading "<founded> to now") |
| `tagline` | string | home hero |
| `radio` | string | footer radio designation |
| `url` | string | JSON-LD, print footer (`replace(/^https?:\/\//,'')`) |
| `address.street`, `.city`, `.state`, `.zip` | string | top bar, footer, contact, JSON-LD |
| `phones.station`, `.fax`, `.tours` | string | top bar, footer, contact, join, youth, community, safety |
| `facebook` | string | footer link, JSON-LD `sameAs`, news, community |
| `district.area_sq_mi` | number | footer, home, about |
| `district.members` | string[] | JSON-LD `areaServed`, about |
| `district.contract` | string[] | JSON-LD, about (`join`) |
| `district.board` | `{name, for}[]` | about (0.3.3: rows with an empty `name` are hidden, as is the "By contract" row when `contract` is empty) |
| `district.board_note` | string | about |
| `district.mutual_aid` | string[] | about (`slice`) |
| `stats.members`, `.officers`, `.firefighters`, `.juniors`, `.calls_2024` | number | home and responses stat tiles, members page |
| `chiefs` | `{name, title, phone, since, note}[]` | about, contact, members (`filter` on title) |
| `chiefs_note` | string | about |
| `captains` | `{unit, name}[]` | members (0.3.3: section hidden when empty) |
| `apparatus` | `{id, kind, year, make, spec, role}[]` | apparatus, home (`slice`) |
| `station.name`, `.opened`, `.cost`, `.size`, `.approved`, `.history` | string / number | about |
| `honor_guard` | string | members (0.3.3: section hidden when empty) |
| `lodd` | `{name, age, died, joined, account, sources[]}[]` | memorial |
| `memorial` | `{name, died}[]` | memorial |
| `memorial_note` | string | memorial |
| `history` | string[] | about timeline |
| `past_chiefs_note` | string | about |
| `news` | `{date, title, tag, text, source?, photo?, alt?, gallery?: {src, alt}[]}[]` | news, home (`slice`) |
| `faq` | `{q, a}[]` | community |
| `michigan_last.nfff`, `.memorial` | string | memorial links |
| `draft_note` | string | yellow draft banner on every page; set to `""` at launch |
| `seasonal.start`, `.end`, `.kicker`, `.title`, `.text`, `.link`, `.link_label` | string | home and safety seasonal message (shown between `start` and `end`) |
| `support.intro`, `.ways[] {t, d}`, `.what_it_buys` (string[][]), `.what_it_buys_note` | | support |
| `hero_photo.src`, `.alt`, `.caption` | string | home, join, about hero images |
| `hero_patch_scale` | number (0.3.2, optional) | multiplies the home-hero patch size (1.2 = 20% larger) |
| `copy.hero_cta1`, `.hero_cta1_href`, `.hero_cta2`, `.hero_cta2_href` | string (0.3.2, optional) | the two hero buttons (defaults: Join the department → /join/, Free smoke alarm check → /safety/#alarm) |
| `hero_bg` | `{src, position?}` (0.3.1, optional) | the home hero's full-bleed background photo (else `/photos/structure-fire.jpg`); a `-800.jpg` sibling is used on phones; `position` is a CSS background-position such as `center 40%` |
| `tasks` | `{label, href, icon?}[]` (0.3) | "I want to" quicklinks: tiles under the home hero (first 6) and an "I want to…" `<details>` menu in the header listing all of them. `href` may be a page, an anchor, an external URL or a `tel:` link; `icon` is an optional short glyph/emoji, rendered `aria-hidden`. Hidden when absent. |
| `programs` | `{title, summary, href, photo?}[]` (0.3) | teaser cards on the community page (`/community/#programs`) and, when there are 3 or more, a "What we do" row of the first 3 on the home page. Hidden when absent. |
| `dispatch_feed.label`, `.url` | string (0.3) | "Listen live" link on the responses page and in the footer, each with a note that it is a public scanner feed and not an official source. Hidden when absent. |
| `iso_rating.class`, `.year?`, `.note?` | string, number, string (0.3) | "ISO rating" row in the about page's Fire Board facts and a short "ISO Class …" line in the footer. Hidden when absent. Only enter a rating the department has confirmed. |
| `photos.about_hero`, `.members_hero`, `.responses`, `.apparatus_hero`, `.support_hero`, `.station` | `{src, alt, caption?}` (0.3.1, optional) | per-page overrides: about hero (else `hero_photo`), members hero (else `hero_photo`), responses hero (else `photos.glow`), a photo beside the apparatus and support page heroes (hidden when absent), the about page's station figure (else `hero_photo`). |
| `copy.community_caption`, `.contact_caption`, `.responses_caption`, `.apparatus_h1`, `.apparatus_link`, `.support_h1`, `.members_lede`, `.community_door`, `.footer_kind`, `.members_label` | string (0.3.1, optional) | override sentences that were hardcoded with Paw Paw wording (photo captions on community/contact/responses, the apparatus and support headlines, the home "all rigs" button, the members lede, the home community door text). |
| `copy.about_h1`, `.news_source`, `.year_counts_note`, `.pagers_step`, `.drive_step`, `.knox_box`, `.station_tours`, `.incident_reports`, `.honor_guard_title`, `.roster_note`, `.join_people`, `.join_address_label`, `.juniors_lede`, `.stat_247`, `.footer_about`, `.header_tagline` | string (0.3.3, optional) | more Paw Paw sentences made overridable: the about hero headline; the news-page source phrase ("as reported in …"); the note under the calls-by-year chart (`""` hides it); the heading and body of the "pagers go off" and "drive to the station" steps on the safety page; the Knox Box, station tours and incident reports tiles on the community page; the honor guard heading and the captains roster note (`""` hides it) on the members page; the "forty people who will come when you call" phrase and the address label on the join form; the junior-program lede (default counts `stats.juniors`, or a generic sentence when 0); the home "24/7" stat label; a single footer "about" sentence replacing the assembled one; the header tagline under the department name (default `<station_label> · Est. <founded>`). |
| `programs[].photo_position` | string (0.3.3, optional) | CSS `object-position` for a program card's photo, such as `center 70%`. Program-card photos are 4:3 from 0.3.3. |
| `incidents[].n`, `.units`, `.members`, `.source` | (0.3.3) | the responses page hides the incident number when it is blank or a `YY-000…` placeholder, hides the units/members line when both are empty or 0, and shows a "Source" link when `source` is set. The calls-by-year section is hidden when `year_counts` is empty. |
| `notices` | `{kind, title, text, date?, href, cta?}[]` (0.3.4, optional) | a "Right now" band of two-up charcoal cards directly under the hero and task tiles, before the stat band. `kind` is `hiring`, `event` or `notice` (sets the red tag text: Now hiring / Event / Notice); `date` (`YYYY-MM-DD`) renders as a brass "Saturday, October 24" line; `cta` is the link label (default "Details"). Hidden when absent. |
| `careers` | `{kicker?, title, text, cta?, href?}` (0.3.4, optional) | a `#career` section on the join page, before the apply form, for a paid position or career-staff notice; `href` defaults to the station phone and `cta` to "Call the station". Hidden when absent. |
| `feature.photo` | `{src, alt, aspect?}` (0.3.4, optional) | the home feature block's photo instead of `photos.chief_engine`; `aspect` such as `4/3` overrides the default 3:4 portrait frame. |
| `copy.join_steps_note`, `.youth_note` | string (0.3.4, optional) | the "department to confirm" footnotes under the join-page steps and the junior-program page; `""` hides them. |
| `home.hide` | string[] (0.7.0, optional) | home sections to leave out: `groupband`, `feature`, `seasonal`, `pager`, `district`, `rigs`, `programs`, `doors`, `news`, `facebook`, `support`. Use it when a section would only repeat another (the door row repeats the nav, the news cards repeat `notices`). Default: nothing hidden. |
| `hero_compact` | boolean (0.7.0, optional) | a smaller home H1 (`clamp(3rem, 1.8rem + 5vw, 6.25rem)`, 12ch) so the hero buttons stay nearer the fold with a longer headline. |
| `seasonal.photo` | `{src, alt, position?}` (0.7.0, optional) | turns the seasonal band into text beside a full-height photo (desktop; the photo is hidden on phones). With it, `seasonal.link`/`link_label` become the band's first button and "Fire safety at home" the second. |
| `district.map_embed` | `{query, zoom?, note?}` (0.7.0, optional) | when there is no drawn `DistrictMap` (`copy.map: false`), embeds a map of `query` (the station address) with a Directions link and a "call the station" line; `note` replaces the default "<station>, <street>." caption. |
| `apparatus[].spec`, `.role` | (0.7.0) | hidden when empty instead of rendering an empty line; use `copy.rigs_note` (home) / `copy.apparatus_note` (apparatus page) for one note about pending specs. |
| `responses.kinds`, `.kinds_note`, `.list_link {label, href}`, `.report` | (0.7.0, optional) | responses page: a "The calls, by kind" row of `{title, text}` cards above the list, a note under it, a button under the list (a Facebook page, a scanner feed), and `report: true` adds a "Need an incident report?" section that prints `copy.incident_reports`. |
| `copy.weather_nav`, `.events_link`, `.rigs_note`, `.district_note`, `.responses_lede`, `.responses_list_kicker`, `.responses_list_title`, `.responses_list_note` | string (0.7.0, optional) | the Weather nav label ("Burn & weather"), the home events button, the home rigs note (`""` hides it), the district paragraph's mutual-aid/address sentence, and the responses page lede, list heading and list footnote. |
| (0.7.0) | | the memorial page's name is an `<h1>`; the home "Years of service" stat carries `data-since` and is recomputed in the browser so a static build does not go stale on New Year's Day. |
| `store` | object (0.8.0, optional) | adds `/shop/`, a "Shop" item in the main nav (label `copy.shop_nav`) and, with `store.home: true`, a three-card strip on the home page. Static page, no scripts: every Buy button is a Stripe Payment Link (create them in the Stripe dashboard with shipping address collection and a Size custom field). Fields: `kicker`, `h1`, `intro`, `meta`; `featured {edition, title, blurb, price, sizes, ships, deadline?, photos[{src,alt}], link, cta?}` (the current limited edition; a past `deadline` turns the button into "Orders closed"); `items[] {name, price, blurb, options?, photo?, alt?, link, cta?}`; `past[] {title, edition?, when?, photo?, alt?}`; `items_kicker/title`, `how_title`, `how`, `proceeds`, `contact`, `contact_email`, `past_title`, `home_kicker/title/link`. A product without a photo renders a reserved patch slot; without a `link` the button reads "Coming soon". Add a `tasks` entry and a `support.ways` entry yourself if you want the shop in the "I want to" menu and on the support page. |
| (0.8.0) | | a nav of nine or more items (weather page + shop) gets `header.nav-wide`: tighter items on desktop and the menu button below 84rem instead of 64rem, so the Join button is never clipped. |
| `photos.<key>.src`, `.alt` | string | keys used: `chief_engine`, `structure`, `glow`, `community`, `members_dog`, `dog_window`, `squad`. Pages derive the responsive 800px variant with `src.replace('.jpg', '-800.jpg')`, so every photo needs a `-800.jpg` sibling in `public/photos/`. |

Present in Paw Paw's data but not read by any template: `short`, `email`, `phones.emergency`, `stats.apparatus`,
`photos.extrication`, `photos.dog_cab`, `lodd[].sources`.

### `content/status.json`

| field | type | used for |
|---|---|---|
| `level` | `"normal" \| "caution" \| "ban"` | banner color and label |
| `text` | string | banner sentence |
| `updated` | `YYYY-MM-DD` | "Updated Mon D" on the banner |
| `link`, `link_label` | string, optional | banner link |

### `content/incidents.json`

| field | type | used for |
|---|---|---|
| `year_counts` | `{year, calls}[]` | responses chart (`slice`) |
| `incidents` | `{n, date, time, type, location, units[], members, mutual_aid[], notes}[]` | responses table, home recent list (`slice`) |

### `content/events.json`

| field | type | used for |
|---|---|---|
| `events` | `{date, end?, time, title, where, text, type?, agenda_url?}[]` | news page and home; past events are filtered out at build time, each event gets an `.ics` download link |
| `events[].type` | `"meeting"` (0.3) | the next upcoming event marked `meeting` renders a "Next board meeting" card on the home page (date, time, place, agenda link, link to the schedule on News & events) and is left out of the home's short upcoming list; the news page shows the `agenda_url` as an "Agenda" link |

### `content/review.json` (0.3.4, optional)

When this file exists the template gains `/review/`: a plain, print-friendly checklist of every open question the
draft raises for the department, `noindex`, with the motion layer off, titled "Review checklist for <department>".
The draft banner (`draft_note`) then ends with a "Chiefs: review checklist →" link. Delete the file at launch;
Paw Paw has none, so its output is unchanged.

| field | type | used for |
|---|---|---|
| `intro` | string | lede under the heading |
| `contact.name`, `.email` | string | "Questions: …" line beside the buttons |
| `reply_to`, `subject` | string, optional | the "Reply by email" mailto (defaults `hello@sitesforservice.org`, "<short name> review") |
| `items[]` | `{id, question, why, where: string[], current, status}` | one numbered block each: the question in bold, "Why we ask", "Where it appears" as links (page paths, with optional `#anchor`), "What the draft shows now", and a "Your answer" line to write on. `status` is for the editors (`open` / `done`) and is not rendered. |

### `public/`

Templates reference these fixed paths: `/patch.svg` (header and footer mark, SVG favicon), `/favicon.png`,
`/apple-touch-icon.png`, and every `src` named in `dept.json` (all under `/photos/`). `DistrictMap.astro` is a
self-contained inline SVG with no external data file.

## Developing the engine

```
cd example && npm install && npm run build     # builds the example site against ../ via file:..
```

`example/` is a complete department site (Paw Paw's content) that consumes the engine with `file:..`. CI should
build it on every push. To verify a change produces no unintended output difference, build a baseline first,
change the engine, rebuild, and diff the two `dist/` trees after normalizing `/_astro/*.HASH.css` names and
`data-astro-cid-*` scoped-style ids.

### Releasing

The package follows semver.

- Patch: copy, style and bug fixes with no content-contract change.
- Minor: new optional fields, new pages, new templates.
- Major: a required field added or renamed, a page removed, or a `public/` path changed.

```
npm version <patch|minor|major>
git push && git push --tags           # tag is v0.x.y
npm publish --access public           # once the package is published to a registry
```

Department repos pin a caret range (`^0.1.0`) and pick up patch and minor releases with `npm update`.

## Feedback widget (0.5.0): guided review + markup

Set `feedback` in `site.config.json` to render a "Review this site" button on every page (`components/Feedback.astro`,
inline script and styles, no dependencies, no external hosts, about 17 KB of script). Absent, nothing is emitted.

```json
"feedback": { "site": "crains-creek-fire", "endpoint": "https://sitesforservice.org/api/site-feedback" }
```

`site` is the slug the collector files notes under; `endpoint` is optional and defaults to the URL above.

### Guided review

When `content/review.json` has items, the button opens a welcome card ("Chief, let's check this site together. N quick
questions… Your answers save as you go.") with an optional name field (remembered in `sfs_feedback_who`), **Start** and
**Just mark things**. Start walks through the items in order: the widget navigates to the item's `page` (with
`#sfs-review` on the URL so the pass resumes on load), scrolls the `selector` element to the middle of the free
viewport, outlines it in red with a dimmed cut-out, and shows a bottom card with a progress bar, "3 of 24"
(`aria-live`), the `question`, "The draft shows: `current`", **✓ Looks right** / **✗ Needs a change** (reveals
"Tell us what it should say" + **Save**), and Back / Pause / Skip links. Keys: Y, N, ← →, Escape pauses. Each answer is
stored immediately and the pass auto-advances. Progress lives in `localStorage` (`sfs_review_<site>` =
`{ idx, status: active|paused|done }`); while a pass is in progress every page shows a pill "Continue review (12 of 24)"
instead of the full button. After the last item an end card offers **Mark more things** and **Send to Sites for Service**.
Welcome and end cards are modal (page content gets `inert` + `aria-hidden`); the bottom card traps focus;
`prefers-reduced-motion` disables the smooth scroll. On phones the cards are bottom sheets at most 45% of the viewport
with full-width 52 px buttons.

review.json items take three optional anchor fields (everything else unchanged):

```json
{ "id": "founded", "question": "Was the department organized in 1977?", "current": "…", "where": ["/", "/about/"],
  "page": "/", "selector": "header .brand .bs", "status": "open" }
```

`page` is where the widget takes the reviewer (defaults to `/`); `selector` is any CSS selector for the element the
question is about — prefer stable ids/classes from the template (`header .brand .bs`, `.hero-x .kicker`,
`.stats .stat:nth-child(1)`, `.rigs .rig:nth-child(1)`, `.people .person:nth-child(1)`, `main dl.rows .row:nth-child(3)`,
`.doors .door:nth-child(1)`, `.mini`, `.mapgrid`, `#programs`, `footer a[href*="facebook"]`). Omit `selector` for items
with nothing to point at (patch artwork, donation method): the card shows without a highlight. The `/review/` page keeps
the printable checklist and, when `feedback` is configured, opens by saying the easy way is the button on the site.

### Markup mode

"Just mark things" / "Mark more things" (or the button when there is no review.json) toggles markup mode: a slim top bar
("Tap anything you want changed · Notes (n) · Done"), targetable elements (`main p, h1-h3, li, img, figcaption, a.btn,
td, dt, dd, header .brand, footer p`) outlined on hover/focus. Tapping a text element shows a small bar
**Edit this text / Leave a note / Cancel**; "Edit this text" makes the element `contenteditable` with a green outline
and a Done/Cancel strip, and on Done stores an `edit` item with `before`/`after`. Tapping an image shows
**Replace this photo / Remove this photo / Leave a note**; the first two store a `photo` item whose `note` is the choice.
"Leave a note" opens the note popover (Text / Photo / Other) as before. Link and button clicks are prevented in markup
mode. Every stored item with a selector gets a numbered red pin on its page (answers marked "Looks right"/"Skip" get
none). Items persist in `localStorage` (`sfs_feedback_<site>`) until sent.

### Sending

**Send to Sites for Service** (notes panel and end card) posts with `fetch` (`mode: 'cors'`,
`Content-Type: application/json`):

```json
{
  "site": "crains-creek-fire",
  "site_name": "Crains Creek Fire-Rescue",
  "submitted_at": "2026-10-14T15:04:05.000Z",
  "reviewer": { "name": "Chief Smith", "email": "chief@example.org" },
  "items": [
    { "id": "mgq1x2ab3c", "kind": "answer", "question_id": "founded", "question": "Was the department organized in 1977?",
      "answer": "change", "note": "1976.", "page": "/", "url": "https://…/", "selector": "header .brand .bs",
      "excerpt": "Station 23 · Est. 1977", "created_at": "…" },
    { "id": "…", "kind": "edit", "page": "/about/", "url": "…", "selector": "main > section:nth-of-type(2) > … > p:nth-of-type(1)",
      "excerpt": "Crains Creek Volunteer Fire Department was organized in 1977…", "before": "…was organized in 1977…",
      "after": "…was organized in 1976…", "note": "Edited in place", "created_at": "…" },
    { "id": "…", "kind": "photo", "page": "/members/", "selector": ".phero img", "excerpt": "Crains Creek members with the engine",
      "note": "Replace this photo", "created_at": "…" },
    { "id": "…", "kind": "text", "page": "/about/", "selector": "…", "excerpt": "…", "note": "Founded 1976, not 1977.", "created_at": "…" }
  ]
}
```

`kind` is `answer` (`answer`: `ok` | `change` | `skip`, with `question_id`, `question`, `note`), `edit` (`before`,
`after`), `photo`, `text` or `other`. `selector` is the item's anchor, or the nearest `#id` / `nth-of-type` path from
`<body>` for free markup; `excerpt` is the element text (or image alt) trimmed to 160 characters. The endpoint must
answer 2xx with `{"ok": true}` (and CORS headers for the site's origin); the widget then clears the stored items, pins and
review progress and shows "Sent. Thank you, Chief. We'll make these changes and send you the updated site." with a
**Start over** link. On any failure it shows the error and offers "Email instead", a `mailto:hello@sitesforservice.org`
with subject `Site changes: <site_name>` and one line per item (`- Q3 Needs a change: … (question)`,
`- /page · "before" → "after"`, `- /page · "excerpt" → note`). When `draft_note` is set the draft banner gains the hint
"Tap "Review this site" and we'll walk you through it." Escape closes the action bar, edit, popover, card (pauses the
pass), panel, then markup mode; the widget is hidden in print, does not render on `plain` pages (the review checklist),
and does not touch the motion layer or the "I want to" menu.

## Gotchas

- `injectRoute` entrypoints are resolved as bare module specifiers, so the `.astro` files must be reachable
  through the package `exports` map (`./templates/*`, `./layouts/*`, `./components/*`, `./styles/*`).
- Route patterns are written without a trailing slash; the site's `trailingSlash: 'always'` decides the URL shape.
  `/404` becomes `dist/404.html` exactly as a `src/pages/404.astro` would.
- A scoped `<style>` (without `is:global`) gets a `data-astro-cid-*` hash derived from the component's file path.
  Moving a page into the engine changes that hash; the CSS is otherwise identical. Pages that use
  `<style is:global>` are unaffected.
- Photos are plain `<img src="/photos/...">` references into the site's `public/`, so the engine never has to
  know where images live.

## License

MIT. See `LICENSE`.

## Analytics
Set `"analytics": "vercel"` in `site.config.json` to emit the Vercel Web Analytics snippet (`/_vercel/insights/script.js`) in `<head>`; the project must also have Web Analytics enabled on Vercel (`vercel project web-analytics <name>`). Leave it empty for no analytics (or when hosting elsewhere).

## Motion

`styles/motion.css` (imported by `Base.astro` after `global.css`) adds a quiet motion layer: the hero's patch and
kicker, then the heading, then the lede and buttons rise in on load in three steps 120 ms apart (`.hero-x` on the
home page, `.phero` on inner pages); elements marked `data-reveal`, and the children of a `data-reveal-group` (stat
tiles, photo doors, news cards, rigs, officer cards, program cards), fade up 10 px over 450 ms
(`cubic-bezier(.22,1,.36,1)`) as they scroll into view. A group is observed as a whole, so its children always
reveal together, staggered 60 ms apiece via a `--i` custom property (capped at 8); `will-change` is held only until
the transition ends (`transitionend` adds `.m-done`, which also removes the reveal transition so hover rules take
over), and anything scrolled past in one jump, such as an anchor load, is shown at once. Buttons, doors, news cards
and prose links give 150–200 ms hover and focus feedback; the stat-band numbers marked `data-count` count up from
zero over 1.2 s with tabular numerals and a fixed `ch` width so the band never reflows. Nothing loops or autoplays
once the page has settled, nothing moves layout (transform and opacity only), the angled bands (`clip-path`) are
never transformed themselves, and the memorial page carries none of these hooks.

Switches in `site.config.json`:

```json
{ "motion": false }                         // whole layer off: no class, no script
{ "motion": { "counters": false } }         // reveals on, stat numbers static
```

Default is everything on. The rule for reduced motion: every rule in `motion.css` sits inside
`@media (prefers-reduced-motion: no-preference)`, and the small inline script in `<head>` exits before adding
`m-on` to `<html>` when `prefers-reduced-motion: reduce` matches, so those visitors (and anyone without
JavaScript) get a static page with every element visible and the real numbers already in the HTML. Elements
are hidden only by `html.m-on [data-reveal]:not(.is-in)`, so a script failure can never leave content invisible.
