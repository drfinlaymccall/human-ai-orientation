# AI-context edition 2026-11-10.1

Date: 10 November 2026 (Australia/Sydney). Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Follows the four course changes of 10 November.

## Need

The `/ai/` page gives a learner a text to paste into their own AI so it can help with the course. Edition `2026-11-06.1` described the course as it was: a map with no set order, "three activities and a portfolio bridge", optional instruction files, and "the public lesson". The course pages changed on 10 November, so an AI given the old text would coach the old course. Published editions are never edited, so a new one is needed.

## Decision

Publish edition `2026-11-10.1`. Keep manifest schema 1.4, because no field is added or removed. Keep every earlier edition byte-for-byte.

## Change

In `content/ai/course-context.json`:

- **Order:** the guidance names the four steps and says they are done in order the first time. Returning learners can choose any activity.
- **Result:** step 3 produces the three context documents, the main result. Completion for signed-in learners still comes from three activities.
- **Keeping work:** the `my-context` folder, the three note and file names, and that the private practice record and backup stay outside it.
- **Talk it through:** if a learner pastes that prompt, the AI interviews one question at a time, uses only what they say and returns three plain-text documents to correct.
- **Next goal:** the four parts taught in step 4, chosen by the human, and the finish check.
- **Agent material:** "Instruction files are an optional extension" is removed from the step guidance. One guidance line says Unit 1 does not teach agent tools; the Unit 2 early reading is offered only if the learner asks.
- **Names:** "Files, folders and locations" for the files page; "Give AI useful context at /preview" for "the public lesson". The guidance sections in the text are labelled with their course step (Step 1, seven sections for Step 2, Step 3, Step 4) and no longer numbered 1–10, and the `/ai/` page labels step 3 "Step 3: your three context documents" (review findings, accepted).

In `scripts/build-ai-context.py`: the activity-map introduction states the order; "Course journey" replaces "Public lesson"; the `/ai/` page says "the course".

Serving: `deploy/Caddyfile` lists the new edition path in both places. `deploy/cloudflare-ai-context-rule.json` lists it too; applying that rule is Finlay's (item 23 in [his list](../reviews/2026-11-10-finlay-contributions.md)).

Tests: `tests/test_ai_context.py` pins the bytes of `2026-11-06.1` and expects the new edition as current. `tests/public.spec.cjs` lists the new path (edited, not run).

Not changed: the manifest schema, the course map, activity roles (the map still uses the role name `portfolio-bridge`), the plugin, the database and every learner record.

## Verification

All tests are synthetic.

- **Python tests:** 28 passed. Metadata: 7 Python and 2 browser tests passed, including the immutable-edition checks.
- **Entry 11 and feedback 32 passed.** Build leaves no uncommitted change.
- **Earlier edition:** `public/ai/releases/2026-11-06.1/context.md` is unchanged (SHA-256 `98d63d54…eb9c452b`).
- **Web-server configuration:** `caddy validate` reports a valid configuration.
- **Not tested with a real AI service.** Whether a given AI follows the text is not verified.

After merge and publication: see the comment on [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## Remaining limits and questions

- **Wording is not approved.**
- **The Cloudflare rule is not applied.** Until it is, some automated fetches of the pinned edition path may be challenged; the `/ai/` page tells learners to paste the text if a link cannot be read.
- **The role name `portfolio-bridge`** still appears in the manifest and the context text. Renaming it changes the schema and is left for later.
- **Publishing needs a restart of the `orientation-web` user service**, a pause of about a second on the preview.
