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
    if ($oldversion < 2026111100) {
        // Additive: a list of people who asked for one notice. No existing table or record is touched.
        $dbman = $DB->get_manager();
        $table = new xmldb_table('local_orientation_notify');
        if (!$dbman->table_exists($table)) {
            $table->add_field('id', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL, XMLDB_SEQUENCE);
            $table->add_field('email', XMLDB_TYPE_CHAR, '255', null, XMLDB_NOTNULL);
            $table->add_field('topic', XMLDB_TYPE_CHAR, '32', null, XMLDB_NOTNULL);
            $table->add_field('token', XMLDB_TYPE_CHAR, '40', null, XMLDB_NOTNULL);
            $table->add_field('timecreated', XMLDB_TYPE_INTEGER, '10', null, XMLDB_NOTNULL);
            $table->add_key('primary', XMLDB_KEY_PRIMARY, ['id']);
            $table->add_index('emailtopic', XMLDB_INDEX_UNIQUE, ['email', 'topic']);
            $table->add_index('token', XMLDB_INDEX_UNIQUE, ['token']);
            $table->add_index('timecreated', XMLDB_INDEX_NOTUNIQUE, ['timecreated']);
            $dbman->create_table($table);
        }
        upgrade_plugin_savepoint(true, 2026111100, 'local', 'orientation');
    }
    return true;
}
