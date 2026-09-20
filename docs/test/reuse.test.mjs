// A geometrical set out of one file and into another.
//
// The claim is that a set is already a user-defined feature: what it needs
// from the rest of the document is whatever its contents read from outside
// it, and everything else about it travels. So the checks are about exactly
// that: what came across, what was left for you to supply, and that nothing
// arrived pointed at whatever happened to be lying about in the new file.
//
// Planned here as a list of edits and then RUN against a real kernel, because
// a plan that is right and a document that is wrong is not an import.
import { contentsOf, inputsOf, instantiateEdits, saysReuse, setsIn,
         wiresIn } from "../src/reuse.js";
import { CATALOGUE } from "../src/ocaf.js";
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { readFileSync } from "fs";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const spec = type => CATALOGUE.find(one => one.type === type) || null;

//! A file with a set in it that reads two things from outside: the plane the
//! circle stands on and the number the extrude is driven by. Written out the
//! way the modeller writes one, so if the format changes this test notices.
const FILE = {
  format: "ocaf-parametric-model", version: 1, name: "Library", units: "mm",
  features: [
    { id: "P0", type: "Point", name: "Origin", args: { kind: "Coordinates", x: 0, y: 0, z: 0 } },
    { id: "VZ", type: "Vector", name: "Up", args: { kind: "Typed in", dx: 0, dy: 0, dz: 1 } },
    { id: "PL", type: "Plane", name: "Ground",
      args: { origin: { ref: "P0" }, normal: { ref: "VZ" } } },
    { id: "NU", type: "Number", name: "Post height", args: { value: 2400 } },
    { id: "GS", type: "GeometricalSet", name: "Post", args: {} },
    { id: "PT", type: "Point", name: "Foot", parent: "GS",
      args: { kind: "Coordinates", x: 100, y: 200, z: 0 } },
    { id: "CI", type: "Circle", name: "Section", parent: "GS",
      args: { plane: { ref: "PL" }, radius: 60, centre: { ref: "PT" },
              onPlane: "Only says which way it faces", kind: "A radius" } },
    { id: "EX", type: "Extrude", name: "Shaft", parent: "GS",
      args: { profile: { ref: "CI" }, direction: { ref: "VZ" },
              distance: { value: 1200, from: "NU" } } },
  ],
};

console.log("1. what a file offers");
{
  const sets = setsIn(FILE);
  check("it finds the set", sets.length === 1 && sets[0].id === "GS",
        JSON.stringify(sets));
  check("and says how much is in it", sets[0].holds === 3, "" + sets[0].holds);
  check("and how much it would ask for", sets[0].inputs === 3, "" + sets[0].inputs);
  check("said in one line", /Post · 3 features · 3 inputs/.test(saysReuse(sets[0])),
        saysReuse(sets[0]));
  check("its contents are the three inside it",
        contentsOf(FILE, "GS").map(f => f.id).join() === "PT,CI,EX");
}

console.log("\n2. the wires, all three ways they are written");
{
  const circle = FILE.features.find(f => f.id === "CI");
  check("a plain wire is found", wiresIn(circle).some(w => w.key === "plane" && w.to === "PL"));
  check("and so is a second one on the same feature",
        wiresIn(circle).some(w => w.key === "centre" && w.to === "PT"));
  const extrude = FILE.features.find(f => f.id === "EX");
  check("a driven number is a wire too",
        wiresIn(extrude).some(w => w.key === "distance" && w.to === "NU" && w.drives));
  const inputs = inputsOf(FILE, "GS");
  check("only the ones that leave the set are inputs",
        inputs.map(one => one.key).sort().join() === "direction,distance,plane",
        JSON.stringify(inputs.map(one => one.holderName + "." + one.key)));
  check("and the one that stays inside it is not",
        !inputs.some(one => one.key === "centre"));
}

console.log("\n3. the plan");
const plan = instantiateEdits(FILE, "GS", { spec, taken: new Set(["PT"]) });
{
  check("it makes the set and everything in it",
        plan.edits.filter(e => e.op === "add").length === 4,
        "" + plan.edits.filter(e => e.op === "add").length);
  check("and files each one under it",
        plan.edits.filter(e => e.op === "group").length === 3);
  // An id already taken in this document is not taken twice.
  check("an id already in use is stepped round",
        plan.renamed.PT !== "PT", JSON.stringify(plan.renamed));
  check("the wire that stayed inside the set is remade",
        plan.edits.some(e => e.op === "connect" && e.key === "centre"
                          && e.from === plan.renamed.PT));
  check("the two that left it are not",
        !plan.edits.some(e => e.op === "connect" && (e.from === "PL" || e.from === "NU")),
        JSON.stringify(plan.edits.filter(e => e.op === "connect")));
  check("and they come back as the inputs to supply",
        plan.inputs.map(one => one.key).sort().join() === "direction,distance,plane",
        JSON.stringify(plan.inputs));
  check("a choice written in the file's own words is put back as its number",
        plan.edits.some(e => e.op === "set" && e.key === "onPlane" && e.value === 0),
        JSON.stringify(plan.edits.filter(e => e.key === "onPlane")));
  check("a driven number keeps the value it falls back on",
        plan.edits.some(e => e.op === "set" && e.key === "distance" && e.value === 1200));
  check("and the numbers travel", plan.edits.some(e => e.op === "set" && e.key === "radius"
                                                    && e.value === 60));
}

