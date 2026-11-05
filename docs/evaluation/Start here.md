# Course evaluation workspace

Use this workspace in Obsidian to review individual pages and the whole course. This is owner evaluation, not learner-study evidence or a validated assessment instrument.

## Start a review

**Lowest-friction route:** open [[Review queue]]. Two preparation-page reviews already have their names, links and task focus filled in, with review dates left blank. Type or dictate a few observations, then tick **Ready for triage** in the note. That checkbox explicitly authorises triage just like the status property; the agent reconciles the property and register, preserves your words and handles criterion mapping and proposed acceptance checks. You do not need to complete the full rubric. [[Obsidian quick setup]] explains the built-in date command. The numbered workflow below is the optional detailed route.

1. Read [[Evaluation framework]].
2. Copy [[Page review template]] into `pages/`, naming it `Page review - <page name> - <review label>.md`. For a whole-course walkthrough, copy [[Whole-course review template]] into `whole-course/`.
3. Record the actual URL, date, environment and what you observed. Leave untested criteria as Not reviewed.
4. Add a link in [[Review register]]. Keep work in Draft until ready.
5. Set the review to **Ready for triage**, then tell the VPS agent: “Process the ready evaluations in docs/evaluation. Preserve my observations, propose coherent actions, and identify any decisions needing approval.” Sync alone does not trigger agent processing.
6. Review the agent response and agree actions. Implementation follows the project's existing testing, publication and review requirements. Only Finlay records Owner accepted.

## Boundaries

- Preserve original observations. Add dated clarifications and agent responses rather than silently rewriting reviewer text.
- A suggested fix is not automatically an approved change. Ready for triage authorises analysis, not unrestricted implementation.
- Status per finding: Draft → Ready for triage → Agreed action → Implemented → Verified → Owner accepted. Deferred or Not proceeding requires a reason; these are not passes.
- Verified means the stated acceptance check was actually exercised, with evidence and target version recorded. It does not imply owner acceptance or learner benefit.
- These files live within a source repository. Keep notes suitable for public review; never include credentials, real learner data, private context, account/reset URLs or unredacted authenticated screenshots. `docs/private/` must not be included in the sync.
- Do not edit the same note on both machines at once. Wait for sync completion; preserve and reconcile conflict copies explicitly.

## Existing records

- [Course review and change history](../reviews/course-review.md)
- [Synthetic review template](../qa/course-review-report-template.md)
- [Human pilot protocol](../pilot/PROTOCOL.md)
- [Design brief](../design-brief.md)

Link accepted changes into the existing course-review history and relevant issue rather than making a competing backlog. CONTROL.md remains outside this docs-only vault and is maintained by the VPS agent.

The VPS Syncthing share is configured as `human-ai-orientation-docs`. Finlay reports that the Mac setup is running and looks good; this is owner confirmation, not an independently observed end-to-end test receipt. A private operations note retains the setup and verification procedure. Setting up sync does not complete an evaluation.
