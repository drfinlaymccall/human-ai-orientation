# Optional native starting-point check

The bounded entry instrument samples six statements, each with separate understanding and can-do ratings. It is a subjective self-report, not a validated scale or a competency assessment. Full competency/evidence history and export remain later work. Completion continues to record practice in the existing activities.

`content/starting-point.json` owns the current version, wording, anchors, stable statement/dimension codes, unknown choices and activity mapping. `starting-point-v1` is the separately versioned deterministic recommendation rule from the launch plan. Native Moodle Quiz stores all answers and dated attempts, including unfinished work. The local plugin stores only immutable publication mappings in site configuration: version/hash, native quiz/question/answer identities and the instrument snapshot. There is no second learner database or private learner API.

## Publication and exposure gate

Install the repository plugin with `scripts/deploy-orientation.py --trial-dir <explicit-runtime> --upgrade` before publication. The installer copies the current instrument into the plugin, alongside the existing shared map/atlas. Never reseed/reset the existing course.

```sh
ORIENTATION_TRIAL_DIR="$PWD/trial/launch-fixture" scripts/fixture-php scripts/publish-starting-point.php status
ORIENTATION_TRIAL_DIR="$PWD/trial/launch-fixture" scripts/fixture-php scripts/publish-starting-point.php publish
```

Publication creates an optional hidden quiz with no completion or grade-to-pass condition. It uses Moodle's supported module/question/quiz-structure APIs, zero grade/default marks/slot marks, deferred feedback, fixed question/choice order, three pages of four questions, free navigation, unlimited fresh attempts, no timer and no answer preselection. Every native choice has the equally valid fraction required by Moodle single-choice validation; fractions/grades are never inputs to recommendations. All learner marks, maximum marks, correctness, right answers and grading feedback are disabled in every review period. Responses remain visible.

Run publication twice: an unchanged version/hash reuses its original quiz/mapping. A changed published version refuses publication; give changed wording/anchors a new version, which creates a new hidden optional quiz. All earlier quizzes, questions and attempts remain. The publisher checks original module identities/completion configuration and fingerprints of Lesson, completion and existing Quiz/question-attempt evidence inside its transaction. A mismatch rolls back. It never deletes/replaces earlier learner evidence.

**Owner development preview:** on 25 October Finlay authorised publishing changes to the main website while the project remains in development so he can inspect the actual interface. The reviewed `starting-point-v1` check is published and enabled there for that owner review. Native visibility controls and the supported `admin/cli/cfg.php --component=local_orientation --name=startingpoint_enabled --set=1` were used against the explicitly selected runtime; no fixture bypass or wording-approval receipt was used.

"Owner review" describes the purpose, not an owner-only access restriction. Existing enrolled accounts with native Quiz permissions can see and submit the check; staff retain their normal access. At publication verification there were two active enrolled accounts; the 37-account preservation inventory also includes suspended and other accounts. The integrator applied Finlay's instruction to the existing course audience, with acquisition unchanged and no new participants invited. The project remains pre-pilot; this check did not establish the human identity behind each account. Live smoke verified the gateway/interface without submitting ratings. Saved-rating isolation remains supported by the recorded synthetic two-user tests, not a new live two-account submission test.

**Before inviting human-pilot participants or opening broader access**, Finlay still reviews the concrete saved-rating wording in `/privacy`, `/help`, the gateway and native quiz introduction. Record the accepted copy/version/date and actual neutral-presentation/current-user-isolation evidence. Neither earlier account/progress approval, owner-preview publication nor a passing test establishes that wording acceptance. Broad registration and retention review remain separate gates. Publication of a new instrument version still starts hidden/disabled; deliberately select its preview or wider-exposure state and record the authority for that state.

The sole automated bypass is `publish-starting-point.php enable-fixture`. It requires `orientation_is_synthetic_fixture`: the exact 18802 synthetic installation, or the independent non-symlink 18812 fixture with matching marker/database/private paths and no SMTP. Other hosts/ports/databases are refused. It creates fictional test records only; captured mail stays private.

## Learner and reader behaviour

`/local/orientation/startingpoint.php` uses native login/enrolment and current-user capability checks, retaining its protected destination through confirmation. It explains storage and purpose before linking to native Quiz. It accepts no user/attempt selector. A supported Moodle output hook adds an accessible **Skip this check / Back to your course journey** link on the native attempt, summary and review pages. Leaving does not finish the attempt. Use native Next/Previous page to save before leaving; resume is offered on the journey and gateway. A partly answered or wholly unknown finished check is valid. Partial responses without a practice candidate are explained as partial; they do not imply that the learner rated every statement.

The journey reads exactly FINISHED, non-preview attempts owned by the current authorised learner. Moodle's `finished` helper also includes ABANDONED attempts, so the reader explicitly filters state. It selects the latest compatible finished attempt by finish time and ID. Each response position resolves through that attempt's native answer order to the immutable answer-ID mapping; a raw position of zero is valid. Explicit Not sure, Skip and unanswered reasons stay distinct, all with unknown numeric value. Unknown never means low ability. Incompatible questions fail closed rather than reinterpret responses. An earlier instrument is shown as dated history with a current retake invitation.

The explained suggestion remains separate from ordinary Continue. A completed suggested activity says Revisit; an unavailable suggested destination has no link and offers available activities/Help, retaining the baseline unavailable warning. All places remain open. An unfinished retake offers Resume while retaining the earlier finished suggestion; an abandoned retake does not replace it.

To roll back presentation, run `publish-starting-point.php disable` against the explicitly selected runtime. This disables the integration and hides registered quizzes while retaining native attempts/questions and immutable mappings. Restore exposure only after the applicable review gate. Do not remove the plugin, mapping or old quiz as a rollback step.

## Synthetic verification

```sh
npm run test:starting-point:rules
ORIENTATION_FIXTURE_URL=http://127.0.0.1:18812 npm run test:starting-point
```

Use the independent fixture described in [reproduction](../REPRODUCING.md), with captured mail and fresh synthetic accounts. The focused browser suite checks the actual native attempt/summary/review and absence of a native Quiz grade item, three-page mobile layout, unknown and partial submissions, skip/resume/retake, owner isolation, deterministic suggestions, additive publication and retained version evidence. Screenshots stay in ignored `trial/launch-fixture/` and show fictional records. These are functional synthetic checks, not human pilot observations or proof of comprehension, learning gain, physical-device or assistive-technology performance. Record actual observed results separately in the course-review implementation evidence; do not inherit a pass count.
