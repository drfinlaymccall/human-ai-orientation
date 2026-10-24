#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
git diff --exit-code -- content public
test -z "$(git status --porcelain --untracked-files=all -- content public)"
npm run test:support
python3 -m unittest discover -s tests -p test_deploy.py
node tests/journey-lifecycle.test.cjs
npm run test:entry
npm run test:metadata
npm run test:portfolio
