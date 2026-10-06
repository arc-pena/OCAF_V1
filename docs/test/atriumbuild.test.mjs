// The Atrium package, building real geometry in the real kernel.
//
// atrium.test.mjs checks the arithmetic against numbers that can be done on
// paper. This checks that what comes out of the kernel is the size that
// arithmetic says - measured off the built solid rather than read back off the
// arguments, because a driver that computes the right number and then builds
// something else is the whole class of mistake a screenshot cannot show.
//
// AND IT CHECKS THE ONE THING THAT COST THIS PACKAGE AN AFTERNOON. Every section
// here is run along a horizontal plan curve, and the obvious way to do that -
// pipe the closed section along the rail - produces, on this geometry, a shape
// three and a half kilometres across about half the time. Section 2 is the
// measurement that says so and the guard that keeps it from coming back: a band
// swept along a 90 m void must be about 90 m long, and anything that is out by
// a factor is out by a factor.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { PluginHost } from "../src/plugin.js";
import { ATRIUM, ATRIUM_NODES } from "../src/atrium-plugin.js";
import { loopArea, parabolicVoid, roofCells } from "../src/atrium.js";
import { registerTypes, typeSpec } from "../src/ocaf.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const host = new PluginHost({
  toolkit: () => kernel.toolkit(),
  installDrivers: (specs, builders) => kernel.installDrivers(specs, builders),
  removeDrivers: specs => kernel.removeDrivers(specs),
  typesInUse: types => kernel.typesInUse(types),
});

console.log("1. it is a package before it is anything");
{
  //! DECLARED BEFORE IT RUNS. The menu has to be able to list a package without
  //! loading it, and the assistant has to be able to be told it exists for one
  //! line rather than for the whole of it.
  check("it offers itself with a name and a summary",
        ATRIUM.id === "atrium" && ATRIUM.name && ATRIUM.summary.length > 80);
  check("and its nodes are readable with it switched off",
        Array.isArray(ATRIUM_NODES) && ATRIUM_NODES.length >= 6,
        ATRIUM_NODES.map(n => n.type).join(", "));
  check("every node says what it produces and what it is for",
        ATRIUM_NODES.every(n => n.produces && n.summary && n.summary.length > 60
                             && Array.isArray(n.args)));
  //! A REPEATED GUID DOES NOT FAIL, it makes one type quietly answer as
  //! another - so the block is checked rather than trusted.
  const guids = ATRIUM_NODES.map(n => n.guid);
  check("no two nodes share a guid", new Set(guids).size === guids.length);
  check("and they are all in this package's own block",
        guids.every(g => /^9a1b2c30-013[0-9a-f]-/.test(g)), guids.join(" "));
  //! AND ITS NODES ARE NOT IN THE CATALOGUE UNTIL IT IS LOADED.
  check("before loading, the catalogue has never heard of a SlabEdge",
        !typeSpec("SlabEdge"));
  await host.load("atrium");
  check("after loading it has", !!typeSpec("SlabEdge") && !!typeSpec("RoofNet"));
  void registerTypes;
}

const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
const kit = kernel.toolkit();
const F = kit.F;
const build = async features => {
  const out = await mdl.run({ op: "model", model: {
    format: "ocaf-parametric-model", version: 1, name: "t", units: "mm",
    needs: ["atrium"], features } });
  return out.tree.features;
};
const boxOf = id => {
  const one = kit.doc().features().find(f => F.id(f) === id);
  const shape = one ? F.shape(one) : null;
  return shape ? kit.extents(shape) : null;
};
const tellOf = async id => {
  const answer = await kernel.tree();
  const row = (answer.tree || answer).features.find(one => one.id === id);
  return String((row && row.data ? row.data.preview : "") || "");
};

const BASE = [
  { id: "P0", type: "Point", args: { x: 0, y: 0, z: 0 } },
  { id: "VZ", type: "Vector", args: { dx: 0, dy: 0, dz: 1 } },
  { id: "PL", type: "Plane", args: { origin: { ref: "P0" }, normal: { ref: "VZ" } } },
  { id: "PL6", type: "Point", args: { x: 0, y: 0, z: 6000 } },
  { id: "V", type: "AtriumVoid", args: { plane: { ref: "PL" }, at: { ref: "PL6" },
      length: 90000, wide: 11500, ends: 4600, fullness: 2, stations: 30,
      nose: 0.65, run: 0, offset: 0 } },
];

