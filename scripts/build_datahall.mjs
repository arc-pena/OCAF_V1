// Builds docs/data/samples/datahall_corridor.json — a double-loaded corridor.
//
//     node scripts/build_datahall.mjs
//
// WHAT THIS IS FOR, and it is a different question from the one the single
// hyperstack rack answers. That one asks whether a parametric modeller can hold
// ONE rack at the level of detail people build from. This one asks the question
// after it: can it hold a ROOM of them without becoming eight copies of the
// same thing that have to be edited eight times.
//
// So there is exactly ONE rack in this file. Everything in it is parametric -
// the frame follows the height in U, the bracing count follows the height, the
// equipment follows the unit it is at, the door's open area is computed off the
// holes it punched. The other seven racks are INSTANCES of it: the same
// geometry at another location, built once and meshed once. Edit the rack and
// eight racks change. That is the whole claim, and the script measures it at
// the bottom rather than asserting it.
//
// THE SHAPE OF IT:
//
//   00 Parameters   the hall: rack height, depth, pitch, racks a row, aisle,
//                   finished floor height, soffit. Everything is over these.
//   01 Reference    the planes. A rack part is built on the floor plane at the
//                   origin and instanced from there.
//   02 Rack A       THE rack - a Part, so it is a component and not a folder.
//   03 Row A        three instances of it, at 600 pitch.
//   04 Row B        one instance turned 180 and a pattern of THAT - which is
//                   the other half of instancing: a pattern of instances is
//                   still one piece of geometry.
//   05 Raised floor grate in the cold aisles, solid under the racks and down
//                   the hot aisle, on the 600 module with its understructure.
//   06 Overhead     the runway over each row, on trapeze hangers that say what
//                   they carry, and trunk cable routed along it.
//   07 Scale        a person, 1.8 m, in the cold aisle.
//   08 Clash        the racks against the floor, the overhead and the person,
//                   checked by geometry rather than by looking at it.
//   09 Bill         the bill of materials for the hall, read off the model.
//
// WHY THE CORRIDOR IS BETWEEN THE ROWS. The two rows stand BACK TO BACK, so the
// space between them is the hot aisle and the cold aisles are on the outside -
// which is why the grates are out there and the floor between the rows is
// solid. Putting grates in a hot aisle is the commonest way to lose a third of
// a hall's cooling, and a model that lays the floor out is a model that can be
// asked about it.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { PluginHost } from "../docs/src/plugin.js";
import { RACK } from "../docs/src/rack-plugin.js";
import { HARNESS } from "../docs/src/harness-plugin.js";
import { FLOOR_TILES, RACK_FINISHES, finishOf, holeCentres, rackHeight,
         tilePitch } from "../docs/src/rack.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "data", "samples", "datahall_corridor.json");
const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";

/* ===================================================== the numbers it is of */

const U = 44.45;
const UNITS = 48;              // a hyperscale row runs 48U
const DEPTH = 1200;            // rack depth, front face to rear face
const PITCH = 600;             // rack pitch along the row, and the floor module
const RACKS = 4;               // racks in a row - four each side is eight
const AISLE = 1200;            // the hot aisle between the two rows, clear
const FFH = 600;               // finished floor height
const SLAB = 3000;             // the soffit the runway hangs from
const TRAY_UNDER = 2600;       // the underside of the runway
const PERSON = 1800;
//! HOW FAR OFF THE FLOOR THE RACK STANDS, and this is not decoration. A rack
//! sits on four levelling feet and the feet sit on the finished floor - so the
//! frame's underside is a foot's height above z = 0, not on it. Built at z = 0
//! with its feet hanging below, as this was, every rack in the hall had its
//! legs driven 110 mm through the floor panels: eight racks, thirty-two legs,
//! and from any distance it looks exactly like a rack standing on a floor.
//! That is what the Clash node at the end of this file is for.
const PLINTH = 100;

//! AND NO SECTION-DEPTH CORRECTION ANYWHERE, which is worth saying because the
//! first version of this file had two. A tray is placed by its underside and a
//! hanger's drop is to the face the tray bears on, so the runway goes at the
//! height it goes at and switching the hall's section moves the tray and its
//! hanger together instead of parting them.

const COLUMN = 465.1;          // EIA-310-E between hole columns, as printed
const FLANGE = 50;
const PANEL_IN = (482.6 - COLUMN) / 2;
const POST_X = [40, 40 + COLUMN];
const PANEL_X = POST_X[0] + FLANGE / 2 - PANEL_IN;
const RACK_W = 595.1;          // the frame across, which is what a 600 bay holds
const BRACE_SPAN = COLUMN - FLANGE;

const unitBottomAt = u => (u - 1) * U;

const features = [];
//! A MODEL FILE SAYS A REFERENCE INSIDE args, as { ref: "ID" }; a multi-wire
//! input is a LIST of them; a number driven by another number is
//! { value, from }. The `refs` shorthand belongs to the add OP and a file that
//! uses it has its wires silently dropped - see build_rack_demo.mjs, where that
//! cost an afternoon.
const add = (id, type, more = {}) => {
  const { refs, wire, args, ...rest } = more;
  const made = { ...(args || {}) };
  for (const [key, from] of Object.entries(refs || {}))
    made[key] = Array.isArray(from) ? from.map(one => ({ ref: one })) : { ref: from };
  for (const [key, [from, value]] of Object.entries(wire || {}))
    made[key] = { value, from };
  features.push({ id, type, ...rest, ...(Object.keys(made).length ? { args: made } : {}) });
  return id;
};
//! A SET CARRIES THE COLOUR, and everything in it wears it unless it says
//! otherwise - which is what makes a scheme a scheme rather than a hundred
//! separate decisions. One line per set here is the whole of the colouring of
//! eight racks, a floor, two runways and four hundred fixings.
const set = (id, name, parent = "H", role = null) =>
  add(id, "GeometricalSet", { name, ...(parent ? { parent } : {}),
                              ...(role ? { appearance: finishOf(role) } : {}) });
const num = (id, name, value, parent) =>
  add(id, "Number", { name, parent, args: { value } });
