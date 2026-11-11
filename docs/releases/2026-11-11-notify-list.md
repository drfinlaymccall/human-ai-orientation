# Notify list: "tell me when Unit 2 is ready" — 11 November 2026

Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Need

On 11 November Finlay kept the Unit 2 early reading and asked for "a notify me when unit 2 is ready button" linked "to a system to do exactly that". Offered an email link as the quick version, he replied: "Yeah, build a sign-up list, and it might be useful for other things as well."

## Decision

- Keep the list in the orientation plugin, in its own table, not linked to accounts. A visitor needs no account.
- One list with named topics, so it can serve later uses. Only `unit-2` exists now.
- **The system sends no mail.** No confirmation email is sent at sign-up, so the form cannot be used to send mail to someone else's address. Finlay downloads the addresses and sends the one message himself. Each address has its own removal link for him to include.
- The form is plain HTML and works without JavaScript. The endpoint keeps no session and sets no cookie.
- Open-form protections that need no extra personal data: a hidden field for automated form-fillers, a site-wide limit of 60 new addresses an hour, and the same answer whether or not the address was already listed. No IP address is stored in the table.

## Change

- Plugin `local_orientation` `2026111100` (release 1.4.0):
  - new table `local_orientation_notify` (email, topic, token, date), created by an additive upgrade step;
  - `classes/notify.php`, `notify.php` (public form target and removal link), `notify-list.php` (site administrators: counts and a CSV download);
  - the table is described in the plugin's privacy metadata.
- `/agent-basics`: a short section with the form and a collection notice.
- `/privacy`: a table row, a paragraph (`#updates`), a retention line, and one sentence after "We do not send marketing email".
- `public/assets/site.css`: styles for the form.
- Records: [how it works](../operations/notify-list.md), the [compliance record](../operations/privacy-compliance.md), readiness, `CONTROL.md`, Finlay's list.
- No existing table, module, lesson page, answer, attempt or completion rule changed.

## Verification

Results for the merged head are on the pull request and on #9. Planned checks:

- Synthetic fixture (port 18802, captured mail, fictional addresses): `npm run test:notify`, plus the existing progress and starting-point suites after the upgrade.
- Public checks: `npm run check:public` and the Python tests.
- Live: structural snapshots before and after the upgrade must be identical apart from the plugin version and the new empty table. Checks that store nothing: bad input refused, an unknown removal link, no session cookie, the list page closed to signed-out visitors.
- **Correction, 11 November:** this record first listed a synthetic sign-up and removal on the live site. That was not done and will not be: account and native tests run only on the synthetic fixture. The results are on [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9#issuecomment-6785921920).

## Remaining questions

- **Finlay has not read the form notice or the policy wording.** He reads them before the Stage A switch.
- **Retention is manual.** The policy promises deletion within 24 months; no task does it.
- The removal link must be pasted into each message by hand. A later change could prepare the messages for him; it must still not send without his approval.
- Moodle's privacy export and deletion do not cover these rows.
- Someone can type another person's address. That person gets one email with a removal link.
- Not legal advice. This is new collection of personal information from people without accounts; it should be in the lawyer's review recommended before Stage B.
