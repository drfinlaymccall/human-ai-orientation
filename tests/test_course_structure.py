"""Source and generated-artifact regressions. No runtime or learner data access."""
import copy
import json
from pathlib import Path
import subprocess
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
from course_structure import validate_structure, ordered_activities


class CourseStructureTests(unittest.TestCase):
    def setUp(self):
        self.course = json.loads((ROOT / 'content/course-map.json').read_text())

    def test_unique_membership_and_order(self):
        validate_structure(self.course)
        self.assertEqual([a['slug'] for a in ordered_activities(self.course)], [
            'desktop-workspace', 'before-you-start', 'notes', 'first-task',
            'useful-context', 'portfolio', 'check-and-continue'])
        self.assertEqual(self.course['units'][0]['modules'][1]['native_group_slug'], 'computer-use')

    def test_reject_duplicate_missing_and_planned_membership(self):
        for change in ('duplicate', 'missing', 'planned', 'baseline'):
            with self.subTest(change=change):
                course = copy.deepcopy(self.course)
                if change == 'duplicate':
                    course['units'][0]['modules'][0]['activities'].append('notes')
                elif change == 'missing':
                    course['units'][0]['modules'].pop()
                elif change == 'planned':
                    course['units'][1]['journey_url'] = '/not-ready'
                else:
                    course['activities'][0]['baseline'] = False
                with self.assertRaises(AssertionError):
                    validate_structure(course)

    def test_stable_identity_urls_and_baseline(self):
        original = json.loads(subprocess.check_output(
            ['git', 'show', '67d02e4:content/course-map.json'], cwd=ROOT))
        current = {a['slug']: a for a in self.course['activities']}
        for old in original['activities']:
            for key in ('slug', 'idnumber', 'module_type', 'public_url', 'baseline', 'optional'):
                self.assertEqual(old[key], current[old['slug']][key])
        self.assertEqual(original['baseline_slugs'], self.course['baseline_slugs'])
        self.assertEqual(original['baseline_version'], self.course['baseline_version'])

    def test_generated_catalogue_journey_and_nojs(self):
        catalogue = (ROOT / 'public/catalogue.html').read_text()
        journey = (ROOT / 'public/journey.html').read_text()
        for unit in self.course['units']:
            self.assertIn(unit['label'], catalogue)
            for module in unit['modules']:
                self.assertIn(module['label'], catalogue)
        planned = catalogue.split('data-unit="agentic-systems"')[1].split('</section>')[0]
        self.assertIn('Planned — not yet available', planned)
        self.assertNotIn('<a ', planned)
        for activity in self.course['activities']:
            self.assertIn('data-atlas-detail="' + activity['slug'] + '"', journey)
            self.assertIn('href="' + activity['public_url'] + '"', journey)
        self.assertIn('Unit 1: Human–AI Orientation', journey)
        self.assertIn('fictional examples', journey)
        self.assertIn('Why this unit?', journey)
        self.assertEqual((ROOT / 'public/course-introduction.html').read_text(), journey.replace(
            '<title>Your course journey', '<title>Unit 1 journey').replace(
            'content="Your course journey —', 'content="Unit 1 journey —'))

    def test_input_guidance_has_one_home(self):
        files = (ROOT / 'content/generated/before-you-start.html').read_text()
        desktop = (ROOT / 'content/generated/desktop-workspace.html').read_text()
        self.assertNotIn('<h2 id="meet-your-ai"', files)
        self.assertIn('id="meet-your-ai"', desktop)
        self.assertIn('/desktop-workspace#meet-your-ai', files)
        self.assertIn('my-practice-note.md', files)

    def test_public_metadata_uses_same_units(self):
        public = json.loads((ROOT / 'public/ai/course.json').read_text())
        self.assertEqual(public['units'], self.course['units'])
        self.assertEqual(public['baseline_slugs'], self.course['baseline_slugs'])


if __name__ == '__main__':
    unittest.main()
