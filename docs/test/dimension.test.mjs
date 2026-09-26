// A sketch that holds its SIZE.
//
// Every relation the sketcher had says how two things relate: these two ends
// meet, this line is level, that circle touches this line. Not one of them says
// how big anything is, so a drawing could be held in perfect shape at entirely
// the wrong size, and there was no number anywhere in it that anybody could
// change. That is the difference between a drawing and a parametric sketch.
//
// A dimension drives geometry to a NUMBER. What has to be true of one:
//
//   PUTTING IT ON MOVES NOTHING. Select a circle, ask for a radius, and the
//   radius it is given is the one it already has. A dimension that changed the
//   drawing the moment it was added would be useless for measuring an existing
//   sketch, which is most of what dimensions are for.
//
//   TYPING A NUMBER MOVES THE GEOMETRY, and moves the least it can: a circle
//   keeps its centre, a line grows about its middle, and a line with one end
//   held slides the other one.
//
//   AND IT SURVIVES THE FILE, like every other relation.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { SKETCH_RELATIONS, isDimension, measureDimension, sketchRelation,
         solveSketch } from "../src/sketch.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-4) => Number.isFinite(a) && Math.abs(a - b) < tol;

/* ============================================ the arithmetic, with no kernel */

const CIRCLE = { elements: [{ id: "c1", type: "circle", c: [0, 0], r: 25 }], constraints: [] };
const LINE = { elements: [{ id: "l1", type: "line", a: [0, 0], b: [60, 0] }], constraints: [] };

{
  check("a dimension is a relation that carries a number",
        isDimension("radius") && isDimension("length") && !isDimension("horizontal"));

  //! MEASURED OFF THE DRAWING. This is what "select a circle and ask for a
  //! radius" gives you, and it has to be the radius it already has.
  check("a circle's radius is measured as what it is",
        near(measureDimension(CIRCLE, "radius", ["c1"]), 25),
        String(measureDimension(CIRCLE, "radius", ["c1"])));
  check("and its diameter as twice that",
        near(measureDimension(CIRCLE, "diameter", ["c1"]), 50));
  check("a line's length is its length",
        near(measureDimension(LINE, "length", ["l1"]), 60));
  check("a distance is between two ends",
        near(measureDimension(LINE, "distance", ["l1.a", "l1.b"]), 60));

  //! Two lines at 90°, measured the short way round: a line has no front and
  //! no back, so 90 and 270 are one answer.
  const corner = { elements: [
    { id: "a", type: "line", a: [0, 0], b: [50, 0] },
    { id: "b", type: "line", a: [0, 0], b: [0, 40] }], constraints: [] };
  check("an angle is the one between them, 0 to 180",
        near(measureDimension(corner, "angle", ["a", "b"]), 90, 1e-6),
        String(measureDimension(corner, "angle", ["a", "b"])));

  let refused = "";
  try { sketchRelation("radius", ["c1"]); } catch (e) { refused = e.message; }
  check("a dimension with no number is refused", /needs a value/.test(refused), refused);
  refused = "";
  try { sketchRelation("radius", ["c1"], 0); } catch (e) { refused = e.message; }
  check("and so is a radius of nothing", /more than zero/.test(refused), refused);
}

/* --------------------------------------------- putting one on moves nothing */
{
  const held = { ...CIRCLE, constraints: [sketchRelation("radius", ["c1"], 25)] };
  const solved = solveSketch(held, 24);
  const c = solved.drawing.elements[0];
  check("a radius put on at what the circle already is moves nothing",
        near(c.r, 25) && near(c.c[0], 0) && near(c.c[1], 0) && solved.residual < 1e-6,
        `r ${c.r}, residual ${solved.residual}`);
}

