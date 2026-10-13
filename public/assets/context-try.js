(() => {
  'use strict';
  const root = document.querySelector('.context-trial');
  if (!root || root.dataset.ready || !window.OrientationBrief) return;
  root.dataset.ready = 'true';
  const keys = ['prompt', 'success', 'prediction', 'response', 'observation', 'correction', 'revised'];
  const storageKey = 'orientation.context-try.v1';
  const field = key => root.querySelector(`[data-try-field="${key}"]`);
  const button = key => root.querySelector(`[data-try-action="${key}"]`);
  const status = root.querySelector('[role="status"]');
  const confirmBox = root.querySelector('[data-try-confirm]');
  let source = '';
  let edited = false;
  let pending = null;
  let restored = false;
  function latest() { return window.OrientationBrief.read(); }
  function signature(bundle) { return JSON.stringify(bundle); }
  function render() {
    const bundle = latest();
    button('copy-prompt').disabled = !field('prompt').value.trim();
    button('copy-correction').disabled = !field('correction').value.trim();
    button('latest').disabled = !bundle.prompt;
    root.querySelector('[data-try-missing]').hidden = !!field('prompt').value.trim();
    root.querySelector('[data-try-changed]').hidden = !source || source === signature(bundle);
    const report = keys.filter(key => field(key).value.trim()).map(key => `${{
      prompt: 'Brief I tried', success: 'My success criterion', prediction: 'My prediction',
      response: 'AI response (unverified)', observation: 'What I noticed',
      correction: 'Correction or follow-up', revised: 'What I kept or changed after trying again',
    }[key]}\n${field(key).value.trim()}`).join('\n\n');
    root.querySelector('[data-try-report]').value = report;
    button('copy-record').disabled = !report;
  }
  function save() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ source, edited, values: keys.map(key => field(key).value) })); }
    catch { root.querySelector('[data-try-storage]').textContent = 'Temporary storage is unavailable. Copy your work before leaving or reloading. These fields are not submitted to the course.'; }
  }
  function importLatest() {
    const bundle = latest();
    keys.forEach(key => { field(key).value = bundle[key] || ''; });
    source = signature(bundle); edited = false;
    render();
  }
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved && typeof saved.source === 'string' && Array.isArray(saved.values) && saved.values.length === keys.length && saved.values.every(v => typeof v === 'string')) {
      keys.forEach((key, i) => { field(key).value = saved.values[i]; });
      source = saved.source; edited = !!saved.edited; restored = true;
    }
  } catch { root.querySelector('[data-try-storage]').textContent = 'Temporary storage is unavailable. Paste your brief and prediction below if needed, and copy your work before leaving.'; }
  if (!restored) importLatest();
  // Unedited carried fields follow the builder; a started trial retains its original comparison.
  function refresh() {
    if (!edited) { importLatest(); save(); }
    else render();
  }
  window.addEventListener('orientation:brief-changed', refresh);
  window.addEventListener('pageshow', refresh);
  function closePrompt() { pending = null; confirmBox.hidden = true; }
  for (const key of keys) field(key).addEventListener('input', () => { edited = true; closePrompt(); render(); save(); });
  async function copy(textarea, message) {
    if (!textarea.value.trim()) return;
    try { await navigator.clipboard.writeText(textarea.value); status.textContent = message; }
    catch {
      const details = textarea.closest('details'); if (details) details.open = true;
      textarea.focus(); textarea.select(); status.textContent = 'Automatic copying is unavailable. The text is selected; use your device’s Copy command.';
    }
  }
  button('copy-prompt').addEventListener('click', () => copy(field('prompt'), 'Brief copied. Paste it into your AI chat. Your prediction and checking notes were not included.'));
  button('copy-correction').addEventListener('click', () => copy(field('correction'), 'Follow-up copied. Paste it into the same AI conversation, then return to check the new answer.'));
  button('copy-record').addEventListener('click', () => copy(root.querySelector('[data-try-report]'), 'Practice record copied. Keep it in your own notes.'));
  function perform(action) {
    importLatest(); closePrompt();
    if (action === 'clear') {
      try { sessionStorage.removeItem(storageKey); } catch { /* Visible fields still clear. */ }
      status.textContent = 'This try’s response and checking notes are cleared. Your earlier brief is still available.';
    } else { save(); status.textContent = 'Latest brief and prediction brought across. Ready for a new try.'; }
  }
  for (const action of ['latest', 'clear']) button(action).addEventListener('click', () => {
    if (!edited) { perform(action); return; }
    pending = action; confirmBox.hidden = false;
    root.querySelector('[data-try-confirm-text]').textContent = 'Start again with your latest brief? This clears the response and notes for this try. Copy your practice record first if you want to keep it.';
    button('confirm').focus();
  });
  button('confirm').addEventListener('click', () => perform(pending));
  button('cancel').addEventListener('click', () => { closePrompt(); status.textContent = 'Your current try has been kept.'; button('latest').focus(); });
  button('example-correction').addEventListener('click', () => {
    if (field('correction').value.trim()) { status.textContent = 'Your follow-up is already filled in. Clear that field first if you want an example.'; return; }
    field('correction').value = 'Please check your answer against this requirement: ' + (field('success').value.trim() || '[describe what a useful result should do]') + '\nRevise anything that does not meet it. If information is missing, ask me rather than inventing details.';
    edited = true; render(); save(); status.textContent = 'A follow-up starter is ready. Edit it to match what you actually noticed.';
  });
  root.querySelector('[data-try-enhanced]').hidden = false;
  root.querySelector('[data-try-fallback]').hidden = true;
  render();
})();
