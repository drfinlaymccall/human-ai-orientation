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
                text = file.read_text()
                self.assertNotIn('This course does not record your microphone.', text)
                tags = Page(text).tags
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
        self.assertIn('Optional feedback: your text or voice recording', notice)
        self.assertIn('90 days', notice)
        self.assertIn('does not transcribe recordings', notice)

    def test_signup_form_states_collection_before_the_policy_agreement(self):
        lib = (ROOT / 'moodle/local/orientation/lib.php').read_text()
        lang = (ROOT / 'moodle/local/orientation/lang/en/local_orientation.php').read_text()
        self.assertIn('function local_orientation_extend_signup_form($mform)', lib)
        self.assertIn('data-signup-collection-notice', lib)
        notice = lang.split("$string['signupcollectionnotice'] = ", 1)[1].split('\n', 1)[0]
        for required in ('Finlay McCall', 'Australia', 'username, name and email', 'pseudonym', '18 or over', '/journey', '/privacy'):
            self.assertIn(required, notice)

    def test_privacy_policy_covers_the_australian_collection_notice(self):
        policy = (ROOT / 'public/privacy.html').read_text()
        for required in ('Privacy policy', 'Office of the Australian Information Commissioner', 'overseas', '30 days', 'Cloudflare', '<!--email_off-->'):
            self.assertIn(required, policy)
        self.assertNotIn('[email protected]', policy)


if __name__ == '__main__':
    unittest.main()
