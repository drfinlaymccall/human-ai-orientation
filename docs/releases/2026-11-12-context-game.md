# End-of-unit game: Pack the brief

Date: 12 November 2026 (Australia/Sydney). Status when written: built and tested on a branch; not merged and not on the live preview.

## Need

Finlay asked on 12 November for "a short interactive and enjoyable in-browser game to play at the end of unit 1 that demonstrates the core learning outcomes". He gave no further brief. The scenario, wording, name, scoring and placement below are the agent's design and are not approved.

## Decision

- **One fictional task, four rounds, about five minutes.** Each round is one step of Unit 1:

  | Round | What the player does | Unit 1 step |
  | --- | --- | --- |
  | 1. Set the criterion | Picks the criterion that can be checked | 1. Try AI on a useful task |
  | 2. Choose the context | Ticks the notes an AI should get; leaves out unrelated and private notes | 2. Give AI useful context |
  | 3. Check the reply | Ticks the sentences that should not be sent; picks a specific correction | 4. Check, improve and continue |
  | 4. Keep what worked | Puts four notes into the three context documents, or leaves one out | 3. Save and reuse context |

- **The reply depends on the brief.** The invented reply is put together from the notes the player ticked. A missing note gives a made-up date or a guess. An unrelated or private note appears in the notice. The player can change the brief and ask again. This is the main point of the game: the player sees context change the result.
- **One problem is always there.** The reply always adds "Morning tea will be provided", which no note mentions. A perfect brief still needs a check.
- **No AI, no storage, no personal information.** The replies were written for the course and are labelled as invented. The page stores nothing and makes no request after it loads. The player types nothing.
- **A page beside the course, not an activity in it.** `/context-game` is a public page. It is not in `content/course-map.json`, is not a Moodle activity, and has no completion. Unit 1 completion is unchanged. Stars are for the player only and are not kept.
- **A paper version without JavaScript.** The same questions and answers are plain HTML with answers the reader opens.
- **A new fictional person (Mina, a garden tidy-up)** and not the book swap, so the player uses the four steps on a task they have not seen.
- **Placement:** one sentence at the top of "What next?" on step 4, after the learner has chosen a next goal and checked they can return. The game page ends with a button back to the next goal.

## Change

- `content/context-game.json`: all game content (task, criteria, notes, reply sentences with reasons, correction, filing, takeaways).
- `scripts/build-game.py` (new; `npm run build:game`, part of `npm run build` before the journey build): writes `public/context-game.html` with the paper version and the same data embedded for the script.
- `public/assets/context-game.js`, `public/assets/context-game.css`: the interactive version. Native checkboxes, radio buttons and select lists; focus moves to each round's heading; results are announced in status regions; motion is off when the reader asks for reduced motion.
- `content/check-and-continue.html` (and its generated and public copies): the sentence that links to the game.
- `content/discovery.json`, `public/sitemap.xml`, `deploy/robots-stage-a.caddy`: the page is listed as a public course page. Under Stage A this offers it to search like the other course pages.
- `deploy/Caddyfile`, `scripts/serve-public.py`: the `/context-game` route and its `.html` and trailing-slash redirect.
- `tests/context-game.spec.cjs`, `playwright.game.config.cjs`, `npm run test:game`; added to `scripts/check-public.sh`.
- `docs/curriculum/course-structure.md`, `CONTROL.md`: the route and current status.

Not changed: the plugin, the database schema, the course map, module IDs, completion rules, saved work, acquisition settings and the AI-context edition (`2026-11-10.1` does not mention the game).

## Verification

All tests are synthetic and ran on the branch against the local static server. No learner has played the game.

- **`npm run check:public`:** passed to the end. It rebuilds every page and confirms the build leaves no uncommitted change. Python: support 6, deploy 3, discovery 11 (these start a throwaway web server from `deploy/Caddyfile` and fetch every listed page, so the new route is covered), AI context 8, public integration 6. Browser: entry 11, game 5, metadata 2, portfolio 9, feedback 32.
- **Game suite (`npm run test:game`, 5 tests):**
  - a careful player gets 12 of 12 stars; the page makes no request after the game starts and leaves no local storage, session storage or cookie;
  - a careless brief puts the made-up date, the unrelated notes and the private notes into the reply; the player changes the brief and the reply changes; a wrong answer explains itself and allows another try; the score matches the rules;
  - the game is played by keyboard through the first two rounds, and nothing overflows at 1280, 390 and 320 pixels wide;
  - without JavaScript the paper version shows every note, the sample reply and all five answers;
  - step 4 links to the game.
- **Screenshots** at 1280 and 390 pixels wide were looked at by the agent.
- **Not run:** the fixture suites (progress, onboarding, welcome, WB10, starting point, notify). No plugin or Moodle code changed. `scripts/sync-journey.php` was not run on the fixture with this content; its only change is one more sentence in the step 4 Page text.

## Publication

Not published. To publish after merge:

1. Pull `main` in the live checkout. This publishes the static page, its files and the public step 4 page.
2. Restart `orientation-web`, so the web server reads the new route. Until then `/context-game` returns the not-found page.
3. Run `scripts/sync-journey.php` on the live site, so the signed-in Moodle copy of step 4 gets the same sentence. The script reports module IDs and learner records before and after.
4. Check `/context-game` and the step 4 link on the live site, signed out and signed in.

## Remaining limits and questions

- **Nothing here is approved by Finlay:** the name, Mina's scenario, every sentence, the scoring and the placement.
- **Is the page to be offered to search?** It is listed with the other public course pages. Remove `/context-game` from the sitemap by adding `"sitemap": false` to its entry in `content/discovery.json`.
- **The AI-context edition does not describe the game.** A learner's own AI that reads `/ai/context.md` will not know about it. A new edition is a separate change.
- **The game shows the outcomes; it does not measure them.** A full score is not evidence that a person can do these things with their own task. Only a human pilot can show whether the game is enjoyable or clear.
- **Not checked:** a screen reader, a physical phone, and browsers other than Chromium.
- The game is not in the journey's activity list or the catalogue. It is reached from step 4 only.
