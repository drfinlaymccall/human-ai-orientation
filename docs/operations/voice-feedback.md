# Private voice feedback to Finlay

Stage one adds an optional signed-in feedback channel. Learners can record up to five minutes in the browser, listen, discard/re-record and explicitly send; they can also type feedback or upload an audio file. Feedback retains the course/activity and an optional heading. It does not transcribe, contact an AI provider, save portfolio fields or change course completion.

## Install and enable

The source plugin is `moodle/local/orientationfeedback`. Moodle core stays pinned and unmodified. Install this plugin before publishing its new public help link. These are operator instructions, not a claim that the live site has been changed.

From the repository root, inspect the destination first:

```bash
python3 scripts/install-feedback.py --moodle-root=trial/moodle
```

Copy explicitly, then register the plugin through Moodle's admin Notifications page or the CLI:

```bash
python3 scripts/install-feedback.py --moodle-root=trial/moodle --apply
scripts/php trial/moodle/admin/cli/upgrade.php --non-interactive
```

For another installation, substitute its Moodle directory and PHP runtime. Ensure PHP `upload_max_filesize` is at least `10M`, `post_max_size` is larger (for example `16M`), and any web-server request-body limit allows the multipart request. The copy command does not upgrade Moodle, configure mail or enable feedback. It refuses symlinked plugin destinations. Re-run the copy when shipping updated plugin files; purge Moodle caches after updating strings/hooks.

In **Site administration → Plugins → Local plugins → Private course feedback**:

1. Set **Feedback course ID** to the existing orientation course (the number in its course URL, not the site home).
2. Set **Reviewer user ID** to Finlay's active Moodle account. It must have `local/orientationfeedback:review` at system context. Site administrators already have access; ordinary teachers do not.
3. Review **Retention in days**: default 90, with daily cleanup through Moodle cron. Zero disables automatic cleanup. State any changed retention on the privacy page before accepting feedback.
4. Enable feedback. Verify the selected account's Moodle notification preferences and the site's existing mail transport. No mail credentials belong in this repository.

Use a synthetic enrolled account and fictional feedback for the install check. Confirm its course activity footer links to the feedback form; record, listen, send and replay from the receipt. Open **Private feedback inbox** from the plugin settings and verify the notification. Use another learner account to check that neither receipt nor recording is accessible. Check Moodle's scheduled-task page for the daily cleanup task.

Public readers reach the signed-in form through `/help`. They can keep using email without an account. Enrolment is required to submit. A feedback link added by the plugin does not change the current activity's completion or the learner's saved answers.

## Learner behavior and limits

Microphone access requires HTTPS (localhost is permitted for tests), a supporting browser and browser/OS permission. Permission is requested on Record, not page load. Nothing is uploaded until Send. The microphone is released on stop, discard, failure or leaving the page. Recordings stay in page memory until sent or discarded; they are not written to local/session storage. Failed enhanced requests retain the recording and the same submission token for a safe retry. Navigating away or reloading may lose an unsent recording.

Text-only and file-upload submissions work without JavaScript. Uploaded files are verified by their content MIME type and limited to 10 MiB. Supported media containers are WebM, Ogg, WAV, MP3, M4A/MP4 and FLAC. Live recordings stop at 300 seconds in the browser; uploaded file duration is not verified on the server. This is an upload-size control, not proof of spoken duration or the content of a recording.

At least text or audio is required. Text is limited to 5,000 characters, optional heading to 160. Each learner can send five messages per hour. Repeating an existing submission token returns the existing receipt without using another allowance or sending another notification.

## Review and notifications

The private inbox is `/local/orientationfeedback/inbox.php`. Access requires the system-level review capability. Learners can replay their own submissions; peers and ordinary teachers cannot read them. Recordings use Moodle File API storage and a permission-checked `pluginfile.php` route rather than public asset URLs. Database/filesystem backups must therefore be treated like other private Moodle learner records.

The receipt confirms that feedback is stored. It does not assert that an email arrived. A generic Moodle notification contains an inbox link and no author name, feedback text or audio attachment. Notification preferences and the site's existing message processors determine delivery. States shown in the inbox are:

- `sent`: Moodle accepted the notification; this is not an external inbox receipt.
- `failed`: the message API failed or the provider was disabled; the feedback remains saved.
- `pending` / `attempted`: the operation may have been interrupted before or during the single notification attempt.

Open the inbox directly if delivery is uncertain. Notifications are attempted once; resubmitting does not retry delivery. This avoids duplicate mail after an ambiguous failure. Existing support replies remain a separate workflow: an agent must not approve or send a real reply on Finlay's behalf.

## Privacy, retention and rollback

The privacy provider exports feedback metadata and exact audio through Moodle's privacy tools. Individual, bulk-user and whole-context deletion remove both feedback rows and recordings. Deleting a course also removes its feedback immediately, even when timed retention is disabled. The daily cleanup deletes feedback older than the configured retention. File bytes may remain in Moodle trash and backups according to those systems' separate deletion schedules; plugin deletion is not a promise of immediate backup erasure.

Disable **Enable feedback** to stop new submissions and course footer links. Existing feedback remains available to authorised reviewers and authors. Keep the plugin installed while reviewing/exporting records; simply removing its directory would also remove its access/privacy handlers. Use Moodle's normal uninstall only after deciding how to handle retained records. No changes to core, existing activities or historic completion need reverting.

## Verification

`tests/feedback-integration.php` is an executable synthetic integration check. It refuses to write unless the supplied Moodle config explicitly sets `$CFG->local_orientationfeedback_synthetic = true` and uses a localhost URL. Never add that marker to production. Supply a separately provisioned database, dataroot and mail capture transport. The script creates fictional accounts/course/activity evidence and exercises real Moodle storage, notifications, privacy archive export/deletion and retention. It leaves its generated browser manifest under ignored `trial/`.

```bash
scripts/php tests/feedback-integration.php --config=/absolute/path/to/synthetic/moodle/config.php
```

Run `npm run test:feedback` for isolated recorder checks and `npm run test:feedback:moodle` after provisioning and serving that synthetic Moodle site. The isolated recorder browser suite is separate from the real Moodle suite. See the feature release record for commands and observed evidence. Synthetic microphone input verifies browser behavior; it is not a human pilot, a physical-phone microphone check or confirmation of external email receipt.
