---
name: occt-geometry-recipes
description: The working vocabulary of OpenCascade B-Rep modelling and the traps in it - which operation to reach for, how to keep curves analytic instead of faceted, tolerance discipline, sewing and healing, sub-shape exploration, and the specific failures that cost days. Use this whenever you are building geometry on OCCT, OCP, opencascade.js, replicad or build123d, whenever a solid comes out faceted or hollow or inside-out, whenever a boolean or a fillet fails, whenever you need to choose between an analytic curve and a sampled one, and when designing the geometry layer of a CAD application.
---

# OpenCascade geometry recipes

The kernel is large, the documentation describes the C++ library rather than
whatever binding you have, and about ten operations do ninety per cent of the
work. This is that ten, plus the failures that are worth knowing in advance.

Before anything else: **read `probe-the-binding`.** Half the entries below were
first written as "this build cannot do X", and half of those were wrong.

## Put every operation behind one factory

Drivers should never touch the kernel. One table, one vocabulary, one place
where a decision about tolerance or orientation lives:

```
points    pointCoord pointOnCurve curveAtPoint pointCenter pointExtreme
          pointBetween pointVertex
datums    lineFrom axisOf planeNormal planeOffset planeMean planeRotate planeFace
curves    circle ellipse polyline fitCurve spline parallelCurve
surfaces  fill patch flatFill fillWithHoles offsetSurface project intersect
solids    box boxAt cylinder sphere extrude loft pad thickness draft rib
booleans  add remove intersect
finishing fillet
placing   move rotate assemble join
```

Each entry carries `{ name, takes, gives, summary, run }` so the same table
serves the scripting API, the documentation and an AI assistant's briefing.

## Analytic when you can, fitted when you cannot — never sampled

This is the single biggest quality decision in the geometry layer.

A circle, an ellipse, a line and an arc have exact kernel constructors. Use
them: `gp_Circ`, `gp_Elips`, `GC_MakeArcOfCircle`. An arc through three points
keeps the ends the chain welded, whatever that does to the radius — which is
what you want when the arc has to join something.

Everything else — a spline through points, a Hermite blend, a parabola, a curve
projected onto a surface — you compute as **points**. What you do next decides
whether the model is smooth or faceted:

```js
// WRONG: hand on the samples. The geometry really is 48 straight edges, and a
// pad off it really is 48 flat strips. The faceting is not the display.
return polylineOf(samples, closed);

// RIGHT: fit one B-spline edge through them.
const array = new oc.NCollection_Array1_gp_Pnt(1, run.length);
run.forEach((p, i) => array.SetValue(i + 1, pnt(p)));
const fitted = new oc.GeomAPI_PointsToBSpline(
  array, 3, 8, oc.GeomAbs_Shape.GeomAbs_C2, tol);
return new oc.BRepBuilderAPI_MakeEdge(fitted.Curve()).Edge();
```

Measured properties of that fit, worth knowing before you tune it:

- **The ends are exact.** Which is what lets a sketch chain weld either side of
  it and still close.
- **The tolerance is a length**, so scale it: `max(1e-4, reach * 1e-5)` where
  `reach` is the run's own bounding extent. A fixed hundredth of a millimetre
  is nothing on a 2 m curve and crude on a 2 mm one.
- **It is not periodic.** A closed loop's seam is only as smooth as the samples
  either side of it: 60 samples → 0.63° kink, 120 → 0.02°, 240 → 0.004°. So
  sample a closed run to at least ~120 points and the seam disappears.
- **Cost**: ~27 ms and 183 poles for 240 points at 1e-3. Asking for more
  precision than the samples contain just buys poles.

A polyline node should still make a polyline. Smoothing what is meant to be
segments is the same mistake facing the other way.

## Tolerances are not interchangeable

`BRepOffsetAPI_MakeFilling(Degree, NbPtsOnCur, NbIter, Anisotropie, Tol2d,
Tol3d, TolAng, TolCurv, MaxDeg, MaxSegments)` takes four tolerances and **only
one is a distance**:

| | |
|---|---|
| `Tol2d` | parametric |
| `Tol3d` | millimetres — the one a person means |
| `TolAng` | an **angle in radians** |
| `TolCurv` | a curvature |

Scaling all four by the user's millimetre tolerance meant a "loose" 100 mm fit
asked for an angular tolerance of a thousand radians, and the surface that came
back had no relation to the curves it was given. Sensible defaults:
`(degree, 15, 2, false, 1e-5, tol, 0.01, 0.1, 8, 9)`.

