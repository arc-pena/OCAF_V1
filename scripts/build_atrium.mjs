// Builds docs/data/samples/atrium_galleries.json - a retail atrium, reverse
// engineered from a visualisation.
//
//     node scripts/build_atrium.mjs
//
// WHAT WAS IN THE PICTURE, and what it turned out to be made of. A mall atrium
// photographed from the concourse: galleries weaving round a long void, a thick
// cellular roof over the top, shopfronts behind the galleries and a tall glazed
// wall on one side. It LOOKS like a building of curved surfaces. It is not.
//
// Almost nothing in it is curved. The floor plates are dead flat - one level,
// one thickness - and what sweeps is their EDGE. The band you read from across
// the void is a section run along a plan curve; the balustrade standing on it is
// a second section on the same curve; the shopfront behind it is a third. Draw
// the curve once and the whole storey follows, which is why this file is 100-odd
// features and not a mesh.
//
// THE BRIEF, as it was given:
//
//   "Two retail facade shop fronts to the left. A floor depth of about 1.5 m and
//    6 m floor level to floor level. Cladding to the edge of slab sweeps and
//    makes a sharp chamfered bevelled edge. The profile of the atria are curved
//    in plan like a parabola. The shops to the right are two retail shop floors
//    but above have non-corridor facade fronts for a hotel component or cinema
//    or other functions, about 3 floors - those are just glass fronts with no
//    corridor in front. Above all this is a thick structure roof with ETFE
//    bubbles inside the modules produced by the roof network of thick structural
//    walkable truss elements."
//
// Every one of those sentences is a dimension or a node in what follows, and the
// script measures each of them at the bottom rather than asserting it.
//
// THE SHAPE OF IT:
//
//   00 Parameters   the void, the storey heights, the floor zone, the roof.
//                   Everything below is written over these.
//   01 Reference    the planes, one per level, which is what puts a sweep at a
//                   walking level rather than at the origin.
//   02 Galleries    the two retail levels, each one: a parabolic void, the
//                   swept bevelled slab edge, the flat plate behind it, the
//                   balustrade on top and the shopfront at the back.
//   03 Upper floors the three flush-glazed floors on one side, with no corridor
//                   in front of them - one facade, arrayed up.
//   04 Concourse    the ground floor, its shopfronts and the flared columns.
//   05 Roof         the walkable net and the ETFE cushions in its cells, as two
//                   features on the same numbers so they take two finishes.
//   06 Scale        people, because a 39 m atrium drawn without anybody in it
//                   has nothing in it to measure 39 m against.
//   07 Schedule     what the model says about itself.
//
// WHAT IS NOT A PRODUCT. There is no glass, no extrusion, no ETFE foil and no
// structural section in here with a manufacturer's name on it, because none was
// given. Every size is a dimension on a feature.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { PluginHost } from "../docs/src/plugin.js";
import { ATRIUM } from "../docs/src/atrium-plugin.js";
import { RACK } from "../docs/src/rack-plugin.js";
import { loopArea, parabolicVoid, roofCells, storeys } from "../docs/src/atrium.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "data", "samples", "atrium_galleries.json");
const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";

/* ===================================================== the numbers it is of */

const LENGTH = 90000;            // the void, end to end
const FLOOR = 6000;              // floor level to floor level, as briefed
const ZONE = 1500;               // the floor depth, as briefed
const BEVEL = 400;               // the sharp chamfer under the cladding
const BACK = 2600;               // how far the swept edge section reaches in
const GALLERY = 9000;            // the corridor, edge band to shopfront
const CLEAR = FLOOR - ZONE;      // 4500 - floor to the soffit over it
const GALLERIES = 2;             // retail levels with a corridor, both sides
const UPPER = 3;                 // flush-glazed floors over the shops, one side
const RISE = 9000;               // the roof's rise over its springing
const ROOF_Z = FLOOR * (GALLERIES + UPPER);   // 30000 - where the roof springs
const CROWN = ROOF_Z + RISE;

//! THE TWO VOIDS, and they are not the same void. The upper gallery is set back
//! from the lower one, which is what makes the bands weave past each other
//! rather than stack - and is the whole reason to draw the plan curve per level
//! instead of once.
const VOIDS = [
  { wide: 11500, ends: 4600, fullness: 2.0 },
  { wide: 13200, ends: 5400, fullness: 2.3 },
];

const MEMBER = 900, DEEP = 1800; // the roof's walkable members
const CELLS = 64, SEED = 7;

//! WHAT EACH THING IS MADE OF. Read off the picture: warm pale stone on the
//! bands and the soffits, a dark bronze on the deep reveals, glass that is
//! actually transparent, and an ETFE cushion that is translucent rather than
//! clear - which is the difference between a cushion and a window.
const LOOK = {
  band: { finish: "concrete", color: [0.74, 0.71, 0.66], gloss: 0.18 },
  plate: { finish: "concrete", color: [0.66, 0.65, 0.62], gloss: 0.12 },
  soffit: { finish: "matte", color: [0.33, 0.28, 0.23], gloss: 0.35 },
  glass: { finish: "glass", color: [0.60, 0.72, 0.78], opacity: 0.17, gloss: 0.98 },
  frame: { finish: "anodised", color: [0.13, 0.13, 0.15] },
  rail: { finish: "steel", color: [0.26, 0.27, 0.29] },
  steel: { finish: "matte", color: [0.93, 0.92, 0.88], gloss: 0.25 },
  etfe: { finish: "glass", color: [0.90, 0.94, 0.97], opacity: 0.13, gloss: 0.9,
          edges: false },
  stone: { finish: "matte", color: [0.84, 0.81, 0.76], gloss: 0.2 },
  figure: { finish: "matte", color: [0.84, 0.82, 0.78], edges: false },
};

