"""Search and sharing: metadata on every public page, robots, sitemap and the web-server search switch.

The server checks start a throwaway Caddy on a free local port with a stand-in Moodle folder
and no PHP. They never contact the live site.
"""
from pathlib import Path
import json
import re
import shutil
import socket
import subprocess
import tempfile
import time
import unittest
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
SOURCE = json.loads((ROOT / 'content/discovery.json').read_text())
ORIGIN = SOURCE['origin']
INDEXABLE = [page['path'] for page in SOURCE['pages'] if page.get('sitemap', True)]
LIVE_ROOT = '/home/finlay/apps/human-ai-orientation'


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


def fetch(port, path):
    opener = urllib.request.build_opener(NoRedirect)
    try:
        response = opener.open(f'http://127.0.0.1:{port}{path}', timeout=5)
    except urllib.error.HTTPError as error:
        response = error
    return response.status, response.headers, response.read().decode('utf-8', 'replace')


class Pages(unittest.TestCase):
    def test_every_public_page_has_one_set_of_search_and_share_tags(self):
        for page in SOURCE['pages']:
            with self.subTest(page=page['file']):
                text = (ROOT / 'public' / page['file']).read_text()
                url = ORIGIN + page.get('canonical', page['path'])
                self.assertEqual(text.count(f'<link rel="canonical" href="{url}">'), 1)
                self.assertEqual(text.count('<link rel="canonical"'), 1)
                self.assertEqual(text.count(f'<meta property="og:url" content="{url}">'), 1)
                for once in ('<meta name="description" content="', '<meta property="og:title" content="',
                             '<meta property="og:description" content="', '<meta name="twitter:card" content="summary_large_image">',
                             f'<meta property="og:image" content="{ORIGIN}{SOURCE["share_image"]}">', '<link rel="icon" href="/assets/favicon.svg"'):
                    self.assertEqual(text.count(once), 1, once)
                description = re.search(r'<meta name="description" content="([^"]*)">', text).group(1)
                self.assertGreater(len(description), 40)
                self.assertNotIn('noindex', text)

    def test_share_image_is_a_1200_by_630_png(self):
        data = (ROOT / 'public' / SOURCE['share_image'].lstrip('/')).read_bytes()
        self.assertEqual(data[:8], b'\x89PNG\r\n\x1a\n')
        self.assertEqual((int.from_bytes(data[16:20], 'big'), int.from_bytes(data[20:24], 'big')), (1200, 630))

    def test_sitemap_and_robots_list_exactly_the_indexable_pages(self):
        sitemap = (ROOT / 'public/sitemap.xml').read_text()
        self.assertEqual(re.findall(r'<loc>([^<]+)</loc>', sitemap), [ORIGIN + path for path in INDEXABLE])
        self.assertNotIn('/course-introduction', sitemap)
        robots = (ROOT / 'public/robots.txt').read_text()
        self.assertIn('User-agent: *\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\nAllow: /\n', robots)
        self.assertIn(f'Sitemap: {ORIGIN}/sitemap.xml', robots)
        self.assertNotIn('Disallow', robots)

    def test_the_search_switch_is_on_stage_a_and_the_policy_matches_the_sitemap(self):
        caddy = (ROOT / 'deploy/Caddyfile').read_text()
        self.assertEqual(re.findall(r'^\s*import (\S+)$', caddy, re.M), ['robots-stage-a.caddy'])
        self.assertNotIn('X-Robots-Tag', caddy)
        self.assertIn('header X-Robots-Tag "noindex, nofollow"\n', (ROOT / 'deploy/robots-preview.caddy').read_text())
        stage_a = (ROOT / 'deploy/robots-stage-a.caddy').read_text()
        self.assertIn('@notIndexable not path ' + ' '.join(INDEXABLE) + '\n', stage_a)
        self.assertIn('header @notIndexable X-Robots-Tag "noindex, nofollow"\n', stage_a)

    def test_not_found_page_is_plain_and_points_back_to_the_course(self):
        text = (ROOT / 'public/errors/not-found.html').read_text()
        self.assertIn('<meta name="robots" content="noindex">', text)
        self.assertIn('href="/journey"', text)
        self.assertNotIn('<script', text)


