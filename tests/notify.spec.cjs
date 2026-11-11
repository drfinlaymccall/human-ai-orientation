// Synthetic only: the isolated fixture on port 18802 with captured mail. Every address is fictional (@example.test).
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'trial/launch-fixture');
const base = 'http://127.0.0.1:18802';
const env = { ...process.env, ORIENTATION_TRIAL_DIR: fixture };
const stamp = Date.now();
const address = name => `notify-${stamp}-${name}@example.test`;

function php(code) {
  const prelude = `define('CLI_SCRIPT',true);require ${JSON.stringify(path.join(root, 'scripts/moodle-environment.php'))};`
    + `require_once ${JSON.stringify(path.join(root, 'scripts/synthetic-fixture.php'))};`
    + `if($CFG->wwwroot!=='${base}'||!orientation_is_synthetic_fixture($orientationtrial,$CFG))throw new RuntimeException('Fixture only');`;
  return execFileSync(path.join(root, 'scripts/fixture-php'), ['-r', prelude + code], { cwd: root, env, encoding: 'utf8' }).trim();
}
const rows = email => JSON.parse(php(`echo json_encode(array_values($DB->get_records('local_orientation_notify',['email'=>${JSON.stringify(email)}])));`));
const total = () => Number(php(`echo $DB->count_records('local_orientation_notify');`));
const mailCount = () => fs.readdirSync(path.join(fixture, 'mail')).length;

test.afterAll(() => { php(`$DB->delete_records_select('local_orientation_notify', $DB->sql_like('email', '?'), ['notify-${stamp}-%']);`); });

async function signUp(page, email) {
  await page.goto('/agent-basics');
  await page.getByLabel('Your email address').fill(email);
  await page.getByRole('button', { name: 'Notify me when Unit 2 is ready' }).click();
}

test('a visitor without an account joins the list once, and no mail is sent', async ({ page, context }) => {
  const mailBefore = fs.existsSync(path.join(fixture, 'mail')) ? mailCount() : 0;
  await signUp(page, address('One').toUpperCase());
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('You are on the list');
  await expect(page.locator('main')).toContainText('Unit 2: Introduction to Agentic Systems');
  const first = rows(address('one'));
  expect(first).toHaveLength(1);
  expect(first[0].topic).toBe('unit-2');
  expect(first[0].token).toMatch(/^[A-Za-z0-9]{40}$/);
  // The endpoint keeps no session: it sets no cookie.
  expect((await context.cookies()).map(cookie => cookie.name)).not.toContain('MoodleSession');
  // Asking again gives the same answer and keeps one row.
  await signUp(page, address('one'));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('You are on the list');
  expect(rows(address('one'))).toHaveLength(1);
  expect(fs.existsSync(path.join(fixture, 'mail')) ? mailCount() : 0).toBe(mailBefore);
});

