# DiagramLab UX system: first pass

An interactive prototype of the six screens the DiagramLab Software Brief (§13) asks to approve before
the UI is built: Board, Matrix, Editor, Style Profile, Present grid and Present loupe. It also includes a
**UX system** page with the principles, tokens, components and patterns every screen is built from.

Open `dist/diagramlab-ux.html` in a browser. It is one self-contained file.

## What is in it

| Screen | What it shows |
| --- | --- |
| Matrix | 17 templates × 4 options as live thumbnails. Status per cell, filters, overrides, a cell inspector, and batch runs that show cost and time first and then stream progress. |
| Board | Registered option inputs, the Circulation recipe as a node graph (Show wires), live diagram frames and the reference set. Pan, zoom, minimap, draggable nodes. Changing a node parameter marks downstream nodes stale. |
| Editor | A layer tree read from the diagram's stable keys, provenance badges, draggable Bézier anchors on the route, an inspector with unit-aware fields, and a prompt that adds a layer behind a diff preview. |
| Style Profile | Token sheet, rulebook with severity and auto-fix per rule, agent mode, corrections ledger. |
| Present | Grid (G), Loupe (E), Slideshow (S) with presenter view, and A1 Sheets you fill by dragging from the filmstrip. |
| UX system | Principles, shell anatomy, colour, type, spacing, live components, patterns, keyboard map, open questions. |

All four views read and write one shared state, so a route dragged in the Editor is already updated in its
Matrix cell and on the Board.

## The diagrams are real drawings, in real units

`src/diagrams.js` draws all 68 diagrams procedurally from 4 sample options and 17 template archetypes
modelled on the brief's 7 reference sheets (§2a). Each sheet is A3 in millimetres, the site is drawn at
1:1000, and strokes and type are in points (1 pt = 0.3528 mm). Every overlay is a `<g data-k="…">` with a
stable key such as `circulation/external-route`.

The project ("Riverside Cultural Quarter") and its options are sample data made for this prototype.

## Build

```
python3 build.py      # writes dist/diagramlab-ux.html from src/
```

`src/index.html` has no `<!doctype>` or `<body>` because the artifact host wraps the page in its own
skeleton. Opened straight from disk it renders in quirks mode, which this layout does not depend on.

## Not decided yet

The open questions in brief §17 each have a default here (listed on the UX system page): stand-in
typefaces, A1 sheets, a $180 run budget, single-user editing with comments.
