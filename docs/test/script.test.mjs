import { createWasmKernel } from "../src/wasm-kernel.js";
import { readFileSync } from "fs";
const DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const initModule = (await import(DIR + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule, wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });

let failures = 0;
const check = (n, ok, d = "") => { if (!ok) failures++; console.log((ok ? "  ok   " : "  FAIL ") + n + (d ? "  — " + d : "")); };
const ids = l => l.map(e => e.id);

console.log("1. a new Script feature is a spiral stair");
let out = await kernel.loadModel({ format: "ocaf-parametric-model", version: 1, name: "Stair",
  units: "mm", features: [] });
out = await kernel.addFeature("Script", {});
const id = out.id;
check("it built", out.report.failed.length === 0, JSON.stringify(out.report.failed.map(f => f.message)));
const entry = out.tree.features.find(f => f.id === id);
check("the script declared its parameters", entry.params.length === 14, String(entry.params.length));
check("every part is a slider",
  ["steps","rise","sweep","innerRadius","outerRadius","treadThickness","riserThickness",
   "poleRadius","stringerDepth","stringerThickness","railHeight","railWidth","railThickness"]
    .every(k => entry.params.some(p => p.key === k)));
check("the source is on the feature", entry.code.includes("build(p, k)"));

let mesh = (await kernel.mesh([id])).features[0];
check("it is a solid assembly", mesh.triangles > 2000, mesh.triangles + " triangles");
const at13 = mesh.triangles;

console.log("2. the sliders drive the geometry");
out = await kernel.setParameter(id, "steps", 20);
check("only the script re-ran", ids(out.report.executed).join(",") === id);
mesh = (await kernel.mesh([id])).features[0];
check("more steps, more geometry", mesh.triangles > at13, mesh.triangles + " triangles");

out = await kernel.setParameter(id, "riserThickness", 0);
check("risers can be switched off", out.report.failed.length === 0);
const noRisers = (await kernel.mesh([id])).features[0].triangles;
out = await kernel.setParameter(id, "riserThickness", 18);
check("and back on", (await kernel.mesh([id])).features[0].triangles > noRisers);

out = await kernel.setParameter(id, "sweep", 540);
check("a longer sweep still builds", out.report.failed.length === 0,
  JSON.stringify(out.report.failed.map(f => f.message)));

console.log("2b. the rail and the stringer are swept, not chained");
{
  // A sweep is one solid per run. A chain of segments would be many, and its
  // triangle count would climb with the number of joints rather than the length.
  out = await kernel.setCode(id, "code", `({
    params: [{ key: "turns", label: "Turns", def: 2, min: 1, max: 6, step: 1 }],
    build(p, k) {
      const spine = k.helix(300, 400, p.turns);
      const t = k.helixTangent(300, 400);
      return k.sweep(k.ellipse(30, 15, { at: [300, 0, 0], axis: t, xdir: [0, 0, 1] }), spine);
    }
  })`);
  check("a swept ellipse builds", out.report.failed.length === 0,
    JSON.stringify(out.report.failed.map(f => f.message)));
  const one = (await kernel.mesh([id])).features[0];
  check("it is a single solid", one.shape === "solid", String(one.shape));
  await kernel.setParameter(id, "turns", 4);
  const two = (await kernel.mesh([id])).features[0];
  check("twice the run is about twice the mesh, not twice the joints",
    two.triangles > one.triangles * 1.6 && two.triangles < one.triangles * 2.4,
    one.triangles + " -> " + two.triangles);
}
await kernel.setCode(id, "code", (await import("../src/ocaf.js")).SPIRAL_STAIR);

console.log("3. a stair is a body like any other");
out = await kernel.addFeature("Array", { source: id });
check("it can be arrayed", out.report.failed.length === 0,
  JSON.stringify(out.report.failed.map(f => f.message)));
await kernel.deleteFeature(out.id);

console.log("4. editing the code replaces the feature");
out = await kernel.setCode(id, "code", `({
  params: [{ key: "size", label: "Size", def: 60, min: 10, max: 200, step: 1 }],
  build(p, k) { return k.fillet(k.box(p.size, p.size, p.size), p.size / 8); }
})`);
check("the new code ran", out.report.failed.length === 0,
  JSON.stringify(out.report.failed.map(f => f.message)));
const swapped = out.tree.features.find(f => f.id === id);
check("the parameters follow the code", swapped.params.length === 1 && swapped.params[0].key === "size",
  JSON.stringify(swapped.params.map(p => p.key)));

