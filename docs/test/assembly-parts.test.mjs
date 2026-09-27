// Parts, products and instances: components rather than copies.
//
// WHAT THIS IS ABOUT. A geometrical set is a folder and a folder is not a
// body, so nothing that takes a body could ever take one: an Array could not
// pattern an assembly, a boolean could not cut against one, and there was no
// way to say "this thing, over there" except to build the thing again. A Part
// is a container that also PRODUCES the compound of its contents, and every
// one of those falls out of that single change without being told about it.
//
// THE THREE CLAIMS WORTH TESTING, because all three can be false while the
// picture on screen is perfect:
//
//   it is shared, not copied      - an instance must cost a location and no
//                                   geometry, or a data centre of forty racks
//                                   is forty racks' worth of B-Rep
//   editing the part moves them   - the whole point of an instance over a copy
//   nothing is counted twice      - a part draws its contents, so if they also
//                                   draw themselves the model looks right and
//                                   measures double
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 0.01) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
                                      name: "Assembly", units: "mm", features: [] } });
const add = async (type, more = {}) => {
  const { into, ...rest } = more;
  const id = (await mdl.run({ op: "add", type, ...rest })).id;
  if (into) await mdl.run({ op: "group", id, into });
  return id;
};
const set = (id, key, value) => mdl.run({ op: "set", id, key, value });
const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);
const K = kernel.toolkit();
const drawn = () => K.bodies({ notCategories: ["datum", "data"], sewMeshes: false });
const boxOf = id => {
  const b = drawn().find(one => one.id === id);
  return b ? K.extents(b.shape) : null;
};
const solidsIn = id => {
  const b = drawn().find(one => one.id === id);
  return b ? K.countSubShapes(b.shape, K.SOLID) : 0;
};

//! The datums the primitives are placed on. They sit OUTSIDE the parts, which
//! is the ordinary case: what a part reads from outside itself is its input
//! list, and a part that could not read anything from outside would be a part
//! nobody could place.
const ORIGIN = await add("Point");
const UP = await add("Vector"); await set(UP, "dx", 0); await set(UP, "dz", 1);
const FLOOR = await add("Plane", { refs: { origin: ORIGIN, normal: UP } });

/* ------------------------------------------------ a bolt, as a part of its own */

console.log("1. a part is a folder that is also a body");
const BOLT = await add("Part");
await mdl.run({ op: "rename", id: BOLT, name: "M6 bolt" });
//! Two solids, so "the part is its contents, all of them" is testable rather
//! than indistinguishable from "the part is the last thing in it".
const HEAD = await add("Cube", { into: BOLT, refs: { origin: ORIGIN, plane: FLOOR } });
await set(HEAD, "dx", 10); await set(HEAD, "dy", 10); await set(HEAD, "dz", 4);
const SHANK = await add("Cube", { into: BOLT, refs: { origin: ORIGIN, plane: FLOOR } });
await set(SHANK, "dx", 6); await set(SHANK, "dy", 6); await set(SHANK, "dz", 20);
{
  const e = boxOf(BOLT);
  check("it builds a shape, which a set never did", !!e, JSON.stringify(e && e.size));
  check("and the shape is everything in it", solidsIn(BOLT) === 2, solidsIn(BOLT) + " solids");
  //! THE CONTENTS ARE NOT DRAWN BESIDE IT. If they were, this model would have
  //! four solids in it and every area and volume would be twice what it is.
  const ids = drawn().map(one => one.id);
  check("and its contents are not handed over a second time",
        !ids.includes(HEAD) && !ids.includes(SHANK), ids.join(","));
}

/* ------------------------------------------------------ placed, not rebuilt */

console.log("\n2. an instance is the same geometry somewhere else");
const P1 = await add("Point"); await set(P1, "x", 100);
const P2 = await add("Point"); await set(P2, "x", 300); await set(P2, "y", 50);
const I1 = await add("Instance", { refs: { part: BOLT, at: P1 } });
const I2 = await add("Instance", { refs: { part: BOLT, at: P2 } });
{
  check("an instance builds", !(await at(I1)).error, (await at(I1)).error);
  check("and carries the whole part", solidsIn(I1) === 2, solidsIn(I1) + " solids");
  const a = boxOf(I1), b = boxOf(I2);
  check("each one is where it was put",
        near(a.low[0], 100) && near(b.low[0], 300) && near(b.low[1], 50),
        a.low.map(n => n.toFixed(1)).join(",") + "  /  " + b.low.map(n => n.toFixed(1)).join(","));
  check("and they are the same size as the part",
        near(a.size[0], boxOf(BOLT).size[0]) && near(a.size[2], boxOf(BOLT).size[2]),
        a.size.map(n => n.toFixed(1)).join(","));
  //! SHARED, MEASURED. Moved keeps the TShape, so the instance's shape and the
  //! part's shape are the same underlying geometry. IsPartner is OpenCascade's
  //! own word for "same TShape, any location" - which is exactly the claim.
  const partShape = drawn().find(one => one.id === BOLT).shape;
  const instShape = drawn().find(one => one.id === I1).shape;
  check("the instance shares the part's geometry rather than copying it",
        instShape.IsPartner(partShape), "IsPartner");
  check("while sitting at its own location",
        !instShape.IsSame(partShape), "IsSame would mean it never moved");
}

/* -------------------------------------------- edit the part, every instance moves */

