#!/usr/bin/env python3
"""Explicitly copy only the standalone plugin; never run a Moodle upgrade or change settings."""
import argparse
from pathlib import Path
import shutil

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--moodle-root', required=True, type=Path)
parser.add_argument('--apply', action='store_true', help='Copy files; without this flag only describe the install')
args = parser.parse_args()
source = Path(__file__).resolve().parents[1] / 'moodle/local/orientationfeedback'
root = args.moodle_root.resolve()
if not (root / 'version.php').is_file() or not (root / 'lib/moodlelib.php').is_file():
    parser.error('Target must be a Moodle root')
if (root / 'local').is_symlink():
    parser.error('Refusing a symlinked local plugin directory')
target = root / 'local/orientationfeedback'
if target.is_symlink():
    parser.error('Refusing a symlinked target plugin')
if target.exists() and not (target / 'version.php').is_file():
    parser.error('Target exists and is not an existing plugin; inspect it manually')
print(f'Plugin: {source}\nDestination: {target}')
if args.apply:
    # Refuse symlinks inside either tree to prevent copying outside the explicit destination.
    if any(path.is_symlink() for tree in [source, target] if tree.exists() for path in tree.rglob('*')):
        parser.error('Refusing a tree containing symlinks')
    shutil.copytree(source, target, dirs_exist_ok=True)
    print('Copied. Run the Moodle admin upgrade separately; then explicitly configure the course, reviewer and enabled setting.')
else:
    print('Dry run. Add --apply to copy. No database, upgrade or configuration changes have been made.')
