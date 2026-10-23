"""Shared, idempotent feedback entry point for full public HTML pages."""
from functools import wraps

STYLE = '<link rel="stylesheet" href="/assets/feedback-launcher.css">'
SCRIPT = '<script src="/assets/feedback-launcher.js" defer></script>'
LINK = '<a class="of-trigger" data-feedback-launcher href="/local/orientationfeedback/index.php">Give feedback</a>'


def decorate_feedback(html):
    if '</head>' not in html or '</body>' not in html:
        return html
    if '/assets/feedback-launcher.css' not in html:
        html = html.replace('</head>', STYLE + SCRIPT + '</head>', 1)
    if 'data-feedback-launcher' not in html:
        html = html.replace('</body>', LINK + '</body>', 1)
    return html


def feedback_page(render):
    @wraps(render)
    def wrapped(*args, **kwargs):
        return decorate_feedback(render(*args, **kwargs))
    return wrapped
