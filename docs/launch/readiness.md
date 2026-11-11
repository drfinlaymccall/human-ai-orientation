# Pilot and public-release handoff

This is the operator handoff for the [forward plan](../plans/2026-10-23-002-feat-public-launch-plan.md). Observed results are owned by the dated release records; the newest are listed in the status block of [`CONTROL.md`](../../CONTROL.md), and the [10 November launch audit](../reviews/2026-11-10-launch-audit.md) lists what each stage still needs. The [23 October record](../releases/2026-10-23-launch-implementation.md) holds the original implementation results. Prepared materials and synthetic checks do not establish human participation or mail receipt.

## Two stages — approved 6 November 2026

**Stage A: open the anonymous course.** Registration stays closed. Before opening, Finlay accepts the privacy policy wording and confirms the items in the [privacy compliance mapping](../operations/privacy-compliance.md) that apply to anonymous visitors, because the policy covers them too. He decides the date, then the operator changes one line in `deploy/Caddyfile` from `import robots-preview.caddy` to `import robots-stage-a.caddy` (prepared on 11 November 2026; see the [release record](../releases/2026-11-11-search-and-sharing.md)), applies `deploy/cloudflare-ai-context-rule.json` and checks the public routes. Stage A collects no account data. Since 11 November 2026 a visitor may choose to leave an email address on the [notify list](../operations/notify-list.md); Finlay read and approved that wording on 11 November 2026. Still open, not a gate: his answer on deleting old addresses by hand within 24 months; no address can be that old before November 2028.

**Stage B: open registration.** Open only after email, recovery, support and operating checks are recorded, and after Finlay confirms the items in the [privacy compliance mapping](../operations/privacy-compliance.md). Finlay accepted on 6 November that no restore test is required.

The rest of this page is the Stage B record.

## Limited pilot

The public course is readable without an account. Native registration may run in exact-address `pilot` mode for owner-controlled/consented mailboxes; this is distinct from broad registration. Follow [onboarding operations](../operations/onboarding.md) and [progress deployment](../operations/progress.md). Keep private review receipts, allowed addresses and observations under ignored `trial/`; never put passwords or confirmation/reset links in issues.

Finlay accepted the displayed information/support operating position for this pilot on 23 October, with retention to be revisited before broader launch. His local agent reports the dedicated test alias enabled and forwarding to a verified destination. Owner-controlled confirmation receipt and native activation are verified. Native enrolment reached the intended Lesson, and fresh-browser sign-in reached saved progress. Finlay received the learner-recovery email, reset the password and opened progress afterward. Read-only live checks verified the changed password, consumed reset record and continuing enrolment. The owner-controlled account check is complete. This owner-controlled check does not establish representative external-mail delivery.

Use the [pilot protocol](../pilot/PROTOCOL.md) for 3–5 consenting people. Finlay selects and invites them. Record actual counts, assistance and access barriers, including phone/app switching, returning to saved Moodle progress, downloading/restoring the portfolio and reusing selected context. Keep an available no-AI/fictional route. Fix blocking access, saving and recovery problems; choose at most three further changes from actual observations.

## Public V1 decision

Before setting T0, record:

- A working full acquisition/confirmation/enrolment and return journey, including representative consented confirmation and recovery receipt.
- Finlay's review of the course promise, support ownership/capacity, information-use wording and the retention position for broader registration.
- Actual pilot participation/findings, fixes and remaining physical-device/assistive-technology coverage limits. If unavailable, describe the release as a limited beta.
- Current local checks, matching source/generated content and AI-context versions, working public/signed-in links, and private-path protection.
- An external uptime check that alerts Finlay when the site stops responding. Finlay agreed on 11 November 2026 that this is also a Stage A gate; the monitor is not set up yet. The [7–8 November outage](../trial/PUBLIC-DEPLOYMENT.md#backup-and-recovery) went unnoticed for 36 hours.

Only then use the separately gated `open` operation. Update homepage/help/privacy/login wording together so it matches observed account availability. Choose and record T0; publish the whole V1 together. The [five LinkedIn drafts](linkedin-series.md) use relative intervals and await Finlay's review/publication.

## Discoverability and maintenance

The demo-wide `noindex, nofollow` policy remains deliberate until the public V1 decision. At that release, allow discovery only for intended public reading routes, public assets and the curated AI pack. Keep account/login/enrolment and private/runtime routes excluded; search directives do not replace access controls. Update the public test's header expectation alongside a reviewed Caddy change, validate and restart only the orientation web service, then check signed-out pages, metadata and private denials. Do not remove the global header without adding the intended scoped policy.

**Prepared 11 November 2026.** The scoped policy exists as `deploy/robots-stage-a.caddy`: every response keeps `noindex, nofollow` except the public course pages listed in `content/discovery.json`. `tests/test_discovery.py` checks both policies on a throwaway local server and fails if the switch line changes without the test being updated.

**Switched 11 November 2026.** On Finlay's decision the web server imports `deploy/robots-stage-a.caddy` ([record](../releases/2026-11-11-stage-a-switch.md); live checks on [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9)). To undo, change the line back to `import robots-preview.caddy`, validate, and restart only `orientation-web`.

GitHub Actions activation stays [issue #10](https://github.com/drfinlaymccall/human-ai-orientation/issues/10) until an authorised login publishes the prepared workflow and an actual run succeeds. This does not require production credentials. The owner-reported paid Contabo backup position is accepted; no new provider or restore exercise is part of this work. GitHub preserves product sources and design history, while private runtime/learner data remains outside the repository.

Finlay owns post-release monitoring and the weekly feedback review. Keep documentation, CONTROL.md, release evidence and the relevant existing issue in the same change. Retain native activity identities and historic completion meaning when updating content.
