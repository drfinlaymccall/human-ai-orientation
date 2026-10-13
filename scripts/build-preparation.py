#!/usr/bin/env python3
"""Render the same preparation content used by the Moodle page resources."""
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parents[1]
for slug, source, title in [
    ('before-you-start', 'computer-basics', 'Find your way around files and folders'),
    ('notes', 'notes-guide', 'A home for your notes with Obsidian'),
    ('deeper-courses', 'deeper-courses', 'Go deeper: courses and videos'),
]:
    body = (ROOT / 'content' / f'{source}.html').read_text()
    body = body.replace('<!-- computer-controls -->', (ROOT / 'content/computer-controls.html').read_text())
    body = body.replace('<!-- ai-interface -->', (ROOT / 'content/ai-interface.html').read_text())
    body = body.replace('<!-- free-tools-table -->', (ROOT / 'content/free-tools-table.html').read_text())
    body = body.replace('<!-- course-licence -->', (ROOT / 'content/licence-notice.html').read_text())
    page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)} — Human AI Orientation</title><link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/ai-interface.css"><script src="/assets/ai-interface.js" defer></script></head>
<body><a class="skip" href="#main">Skip to content</a><header><a href="/">Human AI Orientation</a><a href="/preview">Go to the AI lesson</a></header>
<main id="main" class="reading"><p class="eyebrow">{'Optional next steps' if slug == 'deeper-courses' else 'Before the AI lesson'} · At your own pace</p><h1>{escape(title)}</h1>
{body}
<div class="actions"><a class="button" href="/preview">Continue to the AI lesson</a><a class="button secondary" href="/{'notes' if slug == 'before-you-start' else 'before-you-start'}">{'Set up my notes' if slug == 'before-you-start' else 'Practise finding files'}</a></div>
</main><footer><p>Designed and built by Finlay McCall · <a href="/privacy">About your information</a> · <a href="/deeper-courses">Go deeper: courses and videos</a></p><p class="meta">Original course materials © 2026 Finlay McCall · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a> · <a href="/deeper-courses#course-licence">Scope and attribution</a>. Third-party materials retain their own licences.</p></footer></body></html>'''
    (ROOT / 'public' / f'{slug}.html').write_text(page)
    print(f'Built /{slug}')

# Keep the comparison in the standalone guide aligned with the preparation activity.
path = ROOT / 'public/free-tools.html'
text = path.read_text()
start = text.index('<!-- input-comparison:start -->') + len('<!-- input-comparison:start -->')
end = text.index('<!-- input-comparison:end -->', start)
text = text[:start] + '\n' + (ROOT / 'content/free-tools-table.html').read_text() + '\n      ' + text[end:]
path.write_text(text)
print('Updated /free-tools comparison')
