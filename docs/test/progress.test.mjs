// Whether a long build says how far along it is.
//
// THE FAULT THIS IS ABOUT. Opening the rack sample took just under a minute
// and reported nothing at all while it did: the panel came up on the one
// message sent before the walk began - "Reading the model", a bar at nought -
// and then neither moved nor closed. What a person saw was a program that had
// hung, and the only way to tell that from a program that HAD hung was to wait
// it out.
//
// There were two causes and they are both about the same mistaken idea, that
// the number of features is a measure of the work:
//
//   settleAsync took the straight, synchronous path below 250 features. The
//   rack is 70 features and four of them drill 144 holes each, so it went
//   straight - no slices, so no progress and no frame drawn - for the whole
//   minute.
//
//   cutAll cut those 144 holes ONE AT A TIME, each a full boolean against a
//   post that had grown more faces with every hole before it. That is where
//   the minute came from in the first place.
//
// So this checks both: that a build of real work reports itself more than
// once, with the count going up, and that the drilling that made it slow is
// not slow any more. A count is not a time, and the time is the point.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { PluginHost } from "../src/plugin.js";
import "../src/rack-plugin.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const host = new PluginHost({
  toolkit: () => kernel.toolkit(),
  installDrivers: (specs, builders) => kernel.installDrivers(specs, builders),
  removeDrivers: specs => kernel.removeDrivers(specs),
  typesInUse: types => kernel.typesInUse(types),
});
await host.load("rack");
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });

//! EXACTLY WHAT THE PAGE DOES. attachKernel sets onBuild and the kernel calls
//! it; nothing else about the page is needed to check that it is called.
const steps = [];
kernel.onBuild = step => steps.push(step);

const model = JSON.parse(readFileSync("docs/data/samples/hyperstack_rack.json", "utf8"));

console.log("1. a build long enough to notice reports itself while it runs");
{
  const began = Date.now();
  await mdl.run({ op: "model", model });
  const took = Date.now() - began;
  const building = steps.filter(s => s.stage === "building");
  console.log("     " + (took / 1000).toFixed(1) + " s · " + steps.length
    + " messages, " + building.length + " of them while building");

  check("it says it is reading before it starts",
        steps.some(s => s.stage === "reading"), JSON.stringify(steps[0]));
  //! MORE THAN ONE, which is the whole difference. One message is what the
  //! broken version sent, and one message under a bar that never moves is
  //! indistinguishable from a program that has stopped.
  check("and reports its progress more than once while building",
        building.length >= 2, building.length + " building messages");
  check("with the count going up and a total to go up towards",
        building.length >= 2 && building[building.length - 1].done > building[0].done
          && building[0].total > 0,
        JSON.stringify(building.map(s => s.done + "/" + s.total)));
  //! AND EVERY FEATURE IS ACCOUNTED FOR. A progress report that stops at 55 of
  //! 70 and then finishes is a bar that jumps from three quarters to gone.
  check("and the total is the whole document",
        building.every(s => s.total === model.features.length),
        JSON.stringify([...new Set(building.map(s => s.total))]));
}

console.log("\n2. and the drilling that made it slow is not slow any more");
{
  //! MEASURED, not asserted about. The old cutAll took 61 s to open this model
  //! on this machine and the batched one takes about 5; the threshold is set
  //! well above the fast number and well below the slow one, so it catches a
  //! return to cutting one hole at a time without failing on a slow machine.
  const began = Date.now();
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: 47 });
  const took = Date.now() - began;
  console.log("     one height change rebuilt the whole rack in "
    + (took / 1000).toFixed(1) + " s");
  check("a height change rebuilds in seconds rather than a minute",
        took < 25000, (took / 1000).toFixed(1) + " s");

  //! AND THE HOLES ARE STILL THERE. The fast way to cut 144 holes is to cut
  //! none of them, and that would pass a timing check on its own.
  const K = kernel.toolkit();
  const post = K.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
    .find(b => b.id === "PF1");
  const faces = post ? K.countSubShapes(post.shape, K.FACE) : 0;
  check("and the post still has every hole in it", faces > 500, faces + " faces");
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
