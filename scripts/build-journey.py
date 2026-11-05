#!/usr/bin/env python3
"""Build public course pages from reusable Moodle HTML fragments, without services."""
from feedback_markup import feedback_page, decorate_feedback
from course_context import course_context
from pathlib import Path
from course_tips import ASSETS, writing_support
from html import escape
import json
import re
from course_structure import ordered_activities, syllabus

ROOT = Path(__file__).resolve().parents[1]
TRANSFER = '''<section id="portfolio-save"><h2>Save or restore your work</h2>
<p>Context documents are readable Markdown files. The version 1 JSON backup restores all entries, including your private practice record. Keep the backup private and share only selected context.</p>
<div class="portfolio-actions"><button type="button" data-portfolio-action="context-download">Download all context documents</button><button type="button" data-portfolio-action="backup">Download backup for restoring</button></div>
<label for="portfolio-import">Restore a portfolio backup</label><input id="portfolio-import" type="file" accept=".json,application/json" data-portfolio-import>
<p class="meta">Choose a JSON backup downloaded from this builder, up to 256 KB. It is read on your device. Invalid files leave your current entries unchanged.</p>
<button type="button" data-portfolio-action="clear">Clear this portfolio</button>
<div data-portfolio-confirm hidden><p data-portfolio-confirm-text></p><button type="button" data-portfolio-action="confirm">Replace my entries</button><button type="button" data-portfolio-action="cancel">Keep my current entries</button></div>
<p data-portfolio-status role="status" aria-live="polite" aria-atomic="true"></p></section>'''
JOURNEY = '''<p class="eyebrow">Human AI Orientation · Free public activities</p>
<h1>Unit 1: Human–AI Orientation</h1>
<p class="intro" id="course-rationale"><!-- student-rationale --></p>
<p>Work at your own pace. Allow roughly 70–95 minutes for the three activities and portfolio bridge, split across visits if useful. Times are guides, not deadlines. A free AI tool is enough; fictional examples let you practise without an AI account.</p>
<div class="actions"><a class="button" href="#atlas-heading">Choose an activity</a><a class="button secondary" href="/local/orientation/startingpoint.php">Find my starting point</a></div>
<!-- student-objectives -->
<p class="meta">The optional starting-point check asks about your understanding and what you can do. Sign in with an invited course account to save your ratings and see explained suggestions. You can choose any public activity without an account. Public registration is currently closed.</p>
<p class="account-state meta" data-account-state role="status">Check sign-in to see your account state.</p>
<!-- activity-atlas -->
<!-- orientation-return-guidance --><aside class="note"><h2>Returning to your work?</h2><p>Signed-in learners can open <a href="/local/orientation/workspace.php">My context</a> to edit and copy work they deliberately saved to Moodle, including on another device. <a href="/local/orientation/index.php">Your Unit 1 progress</a> keeps activity completion separate from your documents. In anonymous use, <a href="/portfolio">open the portfolio builder</a> in the same tab to resume its temporary draft, or restore your private JSON backup.</p><p>The outcome is practical: retrieve your reviewed documents, select relevant context and use it to begin a worthwhile task.</p></aside><!-- /orientation-return-guidance -->
<nav class="actions" aria-label="Start the course"><a class="button" href="/first-task">Start with a useful task</a><a class="button secondary" href="/before-you-start">Explore files and locations</a></nav>'''


