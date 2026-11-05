# Launch readiness: Phases 0 and 1

Date: 6 November 2026 (Australia/Sydney). Plan: [launch plan](../plans/2026-10-23-002-feat-public-launch-plan.md#launch-plan--6-november-decisions). Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Need

Finlay asked for an audit against the competency and evaluation frameworks and a plan to make the course public. The audit found these problems:

- `main` was far behind the live site, and the live site ran from uncommitted files.
- Five competencies had no practice: TALK-02, CHECK-03, TASK-03, LEARN-01 and CONTEXT-02.
- Activities had more than one name.
- Agent material sat in a beginner module.
- The privacy page was not a policy, and sign-up gave no collection notice.
- Some pages had access defects, author dates or a broken support address.

These are audit findings. They are not learner observations.

## Decisions

Finlay decided the following on 6 November:

- Approve a two-stage launch. Stage A opens the anonymous course to search and promotion with registration closed. Stage B opens registration after email, recovery, support and operating checks are recorded.
- Move agent material to Unit 2. Finlay reviews that page.
- Do not require a restore test.
- Draft a privacy policy that follows Australian law, and add it to the sign-up flow.

## Change

**Phase 0.** PR #36 merged the course stack to `main`, including PRs #11, #14 and #35. The live checkout now tracks `main`. Evaluation records are in the repository. The private Mac setup note stays out of Git.

**Practice gaps.** All new practice sits in existing activities. Saved fields keep their IDs, and completion rules do not change.

| Competency | New practice |
| --- | --- |
| TASK-03 | `/first-task`: decide what you will check or do yourself |
| LEARN-01 | `/first-task`: name the help you needed |
| TALK-02 | `/preview`: work out and repair a misunderstanding in the try/check step |
| CONTEXT-02 | `/portfolio`: note where changeable facts came from and when you last checked them |
| CHECK-03 | `/check-and-continue`: decide to use, revise, reject or seek help, and say why |

**Names.** Each activity has one name: Try AI on a useful task, Give AI useful context, Save and reuse context, and Check, improve and continue.

**Removed from Unit 1, and where it went.** The AI agent introduction, the "ghost" passage, file-tool explanation, Copy-path tip and `#agent-home` section moved from `/before-you-start` to the optional [`/agent-basics`](../../content/agent-basics.html) reading. The `CLAUDE.md`, memory and project-file sections moved from Lesson page 4 to the same reading. Lesson page 4 keeps a one-line pointer. The Moodle Lesson keeps its page IDs.

**Removed from learner pages and kept in research.** Author verification dates on the tool and course tables moved to [the free tools research record](../research/free-ai-tools.md). The ChatGPT 101 row was replaced by AI Foundations, because the old row was stale.

**Removed as a route.** The static `public/recovery.html` was deleted, so learners have one recovery path. `/recovery` and `/recovery.html` now redirect to Moodle's own recovery form, and `/help` links to it too. This closes the earlier `/recovery` limit.

**Access.** Skip links and main landmarks were added on `/preview` and `/ai/`. The `/privacy` table scrolls inside its own keyboard-reachable region. Support addresses are excluded from Cloudflare's email obfuscation, so they work without JavaScript. The long copy and paste guide on `/preview` is now behind a choice.

**Privacy.** `/privacy` is now a draft Australian privacy policy. A collection notice appears on Moodle's sign-up form, before its policy agreement, through the supported `extend_signup_form` hook. Moodle core is unmodified. The [compliance mapping](../operations/privacy-compliance.md) lists what Finlay must confirm. This draft is not legal advice.

**Unit 2.** Unit 2 stays planned. It has no activities and no journey. The catalogue shows one optional link to the early reading.

**AI context.** New edition `2026-11-06.1`. Earlier editions are unchanged.

## Verification

All results below are from the review candidate before publication. Tests are synthetic unless a line says otherwise.

- **Python unit suites:** 26 passed, including new sign-up notice and privacy policy contracts.
- **Browser suites on the static pages:** metadata 2, structure 4, entry 11, feedback 32, tips 7 and portfolio 8 all passed. The host's load average was about 25, so these ran with longer timeouts.
- **Native rules:** course-structure, welcome and starting-point rules passed.
- **Synthetic onboarding on the isolated Moodle fixture with captured mail:** 10 passed. This covers sign-up with the notice shown, confirmation, resend, recovery and pilot-only admission. An earlier run stopped at the optional check because that fixture had not enabled it. It passed after the fixture-only `publish-starting-point.php enable-fixture` command.
- **Publishers on the fixture, run twice:** existing module IDs, instances, completion settings and visibility did not change. Counts did not change for users, lesson pages, lesson attempts, completion records and quiz attempts. Only names changed, to the new canonical names, and the hierarchy groups were added.
- **Page checks on 15 public pages, locally:** axe found 0 WCAG A and AA violations. The first Tab stop is the skip link. There is no overflow at 320, 390 or 1440 pixels after one `/privacy` table fix. Without JavaScript, no obfuscated email address appears.

**Not run:** `npm test`, because it needs private QA data and checks the live site. Nothing was sent to a real mailbox. No person has used this version.

Live publication checks are in the section below when complete.

## Remaining limits

- **Not established:** wording approval, genuine-mail receipt, human-pilot completion, learner mastery or permission to invite others. Owner preview publication shows the work to Finlay and proves none of these.
- **Not open:** neither launch stage. Noindex stays on. The acquisition settings did not change.
- **For Finlay:** review `/agent-basics` and `/privacy`, and confirm the eight items in the compliance mapping.
- **Cloudflare:** the scoped rule still needs the new edition paths applied and read back. Until then, Python-urllib clients may get HTTP 403 on new editions.
- **GitHub Actions:** the workflow file still needs a token with workflow scope ([#10](https://github.com/drfinlaymccall/human-ai-orientation/issues/10)).
- **Tips panel:** `/preview` still shows the Tips panel twice, because each writing surface needs it for its field hints. This is deferred.
- **Backups:** no restore has been verified. Finlay accepted this for Stage B.
- **Review deferrals:** see [#20](https://github.com/drfinlaymccall/human-ai-orientation/issues/20).

## Remaining questions

- Do learners complete the new practice without help?
- Does the Unit 2 reading help the people it is for?
- Is the sign-up notice read and understood?

Only Finlay's reviews and the pilot can answer these.
