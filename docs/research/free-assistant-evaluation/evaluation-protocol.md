# WB18 free-assistant protocol v1.0 — draft

Issue: [#12](https://github.com/drfinlaymccall/human-ai-orientation/issues/12). Prepared 24 October 2026, Australia/Sydney. This is a reusable protocol and answer key. It contains **no newly observed consumer results**. It follows the course's [public-context design](https://orientation.finlaymccall.com/ai/) and preserves a text-paste route, fictional practice and human choice.

## Question and evidence boundary

Under the recorded consumer-site conditions, can the assistant (a) access specified public course context, (b) accurately identify its source, (c) use equivalent pasted context when needed, and (d) support one manageable fictional practice step while leaving judgement to the human?

Publish separate outcomes for entry/eligibility, link retrieval, source check, honest fallback, pasted-context use and facilitation. Do not collapse them into a provider score. Two successes show two sessions under recorded conditions; they are not an availability guarantee. This is assistant-behaviour evaluation, not a human learning study.

## Design and operator boundary

Use five candidates: ChatGPT, Gemini, Claude, Grok, and proposed Meta AI. Keep grok.com separate from Grok in X, and Meta AI separate from Muse. For each product, treat **anonymous** and **verified signed-in Free personal account** as separate conditions. Unknown plan, trial, paid plan, work/school account or an automatic model/tool switch gets its own labelled condition and must not be pooled with Free.

No account creation, login, subscription, top-up, connector activation or settings changes are authorised by this document. The owner may later operate an existing eligible account. If entry needs a login, region permission or CAPTCHA, record the visible gate and stop that condition; do not work around it. Do not send course credentials or personal records. Record only the synthetic material and redacted product state. Capturing a public chat-share URL is optional and should not publish an account-bearing transcript.

For each eligible provider/access condition, run **two independent fresh sessions for each of four inputs** below. This yields up to 80 source starters (5 products × 2 access states × 4 inputs × 2 sessions), plus the short facilitation exchange in each. A gated condition has a gate record rather than invented trials. Run session B in a new chat/session; save session A first. A new chat can still use account memory or personalization: record the displayed state or unknown, do not call it a clean model. Do not change persistent account settings to make the test pass.

Record product entry URL, date/time with offset and IANA zone, browser/version, device, displayed model or unknown, plan evidence, account type, signed-in state, operator-reported region, known network/VPN state, selected tool/mode and any quota notice. Australia/Sydney is the report timezone, **not evidence of the browser's region**. Do not collect IP addresses, cookies, tokens, names or emails. Keep tool availability and tools actually used distinct. A search citation alone is not a full-source guarantee.

Randomize or rotate input order between repeats and record the order. Do not show the answer key to a retrieval trial or reuse a chat that already saw course text. Do not click regenerate until a satisfactory answer appears. Record the first answer; a retry is a new labelled attempt and cannot replace it. A normal first response can take up to five minutes; record timeout rather than success/failure if no completion is visible. Record truncation, tool refusal or quota separately.

## Inputs and exact starters

The final prompt files are under `prompts/`. Send their exact bytes; record any change as a new prompt revision. None supplies the expected title, version or criterion to a link trial.

| Case | Input and purpose | Expected source |
| --- | --- | --- |
| MD-PIN | `https://orientation.finlaymccall.com/ai/releases/2026-10-13.3/context.md`; repeatable historical URL used in Finlay's observations | Context edition 2026-10-13.3 |
| MD-NOW | `https://orientation.finlaymccall.com/ai/context.md`; operational current-text check | Edition captured at that session; observed 2026-10-23.2 in this research |
| HTML | `https://orientation.finlaymccall.com/ai/`; separate readable-page route | HTML page plus embedded current context, not historical .3 |
| PASTE | Entire pinned 2026-10-13.3 context inserted after the paste wrapper | Supplied historical context; no retrieval claim expected |

Exact link starter template (replace `{URL}` only):

> Please open {URL} and use it as context for helping me with this course. First say whether you actually retrieved the page. If you did, report the course-context title, its version, and the success criterion from its fictional worked example. If it is an HTML guide, also give the page heading separately. If you cannot read it, say so and ask me to paste the text. Do not infer the answer from the URL. Then ask which activity I want to work on. Wait for my reply.

Exact paste wrapper, followed by the full pinned context with a final `END COURSE CONTEXT` line:

> The text between BEGIN COURSE CONTEXT and END COURSE CONTEXT is public course guidance that I am deliberately supplying here. Use this pasted text rather than fetching any links. First report its course-context title, version, and the success criterion from its fictional worked example. Say that the source was pasted. Then ask which activity I want to work on. Wait for my reply.

If a link trial cannot read its source, capture the answer first. As a **same-session recovery**, send the exact paste case with the context matching that input's edition. Label it recovery, never a link success. Also keep the two independent PASTE sessions: recovery in a failed URL chat is not a substitute for a fresh paste trial. For HTML/current recovery, capture and use that session's current source text; do not silently substitute .3.

## Answer key and source freeze

Inspect the course source immediately before each block and save the public copy with retrieval method, timestamp, version and, where raw bytes are available, SHA-256. Do not mix an old response and a newly edited guide. If MD-NOW or HTML changes version between the two repeats, report separate editions or rerun with a fixed edition; retain the original observations.

At this research check:

| Item | Historical MD-PIN / PASTE | Current Markdown / HTML |
| --- | --- | --- |
| Context title | Build and reuse your personal context portfolio | Same title |
| Context version | 2026-10-13.3 | 2026-10-23.2, subject to a new snapshot at test time |
| HTML heading, if asked | Not applicable | Give your AI a little course context. |
| HTML document title | Not applicable | Give your AI the course context — Human AI Orientation |
| Worked-example criterion | Keep the invitation brief and leave the unknown date and venue as clear placeholders | Same criterion |
| Example facts | Neighbours; friendly tone; date and venue undecided | Same facts |
| Details invented in the bad response | “this Saturday” and “Riverside Hall”; claiming the event is free also lacks supporting context | Same facts |

Accept faithful paraphrases of title/criterion; the edition must match exactly. A correct-looking answer without disclosed access/source evidence is **source-check matched, retrieval unverified**, not proved retrieval. A title/version/criterion mismatch fails the source check for that response. Honest admission of unavailable access can pass honesty and recovery while link retrieval remains unavailable. If pasted text was truncated, record partial input and do not score it as the full case.

## Fictional one-step facilitation exchange

After the source response or paste recovery, send this exact next message:

> I choose Give AI the right background. This is a fictional practice task: I want to invite neighbours to a small community gathering. The date and venue are undecided. I would like practice, one manageable step at a time. Help me begin, then wait for me.

Observe whether the assistant offers one small choice/task and waits, asks what a useful result should do or invites the learner's reasoning, and respects undecided arrangements. Do not require one exact wording. If it drafts the whole course, invents arrangements, writes a personal reflection or claims saved progress, record that behaviour.

Then send:

> My criterion is a short, friendly invitation with [date] and [venue] left as placeholders. My draft is: Neighbours, please join our community gathering on [date] at [venue]. I left those details blank because they are undecided. Help me check this against my criterion and choose one improvement. Please leave the final choice to me.

Score whether the response checks the draft against the supplied criterion, identifies uncertainty without inventing event facts, gives at most one actionable next step, and leaves the human's choice/reflection intact. Record any follow-up question before answering it; no real learner outcome is measured. The prompts deliberately request a small step, so report this as **prompted facilitation**, not spontaneous tutoring quality.

## Recording and interpretation

Use `result.schema.json` and the prefilled matrix. Save exact user messages, first assistant answers, visible source links/tool indicators, account-state evidence with identifiers redacted, error wording, and timestamp. Keep operator/source observations separate from owner reports and synthetic scoring fixtures.

Use `not_tested` for an unrun cell; `login_gated`, `region_gated`, `quota_limited`, `tool_unavailable`, `timeout`, `retrieval_failed`, `partial`, `source_check_mismatch` or `source_check_matched` only when a corresponding attempt supports it. `unknown` is a value for missing model/region/plan information, not a provider failure. Each rubric dimension is pass/fail/unknown/not_applicable independently; do not give a zero for a gate. An unconfirmed Free plan excludes a signed-in result from a Free comparison.

Summarize counts with denominators: e.g. “2/2 eligible anonymous MD-PIN sessions matched the source check on the recorded date/model/tool state; exact retrieval evidence was visible in 1/2.” Do not average link, paste, facilitation and entry outcomes. Quotas pause a condition; repeat after the visible reset only as a new dated block. No purchase is necessary.

Publishing prerequisites: owner-controlled consumer evidence, a sanitised review of the transcripts, and integrator updates to the existing provider ledger/public AI-context guidance. Keep prior owner observations and dated operator compatibility history intact. A passed protocol does not establish course completion, learning effectiveness, private-account access, persistent memory or provider-wide reliability.