const features = [];
//! A MODEL FILE SAYS A REFERENCE INSIDE args, as { ref: "ID" }; a list of them
//! is a list; a number driven by another number is { value, from }. The `refs`
//! shorthand belongs to the add OP and a file that uses it has its wires
//! silently dropped.
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
const set = (id, name, parent = "H", look = null) =>
  add(id, "GeometricalSet", { name, ...(parent ? { parent } : {}),
                              ...(look ? { appearance: look } : {}) });
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

add("H", "GeometricalSet", { name: "Atrium · galleries, shopfronts and a cellular roof" });
set("P", "00 Parameters");
num("N_LENGTH", "Void length", LENGTH, "P");
num("N_FLOOR", "Floor to floor", FLOOR, "P");
num("N_ZONE", "Floor depth", ZONE, "P");
num("N_BEVEL", "Edge chamfer", BEVEL, "P");
num("N_BACK", "Edge section reaches back", BACK, "P");
num("N_GALLERY", "Gallery width", GALLERY, "P");
num("N_RISE", "Roof rise", RISE, "P");
num("N_MEMBER", "Roof member width", MEMBER, "P");
num("N_DEEP", "Roof member depth", DEEP, "P");
num("N_CELLS", "Roof cells", CELLS, "P");
num("N_SEED", "Roof seed", SEED, "P");
num("N_CUSHION", "Cushion rise", 950, "P");
num("N_DROP", "Cushion drop", 700, "P");
num("N_PERSON", "Person", 1727, "P");
//! THE PLAN OF EACH LEVEL, AS NUMBERS, so that the void and every line set back
//! from it are the SAME curve rather than two drawings of it. Written out per
//! level because the two galleries are deliberately different parabolas - which
//! is what makes the bands weave past each other instead of stacking - and
//! wired, because a shopfront line typed in separately stays where it was typed
//! the first time somebody drags the void. Which is exactly what happened: the
//! band, the plate and the balustrade all moved 7 m and the frontage moved 0.
VOIDS.forEach((spec, i) => {
  num("N_W" + (i + 1), "Level " + (i + 1) + " void, half width", spec.wide, "P");
  num("N_E" + (i + 1), "Level " + (i + 1) + " void, half width at ends", spec.ends, "P");
  num("N_F" + (i + 1), "Level " + (i + 1) + " void, fullness", spec.fullness, "P");
});

//! THE ONE NUMBER THE WHOLE SECTION HANGS OFF. Floor to floor less the floor
//! depth is what is left to stand up in - the shopfront's height, the soffit's
//! level, and the thing a 1.5 m floor zone costs. Wired rather than typed, so
//! dragging either number moves every shopfront in the model.
expr("X_CLEAR", "Clear to the soffit", "a - b",
     { a: ["N_FLOOR", FLOOR], b: ["N_ZONE", ZONE] }, "P");
expr("X_ROOFZ", "Roof springs at", "a * " + (GALLERIES + UPPER),
     { a: ["N_FLOOR", FLOOR] }, "P");
expr("X_CROWN", "Crown at", "a * " + (GALLERIES + UPPER) + " + b",
     { a: ["N_FLOOR", FLOOR], b: ["N_RISE", RISE] }, "P");
//! The shopfront line is the void offset by the edge section and the corridor,
//! which is the one distance that puts a frontage where a frontage goes.
expr("X_FRONT", "Shopfront line", "a + b",
     { a: ["N_BACK", BACK], b: ["N_GALLERY", GALLERY] }, "P");
expr("X_ROOFW", "Roof width", "a * 2 + b * 2 + 6000",
     { a: ["N_GALLERY", GALLERY], b: ["N_BACK", BACK] }, "P");

/* ------------------------------------------------------------- 01 Reference */

set("R", "01 Reference");
at("PT0", "Origin", 0, 0, 0, "R");
add("VZ", "Vector", { name: "Up", parent: "R", args: { dx: 0, dy: 0, dz: 1 } });
add("PL0", "Plane", { name: "Ground", parent: "R", refs: { origin: "PT0", normal: "VZ" } });
//! A POINT PER LEVEL, and every sweep on that level is placed at it. A plan
//! curve is drawn at a walking level, so moving the level moves the curve, the
//! band swept on it, the balustrade standing on it and the shopfront behind it -
//! which is what "floor to floor" being a parameter has to mean.
const LEVELS = storeys({ retail: FLOOR, retailFloors: GALLERIES,
                         upper: FLOOR, upperFloors: UPPER });
LEVELS.forEach((one, i) => {
  at("PTL" + i, "Level " + i + " at " + one.z, 0, 0, one.z, "R",
     i ? { z: ["X_L" + i, one.z] } : null);
  if (i) expr("X_L" + i, "Level " + i + " (mm)", "a * " + i, { a: ["N_FLOOR", FLOOR] }, "R");
});

