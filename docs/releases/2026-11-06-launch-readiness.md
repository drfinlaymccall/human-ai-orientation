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

**Login forms on phones.** Live checks found that Moodle's sign-up and recovery forms were wider than a phone screen. At 320 pixels, part of the sign-up form was cut off on the left. Removing the new notice did not change this, so the notice is not the cause. A small style rule now keeps these forms inside the screen. It uses the supported head hook on login-layout pages, and Moodle core is unmodified. Desktop width stays at 500 pixels.

**Unit 2.** Unit 2 stays planned. It has no activities and no journey. The catalogue shows one optional link to the early reading.

**AI context.** New edition `2026-11-06.1`. Earlier editions are unchanged.

## Verification

All results below are from the review candidate before publication. Tests are synthetic unless a line says otherwise.

- **Python unit suites:** 28 passed at the login-form candidate, including sign-up notice, privacy policy, old recovery link and login-form contracts.
- **Browser suites on the static pages:** metadata 2, structure 4, entry 11, feedback 32, tips 7 and portfolio 8 all passed. The host's load average was about 25, so these ran with longer timeouts.
- **Native rules:** course-structure, welcome and starting-point rules passed.
- **Synthetic onboarding on the isolated Moodle fixture with captured mail:** 11 passed at the login-form candidate, including sign-up and recovery forms at 320 pixels. This covers sign-up with the notice shown, confirmation, resend, recovery and pilot-only admission. An earlier run stopped at the optional check because that fixture had not enabled it. It passed after the fixture-only `publish-starting-point.php enable-fixture` command.
- **Publishers on the fixture, run twice:** existing module IDs, instances, completion settings and visibility did not change. Counts did not change for users, lesson pages, lesson attempts, completion records and quiz attempts. Only names changed, to the new canonical names, and the hierarchy groups were added.
- **Page checks on 15 public pages, locally:** axe found 0 WCAG A and AA violations. The first Tab stop is the skip link. There is no overflow at 320, 390 or 1440 pixels after one `/privacy` table fix. Without JavaScript, no obfuscated email address appears.

**Not run:** `npm test`, because it needs private QA data and checks the live site. Nothing was sent to a real mailbox. No person has used this version.

## Live publication

Published from `main` at `171393d` on 6 November. These results come from `orientation.finlaymccall.com`. No form was submitted and no mail was sent.

- **Before publishing:** a private database dump was taken. No restore was tested.
- **Plugin:** version `2026102402` became `2026110600`. The native upgrade completed.
- **Publishers, run twice:** all 17 course modules kept their IDs, instances, completion settings and visibility. Lesson page IDs did not change. The second run changed nothing.
- **Names:** three activity names changed to the canonical names. The old names no longer appear on the five learner pages checked.
- **Evidence:** counts did not change for users, lesson pages, answers, attempts, grades, module completion, course completion, saved context or feedback. The Moodle log grew by 37 rows.
- **Settings:** acquisition stays `pilot`. Registration method, site policy address and 90-day feedback retention did not change. One targeted setting renamed the menu label to "Privacy policy".
- **Routes:** the public pages, `/agent-basics` and edition `2026-11-06.1` return 200 in a browser. `/recovery` and `/recovery.html` redirect to Moodle's recovery form. `noindex` stays on.
- **Sign-up notice:** it appears on the live form before the policy agreement.
- **Page checks on 19 pages, including sign-up and recovery:** axe found 0 WCAG A and AA violations. The first Tab stop is a skip link. Without JavaScript, no obfuscated email address appears. The 17 course pages do not overflow at 320, 390 or 1440 pixels. The sign-up and recovery forms overflowed at 320 and 390 pixels, which led to the login-form fix above.
- **Login-form fix:** this publishes after its PR merges. The live result is recorded on [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Remaining limits

- **Not established:** wording approval, genuine-mail receipt, human-pilot completion, learner mastery or permission to invite others. Owner preview publication shows the work to Finlay and proves none of these.
- **Not open:** neither launch stage. Noindex stays on. The acquisition settings did not change.
- **For Finlay:** review `/agent-basics` and `/privacy`, and confirm the eight items in the compliance mapping.
- **Cloudflare:** the scoped rule still needs the paths in [the rule file](../../deploy/cloudflare-ai-context-rule.json) applied and read back. On 6 November, a Python-urllib client got 200 on `/ai/context.md` and 403 on the dated `2026-10-25.1` and `2026-11-06.1` editions. A browser got 200 on all of them.
- **GitHub Actions:** the workflow file still needs a token with workflow scope ([#10](https://github.com/drfinlaymccall/human-ai-orientation/issues/10)).
- **Tips panel:** `/preview` still shows the Tips panel twice, because each writing surface needs it for its field hints. This is deferred.
- **Backups:** no restore has been verified. Finlay accepted this for Stage B.
- **Review deferrals:** see [#20](https://github.com/drfinlaymccall/human-ai-orientation/issues/20).

## Remaining questions

- Do learners complete the new practice without help?
- Does the Unit 2 reading help the people it is for?
- Is the sign-up notice read and understood?

Only Finlay's reviews and the pilot can answer these.
