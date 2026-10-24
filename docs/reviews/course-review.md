# Course review and fix log

This is the ongoing course-review record. The [forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md) remains the single implementation plan; this log traces feedback to decisions, changes and actual rechecks. Reuse [launch issue #9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Do not mark feedback Fixed until the implementation and verification evidence are linked.

## 23 October 2026 — landing page and course journey

**Source:** Finlay's transcribed voice note while reviewing the deployed course as a learner, followed by his explicit selection of six statements with two ratings each. The following paraphrases his feedback; they are not verbatim quotes or independent pilot observations. Canonical site: `https://orientation.finlaymccall.com/`.

| ID | Need / feedback | Decision and planned acceptance | Plan unit | Evidence state |
| --- | --- | --- | --- | --- |
| CR1 | Cannot tell whether signed in from home | Show resolved account state and a direct account/journey action; honest fallback if unavailable | U1, U3 | Planned; not rechecked |
| CR2 | Progress view is vague; illustration is missing | Your course journey is the central private atlas, with native completion and Continue | U3 | Planned; not rechecked |
| CR3 | Dashboard, My courses and upper navigation distract | Simplify ordinary learner navigation across the native journey; preserve staff/account/Help/sign-out controls and deep links | U1, U3 | Planned; not rechecked |
| CR4 | Likes Explore your course; next click is unclear | Public splash leads to public journey; signed-in home leads to personal journey; retain accepted artwork and activity labels | U1, U3 | Planned; not rechecked |
| CR5 | Selected activity action appears too far below | Side details on desktop; nearby expanding details on mobile; readable no-JavaScript route | U1 | Planned; not rechecked |
| CR6 | Wants a short starting-point competence check | Optional native self-report: six statements, each understanding and can-do 1–5, plus uncertainty/skip; no pass/fail | U8 | Implemented in preview; [synthetic neutral/ownership/version evidence](../releases/2026-10-23-course-review-implementation.md#u8--native-starting-point-implementation-and-early-neutral-proof) recorded. Owner wording/usability recheck pending |
| CR7 | Wants recommended/adaptive journey | Explain one practice suggestion from self-ratings, preserve choice, real completion and prior attempts | U8 | Implemented in preview; deterministic and native self-report/Continue separation checks pass. Owner wording/usability recheck pending |
| CR8 | Wants synthetic registration and usability review | Fresh captured-mail fixture walkthrough through registration/check/practice/return/recovery, plus public read-only review | U2, U9 | Existing account checks recorded separately; revised flow untested |
| CR9 | Likes Introduction / Your course section names | Retain these native headings through publication/navigation changes | U3 | Already published by section-label change; retain in recheck |

**GitHub check:** reviewed returned repository issue bodies and comments on #6/#9. No dedicated competency-check issue was found. Earlier entry-check ideas are in the design brief, competency draft and later-work section of the forward plan; the bounded six-pair feature is now U8. Full personal skills/evidence tracking remains later work. Other threads' provider evaluation (#12) and narration (#13) remain their existing items.

**Existing evidence:** [current release receipt](../releases/2026-10-23-launch-implementation.md) includes the prior synthetic suites and genuine owner-controlled account flow. It does not prove the proposed personal atlas, navigation changes, quiz or recommendations. Finlay's current walkthrough is owner feedback; the 3–5-person pilot remains pending.

**Next review:** implement U1/U3 first; Finlay checks first impression; then U8/U4 and the U9 complete synthetic rehearsal before human pilot/public launch. Use [the agent guide](../qa/course-review-agent.md) and [report template](../qa/course-review-report-template.md).

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