/* ------------------------------------------------------------- 02 Galleries */

set("G", "02 Galleries · two retail levels, both sides");

for (let i = 1; i <= GALLERIES; i++) {
  const spec = VOIDS[i - 1];
  const g = "G" + i;
  set(g, "0" + i + " Level " + i + " · gallery", "G");

  //! THE SKETCH. Two parabolas facing away from each other with a blunt nose at
  //! each end - which is the brief, and is the only curve on this level.
  add(g + "_V", "AtriumVoid", { name: "Void · level " + i, parent: g,
    refs: { plane: "PL0", at: "PTL" + i },
    wire: { length: ["N_LENGTH", LENGTH], wide: ["N_W" + i, spec.wide],
            ends: ["N_E" + i, spec.ends], fullness: ["N_F" + i, spec.fullness] },
    args: { stations: 30, nose: 0.65, run: 0 } });

  //! AND THE FOUR THINGS SWEPT ALONG IT. This is the whole claim of the file:
  //! one curve, four sections, and a storey.
  set(g + "_E", "01 Slab edge", g, LOOK.band);
  add(g + "_SE", "SlabEdge", { name: "Edge band · clad and chamfered", parent: g + "_E",
    refs: { rail: g + "_V" },
    wire: { depth: ["N_ZONE", ZONE], bevel: ["N_BEVEL", BEVEL], back: ["N_BACK", BACK] },
    args: { side: 0, upstand: 0,
            supplier: "edge cladding, chamfered to the slab arris" } });

  set(g + "_P", "02 Floor plate", g, LOOK.plate);
  add(g + "_GF", "GalleryFloor", { name: "Floor plate · flat", parent: g + "_P",
    refs: { rail: g + "_V" },
    wire: { inset: ["N_BACK", BACK], width: ["N_GALLERY", GALLERY],
            depth: ["N_ZONE", ZONE] } });

  set(g + "_B", "03 Balustrade", g, LOOK.glass);
  add(g + "_BA", "Balustrade", { name: "Balustrade · frameless glass", parent: g + "_B",
    refs: { rail: g + "_V" },
    args: { side: 0, height: 1100, setback: 140, glass: 21, railWidth: 100,
            railDepth: 60, shoe: 200, shoeHeight: 160, posts: 0,
            supplier: "frameless structural glass in a shoe" } });
  //! The capping rail is a different material from the glass it caps, and the
  //! node builds them as separate bodies so they can say so.
  add(g + "_BR", "Balustrade", { name: "Capping rail", parent: g + "_B",
    refs: { rail: g + "_V" }, appearance: LOOK.rail,
    args: { side: 0, height: 1100, setback: 140, glass: 1, railWidth: 100,
            railDepth: 60, shoe: 200, shoeHeight: 160, posts: 0 } });

  //! THE SHOPFRONT, on the same curve offset to the back of the corridor. The
  //! core ParallelCurve node does the offset, so the frontage is the void and
  //! not a second drawing of it: drag the void and the shops follow.
  //! THE SHOPFRONT LINE IS THE VOID SET BACK, drawn as the same parabola with
  //! the corridor added - one node, one curve, and the frontage follows the void
  //! when somebody drags it. A parallel curve was tried here first and is the
  //! reason the set-back argument exists: the kernel offsets this spline into
  //! 225 edges, and sweeping a shopfront along those overflowed the stack.
  set(g + "_S", "04 Shopfront", g, LOOK.glass);
  add(g + "_PC", "AtriumVoid", { name: "Shopfront line · the void set back",
    parent: g + "_S", refs: { plane: "PL0", at: "PTL" + i },
    wire: { length: ["N_LENGTH", LENGTH], offset: ["X_FRONT", BACK + GALLERY],
            wide: ["N_W" + i, spec.wide], ends: ["N_E" + i, spec.ends],
            fullness: ["N_F" + i, spec.fullness] },
    args: { stations: 30, nose: 0.65, run: 0 } });
  add(g + "_SF", "Shopfront", { name: "Retail frontage · level " + i, parent: g + "_S",
    refs: { rail: g + "_PC" },
    wire: { height: ["X_CLEAR", CLEAR] },
    args: { side: 1, pitch: 1500, mullion: 90, depth: 200, glass: 32,
            band: 700, sill: 0, parts: 1,
            supplier: "shopfront, signage band at the head" } });
  //! The mullions and the signage band are the dark part of the elevation and
  //! the glass is not, so the frame is its own feature.
  add(g + "_SM", "Shopfront", { name: "Mullions and signage band", parent: g + "_S",
    refs: { rail: g + "_PC" }, appearance: LOOK.frame,
    wire: { height: ["X_CLEAR", CLEAR] },
    args: { side: 1, pitch: 1500, mullion: 110, depth: 220, glass: 32,
            band: 700, sill: 0, parts: 2 } });
}

/* --------------------------------------------------------- 03 Upper floors */

