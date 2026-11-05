const { defineConfig } = require('@playwright/test');
const onboarding = require('./playwright.onboarding.config.cjs');
if ((process.env.ORIENTATION_FIXTURE_URL || 'http://127.0.0.1:18802') !== 'http://127.0.0.1:18802') {
  throw new Error('The independent 18802 captured-mail fixture is required.');
}
module.exports = defineConfig({
  ...onboarding, testMatch: 'welcome.spec.cjs',
  outputDir: 'trial/launch-fixture/test-results/welcome',
  reporter: [['list'], ['json', { outputFile: 'trial/launch-fixture/welcome-report.json' }]],
});
