# Launch audit: Human AI Orientation

Date: 10 November 2026 (Australia/Sydney). Auditor: Claude (AI agent), for Finlay McCall. Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Companion: [what only Finlay can add](2026-11-10-finlay-contributions.md).

Scope: the live preview at `orientation.finlaymccall.com` (read-only requests), the source on `main` at `0920072`, the synthetic fixture, the project records and all 19 open issues. Nothing on the site, in Cloudflare or in Moodle settings was changed. Exact figures and paths for a few operational and security findings are kept in a private operator note under the ignored `trial/` folder, because this report is public. Privacy items are a mapping to the Australian Privacy Principles (APPs). They are not legal advice.

File and line references are to `main` at `0920072`. Evidence labels: **V** = verified by reading the line or running the command on 10 November. **I** = inferred. **NT** = not tested.

## 1. Verdict

- **Stage A (anonymous course open to search and promotion): not ready.** The remaining work is small. Most of it is one agent PR series (packages A1–A6) plus Finlay's Stage A set: seven items and the date (package A7).
- **Stage B (registration open): not ready.** It waits on genuine mail receipt by a consenting person, Finlay's privacy and retention confirmations, and operating procedures that do not exist yet.
- The three things that matter most:
  1. The site still tells every search engine to stay away, and the replacement policy (which pages to index, a sitemap, share previews) is not built (F01–F04).
  2. Nothing alerts anyone when the site is down. The 7–8 November outage lasted 36 hours (F20).
  3. The privacy policy is an unapproved draft, and two of its statements do not match the site: an analytics script loads on every page, and promised deletions have no mechanism (F10, F12).

## 2. Decisions for Finlay

