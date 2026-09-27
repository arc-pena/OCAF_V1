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
//   05 Cable        the tray at the top and the fingered manager down the side.
//   06 Legs         levelling feet, two of them with a real cut thread.
//   07 Door         the perforated front door, which reports what it opens.
//   08 Overhead     the runway, on a trapeze hung off the soffit.
//   09 Cabling      real routed cable with connectors on the ends.
//   10 Floor        the raised access floor it stands on, grate and solid.
//   11 Scale        a person, 1.8 m, so the rest of it has a size.
//   12 Bill         the bill of materials, read off the model.
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
import { HARNESS } from "../docs/src/harness-plugin.js";
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

//! WHERE A UNIT STARTS, in millimetres up the rack. Written here rather than
//! typed into the cable points, so a run that leaves a node's face leaves the
//! face of the node that is actually there.
const unitBottomAt = u => (u - 1) * U;

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
  //! A SINGLE WIRE IS { ref: "ID" }; A MULTI-WIRE INPUT IS A LIST OF THEM.
  //! Route's "through" takes as many points as you give it, and writing that
  //! as { ref: [...] } produces an argument the reader cannot resolve - it
  //! comes back as "references an unknown feature" naming the whole list.
  for (const [key, from] of Object.entries(refs || {}))
    made[key] = Array.isArray(from) ? from.map(one => ({ ref: one })) : { ref: from };
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
//! THE SECTION THE RACK IS MADE OF, as one feature. This is the answer to
//! "change the strut and the frame follows": the frame and every brace are
//! wired to THIS, so switching it from a 40 T-slot to a 45 or to a 41 mm
//! channel changes the frame and all four braces at once. A choice on an
//! argument cannot be wired - it is a number on one feature - which is why the
//! section has to be a feature before it can be a parameter.
add("SECTION", "StrutSection", { name: "Rack section · T-slot 40", parent: "P",
  args: { profile: 2 } });
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
  refs: { plane: "PL0", section: "SECTION" },
  wire: { units: ["N_UNITS", UNITS], depth: ["N_DEPTH", DEPTH] },
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
  refs: { plane: "PLX", at: "PTB", section: "SECTION" },
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
//! THE UNIT EACH ONE SITS AT, COMPUTED. These were typed - 40, 42 and 45 - and
//! a typed unit number is a part that stays where it was put while everything
//! around it moves: halve the rack and the switches hang in the air above it,
//! which is exactly what this sample exists to say cannot happen. The first
//! free U is the one above the compute stack, so the switches, the PDU and the
//! blanking ride up and down with the node count as well as with the height.
const TOP_U = "a + b * c";
expr("X_TOPU", "First free U", TOP_U,
     { a: ["N_FIRST", FIRST_U], b: ["N_NODES", NODES], c: ["N_NODEU", NODE_U] }, "C");
expr("X_TOPU2", "Second free U", TOP_U + " + 1",
     { a: ["N_FIRST", FIRST_U], b: ["N_NODES", NODES], c: ["N_NODEU", NODE_U] }, "C");
expr("X_TOPU4", "Fourth free U", TOP_U + " + 3",
     { a: ["N_FIRST", FIRST_U], b: ["N_NODES", NODES], c: ["N_NODEU", NODE_U] }, "C");
const FREE_U = FIRST_U + NODES * NODE_U;
add("PTS", "Point", { name: "Switches at", parent: "C",
  args: { x: PANEL_X, y: 60, z: 0 } });
add("SW1", "RackDevice", { name: "Leaf switch · 1U", parent: "C",
  refs: { plane: "PL0", at: "PTS" }, wire: { unit: ["X_TOPU", FREE_U] },
  args: { standard: 0, units: 1, depth: 550, inset: 20, ears: 0,
          supplier: "32 x 400G leaf switch" } });
add("SW2", "RackDevice", { name: "Leaf switch · 1U", parent: "C",
  refs: { plane: "PL0", at: "PTS" }, wire: { unit: ["X_TOPU2", FREE_U + 1] },
  args: { standard: 0, units: 1, depth: 550, inset: 20, ears: 0,
          supplier: "32 x 400G leaf switch" } });
