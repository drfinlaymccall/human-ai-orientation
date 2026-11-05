<?php
defined('MOODLE_INTERNAL') || die();
/** Serve private audio only after independent author/reviewer checks. */
function local_orientationfeedback_pluginfile($course, $cm, $context, $filearea, $args, $forcedownload, array $options = []) {
    if ($context->contextlevel !== CONTEXT_COURSE || $filearea !== 'audio' || count($args) !== 2) {
        return false;
    }
    require_login();
    $id = (int)array_shift($args);
    $record = \local_orientationfeedback\service::read($id);
    if ((int)$record->courseid !== (int)$context->instanceid) {
        return false;
    }
    $filename = array_shift($args);
    $file = get_file_storage()->get_file($context->id, 'local_orientationfeedback', 'audio', $id, '/', $filename);
    if (!$file || $file->is_directory()) {
        return false;
    }
    send_stored_file($file, 0, 0, $forcedownload, ['cacheability' => 'private'] + $options);
}
