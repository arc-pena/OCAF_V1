---
name: cad-file-exchange
description: How to get models in and out of a CAD application - a readable native format, STEP with a named and coloured assembly tree via XCAF, BREP, DXF, OBJ and STL, and instantiating a saved feature set as a reusable user-defined component. Use this whenever you are adding import or export, writing a save format, working with STEP/XCAF/IGES/DXF/OBJ/STL, carrying metadata or units across a file boundary, or building templates, blocks, components or user-defined features that are instantiated from another file.
---

# File exchange and reuse

A modeller is judged on what it can hand to the next tool. Three separate jobs
live here and they want different things: the **native format** must round-trip
the document exactly, the **exchange formats** must carry structure and
metadata to software you do not control, and **instantiation** must copy a
piece of one document into another without collisions.

## The native format is readable JSON

```json
{ "format": "ocaf-parametric-model", "version": 1, "name": "Part1",
  "units": "mm",
  "features": [
    { "id": "EX1", "type": "Extrude", "name": "Extrude.1", "parent": "GS1",
      "args": { "profile": {"ref": "RE1"}, "distance": -3285, "cap": "Surface" } }
  ] }
```

Decisions worth copying:

- **Name the format and version it.** Two fields, and every future migration
  question has somewhere to be answered.
- **Declare the units in the file.** Nothing should ever ask on open.
- **Arguments by key, not by index.** The *storage* is positional (see
  `append-only-model`); the *file* is by name, so a file stays readable and a
  renamed-but-not-reordered argument is a soft failure rather than silent
  corruption.
- **Choices stored as their label** (`"Surface"`) rather than an integer. It
  costs a lookup and makes the file diffable and hand-editable.
- **`parent` on the child**, matching the document model.
- **Carry view state that belongs to the model** — graph node positions, hidden
  set — so opening a file gives back the arrangement somebody left.

Because the file is JSON and the op vocabulary is JSON, a model file and an
edit script are the same kind of thing. That is what lets an AI assistant, a
test fixture and a sample file all use one code path.

## STEP through XCAF, not through a plain writer

A plain STEP writer gives you a bag of solids. `STEPCAFControl_Writer` over an
XCAF document gives you a real assembly tree **with names and colours**:

```
RMUH_v1 → Column  → P-A1-COL-01
        → Roof    → P-A1-CANOPY
        → Glazing, Mullion, Transom, Slab, Site
```

Measured on the reference model: AP214, millimetres, 1306 `MANIFOLD_SOLID_BREP`,
72 B-spline surfaces, 1306 `STYLED_ITEM`. That opens in Rhino or anything else
as a structured, coloured, named model rather than as geometry soup.

Attach metadata as user strings per object — category, IFC class, profile,
material, computed quantities — so a façade schedule becomes a metadata query
rather than a re-measurement:

```
Category = Column   IfcClass = IfcColumn   Profile = 450x450
Material = Steel, painted white            Height_mm = 11339.7
```

## Preserve identity across the boundary

The most valuable thing an export can carry is often not geometry, it is
**identity**. A column that meets a doubly-curved soffit could be boolean-cut
against that surface — and doing so turns every column into a generic trimmed
B-Rep and destroys the extrusion identity that makes the model editable
downstream.

The alternative used here: give each vertical element the height of the lowest
soffit point over its own footprint. Corner columns run to 11339.7 mm,
mid-edge to 10934.9 mm; each still a genuine extrusion with an editable
profile; the residual step across one 450 mm footprint is a few millimetres.

**Ask what the receiving tool needs to be able to edit**, and preserve that
even at a small cost in geometric exactness. Then say what the cost is,
measured.

## Know each format's ceiling, and say so

Every exchange format has a hole in it. Find yours, measure the workaround, and
document it where the exporter lives:

- **rhino3dm** cannot author an arbitrary NURBS surface — `NurbsSurfacePointList`
  is read-only and its only general surface constructor is `CreateRuledSurface`.
  So each canopy is emitted as 16 ruled strips between exact isocurves sampled
  off the real surface, at 33 control points each. **Measured worst-case
  deviation: 20.8 mm over a 26 m span (0.08%)**, and the STEP carries the exact
  surface if you need it.
- `NurbsCurve.Create` treats supplied points as **control points**, not
  interpolation points — with 9 points the edge curve missed the true surface by
  99 mm, which is why 33 are used.
- **DXF** is 2D and layer-oriented: map sketch layers to DXF layers and
  construction geometry to its own, or drawings come back unusable.
- **OBJ/STL** carry no units and no structure. State the unit in the filename or
  a sidecar, and mesh from the kernel rather than from the viewport's display
  tessellation — display deflection is chosen for frame rate, not for print.
- **BREP** is the exact round-trip within one kernel and carries nothing else.
  It is the right format for fixtures and for a clipboard.

## Scale variants are a separate export, not a scaled export

At 1:500 the mullions (0.14 mm) and glazing (0.06 mm) fall below any nozzle. A
print variant is a different *model* — canopy, slabs, columns and a solid glazed
volume per storey — not the same model multiplied by 0.002. Build the variant
from the parameters, and report what is marginal (`the one marginal feature is
the 0.70 mm slab, whose 1.2 mm oversail is a thin ledge`).

## Instantiation: a saved set as a component

The payoff of a parametric document is that a set of features — numbers, an
expression, planes, a sketch, an extrude — is a **user-defined feature** that
can be instantiated from another file.

What the instantiate path must do:

1. **Fresh ids, rewritten references.** Generate new ids and rewrite every
   internal reference in one pass. Never hope names do not collide.
2. **Copy every kind of argument, not just numbers.** The bug that made this
   feel broken was an object-form argument — a sketch drawing — being dropped
   because the copier only recognised scalars and refs. Recognise by the
   argument's declared kind *or* by shape (`Array.isArray(value.elements)`), and
   test instantiation of a set containing a sketch.
3. **Declare the inputs.** Work out which references crossed the boundary
   inward, deduplicate them (three sub-features reading one input is **one**
   input), and write the list onto the set so the panel and the graph can offer
   them as the component's parameters.
4. **Keep the source readable.** Instantiating from a model *file* — point at a
   saved document, pick a named set — is worth more than a bespoke library
   format, because the thing being reused is an ordinary model somebody made.

## Import is a feature, not a side effect

Imported geometry should arrive as a feature in the tree with the source
recorded on it (`Imported` holding a BREP blob, `MeshImported` holding OBJ),
so it saves with the model, regenerates, and can be referenced like anything
else. An import that drops loose shapes into a scene loses the thread the first
time the file is reopened.

## Test the round trip with numbers

Write it, read it back, and compare a measured quantity — volume, area, face
count, the assembly tree's shape — not a byte diff. Byte diffs fail on
timestamps and pass on semantic loss; a volume comparison does the opposite.
