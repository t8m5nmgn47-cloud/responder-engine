# HANDOFF.md — read this first, update it last

Kris works with one Claude session at a time, but not always the same one. This file is how a session picks up
where the last one stopped. Every session reads it before doing anything and rewrites the "Current state" block
before it finishes. `CHANGELOG.md` is the history; this file is the present.

## Start-of-session checklist

1. `cd ~/responder-engine && git pull` — then read this file and the top entry of `CHANGELOG.md`.
2. `git describe --tags` must match `package.json` `version`. If not, something was left half done: say so before building.
3. Department repos pin a tag or SHA (`#v0.10.3`). Build against that tag; if the department needs something the engine
   can't do, change the engine, bump, add a CHANGELOG entry, tag, push, then re-pin.
4. Never rewrite history on main (no rebase, amend or force-push of a pushed commit). Merge if diverged.
5. Pixels before "done": build, serve `dist/`, screenshot at 1366 and 390 (and 1200 for a nine-item nav), and look
   at the images. A clean build and a passing structural check say nothing about how the page looks; today's
   two header bugs were both invisible until a screenshot.

## Current state (2026-10-16, written by Kris's Mac session after engine 0.10.5 and the Thomasville build)

- Engine: `main` = `24861e5`, version 0.10.5, tags `v0.10.4` (= `8d42cb4`) and `v0.10.5` (= `24861e5`) pushed from
  Kris's Mac (tag pushes work there; `v0.10.2`/`v0.10.3` are on GitHub too now). 0.10.4/0.10.5 make `founded`,
  `address.street`/`zip` and `lodd[].joined` optional and fix two live Hegins bugs (empty `tel:+1` link after a
  chief with no phone; "0 members, career and volunteer" on about). Verified: Crains byte-identical (normalized) on
  0.10.3 vs 0.10.5; Hegins differs only in those two fixes. A root `.gitignore` now keeps `node_modules/` out
  (a stray root `node_modules` exists on the Mac; `example/` has content but no package.json, so it can't build).
- `sightline-studio` main (= `01a2ded`, pushed):
  - `sources/thomasville-fire` + `sites/thomasville-fire`: Thomasville Volunteer Fire Department (Thomasville,
    Oregon County, MO), first draft on 0.10.5 (pinned `#v0.10.5`). Request from Fire Chief
    Tyler Trantham (tvillefire@yahoo.com, 417-293-3218) on 2026-10-16; he asked for recruiting, resident info,
    memorial or history, donations. Built from the department's Facebook page (read in Kris's signed-in Chrome),
    Ozark Radio News, MO DPS/DFS, the Governor's release, KY3 and Firehouse. LODD: Firefighter William "Bill" Nix,
    2025-01-16 (memorial page; review item 1 asks the chief and family before anything about Bill goes public).
    No street address or ZIP on file (Facebook lists Birch Tree, MO 65438); membership dues go to the Community
    Center mailbox, 134 Old St., Birch Tree. Verified with Playwright (system Chrome, `channel: 'chrome'`) at 1366
    and 390: 15 pages, no horizontal overflow, no broken images, no local HTTP errors. Photos: Kris asked to use the
    department's own Facebook photos so the chief sees a real-looking site (he'll get originals from them); 10 in
    `public/photos/` (station, engine bay, Tanker T205 with its unit number visible, an engine, fire scenes) and
    `patch.svg`/favicons from the department's logo with the cream background cut out. Raw downloads and the
    contact sheet are in `_incoming/thomasville-fb/` (git-excluded). The memorial page stays photo-free until the
    chief and Bill's family weigh in (review items 1-2). Screenshots in `_incoming/thomasville-shots/`
    (git-excluded). DEPLOYED 2026-10-16 to https://thomasville-fire.vercel.app
    (own Vercel project `thomasville-fire`, linked in `sites/thomasville-fire/.vercel`; same `npm run sync` caveat
    as Hegins: back up `.vercel`, `.gitignore` and `.env.local` first). Review email to the chief is a Gmail DRAFT
    in Kris's account, not sent. review.json has 20 questions; widget feedback lands in the admin as site
    `thomasville-fire`. The request in the admin is still marked New.
  - Uncommitted on the Mac, not from this session: `sources/crains-creek-fire/site.config.json` and 20 files in
    `sites/crains-creek-fire` (one-line changes each; likely the "Crains Creek Fire-Rescue" header name). Left alone.
  - Hegins Valley: still on 0.10.3; a rebuild on 0.10.5 picks up the two fixes above. Its `copy.last_team` is `""`,
    which prints "notifies , trained volunteers" on the memorial page: delete that key (the default names
    Pennsylvania's LAST). Still needs the review link to Nicholas Morgan (president@hvfr.org).
- Crains review page: 28 open items for Chief Mackey; shop stays in the footer until Stripe links and photos exist.
- Station Ops (operation-charity repo, ADR + SO1): the other account's session; nothing in the engine depends on it.
- Known gaps: Facebook and map embeds render blank in headless screenshots (both load in real browsers). The
  escape-plan page's own `<head>` still links `/favicon.png` and `/patch.svg` when `"patch": false` (two 404s on
  that one page). Headless Chrome via `--window-size=390,…` misrenders (tall viewport, clipped width); use
  Playwright with a 390x844 viewport and `fullPage` instead. vite prints "didn't resolve" for `/patch.svg` and
  `/photos/structure-fire.jpg` on photo-free builds; harmless.

## End-of-session

Rewrite "Current state" above: engine SHA and version, each department's branch/SHA and what it still needs,
anything you started and did not finish. Commit it with the work, not after.
