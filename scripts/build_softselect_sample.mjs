// Builds docs/data/samples/soft_selection.json — soft selection and cage
// editing, as four chains somebody can open and push about.
//
//     node scripts/build_softselect_sample.mjs
//
// WHAT IT IS FOR. "A soft selection made of geometry" is a sentence; what it
// means is that the thing you push the mesh with is a NODE, so it can be
// moved, driven by a formula, or evaluated along a curve. Every set here is
// one way of making that obvious in about five seconds:
//
//   01  A POINT AND A FALLOFF. One attractor over a grid and a Move up. Drag
//       the point's Y and the bulge follows it; change the zone of influence
//       and it spreads. Nothing was selected by hand, so nothing has to be
//       re-selected.
//
//   02  THREE ATTRACTORS ON A CURVE. Three points evaluated at thirds along
//       one spline, all three fed to one selection: three bulges. Change the
//       spline and all three move together - which is the thing no mesh
//       modeller can do, because its selection is a list of vertex numbers.
//
//   03  A PLANE SELECTS A SLAB. A plane measures along its NORMAL, so what it
//       catches is a band right through the model however wide it is, and the
//       Twist on it is a local twist in the middle of a block.
//
//   04  A CAGE EDIT THAT IS ITSELF A MODEL. A lattice round a column, bent -
//       and the lattice is an ordinary mesh, so what bends it is the ordinary
//       Bend. Everything that moves a mesh can drive this deformation.
//
// WHAT THE CHECK AT THE BOTTOM IS FOR. Three of this system's failures leave
// a model that builds, draws, and is the shape it started as: a selection
// that caught nothing, a deformer whose selection is empty, and a morph with
// the same cage in both inputs. A sample shipped in any of those states would
// look exactly like this one. So the script reads the notes back and refuses
// to write the file unless every chain actually did something.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { readFileSync, writeFileSync } from "fs";

const WASM = process.env.OCJS_DIR
  || new URL("../docs/.kernel/package/dist", import.meta.url).pathname;
const OUT = new URL("../docs/data/samples/soft_selection.json", import.meta.url).pathname;

const F = [];
const put = (type, id, name, args = {}, extra = {}) => {
  F.push({ id, type, name, args, ...extra });
  return id;
};
const set = (id, name) => put("GeometricalSet", id, name, { inputs: "", shell: "Open" });
const ref = id => ({ ref: id });

/* ------------------------------------------------------------- the datums */
set("D", "00 Datums");
put("Point", "O", "Origin", { kind: "Coordinates", x: 0, y: 0, z: 0 }, { parent: "D" });
put("Vector", "VZ", "Up", { kind: "Components", dx: 0, dy: 0, dz: 1 }, { parent: "D" });
put("Vector", "VX", "Across", { kind: "Components", dx: 1, dy: 0, dz: 0 }, { parent: "D" });
put("Plane", "PXY", "Ground", { kind: "Origin and normal", origin: ref("O"),
  normal: ref("VZ"), size: 900 }, { parent: "D" });

/* ------------------------------------------------- one: a point and a falloff */
set("A", "01 A point  ·  and a falloff");
put("Point", "A_AT", "Attractor", { kind: "Coordinates", x: 0, y: 0, z: 0 },
  { parent: "A" });
put("MeshGrid", "A_GRID", "Sheet", { plane: ref("PXY"), width: 800, depth: 800,
  cols: 24, rows: 24 }, { parent: "A" });
put("SoftSelect", "A_SEL", "Soft selection",
  { mesh: ref("A_GRID"), attractors: [ref("A_AT")], radius: 260,
    falloff: "Smooth", blend: "Largest" }, { parent: "A" });
//! The deformation. Up, by a vector, so the direction is a node too.
put("CageDeform", "A_PULL", "Pull it up",
  { mesh: ref("A_SEL"), kind: "Move", by: ref("VZ"), distance: 240 }, { parent: "A" });

