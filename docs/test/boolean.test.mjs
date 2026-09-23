// A boolean that says it is done, and is not.
//
// THE FAILURE HERE LOOKS EXACTLY LIKE SUCCESS. A floor slab with an opening
// cut out of it came back with one solid, 235 faces, 8,048 m2 of surface and
// the right bounding box. It drew. It selected. It built green. And it
// enclosed nothing: its shell was open, so it measured zero volume, and
// OpenCascade will not write an unclosed solid into STEP - so sixty-one floors
// of a real tower were absent from every export with nothing anywhere saying
// so. The only thing that ever showed it was asking the shell whether it was
// closed, which is what this file does.
//
// WHAT THIS FILE DOES NOT DO IS REPRODUCE THAT FAILURE, and it is worth saying
// so rather than leaving a reader to assume a passing suite covered it. The
// failure needs that building's own outlines AND where they sit: measured on
// the real pair, through the real sketch-extrude-difference chain, with the
// retry taken out -
//
//     at the origin                            2410.0232 m3, closed
//     at +1 km                                 2410.0232 m3, closed
//     at +100 km                               2410.0232 m3, closed
//     at +496 km, +2492 km (where it is)       2410.0232 m3, closed
//     at -496 km, -2492 km                        0.0000 m3, OPEN
//     at +1000 km                                 0.0000 m3, OPEN
//
// - which is the signature of a modelling tolerance that has stopped meaning
// anything against coordinates of that size: not a threshold you can cross
// deliberately, a coin flip that depends on the actual numbers. Forty- and
// 133-sided synthetic outlines survive every one of those offsets, so there is
// no small stand-in to put here, and the client's floor plan is not going in a
// public repository to make a test discriminate. The evidence for the fix is
// the real model: sixty-one bodies with zero volume and open shells before,
// none after, and BO5 at exactly 2410.0232 m3 either way you measure it.
//
// So what is below is a GUARD, not a reproduction. It passes with the retry
// and without it. It is here so that a boolean which stops returning closed
// solids - or which starts refusing the empty answer that a tool swallowing
// its target legitimately gives - is caught by somebody other than the person
// whose export came out short.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { readFileSync } from "fs";

const WASM_DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const initModule = (await import(WASM_DIR + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({
  initModule, wasmBinary: readFileSync(WASM_DIR + "/replicad_single.wasm"),
});
const kit = kernel.toolkit();
const oc = kit.oc, SF = kit.shape;
const E = oc.TopAbs_ShapeEnum;

const volume = shape => {
  const props = new oc.GProp_GProps();
  oc.BRepGProp.VolumeProperties(shape, props, false, false, false);
  const mass = props.Mass();
  props.delete();
  return mass;
};
//! THE ONE QUESTION THAT CATCHES IT. Everything else about the broken result
//! reads as healthy.
const openShells = shape => {
  const walk = new oc.TopExp_Explorer(shape, E.TopAbs_SHELL, E.TopAbs_SHAPE);
  let open = 0;
  while (walk.More()) { if (!oc.BRep_Tool.IsClosed(walk.Current())) open++; walk.Next(); }
  walk.delete();
  return open;
};

console.log("1. a tool exactly as thick as what it cuts (coincident faces both ends)");
{
  // A 200 x 120 x 10 slab, and a 60 x 40 x 10 tool sitting inside it in plan
  // and flush with it top and bottom. Both are closed solids to start with.
  const slab = SF.boxAt([0, 0, 0], 200, 120, 10);
  const tool = SF.boxAt([40, 30, 0], 60, 40, 10);
  check("the slab is a closed solid", openShells(slab) === 0 && near(volume(slab), 200*120*10, 1),
        volume(slab).toFixed(1));
  check("and so is the tool", openShells(tool) === 0 && near(volume(tool), 60*40*10, 1),
        volume(tool).toFixed(1));

  const cut = SF.remove(slab, tool);
  //! Volume first, because it is the number a person would look at and it is
  //! the one that was zero.
  const wanted = 200*120*10 - 60*40*10;
  check("the difference has the volume it should", near(volume(cut), wanted, 1),
        volume(cut).toFixed(1) + " wanted " + wanted);
  check("AND ITS SHELL IS CLOSED - the thing that was wrong", openShells(cut) === 0,
        openShells(cut) + " open");
  check("with faces on it", kit.countSubShapes(cut, E.TopAbs_FACE) > 6,
        String(kit.countSubShapes(cut, E.TopAbs_FACE)));
}

console.log("2. the ordinary case is not disturbed");
{
  // A tool that reaches past both sides - what anybody would draw on purpose -
  // must give the same answer it always did, by the plain road.
  const slab = SF.boxAt([0, 0, 0], 200, 120, 10);
  const tool = SF.boxAt([40, 30, -5], 60, 40, 20);
  const cut = SF.remove(slab, tool);
  const wanted = 200*120*10 - 60*40*10;
  check("a tool that reaches past cuts the same volume", near(volume(cut), wanted, 1),
        volume(cut).toFixed(1));
  check("and closes", openShells(cut) === 0, openShells(cut) + " open");
}

console.log("3. adding and intersecting go the same way");
{
  const a = SF.boxAt([0, 0, 0], 100, 100, 10);
  const b = SF.boxAt([50, 0, 0], 100, 100, 10);   // flush top and bottom again
  const both = SF.add(a, b);
  check("a union of two flush slabs closes", openShells(both) === 0, openShells(both) + " open");
  check("and holds both of them", near(volume(both), 150 * 100 * 10, 1), volume(both).toFixed(1));

  const shared = SF.intersect(a, b);
  check("their overlap closes", openShells(shared) === 0, openShells(shared) + " open");
  check("and is the overlap", near(volume(shared), 50 * 100 * 10, 1), volume(shared).toFixed(1));
}

console.log("4. cutting a body entirely away is still allowed");
{
  // Not every empty answer is a broken one: a tool that swallows its target
  // leaves nothing, and nothing is the right answer rather than an error.
  const small = SF.boxAt([10, 10, 10], 10, 10, 10);
  const big = SF.boxAt([0, 0, 0], 100, 100, 100);
  const gone = SF.remove(small, big);
  check("what is left has no solids in it",
        kit.countSubShapes(gone, E.TopAbs_SOLID) === 0,
        String(kit.countSubShapes(gone, E.TopAbs_SOLID)));
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
