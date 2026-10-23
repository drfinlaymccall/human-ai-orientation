# Delivering Human AI Orientation with Moodle

Finlay McCall designed and built a self-guided orientation for people who want to work usefully with AI without specialising in it. The intended outcome is a reviewed, retrievable personal context portfolio and a meaningful next goal. The course is a working public demo with native saved progress and an owner-controlled email pilot gate; broad registration and human-pilot evidence remain next steps.

[Try the public journey](https://orientation.finlaymccall.com/journey) or follow the implementation evidence below.

## From learner need to a working course

The brief begins with a personally relevant task rather than a catalogue of AI features. Three activities connect an initial attempt, better context and a checked fresh-task result. The portfolio bridge lets learners keep working preferences, project context and useful knowledge/source notes. Optional files/notes preparation and fictional examples support different starting points without requiring a paid AI tool or a particular notes app.

The assessment model is experiential: choose a useful criterion, try the task, inspect the result and reflect on what changed. Moodle's completion records show practice; they are not claims of mastery. Estimated timings and usefulness need testing with real learners.

Evidence: [current design brief](design-brief.md), [initial brief](history/initial-design-brief.md), [scholarly rationale](research/scholarly-design-rationale.md), [design dialogue](history/design-dialogue.md).

## LMS decisions and implementation evidence

| Delivery decision | How it works | Inspect |
| --- | --- | --- |
| Use Moodle for native accounts, lesson interaction and progress | Retain the seven-page Lesson and native Page resources; an additive current-user overview suggests unfinished core practice and supports native Lesson resume | [Progress plugin](../moodle/local/orientation/), [progress guide](operations/progress.md), [lesson design](trial/lesson-design.md) |
| Check new-account acquisition without prematurely opening enrolment | Native email confirmation/recovery, canonical activity return and exact-address pilot registration; broader opening requires actual mail and operating evidence | [Onboarding configuration](../scripts/configure-onboarding.php), [guide](operations/onboarding.md), [isolated checks](../tests/onboarding.spec.cjs) |
| Preserve existing evidence during iteration | Update existing activities through supported APIs, retain module IDs, and compare fingerprints for answers, attempts and completion definitions | [Journey sync](../scripts/sync-journey.php), [preparation sync](../scripts/sync-preparation.php), [October verification](releases/2026-10-13-portfolio.md) |
| Author once for public reading and native Moodle resources | Shared fragments and builders produce matching public and LMS content | [Content](../content/), [preparation builder](../scripts/build-preparation.py), [journey builder](../scripts/build-journey.py) |
| Keep learner context portable | Browser-local editing, selected context copying, Markdown export and validated versioned JSON restore | [Portfolio implementation](../public/assets/portfolio.js), [portfolio design](curriculum/portfolio-builder.md), [browser tests](../tests/portfolio.spec.cjs) |
| Support account recovery and reviewed help | Native password recovery, owner-confirmed SMTP delivery and an operator-assisted draft/review/approve/send queue | [Email/support guide](operations/email-and-support.md), [support implementation](../scripts/support.py), [approval tests](../tests/test_support.py) |
| Operate the platform without modifying Moodle core | Pinned upstream source, PostgreSQL, PHP-FPM, Caddy HTTPS routing and scheduled Moodle cron | [Reproduction](REPRODUCING.md), [deployment](trial/PUBLIC-DEPLOYMENT.md), [service definitions](../deploy/) |
| Help learners use their own AI | Public readable/versioned context with a project-specific manifest/schema and paste fallback | [AI-context design](curriculum/public-ai-context.md), [published pack](https://orientation.finlaymccall.com/ai/) |

The public portfolio does not post its contents to Moodle. A Moodle account retains course progress and submitted reflections separately. This keeps the reusable context with the learner while allowing a native LMS return journey.

## Quality, feedback and operations

The [13 October release](releases/2026-10-13-portfolio.md) records eight isolated portfolio checks, six support approval-boundary checks, twelve public HTTPS browser checks and targeted native checks. These are dated synthetic results, not a claim that each check was rerun today. The [23 October baseline](releases/2026-10-23-baseline.md) records its own fresh checks.

Finlay's walkthrough feedback led to preparation, contextual tips, interactive briefs, continuity and portfolio retrieval. Later feedback on objectives, a glossary and Day of AI resources is preserved as proposed work with rights notes; those proposals are not described as shipped features. The [control document](../CONTROL.md) and [decision log](discovery-log.md) retain the distinction.

For the current demo, Finlay accepts his paid Contabo server backup provision. GitHub preserves public product sources and design records; private databases and configuration are excluded. Provider account settings and complete server recovery are not claimed as independently tested. Backup audit/restore experiments are outside this baseline at the owner's request.

## Ownership and next evidence

Finlay sets audience, learning goals, pedagogy, priorities, platform/publication choices and content licence; reviews the experience; supplies corrections; and confirmed real email receipt. Codex supports research, drafting, implementation and labelled synthetic testing. The [design history](history/README.md) identifies this collaboration and preserves the initial recorded state without invented earlier commits.

The homepage now includes the accepted activity atlas, and native registration/return/progress are implemented. The [23 October implementation record](releases/2026-10-23-launch-implementation.md) distinguishes synthetic checks, live deployment and pending genuine-mail evidence. A small consenting human pilot will test whether learners can complete a meaningful task, retrieve their context and use it again. The [release handoff](launch/readiness.md) and [five draft posts](launch/linkedin-series.md) prepare publication without claiming a completed launch. Accessibility checks on physical devices and assistive technology, learner timings and learning outcomes remain open. [GitHub Issues](https://github.com/drfinlaymccall/human-ai-orientation/issues) track that work.

For ongoing delivery, documentation/status changes are part of every implementation plan and PR. Current priorities live in CONTROL.md; design rationale lives in the brief; verification lives in dated release records. This keeps the showcase connected to the actual product as it evolves.