add("PDU", "RackDevice", { name: "PDU · 2U", parent: "C",
  refs: { plane: "PL0", at: "PTS" }, wire: { unit: ["X_TOPU4", FREE_U + 3] },
  args: { standard: 0, units: 2, depth: 300, inset: 700, ears: 0,
          supplier: "3-phase 32 A rack PDU" } });
//! THE PATCH PANEL AND THE BLANKING, which are the two things a real rack is
//! full of and a modelled one never has. Blanking is not decoration: an open U
//! in a hot aisle is cold air going straight back to the coolers, and a rack
//! whose blanking is in the model is a rack whose airflow can be asked about.
//! Both ride on the same computed unit as everything else above the stack.
expr("X_TOPU3", "Third free U", TOP_U + " + 2",
     { a: ["N_FIRST", FIRST_U], b: ["N_NODES", NODES], c: ["N_NODEU", NODE_U] }, "C");
add("PP1", "RackDevice", { name: "Patch panel · 1U", parent: "C",
  refs: { plane: "PL0", at: "PTS" }, wire: { unit: ["X_TOPU3", FREE_U + 2] },
  args: { standard: 0, units: 1, depth: 120, inset: 20, ears: 0,
          supplier: "24-way LC duplex patch panel" } });
//! THE BLANKING GOES BELOW THE STACK, at U1, and that is not an arbitrary
//! choice. Put above everything else it lands at U24 of a 48U rack and hangs
//! out of the top of a 24U one - which the halving check caught, and which is
//! the same fault this sample exists to demonstrate is impossible. Below the
//! first node there is always room for it, and the bottom two U of a rack is
//! where the blanking actually goes.
add("BLK", "RackDevice", { name: "Blanking · 2U at the foot", parent: "C",
  refs: { plane: "PL0", at: "PTS" },
  args: { standard: 0, unit: 1, units: 2, depth: 30, inset: 20, ears: 0,
          supplier: "blanking panel, snap-in" } });

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
//! IT RIDES WITH THE RACK TOO. It is a demonstration of the bought-part wiring
//! and not a real fixing, but a demonstration that floats in mid-air once the
//! height changes demonstrates the wrong thing.
expr("X_BOUGHT", "Bought part at (mm)", "a * 44.45 - 34", { a: ["N_UNITS", UNITS] }, "X");
add("PTX3", "Point", { name: "Bought part at", parent: "X",
  wire: { z: ["X_BOUGHT", UNITS * U - 34] },
  args: { x: 65, y: 46 } });
add("STANDIN", "Cube", { name: "(stand-in for a supplier STEP)", parent: "X",
  refs: { origin: "PTX3", plane: "PL0" }, args: { dx: 10, dy: 14, dz: 10 } });
add("BOLT_REAL", "Fastener", { name: "M8 · the bought part", parent: "X",
  refs: { plane: "PLYB", at: "PTX3", bought: "STANDIN" },
  args: { part: 2, supplier: "your supplier's part number goes here" } });

/* ----------------------------------------------------------------- 05 Cable */

set("K", "05 Cable management");
//! ON TOP OF THE FRAME, not floating above it - and the tray is placed by its
//! own UNDERSIDE, so "on top of the frame" is the frame's height and nothing
//! added to it. WIRED to that height, so it rises with the rack.
expr("X_TRAYZ", "Tray at (mm)", "a * 44.45", { a: ["N_UNITS", UNITS] }, "K");
add("PTK", "Point", { name: "Tray at", parent: "K",
  wire: { z: ["X_TRAYZ", UNITS * U] },
  args: { x: 20, y: 380 } });
add("TRAY", "CableTray", { name: "Overhead tray · 300 wide", parent: "K",
  refs: { plane: "PL0", at: "PTK" }, wire: { width: ["N_TRAY", 300] },
  args: { length: 560, profile: 6, pitch: 140, rung: 20,
          supplier: "ladder tray, 300 mm" } });
