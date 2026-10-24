# Local-agent learner journey review

Use this guide to navigate Human AI Orientation as a synthetic learner and check the [course-review feedback](../reviews/course-review.md). The [forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md) owns intended behaviour and recommendation rules. This guide supplies repeatable QA, not another implementation plan.

## Inputs and environment

- Repository: [drfinlaymccall/human-ai-orientation](https://github.com/drfinlaymccall/human-ai-orientation). The integrated candidate includes My context, feedback, the native illustrated journey and optional starting-point check. WB23 adds a shared course rationale and native/in-course welcome. Source integration does not establish deployment. Record the actual source commit, working-tree changes and observed deployed release; the [implementation receipt](../releases/2026-10-23-course-review-implementation.md) records integration evidence.
- Public URL: `https://orientation.finlaymccall.com/`. This defaults to public reading/navigation only. An unimplemented proposed feature is Not yet implemented, not a claimed regression fix.
- Native synthetic environment: use the isolated fixture documented in [onboarding operations](../operations/onboarding.md), [progress operations](../operations/progress.md), [starting-point operations](../operations/starting-point.md) and [reproduction](../REPRODUCING.md). This WB23/WB10 rehearsal reserves its isolated clone's own **18802** / `trial/launch-fixture` / `orientation_launch_fixture` for the main learner journey, and **18842** / `trial/context-fixture` / `orientation_context_fixture` for context/feedback regressions. Both use private synthetic data and captured mail. **18812 belongs to another checkout in this session: do not reuse or reconfigure it.** Do not assume a runtime/database exists or a port is free; verify ownership before setup. Never redirect tests to the public site.
- An operator provisions fresh labelled synthetic accounts and confirms captured-mail transport. Historical QA accounts may be suspended. Do not use Finlay's administrator/reviewer account, known owner mailbox account or old stored credentials.
- Read repository `AGENTS.md` and `CONTRIBUTING.md`. Fixture setup/account provisioning is a separate operator preflight; the learner walkthrough must not use admin/database knowledge to navigate around a problem.

If the fixture is unavailable, complete public checks and report native scenarios Not tested. Do not substitute live signup, real mail or private account access. Genuine mailbox checks require a separately authorised recipient/action; none is needed for this captured-mail rehearsal. Never broaden registration, change mail routing, invite participants, send support replies or publish posts as part of QA.

**Source boundary:** the integrated candidate includes account-backed My context storage, privacy handlers and compact feedback. Preserve those features and schema during publication. Use explicit Save to My context for account storage; editing alone is a temporary tab draft. Copy is the main reuse action; Download Markdown is optional. Public reading and no-JavaScript routes remain available.

## Operator preflight and repeatable checks

Before the learner walkthrough, the operator verifies the preview fixture's synthetic marker, exact URL/database/data directory and captured-mail transport, publishes the repository plugin/content, and enables the optional check **only in that fixture**. The first onboarding test creates labelled synthetic readiness records; they are not owner review or genuine delivery receipts. The native checkbox remains part of real signup. No policy bypass is needed. The suite closes registration afterward and preserves existing enrolments.

From the prepared preview checkout, the focused commands are:

```sh
npm run test:entry
npm run test:metadata
ORIENTATION_FIXTURE_URL=http://127.0.0.1:18802 npm run test:onboarding
ORIENTATION_FIXTURE_URL=http://127.0.0.1:18802 npm run test:progress
ORIENTATION_FIXTURE_URL=http://127.0.0.1:18802 npm run test:starting-point
ORIENTATION_FIXTURE_URL=http://127.0.0.1:18802 npm run test:welcome
ORIENTATION_FIXTURE_URL=http://127.0.0.1:18802 npm run test:wb10
```

Run the native suites serially against the same fixture; they deliberately change synthetic acquisition, visibility, versions and completion. The fixture must already be served by its operator. `npm run check:public` checks generation drift and public suites after intended generated changes have been committed. **Do not use bare `npm test` for this rehearsal**: the legacy broad public configuration targets the deployed site and loads an old private QA account. Updating an old expectation does not authorise executing that suite.

Run context/feedback regressions in a separate serial lane on the owned **18842** fixture. First follow [My context fixture preparation](../operations/context-workspace.md#deployment-and-verification), including `prepare-launch-fixture.py --context-workspace`, initial publication and plugin upgrade. Preparation refuses an existing directory; retain an existing owned fixture rather than reseeding or overwriting it. Once prepared, run:

```sh
npm run test:context
```

The [context configuration](../../playwright.context.config.cjs) starts and stops its own 18842 server and refuses to reuse an existing listener. Leave the port free for this command; do not run a manually started feedback server alongside it.

For native feedback, follow [feedback verification](../operations/voice-feedback.md#verification). Its [browser configuration](../../playwright.feedback-moodle.config.cjs) does **not** start a server. The operator must first verify the owned 18842 fixture's explicit synthetic-feedback marker, installed feedback plugin and capture transport. Provision fresh synthetic browser records with:

```sh
ORIENTATION_TRIAL_DIR="$PWD/trial/context-fixture" scripts/fixture-php tests/feedback-integration.php --config="$PWD/trial/context-fixture/moodle/config.php"
```

This writes the private `trial/feedback-fixtures.json` manifest. Check privately that it identifies the owned 18842 fixture; never print its credentials. Supply `FEEDBACK_REVIEWER_PASSWORD` privately for that fixture's reviewer account as required. After the context suite has released the port, serve this fixture in a separate terminal:

```sh
ORIENTATION_TRIAL_DIR="$PWD/trial/context-fixture" PHP_CLI_SERVER_WORKERS=4 scripts/fixture-php -S 127.0.0.1:18842 -t trial/context-fixture/moodle scripts/serve-launch-fixture.php
```

Then run `npm run test:feedback:moodle` from the same checkout with the private reviewer environment available. Reprovision synthetic feedback records before repeated runs exceed per-user limits; keep manifests, mail and authenticated results private. Stop only the server this operator started. `npm run test:feedback` is the separate public recorder/widget suite, not a substitute for native Moodle verification. All provisioning and mutations above are synthetic-only; they authorise no live writes or real messages.

Public atlas keyboard checks use ordinary Tab/Shift+Tab, Enter and Space. On desktop, Tab reaches all five choices, the optional newcomer suggestion, then the selected details. On mobile, the selected action follows its choice before the next choice. Do not use scripted focus on each control as proof that normal traversal works.

## Expected route and visible behaviour

1. Home introduces Human AI Orientation, “Learn to team with AI”, six practice objectives and its practical takeaway. An anonymous visitor sees Explore your course; a resolved signed-in visitor sees Your course journey and clear account state. If status cannot be resolved, the account link is honest and public reading still works.
2. `/journey` is the public illustrated atlas. Find my starting point explains the optional account-backed check and current limited registration, while choosing/publicly reading an activity stays possible.
3. `/local/orientation/index.php` is the canonical private Your course journey. Ordinary login lands here; an explicit activity/check link retains its intended destination through login/confirmation/enrolment.
4. The private journey offers a collapsible Welcome / Start here with purpose, objectives and links to My context, Help and the public AI guide. Returning learners retain Continue without completing a tour. The private atlas retains all five activity names and artwork, native completion, Continue and optional help. Desktop details are beside the map; mobile details/action are near the selected choice. Dashboard/My courses are unnecessary for ordinary navigation; account, Help and sign-out remain reachable.
5. Starting point is six statements × understanding/can-do ratings, twelve responses. No numeric defaults, grades or right/wrong claims. Not sure/Skip/unanswered remain unknown. Skip the whole check returns to the journey without finishing fabricated answers. An unfinished attempt can resume; an earlier finished suggestion remains dated and explained.
6. A finished check yields the plan's explainable suggestion, separate from Continue and completion. All activities remain selectable; completed low-rated work is offered as Revisit. Hidden/unavailable destinations must not produce dead links.
7. Native Page completion is learner-marked; Lesson uses its native resume/completion rules. Merely visiting or rating highly never completes practice. Account progress and context saving are separate: explicit Save to My context keeps signed-in documents; editing alone keeps a temporary draft. Downloaded files remain independent copies.

## Walkthrough matrix

| Case | Action | Acceptance evidence |
| --- | --- | --- |
| Public newcomer | Start at home in a clean context; say what the course offers and choose the visible next action | Clear offer/account action; journey is discoverable without guessing URLs; limited registration is honest |
| Five choices | Select each atlas place | Correct title/details/destination; action visible beside/near selection, no forced trip past the entire map |
| Mobile/keyboard | Repeat at 390px and 320px, then keyboard only | No horizontal overflow; readable labels/ratings, visible focus, logical order and usable controls; record observed issues |
| No JavaScript/status failure | Disable JavaScript; separately simulate blocked/timed-out account-state response in fixture | Readable public choices/links; neutral account fallback, no invented signed-out claim; private native journey remains usable |
| Fresh account | Follow visible journey/check or activity CTA → signup → captured confirmation in a fresh context → enrol | Intended destination reached without an extra test-inserted navigation; unconfirmed/duplicate/repeated/expired links have useful next steps |
| Welcome | Confirm no course welcome before confirmation/enrolment; inspect captured native subject, plain/HTML links; revisit, reconfigure and request recovery | One enrolment welcome; useful signed-out return links; equivalent in-course guidance for manual learners; configuration itself sends nothing |
| Saved work and reuse | Write reviewed fictional context, explicitly save, reopen My context, edit and Copy; optionally download Markdown; return in a new browser; test a second user | Saved text belongs only to its author; clipboard omits private practice notes; saved work and completion remain distinct; no automatic AI access |
| Ordinary versus deep login | Sign in from general account action; separately follow a specific Lesson/check link | General entry opens journey; explicit intended activity/check survives; no Dashboard detour |
| Short check | Answer both dimensions, use Not sure/Skip, finish partial answers; also skip whole check | Exactly six pairs, explicit anchors, no score/feedback colours, unknown retained; skip has no learning penalty |
| Suggestions | Use all low, all high, mixed, unknown and partial profiles from the plan's rule table | Exact expected activity and relevant explanation; disagreement between dimensions preserved; no completion award |
| Interrupted/retaken check | Leave mid-attempt, return/resume; finish a fresh retake; inspect older/incompatible instrument case | Previous finished suggestion dated while unfinished; history retained; no reinterpretation of an old scale |
| Progress and return | Mark a native Page complete; exercise Lesson resume; leave and sign in in a fresh context | Current-user state persists, Continue updates and portfolio storage explanation is accurate |
| Completed/unavailable work | Low-rate completed practice; test all-complete and hidden activity fixture cases | Revisit retains Complete; all-complete remains honest; unavailable baseline/target explained without dead links or changed requirements |
| Learner navigation/staff | Inspect journey, enrolment, quiz attempt/review, Lesson, Page and account routes; separate staff context | Consistent learner journey/Help/account controls; administrative access preserved |
| Two users/sign-out/expiry | A/B with different answers/progress; sign out, browser back and reload; open a journey initially hidden, switch accounts elsewhere, then activate it; operator ages only the guarded synthetic session for the expiry case | Hidden content stays concealed until revalidated for the current account; expired public state says signed out without refreshing the session; no cross-user ratings/progress or private state in static/AI output |
| Captured recovery | Request fixture reset signed out, open captured mail in new context, reset then reopen journey; test invalid/consumed/expired link | Account works and destination is usable; tokens remain private; no real message sent |

Record initial confusion before consulting technical implementation. If you guessed a URL, used a bookmark/admin shortcut or received assistance, record it; do not count that as an unassisted pass. Test learner rendering with real fixture learner roles rather than administrator preview.

## Reporting and local-agent prompt

Use [the report template](course-review-report-template.md). Keep raw artifacts under ignored `trial/course-review/<run-id>/`; authenticated recordings/traces can contain cookies, tokens and private fields. Publish only reviewed fictional screenshots and a sanitised outcome summary. Link each CR item to implementation and actual retest evidence before changing its state to Fixed. Human pilot comprehension and physical devices remain separate checks.

Copy this prompt to the local browser agent, supplying the target release and permitted environment:

> Review Human AI Orientation as a synthetic learner. Read AGENTS.md, CONTRIBUTING.md and docs/qa/course-review-agent.md in the repository. Target public URL: https://orientation.finlaymccall.com/. First establish the checked-out commit and observed deployed release; do not assume the proposed review features are shipped.
>
> Follow learner-visible instructions without using implementation details to guess navigation or repair the site. Record unclear next actions, what you clicked and unexpected destinations. On the deployed site perform public reading/navigation only. Run registration, captured confirmation/recovery, ratings and completion scenarios only in the isolated synthetic fixture after its operator preflight; if unavailable report those as Not tested. Keep account access private and never use Finlay's administrator or owner mailbox account.
>
> Exercise the guide's desktop, mobile, keyboard, no-JavaScript, fresh-context and two-user cases. Check six paired ratings, exact recommendation examples, interrupted retake, actual saved progress and sign-out isolation. Do not send real mail, change configuration or silently fix failures. Produce the guide's report separating observed functional failures, agent usability concerns, passed and not-tested cases. Keep credentials, session links and raw authenticated artifacts out of chat/GitHub. Identify the concrete fix/retest needed; do not claim human learning outcomes.
