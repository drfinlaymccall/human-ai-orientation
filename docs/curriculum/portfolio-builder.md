# A beginner portfolio journey

Authored 13 October 2026. This records the implementation of the portfolio course unit; deployment, enrolment, support email and observed learner outcomes are tracked separately in the project control document. No learner testing is claimed here.

## Why this unit exists

Finlay approved expanding the course around a practical North Star: a learner can retrieve reviewed context, select the useful part and begin a worthwhile task with an AI. He also asked that the evolving design, decisions, research and build process be documented for a public GitHub repository. The course therefore teaches context through a useful task, with a portable artifact at the end. It does not require paid AI access, employment-specific experience or intimate personal disclosure.

The first implementation uses three documents: **Working with me**, **My goals and projects**, and **Useful knowledge and examples**. This lowers the initial authoring burden while retaining space for preferences, boundaries, goals, source provenance and tested instructions. They are original course templates inspired by [Nathaniel Whittemore’s personal context portfolio](https://github.com/nlwhittemore/personal-context-portfolio). No external repository text or licence has been copied into this unit. The AI-interview prompt is also original course wording: one focused question, a skippable answer, a draft for correction, then the next section.

## Learning sequence

| Activity | Learner action | Evidence they keep | Guide time |
| --- | --- | --- | --- |
| Get one useful result | Choose a small task, set a criterion, make a first attempt and identify a gap | Task, criterion, request, result excerpt and observation | 10–15 minutes |
| Give useful context (existing activity) | Select relevant details, predict a change and inspect the result | Improved brief and useful instruction | 25–30 minutes |
| Build your portfolio | Write or use an AI interview, edit three documents and download them | Reviewed context Markdown plus restorable JSON backup | 20–30 minutes |
| Test, improve and continue | Retrieve the portfolio, select context for a fresh chat, correct a result, choose a next goal | Private practice record and revised instruction | 15–20 minutes |

The full guide time is 70–95 minutes, plus optional 20–30-minute preparation. These are author estimates, not measured completion times. The three core activities remain a choose/context/check journey, with the portfolio as the context extension. All activities provide a fictional route for someone without a usable AI account. The shared scenario is a neighbourhood book swap, with date and venue deliberately undecided. It is authored course material, not a transcript or evidence about a real learner.

The fresh-conversation activity explicitly notes that account memory and instructions may still apply. An AI's statement that it used supplied context is a claim to inspect, not proof. Learners retain one concrete check, a correction and what changed, then identify their own next learning need and the information their AI would need.

## Learner experience and ownership

- Every field is optional; short notes are enough. Each is limited to 2,000 characters.
- Manual and AI-interview routes lead to the same editable documents.
- A review checkbox records the learner's review and is cleared when context changes. It does not assess factual correctness.
- Copying starts with only “Working with me” selected. Learners can include the other documents deliberately.
- Three individual Markdown downloads and one combined context download are available.
- A separate practice-record download contains the learning observations. Practice fields never appear in copied context or context Markdown.
- The JSON backup includes all three documents, the private practice record, review status and fictional-example provenance. It is labelled private and should not be pasted wholesale into an AI.
- Imported backups and fictional examples require explicit replacement confirmation when there is existing work. Cancellation preserves current entries. Clearing also requires confirmation.
- Fictional provenance survives edits to example context, so an edited example is not silently presented as a real person's portfolio.
- Section links help learners reach individual documents or save/restore without scrolling the whole form.

## Storage, privacy and robustness

The widget reads and writes only `sessionStorage` under `orientation.portfolio.v1`. This enables same-tab continuation between public course pages and Moodle pages on the same origin. It is **not account storage**, server submission, synchronization, a permanent save or a guarantee after closing a tab. Browser settings can make temporary storage unavailable; the interface then tells the learner to download before leaving.

Fields have no `name` attributes and controls have `type="button"`, so embedding the fragment inside an existing Moodle form does not automatically submit portfolio text. The runtime makes no fetch, analytics or AI requests. Normal page and asset requests still occur. Imports are read with the browser File API. User text is assigned through text-safe DOM properties rather than interpreted as HTML. Downloads use local Blob URLs, subsequently revoked.

Version 1 backups use an exact shape:

```json
{
  "format": "human-ai-orientation-portfolio",
  "version": 1,
  "fields": { "about": "", "...all 20 fixed string fields...": "" },
  "reviewed": false,
  "example": false
}
```

The snippet illustrates the envelope, not a valid import file. Validation requires all 20 known string keys, rejects extra keys, checks booleans and version, and enforces a 256 KB whole-file limit. Each field is limited to 2,000 UTF-16 code units. Twenty fields at that bound fit under the file limit even with worst-case JSON escaping. This avoids allowing a valid on-page draft that its own backup importer could not restore. Unknown versions fail safely; no migration is claimed. Invalid imports leave current entries intact.

If clipboard access is blocked, the copy text is selected for the device's manual Copy command. Without JavaScript, plain-text context and practice templates remain readable and the inactive interactive controls remain hidden.

A backup file should be treated as personal material. The public repository and test screenshots contain authored synthetic examples only; portfolio exports and learner submissions do not belong in it.

## Source and integration

- `content/first-task.html`, `content/portfolio.html`, `content/check-and-continue.html`: authored HTML fragments.
- `scripts/build-journey.py`: public page wrapper, journey overview and shared save/restore controls; `fragment(name)` expands the shared controls for Moodle integration.
- `public/assets/portfolio.js`: fixed schema, temporary state, selected-context output, downloads, validation and replacement confirmation.
- `public/assets/portfolio.css`: widget-scoped controls and responsive layout; public pages also use the established site stylesheet.
- `public/first-task.html`, `public/portfolio.html`, `public/check-and-continue.html`, `public/journey.html`: generated public output.
- `tests/portfolio.spec.cjs`, `playwright.portfolio.config.cjs`: isolated browser regression suite using synthetic content and a local static server, without live Moodle credentials.

Build with `python3 scripts/build-journey.py`. The build only writes the four public generated pages. Embed `fragment(name)` in Moodle rather than the unexpanded source marker. Supply the shared CSS and JavaScript assets once per page. Extensionless routing, the existing preview's continuation link, home navigation and Moodle resource creation belong to the integration step; this unit does not change live services.

## Implementation and verification record

The tests were authored first. The initial focused run, before the public portfolio page and runtime existed, observed HTTP 404 for `/portfolio.html`, followed by a timeout waiting for the `about` field. The first attempt to start the static test server was blocked by the execution sandbox's socket restriction; the same isolated test ran with approved local-server permissions. This was an environment restriction, not a course failure.

The implementation was checked with Node syntax validation, deterministic generation and Playwright browser tests. The final focused run (`npx playwright test --config playwright.portfolio.config.cjs`) passed all six tests on 13 October 2026; the four generated pages matched their source. The browser suite verifies export/re-import after clearing storage, same-tab cross-page practice restoration, context/reflection separation, review reset, overwrite confirmation and cancellation, malformed/version/type/size rejection, text-safe malicious markup, blocked clipboard/storage fallback, no submission during editing/export, clear-and-reload, no-JavaScript templates, and horizontal fit at 1440px and 390px. A maximal escaped-content backup roundtrip checks the file-size invariant.

Screenshots are generated into the isolated Playwright output directory under `/tmp/orientation-portfolio-results`, using only the fictional book-swap example. They are implementation evidence, not user-research evidence. Human keyboard/screen-reader usability and actual learner usefulness still need pilot observation; this automated suite does not establish them.

## Pilot questions

Can a learner choose one relevant context document, explain that selection, retrieve the downloaded files, restore a backup and use it in a fresh conversation without help? Can they distinguish a reviewed portfolio from a verified AI answer? Can they tell what Moodle saves and what remains in their own files? Observe these actions before expanding to additional portfolio categories or automatic account storage.
