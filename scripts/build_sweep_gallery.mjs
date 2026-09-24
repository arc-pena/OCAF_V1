// Builds docs/data/samples/sweep_gallery.json.
//
// A grid of sweeps, one cell per behaviour BRepOffsetAPI_MakePipeShell can be
// asked for, each numbered so it can be referred to. Run it with:
//
//     node scripts/build_sweep_gallery.mjs
//
// TWO PASSES, because the spacing is a measurement and not a guess. Every cell
// is built once at the origin to find the largest bounding box any of them
// needs; the file is then written with that pitch baked in, so no cell can
// touch its neighbour however the sweeps come out.
//
// THE RAILS ARE NOT FLAT AND THERE ARE TWO OF THEM, and both of those are
// forced by measurement rather than taste. Frenet and corrected Frenet give the
// same answer on a planar rail - a gallery drawn on one would show two
// identical cells and label them differently. The three transition modes only
// differ where the rail KINKS: on a smooth rail they measured 77.80 cm3 each.
//
// THE NUMBERS ARE TAGS, NOT SOLIDS. No font is bound in this build - no Font_,
// no BRepFont, no StdPrs_ - and the first version of this file worked around
// that by drawing each digit as seven-segment bars, sweeping them into faces
// and extruding them. That reads, but it is fourteen numbers that have volume,
// that a boolean can see, that go into a STEP file and that double the feature
// count of the sample. A Tag carries a point and a string and the viewport
// draws it on the glass, which is what a label is.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "data", "samples", "sweep_gallery.json");
const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";

/* --------------------------------------------------------------- the rails */
const smoothRail = () => {
  const out = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10;
    out.push([70 * Math.sin(t * Math.PI * 1.1), 55 * t * 1.5, 150 * t]);
  }
  return out;
};
const kinkedRail = () => [[0, 0, 0], [0, 0, 70], [55, 0, 70], [55, 0, 150]];
const guideRail = () => smoothRail().map(p => [p[0] + 95, p[1], p[2]]);

/* ----------------------------------------------------- the sections drawn */
const square = h => {
  const e = [];
  const pts = [[-h, -h], [h, -h], [h, h], [-h, h]];
  for (let i = 0; i < 4; i++)
    e.push({ id: "q" + i, type: "line", a: pts[i], b: pts[(i + 1) % 4] });
  return { elements: e };
};
const circle = r => ({ elements: [{ id: "c", type: "circle", c: [0, 0], r }] });

/* ------------------------------------------------------------- the cells */
const CELLS = [
  { n: 1,  title: "Square to the rail", rail: "smooth", note: "the default: corrected Frenet" },
  { n: 2,  title: "Frenet",             rail: "smooth", args: { hold: "Frenet" } },
  { n: 3,  title: "Upright",            rail: "smooth", args: { hold: "Upright" } },
  { n: 4,  title: "Facing the guide",   rail: "smooth", guide: true, args: { hold: "Facing the guide" } },
  { n: 5,  title: "Right corner",       rail: "kinked", args: { corner: "Right corner" } },
  { n: 6,  title: "Round corner",       rail: "kinked", args: { corner: "Round corner" } },
  { n: 7,  title: "Transformed",        rail: "kinked", args: { corner: "Transformed" } },
  { n: 8,  title: "Scaled to 2.5",      rail: "smooth", args: { scale: 2.5 } },
  { n: 9,  title: "Scaled 2.5, eased",  rail: "smooth", args: { scale: 2.5, easing: "Eased" } },
  { n: 10, title: "Scaled to 0.4",      rail: "smooth", args: { scale: 0.4 } },
  { n: 11, title: "Becoming a circle",  rail: "smooth", becoming: true },
  { n: 12, title: "As a surface",       rail: "smooth", args: { cap: "Surface" } },
  { n: 13, title: "A round section",    rail: "smooth", round: true },
  { n: 14, title: "Square up a kink",   rail: "kinked" },
];

