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

## Current state (2026-10-17, cloud session: engine 0.12.0 "nothing untrue", NOT merged, tagged or pushed)

- Engine 0.12.0 lives on local branch `nothing-untrue` (commits 5e3096a..HEAD on top of main f46ae0d). Not merged
  to main, not tagged, not pushed: waiting for Kris to see Thomasville. To release: merge to main, `git tag v0.12.0`,
  push main + tag, then re-pin each department and `npm install`. CHANGELOG top entry and README "Nothing untrue
  (0.12.0)" describe it. Plan doc: "Making Every Department's Site Its Own" (Claude Docs).
- How to build a department against the working engine without a tag: `zsh ~/sightline-studio/_incoming/try-engine.sh
  <slug>` (copies the source to /tmp/eng-test/<slug>, drops the working engine into node_modules, builds to dist).
  Checks used: `_incoming/shots.mjs <dist> <out>` (1366 + 390, overflow, broken images, console errors),
  `_incoming/axe.mjs <dist>` (WCAG 2.1 AA), `tools/provenance-audit.mjs` (every line not from the department's
  data). All in sightline-studio `_incoming/` (git-excluded) except the audit, which is in the engine.
- Thomasville source (uncommitted in sightline-studio): join/community/signature/theme/home.order content, copy
  fixes (no "20 minutes", no pager, no invented mission, no placeholders), BRIEF.md with sources, review items
  `story`, `colors`, `story-questions`. Built on 0.12.0: 14 pages, axe clean, no overflow except the print sheet.
  A fresh-eyes fact check (separate agent) was run against the public sources. Still pinned `#v0.10.5`; the live
  draft is the old build. Gmail draft to the chief is still held.
- Hegins source (uncommitted): Nicholas Morgan's Oct 17 email applied (five units, station history), join from the
  old Join Today page, signature "Two fire companies. One valley." (Republican & Herald 2016), reviewer
  "President Morgan". Blocked on photos (photographers' OK pending) and a chosen patch/colors. A reply to Nicholas
  is a Gmail draft (domain: they already own hvfr.org; address 120/720/1720 and phone 1261/1267 questions).
- Crains: builds on 0.12.0 but has had no content pass. Its rating page defaults (rating.astro `work.year`,
  "Tuesday nights and Saturday mornings", test months, "36 hours a year") are unsourced engine text; several
  copy keys are Paw Paw-derived (join_lede, call_door, members_h1). Needs a brief and the same treatment.

## Previous state (2026-10-16, written by Kris's Mac session after engine 0.10.5 and the Thomasville build)

- Engine: `main` = v0.11.1 (tags v0.10.4, v0.10.5, v0.11.0, v0.11.1 all pushed from Kris's Mac). 0.10.4/0.10.5 make
  `founded`, `address.street`/`zip` and `lodd[].joined` optional and fix the empty `tel:+1` and "0 members" bugs.
  0.11.0 adds `tools/patch` (own package.json; `cd tools/patch && npm install` once): `import` (existing art to
  patch.svg + icons), `options` (drafted round badge / Maltese cross / shield from `<source>/patch.json`, text as
  outlines) and `build` (the chosen style), plus a noindex `/patch-options/` page when dept.json has
  `patch_options`. 0.11.1 fixes that page's build. README "Patches" has the commands. Verified: Crains
  byte-identical (normalized) from 0.10.3 through 0.11.1. Root `.gitignore` keeps `node_modules/` out; `example/`
  can't build (no package.json), so test engine changes against Crains/Hegins/Thomasville copies.
- Patch wall: every site is free; Sites for Service asks each department for one patch for its wall. It's in the
  Thomasville email draft and both review intros; put it in every first email and review.
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
    in Kris's account, not sent (now ends with the patch-wall ask). Redeployed with the patch-wall review intro. review.json has 20 questions; widget feedback lands in the admin as site
    `thomasville-fire`. The request in the admin is still marked New.
  - Uncommitted on the Mac, not from this session: `sources/crains-creek-fire/site.config.json` and 20 files in
    `sites/crains-creek-fire` (one-line changes each; likely the "Crains Creek Fire-Rescue" header name). Left alone.
  - Hegins Valley: on 0.11.1 (`#v0.11.1`), rebuilt on main (`e15a58f`) and DEPLOYED 2026-10-16 to
    https://hegins-valley-fire.vercel.app. Changes: the two 0.10.4 fixes, `last_team` blank removed, three drafted patches at `/patch-options/`
    from `sources/hegins-valley-fire/patch.json` (EST 2015 = the merger; review item 1 asks), patch-wall line in the
    review intro. 16 pages checked at 1366 and 390. Still needs the review link to Nicholas Morgan.
- Intake (sightline-studio main `bc13721`, live 2026-10-17): sitesforservice.org/questionnaire (files in
  `first-responders/brief/`, questions in `questions.json`), offered on the request form's thank-you and emailed in an
  automatic reply from hello@ (`api/responder-request.js`, `api/_mail.js`). Answers save as they type into
  fire_sites.requests.brief; the first Send emails hello@ a summary. Admin request detail shows the answers and has
  "Copy questionnaire link"; the Compose "Reply to a site request" template fills in that link. No email template
  asks for a call or meeting any more; the auto-reply opens with "Hello,".
  MAIL IS NOT CONNECTED until Kris installs `tools/gmail-sender/Code.gs` as an Apps Script web app and sets
  GMAIL_WEBHOOK_URL and GMAIL_WEBHOOK_SECRET in Vercel (README in that folder). Until then requests still save and
  Slack says "auto-reply not sent".
  fire-sites-api is v16 (Supabase project lbaalfejyappdbedejtc, deploy from ~/fire-functions with
  `--no-verify-jwt`); ~/fire-functions is not its own git repo, so v15 is backed up at
  ~/fire-functions/index.ts.v15-backup-2026-10-17. Request 9 is a Claude test row, marked spam.
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
