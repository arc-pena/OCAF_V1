// Builds docs/data/samples/hyperstack_rack.json — a data-centre rack at LOD 400.
//
//     node scripts/build_rack_demo.mjs
//
// WHAT THIS IS FOR. Somebody who builds hyperscale racks looks at a parametric
// modeller and asks one question: can it hold a real rack, to the level of
// detail we actually build from, without turning into a pile of dumb boxes the
// first time a dimension changes. This is the answer, and the answer has to be
// a model rather than a claim - so every number in it comes from a parameter,
// every section comes from a named profile that can be switched, every hole is
// where EIA-310-E puts it, and every fastener is a fastener.
//
// THE SHAPE OF IT:
//
//   00 Parameters   thirteen numbers. Height in U, depth, how many compute
//                   nodes, how tall each one is, the bay pitch, the fastener
//                   pitch. Everything downstream is an Expression over these.
//   01 Frame        the frame, the four drilled posts, the plinth.
//   02 Bracing      strut cross-members on the frame's own section, drilled
//                   on a pitch - and PATTERNED, so the count follows the height.
//   03 Compute      the AMD compute nodes, patterned from one parameter: four
//                   of them or eight of them is one number, and the switches,
//                   the PDU and the blanking follow it up the rack.
//   04 Fastening    cage nuts and bolts at the mounting points, patterned up
//                   the post - the thing nobody models, which is exactly what
//                   LOD 400 means.
//   05 Cable        the tray at the top and the vertical manager down the side.
//   06 Bill         the bill of materials, read off the model.
//
// AND WHAT IT DOES NOT CLAIM. Nothing here is anybody's part file. The
// fasteners are modelled to the standard each conforms to - ISO 4017, ISO 4032,
// ISO 7089 - and every one of them has a "Bought part" input: wire the
// supplier's own STEP in and the modelled stand-in is replaced by it, and the
// supplier reference travels into the bill. That is the honest LOD 400 path,
// and it is demonstrated rather than described: BOLT_REAL in 04 shows the
// wiring with a stand-in, labelled as one.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { PluginHost } from "../docs/src/plugin.js";
import { RACK } from "../docs/src/rack-plugin.js";
import { holeCentres, rackHeight } from "../docs/src/rack.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "data", "samples", "hyperstack_rack.json");
const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";

/* ===================================================== the numbers it is of */

const UNITS = 48;              // a hyperscale row runs 48U more often than 42
const DEPTH = 1200;
const NODES = 8;               // compute nodes - the parameter the demo drags
const NODE_U = 2;              // each one 2U
const FIRST_U = 3;             // the first compute node sits at U3
const BOLT_PITCH = 4;          // a fixing every 4U up the post
const U = 44.45;

const features = [];
//! A MODEL FILE SAYS A REFERENCE INSIDE args, as { ref: "ID" } - the `refs`
//! shorthand is the ADD OP's, and a file that uses it is a file whose wires
//! are silently ignored. Every one of them came back as "origin point is
//! missing" on a node that had been given an origin, which is the confusing
//! way round. So the shorthand is written here and converted.
const add = (id, type, more = {}) => {
  const { refs, wire, args, ...rest } = more;
  const made = { ...(args || {}) };
  //! A REFERENCE argument is { ref: "ID" }; a NUMBER driven by another number
  //! is { value: <the number it would be>, from: "ID" }. Two different shapes
  //! for two different things, and the `refs` shorthand on the add OP is
  //! neither - a file that uses it has its wires silently dropped and comes
  //! back as "origin point is missing" on a node that was given an origin.
  for (const [key, from] of Object.entries(refs || {})) made[key] = { ref: from };
  for (const [key, [from, value]] of Object.entries(wire || {}))
    made[key] = { value, from };
  features.push({ id, type, ...rest, ...(Object.keys(made).length ? { args: made } : {}) });
  return id;
};
//! Every set is numbered so the tree reads in the order somebody builds in,
//! and they all sit inside one - so a bill can be of THE RACK rather than of
//! one part of it.
const set = (id, name, parent = "R") =>
  add(id, "GeometricalSet", { name, ...(parent ? { parent } : {}) });
