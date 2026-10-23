# Course-review implementation — 23 October 2026

This records implementation against the [single forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md) and [owner-feedback log](../reviews/course-review.md). It supplements the earlier launch receipt; earlier test results are not evidence for the new features.

## Environment and release boundary

Work started from `8f580c8` on a preview branch, `feat/course-journey`, because the ordinary checkout's public files are served directly in production. The app's worktree tool could not identify the nested repository; a Git worktree under ignored `.worktrees/course-journey` supplies the preview instead. This is a practical exception to the earlier preference for editing the demo in place: the current request calls for a production handoff after verification. The live checkout and other threads' uncommitted changes remain untouched.

The preview reuses installed browser/PHP dependencies and only the isolated synthetic native fixture. Its trial directory has no live Moodle configuration. No real mail, public-registration opening, human invitation, support reply or LinkedIn publication is part of these checks. Production deployment remains a separate next step.

## U1 — public entry and atlas

The home is a concise Human AI Orientation splash with one Explore your course action. `/journey` owns the full illustrated atlas. Details/action sit beside it on desktop and immediately after the selected place on narrow screens. All descriptions and links remain readable without JavaScript. Shared generated atlas HTML and scoped CSS/JS are ready for the native renderer.

The public account client checks a fixed same-origin endpoint and changes the home action/header for known session state. Pending, failed, malformed and no-JavaScript states retain an honest account link and public reading. It clears presentation before restoration and revalidates on return. Real endpoint/privacy/cache behaviour is U3 scope; U1 uses mocked responses for that client contract.

**Evidence:** updated existing entry tests first. The old headline and below-map desktop geometry failed against the new expectations before implementation. Worker final focused run: eight passed; orchestrator authoritative `npm run test:entry`: **8 passed (28.0 seconds)** on localhost 18801. Build generation is repeatable; whitespace checks pass. Inspected screenshots of home and atlas at desktop, 390px and 320px; no horizontal overflow, selected title/action remain discoverable and keyboard/no-JavaScript routes pass. These are synthetic browser results, not human usability or learning evidence.

## U3 — private journey and native navigation

Implemented the shared illustrated atlas with current-user native completion, Continue, retained Lesson resume, per-user visibility and support links. Ordinary login uses the supported homepage hook/configuration; explicit intended destinations retain precedence. Ordinary orientation learners keep journey, Help and account controls; staff and learners in other courses retain native navigation. The duplicate native course-index drawer is suppressed on the journey page only after a mobile resize exposed an overlay. The session endpoint is observational, private/no-store and returns only boolean account state plus the fixed journey URL. Private journey content clears on leaving/backgrounding and revalidates on return.

The shared 18802 fixture was in use by another work stream. A guarded synthetic-only clone now has a separate database, private data, capture transport, report and preview server on 18812. No live database or settings were copied. The clone reinstalls repository-owned ungraded Lesson language strings; omitting those strings initially caused a fixture-fidelity failure at the end of the Lesson. The helper now includes them. The original fixture/server remains untouched.

**Verification in progress:** proof-first missing-heading failure established; seven native scenarios passed before the missing language customisation stopped the first complete rehearsal. The corrected final thirteen-test run is underway. Desktop/mobile native screenshots were inspected; no duplicate drawer obscures the atlas. Final verification results will be recorded before shipping.

## U4 — public AI description prepared

Prepared immutable context edition 2026-10-23.2 and strict schema 1.3 with the optional check's fixed account gateway, six statements, two dimensions and 1–5 scale. No individual records are exposed. Six metadata-contract tests and strict JSON Schema validation pass. Existing release/schema bytes remain untouched. Origin/edge allowlist definitions are prepared, not applied to production; the new Cloudflare paths require separate explicit approval at deployment.

## Remaining execution

Final native verification, the optional six-pair Quiz and recommendations, and complete synthetic learner rehearsal remain in this implementation batch. Human pilot, new saved-rating wording review, representative mail and broader launch/retention decisions remain release gates. This record will gain actual results as those units complete.
