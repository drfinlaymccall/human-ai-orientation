"""Search and sharing tags for a public page, from content/discovery.json. Idempotent."""
from html import escape
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = json.loads((ROOT / 'content/discovery.json').read_text(encoding='utf-8'))
ORIGIN = SOURCE['origin']
PAGES = {page['file']: page for page in SOURCE['pages']}

OWNED = re.compile(
    r'<link rel="(?:canonical|icon)"[^>]*>'
    r'|<meta property="og:[^"]+"[^>]*>'
    r'|<meta name="twitter:[^"]+"[^>]*>')
TITLE = re.compile(r'<title>(.*?)</title>', re.S)
DESCRIPTION = re.compile(r'<meta name="description" content="([^"]*)">')
SHARED = {name: re.compile(rf'<meta property="og:{name}" content="([^"]*)">') for name in ('title', 'description')}


def apply(text, file):
    """Return the page with one canonical address, a favicon link and one set of share tags."""
    page = PAGES[file]
    # A page may already carry its own share title or description; keep those words.
    kept = {name: pattern.search(text) for name, pattern in SHARED.items()}
    text = OWNED.sub('', text)
    title = TITLE.search(text)
    if not title:
        raise ValueError(f'{file} has no title')
    described = DESCRIPTION.search(text)
    if described:
        description = described.group(1)
    elif 'description' in page:
        description = escape(page['description'], quote=True)
        text = text.replace(title.group(0), f'<meta name="description" content="{description}">' + title.group(0), 1)
    else:
        raise ValueError(f'{file} needs a description in content/discovery.json')
    attr = lambda value: escape(value, quote=True)
    url = attr(ORIGIN + page.get('canonical', page['path']))
    share_title = kept['title'].group(1) if kept['title'] else title.group(1)
    share_description = kept['description'].group(1) if kept['description'] else description
    tags = ''.join((
        f'<link rel="canonical" href="{url}">',
        '<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">',
        f'<meta property="og:title" content="{share_title}">',
        f'<meta property="og:description" content="{share_description}">',
        '<meta property="og:type" content="website">',
        f'<meta property="og:url" content="{url}">',
        f'<meta property="og:site_name" content="{attr(SOURCE["site_name"])}">',
        f'<meta property="og:image" content="{attr(ORIGIN + SOURCE["share_image"])}">',
        '<meta property="og:image:width" content="1200">',
        '<meta property="og:image:height" content="630">',
        f'<meta property="og:image:alt" content="{attr(SOURCE["share_image_alt"])}">',
        '<meta name="twitter:card" content="summary_large_image">',
    ))
    return text.replace(title.group(0), title.group(0) + tags, 1)
