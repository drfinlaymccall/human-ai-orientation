<?php
namespace local_orientation\privacy;
defined('MOODLE_INTERNAL') || die();
use core_privacy\local\metadata\collection;
use core_privacy\local\request\{contextlist, approved_contextlist, userlist, approved_userlist, writer};
use local_orientation\context_store;

class provider implements \core_privacy\local\metadata\provider,
        \core_privacy\local\request\plugin\provider, \core_privacy\local\request\core_userlist_provider {
    public static function get_metadata(collection $collection): collection {
        $fields = [];
        foreach (['userid', 'courseid', 'itemkey', 'title', 'body', 'source', 'revision', 'timecreated', 'timemodified'] as $field) {
            $fields[$field] = 'privacy:metadata:' . $field;
        }
        $collection->add_database_table(context_store::TABLE, $fields, 'privacy:metadata:context');
        return $collection;
    }
    public static function get_contexts_for_userid(int $userid): contextlist {
        $contexts = new contextlist();
        $contexts->add_from_sql('SELECT c.id FROM {context} c JOIN {local_orientation_context} d
            ON c.instanceid = d.courseid AND c.contextlevel = :level WHERE d.userid = :userid',
            ['level' => CONTEXT_COURSE, 'userid' => $userid]);
        return $contexts;
    }
    public static function get_users_in_context(userlist $userlist) {
        $context = $userlist->get_context();
        if ($context->contextlevel === CONTEXT_COURSE) $userlist->add_from_sql('userid',
            'SELECT userid FROM {local_orientation_context} WHERE courseid = :courseid', ['courseid' => $context->instanceid]);
    }
    public static function export_user_data(approved_contextlist $contextlist) {
        global $DB;
        foreach ($contextlist->get_contexts() as $context) {
            if ($context->contextlevel !== CONTEXT_COURSE) continue;
            $records = $DB->get_records(context_store::TABLE, ['courseid' => $context->instanceid, 'userid' => $contextlist->get_user()->id]);
            foreach ($records as $record) writer::with_context($context)->export_data([get_string('pluginname', 'local_orientation'), 'My context', (string)$record->id], $record);
        }
    }
    public static function delete_data_for_all_users_in_context(\context $context) {
        global $DB;
        if ($context->contextlevel === CONTEXT_COURSE) $DB->delete_records(context_store::TABLE, ['courseid' => $context->instanceid]);
    }
    public static function delete_data_for_user(approved_contextlist $contextlist) {
        global $DB;
        foreach ($contextlist->get_contexts() as $context) if ($context->contextlevel === CONTEXT_COURSE) {
            $DB->delete_records(context_store::TABLE, ['courseid' => $context->instanceid, 'userid' => $contextlist->get_user()->id]);
        }
    }
    public static function delete_data_for_users(approved_userlist $userlist) {
        global $DB;
        $context = $userlist->get_context();
        if ($context->contextlevel !== CONTEXT_COURSE || !$userlist->get_userids()) return;
        [$insql, $params] = $DB->get_in_or_equal($userlist->get_userids(), SQL_PARAMS_NAMED, 'owner');
        $DB->delete_records_select(context_store::TABLE, 'courseid = :courseid AND userid ' . $insql, ['courseid' => $context->instanceid] + $params);
    }
}
