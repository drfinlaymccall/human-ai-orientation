<?php
// CLI tools may target a separately installed synthetic fixture. Web code never reads this override.
if (!defined('CLI_SCRIPT') || !CLI_SCRIPT) throw new RuntimeException('CLI use only.');
$orientationtrial = getenv('ORIENTATION_TRIAL_DIR') ?: dirname(__DIR__) . '/trial';
$orientationtrial = realpath($orientationtrial);
if (!$orientationtrial || !is_file($orientationtrial . '/moodle/config.php')) {
    throw new RuntimeException('A configured Moodle runtime is required.');
}
require $orientationtrial . '/moodle/config.php';
