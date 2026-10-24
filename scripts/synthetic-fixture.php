<?php
// Exact fixture identities only. A second localhost port requires its own directory, DB and synthetic marker.
function orientation_is_synthetic_fixture(string $trial, stdClass $config): bool {
    $contextfixture = dirname(__DIR__) . '/trial/context-fixture';
    if ($trial === realpath($contextfixture) && !is_link($contextfixture) && $config->wwwroot === 'http://127.0.0.1:18842' && $config->dbname === 'orientation_context_fixture') {
        return realpath($config->dataroot) === realpath($trial . '/data') && realpath($config->dirroot) === realpath($trial . '/moodle') && empty($config->smtphosts) && is_file($trial . '/capture-mail.py');
    }
    $expected = dirname(__DIR__) . '/trial/launch-fixture';
    if ($trial !== realpath($expected)) return false;
    if ($config->wwwroot === 'http://127.0.0.1:18802') return $config->dbname === 'orientation_launch_fixture';
    if ($config->wwwroot !== 'http://127.0.0.1:18812' || is_link($expected)) return false;
    $marker = json_decode(@file_get_contents($trial . '/synthetic-fixture.json') ?: '{}', true);
    return ($marker['synthetic'] ?? false) === true
        && ($marker['wwwroot'] ?? '') === $config->wwwroot
        && ($marker['database'] ?? '') === 'orientation_journey_fixture'
        && $config->dbname === 'orientation_journey_fixture'
        && realpath($config->dataroot) === realpath($trial . '/data')
        && realpath($config->dirroot) === realpath($trial . '/moodle')
        && empty($config->smtphosts)
        && realpath($trial . '/capture-mail.py') === $trial . '/capture-mail.py'
        && str_contains(file_get_contents($trial . '/capture-mail.py'), "pathlib.Path(__file__).parent/'mail'");
}