//! A Number is one slider, and the unit belongs to the name rather than to the
//! node: the catalogue's Number is deliberately a bare number so it can be
//! wired into anything, and a rack's height in U and its depth in mm are both
//! just numbers to it.
const num = (id, name, value, parent) =>
  add(id, "Number", { name, parent, args: { value } });
//! An expression node: three named inputs at most, and the formula over them.
//! An expression over up to three wired numbers. Each input carries the value
//! it would have if the wire were pulled, which is what a model file holds.
const expr = (id, name, js, wired, parent) => {
  const args = { formula: js };
  for (const [key, [from, value]] of Object.entries(wired || {}))
    args[key] = { value, from };
  return add(id, "Expression", { name, parent, args });
};

/* ------------------------------------------------------------ 00 Parameters */

add("R", "GeometricalSet", { name: "Hyperstack rack" });
set("P", "00 Parameters");
num("N_UNITS", "Rack height", UNITS, "P");
num("N_DEPTH", "Rack depth", DEPTH, "P");
num("N_NODES", "Compute nodes", NODES, "P");
num("N_NODEU", "Node height", NODE_U, "P");
num("N_FIRST", "First node at", FIRST_U, "P");
num("N_BOLTU", "Fixing every", BOLT_PITCH, "P");
num("N_TRAY", "Tray width", 300, "P");
num("N_PLINTH", "Plinth", 100, "P");

//! THE SUM THAT MAKES IT A RACK RATHER THAN A DRAWING: one unit is 44.45 mm,
//! exactly, and every position up the rack is a whole number of them. Written
//! as an Expression so it is visible in the model rather than hidden in this
//! script - somebody opening the sample can see where 44.45 comes in.
expr("X_U", "One unit (mm)", "44.45", {}, "P");
expr("X_HEIGHT", "Rack height (mm)", "a * 44.45", { a: ["N_UNITS", UNITS] }, "P");
expr("X_NODESPAN", "Compute span (U)", "a * b",
     { a: ["N_NODES", NODES], b: ["N_NODEU", NODE_U] }, "P");

/* ----------------------------------------------------------------- 01 Frame */

set("F", "01 Frame");
add("PT0", "Point", { name: "Origin", parent: "F", args: { x: 0, y: 0, z: 0 } });
add("VZ", "Vector", { name: "Up", parent: "F", args: { dx: 0, dy: 0, dz: 1 } });
add("PL0", "Plane", { name: "Floor", parent: "F", refs: { origin: "PT0", normal: "VZ" } });
//! AND ONE ACROSS. A Strut runs along its plane's NORMAL, so the plane a beam
//! is given is what decides whether it stands up or lies across - and a rack
//! needs both. This is the across one: normal +X, so a strut on it spans from
//! the left-hand post to the right-hand one.
add("VX", "Vector", { name: "Across", parent: "F", args: { dx: 1, dy: 0, dz: 0 } });
add("PLX", "Plane", { name: "Across the rack", parent: "F", refs: { origin: "PT0", normal: "VX" } });
//! AND TWO MORE, FORE AND AFT. A fastener is built along its plane's normal
//! too - head at the origin, shank behind it - so which way a bolt faces is
//! which plane it is given. Into the rack for a cage nut, which goes in from
//! behind the flange; out of it for the bolt, whose head stands proud in front.
add("VY", "Vector", { name: "Into the rack", parent: "F", args: { dx: 0, dy: 1, dz: 0 } });
add("PLY", "Plane", { name: "Into the rack", parent: "F", refs: { origin: "PT0", normal: "VY" } });
add("VYB", "Vector", { name: "Out the front", parent: "F", args: { dx: 0, dy: -1, dz: 0 } });
add("PLYB", "Plane", { name: "Out the front", parent: "F", refs: { origin: "PT0", normal: "VYB" } });