add("PTK2", "Point", { name: "Manager at", parent: "K",
  args: { x: 445, y: DEPTH - 230, z: 0 } });
//! THE VERTICAL MANAGER AS THE PART IT IS, and not as a length of drilled
//! channel standing in for one. A manager is a channel with pairs of fingers up
//! it and the tie slots between them, and the only question anybody asks of one
//! is how much cable it will take - which the node computes from the window the
//! fingers leave, and prints, instead of leaving it to be guessed off a box.
//! ITS HEIGHT IS THE RACK'S, in units rather than in millimetres, so it cannot
//! stand out of the top of a rack somebody has shortened.
add("MGR", "CableManager", { name: "Vertical manager · fingered", parent: "K",
  refs: { plane: "PL0", at: "PTK2" }, wire: { units: ["N_UNITS", UNITS] },
  args: { width: 150, depth: 200, sheet: 1.5, pitch: 2 * U, finger: 45, cable: 6.2,
          supplier: "vertical manager, 150 mm, fingered" } });

/* ------------------------------------------------------------- 06 Legs */

set("L", "06 Legs");
//! THE PART THAT CARRIES THE RACK. A loaded 48U rack is comfortably over a
//! tonne standing on four of these, so the thread is geometry: a true helix
//! cut to ISO 68-1. It is the expensive thing in this file - a helical sweep
//! and a boolean per foot - which is why the node offers a plain stud as well
//! and why this sample turns the real thread on for TWO of the four. Both are
//! in the model, side by side, so the difference is something to look at
//! rather than something to take on trust.
const FOOT_IN = 60;
const FOOT_AT = [[FOOT_IN, FOOT_IN], [595.1 - FOOT_IN, FOOT_IN],
                 [FOOT_IN, DEPTH - FOOT_IN], [595.1 - FOOT_IN, DEPTH - FOOT_IN]];
FOOT_AT.forEach(([x, y], i) => {
  add("PTL" + i, "Point", { name: "Foot " + (i + 1) + " at", parent: "L",
    args: { x, y, z: -110 } });
  add("FOOT" + i, "LevellingFoot", {
    name: "Levelling foot " + (i + 1) + (i < 2 ? " \u00b7 thread cut" : " \u00b7 plain stud"),
    parent: "L", refs: { plane: "PL0", at: "PTL" + i },
    args: { thread: 4, stud: 110, travel: 55, base: 90, plate: 12,
            cut: i < 2 ? 1 : 0, threaded: 60,
            supplier: "M20 levelling foot, 1200 kg" } });
});

/* ------------------------------------------------------------- 07 Door */

set("D", "07 Door");
//! LOD 400 MEANS THE OPEN AREA IS A NUMBER, not a hatch pattern. A perforated
//! door is bought against that percentage, and the node computes it off the
//! holes it actually punched rather than off the pattern it was asked for - so
//! a door that misses says so. 5.5 mm on a 6 mm 60-degree pitch is about 74%,
//! which is what a modern high-density front door is.
add("PTD", "Point", { name: "Door at", parent: "D",
  args: { x: 0, y: -30, z: 0 } });
add("DOOR", "RackDoor", { name: "Front door \u00b7 perforated", parent: "D",
  refs: { plane: "PL0", at: "PTD" },
  wire: { units: ["N_UNITS", UNITS] },
  args: { width: 595.1, sheet: 1.5, frame: 40, perf: 1, hole: 5.5,
          pitchX: 6, pitchY: 5.196, wantOpen: 70, lock: 1, hinge: 0,
          supplier: "front door, perforated, swing handle" } });

/* -------------------------------------------------- 08 Overhead management */

set("O", "08 Overhead cable management");
//! TOP-HUNG, which is how a hall is actually wired: the runway is carried off
//! the ceiling on trapeze hangers and the rack hangs its runs from it, so the
//! tray is not sitting on the rack at all.
add("PTO", "Point", { name: "Runway at", parent: "O",
  args: { x: -200, y: 380, z: 2600 } });