Each item has a full entry, with what is prepared, in [Finlay's list](2026-11-10-finlay-contributions.md).

| # | Question | Recommendation | Unblocks |
|---|---|---|---|
| D1 | Do you accept the `/privacy` wording for anonymous visitors? | Accept after the F10 and F11 corrections; get a lawyer's review before Stage B, not before Stage A. | Stage A |
| D2 | Cloudflare Web Analytics loads on every page. Turn it off, or keep it and say so in the policy? | Turn it off. The policy then stays true and simple. | Stage A (F10) |
| D3 | Should an uptime alert be a Stage A gate, not only a Public V1 gate? | Yes. Promotion sends strangers to the site. | Stage A (F20) |
| D4 | Which uptime monitor? | UptimeRobot free plan, with the three checks in section 6. Confirm the plan's current terms when you sign up. | F20 |
| D5 | Must the pilot (#5) finish before Stage A? | No. Stage A collects no account data. Run the pilot in parallel and finish it before Stage B. | Stage A date |
| D6 | Will you do the 24-month deletion review each year, or should the policy promise less? | Promise less: "we delete on request, and review inactive accounts once a year". | Stage B (F12) |
| D7 | Should Save and reuse context count toward Unit 1 completion? | Do not change completion. Reword the pages so the portfolio reads as the result, and add a self-check (F30). | Learner outcome |
| D8 | May the agent update the merge-gate runbook to accept the third built-in CLI plugin? | Yes, after one recorded re-audit of the flags at 2.1.319. | #23 |
| D9 | Stage A date. | Choose it after work packages A1–A6 are live and your Stage A set (package A7) is done. | Stage A |

## 3. Findings

Severity: **A** = Stage A blocker, **B** = Stage B blocker, **S** = should fix, **C** = could fix. Effort: S, M, L. Owner: Agent or Finlay.

### Discoverability and first visit

| ID | Sev | Area | Finding | Evidence | Learner impact | Fix | Effort | Owner | Issue |
|---|---|---|---|---|---|---|---|---|---|
| F01 | A | Robots | Every response carries `X-Robots-Tag: noindex, nofollow`. No scoped replacement exists. `docs/launch/readiness.md` line 7 says "remove" the header and line 35 says do not remove it without a scoped policy. | V: `deploy/Caddyfile:11`; `curl -D -` on `/`; `readiness.md:7,35` | Nobody can find the course by search. Removing the header globally would expose login and account pages to indexing. | Keep `noindex` on Moodle routes. Allow the 16 public reading routes, `/assets/*` and `/ai/*`. Fix the readiness wording in the same PR. | S | Agent prepares; Finlay switches | #9 |
| F02 | A | Robots | `/robots.txt` holds only Cloudflare's content-signal comments. It has no rules and no sitemap line. `/sitemap.xml` does not exist. | V: `curl /robots.txt` (1,248 bytes, comments only); `/sitemap.xml` returns 303 to login | Crawlers get no list of pages. | Add a generated `sitemap.xml` and a `robots.txt` that names it and disallows Moodle routes. Decide the Cloudflare content signals (Finlay's list, item 9). | S | Agent | #9 |
| F03 | A | Routing | Unknown addresses do not return 404. `/nonexistent`, `/journey.html`, `/index.html`, `/journey/` and `/favicon.ico` all redirect to the login page. | V: `curl` status 303 for each | A mistyped or old link lands a stranger on a login form they cannot use. Search engines treat these as soft errors. There is no favicon. | Return a plain 404 page with a link home for unknown static-looking paths. Redirect `*.html` to the clean route. Add a favicon. | S | Agent | #9 |
| F04 | A | Metadata | No page has a canonical link or a share image. Seven pages have no description and no Open Graph tags: `/desktop-workspace`, `/before-you-start`, `/notes`, `/agent-basics`, `/deeper-courses`, `/privacy`, `/ai/`. Structured data exists only on `/ai/`. | V: `grep` counts on `public/*.html` | A LinkedIn or chat share shows no image and, for seven pages, no summary. | Add canonical, description and Open Graph tags from the course map. Add one share image (needs Finlay's choice). Add `Course` structured data to the home page. | M | Agent; Finlay picks the image | #9 |
| F05 | S | Routing | `/course-introduction` is a second copy of `/journey` with no inbound link. | V: both 22.8 KB; same `<h1>` | Duplicate content for search. | Redirect it to `/journey` (the native Page keeps its own ID). | S | Agent | #9 |
| F06 | S | First visit | The home page answers what, who, cost, time and takeaway. It does not say who Finlay is. The header link "Check sign-in / Your course journey" and the line "Check sign-in to see your account state" are unclear to a visitor who cannot register. | V: `public/index.html:19,45,50-54` | A stranger cannot judge who is behind the course. The most prominent account link leads to a login they cannot use. | Add a short author section (Finlay's words). While registration is closed, label the link "Sign in (invited learners)". | S | Finlay writes; Agent places | #9, #24 |
| F07 | S | AI context | A scripted client gets 403 on the dated AI-context editions. The Cloudflare rule in `deploy/cloudflare-ai-context-rule.json` is not applied. A browser gets 200. | V: release record 6 Nov; rechecked 10 Nov: Python-urllib 403, a client with a browser user agent 200 | A learner's AI tool that fetches a dated edition is refused. | Apply the rule and read it back. | S | Finlay | #9 |

### Privacy and trust

| ID | Sev | Area | Finding | Evidence | Learner impact | Fix | Effort | Owner | Issue |
|---|---|---|---|---|---|---|---|---|---|
| F10 | A | APP 1, 5 | The policy says "The course does not use advertising or analytics cookies". Every public page loads a script from `static.cloudflareinsights.com` (Cloudflare Web Analytics). The script is not in the repository, so Cloudflare injects it. Moodle login pages also load from `cdn.jsdelivr.net`. | V: browser resource list on all 20 routes; `public/privacy.html:19`. I: the jsdelivr request is Moodle's MathJax filter. | The policy does not describe what a visitor's browser actually contacts. | Turn the analytics off in Cloudflare, or disclose it. Disable the MathJax filter or disclose jsdelivr. | S | Finlay (Cloudflare); Agent (wording, filter) | #9 |
| F11 | A | APP 1 | The policy is an unapproved draft with no legal review. The compliance record lists eight items "before Stage B" and marks none as applying to anonymous visitors, although readiness requires some before Stage A. `/help` says there is no guaranteed response time; `/privacy` promises 30 days for privacy requests. | V: `docs/operations/privacy-compliance.md:26`; `readiness.md:7`; `public/help.html:13`; `public/privacy.html:42-44` | Published promises that the owner has not accepted. | Tag each item A or B (proposal in Finlay's list, item 1). Align the `/help` sentence. Check the OAIC contact details against the OAIC site. | S | Finlay approves; Agent edits | #9 |
| F12 | B | APP 11 | The policy promises deletion of inactive accounts and support email after 24 months. No task or procedure does this. Feedback deletion after 90 days depends on a setting that nothing checks. | V: `public/privacy.html:35-37`; `privacy-compliance.md:23`; `moodle/local/orientationfeedback/classes/task/cleanup.php:7-8` | A promise without a mechanism. | Finlay chooses the promise (D6). Agent adds a review log, a support-queue purge command and a status check on the retention setting. | M | Finlay, then Agent | #4 |
| F13 | B | Data breach | The policy has one sentence on breaches. No operator procedure exists for containing, assessing within 30 days and notifying. | V: `public/privacy.html:40`; `privacy-compliance.md:24` | Slow or missed notification if records leak. | Draft `docs/operations/data-breach-response.md`. | S | Agent drafts; Finlay approves | #4 |
| F14 | B | APP 12, 13 | No procedure for access or deletion requests. The feedback plugin has no `user_deleted` clean-up, so deleting an account can leave voice recordings. | V: `moodle/local/orientationfeedback/db/` has no `events.php`; `moodle/local/orientation/db/events.php:5` | "Deletion of your account" may be incomplete. | Add the observer. Write a request runbook that uses Moodle's data privacy export and delete requests. | M | Agent | #4 |
| F15 | B | APP 5 | The voice feedback form has a one-line notice with no link to the policy, no retention period and no contact. The sign-up notice omits AI-assisted support drafting and IP logging. | V: `moodle/local/orientationfeedback/index.php:169`; `moodle/local/orientation/lang/en/local_orientation.php:4` | Recordings are collected without a full notice at that point. | Two-line notices that link to `/privacy`. | S | Agent; Finlay approves wording | #4, #21 |
| F16 | B | APP 8 | The overseas list names only the United States. The host's company location, the inbound support mailbox provider and the AI services used for support drafts are owner knowledge that the source cannot confirm. | V: `public/privacy.html:27-30`; `scripts/support.py` makes no outbound call | The list may be incomplete. | Finlay confirms; Agent updates. | S | Finlay | #4 |
| F17 | B | Visibility | The policy says other learners cannot see your records. Moodle's default student role can usually open the participants list and see names. Live role settings were not read. | V: `public/privacy.html:17`. I: default role behaviour. NT: live setting. | Names may be visible to other learners. | Check on the fixture as a learner, then remove the capability or state it. | S | Agent checks; Finlay decides | #4 |
| F18 | B | Wording | Finlay's review of the saved-rating wording in the starting-point check is required before pilot invitations. No record of it exists. | V: #25 body; `docs/operations/starting-point.md:26` | — | Finlay reviews; record the date. | S | Finlay | #25 |
| F19 | S | Pilot | The exact-address pilot gate has a small disclosure limit, and the invitation list is held before invitees sign up without the policy saying so. Details are in the private operator note. | V: source review | Low. | Finlay accepts and records it, or pilot accounts are created by hand. | S | Finlay | #5 |

### Operations

| ID | Sev | Area | Finding | Evidence | Learner impact | Fix | Effort | Owner | Issue |
|---|---|---|---|---|---|---|---|---|---|
| F20 | A (recommended; see D3) | Uptime | No external check alerts anyone when the site stops. No issue tracks it. | V: `readiness.md:29`; issue search | An outage during promotion goes unseen. | Section 6 recommends the monitor and checks. | S | Finlay | #9 |
| F21 | S | Restart | `orientation-web`, `orientation-php` and `orientation-db` use `Restart=on-failure`. A clean stop (exit 0), the failure mode of 7 November, would not restart them. `orientation-web` runs with `admin off`, so a stray `caddy stop` cannot reach it. System Caddy now shows `Restart=always`. | V: `systemctl --user show`; `systemctl show caddy`; `deploy/Caddyfile:2` | A stopped service stays stopped. | Set `Restart=always` on the three user units. | S | Agent (user units, no sudo) | #9 |
| F22 | S | Runbook | No short "site is down" guide exists for Finlay to follow without an agent. The outage record sits under "Backup and recovery". | V: `docs/trial/PUBLIC-DEPLOYMENT.md:63-69` | Slower recovery. | Add `docs/operations/site-down.md`: five checks in order, each with one command. | S | Agent | #9 |
| F23 | S | Disk | Free disk space on the shared server is limited, and nothing alerts when it runs low. Figures are in the private operator note. | V: `df`, `du` | A full disk stops the database and uploads. | Add a disk check to the uptime heartbeat (section 6). Finlay reviews what else is on the server. | S | Agent; Finlay | #9 |
| F24 | C | Logs | Course logs under the private runtime are not rotated. They total 0.5 MB today. | V: `du -sh`; `/etc/logrotate.d` has no entry | None now. | Add a user-level rotation when registration opens. | S | Agent | #4 |
| F25 | — | Verified working | The server restarted on 9 November at 20:11 and all services came back. Moodle cron runs and completes. The origin certificate is valid to 11 January 2027 and Caddy renews it. Acquisition is `pilot`; broad registration is closed; password policy and lockout are on. | V: `uptime`; `systemctl`; `journalctl`; `openssl s_client`; `configure-onboarding.php status` | — | — | — | — | — |
| F26 | B | Mail | No consenting person other than Finlay has received confirmation, welcome and recovery mail. The welcome email subject is "Welcome to A useful start with AI", which is not the course name used anywhere on the site. | V: #4; `configure-onboarding.php status` (`welcome_subject`) | A new learner gets mail that names a different course. | Finlay arranges one consenting recipient. Agent proposes renaming the Moodle course full name to "Human AI Orientation" through the supported API (IDs unchanged). | S | Finlay; Agent | #4 |
| F27 | B | Support | Support ownership and weekly capacity are not recorded. `/help` gives no expected reply time for course support. Backups are owner-reported and no restore is required (accepted 6 November). | V: `readiness.md:26`; `CONTROL.md:203` | Unclear when a stuck learner hears back. | Finlay states capacity; Agent records it. | S | Finlay | #4 |

### Course and learner outcome

| ID | Sev | Area | Finding | Evidence | Learner impact | Fix | Effort | Owner | Issue |
|---|---|---|---|---|---|---|---|---|---|
| F30 | S | Outcome | A learner can finish Unit 1 without a portfolio. Completion is three activities; Save and reuse context is not one. The page labels itself "Recommended, not needed for Unit 1 completion". | V: `content/course-map.json:76,215-219`; `public/portfolio.html:1`; `moodle/local/orientation/index.php:93` | The stated outcome is optional in practice. | Do not change completion (project rule). Reword the label to say what the learner gains. Add "reopen your saved copy now" on `/portfolio`. Make the completion message name the portfolio as the next step. | S | Agent; D7 | #9, #26 |
| F31 | S | Outcome | The "meaningful next goal" has form fields but no teaching step and no "why it matters" line. The goal is kept in the private practice record, not in a portfolio document. | V: `public/check-and-continue.html:27-30,41`; `docs/curriculum/competency-framework-v1.md:117` | The second half of the outcome is the least supported. | Add a short "Choose your next goal" step using the existing fields plus one additive reason line. | S | Agent | #9 |
| F32 | S | Journey | The three optional modules and `/free-tools` send the learner to Give AI useful context, past Try AI on a useful task. `/deeper-courses` ends with "Continue to the AI lesson". The last activity ends in a loop back to the portfolio with no close. `/help` and `/catalogue` end with no next action. | V: `public/desktop-workspace.html:109`; `before-you-start.html:62`; `notes.html:54`; `free-tools.html:73`; `deeper-courses.html:51`; `check-and-continue.html:42` | Learners skip the first activity or finish without a clear end. | Correct the buttons. Add a short close on the last activity: Go deeper, Keep in touch, Give feedback. | S | Agent | #24 |
| F33 | S | Naming | The four canonical names are not used consistently. Variants on live pages include "Activity 1–4", "the AI lesson", "the context lesson", "the first lesson", "Public lesson", "portfolio bridge", "portfolio builder" and "Find your way around files and folders". The journey has three names (title, heading, navigation). | V: listed with lines in the page review; for example `preview.html:1,15`, `journey.html:1,9`, `notes.html:43-54` | The 6 November decision "one name per activity" is only partly applied. | One pass through the shared fragments. | S | Agent | #9 |
| F34 | S | Relevance | Learner pages still carry research and product commentary: source-and-limits notes and "documentation-based comparison, not a hands-on test" (`/desktop-workspace`, `/free-tools`), a paid-plan recommendation on the free-tools page, a note about a product the course does not use, reuse-permission commentary for teachers on `/deeper-courses`, product-plan notes on `/portfolio` and `/preview`, and "pilot", "instrument", "if enabled", "version 1 JSON backup" and "human–agent curriculum work". | V: `desktop-workspace.html:36-42`; `free-tools.html:44,49-51,70-74`; `deeper-courses.html:8,29-40`; `portfolio.html:74,117`; `preview.html:63,152`; `help.html:9-10`; `index.html:46` | Extra reading that does not help with the task. | Move the text to the research records. Keep the attribution and licence notices. Give the CC BY notice its own anchor target. | M | Agent | #9 |
| F35 | S | Relevance | Finlay's Tips shows twice on `/preview`, and the dictation set-up shows twice on `/portfolio`. The copy-and-paste guide appears on two pages. | V: `preview.html:38-68,118-140`; `portfolio.html:90-96,109-118`; release record 6 Nov (deferred) | Repetition. | Show once per page. | M | Agent | #9 |
| F36 | S | Objectives | Only `/preview` states what the learner will be able to do. The objectives and self-checks for all seven modules exist in the course map and show only on the journey. | V: `preview.html:15`; `content/course-map.json` (`atlas.practise`, `knowledge_check`, `performance_check`) | The learner does not see the aim on the page where they work. | Show the existing lines at the top and end of each activity page. | M | Agent | #27 |
| F37 | S | Competencies | Every competency has practice. Four are weak: TALK-03 (checking what the AI received) and KEEP-02 (reopening a saved file) are taught but never recorded; LEARN-01 has no prompt to choose a next practice; LEARN-03 is F31. CHECK-02's fault types are not taught. The no-JavaScript and interactive versions of the CHECK-03 step differ. | V: section 4 of the page review; `check-and-continue.html:15,25` | Thin evidence for four of 22 statements. | One line each, added to existing fields. | M | Agent | #6 |
| F38 | S | Stale text | `/desktop-workspace` says "You have practised finding files and moving text", but it is now the first module. `/free-tools` links to a stub. `/preview` links to `/course/view.php?id=2`, which is a login page for visitors. `/help` explains sign-up confirmation while registration is closed. | V: `desktop-workspace.html:20-21`; `free-tools.html:57`; `before-you-start.html:59`; `preview.html:1`; `help.html:4` | Small confusions. | Edit. | S | Agent | #9 |
| F39 | C | Images | The public pages contain no images. Nine portfolio illustrations exist and are not placed (#16). There are no screenshots of real set-ups. | V: browser image count 0 on all routes; `public/assets/portfolio-imagery/` | The course is text-only. | #16 as written; screenshots from Finlay. | M | Agent; Finlay | #16 |

### Accessibility, security, performance

| ID | Sev | Area | Finding | Evidence | Learner impact | Fix | Effort | Owner | Issue |
|---|---|---|---|---|---|---|---|---|---|
| F40 | — | Accessibility, verified | axe (WCAG 2.0–2.2 A and AA rules) found 0 violations on the 17 public routes, sign-up and recovery. The first Tab stop is the skip link on all 20 routes. No focused control was invisible. No overflow at 320, 390 or 640 pixels (640 stands in for 200 % zoom at 1280). Every route renders its content without JavaScript, with no obfuscated email. No animation runs with reduced motion. | V: Chromium run on the live site, 10 Nov; 20 routes | — | — | — | — | — |
| F41 | S | Accessibility | The login page has one serious axe finding: the "Lost password?" link is told apart from its text by colour alone. | V: axe `link-in-text-block` on `/login/index.php` | Low-vision users may miss the link. | Underline links in the login text through the plugin's existing login-layout style hook. | S | Agent | #9 |
| F42 | C | Themes | The site has no dark theme. With the browser set to dark, pages stay light and contrast still passes. | V: computed background `rgb(246, 247, 244)` in dark mode; axe contrast 0 | None; a preference is not honoured. | Leave until learners ask. | — | — | — |
| F43 | S | Headers | Present: HSTS (one year), `nosniff`, referrer policy; the `Server` header is removed. Absent: a content security policy, any framing control on the static pages, and a permissions policy. | V: `curl -D -` on `/` | Another site could frame the public pages. | Add `frame-ancestors 'self'` and a permissions policy that allows the microphone for this site only. Start a report-only content policy for static pages. | M | Agent | #9 |
| F44 | S | Caching | Every response, including style sheets and scripts, is sent with `Cache-Control: no-store`. Cloudflare reports BYPASS. Public pages are small (25–51 KB, 10–20 requests, first byte in 60–210 ms), so they are fast anyway. Moodle's login, sign-up and recovery pages transfer 1.2–1.9 MB on every view. | V: `deploy/orientation.caddy:6`; response headers on `/assets/site.css` and Moodle script URLs; browser transfer sizes | Slow sign-in pages on mobile data. | Limit `no-store` to pages. Let Moodle's own cache headers pass. This file is copied into system Caddy, so Finlay applies it. | S | Agent prepares; Finlay applies (sudo) | #9 |
| F45 | C | Denied paths | The private and runtime paths tested return 404. The deny pattern can be widened to a few more file kinds; the list is in the private operator note. | V: `curl` on eight paths; `deploy/Caddyfile:17-23` | Low. | Extend the pattern. | S | Agent | #9 |
| F46 | — | Plugin code, verified | The source review found no cross-user read or write, no missing session-key check on a write, no string-built SQL, no unescaped learner text and no open redirect in either plugin. | V: source review of `moodle/local/orientation` and `moodle/local/orientationfeedback` | — | — | — | — | — |
| F47 | B | Abuse | Sign-up has no CAPTCHA (already stated in `docs/operations/onboarding.md`). Upload limits for voice feedback are per learner, with no site-wide ceiling. Details are in the private operator note. | V: `docs/operations/onboarding.md:17`; source review | Storage could be filled once registration is open (see F23). | Add a site-wide ceiling. Finlay decides on CAPTCHA. | M | Agent; Finlay | #4 |

### Quality system and records

| ID | Sev | Area | Finding | Evidence | Learner impact | Fix | Effort | Owner | Issue |
|---|---|---|---|---|---|---|---|---|---|
| F50 | — | Checks | See section 8 for exact counts. The Python suites passed. The public suites passed once the portfolio step was run on the alternative port (F51). Three of five fixture suites passed; two failed (F59). | V | — | — | — | — | — |
| F51 | S | Checks | `npm run check:public` stops at the portfolio step on this server: another project's service has held port 8796 since the 9 November restart. The documented alternative port works. | V: `Error: http://127.0.0.1:8796 is already used`; `ORIENTATION_PORTFOLIO_PORT=18816 npm run test:portfolio` passed | The one-command check fails for a reason unrelated to the course. | Make the script choose the alternative port when 8796 is taken, or change the default. | S | Agent | #20 |
| F59 | S | Checks | Two native suites fail on `main`. `tests/progress.spec.cjs:139` expects a heading "Your course journey" that the page did not show. `tests/starting-point.spec.cjs:57` expects a button "Continue: Give AI the right background"; that label appears in the test and an old prototype, not in current source. The cause is not diagnosed: either the tests kept old wording after the unit restructure and the 6 November renaming, or the signed-in pages regressed. The 6 November release record ran onboarding on the fixture but not these two suites. Each suite stops at its first failure, so 16 native checks have not run on `main`. | V: suite output 10 Nov; `grep` for the label. I: both possible causes. | Signed-in journey and starting-point behaviour on `main` has no current passing run, so #24 and #25 cannot be closed on test evidence. | Diagnose each failure against the plan's intended behaviour and decide page or test. Do not loosen a test to make it pass. Rerun both suites in full. | S | Agent | #20, #24, #25 |
| F52 | S | Checks | No test asserts the robots header, although `readiness.md` says to update "the public test's header expectation". | V: no match for `X-Robots-Tag` in `tests/` | The Stage A switch has no automated guard. | Add the assertion with F01. | S | Agent | #9 |
| F53 | S | Merge gate | The runbook names CLI 2.1.293 and two built-in plugins. The installed CLI is 2.1.319 with a third, `cc-plugin-privacy`. The login expires on 8 December 2026. The result of running the gate on this report's PR is recorded on that PR. | V: `claude --version`; `docs/operations/claude-pr-review.md:23,64`; #23 comment 9 Nov | A reviewer following the runbook must reject every run. | Re-audit the flags and update the runbook (D8). | S | Agent | #23 |
| F54 | S | CI | The workflow is not published. It needs a login with the `workflow` scope. | V: no `.github/workflows/`; #10 | Checks run only when an agent runs them. | `gh auth refresh -s workflow`, then publish and record one passing run. | S | Finlay, then Agent | #10 |
| F55 | S | Records | `CONTROL.md` is dated 6 November. It names plugin `2026102402` and edition `2026-10-24.3` as live (now `2026110601` and `2026-11-06.1`), says the phone-form fix "goes on" #9 (it is published), describes delivered work as "Next", lists delivered account storage on the wishlist, and uses a single launch date. | V: `CONTROL.md:3,7,28,29,140-142,160` | — | Rewrite the status sections for the two stages. | M | Agent | #9 |
| F56 | S | Records | `docs/trial/RUNBOOK.md:60` tells the reader to run bare `npm test`, which now targets the live site. `PUBLIC-DEPLOYMENT.md:53-59` gives an outdated live test sequence, and line 67 still requires off-server backup rotation, which Finlay's later decisions replaced. | V: files and lines cited; `package.json` `test` script | An operator could write synthetic data to the live site. | Correct both files. | S | Agent | #20 |
| F57 | S | Records | `README.md` lists three activities with an old name and mixes dated status paragraphs with current ones. `docs/operations/onboarding.md:3,117` describes the pilot gate and welcome mail as not yet enabled; both are enabled. `readiness.md:3` points to the 23 October record as owning results. The plan's header and four sections predate PR #36. | V: `README.md:11-33`; `onboarding.md:3,117`; `readiness.md:3`; plan lines 4, 124-128, 404, 465 | — | One records PR. | M | Agent | #9 |
| F58 | S | Issues | No issue lists the Stage A gates. #9, #15, #19, #20 and #24 have bodies that describe merged work as open. #15, #24 and #25 shipped but their acceptance evidence is not linked. The uptime gate, the breach runbook and the retention task have no issue. | V: issue bodies and comments read 10 Nov | Hard to see what is left. | Comment on #9 with the Stage A list. Link evidence on #15, #24, #25 and recommend closure or a narrowed remainder. | S | Agent | #9 |

## 4. Issue triage

| Issue | Class | Reason | Done means | Next action | Who |
|---|---|---|---|---|---|
| #4 Email, recovery, support | Stage B blocker | It is the Stage B gate. Only owner mail is verified. | A consenting person other than Finlay receives and completes confirmation, welcome and recovery; support capacity and retention are accepted and dated. | Arrange the recipient; F12–F16, F26, F27. | Finlay; Agent records |
| #5 Human pilot | Stage B blocker | No participants yet. Readiness allows a "limited beta" label without it. | 3–5 consenting people complete the protocol; counts, help given and barriers recorded privately; blocking faults fixed. | Select and invite (after F18). | Finlay |
| #6 Expand from evidence | Later | Depends on #5. | A recorded choice of at most three improvements, each tied to an observation. | Wait. | Finlay |
| #9 Launch | Stage A blocker (carries Stage B) | The only launch issue; it predates the two stages. | Stage A: sections 3 and 7 complete and the switch recorded. Stage B: #4, #5 and the confirmations. | Post the Stage A list. | Both |
| #10 GitHub Actions | Launch improvement | Local checks are the gate. | The workflow file exists and one run passes on `main`. | `gh auth refresh -s workflow`. | Finlay |
| #12 Free AI assistants | Launch improvement | The tool guidance is from documentation, not hands-on runs. All 80 records are unrun. | A dated matrix for five assistants; the guide updated. | Finlay runs sessions with the prepared protocol. | Finlay; Agent records |
| #13 Listen to Finlay | Later | Needs recordings. | One page with a player, transcript and fallback. | Agent drafts a script for one page. | Finlay |
| #15 My context | Done, needs evidence | Merged and live. | Six acceptance items linked to current checks; device checks moved to #5. | Link evidence; recommend closure. | Agent; Finlay closes |
| #16 Portfolio images | Launch improvement | Assets exist, not placed. Optional. | The six-item checklist in the issue. | One PR, after the F35 changes to the same page. | Agent |
| #19 Programme index | Later | Tracker only; body is stale. | Parents closed. | Refresh the text. | Agent |
| #20 Delivery quality | Launch improvement | Holds deferred review items and F51, F56. | Deferred items fixed or re-decided; #23 and #10 closed. | Fix with the next change to that code. | Agent |
| #21 Voice support | Later | Parent of #13, #28, #29. | Children closed; device checks recorded. | F15 notice only. | Finlay (devices) |
| #23 Merge gate | Launch improvement | Used on every merge; runbook is out of date. | Runbook matches the installed CLI; enforcement built or split out. | F53. | Agent |
| #24 Signed-in journey | Done, needs evidence | Live. One acceptance line was replaced on 25 October. | Each clause mapped to a passing check; F32 fixed. | Link evidence. | Agent |
| #25 Starting-point check | Done, needs evidence | Live. Wording review not recorded. | Test evidence linked; Finlay's review dated. | F18. | Finlay |
| #26 Guided portfolio progress | Later | States it is not a launch requirement. | A prototype Finlay has inspected. | None now. | Agent, then Finlay |
| #27 Glossary, objectives | Later, except objectives | F36 delivers the objective part with existing text. | Objectives on each activity page; glossary reviewed on one page first. | F36. | Agent |
| #28 Local transcription | Later | Needs device checks. | Checks recorded; guidance published. | None now. | Finlay |
| #29 Dictation scoping | Later | Scoping only. | An options note; Finlay selects. | None now. | Agent, then Finlay |

No open issue duplicates another. #13, #28 and #29 are parts of #21. #12, #26 and #27 are parts of #6. There are no open pull requests.

## 5. Improvement suggestions

Ranked by learner value against effort. None adds an activity or a completion rule.

1. **Teach the next goal** (F31). Displaces the "separate records" paragraph, which moves to `/help`.
2. **Fix the next buttons and add a course close** (F32). Displaces nothing.
3. **Make the portfolio read as the result** (F30). Replaces one label.
4. **Show each activity's aim and self-check on its own page** (F36, #27). Uses text that already exists; replaces the "Why this helps" line where it repeats.
5. **One name per activity** (F33).
6. **Move research commentary off learner pages** (F34). Shortens three pages.
7. **Say who made the course and why** (F06). Needs Finlay's words; replaces the storage paragraph on the home page.
8. **Tips once per page** (F35).
9. **Record "how I checked what the AI received"** (F37). One line added to an existing field's hint.
10. **Place the portfolio images** (#16). Optional; do after 8.

## 6. Uptime monitor: recommendation

Finlay signs up; the agent does not. Recommended: **UptimeRobot**, free plan (confirm its current terms). Reasons: it checks from outside the server and outside Cloudflare, it needs no software on the server, and it sends email alerts.

| Check | Type | Address | Expect | Tells you |
|---|---|---|---|---|
| Public course | Keyword | `https://orientation.finlaymccall.com/` | 200 and the text "Human AI Orientation" | Cloudflare, system Caddy and the course web server work |
| Sign-in page | Keyword | `https://orientation.finlaymccall.com/login/index.php` | 200 and the text "Log in" | PHP and the database work |
| AI context | HTTP | `https://orientation.finlaymccall.com/ai/context.md` | 200 | The scripted-client rule works |

Interval: 5 minutes. Alert: email to Finlay after two failed checks. If Cloudflare challenges the monitor, the checks will show as down; allow the monitor in the same Cloudflare rule. Optional later: a heartbeat check that Moodle cron pings each run, which also covers a full disk (F23).

## 7. Launch plan

Each agent package is one small PR on the named issue, with tests, records, the merge gate, and publication to the preview with before-and-after snapshots. Finlay's items are in his list.

**To Stage A**

| # | Package | Issue | Scope | Checks | Who |
|---|---|---|---|---|---|
| A0 | This report | #9 | Two review documents; `CONTROL.md` pointer | Merge gate | Agent |
| A1 | Records and safety | #9, #20 | F59 first; F55–F57, F51; Stage A list on #9 (F58) | `check:public`; links | Agent |
| A2 | Discoverability, prepared | #9 | F01–F05, F52: scoped robots, sitemap, 404 page, favicon, canonical and share tags. The switch stays off behind `noindex`. | New header and sitemap tests; metadata suite; private-path denials | Agent |
| A3 | Journey and names | #9, #24 | F32, F33, F38 | Entry, structure, portfolio suites; fixture publishers twice; IDs unchanged | Agent |
| A4 | Outcome | #9 | F30, F31 | Portfolio suite; saved-field IDs unchanged | Agent |
| A5 | Relevance | #9 | F34, F35 | Tips and portfolio suites | Agent |
| A6 | Operations | #9 | F21, F22, F45; F43 headers; F44 prepared | Service restart on the preview; route checks | Agent; Finlay applies F44 |
| A7 | Finlay's items | #9 | His Stage A set: items 1, 2, 3, 9, 12, 15 and 23 in [his list](2026-11-10-finlay-contributions.md#do-these-first) (D1–D4, F02, F04, F07, F10, F11). Author text (item 17) is optional. | Recorded with dates | Finlay |
| A8 | Stage A switch | #9 | Remove global `noindex` in favour of the A2 policy; apply the Cloudflare rule; check routes; update records | Header test; browser checks; release record | Finlay decides; Agent prepares and checks |

Optional before A8 if time allows: F36 (objectives), F41, #16.

**To Stage B**

| # | Package | Issue | Scope | Who |
|---|---|---|---|---|
| B1 | Privacy mechanisms | #4 | F12–F15: retention log and checks, breach procedure, request runbook, feedback clean-up, notices | Agent; Finlay approves wording |
| B2 | Confirmations | #4 | The Stage B items in the compliance record; F16, F17, F27; legal review if Finlay chooses | Finlay |
| B3 | Genuine mail | #4 | One consenting recipient: confirmation, welcome, recovery; F26 course name | Finlay; Agent records |
| B4 | Abuse limits | #4 | F47, F24 | Agent; Finlay decides CAPTCHA |
| B5 | Pilot | #5 | F18, then invitations; observations; at most three fixes | Finlay |
| B6 | Quality | #10, #23 | F53, F54 | Agent; Finlay for the token |
| B7 | Open registration | #9 | The gated `open` operation; wording updated together; release record | Finlay decides |

## 8. Checks run on 10 November

All synthetic. Run from a clean worktree of `main` at `0920072` unless noted.

| Check | Result |
|---|---|
| `python3 -m unittest discover -s tests` | 28 passed, 0 failed |
| `npm run check:public` | Build with no drift; support 6 passed; deploy 3 passed; journey lifecycle 6 passed; entry 11 passed; metadata 7 + 2 passed; then **stopped** at the portfolio step (port 8796 in use, F51) |
| `ORIENTATION_PORTFOLIO_PORT=18816 npm run test:portfolio` | 8 passed |
| `npm run test:feedback` | 6 + 32 passed |
| Fixture: `test:onboarding` | 11 passed |
| Fixture: `test:progress` | **1 failed, 4 passed, 11 did not run** (the suite stops at the first failure) |
| Fixture: `test:starting-point` | **1 failed, 2 passed, 5 did not run** |
| Fixture: `test:welcome` | 5 passed |
| Fixture: `test:wb10` | 2 passed |
| Live page checks (20 routes, read-only) | See F40, F41, F44 |

The live suite `npm test` was not run. The fixture server was not running. The agent started it from the documented command against the existing synthetic fixture, whose plugin source matched `main`, and stopped it afterwards. Mail was captured locally; none was sent.

## 9. Not covered

- **Screen readers, real phones and tablets, physical microphones, Safari and iOS.** Not available to an agent.
- **Real 200 % browser zoom.** A 640-pixel viewport was used instead.
- **Full keyboard walk of every control.** The first 40 Tab stops per page were checked for order and visibility; focus-indicator contrast was not measured.
- **Signed-in pages on the live site.** No live account was used. Signed-in behaviour comes from the fixture suites.
- **Live Moodle settings held in the database** (student role permissions, log lifetime, feedback retention value, client-address handling, the notifications page). The agent does not read the learner database. Only the documented read-only `status` command was run.
- **System Caddy configuration and logs, Cloudflare zone settings, the host's backup settings.** No sudo and no account access.
- **Genuine mail delivery.** Nothing was sent.
- **Whether the Privacy Act applies, and legal sufficiency of the policy.** Needs a qualified person.
- **External link targets** on learner pages, and hands-on behaviour of the AI tools named on `/free-tools` (#12).
- **Human comprehension.** No person has used this version. Nothing here is a learner observation.
