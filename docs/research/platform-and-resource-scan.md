# Initial platform and resource scan

Checked: 2026-10-13. This is a shortlist based on official project material, not an installed comparison or a final recommendation. Product fit assessments below are provisional judgements.

## Local grounding

The existing website is configured for `https://finlaymccall.com` in `../../../finlaymccall.com/astro.config.mjs:8`. Its `DEPLOYMENT.md:3` documents a Cloudflare Worker. The opening of its README still says Pages; the deployment file and configuration are the stronger local evidence. Remote deployment state was not checked.

The website's public writing already emphasises needs analysis, judging outputs, contextual learning, and capability that survives changing tools (`src/pages/index.astro`, particularly lines 173–197). The course can demonstrate that position in practice.

The website README describes personal correspondence routing; that is not evidence of an automated course email service. No existing course LMS was established by these reads.

### Confirmed hosting target and initial inspection

Finlay selected the existing machine containing `/home/finlay/apps`. A read-only inspection on 2026-10-13 returned Ubuntu 24.04.4 LTS, four CPUs available to the process, 7,941 MiB total memory with 3,252 MiB available at that instant, no configured swap, and 89 GB free on the root filesystem. These are a capacity snapshot, not a load test.

`caddy`, `python3`, and `node` were found on the command path. Docker, Podman, nginx, and PHP were not found by that check; Docker commands returned command-not-found. This does not rule out installations outside the current path. Listening-port inspection was restricted by the execution environment, so no claim is made about free ports or existing routing. No service configuration was changed. Account for other workloads and verify platform requirements before selecting a deployment.

## Candidate platforms

| Candidate | Verified source facts | Fit hypothesis | What to test |
| --- | --- | --- | --- |
| Moodle | Official repository documents self-hosting and GPL-3.0 licensing | Useful reference for a conventional, adaptable LMS and a portfolio demonstrating LMS work | Can a narrowly configured course deliver simple navigation, reflections, return flows, and appropriate emails without excessive customisation? |
| Frappe Learning | Official repository documents courses/chapters/lessons, quizzes, assignments, certification, self-hosting, and AGPL-3.0 licensing | Worth testing for a focused short-course experience | Confirm progress behaviour, private reflections, account friction, accessibility, email journeys, upgrades, and extension options |
| Canvas LMS | Official repository identifies it as an open-source LMS | Consider if Canvas-specific demonstration becomes important | Verify supported production setup and required services before treating it as an economical small-server choice |
| Small custom course application | This is a proposed approach, not an existing product inspected here | Greatest freedom over a single guided journey and public design presentation | Account recovery, authoring, tracking, accessibility, mail, support review, backups, and maintenance all become explicit build responsibilities |

