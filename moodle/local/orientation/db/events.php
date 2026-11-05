<?php
defined('MOODLE_INTERNAL') || die();
$observers = [
    ['eventname' => '\\core\\event\\user_created', 'callback' => '\\local_orientation\\observer::user_created'],
    ['eventname' => '\\core\\event\\user_deleted', 'callback' => '\\local_orientation\\context_observer::user_deleted'],
    ['eventname' => '\\core\\event\\course_deleted', 'callback' => '\\local_orientation\\context_observer::course_deleted'],
];
