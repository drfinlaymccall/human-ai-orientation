# Course review and fix log

This is the ongoing course-review record. The [forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md) remains the single implementation plan; this log traces feedback to decisions, changes and actual rechecks. Reuse [launch issue #9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Do not mark feedback Fixed until the implementation and verification evidence are linked.

## 23 October 2026 — reusable writing Tips

**CR15:** Finlay requested reusable prompts on the context preview and a speak-instead-of-type reminder for every writing box, preferably in right-hand floating panels. Delivered a shared Tips component: sticky side panel where there is room, stacked panel on narrow screens, a short hint beside each editable learning textarea, device setup and three original copyable starters. Read-only outputs are excluded; all prompts remain readable without JavaScript. This support is distinct from the separate course-navigation/My context panels.

**Verification:** six focused public, eight portfolio and two native fixture checks passed; native copy actions preserve drafts and native reflection still completes normally. The older broad progress suite was incompatible with the shared fixture's newer navigation and is not counted as a pass. Native publishers preserve learner records/answers. See [source, reuse and evidence](../curriculum/finlays-tips.md). Owner usability recheck and physical-device dictation remain pending; browser checks do not establish learning gain.

## 23 October 2026 — landing page and course journey

**Source:** Finlay's transcribed voice note while reviewing the deployed course as a learner, followed by his explicit selection of six statements with two ratings each. The following paraphrases his feedback; they are not verbatim quotes or independent pilot observations. Canonical site: `https://orientation.finlaymccall.com/`.

| ID | Need / feedback | Decision and planned acceptance | Plan unit | Evidence state |
| --- | --- | --- | --- | --- |
| CR1 | Cannot tell whether signed in from home | Show resolved account state and a direct account/journey action; honest fallback if unavailable | U1, U3 | Implemented in preview; [public-state and real endpoint rechecks](../qa/2026-10-24-course-review-rehearsal.md) pass. Owner usability recheck pending |
| CR2 | Progress view is vague; illustration is missing | Your course journey is the central private atlas, with native completion and Continue | U3 | Implemented in preview; [native atlas/current-user evidence](../releases/2026-10-23-course-review-implementation.md#u3--private-journey-and-native-navigation) recorded. Final combined regression and owner recheck remain |
| CR3 | Dashboard, My courses and upper navigation distract | Simplify ordinary learner navigation across the native journey; preserve staff/account/Help/sign-out controls and deep links | U1, U3 | Implemented in preview; native learner/staff/other-course checks recorded in the U3 receipt. Final combined regression and owner recheck remain |
| CR4 | Likes Explore your course; next click is unclear | Public splash leads to public journey; signed-in home leads to personal journey; retain accepted artwork and activity labels | U1, U3 | Implemented in preview; [entry rechecks](../qa/2026-10-24-course-review-rehearsal.md) pass. Owner first-impression review pending |
| CR5 | Selected activity action appears too far below | Side details on desktop; nearby expanding details on mobile; readable no-JavaScript route | U1 | Implemented in preview; side/adjacent layout, no-JavaScript and all-five-choice natural keyboard traversal rechecked at 1440/390/320px. Owner usability recheck pending |
| CR6 | Wants a short starting-point competence check | Optional native self-report: six statements, each understanding and can-do 1–5, plus uncertainty/skip; no pass/fail | U8 | Implemented in preview; [synthetic neutral/ownership/version evidence](../releases/2026-10-23-course-review-implementation.md#u8--native-starting-point-implementation-and-early-neutral-proof) recorded. Owner wording/usability recheck pending |
| CR7 | Wants recommended/adaptive journey | Explain one practice suggestion from self-ratings, preserve choice, real completion and prior attempts | U8 | Implemented in preview; deterministic and native self-report/Continue separation checks pass. Owner wording/usability recheck pending |
| CR8 | Wants synthetic registration and usability review | Fresh captured-mail fixture walkthrough through registration/check/practice/return/recovery, plus public read-only review | U2, U9 | [Complete revised synthetic flow](../qa/2026-10-24-course-review-rehearsal.md) passed in the preview; ten onboarding scenarios pass, including captured recovery/new-password return. Finlay's review and human pilot remain pending |
| CR9 | Likes Introduction / Your course section names | Retain these native headings through publication/navigation changes | U3 | Already published by section-label change; retain in recheck |

**GitHub check:** reviewed returned repository issue bodies and comments on #6/#9. No dedicated competency-check issue was found. Earlier entry-check ideas are in the design brief, competency draft and later-work section of the forward plan; the bounded six-pair feature is now U8. Full personal skills/evidence tracking remains later work. Other threads' provider evaluation (#12) and narration (#13) remain their existing items.

**Existing evidence:** [current release receipt](../releases/2026-10-23-launch-implementation.md) includes the prior synthetic suites and genuine owner-controlled account flow. It does not prove the proposed personal atlas, navigation changes, quiz or recommendations. Finlay's current walkthrough is owner feedback; the 3–5-person pilot remains pending.

**Next review:** finish combined integration checks and the U9 complete synthetic rehearsal, then Finlay checks the revised first impression and saved-rating wording before the human pilot/public launch. Use [the agent guide](../qa/course-review-agent.md) and [report template](../qa/course-review-report-template.md). These preview rechecks do not establish that the production site has changed.

## Adding the next review

Append a dated section with the feedback source, new stable CR IDs, decision or open question, linked plan unit/issue, implementation reference and actual verification outcome. Keep reported behaviour, agent judgement and human pilot findings distinguishable. Preserve earlier evidence rather than rewriting it as if a later change already passed.

## 23 October 2026 — portfolio briefing and question clarity

**Source:** Finlay's voice-input review exported as three individual Markdown documents and a combined portfolio, followed by his request to frame the exercise as briefing a new assistant. This is owner feedback; the submitted documents remain private and are not published as a learner profile.

| ID | Need / feedback | Change or next decision | Evidence state |
| --- | --- | --- | --- |
| CR10 | Help learners imagine whom they are briefing and why | New-assistant role-play; discuss interests, situation, communication and checks, with relevant detail and learner choice | Copy published publicly/native; owner usability recheck pending |
| CR11 | Replace vague headings and unspecified references with answerable questions | All twelve boxes now ask clear questions with fictional examples; no-JavaScript/interview routes match; first three answers make a small first briefing | Eight existing portfolio checks passed; submitted individual/combined bodies match; native structure/evidence preserved |
| CR12 | Form fatigue; wants visible output/progress and one step at a time | Small first pass and optional later sections delivered in guidance. Live preview/sidebar and guided progress remain an interaction improvement to scope from the recheck | Partial: wording delivered; preview/progression UI not implemented |

The revision preserves field keys, existing drafts/backups, export headings and completion. A new field label does not reinterpret stored answers. Role-play copy avoids promising general AI competence, lasting memory or automatic computer access. See [portfolio authoring/evidence](../curriculum/portfolio-builder.md#implementation-and-verification-record). The broader landing/personal journey/check plan remains unchanged; this is focused portfolio clarity work within the existing activity audit.

## 23 October 2026 — course panels and saved creations

**Source:** Finlay's screenshot question about unused side margins, followed by acceptance of course/lesson panels and an explicit request to store small learner-created context files inside Moodle rather than connect an external drive. This is owner direction, not an observed learner outcome.

| ID | Need / feedback | Decision and planned acceptance | Evidence state |
| --- | --- | --- | --- |
| CR13 | Use side space for lesson navigation and course progress | Keep readable lesson width; use responsive collapsible/sticky panels on desktop and compact mobile controls. Course progress reflects native completion; reading position is separate | Delivered responsive course panel with native progress/Continue and course-guide links; within-lesson reading-position tracking remains separate |
| CR14 | Carry creations throughout the course and return to their courseware | Private Moodle **My context** workspace: save, open, edit, copy, download and source-activity links; cross-visit/device availability; visible save state, isolation and recoverable failures | Delivered U10; [synthetic and live release evidence](../releases/2026-10-23-context-workspace.md), including privacy, conflict and failed-save recovery |

Moodle is the primary store; Google Drive/Dropbox are optional later extensions. Copy is primary and optional Markdown download remains available. Existing portable backups remain compatible; editing alone keeps a temporary draft, while Save to My context persists it. Personal creations remain distinguishable from shared course references. Opening/saving work does not imply completion, proficiency or automatic AI access.

## 23 October 2026 — course profile follow channels

**CR16:** Finlay wants people to keep up with course changes, new educational offerings and human–AI collaboration ideas. He prefers LinkedIn and potentially X, and does not plan a Substack newsletter. Published a shared Keep in touch section on the public course profile and native course summary with the existing verified LinkedIn URL and website. No email subscription is added. X remains optional pending its profile URL. See the [release record](../releases/2026-10-23-context-workspace.md).

## 24 October 2026 — WB23 rationale and WB10 whole-learner rehearsal

**CR17:** Finlay approved a prominent human–AI teaming rationale, overall objectives, native welcome mail and matching in-course guidance before the full learner rehearsal. Shared copy now connects entry, welcome, activity purpose and public AI guidance. Native sending has explicit course-method controls; manual/invited learners have equivalent in-course guidance. The [WB23/WB10 receipt](../qa/2026-10-24-wb23-wb10-rehearsal.md) records five captured-mail checks, twenty source assertions and the complete two-learner rehearsal.

The rehearsal completed practice, reviewed-context storage/reuse, account recovery, a mobile skip path and no-JavaScript editing without changing existing IDs/history. Native filtering added an unintended legacy-page link to welcome prose; supported `nolink` wrappers corrected it. Visual inspection also caught a transient sign-in prompt while context status was unresolved; its initial wording is now neutral, with focused red/green proof. Selector/synchronisation and `noscript` matcher failures are documented as test issues. Human comprehension, consenting-recipient receipt and production promotion remain separate gates under the existing launch/onboarding issues.

## 25 October 2026 — practical first-task examples

**CR18 · Source:** Finlay's review of the live version on 25 October 2026. He asked for opening examples that would interest his initial cohort, drawing on uses people have already brought to him. This is owner feedback, not a measured learner result.

**Decision and change:** replace the invitation/shopping-list/unfamiliar-idea suggestions in Activity 1 with feedback or complaint letters, social media posts, practical advice on fixing something or completing an everyday task, and finding a recipe. Keep the existing checkable-result guidance and fictional book-swap worked example. This is a focused content revision under the existing course review (#9); the shared fragment supplies both public and native activity content.

**Verification/publication:** `npm run build:journey` rebuilt the shared native fragment and public page; its diff is confined to the requested opening paragraph. `scripts/php scripts/sync-journey.php` published to the existing live course and reported unchanged learner evidence and module IDs (5/6/7/8). A read-only database check confirmed all four revised example phrases in native Activity 1, module 6. The existing portfolio suite's desktop/mobile/no-JavaScript course-page check passed (one test). Live HTTPS `/first-task` returned 200 at 1440px and 390px without JavaScript; both browser checks found the revised examples and no horizontal overflow. Screenshots are local `/tmp/orientation-first-task-1440.png` and `/tmp/orientation-first-task-390.png`. Initial sandboxed attempts could not connect to Moodle's database or bind the temporary preview server; permitted execution completed both checks. Finlay's recheck and human-pilot evidence remain outstanding.

## 25 October 2026 — recognisable course links

**CR19 · Source:** Finlay requested the small visual link cue he likes in ChatGPT as the default for course hyperlinks, and supplied the clarification for Activity 1's AI-tool link.

**Decision and change:** use a small decorative chain icon after course text links through `link-icons.css`, imported by the public `site.css` and shared public/native `course-context.css`. This also covers the `/ai/` resource, which has the public stylesheet but no workspace assets. The icon uses the link's colour, requires no JavaScript and adds no text to its accessible name. Moodle dropdown carets, stretched hit areas, hidden skip links and button-role actions retain their own affordances. Activity 1 now says: “Open the AI tool you use (click for advice on free ones) in another tab.” The linked words remain “AI tool you use”, pointing to `/free-tools`.

**Author/operator guidance:** new course text links inherit the cue automatically when using the shared course assets; authors need no icon markup. This presentation/copy change leaves the design brief's requirements and the existing publication procedure unchanged. No new automated tests were added for this reversible styling change; the existing responsive course-page check and focused browser inspection supply replacement verification. A separate simplification pass was unnecessary for fewer than 30 substantive code lines.

**Verification/publication:** `npm run build:journey` rebuilt the shared native/public activity. The existing portfolio desktop/mobile/no-JavaScript course-page test passed (one test). A live read-only browser check covered 13 public routes at 1440px and 390px, all returning 200 with decorated text links and no horizontal overflow, with JavaScript disabled. Exact accessible link-name and requested-sentence assertions passed. Structural native-region and dropdown-exclusion checks used the served stylesheet; forced-colour checks passed. Screenshots are local `/tmp/course-links-1440.png` and `/tmp/course-links-390.png`. The first browser pass found the `/ai/` stylesheet gap; the shared imports corrected it and all 26 final page checks passed. These are browser/structural checks, not a signed-in native browser walkthrough or a human accessibility assessment.

The live public pages serve the new styles directly. The supported journey publisher updated Moodle and reported unchanged learner evidence and module IDs (5/6/7/8). A read-only check verified the exact native Activity 1 sentence and the installed native hook's shared-stylesheet inclusion. Separate correctness/project-standards review contexts found no actionable source issues in the final eight-file scope. The source PR remains draft pending the repository's separate Claude CLI review before merge; that gate is not represented as completed. Owner visual acceptance and the human pilot remain outstanding.

## 25 October 2026 — consistent example identification

**CR20 · Source:** Finlay's screenshot review requested that the book-swap prompt be clearly marked as an example, using the same identification and format as the preceding example.

**Decision and change:** the sample prompt now appears as a blockquote beginning “Fictional example:”, matching the success-criterion example. The invented response in the optional no-AI route carries the same label. The practice-record template remains a template. The shared fragment supplies the public and native activity; CONTROL.md records the change. No broader design or operating instructions change. This is a small presentation/copy correction under course review (#9); no new test files are needed.

**Verification/publication:** `npm run build:journey` and `git diff --check` passed. Live HTTPS browser checks at 1440px and 390px with JavaScript disabled confirmed three consistently labelled blockquotes, the exact prompt text, a visible labelled invented response when expanded, the retained practice-record template and no horizontal overflow. Screenshots are local `/tmp/activity-example-1440.png` and `/tmp/activity-example-390.png`. Supported native publication reported unchanged learner evidence and module IDs (5/6/7/8); a read-only native content check confirmed the prompt markup and all three labels. The source diff was manually checked as a bounded copy/format revision; the shared outputs match the source. Source merge remains subject to the existing Claude review gate.

## 25 October 2026 — notes purpose and task relevance

**CR21 · Source:** Finlay's review of native notes setup (module 3) requested an explicit connection to controlling and reusing context across tools, removal of product-licensing commentary, backup detail and author verification metadata, and a relevance check in project guidance for all learner pages.

**Decision/change:** two introductory sentences link notes setup to the course rationale and learner control of what they keep, update and share. The requested background is removed from learner copy and retained in [preparation authoring records](../curriculum/preparation-and-tips.md#revision--25-october-2026-notes-purpose-and-task-relevance). The existing-notes-app alternative remains. AGENTS.md/CONTRIBUTING.md add the page-relevance check; design-brief R27 and CONTROL.md match. This is a focused course-review (#9) follow-up, not a full-course audit.

**Verification/publication:** shared preparation/journey builds and `git diff --check` passed, with generated changes confined to notes. Four live public browser checks (1440px/390px, JavaScript enabled/disabled) passed: rationale and its link present, requested removals absent, alternate notes-app route/four setup steps/context template retained, no overflow or browser script errors. Native module 3 was updated through `page_update_instance` after matching its previous shared fragment; its navigation suffix was preserved and exact read-back passed. Before/after fingerprints preserved every module record, lesson answers/attempts and completion; repeated publication reported already-current content. Full evidence is in the linked authoring record. The copy/guidance diff was manually reviewed. Human understanding and physical-device setup remain untested by this content revision; the existing pre-merge Claude review gate remains outstanding.

## 25 October 2026 — context panel timing

**CR22 · Source:** Finlay requested that notes setup omit the right-hand My context panel, because learners have not started creating course context. He suggested introducing it during the useful-task/background activities.

**Decision/change:** suppress the panel on public notes setup and the native notes Page, including no-JavaScript native rendering. Keep it available on Try AI on a useful task and later context activities, along with ordinary workspace links. The account client remains active to preserve account/draft handling; omitting the panel also removes the reserved gutter. No learner context, activity content or completion changes. CONTROL.md and workspace operating guidance record the boundary. This is a reversible presentation change; existing client/layout checks and focused public/native browser verification replace new persistent test files.

**Verification/publication:** all 17 existing deterministic account/draft client checks, two public-integration checks, the public panel-layout check and the native panel/Copy layout check passed. Initial native attempts exposed a stale fixture component cache and an upgrade cache-directory problem; the supported fixture upgrade and cache refresh resolved them, and the final native run exited cleanly with one test passed.

Eight direct browser cases covered live public notes and signed-in synthetic native notes at 1440px/390px with JavaScript enabled/disabled. Notes had no panel or reserved gutter, and no overflow or script errors. The useful-task panel remained visible in native views and JavaScript-enabled public views; the existing public no-JavaScript navigation fallback remained. Screenshots are local `/tmp/notes-no-panel-{native,public}-{1440,390}-{js,nojs}.png`.

The supported plugin installer published the native change; its upgrade check reported no version upgrade needed (2026102402 retained). Read-only invocation of the installed live footer hook confirmed notes suppression and retained useful-task/portfolio panels with shared assets. Before/after hashes confirmed unchanged module records, lesson answers/attempts, completion and saved context. No Page content was republished. The small client/hook diff was manually reviewed. Signed-in native browser evidence is synthetic, not a live learner session or human accessibility trial. The existing independent Claude review gate remains required before source merge.
