const { defineConfig } = require('@playwright/test');
const fs = require('node:fs');
module.exports = defineConfig({
  testDir: './tests', testMatch: ['context.spec.cjs', 'context-errors.spec.cjs'], timeout: 60000, workers: 1,
  outputDir: 'trial/context-fixture/results',
  use: {
    baseURL: 'http://127.0.0.1:18842', trace: 'off', screenshot: 'off', video: 'off', actionTimeout: 12000,
    launchOptions: { executablePath: process.env.ORIENTATION_CHROMIUM ||
      (fs.existsSync('/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome') ? '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome' : undefined) },
  },
  webServer: {
    command: 'PHP_CLI_SERVER_WORKERS=4 ORIENTATION_TRIAL_DIR="$PWD/trial/context-fixture" scripts/fixture-php -S 127.0.0.1:18842 -t trial/context-fixture/moodle scripts/serve-launch-fixture.php > trial/context-fixture/logs/server.log 2>&1',
    url: 'http://127.0.0.1:18842/login/index.php', reuseExistingServer: false, timeout: 60000,
  },
});
