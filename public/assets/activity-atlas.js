/* Selection is temporary. The source HTML contains every activity and destination. */
(() => {
  for (const root of document.querySelectorAll('[data-activity-atlas]')) {
    const controls = root.querySelector('[data-atlas-controls]');
    const choices = [...root.querySelectorAll('[data-atlas-choice]')];
    const panels = [...root.querySelectorAll('[data-atlas-detail]')];
    const announcement = root.querySelector('[data-atlas-announcement]');
    function select(slug, announce = false) {
      const selected = panels.find(panel => panel.dataset.atlasDetail === slug);
      if (!selected) return;
      for (const panel of panels) {
        panel.hidden = panel !== selected;
        if (panel !== selected) panel.querySelector('details').open = false;
      }
      for (const button of choices) button.setAttribute('aria-pressed', String(button.dataset.atlasChoice === slug));
      if (announce) {
        announcement.textContent = `Showing: ${selected.querySelector('h3').textContent}. Activity details follow the choices.`;
        selected.scrollIntoView({ block: 'nearest', behavior: 'auto' });
      }
    }
    for (const button of choices) button.addEventListener('click', () => select(button.dataset.atlasChoice, true));
    root.querySelector('[data-atlas-start]').addEventListener('click', () => select('first-task', true));
    select('first-task');
    controls.hidden = false;
  }
})();
