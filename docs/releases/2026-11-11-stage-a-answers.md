# Finlay's Stage A answers — 11 November 2026

Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Need

The launch audit left seven items that only Finlay could answer before Stage A (the anonymous course open to search and sharing). On 11 November he answered five and part of a sixth.

## Decision

Finlay's words are recorded in [his list](../reviews/2026-11-10-finlay-contributions.md#done) and the [privacy compliance record](../operations/privacy-compliance.md):

- `/privacy` wording for people who only read: "Looks great. 30 days is fine".
- Cloudflare Web Analytics: keep it.
- Uptime alert: a Stage A gate.
- Crawlers: asked "search yes, AI input yes (both recommended), AI training yes or no", he replied "yes". Read as yes to all three. The exact `robots.txt` lines will be shown to him before the Stage A switch.
- Share image: the journey map; a photo of him as well.
- `/agent-basics`: keep. He also asked for a way to be told when Unit 2 is ready.

## Change

- `/privacy`: one sentence for every visitor: "Cloudflare also counts page views for us. This counting does not set a cookie." The draft he was shown also said "without identifying you"; that claim was dropped at review because it could not be checked from here. The policy still says, correctly, that the course uses no advertising or analytics cookies.
- `/help`: the sentence about response time now says it applies to support questions, and that privacy requests get a reply within 30 days. This removes the conflict with `/privacy` (audit F11).
- Records: his list, the compliance record and the readiness page.

## Verification

- Build ran with no other generated changes; Python tests and `npm run check:public` results are on the pull request.
- Observed in a headless browser on the live home page, 11 November: the page loads `static.cloudflareinsights.com/beacon.min.js` and reports to `/cdn-cgi/rum`; the only cookie set was `MoodleSession`. No analytics cookie was set. The Cloudflare dashboard setting itself was not inspected.
- Also observed: `MoodleSession` is set for a visitor who has not signed in. The policy described it only as the cookie that keeps you signed in; it now says Moodle sets one essential session cookie when you visit, and that it keeps account holders signed in.

## Remaining questions

- Finlay has not read the two changed cookie sentences on the page. His acceptance covers the page as it was before them. Before the Stage A switch he reads both, and the Cloudflare Web Analytics setting is checked in his dashboard.
- Before the switch he also confirms the exact `robots.txt` lines, in particular AI training.
- Server location was not separately confirmed against the Contabo account.
- The uptime monitor and the Cloudflare AI-context rule (items 3 and 23) are open.
- The "notify me about Unit 2" request needs a design choice and a privacy-policy change; it is not built.
- No lawyer has reviewed the policy. This record is not legal advice.
