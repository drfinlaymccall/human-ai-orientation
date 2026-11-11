# The site is down: what to do

For Finlay, without an agent. Work down the list and stop when the site is back. Each step is one command in a terminal on the server. Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

How a request travels: **Cloudflare → system Caddy (ports 80 and 443) → course web server (port 8789) → PHP → database.** The first three checks follow that path.

## 1. Is it down for everyone?

```bash
curl -sI https://orientation.finlaymccall.com/ | head -1
```

- `HTTP/2 200`: the site is up. The problem is at your end, or it has passed.
- `HTTP/2 521` or `522`: Cloudflare cannot reach the server. Go to step 2.
- `HTTP/2 502`: the front server is up but the course server or PHP is not. Go to step 3.
- No answer at all: check the server is on in your Contabo account.

## 2. Is the front web server (system Caddy) running?

```bash
systemctl is-active caddy
```

If it does not say `active`, start it. This is the one step that needs your password:

```bash
sudo systemctl start caddy
```

This was the cause on 7 November 2026.

## 3. Are the three course services running?

```bash
systemctl --user is-active orientation-db orientation-php orientation-web
```

You should see `active` three times. If not, restart all three in this order:

```bash
systemctl --user restart orientation-db orientation-php orientation-web
```

Each of these is set to restart by itself within five seconds if it stops for any reason other than you stopping it. If one is not `active`, that did not work this time; restart it by hand as above.

## 4. Does the course answer on the server itself?

```bash
curl -sI http://127.0.0.1:8789/ | head -1
```

- `HTTP/1.1 200 OK`: the course is fine. If the public address still fails, the problem is system Caddy (step 2) or Cloudflare.
- Anything else: look at the last lines of the log for a reason.

```bash
journalctl --user -u orientation-web -u orientation-php -u orientation-db -n 40 --no-pager
```

## 5. Is the disk full?

```bash
df -h /home | tail -1
```

If the "Use%" column is 95% or more, the database may have stopped. Free some space, then repeat step 3. Do not delete anything under `trial/` in the course folder: it holds the course database, uploads and backups.

## If it is still down

- Do not reinstall or restore anything. Learner records and saved work are in the database, and a restore could overwrite newer work.
- Ask an agent to look, and give it the output of steps 1 to 5.
- Write down the time you noticed and the time it came back. The agent adds it to the record in [PUBLIC-DEPLOYMENT.md](../trial/PUBLIC-DEPLOYMENT.md#backup-and-recovery).

## What would have told you sooner

An outside uptime check that emails you. See [section 6 of the launch audit](../reviews/2026-11-10-launch-audit.md#6-uptime-monitor-recommendation). It is a Stage A gate and is not set up yet.
