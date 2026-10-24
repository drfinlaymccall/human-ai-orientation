#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
git diff --exit-code -- content public moodle/local/orientation/student-welcome.json
test -z "$(git status --porcelain --untracked-files=all -- content public moodle/local/orientation/student-welcome.json)"
npm run test:support
python3 -m unittest discover -s tests -p test_deploy.py
node tests/journey-lifecycle.test.cjs
npm run test:entry
npm run test:metadata
npm run test:portfolio
npm run test:feedback
