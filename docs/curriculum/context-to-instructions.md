# From personal context to useful instructions

Draft activity design, 13 October 2026. Fits inside MVP activities 2 and 3; file installation is an optional extension. The core output is reusable personal and project guidance that the learner understands and can test.

## Purpose and explanation

A context portfolio is your own collection of useful information about your goals, circumstances and ways of working. An instruction brief selects the parts that matter for a particular interaction and explains how you want the AI to help.

Some agent tools read instructions from specially named plain-text files. `CLAUDE.md` is a convention used by Claude Code; `AGENTS.md` is used by Codex and other supporting tools. The `.md` ending denotes Markdown, text that can include simple headings and lists. You can draft these instructions without knowing code. Their content can concern writing, planning or other work as well as software.

Saving a file does not make every AI app read it. A regular chat can use the same text when you paste it into the conversation. A tool's instruction feature may let you reuse it across interactions. The learner must know which route they used. Instructions guide behaviour; they do not guarantee compliance or permanently train a model.

## Guided task

1. Choose two useful details from your portfolio and one detail to leave out. Explain why each belongs or does not belong in this task.
2. Draft a short personal brief: how you want help, relevant preferences, and what the AI should ask or check with you.
3. Draft a short project brief: purpose, relevant information, constraints and what a useful result looks like. Keep project-only details out of the general personal brief.
4. Use the briefs in a small task through a fresh chat or a supported instruction feature. Before starting, predict one observable behaviour you expect.
5. Inspect the result. Identify a helpful instruction, a missing detail or an instruction to change. Explain your decision and save your revision.

Use a fictional scenario if preferred. Do not put a whole personal history into a shared project file. AI assistance with drafting is fine; ask the learner to explain and edit at least one choice themselves.

## Original example: planning a community event

Personal guidance:

```text
Use plain language and explain unfamiliar terms.
Give me a short first step before a longer plan.
If an important detail is missing, ask me rather than inventing it.
Help me notice which parts of the result I need to check myself.
```

Project guidance:

```text
We are planning a small community event.
Help me prepare a simple checklist and draft invitation.
The date and venue are not confirmed. Label them as undecided.
A useful invitation explains the purpose and leaves clear spaces
for the details I still need to confirm.
```

Check: did the draft invent a venue or date? Did it make the missing details clear? What would you change in the instructions or your own approach? One successful result does not establish that an instruction will always be followed.

## Optional file route

Choose a route only if the learner already uses a supporting agent or wants this extension. Show saving the appropriate filename, choosing personal versus project scope, inspecting the loaded instruction sources where the tool permits it, and running the small task. File loading and observed behaviour are separate checks; an AI claiming it read a file is not sufficient evidence on its own.

| Tool | Verified authoring reference | Teaching implication |
| --- | --- | --- |
| Codex | [Official AGENTS.md guide](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | Supports global and project instructions with documented discovery and precedence. Use a current, device-specific demonstration; do not require a terminal for core completion |
| Claude Code | [Official memory and instruction guide](https://code.claude.com/docs/en/memory) | Supports personal/project `CLAUDE.md`; current docs also describe direct project `AGENTS.md` support from v2.1.277, with conditions involving existing Claude instruction files, settings and session type. Check the installed tool before showing exact steps |
| Other chat/agent apps | Current documentation for the learner's actual app | Do not assume either filename loads automatically. Paste selected guidance or use a supported instruction feature, and explain its scope |

Verified 13 October 2026 through documentation; no product behaviour was tested in this authoring pass. Recheck before publishing a walkthrough. Keep example downloads separate from this project's operational agent instructions.

## Evidence and next step

Retain two short briefs plus a reflection: what I expected, what happened, what I changed or kept, and why. Learners may retain the private content themselves and report only a non-sensitive explanation to the course.

This is an introduction to selecting context and monitoring one's own strategies. It does not certify mastery of context engineering. Reuse a brief with the next goal in the [takeaway](orientation-takeaway.md), and review it when the goal or circumstances change.
