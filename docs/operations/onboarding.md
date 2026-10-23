# Native account onboarding

Broad registration is closed. The implementation supports an exact-address pilot gate and synthetic rehearsal; it is not evidence of genuine mail delivery or permission to open broad enrolment. Finlay accepted the pilot information/support position on 23 October, with retention to be revisited before broader launch. The pilot operating review must still be recorded privately before enabling its gate. Finlay reviews information-use/support/operating wording and representative consenting recipients test confirmation and recovery before opening. See [email and support](email-and-support.md) for the existing transport and exact approval boundary for support replies.

## Additive configuration

Install/upgrade the repository progress plugin first (see [native progress](progress.md)). Its separate `configure-journey.php status|configure|check` command deliberately sets **Your course journey** as the supported default homepage, records rollback settings and refreshes only the known orientation login/menu links. It leaves acquisition and mail configuration intact. Native intended activity destinations retain precedence over this ordinary-login landing. Run from the repository with the pinned Moodle installation configured under ignored `trial/`:

```sh
scripts/php scripts/configure-onboarding.php status
scripts/php scripts/configure-onboarding.php configure-closed
scripts/php scripts/configure-onboarding.php check
```

`status` and `check` are read-only; `check` exits nonzero for an inconsistent state. `configure-closed` enables email authentication alongside existing methods, keeps manual accounts/enrolments, closes new account registration and new self-enrolment, and updates login help. It **keeps the self-enrolment instance enabled**: disabling it would suspend the access of already enrolled learners. Multiple self-enrolment methods cause a refusal, rather than guessing which one to change. Existing self-instance restrictions, roles and welcome send-mode are retained; the welcome text is refreshed with the intended course link and accurate portfolio-saving guidance. A new self-instance uses the student role and no welcome email; native confirmation still provides account access. The tool never resets content or changes completion.

Supported minimums include a 12-character password policy and account lockout after ten failures within 15 minutes (at least a 15-minute lockout). Existing stricter password minima, lower positive failure thresholds, longer windows/durations and an already-enabled indefinite lockout are preserved. Other controls include protected username responses, confirmed email changes and unique account emails. Native signup validation may identify a duplicate username/email; protection of recovery responses does not promise complete account-enumeration prevention. CAPTCHA has not been configured: no invented site keys or claim of bot-proof registration. Review abuse/operating behaviour before opening. Existing domain allow/deny lists are preserved. Status exposes acquisition blockers for live domain restrictions, enrolment keys, cohort/capacity/date/duration restrictions, a hidden course or an unexpected self-enrolment role; opening refuses them rather than clearing deliberate settings. Review and resolve them through Moodle before broad enrolment. The synthetic fixture alone permits its reserved example.test domain list.

The tool does not change SMTP credentials, sendmail configuration, diversion, email queues, privacy agreements or global messaging. It does not rerun seed/prepare-public scripts. Review those settings through Moodle admin; retain secrets only in the private runtime.

## Opening gate and private receipt

Record actual checks under ignored `trial/onboarding-readiness.json`. Keep recipient identities and links in private notes; do not paste confirmation/reset tokens into GitHub. This is the required structure, shown with placeholders rather than completed evidence:

```json
{
  "site": "https://orientation.finlaymccall.com",
  "course_id": 2,
  "synthetic": false,
  "reviewed_by": "Finlay McCall",
  "reviewed_at": "<actual ISO timestamp>",
  "evidence_note": "<private reference to completed checks and remaining limits>",
  "privacy_reviewed": true,
  "support_reviewed": true,
  "operating_reviewed": true,
  "retention_reviewed": true,
  "mail": {
    "recipient_scope": "representative-consenting",
    "confirmation_received": true,
    "confirmation_checked_at": "<actual ISO timestamp>",
    "recovery_received": true,
    "recovery_checked_at": "<actual ISO timestamp>"
  }
}
```

The receipt must match the current site/course and live within that installation's private trial directory. Check the course ID with `status`; do not assume a copied example is correct. Mark review booleans only after actual review. Live broad opening additionally requires `retention_reviewed: true`: revisit and accept the retention arrangement before that release. The pilot acceptance alone does not satisfy this field. The public help/privacy copy is a draft operational account: review the stated contact, handling of AI support drafts, record access/deletion, unresolved retention arrangement and lack of response SLA. Resolve any policy concern before signing this receipt; the script verifies a receipt, not the truth or legal sufficiency of its statements. Check representative consented receipt, spam/app switching, confirmation in another browser, actual password reset, continuing course access, support ownership, scheduled tasks and existing operating guidance. Owner-only historical email delivery does not establish this broader check. Paid Contabo backup provision stays as accepted; no new audit or restore exercise is introduced.

Only after those checks, run:

```sh
scripts/php scripts/configure-onboarding.php open --receipt=/absolute/private/trial/onboarding-readiness.json
scripts/php scripts/configure-onboarding.php check
```

Live opening additionally requires existing encrypted SMTP with no global diversion/no-email setting. Nothing in this command releases queued mail or changes transport. Update the landing/help/privacy registration wording in the same release after observing the open state; static pages cannot infer Moodle settings. Keep registration closed until wording and checks agree. Re-running a mode is safe; `configure-closed` closes acquisition while retaining existing enrolled learners. It also pauses completion of outstanding confirmations through native Moodle, so direct those unconfirmed accounts to Finlay rather than promise immediate self-service confirmation.


## Limited pilot before broad opening

