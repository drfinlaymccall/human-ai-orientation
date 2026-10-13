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

The live public entry is `/ai/`. It contains a copyable starter and the entire inspectable context. `/ai/context.md` is the current Markdown copy. `/ai/course.json` describes the available lesson, outcomes, steps and public links; `/ai/course.schema.json` documents that project-specific manifest. The page includes Schema.org `Course` and `LearningResource` JSON-LD.

The starter links to `/ai/releases/2026-10-13.1/context.md`. Published release text is not overwritten: subsequent context changes receive a new version, and older lesson prompts retain their matching context. Updating a version also requires adding its exact public route to Caddy. Manifest and HTML are generated from `content/ai/course-context.json`; the build does not scan private documents or LMS data.

**A public GitHub repository is a committed part of the course design, but has not been published yet.** It will carry reviewed course sources, public AI context, build instructions, design rationale, version history and labelled synthetic evidence. Use a deliberate publication allowlist. Do not publish `trial/`, `docs/private/`, learner submissions, captured emails, credentials, database dumps, operational logs or raw account-bearing browser reports. Repository-wide `.gitignore` is useful but does not replace reviewing the initial publication set.

Once published, link the repository from the site and manifest. Use commit/tag-specific raw GitHub links for reproducible references and the course site for a readable stable entry point. Generate both representations from the same source; do not maintain divergent GitHub and site instructions. Repository name, final publication set and licensing are decisions for repository preparation, not learner prerequisites.

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

Run `python3 scripts/build-ai-context.py` after editing the curated source. A changed release must use a new version; unchanged rebuilds leave the pinned file untouched. Add the exact new release URL to both the public-route matcher and the Markdown exception in `deploy/Caddyfile`, validate Caddy and restart only `orientation-web`. Keep prior release routes available. Review changes beside the learner lesson for alignment before publishing.

Verification for this first version: validate the generated manifest against its JSON Schema; exercise signed-out page access, source fetch, clipboard success/failure, no-JavaScript reading and desktop/mobile widths; retain private-file-denial and native saved-progress regression checks. No real third-party chatbot has yet been tested against these guidance instructions.

Post-deployment validation owner: Finlay. At publication and the next weekly review, fetch the public context and manifest, compare the pinned version with the starter, inspect `journalctl --user -u orientation-web` for route errors, and confirm `/config.php` still returns 404. Broken or mismatched context links trigger correction or withdrawal of the starter link; they do not justify exposing private runtime paths.

Sources for the metadata vocabulary: [Schema.org Course](https://schema.org/Course) and [LearningResource](https://schema.org/LearningResource), checked 13 October 2026. The manifest is our own documented format, not a universal agent protocol.
