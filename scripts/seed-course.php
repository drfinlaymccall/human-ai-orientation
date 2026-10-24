<?php
// Seed original lesson content using Moodle's native course/module APIs. Never overwrite learner attempts.
define('CLI_SCRIPT', true);
$root = dirname(__DIR__);
require __DIR__ . '/moodle-environment.php';
if (!in_array($CFG->wwwroot, ['http://127.0.0.1:8787', 'http://127.0.0.1:18802', 'http://127.0.0.1:18842'], true)) {
    throw new RuntimeException('This seeds the private trial only. Do not replace public account settings.');
}
require_once $CFG->dirroot . '/course/lib.php';
require_once $CFG->dirroot . '/course/modlib.php';
require_once $CFG->dirroot . '/mod/lesson/locallib.php';
require_once $CFG->libdir . '/completionlib.php';
\core\session\manager::set_user(get_admin());
$languagepath = $CFG->dataroot . '/lang/en_local';
if (!is_dir($languagepath)) { mkdir($languagepath, 0700, true); }
copy($root . '/content/moodle-language/lesson.php', $languagepath . '/lesson.php');
get_string_manager()->reset_caches();

foreach ([
    'auth' => 'email', 'registerauth' => 'email', 'allowemailaddresses' => 'example.test',
    'enrol_plugins_enabled' => 'manual,self',
    'guestloginbutton' => 0, 'forcelogin' => 1, 'enablecompletion' => 1,
    'enablemessaging' => 0, 'messaging' => 0, 'enableblogs' => 0,
    'defaultpreference_maildisplay' => 0, 'allowuserthemes' => 0,
    'defaulthomepage' => 0, 'frontpage' => '6', 'frontpageloggedin' => '6',
    'enablemobilewebservice' => 0, 'noreplyaddress' => 'noreply@example.test',
    'supportemail' => 'support@example.test', 'supportname' => 'Orientation trial',
    'auth_instructions' => '<p>Private platform trial. Use fictional details and an email ending in <strong>@example.test</strong>. Confirmation and recovery messages are captured in the local test mailbox. No email is sent externally.</p>',
    'custommenuitems' => '', 'texteditors' => 'textarea',
] as $name => $value) { set_config($name, $value); }
set_config('brandcolor', '#176b60', 'theme_boost');
set_config('scss', 'body { background-color: #f6f7f4; } #page-mod-lesson-view #region-main { max-width: 48rem; margin: auto; line-height: 1.7; } #page-mod-lesson-view #region-main pre { background: #edf4f1; padding: 1rem; border-left: 3px solid #176b60; } #page-mod-lesson-view #region-main blockquote { padding: .5rem 1rem; border-left: 3px solid #176b60; } #page-mod-lesson-view #region-main details { margin: 1rem 0; padding: .75rem; border: 1px solid #b7c9c2; border-radius: .4rem; } #page-mod-lesson-view #region-main summary { cursor: pointer; font-weight: 600; }', 'theme_boost');

$spec = json_decode(file_get_contents($root . '/content/useful-context.json'), true, 512, JSON_THROW_ON_ERROR);
$course = $DB->get_record('course', ['shortname' => 'AI-ORIENTATION-TRIAL']);
if (!$course) {
    $course = create_course((object)[
        'fullname' => 'A useful start with AI', 'shortname' => 'AI-ORIENTATION-TRIAL',
        'category' => 1, 'format' => 'topics', 'numsections' => 1,
        'summary' => '<p>A short, practical lesson with your own AI. Choose useful context, test it, and keep guidance you can reuse.</p><p><strong>Private trial · 25–35 minutes · no paid AI tools required</strong></p>',
        'summaryformat' => FORMAT_HTML, 'enablecompletion' => 1,
        'showgrades' => 0, 'showreports' => 0, 'newsitems' => 0,
        'startdate' => time() - 3600, 'enddate' => 0, 'visible' => 1,
    ]);
}
$PAGE->set_course($course);
$PAGE->set_context(context_course::instance($course->id));
$enrol = enrol_get_plugin('self');
$studentrole = $DB->get_field('role', 'id', ['shortname' => 'student'], MUST_EXIST);
$enrolsettings = [
        'status' => ENROL_INSTANCE_ENABLED, 'roleid' => $studentrole,
        'customint1' => 0, 'customint2' => 0, 'customint3' => 0,
        'customint4' => ENROL_SEND_EMAIL_FROM_NOREPLY, 'customint5' => 0, 'customint6' => 1,
        'customtext1' => 'Welcome to your orientation trial. Open the course, choose Give your AI useful context, and take one small step. You can leave and return with your progress saved. Return to your course: ' . $CFG->wwwroot . '/course/view.php?id=' . $course->id,
    ];
