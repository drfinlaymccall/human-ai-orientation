# Discovery and decision log

Updated: 2026-10-23. This is a living interview record. Proposals are not decisions until accepted.

## 2026-10-23 — Deliver My context and keep-in-touch links

**Decision/change:** Finlay approved implementation of the private Moodle workspace and course panels, making Copy the main action and retaining an optional Markdown file download. Explicit saves now keep the three portfolio documents, separate private practice and small course notes in the account; learners can return across activities and signed-in devices, edit/copy and follow source-activity links. Native forms remain usable without JavaScript and version 1 backups remain compatible. This supersedes the earlier requirements-only capture below.

**Review/verification:** six deterministic client-race checks, 13 isolated Moodle browser checks, eight existing portable portfolio checks, six metadata unit checks and two metadata browser checks passed. All seven actionable code-review findings were corrected, covering account switching, stale asynchronous results/imports, row recreation, native failure recovery, notices and isolated testing. Published an additive plugin upgrade and shared content through supported Moodle APIs; fingerprints preserved existing module identities, Lesson evidence and completion. See the [release record](releases/2026-10-23-context-workspace.md) for live checks and remaining human/device limits.

**Course profile:** Finlay prefers LinkedIn for course updates, new offerings and human–AI collaboration/education ideas. A shared Keep in touch section links his existing verified LinkedIn profile and website, without a newsletter subscription. X can follow once its URL is confirmed. This does not authorise sending marketing email or social posts.

## 2026-10-23 — Choose Moodle for persistent My context storage

**Decision:** after discussing side panels, Finlay requested that small learner-created context files live inside Moodle on the server, follow the learner through the course, and remain available to open/edit/copy/download with links back to their source activity. This supersedes the earlier undecided Google Drive/Dropbox direction; external providers become optional later extensions.

