#!/usr/bin/env python3
"""Build public course pages from reusable Moodle HTML fragments, without services."""
from feedback_markup import feedback_page
from pathlib import Path
from course_tips import ASSETS, writing_support
from course_context import course_context
from html import escape
import json

ROOT = Path(__file__).resolve().parents[1]
TRANSFER = '''<section id="portfolio-save"><h2>Save or restore your work</h2>
<p>Context documents are readable Markdown files. The version 1 JSON backup restores all entries, including your private practice record. Keep the backup private and share only selected context.</p>
<div class="portfolio-actions"><button type="button" data-portfolio-action="context-download">Download all context documents</button><button type="button" data-portfolio-action="backup">Download backup for restoring</button></div>
<label for="portfolio-import">Restore a portfolio backup</label><input id="portfolio-import" type="file" accept=".json,application/json" data-portfolio-import>
<p class="meta">Choose a JSON backup downloaded from this builder, up to 256 KB. It is read on your device. Invalid files leave your current entries unchanged.</p>
<button type="button" data-portfolio-action="clear">Clear this portfolio</button>
<div data-portfolio-confirm hidden><p data-portfolio-confirm-text></p><button type="button" data-portfolio-action="confirm">Replace my entries</button><button type="button" data-portfolio-action="cancel">Keep my current entries</button></div>
<p data-portfolio-status role="status" aria-live="polite" aria-atomic="true"></p></section>'''
JOURNEY = '''<p class="eyebrow">Your course journey · Free public activities</p>
<h1>Build something you can use again.</h1>
<p class="intro">Start with a useful task. Learn what context helps, then build a small portfolio you can find, review and reuse in another conversation.</p>
<p>Work at your own pace. Allow roughly 70–95 minutes for the three activities and portfolio bridge, split across visits if useful. Times are guides, not deadlines. A free AI tool is enough; fictional examples let you practise without an AI account.</p>
<!-- activity-atlas -->
<!-- orientation-return-guidance --><aside class="note"><h2>Returning to your work?</h2><p>Signed-in learners can open <a href="/local/orientation/workspace.php">My context</a> to edit and copy work they deliberately saved to Moodle, including on another device. <a href="/local/orientation/index.php">Your course progress</a> keeps activity completion separate from your documents. In anonymous use, <a href="/portfolio">open the portfolio builder</a> in the same tab to resume its temporary draft, or restore your private JSON backup.</p><p>The outcome is practical: retrieve your reviewed documents, select relevant context and use it to begin a worthwhile task.</p></aside><!-- /orientation-return-guidance -->
<nav class="actions" aria-label="Start the course"><a class="button" href="/first-task">Start with a useful task</a><a class="button secondary" href="/before-you-start">Try optional preparation</a></nav>'''


def activity_atlas():
    """Real HTML is the fallback; JavaScript only selects among these same panels."""
    activities = json.loads((ROOT / 'content/course-map.json').read_text())['activities']
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
        kind = {'core': 'Core activity', 'portfolio-bridge': 'Portfolio bridge · Part of activity 2',
                'optional-preparation': 'Optional preparation'}.get(activity.get('role'), 'Optional practice')
        icon = f'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">{icons.get(slug, icons["before-you-start"])}</svg>'
        buttons.append(f'''<button type="button" class="atlas-place" data-atlas-choice="{slug}" aria-pressed="false" aria-controls="atlas-detail-{slug}"><span class="atlas-icon">{icon}</span><span><strong>{label}</strong><span class="atlas-takeaway">{escape(activity['outcomes'][0])}</span></span></button>''')
        skills = ''.join(f'<li>{escape(skill)}</li>' for skill in atlas['practise'])
        supporting = ''.join(f'<p><a href="{escape(link["url"], quote=True)}">{escape(link["label"])}</a></p>' for link in activity.get('support_links', []))
        panels.append(f'''<section class="atlas-detail" id="atlas-detail-{slug}" data-atlas-detail="{slug}" aria-labelledby="atlas-title-{slug}">
<p class="eyebrow">{kind} · {escape(atlas['duration'])}</p><h3 id="atlas-title-{slug}">{label}</h3>
<div class="atlas-detail-grid"><div><h4>You'll do</h4><p>{escape(atlas['do'])}</p></div><div><h4>You'll keep</h4><p>{escape(atlas['keep'])}</p></div></div>
<div class="atlas-practice"><h4>What you'll practise</h4><ul>{skills}</ul></div>
<details><summary>Check what I can do</summary><div class="atlas-detail-grid"><div><h4>What I understand</h4><p>{escape(atlas['knowledge_check'])}</p></div><div><h4>What I can do</h4><p>{escape(atlas['performance_check'])}</p></div></div><p class="meta">Use these questions for your own reflection. No answer or assessment is saved here.</p></details>
<a class="button" href="{escape(activity['public_url'], quote=True)}" aria-label="Open this activity: {label}">Open this activity</a>{supporting}</section>''')
    return f'''<section class="activity-atlas" data-activity-atlas aria-labelledby="atlas-heading">
<div class="atlas-heading"><p class="eyebrow">Explore your course</p><h2 id="atlas-heading">What would you like to do with AI?</h2><p>Three core activities, with portfolio practice inside the context activity and optional preparation. Bring your own task or use a fictional example. You can begin anywhere and return to any activity.</p></div>
<div class="atlas-controls" data-atlas-controls hidden><div class="atlas-map"><svg class="atlas-paths" viewBox="0 0 800 470" preserveAspectRatio="none" aria-hidden="true"><path d="M195 105 C370 100 430 110 605 105 M195 105 C100 210 320 225 195 310 M605 105 C700 210 480 225 605 310 M195 310 C360 400 440 220 605 310"/></svg><div class="atlas-places">{''.join(buttons)}</div></div><p class="atlas-suggestion">New to AI? Start with <button type="button" data-atlas-start>Try AI on a useful task</button>.</p><p class="atlas-announcement" data-atlas-announcement role="status" aria-live="polite"></p></div>
<div class="atlas-panels">{''.join(panels)}</div></section>'''


