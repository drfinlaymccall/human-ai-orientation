# Public launch implementation — 23 October 2026

This record tracks implementation of the [single forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md). It does not claim a completed public launch or human pilot.

## Clear entry and course structure (U1)

The homepage explains the audience, useful task, downloadable context portfolio and estimated 70–95-minute journey. The primary action starts the real public first activity; the secondary previews the journey. Three core activities contain the portfolio bridge, with preparation optional and outside their numbering. Returning pilot learners retain sign-in. Public registration remains closed.

Activity 2 timing and optional-preparation wording are consistent in shared source and public preview. Public pages have specific share titles/descriptions. Temporary browser drafts, learner-owned downloaded backups and native Moodle completion are explained separately. The accepted activity atlas direction is preserved in the design handoff; the first homepage slice does not yet implement the interactive atlas.

Synthetic verification: the new first-action test initially failed because the primary action was absent. After implementation, the authoritative `npx playwright test --config playwright.launch.config.cjs` run passed all three tests in 13.0 seconds. It checked desktop/mobile real navigation through the core journey, optional preparation, keyboard Tab/Enter, JavaScript-free reading and share metadata. Full public build passed. Desktop and mobile screenshots were visually inspected. No human outcomes are inferred.

## Native verified onboarding (U2)

Additive configuration now prepares closed/open registration with native email confirmation, self-enrolment and recovery. Opening requires a private genuine-mail/owner-review receipt. Existing authentication, enrolments, stricter password/lockout settings and mail transport are preserved; deliberate email/enrolment restrictions are reported as blockers instead of cleared. Closing prevents new acquisition without disabling access for already enrolled people. Help/privacy and login instructions explain confirmation, resend, duplicates and portable work.

The authoritative isolated native browser run passed eight tests in 2.6 minutes: configuration preservation and idempotence, failed opening without evidence, signup/confirmation/resend, denial before confirmation, fresh-browser confirmation and enrolment from the course entry, duplicate and removed accounts, returning login, consumed/expired recovery and closing without losing enrolled access. Mail was captured in the separate fixture. A PHP INI wrapper ensures the fixture's native PHP mail transport writes only to that fixture mailbox; no live SMTP change was made.

The tests identified a native direct-Lesson signup handoff issue: confirmation's POST continuation can lose a module ID during enrolment. Course-origin signup works; the direct-activity case remains a required U3 integration check, with a supported canonical gateway planned. No complete direct-activity acquisition claim is made yet.

Finlay accepted the displayed operating wording for the pilot and requested retention review before broader launch. An owner-authorised native recovery email was accepted by the live transport; the existing password was unchanged. This is an owner-controlled delivery attempt, not recipient-confirmed delivery or representative external-mail evidence. Private recipient/receipt details remain ignored. Public registration is still closed.

## Saved return and stable identity (U3)

The repository local plugin supplies a current-user overview and Continue action using native activity completion. It preserves the original three-activity practice baseline, treats portfolio practice as the bridge within activity 2, leaves preparation optional and explains manual Page completion, native Lesson resume and separately downloaded portfolio backups. Current version labels describe published content, not the edition a learner previously read.

The shared module manifest owns the five activity labels, stable IDs, routes, versions and outcomes. Publishers adopt existing native identities before changing display names and refuse conflicting or missing adopted records. Both publishers retain evidence fingerprints and original completion criteria. A canonical signup gateway fixes the direct-Lesson confirmation/enrolment handoff using supported events and native destination preferences; Moodle core remains unchanged.

An exact-address pilot mode permits genuine owner-controlled email checks before broad registration. Its private pilot receipt does not assert mail receipt, completed human participation or broader retention approval. Broad opening remains separately gated by actual representative mail/recovery evidence and retention review. The owner reports that the dedicated alias is enabled and forwards to the verified mailbox; genuine learner-mail checks remain pending.

Independent parent verification passed all eight native progress checks in 2.3 minutes and all nine onboarding checks in 2.9 minutes. It covered the actual direct-Lesson confirmation/enrolment flow, exact-address pilot restriction, two-user isolation, native Lesson completion/resume and stable repeated publication. All 13 changed/new PHP files passed syntax checks. All fixture mail is captured, not externally delivered.

## Remaining gates

The activity atlas and matching public AI metadata remain in progress. Native onboarding/progress changes are implemented and undergoing authoritative verification before deployment. Genuine representative email/recovery receipt, Finlay's operating/privacy wording review and a consenting human pilot remain required before broad enrolment/public launch. CI activation remains issue #10. Owner-reported Contabo backups remain accepted; no backup audit is added.
