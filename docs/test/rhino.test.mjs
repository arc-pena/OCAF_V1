// The Rhino bridge, against numbers worked out on paper.
//
// No kernel here and no browser: the bridge format is arithmetic and parsing,
// and both can be checked against values a reader can derive before running
// anything. The cases are chosen to DISCRIMINATE - each one fails if the code
// is wrong in the way it is most likely to be wrong, which for a transform
// means read transposed, and for a mesh means corners written one face at a
// time.

import { BRIDGE_FORMAT, BRIDGE_VERSION, applyXform, bridgeFrom3dm, bridgeModel,
         bridgeScale, decomposeXform, layerPath, layerTree, meshObj, readBridge }
  from "../src/rhino.js";
import { readFileSync } from "fs";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol;
const nearAll = (a, b, tol = 1e-9) =>
  Array.isArray(a) && a.length === b.length && a.every((v, i) => near(v, b[i], tol));

const file = (over = {}) => JSON.stringify({
  format: BRIDGE_FORMAT, version: BRIDGE_VERSION, name: "t", units: "millimeters",
  layers: [], blocks: [], objects: [], ...over,
});

console.log("1. units, declared in the file and never asked for");
{
  check("millimetres are the document unit", bridgeScale("millimeters") === 1);
  //! The two a person actually hits. 304.8 and 25.4 are exact by definition of
  //! the international foot and inch, so these are not approximations.
  check("feet are 304.8 mm", bridgeScale("feet") === 304.8);
  check("inches are 25.4 mm", bridgeScale("inches") === 25.4);
  check("metres are 1000 mm", bridgeScale("meters") === 1000);
  check("the name is read however it was capitalised", bridgeScale("  Feet ") === 304.8);
  check("and a unit system that is not one is refused rather than guessed",
        bridgeScale("furlongs") === null);
}

console.log("\n2. a file that is not a bridge file says so");
{
  const fails = (what, text) => {
    let message = "";
    try { readBridge(text); } catch (err) { message = err.message; }
    check(what, message.length > 0, message || "it was accepted");
    return message;
  };
  fails("not JSON at all", "{nope");
  const wrong = fails("some other program's JSON", '{"format":"gltf","version":2}');
  check("and the message names what it found and what was wanted",
        /gltf/.test(wrong) && /rhino-bridge/.test(wrong), wrong);
  //! FORWARD COMPATIBILITY IS A DECISION, not an accident. A newer file is
  //! refused by number with the remedy in the sentence; a file that merely
  //! carries fields this build has never heard of is read as normal.
  const ahead = fails("a file from a newer script", file({ version: BRIDGE_VERSION + 1 }));
  check("and says which version it is and which this build reads",
        ahead.includes(String(BRIDGE_VERSION + 1)) && ahead.includes(String(BRIDGE_VERSION)),
        ahead);
  const got = readBridge(file({ wobble: 3, objects: [{ id: "O1", shimmer: true }] }));
  check("a field this build does not know is ignored, not fatal",
        got.objects.length === 1 && got.objects[0].id === "O1");
  fails("units that are not a Rhino unit system", file({ units: "cubits" }));
}