//! The frame. Its height in U and its depth are WIRED, so the two numbers in
//! 00 Parameters are the two numbers that define the rack.
add("FRAME", "RackFrame", { name: "Frame · 48U", parent: "F",
  refs: { plane: "PL0" }, wire: { units: ["N_UNITS", UNITS], depth: ["N_DEPTH", DEPTH] },
  args: { standard: 0, profile: 2, rails: 3, posts: 0, postWidth: 50,
          supplier: "frame, welded" } });

//! The four mounting posts, drilled to EIA-310-E. Front pair and back pair,
//! placed at the standard's own 465.1 between hole columns - which is a number
//! the post node knows, so it is not typed here either.
//! The posts, at the standard's own 465.1 between hole columns. A post's hole
//! column sits half its flange width in from its corner, so a post placed at
//! x puts its column at x + 25 - which is why these two are 465.1 apart and
//! the panel that lands on them is 8.75 outboard of each column.
const COLUMN = 465.1, FLANGE = 50, PANEL_IN = (482.6 - COLUMN) / 2;
const POST_X = [40, 40 + COLUMN];
const PANEL_X = POST_X[0] + FLANGE / 2 - PANEL_IN;
const POST_AT = [[POST_X[0], 60], [POST_X[1], 60],
                 [POST_X[0], DEPTH - 60], [POST_X[1], DEPTH - 60]];
//! The clear span between the post flanges, and half a brace pitch - the two
//! numbers 02 Bracing is built on, written here where the post geometry is.
const BRACE_SPAN = COLUMN - FLANGE;
const BRACE_Z0 = UNITS * U / (2 * Math.max(2, Math.round(UNITS / 12)));
["PF1", "PF2", "PB1", "PB2"].forEach((id, i) => {
  add("PTP" + i, "Point", { name: "Post " + (i + 1) + " at", parent: "F",
    args: { x: POST_AT[i][0], y: POST_AT[i][1], z: 0 } });
  add(id, "RackPost", { name: "Post " + (i + 1) + " · EIA-310-E", parent: "F",
    refs: { plane: "PL0", at: "PTP" + i }, wire: { units: ["N_UNITS", UNITS] },
    args: { standard: 0, holes: 0, width: 50, wall: 2, supplier: "post, 2 mm ZP" } });
});

/* --------------------------------------------------------------- 02 Bracing */

set("B", "02 Bracing");
//! ONE STRUT, PATTERNED UP THE RACK. The count is an Expression over the rack
//! height, so a 48U rack gets more braces than a 24U one WITHOUT anybody
//! editing the pattern - which is the difference between a parametric model
//! and a model with parameters in it.
expr("X_BRACES", "Braces", "Math.max(2, Math.round(a / 12))",
     { a: ["N_UNITS", UNITS] }, "B");
expr("X_BRACEZ", "Brace pitch (mm)", "a * 44.45 / Math.max(2, Math.round(a / 12))",
     { a: ["N_UNITS", UNITS] }, "B");
//! THE FIRST ONE IS HALF A PITCH UP, not a height somebody typed. A fixed
//! 300 mm is fine at 48U and is above the top of a 12U rack - which is the
//! kind of thing a model only tells you about once the number is wired.
expr("X_BRACE0", "First brace at (mm)",
     "a * 44.45 / (2 * Math.max(2, Math.round(a / 12)))",
     { a: ["N_UNITS", UNITS] }, "B");
add("PTB", "Point", { name: "First brace at", parent: "B",
  wire: { z: ["X_BRACE0", BRACE_Z0] },
  args: { x: POST_X[0] + FLANGE, y: DEPTH - 60 + FLANGE / 2 } });
//! ON THE ACROSS PLANE, so it lies between the two rear posts instead of
//! standing up beside one of them - a strut runs along its plane's NORMAL, and
//! that is the whole of the difference. Its length is the clear span between
//! the post flanges: the standard's hole spacing less one flange.
add("BRACE", "Strut", { name: "Brace · 40 T-slot, drilled", parent: "B",
  refs: { plane: "PLX", at: "PTB" },
  args: { profile: 2, length: BRACE_SPAN, holes: 1, bore: 9, pitch: 60, setback: 30,
          supplier: "brace, cut to length" } });
