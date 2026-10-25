# Course structure and publication

## Approved structure

The product is one course. The course catalogue lists its units. There is no programme layer and no separate Moodle course per unit.

Each unit has a syllabus and, when available, a journey. The syllabus describes its modules and activities. It is not another hierarchy level.

**Unit 1: Human–AI Orientation** is available:

1. Desktop AI workspace.
2. Files, folders and locations.
3. Notes as working context.
4. Try AI on a useful task.
5. Give AI useful context.
6. Save and reuse context.
7. Check, improve and continue.

Files and notes are regular Unit 1 modules. Practice for familiar skills is optional. It is not preparation outside the unit.

**Unit 2: Introduction to Agentic Systems** has a planned syllabus only:

- Agent basics.
- Context and memory.
- Project instructions.
- Skills.
- Plugins.

Unit 2 has no active activities, journey link, completion requirements or native section. These headings do not represent complete lessons.

## Canonical source

`content/course-map.json` contains the additive `units[].modules[].activities` structure. Module activity lists contain stable activity slugs, not copies of activity records.

The existing flat `activities`, `baseline_version` and `baseline_slugs` fields remain compatible with progress readers. Every activity belongs to exactly one active module.

The legacy `preparation_module` field supplies the adoption name for the existing `orientation:computer-use` subsection. It does not define the current curriculum.

The files module declares `native_group_slug: computer-use`. Publication reuses that subsection ID. New subsection IDs use the `u1-` prefix and cannot conflict with it.

Consumers:

- `scripts/course_structure.py`: membership checks, module order and public syllabus.
- `scripts/build-journey.py`: public catalogue, Unit 1 journey and native fragments.
- `scripts/build-preparation.py`: desktop, files and notes teaching fragments.
- `scripts/build-ai-context.py`: public context manifest and readable unit outline.
- `moodle/local/orientation/classes/catalogue.php`: native catalogue, syllabus and validation.
- `scripts/course-unit-structure.php`: native module regrouping through Moodle APIs.

The desktop page reuses the existing controls and AI-interface fragments. The files page retains the file hunt and a compatibility link at `#meet-your-ai`.

The new AI context edition is `2026-10-25.1`, with schema `1.4`. Earlier editions and schemas retain their original bytes.

## Routes and native layout

| Purpose | Public route | Native route |
| --- | --- | --- |
| Course catalogue | `/catalogue` | `/local/orientation/index.php?view=catalogue` |
| Unit 1 journey | `/journey` | `/local/orientation/index.php` |
| Legacy introduction | `/course-introduction` | Existing `orientation:journey` Page |
| Desktop module | `/desktop-workspace` | New `orientation:desktop-workspace` Page |

The legacy introduction Page now contains the Unit 1 journey. Its existing URL and ID remain valid. Its rationale is part of that journey.

Native section 0 contains the course catalogue. Section 1 is Unit 1. Its subsections are the seven modules. Existing Pages and the Lesson move without replacement.

The retained **Go deeper: courses and videos** Page is a supplementary Unit 1 resource beside the module groups. The existing optional starting-point check also remains outside the module groups. It is not a required activity or another module. Its identity and links remain intact. The native outline therefore includes the journey, this resource and the seven module groups; it is not limited to the seven groups alone.

The public and native syllabuses use ordinary HTML. Activity details remain readable without JavaScript. Enhanced syllabus links reveal the selected activity panel.

## Evidence and compatibility

The completion baseline remains exactly `first-task`, `useful-context`, and `check-and-continue`, at baseline version 1.

Regrouping does not award completion or add gates. It does not reset attempts, answers, saved context, or existing completion settings.

The original activity identities, URLs and native records remain in place. Notes retain `orientation:notes`. New desktop practice has no completion tracking.

Both publishers retain their transaction-level evidence fingerprints. The regrouping helper preserves activity visibility and reuses stable subsection identities.

The fictional-example, copy/paste, saved-context and no-JavaScript routes remain available. The existing starting-point check remains optional.

## Operator procedure

These commands are for an approved isolated fixture first. A real synthetic Moodle rehearsal passed; the [release record](../releases/2026-10-25-course-unit-reorganization.md) separates its evidence from live publication.

1. Select the target fixture and an available PHP launcher.
2. Build the source.
3. Install the local plugin into the selected fixture.
4. Run the two publishers in the order below.
5. Run them again to check idempotence against the same fixture.

```sh
export ORIENTATION_TRIAL_DIR=/absolute/path/to/approved/fixture
PHP_RUNNER=/absolute/path/to/approved/scripts/php
npm run build
python3 scripts/deploy-orientation.py --trial-dir "$ORIENTATION_TRIAL_DIR"
"$PHP_RUNNER" "$ORIENTATION_TRIAL_DIR/moodle/admin/cli/upgrade.php" --non-interactive
"$PHP_RUNNER" scripts/sync-preparation.php
"$PHP_RUNNER" scripts/sync-journey.php
"$PHP_RUNNER" scripts/sync-preparation.php
"$PHP_RUNNER" scripts/sync-journey.php
```

The first publisher creates the desktop Page without completion tracking. It also adopts the notes Page. The second refreshes the legacy journey Page with native links.

The helper waits until all declared activities exist before regrouping. A bootstrap installation therefore needs both publishers before the hierarchy is complete.

Before publication, compare native module IDs, completion criteria, attempts, answers, saved context and visibility with the fixture baseline. Check catalogue and journey links as a learner.

Publication also needs the reviewed `deploy/Caddyfile` routes and the exact AI release/schema paths in `deploy/cloudflare-ai-context-rule.json`. This change does not apply either configuration.

## Verification and limits

Executed in the isolated source worktree:

- Full `npm run build`, followed by a repeated build with unchanged generated-file hashes.
- Six Python structure regressions, including rejected duplicate membership and baseline changes.
- Seven AI metadata regressions, including immutable editions and exact publication routes.
- Three deployment-boundary regressions using temporary filesystem fixtures.
- Standalone PHP catalogue and validator regressions.
- Synthetic PHP regrouping twice, with stable IDs, visibility, completion and context checks.
- Four source-backed Playwright checks: desktop/mobile, each with and without JavaScript.
- Existing public-integration and journey-lifecycle regressions.
- PHP syntax checks on changed production PHP files.

The browser checks serve source files through route interception. They do not check authentication, Moodle rendering or production routing.

The migration unit test supplies synthetic Moodle API doubles. A separate real Moodle rehearsal ran both publishers twice, preserved populated synthetic evidence and checked signed-in pages with and without JavaScript. Its limits and source-review receipts are in the release record.

The source and fixes are pushed in [PR #36](https://github.com/drfinlaymccall/human-ai-orientation/pull/36). The integrator owns live publication and its preservation receipt. A source-review pass is not a claim of live publication or learner mastery.