@unittest.skipUnless(shutil.which('caddy'), 'caddy is not installed')
class Server(unittest.TestCase):
    def serve(self, policy):
        work = Path(self.enterContext(tempfile.TemporaryDirectory()))
        moodle = work / 'moodle'
        (moodle / 'login').mkdir(parents=True)
        (moodle / 'login/index.php').write_text('<?php')
        (moodle / 'pluginfile.php').write_text('<?php')
        (moodle / 'theme').mkdir()
        (moodle / 'theme/styles.php').write_text('<?php')
        with socket.socket() as probe:
            probe.bind(('127.0.0.1', 0))
            port = probe.getsockname()[1]
        config = (ROOT / 'deploy/Caddyfile').read_text()
        config = config.replace(':8789 {', f':{port} {{').replace('127.0.0.1:8788', '127.0.0.1:9')
        config = config.replace(LIVE_ROOT + '/trial/moodle', str(moodle)).replace(LIVE_ROOT + '/public', str(ROOT / 'public'))
        config, switched = re.subn(r'(?m)^(\s*)import robots-(?:preview|stage-a)\.caddy$', rf'\1import {ROOT}/deploy/robots-{policy}.caddy', config)
        self.assertEqual(switched, 1)
        self.assertNotIn(LIVE_ROOT + '/trial', config)
        (work / 'Caddyfile').write_text(config)
        process = subprocess.Popen(['caddy', 'run', '--config', str(work / 'Caddyfile'), '--adapter', 'caddyfile'],
                                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        self.addCleanup(process.wait)
        self.addCleanup(process.terminate)
        for _ in range(50):
            try:
                fetch(port, '/robots.txt')
                return port
            except OSError:
                time.sleep(0.1)
        self.fail('caddy did not start')

    def test_preview_policy_keeps_every_response_out_of_search(self):
        port = self.serve('preview')
        for path in ('/', '/journey', '/privacy', '/ai/', '/robots.txt', '/login/index.php', '/no-such-page'):
            with self.subTest(path=path):
                self.assertEqual(fetch(port, path)[1]['X-Robots-Tag'], 'noindex, nofollow')

    def test_stage_a_policy_opens_only_the_public_course_pages(self):
        port = self.serve('stage-a')
        for path in INDEXABLE:
            with self.subTest(path=path):
                status, headers, _ = fetch(port, path)
                self.assertEqual(status, 200)
                self.assertIsNone(headers['X-Robots-Tag'])
        for path in ('/course-introduction', '/login/index.php', '/theme/styles.php/boost/1/all', '/no-such-page', '/assets/site.css',
                     '/downloads/orientation-practice.md', '/config.php'):
            with self.subTest(path=path):
                self.assertEqual(fetch(port, path)[1]['X-Robots-Tag'], 'noindex, nofollow')

    def test_routes_for_crawlers_old_addresses_and_unknown_addresses(self):
        port = self.serve('preview')
        status, headers, body = fetch(port, '/robots.txt')
        self.assertEqual((status, body), (200, (ROOT / 'public/robots.txt').read_text()))
        self.assertTrue(headers['Content-Type'].startswith('text/plain'))
        status, headers, body = fetch(port, '/sitemap.xml')
        self.assertEqual(status, 200)
        self.assertIn('<urlset', body)
        for path, target in (('/journey.html', '/journey'), ('/journey/', '/journey'), ('/index.html', '/'),
                             ('/portfolio.html', '/portfolio'), ('/favicon.ico', '/assets/favicon.svg')):
            with self.subTest(path=path):
                status, headers, _ = fetch(port, path)
                self.assertEqual((status, headers['Location']), (308, target))
        for path in ('/no-such-page', '/no/such/page', '/journey.htm', '/errors/not-found.html'):
            with self.subTest(path=path):
                status, _, body = fetch(port, path)
                self.assertEqual(status, 404)
                self.assertIn('We could not find that page.', body)
        # Moodle addresses still reach PHP (502 here: this test has no PHP), and are never "not found".
        for path in ('/login/index.php', '/login/', '/theme/styles.php/boost/1/all', '/pluginfile.php/1/x/y.png'):
            with self.subTest(path=path):
                self.assertEqual(fetch(port, path)[0], 502)
        for path in ('/config.php', '/.git/config', '/privacy.html'):
            with self.subTest(path=path):
                self.assertEqual(fetch(port, path)[0], 200 if path == '/privacy.html' else 404)
        self.assertEqual(fetch(port, '/assets/favicon.svg')[0], 200)
        self.assertEqual(fetch(port, '/assets/share.png')[0], 200)

    def test_every_response_carries_the_protective_headers_and_private_files_are_refused(self):
        port = self.serve('preview')
        # This test has no PHP, so it cannot show the headers on a Moodle page; that is checked on the server after publication.
        for path in ('/', '/journey', '/assets/site.css', '/no-such-page'):
            with self.subTest(path=path):
                headers = fetch(port, path)[1]
                self.assertEqual(headers['Content-Security-Policy'], "frame-ancestors 'self'")
                self.assertEqual(headers['Permissions-Policy'], 'microphone=(self), camera=(self), geolocation=(), payment=(), usb=()')
                self.assertEqual(headers['X-Content-Type-Options'], 'nosniff')
                self.assertIsNone(headers['Server'])
        # Public pages and their files are never cached, so a published change shows at once.
        for path in ('/', '/journey', '/assets/site.css', '/robots.txt', '/ai/context.md'):
            with self.subTest(path=path):
                self.assertEqual(fetch(port, path)[1]['Cache-Control'], 'no-store')
        for path in ('/config.php', '/config-dist.php', '/install.php', '/admin/cli/cron.php', '/admin/tool/task/cli/run.php',
                     '/login/index.php~', '/login/index.php.orig', '/notes.old', '/x.save', '/y.swp', '/.git/config', '/composer.json'):
            with self.subTest(path=path):
                status, _, body = fetch(port, path)
                self.assertEqual((status, body), (404, 'Not found'))


class Services(unittest.TestCase):
    def test_course_services_restart_after_any_stop_they_were_not_asked_to_make(self):
        for name in ('web', 'php', 'db'):
            with self.subTest(service=name):
                unit = (ROOT / f'deploy/orientation-{name}.service').read_text()
                self.assertEqual(re.findall(r'^Restart=(\S+)$', unit, re.M), ['always'])
                self.assertIn('RestartSec=5', unit)

    def test_the_front_server_file_leaves_caching_to_the_course_server(self):
        front = (ROOT / 'deploy/orientation.caddy').read_text()
        self.assertNotIn('Cache-Control "no-store"', front)
        course = (ROOT / 'deploy/Caddyfile').read_text()
        # Each default needs its own directive, or one present header switches off the other default.
        self.assertIn('\theader ?Cache-Control "no-store"\n', course)
        self.assertIn('\theader ?Content-Security-Policy "frame-ancestors \'self\'"\n', course)


if __name__ == '__main__':
    unittest.main()
