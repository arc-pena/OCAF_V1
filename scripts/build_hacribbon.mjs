// Builds docs/data/samples/hac_ribbon.json - a floor-supported hot aisle
// containment ribbon.
//
//     node scripts/build_hacribbon.mjs
//
// WHAT THIS IS FOR, and it is the question after the corridor's. That one asks
// whether a parametric model can hold a ROOM of racks without becoming eight
// copies of one. This one asks whether it can hold the thing the racks go
// UNDER - which, on a real job, is the part that is actually engineered. Racks
// arrive on a pallet with a part number. The containment does not: it is steel
// somebody has to size, spaced at centres somebody has to choose, carrying
// trays, busway and pipework somebody has to coordinate, and it is where the
// drawings get argued about.
//
// WHAT A FLOOR-SUPPORTED HOT AISLE CONTAINMENT UNIT IS, as described to this
// repository by somebody who builds them:
//
//   "Several prefabricated modules connected together to create a data hall
//    ribbon that has about 40 racks on each side. Combination of GPU,
//    management, fiber patch racks with technical water supply return loop for
//    liquid cooling and powered by a bus duct system. Then racks go under the
//    hot aisle containment units. Plus several layers of cable trays for fiber
//    optic cables on the cold aisle side of the HAC and low voltage cable trays
//    for the hot aisle sides. One ribbon has 4-8 modules. HACs steel structure
//    is made from HSS sections about 6x6 square welded into truss frames.
//    Spacing of the structure is determined by number of racks and layers of
//    cable trays. Unistrut arms support the cable trays and bus duct systems."
//
// So the module is the component and the ribbon is a pattern of it. That is
// exactly what a Part and an Array are for, and it is what this file is: ONE
// module, parametric, and six instances of it. Inside that module the racks are
// themselves instances of three rack parts, so the file is two levels of
// instancing deep - edit one GPU rack and fifty-six of them change.
//
// AND NO RAISED FLOOR, which is a decision and not an omission. A
// floor-supported HAC is what you build on a SLAB: the columns go to the
// structural floor, the cooling comes over the top and the containment carries
// the services, which is the whole reason the structure is floor supported
// rather than hung. A raised-floor hall with underfloor supply is the corridor
// sample, and it has one. Putting a raised floor in here would also put a
// column through a floor panel at every frame, which the Clash node at the
// bottom of this file would then have to be told to ignore.
//
// THE SHAPE OF IT:
//
//   00 Parameters   the hall, over which everything else is written: rack
//                   pitch and depth, aisle, module length, frames a module,
//                   tray layers, clear height, truss depth.
//   01 Reference    the planes. Five of them, because which way a member runs
//                   is which plane it is given.
//   02 Module       THE module - seven Parts, and the only thing in the file that
//                   is designed. Seven rather than one because that is how a
//                   prefabricated module arrives (the steel, the arms, the
//                   trays, the busway, the pipework, the deck and the racks are
//                   seven packages from seven suppliers) and because an instance
//                   is ONE body wearing ONE colour - a module instanced whole
//                   puts six sevenths of the ribbon in flat grey:
//                     01 Steel        two HSS 6x6 portal trusses and the
//                                     longitudinal ties that make a ribbon
//                     02 Arms         twelve Unistrut cantilever arms, each
//                                     saying what it will hold at its reach
//                     03 Cable trays  three fibre layers on each cold side,
//                                     two low-voltage layers on each hot side
//                     04 Bus duct     a busway over each row with its tap-offs
//                     05 Water        the technical supply and return mains
//                     06 Containment  the aisle roof
//                     07 Racks        three rack parts - GPU, management,
//                                     fibre patch - and nine instances
//   03 Ribbon       six instances of the module, and a door at each end of
//                   the aisle - an aisle open at the ends is not contained
//   04 Slab         the floor it all stands on
//   05 Scale        two people, because the point of a HAC is how big it is
//   06 Clash        the racks against the steel, the racks against the
//                   services, and the module against its neighbours
//   07 Bill         read off the model
//
// WHAT IS NOT A CATALOGUE NUMBER. The HSS is AISC, at its design wall, and the
// pipe is ASME B36.10M - both are published dimensional standards and the nodes
// name them. The busway housing is a size set on the feature, because busway
// sections are a manufacturer's and this repository ships nobody's catalogue.
// The arms' capacity is an engineer's one-over-the-reach rule from a stated
// capacity at a stated reach, said to be one on the feature itself. Nothing
// here carries a part number that was not given to this repository.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { PluginHost } from "../docs/src/plugin.js";
import { RACK } from "../docs/src/rack-plugin.js";
import { PIPES, STRUT_PROFILES, finishOf, pipeDuty, rackHeight } from "../docs/src/rack.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "data", "samples", "hac_ribbon.json");
const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";

/* ===================================================== the numbers it is of */

const U = 44.45;
const UNITS = 48;                 // rack height in U
const DEPTH = 1200;               // rack depth
const PITCH = 600;                // rack pitch, and the module grid
const AISLE = 1200;               // the contained hot aisle, clear
const PLINTH = 100;               // the rack stands on its levelling feet
const MODULES = 7;                // modules in the ribbon - the brief says 4-8
const BAYS = 8;                   // 600 bays in one module
const FBAYS = 4;                  // bays between truss frames
const MOD = BAYS * PITCH;         // 4800 - one prefabricated module
const RIBBON = MODULES * MOD;     // 33600 - the whole ribbon
const FRAME_PITCH = FBAYS * PITCH;
const FIBRE = 3;                  // fibre tray layers on each cold side
const LV = 2;                     // low voltage tray layers on each hot side
const CLEAR = 3000;               // to the underside of the bottom chord
const TDEPTH = 700;               // truss depth
const SOFFIT = 6000;             // the hall's soffit - reported, nothing hangs from it
const HSS = STRUT_PROFILES[11].w; // 152.4 - the HSS 6 x 6 envelope

//! WHICH BAYS HOLD A RACK, and this is the arithmetic the brief asks for. A
//! column is 152.4 square on the rack row's own centreline, so the bay it stands
//! in cannot also hold a 595 rack: a frame costs a rack. Bays 1 and 5 of every
//! module are column bays and the other six are racks, which over seven modules
//! is 42 a side - "about 40 on each side", and the file measures it rather than
//! asserting it.
//!
//! AND 1 AND 5 RATHER THAN 0 AND 4 so that the ribbon is not lopsided: with the
//! columns 4 bays apart and 8 bays in a module, the two ends of a ribbon are
//! 900 and 1500 from their nearest frame this way and 300 and 2100 the other.
const COL_BAYS = [1, 5];
const RACK_BAYS = [0, 2, 3, 4, 6, 7];
const RACKS_SIDE = MODULES * RACK_BAYS.length;

//! THE DATUM IS THE FRONT OF ROW A, which is not a free choice: a rack part is
//! built with its front face at its own y = 0 and its depth running to +y, so
//! the row it stands in has to start there too. Laid out about the aisle
//! instead - which the first draft did - every rack in row A was placed at y 0
//! to 1200, which IS the hot aisle, and eighty-four racks stood in the
//! containment they were supposed to be outside of.
//!
//!   row A   y 0 .. DEPTH
//!   aisle   y DEPTH .. DEPTH + AISLE      <- what the HAC contains
//!   row B   y DEPTH + AISLE .. 2 DEPTH + AISLE, turned 180
const AISLE0 = DEPTH;             // where the contained aisle starts
const COLA = DEPTH / 2;           // row A's column line: the row's mid depth
const COLB = AISLE + DEPTH * 1.5; // row B's
const SPAN = COLB - COLA;         // column to column across the aisle

//! THE ARMS, AND WHAT IS ON EACH ONE. Three layers on the cold side and three
//! on the hot - two trays and the busway - on a 240 pitch starting at 2300,
//! which is what fits: the rack tops are at 2233.6 and the bottom chord's
//! underside is at 3000, so everything the arms carry lives in 766 mm.
const ARM0 = 2300;
const ARMGAP = 240;
const ARM_Z = n => ARM0 + n * ARMGAP;
//! The channel's half depth, which is how far above an arm's own centreline the
//! thing it carries sits. The arms are P1000 41.3 square and the trays bear on
//! the arm's top face, so this is 41.3 / 2 and not a fudge factor.
const ARM_H2 = STRUT_PROFILES[5].h / 2;
//! AN ARM REACHES FROM THE COLUMN FACE, not from its centreline, and the back
//! plate it bolts on with is in front of that again. 76.2 of HSS and 8 of plate
//! is the offset, and it is worth having right: measured from the centreline the
//! whole services zone sits 84 mm in, which nothing on screen shows and which is
//! most of a tray rail.
const ARM_PLATE = 8;
const ARM_OFF = HSS / 2 + ARM_PLATE;
const FIBRE_REACH = 625;          // cold side: out over the rack front
const LV_REACH = 825;             // hot side: in over the aisle edge
const TRAY_W = 300;
//! WHERE EACH THING SITS ACROSS THE RIBBON, as one formula each rather than one
//! per use. `out` is which way is outboard for that row - -1 for row A, +1 for
//! row B - and every arm, tray and busway position is written off it. The busway
//! rides over the low voltage trays on the arm above them, so its centreline and
//! the tray's near edge are the same number: worked out twice, the first time,
//! they came out 300 apart and the busway hung over the aisle on nothing.
const ARM_Y = (colY, out, cold) => colY + (cold ? out : -out) * ARM_OFF;
const FIBRE_EDGE = (colY, out) =>
  ARM_Y(colY, out, true) + out * FIBRE_REACH - (out < 0 ? 0 : TRAY_W);
const LV_EDGE = (colY, out) =>
  ARM_Y(colY, out, false) - out * LV_REACH - (out > 0 ? 0 : TRAY_W);
const BUS_W = 130, BUS_H = 160;
const ROOF = 2990, ROOF_T = 10;   // the aisle roof, tight under the bottom chord

