# Student onboarding and the course rationale

Created: 2026-10-24. Status: WB23 is implemented in source and synthetically verified before the complete WB10 rehearsal; production publication, welcome enablement and genuine mailbox receipt remain separate. See the [dated release](../releases/2026-10-24-student-welcome-rehearsal.md) and [synthetic QA record](../qa/2026-10-24-wb23-wb10-rehearsal.md). Implementation stays in the [canonical forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md), WB23, under existing issues #4/#9.

## Why this course exists

The [design brief](../design-brief.md#purpose-and-success) owns the rationale. Use this learner-facing expression consistently:

> Learn to team with AI. Practise choosing worthwhile tasks, giving useful context, communicating what you need, checking results and keeping what helps. Explore everyday ways of working with AI—conversation, voice, files and reusable notes—so you can choose an approach that suits your task. Leave with a reviewed context portfolio and a meaningful next goal. This is a self-contained starting point for a broader human–AI education programme, and useful on its own.

Short form: **Learn to team with AI: choose a useful task, give context, check the result and keep what helps.**

This describes an intended learning experience, not certification, established learning gains or access to a future programme that is not yet available. Distinguish what the human needs to learn from what their AI needs to be told, shown or allowed to access.

## Overall learning objectives

Use six plain-language outcomes aligned to the existing author framework. These do not create six new modules or change the accepted six-pair starting-point instrument.

| By the end, you will have practised how to… | Author area | Existing practice |
| --- | --- | --- |
| Choose a worthwhile task and decide what a useful result would look like. | TASK | Useful task; revisit when checking results |
| Explain your intention, notice a misunderstanding and clarify it. | TALK | Brief, try and revise; check and continue |
| Choose relevant context, leave out unnecessary private details and check what the AI actually received. | CONTEXT | Context brief, preparation and portfolio |
| Check a result against your purpose and decide what to keep, correct or reject. | CHECK | First attempt, context practice and fresh-task check |
| Save, find and selectively reuse reviewed context in another conversation. | KEEP | Portfolio, My context and fresh-task reuse |
| Identify your own next learning need and choose a manageable next step. | LEARN | Optional starting-point reflection and check-and-continue |

These are practice goals, not a new pass/fail assessment. Use the existing competency bank for detailed author alignment. Files/notes preparation remains optional.

## The learner's first visit

| Stage | What the student needs | Delivered experience |
| --- | --- | --- |
| Arrive | Why this matters; whether it is for me; what next | **Human AI Orientation** heading, **Learn to team with AI** tagline, short rationale, objectives, current time estimate and primary **Explore your course** action. Show account state and the public reading option honestly. |
| Join when registration is available | Clear account, confirmation and enrolment steps | Preserve native Moodle registration/confirmation/enrolment and a deliberately chosen activity destination. While broad registration is closed, retain existing pilot-access wording. |
| Enter | Where everything is; a manageable first action | **Your course journey** is the normal hub. A short, collapsible **Welcome / Start here** section explains activities, progress, My context, Help and the public AI guide. No compulsory tour or extra completion requirement. |
| Choose a starting point | Permission to begin at the appropriate place | The optional check—six statements, two ratings each—is integrated in source, with **Skip and explore** equally usable. Its production exposure still requires Finlay's saved-rating wording review; activity choices remain available when it is disabled. |
| Practise | How this activity helps me work with AI | Show **Why this helps**, **What you'll practise**, **What you'll keep**, then the activity. Explain the relevant interaction pattern where it is used. |
| Leave and return | What was saved; where to resume | Keep **Continue**, **My context** and **Help** discoverable. Distinguish activity progress, submitted reflections and explicitly saved context; anonymous drafts are temporary. |
| Finish | A useful takeaway and a next step | Reopen and reuse selected context, review the result and choose a next goal. The broader programme is a future pathway; independent continued practice is a complete outcome. |

The welcome material is available inside the course as well as by email. Students can start, return and recover access without finding a welcome message. Existing deep links take precedence over a default welcome destination.

## Welcome email source and delivery contract

**Trigger:** successful self-enrolment of a confirmed student in this course, when the native welcome mode is deliberately enabled. The implementation uses the supported Moodle self-enrolment welcome facility. Invited/manual learners receive equivalent in-course guidance. An unconfirmed account does not receive a course welcome merely because it was created. Confirmation and recovery messages retain their separate purposes. There is no retrospective bulk send to existing students.

**Native subject:** Welcome to [course full name]. Moodle supplies its standard subject; the supported customisation is the message body.

The canonical body, rationale, objectives and four link labels/paths live in [`content/student-welcome.json`](../../content/student-welcome.json); edit that source rather than maintaining a second email draft here. The public builder distributes identical JSON bytes to the plugin. The [native renderer](../../moodle/local/orientation/classes/welcome.php) escapes the paragraphs and appends full URLs for Your course journey, My context, Help and the public AI guide using the configured installation origin. Moodle supplies the plain-text alternative. Supported `nolink` wrappers prevent activity-name filters from inserting competing links into the prose.

The implemented journey gateway preserves deliberate activity destinations. Captured-mail checks verified the four HTML/plain-text links, including signed-out mobile return. Before production enablement, verify the deployed destinations and current duration with a consenting recipient. The body distinguishes explicit account saves from temporary tab drafts, keeps sharing with an AI deliberate and adds no passwords, private work, response-time promise or marketing subscription.

The current configuration refreshes welcome text but preserves an existing method's send mode; newly created methods default sending off. Deliberately configure and test delivery rather than assume text changes send mail. Re-running configuration, sign-in, password reset or revisiting the course must not send another welcome. Preserve unrelated enrolment settings/access. Native removal and re-enrolment sends another welcome. Direct repeated calls to the native enrol API may also resend; no cross-lifecycle exactly-once guarantee is made.

## Carry the rationale through the course

| Surface | Placement and purpose |
| --- | --- |
| Public landing and native course overview | Short rationale near the first heading/action; six objectives in a readable summary. Portfolio is the practical takeaway, not the whole course purpose. |
| Welcome email and in-course Start here | Brief purpose, where to find the journey/work/help, and one clear next action. |
| Journey and optional starting-point check | Connect activities and suggestions to working with AI; keep the full course accessible. |
| Each activity | One task-specific reason and relevant outcome, rather than repeating the whole rationale. |
| Reflection and exit | What can I now try, what evidence do I have, what needs practice and what context does my AI need next? |
| Public AI guide | Matching purpose, objectives and honest feature availability; no private progress or ratings. |
| README, case study and launch posts | Same purpose, with claims limited to delivered practice/evidence. |

Concrete patterns: instruct → inspect → clarify; bring context → check what arrived; speak → read back → correct; save → reopen → selectively reuse; human review → decide the next action. Treat UI modes, file access and memory as tool-dependent. Saving in Moodle does not automatically give an AI access or lasting memory. Avoid a separate jargon-heavy UI/UX module.

## Delivery and acceptance

1. Refine the proposed copy with Finlay; keep the rationale in the design brief. Align with the existing objective/competency work without changing historical evidence.
2. WB23 implemented entry/course-overview copy, in-course welcome and shared email content after WB01's source reconciliation and WB04's journey-route contract, coordinated with WB05 public entry and WB09 AI guidance.
3. Captured-mail fixture checks cover supported enrolment paths, no welcome before confirmation/enrolment, no duplicate on visits/configuration/recovery, closed registration and unchanged existing access, plus HTML/plain-text links after sign-out and at mobile width. They use the existing Moodle facility; no generic notification service was added.
4. Source, welcome, entry, progress and metadata tests accompany the implementation. The local-agent scenario in `docs/qa/course-review-agent.md` uses learner-visible information to find purpose, objectives, next action, saved work and Help, and tries check and skip. Separate observed navigation failures from usability opinions.
5. WB10's complete synthetic rehearsal includes this experience. An owner-controlled/consenting mailbox is still required for an actual welcome-receipt check before broad launch. Captures, tokens and recipient details stay private. This source implementation sends no invitations, marketing or retrospective mail.
6. In WB12's human pilot, ask students to explain the purpose and find their next action without coaching. Human observations are needed to establish whether the onboarding is understandable.

**Done:** entry, welcome, journey, activities, exit and public AI guidance express one rationale; a new enrolled student can find where to begin, where saved work lives and how to get help; welcome delivery/return links are verified; optional routes and old learner evidence remain intact. Broad registration retains existing readiness gates.

**Documentation/status impact:** CONTROL.md, design brief, learner welcome/course copy, onboarding/email/progress operations, local-agent QA, AI context and the dated release record accompany the implementation under #4/#9 and the existing plan. The [synthetic QA record](../qa/2026-10-24-wb23-wb10-rehearsal.md) records source, browser and captured-mail verification, including the complete WB10 journey. Exact final candidate results belong in the external PR receipts. This evidence establishes neither production publication/enablement nor genuine mailbox delivery or human comprehension.

## WB23 implementation boundary — 24 October 2026

Canonical public copy is `content/student-welcome.json`; the public builder distributes the same bytes into the plugin. Native enrolment owns delivery and the fixed subject, preferences and plain-text conversion. `welcome-enable` and `welcome-disable` target only this course’s existing self-enrolment method, preserve restrictions and do not enrol learners or send retrospective messages. Ordinary onboarding configuration retains the existing send mode. Manual/invited learners receive equivalent in-course guidance without enabling global manual-enrolment mail. See [operations](../operations/onboarding.md).

The native email renderer wraps prose in Moodle’s supported `nolink` class to prevent the activity-name filter inserting competing legacy course-page links. Its four explicit links remain readable in HTML/plain text. Five synthetic native mail scenarios and twenty source assertions passed for the first implementation unit. Full integrated WB10 evidence is recorded separately in the [current rehearsal](../qa/2026-10-24-wb23-wb10-rehearsal.md); this paragraph does not substitute for that result.