console.log("5. bad code is reported, not thrown");
for (const [name, source] of [
  ["a syntax error", "({ params: [], build(p, k) { return k.box(1 } })"],
  ["no build function", "({ params: [] })"],
  ["returning nothing", "({ params: [], build() { return null; } })"],
  ["a kernel misuse", "({ params: [], build(p, k) { return k.box(-5, 10, 10); } })"],
]) {
  out = await kernel.setCode(id, "code", source);
  check(name + " is reported", out.report.failed.length === 1,
    JSON.stringify(out.report.failed.map(f => f.message)));
}
out = await kernel.setCode(id, "code", '({ params: [], build(p, k) { return k.box(40, 40, 40); } })');
check("the feature recovers", out.report.failed.length === 0);

console.log("6. the model file carries the code and the values");
await kernel.setCode(id, "code", `({
  params: [{ key: "size", label: "Size", def: 60, min: 10, max: 200, step: 1 }],
  build(p, k) { return k.box(p.size, p.size, p.size); }
})`);
await kernel.setParameter(id, "size", 137);
const model = await kernel.model();
const saved = model.features.find(f => f.id === id);
check("the source is in the file", saved.args.code.includes("build(p, k)"));
//! A DECLARED PARAMETER IS AN ARGUMENT NOW, so it is written like one - by
//! its own key, beside the code - rather than bundled under "params". What a
//! file written the old way does is checked below.
check("so is the value, under its own key", saved.args.size === 137,
  JSON.stringify(saved.args).slice(0, 120));
const reloaded = await kernel.loadModel(model);
check("and it rebuilds", reloaded.report.failed.length === 0);
check("with the value it was saved with",
  reloaded.tree.features.find(f => f.id === id).params[0].value === 137);

//! THE OLD SHAPE STILL OPENS. Every file written before a script's
//! parameters were arguments keeps them in one "params" object, and a
//! document that reopened with all its sliders back at their defaults would
//! be a document that had lost its design.
{
  const older = JSON.parse(JSON.stringify(model));
  const feature = older.features.find(f => f.id === id);
  delete feature.args.size;
  feature.args.params = { size: 92 };
  const back = await kernel.loadModel(older);
  check("a file written the old way, with a params bundle, still opens",
    back.report.failed.length === 0,
    JSON.stringify(back.report.failed.map(f => f.message)));
  check("and keeps the value it had",
    back.tree.features.find(f => f.id === id).params[0].value === 92,
    String(back.tree.features.find(f => f.id === id).params[0].value));
  //! And it is an ARGUMENT once it is open, so the next save writes it the
  //! new way and a wire can be put on it.
  const again = (await kernel.model()).features.find(f => f.id === id);
  check("and is written back under its own key", again.args.size === 92,
    JSON.stringify(again.args).slice(0, 120));
}

/* ---------------------------------------------- 6b. a slider can drive it

   The reason for all of the above: a Number node wired onto a script's own
   parameter. Every other slider in the document could be driven by one and
   not a single one of a script's nineteen.                                */
{
  await kernel.loadModel(model);
  const number = await kernel.addFeature("Number", {});
  await kernel.setParameter(number.id, "value", 48);
  const wired = await kernel.setReference(id, "size", number.id);
  check("a Number can be wired onto a declared parameter",
    !wired.report || wired.report.failed.length === 0,
    JSON.stringify((wired.report || { failed: [] }).failed.map(f => f.message)));
  const driven = (await kernel.tree()).tree.features.find(f => f.id === id);
  check("and the script is handed what the wire says, not what the slider holds",
    driven.params[0].value === 48, String(driven.params[0].value));
  const box = (await kernel.mesh([id])).features[0];
  const xs = [];
  for (let i = 0; i < box.positions.length; i += 3) xs.push(box.positions[i]);
  check("which is the box it built", Math.abs((Math.max(...xs) - Math.min(...xs)) - 48) < 1e-6,
    (Math.max(...xs) - Math.min(...xs)).toFixed(3) + " mm across");
  //! And it survives the file.
  const withWire = await kernel.model();
  const row = withWire.features.find(f => f.id === id);
  //! The same shape every other driven slider is written in: the literal
  //! that is underneath the wire, and who is driving it.
  check("the wire is written into the file, the way every slider's is",
    row.args.size && row.args.size.from === number.id
    && Number.isFinite(row.args.size.value),
    JSON.stringify(row.args.size));
  const after = await kernel.loadModel(withWire);
  check("and comes back on reload", after.report.failed.length === 0,
    JSON.stringify(after.report.failed.map(f => f.message)));
  check("still driven by the number",
    after.tree.features.find(f => f.id === id).params[0].value === 48,
    String(after.tree.features.find(f => f.id === id).params[0].value));
}