console.log("\n2. the void is the plan curve it says it is, at the level it is on");
{
  const rows = await build(BASE);
  check("every node built", rows.filter(f => f.error).length === 0,
        rows.filter(f => f.error).map(f => f.id + ": " + f.error).join(" | "));
  const box = boxOf("V");
  //! A FITTED CURVE THROUGH THE POLYGON, so its extents are the polygon's plus
  //! what the fit bulges - checked against the arithmetic rather than a figure.
  const loop = parabolicVoid({ length: 90000, wide: 11500, ends: 4600, stations: 30,
                               nose: 0.65 });
  const want = [Math.max(...loop.map(p => p[0])) - Math.min(...loop.map(p => p[0])),
                Math.max(...loop.map(p => p[1])) - Math.min(...loop.map(p => p[1]))];
  check("it is the length and width the arithmetic says",
        near(box.size[0], want[0], 800) && near(box.size[1], want[1], 400),
        box.size.slice(0, 2).map(n => n.toFixed(0)).join(" x ") + " against "
          + want.map(n => n.toFixed(0)).join(" x "));
  check("and it is flat, at the level it was placed on",
        near(box.size[2], 0, 0.01) && near(box.low[2], 6000, 0.01),
        "z " + box.low[2].toFixed(1));
  check("it says how much hole it is", /m² of hole/.test(await tellOf("V")),
        (await tellOf("V")).split(" · ").pop());
}

console.log("\n3. a slab edge: the floor zone, and a chamfer that is a chamfer");
{
  const rows = await build([...BASE,
    { id: "SE", type: "SlabEdge", args: { rail: { ref: "V" }, side: 0, depth: 1500,
        bevel: 350, back: 2600, upstand: 0 } }]);
  check("it built", !rows.find(f => f.id === "SE").error,
        String(rows.find(f => f.id === "SE").error || ""));
  const band = boxOf("SE"), voidBox = boxOf("V");
  //! THE ONE THAT WOULD HAVE CAUGHT THE PIPED SWEEP. A band run along a 90 m
  //! void is a 90 m band plus twice how far its section reaches back. Piped
  //! along the rail instead, the same arguments gave 208 x 177 m, 416 x 818 m
  //! and once 3734 x 2653 m - and every one of those built without an error and
  //! reported the right dimensions in its own preview.
  check("the band is the void plus twice its reach, not a multiple of it",
        near(band.size[0], voidBox.size[0] + 2 * 2600, 300)
          && near(band.size[1], voidBox.size[1] + 2 * 2600, 300),
        band.size.slice(0, 2).map(n => n.toFixed(0)).join(" x "));
  check("it is as deep as the floor zone, hung under the walking level",
        near(band.size[2], 1500, 1) && near(band.high[2], 6000, 1),
        band.size[2].toFixed(1) + " deep, top at " + band.high[2].toFixed(1));
  //! AND THE CHAMFER IS REALLY THERE. The band is wider at the top than at the
  //! bottom by exactly the chamfer each side - which is what a chamfer IS, and
  //! is not true of a radius, a flat soffit or a band drawn the right size.
  const atTop = kit.doc().features().find(f => F.id(f) === "SE");
  const shape = atTop ? F.shape(atTop) : null;
  //! MEASURED ON ONE SIDE OF THE RING, at the middle of the long side. The band
  //! is a loop, so its width across the whole model is the same at every height
  //! and says nothing; what moves is the INNER edge - the face looking into the
  //! void - which is vertical down to the chamfer and then steps back by it.
  //! Read off the triangles at the two levels where the solid has vertices.
  const innerEdge = z => {
    const mesh = kit.tessellate(shape, kit.deflectionFor(shape));
    let nearest = Infinity;
    for (let i = 0; i < mesh.positions.length; i += 3) {
      if (Math.abs(mesh.positions[i + 2] - z) > 5) continue;
      if (Math.abs(mesh.positions[i]) > 1500) continue;
      if (mesh.positions[i + 1] <= 0) continue;
      nearest = Math.min(nearest, mesh.positions[i + 1]);
    }
    return nearest;
  };
  const atTopEdge = innerEdge(6000), atBottomEdge = innerEdge(4500);
  check("the face steps back by exactly the chamfer over the bottom of the band",
        Number.isFinite(atTopEdge) && Number.isFinite(atBottomEdge)
          && near(atBottomEdge - atTopEdge, 350, 25),
        "inner face at y " + atTopEdge.toFixed(0) + " on top, "
          + atBottomEdge.toFixed(0) + " at the bottom");
  check("and it says it is a chamfer and not a radius",
        /chamfer and not a radius/.test(await tellOf("SE")));
}

