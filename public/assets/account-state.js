/* Observational only: no names, identifiers, progress, browser storage or writes. */
(() => {
  const journey = '/local/orientation/index.php';
  const links = [...document.querySelectorAll('[data-account-link]')];
  const primary = [...document.querySelectorAll('[data-journey-primary]')];
  const labels = [...document.querySelectorAll('[data-account-state]')];
  let requestNumber = 0;
  function show(state) {
    for (const link of links) {
      link.href = journey;
      link.textContent = state === 'signed-in' ? 'Your course journey' : state === 'signed-out' ? 'Sign in' : 'Check sign-in / Your course journey';
    }
    for (const link of primary) {
      link.href = state === 'signed-in' ? journey : '/journey';
      link.textContent = state === 'signed-in' ? 'Your course journey' : 'Explore your course';
    }
    let message = 'Sign-in state unavailable. Check sign-in / Your course journey, or explore the public activities.';
    if (state === 'signed-in') message = 'Signed in';
    else if (state === 'signed-out') message = 'Signed out';
    else if (state === 'checking') message = 'Checking sign-in… Public activities are available.';
    for (const label of labels) label.textContent = message;
  }
  async function revalidate() {
    const current = ++requestNumber;
    show('checking');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
      const response = await fetch('/local/orientation/state.php', {
        method: 'GET', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Accept': 'application/json', 'Cache-Control': 'no-store' },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('State unavailable');
      const data = await response.json();
      if (!['signed-in', 'signed-out'].includes(data.state) || data.journey_url !== journey) throw new Error('Invalid state');
      if (current === requestNumber) show(data.state);
    } catch {
      if (current === requestNumber) show('unavailable');
    } finally { clearTimeout(timeout); }
  }
  // Clear resolved state before leaving, then revalidate on back/forward or tab return.
  addEventListener('pagehide', () => { ++requestNumber; show('checking'); });
  addEventListener('pageshow', revalidate);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') revalidate(); });
})();