**Capture:** updated existing [issue #15](https://github.com/drfinlaymccall/human-ai-orientation/issues/15), added requirements and U10 to the single forward plan, and aligned CONTROL.md, the course-review log (CR13–CR14) and portfolio authoring notes. Scope includes persistent responsive panels, private account storage across visits/devices, clear save states, failure/conflict recovery and portable backups. Separate personal creations from shared course references and private practice observations from AI-selected context.

**Verification/limits:** reviewed the requirements and documentation diff; no runtime or live learner records changed. Account storage, panels, detailed schema/migration design and privacy wording remain to implement and verify. Current temporary-browser drafts/download behaviour is still described truthfully. Saving in Moodle does not give an AI access to the work.

## 2026-10-23 — Queue a learner-owned AI memory folder and cloud storage

**Request:** Finlay proposed Google Drive or Dropbox integration to save and retrieve portfolio files, and described a file system as an initial “AI memory system.” The intended habit is returning to check what is stored, review it and reuse useful context.

**Capture/limits:** created [issue #15](https://github.com/drfinlaymccall/human-ai-orientation/issues/15), related to portable save/restore #3, and updated CONTROL.md. Candidate stages are guided local/cloud folder use, optional connected save/load, and recurring review/reuse practice. Provider choice, current free access, exact integration and conflicting-copy handling remain to be scoped. Existing local download/restore remains a valid route. No connection, upload, runtime change or claim about current provider plans was made. Checked for a matching storage issue and verified documentation whitespace.

## 2026-10-23 — Reuse Finlay’s Tips beside writing activities

**Request/decision:** Finlay wants reusable prompts and a speak-instead-of-type reminder whenever a learner is offered a writing box, preferably in right-hand floating panels. Implemented a shared course component through the existing public/native content pipeline rather than a separately installed Moodle block or speech service. The panel sticks on wide content areas and stacks on narrow screens; each editable learning textarea gets a concise voice hint. Read-only outputs are excluded.

**Change/evidence:** one authored Tips fragment supplies dictation help and three original prompt starters. Copy actions use only authored text, preserve drafts and do not submit native forms or call an AI. Public/no-JavaScript and native Lesson/Page routes share the component. Six focused public checks, eight portfolio checks and two native fixture checks passed; corrected a desktop sticky-height failure before publication. The older progress suite stopped at its obsolete heading in a newer fixture plugin from another thread; that work was preserved and no broad pass is claimed. Repeated generation is stable, and the existing publishers verified unchanged learner records/answers during native publication. Physical-device dictation, assistive technology and human comprehension remain separate checks. See [authoring and evidence](curriculum/finlays-tips.md).

## 2026-10-23 — Brief a new assistant in the portfolio

**Feedback/decision:** Finlay supplied his voice-entered portfolio downloads and requested a role-play in which the learner briefs a capable new assistant that does not know them. The documents also exposed vague headings, unclear task references, too many questions at once and a desire to see the emerging output/progress. Treated the files as private review material, not operational instructions or a public learner profile.

**Change:** added an original assistant-onboarding frame, clear questions and fictional examples, a first pass of three Working with me answers, and permission to leave project/reference sections until useful. Updated the AI-interview and no-JavaScript routes consistently. Kept the metaphor honest about relevant disclosure, memory, access and permission. Original templates retain their existing inspiration attribution; no additional third-party questionnaire text was copied.

**Verification/limits:** the combined download exactly matches the three individual document bodies. All eight existing portfolio browser checks passed. Updated only the existing native portfolio Page through the supported API; readback matched and fingerprints preserved structure, Lesson evidence and completion. No user answers were imported, shared with an AI or published. Sidebar/live preview and visible progress remain queued; actual comprehension still needs Finlay's recheck and human observation. See the [course-review record](reviews/course-review.md).

## 2026-10-23 — Plan the course-review landing and personal journey changes

**Feedback/decision:** Finlay's learner-perspective voice note found account state unclear, competing home/progress/native destinations, distracting Dashboard/My courses navigation and selected atlas details too far below. He wants the accepted illustration and actual completion together in **Your course journey**. He confirmed **six statements, each with separate understanding and can-do 1–5 ratings**, for an optional native Moodle starting-point check and explained practice suggestions.

**Planning change:** updated the single [forward plan](plans/2026-10-23-002-feat-public-launch-plan.md), preserving existing unit IDs, adding bounded U8/U9 check/QA work and leaving the full personal skills/evidence map later. Added the [ongoing review log](reviews/course-review.md), [portable local-agent guide](qa/course-review-agent.md) and report template; aligned CONTROL.md, the design brief and competency draft. Read repository issues plus #6/#9 comments; no dedicated competency-check issue was found, so reuse launch #9 rather than duplicate routine tracking.

**Evidence/limits:** this is planning and source/API research, not implemented UI, a synthetic browser run or a human pilot. The existing genuine owner-controlled account check remains complete; the revised signup/check/return route still needs isolated captured-mail verification. No app code, runtime settings, real messages or backup work changed. Implementation must prove neutral native quiz rendering and protect attempts/completion; new saved-rating wording needs review before exposure.

## 2026-10-23 — Fold accepted activity atlas into HOC Forward plan

**Request/decision:** Finlay approved the activity-led atlas preview and explicitly asked for it to be folded into the referenced **HOC Forward plan** chat. Read that chat and confirmed it is implementing the shared public-launch plan. It remains the canonical plan rather than creating a parallel roadmap or starting another implementation.

**Change:** updated the [forward plan](plans/2026-10-23-002-feat-public-launch-plan.md) with the accepted direction, exact five destination labels, activity/task/competency distinction, details on what learners do/keep/practise, author-view purpose and public versus authenticated behaviour. U1 now owns atlas navigation; U3 reuses it with native completion and Continue. Added acceptance for readable/mobile/no-JavaScript choices, plain-language labels, correct links, revisiting and supported later-activity entry. Removed the obsolete visual-choice blocker and moved personal rating/storage/quiz work into the existing later workstreams. Preserved the exact [inline preview source](prototypes/orientation-activity-atlas.html) for the implementation chat. Updated CONTROL.md, design brief and framework acceptance notes; no learner/operator runtime guidance changes because this handoff changes planning only.

**Verification/limits:** compared the preserved source with the original preview, checked plan/document links and whitespace, and reviewed U1/U3/L1/L2 consistency. Existing prototype browser evidence remains synthetic and is not substituted for production checks or a human pilot. The forward-plan chat is active; shared plan/source updates are available in its checkout. No course runtime, completion criteria, learner records or registration settings were changed by this integration.

## 2026-10-23 — Explain the learner's activities before technical competency mapping

**Feedback:** Finlay liked the orientation-atlas direction but found its labels, groupings and coded module/competency mapping confusing. He asked what the modules, tasks and competencies represent and how the front end will make the experience clear to learners and to him. The complaint concerns presentation; it does not reject the knowledge/capability design.

**Proposal/change:** V1.2 of the [framework](curriculum/competency-framework-v1.md) opens with a plain-language activity map, purpose, takeaways and a worked detail view. Four principal destinations expose the three existing core activities and the portfolio bridge, with optional basics. The map's places are activities, tasks are actions inside them, and competencies are the knowledge and capabilities those tasks develop. The six capability groups and codes now sit in clearly labelled author references; a secondary skills map is a later option. Replaced the primary atlas's workshop/library/lookout names with labels saying what learners do. An in-chat clickable mockup explores activity selection and a readable course-design view; no mock assessments or learner outcomes are represented as saved records.

**Verification/limits:** checked selection/detail updates, both viewpoint controls, public destinations, responsive layout and document references. This verifies prototype behaviour and editorial consistency, not human usability or a production Moodle integration. The preview opens existing public activities; no public course page, Moodle module, completion condition or learner data was changed. Wording and the activity-led layout await Finlay's judgement. Independent entry into later activities still needs appropriate existing/example context and production checks.

## 2026-10-23 — Pair knowledge and capability; make misunderstanding diagnosis explicit

**Feedback/requirement:** Finlay broadly supported the six-area draft but said “clarify a misunderstanding” concealed identifying and analysing the misunderstanding. He requested better competency verbs across revised Bloom, a knowledge component and a skills/capability component for each competency, and inspection of the publishing knowledge base and his thesis. This requirement is confirmed; the particular V1.1 wordings/mappings remain draft.

**Change:** revised the [framework](curriculum/competency-framework-v1.md) to V1.1, retaining the 18 core and four optional foundations IDs. Each now has a paired knowledge outcome, knowledge-type mapping, and cognitive-process mapping for both knowledge and practical checks. TALK-02 makes diagnosis, repair and evaluation separately reviewable. A worked communication example covers all six cognitive categories; author guidance distinguishes Bloom's two dimensions from support/independence ratings, prohibits verb-only classification and records partial knowledge/performance evidence separately. Updated the design brief and CONTROL.md; current learner/operator guidance needs no change because the revision is design documentation only.

**Source verification:** inspected the publishing knowledge base's curriculum-competence account, Appendix B extraction and taxonomy/competency table samples; checked original thesis PDF pp. 310–333 (printed 291–314) via Zotero `S7EIG9TW`, including human and shared-agent competency examples. Original page labels take precedence over the conflicting locator in the generated knowledge-base competency-table note. Retrieved Krathwohl (2002) and inspected the two-dimensional account, Tables 2–3 and worked classification (pp. 213–216). The bank applies these methods to orientation, rather than importing the thesis's domain outcomes or accreditation requirements. No external library or knowledge-base source was edited.

**Verification/limits:** checked unique IDs, matching knowledge/capability coverage, Bloom-category coverage, links/anchors and documentation whitespace. These are editorial/structural checks, not validation of the proposed classifications or learner outcomes. No live page, map, quiz, saved rating or completion rule changed. Content/pilot review and images remain subsequent work.

## 2026-10-23 — Competency bank and non-linear course map, text first

**Feedback:** Finlay requested prototypes of a pretty, clickable, non-linear learner map, grounded in the earlier competency and self-evaluation discussion and research on experiential courseware. He asked to start with text before producing courseware images and supplied the six-area outline from **Plan Human AI course launch**.

**Draft:** [V1 competency framework](curriculum/competency-framework-v1.md) retains those six areas, proposes 18 core can-do statements and four optional foundations statements, maps them to the existing activities, and separates engagement, completion, self-assessment, task evidence and course evaluation. It preserves Finlay's curriculum lineage and distinguishes that from Bloom, experiential practice and external competency frameworks. The atlas, constellation and garden are alternative visual briefs for the same bank. An additional “Not sure yet” response is proposed, not accepted.

**Verification/limits:** read the existing design/rationale and activity sources, and retrieved **General feedback - high level** and **Plan Human AI course launch**. Inspected Council of Europe guidance, author-hosted experiential-learning cycle passages, Andrade's formative self-assessment account, Carnegie Mellon alignment guidance, UNESCO's publication overview and the AI Fluency course outline; source boundaries are recorded in the draft. Checked local documentation links and mapped public route/anchor targets. This is design documentation, not a validated framework or learner pilot. No images, live map, quiz, saved assessments, runtime changes or new completion requirements were produced. Labels, missing assessment prompts, complete resource coverage, storage/export and visual choice remain open.

## 2026-10-14 — Glossary and finding the agent's workspace

**Feedback:** Finlay requested a glossary page for important course concepts, pre-populated in the proposal with likely terms and good definition links. He highlighted the agent's workspace, personal context/portfolio, settings and hidden `.codex`/Claude-related files, with Mac/Windows navigation and possible images of actual product interfaces.

**Change:** added `curriculum/glossary.md` with original draft definitions, official sources, stable proposed term anchors, practical workspace/file-location guidance, screenshot requirements and connections to objectives/competencies. Linked it from the design brief and control-file queue. The proposal distinguishes working files, app configuration and instruction files, as well as local, remote and web-project contexts.

**Verification/limits:** reviewed current course fragments and official OpenAI, Anthropic, Apple, Microsoft and Obsidian documentation on 14 October. Product guidance is documentation-checked, not an executed Mac/Windows walkthrough. No screenshots, live glossary, new tracking or learner capability evidence are claimed. Delivery priority and final visual treatment remain open.

## 2026-10-14 — Page objectives, competencies and the learner's own map

**Feedback:** while reviewing `/notes`, Finlay requested clear objectives and personal-goal connections for every page/resource, a course-wide objective/competency bank, individual can-do self-assessments, automatic reading progress and backlinks to instruction. He also proposed optional assessment by the learner's own AI and a portable visual competence map available during and after the course. This is owner feedback, not a learner-pilot finding.

**Direction and proposals:** capture the course-wide intention and queue delivery. Recommend separating observable resource engagement, self-reported capability and task evidence; usefulness feedback is course evaluation. Use `/notes` as the worked example while preserving other notes apps. Exact engagement triggers, persistence/export and delivery priority remain open. AI-assisted assessment is an optional later experiment, with learner-reviewed feedback against explicit criteria.

**Follow-up confirmed:** Finlay wants prior capability represented through an optional initial self-assessment, moving from the tentative “audit mode” idea toward a short course-based quiz. It proposes a starting competence map that learners can qualify: a correct answer might have been luck, and they may still choose practice. The intended progression is learner-directed. Added this entry route and a proposed metacognitive can-do statement about judging evidence and choosing practice. Exact wording, quiz coverage and recommendation rules remain open; this is not a validated placement instrument.

**Change and verification:** added the exploration to the design brief and control-file inbox. Checked the current notes fragment and its four section anchors, existing completion/portability requirements, and Carnegie Mellon's alignment guidance. This is documentation only; no learning controls, tracking, records or deployed pages changed, and no learning-outcome validation is claimed.

## Confirmed from the conversation

| Topic | Current direction |
| --- | --- |
| Purpose | Deliver an effective digital learning experience and demonstrate Finlay's ability to bring the whole project together |
| Portfolio priority | Project management and end-to-end delivery first; curriculum design connects the experience; evaluation supports quality proportionately |
| Audience | People who are not AI specialists; do not assume low confidence or lack of motivation |
| Prior knowledge | Core assumes no AI expertise; optional challenges support experienced users |
| Learner discovery | Establish confidence, experience, context, needs, time, and relevant preferences rather than assign a deficit label |
| Learning approach | Task-based, communicative, personally relevant, with explanation and demonstration available before practice |
| Underlying pillars | Needs through self-assessment; identifying, evaluating and synthesising knowledge; anticipating assessment/evaluation throughout; execution and revision |
| Orientation depth | Seed these capacities through simple tasks; familiarity and reflection, not mastery of curriculum design or technical terminology |
| Scholarly rationale | Situate the design in learning-design literature for the brief and later academic/portfolio writing; theoretical labels need not appear in the learner experience |
| Curriculum pedigree | Lead with Finlay's thesis and Human Agent Curriculum Design materials; keep ADDIE and other instructional-design models as supporting references |
| Metacognition | Use revised Bloom's knowledge and cognitive-process dimensions to support strategy awareness, self-evaluation and revision |
| Instruction outputs | Derive personal and project guidance from the Personal Context Portfolio; introduce and support creation of `CLAUDE.md` and `AGENTS.md` content, with a copy/paste route for other tools |
| Execution role | Humans initially perform the teaching/execution role; Finlay's teaching agent is the execution layer in the broader design and is outside this implementation |
| Central skills | Context, a personal context portfolio or kit, capability discovery, and productive ongoing work with AI |
| Progression commitment | Build human capability and goal awareness; leave with portable personal context, future-use ideas and a meaningful next goal |
| Broader pathway | A needs-analysis agent could recommend orientation; learners can then enter the separate human–agent curriculum-design programme |
| Product boundary | The later programme develops specialist content and evaluations for human–agent collaboration; its implementation is outside this course |
| AI access | Learners bring their own tool; course tracks their learning and reports back |
| Delivery | Short self-guided course with accounts, progress, email updates and refreshers |
| Support | Learners can ask Finlay for help; an agent drafts answers, and Finlay signs off before sending |
| Technology preference | Open-source, customisable, self-hostable where practical |
| Pilot | Friends and family first, followed by public sharing and writing |
| Testing | Include artificial-persona agent walkthroughs; keep synthetic testing distinct from human learning evidence |
| Launch | Finlay intends to write about the project and launch it on LinkedIn to encourage enrolment |
| Delivery horizon | MVP within the next few days; public version by 20 October 2026; earlier if feasible |
| First release | Three complete activities: useful task, personal context brief, checking/improving a result; accounts, progress, a course email, and help |
| Hosting | Use the existing machine containing `/home/finlay/apps` |
| Ongoing development | Weekly evaluation and improvement, plus a control file for priorities, wishlists, and brain dumps |
| External resources | Attribute and link to suitable material; avoid unauthorised copying |

## Interview evidence

**Context and capability:** Finlay described helping a friend refresh a website in a day. The friend had not anticipated the capability gain and was reluctant to try. Finlay also described an experienced professional user who could benefit from reminders, digests, and managing context across projects. These examples motivate experiments; they do not establish that every learner needs those particular features.

**Personal context:** Finlay named Nathaniel Whittemore's Personal Context Portfolio as an influence and proposed activities inspecting what an AI appears to know, correcting it, and shaping future context. The repository has been located in the research scan.

**Audience correction:** “Low-confidence beginners” was rejected as a general description. People may be time-poor, unconvinced of value, or prefer explanation to tinkering. Use neutral public and internal descriptions and assess confidence individually.

**Portfolio correction:** Showing learning-design capability is an explicit objective of all work, not an optional write-up after the technical build.

**Portfolio priority, clarified:** Finlay wants to demonstrate project management and bringing the whole system together to create effective digital learning experiences. Curriculum design connects the parts. This relates to his University of Canberra work. Evaluation matters as part of a workable self-access design rather than as the principal portfolio claim.

**Evidence targeting:** Finlay requested a review of stretch areas in his job-search material. A targeted review of Nuix, UNSW, Arup, and UTS application matrices, checked against newer candidate-registry entries, suggests practical evidence targets: current platform administration, digital content production, operational testing/accessibility, and course reporting. These are evidence gaps in reviewed records, not a diagnosis of inability. Private source notes are kept outside the intended public materials.

**Synthetic evaluation:** Finlay proposed an artificial persona running through the course using an agent. The design brief includes a proposed method with labelled test data and explicit limits on the conclusions it supports. No such tests have run.

**Timing and motivation:** Finlay describes this as his own learning journey as well as a portfolio project. He wants something running by this time next week, with an MVP sooner, and accepted a three-activity first release. The 16 October MVP date is a planning interpretation of “next few days”; 20 October is the public-version target in Australia/Sydney time. The selected host has been inspected read-only; platform and deployment readiness remain untested.

**Application ledger:** A read-only check found 14 records marked submitted as of the ledger update on 13 October. This status does not establish whether employers have responded or why they have not. Practical course delivery remains the relevant project response; the project is not a guarantee of a hiring outcome. Application-specific observations remain in private notes.

**Control and review:** `../CONTROL.md` now owns the release scope, dates, wishlist and weekly review process. Recurring review timing is not yet chosen, and no scheduled automation has been configured.

**Human orientation and progression:** Finlay clarified that this course builds the human's skills and capacity to identify worthwhile uses of AI and their own context-specific needs. Learners leave with personal context and ideas/goals they can take into a separate human–agent curriculum-design programme. In that later programme they would develop specialist content and evaluations to educate and assess their agent. Its consumer-facing product form remains unresolved and is outside this implementation.

**Entry and handoff:** An existing needs-analysis agent could identify a need for foundational orientation and direct someone here; this was described as a possible pathway, not a requested integration. Orientation remains independently accessible. Learners bring their own agent and can copy/paste prompts, context and selected reflections. Portability and preparedness are commitments; the draft takeaway structure is a proposal for satisfying them.

**Pillars and depth, clarified:** Finlay identified the core capacities behind the pathway: identifying one's own needs through self-assessment and self-evaluation; later identifying the agent's needs; identifying and evaluating existing bodies of knowledge and making syntheses; anticipating assessment and evaluation throughout; and execution. Orientation should provide hints and first experiences of these capacities, not focus heavily on teaching each as a specialist skill set. The teaching agent is the broader framework's execution layer; humans initially perform that role themselves. The brief now maps each pillar to a light practical cue and distinguishes the teaching agent from learner AI and course support.

## Proposals awaiting decisions

- Exact wording of the scholarly framing: needs-led, task-based human AI orientation grounded in Finlay's curriculum research, supporting metacognition and self-evaluation. The source priority above is confirmed; publication wording remains a draft.
- Ten sessions totalling five to six hours, with optional extensions toward ten hours.
- The exact format and storage of the committed personal context portfolio and next-goal takeaway; a short copyable template is drafted.
- Core learning personalisation through authored examples and branching before adding inference.
- A public sample lesson and design case study that visitors can inspect without enrolling.
- Moodle and Frappe Learning as the first practical platform trials.
- `orientation.finlaymccall.com` as the working address; the existing site establishes the `finlay` spelling.

## Interview queue

Work through one question at a time; do not ask the learner to resolve technical choices that can first be researched.

1. Which everyday examples best help learners discover a meaningful next goal without requiring them to arrive with one?
2. How should the context kit be kept: only in the learner's own tools, optionally in the course, or as a core course workspace?
3. What should a learning email do, and how should its timing adapt to progress and breaks?
4. What pilot size and weekly support commitment would be comfortable for Finlay?
5. What may the support agent read, and how should learners understand the human-reviewed service?
6. Which device and access constraints are essential for the first cohort?
7. What monthly operating budget is comfortable, and which existing mail/deployment services can be reused?
8. What lightweight completion evidence should the agreed three-activity MVP collect?
9. Which practical evidence targets should the first release prioritise if time or budget constrains delivery?
10. Which additional thesis examples would strengthen the eventual public write-up? An initial page-level mapping now covers section 2.4.2, the five-domain framework, Appendix B's principles and selected revised-Bloom material.

## Curriculum lineage and instruction files — 13 October update

Finlay clarified that his curriculum/course-design pedigree should lead the rationale, with constructive alignment, revised Bloom and metacognitive awareness supporting it. Read targeted thesis passages through Zotero and the current Human Agent Curriculum Design philosophy/lifecycle documents. The scholarly note now distinguishes the thesis's five-domain framework from the current four-pillar orientation adaptation and records exact PDF/printed page ranges. Earlier sources such as Graves and Richards are described through the thesis; this pass did not inspect those original works.

Finlay added personal and project instruction files as intended outputs descended from the Personal Context Portfolio. The proposed implementation is to draft both briefs during activity 2 and test/revise during activity 3. Introduce the named files in the core explanation; supported-tool placement is an extension, preserving completion with ordinary chat. This is a proposed delivery treatment of the confirmed output, not a requirement to learn coding or install an agent.

Matt Pocock's AI Hero and its AGENTS.md guide were inspected and logged as optional developer-oriented resources. The guide's statement about Claude Code support is stale relative to current official documentation. Provider behaviour was researched, not tested. No external skills were installed and no learner instruction files were activated.

## Readiness

Initial scoping brief, project control file, and draft takeaway template exist. Audience framing, support model, portfolio priorities, launch intention, persona testing, three-activity MVP, hosting machine, delivery horizon, and progression into the separate human–agent curriculum programme have been clarified. Platform choice, operating budget, remaining acceptance details, and visual design still need decisions. A private local Moodle installation now contains one complete context lesson and synthetic learner accounts. Browser tests exercise learner journeys; confirmation, welcome and recovery messages are captured locally. No public deployment, repository publication, real enrolments or external messaging has occurred. See the [trial decision](trial/platform-decision.md).

## First implementation slice — 13 October

Finlay authorised one complete lesson and a working platform trial. Moodle was selected for the initial private experiment; Frappe was not installed. The runtime lives inside the project, with loopback-only HTTP, a private database socket and local email capture. This establishes a first working learner journey without treating the entire three-activity MVP as complete. The source lesson and configuration scripts remain separate from vendor code and learner data.


## 2026-10-13 — Public access authorized

Finlay requested Cloudflare MCP provisioning because the server localhost cannot be opened from his Mac. Selected `orientation.finlaymccall.com`. Prepared a public reading route plus Moodle pilot accounts, moved the runtime to managed services, and retained outbound email capture while registration remains closed. Two CLI OAuth attempts expired before callback processing; a persistent PKCE request is prepared. DNS and real public HTTPS verification are still pending. See `trial/PUBLIC-DEPLOYMENT.md` for the current deployment evidence.


### Public deployment completed

The persistent Cloudflare MCP sign-in succeeded. Created the proxied A record for `orientation.finlaymccall.com`, verified origin and edge HTTPS, and confirmed external access. All three public browser tests passed, including native lesson completion and return-visit persistence. Existing site routes were preserved. The public reading route needs no account; Finlay has an individual reviewer login in the private access notes. Pilot registration/email remain deliberately closed pending the next MVP work.


## 2026-10-13 — Public course context for the learner’s AI

Finlay wants a public GitHub project with instructions/context that participants can deliberately supply to their own AI, plus login-free AI-readable pages on the course site. Added R22–R24 and a first public context pack. Recommended and implemented AI browsing as an optional route with an equivalent paste fallback, preserving the original provider-independent core. Public GitHub remains a design commitment and publication task, not a claimed existing repository. Structured metadata describes the course; it does not guarantee retrieval or instruction-following.


## 2026-10-13 — Free AI tools guide

Finlay requested that “Free AI tools” on the homepage link to a researched, platform-independent guide. Published `/free-tools` using the existing visual design, with ChatGPT, Claude, Gemini and Meta AI, official source links, a short practical compatibility check, quota/access fallbacks and Finlay’s optional paid-plan recommendation. Muse is included separately: its free allowance is documented, but the inspected launch announcement describes a US rollout and broader availability was not established. Capability fit is explicitly documentation-based, not a claim of hands-on testing every provider. See [research and maintenance notes](research/free-ai-tools.md).


## 2026-10-13 — Computer foundations and Finlay’s tips

Finlay requested an earlier files-and-folders activity, a diagnostic/scavenger hunt, and recurring personal tips with an Obsidian guide. Added a primary homepage entry to `/before-you-start`, an optional `/notes` guide, a fictional Markdown download and inline tips in the public and Moodle lessons. Native Moodle Page resources precede “Your first useful brief”; preparation self-checks are deliberately ungraded and do not report saved completion. The same content fragments produce the public and Moodle guides.

Clarified Obsidian is free proprietary software using portable Markdown files, not an open-source app or a universally preferred model format. The recommendation remains Finlay’s; learners can use another notes app. The exercise distinguishes local paths, uploads, downloaded results and remote agent workspaces, and includes a phone/restricted-device read-through option. AI context release 2026-10-13.2 adds this preparation guidance while retaining the previous release.

Five public browser tests passed, including native preparation → notes → AI lesson → saved return visit. Mac/Windows desktop steps were checked against documentation, not executed on those operating systems. Human OS walkthroughs remain a pilot task. See [preparation design](curriculum/preparation-and-tips.md).


## 2026-10-13 — Interactive context brief and example responses

Finlay asked to replace the static prompt template and reflection instructions with intuitive editable controls and an example route for exploring the UX. Published a shared two-column brief builder in the public preview and Moodle. It updates a copyable prompt, offers three authored random fictional scenarios, and includes editable selection/omission/prediction fields with individual example responses. Learning notes have a separate copy action and are excluded from the AI brief. Existing entries require confirmation before replacement or clearing.

Temporary session-storage drafts support moving through the lesson and returning, without submitting the widget fields to Moodle or connecting to an AI provider. Clipboard and storage failures have fallbacks, and the previous static task remains without JavaScript. Added R28 as the pattern for future activities. See [interactive brief notes](curriculum/interactive-brief.md).


## 2026-10-13 — Prompting help at the point of need

Added Finlay’s prompting tip immediately before the context-brief builder, in public and Moodle versions. It links Prompt Cowboy and Copy.ai’s Prompt Improver as optional helpers, offers a small predict/revise/check exercise, and shows how the existing AI can ask one clarifying question instead. First-party product pages and Prompt Cowboy’s creator explanation informed the treatment; promotional guarantees were excluded. The goal is awareness of useful clarification rather than expert prompt engineering. See [source review](research/prompt-helpers.md).


## 2026-10-13 — Carry learning work between steps

Finlay requested that “Try it, check it, improve it” bring forward the prompt and prediction already created, with clear directions to use another AI app and return. Implemented an editable comparison workspace with carried success criterion, reply/observation/follow-up fields, copy controls, protected restart and local temporary restoration. Shared copy/paste and app-switching guidance now appears both in preparation and beside the activity. Be Connected supplies optional guest-access computer foundations, including an introductory video with transcript; it is not a demonstration of this specific AI handoff. Added R29. Synthetic browser checks test continuity and data boundaries; real learner comprehension remains a pilot question.


## 2026-10-13 — Explore the AI interface before building a context brief

After completing the course, Finlay requested that the introduction move from Finder/Explorer and copy/paste into the ways people can communicate with AI. Replaced free-tool cards with a four-input comparison and reused it in the initial preparation. Added four instruction-practice routes with editable examples, copy actions, source/response checking and a useful follow-up. Learners can use a personal task or a fictional invitation; the goal is practical communication and refinement rather than an ideal first prompt. Live voice is distinguished from transcription, and provider-specific access is qualified. The existing context-brief lesson follows this introduction; learner records and answers are preserved.


## 2026-10-13 — Comparable courses and open-materials pathway

Finlay requested a Moodle table of deeper introductory courses, including video/YouTube options and resources that could later be adapted. Researched official course outlines and licence notices; added seven resources with original summaries and specific next steps, plus the existing Be Connected foundations route. AI Fluency is a close collaboration-focused comparator; Code.org provides short conceptual videos; OpenLearn/Elements offer broader study; Khan Academy’s teacher series is a possible later cohort branch. Anthropic hosting is Skilljar, not Skillshare.

The licence review found a material distinction: Microsoft’s OpenLearn AI fluency is explicitly proprietary, while the OU introduction has CC BY-NC-SA covered content with third-party exclusions. AI Fluency authors confirm CC BY-NC-SA course/video materials; Code.org differentiates ND videos from SA curriculum. External resources are linked only. Finlay intends his original course content to be Creative Commons; the exact variant has been asked, with no blanket grant applied while it remains undecided.


### Licence choice confirmed — 13 October 2026

Finlay chose CC BY 4.0 for widest reuse with credit. Applied it to original educational content and curriculum-design documentation with an explicit scoped notice and attribution example. Published learner-visible notices on public pages and Moodle; linked/credited third-party content, software, learner/private data and screenshots are excluded. Earlier pending-choice notes record the prior decision state.


## 2026-10-13 — Portfolio journey, publication and owner-confirmed email

Finlay approved the six progression-review recommendations and added a seventh: record how the design brief, control document, research, feedback and course were developed. Created the public drfinlaymccall/human-ai-orientation repository with a genuine baseline commit, seven issues and a feature branch. Historical dialogue is curated from the design chats; no fabricated early commit history, private authentication exchanges or learner data are included.

Completed useful-task and check/continue activities and a three-document portfolio bridge, preserving the original Moodle Lesson and learner evidence. Chose browser-local temporary drafting with Markdown export and versioned JSON restore before considering account-backed portfolio storage. New manual completion records practice, not mastery; prior overall completion rules are preserved.

Finlay selected hi@finlaymccall.com, entered Gmail app credentials privately in Moodle, and confirmed receipt of the test with the intended sender. SMTP and native recovery are enabled for invited accounts. Reviewed support uses an operator-assisted private draft queue with exact-message approval; no autonomous inbox or support responses are implied. The pilot protocol is prepared, but recruitment, real observations and evidence-led expansion remain open. See the dated release and operating records for checks and limits.

## 2026-10-16 — Day of AI discovery and optional side quizzes

Finlay requested discovery of Day of AI after seeing its World Food Day trivia, with interest in homepage side quests and email answer links leading to personalised outcomes. Reviewed public curriculum outlines, the trivia collection, reuse terms, family/professional-learning resources and the linked Australian games catalogue. Played the anonymous ages 11–13 World Food Day route through five questions using a browser research tool; no account was created or leaderboard score submitted.

The [research ledger](research/day-of-ai.md) records 24 prioritised resource groups, additional candidates, attribution requirements, three original orientation question sketches and a proposed email-to-results flow. Recommended initial scope is a single untimed optional question with explanation and a next-practice link. A correct answer, a guess and demonstrated practical capability remain distinct, consistent with the proposed personal learning map. No new quiz, personal results service or email campaign is implemented by this research.

The site's covered materials are CC BY-NC-SA 4.0, so credit alone does not allow unrestricted reuse or relabelling under the orientation's CC BY licence. Exact asset notices, partner media and intended commercial/noncommercial use need resolution before import. Day of AI's educator guide and privacy notice describe facilitated discussion without individual student assessment records; personalised outcomes must therefore be designed in the orientation. Full registered packs, other quiz age bands, partner game play-throughs and learner benefit remain unverified. CONTROL.md retains the idea and proposed sequence without making it a launch requirement.


## 2026-10-23 — A proportionate release baseline and documentation upkeep

Finlay reviewed the release plan and confirmed the course is still a demo with reviewer/test accounts and no public learners. He authorised using the current checkout and asked to reduce the isolation and backup work. The baseline therefore preserves and pushes existing work, presents the actual LMS product on GitHub, runs the existing portable checks and reconciles the PR/issues. No extra checkout, backup service, provider audit or restore rehearsal is required. His paid Contabo server backups are accepted as owner-reported provision; no new recoverability claim follows from that acceptance.

Finlay also asked for help keeping GitHub and current documentation aligned. AGENTS.md and CONTRIBUTING.md now make documentation/status impact part of every plan and implementing PR. Reuse a relevant issue; a separate documentation issue is reserved for standalone work or deferred debt. Historical verification stays dated.

The next product batch remains homepage conversion, verified registration/self-enrolment and clearer module progression, followed by the human pilot and LinkedIn course/module posts. Formal assessments are not a launch dependency. GitHub workflow publication remains a specific permission follow-up; local checks and remote Actions status are reported separately.


## 2026-10-23 — One forward plan after the release baseline

Finlay asked to consolidate the outstanding work into one plan. The [public-launch and next-releases plan](plans/2026-10-23-002-feat-public-launch-plan.md) connects homepage clarity, verified onboarding, actual progress/return, safe module updates and public AI context to the human pilot and course/module LinkedIn series. GitHub check permission remains a supporting task, with existing local checks used meanwhile.

The current competency framework and visual-map briefs are included as a review workstream, without choosing a metaphor or treating the proposed capability ratings as implemented. Glossary, resources/side quizzes, reminders, demonstration/media, reporting/expansion and later portfolio/personalisation ideas have a sequenced backlog in the same plan. The accepted demo checkout, experiential assessment and existing backup provision are unchanged. The completed release-baseline plan remains historical; CONTROL.md owns current state/dates and the forward plan owns delivery order. No new feature, account opening, invitation or post is claimed by this consolidation.

## 23 October 2026 - Voice feedback, stage one

**Need and authority:** Finlay proposed voice input across Moodle, with contextual audio feedback to Finlay as the minimum. He then authorised planning, building stage one and opening an integration PR while the baseline agent worked separately. This is a paraphrase of the feature-request chat, not a verbatim transcript.

**Decision and change:** use a disabled-by-default local Moodle plugin with private File API storage, enrolment/context checks, a record/review/send flow, text/file alternatives, a private reviewer inbox and generic notifications. This avoids introducing transcription or a new service for a recording-only requirement. Notification failure preserves saved feedback; retry tokens prevent duplicate sends.

**Verification and questions:** the [feature release](releases/2026-10-23-voice-feedback.md) records real isolated Moodle API/browser tests with fictional users and synthetic audio, plus preserved course evidence. Installation and enablement, physical device/microphone checks, Safari and real external notification receipt remain integration work. The baseline checkout and its release changes were preserved, with this feature rebased after PR #8 merged.