/* ------------------------------------------- two: three attractors on a curve */
set("B", "02 Three attractors  ·  evaluated along a curve");
const spine = [[-320, 1100, 0], [-60, 1300, 180], [180, 1050, 0], [380, 1280, 150]];
spine.forEach((p, i) => put("Point", "B_P" + i, "Spline point " + (i + 1),
  { kind: "Coordinates", x: p[0], y: p[1], z: p[2] }, { parent: "B" }));
put("Interpolate", "B_PATH", "Spline",
  { points: spine.map((_, i) => ref("B_P" + i)), closed: "Open", degree: 3 },
  { parent: "B" });
//! THE POINT OF THE WHOLE SET: the attractors are not typed in, they are
//! EVALUATED along the spline. Move a spline point and all three bulges move.
[0.15, 0.5, 0.85].forEach((t, i) => put("Point", "B_AT" + i, "At " + t + " along",
  { kind: "On a curve", curve: ref("B_PATH"), at: t }, { parent: "B" }));
//! Its own ground, because a mesh grid is placed by the PLANE it is built on
//! and Transform does not take a mesh - the sheets are stood apart that way
//! rather than moved there.
put("Point", "B_O", "Its middle", { kind: "Coordinates", x: 0, y: 1180, z: 0 },
  { parent: "B" });
put("Plane", "B_PL", "Its ground", { kind: "Origin and normal", origin: ref("B_O"),
  normal: ref("VZ"), size: 600 }, { parent: "B" });
put("MeshGrid", "B_GRID", "Sheet", { plane: ref("B_PL"), width: 1000, depth: 500,
  cols: 30, rows: 16 }, { parent: "B" });
put("SoftSelect", "B_SEL", "Three selections at once",
  { mesh: ref("B_GRID"), attractors: [ref("B_AT0"), ref("B_AT1"), ref("B_AT2")],
    radius: 200, falloff: "Smooth", blend: "Largest" }, { parent: "B" });
put("CageDeform", "B_PULL", "Pull them up",
  { mesh: ref("B_SEL"), kind: "Move", by: ref("VZ"), distance: 200 }, { parent: "B" });
//! And through to a surface, because a deformed cage is still a cage: this is
//! the same route the Hybrid sample takes, with the shape made by attractors
//! rather than by a sweep.
put("MeshToNurbs", "B_NURBS", "As NURBS",
  { mesh: ref("B_PULL"), levels: 1, boundary: "Keep sharp", tolerance: 0.01,
    solid: "A solid if it closes", source: "The mesh exactly as it arrives", weld: 0 },
  { parent: "B", appearance: { finish: "aluminium" } });

/* ------------------------------------------------- three: a plane selects a slab */
set("C", "03 A plane  ·  selects a slab right through");
put("Point", "C_O", "Its corner", { kind: "Coordinates", x: 1400, y: -150, z: 0 },
  { parent: "C" });
put("Point", "C_AT", "Half way up", { kind: "Coordinates", x: 1550, y: 0, z: 300 },
  { parent: "C" });
put("Plane", "C_PL", "The slab's plane", { kind: "Origin and normal",
  origin: ref("C_AT"), normal: ref("VZ"), size: 500 }, { parent: "C" });
put("MeshBox", "C_BOX", "Block", { origin: ref("C_O"), dx: 300, dy: 300, dz: 600,
  segX: 6, segY: 6, segZ: 20 }, { parent: "C" });
//! A plane's zone of influence is a SLAB: the distance is measured along the
//! normal, so every vertex within 150 mm of this height is caught however far
//! out it is. That is what a point attractor cannot do.
put("SoftSelect", "C_SEL", "The middle band",
  { mesh: ref("C_BOX"), attractors: [ref("C_PL")], radius: 150,
    falloff: "Smooth", blend: "Largest", side: "Both sides" }, { parent: "C" });
