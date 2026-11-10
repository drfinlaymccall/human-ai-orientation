// Bare `npm test` targets the live site and would write synthetic data there.
// It runs only when an operator opts in deliberately.
if (process.env.ORIENTATION_ALLOW_LIVE_TEST !== '1') {
  console.error('Refused: bare `npm test` targets the live site. Use `npm run check:public` for public pages, or the fixture suites (port 18802) for native and account tests.');
  process.exit(1);
}
