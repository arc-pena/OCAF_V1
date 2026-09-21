---
name: direct-manipulation-widgets
description: How to build the widgets that make a 3D application feel like a tool rather than a form - drag handles that write back into parameters, transform gizmos, sub-shape picking that survives a rebuild, snapping and rulers, and live value feedback during a drag. Use this whenever you are adding a handle, a gizmo, an on-screen manipulator, click-to-pick faces or edges or vertices, drag-to-edit behaviour, or snapping; whenever a drag feels laggy or produces a hundred undo steps; and when deciding what a user should be able to grab in a viewport.
---

# Direct manipulation

A parametric modeller with only a definition panel is a form. What makes it a
tool is that the thing on screen can be grabbed, and grabbing it edits the
document — the same document, through the same pipeline, with the same undo.

Reference: `docs/src/handle.js`, `docs/src/gizmo.js`, `docs/src/subshape.js`.

## A drag is a parameter edit, not a transform

The rule that keeps everything consistent: **a handle never moves geometry. It
computes a new value for a named argument and sends an ordinary edit.**

```
pointer move → ray → intersect the handle's constraint → a number
             → { op: "set", id, key, value }  → solver → new tessellation
```

Everything follows from that: the drag is undoable because every edit is, it is
scriptable because the op vocabulary is, it survives a rebuild because the
value lives on the document, and a collaborator or an AI assistant can make the
same edit without touching the viewport.

Two practical consequences:

- **Coalesce by key.** Give the edit a coalescing key (`"set:CB1:dx"`) so four
  hundred pointer-moves collapse into one undo step. Without this, undo becomes
  useless during any drag.
- **Show the number while dragging.** A heads-up readout with the live value
  and a unit, next to the pointer, turns "drag until it looks right" into
  "drag to 240 mm". Let it be typed into as well — see `parametric-values`.

## Project the ray onto the right constraint

A drag is always constrained to something. Three primitives cover nearly
everything, and keeping them as pure functions makes them testable without a
viewport:

```js
rulerAt(from, way, at, dir)      // nearest point on an axis through `at`
onPlane(from, way, at, normal)   // where the ray meets a plane
nearestOnEdges(edges, from, way) // nearest point on real geometry (snapping)
```

`from`/`way` are the ray origin and direction. Everything else — an axis arrow,
a planar handle, a radius grip, a slider in space — is one of these three plus
a scalar read off the result.

For rotation, project onto the plane normal to the axis and take the swept
angle against a reference direction; wrap it through a shortest-turn helper so
crossing ±π does not spin the object.

## The gizmo is data

Declare the handles rather than building three bespoke widgets:

```js
GIZMO_AXES    = [ x, y, z ]           // colour, direction
GIZMO_PLANES  = [ xy, yz, zx ]
GIZMO_MODES   = { move, rotate, scale }
GIZMO_ORDER   = ["move", "rotate", "scale"]
handlesFor(mode)                      // → the handles to draw and hit-test
```

The same declaration draws the arrows, builds the hit targets and dispatches
the drag. Adding a mode is a table entry.

Rules that make a gizmo feel right rather than fought-with:

- **Constant screen size.** Scale the gizmo by distance so it is the same size
  at any zoom. A gizmo that shrinks to nothing when you zoom out is unusable
  exactly when you need it.
- **Draw with `depthTest: false` and a high `renderOrder`.** A handle buried
  inside the solid it manipulates cannot be grabbed.
- **Light the hovered handle.** One colour change, and the user knows what they
  are about to drag before they press.
- **Quantise with a step, not by rounding the result.** `stepped(value, step)`
  applied to the *computed* value, so a nudged object lands on the grid rather
  than drifting off it.

## Sub-shape picking must survive a rebuild

Clicking a face to draft it or an edge to fillet it is the interaction that
separates a modeller from a parametric toy. The hard part is not the click —
it is that **an index into a tessellation is meaningless after the next edit.**

Store a geometric anchor instead:

```js
edgeAnchor(points)              // midpoint + length
faceAnchor(positions, index)    // a point on it + its normal
pickOf(of, kind, at, near)      // what was picked, as a record
writePicks / readPicks          // the persisted form
resolvePicks(anchors, picks)    // → { found, lost } after a rebuild
matchPick(anchors, pick, size)  // nearest match within tolerance
```

Three things this buys:

1. A fillet on "the top edge" stays on the top edge when the box gets taller.
2. When a pick genuinely cannot be resolved, you can **say so**: `"3 picked
   edges lost"`, `"none of the corners picked are on this curve any more"` —
   instead of silently filleting something else.
3. An empty pick list can mean *all of them*, which is what a person expects
   from a fillet tool with nothing selected. Make that the documented default:
   `"which corners to round · empty rounds every one"`.

Offer chain helpers too, because nobody wants to click forty edges:

```js
tangentChain(edges, from, { angle = 5, weld = 0 })   // follow smooth continuation
smoothPatch(faces, from, { angle = 5 })              // grow across smooth joins
```

## Snapping, and telling the user what it snapped to

Snapping is only useful if it is visible. Two halves:

- **Leads and rulers.** `LEADS` and `RULERS` declare, per feature kind, what
  directions and what reference geometry a drag should respect — a point on a
  curve slides along that curve, a plane offset runs along its own normal.
- **Say the target.** When a drag snaps, name what it snapped to in the heads-up
  readout. A snap the user cannot see is a snap they will fight.

Measure to the *element*, not to the samples it was tessellated at. A line is
tessellated as its two ends and nothing between them, so measuring to samples
puts the nearest point at an endpoint when it should be in the middle.

## Double-click is "step into"

Keep one gesture for entering a thing, whatever the thing is:

- double-click a sketch → the sketcher opens on its plane
- double-click a camera → the view steps through it (and again steps out)
- double-click a group/set → its sub-graph opens
- double-click anything else → its definition panel

Consistency here is worth more than any individual affordance. The way in is
also the way out.

## Keep the interaction vocabulary conventional

Do not invent navigation. Copy what the user's other tools already do — here
that is Maya/CAD convention: Alt+left tumbles, middle tracks, right dollies,
wheel zooms, `f` frames the selection, Esc steps out. Put the current
convention in the status bar during a modal state (`"Alt: left tumbles, middle
tracks, right dollies · Esc to step out"`), because that is exactly when
somebody has forgotten it.

Shift extends a selection to a range, Ctrl/Cmd toggles one. Those two have
meant the same thing in every file list for thirty years; a modeller that
redefines them loses.

## Test widgets without a viewport, then with one

The projection primitives are pure functions — test them with numbers. The rest
needs a browser: drive the real gesture with real pointer events, because
setting internal state directly does not exercise the path that ships and can
silently do nothing. See `measured-truth`.
