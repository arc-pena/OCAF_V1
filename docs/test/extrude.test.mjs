// A pad goes both ways out of the paper.
//
// An extrude could only ever go ONE way from its profile, and every model that
// wanted a wall centred on its grid line, a slab centred on its level or a rib
// centred on its plane had to say so twice: extrude 200 one way, then move the
// result back 100. Two numbers for one thought, and they stop agreeing the
// moment either changes - which nothing in the model says they must.
//
// So the checks here are about WHERE the two ends are, not how long it is.
// A length is the easy half and it was never wrong; a symmetric pad that is
// the right length in the wrong place would pass a length test and be no use
// to anybody. Every number below is read off the built solid's own edges.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null });
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
                                      name: "Pads", units: "mm", features: [] } });
const add = async (type, more = {}) => (await mdl.run({ op: "add", type, ...more })).id;
const set = (id, key, value) => mdl.run({ op: "set", id, key, value });
const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);

//! WHERE THE TWO ENDS ARE, off the solid itself. Every point of every edge,
//! which for a prism is every corner of it.
const spanZ = async id => {
  const got = await kernel.picks(id, "edge");
  let lo = Infinity, hi = -Infinity;
  for (const one of got.items)
    for (const p of one.points) { lo = Math.min(lo, p[2]); hi = Math.max(hi, p[2]); }
  return { lo: Math.round(lo * 1e6) / 1e6, hi: Math.round(hi * 1e6) / 1e6 };
};

const PT = await add("Point");
const VZ = await add("Vector"); await set(VZ, "dx", 0); await set(VZ, "dz", 1);
const PL = await add("Plane", { refs: { origin: PT, normal: VZ } });
const SK = await add("Sketch", { refs: { plane: PL } });
await kernel.setSketch(SK, "drawing", { elements: [
  { id: "c1", type: "circle", c: [0, 0], r: 20 }], constraints: [] });

const RULE = await add("Measure"); await set(RULE, "quantity", 2);   // volume
const volumeOf = async id => {
  await kernel.setReference(RULE, "shape", id, false, true);
  const e = await at(RULE);
  return e && e.data ? Number(e.data.preview) : NaN;
};

const EX = await add("Extrude", { refs: { profile: SK } });
await set(EX, "distance", 100);

console.log("1. one side, which is what it always did");
{
  check("it builds", !(await at(EX)).error, (await at(EX)).error);
  const span = await spanZ(EX);
  check("and it runs from the profile forward", near(span.lo, 0) && near(span.hi, 100),
        JSON.stringify(span));
}

console.log("\n2. two sides: a second distance, behind");
{
  await set(EX, "sides", 1);
  await set(EX, "back", 40);
  const span = await spanZ(EX);
  check("it starts behind the profile and ends where it did",
        near(span.lo, -40) && near(span.hi, 100), JSON.stringify(span));
  //! ONE PRISM, NOT TWO FUSED. A pad that went both ways by fusing two pads
  //! would have a face across it at the profile, and that face is a seam
  //! nobody drew: it turns up in a fillet, in a picked face, in a section.
  const faces = await kernel.picks(EX, "face");
  check("and it is one prism, with no seam across it where the profile is",
        faces.items.length === 3, faces.items.length + " faces");
}

console.log("\n3. symmetric: one number, and the profile stays in the middle");
{
  await set(EX, "sides", 2);
  const span = await spanZ(EX);
  check("the same distance each way", near(span.lo, -100) && near(span.hi, 100),
        JSON.stringify(span));
  //! THE POINT OF IT: change the one number and the profile is STILL in the
  //! middle. This is what the extrude-then-move-back pair could not do.
  await set(EX, "distance", 150);
  const wider = await spanZ(EX);
  check("and it stays in the middle when the distance changes",
        near(wider.lo, -150) && near(wider.hi, 150), JSON.stringify(wider));
  await set(EX, "distance", 100);
}

