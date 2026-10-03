// A museum of Unistrut assemblages.
//
// Eight bays on a grid, each one a thing people actually build out of strut
// channel, each labelled with the system it uses and what it is for. The point
// is not the geometry - any of these is a few lines of channel - it is that
// every piece in every bay is a PART NUMBER, and the bill at the end of the
// file is the sum of all eight and can be ordered.
//
// Laid out like the sweep gallery: a flat grid in plan, a text dot over each
// bay, nothing clever about the arrangement so the exhibits can be compared.
//
// The channel, the punchings, the nuts and the fittings all come out of
// docs/src/unistrut.js, which was read off General Engineering Catalog 18A.
// Nothing here types in a dimension that the catalogue already knows.

import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { PluginHost } from "../docs/src/plugin.js";
import { UNISTRUT } from "../docs/src/unistrut-plugin.js";
import { channelByKey, holeStations, lengthPlan, pickHoles } from "../docs/src/unistrut.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "data", "samples", "strut_museum.json");

//! The grid the bays stand on. 4 m apart in both directions, which is enough
//! that nothing touches its neighbour and close enough that four fit on screen.
const PITCH = 4000;
const COLS = 4;

const LOOK = {
  channel: { finish: "steel", color: [0.70, 0.72, 0.74], gloss: 0.32 },
  heavy: { finish: "steel", color: [0.56, 0.58, 0.62], gloss: 0.28 },
  nut: { finish: "steel", color: [0.40, 0.42, 0.45], gloss: 0.55 },
  fitting: { finish: "steel", color: [0.52, 0.55, 0.58], gloss: 0.4 },
  ground: { finish: "concrete", color: [0.80, 0.79, 0.76], gloss: 0.08 },
};

const features = [];
const add = (id, type, more = {}) => {
  const { refs, args, ...rest } = more;
  const made = { ...(args || {}) };
  for (const [key, from] of Object.entries(refs || {}))
    made[key] = Array.isArray(from) ? from.map(one => ({ ref: one })) : { ref: from };
  features.push({ id, type, ...rest, ...(Object.keys(made).length ? { args: made } : {}) });
  return id;
};
const set = (id, name, parent = "H", look = null) =>
  add(id, "GeometricalSet", { name, ...(parent ? { parent } : {}),
                              ...(look ? { appearance: look } : {}) });

add("H", "GeometricalSet", { name: "Unistrut · a museum of assemblages" });

//! The ground the bays stand on, so the exhibits read as standing rather than
//! floating. One slab under the lot.
add("GP", "Point", { name: "Ground corner", parent: "H",
  args: { x: -PITCH * 0.6, y: -PITCH * 0.6, z: -40 } });
add("GND", "Cube", { name: "Ground", parent: "H", appearance: LOOK.ground,
  refs: { origin: "GP" },
  args: { dx: PITCH * (COLS - 1) + PITCH * 1.2, dy: PITCH * 1 + PITCH * 1.2, dz: 40 } });

let bay = 0;
const bays = [];

//! One exhibit. `draw` is handed a prefix and the bay's origin and returns the
//! ids of everything it made, so the labelling and the bill are written once.
function exhibit(name, system, application, draw) {
  const i = bay++;
  const ox = (i % COLS) * PITCH, oy = Math.floor(i / COLS) * PITCH;
  const p = "B" + i;
  set(p, name, "H");
  const made = draw(p, ox, oy) || {};
  //! The label, pinned over the bay at a height that clears whatever is in it.
  add(p + "_TP", "Point", { name: name + " label point", parent: p,
    args: { x: ox, y: oy, z: (made.tall || 1800) + 500 } });
  add(p + "_TAG", "Tag", { name: name, parent: p, refs: { at: p + "_TP" },
    args: { note: system + " · " + application, size: "Medium" } });
  bays.push({ id: p, name, system, application });
  return p;
}

