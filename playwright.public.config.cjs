const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: './tests', testMatch: 'public.spec.cjs', timeout: 120000, workers: 1, retries: 0,
  use: {
    baseURL: 'https://orientation.finlaymccall.com', actionTimeout: 15000,
    launchOptions: {
      executablePath: process.env.ORIENTATION_CHROMIUM || '/home/finlay/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome',
      // Optional propagation check: still uses Cloudflare and validates real TLS.
      // Supply only an address verified from public DNS for this hostname.
      args: process.env.ORIENTATION_EDGE_IP ? [`--host-resolver-rules=MAP orientation.finlaymccall.com ${process.env.ORIENTATION_EDGE_IP}`] : [],
    },
    screenshot: 'only-on-failure',
  },
  reporter: [['list'], ['json', { outputFile: 'trial/public-test-report.json' }]],
});