def activity_atlas():
    """Real HTML is the fallback; JavaScript only selects among these same panels."""
    activities = ordered_activities(json.loads((ROOT / 'content/course-map.json').read_text()))
    icons = {
        'first-task': '<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z"/>',
        'useful-context': '<path d="M4 4h16v12H9l-5 4V4Z"/><path d="M8 8h8M8 12h5"/>',
        'portfolio': '<path d="M3 6h7l2 3h9v11H3Z"/><path d="M3 6V4h7l2 2h7v3"/>',
        'check-and-continue': '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6Z"/>',
        'before-you-start': '<path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5M9 12h7M9 16h5"/>',
    }
    buttons, panels = [], []
    for activity in activities:
        # Optional additions can be published before their atlas description is ready.
        if 'atlas' not in activity and activity['optional']:
            continue
        slug, label, atlas = activity['slug'], escape(activity['label']), activity['atlas']
        kind = {'core': 'Core activity', 'portfolio-bridge': 'Unit 1 module · Context practice',
                'familiar-skills': 'Unit 1 module · Optional familiar-skills practice'}.get(activity.get('role'), 'Optional practice')
        icon = f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">{icons.get(slug, icons["before-you-start"])}</svg>'
        buttons.append(f'''<div class="atlas-choice-wrap"><button type="button" class="atlas-place" data-atlas-choice="{slug}" aria-pressed="false" aria-controls="atlas-detail-{slug}"><span class="atlas-icon">{icon}</span><span><strong>{label}</strong><span class="atlas-takeaway">{escape(activity['outcomes'][0])}</span><span class="atlas-progress" data-atlas-progress="{slug}"></span></span></button></div>''')
        skills = ''.join(f'<li>{escape(skill)}</li>' for skill in atlas['practise'])
        supporting = ''.join(f'<p><a href="{escape(link["url"], quote=True)}">{escape(link["label"])}</a></p>' for link in activity.get('support_links', []))
        panels.append(f'''<section class="atlas-detail" id="atlas-detail-{slug}" data-atlas-detail="{slug}" tabindex="-1" aria-labelledby="atlas-title-{slug}">
<p class="eyebrow">{kind} · {escape(atlas['duration'])}</p><h3 id="atlas-title-{slug}">{label}</h3>
<a class="button" data-atlas-open="{slug}" href="{escape(activity['public_url'], quote=True)}" aria-label="Open this activity: {label}">Open this activity</a>
<div class="atlas-detail-grid"><div><h4>You'll do</h4><p>{escape(atlas['do'])}</p></div><div><h4>You'll keep</h4><p>{escape(atlas['keep'])}</p></div></div>
<div class="atlas-practice"><h4>What you'll practise</h4><ul>{skills}</ul></div>
<details><summary>Check what I can do</summary><div class="atlas-detail-grid"><div><h4>What I understand</h4><p>{escape(atlas['knowledge_check'])}</p></div><div><h4>What I can do</h4><p>{escape(atlas['performance_check'])}</p></div></div><p class="meta">Use these questions for your own reflection. No answer or assessment is saved here.</p></details>
{supporting}</section>''')
    return f'''<section class="activity-atlas" data-activity-atlas aria-labelledby="atlas-heading">
<div class="atlas-heading"><p class="eyebrow">Explore your course</p><h2 id="atlas-heading">What would you like to do with AI?</h2><p>Seven modules support your work. Practice for familiar skills is optional. The original three core activities still record completion. Bring your own task or use a fictional example. You can begin anywhere and return to any activity.</p></div>
<div class="atlas-layout"><div class="atlas-controls" data-atlas-controls hidden><div class="atlas-map"><svg class="atlas-paths" viewBox="0 0 800 470" preserveAspectRatio="none" aria-hidden="true"><path d="M195 105 C370 100 430 110 605 105 M195 105 C100 210 320 225 195 310 M605 105 C700 210 480 225 605 310 M195 310 C360 400 440 220 605 310"/></svg><div class="atlas-places">{''.join(buttons)}</div></div><p class="atlas-suggestion">New to AI? Start with <button type="button" data-atlas-start>Try AI on a useful task</button>.</p><p class="atlas-announcement" data-atlas-announcement role="status" aria-live="polite"></p></div>
<div class="atlas-panels">{''.join(panels)}</div></div></section>'''


def fragment(name):
    """Use this same expansion when placing a fragment in a Moodle Page."""
    html = (ROOT / f'content/{name}.html').read_text().replace('<!-- portfolio-transfer -->', TRANSFER)
    return writing_support(html, name)


def student_welcome(html, welcome):
    """Share the agreed objectives across the public entry and native overview."""
    objectives = ''.join(f'<li>{escape(objective)}</li>' for objective in welcome['objectives'])
    details = f'''<details class="note" data-course-objectives><summary>What you'll practise</summary>
<p>By the end, you will have practised how to:</p><ul>{objectives}</ul>
<p>These are practice goals, not a graded assessment. Choose any activity and return when useful. This unit is useful on its own. Unit 2 is a planned syllabus, not an available set of activities.</p></details>'''
    return html.replace('<!-- student-rationale -->', escape(welcome['rationale'])).replace('<!-- student-objectives -->', details)


def course_overview():
    """Preview the full course using the same activity names and practice as the map."""
    course_map = json.loads((ROOT / 'content/course-map.json').read_text())
    return (ROOT / 'content/course-overview.html').read_text().replace('<!-- course-catalogue -->', syllabus(course_map))


