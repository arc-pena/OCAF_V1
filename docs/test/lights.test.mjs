// The light nodes, against a real kernel.
//
// A light draws a wireframe, and a wireframe is the one part of a light that
// can be checked without rendering anything: a cone of 50 degrees at a
// thousand millimetres is 2 x tan(25) x 1000 across, and that is arithmetic,
// not an opinion. Every number below was worked out before the kernel was
// asked - which is the only way a test of a drawing means anything, because a
// cone that is the wrong size still looks exactly like a cone.
//
// The other half is the DESCRIPTION the renderer reads. The viewport draws the
// lines; the tracer never sees them and reads the data instead, so the two can
// disagree silently. Both are checked here, off the same build.

import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { readFileSync } from "fs";

const WASM = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const initModule = (await import(WASM + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({
  initModule, wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null });
const kit = kernel.toolkit();

const model = features => ({ format: "ocaf-parametric-model", version: 1,
                             name: "lights", units: "mm", features });
const at = async id => ((await kernel.tree()).tree.features).find(f => f.id === id);
const boxOf = id => {
  const f = kit.doc().features().find(one => kit.F.id(one) === id);
  const shape = f ? kit.F.shape(f) : null;
  return shape && !shape.IsNull() ? kit.extents(shape) : null;
};
const lightOf = async id => ((await at(id)) || {}).data?.light || null;

console.log("1. a point light is a source with a size, drawn at the size it is");
{
  //! radius 50, drawn size 400. The rays run from the centre out to
  //! max(size, radius x 2.2) = 400 in six axial directions, so the wireframe
  //! measures 800 in every direction. Not 400, and not 400 + 50.
  await kernel.loadModel(model([
    { id: "P", type: "PointLight", name: "Lamp",
      args: { x: 0, y: 0, z: 2000, radius: 50, size: 400, power: 900 } }]));
  const row = await at("P");
  check("it builds", !!row && !row.error, row && row.error ? row.error : "ok");
  const box = boxOf("P");
  check("and is 800 across, which is twice its drawn reach",
        !!box && box.size.every(n => near(n, 800, 1e-6)),
        box ? box.size.map(n => n.toFixed(1)).join(" x ") : "no shape");

  const light = await lightOf("P");
  check("it describes itself as a point with a radius",
        !!light && light.kind === "point" && near(light.radius, 50),
        JSON.stringify(light));
  check("and carries the colour and the candela it was given",
        near(light.power, 900) && near(light.colour[0], 1), JSON.stringify(light.colour));
  //! The defaults, because they are what every new light arrives as: on, and
  //! not visible to the camera. The second is not a preference - an analytic
  //! light has nothing for a camera ray to hit, so being seen is a thing that
  //! has to be added. See the renderer.
  check("on by default, and not seen by default",
        light.on === true && light.seen === false);
  check("and leaving nothing out", Array.isArray(light.exclude) && !light.exclude.length);
}

console.log("\n2. a spot draws the cone its two angles say");
{
  //! at (2000, 0, 2000), aimed at the origin, so the distance is 2000 root 2 =
  //! 2828.427. Drawn reach is min(size 1000, distance x 0.95) = 1000.
  //!
  //! The field is 50 degrees, so the half-angle is 25 and the outer ring has a
  //! radius of tan(25) x 1000 = 466.308. `right` is (0, 1, 0) for this aim, so
  //! the wireframe's whole extent in Y is twice that: 932.616. Worked out on
  //! paper; if the driver halved the angle twice this would read 466, and if it
  //! did not halve it at all, 2384.
  await kernel.loadModel(model([
    { id: "T", type: "TargetLight", name: "Spot",
      args: { x: 2000, y: 0, z: 2000, tx: 0, ty: 0, tz: 0,
              shape: 0, hotspot: 30, field: 50, size: 1000, power: 5000 } }]));
  const row = await at("T");
  check("it builds", !!row && !row.error, row && row.error ? row.error : "ok");
  const box = boxOf("T");
  const want = 2 * Math.tan(25 * Math.PI / 180) * 1000;
  check("the field cone is 2 x tan(25) x 1000 across",
        !!box && near(box.size[1], want, 0.01),
        box ? box.size[1].toFixed(3) + " vs " + want.toFixed(3) : "no shape");

  //! AND IT REACHES THE TARGET. The line to what it is aimed at runs all the
  //! way - the whole point of a target light is that the target is a thing you
  //! can see and grab - so the wireframe spans from the light to the origin
  //! and a little past it for the tick. 2000 plus the tick's own reach.
  const tick = Math.max(1000 * 0.04, 2828.42712474619 * 0.012);
  check("and the drawing runs all the way to the target",
        near(box.size[0], 2000 + tick * Math.SQRT1_2, 0.05),
        box.size[0].toFixed(2) + " vs " + (2000 + tick * Math.SQRT1_2).toFixed(2));

  const light = await lightOf("T");
  check("it describes itself as a target with both angles",
        !!light && light.kind === "target" && near(light.hotspot, 30) && near(light.field, 50),
        JSON.stringify({ k: light.kind, h: light.hotspot, f: light.field }));
  //! The frame, which is what the renderer aims the three.js light with. A
  //! unit forward vector from (2000,0,2000) to the origin is (-1,0,-1)/root 2.
  check("and the frame it is aimed along",
        near(light.forward[0], -Math.SQRT1_2, 1e-9)
        && near(light.forward[2], -Math.SQRT1_2, 1e-9),
        JSON.stringify(light.forward));
}

console.log("\n3. a field narrower than the hotspot is refused by name");
{
  //! The pair is the whole of what makes a pool of light have an edge. A field
  //! inside the hotspot is not a dim spot, it is a contradiction, and a light
  //! that silently swapped them would draw a cone nobody asked for.
  await kernel.loadModel(model([
    { id: "T", type: "TargetLight", name: "Backwards",
      args: { x: 1000, y: 0, z: 1000, tx: 0, ty: 0, tz: 0,
              shape: 0, hotspot: 60, field: 20 } }]));
  const row = await at("T");
  check("it is refused", !!row && !!row.error, row ? String(row.error) : "built!");
  check("and the refusal says why",
        /wider than the hotspot/.test(String(row.error || "")),
        String(row.error || "").slice(0, 80));
}

console.log("\n4. a soft box is drawn at the size it really is");
{
  //! 1200 x 600, aimed from (0, 2000, 2000) at the origin. `right` is
  //! (-1, 0, 0) for that aim, so the panel's whole extent in X is its width:
  //! 1200 exactly. A panel drawn at half its width - the commonest slip, since
  //! the corners are at +/- w/2 - would read 600.
  await kernel.loadModel(model([
    { id: "R", type: "TargetLight", name: "Panel",
      args: { x: 0, y: 2000, z: 2000, tx: 0, ty: 0, tz: 0,
              shape: 1, width: 1200, height: 600, size: 800 } }]));
  const row = await at("R");
  check("it builds", !!row && !row.error, row && row.error ? row.error : "ok");
  const box = boxOf("R");
  check("it is 1200 across, which is its width",
        !!box && near(box.size[0], 1200, 1e-6),
        box ? box.size[0].toFixed(3) : "no shape");
  const light = await lightOf("R");
  check("and it says it is a rectangle, with both sides",
        light.shape === 1 && near(light.width, 1200) && near(light.height, 600),
        JSON.stringify({ s: light.shape, w: light.width, h: light.height }));

  //! A disc takes the same width and uses it as a diameter, so the same
  //! number must give the same extent - otherwise switching the shape would
  //! silently change how big the light is.
  await mdl.run({ op: "set", id: "R", key: "shape", value: 2 });
  const disc = boxOf("R");
  check("and a disc of the same width is the same size across",
        !!disc && near(disc.size[0], 1200, 1e-6),
        disc ? disc.size[0].toFixed(3) : "no shape");
}

console.log("\n5. a skylight is a dome, and says which one");
{
  await kernel.loadModel(model([
    { id: "S", type: "Skylight", name: "Sky", args: { sky: 1, power: 2, turn: 30 } }]));
  const row = await at("S");
  check("it builds", !!row && !row.error, row && row.error ? row.error : "ok");
  const light = await lightOf("S");
  check("and carries which sky, how strong and how far round",
        light.kind === "sky" && light.sky === 1 && near(light.power, 2) && near(light.turn, 30),
        JSON.stringify(light));
  //! The glyph is a fixed size on purpose: a skylight has no position, and a
  //! hemisphere the size of the model would be a cage round it.
  const box = boxOf("S");
  check("its glyph is a fixed size, not the size of the model",
        !!box && near(box.size[2], 900, 1e-6), box ? box.size[2].toFixed(1) : "no shape");
}

console.log("\n6. switching one off leaves it in the model");
{
  //! Half of lighting a scene is turning things off one at a time to see what
  //! each one was doing, so off must not mean deleted - the node stays, the
  //! wireframe stays, and only the renderer stops hearing about it.
  await kernel.loadModel(model([
    { id: "P", type: "PointLight", name: "Lamp", args: { z: 2000, size: 400 } }]));
  await mdl.run({ op: "set", id: "P", key: "on", value: 1 });
  const row = await at("P");
  check("it still builds with its drawing", !!row && !row.error && !!boxOf("P"),
        row && row.error ? row.error : "drawn");
  check("and says it is off", (await lightOf("P")).on === false);
  check("and says so where a person reads it",
        /switched off/.test(String(row.note || "")), String(row.note || ""));
  check("and the one-line summary leads with it",
        /^off/.test(String(row.data.preview || "")), String(row.data.preview));
}

console.log("\n7. an exclusion list survives the document");
{
  //! The same stored form the drawing views use, so there is one reader and
  //! one control. It has to come back from a saved file: a light that forgets
  //! what it was leaving out relights a wall somebody deliberately kept dark.
  await kernel.loadModel(model([
    { id: "O", type: "Point", name: "O", args: { x: 0, y: 0, z: 0 } },
    { id: "B", type: "Cube", name: "Box", args: { origin: { ref: "O" }, dx: 100, dy: 100, dz: 100 } },
    { id: "P", type: "PointLight", name: "Lamp",
      args: { z: 2000, size: 400, exclude: JSON.stringify(["B"]) } }]));
  const light = await lightOf("P");
  check("the light leaves the box out", light.exclude.join() === "B",
        JSON.stringify(light.exclude));
  check("and says how many in its summary",
        /1 left out/.test(String((await at("P")).data.preview)),
        String((await at("P")).data.preview));

  const saved = JSON.parse(await mdl.modelText());
  await mdl.run({ op: "model", model: saved });
  check("and it is still left out after reopening",
        (await lightOf("P")).exclude.join() === "B",
        JSON.stringify((await lightOf("P")).exclude));
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