//! THE TECHNICAL WATER, over the top of the truss on cross bearers rather than
//! inside the aisle. Two reasons, and both are the kind that only show up in a
//! model: a main inside a sealed hot aisle has to be got at with the aisle
//! open, and a main hung under the bottom chord puts its hanger rods straight
//! through the containment roof. On top of the top chord it is carried by the
//! thing that is already there and nothing is penetrated.
const BEARER_Z = CLEAR + TDEPTH + STRUT_PROFILES[6].w / 2;
const PIPE_R = PIPES[5].od / 2;   // DN250
const LAG = 25;
const PIPE_Z = BEARER_Z + STRUT_PROFILES[6].w / 2 + PIPE_R + LAG;
const SUPPLY_Y = 400, RETURN_Y = 800;
const PIPE_V = 1.8, PIPE_DT = 15;
//! WHAT THE LOOP IS SIZED FOR, said out loud because it is the one number on
//! this file a reader will want to argue with. DN250 at 1.8 m/s and a 15 K rise
//! is about 5.7 MW, which over eighty-four racks is about 68 kW a rack - a
//! plausible direct-to-chip duty today and nowhere near the top of the range. A
//! hall of 130 kW racks needs a pair of mains a module rather than a pair a
//! ribbon, and it is the node's own report that says so, not this comment.

const COLUMN = 465.1;             // EIA-310-E between hole columns, as printed
const FLANGE = 50;
const PANEL_IN = (482.6 - COLUMN) / 2;
const POST_X = [40, 40 + COLUMN];
const PANEL_X = POST_X[0] + FLANGE / 2 - PANEL_IN;
const RACK_W = 595.1;
const FOOT_IN = 60;

//! WHAT FILLS EACH RACK, AND EACH ONE HAS ITS OWN. A management cabinet is 1U
//! servers and a GPU rack is 4U trays, and wiring both stacks to one height -
//! which the first draft of this did - gives a management rack full of 4U "1U
//! servers". So the stack is a pair of numbers each rack owns, and everything
//! above the stack is computed off that pair.
//! AND HOW MANY OF THEM THERE ARE IS NOT A NUMBER EITHER - it is what fits.
//! Written down as ten, a 48U rack's stack of ten 4U trays stays ten when the
//! rack is dragged to 24U and four of them stand in the air above the frame,
//! which from across a hall is a rack. So the count is the height less what the
//! switches and the PDU above it reserve, divided by the tray, and a rack fills
//! itself.
const FIRST_U = 3;
const STACKS = { GPU: { high: 4, reserve: 5 },
                 MGT: { high: 1, reserve: 6 },
                 FIB: { high: 1, reserve: 5 } };
const stackCount = (id, units = UNITS) =>
  Math.max(1, Math.floor((units - FIRST_U + 1 - STACKS[id].reserve) / STACKS[id].high));
const freeU = (id, units = UNITS) => FIRST_U + stackCount(id, units) * STACKS[id].high;
const PERSON = 1727, PERSON2 = 1650;

const features = [];
//! A MODEL FILE SAYS A REFERENCE INSIDE args, as { ref: "ID" }; a number driven
//! by another number is { value, from }. The `refs` shorthand belongs to the add
//! OP and a file that uses it has its wires silently dropped.
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

add("H", "GeometricalSet", { name: "Data hall ribbon · floor-supported hot aisle containment" });
set("P", "00 Parameters");
num("N_MODULES", "Modules in the ribbon", MODULES, "P");
num("N_BAYS", "Bays a module", BAYS, "P");
num("N_FBAYS", "Bays between frames", FBAYS, "P");
num("N_PITCH", "Rack pitch", PITCH, "P");
num("N_DEPTH", "Rack depth", DEPTH, "P");
num("N_AISLE", "Hot aisle, clear", AISLE, "P");
num("N_UNITS", "Rack height", UNITS, "P");
num("N_PLINTH", "Rack on its feet", PLINTH, "P");
num("N_CLEAR", "Clear under the truss", CLEAR, "P");
num("N_TDEPTH", "Truss depth", TDEPTH, "P");
num("N_FIBRE", "Fibre tray layers a side", FIBRE, "P");
num("N_LV", "Low voltage tray layers a side", LV, "P");
num("N_SOFFIT", "Hall soffit", SOFFIT, "P");
num("N_FIRST", "First device at", FIRST_U, "P");
//! ONE PAIR OF NUMBERS A RACK, and the pitch and the first free U written off
//! them. Change "how many" and the stack grows and everything above it rides
//! up; change "each" and the pitch follows. Two numbers and two expressions a
//! rack, and a rack is filled.
for (const [kind, one] of Object.entries(STACKS)) {
  num("N_" + kind + "U", kind + " stack \u00b7 each (U)", one.high, "P");
  expr("X_" + kind + "MM", kind + " stack pitch (mm)", "a * 44.45",
       { a: ["N_" + kind + "U", one.high] }, "P");
  expr("X_" + kind + "N", kind + " stack \u00b7 how many fit",
       "Math.max(1, Math.floor((a - b + 1 - " + one.reserve + ") / c))",
       { a: ["N_UNITS", UNITS], b: ["N_FIRST", FIRST_U],
         c: ["N_" + kind + "U", one.high] }, "P");
  expr("X_" + kind + "FREE", kind + " first free U", "a + b * c",
       { a: ["N_FIRST", FIRST_U], b: ["X_" + kind + "N", stackCount(kind)],
         c: ["N_" + kind + "U", one.high] }, "P");
}
num("N_PERSON", "Person", PERSON, "P");
num("N_PERSON2", "Second person", PERSON2, "P");

//! THREE SECTIONS FOR THE WHOLE RIBBON, and this is the feature that makes the
//! file a model rather than a drawing. The HAC section drives fifteen portal
//! trusses and every longitudinal tie; the arm section drives every one of the
//! eighty-four cantilever arms and is what their capacity is computed from; the
//! rack section drives eighty-four rack frames. Three features.
add("HACSEC", "StrutSection", { name: "HAC steel · HSS 6 × 6 × 1/4",
  parent: "P", args: { profile: 11 } });
add("ARMSEC", "StrutSection", { name: "Arms · strut channel 41 × 41",
  parent: "P", args: { profile: 5 } });
add("TRAYSEC", "StrutSection", { name: "Tray rails and pipe bearers · channel 41 × 21",
  parent: "P", args: { profile: 6 } });
add("RACKSEC", "StrutSection", { name: "Rack frames · T-slot 40 × 40",
  parent: "P", args: { profile: 2 } });

expr("X_MOD", "Module length (mm)", "a * b",
     { a: ["N_BAYS", BAYS], b: ["N_PITCH", PITCH] }, "P");
expr("X_RIBBON", "Ribbon length (mm)", "a * b * c",
     { a: ["N_MODULES", MODULES], b: ["N_BAYS", BAYS], c: ["N_PITCH", PITCH] }, "P");
expr("X_FRAMEP", "Frame centres (mm)", "a * b",
     { a: ["N_FBAYS", FBAYS], b: ["N_PITCH", PITCH] }, "P");
//! WHAT THE BRIEF ASKS FOR, WRITTEN DOWN: "spacing of the structure is
//! determined by number of racks and layers of cable trays". More layers is
//! more load on the arms and more load at the column head, so the frames come
//! closer. Twenty over the layer count, in bays, floored at two - a rule of
//! this file, stated as one, and not a code clause.
expr("X_FBAYS_WANT", "Bays between frames, for the layers",
     "Math.max(2, Math.round(20 / (a + b)))",
     { a: ["N_FIBRE", FIBRE], b: ["N_LV", LV] }, "P");
expr("X_FRAMES", "Frames in the ribbon", "a * b / c + 1",
     { a: ["N_MODULES", MODULES], b: ["N_BAYS", BAYS], c: ["N_FBAYS", FBAYS] }, "P");
expr("X_RACKS", "Racks a side", "a * (b - b / c)",
     { a: ["N_MODULES", MODULES], b: ["N_BAYS", BAYS], c: ["N_FBAYS", FBAYS] }, "P");
expr("X_SPAN", "Truss span (mm)", "a + b",
     { a: ["N_AISLE", AISLE], b: ["N_DEPTH", DEPTH] }, "P");
expr("X_PANELS", "Truss panels", "Math.max(2, Math.round((a + b) / 600))",
     { a: ["N_AISLE", AISLE], b: ["N_DEPTH", DEPTH] }, "P");
expr("X_RACKTOP", "Rack top (mm)", "a * 44.45 + b",
     { a: ["N_UNITS", UNITS], b: ["N_PLINTH", PLINTH] }, "P");
//! AND THE HEADROOM UNDER THE TRUSS, which is the number this whole arrangement
//! lives or dies by: everything the arms carry has to fit between the rack tops
//! and the bottom chord, and a model that does not compute that gap is a model
//! that finds out on site.
expr("X_GAP", "Services zone (mm)", "c - (a * 44.45 + b)",
     { a: ["N_UNITS", UNITS], b: ["N_PLINTH", PLINTH], c: ["N_CLEAR", CLEAR] }, "P");
expr("X_COLB", "Row B column line (mm)", "a + b * 1.5",
     { a: ["N_AISLE", AISLE], b: ["N_DEPTH", DEPTH] }, "P");
expr("X_ROWB", "Row B datum (mm)", "a + b * 2",
     { a: ["N_AISLE", AISLE], b: ["N_DEPTH", DEPTH] }, "P");
expr("X_AISLE0", "Contained aisle starts at (mm)", "a", { a: ["N_DEPTH", DEPTH] }, "P");

/* ------------------------------------------------------------- 01 Reference */

set("R", "01 Reference");
at("PT0", "Hall origin", 0, 0, 0, "R");
add("VZ", "Vector", { name: "Up", parent: "R", args: { dx: 0, dy: 0, dz: 1 } });
add("PL0", "Plane", { name: "Slab", parent: "R", refs: { origin: "PT0", normal: "VZ" } });
//! A Strut runs along its plane's NORMAL, so a member along the ribbon is given
//! the plane across it and a member across the ribbon is given the plane along.
add("VX", "Vector", { name: "Along the ribbon", parent: "R", args: { dx: 1, dy: 0, dz: 0 } });
add("PLX", "Plane", { name: "Along the ribbon", parent: "R",
  refs: { origin: "PT0", normal: "VX" } });
