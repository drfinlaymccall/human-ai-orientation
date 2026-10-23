<?php
defined('MOODLE_INTERNAL') || die();
/** Native signup validation. The address list is private site configuration, never page output. */
function local_orientation_validate_extend_signup_form($data): array {
    $mode = get_config('local_orientation', 'acquisition_mode') ?: 'closed';
    if ($mode === 'public') return [];
    if ($mode === 'pilot') {
        $allowed = json_decode(get_config('local_orientation', 'pilot_emails') ?: '[]', true);
        if (is_array($allowed) && in_array(strtolower(trim($data['email'] ?? '')), $allowed, true)) return [];
    }
    return ['email' => get_string('registrationunavailable', 'local_orientation')];
}
function local_orientation_extend_navigation(global_navigation $navigation): void {
    if (isloggedin() && !isguestuser()) {
        $navigation->add('My orientation progress', new moodle_url('/local/orientation/index.php'), navigation_node::TYPE_CUSTOM);
    }
}
