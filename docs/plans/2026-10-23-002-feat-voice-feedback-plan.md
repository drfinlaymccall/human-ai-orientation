---
title: Voice feedback to Finlay - Plan
date: 2026-10-23
type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---
# Voice feedback to Finlay - Plan

## Goal Capsule

Deliver stage one: signed-in course learners can privately send Finlay a short recording about a course activity, with text and file-upload alternatives. The user authorised planning, implementation and an integration PR on 23 October 2026. Work from commit 7452389 in the separate `feat/voice-feedback` worktree; the release-baseline agent owns the original checkout and shared release housekeeping. Repository instructions and the user's stage-one scope govern this plan. This workflow owns testing, review, commit, push and opening the PR; merging and production installation are integration steps, not part of this branch. Stop for a genuine scope conflict, not routine implementation choices.

## Product Contract

### Summary

An optional feedback link on Moodle course activities opens a form that preserves the activity context. A learner records, reviews and explicitly sends audio, optionally with text. Finlay reviews the saved message in a private Moodle inbox.

### Problem Frame

Learners need a convenient way to tell Finlay what worked or caused difficulty at a specific point in the course. Giving specific feedback also supports the course's human capability goals. Recording a voice message does not require transcription or an embedded AI.

### Requirements

- R1. Signed-in enrolled learners can open feedback from the configured course and its accessible activities; the feedback retains course, activity and optional section context. Anonymous readers have sign-in and existing email routes.
- R2. Microphone permission is requested only on an explicit Record action. Live recording stops after 120 seconds. Show recording state, elapsed time, playback, discard and re-record controls; release the microphone on stop, cancellation, navigation and errors.
- R3. Nothing is sent until the learner presses Send. Failed sends retain the current recording for retry. A receipt confirms storage rather than claiming email delivery.
- R4. Text-only feedback and native audio-file upload work without JavaScript. Preserve all existing bring-your-own-AI, portfolio and public reading paths.
- R5. Store audio with Moodle's private File API and metadata in a plugin-owned table. Authorise submissions, inbox access and playback independently; peers cannot retrieve recordings. Never publish feedback or copy private portfolio fields automatically.
- R6. Notify a configured reviewer through Moodle's message API after saving feedback. The private inbox is authoritative if notification fails. Protect retries against duplicate submissions and duplicate notification attempts. Existing support replies still require Finlay's explicit approval.
- R7. Enforce CSRF protection, course/activity access, text and upload limits, an allowlist of verified media MIME types and per-user rate limits. Live recordings are limited to two minutes in the browser; uploaded recordings have a server-enforced 4 MiB size limit, without claiming server-side duration verification.
- R8. Provide Moodle privacy metadata, export/deletion integration and a documented retention/cleanup route. Admins explicitly configure the course and reviewer before enabling feedback. Installation must not modify Moodle core, existing activities, answers, attempts or completion.

### Acceptance Examples

- AE1 (R1-R3). An enrolled learner opens an activity's feedback link, records a fictional message, stops, listens, discards and re-records, then submits once. The private inbox contains the intended context and playable audio.
- AE2 (R4). With JavaScript disabled, text-only feedback or an audio upload can be submitted. Existing course and portfolio checks still pass.
- AE3 (R5-R7). Guests, an unenrolled account and another learner cannot inspect someone else's feedback or its file. Missing sesskeys, cross-course activities, unsupported files, oversized uploads and repeated requests are rejected before storage.
- AE4 (R3, R6). Permission denial and failed requests give useful recovery guidance; the browser retains a completed recording after a failed request. Repeating a submission token returns the same saved receipt without a second notification.
- AE5 (R8). Installing/configuring the plugin on an isolated Moodle site works through supported APIs. Privacy export/deletion includes the recording. Historic completion/attempt fingerprints remain unchanged.

### Scope Boundaries

Transcription, speech-to-text in arbitrary fields, AI feedback coaching, spoken AI replies, anonymous uploads and live deployment are later decisions. Public support gets a link to the signed-in feedback route; stage one does not rewrite every public course page or every text box. Tests use synthetic accounts, fictional feedback and captured/disabled email.

## Planning Contract

### Key Technical Decisions

