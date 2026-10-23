#!/usr/bin/env python3
"""Build abstract SVGs for the portfolio's three 'Working with me' questions.

Stdlib only and seeded, so reruns produce the same files. The images are not yet
placed on the page; see docs/research/portfolio-imagery.md for the chosen set.
"""
import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public/assets/portfolio-imagery"
OUT.mkdir(parents=True, exist_ok=True)

# Site tokens plus a few muted companions.
PAPER = "#f6f7f4"
INK = "#20332f"
GREEN = "#176b60"
AMBER = "#b96622"
SAND = "#e9e2d3"
SAGE = "#a9bfb2"
CLAY = "#c98b6b"
PLUM = "#7b5a78"
SLATE = "#5d7487"
OCHRE = "#d6a84a"

FILTERS = """
<defs>
  <filter id="rough" filterUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4"/>
    <feDisplacementMap in="SourceGraphic" scale="9"/>
  </filter>
  <filter id="wash" filterUnits="userSpaceOnUse" x="0" y="0" width="400" height="400">
    <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="4" seed="9" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="26" result="d"/>
    <feGaussianBlur in="d" stdDeviation="3.5"/>
  </filter>
  <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="14"/>
  </filter>
  <filter id="glow" x="-80%" y="-80%" width="260%" height="260%">
    <feGaussianBlur stdDeviation="10"/>
  </filter>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="2"/>
    <feColorMatrix values="0 0 0 0 0.12  0 0 0 0 0.2  0 0 0 0 0.18  0 0 0 0.07 0"/>
    <feComposite in2="SourceGraphic" operator="in"/>
  </filter>
</defs>
"""


def svg(name, body, title):
    doc = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" role="img" '
        f'aria-labelledby="t"><title id="t">{title}</title>{FILTERS}'
        f'<rect width="400" height="400" fill="{PAPER}"/>{body}'
        f'<rect width="400" height="400" fill="#000" filter="url(#grain)"/></svg>'
    )
    (OUT / f"{name}.svg").write_text(doc)


def blob(cx, cy, r, rnd, wobble=0.18, points=9):
    """Closed smooth irregular shape around (cx, cy)."""
    pts = []
    for i in range(points):
        a = 2 * math.pi * i / points
        rr = r * (1 + rnd.uniform(-wobble, wobble))
        pts.append((cx + rr * math.cos(a), cy + rr * 0.78 * math.sin(a)))
    d = f"M{(pts[0][0] + pts[-1][0]) / 2:.1f},{(pts[0][1] + pts[-1][1]) / 2:.1f}"
    for i, p in enumerate(pts):
        n = pts[(i + 1) % points]
        d += f" Q{p[0]:.1f},{p[1]:.1f} {(p[0] + n[0]) / 2:.1f},{(p[1] + n[1]) / 2:.1f}"
    return d + "Z"


# ---------- Q1: What would you like your assistant to know about you? ----------

def q1_pebbles():
    rnd = random.Random(11)
    body = [f'<rect width="400" height="400" fill="{SAND}"/>',
            f'<path d="M0,250 C120,232 260,268 400,244 L400,400 L0,400Z" fill="#ece8de"/>',
            f'<path d="M0,250 C120,232 260,268 400,244" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>']
    for _ in range(70):
        x, y = rnd.uniform(-10, 410), rnd.uniform(40, 395)
        r = rnd.uniform(5, 15)
        body.append(f'<path d="{blob(x, y, r, rnd)}" fill="#cfc8ba" opacity="{rnd.uniform(.25, .55):.2f}"/>')
    chosen = [(170, 300, 26, GREEN), (222, 288, 20, AMBER), (200, 330, 22, PLUM), (243, 322, 15, SLATE)]
    for x, y, r, c in chosen:
        body.append(f'<path d="{blob(x + 4, y + 6, r, random.Random(r))}" fill="{INK}" opacity=".18" filter="url(#glow)"/>')
        body.append(f'<path d="{blob(x, y, r, random.Random(r))}" fill="{c}"/>')
        body.append(f'<ellipse cx="{x - r * .3:.0f}" cy="{y - r * .35:.0f}" rx="{r * .35:.0f}" ry="{r * .18:.0f}" fill="#fff" opacity=".35"/>')
    svg("about-pebbles", "".join(body), "A pale shoreline of faded pebbles, with four bright, different pebbles gathered together")


def q1_window():
    body = f"""
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#cfe0e4"/><stop offset=".55" stop-color="#eef1ea"/></linearGradient>
    <rect width="400" height="400" fill="url(#sky)"/>
    <g filter="url(#wash)" opacity=".9">
      <ellipse cx="110" cy="80" rx="70" ry="24" fill="#fff"/>
      <ellipse cx="300" cy="120" rx="80" ry="22" fill="#fff"/></g>
    <path d="M0,230 C80,214 150,226 220,212 C300,198 350,214 400,206 L400,400 L0,400Z" fill="{INK}"/>
    <g filter="url(#rough)">
      <path d="M150,400 L150,214 L200,186 L250,214 L250,400Z" fill="#17282a"/>
      <circle cx="44" cy="208" r="34" fill="#1a2c2b"/><circle cx="352" cy="198" r="40" fill="#1a2c2b"/></g>
    <rect x="186" y="262" width="28" height="36" fill="{OCHRE}" filter="url(#glow)" opacity=".9"/>
    <rect x="189" y="265" width="22" height="30" fill="#f4d28a"/>
    <path d="M200,265 V295 M189,280 H211" stroke="#17282a" stroke-width="2"/>
    """
    svg("about-window", body, "A daylight sky above a dark house where one small window is lit")


