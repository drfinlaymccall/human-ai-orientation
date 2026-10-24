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
