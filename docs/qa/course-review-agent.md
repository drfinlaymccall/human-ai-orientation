# Local-agent learner journey review

Use this guide to navigate Human AI Orientation as a synthetic learner and check the [course-review feedback](../reviews/course-review.md). The [forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md) owns intended behaviour and recommendation rules. This guide supplies repeatable QA, not another implementation plan.

## Inputs and environment

- Repository: [drfinlaymccall/human-ai-orientation](https://github.com/drfinlaymccall/human-ai-orientation). At this guide's creation, launch/review planning is on `feat/public-launch`, draft [PR #14](https://github.com/drfinlaymccall/human-ai-orientation/pull/14); the new review features are not yet delivered. Record the actual commit/release tested.
- Public URL: `https://orientation.finlaymccall.com/`. This defaults to public reading/navigation only. An unimplemented proposed feature is Not yet implemented, not a claimed regression fix.
- Native synthetic environment: use the isolated fixture documented in [onboarding operations](../operations/onboarding.md), [progress operations](../operations/progress.md) and [reproduction](../REPRODUCING.md). The hosting machine previously used loopback port 18802; do not assume your local machine has its runtime/database or that the port is free.
- An operator provisions fresh labelled synthetic accounts and confirms captured-mail transport. Historical QA accounts may be suspended. Do not use Finlay's administrator/reviewer account, known owner mailbox account or old stored credentials.
- Read repository `AGENTS.md` and `CONTRIBUTING.md`. Fixture setup/account provisioning is a separate operator preflight; the learner walkthrough must not use admin/database knowledge to navigate around a problem.

If the fixture is unavailable, complete public checks and report native scenarios Not tested. Do not substitute live signup, real mail or private account access. Genuine mailbox checks require a separately authorised recipient/action; none is needed for this captured-mail rehearsal. Never broaden registration, change mail routing, invite participants, send support replies or publish posts as part of QA.

## Expected route and visible behaviour

1. Home introduces Human AI Orientation and its practical takeaway. An anonymous visitor sees Explore your course; a resolved signed-in visitor sees Your course journey and clear account state. If status cannot be resolved, the account link is honest and public reading still works.
2. `/journey` is the public illustrated atlas. Find my starting point explains the optional account-backed check and current limited registration, while choosing/publicly reading an activity stays possible.
3. `/local/orientation/index.php` is the canonical private Your course journey. Ordinary login lands here; an explicit activity/check link retains its intended destination through login/confirmation/enrolment.
4. The private atlas retains all five activity names and artwork, native completion, Continue and optional help. Desktop details are beside the map; mobile details/action are near the selected choice. Dashboard/My courses are unnecessary for ordinary navigation; account, Help and sign-out remain reachable.
5. Starting point is six statements × understanding/can-do ratings, twelve responses. No numeric defaults, grades or right/wrong claims. Not sure/Skip/unanswered remain unknown. Skip the whole check returns to the journey without finishing fabricated answers. An unfinished attempt can resume; an earlier finished suggestion remains dated and explained.
6. A finished check yields the plan's explainable suggestion, separate from Continue and completion. All activities remain selectable; completed low-rated work is offered as Revisit. Hidden/unavailable destinations must not produce dead links.
7. Native Page completion is learner-marked; Lesson uses its native resume/completion rules. Merely visiting or rating highly never completes practice. Account progress and context saving are separate: explicit Save to My context keeps signed-in documents; editing alone keeps a temporary draft. Downloaded files remain independent copies.

## Walkthrough matrix

| Case | Action | Acceptance evidence |
| --- | --- | --- |
| Public newcomer | Start at home in a clean context; say what the course offers and choose the visible next action | Clear offer/account action; journey is discoverable without guessing URLs; limited registration is honest |
| Five choices | Select each atlas place | Correct title/details/destination; action visible beside/near selection, no forced trip past the entire map |
| Mobile/keyboard | Repeat at 390px and 320px, then keyboard only | No horizontal overflow; readable labels/ratings, visible focus, logical order and usable controls; record observed issues |
| No JavaScript/status failure | Disable JavaScript; separately simulate blocked/timed-out account-state response in fixture | Readable public choices/links; neutral account fallback, no invented signed-out claim; private native journey remains usable |
| Fresh account | Follow visible journey/check or activity CTA → signup → captured confirmation in a fresh context → enrol | Intended destination reached without an extra test-inserted navigation; unconfirmed/duplicate/repeated/expired links have useful next steps |
| Ordinary versus deep login | Sign in from general account action; separately follow a specific Lesson/check link | General entry opens journey; explicit intended activity/check survives; no Dashboard detour |
| Short check | Answer both dimensions, use Not sure/Skip, finish partial answers; also skip whole check | Exactly six pairs, explicit anchors, no score/feedback colours, unknown retained; skip has no learning penalty |
| Suggestions | Use all low, all high, mixed, unknown and partial profiles from the plan's rule table | Exact expected activity and relevant explanation; disagreement between dimensions preserved; no completion award |
| Interrupted/retaken check | Leave mid-attempt, return/resume; finish a fresh retake; inspect older/incompatible instrument case | Previous finished suggestion dated while unfinished; history retained; no reinterpretation of an old scale |
| Progress and return | Mark a native Page complete; exercise Lesson resume; leave and sign in in a fresh context | Current-user state persists, Continue updates and portfolio storage explanation is accurate |
| Completed/unavailable work | Low-rate completed practice; test all-complete and hidden activity fixture cases | Revisit retains Complete; all-complete remains honest; unavailable baseline/target explained without dead links or changed requirements |
| Learner navigation/staff | Inspect journey, enrolment, quiz attempt/review, Lesson, Page and account routes; separate staff context | Consistent learner journey/Help/account controls; administrative access preserved |
| Two users/sign-out | A/B with different answers/progress; sign out, browser back and reload | No cross-user ratings/progress; personal state does not leak into cached/static public output or AI context |
| Captured recovery | Request fixture reset signed out, open captured mail in new context, reset then reopen journey; test invalid/consumed/expired link | Account works and destination is usable; tokens remain private; no real message sent |

Record initial confusion before consulting technical implementation. If you guessed a URL, used a bookmark/admin shortcut or received assistance, record it; do not count that as an unassisted pass. Test learner rendering with real fixture learner roles rather than administrator preview.

## Reporting and local-agent prompt

Use [the report template](course-review-report-template.md). Keep raw artifacts under ignored `trial/course-review/<run-id>/`; authenticated recordings/traces can contain cookies, tokens and private fields. Publish only reviewed fictional screenshots and a sanitised outcome summary. Link each CR item to implementation and actual retest evidence before changing its state to Fixed. Human pilot comprehension and physical devices remain separate checks.

Copy this prompt to the local browser agent, supplying the target release and permitted environment:

> Review Human AI Orientation as a synthetic learner. Read AGENTS.md, CONTRIBUTING.md and docs/qa/course-review-agent.md in the repository. Target public URL: https://orientation.finlaymccall.com/. First establish the checked-out commit and observed deployed release; do not assume the proposed review features are shipped.
>
> Follow learner-visible instructions without using implementation details to guess navigation or repair the site. Record unclear next actions, what you clicked and unexpected destinations. On the deployed site perform public reading/navigation only. Run registration, captured confirmation/recovery, ratings and completion scenarios only in the isolated synthetic fixture after its operator preflight; if unavailable report those as Not tested. Keep account access private and never use Finlay's administrator or owner mailbox account.
>
> Exercise the guide's desktop, mobile, keyboard, no-JavaScript, fresh-context and two-user cases. Check six paired ratings, exact recommendation examples, interrupted retake, actual saved progress and sign-out isolation. Do not send real mail, change configuration or silently fix failures. Produce the guide's report separating observed functional failures, agent usability concerns, passed and not-tested cases. Keep credentials, session links and raw authenticated artifacts out of chat/GitHub. Identify the concrete fix/retest needed; do not claim human learning outcomes.