const expr = (id, name, js, wired, parent) => {
  const args = { formula: js };
  for (const [key, [from, value]] of Object.entries(wired || {}))
    args[key] = { value, from };
  return add(id, "Expression", { name, parent, args });
};
const at = (id, name, x, y, z, parent, wired) =>
  add(id, "Point", { name, parent, args: { x, y, z }, ...(wired ? { wire: wired } : {}) });

/* ------------------------------------------------------------ 00 Parameters */

add("H", "GeometricalSet", { name: "Data hall · double-loaded corridor" });
set("P", "00 Parameters");
num("N_UNITS", "Rack height", UNITS, "P");
num("N_DEPTH", "Rack depth", DEPTH, "P");
num("N_PITCH", "Rack pitch", PITCH, "P");
num("N_RACKS", "Racks a row", RACKS, "P");
num("N_AISLE", "Hot aisle", AISLE, "P");
num("N_FFH", "Finished floor", FFH, "P");
num("N_SLAB", "Soffit", SLAB, "P");
num("N_PERSON", "Person", PERSON, "P");
num("N_PLINTH", "Rack on its feet", PLINTH, "P");
num("N_NODES", "Compute nodes a rack", 8, "P");
num("N_NODEU", "Node height", 2, "P");
num("N_FIRST", "First node at", 3, "P");

//! ONE SECTION FOR THE WHOLE HALL. The frame, the braces, the runway and the
//! trapeze cross members are all wired to this, so switching it from a 40
//! T-slot to a 41 channel changes every member in eight racks and two runways
//! at once. This is the feature that makes the file a model rather than a
//! drawing, and it is one line.
add("SECTION", "StrutSection", { name: "Hall section · T-slot 40", parent: "P",
  args: { profile: 2 } });

expr("X_HEIGHT", "Rack height (mm)", "a * 44.45", { a: ["N_UNITS", UNITS] }, "P");
//! WHERE ROW B'S DATUM IS. Two rack depths and the aisle between them, so
//! widening the aisle moves the far row rather than overlapping it - which is
//! what a typed 3600 does the first time somebody drags the aisle.
expr("X_ROWB", "Row B datum (mm)", "a * 2 + b",
     { a: ["N_DEPTH", DEPTH], b: ["N_AISLE", AISLE] }, "P");
expr("X_ROWLEN", "Row length (mm)", "a * b",
     { a: ["N_RACKS", RACKS], b: ["N_PITCH", PITCH] }, "P");
//! The drop that puts the runway's channel under the tray. The soffit does not
//! move; the tray height is what is being set, so the drop is the derived one.
expr("X_DROP", "Hanger drop (mm)", "a - " + TRAY_UNDER,
     { a: ["N_SLAB", SLAB] }, "P");

/* ----------------------------------------------------------- 01 Reference */

set("R", "01 Reference");
at("PT0", "Hall origin", 0, 0, 0, "R");
add("VZ", "Vector", { name: "Up", parent: "R", args: { dx: 0, dy: 0, dz: 1 } });
add("PL0", "Plane", { name: "Finished floor", parent: "R",
  refs: { origin: "PT0", normal: "VZ" } });
//! A Strut runs along its plane's NORMAL and a Fastener is built along it too,
//! so which way a member points is which plane it is given. Four of them, and
//! between them every direction anything in this hall is built along.
add("VX", "Vector", { name: "Across", parent: "R", args: { dx: 1, dy: 0, dz: 0 } });
add("PLX", "Plane", { name: "Across the rack", parent: "R",
  refs: { origin: "PT0", normal: "VX" } });
add("VY", "Vector", { name: "Into the rack", parent: "R", args: { dx: 0, dy: 1, dz: 0 } });
add("PLY", "Plane", { name: "Into the rack", parent: "R",
  refs: { origin: "PT0", normal: "VY" } });
add("VYB", "Vector", { name: "Out the front", parent: "R", args: { dx: 0, dy: -1, dz: 0 } });
add("PLYB", "Plane", { name: "Out the front", parent: "R",
  refs: { origin: "PT0", normal: "VYB" } });

/* ------------------------------------------------------------- 02 Rack A */

//! A PART AND NOT A FOLDER, which is the difference this file is about. A Part
//! is a component: what is filed in it is its definition, what it hands on is
//! the whole of that as one shape, and an Instance of it is that shape at
//! another location - one TShape, eight locations. A folder would work too and
//! would say less.
//! ONE SET OVER ALL EIGHT, so a clash check has a side to be wired to. The
//! Part and the two rows are three different kinds of thing - a component, a
//! list of instances, and a pattern of one - and "the racks" is all of them.
set("RK8", "02 Racks");
add("RACK", "Part", { name: "Rack A · the one parametric rack", parent: "RK8" });

set("RF", "01 Frame", "RACK", "frame");
//! EVERYTHING IN THE RACK IS BUILT AT THE PLINTH, not at zero. A point wired
//! to N_PLINTH lifts with it, so dragging the foot height carries the whole
//! rack up - which is what makes the clash check at the end of this file a
//! check and not a coincidence.
//!
//! A FRAME NEEDS A POINT OF ITS OWN TO BE LIFTED AT ALL. Given only a plane it
//! is built at the plane's origin, and the origin of the floor plane is the
//! floor - so the frame alone stayed at zero while every part of the rack rose
//! around it. frameOf() takes the point over the plane when there is one.
at("PTR", "Rack base", 0, 0, PLINTH, "RF", { z: ["N_PLINTH", PLINTH] });
add("FRAME", "RackFrame", { name: "Frame · 48U", parent: "RF",
  refs: { plane: "PL0", at: "PTR", section: "SECTION" },
  wire: { units: ["N_UNITS", UNITS], depth: ["N_DEPTH", DEPTH] },
  args: { standard: 0, profile: 2, rails: 3, posts: 0, postWidth: FLANGE,
          supplier: "frame, welded" } });
const POST_AT = [[POST_X[0], 60], [POST_X[1], 60],
                 [POST_X[0], DEPTH - 60], [POST_X[1], DEPTH - 60]];