//! Two points and the line between them, which is what every run here is
//! drawn on. Written once because eight bays of it is most of this file.
const line = (p, n, a, b) => {
  add(p + "_" + n + "a", "Point", { name: n + " start", parent: p,
    args: { x: a[0], y: a[1], z: a[2] } });
  add(p + "_" + n + "b", "Point", { name: n + " end", parent: p,
    args: { x: b[0], y: b[1], z: b[2] } });
  return add(p + "_" + n, "Polyline", { name: n, parent: p,
    refs: { points: [p + "_" + n + "a", p + "_" + n + "b"] },
    args: { closed: "Open" } });
};

const loop = (p, n, pts) => {
  const ids = pts.map((q, k) => add(p + "_" + n + k, "Point", {
    name: n + " " + k, parent: p, args: { x: q[0], y: q[1], z: q[2] } }));
  return add(p + "_" + n, "Polyline", { name: n, parent: p,
    refs: { points: ids }, args: { closed: "Closed" } });
};

const run = (p, n, path, channel, pattern, opts = {}) =>
  add(p + "_" + n, "StrutRun", { name: opts.name || n, parent: p,
    appearance: opts.look || LOOK.channel, refs: { path },
    args: { channel, pattern, finish: opts.finish || "PG",
            facing: opts.facing || "Up", roll: opts.roll || 0,
            length: opts.length || "Cut from sticks" } });

const nuts = (p, n, on, nut, where) =>
  add(p + "_" + n, "StrutNut", { name: n, parent: p, appearance: LOOK.nut,
    refs: { run: on }, args: { nut, where } });

/* ------------------------------------------------------------- the exhibits */

//! 1. A SERVER RACK FRAME. Four uprights and two pairs of rails - the frame a
//! data hall rack is built on before anything is hung in it. P1001 uprights
//! because they carry the whole load of a loaded rack.
exhibit("Rack frame", "P1001 uprights, P1000 rails", "data hall equipment rack",
  (p, ox, oy) => {
    const W = 600, D = 1000, H = 2100;
    for (const [n, x, y] of [["c1", 0, 0], ["c2", W, 0], ["c3", W, D], ["c4", 0, D]])
      run(p, n, line(p, n + "l", [ox + x, oy + y, 0], [ox + x, oy + y, H]),
          "P1001", "HS", { look: LOOK.heavy, facing: "Up" });
    for (const z of [300, 1200, 2100]) {
      const l = loop(p, "r" + z, [[ox, oy, z], [ox + W, oy, z],
                                  [ox + W, oy + D, z], [ox, oy + D, z]]);
      run(p, "rail" + z, l, "P1000", "HS", {});
    }
    nuts(p, "n", p + "_rail1200", "P1006-1420", "every 3");
    return { tall: H };
  });

//! 2. A TRAPEZE HANGER. The commonest thing in the catalogue: a cross member on
//! two drop rods, carrying pipe or tray. P3300 because a trapeze carries its
//! load in bending over a short span and the half-height section is enough.
exhibit("Trapeze hanger", "P3300 cross member", "pipe and conduit support",
  (p, ox, oy) => {
    const S = 1200, H = 2400;
    for (const [n, x] of [["d1", -S / 2], ["d2", S / 2]])
      run(p, n, line(p, n + "l", [ox + x, oy, H], [ox + x, oy, H - 900]),
          "P1000", "HS", { facing: "Up" });
    const cross = line(p, "x", [ox - S / 2, oy, H - 900], [ox + S / 2, oy, H - 900]);
    run(p, "cross", cross, "P3300", "HS", { facing: "Up" });
    nuts(p, "n", p + "_cross", "P4006-1420", "2, -2");
    return { tall: H };
  });

