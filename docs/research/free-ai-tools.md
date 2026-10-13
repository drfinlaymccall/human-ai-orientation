# Free AI tools for the orientation

Reviewed: 2026-10-13. Public guide: https://orientation.finlaymccall.com/free-tools.

Finlay requested a homepage link, a provider-independent shortlist, and his recommendation to try a paid plan after exploring free access. The course must remain completable without a subscription. The existing homepage design is retained.

## Course fit

The current lesson requires a short pasted text brief, a generated response, a follow-up correction and human reflection. The planned three-activity MVP uses the same basic interaction. Learners retain personal/project guidance in their own notes. They can paste it into another conversation without relying on memory, Projects, file uploads, API access, web browsing, native AGENTS.md/CLAUDE.md support or paid models.

| Option | Evidence for free access and text interaction | Limits and recommendation |
| --- | --- | --- |
| ChatGPT | OpenAI's free-tier FAQ confirms free conversations and tools | Everyday text chat is currently described as unlimited subject to safeguards; other tools have separate limits. Suitable for the core text route by documented capability. |
| Claude | Pricing lists Free with chat; getting-started guide describes prompts and follow-up refinement | Variable session allowance, supported locations, age 18+. Suitable for the core text route; allow a pause if quota is exhausted. |
| Gemini | Subscription page lists Free with a Google Account; help describes conversations without an AI plan | Standard usage limits; work/school access differs. Suitable for the core text route. |
| Meta AI | Official assistant FAQ describes free everyday use, chat and existing Meta-account access | Some advanced-feature limits are being tested. Suitable where available; does not require the learner to adopt Muse. |
| Muse | Official Muse FAQ confirms free allowance and conversational tasks; launch article describes document/task assistance | Launch article says US rollout. Wider availability was not established. List separately as conditional, not a default international recommendation. Use text drafting only for this course. |

This is a documentation-based capability mapping, not a hands-on provider evaluation or a promise that a free quota always covers a lesson in one sitting. The public page makes that distinction and includes a two-message fictional invitation check. If a tool cannot be accessed or an allowance runs out, learners can return later, switch with their saved brief, or use the existing worked example. Errors in the output are material for evaluation, not evidence that the course requires a more expensive model.

## Sources inspected

All fetched from official provider pages using TinyFish search/fetch on the review date:

- [ChatGPT Free Tier FAQ](https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq): free chat and separate tool limits.
- [ChatGPT Plus](https://help.openai.com/en/articles/6950777-what-is-chatgpt-plus): broader model/tool access and remaining usage limits.
- [Claude plans](https://claude.com/pricing): Free chat and paid usage/model options.
- [Get started with Claude](https://support.claude.com/en/articles/8114491-get-started-with-claude): conversation, revision, eligibility and free usage limits.
- [Gemini subscriptions](https://gemini.google/subscriptions/): Free Google Account option and paid access.
- [Gemini limits](https://support.google.com/gemini/answer/16275805?hl=en): standard limits without a plan, variable access and account distinctions.
- [Meta AI assistant](https://ai.meta.com/meta-ai/assistant/): free everyday use, chat, accounts and advanced-feature limits.
- [Muse product FAQ](https://ai.meta.com/muse/): separate agent product, free allowance and optional subscription.
- [Muse launch announcement](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/): US rollout; updated 30 September 2026 when inspected.
- [Muse connectors](https://www.meta.com/help/1687253048996149/): optional app connections, with some Meta connections automatic through Accounts Center. Do not claim Muse never has connected context.

The Gemini pricing and limits pages presented different model-version/access descriptions. Avoid a model-by-model claim or hard-coded quotas; the shared finding is free conversational access. No paid price comparison or provider ranking is needed for this lesson. Meta's marketing security claims are not repeated as independent assurances.

## Maintenance and validation boundary

During weekly course review, check these official links, free text access, availability restrictions and the two-message interaction. Record provider/account/region/date for any later hands-on trials separately from this documentation review. Reassess fit when a new lesson makes a capability mandatory. A paid plan is Finlay's optional exploration recommendation, not a course prerequisite or a guarantee of accuracy.

The public guide is static HTML, uses the existing stylesheet and requires neither JavaScript nor a login. Only `/free-tools` is added to Caddy's public route allowlist. Runtime/private files remain outside the public root.


## Four input types — 13 October 2026 update

Finlay requested a provider comparison as lesson content and a progression from computer controls into giving ordinary, useful instructions. The public guide’s cards are now a semantic table with typed text, voice, document/file input and pictures. The shared source is `content/free-tools-table.html`; preparation and the standalone guide render the same table through `scripts/build-preparation.py`. Source links are available beside the table.

| Provider | Evidence inspected for the additional inputs | Qualification retained in the course |
| --- | --- | --- |
| ChatGPT | [Free Tier FAQ](https://help.openai.com/en/articles/9275245-chatgpt-free-tier-faq), [Voice](https://help.openai.com/en/articles/20001274-chatgpt-voice), [Uploads](https://help.openai.com/en/articles/8555545-uploading-files-and-audio-to-chatgpt) | Free uploads/images and limited voice are documented. Dictation creates text; a live conversation is different. Tool allowances are separate; no fixed quota or universal availability is promised. |
| Claude | [Pricing](https://claude.com/pricing), [mobile dictation](https://support.claude.com/en/articles/10065434-use-dictation-on-claude-mobile), [voice mode](https://support.claude.com/en/articles/11101966-use-voice-mode), [files/images](https://support.claude.com/en/articles/8241126-upload-files-to-claude) | Dictation explicitly includes Free. Voice mode is beta on all plans across web/desktop/mobile and counts toward normal limits. File guidance lists accepted documents and images; Markdown is not in its list, so the practice note has a paste-text fallback. |
| Gemini | [Mobile input shortcuts](https://support.google.com/gemini/answer/16179553?hl=en), [Live Android](https://support.google.com/gemini/answer/15274899?hl=en), [Live iOS](https://support.google.com/gemini/answer/15274899?hl=en&co=GENIE.Platform%3DiOS), [uploads](https://support.google.com/gemini/answer/14903178?hl=en), [limits](https://support.google.com/gemini/answer/16275805?hl=en) | Mobile microphone and Live are distinct. Live requires mobile, not web; eligibility/account/rollout conditions apply. Uploads require sign-in, with higher limits on paid plans. |
| Meta AI | [Official assistant overview/FAQ](https://ai.meta.com/meta-ai/assistant/) | Lists free everyday use, text/image/voice, photos/files/docs and Mac dictation. Does not establish a complete per-device, per-app free-feature matrix. File access is labelled conditional; learner checks their attachment menu. No API capabilities are inferred as consumer features. |

All pages were fetched from official publishers with TinyFish. This verifies published descriptions, not hands-on interaction with free accounts. Avoid interpreting an app’s ability to receive pictures as image generation, or assuming every voice path is transcription. Do not make live camera, audio-file uploads or all four inputs mandatory.

The initial activity uses a small meaningful task, one instruction, inspection and a follow-up. Learners start with one accessible modality and explore a second if available. A fictional gathering works across text, spoken instruction, the existing practice note, and a learner-created photo of three fictional lines. Instructions remain editable, copyable, and readable without JavaScript; no voice recording or upload happens inside the course.
