# Operations: restart, headers, denied paths and a "site is down" guide — 11 November 2026

Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Audit package A6: F21, F22, F43 (in part), F44 (prepared), F45.

## Need

The audit found that a course service which stopped cleanly would stay stopped (the kind of stop behind the 7–8 November outage), that Finlay had no short guide for an outage, that another site could show the public pages inside a frame, that a few more private file kinds could be refused, and that sign-in pages re-download 1–2 MB on every view because everything is sent uncached.

## Decision

- Restart the three course services after any stop they were not asked to make.
- Add two protective headers to every response. A full content security policy is not added now; see Remaining questions.
- Move the "do not cache" rule from the front server, where it covered everything, to the course web server, where it covers only responses that say nothing about caching themselves. Moodle's pages and versioned files keep Moodle's own rules. The course server part is live with this change and changes nothing by itself, because the front server still says `no-store` on everything. The front server part needs sudo, so Finlay applies it (item 25 in his list). It is not a Stage A gate.

## Change

- `deploy/orientation-web.service`, `-php.service`, `-db.service`: `Restart=always`. `systemctl --user stop` still stops a service.
- `deploy/Caddyfile`:
  - `Content-Security-Policy: frame-ancestors 'self'` on every response that does not set its own policy;
  - `Permissions-Policy: microphone=(self), camera=(self), geolocation=(), payment=(), usb=()`. The microphone and camera stay available to this site only (voice feedback, and Moodle's own editor recording); other sites in a frame get neither. Location, payment and USB are off;
  - `Cache-Control: no-store` as a default for responses with no caching header;
  - refused with 404: `cli` folders anywhere, `config-dist.php`, `install.php`, and files ending `.orig`, `.old`, `.save`, `.swp` or `~`.
- `deploy/orientation.caddy`: the blanket `Cache-Control "no-store"` line is removed in the repository. **The installed copy is unchanged until Finlay applies it.**
- [`docs/operations/site-down.md`](../operations/site-down.md): five checks in order, each one command.
- Correction to the [notify list record](2026-11-11-notify-list.md): no synthetic sign-up was made on the live site.

## Verification

Results for the merged head are on the pull request and on #9.

- `tests/test_discovery.py` (in `npm run check:public`): headers on public pages, `no-store` on public files, each newly refused path, `Restart=always` in the three unit files, and that each default header has its own directive.
- Found while testing: two default headers in one Caddy block apply only when both are missing, so a Moodle page with its own caching header lost the framing header. Each default now has its own directive, and a test guards it.
- Before merge, a temporary copy of the course web server on a local port, in front of the real PHP, showed: the sign-in page keeps Moodle's `no-store, no-cache…` and gains the framing header; Moodle's script files keep `public, max-age=7776000, immutable`; public pages say `no-store`; `/install.php` and `/admin/cli/cron.php` return 404. Only anonymous page reads were made.
- After merge: unit files installed for the user, `daemon-reload`, `Restart=always` read back from systemd; course web server validated and restarted; live headers and page loads checked.

## Remaining questions

- **Not tested by stopping a service.** The restart rule is read back from systemd; no service was killed on the live site to prove it.
- System Caddy and the server itself are outside this change. The outside uptime check (Finlay's item 3) is still the only thing that would report those.
- F43 in part: no content security policy beyond framing. Moodle and the course pages use inline scripts and styles, so a real policy needs a report-only trial first.
- F44: waits for Finlay (item 25).
- F23 (disk space alert) is not done; it belongs with the uptime monitor.
- `/.well-known/` addresses are refused by the existing dot-path rule. Nothing uses them today.
