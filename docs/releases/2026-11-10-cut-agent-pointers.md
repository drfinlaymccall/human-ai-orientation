# Agent material out of Unit 1

Date: 10 November 2026 (Australia/Sydney). Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Follows the [step 2 change](2026-11-10-step2-header-progress.md).

## Need

Finlay's direction on 10 November: Unit 1 is context engineering for beginners; agent tools, their folders and their instruction files belong in the next unit. The agent asked whether to cut the pointer from step 2 to the Unit 2 early reading. Finlay answered "Yes, cut it".

While making the cut, the agent found three more places:

- `/before-you-start` had the same kind of pointer ("Curious how agent tools use files…").
- The signed-in Moodle version of step 2, section 5, still carried an older block, "Optional: I already use a supporting agent", with links to two agent tools' instruction guides. The source moved that material to the Unit 2 reading on 6 November, but the publisher has never updated section 5, so signed-in learners still saw it. The course map's update note already says the material moved.
- The closing section of step 2 said "later human–agent curriculum work" and "what the agent needs to be told".

## Decision

- Cut the step 2 pointer (Finlay's decision).
- Cut the `/before-you-start` pointer for the same reason. Finlay was asked only about step 2; this is the agent's reading of his direction, flagged to him.
- Let the publisher update section 5 of the Moodle Lesson, so the signed-in page matches the source.
- Say "the next unit" and "your AI" in the closing section.
- Keep the Unit 2 early reading (`/agent-basics`) published and linked from the catalogue. Its review is still item 15 in [Finlay's list](../reviews/2026-11-10-finlay-contributions.md).

## Change

- `public/preview.html` and `content/useful-context.json` (section 5): the sentence pointing to the early Unit 2 reading is removed.
- `content/computer-basics.html`: the pointer paragraph is removed.
- `content/useful-context.json` (section 7, also shown on `/preview`): the closing sentence is reworded.
- `scripts/sync-preparation.php`: the list of Lesson pages whose authored text is updated now includes section 5 (a content page). The question page (section 6) is still left alone. The same guard applies: the page is found by title, its type must match, and only its text is written.
- `docs/releases/2026-11-10-step2-header-progress.md`: corrected. It said three reworded sentences reached the Moodle Lesson; two did.

Not changed: the plugin, the database schema, module IDs, lesson page IDs, questions, answers, attempts, completion rules, saved work and acquisition settings.

## Verification

All tests are synthetic. No learner used these pages.

Before merge, on the branch:

- **Python tests:** 28 passed. Support tests: 6 passed.
- **Public browser suites (local static server):** entry 11, structure 4, portfolio 9, metadata 2, tips 7 and feedback 32 passed.
- **Build:** `npm run build` leaves no uncommitted change. `/preview` and `/before-you-start` no longer contain the word "agent".
- **Synthetic fixture (port 18802, captured mail):** the branch content and publisher were run on the fixture twice. Both runs reported module IDs, learner records and lesson answers unchanged.
  - Progress 16 passed. This suite walks the Moodle Lesson through section 5 and on to completion. Starting point 8 passed. Both ran with the branch's files through the temporary worktree link described in the step 2 record.
  - WB10 learner journey 2 passed, run from the `main` checkout; its test file is identical on the branch.
- **Not run:** onboarding and welcome suites (no change touches them), the context suite and `tests/public.spec.cjs`.

After merge and publication: see the comment on [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Remaining limits and questions

- **Wording is not approved.**
- **Does Finlay agree with cutting the `/before-you-start` pointer too?** It is easy to restore.
- **Section 6 of the Moodle Lesson (the question page) is not updated by the publisher.** Its text was not compared with the source in this change.
- The home and journey pages still say "Unit 2 is a planned syllabus, not an available set of activities", and the catalogue lists it. That is a statement about the course, not agent material, and is kept.