def q1_fragments():
    rnd = random.Random(5)
    body = [f'<rect x="40" y="40" width="320" height="320" fill="#fff" opacity=".6"/>']
    shapes = [(140, 150, 70, SAGE, -8), (235, 175, 52, CLAY, 12), (180, 250, 58, OCHRE, 4), (268, 268, 34, GREEN, -15)]
    for x, y, r, c, rot in shapes:
        pts = []
        for i in range(14):
            a = 2 * math.pi * i / 14
            rr = r * (1 + rnd.uniform(-.12, .12))
            pts.append(f"{x + rr * math.cos(a):.1f},{y + rr * .8 * math.sin(a):.1f}")
        body.append(f'<polygon points="{" ".join(pts)}" fill="{c}" opacity=".88" '
                    f'transform="rotate({rot} {x} {y})" filter="url(#rough)"/>')
    body.append(f'<path d="M60,345 C140,340 260,350 340,342" stroke="{INK}" stroke-width="1.5" fill="none" opacity=".35"/>')
    svg("about-fragments", "".join(body), "A few torn paper shapes in different colours laid on a mostly empty page")


# ---------- Q2: How would you like your assistant to explain things or write for you? ----------

def q2_three_textures():
    rnd = random.Random(21)
    body = []
    # Top left: crisp concentric rings.
    for r in range(78, 4, -10):
        body.append(f'<circle cx="112" cy="128" r="{r}" fill="none" stroke="{GREEN}" stroke-width="2.4"/>')
    # Top right: watercolour wash.
    body.append(f'<circle cx="290" cy="150" r="80" fill="{SLATE}" opacity=".5" filter="url(#wash)"/>')
    body.append(f'<circle cx="276" cy="136" r="50" fill="{SAGE}" opacity=".65" filter="url(#wash)"/>')
    # Bottom centre: pointillist dots.
    for _ in range(900):
        a, rr = rnd.uniform(0, 2 * math.pi), 80 * math.sqrt(rnd.random())
        c = rnd.choice([AMBER, OCHRE, CLAY, PLUM, GREEN])
        body.append(f'<circle cx="{190 + rr * math.cos(a):.1f}" cy="{298 + rr * math.sin(a):.1f}" r="{rnd.uniform(1.8, 3.8):.1f}" fill="{c}" opacity=".85"/>')
    svg("preferences-textures", "".join(body), "The same circle three times: as crisp rings, as a soft watercolour wash and as coloured dots")


def q2_marks():
    rnd = random.Random(33)
    body = []
    colours = [GREEN, GREEN, SLATE, PLUM, CLAY, AMBER, OCHRE]
    for i in range(7):
        y = 50 + i * 50
        t = i / 6
        lo, hi = 6 + t * 120, 12 + t * 240
        w = 3 + t * 10
        x = 24 + rnd.uniform(0, 12)
        while x < 376:
            L = min(rnd.uniform(lo, hi), 376 - x)
            if L < 4:
                break
            amp = t * 18 * rnd.uniform(.5, 1.2)
            yy = y + rnd.uniform(-3, 3)
            body.append(f'<path d="M{x:.0f},{yy:.0f} c{L * .3:.0f},{-amp:.0f} {L * .7:.0f},{amp:.0f} {L:.0f},{rnd.uniform(-4, 4):.0f}" '
                        f'stroke="{colours[i]}" stroke-width="{w * rnd.uniform(.8, 1.15):.1f}" fill="none" stroke-linecap="round" '
                        f'opacity="{.95 - t * .25:.2f}"{' filter="url(#rough)"' if i > 1 else ''}/>')
            x += L + 6 + t * 14
    svg("preferences-marks", "".join(body), "Rows of marks, from short tight ticks at the top to long, loose brushstrokes at the bottom")


