/* All descriptions and links start in HTML; selection is temporary and never saved. */
(() => {
  for (const root of document.querySelectorAll('[data-activity-atlas]')) {
    const controls = root.querySelector('[data-atlas-controls]');
    const choices = [...root.querySelectorAll('[data-atlas-choice]')];
    const panels = [...root.querySelectorAll('[data-atlas-detail]')];
    const panelHome = root.querySelector('.atlas-panels');
    const announcement = root.querySelector('[data-atlas-announcement]');
    if (!controls || !panelHome || !choices.length || !panels.length) continue;
    const narrow = matchMedia('(max-width: 1000px)');
    const starter = choices.find(button => button.dataset.atlasChoice === 'first-task');
    const first = starter || choices[0];
    const suggestion = root.querySelector('.atlas-suggestion');
    if (!starter && suggestion) suggestion.hidden = true;
    let slug = first.dataset.atlasChoice;
    function placeSelected() {
      for (const panel of panels) panelHome.append(panel);
      const selected = panels.find(panel => panel.dataset.atlasDetail === slug);
      const button = choices.find(button => button.dataset.atlasChoice === slug);
      if (narrow.matches && selected && button) button.parentElement.after(selected);
    }
    function select(next, announce = false) {
      const selected = panels.find(panel => panel.dataset.atlasDetail === next);
      if (!selected) return;
      slug = next;
      for (const panel of panels) {
        panel.hidden = panel !== selected;
        const check = panel.querySelector('details');
        if (panel !== selected && check) check.open = false;
      }
      for (const button of choices) button.setAttribute('aria-pressed', String(button.dataset.atlasChoice === slug));
      placeSelected();
      if (announce) {
        const action = selected.querySelector('a.button');
        if (announcement) announcement.textContent = `Showing: ${selected.querySelector('h3')?.textContent || slug}. ${action ? 'Open this activity is in the selected details.' : 'See the selected activity details.'}`;
        // Preserve the chosen button's focus; keep the title and action in view.
        if ((action && action.getBoundingClientRect().bottom > innerHeight) || selected.getBoundingClientRect().top < 0) {
          const button = choices.find(choice => choice.dataset.atlasChoice === slug);
          (narrow.matches && button ? button : selected).scrollIntoView({ block: 'start', behavior: 'auto' });
        }
      }
    }
    for (const button of choices) {
      button.addEventListener('click', () => select(button.dataset.atlasChoice, true));
    }
    root.querySelector('[data-atlas-start]')?.addEventListener('click', () => select(first.dataset.atlasChoice, true));
    narrow.addEventListener('change', placeSelected);
    root.classList.add('atlas-enhanced');
    controls.hidden = false;
    function selectHash() {
      const target = location.hash.slice(1);
      const panel = panels.find(item => item.id === target);
      if (panel) { select(panel.dataset.atlasDetail); panel.scrollIntoView({block: 'start'}); }
      return Boolean(panel);
    }
    addEventListener('hashchange', selectHash);
    if (!selectHash()) select(first.dataset.atlasChoice);
  }
})();
