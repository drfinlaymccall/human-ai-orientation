#!/usr/bin/env python3
"""Build only curated public AI context; never scan or export runtime/learner data."""
import html
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://orientation.finlaymccall.com'
source = json.loads((ROOT / 'content/ai/course-context.json').read_text())
version = source['version']
if not version or any(c not in '0123456789.-' for c in version):
    raise ValueError('Version must be a safe date/revision identifier.')
output = ROOT / 'public/ai'
release = output / 'releases' / version
release.mkdir(parents=True, exist_ok=True)
context_url = f'{BASE}/ai/releases/{version}/context.md'
lines = [f"# {source['title']}", '', f"Course: {source['course']}", f"Version: {version}",
         f"Updated: {source['updated']}", f"Author: {source['author']}", f"Status: {source['status']}",
         f'Canonical context: {context_url}', '', source['purpose'], '', source['audience']]
for title, key in [('Learning outcomes', 'learning_outcomes'), ('Guidance for the learner’s AI', 'ai_guidance')]:
    lines += ['', '## ' + title, ''] + ['- ' + value for value in source[key]]
lines += ['', '## Lesson steps']
for i, step in enumerate(source['steps'], 1):
    lines += ['', f"### {i}. {step['title']}", '', step['guidance']]
lines += ['', '## Fictional worked example', '']
for key, value in source['worked_example'].items():
    lines += [f"{key.replace('_', ' ').capitalize()}: {value}", '']
lines += ['## If browsing is unavailable', '', source['fallback'], '', '## Return to the course', '',
          f"Public lesson: {source['learner_lesson_url']}", f"Saved progress (human sign-in required): {source['saved_progress_url']}", '']
markdown = '\n'.join(lines)
pinned = release / 'context.md'
try:
    with pinned.open('x') as stream:
        stream.write(markdown)
except FileExistsError:
    if pinned.read_text() != markdown:
        raise SystemExit('Published release differs: increment the source version instead of overwriting it.')
(output / 'context.md').write_text(markdown)
manifest = {
    '$schema': BASE + '/ai/course.schema.json', 'schema_version': '1.0',
    'id': source['id'], 'title': source['course'], 'context_version': version,
    'updated': source['updated'], 'status': source['status'], 'authentication_required': False,
    'context_url': context_url, 'latest_context_url': BASE + '/ai/context.md',
    'human_guide_url': BASE + '/ai/', 'learner_lesson_url': source['learner_lesson_url'],
    'saved_progress_url': source['saved_progress_url'], 'github_url': None,
    'github_status': 'Planned; no public repository has been published yet.',
    'ai_browsing_required': False, 'fallback': source['fallback'],
    'learning_outcomes': source['learning_outcomes'], 'steps': source['steps'],
}
(output / 'course.json').write_text(json.dumps(manifest, indent=2) + '\n')
schema = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema', '$id': BASE + '/ai/course.schema.json',
    'title': 'Human AI Orientation public context manifest', 'type': 'object',
    'additionalProperties': False, 'required': list(manifest),
    'properties': {key: {'type': 'string'} for key in manifest},
}
schema['properties'].update({
    'schema_version': {'const': '1.0'}, 'authentication_required': {'const': False},
    'ai_browsing_required': {'type': 'boolean'}, 'github_url': {'type': ['string', 'null']},
    'learning_outcomes': {'type': 'array', 'minItems': 1, 'items': {'type': 'string'}},
    'steps': {'type': 'array', 'minItems': 1, 'items': {'type': 'object', 'additionalProperties': False,
              'required': ['id', 'title', 'guidance'], 'properties': {key: {'type': 'string'} for key in ['id', 'title', 'guidance']}}},
})
(output / 'course.schema.json').write_text(json.dumps(schema, indent=2) + '\n')
prompt = f'''I am taking Human AI Orientation and want help with one step of “Give your AI useful context”.
Read this public course context if you can: {context_url}
Tell me whether you actually accessed it. If you did, give its title, version and one concrete success criterion from the worked example so I can check them. If you cannot read it, say so and ask me to paste the text.
Then ask which step I am on and whether I want an explanation, an example or practice. Help me do the thinking, one step at a time, and wait for my response. Do not sign in, submit course work or claim to know my saved progress.'''
metadata = {'@context': 'https://schema.org', '@type': 'Course', 'name': source['course'],
            'url': BASE, 'description': source['purpose'], 'inLanguage': 'en',
            'author': {'@type': 'Person', 'name': source['author']},
            'coursePrerequisites': 'An everyday device and somewhere to keep notes. AI browsing is optional.',
            'hasPart': {'@type': 'LearningResource', 'name': source['title'], 'url': source['learner_lesson_url'],
                        'learningResourceType': 'Guided practical lesson', 'teaches': source['learning_outcomes']}}
