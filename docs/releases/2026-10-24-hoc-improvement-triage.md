# HOC improvement triage — 24 October 2026

## Outcome

Finlay requested one improvement plan, parent issues and farmable work blocks for all open issues/feature requests, plus Claude CLI review on the VPS before merging PRs. The existing [canonical plan](../plans/2026-10-23-002-feat-public-launch-plan.md) is enriched in place. No application change, live deployment, registration change, issue closure or PR merge is part of this triage.

[Programme #19](https://github.com/drfinlaymccall/human-ai-orientation/issues/19) has four native sub-issue parents:

| Parent | Children |
| --- | --- |
| #20 Delivery quality | #22 integrated baseline, #23 Claude review, #10 CI permission |
| #9 Journey and launch | #4 email/operations, #5 human pilot, #15 delivered My context integration, #16 imagery, #24 personal journey, #25 six-pair check |
| #21 Voice support | #13 Finlay narration, #28 verified local transcription guidance, #29 broader voice scoping |
| #6 Evidence-led curriculum | #12 free-assistant evaluation, #26 guided portfolio prototype, #27 objectives/glossary/workspace pilot |

The live intake had nine open issues and four open PRs (#11, draft #14, #17, #18). Three coordinating parents and eight missing children were created, giving 20 open issues. All native parent/sub-issue links were checked. Existing issue bodies/acceptance remain, with current triage/dependency/work-block pointers. Closed baseline issues stay closed. Deployed does not mean merged: My context/feedback need source/test reconciliation, not new implementation.

The plan defines **WB01–WB22**, each with outcome, dependency, source/evidence boundary and acceptance. It gives independent research/presentation/native lanes and reserves shared builders/generated output, plugin registration, deployment and final status/merge work for one integrator. Mutable native fixtures are serialized or explicitly isolated. All L1–L9 conditional requests remain visible; no newsletter, primary external drive, new LMS or formal mastery award is added.

## Claude review methodology and actual proof

[The procedure](../operations/claude-pr-review.md), [trusted prompt](../../prompts/claude-pr-review.md), AGENTS/CONTRIBUTING and PR template require current repo/base/merge-base/head, public-source manifest/digests and coverage, actual CLI/model/capabilities, validated result and finding dispositions. Fixes need appropriate checks and review of the changed candidate. Missing/stale/failed/incomplete review is never a pass. Raw prompts/streams stay private; no private runtime or learner material is supplied.

Installed CLI 2.1.293 was authenticated. The first restricted-network trial made no API request. A network-enabled PR17 trial proved actual access but failed on its oversized bundle and trial limits: no review result, no approval. Reported list estimate was $1.26302 against an estimated $1 guard; the guard can overshoot within one request and does not measure subscription billing. This informed compact partitions, explicit union-of-scope coverage, low effort and output room for findings.

A final compact **PR18 source review completed**:

- Base/merge-base: `6c0032890c9e5f4b42caa1a0cdab33df82a3c591` (`feat/public-launch`); GitHub compare verified the merge-base.
- Head: `c658603a189ae34df6b24d23717469e8a08aeb66` (`fix/preview-reflection-tips`). Reviewer: Claude CLI; operator: Codex integrating agent.
- Actual inference model: `claude-sonnet-5-5`, effort low; exit 0, final success and is_error=false.
- All seven changed-file patches plus focused source context; locally validated JSON/covered scope. No findings identified in supplied source.
- Tools/MCP/skills/slash commands empty; two explicitly disclosed shipped plugins and standard agent definitions remained. No hook/tool activity observed; managed-policy exclusion was not independently established.
- 14.35 seconds; reported estimated list cost $0.132. No tests/browser/Moodle behaviour were exercised. Enhanced-builder dependencies and Moodle editor internals were not fully supplied; those limits remain explicit.
- PR refs were checked before/after; it remains open/unmerged. This is source-review evidence, not functional verification or merge approval. Other PRs remain pending the complete gate.

The [sanitised SHA/scope/result receipt](../reviews/2026-10-24-claude-pr18-source-review.json) retains the exact bundle digest and caveats. A later base/head change invalidates it until reassessed. A completed small review proves the procedure can work; it does not approve every open PR.

## Verification and remaining work

Triage verification checks the issue crosswalk, native hierarchy, unique complete WB01–22 catalogue, source/document links and diff integrity. A read-only independent audit checked coverage/dependencies and respected source ownership. Its two actionable findings were corrected: verified merge-base/branch/operator receipt metadata, and a concrete WB01 completion gate that retains #22/WB10 rehearsal work. Prose/policy/template changes do not justify rerunning production-writing application suites; no such pass is claimed.

The source-review rule is **procedural**, not an installed required status check or protected-branch rule. A durable review runner/publisher/protection, actual GitHub CI activation and release-source reconciliation remain #23/#10/#22. New app features, recordings/hardware checks, consented mail/pilot observations and Finlay's launch decisions remain the work named in the plan. No automatic reviews, monitors or marketing messages were scheduled.
