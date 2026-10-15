# HANDOFF.md — read this first, update it last

Kris works with one Claude session at a time, but not always the same one. This file is how a session picks up
where the last one stopped. Every session reads it before doing anything and rewrites the "Current state" block
before it finishes. `CHANGELOG.md` is the history; this file is the present.

## Start-of-session checklist

1. `cd ~/responder-engine && git pull` — then read this file and the top entry of `CHANGELOG.md`.
2. `git describe --tags` must match `package.json` `version`. If not, something was left half done: say so before building.
3. Department repos pin a tag (`#v0.10.2`). Build against that tag; if the department needs something the engine
   can't do, change the engine, bump, add a CHANGELOG entry, tag, push, then re-pin.
4. Never rewrite history on main (no rebase, amend or force-push of a pushed commit). Merge if diverged.
5. Pixels before "done": build, serve `dist/`, screenshot at 1366 and 390 (and 1200 for a nine-item nav), and look
   at the images. A clean build and a passing structural check say nothing about how the page looks; today's
   two header bugs were both invisible until a screenshot.

## Current state (2026-10-15, written by Kris's main Cowork session after building Hegins Valley on 0.10.2)

- Engine: `main` = `85e5b40` (HANDOFF commit on top of `1a155e3`, the 0.10.2 code), version 0.10.2. Tag `v0.10.2` is
  STILL NOT on GitHub: Kris runs `cd ~/responder-engine && git pull && git tag v0.10.2 1a155e3 && git push origin v0.10.2`.
  Department pins on `#v0.10.2` fail to install until then.
- Crains Creek Fire-Rescue (`sightline-studio`, branch `crains-creek-review-fixes` = `8fc330e`): rebuilt on 0.10.2,
  not merged, not deployed. Kris: merge to main, then `npx -y vercel@latest deploy --prod --yes` from
  `sites/crains-creek-fire`. Review page has 28 open items for Chief Mackey.
- Hegins Valley Fire-Rescue (Hegins, PA; Nicholas Morgan, president@hvfr.org): FIRST DRAFT BUILT on 0.10.2
  (engine @ `85e5b40`, pinned `#v0.10.2`, `"patch": false`, photo-free, fax empty, `copy.support_h2`/`h2b` set).
  Source + dist delivered to the Mac at `~/sightline-studio/cofff-build/hegins-valley-fire-{src,dist}-0102.zip`;
  intended home is `~/sightline-studio/sites/hegins-valley-fire` (new Vercel project). Not deployed, not sent to
  Nicholas. Content is sourced from the old Google Site, a 2016 Republican & Herald story and public records;
  review.json has 25 questions (officers, history/founding years, truck years, member and call counts, logo).
  Facebook was unreadable; no photos; no memorial names. Needs PA rate-bureau factors before any rating page.
- Engine gaps found by the Hegins build (also in `~/sightline-studio/cofff-build/hegins-ENGINE-NOTES.md`):
  (1) the home members stat tile always renders and cannot be hidden; a department with no sourced count has to
  relabel it. (2) A photo-free hero still references `/photos/structure-fire.jpg` and `-800`, giving a build
  warning and a 404. (3) `patch:false` still links the default favicon/apple-touch-icon. Fixed vs 0.7.0 and
  verified by screenshots at 1366/1200/390: header overflow, support headline override, fax line, photos optional.
- Station Ops (operation-charity repo, ADR + SO1): owned by the second account's session; nothing in the engine
  depends on it.
- Known gaps: Facebook embed and map embed render blank in headless screenshots (both load in real browsers).

## End-of-session

Rewrite "Current state" above: engine SHA and version, each department's branch/SHA and what it still needs,
anything you started and did not finish. Commit it with the work, not after.