/* ------------------------------------------ one cell's features, at an offset */
function cellFeatures(cell, at = [0, 0, 0]) {
  const id = s => "C" + cell.n + "_" + s;
  const rail = cell.rail === "kinked" ? kinkedRail() : smoothRail();
  const move = p => [p[0] + at[0], p[1] + at[1], p[2] + at[2]];
  const out = [];
  rail.forEach((p, i) => out.push({ id: id("P" + i), type: "Point",
    args: { x: move(p)[0], y: move(p)[1], z: move(p)[2] } }));
  out.push({ id: id("RAIL"), type: cell.rail === "kinked" ? "Polyline" : "Interpolate",
    name: "Rail " + cell.n,
    args: cell.rail === "kinked"
      ? { points: rail.map((_, i) => ({ ref: id("P" + i) })), closed: "Open" }
      : { points: rail.map((_, i) => ({ ref: id("P" + i) })), closed: "Open", degree: 3 } });
  if (cell.guide) {
    guideRail().forEach((p, i) => out.push({ id: id("G" + i), type: "Point",
      args: { x: move(p)[0], y: move(p)[1], z: move(p)[2] } }));
    out.push({ id: id("GUIDE"), type: "Interpolate", name: "Guide " + cell.n,
      args: { points: guideRail().map((_, i) => ({ ref: id("G" + i) })), closed: "Open", degree: 3 } });
  }
  //! THE SECTION IS MOUNTED ON A PLANE NORMAL TO THE RAIL, which is what
  //! EvaluateCurve is for: it answers with the point at a parameter AND the
  //! tangent there, so one node is both the plane's origin and its normal.
  out.push({ id: id("EV"), type: "EvaluateCurve", name: "Start of rail " + cell.n,
    args: { curve: { ref: id("RAIL") }, t: 0, tangent: 40 } });
  out.push({ id: id("PL"), type: "Plane", name: "Normal to rail " + cell.n,
    args: { origin: { ref: id("EV") }, normal: { ref: id("EV") }, size: 90 } });
  out.push({ id: id("SEC"), type: "Sketch", name: "Section " + cell.n,
    args: { plane: { ref: id("PL") }, drawing: cell.round ? circle(11) : square(11) } });
  //! A SECTION THAT BECOMES ANOTHER IS DRAWN WHERE IT ENDS UP. OpenCascade
  //! orders the profiles by where they sit, so the second one needs its own
  //! plane at the FAR end of the rail - measured: both on one plane and the
  //! sweep will not build at all.
  if (cell.becoming) {
    out.push({ id: id("EV2"), type: "EvaluateCurve", name: "End of rail " + cell.n,
      args: { curve: { ref: id("RAIL") }, t: 1, tangent: 40 } });
    out.push({ id: id("PL2"), type: "Plane", name: "Normal at the end " + cell.n,
      args: { origin: { ref: id("EV2") }, normal: { ref: id("EV2") }, size: 90 } });
    out.push({ id: id("SEC2"), type: "Sketch", name: "Becoming " + cell.n,
      args: { plane: { ref: id("PL2") }, drawing: circle(18) } });
  }
  out.push({ id: id("SW"), type: "Sweep", name: cell.n + " · " + cell.title,
    args: { profile: { ref: id("SEC") }, spine: { ref: id("RAIL") },
            cap: (cell.args && cell.args.cap) || "Solid",
            ...(cell.becoming ? { into: { ref: id("SEC2") } } : {}),
            ...(cell.guide ? { guide: { ref: id("GUIDE") } } : {}),
            ...Object.fromEntries(Object.entries(cell.args || {}).filter(([k]) => k !== "cap")) } });
  return out;
}

/* ------------------------------------------------------ the number, as a tag */
//! WHERE THE DOT GOES IS DERIVED FROM THE SWEEP, not guessed at. The rails do
//! not start at the middle of what they sweep, so a fixed drop from the cell's
//! origin put half the numbers somewhere other than over the shape they were
//! naming. Centred on the cell's own measured box and lifted clear of the top
//! of it, every one sits over its own sweep from any angle.
function tagFeatures(cell, at, box, clear = 35) {
  const id = s => "T" + cell.n + "_" + s;
  return [
    { id: id("O"), type: "Point",
      args: { x: at[0] + (box.low[0] + box.high[0]) / 2,
              y: at[1] + (box.low[1] + box.high[1]) / 2,
              z: at[2] + box.high[2] + clear } },
    { id: id("TAG"), type: "Tag", name: "Tag " + cell.n,
      args: { at: { ref: id("O") }, note: String(cell.n), size: "Large" } },
  ];
}