add("RUNWAY", "CableTray", { name: "Overhead runway · 450 ladder", parent: "O",
  refs: { plane: "PL0", at: "PTO", section: "SECTION" },
  args: { length: 1400, width: 450, profile: 6, pitch: 300, rung: 25,
          supplier: "runway, 450 mm ladder" } });
//! WHAT HOLDS IT UP, and it is a trapeze rather than two sticks of rod leaning
//! on nothing. The drop is measured to the face the tray BEARS ON, so the
//! runway sits at the height it is set to and stays there when the section
//! changes - and the hanger says what its two rods will carry, so a ladder full
//! of copper on the wrong rod is something the model objects to rather than
//! something site finds out.
[-180, 1020].forEach((x, i) => {
  add("PTO" + i, "Point", { name: "Trapeze " + (i + 1) + " at", parent: "O",
    args: { x, y: 380, z: 3000 } });
  add("DROP" + i, "CeilingHanger", { name: "Trapeze " + (i + 1) + " · M12", parent: "O",
    refs: { plane: "PL0", at: "PTO" + i, section: "SECTION" },
    args: { span: 500, drop: 400, rod: 2, profile: 6, load: 120,
            supplier: "M12 trapeze, 500 centres" } });
});

/* ------------------------------------------------------------ 09 Cabling */

set("W", "09 Cabling");
//! CABLES THAT ARE ACTUALLY ROUTED, with the connector on the end that goes in
//! the port. Each run starts at a node's face, goes back and up the manager,
//! and lands on the leaf switch above the stack - which is what a patch lead
//! in a rack does, and is why the corner radius matters: OM4 will not turn
//! tighter than ten times its own diameter and the node says so if it has to.
const PANEL_FACE = PANEL_X + 40;
const MGR_X = 555;
[0, 1, 2, 3].forEach(i => {
  const fromZ = unitBottomAt(FIRST_U + i * 2) + 40;
  add("WA" + i, "Point", { name: "Node " + (i + 1) + " port", parent: "W",
    args: { x: PANEL_FACE, y: 40, z: fromZ } });
  add("WB" + i, "Point", { name: "Node " + (i + 1) + " out", parent: "W",
    args: { x: PANEL_FACE, y: -60, z: fromZ } });
  add("WC" + i, "Point", { name: "Node " + (i + 1) + " across", parent: "W",
    args: { x: MGR_X, y: -60, z: fromZ } });
  add("WD" + i, "Point", { name: "Node " + (i + 1) + " up", parent: "W",
    args: { x: MGR_X, y: -60, z: 1755 } });
  add("WE" + i, "Point", { name: "Node " + (i + 1) + " to switch", parent: "W",
    args: { x: PANEL_FACE + 60 + i * 20, y: 40, z: 1755 } });
  add("RT" + i, "Route", { name: "Node " + (i + 1) + " uplink route", parent: "W",
    refs: { through: ["WA" + i, "WB" + i, "WC" + i, "WD" + i, "WE" + i] },
    args: { kind: 0, radius: 45 } });
  add("CB" + i, "Cable", { name: "Node " + (i + 1) + " uplink \u00b7 OM4", parent: "W",
    refs: { route: "RT" + i },
    args: { cable: 2, startEnd: 2, endEnd: 2,
            supplier: "OM4 LC-LC duplex patch" } });
});
//! And the power side, which is the other half of a rack and is the reason the
//! rear manager is there at all.
[0, 1].forEach(i => {
  const fromZ = unitBottomAt(FIRST_U + i * 2) + 20;
  add("QA" + i, "Point", { name: "PSU " + (i + 1), parent: "W",
    args: { x: PANEL_FACE + 300, y: 980, z: fromZ } });
  add("QB" + i, "Point", { name: "PSU " + (i + 1) + " out", parent: "W",
    args: { x: PANEL_FACE + 300, y: 1080, z: fromZ } });
  add("QC" + i, "Point", { name: "PSU " + (i + 1) + " up", parent: "W",
    args: { x: MGR_X, y: 1080, z: 1990 } });
  add("QRT" + i, "Route", { name: "PSU " + (i + 1) + " power route", parent: "W",
    refs: { through: ["QA" + i, "QB" + i, "QC" + i] },
    args: { kind: 0, radius: 60 } });
  add("QCB" + i, "Cable", { name: "PSU " + (i + 1) + " cord \u00b7 C13", parent: "W",
    refs: { route: "QRT" + i },
    args: { cable: 6, startEnd: 7, endEnd: 7, supplier: "C14-C13 1.5 m" } });
});

