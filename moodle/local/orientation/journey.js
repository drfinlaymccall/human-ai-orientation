// Clear private content before background/history snapshots; a return revalidates the native account.
(() => {
  const journey = document.querySelector('[data-private-journey]');
  let backgrounded = false;
  const conceal = () => { if (journey) journey.hidden = true; };
  window.addEventListener('pagehide', conceal);
  window.addEventListener('pageshow', event => {
    if (event.persisted) window.location.reload();
    else if (journey) journey.hidden = false;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      backgrounded = true;
      conceal();
    } else if (backgrounded) {
      // A boolean session probe cannot distinguish one signed-in account from another.
      window.location.reload();
    }
  });
})();
