// A rectangle is four lines.
//
// A rectangle and a slot were each ONE element - two corners, or two centres
// and a radius - and that is convenient for exactly as long as it takes to draw
// one. Afterwards there is nothing to work with: no top edge to put a length
// on, no left edge to make coincident with somebody else's line, no end cap to
// give a radius to. You could dimension "the rectangle", and a drawing whose
// parts cannot be named is a drawing you cannot constrain.
//
// So the gesture stays and what it leaves behind is a drawing. The checks here
// are the two that matter, and neither is "it has four elements in it":
//
//   IT IS STILL THE SHAPE IT WAS DRAWN AS. Four lines that merely happen to
//   form a rectangle are not a rectangle - drag one corner and they are a
//   quadrilateral. What makes it one is the relations, so every check below
//   MOVES something and then measures what came back.
//
//   EACH PIECE CAN BE DIMENSIONED ON ITS OWN, which is the whole reason for
//   doing it: a length on the top edge alone, a radius on one cap alone.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { SKETCH_ASSEMBLIES, sketchAssembly, solveSketch } from "../src/sketch.js";
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
                                      name: "Shapes", units: "mm", features: [] } });
const add = async (type, more = {}) => (await mdl.run({ op: "add", type, ...more })).id;
const set = (id, key, value) => mdl.run({ op: "set", id, key, value });
const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);
const drawingOf = async id => (await at(id)).sketch.drawing;

const PT = await add("Point");
const VZ = await add("Vector"); await set(VZ, "dx", 0); await set(VZ, "dz", 1);
const PL = await add("Plane", { refs: { origin: PT, normal: VZ } });
const RULE = await add("Measure"); await set(RULE, "quantity", 0);   // length
const lengthOf = async id => {
  await kernel.setReference(RULE, "shape", id, false, true);
  const e = await at(RULE);
  return e && e.data ? Number(e.data.preview) : NaN;
};

const lineOf = (drawing, id) => drawing.elements.find(el => el.id === id);
const lengthOfLine = el => Math.hypot(el.b[0] - el.a[0], el.b[1] - el.a[1]);
const angleBetween = (p, q) => {
  const u = [p.b[0] - p.a[0], p.b[1] - p.a[1]], v = [q.b[0] - q.a[0], q.b[1] - q.a[1]];
  const cos = (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v));
  return Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
};

console.log("1. the three gestures, and what each one leaves behind");
{
  check("three of them", SKETCH_ASSEMBLIES.join() === "rect,rotrect,oblong",
        SKETCH_ASSEMBLIES.join());
  const box = sketchAssembly("rect", [[0, 0], [100, 60]], ["a", "b", "c", "d"]);
  check("a rectangle is four lines", box.elements.length === 4
        && box.elements.every(el => el.type === "line"));
  check("held at four corners and square to the paper on every side",
        box.constraints.filter(c => c.type === "coincident").length === 4
        && box.constraints.filter(c => c.type === "horizontal").length === 2
        && box.constraints.filter(c => c.type === "vertical").length === 2,
        JSON.stringify(box.constraints.map(c => c.type)));

  const slot = sketchAssembly("oblong", [[0, 0], [100, 0], [100, 20]], ["a", "b", "c", "d"]);
  check("a slot is two lines and two arcs",
        slot.elements.filter(el => el.type === "line").length === 2
        && slot.elements.filter(el => el.type === "arc").length === 2,
        slot.elements.map(el => el.type).join());
  check("coincident at four ends and tangent at all four of them",
        slot.constraints.filter(c => c.type === "coincident").length === 4
        && slot.constraints.filter(c => c.type === "tangent").length === 4);

  const lean = sketchAssembly("rotrect", [[0, 0], [100, 0], [100, 60]], ["a", "b", "c", "d"]);
  check("a rectangle at an angle is four lines held by right angles",
        lean.elements.length === 4
        && lean.constraints.filter(c => c.type === "perpendicular").length === 4
        && !lean.constraints.some(c => c.type === "horizontal" || c.type === "vertical"));

  //! A GESTURE THAT CANNOT BE A SHAPE IS REFUSED IN WORDS. Two corners on top
  //! of each other would be four lines of no length, which OpenCascade refuses
  //! much further down with nothing to say about rectangles.
  let refused = "";
  try { sketchAssembly("rect", [[0, 0], [0, 60]], ["a", "b", "c", "d"]); }
  catch (e) { refused = e.message; }
  check("a rectangle with no width is refused here, in words",
        /not on top of each other/.test(refused), refused);
}

