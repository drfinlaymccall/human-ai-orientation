#!/usr/bin/env python3
"""Publish canonical launcher assets and add one entry point to current public pages."""
from pathlib import Path
import shutil
from feedback_markup import decorate_feedback

ROOT = Path(__file__).resolve().parents[1]
for extension in ['js', 'css']:
    shutil.copyfile(ROOT / f'moodle/local/orientationfeedback/launcher.{extension}',
                    ROOT / f'public/assets/feedback-launcher.{extension}')
count = 0
for page in (ROOT / 'public').glob('*.html'):
    original = page.read_text()
    updated = decorate_feedback(original)
    if updated != original:
        page.write_text(updated)
        count += 1
print(f'Feedback launcher ready; {count} public pages updated.')