def q2_ribbon():
    rnd = random.Random(44)
    body = []
    def y_at(x):
        return 210 + 95 * math.sin((x - 20) / 360 * 2 * math.pi)
    # Crisp dashes on the left third.
    for x in range(24, 142, 11):
        body.append(f'<path d="M{x},{y_at(x):.1f} L{x + 7},{y_at(x + 7):.1f}" stroke="{GREEN}" stroke-width="7" stroke-linecap="round"/>')
    # Dots in the middle third, spreading as they go.
    for _ in range(700):
        x = rnd.uniform(142, 270)
        spread = 4 + (x - 142) / 128 * 16
        y = y_at(x) + rnd.gauss(0, spread)
        body.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rnd.uniform(1.6, 3.6):.1f}" fill="{rnd.choice([OCHRE, AMBER, CLAY])}" opacity=".9"/>')
    # Wash on the right third.
    d = "M262,{:.1f}".format(y_at(262)) + "".join(f" L{x},{y_at(x):.1f}" for x in range(272, 372, 8))
    body.append(f'<path d="{d}" stroke="{PLUM}" stroke-width="52" fill="none" stroke-linecap="round" opacity=".4" filter="url(#wash)"/>')
    body.append(f'<path d="{d}" stroke="{SLATE}" stroke-width="20" fill="none" stroke-linecap="round" opacity=".45" filter="url(#wash)"/>')
    svg("preferences-ribbon", "".join(body), "One flowing line that changes from crisp dashes to scattered dots to a soft wash")


# ---------- Q3: What should your assistant check with you before doing something? ----------

def q3_stones():
    rnd = random.Random(55)
    body = [f'<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dbe7e5"/><stop offset="1" stop-color="#a9c3c0"/></linearGradient>',
            '<rect width="400" height="400" fill="url(#water)"/>']
    for _ in range(26):
        y = rnd.uniform(20, 390)
        x = rnd.uniform(-40, 380)
        body.append(f'<path d="M{x:.0f},{y:.0f} q30,-4 60,0" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>')
    stones = [(80, 350, 30), (140, 300, 26), (192, 256, 23), (236, 218, 20), (276, 184, 17), (310, 156, 14), (338, 133, 11)]
    for i, (x, y, r) in enumerate(stones):
        lit = i == 3
        if lit:
            body.append(f'<ellipse cx="{x}" cy="{y}" rx="{r * 2.2}" ry="{r * 1.2}" fill="{OCHRE}" opacity=".55" filter="url(#glow)"/>')
        body.append(f'<path d="{blob(x, y, r, random.Random(i))}" fill="{AMBER if lit else "#6d7f78"}" opacity="{1 if lit else .55 + i * 0}"/>')
    svg("boundaries-stones", "".join(body), "Stepping stones across pale water; one stone part-way along glows amber")


def q3_door():
    body = f"""
    <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c9d6dc"/><stop offset="1" stop-color="#eef0ea"/></linearGradient>
    <rect width="400" height="400" fill="url(#dusk)"/>
    <path d="M0,290 C140,282 260,296 400,286 L400,400 L0,400Z" fill="{SAGE}" opacity=".7"/>
    <polygon points="196,292 230,292 330,400 150,400" fill="#f4d28a" opacity=".55" filter="url(#soft)"/>
    <rect x="166" y="120" width="70" height="172" fill="#3a4c48"/>
    <rect x="196" y="126" width="34" height="166" fill="#f4d28a"/>
    <rect x="196" y="126" width="34" height="166" fill="{OCHRE}" opacity=".5" filter="url(#glow)"/>
    <polygon points="172,126 196,126 196,292 172,300" fill="{GREEN}"/>
    <circle cx="190" cy="212" r="2.5" fill="{OCHRE}"/>
    <ellipse cx="200" cy="298" rx="60" ry="5" fill="{INK}" opacity=".18"/>
    """
    svg("boundaries-door", body, "A door standing alone in an open field, slightly open, with warm light behind it")


def q3_ladder():
    rnd = random.Random(66)
    body = [f'<linearGradient id="day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bcd4dc"/><stop offset="1" stop-color="#f1f2ec"/></linearGradient>',
            '<rect width="400" height="400" fill="url(#day)"/>',
            f'<g filter="url(#wash)"><ellipse cx="210" cy="78" rx="96" ry="34" fill="#fff"/><ellipse cx="160" cy="92" rx="60" ry="26" fill="#fff"/></g>',
            f'<path d="M0,360 C120,352 280,366 400,356 L400,400 L0,400Z" fill="{SAGE}" opacity=".8"/>']
    body.append(f'<path d="M176,360 L188,150 M224,360 L212,150" stroke="#5a4a3c" stroke-width="5" stroke-linecap="round"/>')
    for i, y in enumerate(range(338, 150, -26)):
        t = (360 - y) / 210
        x1, x2 = 176 + 12 * t, 224 - 12 * t
        top = y < 180
        c = AMBER if top else "#5a4a3c"
        if top:
            body.append(f'<path d="M{x1 - 6:.0f},{y} H{x2 + 6:.0f}" stroke="{OCHRE}" stroke-width="12" opacity=".6" filter="url(#glow)"/>')
        body.append(f'<path d="M{x1:.0f},{y} H{x2:.0f}" stroke="{c}" stroke-width="{5 if top else 4}" stroke-linecap="round"/>')
    svg("boundaries-ladder", "".join(body), "A ladder standing in a field and reaching toward a cloud; its top rung glows amber, short of the cloud")


for fn in [q1_pebbles, q1_window, q1_fragments, q2_three_textures, q2_marks, q2_ribbon, q3_stones, q3_door, q3_ladder]:
    fn()
print("\n".join(sorted(p.name for p in OUT.glob("*.svg"))))
