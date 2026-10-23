import importlib.util
from pathlib import Path
import tempfile
import unittest
spec = importlib.util.spec_from_file_location('support', Path(__file__).resolve().parents[1] / 'scripts/support.py')
support = importlib.util.module_from_spec(spec)
spec.loader.exec_module(support)


class ApprovalBoundary(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.queue = Path(self.temp.name)
        self.id = support.create(self.queue, 'synthetic@example.test', 'Synthetic reply', 'Use the backup download to resume.', True)
        self.delivered = []

    def approve(self):
        review = support.process(self.queue, self.id, 'review')
        support.process(self.queue, self.id, 'approve', review['digest'])

    def test_unapproved_cannot_send(self):
        with self.assertRaises(ValueError): support.process(self.queue, self.id, 'send', transport=self.delivered.append)
        self.assertEqual(self.delivered, [])

    def test_approval_is_for_exact_recipient_and_text(self):
        self.approve()
        path = self.queue / f'{self.id}.json'
        for key, value in [('recipient', 'other@example.test'), ('subject', 'Changed'), ('body', 'Changed'), ('synthetic', False)]:
            original = support.json.loads(path.read_text())
            changed = dict(original, **{key: value})
            support.save(path, changed)
            with self.assertRaises(ValueError): support.process(self.queue, self.id, 'send', transport=self.delivered.append)
            support.save(path, original)
        self.assertEqual(self.delivered, [])

    def test_approved_capture_once(self):
        self.approve()
        self.assertEqual(support.process(self.queue, self.id, 'send', transport=self.delivered.append)['state'], 'captured')
        self.assertEqual(len(self.delivered), 1)
        with self.assertRaises(ValueError): support.process(self.queue, self.id, 'send', transport=self.delivered.append)

    def test_failure_cannot_automatically_resend(self):
        self.approve()
        def uncertain(_): raise RuntimeError('Timeout after delivery')
        with self.assertRaises(RuntimeError): support.process(self.queue, self.id, 'send', transport=uncertain)
        self.assertEqual(support.process(self.queue, self.id, 'review')['state'], 'delivery-uncertain')
        with self.assertRaises(ValueError): support.process(self.queue, self.id, 'send', transport=self.delivered.append)

    def test_stale_approval_and_path_rejected(self):
        with self.assertRaises(ValueError): support.process(self.queue, self.id, 'approve', 'stale')
        with self.assertRaises(ValueError): support.process(self.queue, '../secrets', 'review')

    def test_invalid_recipient_and_headers_rejected(self):
        for recipient, subject in [('a@b.test,b@c.test', 'Help'), ('a@b.test', 'Help\nBcc: x@y.test')]:
            with self.assertRaises(ValueError): support.create(self.queue, recipient, subject, 'Body', True)
