# @sightline/responder-engine

One engine, many content-only department sites.

This package is an [Astro](https://astro.build) integration that carries every page, layout, component and
stylesheet of a volunteer fire department website. A department's own repository holds only its data
(`site.config.json`, `content/*.json`), its photos and patch (`public/`), and a six-line `astro.config.mjs`.
Upgrading every department site is a version bump of this package.

Templates shipped today:

| template     | pages |
|--------------|-------|
| `department` | `/`, `/about`, `/apparatus`, `/responses`, `/safety`, `/community`, `/news`, `/join`, `/members`, `/youth`, `/memorial`, `/support`, `/contact`, `/accessibility`, `/escape-plan` (printable), `/404` |

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

`site.config.json` (available to templates as `import cfg from '@siteconfig'`; not yet read by the `department`
template, which still takes everything from `content/dept.json`):

```json
{ "name": "Paw Paw Fire Department", "domain": "https://pawpaw-fire.vercel.app",
  "template": "department", "formRecipient": "", "patch": "/patch.svg" }
```

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
| `founded` | number | header tagline, JSON-LD, home, about |
| `tagline` | string | home hero |
| `radio` | string | footer radio designation |
| `url` | string | JSON-LD, print footer (`replace(/^https?:\/\//,'')`) |
| `address.street`, `.city`, `.state`, `.zip` | string | top bar, footer, contact, JSON-LD |
| `phones.station`, `.fax`, `.tours` | string | top bar, footer, contact, join, youth, community, safety |
| `facebook` | string | footer link, JSON-LD `sameAs`, news, community |
| `district.area_sq_mi` | number | footer, home, about |
| `district.members` | string[] | JSON-LD `areaServed`, about |
| `district.contract` | string[] | JSON-LD, about (`join`) |
| `district.board` | `{name, for}[]` | about |
| `district.board_note` | string | about |
| `district.mutual_aid` | string[] | about (`slice`) |
| `stats.members`, `.officers`, `.firefighters`, `.juniors`, `.calls_2024` | number | home and responses stat tiles, members page |
| `chiefs` | `{name, title, phone, since, note}[]` | about, contact, members (`filter` on title) |
| `chiefs_note` | string | about |
| `captains` | `{unit, name}[]` | members |
| `apparatus` | `{id, kind, year, make, spec, role}[]` | apparatus, home (`slice`) |
| `station.name`, `.opened`, `.cost`, `.size`, `.approved`, `.history` | string / number | about |
| `honor_guard` | string | members |
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
| `events` | `{date, end?, time, title, where, text}[]` | news page and home; past events are filtered out at build time, each event gets an `.ics` download link |

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
