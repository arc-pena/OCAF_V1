// Builds docs/data/samples/sweep_gallery.json — the sweep gallery, at the size
// of a building and made of the parts of one.
//
//     node scripts/build_sweep_gallery.mjs
//
// WHAT CHANGED AND WHY. The first version was fourteen abstract sweeps, 150 mm
// tall, on rails invented to show the setting off. Every cell was a flat list
// of features at a pitch worked out by measuring. It demonstrated the API and
// nothing else: nobody looks at a 22 mm square swept round a bend and learns
// what "Facing the guide" is FOR.
//
// This is the same fourteen behaviours on the elements of a real facade, at
// real sizes, in a model built the way a modeller would build one:
//
//   ONE GEOMETRICAL SET PER EXAMPLE, named for the element and the behaviour,
//   so the tree reads as a schedule of parts and each one folds shut.
//
//   THE SYSTEM IS SETS TOO. 00 Parameters holds the numbers, with the slider
//   each one deserves - storeys are whole numbers from 6 to 20, a storey height
//   travels 2.6 to 4.5 m in 50s. 01 Levels turns them into the stack. 02 Plan
//   is the L, drawn as arcs and lines under constraint. Every example's station
//   is an Expression over those numbers, so dragging the storey height restacks
//   the whole gallery and steps the terraces back with it.
//
//   THE PROFILES ARE THE BUILDING'S. Read off photographs of 520 West 28th
//   Street: the bullnose band at every slab edge, the lenticular rib of the
//   exoskeleton, the stadium cap on the glass balustrade, the box mullion, the
//   round post. Where the catalogue already has the shape parametrically -
//   Oblong is a handrail cap, Section's rectangular hollow is a mullion - the
//   node is used and its dimensions are WIRED to the numbers. Where it does not
//   - the bullnose, the rib - the profile is a sketch of arcs and lines held by
//   tangencies and coincidences, which is how it would be drawn.
//
//   THE RAILS ARE THE BUILDING'S TOO, and they are arcs and lines because that
//   is what this project is: a slab edge that runs straight, turns through a
//   tangent arc and runs on; a rib bowed one storey high; two arcs crossing in
//   an S where the exoskeleton weaves; a plan kink where the L turns.
//
// WHAT IS PARAMETRIC AND WHAT IS NOT, said plainly. A sketch's drawing is
// literal JSON: its numbers cannot be wired to a slider, only solved against
// its own constraints. So every profile that could be a catalogue node IS one,
// with wired dimensions, and the sketched ones carry their relations instead.
// Placement, level, terrace setback and bay are wired throughout.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "data", "samples", "sweep_gallery.json");
const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";

const r4 = v => Math.round(v * 1e4) / 1e4;

/* ====================================================== sketch shorthand */

const LINE = (id, a, b) => ({ id, type: "line", a, b });

//! AN ARC FROM a TO b, BOWING s TO THE RIGHT of the way it is going. That is
//! how an arc is described on a drawing - two ends and how far it bows - and
//! never as a centre and two angles, which is how it has to be STORED.
//!
//! RIGHT rather than left, and it matters. A stored arc runs anticlockwise from
//! a0 to a1, so for the anticlockwise sweep from a to b to be the MINOR arc the
//! centre has to be on the left of a->b, which puts the bow on the right. Get
//! that backwards and nothing fails: the arc is drawn the long way round
//! instead, which builds perfectly and is two and a half times the size it
//! should be. The first version of this file did exactly that on every arc in
//! it, and the only symptom was a gallery nineteen metres wide.
//!
//! So it is checked, here, against the stored form: both ends where they were
//! asked for, and the bow the depth it was asked for.
function ARC(id, a, b, s) {
  const dx = b[0] - a[0], dy = b[1] - a[1], chord = Math.hypot(dx, dy);
  if (!(s > 0)) throw new Error(id + ": an arc bows by more than nothing");
  if (s > chord / 2 + 1e-9)
    throw new Error(id + ": a bow of " + s + " is more than half a chord of " + Math.round(chord));
  const radius = (chord * chord / 4 + s * s) / (2 * s);
  const right = [dy / chord, -dx / chord];
  const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const c = [mid[0] - right[0] * (radius - s), mid[1] - right[1] * (radius - s)];
  let a0 = Math.atan2(a[1] - c[1], a[0] - c[0]);
  let a1 = Math.atan2(b[1] - c[1], b[0] - c[0]);
  while (a1 < a0) a1 += Math.PI * 2;
  //! The angles are kept to a nanoradian rather than to the ten-thousandth the
  //! rest of this file rounds to: the plan's facade arcs have a radius of 125
  //! metres, and a ten-thousandth of a radian on one of those is twelve
  //! millimetres of end point.
  const r9 = v => Math.round(v * 1e9) / 1e9;
  const el = { id, type: "arc", c: [r4(c[0]), r4(c[1])], r: r4(radius), a0: r9(a0), a1: r9(a1) };
  const at = t => [el.c[0] + el.r * Math.cos(t), el.c[1] + el.r * Math.sin(t)];
  const off = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
  const bowed = off(at((el.a0 + el.a1) / 2), mid);
  const slack = Math.max(0.01, radius * 1e-6);
  if (off(at(el.a0), a) > slack || off(at(el.a1), b) > slack || Math.abs(bowed - s) > slack)
    throw new Error(id + ": stored as an arc bowing " + Math.round(bowed)
      + " rather than " + Math.round(s) + " - it is going the long way round");
  return el;
}

