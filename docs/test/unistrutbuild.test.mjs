// The Unistrut nodes, built against a real kernel.
//
// unistrut.test.mjs checks the catalogue and the arithmetic, which is where the
// numbers come from. This file checks the thing that arithmetic cannot: that a
// model made of these nodes BUILDS, and that what it builds is the size the
// catalogue says.
//
// It exists because of a bug in the Rhino package earlier in this branch. Every
// unit test passed on a model file that was well formed and that the kernel
// could not build - an Instance placing a mesh, which has no shape. The model
// was valid JSON describing something impossible, and only opening it showed a
// red node. So: load the package, build the nodes, and measure what comes out.

import { createWasmKernel } from "../src/wasm-kernel.js";
import { PluginHost } from "../src/plugin.js";
import "../src/unistrut-plugin.js";
import { BEND_RADIUS, channelByKey, holeStations, patternByKey, pickHoles, stripLength }
  from "../src/unistrut.js";
import { readFileSync } from "fs";

const WASM = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const initModule = (await import(WASM + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({
  initModule, wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const host = new PluginHost({
  toolkit: () => kernel.toolkit(),
  installDrivers: (specs, builders) => kernel.installDrivers(specs, builders),
  removeDrivers: specs => kernel.removeDrivers(specs),
  typesInUse: types => kernel.typesInUse(types),
});
await host.load("unistrut");

const tree = async () => (await kernel.tree()).tree;
const kit = kernel.toolkit();

//! THE SOLID ITSELF, not the row describing it. Everything about the section -
//! that the bends are arcs and the holes are circles - is a fact about faces,
//! and a tree row cannot carry it.
const shapeOf = id => {
  const f = kit.doc().features().find(one => kit.F.id(one) === id);
  return f ? kit.F.shape(f) : null;
};
const boxOf = id => { const s = shapeOf(id); return s && !s.IsNull() ? kit.extents(s) : null; };

//! Every cylindrical face of a shape, tallied by radius. A cold-formed section
//! has one per bend - the inner at r, the outer at r + t - and a punched hole
//! has one per round, or two per slot, one at each end. So this one tally says
//! whether the section was FORMED and whether the holes were PUNCHED, and a
//! polygonal approximation of either reads as zero.
const roundsOf = id => {
  const shape = shapeOf(id);
  if (!shape || shape.IsNull()) return null;
  const tally = new Map();
  for (const face of kit.subShapes(shape, kit.FACE, kit.oc.TopoDS.Face)) {
    const surf = new kit.oc.BRepAdaptor_Surface(face, true);
    if (surf.GetType() !== kit.oc.GeomAbs_SurfaceType.GeomAbs_Cylinder) continue;
    const r = +surf.Cylinder().Radius().toFixed(3);
    tally.set(r, (tally.get(r) || 0) + 1);
  }
  return tally;
};
const sayRounds = tally => tally
  ? [...tally.entries()].sort((a, b) => a[0] - b[0]).map(([r, n]) => n + "x r" + r).join(", ")
  : "no shape";
const model = features => ({ format: "ocaf-parametric-model", version: 1,
                             name: "strut", units: "mm", needs: ["unistrut"], features });

//! A run along one straight line, 2 m of P1000 HS. Everything below is
//! measured off this unless it says otherwise.
const LINE = [
  { id: "A", type: "Point", name: "A", args: { x: 0, y: 0, z: 0 } },
  { id: "B", type: "Point", name: "B", args: { x: 2000, y: 0, z: 0 } },
  { id: "W", type: "Polyline", name: "Line",
    args: { points: [{ ref: "A" }, { ref: "B" }], closed: "Open" } },
];

//! The bill's text, where the document actually puts it: a text node's lines
//! come back on data.preview, joined with the preview separator.
const billOf = built => {
  const bom = built.features.find(f => f.type === "StrutBill");
  return String((bom && bom.data && bom.data.preview) || "");
};

//! And a short one, for the checks that count faces: 2 m of T slots is 1,500
//! faces to walk, and 500 mm says the same thing in a tenth of the time.
const SHORT = [
  { id: "P", type: "Point", name: "P", args: { x: 0, y: 0, z: 0 } },
  { id: "Q", type: "Point", name: "Q", args: { x: 500, y: 0, z: 0 } },
  { id: "S", type: "Polyline", name: "Short",
    args: { points: [{ ref: "P" }, { ref: "Q" }], closed: "Open" } },
];

console.log("1. a run builds, and is the size the catalogue says");
{
  await kernel.loadModel(model([...LINE,
    { id: "R", type: "StrutRun", name: "Run",
      args: { path: { ref: "W" }, channel: "P1000", pattern: "HS", finish: "PG",
              facing: "Up", roll: 0, length: "Follow the wire" } }]));
  const built = await tree();
  const bad = built.features.filter(f => f.error);
  check("it builds with nothing in error", bad.length === 0,
        bad.map(f => f.name + ": " + f.error).join(" | ") || built.features.length + " nodes");

  //! THE MEASUREMENT. A P1000 is 41.3 square and the run is 2000 long, so the
  //! body must measure 2000 x 41.3 x 41.3 - and if the section were drawn in
  //! the wrong plane it would come out 41.3 x 2000 instead, which is the way
  //! a frame gets built wrong and still looks like channel.
  //!
  //! This used to say `check("the run is a body", !run.error)` under that
  //! comment and measure nothing at all. The section was wrong for a week -
  //! square corners, and a lip hanging the wrong way that left a 16.8 mm slot
  //! for a 20.4 mm nut - and every run of this file was green. A test named
  //! for a measurement has to take one.
  const run = (await tree()).features.find(f => f.id === "R");
  check("the run is a body", !!run && !run.error, run ? String(run.type) : "missing");
  const box = boxOf("R");
  const p1000 = channelByKey("P1000");
  check("it is 2000 long", !!box && near(box.size[0], 2000, 1e-6),
        box ? box.size[0].toFixed(3) : "no shape");
  check("and 41.3 across the back, the catalogue's width",
        !!box && near(box.size[1], p1000.w, 1e-6),
        box ? box.size[1].toFixed(3) + " vs " + p1000.w : "no shape");
  check("and 41.3 deep, the catalogue's height",
        !!box && near(box.size[2], p1000.h, 1e-6),
        box ? box.size[2].toFixed(3) + " vs " + p1000.h : "no shape");
}

console.log("\n2. the holes are the catalogue's, not something drawn");
{
  const p1000 = channelByKey("P1000");
  //! Counted off the arithmetic the driver uses, so this is a check that the
  //! driver USES it: 2000 mm of HS at 47.6 with a 10.15 end margin is 41 holes.
  //! 2000 less two 10.15 end margins is 1979.7, which takes 41 whole pitches
  //! of 47.6 and therefore 42 holes. The first version of this test said 41 -
  //! the arithmetic was right and the expectation was wrong, which is the way
  //! round you want it.
  const stations = holeStations(2000, "HS");
  check("2 m of HS takes 42 holes", stations.length === 42, stations.length + " holes");
  check("at 47.6 centres", near(stations[1] - stations[0], 47.6, 1e-9));
  //! A plain channel has none however long it is, and that is a different
  //! build path - the driver skips the boolean entirely.
  await kernel.loadModel(model([...LINE,
    { id: "R", type: "StrutRun", name: "Plain",
      args: { path: { ref: "W" }, channel: "P1000", pattern: "PL", finish: "PG" } }]));
  const plain = (await tree()).features.find(f => f.id === "R");
  check("plain channel builds too, with no holes cut", !!plain && !plain.error,
        plain && plain.error ? plain.error : "ok");

  //! AND THE CUT ITSELF IS ROUND. The arithmetic above says where a hole goes;
  //! it says nothing about what shape was subtracted, and the first version of
  //! this package punched twenty-four-sided polygons that looked like holes
  //! from any distance. A cylindrical face is a circle or nothing.
  //!
  //! Every one of these runs is 500 mm, so the counts are small enough to
  //! write down: the 12 bend faces are the section, and the rest are holes.
  const inner = BEND_RADIUS, outer = +(BEND_RADIUS + p1000.wall).toFixed(3);
  const bends = tally => (tally.get(inner) || 0) + (tally.get(outer) || 0);
  const plainRounds = roundsOf("R");
  check("a plain P1000 has 12 bend faces and nothing else round",
        !!plainRounds && bends(plainRounds) === 12 && plainRounds.size === 2,
        sayRounds(plainRounds));
  check("  six inner bends at r1.6 and six outer at r + t",
        !!plainRounds && plainRounds.get(inner) === 6 && plainRounds.get(outer) === 6,
        sayRounds(plainRounds));

  //! HS is a 14.3 round hole: one cylinder per hole, radius 7.15. 500 mm takes
  //! 11 of them by the same arithmetic checked above.
  await kernel.loadModel(model([...SHORT,
    { id: "R", type: "StrutRun", name: "HS",
      args: { path: { ref: "S" }, channel: "P1000", pattern: "HS", finish: "PG" } }]));
  const hs = roundsOf("R");
  check("500 mm of HS cuts 11 round holes, each one cylinder",
        !!hs && hs.get(7.15) === holeStations(500, "HS").length,
        sayRounds(hs) + " · " + holeStations(500, "HS").length + " stations");
  check("  at r7.15, half the catalogue's 14.3", !!hs && hs.has(7.15), sayRounds(hs));

  //! A SLOT IS NOT A HOLE. T is 28.6 x 14.3, so each one ends in two half
  //! cylinders of the same 7.15 - two faces per slot, not one, and a slot
  //! drawn as a rectangle would have none.
  await kernel.loadModel(model([...SHORT,
    { id: "R", type: "StrutRun", name: "T",
      args: { path: { ref: "S" }, channel: "P1000", pattern: "T", finish: "PG" } }]));
  const slot = roundsOf("R");
  check("a T slot ends in two true arcs, not a cut corner",
        !!slot && slot.get(7.15) === holeStations(500, "T").length * 2,
        sayRounds(slot) + " · " + holeStations(500, "T").length + " slots");

  //! SL is 76.2 x 10.3 - a different radius, which is the check that the slot
  //! end follows the pattern's own width rather than one number for all of them.
  await kernel.loadModel(model([...SHORT,
    { id: "R", type: "StrutRun", name: "SL",
      args: { path: { ref: "S" }, channel: "P1000", pattern: "SL", finish: "PG" } }]));
  const sl = roundsOf("R");
  check("an SL slot ends at r5.15, its own half-width",
        !!sl && sl.get(5.15) === holeStations(500, "SL").length * 2,
        sayRounds(sl) + " · " + holeStations(500, "SL").length + " slots");
}

console.log("\n3. a punching the channel is not made in is refused by name");
{
  //! 18A p20: P3300 has no KO column. The precondition must refuse it, because
  //! drawing it produces a part number nobody can buy - and the refusal has to
  //! name what IS made or it is just a no.
  await kernel.loadModel(model([...LINE,
    { id: "R", type: "StrutRun", name: "Impossible",
      args: { path: { ref: "W" }, channel: "P3300", pattern: "KO", finish: "PG" } }]));
  const bad = (await tree()).features.find(f => f.id === "R");
  check("a P3300 KO is refused", !!bad && !!bad.error, bad ? String(bad.error) : "built!");
  check("and the refusal says what P3300 IS made in",
        !!bad && /HS/.test(bad.error || "") && /p20/.test(bad.error || ""),
        bad ? String(bad.error).slice(0, 90) : "");
}

console.log("\n4. nuts go in the holes you name");
{
  const withNuts = rule => [...LINE,
    { id: "R", type: "StrutRun", name: "Run",
      args: { path: { ref: "W" }, channel: "P1000", pattern: "HS", finish: "PG" } },
    { id: "N", type: "StrutNut", name: "Nuts",
      args: { run: { ref: "R" }, nut: "P1006-1420", where: rule } }];

  await kernel.loadModel(model(withNuts("every 2 from 3")));
  let got = (await tree()).features.find(f => f.id === "N");
  check("a run of nuts builds", !!got && !got.error, got && got.error ? got.error : "ok");
  //! 41 holes, every other from the third: indices 2,4,…,40 - twenty of them.
  //! Worked out on paper before the kernel was asked.
  const chosen = pickHoles(42, "every 2 from 3");
  check("every 2 from 3 of 42 holes is 20 nuts", chosen.length === 20,
        chosen.length + " chosen");

  //! THE WALK, end to end: jump 1 3 2 over 41 holes.
  const walk = pickHoles(42, "jump 1 3 2");
  await kernel.loadModel(model(withNuts("jump 1 3 2")));
  got = (await tree()).features.find(f => f.id === "N");
  check("a jump pattern builds", !!got && !got.error, walk.length + " nuts");

  //! AND A RULE THAT CANNOT BE READ BUILDS NOTHING, rather than filling the
  //! run with forty-one nuts that look deliberate.
  await kernel.loadModel(model(withNuts("every other one please")));
  got = (await tree()).features.find(f => f.id === "N");
  check("an unreadable rule places no nuts rather than all of them",
        !!got && !got.error, got && got.error ? got.error : "built empty");
}

console.log("\n5. a nut the channel does not take is refused");
{
  //! 18A p65: a P4006 is a shallow-channel nut. Putting one in a P1000 is the
  //! mistake that gets ordered, so the precondition has to catch it.
  await kernel.loadModel(model([...LINE,
    { id: "R", type: "StrutRun", name: "Run",
      args: { path: { ref: "W" }, channel: "P1000", pattern: "HS", finish: "PG" } },
    { id: "N", type: "StrutNut", name: "Wrong nut",
      args: { run: { ref: "R" }, nut: "P4006-1420", where: "all" } }]));
  const bad = (await tree()).features.find(f => f.id === "N");
  check("a P4006 in a P1000 is refused", !!bad && !!bad.error,
        bad ? String(bad.error).slice(0, 80) : "built!");
  check("and the refusal offers what does fit",
        !!bad && /P1006|P1007|P3006/.test(bad.error || ""),
        bad ? String(bad.error).slice(0, 100) : "");
  //! Plain channel has no holes, so a nut in it is a different refusal.
  await kernel.loadModel(model([...LINE,
    { id: "R", type: "StrutRun", name: "Plain",
      args: { path: { ref: "W" }, channel: "P1000", pattern: "PL", finish: "PG" } },
    { id: "N", type: "StrutNut", name: "Nowhere",
      args: { run: { ref: "R" }, nut: "P1006-1420", where: "all" } }]));
  const none = (await tree()).features.find(f => f.id === "N");
  check("and a nut in plain channel says there are no holes",
        !!none && /no holes/.test(none.error || ""),
        none ? String(none.error).slice(0, 70) : "");
}

console.log("\n6. four lines are four pieces, which is what a bill counts");
{
  //! THE REASON A RUN FOLLOWS SEGMENTS, and it is a number not an impression.
  //! A 1000 x 800 rectangle is four pieces of 1000, 800, 1000, 800. Cut from
  //! sticks each one takes a 10 ft stick, so 4 x 3.048 = 12.19 m is bought.
  //! Collapsed into one 3600 mm run it would buy a single 20 ft stick - 6.10 m.
  //! The two answers are nowhere near each other, which is what makes this a
  //! test rather than a restatement. 18A p18: curved channel is special order,
  //! so a run is always straight pieces.
  await kernel.loadModel(model([
    { id: "P1", type: "Point", name: "P1", args: { x: 0, y: 0, z: 0 } },
    { id: "P2", type: "Point", name: "P2", args: { x: 1000, y: 0, z: 0 } },
    { id: "P3", type: "Point", name: "P3", args: { x: 1000, y: 800, z: 0 } },
    { id: "P4", type: "Point", name: "P4", args: { x: 0, y: 800, z: 0 } },
    { id: "W", type: "Polyline", name: "Frame",
      args: { points: [{ ref: "P1" }, { ref: "P2" }, { ref: "P3" }, { ref: "P4" }],
              closed: "Closed" } },
    { id: "S", type: "GeometricalSet", name: "Frame set" },
    { id: "R", type: "StrutRun", name: "Frame run", parent: "S",
      args: { path: { ref: "W" }, channel: "P1000", pattern: "HS", finish: "PG",
              length: "Cut from sticks" } },
    { id: "BOM", type: "StrutBill", name: "Bill", args: { of: { ref: "S" } } }]));
  const built = (await tree()).features.find(f => f.id === "R");
  check("a closed rectangle of channel builds", !!built && !built.error,
        built && built.error ? built.error : "ok");
  const bill = billOf(await tree());
  //! NESTED, the metres no longer tell four pieces from one bent run: 1000 +
  //! 800 + 1000 + 800 cuts out of two 10 ft sticks, and so would a single
  //! 3600 mm run. So the bill says how it was CUT, and that is what is checked.
  check("the bill nests the four pieces into two sticks",
        /2 sticks, 4 pieces/.test(bill), bill.replace(/\s+/g, " ").slice(0, 140));
  check("and buys 6.10 m rather than a stick per piece",
        /6\.10 m/.test(bill), bill.replace(/\s+/g, " ").slice(0, 100));
  check("named by the part number somebody orders", /P1000 HS-PG/.test(bill),
        bill.replace(/\s+/g, " ").slice(0, 80));
}

console.log("\n7. a fitting generates, and weighs what the catalogue says");
{
  await kernel.loadModel(model([
    { id: "O", type: "Point", name: "O", args: { x: 0, y: 0, z: 0 } },
    { id: "S", type: "GeometricalSet", name: "Fittings" },
    { id: "F", type: "StrutFitting", name: "Tee", parent: "S",
      args: { part: "P1031", at: { ref: "O" }, finish: "EG" } },
    { id: "BOM", type: "StrutBill", name: "Bill", args: { of: { ref: "S" } } }]));
  const built = (await tree()).features.find(f => f.id === "F");
  check("a P1031 tee builds", !!built && !built.error,
        built && built.error ? built.error : "ok");
  const bill = billOf(await tree());
  check("and reaches the bill by part number", /P1031/.test(bill),
        bill.replace(/\s+/g, " ").slice(0, 100));
  //! One tee at the catalogue's 36.3 kg per hundred is 0.363 kg, which is what
  //! the bill must show - the weight comes from the catalogue row, not from
  //! the geometry, because the catalogue is the orderable truth.
  check("at the catalogue's weight for one of them", /0\.4|0\.36/.test(bill),
        bill.replace(/\s+/g, " ").slice(0, 100));
}

console.log("\n8. the bill is the model, counted");
{
  await kernel.loadModel(model([...LINE,
    { id: "S", type: "GeometricalSet", name: "Assembly" },
    { id: "R", type: "StrutRun", name: "Run", parent: "S",
      args: { path: { ref: "W" }, channel: "P1000", pattern: "HS", finish: "PG",
              length: "Cut from sticks" } },
    { id: "N", type: "StrutNut", name: "Nuts", parent: "S",
      args: { run: { ref: "R" }, nut: "P1006-1420", where: "every 4" } },
    { id: "BOM", type: "StrutBill", name: "Bill",
      args: { of: { ref: "S" }, show: "Everything" } }]));
  const bom = (await tree()).features.find(f => f.id === "BOM");
  check("the bill builds", !!bom && !bom.error, bom && bom.error ? bom.error : "ok");
  const bill = billOf(await tree());
  check("it names the channel by part number", /P1000 HS-PG/.test(bill),
        bill.replace(/\s+/g, " ").slice(0, 100));
  check("and the nut by part number", /P1006-1420/.test(bill),
        bill.replace(/\s+/g, " ").slice(0, 140));
  //! 2 m cut from sticks BUYS a 10 ft stick: 3.05 m with 1.05 m of drop. The
  //! difference between what is drawn and what is bought is the whole reason
  //! the length policy exists, and a bill that showed 2.00 would be quoting
  //! the drawing rather than the order.
  check("it shows what was BOUGHT, not what was drawn", /3\.0[45]/.test(bill),
        bill.replace(/\s+/g, " ").slice(0, 140));
  check("and carries the offcut", /drop 1\.0/.test(bill),
        bill.replace(/\s+/g, " ").slice(0, 160));
  //! every 4 of 42 holes is 11 nuts, worked out before the kernel was asked.
  check("and counts the nuts the rule actually chose",
        new RegExp("P1006-1420\\s+" + pickHoles(42, "every 4").length + "\\b").test(bill),
        pickHoles(42, "every 4").length + " expected · "
          + (bill.split("\n").find(l => /P1006/.test(l)) || "").trim());
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall checks passed");
process.exit(failures ? 1 : 0);
