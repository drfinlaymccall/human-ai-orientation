# Course glossary and finding your workspace — proposal

Updated: 14 October 2026 (Australia/Sydney). Status: pre-populated proposal, not a published course page. The definitions below are draft original course wording; linked product documentation was checked on this date. Menu names and locations need a final check in the target app and operating system before screenshots and publication.

## Purpose and learner outcome

Finlay requested a shared glossary so unfamiliar words throughout the course lead to an explanation, a concrete example and help finding the thing being described. The immediate example is “the agent's workspace”: learners need to distinguish their own files, the agent's working folder, app settings and remote storage.

**Objective:** After using this resource, you can explain a term encountered in the course, locate the relevant file or app control when applicable, and return to your task.

**Personal connection:** “I want to find my notes, understand where my AI is working, and retrieve the result.” Learners can connect the glossary to another existing personal goal.

Proposed can-do statements: “I can distinguish a working folder from a settings folder”; “I can locate a file using its path”; “I can identify whether a result is on my computer or elsewhere”; “I can find and explain the purpose of an instruction file used by my chosen tool.” Reading an entry records resource engagement only; practical self-checks feed the proposed competence map.

## Page pattern and links through the course

Propose one public `/glossary` page with stable term anchors, an alphabetical index and grouped browsing: files and places; working with AI; context and instructions; learning and progress. Link the first meaningful use of a term on each course page to its definition, and provide backlinks from the definition to the activity. Use ordinary links that work with keyboards, phones and without JavaScript; optional search is an enhancement.

Each entry has a short definition, an example, related terms, a course-practice link and an authoritative source where applicable. Terms that are specific to this course link to the course's own definition. Add “Where to find it” and an annotated image only where those help. Product-specific entries name the app, mode, operating system and verification date. Do not make learners read the entire glossary or install an agent to complete the course.

The anchors in this draft are proposed stable IDs for the eventual page. `/glossary` is not live yet. Current course practice links below point to the existing public site; authoring links point to repository documents.

## Starter term bank

### Files and places

