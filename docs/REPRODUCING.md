# Reproducing the course

This repository contains the original course content, public frontend, Moodle integration and configuration scripts, supported local language overrides, deployment/service definitions, tests and design records. `vendor/moodle` pins the full upstream Moodle source at commit `215f44380bdc3ccf852a3a22e34f8423ff64033a`; `git submodule update --init --depth 1` retrieves it. The bootstrap independently fetches that same commit into the private `trial/moodle` runtime. No Moodle core patches are required.

## Public reading and portfolio experience

Install Node and Python 3, run `npm ci`, then `npm run build`. Run `npm run preview` and open `http://127.0.0.1:8090/journey`. The local server supports the public extensionless reading routes; Moodle account links require a separate Moodle installation. No AI API key or Moodle account is required for public reading, portfolio download or restore.

## Moodle on a separate Ubuntu 24.04 amd64 host

Run `python3 scripts/bootstrap-trial.py` for the isolated localhost installation. This generates secrets under ignored `trial/`, downloads the pinned Moodle core and extracts PHP/PostgreSQL packages without system installation. Read [the trial runbook](trial/RUNBOOK.md); package repositories can advance, so this is a source-pinned recipe, not a bit-for-bit OS image. Existing installations are refused, not overwritten.

After bootstrap, run the trial installation and seed steps in the runbook, build content and run `scripts/php scripts/sync-journey.php` to add the first-task, portfolio and check/continue resources. `scripts/sync-preparation.php` remains scoped to the existing public deployment. Read the scripts before applying them elsewhere. The source content and integration tests document the intended course structure.

## Public deployment

[Deployment notes](trial/PUBLIC-DEPLOYMENT.md) describe Caddy, PHP-FPM, PostgreSQL and Moodle cron. Service files use Finlay's installation paths and must be adapted for another host. Configure a domain, HTTPS, private runtime/data paths and mail credentials separately. Never copy Finlay's database or credentials to reproduce the site. The no-index header is a prototype discoverability choice, not an access restriction.

## Verification and limits

Use `npm run test:entry` for isolated homepage/navigation checks, `npm run test:portfolio` for isolated portfolio browser tests, `npm run test:support` for approval-boundary tests, and `npm test` only for a deliberately provisioned synthetic account against the public pilot (see deployment guide). Screenshots/reports are kept private by default; publish reviewed synthetic evidence only. Full clean-host public deployment and human pilot evidence remain unverified. Finlay accepts his owner-reported Contabo server backups for the demo; no restore audit is required by this baseline. See the current backup note in the deployment guide.


## Automated checks and the current permission limit

`npm run check:public` builds the public course, checks that tracked and newly generated content is committed, and runs support and portfolio tests locally. Install Playwright Chromium first with `npx playwright install chromium` when needed. Run the checks after committing intentional content/generated changes, so a clean rebuild can detect drift.

[The existing GitHub Actions template](operations/course-checks.workflow.yml) contains the same checks for a clean runner. It remains inactive: the 23 October check confirmed that the connected GitHub app cannot write repository files, the existing OAuth login has `repo` but not `workflow` scope, and SSH publication is unavailable. Source pushes still work. Installing the template at `.github/workflows/course-checks.yml` with an authorised owner login is tracked in [issue #10](https://github.com/drfinlaymccall/human-ai-orientation/issues/10); no active GitHub CI result is claimed. This permission setup does not block the demo baseline.

These checks protect later edits to generated course pages, portfolio download/restore and the support approval boundary. They do not replace a human pilot or require a new test framework. See the [baseline release record](releases/2026-10-23-baseline.md) for the fresh local results.

## Synthetic onboarding/progress fixture

With the private local PHP/PostgreSQL runtime already available, `python3 scripts/prepare-launch-fixture.py` installs pinned Moodle source into ignored `trial/launch-fixture/` and creates a **new** database named `orientation_launch_fixture`. It never copies the live database, configuration, credentials or SMTP settings. It refuses an existing fixture rather than overwriting it. The installation is for synthetic localhost testing, not a public deployment recipe.

Set `ORIENTATION_TRIAL_DIR` to the absolute `trial/launch-fixture` directory for CLI seed/sync/configuration commands. Run the initial `scripts/php scripts/seed-course.php`, then `scripts/php scripts/sync-preparation.php` and `scripts/php scripts/sync-journey.php` under that environment. Never run the seed script against the public course. Start `scripts/php -S 127.0.0.1:18802 -t trial/launch-fixture/moodle scripts/serve-launch-fixture.php` for browser checks. The router serves the supported public reading routes and the fixture's native Moodle pages on one localhost origin.

Fixture mail is captured under its own ignored `mail/`; synthetic administrator credentials stay in its ignored `credentials.json`. Do not print or publish them. Configuration scripts default to the existing `trial/` runtime when the override is absent, so always set the override explicitly for tests. Native account tests require this fixture; portable CI checks remain independent of the live server and its credentials.
