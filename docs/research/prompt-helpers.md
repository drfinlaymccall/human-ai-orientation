# Prompt helpers as optional learning support

Reviewed 13 October 2026. Finlay requested Prompt Cowboy and another helper in a contextual tip, with beginner-level advice about when refining a request can improve an output.

## First-party sources inspected

- [Prompt Cowboy](https://www.promptcowboy.ai/): live prompt-generator interface; the fetched homepage contains little explanatory guidance.
- [Prompt Cowboy pricing](https://www.promptcowboy.ai/pricing): advertises a Free standard-model tier and paid additional capabilities. The course links to current plans rather than hard-coding quotas, model names or prices. End-to-end generation and signup requirements were not tested.
- [Creator Henry Badgery's launch explanation](https://www.linkedin.com/posts/hbadgery_today-im-excited-to-launch-prompt-cowboy-activity-7285436035621171204-Fl0S): describes generating an initial prompt, asking clarifying questions (such as requesting a writing example), and refining before copying into the learner's AI. This is historical first-person product explanation, not verification that every current flow behaves identically or evidence of learning gains.
- [Copy.ai Prompt Improver](https://www.copy.ai/tools/ai-prompt-improver): explicitly describes a free tool, an original-request/goal/rewrite/copy workflow, and specificity, context, format and a definition of success. The page makes strong marketing claims about guaranteed improvements and poor results being the user's prompt; these are not carried into the course. Signed-in operation was not tested.
- [QuillBot prompt generator](https://quillbot.com/ai-writing-tools/ai-prompt-generator): also considered; its page describes goal → structured suggestion → paste and refine. Copy.ai was chosen as the second link because the inspected page more clearly states the free offer and explains the improvement workflow. No ranking of quality is implied.

## Pedagogical treatment

Place a brief Finlay’s tip before the interactive brief builder, visible with or without JavaScript. The practical aim is awareness of missing information and deliberate revision, not teaching prompt-engineering jargon or elaborate templates.

The expandable practice uses the existing fictional invitation: identify what a vague request leaves unspecified, add one instruction about undecided details, predict the effect, then inspect the actual result. This is a course-authored application of clarification and formative checking, informed by the product explanations. It is not a claimed scholarly method from Prompt Cowboy and one comparison cannot prove causation.

Learners inspect helper-generated prompts for invented details. Asking the current AI one clarifying question provides an equivalent route without another service. Tools are optional; the course sends them no learner content automatically. The tip suggests fictional material while exploring. Recommendations are based on inspected first-party descriptions, not a hands-on performance evaluation or privacy endorsement.

## Maintenance

Review these links and free-access wording with other provider resources during the weekly course check. The tip is in `content/context-brief-widget.html`; rebuild using `npm run build:brief` and publish Moodle content through `scripts/php scripts/sync-preparation.php`. No widget behaviour or learner-record schema changes are required.
