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
        const frame = dialog.querySelector('iframe');
        const close = dialog.querySelector('button');
        const fallback = dialog.querySelector('.of-full-page');
        let opener = null;
        const open = link => {
            const target = new URL(link.href);
            if (target.origin !== location.origin || target.pathname !== '/local/orientationfeedback/index.php') return;
            opener = link;
            fallback.href = target.href;
            // Preserve the loaded form, audio and unsent note when the panel is reopened.
            if (!frame.hasAttribute('src')) {
                target.searchParams.set('embedded', '1');
                frame.src = target.href;
            }
            if (!dialog.open) dialog.showModal();
            opener.setAttribute('aria-expanded', 'true');
            close.focus();
        };
        const shut = () => { if (dialog.open) dialog.close(); };
        close.addEventListener('click', shut);
        dialog.addEventListener('close', () => {
            frame.contentWindow?.postMessage({ type: 'orientation-feedback-close' }, location.origin);
            opener?.setAttribute('aria-expanded', 'false');
            opener?.focus();
            if (location.hash === '#feedback') history.replaceState(history.state, '', location.pathname + location.search);
        });
        dialog.addEventListener('click', event => {
            if (event.target !== dialog) return;
            const rect = dialog.getBoundingClientRect();
            if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) shut();
        });
        frame.addEventListener('load', () => { dialog.querySelector('.of-loading').hidden = true; });
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
