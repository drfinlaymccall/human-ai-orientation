<?php
// Local trial only. Read the generated administrator secret without putting it in process arguments.
$root = dirname(__DIR__);
$credentials = json_decode(file_get_contents($root . '/trial/credentials.json'), true, 512, JSON_THROW_ON_ERROR);
$argv = [
    $root . '/trial/moodle/admin/cli/install.php',
    '--non-interactive', '--agree-license', '--lang=en', '--chmod=700',
    '--wwwroot=http://127.0.0.1:8787', '--dataroot=' . $root . '/trial/data',
    '--dbtype=pgsql', '--dbhost=' . $root . '/trial/socket', '--dbport=55432',
    '--dbname=orientation', '--dbuser=' . get_current_user(),
    '--fullname=Human AI Orientation — private trial', '--shortname=Orientation',
    '--adminuser=' . $credentials['admin_username'], '--adminpass=' . $credentials['admin_password'],
    '--adminemail=admin@example.test', '--supportemail=support@example.test',
];
$_SERVER['argv'] = $argv;
$_SERVER['argc'] = count($argv);
require $argv[0];