//! 3. A WALL BRACKET for a condenser or an air handler: a vertical channel
//! fixed to the wall and two cantilever arms off it.
exhibit("Wall bracket", "P1000 upright, P1000 arms", "AC unit wall attachment",
  (p, ox, oy) => {
    const H = 1800, OUT_ = 700;
    const up = line(p, "u", [ox, oy, 0], [ox, oy, H]);
    run(p, "upright", up, "P1000", "HS", { facing: "Right" });
    for (const [n, z] of [["a1", 600], ["a2", 1400]])
      run(p, n, line(p, n + "l", [ox, oy, z], [ox + OUT_, oy, z]), "P1000", "HS",
          { facing: "Up" });
    nuts(p, "n", p + "_a1", "P1008", "1, -1");
    return { tall: H };
  });

//! 4. SHELVING. Uprights and shelf bearers - the storage rack on p6 of the
//! showcase, and the same frame a laboratory bench is built on.
exhibit("Shelving", "P1000 frame, P3300 bearers", "storage racks and shelves",
  (p, ox, oy) => {
    const W = 1200, D = 450, H = 2000;
    for (const [n, x, y] of [["c1", 0, 0], ["c2", W, 0], ["c3", W, D], ["c4", 0, D]])
      run(p, n, line(p, n + "l", [ox + x, oy + y, 0], [ox + x, oy + y, H]),
          "P1000", "HS", {});
    for (const z of [400, 900, 1400, 1900])
      for (const [n, y] of [["f", 0], ["b", D]])
        run(p, n + z, line(p, n + z + "l", [ox, oy + y, z], [ox + W, oy + y, z]),
            "P3300", "HS", { facing: "Up" });
    nuts(p, "n", p + "_f900", "P4006-1420", "every 2");
    return { tall: H };
  });

//! 5. A CEILING GRID. Channel hung on drops with a cross grid under it - what
//! a facade hanger or a run of services is fixed to overhead.
exhibit("Ceiling grid", "P1001 runners, P1000 cross", "facade hangers from soffit",
  (p, ox, oy) => {
    const W = 2400, D = 1600, H = 2800;
    for (const [n, x, y] of [["d1", 0, 0], ["d2", W, 0], ["d3", 0, D], ["d4", W, D]])
      run(p, n, line(p, n + "l", [ox + x, oy + y, H], [ox + x, oy + y, H - 600]),
          "P1000", "HS", {});
    for (const [n, y] of [["r1", 0], ["r2", D]])
      run(p, n, line(p, n + "l", [ox, oy + y, H - 600], [ox + W, oy + y, H - 600]),
          "P1001", "HS", { look: LOOK.heavy });
    for (const x of [600, 1200, 1800])
      run(p, "x" + x, line(p, "x" + x + "l", [ox + x, oy, H - 740],
                           [ox + x, oy + D, H - 740]), "P1000", "HS", { facing: "Down" });
    nuts(p, "n", p + "_r1", "P1010", "every 4");
    return { tall: H };
  });

//! 6. A CABLE LADDER RUN on cantilever arms off a spine - the cable tray
//! support on p11, and the arms of the aisle containment frame.
exhibit("Cable tray spine", "P1001 spine, P1000 arms", "cable tray supports",
  (p, ox, oy) => {
    const L = 2400, H = 2200;
    const spine = line(p, "s", [ox, oy, H], [ox + L, oy, H]);
    run(p, "spine", spine, "P1001", "HS", { look: LOOK.heavy });
    for (const x of [200, 1000, 1800])
      for (const [n, s] of [["l", -1], ["r", 1]])
        run(p, "a" + x + n, line(p, "a" + x + n + "l", [ox + x, oy, H - 200],
                                 [ox + x, oy + 500 * s, H - 200]),
            "P1000", "HS", { facing: "Up" });
    nuts(p, "n", p + "_spine", "P1008", "jump 2 3");
    return { tall: H };
  });

