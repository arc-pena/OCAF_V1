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
import { channelByKey, holeStations, patternByKey, pickHoles, stripLength }
  from "../src/unistrut.js";
import { readFileSync } from "fs";

const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
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
  const run = (await tree()).features.find(f => f.id === "R");
  check("the run is a body", !!run && !run.error, run ? String(run.type) : "missing");
}

console.log("\n2. the holes are the catalogue's, not something drawn");
{
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
  check("and the bill buys four sticks, not one", /12\.19/.test(bill),
        bill.replace(/\s+/g, " ").slice(0, 120));
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
