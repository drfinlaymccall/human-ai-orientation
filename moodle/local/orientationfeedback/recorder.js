/* Audio stays in this page's memory until the learner explicitly sends the form. */
(() => {
    'use strict';
    const start = () => document.querySelectorAll('form[data-voice-feedback]').forEach(enhance);

    function enhance(form) {
        if (form.dataset.voiceReady) return;
        form.dataset.voiceReady = 'true';
        const find = name => form.querySelector(`[data-voice-${name}]`);
        const record = find('record'), stop = find('stop'), discard = find('discard');
        const playback = find('playback'), timer = find('timer'), status = find('status');
        const upload = form.querySelector('input[name="audio"]');
        const message = form.querySelector('[name="message"]');
        const send = form.querySelector('[type="submit"]');
        const limit = 10 * 1024 * 1024;
        const maxSeconds = 5 * 60;
        if (!record || !stop || !discard || !playback || !timer || !status || !upload || !message || !send) return;
        if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder || !window.fetch || !window.AbortController) {
            status.textContent = 'Recording is unavailable in this browser. You can write a message or choose an audio file below.';
            return; // Keep the ordinary multipart form working.
        }

        let state = 'idle', generation = 0, stream = null, recorder = null;
        let blob = null, objectURL = '', interval = null, timeout = null, started = 0;
        let leaving = false;
        const say = text => { status.textContent = text; };
        const tracksOff = () => { stream?.getTracks().forEach(track => track.stop()); stream = null; };
        const clearTimers = () => { clearInterval(interval); clearTimeout(timeout); interval = timeout = null; };
        const elapsed = () => {
            const seconds = Math.min(maxSeconds, Math.floor((Date.now() - started) / 1000));
            timer.textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
        };
        const render = () => {
            const busy = ['requesting', 'recording', 'stopping'].includes(state);
            record.hidden = busy;
            record.textContent = blob ? 'Record again' : 'Record';
            stop.hidden = state !== 'recording';
            discard.hidden = !busy && !blob;
            discard.disabled = state === 'stopping' || state === 'sending';
            record.disabled = state === 'sending';
            stop.disabled = state === 'sending';
            timer.hidden = !['recording', 'stopping', 'ready'].includes(state);
            playback.hidden = !blob;
            upload.disabled = busy || state === 'sending';
            send.disabled = busy || state === 'sending';
            form.setAttribute('aria-busy', state === 'sending' ? 'true' : 'false');
        };
        const clearAudio = () => {
            playback.pause();
            playback.removeAttribute('src');
            playback.load();
            if (objectURL) URL.revokeObjectURL(objectURL);
            objectURL = ''; blob = null;
            timer.textContent = '0:00';
        };
        const stopRecording = automatic => {
            if (state !== 'recording') return;
            elapsed();
            state = 'stopping';
            clearTimers();
            // Release the device immediately; onstop assembles the final recording asynchronously.
            if (recorder?.state !== 'inactive') recorder.stop();
            tracksOff();
            say(automatic ? 'Five-minute limit reached. Preparing your recording…' : 'Preparing your recording…');
            render();
        };
        const cancel = () => {
            generation++;
            const active = recorder; recorder = null;
            clearTimers();
            if (active && active.state !== 'inactive') active.stop();
            tracksOff(); clearAudio();
            state = 'idle'; render();
        };

        record.addEventListener('click', async () => {
            if (!['idle', 'ready'].includes(state)) return;
            clearAudio(); upload.value = '';
            state = 'requesting'; const request = ++generation;
            say('Allow microphone access to begin, or choose Discard recording to cancel.'); render();
            try {
                const granted = await navigator.mediaDevices.getUserMedia({ audio: true });
                if (request !== generation || state !== 'requesting') {
                    granted.getTracks().forEach(track => track.stop());
                    return;
                }
                stream = granted;
                const type = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4']
                    .find(mime => MediaRecorder.isTypeSupported?.(mime));
                const active = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
                recorder = active;
                const chunks = [];
                active.addEventListener('dataavailable', event => {
                    if (event.data.size) chunks.push(event.data);
                });
                active.addEventListener('stop', () => {
                    if (recorder !== active) return;
                    clearTimers(); tracksOff(); recorder = null;
                    const result = new Blob(chunks, { type: chunks[0]?.type || active.mimeType });
                    if (!result.size || result.size > limit) {
                        state = 'idle';
                        say(result.size ? 'The recording is larger than 10 MiB. Try a shorter recording or write a message.' :
                            'No audio was captured. Try recording again or write a message.');
                    } else {
                        blob = result; objectURL = URL.createObjectURL(blob);
                        playback.src = objectURL; state = 'ready';
                        say('Recording ready. Listen before sending, record again, or discard it. Nothing has been sent.');
                    }
                    render();
                });
                active.addEventListener('error', () => {
                    if (recorder !== active) return;
                    cancel(); say('Recording stopped because of a microphone error. Try again, write a message, or choose an audio file.');
                });
                active.start();
                state = 'recording'; started = Date.now(); elapsed();
                interval = setInterval(elapsed, 250);
                timeout = setTimeout(() => stopRecording(true), maxSeconds * 1000);
                say('Recording. Press Stop when you finish. Nothing is sent until you press Send.'); render();
            } catch (error) {
                if (request !== generation) return;
                cancel();
                say(error.name === 'NotAllowedError' || error.name === 'SecurityError' ?
                    'Microphone access was not allowed. You can allow it in your browser and try again, write a message, or choose an audio file.' :
                    'The microphone is unavailable. Try again, write a message, or choose an audio file.');
            }
        });
        stop.addEventListener('click', () => stopRecording(false));
        discard.addEventListener('click', () => { cancel(); say('Recording discarded. You can record again or write a message.'); record.focus(); });
        upload.addEventListener('change', () => {
            if (upload.files.length) {
                clearAudio(); state = 'idle'; render();
                say(upload.files[0].size > limit ? 'Choose an audio file no larger than 10 MiB.' :
                    'Audio file selected. It replaces any earlier recording. Nothing has been sent.');
            }
        });
        form.addEventListener('submit', async event => {
            event.preventDefault();
            if (state === 'sending') return;
            if (['requesting', 'recording', 'stopping'].includes(state)) {
                say('Stop or discard your recording before sending.'); return;
            }
            const file = upload.files[0];
            if ((file?.size || blob?.size || 0) > limit) { say('Audio must be no larger than 10 MiB. Choose a smaller file or a shorter recording.'); return; }
            if (!blob && !file?.size && !message.value.trim()) { say('Write a message, record audio, or choose an audio file before sending.'); message.focus(); return; }
            const data = new FormData(form);
            data.delete('audio'); // Native FormData includes an empty File when no file was chosen.
            if (blob) {
                const mime = blob.type.toLowerCase();
                const extension = mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : 'webm';
                data.set('audio', blob, `recording.${extension}`);
            } else if (file?.size) data.set('audio', file);
            const previous = [...form.elements].map(element => [element, element.disabled]);
            state = 'sending'; render();
            previous.forEach(([element]) => { element.disabled = true; });
            say('Sending feedback…');
            const controller = new AbortController();
            const sendTimeout = setTimeout(() => controller.abort(), 30000);
            let failure = 'The request could not be completed. Check your connection.';
            try {
                const endpoint = new URL(form.action, location.href);
                if (endpoint.origin !== location.origin) throw new Error('Unexpected destination');
                endpoint.searchParams.set('format', 'json');
                const response = await fetch(endpoint, { method: 'POST', body: data, credentials: 'same-origin', redirect: 'error', signal: controller.signal });
                const result = await response.json();
                if (!response.ok) {
                    failure = typeof result?.error === 'string' ? result.error : 'Your feedback could not be saved.';
                    throw new Error(failure);
                }
                const receipt = new URL(result.redirect, location.href);
                if (!Number.isSafeInteger(result.id) || result.id < 1 || receipt.origin !== location.origin ||
                    receipt.pathname !== endpoint.pathname || receipt.search !== `?id=${result.id}` || receipt.hash || receipt.username || receipt.password) {
                    failure = 'The server returned an unexpected receipt.';
                    throw new Error(failure);
                }
                leaving = true; location.assign(receipt.href);
            } catch (error) {
                leaving = false;
                state = blob ? 'ready' : 'idle';
                previous.forEach(([element, disabled]) => { element.disabled = disabled; });
                render();
                const reason = error.name === 'AbortError' ? 'The request timed out. Check your connection.' :
                    failure;
                say(`Feedback was not confirmed as saved. ${reason} Your message and audio are still here. Try sending again.`);
            } finally {
                clearTimeout(sendTimeout);
            }
        });
        window.addEventListener('beforeunload', event => {
            if (!leaving && (blob || ['requesting', 'recording', 'stopping'].includes(state))) {
                event.preventDefault(); event.returnValue = '';
            }
        });
        window.addEventListener('pagehide', () => {
            generation++;
            if (state === 'requesting') { state = 'idle'; say('Recording cancelled. You can try again.'); render(); }
            stopRecording(false); tracksOff(); playback.pause();
        });
        window.addEventListener('pageshow', () => { render(); });
        say('Record a message, write below, or choose an audio file. Nothing is sent until you press Send.');
        render();
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
