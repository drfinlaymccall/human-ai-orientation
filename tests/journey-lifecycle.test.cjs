// Execute the delivered lifecycle script without a Moodle runtime or private records.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../moodle/local/orientation/journey.js'), 'utf8');

function lifecycle(visibilityState = 'visible') {
  const journey = {hidden: false};
  const documentEvents = {};
  const windowEvents = {};
  let reloads = 0;
  const document = {
    visibilityState,
    querySelector: () => journey,
    addEventListener: (type, handler) => { documentEvents[type] = handler; },
  };
  const window = {
    location: {reload: () => { reloads++; }},
    addEventListener: (type, handler) => { windowEvents[type] = handler; },
  };
  vm.runInNewContext(source, {document, window});
  return {
    journey,
    reloads: () => reloads,
    show: persisted => windowEvents.pageshow({persisted}),
    hide: () => windowEvents.pagehide(),
    visibility: value => {
      document.visibilityState = value;
      documentEvents.visibilitychange();
    },
  };
}

test('an initially hidden journey is concealed before any lifecycle event', () => {
  const page = lifecycle('hidden');
  assert.equal(page.journey.hidden, true);
  assert.equal(page.reloads(), 0);
});

test('ordinary pageshow cannot reveal an initially hidden journey', () => {
  const page = lifecycle('hidden');
  page.show(false);
  assert.equal(page.journey.hidden, true);
  assert.equal(page.reloads(), 0);
});

test('first activation of an initially hidden journey reloads without revealing stale content', () => {
  const page = lifecycle('hidden');
  page.show(false);
  page.visibility('visible');
  assert.equal(page.journey.hidden, true);
  assert.equal(page.reloads(), 1);
});

test('ordinary visible first load stays readable without a reload', () => {
  const page = lifecycle();
  page.show(false);
  assert.equal(page.journey.hidden, false);
  assert.equal(page.reloads(), 0);
});

test('a visible journey conceals in the background and reloads on return', () => {
  const page = lifecycle();
  page.visibility('hidden');
  page.show(false);
  assert.equal(page.journey.hidden, true);
  assert.equal(page.reloads(), 0);
  page.visibility('visible');
  assert.equal(page.journey.hidden, true);
  assert.equal(page.reloads(), 1);
});

test('pagehide conceals and persisted history restoration revalidates', () => {
  const page = lifecycle();
  page.hide();
  assert.equal(page.journey.hidden, true);
  page.show(true);
  assert.equal(page.journey.hidden, true);
  assert.equal(page.reloads(), 1);
});
