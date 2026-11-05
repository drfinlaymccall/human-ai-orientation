"""Shared public assets and ordinary-link fallback for the private Moodle workspace."""
ASSETS = '<link rel="stylesheet" href="/assets/course-context.css"><script src="/assets/course-context.js" defer></script>'


def course_context(html):
    if '/assets/course-context.js' not in html:
        if '<script' in html:
            html = html.replace('<script', ASSETS + '<script', 1)
        elif '</head>' in html:
            html = html.replace('</head>', ASSETS + '</head>', 1)
        elif '<body' in html:
            html = html.replace('<body', ASSETS + '<body', 1)
        else:
            raise ValueError('A course page needs a head or body for shared context assets.')
    if '<header>' in html and 'data-context-fallback' not in html:
        html = html.replace('</header>', '<a data-context-fallback href="/local/orientation/workspace.php">My context</a></header>', 1)
    elif '<header>' not in html and '<main>' in html and 'data-context-fallback' not in html:
        html = html.replace('<main>', '<main><nav aria-label="Course workspace"><a data-context-fallback href="/local/orientation/workspace.php">My context</a></nav>', 1)
    return html
