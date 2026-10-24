# Project control and wishlist

Updated: 2026-10-24. Owner: Finlay McCall. All dates use Australia/Sydney time.

## Outcome and dates

Deliver a useful digital learning experience and demonstrate Finlay's ability to design, manage, launch, and operate the whole project. This is also Finlay's own learning journey; no particular job application sets the deadline.

The product is human orientation: build the person's capacity to work with an agent and identify meaningful goals. Learners leave with portable personal context and a next-goal brief they can take into the separate future human–agent curriculum-design programme or use independently. That later programme is outside this release and this project's wishlist.

- **Current stage:** working public demo/reviewer course; no human pilot participants yet. Broad registration remains closed. The exact-address pilot gate is active only for owner-controlled confirmation/recovery checks; owner-controlled email confirmation, enrolment, fresh-browser return and genuine password recovery are verified.
- **Completed baseline:** PR #8 merged the course, preserved local feedback/research, improved the LMS showcase and current documentation, passed existing local checks and reconciled the original issues. See the [23 October release record](docs/releases/2026-10-23-baseline.md).
- **Current forward plan:** [Demo to public course and next releases](docs/plans/2026-10-23-002-feat-public-launch-plan.md) is the single delivery plan for the remaining launch work, supporting CI task, competency/map design and sequenced later improvements.
- **Course-review release ([issue #9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9)):** clear account state/navigation, illustrated **Your course journey** with real completion, adjacent activity details and the optional six-statement paired self-rating check are implemented and reviewed in the preview branch. Full personal skills/evidence tracking remains later work. See the [review log](docs/reviews/course-review.md) and [local-agent walkthrough](docs/qa/course-review-agent.md). WB01 joins the separate live context/feedback source in an isolated candidate; reviewed merge status and deployment remain distinct.
- **Implementation status:** clear offer/activity atlas, native verified-account flow/current-user progress and matching public AI metadata are implemented. [Current evidence and limits](docs/releases/2026-10-23-launch-implementation.md) records verification and live state.
- **Course-review implementation:** U1–U4/U8/U9 code and synthetic rehearsal are complete in the preview. Final checks pass: public entry 9, metadata 7 Python + 2 browser, portfolio 8, support 6, deployment boundary 3, delivered-script lifecycle 6, native progress/session 16, starting-point 8, onboarding 10, public Tips 6 and native Tips 2. Eleven review contexts found three defects, all fixed and independently rechecked; cross-model execution was unavailable. The post-fix native suite passed all sixteen together. This batch has not deployed; see [dated evidence and limits](docs/releases/2026-10-23-course-review-implementation.md).
- **U8 optional starting-point check:** native Quiz publication, six paired self-ratings, immutable mappings/current-user attempt reading and explained suggestions are implemented in the preview. Neutral native attempt/summary/review, absence of a grade item, mobile, ownership, retake/version preservation, no-JavaScript and full captured-mail learner-journey checks pass in the independent 18812 fixture. The live default stays hidden/disabled until Finlay reviews the new saved-rating privacy/help wording. See [operations and exposure gate](docs/operations/starting-point.md); no owner approval or human pilot result is claimed.
- **Production handoff:** [24 October deployment sequence](docs/releases/2026-10-24-production-handoff.md) uses the WB01 joined source for My context schema/privacy/navigation, compact feedback and the newer journey/check. The installer refuses an unrepresented installed schema or newer release before copying. Saved-rating wording review and live smoke checks follow; this batch has not deployed. Joined context draft 2026-10-24.2 preserves both the already served .23.2 and the prior .24.1 bytes.
- **Launch forecast:** choose T0 after genuine mail/recovery, retention review and the human pilot; [release handoff](docs/launch/readiness.md) and five LinkedIn drafts are prepared. The original 16 October MVP and 20 October public-version targets are superseded planning dates, retained in the historical schedule below; public enrolment was not delivered against the latter target.
- **After launch:** weekly review and improvement from actual learner evidence.

Finlay authorises work in the current demo checkout. Separate integration worktrees, a backup audit and restore rehearsals are not requirements for this baseline. He reports paid whole-server Contabo backups and accepts that provision for now; settings and recoverability are not independently verified. GitHub preserves the public product source, not private runtime data.

Documentation/status updates are part of each change under AGENTS.md and CONTRIBUTING.md, rather than a new documentation issue for every edit. Existing local checks remain the baseline; GitHub Actions activation is tracked separately in [issue #10](https://github.com/drfinlaymccall/human-ai-orientation/issues/10) because current publishing access lacks workflow permission.

## Public trial deployment — 13 October

**23 October reusable Finlay’s Tips:** writing activities now share a right-hand panel where space permits, compact voice-input reminders beside editable boxes and three copyable prompt starters. Public preview, portfolio, practice, optional input preparation and native Lesson reflection use the same support. Six focused public checks, eight portfolio checks and two direct native checks passed; the older broad progress suite was incompatible with newer navigation in the shared fixture. See [reuse, verification and limits](docs/curriculum/finlays-tips.md). Voice input remains the learner's device/app, with typing/paste alternatives.

**23 October portfolio role-play:** reframed the portfolio as briefing a new assistant, with explicit questions and fictional examples in every box. Learners can answer the first three, save Working with me and add project/reference material later. Public and native portfolio copy are updated; eight portfolio checks passed and native publication preserved course structure/evidence. Preview/sidebar and visible-progress suggestions remain queued. See the [review log](docs/reviews/course-review.md) and [portfolio authoring notes](docs/curriculum/portfolio-builder.md).

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

This is the original October planning schedule, not the current forecast. The course is a working demo; broad enrolment and the human pilot remain open. Choose the public launch date from the current release-readiness evidence.

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

- **23 October draft available:** [V1 competency bank and non-linear map briefs](docs/curriculum/competency-framework-v1.md) develops the earlier six-area proposal into 18 core can-do statements, optional foundations, existing-activity mapping, self-assessment/evidence rules and three text prototypes. Finlay requested text first before courseware images. Review labels and scope before visual production; tracking, quiz and map deployment remain unbuilt. This does not expand or replace the current release-baseline batch.
- **V1.1 wording refinement:** Finlay requested paired knowledge/capability outcomes and stronger verbs across revised Bloom. The draft now maps all 22 statements (18 core, four optional foundations) to knowledge types and cognitive processes, and makes diagnosing, repairing and evaluating communication breakdowns explicit. Knowledge/performance judgements remain distinct. Source inspection and documentation checks are recorded in the draft and discovery log; no runtime or completion change.
- **V1.2 learner presentation:** Finlay requested clarity about modules, tasks, competency groupings and coded references. The framework now opens with activity labels, purpose and takeaways. Proposed atlas destinations are the three existing core activities plus a visible portfolio bridge and optional basics; six capability groups become author references and a possible secondary skills view. An in-chat clickable preview includes learner and readable course-design views. Labels and navigation remain proposals; production implementation, later-activity entry support and saved tracking are still queued.
- **Forward-plan integration accepted:** Finlay approved the activity-led atlas preview and asked to fold it into **HOC Forward plan**. The canonical plan now includes it in U1 homepage/navigation and U3 progress, with exact labels, activity details, mobile/no-JavaScript routes and entry-support acceptance. [Preview source](docs/prototypes/orientation-activity-atlas.html) is preserved as a design reference; no deployment or new saved assessment is claimed. L1/L2 retain detailed competency/self-assessment refinement and storage work.
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

## Source of truth

This file owns dates, current priorities, the wishlist, and review records. The [design brief](docs/design-brief.md) owns the learning and product rationale; the [discovery log](docs/discovery-log.md) records decisions and unresolved questions. Update superseded decisions in place and preserve a short explanation in the discovery log.

Finlay clarified the first feedback flow on 23 October: keep voice feedback as the minimum useful course feature, with a five-minute browser recording maximum. PR #11 now uses a 10 MiB upload allowance; no transcription or voice input in other fields is included. Updated verification is recorded in the feature release.

## Live voice feedback — 23 October 2026

Finlay authorised installation and enablement. Five-minute private audio/text feedback is now enabled for course 2; the owner administrator reviews the private inbox. Public help/privacy explain the channel. Public HTTPS browser checks verified record/listen/Send, exact private playback, reviewer access, peer/guest denial and a five-minute native upload. A generic notification email was captured locally; external receipt and physical microphones remain checks. Synthetic feedback was removed, temporary accounts suspended and pre-existing learner evidence preserved. See the [live release](docs/releases/2026-10-23-voice-feedback-live.md) and [local Codex test prompt](docs/operations/voice-feedback-local-test-prompt.md). PR #11 remains the integration record; newer launch work in the live checkout was preserved.

## Compact feedback entry — 23 October 2026

Finlay found the working feedback form unattractive and difficult to find from the homepage/journey. Replace the full-page-first experience with a consistent bottom-right “Give feedback” button and compact panel on public course pages and native Moodle activities. Keep record/listen/re-record/explicit Send, page context, private storage, and the full-page/no-JavaScript fallback. Closing releases the microphone and retains the draft on that page. The panel is live. Six isolated Moodle journeys and the public HTTPS flow passed, including sign-in return, close cleanup and private audio. Normal notifications are restored, synthetic data cleaned up and existing evidence preserved. See the [compact-panel release](docs/releases/2026-10-24-compact-feedback.md); operations and the local Codex test prompt describe the entry point.

## Voice-channel request — 24 October 2026

Queued: add optional local transcription guidance beside voice notes/dictation and voice feedback for learners with a suitable Mac or PC. Finlay prefers Fluid Voice with Parakeet and on-device transcription. Verify the exact app, platform support, hardware needs and local-processing claims before publishing a recommendation; this is a request, not a delivered integration. See the [request and acceptance checks](docs/requests/2026-10-24-local-voice-transcription.md).

## Reading preview cleanup — 24 October 2026

Finlay reported the Finlay’s Tips box in section 7 of `/preview` as redundant. The public reflection now omits the writing-support panel; its text and tips beside actual writing fields remain. The shared builder preserves native Moodle essay support and produces identical native lesson source. Six existing Tips checks and live narrow-screen checks with/without JavaScript passed; repeated generation is stable. See [author guidance](docs/curriculum/finlays-tips.md).

## Course-wide tips audit — 24 October 2026

Checked all 13 public HTML pages with and without JavaScript and authored content for 14 Moodle pages. Four additional panels were visible in reading fallbacks while their enhanced writing controls were hidden: brief, try/check, portfolio and check-and-continue. Shared styling now shows tips only alongside available editable controls and removes the unused sidebar column. Native essay support requires its actual editable Moodle field. Seven public Tips checks, two isolated native Moodle journeys and all 26 live public page/mode checks passed. No live lesson data or learner answers were changed.

## WB01 integration — 24 October 2026

The isolated WB01 candidate reconciles PRs #11/#17/#18/#30 against the public-launch baseline, retaining private My context, compact feedback, relevant tests/configuration and the canonical HOC plan. This is source integration; broad registration remains closed and draft #14 is not a public-readiness claim. Native verification and current-candidate Claude review gate merge; final evidence is attached to [PR #31](https://github.com/drfinlaymccall/human-ai-orientation/pull/31); [the integration release record](docs/releases/2026-10-24-wb01-integration.md) owns actual evidence. Issue #22 remains open for WB10 whole-learner rehearsal.

Independent WB15 [local-transcription research](docs/research/local-voice-transcription-2026-10-24.md) and WB18 [provider protocol](docs/research/free-assistant-evaluation/evaluation-protocol.md) are prepared. No physical-device checks or consumer-assistant sessions were run; #28/#12 remain open. Course transcription integration is subsequent work.

## Concurrent source integration

The WB01 candidate reconciles the independently advanced journey/starting-point source at d46470b with the deployed context/feedback baseline. The earlier 4af607c checks/reviews remain historical; the reconciled candidate requires fresh integration verification and Claude review against the new base before merge. No live publication, edge rule or check-exposure setting is applied by this reconciliation.

The reconciled source uses local_orientation 2026102402 and draft public context 2026-10-24.2. Both synthetic upgrade paths preserved records; the merged public regression gate and 17 deterministic context-client checks passed. Native starting-point 8, progress/session 16, onboarding 10, context 15 distinct scenarios, feedback 6 and native Tips 2 have passed on the reconciled fixture. New feedback ownership/retry fixes and their focused rechecks remain subject to independent current-candidate review; exact receipts belong on PR31. This does not expose the live starting-point check or open public registration.
