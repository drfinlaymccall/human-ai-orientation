"""Public metadata contracts: safe routes, stable releases and one reviewed activity map."""
import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
BASE = 'https://orientation.finlaymccall.com'


class PublicContextTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        (self.root / 'scripts').mkdir()
        (self.root / 'content/ai').mkdir(parents=True)
        shutil.copy(ROOT / 'scripts/build-ai-context.py', self.root / 'scripts')
        shutil.copy(ROOT / 'content/course-map.json', self.root / 'content')
        shutil.copy(ROOT / 'content/ai/course-context.json', self.root / 'content/ai')
        shutil.copytree(ROOT / 'public/ai', self.root / 'public/ai')

    def build(self):
        return subprocess.run([sys.executable, str(self.root / 'scripts/build-ai-context.py')],
                              capture_output=True, text=True, check=False)

    def read(self, path):
        return json.loads((self.root / path).read_text())

    def write(self, path, value):
        (self.root / path).write_text(json.dumps(value))

    def test_manifest_and_readable_map_use_reviewed_activity_identities(self):
        before = {path.relative_to(self.root): path.read_bytes()
                  for path in (self.root / 'public/ai').rglob('*') if path.is_file()}
        result = self.build()
        self.assertEqual(result.returncode, 0, result.stderr)
        manifest = self.read('public/ai/course.json')
        course_map = self.read('content/course-map.json')
        self.assertEqual(manifest['baseline_slugs'], course_map['baseline_slugs'])
        self.assertEqual(manifest['baseline_version'], course_map['baseline_version'])
        self.assertFalse(manifest['authentication_required'])
        self.assertTrue(manifest['saved_progress_authentication_required'])
        self.assertEqual(manifest['saved_progress_url'], BASE + '/local/orientation/index.php')
        self.assertEqual(len(manifest['activities']), len(course_map['activities']))
        context = (self.root / 'public/ai/context.md').read_text()
        for source, published in zip(course_map['activities'], manifest['activities']):
            for key in ['slug', 'label', 'version', 'updated_at', 'outcomes', 'role', 'baseline', 'optional']:
                self.assertEqual(published[key], source[key])
            self.assertEqual(published['public_url'], BASE + source['public_url'])
            self.assertIn(source['label'], context)
            self.assertIn(published['public_url'], context)
        for path, value in before.items():
            self.assertEqual((self.root / path).read_bytes(), value, f'Rebuild changed {path}')

    def test_changed_activity_cannot_rewrite_published_context(self):
        course_map = self.read('content/course-map.json')
        course_map['activities'][0]['label'] += ' revised'
        self.write('content/course-map.json', course_map)
        before = (self.root / 'public/ai/context.md').read_bytes()
        result = self.build()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('increment its version', result.stderr)
        self.assertEqual((self.root / 'public/ai/context.md').read_bytes(), before)

    def test_new_context_release_preserves_previous_releases_and_schemas(self):
        source = self.read('content/ai/course-context.json')
        before = {path.relative_to(self.root): path.read_bytes()
                  for path in (self.root / 'public/ai/releases').rglob('context.md')}
        for path in (self.root / 'public/ai').glob('course.schema*.json'):
            before[path.relative_to(self.root)] = path.read_bytes()
        source['version'] = '2099-01-01.1'
        source['purpose'] = 'Synthetic future-edition regression check.'
        self.write('content/ai/course-context.json', source)
        result = self.build()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue((self.root / 'public/ai/releases/2099-01-01.1/context.md').exists())
        for path, value in before.items():
            self.assertEqual((self.root / path).read_bytes(), value, path)

    def test_version_cannot_escape_release_directory(self):
        source = self.read('content/ai/course-context.json')
        source['version'] = '..'
        self.write('content/ai/course-context.json', source)
        result = self.build()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('safe date/revision', result.stderr)

    def test_unreviewed_external_route_and_duplicate_slug_are_rejected(self):
        original = self.read('content/course-map.json')
        for field, value in [('public_url', '//outside.example/path'), ('slug', original['activities'][1]['slug'])]:
            course_map = json.loads(json.dumps(original))
            course_map['activities'][0][field] = value
            self.write('content/course-map.json', course_map)
            result = self.build()
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('ValueError', result.stderr)

    def test_current_release_and_schema_have_exact_origin_and_edge_routes(self):
        manifest = self.read('public/ai/course.json')
        release = manifest['context_url'].removeprefix(BASE)
        schema = manifest['$schema'].removeprefix(BASE)
        caddy = (ROOT / 'deploy/Caddyfile').read_text()
        private_exception = next(line for line in caddy.splitlines() if 'not path /ai/context.md' in line).split()[2:]
        public_matcher = next(line for line in caddy.splitlines() if '@aiPublic path' in line).split()[2:]
        self.assertIn(release, private_exception)
        self.assertIn(release, public_matcher)
        self.assertIn(schema, public_matcher)
        self.assertNotIn('*', ' '.join(private_exception + public_matcher))
        rule = json.loads((ROOT / 'deploy/cloudflare-ai-context-rule.json').read_text())
        self.assertEqual(rule['action_parameters']['products'], ['bic'])
        self.assertIn('http.request.method in {"GET" "HEAD"}', rule['expression'])
        self.assertIn(f'"{release}"', rule['expression'])
        self.assertIn(f'"{schema}"', rule['expression'])
        self.assertNotIn('/local/orientation', rule['expression'])
        self.assertNotIn('/login', rule['expression'])


if __name__ == '__main__':
    unittest.main()
