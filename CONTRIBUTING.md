# Contributing and tracking the build

[CONTROL.md](CONTROL.md) owns current scope and priorities. [GitHub Issues](https://github.com/drfinlaymccall/human-ai-orientation/issues) track actionable work. Commits and pull requests show implementation; [design history](docs/history/README.md) explains decisions and feedback. The design brief owns rationale and requirements. Update each only for its own purpose.

Use a feature branch and a focused PR. Describe the learner need, change, relevant research, verification and remaining limits. Keep existing learner records intact. Build public and Moodle content from shared fragments. Do not edit Moodle core. Run focused checks and native journey checks for Moodle changes. Record synthetic evidence as synthetic.

Never commit `trial/`, `docs/private/`, credentials, captured email, database backups, logs or real learner/support records. Review staged filenames and content; ignoring files alone is insufficient. Public design conversations are curated; remove authentication exchanges, private employment sources and third-party personal details. Use fictional examples in screenshots.

Original educational materials and design documentation are CC BY 4.0; software licensing is separate. See LICENSE.md and LICENSE-CONTENT.md. Moodle retains its own GPL licence. Attribute external resources by linking to their source.

Before integrating third-party teaching material, record the exact asset's rights and changes in the relevant research ledger and carry its attribution/licence through every published format. For Day of AI, follow the [integration requirements](LICENSE-CONTENT.md#day-of-ai-materials--integration-requirements): covered adaptations retain CC BY-NC-SA 4.0 conditions, with separate checks for partner assets and intended use. Include the rights record and learner-visible credit location in the integration PR; the project's CC BY notice must not overwrite a third-party licence.
