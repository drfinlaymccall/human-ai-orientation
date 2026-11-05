<?php
defined('MOODLE_INTERNAL') || die();
$messageproviders = ['submission' => [
    'capability' => 'local/orientationfeedback:review',
    'defaults' => ['popup' => MESSAGE_PERMITTED + MESSAGE_DEFAULT_ENABLED,
        'email' => MESSAGE_PERMITTED + MESSAGE_DEFAULT_ENABLED],
]];