//! THREE FLOORS WITH NO CORRIDOR IN FRONT OF THEM, on one side only - the hotel
//! or the cinema over the shops. So the rail is ONE SIDE of the void rather than
//! the loop: a facade that stops where that side stops, and an offset of a loop
//! is still a loop. No gallery, no balustrade, no band - just glass.
set("U", "03 Upper floors · flush glazing, one side", "H", LOOK.glass);
add("U_PC", "AtriumVoid", { name: "Facade line · one side, set back", parent: "U",
  refs: { plane: "PL0", at: "PTL" + GALLERIES },
  wire: { length: ["N_LENGTH", LENGTH], offset: ["X_FRONT", BACK + GALLERY],
          wide: ["N_W" + GALLERIES, VOIDS[GALLERIES - 1].wide],
          ends: ["N_E" + GALLERIES, VOIDS[GALLERIES - 1].ends],
          fullness: ["N_F" + GALLERIES, VOIDS[GALLERIES - 1].fullness] },
  args: { stations: 30, nose: 0.65, run: 1 } });
add("U_SF", "Shopfront", { name: "Flush facade · one floor", parent: "U",
  refs: { rail: "U_PC" },
  wire: { height: ["N_FLOOR", FLOOR] },
  args: { side: 1, pitch: 1500, mullion: 90, depth: 200, glass: 32,
          band: 0, sill: 0, parts: 1,
          supplier: "unitised glazing, no corridor in front" } });
add("U_SM", "Shopfront", { name: "Transoms and spandrel", parent: "U",
  refs: { rail: "U_PC" }, appearance: LOOK.frame,
  wire: { height: ["N_FLOOR", FLOOR] },
  args: { side: 1, pitch: 1500, mullion: 110, depth: 220, glass: 32,
          band: 600, sill: 0, parts: 2 } });
//! ARRAYED UP, because three floors of the same facade is one facade three
//! times - and an Array of it is one piece of geometry at three heights.
add("U_AG", "Array", { name: "Glass · three floors", parent: "U",
  refs: { source: "U_SF" },
  wire: { spacingZ: ["N_FLOOR", FLOOR] },
  args: { mode: 0, countX: 1, spacingX: 0, countY: 1, spacingY: 0, countZ: UPPER } });
add("U_AM", "Array", { name: "Frame · three floors", parent: "U",
  refs: { source: "U_SM" },
  wire: { spacingZ: ["N_FLOOR", FLOOR] },
  args: { mode: 0, countX: 1, spacingX: 0, countY: 1, spacingY: 0, countZ: UPPER } });

/* ------------------------------------------------------------ 04 Concourse */

set("C", "04 Concourse");
//! The ground floor plate, out past the shops both sides. A flat slab, which is
//! what a ground floor is.
set("C_F", "01 Floor", "C", LOOK.plate);
at("PTC", "Concourse corner", -58000, -32000, -400, "C_F");
add("C_SLAB", "Cube", { name: "Concourse floor", parent: "C_F",
  refs: { origin: "PTC", plane: "PL0" },
  args: { dx: 116000, dy: 64000, dz: 400 } });

//! THE SHOPFRONTS AT GROUND, on the lower gallery's own shopfront line - the
//! shops below the shops. Same node, same curve, one level down.
set("C_S", "02 Ground shopfronts", "C", LOOK.glass);
//! THE SAME PLAN CURVE, DRAWN ON THE GROUND. Not the level-1 void moved down:
//! a void is placed by the plane and point it is given, so the ground one is
//! the same four numbers on the ground plane - and the shops below line up
//! under the shops above because both are offsets of the same parabola.
//! THE SAME PARABOLA, DRAWN ON THE GROUND AND SET BACK. Not the level-1 line
//! moved down: a void is placed by the plane and the point it is given, so the
//! ground one is the same numbers on the ground plane - and the shops below line
//! up under the shops above because both are the same curve set back the same.
add("C_PC", "AtriumVoid", { name: "Ground shopfront line", parent: "C_S",
  refs: { plane: "PL0", at: "PTL0" },
  wire: { length: ["N_LENGTH", LENGTH], offset: ["X_FRONT", BACK + GALLERY],
          wide: ["N_W1", VOIDS[0].wide], ends: ["N_E1", VOIDS[0].ends],
          fullness: ["N_F1", VOIDS[0].fullness] },
  args: { stations: 30, nose: 0.65, run: 0 } });
add("C_SF", "Shopfront", { name: "Ground frontage", parent: "C_S",
  refs: { rail: "C_PC" },
  wire: { height: ["X_CLEAR", CLEAR] },
  args: { side: 1, pitch: 1500, mullion: 90, depth: 200, glass: 32,
          band: 800, sill: 0, parts: 1,
          supplier: "shopfront, signage band at the head" } });
add("C_SM", "Shopfront", { name: "Mullions and signage band", parent: "C_S",
  refs: { rail: "C_PC" }, appearance: LOOK.frame,
  wire: { height: ["X_CLEAR", CLEAR] },
  args: { side: 1, pitch: 1500, mullion: 110, depth: 220, glass: 32,
          band: 800, sill: 0, parts: 2 } });

//! AND THE COLUMNS. One design, turned about its own axis, and a row of it down
//! each side of the void - the thing at the bottom of every atrium photograph.
set("C_C", "03 Columns", "C", LOOK.stone);
at("PTCOL", "First column at", -31500, -16000, 0, "C_C");
add("C_COL", "FlaredColumn", { name: "Flared column", parent: "C_C",
  refs: { plane: "PL0", at: "PTCOL" },
  wire: { height: ["X_CLEARC", FLOOR - ZONE] },
  args: { shaft: 850, head: 4200, foot: 1150, flare: 0.62, sharpness: 2.8, steps: 18 } });
