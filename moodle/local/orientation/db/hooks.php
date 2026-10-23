<?php
$callbacks = [
    ['hook' => \core\hook\navigation\primary_extend::class, 'callback' => [\local_orientation\navigation::class, 'primary']],
    ['hook' => \core_user\hook\extend_default_homepage::class, 'callback' => [\local_orientation\navigation::class, 'homepage']],
];
