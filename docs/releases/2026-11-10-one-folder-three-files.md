# One folder, three named files

Date: 10 November 2026 (Australia/Sydney). Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Follows the [one-path change](2026-11-10-mvp-one-path.md).

## Need

On 10 November Finlay described where the course goes next. Unit 1 is context engineering for beginners. The next unit will teach the folder system that AI agent tools use, and the instruction and skill files those tools read. He does not want that material in Unit 1. He asked what the agent would add with that direction in mind.

Step 3 told learners to copy each document into their notes and "give it a name you will recognise". Learners would finish with three documents in three different shapes and places. The downloaded files were called `orientation-working.md`, `orientation-projects.md` and `orientation-knowledge.md`, which do not match the document titles.

## Decision

The agent recommended two small additions. Finlay answered "Yes, do it" on 10 November. This is his decision on the direction. It is not approval of the wording.

- The recommended way to keep the portfolio is one folder called `my-context` with three plain-text files named after the documents.
- One sentence at the finish says the next unit shows how an AI assistant can read these files itself.
- No agent terms and no agent file names appear in Unit 1.

## Change

- **Step 3, "Keep it in one folder you can find again"** (`content/portfolio.html`): make a folder called my-context; copy each document into its own note named working-with-me, my-goals-and-projects and useful-knowledge-and-examples. One sentence gives the reason. One sentence covers notes apps without folders. The check now asks the learner to reopen the folder and read the first line of each note.
- **Download names:** the three Download buttons in the builder (`public/assets/portfolio.js`) and the Markdown download in My context (`moodle/local/orientation/workspace.php`) now give `working-with-me.md`, `my-goals-and-projects.md` and `useful-knowledge-and-examples.md`. The combined download, the backup, the practice record and saved notes keep their names.
- **Step 4** (`content/check-and-continue.html`): the finish check names the my-context folder. "What next?" gains the sentence about the next unit.
- **Notes guide** (`content/notes-guide.html`): one sentence says the folder is added in step 3.
- **Operator record** (`docs/operations/context-workspace.md`): the download step names the folder.

Not changed: the plugin version, the database, module IDs, lesson page IDs, completion rules, the portfolio fields, the backup format, saved work and acquisition settings. The copy/paste, fictional-example, bring-your-own-AI and no-JavaScript routes remain. The file content of each download is the same as before; only the suggested file name differs.

## Verification

All tests are synthetic. No learner used these pages.

Before merge, on the branch:

- **Python tests:** 28 passed. Support tests: 6 passed. Journey lifecycle script: passed.
- **Public browser suites (local static server):** portfolio 9 passed, including a new test that each Download button gives the new file name (port 18816); entry 11 passed; metadata 2 passed; tips 7 passed; feedback 32 passed.
- **Build:** `npm run build` leaves no uncommitted change. PHP syntax check of `workspace.php`: no errors.
- **Layout:** the changed section of step 3 does not overflow at 1280 or 390 pixels. The agent read the phone screenshot.
- **Synthetic fixture (port 18802, captured mail):** the branch plugin and content were published to the fixture; both publishers ran twice and reported module IDs and learner evidence unchanged. The suites ran from the `main` checkout with the old test files, because the suites refuse a linked fixture.
  - Onboarding 11 passed. Starting point 8 passed.
  - WB10 learner journey: 1 failed, 1 did not run. The failure is the old test file expecting `orientation-working.md`; the My context download gave `working-with-me.md`, which is the intended new name. The corrected test is on this branch and was not run before merge.
- **Not run:** the context suite (its own fixture on port 18842), the progress suite (still out of date) and `tests/public.spec.cjs` (live-site suite).

After merge and publication: see the comment on [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Remaining limits and questions

- **Wording is not approved.** Finlay accepted the direction only.
- **A learner who downloaded a file before this change** has the old file name. Nothing breaks; they can rename it.
- **Is `my-context` the right name?** It is the agent's choice. The notes guide already uses a note called "My context", and the course account page is also called My context. A pilot learner may confuse them.
- **Phone notes apps** differ in how folders work. Not tested on a phone notes app.
- The other open limits in the [one-path record](2026-11-10-mvp-one-path.md) still stand.