/* --------------------------------------------------- typing a number moves it */
{
  const want = { ...CIRCLE, constraints: [sketchRelation("radius", ["c1"], 40)] };
  const c = solveSketch(want, 24).drawing.elements[0];
  //! THE CENTRE STAYS. A radius that moved the circle would be a radius and a
  //! move, and nobody asked for the move.
  check("a radius of 40 makes the circle 40, about the same centre",
        near(c.r, 40) && near(c.c[0], 0) && near(c.c[1], 0), `r ${c.r} at ${c.c}`);

  const dia = { ...CIRCLE, constraints: [sketchRelation("diameter", ["c1"], 90)] };
  check("a diameter of 90 is a radius of 45",
        near(solveSketch(dia, 24).drawing.elements[0].r, 45));

  //! A LINE GROWS ABOUT ITS MIDDLE. Derived on paper: 0..60 has its middle at
  //! 30, so at length 100 it runs -20..80.
  const long = { ...LINE, constraints: [sketchRelation("length", ["l1"], 100)] };
  const l = solveSketch(long, 24).drawing.elements[0];
  check("a length of 100 grows the line about its middle",
        near(l.a[0], -20, 1e-3) && near(l.b[0], 80, 1e-3), `${l.a} -> ${l.b}`);

  //! With one end pinned the OTHER end slides, which is what a dimensioned line
  //! does when you drag it.
  const pinned = solveSketch(long, 24, ["l1.a"]).drawing.elements[0];
  check("with one end held, the other end is the one that moves",
        near(pinned.a[0], 0, 1e-3) && near(pinned.b[0], 100, 1e-3),
        `${pinned.a} -> ${pinned.b}`);

  //! An angle turns the SECOND line about its own middle. 50 long from [0,0],
  //! middle at [25,0]; turned to 60° from the horizontal it runs from
  //! [25 - 12.5, -21.65] to [25 + 12.5, +21.65].
  const corner = { elements: [
    { id: "a", type: "line", a: [0, 0], b: [100, 0] },
    { id: "b", type: "line", a: [0, 0], b: [50, 0] }], constraints: [] };
  const turned = solveSketch({ ...corner, constraints: [sketchRelation("angle", ["a", "b"], 60)] }, 40);
  check("an angle of 60 turns the second line to 60 from the first",
        near(measureDimension(turned.drawing, "angle", ["a", "b"]), 60, 1e-3),
        String(measureDimension(turned.drawing, "angle", ["a", "b"])));
  check("and its length is untouched",
        near(measureDimension(turned.drawing, "length", ["b"]), 50, 1e-3),
        String(measureDimension(turned.drawing, "length", ["b"])));

  //! A distance opens about the middle of the gap when both ends are free.
  const apart = { elements: [
    { id: "p", type: "point", p: [0, 0] },
    { id: "q", type: "point", p: [20, 0] }],
    constraints: [sketchRelation("distance", ["p.p", "q.p"], 60)] };
  const moved = solveSketch(apart, 40).drawing;
  const gap = measureDimension(moved, "distance", ["p.p", "q.p"]);
  const centre = (moved.elements[0].p[0] + moved.elements[1].p[0]) / 2;
  check("a distance of 60 between two free ends opens about the middle of the gap",
        near(gap, 60, 1e-3) && near(centre, 10, 1e-3), `gap ${gap}, middle ${centre}`);
}

/* ------------------------------------ a dimension and a relation, together */
{
  //! THE CHECK THAT MATTERS FOR A SKETCHER. A dimension on its own is
  //! arithmetic; a dimension that survives being solved alongside the relations
  //! already in the drawing is a sketcher. A square held by four coincidences
  //! and two levels, with one side dimensioned, has to come out that size.
  const square = { elements: [
    { id: "s", type: "line", a: [0, 0], b: [40, 0] },
    { id: "e", type: "line", a: [40, 0], b: [40, 40] },
    { id: "n", type: "line", a: [40, 40], b: [0, 40] },
    { id: "w", type: "line", a: [0, 40], b: [0, 0] }],
    constraints: [
      { type: "coincident", of: ["s.b", "e.a"] }, { type: "coincident", of: ["e.b", "n.a"] },
      { type: "coincident", of: ["n.b", "w.a"] }, { type: "coincident", of: ["w.b", "s.a"] },
      { type: "horizontal", of: ["s"] }, { type: "horizontal", of: ["n"] },
      { type: "vertical", of: ["e"] }, { type: "vertical", of: ["w"] },
      sketchRelation("length", ["s"], 90)] };
  const out = solveSketch(square, 200, ["s.a"]);
  const side = measureDimension(out.drawing, "length", ["s"]);
  check("a dimensioned side of a constrained square comes out that size",
        near(side, 90, 0.05), `${side}, residual ${out.residual.toFixed(6)}`);
  check("and the square is still square",
        near(measureDimension(out.drawing, "length", ["n"]), 90, 0.1),
        String(measureDimension(out.drawing, "length", ["n"])));
}

/* ============================================ and through the real document */

