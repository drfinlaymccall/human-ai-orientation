#!/usr/bin/env python3
"""Install a new synthetic Moodle database and runtime, never copy learner data or SMTP.
Requires the existing pinned core and local PostgreSQL/runtime. Refuses overwrite.
"""
from pathlib import Path
import json
import os
import secrets
import subprocess

ROOT = Path(__file__).resolve().parents[1]
FIXTURE = ROOT / 'trial/launch-fixture'
PIN = '215f44380bdc3ccf852a3a22e34f8423ff64033a'

def run(args, **kwargs):
    return subprocess.run([str(a) for a in args], check=True, **kwargs)


def main():
    os.umask(0o077)
    if FIXTURE.exists():
        raise SystemExit('Fixture exists; retained unchanged. Use its existing database, or create a different explicit fixture.')
    FIXTURE.mkdir(mode=0o700)
    for name in ['moodle', 'data', 'mail', 'logs']:
        (FIXTURE/name).mkdir(mode=0o700)
    # Archive tracked upstream files only: no live config, database, mail or plugins.
    archive = subprocess.Popen(['git', '-C', str(ROOT/'trial/moodle'), 'archive', PIN], stdout=subprocess.PIPE)
    run(['tar', '-x', '-C', FIXTURE/'moodle'], stdin=archive.stdout)
    archive.stdout.close()
    if archive.wait():
        raise SystemExit('Pinned core archive failed.')
    credentials = {'admin_username': 'launchadmin', 'admin_password': secrets.token_urlsafe(24)+'aA1!'}
    (FIXTURE/'credentials.json').write_text(json.dumps(credentials))
    env = dict(os.environ, LD_LIBRARY_PATH=str(ROOT/'trial/runtime/usr/lib/x86_64-linux-gnu'))
    run([ROOT/'trial/runtime/usr/lib/postgresql/16/bin/createdb', '-h', ROOT/'trial/socket', '-p', '55432', 'orientation_launch_fixture'], env=env)
    install = '''<?php
$c = json_decode(file_get_contents(__DIR__ . '/credentials.json'));
$root = dirname(__DIR__, 2);
$argv = [__DIR__ . '/moodle/admin/cli/install.php', '--non-interactive', '--agree-license', '--lang=en', '--chmod=700',
'--wwwroot=http://127.0.0.1:18802', '--dataroot=' . __DIR__ . '/data', '--dbtype=pgsql',
'--dbhost=' . $root . '/trial/socket', '--dbport=55432', '--dbname=orientation_launch_fixture', '--dbuser=' . get_current_user(),
'--fullname=Synthetic launch fixture', '--shortname=Launch QA', '--adminuser=' . $c->admin_username,
'--adminpass=' . $c->admin_password, '--adminemail=admin@example.test', '--supportemail=support@example.test'];
$_SERVER['argv'] = $argv; $_SERVER['argc'] = count($argv); require $argv[0];
'''
    (FIXTURE/'install.php').write_text(install)
    with (FIXTURE/'logs/install.log').open('w') as log:
        run([ROOT/'scripts/php', FIXTURE/'install.php'], stdout=log, stderr=subprocess.STDOUT)
    config = FIXTURE/'moodle/config.php'
    text = config.read_text()
    anchor = "require_once(__DIR__ . '/lib/setup.php');"
    if anchor not in text:
        raise SystemExit('Expected native setup anchor missing.')
    # fixture-php sets PHP mail()'s capture transport for this runtime only.
    capture = FIXTURE/'capture-mail.py'
    capture.write_text("import pathlib,sys,uuid,os\nos.umask(0o077)\n(pathlib.Path(__file__).parent/'mail'/f'{uuid.uuid4()}.eml').write_bytes(sys.stdin.buffer.read())\n")
    config.write_text(text.replace(anchor, "$CFG->slasharguments = false;\n$CFG->smtphosts = '';\n$CFG->noemailever = false;\n"+anchor))
    config.chmod(0o600)
    print('Installed isolated launch fixture on localhost:18802. Only new synthetic data; mail captured locally.')

if __name__ == '__main__':
    main()