/* ------------------------------ 6c. the labels a feature keeps are all different

   A feature's labels are numbered, and every one of those numbers is written
   into saved files. Two names for one number is not a clash anything reports:
   the second writer simply overwrites the first, and what is lost is whatever
   the other one was for.

   This happened. PENDING_TAG - where a value a file asked for is held until
   the script has compiled and said whether it has anywhere to put it - was
   given 52, which is the APPEARANCE label. Clearing the pending values after a
   load then dropped the appearance off every feature that had been painted, and
   the only thing in ninety-three suites that noticed was one check about brass.
   So the numbers are now compared with each other here, where they are used,
   and the behaviour is checked as well: a comparison of constants would not
   have caught a third writer reaching the same label by another route.      */
console.log("6c. every label a feature keeps has its own number");
{
  const O = await import("../src/ocaf.js");
  const singles = ["RESULT_TAG", "ERROR_TAG", "REVISION_TAG", "DATA_TAG", "NOTE_TAG",
                   "SPECS_TAG", "PENDING_TAG", "APPEARANCE_TAG", "FRAME_TAG",
                   "PARENT_TAG", "SPREAD_TAG", "SHOWN_TAG"];
  const seen = new Map();
  const clashes = [];
  for (const name of singles) {
    const tag = O[name];
    if (seen.has(tag)) clashes.push(seen.get(tag) + " and " + name + " are both " + tag);
    else seen.set(tag, name);
  }
  check("no two of them are the same number", clashes.length === 0, clashes.join("; "));
  //! And none of them falls inside a numbered BLOCK, which is the other way
  //! two labels end up being one.
  const blocks = [["the old parameter block", O.PARAM_TAG_BASE, O.PARAM_TAG_LIMIT],
                  ["the declared argument block", O.DECLARED_TAG_BASE, O.DECLARED_TAG_LIMIT],
                  ["the argument tags", O.FIRST_ARG_TAG, O.PARAM_TAG_BASE]];
  const inside = [];
  for (const name of singles)
    for (const [what, lo, hi] of blocks)
      if (O[name] >= lo && O[name] < hi) inside.push(name + " is inside " + what);
  check("and none of them is inside a block of them", inside.length === 0, inside.join("; "));
}

/* --------------- 6d. a painted script keeps its paint across the file

   The behaviour the clash above broke, on the feature that owns the pending
   label. A Script is the only thing that HAS pending values, so it is the one
   whose appearance a collision there would take.                            */
console.log("6d. a painted script keeps its paint");
{
  await kernel.loadModel(model);
  const wear = { finish: "brass", color: [0.83, 0.66, 0.31], gloss: 0.31 };
  await kernel.setAppearance(id, wear);
  const before = (await kernel.tree()).tree.features.find(f => f.id === id);
  check("the script wears it", before.appearance && before.appearance.finish === "brass",
    JSON.stringify(before.appearance));
  const file = await kernel.model();
  check("and the file carries it",
    file.features.find(f => f.id === id).appearance.finish === "brass");
  const back = await kernel.loadModel(file);
  const after = back.tree.features.find(f => f.id === id);
  check("it is still painted after the load - the pending values do not take it",
    after.appearance && after.appearance.finish === "brass",
    JSON.stringify(after.appearance));
  //! \p model is the file saved in section 6, so the value it put aside is
  //! that one: what is being checked is that the appearance and the pending
  //! parameter both land, not which number it was.
  check("and the parameter the file put aside arrived anyway",
    after.params[0].value === 137, String(after.params[0].value));
}

console.log("7. the scene exports as STEP");
await kernel.setCode(id, "code", (await import("../src/ocaf.js")).SPIRAL_STAIR);
await kernel.setParameter(id, "steps", 6);
const step = await kernel.exportStep();
check("it is a STEP file", step.text.startsWith("ISO-10303-21;"), step.text.slice(0, 20));
check("it carries solids", /MANIFOLD_SOLID_BREP/.test(step.text));
check("in millimetres", /MILLI/.test(step.text) || step.units === "mm");
check("every visible solid went in", step.solids >= 1, String(step.solids));
check("and it is a real file, not a stub", step.text.length > 20000, step.text.length + " bytes");
console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