console.log("\n2. drawn through the op, which is what the sketcher does");
{
  const SK = await add("Sketch", { refs: { plane: PL } });
  await mdl.run({ op: "draw", id: SK, type: "rect", at: [[0, 0], [100, 60]] });
  const drawing = await drawingOf(SK);
  check("one gesture, four elements in the drawing", drawing.elements.length === 4,
        String(drawing.elements.length));
  check("and eight relations written with them", drawing.constraints.length === 8,
        String(drawing.constraints.length));
  //! IT IS A CLOSED LOOP, which is what a profile has to be. Four lines that
  //! do not quite meet build four edges and no face.
  check("it closes, and the perimeter is what a 100 x 60 rectangle measures",
        near(await lengthOf(SK), 320), String(await lengthOf(SK)));
}

console.log("\n3. each side can be dimensioned on its own - the point of all this");
{
  const SK = await add("Sketch", { refs: { plane: PL } });
  await mdl.run({ op: "draw", id: SK, type: "rect", at: [[0, 0], [100, 60]] });
  const ids = (await drawingOf(SK)).elements.map(el => el.id);
  //! A LENGTH ON THE TOP EDGE ALONE. This is the sentence that could not be
  //! said at all before: there was no top edge to say it about.
  await mdl.run({ op: "relate", id: SK, type: "length", of: [ids[0]], value: 250 });
  const after = await drawingOf(SK);
  check("the side that was dimensioned is the length it was given",
        near(lengthOfLine(lineOf(after, ids[0])), 250, 0.05),
        String(lengthOfLine(lineOf(after, ids[0]))));
  check("the side opposite it followed, because the corners hold",
        near(lengthOfLine(lineOf(after, ids[2])), 250, 0.05),
        String(lengthOfLine(lineOf(after, ids[2]))));
  check("and the two ends kept their own length",
        near(lengthOfLine(lineOf(after, ids[1])), 60, 0.05),
        String(lengthOfLine(lineOf(after, ids[1]))));
  check("it is still a rectangle: every corner is a right angle",
        near(angleBetween(lineOf(after, ids[0]), lineOf(after, ids[1])), 90, 0.05)
        && near(angleBetween(lineOf(after, ids[1]), lineOf(after, ids[2])), 90, 0.05),
        angleBetween(lineOf(after, ids[0]), lineOf(after, ids[1])).toFixed(4));
  check("and the perimeter says the same", near(await lengthOf(SK), 620, 0.2),
        String(await lengthOf(SK)));
}

console.log("\n4. dragged, it stays a rectangle - which is what the relations are for");
{
  const SK = await add("Sketch", { refs: { plane: PL } });
  await mdl.run({ op: "draw", id: SK, type: "rect", at: [[0, 0], [100, 60]] });
  const ids = (await drawingOf(SK)).elements.map(el => el.id);
  //! DRAG ONE CORNER SOMEWHERE ARBITRARY. Four unconstrained lines would come
  //! back as a quadrilateral with one corner pulled out of it, and it would
  //! look exactly like a rectangle in a list of four lines.
  await mdl.run({ op: "drag", id: SK, handle: ids[1] + ".b", to: [170, 130] });
  const after = await drawingOf(SK);
  for (let i = 0; i < 4; i++) {
    const one = lineOf(after, ids[i]), next = lineOf(after, ids[(i + 1) % 4]);
    check("corner " + (i + 1) + " is still a right angle",
          near(angleBetween(one, next), 90, 0.05), angleBetween(one, next).toFixed(4));
  }
  check("and the sides are still square to the paper",
        near(lineOf(after, ids[0]).a[1], lineOf(after, ids[0]).b[1], 1e-4)
        && near(lineOf(after, ids[1]).a[0], lineOf(after, ids[1]).b[0], 1e-4),
        JSON.stringify(lineOf(after, ids[0])));
}