add("BRACES", "Array", { name: "Braces · up the rack", parent: "B",
  refs: { source: "BRACE" },
  wire: { countZ: ["X_BRACES", 4], spacingZ: ["X_BRACEZ", UNITS * U / 4] },
  args: { mode: 0, countX: 1, spacingX: 0, countY: 1, spacingY: 0 } });

/* --------------------------------------------------------------- 03 Compute */

set("C", "03 Compute");
//! THE PARAMETER THE DEMONSTRATION IS ABOUT. One number - Compute nodes - and
//! the rack fills with four of them or eight of them or sixteen, each landing
//! exactly on its own unit boundary because the spacing is an Expression over
//! the unit and the node height rather than a distance somebody measured.
expr("X_NODEMM", "Node pitch (mm)", "a * 44.45", { a: ["N_NODEU", NODE_U] }, "C");
add("PTC", "Point", { name: "First node at", parent: "C",
  args: { x: PANEL_X, y: 60, z: 0 } });
add("NODE", "RackDevice", { name: "AMD compute node · 2U", parent: "C",
  refs: { plane: "PL0", at: "PTC" }, wire: { units: ["N_NODEU", NODE_U] },
  args: { standard: 0, unit: FIRST_U, depth: 900, inset: 20, ears: 0,
          supplier: "2U dual-socket AMD EPYC compute node" } });
add("NODES", "Array", { name: "Compute stack · 8 nodes", parent: "C",
  refs: { source: "NODE" },
  wire: { countZ: ["N_NODES", NODES], spacingZ: ["X_NODEMM", NODE_U * U] },
  args: { mode: 0, countX: 1, spacingX: 0, countY: 1, spacingY: 0 } });

//! The rest of the rack, placed relative to the compute stack so it moves when
//! the stack grows: the leaf switches sit directly above it.
expr("X_TOPU", "First free U", "a + b * c",
     { a: ["N_FIRST", FIRST_U], b: ["N_NODES", NODES], c: ["N_NODEU", NODE_U] }, "C");
add("PTS", "Point", { name: "Switches at", parent: "C",
  args: { x: PANEL_X, y: 60, z: 0 } });
add("SW1", "RackDevice", { name: "Leaf switch · 1U", parent: "C",
  refs: { plane: "PL0", at: "PTS" },
  args: { standard: 0, unit: 40, units: 1, depth: 550, inset: 20, ears: 0,
          supplier: "32 x 400G leaf switch" } });
add("SW2", "RackDevice", { name: "Leaf switch · 1U", parent: "C",
  refs: { plane: "PL0", at: "PTS" },
  args: { standard: 0, unit: 42, units: 1, depth: 550, inset: 20, ears: 0,
          supplier: "32 x 400G leaf switch" } });
add("PDU", "RackDevice", { name: "PDU · 2U", parent: "C",
  refs: { plane: "PL0", at: "PTS" },
  args: { standard: 0, unit: 45, units: 2, depth: 300, inset: 700, ears: 0,
          supplier: "3-phase 32 A rack PDU" } });

/* ------------------------------------------------------------- 04 Fastening */

set("X", "04 Fastening");
//! CAGE NUTS AND BOLTS AT THE FIXINGS, patterned up the post. This is the part
//! nobody models, and it is the part that decides whether a model is LOD 400:
//! the hole is in the post, the cage nut is in the hole, the bolt is in the
//! cage nut, and every one of them is in the bill.
expr("X_BOLTS", "Fixings a column", "Math.floor(a / b)",
     { a: ["N_UNITS", UNITS], b: ["N_BOLTU", BOLT_PITCH] }, "X");
expr("X_BOLTZ", "Fixing pitch (mm)", "a * 44.45", { a: ["N_BOLTU", BOLT_PITCH] }, "X");
//! At the hole column, on the inside face of the front post's flange: the
//! cage nut goes in from behind and the bolt comes through from the front.
add("PTX", "Point", { name: "First fixing at", parent: "X",
  args: { x: POST_X[0] + FLANGE / 2, y: 62, z: 6.35 } });
