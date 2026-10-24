# Course journey: production handoff

This is the next deployment step for the [course-review release](2026-10-23-course-review-implementation.md), not a deployment receipt. This batch has changed only its preview checkout and synthetic fixture. Broad registration remains closed.

## Integrated source; preserve the dirty live checkout

Read-only inspection on 24 October found the deployed orientation plugin at version `2026102303`, with My context schema/privacy/workspace and a separate compact feedback implementation. The later journey preview had version `2026102401`. [WB01 / PR #31](https://github.com/drfinlaymccall/human-ai-orientation/pull/31) joins those source lines in an isolated checkout using **2026102402**, including their tests and navigation/privacy/help/build integration. Its [release record](2026-10-24-wb01-integration.md) and external PR receipts own actual verification and merge state. This handoff is not a deployment receipt.

The installer refuses **before copying** when the runtime has schema/upgrade files absent from the release or a newer plugin version. Do not bypass that refusal or downgrade. Reinspect the live version before promotion. The integrated idempotent upgrade covers both the earlier context installation and the journey-only version; synthetic preservation proof does not replace the live preflight.

The public draft now uses **2026-10-24.2** and schema **1.3**. Keep `.24.1` and the already served `2026-10-23.2` byte-for-byte; the latter's SHA-256 is `fdc81d3fdbfef6d28a7cc1d3a07d305de32bccadf6bbb80104b215cbcee16f3b`. A future context change needs another unused edition and matching exact routes. The live checkout still contains other intended work: do not reset, stash indiscriminately or blindly pull over it. Promote a reviewed integrated commit deliberately, preserving existing IDs, records, privacy handlers and exposure settings.

## Review and promote the integrated release

1. Finish source integration/review and preserve all intended work in GitHub. The ordinary checkout serves public files directly, so updating it is itself a public-content deployment. Promote the tested integrated commit deliberately; never run a blind pull/reset over its dirty files.
2. Finlay reviews the **merged** saved-rating wording in `/privacy`, `/help`, the starting-point gateway and native Quiz introduction. It discloses server-held answers and unfinished/dated attempts, administration access, retained retakes and no fixed retention period. Record actual acceptance/version/date privately. Previous account/progress approval does not cover this new storage.
3. Build and check the integrated source. Run `npm run check:public`, `npm run test:tips`, the deployment-boundary tests, starting-point rules and the guarded synthetic native progress/onboarding/starting-point/Tips suites. Run the separate My context checks too. Keep exact URLs/fixture markers/captured mail; never redirect a native test suite at production.
4. From that reviewed source, explicitly select the existing private production runtime for plugin upgrade and the supported publishers. Follow [progress operations](../operations/progress.md), [starting-point operations](../operations/starting-point.md) and [onboarding operations](../operations/onboarding.md). Never rerun seed/reset/initial-public-preparation tools on this course.

The relevant deployment commands, **after the integration above**, are:

```sh
ORIENTATION_TRIAL_DIR=/home/finlay/apps/human-ai-orientation/trial python3 scripts/deploy-orientation.py --trial-dir /home/finlay/apps/human-ai-orientation/trial --upgrade
ORIENTATION_TRIAL_DIR=/home/finlay/apps/human-ai-orientation/trial scripts/php scripts/configure-journey.php configure
ORIENTATION_TRIAL_DIR=/home/finlay/apps/human-ai-orientation/trial scripts/php scripts/configure-journey.php check
ORIENTATION_TRIAL_DIR=/home/finlay/apps/human-ai-orientation/trial scripts/php scripts/sync-preparation.php
ORIENTATION_TRIAL_DIR=/home/finlay/apps/human-ai-orientation/trial scripts/php scripts/sync-journey.php
ORIENTATION_TRIAL_DIR=/home/finlay/apps/human-ai-orientation/trial scripts/php scripts/publish-starting-point.php publish
```

The additive Quiz publication defaults to hidden/disabled. Enable the reviewed version using native Moodle visibility and the supported configuration command described in starting-point operations only after the wording review. **Never use `enable-fixture` on production.** Retain the current acquisition gate and existing learner access.

## Origin, edge and smoke checks

Validate/reload the reviewed Caddy configuration using the existing deployment procedure. Keep private/no-store responses and private-file denials. Prepared context edition `2026-10-24.2` and schema `1.3` have new exact public paths; retain all older routes, including the already served `2026-10-23.2`. The earlier Cloudflare approval covered the previous edition/schema; extending the existing Browser Integrity Check exception requires explicit approval for precisely:

- `/ai/releases/2026-10-24.2/context.md`
- `/ai/course.schema.v1.3.json`

Retain the orientation hostname, GET/HEAD restriction and Browser Integrity Check-only scope. Do not replace unrelated rules or broaden the exception to account routes. Keep the paste fallback available. Local metadata checks do not establish live provider retrieval.

Smoke-check the public splash/account state, signed-in journey, ordinary and deep-link login, native saved progress, reviewed check/skip/retake, preserved My context workspace and Give feedback entry/return controls. Inspect the deployed account-state response for no Set-Cookie, private/no-store and only the two documented JSON fields. Fetch new and previous context/schema files, confirm the retained `.2` hash above, verify the starter/latest/manifest name the new edition consistently, and verify private paths remain denied. Genuine mail/account mutations use separately authorised consenting recipients; the captured-mail suite is not a production-mail test.

Finlay owns the first 48 hours: inspect orientation web/PHP logs privately for `local_orientation`, `Exception`, `invalidsesskey`, `loginredirect` and mail errors. Healthy signals are chosen destinations retained through account access, current-user-only saved state, no probe-induced login failures, unchanged activity identities and successful public metadata fetches. Session corruption, cross-user disclosure, changed historic evidence or workspace/privacy regression blocks exposure: close acquisition while retaining enrolled access, disable/hide the optional check and restore the last reviewed integrated presentation. Keep attempts, schema and privacy support; do not reseed, delete records or restore an older provider over My context.

## After the pilot deployment

Run the consenting 3–5-person pilot and fix blocking friction. Representative genuine confirmation/recovery receipt and broader retention/operating review still precede broad registration. Finlay chooses T0 and publishes the [prepared course/module posts](../launch/linkedin-series.md). GitHub workflow publishing remains [issue #10](https://github.com/drfinlaymccall/human-ai-orientation/issues/10); local passing checks do not imply a GitHub Actions run.
