#!/usr/bin/env python3
"""Build only curated public AI context; never scan or export runtime/learner data."""
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://orientation.finlaymccall.com'
source = json.loads((ROOT / 'content/ai/course-context.json').read_text())
course_map = json.loads((ROOT / 'content/course-map.json').read_text())
activities = []
seen = set()
for activity in course_map['activities']:
    slug = activity['slug']
    route = activity['public_url']
    if not re.fullmatch(r'[a-z][a-z0-9-]*', slug) or slug in seen:
        raise ValueError('Activity slugs must be unique safe identifiers.')
    if not re.fullmatch(r'/[a-z][a-z0-9-]*', route):
        raise ValueError('Activity destinations must be public reading routes.')
    if activity['role'] not in {'core', 'portfolio-bridge', 'familiar-skills'}:
        raise ValueError('Unknown public activity role.')
    seen.add(slug)
    public_activity = {key: activity[key] for key in [
        'slug', 'label', 'version', 'updated_at', 'outcomes', 'role', 'baseline', 'optional']}
    public_activity['public_url'] = BASE + route
    public_activity['support_links'] = []
    for link in activity.get('support_links', []):
        if not re.fullmatch(r'/[a-z][a-z0-9-]*', link['url']):
            raise ValueError('Support destinations must be public reading routes.')
        public_activity['support_links'].append({'label': link['label'], 'url': BASE + link['url']})
    activities.append(public_activity)
if course_map['baseline_slugs'] != [item['slug'] for item in activities if item['baseline']]:
    raise ValueError('Public baseline must match the reviewed activity map.')
version = source['version']
if not re.fullmatch(r'\d{4}-\d{2}-\d{2}\.[1-9]\d*', version):
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
lines += ['', '## Course units', '', 'One course. Each unit has a syllabus and, when available, a journey.']
for unit in course_map['units']:
    lines += ['', '### ' + unit['label'], '', unit['syllabus'], 'Status: ' + unit['status']]
    lines += ['- ' + module['label'] + ': ' + module['description'] for module in unit['modules']]
    if unit['status'] == 'active':
        lines += ['Journey: ' + BASE + unit['journey_url']]
lines += ['', '## Activity map', '',
          'Choose a useful starting point. Bring an existing brief or use a fictional example; the map is not a compulsory sequence.',
          'Unit 1 includes files and notes as regular modules. Familiar-skills practice is optional, not a gate.',
          'Activity versions describe current material, not the edition a person previously practised.',
          f"Baseline version: {course_map['baseline_version']}. {course_map['progress_description']}"]
for activity in activities:
    lines += ['', f"### {activity['label']}", '', f"Public activity: {activity['public_url']}",
              f"Activity: {activity['slug']} | Version: {activity['version']} | Updated: {activity['updated_at']}",
              f"Role: {activity['role']} | Baseline practice: {str(activity['baseline']).lower()} | Optional: {str(activity['optional']).lower()}"]
    lines += ['- ' + outcome for outcome in activity['outcomes']]
    lines += [f"Supporting guide: {link['label']} — {link['url']}" for link in activity['support_links']]
lines += ['', '## Context practice steps']
for i, step in enumerate(source['steps'], 1):
    lines += ['', f"### {i}. {step['title']}", '', step['guidance']]
lines += ['', '## Fictional worked example', '']
for key, value in source['worked_example'].items():
    lines += [f"{key.replace('_', ' ').capitalize()}: {value}", '']
lines += ['## If browsing is unavailable', '', source['fallback'], '', '## Return to the course', '',
          f"Public lesson: {source['learner_lesson_url']}", f"Saved progress (human sign-in required): {source['saved_progress_url']}", '']
markdown = '\n'.join(lines)
pinned = release / 'context.md'
def write_immutable(path, value):
    try:
        with path.open('x') as stream:
            stream.write(value)
    except FileExistsError:
        if path.read_text() != value:
            raise SystemExit(f'Published {path.name} differs: increment its version instead of overwriting it.')