const kernel = await createWasmKernel({ initModule: init, wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, apply: () => {}, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
const at = async id => ((await kernel.tree()).tree.features).find(f => f.id === id);
const drawingOf = async id => (await at(id)).sketch.drawing;

{
  await kernel.loadModel({
    format: "ocaf-parametric-model", version: 1, name: "D", units: "mm",
    features: [
      { id: "O", type: "Point", args: { kind: "Coordinates", x: 0, y: 0, z: 0 } },
      { id: "VZ", type: "Vector", args: { dx: 0, dy: 0, dz: 1 } },
      { id: "PL", type: "Plane", args: { kind: "Origin and normal", origin: { ref: "O" },
                                         normal: { ref: "VZ" }, size: 300 } },
      { id: "SK", type: "Sketch", name: "Plate",
        args: { plane: { ref: "PL" }, solve: "Solve",
                drawing: { elements: [{ id: "c1", type: "circle", c: [0, 0], r: 25 }],
                           constraints: [] } } },
    ],
  });

  //! NO VALUE GIVEN: select the circle, ask for a radius, and it takes the one
  //! the circle has. This is the gesture the sketcher's rail performs.
  await mdl.run({ op: "relate", id: "SK", type: "radius", of: ["c1"] });
  let drawing = await drawingOf("SK");
  check("a radius asked for with no number is put on at what it measures",
        drawing.constraints.length === 1 && near(drawing.constraints[0].value, 25),
        JSON.stringify(drawing.constraints));
  check("and the circle did not move", near(drawing.elements[0].r, 25),
        String(drawing.elements[0].r));

  //! TYPED ON THE DIMENSION. This is what the sketcher writes when you click
  //! the number and type into it.
  await mdl.run({ op: "dimension", id: "SK", at: 0, value: 62 });
  drawing = await drawingOf("SK");
  check("typing 62 onto the dimension makes the circle 62",
        near(drawing.elements[0].r, 62) && near(drawing.constraints[0].value, 62),
        `r ${drawing.elements[0].r}, says ${drawing.constraints[0].value}`);
  check("and its centre stayed where it was",
        near(drawing.elements[0].c[0], 0) && near(drawing.elements[0].c[1], 0),
        String(drawing.elements[0].c));

  //! An edit like any other.
  await mdl.run({ op: "undo" });
  check("undo puts the dimension back", near((await drawingOf("SK")).constraints[0].value, 25),
        String((await drawingOf("SK")).constraints[0].value));
  await mdl.run({ op: "redo" });

  //! AND IT SURVIVES THE FILE, value and all.
  const saved = await kernel.model();
  const written = saved.model || saved;
  const row = written.features.find(f => f.id === "SK");
  const stored = typeof row.args.drawing === "string"
    ? JSON.parse(row.args.drawing) : row.args.drawing;
  check("the file carries the dimension and its value",
        stored.constraints.length === 1 && near(stored.constraints[0].value, 62),
        JSON.stringify(stored.constraints));
  //! The sketcher's own rule, and a dimension must not break it.
  check("and still no world coordinates in the drawing",
        JSON.stringify(stored).indexOf("null") < 0);

  await kernel.loadModel(written);
  check("opening the file again gives the same circle",
        near((await drawingOf("SK")).elements[0].r, 62),
        String((await drawingOf("SK")).elements[0].r));

  //! Refusals, through the document rather than through the arithmetic.
  let refused = "";
  try { await mdl.run({ op: "dimension", id: "SK", at: 9, value: 5 }); }
  catch (e) { refused = e.message; }
  check("setting a dimension that is not there is refused", /no relation 9/.test(refused), refused);

  await mdl.run({ op: "relate", id: "SK", type: "horizontal", of: ["c1"] });
  refused = "";
  try { await mdl.run({ op: "dimension", id: "SK", at: 1, value: 5 }); }
  catch (e) { refused = e.message; }
  check("and so is typing a number onto a relation that has none",
        /not a dimension/.test(refused), refused);

  refused = "";
  try { await mdl.run({ op: "relate", id: "SK", type: "length", of: ["c1"] }); }
  catch (e) { refused = e.message; }
  check("asking a circle for a length says so rather than guessing",
        /nothing in that selection/.test(refused), refused);
}

/* ------------------------------------------- what the rail offers, and what it says */
{
  const dims = SKETCH_RELATIONS.filter(r => r.value);
  check("five dimensions are declared", dims.length === 5,
        dims.map(d => d.key).join(","));
  check("each one says what it takes and what unit it is in",
        dims.every(d => d.takes >= 1 && d.of && d.unit && d.hint),
        dims.map(d => d.key + ":" + d.of + ":" + d.unit).join(" "));
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