console.log("\n3. a transform, read the way Rhino wrote it");
{
  //! A QUARTER TURN ABOUT Z, then a move to (10,20,30). Row major, translation
  //! in the last column - so the image of the X axis is the first COLUMN,
  //! (0,1,0). Read as rows instead it comes back (0,-1,0): the same axis
  //! pointing the other way, which on a symmetric block looks almost right and
  //! on everything else is a quarter turn in the wrong direction. That is the
  //! whole reason this test exists.
  const turn = [0, -1, 0, 10,
                1, 0, 0, 20,
                0, 0, 1, 30,
                0, 0, 0, 1];
  const d = decomposeXform(turn);
  check("the origin is the last column", nearAll(d.origin, [10, 20, 30]));
  check("the x axis is the first column, not the first row", nearAll(d.x, [0, 1, 0]),
        "[" + d.x.join(", ") + "] — transposed would be [0, -1, 0]");
  check("the y axis follows", nearAll(d.y, [-1, 0, 0]));
  check("a quarter turn is rigid", d.rigid === true);
  check("and its scale is one", near(d.scale, 1));

  //! The same transform applied to a point, derived on paper: (1,0,0) turns to
  //! (0,1,0) and then moves, so it lands one millimetre along +Y of (10,20,30).
  check("a point goes through it the same way",
        nearAll(applyXform(turn, [1, 0, 0]), [10, 21, 30]),
        "[" + applyXform(turn, [1, 0, 0]).join(", ") + "]");

  const twice = decomposeXform([2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1]);
  check("an evenly scaled block is still rigid, at its scale",
        twice.rigid === true && near(twice.scale, 2));
  const uneven = decomposeXform([1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  check("an unevenly scaled one is not", uneven.rigid === false,
        "scales " + uneven.scales.join(", "));
  //! A MIRROR PASSES EVERY OTHER TEST. Its axes are perpendicular and all of
  //! length one, so only the sign of the triple product tells it apart - and
  //! an Instance cannot reflect a part, so getting this wrong puts every
  //! mirrored block in the model inside out.
  const mirror = decomposeXform([-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  check("a mirrored block is caught, though its axes are unit and square",
        mirror.mirrored === true && mirror.rigid === false);
  check("a collapsed transform is no transform rather than a half-read one",
        decomposeXform([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]) === null);
  check("and so is one of the wrong length", decomposeXform([1, 0, 0]) === null);
}

console.log("\n4. meshes, with their corners kept");
{
  //! A SQUARE: four corners, one quad. Written one face at a time it would be
  //! four corners for one face and twenty-four for a box - a triangle soup
  //! that shades faceted and cannot be smoothed.
  const square = { v: [0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0], f: [0, 1, 2, 3],
                   corners: 4, faces: 1 };
  const obj = meshObj(square, "square");
  const vs = obj.split("\n").filter(l => l.startsWith("v "));
  const fs = obj.split("\n").filter(l => l.startsWith("f "));
  check("four corners stay four corners", vs.length === 4, vs.length + " v lines");
  check("one quad stays one face", fs.length === 1 && fs[0] === "f 1 2 3 4", fs[0]);

  //! Rhino says a triangle by repeating the last corner. Emitted as a four
  //! cornered face it would carry a zero length edge, which some readers drop
  //! and others draw as a crack.
  const tri = { v: [0, 0, 0, 1, 0, 0, 0, 1, 0], f: [0, 1, 2, 2], corners: 3, faces: 1 };
  const triFaces = meshObj(tri, "tri").split("\n").filter(l => l.startsWith("f "));
  check("a quad whose last two corners are the same is a triangle",
        triFaces[0] === "f 1 2 3", triFaces[0]);

  //! Scale is the document coming to millimetres, and it multiplies the
  //! COORDINATES - not the indices, which is the other thing it could do wrong.
  const feet = meshObj(square, "square", 304.8);
  const second = feet.split("\n").filter(l => l.startsWith("v "))[1];
  check("the unit scale multiplies coordinates", second === "v 304.8 0 0", second);

  //! And a transform is applied BEFORE the scale, because the transform is in
  //! the file's own units.
  const moved = meshObj(square, "square", 1000, [1, 0, 0, 5, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  const first = moved.split("\n").filter(l => l.startsWith("v "))[0];
  check("a transform is applied in the file's units, then scaled",
        first === "v 5000 0 0", first);
}

console.log("\n5. the layer tree, rebuilt as it was");
{
  const layers = [
    { id: "a", name: "Steel", parent: null, colour: null, visible: true },
    { id: "b", name: "Primary", parent: "a", colour: null, visible: true },
    { id: "c", name: "Bolts", parent: "b", colour: null, visible: true },
    { id: "d", name: "Orphan", parent: "gone", colour: null, visible: true },
  ];
  const tree = layerTree(layers);
  check("one root, three deep", tree.roots.length === 2, tree.roots.length + " roots");
  check("nesting is kept",
        layerPath(tree.byId.get("c"), tree.byId) === "Steel::Primary::Bolts",
        layerPath(tree.byId.get("c"), tree.byId));
  //! A LAYER WHOSE PARENT WENT AWAY still has objects on it. Dropping it loses
  //! them; making it a root loses only the nesting, and says so in the tree.
  check("a layer whose parent is missing becomes a root rather than vanishing",
        tree.roots.some(r => r.id === "d"));
}

console.log("\n6. one block, many places — which is the whole point on a big file");
{
  const mesh = { v: [0, 0, 0, 1, 0, 0, 1, 1, 0], f: [0, 1, 2, 2] };
  const made = readBridge(file({
    units: "meters",
    layers: [{ id: "L1", name: "Columns" }],
    blocks: [{ id: "B1", name: "Column A", objects: ["M1"] }],
    objects: [
      { id: "M1", kind: "mesh", name: "col", mesh },
      { id: "I1", kind: "instance", block: "B1", layer: "L1",
        xform: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
      { id: "I2", kind: "instance", block: "B1", layer: "L1",
        xform: [1, 0, 0, 5, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
      { id: "I3", kind: "instance", block: "B1", layer: "L1",
        xform: [1, 0, 0, 9, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
    ],
  }));
  const { model, report } = bridgeModel(made);
  const meshes = model.features.filter(f => f.type === "MeshImported");
  const instances = model.features.filter(f => f.type === "Instance");
  //! THE MEASUREMENT THAT MATTERS. Three placements of one block must be ONE
  //! mesh and three instances. Baked, it would be three meshes - and a Rhino
  //! file with four hundred placements of a handrail bracket would arrive as
  //! four hundred copies of it, which is how a large file becomes unopenable.
  check("three placements of one block are one mesh", meshes.length === 1,
        meshes.length + " meshes");
  check("and three instances", instances.length === 3, instances.length + " instances");
  check("counted as instances rather than bakes",
        report.instances === 3 && report.baked === 0,
        report.instances + " placed, " + report.baked + " baked");
  //! The instance's point is in millimetres, so a block 5 metres along in a
  //! metre document is 5000 away here.
  const points = model.features.filter(f => f.type === "Point");
  check("the placement is scaled into millimetres",
        points.some(p => near(p.args.x, 5000)) && points.some(p => near(p.args.x, 9000)),
        points.map(p => p.args.x).join(", "));

  //! A mirrored placement cannot be an Instance, so it is baked - and the
  //! report says so rather than letting it arrive inside out.
  const mirrored = readBridge(file({
    blocks: [{ id: "B1", name: "A", objects: ["M1"] }],
    objects: [
      { id: "M1", kind: "mesh", mesh },
      { id: "I1", kind: "instance", block: "B1",
        xform: [-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1] },
    ],
  }));
  const second = bridgeModel(mirrored);
  check("a mirrored placement is baked instead, and counted",
        second.report.baked === 1 && second.report.instances === 0,
        second.report.baked + " baked");
}

console.log("\n7. what it could not bring, said out loud");
{
  const made = readBridge(file({
    layers: [{ id: "L1", name: "Breps" }],
    objects: [
      { id: "O1", kind: "brep", name: "slab", layer: "L1",
        mesh: { v: [0, 0, 0, 1, 0, 0, 1, 1, 0], f: [0, 1, 2, 2] } },
      { id: "O2", kind: "brep", name: "beam", layer: "L1",
        missing: "no render mesh in the file" },
      { id: "O3", kind: "brep", name: "post", layer: "L1",
        missing: "no render mesh in the file" },
    ],
  }));
  const { report, say } = bridgeModel(made);
  check("the ones that came in are counted", report.meshes === 1);
  //! THE FAILURE THAT WOULD OTHERWISE BE INVISIBLE. Two of three objects have
  //! no geometry; an import that drew one mesh and said "opened" would look
  //! exactly like one that worked.
  check("and so are the ones that did not", report.skipped === 2);
  const line = say.join(" | ");
  check("the reason is carried from the script, not invented",
        /no render mesh in the file/.test(line), line);
  check("and the count is in the sentence", /2 objects came in with no geometry/.test(line),
        line);
}

console.log("\n8. empty layers do not become empty folders");
{
  const many = { layers: [], objects: [{ id: "O1", kind: "mesh", layer: "L0",
                 mesh: { v: [0, 0, 0, 1, 0, 0, 1, 1, 0], f: [0, 1, 2, 2] } }] };
  for (let i = 0; i < 40; i++) many.layers.push({ id: "L" + i, name: "Layer " + i });
  const made = readBridge(file(many));
  const lean = bridgeModel(made);
  const kept = bridgeModel(made, { empty: "keep" });
  check("forty layers, one used, one folder", lean.report.layers === 1,
        lean.report.layers + " layers");
  check("and all forty when the tree itself is the point", kept.report.layers === 40,
        kept.report.layers + " layers");
}

console.log("\n9. the model it hands back is an ordinary model file");
{
  const made = readBridge(file({
    name: "tower.3dm", units: "feet",
    layers: [{ id: "L1", name: "Shell", colour: [255, 128, 0] }],
    objects: [{ id: "O1", kind: "mesh", name: "panel", layer: "L1",
                mesh: { v: [0, 0, 0, 1, 0, 0, 1, 1, 0], f: [0, 1, 2, 2] } }],
  }));
  const { model } = bridgeModel(made);
  check("it says what format it is", model.format === "ocaf-parametric-model");
  check("and that it is in millimetres, whatever Rhino was in", model.units === "mm");
  check("it carries the Rhino file's name", model.name === "tower.3dm");
  check("every feature has an id and a type",
        model.features.every(f => f.id && f.type));
  check("every parent named is a feature that exists",
        model.features.every(f => !f.parent || model.features.some(g => g.id === f.parent)));
  //! Rhino colours are 0..255 and this program's are 0..1. Writing one where
  //! the other is wanted gives a layer that is pure white at every setting.
  const shell = model.features.find(f => f.name === "Shell");
  check("a layer colour is converted from Rhino's 0..255",
        nearAll(shell.appearance.color, [1, 128 / 255, 0], 1e-9),
        JSON.stringify(shell.appearance.color));
  //! The geometry is in feet in the file and must be millimetres here.
  const panel = model.features.find(f => f.type === "MeshImported");
  const x = panel.args.obj.split("\n").filter(l => l.startsWith("v "))[1];
  check("and the geometry is scaled out of feet", x === "v 304.8 0 0", x);
}

console.log("\n10. and the file the Rhino script actually writes");
{
  //! NOT A HAND-WRITTEN FIXTURE. docs/test/rhinoexport.fixture.py stubs the
  //! few dozen Rhino members scripts/rhino_export.py touches and calls that
  //! script's own export(), so this is the file the script writes, read by the
  //! reader that has to read it. Regenerate with:
  //!   python3 docs/test/rhinoexport.fixture.py docs/test/rhino-bridge.fixture.rhj
  const text = readFileSync(new URL("./rhino-bridge.fixture.rhj", import.meta.url), "utf8");
  const bridge = readBridge(text);
  check("the reader accepts what the script wrote", bridge.format === BRIDGE_FORMAT);
  check("and reads its unit system", bridge.units === "meters" && bridge.scale === 1000,
        bridge.units + " · " + bridge.scale);

  const { model, report } = bridgeModel(bridge);
  //! Four meshes: the block's one member, plus the plain mesh, the brep and
  //! the extrusion. The two placements of the block are NOT four more.
  check("one block member and three loose objects came in as four meshes",
        report.meshes === 4, report.meshes + " meshes");
  check("the two placements are instances, not copies",
        report.instances === 2 && report.baked === 0,
        report.instances + " instances, " + report.baked + " baked");
  //! The curve and the brep that would not mesh. Both have to arrive as a
  //! counted absence - an import that showed four meshes and said "opened"
  //! would be indistinguishable from one that lost nothing.
  check("the curve and the unmeshable surface are counted, with their reasons",
        report.skipped === 2, report.skipped + " skipped");
  const why = [...report.missing.keys()].join(" | ");
  check("and the reasons are the script's own words",
        /no surface to mesh/.test(why) && /could not mesh/.test(why), why);
  //! The hidden layer was filtered in Rhino, so it is not a skip here - it
  //! never left. Two layers carry something; Scratch is not in the file.
  check("the hidden layer never left Rhino", report.layers === 2,
        report.layers + " layers");

  //! THE TRANSFORM, END TO END. The second placement is a quarter turn about
  //! Z to (10,20,30) in METRES, so its point here is (10000,20000,30000).
  //! Transposed anywhere along the way it still lands there - which is why the
  //! axes are checked too, in section 3, on the same matrix.
  const points = model.features.filter(f => f.type === "Point");
  const turned = points.find(p => near(p.args.x, 10000, 1e-6));
  check("a placement's origin survives the units and the transform",
        !!turned && near(turned.args.y, 20000, 1e-6) && near(turned.args.z, 30000, 1e-6),
        turned ? [turned.args.x, turned.args.y, turned.args.z].join(", ") : "not found");

  //! The nested layer arrives nested, with its Rhino colour converted.
  const primary = model.features.find(f => f.name === "Primary");
  const steel = model.features.find(f => f.name === "Steel");
  check("the nested layer is still under its parent",
        !!primary && !!steel && primary.parent === steel.id);
  check("and the parent's colour came across from 0..255",
        nearAll(steel.appearance.color, [1, 128 / 255, 0], 1e-9),
        JSON.stringify(steel.appearance.color));
}

console.log("\n11. a .3dm, read by the real library");
{
  //! THE REAL rhino3dm, the vendored copy, against a real .3dm - no stub. The
  //! mapping takes the library as an argument precisely so this can run in
  //! node, where a 2.7 MB WebAssembly download and a browser are not needed.
  const rhino3dm = (await import("../vendor/rhino3dm.module.min.js")).default;
  const rh = await rhino3dm();
  const bytes = new Uint8Array(
    readFileSync(new URL("./rhino.fixture.3dm", import.meta.url)));
  const bridge = bridgeFrom3dm(bytes, rh, { name: "fixture.3dm" });

  check("the unit system is read off the file", bridge.units === "meters",
        bridge.units);
  check("and converts to millimetres", bridge.scale === 1000);
  check("both layers came across", bridge.layers.length === 2);
  //! Rhino writes an all-zero guid for a root layer's parent. Left alone it
  //! makes every root a child of nothing in particular and the tree comes out
  //! flat - which is the single most visible way this import could go wrong.
  const steel = bridge.layers.find(l => l.name === "Steel");
  const primary = bridge.layers.find(l => l.name === "Primary");
  check("a root layer has no parent, not an empty guid",
        steel.parent === null, JSON.stringify(steel.parent));
  check("and the nested one points at it", primary.parent === steel.id);
  check("the layer colour is Rhino's 0..255", nearAll(steel.colour, [1, 128 / 255, 0], 1e-9),
        JSON.stringify(steel.colour));

  const panel = bridge.objects.find(o => o.name === "panel");
  check("the mesh came through", !!panel && !!panel.mesh, panel ? panel.kind : "missing");
  check("five corners, two faces", panel.mesh.corners === 5 && panel.mesh.faces === 2,
        panel.mesh.corners + " corners, " + panel.mesh.faces + " faces");
  //! The triangle is stored [a,b,c,c] by rhino3dm and must come out of meshObj
  //! as a three-cornered OBJ face, not a quad with a zero-length edge.
  const obj = meshObj(panel.mesh, "panel", bridge.scale);
  const fs = obj.split("\n").filter(l => l.startsWith("f "));
  check("the quad stays a quad and the triangle a triangle",
        fs[0] === "f 1 2 3 4" && fs[1] === "f 2 5 3", fs.join(" / "));
  check("and its colour is the object's own, not the layer's",
        nearAll(panel.colour, [1 / 255, 2 / 255, 3 / 255], 1e-9),
        JSON.stringify(panel.colour));

  //! THE LIMITATION, ON A REAL FILE. A Brep saved with no render mesh cannot
  //! be drawn by rhino3dm at all - there is no createFromBrep in it. It has to
  //! arrive as a named, counted absence with the remedy in the sentence.
  const slab = bridge.objects.find(o => o.name === "slab");
  check("a Brep with no cached mesh is reported, not dropped",
        !!slab && !slab.mesh && !!slab.missing, slab ? String(slab.missing) : "missing");
  check("and the message says what to do about it",
        /Save Small|bridge script/.test(slab.missing), slab.missing);

  //! And the whole thing is an ordinary model file, by the same path the
  //! bridge file takes - one mapping, not two.
  const { model, report } = bridgeModel(bridge);
  check("it builds a model the same way a bridge file does",
        model.format === "ocaf-parametric-model" && report.meshes === 1,
        report.meshes + " meshes, " + report.skipped + " skipped");
}

console.log("\n12. and the model it writes actually BUILDS");
{
  //! THE TEST THAT WAS MISSING, and the bug it would have caught.
  //!
  //! Every check above reads the model FILE, and the file was well formed
  //! while the kernel could not build it: Instance places F.shape(part), a
  //! MeshImported has no shape, and a block instanced as a set of meshes
  //! failed its precondition with "has nothing built in it to place". The
  //! model was valid JSON describing something impossible, and only opening it
  //! in a browser showed a red node. So the fixtures are built here, against a
  //! real kernel, and a node in error fails this suite.
  const { createWasmKernel } = await import("../src/wasm-kernel.js");
  const WASM = process.env.OCJS_DIR
    || new URL("../.kernel/package/dist", import.meta.url).pathname;
  const initModule = (await import(WASM + "/replicad_single.js")).default;
  const kernel = await createWasmKernel({
    initModule, wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });

  const rhino3dm = (await import("../vendor/rhino3dm.module.min.js")).default;
  const rh = await rhino3dm();

  for (const [label, make] of [
    [".rhj", () => readBridge(readFileSync(
       new URL("./rhino-bridge.fixture.rhj", import.meta.url), "utf8"))],
    [".3dm", () => bridgeFrom3dm(new Uint8Array(readFileSync(
       new URL("./rhino.fixture.3dm", import.meta.url))), rh, { name: "fixture" })],
  ]) {
    const { model, report } = bridgeModel(make());
    await kernel.loadModel(model);
    const built = (await kernel.tree()).tree;
    const bad = built.features.filter(f => f.error);
    check(label + " builds with nothing in error", bad.length === 0,
          bad.length ? bad.map(f => f.name + ": " + f.error).join(" | ")
                     : built.features.length + " nodes, "
                       + report.meshes + " meshes, " + report.instances + " instances");
  }

  //! And the placements really are instances of ONE body - the thing the whole
  //! block path exists for. Built, not just written down.
  const bridge = readBridge(readFileSync(
    new URL("./rhino-bridge.fixture.rhj", import.meta.url), "utf8"));
  const { model } = bridgeModel(bridge);
  await kernel.loadModel(model);
  const built = (await kernel.tree()).tree;
  const instances = built.features.filter(f => f.type === "Instance");
  check("both placements are Instance nodes that built",
        instances.length === 2 && instances.every(f => !f.error),
        instances.map(f => f.name + (f.error ? " ERROR" : " ok")).join(", "));
  const shapes = built.features.filter(f => f.type === "MeshToShape");
  check("and the block was turned into a shape once, not once per placement",
        shapes.length === 1, shapes.length + " MeshToShape");
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall checks passed");
process.exit(failures ? 1 : 0);
