#!/usr/bin/env python3
"""Private, operator-assisted support queue. Inbox reading and AI drafting are manual."""
import argparse
import fcntl
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import uuid

ROOT = Path(__file__).resolve().parents[1]
QUEUE = ROOT / 'trial/support'


def digest(packet):
    exact_reply = {k: packet[k] for k in ('recipient', 'subject', 'body', 'synthetic')}
    return hashlib.sha256(json.dumps(exact_reply, sort_keys=True).encode()).hexdigest()


def save(path, packet):
    temporary = path.with_suffix('.tmp')
    temporary.write_text(json.dumps(packet, indent=2) + '\n')
    temporary.chmod(0o600)
    temporary.replace(path)


def create(queue, recipient, subject, body, synthetic=False):
    if not re.fullmatch(r'[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+', recipient):
        raise ValueError('A single email recipient is required.')
    if not subject.strip() or len(subject) > 150 or '\n' in subject or '\r' in subject:
        raise ValueError('Use a short, single-line subject.')
    if not body.strip() or len(body) > 20000:
        raise ValueError('Use a reply of 1–20,000 characters.')
    queue.mkdir(mode=0o700, parents=True, exist_ok=True)
    packet = dict(recipient=recipient, subject=subject, body=body, synthetic=synthetic, state='draft', approval=None)
    identity = uuid.uuid4().hex
    save(queue / f'{identity}.json', packet)
    return identity


def process(queue, identity, action, expected=None, transport=None):
    if not re.fullmatch(r'[a-f0-9]{32}', identity):
        raise ValueError('Invalid support ID.')
    path = queue / f'{identity}.json'
    with (queue / f'{identity}.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        packet = json.loads(path.read_text())
        if action == 'review':
            return dict(packet, digest=digest(packet))
        if action == 'approve':
            if packet['state'] != 'draft' or expected != digest(packet):
                raise ValueError('Review the current draft and supply its exact digest.')
            packet.update(state='approved', approval=expected)
        elif action == 'send':
            if packet['state'] != 'approved' or packet['approval'] != digest(packet):
                raise ValueError('This exact reply has not been approved or was already dispatched.')
            # Crash/failure leaves an uncertain state. Never automatically retry and risk duplicate mail.
            packet['state'] = 'dispatching'
            save(path, packet)
            try:
                transport(packet)
            except Exception:
                packet['state'] = 'delivery-uncertain'
                save(path, packet)
                raise
            packet['state'] = 'captured' if packet['synthetic'] else 'accepted-by-mail-server'
        else:
            raise ValueError('Unknown action.')
        save(path, packet)
        return {'state': packet['state']}


def dispatch(packet):
    if packet['synthetic']:
        captures = QUEUE / 'captures'
        captures.mkdir(mode=0o700, exist_ok=True)
        save(captures / (uuid.uuid4().hex + '.json'), packet)
    else:
        # Recipient and body travel over stdin, never shell arguments or tool logs.
        result = subprocess.run([str(ROOT / 'scripts/php'), str(ROOT / 'scripts/send-support.php')],
                                input=json.dumps(packet), text=True, capture_output=True)
        if result.returncode:
            raise RuntimeError('Mail handoff failed; inspect privately before deciding whether to retry.')


def main():
    os.umask(0o077)
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='action', required=True)
    draft = commands.add_parser('draft')
    draft.add_argument('packet', type=Path, help='Private JSON with recipient, subject and body; no automatic inbox ingestion.')
    draft.add_argument('--synthetic', action='store_true', help='Capture locally, never send email.')
    for action in ('review', 'approve', 'send'):
        command = commands.add_parser(action)
        command.add_argument('id')
        if action == 'approve':
            command.add_argument('--digest', required=True)
            command.add_argument('--approved-by-finlay', action='store_true', required=True,
                                 help='Finlay must personally approve the exact recipient, subject and body. Agents may use this only for synthetic tests.')
    args = parser.parse_args()
    if args.action == 'draft':
        packet = json.loads(args.packet.read_text())
        print(create(QUEUE, packet['recipient'], packet['subject'], packet['body'], args.synthetic))
    else:
        print(json.dumps(process(QUEUE, args.id, args.action, getattr(args, 'digest', None), dispatch), indent=2))


if __name__ == '__main__':
    main()