const MEET = (a, b) => ({ type: "coincident", of: [a, b] });
const TANGENT = (a, b) => ({ type: "tangent", of: [a, b] });
const HORIZ = a => ({ type: "horizontal", of: [a] });
const VERT = a => ({ type: "vertical", of: [a] });

/* ================================================================= rails

   All of them about 3 m by 3 m, which is a storey and a structural bay, and
   all of them arcs and lines. */

//! A SLAB EDGE: runs straight, turns through a tangent arc, runs on. The whole
//! north face of the building is this curve at a larger radius.
//! THE ARC IS A QUARTER CIRCLE, and it has to be. Tangent to a horizontal at
//! one end and to a vertical at the other leaves the solver exactly one answer,
//! and drawing anything else here is asking it to find that answer from a long
//! way off: the first version bulged 620 where 439 was the only value that fits
//! a 1500 radius, and the solver obliged by growing the cell to nineteen metres.
const QUARTER = r => r - Math.sqrt(r * r - (r * r * 2) / 4);
const railTurn = () => ({
  //! The arc is a quarter circle and has to be: tangent to a horizontal at one
  //! end and to a vertical at the other leaves exactly one answer, and drawing
  //! anything else asks the solver to find it from a long way off.
  elements: [LINE("e1", [0, 0], [900, 0]),
             ARC("e2", [900, 0], [2400, 1500], QUARTER(1500)),
             LINE("e3", [2400, 1500], [2400, 3000])],
  constraints: [MEET("e1.b", "e2.start"), MEET("e2.end", "e3.a"),
                TANGENT("e1", "e2"), TANGENT("e3", "e2"),
                HORIZ("e1"), VERT("e3")],
});

//! A RIB: one storey of rise, bowed 900 out. The exoskeleton is this arc,
//! handed and repeated, and where two of them cross is where the lens-shaped
//! openings in the photographs come from.
const railBow = () => ({ elements: [ARC("e1", [0, 0], [0, 3000], 900)], constraints: [] });

//! THE WEAVE: two arcs meeting tangentially, which is the S the ribs make as
//! they splay apart and come back together at the floor band.
//! The second arc is drawn BACKWARDS - from the far end to the join - because
//! an arc here bulges to the left of the way it is going, and an S is two arcs
//! bulging opposite ways. Turning one round is how you say that without a sign
//! convention nobody can read off a drawing.
const railWeave = () => ({
  //! The second arc is drawn from the far end back to the join, because an S is
  //! two arcs bowing opposite ways and an arc here bows to the right of the way
  //! it is going. Turning one round says that without a sign convention nobody
  //! can read off a drawing.
  //!
  //! NO TANGENT RELATION between them. They ARE tangent, by construction; but
  //! this solver reads tangent-between-two-curves as "these two circles touch",
  //! which two circles that already touch satisfy from anywhere at all.
  elements: [ARC("e1", [0, 0], [1500, 1500], QUARTER(1500)),
             ARC("e2", [3000, 3000], [1500, 1500], QUARTER(1500))],
  constraints: [MEET("e1.end", "e2.end")],
});

//! THE PLAN KINK where the L turns. The three corner modes are the only thing
//! that tells three of these cells apart, and on a smooth rail they would be
//! identical - measured: 77.80 cm3 each. A rail has to KINK for the question to
//! mean anything, and a building has exactly one place where it does.
const railKink = () => ({
  elements: [LINE("e1", [0, 0], [1600, 0]), LINE("e2", [1600, 0], [1600, 3000])],
  constraints: [MEET("e1.b", "e2.a"), HORIZ("e1"), VERT("e2")],
});

//! A BALCONY EDGE: straight, round the end of the racetrack, straight back.
//! The rounded ends of every balcony slab in the photographs are this.
const railNose = () => ({
  elements: [LINE("e1", [0, 0], [1800, 0]),
             ARC("e2", [1800, 0], [1800, 1400], 700),
             LINE("e3", [1800, 1400], [300, 1400])],
  constraints: [MEET("e1.b", "e2.start"), MEET("e2.end", "e3.a"),
                TANGENT("e1", "e2"), TANGENT("e3", "e2"), HORIZ("e1"), HORIZ("e3")],
});

/* ============================================================== profiles

   Read off the photographs. Sizes in millimetres, none below 300. */