escape = html.escape
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Give your AI the course context — Human AI Orientation</title><link rel="stylesheet" href="/assets/site.css"><style>textarea{{width:100%;padding:1rem;font:inherit;line-height:1.5;resize:vertical}}pre{{white-space:pre-wrap;overflow-wrap:anywhere;font:1rem/1.6 system-ui,sans-serif;background:white;padding:1rem}}button{{font:inherit;cursor:pointer}}.reading h1{{max-width:24ch}}</style><script type="application/ld+json">{json.dumps(metadata).replace('<', chr(92) + 'u003c')}</script></head><body><header><a href="/">Human AI Orientation</a><a href="/preview">Read the lesson</a></header><main class="reading"><p class="eyebrow">Your AI · Shared course context</p><h1>Give your AI a little course context.</h1><p>Your AI can help you work through the lesson. This public page explains its purpose and how to support you. You choose what to share and what to do next.</p><h2>1. Copy this into your AI chat</h2><p>Reading links varies between tools and conversations. A free text chat is enough; if a link cannot be read, use the text below.</p><label for="starter"><strong>Course starter prompt</strong></label><textarea id="starter" rows="12" readonly>{escape(prompt)}</textarea><p><button class="button" type="button" data-copy="starter">Copy starter prompt</button></p><p id="copy-status" role="status" aria-live="polite"></p><h2>2. Check what it actually read</h2><p>Compare its title, version and example detail with the context below. If it could not open the link—or its answer does not match—paste the text instead. A plausible answer alone does not prove it read the whole page.</p><h2>3. Choose your next step</h2><p>Ask for an explanation, an example or practice. Keep your own notes and judge the result yourself. Your AI cannot see your Moodle account or save course progress for you.</p><details><summary>Context text to read or paste</summary><p><strong>Version {escape(version)}</strong> · Updated {escape(source['updated'])}</p><pre id="context-text">{escape(markdown)}</pre><button class="button" type="button" data-copy="context-text">Copy context text</button></details><p><a href="{context_url}">Open the plain-text context</a> · <a href="/preview">Continue with the lesson</a></p><aside class="note"><h2>No browsing? You can still take part.</h2><p>{escape(source['fallback'])}</p><p>These are public course instructions. Keep your personal context portfolio in your own notes, and share only the parts you choose with your AI.</p></aside><details><summary>For tools and anyone inspecting the design</summary><p><a href="/ai/course.json">Course manifest (JSON)</a> · <a href="/ai/course.schema.json">Manifest schema</a> · <a href="/ai/context.md">Latest context (Markdown)</a></p><p>The manifest is a format for this project. The page also includes Schema.org course metadata. These help describe the material; they do not guarantee that an AI will discover, read or follow it.</p><p>A public GitHub repository is planned for the course source and its history. Until it is published, the links above are the working public source. No GitHub account is needed to use them.</p></details></main><footer><a href="/privacy">About your information</a> · Designed by Finlay McCall</footer><script src="/assets/ai-context.js" defer></script></body></html>'''
(output / 'index.html').write_text(page)
print(f'Built public course context {version}; release content is immutable.')
