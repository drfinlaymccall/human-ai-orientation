# WB01 integration baseline — 24 October 2026

Tracking: #22 under #20 / HOC #19. Owner: integrating agent, with Finlay retaining release decisions. All dates Australia/Sydney.

## Need and resulting candidate

The live demo had My context and compact feedback while source and native tests lived on separate PR branches. WB01 reconciles #11/#17/#18/#30 into the public-launch branch without switching or publishing the dirty live checkout. The candidate carries the corresponding context, feedback, progress, onboarding, Tips and portable suites. Original stable activity IDs and completion semantics remain unchanged; no atlas/self-assessment work is included.

Shared builders compose My context and feedback enhancements, preserving the newer course text and writing-field availability fixes. The old progress assertion requiring browser-only portfolio storage now checks deliberate My context saving. Synthetic provisioning explicitly requests UTF-8/template0 after a fresh SQL_ASCII cluster exposed Moodle's encoding requirement. No live database/configuration/SMTP was copied. A separate WB01 PostgreSQL cluster uses a private socket and no TCP listener; fixture mail is captured.

## Research handoffs

WB15 adds the [official-source ledger](../research/local-voice-transcription-2026-10-24.md) and [draft guide](../research/local-voice-transcription-draft-guide.md). They identify the official FluidVoice distribution, hardware/model/telemetry limits and a separate Windows candidate. Physical Mac/Windows checks and in-course guidance remain pending (#28).

WB18 adds the [provider source review](../research/free-assistant-evaluation/provider-source-review.md), [protocol](../research/free-assistant-evaluation/evaluation-protocol.md), exact prompts, schema, fictional scoring fixture and 80 not-tested records. No consumer sessions were run (#12). Existing owner observations and historical public context releases remain intact.

## Verification status

Integration verification is in progress. Support (6) and metadata (6 unit + 2 browser) passed. A portfolio server-port collision was resolved using the existing configurable port, without reusing the occupied service. Fresh fixture installation initially stopped before tables were created because the dedicated cluster defaulted to SQL_ASCII; only verified-empty synthetic databases are being recreated as UTF-8. Final checks and independent Claude receipt are recorded externally on the candidate PR before merge.

## Remaining boundaries

WB01 does not close #22: WB10 whole-learner rehearsal remains. Draft #14, representative mail/retention checks, human pilot, physical microphones/devices, assistive technology and public launch decisions remain separate. This source integration does not deploy, enable public registration, send invitations/support replies or alter learner records. GitHub Actions activation/required protection is not claimed; #10 and #23 retain their respective follow-ups.
