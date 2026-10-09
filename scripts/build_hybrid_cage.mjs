// Builds docs/data/samples/hybrid_cage.json — the curves-to-cage-to-NURBS
// chain, as a model somebody can open and push about.
//
//     node scripts/build_hybrid_cage.mjs
//
// WHAT IT IS FOR. The claim this sample exists to make is a specific one, and
// it is narrower than it first looks: a WALL built from curves is REGULAR -
// every vertex has four faces on it - so converting it to NURBS is not an
// approximation at all. The check at the bottom of this script proves exactly
// that and nothing more: the same sweep left uncapped comes back "the cage is
// regular throughout, so this IS the limit surface", in the program's words
// rather than this comment's.
//
// Capped, both bodies are solids and neither is regular, because they cannot
// be: a closed surface's extraordinary vertices sum to 8 by Euler whatever is
// done to it, and an n-gon cap spends them all at once. The notes in the
// document say where they are and how far out of tangent the patches meet
// there - 26.3 degrees on the swept cap, 12.1 on the lofted one. Every one of
// them is a cap's. That is the honest version of the claim and it is the one
// the sample makes.
//
// Two chains, because the two generators answer different questions:
//
//   SWEPT - a section and a path. Twisted a quarter turn and tapered to half,
//   which are the two things a swept B-Rep cannot be asked for after it is
//   made, and the reason to sweep a cage rather than a surface.
//
//   LOFTED - three circles of different sizes up a stack. The sections are the
//   cage's own control rings, so the shape between them is what Catmull-Clark
//   makes of them rather than a ruled surface.
//
// THE CAGES ARE LEFT IN THE TREE AND HIDDEN. Switch one on with its eye and
// the cage and the smooth body are on screen together, which is the clearest
// way to see what the conversion is doing. They are not consumed, because a
// cage you cannot look at is a cage you cannot learn from.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { readFileSync, writeFileSync } from "fs";

const WASM = process.env.OCJS_DIR
  || new URL("../docs/.kernel/package/dist", import.meta.url).pathname;
const OUT = new URL("../docs/data/samples/hybrid_cage.json", import.meta.url).pathname;

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
put("Plane", "PXY", "Ground", { kind: "Origin and normal", origin: ref("O"),
  normal: ref("VZ"), size: 600 }, { parent: "D" });

/* ------------------------------------------------------- one: a swept cage */
set("S", "01 Swept  ·  section + path");
//! The section. A circle, because what is being shown is the CHAIN and a
//! complicated profile would be the thing people looked at instead.
put("Circle", "S_SEC", "Section", { plane: ref("PXY"), radius: 70 }, { parent: "S" });
//! The path, bending in two planes - which is where a Frenet frame would spin
//! and the carried frame does not.
const spine = [[0, 0, 0], [60, 260, 180], [-140, 520, 420], [40, 760, 700], [0, 980, 980]];
spine.forEach((p, i) => put("Point", "S_P" + i, "Path point " + (i + 1),
  { kind: "Coordinates", x: p[0], y: p[1], z: p[2] }, { parent: "S" }));
put("Interpolate", "S_PATH", "Path",
  { points: spine.map((_, i) => ref("S_P" + i)), closed: "Open", degree: 3 }, { parent: "S" });
//! THE CAGE. Both resolutions are arguments and stay that way; so do the twist
//! and the taper.
put("MeshSweep", "S_CAGE", "Cage", { section: ref("S_SEC"), path: ref("S_PATH"),
  around: 12, along: 16, twist: 0.25, taper: 0.5, caps: "Capped" }, { parent: "S" });
put("MeshToNurbs", "S_NURBS", "Swept solid", { mesh: ref("S_CAGE"), levels: 1,
  boundary: "Keep sharp", tolerance: 0.01, solid: "A solid if it closes",
  source: "The cage behind any Subdivide", weld: 0 },
  { parent: "S", appearance: { finish: "brass" } });