//! THE SLAB EDGE BAND. Flat on top because it is a balcony floor, a deep
//! bullnose at the front, and the soffit sweeping back and up under it - which
//! is the shadow line that makes every one of those floor bands read as a
//! single ribbon rather than as the edge of a slab.
const trimProfile = () => ({
  elements: [LINE("t1", [-900, -40], [0, -210]),
             ARC("t2", [0, -210], [0, 210], 210),
             LINE("t3", [0, 210], [-900, 210]),
             LINE("t4", [-900, 210], [-900, -40])],
  constraints: [MEET("t1.b", "t2.start"), MEET("t2.end", "t3.a"),
                MEET("t3.b", "t4.a"), MEET("t4.b", "t1.a"),
                TANGENT("t3", "t2"), HORIZ("t3"), VERT("t4")],
});

//! THE EXOSKELETON RIB. A teardrop: a round nose on the outside and two flanks
//! running tangentially back to a point on the inside. The point is not a
//! drawing flourish - it is where two ribs meet and become one, and it is why
//! the openings between them come to a point at top and bottom.
const ribProfile = () => ({
  elements: [ARC("r1", [300, -190], [300, 190], 190),
             LINE("r2", [300, 190], [-620, 0]),
             LINE("r3", [-620, 0], [300, -190])],
  constraints: [MEET("r1.end", "r2.a"), MEET("r2.b", "r3.a"), MEET("r3.b", "r1.start"),
                TANGENT("r2", "r1"), TANGENT("r3", "r1")],
});

/* =============================================================== the cells

   Fourteen, one geometrical set each. `face` says which way the rail plane
   looks: the slab edges and balcony noses are drawn in plan, everything that
   rises is drawn on the facade. */

const CELLS = [
  { n: 1, part: "Slab edge band", says: "Square to the rail",
    face: "plan", rail: railTurn, profile: "trim" },
  { n: 2, part: "Balcony nose", says: "Frenet",
    face: "plan", rail: railNose, profile: "trim", args: { hold: "Frenet" } },
  { n: 3, part: "Handrail cap", says: "Upright",
    face: "plan", rail: railNose, profile: "cap", args: { hold: "Upright" } },
  { n: 4, part: "Rib, woven", says: "Facing the guide",
    face: "front", rail: railBow, profile: "rib", guide: 1400,
    args: { hold: "Facing the guide" } },
  { n: 5, part: "Mullion at the plan kink", says: "Right corner",
    face: "front", rail: railKink, profile: "mullion", args: { corner: "Right corner" } },
  { n: 6, part: "Mullion at the plan kink", says: "Round corner",
    face: "front", rail: railKink, profile: "mullion", args: { corner: "Round corner" } },
  { n: 7, part: "Mullion at the plan kink", says: "Transformed",
    face: "front", rail: railKink, profile: "mullion", args: { corner: "Transformed" } },
  { n: 8, part: "Rib flaring out", says: "Scaled to 2.5",
    face: "front", rail: railBow, profile: "rib", args: { scale: 2.5 } },
  { n: 9, part: "Rib flaring, eased", says: "Scaled to 2.5, eased",
    face: "front", rail: railBow, profile: "rib", args: { scale: 2.5, easing: "Eased" } },
  { n: 10, part: "Rib tapering in", says: "Scaled to 0.4",
    face: "front", rail: railBow, profile: "rib", args: { scale: 0.4 } },
  { n: 11, part: "Band becoming a handrail", says: "Into a second profile",
    face: "plan", rail: railTurn, profile: "trim", becoming: "cap" },
  { n: 12, part: "Balcony soffit", says: "As a surface",
    face: "plan", rail: railNose, profile: "sheet", args: { cap: "Surface" } },
  { n: 13, part: "Balustrade post", says: "A round section",
    face: "front", rail: railWeave, profile: "post" },
  { n: 14, part: "Parapet over the corner", says: "Squaring up a kink",
    face: "front", rail: railKink, profile: "angle" },
];

/* ============================================ the parameters, and their sliders

   A slider is per feature and per argument now, so each of these gets the one
   it deserves rather than the catalogue's general-purpose 1 to 10000.        */

const PARAMS = [
  ["N_STOREY", "Storey height", 3200, { min: 2600, max: 4500, step: 50 }],
  ["N_BAY", "Structural bay", 5400, { min: 3000, max: 9000, step: 100 }],
  ["N_SETBACK", "Terrace step", 1500, { min: 0, max: 4000, step: 100 }],
  ["N_ARMA", "Arm A, along the street", 30000, { min: 12000, max: 60000, step: 500 }],
  ["N_ARMB", "Arm B, the return", 21000, { min: 9000, max: 45000, step: 500 }],
  ["N_DEPTH", "Building depth", 14000, { min: 8000, max: 26000, step: 250 }],
  ["N_BOW", "Facade bow", 900, { min: 0, max: 3000, step: 50 }],
  ["N_CAP_L", "Handrail cap, along", 460, { min: 300, max: 900, step: 10 }],
  ["N_CAP_W", "Handrail cap, across", 320, { min: 300, max: 600, step: 10 }],
  ["N_MULL_D", "Mullion depth", 380, { min: 300, max: 1200, step: 10 }],
  ["N_MULL_W", "Mullion width", 300, { min: 300, max: 800, step: 10 }],
  ["N_POST_R", "Balustrade post radius", 170, { min: 150, max: 400, step: 5 }],
  ["N_SHEET_W", "Soffit sheet, wide", 1200, { min: 300, max: 3000, step: 50 }],
  ["N_SHEET_T", "Soffit sheet, thick", 300, { min: 300, max: 600, step: 10 }],
  ["N_ANGLE_D", "Parapet angle, depth", 420, { min: 300, max: 900, step: 10 }],
  ["N_ANGLE_W", "Parapet angle, width", 300, { min: 300, max: 900, step: 10 }],
];

