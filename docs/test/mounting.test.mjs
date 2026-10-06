// Anchoring, mounting, and the parallel curve.
//
// Three things the sketcher could not say, and one it could not draw.
//
//   FIX. Nothing could be held still. Every relation moves what it names to
//   satisfy itself, so setting-out geometry drifted the moment anything near it
//   was dragged, and the only defence was to not touch it.
//
//   ON A CURVE. A coincidence WELDS two ends together. There was no way to
//   mount a point on a line and leave it free to slide along - which is how a
//   station on a rail, a hanger on a beam, or a door in a wall is described.
//
//   MIDPOINT. Halfway along, which is the one position on a curve anybody names.
//
//   OFFSET. A parallel curve of anything. Exact where an exact answer exists
//   and is the same kind of thing; a walked spline where it is not, because the
//   offset of an ellipse is not an ellipse and pretending otherwise is how you
//   get a drawing that is subtly the wrong shape.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { sketchMidOn, sketchNearestOn, sketchOffset, sketchOutline,
         solveSketch } from "../src/sketch.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-4) => Number.isFinite(a) && Math.abs(a - b) < tol;
const at2 = (p, q, tol = 1e-3) => p && near(p[0], q[0], tol) && near(p[1], q[1], tol);
const byId = (d, id) => d.elements.find(e => e.id === id);

/* ------------------------------------------------- the nearest point on things */
{
  const line = { id: "l", type: "line", a: [0, 0], b: [100, 0] };
  check("on a line, the nearest point is the foot of the perpendicular",
        at2(sketchNearestOn(line, [30, 50]), [30, 0]), String(sketchNearestOn(line, [30, 50])));
  //! PAST THE END IS THE END. A segment is not its infinite line, and a point
  //! mounted on one has to stop where the line stops.
  check("and past the end it is the end",
        at2(sketchNearestOn(line, [180, 20]), [100, 0]), String(sketchNearestOn(line, [180, 20])));

  const circle = { id: "c", type: "circle", c: [0, 0], r: 50 };
  check("on a circle it is r along the way out",
        at2(sketchNearestOn(circle, [200, 0]), [50, 0]), String(sketchNearestOn(circle, [200, 0])));

  //! AN ARC IS NOT ITS CIRCLE. A quarter arc from 0 to 90 degrees, asked for
  //! the nearest point to something out at 180 degrees, must answer one of its
  //! two ends and not the point on the circle behind it.
  const arc = { id: "a", type: "arc", c: [0, 0], r: 50, a0: 0, a1: Math.PI / 2 };
  const off = sketchNearestOn(arc, [-200, 1]);
  check("and on an arc, a point past its end gets the end",
        at2(off, [0, 50]) || at2(off, [50, 0]), String(off));

  check("halfway along a line is its middle",
        at2(sketchMidOn(line), [50, 0]), String(sketchMidOn(line)));
  check("and halfway round a quarter arc is 45 degrees",
        at2(sketchMidOn(arc), [50 * Math.SQRT1_2, 50 * Math.SQRT1_2]), String(sketchMidOn(arc)));
}

/* ------------------------------------------------------ mounted, and free to slide */
{
  //! The point starts well off the line; ON moves it to the line and nowhere
  //! else, so its x is untouched and only its y drops to 0.
  const drawing = { elements: [
    { id: "l", type: "line", a: [0, 0], b: [100, 0] },
    { id: "p", type: "point", p: [30, 60] }],
    constraints: [{ type: "on", of: ["p.p", "l"] }] };
  const out = solveSketch(drawing, 40);
  check("a point mounted on a line goes to the line",
        at2(byId(out.drawing, "p").p, [30, 0]), String(byId(out.drawing, "p").p));
  check("and it slid nowhere along it - that is what makes it a mount",
        near(byId(out.drawing, "p").p[0], 30, 1e-3));
  check("the line did not move to meet the point",
        at2(byId(out.drawing, "l").a, [0, 0]) && at2(byId(out.drawing, "l").b, [100, 0]));

  const middle = solveSketch({ ...drawing,
    constraints: [{ type: "midpoint", of: ["p.p", "l"] }] }, 40);
  check("a midpoint goes halfway along instead",
        at2(byId(middle.drawing, "p").p, [50, 0]), String(byId(middle.drawing, "p").p));
}