console.log("\n4. the floor plate is flat, and it is a ring round the void");
{
  const rows = await build([...BASE,
    { id: "GF", type: "GalleryFloor", args: { rail: { ref: "V" }, inset: 2600,
        width: 9000, depth: 1500 } }]);
  check("it built", !rows.find(f => f.id === "GF").error,
        String(rows.find(f => f.id === "GF").error || ""));
  const plate = boxOf("GF"), voidBox = boxOf("V");
  check("it reaches the inset plus the width out from the void",
        near(plate.size[0], voidBox.size[0] + 2 * 11600, 400),
        plate.size.slice(0, 2).map(n => n.toFixed(0)).join(" x "));
  check("and it is as deep as the floor zone and no deeper",
        near(plate.size[2], 1500, 20), plate.size[2].toFixed(1));
  //! A RING, NOT A DISC. The void has to still be a hole afterwards, which a
  //! plate built as a filled outline would not be - and from above, with the
  //! galleries over it, a filled plate looks exactly like a ring.
  const shape = F.shape(kit.doc().features().find(f => F.id(f) === "GF"));
  const mesh = kit.tessellate(shape, kit.deflectionFor(shape));
  let inside = 0;
  for (let i = 0; i < mesh.positions.length; i += 3)
    if (Math.abs(mesh.positions[i]) < 20000 && Math.abs(mesh.positions[i + 1]) < 8000)
      inside++;
  check("the void is still a hole in it", inside === 0,
        inside + " vertices inside the void");
}

console.log("\n5. a balustrade is three materials, standing on the walking level");
{
  const rows = await build([...BASE,
    { id: "BA", type: "Balustrade", args: { rail: { ref: "V" }, side: 0, height: 1100,
        setback: 140, glass: 21, railWidth: 100, railDepth: 60, shoe: 200,
        shoeHeight: 160, posts: 0 } },
    { id: "BP", type: "Balustrade", args: { rail: { ref: "V" }, side: 0, height: 1100,
        setback: 140, glass: 21, railWidth: 100, railDepth: 60, shoe: 200,
        shoeHeight: 160, posts: 1, pitch: 1500, post: 60 } }]);
  for (const id of ["BA", "BP"])
    check(id + " built", !rows.find(f => f.id === id).error,
          String(rows.find(f => f.id === id).error || ""));
  const bal = boxOf("BA"), voidBox = boxOf("V");
  check("it stands from the walking level to its own height",
        near(bal.low[2], 6000, 1) && near(bal.size[2], 1100, 1),
        "z " + bal.low[2].toFixed(0) + ".." + bal.high[2].toFixed(0));
  check("it is the void's own length, not a multiple of it",
        near(bal.size[0], voidBox.size[0] + 2 * 190, 300),
        bal.size.slice(0, 2).map(n => n.toFixed(0)).join(" x "));
  //! THREE BODIES AND NOT ONE, which is the whole point of a glass balustrade:
  //! built as a single solid it is opaque, and a model you cannot see through is
  //! a model of a parapet.
  const shape = F.shape(kit.doc().features().find(f => F.id(f) === "BA"));
  check("glass, rail and shoe are three separate bodies",
        kit.countSubShapes(shape, kit.SOLID) === 3,
        kit.countSubShapes(shape, kit.SOLID) + " solids");
  check("and a posted one has its posts on top of those",
        kit.countSubShapes(F.shape(kit.doc().features().find(f => F.id(f) === "BP")),
                           kit.SOLID) > 3);
  check("it says which kind it is",
        /frameless/.test(await tellOf("BA")) && /posts/.test(await tellOf("BP")));
}