Sources: [Moodle repository](https://github.com/moodle/moodle), [Frappe Learning repository](https://github.com/frappe/lms), [Canvas LMS repository](https://github.com/instructure/canvas-lms).

One concrete Canvas caveat: Instructure's separate [canvas-self-hosted helper repository](https://github.com/instructure/canvas-self-hosted) was archived on 2026-06-02 and warns that its alpha tooling should not be relied on for production. This does **not** mean Canvas LMS itself is archived or cannot be self-hosted. Research its supported production route separately if shortlisted.

Google Classroom was mentioned in the initial discussion. It is not shortlisted at this stage because the project preference is a modifiable, self-hosted course. No detailed Classroom capability comparison has been performed. No claim of a universal “best LMS” is warranted by this scan.

Proposed next experiment: run the same small journey in Moodle and Frappe Learning—preview, register, find the next task, leave for an AI app, return with a reflection, resume later, receive a relevant email, and request help. Include an administrator editing a lesson and reviewing a support draft. Record native capability versus configuration, add-on, and custom development needs. Do not assume either LMS includes the desired email journey or support approval workflow.

Prefer the platform that meets the essential journey with acceptable upkeep. Avoid choosing a custom frontend plus LMS backend until a tested limitation justifies maintaining both.

## Supporting-resource map

| Resource | Proposed learning use | Access and suitability notes |
| --- | --- | --- |
| [Personal Context Portfolio — Nathaniel Whittemore](https://github.com/nlwhittemore/personal-context-portfolio) | Influence for a portable context kit; optional expansion for experienced learners | README describes ten Markdown files and states MIT licensing. Repository and full structure are more technical than the proposed core. Link now; inspect licence file before reuse |
| [AI Fluency: Framework & Foundations](https://anthropic.skilljar.com/ai-fluency-framework-foundations) | Optional deepening on delegation, description, discernment, and diligence | Landing page offers free registration and lists modules. Hosted on Skilljar, not Skillshare. Full logged-in learning experience has not been evaluated |
| [Claude Academy](https://academy.claude.com/) | Discover current provider-specific tutorials and capability explanations | Official catalogue describes free educational material. Select exact activities during authoring; do not substitute the whole catalogue for a learner task |
| [Elements of AI](https://www.elementsofai.com/) | Optional conceptual grounding on what AI is and what it can do | Official site describes a free self-paced introduction requiring no programming or complicated maths. Keep the separate technical Building AI course outside the core path |
| [OpenAI: Personalize ChatGPT](https://learn.chatgpt.com/docs/personalize) | Reference when authoring memory and instruction explanations | Controls vary by product and surface; page also covers Work and Codex. Do not transpose all its instructions to every learner account |
| [OpenAI: Projects and chats](https://learn.chatgpt.com/docs/projects) | Reference for shared project context and distinct task chats | Describes several products and surfaces. Check the learner-facing app and plan before publishing exact steps |

Future resource records should include provider, exact activity, learning outcome, expected effort, account/paywall friction, accessibility, last checked date, and a replacement or in-course fallback. Linking out does not require automatic completion tracking; a learner can report one useful takeaway on return.

## Added resource: Matt Pocock's AI Hero

Checked 13 October 2026. [AI Hero](https://www.aihero.dev/) is Matt Pocock's developer-oriented site, with coding-agent workflows and a course aimed at engineers. This makes it a better fit for optional extension than the non-specialist core. That placement is our audience judgement, not a measured difficulty rating.

| Resource | Intended use and outcome | Effort, access and fallback |
| --- | --- | --- |
| [A Complete Guide To AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md), updated 18 January 2026 | Optional reading after the context-to-instructions task. Explain personal/project guidance and why a concise instruction file should select relevant information rather than contain everything | Page labels itself an 8-minute read; article text was accessible without sign-in or payment. It assumes coding/repository vocabulary. Offer our original plain-language exercise as the complete fallback; no Git, subscription or skill installation required |

Useful ideas to reference include focused instructions and avoiding unnecessary context. Link to the article rather than copy its examples or require learners to install its skills. Ask returning learners for one instruction they would simplify and why. Accessibility and the complete linked-course journey were not tested.

**Freshness issue:** the article says Claude Code does not use `AGENTS.md`. The [current official Claude Code guide](https://code.claude.com/docs/en/memory) now describes direct support from v2.1.277, subject to instruction-file, setting and session conditions. Use official documentation and the learner's installed version for operational steps, rather than repeat the article's blanket statement or require its symlink workaround. The [official Codex guide](https://learn.chatgpt.com/docs/agent-configuration/agents-md) supplies its own loading rules. Recheck both when authoring provider walkthroughs.

## Important distinctions for course authoring

Context supplied in a chat, instructions, memories, uploaded files, and project sources are different mechanisms. “The AI knows me” is too broad to teach as one setting. A generated self-description is evidence to question, not an exhaustive storage audit. Product documentation and visible account controls should ground provider-specific exercises.

Portable notes do not automatically synchronise themselves to multiple products. Learners need an understandable act of selecting, sharing, checking, and updating relevant information. Do not promise perfect memory, automatic access to folders, or universal isolation between projects.

## Unresolved feasibility checks

- Existing workloads, platform resource requirements, route availability, and deployment permissions; the machine and basic resource snapshot are now known.
- Monthly budget for hosting, outbound email, backups, and agent-generated support drafts.
- Expected pilot and public enrolment; actual concurrency matters more than registration totals alone.
- Account and email delivery options, learner-controlled reminders, and recovery from delivery failure.
- Content-authoring workflow, resource freshness checks, accessibility evaluation, and upgrade burden.
- Privacy boundaries for context kits, reflections, and agent-assisted support; deletion/export behaviour.
- Licence obligations and reuse permissions before adapting third-party code or teaching material.

The Moodle documentation feature page could not be fetched because it blocked automated access. The Moodle repository was successfully read; detailed feature suitability remains unverified. No LMS was installed or tested during this scan.