add("CAGE", "Fastener", { name: "Cage nut M6", parent: "X",
  refs: { plane: "PLY", at: "PTX" },
  args: { part: 10, supplier: "cage nut, M6, 9.5 mm square" } });
add("CAGES", "Array", { name: "Cage nuts · up the post", parent: "X",
  refs: { source: "CAGE" },
  wire: { countZ: ["X_BOLTS", UNITS / BOLT_PITCH], spacingZ: ["X_BOLTZ", BOLT_PITCH * U] },
  args: { mode: 0, countX: 2, spacingX: COLUMN, countY: 1, spacingY: 0 } });
add("PTX2", "Point", { name: "First bolt at", parent: "X",
  args: { x: POST_X[0] + FLANGE / 2, y: 60, z: 6.35 } });
add("BOLT", "Fastener", { name: "Hex bolt M6 × 16", parent: "X",
  refs: { plane: "PLYB", at: "PTX2" },
  args: { part: 0, length: 16, supplier: "ISO 4017 M6 x 16 A2" } });
add("BOLTS", "Array", { name: "Bolts · up the post", parent: "X",
  refs: { source: "BOLT" },
  wire: { countZ: ["X_BOLTS", UNITS / BOLT_PITCH], spacingZ: ["X_BOLTZ", BOLT_PITCH * U] },
  args: { mode: 0, countX: 2, spacingX: COLUMN, countY: 1, spacingY: 0 } });

//! THE BOUGHT-PART PATH, DEMONSTRATED. A Fastener with something wired into
//! "Bought part" uses that instead of the modelled stand-in. What is wired here
//! is a cylinder standing in for a supplier's STEP file, and it is labelled as
//! one: this sample ships nobody's part files. Import the real STEP, wire it
//! here, and the bill carries the reference you put on it.
add("PTX3", "Point", { name: "Bought part at", parent: "X",
  args: { x: 65, y: 46, z: 2100 } });
add("STANDIN", "Cube", { name: "(stand-in for a supplier STEP)", parent: "X",
  refs: { origin: "PTX3", plane: "PL0" }, args: { dx: 10, dy: 14, dz: 10 } });
add("BOLT_REAL", "Fastener", { name: "M8 · the bought part", parent: "X",
  refs: { plane: "PLYB", at: "PTX3", bought: "STANDIN" },
  args: { part: 2, supplier: "your supplier's part number goes here" } });

/* ----------------------------------------------------------------- 05 Cable */

set("K", "05 Cable management");
//! ON TOP OF THE FRAME, not floating above it: the tray is 20.6 deep about its
//! own centreline, so its underside lands on the frame when the point is half
//! that up from the top. WIRED to the height, so it rises with the rack.
expr("X_TRAYZ", "Tray at (mm)", "a * 44.45 + 10.3", { a: ["N_UNITS", UNITS] }, "K");
add("PTK", "Point", { name: "Tray at", parent: "K",
  wire: { z: ["X_TRAYZ", UNITS * U + 10.3] },
  args: { x: 20, y: 380 } });
add("TRAY", "CableTray", { name: "Overhead tray · 300 wide", parent: "K",
  refs: { plane: "PL0", at: "PTK" }, wire: { width: ["N_TRAY", 300] },
  args: { length: 560, profile: 6, pitch: 140, rung: 20,
          supplier: "ladder tray, 300 mm" } });
add("PTK2", "Point", { name: "Manager at", parent: "K",
  args: { x: 555, y: DEPTH - 110, z: 100 } });
//! The vertical cable manager is a strut on the same section family, drilled
//! for tie points on a 100 pitch - so it is the same kit of parts.
add("MGR", "Strut", { name: "Vertical manager · 41 channel", parent: "K",
  refs: { plane: "PL0", at: "PTK2" },
  args: { profile: 6, length: 1900, holes: 2, bore2: 12, pitch2: 100, setback2: 50,
          supplier: "cable manager, 41 x 21 channel" } });

