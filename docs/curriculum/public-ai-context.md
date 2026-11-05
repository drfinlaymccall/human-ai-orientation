# Public context for the learner’s own AI

Design commitment, 13 October 2026. Requirements R22–R24 extend the bring-your-own-AI approach without adding an embedded chatbot or changing the orientation’s human-learning focus.

## Purpose

The learner deliberately gives their AI a useful piece of course context, checks what it could access, and decides what to do next. The public material helps the AI support the learner with explanations, examples and one-step-at-a-time practice. The learner still sets goals, selects personal context, judges results and writes their reflection.

This is a concrete context-literacy activity: **choose a source → share it deliberately → check access and relevance → use it → evaluate the result**. It supports the existing needs/content/evaluation/execution loop and metacognition. An AI saying it read a link is not sufficient evidence of understanding or successful learning.

## Two connected audiences

- **For the person:** purpose, readable lesson, examples, copyable starter, a visible version and a way to check the AI’s response.
- **For their chosen AI:** course purpose, intended outcomes, lesson steps, facilitation guidance, a worked example and explicit limits on what the public material can establish about the learner.

Both audiences can inspect the same public context without logging in. Moodle retains individual accounts, submitted reflections and completion. Public context contains no learner record. The AI does not need course credentials and cannot claim to know or update saved progress.

## Browser access is a route, not a prerequisite

The course website itself needs an internet connection. Internet access inside the learner’s AI is optional. Offer these routes:

1. An AI with working page access reads the linked context. The learner checks its reported title, version and a concrete example detail against the source.
2. If access is unavailable, blocked, truncated or uncertain, the learner pastes the same context text. This is an equivalent way of deliberately supplying context.
3. If no AI is available today, the existing fictional worked example supports the activity.

No GitHub account, paid model, API key, command line, coding tool or provider integration is required. Tool capabilities can differ between conversations; ask the learner to test what actually works. A title/version/detail match is a practical retrieval check, not a guarantee that every part was read or followed.

## Public site and public GitHub

The live public entry is `/ai/`. It contains a copyable starter and the entire inspectable context. `/ai/context.md` is the current Markdown copy. `/ai/course.json` describes the activity map, outcomes, versions, steps and public links. In the prepared course-journey release, its `$schema` points to `/ai/course.schema.v1.3.json`. The older schemas remain available for their original manifest formats. The page includes Schema.org `Course` and `LearningResource` JSON-LD.

The integrated course-journey/My context starter links to `/ai/releases/2026-10-24.2/context.md`; production publication remains subject to the integration and exposure gates below. Published release text is not overwritten: subsequent context changes receive a new version, and older lesson prompts retain their matching context. Updating a version also requires adding its exact public route to Caddy. Manifest, Markdown and guide HTML are generated from `content/ai/course-context.json` and the reviewed `content/course-map.json`. The latter supplies the same five labels, stable slugs, public reading destinations, current activity editions, outcomes and baseline/optional/portfolio roles used by the learner atlas and native progress view. The build does not scan private documents or LMS data.