["PF1", "PF2", "PB1", "PB2"].forEach((id, i) => {
  at("PTP" + i, "Post " + (i + 1) + " at", POST_AT[i][0], POST_AT[i][1], PLINTH, "RF",
     { z: ["N_PLINTH", PLINTH], ...(i >= 2 ? { y: ["X_POSTY", DEPTH - 60] } : {}) });
  add(id, "RackPost", { name: "Post " + (i + 1) + " · EIA-310-E", parent: "RF",
    refs: { plane: "PL0", at: "PTP" + i }, wire: { units: ["N_UNITS", UNITS] },
    args: { standard: 0, holes: 0, width: FLANGE, wall: 2,
            supplier: "post, 2 mm ZP, square punched" } });
});
//! THE REAR POSTS FOLLOW THE DEPTH. Typed at 1140 they stay there while the
//! frame around them grows, and the rack comes apart from the inside - which is
//! invisible until somebody drags the depth, and is exactly the failure this
//! whole file exists to make impossible.
expr("X_POSTY", "Rear post at (mm)", "a - 60", { a: ["N_DEPTH", DEPTH] }, "RF");

set("RB", "02 Bracing", "RACK", "frame");
expr("X_BRACES", "Braces", "Math.max(2, Math.round(a / 12))",
     { a: ["N_UNITS", UNITS] }, "RB");
expr("X_BRACEZ", "Brace pitch (mm)", "a * 44.45 / Math.max(2, Math.round(a / 12))",
     { a: ["N_UNITS", UNITS] }, "RB");
expr("X_BRACE0", "First brace at (mm)",
     "b + a * 44.45 / (2 * Math.max(2, Math.round(a / 12)))",
     { a: ["N_UNITS", UNITS], b: ["N_PLINTH", PLINTH] }, "RB");
at("PTB", "First brace at", POST_X[0] + FLANGE, DEPTH - 60 + FLANGE / 2,
   PLINTH + UNITS * U / (2 * Math.max(2, Math.round(UNITS / 12))), "RB",
   { z: ["X_BRACE0", PLINTH + UNITS * U / (2 * Math.max(2, Math.round(UNITS / 12)))],
     y: ["X_BRACEY", DEPTH - 60 + FLANGE / 2] });
expr("X_BRACEY", "Brace at (mm)", "a - 35", { a: ["N_DEPTH", DEPTH] }, "RB");
add("BRACE", "Strut", { name: "Brace · drilled", parent: "RB",
  refs: { plane: "PLX", at: "PTB", section: "SECTION" },
  args: { profile: 2, length: BRACE_SPAN, holes: 1, bore: 9, pitch: 60, setback: 30,
          supplier: "brace, cut to length" } });
add("BRACES", "Array", { name: "Braces · up the rack", parent: "RB",
  refs: { source: "BRACE" },
  wire: { countZ: ["X_BRACES", Math.max(2, Math.round(UNITS / 12))],
          spacingZ: ["X_BRACEZ", UNITS * U / Math.max(2, Math.round(UNITS / 12))] },
  args: { mode: 0, countX: 1, spacingX: 0, countY: 1, spacingY: 0 } });

/* ---------------------------------------------------------- the equipment */

set("RE", "03 Equipment", "RACK", "equipment");
const FIRST_U = 3, NODE_U = 2, NODES = 8;
const FREE_U = FIRST_U + NODES * NODE_U;
at("PTC", "Equipment at", PANEL_X, 60, PLINTH, "RE", { z: ["N_PLINTH", PLINTH] });
add("NODE", "RackDevice", { name: "Compute node \u00b7 2U", parent: "RE",
  refs: { plane: "PL0", at: "PTC" },
  wire: { unit: ["N_FIRST", FIRST_U], units: ["N_NODEU", NODE_U] },
  args: { standard: 0, depth: 900, inset: 20, ears: 0,
          supplier: "2U dual-socket compute node" } });
expr("X_NODEMM", "Node pitch (mm)", "a * 44.45", { a: ["N_NODEU", NODE_U] }, "RE");
add("NODES", "Array", { name: "Compute stack", parent: "RE",
  refs: { source: "NODE" },
  wire: { countZ: ["N_NODES", NODES], spacingZ: ["X_NODEMM", NODE_U * U] },
  args: { mode: 0, countX: 1, spacingX: 0, countY: 1, spacingY: 0 } });

//! EVERY UNIT NUMBER ABOVE THE STACK IS COMPUTED off the stack, so the switches
//! and the panels ride up and down with the node count instead of hanging in
//! the air above a half-empty rack. The first free U is where the stack ends:
//! the U the first node sits at, plus as many nodes as there are times as many
//! U as each is.
//!
//! AND THE WIRE HAS TO GO TO THE RIGHT NUMBER, which is the mistake this sat
//! on for a while: `a` was wired to the rack's HEIGHT and given the first
//! node's unit as its written-down value, so the file opened with switches at
//! U64 of a 48U rack. The value in a model file is what the number would be if
//! the wire were pulled - it is not what the wire is.
[["SW1", "Leaf switch \u00b7 1U", 0, 1, 550, 20, "32 \u00d7 400G leaf switch"],
 ["SW2", "Leaf switch \u00b7 1U", 1, 1, 550, 20, "32 \u00d7 400G leaf switch"],
 ["PP1", "Patch panel \u00b7 1U", 2, 1, 120, 20, "24-way LC duplex patch panel"],
 ["BLK", "Blanking \u00b7 2U", 3, 2, 30, 20, "blanking panel, snap-in"],
 ["PDU", "PDU \u00b7 2U", 5, 2, 300, 700, "3-phase 32 A rack PDU"]].forEach(
  ([id, name, plus, units, depth, inset, supplier]) => {
  expr("X_" + id, name + " at (U)", "a + b * c" + (plus ? " + " + plus : ""),
       { a: ["N_FIRST", FIRST_U], b: ["N_NODES", NODES], c: ["N_NODEU", NODE_U] }, "RE");
  //! TWO OF THE FIVE ARE NOT EQUIPMENT and say so for themselves, over the
  //! set's colour: a PDU is power and wears red wherever it is, and a blanking
  //! panel is a piece of sheet and belongs with the door.
  const role = id === "PDU" ? "power" : id === "BLK" ? "enclosure" : null;
  add(id, "RackDevice", { name, parent: "RE",
    refs: { plane: "PL0", at: "PTC" }, wire: { unit: ["X_" + id, FREE_U + plus] },
    args: { standard: 0, units, depth, inset, ears: 0, supplier },
    ...(role ? { appearance: finishOf(role) } : {}) });
});

