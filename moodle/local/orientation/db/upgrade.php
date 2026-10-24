<?php
defined('MOODLE_INTERNAL') || die();
function xmldb_local_orientation_upgrade($oldversion): bool {
    global $DB;
    if ($oldversion < 2026102402) {
        if (!$DB->get_manager()->table_exists('local_orientation_context')) {
            $DB->get_manager()->install_from_xmldb_file(__DIR__ . '/install.xml');
        }
        upgrade_plugin_savepoint(true, 2026102402, 'local', 'orientation');
    }
    return true;
}
