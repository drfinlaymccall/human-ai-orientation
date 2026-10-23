#!/usr/bin/env python3
"""Serve the public course locally with its production reading routes. No Moodle."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import argparse
from urllib.parse import urlsplit

PUBLIC = Path(__file__).resolve().parents[1] / 'public'
ROUTES = {'preview', 'before-you-start', 'notes', 'free-tools', 'deeper-courses', 'journey', 'first-task', 'portfolio', 'check-and-continue', 'help', 'privacy'}


class CourseHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        route = urlsplit(self.path).path.removeprefix('/')
        if route in ROUTES:
            self.path = '/' + route + '.html'
        super().do_GET()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=8090)
    args = parser.parse_args()
    with ThreadingHTTPServer(('127.0.0.1', args.port), partial(CourseHandler, directory=str(PUBLIC))) as server:
        print(f'Public course: http://127.0.0.1:{args.port}/journey', flush=True)
        server.serve_forever()