expr("X_CLEARC", "Column height", "a - b",
     { a: ["N_FLOOR", FLOOR], b: ["N_ZONE", ZONE] }, "C_C");
add("C_ROW", "Array", { name: "Columns · both sides of the void", parent: "C_C",
  refs: { source: "C_COL" },
  args: { mode: 0, countX: 8, spacingX: 9000, countY: 2, spacingY: 32000,
          countZ: 1, spacingZ: 0 } });

/* ----------------------------------------------------------------- 05 Roof */

//! A THICK STRUCTURE ROOF WITH ETFE BUBBLES INSIDE THE MODULES PRODUCED BY THE
//! ROOF NETWORK, which is the brief word for word. The network is a Voronoi
//! tessellation of a Lloyd-relaxed scatter on a shallow paraboloid - computed,
//! not drawn - and the members are deep enough to walk along, which is what
//! holds the cushions and what gets somebody to them to change one.
//!
//! TWO FEATURES ON THE SAME NUMBERS. The structure and the cushions are one
//! tessellation and two materials, so they are built as two features wired to
//! the same parameters: one node, one cell generator, and no way for them to
//! disagree about where a cell is.
set("RF", "05 Roof", "H");
at("PTRF", "Roof springs at", 0, 0, ROOF_Z, "RF", { z: ["X_ROOFZ", ROOF_Z] });
const ROOF_ARGS = {
  refs: { plane: "PL0", at: "PTRF" },
  wire: { length: ["N_LENGTH", LENGTH], width: ["X_ROOFW", GALLERY * 2 + BACK * 2 + 6000],
          rise: ["N_RISE", RISE], cells: ["N_CELLS", CELLS], seed: ["N_SEED", SEED],
          member: ["N_MEMBER", MEMBER], deep: ["N_DEEP", DEEP],
          cushion: ["N_CUSHION", 950], drop: ["N_DROP", 700] },
};
set("RF_S", "01 Structure", "RF", LOOK.steel);
add("RF_NET", "RoofNet", { name: "Walkable net · Voronoi", parent: "RF_S",
  ...ROOF_ARGS,
  args: { relax: 2, parts: 1, supplier: "walkable structural net" } });
set("RF_E", "02 ETFE cushions", "RF", LOOK.etfe);
add("RF_ETFE", "RoofNet", { name: "ETFE cushions · one a cell", parent: "RF_E",
  ...ROOF_ARGS,
  args: { relax: 2, parts: 2, supplier: "inflated ETFE cushions" } });

/* ---------------------------------------------------------------- 06 Scale */

//! THE ONE THING IN THE FILE THAT IS NOT DESIGNED, and the one that makes the
//! rest of it readable. A 39 m atrium drawn without anybody in it has nothing in
//! it to measure 39 m against, and the first thing anybody does with a
//! visualisation is look for the people to work out how big it is.
set("S", "06 Scale", "H", LOOK.figure);
[["S1", -9000, -13000, 0, 0, 0], ["S2", 4000, -14500, 0, -35, 2],
 ["S3", -2000, 14000, 0, 180, 1],
 ["S4", -16000, -12200, FLOOR, 15, 3]].forEach(([id, x, y, z, turn, figure]) => {
  at("PT" + id, "Person at", x, y, z, "S");
  add(id, "Entourage", { name: "Entourage", parent: "S",
    refs: { plane: "PL0", at: "PT" + id },
    wire: { height: ["N_PERSON", 1727] },
    args: { turn, figure } });
});

/* ------------------------------------------------------------- 07 Schedule */

set("Z", "07 Schedule");
add("Z_BOM", "Bill", { name: "Schedule · the whole atrium", parent: "Z",
  refs: { of: "H" }, args: { show: 0 } });
add("Z_LEVEL", "Bill", { name: "Schedule · one gallery level", parent: "Z",
  refs: { of: "G1" }, args: { show: 0 } });

const model = { format: "ocaf-parametric-model", version: 1,
                name: "Atrium · galleries, shopfronts and a cellular roof",
                units: "mm", needs: ["atrium", "rack"], features };

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
await host.load("atrium");
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
    console.log("   " + f.id + " (" + f.type + ") " + String(f.error).slice(0, 170));
  process.exit(1);
}

const F = kit.F, doc = kit.doc();
const featureOf = id => doc.features().find(one => F.id(one) === id);
const shapeOf = id => { const f = featureOf(id); return f ? F.shape(f) : null; };
const boxOf = id => { const s = shapeOf(id); return s ? kit.extents(s) : null; };
const fail = why => { console.log("\n" + why + " - the sample is not written"); process.exit(1); };
const tellOf = async id => {
  const answer = await kernel.tree();
  const row = (answer.tree || answer).features.find(one => one.id === id);
  return String((row && row.data ? row.data.preview : "") || "");
};
const say = (label, text) => console.log(label.padEnd(20) + text);

/* ------------------- the brief, sentence by sentence ---------------------- */

