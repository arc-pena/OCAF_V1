// What a drag leaves behind, and what it is standing on while it happens.
//
// Four faults, and every one of them looked like a different program:
//
//   A LINE DRAGGED RAN AWAY FROM THE CURSOR and accelerated, while a dragged
//   END sat under the hand perfectly. One aliased object: readSketch handed
//   back the document's own element objects when it was given the drawing as an
//   object, so the viewport - which re-reads the stored drawing every frame
//   precisely so an offset is applied to the drawing as it was when the drag
//   began - was reading back its own last frame. An end is set to an absolute
//   place, so it never showed; an offset is a delta, so it compounded.
//
//   THE DRAWING CAME APART when a whole element was moved, because nudge was
//   the one edit inside a sketch that never settled. The build solved it, so
//   the solid looked right and the drawing did not.
//
//   A DISTANCE COULD ONLY BE PUT BETWEEN TWO ENDS. "50 off that line" is what
//   a drawing board asks for, and saying it meant drawing a point on the line
//   first - after which the answer depended on where along it you had put it.
//
//   AND A POINT COULD NOT BE DRAWN AT ALL, which is checked here as the one
//   thing the sketcher's commit path can be asked about from outside: the op
//   it would have written.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { SKETCH_SETTLE, measureDimension, readSketch, sketchMoveElement,
         solveSketch } from "../src/sketch.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-3) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
                                      name: "Drags", units: "mm", features: [] } });
const add = async (type, more = {}) => (await mdl.run({ op: "add", type, ...more })).id;
const set = (id, key, value) => mdl.run({ op: "set", id, key, value });
const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);
const drawingOf = async id => (await at(id)).sketch.drawing;
const lineOf = (d, id) => d.elements.find(el => el.id === id);

const PT = await add("Point");
const VZ = await add("Vector"); await set(VZ, "dx", 0); await set(VZ, "dz", 1);
const PL = await add("Plane", { refs: { origin: PT, normal: VZ } });

console.log("1. reading a drawing gives you a drawing of your own");
{
  //! THE BUG, IN ISOLATION. The viewport hands readSketch the object the tree
  //! published and then moves what comes back. If that is the same object, the
  //! document has been edited by drawing a frame.
  const stored = { elements: [{ id: "e1", type: "line", a: [0, 0], b: [100, 0] }],
                   constraints: [] };
  const mine = readSketch(stored);
  sketchMoveElement(mine.elements[0], [40, 0]);
  check("moving what was read does not move what was stored",
        stored.elements[0].a[0] === 0 && stored.elements[0].b[0] === 100,
        JSON.stringify(stored.elements[0]));
  check("and the copy really did move", mine.elements[0].a[0] === 40);

  //! THE SHAPE OF THE SYMPTOM: the same delta applied on each of ten frames,
  //! each frame re-reading what was stored. With the aliasing it is ten times
  //! the distance and growing; without it, it is the distance.
  let shown = null;
  for (let frame = 1; frame <= 10; frame++) {
    shown = readSketch(stored);
    sketchMoveElement(shown.elements[0], [frame * 4, 0]);
  }
  check("ten frames of a drag end where the cursor is, not ten times past it",
        shown.elements[0].a[0] === 40, String(shown.elements[0].a[0]));
}

console.log("\n2. a whole element moved leaves a drawing that is still true");
{
  const SK = await add("Sketch", { refs: { plane: PL } });
  await mdl.run({ op: "draw", id: SK, type: "rect", at: [[0, 0], [100, 60]] });
  const ids = (await drawingOf(SK)).elements.map(el => el.id);
  //! ONE SIDE OF A RECTANGLE, MOVED. Its two neighbours are coincident with it
  //! at the corners, so they have to follow; the side opposite must not.
  await mdl.run({ op: "nudge", id: SK, of: [ids[0]], by: [0, -25] });
  const after = await drawingOf(SK);
  check("the side that was moved is where it was put",
        near(lineOf(after, ids[0]).a[1], -25) && near(lineOf(after, ids[0]).b[1], -25),
        JSON.stringify(lineOf(after, ids[0])));
  //! THE CHECK THAT WAS FAILING: the corners still meet. Before, they simply
  //! did not, and the drawing said they did.
  const corner = (one, two) => Math.hypot(one[0] - two[0], one[1] - two[1]);
  check("the corner it shares with the next side still meets",
        corner(lineOf(after, ids[0]).b, lineOf(after, ids[1]).a) < 0.01,
        String(corner(lineOf(after, ids[0]).b, lineOf(after, ids[1]).a)));
  check("and the corner it shares with the one before it",
        corner(lineOf(after, ids[3]).b, lineOf(after, ids[0]).a) < 0.01,
        String(corner(lineOf(after, ids[3]).b, lineOf(after, ids[0]).a)));
  check("the side opposite did not follow: it was not asked to",
        near(lineOf(after, ids[2]).a[1], 60), String(lineOf(after, ids[2]).a[1]));
  check("and it is still a rectangle", near(lineOf(after, ids[1]).a[0],
        lineOf(after, ids[1]).b[0], 0.01) && near(lineOf(after, ids[0]).a[1],
        lineOf(after, ids[0]).b[1], 0.01));
}