add("VY", "Vector", { name: "Across the ribbon", parent: "R", args: { dx: 0, dy: 1, dz: 0 } });
add("PLY", "Plane", { name: "Across the ribbon", parent: "R",
  refs: { origin: "PT0", normal: "VY" } });
add("VYB", "Vector", { name: "Out the rack front", parent: "R", args: { dx: 0, dy: -1, dz: 0 } });
add("PLYB", "Plane", { name: "Out the rack front", parent: "R",
  refs: { origin: "PT0", normal: "VYB" } });
//! AND ROW B's PLACEMENT DATUMS LIVE OUT HERE, which looks like tidiness and is
//! not. A part is a BODY as well as a folder, and its body is the compound of
//! everything filed in it - a point included, because a point is a vertex. An
//! instance turned 180 is placed by a point beyond the far end of what it
//! places, so a module 4800 long with those datums inside it has a bounding box
//! 9000 long, and a bounding box is what the viewer frames the model with and
//! what a clash check reaches for first. Outside the part they place the same
//! racks and measure nothing.
set("RP", "Row B placement datums", "R");

/* ---------------------------------------------------------------- 02 Module */

//! SEVEN PARTS AND NOT ONE, which is a decision about how the thing is
//! DELIVERED as much as about how it is drawn. A prefabricated containment
//! module does not arrive as one object: the steel is one package, the arms
//! another, the trays, the busway, the pipework, the deck and the racks are
//! five more, from five suppliers, on five lorries. So each is its own
//! component, each is instanced down the ribbon on its own, and a bill can ask
//! for any one of them.
//!
//! AND IT IS ALSO WHAT MAKES THE RIBBON READABLE. An instance is ONE body and
//! wears ONE colour, because what it hands on is its part's whole compound -
//! so a module instanced as a single part is a single grey object however
//! carefully the inside of it was coloured, and six sevenths of this file
//! would be grey. Seven parts is seven colours, and the scheme runs the whole
//! 33.6 m.
set("MOD8", "02 Module · the one parametric containment unit");
set("M", "Module 1", "MOD8");

/* ------------------------------------------------------- the steel it is of */

add("MS", "Part", { name: "01 Steel", parent: "M", appearance: finishOf("frame") });
//! TWO PORTAL TRUSSES A MODULE, at the bays the rack layout leaves for them.
//! The column line is the rack row's own mid depth, so the truss spans from
//! inside row A to inside row B and the racks stand UNDER it - which is the
//! sentence in the brief that decides the whole geometry.
//! AND A COLUMN STANDS IN THE MIDDLE OF A BAY, not on the line between two. A
//! 152.4 column centred on a bay boundary reaches 76 mm into the bays either
//! side of it, and a 595.1 rack in a 600 bay has 4.9 mm to give: centred on the
//! boundary the column is 71 mm inside the neighbouring rack, which reads as a
//! column beside a rack from every angle and is what the clash check found.
//! Centred in the bay it costs that one bay and nothing else.
[["TF1", (COL_BAYS[0] + 0.5) * PITCH, "at the head bay"],
 ["TF2", (COL_BAYS[1] + 0.5) * PITCH, "mid module"]].forEach(([id, x, where], i) => {
  at("PT" + id, "Truss " + (i + 1) + " " + where, x, COLA, 0, "MS",
     i ? { x: ["X_FRAME2", (COL_BAYS[1] + 0.5) * PITCH], y: ["X_COLA", COLA] }
       : { x: ["X_FRAME1", (COL_BAYS[0] + 0.5) * PITCH], y: ["X_COLA", COLA] });
  add(id, "TrussFrame", { name: "Portal truss " + (i + 1) + " · " + where, parent: "MS",
    refs: { plane: "PL0", at: "PT" + id, section: "HACSEC" },
    wire: { span: ["X_SPAN", SPAN], clear: ["N_CLEAR", CLEAR],
            depth: ["N_TDEPTH", TDEPTH], panels: ["X_PANELS", Math.round(SPAN / 600)] },
    args: { web: 0, profile: 11, legs: 0, plate: 500,
            supplier: "portal truss, shop welded, HSS 6×6×1/4" } });
});
expr("X_COLA", "Row A column line (mm)", "a / 2", { a: ["N_DEPTH", DEPTH] }, "MS");
expr("X_FRAME1", "Head truss at (mm)", "a * " + (COL_BAYS[0] + 0.5),
     { a: ["N_PITCH", PITCH] }, "MS");
expr("X_FRAME2", "Second truss at (mm)", "a * " + (COL_BAYS[1] + 0.5),
     { a: ["N_PITCH", PITCH] }, "MS");

//! AND WHAT MAKES IT A RIBBON RATHER THAN A ROW OF PORTALS: a longitudinal tie
//! on the outboard face of each column line, one length per module, bolted end
//! to end at the module joints. Outboard of the column face on purpose - a tie
//! on the centreline would run through the columns and through the web, which
//! is a clash in the model and a detail nobody can weld on site.
[["TIE_A", COLA - HSS, "row A"], ["TIE_B", COLB + HSS, "row B"]].forEach(([id, y, row]) => {
  at("PT" + id, "Tie, " + row, 0, y, CLEAR + TDEPTH / 2, "MS",
     { z: ["X_TIEZ", CLEAR + TDEPTH / 2] });
  add(id, "Strut", { name: "Longitudinal tie · " + row, parent: "MS",
    refs: { plane: "PLX", at: "PT" + id, section: "HACSEC" },
    wire: { length: ["X_MOD", MOD] },
    args: { profile: 11, holes: 0, supplier: "tie beam, HSS 6×6×1/4, bolted splice" } });
});
//! MIDWAY UP THE TRUSS, and that is a section change waiting to happen rather
//! than an aesthetic. Put level with the bottom chord - where it looks right -
//! the tie's underside is the chord's underside only while the section is the
//! section it was drawn for: switch the hall to HSS 8 and a 203 tie hangs 25 mm
//! below the chord and through the aisle roof. Between the chords it grows both
//! ways into a gap that grows with it.
expr("X_TIEZ", "Tie centreline (mm)", "a + b / 2",
     { a: ["N_CLEAR", CLEAR], b: ["N_TDEPTH", TDEPTH] }, "MS");

/* ------------------------------------------------------------- the arms */

//! TWELVE CANTILEVER ARMS A MODULE, in strut channel, each one arrayed onto the
//! module's second frame - so twenty-four arms from twelve features, and
//! eighty-four across the ribbon from the same twelve.
//!
//! AND EACH ONE IS HANDED. A plane's frame only ever points its y one way;
//! there is no normal that turns it round while leaving z up. So the arms on a
//! column's far side are the same feature with `hand` set, which is what a
//! left-hand bracket is in a catalogue too.
add("MA", "Part", { name: "02 Unistrut arms", parent: "M", appearance: finishOf("frame") });
const ARMS = [];
[["A", COLA, 0], ["B", COLB, 1]].forEach(([row, colY, flip]) => {
  //! THE COLD SIDE: fibre, out over the rack fronts. Row A's cold side is -y
  //! and row B's is +y, which is the whole reason `hand` exists.
  const out = flip ? 1 : -1;
  for (let n = 0; n < FIBRE; n++)
    ARMS.push([row + "F" + n, ARM_Y(colY, out, true), ARM_Z(n), FIBRE_REACH,
               flip ? 0 : 1, "fibre tray " + (n + 1), 45]);
  //! THE HOT SIDE: low voltage, in over the aisle edge, and the busway on the
  //! arm above them. A longer reach and so a smaller capacity, which is the
  //! only question an arm is chosen by and is why the load is stated.
  for (let n = 0; n < LV; n++)
    ARMS.push([row + "L" + n, ARM_Y(colY, out, false), ARM_Z(n), LV_REACH,
               flip ? 1 : 0, "low voltage tray " + (n + 1), 40]);
  ARMS.push([row + "B", ARM_Y(colY, out, false), ARM_Z(LV), LV_REACH,
             flip ? 1 : 0, "busway", 45]);
});
for (const [key, armY, z, reach, hand, carries, load] of ARMS) {
  at("PTAR" + key, "Arm " + key + " at", (COL_BAYS[0] + 0.5) * PITCH, armY, z, "MA",
     { x: ["X_FRAME1", (COL_BAYS[0] + 0.5) * PITCH] });
  add("AR" + key, "StrutArm", { name: "Arm · " + carries, parent: "MA",
    refs: { plane: "PL0", at: "PTAR" + key, section: "ARMSEC" },
    args: { reach, profile: 5, brace: 0, load, hand,
            supplier: "cantilever arm, channel, braced" } });
  add("AS" + key, "Array", { name: "Arms · " + carries + " · both frames", parent: "MA",
    refs: { source: "AR" + key },
    wire: { spacingX: ["X_FRAMEP", FRAME_PITCH] },
    args: { mode: 0, countX: 2, countY: 1, spacingY: 0, countZ: 1, spacingZ: 0 } });
}

/* ------------------------------------------------------- the cable trays */

//! THE TRAYS THE BRIEF ASKS FOR, and which side each layer is on is the design
//! decision rather than the drafting: fibre on the cold aisle side, where it is
//! reached from the aisle people stand in, and low voltage on the hot aisle
//! side, where the power tails are. A tray bears on its UNDERSIDE, so its
//! height is the arm's own top face and there is no correction anywhere.
add("MT", "Part", { name: "03 Cable trays", parent: "M", appearance: finishOf("containment") });
const TRAYS = [];
[["A", COLA, -1], ["B", COLB, 1]].forEach(([row, colY, out]) => {
  for (let n = 0; n < FIBRE; n++)
    TRAYS.push([row + "F" + n, FIBRE_EDGE(colY, out),
                ARM_Z(n) + ARM_H2, "Fibre · row " + row + " · layer " + (n + 1),
                "fibre runway, 300 ladder"]);
  for (let n = 0; n < LV; n++)
    TRAYS.push([row + "L" + n, LV_EDGE(colY, out),
                ARM_Z(n) + ARM_H2, "Low voltage · row " + row + " · layer " + (n + 1),
                "low voltage tray, 300 ladder"]);
});
for (const [key, y, z, name, supplier] of TRAYS) {
  at("PTT" + key, name + " at", 0, y, z, "MT");
  add("TR" + key, "CableTray", { name, parent: "MT",
    refs: { plane: "PL0", at: "PTT" + key, section: "TRAYSEC" },
    wire: { length: ["X_MOD", MOD] },
    args: { width: TRAY_W, profile: 6, pitch: 300, rung: 25, supplier } });
}