/* ------------------------------------------------------------------ pass 1 */
const initModule = (await import(WASM + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule, wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}), select: () => {}, selected: () => null });
const kit = kernel.toolkit();

console.log("pass 1 — building each cell once, to measure it");
const measured = [];
for (const cell of CELLS) {
  const model = { format: "ocaf-parametric-model", version: 1, name: "one", units: "mm",
                  features: cellFeatures(cell) };
  const out = await mdl.run({ op: "model", model });
  const row = out.tree.features.find(f => f.id === "C" + cell.n + "_SW");
  const body = kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
    .find(b => b.id === "C" + cell.n + "_SW");
  const box = body ? kit.extents(body.shape) : null;
  measured.push({ cell, error: row && row.error, box });
  console.log("  " + String(cell.n).padStart(2) + "  " + cell.title.padEnd(22)
    + (row && row.error ? "ERROR " + row.error.slice(0, 50)
       : box ? box.size.map(n => n.toFixed(0)).join(" x ") + " mm" : "no body"));
}
const failed = measured.filter(m => m.error);
if (failed.length) {
  console.log("\n" + failed.length + " cell(s) will not build - the gallery is not written");
  process.exit(1);
}
//! THE PITCH IS THE WIDEST CELL, not an average and not a guess: one cell that
//! does not fit is a gallery where two sweeps touch and nobody can tell which
//! number belongs to which.
const widest = Math.max(...measured.map(m => m.box.size[0]));
const deepest = Math.max(...measured.map(m => m.box.size[1]));
const GAP = 60;
const pitchX = Math.ceil((widest + GAP) / 10) * 10;
const pitchY = Math.ceil((deepest + GAP) / 10) * 10;
console.log("\nwidest " + widest.toFixed(0) + " mm, deepest " + deepest.toFixed(0)
  + " mm  ->  pitch " + pitchX + " x " + pitchY + " mm");

/* ------------------------------------------------------------------ pass 2 */
const ACROSS = 5;
const features = [];
measured.forEach((m, i) => {
  const col = i % ACROSS, row = Math.floor(i / ACROSS);
  const at = [col * pitchX, row * pitchY, 0];
  features.push(...cellFeatures(m.cell, at));
  features.push(...tagFeatures(m.cell, at, m.box));
});
const model = {
  format: "ocaf-parametric-model", version: 1,
  name: "Sweep gallery", units: "mm", features,
};

/* --------------------------------------------- pass 3: do any of them touch?

   THE POINT OF MEASURING THE PITCH IS THAT NOTHING TOUCHES, so that is checked
   rather than assumed. Every cell is built again in its final place and every
   pair of bounding boxes is tested for overlap - a grid where two sweeps run
   into one another is a grid where nobody can tell which number belongs to
   which shape, which is the whole of what this file is for.                 */
const placed = await mdl.run({ op: "model", model });
const bad = placed.tree.features.filter(f => f.error);
if (bad.length) {
  console.log("\n" + bad.length + " feature(s) fail in place:");
  for (const f of bad.slice(0, 6)) console.log("   " + f.id + " " + f.error.slice(0, 70));
  process.exit(1);
}
const built = kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false });
const boxes = [];
for (const m of measured) {
  const body = built.find(b => b.id === "C" + m.cell.n + "_SW");
  if (body) boxes.push({ n: m.cell.n, box: kit.extents(body.shape) });
}
let touching = 0, closest = Infinity;
for (let i = 0; i < boxes.length; i++)
  for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i].box, b = boxes[j].box;
    //! The gap along the axis they are furthest apart on. Two boxes miss each
    //! other if they miss on ANY one axis, so the largest of the three is the
    //! clearance between them.
    const gaps = [0, 1, 2].map(k => Math.max(a.low[k] - b.high[k], b.low[k] - a.high[k]));
    const clear = Math.max(...gaps);
    if (clear < 0) { touching++; console.log("  TOUCHING: " + boxes[i].n + " and " + boxes[j].n); }
    else closest = Math.min(closest, clear);
  }
console.log("pairs checked " + (boxes.length * (boxes.length - 1) / 2)
  + " · touching " + touching + " · closest approach " + closest.toFixed(1) + " mm");
if (touching) { console.log("the gallery is not written"); process.exit(1); }
writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("wrote " + OUT + "  (" + features.length + " features, "
  + CELLS.length + " cells, " + ACROSS + " across)");
