#!/usr/bin/env python3
"""Add search and sharing metadata to every public page; write robots.txt and sitemap.xml.

Runs last in the build. It is idempotent: it removes its own tags, and the share tags
other builders write, before it adds one consistent set.
"""
from html import escape
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
source = json.loads((ROOT / 'content/discovery.json').read_text(encoding='utf-8'))
origin = source['origin']

OWNED = re.compile(
    r'<link rel="(?:canonical|icon)"[^>]*>'
    r'|<meta property="og:[^"]+"[^>]*>'
    r'|<meta name="twitter:[^"]+"[^>]*>')
TITLE = re.compile(r'<title>(.*?)</title>', re.S)
DESCRIPTION = re.compile(r'<meta name="description" content="([^"]*)">')


def tags(page, title, description):
    url = origin + page.get('canonical', page['path'])
    image = origin + source['share_image']
    attr = lambda value: escape(value, quote=True)
    return ''.join((
        f'<link rel="canonical" href="{attr(url)}">',
        '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">',
        f'<meta property="og:title" content="{title}">',
        f'<meta property="og:description" content="{description}">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:url" content="{attr(url)}">',
        f'<meta property="og:site_name" content="{attr(source["site_name"])}">',
        f'<meta property="og:image" content="{attr(image)}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{attr(source["share_image_alt"])}">',
        '<meta name="twitter:card" content="summary_large_image">',
    ))


listed = {page['file'] for page in source['pages']}
found = {str(path.relative_to(PUBLIC)) for path in PUBLIC.glob('*.html')} | {'ai/index.html'}
if listed != found:
    raise ValueError(f'content/discovery.json and public/ disagree: {sorted(listed ^ found)}')

for page in source['pages']:
    path = PUBLIC / page['file']
    text = OWNED.sub('', path.read_text(encoding='utf-8'))
    title = TITLE.search(text)
    if not title:
        raise ValueError(f'{page["file"]} has no title')
    described = DESCRIPTION.search(text)
    if described:
        description = described.group(1)
    elif 'description' in page:
        description = escape(page['description'], quote=True)
        text = text.replace(title.group(0), f'<meta name="description" content="{description}">' + title.group(0), 1)
    else:
        raise ValueError(f'{page["file"]} needs a description in content/discovery.json')
    text = text.replace(title.group(0), title.group(0) + tags(page, title.group(1), description), 1)
    path.write_text(text, encoding='utf-8')

indexable = [page['path'] for page in source['pages'] if page.get('sitemap', True)]
(PUBLIC / 'sitemap.xml').write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + ''.join(f'  <url><loc>{origin}{path}</loc></url>\n' for path in indexable) + '</urlset>\n', encoding='utf-8')
paths = ' '.join(indexable)
(ROOT / 'deploy/robots-preview.caddy').write_text(
    '# Written by scripts/build-discovery.py. Preview: nothing is offered to search.\n'
    'header X-Robots-Tag "noindex, nofollow"\n', encoding='utf-8')
(ROOT / 'deploy/robots-stage-a.caddy').write_text(
    '# Written by scripts/build-discovery.py. Stage A: only the public course pages are offered to search.\n'
    f'@notIndexable not path {paths}\n'
    'header @notIndexable X-Robots-Tag "noindex, nofollow"\n', encoding='utf-8')
signals = ', '.join(f'{key}={value}' for key, value in source['content_signals'].items())
(PUBLIC / 'robots.txt').write_text(
    '# Human AI Orientation. Course materials are CC BY 4.0.\n'
    '# Account and sign-in pages are kept out of search by a response header, not here.\n'
    f'User-agent: *\nContent-Signal: {signals}\nAllow: /\n\nSitemap: {origin}/sitemap.xml\n', encoding='utf-8')
