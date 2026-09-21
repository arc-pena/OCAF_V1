---
name: ocaf-document-model
description: How to build the spine of a parametric application - an OCAF-style document of labels, attributes, TFunction drivers and a regeneration graph, with the feature catalogue declared as data so one code path draws every panel, saves every feature and undoes every edit. Use this whenever you are designing or extending a parametric feature tree, a history-based modeller, a node document, a dependency-driven recompute engine, or any application where user edits must re-execute only what is downstream. Also use when adding a feature type, designing undo, or deciding where a piece of state belongs on a document.
---

# The OCAF document model

This is the spine. Everything else in a parametric application — the tree, the
panels, the graph, undo, save, the assistant — is a projection of it, and every
one of those is cheap if the document is right and impossible if it is not.

Reference implementation: `docs/src/ocaf.js` (~4,100 lines) in this repository.

## A label tree with typed attributes

A document is a tree of **labels**. Each label has an integer **tag** (its
position under its parent) and a bag of **attributes** keyed by type name. A
feature is a label; its arguments are child labels; its result is a child
label at a reserved tag.

```
feature label
├── attr TFunction_Function  = the type's GUID   (which driver builds it)
├── attr TDataStd_Name       = "Extrude.1"
├── attr TDataStd_AsciiString= "EX1"             (stable id)
├── attr TDataStd_Integer    = 1                 (visible)
├── tag 1..n  arguments, one per catalogue entry, in declared order
├── tag 100   TNaming_NamedShape   the B-Rep result
├── tag 101   error string
├── tag 102   revision counter
├── tag 103   computed data (numbers, points, text)
├── tag 104   note — built, but has something to say
├── tag 10-49 script-declared parameters,  51 their specs
├── tag 52    appearance,  53 the frame it was built on,  54 parent container
└── …
```

Reserve the high tags as named constants and never renumber them:

```js
export const FIRST_ARG_TAG = 1, RESULT_TAG = 100, ERROR_TAG = 101,
             REVISION_TAG = 102, DATA_TAG = 103, NOTE_TAG = 104;
```

**The argument's index in the declaration is its tag on disk.** Append new
arguments, never insert — see the `append-only-model` skill, which exists
because of this.

## Declare the catalogue as data

A feature type is a record, not a class. Arguments are built by small helpers
so every one carries the same metadata:

```js
export const ARG = { real, ref, spare, refs, choice, text, code, blob,
                     edits, subs, drawing, when, whenAny };

{ type: "Extrude", guid: "…-0007", category: "operation",
  summary: "Drags a profile along a direction…",
  args: [ ref("profile", "Profile", ["curve", "plane"]),
          ref("direction", "Direction", ["vector"]),
          choice("limit", "Limit", ["Distance", "Up to plane"], 0),
          when(real("distance", "Distance", 40, -2000, 2000, 1), "limit", 0),
          choice("cap", "Result", ["Solid", "Surface"], 0) ] }
```

What each part earns:

- **`kinds` on a `ref`** (`["curve", "plane"]`) drives what the wiring UI will
  offer and what the graph will let you connect. One declaration, three
  consumers.
- **`when(arg, key, value)`** makes a field conditional on a choice, so one
  feature type can be five variants (a Point from coordinates, on a curve, at a
  centre, at an extreme, between two curves) without five types. This is the
  single highest-leverage idea in the catalogue: variants collapse the type
  count enormously and each variant still has typed, named, savable arguments.
- **`spare()`** marks a reference that auto-wiring must not fill, so a feature
  with three optional inputs does not get all three pointed at the same thing.
- **`summary`** is what a tooltip, the docs and an AI assistant all read.

Adding a type is two declarations — a catalogue entry and a driver — and
**zero** interface code. If adding a type needs a third edit somewhere, that
somewhere is a leak; fix it there.

## A driver is a pure function of the document

```js
builders.Extrude = {
  precondition: f => F.shape(F.reference(f, "profile")) ? null
                   : "wire in a profile to extrude",
  build: f => ({ shape, data, note }),
};
```

Three rules make drivers composable:

1. **Read arguments only through accessors** (`F.real`, `F.reference`,
   `F.shape`, `F.text`, `F.picks`). A driver never touches a raw label.
