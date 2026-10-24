"""Cross-feature publication contracts; no runtime, mail or learner data."""
from html.parser import HTMLParser
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.tags = []
        self.feed(text)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))


class PublicIntegration(unittest.TestCase):
    def test_every_course_page_retains_both_workspace_and_feedback(self):
        for file in sorted((ROOT / 'public').glob('*.html')):
            with self.subTest(page=file.name):
                tags = Page(file.read_text()).tags
                launchers = [attrs for _, attrs in tags if 'data-feedback-launcher' in attrs]
                self.assertEqual(len(launchers), 1)
                scripts = [attrs.get('src') for tag, attrs in tags if tag == 'script']
                self.assertEqual(scripts.count('/assets/feedback-launcher.js'), 1)
                # Privacy/recovery are information/account pages; the learning surfaces carry My context.
                if file.stem not in {'privacy', 'recovery'}:
                    self.assertEqual(scripts.count('/assets/course-context.js'), 1)

    def test_information_notice_explains_both_saved_context_and_feedback(self):
        notice = (ROOT / 'public/privacy.html').read_text()
        self.assertIn('Save to My context', notice)
        self.assertIn('Optional voice and written feedback', notice)
        self.assertIn('90 days', notice)
        self.assertIn('does not transcribe recordings', notice)


if __name__ == '__main__':
    unittest.main()
