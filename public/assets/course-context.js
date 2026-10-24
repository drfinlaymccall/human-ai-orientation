(() => {
  'use strict';
  if (window.OrientationContext) return;
  const endpoint = '/local/orientation/context.php';
  const home = '/local/orientation/workspace.php';
  let account = null;
  let checked = false;
  let sequence = 0;
  let panel = document.querySelector('[data-context-panel]');
  if (!panel && !document.querySelector('.context-workspace')) {
    panel = document.createElement('aside');
    panel.className = 'course-context-panel';
    panel.dataset.contextPanel = '';
    panel.setAttribute('aria-label', 'Your course and context');
    panel.innerHTML = '<details open><summary>My context</summary><div data-context-panel-body></div></details>';
    document.body.append(panel);
  }
  const link = (label, href) => {
    const a = document.createElement('a'); a.textContent = label; a.href = href; return a;
  };
  function render(message = '') {
    if (!panel) return;
    const body = panel.querySelector('[data-context-panel-body]');
    body.replaceChildren();
    const info = document.createElement('p');
    info.textContent = account ? 'Your saved words, ready to use again.' : (message || 'Sign in to keep your creations in Moodle.');
    body.append(info);
    body.append(link(account ? 'Open My context' : 'Sign in to My context', home));
    if (account) {
      const list = document.createElement('ul');
      const dated = (li, item) => {
        const small = document.createElement('small');
        small.textContent = item ? 'Last saved ' + new Date(Number(item.timemodified) * 1000).toLocaleDateString() : 'Not saved yet';
        li.append(small);
      };
      const portfolio = (account.items || []).find(item => item.itemkey === 'portfolio');
      for (const [docKey, label] of [['working', 'Working with me'], ['projects', 'My goals and projects'], ['knowledge', 'Useful knowledge and examples']]) {
        const li = document.createElement('li'); li.append(link(label, home + '?document=' + docKey)); dated(li, portfolio); list.append(li);
      }
      for (const item of account.items || []) {
        if (item.itemkey === 'portfolio') continue;
        const li = document.createElement('li'); li.append(link(item.title, home + '?item=' + encodeURIComponent(item.id))); dated(li, item); list.append(li);
      }
      body.append(list);
      body.append(link('New context note', home + '?new=1'));
    }
    const p = document.createElement('p'); p.append(link('Your course progress', '/local/orientation/index.php')); body.append(p);
    if (account?.progress) {
      const progress = document.createElement('p');
      progress.textContent = `${account.progress.complete} of ${account.progress.total} core activities complete. Completion records practice.`;
      body.append(progress);
      if (account.progress.next) body.append(link('Continue: ' + account.progress.next.label, account.progress.next.url));
      if (account.progress.unavailable) { const p = document.createElement('p'); p.textContent = 'Some course material is currently unavailable.'; body.append(p); }
    }
    const guide = document.createElement('details'); const summary = document.createElement('summary'); summary.textContent = 'Course guide'; guide.append(summary);
    for (const [label, href] of [['Try a useful task', '/first-task'], ['Give useful context', '/preview'], ['Build your portfolio', '/portfolio'], ['Check and continue', '/check-and-continue']]) {
      const p = document.createElement('p'); p.append(link(label, href)); guide.append(p);
    }
    body.append(guide);
    document.body.classList.add('orientation-has-context');
  }
  function clearPreviousOwner(next) {
    let changed = false;
    try {
      const previous = sessionStorage.getItem('orientation.context.owner');
      if (previous && previous !== String(next || '')) {
        changed = true;
        sessionStorage.removeItem('orientation.portfolio.account.' + previous);
        for (const key of ['orientation.portfolio.v1', 'orientation.context-brief.v1', 'orientation.context-try.v1']) sessionStorage.removeItem(key);
      }
      if (next) sessionStorage.setItem('orientation.context.owner', String(next));
      else sessionStorage.removeItem('orientation.context.owner');
    } catch { /* Storage can be blocked; private server reads remain owner checked. */ }
    return changed;
  }
  async function refresh({ freshOnly = false } = {}) {
    const request = ++sequence;
    try {
      const response = await fetch(endpoint, { credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(8000) });
      if (request !== sequence) return freshOnly ? null : account;
      let next = null;
      if (response.status === 401 || response.status === 403) next = null;
      else if (response.ok) {
        const data = await response.json();
        if (request !== sequence) return freshOnly ? null : account;
        if (!Number.isInteger(data.userid) || !data.portfolio || typeof data.sesskey !== 'string') throw Error('Unavailable');
        next = data;
      } else throw Error('Unavailable');
      if (request !== sequence) return freshOnly ? null : account;
      const previous = account?.userid;
      account = next;
      const previousOwnerChanged = clearPreviousOwner(account?.userid);
      if ((checked && previous !== account?.userid) || (!checked && previousOwnerChanged)) window.dispatchEvent(new CustomEvent('orientation:account-changed', { detail: account }));
      checked = true;
      render();
    } catch {
      if (request !== sequence) return freshOnly ? null : account;
      render('Saved context is unavailable right now. Keep your draft and try the workspace link.');
      if (freshOnly) return null;
    }
    return account;
  }
  async function write(data, expecteduserid) {
    if (!account) throw Object.assign(Error('Sign in to save to Moodle.'), { status: 401 });
    if (!Number.isInteger(expecteduserid) || account.userid !== expecteduserid) throw Object.assign(Error('Account changed. Reopen My context.'), { status: 403 });
    const response = await fetch(endpoint, { method: 'POST', credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, expecteduserid, sesskey: account.sesskey }) });
    const result = await response.json();
    if (!response.ok) throw Object.assign(Error(result.error || 'Changes were not saved. Keep your draft and try again.'), { status: response.status });
    if (account?.userid !== expecteduserid) throw Error('Account changed. Reopen My context.');
    return result;
  }
  render();
  const ready = refresh();
  window.OrientationContext = { ready, current: () => account, refresh, write };
  window.addEventListener('focus', refresh);
  window.addEventListener('pageshow', event => { if (event.persisted) refresh(); });
  window.addEventListener('pagehide', () => {
    if (panel) panel.querySelector('[data-context-panel-body]').replaceChildren(link('Open My context', home));
  });

  // A page's drafts and save controls belong to the sign-in that opened it.
  for (const [selector, outputSelector, key, title, storageKey] of [
    ['.context-brief', '[data-output="brief"]', 'brief', 'My context brief', 'orientation.context-brief.v1'],
    ['.context-trial', '[data-try-report]', 'trial', 'My private try/check record', 'orientation.context-try.v1'],
  ]) {
    const widget = document.querySelector(selector);
    if (!widget) continue;
    let invalidated = false;
    function clearWidget() {
      for (const input of widget.querySelectorAll('textarea,input')) input.value = '';
      for (const control of widget.querySelectorAll('button,textarea,input,select')) control.disabled = true;
      for (const prompt of widget.querySelectorAll('[data-confirm],[data-try-confirm]')) prompt.hidden = true;
      const status = widget.querySelector('[role="status"]');
      if (status) status.textContent = 'Your sign-in changed. Reopen this page to continue with the right account.';
      try { sessionStorage.removeItem(storageKey); } catch { /* Visible words still clear. */ }
    }
    window.addEventListener('orientation:account-changed', () => { invalidated = true; clearWidget(); });
    // Existing widget lifecycle handlers may render again on a restored page.
    for (const eventName of ['pageshow', 'orientation:brief-changed']) window.addEventListener(eventName, () => {
      if (invalidated) queueMicrotask(clearWidget);
    });
    for (const eventName of ['click', 'input', 'change']) widget.addEventListener(eventName, event => {
      if (invalidated) { event.preventDefault(); event.stopImmediatePropagation(); clearWidget(); }
    }, true);
    ready.then(() => {
      const output = widget.querySelector(outputSelector);
      if (!output || !account || invalidated) return;
      const owner = account.userid;
      const button = document.createElement('button'); button.type = 'button'; button.textContent = 'Save to My context'; button.className = 'context-save';
      const status = document.createElement('p'); status.setAttribute('role', 'status');
      const saved = (account.items || []).find(item => item.itemkey === key);
      let revision = Number(saved?.revision || 0);
      let expecteditemid = Number(saved?.id || 0);
      output.after(button, status);
      button.addEventListener('click', async () => {
        if (invalidated || account?.userid !== owner) { invalidated = true; clearWidget(); return; }
        if (!output.value.trim()) { status.textContent = 'Write some text first.'; return; }
        button.disabled = true;
        try {
          const result = await write({ op: 'save-note', key, revision, expecteditemid, title, body: output.value, source: 'useful-context' }, owner);
          if (invalidated) return;
          revision = Number(result.item.revision); expecteditemid = Number(result.item.id);
          status.textContent = 'Saved to Moodle. Open My context to edit, copy or return to this activity.'; await refresh();
        } catch (error) { if (!invalidated) status.textContent = error.status === 409 ? 'A newer saved version exists. Copy these edits before opening My context.' : 'Changes were not saved. Your text is still here; keep a copy and try again.'; }
        finally { button.disabled = invalidated || account?.userid !== owner; }
      });
    });
  }

  const editor = document.querySelector('[data-context-editor]');
  if (editor) {
    const output = editor.querySelector('[data-context-copy-text]');
    const copy = editor.querySelector('[data-context-copy]');
    const status = editor.querySelector('[data-context-edit-status]');
    const documentName = editor.dataset.document;
    function preview() {
      const title = editor.querySelector('[data-context-title]').textContent;
      if (documentName === 'note') output.value = '# ' + editor.elements.title.value + '\n\n' + editor.elements.body.value + '\n';
      else {
        const parts = [...editor.querySelectorAll('[data-context-field]')].filter(input => input.value.trim()).map(input => '## ' + input.dataset.label + '\n' + input.value);
        const prefix = documentName === 'practice' ? '' : (editor.dataset.example === '1' ? 'Fictional practice example, authored for Human AI Orientation; edits may have been made.\n\n' : '') + 'Review status: draft — review before sharing.\n\n';
        output.value = parts.length ? prefix + '# ' + title + '\n\n' + parts.join('\n\n') + '\n' : '';
      }
      status.textContent = 'Unsaved changes. Copying or downloading does not save them to Moodle.';
    }
    editor.addEventListener('input', preview);
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      const message = editor.querySelector('[data-context-copy-status]');
      if (!output.value.trim()) { message.textContent = 'Write some context first.'; return; }
      try { await navigator.clipboard.writeText(output.value); message.textContent = 'Copied. Paste it into your AI conversation or notes.'; }
      catch { output.focus(); output.select(); message.textContent = 'Text selected. Use your device’s Copy command.'; }
    });
    window.addEventListener('orientation:account-changed', () => {
      for (const input of editor.querySelectorAll('textarea,input:not([type="hidden"])')) input.value = '';
      for (const control of editor.querySelectorAll('button,textarea,input')) control.disabled = true;
      status.textContent = 'Your sign-in changed. Reopen My context to continue with the right account.';
    });
  }
})();
