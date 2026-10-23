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
        $navigation->add('My context', new moodle_url('/local/orientation/workspace.php'), navigation_node::TYPE_CUSTOM);
    }
}

/** Add the same course workspace controls to native course pages, without core/theme edits. */
function local_orientation_before_footer(): string {
    global $PAGE;
    try {
        $course = \local_orientation\catalogue::course();
        if ((int)$PAGE->course->id !== (int)$course->id) return '';
        \local_orientation\context_store::authorise();
    } catch (Throwable $error) { return ''; }
    return '<link rel="stylesheet" href="/assets/course-context.css"><script src="/assets/course-context.js" defer></script>' .
        '<aside class="course-context-panel" data-context-panel aria-label="Your course and context"><details open><summary>My context</summary><div data-context-panel-body><p><a href="/local/orientation/workspace.php">Open my saved context</a></p><p><a href="/local/orientation/index.php">Your course progress</a></p></div></details></aside>';
}
