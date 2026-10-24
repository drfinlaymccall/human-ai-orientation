# WB01 integration baseline — 24 October 2026

Tracking: #22 under #20 / HOC #19. Owner: integrating agent, with Finlay retaining release decisions. All dates Australia/Sydney.

## Need and resulting candidate

The live demo had My context and compact feedback while source and native tests lived on separate PR branches. WB01 reconciles #11/#17/#18/#30 into the public-launch branch without switching or publishing the dirty live checkout. The candidate carries the corresponding context, feedback, progress, onboarding, Tips and portable suites. Original stable activity IDs and completion semantics remain unchanged; no atlas/self-assessment work is included.

Shared builders compose My context and feedback enhancements, preserving the newer course text and writing-field availability fixes. The old progress assertion requiring browser-only portfolio storage now checks deliberate My context saving. Synthetic provisioning explicitly requests UTF-8/template0 after a fresh SQL_ASCII cluster exposed Moodle's encoding requirement. No live database/configuration/SMTP was copied. A separate WB01 PostgreSQL cluster uses a private socket and no TCP listener; fixture mail is captured.

## Research handoffs

WB15 adds the [official-source ledger](../research/local-voice-transcription-2026-10-24.md) and [draft guide](../research/local-voice-transcription-draft-guide.md). They identify the official FluidVoice distribution, hardware/model/telemetry limits and a separate Windows candidate. Physical Mac/Windows checks and in-course guidance remain pending (#28).

WB18 adds the [provider source review](../research/free-assistant-evaluation/provider-source-review.md), [protocol](../research/free-assistant-evaluation/evaluation-protocol.md), exact prompts, schema, fictional scoring fixture and 80 not-tested records. No consumer sessions were run (#12). Existing owner observations and historical public context releases remain intact.

## Verification status

Observed checks: support 6; metadata 6 unit + 2 browser; portable portfolio 8; course entry 5; public Tips 7; isolated recorder/launcher 21; public integration 2; deterministic context client 9; native progress 8; native onboarding 9. Repeated generation has no content/public drift, and changed PHP/JavaScript/Python syntax and local documentation links were checked.

The first native context run passed 11 of 13 and hit navigation/time-budget failures in two scenarios. The first native Tips run also timed out during login. These are not recorded as passes: targeted rechecks use an explicit 180-second test budget, 45-second action budget and 60-second navigation budget on this busy synthetic PHP server, with the same behavior assertions. Feedback backend/privacy checks passed; the first browser run passed 5 of 6 and exposed the combined seed's hidden guest-login button before the guest-denial step could run. The guarded synthetic feedback provisioner now explicitly exposes that route for the denial check; it does not change production configuration.

Review also corrected saved-version handling: a failed/superseded deliberate read cannot offer cached content as fresh, and a successful saved-version load establishes a clean local baseline while imports/examples remain drafts. Three deterministic cases failed before these fixes and passed afterward; a native recovery scenario checks the actual interface. The progress suite distinguishes the main Continue action from the new panel link and verifies their destinations agree.

Two integration regressions were caught and fixed before merge: the newer privacy page had lost the recording notice, and the reading-preview builder had lost the explicit head/body normalization required for the feedback decorator. New publication checks failed first and passed after restoring both. Writing help now correctly scopes the no-recording statement to its text boxes, since the separate feedback recorder exists.

The exact final-candidate recheck results, base/merge-base/head, independent Claude CLI receipt and every finding disposition are recorded externally on [PR #31](https://github.com/drfinlaymccall/human-ai-orientation/pull/31). This keeps the review receipt outside the commit it identifies. Historical runs and a successful individual review partition do not approve a later candidate.

## Remaining boundaries

WB01 does not close #22: WB10 whole-learner rehearsal remains. Draft #14, representative mail/retention checks, human pilot, physical microphones/devices, assistive technology and public launch decisions remain separate. This source integration does not deploy, enable public registration, send invitations/support replies or alter learner records. GitHub Actions activation/required protection is not claimed; #10 and #23 retain their respective follow-ups.