/* ------------------------------------------------------------------ 06 Bill */

set("Z", "06 Bill of materials");
add("BOM", "Bill", { name: "Bill of materials · the whole rack", parent: "Z",
  refs: { of: "R" }, args: { show: 0 } });
add("BOM_FIX", "Bill", { name: "Fasteners to order", parent: "Z",
  refs: { of: "R" }, args: { show: 1 } });

const model = { format: "ocaf-parametric-model", version: 1,
                name: "Hyperstack rack", units: "mm", features };

/* =================================================== built, then questioned */

const initModule = (await import(WASM + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule,
                                        wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const host = new PluginHost({
  toolkit: () => kernel.toolkit(),
  installDrivers: (specs, builders) => kernel.installDrivers(specs, builders),
  removeDrivers: specs => kernel.removeDrivers(specs),
  typesInUse: types => kernel.typesInUse(types),
});
await host.load("rack");
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
const kit = kernel.toolkit();

const out = await mdl.run({ op: "model", model });
const rows = out.tree.features;
const bad = rows.filter(f => f.error);
console.log(features.length + " features · "
  + rows.filter(f => f.type === "GeometricalSet").length + " sets");
if (bad.length) {
  console.log("\n" + bad.length + " feature(s) in error:");
  for (const f of bad.slice(0, 15))
    console.log("   " + f.id + " (" + f.type + ") " + String(f.error).slice(0, 100));
  process.exit(1);
}

const bodyOf = id => kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
  .find(b => b.id === id);
const boxOf = id => { const b = bodyOf(id); return b ? kit.extents(b.shape) : null; };

//! IT IS THE HEIGHT THE STANDARD SAYS. 48U is 2133.6 mm, exactly, and a frame
//! that is 2133 or 2134 is a frame that does not take 48 pieces of equipment.
const frame = boxOf("FRAME");
const wantHigh = rackHeight("eia310", UNITS);
console.log("frame " + frame.size.map(n => n.toFixed(1)).join(" × ") + " mm"
  + "  (48U = " + wantHigh.toFixed(2) + ")");
if (Math.abs(frame.size[2] - wantHigh) > 1e-6) {
  console.log("the frame is not " + wantHigh + " tall - the sample is not written");
  process.exit(1);
}

//! AND THE POSTS ARE DRILLED WHERE THE STANDARD PUTS THE HOLES. Counted off
//! the built solid: 48U at three holes a unit is 144 square holes, and a
//! square hole through a 2 mm plate adds four faces.
const postFaces = kit.countSubShapes(bodyOf("PF1").shape, kit.FACE);
const wantHoles = holeCentres("eia310", UNITS).length;
console.log("post " + wantHoles + " holes · " + postFaces + " faces");
if (wantHoles !== 144) { console.log("the hole pattern is wrong"); process.exit(1); }

//! AND EVERYTHING IS WHERE IT SAYS IT IS. This is the check that would have
//! caught the bracing standing up beside a post instead of lying across the
//! back of it: a brace is a cross-member, so it is WIDE and SHORT, and nothing
//! inside the rack may poke out through the top of the frame. Both faults look
//! like a rack from far enough away, and neither survives being measured.
{
  //! Measured off the ARRAY, because a feature another one consumes has no body
  //! of its own to measure. The array only steps upwards, so across the rack
  //! and front to back it is one brace.
  const brace = boxOf("BRACES"), high = boxOf("FRAME").high[2];
  console.log("bracing " + brace.size.map(n => n.toFixed(1)).join(" × ")
    + " mm · frame top " + high.toFixed(1));
  if (!(brace.size[0] > brace.size[1] * 5)) {
    console.log("the brace is not lying across the rack - the sample is not written");
    process.exit(1);
  }
  const over = ["BRACES", "NODES", "SW1", "SW2", "PDU", "CAGES", "BOLTS", "MGR"]
    .filter(id => boxOf(id).high[2] > high + 1e-6);
  if (over.length) {
    console.log("out through the top of the frame: " + over.join(", "));
    process.exit(1);
  }
  //! AND A BOLT GOES THROUGH THE FLANGE. A fastener is built along its plane's
  //! normal, so one given the floor plane stands upright in mid-air at the hole
  //! instead of passing through it - which reads as a bolt from any distance
  //! and is not one. The front flange is the 2 mm between y = 60 and y = 62, so
  //! the bolt has to straddle it and the cage nut has to sit behind it.
  const bolts = boxOf("BOLTS"), cages = boxOf("CAGES");
  console.log("bolt through y " + bolts.low[1].toFixed(1) + ".." + bolts.high[1].toFixed(1)
    + " · cage nut behind the flange at y " + cages.low[1].toFixed(1));
  if (!(bolts.low[1] < 60 && bolts.high[1] > 62)) {
    console.log("the bolts do not pass through the flange - the sample is not written");
    process.exit(1);
  }
  if (!(cages.low[1] >= 61.9)) {
    console.log("the cage nuts are not behind the flange - the sample is not written");
    process.exit(1);
  }

  //! The tray is MEANT to be above it, and sitting on it rather than floating.
  const tray = boxOf("TRAY");
  console.log("tray sits at " + tray.low[2].toFixed(1) + " on a frame " + high.toFixed(1) + " high");
  if (Math.abs(tray.low[2] - high) > 0.05) {
    console.log("the tray is not resting on the frame - the sample is not written");
    process.exit(1);
  }
}

//! THE PARAMETER REALLY DRIVES IT. A model that merely CONTAINS numbers and a
//! model whose numbers are wired look the same until one is dragged. So the
//! compute count is dragged from 8 to 4 and back, and the answer is measured.
const stackHigh = () => boxOf("NODES").size[2];
const eight = stackHigh();
await mdl.run({ op: "set", id: "N_NODES", key: "value", value: 4 });
const four = stackHigh();
await mdl.run({ op: "set", id: "N_NODES", key: "value", value: NODES });
const back = stackHigh();
console.log("compute stack  8 nodes " + eight.toFixed(1) + " mm · 4 nodes "
  + four.toFixed(1) + " · back to 8 " + back.toFixed(1));
//! Eight 2U nodes span 8*2U less the clearance; four span half of that plus
//! the clearance back. The check is that halving the count halves the stack to
//! within one unit, and that it comes back.
if (!(Math.abs(eight - back) < 1e-6) || !(Math.abs(four - eight / 2) < U)) {
  console.log("the compute count is not driving the stack - the sample is not written");
  process.exit(1);
}

//! AND THE HEIGHT DRIVES THE FRAME, THE POSTS, THE BRACING AND THE FIXINGS.
const was = { frame: boxOf("FRAME").size[2], braces: boxOf("BRACES").size[2],
              bolts: boxOf("BOLTS").size[2] };
await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: 24 });
const half = { frame: boxOf("FRAME").size[2], braces: boxOf("BRACES").size[2],
               bolts: boxOf("BOLTS").size[2] };
await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: UNITS });
console.log("48U -> 24U   frame " + was.frame.toFixed(1) + " -> " + half.frame.toFixed(1)
  + " · bracing " + was.braces.toFixed(0) + " -> " + half.braces.toFixed(0)
  + " · fixings " + was.bolts.toFixed(0) + " -> " + half.bolts.toFixed(0));
if (Math.abs(half.frame - rackHeight("eia310", 24)) > 1e-6
    || !(half.braces < was.braces) || !(half.bolts < was.bolts)) {
  console.log("the height is not driving the rack - the sample is not written");
  process.exit(1);
}

//! THE BILL IS THE MODEL'S OWN. Read back off the built document rather than
//! counted here, because a bill this script computed would prove nothing.
const bom = rows.find(f => f.id === "BOM");
const fix = rows.find(f => f.id === "BOM_FIX");
console.log("\nbill of materials · " + String((bom.data || {}).preview || "").slice(0, 160));
console.log("fasteners        · " + String((fix.data || {}).preview || "").slice(0, 160));

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("\nwrote " + OUT);
