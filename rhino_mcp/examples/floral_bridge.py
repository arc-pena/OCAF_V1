# Floral bridge: deck, twin petal arches, hangers, and a railing of rose-curve flowers.
import math
import rhinoscriptsyntax as rs

SPAN, WIDTH, RISE = 60.0, 8.0, 14.0
rs.EnableRedraw(False)

def layer(name, color):
    if not rs.IsLayer(name):
        rs.AddLayer(name, color)
    rs.CurrentLayer(name)

def pipe(crv, r):
    ids = rs.AddPipe(crv, 0, r, cap=1)
    rs.DeleteObject(crv)
    return ids

# Deck
layer("Bridge::Deck", (180, 170, 160))
rs.AddBox([(0, -WIDTH/2, -0.6), (SPAN, -WIDTH/2, -0.6), (SPAN, WIDTH/2, -0.6), (0, WIDTH/2, -0.6),
           (0, -WIDTH/2, 0), (SPAN, -WIDTH/2, 0), (SPAN, WIDTH/2, 0), (0, WIDTH/2, 0)])

# Arches: parabola that leans in slightly, plus a petal-shaped inner arch
layer("Bridge::Arches", (220, 90, 120))
def arch_z(x, rise):
    t = x / SPAN
    return 4 * rise * t * (1 - t)

for side in (-1, 1):
    y0 = side * WIDTH / 2
    outer = [(x, y0 - side * 1.2 * math.sin(math.pi * x / SPAN), arch_z(x, RISE))
             for x in [SPAN * i / 30.0 for i in range(31)]]
    pipe(rs.AddInterpCurve(outer), 0.45)
    # petal arch: scalloped lobes between the deck and outer arch
    lobes = 5
    inner = []
    for i in range(121):
        x = SPAN * i / 120.0
        scallop = abs(math.sin(math.pi * lobes * x / SPAN))
        inner.append((x, y0, arch_z(x, RISE) * 0.55 * (0.6 + 0.4 * scallop)))
    pipe(rs.AddInterpCurve(inner), 0.2)
    # hangers from outer arch to deck
    layer("Bridge::Hangers", (90, 90, 90))
    for i in range(1, 15):
        x = SPAN * i / 15.0
        top = (x, y0 - side * 1.2 * math.sin(math.pi * x / SPAN), arch_z(x, RISE))
        pipe(rs.AddLine(top, (x, y0, 0)), 0.06)
    layer("Bridge::Arches", (220, 90, 120))

# Railing flowers: rose curves r = cos(k*theta) in the railing plane
layer("Bridge::Flowers", (240, 160, 40))
def flower(cx, y, cz, size, k=5):
    pts = []
    for i in range(361):
        th = 2 * math.pi * i / 360.0
        r = size * (0.25 + 0.75 * abs(math.cos(k * th / 2.0)))
        pts.append((cx + r * math.cos(th), y, cz + r * math.sin(th)))
    crv = rs.AddInterpCurve(pts)
    rs.CloseCurve(crv)
    pipe(crv, 0.05)
    rs.AddSphere((cx, y, cz), size * 0.18)

for side in (-1, 1):
    y = side * (WIDTH / 2 - 0.15)
    pipe(rs.AddLine((0, y, 1.1), (SPAN, y, 1.1)), 0.06)   # handrail
    n = 20
    for i in range(n):
        flower(SPAN * (i + 0.5) / n, y, 0.55, 0.5)

# Crown flower at mid-span between the arches
flower(SPAN / 2, 0, RISE + 1.5, 2.2, k=6)

rs.CurrentLayer("Default")
rs.EnableRedraw(True)
rs.ZoomExtents(all=True)
result = "floral bridge built"