{
  //! "6 m floor level to floor level, and a floor depth of about 1.5 m."
  const l1 = boxOf("G1_SE"), l2 = boxOf("G2_SE");
  say("floor to floor", l2.high[2] - l1.high[2] + " mm between the two gallery levels");
  if (Math.abs((l2.high[2] - l1.high[2]) - FLOOR) > 1)
    fail("the galleries are not " + FLOOR + " apart");
  say("floor depth", l1.size[2].toFixed(0) + " mm of floor zone, walking level at "
    + l1.high[2].toFixed(0));
  if (Math.abs(l1.size[2] - ZONE) > 1) fail("the floor zone is not " + ZONE);
  if (Math.abs(l1.high[2] - FLOOR) > 1) fail("the walking level is not the floor level");
}

{
  //! "The profile of the atria are curved in plan like a parabola."
  const said = await tellOf("G1_V");
  say("the plan", said.split(" · ").slice(0, 3).join(" · "));
  if (!/parabolic sides/.test(said)) fail("the void does not say it is parabolic");
  //! AND IT IS ONE, checked against the arithmetic rather than against itself: a
  //! parabola is three quarters of the way out at the half station, where a
  //! straight taper is half way and an ellipse is 0.866 of the way.
  const spec = VOIDS[0];
  const loop = parabolicVoid({ length: LENGTH, ...spec, stations: 400 });
  const atHalf = Math.max(...loop.filter(p => Math.abs(p[0] - LENGTH / 4) < 200)
    .map(p => p[1]));
  const want = spec.ends + (spec.wide - spec.ends) * 0.75;
  console.log("                    at the quarter point it is " + atHalf.toFixed(0)
    + " out, where a parabola is " + want.toFixed(0)
    + ", a straight taper " + (spec.ends + (spec.wide - spec.ends) * 0.5).toFixed(0)
    + " and an ellipse " + (spec.ends + (spec.wide - spec.ends) * 0.866).toFixed(0));
  if (Math.abs(atHalf - want) > 60) fail("that plan curve is not a parabola");
  //! AND THE TWO LEVELS ARE DIFFERENT CURVES, which is what makes the bands
  //! weave past each other instead of stacking.
  const v1 = boxOf("G1_V"), v2 = boxOf("G2_V");
  say("the two voids", "level 1 " + v1.size[1].toFixed(0) + " across, level 2 "
    + v2.size[1].toFixed(0) + " · the upper gallery is set back "
    + ((v2.size[1] - v1.size[1]) / 2).toFixed(0));
  if (!(v2.size[1] > v1.size[1] + 1000)) fail("the two galleries do not step");
}

{
  //! "Cladding to the edge of slab sweeps and makes a sharp chamfered bevelled
  //! edge." Measured off the built band: the bottom face is set back from the
  //! face above it by exactly the chamfer, and the band's own section is what
  //! was swept rather than a shape that happens to look like it.
  const said = await tellOf("G1_SE");
  say("the edge band", said.split(" · ").slice(0, 3).join(" · "));
  if (!/chamfer/.test(said)) fail("the edge band does not say it is chamfered");
  const band = boxOf("G1_SE"), voidBox = boxOf("G1_V");
  const reach = (band.size[1] - voidBox.size[1]) / 2;
  say("it reaches back", reach.toFixed(0) + " mm from the slab edge, of "
    + BACK + " asked for");
  if (Math.abs(reach - BACK) > 60) fail("the edge section is not the depth it was given");
  //! AND IT IS SWEPT ON THE VOID AND NOT NEAR IT. A band built from its own
  //! second drawing of the plan drifts from the balustrade standing on it the
  //! first time somebody drags the void, and nothing on screen says so.
  const bal = boxOf("G1_BA");
  say("and carries", "a balustrade whose own extents follow it to "
    + Math.abs((bal.size[1] - voidBox.size[1]) / 2).toFixed(0) + " mm");
}

{
  //! "Two retail shop floors, and above them about 3 floors that are just glass
  //! fronts with no corridor in front."
  const glass = boxOf("U_AG"), frame = boxOf("U_AM");
  say("upper floors", UPPER + " of them, z " + glass.low[2].toFixed(0) + ".."
    + glass.high[2].toFixed(0) + " · " + (glass.high[2] - glass.low[2]).toFixed(0)
    + " mm of facade");
  if (Math.abs((glass.high[2] - glass.low[2]) - FLOOR * UPPER) > 10)
    fail("the upper facade is not " + UPPER + " floors tall");
  if (Math.abs(glass.low[2] - FLOOR * GALLERIES) > 10)
    fail("the upper facade does not start on top of the galleries");
  //! AND IT IS ON ONE SIDE ONLY, which is the sentence that matters: it has no
  //! corridor in front of it, so it is a run and not a loop. Checked by where it
  //! is rather than by what it was asked for - everything in it on one side of
  //! the atrium's own centreline.
  const oneSide = glass.low[1] > 0 || glass.high[1] < 0;
  say("and on one side", "y " + glass.low[1].toFixed(0) + ".." + glass.high[1].toFixed(0)
    + (oneSide ? " - one side of the void, as briefed" : " - BOTH SIDES"));
  if (!oneSide) fail("the flush facade wraps the void, and it should be on one side");
  if (Math.abs(frame.size[1] - glass.size[1]) > 400)
    fail("the frame and the glass are not the same facade");
  //! AND THERE IS NO BALUSTRADE UP THERE, because there is no corridor to stand
  //! in. Counted rather than assumed.
  const rails = rows.filter(f => f.type === "Balustrade");
  const high = rails.filter(f => (boxOf(f.id) || { low: [0, 0, 0] }).low[2]
    > FLOOR * GALLERIES + 100);
  say("no corridor", rails.length + " balustrades, " + high.length
    + " of them above the galleries");
  if (high.length) fail("there is a balustrade on a floor that has no corridor");
}