/* ------------------------------------------------------------ the fixings */

set("RX", "04 Fixings", "RACK", "fixing");
expr("X_BOLTS", "Fixings a column", "Math.floor(a / 4)", { a: ["N_UNITS", UNITS] }, "RX");
expr("X_FIXZ", "First fixing at (mm)", "a + 6.35", { a: ["N_PLINTH", PLINTH] }, "RX");
at("PTX", "First cage nut at", POST_X[0] + FLANGE / 2, 62, PLINTH + 6.35, "RX",
   { z: ["X_FIXZ", PLINTH + 6.35] });
add("CAGE", "Fastener", { name: "Cage nut M6", parent: "RX",
  refs: { plane: "PLY", at: "PTX" },
  args: { part: 10, supplier: "cage nut, M6, 9.5 mm square" } });
add("CAGES", "Array", { name: "Cage nuts · up the post", parent: "RX",
  refs: { source: "CAGE" },
  wire: { countZ: ["X_BOLTS", Math.floor(UNITS / 4)] },
  args: { mode: 0, countX: 2, spacingX: COLUMN, countY: 1, spacingY: 0,
          spacingZ: 4 * U } });
at("PTX2", "First bolt at", POST_X[0] + FLANGE / 2, 60, PLINTH + 6.35, "RX",
   { z: ["X_FIXZ", PLINTH + 6.35] });
add("BOLT", "Fastener", { name: "Hex bolt M6 × 16", parent: "RX",
  refs: { plane: "PLYB", at: "PTX2" },
  args: { part: 0, length: 16, supplier: "ISO 4017 M6 × 16 A2" } });
add("BOLTS", "Array", { name: "Bolts · up the post", parent: "RX",
  refs: { source: "BOLT" },
  wire: { countZ: ["X_BOLTS", Math.floor(UNITS / 4)] },
  args: { mode: 0, countX: 2, spacingX: COLUMN, countY: 1, spacingY: 0,
          spacingZ: 4 * U } });

/* -------------------------------------------------- the cable management */

set("RK", "05 Cable management", "RACK", "containment");
//! THE VERTICAL MANAGER, as the part it is rather than as a length of channel:
//! fingers in pairs on a 2U pitch with the tie slots between them, and the node
//! reports how many cables of a given diameter the window will actually take.
//! That number is the only question a manager is chosen against.
at("PTK", "Manager at", RACK_W - 150, DEPTH - 220, PLINTH, "RK",
   { y: ["X_MGRY", DEPTH - 220], z: ["N_PLINTH", PLINTH] });
expr("X_MGRY", "Manager at (mm)", "a - 220", { a: ["N_DEPTH", DEPTH] }, "RK");
add("MGR", "CableManager", { name: "Vertical manager · rear", parent: "RK",
  refs: { plane: "PL0", at: "PTK" }, wire: { units: ["N_UNITS", UNITS] },
  args: { width: 150, depth: 200, sheet: 1.5, pitch: 2 * U, finger: 45, cable: 6.2,
          supplier: "vertical manager, 150 mm, fingered" } });

/* ----------------------------------------------------------------- feet */

set("RL", "06 Feet", "RACK", "fixing");
const FOOT_IN = 60;
[[FOOT_IN, FOOT_IN], [RACK_W - FOOT_IN, FOOT_IN],
 [FOOT_IN, DEPTH - FOOT_IN], [RACK_W - FOOT_IN, DEPTH - FOOT_IN]].forEach(([x, y], i) => {
  //! ON THE FLOOR, at z = 0 - the finished floor level, which is what every
  //! other height in this hall is measured from. A foot is built UPWARDS from
  //! its point: base plate first, then the stud. Placed at -110, as these
  //! were, the base plate sat 110 mm INSIDE the floor panels.
  at("PTL" + i, "Foot " + (i + 1) + " at", x, y, 0, "RL",
     i >= 2 ? { y: ["X_FOOTY", DEPTH - FOOT_IN] } : null);
  add("FOOT" + i, "LevellingFoot", {
    name: "Levelling foot " + (i + 1) + (i < 2 ? " · thread cut" : " · plain stud"),
    parent: "RL", refs: { plane: "PL0", at: "PTL" + i },
    args: { thread: 4, stud: 110, travel: 55, base: 90, plate: 12,
            cut: i < 2 ? 1 : 0, threaded: 60, supplier: "M20 levelling foot, 1200 kg" } });
});
expr("X_FOOTY", "Rear foot at (mm)", "a - 60", { a: ["N_DEPTH", DEPTH] }, "RL");

/* ----------------------------------------------------------------- door */

set("RD", "07 Door", "RACK", "enclosure");
at("PTD", "Door at", 0, -30, PLINTH, "RD", { z: ["N_PLINTH", PLINTH] });
add("DOOR", "RackDoor", { name: "Front door · perforated", parent: "RD",
  refs: { plane: "PL0", at: "PTD" }, wire: { units: ["N_UNITS", UNITS] },
  args: { width: RACK_W, sheet: 1.5, frame: 40, perf: 1, hole: 5.5,
          pitchX: 6, pitchY: 5.196, wantOpen: 70, lock: 1, hinge: 0,
          supplier: "front door, perforated, swing handle" } });

/* -------------------------------------------------------------- 03 Row A */

set("A", "03 Row A · instances", "RK8");
for (let i = 1; i < RACKS; i++) {
  at("PTA" + i, "Rack A" + (i + 1) + " at", i * PITCH, 0, 0, "A",
     { x: ["X_A" + i, i * PITCH] });
  expr("X_A" + i, "Rack A" + (i + 1) + " at (mm)", "a * " + i, { a: ["N_PITCH", PITCH] }, "A");
  add("IA" + i, "Instance", { name: "Rack A" + (i + 1), parent: "A",
    refs: { part: "RACK", at: "PTA" + i }, args: { turn: 0, scale: 1 } });
}

