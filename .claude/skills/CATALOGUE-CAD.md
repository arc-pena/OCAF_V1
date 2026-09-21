# The CAD catalogue

Eight domain skills: how to build a parametric CAD application on OpenCascade,
an OCAF-style document, Three.js and a widget layer. The reference
implementation is `docs/` in this repository — about 44,000 lines of source and
42 test suites.

The other catalogue (`CATALOGUE.md`) is **how to work**. This one is **how the
machine is built**. Use them together: the practice skills say verify by
measurement; these say what to measure.

## The stack, bottom to top

```
  file exchange          STEP · BREP · DXF · OBJ · model JSON · instantiation
        ▲
  the document           labels · tags · drivers · regeneration · undo
        ▲                        ▲                    ▲
  geometry              views: viewport · tree+panel · node graph
  (OCCT factory)                 ▲                    ▲
                        widgets · values · sketcher
```

Everything above the document is a **projection** of it. Nothing above the
document holds truth. That single rule is what keeps the tree, the panel, the
graph, undo, save and the assistant from ever disagreeing.

## The eight

| skill | what it builds |
|---|---|
| **ocaf-document-model** | the spine: labels, tags, a declared catalogue, drivers, the regeneration graph, undo |
| **occt-geometry-recipes** | the B-Rep vocabulary and its traps — analytic vs fitted vs sampled, tolerances, meshing, orientation |
| **kernel-viewport-bridge** | Three.js as a mirror: tessellation streams, revision-driven refresh, styles, picking, section caps, sidedness |
| **direct-manipulation-widgets** | handles, gizmos, sub-shape picks that survive a rebuild, drag-to-parameter |
| **floating-cad-shell** | the chrome: measured docks, a scale variable, spec tree, generated panel, pie menu, heads-up |
| **parametric-values** | units, a safe expression parser, typed fields, promoting a formula to a node |
| **constraint-sketcher** | 2D elements, relations, a solver, welding, loops → faces with holes |
| **node-graph-editor** | the document read the other way: ports from the same declaration, collapsed sets, sub-graphs |
| **cad-file-exchange** | native JSON, XCAF STEP with names and colours, format ceilings, user-defined features |

## Build order, if you are starting a new one

1. **The document first.** `ocaf-document-model`. Nothing else is cheap until
   labels, tags, drivers and the regeneration graph exist. A weekend here saves
   a month later.
2. **The geometry factory.** `occt-geometry-recipes`. One table, one
   vocabulary. Drivers never touch the kernel.
3. **Enough viewport to see it.** `kernel-viewport-bridge`. Streams, one group
   per feature, refresh by revision. Both sides of every surface.
4. **Tree and generated panel.** `floating-cad-shell`. If adding a feature type
   needs interface code, stop and fix that first — everything after this
   compounds on it.
5. **Typed values.** `parametric-values`. Retrofitting units and expressions
   into a codebase full of bare floats is the single most expensive migration
   in this space.
6. **The sketcher**, if 2D profiles are your input. `constraint-sketcher`.
7. **Widgets.** `direct-manipulation-widgets`. This is what turns it from a
   form into a tool, and it is safe to defer until the document is settled
   because every drag is just an edit.
8. **The graph and exchange**, in either order. `node-graph-editor`,
   `cad-file-exchange`.

## The five decisions that everything else rests on

1. **The kernel owns the model; the view mirrors it.** Can you throw the entire
   interface away and rebuild it from the document? If not, the view is holding
   truth and you will spend the project reconciling.
2. **A feature type is a declaration plus a driver — and nothing else.** Two
   edits to add a node. The moment a third is needed, the leak is somewhere
   else and it will keep costing.
3. **The argument's index is its tag on disk.** Append, never insert. This is
   the rule that decides whether files from six months ago still open.
4. **Every edit goes through one pipeline** with a named op. Undo, scripting,
   the graph, widgets, the assistant and the tests are then all the same code
   path — and a drag that coalesces by key is one undo step, not four hundred.
5. **Analytic where you can, fitted where you cannot, never sampled.** A curve
   handed on as its samples is faceted geometry forever, and everything built
   off it inherits that.

## Where this one came from

Every recipe here was paid for. The fitted-curve rule cost a year of faceted
surfaces because a binding was searched for under its typedef instead of its
template name. The stencil-cap rule cost an afternoon to a `Group`'s
`renderOrder`. The both-sides rule was two bugs, not one — visible, then lit.
The instantiation rule was a sketch arriving empty because the copier only
recognised scalars.

They are written with the failures attached on purpose; see
`evidence-in-prose` for why.
