(() => {
  'use strict';
  document.querySelectorAll('.finlay-writing-surface').forEach(root => {
    if (root.dataset.finlayReady) return;
    root.dataset.finlayReady = 'true';
    const panel = root.querySelector('.finlay-tips');
    if (!panel) return;
    const voice = panel.querySelector('.finlay-voice-guide');
    const fields = root.hasAttribute('data-finlay-native-essay')
      ? root.closest('form')?.querySelectorAll('textarea[name="answer_editor[text]"]') || []
      : root.querySelectorAll('textarea:not([readonly]):not([disabled])');
    fields.forEach((field, index) => {
      const hint = document.createElement('p');
      hint.className = 'finlay-field-hint';
      hint.id = `${panel.id}-field-${index}`;
      hint.append('Finlay’s tip: speak your answer, then read it back. ');
      const link = document.createElement('a');
      link.href = `#${voice.id}`;
      link.textContent = 'Voice typing help';
      hint.append(link);
      field.after(hint);
      field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), hint.id].filter(Boolean).join(' '));
      field.addEventListener('focus', () => {
        const label = field.labels?.[0];
        const text = label ? [...label.childNodes].filter(node => node.nodeType === Node.TEXT_NODE).map(node => node.textContent).join('').trim() : '';
        panel.querySelector('[data-finlay-current]').textContent = text ? `Writing: ${text}` : 'Speak a sentence or two, then check the words.';
      });
      link.addEventListener('click', () => {
        voice.querySelector('details').open = true;
        voice.focus({ preventScroll: true });
      });
    });
    panel.querySelectorAll('[data-finlay-copy]').forEach(button => {
      const source = panel.querySelector(`[id="${button.dataset.finlayCopy}"]`);
      if (!source) return;
      button.hidden = false;
      button.addEventListener('click', async () => {
        const status = panel.querySelector('[data-finlay-copy-status]');
        try {
          await navigator.clipboard.writeText(source.textContent);
          status.textContent = 'Prompt copied. Paste it into your AI, then add only the context you choose.';
        } catch {
          source.focus();
          const range = document.createRange();
          range.selectNodeContents(source);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          status.textContent = 'Automatic copying is unavailable. The prompt is selected; use your device’s Copy command.';
        }
      });
    });
  });
})();