/* -------------------------------------------------------------- 04 Row B */

//! TURNED 180 AND PATTERNED. An Instance rotates about the point it is placed
//! at, so a rack whose own origin is its front left corner lands with that
//! corner at the point and the rest of it BEHIND and to the LEFT - which is why
//! row B's datum is the far side of the aisle and not the near one. And the
//! pattern is of the INSTANCE: a pattern of instances is still one piece of
//! geometry, which is the thing worth demonstrating here.
set("B", "04 Row B · a pattern of instances", "RK8");
at("PTB0", "Row B at", PITCH, DEPTH * 2 + AISLE, 0, "B",
   { x: ["N_PITCH", PITCH], y: ["X_ROWB", DEPTH * 2 + AISLE] });
add("IB", "Instance", { name: "Rack B1 · turned 180", parent: "B",
  refs: { part: "RACK", at: "PTB0" }, args: { turn: 180, scale: 1 } });
add("ROWB", "Array", { name: "Row B · four racks", parent: "B",
  refs: { source: "IB" },
  wire: { countX: ["N_RACKS", RACKS], spacingX: ["N_PITCH", PITCH] },
  args: { mode: 0, countY: 1, spacingY: 0, countZ: 1, spacingZ: 0 } });

/* -------------------------------------------------------- 05 Raised floor */

set("FL", "05 Raised floor", "H", "floor");
//! THE FLOOR IS LAID IN BANDS, and which band is which panel is the design
//! decision a raised floor IS. Grate in front of each row, where the cold air
//! has to come up; solid under the racks and everywhere down the hot aisle,
//! where a grate would short the cold air straight back to the coolers.
const MODS_X = 6, X0 = -PITCH;
const BANDS = [
  ["S1", 0, "Back of house · solid", -1800, 1],
  ["G1", 2, "Cold aisle A · grate", -1200, 2],
  ["S2", 0, "Under the rows and the hot aisle · solid", 0, 6],
  ["G2", 2, "Cold aisle B · grate", 3600, 2],
  ["S3", 0, "Back of house · solid", 4800, 1],
];
for (const [id, tile, name, y0, rows] of BANDS) {
  at("PT" + id, name + " at", X0, y0, 0, "FL");
  add("T" + id, "FloorTile", { name: name, parent: "FL",
    refs: { plane: "PL0", at: "PT" + id },
    wire: { height: ["N_FFH", FFH] },
    args: { tile, grid: PITCH, thick: 0, joint: 1, under: 0, plenum: 25,
            supplier: tile === 0 ? "600 steel panel, encapsulated"
                                 : "600 cast aluminium directional grate" } });
  add("F" + id, "Array", { name: name + " · field", parent: "FL",
    refs: { source: "T" + id },
    wire: { spacingX: ["N_PITCH", PITCH], spacingY: ["N_PITCH", PITCH] },
    args: { mode: 0, countX: MODS_X, countY: rows, countZ: 1, spacingZ: 0 } });
}

/* -------------------------------------------------------- 06 Overhead */

set("O", "06 Overhead containment", "H", "containment");
//! TWO RUNWAYS, one over each row, carried on trapeze hangers off the soffit.
//! A tray drawn at 2.6 m is a drawing; the hanger is what holds it there, and
//! it says what its rods will carry - so a 450 ladder full of copper on M8
//! drops is something the model objects to rather than something site finds.
const RUNWAY = [["A", 600], ["B", DEPTH * 2 + AISLE - DEPTH / 2]];
for (const [row, centre] of RUNWAY) {
  at("PTR" + row, "Runway " + row + " at", X0, centre - 225, TRAY_UNDER, "O",
     { z: ["X_TRAYZ", TRAY_UNDER] });
  add("RUN" + row, "CableTray", { name: "Runway over row " + row + " · 450 ladder",
    parent: "O", refs: { plane: "PL0", at: "PTR" + row, section: "SECTION" },
    wire: { length: ["X_RUNLEN", RACKS * PITCH + PITCH * 2] },
    args: { width: 450, profile: 6, pitch: 300, rung: 25,
            supplier: "runway, 450 mm ladder" } });
  at("PTH" + row, "Hangers " + row + " at", 0, centre - 350, SLAB, "O",
     { z: ["N_SLAB", SLAB] });
  add("HG" + row, "CeilingHanger", { name: "Trapeze · row " + row, parent: "O",
    refs: { plane: "PL0", at: "PTH" + row, section: "SECTION" },
    wire: { drop: ["X_DROP", SLAB - TRAY_UNDER] },
    args: { span: 700, rod: 2, profile: 6, load: 180,
            supplier: "M12 trapeze, 700 centres" } });
  add("HGS" + row, "Array", { name: "Trapezes · row " + row, parent: "O",
    refs: { source: "HG" + row },
    wire: { spacingX: ["X_HANGX", PITCH * 2] },
    args: { mode: 0, countX: 3, countY: 1, spacingY: 0, countZ: 1, spacingZ: 0 } });
}
expr("X_TRAYZ", "Runway underside (mm)", "" + TRAY_UNDER, {}, "O");
expr("X_RUNLEN", "Runway length (mm)", "a * b + b * 2",
     { a: ["N_RACKS", RACKS], b: ["N_PITCH", PITCH] }, "O");
expr("X_HANGX", "Trapeze pitch (mm)", "a * 2", { a: ["N_PITCH", PITCH] }, "O");

