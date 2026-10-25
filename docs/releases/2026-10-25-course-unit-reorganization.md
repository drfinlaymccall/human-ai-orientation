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

### Real native rehearsal

A fresh isolated Moodle installation received the base source, synthetic evidence and then the updated source. Preparation and journey publication each ran twice. Existing module IDs 1–9, visibility, completion settings and nine evidence-table fingerprints remained unchanged. Nonempty evidence included a Lesson attempt/timer, authored answers, an activity completion and saved context. Grades, branches, course completions and completion criteria were empty; populated preservation in those tables was not tested.

Seven ordered module groups and their declared children matched the map. The retained journey Page is first inside Unit 1. Section 0 is the catalogue. Six real signed-in browser checks passed: catalogue, journey and native course, each with JavaScript enabled and disabled. The fixture favicon returned 404; no JavaScript exceptions occurred. The isolated services stopped after verification.

The existing **Go deeper: courses and videos** Page remains a supplementary resource beside the module groups. This is an explicit retained-resource exception, not a required module or an unreported claim of exact outline parity. No resource was deleted or recreated.

### Independent source review

Claude CLI review covered the full initial source change and the subsequent fixes. The repeated syllabus-link defect, generic activity guidance, indirect desktop link and test portability concerns were corrected. A fresh review returned no new findings for application commit `41fb960489c47cb00cab59915eeae0fdcc42cba3`. The [pinned receipt](https://github.com/drfinlaymccall/human-ai-orientation/pull/36#issuecomment-6394774467) records coverage and limits. Public metadata schema hardening remains an explicit P3 follow-up in issue #24.

The updated build, six Python structure checks, seven metadata checks and four browser checks passed. One browser run reached its 30-second timeout; a rerun with a 60-second allowance passed all four checks. The new regression covers syllabus link, atlas button, then the same syllabus link.

### Owner-preview publication

Application commit `41fb960489c47cb00cab59915eeae0fdcc42cba3` is published to the owner preview. The [course catalogue](https://orientation.finlaymccall.com/catalogue) and [Unit 1 journey](https://orientation.finlaymccall.com/journey) were independently retrieved after publication. Unit 2 is explicitly planned. The desktop workspace and compatibility introduction routes also returned HTTP 200.

Publication used an allowlist of 53 application files from pinned Git objects. The live checkout retained its earlier branch HEAD because concurrent documentation work was present. No reset, stash, merge or unrelated-document overwrite occurred. The deployed application SHA, rather than the checkout HEAD, identifies this release.

The installed plugin matched the reviewed source. Both publishers ran twice. Before/after counts and hashes matched across 17 captured tables, including 38 accounts and populated lesson/completion evidence. Existing module identities, visibility, completion settings and acquisition/mail settings remained unchanged. Saved-context, feedback and quiz tables were empty; their absence was preserved, not populated-record behavior demonstrated. Cache/cron operational keys changed as expected and were excluded explicitly from the protected-settings comparison.

The seven native module groups match the course map. The journey is first inside Unit 1. Existing Go deeper and optional starting-point resources remain outside those groups. New desktop practice has no completion gate. No account, invitation, mail action or learner submission was created by publication.

Public checks verified exact origin bytes for 22 of 23 changed assets. Public HTTPS HTML retained existing Cloudflare analytics/email transformations. Metadata and changed JavaScript matched exact edge bytes. Eight earlier context editions remained unchanged. Signed-out native routes still require login, and protected source paths returned 404. Native rendering used fictional safe states; no signed-in live-browser smoke was performed.

### Remaining publication limits

- The new context edition and schema work with browser/curl clients, but Python-urllib receives HTTP 403. The reviewed scoped Cloudflare rule still needs application and readback by an authorized operator. No connected Cloudflare update capability was available. The existing hostname, GET/HEAD and Browser Integrity Check-only scope must remain unchanged.
- `/recovery` reaches Moodle login rather than the generated static recovery page. The reviewed route configuration was not changed without review. This is not a claim that native password recovery failed.
- PR #36 remains open and stacked on PR #35. Application review covers the exact published commit; subsequent documentation-only receipt updates require review before merge.

Native integration and independent application review passed with the limits above. The learner-facing reorganization is live; universal machine-client retrieval is not complete. No source test establishes learner mastery or human-pilot success. Broad registration remains closed.

Tracking: [journey issue #24](https://github.com/drfinlaymccall/human-ai-orientation/issues/24). This change builds on the existing source in PR #35; it does not merge or close that parent work.