/* --------------------------------------------------------------------- anchored */
{
  //! A coincidence normally meets in the middle: two ends 100 apart each move
  //! 50. With one of them fixed, the other has to travel the whole 100.
  const drawing = { elements: [
    { id: "a", type: "line", a: [0, 0], b: [100, 0] },
    { id: "b", type: "line", a: [200, 0], b: [300, 0] }],
    constraints: [{ type: "coincident", of: ["a.b", "b.a"] }] };

  const loose = solveSketch(drawing, 60).drawing;
  check("without a fix, two ends meet in the middle",
        near(byId(loose, "a").b[0], 150, 0.5), String(byId(loose, "a").b));

  const held = solveSketch({ ...drawing,
    constraints: [...drawing.constraints, { type: "fix", of: ["a"] }] }, 60).drawing;
  //! THE CHECK THAT MATTERS: a fixed element is where it was drawn, to the
  //! last decimal, after any number of passes.
  check("a fixed line does not move at all",
        at2(byId(held, "a").a, [0, 0], 1e-9) && at2(byId(held, "a").b, [100, 0], 1e-9),
        JSON.stringify(byId(held, "a")));
  check("and the other line comes all the way to it",
        near(byId(held, "b").a[0], 100, 0.5), String(byId(held, "b").a));

  //! Fixing ONE END is a different promise: that end is nailed and the line may
  //! still swing about it. A vertical relation with the start fixed has to
  //! level the line about the START, not about its middle.
  const pinned = solveSketch({ elements: [{ id: "v", type: "line", a: [10, 0], b: [90, 40] }],
    constraints: [{ type: "vertical", of: ["v"] }, { type: "fix", of: ["v.a"] }] }, 60).drawing;
  check("fixing one end holds that end and lets the line swing about it",
        at2(byId(pinned, "v").a, [10, 0], 1e-6) && near(byId(pinned, "v").b[0], 10, 1e-6),
        JSON.stringify(byId(pinned, "v")));

  //! An over-constrained drawing says so in the number the solver already
  //! reports, rather than by quietly moving the anchored thing.
  const fought = solveSketch({ elements: [{ id: "h", type: "line", a: [0, 0], b: [100, 40] }],
    constraints: [{ type: "horizontal", of: ["h"] }, { type: "fix", of: ["h"] }] }, 24);
  check("a fix fighting a relation keeps the fix and reports the fight",
        at2(byId(fought.drawing, "h").b, [100, 40], 1e-9) && fought.residual > 1,
        `b ${byId(fought.drawing, "h").b}, residual ${fought.residual.toFixed(2)}`);
}