console.log("\n6. a shopfront in equal bays, as glass and as frame");
{
  const rows = await build([...BASE,
    { id: "SG", type: "Shopfront", args: { rail: { ref: "V" }, side: 1, height: 4500,
        pitch: 1500, mullion: 90, depth: 200, glass: 32, band: 700, sill: 0, parts: 1 } },
    { id: "SM", type: "Shopfront", args: { rail: { ref: "V" }, side: 1, height: 4500,
        pitch: 1500, mullion: 90, depth: 200, glass: 32, band: 700, sill: 0, parts: 2 } }]);
  for (const id of ["SG", "SM"])
    check(id + " built", !rows.find(f => f.id === id).error,
          String(rows.find(f => f.id === id).error || ""));
  const glass = boxOf("SG"), frame = boxOf("SM");
  check("the glass runs from the floor to under the band",
        near(glass.low[2], 6000, 1) && near(glass.high[2], 6000 + 4500 - 700, 1),
        "z " + glass.low[2].toFixed(0) + ".." + glass.high[2].toFixed(0));
  check("and the frame reaches the head", near(frame.high[2], 6000 + 4500, 1),
        frame.high[2].toFixed(0));
  check("both are on the same curve", near(glass.size[0], frame.size[0], 500),
        glass.size[0].toFixed(0) + " and " + frame.size[0].toFixed(0));
  //! GLASS ONLY MEANS GLASS ONLY. Asking for the frame by setting the glass
  //! thin instead is what crashed the kernel outright - "memory access out of
  //! bounds" - on a pane a millimetre thick run 260 m round an atrium.
  const glassSolids = kit.countSubShapes(
    F.shape(kit.doc().features().find(f => F.id(f) === "SG")), kit.SOLID);
  check("glass only is one body, with no mullions in it", glassSolids === 1,
        glassSolids + " solids");
  check("and frame only is the band and every mullion",
        kit.countSubShapes(F.shape(kit.doc().features()
          .find(f => F.id(f) === "SM")), kit.SOLID) > 100);
  const said = await tellOf("SG");
  const bays = /(\d+) bays of (\d+)/.exec(said);
  check("the bays are equal and there is a whole number of them", !!bays,
        bays && bays[0]);
}

console.log("\n7. the roof: a Voronoi net, and a cushion in every cell it leaves");
{
  const rows = await build([...BASE,
    { id: "PR", type: "Point", args: { x: 0, y: 0, z: 30000 } },
    { id: "RS", type: "RoofNet", args: { plane: { ref: "PL" }, at: { ref: "PR" },
        length: 60000, width: 24000, rise: 7000, cells: 30, seed: 5, relax: 2,
        member: 900, deep: 1800, cushion: 900, drop: 650, parts: 1 } },
    { id: "RE", type: "RoofNet", args: { plane: { ref: "PL" }, at: { ref: "PR" },
        length: 60000, width: 24000, rise: 7000, cells: 30, seed: 5, relax: 2,
        member: 900, deep: 1800, cushion: 900, drop: 650, parts: 2 } }]);
  for (const id of ["RS", "RE"])
    check(id + " built", !rows.find(f => f.id === id).error,
          String(rows.find(f => f.id === id).error || ""));
  const net = boxOf("RS"), etfe = boxOf("RE");
  check("the net covers the plan it was given",
        near(net.size[0], 60000, 1500) && near(net.size[1], 24000, 1500),
        net.size.slice(0, 2).map(n => n.toFixed(0)).join(" x "));
  //! THE CROWN IS THE SPRINGING PLUS THE RISE, and the members hang below it -
  //! which is what "walkable" means: the structure is under the walking line.
  check("its crown is the springing plus the rise", near(net.high[2], 37000, 60),
        net.high[2].toFixed(0) + " against 37000");
  check("and it hangs its depth below the springing",
        near(net.low[2], 30000 - 1800, 120), net.low[2].toFixed(0));
  //! ONE TESSELLATION, TWO FEATURES. Built from two cell generators the cushions
  //! would sit over the members rather than between them, which from below is a
  //! roof - and that is the only angle anybody sees it from.
  const cellsOf = async id => Number(/(\d+) cells/.exec(await tellOf(id))?.[1]);
  const here = roofCells({ length: 60000, width: 24000, count: 30, seed: 5, relax: 2 });
  check("the structure and the cushions agree about the tessellation",
        (await cellsOf("RS")) === here.length && (await cellsOf("RE")) === here.length,
        (await cellsOf("RS")) + ", " + (await cellsOf("RE")) + ", " + here.length);
  check("and the cushions sit inside the net, not over it",
        etfe.high[2] <= net.high[2] + 1200 && etfe.low[2] >= net.low[2] - 10,
        "cushions z " + etfe.low[2].toFixed(0) + ".." + etfe.high[2].toFixed(0)
          + " in the net's " + net.low[2].toFixed(0) + ".." + net.high[2].toFixed(0));
  //! AND THE SAME SEED IS THE SAME ROOF. A pattern that comes out differently
  //! every time the file is opened is not a model of anything.
  const other = roofCells({ length: 60000, width: 24000, count: 30, seed: 6, relax: 2 });
  check("a different seed is a different roof",
        JSON.stringify(other) !== JSON.stringify(here));
  const said = await tellOf("RS");
  check("the net says the pattern is computed rather than drawn",
        /Voronoi/.test(said) && /computed, not drawn/.test(said));
}

