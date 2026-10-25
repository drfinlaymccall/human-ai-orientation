# Human AI Orientation

**Learn to team with AI:** choose a useful task, give context, check the result and keep what helps. A self-guided course for people who are not AI specialists. One course contains units, each with a syllabus of modules and practical activities.

**[Try the course](https://orientation.finlaymccall.com/journey) · [Inspect the LMS case study](docs/case-study.md) · [See the forward plan](docs/plans/2026-10-23-002-feat-public-launch-plan.md) · [Current priorities](CONTROL.md)**

## What the learner does

**Unit 1: Human–AI Orientation** contains the orientation journey, desktop workspace, files and folders, notes as working context, and the practical sequence below. Files and notes belong inside this unit; familiar learners can use readiness guidance instead of repeating practice. The journey describes the unit's syllabus and helps learners choose a starting point.

**Unit 2: Introduction to Agentic Systems** is a planned syllabus, not a delivered set of lessons. It covers agent basics, context and memory, instruction files, skills and plugins. [Course structure](docs/curriculum/course-structure.md) explains the hierarchy and preservation rules. There is no programme layer or separate Moodle course per unit.

1. **Do one useful thing.** Choose a meaningful task, decide what a useful result would look like, and try it.
2. **Give AI useful context.** Select relevant background, test a better brief, and build a reviewed personal context portfolio.
3. **Check, improve and continue.** Retrieve that context, use it on a fresh task, correct the result and choose a next goal.

Files, folders, notes and AI interfaces are modules within the orientation unit. Guided practice can be skipped through the familiar-skills route. The previous author estimate for the core activities and portfolio was 70–95 minutes, excluding this foundational practice; it is not a measured duration for the reorganized unit. Free tools, fictional examples, copy/paste and no-JavaScript reading routes are supported. Practical tasks and reflections record experience rather than certify mastery.

## Current structure and preview — 25 October 2026

The [unit catalogue](https://orientation.finlaymccall.com/catalogue) and [Unit 1 journey](https://orientation.finlaymccall.com/journey) are live. Unit 2 is planned only. [PR #36](https://github.com/drfinlaymccall/human-ai-orientation/pull/36) contains the source, documentation and review receipts. The [release record](docs/releases/2026-10-25-course-unit-reorganization.md) records real native migration checks, preservation evidence and remaining Cloudflare/static-route limits. Existing completion rules and learner records were retained. The PR is not merged.

## Previous integration status — 24 October 2026

This release branch adds a clear Human AI Orientation splash, visible account state and an illustrated **Your course journey** with actual native progress. An optional six-statement check asks separate understanding/can-do ratings and explains practice suggestions without awarding completion. [Course-review evidence](docs/releases/2026-10-23-course-review-implementation.md) and the [repeatable local-agent guide](docs/qa/course-review-agent.md) distinguish passed synthetic checks from owner/human review.

[WB01 / PR #31](https://github.com/drfinlaymccall/human-ai-orientation/pull/31) integrates My context storage/privacy, compact feedback and the newer journey/check in source. WB23 adds the course rationale, six collapsible practice objectives, an in-course welcome and explicitly controlled native enrolment welcome mail. The [WB23/WB10 rehearsal record](docs/qa/2026-10-24-wb23-wb10-rehearsal.md) owns current synthetic evidence. The [production handoff](docs/releases/2026-10-24-production-handoff.md) remains a separate promotion procedure; this work does not deploy the source or enable real welcome mail. New saved-rating wording still needs Finlay's review before enabling the hidden check.

The complete public journey and portfolio builder are available without an account. The additive Moodle plugin shows the signed-in learner’s actual practice progress and Continue action, while native confirmation, self-enrolment and recovery support account access. **Broad self-registration remains closed**; an exact-address pilot gate is active only for owner-controlled email checks. Owner-controlled email confirmation, enrolment, fresh-browser return and genuine password recovery are verified. Representative consenting mail checks, a small human pilot and broader retention review remain launch gates. [Issue #9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9) tracks them. The earlier 16/20 October planning dates are historical, not current commitments.

Moodle progress and personal portfolios are separate. Editing keeps a temporary tab draft; signed-in learners deliberately choose **Save to My context** to store documents and private practice notes in Moodle. **My context** lets them reopen, edit and Copy selected reviewed context across visits/devices; Markdown download and private JSON backup remain optional. Saving does not share anything with an AI. Anonymous/no-JavaScript learners retain the public copy/paste and personal-notes routes.

The repository preserves the product source, Moodle source pin, design/build history and tests. Private runtime configuration and learner data are excluded. Finlay reports paid Contabo whole-server backups and accepts that provision for the demo baseline; provider account settings and whole-server recovery have not been independently verified here. See [operating status](docs/trial/PUBLIC-DEPLOYMENT.md#current-backup-position--23-october-2026).

## What this demonstrates about LMS delivery

Finlay McCall owns the learning purpose, pedagogy, platform and operating choices, learner-experience review and publication decisions. Codex assists with research, authoring, implementation and synthetic verification. The [case study](docs/case-study.md) connects those responsibilities to inspectable evidence:

| Capability | Evidence |
| --- | --- |
| Learning and course design | [Design brief](docs/design-brief.md), [original brief](docs/history/initial-design-brief.md), [research rationale](docs/research/scholarly-design-rationale.md) |
| Moodle course integration | [Native progress plugin](moodle/local/orientation/), [account onboarding](docs/operations/onboarding.md), supported APIs and stable activity/evidence preservation |
| Content production and reuse | [Shared content](content/), [public builders](scripts/build-preparation.py), native Moodle resources and portable portfolio |
| Learning operations | [Email, recovery and reviewed support](docs/operations/email-and-support.md), [deployment guide](docs/trial/PUBLIC-DEPLOYMENT.md) |
| Quality and iteration | [Release evidence](docs/releases/2026-10-13-portfolio.md), [tests](tests/), [decisions](docs/discovery-log.md), [pilot protocol](docs/pilot/PROTOCOL.md) |
| Project management | [Current control](CONTROL.md), [GitHub Issues](https://github.com/drfinlaymccall/human-ai-orientation/issues), focused commits/PRs and [design history](docs/history/README.md) |

Synthetic checks establish specific software behaviour. Human learning outcomes, physical-device and assistive-technology evaluation remain unmeasured. The separate future human–agent curriculum-design programme is outside this course.

## Run and inspect it

For the public course, install Node and Python 3, then run `npm ci`, `npm run build` and `npm run preview`. Open `http://127.0.0.1:8090/journey`. No Moodle account or AI API key is required for public reading and portfolio export/restore.

[Reproduction and checks](docs/REPRODUCING.md) explain the pinned Moodle submodule and separate native installation. `npm run check:public` rebuilds committed outputs and runs support, atlas entry, public metadata, portfolio and isolated recorder checks. The [Actions template](docs/operations/course-checks.workflow.yml) is prepared; GitHub automation remains inactive because publishing access lacks workflow permission ([setup follow-up #10](https://github.com/drfinlaymccall/human-ai-orientation/issues/10)). Local results and this limit belong in the [baseline release record](docs/releases/2026-10-23-baseline.md).

## Explore the materials

- [Course journey](https://orientation.finlaymccall.com/journey), [portfolio builder](https://orientation.finlaymccall.com/portfolio), [preparation](https://orientation.finlaymccall.com/before-you-start) and [notes guide](https://orientation.finlaymccall.com/notes).
- [Public context for your AI](https://orientation.finlaymccall.com/ai/): inspectable instructions, versioned Markdown, a JSON manifest/schema and a paste fallback.
- [Optional deeper courses](https://orientation.finlaymccall.com/deeper-courses), [free tools](https://orientation.finlaymccall.com/free-tools) and their [rights ledger](docs/research/deeper-courses.md).
- [Pilot/public-release handoff](docs/launch/readiness.md) and [five LinkedIn drafts](docs/launch/linkedin-series.md); Finlay chooses the launch date and publishes.
- [Contributing and documentation upkeep](CONTRIBUTING.md), [design history](docs/history/README.md) and [release-baseline plan](docs/plans/2026-10-23-001-feat-release-baseline-plan.md).

Original educational materials are © 2026 Finlay McCall, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). [Licence scope](LICENSE-CONTENT.md) excludes software, third-party material and private learner records. Moodle retains its own GPL licence. Keep credentials, support messages and personal portfolios out of public GitHub.

## Private course feedback

The [voice and written feedback plugin](docs/operations/voice-feedback.md) keeps recordings private, supports text/file alternatives and uses Moodle notifications. The demo has this enabled; other installations remain disabled until a course and reviewer are explicitly configured.
