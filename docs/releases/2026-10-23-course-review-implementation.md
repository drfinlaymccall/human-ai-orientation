# Course-review implementation — 23 October 2026

This records implementation against the [single forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md) and [owner-feedback log](../reviews/course-review.md). It supplements the earlier launch receipt; earlier test results are not evidence for the new features.

## Environment and release boundary

Work started from `8f580c8` on a preview branch, `feat/course-journey`, because the ordinary checkout's public files are served directly in production. The app's worktree tool could not identify the nested repository; a Git worktree under ignored `.worktrees/course-journey` supplies the preview instead. This is a practical exception to the earlier preference for editing the demo in place: the current request calls for a production handoff after verification. The live checkout and other threads' uncommitted changes remain untouched.

The preview reuses installed browser/PHP dependencies and only the isolated synthetic native fixture. Its trial directory has no live Moodle configuration. No real mail, public-registration opening, human invitation, support reply or LinkedIn publication is part of these checks. Production deployment remains a separate next step.

## U1 — public entry and atlas

The home is a concise Human AI Orientation splash with one Explore your course action. `/journey` owns the full illustrated atlas. Details/action sit beside it on desktop and immediately after the selected place on narrow screens. All descriptions and links remain readable without JavaScript. Shared generated atlas HTML and scoped CSS/JS are ready for the native renderer.

The public account client checks a fixed same-origin endpoint and changes the home action/header for known session state. Pending, failed, malformed and no-JavaScript states retain an honest account link and public reading. It clears presentation before restoration and revalidates on return. Real endpoint/privacy/cache behaviour is U3 scope; U1 uses mocked responses for that client contract.

**Evidence:** updated existing entry tests first. The old headline and below-map desktop geometry failed against the new expectations before implementation. Worker final focused run: eight passed; orchestrator authoritative `npm run test:entry`: **8 passed (28.0 seconds)** on localhost 18801. Build generation is repeatable; whitespace checks pass. Inspected screenshots of home and atlas at desktop, 390px and 320px; no horizontal overflow, selected title/action remain discoverable and keyboard/no-JavaScript routes pass. These are synthetic browser results, not human usability or learning evidence.

## Remaining execution

Native personal atlas/account endpoint/navigation, the optional six-pair Quiz and recommendations, metadata alignment and complete synthetic learner rehearsal remain in this implementation batch. Human pilot, new saved-rating wording review, representative mail and broader launch/retention decisions remain release gates. This record will gain actual results as those units complete.
