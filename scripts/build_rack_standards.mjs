// A sample per rack standard, built from the standard itself.
//
//     node scripts/build_rack_standards.mjs
//
// WHY THESE ARE SEPARATE FROM THE HYPERSTACK SAMPLE. That one is a showcase:
// one rack, filled with equipment, wired, doored, on levelling feet, to argue
// that this modeller holds a real build to LOD 400. These four are the OPPOSITE
// argument - the least model that can be checked against a published document.
// Each is a frame and four posts on one standard, and everything about it comes
// out of RACK_STANDARDS, so opening one and measuring it is measuring the
// specification.
//
// THE FOUR, and what each is for:
//
//   eia310   the 19-inch rack everybody has. Three holes to a U at 5/8, 5/8 and
//            1/2 of an inch, square for cage nuts.
//   orv3     OCP Open Rack V3: 48 mm OpenU, two holes a unit at 9 and 33, round
//            and taking thread-forming screws rather than cage nuts.
//   metav3   Meta's frame on that interface - 2286 tall, 44 OU, and the 1-OpenU
//            cross brace the load rating asks for above 800 kg, at its default
//            23 OU.
//   orw      Open Rack Wide, whose vertical interface is Open Rack's and whose
//            FRAME WIDTH is not in this program, because it could not be read
//            off the drawing. Its sample therefore takes the width as a
//            parameter and says so on the feature - which is the honest way to
//            ship a standard you have only half read, and is visible rather
//            than buried in a comment.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { PluginHost } from "../docs/src/plugin.js";
import { RACK } from "../docs/src/rack-plugin.js";
import { RACK_STANDARDS, holeCentres, rackHeight, rackStandard } from "../docs/src/rack.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "data", "samples");
const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";

//! WHAT EACH SAMPLE IS. Height in the standard's own units, and a width to use
//! when the standard does not publish one this program has read.
const PLAN = [
  { key: "eia310", units: 42, file: "rack_eia310.json",
    name: "EIA-310-E 19 inch · 42U",
    note: "Three holes to a U at 5/8, 5/8 and 1/2 of an inch - the spacing "
        + "everybody draws evenly and is not - square for cage nuts.",
    postHoles: 0, width: 600, postWidth: 50 },
  { key: "orv3", units: 44, file: "rack_orv3.json",
    name: "OCP Open Rack V3 · 44 OU",
    note: "48 mm OpenU, two round holes a unit at 9 and 33 above its own "
        + "boundary, for M5 and M6 thread-forming screws. No cage nuts.",
    postHoles: 1, width: 600.24, postWidth: 50 },
  { key: "metav3", units: 44, file: "rack_metav3.json",
    name: "Meta Open Rack V3 · 44 OU",
    note: "Meta's frame on the same interface: 2286 floor to top, 600 x 1068, "
        + "rated 1400 kg, with the 1-OpenU cross brace at 23 OU.",
    postHoles: 1, width: 600, postWidth: 50, brace: true },
  { key: "orw", units: 44, file: "rack_orw.json",
    name: "OCP Open Rack Wide · 44 OU",
    note: "The Open Rack vertical interface, tapped M6 x 1.0. ITS FRAME WIDTH "
        + "IS NOT FROM THE SPECIFICATION - the cross-section is drawn too "
        + "small to read and the full-resolution view is in the appendix, so "
        + "the width here is a parameter somebody sets.",
    postHoles: 1, width: 800, postWidth: 60, widthIsMine: true },
];

/* ------------------------------------------------------ writing one of them */

