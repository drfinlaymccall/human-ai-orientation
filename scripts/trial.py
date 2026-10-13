#!/usr/bin/env python3
"""Manage only this private Moodle trial. Requires its local runtime to be prepared."""
import argparse
import json
import os
from pathlib import Path
import signal
import subprocess
import time
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
TRIAL = ROOT / 'trial'
PG = TRIAL / 'runtime/usr/lib/postgresql/16/bin'
ENV = dict(os.environ, LD_LIBRARY_PATH=str(TRIAL / 'runtime/usr/lib/x86_64-linux-gnu'))
PIDFILE = TRIAL / 'web.pid'
URL = 'http://127.0.0.1:8787'


def web_pid():
    if not PIDFILE.exists():
        return None
    pid = int(PIDFILE.read_text())
    try:
        command = Path(f'/proc/{pid}/cmdline').read_bytes()
    except FileNotFoundError:
        return None
    return pid if str(TRIAL / 'runtime/usr/bin/php8.3').encode() in command and b'127.0.0.1:8787' in command else None


def pg_status():
    return subprocess.run([str(PG / 'pg_ctl'), '-D', str(TRIAL / 'postgres'), 'status'], env=ENV, capture_output=True).returncode == 0


def start():
    if 'https://orientation.finlaymccall.com' in (TRIAL / 'moodle/config.php').read_text():
        raise SystemExit('This installation uses public services. Use systemctl --user start orientation-web.service.')
    if not pg_status():
        subprocess.run([str(PG / 'pg_ctl'), '-D', str(TRIAL / 'postgres'), '-l', str(TRIAL / 'logs/postgres.log'), 'start'], env=ENV, check=True)
    if not web_pid():
        with (TRIAL / 'logs/web.log').open('ab') as log:
            process = subprocess.Popen([str(ROOT / 'scripts/php'), '-S', '127.0.0.1:8787', '-t', str(TRIAL / 'moodle')], cwd=ROOT, stdout=log, stderr=log, start_new_session=True, env=dict(ENV, PHP_CLI_SERVER_WORKERS='2'))
        PIDFILE.write_text(str(process.pid))
    for _ in range(40):
        try:
            with urllib.request.urlopen(URL + '/login/index.php', timeout=3) as response:
                if response.status == 200 and web_pid():
                    print('Private Moodle trial ready: ' + URL)
                    return
        except OSError:
            time.sleep(.5)
    raise SystemExit('Trial did not become ready; inspect trial/logs/web.log.')


def stop():
    if (ROOT / 'trial/public-services-enabled').exists():
        raise SystemExit('This installation uses public services. See docs/trial/PUBLIC-DEPLOYMENT.md before stopping them.')
    pid = web_pid()
    if pid:
        os.killpg(pid, signal.SIGTERM)
    if PIDFILE.exists():
        PIDFILE.unlink()
    if pg_status():
        subprocess.run([str(PG / 'pg_ctl'), '-D', str(TRIAL / 'postgres'), '-m', 'fast', 'stop'], env=ENV, check=True)
    print('Trial stopped. Lesson content and saved learner data are retained.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['start', 'stop', 'status'])
    action = parser.parse_args().action
    if action == 'start': start()
    elif action == 'stop': stop()
    else: print(json.dumps({'web_running': bool(web_pid()), 'database_running': pg_status(), 'url': URL}))