console.log("\n3. a distance from an end to a LINE, square to it");
{
  const SK = await add("Sketch", { refs: { plane: PL } });
  await kernel.setSketch(SK, "drawing", { elements: [
    { id: "w1", type: "line", a: [0, 0], b: [200, 0] },
    { id: "p1", type: "point", p: [40, 30] }], constraints: [] });
  const drawing = await drawingOf(SK);
  //! MEASURED FIRST, because a dimension put on at a number the drawing does
  //! not have moves the drawing the moment it is added.
  check("it measures the perpendicular distance, not the distance to an end",
        near(measureDimension(drawing, "distance", ["p1.p", "w1"]), 30),
        String(measureDimension(drawing, "distance", ["p1.p", "w1"])));
  //! AND IT IS PERPENDICULAR WHEREVER ALONG THE LINE THE POINT IS. A point
  //! 40 along and 30 off is 50 from the line's near END, and 30 from the line.
  //! That difference is the whole reason this relation had to exist.
  check("and a point further along is still the same distance off",
        near(measureDimension({ ...drawing, elements: [drawing.elements[0],
              { id: "p1", type: "point", p: [190, 30] }] }, "distance", ["p1.p", "w1"]), 30));

  await mdl.run({ op: "relate", id: SK, type: "distance", of: ["p1.p", "w1"], value: 75 });
  const after = await drawingOf(SK);
  const p = after.elements.find(el => el.id === "p1").p;
  check("setting it moves the point square to the line, to that distance",
        near(p[1], 75, 0.01) && near(p[0], 40, 0.01), JSON.stringify(p));
  //! IT KEEPS THE SIDE IT IS ON. Without a sign, a point told to stand 75 off
  //! a line crosses to the other side of it the first time anything moves.
  await mdl.run({ op: "relate", id: SK, type: "distance", of: ["p1.p", "w1"], value: 20 });
  const closer = await drawingOf(SK);
  check("and brings it back on the same side, not through the line",
        near(closer.elements.find(el => el.id === "p1").p[1], 20, 0.01),
        String(closer.elements.find(el => el.id === "p1").p[1]));

  //! THE LINE MOVES INSTEAD WHEN THE POINT IS THE THING BEING HELD - which is
  //! what a drag of that point is. So: put the point somewhere it does not
  //! belong, pin it there the way a drag does, and the line has to come to it.
  const dragged = await drawingOf(SK);
  dragged.elements.find(el => el.id === "p1").p = [40, 90];
  const held = solveSketch(dragged, SKETCH_SETTLE, ["p1.p"]);
  const line = held.drawing.elements.find(el => el.id === "w1");
  const point = held.drawing.elements.find(el => el.id === "p1").p;
  check("with the point pinned it is the LINE that moves, to 20 below it",
        near(point[1], 90, 1e-6) && near(line.a[1], 70, 0.01) && near(line.b[1], 70, 0.01),
        JSON.stringify([point, line.a, line.b]));
}

console.log("\n4. two ends, which is what it always did");
{
  const SK = await add("Sketch", { refs: { plane: PL } });
  await kernel.setSketch(SK, "drawing", { elements: [
    { id: "a1", type: "point", p: [0, 0] },
    { id: "b1", type: "point", p: [30, 40] }], constraints: [] });
  check("measured between two ends", near(measureDimension(await drawingOf(SK),
        "distance", ["a1.p", "b1.p"]), 50));
  await mdl.run({ op: "relate", id: SK, type: "distance", of: ["a1.p", "b1.p"], value: 100 });
  const after = await drawingOf(SK);
  const a = after.elements.find(el => el.id === "a1").p;
  const b = after.elements.find(el => el.id === "b1").p;
  check("and set, they are that far apart", near(Math.hypot(b[0] - a[0], b[1] - a[1]), 100, 0.01),
        String(Math.hypot(b[0] - a[0], b[1] - a[1])));
  check("opening about the middle, so neither is dragged to the other",
        near(a[0] + b[0], 30, 0.01) && near(a[1] + b[1], 40, 0.01),
        JSON.stringify([a, b]));
}

