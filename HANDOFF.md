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

## Current state (2026-10-15, written by the session that shipped 0.10.2)

- Engine: `main` = `1a155e3`, version 0.10.2. Tag `v0.10.2` must be pushed from the Mac (`git push origin v0.10.2`);
  the cloud session's git proxy refuses tag pushes.
- Crains Creek Fire-Rescue (`sightline-studio`, branch `crains-creek-review-fixes` = `8fc330e`): rebuilt on 0.10.2,
  HTML identical to the live deploy, CSS carries the header fixes. Needs merge to main and
  `npx -y vercel@latest deploy --prod --yes` from `sites/crains-creek-fire`. Shop is in the footer (`store.nav:false`)
  until Stripe Payment Links and product photos exist. Review page has 28 open items for the chief.
- Hegins Valley Fire-Rescue (Hegins, PA; Nicholas Morgan, president@hvfr.org): not started. Build on `#v0.10.2`
  with `"patch": false` until a patch file arrives; needs PA rate-bureau factors before a rating page.
- Station Ops (operation-charity repo, ADR + SO1): owned by whichever session Kris points at it; nothing in the
  engine depends on it.
- Known gaps: Facebook embed renders blank in headless screenshots (loads in real browsers; `home.hide` can drop it).

## End-of-session

Rewrite "Current state" above: engine SHA and version, each department's branch/SHA and what it still needs,
anything you started and did not finish. Commit it with the work, not after.