/* ------------------------------------------------------------- the model */

const ACROSS = 5;
//! EVERY OTHER STOREY. A cell is 3 m tall and a storey is 3.2 m, so one row of
//! cells per storey would have the row above sitting in the row below. Two
//! storeys to a row is the double-height band the building has at its base, and
//! it leaves 3.4 m of daylight between rows.
const ROW_STOREYS = 2;
//! Terracing starts above the first row, the way it does on the building: the
//! lower floors hold the street line and the upper ones step back.
const TERRACE_FROM = 1;

const features = [];
const set = (id, name) => features.push({ id, type: "GeometricalSet", name });
const put = (parent, f) => { features.push({ ...f, parent }); return f.id; };

/* -------------------------------------------------------- 00 Parameters */
set("GS_PARAM", "00 Parameters");
for (const [id, name, value, range] of PARAMS)
  put("GS_PARAM", { id, type: "Number", name, args: { value }, ranges: { value: range } });
put("GS_PARAM", { id: "N_STOREYS", type: "Number", name: "Storeys", args: { value: 11 },
                  //! Whole numbers, because there is no such thing as 10.5 of
                  //! them, and this is the slider that says so.
                  ranges: { value: { min: 6, max: 20, step: 1, whole: true } } });

/* ------------------------------------------------------------ 01 Levels */
set("GS_LEVELS", "01 Levels");
put("GS_LEVELS", { id: "L_SER", type: "Series", name: "Level numbers",
                   args: { start: 0, step: 1, count: { value: 11, from: "N_STOREYS" } } });
//! ONE NODE, A ROW OF ANSWERS. The series arrives as a list, so this is the
//! height of EVERY level rather than of one, and the Point below is the whole
//! stack of level markers rather than one marker.
put("GS_LEVELS", { id: "L_Z", type: "Expression", name: "Level height",
                   args: { a: { value: 0, from: "L_SER" },
                           b: { value: 3200, from: "N_STOREY" }, formula: "a * b" } });
put("GS_LEVELS", { id: "L_SB", type: "Expression", name: "Terrace setback",
                   args: { a: { value: 0, from: "L_SER" },
                           b: { value: 1500, from: "N_SETBACK" },
                           formula: "Math.max(0, a - 5) * b" } });
put("GS_LEVELS", { id: "L_TOPZ", type: "Expression", name: "Height to the top",
                   args: { a: { value: 11, from: "N_STOREYS" },
                           b: { value: 3200, from: "N_STOREY" }, formula: "(a - 1) * b" } });
put("GS_LEVELS", { id: "L_PTS", type: "Point", name: "Level markers",
                   args: { kind: "Coordinates", x: -4000,
                           y: { value: 0, from: "L_SB" }, z: { value: 0, from: "L_Z" } } });
//! ONE TAG, not eleven. A Tag on a row of points labels every point in it, and
//! eleven pills all reading "level" told nobody anything while sitting on top
//! of the model. The marks are the levels; the words go on the stack itself.
put("GS_LEVELS", { id: "L_TOP", type: "Point", name: "Head of the stack",
                   args: { kind: "Coordinates", x: -4000, y: 0,
                           z: { value: 35200, from: "L_TOPZ" } } });
put("GS_LEVELS", { id: "L_TAG", type: "Tag", name: "Level stack",
                   args: { at: { ref: "L_TOP" }, note: "levels", size: "Small" } });

/* ------------------------------------------------- 02 Plan — the L, in arcs */
set("GS_PLAN", "02 Plan — the L");
put("GS_PLAN", { id: "PN_O", type: "Point", name: "Plan origin",
                 args: { kind: "Coordinates", x: -9000, y: -6000, z: 0 } });
put("GS_PLAN", { id: "PN_Z", type: "Vector", name: "Up", args: { dx: 0, dy: 0, dz: 1 } });
put("GS_PLAN", { id: "PN_X", type: "Vector", name: "East", args: { dx: 1, dy: 0, dz: 0 } });
put("GS_PLAN", { id: "PN_PL", type: "Plane", name: "Ground",
                 args: { kind: "Origin and normal", origin: { ref: "PN_O" },
                         normal: { ref: "PN_Z" }, xdir: { ref: "PN_X" }, size: 8000 } });