/* ------------------------------------------------------------ the busway */

//! POWERED BY A BUS DUCT SYSTEM, one run over each row on the top hot-side arm.
//! What the node models is where the TAP-OFF BOXES land, because that is the
//! thing that decides whether a rack can be fed: a rack that does not sit under
//! one has to be fed from somewhere else, and on a 600 pitch with a tap every
//! 600 that is a question with an answer.
add("MB", "Part", { name: "04 Bus duct", parent: "M", appearance: finishOf("power") });
[["A", LV_EDGE(COLA, -1) + TRAY_W / 2, "row A"],
 ["B", LV_EDGE(COLB, 1) + TRAY_W / 2, "row B"]].forEach(([row, y, which]) => {
  at("PTBD" + row, "Busway " + which + " at", 0, y, ARM_Z(LV) + ARM_H2 + BUS_H / 2, "MB");
  add("BD" + row, "BusDuct", { name: "Busway · " + which, parent: "MB",
    refs: { plane: "PL0", at: "PTBD" + row },
    wire: { length: ["X_MOD", MOD], pitch: ["N_PITCH", PITCH] },
    args: { width: BUS_W, height: BUS_H, tap: 240, joint: MOD, rating: "1600 A",
            supplier: "sandwich busway, 1600 A" } });
});

/* ------------------------------------------------------ the technical water */

add("MW", "Part", { name: "05 Technical water", parent: "M", appearance: finishOf("water") });
//! CROSS BEARERS ON TOP OF THE TOP CHORD, one over each frame, and the mains
//! resting on them. The bearer spans the truss, so the mains can sit anywhere
//! across it without another member being added.
at("PTBR", "Bearer at", (COL_BAYS[0] + 0.5) * PITCH, COLA, BEARER_Z, "MW",
   { x: ["X_FRAME1", (COL_BAYS[0] + 0.5) * PITCH], y: ["X_COLA", COLA] });
add("BR", "Strut", { name: "Pipe bearer · over the truss", parent: "MW",
  refs: { plane: "PLY", at: "PTBR", section: "TRAYSEC" },
  wire: { length: ["X_SPAN", SPAN] },
  args: { profile: 6, holes: 0, supplier: "cross bearer, channel, over the top chord" } });
add("BRS", "Array", { name: "Pipe bearers · both frames", parent: "MW",
  refs: { source: "BR" },
  wire: { spacingX: ["X_FRAMEP", FRAME_PITCH] },
  args: { mode: 0, countX: 2, countY: 1, spacingY: 0, countZ: 1, spacingZ: 0 } });
//! THE SUPPLY AND THE RETURN, DN200 insulated, branched between the frames. The
//! branch pitch is the frame pitch with a half-pitch setback, so every tee
//! lands midway between two trusses rather than inside one - which is where a
//! branch can actually be made up, and is a thing a model can be asked and a
//! drawing cannot.
[["PS", SUPPLY_Y, "Supply", "technical water supply main"],
 ["PR", RETURN_Y, "Return", "technical water return main"]].forEach(([id, y, which, supplier]) => {
  at("PT" + id, which + " main at", 0, AISLE0 + y, PIPE_Z, "MW");
  add(id, "PipeRun", { name: which + " main · DN250", parent: "MW",
    refs: { plane: "PL0", at: "PT" + id },
    wire: { length: ["X_MOD", MOD], pitch: ["X_FRAMEP", FRAME_PITCH] },
    args: { size: 5, schedule: 0, insulation: LAG, branch: 2,
            velocity: PIPE_V, rise: PIPE_DT, supplier } });
});

/* ------------------------------------------------------- the containment */

//! AND THE THING IT IS ALL CALLED AFTER. Without the roof the steel is a
//! gantry: the aisle is contained by a deck tight under the bottom chord and a
//! door at each end of the ribbon, and that is what separates the hot air from
//! the cold. Tight under the chord rather than level with it, so the deck bears
//! on the steel instead of being inside it.
add("MR", "Part", { name: "06 Containment", parent: "M", appearance: finishOf("enclosure") });
at("PTRF", "Roof at", 0, AISLE0, ROOF, "MR", { y: ["X_AISLE0", AISLE0] });
add("RF", "Cube", { name: "Aisle roof · deck", parent: "MR",
  refs: { origin: "PTRF", plane: "PL0" },
  wire: { dx: ["X_MOD", MOD], dy: ["N_AISLE", AISLE] },
  args: { dz: ROOF_T } });

/* ----------------------------------------------------------- the racks */

//! WHICH RACK STANDS IN WHICH BAY. Six racks a side a module: the fibre patch
//! frame at the head where the trays come down, four GPU racks, and the
//! management cabinet at the tail. HOME says where each design is DRAWN - the
//! part is a rack and not a template filed off to one side - and everything else
//! in the mix is an instance of it.
const MIX = { 0: "FIB", 2: "GPU", 3: "GPU", 4: "GPU", 6: "GPU", 7: "MGT" };
const HOME = { FIB: 0, GPU: 2, MGT: 7 };

add("MK", "Part", { name: "07 Racks", parent: "M" });
set("MKD", "01 Designs", "MK");

