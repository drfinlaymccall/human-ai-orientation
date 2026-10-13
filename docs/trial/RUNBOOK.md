# Private Moodle trial (historical setup)

**Deployment update:** this installation has moved to managed services with an HTTPS canonical URL. The original localhost development server is stopped. Use [PUBLIC-DEPLOYMENT.md](PUBLIC-DEPLOYMENT.md) for current access, status and operations. The instructions below describe the original private experiment and reproduction on a separate installation.

This is a local evaluation installation on the existing server. It is not the public course launch.

## Open it

On the server, open **http://127.0.0.1:8787/course/view.php?id=2**. Moodle listens only on loopback. If your browser is on another computer, forward the port through your existing SSH connection:

```sh
ssh -N -L 8787:127.0.0.1:8787 finlay@YOUR_SERVER
```

Replace `YOUR_SERVER` with the server address you already use, then open the same URL on your computer. No DNS or public reverse-proxy configuration has been changed.

For a learner view, the latest synthetic desktop login is in `trial/desktop-learner.json`; the mobile test account is in `trial/mobile-learner.json`. They contain fictional test activity. The administrator login is in `trial/credentials.json`. These files and the entire runtime/data folder are excluded from Git. Do not publish them.

For a read-only review without signing in, open [the lesson preview](lesson-preview.html). This is a content snapshot, not a second LMS or a saved-progress demo.

## What to try

1. Sign in as the synthetic learner; open **Give your AI useful context**.
2. Review or restart the completed lesson. Read an example and copy the context starter into your own notes.
3. Try a small task with your AI, or use the complete worked-example route.
4. Submit a short fictional reflection and continue to the end.
5. Sign out, return, and check completion. For a mid-lesson pause, use a fresh trial account.

New accounts must use an address ending in `@example.test`. Moodle captures confirmation and password-recovery messages in `trial/mail/*.eml`; open the latest matching message locally to follow its link. This mailbox is an operator test facility, not a learner-facing replacement for real email. No messages leave this trial.

## Start, stop and inspect

From `/home/finlay/apps/human-ai-orientation`:

```sh
python3 scripts/trial.py status
python3 scripts/trial.py start
python3 scripts/trial.py stop
```

Stopping preserves the database, submitted answers and files. Starting reconnects the same database. These are user-owned processes, not installed system services; no automatic startup on reboot has been configured.

The application uses Moodle 4.5.15 at commit `215f44380bdc3ccf852a3a22e34f8423ff64033a`, Ubuntu PHP 8.3 packages and PostgreSQL 16.15. PostgreSQL accepts only a Unix socket inside the private trial folder; there is no database TCP listener. PHP's development web server is appropriate only for this local trial.

## Lesson and configuration

- [Original lesson content](../../content/useful-context.json).
- [Learning design and evidence map](lesson-design.md).
- `scripts/seed-course.php`: creates the course/lesson through Moodle APIs and applies trial settings. Repeated runs preserve lesson pages and existing attempts. It does not synchronise later edits to lesson text.
- `content/moodle-language/lesson.php`: supported local language overrides replace misleading exam/grading language for this ungraded trial. No Moodle core code was edited.
- Edit the lesson in Moodle as administrator, then reconcile the source JSON for a durable revision. Export/import and upgrade workflows remain production work.

## Reproduce and verify

For a fresh project checkout on **Ubuntu 24.04 amd64**, run `python3 scripts/bootstrap-trial.py`, then `npm ci`. Bootstrap downloads official Moodle source at the recorded commit and Ubuntu packages, extracts everything into `trial/`, creates a dedicated database and generated admin password, and loads the lesson. It does not use sudo or install OS services. Repository package versions may advance; `trial/runtime-manifest.json` records the actual package hashes. Bootstrap refuses an already configured installation rather than overwrite data. If setup fails part-way, inspect logs before restarting or removing anything.

Browser tests use the existing Chromium path in `playwright.config.cjs`. On another machine set `ORIENTATION_CHROMIUM` to a compatible installed Chromium executable.

```sh
npm test
scripts/php tests/check-evidence.php
```

Tests create synthetic `@example.test` accounts and preserve their evidence. They do not submit prompts to real AI providers. Browser tests use desktop and narrow mobile viewports; this does not replace physical-phone, screen-reader or human usability testing. The final evidence command checks actual saved reflection and activity-completion records.

## Logs and operation

- `trial/logs/web.log`: requests and web-server failures; may contain session/token URLs, so keep private.
- `trial/logs/php-errors.log`: PHP/runtime errors.
- `trial/logs/postgres.log`: database startup and connection errors.
- `trial/logs/install.log`: installation results.
- `trial/test-report.json`: latest browser results.
- `trial/mail/`: locally captured confirmation, welcome and recovery mail; includes sensitive links.

Healthy: both processes run, login responds, a submitted reflection survives a return visit, and messages appear only in the local mailbox. On failure, stop the trial and inspect the relevant log. Do not expose the development server to resolve an access problem. Owner: Finlay; repeat the essential journey after any content/configuration change.

For a local snapshot, stop the trial and copy the entire `trial/` directory to another private location. This is a trial preservation method, not a tested production backup/restore system. Production needs HTTPS, a supported application process manager/web server, verified outbound email, scheduled tasks, a restore test, retention/export/deletion decisions and the reviewed support workflow.
