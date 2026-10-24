# WB23 and WB10 integrated learner rehearsal

Date: 24 October 2026 (Australia/Sydney). This is synthetic QA in the isolated WB01 integration clone, not a human pilot, production deployment or genuine mailbox-delivery receipt. Work blocks: WB23/R18/AE12, then WB10, under existing issues #4/#9/#22.

## Environment and evidence boundary

Base: `37b1e9fa1ca021316338cd32c052efd1c8ea3241`. The private launch fixture uses loopback 18802; the independent context/feedback fixture uses 18842. Both belong to this clone and use its private socket-only PostgreSQL cluster, fictional accounts and capture-only mail. The dirty live checkout and another thread’s 18812 fixture remain untouched. Raw mail, tokens, screenshots and authenticated artifacts stay private under ignored `trial/` or the private task directory.

## Execution record

WB23’s first source unit passed twenty source assertions and five native captured-mail scenarios. These cover enable/disable idempotence and preservation, confirmation-before-welcome, actual HTML/plain-text content and links, signed-out mobile return/recovery without extra welcome, and removal/re-enrolment/disable semantics. The tests exposed Moodle’s activity-name filter adding a legacy course-page link; the renderer now uses the supported `nolink` class around prose while retaining four explicit URLs.

Public entry now passes 10 browser cases at desktop/390/320px, including natural atlas keyboard traversal and the new objectives summary with JavaScript disabled. The Python metadata suite passes 7 cases, including immutable older editions and the new `.24.3` context. Source checks passed: welcome 20 assertions, context-client races 17, support 6, deployment boundaries 3, delivered-script lifecycle 6 and public integration 2. These are current executions, not inherited WB01 counts.

The initial full rehearsal reached all three completed core activities and deliberately saved work, but a broad test selector matched multiple legitimate My context links added by the welcome and course panel. The test now selects the main action. A separate metadata regression caught changed takeaway wording; the social description again identifies a reviewed, reusable context portfolio. Neither failure is counted as a completed learner rehearsal.

Concurrent local browser runs exposed fixture wall-clock contention: the feedback suite initially passed 8 cases and hit 3 timing failures, while a new direct expiry case passed independently. Browser runs are now serial. The full multi-browser learner test has a bounded 480-second whole-test budget with its existing action/navigation limits. The final current-candidate regression command results are recorded in the external PR validation receipt before merge; initial or interrupted runs are not substituted for that gate.

The three simplification reviews applied one shared-copy improvement: the native course summary reads the canonical rationale. A test-helper extraction was skipped as unnecessary scope; skipping repeated native enrolment updates was also declined because it would change native update timestamps/events. Syntax verification found no errors in 5 PHP, 2 Python, 7 JavaScript and 7 JSON files; no separate project lint/typecheck command exists.

## Remaining external checks

Finlay’s saved-rating/privacy wording approval, actual consenting-recipient welcome receipt, physical device/microphone checks and the human pilot remain separate. The rehearsal cannot establish human comprehension, educational effectiveness, provider browsing availability or GitHub required-check enforcement. Broad registration stays closed; this change does not deploy production or send invitations/marketing.

## Complete WB10 result

The final whole-learner suite passed **2/2 cases in 4.3 minutes**. Learner A completed the six paired ratings, all three core activities, native Lesson resume/reflection, explicit reviewed-context saves, separate private practice, selective clipboard Copy and matching Markdown download, fresh-browser return and an actual captured-link password reset followed by fresh login and retained work. Learner B confirmed/enrolled, skipped the check, saw independent empty progress/context, then edited/saved/reopened its own context without JavaScript at 390px. The native no-JavaScript copy guidance is visible; its readable text is asserted directly because Playwright’s general text matcher skips `noscript` descendants.

Existing IDs and record hashes across nine evidence tables remained unchanged. The fixture returned to closed new registration/enrolment and its previous native welcome setting. Captured welcome count remained one per new learner through return/recovery. No administrator URL or database edit bypassed a broken learner step: operator assistance was limited to isolated fixture setup, captured-mail links and preservation checks.

Desktop and mobile welcome screenshots and the no-JavaScript mobile journey were inspected privately. The context panel resolves correctly for the signed-in learner. Inspection also reproduced a brief misleading initial Sign in prompt before its account response; a focused browser test failed on that text, then passed after changing the unresolved state to Checking your saved context and a neutral Open My context link. Actual signed-out responses still show sign-in guidance. This is the sole added client change after the complete rehearsal; its focused red/green evidence and the final public regression cover that wording transition.

Two complete preparation/journey publication cycles are part of final native validation. Their built-in evidence fingerprints and module manifests must remain unchanged. Exact final execution/ref results belong in the external PR validation receipt, alongside the independent source-review receipts; this document does not claim GitHub CI or a production release.

## Native guest sign-in diagnosis

A later serial feedback run passed 10 cases and failed the guest-to-account login. The captured POST contained the correct synthetic username and an empty password. Pinned Moodle’s asynchronous password-toggle initialization replaced the input after the test filled it. A controlled template-delay probe reproduced the filled-node removal and empty POST twice; the same probe passed twice after using the existing native form-readiness convention before entry. Both anonymous and guest redirect checks then passed together. The test keeps its exact return/allowlist assertions, timeouts and single attempts; Moodle core, credentials and production sign-in code are unchanged. The final complete native suite result belongs in the external validation receipt. Human/password-manager behaviour remains part of the separate browser/pilot checks.

## Independent review follow-up

The VPS Claude CLI review prompted bounded improvements before merge: welcome-marker validation in the public builder, failure-isolated fixture cleanup and clearer canonical-copy, fixture and deployment guidance. The builder rejects missing/duplicate markers before writing outputs; two private-export builds retained all 66 generated file hashes and seven invalid-marker cases failed clearly. Twenty-one isolated checks of the actual cleanup hooks and setup guards confirmed that restoration/removal attempts continue after individual or simultaneous failures while preserving errors. Cleanup retains closed new enrolments and restores the native self-method snapshot. The native welcome and full WB10 suites are rerun after these test changes; exact final refs/results and all accepted/rejected review dispositions are recorded externally on the PR. Source review does not establish production publication or genuine delivery.
