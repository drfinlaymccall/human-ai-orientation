# Notify list

People without an account can ask to be told when one named thing is ready. The first topic is Unit 2. Tracking: [#9](https://github.com/drfinlaymccall/human-ai-orientation/issues/9).

## What it is

- A form on [`/agent-basics`](../../content/agent-basics.html) posts to `/local/orientation/notify.php` in the orientation plugin.
- The plugin keeps one row for each address and topic in the table `local_orientation_notify`: email address, topic, date, and a random removal token. The list is not linked to course accounts.
- **Nothing here sends mail.** Finlay sends the message himself.
- The form works without JavaScript and sets no cookie.

## How Finlay uses it

1. Sign in as the site administrator and open `/local/orientation/notify-list.php`. It shows the number of people for each topic.
2. Choose **Download addresses (CSV)**. Each line has the address, the topic, the date, and that person's removal link.
3. Send each person one email about that topic, from your own mail. Put their removal link in it. Do not use the list for anything else.
4. When someone replies asking to be removed, open their removal link and choose **Remove my address**, or ask the agent to delete the row.

The CSV holds personal information. Keep it only as long as you need it to send the message, then delete it.

## Rules the code keeps

- Only topics named in `notify::TOPICS` are accepted. To offer a new topic, add it there first, then add a form with that topic to a page.
- The answer is the same whether or not the address was already listed, so the form cannot be used to check whether someone signed up.
- A hidden field catches automated form-fillers; they get the ordinary answer and nothing is kept.
- At most 60 new addresses are accepted in an hour across the site. After that the form says "try again later" to everyone, listed or not, and keeps nothing. The limit is site-wide because the table stores no IP address; a script could therefore block new sign-ups for a while. That is accepted for a small list. If it happens, the server log shows it.
- An address that starts with `=`, `+`, `-` or `@` is refused, so the downloaded list is safe to open in a spreadsheet.
- Opening a removal link only asks; removal needs the button. A mail scanner that opens links cannot remove anyone.
- The list page and the download need the site administrator capability `moodle/site:config`. The download also needs the administrator's session key.

## Privacy

- [`/privacy`](../../public/privacy.html) describes the list under "What we collect and why" and "How long we keep it".
- The promise is: used only for the thing asked about; removed by the link or on request; any that remain are deleted within 24 months. **No task deletes old rows.** Finlay owns that work, with the other retention items in the [compliance record](privacy-compliance.md).
- Moodle's privacy tools cover account data. They list this table in the plugin's privacy description, but they cannot export or delete its rows for a person, because the rows are not linked to accounts.
- Someone can type another person's address. That person then gets one email with a removal link. The form does not send a confirmation email, so it cannot be used to send mail to strangers.

## Checks

`npm run test:notify` runs on the synthetic fixture only (port 18802, captured mail, fictional `@example.test` addresses). It covers: joining once; no mail sent and no cookie set; the no-JavaScript route; bad input; the hidden field; the hourly limit; the removal link; and administrator-only access to the list.

## Upgrade

Plugin version `2026111100` adds the table. The upgrade step is additive: it creates the table only if it is missing and touches no other table.