//! THREE RACK PARTS AND NINE INSTANCES, which is twelve racks a module and
//! eighty-four across the ribbon - from three designs. Each part is drawn where
//! the first of its kind stands, so the part IS a rack rather than a template
//! filed somewhere off to one side.
//!
//! AND THE POSTS ARE NOT PUNCHED HERE. A 48U post carries 288 square holes and
//! four of them carry 1,152; eighty-four racks of that is most of a million
//! triangles spent on holes nobody can see from the far end of a 33 m ribbon.
//! The punched post, the cage nuts and the perforated door at full size are in
//! the hyperstack sample, which is the file that is about a rack. This one is
//! about what the racks go under, and says so.
//! A RACK DESIGN, DRAWN WHERE THE FIRST OF ITS KIND STANDS. Not off to one side
//! and not all three at the origin, which is what the first draft did: three
//! racks on top of each other in the bay the column stands in, sixty clashes
//! deep, and from the outside of the ribbon it looked like one rack.
//!
//! EVERY POINT IN IT IS WIRED TO THE SAME BAY. A rack does not stretch with the
//! pitch - a 595 rack in a 700 bay is still 595 - but it does MOVE with it, and
//! a rack whose frame moves while its posts and its feet stay put is a rack that
//! comes apart the first time somebody drags the pitch. So there is one
//! expression for the bay and one per offset within it, all wired to that, which
//! is the difference between a model and a drawing with numbers on it.
const rackPart = (id, name, opts) => {
  const { units, depth, door, devices, managers } = opts;
  const bay = HOME[id], X0 = bay * PITCH;
  const scale = depth / DEPTH;
  add(id, "Part", { name, parent: "MKD" });
  set(id + "_F", "01 Frame", id, "frame");
  expr("X_" + id + "X", name + " stands in bay " + bay, "a * " + bay,
       { a: ["N_PITCH", PITCH] }, id + "_F");
  //! One expression per offset across the rack, made once and reused - which is
  //! what keeps this to a handful rather than one per point.
  const acrossAt = {};
  const across = local => {
    const key = "X_" + id + "AX" + String(local).replace(/[.\-]/g, "_");
    if (!acrossAt[key]) {
      expr(key, name + " \u00b7 " + local + " across", "a + " + local,
           { a: ["X_" + id + "X", X0] }, id + "_F");
      acrossAt[key] = true;
    }
    return [key, X0 + local];
  };
  //! And one per offset into the rack, which follow the DEPTH rather than the
  //! pitch: a shallower rack's rear posts and rear feet come forward with it.
  const intoAt = {};
  const into = local => {
    const key = "X_" + id + "IN" + String(Math.round(local));
    if (!intoAt[key]) {
      expr(key, name + " \u00b7 " + Math.round(local) + " deep",
           "a * " + scale + " - " + (depth - local), { a: ["N_DEPTH", DEPTH] }, id + "_F");
      intoAt[key] = true;
    }
    return [key, local];
  };

  at("PT" + id + "B", "Rack base", X0, 0, PLINTH, id + "_F",
     { x: across(0), z: ["N_PLINTH", PLINTH] });
  add(id + "_FR", "RackFrame", { name: "Frame \u00b7 " + units + "U", parent: id + "_F",
    refs: { plane: "PL0", at: "PT" + id + "B", section: "RACKSEC" },
    wire: { units: ["N_UNITS", units], depth: ["X_" + id + "D", depth] },
    args: { standard: 0, profile: 2, rails: 3, posts: 0, postWidth: FLANGE,
            supplier: "frame, welded, EIA-310-E" } });
  expr("X_" + id + "D", name + " depth (mm)", "a * " + scale,
       { a: ["N_DEPTH", DEPTH] }, id + "_F");
  const rearY = into(depth - 60);
  [[POST_X[0], 0], [POST_X[1], 0], [POST_X[0], 1], [POST_X[1], 1]].forEach(([x, rear], i) => {
    at("PT" + id + "P" + i, "Post " + (i + 1) + " at", X0 + x, rear ? depth - 60 : 60,
       PLINTH, id + "_F",
       { x: across(x), z: ["N_PLINTH", PLINTH], ...(rear ? { y: rearY } : {}) });
    add(id + "_P" + i, "RackPost", { name: "Post " + (i + 1) + " \u00b7 EIA-310-E",
      parent: id + "_F", refs: { plane: "PL0", at: "PT" + id + "P" + i },
      wire: { units: ["N_UNITS", units] },
      args: { standard: 0, holes: 2, width: FLANGE, wall: 2,
              supplier: "post, 2 mm ZP" } });
  });

  set(id + "_E", "02 Equipment", id, "equipment");
  at("PT" + id + "E", "Equipment at", X0 + PANEL_X, 60, PLINTH, id + "_E",
     { x: across(PANEL_X), z: ["N_PLINTH", PLINTH] });
  const stack = STACKS[id], free = freeU(id), count = stackCount(id);
  //! THE STACK, arrayed: one device feature and one Array, so a rack's fill is
  //! two features however many of them there are.
  const first = devices[0];
  add(id + "_T", "RackDevice", { name: first.label, parent: id + "_E",
    refs: { plane: "PL0", at: "PT" + id + "E" },
    wire: { unit: ["N_FIRST", FIRST_U], units: ["N_" + id + "U", stack.high] },
    args: { standard: 0, depth: first.deep, inset: first.inset, ears: 0,
            supplier: first.supplier } });
  add(id + "_TS", "Array", { name: first.label + " \u00b7 the stack", parent: id + "_E",
    refs: { source: id + "_T" },
    wire: { countZ: ["X_" + id + "N", count],
            spacingZ: ["X_" + id + "MM", stack.high * U] },
    args: { mode: 0, countX: 1, spacingX: 0, countY: 1, spacingY: 0 } });
  //! AND EVERY UNIT NUMBER ABOVE THE STACK IS COMPUTED OFF THE STACK, so the
  //! switches and the panels ride up and down with it instead of hanging in the
  //! air over a half-empty rack. The offset is from the first FREE U, which is
  //! where a rack is actually filled from.
  for (const one of devices.slice(1)) {
    const { key, label, plus, units: high, deep, inset, role: own, supplier } = one;
    expr("X_" + id + key, label + " at (U)",
         "a + b * c" + (plus ? " + " + plus : ""),
         { a: ["N_FIRST", FIRST_U], b: ["X_" + id + "N", count],
           c: ["N_" + id + "U", stack.high] }, id + "_E");
    add(id + "_" + key, "RackDevice", { name: label, parent: id + "_E",
      refs: { plane: "PL0", at: "PT" + id + "E" },
      wire: { unit: ["X_" + id + key, free + plus] },
      args: { standard: 0, units: high, depth: deep, inset, ears: 0, supplier },
      ...(own ? { appearance: finishOf(own) } : {}) });
  }

  if (managers) {
    set(id + "_K", "03 Cable management", id, "containment");
    const mgrY = into(depth - 160);
    [20, RACK_W - 100].forEach((x, side) => {
      at("PT" + id + "K" + side, "Manager at", X0 + x, depth - 160, PLINTH, id + "_K",
         { x: across(x), y: mgrY, z: ["N_PLINTH", PLINTH] });
      add(id + "_MG" + side, "CableManager", {
        name: "Vertical manager \u00b7 " + (side ? "right" : "left"), parent: id + "_K",
        refs: { plane: "PL0", at: "PT" + id + "K" + side },
        wire: { units: ["N_UNITS", units] },
        args: { width: 80, depth: 150, sheet: 1.5, pitch: 2 * U, finger: 35, cable: 3,
                supplier: "vertical manager, 80 mm, fingered" } });
    });
  }

  if (door) {
    set(id + "_D", "04 Door", id, "enclosure");
    at("PT" + id + "DR", "Door at", X0, -30, PLINTH, id + "_D",
       { x: across(0), z: ["N_PLINTH", PLINTH] });
    add(id + "_DR", "RackDoor", { name: "Front door \u00b7 slotted", parent: id + "_D",
      refs: { plane: "PL0", at: "PT" + id + "DR" }, wire: { units: ["N_UNITS", units] },
      args: { width: RACK_W, sheet: 1.5, frame: 40, perf: 3, hole: 14, slot: 90,
              pitchX: 34, pitchY: 110, wantOpen: 70, lock: 1, hinge: 0,
              supplier: "front door, slotted, swing handle" } });
  }

  set(id + "_L", "05 Feet", id, "fixing");
  const footY = into(depth - FOOT_IN);
  [[FOOT_IN, 0], [RACK_W - FOOT_IN, 0], [FOOT_IN, 1], [RACK_W - FOOT_IN, 1]].forEach(
   ([x, rear], i) => {
    //! ON THE SLAB, at z = 0. A foot is built UPWARDS from its point, so the
    //! rack's own datum is the plinth above it and not the floor: eighty-four
    //! racks built at zero would have three hundred and thirty-six legs driven
    //! through the floor, and it would look exactly like racks standing on it.
    at("PT" + id + "L" + i, "Foot " + (i + 1) + " at", X0 + x,
       rear ? depth - FOOT_IN : FOOT_IN, 0, id + "_L",
       { x: across(x), ...(rear ? { y: footY } : {}) });
    add(id + "_FT" + i, "LevellingFoot", { name: "Levelling foot " + (i + 1),
      parent: id + "_L", refs: { plane: "PL0", at: "PT" + id + "L" + i },
      wire: { stud: ["N_PLINTH", PLINTH] },
      args: { thread: 4, travel: 55, base: 90, plate: 12, cut: 0,
              supplier: "M20 levelling foot, 1200 kg" } });
  });
  return id;
};

//! THE GPU RACK, and it is an OPEN FRAME on purpose rather than to save
//! triangles. A liquid-cooled compute rack in a contained hot aisle has nothing
//! to gain from a door: the containment is what separates the air, the heat
//! leaves through the coolant, and an open front is what OCP racks ship as. The
//! enclosed cabinets in this hall are the ones that hold things people plug
//! into - management and patch - and those have doors.
rackPart("GPU", "GPU rack · 4U trays, liquid cooled", {
  units: UNITS, depth: DEPTH, door: false, managers: false,
  devices: [
    { label: "GPU tray · 4U", deep: 1050, inset: 20,
      supplier: "4U 8-GPU tray, direct-to-chip cold plates" },
    { key: "S1", label: "Leaf switch · 1U", plus: 0, units: 1, deep: 600,
      inset: 20, supplier: "64 × 800G leaf switch" },
    { key: "S2", label: "Leaf switch · 1U", plus: 1, units: 1, deep: 600,
      inset: 20, supplier: "64 × 800G leaf switch" },
    { key: "PP", label: "MPO patch · 1U", plus: 2, units: 1, deep: 120,
      inset: 20, supplier: "MPO-16 patch panel" },
    { key: "PD", label: "PDU · 2U", plus: 3, units: 2, deep: 300,
      inset: 700, role: "power", supplier: "3-phase 63 A rack PDU" },
  ] });

rackPart("MGT", "Management rack · enclosed", {
  units: UNITS, depth: 1000, door: true, managers: false,
  devices: [
    { label: "Management server · 1U", deep: 750, inset: 20,
      supplier: "1U management server" },
    { key: "S1", label: "Management switch · 1U", plus: 0, units: 1, deep: 500,
      inset: 20, supplier: "48 × 25G management switch" },
    { key: "S2", label: "Console server · 1U", plus: 1, units: 1, deep: 400,
      inset: 20, supplier: "48-port serial console server" },
    { key: "PP", label: "KVM · 2U", plus: 2, units: 2, deep: 500,
      inset: 20, supplier: "rack KVM, 2U slide" },
    { key: "PD", label: "PDU · 2U", plus: 4, units: 2, deep: 300,
      inset: 600, role: "power", supplier: "3-phase 32 A rack PDU" },
  ] });

rackPart("FIB", "Fibre patch rack · open frame", {
  units: UNITS, depth: 600, door: false, managers: true,
  devices: [
    { label: "Fibre patch panel · 1U", deep: 300, inset: 20,
      supplier: "144-fibre LC cassette panel" },
    { key: "S1", label: "Splice tray shelf · 1U", plus: 0, units: 1, deep: 300,
      inset: 20, supplier: "splice tray shelf" },
    { key: "S2", label: "Fibre patch panel · 1U", plus: 1, units: 1, deep: 300,
      inset: 20, supplier: "144-fibre LC cassette panel" },
    { key: "PP", label: "Fibre patch panel · 1U", plus: 2, units: 1, deep: 300,
      inset: 20, supplier: "144-fibre LC cassette panel" },
    { key: "PD", label: "Blanking · 2U", plus: 3, units: 2, deep: 30,
      inset: 20, role: "enclosure", supplier: "blanking panel, snap-in" },
  ] });

//! UNDER THE RACK SET AND NOT BESIDE IT, which is what makes the clash checks
//! at the bottom of this file mean anything. Filed as siblings - which they were
//! - "the racks" was the three designs at their home bays and the nine instances
//! were in nobody's clash check at all. Twelve racks a module is what has to be
//! asked about, not three.
set("MIA", "02 Row A · instances", "MK");
set("MIB", "03 Row B · instances", "MK");
//! AN INSTANCE'S POINT IS A DISPLACEMENT AND NOT A DESTINATION, which is the
//! trap in placing a part that is not drawn at the origin. The GPU rack is drawn
//! in bay 2, so an instance of it "at bay 3" handed 3 x 600 lands it in bay 5 -
//! and the clash check found it standing inside the mid-module column. What the
//! point carries is the difference between the bay wanted and the bay the design
//! is drawn in.
for (const bay of RACK_BAYS) {
  const kind = MIX[bay];
  const home = HOME[kind];
  if (home !== bay) {
    at("PTIA" + bay, kind + " A" + bay + " at", (bay - home) * PITCH, 0, 0, "MIA",
       { x: ["X_BAY" + bay, (bay - home) * PITCH] });
    add("IA" + bay, "Instance", { name: kind + " \u00b7 row A bay " + bay, parent: "MIA",
      refs: { part: kind, at: "PTIA" + bay }, args: { turn: 0, scale: 1 } });
      expr("X_BAY" + bay, "Bay " + bay + " is " + (bay - home) + " bays on",
         "a * " + (bay - home), { a: ["N_PITCH", PITCH] }, "RP");
  }
  //! AND ROW B IS TURNED 180, BACK TO BACK ACROSS THE AISLE. An instance turned
  //! about its own origin lands BEHIND and to the LEFT of the point it is placed
  //! at, so row B's datum is the far side of the aisle and one bay on - plus the
  //! bay the design is drawn in, for the same reason as above.
  at("PTIB" + bay, kind + " B" + bay + " at", (bay + 1 + home) * PITCH,
     AISLE + DEPTH * 2, 0, "RP",
     { x: ["X_BAYB" + bay, (bay + 1 + home) * PITCH],
       y: ["X_ROWB", AISLE + DEPTH * 2] });
  add("IB" + bay, "Instance", { name: kind + " \u00b7 row B bay " + bay, parent: "MIB",
    refs: { part: kind, at: "PTIB" + bay }, args: { turn: 180, scale: 1 } });
  expr("X_BAYB" + bay, "Row B bay " + bay + " at (mm)", "a * " + (bay + 1 + home),
       { a: ["N_PITCH", PITCH] }, "RP");
}

