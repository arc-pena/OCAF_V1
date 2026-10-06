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

const DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
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
//! WHAT A FEATURE BUILT, whether or not it is drawn. A Part is a container:
//! what goes on screen is what is IN it, so the part itself is not in the
//! drawn list - but it still produces the compound that an Instance places,
//! and that compound is what most of this file is about.
const shapeOf = id => {
  const f = K.doc().find(id);
  return f ? K.F.shape(f) : null;
};
const boxOf = id => {
  const shape = shapeOf(id);
  return shape && !shape.IsNull() ? K.extents(shape) : null;
};
const solidsIn = id => {
  const shape = shapeOf(id);
  return shape && !shape.IsNull() ? K.countSubShapes(shape, K.SOLID) : 0;
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
  //! AND IT IS THE PART THAT STANDS ASIDE, not its contents. The compound is
  //! for whatever READS the part; what goes on screen is the bodies in it, so
  //! they stay selectable and can be switched on and off one at a time. Handing
  //! over both would draw every solid twice - which looks right, exports
  //! double, and doubles every measured area and volume.
  const ids = drawn().map(one => one.id);
  check("its contents are what is drawn",
        ids.includes(HEAD) && ids.includes(SHANK), ids.join(","));
  check("and the part itself is not drawn beside them",
        !ids.includes(BOLT), ids.join(","));
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
  const partShape = shapeOf(BOLT);
  const instShape = shapeOf(I1);
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
  check("and what is drawn is the instances in it, not the product",
        ids.includes(I1) && !ids.includes(PROD), ids.join(","));
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
  //! Read off a body INSIDE the part, because the part is not drawn - which is
  //! exactly the path that matters: the bolt's own solids are what is on
  //! screen, so the part's colour has to reach them or colouring a part does
  //! nothing anybody can see.
  const inside = drawn().find(one => one.id === HEAD);
  check("a body in the part is told about the part's colour",
        !!(inside && inside.above && inside.above.length),
        JSON.stringify(inside && inside.above));
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

/* ================================ and a plain folder is instanceable too

   THE CASE SOMEBODY ACTUALLY HITS. Every model anybody has already built
   groups its work in a GeometricalSet, not in a Part - the samples included -
   so an Instance that only took a Part refused on the very thing people have
   in front of them. A folder has no shape of its own, so the instance
   compounds what is in it, and from the outside the two behave identically.  */

console.log("\n9. a geometrical set can be placed as readily as a part");
{
  const SHELF2 = await add("GeometricalSet");
  await mdl.run({ op: "rename", id: SHELF2, name: "Bracket" });
  const A = await add("Cube", { into: SHELF2, refs: { origin: ORIGIN, plane: FLOOR } });
  await set(A, "dx", 20); await set(A, "dy", 20); await set(A, "dz", 5);
  const B = await add("Cube", { into: SHELF2, refs: { origin: ORIGIN, plane: FLOOR } });
  await set(B, "dx", 5); await set(B, "dy", 20); await set(B, "dz", 20);

  const WHERE = await add("Point"); await set(WHERE, "x", 600);
  const PLACED = await add("Instance", { refs: { part: SHELF2, at: WHERE } });
  check("an instance of a plain set builds",
        !(await at(PLACED)).error, (await at(PLACED)).error);
  check("and carries everything in the set", solidsIn(PLACED) === 2,
        solidsIn(PLACED) + " solids");
  check("at the point it was given", near(boxOf(PLACED).low[0], 600),
        String(boxOf(PLACED).low[0]));
  //! THE ORIGINALS STAY. A Part is the body and its contents are its
  //! definition, so they are not drawn twice; a plain folder is NOT a body,
  //! so what is in it goes on being drawn exactly where it is, and the
  //! instance is a second one somewhere else. Both are right, and they are
  //! right in different ways - which is worth a test each.
  const ids = drawn().map(one => one.id);
  check("while the set's own contents stay where they are",
        ids.includes(A) && ids.includes(B), ids.join(","));

  //! AND EDITING THE SET MOVES THE INSTANCE, which is the whole claim. It
  //! needs the ordering edge: an instance that read its folder before the
  //! folder's contents were built would place an empty compound and say
  //! nothing about it.
  await set(A, "dz", 40);
  check("editing something in the set changes the instance of it",
        near(boxOf(PLACED).size[2], 40), String(boxOf(PLACED).size[2]));
}

/* =============================== and a copy is a paste, not a thousand edits

   Duplicating a set went out as ordinary edits - an add per feature, a set per
   ARGUMENT, a connect per wire - and each of those is a round trip that
   settles the whole document on the way back. For the 75-feature rack sample
   that is 627 edits and 71.75 seconds to make one copy. Read in as a subtree
   it is one build: 5.53 seconds, which is just the cost of the geometry.    */

console.log("\n10. a subtree is pasted in one build");
{
  const model = await kernel.model();
  const here = (await kernel.tree()).tree.features;
  const { duplicateEdits, duplicateModel } = await import("../src/reuse.js");
  const { typeSpec } = await import("../src/ocaf.js");
  const opts = { taken: new Set(here.map(f => f.id)),
                 takenNames: new Set(here.map(f => f.name)), spec: typeSpec };
  const asEdits = duplicateEdits(model, [PROD], opts);
  const asTree = duplicateModel(model, [PROD], opts);
  check("the two ways agree about what is copied",
        asTree.features.length === Object.keys(asEdits.renamed).length,
        asTree.features.length + " vs " + Object.keys(asEdits.renamed).length);
  check("and the subtree is far fewer operations than the edits",
        asTree.features.length * 3 < asEdits.edits.length,
        asTree.features.length + " features vs " + asEdits.edits.length + " edits");

  const was = (await kernel.tree()).tree.features.length;
  await mdl.run({ op: "graft", features: asTree.features });
  const now = (await kernel.tree()).tree.features;
  check("the paste landed", now.length === was + asTree.features.length,
        was + " -> " + now.length);
  //! ONLY THE PASTED ONES. Section 8 deliberately left a refused instance in
  //! the document, and a check that looked at the whole tree would find it.
  const pasted = new Set(asTree.made);
  const broken = now.filter(f => pasted.has(f.id) && f.error);
  check("and nothing in it is in error",
        broken.length === 0, broken.map(f => f.name + ": " + f.error).join(" | "));

  //! THE COPY IS ITS OWN. Its wires point inside the copy, not back at the
  //! original - which is the one thing a paste can get wrong in a way that
  //! looks perfect until the original is edited.
  const copiedProduct = now.find(f => f.id === asTree.renamed[PROD]);
  check("the copy is a product of its own", !!copiedProduct && !copiedProduct.error,
        copiedProduct ? copiedProduct.name : "missing");
  //! AND A WIRE OUT OF THE COPIED RUN IS LEFT POINTING WHERE IT POINTED. The
  //! product that was copied holds INSTANCES of a part that was not itself
  //! copied, so the copy instances the same part - which is not a bug to fix
  //! but the whole of what instancing is for: two products, one bolt, and
  //! changing the bolt changes both. A paste that had rewired them to a
  //! private copy of the bolt would have quietly turned an assembly of
  //! components into two piles of look-alikes.
  const before = boxOf(asTree.renamed[PROD]);
  await set(SHANK, "dz", 33);
  const after = boxOf(asTree.renamed[PROD]);
  check("the copy still instances the SAME part, so editing it moves both",
        !near(before.size[2], after.size[2]) && near(after.size[2], 33),
        before.size[2] + " -> " + after.size[2]);
  await set(SHANK, "dz", 20);
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
