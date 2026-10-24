(() => {
  'use strict';
  if (window.OrientationBrief) return;
  const root = document.querySelector('.context-brief');
  const fields = ['task', 'reason', 'audience', 'background', 'boundary', 'success'];
  const reflections = ['included', 'omitted', 'prediction'];
  const all = [...fields, ...reflections];
  const labels = ['I would like help with', 'It matters because', 'The result is for', 'Useful background', 'Please respect', 'A useful result would'];
  const examples = [
    { name: 'A neighbourhood gathering', values: [
      'Draft a short invitation to a small community gathering.',
      'I want neighbours to feel welcome.', 'Neighbours who may not know each other yet.',
      'The date and venue are undecided. The invitation should be warm and easy to read.',
      'Use [date] and [venue] placeholders. Do not invent arrangements or send the invitation.',
      'Be about 80 words, explain the purpose and clearly show the missing details.',
    ], notes: ['Fictional example: I included that the date and venue are undecided, so the draft should use placeholders.', 'Fictional example: I left out the organiser’s home address because it is private and unnecessary for this draft.', 'Fictional example: I expect placeholders for the date and venue instead of invented arrangements.'] },
    { name: 'A manageable study session', values: [
      'Make a short plan for reviewing my beginner Spanish notes.',
      'I want a manageable next step before my next class.', 'Me, studying on my own.',
      'I have 20 minutes and want to practise greetings and numbers from my own notes.',
      'Keep the plan within 20 minutes. Do not assume you can see my notes.',
      'Give three small steps with timings that add up to 20 minutes.',
    ], notes: ['Fictional example: I included the 20-minute limit so the plan can fit the time available.', 'Fictional example: I left out my full weekly calendar because this task only needs the time available now.', 'Fictional example: I expect three manageable steps whose timings add up to 20 minutes.'] },
    { name: 'Organising a craft project', values: [
      'Draft a preparation checklist for making a paper birthday card.',
      'I want to use what I already have and get started easily.', 'Me, trying a simple craft activity.',
      'I have paper, pencils and glue. I have about half an hour.',
      'Use only those materials. Do not suggest purchases or assume I own other supplies.',
      'Give a short checklist and one simple design using the materials listed.',
    ], notes: ['Fictional example: I listed the materials so the suggestions can use what is available.', 'Fictional example: I left out the recipient’s personal details because a practice checklist does not need them.', 'Fictional example: I expect a design using paper, pencils and glue, without a shopping list.'] },
  ];
  const storageKey = 'orientation.context-brief.v1';
  function valid(saved) {
    return saved && Array.isArray(saved.values) && saved.values.length === all.length && saved.values.every(value => typeof value === 'string');
  }
  function readDraft() {
    if (root?.dataset.ready) return { example, values: all.map(key => input(key).value) };
    try { const saved = JSON.parse(sessionStorage.getItem(storageKey)); return valid(saved) ? saved : null; }
    catch { return null; }
  }
  function formatDraft(saved) {
    if (!valid(saved)) return { prompt: '', success: '', prediction: '' };
    const lines = fields.flatMap((key, i) => saved.values[i].trim() ? [`${labels[i]}: ${saved.values[i].trim()}`] : []);
    if (lines.length) {
      if (Number.isInteger(saved.example) && examples[saved.example]) lines.unshift(`Fictional practice scenario: ${examples[saved.example].name}`, '');
      lines.push('If an important detail is missing, ask me instead of guessing.');
    }
    return { prompt: lines.join('\n'), success: saved.values[5], prediction: saved.values[8] };
  }
  window.OrientationBrief = { read: () => formatDraft(readDraft()) };
  if (!root || root.dataset.ready) return;
  root.dataset.ready = 'true';
  const input = key => root.querySelector(`[data-field="${key}"]`);
  const action = key => root.querySelector(`[data-action="${key}"]`);
  const status = root.querySelector('[role="status"]');
  const output = root.querySelector('[data-output="brief"]');
  const notes = root.querySelector('[data-output="notes"]');
  const provenance = root.querySelector('[data-provenance]');
  const confirmBox = root.querySelector('[data-confirm]');
  let example = -1;
  let pending = null;
  let storageWorks = true;
  function render() {
    output.value = formatDraft({ example, values: all.map(key => input(key).value) }).prompt;
    notes.value = reflections.flatMap((key, i) => input(key).value.trim() ? [`${['Included and why', 'Left out and why', 'My prediction'][i]}: ${input(key).value.trim()}`] : []).join('\n\n');
    action('copy').disabled = !output.value;
    action('copy-notes').disabled = !notes.value;
    provenance.textContent = example >= 0 ? `Fictional example: ${examples[example].name}. Edit it to explore how the brief works.` : 'Your own draft. You can leave a row blank and return to it.';
    window.dispatchEvent(new Event('orientation:brief-changed'));
  }
  function save() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ example, values: all.map(key => input(key).value) })); }
    catch {
      storageWorks = false;
      root.querySelector('[data-storage]').textContent = 'Your browser cannot keep a temporary draft. Copy your work before leaving, or choose Save to My context when signed in. Typing alone does not save it to Moodle.';
    }
  }
  function closePrompt() { confirmBox.hidden = true; pending = null; }
  function chooseExample() {
    const choices = examples.map((_, i) => i).filter(i => i !== example);
    example = choices[Math.floor(Math.random() * choices.length)];
    fields.forEach((key, i) => { input(key).value = examples[example].values[i]; });
    reflections.forEach(key => { input(key).value = ''; });
    render(); save(); closePrompt();
    status.textContent = 'Fictional brief filled in. Edit any row or copy it to try the activity. Reflection examples are available below.';
  }
  function clear() {
    all.forEach(key => { input(key).value = ''; }); example = -1;
    try { sessionStorage.removeItem(storageKey); } catch { /* The page still clears without storage. */ }
    render(); closePrompt(); status.textContent = 'Draft and learning notes cleared from this tab.'; input('task').focus();
  }
  function request(actionName) {
    if (!all.some(key => input(key).value.trim())) { actionName === 'example' ? chooseExample() : clear(); return; }
    pending = actionName;
    confirmBox.hidden = false;
    root.querySelector('[data-confirm-text]').textContent = actionName === 'example' ? 'Replace your brief and learning notes with a new fictional scenario? Copy anything you want to keep first.' : 'Clear your brief and learning notes from this tab? Copy anything you want to keep first.';
    action('confirm').focus();
  }
  async function copy(source, message) {
    if (!source.value) return;
    try { await navigator.clipboard.writeText(source.value); status.textContent = message; }
    catch {
      const details = source.closest('details');
      if (details) details.open = true;
      source.focus(); source.select(); status.textContent = 'Automatic copying is unavailable. The text is selected; use your device’s Copy command.';
    }
  }
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey));
    if (saved && Array.isArray(saved.values) && saved.values.length === all.length && saved.values.every(value => typeof value === 'string')) {
      all.forEach((key, i) => { input(key).value = saved.values[i]; });
      example = Number.isInteger(saved.example) && saved.example >= 0 && saved.example < examples.length ? saved.example : -1;
      status.textContent = 'Your temporary draft was restored in this tab.';
    }
  } catch { storageWorks = false; }
  for (const key of all) input(key).addEventListener('input', () => { closePrompt(); render(); save(); });
  action('example').addEventListener('click', () => request('example'));
  action('clear').addEventListener('click', () => request('clear'));
  action('confirm').addEventListener('click', () => { pending === 'example' ? chooseExample() : clear(); });
  action('cancel').addEventListener('click', () => { closePrompt(); status.textContent = 'Your entries have been kept.'; action('example').focus(); });
  action('copy').addEventListener('click', () => copy(output, 'Context brief copied. Paste it into your AI chat. Your learning notes were not included.'));
  action('copy-notes').addEventListener('click', () => copy(notes, 'Learning notes copied. Keep these in your own notes.'));
  for (const button of root.querySelectorAll('[data-example-note]')) {
    button.addEventListener('click', () => {
      const key = button.dataset.exampleNote;
      if (input(key).value.trim()) { status.textContent = 'Your response is already filled in. Clear that field first if you want to replace it with an example.'; input(key).focus(); return; }
      const source = examples[example >= 0 ? example : 0];
      input(key).value = source.notes[reflections.indexOf(key)];
      render(); save(); status.textContent = `Example response added from “${source.name}”. Change it if useful; it may describe a different task from yours.`;
    });
  }
  root.querySelector('[data-enhanced]').hidden = false;
  root.querySelector('[data-fallback]').hidden = true;
  if (!storageWorks) root.querySelector('[data-storage]').textContent = 'Temporary storage is unavailable. Copy your work before leaving or reloading. Nothing you type here is submitted to the course.';
  render();
})();
