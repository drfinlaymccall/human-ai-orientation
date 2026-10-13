#!/usr/bin/env python3
"""Keep Moodle lesson source and public preview aligned with the shared widget."""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec_path = ROOT / 'content/useful-context.json'
spec = json.loads(spec_path.read_text())
preview = ROOT / 'public/preview.html'
text = preview.read_text()
for index, name in [(2, 'context-brief-widget'), (3, 'context-try-widget')]:
    widget = (ROOT / f'content/{name}.html').read_text().strip()
    widget = widget.replace('<!-- computer-controls -->', (ROOT / 'content/computer-controls.html').read_text())
    spec['pages'][index]['html'] = widget
    start = text.index(f'<section id="page-{index}">')
    end = text.index(f'<section id="page-{index + 1}">', start)
    text = text[:start] + f'<section id="page-{index}"><h2>{spec["pages"][index]["title"]}</h2>' + widget + '</section>\n' + text[end:]
if '/assets/context-try.js' not in text:
    text = text.replace('<script src="/assets/context-brief.js" defer></script>', '<script src="/assets/context-brief.js" defer></script><script src="/assets/context-try.js" defer></script>')
spec_path.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + '\n')
preview.write_text(text)
print('Updated brief and try/check widgets in lesson source and public preview.')