General rule: when an API takes several tolerances, look up what each one
measures before scaling any of them together.

## Solid or surface is a decision, not an accident

Every sweep should ask. `Extrude` here has `cap: Solid | Surface`, and the
difference is measurable: a 100 × 100 × 40 pad has area 36 000 mm² as a solid
(two ends included) and 16 000 mm² as a surface (four walls). Test it that way
— a volume test cannot tell a capped solid from a shell.

Related: closed loops in a sketch become faces; a loop inside a loop becomes a
hole; a loop inside *that* becomes an island again. That nesting rule is worth
implementing once and measuring:
`(200² − 2π18²) × 40` for a plate with two holes.

## Orientation is real information — report it, do not swallow it

A measured area came back negative for a reversed face. Return the magnitude
**and** say "inside out". The sign told you something true about the input, and
`Math.abs()` alone throws it away.

For display, draw both sides (see `kernel-viewport-bridge`): a fill, a draft
face or a loft is a sheet, and which side is "front" is whatever the kernel
decided.

## Explore sub-shapes with an explorer, once

```js
const subShapes = (shape, type, cast) => {
  const out = [], e = new oc.TopExp_Explorer(shape, type, ANY);
  while (e.More()) { out.push(cast(e.Current())); e.Next(); }
  e.delete();
  return out;
};
```

Watch for **duplicates**: a sketch that makes faces carries every edge twice —
once in the face and once in the wire. Handing the same edge to a filling twice
is the same constraint asked for twice, which is at best wasted work and at
worst a contradiction it must average out. De-duplicate before feeding a
builder.

`BRepTools_WireExplorer` gives ordered edges when you have it; when you do not,
order them yourself by chaining endpoints — and keep the flip flag, because an
edge's own parameter direction is not the direction the chain walks it.

## Measure distance the safe way

```js
const gap = new oc.BRepExtrema_DistShapeShape();
gap.LoadS1(a); gap.LoadS2(b); gap.Perform();
return gap.IsDone() && gap.NbSolution() > 0 ? gap.Value() : NaN;
```

Default constructor, `LoadS1/LoadS2/Perform` — **not** the longer constructors,
which take an `Extrema_ExtFlag` that some builds export as an empty enum, so
every such call throws before it runs. Caught, that reads as "the two never
came near each other", which is how a nearest-face search came to return face 0
every time.

Out-parameters (`ParOnEdgeS2(1)`) come back as `{t: 160}` under embind. Read
them defensively or `NaN` travels.

Nearest-point-on-shape is also how you solve tangency without solving for a
tangent: **the line from a point to the nearest place on a curve is
perpendicular to that curve, and perpendicular at distance r is tangent to a
circle of radius r.** That turns a fillet against an arbitrary curve into a
short fixed-point iteration.

## Meshing: straight isolines defeat the mesher

`BRepMesh` subdivides by deflection measured along isolines. A bilinear (ruled)
patch has straight isolines, measures zero deflection, and comes back as **two
triangles** — flattening a doubly-curved roof into a plane through its corners.
Tightening the tolerance changes nothing.

The fix is upstream: build a genuine bicubic surface (e.g.
`GeomAPI_PointsToBSplineSurface` through a grid, C2) so the isolines have real
curvature. Then the mesher behaves and the tessellation comes straight off the
kernel.

For display, deflection ≈ `bounding diagonal × 2e-3` is a good default: fine
enough that a cylinder reads smooth, coarse enough to stay interactive.

## When a builder fails, go down a ladder

Booleans, fillets, fillings and lofts fail for reasons you cannot predict from
the input's type. Do not write a deny-list of shapes the operation "cannot
handle" — it will be wrong in both directions. Try the strong form, then a
weaker one, then the weakest that still produces something, and say what was
given up. See `degrade-and-report`; that skill is mostly made of OCCT scar
tissue.

## Check the things the kernel will not tell you

- **Does the boundary close?** A filling handed a chain with a gap does not
  refuse — it solves an under-determined problem and returns a sheet that
  sprawls outside the curves it was given. Measure the loop; name both loose
  ends and the distance.
- **Is the answer the right size?** A patch bounded by a loop cannot be much
  bigger than the loop. Three times its reach is generous; two hundred times is
  a failure that forgot to raise.
- **Were the constraints actually met?** A point constraint is a request, not a
  guarantee. Measure the distance from the built surface to the point.

## Verify with numbers, always

Geometry is the domain where "it looks right" is worth least. Every check in
this project's 42 suites is a value derivable on paper first — see
`measured-truth` for the method and the table of worked examples.
