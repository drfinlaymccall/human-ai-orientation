// End-of-unit game. Reads its content from the JSON the build embeds in the page.
// Nothing is stored and no request is made. Without this script the page shows the paper version.
(function () {
  'use strict';
  const root = document.querySelector('[data-context-game]');
  if (!root) return;
  const source = root.querySelector('[data-game-source]');
  const stage = root.querySelector('[data-game-enhanced]');
  const paper = root.querySelector('[data-game-fallback]');
  if (!source || !stage || !paper) return;
  let game;
  try { game = JSON.parse(source.textContent); } catch (error) { return; }

  const ROUNDS = ['Set the criterion', 'Choose the context', 'Check the reply', 'Keep what worked'];
  const MAX = 3;
  let state;

  function el(tag, attributes, children) {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes || {})) {
      if (name === 'text') node.textContent = value;
      else if (name === 'class') node.className = value;
      else if (value === true) node.setAttribute(name, '');
      else if (value !== false && value != null) node.setAttribute(name, value);
    }
    for (const child of [].concat(children || [])) if (child) node.append(child);
    return node;
  }

  function stars(count, total) {
    return el('span', { class: 'game-stars', role: 'img', 'aria-label': count + ' of ' + total + ' stars', text: '★'.repeat(count) + '☆'.repeat(total - count) });
  }

  function shuffled(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function replyFor(packed) {
    const sentences = [];
    for (const slot of game.reply) {
      const chosen = slot.card === null || packed.has(slot.card) ? slot.packed : slot.unpacked;
      if (chosen) sentences.push({ text: chosen.text, why: chosen.why || null });
    }
    return sentences;
  }

  function words(sentences) {
    return sentences.map(sentence => sentence.text).join(' ').trim().split(/\s+/).length;
  }

  // Each round replaces the stage and moves focus to its heading, so keyboard and screen-reader users follow.
  function show(index, body) {
    const earned = state.stars.reduce((sum, value) => sum + (value || 0), 0);
    const heading = el('h2', { tabindex: '-1', text: index < ROUNDS.length ? (index + 1) + '. ' + ROUNDS[index] : 'Your result' });
    const progress = index < ROUNDS.length
      ? el('p', { class: 'game-progress' }, [el('span', { text: 'Round ' + (index + 1) + ' of ' + ROUNDS.length + ' · ' }), stars(earned, MAX * ROUNDS.length)])
      : null;
    stage.replaceChildren(el('section', { class: 'game-round', 'data-game-round': String(index + 1) }, [progress, heading].concat(body)));
    heading.focus();
  }

  function button(label, action, secondary) {
    const node = el('button', { type: 'button', class: secondary ? 'game-button secondary' : 'game-button', text: label });
    node.addEventListener('click', action);
    return node;
  }

  // One question with one right answer. Wrong answers explain and let the player try again.
  function quiz(name, question, options, done) {
    let wrong = 0;
    const status = el('p', { class: 'game-feedback', role: 'status' });
    const inputs = [];
    const choices = options.map((option, index) => {
      const input = el('input', { type: 'radio', name, id: name + '-' + index, value: String(index) });
      inputs.push(input);
      return el('label', { class: 'game-choice', for: name + '-' + index }, [input, el('span', { text: option.text })]);
    });
    const check = button('Check my answer', () => {
      const picked = inputs.find(input => input.checked);
      if (!picked) { status.textContent = 'Choose one answer first.'; return; }
      const option = options[Number(picked.value)];
      status.textContent = option.feedback;
      if (!option.correct) { wrong += 1; status.dataset.result = 'wrong'; return; }
      status.dataset.result = 'right';
      inputs.forEach(input => { input.disabled = true; });
      check.remove();
      done(wrong);
    });
    return el('fieldset', { class: 'game-quiz' }, [el('legend', { text: question })].concat(choices, [check, status]));
  }

  function roundOne() {
    const after = el('div');
    show(0, [
      quiz('game-criterion', game.criteria.question, game.criteria.options, wrong => {
        state.stars[0] = Math.max(1, MAX - wrong);
        after.append(button('Next: choose the context', roundTwo));
        after.firstChild.focus();
      }),
      after,
    ]);
  }

  function roundTwo() {
    const count = el('p', { class: 'game-count', role: 'status' });
    const boxes = [];
    const update = () => {
      const picked = boxes.filter(box => box.checked).length;
      count.textContent = picked === 1 ? '1 note is in the brief.' : picked + ' notes are in the brief.';
      boxes.forEach(box => box.closest('label').classList.toggle('is-picked', box.checked));
    };
    const cards = state.order.map(card => {
      const box = el('input', { type: 'checkbox', id: 'game-card-' + card.id, value: card.id });
      box.checked = state.packed.has(card.id);
      box.addEventListener('change', update);
      boxes.push(box);
      return el('label', { class: 'game-card', for: 'game-card-' + card.id }, [box, el('span', { text: card.text })]);
    });
    show(1, [
      el('p', { text: 'These are ' + game.cards.length + ' of ' + game.person + '’s notes. Tick each note the AI should get for this task. Leave out what is unrelated or private.' }),
      el('p', { class: 'game-criterion' }, [el('strong', { text: 'Criterion: ' }), game.criterion]),
      el('fieldset', { class: 'game-cards' }, [el('legend', { text: game.person + '’s notes' })].concat(cards)),
      count,
      button('Ask the AI', () => {
        state.packed = new Set(boxes.filter(box => box.checked).map(box => box.value));
        const correct = game.cards.filter(card => (card.kind === 'helpful') === state.packed.has(card.id)).length;
        state.stars[1] = correct === game.cards.length ? 3 : correct >= 6 ? 2 : correct >= 4 ? 1 : 0;
        roundThree();
      }),
    ]);
    update();
  }

  function roundThree() {
    const sentences = replyFor(state.packed);
    const total = words(sentences);
    const boxes = [];
    const rows = sentences.map((sentence, index) => {
      const box = el('input', { type: 'checkbox', id: 'game-sentence-' + index });
      boxes.push(box);
      return el('li', {}, [el('label', { class: 'game-sentence', for: 'game-sentence-' + index }, [box, el('span', { text: sentence.text })])]);
    });
    const summary = el('p', { class: 'game-feedback', role: 'status' });
    const after = el('div');
    const check = button('Check my ticks', () => {
      let wrong = 0;
      sentences.forEach((sentence, index) => {
        const ticked = boxes[index].checked;
        const problem = Boolean(sentence.why);
        if (ticked !== problem) wrong += 1;
        boxes[index].disabled = true;
        const verdict = problem
          ? (ticked ? 'Well spotted. ' : 'You missed this one. ') + sentence.why
          : (ticked ? 'This sentence is fine. It matches ' + game.person + '’s notes.' : 'Fine. It matches ' + game.person + '’s notes.');
        rows[index].append(el('p', { class: 'game-verdict', 'data-result': ticked === problem ? 'right' : 'wrong', text: verdict }));
      });
      const flags = wrong === 0 ? 2 : wrong === 1 ? 1 : 0;
      summary.textContent = wrong === 0 ? 'You judged every sentence correctly.' : wrong === 1 ? 'You judged all but one sentence correctly.' : 'You judged ' + (sentences.length - wrong) + ' of ' + sentences.length + ' sentences correctly.';
      check.remove();
      const fromBrief = sentences.filter(sentence => sentence.why).length > 1;
      if (fromBrief) {
        after.append(
          el('p', { text: 'Most of these problems come from the brief. Change what the AI gets and ask again, or go on.' }),
          button('Change the brief and ask again', roundTwo, true));
      }
      const fixed = el('div');
      after.append(quiz('game-correction', game.correction.question, game.correction.options, wrongTries => {
        state.stars[2] = flags + (wrongTries === 0 ? 1 : 0);
        fixed.append(
          el('p', { text: 'With the four helpful notes and that correction, the notice reads:' }),
          el('blockquote', { class: 'game-reply' }, [el('p', { text: game.correction.fixed })]),
          button('Next: keep what worked', roundFour));
        fixed.lastChild.focus();
      }), fixed);
    });
    show(2, [
      el('p', { text: 'The AI replied. Tick each sentence ' + game.person + ' should not send as it is: anything made up, guessed, unrelated or private.' }),
      el('p', { class: 'game-criterion' }, [el('strong', { text: 'Criterion: ' }), game.criterion]),
      el('div', { class: 'game-reply' }, [
        el('p', { class: 'meta', text: 'Invented reply, written for this game' }),
        el('ol', { class: 'game-sentences' }, rows),
        el('p', { class: 'meta', 'data-game-words': String(total), text: total + ' words. ' + (total < game.word_limit ? 'That is under ' + game.word_limit + '.' : 'That is not under ' + game.word_limit + '.') }),
      ]),
      check, summary, after,
    ]);
  }

  function roundFour() {
    const filing = game.filing;
    const places = filing.documents.map((name, index) => [String(index), name]).concat([['out', filing.leave_out]]);
    const selects = [];
    const rows = filing.items.map((item, index) => {
      const select = el('select', { id: 'game-file-' + index }, [el('option', { value: '', text: 'Choose a place' })].concat(places.map(([value, name]) => el('option', { value, text: name }))));
      selects.push(select);
      return el('div', { class: 'game-file' }, [el('label', { for: 'game-file-' + index, text: item.text }), select]);
    });
    const status = el('p', { class: 'game-feedback', role: 'status' });
    const after = el('div');
    const check = button('Check where they go', () => {
      if (selects.some(select => !select.value)) { status.textContent = 'Choose a place for every note first.'; return; }
      let correct = 0;
      filing.items.forEach((item, index) => {
        const ok = selects[index].value === String(item.answer);
        if (ok) correct += 1;
        selects[index].disabled = true;
        const place = item.answer === 'out' ? filing.leave_out : filing.documents[item.answer];
        rows[index].append(el('p', { class: 'game-verdict', 'data-result': ok ? 'right' : 'wrong', text: (ok ? 'Yes. ' : 'This one goes in: ' + place + '. ') + item.why }));
      });
      state.stars[3] = correct === filing.items.length ? 3 : Math.max(0, correct - 1);
      status.textContent = correct + ' of ' + filing.items.length + ' in the right place.';
      check.remove();
      after.append(button('See my result', result));
      after.firstChild.focus();
    });
    show(3, [
      el('p', { text: game.person + ' keeps three documents she can use again with any AI. Choose where each note goes. One note should not be kept in them at all.' }),
    ].concat(rows, [check, status, after]));
  }

  function result() {
    const earned = state.stars.reduce((sum, value) => sum + (value || 0), 0);
    const total = MAX * ROUNDS.length;
    const line = earned === total ? 'A full score. You briefed, checked and kept like someone who has done this before.'
      : earned >= 8 ? 'Good work. Play again to see how the reply changes with a different brief.'
        : 'Play again and watch how each note you choose changes the reply.';
    show(ROUNDS.length, [
      el('p', { class: 'game-score' }, [stars(earned, total), el('span', { text: ' ' + earned + ' of ' + total + ' stars' })]),
      el('p', { text: line }),
      el('h3', { text: 'What the game shows' }),
      el('ul', {}, game.takeaways.map((entry, index) => el('li', {}, [
        el('a', { href: entry.href, text: entry.step }), ': ' + entry.text + ' ', stars(state.stars[index] || 0, MAX),
      ]))),
      el('p', { text: 'The next goal you choose is yours. Use the same four moves on it.' }),
      button('Play again', start, true),
    ]);
  }

  function start() {
    state = { stars: [0, 0, 0, 0], packed: new Set(), order: shuffled(game.cards) };
    roundOne();
  }

  paper.hidden = true;
  stage.hidden = false;
  state = { stars: [0, 0, 0, 0], packed: new Set(), order: shuffled(game.cards) };
  const intro = [
    el('p', { text: 'Four short rounds. You get up to three stars in each.' }),
    button('Start the game', start),
  ];
  stage.replaceChildren(el('section', { class: 'game-round' }, [el('h2', { text: 'Ready?' })].concat(intro)));
})();