//! 7. A SEISMIC BRACED FRAME: a portal with a diagonal, which is where the
//! channel is in tension and compression rather than bending.
exhibit("Braced portal", "P1001 portal, P1000 brace", "seismic and sway bracing",
  (p, ox, oy) => {
    const W = 1800, H = 2200;
    for (const [n, x] of [["c1", 0], ["c2", W]])
      run(p, n, line(p, n + "l", [ox + x, oy, 0], [ox + x, oy, H]), "P1001", "HS",
          { look: LOOK.heavy });
    run(p, "head", line(p, "hl", [ox, oy, H], [ox + W, oy, H]), "P1001", "HS",
        { look: LOOK.heavy, facing: "Down" });
    run(p, "brace", line(p, "bl", [ox, oy, 0], [ox + W, oy, H]), "P1000", "HS",
        { facing: "Up" });
    nuts(p, "n", p + "_brace", "P1010", "1, -1");
    return { tall: H };
  });

//! 8. A WORK PLATFORM: legs, a perimeter and bearers - the platforms and
//! risers of p14, and the base every bench and riser in the showcase is.
exhibit("Work platform", "P1001 legs, P1000 deck", "platforms, tables and risers",
  (p, ox, oy) => {
    const W = 1800, D = 1200, H = 900;
    for (const [n, x, y] of [["l1", 0, 0], ["l2", W, 0], ["l3", W, D], ["l4", 0, D]])
      run(p, n, line(p, n + "l", [ox + x, oy + y, 0], [ox + x, oy + y, H]),
          "P1001", "HS", { look: LOOK.heavy });
    const deck = loop(p, "d", [[ox, oy, H], [ox + W, oy, H],
                               [ox + W, oy + D, H], [ox, oy + D, H]]);
    run(p, "deck", deck, "P1000", "HS", {});
    for (const x of [600, 1200])
      run(p, "b" + x, line(p, "b" + x + "l", [ox + x, oy, H], [ox + x, oy + D, H]),
          "P1000", "HS", { facing: "Up" });
    nuts(p, "n", p + "_deck", "P1006-1420", "every 5");
    return { tall: H };
  });

//! AND THE BILL OF THE WHOLE MUSEUM, which is the exhibit that matters: eight
//! assemblages, one order.
add("BOM", "StrutBill", { name: "Bill of the museum", parent: "H",
  refs: { of: "H" }, args: { show: "Everything" } });

const model = { format: "ocaf-parametric-model", version: 1,
                name: "Unistrut · a museum of assemblages",
                units: "mm", needs: ["unistrut"], features };

/* ------------------------------------------------------------- and build it */

const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const kernel = await createWasmKernel({
  initModule: (await import(WASM + "/replicad_single.js")).default,
  wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const host = new PluginHost({
  toolkit: () => kernel.toolkit(),
  installDrivers: (specs, builders) => kernel.installDrivers(specs, builders),
  removeDrivers: specs => kernel.removeDrivers(specs),
  typesInUse: types => kernel.typesInUse(types) });
await host.load("unistrut");
const mdl = new Mdl({ kernel });

const began = Date.now();
const out = await mdl.run({ op: "model", model });
const rows = out.tree.features;
const bad = rows.filter(f => f.error);
console.log(features.length + " features · " + bays.length + " bays · built in "
  + ((Date.now() - began) / 1000).toFixed(1) + " s");
if (bad.length) {
  console.log("\n" + bad.length + " feature(s) in error:");
  for (const f of bad.slice(0, 20))
    console.log("   " + f.id + " (" + f.type + ") " + String(f.error).slice(0, 150));
  process.exit(1);
}

for (const b of bays) console.log("   " + b.name.padEnd(18) + b.system);

const bom = rows.find(f => f.id === "BOM");
const bill = String((bom && bom.data && bom.data.preview) || "");
console.log("\nthe bill:");
for (const l of bill.split(" · ")) console.log("   " + l.trim());

//! A SAMPLE THAT WILL NOT OPEN IS NOT A SAMPLE. The atrium taught this: the
//! triangle count is what decides whether somebody's laptop draws it.
const tris = rows.reduce((s, f) => s + ((f.sizes && f.sizes.triangles) || 0), 0);
if (tris) console.log("\n" + tris.toLocaleString() + " triangles");

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("\nwrote " + OUT);
