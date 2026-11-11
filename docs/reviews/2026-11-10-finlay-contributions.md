# What only Finlay can add

Date: 10 November 2026 (Australia/Sydney). Companion to the [launch audit](2026-11-10-launch-audit.md); finding numbers (F01…) and decisions (D1…) refer to it. Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

This list is kept current. When you answer an item, the agent records the answer and the date and moves the item to **Done**. All suggested wording here is a **draft** by Claude. Nothing in this file records your view, approval or story until you give it.

Marks: **[A]** blocks Stage A. **[B]** blocks Stage B. **[+]** optional, but adds a lot.

## Do these first

Five quick items, about 80 minutes in total. They are the fastest way to unblock the agent's work. They do not clear Stage A on their own; the full Stage A set is listed below.

| Item | What | Time |
|---|---|---|
| Item 1 | Read `/privacy` and answer the three Stage A questions | 30 min |
| Items 2 and 23 | Turn off Cloudflare Web Analytics, and apply the AI-context rule | 15 min |
| Item 3 | Set up the uptime monitor | 15 min |
| Item 15 | Read `/agent-basics` and say keep, change or cut | 15 min |
| Item 24 | Run `gh auth refresh -s workflow` (not a Stage A item; it unblocks #10) | 5 min |

**Status, 11 November 2026.** Answered: items 1, 2, 9, 12 and 15 (see **Done**). Still open in your Stage A set: item 3 (you agreed the uptime alert is a gate; the monitor account is still to be created, in your name) and item 23 (the Cloudflare rule).

**Your Stage A set.** Seven items: 1, 2, 3, 9, 12, 15 and 23. Item 3 (the uptime alert) is in the set on the audit's recommendation; you agreed on 11 November 2026 that it is a gate (decision D3). This is package A7 in the audit. Choosing the date (item 5, decision D9, package A8) is a separate, final step after the set and the agent's packages A1–A6 are done. Item 4 (pilot order) is not a gate; it only affects when you choose the date. Items 25 and 31 are recommended before Stage A, not required.

## 1. Decisions and approvals

### 1. Privacy policy wording for anonymous visitors [A]

**Answered 11 November 2026 — see Done.**

- **What:** accept or correct the [`/privacy`](https://orientation.finlaymccall.com/privacy) wording as it applies to people who only read.
- **Why you:** it is your promise, published under your name. Publication on the preview is not your approval.
- **Where it goes:** `public/privacy.html`; the record in [`privacy-compliance.md`](../operations/privacy-compliance.md).
- **Unblocks:** Stage A (F11, D1).
- **Prepared:** the compliance record lists eight items without saying which matter for Stage A. Proposed split:

  | Item in the record | Stage | Question for you |
  |---|---|---|
  | 4 Server location | A | Is the server in New South Wales, per your hosting account? |
  | 8 Trading identity | A | Is "Finlay McCall, Australia, email contact only" how you want to be named? |
  | 6 30-day replies | A | Will you answer privacy requests and complaints within 30 days? |
  | 1 Whether the Act applies | B | Lawyer's question; see item 14. |
  | 2 Aged 18 or over | B | Accept the statement with no age check? |
  | 3 Retention periods | B | See item 6. |
  | 5 AI services in support | B | Which AI tools actually see support requests? |
  | 7 Existing learners | B | Tell them, ask them to agree again, or neither? |

  Also for Stage A: the cookie sentence (item 2 below) and a check of the regulator's contact details against the OAIC website.
- **Effort:** 30 minutes.

### 2. Cloudflare Web Analytics: off, or disclosed [A]

**Answered 11 November 2026 — see Done.**

- **What:** every public page loads Cloudflare's analytics script. The policy says the course uses no analytics cookies.
- **Why you:** it is a setting in your Cloudflare account.
- **Where it goes:** Cloudflare dashboard → the zone for this site → Web Analytics. Then `public/privacy.html`.
- **Unblocks:** Stage A (F10, D2).
- **Prepared:** two options.
  - **Off (recommended).** No policy change. You lose visitor counts; the server logs still show requests.
  - **Keep.** Draft sentence: "Cloudflare, which delivers this site, counts page views without cookies and without identifying you."
- **Effort:** 5 minutes.

### 3. Uptime alert as a Stage A gate, and which monitor [A, if you accept D3]

**Part answered 11 November 2026:** you agreed it is a Stage A gate ("yeah, do it, I spose. For the cake of completeness"). The monitor itself is not set up. The agent cannot create the account.

- **What:** decide that an outside alert must exist before promotion, and set one up.
- **Why you:** it needs an account in your name and your email address. The agent must not sign up for services.
- **Where it goes:** [`readiness.md`](../launch/readiness.md); a new `docs/operations/site-down.md`.
- **Unblocks:** Stage A (F20, D3, D4).
- **Prepared:** the recommended service and three exact checks are in [section 6 of the audit](2026-11-10-launch-audit.md#6-uptime-monitor-recommendation).
- **Effort:** 15 minutes.

### 4. Pilot before or after Stage A

- **What:** decide whether the 3–5 person pilot must finish before the anonymous course is promoted.
- **Why you:** it sets your launch order.
- **Unblocks:** the Stage A date (D5).
- **Prepared:** recommendation: run it in parallel. Stage A collects no account data, and the pilot needs sign-up, which is a Stage B path.
- **Effort:** 5 minutes.

### 5. Stage A date [A]

- **What:** choose the date.
- **Why you:** your decision by project rule.
- **Unblocks:** Stage A (D9).
- **Prepared:** the agent will post a one-page check list on #9 when packages A1–A6 are live and the rest of your Stage A set (see "Do these first") is done.
- **Effort:** 5 minutes, later.

### 6. Retention promise [B]

- **What:** the policy promises to delete inactive accounts and support email after 24 months. Nothing does this.
- **Why you:** you would do the yearly review, or you change the promise.
- **Where it goes:** `public/privacy.html`, "How long we keep it".
- **Unblocks:** Stage B (F12, D6).
- **Prepared:** options.
  - **Promise less (recommended).** Draft: "We delete your account and saved work when you ask. Once a year we review accounts that have not been used for two years and remove them."
  - **Keep 24 months.** The agent adds a dated review log and a purge command; you run them each November.
- **Effort:** 10 minutes.

### 7. Completion and the portfolio

- **What:** Unit 1 completes without the portfolio activity. Keep that, or count the portfolio?
- **Why you:** changing completion is a course decision, and the project rules forbid doing it silently.
- **Unblocks:** F30 (D7).
- **Prepared:** recommendation: keep completion as it is. Reword the pages so the portfolio is clearly the result. Draft label to replace "Recommended, not needed for Unit 1 completion": "This is what you take away."
- **Effort:** 5 minutes.

### 8. Which improvement suggestions to accept

- **What:** say yes, no or later to the ten suggestions in [section 5 of the audit](2026-11-10-launch-audit.md#5-improvement-suggestions).
- **Why you:** they change what your course says and asks.
- **Prepared:** recommendation: yes to 1–6 and 8 before Stage A; 7 needs your words (item 17); 9 and 10 after.
- **Effort:** 10 minutes.

### 9. Content signals in `robots.txt` [A]

**Answered 11 November 2026, to confirm:** you will be shown the exact lines, in particular AI training, before the Stage A switch. See Done.

- **What:** Cloudflare serves a `robots.txt` that states no rules. Decide what crawlers may do: search indexing, use as AI input, AI training.
- **Why you:** it is your licence position. The course is CC BY 4.0 and its AI-context pack exists to be read by AI tools.
- **Where it goes:** the new `robots.txt` in package A2.
- **Unblocks:** F02.
- **Prepared:** recommendation: search yes, AI input yes, AI training your choice (the licence already permits reuse with attribution).
- **Effort:** 5 minutes.

### 10. Smaller approvals [B]

One line each; answer when convenient.

- **Saved-rating wording in the starting-point check** (F18, #25). Read the check's notice on the preview; say accept or change. Needed before pilot invitations.
- **Feedback and sign-up notice wording** (F15). The agent will draft two-line notices for you to approve.
- **Whether other learners may see names** (F17). Recommendation: no.
- **CAPTCHA on sign-up** (F47). Recommendation: decide after the pilot.
- **Pilot invitation list** (F19). Accept the small disclosure limit described in the private operator note, or have pilot accounts created by hand.
- **Course name in Moodle** (F26). The welcome email says "A useful start with AI". Rename to "Human AI Orientation"?
- **Merge-gate runbook** (D8). Allow the agent to re-audit and accept the CLI's third built-in plugin.
- **Support capacity** (F27). How often will you check the inbox, and what reply time may `/help` state? Draft: "I usually reply within three working days."

## 2. Opinion and taste

The agent offers options; you choose.

### 11. The course promise

- **What:** the home page's tagline and summary.
- **Where it goes:** `content/home.html` (the hero section).
- **Unblocks:** F06; the share text in F04.
- **Prepared:** the current text is "Learn to team with AI. Choose a useful task, give context, check the result and keep what helps." Question: does this say what you would say to a friend? If not, dictate your version.
- **Effort:** 10 minutes.

### 12. Share image [A, small]

**Answered 11 November 2026 — see Done.**

- **What:** the picture shown when the course is shared on LinkedIn or in a chat.
- **Why you:** look and feel.
- **Where it goes:** one image, 1200 × 630, referenced from every page (F04).
- **Prepared:** options: (a) the journey map artwork with the course name; (b) plain colour with the tagline; (c) a photo of you. The agent can build (a) or (b) from existing artwork for you to look at.
- **Effort:** 5 minutes to choose.

### 13. Names, order and cuts [+]

- **What:** three taste calls from the audit.
  - **Journey name.** It is called "Unit 1 journey", "Your course journey" and "Unit 1: Human–AI Orientation" on one page. Pick one.
  - **Paid-plan advice.** `/free-tools` says free tools are enough, then recommends trying a paid plan. Keep, move to Go deeper, or cut?
  - **Portfolio illustrations** (#16). Nine abstract images exist. Do you still want them beside the questions?
- **Unblocks:** F33, F34, F39.
- **Effort:** 10 minutes.

## 3. Your own voice and knowledge

Answer by dictation. Each answer has a named place. The agent will tidy the transcript, show you the result, and publish nothing without your approval.

### 14. A lawyer's review [B, recommended]

- **What:** ask a qualified person whether the Privacy Act applies to you and whether the policy is sound.
- **Why you:** it needs your engagement and your money. The agent's mapping is not legal advice.
- **Prepared:** the policy, the compliance mapping and findings F10–F17 are a ready brief.
- **Effort:** an afternoon, including finding someone.

### 15. Review of the Unit 2 early reading [A]

**Answered 11 November 2026 — see Done.**

- **What:** read [`/agent-basics`](https://orientation.finlaymccall.com/agent-basics) and say keep, change or cut.
- **Why you:** you moved this material on 6 November and said you would review the page.
- **Where it goes:** the [review queue](../evaluation/Review%20queue.md).
- **Effort:** 15 minutes.

### 16. Your two queued page reviews

- **What:** the two preparation-page reviews already seeded in the review queue.
- **Effort:** 30 minutes.

### 17. About the author [+]

- **What:** a short section on the home page saying who you are and why you made this.
- **Why you:** only you know. The audit found no such section (F06).
- **Where it goes:** home page, in "Keep in touch".
- **Questions to dictate:**
  1. Who are you, in one sentence you would say out loud?
  2. What made you build this course?
  3. Who did you have in mind when you wrote it?
  4. What do you hope someone can do afterwards that they could not do before?
  5. Would you like a photo beside it? If yes, send one.
- **Effort:** 10 minutes.

### 18. More of Finlay's Tips [+]

- **What:** tips from your own practice.
- **Where it goes:** the shared Tips panel ([authoring notes](../curriculum/finlays-tips.md)).
- **Questions:**
  1. What do you do when an AI answer is confidently wrong?
  2. What is one thing you always tell an AI about yourself?
  3. What do you never paste into an AI tool?
  4. How do you keep your own context notes: where, and how often do you update them?
- **Effort:** 15 minutes.

### 19. Real uses from the people you teach [+]

- **What:** on 25 October you named four uses your first cohort brought you (letters, social posts, practical fixes, recipes). More like these, with any detail that makes them concrete.
- **Where it goes:** the opening suggestions in Try AI on a useful task. The examples stay fictional in the course; your list guides which ones to write.
- **Question:** what are the last five things someone asked you to help them do with AI?
- **Effort:** 10 minutes.

### 20. Why the course is built this way [+]

- **What:** your reasons, in your words, for bring-your-own-AI, copy and paste, and keeping context in your own notes.
- **Where it goes:** the course rationale linked from the journey; later, the LinkedIn posts.
- **Questions:**
  1. Why not build an AI into the course?
  2. Why should people keep their context outside any one AI product?
  3. What goes wrong when people skip this?
- **Effort:** 15 minutes.

### 21. Listen to Finlay, one page (#13) [+]

- **What:** a spoken walkthrough of one page.
- **Prepared:** the agent can draft a script for Try AI on a useful task from the page text for you to read or change.
- **Effort:** 30 minutes to record.

### 22. Screenshots of your own set-up [+]

- **What:** your notes app with a context note open, and your AI tool with a pasted brief. Use fictional content.
- **Where it goes:** Notes as working context; Desktop AI workspace (F39, #27).
- **Effort:** 20 minutes.

## 4. Real-world actions

### 23. Apply the Cloudflare AI-context rule [A]

- **What:** apply [`deploy/cloudflare-ai-context-rule.json`](../../deploy/cloudflare-ai-context-rule.json) and tell the agent, who reads it back. The file was updated on 10 November to include edition `2026-11-10.1`; apply the current file.
- **Why you:** your Cloudflare account.
- **Unblocks:** F07.
- **Effort:** 10 minutes.

### 24. `gh auth refresh -s workflow`

- **What:** run this once in a terminal on the server and follow the browser prompt.
- **Why you:** it grants a permission from your GitHub account.
- **Unblocks:** #10 (F54).
- **Effort:** 5 minutes.

### 25. System Caddy changes

- **What:** copy the updated `deploy/orientation.caddy` into `/etc/caddy/conf.d/` and reload Caddy, when package A6 is ready.
- **Why you:** needs sudo.
- **Unblocks:** F44.
- **Prepared:** the agent will give the three exact commands and the check to run afterwards.
- **Effort:** 10 minutes.

### 26. One consenting mail recipient [B]

- **What:** ask one person other than you to sign up, confirm, receive the welcome and reset a password, and tell you what arrived.
- **Why you:** it needs a real person's consent and your invitation.
- **Unblocks:** #4 (F26).
- **Effort:** 30 minutes, plus their time.

### 27. Choose and invite 3–5 pilot participants [B]

- **What:** as in the [pilot protocol](../pilot/PROTOCOL.md). First do the saved-rating wording review in item 10.
- **Unblocks:** #5, then #6.
- **Effort:** an afternoon across a week.

### 28. Hands-on check of the free AI tools [+]

- **What:** run the prepared protocol on the five assistants (#12).
- **Why you:** it needs your sign-ins.
- **Effort:** an afternoon; can be split.

### 29. Server housekeeping

- **What:** free disk space is limited (figure in the private operator note) and the server hosts other projects. Decide what can go.
- **Why you:** the agent should not delete files from other projects.
- **Unblocks:** F23.
- **Effort:** 30 minutes.

### 30. LinkedIn posts

- **What:** review the [five drafts](../launch/linkedin-series.md) and post them when Stage A opens.
- **Why you:** your voice, your account.
- **Effort:** 30 minutes to review.

## 5. Human testing

An agent cannot honestly do these.

### 31. A real phone and a real tablet [+ for A, needed for B]

- **What:** open the home page, the journey and one activity on your own phone. Try copy and paste between the course and an AI app.
- **Record:** device, browser, what was awkward.
- **Effort:** 15 minutes.

### 32. A screen reader

- **What:** VoiceOver on a Mac or iPhone: home page, journey, the portfolio form.
- **Prepared:** the automated checks pass (F40), which does not show that the page makes sense when heard.
- **Effort:** 30 minutes, or ask someone who uses one daily.

### 33. A first-time reader's reaction [+]

- **What:** hand the home page to someone who has not seen it. Ask: what is this, is it for you, what would you click? Write down their words.
- **Effort:** 10 minutes.

### 34. Genuine mail receipt

- **What:** covered by item 26. Check the spam folder too.

### 35. A physical microphone

- **What:** record and send one voice feedback note from your phone and your laptop (#21).
- **Effort:** 10 minutes.

## Done

- **10 November 2026 — merge the audit.** Finlay said to merge the audit PR. [PR #40](https://github.com/drfinlaymccall/human-ai-orientation/pull/40) is merged.
- **10 November 2026 — course direction.** Finlay accepted the agent's suggestions for a minimum viable course: one path as the front door, the portfolio as the result, a short step that teaches the next goal, one way to keep your work, and a prompt for talking the portfolio through with your own AI. He asked for the extras to be set aside for a later unit. The first change is in the [release record](../releases/2026-11-10-mvp-one-path.md). This answers the direction only. It does not approve the wording (items in sections 1 and 2 stay open), and items 17–20 (Finlay's own words) still need him.
- **10 November 2026 — one folder, three files.** Finlay said "Yes, do it" to keeping the portfolio as one `my-context` folder with three named files, and to one sentence at the finish about the next unit. See the [release record](../releases/2026-11-10-one-folder-three-files.md). This answers the direction only. It does not approve the wording.
- **10 November 2026 — agent pointer.** Finlay said "Yes, cut it" to removing the step 2 pointer to the Unit 2 early reading. See the [release record](../releases/2026-11-10-cut-agent-pointers.md). The agent also cut the same kind of pointer on `/before-you-start`; that one was not put to him and is flagged in the record.
- **11 November 2026 — privacy wording for people who only read (item 1, D1).** Asked the three Stage A questions, Finlay replied "Looks great. 30 days is fine". Recorded as acceptance of the wording, the way he is named, and the 30-day promise. He did not separately confirm the server location against the Contabo account. Detail in the [compliance record](../operations/privacy-compliance.md). No lawyer has reviewed the policy.
- **11 November 2026 — Cloudflare Web Analytics (item 2, D2).** "keep it, I want the info". The policy now says Cloudflare counts page views and that this counting does not set a cookie. It also now says Moodle sets one essential session cookie when you visit. He has not read these two sentences on the page; his acceptance of the wording (item 1) came before them. To read before the Stage A switch.
- **11 November 2026 — uptime alert is a Stage A gate (item 3, D3).** Agreed. Setting up the monitor is still open.
- **11 November 2026 — crawlers (item 9).** asked "search yes, AI input yes (both recommended), AI training yes or no", he replied "yes". Read as yes to all three; the exact lines will be shown to him before the Stage A switch. This goes into the `robots.txt` in the search-and-sharing package.
- **11 November 2026 — share image (item 12).** "journey map looks good, photo of me too". The agent builds the journey-map image; a version with his photo needs a photo from him.
- **11 November 2026 — Unit 2 early reading (item 15).** "keep, looks good." He also asked for a "notify me when unit 2 is ready" button linked to a system that does that. That is new work: it collects email addresses from people without accounts, so it needs a design and a privacy-policy change before it is built. Tracked on #9.