/* ---------------------------------------------------------------- parallel curves */
{
  //! LEFT of the way it runs. A line along +x has its left at +y, so an offset
  //! of 10 lifts it to y = 10. Derived before asking.
  const line = { id: "l", type: "line", a: [0, 0], b: [100, 0] };
  const up = sketchOffset(line, 10, "o");
  check("a line offsets to a line, 10 to its left",
        up.exact && up.el.type === "line" && at2(up.el.a, [0, 10]) && at2(up.el.b, [100, 10]),
        JSON.stringify(up.el));
  const down = sketchOffset(line, -10, "o");
  check("and a minus sign puts it on the other side",
        at2(down.el.a, [0, -10]), JSON.stringify(down.el.a));

  const circle = { id: "c", type: "circle", c: [5, 5], r: 50 };
  const inner = sketchOffset(circle, 10, "o");
  check("a circle offsets to a concentric circle, same kind of thing",
        inner.exact && inner.el.type === "circle" && near(inner.el.r, 40)
        && at2(inner.el.c, [5, 5]), JSON.stringify(inner.el));
  check("and offsetting one away to nothing is refused rather than inverted",
        sketchOffset(circle, 60, "o") === null);

  const arc = { id: "a", type: "arc", c: [0, 0], r: 50, a0: 0, a1: 1 };
  const wider = sketchOffset(arc, -12, "o");
  check("an arc keeps its angles and changes its radius",
        wider.exact && wider.el.type === "arc" && near(wider.el.r, 62)
        && near(wider.el.a0, 0) && near(wider.el.a1, 1), JSON.stringify(wider.el));

  //! AN ELLIPSE HAS NO OFFSET OF ITS OWN KIND. The honest answer is a spline
  //! through the offset points, and saying which happened is the point of
  //! `exact`: a caller that needs an ellipse must not be handed something that
  //! merely looks like one.
  const ellipse = { id: "e", type: "ellipse", c: [0, 0], rx: 80, ry: 40, rot: 0 };
  const round = sketchOffset(ellipse, -10, "o");
  check("an ellipse offsets to a spline, and says it is not exact",
        round && !round.exact && round.el.type === "spline" && round.el.pts.length > 20,
        round ? round.el.type + ", " + round.el.pts.length + " points" : "null");
  //! Measured rather than trusted: 10 outside an 80x40 ellipse reaches 90 on
  //! the long axis and 50 on the short one.
  const box = sketchOutline(round.el, 200).reduce((b, p) => ({
    x: Math.max(b.x, Math.abs(p[0])), y: Math.max(b.y, Math.abs(p[1])) }), { x: 0, y: 0 });
  check("and it really is 10 further out, on both axes",
        near(box.x, 90, 0.6) && near(box.y, 50, 0.6), `${box.x.toFixed(2)} x ${box.y.toFixed(2)}`);

  check("a point has no parallel curve", sketchOffset({ id: "p", type: "point", p: [0, 0] }, 5) === null);
  check("and an offset of nothing is nothing", sketchOffset(line, 0, "o") === null);

  //! The new element keeps the layer and the construction flag of the one it
  //! came from: an offset of setting-out geometry is setting-out geometry.
  const kept = sketchOffset({ ...line, layer: "Grid", construction: true }, 8, "o");
  check("an offset keeps its parent's layer and construction flag",
        kept.el.layer === "Grid" && kept.el.construction === true, JSON.stringify(kept.el));
}

/* ======================================================= through the document */

