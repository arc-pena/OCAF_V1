---
name: node-graph-editor
description: How to build a Grasshopper/ComfyUI-style node graph that is a second view of an existing document rather than a separate model - ports generated from the same declaration the panel uses, wiring that validates by declared kinds, containers that collapse into single nodes with deduplicated inputs, and sub-graphs you step into and back out of. Use this whenever you are adding a node editor, a visual programming view, a dataflow canvas, or a second editable view of a document; whenever wires and the tree can disagree; and when designing grouping, collapsing or sub-graph navigation.
---

# The node graph

A node graph is not a second model. It is **the specification tree read the
other way round** — the same features, the same arguments, the same references,
drawn as boxes and wires. Get that right and the graph costs one module and can
never disagree with the tree. Get it wrong and you are maintaining two
documents.

Reference: `docs/src/graph.js` (~2,000 lines) in this repository.

## It owns no state but position

The graph's only private state is where the nodes sit — and even that is
written into the model file, so undo restores layout and a shared file opens
with the same arrangement.

Everything else is read from the document each refresh: which features exist,
what arguments they declare, which references are wired, what is selected, what
errored. Every graph gesture emits the same edits as the panel does:

```
connect · disconnect · add · delete · group · move · select
```

There is no `graphConnect`. If the graph needs an operation the rest of the
application does not have, add it to the op vocabulary for everyone.

## Ports come from the declaration

Inputs are the feature's declared arguments; the output is its result. Both
come from the same catalogue entry that draws the definition panel (see
`ocaf-document-model`), so a new feature type appears in the graph with correct
ports and no graph code:

- a `ref` → one input port, labelled, accepting its declared `kinds`
- a `refs` (list) → one port that accepts many wires
- a `real`/`choice` → an inline control on the node *and* a port, because a
  number can be wired from an Expression or typed in place
- `when()` fields → ports that appear and disappear with their controlling
  choice

**Validate a drop by the declared kinds.** `acceptsFrom(accepts, entry)` is the
one predicate, shared with the panel's dropdown, so what the graph lets you
connect and what the panel offers are the same set by construction.

## Carry the identity on the port

Each port element carries what it refers to, rather than being found by index:

```js
port.dataset.in   = holderId;     // which feature this port belongs to
port.dataset.key  = argKey;       // which argument
port.dataset.also = JSON.stringify(siblings);   // other holders this port stands for
```

`data-also` is what makes collapsed containers work, below. The general rule is
the one from `append-only-model`: **never zip two lists by position.** A graph
redraw filters nodes constantly, and any index-based association will silently
attach a wire to the wrong port.

## Containers collapse into a node

A geometrical set, group or assembly should behave the way Grasshopper and
ComfyUI clusters do: it swallows what it contains and shows as **one node**.

Getting this right is mostly about the inputs:

1. **Gather** every reference that crosses the boundary inward — something
   inside the set reading something outside it.
2. **Deduplicate**. If three features inside the set all read the same external
   input, the collapsed node shows **one** port, not three. This is the detail
   that decides whether collapsing is useful or noise.
3. **Remember the group.** That one port stands for three holders, which is
   what `data-also` carries; wiring it rewires all three in one edit.
4. **Outputs** are whatever inside the set is read from outside it, plus the
   set's own result if it has one.

The same grouping logic serves the definition panel for a set — one input list,
deduplicated — so there is one implementation (`reuse.js` here:
`membersOf`, `reachesIn`, `reachesOut`, `gatherInputs`, `setInputGroups`).

Selecting several nodes and grouping them should move them into the container
*and* collapse them, in one edit.

## Step in, step out

Double-click a collapsed node to open its sub-graph; a breadcrumb and a back
button return to the master graph. Inside, the set's inputs appear as source
nodes so the sub-graph is self-contained to look at.

Two implementation notes that matter more than they look:

- **Namespace the shapes.** Node identity keys must include which graph you are
  in (`"@" + inside + "|" + id`), or a node that appears in both the master and
  a sub-graph shares state and flickers.
- **Double-click means step into** everywhere in the application — a sketch
  opens the sketcher, a camera steps through it, a set opens its sub-graph.
  Consistency of that one gesture is worth more than any individual affordance.

## Drawing

- **Wires as curves**, with the tangent leaving horizontally from an output and
  arriving horizontally at an input. Straight lines are unreadable the moment
  two nodes are vertically aligned.
- **Colour by kind** (curve, plane, solid, number, mesh), matching the
  viewport's colours. The graph then reads at a glance.
- **Mark errors on the node**, with the message on hover. The graph is often
  where somebody is looking when something breaks.
- **Live-highlight valid targets** while dragging a wire: dim the ports that
  will not accept it. That turns kind-checking from a refusal into guidance.
- **Redraw wires on layout change, not on every frame.** Cache the path and
  recompute only for nodes that moved.

## Layout that does not fight the user

Auto-layout on first open (a simple layered left-to-right sort by dependency
depth is enough), then **never move a node the user has placed**. Store
positions in the model. New nodes appear near whatever they were created from,
not at the origin.

## Test it against the tree

The strongest test of a graph is that it cannot disagree with the document:
build a model through the tree, read the graph, and assert that the wires match
the references exactly — including after a group, a collapse, an undo and a
reload. Any divergence is the graph having grown state of its own, which is the
failure mode this whole design exists to prevent.
