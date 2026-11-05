# Obsidian quick setup

## For the queued reviews: no template copying needed

Open [[Review queue]] and choose the first note. Its page, link and review focus are already filled in. Use the three prompts; the longer templates remain optional for a detailed review.

## Date when you actually start — built-in plugin

1. In Obsidian Settings → Core plugins, enable **Templates**.
2. In Templates settings, set **Template folder location** to `evaluation/templates` (relative to this vault).
3. Put the cursor beside **Started:** in the prepared review note.
4. Open the command palette with **Cmd+P**, choose **Templates: Insert current date**. Optionally assign a convenient unused shortcut under Settings → Hotkeys.

For a combined timestamp including the Mac's current timezone offset, put the cursor on a blank line, choose **Templates: Insert template**, then **Review started**. Its date/time placeholders expand at insertion, not when the file was seeded or synced. Choose either the date command or this snippet; you do not need both.

Core Templates does not automatically detect the first time you type in a note. This deliberate command is a simple alternative to installing an automation plugin and prevents creation/sync dates being mistaken for review dates. On later sessions, add another timestamp if useful rather than replacing the first one.

## Reduce other friction

- Keep the review note beside the browser; dictate rough observations if easier. No polished wording needed.
- Mention a section heading or short quote rather than preparing a screenshot.
- Leave untouched criteria unreviewed; the agent maps your observations into the framework.
- Use the Ready for triage checkbox instead of editing YAML properties.
- Bookmark [[Review queue]] using Obsidian's Bookmarks core plugin if desired.
- Do not install Tasks or Templater just for this workflow: ordinary Markdown checkboxes and core Templates are sufficient.

The Mac's `.obsidian` settings stay local and have not been changed by these VPS edits. This guide is based on [Obsidian's official Templates documentation](https://help.obsidian.md/plugins/templates); local GUI operation is not verified here.