//! THE L, and the two long faces are arcs because on this building they are.
//! Held by four right angles and six coincidences, so it is a shape with
//! relations on it rather than twelve numbers that happen to line up.
const ARM_A = 30000, ARM_B = 21000, DEPTH = 14000, BOW = 900;
put("GS_PLAN", { id: "PN_SK", type: "Sketch", name: "Footprint",
  args: { plane: { ref: "PN_PL" }, faces: "Leave as wires", solve: "Solve",
    drawing: {
      elements: [
        ARC("p1", [0, 0], [ARM_A, 0], BOW),
        LINE("p2", [ARM_A, 0], [ARM_A, DEPTH]),
        ARC("p3", [ARM_A, DEPTH], [DEPTH, DEPTH], BOW * 0.5),
        LINE("p4", [DEPTH, DEPTH], [DEPTH, ARM_B]),
        LINE("p5", [DEPTH, ARM_B], [0, ARM_B]),
        LINE("p6", [0, ARM_B], [0, 0]),
      ],
      constraints: [
        MEET("p1.end", "p2.a"), MEET("p2.b", "p3.start"), MEET("p3.end", "p4.a"),
        MEET("p4.b", "p5.a"), MEET("p5.b", "p6.a"), MEET("p6.b", "p1.start"),
        VERT("p2"), VERT("p4"), HORIZ("p5"), VERT("p6"),
      ],
    } } });

/* ------------------------------------------- 03 Massing — the terraced L

   AND THIS IS WHERE Arm A, Arm B AND Building depth DO THEIR WORK. The
   footprint above is a sketch, and a sketch's numbers are literal JSON - they
   are solved against its own relations and there is no way to wire a slider to
   one. So the drawn footprint says what the shape IS, with its bowed faces and
   its right angles, and the massing here says how BIG it is: two rectangles
   whose sides are the parameters, extruded to a height that is the storey
   count times the storey height, with a third block set back on top of them.
   Drag Arm A and the building grows; drag Storeys and it rises; drag Terrace
   step and the top block walks backwards over the ones below.               */
set("GS_MASS", "03 Massing — the terraced L");
put("GS_MASS", { id: "M_H", type: "Expression", name: "Height to the terrace",
                 args: { a: { value: 11, from: "N_STOREYS" },
                         b: { value: 3200, from: "N_STOREY" }, formula: "Math.round(a * 0.6) * b" } });
put("GS_MASS", { id: "M_TOP", type: "Expression", name: "Height of the terraces",
                 args: { a: { value: 11, from: "N_STOREYS" },
                         b: { value: 3200, from: "N_STOREY" },
                         formula: "(a - Math.round(a * 0.6)) * b" } });
put("GS_MASS", { id: "M_TD", type: "Expression", name: "Terraced depth",
                 args: { a: { value: 14000, from: "N_DEPTH" },
                         b: { value: 1500, from: "N_SETBACK" }, formula: "a - 2 * b" } });
put("GS_MASS", { id: "M_A", type: "Rectangle", name: "Arm A footprint",
                 args: { plane: { ref: "PN_PL" }, onPlane: "Is what it lies on",
                         anchor: "A corner", radius: 1200,
                         width: { value: 30000, from: "N_ARMA" },
                         height: { value: 14000, from: "N_DEPTH" } } });
put("GS_MASS", { id: "M_B", type: "Rectangle", name: "Arm B footprint",
                 args: { plane: { ref: "PN_PL" }, onPlane: "Is what it lies on",
                         anchor: "A corner", radius: 1200,
                         width: { value: 14000, from: "N_DEPTH" },
                         height: { value: 21000, from: "N_ARMB" } } });
for (const [arm, of] of [["A", "M_A"], ["B", "M_B"]])
  put("GS_MASS", { id: "M_EX" + arm, type: "Extrude", name: "Arm " + arm,
                   appearance: { finish: "glass" },
                   args: { profile: { ref: of }, limit: "Distance", cap: "Surface",
                           way: "Normal to the profile",
                           distance: { value: 21120, from: "M_H" } } });
//! THE TERRACE, set back by the same number that walks the upper rows of the
//! gallery backwards - which is the whole point of the parameter being a
//! parameter rather than two numbers that happen to agree today.
put("GS_MASS", { id: "M_TPL", type: "Plane", name: "Terrace level",
                 args: { kind: "Offset from a plane", from: { ref: "PN_PL" },
                         offset: { value: 21120, from: "M_H" }, size: 8000 } });
put("GS_MASS", { id: "M_TR", type: "Rectangle", name: "Terraced footprint",
                 args: { plane: { ref: "M_TPL" }, onPlane: "Is what it lies on",
                         anchor: "A corner", radius: 1200,
                         width: { value: 30000, from: "N_ARMA" },
                         height: { value: 11000, from: "M_TD" } } });
