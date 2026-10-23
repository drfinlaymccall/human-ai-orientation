<?php
defined('MOODLE_INTERNAL') || die();
$observers = [['eventname' => '\\core\\event\\user_created', 'callback' => '\\local_orientation\\observer::user_created']];
