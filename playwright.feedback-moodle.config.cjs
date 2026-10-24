const { defineConfig } = require('@playwright/test');
const fs = require('node:fs');
const manifest = JSON.parse(fs.readFileSync(process.env.FEEDBACK_FIXTURES || 'trial/feedback-fixtures.json', 'utf8'));
if (!manifest.synthetic || !['127.0.0.1', 'localhost'].includes(new URL(manifest.wwwroot).hostname)) {
  throw new Error('Feedback browser checks require the isolated localhost synthetic Moodle fixture.');
}
module.exports = defineConfig({
  testDir: './tests', testMatch: ['feedback-moodle.spec.cjs', 'feedback-retry-moodle.spec.cjs'], timeout: 60000,
  workers: 1, retries: 0, outputDir: '/tmp/orientation-feedback-moodle-results',
  use: {
    baseURL: manifest.wwwroot, permissions: ['microphone'], actionTimeout: 15000,
    launchOptions: {
      executablePath: process.env.ORIENTATION_CHROMIUM || (fs.existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined),
      args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
    },
    screenshot: 'only-on-failure',
  },
  reporter: 'list',
});
