# WB01 integration baseline — 24 October 2026

Tracking: #22 under #20 / HOC #19. Owner: integrating agent, with Finlay retaining release decisions. All dates Australia/Sydney.

## Need and resulting candidate

The live demo had My context and compact feedback while source and native tests lived on separate PR branches. WB01 reconciles #11/#17/#18/#30 into the public-launch branch without switching or publishing the dirty live checkout. The candidate carries the corresponding context, feedback, progress, onboarding, Tips and portable suites. Original stable activity IDs and completion semantics remain unchanged. The later concurrent-base reconciliation below preserves the independently delivered journey/starting-point source.

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

## Reconciliation after the concurrent base advance

During review the real `feat/public-launch` branch advanced from `6c003289` to `d46470bd`, while cached PR metadata still named the old base. The earlier `4af607c` results and Claude partitions therefore remain historical. GitHub's branch-ref read, a fresh fetch and the new source history established the actual base; WB01 merged it instead of overwriting the other work.

The joined candidate preserves the illustrated private journey, observational session endpoint, native optional starting-point implementation and its existing exposure gates, alongside My context and compact feedback. Native navigation/privacy/help, shared builders and corresponding tests are reconciled. Plugin version `2026102402` runs an idempotent context-schema upgrade from either prior source line. Public context draft `2026-10-24.2` describes the joined behavior; committed editions `2026-10-23.2` and `2026-10-24.1` retain their original bytes. Prepared exact-path server/edge changes are source only and have not been applied.

**Observed synthetic upgrade proof:** the launch fixture had zero saved context rows. A clearly labelled journey-only `2401`/missing-context-table emulation upgraded to `2402`, created the table and preserved native evidence/activity identities. The context fixture's ordinary `2303`→`2402` upgrade preserved all seven synthetic context rows, ten synthetic feedback rows, native evidence and identities. Supported content sync preserved records; new starting-point publication was verified hidden/disabled with 12 slots and no grade item before explicit fixture-only enablement. These are synthetic proof scenarios, not deployed history or permission to expose the live check.

The merged public build/drift gate passed: support 6, deployment-boundary 3, delivered journey-script lifecycle 6, entry 9, metadata 7 Python + 2 browser, portfolio 8, publication integration 2 and recorder/launcher 21. Four new deadline cases first failed and then passed with all 13 deterministic context-client checks. One 30-second deadline covers POST and response decoding, restores Save and describes a timeout as unconfirmed. Storage-failure recovery now regenerates Copy/Markdown from current edits with JavaScript; its no-JavaScript view explicitly keeps an immutable recoverable snapshot and valid retry metadata. Expanded native recovery checks and the complete upgraded native suites are being verified; exact final results and fresh-base Claude review remain external on PR31.

The prior `18812`-only session-expiry test is now exercised on WB01's own existing guarded `18802` fixture, retaining exact identity/non-symlink checks; first-task mutations resolve this fixture's manifest ID. No other chat's fixture was used. Public drafting tests permit only bodyless state/context GET reads, still rejecting submission of editable text. The deployment refusal test models a release genuinely lacking the installed schema rather than incorrectly rejecting the now-integrated schema.

A fresh frontend review also reproduced misleading saved status in the brief/private-practice widgets after later edits. Four delayed/completed-save cases failed first and then passed after capturing the submitted text and marking later edits unsaved. The deterministic context suite now passes all 17 cases.


## Feedback ownership and ambiguous retries

A later adversarial source review identified two additional blocking cases for the joined candidate. A cached panel could retain the earlier account's draft/receipt after another tab changed sign-in. An edited retry could return the older committed feedback because deduplication checked only its token. WB01 addresses these with independent bounded patches and regressions: current-account revalidation before displaying retained private content, disposal on mismatch/unverifiable identity, and normalized request/audio-content comparison before reusing an existing receipt. A different payload must retain the current draft and explain the conflict instead of discarding it. The operations guide records those semantics. Exact final patch verification and independent rereview belong on PR31; earlier clean partitions do not cover later fixes.

On the reconciled synthetic course, native starting-point 8, progress/session 16, onboarding 10 and native Tips 2 passed. All 15 distinct context scenarios passed across the main run and the corrected no-JavaScript recovery recheck. Backend/privacy/retention checks and all six existing feedback browser flows passed before the additional feedback fixes; the changed feedback paths require their own final recheck. No physical microphone, real learner or consumer-assistant result is inferred.


The full actual-source Claude pass also found PHP truthiness dropping a legitimate `0` from context Markdown and rejecting a note titled `0`, plus site-level `require_login` admitting an existing guest at the feedback sign-in gateway. Explicit empty-string checks preserve zero values; a guest goes to the native login form while retaining the allowlisted return destination. Focused synthetic regressions demonstrate the failures and check note/portfolio/private-practice Copy/Markdown and the guest sign-in return. The new real lost-response test scopes its status assertion to the recorder, since native Moodle also renders an unrelated status region. This corrects the test selector; it does not relax the save/conflict/audio assertions.
