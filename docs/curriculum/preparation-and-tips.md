# Preparation and Finlay’s tips

Decision: 13 October 2026. Finlay requested computer/file foundations before the AI brief, a small diagnostic or scavenger hunt, and contextual tips recommending Obsidian with a setup guide.

## Learning sequence

1. Optional self-assessment: can I find a download, place it in a chosen folder, reopen it and explain the difference between a path and access?
2. A short map and separate Finder / Windows File Explorer instructions.
3. A real fictional Markdown download: locate, copy, rename, open, close and find again. Success is demonstrated through the learner's own action rather than merely recognising terminology.
4. Transfer to AI: distinguish pasted content, attachments and an agent with workspace access. Locate and open an output rather than accepting a claim that it was saved.
5. Three self-checks with answer explanations. Learners decide whether to revisit or continue. No score, hidden tracking, enforced gate or claim of verified mastery.
6. Optional Obsidian setup: open the same practice folder as a vault, create a context note, find it in the file manager and selectively share text. Then continue to the existing AI lesson.

This is a scaffold for the existing task-based course, using prior-knowledge diagnosis, a worked example, practice and metacognitive checking. It does not introduce a second theoretical framework or require every learner to repeat familiar basics. Phone/restricted-device learners have an explicit read-through route and can defer desktop practice; this is not reported as equivalent evidence of practical performance.

## Tip pattern

- Label **Finlay’s tip · [specific action]** at the point of need. Keep spelling consistent with Finlay's existing site identity.
- Use an inline `blockquote.finlay-tip` containing a short recommendation, its practical reason and a guide link. Do not interrupt reading with an automatic modal or time-triggered pop-up.
- Distinguish Finlay's preference from a course requirement and independently sourced product facts.
- Initial placements: Obsidian beside “Keep three things separate”; a notes-home tip during the file hunt; reopening a result when discussing AI output locations.
- Tips and guides must work by keyboard and without JavaScript. Future tips should follow the same small pattern rather than adding a tooltip library.

## Authoring and delivery

The two guides share source fragments in `content/computer-basics.html` and `content/notes-guide.html`. `npm run build:preparation` wraps them for the public routes `/before-you-start` and `/notes`. `scripts/php scripts/sync-preparation.php` adds or updates the native Moodle Page resources in section zero and updates only the first three explanatory pages of the existing lesson from `content/useful-context.json`. Internal guide/lesson links are adapted to native Moodle URLs there. The public preview has the matching tip and preparation link.

The sync script checks hashes of learner attempts, grades, branch/timer records, completion and lesson answers inside a transaction. It preserves lesson page IDs, answer order and navigation. Preparation pages have no completion claim. Authentication, enrolment and outgoing mail settings are not changed. Re-running does not create duplicate Page resources.

The public AI context is now release `2026-10-13.2`, with preparation links and guidance against claiming file access or saved results without evidence. The previous release remains intact and routable. Caddy exposes only the named fictional download, not arbitrary Markdown files or folders.

## Fact checks and limits

Official documentation inspected on 13 October 2026 using TinyFish:

- [Obsidian licence](https://obsidian.md/license): free use, no account required for local use, proprietary app rights. “Open-source app” is not the description used in the course.
- [Install](https://help.obsidian.md/install), [create/open a vault](https://help.obsidian.md/vault), [create a note](https://help.obsidian.md/create-note), [file storage](https://help.obsidian.md/data-storage): local Markdown files, ordinary folders and optional sync. We do not make a universal claim that models “prefer” Markdown.
- [Finder folders](https://support.apple.com/guide/mac-help/organize-files-with-folders-mh26885/mac), [Finder paths](https://support.apple.com/guide/mac-help/get-file-folder-and-disk-information-on-mac-mchlp1774/mac), [copy a pathname](https://support.apple.com/guide/terminal/specify-files-and-folders-apd3cf6fe02-3ec8-48f1-951f-866e52955fc8/mac).
- [Microsoft File Explorer](https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows): Windows+E, known folders, navigation and file extensions. Labels differ across Windows versions.

The wording distinguishes cloud-synchronised Documents folders, local notes and AI context. A vault is not an encryption boundary; sync is not a substitute for a recoverable backup. Installation and Finder/File Explorer instructions are documentation-grounded, not a claim that this Linux-hosted browser test ran native Mac/Windows software. Obtain a human walkthrough on each OS during pilot evaluation, including finding the downloaded file and the saved Obsidian note. Review links with other provider instructions during weekly maintenance.


## From computer controls to AI instructions

The initial resource now ends with `content/ai-interface.html`: roughly 10–15 minutes after the 10–15-minute computer foundations. Learners inspect message/send/new-chat/history/attachment/voice controls; choose a useful task; give an instruction; check and clarify. Text, spoken instruction, a document and a picture are practice routes, not four completion gates. Learners explore a second input when accessible. The same fictional event works across routes, with the existing downloadable note and a photo of learner-written fictional facts. A text fallback handles unsupported uploads and inaccessible voice/picture features.

The dated provider table is shared from `content/free-tools-table.html`. `public/assets/ai-interface.js` progressively adds copy controls to four editable examples; clipboard failure selects the field. Text edits remain only on the current page, with an explicit copy-before-leaving note. There are no form names, account submissions, storage writes, recordings, uploads or model calls. Static details and textareas work without JavaScript. The table uses row/column headings and a labelled keyboard-scrollable region on small screens.

Build with `npm run build:preparation`, then `scripts/php scripts/sync-preparation.php`. This updates the public guide/table and native preparation Page using supported footer assets. No new route or Moodle core change is required. Operational checks should cover both views, four copy actions, clipboard denial, mobile scrolling, no-JavaScript reading and the existing learner completion journey. Real-device voice/upload practice and learner understanding remain human-pilot work.


## Revision — 14 October 2026: a tour of an agent’s workspace

**Feedback and decision.** Finlay found the preparation tone helpful and asked for a clearer reason to learn the file-system basics: understanding how an agent finds material, uses paths, saves results and returns to instructions, memories and settings. He also asked to foreground the Mac pathname command he uses when directing agents. The existing command was already in “Find its address”; the revision brings it beside Show Path Bar and explains Option versus Control-click.

**Change.** The shared preparation fragment and public page now open with the agent-workspace narrative, connect file tools and computer-use navigation to the folder map, and include a Finlay tip based on his stated pathname practice. A short “Where does your helper keep its notes?” section distinguishes instructions, saved memory and settings and bridges to the context portfolio. Karpathy’s ghost metaphor is explicitly figurative; the text explains tool access and that a model may run remotely. The existing no-account, restricted-device, copy/paste and no-JavaScript routes remain available.

**Sources.** Rechecked [Apple’s pathname instructions](https://support.apple.com/guide/terminal/specify-files-and-folders-apd3cf6fe02-3ec8-48f1-951f-866e52955fc8/mac). The short ghost quotation is from section 4 of [Karpathy’s 2025 LLM Year in Review](https://karpathy.bearblog.dev/year-in-review-2025/), discussing Claude Code. [Claude Code memory](https://code.claude.com/docs/en/memory) and [settings](https://code.claude.com/docs/en/settings) provide a concrete example, not a universal storage convention. These sources were read on 14 October 2026.

**Publication.** Rebuilt the public page with `npm run build:preparation`. Updated only the existing Moodle preparation Page (module 2) through `page_update_instance`, after matching its previous content to the rendered source. Kept the existing suffix and navigation. Read-back matched the new content; before/after fingerprints confirmed unchanged learner attempts, grades, branch/timer records, lesson answers, module/course completion and course-completion criteria. The broader preparation sync was not needed for this content-only revision.

**Verification.** Synthetic Chromium checks against public HTTPS passed at 1440px and 390px, each with JavaScript enabled and disabled: updated content visible, Mac pathname instruction present, no page overflow, internal anchors resolve, self-check disclosure opens, and the fictional practice download returns the expected text. `git diff --check` passed. This was a content-only revision; no application behavior changed and no new persistent test suite was added. Moodle verification covered the stored content and preserved records; a fresh authenticated browser journey was not rerun.

**Remaining evidence.** Native Finder/File Explorer steps still need human walkthroughs on Mac and Windows. The expanded narrative and time estimate need learner feedback; browser checks do not establish comprehension or learning gain.
