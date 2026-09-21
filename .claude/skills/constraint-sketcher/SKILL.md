---
name: constraint-sketcher
description: How to build a 2D constraint sketcher that feeds a 3D modeller - drawing elements as data, relations and an iterative solver, welding a chain into a wire, finding loops and nesting them into faces with holes, layers and construction geometry, and keeping everything in the plane's own two coordinates. Use this whenever you are building a 2D drawing or sketch mode, a constraint solver, profile input for extrusion or sweeping, a 2D editor inside a 3D tool, or anything where drawn geometry must close into faces. Also use when a sketch will not close, a solve will not converge, or a profile extrudes into the wrong thing.
---

# The constraint sketcher

A sketcher is the input device for most of a parametric modeller. It is also
where a surprising amount of the difficulty lives, because a drawing is a graph
of loosely-connected curves that has to become an exactly-closed wire.

Reference: `docs/src/sketch.js` (~1,570 lines) in this repository.

## The drawing is data, in the plane's own coordinates

```js
{ elements: [ { id, type, ...geometry, layer?, construction?, locked? } ],
  constraints: [ { type, of: ["e1", "e2.b"] } ] }
```

Element types worth supporting from the start — they cover nearly every profile
anyone draws:

```
point line rect arc circle ellipse oblong spline bspline
```

**Write the drawing in the plane's two coordinates and nowhere else.** No world
coordinates in the file, ever. Then moving the plane moves the drawing and
nothing in the JSON changes — which is the whole reason a sketch is parametric.
Assert it in a test:

```js
check("only the drawing - no world coordinates",
      JSON.stringify(stored.args.drawing).indexOf("null") < 0);
```

The 3D side supplies a **frame** — `{ at(uv) → world, of(world) → uv, normal }`
— written by the driver when it builds and read by the viewport so a click in
the viewport becomes two numbers in the drawing. That frame is a *result*, not
an argument: the plane says what it is; the frame is what the plane came to.

## Elements are built from clicks

One table turns a tool plus N clicks into an element, so the drawing tools, the
replay of a recorded edit, and any scripted construction all agree:

```js
SKETCH_CLICKS = { point: 1, line: 2, rect: 2, circle: 2, arc: 3, ellipse: 3, … };
sketchElement(type, id, clicks)      // → the element
sketchHandles(el)                    // → [[key, uv], …] — what can be dragged
sketchMoveHandle(el, key, to)        // → the element, with that handle moved
```

`sketchHandles`/`sketchMoveHandle` are the whole of direct manipulation in 2D.
Note that a rectangle exposes **four** handles even though it stores two
corners, because it is dragged by whichever corner is nearest the hand — the
two derived ones are named for the coordinates they take from each end.

## Relations and an iterative solver

```js
SKETCH_RELATIONS = [ horizontal, vertical, coincident, parallel, perpendicular,
                     tangent, equal, concentric, distance, angle, … ];
solveSketch(drawing, passes = 24, pinned = []) → { drawing, residual }
```

An iterative relaxation solver — repeatedly nudge toward satisfying each
relation — is enough for interactive sketching and is a fraction of the work of
a proper DOF-analysing solver. What it needs to be usable:

- **Report the residual.** `solved.residual < 1e-6` is a check you can write in
  a test, and a number the UI can show when a sketch is over- or
  under-constrained.
- **Honour pins.** The handle being dragged must not move; everything else
  relaxes around it.
- **Never diverge destructively.** Bound the passes and keep the last good
  drawing. A sketch that explodes on an over-constraint is worse than one that
  reports it did not converge.
- **Group coincident points** so a weld moves every element that shares an end.

Also useful, and cheap: `sketchRelationMarks(drawing)` returning where to draw
the little glyphs, so the constraints are visible rather than invisible state.

## Chains, welds and closing the wire

This is the part that actually decides whether the sketch is usable.

```js
sketchEnds(el) / sketchEndKeys(el)    // an element's two ends
sketchChainEnds(drawing, chain, closed)  // walk a chain, with reversal flags
sketchLoops(drawing, tolerance = 0.05)   // → closed loops
sketchNesting(drawing, loops, quality)   // which loop is inside which
```

Principles:

- **Tolerate a hand-drawn gap.** A gap of 0.02 in a 100-unit square still reads
  as a loop. Test it explicitly.
- **Welded ends win over exact geometry.** An arc built through three of its own
  points keeps the ends the chain welded, whatever that does to its radius. A
  wire that closes is worth more than a wire that is analytic.
- **Keep the reversal flag.** An element's own parameter direction is not the
  direction the chain walks it, and everything downstream (trimming, tangents,
  offsets) needs to know which.
- **Have a fallback.** If the exact edges will not join — a spline doubling back,
  an arc the weld made degenerate — rebuild the chain as a fine polyline through
  the same drawing rather than failing. Say that you did.

## One bad element must not lose the drawing

```js
//! Nothing one element is wrong about is allowed to reach the rest of the
//! drawing. A zero-length line, a circle of no radius, an arc the weld made
//! degenerate: each of them is one element that cannot be built, and the
//! answer is to build the other five hundred.
try { return edgesOfElement(el, frame, a, b).filter(Boolean); }
catch (e) { return []; }
```

Six invisible zero-length lines in a drawing of five hundred used to mean none
of it appeared outside the sketcher.

## Loops become faces, nesting becomes holes

Once loops and nesting are known, the rule is simple and worth testing with
areas rather than by eye:

- a closed loop → a face
- a loop inside a face → a hole
- a loop inside that hole → an island, solid again

Verify by measurement: a 200 square with two r18 holes pads to
`(200² − 2π18²) × 40`. That single test catches nesting bugs that look fine.

## Splines: smooth, not segmented

A sketched `spline` (through points) or `bspline` (control points) is evaluated
here — Catmull-Rom, or de Boor for the B-spline — and the result is **points**.
Do not hand those on as a polyline: fit them back to one B-spline edge or an
extrude off the sketch comes out as that many flat strips. See
`occt-geometry-recipes` for the fit and its tolerance rule.

## Layers, construction geometry and locking

Small features, large effect on whether professionals will use it:

- **Layers** with show/hide and a current layer; elements carry a layer name.
- **Construction geometry** that drives the drawing but builds nothing. Handle
  the all-construction case explicitly: `"everything in this sketch is
  construction geometry - it drives the drawing, but nothing is built from it"`
  is a far better answer than an empty feature.
- **Locking** so setting-out geometry survives a careless drag.

## Editing operations belong in the op vocabulary

Every sketch edit goes through the same pipeline as everything else, so undo,
scripting and the assistant all work without extra code:

```
draw · erase · nudge · drag · relate · unrelate · weld · fillet
layer · unlayer · relayer · construct
```

`drag` is the one that needs a coalescing key, so a drag is one undo step.

## Test it with numbers

A square is one loop. A hand-drawn gap is still one loop. Horizontal levels a
line to 1e-6. Coincident brings two ends to within 1e-6. A circle and a square
pad into both volumes. Rubbish in the file is dropped, not fatal. Every one of
those is a value you can write down before asking the program — see
`measured-truth`.
