# Private trial verification

Executed 13 October 2026 on the existing server. These are synthetic functional tests, not observations of human learning or a persona-based evaluation study.

## Observed results

| Check | Result |
| --- | --- |
| Desktop: register, read captured confirmation, confirm, enrol, start lesson | Passed in Chromium at 1440 × 1000 |
| Leave after page 3, log out, log in, resume the correct page | Passed |
| Incorrect knowledge-check response, feedback, retry, correct response | Passed |
| Save a reflection, finish, log out and return to recorded completion | Passed |
| Same end-to-end journey at mobile width | Passed at 390 × 844; no horizontal overflow on the context-template page |
| Signed-out learner tries to open lesson | Redirected to login |
| Password reset through a locally captured email | Passed; subsequent login retains completion |
| Administrator opens lesson authoring and report screens | Passed |
| Learner tries the authoring URL | Access denied |
| Course welcome email | Captured for the learner; return link matches the actual course URL |
| Persistent records | Confirmed accounts, exact saved reflection text and completion state verified for desktop and mobile test users |
| Stop/start application and database, then inspect records and sign in | Passed; both reflections and completion states retained; author/learner access check passed again |
| Source/configuration checks | Python AST, PHP syntax, JavaScript syntax, shell syntax and local documentation links passed |

Evidence: `trial/learner-test-report.json` records the three learner/access/recovery tests; `trial/test-report.json` is the latest focused verification run. `tests/check-evidence.php` reads the actual native Moodle records. Private logs and mail are not publication artefacts. Shareable screenshots use synthetic accounts: [desktop lesson](desktop-lesson.png), [mobile lesson](mobile-lesson.png), [desktop completion](desktop-complete.png), [mobile completion](mobile-complete.png).

## Findings addressed

- Enabled the self-enrolment instance created disabled by Moodle's default course setup.
- Matched browser automation to Moodle's link-based resume control and native question rendering.
- Waited for asynchronous login-field initialization before filling credentials; the earlier automation race caused invalid-login failures.
- Disabled score-oriented question retry wording and installed supported local language customisations for practice/reflection, without changing Moodle core.
- Set welcome notifications to the no-reply sender because this trial has no assigned course teacher contact.
- Selected the newest captured email when a test repeats recovery for an existing synthetic account.

## Review and scope

Three independent simplification passes covered the new trial scripts and browser tests. Applied small reuse/quality improvements, removed unused variables/imports, streamed package hashes and avoided reading every email body before finding a match. The parent also inspected process isolation, mail capture, secret handling, seed behaviour and native persistence paths, and tightened the server readiness check to require the owned process to remain alive.

The Git-based `ce-code-review` workflow could not resolve a review base because this project folder has not been initialised as a Git repository. A manual file review was used; do not describe this as a completed full independent correctness/security review. No commit, push or PR was made. The downloaded Moodle source has its own upstream repository, separate from the course project.

The installation was exercised through the recorded steps. The consolidated fresh-machine bootstrap was syntax-checked but has not been replayed into a second clean installation. Production backup/restore and upgrades have not been tested.

## Remaining checks before a human/public pilot

Physical-phone and screen-reader checks; a real person completing the task; registration friction and course-navigation clarity; outbound email delivery and recovery; content-edit/export workflow; privacy/retention/deletion choices; production hosting/HTTPS, monitoring, scheduled tasks and recovery; reviewed support. No real AI account was driven by the test scripts. The worked-example route was used for synthetic reflection evidence.

The current recommendation is to retain Moodle provisionally and have Finlay review the learner experience before further interface work. See the [platform decision](platform-decision.md) and [runbook](RUNBOOK.md).


## Public deployment verification — 13 October 2026

Cloudflare MCP created the selected subdomain and the application is publicly reachable over HTTPS. Three browser tests passed through the actual Cloudflare edge, including the complete pilot lesson and a fresh-login completion check. An independent external fetch verified DNS/access from outside the server. The server’s upstream resolver temporarily cached an earlier negative lookup, so Chromium used an address verified from public DNS; TLS validation remained enabled and requests were not intercepted locally. See [public deployment evidence](PUBLIC-DEPLOYMENT.md). Synthetic public QA accounts were suspended after testing. This remains a one-lesson trial with individually provided accounts and no external email.