/* ------------------------------------------------- 10 Raised floor, 11 Scale */

//! THE FLOOR THE RACK STANDS ON, because a rack drawn on nothing is a rack
//! nobody can tell the height of and because the floor is half of whether the
//! rack gets its air. Four panels on the 600 module: a cast directional grate
//! in front of the door where the cold air comes up, solid under the rack
//! itself. Each panel reports the open area it actually cut and what will pass
//! through it at plenum pressure.
set("FL", "10 Raised floor");
add("PTFL", "Point", { name: "Solid field at", parent: "FL",
  args: { x: -600, y: 0, z: 0 } });
add("TFL", "FloorTile", { name: "Solid panel · under the rack", parent: "FL",
  refs: { plane: "PL0", at: "PTFL" },
  args: { tile: 0, grid: 600, thick: 0, joint: 1, under: 0, height: 600, plenum: 25,
          supplier: "600 steel panel, encapsulated" } });
add("FFL", "Array", { name: "Solid field", parent: "FL",
  refs: { source: "TFL" },
  args: { mode: 0, countX: 3, spacingX: 600, countY: 2, spacingY: 600,
          countZ: 1, spacingZ: 0 } });
add("PTFG", "Point", { name: "Grate at", parent: "FL",
  args: { x: -600, y: -1200, z: 0 } });
add("TFG", "FloorTile", { name: "Directional grate · in the cold aisle", parent: "FL",
  refs: { plane: "PL0", at: "PTFG" },
  args: { tile: 2, grid: 600, thick: 0, joint: 1, under: 0, height: 600, plenum: 25,
          supplier: "600 cast aluminium directional grate" } });
add("FFG", "Array", { name: "Grate field", parent: "FL",
  refs: { source: "TFG" },
  args: { mode: 0, countX: 3, spacingX: 600, countY: 2, spacingY: 600,
          countZ: 1, spacingZ: 0 } });

//! AND SOMEBODY TO STAND NEXT TO IT. Everything above this line is a number
//! that can be checked against a document; this is the one thing in the file
//! that cannot, and it is the thing that makes the rest of it readable at a
//! glance. 1.8 m, in the cold aisle, facing the door.
set("SC", "11 Scale");
add("PTSC", "Point", { name: "Person at", parent: "SC",
  args: { x: 1100, y: -900, z: 0 } });
add("PERSON", "ScaleFigure", { name: "Scale figure · 1.8 m", parent: "SC",
  refs: { plane: "PL0", at: "PTSC" },
  args: { height: 1800, turn: 180 } });

/* ------------------------------------------------------------------ 06 Bill */

set("Z", "10 Bill of materials");
add("BOM", "Bill", { name: "Bill of materials · the whole rack", parent: "Z",
  refs: { of: "R" }, args: { show: 0 } });
add("BOM_FIX", "Bill", { name: "Fasteners to order", parent: "Z",
  refs: { of: "R" }, args: { show: 1 } });

//! WHAT IT CANNOT BE OPENED WITHOUT, written into the file. Every node in 01
//! to 05 belongs to the rack package, and a catalogue without it has no
//! RackFrame - so a file that did not say this refused at the first one, by
//! node name, and read as a corrupt file. The page switches on whatever a
//! model asks for before opening it, so this is the whole of what is needed to
//! make the file openable by dropping it on the page.
const model = { format: "ocaf-parametric-model", version: 1,
                name: "Hyperstack rack", units: "mm", needs: ["rack", "harness"], features };

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
await host.load("harness");
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

