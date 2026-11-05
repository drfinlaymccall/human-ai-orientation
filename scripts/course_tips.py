"""Render the same optional writing support for public pages and native Moodle."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
ASSETS = '<link rel="stylesheet" href="/assets/finlay-tips.css"><script src="/assets/finlay-tips.js" defer></script>'


def writing_support(html, key, *, native_essay=False):
    if not re.fullmatch(r'[a-z][a-z0-9-]*', key):
        raise ValueError('Writing support needs a safe, unique author key.')
    if not native_essay and not re.search(r'<textarea\b(?![^>]*\breadonly\b)[^>]*>', html):
        return html
    extra = ''
    # Keep earlier prompting-tool guidance, but make it optional beside the task.
    match = re.search(r'<blockquote class="finlay-tip" id="prompting-tip">.*?</blockquote>', html, re.S)
    if match:
        html = html[:match.start()] + html[match.end():]
        extra = '<details><summary>More ways to improve a prompt</summary>' + match.group() + '</details>'
    voice = re.search(r'<blockquote class="finlay-tip" id="portfolio-voice-tip">.*?</blockquote>', html, re.S)
    if voice:
        html = html[:voice.start()] + html[voice.end():]
        extra += '<details><summary>More voice-input options</summary>' + voice.group() + '</details>'
    panel = (ROOT / 'content/finlay-tips.html').read_text().replace('__ID__', 'finlay-' + key).replace('__EXTRA__', extra)
    native = ' data-finlay-native-essay' if native_essay else ''
    return f'<div class="finlay-writing-surface"{native}><div class="finlay-writing-layout"><div class="finlay-writing-content">{html}</div>{panel}</div></div>'