console.log("\n4. the length is what the two ends say it is");
{
  await set(EX, "sides", 0);
  const one = await volumeOf(EX);
  await set(EX, "sides", 2);
  const both = await volumeOf(EX);
  check("symmetric is exactly twice one side", near(both, one * 2, 1e-6 * both),
        one.toFixed(3) + " -> " + both.toFixed(3));
  await set(EX, "sides", 1); await set(EX, "back", 40);
  const two = await volumeOf(EX);
  check("and two sides is the forward one plus the back one",
        near(two, one * 1.4, 1e-6 * two), two.toFixed(3));
}

console.log("\n5. backwards, which is the case that catches a sign");
{
  //! A NEGATIVE DISTANCE IS A PAD THE OTHER WAY, and "behind" is behind THAT.
  //! Signs are where this kind of arithmetic goes wrong, and it goes wrong
  //! silently: the solid is the right size and on the wrong side.
  await set(EX, "sides", 0);
  await set(EX, "distance", -100);
  check("one side, backwards, runs the other way",
        near((await spanZ(EX)).lo, -100) && near((await spanZ(EX)).hi, 0),
        JSON.stringify(await spanZ(EX)));
  await set(EX, "sides", 1); await set(EX, "back", 40);
  check("and the back distance is on the far side of the profile from it",
        near((await spanZ(EX)).lo, -100) && near((await spanZ(EX)).hi, 40),
        JSON.stringify(await spanZ(EX)));
  await set(EX, "sides", 2);
  check("symmetric backwards is the same solid as symmetric forwards",
        near((await spanZ(EX)).lo, -100) && near((await spanZ(EX)).hi, 100),
        JSON.stringify(await spanZ(EX)));
  await set(EX, "distance", 100); await set(EX, "sides", 0);
}

console.log("\n6. up to a plane still decides the far end");
{
  const TOP = await add("Point"); await set(TOP, "z", 250);
  const PLT = await add("Plane", { refs: { origin: TOP, normal: VZ } });
  await set(EX, "limit", 1);
  await kernel.setReference(EX, "until", PLT, false, true);
  check("one side reaches the plane and stops",
        near((await spanZ(EX)).lo, 0) && near((await spanZ(EX)).hi, 250),
        JSON.stringify(await spanZ(EX)));
  //! "FROM 200 BELOW THE SKETCH UP TO THAT FACE" is a real thing to say, and
  //! the trim is still what decides the far end.
  await set(EX, "sides", 1); await set(EX, "back", 200);
  check("and a back distance starts it below without moving the plane end",
        near((await spanZ(EX)).lo, -200) && near((await spanZ(EX)).hi, 250),
        JSON.stringify(await spanZ(EX)));
  await set(EX, "sides", 0);
  await set(EX, "limit", 0);
}

console.log("\n7. a file written before any of this is a one-sided pad");
{
  //! An argument's place in the list is its tag in the document, so `sides`
  //! and `back` had to be APPENDED. The proof is that a model file with
  //! neither of them in it opens as what it was.
  await kernel.loadModel({
    format: "ocaf-parametric-model", version: 1, name: "Old", units: "mm",
    features: [
      { id: "P0", type: "Point", args: { x: 0, y: 0, z: 0 } },
      { id: "V0", type: "Vector", args: { dx: 0, dy: 0, dz: 1 } },
      { id: "L0", type: "Plane", args: { origin: { ref: "P0" }, normal: { ref: "V0" } } },
      { id: "S0", type: "Sketch", args: { plane: { ref: "L0" },
        drawing: JSON.stringify({ elements: [{ id: "c1", type: "circle", c: [0, 0], r: 20 }],
                                  constraints: [] }) } },
      { id: "E0", type: "Extrude", args: { profile: { ref: "S0" }, distance: 100 } },
    ],
  });
  const span = await spanZ("E0");
  check("it reads back as one side, from the profile forward",
        near(span.lo, 0) && near(span.hi, 100), JSON.stringify(span));
  const row = await at("E0");
  check("and the two new arguments are simply absent from it",
        row.values.sides === 0, JSON.stringify(row.values.sides));
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
