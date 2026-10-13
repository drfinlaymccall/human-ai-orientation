# Project control and wishlist

Updated: 2026-10-13. Owner: Finlay McCall. All dates use Australia/Sydney time.

## Outcome and dates

Deliver a useful digital learning experience and demonstrate Finlay's ability to design, manage, launch, and operate the whole project. This is also Finlay's own learning journey; no particular job application sets the deadline.

The product is human orientation: build the person's capacity to work with an agent and identify meaningful goals. Learners leave with portable personal context and a next-goal brief they can take into the separate future human–agent curriculum-design programme or use independently. That later programme is outside this release and this project's wishlist.

- **MVP target: 16 October 2026.** Working interpretation of “within the next few days”, subject to the initial platform and deployment checks.
- **Public version target: 20 October 2026.** Finlay's requested “this time next week”. Earlier is welcome if the essential journey works.
- **After launch: weekly review and improvement.** Expand the course from evidence and prioritised ideas.

These are delivery targets, not a measured effort estimate. Hosting capacity, platform setup, outgoing email, and support-agent access are the main initial uncertainties. Re-estimate after the first working account-to-lesson-to-return journey. If a target slips, record the cause and revised forecast here rather than quietly removing essential behaviour.

## Public trial deployment — 13 October

Public deployment to `orientation.finlaymccall.com` is authorized. The server has managed PostgreSQL/PHP-FPM/web services, a Caddy HTTPS route, a public lesson preview and an individual reviewer account. Cloudflare MCP has created the proxied DNS record, and public HTTPS and independent external access are verified; see [deployment status](docs/trial/PUBLIC-DEPLOYMENT.md). Registration and external email stay disabled for this one-lesson trial. This does not replace the agreed three-activity MVP.

## Agreed first release

Finlay accepted three complete activities, expanding toward the full course later:

1. **Do one useful thing:** choose a small personally relevant goal, note what is familiar and where help is needed, inspect an explanation or example, name a simple sign of success, try the task with an existing AI tool, and reflect on the result.
2. **Give the AI useful context:** create and review a short personal context brief, select a useful note or example and consider its relevance, put its helpful points into words, and test whether that context improves the result. Distinguish what the learner needs to learn from what the agent needs to be told.
3. **Check, improve, and choose what comes next:** verify or correct a result, then extend the context brief with one future goal, why it matters, a first step, and a simple sign of success. Leave with a reusable document for independent work or the later collaboration programme.

These are refinements of the agreed three activities, not additional lessons or an expansion into the later programme. Provide copyable prompts and context text; manual transfer to and from the learner's own AI tool must work without product integrations. See the [draft takeaway](docs/curriculum/orientation-takeaway.md).

The context portfolio now includes short personal and project instruction briefs. Draft them in activity 2; test, explain and revise them in activity 3. Introduce `CLAUDE.md` and `AGENTS.md` as concrete conventions, with optional file setup for supporting tools and a complete copy/paste route for everyone. The [draft activity](docs/curriculum/context-to-instructions.md) connects this output to metacognitive reflection. Exact scope should stay small enough for the three-activity release.

The four underlying pillars—needs, content/knowledge, assessment/evaluation, and execution—appear as brief practical cues across these activities. Humans initially carry out the teaching/execution role. Build familiarity through doing; do not add four theory modules or require a teaching-agent integration.

The supporting journey includes accounts, saved progress, a course email, and a way to ask for help. Carry forward the agreed support model: an agent drafts an answer and Finlay approves it before sending. Synthetic test runs must exercise that approval boundary.

The existing machine containing `/home/finlay/apps` is the confirmed hosting target. Moodle is installed for a private trial and is the provisional platform recommendation. The public subdomain is `orientation.finlaymccall.com`. The ten-session outline is an expansion direction, not a requirement to launch ten sessions by 20 October.

## Now — deliver the MVP

| Item | Completion evidence | Current state |
| --- | --- | --- |
| Choose and prove the platform | Same essential learner journey demonstrated in the chosen platform; explain fit and upkeep | Moodle private trial installed with one complete context lesson; see trial decision and verification record |
| Confirm route and operating setup | Chosen subdomain works over HTTPS; secrets kept out of source; appropriate backup and recovery checked | Hosting machine confirmed; routing, email and deployment details pending |
| Write three complete activities | Purpose, explanation/example, task, reflection and useful fallback in each; learner retains context, a next goal and a first step | Context lesson authored and loaded in Moodle; useful-task and broader check/continue activities still to author |
| Implement learner journey | Preview, enrol, complete an activity, leave, sign in again and resume saved progress | Private Moodle journey implemented; public preview/enrolment still pending |
| Deliver course email | Test recipient receives an appropriate course message and usable return link | Confirmation, welcome and recovery messages captured locally; real delivery pending |
| Provide reviewed support | Help request produces an agent draft; approval sends the intended response; unapproved drafts remain unsent | Not implemented |
| Test and fix | Mobile/keyboard checks and labelled persona walkthrough; blocking findings resolved | Synthetic browser tests added for desktop/mobile journeys; physical-device and human checks pending |
| Invite pilot and prepare public release | A small human trial where available; working public preview; concise project account and operating notes | Not started |

## Suggested delivery sequence

| Window | Focus |
| --- | --- |
| 13–14 October | Platform/deployment feasibility, finalise the three activities, establish account and return flow |
| 14–16 October | Complete the learner journey, email, reviewed help, and initial tests; target working MVP |
| 17–19 October | Friends-and-family trial, fixes, accessibility checks, and public-facing explanation |
| By 20 October | Public version and initial portfolio case study; launch writing ready for Finlay |