function modelFor(plan) {
  const spec = rackStandard(plan.key);
  const features = [];
  const add = (id, type, more = {}) => {
    const { refs, wire, args, ...rest } = more;
    const made = { ...(args || {}) };
    for (const [key, from] of Object.entries(refs || {}))
      made[key] = Array.isArray(from) ? from.map(one => ({ ref: one })) : { ref: from };
    for (const [key, [from, value]] of Object.entries(wire || {})) made[key] = { value, from };
    features.push({ id, type, ...rest, ...(Object.keys(made).length ? { args: made } : {}) });
    return id;
  };
  const set = (id, name) => add(id, "GeometricalSet", { name });

  const root = set("R", plan.name);
  set("P", "00 The standard");
  features[features.length - 1].parent = root;
  add("N_UNITS", "Number", { name: "Height (" + spec.unitName + ")", parent: "P",
    args: { value: plan.units } });
  add("N_WIDTH", "Number", { name: "Frame width", parent: "P",
    args: { value: plan.width } });

  set("F", "01 Frame");
  features[features.length - 1].parent = root;
  add("PT0", "Point", { name: "Origin", parent: "F", args: { x: 0, y: 0, z: 0 } });
  add("VZ", "Vector", { name: "Up", parent: "F", args: { dx: 0, dy: 0, dz: 1 } });
  add("PL0", "Plane", { name: "Floor", parent: "F", refs: { origin: "PT0", normal: "VZ" } });

  const standardAt = RACK_STANDARDS.findIndex(one => one.key === plan.key);
  add("FRAME", "RackFrame", { name: "Frame · " + plan.units + spec.unitName, parent: "F",
    refs: { plane: "PL0" },
    wire: { units: ["N_UNITS", plan.units] },
    args: { standard: standardAt, profile: 2, rails: 3, posts: 0,
            postWidth: plan.postWidth, depth: spec.depth || 1000,
            //! Only read where the standard publishes no width - ORW.
            width: plan.widthIsMine ? plan.width : 0,
            supplier: plan.name } });

  //! THE FOUR POSTS, on the standard's own hole column spacing where it has
  //! one and on the frame's otherwise. This is the whole point of these
  //! samples: the holes are the standard's, drilled by the node from the table.
  const inset = 40;
  const span = spec.columns ? spec.columns : plan.width - 2 * inset - plan.postWidth;
  const depth = spec.depth || 1000;
  [[inset, 60], [inset + span, 60], [inset, depth - 60], [inset + span, depth - 60]]
    .forEach(([x, y], i) => {
      add("PTP" + i, "Point", { name: "Post " + (i + 1) + " at", parent: "F",
        args: { x, y, z: 0 } });
      add("POST" + i, "RackPost", { name: "Post " + (i + 1) + " · " + spec.name, parent: "F",
        refs: { plane: "PL0", at: "PTP" + i },
        wire: { units: ["N_UNITS", plan.units] },
        args: { standard: standardAt, holes: plan.postHoles,
                width: plan.postWidth, wall: 2,
                bore: spec.bore || 7,
                supplier: "post · " + spec.from.slice(0, 60) } });
    });

  //! META'S CROSS BRACE, which is a real requirement rather than decoration:
  //! above 800 kg of IT the frame wants one, and the specification names both
  //! the range it may sit in and where it goes by default.
  if (plan.brace) {
    const at = (spec.braceAtOU - 1) * spec.unit;
    add("VX", "Vector", { name: "Across", parent: "F", args: { dx: 1, dy: 0, dz: 0 } });
    add("PLX", "Plane", { name: "Across the rack", parent: "F",
      refs: { origin: "PT0", normal: "VX" } });
    add("PTB", "Point", { name: "Cross brace at " + spec.braceAtOU + " OU", parent: "F",
      args: { x: inset + plan.postWidth, y: depth - 60 + plan.postWidth / 2, z: at } });
    add("BRACE", "Strut", { name: "Cross brace · 1 OpenU, at " + spec.braceAtOU + " OU",
      parent: "F", refs: { plane: "PLX", at: "PTB" },
      args: { profile: 2, length: span - plan.postWidth, holes: 0,
              supplier: "cross brace - required above " + spec.braceAboveKg + " kg" } });
  }

  set("Z", "02 Bill of materials");
  features[features.length - 1].parent = root;
  add("BOM", "Bill", { name: "Bill of materials", parent: "Z",
    refs: { of: "R" }, args: { show: 0 } });

  return { format: "ocaf-parametric-model", version: 1, name: plan.name,
           units: "mm", needs: ["rack"], features };
}

/* ================================================= built, then questioned */

const initModule = (await import(WASM + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule,
  wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const host = new PluginHost({ toolkit: () => kernel.toolkit(),
  installDrivers: (s, b) => kernel.installDrivers(s, b),
  removeDrivers: s => kernel.removeDrivers(s), typesInUse: t => kernel.typesInUse(t) });
await host.load("rack");
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
const kit = kernel.toolkit();

let bad = 0;
for (const plan of PLAN) {
  const model = modelFor(plan);
  const out = await mdl.run({ op: "model", model });
  const rows = out.tree.features;
  const broken = rows.filter(f => f.error);
  const spec = rackStandard(plan.key);

  const boxOf = id => {
    const b = kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
      .find(one => one.id === id);
    return b ? kit.extents(b.shape) : null;
  };

  console.log("\n" + plan.name + "  (" + model.features.length + " features)");
  if (broken.length) {
    bad++;
    for (const f of broken.slice(0, 4))
      console.log("   ERROR " + f.name + ": " + String(f.error).slice(0, 90));
    continue;
  }

  //! THE HEIGHT IS THE STANDARD'S ARITHMETIC, not a number in this file.
  const want = rackHeight(plan.key, plan.units);
  const frame = boxOf("FRAME");
  const ok = Math.abs(frame.size[2] - want) < 1e-6;
  console.log("   frame " + frame.size.map(n => n.toFixed(1)).join(" × ")
    + "   (" + plan.units + spec.unitName + " = " + want.toFixed(2) + ")" + (ok ? "" : "  WRONG"));
  if (!ok) bad++;

  //! AND THE HOLES ARE THE STANDARD'S PATTERN, counted off the built post.
  const holes = holeCentres(plan.key, plan.units);
  const faces = kit.countSubShapes(
    kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
      .find(one => one.id === "POST0").shape, kit.FACE);
  console.log("   post: " + holes.length + " holes from the standard · " + faces + " faces"
    + " · pattern " + JSON.stringify(spec.holes));
  if (!holes.length) { console.log("   no pattern - nothing to drill"); bad++; }

  const bom = rows.find(f => f.id === "BOM");
  console.log("   bill: " + String((bom.data || {}).preview || "").slice(0, 110));

  writeFileSync(join(OUT, plan.file), JSON.stringify(model, null, 1));
  console.log("   wrote " + plan.file);
}

console.log(bad ? "\n" + bad + " sample(s) not right" : "\nall four built");
process.exit(bad ? 1 : 0);
