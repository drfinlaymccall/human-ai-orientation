#!/usr/bin/env python3
"""Install only this repository's local plugin into an explicitly selected private runtime."""
import argparse
import json
import os
import re
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]

def plugin_version(path):
    match = re.search(r'\$plugin->version\s*=\s*(\d+)\s*;', path.read_text())
    if not match:
        raise SystemExit('Cannot verify plugin version; no files copied.')
    return int(match.group(1))

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--trial-dir', type=Path, default=ROOT / 'trial')
    parser.add_argument('--upgrade', action='store_true', help='Run Moodle supported noninteractive upgrade after copying')
    args = parser.parse_args()
    trial = args.trial_dir.resolve(strict=True)
    runtime = trial / 'moodle'
    if not (runtime / 'config.php').is_file() or runtime.is_symlink():
        raise SystemExit('An installed private Moodle runtime directory is required.')
    target = runtime / 'local/orientation'
    if target.is_symlink():
        raise SystemExit('Refusing a symlinked plugin destination.')
    manifest = json.loads((ROOT / 'content/course-map.json').read_text())
    if manifest['course_shortname'] != 'AI-ORIENTATION-TRIAL':
        raise SystemExit('Unexpected course map; explicit review required.')
    baseline = ['first-task', 'useful-context', 'check-and-continue']
    slugs = [a['slug'] for a in manifest['activities']]
    if len(set(slugs)) != len(slugs) or any(a['idnumber'] != 'orientation:' + a['slug'] for a in manifest['activities']):
        raise SystemExit('Duplicate or mismatched stable activity identity in course map.')
    if (manifest.get('baseline_version') != 1 or manifest.get('baseline_slugs') != baseline or
            [a['slug'] for a in manifest['activities'] if a['baseline'] is True] != baseline):
        raise SystemExit('Original practice baseline changed; explicit completion-policy review required.')
    source = ROOT / 'moodle/local/orientation'
    for schema in ['db/install.xml', 'db/upgrade.php']:
        if (target / schema).exists() and not (source / schema).is_file():
            raise SystemExit('Integrate the installed plugin schema and its privacy/navigation support into this release before deployment; no files copied.')
    if (target / 'version.php').exists() and plugin_version(target / 'version.php') > plugin_version(source / 'version.php'):
        raise SystemExit('The runtime has a newer plugin version; integrate it before deployment. No files copied.')
    # Repository-owned files only; no runtime config/database copying or deletion.
    shutil.copytree(source, target, dirs_exist_ok=True)
    shutil.copyfile(ROOT / 'content/course-map.json', target / 'course-map.json')
    shutil.copyfile(ROOT / 'content/starting-point.json', target / 'starting-point.json')
    shutil.copyfile(ROOT / 'content/generated/activity-atlas.html', target / 'activity-atlas.html')
    for asset in ['activity-atlas.css', 'activity-atlas.js']:
        shutil.copyfile(ROOT / 'public/assets' / asset, target / asset)
    if args.upgrade:
        env = dict(os.environ, ORIENTATION_TRIAL_DIR=str(trial))
        subprocess.run([str(ROOT / 'scripts/php'), str(runtime / 'admin/cli/upgrade.php'), '--non-interactive'], env=env, check=True)
    print('Orientation plugin copied. ' + ('Native upgrade completed.' if args.upgrade else 'Run Moodle admin/cli/upgrade.php before use.'))

if __name__ == '__main__':
    main()