The local plugin defaults to `closed` and extends native signup validation. `pilot` permits only exact private email addresses (1–20; no domains/wildcards), while `open` selects `public` only after the original genuine representative-email/recovery receipt. Native email registration and self-enrolment are enabled in pilot mode so confirmation can actually finish. Status distinguishes `acquisition_mode`, the native registration mechanism and `broad_registration_open`; enabled native email registration alone does not mean broad acquisition is open. The private allowlist is never printed in status or learner errors. Existing unrelated authentication, enrolments and mail settings remain intact.

Keep a private JSON array of controlled/consented addresses under the selected runtime. Keep a separate private pilot review receipt:

```json
{
  "site": "https://orientation.finlaymccall.com",
  "course_id": 2,
  "synthetic": false,
  "pilot_only": true,
  "reviewed_by": "Finlay McCall",
  "reviewed_at": "<actual review timestamp>",
  "evidence_note": "<private actual pilot operating approval reference and limits>",
  "privacy_reviewed": true,
  "support_reviewed": true,
  "operating_reviewed": true,
  "retention_before_broad_launch": true
}
```

The pilot receipt records the accepted limited operating position; it does not assert genuine confirmation/recovery delivery before those checks occur, or approve unresolved broader retention. Only after the test alias works, transport is ready and the actual pilot review is recorded, run:

```sh
scripts/php scripts/configure-onboarding.php pilot --receipt=/absolute/private/trial/pilot-review.json --pilot-emails=/absolute/private/trial/pilot-addresses.json
scripts/php scripts/configure-onboarding.php check --receipt=/absolute/private/trial/pilot-review.json
```

This mode sends no mail itself. A person then attempts actual native signup/confirmation and recovery at an explicitly controlled/consented mailbox. Record actual receipt and course access privately. A dedicated alias routes to a real inbox and must be verified; do not assume plus-addressing or an unconfigured alias works. Broader opening still requires representative consented confirmation/recovery, owner operating review and the retention revisit. `configure-closed` clears pilot acquisition while preserving enrolled access. Test-only `example.test` addresses and synthetic receipts are accepted solely in the guarded localhost fixture.

## Learner routes

Native `/login/signup.php` creates an unconfirmed account and sends a confirmation link. Native confirmation requires email registration to be enabled; a real confirmation link cannot complete while registration remains closed. Prove the full flow in the isolated fixture, then use the exact-address pilot gate below for consenting real-mail checks before broad release. A receipt must never claim a completed native confirmation while the live mechanism was disabled. Moodle denies protected activities until confirmed, and requires self-enrolment in the intended course. Native deep-link login remembers a same-site intended destination. Email signup stores that destination in a native user preference; confirmation restores it even in another browser. Starting from the course URL supports Continue → self-enrolment → course. A native Lesson deep link has a pinned-core POST/enrolment edge case. The repository local plugin now normalises new-account intended orientation activity URLs to its canonical stable gateway using the native `user_created` observer and existing intended-destination preference. Its POST → GET continuation retains the activity through native enrolment without a manual navigation repair. Other courses and off-site URLs are not rewritten. See [native progress](progress.md). Returning enrolled learners use native Lesson deep-link login normally. If registration started directly without an intended activity, the login instructions provide an explicit **Your course journey** link. Once the separate journey landing command has run, ordinary returning login also lands there. Native confirmation accepts only a local redirect parameter. No custom off-site-return handler is introduced.

`/login/forgot_password.php` accepts a username or email. In the pinned Moodle `login/lib.php`, `core_login_validate_forgot_password_data` resends confirmation for an unconfirmed account; confirmed accounts use native password-reset tokens. Protected responses deliberately avoid disclosing whether the account exists. A used confirmation is harmless and offers a course continuation; invalid confirmation gives a Continue route. Confirmation has no separate short expiry in native email auth; unconfirmed accounts can be removed under Moodle's existing cleanup policy. An old link for a removed/unknown account is invalid. Password-reset tokens expire and are single-use. Help directs people to request a fresh link or contact Finlay, without sharing links/passwords.

## Isolated synthetic verification

Prepare the separate fixture with `scripts/prepare-launch-fixture.py`; do not clone the live database or mail credentials. The reproduction/deployment instructions describe starting its server with `scripts/fixture-php`, which sets PHP’s `sendmail_path` to the fixture-only capture. A Moodle `$CFG->sendmailpath` setting is insufficient: native `isMail()` uses PHP’s INI setting. The unchanged onboarding browser suite runs only at `http://127.0.0.1:18802` with `ORIENTATION_TRIAL_DIR` resolving to `trial/launch-fixture`; the suite refuses another target for synthetic receipts. The configuration tool also supports the separately marked, independently cloned 18812 fixture described in [reproduction](../REPRODUCING.md); its exact URL, database and private paths must pass the shared synthetic guard. No live acquisition/transport exception is widened.

```sh
npx playwright test --config playwright.onboarding.config.cjs
```

The suite writes an explicitly synthetic readiness receipt inside the fixture, captures mail only in `trial/launch-fixture/mail`, checks configuration preservation/idempotence, signup, denied unconfirmed access, resend, fresh-browser confirmation, self-enrolment, duplicate accounts, repeated/invalid confirmation, deep-link login, fresh-context recovery, consumed/expired recovery links and closing while preserving enrolled access. It changes no live SMTP setting. Tokens, capture files and account data stay ignored; test artifacts also stay under the fixture. These checks prove native functional behaviour only, never real mail delivery, human participation or owner approval.
