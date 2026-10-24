# My context: saved course creations

My context adds private Moodle storage for the learner's small context documents. Its primary action is **Copy**; **Download Markdown (.md)** is a secondary option. Copying/downloading does not save edits. It does not connect to an AI provider or an external drive.

## Learner workflow

1. Sign in with an enrolled course account. Anonymous public reading still works.
2. In the portfolio or private practice builder, choose **Save to My context**. Editing alone keeps a temporary browser-tab draft.
3. Open **My context** from the course panel/navigation. Choose Working with me, My goals and projects, Useful knowledge and examples, or the separate private practice record.
4. Edit and choose **Save changes**. Use the large **Copy** button to copy reviewed text; paste only relevant parts into an AI conversation. A Markdown download is optional: find the .md file in Downloads and move it into the learner's notes folder if useful.
5. Use the source-activity link to return to instructions. New context notes can retain a short task output or other useful text. The brief and try/check widgets have deliberate save controls for their readable output.

Saved work is attached to the current account and returns in a fresh browser/device after sign-in. The workspace provides normal HTML forms without JavaScript; its text-to-copy box supports manual selection/Copy. Existing version 1 portfolio JSON backups remain an advanced portable restore route, including private practice fields. Restoring a backup changes the draft; a later Save updates Moodle. Replacement and deletion require deliberate confirmation.

## Finding the panel while working

The Obsidian notes-setup and files/AI-basics preparation pages omit the **My context** panel: learners are preparing before creating course context. The panel remains available on **Try AI on a useful task** and the later context activities. Ordinary workspace/navigation links remain available. Public `/notes` and `/before-you-start` (including their static `.html` previews) suppress panel creation; native Moodle identifies `orientation:notes` and `orientation:before-you-start`, emits the shared assets and a suppression marker, and omits the panel even without JavaScript. Keeping the account client active preserves existing account-change/draft handling. With no panel element, the layout reserves no panel gutter. Deploy the client and repository-owned plugin together; no Page content, schema or progress migration is needed.

At desktop widths of 1100px and above, **My context** stays in view on the right. When Finlay’s Tips is available beside a writing activity, My context moves to the left. The page reserves space for it, including alongside Moodle’s open course index. Expand/collapse its heading with a click, Enter or Space; long lists scroll within the panel. It leaves room above Give feedback.

At narrower widths, including phones and browser zoom that reduces the available space, the panel stays in normal page flow. Browsers without support for the placement selectors also retain the in-page panel. Finlay’s Tips keeps its existing responsive layout. Unavailable/read-only/disabled writing fields hide tips and return My context to the right. Native Moodle’s panel remains usable without JavaScript; public reading and manual Copy routes remain available. This is a shared CSS change, with no new plugin, storage, microphone permission or AI connection.

## Storage and access

- The additive `local_orientation_context` table stores a portfolio snapshot plus owner/course-scoped text notes, title, source activity, revision and timestamps. It stores text in Moodle's database rather than arbitrary uploaded files. There are no core patches or new activity-completion conditions.
- The portfolio uses the existing 20 field keys, 2,000 UTF-16 units per field, review flag, fictional provenance and version 1 backup envelope. The three context documents stay separate from private practice notes in copies/Markdown context exports.
- Notes are limited to 20,000 UTF-16 units and a 160-unit title, with at most 50 notes per learner/course and a separately reserved portfolio. The JSON endpoint accepts at most 256 KB per request.
- Every read/write/download resolves the signed-in user. Enrolment/course visibility/capability checks apply. Writes require a session key; no caller can select another learner's workspace. Responses are private/no-store, with no cross-origin sharing.
- An owner/course lock and revision comparison protect initial inserts and updates against concurrent/stale saves. On a conflict, keep/copy the draft before loading the newer saved revision. Do not introduce automatic last-write-wins replacement.
- These are private workspace records, not public course-reference files. Finlay administers the server and can access stored records for support/records requests. There is no separate teacher browsing interface for learner documents.
- Context has no automatic retention period: it remains until cleared/deleted or removed through Moodle privacy/account/course deletion. Privacy metadata, export and single/bulk deletion are implemented. Server backups and copies the learner downloaded have separate lifecycles. The public privacy/help wording must travel with the feature.

## Deployment and verification

Use `python3 scripts/deploy-orientation.py --trial-dir <installed-runtime> --upgrade` for the supported additive plugin install/upgrade. It copies only repository-owned plugin files and the course map. Build shared public assets/fragments with the existing build commands; publish changed native Page/lesson content through supported APIs, preserving course/module identities, attempts, answers and completion. Never reseed the released course.

The dedicated synthetic fixture avoids the launch fixture and live data:

```bash
python3 scripts/prepare-launch-fixture.py --context-workspace
ORIENTATION_TRIAL_DIR="$PWD/trial/context-fixture" scripts/php scripts/seed-course.php
ORIENTATION_TRIAL_DIR="$PWD/trial/context-fixture" scripts/php scripts/sync-preparation.php
ORIENTATION_TRIAL_DIR="$PWD/trial/context-fixture" scripts/php scripts/sync-journey.php
python3 scripts/deploy-orientation.py --trial-dir trial/context-fixture --upgrade
npx playwright test --config playwright.context.config.cjs
```

The fixture uses only new synthetic data, port 18842 and captured mail. Existing fixture directories are never overwritten. Run the existing portfolio regression suite too; use a separate static-preview port if another chat owns the usual port. Tests and screenshots use fictional/synthetic content only and stay under ignored `trial/context-fixture/`.

## Operating checks

After a release, Finlay/implementer checks an anonymous gateway and an enrolled synthetic account: save → navigate → reopen → edit → Copy/.md → return to source; repeat in a fresh browser and with a second account. Check 390px and a wide desktop, account changes, no-JavaScript forms, failed-save recovery and stale-revision refusal. Fingerprint activity identities and existing Lesson/completion evidence before/after publication. Functional checks do not establish learning outcomes or a physical-device/screen-reader trial.

During the first review session, inspect private web/PHP logs for `/local/orientation/context.php`, `/local/orientation/workspace.php`, unexpected 5xx responses and repeated failed saves. Expected signals are successful owner saves/reloads and 401/403 for anonymous/unenrolled users; 409 is an intentional stale-edit refusal. Do not log document bodies, session keys or personal screenshots. If ownership, save/reload or draft preservation fails, stop exposing the affected action and correct it before further learner use. Preserve the saved table and versioned schema during mitigation; do not roll back by deleting learner data or downgrading Moodle's plugin version.

## 24 October integration refinement

Load saved version requires a successful fresh account read; an unavailable/superseded request leaves the draft untouched. Confirmed server loads establish a clean tab baseline so a later newer saved revision can be restored. Imported files and fictional examples stay drafts until deliberately saved. WB01 also reconciles the compact feedback panel and publication notice; [integration evidence](../releases/2026-10-24-wb01-integration.md) separates original native runs, targeted rechecks and final PR review.

Saving has one 30-second request/body deadline. A timeout leaves the draft and restores Save, but cannot establish whether Moodle committed: inspect My context before retrying. Storage-failure exports track further edits with JavaScript; without JavaScript the recovery snapshot is explicitly read-only, copyable/downloadable and retryable. The joined 2026102402 upgrade also creates context storage when upgrading from a journey-only 2026102401 source line, without resetting existing context or course evidence.

Brief and private-practice saves describe only the text submitted. If the learner edits while the request is pending, the earlier version may be saved while the newer draft remains explicitly unsaved; later typing also clears the saved notice.