/* ---------------------------------------------------------------- 03 Ribbon */

//! SIX MORE MODULES, WHICH IS THE WHOLE OF THE REST OF THE RIBBON. There is no
//! extra steel at the ends: the module carries its own two trusses, four bays
//! apart, so butting seven of them gives fourteen at a uniform 2400 and the two
//! ends of the ribbon are 900 and 1500 from their nearest frame. Those two
//! cantilevers of tie beam are what the end doors hang off, which is the reason
//! the column bays are 1 and 5 of eight rather than 0 and 4 - the same module
//! with its frames at the head would leave 300 at one end and 2100 at the other.
set("X", "03 Ribbon");
//! ONE POINT FOR ALL SEVEN. Each part of the module is instanced one module
//! along and then patterned, so the ribbon is six more of everything from one
//! displacement - and each pattern is filed in a set that carries its own
//! colour, which is what makes the scheme run the whole length rather than
//! stopping at the end of module 1.
at("PTMOD", "One module on", MOD, 0, 0, "X", { x: ["X_MOD", MOD] });
expr("X_MORE", "Modules after the first", "a - 1", { a: ["N_MODULES", MODULES] }, "X");
[["MS", "01 Steel", "frame"],
 ["MA", "02 Unistrut arms", "frame"],
 ["MT", "03 Cable trays", "containment"],
 ["MB", "04 Bus duct", "power"],
 ["MW", "05 Technical water", "water"],
 ["MR", "06 Containment", "enclosure"],
 ["MK", "07 Racks", null]].forEach(([part, label, role]) => {
  set("X" + part, label, "X", role);
  add("I" + part, "Instance", { name: label + " \u00b7 module 2", parent: "X" + part,
    refs: { part, at: "PTMOD" }, args: { turn: 0, scale: 1 } });
  add("A" + part, "Array", { name: label + " \u00b7 modules 2 to " + MODULES,
    parent: "X" + part, refs: { source: "I" + part },
    wire: { countX: ["X_MORE", MODULES - 1], spacingX: ["X_MOD", MOD] },
    args: { mode: 0, countY: 1, spacingY: 0, countZ: 1, spacingZ: 0 } });
});

//! AND A DOOR AT EACH END, because an aisle open at the ends is not contained.
//! Drawn as the leaf and not as the ironmongery: what the model is for here is
//! that the aisle is closed and how far somebody has to walk to get out of it.
set("XD", "08 Aisle doors", "X", "enclosure");
[["D0", -60, "the head"], ["D1", RIBBON, "the tail"]].forEach(([id, x, where]) => {
  at("PT" + id, "Aisle door at " + where, x, AISLE0, 0, "XD",
     id === "D1" ? { x: ["X_RIBBON", RIBBON], y: ["X_AISLE0", AISLE0] }
                 : { y: ["X_AISLE0", AISLE0] });
  add(id, "Cube", { name: "Aisle door \u00b7 " + where, parent: "XD",
    refs: { origin: "PT" + id, plane: "PL0" },
    wire: { dy: ["N_AISLE", AISLE], dz: ["X_DOORH", ROOF] },
    args: { dx: 60 } });
});
expr("X_DOORH", "Aisle door height (mm)", "" + ROOF, {}, "XD");

/* ------------------------------------------------------------------ 04 Slab */

//! THE FLOOR IT ALL STANDS ON, and the reason there is no raised floor above
//! it. The truss base plates are drawn 20 mm into this slab because a grouted
//! base plate IS in the floor, and the Clash node is told 20 mm of tolerance so
//! it reports that as the joint it is rather than as an interference.
set("FL", "04 Slab", "H", "understructure");
at("PTSL", "Slab at", -3000, -3000, -150, "FL");
add("SLAB", "Cube", { name: "Structural slab", parent: "FL",
  refs: { origin: "PTSL", plane: "PL0" },
  wire: { dx: ["X_SLABX", RIBBON + 6000] },
  args: { dy: 9600, dz: 150 } });
expr("X_SLABX", "Slab length (mm)", "a + 6000", { a: ["X_RIBBON", RIBBON] }, "FL");

/* ----------------------------------------------------------------- 05 Scale */

//! TWO PEOPLE, AND WHERE THEY STAND IS THE POINT. One in the cold aisle looking
//! at the rack fronts, which is where somebody working on these stands; one
//! INSIDE the contained hot aisle, which is the space this whole structure
//! exists to make and the one nobody can judge the size of from a section.
set("S", "05 Scale", "H", "figure");
at("PTS", "In the cold aisle", PITCH * 2.5, -800, 0, "S");
add("PERSON", "Entourage", { name: "Entourage · hands in pockets", parent: "S",
  refs: { plane: "PL0", at: "PTS" }, wire: { height: ["N_PERSON", PERSON] },
  args: { turn: 0, figure: 0 } });
at("PTS2", "In the hot aisle", PITCH * 7.5, AISLE0 + AISLE / 2, 0, "S");
add("PERSON2", "Entourage", { name: "Entourage · in the containment", parent: "S",
  refs: { plane: "PL0", at: "PTS2" }, wire: { height: ["N_PERSON2", PERSON2] },
  args: { turn: -90, figure: 1 } });

/* ----------------------------------------------------------------- 06 Clash */

//! WHAT NOTHING ON SCREEN WILL TELL YOU, and on this file there are three
//! questions rather than one:
//!
//!   the racks against the steel - the sentence "racks go under the HACs" is a
//!   clearance, and a column on the rack row's own centreline is 76 mm either
//!   side of it. Get the bay pattern wrong by one and a rack is inside a
//!   column, which from any distance is a rack beside a column.
//!
//!   the racks against the services - everything the arms carry lives in the
//!   766 mm between the rack tops and the bottom chord, five layers of it, and
//!   the lowest tray is 87 mm above the highest rack.
//!
//!   the module against its neighbours - which is the check instancing needs
//!   and the corridor did not: a module 4800 long arrayed at 4800 centres is
//!   coordinated only if nothing in it overhangs its own length.
set("C", "06 Clash", "H", null);
add("CL_STEEL", "Clash", { name: "The racks against the steel", parent: "C",
  refs: { a: "MK", b: "MS" }, args: { tolerance: 1, how: 1, budget: 400, show: 8 } });
add("CL_SERV", "Clash", { name: "The racks against the services", parent: "C",
  refs: { a: "MK", b: "MT" }, args: { tolerance: 1, how: 1, budget: 400, show: 8 } });
add("CL_ARMS", "Clash", { name: "The racks against the arms and the busway", parent: "C",
  refs: { a: "MK", b: "MA" }, args: { tolerance: 1, how: 1, budget: 400, show: 8 } });
add("CL_JOIN", "Clash", { name: "The module against its neighbours", parent: "C",
  refs: { a: "M", b: "X" }, args: { tolerance: 1, how: 0, budget: 400, show: 8 } });
add("CL_PERSON", "Clash", { name: "The people against the ribbon", parent: "C",
  refs: { a: "S", b: "MOD8" }, args: { tolerance: 1, how: 0, budget: 400, show: 8 } });

set("Z", "07 Bill of materials");
add("BOM", "Bill", { name: "Bill of materials · the ribbon", parent: "Z",
  refs: { of: "H" }, args: { show: 0 } });
add("BOM_MOD", "Bill", { name: "Bill of materials · one module", parent: "Z",
  refs: { of: "M" }, args: { show: 0 } });
add("BOM_STEEL", "Bill", { name: "Bill of materials · the steel", parent: "Z",
  refs: { of: "MS" }, args: { show: 0 } });
add("BOM_GPU", "Bill", { name: "Bill of materials · one GPU rack", parent: "Z",
  refs: { of: "GPU" }, args: { show: 0 } });

const model = { format: "ocaf-parametric-model", version: 1,
                name: "Data hall ribbon · floor-supported hot aisle containment",
                units: "mm", needs: ["rack"], features };

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
    console.log("   " + f.id + " (" + f.type + ") " + String(f.error).slice(0, 160));
  process.exit(1);
}

const F = kit.F, doc = kit.doc();
const featureOf = id => doc.features().find(one => F.id(one) === id);
const shapeOf = id => { const f = featureOf(id); return f ? F.shape(f) : null; };
const bodyOf = id => kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
  .find(b => b.id === id);
const boxOf = id => {
  const s = shapeOf(id) || (bodyOf(id) || {}).shape;
  return s ? kit.extents(s) : null;
};
const fail = why => { console.log("\n" + why + " - the sample is not written"); process.exit(1); };
//! THE MODULE IS SEVEN PARTS AND NOT ONE, so its extent is the union of theirs.
//! A set has no shape of its own and asking one for a bounding box gets null,
//! which is a different answer from "nothing built".
const PARTS = ["MS", "MA", "MT", "MB", "MW", "MR", "MK"];
const unionOf = ids => {
  const boxes = ids.map(boxOf).filter(Boolean);
  if (!boxes.length) return null;
  const low = [0, 1, 2].map(i => Math.min(...boxes.map(b => b.low[i])));
  const high = [0, 1, 2].map(i => Math.max(...boxes.map(b => b.high[i])));
  return { low, high, size: [0, 1, 2].map(i => high[i] - low[i]) };
};
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
const say = (label, text) => console.log(label.padEnd(22) + text);

//! WHAT IT COSTS TO DRAW. This file's risk is not that it is wrong, it is that
//! it is unopenable: eighty-four racks is eighty-four meshes however few
//! definitions they come from, because an instance shares a TShape and still
//! has its own triangles at its own location. So the triangles are counted
//! here, where a number can be acted on, rather than found in a browser.
const trianglesOf = shape => {
  try { return (kit.tessellate(shape, kit.deflectionFor(shape)) || {}).triangles || 0; }
  catch { return 0; }
};

