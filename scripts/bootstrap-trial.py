#!/usr/bin/env python3
"""Prepare an isolated Moodle trial on Ubuntu 24.04 amd64; no system installation."""
import hashlib
import json
import os
from pathlib import Path
import platform
import secrets
import subprocess

ROOT = Path(__file__).resolve().parents[1]
TRIAL = ROOT / 'trial'
MOODLE_COMMIT = '215f44380bdc3ccf852a3a22e34f8423ff64033a'
PACKAGES = '''php8.3-cli php8.3-common php8.3-curl php8.3-xml php8.3-mbstring
php8.3-intl php8.3-zip php8.3-gd php8.3-pgsql php8.3-opcache postgresql-16
postgresql-client-16 libpq5 libzip4t64 libonig5 libxslt1.1 libllvm17t64 libicu74
libedit2 libargon2-1 libsodium23 libgd3 libldap2'''.split()


def run(args, **kwargs):
    subprocess.run([str(x) for x in args], check=True, **kwargs)


def main():
    os.umask(0o077)
    if platform.machine() != 'x86_64' or 'VERSION_ID="24.04"' not in Path('/etc/os-release').read_text():
        raise SystemExit('This bootstrap is scoped to Ubuntu 24.04 amd64.')
    if (TRIAL / 'moodle/config.php').exists():
        raise SystemExit('Trial already configured. Use scripts/trial.py start; bootstrap will not overwrite it.')
    for d in ['', 'packages', 'runtime', 'data', 'socket', 'mail', 'logs']:
        (TRIAL / d).mkdir(parents=True, exist_ok=True, mode=0o700)
    TRIAL.chmod(0o700)
    run(['apt-get', 'download', *PACKAGES], cwd=TRIAL / 'packages')
    for package in sorted((TRIAL / 'packages').glob('*.deb')):
        run(['dpkg-deb', '-x', package, TRIAL / 'runtime'])
    if not (TRIAL / 'moodle/.git').exists():
        run(['git', 'clone', '--depth', '1', '--branch', 'MOODLE_405_STABLE', 'https://github.com/moodle/moodle.git', TRIAL / 'moodle'])
    run(['git', '-C', TRIAL / 'moodle', 'fetch', '--depth', '1', 'origin', MOODLE_COMMIT])
    run(['git', '-C', TRIAL / 'moodle', 'checkout', '--detach', MOODLE_COMMIT])
    ext = ['ctype','curl','dom','fileinfo','gd','iconv','intl','mbstring','pgsql','phar','simplexml','sockets','tokenizer','xml','xmlreader','xmlwriter','zip']
    ini = f'extension_dir="{TRIAL}/runtime/usr/lib/php/20230831"\n' + ''.join(f'extension={e}\n' for e in ext)
    ini += f'''memory_limit=256M
max_input_vars=5000
max_execution_time=120
post_max_size=16M
upload_max_filesize=16M
date.timezone=Australia/Sydney
sendmail_path="{ROOT}/scripts/capture-email.py"
display_errors=Off
log_errors=On
error_log="{TRIAL}/logs/php-errors.log"
session.cookie_httponly=1
session.cookie_samesite=Lax
'''
    (TRIAL / 'php.ini').write_text(ini)
    credentials = TRIAL / 'credentials.json'
    if not credentials.exists():
        credentials.write_text(json.dumps({'admin_username':'trialadmin', 'admin_password':secrets.token_urlsafe(24)+'aA1!'},indent=2))
    credentials.chmod(0o600)
    env = dict(os.environ, LD_LIBRARY_PATH=str(TRIAL / 'runtime/usr/lib/x86_64-linux-gnu'))
    pg = TRIAL / 'runtime/usr/lib/postgresql/16/bin'
    if not (TRIAL / 'postgres/PG_VERSION').exists():
        run([pg/'initdb', '-D', TRIAL/'postgres', '--locale=C.UTF-8', '--encoding=UTF8', '--auth-local=trust', '--auth-host=reject'], env=env)
        with (TRIAL/'postgres/postgresql.conf').open('a') as f:
            f.write(f"\nlisten_addresses = ''\nunix_socket_directories = '{TRIAL}/socket'\nunix_socket_permissions = 0700\nport = 55432\nshared_buffers = 64MB\nmax_connections = 20\n")
    run([pg/'pg_ctl','-D',TRIAL/'postgres','-l',TRIAL/'logs/postgres.log','start'],env=env)
    run([pg/'createdb','-h',TRIAL/'socket','-p','55432','orientation'],env=env)
    with (TRIAL/'logs/install.log').open('w') as log:
        run([ROOT/'scripts/php',ROOT/'scripts/install-moodle.php'],stdout=log,stderr=subprocess.STDOUT)
    config = TRIAL/'moodle/config.php'
    text = config.read_text()
    anchor = "require_once(__DIR__ . '/lib/setup.php');"
    assert anchor in text
    config.write_text(text.replace(anchor,"$CFG->slasharguments = false;\n$CFG->divertallemailsto = 'trial@example.test';\n$CFG->noemailever = false;\n"+anchor))
    config.chmod(0o600)
    run([ROOT/'scripts/php',ROOT/'scripts/seed-course.php'])
    hashes = {}
    for package in sorted((TRIAL/'packages').glob('*.deb')):
        with package.open('rb') as stream:
            hashes[package.name] = hashlib.file_digest(stream, 'sha256').hexdigest()
    manifest = {'moodle_commit': MOODLE_COMMIT, 'packages': hashes}
    (TRIAL/'runtime-manifest.json').write_text(json.dumps(manifest,indent=2))
    run(['python3',ROOT/'scripts/trial.py','start'])

if __name__ == '__main__':
    main()
