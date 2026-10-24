# Contributing and tracking the build

[CONTROL.md](CONTROL.md) owns current scope and priorities. [GitHub Issues](https://github.com/drfinlaymccall/human-ai-orientation/issues) track actionable work. Commits and pull requests show implementation; [design history](docs/history/README.md) explains decisions and feedback. The design brief owns rationale and requirements. Update each only for its own purpose.

Use a feature branch and a focused PR. Describe the learner need, change, relevant research, verification and remaining limits. Keep existing learner records intact. Build public and Moodle content from shared fragments. Do not edit Moodle core. Run focused checks and native journey checks for Moodle changes. Record synthetic evidence as synthetic.

Never commit `trial/`, `docs/private/`, credentials, captured email, database backups, logs or real learner/support records. Review staged filenames and content; ignoring files alone is insufficient. Public design conversations are curated; remove authentication exchanges, private employment sources and third-party personal details. Use fictional examples in screenshots.

Original educational materials and design documentation are CC BY 4.0; software licensing is separate. See LICENSE.md and LICENSE-CONTENT.md. Moodle retains its own GPL licence. Attribute external resources by linking to their source.

Before integrating third-party teaching material, record the exact asset's rights and changes in the relevant research ledger and carry its attribution/licence through every published format. For Day of AI, follow the [integration requirements](LICENSE-CONTENT.md#day-of-ai-materials--integration-requirements): covered adaptations retain CC BY-NC-SA 4.0 conditions, with separate checks for partner assets and intended use. Include the rights record and learner-visible credit location in the integration PR; the project's CC BY notice must not overwrite a third-party licence.

## Documentation travels with the change

Every plan includes a documentation/status impact: which learner, author or operator guidance changes, what CONTROL.md must say, and what verification belongs in the PR or release record. If none changes, explain why. Make those updates in the same PR; a routine documentation update does not need a separate issue. Reuse an existing issue for the need and create a documentation issue only for a standalone task or deferred debt.

CONTROL.md owns current priorities and dates; the design brief owns requirements and rationale; the README and case study explain the delivered product; dated release records retain what was checked at that time. Update current guidance rather than silently rewriting historical evidence. Close issues only after linking the delivered acceptance evidence, and explicitly retain any unfinished scope.

## Claude review and delegated work

Use a named work block from the [canonical HOC plan](docs/plans/2026-10-23-002-feat-public-launch-plan.md), with issue, dependency, source/test/docs boundary and actual validation in the handoff. Keep shared builders/generated output, plugin registrations, live publication and final tracker updates with one integrator; coordinate mutable fixtures and overlapping files.

Every PR needs an independent [Claude CLI source review](docs/operations/claude-pr-review.md) before merge, tied to current base/merge-base/head and complete covered scope. Resolve findings, test fixes and re-review changed candidates. Unavailable, incomplete or stale review leaves the PR unmerged. Attach redacted SHA/scope/model/result/triage evidence to the PR instead of committing a self-invalidating receipt. The rule is procedural until a trusted required check and GitHub protection are verified; CLI source review does not establish runtime behaviour or learning outcomes.
