# Compact feedback panel — 24 October 2026

Finlay found the working feedback form unattractive and difficult to find from the main page and journey. The revised entry point is a persistent bottom-right **Give feedback** button. It opens a compact panel on the current page; its full-page link remains usable without JavaScript. The form leads with Record, followed by an optional note and explicit Send. Upload and heading controls expand on request.

The panel retains its loaded draft and recording across close/reopen on that page. Closing stops capture, releases microphone tracks and pauses playback, including saved-receipt audio. Navigation away still discards an unsent in-memory draft. The source label or Moodle activity ID identifies the originating page. Signed-out visitors get a small sign-in card; a plugin endpoint constructs only allowlisted internal destinations and uses Moodle's session login return, then the public page reopens the panel. It does not accept arbitrary return URLs.

The five-minute recording limit, 10 MiB upload cap, explicit Send, private author/reviewer access, deduplication, notification behavior and retention remain as recorded in the [voice-feedback operations guide](../operations/voice-feedback.md). No speech model or transcription provider is required.

## Source, review and verification

One canonical launcher script/style lives in `moodle/local/orientationfeedback`; public builds distribute it and add one entry point to each of the 13 top-level public HTML pages. Individual renderers retain the launcher and repeated builds are stable. The older lesson preview now has explicit optional head/body tags so it receives the same entry point.

The simplification pass found no worthwhile structural changes and caught a missing builder import before publication. Scoped review covered correctness, standards, tests, maintainability, security, reliability, adversarial composition and frontend races. It found and corrected two issues: the initial core login query did not establish a normal Moodle return destination, and saved-receipt playback lacked close cleanup. The receipt defect was reproduced in a failing real Moodle test, then passed after correction and Moodle asset-cache refresh. Review found no remaining actionable defects; the external cross-model route was not used because it could not preserve the required compact-only/private-runtime exclusions.

Recorded synthetic checks before live verification:

- The required public check passed: stable regenerated content, six support checks, eight portfolio checks and all 21 recorder/launcher browser checks, including trusted frame-only sign-in messages.
- The backend/privacy integration passed, including five-minute exact WAV storage and unchanged historic lesson/completion fingerprints.
- All five existing/compact Moodle browser flows passed; added focused receipt-close and session sign-in-return checks passed after correction.
- Six support checks and eight public portfolio checks passed. JavaScript/Python/PHP syntax checks and generated-page launcher counts passed.

These are synthetic software checks, not learner observations or physical microphone evidence. The final complete Moodle suite passed all six journeys in 1.9 minutes, including the corrected receipt-close and normal sign-in return flows.

## Live publication and observed checks

The compact panel is installed and enabled on the existing live course. The canonical source in the live checkout and installed plugin match this branch. Publication added the launcher to current public pages and patched their current build entry points; it did not replace pages or renderers with this branch’s older baseline. Existing homepage, journey, portfolio and private-workspace work was preserved. Moodle caches were purged so the new hook and recorder code were served. No schema upgrade, core edit, branch checkout or service restart was needed.

The public HTTPS Chromium journey passed in 49.1 seconds (1.1 minutes including browser setup). It checked homepage/journey/preview guest entry, the full sign-in → journey → reopened-panel round trip, a real synthetic recording from the homepage, microphone release and retained draft on close, no feedback POST before Send, exact saved audio bytes, receipt playback pause on close, mobile panel bounds, Moodle activity context, peer denial and exact reviewer playback. Screenshots were visually inspected and remain private.

A successful generic notification was captured with the process-local mail transport; SMTP settings were unchanged. Test feedback and audio were removed, three temporary accounts suspended and sessions invalidated, their temporary reviewer role removed, and normal notifications restored. Fingerprints confirmed all pre-existing lesson and completion evidence remained intact. The database, PHP, web and cron services are active.

Physical microphones/speakers, Safari/iOS, assistive technology and external inbox receipt remain device/operator checks. A failed iframe load has the visible full-page fallback; drafts persist only while this page stays loaded. The optional local transcription setup is a [queued request](../requests/2026-10-24-local-voice-transcription.md), not a delivered model integration.
