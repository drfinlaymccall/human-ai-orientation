<?php
require_once(__DIR__ . '/../../config.php');
use local_orientationfeedback\service;

// Only known course entry pages can become login destinations. Never accept a URL.
$source = optional_param('source', '', PARAM_ALPHANUMEXT);
if (in_array($source, service::SOURCES, true)) {
    $return = new moodle_url($source === 'home' ? '/' : '/' . $source, null, 'feedback');
} else {
    $return = new moodle_url('/local/orientationfeedback/index.php');
}
$PAGE->set_url('/local/orientationfeedback/signin.php');
$SESSION->wantsurl = $return->out(false);
// Site-level require_login accepts an existing guest; the feedback form requires a real account.
if (isguestuser()) { redirect(get_login_url()); }
// Normal Moodle login reads the session destination, not a wantsurl query argument.
require_login(null, false, null, false);
unset($SESSION->wantsurl);
redirect($return);
