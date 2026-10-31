# KitCycle

A small equipment lending and repair prototype for student clubs. Try an invented request, approve it, inspect every component at checkout, and return a kit with a missing cable. The kit stays out of circulation until an inspection clears its repair hold.

Source: https://github.com/Ali-Ateeb/fourstack-kitcycle . App: https://ali-ateeb.github.io/fourstack-kitcycle/ . `media/demo.mp4` is a 1:49 edited walkthrough of actual app screenshots with synthetic narration, captions and transcript. Complete audio/video decoding passed. It has not been uploaded to YouTube.

This is a synthetic local demo, not a deployed club service. No user study, real users, measured impact, physical inspection or individual teammate contribution is claimed.

## Run and test

Serve this folder with `python -m http.server 8000`, then open http://localhost:8000. ES modules require an HTTP server. No build step, dependency installation, account or API key is needed. Run `npm test` with Node 20+ for ten core tests.

`core.mjs` is the deterministic transition/validation layer. `app.mjs` handles rendering and browser storage. User input is rendered as text. State changes validate the current data and expected revision before saving. Other tabs refresh on storage events; a stale write is rejected. This is a best-effort local check, not a database transaction across users or devices.

## Judge walkthrough

1. Choose Circuit starter, enter an invented club alias and workshop purpose, then send a request. It does not reserve the kit.
2. Review and explicitly confirm approval. Another pending request cannot approve the same reserved kit.
3. Try checkout with an unchecked part: it is rejected. Check Board, USB cable and Sensor pack, then record checkout.
4. Return with USB cable missing and a repair note. The kit becomes unavailable for lending.
5. Enter an inspection note and confirm the simulated inspection to restore availability. An inspection button cannot verify real equipment.
6. Export audit JSON. It contains the synthetic kits, requests and complete local action history.

Reset replaces saved demo data after a confirmation. Export first if needed. A malformed saved file is not silently overwritten. Storage failures show an error. There is no audit import yet.

## Scope and limits

Three fixed synthetic kits, component checklists, requests, approval/decline/cancel, checkout, return, repair queue and JSON audit export are implemented. There is no authentication, role enforcement, cloud synchronization, multiuser locking, due dates, reminders, inventory editor, barcode scanning, signed audit or real inspection verification. Anyone who can use the browser can operate all demo roles and edit browser data. Do not enter real contact details. Data remains in browser localStorage, is included in exports, and can be lost when browser data is cleared. Hosting may receive normal page-request metadata; the app has no analytics or external API calls.

Ten core tests passed October 31. A fresh local headless browser also checked the actual lending/repair workflow, incomplete checkout rejection, JSON download contents, reload persistence, two-tab refresh, stale writes, HTML text escaping, corrupt storage/reset and a 390px viewport. Screenshots are actual app captures. These checks do not certify production security or organizer eligibility.

## Originality and AI disclosure

The idea was outlined October 29 before the event. New implementation, tests, screenshots and documentation were created October 31, after the conservative internal build opening. No prior competition application code was copied. Standard platform APIs and standard MIT license wording are used. Codex generated the implementation, tests, documentation and demo preparation; significant AI assistance must be disclosed in the event entry. No AI model runs inside the app. The humans must review, understand and be able to explain this code; their review is not claimed to have happened.

## Event status

Prepared for STEMergent's Hackathon pathway. Rules permit teams up to four and disclosed AI assistance. Published schedule and rules disagree on exact times. Internal build interval: October 31, 2026 09:00 through November 16 06:00 Pakistan time, inside both interpretations. The organizer has not resolved that conflict. Sources: [rules](https://stemergent-hacks.devpost.com/rules), [schedule](https://stemergent-hacks.devpost.com/details/dates).

This repository and a live app are separate from a Devpost project submission. No event entry, final agreements, team join, YouTube upload or acceptance is claimed here. See `SUBMISSION.md` for the prepared copy and remaining steps.