console.log("\n3. change the part and everywhere it is used changes");
{
  await set(SHANK, "dz", 40);
  const a = boxOf(I1), b = boxOf(I2), part = boxOf(BOLT);
  check("the part grew", near(part.size[2], 40), String(part.size[2]));
  check("and so did both instances, off the one edit",
        near(a.size[2], 40) && near(b.size[2], 40),
        a.size[2] + " / " + b.size[2]);
  await set(SHANK, "dz", 20);
}

/* ------------------------------------------------ a pattern of an instance */

console.log("\n4. a pattern of a part is a pattern of an assembly");
const ROW = await add("Array", { refs: { source: I2 } });
await set(ROW, "countX", 5); await set(ROW, "spacingX", 100);
{
  check("it builds", !(await at(ROW)).error, (await at(ROW)).error);
  check("five copies of a two-solid part is ten solids",
        solidsIn(ROW) === 10, solidsIn(ROW) + " solids");
  check("and the row is four spacings long",
        near(boxOf(ROW).size[0], 410), String(boxOf(ROW).size[0]));
}

/* ------------------------------------- replace the instance, downstream follows */

console.log("\n5. point an instance at another part and everything downstream follows");
const NUT = await add("Part");
await mdl.run({ op: "rename", id: NUT, name: "M6 nut" });
const NUTBODY = await add("Cube", { into: NUT, refs: { origin: ORIGIN, plane: FLOOR } });
await set(NUTBODY, "dx", 10); await set(NUTBODY, "dy", 10); await set(NUTBODY, "dz", 5);
{
  //! THE WHOLE OF "REPLACE INSTANCE". Nothing was written to make the pattern
  //! notice: the pattern reads the instance, the instance reads the part, and
  //! the document rebuilds what is downstream of an edit.
  await kernel.setReference(I2, "part", NUT, false, true);
  //! MEASURED ON THE PATTERN, because an Array consumes its source: once I2 is
  //! patterned it is not a body in its own right, which is the same rule that
  //! keeps a bill from counting the bolt a pattern was made from. So the
  //! pattern is both the only thing left to measure and the better witness -
  //! it is the downstream feature that nobody touched.
  check("the pattern of it followed without being touched",
        solidsIn(ROW) === 5 && near(boxOf(ROW).size[2], 5),
        solidsIn(ROW) + " solids, " + boxOf(ROW).size[2] + " tall");
  check("and it is the new part's shape, not the old one's",
        near(boxOf(ROW).size[1], 10), String(boxOf(ROW).size[1]));
}

/* ------------------------------------------------------ a product of parts */

console.log("\n6. a product is an assembly that is itself a part");
const PROD = await add("Product");
await mdl.run({ op: "rename", id: PROD, name: "Fixing kit" });
await mdl.run({ op: "group", id: I1, into: PROD });
await mdl.run({ op: "group", id: ROW, into: PROD });
{
  check("the product builds", !(await at(PROD)).error, (await at(PROD)).error);
  check("and holds everything filed in it",
        solidsIn(PROD) === 7, solidsIn(PROD) + " solids (2 + 5)");
  const ids = drawn().map(one => one.id);
  check("its contents are not drawn beside it",
        !ids.includes(I1) && !ids.includes(ROW), ids.join(","));
  //! AND A PRODUCT IS INSTANCEABLE, which is what makes a row of racks and
  //! then a hall of rows possible without the model growing by the hall.
  const P3 = await add("Point"); await set(P3, "y", 2000);
  const I3 = await add("Instance", { refs: { part: PROD, at: P3 } });
  check("a product can itself be instanced",
        !(await at(I3)).error && solidsIn(I3) === 7,
        ((await at(I3)).error || solidsIn(I3) + " solids"));
}

/* -------------------------------------------------------- the refusals */

console.log("\n7. a colour on a part is worn by everything in it");
{
  //! THE OTHER HALF OF "CHANGE IT IN ONE PLACE". Colour lives on a feature and
  //! cascades down the containers above it, so colouring the part is how you
  //! colour every bolt in the building. It cascaded nowhere until now: the walk
  //! asked doc.find for a feature it had already been handed, so `above` came
  //! back empty for every body in every document and the cascade had never once
  //! run. Nothing looked wrong - an uncoloured model is a grey model.
  await kernel.setAppearance(BOLT, { colour: "#b87333" });
  const inside = K.bodies({ notCategories: ["datum", "data"], sewMeshes: false,
                            except: [] }).find(one => one.id === BOLT);
  check("the part carries the colour", !!(inside && inside.appearance),
        JSON.stringify(inside && inside.appearance));
  //! And a feature filed inside a plain set sees the set's colour above it,
  //! which is the general rule the part is one case of.
  const SHELF = await add("GeometricalSet");
  const LOOSE = await add("Cube", { into: SHELF, refs: { origin: ORIGIN, plane: FLOOR } });
  await kernel.setAppearance(SHELF, { colour: "#336699" });
  const seen = K.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
    .find(one => one.id === LOOSE);
  check("and a body inside a coloured set is told about the set's colour",
        !!(seen && seen.above && seen.above.length),
        JSON.stringify(seen && seen.above));
}

console.log("\n8. and it refuses what would be nonsense");
{
  const INNER = await add("Instance", { refs: { part: BOLT }, into: BOLT });
  const said = (await at(INNER)).error || "";
  check("an instance of the part it is filed inside is refused in words",
        /cannot also place it/.test(said), said || "it built");
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