put("GS_MASS", { id: "M_EXT", type: "Extrude", name: "Terraces",
                 appearance: { finish: "glass" },
                 args: { profile: { ref: "M_TR" }, limit: "Distance", cap: "Surface",
                         way: "Normal to the profile",
                         distance: { value: 14080, from: "M_TOP" } } });

/* =========================================================== the examples */

//! WHERE A CELL STANDS, as arithmetic over the building's own numbers rather
//! than as three coordinates. Drag Structural bay and the row spreads; drag
//! Storey height and the rows restack; drag Terrace step and everything above
//! the first row walks backwards, which is the terracing.
function station(cell, at, col, row) {
  const id = s => "C" + cell.n + "_" + s;
  put(at, { id: id("X"), type: "Expression", name: "Bay " + (col + 1),
            args: { a: { value: 5400, from: "N_BAY" }, formula: "a * " + col } });
  put(at, { id: id("Y"), type: "Expression", name: "Terrace setback",
            args: { a: { value: 1500, from: "N_SETBACK" },
                    formula: "a * " + Math.max(0, row - TERRACE_FROM + 1) } });
  put(at, { id: id("Z"), type: "Expression", name: "Level " + (row * ROW_STOREYS),
            args: { a: { value: 3200, from: "N_STOREY" },
                    formula: "a * " + row * ROW_STOREYS } });
  put(at, { id: id("O"), type: "Point", name: "Station",
            args: { kind: "Coordinates", x: { value: 0, from: id("X") },
                    y: { value: 0, from: id("Y") }, z: { value: 0, from: id("Z") } } });
  return id("O");
}

//! The profile, mounted on a plane square across the rail. Every one the
//! catalogue can make parametrically IS made parametrically, with its
//! dimensions wired to 00 Parameters; the two it cannot are sketches carrying
//! their relations instead.
//! WHAT THE PART IS MADE OF, which follows the profile because that is what
//! decides it: the bands are the concrete slab edge, the ribs and the handrails
//! are the metal exoskeleton, the soffit lining is a sheet.
const FINISH = { trim: "concrete", rib: "brass", cap: "chrome", mullion: "aluminium",
                 post: "steel", sheet: "matte", angle: "aluminium" };

function profileOf(kind, at, id, plane) {
  const on = { plane: { ref: plane } };
  switch (kind) {
    case "cap":
      return put(at, { id, type: "Oblong", name: "Handrail cap",
        args: { ...on, onPlane: "Is what it lies on",
                length: { value: 460, from: "N_CAP_L" },
                width: { value: 320, from: "N_CAP_W" } } });
    case "mullion":
      return put(at, { id, type: "Section", name: "Box mullion",
        args: { ...on, kind: "Rectangular hollow",
                depth: { value: 380, from: "N_MULL_D" },
                width: { value: 300, from: "N_MULL_W" }, web: 10, flange: 10 } });
    case "post":
      return put(at, { id, type: "Circle", name: "Balustrade post",
        args: { ...on, onPlane: "Is what it lies on", kind: "A radius",
                radius: { value: 170, from: "N_POST_R" } } });
    case "sheet":
      return put(at, { id, type: "Rectangle", name: "Soffit sheet",
        args: { ...on, onPlane: "Is what it lies on", anchor: "Its middle",
                width: { value: 1200, from: "N_SHEET_W" },
                height: { value: 300, from: "N_SHEET_T" }, radius: 60 } });
    case "angle":
      return put(at, { id, type: "Section", name: "Parapet angle",
        args: { ...on, kind: "L angle",
                depth: { value: 420, from: "N_ANGLE_D" },
                width: { value: 300, from: "N_ANGLE_W" }, web: 14, flange: 14 } });
    case "rib":
      return put(at, { id, type: "Sketch", name: "Exoskeleton rib",
        args: { ...on, faces: "Make faces", solve: "Solve", drawing: ribProfile() } });
    default:
      return put(at, { id, type: "Sketch", name: "Slab edge band",
        args: { ...on, faces: "Make faces", solve: "Solve", drawing: trimProfile() } });
  }
}

