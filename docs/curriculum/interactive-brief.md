# Interactive brief and example pathway

Finlay requested editable table-like inputs and one-click copying in the context activity, plus examples for learners exploring the interface. Implemented 13 October 2026 in the public preview and native Moodle lesson, using the same HTML, CSS and JavaScript.

## Interaction

- Six labelled rows cover task, purpose, audience, background, boundaries and a checkable result. The two-column form stacks on small screens. A read-only preview updates as the learner types; empty rows are omitted rather than copied as unresolved placeholders.
- Copy context brief includes only those six rows and the ask-before-guessing instruction. Learning notes are a separate output with a separate copy action.
- Use a random example chooses among three authored fictional scenarios without an inference request or cost. A replacement asks for confirmation when any entries exist; cancel preserves all entries. Each scenario is internally coherent and explicitly labelled in the copied brief.
- Included detail/reason, omitted category/reason and prediction are editable fields with individual example buttons. Examples follow the selected scenario or use the community gathering by default. They retain a “Fictional example” label in the field and copied learning notes. An example button does not overwrite a filled response.
- Editing an example keeps its fictional status. Clear draft starts a new personal draft. A generated example is not represented as evidence of human practice; the final reflection should identify exploratory use.
- Clipboard failure opens/selects the relevant output for manual copying. No JavaScript leaves the previous text template and reflection prompts available.

## Data and implementation

Session storage keeps a temporary draft under `orientation.context-brief.v1` in the current origin/tab so learners can navigate and return. The public and signed-in views in the same tab can share that draft; it is not tied to an account. Session restoration can retain it. Clear draft removes the stored copy; learners should clear it on shared devices and keep durable work in their own notes. Storage errors leave an in-memory editor with an explicit copy-before-leaving message.

Fields have no form names, action buttons use `type="button"`, and the script makes no network requests. Drafts and learning notes are not submitted with Moodle's Continue action. Moodle still saves its normal lesson progress and the separately submitted final reflection. The privacy page and widget describe the distinction.

Source markup: `content/context-brief-widget.html`; behaviour and authored examples: `public/assets/context-brief.js`; scoped styling: `public/assets/context-brief.css`. Run `npm run build:brief` to update `content/useful-context.json` and the public preview, then `scripts/php scripts/sync-preparation.php` to update the third and fourth explanatory Moodle pages. Moodle loads the scoped assets using its supported additional-footer-HTML setting; core files are unchanged and unrelated footer content is retained. The shared bridge reads the brief on pages without a builder; each editor initialises only its own element.

The synchronisation preserves page IDs, answers, branching, attempts and completion records using the existing transactional fingerprints. Any future field/schema changes should deliberately version or migrate the session-storage key. User-entered text is handled only through text/value properties, not inserted as HTML.

## Evaluation

Test the full interaction rather than only rendering fields: type and copy, keep private learning notes out of the AI brief, generate an example, cancel replacement, restore on reload, clear, handle denied clipboard/storage and use a no-JavaScript fallback. Check both public and native Moodle routes and mobile layout. This establishes functional behaviour, not learning gain; observe real learners to assess whether examples support transfer into their own context.

## Carry the brief into a try/check/improve workspace — 13 October

Step 4 carries the exact assembled brief, success criterion and prediction from step 3. In the public preview these update together until a learner starts editing their try. In native Moodle the next page reads the same tab’s stored draft. Missing storage or a different tab/device has a visible paste-from-notes route; automatic continuity is not account synchronisation.

Learners copy only the brief into their AI, paste the response back, record observations, edit/copy a follow-up, and decide what to keep. The prediction remains beside the checking task. A follow-up starter uses their criterion; it does not fabricate an AI response or evidence of checking. The complete labelled practice record is separately copyable. Existing worked-example guidance remains available without using an AI.

A started comparison retains the version of the brief/prediction it used. When earlier inputs change, a notice offers Use my latest brief; confirmation clears this try’s response and checking notes before importing the new version. Cancel preserves the record. Clear this try leaves the earlier draft available; clear both editors to remove both temporary copies. Values are text, never rendered as HTML.

`content/context-try-widget.html` and `public/assets/context-try.js` own this workspace. Its session key is `orientation.context-try.v1`, holding seven text fields, the source signature and an edited flag. Neither editor gives fields form names or sends network requests. Native Moodle Continue submits progress, not the practice fields. The browser suite checks decoded POST values to verify that separation.

`content/computer-controls.html` is a shared written copy/switch/paste guide embedded in preparation and step 4. Build with both `npm run build:brief` and `npm run build:preparation`, then run the existing Moodle synchronisation. It preserves lesson IDs, answers and learner records. Supporting links and limits are recorded in [computer-control sources](../research/computer-controls.md).