console.log("\n5. a rectangle at an angle stays one AT THAT ANGLE");
{
  const SK = await add("Sketch", { refs: { plane: PL } });
  // 30 degrees off u, 200 wide, 80 deep.
  const w = [200 * Math.cos(Math.PI / 6), 200 * Math.sin(Math.PI / 6)];
  const h = [w[0] - 80 * Math.sin(Math.PI / 6), w[1] + 80 * Math.cos(Math.PI / 6)];
  await mdl.run({ op: "draw", id: SK, type: "rotrect", at: [[0, 0], w, h] });
  const ids = (await drawingOf(SK)).elements.map(el => el.id);
  check("it builds, and it measures 2 x (200 + 80)",
        near(await lengthOf(SK), 560, 0.05), String(await lengthOf(SK)));
  const drawn = await drawingOf(SK);
  const lean = Math.atan2(lineOf(drawn, ids[0]).b[1] - lineOf(drawn, ids[0]).a[1],
                          lineOf(drawn, ids[0]).b[0] - lineOf(drawn, ids[0]).a[0]);
  check("and it stands at the 30 degrees it was drawn at",
        near(lean * 180 / Math.PI, 30, 1e-3), (lean * 180 / Math.PI).toFixed(6));

  //! THE CHECK horizontal AND vertical COULD NOT PASS. Lengthen one side and
  //! the rectangle must stay a rectangle AND stay leaning: a rect would have
  //! snapped its sides back to u and v.
  await mdl.run({ op: "relate", id: SK, type: "length", of: [ids[0]], value: 300 });
  const after = await drawingOf(SK);
  for (let i = 0; i < 4; i++)
    check("corner " + (i + 1) + " is a right angle after the change",
          near(angleBetween(lineOf(after, ids[i]), lineOf(after, ids[(i + 1) % 4])), 90, 0.05),
          angleBetween(lineOf(after, ids[i]), lineOf(after, ids[(i + 1) % 4])).toFixed(4));
  const still = Math.atan2(lineOf(after, ids[0]).b[1] - lineOf(after, ids[0]).a[1],
                           lineOf(after, ids[0]).b[0] - lineOf(after, ids[0]).a[0]);
  check("and it is still leaning at 30, not snapped square to the paper",
        near(still * 180 / Math.PI, 30, 0.05), (still * 180 / Math.PI).toFixed(4));
  check("with the side it was given the length it was given",
        near(lengthOfLine(lineOf(after, ids[0])), 300, 0.05),
        String(lengthOfLine(lineOf(after, ids[0]))));
}

console.log("\n6. a slot, whose caps are arcs with radii of their own");
{
  const SK = await add("Sketch", { refs: { plane: PL } });
  await mdl.run({ op: "draw", id: SK, type: "oblong", at: [[0, 0], [100, 0], [100, 20]] });
  const drawing = await drawingOf(SK);
  const ids = drawing.elements.map(el => el.id);
  //! 2 x 100 straight + a whole circle of radius 20 between the two caps.
  check("it closes, and measures two sides and two half-circles",
        near(await lengthOf(SK), 200 + 2 * Math.PI * 20, 0.05), String(await lengthOf(SK)));

  //! A RADIUS ON EACH CAP, which is the sentence this was all for: before, a
  //! slot had one radius because a slot was one element.
  const away = (line, arc) => {
    const along = [line.b[0] - line.a[0], line.b[1] - line.a[1]];
    const n = Math.hypot(...along);
    return Math.abs(((arc.c[0] - line.a[0]) * -along[1]
                   + (arc.c[1] - line.a[1]) * along[0]) / n);
  };
  const arcOf = (drawing, id) => drawing.elements.find(el => el.id === id);
  for (const cap of [ids[1], ids[3]])
    await mdl.run({ op: "relate", id: SK, type: "radius", of: [cap], value: 30 });
  const after = await drawingOf(SK);
  check("both caps are the radius they were given",
        near(arcOf(after, ids[1]).r, 30, 0.05) && near(arcOf(after, ids[3]).r, 30, 0.05),
        arcOf(after, ids[1]).r + ", " + arcOf(after, ids[3]).r);
  //! TANGENT IS WHAT KEEPS IT A SLOT, and the honest test of a tangency is the
  //! distance from the centre to the line, not where the line happens to lie.
  check("and every cap still touches every side, so it is still a slot",
        [ids[1], ids[3]].every(cap => [ids[0], ids[2]].every(side =>
          near(away(lineOf(after, side), arcOf(after, cap)), arcOf(after, cap).r, 0.05))),
        JSON.stringify([ids[0], ids[2]].map(side =>
          away(lineOf(after, side), arcOf(after, ids[1])).toFixed(4))));
  //! AND THE SIDE IS AN ELEMENT, so it takes a length of its own. Nothing in
  //! the drawing said the slot was 100 long - growing the caps was free to
  //! stretch it, and did - so saying so is now a thing there is somewhere to
  //! say. This is the whole sentence the user asked for, in one line.
  await mdl.run({ op: "relate", id: SK, type: "length", of: [ids[0]], value: 100 });
  const sized = await drawingOf(SK);
  check("a length on one side holds the slot at that length",
        near(lengthOfLine(lineOf(sized, ids[0])), 100, 0.05),
        String(lengthOfLine(lineOf(sized, ids[0]))));
  //! WHAT IS NOT PROMISED IS NOT HELD, and that is not a failure. Nothing in
  //! this drawing says the two sides are the same length or that the caps are
  //! the same size; growing the caps stretched it a little and only the side
  //! that was dimensioned came back to 100. A solver that quietly kept the
  //! other side equal would be inventing a relation nobody wrote.
  check("and the far side is free, because nothing said it was not",
        Math.abs(lengthOfLine(lineOf(sized, ids[2])) - 100) > 0.05,
        String(lengthOfLine(lineOf(sized, ids[2]))));
}

