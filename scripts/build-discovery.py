#!/usr/bin/env python3
"""Add search and sharing tags to every public page; write robots.txt, sitemap.xml and the search policies.

Runs last in the build. The tags come from scripts/discovery.py, which is idempotent.
"""
from pathlib import Path

from discovery import ORIGIN, PAGES, SOURCE, apply

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'

found = {str(path.relative_to(PUBLIC)) for path in PUBLIC.glob('*.html')} | {'ai/index.html'}
if set(PAGES) != found:
    raise ValueError(f'content/discovery.json and public/ disagree: {sorted(set(PAGES) ^ found)}')
for file in PAGES:
    path = PUBLIC / file
    path.write_text(apply(path.read_text(encoding='utf-8'), file), encoding='utf-8')

indexable = [page['path'] for page in SOURCE['pages'] if page.get('sitemap', True)]
(PUBLIC / 'sitemap.xml').write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + ''.join(f'  <url><loc>{ORIGIN}{path}</loc></url>\n' for path in indexable) + '</urlset>\n', encoding='utf-8')
(ROOT / 'deploy/robots-preview.caddy').write_text(
    '# Written by scripts/build-discovery.py. Preview: nothing is offered to search.\n'
    'header X-Robots-Tag "noindex, nofollow"\n', encoding='utf-8')
(ROOT / 'deploy/robots-stage-a.caddy').write_text(
    '# Written by scripts/build-discovery.py. Stage A: only the public course pages are offered to search.\n'
    f'@notIndexable not path {" ".join(indexable)}\n'
    'header @notIndexable X-Robots-Tag "noindex, nofollow"\n', encoding='utf-8')
signals = ', '.join(f'{key}={value}' for key, value in SOURCE['content_signals'].items())
(PUBLIC / 'robots.txt').write_text(
    '# Human AI Orientation. Course materials are CC BY 4.0.\n'
    '# Account and sign-in pages are kept out of search by a response header, not here.\n'
    f'User-agent: *\nContent-Signal: {signals}\nAllow: /\n\nSitemap: {ORIGIN}/sitemap.xml\n', encoding='utf-8')
