# Live voice feedback — 23 October 2026

Finlay explicitly authorised live installation and enablement after the five-minute minimum flow was implemented in PR #11. The installed plugin files match source commit `4f1d99e`; Moodle registered `local_orientationfeedback` version `2026102300`. Core code/database remained at `2024100715` (Moodle 4.5.15). There were no pending unrelated plugin upgrades before installation.

## Enabled configuration

- Course: existing orientation course, ID 2.
- Reviewer: the existing owner administrator with a valid owner notification address. Finlay's learner-view account remains a learner; use the administrator account for the private inbox.
- Browser recording maximum: five minutes. Server upload allowance: 10 MiB.
- Retention: 90 days, through Moodle's daily scheduled cleanup. The existing cron timer, PHP and web services remain active.
- PHP upload/POST limits are 16M and the application proxy allows 16MB. No PHP/proxy limit change was needed.

[Leave course feedback](https://orientation.finlaymccall.com/local/orientationfeedback/index.php?courseid=2) or use a Moodle activity's **Send private course feedback** footer link to preserve activity context. [The private inbox](https://orientation.finlaymccall.com/local/orientationfeedback/inbox.php) requires the owner administrator. Public help and privacy pages now explain the channel.

## Observed live verification

The browser used the public HTTPS hostname with real TLS validation, temporary synthetic accounts and Chromium's synthetic microphone. Its successful run took 43.8 seconds (58.3 seconds including browser setup/teardown). It verified:

- A real activity footer opens the context-preserving feedback form.
- Record, stop and listen work. No feedback POST occurs before explicit Send.
- The saved receipt retrieves exactly the recorded bytes for the author.
- A separate learner cannot retrieve the audio/receipt or use the reviewer inbox; a logged-out request cannot retrieve the audio.
- A temporary reviewer with only the supported system review capability can find and play the same private recording.
- The mobile-width form fits the viewport.
- A native form without JavaScript accepts and returns the exact five-minute synthetic WAV (9,600,044 bytes), exercising the live PHP/proxy upload path.

Browser submissions deliberately ran with this new plugin's notification provider temporarily disabled to verify that a delivery failure does not lose saved feedback. Normal provider settings were restored. A separate process-local capture check saved a generic Moodle notification and captured its email without feedback text or audio; live SMTP settings were unchanged and no test mail was sent externally. The first capture assertion incorrectly looked for an inbox URL in the plain email; checking its actual generic subject/body confirmed the captured message without resending it.

The first browser attempt closed unexpectedly during page navigation, before submitting feedback. The unchanged feature passed on retry after the harness waited for DOM readiness on the course page. Generic HTTP-client checks of the public notices received 403; Chromium verified both `/help` and `/privacy` returned 200 with the intended feedback sections.

Temporary feedback records/files were removed, three test users suspended, their sessions invalidated and their temporary reviewer role removed. Hash comparison confirmed every pre-existing lesson attempt/answer/grade and completion record observed before the tests was preserved. The feature remains enabled with normal notifications restored. Private test receipts, screenshots, credentials and captured mail stay outside Git.

## Coexistence and remaining checks

The live checkout has newer launch work in progress. Deployment copied only the feedback plugin into Moodle and inserted feedback sections into the current help fragment, its generated/public copies and the current privacy page. It preserved their newer account/recovery wording; no bulk content sync, branch checkout, unrelated commit, account-registration change or service restart was performed. These targeted live content additions must travel with the ongoing launch integration; PR #11 remains the feedback source/integration record.

Physical microphones, speakers, mobile Safari and assistive technologies remain human/device checks. Captured notification mail does not establish external inbox receipt. Use the [local Codex browser-test prompt](../operations/voice-feedback-local-test-prompt.md) for a real-device check; this feature requires no local speech model or transcription API.

To stop new feedback, disable **Enable feedback** in the local plugin settings. Retain the plugin while managing existing private records. See [operations](../operations/voice-feedback.md) for retention and rollback behavior.
