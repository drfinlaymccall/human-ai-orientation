#!/usr/bin/env python3
"""Keep Moodle lesson source and public preview aligned with the shared widget."""
import json
from feedback_markup import decorate_feedback
from pathlib import Path
from course_tips import ASSETS, writing_support
from course_context import course_context

ROOT = Path(__file__).resolve().parents[1]
spec_path = ROOT / 'content/useful-context.json'
spec = json.loads(spec_path.read_text())
preview = ROOT / 'public/preview.html'
text = preview.read_text()
for index, name in [(2, 'context-brief-widget'), (3, 'context-try-widget')]:
    widget = (ROOT / f'content/{name}.html').read_text().strip()
    widget = widget.replace('<!-- computer-controls -->', (ROOT / 'content/computer-controls.html').read_text())
    widget = writing_support(widget, 'brief' if index == 2 else 'try')
    spec['pages'][index]['html'] = widget
    start = text.index(f'<section id="page-{index}">')
    end = text.index(f'<section id="page-{index + 1}">', start)
    text = text[:start] + f'<section id="page-{index}"><h2>{spec["pages"][index]["title"]}</h2>' + widget + '</section>\n' + text[end:]
# The native essay answer is rendered by Moodle outside the authored question HTML.
# Give it the same help without replacing its editor, submission or saved answer.
reflection = spec['pages'][6]['html'].split('<!-- finlay-reflection-tips -->')[0]
spec['pages'][6]['html'] = reflection + '<!-- finlay-reflection-tips -->' + writing_support('', 'reflection', native_essay=True)
start = text.index('<section id="page-6">')
end = text.index('</section>', start) + len('</section>')
# The reading preview has no answer editor to support.
public_reflection = reflection.replace(
    'This reflection is stored in your course account and is visible to authorised course staff. It is not graded by AI. Use fictional details for this private platform trial.',
    'In this reading version, your reflection stays in your own notes. In the signed-in trial, submitted reflections are saved to your account and visible to Finlay. They are not graded by AI.',
).replace(
    'Submit your answer to save it, then continue to the end to record completion.',
    'Save your answer in your own notes. If you use the signed-in version, submit it and continue to the end to record completion.',
)
text = text[:start] + '<section id="page-6"><h2>' + spec['pages'][6]['title'] + '</h2>' + public_reflection + '</section>' + text[end:]
if '/assets/finlay-tips.css' not in text:
    text = text.replace('<link rel="stylesheet" href="/assets/context-brief.css">', ASSETS + '<link rel="stylesheet" href="/assets/context-brief.css">')
if '<body class="finlay-preview">' not in text:
    text = text.replace('<main>', '<body class="finlay-preview"><main>', 1)
if '/assets/context-try.js' not in text:
    text = text.replace('<script src="/assets/context-brief.js" defer></script>', '<script src="/assets/context-brief.js" defer></script><script src="/assets/context-try.js" defer></script>')
spec_path.write_text(json.dumps(spec, ensure_ascii=False, indent=2) + '\n')
text = text.replace('This reading version does not save progress or submit answers. The brief builder keeps a temporary draft in this browser tab; copy work you want to keep into your own notes.', 'This reading version does not mark activities complete or submit lesson reflections. Typing keeps a temporary tab draft. When signed in, choose Save to My context to keep your brief or private try/check record in Moodle; otherwise copy useful work into your notes.')
# The older preview omits optional head/body tags. Make them explicit so shared
# page additions have the same insertion points as the other public renderers.
if '</head>' not in text:
    text = text.replace('<html lang="en">', '<html lang="en"><head>', 1)
    if '<body' in text:
        text = text.replace('<body', '</head><body', 1)
    else:
        text = text.replace('<main>', '</head><body><main>', 1)
if '</body>' not in text:
    text = text.replace('</html>', '</body></html>', 1)
preview.write_text(decorate_feedback(course_context(text)))
print('Updated brief and try/check widgets in lesson source and public preview.')