- KTD1. Use a standalone Moodle 4.5 local plugin under `moodle/local/orientationfeedback`, installed separately from the pinned core. The existing Python support queue handles outbound reply approval, not authenticated incoming audio; do not couple these workflows. Use a supported output hook for activity feedback links.
- KTD2. Use a conventional multipart form and a progressive-enhancement recorder based on browser MediaRecorder. A same-origin fetch posts the recording only after Send; native form POST handles no-JavaScript text/file submissions. Keep blobs in memory only, and retain them after recoverable failures.
- KTD3. Moodle enrolment, course capabilities, File API, messages, database transactions and locks own identity, access, storage and submission deduplication. The reviewer defaults to site administrators' review capability rather than every teacher. Notifications contain a private inbox link, not audio attachments or feedback text.
- KTD4. Source context is a validated course module or an allowlisted public course route, plus an optional learner-supplied section label. Never accept arbitrary return URLs or unfiltered query strings.
- KTD5. Package an explicit install command and operations notes; never run it against the live site as part of PR preparation. Use the existing isolated PHP/PostgreSQL runtime to provision a distinct synthetic test site/database if available. Preserve baseline work and select the correct PR base after its release PR lands.

### Evidence and Alternatives

Pinned Moodle source provides output hooks in `lib/classes/hook/output/before_footer_html_generation.php`, File API and messaging. The production route sends non-public paths to `trial/moodle` (`deploy/Caddyfile`). Public help is built from `content/help.html` by `scripts/build-journey.py`. `scripts/support.py` is an operator-assisted reply approval queue, not a learner upload service. TinyMCE recording alone would embed audio in existing responses rather than provide a private contextual feedback inbox. External recording/transcription subscriptions add no required value for this first slice.

## Implementation Units

### U1. Store and review private feedback

Goal: implement the plugin's schema, settings, capabilities, validated submission service, notification, protected playback, review inbox and privacy provider (R1, R3-R8; AE2-AE5; KTD1, KTD3-KTD5). Files: `moodle/local/orientationfeedback/**` except recorder assets; installer and synthetic Moodle tests. Use Moodle APIs and deterministic filenames; retain feedback even if notification fails. Verify no guest/peer access, CSRF, MIME/size limits, deduplication, notification failure, course context validation, privacy deletion and unchanged completion.

### U2. Record and review before sending

Goal: implement the form's browser enhancement, state management and recovery (R2-R4; AE1, AE4; KTD2). Files: plugin recorder JavaScript/CSS and isolated Playwright tests/config. Verify explicit permission, stop/re-record/discard, timeout, send-on-click only, retry preserving audio, lifecycle cleanup, keyboard/mobile layout and native fallbacks. U1 owns the form field contract; agree it before concurrent edits.

### U3. Package and document integration

Goal: add the public help entry, reproducible install instructions, feature decision/release evidence and focused checks (R1, R4, R8; AE1-AE5; KTD4-KTD5). Files: `content/help.html`, generated help, `docs/operations/voice-feedback.md`, release record and this plan. Update shared CONTROL/brief only after checking baseline changes and keep edits additive. Run public builds, support and portfolio checks alongside feature tests. Commit and open a focused PR with install limits and synthetic verification clearly labelled.

## Verification Contract

- Lint all plugin/install/test PHP with the existing private PHP runtime, without printing its configuration or credentials.
- Isolated Playwright recorder tests exercise real browser APIs using synthetic media; network transport may be intercepted for explicit failure cases. Never label mocked transport as Moodle integration.
- Exercise the real plugin on a separate Moodle test installation/database with synthetic users and notifications captured/disabled. Check persisted feedback, private file access, reviewer inbox, guest/peer denials, deduplication and evidence fingerprints.
- Run `npm run build`, `npm run test:support`, `npm run test:portfolio`, the feature browser suite, and `git diff --check`. Review staged filenames and content for private data.
- Independent review covers security/privacy and requirement completeness; fix material findings before the PR. Report any unavailable physical-device/human-microphone checks rather than claiming them.

## Definition of Done

Stage-one behavior and fallbacks work with synthetic evidence; there are no known blocking review findings; operations notes explain enablement, recipient configuration, retention, notification failure and rollback; core and learner evidence stay untouched; the feature is committed and pushed on its own branch with an attached integration PR. Production remains unchanged until integration.
