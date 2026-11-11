# Stage A switch — 11 November 2026

Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Need

The anonymous course was ready to be found by search and shared, with registration closed. Finlay chooses the date. Two gates had to pass first: the Cloudflare AI-context rule and an outside uptime alert.

## Decision

Asked "Once both Cloudflare jobs pass, shall I switch Stage A on today?", Finlay replied "Yes, today" (11 November 2026). The evidence that both gates passed is on #9, posted before this change was merged.

## Change

- `deploy/Caddyfile`: `import robots-preview.caddy` becomes `import robots-stage-a.caddy`. The public course pages listed in `content/discovery.json` no longer send `noindex`. Every other response still sends `noindex, nofollow`: sign-in, recovery, sign-up, course and account pages, plugin pages, files and unknown addresses.
- `tests/test_discovery.py`: the switch assertion now expects the Stage A policy. The local server test accepts either import line.
- Records: `CONTROL.md`, the readiness page and Finlay's list.

Not changed: registration, the acquisition mode, any Moodle setting, any learner record, any page wording.

## Verification

- Before merge: the discovery tests serve both policies on a throwaway local server; all Python tests and `npm run check:public`; `caddy validate`. Results are on the pull request.
- After the restart, the live checks from the switch check list are recorded on #9.

## To undo

Change the line back to `import robots-preview.caddy`, update the test assertion, validate, and restart `orientation-web`. Search engines may keep pages they have already read for some time.

## Remaining questions

- Stage B (registration) is separate and stays closed. Nobody has been invited and nothing has been posted.
- Not put to Finlay: the not-found page; the cut pointer on `/before-you-start`. Open: his answer on deleting old notify-list addresses by hand within 24 months; item 25 (front-server cache line).
- No pilot and no legal review have taken place.