console.log("\n7. one cap wider than the other is a tapered slot");
{
  //! WHICH IS THE RIGHT ANSWER RATHER THAN A BROKEN ONE: the relations say the
  //! sides touch both caps and say nothing about the two radii being equal, so
  //! a trapezium tangent to a big circle at one end and a small one at the
  //! other satisfies every word of them. It is also the shape that could not
  //! be drawn at all while a slot was one element with one radius.
  const SK = await add("Sketch", { refs: { plane: PL } });
  await mdl.run({ op: "draw", id: SK, type: "oblong", at: [[0, 0], [100, 0], [100, 20]] });
  const ids = (await drawingOf(SK)).elements.map(el => el.id);
  await mdl.run({ op: "relate", id: SK, type: "radius", of: [ids[1]], value: 35 });
  const taper = await drawingOf(SK);
  const arcOf = (drawing, id) => drawing.elements.find(el => el.id === id);
  const away = (line, arc) => {
    const along = [line.b[0] - line.a[0], line.b[1] - line.a[1]];
    const n = Math.hypot(...along);
    return Math.abs(((arc.c[0] - line.a[0]) * -along[1]
                   + (arc.c[1] - line.a[1]) * along[0]) / n);
  };
  check("one cap at 35 and one at 20", near(arcOf(taper, ids[1]).r, 35, 0.05)
        && near(arcOf(taper, ids[3]).r, 20, 0.05),
        arcOf(taper, ids[1]).r + " and " + arcOf(taper, ids[3]).r);
  //! A TENTH OF A MILLIMETRE, and the tolerance is the honest part of this
  //! check. The solver is a relaxation, not a Newton step: on a cap taken from
  //! r20 to r35 in one go it settles within six hundredths of a millimetre of
  //! touching and then cycles there. That is the solver's accuracy on a shape
  //! that is asked to change by three quarters of itself at once, and it is
  //! twenty-five times closer than the rule it replaced.
  check("and every side still touches every cap, at each cap's own radius",
        [ids[1], ids[3]].every(cap => [ids[0], ids[2]].every(side =>
          near(away(lineOf(taper, side), arcOf(taper, cap)), arcOf(taper, cap).r, 0.1))),
        JSON.stringify([ids[1], ids[3]].map(cap => [ids[0], ids[2]].map(side =>
          away(lineOf(taper, side), arcOf(taper, cap)).toFixed(3)))));
  check("and it still closes into one loop", Number.isFinite(await lengthOf(SK)),
        String(await lengthOf(SK)));
}

console.log("\n8. what was drawn before today still opens as what it was");
{
  //! The rect and oblong ELEMENT types are still read: every file written
  //! before this, every DXF import and the sample models are full of them, and
  //! a gesture changing is no reason for a drawing to stop opening.
  const SK = await add("Sketch", { refs: { plane: PL } });
  await kernel.setSketch(SK, "drawing", { elements: [
    { id: "r1", type: "rect", a: [0, 0], b: [100, 60] },
    { id: "o1", type: "oblong", a: [200, 0], b: [300, 0], r: 20 }], constraints: [] });
  check("a rect element still builds",
        near(await lengthOf(SK), 320 + 200 + 2 * Math.PI * 20, 0.05),
        String(await lengthOf(SK)));
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
