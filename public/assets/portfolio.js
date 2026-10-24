(async () => {
  'use strict';
  const LEGACY_STORAGE_KEY = 'orientation.portfolio.v1';
  const account = window.OrientationContext ? await window.OrientationContext.ready : null;
  const MAX_BYTES = 256 * 1024;
  // Bound every field so even worst-case JSON escaping fits the backup size limit.
  const MAX_TEXT = 2000;
  const documents = {
    working: { title: 'Working with me', fields: { about: 'Relevant background', preferences: 'How to communicate with me', boundaries: 'Boundaries', instruction: 'An instruction worth reusing' } },
    projects: { title: 'My goals and projects', fields: { project: 'My current project', goal: 'Goal and success criterion', constraints: 'Constraints and unknowns', step: 'A useful project step' } },
    knowledge: { title: 'Useful knowledge and examples', fields: { knowledge: 'Useful information', source: 'Source and date', limits: 'Why it helps and its limits', referenceExample: 'An example worth following' } },
  };
  const practice = {
    testTask: 'Task and criterion', result: 'Observed result and one check', correction: 'Correction I tried and what changed', keep: 'Instruction worth keeping, and where it belongs', nextGoal: 'My next goal', learning: 'What I need to learn or decide myself', aiInformation: 'Information the AI will need', nextStep: 'First step and a checkable success criterion',
  };
  const contextKeys = Object.values(documents).flatMap(doc => Object.keys(doc.fields));
  const keys = [...contextKeys, ...Object.keys(practice)];
  const blank = () => ({ format: 'human-ai-orientation-portfolio', version: 1, fields: Object.fromEntries(keys.map(key => [key, ''])), reviewed: false, example: false });
  function validate(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || Object.keys(raw).sort().join(',') !== 'example,fields,format,reviewed,version' || raw.format !== 'human-ai-orientation-portfolio' || raw.version !== 1 || typeof raw.reviewed !== 'boolean' || typeof raw.example !== 'boolean' || !raw.fields || typeof raw.fields !== 'object' || Array.isArray(raw.fields)) throw Error('Invalid backup');
    if (Object.keys(raw.fields).sort().join(',') !== [...keys].sort().join(',')) throw Error('Invalid fields');
    const checked = blank();
    for (const key of keys) {
      if (typeof raw.fields[key] !== 'string' || raw.fields[key].length > MAX_TEXT) throw Error('Invalid field');
      checked.fields[key] = raw.fields[key];
    }
    checked.reviewed = raw.reviewed;
    checked.example = raw.example;
    return checked;
  }
  function fictional() {
    const data = blank();
    data.example = true;
    Object.assign(data.fields, {
      about: 'I am organising a small neighbourhood book swap.',
      preferences: 'Use plain language and short paragraphs. Ask one important question at a time.',
      boundaries: 'Do not invent dates, venues or other arrangements. Use placeholders for unknowns.',
      instruction: 'For invitations, leave undecided arrangements as clearly marked placeholders.',
      project: 'Invite neighbours to a welcoming book swap.',
      goal: 'A friendly invitation under 100 words with placeholders for the date and venue.',
      constraints: 'The date and venue have not been decided. There is no confirmed budget.',
      step: 'Draft an invitation for me to review before I share it.',
      knowledge: 'People may bring a book to exchange; someone can also come just to meet neighbours.',
      source: 'Fictional course scenario, authored 13 October 2026. Not information about a real event.',
      limits: 'Helps explain who is welcome. Actual event arrangements would need checking with the organiser.',
      referenceExample: 'Bring a book if you like, or simply come and say hello.',
    });
    return data;
  }
  document.querySelectorAll('.portfolio-widget').forEach(widget => {
    if (widget.dataset.portfolioReady) return;
    widget.dataset.portfolioReady = 'true';
    let state = blank();
    const STORAGE_KEY = account ? 'orientation.portfolio.account.' + account.userid : LEGACY_STORAGE_KEY;
    let savedRevision = Number(account?.portfolio.revision || 0);
    let savedItemId = Number(account?.portfolio.id || 0);
    let savedText = JSON.stringify(account?.portfolio.snapshot ? validate(account.portfolio.snapshot) : blank());
    let accountChanged = false;
    let pendingReplacement = null;
    let importSequence = 0;
    const find = selector => widget.querySelector(selector);
    const status = find('[data-portfolio-status]');
    const storage = find('[data-portfolio-storage]');
    const announce = message => { status.textContent = message; };
    let accountStatus = null;
    let accountSave = null;
    if (account) {
      const controls = document.createElement('section');
      controls.className = 'context-account-controls';
      const heading = document.createElement('h2'); heading.textContent = 'Keep it in My context';
      const explanation = document.createElement('p'); explanation.textContent = 'Save reviewed words to your Moodle account so you can return on another device. This includes your separate private practice notes. Nothing is sent to an AI.';
      accountSave = document.createElement('button'); accountSave.type = 'button'; accountSave.textContent = 'Save to My context';
      accountStatus = document.createElement('p'); accountStatus.dataset.contextSaveStatus = ''; accountStatus.setAttribute('role', 'status'); accountStatus.textContent = 'Choose Save to keep your changes in Moodle.';
      const open = document.createElement('a'); open.href = '/local/orientation/workspace.php'; open.textContent = 'Open My context';
      const load = document.createElement('button'); load.type = 'button'; load.textContent = 'Load saved version';
      controls.append(heading, explanation, accountSave, open, load, accountStatus); storage.after(controls);
      accountSave.addEventListener('click', async () => {
        if (accountChanged || window.OrientationContext.current()?.userid !== account.userid) return;
        const snapshot = validate(state); const sent = JSON.stringify(snapshot); accountSave.disabled = true;
        try {
          const result = await window.OrientationContext.write({ op: 'save-portfolio', revision: savedRevision, expecteditemid: savedItemId, snapshot }, account.userid);
          if (accountChanged) return;
          savedRevision = Number(result.portfolio.revision); savedItemId = Number(result.portfolio.id); savedText = sent; save();
          accountStatus.textContent = sent === JSON.stringify(state) ? 'Saved to Moodle. Open My context from any course page or another signed-in device.' : 'The earlier version was saved. Your latest edits are not saved yet.';
          await window.OrientationContext.refresh();
        } catch (error) {
          if (accountChanged) return;
          accountStatus.textContent = error.name === 'TimeoutError' ? 'Saving timed out and was not confirmed. Your draft is still here; copy it or download a backup. Moodle may have saved it; check My context before trying again.' :
            error.status === 409 ? 'A newer saved version exists. Your draft is kept here. Copy it before loading the saved version.' : 'Changes were not saved. Your draft is still here; copy it or download a backup, then try again.';
        } finally { accountSave.disabled = accountChanged; }
      });
      load.addEventListener('click', async () => {
        const latest = await window.OrientationContext.refresh({ freshOnly: true });
        if (accountChanged) return;
        if (!latest) { accountStatus.textContent = 'The saved version could not be loaded. Your draft is still here; try again.'; return; }
        if (latest.userid !== account.userid) return;
        propose(latest.portfolio.snapshot ? validate(latest.portfolio.snapshot) : blank(), 'Load the version saved in Moodle?', latest.portfolio.revision, latest.portfolio.id, true);
      });
      try {
        const earlier = sessionStorage.getItem(LEGACY_STORAGE_KEY);
        if (earlier) {
          const data = validate(JSON.parse(earlier));
          const bring = document.createElement('button'); bring.type = 'button'; bring.textContent = 'Bring my earlier tab draft';
          bring.addEventListener('click', () => propose(data, 'Bring this browser tab’s earlier draft into the builder? It will not be saved to Moodle until you choose Save.'));
          controls.append(bring);
        }
      } catch { /* Invalid earlier drafts are never imported. */ }
    }
    function storageUnavailable() {
      storage.textContent = account ? 'Temporary storage is unavailable. Save to My context to keep changes in Moodle, or copy/download before leaving.' : 'Temporary storage is unavailable. Entries work on this page, but may be lost when you leave. Download a backup now; they are not saved to your Moodle account.';
    }
    function readStored() {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (!saved) return account?.portfolio.snapshot ? validate(account.portfolio.snapshot) : blank();
      if (new Blob([saved]).size > MAX_BYTES) throw Error('Oversized draft');
      const parsed = JSON.parse(saved);
      if (account) {
        if (!Number.isInteger(parsed.revision) || parsed.revision < 0) throw Error('Invalid saved revision');
        if (parsed.itemid !== undefined && (!Number.isInteger(parsed.itemid) || parsed.itemid < 0)) throw Error('Invalid saved item');
        if (parsed.dirty === false && (parsed.revision < account.portfolio.revision || parsed.itemid !== account.portfolio.id)) return account.portfolio.snapshot ? validate(account.portfolio.snapshot) : blank();
        savedRevision = parsed.revision;
        // Older local envelopes keep their words but cannot claim a replacement row.
        savedItemId = parsed.itemid ?? 0;
        return validate(parsed.snapshot);
      }
      return validate(parsed);
    }
    try {
      state = readStored();
      const probe = `${STORAGE_KEY}.probe`;
      sessionStorage.setItem(probe, '1');
      sessionStorage.removeItem(probe);
      storage.textContent = account ? 'Editing keeps a temporary draft in this tab. Choose Save to My context to keep changes in Moodle across visits and devices. Copy only the context you want to share with your AI.' : 'Entries are kept temporarily in this browser tab, including when you return from another course page in this tab. They are not saved to your Moodle account or sent to an AI. Download a backup before closing the tab or changing devices.';
    } catch {
      if (account?.portfolio.snapshot) state = validate(account.portfolio.snapshot);
      storageUnavailable();
    }
    function save() {
      if (accountChanged) return;
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(account ? { revision: savedRevision, itemid: savedItemId, snapshot: state, dirty: JSON.stringify(state) !== savedText } : state)); }
      catch { storageUnavailable(); }
      if (accountStatus && !accountChanged) accountStatus.textContent = 'Unsaved changes. Choose Save to My context to keep them in Moodle.';
    }
    function body(labels) {
      return Object.entries(labels).filter(([key]) => state.fields[key].trim()).map(([key, label]) => `## ${label}\n${state.fields[key]}`).join('\n\n');
    }
    function contextText(selected) {
      const content = selected.map(key => {
        const text = body(documents[key].fields);
        return text ? `# ${documents[key].title}\n\n${text}` : '';
      }).filter(Boolean).join('\n\n---\n\n');
      if (!content) return '';
      return `${state.example ? 'Fictional practice example, authored for Human AI Orientation; edits may have been made.\n\n' : ''}${state.reviewed ? 'Review status: reviewed by the learner.' : 'Review status: draft — review before sharing.'}\n\n${content}\n`;
    }
    function refresh() {
      for (const input of widget.querySelectorAll('[data-portfolio-field]')) input.value = state.fields[input.dataset.portfolioField];
      const review = find('[data-portfolio-reviewed]');
      if (review) review.checked = state.reviewed;
      const provenance = find('[data-portfolio-provenance]');
      if (provenance) provenance.textContent = state.example ? 'Fictional practice example, authored for this course. This label stays with edited example context.' : '';
      refreshOutput();
    }
    function refreshOutput() {
      const output = find('[data-portfolio-output]');
      if (output) output.value = contextText([...widget.querySelectorAll('[data-portfolio-select]:checked')].map(input => input.dataset.portfolioSelect));
    }
    function download(text, filename, type) {
      const url = URL.createObjectURL(new Blob([text], { type }));
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = filename;
      anchor.hidden = true;
      widget.append(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
      announce('Download requested. Find the file in Downloads and check it opens; move it to your own notes folder if useful.');
    }
    function replace(data, revision = savedRevision, itemid = savedItemId, fromServer = false) {
      if (accountChanged) return;
      state = data;
      savedRevision = Number(revision);
      savedItemId = Number(itemid);
      if (fromServer) savedText = JSON.stringify(data);
      save();
      if (fromServer && accountStatus) accountStatus.textContent = 'Loaded the saved version from Moodle. Editing will make a new draft.';
      refresh();
      announce('Entries replaced. Review them and download a fresh backup after editing.');
    }
    function propose(data, message, revision = savedRevision, itemid = savedItemId, fromServer = false) {
      if (accountChanged) return;
      if (!keys.some(key => state.fields[key].length) && !state.reviewed && !state.example) { replace(data, revision, itemid, fromServer); return; }
      pendingReplacement = { data, revision, itemid, fromServer };
      find('[data-portfolio-confirm-text]').textContent = `${message} This replaces all three context documents and the private practice record. Download your current backup first if you need to keep it.`;
      find('[data-portfolio-confirm]').hidden = false;
      find('[data-portfolio-action="cancel"]').focus();
    }
    function dismiss() {
      pendingReplacement = null;
      find('[data-portfolio-confirm]').hidden = true;
    }
    function cancelImport() {
      importSequence++;
      find('[data-portfolio-import]').value = '';
    }
    window.addEventListener('pageshow', event => {
      if (!event.persisted || accountChanged) return;
      cancelImport();
      dismiss();
      try {
        state = readStored();
        refresh();
        announce('Your latest saved tab draft is ready. Download a backup to keep it.');
      } catch { storageUnavailable(); }
    });
    widget.addEventListener('input', event => {
      if (accountChanged) return;
      const key = event.target.dataset.portfolioField;
      if (!keys.includes(key)) return;
      state.fields[key] = event.target.value;
      if (contextKeys.includes(key)) {
        state.reviewed = false;
        const review = find('[data-portfolio-reviewed]');
        if (review) review.checked = false;
      }
      save();
      refreshOutput();
    });
    widget.addEventListener('change', async event => {
      if (accountChanged) return;
      const input = event.target;
      if (input.matches('[data-portfolio-reviewed]')) { state.reviewed = input.checked; save(); refreshOutput(); }
      if (input.matches('[data-portfolio-select]')) refreshOutput();
      if (!input.matches('[data-portfolio-import]')) return;
      dismiss();
      const request = ++importSequence;
      const file = input.files[0];
      if (!file) return;
      try {
        if (file.size > MAX_BYTES) throw Error('Too large');
        const imported = validate(JSON.parse(await file.text()));
        if (request === importSequence && !accountChanged) propose(imported, 'Restore this backup?');
      } catch {
        if (request !== importSequence || accountChanged) return;
        announce('Backup not imported. Choose an unchanged version 1 JSON backup from this builder, no larger than 256 KB. Your current entries are unchanged.');
      } finally { if (request === importSequence) input.value = ''; }
    });
    widget.addEventListener('click', async event => {
      if (accountChanged) return;
      const button = event.target.closest('button');
      if (!button || !widget.contains(button)) return;
      const doc = button.dataset.portfolioDownload;
      if (doc) { download(contextText([doc]), `orientation-${doc}.md`, 'text/markdown;charset=utf-8'); return; }
      if (['example', 'clear', 'cancel'].includes(button.dataset.portfolioAction)) cancelImport();
      switch (button.dataset.portfolioAction) {
        case 'copy': {
          const output = find('[data-portfolio-output]');
          if (!output.value) { announce('Write some context and select at least one document first.'); return; }
          try { await navigator.clipboard.writeText(output.value); announce('Selected context copied. Your private practice record was not included.'); }
          catch { output.focus(); output.select(); announce('Automatic copying is unavailable. The text is selected; use your device’s Copy command. Your practice record is not included.'); }
          break;
        }
        case 'context-download': download(contextText(Object.keys(documents)), 'orientation-context-portfolio.md', 'text/markdown;charset=utf-8'); break;
        case 'backup': download(JSON.stringify(state, null, 2) + '\n', 'orientation-portfolio-backup-v1.json', 'application/json'); break;
        case 'practice-download': download('# My private practice record\n\n' + body(practice) + '\n', 'orientation-practice-record.md', 'text/markdown;charset=utf-8'); break;
        case 'example': propose(fictional(), 'Use the fictional book-swap example?'); break;
        case 'clear': propose(blank(), 'Clear this portfolio? Downloaded files will remain on your device.'); break;
        case 'confirm': {
          const next = pendingReplacement;
          dismiss();
          if (next) replace(next.data, next.revision, next.itemid, next.fromServer);
          break;
        }
        case 'cancel': dismiss(); announce('Your current entries were kept.'); break;
      }
    });
    find('[data-portfolio-fallback]').hidden = true;
    find('[data-portfolio-enhanced]').hidden = false;
    window.addEventListener('orientation:account-changed', () => {
      accountChanged = true; cancelImport(); state = blank(); dismiss(); refresh();
      try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* Visible words still clear. */ }
      for (const control of widget.querySelectorAll('input,textarea,button')) control.disabled = true;
      storage.textContent = 'Your sign-in changed. Reopen this page to continue with the right account.';
      if (accountStatus) accountStatus.textContent = 'This account’s words have been cleared from the page.';
    });
    refresh();
    if (accountStatus) accountStatus.textContent = savedRevision < account.portfolio.revision ? 'Moodle has a newer saved version. Your tab draft is kept; copy it before loading the saved version.' : JSON.stringify(state) === savedText && savedRevision ? 'Showing your saved Moodle version. Save again after editing.' : 'This tab has unsaved work. Choose Save to My context to keep it in Moodle.';
  });
})();
