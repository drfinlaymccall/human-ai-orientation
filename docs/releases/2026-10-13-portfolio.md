# Portfolio journey release — 13 October 2026

## Need and resulting experience

The prototype proved one context lesson; Finlay wanted a coherent short course leading to a reusable personal context portfolio, with a complete public account of its design. The release adds a first useful task, a three-document portfolio builder, and a final fresh-task check and next-goal record. The existing seven-page Lesson remains intact. Public pages work without an account; Moodle pilot accounts retain progress separately from browser-local portfolio drafts.

The practical sequence is optional preparation → choose and try → give useful context → build a portfolio → check and continue. The portfolio bridge sits within the second agreed activity. Working preferences, projects/goals, and useful knowledge/examples are originally authored beginner templates informed by Nathaniel Whittemore's modular portfolio idea. They are not copies of his ten-file system. An optional interview prompt works with the learner's own AI; typed and fictional/no-AI routes remain complete.

## Implementation choices

- Shared fragments generate public reading pages and native Moodle Pages. New modules 5–8 supply the journey, first task, portfolio and check/continue; existing Lesson module 1 and optional resources remain. New activity completion is manual and explicitly records practice, not mastery. Overall course-completion definitions were not changed retroactively.
- Markdown export supplies readable context documents. Versioned JSON export/restore retains all fields and private practice notes. Only selected context is copied to an AI; practice notes are excluded from context exports. Strict import schema, field/size bounds and confirmation before replacement protect existing work.
- Browser session storage is temporary and independent of Moodle accounts. Pages tell learners to download a backup and verify they can find it. No portfolio data is posted to Moodle or an AI service by the builder. Storage, clipboard and JavaScript fallbacks remain available.
- Gmail SMTP credentials were entered privately by Finlay. A course test to hi@finlaymccall.com was accepted and then confirmed received with the intended sender. Mail diversion was removed and native recovery restored for invited accounts. Public registration and reminders remain disabled.
- Help is available through the course address. A private operator-assisted support queue supports draft, review, exact-message approval and dispatch. Synthetic transport captures locally. No automatic inbox ingestion or autonomous replies are claimed. See the operating guide for the trusted-operator boundary.
- Public GitHub records source, original/current briefs, research, curated design dialogue, control document, decisions, tests and this release. The upstream Moodle submodule pins the full unmodified source. Private runtime config, databases, portfolios, mail and logs are excluded.
- Original educational content and curriculum/design documentation are CC BY 4.0, as Finlay selected in the companion design chat. Software and third-party material have separate licensing. The deeper-course guide and licence work from that chat are included in this shared release.

## Verification evidence

- Portfolio suite: **8 passed**. Export/restore after clearing session storage, selected copying, review reset, reflection exclusion, invalid/oversized/type/version/HTML imports, overwrite/clear confirmation, blocked clipboard/storage, no content network submission, mobile/no-JavaScript reading worst-case escaped backup size, history-cache restoration and out-of-order file reads. The history-cache regression dispatches the browser lifecycle event with newer stored state; it does not claim a physical-device back/forward-cache audit.
- Reviewed-support unit suite: **6 passed**. Unapproved dispatch, changed recipient/subject/body/transport, stale approval, one-time capture, uncertain delivery, header injection and invalid IDs. These are synthetic tests, not learner support conversations.
- Combined live public suite: **12 passed** through public HTTPS; the three affected native/context checks passed again after review fixes. Existing Lesson completion/reflection/return, preparation, curated resources, interactive brief/try workspace, public context, private-route denial and native recovery form access remain functional.
- New native portfolio test passed: public-to-Moodle draft continuity, native journey links, desktop/mobile layout, downloaded backup, saved manual completion and returning to the check/continue draft. New native recovery test passed: locally captured Moodle reset email, usable reset link, password change and a fresh-session sign-in using the new password. No external reset-test message was sent.
- Initial new-test failures exposed test-harness assumptions: MIME soft-line encoding, first-login policy redirection, closing the mobile course drawer, and the completion button's full accessible name. Corrected the harness without bypassing these learner interactions.
- Native course sync run twice: module IDs stable; hashes of existing attempts, answers, completion and overall course-completion definitions unchanged. A fresh database/config backup preceded changes.
- JS/Python/PHP syntax and Caddy validation passed. The public Moodle-source submodule fetched and checked out the pinned commit successfully. Desktop/mobile synthetic screenshots were visually reviewed; no claim of assistive-technology certification or physical-device testing.
- Simplification pass used three independent reviewers, removed an accidental duplicate licence notice and reused one fragment expansion; no safety checks removed. Release review led to the cached-page and delayed-import protections, stronger persisted-completion and fresh-session password tests, an immutable 1.0 schema plus distinct 1.1 schema, checked atomic private config/manifest writes, and automated-check detection of untracked generated files. The Actions template is prepared but inactive because the publishing login lacks GitHub workflow scope; local results are recorded here.

## What remains open

Finlay's founder feedback and owner-confirmed email are real observations, but no three-to-five-person pilot has been run. The protocol, invitation draft and private observation/public synthesis templates are prepared. Finlay selects willing participants and sends invitations. Learning outcomes and completion time have not been measured with learners.

Off-server backup/recovery, support capacity and record-retention decisions remain operating work before broad registration. No reminder campaign, automatic support agent, paid API integration, narrated demonstration or ten-session expansion was added. Select subsequent modules from pilot evidence, starting with at most three changes.

## Authorship and record

Finlay supplied purpose, pedagogy, priorities, walkthrough corrections, licence choice and mail verification. Codex drafted/researched/implemented and tested the release, with a portfolio implementation subagent and bounded simplification/review agents. The original implementation began before Git; baseline commit `2e2752a` preserves its first recorded state. Earlier dialogue is curated from actual course-design chats rather than represented as invented commit history. Credentials and unrelated private context are omitted from publication.


Publication checks: staged paths were reviewed against the source/document allowlist and compared with actual runtime credential values plus token/private-key patterns without printing secrets. No matches were found. Generated outputs rebuilt without differences. The source pin was fetched and checked out, but a complete replacement-host Moodle deployment remains untested.

Formal review completed across ten local review lenses. An independent validation pass confirmed the seven actionable findings were fixed; no actionable findings remained. The optional Claude cross-model review was stopped without a usable result and is not counted as completed coverage. Live runtime checks were performed separately by the implementation agent.

Publication adjustment: GitHub rejected the first feature-branch push because the OAuth login cannot create workflows. The unpublished commit was amended to keep the tested workflow as `docs/operations/course-checks.workflow.yml`, with `npm run check:public` as the local equivalent. The course and full source are still published; enabling Actions is an explicit remaining setup item, not a claimed successful CI run.
