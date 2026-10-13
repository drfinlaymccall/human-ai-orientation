#!/usr/bin/env python3
"""Private trial mail transport. Captures mail locally; never sends it."""
import os
from pathlib import Path
import sys
import uuid
os.umask(0o077)
maildir = Path(__file__).resolve().parents[1] / 'trial' / 'mail'
maildir.mkdir(parents=True, exist_ok=True)
(maildir / f'{uuid.uuid4()}.eml').write_bytes(sys.stdin.buffer.read())
