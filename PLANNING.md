# KitCycle - original pre-event concept outline

Prepared October29. This outline is retained as disclosed pre-event planning. At that time no implementation, repository, deployment, video, user study or submission existed. October31 update: a new implementation and ten core tests plus an actual local browser walkthrough now exist. Consult README.md and SUBMISSION.md for current release and submission status; this original planning text is historical.

Problem:small student clubs lose track of reusable project kits and repair needs,so a booking can promise equipment that is missing or broken. Proposed users are club equipment volunteers,not real named customers.

Small first version:synthetic inventory with available/loaned/repair states;request a kit;show availability and a human approval step;record checkout/return;flag missing components and route a repair task before re-use. Export a simple audit log. No automated contact or real student records.

Distinct from FixtureForge's synthetic-data generator and WindowWise's schedule planner. This is a new inventory/repair workflow;do not copy prior competition code or call those products new work. An internal planning outline is pre-event material and must be disclosed if reused.

Implementation after the permitted opening:local-first browser app,small deterministic state machine,synthetic data,clear empty/error states. Planned checks:preventdoublecheckout,unavailable/repairkit cannot be approved,invalidreturns blocked,staleavailability refreshed,export agrees with logged actions. These checks are planned,not executed or passed.

Scope should fit limited teammate availability. Assign actual work only when each member participates;do not attribute completed contributions to anyone now. Optional AI assistance must be disclosed;integratedAI is not claimed or necessary to this concept.

Current official schedule opens October30 23CDT,closesNovember15 21:30CST. Rules instead say19CST at both ends. Conservative internal build interval:October31 09PKT-November16 06PKT,inside both interpretations. This does not resolve the organizer discrepancy. No code before opening. Confirm live first-round form requirements and allowed team updates before preparing any entry.

Sources:https://stemergent-hacks.devpost.com/rules and https://stemergent-hacks.devpost.com/details/dates
