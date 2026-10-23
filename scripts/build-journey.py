#!/usr/bin/env python3
"""Build public course pages from reusable Moodle HTML fragments, without services."""
from pathlib import Path
from html import escape

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
<ol class="journey-activities"><li><h2>Choose and try</h2><p><a href="/first-task">Get one useful result</a> · 10–15 minutes. Keep a task, a checkable criterion and your first attempt.</p></li>
<li><h2>Give useful context</h2><p><a href="/preview">Choose the details that help</a> · 25–30 minutes. Try a better brief, notice what changed and keep a reusable instruction.</p>
<aside class="note"><h3>Portfolio bridge · Part of activity 2</h3><p><a href="/portfolio">Make three small context documents</a> · 20–30 minutes. Write them yourself or use an AI interview, review the text and download your own copy.</p></aside></li>
<li><h2>Check and continue</h2><p><a href="/check-and-continue">Test your portfolio in a fresh conversation</a> · 15–20 minutes. Check a result, improve an instruction and choose a next goal.</p></li></ol>
<aside class="note" id="optional-preparation"><h2>Optional preparation</h2><p><a href="/before-you-start">Find your way around files, notes and your AI</a> · 20–30 minutes, in addition to the core journey. Practise saving and retrieving a file if you need it, or go straight to activity 1.</p></aside>
<aside class="note"><h2>Returning to your work?</h2><p><a href="/portfolio">Open the portfolio builder</a> in the same tab to resume its temporary draft, or restore your downloaded JSON backup. Public activities do not save progress to an account. <a href="/course/view.php?id=2">Existing pilot learners can sign in</a> for Moodle activity progress; your private portfolio remains separate.</p><p>The outcome is practical: retrieve your reviewed documents, select relevant context and use it to begin a worthwhile task.</p></aside>
<nav class="actions" aria-label="Start the course"><a class="button" href="/first-task">Start with a useful task</a><a class="button secondary" href="/before-you-start">Try optional preparation</a></nav>'''


def fragment(name):
    """Use this same expansion when placing a fragment in a Moodle Page."""
    return (ROOT / f'content/{name}.html').read_text().replace('<!-- portfolio-transfer -->', TRANSFER)


def render(title, content, slug):
    description = {
        'help': 'Find course guidance and ask for help with Human AI Orientation.',
        'first-task': 'Choose a useful task, decide what success means and inspect your first AI result. Free practical activity with a fictional-example route.',
        'portfolio': 'Build and review three reusable context documents. Download your own copy and a backup for restoring your portfolio later.',
        'check-and-continue': 'Test selected context in a fresh conversation, check a result and choose a useful next goal.',
        'journey': 'Explore three practical activities and a portfolio bridge. Build, review and reuse your own personal context portfolio at your own pace.',
    }[slug]
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="{escape(description, quote=True)}"><meta property="og:title" content="{escape(title, quote=True)} — Human AI Orientation"><meta property="og:description" content="{escape(description, quote=True)}"><meta property="og:type" content="website"><meta property="og:url" content="https://orientation.finlaymccall.com/{slug}"><meta name="twitter:card" content="summary"><title>{title} — Human AI Orientation</title><link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/portfolio.css"><script src="/assets/portfolio.js" defer></script></head><body><a class="skip" href="#main">Skip to content</a><header><a href="/">Human AI Orientation</a><a href="/journey">Course journey</a></header><main id="main" class="reading">{content}</main><footer><p>Designed and built by Finlay McCall · <a href="/privacy">About your information</a></p><p class="meta">Original course materials © 2026 Finlay McCall · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a> · <a href="/deeper-courses#course-licence">Scope and attribution</a>. Third-party materials retain their own licences.</p></footer></body></html>\n'''


def main():
    pages = {'help': 'Ask for help', 'first-task': 'Get one useful result', 'portfolio': 'Your personal context portfolio', 'check-and-continue': 'Test, improve and continue'}
    generated = ROOT / 'content/generated'
    generated.mkdir(exist_ok=True)
    (generated / 'journey.html').write_text(JOURNEY)
    for name, title in pages.items():
        content = fragment(name)
        (generated / f'{name}.html').write_text(content)
        (ROOT / f'public/{name}.html').write_text(render(title, content, name))
    (ROOT / 'public/journey.html').write_text(render('Your course journey', JOURNEY, 'journey'))
    print('Built first-task, portfolio, check-and-continue and journey pages.')


if __name__ == '__main__':
    main()
