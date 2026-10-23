---
title: "feat: Establish the course release baseline and LMS showcase"
date: 2026-10-23
type: feat
artifact_contract: ce-unified-plan/v1
artifact_readiness: implementation-ready
product_contract_source: ce-plan-bootstrap
execution: code
---

# Establish the course release baseline and LMS showcase

## Goal Capsule

Preserve the existing demo course on GitHub main, make Finlay's LMS work inspectable, and bring documentation and issue tracking up to date.
Revised after Finlay's 23 October review: work in the current checkout; keep existing checks small; accept the owner-reported Contabo backup provision without an audit or restoration exercise.
These current instructions supersede the earlier isolated-checkout and backup-verification requirements.
Registration, landing-page changes and richer progression follow in the next batch.

## Product Contract

### Requirements

| ID | Required outcome |
| --- | --- |
| R1 | Preserve all accepted local course feedback/research in reviewed Git commits and push them. |
| R2 | Land the existing course and baseline improvements on main through PR #8, retaining recorded history. |
| R3 | Rebuild and run the existing portable checks; attempt GitHub automation only within existing publishing access and track a permission limit separately. |
| R4 | README and a concise case study explain the actual learner journey, Moodle implementation, Finlay's contribution, evidence and limits. |
| R5 | Reconcile the seven original issues and current launch guidance; retain unfinished onboarding and human-pilot work. |
| R6 | Record the accepted owner-reported Contabo backups briefly, without claiming independent verification. |
| R7 | Retain private-data boundaries and native activity/answer/completion records; demo status permits routine work in the current checkout. |
| R8 | Bake documentation/status upkeep into every plan and PR, rather than creating a documentation issue for every edit. |

### Scope decisions

Finlay accepts work in the live demo checkout because only reviewer/test accounts exist. No extra worktree is required.
Existing local checks protect subsequent edits; a missing GitHub workflow permission does not block this demo baseline.
Finlay accepts his paid Contabo server backups for now. No new backup provider, account audit, scratch database or restore rehearsal is required in this batch.
GitHub preserves the product source and design/build record; private runtime data stays excluded.
Experiential activities and reflection remain the assessment approach.

## Planning Contract

### Approach and constraints

Use the current feature branch and PR #8. Commit the existing course feedback first, then the documentation/status improvements.
Use explicit staged paths and inspect publication contents. Never force-push over unrelated work, publish private configuration, or reset/reseed the native course.
Keep shared source/generated outputs aligned using the existing build commands. Do not add a test framework or tests that merely mirror prose.
Use local portable checks; do not run the production-writing native suite unless a runtime change requires it.
The existing workflow template is sufficient; if access cannot publish it, retain it and create one actionable setup follow-up.
Documentation rules belong in AGENTS.md and CONTRIBUTING.md and must identify CONTROL.md/current guidance impacts in subsequent plans.
Update current state while retaining dated historical release evidence and original planning dates as history.

## Implementation Units

### U1. Preserve current course work

**Requirements:** R1, R7. **Dependencies:** None.
**Files:** Existing local course/preparation, licence, design, glossary and Day of AI research changes.
**Approach:** Review and commit the source/generated pair and proposal documents on the current branch; push before any workflow-permission experiment.
**Verification:** Accepted local work is recoverable from GitHub; no private runtime paths are staged.

### U2. Use the existing portable checks

**Requirements:** R3. **Dependencies:** U1.
**Files:** `scripts/check-public.sh`, existing test files/configuration, `docs/operations/course-checks.workflow.yml`, `docs/REPRODUCING.md`.
**Approach:** Run the existing build, support and portfolio checks. Publish the prepared workflow if existing access permits; otherwise record the exact permission follow-up without delaying the demo baseline.
**Verification:** Fresh local results are recorded separately from actual GitHub Actions status. No new tests are required for this setup/documentation change.

### U3. Present the LMS work and keep status documentation current

**Requirements:** R4, R5, R8. **Dependencies:** U1.
**Files:** `README.md`, `docs/case-study.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CONTROL.md`, `docs/design-brief.md`, `docs/discovery-log.md`.
**Approach:** Link real Moodle integration, evidence-preservation, authoring, recovery/support and testing examples. Explain Finlay's role and AI assistance; distinguish implemented behaviour, historical synthetic results and proposed work. Make documentation impact a standing part of every plan/PR, reusing existing issues.
**Verification:** A visitor can follow the product and evidence; old launch dates are historical and unfinished work remains explicit. Check local documentation links; no prose-only tests.

### U4. Briefly record the accepted backup position

**Requirements:** R6, R7. **Dependencies:** U1.
**Files:** Current-status notes in `docs/trial/PUBLIC-DEPLOYMENT.md`, `docs/operations/email-and-support.md`, `CONTROL.md`.
**Approach:** State owner-reported paid Contabo server backups and acceptance for the demo. Explain the source/runtime boundary and leave historical restore evidence dated. Do not perform backup audit or restoration work.
**Verification:** No independent backup/recovery claim, added service or restore action is introduced.

### U5. Merge and reconcile tracking

**Requirements:** R2, R5, R8. **Dependencies:** U2, U3, U4.
**Files:** `docs/releases/2026-10-23-baseline.md`, PR #8 and GitHub issues #1–#7 plus agreed follow-ups.
**Approach:** Review, commit and push the final changes; update PR #8 to its final scope and normal-merge the verified head. Close original workstreams only against acceptance evidence, keep #4/#5/#6 open for remaining work and track the next onboarding batch. Record any workflow permission follow-up. Confirm main contains the course and the working checkout is clean.
**Verification:** Main, current documentation, release evidence and issue states agree. Do not claim the baseline opens registration or demonstrates human learning outcomes.

## Verification Contract

- Run `npm run check:public` after intentional source/generated changes are committed. It rebuilds the course, checks generated drift, and runs existing support and portfolio suites.
- Inspect the final diff, staged filenames, documentation links and private-data exclusions.
- Native Moodle changes are not required; do not reset, seed or broadly synchronise the course for housekeeping.
- A failed or unavailable GitHub workflow must remain distinct from passing local checks.
- Keep real learner/support data, credentials and private backups out of GitHub.

## Definition of Done

- Accepted work is committed, pushed and merged through PR #8 with recorded history preserved.
- README/case study show the course and actual LMS skills with source-backed evidence and limits.
- Every future plan/change carries its documentation and current-status impact under repository instructions.
- Existing portable checks pass; any GitHub-automation permission setup is retained as a specific follow-up.
- Original issues and launch guidance reflect delivered and remaining work; onboarding is the next batch.
- The owner-reported Contabo provision is recorded without further audit or restore work.
- The release record distinguishes fresh checks from historical results; the checkout is clean of this work.

## Sources and Review

Finlay's 23 October plan review governs the reduced scope. Repository constraints come from `AGENTS.md`, `CONTRIBUTING.md`, `CONTROL.md` and `docs/design-brief.md`.
The original plan's additional isolation/recovery gates were deliberately removed after that review, not treated as unfinished requirements.
The existing 13 October release record retains historical test results; the new baseline record owns fresh evidence.
