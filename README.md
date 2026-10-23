# Human AI Orientation

A short, self-guided course helping people who are not AI specialists do something useful with their own AI, judge its work, and keep context they can reuse.

**[Try the course](https://orientation.finlaymccall.com/journey) · [Inspect the LMS case study](docs/case-study.md) · [See current priorities](CONTROL.md)**

## What the learner does

1. **Do one useful thing.** Choose a meaningful task, decide what a useful result would look like, and try it.
2. **Give AI useful context.** Select relevant background, test a better brief, and build a reviewed personal context portfolio.
3. **Check, improve and continue.** Retrieve that context, use it on a fresh task, correct the result and choose a next goal.

Optional preparation covers files, folders, notes and AI interfaces. The core journey and portfolio extension take an estimated 70–95 minutes, plus optional 20–30-minute preparation. These are author estimates, not measured learner timings. Free tools, fictional examples, copy/paste and no-JavaScript reading routes are supported. Practical tasks and reflections record experience rather than certify mastery.

## Current status — 23 October 2026

The complete public journey and portfolio builder are available without an account. Moodle reviewer accounts save activity progress and submitted reflections. Finlay confirms the site is still a demo/review environment with no public learner enrolments; **self-registration is closed**. [The next batch](https://github.com/drfinlaymccall/human-ai-orientation/issues/9) is the landing page, email-confirmed enrolment and clearer progress/return navigation, followed by a small human pilot and launch writing. The earlier 16/20 October planning dates are historical, not current commitments.

Moodle progress and personal portfolios are separate. Portfolio drafts are temporary browser-session data; learners retain Markdown documents and a versioned JSON backup themselves. The builder does not upload the portfolio to Moodle or an AI service.

The repository preserves the product source, Moodle source pin, design/build history and tests. Private runtime configuration and learner data are excluded. Finlay reports paid Contabo whole-server backups and accepts that provision for the demo baseline; provider account settings and whole-server recovery have not been independently verified here. See [operating status](docs/trial/PUBLIC-DEPLOYMENT.md#current-backup-position--23-october-2026).

## What this demonstrates about LMS delivery

Finlay McCall owns the learning purpose, pedagogy, platform and operating choices, learner-experience review and publication decisions. Codex assists with research, authoring, implementation and synthetic verification. The [case study](docs/case-study.md) connects those responsibilities to inspectable evidence:

| Capability | Evidence |
| --- | --- |
| Learning and course design | [Design brief](docs/design-brief.md), [original brief](docs/history/initial-design-brief.md), [research rationale](docs/research/scholarly-design-rationale.md) |
| Moodle course integration | [Course synchronisation](scripts/sync-journey.php), supported APIs, stable activity IDs and preserved answer/completion records |
| Content production and reuse | [Shared content](content/), [public builders](scripts/build-preparation.py), native Moodle resources and portable portfolio |
| Learning operations | [Email, recovery and reviewed support](docs/operations/email-and-support.md), [deployment guide](docs/trial/PUBLIC-DEPLOYMENT.md) |
| Quality and iteration | [Release evidence](docs/releases/2026-10-13-portfolio.md), [tests](tests/), [decisions](docs/discovery-log.md), [pilot protocol](docs/pilot/PROTOCOL.md) |
| Project management | [Current control](CONTROL.md), [GitHub Issues](https://github.com/drfinlaymccall/human-ai-orientation/issues), focused commits/PRs and [design history](docs/history/README.md) |

Synthetic checks establish specific software behaviour. Human learning outcomes, physical-device and assistive-technology evaluation remain unmeasured. The separate future human–agent curriculum-design programme is outside this course.

## Run and inspect it

For the public course, install Node and Python 3, then run `npm ci`, `npm run build` and `npm run preview`. Open `http://127.0.0.1:8090/journey`. No Moodle account or AI API key is required for public reading and portfolio export/restore.

[Reproduction and checks](docs/REPRODUCING.md) explain the pinned Moodle submodule and separate native installation. `npm run check:public` rebuilds committed outputs and runs the support, portfolio and isolated recorder tests. The [Actions template](docs/operations/course-checks.workflow.yml) is prepared; GitHub automation remains inactive because publishing access lacks workflow permission ([setup follow-up #10](https://github.com/drfinlaymccall/human-ai-orientation/issues/10)). Local results and this limit belong in the [baseline release record](docs/releases/2026-10-23-baseline.md).

## Optional private feedback

Stage-one [voice and written feedback](docs/operations/voice-feedback.md) is packaged as a standalone Moodle local plugin, disabled until a course and reviewer are configured. It keeps recordings private, supports text/file alternatives, and uses Moodle notifications without an AI service. See the [feature plan](docs/plans/2026-10-23-002-feat-voice-feedback-plan.md) and [synthetic release evidence](docs/releases/2026-10-23-voice-feedback.md). Production installation and activation are separate from this source release.

## Explore the materials

- [Course journey](https://orientation.finlaymccall.com/journey), [portfolio builder](https://orientation.finlaymccall.com/portfolio), [preparation](https://orientation.finlaymccall.com/before-you-start) and [notes guide](https://orientation.finlaymccall.com/notes).
- [Public context for your AI](https://orientation.finlaymccall.com/ai/): inspectable instructions, versioned Markdown, a JSON manifest/schema and a paste fallback.
- [Optional deeper courses](https://orientation.finlaymccall.com/deeper-courses), [free tools](https://orientation.finlaymccall.com/free-tools) and their [rights ledger](docs/research/deeper-courses.md).
- [Contributing and documentation upkeep](CONTRIBUTING.md), [design history](docs/history/README.md) and [release-baseline plan](docs/plans/2026-10-23-001-feat-release-baseline-plan.md).

Original educational materials are © 2026 Finlay McCall, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). [Licence scope](LICENSE-CONTENT.md) excludes software, third-party material and private learner records. Moodle retains its own GPL licence. Keep credentials, support messages and personal portfolios out of public GitHub.