//! AND TRUNK CABLE ON IT, because an empty tray says nothing about whether the
//! tray is big enough. Each run leaves one row's manager, crosses the aisle
//! overhead and drops into the other - which is the run that decides the
//! runway's height, and the route node refuses a corner tighter than the
//! cable's own bend radius rather than drawing one.
set("W", "07 Trunk cable", "O", "cable");
//! WHERE A TRUNK ACTUALLY RUNS, and the first version of this did not. It
//! turned down INSIDE the racks - at y 980 of a rack 1200 deep - and hung
//! BELOW the runway rather than lying on it. Both look perfectly reasonable
//! from across the hall and neither is buildable, and neither was found by
//! looking: the Clash node found nine of them, 1.5 mm in, the first time it
//! was asked. So the drop is in the hot aisle 60 mm clear of each row's rear
//! face, and the run across sits ON the tray's rungs rather than under them.
const DROP_A = DEPTH + 60, DROP_B = DEPTH * 2 + AISLE - DEPTH - 60;
const ON_TRAY = TRAY_UNDER + 40;
[0, 1, 2].forEach(i => {
  const x = 400 + i * 700;
  at("WA" + i, "Trunk " + (i + 1) + " into row A", x, DROP_A, 1400, "W");
  at("WB" + i, "Trunk " + (i + 1) + " up", x, DROP_A, ON_TRAY, "W");
  at("WC" + i, "Trunk " + (i + 1) + " across", x, DROP_B, ON_TRAY, "W");
  at("WD" + i, "Trunk " + (i + 1) + " into row B", x, DROP_B, 1400, "W");
  add("RT" + i, "Route", { name: "Trunk " + (i + 1) + " route", parent: "W",
    refs: { through: ["WA" + i, "WB" + i, "WC" + i, "WD" + i] },
    args: { kind: 0, radius: 120 } });
  add("CB" + i, "Cable", { name: "Trunk " + (i + 1) + " · 24f OM4", parent: "W",
    refs: { route: "RT" + i },
    args: { cable: 2, startEnd: 2, endEnd: 2, supplier: "24-fibre OM4 trunk" } });
});

/* ----------------------------------------------------------- 07 Scale */

set("S", "07 Scale", "H", "figure");
//! THE ONE THING IN THE FILE THAT IS NOT DESIGNED, and the one that makes the
//! rest of it readable. 1.8 m to the top of the head, standing in the cold
//! aisle in front of row A facing the doors - which is where somebody working
//! on these racks stands, and is also the only aisle you can see into from
//! outside the hall. Put on the hot aisle's centreline first, which is the
//! corridor the two rows make, it was invisible from every view but the plan:
//! two rows of 2.1 m racks 1.2 m apart hide a person completely, which is
//! worth knowing about a hot aisle and is no use as a scale figure.
at("PTS", "Person at", PITCH * 1.5, -900, 0, "S",
   { y: ["X_COLD", -900] });
expr("X_COLD", "Cold aisle centreline (mm)", "-900", {}, "S");
add("PERSON", "ScaleFigure", { name: "Scale figure \u00b7 1.8 m", parent: "S",
  refs: { plane: "PL0", at: "PTS" }, wire: { height: ["N_PERSON", PERSON] },
  args: { turn: 0 } });

/* ------------------------------------------------------------- 09 Bill */

//! WHAT NOTHING ON SCREEN WILL TELL YOU. A rack whose legs are driven through
//! the floor panels looks exactly like a rack standing on them - the legs are
//! under the rack and the panels are under the legs and from any distance it is
//! a rack on a floor. That is what this is: the racks against the floor, the
//! racks against the overhead, and the person against the racks, checked by
//! geometry rather than by looking.
//!
//! BOXES, THEN SOLIDS. The box pass is instant and is exact here, because a
//! rack and a floor panel are both square to the axes; the solid pass is the
//! true answer and costs a boolean a pair, so it is only asked of the pairs the
//! boxes flagged. With the hall coordinated it asks nothing, because there are
//! none to ask about.
set("C", "08 Clash", "H", null);
add("CL_FLOOR", "Clash", { name: "The racks against the floor", parent: "C",
  refs: { a: "RK8", b: "FL" },
  args: { tolerance: 1, how: 1, budget: 200, show: 8 } });
add("CL_OVER", "Clash", { name: "The racks against the overhead", parent: "C",
  refs: { a: "RK8", b: "O" },
  args: { tolerance: 1, how: 1, budget: 200, show: 8 } });
add("CL_PERSON", "Clash", { name: "The person against the racks", parent: "C",
  refs: { a: "S", b: "RK8" },
  args: { tolerance: 1, how: 0, budget: 200, show: 8 } });

set("Z", "09 Bill of materials");
add("BOM", "Bill", { name: "Bill of materials · the hall", parent: "Z",
  refs: { of: "H" }, args: { show: 0 } });
add("BOM_RACK", "Bill", { name: "Bill of materials · one rack", parent: "Z",
  refs: { of: "RACK" }, args: { show: 0 } });

const model = { format: "ocaf-parametric-model", version: 1,
                name: "Data hall · double-loaded corridor", units: "mm",
                needs: ["rack", "harness"], features };

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

const began = Date.now();
const out = await mdl.run({ op: "model", model });
const rows = out.tree.features;
const bad = rows.filter(f => f.error);
console.log(features.length + " features · "
  + rows.filter(f => f.type === "GeometricalSet").length + " sets · built in "
  + ((Date.now() - began) / 1000).toFixed(1) + " s");
if (bad.length) {
  console.log("\n" + bad.length + " feature(s) in error:");
  for (const f of bad.slice(0, 20))
    console.log("   " + f.id + " (" + f.type + ") " + String(f.error).slice(0, 120));
  process.exit(1);
}

const bodyOf = id => kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
  .find(b => b.id === id);
const boxOf = id => { const b = bodyOf(id); return b ? kit.extents(b.shape) : null; };
const fail = why => { console.log("\n" + why + " - the sample is not written"); process.exit(1); };

//! READ OFF THE DOCUMENT AND NOT OFF bodies() OR THE TREE. Two things here are
//! invisible to both: a Part deliberately has no body in bodies() - its
//! contents are what is drawn, or an assembly would export twice - and a mesh
//! feature's vertices live in its data attribute, of which the tree carries a
//! one-line preview. Both are on the document, so the document is what is
//! asked.
const F = kit.F, doc = kit.doc();
const featureOf = id => doc.features().find(one => F.id(one) === id);
const shapeOf = id => { const f = featureOf(id); return f ? F.shape(f) : null; };
//! A feature's text as it stands NOW. `rows` is the tree from the first build
//! and does not move when something is dragged.
const tellOf = async id => {
  const answer = await kernel.tree();
  const row = (answer.tree || answer).features.find(one => one.id === id);
  return row && row.data ? row.data.preview : null;
};
const meshOf = id => {
  const f = featureOf(id);
  const data = f && F.data(f);
  return data && data.kind === "mesh" ? F.triples(data) : null;
};

