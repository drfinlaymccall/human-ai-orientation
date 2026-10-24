# My context and course profile — 23 October 2026

## Delivered behaviour

Finlay approved private Moodle storage for small learner creations, with a large **Copy** button as the main reuse action and optional **Download Markdown (.md)**. Signed-in enrolled learners can deliberately save their portfolio, brief or readable try/check record; add small notes; return across course pages and signed-in devices; edit, copy, clear/delete and follow links back to source activities. Typing alone keeps a temporary tab draft. Copies/downloads do not save changes or give an AI access.

The shared course panel shows saved documents/notes, last-saved dates, actual native completion, Continue and course-guide links. It uses available side space on wide screens and stacks below the content on smaller screens. Normal navigation links and a native HTML workspace preserve a no-JavaScript route. A within-lesson reading-position tracker and guided live portfolio preview remain separate future improvements.

A shared **Keep in touch** section on the public course profile and native course summary links Finlay's existing verified LinkedIn profile and website for course updates, new educational offerings and human–AI collaboration ideas. No newsletter subscription, email campaign or social post is introduced. X remains optional until its profile URL is confirmed.

Related: [context workspace #15](https://github.com/drfinlaymccall/human-ai-orientation/issues/15), [course review #9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). The [single forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md) retains the remaining journey/self-assessment work.

## Design and privacy

The existing local plugin adds an owner/course/item-key table, exact version 1 portfolio snapshots and bounded text notes. Native enrolment/capability checks, session keys, opening-account assertions and private/no-store responses protect access. Owner/course locks compare both row identity and revision, so stale edits and deleted/recreated documents cannot silently overwrite saved work. The client clears prior-owner text and pending imports when accounts change. No Moodle core changes, external drive or AI API is required.

Copy/Markdown context exports exclude separate private practice fields. Existing version 1 JSON backups retain their private practice data and explicit replacement confirmation. Privacy metadata/export/deletion and user/course deletion are implemented. No fixed context-retention period is set: context remains until cleared/deleted or removed through privacy/account/course deletion. Finlay administers the server and can access records for support/records requests. Backups have separate lifecycles. Public privacy/help and [operator guidance](../operations/context-workspace.md) describe these limits.

## Verification

All testing below used authored synthetic material. No human pilot or learning gain is claimed.

| Check | Observed result |
| --- | --- |
| Deterministic client races | 6 passed: initial prior-owner boundaries, stale response bodies, pending activity saves and late imports |
| Isolated native Moodle browser checks | 13 passed: save/return/edit/Copy/Markdown, two owners, CSRF/validation, stale revisions, row recreation, failed saves, real denied database writes, no-JavaScript recovery, mobile/desktop panels, account/enrolment/session changes and real privacy export/deletion |
| Existing portable portfolio browser suite | 8 passed, including backup compatibility, replacement cancellation, blocked browser features, mobile and no-JavaScript routes |
| Public AI metadata | 6 unit and 2 browser checks passed; current release is 2026-10-23.2 with deliberate Moodle saving described |
| PHP syntax | 16 plugin/publication files passed |
| Live HTTPS smoke | 5 scenarios passed: anonymous mobile profile and private-route denial; signed-in portfolio/native edit/clipboard/Markdown; fresh browser plus no-JavaScript mobile note/source link; second-account isolation; native course profile and panel |

The full code review covered 11 lenses. All seven actionable findings were corrected and checked: activity account binding, database-failure recovery, truthful POST notices, independently runnable test setup, deleted/recreated row identity, late refresh bodies and late backup imports. The separate cross-model helper was not run because it could not enforce the required narrow source-only scope in the shared checkout; the review used an independent local adversarial context instead.

An initial full browser run exposed a Moodle login-test race with anonymous template requests; waiting for login-page initialization before submitting resolved it. An earlier account-change check also prompted the observational context endpoint to suppress session-cookie replacement. The final full native run passed. A further focused native check passed with the primary Copy button activated by keyboard Enter. The exact focused delivery snapshot also passed all eight portable portfolio checks and repeated content generation was stable. Screenshots at 1920/1440/390px were checked for fit; the large Copy action is prominent and panels do not overlap the editor. Screenshots/logs remain private under the ignored synthetic fixture.

## Live publication

Deployed local_orientation 2026102303 (release 1.1.0) with Moodle's supported additive upgrade. Published existing Page/Lesson fragments and course summary through the supported publication scripts, without reseeding. Before/after/final fingerprints match for existing module identities, Lesson attempts/grades/branches/timers/answers, activity/course completion and completion criteria. The two newly created manual synthetic accounts were deleted after live checks; their context cleanup was verified. No real learner account or mail workflow was used.

Public AI release 2026-10-23.2 is byte-verified over HTTPS as text/plain; older immutable releases remain. The existing exact-path Caddy/Cloudflare public-context exception includes that new release only. Private/unlisted paths remain denied. This is no claim that Gemini or any consumer AI will retrieve every page.

## Operating follow-up

Finlay/implementer should review failed saves and unexpected 5xx responses for the workspace/JSON endpoint during the first review session. Healthy signals are owner saves/reloads, anonymous/unenrolled denial and intentional 409 stale-edit refusal. If ownership, return loading or draft recovery fails, hide the affected action and correct it while preserving the saved table; do not downgrade the schema or delete learner data. See the [operating checks](../operations/context-workspace.md#operating-checks).

Physical-device dictation, screen-reader use, human comprehension/retrieval observations, broader registration/retention review and the remaining personal journey/self-assessment work are outstanding. This release does not complete those workstreams or establish competence from completion ticks.
