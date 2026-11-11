# Finlay's Stage A answers — 11 November 2026

Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Need

The launch audit left seven items that only Finlay could answer before Stage A (the anonymous course open to search and sharing). On 11 November he answered five and part of a sixth.

## Decision

Finlay's words are recorded in [his list](../reviews/2026-11-10-finlay-contributions.md#done) and the [privacy compliance record](../operations/privacy-compliance.md):

- `/privacy` wording for people who only read: "Looks great. 30 days is fine".
- Cloudflare Web Analytics: keep it.
- Uptime alert: a Stage A gate.
- Crawlers: search, AI input and AI training are all allowed.
- Share image: the journey map; a photo of him as well.
- `/agent-basics`: keep. He also asked for a way to be told when Unit 2 is ready.

## Change

- `/privacy`: one sentence for every visitor: "Cloudflare also counts page views for us, without cookies and without identifying you." The policy still says, correctly, that the course uses no advertising or analytics cookies.
- `/help`: the sentence about response time now says it applies to support questions, and that privacy requests get a reply within 30 days. This removes the conflict with `/privacy` (audit F11).
- Records: his list, the compliance record and the readiness page.

## Verification

- Build ran with no other generated changes; Python tests and `npm run check:public` results are on the pull request.
- The audit observed the analytics script in a browser on 10 November. A plain `curl` on 11 November did not show it in the page source, which is expected for a script the browser is told to load at the edge; it was not re-observed in a browser for this change.

## Remaining questions

- Finlay has not read the new analytics sentence on the page.
- Server location was not separately confirmed against the Contabo account.
- The uptime monitor and the Cloudflare AI-context rule (items 3 and 23) are open.
- The "notify me about Unit 2" request needs a design choice and a privacy-policy change; it is not built.
- No lawyer has reviewed the policy. This record is not legal advice.
