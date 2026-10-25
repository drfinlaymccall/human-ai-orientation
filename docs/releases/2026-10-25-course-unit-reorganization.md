# Course unit reorganization

## Need and decision

Finlay approved one course with a lightweight catalogue of units. Each unit has a syllabus of modules and activities. Its journey presents that syllabus. There is no programme layer or separate Moodle course per unit.

Unit 1 contains Human–AI Orientation, including desktop workspace, files and folders, notes, useful-task/context practice, portfolio reuse, and checking/next steps. Its journey absorbs the introduction. Unit 2 has a planned Introduction to Agentic Systems syllabus only.

## Change

The canonical course map declares units, modules and stable activity references. Public and native catalogues and journeys consume that structure. Existing activity identities and the original completion baseline remain unchanged. Native publishers regroup activities through supported Moodle APIs. The retained introduction Page belongs inside Unit 1.

The change also updates public AI context metadata, routing declarations, author guidance, the design brief, README, contribution guidance and CONTROL.md. Earlier dated design records remain historical. The [structure reference](../curriculum/course-structure.md) explains extension and publication.

## Verification at source handoff

The integrating agent ran these checks in the isolated feature worktree:

- `npm run build`: passed.
- `npm run test:structure`: six Python checks and four Playwright checks passed.
- `python3 -m unittest discover -s tests -p test_ai_context.py`: seven checks passed.
- `git diff --check`: passed.

Playwright used source-backed interception at desktop/mobile widths, with JavaScript enabled and disabled. These checks do not establish native Moodle rendering or live routing. The implementation worker also reported PHP API-double migration checks; those are not a substitute for an actual Moodle rehearsal.

## Release boundary

Native integration, independent pinned-source review and live preview publication are separate gates. Their results belong in the delivery PR and a later update to this record. No source test establishes learner mastery or human-pilot success. Broad registration, email settings and invitation decisions are outside this change.

Tracking: [journey issue #24](https://github.com/drfinlaymccall/human-ai-orientation/issues/24). This change builds on the existing source in PR #35; it does not merge or close that parent work.
