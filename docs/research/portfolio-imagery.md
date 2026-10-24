# Abstract images for the "Working with me" questions

Recorded 23 October 2026. The images are project assets only. They are not yet on the portfolio page, in the generated copies or in Moodle.

## Need

Finlay asked for abstract images that suggest an "AI feel" and work a little like a Rorschach card. Each image would sit beside one of the three "Working with me" questions in `content/portfolio.html`:

| Field | Question |
| --- | --- |
| `portfolio-about` | What would you like your assistant to know about you? |
| `portfolio-preferences` | How would you like your assistant to explain things or write for you? |
| `portfolio-boundaries` | What should your assistant check with you before doing or assuming? |

Open self-description is the hardest part of the portfolio for many learners. The intent is a quiet visual prompt that suggests a way into each question. The image is not an answer and not a test.

## Constraints

- Decorative but relevant. Research on "seductive details" finds that interesting material unrelated to the learning goal can reduce learning. See Harp and Mayer (1998) and the Rey (2012) meta-analysis. Each image must therefore point at its question and stay small. These sources do not show that these images help. They only warn against images that distract.
- The page must work without the images. The no-JavaScript, copy/paste, fictional-example and bring-your-own-AI routes stay as they are.
- No external requests, no fonts, no tracking and no learner data in the files.
- Small files, readable at small sizes, and on-brand with the course palette (paper `#f6f7f4`, ink `#20332f`, green `#176b60`, amber `#b96622`).

## Decision

Nine trial images were made, three directions per question, and compared on one sheet. Finlay chose:

| Question | Chosen image | Idea |
| --- | --- | --- |
| About you | `about-window.svg` (1b, "One lit window") | After Magritte: a day sky over a dark house with one lit window. You decide what shows. |
| How to explain and write | `preferences-ribbon.svg` (2c, "Changing ribbon") | One line that changes from crisp dashes to dots to a soft wash: one subject, many styles. |
| What to check first | `boundaries-stones.svg` (3a, "Stepping stones") | One stone part-way across glows amber: a point to pause before going on. |

All nine are kept. Finlay raised the idea of alternating or rotating them so that a return visit looks different, and also said "we're probably overthinking it". The alternates stay available for that choice. They are not a commitment to a slideshow.

The images are hand-made SVG from a seeded, standard-library Python script. No image-generation API was available in this workspace. SVG is also small, editable, reviewable as text and reproducible.

## Change

- `scripts/build-portfolio-imagery.py` builds all nine files. It is seeded, so a rerun gives the same bytes.
- `public/assets/portfolio-imagery/` holds the output. Caddy serves it at `/assets/portfolio-imagery/<name>.svg`.

| File | Size | `<title>` |
| --- | ---: | --- |
| `about-window.svg` (chosen) | 2.3 KB | A daylight sky above a dark house where one small window is lit |
| `about-pebbles.svg` | 23 KB | A pale shoreline of faded pebbles, with four bright, different pebbles gathered together |
| `about-fragments.svg` | 2.6 KB | A few torn paper shapes in different colours laid on a mostly empty page |
| `preferences-ribbon.svg` (chosen) | 50 KB | One flowing line that changes from crisp dashes to scattered dots to a soft wash |
| `preferences-textures.svg` | 63 KB | The same circle three times: as crisp rings, as a soft watercolour wash and as coloured dots |
| `preferences-marks.svg` | 7.5 KB | Rows of marks, from short tight ticks at the top to long, loose brushstrokes at the bottom |
| `boundaries-stones.svg` (chosen) | 5.9 KB | Stepping stones across pale water; one stone part-way along glows amber |
| `boundaries-door.svg` | 2.2 KB | A door standing alone in an open field, slightly open, with warm light behind it |
| `boundaries-ladder.svg` | 2.7 KB | A ladder standing in a field and reaching toward a cloud; its top rung glows amber, short of the cloud |

Each file is 400 × 400, with `role="img"`, `aria-labelledby="t"` and a `<title id="t">`. The files reuse internal ids (`t`, `rough`, `wash`, `soft`, `glow`, `day`). Place them with `<img>`, not inline, or the ids will collide.

No page, builder, Moodle sync, test, CONTROL.md or learner documentation was changed. Other uncommitted work is editing `content/portfolio.html`, its generated copies, `docs/curriculum/portfolio-builder.md` and `CONTROL.md`. Those records will be updated when the integration issue is done.

## Verification

- A rerun of the generator gives files byte-identical to the reviewed trials.
- All nine files contain a `<title>`. The only URL in any file is the SVG namespace.
- Finlay reviewed the images on a comparison sheet and chose 1b, 2c and 3a.
- No learner has seen these images. There is no pilot or usability evidence.

## Remaining questions

- One static image per question, or a rotation through the alternates? A rotation must respect `prefers-reduced-motion` and work without JavaScript (for example, a static default).
- Captions: show a short caption, or keep the image silent and decorative (`alt=""`)? If an image carries meaning, its alt text must say what the learner needs, not only describe the picture.
- Display size and placement at phone width (390 px) and desktop width (1440 px).
- Should the images also appear in the Moodle copy of the activity?
- `preferences-ribbon.svg` is about 50 KB. It can be made smaller (fewer dots, rounded coordinates) without a visible change.
- Do the images help, distract or confuse? Ask in the next pilot, and record what learners actually say.
