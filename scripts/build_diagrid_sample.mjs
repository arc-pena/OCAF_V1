// Builds docs/data/samples/diagrid_plan.json — the diagrid masterplan, as one
// Script feature with its sliders.
//
//     node scripts/build_diagrid_sample.mjs
//
// The script itself lives in scripts/diagrid.script.js and is embedded here
// rather than written twice: that file is what docs/test/diagrid.test.mjs
// drives, so what the sample ships and what the tests measure cannot drift
// apart.
//
// THE SITE is SiteBoundary.dxf as supplied: three polylines and three
// quadratic splines on layer NEW-PlotLine, chained into one closed ring of 44
// points, 33.2 hectares, 602 x 853 m. The two tiny splines are fillets at the
// kinks; the long one is the curved west edge, sampled at 24 segments. Metres
// in the file (INSUNITS 6), millimetres here, so everything is x1000.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { readFileSync, writeFileSync } from "fs";

const WASM = process.env.OCJS_DIR
  || new URL("../docs/.kernel/package/dist", import.meta.url).pathname;
const OUT = new URL("../docs/data/samples/diagrid_plan.json", import.meta.url).pathname;
const SRC = new URL("./diagrid.script.js", import.meta.url).pathname;

const code = readFileSync(SRC, "utf8");

const model = {
  format: "ocaf-parametric-model", version: 1, name: "Diagrid plan", units: "mm",
  features: [
    { id: "PLAN", type: "Script", name: "Diagrid masterplan", args: { code },
      appearance: { finish: "concrete" } },
  ],
};

/* ------------------------------------------------- built before it is written */
const initModule = (await import(WASM + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule,
  wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null });
await mdl.run({ op: "model", model });
const at = async () => (await kernel.tree()).tree.features.find(f => f.id === "PLAN");

let bad = 0;
const say = line => console.log("  " + line);
const entry = await at();
if (entry.error) { say("FAILED — " + entry.error); bad++; }
say((entry.params || []).length + " sliders: "
  + (entry.params || []).map(p => p.key).join(" "));

//! WHAT IT ACTUALLY MADE, measured off the mesh rather than off the script's
//! own arithmetic - a plan() that returns a hundred polygons and a build()
//! that drops them all would look identical from the inside.
const mesh = (await kernel.mesh(["PLAN"])).features[0];
const xs = [], ys = [], zs = [];
for (let i = 0; i + 2 < mesh.positions.length; i += 3) {
  xs.push(mesh.positions[i]); ys.push(mesh.positions[i + 1]); zs.push(mesh.positions[i + 2]);
}
const round = v => Math.round(v / 100) / 10;
say(mesh.triangles + " triangles · " + round(Math.min(...xs)) + ".." + round(Math.max(...xs))
  + " m east, " + round(Math.min(...ys)) + ".." + round(Math.max(...ys)) + " m north, "
  + round(Math.min(...zs)) + ".." + round(Math.max(...zs)) + " m up");

//! AND THAT THE SLIDERS DRIVE IT. A Script feature whose code throws on a
//! setting somebody will certainly try is a sample that breaks the first time
//! it is touched, so the ends of the four that change the most are driven
//! here rather than left to the person who opens it.
for (const [key, value] of [["rings", 2], ["rings", 30], ["spokes", 2], ["spokes", 60],
                            ["focus", 150000], ["focus", 20000000], ["merge", 1],
                            ["inset", 0], ["inset", 60000], ["pinch", 1], ["drift", 1],
                            ["triangles", 1], ["squares", 1], ["show", 2]]) {
  await mdl.run({ op: "set", id: "PLAN", key, value });
  const got = await at();
  if (got.error) { say("FAILED at " + key + " = " + value + " — " + got.error); bad++; }
  const spec = (got.params || []).find(p => p.key === key);
  await mdl.run({ op: "set", id: "PLAN", key, value: spec ? spec.def : value });
}
say("every slider end builds");

if ((await at()).error) { say("FAILED after the sweep"); bad++; }
if (bad) process.exit(1);

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("wrote " + OUT + "  (" + Math.round(code.length / 1024) + " kB of script)");
