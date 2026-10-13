(() => {
  'use strict';
  document.querySelectorAll('.input-practice').forEach(root => {
    if (root.dataset.ready) return;
    root.dataset.ready = 'true';
    const status = root.querySelector('[data-input-status]');
    root.querySelectorAll('[data-copy-input]').forEach(button => {
      button.hidden = false;
      const field = button.parentElement.querySelector('textarea');
      field.addEventListener('input', () => { button.disabled = !field.value.trim(); });
      button.addEventListener('click', async () => {
        if (!field.value.trim()) return;
        try {
          await navigator.clipboard.writeText(field.value);
          status.textContent = 'Instruction copied. Paste it into your AI app, or use it as a guide while speaking.';
        } catch {
          field.focus(); field.select();
          status.textContent = 'Automatic copying is unavailable. The instruction is selected; use your device’s Copy command.';
        }
      });
    });
  });
})();