const kernel = await createWasmKernel({ initModule: init, wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, apply: () => {}, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
const tree = async id => ((await kernel.tree()).tree.features).find(f => f.id === id);
const drawingOf = async id => (await tree(id)).sketch.drawing;

{
  await kernel.loadModel({
    format: "ocaf-parametric-model", version: 1, name: "M", units: "mm",
    features: [
      { id: "O", type: "Point", args: { kind: "Coordinates", x: 0, y: 0, z: 0 } },
      { id: "VZ", type: "Vector", args: { dx: 0, dy: 0, dz: 1 } },
      { id: "PL", type: "Plane", args: { kind: "Origin and normal", origin: { ref: "O" },
                                         normal: { ref: "VZ" }, size: 300 } },
      { id: "SK", type: "Sketch", name: "Plate",
        args: { plane: { ref: "PL" }, solve: "Solve", drawing: { elements: [
          { id: "l1", type: "line", a: [0, 0], b: [120, 0] },
          { id: "c1", type: "circle", c: [0, 60], r: 30 }], constraints: [] } } },
    ],
  });

  await mdl.run({ op: "offset", id: "SK", of: "l1", distance: 25 });
  let drawing = await drawingOf("SK");
  check("offset adds one element and leaves the original alone",
        drawing.elements.length === 3 && at2(byId(drawing, "l1").a, [0, 0]),
        drawing.elements.map(e => e.id + ":" + e.type).join(", "));
  const made = drawing.elements[2];
  check("and the new one is the parallel line",
        made.type === "line" && at2(made.a, [0, 25]), JSON.stringify(made));

  let refusedDrag = "";
  await mdl.run({ op: "relate", id: "SK", type: "fix", of: ["l1"] });
  await mdl.run({ op: "relate", id: "SK", type: "on", of: [made.id + ".a", "c1"] });
  drawing = await drawingOf("SK");
  check("fix and on are stored like any other relation",
        drawing.constraints.length === 2
        && drawing.constraints[0].type === "fix" && drawing.constraints[1].type === "on",
        JSON.stringify(drawing.constraints));

  //! A DRAG IS REFUSED RATHER THAN QUIETLY IGNORED. The solver cannot save us
  //! here: a drag moves the handle and THEN solves, so by the time the solver
  //! sees the drawing the handle is already at its new place, and holding it
  //! there is exactly what a fix asks for. Measured: before this refusal, a
  //! fixed line dragged by an end went with the hand every time.
  refusedDrag = "";
  try { await mdl.run({ op: "drag", id: "SK", handle: "l1.b", to: [200, 80] }); }
  catch (e) { refusedDrag = e.message; }
  drawing = await drawingOf("SK");
  check("dragging an end of a FIXED line is refused, and it does not move",
        /is fixed/.test(refusedDrag) && at2(byId(drawing, "l1").b, [120, 0], 1e-6),
        refusedDrag + " · " + byId(drawing, "l1").b);
  //! And anything NOT fixed still drags exactly as it did.
  await mdl.run({ op: "drag", id: "SK", handle: "c1.c", to: [10, 70] });
  check("and something that is not fixed still drags",
        at2((await drawingOf("SK")).elements[1].c, [10, 70], 1e-3),
        String((await drawingOf("SK")).elements[1].c));

  const saved = await kernel.model();
  const written = saved.model || saved;
  await kernel.loadModel(written);
  const back = await drawingOf("SK");
  check("and the file carries them both",
        back.constraints.length === 2 && back.elements.length === 3,
        JSON.stringify(back.constraints));

  let refused = "";
  try { await mdl.run({ op: "offset", id: "SK", of: "nope", distance: 5 }); }
  catch (e) { refused = e.message; }
  check("offsetting something that is not there says so",
        /no element 'nope'/.test(refused), refused);
}

/* ------------------------------- a plane square across a curve, put there by a point

   "Along it" was a fraction from 0 to 1, which is a number nobody knows. You
   know where you want the plane because something is THERE: the end of a rail,
   a node of a truss, a point you already dropped. So the plane takes a point,
   finds the nearest place on the curve to it, and stands square there.        */
{
  await kernel.loadModel({
    format: "ocaf-parametric-model", version: 1, name: "P", units: "mm",
    features: [
      { id: "A", type: "Point", args: { kind: "Coordinates", x: 0, y: 0, z: 0 } },
      { id: "B", type: "Point", args: { kind: "Coordinates", x: 1000, y: 0, z: 0 } },
      { id: "RAIL", type: "Line", name: "Rail",
        args: { kind: "Between two points", from: { ref: "A" }, to: { ref: "B" } } },
      //! OFF THE CURVE ON PURPOSE. 700 along it and 250 to the side: the plane
      //! has to land at 700 and not at the point, and not at the midpoint.
      { id: "P", type: "Point", name: "Somewhere",
        args: { kind: "Coordinates", x: 700, y: 250, z: 0 } },
      { id: "PL", type: "Plane", name: "By a point",
        args: { kind: "Normal to a curve", curve: { ref: "RAIL" }, at: 0.5, size: 300,
                through: { ref: "P" } } },
      { id: "PL2", type: "Plane", name: "By the fraction",
        args: { kind: "Normal to a curve", curve: { ref: "RAIL" }, at: 0.5, size: 300 } },
    ],
  });
  const plane = async id => (await tree(id)).frame;
  check("a plane given a point stands at the nearest place on the curve to it",
        near((await plane("PL")).origin[0], 700, 0.01)
        && near((await plane("PL")).origin[1], 0, 1e-6),
        String((await plane("PL")).origin));
  check("and its normal is still along the curve",
        near(Math.abs((await plane("PL")).normal[0]), 1, 1e-6),
        String((await plane("PL")).normal));
  //! WITH NOTHING WIRED IT IS WHAT IT ALWAYS WAS, which is what lets every file
  //! written before this open unchanged.
  check("with no point wired, the fraction still decides",
        near((await plane("PL2")).origin[0], 500, 1e-6),
        String((await plane("PL2")).origin));
  check("and the plane says which t it found, because that is now a result",
        /at 0\.7 along Rail/.test((await tree("PL")).note || ""),
        String((await tree("PL")).note));

  //! Move the point and the plane follows it - which is the whole reason for
  //! wiring a point in rather than typing a fraction.
  await mdl.run({ op: "set", id: "P", key: "x", value: 250 });
  check("move the point and the plane goes with it",
        near((await plane("PL")).origin[0], 250, 0.01),
        String((await plane("PL")).origin));
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
