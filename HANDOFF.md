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

## Current state (2026-10-15, written by the cloud session after engine 0.10.3 and the Hegins rebuild)

- Engine: `main` = `8386263`, version 0.10.3 (fixes the three Hegins gaps plus a seasonal/support band wrap).
  Tags `v0.10.2` (= `1a155e3`) and `v0.10.3` (= `8386263`) are NOT on GitHub; the cloud proxy refuses tag pushes.
  Kris: `cd ~/responder-engine && git pull && git tag v0.10.2 1a155e3; git tag v0.10.3 8386263; git push origin v0.10.2 v0.10.3`.
  Department sources pin the SHA (`#8386263`) so they install without the tag.
- `sightline-studio` branch `hegins-valley-fire` (= `8c31d23`, contains everything from `crains-creek-review-fixes`):
  - `sources/hegins-valley-fire` + `sites/hegins-valley-fire`: Hegins Valley first draft on 0.10.3, photo-free,
    `"patch": false`, station-number stat tile removed (Station 13 is in the header tagline), rig ids `13-10`/`13-50`
    (kind no longer doubled). Verified: 13 pages at 1366 and 390, zero HTTP errors, no broken images. Not deployed:
    needs a new Vercel project (`cd sites/hegins-valley-fire && npx -y vercel@latest deploy --prod --yes`), then the
    review link to Nicholas Morgan (president@hvfr.org). review.json has 25 questions. No PA rate factors yet, so no
    rating page.
  - `sources/crains-creek-fire` + `sites/crains-creek-fire`: re-pinned to 0.10.3, HTML identical to the live deploy.
  Kris: merge `hegins-valley-fire` to main (it supersedes `crains-creek-review-fixes`), deploy Crains from
  `sites/crains-creek-fire`, create and deploy the Hegins Vercel project.
- Crains review page: 28 open items for Chief Mackey; shop stays in the footer until Stripe links and photos exist.
- Station Ops (operation-charity repo, ADR + SO1): the other account's session; nothing in the engine depends on it.
- Known gaps: Facebook and map embeds render blank in headless screenshots (both load in real browsers). Hegins
  apparatus page is two cards on a wide grid; fine for a two-truck roster, revisit if the company lists more units.
  vite prints "didn't resolve" for `/patch.svg` and `/photos/structure-fire.jpg` on photo-free builds; harmless
  (CSS fallbacks that are never requested).

## End-of-session

Rewrite "Current state" above: engine SHA and version, each department's branch/SHA and what it still needs,
anything you started and did not finish. Commit it with the work, not after.