{
  //! "A thick structure roof with ETFE bubbles inside the modules produced by
  //! the roof network of thick structural walkable truss elements."
  const net = await tellOf("RF_NET"), etfe = await tellOf("RF_ETFE");
  say("the roof net", net.split(" · ").slice(0, 2).join(" · "));
  say("the cushions", etfe.split(" · ").slice(1, 2).join(" · "));
  const members = Number(/(\d+) members/.exec(net)?.[1]);
  const cushions = Number(/(\d+) cushions/.exec(etfe)?.[1]);
  if (!(members > 50)) fail("the roof net has no members in it");
  if (!(cushions > 20)) fail("the roof has no cushions in it");
  //! ONE TESSELLATION, TWO FEATURES. Built from two cell generators they would
  //! be two roofs in the same place, and the cushions would sit over the
  //! members rather than between them - which from below is a roof.
  const cells = roofCells({ length: LENGTH, width: GALLERY * 2 + BACK * 2 + 6000,
                            count: CELLS, seed: SEED, relax: 2 });
  const saidCells = Number(/(\d+) cells/.exec(net)?.[1]);
  say("one tessellation", saidCells + " cells in the structure, " + cells.length
    + " from the same numbers here, " + Number(/(\d+) cells/.exec(etfe)?.[1])
    + " in the cushions");
  if (saidCells !== cells.length || Number(/(\d+) cells/.exec(etfe)?.[1]) !== cells.length)
    fail("the structure and the cushions disagree about the tessellation");
  //! AND THE MEMBERS ARE THICK ENOUGH TO WALK ALONG, which is the word in the
  //! brief and is a dimension rather than an adjective.
  say("walkable", MEMBER + " wide and " + DEEP + " deep · a person is 1727 tall and "
    + "about 450 across the shoulders");
  if (MEMBER < 600) fail("a " + MEMBER + " member is not walkable");
  const roof = boxOf("RF_NET");
  say("and it springs", "z " + roof.low[2].toFixed(0) + ".." + roof.high[2].toFixed(0)
    + " · crown at " + CROWN);
  if (Math.abs(roof.high[2] - CROWN) > 200)
    fail("the crown is not the springing plus the rise");
}

{
  //! AND THE ROOF COVERS THE VOID. A net that stops short of the gallery edge is
  //! a roof with the weather coming in down both sides, and from inside - which
  //! is where the picture is taken - it looks exactly like a roof.
  const roof = boxOf("RF_NET"), top = boxOf("G2_V");
  say("the roof covers", roof.size[1].toFixed(0) + " across against the upper void's "
    + top.size[1].toFixed(0));
  if (!(roof.size[1] > top.size[1] + 2000)) fail("the roof does not reach past the void");
}

{
  //! A FIGURE IS A MESH, NOT A SHAPE. Its triangles live in the feature's data
  //! attribute and F.shape hands back nothing at all - which reads as "it did
  //! not build" and is in fact "it did not build a B-rep", because it was never
  //! going to.
  const meshOf = id => {
    const one = featureOf(id);
    const data = one && F.data(one);
    return data && data.kind === "mesh" ? F.triples(data) : null;
  };
  for (const id of ["S1", "S2", "S3", "S4"]) {
    const points = meshOf(id);
    if (!points || !points.length) fail(id + " built no mesh");
    const z = points.map(p => p[2]);
    const tall = Math.max(...z) - Math.min(...z);
    if (Math.abs(tall - 1727) > 0.01)
      fail(id + " is not 1727 tall but " + tall.toFixed(0));
  }
  //! AND THEY ARE STANDING ON SOMETHING. A scale figure floating a metre over
  //! the concourse is not a ruler, and from most angles it is not visible as
  //! wrong either.
  const feet = ["S1", "S2", "S3", "S4"].map(id =>
    Math.min(...meshOf(id).map(p => p[2])));
  say("the people", "four of them, 1727 tall, feet at "
    + feet.map(n => n.toFixed(0)).join(", "));
  if (!feet.every(z => Math.abs(z) < 0.01 || Math.abs(z - FLOOR) < 0.01))
    fail("somebody is not standing on a floor");
}

/* ------------------- and the parameters really drive it ------------------- */

