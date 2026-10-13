# Platform trial decision

13 October 2026. Recommendation: **continue with Moodle for the next prototype step**, subject to Finlay's review of the learner experience. This is a provisional selection based on one installed candidate, not a claim that Moodle is universally best or that Frappe was tested and failed.

## Why this trial

Moodle was already shortlisted. It offers the account, course, lesson, enrolment and completion surfaces needed for the selected journey. The [official requirements](https://moodledev.io/general/releases/4.5) fit a local PHP/PostgreSQL setup. The downloaded official branch identified itself as Moodle 4.5.15, built 5 October 2026; its exact source commit is recorded in the runbook and bootstrap.

The [Frappe Learning repository](https://github.com/frappe/lms) documents its framework-based deployment and structured course features. Neither its required services nor Moodle's were installed on this host. For the first experiment, an isolated Moodle runtime could exercise the needed journey without introducing system services. Frappe remains an alternative if Moodle's interface requires excessive customisation; it was researched but not installed.

## What this proves and what it leaves open

| Need | Trial treatment | Interpretation |
| --- | --- | --- |
| Accounts and access recovery | Native email registration, confirmation, login and password reset; mail captured locally | Genuine platform flow; external deliverability still untested |
| A complete guided activity | Seven screens in one native Lesson activity | Original content, worked example, external-AI and no-AI routes, feedback and reflection |
| Save and return | Native page-resume prompt and activity-completion records | Suitable for testing self-access progress; field-level autosave is not promised |
| Reflection | Native essay response retained as ungraded evidence | Text is stored; lesson UI needs language customisation to avoid exam framing |
| Course email | Native welcome notification with a return link, diverted to local capture | Exercises notification generation; no real email service configured |
| Responsive interface | Stock Boost theme with a small amount of scoped styling | Tested at desktop and phone-sized widths; physical devices and assistive technology remain to test |
| Authoring and reporting | Native editing and lesson-report screens | Provides inspectable LMS administration work without building a second LMS |
| Human-reviewed support | Not implemented in this slice | Remains part of the three-activity MVP, not a claimed native feature |

## Friction discovered

- Moodle created a disabled self-enrolment instance by default. The seeding script now explicitly configures and enables it.
- A new learner registers for the site, then enrols in the course. Registration includes username, repeated email and personal-name fields. This is more friction than the final brief ideally calls for.
- Moodle's Lesson module displays grade-related language even with gradebook grading disabled. Supported local English overrides now describe saved practice and reflection; there are no upstream code edits. Internal attempt scores still exist and must not be reported as demonstrated human capability.
- Moodle's login controls initialise asynchronously. Browser tests now wait for that initialization before entering credentials. This was an automation timing issue, not evidence that a person had forgotten their password.
- Navigation retains Home, Dashboard, My courses and a course index. A small pilot should establish whether this confuses the intended audience before committing to extensive theme work.
- Reflection currently asks for free text. The intended human-reviewed support and weekly learning emails require further configuration or development.

## Next decision

Have Finlay try the lesson as a learner and assess whether its value and next action are clear. If the route feels suitable, retain Moodle and develop the remaining two activities plus the reviewed-help and real-email journey. If the interface creates persistent difficulty, use this same lesson and verification checklist in a Frappe trial before considering a custom application.

Public deployment is a separate step: choose the subdomain, HTTPS/reverse proxy, production process management, scheduled tasks, outgoing mail, privacy/retention settings and backup/restore. The present PHP development server stays on loopback.
