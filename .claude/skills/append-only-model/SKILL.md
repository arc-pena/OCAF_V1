---
name: append-only-model
description: How to design and evolve a persisted document model whose files must keep opening - a parametric feature tree, a node graph, a scene format, a save file, any schema where position or order carries identity. Covers append-only fields, association by datum rather than by array position, and keeping a generated manifest in step with what is on disk. Use this whenever you are adding a field to a saved format, whenever two lists are being zipped together by index, whenever old files could misread after a change, whenever you are designing a feature/node/document model, and before reordering anything that has been written to disk.
---

# Append-only model

A document model is a promise to every file that has already been saved. Most
of the rules below are versions of one idea: **anything a file depends on must
not be able to move.**

## Index is identity — so append, never insert

In this project a feature's arguments are a JavaScript array, and an argument's
position in that array *is* its storage tag on disk:

```js
{ type: "Circle", args: [ real("radius", …), ref("plane", …), … ] }
//                        tag 0             tag 1
```

Inserting a new argument at position 1 does not add a field. It **renames
every field after it**, and every file already saved reads its plane as its
radius. There is no error; it opens, and it is wrong.

So: new arguments are appended to the end of the list, always, even when the
tidy place for them is the middle. The panel can order fields however it likes
for display; the array is storage and storage is append-only.

This generalises to anything positional that is persisted — column order in a
binary record, field order in a packed struct, child order in a tree where
children are addressed by index. Say it once, loudly, at the top of the file
that defines the schema:

```js
//! AN ARGUMENT'S INDEX IN args[] IS ITS CHILD TAG ON DISK. New arguments are
//! APPENDED, never inserted, or every file already saved misreads everything
//! after the insertion point - silently.
```

If a field genuinely must move, that is a format version and a migration, not
an edit.

## Never zip two lists by position

The same failure in miniature, and it is everywhere. This code attached each
rounded corner's arc to an edge by counting:

```js
let at = 0;
for (const [a] of junctions) { arcAfter.set(a, arcs[at]); at++; }   // wrong
```

`junctions` holds every corner. `arcs` holds only the corners that were
actually rounded — corners that are already smooth, too tight for the radius,
or simply not picked produce none. **One skipped corner shifted every arc after
it onto the wrong edge**, and the result was a wire that would not close, with
nothing wrong with any of the arcs in it.

The fix is not to fix the counter. It is to stop counting:

```js
arcs.push({ after: a, onto: b, ... });        // the association travels with the datum
for (const arc of arcs) arcAfter.set(arc.after, arc);
```

The rule: **when two collections are related, carry the relation in the data,
not in the agreement that they are the same length.** Parallel arrays are fine
right up until one of them can be filtered, and something can always be
filtered eventually.

A useful smell test: if removing an element from one list would require you to
remove "the matching one" from another, the relation is not in the data.

## Give every stored thing a stable name

Positional identity is the strongest form of this problem; the weakest is
using a display name as a key. Between them sits the thing to aim for: a short
opaque id, generated once, never reused, never derived from content.

When a feature is copied — instantiated from another file, duplicated,
templated — generate fresh ids and rewrite references in one pass, rather than
hoping names do not collide. And when an id cannot be resolved on load, say so
by name: "none of the corners picked are on this curve any more" is a better
outcome than silently rounding a different corner.

## A generated manifest must be checked both ways

Any list in code that mirrors a set of files on disk drifts, and it drifts
silently in whichever direction you did not check:

```python
_on_disk = {f.name for f in (DATA / "samples").glob("*.json")}
_listed  = {name for _, name in SAMPLES}
if _on_disk != _listed:
    sys.exit("data/samples does not match SAMPLES in build.py: " + ...)
```

A listed-but-missing file fails loudly at build. A present-but-unlisted file
does not fail at all — it just works in one build and not the other, which is
the kind of difference only somebody else ever finds. Check both directions and
name the offenders.

## Let a file report rather than be repaired

When someone hands you a saved file that opens with an error in it, resist
fixing their model. In one case a fill surface reported a 500 mm gap in its
boundary. Closing the loop would have meant inventing design intent. What was
done instead:

- the genuinely accidental leftovers — two nodes with no inputs at all, created
  and never wired — were removed, because nothing was lost;
- the real gap was left, and the node that reports it was named in the test, so
  a different breakage still fails while this one is expected;
- it was said plainly in the summary, with the coordinates.

The distinction worth keeping: **remove what is obviously vestigial, report
what is a decision.**

## Prefer data that survives a rename

Two small habits that paid off repeatedly:

- **Store the semantic value, not the rendered one.** A sketch is stored in the
  plane's own two coordinates and nowhere else, so moving the plane moves the
  drawing and nothing in the file changes. A test asserts the saved JSON
  contains no world coordinates at all.
- **Store what was chosen, not what was computed.** A reference to a feature,
  not a copy of its result. The result is regenerated; the choice is the
  document.