2. **Return one of three things**: a shape, `{shape, data}`, or `data` alone —
   a Number computes and builds nothing. Plus an optional `note` (see
   `degrade-and-report`).
3. **Build only through the geometry factory**, never by reaching for the
   kernel. That is what stops "point on a curve" and "point at the centre"
   developing two different ideas of what a curve is.

`precondition` is separate from `build` on purpose: a missing input is a thing
to *say* ("wire in a profile"), not an exception to catch.

## The dependency graph comes from the references

Nothing declares "Extrude depends on Sketch". It falls out of the fact that
an argument holds a `TDF_Reference`:

```js
arguments(f) {
  // A reference argument depends on the RESULT of the feature it points at.
  // That is what orders the graph: edit a cube and its fillet must follow.
  //
  // PARENT_TAG carries a reference too and is deliberately excluded: which
  // folder a feature is filed in has nothing to do with what it is built from.
  // Counting it would order the graph by the tree, make every member of a set
  // depend on the set, and refuse to delete a container because everything in
  // it "reads from" it.
}
```

That exclusion is the general lesson: **not every reference is a dependency.**
Organisational links, appearance links and annotation links must be kept out of
the recompute graph or the graph becomes the tree.

## Regenerate by logbook, not by rebuilding everything

```js
class Logbook {
  touch(label)      { this.touched.add(label); }      // the user edited this
  impact(label)     { this.impacted.add(label); }     // a driver wrote this
  isModified(label) { return this.touched.has(label) || this.impacted.has(label); }
}

mustExecute(f, log) {
  return log.isModified(f) || this.arguments(f).some(a => log.isModified(a));
}
```

An edit touches one label; the solver walks the graph in dependency order and
executes only features whose own label or one of whose argument labels is
marked. Each execution bumps a **revision counter**, and that counter is the
only reason the viewport can ask for the shapes that changed and no others.

## Failure is contained, not fatal

```js
execute(f, log) {
  const objection = this.precondition(f);
  if (objection) { F.setError(f, objection); return 1; }
  try { built = this.build(f); }
  catch (err) { F.setError(f, this.describeError(err)); return 1; }
  …
}
```

> Never lets the kernel take the process with it: the arguments are checked
> first, the call itself is guarded, and a failure keeps the last good shape so
> the rest of the tree still regenerates.

One red feature in a tree of two hundred leaves the other 199 built and
visible. That is the behaviour people expect from a modeller and it costs one
try/catch in one place.

## Where state belongs

Decide once, per kind of state, and write the reason on the tag:

| state | where | why |
|---|---|---|
| an argument | a child label, tag = declared index | it drives geometry; it must order the graph |
| the result | `RESULT_TAG` | so readers can depend on it specifically |
| computed values | `DATA_TAG` | a Number has this and no shape |
| error | `ERROR_TAG` | stops the feature |
| note | `NOTE_TAG` | does **not** stop the feature |
| appearance | its own tag, outside the args | drives no geometry — XCAF keeps colour beside a shape for the same reason |
| container/folder | on the **child**, as a reference | a feature belongs to exactly one set; one place to write it is one place for it to be wrong |
| which row is selected | the interface | rebuildable from nothing |

## Undo for free

Because every edit is a labelled mutation of one document, undo is a document
snapshot or an inverse-edit log — not a per-feature `undo()` method. Route
**every** edit through one pipeline (`mdl.js` here) with an op vocabulary:

```
add · delete · set · connect · disconnect · rename · group · appearance
code · sketch · draw · relate · drag · pick · meshop · vertex · import
model · move · select · undo · redo
```

Two properties worth copying: consecutive edits with the same key coalesce
(`"set:CB1:dx"`) so a slider drag is one undo step, not four hundred; and the
graph's node positions ride in the model file, so undo restores layout too.

## Checklist for a new feature type

1. Catalogue entry — args **appended**, `kinds` on every ref, `when()` for
   variants, a `summary` written for a person.
2. A driver — `precondition` returning a sentence, `build` returning
   `{shape, data, note}`, geometry only through the factory.
3. Nothing else. If you touched the panel, the tree, the graph or the save
   code, find out why and fix that instead.
