<?php
defined('MOODLE_INTERNAL') || die();
$capabilities = [
    'local/orientationfeedback:review' => [
        'captype' => 'read', 'contextlevel' => CONTEXT_SYSTEM,
        'riskbitmask' => RISK_PERSONAL, 'archetypes' => [],
    ],
];