//! ONE RACK, EIGHT PLACES. The claim this file makes is that the other seven
//! are the same geometry, and IsPartner is the question that settles it: two
//! shapes are partners when they share a TShape, whatever location each is at.
//! Counting solids or comparing bounding boxes would pass for eight copies.
{
  //! READ OFF THE DOCUMENT AND NOT OFF bodies(). A Part deliberately does not
  //! appear in bodies() - its contents are what is drawn, or an assembly would
  //! export twice - so the part's own compound has to be asked for directly.
  const F = kit.F, doc = kit.doc();
  const featureOf = id => doc.features().find(one => F.id(one) === id);
  const shapeOf = id => { const f = featureOf(id); return f ? F.shape(f) : null; };
  const rack = shapeOf("RACK"), one = shapeOf("IA1");
  if (!rack || !one) fail("the rack (" + !!rack + ") or its first instance ("
    + !!one + ") did not build");
  const same = one.IsPartner(rack);
  console.log("instance shares the rack's geometry: " + same
    + " \u00b7 " + kit.countSubShapes(rack, kit.SOLID) + " solids in the part");
  if (!same) fail("the instances are copies, not instances");
}

//! WHERE THE EIGHT RACKS ARE. Row A runs along +x from the origin; row B is
//! turned 180 about its own placement point, so it lands BEHIND that point -
//! and the check is that the two rows do not overlap and the aisle between them
//! is the aisle that was asked for.
{
  const rowA = boxOf("FRAME"), lastA = boxOf("IA" + (RACKS - 1)), rowB = boxOf("ROWB");
  console.log("row A  x " + rowA.low[0].toFixed(0) + ".." + lastA.high[0].toFixed(0)
    + "  y " + rowA.low[1].toFixed(0) + ".." + rowA.high[1].toFixed(0));
  console.log("row B  x " + rowB.low[0].toFixed(0) + ".." + rowB.high[0].toFixed(0)
    + "  y " + rowB.low[1].toFixed(0) + ".." + rowB.high[1].toFixed(0));
  const gap = rowB.low[1] - rowA.high[1];
  console.log("hot aisle between them: " + gap.toFixed(0) + " mm (asked for " + AISLE + ")");
  if (Math.abs(gap - AISLE) > 1) fail("the aisle is not the aisle that was asked for");
  //! And the two rows cover the same length of hall, or one row is short.
  if (Math.abs((lastA.high[0] - rowA.low[0]) - (rowB.high[0] - rowB.low[0])) > 1)
    fail("the two rows are not the same length");
}

//! THE PERSON IS THE HEIGHT ASKED FOR. A scale figure that is 1795 when 1800
//! was asked for is a decoration; this is the check that it is a ruler. Its
//! mesh is read off the built feature rather than off figure.js, so what is
//! measured is what is in the document.
{
  const points = meshOf("PERSON");
  if (!points || !points.length) fail("the scale figure built no mesh");
  const z = points.map(p => p[2]);
  const low = Math.min(...z), high = Math.max(...z);
  const wide = points.map(p => p[0]), deep = points.map(p => p[1]);
  console.log("scale figure " + (high - low).toFixed(2) + " mm tall, feet at "
    + low.toFixed(2) + " \u00b7 " + (Math.max(...wide) - Math.min(...wide)).toFixed(0)
    + " across, " + (Math.max(...deep) - Math.min(...deep)).toFixed(0) + " deep \u00b7 "
    + points.length + " vertices");
  if (Math.abs((high - low) - PERSON) > 0.01) fail("the scale figure is not the height asked for");
  if (Math.abs(low) > 0.01) fail("the scale figure is not standing on the floor");
}

//! THE FLOOR IS WHAT IT IS SOLD AS. A grate is bought against its open area and
//! the node computes that off the openings it cut - so the check is against the
//! catalogue figure, not against the node's own arithmetic.
{
  const grate = rows.find(one => one.id === "TG1");
  const said = String((grate.data || {}).preview || "");
  const got = /([\d.]+)% of the panel/.exec(said);
  const want = Math.round(FLOOR_TILES[2].open * 100);
  console.log("cold-aisle grate: " + (got ? got[1] : "?") + "% of the panel open (sold at "
    + want + "%)");
  if (!got || Math.abs(Number(got[1]) - want) > 2)
    fail("the grate does not open what it is sold as");
  //! AND THE FLOOR IS UNDER THE RACKS AND NOT THROUGH THEM. A panel's top is
  //! z = 0, which is the level everything else is dimensioned from.
  const field = boxOf("FS2");
  console.log("floor top at z " + field.high[2].toFixed(1) + ", understructure down to "
    + field.low[2].toFixed(0));
  if (Math.abs(field.high[2]) > 0.01) fail("the floor's top is not the finished floor level");
  if (Math.abs(field.low[2] + FFH) > 1) fail("the understructure is not the finished floor height");
}

//! AND THE RUNWAY IS CARRIED, not floating. The trapeze's channel has to be
//! under the tray and touching it, or the hanger is a decoration beside it.
{
  const tray = boxOf("RUNA"), hangers = boxOf("HGSA");
  console.log("runway underside " + tray.low[2].toFixed(1)
    + " · the hanger's bearing face " + TRAY_UNDER
    + " · hangers span z " + hangers.low[2].toFixed(1) + ".."
    + hangers.high[2].toFixed(0));
  if (Math.abs(tray.low[2] - TRAY_UNDER) > 0.5)
    fail("the runway is not sitting on its hangers");
  if (Math.abs(hangers.high[2] - SLAB) > 0.5) fail("the hangers do not reach the soffit");
  //! And the person fits under it, which is what the height is for.
  if (tray.low[2] < PERSON + 200) fail("the runway is lower than head height over the aisle");
}