@feedback_page
def render(title, content, slug):
    description = {
        'catalogue': 'Explore the units and their syllabuses in one course.',
        'help': 'Find course guidance and ask for help with Human AI Orientation.',
        'first-task': 'Choose a useful task, decide what success means and inspect your first AI result. Free practical activity with a fictional-example route.',
        'portfolio': 'Build and review three reusable context documents. Download your own copy and a backup for restoring your portfolio later.',
        'check-and-continue': 'Test selected context in a fresh conversation, check a result and choose a useful next goal.',
        'journey': 'Explore three practical activities and a portfolio bridge. Build, review and reuse your own personal context portfolio at your own pace.',
    }[slug]
    script = (ASSETS if 'class="finlay-writing-surface"' in content else '') + ('<script src="/assets/activity-atlas.js" defer></script>' if slug == 'journey' else '')
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{escape(description, quote=True)}"><meta property="og:title" content="{escape(title, quote=True)} — Human AI Orientation"><meta property="og:description" content="{escape(description, quote=True)}"><meta property="og:type" content="website"><meta property="og:url" content="https://orientation.finlaymccall.com/{slug}"><meta name="twitter:card" content="summary"><title>{title} — Human AI Orientation</title><link rel="stylesheet" href="/assets/site.css"><link rel="describedby" type="application/json" href="/ai/course.json"><link rel="stylesheet" href="/assets/portfolio.css"><script src="/assets/portfolio.js" defer></script>{script}</head><body><a class="skip" href="#main">Skip to content</a><header><a href="/">Human AI Orientation</a><a href="/catalogue">Course catalogue</a><a href="/journey">Unit 1 journey</a></header><main id="main" class="{'journey-reading' if slug == 'journey' else 'reading'}">{content}</main><footer><p>Designed and built by Finlay McCall · <a href="/privacy">About your information</a></p><p class="meta">Original course materials © 2026 Finlay McCall · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a> · <a href="/deeper-courses#course-licence">Scope and attribution</a>. Third-party materials retain their own licences.</p></footer></body></html>\n'''


def main():
    pages = {'help': 'Ask for help', 'first-task': 'Get one useful result', 'portfolio': 'Your personal context portfolio', 'check-and-continue': 'Test, improve and continue'}
    generated = ROOT / 'content/generated'
    generated.mkdir(exist_ok=True)
    atlas = activity_atlas()
    welcome_source = (ROOT / 'content/student-welcome.json').read_bytes()
    welcome = json.loads(welcome_source)
    home_source = (ROOT / 'content/home.html').read_text()
    if JOURNEY.count('<!-- activity-atlas -->') != 1 or '<!-- activity-atlas -->' in home_source:
        raise ValueError('Only the journey source must contain one activity-atlas marker.')
    if home_source.count('<!-- student-objectives -->') != 1 or JOURNEY.count('<!-- student-objectives -->') != 1:
        raise ValueError('Home and journey sources must each contain exactly one student-objectives marker.')
    if JOURNEY.count('<!-- student-rationale -->') != 1 or '<!-- student-rationale -->' in home_source:
        raise ValueError('Only the journey source must contain exactly one student-rationale marker.')
    (ROOT / 'moodle/local/orientation/student-welcome.json').write_bytes(welcome_source)
    course_map = json.loads((ROOT / 'content/course-map.json').read_text())
    journey = student_welcome(JOURNEY.replace('<!-- activity-atlas -->', syllabus(course_map, journey=True) + atlas), welcome)
    catalogue = course_overview()
    (ROOT / 'public/catalogue.html').write_text(render('Course catalogue', catalogue, 'catalogue'))
    journey = journey.replace('</h1>', '</h1>' + (ROOT / 'content/introduction.html').read_text(), 1)
    home = student_welcome(home_source.replace('<!-- keep-in-touch -->', (ROOT / 'content/keep-in-touch.html').read_text()), welcome)
    (generated / 'activity-atlas.html').write_text(atlas + '\n')
    (ROOT / 'public/index.html').write_text(home)
    (generated / 'journey.html').write_text(journey)
    introduction = journey
    (generated / 'introduction.html').write_text(introduction)
    (ROOT / 'public/course-introduction.html').write_text(render('Unit 1 journey', journey, 'journey'))
    (generated / 'course-overview.html').write_text(course_overview())
    for name, title in pages.items():
        content = fragment(name)
        (generated / f'{name}.html').write_text(content)
        (ROOT / f'public/{name}.html').write_text(render(title, content, name))
    (ROOT / 'public/journey.html').write_text(render('Your course journey', journey, 'journey'))
    # Earlier builders own these pages' teaching content; normalise only public navigation.
    for path in (ROOT / 'public').glob('*.html'):
        html = path.read_text()
        header = '<header><a class="brand" href="/">Human AI Orientation</a><nav aria-label="Main navigation"><a href="/catalogue">Course catalogue</a><a href="/journey">Unit 1 journey</a><a data-account-link href="/local/orientation/index.php">Check sign-in / Your course journey</a></nav></header>'
        if '<header>' in html:
            html = re.sub(r'<header>.*?</header>', lambda match: header, html, count=1, flags=re.S)
        elif '<main' in html:
            html = html.replace('<main', header + '<main', 1)
        if '/assets/account-state.js' not in html:
            html = html.replace('<main', '<script src="/assets/account-state.js" defer></script><main', 1)
        if '/assets/site.css' not in html:
            html = html.replace('<main', '<link rel="stylesheet" href="/assets/site.css"><main', 1)
        path.write_text(decorate_feedback(course_context(html)))
    print('Built home, shared activity atlas, public course navigation and journey pages.')


if __name__ == '__main__':
    main()