test('the form works without JavaScript; bad input and automated form-fillers store nothing', async ({ browser, request }) => {
  const plain = await browser.newContext({ javaScriptEnabled: false });
  const page = await plain.newPage();
  await signUp(page, address('nojs'));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('You are on the list');
  expect(rows(address('nojs'))).toHaveLength(1);
  await plain.close();
  const before = total();
  const post = form => request.post('/local/orientation/notify.php', { form, maxRedirects: 0 });
  let response = await post({ topic: 'unit-2', email: 'not-an-address' });
  expect(response.status()).toBe(400);
  expect(await response.text()).toContain('Please check your email address');
  response = await post({ topic: 'no-such-topic', email: address('topic') });
  expect(response.status()).toBe(400);
  response = await post({ topic: 'no-such-topic', email: address('topic'), website: 'x' });
  expect(response.status()).toBe(400);
  // An address a spreadsheet could read as a formula is refused.
  response = await post({ topic: 'unit-2', email: '=cmd' + address('formula') });
  expect(response.status()).toBe(400);
  response = await post({ topic: 'unit-2', email: address('robot'), website: 'https://example.test' });
  expect(response.status()).toBe(200);
  expect(await response.text()).toContain('You are on the list');
  expect(total()).toBe(before);
  // A plain visit to the endpoint goes back to the page with the form.
  response = await request.get('/local/orientation/notify.php', { maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers().location).toBe(base + '/agent-basics');
});

test('the removal link asks first, removes only that person, and stops working afterwards', async ({ page, request }) => {
  await signUp(page, address('stay'));
  await signUp(page, address('leave'));
  const [row] = rows(address('leave'));
  const link = '/local/orientation/notify.php?remove=' + row.token;
  // Opening the link alone, as a mail scanner would, removes nothing.
  expect((await request.get(link)).status()).toBe(200);
  expect(rows(address('leave'))).toHaveLength(1);
  await page.goto(link);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Remove your address?');
  await expect(page.locator('main')).not.toContainText(address('leave'));
  await page.getByRole('button', { name: 'Remove my address' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('You are off the list');
  expect(rows(address('leave'))).toHaveLength(0);
  expect(rows(address('stay'))).toHaveLength(1);
  await page.goto(link);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('That link is no longer in use');
  await page.goto('/local/orientation/notify.php?remove=' + 'x'.repeat(40));
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('That link is no longer in use');
});

test('the hourly limit refuses new addresses without losing existing ones', async ({ request }) => {
  const limit = Number(php(`echo \\local_orientation\\notify::HOURLY_LIMIT;`));
  php(`for($i=0;$i<${limit};$i++)$DB->insert_record('local_orientation_notify',['email'=>'notify-${stamp}-fill'.$i.'@example.test','topic'=>'unit-2','token'=>random_string(40),'timecreated'=>time()]);`);
  const before = total();
  const response = await request.post('/local/orientation/notify.php', { form: { topic: 'unit-2', email: address('late') } });
  expect(response.status()).toBe(429);
  expect(await response.text()).toContain('Nothing was saved');
  expect(total()).toBe(before);
  // Someone already listed gets the same answer, so the limit cannot be used to find out who is on the list.
  const again = await request.post('/local/orientation/notify.php', { form: { topic: 'unit-2', email: `notify-${stamp}-fill0@example.test` } });
  expect(again.status()).toBe(429);
  expect(await again.text()).toBe(await response.text());
  php(`$DB->delete_records_select('local_orientation_notify', $DB->sql_like('email', '?'), ['notify-${stamp}-fill%']);`);
});

test('only a site administrator can see or download the list', async ({ page, browser, request }) => {
  await signUp(page, address('export'));
  const anonymous = await request.get('/local/orientation/notify-list.php', { maxRedirects: 0 });
  expect(anonymous.status()).toBe(303);
  expect(anonymous.headers().location).toContain('/login/index.php');
  const staff = await browser.newContext({ acceptDownloads: true });
  const admin = await staff.newPage();
  const credentials = JSON.parse(fs.readFileSync(path.join(fixture, 'credentials.json')));
  await admin.goto('/login/index.php');
  await admin.locator('#username').fill(credentials.admin_username);
  await admin.locator('#password').fill(credentials.admin_password);
  await admin.locator('#loginbtn').click();
  await admin.goto('/local/orientation/notify-list.php');
  await expect(admin.locator('#region-main')).toContainText('Unit 2: Introduction to Agentic Systems');
  await expect(admin.locator('#region-main')).toContainText('This page does not send mail.');
  const [download] = await Promise.all([admin.waitForEvent('download'), admin.getByRole('link', { name: 'Download addresses (CSV)' }).click()]);
  const csv = fs.readFileSync(await download.path(), 'utf8');
  expect(csv.split('\n')[0]).toBe('email,topic,asked_on,removal_link');
  const [row] = rows(address('export'));
  expect(csv).toContain(`${address('export')},unit-2,`);
  expect(csv).toContain(`${base}/local/orientation/notify.php?remove=${row.token}`);
  // The download needs the administrator's own session key.
  const forged = await admin.request.get('/local/orientation/notify-list.php?download=unit-2&sesskey=wrong');
  expect(await forged.text()).not.toContain(address('export'));
  await staff.close();
});