CELLS.forEach((cell, i) => {
  const col = i % ACROSS, row = Math.floor(i / ACROSS);
  const id = s => "C" + cell.n + "_" + s;
  set(id("GS"), String(cell.n).padStart(2, "0") + " " + cell.part + " — " + cell.says);
  const at = id("GS");
  const origin = station(cell, at, col, row);

  //! WHICH WAY THE RAIL PLANE LOOKS. A slab edge is drawn in plan; anything
  //! that rises is drawn on the facade. Given an X direction rather than
  //! letting OpenCascade pick one, so a rail drawn 3 m across is 3 m across the
  //! building and not 3 m along whatever axis its arithmetic reached.
  const plan = cell.face === "plan";
  put(at, { id: id("VN"), type: "Vector", name: plan ? "Up" : "Out",
            args: plan ? { dx: 0, dy: 0, dz: 1 } : { dx: 0, dy: -1, dz: 0 } });
  put(at, { id: id("VX"), type: "Vector", name: "Across", args: { dx: 1, dy: 0, dz: 0 } });
  put(at, { id: id("PL"), type: "Plane", name: plan ? "Floor plane" : "Facade plane",
            args: { kind: "Origin and normal", origin: { ref: origin },
                    normal: { ref: id("VN") }, xdir: { ref: id("VX") }, size: 3400 } });
  put(at, { id: id("RAIL"), type: "Sketch", name: "Rail",
            args: { plane: { ref: id("PL") }, faces: "Leave as wires", solve: "Solve",
                    drawing: cell.rail() } });

  //! THE NEIGHBOURING RIB, for the one cell that is about being guided by it.
  if (cell.guide) {
    put(at, { id: id("GPL"), type: "Plane", name: "Neighbour's plane",
              args: { kind: "Offset from a plane", from: { ref: id("PL") },
                      offset: -cell.guide, size: 3400 } });
    put(at, { id: id("GUIDE"), type: "Sketch", name: "Neighbouring rib",
              args: { plane: { ref: id("GPL") }, faces: "Leave as wires", solve: "Solve",
                      drawing: cell.rail() } });
  }

  put(at, { id: id("SPL"), type: "Plane", name: "Square across the rail",
            args: { kind: "Normal to a curve", curve: { ref: id("RAIL") }, at: 0, size: 1400 } });
  profileOf(cell.profile, at, id("SEC"), id("SPL"));

  //! A SECTION THAT BECOMES ANOTHER IS DRAWN WHERE IT ENDS UP. OpenCascade
  //! orders the profiles by where they sit, so the second one needs its own
  //! plane at the far end of the rail - measured: both on one plane and the
  //! sweep will not build at all.
  if (cell.becoming) {
    put(at, { id: id("SPL2"), type: "Plane", name: "Square across, at the far end",
              args: { kind: "Normal to a curve", curve: { ref: id("RAIL") }, at: 1, size: 1400 } });
    profileOf(cell.becoming, at, id("SEC2"), id("SPL2"));
  }

  put(at, { id: id("SW"), type: "Sweep", name: cell.part,
    appearance: { finish: FINISH[cell.profile] || "aluminium" },
    args: { profile: { ref: id("SEC") }, spine: { ref: id("RAIL") },
            cap: (cell.args && cell.args.cap) || "Solid",
            ...(cell.becoming ? { into: { ref: id("SEC2") } } : {}),
            ...(cell.guide ? { guide: { ref: id("GUIDE") } } : {}),
            ...Object.fromEntries(Object.entries(cell.args || {}).filter(([k]) => k !== "cap")) } });

  //! The number, as a text dot over the middle of what it names rather than as
  //! geometry - see the Tag node.
  put(at, { id: id("TP"), type: "Point", name: "Tag point",
            args: { kind: "Centre of", of: { ref: id("SW") } } });
  put(at, { id: id("TAG"), type: "Tag", name: "Number",
            args: { at: { ref: id("TP") }, note: String(cell.n), lift: 2400, size: "Large" } });
});

const model = {
  format: "ocaf-parametric-model", version: 1,
  name: "Sweep gallery — a facade", units: "mm", features,
};

/* ================================================================ checking

   Built for real, and then asked the questions that would otherwise be
   answered by looking at a picture and hoping.                             */

const initModule = (await import(WASM + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule, wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}), select: () => {}, selected: () => null });
const kit = kernel.toolkit();
const bodyOf = id => kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
  .find(b => b.id === id);

const out = await mdl.run({ op: "model", model });
const rows = out.tree.features;
console.log(features.length + " features · " + CELLS.length + " cells · "
  + rows.filter(f => f.type === "GeometricalSet").length + " sets");
for (const cell of CELLS) {
  const row = rows.find(f => f.id === "C" + cell.n + "_SW");
  const body = bodyOf("C" + cell.n + "_SW");
  const box = body ? kit.extents(body.shape) : null;
  const railBody = kit.bodies({ notCategories: [], sewMeshes: false, visible: false })
    .find(b => b.id === "C" + cell.n + "_RAIL");
  const railBox = railBody ? kit.extents(railBody.shape) : null;
  console.log("  " + String(cell.n).padStart(2) + "  " + cell.says.padEnd(24)
    + (railBox ? "rail " + railBox.size.map(n => (n / 1000).toFixed(2)).join("x") + "  " : "")
    + (row && row.error ? "ERROR " + row.error.slice(0, 60)
       : box ? box.size.map(n => (n / 1000).toFixed(2)).join(" x ") + " m" : "no body"));
}
const bad = rows.filter(f => f.error);
if (bad.length) {
  console.log("\n" + bad.length + " feature(s) in error:");
  for (const f of bad.slice(0, 12))
    console.log("   " + f.id + " (" + f.type + ") " + f.error.slice(0, 90));
  process.exit(1);
}

