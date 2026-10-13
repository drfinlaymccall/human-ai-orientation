# Public platform trial

Prepared 13 October 2026. Hostname: **orientation.finlaymccall.com**.

Status: **publicly reachable** at https://orientation.finlaymccall.com. Cloudflare MCP created the proxied DNS record; both Cloudflare HTTPS and the origin certificate were verified. An independent TinyFish browser fetched the live homepage successfully. All three public browser checks passed, including pilot sign-in, policy acceptance, a completed lesson, persisted completion after a fresh login, learner authoring restrictions, and blocked private files. Synthetic QA accounts are suspended.

## What this release provides

- Public introduction and complete read-only lesson at `/preview`.
- Native Moodle lesson, saved reflection and completion for individually provisioned pilot accounts.
- Finlay's learner-view account in `trial/ACCESS.md`; administrator credentials remain in `trial/credentials.json`. Both are private and ignored by Git.
- Public registration is disabled. Existing synthetic desktop/mobile accounts are suspended and their sessions invalidated. QA accounts use unique generated passwords and are suspended after verification.
- Outbound email remains diverted into the private local test mailbox. The recovery link explains how to ask Finlay for help; it does not promise an email that cannot arrive.
- A short information-use notice explains saved progress, reflection, essential cookies and Finlay's access. Personal context portfolios stay in learners' own notes.

This is one lesson and a platform trial, not the agreed three-activity MVP. Real email, open enrolment, the other two activities and the reviewed support-agent workflow remain work to complete.

## Runtime and routing

Cloudflare DNS → existing system Caddy on HTTPS → course Caddy at `127.0.0.1:8789` → PHP-FPM at `127.0.0.1:8788` → PostgreSQL on the private Unix socket in `trial/socket`.

The extra loopback Caddy runs as Finlay so the existing system web server does not need filesystem access to the private runtime/data directory. Neither PHP-FPM nor the database is exposed on a public interface. The original PHP development server is stopped.

The system route is `/etc/caddy/conf.d/orientation.caddy`, copied from `deploy/orientation.caddy`. Existing routes are preserved. Application services are installed from `deploy/orientation-*.service` into `~/.config/systemd/user/`. The existing user has lingering enabled, so enabled services start at boot without an interactive login. Cron runs every minute via the user timer.

Moodle's canonical URL is HTTPS, with SSL proxy mode and secure cookies. Caddy supplies standard FastCGI variables. Moodle 4.5 only recognises a fixed set of server names, so `SERVER_SOFTWARE=nginx` selects its REQUEST_URI/SCRIPT_NAME FastCGI handling. This is an explicit compatibility setting; the actual web server is Caddy, and Moodle core remains unmodified. Recheck this integration on upgrades.

The lesson URL is `/mod/lesson/view.php?id=1`; course URL is `/course/view.php?id=2`. The Caddy rules block configuration, version-control, dependency and command-line paths. Public pages carry a no-index header while the prototype is being reviewed. This is discoverability guidance, not access control.

## Operation

```sh
systemctl --user status orientation-db orientation-php orientation-web orientation-cron.timer
systemctl --user restart orientation-php orientation-web
journalctl --user -u orientation-web -u orientation-php --since '10 minutes ago'
```

For a planned full stop, stop cron and web/PHP before the database:

```sh
systemctl --user stop orientation-cron.timer orientation-web orientation-php orientation-db
systemctl --user start orientation-web orientation-cron.timer
```

The application dependency chain starts the database and PHP when web starts. The native PostgreSQL service receives SIGINT for orderly fast shutdown. The enabled units restart failed processes. This is not external uptime monitoring.

Do not run the private `seed-course.php` or development-server launcher against this deployment. Guards prevent reinstating trial registration settings or starting the old development server. `npm test:trial` belongs to a separate private installation; it is not a production smoke test.

## Verification

Before public DNS, desktop and mobile-width landing/preview checks passed. Initial checks caught forwarded-host routing, Moodle's server-name handling and a private-path handler ordering issue; these were corrected before exposure. The final public HTTPS checks passed (see the deployment evidence below).

Run a synthetic public journey with:

```sh
scripts/php scripts/public-qa-user.php
npm test
scripts/php scripts/public-qa-user.php suspend
```

Only run this deliberately: it creates a synthetic account and reflection in the live trial. `ORIENTATION_LOCAL_ORIGIN=1` intercepts requests to the prepared local origin; that mode is not proof of public DNS or TLS. Public receipts go to `trial/public-test-report.json`; screenshots contain synthetic data only.

## Backup and recovery

A pre-deployment backup exists under `trial/backups/20261013T042037Z/`: custom-format PostgreSQL dump, original Moodle config, and the data directory archive. The database dump was restored into a temporary database and all seven lesson pages verified; the complete data archive was read successfully. The scratch database was then removed. The receipt is `trial/backup-verification.json`.

This verifies the database restore and archive readability, not a complete replacement-host recovery. Backups remain on this server; off-server rotation is still required before inviting a wider audience. Later restoration must consider newly submitted learner records rather than overwrite them silently.

To withdraw public access, remove only the orientation route from system Caddy, validate the remaining configuration, reload Caddy, and remove only this hostname's DNS record. Keep the private runtime and backups. A content or PHP problem can usually be fixed without removing DNS.

## Deployment evidence

- Cloudflare MCP created A record `9578894013256206ee5386d24e763a86` in zone `53e5e38a87254e91ed4c950389df494b` at 2026-10-13 04:36:41 UTC. Hostname `orientation.finlaymccall.com`, origin `46.250.247.40`, proxied, automatic TTL. No previous record existed.
- Both 1.1.1.1 and 8.8.8.8 returned the new Cloudflare edge addresses. The server’s upstream resolver temporarily retained the earlier negative lookup.
- Public Cloudflare HTTPS and direct-origin HTTPS returned 200 with certificate validation enabled. The origin has a Let’s Encrypt certificate for the hostname, valid until 11 January 2027, managed by Caddy.
- Independent external TinyFish fetch returned the expected homepage title and course content.
- Browser checks use `ORIENTATION_EDGE_IP=104.21.84.205` during local DNS propagation. This pins Chromium to the verified public Cloudflare edge, with real HTTPS validation and no local interception; it does not change system DNS or the site.
- Private machine-readable receipts: `trial/cloudflare-dns-receipt.json`, `trial/public-deployment.json`, `trial/origin-certificate.txt`.
- Final browser result: **3 passed in 53.7 seconds** through the public Cloudflare edge: introduction/preview at desktop and mobile widths; pilot login, policy acceptance, lesson reflection/completion and return visit; closed registration, explicit recovery guidance and private-file denial. Secure/HttpOnly session cookies and learner authoring restrictions were asserted. QA accounts were suspended afterward. Receipt: `trial/public-edge-test-report.json`.


## Public AI-context route

`/ai/` now provides learner-readable instructions for sharing course context with their own AI, with a pinned Markdown source and structured manifest. Public/current files derive from `content/ai/course-context.json`. The Caddy allowlist exposes only the intended context files; all private-runtime restrictions remain in place. See [design and release instructions](../curriculum/public-ai-context.md). These pages require no account and no JavaScript for reading. Public GitHub publication is pending.