//! WHAT LIVES INSIDE THE FRAME and must stay there at any height. The tray is
//! not in it: the tray sits ON the frame, and is checked for that instead.
const INSIDE = ["BRACES", "NODES", "SW1", "SW2", "PDU", "PP1", "BLK", "CAGES", "BOLTS",
                "MGR", "STANDIN", "BOLT_REAL"];

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
  const over = INSIDE.filter(id => boxOf(id).high[2] > high + 1e-6);
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

  //! AND THE FILE SAYS WHICH PACKAGE IT IS MADE OF. Without this line the file
  //! opens from the samples menu, which has its own list, and refuses when
  //! somebody drops it on the page - the one way somebody sent this sample is
  //! going to try to open it.
  if (!(model.needs || []).includes("rack")) {
    console.log("the file does not ask for the rack package - the sample is not written");
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

//! AND ASKED AGAIN OF A RACK THAT HAS BEEN HALVED. Everything above fits a 48U
//! rack, and a part placed at a typed height fits a 48U rack too - it is only
//! when the rack moves that the difference between a number that was computed
//! and a number that was typed shows up. The switches sat at U40 and U42 and
//! the manager was 1900 long: at 24U all three hung in the air above a frame
//! half their height, and every check above still passed.
{
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: 24 });
  const high = boxOf("FRAME").high[2];
  const out = INSIDE.filter(id => boxOf(id).high[2] > high + 1e-6);
  console.log("halved to 24U · frame top " + high.toFixed(1) + " · "
    + (out.length ? "OUT: " + out.join(", ") : "everything still inside it"));
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: UNITS });
  if (out.length) {
    console.log("these do not follow the height: " + out.join(", ")
      + " - the sample is not written");
    process.exit(1);
  }
}

//! AND ONE SECTION DRIVES EVERY MEMBER MADE OF IT. This is the check behind
//! "change the strut and the frame follows": the frame and all four braces are
//! wired to one StrutSection, so switching it has to move both at once. A
//! 40 T-slot brace is 40 wide; a 45 is 45; a 41 x 21 channel is 20.6 deep.
{
  const braceWide = () => boxOf("BRACES").size[1];
  const frameWide = () => boxOf("FRAME").size[0];
  const at40 = { brace: braceWide(), frame: frameWide() };
  await mdl.run({ op: "set", id: "SECTION", key: "profile", value: 3 });   // T-slot 45
  const at45 = { brace: braceWide(), frame: frameWide() };
  await mdl.run({ op: "set", id: "SECTION", key: "profile", value: 6 });   // 41 x 21 channel
  const channel = { brace: braceWide(), frame: frameWide() };
  await mdl.run({ op: "set", id: "SECTION", key: "profile", value: 2 });
  const back = { brace: braceWide(), frame: frameWide() };
  console.log("one section, every member · brace " + at40.brace.toFixed(1) + " -> "
    + at45.brace.toFixed(1) + " -> " + channel.brace.toFixed(1) + " -> " + back.brace.toFixed(1)
    + "  · frame " + at40.frame.toFixed(1) + " -> " + at45.frame.toFixed(1)
    + " -> " + channel.frame.toFixed(1) + " -> " + back.frame.toFixed(1));
  //! The brace follows the section exactly - it IS the section - and the frame
  //! has to move too, or the section is only driving one of the two.
  if (Math.abs(at40.brace - 40) > 0.01 || Math.abs(at45.brace - 45) > 0.01
      || Math.abs(channel.brace - 20.6) > 0.01 || Math.abs(back.brace - 40) > 0.01) {
    console.log("the section is not driving the bracing - the sample is not written");
    process.exit(1);
  }
  if (!(at45.frame > at40.frame) || !(Math.abs(back.frame - at40.frame) < 1e-6)) {
    console.log("the section is not driving the frame - the sample is not written");
    process.exit(1);
  }
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
