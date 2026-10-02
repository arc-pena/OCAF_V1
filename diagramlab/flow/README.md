# RMUH Diagram Flow (DiagramLab v2 prototype)

A workflow tool for the RMUH competition diagrams, built around five numbered steps. Every diagram is
one visible pipeline: Read → background steps → overlay layers → Sheet → Write.

1. **Options**: Flux, Nexus, Tecton, Orbit. Each holds views (GF plan, render, axo, depth plan) and moods. Rename, add,
   **Replace image**, and place named anchors (hypermarket, department store, ULO, PUA, Pulse, parking…) on the plan.
2. **Diagram**: the 17 rows of `D1_RMUH_Diagrams.xlsx`. "Draft first iteration of all 17 from the Excel" asks Claude
   to propose each pipeline from its row (what to show, succeeds when, the criteria it proves). The built-in recipes
   are used when Claude is not reachable.
3. **Background**: pick the view by name (every option uses its own), then add steps: wash out, black and white,
   ghost, figure-ground, night, warm, contrast, or a prompt. Camera and free restyles are recorded as image-model
   steps; the prototype cannot call an image model, and says so on screen.
4. **Overlays**: anchor-driven layers (parti, edges, retail loop, frontage, districts, journeys, ULO, arrival,
   parking, servicing, office, hotels, climate, clock, phasing, GLA chart, aspirations, text, arrow, legend).
   Click and drag on the sheet, drag anchors, or prompt one change at a time. Every change is one undo step.
5. **Export**: a layered A3 PDF (one PDF layer per overlay, live text, background at 300 ppi) or SVG with named
   layer groups. One diagram, one diagram for all options, or a whole option set. Exports mark the tracker Drawn.

The right panel shows, for the current diagram and option, the Excel row, the measured checks (node spacing,
parking reach, active frontage, PUA route past the deck, GLA against 200,000 m²…), Claude's reasoning, the Handbook
§5 criteria it is scored under, and criteria coverage by domain.

## Sources

- `D1_RMUH_Diagrams.xlsx`: embedded as `src/xl-data.js`; re-import an updated copy from the right panel.
- RMUH Option Plan Audit (30 Sep): option images in `img-src/img/`, measured figures in `src/data.js`.
- RMUH Meeting 3 Feedback Review (30 Sep): client steer and brief figures in `src/data.js`.
- `out/RMUH_v1_preview.png` from this repo, as a mood image under Flux.

The competition brief itself is not in this repository. Paste or upload its text in the right panel and Claude
reads it with every request.

## Build

```
python3 build.py     # dist/rmuh-diagram-flow.html + dist/img/
```

Serve `dist/` over http (the page fetches its images). It reuses the drawing helpers in `../ux/src/diagrams.js`.

## Known limits

- Anchor positions were read off the audit's annotated plans; GCS, Boulevard, Desert Terrace and some hotels are
  estimates (shown amber) to confirm in step 1. The plans still carry the audit's own annotations; replace them
  with clean CAD exports.
- Chinese text would use the non-embedded Adobe font STSong-Light; Latin text uses standard Helvetica. Embedding
  the office typefaces belongs to the real export worker.
- Uploaded images and edits are kept in this browser only (localStorage), not shared.