## Public AI-context addition — 13 October 2026

Implemented R22–R24’s site portion: login-free human guide, current and pinned Markdown, a project manifest/schema, and a link from the Moodle menu. Public GitHub publication remains planned, with its boundary documented.

- All three existing public regression journeys passed after the Caddy changes: desktop/mobile reading, native saved completion, and private-route denial.
- The new context browser check passed: signed-out access, linked Markdown/version retrieval, clipboard success, denied-clipboard manual selection, mobile/desktop overflow checks and reading with JavaScript disabled. The initial assertion needed to account for the browser selection dropping the final line break; substantive text still matches exactly.
- The generated manifest validates against its Draft 2020-12 JSON Schema. A temporary isolated build verified that unchanged rebuilds preserve the pinned file and changed same-version content is rejected without overwriting it.
- Independent TinyFish retrieval read the public AI-context page. This tests availability, not compliance by every AI provider or learning outcomes.
- Reviewed the new routes against existing private-file protections. The only Markdown exceptions are the two explicitly published context paths; configuration, VCS and runtime paths remain blocked.
- Simplification: three independent read-only passes; one efficiency improvement applied (exclusive creation and no rewrite of an unchanged pinned release); no reuse or quality findings.
- Dedicated ce-code-review could not resolve a Git base because the project has not been initialized as a repository. A manual review of the generator, clipboard handling, route allowlist and manifest/source boundaries was used instead; this is not a full independent code/security review. No PR was created.
- Evidence strategy: existing public tests were inspected and extended; direct runtime verification was used for this additive static/configuration change. No pre-implementation failing test was claimed. QA account was suspended after the existing signed-in checks.

No project lint/typecheck command is configured; Python parsing, JS syntax, Caddy validation and JSON Schema validation passed. The native Moodle source remains unchanged. See [the design and operating notes](../curriculum/public-ai-context.md) for the release procedure and next checks.


## Free-tools page — 2026-10-13

- Caddy configuration validated; restarted `orientation-web` and confirmed active.
- Live public HTTPS checked with normal DNS and certificate validation at desktop 1440px and mobile 390px. No local routing override.
- With JavaScript disabled, keyboard activation of the homepage “Free AI tools” link reaches the new guide; Muse disclosure expands; four provider cards render; no horizontal overflow; the lesson return link works. Screenshots: `free-tools-1440.png` and `free-tools-390.png`. Desktop screenshot visually reviewed.
- Existing public introduction/layout and registration/recovery/private-file tests: 2 passed. No learner-account or mail changes were required.
- The initial ad hoc browser check read the URL before keyboard navigation completed. Added an explicit navigation wait and both viewport checks passed; no product fix was needed.
- Official provider documentation researched for task fit; no authenticated provider trials or paid subscriptions performed.


## Preparation, Obsidian and contextual tips — 2026-10-13

- PHP syntax and Caddy configuration validation passed. Both guide builds and the new AI context manifest validated; prior context release remains available.
- Moodle sync executed twice with stable resource IDs (files/folders: 2; notes: 3), demonstrating no duplicate resources. In-transaction fingerprints confirmed learner attempts, grades, branch/timer records, completion and lesson answers were unchanged on both runs.
- Full public HTTPS Playwright suite: **5 passed** (about 1.1 minutes), with normal DNS and certificate checks. Includes native Moodle preparation-to-notes-to-lesson navigation, the new tip, completion and saved return visit; no-JavaScript public preparation/notes at 1440px and 390px; actual Markdown download filename/content; self-check disclosure; no overflow; and existing private-file/auth/AI-context checks.
- Screenshots: `preparation-1440.png`, `preparation-390.png`, `notes-1440.png`, `notes-390.png`. Desktop notes screenshot visually reviewed; tall mobile capture and browser width assertions show stacked layout. These checks do not establish native Finder/File Explorer/Obsidian usability or learning outcomes.
- Synthetic QA accounts suspended after the successful run. No outgoing mail, new real learners or paid software involved.