/* ------------------------------------------------------ two: a lofted cage */
set("L", "02 Lofted  ·  through three sections");
const rings = [{ at: 0, r: 210 }, { at: 420, r: 95 }, { at: 820, r: 175 }];
//! STOOD ASIDE. Both chains start from the ground plane, and at the origin the
//! r=210 bottom ring swallows the swept tube whole - two solids sharing the
//! same space, which is a sample that teaches the wrong thing on sight. An
//! offset plane takes its place from the plane it offsets FROM and ignores the
//! origin wired into it, so moving the loft means giving it its own ground.
//! In the datums set with the others, so the one hidden set covers them.
put("Point", "L_O", "Loft origin", { kind: "Coordinates", x: 700, y: 0, z: 0 },
  { parent: "D" });
put("Plane", "L_BASE", "Loft ground", { kind: "Origin and normal", origin: ref("L_O"),
  normal: ref("VZ"), size: 500 }, { parent: "D" });
rings.forEach((one, i) => {
  put("Plane", "L_PL" + i, "Section plane " + (i + 1), { kind: "Offset from a plane",
    origin: ref("L_O"), from: ref("L_BASE"), offset: one.at, size: 400 }, { parent: "L" });
  put("Circle", "L_C" + i, "Section " + (i + 1),
    { plane: ref("L_PL" + i), radius: one.r }, { parent: "L" });
});
put("MeshLoft", "L_CAGE", "Cage", { sections: rings.map((_, i) => ref("L_C" + i)),
  around: 12, along: 2, loop: "Open", caps: "Capped" }, { parent: "L" });
put("MeshToNurbs", "L_NURBS", "Lofted solid", { mesh: ref("L_CAGE"), levels: 1,
  boundary: "Keep sharp", tolerance: 0.01, solid: "A solid if it closes",
  source: "The cage behind any Subdivide", weld: 0 },
  { parent: "L", appearance: { finish: "aluminium" } });

const model = { format: "ocaf-parametric-model", version: 1, name: "Hybrid cage",
                units: "mm", features: F,
                //! The cages, and the curves the sweep consumed, are off by
                //! default - the sample should open as two solids.
                //! The section planes go with them: three translucent squares
                //! through the middle of a body read as part of the body.
                hidden: ["S_CAGE", "L_CAGE", "D", ...rings.map((_, i) => "L_PL" + i)] };

/* ------------------------------------------------- built before it is written */
const initModule = (await import(WASM + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule,
  wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null });
await mdl.run({ op: "model", model });
const tree = (await kernel.tree()).tree;

let bad = 0;
for (const f of tree.features) {
  if (f.error) { console.log("  FAILED  " + f.name + " — " + f.error); bad++; }
}
for (const id of ["S_NURBS", "L_NURBS"]) {
  const got = tree.features.find(f => f.id === id);
  console.log("  " + got.name + ": " + got.note);
}

//! THE CLAIM, CHECKED, AND IT IS NARROWER THAN IT FIRST LOOKED.
//!
//! "A cage built from curves is regular" is true of the WALL and false of a
//! capped solid: an n-gon cap subdivides into a vertex of valence n with a ring
//! of valence-three vertices round it, and Euler guarantees a closed surface
//! cannot avoid extraordinary vertices anyway - the index sum is 8 whatever you
//! do. So what is checked is the true statement: the same sweep, UNCAPPED, is
//! exact, which says the extraordinary vertices in the capped solid are the
//! caps' and nothing else's.
//!
//! This check is why the first version of this sample was not written. It
//! asserted "regular throughout" on a capped body and the program said
//! otherwise, which was the program being right.
const open = await mdl.run({ op: "add", type: "MeshSweep", name: "Wall only" });
await mdl.run({ op: "connect", id: open.id, key: "section", from: "S_SEC" });
await mdl.run({ op: "connect", id: open.id, key: "path", from: "S_PATH" });
for (const [k, v] of [["around", 12], ["along", 16], ["twist", 0.25], ["taper", 0.5]])
  await mdl.run({ op: "set", id: open.id, key: k, value: v });
const bare = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Wall as NURBS" });
await mdl.run({ op: "connect", id: bare.id, key: "mesh", from: open.id });
const wall = (await kernel.tree()).tree.features.find(f => f.id === bare.id);
console.log("\n  uncapped, the same sweep: " + wall.note);
if (!/regular throughout/.test(wall.note || "")) {
  console.log("    ^ the WALL is not exact either - the sample is not written");
  bad++;
}
await mdl.run({ op: "delete", id: bare.id });
await mdl.run({ op: "delete", id: open.id });
if (bad) process.exit(1);

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("wrote " + OUT);