console.log("\n5. an angle between two lines, which is a dimension like any other");
{
  const SK = await add("Sketch", { refs: { plane: PL } });
  await kernel.setSketch(SK, "drawing", { elements: [
    { id: "l1", type: "line", a: [0, 0], b: [100, 0] },
    { id: "l2", type: "line", a: [0, 0], b: [100, 100] }],
    constraints: [{ type: "coincident", of: ["l1.a", "l2.a"] }] });
  check("it measures the angle between them", near(measureDimension(await drawingOf(SK),
        "angle", ["l1", "l2"]), 45, 1e-6),
        String(measureDimension(await drawingOf(SK), "angle", ["l1", "l2"])));
  await mdl.run({ op: "relate", id: SK, type: "angle", of: ["l1", "l2"], value: 30 });
  const after = await drawingOf(SK);
  check("and set, they meet at that angle", near(measureDimension(after, "angle",
        ["l1", "l2"]), 30, 0.01), String(measureDimension(after, "angle", ["l1", "l2"])));
  //! The corner they were holding is still held: an angle turns a line about
  //! its own middle, and the coincidence brings the ends back together.
  const l1 = after.elements.find(el => el.id === "l1");
  const l2 = after.elements.find(el => el.id === "l2");
  check("and the corner they share is still a corner",
        Math.hypot(l1.a[0] - l2.a[0], l1.a[1] - l2.a[1]) < 0.01,
        String(Math.hypot(l1.a[0] - l2.a[0], l1.a[1] - l2.a[1])));
}

console.log("\n6. what is held stays under the hand");
{
  //! A DRAG PINS THE THING BEING DRAGGED and everything else settles around
  //! it. Tangency was the one relation that wrote straight into an element
  //! rather than through the solver's own mover, so it moved a pinned arc
  //! centre anyway: a slot dragged by the middle of one cap walked out from
  //! under the pointer while every other handle in the sketcher tracked it
  //! exactly.
  const SK = await add("Sketch", { refs: { plane: PL } });
  await mdl.run({ op: "draw", id: SK, type: "oblong", at: [[0, 0], [100, 0], [100, 20]] });
  const ids = (await drawingOf(SK)).elements.map(el => el.id);
  const want = [160, 45];
  const dragged = await drawingOf(SK);
  dragged.elements.find(el => el.id === ids[1]).c = want.slice();
  const held = solveSketch(dragged, SKETCH_SETTLE, [ids[1] + ".c"]);
  const cap = held.drawing.elements.find(el => el.id === ids[1]);
  check("the cap centre is exactly where it was dragged to",
        near(cap.c[0], want[0], 1e-9) && near(cap.c[1], want[1], 1e-9),
        JSON.stringify(cap.c));
  //! AND THE SLOT CAME WITH IT: the sides are still tangent to it, which is
  //! what makes the drag useful rather than merely obedient.
  const away = (line, arc) => {
    const along = [line.b[0] - line.a[0], line.b[1] - line.a[1]];
    const n = Math.hypot(...along);
    return Math.abs(((arc.c[0] - line.a[0]) * -along[1]
                   + (arc.c[1] - line.a[1]) * along[0]) / n);
  };
  const side = id => held.drawing.elements.find(el => el.id === id);
  //! A TENTH OF A MILLIMETRE, because this is one jump of 160 mm rather than
  //! the sixty small ones a real drag is made of - each frame starts from the
  //! stored drawing and moves a few millimetres, and lands nearer than this.
  check("and both sides came to it, still touching",
        near(away(side(ids[0]), cap), cap.r, 0.1) && near(away(side(ids[2]), cap), cap.r, 0.1),
        away(side(ids[0]), cap).toFixed(4) + ", " + away(side(ids[2]), cap).toFixed(4));
  //! And the same travel in the twenty steps a hand would make lands twice as
  //! close - 0.025 mm rather than 0.05 on a 20 mm cap. Worth measuring rather
  //! than assuming: the gain is real and it is not a different order of
  //! magnitude, and a comment claiming otherwise would be the kind of thing
  //! nobody checks twice.
  let frame = await drawingOf(SK);
  for (let i = 1; i <= 20; i++) {
    const to = [100 + (60 * i) / 20, (45 * i) / 20];
    frame.elements.find(el => el.id === ids[1]).c = to;
    frame = solveSketch(frame, SKETCH_SETTLE, [ids[1] + ".c"]).drawing;
  }
  const smooth = frame.elements.find(el => el.id === ids[1]);
  const at = id => frame.elements.find(el => el.id === id);
  check("dragged the way a hand drags it, the sides sit closer still",
        near(away(at(ids[0]), smooth), smooth.r, 0.03)
        && near(away(at(ids[2]), smooth), smooth.r, 0.03),
        away(at(ids[0]), smooth).toFixed(6) + ", " + away(at(ids[2]), smooth).toFixed(6));
}

console.log("\n7. a point, drawn with one click");
{
  //! THE OP THE SKETCHER WRITES when you click once with the point tool. It
  //! always worked; what did not was the commit path in the viewport, which
  //! asked every tool for two clicks and returned silently when a point gave
  //! it one. Checked here because it is the half of that gesture that can be
  //! asked a question from outside a browser.
  const SK = await add("Sketch", { refs: { plane: PL } });
  await mdl.run({ op: "draw", id: SK, type: "point", at: [[25, 65]] });
  const drawing = await drawingOf(SK);
  check("one click, one point, where it was clicked",
        drawing.elements.length === 1 && drawing.elements[0].type === "point"
        && near(drawing.elements[0].p[0], 25) && near(drawing.elements[0].p[1], 65),
        JSON.stringify(drawing.elements));
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
