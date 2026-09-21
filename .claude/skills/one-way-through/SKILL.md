---
name: one-way-through
description: How to structure an application so that each concept has exactly one implementation and one path through the code - a kernel that owns the state and an interface that only mirrors it, two backends behind one identical call surface, behaviour declared as data and built by named drivers, and a single chokepoint per concept so two ideas of the same thing cannot diverge. Use this whenever you are about to add a second branch that does nearly what an existing one does, whenever a bug turns out to affect one code path but not its twin, whenever an interface is accumulating its own copy of state the backend already has, whenever you are adding a swappable backend, and when designing extension or plugin points.
---

# One way through

Nearly every structural bug in this project was two paths where there should
have been one. The framing that fixed them, and that the architecture is built
on: **for any concept, there is one place that decides, and everything else
asks it.**

## The interface owns no state the document owns

The modeller's front end is ten thousand lines and holds almost no truth. The
kernel holds the document — the label tree, the parameters, the B-Rep. The page
mirrors that tree and draws the triangles it is handed.

> Editing a parameter re-executes only the functions downstream of the edit;
> each rebuilt feature's revision moves, and the page re-fetches the triangle
> stream for those shapes and no others.

What this buys is not purity, it is that **there is no reconciliation problem**.
Undo, file loading, a package adding nodes, an assistant editing the model and
a user dragging a slider all take the same road, so none of them can leave the
view disagreeing with the document. The view's own state is genuinely its own:
which row is selected, what is folded, where the camera is.

The test of whether you have this: can you throw the entire view away and
rebuild it from the document? If not, the view is holding truth.

## Two implementations, one call surface

Two kernels back this program — OpenCascade compiled to WebAssembly in the
page, and a native process over HTTP — and:

> Two kernels answer exactly the same calls, and nothing above `kernel` in the
> code learns which one it got.

The discipline that makes it hold is negative: **no `if (kind === "wasm")`
anywhere above the boundary.** The moment one appears, the abstraction is
decorative and both implementations start drifting. If a capability exists in
only one, it is either added to the other or expressed in the shared surface as
something askable (`formats`, `schema()`), not as a type check.

The same shape appears at the resource layer — packed payload or fetched file,
one function, same return type either way — and at the geometry layer, where
drivers reach the kernel only through one small factory.

## Behaviour as data, built by a named driver

The catalogue declares what a feature *is* — its arguments, their types,
defaults, labels, and how it is presented — as plain data. A separate registry
says which function builds it.

```js
{ type: "FillSurface", guid: "…", category: "operation",
  args: [ refs("boundary", …), refs("supports", …), choice("continuity", …), … ] }

builders.FillSurface = { precondition: f => …, build: f => … };
```

This is what lets one code path draw every definition panel, one path save and
load every feature, one path undo every edit, and one path tell an assistant
what exists. Adding a node adds two declarations and no interface code.

The cost to watch: the declaration is now a persisted contract (see
`append-only-model` — argument order is storage). The benefit is that the
number of places that know about a specific feature type stays at two.

## One chokepoint per concept

Said in the factory's own comment:

> Every driver below builds its shape by calling one of these two and nothing
> else. That is the whole point of them: a driver's job is to read its
> arguments off the document and hand them over, so "point on a curve" and
> "point at the centre" cannot end up with two different ideas of what a curve
> is.

When this was violated, the bugs were all the same bug:

- **`surfaceMaterial` had three branches.** One set `side: DoubleSide` and two
  did not — so the default style was the one way of looking at a model that
  hid half the surfaces in it. The fix was not to add `side` twice more; it was
  one `bothSides()` function every branch returns through, so the next branch
  cannot forget.
- **Distance measurement had two forms.** The factory used the safe one; two
  newer call sites used a constructor overload that threw on every call. A
  nearest-face search silently returned face 0 forever. One `gapBetween()` now,
  used everywhere.
- **Curve sampling had six sites.** Each one independently decided to hand on
  its samples as a polyline. Fixing "curves should be smooth" meant finding all
  six. One `fitCurve()` now — and a new curve node gets it by default.

The heuristic: **if you are about to write a second branch that does nearly
what an existing one does, the right move is usually to funnel both through one
function that takes the difference as an argument.** Copying the branch is how
one of them gets fixed and the other does not.

## Extension by declaration, inert until asked

Packages here declare themselves as data — id, name, summary, the nodes they
add, the API they expose, the data they need — and nothing runs until `start()`:

```js
export const CLIMATE = offerPlugin({
  id: "climate", name: "Climate & Sun", summary: "…",
  nodes: CLIMATE_NODES, api: {…}, view: {…}, resources: [{…}],
  async start(kit) { … }          // the ONLY thing that runs on load
});
```

The declaration being readable with the package switched off is what lets a
menu list it, and lets an assistant be told "there is a Climate package you
could ask for" without paying for its contents in every prompt.

Generalises to: **make the description of a thing cheaper than the thing.** Any
registry that has to be enumerated (commands, tools, routes, plugins, feature
flags) benefits from a declaration that costs nothing to read.

## Pass capabilities in; do not reach out

The geometry factory is handed the handful of things it needs from the document
side rather than importing them:

> The handful of things a factory needs that only the document side knows how
> to do — reading a wire off a shape, meshing one — are handed in rather than
> reached for, so the factories stay geometry.

This keeps the dependency graph a tree. It also makes the layer testable
without the layer above it, which is why the geometry has 42 suites and the
interface has a browser harness.

## Questions to ask at a review

- Is there a second place that decides this? Name it.
- If I throw the view away, can it be rebuilt from the document?
- Is there a type check above the abstraction boundary?
- Does adding one more of these require touching more than two files?
- If a new branch forgot this line, would anything fail?
