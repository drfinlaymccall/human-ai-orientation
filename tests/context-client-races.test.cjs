// Synthetic, deterministic client tests. No Moodle runtime, accounts or browser fixture.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = name => fs.readFileSync(path.join(__dirname, '../public/assets', name), 'utf8');
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
class Events {
  listeners = new Map();
  addEventListener(name, listener) {
    if (!this.listeners.has(name)) this.listeners.set(name, []);
    this.listeners.get(name).push(listener);
  }
  dispatchEvent(event) {
    for (const listener of this.listeners.get(event.type) || []) listener(event);
  }
  async emit(name, event = {}) {
    await Promise.all((this.listeners.get(name) || []).map(listener => listener(event)));
  }
}
class Element extends Events {
  dataset = {};
  children = [];
  value = '';
  textContent = '';
  disabled = false;
  hidden = false;
  nodes = new Map();
  lists = new Map();
  append(...nodes) { this.children.push(...nodes); }
  after(...nodes) { this.parent?.append(...nodes); }
  setAttribute() {}
  focus() {}
  querySelector(selector) { return this.nodes.get(selector) || null; }
  querySelectorAll(selector) { return this.lists.get(selector) || []; }
  matches(selector) { return this.selector === selector; }
}
function storage() {
  const values = new Map();
  return { values, getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
}
const account = userid => ({ userid, sesskey: 'synthetic-' + userid, portfolio: { id: 0, revision: 0, snapshot: null }, items: [] });
const reply = data => ({ ok: true, status: 200, json: async () => data });
function contextHarness(fetch, widget, previousOwner, runtime = {}) {
  const window = new Events();
  const sessionStorage = storage();
  if (previousOwner) sessionStorage.setItem('orientation.context.owner', String(previousOwner));
  const document = {
    querySelector: selector => selector === '.context-workspace' ? {} : selector === '.context-brief' ? widget : null,
    createElement: () => new Element(),
  };
  vm.runInNewContext(source('course-context.js'), {
    window, document, sessionStorage, fetch, queueMicrotask, AbortController, setTimeout, clearTimeout,
    AbortSignal: { timeout() {} },
    CustomEvent: class { constructor(type, options) { this.type = type; this.detail = options.detail; } },
    ...runtime,
  });
  return { window, sessionStorage, context: window.OrientationContext };
}

for (const next of [202, null]) test('initial refresh clears an earlier owner draft before enabling saves: ' + (next || 'signed out'), async () => {
  const widget = new Element();
  const output = new Element(); output.parent = widget; output.value = 'ACCOUNT-A-RESTORED-PRIVATE-BRIEF';
  const copy = new Element();
  widget.append(output, copy);
  widget.nodes.set('[data-output="brief"]', output);
  widget.lists.set('textarea,input', [output]);
  widget.lists.set('button,textarea,input,select', widget.children);
  const { context } = contextHarness(async () => next ? reply(account(next)) : { ok: false, status: 401 }, widget, 101);
  await context.ready;
  assert.equal(output.value, '');
  assert.equal(copy.disabled, true);
  assert.ok(!widget.children.some(node => node.textContent === 'Save to My context'));
});

test('initial sign-in without an earlier owner preserves an anonymous draft', async () => {
  const widget = new Element();
  const output = new Element(); output.parent = widget; output.value = 'MY-ANONYMOUS-DRAFT';
  widget.append(output);
  widget.nodes.set('[data-output="brief"]', output);
  widget.lists.set('textarea,input', [output]);
  widget.lists.set('button,textarea,input,select', widget.children);
  const { context } = contextHarness(async () => reply(account(202)), widget);
  await context.ready;
  assert.equal(output.value, 'MY-ANONYMOUS-DRAFT');
  assert.ok(widget.children.some(node => node.textContent === 'Save to My context'));
});

test('a delayed old account body cannot restore an account after a newer logout', async () => {
  const body = deferred();
  const started = deferred();
  const responses = [reply(account(101)), { ok: true, status: 200, json() { started.resolve(); return body.promise; } }, { ok: false, status: 401 }];
  const { context, sessionStorage, window } = contextHarness(async () => responses.shift());
  let changes = 0;
  window.addEventListener('orientation:account-changed', () => changes++);
  await context.ready;
  const stale = context.refresh();
  await started.promise;
  await context.refresh();
  assert.equal(context.current(), null);
  body.resolve(account(101));
  await stale;
  assert.equal(context.current(), null);
  assert.equal(sessionStorage.getItem('orientation.context.owner'), null);
  assert.equal(changes, 1);
});

test('activity teardown clears private values and keeps in-flight Save disabled', async () => {
  const widget = new Element();
  const output = new Element(); output.parent = widget;
  const input = new Element();
  const notes = new Element();
  const copy = new Element();
  const status = new Element();
  widget.nodes.set('[data-output="brief"]', output);
  widget.nodes.set('[role="status"]', status);
  widget.lists.set('textarea,input', [input, output, notes]);
  // Returning this mutable list includes the Save button appended after initial load.
  widget.children.push(input, output, notes, copy);
  widget.lists.set('button,textarea,input,select', widget.children);
  const response = deferred();
  const posts = [];
  let active = account(101);
  const { context, sessionStorage, window } = contextHarness(async (_url, options) => {
    if (options.method === 'POST') { posts.push(JSON.parse(options.body)); return { ok: true, json: () => response.promise }; }
    return reply(active);
  }, widget);
  await context.ready;
  const save = widget.children.find(node => node.textContent === 'Save to My context');
  input.value = output.value = notes.value = 'ACCOUNT-A-PRIVATE-BRIEF';
  sessionStorage.setItem('orientation.context-brief.v1', 'private draft');
  const saving = save.emit('click');
  active = account(202);
  await context.refresh();
  assert.equal(input.value + output.value + notes.value, '');
  assert.equal(copy.disabled, true);
  assert.equal(save.disabled, true);
  assert.equal(sessionStorage.getItem('orientation.context-brief.v1'), null);
  response.resolve({ item: { id: 11, revision: 1 } });
  await saving;
  assert.equal(save.disabled, true);
  assert.equal(posts[0].expecteduserid, 101);
  assert.equal(posts[0].expecteditemid, 0);
  await assert.rejects(context.write({ op: 'save-note' }, 101), /Account changed/);
  assert.equal(posts.length, 1);
  // The existing trial script may update its controls again on pageshow.
  copy.disabled = false;
  window.dispatchEvent({ type: 'pageshow' });
  await Promise.resolve();
  assert.equal(copy.disabled, true);
});

function portfolioHarness(contextEnvironment) {
  const window = contextEnvironment?.window || new Events();
  const widget = new Element();
  const sessionStorage = contextEnvironment?.sessionStorage || storage();
  const owner = contextEnvironment?.context.current() || account(101);
  if (!contextEnvironment) window.OrientationContext = { ready: Promise.resolve(owner), current: () => owner };
  const selectors = ['status', 'storage', 'reviewed', 'provenance', 'output', 'confirm', 'confirm-text', 'fallback', 'enhanced', 'import'];
  for (const name of selectors) {
    const selector = '[data-portfolio-' + name + ']';
    const node = new Element(); node.selector = selector; node.parent = widget; node.hidden = name === 'confirm';
    widget.nodes.set(selector, node);
  }
  widget.nodes.set('[data-portfolio-action="cancel"]', new Element());
  const fields = 'about preferences boundaries instruction project goal constraints step knowledge source limits referenceExample testTask result correction keep nextGoal learning aiInformation nextStep'.split(' ');
  const inputs = fields.map(key => { const node = new Element(); node.dataset.portfolioField = key; return node; });
  widget.lists.set('[data-portfolio-field]', inputs);
  widget.lists.set('input,textarea,button', [...inputs, ...widget.nodes.values()]);
  vm.runInNewContext(source('portfolio.js'), {
    window, document: { querySelectorAll: () => [widget], createElement: () => new Element() },
    sessionStorage, Blob,
  });
  return { window, widget, sessionStorage, fields, inputs, owner };
}

test('a delayed backup import cannot repopulate or rewrite a cleared account draft', async () => {
  const { window, widget, sessionStorage, fields, inputs } = portfolioHarness();
  await new Promise(resolve => setImmediate(resolve));
  const text = deferred();
  const input = widget.querySelector('[data-portfolio-import]');
  input.files = [{ size: 100, text: () => text.promise }];
  const importing = widget.emit('change', { target: input });
  window.dispatchEvent({ type: 'orientation:account-changed', detail: account(202) });
  const snapshot = { format: 'human-ai-orientation-portfolio', version: 1, reviewed: false, example: false, fields: Object.fromEntries(fields.map(key => [key, 'ACCOUNT-A-PRIVATE-BACKUP'])) };
  text.resolve(JSON.stringify(snapshot));
  await importing;
  assert.ok(inputs.every(node => node.value === '' && node.disabled));
  assert.equal(widget.querySelector('[data-portfolio-output]').value, '');
  assert.equal(sessionStorage.getItem('orientation.portfolio.account.101'), null);
  assert.equal(input.value, '');
});

test('a failed deliberate refresh never returns cached account data as fresh', async () => {
  let fail = false;
  const {context} = contextHarness(async () => fail ? {ok:false,status:503} : reply(account(101)));
  await context.ready; fail = true;
  assert.equal(await context.refresh({freshOnly:true}), null);
  assert.equal(context.current().userid, 101);
  assert.equal((await context.refresh()).userid, 101);
});

function descendants(node) { return [node, ...node.children.flatMap(descendants)]; }
function snapshot(fields, about) { return {format:'human-ai-orientation-portfolio',version:1,reviewed:false,example:false,fields:Object.fromEntries(fields.map(key=>[key,key==='about'?about:'']))}; }

test('loading saved context establishes a clean baseline while imported work stays a draft', async () => {
  const {window,widget,sessionStorage,fields,inputs,owner} = portfolioHarness();
  owner.portfolio = {id:1,revision:1,snapshot:snapshot(fields,'Earlier saved context')};
  await new Promise(resolve=>setImmediate(resolve));
  inputs[0].value = 'Unsaved draft'; await widget.emit('input',{target:inputs[0]});
  window.OrientationContext.refresh = async () => ({...owner,portfolio:{id:1,revision:2,snapshot:snapshot(fields,'Latest saved context')}});
  await descendants(widget).find(n=>n.textContent==='Load saved version').emit('click');
  const confirm = new Element(); confirm.dataset.portfolioAction='confirm'; confirm.closest=()=>confirm; widget.contains=()=>true;
  await widget.emit('click',{target:confirm});
  const stored = JSON.parse(sessionStorage.getItem('orientation.portfolio.account.101'));
  assert.equal(inputs[0].value,'Latest saved context'); assert.equal(stored.revision,2); assert.equal(stored.dirty,false);
  assert.match(descendants(widget).find(n=>'contextSaveStatus' in n.dataset).textContent,/Loaded.*saved version/);
  const file = widget.querySelector('[data-portfolio-import]');
  file.files=[{size:100,text:async()=>JSON.stringify(snapshot(fields,'Imported context'))}];
  await widget.emit('change',{target:file}); await widget.emit('click',{target:confirm});
  assert.equal(JSON.parse(sessionStorage.getItem('orientation.portfolio.account.101')).dirty,true);
});

test('a failed saved-version read preserves the unsaved draft without a replacement offer', async () => {
  const {window,widget,fields,inputs,owner} = portfolioHarness();
  owner.portfolio = {id:1,revision:1,snapshot:snapshot(fields,'Earlier saved context')};
  await new Promise(resolve=>setImmediate(resolve));
  inputs[0].value = 'Keep my unsaved words'; await widget.emit('input',{target:inputs[0]});
  window.OrientationContext.refresh = async () => null;
  await descendants(widget).find(n=>n.textContent==='Load saved version').emit('click');
  assert.equal(inputs[0].value,'Keep my unsaved words');
  assert.notEqual(widget.querySelector('[data-portfolio-confirm]').hidden,false);
  assert.match(descendants(widget).find(n=>'contextSaveStatus' in n.dataset).textContent,/could not be loaded/);
});

function fakeClock() {
  let now = 0, nextId = 0;
  const timers = new Map();
  return {
    setTimeout(callback, delay) { const id = ++nextId; timers.set(id, { at: now + delay, callback }); return id; },
    clearTimeout(id) { timers.delete(id); },
    advance(milliseconds) {
      now += milliseconds;
      for (const [id, timer] of timers) {
        if (timer.at <= now) { timers.delete(id); timer.callback(); }
      }
    },
    pending: () => timers.size,
  };
}
function hangingPost(phase) {
  const transport = { phase: null, aborted: false };
  transport.fetch = async (_url, options) => {
    if (options.method !== 'POST') return reply(account(101));
    const pending = () => new Promise((_resolve, reject) => {
      transport.phase = phase;
      options.signal?.addEventListener('abort', () => {
        transport.aborted = true;
        reject(Object.assign(Error('Aborted'), { name: 'AbortError' }));
      }, { once: true });
    });
    return phase === 'request' ? pending() : { ok: true, status: 200, json: pending };
  };
  return transport;
}
const flush = () => new Promise(resolve => setImmediate(resolve));

for (const phase of ['request', 'response body']) {
  test(`activity Save times out a hanging ${phase}, unlocks and retains its draft`, async () => {
    const clock = fakeClock(), transport = hangingPost(phase);
    const widget = new Element(), output = new Element();
    output.parent = widget; output.value = 'Keep this fictional activity draft';
    widget.append(output);
    widget.nodes.set('[data-output="brief"]', output);
    const { context, sessionStorage } = contextHarness(transport.fetch, widget, undefined, clock);
    await context.ready;
    sessionStorage.setItem('orientation.context-brief.v1', output.value);
    const save = widget.children.find(node => node.textContent === 'Save to My context');
    const saving = save.emit('click');
    await flush();
    assert.equal(transport.phase, phase);
    assert.equal(save.disabled, true);
    clock.advance(29999); await flush();
    assert.equal(save.disabled, true);
    clock.advance(1); await flush();
    assert.equal(save.disabled, false);
    await saving;
    assert.equal(transport.aborted, true);
    assert.equal(output.value, 'Keep this fictional activity draft');
    assert.equal(sessionStorage.getItem('orientation.context-brief.v1'), output.value);
    assert.match(widget.children.at(-1).textContent, /timed out.*not confirmed/i);
    assert.doesNotMatch(widget.children.at(-1).textContent, /were not saved/i);
    assert.equal(clock.pending(), 0);
  });

  test(`portfolio Save times out a hanging ${phase}, unlocks and retains its draft`, async () => {
    const clock = fakeClock(), transport = hangingPost(phase);
    const environment = contextHarness(transport.fetch, undefined, undefined, clock);
    await environment.context.ready;
    const { widget, inputs, sessionStorage } = portfolioHarness(environment);
    await flush();
    inputs[0].value = 'Keep this fictional portfolio draft';
    await widget.emit('input', { target: inputs[0] });
    const draft = sessionStorage.getItem('orientation.portfolio.account.101');
    const save = descendants(widget).find(node => node.textContent === 'Save to My context');
    const status = descendants(widget).find(node => 'contextSaveStatus' in node.dataset);
    const saving = save.emit('click');
    await flush();
    assert.equal(transport.phase, phase);
    assert.equal(save.disabled, true);
    clock.advance(29999); await flush();
    assert.equal(save.disabled, true);
    clock.advance(1); await flush();
    assert.equal(save.disabled, false);
    await saving;
    assert.equal(transport.aborted, true);
    assert.equal(inputs[0].value, 'Keep this fictional portfolio draft');
    assert.equal(sessionStorage.getItem('orientation.portfolio.account.101'), draft);
    assert.equal(JSON.parse(draft).dirty, true);
    assert.match(status.textContent, /timed out.*not confirmed/i);
    assert.doesNotMatch(status.textContent, /were not saved/i);
    assert.equal(clock.pending(), 0);
  });
}
