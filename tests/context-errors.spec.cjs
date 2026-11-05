// Synthetic-only workspace regressions: isolated Moodle database, fictional text, captured mail.
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'trial/context-fixture');
const base = 'http://127.0.0.1:18842';
const course = JSON.parse(fs.readFileSync(path.join(fixture, 'course.json')));
const username = `workspaceerrors${Date.now()}`;
const password = 'Synthetic-Workspace-74!';
const env = { ...process.env, ORIENTATION_TRIAL_DIR: fixture };
function php(code) {
  const guard = `define('CLI_SCRIPT',true); require ${JSON.stringify(path.join(root, 'scripts/moodle-environment.php'))}; if($CFG->wwwroot!=='${base}' || $orientationtrial!==realpath('${fixture}') || $CFG->dbname!=='orientation_context_fixture') throw new RuntimeException('Synthetic context fixture only'); `;
  return execFileSync(path.join(root, 'scripts/php'), ['-r', guard + code], { cwd: root, env, encoding: 'utf8' });
}
async function login(page) {
  await page.goto(base + '/local/orientation/workspace.php');
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#loginbtn').click();
  await page.waitForLoadState('networkidle');
}
async function submit(page) {
  const [response] = await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: 'Save changes', exact: true }).click(),
  ]);
  return response;
}
test.beforeAll(() => {
  php(`require_once($CFG->dirroot.'/user/lib.php');require_once($CFG->libdir.'/enrollib.php');$id=user_create_user((object)['username'=>'${username}','email'=>'${username}@example.test','password'=>'${password}','auth'=>'manual','confirmed'=>1,'firstname'=>'Synthetic','lastname'=>'Workspace errors','mnethostid'=>$CFG->mnet_localhost_id]);$instance=$DB->get_record('enrol',['courseid'=>${Number(course.course_id)},'enrol'=>'manual'],'*',MUST_EXIST);$role=$DB->get_field('role','id',['shortname'=>'student'],MUST_EXIST);enrol_get_plugin('manual')->enrol_user($instance,$id,$role);`);
});
test('saved=1 never replaces a stale POST or rejected title with a success notice without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await login(page);
  await page.goto(base + '/local/orientation/workspace.php?new=1');
  await page.getByLabel('Title', { exact: true }).fill('Synthetic redirect regression');
  await page.getByLabel('Your text', { exact: true }).fill('Original fictional note.');
  await submit(page);
  expect(new URL(page.url()).searchParams.get('saved')).toBe('1');
  const savedurl = page.url();
  const other = await context.newPage();
  await other.goto(savedurl);
  await other.getByLabel('Your text', { exact: true }).fill('A newer fictional saved note.');
  expect((await submit(other)).status()).toBe(200);
  await page.getByLabel('Your text', { exact: true }).fill('Keep my conflicting fictional draft.');
  expect((await submit(page)).status()).toBe(409);
  await expect(page.locator('.context-notice')).toContainText('These edits have not been saved');
  await expect(page.locator('.context-notice')).not.toContainText('Saved to Moodle');
  await expect(page.getByLabel('Your text', { exact: true })).toHaveValue('Keep my conflicting fictional draft.');
  await expect(page.getByLabel('Text to copy', { exact: true })).toHaveValue(/Keep my conflicting fictional draft\./);
  await page.goto(savedurl);
  await page.getByLabel('Title', { exact: true }).fill('   ');
  await page.getByLabel('Your text', { exact: true }).fill('Keep my rejected-title fictional draft.');
  expect((await submit(page)).status()).toBe(400);
  await expect(page.locator('.context-notice')).toContainText('Changes were not saved');
  await expect(page.locator('.context-notice')).not.toContainText('Saved to Moodle');
  await expect(page.getByLabel('Title', { exact: true })).toHaveValue('   ');
  await expect(page.getByLabel('Your text', { exact: true })).toHaveValue('Keep my rejected-title fictional draft.');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Markdown (.md)', exact: true }).click();
  expect(fs.readFileSync(await (await downloaded).path(), 'utf8')).toContain('Keep my rejected-title fictional draft.');
  await other.goto(savedurl);
  await expect(other.getByLabel('Your text', { exact: true })).toHaveValue('A newer fictional saved note.');
  await context.close();
});
test('a stale portfolio form cannot overwrite a recreated row with the same revision', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await login(page);
  const url = base + '/local/orientation/workspace.php?document=working';
  await page.goto(url);
  await page.getByLabel('Relevant background', { exact: true }).fill('Original fictional portfolio row.');
  expect((await submit(page)).status()).toBe(200);
  const oldid = await page.locator('[name="expecteditemid"]').inputValue();
  expect(Number(oldid)).toBeGreaterThan(0);
  expect(await page.locator('[name="revision"]').inputValue()).toBe('1');
  php(`$user=$DB->get_record('user',['username'=>'${username}'],'id',MUST_EXIST);$DB->delete_records('local_orientation_context',['userid'=>$user->id,'courseid'=>${Number(course.course_id)},'itemkey'=>'portfolio','id'=>${Number(oldid)}]);`);
  const newer = await context.newPage();
  await newer.goto(url);
  await newer.getByLabel('Relevant background', { exact: true }).fill('Replacement fictional portfolio row.');
  expect((await submit(newer)).status()).toBe(200);
  expect(await newer.locator('[name="revision"]').inputValue()).toBe('1');
  expect(await newer.locator('[name="expecteditemid"]').inputValue()).not.toBe(oldid);
  await page.getByLabel('Relevant background', { exact: true }).fill('Keep my stale fictional portfolio edits.');
  expect((await submit(page)).status()).toBe(409);
  await expect(page.getByLabel('Relevant background', { exact: true })).toHaveValue('Keep my stale fictional portfolio edits.');
  expect(await page.locator('[name="expecteditemid"]').inputValue()).toBe(oldid);
  await newer.goto(url);
  await expect(newer.getByLabel('Relevant background', { exact: true })).toHaveValue('Replacement fictional portfolio row.');
  await context.close();
});
for (const javaScriptEnabled of [false, true]) test('real Moodle write failures keep recovery exports current ' + (javaScriptEnabled ? 'with JavaScript' : 'without JavaScript'), async ({ browser }) => {
  test.setTimeout(120000);
  const configfile = path.join(fixture, 'moodle/config.php');
  const original = fs.readFileSync(configfile);
  const role = 'contextfailure' + Date.now();
  const context = await browser.newContext({ javaScriptEnabled });
  if (javaScriptEnabled) await context.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async text => { window.__contextCopied = text; } } });
  });
  const page = await context.newPage();
  // A non-login role is granted only this fixture's tables, with context UPDATE denied.
  // The private fixture config selects it only for the tested workspace save POST.
  php(`$DB->execute('CREATE ROLE ${role} NOLOGIN');$DB->execute('GRANT USAGE ON SCHEMA public TO ${role}');$DB->execute('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${role}');$DB->execute('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ${role}');$DB->execute('REVOKE UPDATE ON {local_orientation_context} FROM ${role}');`);
  try {
    await login(page);
    // Practice is saved first so every later context export can detect a private-field leak.
    for (const document of ['note', 'practice', 'working', 'projects', 'knowledge']) {
      const note = document === 'note';
      const fieldSelector = note ? '[name="body"]' : '[data-context-field]';
      await page.goto(base + '/local/orientation/workspace.php?' + (note ? 'new=1' : 'document=' + document));
      if (note) await page.getByLabel('Title', { exact: true }).fill('Synthetic storage failure');
      const fields = page.locator(fieldSelector);
      const count = await fields.count();
      for (let index = 0; index < count; index++) await fields.nth(index).fill('Saved fictional baseline ' + document + ' ' + index);
      expect((await submit(page)).status()).toBe(200);
      const savedurl = page.url();
      const draft = 'KEEP-UNSAVED-' + document;
      for (let index = 0; index < count; index++) await page.locator(fieldSelector).nth(index).fill(draft + ' ' + index);
      fs.writeFileSync(configfile, Buffer.concat([original, Buffer.from(`\nif (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) === '/local/orientation/workspace.php' && ($_POST['action'] ?? '') === 'save') { $DB->execute('SET ROLE ${role}'); }\n`)]));
      try {
        expect((await submit(page)).status()).toBe(500);
        await expect(page.locator('.context-notice')).toContainText('Changes were not saved');
        await expect(page.locator(fieldSelector).first()).toHaveValue(draft + ' 0');
        await expect(page.getByLabel('Text to copy', { exact: true })).toHaveValue(new RegExp(draft));
        if (javaScriptEnabled) {
          for (let index = 0; index < count; index++) {
            await expect(page.locator(fieldSelector).nth(index)).toBeEditable();
            await page.locator(fieldSelector).nth(index).fill('Later fictional edits ' + document + ' ' + index + ' — café');
          }
          if (note) {
            await page.getByLabel('Title', { exact: true }).fill('Later fictional recovery title');
            await expect(page.locator('select[name="source"]')).toBeEnabled();
            await expect(page.locator('[data-context-recovery-source]')).toBeDisabled();
          }
          await expect(page.getByLabel('Text to copy', { exact: true })).toHaveValue(/Later fictional edits/);
          // Export also rereads values immediately: programmatic edits emit no input event.
          await page.locator(fieldSelector).first().evaluate(input => { input.value += '\nLATEST-BEFORE-COPY'; });
          await page.getByRole('button', { name: 'Copy', exact: true }).click();
        } else {
          for (let index = 0; index < count; index++) await expect(page.locator(fieldSelector).nth(index)).not.toBeEditable();
          await expect(page.getByText('Without JavaScript, the recovered text stays read-only', { exact: false })).toBeVisible();
          if (note) {
            await expect(page.getByLabel('Title', { exact: true })).not.toBeEditable();
            await expect(page.locator('select[name="source"]')).toBeDisabled();
            await expect(page.locator('[data-context-recovery-source]')).toHaveValue('first-task');
          }
        }
        const currentMarkdown = async () => {
          if (note) return '# ' + await page.getByLabel('Title', { exact: true }).inputValue() + '\n\n' + await page.getByLabel('Your text', { exact: true }).inputValue() + '\n';
          const values = await page.locator('[data-context-field]').evaluateAll(inputs => Object.fromEntries(inputs.map(input => [input.name.slice('field_'.length), input.value])));
          const encoded = Buffer.from(JSON.stringify(values)).toString('base64');
          // The server formatter is authoritative; it receives only this document's current fields.
          return php(`$snapshot=\\local_orientation\\context_store::blank();$snapshot['fields']=array_replace($snapshot['fields'],json_decode(base64_decode('${encoded}'),true));echo \\local_orientation\\context_store::markdown($snapshot,'${document}');`);
        };
        const copied = await currentMarkdown();
        expect(await page.getByLabel('Text to copy', { exact: true }).inputValue()).toBe(copied);
        if (javaScriptEnabled) {
          expect(await page.evaluate(() => window.__contextCopied)).toBe(copied);
          await page.locator(fieldSelector).first().evaluate(input => { input.value += '\nLATEST-BEFORE-DOWNLOAD'; });
        }
        const download = page.waitForEvent('download');
        await page.getByRole('link', { name: 'Download Markdown (.md)', exact: true }).click();
        const downloaded = fs.readFileSync(await (await download).path(), 'utf8');
        expect(downloaded).toBe(await currentMarkdown());
        if (document !== 'practice') {
          expect(downloaded).not.toContain('Saved fictional baseline practice');
          expect(downloaded).not.toContain('## Task and criterion');
        }
        if (!javaScriptEnabled && note) {
          // A retry still has the required source even though its selector is disabled.
          expect((await submit(page)).status()).toBe(500);
          await expect(page.getByLabel('Your text', { exact: true })).toHaveValue(draft + ' 0');
        }
      } finally { fs.writeFileSync(configfile, original); }
      await page.goto(savedurl);
      for (let index = 0; index < count; index++) await expect(page.locator(fieldSelector).nth(index)).toHaveValue('Saved fictional baseline ' + document + ' ' + index);
    }
  } finally {
    fs.writeFileSync(configfile, original);
    await context.close();
    php(`$DB->execute('DROP OWNED BY ${role}');$DB->execute('DROP ROLE ${role}');`);
  }
});
