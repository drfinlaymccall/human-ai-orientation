/* The same launcher serves public pages and Moodle; feedback is loaded only on request. */
(() => {
    'use strict';
    const start = () => {
        const links = [...document.querySelectorAll('[data-feedback-launcher]')];
        if (!links.length || document.querySelector('[data-feedback-dialog]') || !window.HTMLDialogElement) return;
        const sources = ['home', 'journey', 'before-you-start', 'notes', 'free-tools', 'first-task',
            'preview', 'portfolio', 'check-and-continue', 'deeper-courses', 'help', 'privacy', 'glossary'];
        const source = location.pathname === '/' ? 'home' : location.pathname.replace(/^\//, '').replace(/\.html$/, '');
        for (const link of links) {
            const url = new URL(link.href, location.href);
            if (url.origin !== location.origin || url.pathname !== '/local/orientationfeedback/index.php') continue;
            if (!url.searchParams.has('source') && sources.includes(source)) url.searchParams.set('source', source);
            link.href = url.href;
            link.classList.add('of-trigger');
            link.setAttribute('aria-haspopup', 'dialog');
        }
        const dialog = document.createElement('dialog');
        dialog.dataset.feedbackDialog = '';
        dialog.className = 'of-dialog';
        dialog.setAttribute('aria-labelledby', 'of-title');
        dialog.innerHTML = '<header class="of-header"><div><h2 id="of-title">Give feedback</h2><p>Help Finlay improve the course</p></div><button type="button" class="of-close" aria-label="Close feedback">×</button></header><p class="of-loading" role="status">Opening feedback…</p><iframe title="Private feedback to Finlay" allow="microphone" referrerpolicy="no-referrer"></iframe><div class="of-footer"><a class="of-full-page">Open feedback as a page</a></div>';
        document.body.append(dialog);
        let frame = dialog.querySelector('iframe');
        const close = dialog.querySelector('button');
        const fallback = dialog.querySelector('.of-full-page');
        const loading = dialog.querySelector('.of-loading');
        let opener = null;
        let target = null;
        let owner;
        let sequence = 0;
        let verified = false;
        let loaded = false;
        const hideFrame = () => {
            verified = false;
            frame.hidden = true;
            // The launcher stylesheet sets display:block on iframes; hide their content explicitly.
            frame.style.visibility = 'hidden';
            frame.contentWindow?.postMessage({ type: 'orientation-feedback-close' }, location.origin);
        };
        const reveal = () => {
            if (!verified || !loaded || !dialog.open) return;
            frame.hidden = false;
            frame.style.visibility = '';
            loading.hidden = true;
        };
        const listenForLoad = () => frame.addEventListener('load', event => {
            if (event.currentTarget !== frame) return;
            loaded = true;
            reveal();
        });
        const resetFrame = () => {
            hideFrame();
            const replacement = frame.cloneNode(false);
            replacement.removeAttribute('src');
            frame.replaceWith(replacement);
            frame = replacement;
            owner = undefined;
            loaded = false;
            listenForLoad();
        };
        const checkOwner = async () => {
            if (!dialog.open && !frame.hasAttribute('src')) return;
            const request = ++sequence;
            hideFrame();
            loading.textContent = 'Checking your sign-in…';
            loading.hidden = false;
            try {
                const response = await fetch('/local/orientationfeedback/session.php', {
                    credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(8000),
                });
                if (request !== sequence) return;
                if (!response.ok) throw Error('Unavailable');
                const data = await response.json();
                if (request !== sequence) return;
                if (data.owner !== null && (typeof data.owner !== 'string' || !/^[a-f0-9]{64}$/.test(data.owner))) throw Error('Unavailable');
                // A signed-out form is never cached, and a changed owner loses all old frame state.
                if (data.owner === null || owner !== data.owner) resetFrame();
                owner = data.owner;
                verified = true;
                if (dialog.open && !frame.hasAttribute('src')) {
                    const embedded = new URL(target.href);
                    embedded.searchParams.set('embedded', '1');
                    loaded = false;
                    loading.textContent = 'Opening feedback…';
                    frame.src = embedded.href;
                }
                reveal();
            } catch {
                if (request !== sequence) return;
                resetFrame();
                loading.textContent = 'Could not check your sign-in. Try reopening feedback, or open it as a page.';
                loading.hidden = false;
            }
        };
        hideFrame();
        listenForLoad();
        const open = link => {
            const destination = new URL(link.href);
            if (destination.origin !== location.origin || destination.pathname !== '/local/orientationfeedback/index.php') return;
            target = destination;
            opener = link;
            fallback.href = target.href;
            // Preserve same-owner audio and drafts only after checking the current native session.
            hideFrame();
            if (!dialog.open) dialog.showModal();
            opener.setAttribute('aria-expanded', 'true');
            close.focus();
            checkOwner();
        };
        const shut = () => { if (dialog.open) dialog.close(); };
        close.addEventListener('click', shut);
        dialog.addEventListener('close', () => {
            ++sequence;
            hideFrame();
            opener?.setAttribute('aria-expanded', 'false');
            opener?.focus();
            if (location.hash === '#feedback') history.replaceState(history.state, '', location.pathname + location.search);
        });
        dialog.addEventListener('click', event => {
            if (event.target !== dialog) return;
            const rect = dialog.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) shut();
        });
        window.addEventListener('focus', checkOwner);
        window.addEventListener('pageshow', checkOwner);
        window.addEventListener('orientation:account-changed', checkOwner);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') { ++sequence; hideFrame(); }
            else checkOwner();
        });
        window.addEventListener('pagehide', () => { ++sequence; hideFrame(); });
        window.addEventListener('message', event => {
            if (event.origin !== location.origin || event.source !== frame.contentWindow ||
                    event.data?.type !== 'orientation-feedback-signin') return;
            const login = new URL('/local/orientationfeedback/signin.php', location.origin);
            if (sources.includes(source)) login.searchParams.set('source', source);
            location.assign(login.href);
        });
        for (const link of links) link.addEventListener('click', event => {
            if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault(); open(link);
        });
        if (location.hash === '#feedback') open(links[0]);
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
