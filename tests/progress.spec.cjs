// Native progress in the isolated synthetic fixture only; no live learner records or mail.
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const fixture = path.join(root, 'trial/launch-fixture');
const base = process.env.ORIENTATION_FIXTURE_URL || 'http://127.0.0.1:18802';
if (!['http://127.0.0.1:18802','http://127.0.0.1:18812'].includes(base)) throw new Error('Guarded synthetic fixture URL required.');
if (base.endsWith(':18812')) {
 const marker=JSON.parse(fs.readFileSync(path.join(fixture,'synthetic-fixture.json')));
 if(fs.lstatSync(fixture).isSymbolicLink() || marker.synthetic!==true || marker.wwwroot!==base || marker.database!=='orientation_journey_fixture') throw new Error('Independent synthetic fixture marker required.');
}
const course = JSON.parse(fs.readFileSync(path.join(fixture, 'course.json')));
if (!course.course_url.startsWith(base+'/')) throw new Error('Synthetic fixture required.');
const env = {...process.env, ORIENTATION_TRIAL_DIR:fixture};
const password = 'Synthetic-Progress-74!';
const stamp = Date.now();
const users = ['one','two','unenrolled'].map(name=>({username:`progress${name}${stamp}`}));
const overview = '/local/orientation/index.php';
function php(code) {
 const prelude = `define('CLI_SCRIPT',true); require ${JSON.stringify(path.join(root,'scripts/moodle-environment.php'))}; require_once ${JSON.stringify(path.join(root,'scripts/synthetic-fixture.php'))}; if($CFG->wwwroot!=='${base}' || !orientation_is_synthetic_fixture($orientationtrial,$CFG)) throw new RuntimeException('Fixture only'); `;
 return execFileSync(path.join(root,'scripts/php'), ['-r',prelude+code], {cwd:root,env,encoding:'utf8'});
}
async function ready(page) { await page.waitForLoadState('networkidle'); await page.waitForFunction(()=>!window.M?.util?.pending_js?.length); const tour=page.getByRole('button',{name:'Got it',exact:true}); if(await tour.isVisible()) await tour.click(); }
async function login(page,user) { await page.goto(overview); await ready(page); await page.locator('#username').fill(user.username); await page.locator('#password').fill(password); await page.locator('#loginbtn').click({timeout:30000}); await ready(page); }
function primaryLink(page,label) { return page.locator('#region-main a.btn-primary').filter({hasText:label}); }
function state() { return JSON.parse(php(`$out=[];foreach(['lesson_attempts','lesson_grades','lesson_branch','lesson_timer','lesson_answers','course_modules_completion','course_completions','course_completion_criteria'] as $t)$out[$t]=hash('sha256',serialize($DB->get_records($t,null,'id'))); $out['ids']=$DB->get_records_menu('course_modules',['course'=>${Number(course.course_id)}],'id','id,idnumber');echo json_encode($out);`)); }
function sync() { return execFileSync(path.join(root,'scripts/php'),['scripts/sync-journey.php'],{cwd:root,env,encoding:'utf8'}); }
test.describe.serial('native current-user activity progress',()=>{
 test.beforeAll(()=>{
  php(`require_once($CFG->dirroot.'/user/lib.php');require_once($CFG->libdir.'/enrollib.php');$c=$DB->get_record('course',['id'=>${Number(course.course_id)}],'*',MUST_EXIST);$p=enrol_get_plugin('manual');$i=$DB->get_record('enrol',['courseid'=>$c->id,'enrol'=>'manual'],'*',MUST_EXIST);$r=$DB->get_field('role','id',['shortname'=>'student'],MUST_EXIST);foreach(json_decode('${JSON.stringify(users)}') as $n=>$item){$u=(object)['username'=>$item->username,'email'=>$item->username.'@example.test','password'=>'${password}','auth'=>'manual','confirmed'=>1,'firstname'=>'Synthetic','lastname'=>'Progress','mnethostid'=>$CFG->mnet_localhost_id];$id=user_create_user($u);if($n<2)$p->enrol_user($i,$id,$r);}`);
 });
 test('the real session endpoint is observational, private and never exposes account or progress details',async({page,request})=>{
  test.setTimeout(90000);
  const before=state();
  for (const method of ['GET','HEAD']) {
   const response=await request.fetch('/local/orientation/state.php?userid=1&courseid=1',{method,maxRedirects:0});
   expect(response.status()).toBe(200);expect(response.headers()['cache-control']).toMatch(/private.*no-store/);
   expect(response.headers()['access-control-allow-origin']).toBeUndefined();
   expect(response.headers()['set-cookie']).toBeUndefined();
   expect(response.headers()['content-type']).toContain('application/json');
   if(method==='GET')expect(await response.json()).toEqual({state:'signed-out',journey_url:overview});
   else expect(await response.text()).toBe('');
  }
  const denied=await request.post('/local/orientation/state.php');expect(denied.status()).toBe(405);
  expect(state()).toEqual(before);
  await page.goto(course.lesson_url);await expect(page.locator('#loginbtn')).toBeVisible();
  const pending=await page.request.get('/local/orientation/state.php?userid=1');expect(await pending.json()).toEqual({state:'signed-out',journey_url:overview});
  await page.locator('#username').fill(users[1].username);await page.locator('#password').fill(password);await page.locator('#loginbtn').click({timeout:30000});await ready(page);
  expect(page.url()).toContain('/mod/lesson/view.php');
  const signedinBefore=state();
  const signedin=await page.request.get('/local/orientation/state.php?userid=1');expect(signedin.headers()['set-cookie']).toBeUndefined();expect(await signedin.json()).toEqual({state:'signed-in',journey_url:overview});
  const signedinHead=await page.request.head('/local/orientation/state.php');expect(signedinHead.headers()['set-cookie']).toBeUndefined();expect(await signedinHead.text()).toBe('');
  expect(state()).toEqual(signedinBefore);
  await page.goto(overview);await expect(page.locator('[data-activity-atlas]')).toBeVisible();
  await page.locator('.usermenu .dropdown-toggle').click();await page.getByRole('menuitem',{name:/Log out/}).click();await ready(page);
  expect(await (await page.request.get('/local/orientation/state.php')).json()).toEqual({state:'signed-out',journey_url:overview});
  await page.goBack();await ready(page);await expect(page.locator('[data-private-journey]')).not.toBeVisible();
  await page.goto(overview);await expect(page.locator('#loginbtn')).toBeVisible();await expect(page.locator('[data-atlas-progress]')).toHaveCount(0);
 });
 test('an expired native session reports signed out without refreshing cookies, timestamps or a pending destination',async({page,context})=>{
  test.skip(base!=='http://127.0.0.1:18812','This expiry regression uses the independent preview fixture only.');
  test.setTimeout(180000);
  const endpoint=`orientation-session-fixture-${stamp}.php`;
  const endpointPath=path.join(fixture,'moodle',endpoint);
  // Seed a real native pending destination through the normal session writer, only in the guarded fixture.
  fs.writeFileSync(endpointPath,`<?php require __DIR__.'/config.php'; require_once ${JSON.stringify(path.join(root,'scripts/synthetic-fixture.php'))}; if($CFG->wwwroot!=='http://127.0.0.1:18812' || !orientation_is_synthetic_fixture(dirname(__DIR__),$CFG)) throw new RuntimeException('Fixture only'); require_login(); $SESSION->wantsurl=${JSON.stringify(course.lesson_url)}; header('Content-Type: application/json'); echo json_encode(['seeded'=>true]);`);
  try{
   await login(page,users[0]);
   expect(await (await page.request.get('/'+endpoint)).json()).toEqual({seeded:true});
   const cookies=await context.cookies();const sessionCookie=cookies.find(cookie=>cookie.name.startsWith('MoodleSession'));
   expect(sessionCookie).toBeTruthy();expect(sessionCookie.value).toMatch(/^[a-zA-Z0-9,-]+$/);
   const sid=JSON.stringify(sessionCookie.value);
   const snapshot=()=>JSON.parse(php(`$s=$DB->get_record('sessions',['sid'=>${sid}],'*',MUST_EXIST); $data=file_get_contents(($CFG->session_file_save_path??$CFG->dataroot.'/sessions').'/sess_'.$s->sid); echo json_encode(['timestamp'=>(int)$s->timemodified,'record'=>hash('sha256',serialize($s)),'payload'=>hash('sha256',$data),'pending'=>str_contains($data,${JSON.stringify(course.lesson_url)})]);`));
   const probe=async(expected)=>{
    const before=snapshot();expect(before.pending).toBe(true);
    for(const method of ['GET','HEAD']){
     const response=await page.request.fetch('/local/orientation/state.php',{method,maxRedirects:0});
     expect(response.status()).toBe(200);expect(response.headers()['set-cookie']).toBeUndefined();
     if(method==='GET')expect(await response.json()).toEqual({state:expected,journey_url:overview});
     else expect(await response.text()).toBe('');
    }
    expect(snapshot()).toEqual(before);expect(await context.cookies()).toEqual(cookies);
   };
   await probe('signed-in');
   php(`$DB->set_field('sessions','timemodified',time()-(int)$CFG->sessiontimeout-60,['sid'=>${sid}]);`);
   await probe('signed-out');
  }finally{fs.rmSync(endpointPath,{force:true});}
 });
 test('a delayed anonymous public probe cannot replace the session of a newly opened protected check',async({browser})=>{
  test.setTimeout(90000);
  const context=await browser.newContext();const publicPage=await context.newPage();
  let releaseProbe;const gate=new Promise(resolve=>{releaseProbe=resolve;});
  let capturedProbe;const captured=new Promise(resolve=>{capturedProbe=resolve;});
  await publicPage.route('**/local/orientation/state.php',async route=>{
   // Fetch without a browser cookie jar, then delay only delivery to the public tab.
   const response=await fetch(route.request().url(),{headers:route.request().headers()});
   const body=await response.text();const headers=Object.fromEntries(response.headers.entries());
   capturedProbe();await gate;await route.fulfill({status:response.status,headers,body});
  });
  try{
   await publicPage.goto(base+'/journey');await captured;
   const opened=context.waitForEvent('page');
   await publicPage.getByRole('link',{name:'Find my starting point',exact:true}).click({modifiers:['Control']});
   const protectedPage=await opened;await expect(protectedPage.locator('#loginbtn')).toBeVisible();
   const returned=publicPage.waitForResponse(r=>new URL(r.url()).pathname==='/local/orientation/state.php');
   releaseProbe();await returned;
   await expect(publicPage.locator('[data-account-state]')).toHaveText('Signed out');
   await ready(protectedPage);
   await protectedPage.locator('#username').fill(users[0].username);await protectedPage.locator('#password').fill(password);await protectedPage.locator('#loginbtn').click({timeout:30000});await ready(protectedPage);
   await expect(protectedPage).toHaveURL(base+'/local/orientation/startingpoint.php');
   await expect(protectedPage.getByRole('heading',{name:'Find my starting point',exact:true})).toBeVisible();
  }finally{releaseProbe();await context.close();}
 });
 test('ordinary login lands on journey; learner navigation persists across native pages and staff retain administration',async({page,browser})=>{
  test.setTimeout(120000);
  await page.goto('/login/index.php');await page.locator('#username').fill(users[0].username);await page.locator('#password').fill(password);await page.locator('#loginbtn').click({timeout:30000});await ready(page);
  expect(new URL(page.url()).pathname).toBe(overview);
  const userid=php(`echo $DB->get_field('user','id',['username'=>'${users[0].username}'],MUST_EXIST);`).trim();
  const first=await page.locator('[data-atlas-open="first-task"]').getAttribute('href');
  for(const url of [course.course_url,first,'/user/profile.php?id='+userid]){
   await page.goto(url);await ready(page);const nav=page.locator('.primary-navigation');
   await expect(nav.getByRole('menuitem',{name:'Your course journey',exact:true})).toBeVisible();
   await expect(nav.getByRole('menuitem',{name:'Help',exact:true})).toBeVisible();
   await expect(nav.getByRole('menuitem',{name:'Dashboard',exact:true})).toHaveCount(0);await expect(nav.getByRole('menuitem',{name:'My courses',exact:true})).toHaveCount(0);
  }
  const lessonContext=await browser.newContext();const lessonPage=await lessonContext.newPage();await login(lessonPage,users[1]);await lessonPage.goto(course.lesson_url);await ready(lessonPage);await expect(lessonPage.locator('.primary-navigation').getByRole('menuitem',{name:'Your course journey',exact:true})).toBeVisible();await expect(lessonPage.locator('.primary-navigation').getByRole('menuitem',{name:'My courses',exact:true})).toHaveCount(0);await lessonContext.close();
  const staff=await browser.newContext();const admin=await staff.newPage();const credentials=JSON.parse(fs.readFileSync(path.join(fixture,'credentials.json')));
  await admin.goto('/login/index.php');await admin.locator('#username').fill(credentials.admin_username);await admin.locator('#password').fill(credentials.admin_password);await admin.locator('#loginbtn').click({timeout:30000});await ready(admin);
  await expect(admin.locator('.primary-navigation').getByRole('menuitem',{name:'Site administration',exact:true})).toBeVisible();
  await expect(admin.locator('.primary-navigation').getByRole('menuitem',{name:'My courses',exact:true})).toBeVisible();await staff.close();
 });
 test('anonymous gateway requires login; a signed-in learner gets a semantic continue and real destinations',async({page})=>{
  await page.goto(overview); await expect(page.locator('#loginbtn')).toBeVisible();
  await login(page,users[0]);
  await expect(page.getByRole('heading',{name:'Your course journey',exact:true})).toBeVisible();
  await expect(primaryLink(page,'Continue: Try AI on a useful task')).toBeVisible();
  await expect(page.locator('#region-main')).toContainText('Portfolio practice within activity 2');
  await expect(page.locator('#region-main')).toContainText('Choose Save to My context');
  await expect(page.locator('#region-main').locator('[data-atlas-open="useful-context"]')).toHaveAttribute('href',course.lesson_url);
  await expect(page.locator('[data-activity-atlas]')).toBeVisible();
  await expect(page.getByRole('button',{name:'Close course index',exact:true})).toHaveCount(0);
  await expect(page.locator('[data-atlas-choice]')).toHaveCount(5);
  await expect(page.locator('[data-atlas-progress="first-task"]')).toHaveText('Not yet complete');
  await expect(page.locator('link[href$="/assets/site.css"]')).toHaveCount(0);
  await expect(page.locator('#region-main')).not.toContainText('COMP-');
  await page.screenshot({path:path.join(fixture,'native-journey-desktop.png'),fullPage:true});
  await page.setViewportSize({width:390,height:844});await page.locator('[data-atlas-choice="portfolio"]').click();
  await expect(page.locator('[data-atlas-open="portfolio"]')).toBeVisible();await page.screenshot({path:path.join(fixture,'native-journey-mobile.png'),fullPage:true});
 });
 test('the private atlas remains a complete readable native activity list without JavaScript',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  await page.goto(overview);await page.locator('#username').fill(users[0].username);await page.locator('#password').fill(password);await page.locator('#loginbtn').click({timeout:30000});
  await expect(page.locator('[data-atlas-detail]')).toHaveCount(5);
  for(const link of await page.locator('[data-atlas-open]').all()){await expect(link).toBeVisible();await expect(link).toHaveAttribute('href',/\/mod\/(page|lesson)\/view\.php\?id=/);}
  await expect(page.getByRole('link',{name:'Set up your notes',exact:true})).toHaveAttribute('href',/\/mod\/page\/view\.php\?id=/);
  await context.close();
 });
 test('visits stay incomplete; native Mark as done persists across browsers and other-user parameters cannot change the current account',async({page,browser})=>{
  await login(page,users[0]); await page.locator('#region-main').locator('[data-atlas-open="first-task"]').click();
  await page.goto(overview); await expect(primaryLink(page,'Continue: Try AI on a useful task')).toBeVisible();
  await page.locator('#region-main').locator('[data-atlas-open="first-task"]').click();
  await ready(page); await page.getByRole('button',{name:/^Mark .* as done$/}).click();
  const fresh=await browser.newContext();const returning=await fresh.newPage();await login(returning,users[0]);
  await expect(primaryLink(returning,'Continue: Give AI the right background')).toBeVisible();
  await expect(returning.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
  const other=await browser.newContext();const p2=await other.newPage();await login(p2,users[1]);
  const id=php(`echo $DB->get_field('user','id',['username'=>'${users[0].username}'],MUST_EXIST);`).trim();
  await p2.goto(overview+'?userid='+id+'&courseid=1');
  await expect(primaryLink(p2,'Continue: Try AI on a useful task')).toBeVisible();
  await fresh.close();await other.close();
 });
 test('a background journey hides private content and revalidates a same-browser account switch',async({page,context})=>{
  test.setTimeout(90000);
  await login(page,users[0]);await expect(page.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
  await page.locator('.usermenu .dropdown-toggle').click();const logout=await page.getByRole('menuitem',{name:/Log out/}).getAttribute('href');
  // Explicit lifecycle simulation is deterministic in headless Chromium; account changes use real native login/logout.
  await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
  await expect(page.locator('[data-private-journey]')).not.toBeVisible();
  const other=await context.newPage();await other.goto(logout);await login(other,users[1]);
  await page.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});document.dispatchEvent(new Event('visibilitychange'));});
  await expect(page.locator('[data-private-journey]')).toBeVisible();await expect(page.locator('[data-atlas-progress="first-task"]')).toHaveText('Not yet complete');
  await other.close();
 });
 test('a journey first loaded hidden conceals account A and reloads account B on first activation',async({page,context})=>{
  test.setTimeout(90000);
  await login(page,users[0]);
  await expect(page.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
  await page.locator('.usermenu .dropdown-toggle').click();
  const logout=await page.getByRole('menuitem',{name:/Log out/}).getAttribute('href');
  const hidden=await context.newPage();
  // Set visibility before any delivered script runs, including journey.js. The
  // per-tab sessionStorage flag lets the subsequent real reload initialise normally.
  await hidden.addInitScript(()=>{
   if(sessionStorage.getItem('synthetic-initial-journey-activated')==='yes')return;
   Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});
  });
  try{
   await hidden.goto(overview);await ready(hidden);
   expect(await hidden.evaluate(()=>document.visibilityState)).toBe('hidden');
   await expect(hidden.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
   await expect(hidden.locator('[data-private-journey]')).not.toBeVisible();
   // The browser already emitted ordinary pageshow. Exercise it explicitly as
   // well so the concealed initial state cannot be undone by that event.
   await hidden.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:false})));
   await expect(hidden.locator('[data-private-journey]')).not.toBeVisible();
   // Change the real shared native session without activating the hidden page.
   await page.goto(logout);await login(page,users[1]);
   await expect(page.locator('[data-atlas-progress="first-task"]')).toHaveText('Not yet complete');
   await expect(hidden.locator('[data-atlas-progress="first-task"]')).toHaveText('Completed');
   await expect(hidden.locator('[data-private-journey]')).not.toBeVisible();
   const reloaded=hidden.waitForEvent('load');
   await hidden.evaluate(()=>{
    sessionStorage.setItem('synthetic-initial-journey-activated','yes');
    Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});
    document.dispatchEvent(new Event('visibilitychange'));
   });
   await reloaded;await ready(hidden);
   await expect(hidden.locator('[data-private-journey]')).toBeVisible();
   await expect(hidden.locator('[data-atlas-progress="first-task"]')).toHaveText('Not yet complete');
  }finally{await hidden.close();}
 });
 test('native Lesson keeps its own resume route after leaving and returning',async({page,browser})=>{
  await login(page,users[0]);await primaryLink(page,'Continue: Give AI the right background').click();
  await expect(page.locator('#region-main')).toContainText('1. Choose something worth doing');
  await ready(page);await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.locator('#region-main')).toContainText('2. See what context changes');
  const context=await browser.newContext();const fresh=await context.newPage();await login(fresh,users[0]);await expect(fresh.locator('[data-atlas-progress="useful-context"]')).toHaveText('In progress');await primaryLink(fresh,'Continue: Give AI the right background').click();
  await expect(fresh.locator('#region-main').getByRole('link',{name:'Yes',exact:true})).toBeVisible();
  await fresh.locator('#region-main').getByRole('link',{name:'Yes',exact:true}).click();
  await expect(fresh.locator('#region-main')).toContainText('2. See what context changes');
  await context.close();
 });
 test('complete core practice remains complete when current versions change or optional material is added',async({page})=>{
  await login(page,users[0]);await primaryLink(page,'Continue: Give AI the right background').click();
  await page.locator('#region-main').getByRole('link',{name:'Yes',exact:true}).click();
  for (const heading of ['3. Build your small context brief','4. Try it, check it, improve it','5. Keep instructions you can reuse','This is practice, not a graded exam.']) {
   await ready(page);await page.getByRole('button',{name:'Continue',exact:true}).click();await expect(page.locator('#region-main')).toContainText(heading);
  }
  await page.getByLabel('Check what context the tool actually has, share the relevant brief deliberately, and inspect the result.',{exact:true}).check();
  await page.getByRole('button',{name:'Submit',exact:true}).click();await ready(page);await page.getByRole('button',{name:'Continue',exact:true}).click();
  await page.locator('textarea').fill('Synthetic native progress verification. I used a fictional task, checked the result and kept a reusable instruction.');
  await page.getByRole('button',{name:'Submit',exact:true}).click();await ready(page);await page.getByRole('button',{name:'Continue',exact:true}).click();
  await expect(page.locator('#region-main')).toContainText('Your lesson is complete');
  await page.goto(overview);await page.locator('[data-atlas-choice="check-and-continue"]').click();await page.locator('[data-atlas-open="check-and-continue"]').click();await ready(page);await page.getByRole('button',{name:/^Mark .* as done$/}).click();
  await page.goto(overview);await expect(page.locator('#region-main')).toContainText('Your three core activities are recorded as complete');
  const before=state();const mapfile=path.join(fixture,'moodle/local/orientation/course-map.json');const original=fs.readFileSync(mapfile,'utf8');
  try {
   const changed=JSON.parse(original);changed.activities[0].version='1.1.0';changed.activities[0].update_note='Synthetic current-version display check.';
   changed.activities.push({slug:'notes',idnumber:'orientation:notes',label:'Synthetic optional new practice',module_type:'page',public_url:'/notes',baseline:false,optional:true,version:'1.0.0',updated_at:'2026-10-23',update_note:'Synthetic optional addition.',outcomes:['Optional notes practice.']});
   fs.writeFileSync(mapfile,JSON.stringify(changed));await page.goto(overview);
   await expect(page.locator('[data-journey-extra="notes"]')).toContainText('Synthetic optional new practice');
   await expect(page.locator('[data-journey-extra="notes"] a')).toHaveAttribute('href',/\/mod\/page\/view\.php\?id=/);
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
  const context=await browser.newContext();const enrolled=await context.newPage();await login(enrolled,users[1]);
  try {
   php(`require_once($CFG->dirroot.'/course/lib.php');\\core\\session\\manager::set_user(get_admin());set_coursemodule_visible(6,0);`);
   await enrolled.goto(overview);await expect(enrolled.locator('[data-atlas-open="first-task"]')).toHaveCount(0);
   await expect(enrolled.locator('[data-atlas-choice="first-task"]')).toHaveCount(0);
   await expect(enrolled.locator('#region-main')).toContainText('A core activity is currently unavailable');
   await expect(enrolled.locator('[data-atlas-choice="useful-context"]')).toBeVisible();
   await enrolled.goto(overview+'?module=first-task');await expect(enrolled.locator('#region-main')).not.toContainText('Keep a useful result');
  } finally {php(`require_once($CFG->dirroot.'/course/lib.php');\\core\\session\\manager::set_user(get_admin());set_coursemodule_visible(6,1);`);}
  try {
   php(`$DB->set_field('course','visible',0,['id'=>${Number(course.course_id)}]);rebuild_course_cache(${Number(course.course_id)},true);`);
   await enrolled.goto(overview);await expect(enrolled.locator('#region-main')).not.toContainText('Your signed-in Moodle account saves');
  } finally {php(`$DB->set_field('course','visible',1,['id'=>${Number(course.course_id)}]);rebuild_course_cache(${Number(course.course_id)},true);`);}
  await enrolled.goto(overview+'?module=not-a-module');await expect(enrolled.locator('#region-main')).not.toContainText('Your signed-in Moodle account saves');
  await context.close();
 });
 test('a learner enrolled in another course retains native Dashboard and My courses navigation',async({page})=>{
  php(`require_once($CFG->dirroot.'/course/lib.php');require_once($CFG->libdir.'/enrollib.php');\\core\\session\\manager::set_user(get_admin());$c=create_course((object)['fullname'=>'Synthetic other course','shortname'=>'SYNTHETIC-NAV-${stamp}','category'=>$DB->get_field('course_categories','id',[],IGNORE_MULTIPLE)]);$p=enrol_get_plugin('manual');$i=$DB->get_record('enrol',['courseid'=>$c->id,'enrol'=>'manual'],'*',MUST_EXIST);$u=$DB->get_field('user','id',['username'=>'${users[1].username}'],MUST_EXIST);$r=$DB->get_field('role','id',['shortname'=>'student'],MUST_EXIST);$p->enrol_user($i,$u,$r);`);
  await login(page,users[1]);await expect(page.locator('.primary-navigation').getByRole('menuitem',{name:'My courses',exact:true})).toBeVisible();
  await expect(page.locator('.primary-navigation').getByRole('menuitem',{name:'Dashboard',exact:true})).toBeVisible();
 });
});