//! THE PARAMETERS REALLY DRIVE IT. A model that merely CONTAINS numbers and a
//! model whose numbers are wired look exactly the same until one of them is
//! dragged, so the storey height is dragged here and the answer is measured.
const low = id => kit.extents(bodyOf(id).shape).low;
const wasZ = low("C14_SW")[2], wasY = low("C14_SW")[1];
await mdl.run({ op: "set", id: "N_STOREY", key: "value", value: 4200 });
const lifted = low("C14_SW")[2] - wasZ;
await mdl.run({ op: "set", id: "N_STOREY", key: "value", value: 3200 });
await mdl.run({ op: "set", id: "N_SETBACK", key: "value", value: 2500 });
const walked = low("C14_SW")[1] - wasY;
await mdl.run({ op: "set", id: "N_SETBACK", key: "value", value: 1500 });
const rowsUp = (CELLS.length - 1) / ACROSS | 0;
console.log("\nstorey height 3200 -> 4200 lifts the top row " + (lifted / 1000).toFixed(2)
  + " m (expected " + (1000 * ROW_STOREYS * rowsUp / 1000).toFixed(2) + ")");
console.log("terrace step 1500 -> 2500 walks it back " + (walked / 1000).toFixed(2)
  + " m (expected " + (1000 * (rowsUp - TERRACE_FROM + 1) / 1000).toFixed(2) + ")");
if (Math.abs(lifted - 1000 * ROW_STOREYS * rowsUp) > 1
    || Math.abs(walked - 1000 * (rowsUp - TERRACE_FROM + 1)) > 1) {
  console.log("the parameters are not driving the stack - the gallery is not written");
  process.exit(1);
}

//! NOTHING TOUCHES. Same test as the first version and the same reason: a grid
//! where two elements run into each other is a grid where nobody can tell
//! which number belongs to which.
const boxes = CELLS.map(cell => ({ n: cell.n, box: kit.extents(bodyOf("C" + cell.n + "_SW").shape) }));
let touching = 0, closest = Infinity;
for (let i = 0; i < boxes.length; i++)
  for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i].box, b = boxes[j].box;
    const gaps = [0, 1, 2].map(k => Math.max(a.low[k] - b.high[k], b.low[k] - a.high[k]));
    const clear = Math.max(...gaps);
    if (clear < 0) { touching++; console.log("  TOUCHING: " + boxes[i].n + " and " + boxes[j].n); }
    else closest = Math.min(closest, clear);
  }
console.log("pairs checked " + (boxes.length * (boxes.length - 1) / 2)
  + " · touching " + touching + " · closest approach " + (closest / 1000).toFixed(2) + " m");
if (touching) { console.log("the gallery is not written"); process.exit(1); }

//! EVERY RAIL IS STILL ABOUT 3 m BY 3 m. A sketch is solved against its
//! relations, and a set of relations with no nearby answer is satisfied by a
//! distant one: an over-constrained turn grew to nineteen metres and built
//! perfectly while doing it. Nothing on screen says "this was solved somewhere
//! else"; the size does.
const RAIL_MOST = 4500;
for (const cell of CELLS) {
  const body = kit.bodies({ notCategories: [], sewMeshes: false, visible: false })
    .find(b => b.id === "C" + cell.n + "_RAIL");
  if (!body) continue;
  const box = kit.extents(body.shape);
  const worst = Math.max(...box.size);
  console.log("  rail " + String(cell.n).padStart(2) + "  "
    + box.size.map(n => (n / 1000).toFixed(2)).join(" x ") + " m"
    + (worst > RAIL_MOST ? "   SOLVED SOMEWHERE ELSE" : ""));
  if (worst > RAIL_MOST) {
    console.log("rail " + cell.n + " solved to " + Math.round(worst)
      + " mm - the gallery is not written");
    process.exit(1);
  }
}

//! AND EVERY PROFILE IS AT LEAST 300 mm, which is what makes these parts rather
//! than diagrams. Measured on the SECTION rather than on the sweep, because a
//! 300 mm section swept 3 m makes a 3 m box either way.
let thinnest = Infinity, thinnestAt = "";
for (const cell of CELLS) {
  //! visible:false, because a profile the sweep consumed is hidden and the
  //! default is to list what is on screen.
  const body = kit.bodies({ notCategories: [], sewMeshes: false, visible: false })
    .find(b => b.id === "C" + cell.n + "_SEC");
  if (!body) continue;
  const box = kit.extents(body.shape);
  const across = box.size.slice().sort((a, b) => a - b)[1];   // the smaller of its two real sides
  if (across < thinnest) { thinnest = across; thinnestAt = cell.part; }
}
console.log("thinnest profile " + Math.round(thinnest) + " mm (" + thinnestAt + ")");
if (thinnest < 300 - 1) {
  console.log("a profile is under 300 mm - the gallery is not written");
  process.exit(1);
}

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("wrote " + OUT);