/* ---------- one module, seven places, and the racks two levels down -------- */

{
  //! EVERY ONE OF THE SEVEN, because "the module is instanced" is seven claims
  //! now and any one of them could be the one that quietly became a copy.
  const gpu = shapeOf("GPU"), inside = shapeOf("IA3");
  for (const part of ["MS", "MA", "MT", "MB", "MW", "MR", "MK"]) {
    const home = shapeOf(part), second = shapeOf("I" + part);
    if (!home || !second) fail(part + " (" + !!home + ") or its instance ("
      + !!second + ") did not build");
    if (!second.IsPartner(home)) fail(part + " is instanced as a copy, not an instance");
  }
  console.log("all seven parts of the module are instanced, not copied \u00b7 "
    + "a rack inside one shares its design: "
    + (inside && gpu ? inside.IsPartner(gpu) : "no instance"));
  console.log("the racks part holds " + kit.countSubShapes(shapeOf("MK"), kit.SOLID)
    + " solids \u00b7 one GPU rack " + kit.countSubShapes(gpu, kit.SOLID));
  if (!inside || !inside.IsPartner(gpu))
    fail("the racks inside the module are copies, not instances");
}

/* ------------------------- the ribbon is the length it says it is ---------- */

{
  const mod = unionOf(PARTS), rib = unionOf(PARTS.map(one => "A" + one)),
        tie = boxOf("TIE_A");
  console.log("module   x " + mod.low[0].toFixed(0) + ".." + mod.high[0].toFixed(0)
    + "  y " + mod.low[1].toFixed(0) + ".." + mod.high[1].toFixed(0)
    + "  z " + mod.low[2].toFixed(0) + ".." + mod.high[2].toFixed(0));
  console.log("ribbon   x " + tie.low[0].toFixed(0) + ".." + rib.high[0].toFixed(0)
    + "  " + MODULES + " modules of " + MOD + " · " + (RIBBON / 1000).toFixed(1) + " m");
  //! THE LENGTH IS READ OFF THE TIE BEAM, which is one member running the length
  //! of the module, and not off the module's own bounding box - a part's box is
  //! its compound and a compound takes in every datum vertex filed in it.
  if (Math.abs(tie.size[0] - MOD) > 1)
    fail("the module's tie beam is not the module's length");
  if (Math.abs(rib.high[0] - RIBBON) > 1)
    fail("the ribbon is not " + MODULES + " modules long");
  //! AND NOTHING OVERHANGS A MODULE'S OWN LENGTH, or the modules cannot be
  //! butted: the joint truss straddles the module boundary by half its section,
  //! which is the only thing that may, and it is shared between neighbours.
  console.log("module ends     nothing in it crosses x 0 or x " + MOD
    + " · head truss plate at " + boxOf("TF1").low[0].toFixed(0) + ".."
    + boxOf("TF1").high[0].toFixed(0) + " · checked again by CL_JOIN below");
  if (mod.low[0] < -0.5 || mod.high[0] > MOD + 0.5)
    fail("something in the module overhangs its own length, so the modules cannot butt");
}

/* ------------------------- racks a side, and what they are ---------------- */

{
  const racks = rows.filter(f => f.type === "Instance" || f.type === "Part")
    .filter(f => /row [AB] bay|rack ·|GPU rack|Management rack|Fibre patch/.test(f.name || ""));
  const perModule = RACK_BAYS.length * 2;
  console.log("racks    " + RACKS_SIDE + " a side, " + (RACKS_SIDE * 2) + " in the ribbon · "
    + perModule + " a module from 3 designs · "
    + (MODULES * RACK_BAYS.length) + " GPU/patch/management each side");
  const said = String((rows.find(f => f.id === "X_RACKS").data || {}).preview || "");
  const got = /(-?[\d.]+)/.exec(said);
  console.log("the model's own count of racks a side: " + (got ? got[1] : "?"));
  if (!got || Number(got[1]) !== RACKS_SIDE)
    fail("the model does not agree with itself about how many racks a side");
  if (RACKS_SIDE < 36 || RACKS_SIDE > 44)
    fail("the brief asks for about 40 racks a side and this is " + RACKS_SIDE);
  if (racks.length < 1) fail("no racks were found in the tree");
}

/* ------------------------- the racks really do go UNDER it ---------------- */

{
  const gpu = boxOf("GPU"), truss = boxOf("TF1"), roof = boxOf("RF");
  const gap = CLEAR - gpu.high[2];
  say("rack top", gpu.high[2].toFixed(1) + " mm · bottom chord underside "
    + CLEAR + " · services zone " + gap.toFixed(1) + " mm");
  if (Math.abs(gpu.high[2] - (rackHeight("eia310", UNITS) + PLINTH)) > 1)
    fail("the rack is not as tall as its units and its feet make it");
  if (gap < 300) fail("there is no room between the rack tops and the truss");
  say("truss", "z " + truss.low[2].toFixed(0) + ".." + truss.high[2].toFixed(0)
    + " · span y " + truss.low[1].toFixed(0) + ".." + truss.high[1].toFixed(0));
  if (Math.abs(truss.high[2] - (CLEAR + TDEPTH)) > 1)
    fail("the truss top is not the clear height plus its depth");
  say("aisle roof", "z " + roof.low[2].toFixed(0) + ".." + roof.high[2].toFixed(0)
    + " · y " + roof.low[1].toFixed(0) + ".." + roof.high[1].toFixed(0));
  if (roof.high[2] > CLEAR + 0.01) fail("the aisle roof is inside the bottom chord");
}

/* ------------------------- the trays are on the arms ---------------------- */

{
  //! A TRAY BEARS ON ITS UNDERSIDE AND AN ARM CARRIES ON ITS TOP FACE, so the
  //! two numbers have to be the same one. This is the check that would catch a
  //! section change parting them - which is exactly what a hall full of trays
  //! floating 20 mm over their brackets looks like, which is to say nothing.
  for (const [tray, arm, what] of [["TRAF0", "ARAF0", "fibre layer 1"],
                                   ["TRAL0", "ARAL0", "low voltage layer 1"],
                                   ["TRBF2", "ARBF2", "row B fibre layer 3"]]) {
    const t = boxOf(tray), a = boxOf(arm);
    const sits = t.low[2] - a.high[2];
    say(what, "tray underside " + t.low[2].toFixed(1) + " · arm top "
      + (a.high[2]).toFixed(1) + " · y " + t.low[1].toFixed(0) + ".."
      + t.high[1].toFixed(0));
    //! The arm's own box is its back plate, which is taller than the channel -
    //! so what is compared is the channel's top face, computed from the point.
    const channel = ARM_Z(Number(what.slice(-1)) - 1) + ARM_H2;
    if (Math.abs(t.low[2] - channel) > 0.01)
      fail(what + " is not sitting on its arm's top face");
  }
  //! AND THE FIBRE IS ON THE COLD SIDE AND THE LOW VOLTAGE ON THE HOT, which is
  //! the brief's own sentence and the one thing here that is a choice rather
  //! than a consequence. Row A's racks run y -1200..0 and the aisle is 0..1200.
  const fibre = boxOf("TRAF0"), lv = boxOf("TRAL0");
  //! Row A's racks run y 0..DEPTH and the contained aisle is DEPTH..DEPTH+AISLE,
  //! so the fibre is out past y = 0 and the low voltage starts at y = DEPTH.
  if (!(fibre.low[1] < 0)) fail("the fibre tray is not out over the cold aisle side");
  if (!(lv.low[1] >= AISLE0 - ARM_H2 - 1))
    fail("the low voltage tray is not on the hot aisle side");
}

/* ------------------------- the busway feeds every rack -------------------- */

{
  const said = String(await tellOf("BDA") || "");
  const taps = /(\d+) tap-off boxes at (\d+)/.exec(said);
  say("busway", said.split(" · ").slice(0, 2).join(" · "));
  if (!taps) fail("the busway did not report its tap-offs");
  console.log("                      " + taps[1] + " tap-offs at " + taps[2]
    + " over " + RACK_BAYS.length + " racks a module a side");
  if (Number(taps[2]) !== PITCH)
    fail("the tap-off pitch is not the rack pitch, so a rack has nothing to plug into");
  if (Number(taps[1]) < RACK_BAYS.length)
    fail("there are fewer tap-offs than there are racks under them");
  const bus = boxOf("BDA");
  if (bus.high[2] > ROOF + 0.01) fail("the busway is inside the aisle roof");
}

/* ------------------------- the water carries the hall --------------------- */

{
  //! A FEATURE'S PREVIEW IS ONE LINE WITH " · " BETWEEN ITS PARTS, not one line
  //! per part - which is worth knowing before splitting it on newlines and
  //! printing the whole of it twice.
  const said = String(await tellOf("PS") || "");
  const parts = said.split(" · ");
  const kw = /carries (\d+) kW/.exec(said);
  say("supply main", parts.slice(0, 4).join(" · "));
  if (!kw) fail("the supply main did not report what it carries");
  console.log("                      " + (parts.find(one => /kW/.test(one)) || "").trim());
  //! THE NUMBER THE LOOP IS SIZED BY, checked against the arithmetic rather than
  //! against itself: Q = m c dT for DN250 sch40 at the velocity and rise set.
  const want = pipeDuty(PIPES[5], PIPE_V, PIPE_DT, "sch40").kilowatts;
  console.log("             the same sum done here: " + Math.round(want) + " kW");
  if (Math.abs(Number(kw[1]) - want) > 2) fail("the main does not agree with Q = m c dT");
  //! AND WHAT THAT IS PER RACK, which is the question the ribbon asks of the
  //! loop. Reported and not asserted: what a rack draws is the client's number
  //! and this file has not been given one.
  const perRack = Number(kw[1]) / (RACKS_SIDE * 2);
  console.log("                      " + (RACKS_SIDE * 2) + " racks on one pair of mains is "
    + perRack.toFixed(0) + " kW a rack at " + PIPE_V + " m/s and " + PIPE_DT + " K");
  //! THE MAIN IS ABOVE THE TRUSS AND ITS BRANCHES REACH DOWN BETWEEN THE
  //! CHORDS, so the run's envelope and the main's own height are two different
  //! questions and the bounding box answers only the first.
  const pipe = boxOf("PS"), bearer = boxOf("BRS");
  const mainLow = PIPE_Z - PIPE_R - LAG, mainHigh = PIPE_Z + PIPE_R + LAG;
  say("mains", "main z " + mainLow.toFixed(0) + ".." + mainHigh.toFixed(0)
    + " · bearer top " + bearer.high[2].toFixed(1)
    + " · branches reach down to " + pipe.low[2].toFixed(0)
    + " · soffit " + SOFFIT);
  if (pipe.high[2] > SOFFIT) fail("the mains are through the soffit");
  if (mainLow < CLEAR + TDEPTH) fail("the main is inside the truss");
  if (Math.abs(mainLow - bearer.high[2]) > 0.01)
    fail("the main is not resting on its bearers");
  //! AND THE BRANCH TEES LAND BETWEEN THE CHORDS AND NOT IN ONE. This is the
  //! failure that would look like success: a tee drawn inside a 152 mm chord is
  //! a tee from every angle, and the only thing that knows is the geometry.
  if (pipe.low[2] < CLEAR + HSS || pipe.low[2] > CLEAR + TDEPTH - HSS)
    fail("the branch tees do not land in the gap between the chords");
}