## Interactive brief — 2026-10-13

- JavaScript syntax, PHP syntax and shared-content build passed. Published through supported Moodle additional-footer HTML and existing content-only sync; learner/answer fingerprints unchanged. No Moodle core edit.
- Full public suite: six checks passed initially, including native widget use, temporary draft restoration, Continue, lesson completion/return, mobile preparation, denied storage, no-JavaScript fallback and existing security/AI-context routes. One test had an ambiguous partial label selector matching both task and reflection labels; corrected to the task label prefix. Its targeted rerun passed (3.5 seconds). All seven checks passed across the two runs.
- Widget test covers entered text treated as text rather than HTML, clipboard contents excluding private learning notes, cancel-before-replace, labelled examples, reflection examples, reload persistence, denied-clipboard manual selection (including a closed details panel), clearing and desktop/mobile overflow. Screenshots: `brief-builder-1440.png`, `brief-builder-390.png`; desktop screenshot visually inspected.
- Synthetic accounts suspended after verification. Real learner usability and learning transfer remain unmeasured.


## Try/check/improve carry-over — 2026-10-13

- Shared content builds and JavaScript/PHP syntax checks passed. Published the fourth explanatory lesson page and shared computer-control guide; transactional fingerprints confirmed learner records and lesson answers unchanged.
- Public HTTPS suite: seven of eight checks passed in the full run, including native preparation → brief builder → step 4 → completion → saved return. The preparation test had a previously broad selector that became ambiguous with multiple tips; scoped it to the intended tip and its targeted rerun passed. All eight checks passed across these two runs.
- New public workspace check covers exact prompt/criterion/prediction carry-over, copying only the prompt, local reply persistence, text treated as text, protecting the original prediction when earlier work changes, cancel/confirm restart, follow-up and record copying, denied-clipboard selection, clear/reload and desktop/mobile layout.
- Native Moodle check verifies the same carry-over across separate lesson pages, reload restoration, working clipboard, and decoded Continue request bodies excluding the private draft/reflection and pasted response. Normal progress and the final submitted reflection still save.
- No-JavaScript fallback and storage-denied paths remain usable; with storage denied the public page can still transfer live fields without persisting them. Screenshots `try-workspace-1440.png` and `try-workspace-390.png` visually reviewed; no horizontal overflow at either viewport.
- Synthetic QA accounts suspended after verification. No real learner notes were used and no AI-provider messages or outgoing emails were sent. External resources were researched; actual Mac/Windows/phone walkthroughs, video viewing and human learning outcomes remain untested.


## Four input types and instruction practice — 2026-10-13

- Provider documentation researched through official pages; dated evidence and limitations in `docs/research/free-ai-tools.md`. No authenticated provider test is claimed.
- Shared preparation/comparison build and JavaScript/PHP syntax checks passed. Native preparation updated through the existing sync; learner and lesson-answer fingerprints remained unchanged. No route, core or email changes.
- Full public HTTPS suite: **9 passed (1.9 minutes)** with ordinary DNS/TLS, including the signed-in preparation → lesson → completion → saved return journey. The native preparation renders the four-row table and its copy action works.
- New public check covers all four provider rows and input headers, the practice navigation link, editing/copying all four route examples, entered text remaining text, denied-clipboard manual selection, 1440px/390px layouts, and no-JavaScript expansion/readability. No document overflow; table has its own labelled, focusable horizontal-scroll region.
- Screenshots `input-table-1440.png` and `input-practice-390.png` visually inspected; additional opposite-viewport screenshots retained. The desktop comparison and mobile practice controls remain readable.
- Synthetic QA accounts suspended. No learner data, recordings, uploads, AI-provider messages or external emails involved. Actual device microphone/file-picker operation and human learning outcomes remain for the pilot.
