# Complete lesson: Give your AI useful context

Authored 13 October 2026. Canonical content: [useful-context.json](../../content/useful-context.json). The seven screens form one 25–35 minute lesson; the duration is an estimate to check with humans.

## Outcome and evidence

| Intended capability | Activity | Evidence |
| --- | --- | --- |
| Identify a worthwhile task and starting need | Choose a personal task or fictional community event | Learner names a goal and an uncertainty |
| Select relevant information and explain its value | Build a short brief; include and omit deliberately | Reflection explains one selection or omission |
| Distinguish notes, shared context and saved instructions | Explanation, worked example and feedback question | Learner chooses deliberate sharing and verification over assuming access |
| Guide an interaction and evaluate the result | Predict, try, inspect, correct or retain | Reflection connects an observed result to an instruction decision |
| Retain useful guidance for future work | Personal/project briefs and a next goal | Learner keeps their own text and identifies a next use |

The lesson enacts needs, knowledge, evaluation and human-led execution within one task. It supports metacognitive knowledge through prediction, strategy choice and self-evaluation. The context brief is a small creation task, not proof of expert-level mastery. See the [scholarly rationale](../research/scholarly-design-rationale.md).

## Learner route

1. Choose something worth doing, including a sign of success.
2. See a vague request and a more informative brief; distinguish context mechanisms.
3. Build a small brief and explain what belongs and what does not.
4. Try it in the learner's AI, check the result and make a justified adjustment.
5. Derive personal/project instructions; introduce CLAUDE.md and AGENTS.md with an optional supported-tool route.
6. Answer a feedback question with a retry opportunity.
7. Save a short reflection and retain the full portfolio in the learner's own notes.

The worked-example route is complete without an external account or available AI feature. It asks the learner to find invented event details and revise the response. Voice, file upload, coding, paid plans and external readings are optional. Outbound links appear only in the extension.

## Delivery and data

The trial uses Moodle's native Lesson activity: content pages, a multiple-choice question, an essay/reflection response and completion on reaching the end. Grades are disabled. Supported local language overrides replace Moodle's generic essay-grading wording with saved-reflection feedback. Internal attempt scores remain platform data; this is not a claim of learning mastery or a formal graded assessment.

Learners use fictional details in the private trial. Moodle stores accounts, progress, answers and activity logs; it does not receive a learner's full portfolio unless they paste it into the reflection. Course administrators can inspect the reflection. Email is captured locally. No external inference or model-based marking is connected.

## Authoring and portability

The original prose lives in JSON, independent of Moodle. `scripts/seed-course.php` creates the course and lesson using native Moodle APIs. Rerunning it preserves an existing lesson and attempts; it does not silently overwrite learner evidence. Edit the live lesson through Moodle for a trial revision, then reconcile the source JSON before release. A production content-update workflow remains to be designed.

Check provider-specific instruction-file behaviour before publishing new walkthroughs. Link to optional material with attribution. No external courseware was copied into this lesson.