/* ------------------------- the arms hold what is on them ------------------ */

{
  //! AN ARM THAT DOES NOT HOLD ITS LOAD SAYS SO ON ITSELF, so the check is that
  //! none of them is saying it. This is the failure that would look like
  //! success: eighty-four brackets drawn at a reach none of them is rated for
  //! looks exactly like eighty-four brackets.
  const over = [];
  for (const [key] of ARMS) {
    const said = String(await tellOf("AR" + key) || "");
    if (/brace it, shorten it/.test(said)) over.push(key);
  }
  const one = String(await tellOf("ARAL0") || "");
  say("arms", ARMS.length + " designs, " + (ARMS.length * 2) + " a module, "
    + (ARMS.length * 2 * MODULES) + " in the ribbon");
  console.log("                      " + one.split("\n").slice(0, 2).join(" · "));
  if (over.length) fail(over.length + " arm(s) carry more than they hold: " + over.join(" "));
}

/* ------------------------- the people are rulers -------------------------- */

{
  for (const [id, want] of [["PERSON", PERSON], ["PERSON2", PERSON2]]) {
    const points = meshOf(id);
    if (!points || !points.length) fail(id + " built no mesh");
    const z = points.map(p => p[2]);
    const low = Math.min(...z), high = Math.max(...z);
    say(id.toLowerCase(), (high - low).toFixed(2) + " mm tall, feet at " + low.toFixed(2)
      + " · " + points.length + " vertices");
    if (Math.abs((high - low) - want) > 0.01) fail(id + " is not the height asked for");
    if (Math.abs(low) > 0.01) fail(id + " is not standing on the slab");
  }
  //! AND THE ONE IN THE HOT AISLE FITS IN IT, which is the measurement a
  //! containment unit is judged by and the reason there is a person in there.
  const head = PERSON2, roof = ROOF;
  console.log("             the contained aisle is " + AISLE + " wide and " + roof
    + " to the deck · " + (roof - head) + " mm over the head of the person in it");
  if (roof - head < 300) fail("nobody can stand up in the contained aisle");
}

/* ------------------------- and the parameters drive it ------------------- */

{
  //! THE MEASUREMENT THE FILE EXISTS FOR: change ONE rack's height and
  //! eighty-four racks move, because they are the same geometry twice
  //! instanced. A model of eighty-four copies passes every check above and
  //! fails this one.
  const tall = () => ({ gpu: boxOf("GPU").size[2], ribbon: boxOf("AMK").size[2] });
  const was = tall();
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: 24 });
  const half = tall();
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: UNITS });
  const back = tall();
  console.log("48U -> 24U -> 48U   GPU rack " + was.gpu.toFixed(0) + " -> "
    + half.gpu.toFixed(0) + " -> " + back.gpu.toFixed(0));
  if (!(half.gpu < was.gpu - 500)) fail("the GPU rack does not follow its height");
  if (Math.abs(back.gpu - was.gpu) > 1e-6) fail("the GPU rack did not come back");
}

{
  //! AND THE AISLE IS A PARAMETER, which on this file moves more than a gap: it
  //! is the truss span, so row B, the far column, the far arms, the far trays
  //! and the busway all move with it and the truss re-divides its panels.
  const span = () => ({ truss: boxOf("TF1").size[1], roof: boxOf("RF").size[1] });
  const at1200 = span();
  await mdl.run({ op: "set", id: "N_AISLE", key: "value", value: 1800 });
  const at1800 = span();
  await mdl.run({ op: "set", id: "N_AISLE", key: "value", value: AISLE });
  const back = span();
  console.log("aisle 1200 -> 1800 -> 1200   truss span " + at1200.truss.toFixed(0)
    + " -> " + at1800.truss.toFixed(0) + " -> " + back.truss.toFixed(0)
    + "   roof " + at1200.roof.toFixed(0) + " -> " + at1800.roof.toFixed(0)
    + " -> " + back.roof.toFixed(0));
  if (!(at1800.truss > at1200.truss + 500)) fail("the aisle is not driving the truss span");
  if (!(at1800.roof > at1200.roof + 500)) fail("the aisle is not driving the roof");
}

{
  //! AND ONE SECTION DRIVES FIFTEEN TRUSSES. Switch the HAC section from HSS
  //! 6x6x1/4 to 8x8x1/4 and every chord, column and tie in the ribbon changes,
  //! and the clear height under it does not - which is the point of measuring
  //! the clear to the underside rather than to the chord's centreline.
  //! MEASURED ON THE TIE AND NOT ON THE TRUSS, because a truss's bounding box
  //! across the ribbon is its BASE PLATE - 500 mm of it - and the section could
  //! be anything inside that. The tie is one member on the same wire, so its box
  //! IS the section.
  const steel = () => ({ tie: boxOf("TIE_A").size[1], clear: boxOf("TF1").high[2] });
  const at6 = steel();
  await mdl.run({ op: "set", id: "HACSEC", key: "profile", value: 13 });
  const at8 = steel();
  await mdl.run({ op: "set", id: "HACSEC", key: "profile", value: 11 });
  const back = steel();
  console.log("HSS 6 -> 8 -> 6   tie across " + at6.tie.toFixed(1) + " -> "
    + at8.tie.toFixed(1) + " -> " + back.tie.toFixed(1)
    + "   truss top " + at6.clear.toFixed(0) + " -> " + at8.clear.toFixed(0));
  if (Math.abs(at6.tie - 152.4) > 0.5 || Math.abs(at8.tie - 203.2) > 0.5)
    fail("the HAC section is not driving the steel");
  if (Math.abs(at8.clear - at6.clear) > 0.01)
    fail("changing the section moved the clear height, which it must not");
}

/* ------------------------- and nothing is inside anything else ----------- */

{
  for (const id of ["CL_STEEL", "CL_SERV", "CL_ARMS", "CL_JOIN", "CL_PERSON"]) {
    const said = String(await tellOf(id) || "");
    const line = said.split("\n").find(one => /clash|no interference/.test(one)) || said;
    console.log(id.padEnd(11) + line.trim());
    if (!/no interference/.test(said)) {
      console.log(said.split("\n").slice(0, 12).map(one => "   " + one).join("\n"));
      fail("the ribbon clashes with itself");
    }
  }
  //! AND THE CHECKS ARE NOT VACUOUS. A clash test that finds nothing because it
  //! looked at nothing passes every time, so the pair count says it looked.
  const looked = String(await tellOf("CL_STEEL") || "");
  const pairs = /([\d,]+) pairs/.exec(looked);
  const many = pairs ? Number(pairs[1].replace(/,/g, "")) : 0;
  console.log("the steel check compared " + many.toLocaleString() + " pairs of solids");
  if (many < 200) fail("the clash check is not looking at the model");

  //! AND IT REALLY WOULD FIND ONE. The clearance this file is about is the one
  //! between the rack tops and the services above them, so the racks are grown
  //! into the tray zone and the same node has to say so.
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: 56 });
  const grown = String(await tellOf("CL_ARMS") || "")
    + String(await tellOf("CL_SERV") || "");
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: UNITS });
  const after = String(await tellOf("CL_ARMS") || "")
    + String(await tellOf("CL_SERV") || "");
  const found = /(\d+) clash/.exec(grown);
  console.log("racks grown to 56U: " + (found ? found[1] + " clashes with the services"
    : "nothing found") + " · back at " + UNITS + "U: "
    + (/no interference/.test(after) ? "clear" : "STILL CLASHING"));
  if (!found) fail("growing the racks into the tray zone was not reported as a clash");
  if (!/no interference/.test(after)) fail("the ribbon did not come back clear");
}

/* ------------------------- what it costs to draw ------------------------- */

{
  const bodies = kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false });
  let total = 0;
  const worst = [];
  for (const b of bodies) {
    const n = trianglesOf(b.shape);
    total += n;
    worst.push([b.id, n]);
  }
  worst.sort((a, c) => c[1] - a[1]);
  console.log("\n" + bodies.length + " bodies · " + total.toLocaleString()
    + " triangles at the viewer's own deflection");
  console.log("the five dearest: " + worst.slice(0, 5)
    .map(([id, n]) => id + " " + n.toLocaleString()).join(", "));
  if (total > 2500000)
    fail("the ribbon is " + total.toLocaleString() + " triangles and will not open");
}

const bom = rows.find(f => f.id === "BOM");
const mod = rows.find(f => f.id === "BOM_MOD");
const gpu = rows.find(f => f.id === "BOM_GPU");
console.log("\none GPU rack · " + String((gpu.data || {}).preview || "").split("\n").pop());
console.log("one module   · " + String((mod.data || {}).preview || "").split("\n").pop());
console.log("the ribbon   · " + String((bom.data || {}).preview || "").split("\n").pop());

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("\nwrote " + OUT);