//! THE PARAMETER REALLY DRIVES EIGHT RACKS. This is the measurement the file
//! exists for: change the ONE rack's height and every instance of it has to
//! move, because they are the same geometry. A model of eight copies passes
//! every check above and fails this one.
{
  const tall = () => ({ a: boxOf("FRAME").size[2], b: boxOf("ROWB").size[2] });
  const was = tall();
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: 24 });
  const half = tall();
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: UNITS });
  const back = tall();
  console.log("48U -> 24U -> 48U   rack A " + was.a.toFixed(0) + " -> " + half.a.toFixed(0)
    + " -> " + back.a.toFixed(0) + "   row B " + was.b.toFixed(0) + " -> "
    + half.b.toFixed(0) + " -> " + back.b.toFixed(0));
  if (Math.abs(half.a - rackHeight("eia310", 24)) > 1e-6) fail("rack A does not follow the height");
  if (!(half.b < was.b - 100)) fail("row B does not follow the rack it is an instance of");
  if (Math.abs(back.b - was.b) > 1e-6) fail("row B did not come back");
}

//! AND THE AISLE REALLY IS A PARAMETER. Widen it and row B moves; the racks do
//! not stretch and they do not overlap.
{
  await mdl.run({ op: "set", id: "N_AISLE", key: "value", value: 1800 });
  const gap = boxOf("ROWB").low[1] - boxOf("FRAME").high[1];
  await mdl.run({ op: "set", id: "N_AISLE", key: "value", value: AISLE });
  const back = boxOf("ROWB").low[1] - boxOf("FRAME").high[1];
  console.log("aisle 1200 -> 1800 -> 1200   measured " + gap.toFixed(0) + " -> "
    + back.toFixed(0));
  if (Math.abs(gap - 1800) > 1) fail("the aisle is not driving row B");
}

//! AND ONE SECTION DRIVES THE WHOLE HALL - eight frames, thirty-two braces and
//! two runways, from one feature.
{
  const wide = () => ({ brace: boxOf("BRACES").size[1], run: boxOf("RUNA").size[1] });
  const at40 = wide();
  await mdl.run({ op: "set", id: "SECTION", key: "profile", value: 3 });
  const at45 = wide();
  await mdl.run({ op: "set", id: "SECTION", key: "profile", value: 2 });
  const back = wide();
  console.log("one section, the whole hall   brace " + at40.brace.toFixed(1) + " -> "
    + at45.brace.toFixed(1) + " -> " + back.brace.toFixed(1)
    + "   runway " + at40.run.toFixed(1) + " -> " + at45.run.toFixed(1)
    + " -> " + back.run.toFixed(1));
  if (Math.abs(at40.brace - 40) > 0.01 || Math.abs(at45.brace - 45) > 0.01)
    fail("the section is not driving the bracing");
  if (!(at45.run > at40.run)) fail("the section is not driving the runway");
}

//! AND NOTHING IS INSIDE ANYTHING ELSE. This is the check the plinth exists for
//! and the one that would have caught its absence: built at z = 0 the rack's
//! four levelling feet stood 110 mm inside the floor panels, in all eight
//! racks, and it looked exactly like eight racks standing on a floor. Read off
//! the model's own Clash nodes rather than recomputed here, because a check
//! this script did for itself would say nothing about the file it writes.
{
  for (const id of ["CL_FLOOR", "CL_OVER", "CL_PERSON"]) {
    const said = String(await tellOf(id) || "");
    const line = said.split("\n").find(one => /clash|no interference/.test(one)) || said;
    console.log(id.padEnd(11) + line.trim());
    if (!/no interference/.test(said)) {
      console.log(said.split("\n").slice(0, 10).map(one => "   " + one).join("\n"));
      fail("the hall clashes with itself");
    }
  }
  //! AND THE CHECK IS NOT VACUOUS. A clash test that finds nothing because it
  //! looked at nothing passes every time, so the pair count says it looked.
  const looked = String(await tellOf("CL_FLOOR") || "");
  const pairs = /([\d,]+) pairs/.exec(looked);
  const many = pairs ? Number(pairs[1].replace(/,/g, "")) : 0;
  console.log("the floor check compared " + many.toLocaleString() + " pairs of solids");
  if (many < 1000) fail("the clash check is not looking at the model");

  //! AND IT REALLY WOULD FIND ONE. A check that cannot fail is not a check, so
  //! the rack is sunk 60 mm into the floor and the same node has to say so.
  //!
  //! NOT BY SETTING THE PLINTH TO ZERO, which was the first try and which found
  //! nothing - correctly. At a plinth of zero the frame's underside is exactly
  //! the finished floor and the panel's top is exactly the finished floor: they
  //! touch, and touching is not clashing. The original fault was not a plinth of
  //! zero, it was feet built DOWNWARDS from the frame into the floor; sinking
  //! the whole rack is the same interference and is a number this file has.
  await mdl.run({ op: "set", id: "N_PLINTH", key: "value", value: -60 });
  const dropped = String(await tellOf("CL_FLOOR") || "");
  await mdl.run({ op: "set", id: "N_PLINTH", key: "value", value: PLINTH });
  const back = String(await tellOf("CL_FLOOR") || "");
  const found = /(\d+) clash/.exec(dropped);
  console.log("sunk 60 mm into the floor: " + (found ? found[1] + " clashes" : "nothing found")
    + " \u00b7 back on its feet: "
    + (/no interference/.test(back) ? "clear" : "STILL CLASHING"));
  if (!found || Number(found[1]) < 8)
    fail("sinking the rack into the floor was not reported as a clash");
  if (!/no interference/.test(back)) fail("the hall did not come back clear");
}

const bom = rows.find(f => f.id === "BOM");
const one = rows.find(f => f.id === "BOM_RACK");
console.log("\none rack · " + String((one.data || {}).preview || "").split("\n").pop());
console.log("the hall · " + String((bom.data || {}).preview || "").split("\n").pop());

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("\nwrote " + OUT);