$instance = $DB->get_record('enrol', ['courseid' => $course->id, 'enrol' => 'self']);
if ($instance) {
    $enrol->update_instance($instance, (object)$enrolsettings);
} else {
    $enrol->add_instance($course, $enrolsettings);
}
$section = $DB->get_record('course_sections', ['course' => $course->id, 'section' => 1]);
if ($section) {
    course_update_section($course, $section, (object)[
        'name' => 'Your first useful brief',
        'summary' => '<p>Open the lesson below. Read an example, practise in your own AI app or use the worked-example route, then save a short reflection.</p>',
        'summaryformat' => FORMAT_HTML,
    ]);
}
$existing = $DB->get_record('lesson', ['course' => $course->id, 'name' => $spec['title']]);
if (!$existing) {
    $module = add_moduleinfo((object)[
        'modulename' => 'lesson', 'module' => $DB->get_field('modules', 'id', ['name' => 'lesson']),
        'name' => $spec['title'], 'section' => 1, 'visible' => 1,
        'intro' => '<p>' . s($spec['summary']) . '</p>', 'introformat' => FORMAT_HTML,
        'showdescription' => 1, 'completion' => COMPLETION_TRACKING_AUTOMATIC,
        'completionview' => 0, 'completiongradeitemnumber' => '',
        'completionendreached' => 1, 'completiontimespent' => 0,
        'mediafile' => 0, 'grade' => 0, 'practice' => 0, 'custom' => 0,
        'retake' => 1, 'review' => 0, 'modattempts' => 1, 'usemaxgrade' => 0,
        'maxanswers' => 3, 'maxattempts' => 10, 'nextpagedefault' => 0,
        'minquestions' => 0, 'maxpages' => 0, 'feedback' => 1,
        'displayleft' => 0, 'progressbar' => 1, 'ongoing' => 0,
    ], $course);
    $lesson = new lesson($DB->get_record('lesson', ['id' => $module->instance], '*', MUST_EXIST));
    $context = context_module::instance($module->coursemodule);
    $previous = 0;
    foreach ($spec['pages'] as $item) {
        $kind = $item['type'];
        $p = (object)[
            'title' => $item['title'], 'lessonid' => $lesson->id,
            'pageid' => $previous, 'qtype' => ['content' => 20, 'choice' => 3, 'essay' => 10][$kind],
            'contents_editor' => ['text' => $item['html'], 'format' => FORMAT_HTML, 'itemid' => 0],
            'layout' => 1, 'display' => 1,
        ];
        if ($kind === 'content') {
            $p->answer_editor = ['Continue']; $p->jumpto = [LESSON_NEXTPAGE];
        } elseif ($kind === 'choice') {
            foreach ($item['answers'] as $a => $answer) {
                $p->answer_editor[$a] = ['text' => $answer['text'], 'format' => FORMAT_HTML];
                $p->response_editor[$a] = ['text' => $answer['feedback'], 'format' => FORMAT_HTML];
                $p->jumpto[$a] = $answer['correct'] ? LESSON_NEXTPAGE : LESSON_THISPAGE;
                $p->score[$a] = $answer['correct'] ? 1 : 0;
            }
        } else {
            $p->answer_editor = [['text' => null, 'format' => FORMAT_HTML]];
            $p->jumpto = [LESSON_EOL];
        }
        $page = lesson_page::create($p, $lesson, $context, $CFG->maxbytes);
        $previous = $page->id;
    }
    $cmid = $module->coursemodule;
} else {
    $cmid = get_coursemodule_from_instance('lesson', $existing->id, $course->id)->id;
    $DB->set_field('lesson', 'review', 0, ['id' => $existing->id]);
}
rebuild_course_cache($course->id, true);
theme_reset_all_caches();
$manifest = ['course_id' => $course->id, 'lesson_cmid' => (int)$cmid,
    'course_url' => $CFG->wwwroot . '/course/view.php?id=' . $course->id,
    'lesson_url' => $CFG->wwwroot . '/mod/lesson/view.php?id=' . $cmid];
$manifestjson = json_encode($manifest, JSON_PRETTY_PRINT);
file_put_contents($orientationtrial . '/course.json', $manifestjson);
echo $manifestjson . "\n";
