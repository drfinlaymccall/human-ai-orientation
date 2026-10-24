"""A release must not overwrite an installation's unintegrated schema/privacy support."""
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]


class DeploymentBoundaryTests(unittest.TestCase):
    def installation(self, directory):
        trial = Path(directory)
        plugin = trial / 'moodle/local/orientation'
        (plugin / 'classes/privacy').mkdir(parents=True)
        (trial / 'moodle/config.php').write_text('<?php // Synthetic filesystem fixture, never executed.\n')
        (plugin / 'classes/privacy/provider.php').write_text('Existing private-storage provider.\n')
        return trial, plugin

    def deploy(self, trial):
        return subprocess.run([sys.executable, str(ROOT / 'scripts/deploy-orientation.py'),
                               '--trial-dir', str(trial)], capture_output=True, text=True)

    def test_unrepresented_schema_refuses_before_overwriting_privacy_support(self):
        for filename in ['install.xml', 'upgrade.php']:
            with self.subTest(filename=filename), tempfile.TemporaryDirectory() as directory:
                trial, plugin = self.installation(directory)
                (plugin / 'db').mkdir()
                (plugin / 'db' / filename).write_text('Synthetic existing schema marker.\n')
                before = (plugin / 'classes/privacy/provider.php').read_bytes()
                result = self.deploy(trial)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn('Integrate the installed plugin schema', result.stderr)
                self.assertEqual((plugin / 'classes/privacy/provider.php').read_bytes(), before)

    def test_newer_installed_release_refuses_before_copying(self):
        with tempfile.TemporaryDirectory() as directory:
            trial, plugin = self.installation(directory)
            (plugin / 'version.php').write_text('<?php $plugin->version = 9999999999;\n')
            result = self.deploy(trial)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn('newer plugin version', result.stderr)
            self.assertEqual((plugin / 'classes/privacy/provider.php').read_text(),
                             'Existing private-storage provider.\n')

    def test_explicit_clean_runtime_receives_repository_assets(self):
        with tempfile.TemporaryDirectory() as directory:
            trial, plugin = self.installation(directory)
            result = self.deploy(trial)
            self.assertEqual(result.returncode, 0, result.stderr)
            self.assertEqual((plugin / 'starting-point.json').read_bytes(),
                             (ROOT / 'content/starting-point.json').read_bytes())
            self.assertEqual((plugin / 'activity-atlas.js').read_bytes(),
                             (ROOT / 'public/assets/activity-atlas.js').read_bytes())


if __name__ == '__main__':
    unittest.main()
