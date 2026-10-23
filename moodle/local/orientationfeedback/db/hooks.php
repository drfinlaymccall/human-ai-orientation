<?php
defined('MOODLE_INTERNAL') || die();
$callbacks = [[
    'hook' => \core\hook\output\before_footer_html_generation::class,
    'callback' => [\local_orientationfeedback\hook_callbacks::class, 'footer'],
]];
