// Native progress in the isolated synthetic fixture only; no live learner records or mail.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'trial/launch-fixture');
const base = 'http://127.0.0.1:18802';
const course = JSON.parse(fs.readFileSync(path.join(fixture, 'course.json')));
if (!course.course_url.startsWith(base+'/')) throw new Error('Synthetic fixture required.');
const env = {...process.env, ORIENTATION_TRIAL_DIR:fixture};
const password = 'Synthetic-Progress-74!';
const stamp = Date.now();
const users = ['one','two','unenrolled'].map(name=>({username:`progress${name}${stamp}`}));
const overview = '/local/orientation/index.php';
function php(code) {
 const prelude = `define('CLI_SCRIPT',true); require ${JSON.stringify(path.join(root,'scripts/moodle-environment.php'))}; if($CFG->wwwroot!=='${base}' || $orientationtrial!==realpath('${fixture}')) throw new RuntimeException('Fixture only'); `;
 return execFileSync(path.join(root,'scripts/php'), ['-r',prelude+code], {cwd:root,env,encoding:'utf8'});
}
async function ready(page) { await page.waitForLoadState('networkidle'); await page.waitForFunction(()=>!window.M?.util?.pending_js?.length); }
async function login(page,user) { await page.goto(overview); await ready(page); await page.locator('#username').fill(user.username); await page.locator('#password').fill(password); await page.locator('#loginbtn').click(); await ready(page); }
function state() { return JSON.parse(php(`$out=[];foreach(['lesson_attempts','lesson_grades','lesson_branch','lesson_timer','lesson_answers','course_modules_completion','course_completions','course_completion_criteria'] as $t)$out[$t]=hash('sha256',serialize($DB->get_records($t,null,'id'))); $out['ids']=$DB->get_records_menu('course_modules',['course'=>${Number(course.course_id)}],'id','id,idnumber');echo json_encode($out);`)); }
function sync() { return execFileSync(path.join(root,'scripts/php'),['scripts/sync-journey.php'],{cwd:root,env,encoding:'utf8'}); }
test.describe.serial('native current-user activity progress',()=>{
 test.beforeAll(()=>{
  php(`require_once($CFG->dirroot.'/user/lib.php');require_once($CFG->libdir.'/enrollib.php');$c=$DB->get_record('course',['id'=>${Number(course.course_id)}],'*',MUST_EXIST);$p=enrol_get_plugin('manual');$i=$DB->get_record('enrol',['courseid'=>$c->id,'enrol'=>'manual'],'*',MUST_EXIST);$r=$DB->get_field('role','id',['shortname'=>'student'],MUST_EXIST);foreach(json_decode('${JSON.stringify(users)}') as $n=>$item){$u=(object)['username'=>$item->username,'email'=>$item->username.'@example.test','password'=>'${password}','auth'=>'manual','confirmed'=>1,'firstname'=>'Synthetic','lastname'=>'Progress','mnethostid'=>$CFG->mnet_localhost_id];$id=user_create_user($u);if($n<2)$p->enrol_user($i,$id,$r);}`);
 });
 test('anonymous gateway requires login; a signed-in learner gets a semantic continue and real destinations',async({page})=>{
  await page.goto(overview); await expect(page.locator('#loginbtn')).toBeVisible();
  await login(page,users[0]);
  await expect(page.getByRole('heading',{name:'My orientation progress',exact:true})).toBeVisible();
  await expect(page.locator('#region-main').getByRole('link',{name:'Continue: Try AI on a useful task',exact:true})).toBeVisible();
  await expect(page.locator('#region-main')).toContainText('Portfolio practice within activity 2');
  await expect(page.locator('#region-main')).toContainText('Choose Save to My context');
  await expect(page.locator('#region-main').getByRole('link',{name:'Open My context',exact:true})).toHaveAttribute('href',base+'/local/orientation/workspace.php');
  await expect(page.locator('#region-main').getByRole('link',{name:'Give AI the right background',exact:true})).toHaveAttribute('href',course.lesson_url);
  await expect(page.locator('#region-main')).not.toContainText('COMP-');
 });
 test('visits stay incomplete; native Mark as done persists across browsers and other-user parameters cannot change the current account',async({page,browser})=>{
  await login(page,users[0]); await page.locator('#region-main').getByRole('link',{name:'Try AI on a useful task',exact:true}).click();
  await page.goto(overview); await expect(page.locator('#region-main').getByRole('link',{name:'Continue: Try AI on a useful task',exact:true})).toBeVisible();
  await page.locator('#region-main').getByRole('link',{name:'Try AI on a useful task',exact:true}).click();
  await ready(page); await page.getByRole('button',{name:/^Mark .* as done$/}).click();
  const fresh=await browser.newContext();const returning=await fresh.newPage();await login(returning,users[0]);
  await expect(returning.locator('#region-main').getByRole('link',{name:'Continue: Give AI the right background',exact:true})).toBeVisible();
  const other=await browser.newContext();const p2=await other.newPage();await login(p2,users[1]);
  const id=php(`echo $DB->get_field('user','id',['username'=>'${users[0].username}'],MUST_EXIST);`).trim();
  await p2.goto(overview+'?userid='+id+'&courseid=1');
  await expect(p2.locator('#region-main').getByRole('link',{name:'Continue: Try AI on a useful task',exact:true})).toBeVisible();
  await fresh.close();await other.close();
 });
 test('native Lesson keeps its own resume route after leaving and returning',async({page,browser})=>{
  await login(page,users[0]);await page.locator('#region-main').getByRole('link',{name:'Continue: Give AI the right background',exact:true}).click();
  await expect(page.locator('#region-main')).toContainText('1. Choose something worth doing');
  await ready(page);await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.locator('#region-main')).toContainText('2. See what context changes');
  const context=await browser.newContext();const fresh=await context.newPage();await login(fresh,users[0]);await fresh.locator('#region-main').getByRole('link',{name:'Continue: Give AI the right background',exact:true}).click();
  await expect(fresh.locator('#region-main').getByRole('link',{name:'Yes',exact:true})).toBeVisible();
  await fresh.locator('#region-main').getByRole('link',{name:'Yes',exact:true}).click();
  await expect(fresh.locator('#region-main')).toContainText('2. See what context changes');
  await context.close();
 });
 test('complete core practice remains complete when current versions change or optional material is added',async({page})=>{
  await login(page,users[0]);await page.locator('#region-main').getByRole('link',{name:'Continue: Give AI the right background',exact:true}).click();
  await page.locator('#region-main').getByRole('link',{name:'Yes',exact:true}).click();
  for (const heading of ['3. Build your small context brief','4. Try it, check it, improve it','5. Keep instructions you can reuse','This is practice, not a graded exam.']) {
   await ready(page);await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.locator('#region-main')).toContainText(heading);
  }
  await page.getByLabel('Check what context the tool actually has, share the relevant brief deliberately, and inspect the result.',{exact:true}).check();
  await page.getByRole('button',{name:'Submit',exact:true}).click();await ready(page);await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.locator('textarea').fill('Synthetic native progress verification. I used a fictional task, checked the result and kept a reusable instruction.');
  await page.getByRole('button',{name:'Submit',exact:true}).click();await ready(page);await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.locator('#region-main')).toContainText('Your lesson is complete');
  await page.goto(overview);await page.locator('#region-main').getByRole('link',{name:'Check a result and plan your next step',exact:true}).click();await ready(page);await page.getByRole('button',{name:/^Mark .* as done$/}).click();
  await page.goto(overview);await expect(page.locator('#region-main')).toContainText('Your three core activities are recorded as complete');
  const before=state();const mapfile=path.join(fixture,'moodle/local/orientation/course-map.json');const original=fs.readFileSync(mapfile,'utf8');
  try {
   const changed=JSON.parse(original);changed.activities[0].version='1.1.0';changed.activities[0].update_note='Synthetic current-version display check.';
   changed.activities.push({slug:'notes',idnumber:'orientation:notes',label:'Synthetic optional new practice',module_type:'page',public_url:'/notes',baseline:false,optional:true,version:'1.0.0',updated_at:'2026-10-23',update_note:'Synthetic optional addition.',outcomes:['Optional notes practice.']});
   fs.writeFileSync(mapfile,JSON.stringify(changed));await page.goto(overview);
   await expect(page.locator('#region-main')).toContainText('Current version 1.1.0');await expect(page.locator('#region-main')).toContainText('Synthetic optional new practice');
   await expect(page.locator('#region-main')).toContainText('Your three core activities are recorded as complete');expect(state()).toEqual(before);
   changed.activities[changed.activities.length-1].baseline=true;fs.writeFileSync(mapfile,JSON.stringify(changed));
   expect(php("try{\\local_orientation\\catalogue::map();echo 'unexpected';}catch(RuntimeException $e){echo 'baseline-refused';}")).toBe('baseline-refused');expect(state()).toEqual(before);
  } finally {fs.writeFileSync(mapfile,original);}
 });
 test('renaming and publishing twice preserve IDs, attempts, answers, native completion and original criteria',()=>{
  const before=state();
  php(`require_once($CFG->dirroot.'/course/lib.php');\\core\\session\\manager::set_user(get_admin());set_coursemodule_name(6,'Synthetic prior display name');`);
  expect(sync()).toContain('existing evidence unchanged');expect(sync()).toContain('existing evidence unchanged');
  expect(state()).toEqual(before);
 });
 test('conflicting private adoption records are refused without changing native evidence',()=>{
  const manifestfile=path.join(fixture,'journey.json');const original=fs.readFileSync(manifestfile,'utf8');const before=state();
  try {
   const invalid=JSON.parse(original);invalid['first-task']=Number(course.lesson_cmid);fs.writeFileSync(manifestfile,JSON.stringify(invalid));
   expect(()=>sync()).toThrow();expect(state()).toEqual(before);
  } finally {fs.writeFileSync(manifestfile,original);}
 });
 test('the signup observer leaves unrelated, external and missing-course destinations intact',()=>{
  const result=JSON.parse(php(`require_once($CFG->dirroot.'/user/lib.php');$u=(object)['username'=>'observer${stamp}','email'=>'observer${stamp}@example.test','password'=>'${password}','auth'=>'email','confirmed'=>1,'firstname'=>'Synthetic','lastname'=>'Observer','mnethostid'=>$CFG->mnet_localhost_id];$id=user_create_user($u);$event=\\core\\event\\user_created::create_from_userid($id);$out=[];foreach(['https://example.test/mod/lesson/view.php?id=1',$CFG->wwwroot.'/mod/lesson/view.php?id=999999'] as $url){set_user_preference('auth_email_wantsurl',$url,$id);\\local_orientation\\observer::user_created($event);$out[]=get_user_preferences('auth_email_wantsurl','',$id)===$url;} $name=$DB->get_field('course','shortname',['id'=>${Number(course.course_id)}],MUST_EXIST);try{$DB->set_field('course','shortname','SYNTHETIC-MISSING-ORIENTATION',['id'=>${Number(course.course_id)}]);$url=$CFG->wwwroot.'/mod/lesson/view.php?id=1';set_user_preference('auth_email_wantsurl',$url,$id);\\local_orientation\\observer::user_created($event);$out[]=get_user_preferences('auth_email_wantsurl','',$id)===$url;}finally{$DB->set_field('course','shortname',$name,['id'=>${Number(course.course_id)}]);}echo json_encode($out);`));
  expect(result).toEqual([true,true,true]);
 });
 test('unenrolled users, hidden activities, hidden courses and invalid module slugs do not expose personal progress',async({page,browser})=>{
  await login(page,users[2]);await expect(page.locator('#region-main')).not.toContainText('Your signed-in Moodle account saves');
  const context=await browser.newContext();const enrolled=await context.newPage();await login(enrolled,users[0]);
  try {
   php(`require_once($CFG->dirroot.'/course/lib.php');\\core\\session\\manager::set_user(get_admin());set_coursemodule_visible(6,0);`);
   await enrolled.goto(overview);await expect(enrolled.locator('#region-main').getByRole('link',{name:'Try AI on a useful task',exact:true})).toHaveCount(0);
   await enrolled.goto(overview+'?module=first-task');await expect(enrolled.locator('#region-main')).not.toContainText('Keep a useful result');
  } finally {php(`require_once($CFG->dirroot.'/course/lib.php');\\core\\session\\manager::set_user(get_admin());set_coursemodule_visible(6,1);`);}
  try {
   php(`$DB->set_field('course','visible',0,['id'=>${Number(course.course_id)}]);rebuild_course_cache(${Number(course.course_id)},true);`);
   await enrolled.goto(overview);await expect(enrolled.locator('#region-main')).not.toContainText('Your signed-in Moodle account saves');
  } finally {php(`$DB->set_field('course','visible',1,['id'=>${Number(course.course_id)}]);rebuild_course_cache(${Number(course.course_id)},true);`);}
  await enrolled.goto(overview+'?module=not-a-module');await expect(enrolled.locator('#region-main')).not.toContainText('Your signed-in Moodle account saves');
  await context.close();
 });
});
