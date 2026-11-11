#!/usr/bin/env python3
"""Build the end-of-unit game page from content/context-game.json.

The same data gives the paper version (plain HTML, no JavaScript) and the interactive
version (public/assets/context-game.js reads the embedded JSON). Runs before
build-journey.py, which adds the shared header, account script and feedback link.
"""
from html import escape
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
GAME = json.loads((ROOT / 'content/context-game.json').read_text(encoding='utf-8'))


def reply(packed):
    """The invented reply for a set of packed cards: (sentence, reason it is a problem or None)."""
    sentences = []
    for slot in GAME['reply']:
        chosen = slot['packed'] if slot['card'] is None or slot['card'] in packed else slot['unpacked']
        if chosen:
            sentences.append((chosen['text'], chosen.get('why')))
    return sentences


def items(values, tag='ul'):
    return f'<{tag}>' + ''.join(f'<li>{value}</li>' for value in values) + f'</{tag}>'


def right(options):
    return next(option for option in options if option['correct'])


def paper():
    """The whole game as questions with answers the reader opens."""
    cards = {card['id']: card for card in GAME['cards']}
    by_kind = ''.join(
        f'<p><strong>{escape(label)}:</strong></p>' + items(escape(card['text']) for card in GAME['cards'] if card['kind'] == kind)
        for kind, label in GAME['kinds'].items())
    sample = reply(set(GAME['fallback_pack']))
    problems = [(text, why) for text, why in sample if why]
    filing = GAME['filing']
    places = filing['documents'] + [filing['leave_out']]
    place = lambda answer: places[-1] if answer == 'out' else places[answer]
    return f'''<div data-game-fallback>
<h2>Play on paper</h2>
<p>The interactive game needs JavaScript. This is the same game. Answer each question in your head or in your notes, then open the answer.</p>
<section><h3>1. Set the criterion</h3><p>{escape(GAME['criteria']['question'])}</p>
{items((escape(option['text']) for option in GAME['criteria']['options']), 'ol')}
<details><summary>Answer</summary><p>“{escape(right(GAME['criteria']['options'])['text'])}” {escape(right(GAME['criteria']['options'])['feedback'].removeprefix('Yes. '))}</p></details></section>
<section><h3>2. Choose the context</h3><p>These are {len(GAME['cards'])} of Mina’s notes. Which would you give the AI for this task?</p>
{items(escape(card['text']) for card in GAME['cards'])}
<details><summary>Answer</summary>{by_kind}</details></section>
<section><h3>3. Check the reply</h3><p>Suppose Mina gave the AI only these notes:</p>
{items(escape(cards[card]['text']) for card in GAME['fallback_pack'])}
<p>The AI replied:</p><blockquote><p>{' '.join(escape(text) for text, why in sample)}</p></blockquote>
<p>Mina’s criterion: {escape(GAME['criterion'])} Find {len(problems)} sentences she should not send as they are.</p>
<details><summary>Answer</summary>{items(f'“{escape(text)}” {escape(why)}' for text, why in problems)}</details>
<p>Morning tea is one of them. What should Mina say to the AI?</p>
{items((escape(option['text']) for option in GAME['correction']['options']), 'ol')}
<details><summary>Answer</summary><p>“{escape(right(GAME['correction']['options'])['text'])}” {escape(right(GAME['correction']['options'])['feedback'].removeprefix('Yes. '))}</p></details></section>
<section><h3>4. Keep what worked</h3><p>Mina keeps three documents: {', '.join(escape(name) for name in filing['documents'])}. Where does each note go, and which one does she leave out?</p>
{items(escape(item['text']) for item in filing['items'])}
<details><summary>Answer</summary>{items(f'“{escape(item["text"])}” <strong>{escape(place(item["answer"]))}.</strong> {escape(item["why"])}' for item in filing['items'])}</details></section>
<section><h3>What the game shows</h3>{items(f'<a href="{escape(entry["href"], quote=True)}">{escape(entry["step"])}</a>: {escape(entry["text"])}' for entry in GAME['takeaways'])}</section>
</div>'''


def page():
    data = json.dumps(GAME, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Pack the brief: a five-minute game — Human AI Orientation</title><link rel="stylesheet" href="/assets/site.css"><link rel="stylesheet" href="/assets/context-game.css"><script src="/assets/context-game.js" defer></script></head>
<body><a class="skip" href="#main">Skip to content</a><header><a href="/">Human AI Orientation</a><a href="/journey">Course journey</a></header>
<main id="main" class="reading"><p class="eyebrow">Unit 1 · Optional game · About 5 minutes</p><h1>Pack the brief.</h1>
<p class="intro">Finish Unit 1 with a short game. Help Mina get a useful notice from an AI: set a criterion, choose the context, check the reply and keep what worked.</p>
<p><strong>Why this helps:</strong> the game puts the four steps of this unit into one small task, so you can see how each choice changes the result.</p>
<p>{escape(GAME['task'])}</p>
<p class="meta">Your choices stay on this page. Nothing is saved or sent, and no AI is contacted.</p>
<div class="context-game" data-context-game>
{paper()}
<div data-game-enhanced hidden></div>
<script type="application/json" data-game-source>{data}</script>
</div>
<nav class="actions" aria-label="Next step"><a class="button" href="/check-and-continue#next-goal">Choose your next goal</a><a class="button secondary" href="/journey">Return to the course journey</a></nav>
</main><footer><p>Designed and built by Finlay McCall · <a href="/privacy">Privacy policy</a></p><p class="meta">Original course materials © 2026 Finlay McCall · <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">CC BY 4.0</a> · <a href="/deeper-courses#course-licence">Scope and attribution</a>. Third-party materials retain their own licences.</p></footer></body></html>
'''


if __name__ == '__main__':
    (ROOT / 'public/context-game.html').write_text(page(), encoding='utf-8')
    print('Built /context-game')
