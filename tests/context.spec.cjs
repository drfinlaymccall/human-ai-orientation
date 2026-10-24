// Synthetic context storage only: separate native database, captured mail, no live credentials.
const { test, expect } = require('@playwright/test');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'trial/context-fixture');
const base = 'http://127.0.0.1:18842';
const env = { ...process.env, ORIENTATION_TRIAL_DIR: fixture };
const course = JSON.parse(fs.readFileSync(path.join(fixture, 'course.json')));
const password = 'Synthetic-Context-74!';
const stamp = Date.now();
const users = ['one', 'two', 'unenrolled'].map(name => `context${name}${stamp}`);
function php(code) {
  return execFileSync(path.join(root, 'scripts/php'), ['-r', `define('CLI_SCRIPT',true); require ${JSON.stringify(path.join(root, 'scripts/moodle-environment.php'))}; if($CFG->wwwroot!=='${base}' || $orientationtrial!==realpath('${fixture}')) throw new RuntimeException('Fixture only'); ` + code], { cwd: root, env, encoding: 'utf8' });
}
async function login(page, username = users[0]) {
  await page.goto('/local/orientation/workspace.php');
  // Let Moodle's anonymous template requests finish before it rotates the login cookie.
  await page.waitForLoadState('networkidle');
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#loginbtn').click();
  await page.waitForLoadState('networkidle');
  await expect(page.locator('.context-workspace h1')).toHaveText('My context');
}
const api = '/local/orientation/context.php';
let browserErrors = [];
test.beforeEach(async ({ page }) => { browserErrors = []; page.on('pageerror', error => browserErrors.push(error.message)); });
test.afterEach(() => { expect(browserErrors).toEqual([]); });
let evidence;
function retainedEvidence() {
  return php(`$out=[];foreach(['lesson_attempts','lesson_grades','lesson_branch','lesson_timer','lesson_answers','course_modules_completion','course_completions','course_completion_criteria'] as $t)$out[$t]=hash('sha256',serialize($DB->get_records($t,null,'id')));$out['ids']=$DB->get_records_menu('course_modules',['course'=>${Number(course.course_id)}],'id','id,idnumber');echo json_encode($out);`);
}
test.beforeAll(() => {
  php(`require_once($CFG->dirroot.'/user/lib.php'); require_once($CFG->libdir.'/enrollib.php'); $p=enrol_get_plugin('manual'); $i=$DB->get_record('enrol',['courseid'=>${Number(course.course_id)},'enrol'=>'manual'],'*',MUST_EXIST); $r=$DB->get_field('role','id',['shortname'=>'student'],MUST_EXIST); foreach(json_decode('${JSON.stringify(users)}') as $n=>$name){$id=user_create_user((object)['username'=>$name,'email'=>$name.'@example.test','password'=>'${password}','auth'=>'manual','confirmed'=>1,'firstname'=>'Synthetic','lastname'=>'Context','mnethostid'=>$CFG->mnet_localhost_id]);if($n<2)$p->enrol_user($i,$id,$r);}`);
  evidence = retainedEvidence();
});
test.afterAll(() => { expect(retainedEvidence()).toBe(evidence); });
async function state(page) { const response = await page.request.get(api); expect(response.ok()).toBeTruthy(); return response.json(); }
async function post(page, data) {
  const current = await state(page);
  const expecteditemid = data.op === 'save-portfolio' ? current.portfolio.id : Number(current.items.find(item => item.itemkey === data.key)?.id || 0);
  return page.request.post(api, { data: { sesskey: current.sesskey, expecteduserid: current.userid, expecteditemid, ...data } });
}
test('saved portfolio returns in a fresh browser and large Copy excludes private practice', async ({ page, browser }) => {
  await login(page);
  await page.goto('/portfolio');
  await page.locator('[data-portfolio-field="about"]').fill('Synthetic context for a fictional book swap.');
  await page.getByRole('button', { name: 'Save to My context', exact: true }).click();
  await expect(page.locator('[data-context-save-status]')).toContainText('Saved to Moodle');
  const first = await state(page);
  expect(first.progress.unavailable).toBe(false);
  expect(first.progress.next.url).toContain('/mod/page/view.php');
  expect(first.portfolio.snapshot.fields.about).toContain('fictional book swap');
  const snapshot = { ...first.portfolio.snapshot, fields: { ...first.portfolio.snapshot.fields, result: 'PRIVATE-PRACTICE' } };
  expect((await post(page, { op: 'save-portfolio', revision: first.portfolio.revision, snapshot })).ok()).toBeTruthy();
  const fresh = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const returning = await fresh.newPage();
  await login(returning);
  await returning.goto('/local/orientation/workspace.php?document=working');
  await expect(returning.getByLabel('Relevant background', { exact: true })).toHaveValue('Synthetic context for a fictional book swap.');
  await returning.getByRole('button', { name: 'Copy', exact: true }).focus();
  await returning.keyboard.press('Enter');
  const copied = await returning.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain('fictional book swap');
  expect(copied).not.toContain('PRIVATE-PRACTICE');
  const downloaded = returning.waitForEvent('download');
  await returning.getByRole('button', { name: 'Download Markdown (.md)', exact: true }).click();
  const file = await downloaded;
  expect(file.suggestedFilename()).toBe('orientation-working.md');
  expect(fs.readFileSync(await file.path(), 'utf8')).toBe(copied);
  await returning.goto('/portfolio');
  await expect(returning.locator('[data-portfolio-field="about"]')).toHaveValue('Synthetic context for a fictional book swap.');
  await fresh.close();
});
test('owner checks, CSRF, malformed input and stale revisions protect saved work', async ({ page, browser }) => {
  await login(page);
  const saved = await post(page, { op: 'save-note', key: 'brief', revision: 0, title: 'Synthetic context', body: '<script>window.injected=1</script>Keep this', source: 'useful-context' });
  expect(saved.ok()).toBeTruthy();
  const item = (await saved.json()).item;
  const other = await browser.newContext(); const p2 = await other.newPage(); await login(p2, users[1]);
  expect((await p2.request.get(api + '?item=' + item.id)).status()).toBe(404);
  expect((await post(p2, { op: 'delete', id: item.id, revision: item.revision })).status()).toBe(404);
  const badcsrf = await page.request.post(api, { data: { op: 'delete', id: item.id, revision: item.revision, sesskey: 'wrong' } });
  expect(badcsrf.status()).toBe(403);
  expect((await post(page, { op: 'save-note', key: 'brief', revision: 0, title: 'Overwrite', body: 'stale', source: 'useful-context' })).status()).toBe(409);
  expect((await post(page, { op: 'save-note', key: 'brief', revision: item.revision, title: 'Too much', body: 'x'.repeat(20001), source: 'useful-context' })).status()).toBe(400);
  const invalid = (await state(page)).portfolio;
  expect((await post(page, { op: 'save-portfolio', revision: invalid.revision, snapshot: { format: 'wrong' } })).status()).toBe(400);
  await page.goto('/local/orientation/workspace.php?item=' + item.id);
  expect(await page.evaluate(() => window.injected)).toBeUndefined();
  await expect(page.getByLabel('Your text', { exact: true })).toHaveValue('<script>window.injected=1</script>Keep this');
  expect((await page.request.get(api + '?item=' + item.id)).headers()['cache-control']).toContain('no-store');
  await other.close();
});
test('failed save keeps the draft, concurrent tabs conflict, and import remains deliberate', async ({ page, browser }) => {
  await login(page);
  if (!(await state(page)).portfolio.snapshot) {
    const snapshot = JSON.parse(php('echo json_encode(\\local_orientation\\context_store::blank());'));
    expect((await post(page, { op: 'save-portfolio', revision: 0, snapshot })).ok()).toBeTruthy();
  }
  await page.goto('/portfolio');
  await page.locator('[data-portfolio-field="preferences"]').fill('Keep my unsaved words.');
  await page.route('**/local/orientation/context.php', route => route.request().method() === 'POST' ? route.fulfill({ status: 503, body: '{}' }) : route.continue());
  await page.getByRole('button', { name: 'Save to My context', exact: true }).click();
  await expect(page.locator('[data-context-save-status]')).toContainText('not saved');
  await expect(page.locator('[data-portfolio-field="preferences"]')).toHaveValue('Keep my unsaved words.');
  await page.unroute('**/local/orientation/context.php');
  const fresh = await browser.newContext(); const p2 = await fresh.newPage(); await login(p2);
  const baseline = await state(p2);
  expect((await post(p2, { op: 'save-portfolio', revision: baseline.portfolio.revision, snapshot: { ...baseline.portfolio.snapshot, fields: { ...baseline.portfolio.snapshot.fields, preferences: 'Newer saved edit.' } } })).ok()).toBeTruthy();
  await page.getByRole('button', { name: 'Save to My context', exact: true }).click();
  await expect(page.locator('[data-context-save-status]')).toContainText('newer');
  await expect(page.locator('[data-portfolio-field="preferences"]')).toHaveValue('Keep my unsaved words.');
  const imported = { ...baseline.portfolio.snapshot, fields: { ...baseline.portfolio.snapshot.fields, about: 'Imported draft, not a server save.' } };
  await page.getByLabel('Restore a portfolio backup').setInputFiles({ name: 'synthetic.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) });
  await page.getByRole('button', { name: 'Keep my current entries', exact: true }).click();
  await expect(page.locator('[data-portfolio-field="preferences"]')).toHaveValue('Keep my unsaved words.');
  await page.getByLabel('Restore a portfolio backup').setInputFiles({ name: 'synthetic.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) });
  await page.getByRole('button', { name: 'Replace my entries', exact: true }).click();
  await expect(page.locator('[data-portfolio-field="about"]')).toHaveValue(imported.fields.about);
  expect((await state(page)).portfolio.snapshot.fields.about).not.toBe(imported.fields.about);
  await fresh.close();
});
test('workspace saves without JavaScript; mobile panels fit and saved notes can be removed', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 850 } });
  const page = await context.newPage(); await login(page);
  await page.getByRole('link', { name: 'New context note', exact: true }).first().click();
  await page.getByLabel('Title', { exact: true }).fill('Synthetic first task');
  await page.getByLabel('Your text', { exact: true }).fill('A short fictional invitation, with [date] and [venue].');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.locator('#region-main')).toContainText('Saved to Moodle');
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
  await page.getByText('Remove saved text', { exact: true }).click();
  await page.getByRole('button', { name: 'Delete saved note', exact: true }).click();
  await page.getByRole('button', { name: 'Confirm deletion', exact: true }).click();
  await expect(page.locator('#region-main')).toContainText('Saved note deleted');
  await context.close();
});
test('enrolment and session expiry remove personal presentation', async ({ page, browser }) => {
  await login(page); await page.goto('/first-task');
  await expect(page.locator('[data-context-panel]')).toContainText('My context');
  await page.request.get('/login/logout.php?sesskey=' + (await state(page)).sesskey);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.locator('[data-context-panel]')).toContainText('Sign in');
  expect(await page.locator('[data-context-panel]').innerText()).not.toContain('Synthetic context');
  const other = await browser.newContext(); const p2 = await other.newPage();
  await p2.goto('/login/index.php'); await p2.locator('#username').fill(users[2]); await p2.locator('#password').fill(password); await p2.locator('#loginbtn').click();
  expect((await p2.request.get(api)).status()).toBe(403);
  await other.close();
});
test('private storage refuses anonymous access without leaking content', async ({ request }) => {
  const response = await request.get(api);
  expect(response.status()).toBe(401);
  expect(response.headers()['cache-control']).toContain('no-store');
  expect(response.headers()['set-cookie']).toBeUndefined();
  expect(await response.text()).not.toContain('Synthetic context');
});
test('course panels and Copy layout fit desktop and mobile widths', async ({ page }, testInfo) => {
  await login(page);
  for (const width of [1920, 1440, 390]) {
    await page.setViewportSize({ width, height: 950 });
    await page.goto('/local/orientation/workspace.php?document=working');
    const copy = page.getByRole('button', { name: 'Copy', exact: true });
    await expect(copy).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    const button = await copy.boundingBox();
    const output = await page.locator('[data-context-copy-text]').boundingBox();
    expect(button.width).toBeGreaterThan(output.width * .9);
    await page.screenshot({ path: testInfo.outputPath(`my-context-synthetic-${width}.png`), fullPage: true });
    await page.goto('/portfolio');
    await expect(page.getByRole('button', { name: 'Save to My context', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)).toBe(false);
    if (width >= 1480) {
      const panel = await page.locator('[data-context-panel]').boundingBox();
      const content = await page.locator('.portfolio-widget').boundingBox();
      expect(panel.x).toBeGreaterThanOrEqual(content.x + content.width);
    }
  }
});
test('switching accounts clears brief/practice text and prevents saving it into the new account', async ({ page, context }) => {
  await login(page);
  await page.goto('/preview');
  await page.locator('.context-brief [data-field="task"]').fill('ACCOUNT-A-PRIVATE-BRIEF');
  const output = page.locator('.context-brief [data-output="brief"]');
  await expect(output).toHaveValue(/ACCOUNT-A-PRIVATE-BRIEF/);
  const first = await state(page);
  const switcher = await context.newPage();
  await switcher.goto('/login/logout.php?sesskey=' + first.sesskey);
  await login(switcher, users[1]);
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(output).toHaveValue('');
  await expect(page.locator('.context-brief').getByRole('button', { name: 'Save to My context', exact: true })).toBeDisabled();
  expect((await state(switcher)).items.some(item => item.title === 'My context brief')).toBe(false);
  await switcher.close();
});
test('Moodle privacy exports only the owner and deletes their data without removing others', () => {
  const result = JSON.parse(php(`
    require_once($CFG->dirroot.'/user/lib.php');
    $id=user_create_user((object)['username'=>'contextprivacy${stamp}','email'=>'contextprivacy${stamp}@example.test','password'=>'${password}','auth'=>'manual','confirmed'=>1,'firstname'=>'Synthetic','lastname'=>'Privacy','mnethostid'=>$CFG->mnet_localhost_id]);
    $user=$DB->get_record('user',['id'=>$id],'*',MUST_EXIST); \\core\\session\\manager::set_user($user);
    $ctx=\\context_course::instance(${Number(course.course_id)});
    $row=\\local_orientation\\context_store::save(${Number(course.course_id)},'note_'.bin2hex(random_bytes(12)),0,'Synthetic privacy export','OWNER-ONLY-EXPORT-MARKER','first-task');
    $contexts=\\local_orientation\\privacy\\provider::get_contexts_for_userid($id)->get_contextids();
    $approved=new \\core_privacy\\local\\request\\approved_contextlist($user,'local_orientation',[$ctx->id]);
    \\local_orientation\\privacy\\provider::export_user_data($approved);
    $archive=\\core_privacy\\local\\request\\writer::with_context($ctx)->finalise_content();
    $zip=new ZipArchive(); if($zip->open($archive)!==true)throw new RuntimeException('Export archive missing');
    $contents='';for($i=0;$i<$zip->numFiles;$i++)$contents.=$zip->getFromIndex($i);$zip->close();
    $out=['context'=>in_array($ctx->id,$contexts),'export'=>str_contains($contents,'OWNER-ONLY-EXPORT-MARKER'),'isolated'=>!str_contains($contents,'PRIVATE-PRACTICE')];
    $others=$DB->count_records_select('local_orientation_context','userid <> :id',['id'=>$id]);
    \\local_orientation\\privacy\\provider::delete_data_for_user($approved);
    $out['deleted']=!$DB->record_exists('local_orientation_context',['userid'=>$id]);
    $out['others']=$others===$DB->count_records_select('local_orientation_context','userid <> :id',['id'=>$id]);
    \\local_orientation\\context_store::save(${Number(course.course_id)},'note_'.bin2hex(random_bytes(12)),0,'Synthetic bulk deletion','owner text','first-task');
    \\local_orientation\\privacy\\provider::delete_data_for_users(new \\core_privacy\\local\\request\\approved_userlist($ctx,'local_orientation',[$id]));
    $out['bulk']=!$DB->record_exists('local_orientation_context',['userid'=>$id]);
    \\local_orientation\\context_store::save(${Number(course.course_id)},'note_'.bin2hex(random_bytes(12)),0,'Synthetic account deletion','owner text','first-task');
    \\core\\session\\manager::set_user(get_admin());delete_user($user);
    $out['accountdeleted']=!$DB->record_exists('local_orientation_context',['userid'=>$id]);
    echo json_encode($out);
  `));
  expect(result).toEqual({ context: true, export: true, isolated: true, deleted: true, others: true, bulk: true, accountdeleted: true });
});
test('a deleted and recreated brief rejects the previous item generation', async ({ page }) => {
  await login(page);
  const before = (await state(page)).items.find(item => item.itemkey === 'trial');
  if (before) expect((await post(page, { op: 'delete', id: Number(before.id), revision: Number(before.revision) })).ok()).toBeTruthy();
  const old = await (await post(page, { op: 'save-note', key: 'trial', revision: 0, title: 'Synthetic old record', body: 'Old draft', source: 'useful-context' })).json();
  expect((await post(page, { op: 'delete', id: old.item.id, revision: old.item.revision })).ok()).toBeTruthy();
  const replacement = await (await post(page, { op: 'save-note', key: 'trial', revision: 0, title: 'Synthetic replacement', body: 'Keep the replacement', source: 'useful-context' })).json();
  const stale = await post(page, { op: 'save-note', key: 'trial', expecteditemid: old.item.id, revision: old.item.revision, title: 'Stale text', body: 'Do not overwrite', source: 'useful-context' });
  expect(stale.status()).toBe(409);
  expect((await (await page.request.get(api + '?item=' + replacement.item.id)).json()).item.body).toBe('Keep the replacement');
  const current = await state(page);
  expect((await post(page, { op: 'save-note', key: 'brief', expecteduserid: current.userid + 100000, revision: 0, title: 'Wrong owner', body: 'Do not save', source: 'useful-context' })).status()).toBe(403);
});

test('failed saved-version reads keep drafts and successful loads establish a clean baseline', async ({ page }) => {
  await login(page);
  await page.goto('/portfolio');
  const draft = page.locator('[data-portfolio-field="about"]');
  await draft.fill('Keep this unsaved fictional context.');
  await page.route('**/local/orientation/context.php', route => route.request().method() === 'GET' ? route.fulfill({status:503,body:'{}'}) : route.continue());
  await page.getByRole('button',{name:'Load saved version',exact:true}).click();
  await expect(page.locator('[data-context-save-status]')).toContainText('could not be loaded');
  await expect(draft).toHaveValue('Keep this unsaved fictional context.');
  await expect(page.locator('[data-portfolio-confirm]')).toBeHidden();
  await page.unroute('**/local/orientation/context.php');
  await page.getByRole('button',{name:'Load saved version',exact:true}).click();
  await page.getByRole('button',{name:'Replace my entries',exact:true}).click();
  await expect(page.locator('[data-context-save-status]')).toContainText('Loaded the saved version');
  const current = await state(page);
  const stored = await page.evaluate(id => JSON.parse(sessionStorage.getItem('orientation.portfolio.account.'+id)),current.userid);
  expect(stored.dirty).toBe(false);
  expect(stored.revision).toBe(current.portfolio.revision);
});
