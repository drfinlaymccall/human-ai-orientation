# Minimum viable course: one path to the portfolio and a next goal

Date: 10 November 2026 (Australia/Sydney). Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Source findings: [launch audit](../reviews/2026-11-10-launch-audit.md) F30, F31, F32, F33 (part), F35 (part), F38 (part) and F59.

## Need

The audit found that a new learner could not see one clear route through the course. The home page led to a map of seven modules. Next buttons on the optional pages skipped the first activity. The portfolio was labelled "not needed for Unit 1 completion", although it is the main result. The next goal was a box to fill in, with no teaching. The last activity looped back to the portfolio with no close. Two native test suites failed on text that no longer matched the pages (F59).

On 10 November Finlay asked for the course to be finished as a minimum viable product. In his words, the course should "stand up", people "can go through it", and they learn "how to create their three context documents and the next goal that they want to complete with a machine". He asked for the extras to be left for another unit.

## Decision

- Make one path the front door: four steps, in order, ending with three context documents and a next goal.
- Name the portfolio as the result. Do not change which activities count for completion.
- Teach the next goal in one short step. Do not add a stored field; the existing boxes hold the answers.
- Lead with one way to keep work: copy it into your own notes. Other ways stay available, lower on the page.
- Offer "talk it through with my AI" as a copyable prompt that covers all three documents. No microphone feature is built, so the course still records nothing and sends nothing to an AI.
- Use "Your course journey" as the one name for the signed-in journey page. It was already the menu label, the public page title and the name in the welcome mail.

## Change

Learner pages (shared fragments in `content/`, then `npm run build`):

- **Home:** the main button is "Start the course" and opens step 1. "Explore your course" stays as the second button. A new list names the four steps in order with times. "Keep your work" now leads with your own notes. The word "pilot" is gone.
- **Journey:** the four steps and "Start step 1" come before the activity map. The map text says the three other modules are optional practice. The starting-point check is one sentence.
- **Step labels:** "Activity 1" to "Activity 4" are now "Step 1 of 4" to "Step 4 of 4". The portfolio label no longer says "not needed for Unit 1 completion".
- **Next buttons:** the three optional practice pages and `/free-tools` now lead to step 1. "Go deeper" leads back to the journey. Step 1 leads to "Give AI useful context" by its own name.
- **Portfolio (step 3):** a "Talk it through with my AI" prompt covers all three documents and asks the AI for plain text to copy. The dictation tip that appeared twice now appears once, in the tips panel. "Keep it somewhere you can find again" leads with copying into your own notes and reopening the note.
- **Last step (step 4):** a new section, "Choose your next goal", gives four prompts and a fictional example. The page ends with "Finish: check you can return" and "What next?" (start the goal, go deeper, keep in touch, give feedback).

Native Moodle (plugin `local_orientation`, no version change and no schema change):

- The signed-in journey heading is "Your course journey".
- The message shown when the three core activities are complete now points to the portfolio and the next goal. Its first sentence is unchanged.
- The optional native pages end with "Start the course: Try AI on a useful task", which opens the native step 1 page.

Tests: `tests/starting-point.spec.cjs` expected an activity name that was retired on 6 November; it now expects "Give AI useful context". `tests/launch-entry.spec.cjs` and `tests/public.spec.cjs` follow the new buttons.

Not changed: module IDs, lesson page IDs, answers, attempts, completion rules, the completion baseline (version 1, three activities), saved-work field names, the backup format, acquisition settings, `noindex`, the dated AI-context edition and Moodle core. The context Lesson was not edited; only the label above the title of its public copy at `/preview` changed.

## Verification

All tests are synthetic. No learner used these pages.

Before merge, on the branch:

- **Python tests:** 28 passed. Support tests: 6 passed. Journey lifecycle script: passed.
- **Public browser suites (local static server):** entry 11 passed, metadata 2 passed, portfolio 8 passed (on port 18816, because another project holds the default port), feedback 32 passed, tips 7 passed.
- **Build:** `npm run build` leaves no uncommitted change.
- **Layout:** home, journey, portfolio and the last step do not overflow at 1280 pixels; home does not overflow at 390 pixels. Screenshots were read by the agent.
- **Synthetic fixture (port 18802, captured mail):** the branch plugin and content were published to the fixture; both publishers ran twice and reported module IDs and learner evidence unchanged. The suites were then run from the `main` checkout, because the suites refuse a linked fixture and the branch lives in a worktree. So the fixture carried the new pages and the test files were the old ones.
  - Onboarding 11 passed, welcome 5 passed, WB10 learner journey 2 passed.
  - Progress: 4 passed, 1 failed, 11 did not run. The heading assertion that failed in the audit ("Your course journey") now passes. The suite then stops at the next line, which expects "Portfolio practice within activity 2". That text left the source on 25 October (commit `05279cb`), so the failure is older than this change. The rest of the suite is not verified.
  - Starting point: 2 passed, 1 failed, 5 did not run. The one failure is the old test file expecting the retired activity name. The corrected test is on this branch and was not run before merge.
- **A mistake during testing, and its repair:** the agent stopped a fixture run part-way. That left the fixture's site-policy setting switched on, and two suites then failed at sign-in. The agent cleared the setting in the synthetic fixture and reran. No live setting was touched.

After merge and publication: see the comment on [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Remaining limits and questions

- **Wording is not approved.** Finlay accepted the direction. He has not read these words. The preview shows them to him.
- **The progress suite is still out of date** beyond the heading. Repairing it is the next records change (audit package A1).
- **`tests/public.spec.cjs` was edited but not run.** That suite targets the live site with an old private account, so the agent does not run it.
- **`/preview` still says "lesson" in places and shows the tips panel twice.** The Lesson was left alone in this change to protect its page IDs and answers. It is the next change.
- **The header still shows "Course catalogue" and "Unit 1 journey".** Demoting the catalogue and Unit 2 is in the next change.
- **The dated AI-context edition (`2026-11-06.1`) still describes "three activities and a portfolio bridge".** Editions are immutable; a new edition goes out with the next change.
- **Finlay's own voice is not added.** Only he can supply it (items 17–20 in [his list](../reviews/2026-11-10-finlay-contributions.md)).
- Does a new learner follow the four steps without help, and finish with three documents and a goal? Only the pilot can answer.
- Does the talk-it-through prompt work well in the free tools people use? Not tested with a real AI service.
