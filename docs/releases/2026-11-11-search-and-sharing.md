# Search and sharing, prepared with the switch off — 11 November 2026

Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9). Audit package A2: findings F01–F04 and F52. F05 is partly done (see Remaining questions).

## Need

Stage A opens the anonymous course to search engines and to sharing. The audit found that nothing was ready for that: every response said `noindex` with no scoped replacement, `robots.txt` had no rules, there was no sitemap, mistyped addresses went to a login form, pages had no single address or share image, and no test guarded the search header.

## Decision

- Prepare everything now and leave the switch off. The switch is one line in `deploy/Caddyfile`. Finlay decides when.
- One source, `content/discovery.json`, lists the public pages. The sitemap, the share tags and the Stage A search policy are all written from it, so they cannot drift apart.
- Crawlers: Finlay answered "yes" on 11 November (read as search, AI input and AI training). He is shown the exact lines to confirm.
- Share image: Finlay chose the journey map. The image shows the course name and the four steps in the style of the map. A version with his photo waits for a photo.
- Account and sign-in pages are kept out of search by the response header, not by `Disallow` lines, so a crawler can read the header.

## Change

- `scripts/build-discovery.py` (new, last step of `npm run build`): adds to every public page one canonical address, a favicon link, and Open Graph and Twitter tags with the share image; adds a description to the seven pages that had none; writes `public/robots.txt`, `public/sitemap.xml`, `deploy/robots-preview.caddy` and `deploy/robots-stage-a.caddy`.
- `public/assets/share.png` (1200 × 630), rendered from `content/share-image.html` by `scripts/build-share-image.cjs`. `public/assets/favicon.svg`.
- `public/errors/not-found.html`: a plain "page not found" page with links to the journey and help.
- `deploy/Caddyfile`:
  - imports the search policy from one line (`robots-preview.caddy` now);
  - serves `/robots.txt` and `/sitemap.xml`;
  - redirects `/index.html`, `/name.html` and `/name/` to the one real address, and `/favicon.ico` to the favicon;
  - answers 404 with the not-found page when an address is neither a public page nor anything in Moodle (a file, a folder, or a `.php` file followed by a path).
- `/privacy` now shows "Updated 11 November 2026" (the policy text changed that day in PR #47).
- No Moodle code, content, module, lesson page or completion rule changed.

## Verification

Results for the merged head are on the pull request. The checks are:

- `tests/test_discovery.py` (new, part of `npm run check:public`): tags on every page; the sitemap and the Stage A policy list exactly the same pages; the switch line is `robots-preview.caddy`. It also starts a throwaway Caddy on a free local port, with a stand-in Moodle folder and no PHP, and checks both policies, the redirects, the not-found page, and that Moodle-style addresses still reach PHP. It does not contact the live site.
- `caddy validate` with each policy file.
- After publication: live route checks and a browser load of the sign-in page, recorded on #9.

## Remaining questions

- **The switch is off.** Every live response still says `noindex, nofollow`.
- Finlay has not looked at the share image, the favicon, the not-found page or the seven new descriptions. None is approved.
- Finlay confirms the `robots.txt` lines, in particular `ai-train=yes`.
- Cloudflare may add its own content-signal comments to `robots.txt`; that is a setting in his account.
- `/favicon.ico` redirects to an SVG. Very old browsers may show no icon.
- F05: `/course-introduction` still exists as a second copy of the journey. It points to `/journey` as its canonical address and is left out of the sitemap. It is not redirected, because a test and the local preview server use it.
- How the share card looks on LinkedIn was not checked; that needs the page to be public.
