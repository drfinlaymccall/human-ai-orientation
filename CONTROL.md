# Project control and wishlist

Updated: 2026-10-23. Owner: Finlay McCall. All dates use Australia/Sydney time.

## Outcome and dates

Deliver a useful digital learning experience and demonstrate Finlay's ability to design, manage, launch, and operate the whole project. This is also Finlay's own learning journey; no particular job application sets the deadline.

The product is human orientation: build the person's capacity to work with an agent and identify meaningful goals. Learners leave with portable personal context and a next-goal brief they can take into the separate future human–agent curriculum-design programme or use independently. That later programme is outside this release and this project's wishlist.

- **Current stage:** working public demo/reviewer course; no public learner enrolments, as confirmed by Finlay on 23 October. Public registration remains closed.
- **Current batch:** preserve the course on GitHub main, improve the LMS showcase and current documentation, run existing checks, and reconcile issues.
- **Next batch ([issue #9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9)):** improve the homepage, verified registration/self-enrolment and course progression, then run the human pilot and prepare the LinkedIn course/module series.
- **Launch forecast:** set after onboarding work is scoped and checked. The original 16 October MVP and 20 October public-version targets are superseded planning dates, retained in the historical schedule below; public enrolment was not delivered against the latter target.
- **After launch:** weekly review and improvement from actual learner evidence.

Finlay authorises work in the current demo checkout. Separate integration worktrees, a backup audit and restore rehearsals are not requirements for this baseline. He reports paid whole-server Contabo backups and accepts that provision for now; settings and recoverability are not independently verified. GitHub preserves the public product source, not private runtime data.

Documentation/status updates are part of each change under AGENTS.md and CONTRIBUTING.md, rather than a new documentation issue for every edit. Existing local checks remain the baseline; GitHub Actions activation is tracked separately in [issue #10](https://github.com/drfinlaymccall/human-ai-orientation/issues/10) because current publishing access lacks workflow permission.

## Public trial deployment — 13 October

Public deployment to `orientation.finlaymccall.com` is authorized. The server has managed PostgreSQL/PHP-FPM/web services, a Caddy HTTPS route, a public lesson preview and an individual reviewer account. Cloudflare MCP has created the proxied DNS record, and public HTTPS and independent external access are verified; see [deployment status](docs/trial/PUBLIC-DEPLOYMENT.md). This was the initial one-lesson deployment. The full journey and portfolio are now published; Gmail delivery is verified and password recovery enabled. Registration remains invitation-only. See the current state below.

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

## Current product and launch readiness

| Item | Completion evidence | Current state |
| --- | --- | --- |
| Choose and prove the platform | Same essential learner journey demonstrated in the chosen platform; explain fit and upkeep | Moodle retained; public reading plus native progress and portable portfolio implemented |
| Confirm route and operating setup | Chosen subdomain works over HTTPS; secrets kept out of source; appropriate backup and recovery checked | HTTPS and services operating; Gmail receipt verified; owner-reported Contabo backups accepted for demo; no restore exercise in this batch |
| Write three complete activities | Purpose, explanation/example, task, reflection and useful fallback in each; learner retains context, a next goal and a first step | Three activities plus portfolio bridge authored and published; existing Lesson IDs/records preserved |
| Implement learner journey | Preview, enrol, complete an activity, leave, sign in again and resume saved progress | Whole public journey available; invited Moodle accounts save progress; broad registration remains closed |
| Deliver course email | Test recipient receives an appropriate course message and usable return link | Owner received real course email with intended sender; SMTP active and native recovery available |
| Provide reviewed support | Help request produces an agent draft; approval sends the intended response; unapproved drafts remain unsent | Private draft/review/approve/send workflow implemented; synthetic approval-boundary checks pass |
| Test and fix | Mobile/keyboard checks and labelled persona walkthrough; blocking findings resolved | Synthetic browser tests added for desktop/mobile journeys; physical-device and human checks pending |
| Invite pilot and prepare public release | A small human trial where available; working public preview; concise project account and operating notes | Human pilot protocol and invitation draft prepared; recruitment/observations pending |

## Seven accepted workstreams — evidence and remaining work

1. **Control and outcome:** this file centres the portable personal context portfolio; baseline documentation is updated with each change. [Issue #1](https://github.com/drfinlaymccall/human-ai-orientation/issues/1).
2. **Complete the journey:** useful task → context lesson → portfolio bridge → check/continue. [Issue #2](https://github.com/drfinlaymccall/human-ai-orientation/issues/2).
3. **Reliable take-away:** Markdown documents and versioned JSON backup/restore, local temporary drafts, selectable context, private practice notes. [Issue #3](https://github.com/drfinlaymccall/human-ai-orientation/issues/3).
4. **Email and reviewed help:** Gmail delivery owner-confirmed; recovery restored; private operator-assisted draft/approval/send workflow. [Issue #4](https://github.com/drfinlaymccall/human-ai-orientation/issues/4), [operations](docs/operations/email-and-support.md).
5. **Human pilot:** protocol, private observation template and invitation draft ready. Finlay selects/invites 3–5 people; no learner observations yet. [Issue #5](https://github.com/drfinlaymccall/human-ai-orientation/issues/5).
6. **Expand from evidence:** choose no more than three improvements after pilot synthesis. Extra modalities, reminders and demonstrations stay on the wishlist until then. [Issue #6](https://github.com/drfinlaymccall/human-ai-orientation/issues/6).
7. **Build in public:** repository, source pin, current and original brief, research, curated dialogue, decisions, checks and release history. [Issue #7](https://github.com/drfinlaymccall/human-ai-orientation/issues/7), [design history](docs/history/README.md).

The core journey takes approximately 70–95 minutes including the portfolio extension, plus optional 20–30-minute preparation. Times are author estimates, not measured learner timings. New Page completion is learner-marked practice. The original Lesson retains its completion and reflection; no overall course-completion rule has been retroactively changed.

## Original delivery schedule — superseded

| Window | Focus |
| --- | --- |
| 13–14 October | Platform/deployment feasibility, finalise the three activities, establish account and return flow |
| 14–16 October | Complete the learner journey, email, reviewed help, and initial tests; target working MVP |
| 17–19 October | Friends-and-family trial, fixes, accessibility checks, and public-facing explanation |
| By 20 October | Public version and initial portfolio case study; launch writing ready for Finlay |

This is the original October planning schedule, not the current forecast. The course is a working demo; broad enrolment and the human pilot remain open. Set the public launch date during the next onboarding batch.

## Public AI-context addition — 13 October

Finlay requested public GitHub course materials and login-free pages that learners can share with their own AI. The first site context pack is implemented at `/ai/`, with a copyable starter, versioned Markdown, structured manifest and paste fallback. The public repository is [drfinlaymccall/human-ai-orientation](https://github.com/drfinlaymccall/human-ai-orientation). Curated source and history exclude runtime secrets and learner records. AI browsing remains optional. See [the design and acceptance requirements](docs/curriculum/public-ai-context.md) and R22–R24 in the brief.

## Preparation and Finlay’s tips — 13 October

Added a files-and-folders entry activity before the existing AI lesson, with a short diagnostic, Mac/Windows scavenger hunt, real fictional practice download and self-check feedback. Added an optional Obsidian setup guide and inline Finlay’s tips, including beside “Keep three things separate”. Both guides are public and native Moodle resources. These are preparation resources. The two remaining core activities were subsequently authored in the portfolio release. Self-check answers are not saved or graded. See [design and authoring notes](docs/curriculum/preparation-and-tips.md).

## Interactive activity pattern — 13 October

The context-brief activity now has an editable two-column builder, copy controls, random fictional scenarios and example responses for selection/omission/prediction. Drafts stay temporarily in the browser tab; learning notes are excluded from the AI brief. Apply this pattern to remaining activities where it makes the interaction clearer. The examples route is a valid way to explore the UX, not evidence of personal task performance. See [widget authoring notes](docs/curriculum/interactive-brief.md).

## Activity continuity — 13 October

Step 4 carries the brief, criterion and prediction into an editable try/check/improve workspace. Learners can bring back an AI response, copy a follow-up, and retain a practice record. Copy/paste and app-switching guidance is shared with preparation, with optional Be Connected foundations/video links. Temporary drafts remain local to the browser tab; this does not add account-backed portfolio storage.

## AI interface introduction — 13 October

The initial preparation now continues from files and controls into 10–15 minutes of AI instruction practice. It includes the same free-input comparison as `/free-tools`, editable/copied starters for text, speech, files and pictures, a follow-up check and a worked example. Total preparation is now approximately 20–30 minutes. Fixed quotas are avoided; review platform availability alongside the existing weekly provider check. A narrated demonstration of this exact workflow remains on the wishlist.

## Optional deeper courses — 13 October

Published a seven-resource comparison in Moodle and at `/deeper-courses`, with original summaries, suggested starting points and a return-to-practice loop. Rights evidence is in `docs/research/deeper-courses.md`; external materials are linked, not imported. Finlay selected CC BY 4.0 for original course materials. `LICENSE-CONTENT.md` defines scope and attribution; public and Moodle notices are published. External content, learner records and software are excluded.

## Next — open the course to learners

First improve the homepage call to action, email-confirmed registration and self-enrolment, module progress and return navigation. Keep experiential tasks and reflections as the assessment model. Plan the human pilot and course/module LinkedIn posts around a checked enrolment journey.

### Subsequent improvements

- Run the prepared human pilot; prioritise changes using retrieval/reuse observations, help requests and actual task results.
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
- Optional account-backed portfolio storage only if learner evidence justifies it; current download/restore works without an account.
- Additional curated learning resources and provider pathways.
- Certificates if learners value them.
- Richer personalisation or embedded AI assistance if there is a clear learning benefit and affordable operating model.

Wishlist items are possibilities, not delivery commitments. Move an item into Now only when it improves the essential journey or deliberately replaces another item. Record the tradeoff.

## Brain-dump inbox

Put rough ideas here without needing to design them first. During weekly review, turn worthwhile ideas into Next/Later items or retire them.

For each idea, capture only what is known: **idea; who it helps; desired result; an example/link; urgency**. Missing fields are fine.

### 14 October — Objectives, competencies and a personal learning map

- **Idea:** attach a clear objective, a connection to the learner's personal objective and linked can-do statements to every course page/resource. Maintain a shared objective and competency bank, with individual self-assessment and links back to instruction.
- **Who/result:** self-guided learners can see why a resource matters, what they can do, what needs practice and where to return. A personal competence map connects goals, progress and course modules and becomes a portable takeaway.
- **Example:** `/notes` supports setting up a notes app, creating and reopening a note, and selecting context to share. See the [worked example and design exploration](docs/design-brief.md#course-wide-objectives-and-competencies--14-october-feedback).
- **Entry route confirmed:** offer an optional course-based self-assessment quiz to suggest the learner's starting map, including prior capability. Learners review suggestions, can flag guesses or uncertainty, and choose practice even after correct answers. Skipping the quiz remains valid; the map guides a learner-directed route rather than locking modules.
- **Sequence proposed for review:** author the bank and pilot the page pattern on `/notes`; then add saved self-assessments, automatic resource-engagement records and the personal map. Queue optional bring-your-own-AI assessment as a later experiment using explicit tasks and criteria.
- **Urgency/status:** course-wide direction requested by Finlay; priority and implementation details remain open. No new launch deadline or claim that these features are live. Keep reading progress distinct from capability and preserve historic completion and alternative notes apps.

### 14 October — Linked course glossary and workspace guides

- **Idea/result:** a shared glossary page lets learners follow unfamiliar terms to a plain-language definition, concrete example, official guidance and a link back to their activity. Include the glossary's own objective and competency connections.
- **Proposal populated:** [starter glossary and finding your workspace](docs/curriculum/glossary.md), covering files/paths, hidden folders, agent workspaces, context/portfolio, instructions/settings/memory and learning/progress terms. Includes Mac/Windows navigation and product-specific Claude Code/Codex file locations.
- **Visuals and integration queued:** real annotated app/OS screenshots, public and Moodle glossary pages, and definition links through the course. Distinguish local files, remote environments and web-project knowledge; use exact `.claude/`, `.codex/`, `CLAUDE.md` and `AGENTS.md` names.
- **Status:** source-backed proposal only. Publishing, screenshots, physical OS walkthroughs and delivery priority remain open; no requirement to install an agent or edit hidden configuration to complete orientation.

### 16 October — Day of AI resources and optional side quizzes

- **Idea:** Finlay proposed optional homepage side quests and one-question course emails that return learners to personalised outcomes, inspired by [World Food Day trivia](https://dayofai.org/games/trivia/world-food-day).
- **Discovery:** [Day of AI resource and integration ledger](docs/research/day-of-ai.md) records 24 prioritised resource groups, further catalogue leads, six Australian games, access checks and item-level reuse follow-ups. Strong matches include choosing AI tasks, context/data judgement, verification, short activities, vocabulary cards and workplace/portfolio exercises.
- **Proposed first slice:** one untimed, original orientation question with explanatory feedback and a next-practice link; three question sketches are recorded. Keep it optional and separate from course completion and practical competence claims.
- **Later dependency:** personal results and email return links need confirmed-response storage, learner identity, learning-map links and subscription/frequency controls. A link visit must not itself save an answer. The service's own game score is not a student analytics integration.
- **Rights/status:** Day of AI covered material is CC BY-NC-SA 4.0, not this project's CC BY 4.0. Inspect exact assets and intended use before adaptation; partner resources have separate checks. Discovery is complete to the documented scope; implementation, publication and learner email delivery remain proposals, with no new launch commitment.

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

## Voice feedback - 23 October 2026

Finlay authorised building stage one of the voice-input request in a separate branch alongside release-baseline work. The standalone Moodle plugin provides contextual private audio/text feedback, reviewed playback before Send, a private inbox and notifications. Transcription, voice in arbitrary answer fields and AI coaching remain later options.

Source and synthetic verification are recorded in the [feature release](docs/releases/2026-10-23-voice-feedback.md); [operator setup](docs/operations/voice-feedback.md) covers explicit installation, course/reviewer enablement, retention and rollback. The release baseline was merged before this feature branch was rebased. No live activation is claimed by the feature build. Physical microphones/phones, Safari and an external notification receipt remain integration checks. Public registration and the launch batch in issue #9 are unchanged by this work.

## Source of truth

This file owns dates, current priorities, the wishlist, and review records. The [design brief](docs/design-brief.md) owns the learning and product rationale; the [discovery log](docs/discovery-log.md) records decisions and unresolved questions. Update superseded decisions in place and preserve a short explanation in the discovery log.
