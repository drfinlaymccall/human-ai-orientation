# Stage-one private voice feedback - 23 October 2026

## Need, decision and delivery

Finlay requested voice input across the Human Orientation course and authorised implementing the minimum slice: a short private recording about a lesson or website section, sent to Finlay. The feature supports practising specific feedback while preserving text and no-JavaScript alternatives. This records the request in paraphrase; it is not a learner observation or conversation quotation.

The source is a standalone Moodle 4.5 local plugin, disabled by default. Course activity links preserve course/module context. Learners record, stop, listen, discard/re-record and explicitly send; typed feedback and audio-file upload also work. The private reviewer inbox is authoritative, with a generic Moodle notification after storage. No AI model, API key or transcription service is used.

[The plan](../plans/2026-10-23-002-feat-voice-feedback-plan.md) describes scope and verification. [Operations](../operations/voice-feedback.md) covers installation, explicit course/reviewer configuration, limits, notification states, retention and rollback. The public help and privacy pages describe the new channel. README, CONTROL and the design/discovery records distinguish source readiness from production activation.

## Coordination

Work used a separate `feat/voice-feedback` worktree, starting at 7452389 while the baseline agent worked in the original checkout. A coordination comment was left on PR #8. After that PR merged, the feature was rebased onto main at bc0b45e. No live database, mail configuration, course content synchronisation or service definition was changed by feature verification. The operator install command copies only the plugin; registration and enablement are explicit subsequent actions.

## Observed synthetic verification

All accounts, messages and audio in these checks are fictional/synthetic. A separate Moodle installation, PostgreSQL database and dataroot were provisioned, with diverted mail using the local capture transport. Its config, database, files, captured mail, browser manifests and screenshots remain outside public Git tracking.

| Check | Observed evidence |
| --- | --- |
| PHP API/storage integration | Real Moodle enrolment and activity access; CSRF; malformed tokens; cross-course and hidden activities; text/size/content-MIME limits; exact private WAV bytes; a real saved generic notification; same-token deduplication; peer/teacher/guest denial; actual message-provider failure retaining feedback; rate limits |
| Privacy and retention | Real privacy ZIP contains text and exact WAV; individual, bulk and context deletion remove metadata/files; scheduled cleanup removes expired feedback; course deletion immediately removes unexpired feedback even with retention disabled; cleanup also handles legacy orphan metadata |
| Historic evidence | Non-empty synthetic lesson-attempt and completion records plus grades fingerprint unchanged across feedback operations |
| Recorder browser suite | 15 Chromium checks: real synthetic MediaRecorder/playable audio, explicit permission request, denial recovery, pending-permission cancellation, microphone release, discard/re-record, 120-second callback under a controlled clock, no POST before Send, retained exact audio bytes on retry, duplicate-submit prevention, file/text alternatives, invalid redirects, 30-second timeout, errors and 320px keyboard/mobile layout |
| Real Moodle browser suite | All three journeys passed together: exact private WAV retrieval for its author and denial for peers/teachers/guests; native no-JavaScript text and file submissions; activity footer context → real recorded WebM → saved receipt → exact playable stored bytes → private reviewer inbox |
| Public regressions | Build, existing six support approval-boundary checks and eight portfolio browser checks exercised; the portable runner also includes the isolated recorder suite |
| Syntax and hygiene | All 15 PHP files linted, recorder JavaScript syntax checked, installer Python compiled, and diff whitespace checked |

Real Chromium audio-only WebM is reported as `video/webm` by this host's libmagic. Both WebM MIME variants are allowed; integration checks compare the actual captured/stored bytes and play the audio rather than relying on a MIME label alone.

The first real integration run caught an incorrectly restrictive Moodle course-view capability check for enrolled students; it was corrected to active enrolment and course/activity visibility. A further regression test reproduced retention failure after course deletion, then passed with missing-context handling. Final review found that unexpired feedback metadata could survive course deletion and escape privacy discovery. A new check reproduced this with retention disabled, then passed after adding Moodle's before-course-deletion hook to remove feedback through the existing privacy deletion path. Test-fixture and browser-harness failures were also corrected. A temporary missing-recorder characterization was performed after implementation and is not claimed as proof-first development.

Ten local review passes completed; the course-deletion privacy finding was independently validated and fixed. The attempted external Claude review died without producing a result, so cross-model adversarial coverage is unavailable. The separate `agent-browser` audit tool was absent; browser evidence comes from the repository's existing Playwright suites.

## Re-run

Portable checks require the repository's existing Node/Python/Playwright setup:

```bash
npm run check:public
npm run test:feedback
```

`check:public` requires generated content to be committed. The isolated recorder suite uses intercepted synthetic form/transport routes and real browser media APIs; it does not claim to exercise Moodle storage.

For the real integration suite, provision a separate Moodle site with its own database/dataroot and captured mail. Set `$CFG->local_orientationfeedback_synthetic = true` in that site's private config and use a localhost wwwroot. Install the source plugin there, then run:

```bash
scripts/php tests/feedback-integration.php --config=/absolute/path/to/synthetic/moodle/config.php
npm run test:feedback:moodle
```

The PHP check produces ignored `trial/feedback-fixtures.json`. Start the synthetic site's HTTP server at the manifest's wwwroot before the browser suite; for the recorded run this was `scripts/php -S 127.0.0.1:8797 -t trial/moodle`. `FEEDBACK_FIXTURES` can select another generated manifest. The synthetic admin created for these checks used `voiceqaadmin` / `SyntheticVoice7!`; supply `FEEDBACK_REVIEWER_PASSWORD` if your synthetic administrator differs. These are labelled test credentials, not production credentials. Reprovision fixtures before repeated runs hit the per-user rate limit.

## Remaining limits and integration work

Production installation and enablement are outside this feature build. Verify the configured reviewer, Moodle cron/retention and external notification receipt when integrating. Browser tests used synthetic microphone input in Chromium; physical microphones, iOS/Safari, assistive technologies and human feedback/learning outcomes remain unverified. Uploaded files have a server-enforced 4 MiB limit; only browser recordings have the two-minute client limit. Deletion does not promise immediate erasure from Moodle trash or existing backups.

Transcription, voice-to-text in arbitrary fields, AI feedback coaching and spoken AI replies are later scope. Public registration and launch work remain in issue #9. The GitHub Actions template now includes the isolated recorder checks, but activation still depends on the existing workflow-permission follow-up #10; local green checks are not a GitHub CI claim.
