// Materials, and the styles that show them.
//
// Two things are checked and they are different. That a material is ONE fact -
// resolved the same way for both renderers, written down as a name rather than
// as four numbers, and still there after the document has been saved and read
// back. And that the styles are a table rather than a pile of special cases:
// what each one turns on is a row, and adding a fourth style is adding a row.
//
// The arctic pass itself is not here. It is four passes of GLSL and the only
// honest test of it is a picture, which is taken in a browser.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { FINISHES, VIEW_STYLES, appearanceOf, findFinish, findStyle, hexOf, materialOf, rgbOf }
  from "../src/styles.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= tol;

console.log("1. what an object is made of");
{
  const bare = materialOf(null);
  check("an object nobody has painted is not chrome", bare.finish === "default",
        bare.finish + " · " + bare.label);
  check("and it is not a mirror either", bare.metalness < 0.2 && bare.gloss < 0.6,
        "metal " + bare.metalness + ", gloss " + bare.gloss);

  const brass = materialOf({ finish: "brass" });
  check("a name is enough to be a material", brass.metalness === 1 && near(brass.gloss, 0.8),
        JSON.stringify([brass.metalness, brass.gloss]));
  check("gloss and roughness are the same number said two ways",
        near(brass.roughness, 1 - brass.gloss), brass.roughness + " vs " + brass.gloss);

  // The samples in this document ask for a finish by name. Every name they use
  // has to be a real one, or they quietly come out as something else.
  for (const key of ["aluminium", "glass"])
    check("the samples' \"" + key + "\" is a real finish", findFinish(key).key === key,
          findFinish(key).key);
  check("and a name nobody has ever written is the default, not a crash",
        findFinish("unobtanium").key === "default", findFinish("unobtanium").key);

  const painted = materialOf({ finish: "brass", color: [0.1, 0.2, 0.3], gloss: 0.2 });
  check("what the object says for itself wins",
        painted.color[0] === 0.1 && near(painted.gloss, 0.2), JSON.stringify(painted.color));
  check("and what it does not say comes from the finish", painted.metalness === 1,
        String(painted.metalness));

  const silly = materialOf({ finish: "matte", gloss: 40, opacity: -3 });
  check("numbers out of range are brought back in",
        silly.gloss === 1 && silly.opacity > 0, JSON.stringify([silly.gloss, silly.opacity]));

  const glass = materialOf({ finish: "glass" });
  check("glass is see-through without anybody saying so", glass.opacity < 0.5,
        String(glass.opacity));
}

console.log("\n2. what is written down");
{
  const plain = appearanceOf("brass");
  check("a finish is written as its name", plain.finish === "brass", JSON.stringify(plain));
  check("and nothing else is invented",
        !("gloss" in plain) && !("metalness" in plain), JSON.stringify(plain));

  const same = appearanceOf("brass", { gloss: findFinish("brass").gloss });
  check("a slider left where the finish put it is not an override",
        !("gloss" in same), JSON.stringify(same));

  const moved = appearanceOf("brass", { gloss: 0.3, opacity: 0.5 });
  check("a slider that was moved is", near(moved.gloss, 0.3) && near(moved.opacity, 0.5),
        JSON.stringify(moved));
  check("and the name is still there, so the finish still means something",
        moved.finish === "brass", JSON.stringify(moved));

  check("hex out and back is the same colour",
        hexOf(rgbOf("#3f7ac4")) === "#3f7ac4", hexOf(rgbOf("#3f7ac4")));
  check("and a colour that is not one comes back as something drawable",
        rgbOf("nonsense").every(v => v >= 0 && v <= 1), JSON.stringify(rgbOf("nonsense")));
}

console.log("\n3. the styles are a table");
{
  const keys = VIEW_STYLES.map(s => s.key);
  check("three of them, each with its own name", new Set(keys).size === keys.length,
        keys.join(", "));
  check("every one says what it is for",
        VIEW_STYLES.every(s => s.label && s.summary && s.summary.length > 40));
  check("shaded is the one that draws tangent edges",
        findStyle("shaded").edges && !findStyle("rendered").edges
        && !findStyle("arctic").edges);
  check("rendered is the only one that obeys materials",
        VIEW_STYLES.filter(s => s.materials).map(s => s.key).join() === "rendered",
        VIEW_STYLES.filter(s => s.materials).map(s => s.key).join());
  check("arctic is the only one that paints everything the same clay",
        VIEW_STYLES.filter(s => s.clay).map(s => s.key).join() === "arctic");
  check("and it is a pale clay, not white - white has nowhere left to go",
        findStyle("arctic").clay.every(v => v > 0.8 && v < 0.95),
        JSON.stringify(findStyle("arctic").clay));
  check("a style nobody has heard of is the modelling one",
        findStyle("wireframe").key === "shaded", findStyle("wireframe").key);
  check("every finish in the library has a colour and a name",
        FINISHES.every(f => f.key && f.label && f.color.length === 3
                         && typeof f.metalness === "number" && typeof f.gloss === "number"),
        FINISHES.length + " finishes");
}

console.log("\n4. it is a property of the object, so it survives the document");
{
  const kernel = await createWasmKernel({ initModule: init,
                                          wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
  const mdl = new Mdl({ kernel, apply: () => {}, setNode: () => {}, readLayout: () => ({}),
                        select: () => {}, selected: () => null, picked: () => [] });
  await kernel.loadModel({ format: "ocaf-parametric-model", version: 1, name: "M",
                           units: "mm", features: [] });
  await mdl.run({ op: "add", type: "Point", id: "O", name: "Origin" });
  await mdl.run({ op: "add", type: "Cube", id: "CU", name: "Block", refs: { origin: "O" } });

  const wear = appearanceOf("brass", { gloss: 0.31 });
  await mdl.run({ op: "appearance", id: "CU", appearance: wear });
  const at = async id => ((await kernel.tree()).tree.features.find(f => f.id === id) || {});
  check("the feature wears it", JSON.stringify((await at("CU")).appearance) === JSON.stringify(wear),
        JSON.stringify((await at("CU")).appearance));

  const file = await kernel.model();
  const written = file.features.find(f => f.id === "CU");
  check("and the model file carries it", written.appearance.finish === "brass",
        JSON.stringify(written.appearance));

  const back = await kernel.loadModel(file);
  check("the file reads back with nothing failed", back.report.failed.length === 0,
        JSON.stringify(back.report.failed.map(f => f.message)));
  const after = await at("CU");
  check("and the material is still on it", after.appearance
        && after.appearance.finish === "brass" && near(after.appearance.gloss, 0.31),
        JSON.stringify(after.appearance));
  check("which resolves to the same material either side of the file",
        materialOf(after.appearance).roughness === materialOf(wear).roughness,
        String(materialOf(after.appearance).roughness));

  // Changing a material must not rebuild geometry: it is paint, not shape.
  const was = (await at("CU")).revision;
  await mdl.run({ op: "appearance", id: "CU", appearance: appearanceOf("concrete") });
  check("painting a body does not rebuild it", (await at("CU")).revision === was,
        was + " -> " + (await at("CU")).revision);
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall checks passed");
process.exit(failures ? 1 : 0);