console.log("\n4. and it really runs, against a real kernel");
{
  const DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
  const init = (await import(DIR + "/replicad_single.js")).default;
  const kernel = await createWasmKernel({ initModule: init,
                                          wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
  const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                        select: () => {}, selected: () => null });
  await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
                                        name: "Host", units: "mm", features: [] } });
  // A host document with its own plane and its own number, so the imported
  // set has something to be supplied WITH.
  await mdl.runAll([
    { op: "add", type: "Point", id: "HP", name: "Origin" },
    { op: "add", type: "Vector", id: "HV", name: "Z" },
    { op: "set", id: "HV", key: "dz", value: 1 },
    { op: "add", type: "Plane", id: "HPL", name: "Site plane",
      refs: { origin: "HP", normal: "HV" } },
    { op: "add", type: "Number", id: "HN", name: "Storey" },
    { op: "set", id: "HN", key: "value", value: 3000 },
  ]);
  const tree = async () => {
    const answer = await kernel.tree();
    return (answer.tree || answer).features || [];
  };
  const taken = new Set((await tree()).map(f => f.id));
  const takenNames = new Set((await tree()).map(f => f.name));
  const here = instantiateEdits(FILE, "GS", { spec, taken, takenNames });
  await mdl.runAll(here.edits);
  const after = await tree();
  const set = after.find(f => f.id === here.id);
  check("the set arrived", !!set, here.id + " of " + after.map(f => f.id).join());
  check("with everything in it", after.filter(f => f.parent === here.id).length === 3,
        "" + after.filter(f => f.parent === here.id).length);
  const circle = after.find(f => f.name === "Section" || /Section/.test(f.name));
  check("the circle came with its radius",
        circle && circle.values.radius === 60, JSON.stringify(circle && circle.values));
  check("and still stands on the point that came with it",
        circle && circle.refs.centre === here.renamed.PT,
        JSON.stringify(circle && circle.refs));
  check("and its plane arrived empty, waiting to be supplied",
        circle && !circle.refs.plane, JSON.stringify(circle && circle.refs));
  // NOW SUPPLY IT, which is the whole point.
  const extrude = after.find(f => /Shaft/.test(f.name));
  await mdl.runAll([
    { op: "connect", id: circle.id, key: "plane", from: "HPL" },
    { op: "connect", id: extrude.id, key: "distance", from: "HN" },
    { op: "connect", id: extrude.id, key: "direction", from: "HV" },
  ]);
  const done = await tree();
  const built = done.find(f => f.id === extrude.id);
  check("supplied, the set builds", built && !built.error, (built || {}).error);
  // A circle of radius 60 extruded 3000 is pi r^2 h and nothing else.
  await mdl.runAll([
    { op: "add", type: "Measure", id: "MV", name: "Volume", refs: { shape: extrude.id } },
    { op: "set", id: "MV", key: "quantity", value: 2 }]);
  const measured = (await tree()).find(f => f.id === "MV");
  const volume = Number((((measured || {}).data || {}).preview || "").match(/[\d.]+/));
  check("and it is the right size: pi r squared, three metres tall",
        Math.abs(volume - Math.PI * 60 * 60 * 3000) < Math.PI * 60 * 60 * 3000 * 0.001,
        volume + " wanted " + (Math.PI * 3600 * 3000).toFixed(0));
  // Twice, and the second one does not tread on the first.
  const again = instantiateEdits(FILE, "GS",
    { spec, taken: new Set(done.map(f => f.id)),
      takenNames: new Set(done.map(f => f.name)) });
  await mdl.runAll(again.edits);
  const both = await tree();
  check("a second copy lands beside the first, not on it",
        both.filter(f => f.type === "GeometricalSet").length === 2,
        both.filter(f => f.type === "GeometricalSet").map(f => f.name).join(" / "));
  check("and the two have different names",
        new Set(both.filter(f => f.type === "GeometricalSet").map(f => f.name)).size === 2,
        both.filter(f => f.type === "GeometricalSet").map(f => f.name).join(" / "));
  check("the first one still builds after the second arrived",
        !(await tree()).find(f => f.id === extrude.id).error);
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
