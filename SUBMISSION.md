# KitCycle — prepared submission materials

Status: product implemented and tested locally October 31; not submitted to Devpost. The signed-in submission form and actual required fields have not been inspected in this run. No team roster has been created for this new project.

**Pitch:** Keep reusable club kits in circulation with explicit approvals, component checklists and a repair hold before the next loan.

**Pathway:** Hackathon. **Stack:** JavaScript ES modules, HTML, CSS, localStorage, Node test runner. No integrated AI.

**Source:** https://github.com/Ali-Ateeb/fourstack-kitcycle

**App:** https://ali-ateeb.github.io/fourstack-kitcycle/

**Demo:** `media/demo.mp4`, 1:49 edited actual-capture walkthrough with synthetic narration. Captions and transcript included; full audio/video decode passed. No YouTube upload is claimed.

## Inspiration

Student clubs can promise a kit for a workshop without knowing whether its components came back intact. KitCycle explores a small handoff workflow that makes incomplete returns visible before another loan. This is a proposed problem and prototype, not a claim based on interviews or measured losses.

## What it does

A synthetic club requests a kit. A person explicitly approves the request, then checks every component before checkout. A complete return restores availability; missing parts or damage put the kit in a repair hold until an inspection note and confirmation clear it. An export retains the local request and action history. Two pending requests cannot reserve the same kit.

## How it was built

An independent state machine validates each transition; the interface stores the synthetic state in the browser and checks revisions before saving. It includes readable errors, corrupt-storage handling, two-tab refresh, narrow-screen layout and JSON export. There are no external API calls or accounts. It is a local demonstration of workflow, not access-controlled equipment management.

## Verification and limitations

Ten core tests and a real local browser walkthrough passed. Actual screenshots show the initial shelf and repair hold. No real lending, user research, measured impact, integration AI, human review or physical inspection was performed. Production use would require authenticated roles, a server transaction model, inventory editing and an operational inspection process.

## AI, prior work and team disclosure

Codex generated the new October 31 implementation, tests, documentation and demo preparation. A pre-event concept outline was made October 29 and is disclosed. No application code from the team's other competition projects was reused. Standard MIT license wording and browser/Node APIs are used. Team members must review and understand the code before presenting it. Add only actual joined members and their true contributions; no personal contribution or learning claim is supplied automatically.

## Remaining external steps

- Inspect the current STEMergent submission form using the correct authenticated teammate account; check eligibility and required round materials.
- Create one project entry, add the actual team, and save source/app/screenshots and these disclosures. Obaidullah still needs his own registration and authenticated joining.
- Supply a real video URL if required, after an actual upload; a local video or deployment does not imply a YouTube upload.
- Check the final agreements at action time and record the organizer's actual confirmation. Until then, `project_submitted` is false.

Internal conservative deadline: November 16 at 06:00 Pakistan time. Current official schedule instead lists 08:30; use the earlier internal target without claiming the conflict was resolved.
