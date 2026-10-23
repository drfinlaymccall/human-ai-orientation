# Local browser check: course voice feedback

The server-side browser test uses synthetic microphone input. Use this prompt in local Codex to check your real browser, microphone and speakers. No local speech model or transcription API is needed: the feature records and plays audio.

Copy the following prompt:

```text
Test the live Human AI Orientation voice-feedback feature at
https://orientation.finlaymccall.com/local/orientationfeedback/index.php?courseid=2
using the browser on this computer. Keep this task limited to voice feedback.

I will sign in and handle any account credentials myself. Use a learner account
for submission. Ask me to handle the microphone permission prompt and speak the
clearly synthetic phrase: "Synthetic microphone test. The example helped me,
but I would like the instructions to explain the next step more clearly."

Check:
1. From a signed-in Moodle activity, find "Send private course feedback" and
   confirm the feedback form identifies that activity. The direct link above
   is an alternative entry point.
2. Recording starts only after Record and microphone permission. Confirm the
   form states a five-minute recording maximum and 10 MiB upload allowance.
3. Record about ten seconds, stop and listen through my actual speakers or
   headphones. Nothing should be submitted yet. Check Discard and Record again.
4. Send one clearly labelled synthetic test recording. Confirm "Feedback saved"
   and replay it from the saved receipt. A receipt confirms storage, not email
   delivery. Do not assume a notification email arrived.
5. Let me switch to my owner administrator account, then open
   https://orientation.finlaymccall.com/local/orientationfeedback/inbox.php
   and find/play only the synthetic test submission. Ordinary learner accounts
   should not have access to the reviewer inbox.
6. Check the controls at a narrow/mobile viewport and with keyboard navigation.
   Report the actual browser/device, what passed, and any problem with steps to
   reproduce it. Mark anything you could not verify as untested.

Keep credentials, recordings and screenshots private. Do not inspect other
learners' feedback, change site settings or course content, install software,
merge PRs, or run destructive tests. Do not run the localhost fixture integration
scripts against the live site or add a synthetic-site marker to live config.
Stop and report a permission/storage error rather than bypassing it.
```

Use [the private inbox](https://orientation.finlaymccall.com/local/orientationfeedback/inbox.php) while signed in as the owner administrator. Finlay's learner-view account remains a learner; inbox access is intentionally restricted. A human physical-device check complements the synthetic server checks and does not establish learning outcomes.