write_immutable(pinned, markdown)
manifest = {
    '$schema': BASE + '/ai/course.schema.v1.4.json', 'schema_version': '1.4',
    'id': source['id'], 'title': source['course'], 'context_version': version,
    'updated': source['updated'], 'status': source['status'], 'authentication_required': False,
    'context_url': context_url, 'latest_context_url': BASE + '/ai/context.md',
    'human_guide_url': BASE + '/ai/', 'learner_lesson_url': source['learner_lesson_url'],
    'saved_progress_url': source['saved_progress_url'], 'github_url': 'https://github.com/drfinlaymccall/human-ai-orientation',
    'content_license': 'https://creativecommons.org/licenses/by/4.0/',
    'license_scope_url': BASE + '/deeper-courses#course-licence',
    'github_status': 'Public source, design history and issue tracking.',
    'ai_browsing_required': False, 'fallback': source['fallback'],
    'learning_outcomes': source['learning_outcomes'], 'steps': source['steps'],
    'saved_progress_authentication_required': True,
    'progress_description': course_map['progress_description'],
    'baseline_version': course_map['baseline_version'], 'baseline_slugs': course_map['baseline_slugs'],
    'activities': activities,
    'units': course_map['units'],
    'starting_point': {
        'url': BASE + '/local/orientation/startingpoint.php', 'authentication_required': True,
        'optional': True, 'statement_count': 6, 'dimensions': ['understanding', 'can_do'],
        'rating_min': 1, 'rating_max': 5, 'unknown_options': ['Not sure', 'Skip'],
        'purpose': 'Private self-reported practice suggestions, not assessed proficiency or activity completion.',
        'availability': 'Account access follows the current pilot gate; the check can be skipped.',
    },
}
schema = {
    '$schema': 'https://json-schema.org/draft/2020-12/schema', '$id': BASE + '/ai/course.schema.v1.4.json',
    'title': 'Human AI Orientation public context manifest', 'type': 'object',
    'additionalProperties': False, 'required': list(manifest),
    'properties': {key: {'type': 'string'} for key in manifest},
}
schema['properties'].update({
    'schema_version': {'const': '1.4'}, 'authentication_required': {'const': False},
    'ai_browsing_required': {'type': 'boolean'}, 'github_url': {'type': ['string', 'null']},
    'learning_outcomes': {'type': 'array', 'minItems': 1, 'items': {'type': 'string'}},
    'saved_progress_authentication_required': {'const': True},
    'baseline_version': {'type': 'integer', 'minimum': 1},
    'baseline_slugs': {'type': 'array', 'minItems': 1, 'uniqueItems': True, 'items': {'type': 'string'}},
    'units': {'type': 'array', 'items': {'type': 'object'}},
    'activities': {'type': 'array', 'minItems': 1, 'items': {
        'type': 'object', 'additionalProperties': False,
        'required': ['slug', 'label', 'public_url', 'version', 'updated_at', 'outcomes', 'role', 'baseline', 'optional', 'support_links'],
        'properties': {
            **{key: {'type': 'string', 'minLength': 1} for key in ['slug', 'label', 'public_url', 'version', 'updated_at']},
            'role': {'enum': ['core', 'portfolio-bridge', 'familiar-skills']},
            'baseline': {'type': 'boolean'}, 'optional': {'type': 'boolean'},
            'outcomes': {'type': 'array', 'minItems': 1, 'items': {'type': 'string'}},
            'support_links': {'type': 'array', 'items': {'type': 'object', 'additionalProperties': False,
                              'required': ['label', 'url'], 'properties': {'label': {'type': 'string'}, 'url': {'type': 'string'}}}},
        },
    }},
    'starting_point': {
        'type': 'object', 'additionalProperties': False,
        'required': list(manifest['starting_point']),
        'properties': {
            'url': {'const': BASE + '/local/orientation/startingpoint.php'},
            'authentication_required': {'const': True}, 'optional': {'const': True},
            'statement_count': {'const': 6}, 'dimensions': {'const': ['understanding', 'can_do']},
            'rating_min': {'const': 1}, 'rating_max': {'const': 5},
            'unknown_options': {'const': ['Not sure', 'Skip']},
            'purpose': {'type': 'string'}, 'availability': {'type': 'string'},
        },
    },
    'steps': {'type': 'array', 'minItems': 1, 'items': {'type': 'object', 'additionalProperties': False,
              'required': ['id', 'title', 'guidance'], 'properties': {key: {'type': 'string'} for key in ['id', 'title', 'guidance']}}},
})
write_immutable(output / 'course.schema.v1.4.json', json.dumps(schema, indent=2) + '\n')
(output / 'context.md').write_text(markdown)
(output / 'course.json').write_text(json.dumps(manifest, indent=2) + '\n')
prompt = f'''I am taking Human AI Orientation and want help with one step of building and reusing my personal context portfolio.
Read this public course context if you can: {context_url}
Tell me whether you actually accessed it. If you did, give its title, version and one concrete success criterion from the worked example so I can check them. If you cannot read it, say so and ask me to paste the text.
Then ask which step I am on and whether I want an explanation, an example or practice. Help me do the thinking, one step at a time, and wait for my response. Do not sign in, submit course work or claim to know my saved progress.'''
metadata = {'@context': 'https://schema.org', '@type': 'Course', 'name': source['course'],
            'url': BASE, 'license': 'https://creativecommons.org/licenses/by/4.0/', 'description': source['purpose'], 'inLanguage': 'en',
            'author': {'@type': 'Person', 'name': source['author']},
            'coursePrerequisites': 'An everyday device and somewhere to keep notes. AI browsing is optional.',
            'hasPart': [{'@type': 'LearningResource', 'identifier': activity['slug'], 'name': activity['label'],
                         'url': activity['public_url'], 'version': activity['version'], 'dateModified': activity['updated_at'],
                         'learningResourceType': activity['role'], 'teaches': activity['outcomes']} for activity in activities]}