def fragment(name):
    """Use this same expansion when placing a fragment in a Moodle Page."""
    html = (ROOT / f'content/{name}.html').read_text().replace('<!-- portfolio-transfer -->', TRANSFER)
    return writing_support(html, name)


@feedback_page
def render(title, content, slug):
    description = {
        'help': 'Find course guidance and ask for help with Human AI Orientation.',
        'first-task': 'Choose a useful task, decide what success means and inspect your first AI result. Free practical activity with a fictional-example route.',
        'portfolio': 'Build and review three reusable context documents. Download your own copy and a backup for restoring your portfolio later.',
        'check-and-continue': 'Test selected context in a fresh conversation, check a result and choose a useful next goal.',
        'journey': 'Explore three practical activities and a portfolio bridge. Build, review and reuse your own personal context portfolio at your own pace.',
    }[slug]
    script = (ASSETS if 'class="finlay-writing-surface"' in content else '') + ('<script src="/assets/activity-atlas.js" defer></script>' if slug == 'journey' else '')
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{escape(description, quote=True)}"><meta property="og:title" content="{escape(title, quote=True)} — Human AI Orientation"><meta property="og:description" content="{escape(description, quote=True)}"><meta property="og:type" content="website"><meta property="og:url" content="https://orientation.finlaymccall.com/{slug}"><meta name="twitter:card" content="summary"><title>{title} — Human AI Orientation</title><link rel="stylesheet" href="/assets/site.css"><link rel="describedby" type="application/json" href="/ai/course.json"><link rel="stylesheet" href="/assets/portfolio.css"><script src="/assets/portfolio.js" defer></script>{script}</head><body><a class="skip" href="#main">Skip to content</a><header><a href="/">Human AI Orientation</a><a href="/journey">Course journey</a></header><main id="main" class="{'journey-reading' if slug == 'journey' else 'reading'}">{content}</main><footer><p>Designed and built by Finlay McCall · <a href="/privacy">About your information</a></p><p class="meta">Original course materials © 2026 Finlay McCall · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a> · <a href="/deeper-courses#course-licence">Scope and attribution</a>. Third-party materials retain their own licences.</p></footer></body></html>\n'''


def main():
    pages = {'help': 'Ask for help', 'first-task': 'Get one useful result', 'portfolio': 'Your personal context portfolio', 'check-and-continue': 'Test, improve and continue'}
    generated = ROOT / 'content/generated'
    generated.mkdir(exist_ok=True)
    atlas = activity_atlas()
    home_source = (ROOT / 'content/home.html').read_text()
    for source in (JOURNEY, home_source):
        if source.count('<!-- activity-atlas -->') != 1:
            raise ValueError('Each entry source must contain exactly one activity-atlas marker.')
    journey = JOURNEY.replace('<!-- activity-atlas -->', atlas)
    home = home_source.replace('<!-- activity-atlas -->', atlas).replace('<!-- keep-in-touch -->', (ROOT / 'content/keep-in-touch.html').read_text())
    (ROOT / 'public/index.html').write_text(course_context(home))
    (generated / 'journey.html').write_text(journey)
    for name, title in pages.items():
        content = fragment(name)
        (generated / f'{name}.html').write_text(content)
        (ROOT / f'public/{name}.html').write_text(course_context(render(title, content, name)))
    (ROOT / 'public/journey.html').write_text(course_context(render('Your course journey', journey, 'journey')))
    print('Built home, activity atlas, first-task, portfolio, check-and-continue and journey pages.')


if __name__ == '__main__':
    main()
