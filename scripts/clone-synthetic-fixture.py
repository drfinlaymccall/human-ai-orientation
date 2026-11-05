#!/usr/bin/env python3
"""Clone only the guarded localhost synthetic fixture into this checkout's independent 18812 fixture.
No live configuration, database, mail, sessions or readiness receipts are copied. Refuses overwrite.
"""
from pathlib import Path
import argparse
import json
import os
import re
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'trial/launch-fixture'
BASE = 'http://127.0.0.1:18812'
DATABASE = 'orientation_journey_fixture'

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--source', type=Path, required=True)
    args = parser.parse_args()
    source = args.source.resolve(strict=True)
    config = (source / 'moodle/config.php').read_text()
    def setting(key):
        match = re.search(r'\$CFG->' + key + r'\s*=\s*[\'\"]([^\'\"]*)[\'\"]\s*;', config)
        if not match:
            raise SystemExit('Expected fixture setting missing: ' + key)
        return match.group(1)
    if (setting('wwwroot') != 'http://127.0.0.1:18802' or setting('dbname') != 'orientation_launch_fixture'
            or Path(setting('dataroot')).resolve() != source / 'data'
            or not (source / 'capture-mail.py').is_file()
            or "pathlib.Path(__file__).parent/'mail'" not in (source / 'capture-mail.py').read_text()
            or not json.loads((source / 'course.json').read_text())['course_url'].startswith('http://127.0.0.1:18802/')):
        raise SystemExit('Only the existing synthetic localhost fixture can be cloned.')
    if DEST.is_symlink():
        if DEST.resolve() != source:
            raise SystemExit('Existing fixture symlink does not identify the guarded source.')
    elif DEST.exists():
        raise SystemExit('Independent fixture already exists; retained unchanged.')
    os.umask(0o077)
    env = dict(os.environ, LD_LIBRARY_PATH=str(ROOT / 'trial/runtime/usr/lib/x86_64-linux-gnu'))
    pg = ROOT / 'trial/runtime/usr/lib/postgresql/16/bin'
    connection = ['-h', setting('dbhost'), '-p', '55432', '-U', setting('dbuser')]
    # A consistent synthetic-only dump avoids blocking or terminating users of the source fixture.
    dump = ROOT / 'trial/journey-synthetic.dump'
    subprocess.run([str(pg / 'pg_dump'), *connection, '-Fc', '-f', str(dump), 'orientation_launch_fixture'], env=env, check=True)
    subprocess.run([str(pg / 'createdb'), *connection, DATABASE], env=env, check=True)
    subprocess.run([str(pg / 'pg_restore'), *connection, '-d', DATABASE, str(dump)], env=env, check=True)
    if DEST.is_symlink():
        DEST.unlink()
    DEST.mkdir(mode=0o700)
    subprocess.run(['cp', '-a', '--reflink=auto', str(source / 'moodle'), str(DEST / 'moodle')], check=True)
    for directory in ['data', 'mail', 'logs']:
        (DEST / directory).mkdir(mode=0o700)
    if (source / 'data/filedir').exists():
        shutil.copytree(source / 'data/filedir', DEST / 'data/filedir')
    # Reinstall the repository's supported language customisation, never private runtime language data.
    language = DEST / 'data/lang/en_local'
    language.mkdir(parents=True)
    shutil.copyfile(ROOT / 'content/moodle-language/lesson.php', language / 'lesson.php')
    for name in ['credentials.json', 'capture-mail.py', 'course.json', 'journey.json', 'preparation.json']:
        shutil.copyfile(source / name, DEST / name)
    def local_urls(value):
        if isinstance(value, str):
            return value.replace('http://127.0.0.1:18802', BASE)
        if isinstance(value, list):
            return [local_urls(item) for item in value]
        if isinstance(value, dict):
            return {key: local_urls(item) for key, item in value.items()}
        return value
    for name in ['course.json', 'journey.json', 'preparation.json']:
        (DEST / name).write_text(json.dumps(local_urls(json.loads((DEST / name).read_text()))))
    for key, value in [('wwwroot', BASE), ('dbname', DATABASE), ('dataroot', str(DEST / 'data'))]:
        config = re.sub(r'(\$CFG->' + key + r'\s*=\s*)[\'\"][^\'\"]*[\'\"]\s*;', lambda m: m.group(1) + repr(value) + ';', config)
    (DEST / 'moodle/config.php').write_text(config)
    (DEST / 'moodle/config.php').chmod(0o600)
    (DEST / 'synthetic-fixture.json').write_text(json.dumps({'synthetic': True, 'wwwroot': BASE, 'database': DATABASE}))
    dump.unlink()
    print('Created independent synthetic journey fixture on localhost:18812; original fixture retained unchanged.')

if __name__ == '__main__':
    main()