escape = html.escape
role_labels = {'core': 'Core practice', 'portfolio-bridge': 'Part of the context activity',
               'familiar-skills': 'Optional help'}
activity_links = ''.join(
    f'<li><a href="{escape(activity["public_url"])}">{escape(activity["label"])}</a>'
    f' — {role_labels[activity["role"]]}; version {escape(activity["version"])}</li>'
    for activity in activities)
page = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Give your AI the course context — Human AI Orientation</title><link rel="stylesheet" href="/assets/site.css"><link rel="describedby" type="application/json" href="/ai/course.json"><style>textarea{{width:100%;padding:1rem;font:inherit;line-height:1.5;resize:vertical}}pre{{white-space:pre-wrap;overflow-wrap:anywhere;font:1rem/1.6 system-ui,sans-serif;background:white;padding:1rem}}button{{font:inherit;cursor:pointer}}.reading h1{{max-width:24ch}}</style><script type="application/ld+json">{json.dumps(metadata).replace('<', chr(92) + 'u003c')}</script></head><body><header><a href="/">Human AI Orientation</a><a href="/journey">Explore the course</a></header><main class="reading"><p class="eyebrow">Your AI · Shared course context</p><h1>Give your AI a little course context.</h1><p>Your AI can help you work through the lesson. This public page explains its purpose and how to support you. You choose what to share and what to do next.</p><h2>1. Copy this into your AI chat</h2><p>Reading links varies between tools and conversations. A free text chat is enough; if a link cannot be read, use the text below.</p><label for="starter"><strong>Course starter prompt</strong></label><textarea id="starter" rows="12" readonly>{escape(prompt)}</textarea><p><button class="button" type="button" data-copy="starter">Copy starter prompt</button></p><p id="copy-status" role="status" aria-live="polite"></p><h2>2. Check what it actually read</h2><p>Compare its title, version and example detail with the context below. If it could not open the link—or its answer does not match—paste the text instead. A plausible answer alone does not prove it read the whole page.</p><h2>3. Choose your next step</h2><ul>{activity_links}</ul><p>Ask for an explanation, an example or practice. Keep your own notes and judge the result yourself. Your AI cannot see your Moodle account or save course progress for you. <a href="{escape(source["saved_progress_url"])}">Check your own course progress (sign-in required)</a>. Activity versions describe current material, not which edition you previously practised.</p><details><summary>Context text to read or paste</summary><p><strong>Version {escape(version)}</strong> · Updated {escape(source['updated'])}</p><pre id="context-text">{escape(markdown)}</pre><button class="button" type="button" data-copy="context-text">Copy context text</button></details><p><a href="{context_url}">Open the plain-text context</a> · <a href="/journey">Return to the course map</a></p><aside class="note"><h2>No browsing? You can still take part.</h2><p>{escape(source['fallback'])}</p><p>These are public course instructions. Keep your personal context portfolio in your own notes, and share only the parts you choose with your AI.</p></aside><details><summary>For tools and anyone inspecting the design</summary><p><a href="/ai/course.json">Course manifest (JSON)</a> · <a href="/ai/course.schema.v1.4.json">Manifest schema</a> · <a href="/ai/context.md">Latest context (Markdown)</a></p><p>The manifest is a format for this project. The page also includes Schema.org course metadata. These help describe the material; they do not guarantee that an AI will discover, read or follow it.</p><p>Inspect the <a href="https://github.com/drfinlaymccall/human-ai-orientation">public GitHub source and design history</a>. No GitHub account is needed to read the course or use these materials.</p></details></main><footer><a href="/privacy">About your information</a> · Designed by Finlay McCall<p class="meta">Original course materials © 2026 Finlay McCall · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a> · <a href="/deeper-courses#course-licence">Scope and attribution</a>. Third-party materials retain their own licences.</p></footer><script src="/assets/ai-context.js" defer></script></body></html>'''
(output / 'index.html').write_text(page)
print(f'Built public course context {version}; release content is immutable.')