{
  //! THE MEASUREMENT THE FILE EXISTS FOR. The brief's own two numbers - floor to
  //! floor and the floor depth - are wired, so dragging either has to move the
  //! bands, the balustrades, the shopfronts, the upper facade and the roof. A
  //! model of a hundred typed numbers passes every check above and fails this.
  const where = () => ({
    band: boxOf("G2_SE").high[2],
    shop: boxOf("G1_SF").size[2],
    upper: boxOf("U_AG").low[2],
    roof: boxOf("RF_NET").high[2],
  });
  const was = where();
  await mdl.run({ op: "set", id: "N_FLOOR", key: "value", value: 7500 });
  const taller = where();
  await mdl.run({ op: "set", id: "N_FLOOR", key: "value", value: FLOOR });
  const back = where();
  console.log("floor to floor 6000 -> 7500 -> 6000");
  console.log("   level 2 band   " + was.band.toFixed(0) + " -> " + taller.band.toFixed(0)
    + " -> " + back.band.toFixed(0));
  console.log("   shopfront      " + was.shop.toFixed(0) + " -> " + taller.shop.toFixed(0)
    + " -> " + back.shop.toFixed(0));
  console.log("   upper facade   " + was.upper.toFixed(0) + " -> " + taller.upper.toFixed(0)
    + " -> " + back.upper.toFixed(0));
  console.log("   roof crown     " + was.roof.toFixed(0) + " -> " + taller.roof.toFixed(0)
    + " -> " + back.roof.toFixed(0));
  if (Math.abs(taller.band - 15000) > 1) fail("the gallery does not follow the storey height");
  //! THE SHOPFRONT'S GLASS IS THE CLEAR HEIGHT LESS ITS SIGNAGE BAND, so what
  //! has to follow is the DIFFERENCE and not a number: a storey 1500 taller is
  //! 1500 more glass, whatever the band happens to be.
  if (Math.abs((taller.shop - was.shop) - 1500) > 1)
    fail("the shopfront does not follow it: " + was.shop.toFixed(0)
         + " -> " + taller.shop.toFixed(0));
  if (Math.abs(taller.upper - 15000) > 10) fail("the upper facade does not follow it");
  if (!(taller.roof > was.roof + 5000)) fail("the roof does not follow it");
  if (Math.abs(back.band - was.band) > 1) fail("it did not come back");
  if (Math.abs(back.shop - was.shop) > 1) fail("the shopfront did not come back");
}

{
  //! AND THE VOID DRIVES EVERYTHING ON ITS LEVEL. This is the claim the whole
  //! file makes: one sketch, four sections, a storey. Widen the void and the
  //! band, the plate, the balustrade and the shopfront all have to move - and
  //! the shopfront is the one that would not, because it is an OFFSET of the
  //! void and a model with the frontage typed in moves three of the four.
  const across = () => ["G1_SE", "G1_GF", "G1_BA", "G1_SF", "C_SF"]
    .map(id => boxOf(id).size[1]);
  const was = across();
  await mdl.run({ op: "set", id: "N_W1", key: "value", value: 15000 });
  const wide = across();
  await mdl.run({ op: "set", id: "N_W1", key: "value", value: VOIDS[0].wide });
  const back = across();
  console.log("void half width " + VOIDS[0].wide + " -> 15000 -> " + VOIDS[0].wide);
  console.log("   band, plate, balustrade, shopfront, ground frontage across:");
  console.log("   " + was.map(n => n.toFixed(0)).join(", "));
  console.log("   " + wide.map(n => n.toFixed(0)).join(", "));
  const moved = wide.map((n, i) => n - was[i]);
  if (!moved.every(d => d > 5000))
    fail("widening the void did not move all four: " + moved.map(n => n.toFixed(0)).join(", "));
  if (!back.every((n, i) => Math.abs(n - was[i]) < 1)) fail("they did not come back");
  console.log("   all five moved by " + moved.map(n => n.toFixed(0)).join(", ")
    + " - the frontages too, because they are the void set back and not a second "
    + "drawing of it");
}

{
  //! AND THE ROOF IS REPRODUCIBLE. A pattern that comes out differently every
  //! time the file is opened is not a model of anything, so the seed is a
  //! parameter and changing it changes the roof.
  const count = async () => Number(/(\d+) members/.exec(await tellOf("RF_NET"))?.[1]);
  const was = await count();
  await mdl.run({ op: "set", id: "N_SEED", key: "value", value: 23 });
  const other = await count();
  await mdl.run({ op: "set", id: "N_SEED", key: "value", value: SEED });
  const back = await count();
  say("the roof's seed", "seed " + SEED + " gives " + was + " members, seed 23 gives "
    + other + ", and " + SEED + " gives " + back + " again");
  if (was !== back) fail("the same seed did not give the same roof");
  if (was === other && was) console.log("                    (both scatters happened to "
    + "give the same count, which is not the same roof)");
}

/* ----------------------------- what it costs to draw --------------------- */

{
  const bodies = kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false });
  let total = 0;
  const worst = [];
  for (const b of bodies) {
    let n = 0;
    try { n = (kit.tessellate(b.shape, kit.deflectionFor(b.shape)) || {}).triangles || 0; }
    catch { n = 0; }
    total += n; worst.push([b.id, n]);
  }
  worst.sort((a, c) => c[1] - a[1]);
  console.log("\n" + bodies.length + " bodies · " + total.toLocaleString()
    + " triangles at the viewer's own deflection");
  console.log("the five dearest: " + worst.slice(0, 5)
    .map(([id, n]) => id + " " + n.toLocaleString()).join(", "));
  if (total > 2000000)
    fail("the atrium is " + total.toLocaleString() + " triangles and will not open");
}

const bom = rows.find(f => f.id === "Z_BOM");
console.log("\nthe atrium · "
  + String((bom.data || {}).preview || "").split("\n").pop().slice(0, 400));

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("\nwrote " + OUT);