console.log("\n8. a flared column, turned about its own axis");
{
  const rows = await build([...BASE,
    { id: "C", type: "FlaredColumn", args: { plane: { ref: "PL" }, at: { ref: "P0" },
        height: 4500, shaft: 850, head: 4200, foot: 1150, flare: 0.62,
        sharpness: 2.8, steps: 18 } }]);
  check("it built", !rows.find(f => f.id === "C").error,
        String(rows.find(f => f.id === "C").error || ""));
  const col = boxOf("C");
  check("it is as tall as it was told and stands on its point",
        near(col.size[2], 4500, 1) && near(col.low[2], 0, 1),
        "z " + col.low[2].toFixed(0) + ".." + col.high[2].toFixed(0));
  check("and as wide as its head, which is the widest part of it",
        near(col.size[0], 4200, 20) && near(col.size[1], 4200, 20),
        col.size.slice(0, 2).map(n => n.toFixed(0)).join(" x "));
  //! IT OPENS OUT AS IT RISES, which is the whole shape: a column that is the
  //! same width all the way up is a cylinder, and one that tapers the other way
  //! is a cone. Measured off the triangles at two heights.
  const shape = F.shape(kit.doc().features().find(f => F.id(f) === "C"));
  const mesh = kit.tessellate(shape, kit.deflectionFor(shape));
  const widthAt = z => {
    let r = 0;
    for (let i = 0; i < mesh.positions.length; i += 3)
      if (Math.abs(mesh.positions[i + 2] - z) < 80)
        r = Math.max(r, Math.hypot(mesh.positions[i], mesh.positions[i + 1]));
    return r * 2;
  };
  const low = widthAt(1500), high = widthAt(4400);
  check("it is narrow at the shaft and wide at the head", high > low * 2,
        low.toFixed(0) + " at mid height, " + high.toFixed(0) + " near the top");
}

console.log("\n9. and it unloads cleanly, which is what makes it a package");
{
  //! A PACKAGE WITH ONE OF ITS NODES IN THE MODEL MUST REFUSE TO UNLOAD, or the
  //! document is left holding a type nothing can rebuild.
  await build([...BASE]);
  let refused = false;
  try { await host.unload("atrium"); } catch { refused = true; }
  check("it will not unload while one of its nodes is in the model", refused);
  await build([{ id: "P0", type: "Point", args: { x: 0, y: 0, z: 0 } }]);
  await host.unload("atrium");
  check("with the model empty it unloads", !typeSpec("SlabEdge"));
  await host.load("atrium");
  check("and it loads again afterwards", !!typeSpec("SlabEdge"));
  void loopArea;
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
