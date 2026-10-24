<?php
require_once(__DIR__ . '/../../config.php');
use local_orientation\context_store;
$course = \local_orientation\catalogue::course();
$document = optional_param('document', 'working', PARAM_ALPHA);
$itemid = optional_param('item', 0, PARAM_INT);
$new = optional_param('new', 0, PARAM_BOOL);
if (!isset(context_store::DOCUMENTS[$document]) && $document !== 'practice') throw new moodle_exception('invalidparameter');
$params = $new ? ['new' => 1] : ($itemid ? ['item' => $itemid] : ['document' => $document]);
$PAGE->set_url('/local/orientation/workspace.php', $params);
require_login($course, false);
context_store::authorise();
$PAGE->set_context(context_course::instance($course->id));
$PAGE->set_course($course);
$PAGE->set_pagelayout('incourse');
$PAGE->set_title('My context');
$PAGE->set_heading('My context');
$PAGE->set_cacheable(false);
header('Cache-Control: private, no-store');
header('Vary: Cookie');
$portfolio = context_store::portfolio($course->id);
$snapshot = $portfolio['snapshot'] ?? context_store::blank();
$item = $itemid ? context_store::item($course->id, $itemid) : null;
$note = $new || $item !== null;
$definition = $document === 'practice' ? ['title' => 'My private practice record', 'fields' => context_store::PRACTICE] : context_store::DOCUMENTS[$document];
$title = $note ? ($item->title ?? '') : $definition['title'];
$body = $note ? ($item->body ?? '') : '';
$source = $note ? ($item->source ?? optional_param('source', 'first-task', PARAM_ALPHANUMEXT)) : ($document === 'practice' ? 'check-and-continue' : 'portfolio');
if (!isset(\local_orientation\catalogue::modules()[$source])) throw new moodle_exception('invalidparameter');
$revision = $note ? (int)($item->revision ?? 0) : $portfolio['revision'];
$expecteditemid = $note ? (int)($item->id ?? 0) : (int)($portfolio['id'] ?? 0);
// Retain navigation before a write: a storage failure must not require another database read.
$saveditems = context_store::listing($course->id);
$storagefailure = false;
$unsaved = false;
$notice = optional_param('deleted', 0, PARAM_BOOL) ? 'Saved note deleted. Downloaded or copied versions remain wherever you kept them.' : '';
$confirmation = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_sesskey();
    $action = required_param('action', PARAM_ALPHA);
    $revision = required_param('revision', PARAM_INT);
    $expecteditemid = required_param('expecteditemid', PARAM_INT);
    if (required_param('expecteduserid', PARAM_INT) !== (int)$USER->id) throw new moodle_exception('invalidparameter');
    try {
        if ($action === 'delete' || $action === 'clear') {
            $confirmation = $action;
        } else if ($action === 'confirmdelete' && $item) {
            context_store::delete($course->id, $item->id, $revision);
            redirect(new moodle_url('/local/orientation/workspace.php', ['deleted' => 1]));
        } else if ($action === 'confirmclear' && !$note) {
            foreach ($definition['fields'] as $key => $_) $snapshot['fields'][$key] = '';
            $snapshot['reviewed'] = false;
            $saved = context_store::save($course->id, 'portfolio', $revision, 'My portfolio', json_encode($snapshot, JSON_THROW_ON_ERROR), 'portfolio', $expecteditemid);
            $revision = (int)$saved->revision;
            $expecteditemid = (int)$saved->id;
            $notice = 'Saved document cleared. Other documents and downloaded copies were kept.';
        } else if (in_array($action, ['save', 'download'], true)) {
            if ($note) {
                $title = context_store::text(required_param('title', PARAM_RAW), 160);
                $body = context_store::text(required_param('body', PARAM_RAW), 20000);
                $source = required_param('source', PARAM_ALPHANUMEXT);
                $markdown = '# ' . $title . "\n\n" . $body . "\n";
            } else {
                foreach ($definition['fields'] as $key => $_) {
                    $text = context_store::text(required_param('field_' . $key, PARAM_RAW), 2000);
                    if ($text !== $snapshot['fields'][$key] && $document !== 'practice') $snapshot['reviewed'] = false;
                    $snapshot['fields'][$key] = $text;
                }
                $markdown = context_store::markdown($snapshot, $document);
            }
            if ($action === 'download') {
                header('Content-Type: text/markdown; charset=utf-8');
                header('Content-Disposition: attachment; filename="orientation-' . ($note ? 'note' : $document) . '.md"');
                header('X-Content-Type-Options: nosniff');
                echo $markdown;
                exit;
            }
            $saved = $note ? context_store::save($course->id, $item->itemkey ?? ('note_' . bin2hex(random_bytes(12))), $revision, $title, $body, $source, $expecteditemid) :
                context_store::save($course->id, 'portfolio', $revision, 'My portfolio', json_encode($snapshot, JSON_THROW_ON_ERROR), 'portfolio', $expecteditemid);
            if ($note && !$item) redirect(new moodle_url('/local/orientation/workspace.php', ['item' => $saved->id, 'saved' => 1]));
            $revision = (int)$saved->revision;
            $expecteditemid = (int)$saved->id;
            $notice = 'Saved to Moodle. You can return from another activity or device.';
        } else {
            throw new RuntimeException('invalid', 400);
        }
    } catch (RuntimeException | dml_exception $error) {
        $storagefailure = $error instanceof dml_exception;
        $unsaved = true;
        http_response_code(in_array($error->getCode(), [400, 404, 409, 503], true) ? $error->getCode() : 500);
        $notice = $storagefailure ? 'Changes were not saved because Moodle storage is unavailable. Copy or download your text before leaving, then try saving again later.' : ($error->getCode() === 409 ? 'A newer saved version exists. These edits have not been saved. Copy them before reopening the saved version in another tab.' : 'Changes were not saved. Keep your text and try again. Check the title and document size.');
    }
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && optional_param('saved', 0, PARAM_BOOL) && $item) $notice = 'Saved to Moodle. You can return from another activity or device.';
$markdown = $note ? '# ' . $title . "\n\n" . $body . "\n" : context_store::markdown($snapshot, $document);
if ($storagefailure) {
    // Moodle's normal theme rendering may query storage; keep the draft available independently.
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>My context — unsaved changes</title>';
    echo '<style>[hidden]{display:none!important}body{font:1rem/1.5 system-ui,sans-serif;margin:2rem auto;padding:0 1rem;max-width:64rem}label,textarea,select{display:block}textarea,input,select{box-sizing:border-box;max-width:100%;width:100%;margin:.4rem 0 1rem;padding:.6rem}button,.context-download{display:inline-block;padding:.8rem 1rem;margin:.4rem 0;cursor:pointer}.context-copy{display:block;width:100%;background:#143d40;color:white;font-weight:700;font-size:1.2rem}.context-notice{padding:1rem;background:#fff1d6}.context-documents a{display:inline-block;margin:.3rem}.context-small{font-size:.9rem}</style></head><body><main>';
} else {
    echo $OUTPUT->header();
}
echo '<div class="context-workspace">';
echo '<p class="context-eyebrow">Your course · Your creations</p><h1>My context</h1><p>Keep useful words here, return to improve them, then copy the parts you need into your AI conversation. Saving here does not share anything with an AI.</p>';
echo '<p><a href="' . s((string)new moodle_url('/local/orientation/index.php')) . '">Back to your course</a> · <a href="' . s((string)new moodle_url('/local/orientation/workspace.php', ['new' => 1])) . '">New context note</a></p>';
echo '<nav class="context-documents" aria-label="Your context documents">';
foreach (context_store::DOCUMENTS as $key => $doc) echo html_writer::link(new moodle_url('/local/orientation/workspace.php', ['document' => $key]), s($doc['title']), ['aria-current' => !$note && $document === $key ? 'page' : 'false']);
echo html_writer::link(new moodle_url('/local/orientation/workspace.php', ['document' => 'practice']), 'Private practice record');
foreach ($saveditems as $saved) {
    if ($saved->itemkey !== 'portfolio') echo html_writer::link(new moodle_url('/local/orientation/workspace.php', ['item' => $saved->id]), s($saved->title));
}
echo '</nav>';
if ($notice) echo html_writer::tag('p', s($notice), ['role' => 'status', 'class' => 'context-notice']);
if ($confirmation) {
    $delete = $confirmation === 'delete';
    echo '<h2>' . ($delete ? 'Delete this saved note?' : 'Clear this saved document?') . '</h2><p>This removes the saved text in Moodle. Copies and downloads are separate. Other documents are kept.</p><form method="post">';
    echo '<input type="hidden" name="sesskey" value="' . s(sesskey()) . '"><input type="hidden" name="revision" value="' . $revision . '"><input type="hidden" name="expecteditemid" value="' . $expecteditemid . '"><input type="hidden" name="expecteduserid" value="' . (int)$USER->id . '">';
    echo '<button class="btn btn-danger" name="action" value="' . ($delete ? 'confirmdelete' : 'confirmclear') . '">' . ($delete ? 'Confirm deletion' : 'Confirm clear') . '</button> ' . html_writer::link($PAGE->url, 'Keep my saved work') . '</form>';
} else {
    echo '<form method="post" data-context-editor data-document="' . ($note ? 'note' : s($document)) . '" data-example="' . ($snapshot['example'] ? '1' : '0') . '" data-reviewed="' . ($snapshot['reviewed'] ? '1' : '0') . '">';
    echo '<input type="hidden" name="sesskey" value="' . s(sesskey()) . '"><input type="hidden" name="revision" value="' . $revision . '"><input type="hidden" name="expecteditemid" value="' . $expecteditemid . '"><input type="hidden" name="expecteduserid" value="' . (int)$USER->id . '">';
    echo '<h2 data-context-title>' . s($note ? ($title ?: 'New context note') : $definition['title']) . '</h2>';
    // Without JavaScript, recovery exports remain the same read-only snapshot as the fields.
    $readonly = $storagefailure ? ' readonly' : '';
    if ($note) {
        echo '<label for="context-title">Title</label><input id="context-title" name="title" maxlength="160" required' . $readonly . ' value="' . s($title) . '">';
        echo '<label for="context-body">Your text</label><textarea id="context-body" name="body" maxlength="20000" rows="10"' . $readonly . '>' . s($body) . '</textarea>';
        echo '<label for="context-source">Created during</label><select id="context-source" name="source"' . ($storagefailure ? ' disabled' : '') . '>';
        foreach (\local_orientation\catalogue::modules() as $slug => $activity) echo '<option value="' . s($slug) . '"' . ($slug === $source ? ' selected' : '') . '>' . s($activity['label']) . '</option>';
        echo '</select>';
        if ($storagefailure) echo '<input type="hidden" name="source" data-context-recovery-source value="' . s($source) . '">';
    } else {
        foreach ($definition['fields'] as $key => $label) echo '<label for="context-' . s($key) . '">' . s($label) . '</label><textarea id="context-' . s($key) . '" name="field_' . s($key) . '" data-context-field data-label="' . s($label) . '" maxlength="2000" rows="3"' . $readonly . '>' . s($snapshot['fields'][$key]) . '</textarea>';
    }
    echo '<p data-context-edit-status role="status">' . ($unsaved ? 'These edits are not saved. Copy or download your text before leaving.' : ($revision ? 'Showing saved work. Save changes after editing.' : 'Not saved yet. Write a little, then save it to Moodle.')) . '</p><button type="submit" class="context-save" name="action" value="save">Save changes</button>';
    echo '<section class="context-copy-area" aria-labelledby="context-copy-heading"><h2 id="context-copy-heading">Ready to use it?</h2><p>Review the text, copy it, then paste it into your AI conversation. Share only what helps your task.</p>';
    echo '<label for="context-copy-text">Text to copy</label><textarea id="context-copy-text" readonly rows="8" data-context-copy-text>' . s($markdown) . '</textarea>';
    echo '<button type="button" class="context-copy" data-context-copy hidden>Copy</button><p data-context-copy-status role="status"></p><noscript><p>Select the text above and use your device’s Copy command.</p></noscript>';
    if ($storagefailure) {
        echo '<noscript><p>Without JavaScript, the recovered text stays read-only so your copy and download match. Keep a copy before reopening this page to edit. You can retry saving this recovered version.</p></noscript>';
        echo '<a class="context-download" download="orientation-' . ($note ? 'note' : s($document)) . '.md" href="data:text/markdown;charset=utf-8;base64,' . base64_encode($markdown) . '">Download Markdown (.md)</a>';
    } else {
        echo '<button type="submit" class="context-download" name="action" value="download">Download Markdown (.md)</button>';
    }
    echo '<p class="context-small">Optional: save the .md file in your own notes folder. Downloading does not save edits to Moodle.</p></section>';
    if ($revision) echo '<details><summary>Remove saved text</summary><button type="submit" class="context-remove" name="action" value="' . ($note ? 'delete' : 'clear') . '">' . ($note ? 'Delete saved note' : 'Clear saved document') . '</button></details>';
    echo '</form>';
}
$activity = \local_orientation\catalogue::modules()[$source] ?? null;
if ($activity) {
    $url = new moodle_url($activity['public_url']);
    if (!$storagefailure) {
        $cm = \local_orientation\catalogue::cm($course, $activity);
        $info = get_fast_modinfo($course)->get_cms();
        if ($cm && isset($info[$cm->id]) && $info[$cm->id]->uservisible) $url = $info[$cm->id]->url;
    }
    echo html_writer::tag('p', html_writer::link($url, 'Return to activity: ' . s($activity['label'])));
}
echo '<p class="context-small">Your saved text is private to your account through this workspace. Finlay administers the server and can access stored records for support or a records request. Keep sensitive details out. <a href="/privacy">About your information</a>.</p></div>';
if ($storagefailure) {
    // Standalone recovery must format current fields without theme scripts or further storage reads.
    echo <<<'HTML'
<script>
(() => {
    const editor = document.querySelector('[data-context-editor]');
    if (!editor) return;
    const text = editor.querySelector('[data-context-copy-text]');
    const copy = editor.querySelector('[data-context-copy]');
    const download = editor.querySelector('.context-download');
    const status = editor.querySelector('[data-context-copy-status]');
    const fields = [...editor.querySelectorAll('[data-context-field]')];
    const original = fields.map(field => field.value);
    for (const field of editor.querySelectorAll('input[name="title"][readonly],textarea[name="body"][readonly],textarea[data-context-field][readonly]')) field.readOnly = false;
    const source = editor.querySelector('select[name="source"]');
    if (source) {
        source.disabled = false;
        editor.querySelector('[data-context-recovery-source]').disabled = true;
    }
    function refreshExport() {
        let markdown;
        if (editor.dataset.document === 'note') {
            markdown = '# ' + editor.elements.title.value + '\n\n' + editor.elements.body.value + '\n';
        } else {
            // Keep whitespace and labels consistent with context_store::markdown.
            const parts = fields.filter(field => /[^ \t\n\r\0\v]/.test(field.value)).map(field => '## ' + field.dataset.label + '\n' + field.value);
            const reviewed = editor.dataset.reviewed === '1' && fields.every((field, index) => field.value === original[index]);
            const prefix = editor.dataset.document === 'practice' ? '' :
                (editor.dataset.example === '1' ? 'Fictional practice example, authored for Human AI Orientation; edits may have been made.\n\n' : '') +
                (reviewed ? 'Review status: reviewed by the learner.' : 'Review status: draft — review before sharing.') + '\n\n';
            markdown = parts.length ? prefix + '# ' + editor.querySelector('[data-context-title]').textContent + '\n\n' + parts.join('\n\n') + '\n' : '';
        }
        text.value = markdown;
        download.href = 'data:text/markdown;charset=utf-8,' + encodeURIComponent(markdown);
    }
    editor.addEventListener('input', refreshExport);
    download.addEventListener('click', refreshExport);
    copy.hidden = false;
    copy.addEventListener('click', async () => {
        refreshExport();
        try {
            await navigator.clipboard.writeText(text.value);
            status.textContent = 'Copied. Paste it into your own notes or AI conversation.';
        } catch {
            text.focus(); text.select();
            status.textContent = 'Text selected. Use your device’s Copy command.';
        }
    });
})();
</script></main></body></html>
HTML;
} else {
    echo $OUTPUT->footer();
}