| Term and proposed anchor | Draft definition and example | Definition or further guidance |
| --- | --- | --- |
| <a id="file"></a>File | A named item containing information, such as a note, image or document. Example: `My context.md`. | [Course file map][files-course]; [Microsoft File Explorer][windows] |
| <a id="folder"></a>Folder / directory | A container used to organise files and other folders. “Directory” is another name for it. | [Course file map][files-course]; [Apple folder navigation][mac] |
| <a id="path"></a>Path / file address | Directions to a file or folder in a particular filesystem. An absolute path gives its full location; a relative path starts from another folder. A path is not automatically a shareable web link. | [Apple path guidance][mac]; [Course practice][files-course] |
| <a id="home-folder"></a>Home folder | The personal folder belonging to an operating-system user. On Mac/Linux, `~` is commonly used to refer to it. It is distinct from the folder selected for a particular task. | [Apple home/path guidance][mac]; [Windows and Linux locations][wsl] |
| <a id="hidden-files"></a>Hidden file / dotfolder | An item omitted from normal file listings. Mac/Linux commonly hide names beginning with a dot; Windows has a separate hidden attribute. `.claude` is a folder name, not a filename extension. | [Obsidian visibility instructions][obsidian-storage]; [Windows view options][windows]; [Windows attributes][attributes] |
| <a id="file-extension"></a>Filename extension | The ending that usually indicates a file's format: `.md`, `.pdf`, `.json`. Showing extensions helps distinguish `CLAUDE.md` from `CLAUDE.md.txt`. | [Show extensions in Windows][windows]; [Markdown syntax][markdown] |
| <a id="markdown"></a>Markdown / `.md` | Plain text using simple marks for formatting, such as `#` for a heading. It can be opened as text without Obsidian. | [Obsidian Markdown guide][markdown] |
| <a id="vault"></a>Obsidian vault | The folder containing your Obsidian notes and subfolders. It is an ordinary folder you choose, not a special encrypted container. | [Create a vault][vault]; [Course notes guide][notes-course] |
| <a id="obsidian-folder"></a>`.obsidian/` | Obsidian's configuration folder inside a vault, holding settings for that vault. Your Markdown notes live elsewhere within the vault. | [How Obsidian stores data][obsidian-storage] |
| <a id="workspace"></a>Agent workspace / working folder | The place an agent is working with files for a task. It may be a local folder, a separate working copy or a remote environment. Always identify both the computer/environment and the folder. | [Finding it below](#find-your-workspace); [Claude Code overview][claude-overview]; [Codex local environments][codex-local] |
| <a id="local-remote"></a>Local / remote / cloud | Local means on the computer in question; remote means on another computer or service. A file produced remotely may need downloading before it appears on your computer. | [Course file handoff][handoff-course]; [Windows/WSL distinction][wsl] |
| <a id="upload-download"></a>Upload / download / attachment | Uploading sends a file to a service; downloading saves a copy from a service. An attachment is a file added to a message or task. Check which copy you are editing. | [Course file handoff][handoff-course]; [Providing context to ChatGPT][prompting] |
| <a id="sync-backup"></a>Sync / backup | Sync keeps copies aligned; a backup provides a recoverable copy. A deletion may also sync, so syncing alone does not establish recoverability. | [Course notes and backup guidance][share-course] |
| <a id="repository"></a>Repository / repo | A project collection whose files and change history can be managed together. It is optional background for instruction-file examples in this course. | [Course public-source explanation](public-ai-context.md#public-site-and-public-github) |

### Working with AI and keeping useful context

| Term and proposed anchor | Draft definition and example | Definition or further guidance |
| --- | --- | --- |
| <a id="ai-model"></a>AI model / AI app | The model generates or interprets content; the app provides the interface, tools and settings around it. The app's available tools affect what it can actually do. | [Course AI interface][interface-course]; [Claude Code example][claude-overview] |
| <a id="agent"></a>AI agent | In this course, an AI system that can use tools and carry out steps toward a task. Its access depends on its tools and permissions. | [Claude Code examples][claude-overview]; [Course file-access example][handoff-course] |
| <a id="prompt"></a>Prompt / follow-up | A message giving the AI a task, question, context or correction. A follow-up continues or refines the work. | [OpenAI prompting guidance][prompting]; [Course practice][interface-course] |
| <a id="context"></a>Context | Information available to the AI for the current task: your message, supplied material and any other information the app actually makes available. Information merely stored somewhere is not necessarily available. | [OpenAI context guidance][prompting]; [Course public context](public-ai-context.md#purpose) |
| <a id="personal-context"></a>Personal context | Relevant information about you, such as goals, preferences or constraints, which you choose to use for a task. It need not be a complete biography. | [Course portfolio definition](portfolio-builder.md#learning-sequence); [Portfolio practice][portfolio-course] |
| <a id="project-context"></a>Project context | Information about a particular undertaking: purpose, audience, source material, constraints and what a useful result would look like. | [Course context-to-instructions guide](context-to-instructions.md#purpose-and-explanation); [Portfolio practice][portfolio-course] |
| <a id="context-brief"></a>Context brief | A short selection of relevant context prepared for one task or conversation. It is drawn from the portfolio rather than automatically including everything. | [Course takeaway](orientation-takeaway.md); [Portfolio practice][portfolio-course] |
| <a id="personal-context-portfolio"></a>Personal context portfolio | In this course, your reviewed, reusable collection of working preferences, project context and useful knowledge, retained in a form you can retrieve and take with you. | [Course portfolio definition](portfolio-builder.md#why-this-unit-exists); [Portfolio builder][portfolio-course] |
| <a id="instructions"></a>Instructions / instruction file | Guidance about how to work, such as “ask before inventing a missing date.” Some tools load it from named files; others provide app controls. | [Course instructions activity](context-to-instructions.md); [AGENTS.md][agents]; [CLAUDE.md][claude-memory] |
| <a id="memory"></a>Memory | Information an app retains and may use later. Its storage, scope and controls differ by product; a model saying “I remember” is not a complete audit. | [Claude Code instructions and auto memory][claude-memory]; [Course distinctions][agent-home-course] |
| <a id="settings"></a>Settings / configuration | Controls affecting how an app operates. They may appear in a settings screen or structured files; they serve a different role from natural-language instructions. | [Codex configuration][codex-config]; [Claude Code settings][claude-settings] |
| <a id="scope"></a>Scope: user / project | Where a setting or instruction applies. User-level guidance can apply across projects; project-level guidance applies within a particular project. Actual loading rules depend on the tool. | [Codex instruction discovery][agents]; [Claude directory guide][claude-directory] |
| <a id="claude-folder"></a>`.claude/` | A Claude Code configuration/data folder. `~/.claude/` is user-level; a project's `.claude/` holds project-specific material. These are distinct from the project's working files. | [Claude directory reference][claude-directory] |
| <a id="claude-md"></a>`CLAUDE.md` | A Markdown instruction file used by Claude Code. It can supply personal or project guidance according to its location. The exact capitalisation matters; this is not the `.claude/` folder. | [Claude Code memory and instructions][claude-memory] |
| <a id="codex-folder"></a>`.codex/` | A Codex configuration/data folder. User-level state normally lives in `~/.codex/`; project configuration may live in the project's `.codex/`. | [Codex config basics][codex-config]; [Codex home and state][codex-advanced] |
| <a id="agents-md"></a>`AGENTS.md` | A Markdown file containing guidance for supporting agents. Codex documents rules for discovering personal and project instructions; the name alone does not guarantee every AI reads it. | [Official AGENTS.md guidance][agents]; [Course file route](context-to-instructions.md#optional-file-route) |
| <a id="settings-files"></a>`settings.json` / `config.toml` | Structured settings files used by Claude Code and Codex respectively. JSON and TOML are different formats for named values. These files are not interchangeable with instruction notes. | [Claude settings][claude-settings]; [Codex configuration][codex-config] |
| <a id="app-project"></a>Project inside an AI app | A product feature grouping related work and context. It may contain uploaded knowledge or connect to a local folder; it is not a universal synonym for a filesystem folder. | [Claude projects][claude-projects]; [OpenAI project context][prompting] |
| <a id="permissions"></a>Permissions / sandbox | Permissions govern access or actions; a sandbox restricts the environment in which actions run. Writing “do not read this” in a note does not itself enforce file permissions. | [Codex Windows sandbox][codex-windows]; [Claude settings][claude-settings] |
| <a id="source-verification"></a>Source / verification | A source supplies information; verification means checking a claim or result against suitable evidence. An AI's confident wording does not establish correctness. | [Course checking activity][check-course]; [Portfolio sources][portfolio-course] |

### Learning and progress

These definitions use the course's [proposed competency framework](../design-brief.md#course-wide-objectives-and-competencies--14-october-feedback). They describe intended learning support, not features already implemented.

| Term and proposed anchor | Draft course definition | Related practice or definition |
| --- | --- | --- |
| <a id="learning-objective"></a>Learning objective | What a resource or activity intends to help you become able to do. | [Course objectives proposal][competence-proposal] |
| <a id="personal-objective"></a>Personal learning objective | A capability you want to develop for a reason that matters to you. | [Goal and portfolio practice][portfolio-course] |
| <a id="competency"></a>Competency / can-do statement | A capability expressed as an observable action, such as “I can find and reopen my note.” | [Course worked example][competence-proposal] |
| <a id="self-assessment"></a>Self-assessment / starting-point quiz | Your judgement of current ability, informed by questions, attempts and evidence. A quiz can suggest a starting point; you can flag guesses and still choose practice. | [Optional entry assessment](../design-brief.md#optional-entry-self-assessment-find-your-starting-point) |
| <a id="evidence"></a>Evidence / success criterion / rubric | Evidence is what supports a capability claim; a criterion describes success; a rubric makes the criteria and performance descriptions explicit. | [Course checking activity][check-course]; [AI-assessment proposal][competence-proposal] |
| <a id="competence-map"></a>Competence map | Your proposed view of existing strengths, developing skills and next practice, linked to course resources and personal goals. | [Course map proposal][competence-proposal] |
| <a id="completion"></a>Completion / competence | Completion records an activity's progress. Competence concerns what you can do; reading or clicking complete alone does not establish it. | [Course progression and evidence](../design-brief.md#implemented-progression-and-evidence) |
| <a id="evaluation"></a>Course evaluation | Feedback about the learning experience, such as usefulness or clarity. It helps improve the course and is separate from judging a learner's capability. | [Course evaluation design](../design-brief.md#proposed-evaluation) |

## Find your workspace

Start with the exact app and mode: Claude chat/projects, Claude Code, Codex, or another agent. Then identify whether the task runs on this computer or elsewhere. A company name alone does not identify the storage arrangement.

| Situation | How to orient yourself | What to check |
| --- | --- | --- |
| Claude Code in a local terminal | The directory where you start `claude` is the starting project directory. Inspect your terminal's current location and the project you opened. | [Official starting steps][claude-overview]. Settings under `~/.claude` are separate from project work. |
| Codex with a local folder | Identify the folder selected for the task and whether it uses a separate worktree. Ask for the current full working path, then open it. In a terminal, `pwd` (Mac/Linux) or `Get-Location` (PowerShell) displays the current location. | [Local environment/worktree guidance][codex-local]. The terminal must belong to the relevant environment; your laptop's terminal cannot reveal a remote agent's current directory. |
| Claude project in the web app | Open Projects, select the project, then inspect its project knowledge and instructions. | [Official navigation][claude-projects]. Uploaded project knowledge is not the local `~/.claude` folder. |
| ChatGPT project or task | Identify the files, sources or local folder supplied to that project/task, then check where the specific output was saved. | [Official context guidance][prompting]. Do not assume every app mode exposes a local working folder. Exact UI screenshots remain a publication task. |
| Remote/cloud session | Ask which environment holds the file and for the full path plus a usable download or transfer route. Open the transferred result to confirm it. | [Course handoff exercise][handoff-course]. A remote path is not an address Finder can necessarily open. |
| Windows with WSL | Confirm whether the agent runs natively in Windows or inside a Linux distribution. In the relevant WSL directory, `explorer.exe .` opens that location in File Explorer. | [Microsoft filesystem guide][wsl]. WSL has its own Linux home; do not substitute the Windows home automatically. |

Suggested learner prompt:

> Which computer or environment are you working in? What is the full path of your current working folder? Where did you save this result, and how can I open or download it? Please report what you can verify and say what you cannot inspect.

Check the answer by opening the actual file. The prompt is an orientation aid, not proof by itself.

## Find hidden folders and instruction files

### Mac

In Finder, use **Go → Go to Folder**, enter a path such as `~/.claude/` or `~/.codex/`, and press Return. To show hidden items while browsing, use **Command+Shift+Period**. The tilde means your home folder. These instructions combine [Apple's path navigation][mac] with the shortcut documented by [Obsidian][obsidian-storage].

### Windows

In File Explorer on Windows 11, choose **View → Show → Hidden items**; also turn on **File name extensions**. Enter `%USERPROFILE%\.claude` in the address bar for Claude Code's default native user folder. For a default native Codex installation, look for `.codex` within your user home; confirm the active Codex home if it has been changed. Windows uses a hidden attribute, so a leading dot does not by itself mean an item will be hidden. [File Explorer instructions][windows], [Claude's documented Windows path][claude-directory], [Codex home][codex-advanced], [Windows attributes][attributes].

If the folder does not exist, confirm the product, account, environment and configured location; do not create one merely to satisfy this exercise. `CLAUDE_CONFIG_DIR` can relocate Claude Code's configuration and `CODEX_HOME` can relocate Codex's. A web-only chat user may have neither folder.

| Item | What to look for | Purpose |
| --- | --- | --- |
| Claude Code personal configuration | `~/.claude/settings.json` | User-level app settings. |
| Claude Code personal instructions | `~/.claude/CLAUDE.md` | User-level written guidance. |
| Claude Code project configuration | `.claude/settings.json` inside the project | Project settings; `.claude/settings.local.json` holds local overrides. |
| Claude Code project instructions | `CLAUDE.md` or `.claude/CLAUDE.md` inside the project | Project guidance. |
| Codex personal configuration | `~/.codex/config.toml` by default | User-level app settings. |
| Codex personal instructions | `~/.codex/AGENTS.md` by default | User-level guidance, subject to documented overrides. |
| Codex project configuration | `.codex/config.toml` inside the project | Project settings, loaded according to trust and precedence rules. |
| Codex project instructions | `AGENTS.md` in the project hierarchy | Guidance selected according to discovery rules. |

Source details: [Claude settings][claude-settings], [Claude instructions][claude-memory], [Codex config][codex-config], [Codex instructions][agents]. The examples use exact names: lowercase `.claude` and `.codex`, uppercase `CLAUDE.md` and `AGENTS.md`. `~/.claude.json` is another application file, not the `.claude/` directory. Introduce that distinction only if learners encounter it; the full [directory reference][claude-directory] is available for deeper exploration. Configuration directories can also contain private histories or authentication material; the exercise is to locate and identify selected files, not upload the whole directory.

## Visuals to prepare for publication

Use genuine captures with fictional example files, labelled with app/mode, operating system, version and capture date. Provide alt text and the same navigation as text. No screenshots have been captured for this proposal.

| Visual | What the annotations should make clear |
| --- | --- |
| Finder: example project and Go to Folder | Project working files versus the home-level `.claude`/`.codex` directories; where to paste a path. |
| Windows File Explorer | Address bar, Hidden items and File name extensions; a visible `.md` file. |
| Claude Code local session | Active project location and an actual saved result; settings and instructions labelled separately. |
| Codex local task | Selected folder or worktree and a saved file that can be opened; clearly identify the running environment. |
| Claude web project / ChatGPT project | Where supplied knowledge/files and instructions appear, labelled by the actual product surface. Avoid implying an uploaded collection is a local disk folder. |

## Publication and verification queue

1. Review the starter bank for beginner relevance and add terms found during the course-page audit. Keep API, MCP, tokens and plugin internals as later entries unless a learner-facing activity needs them.
2. Publish the glossary from shared content to the public site and Moodle; map links to the appropriate surface. Preserve stable anchors and add links from `/before-you-start`, `/notes`, `/portfolio`, activity pages and resource descriptions.
3. Capture the real interface examples and perform Mac/Windows walkthroughs. This proposal's path checks are documentation-based, not completed OS usability tests.
4. Connect the glossary objective and practical self-checks to the proposed competency bank. A learner should be able to follow “workspace” from an activity, identify the environment, locate/retrieve a fictional result and return to the activity.
5. Check every term link, keyboard navigation, no-JavaScript reading, mobile layout and accessible alternatives to images. Recheck product entries when the relevant UI or documentation changes.

Open choices: precise visual treatment, initial screenshot versions and delivery priority. The starter definitions and sources are populated now; publishing the page and adding screenshots remain queued.

[files-course]: https://orientation.finlaymccall.com/before-you-start#map
[handoff-course]: https://orientation.finlaymccall.com/before-you-start#ai-files
[agent-home-course]: https://orientation.finlaymccall.com/before-you-start#agent-home
[interface-course]: https://orientation.finlaymccall.com/before-you-start
[notes-course]: https://orientation.finlaymccall.com/notes
[share-course]: https://orientation.finlaymccall.com/notes#share
[portfolio-course]: https://orientation.finlaymccall.com/portfolio
[check-course]: https://orientation.finlaymccall.com/check-and-continue
[competence-proposal]: ../design-brief.md#course-wide-objectives-and-competencies--14-october-feedback
[mac]: https://support.apple.com/en-au/guide/mac-help/mchlp1236/mac
[windows]: https://support.microsoft.com/en-us/windows/experience/fileexplorer/file-explorer-in-windows
[attributes]: https://learn.microsoft.com/en-us/windows/win32/fileio/file-attribute-constants
[wsl]: https://learn.microsoft.com/en-us/windows/wsl/filesystems
[vault]: https://obsidian.md/help/vault
[obsidian-storage]: https://obsidian.md/help/data-storage
[markdown]: https://obsidian.md/help/syntax
[claude-overview]: https://code.claude.com/docs/en/overview
[claude-directory]: https://code.claude.com/docs/en/claude-directory
[claude-settings]: https://code.claude.com/docs/en/settings
[claude-memory]: https://code.claude.com/docs/en/memory
[claude-projects]: https://support.claude.com/en/articles/9519177-how-can-i-create-and-manage-projects
[codex-config]: https://learn.chatgpt.com/docs/config-file/config-basic
[codex-advanced]: https://learn.chatgpt.com/docs/config-file/config-advanced
[agents]: https://learn.chatgpt.com/docs/agent-configuration/agents-md
[codex-local]: https://learn.chatgpt.com/docs/environments/local-environment
[codex-windows]: https://learn.chatgpt.com/docs/windows/windows-sandbox
[prompting]: https://learn.chatgpt.com/docs/prompting
