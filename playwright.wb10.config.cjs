const { defineConfig } = require('@playwright/test');
const onboarding = require('./playwright.onboarding.config.cjs');
if ((process.env.ORIENTATION_FIXTURE_URL || 'http://127.0.0.1:18802') !== 'http://127.0.0.1:18802') {
  throw new Error('The independent 18802 captured-mail fixture is required.');
}
module.exports = defineConfig({
  // This rehearsal includes all three activities and multiple fresh browsers;
  // keep the normal per-action deadlines while allowing the complete route.
  ...onboarding, testMatch: 'wb10-learner-journey.spec.cjs', timeout: 480000,
  outputDir: 'trial/launch-fixture/test-results/wb10',
  reporter: [['list'], ['json', { outputFile: 'trial/launch-fixture/wb10-report.json' }]],
});
