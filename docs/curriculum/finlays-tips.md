# Reusable Finlay’s Tips for writing activities

Finlay requested reusable prompts and a speak-instead-of-type reminder beside the writing boxes, preferably in a floating right-hand panel. The shared course component provides that support without installing a separate Moodle block or changing Moodle core.

## Learner behaviour

- A **Finlay’s Tips** panel sits beside the activity when the content area is wide enough. It sticks while the learner scrolls and has its own bounded scrolling area. On narrow screens it stays in normal document flow below the activity; it never overlays a writing box.
- Each editable course textarea gets a short **speak your answer, then read it back** hint and a keyboard-accessible link to the shared voice-typing setup. Read-only output fields are excluded. Focusing a box updates the panel’s current-writing label; it does not change an answer.
- Three original prompt starters support clarifying a request, being interviewed one question at a time, and checking a result. Copy buttons copy authored prompt text only, never append learner answers and never submit the Moodle form or send anything to an AI.
- If clipboard permission is denied, the prompt is selected for manual copying. Without JavaScript, the panel, device guidance and prompt text remain readable with native disclosures; inactive copy buttons stay hidden.
- Dictation uses the learner’s existing device/app. The component adds no microphone recording or speech service. Typing, pasting, fictional examples and the existing manual course routes remain valid.

The existing prompt-helper and portfolio voice callouts move into optional disclosures in the panel when present. Their content and links are retained. Device guidance links the official [Windows voice-typing instructions](https://support.microsoft.com/en-us/accessibility/windows/use-voice-typing-to-talk-instead-of-type-on-your-pc) and [Mac Dictation setup](https://support.apple.com/guide/mac-help/use-dictation-mh40584/mac), reusing the course's previously checked setup guidance. The component does not promise universal keyboard shortcuts or claim physical-device dictation was tested here. Earlier helper-service observations remain in [the prompting ledger](../research/prompt-helpers.md).

## Source and reuse

`content/finlay-tips.html` owns the shared voice guidance and three prompts. `scripts/course_tips.py` renders unique IDs and wraps an authored writing fragment with the shared layout. It detects editable textareas, leaving plain reading fragments alone. The existing journey, brief and preparation builders call it; new activity fragments can use the same function with a unique author key. Do not copy the full panel into each activity source.

`public/assets/finlay-tips.css` uses a container query so the panel responds to actual available space, including Moodle’s course navigation. `public/assets/finlay-tips.js` adds hints and copy behaviour only inside the shared component. It does not fetch, store learner data, change field names/keys, alter completion or initialise another editor. Prompt buttons always have `type="button"` because native Lesson guidance can be rendered inside a Moodle form.

Public assets are included only on pages with writing support. Native Moodle loads them through the existing supported additional-footer-HTML setting, preserving unrelated footer content. Native reflection guidance carries the same panel and enhances Moodle’s existing `answer_editor[text]` field; its native submission and completion flow remain intact.

Build before publication:

```sh
npm run build:preparation
npm run build:brief
npm run build:journey
```

Preparation now emits `content/generated/before-you-start.html`, `notes.html` and `deeper-courses.html`, which the native publisher reads. Never publish unexpanded component markers. Use the documented runtime deliberately for `scripts/sync-preparation.php` and `scripts/sync-journey.php`; both retain their record-preservation checks. Never seed/reset the live course. See [reproduction](../REPRODUCING.md) for fixture isolation.

## Verification and limits — 23 October 2026

Six focused public Tips checks and all eight existing portfolio checks passed. They cover all editable course boxes, read-only exclusions, clipboard success/denial, no text submission or draft mutation, unique IDs, keyboard navigation, desktop positioning/sticky behaviour, 390/320px fit and no-JavaScript content. The first run caught a desktop panel slipping out of view near the final field; a bounded panel height fixed it and the six checks then passed. Repeated generation produces the same files.

Two native fixture checks passed: portfolio panels/hints at desktop and phone widths; Lesson builder and native reflection prompt-copy actions preserve the draft and do not submit the form, then ordinary reflection submission still records completion. Raw screenshots use synthetic/blank content and stay private. The existing broad progress suite stopped on its old **My orientation progress** heading because the shared fixture has a newer **Your course journey** plugin from another thread. That fixture work was preserved; no broad progress pass is claimed. The targeted native tests use direct module routes to avoid that unrelated navigation mismatch.

Run `npm run test:tips` for portable checks and `npm run test:tips:native` against the explicitly provisioned isolated fixture. A real microphone on Mac/Windows/phone, assistive-technology behaviour and learner comprehension remain human/device checks.

The live preview additionally passed six anonymous checks at 1440/390/320px with JavaScript enabled/disabled, confirming the panel, readable prompts, voice help and horizontal fit. The existing native preparation/journey publishers reported unchanged learner records/answers, and preparation publication was repeated successfully. No real account, microphone or AI service was used for these live reading checks.
