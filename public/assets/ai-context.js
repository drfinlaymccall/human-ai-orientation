for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const source = document.getElementById(button.dataset.copy);
    const text = source.value ?? source.textContent;
    const status = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = 'Copied. Paste it into your chosen AI chat.';
    } catch {
      if (source.select) source.select();
      else {
        const range = document.createRange();
        range.selectNodeContents(source);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
      status.textContent = 'Automatic copying is unavailable. The text is selected: use your device’s Copy command.';
    }
  });
}