The public repository is [drfinlaymccall/human-ai-orientation](https://github.com/drfinlaymccall/human-ai-orientation). It carries reviewed course sources, public AI context, build instructions, design rationale, curated dialogue and version history. Do not publish `trial/`, `docs/private/`, learner submissions, captured emails, credentials, database dumps, operational logs or raw account-bearing browser reports. Ignore rules supplement a deliberate publication review.

Version 2026-10-13.3 describes the complete portfolio journey and links the real repository in the site and manifest. Earlier pinned context remains immutable. Original educational materials and curriculum documentation are CC BY 4.0 under `LICENSE-CONTENT.md`; software licensing is separate. None of these choices are learner prerequisites.

Contributor `AGENTS.md` files describe maintaining the software repository. Learner-facing AI context describes supporting the human’s course activity. Do not assume that an ordinary chatbot automatically discovers or applies repository instruction-file conventions. Learners explicitly share a URL or paste content.

## What the AI is invited to do

Ask which step the learner is on, offer explanation/example/practice, prompt their reasoning, respond to the selected small task, and help them compare an outcome with their own criterion. Pause between steps and let the learner choose the next action.

Do not fabricate learner experiences, complete a reflection in their voice, treat public context as permission to access accounts, submit course work, or issue a course-completion claim. Reading guidance is not permanent model training or guaranteed memory across chats. The public source is inspectable course guidance, not an instruction to override the learner’s choices or the AI’s operating rules.

The eventual “AI walks beside the learner” experience can build on this pack. Autonomous browser control of the LMS and the later Human Agent Curriculum Design programme remain separate work.

## Acceptance and evaluation

- A signed-out person and a basic HTTP client can read the entire context and manifest without executing JavaScript.
- The starter names a versioned public source. Copying works where allowed, with selectable text when clipboard access fails and a readable route with JavaScript disabled.
- A learner can use the link or paste route and explain which information was actually provided to the AI. They keep personal context separate from the public course context.
- The AI supports a small step and asks for the human’s reasoning. Evaluate that with labelled synthetic transcripts and then human pilot observations; successful HTTP fetching is not evidence of tutoring quality.
- Schema validation, matching generated versions and public/private route checks support maintenance. Schema markup does not guarantee discovery, provider support or instruction compliance.
- Keep the existing prototype no-index header for now. Direct URL access is tested separately from search indexing; provider browsing may still be unavailable.

## Authoring and operation

Run `python3 scripts/build-ai-context.py` after editing either curated source. Changes to activity labels, destinations, versions, outcomes or roles change the context too, so increment the context version when those fields change. Atlas-only presentation fields do not alter the public context. A changed release must use a new version; unchanged rebuilds leave the pinned file untouched. Add the exact new release URL to both the public-route matcher and the Markdown exception in `deploy/Caddyfile`, add the release and new schema path to the exact edge allowlist in `deploy/cloudflare-ai-context-rule.json`, validate Caddy and restart only `orientation-web`. Apply only that scoped edge rule, preserving any other rules. Origin changes alone do not update Cloudflare. Keep prior release routes available. Review changes beside the learner lesson for alignment before publishing.

Verification for this first version: validate the generated manifest against its JSON Schema; exercise signed-out page access, source fetch, clipboard success/failure, no-JavaScript reading and desktop/mobile widths; retain private-file-denial and native saved-progress regression checks. No real third-party chatbot had been tested at initial publication. Finlay's subsequent Gemini access test is recorded below.

Post-deployment validation owner: Finlay. At publication and the next weekly review, fetch the public context and manifest, compare the pinned version with the starter, inspect `journalctl --user -u orientation-web` for route errors, and confirm `/config.php` still returns 404. Broken or mismatched context links trigger correction or withdrawal of the starter link; they do not justify exposing private runtime paths.

Sources for the metadata vocabulary: [Schema.org Course](https://schema.org/Course) and [LearningResource](https://schema.org/LearningResource), checked 13 October 2026. The manifest is our own documented format, not a universal agent protocol.

## Gemini access compatibility — 23 October 2026

Finlay's Gemini test reported `URL_FETCH_STATUS_MISC_ERROR` for the pinned 2026-10-13.3 context. Gemini correctly disclosed the failure and offered the paste route. Independent public retrieval succeeded, establishing that the URL was available without authentication but not that Gemini could retrieve it.

The response used Caddy's default `text/markdown` content type. Google's [URL-context documentation](https://ai.google.dev/gemini-api/docs/url-context), checked 23 October, lists `text/plain` among supported text types and does not list `text/markdown`. The allowlisted AI Markdown routes now explicitly return `text/plain; charset=utf-8`. Their URLs and published contents are unchanged. The existing no-index header is retained; this correction does not establish that indexing caused the reported failure.

**Verification:** the strengthened existing browser check failed on the original content-type header and passed after the scoped Caddy change. Two signed-out public checks passed, covering context/version retrieval, clipboard and paste fallback, mobile widths, no-JavaScript reading and private-file denial. Public HTTPS checks confirmed the current context and all three pinned releases use plain text and match their source bytes; unlisted Markdown and configuration routes still return 404. The private receipt is `trial/gemini-context-http-verification.json`.

**Follow-up after failed Gemini retry:** Finlay reported that Gemini still could not retrieve the file after the MIME correction. Reconnected Cloudflare through its OAuth flow and inspected the zone settings and Security Events. Browser Integrity Check was enabled; the recorded diagnostic blocks identify source `bic`. The sampled events did not identify a matching Gemini request, so the cause of Gemini's exact error is still unconfirmed.

Applied the [scoped rule definition](../../deploy/cloudflare-ai-context-rule.json) in the zone's `http_request_firewall_custom` entry point. It skips only Browser Integrity Check for GET/HEAD requests on the orientation hostname, matching the exact public AI-context paths plus `/robots.txt`. Cloudflare [documents this targeted skip](https://developers.cloudflare.com/waf/tools/browser-integrity-check/). Zone-wide Browser Integrity Check remains enabled; other WAF products and phases are not skipped. New public context versions require an explicit update to both the origin allowlist and this edge rule.

**Edge verification:** the new plain-HTTP-client regression failed with HTTP 403 before the rule and passed afterward. All three focused public checks passed, including all pinned releases, guide/robots access, copying, no-JavaScript/mobile fallbacks and private-file protection. The original Python client now receives 200 for the allowed files while login and unlisted paths still receive 403. Diagnostic access to private/unlisted files remains 404; context contents still match their source. Private receipts are `trial/cloudflare-ai-context-rule-receipt.json` and `trial/gemini-context-edge-verification.json`.

**Rollback and remaining limit:** disable or delete only the rule with ref `orientation_public_ai_context_bic`; preserve other rules if subsequently added. Its ruleset/rule IDs are in the private deployment receipt. Do not disable the zone-wide browser check or replace the entire entry point. Finlay subsequently reported that ChatGPT worked anonymously, Grok and Claude worked when signed in, and Gemini still failed in incognito. These are owner-reported session results; the controlled evaluation in [issue #12](https://github.com/drfinlaymccall/human-ai-orientation/issues/12) will capture exact responses, access conditions and repeatability. Gemini access is not established. Copy/paste remains available.


### Content licence metadata — 13 October 2026

The public manifest now includes `content_license` (CC BY 4.0) and `license_scope_url`; its generated schema and Course JSON-LD are aligned. The guide links to the scope/attribution notice. Existing pinned context text remains byte-for-byte unchanged; the external scoped grant covers Finlay’s original published context versions without rewriting their content.


### Schema compatibility

Schema version **1.1** introduced `/ai/course.schema.v1.1.json` for the added licence fields. The originally published strict 1.0 schema remains at `/ai/course.schema.json` unchanged, so old manifests can still validate against it. New readers should follow the manifest's `$schema` URL. Context-content versions and manifest schema versions are separate.


### Launch activity map — 23 October 2026

Context edition **2026-10-23.1** and manifest schema **1.2** describe the accepted five-place activity atlas. The three baseline practice activities remain unchanged; the portable portfolio is a bridge within the context activity, and files/notes/AI basics remain optional help. A person can begin with their existing context or a fictional example. Publishing a new activity edition does not assert that a learner previously read or completed that edition.

The signed-in progress destination is `/local/orientation/index.php`. `authentication_required: false` applies to this public pack; the separate `saved_progress_authentication_required: true` describes the human's account destination. The manifest and Schema.org `hasPart` describe public activities. They contain no current user's completion, account identifiers, responses or private portfolio. No URL, schema or public instruction grants an AI sign-in, submission or completion authority. The home page links the manifest and guide; the native login instructions link the guide. These are deliberate discovery routes, not a claim that every AI provider will browse them automatically.

The builder refuses to overwrite an existing context release or versioned schema with different bytes. Keep schema versions distinct from context editions and activity editions. Old pinned context and both old schemas remain unchanged. For an incompatible manifest change, publish a new schema URL and retain the old one; never edit an old strict schema to make a new manifest pass.

Local maintenance checks are `python3 -m unittest discover -s tests -p test_ai_context.py` and `npx playwright test --config playwright.metadata.config.cjs`. They check immutable rebuilds and new editions, manifest-to-map alignment, safe/exact routes, public reading links, Schema.org activity names, clipboard failure and no-JavaScript/mobile fallback using synthetic local fixtures. Validate the manifest against its referenced JSON Schema separately when changing that format. Live verification must still fetch the new pinned URL and schema through both Caddy and Cloudflare and retain private-path denial. These local checks do not establish Gemini access or human learning outcomes.

### Personal journey release — prepared in preview

Context edition **2026-10-24.1** (updated 24 October) and schema **1.3** describe the optional six-statement starting-point check and canonical private journey. The manifest exposes only its fixed account-required gateway, dimensions, scale and purpose. It contains no individual ratings, dated suggestions or private learner API. The human can skip the check and choose any activity; AI instructions grant no authority to sign in or submit it.

The separately served My context work already published edition **2026-10-23.2**. The preview originally reused that identifier with different text; review caught the collision before promotion. This release now preserves the exact published `.2` bytes (SHA-256 `fdc81d3fdbfef6d28a7cc1d3a07d305de32bccadf6bbb80104b215cbcee16f3b`) and uses the fresh `2026-10-24.1` identifier. The retained `.2` text describes My context; preserving its reference does not mean that the separate workspace feature has been integrated into this preview. Integrate that source and reconcile its public wording before deployment; a further context change needs another unused edition.

Earlier pinned contexts and schemas retain their original bytes. The repository's exact Caddy and Browser Integrity Check route definitions include the new pinned context and schema, but this preview batch has **not applied either configuration to production**. Deployment must validate/reload the origin configuration. Extending the live Cloudflare exception to `/ai/releases/2026-10-24.1/context.md` and `/ai/course.schema.v1.3.json` needs the owner's explicit approval; the earlier approval covered edition 2026-10-23.1 and schema 1.2 only. Preserve the GET/HEAD, hostname and Browser Integrity Check-only scope. Keep the paste fallback available regardless of provider retrieval results.

## 24 October — provider evaluation research

WB18 adds a [dated official-source review](../research/free-assistant-evaluation/provider-source-review.md) and [repeatable consumer protocol](../research/free-assistant-evaluation/evaluation-protocol.md). The prepared records are unrun. Preserve owner reports separately; link retrieval, source checks, honest fallback, pasted context and one-step facilitation are different outcomes. A successful CLI/API or independent fetch does not establish consumer-site access or saved course progress.


### Joined WB01 context — prepared, not deployed

The joined My context/journey/feedback source now uses **2026-10-24.2** with schema **1.3**. The preceding `.24.1` section records the earlier preview and its boundary; both `.24.1` and the already served `.23.2` retain their exact committed bytes. Public starter, manifest and generated guide now agree on `.24.2`.

The current deployment handoff therefore requires exact origin routes for `.24.2` and schema 1.3, plus the preserved older releases. Any live Cloudflare extension needs explicit approval covering `/ai/releases/2026-10-24.2/context.md` and `/ai/course.schema.v1.3.json`; the older `.23.1`/schema 1.2 approval does not cover them. Retaining a `.24.1` source rule is not evidence it was applied. No origin/edge configuration or public context has been deployed by WB01. Keep hostname, GET/HEAD and Browser Integrity Check-only restrictions and the paste fallback.

### WB23 rationale — prepared edition 2026-10-24.3

WB23 advances the context to **2026-10-24.3**, retaining schema 1.3, the title and concrete worked-example success criterion. Purpose and six plain-language practice objectives match the welcome copy. All older pinned releases, including `.24.2`, retain their original bytes. Prepared origin/edge source adds the exact new path; this work does not apply live configuration. Owner approval is still needed for a live exception extension to `/ai/releases/2026-10-24.3/context.md`, retaining the same hostname, GET/HEAD and Browser Integrity Check-only restrictions. Learners can always paste the context.

### 25 October — published for the owner's development preview

Finlay instructed that reviewed changes should appear on the main website while the project remains in development. The integrator applied that publication instruction to PR #32's exact public-context routes: `.24.1`, `.24.2`, `.24.3` and schema 1.3 were added to the existing GET/HEAD, orientation-hostname, Browser Integrity Check-only exception. Its other rules and older routes were retained. This records the authority used for the scoped update, rather than a separate claim that Finlay named each path. The [live receipt](../releases/2026-10-25-live-development-preview.md) supersedes the earlier prepared-only status and records application/readback plus independent public retrieval of `.24.3`. Provider-specific Gemini evaluation and the paste fallback remain separate.