put("CageDeform", "C_TWIST", "Twist the band",
  { mesh: ref("C_SEL"), kind: "Twist", axis: ref("VZ"), angle: 150, at: ref("C_AT") },
  { parent: "C" });

/* ------------------------------------------------------- four: the cage edit */
set("E", "04 A cage edit  ·  driven like anything else");
put("Point", "E_AT", "Its corner", { kind: "Coordinates", x: 2200, y: -90, z: 0 },
  { parent: "E" });
put("MeshBox", "E_COL", "Column", { origin: ref("E_AT"), dx: 180, dy: 180, dz: 900,
  segX: 4, segY: 4, segZ: 18 }, { parent: "E" });
//! The lattice is an ORDINARY MESH, which is the whole idea: what bends it
//! below is the same Bend that bends anything else.
put("CageLattice", "E_CAGE", "Lattice", { mesh: ref("E_COL"), nx: 1, ny: 1, nz: 3,
  padding: 0 }, { parent: "E" });
put("CageDeform", "E_BENT", "Bend the lattice",
  { mesh: ref("E_CAGE"), kind: "Bend", axis: ref("VZ"), angle: 70 }, { parent: "E" });
put("CageMorph", "E_MORPH", "The column follows",
  { mesh: ref("E_COL"), rest: ref("E_CAGE"), moved: ref("E_BENT") },
  { parent: "E", appearance: { finish: "brass" } });

const model = { format: "ocaf-parametric-model", version: 1, name: "Soft selection",
                units: "mm", features: F,
                //! The cages and the selections are left in the tree and
                //! switched off: turn one on with its eye and the heat map is
                //! there, red where the attractor is and blue where it is not.
                hidden: ["D", "A_GRID", "A_SEL", "B_GRID", "B_SEL", "B_PULL",
                         "C_BOX", "C_SEL", "E_COL", "E_CAGE", "E_BENT"] };

/* ------------------------------------------------- built before it is written */
const initModule = (await import(WASM + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule,
  wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null });
await mdl.run({ op: "model", model });
const tree = (await kernel.tree()).tree;

let bad = 0;
const say = line => console.log("  " + line);
for (const f of tree.features)
  if (f.error) { say("FAILED  " + f.name + " — " + f.error); bad++; }

const noteOf = id => (tree.features.find(f => f.id === id) || {}).note || "";

//! EVERY SELECTION HAS TO HAVE CAUGHT SOMETHING, AND NOT EVERYTHING. A sample
//! whose selection caught nothing is a flat grid; one whose selection caught
//! all of it is a grid translated 240 mm up. Both build, both draw, and
//! neither shows what this is for.
for (const [id, what] of [["A_SEL", "the point"], ["B_SEL", "three on a curve"],
                          ["C_SEL", "the plane"]]) {
  const note = noteOf(id);
  const got = note.match(/^(\d+) of (\d+) vertices/);
  say(what + ": " + note);
  if (!got) { say("  ^ caught nothing at all - not written"); bad++; continue; }
  if (Number(got[1]) === Number(got[2])) {
    say("  ^ caught the WHOLE mesh, so this is a transform and not a selection");
    bad++;
  }
}

for (const [id, what] of [["A_PULL", "the pull"], ["B_PULL", "the three pulls"],
                          ["C_TWIST", "the twist"], ["E_BENT", "the lattice's bend"]]) {
  const note = noteOf(id);
  say(what + ": " + note);
  if (/NOTHING MOVED/.test(note)) { say("  ^ nothing moved - not written"); bad++; }
}

const morph = noteOf("E_MORPH");
say("the morph: " + morph);
if (/THE CAGE HAS NOT MOVED/.test(morph) || /left where they were/.test(morph)) {
  say("  ^ the cage edit did nothing, or the cage is not closed - not written");
  bad++;
}
say("as NURBS: " + noteOf("B_NURBS"));

if (bad) process.exit(1);
writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("wrote " + OUT);
