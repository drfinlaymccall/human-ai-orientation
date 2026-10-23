# Email, recovery and reviewed support

## Verified configuration

Course/support address: **hi@finlaymccall.com**. Incoming mail uses the existing Cloudflare forwarding route; outgoing Moodle mail uses Gmail SMTP with TLS on port 587 and a dedicated Google app password entered directly by Finlay in Moodle admin. The full Gmail account name and password remain in Moodle's private database. They are not recorded here.

On 13 October 2026, Gmail accepted the single owner-address test “Human AI Orientation — course email test”. Finlay then confirmed **“Received, with the intended sender.”** This establishes delivery to that address, not universal inbox placement. The trial diversion was subsequently removed, support/no-reply addresses set, and the native password-reset route restored. Public registration remains disabled. SMTP settings are at `/admin/settings.php?section=outgoingmailconfig` for an authorised administrator.

`scripts/php scripts/configure-mail.php status` reports booleans only. `activate` requires encrypted SMTP credentials and refuses queued email before replacing the one private diversion setting through a checked, restrictive temporary file and atomic rename. Do not rerun initial `prepare-public.php` against the released course: it represents the original one-lesson state. Keep app passwords out of chat, commands, screenshots and Git. Rotate through Google and Moodle if revoked; Google's account password changes may revoke app passwords.

## Learner route

[Help](https://orientation.finlaymccall.com/help) provides the course address, a short request guide, portfolio restore guidance and native password recovery. Requests should describe the step, expected result and what was tried, without credentials or a portfolio backup. Existing accounts need a real, accurate email address to receive recovery; synthetic `example.test` accounts deliberately cannot receive live email. No guaranteed support turnaround is advertised during the pilot.

## Operator-assisted support

This is a private CLI queue, with manual inbox handling and agent-assisted drafting. It is not an unattended inbox integration. Finlay receives the email, selects the minimum relevant text for drafting, and can honour a human-only request. The request, draft and approval files stay under ignored `trial/support/`; do not publish them.

1. Prepare a private JSON file containing `recipient`, `subject` and plain-text `body`. The body is a draft responding to the learner's actual request; never invent account access or claim an action was completed without evidence.
2. Run `python3 scripts/support.py draft trial/support/request-draft.json`. This creates an immutable identified draft. A replacement reply gets a new draft.
3. Run `python3 scripts/support.py review ID` privately. Finlay reviews the exact recipient, subject and body. The command also prints their digest.
4. **Finlay approves**, using `python3 scripts/support.py approve ID --digest DIGEST --approved-by-finlay`. An agent must not run this for real support without Finlay's explicit approval of that exact reply and recipient.
5. Run `python3 scripts/support.py send ID`. A lock serialises dispatch. The digest must match; changed or unapproved drafts cannot send. A successful SMTP handoff becomes `accepted-by-mail-server`, not “received”. A failed/uncertain handoff stays `delivery-uncertain` and requires private operator investigation; it cannot automatically resend.

The flag records an operator action; it does not cryptographically authenticate Finlay. The trusted operating-system account can edit files and invoke the private PHP transport directly. This is a practical approval workflow for a single-owner pilot, not a multi-user permissions system. Finlay's explicit approval remains the governing boundary.

For rehearsals, pass `--synthetic` to `draft`: dispatch captures locally and never contacts SMTP. Synthetic approval is labelled as a test. `npm run test:support` checks unapproved dispatch, changed recipient/subject/body/transport, stale approval, one-time capture, uncertain delivery and header/path rejection. No real learner messages were sent during these tests.

## Remaining operating work

For the demo baseline, Finlay accepts his owner-reported Contabo whole-server backup provision; account settings and whole-server recovery remain unverified, and no backup audit or restore exercise is required in this batch. Before broad registration: finish verified onboarding, support capacity/retention decisions, pilot feedback and a proportionate operating review. Do not enable bulk reminders by enabling SMTP; reminders and consent/frequency controls remain future work. No automatic agent reply or inbox monitor is configured.
