# Step 2 wording, a shorter header and a working progress suite

Date: 10 November 2026 (Australia/Sydney). Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Source findings: [launch audit](../reviews/2026-11-10-launch-audit.md) F33 (part), F35 (part), F38 (part), F06 (part) and F59. Follows the [one-path](2026-11-10-mvp-one-path.md) and [one-folder](2026-11-10-one-folder-three-files.md) changes.

## Need

- Step 2 (`/preview`) and four optional pages still called the activity "the lesson", "the AI lesson", "the context lesson" or "the first lesson". The course now names four steps.
- `/preview` offered "Open the saved-progress version" at `/course/view.php?id=2`. That is a bare Moodle course page, and a sign-in page for a visitor.
- The public header showed "Course catalogue", "Unit 1 journey" and "Check sign-in / Your course journey". The catalogue advertises a planned unit before the learner has started. The third label was unclear.
- The native progress suite had failed since 25 October on text that had left the pages, so most of it did not run.

On 10 November Finlay said "Yes, go on" to this clean-up. That is a go-ahead for the work. It is not approval of the wording.

## Decision

- Use "step" and "activity", and the activity's name, in place of "lesson".
- The header carries two links: **Course journey** and the account link. The catalogue stays published and is linked from the journey page.
- The account link reads **Sign in or open your course** until the page knows the sign-in state. It still reads **Sign in** when signed out and **Your course journey** when signed in.
- Repair the progress suite to match the current pages. Do not change what it protects.
- **Keep the Tips panel beside both writing areas on `/preview`.** Each panel gives hints for the boxes next to it, and the second one carries the result-checking prompt where the learner checks a result. Showing it once needs a redesign of the panel script. That is not worth the risk for a minimum viable course.
- Leave the journey page's heading ("Unit 1: Human–AI Orientation") alone. Its name is Finlay's choice (item 13 in [his list](../reviews/2026-11-10-finlay-contributions.md)).

## Change

- **`/preview`** (`public/preview.html`, hand-maintained header; `content/useful-context.json`; `content/context-try-widget.html`): wording changes from "lesson" to "step" or "activity". The saved-progress link now reads "Have a course account? Sign in and open this step there to record your progress" and goes to `/local/orientation/index.php?module=useful-context`. Three of the wording changes are in text shared with the native Lesson. Two reached it (sections 4 and 7). The third (section 5) did not, because the publisher did not update that page; the [next change](2026-11-10-cut-agent-pointers.md) fixes that. Page IDs, questions and answers do not change. (Corrected after publication, 10 November.)
- **Optional pages** (`content/notes-guide.html`, `content/ai-interface.html`, `content/computer-basics.html`, `public/free-tools.html`): the same naming fix, one sentence each (two on the notes guide).
- **Header** (`scripts/build-journey.py`, `content/home.html`): two links, as decided. The journey page gains "See every unit in the course catalogue".
- **Account labels** (`public/assets/account-state.js`, `content/home.html`, `scripts/build-journey.py`): the unknown-state label, and "Sign in to open your saved course work." in place of "Check sign-in to see your account state."
- **Progress suite** (`tests/progress.spec.cjs`): expects seven activities in the atlas, not five; looks for "Save and reuse context" in place of a label removed on 25 October; uses a published page outside the course map (`deeper-courses`) as the synthetic optional addition, because `notes` is now a mapped activity.
- **Entry tests** (`tests/launch-entry.spec.cjs`): new header labels.

Not changed: the plugin, its version, the database, module IDs, lesson page IDs, questions, answers, attempts, completion rules, saved work and acquisition settings. The signed-in Moodle menu is unchanged.

## Verification

All tests are synthetic. No learner used these pages.

Before merge, on the branch:

- **Python tests:** 28 passed. Support tests: 6 passed. Journey lifecycle script: passed.
- **Public browser suites (local static server):** entry 11 passed with the new header labels; structure 4 passed; portfolio 9 passed (port 18816); metadata 2 passed; tips 7 passed; feedback 32 passed. The structure suite needs the installed browser named in `ORIENTATION_CHROMIUM` on this server.
- **Build:** `npm run build` leaves no uncommitted change.
- **Synthetic fixture (port 18802, captured mail):** the branch plugin and content were published to the fixture; both publishers ran twice and reported module IDs and learner evidence unchanged.
  - **Progress: 16 passed.** This is the first full pass since the suite went stale. It ran with the branch's test file.
  - Onboarding 11 passed, welcome 5 passed, starting point 8 passed, with the branch's test files.
  - WB10 learner journey 2 passed, run from the `main` checkout. Its test file is identical on the branch.
- **How the branch tests reached the fixture:** the branch lives in a worktree, which has no `trial/` folder. For these runs the agent linked the worktree's `trial` to the real one, ran the suites and removed the link. The fixture folder itself is the real one, not a link, so the suites' own fixture checks ran as written. WB10 has a stricter capture-mail path check and refused this route before changing anything; that is why it ran from `main`.
- **Not run:** the context suite (its own fixture on port 18842) and `tests/public.spec.cjs` (live-site suite).

After merge and publication: see the comment on [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Remaining limits and questions

- **Wording is not approved.**
- **Step 2 still points to the Unit 2 early reading.** Section 5 of `/preview` says "If you already use an agent tool with instruction files, see the early Unit 2 reading". Finlay does not want agent material in Unit 1. This one optional pointer predates his direction and `/agent-basics` awaits his review (item 15), so the agent left it and asks: keep or cut? The earlier record's line that no agent terms appear in Unit 1 describes what that change added; this pointer is the exception already on the page.
- **The Tips panel shows twice on `/preview`**, by the decision above.
- **`/preview` is still the address of step 2.** Renaming it would need redirects and is not needed for a minimum viable course.
- **A new AI-context edition is still due.** The current edition (`2026-11-06.1`) describes three activities and a portfolio bridge. It is the next change.
- **Stale operator records** (audit F55–F57, F51) are the change after that.
- **`tests/public.spec.cjs` and the context suite were not run.**