The platform trial determines whether this sequence is feasible. Do not postpone all testing to the last day.

## Public AI-context addition — 13 October

Finlay requested public GitHub course materials and login-free pages that learners can share with their own AI. The first site context pack is implemented at `/ai/`, with a copyable starter, versioned Markdown, structured manifest and paste fallback. The public repository is still to prepare and publish from a reviewed allowlist; no GitHub URL is advertised yet. AI browsing remains optional. See [the design and acceptance requirements](docs/curriculum/public-ai-context.md) and R22–R24 in the brief.

## Preparation and Finlay’s tips — 13 October

Added a files-and-folders entry activity before the existing AI lesson, with a short diagnostic, Mac/Windows scavenger hunt, real fictional practice download and self-check feedback. Added an optional Obsidian setup guide and inline Finlay’s tips, including beside “Keep three things separate”. Both guides are public and native Moodle resources. These add preparation, not another completed core AI activity; the other two agreed MVP activities remain outstanding. Self-check answers are not saved or graded. See [design and authoring notes](docs/curriculum/preparation-and-tips.md).

## Interactive activity pattern — 13 October

The context-brief activity now has an editable two-column builder, copy controls, random fictional scenarios and example responses for selection/omission/prediction. Drafts stay temporarily in the browser tab; learning notes are excluded from the AI brief. Apply this pattern to remaining activities where it makes the interaction clearer. The examples route is a valid way to explore the UX, not evidence of personal task performance. See [widget authoring notes](docs/curriculum/interactive-brief.md).

## Activity continuity — 13 October

Step 4 carries the brief, criterion and prediction into an editable try/check/improve workspace. Learners can bring back an AI response, copy a follow-up, and retain a practice record. Copy/paste and app-switching guidance is shared with preparation, with optional Be Connected foundations/video links. Temporary drafts remain local to the browser tab; this does not add account-backed portfolio storage.

## AI interface introduction — 13 October

The initial preparation now continues from files and controls into 10–15 minutes of AI instruction practice. It includes the same free-input comparison as `/free-tools`, editable/copied starters for text, speech, files and pictures, a follow-up check and a worked example. Total preparation is now approximately 20–30 minutes. Fixed quotas are avoided; review platform availability alongside the existing weekly provider check. A narrated demonstration of this exact workflow remains on the wishlist.

## Next — improve the first release

- Prepare and publish the public GitHub repository: reviewed course/source/design files, contributor instructions, ownership/licensing, version history and matching public AI context. Exclude private/runtime data; link the real repository only after publication.
- Progress-aware reminder and refresher emails, with pause and frequency controls.
- Provider-specific memory and project-context guidance, verified against the learner's actual tool.
- Optional challenges for experienced users.
- Optional AI Hero reading for instruction-file refinement; check provider-specific claims against current official documentation before linking from a lesson.
- One short narrated demonstration with captions and transcript.
- Simple reporting that separates real learners from test accounts and helps identify one useful improvement.
- Expand lessons toward the proposed ten-session course once the essential experience works.
- Publish an account of Finlay's design and delivery choices and prepare the LinkedIn launch.

## Later — wishlist

- Voice, images, live-camera demonstrations and accessible alternatives.
- Reminders, digests, browser assistance and computer-action activities.
- Optional in-course context-kit editing or export; storage and privacy decisions first.
- Additional curated learning resources and provider pathways.
- Certificates if learners value them.
- Richer personalisation or embedded AI assistance if there is a clear learning benefit and affordable operating model.

Wishlist items are possibilities, not delivery commitments. Move an item into Now only when it improves the essential journey or deliberately replaces another item. Record the tradeoff.

## Brain-dump inbox

Put rough ideas here without needing to design them first. During weekly review, turn worthwhile ideas into Next/Later items or retire them.

For each idea, capture only what is known: **idea; who it helps; desired result; an example/link; urgency**. Missing fields are fine.

No additional unsorted ideas yet. Existing ideas are captured above and in the design brief.

## Weekly review

Hold the first review within seven days of pilot launch, then weekly. Choose the regular day/time with Finlay; no calendar reminder or automatic monitor has been configured.

1. Walk the essential journey and check outstanding support requests or failures.
2. Review real learner observations, voluntary feedback, and activity evidence; review synthetic tests separately.
3. Check core-task links and provider instructions, prioritising recent product changes and learner-reported problems. Review the [free-tools shortlist](docs/research/free-ai-tools.md) for free text access, limits, regional availability and fit with each required task. Rotate deeper reviews of optional resources.
4. Review email delivery, operating costs, and maintenance needs.
5. Process the brain-dump inbox; choose at most three improvements for the coming week.
6. Record what changed, why, how it was checked, and which portfolio evidence it adds.

### Review record template

- Date and release reviewed:
- Real learner evidence:
- Synthetic test findings:
- Broken/stale material or operational issues:
- Decisions and up to three priorities:
- Costs, support load, and revised forecast if needed:
- Completed changes and validation:

## Source of truth

This file owns dates, current priorities, the wishlist, and review records. The [design brief](docs/design-brief.md) owns the learning and product rationale; the [discovery log](docs/discovery-log.md) records decisions and unresolved questions. Update superseded decisions in place and preserve a short explanation in the discovery log.
