// The material nodes, built against a real kernel.
//
// material.test.mjs checks the arithmetic - that a checker has its squares the
// right way round. This checks the thing arithmetic cannot: that the DRIVERS
// resolve a graph of nodes into one self-contained description, that a Material
// knows which bodies it paints, and that what comes back is the same shape the
// renderer reads.
//
// The failure this exists for is the one every node family has had: every unit
// test green on a document the kernel cannot build, or builds into something
// that looks right and carries nothing.

import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { evalShade } from "../src/material.js";
import { readFileSync } from "fs";

const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const initModule = (await import(WASM + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= tol;
const sameColour = (c, want, tol = 1e-6) =>
  Array.isArray(c) && c.every((v, i) => near(v, want[i], tol));

const kernel = await createWasmKernel({
  initModule, wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
//! Edits go through mdl, the one road every edit in the program takes - a test
//! that pokes the document directly is testing a road nobody drives.
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null });

const model = features => ({ format: "ocaf-parametric-model", version: 1,
                             name: "materials", units: "mm", features });
const tree = async () => (await kernel.tree()).tree;
const at = async id => (await tree()).features.find(f => f.id === id);

//! A box to paint, so the Material has something real to be about.
const BOX = [
  { id: "O", type: "Point", name: "Corner", args: { x: 0, y: 0, z: 0 } },
  { id: "B", type: "Cube", name: "Box",
    args: { origin: { ref: "O" }, dx: 100, dy: 100, dz: 100 } }];

console.log("1. a shade node builds and says what it is");
{
  await kernel.loadModel(model([
    { id: "S", type: "Shade", name: "Red", args: { red: 1, green: 0, blue: 0 } }]));
  const shade = await at("S");
  check("it builds", !!shade && !shade.error, shade && shade.error ? shade.error : "ok");
  check("and carries a shade program",
        !!shade.data && shade.data.kind === "shade" && shade.data.program.op === "colour",
        JSON.stringify(shade && shade.data));
  //! The whole point of the program being data: the test can EVALUATE what the
  //! kernel produced, with the same evaluator the renderer uses, and check the
  //! colour rather than check that a field exists.
  check("that evaluates to the colour the node was given",
        sameColour(evalShade(shade.data.program, 0.5, 0.5), [1, 0, 0]),
        JSON.stringify(evalShade(shade.data.program, 0.5, 0.5)));
}

console.log("\n2. a wired graph resolves into ONE self-contained program");
{
  //! THE RULE THAT MATTERS. A Checker's inputs are resolved INTO its program
  //! rather than referenced from it, so a Material carries the whole of what
  //! it means and the renderer never has to walk the document to bake it.
  await kernel.loadModel(model([
    { id: "R", type: "Shade", name: "Red", args: { red: 1, green: 0, blue: 0 } },
    { id: "L", type: "Shade", name: "Blue", args: { red: 0, green: 0, blue: 1 } },
    { id: "C", type: "Checker", name: "Board",
      args: { scale: 6, a: { ref: "R" }, b: { ref: "L" } } }]));
  const board = await at("C");
  check("the checker builds", !!board && !board.error,
        board && board.error ? board.error : "ok");
  const program = board.data && board.data.program;
  check("and its inputs are inside it, not references to other features",
        !!program && program.a && program.a.op === "colour" && program.b
        && program.b.op === "colour" && !JSON.stringify(program).includes('"ref"'),
        JSON.stringify(program));
  //! 6 squares across: (0.08, 0.08) is square 0 both ways, sum 0, even, so A.
  //! (0.25, 0.08) is square 1 across, sum 1, odd, so B. The same arithmetic
  //! material.test.mjs does on paper - here against what the KERNEL produced.
  check("and it evaluates to the wired colours in the right squares",
        sameColour(evalShade(program, 0.08, 0.08), [1, 0, 0])
        && sameColour(evalShade(program, 0.25, 0.08), [0, 0, 1]),
        JSON.stringify(evalShade(program, 0.08, 0.08)) + " / "
        + JSON.stringify(evalShade(program, 0.25, 0.08)));
}

console.log("\n3. an unwired slot is a default, not a failure");
{
  //! A half-built graph must still build. A node that goes red until the last
  //! wire is in is a node nobody can assemble, because the way you assemble
  //! one is by wiring it up a slot at a time.
  await kernel.loadModel(model([
    { id: "C", type: "Checker", name: "Bare", args: { scale: 4 } }]));
  const bare = await at("C");
  check("a checker with nothing wired in still builds", !!bare && !bare.error,
        bare && bare.error ? bare.error : "ok");
  check("and evaluates to its own defaults",
        sameColour(evalShade(bare.data.program, 0.1, 0.1), [1, 1, 1]),
        JSON.stringify(evalShade(bare.data.program, 0.1, 0.1)));
}

console.log("\n4. a Material names the bodies it paints");
{
  await kernel.loadModel(model([...BOX,
    { id: "N", type: "NoiseShade", name: "Rust",
      args: { scale: 8, octaves: 3, gain: 0.5, seed: 4 } },
    { id: "M", type: "Material", name: "Rusted",
      args: { of: [{ ref: "B" }], red: 0.5, green: 0.2, blue: 0.1,
              roughness: 0.8, metalness: 1, tiles: 3, colourMap: { ref: "N" } } }]));
  const made = await at("M");
  check("it builds", !!made && !made.error, made && made.error ? made.error : "ok");
  check("and says which body it is on",
        !!made.data && Array.isArray(made.data.of) && made.data.of.length === 1
        && made.data.of[0] === "B", JSON.stringify(made.data && made.data.of));
  const material = made.data && made.data.material;
  check("and carries the numbers it was given",
        !!material && near(material.roughness, 0.8) && near(material.metalness, 1)
        && near(material.tiles, 3) && sameColour(material.colour, [0.5, 0.2, 0.1]),
        JSON.stringify(material && { r: material.roughness, m: material.metalness,
                                     t: material.tiles, c: material.colour }));
  check("and the map, as a program rather than a reference",
        !!material.maps.colour && material.maps.colour.op === "noise"
        && material.maps.colour.scale === 8,
        JSON.stringify(material.maps.colour));
  check("and the slots with nothing wired into them are empty",
        material.maps.roughness === null && material.maps.metalness === null,
        JSON.stringify(Object.keys(material.maps).filter(k => material.maps[k])));

  //! The box itself must be untouched: a Material is a fact ABOUT a body, not
  //! an operation ON it, so painting one may not consume it or change it.
  const box = await at("B");
  check("the body it paints is not consumed or changed",
        !!box && !box.error && !box.consumedBy,
        !box ? "missing" : box.error ? "error: " + box.error
             : box.consumedBy ? "consumed by " + box.consumedBy : "untouched");
}

console.log("\n5. a Material painting nothing still builds");
{
  //! The common state while somebody is building one. It has to produce a
  //! usable description and an empty list - not an error, and not a list with
  //! an undefined in it, which is what the renderer would then try to paint.
  await kernel.loadModel(model([
    { id: "M", type: "Material", name: "Unused", args: { red: 0.2 } }]));
  const made = await at("M");
  check("it builds with nothing wired", !!made && !made.error,
        made && made.error ? made.error : "ok");
  check("and paints an empty list rather than nothing at all",
        Array.isArray(made.data.of) && made.data.of.length === 0,
        JSON.stringify(made.data.of));
  check("and says so where a person will read it",
        /wired to nothing/.test(String(made.data.preview || "")),
        JSON.stringify(made.data.preview));
}

console.log("\n6. a change upstream reaches the material");
{
  //! The whole reason these are document features rather than a side table:
  //! the solver already knows a Material depends on its shades, so moving a
  //! slider five nodes up rebuilds it. If it did not, a material would quietly
  //! describe the graph as it was when it was last touched.
  await kernel.loadModel(model([...BOX,
    { id: "R", type: "Shade", name: "Tone", args: { red: 1, green: 0, blue: 0 } },
    { id: "G", type: "Gradient", name: "Fade", args: { bias: 1, a: { ref: "R" } } },
    { id: "M", type: "Material", name: "Painted",
      args: { of: [{ ref: "B" }], colourMap: { ref: "G" } } }]));
  const before = (await at("M")).data.material.maps.colour;
  check("the gradient reached the material",
        !!before && before.a && sameColour(before.a.colour, [1, 0, 0]),
        JSON.stringify(before && before.a));

  await mdl.run({ op: "set", id: "R", key: "green", value: 1 });
  const after = (await at("M")).data.material.maps.colour;
  check("and a change two nodes upstream rebuilds it",
        !!after && after.a && sameColour(after.a.colour, [1, 1, 0]),
        JSON.stringify(after && after.a));
}

console.log("\n7. the document survives a round trip");
{
  //! A material is document data, so it has to come back from a saved file -
  //! and the shade kind is new, which is exactly when a save format quietly
  //! drops something.
  await kernel.loadModel(model([...BOX,
    { id: "R", type: "Shade", name: "Red", args: { red: 1, green: 0, blue: 0 } },
    { id: "K", type: "Checker", name: "Board", args: { scale: 5, a: { ref: "R" } } },
    { id: "M", type: "Material", name: "Tiled",
      args: { of: [{ ref: "B" }], roughness: 0.25, tiles: 4, colourMap: { ref: "K" } } }]));
  const saved = JSON.parse(await mdl.modelText());
  check("the saved file carries the material nodes",
        saved.features.filter(f => ["Shade", "Checker", "Material"].includes(f.type)).length === 3,
        saved.features.map(f => f.type).join(", "));

  await mdl.run({ op: "model", model: saved });
  const again = await at("M");
  check("and it builds the same after reopening",
        !!again && !again.error && again.data.material.maps.colour
        && again.data.material.maps.colour.op === "checker"
        && near(again.data.material.maps.colour.scale, 5)
        && near(again.data.material.tiles, 4),
        again && again.error ? again.error : JSON.stringify(again.data.material.maps.colour));
  check("and still names the body", again.data.of[0] === "B",
        JSON.stringify(again.data.of));
}

console.log("\n8. a texture is referenced, and the reference survives the file");
{
  //! THE FAILURE THIS IS FOR. A Material's image map carries WHERE its bytes
  //! are rather than the bytes - one image in the document once, however many
  //! materials wear it. That reference is a feature id, and a feature id is
  //! only meaningful if it is still the same id after the file has been saved
  //! and reopened.
  //!
  //! If it were not, what a person would see is: the model saves, reopens
  //! perfectly, and every textured material renders untextured. No error, no
  //! red node, nothing in the tree to look at. Which is why it is checked here
  //! rather than trusted.
  const IMAGE = "/9j/4AAQSkZJRg==";          // not a real JPEG; the bytes are not read here
  await kernel.loadModel(model([...BOX,
    { id: "T", type: "Texture", name: "Concrete colour",
      args: { image: IMAGE, role: "Colour", from: "Concrete034_Color.jpg" } },
    { id: "M", type: "Material", name: "Concrete",
      args: { of: [{ ref: "B" }], colourMap: { ref: "T" } } }]));

  const texture = await at("T");
  check("the texture builds", !!texture && !texture.error,
        texture && texture.error ? texture.error : "ok");
  check("and holds the image itself",
        texture.data.program.op === "image" && texture.data.program.image === IMAGE,
        JSON.stringify({ op: texture.data.program.op,
                         bytes: (texture.data.program.image || "").length }));
  check("and says what it is for, and in which space",
        texture.data.program.role === "colour" && texture.data.program.space === "srgb",
        texture.data.program.role + " / " + texture.data.program.space);

  const made = await at("M");
  const map = made.data.material.maps.colour;
  check("the material points at it rather than copying it",
        !!map && map.op === "image" && map.at === "T" && map.image === undefined,
        JSON.stringify({ at: map && map.at, carries: map && map.image !== undefined }));
  //! THE SIZE OF THE SAVING. A material with four maps was carrying six
  //! megabytes of base64 it did not need; this is the check that it is not
  //! carrying any.
  check("so the material's own description is small",
        JSON.stringify(made.data.material).length < 2000,
        JSON.stringify(made.data.material).length + " characters");

  //! AND ROUND THE FILE. Saved, reopened, and the reference still finds it.
  const saved = JSON.parse(await mdl.modelText());
  const stored = saved.features.find(f => f.id === "T");
  check("the saved file carries the image on the texture node",
        !!stored && String(stored.args.image) === IMAGE,
        stored ? (String(stored.args.image || "").length + " characters") : "missing");

  await mdl.run({ op: "model", model: saved });
  const again = (await at("M")).data.material.maps.colour;
  check("and after reopening the material still points at it",
        !!again && again.at === "T", JSON.stringify(again && again.at));
  check("and the texture it points at still has the bytes",
        (await at("T")).data.program.image === IMAGE,
        ((await at("T")).data.program.image || "").length + " characters");

  //! A roughness map must NOT be sRGB. Encoding one renders a perfectly
  //! plausible picture of a surface that is polished where it should be
  //! rough - no error, no visual tell, wrong by about 2.2 in the wrong place.
  await mdl.run({ op: "set", id: "T", key: "role", value: 1 });
  const rough = (await at("T")).data.program;
  check("a roughness map is linear, not sRGB",
        rough.role === "roughness" && rough.space === "linear",
        rough.role + " / " + rough.space);
}

console.log("\n9. an image gets in by being EDITED in, not only by arriving in a file");
{
  //! THE FAILURE THIS IS FOR, and it is the one section 8 above could not see.
  //!
  //! Section 8 loads its image as part of a model file. That is the loader's
  //! write, and the loader writes a blob straight onto the attribute. Nobody
  //! installing a material takes that road: dropping a zip on the window makes
  //! the nodes and then EDITS the bytes in, one `code` edit per map, and the
  //! document's own setCode would only accept an argument of kind "code" or
  //! "text". A blob is neither.
  //!
  //! So every one of those writes was refused, and nothing downstream noticed.
  //! The Material was made, a Texture was made per map, each was named, each
  //! got its role, each was wired to its slot, the tree looked finished, the
  //! save file was valid, the references resolved - and all four images were
  //! empty strings. The renderer dutifully asked for bytes, got none, and
  //! returned no texture; the surface rendered untextured. The only way to
  //! find out was to ask the renderer what it was holding.
  //!
  //! The distance between section 8 and this one is the whole lesson: a test
  //! that sets up through a different door from the program's can pass for
  //! weeks while the door everyone walks through is locked.
  const IMAGE = "/9j/4AAQSkZJRgABAQAAAQ==";
  await kernel.loadModel(model([...BOX,
    { id: "T", type: "Texture", name: "Edited in", args: { role: "Colour" } },
    { id: "M", type: "Material", name: "Concrete", args: { of: [{ ref: "B" }],
                                                           colourMap: { ref: "T" } } }]));
  check("the texture starts with no image",
        !(await at("T")).data.program.image,
        JSON.stringify(((await at("T")).data.program.image || "").length));

  //! Through mdl, the road every edit in the program takes. A refusal here is
  //! a thrown error, so it is caught and reported rather than failing the run:
  //! "the edit was refused" is the finding, not a crash.
  let refused = null;
  try { await mdl.run({ op: "code", id: "T", key: "image", text: IMAGE }); }
  catch (err) { refused = err.message; }
  check("a code edit onto a blob argument is accepted", !refused,
        refused || "accepted");
  check("and the bytes are on the node afterwards",
        (await at("T")).data.program.image === IMAGE,
        ((await at("T")).data.program.image || "").length + " characters");
  check("so the material that points at it can be given them",
        (await at("M")).data.material.maps.colour.at === "T"
        && (await at("T")).data.program.image === IMAGE,
        JSON.stringify({ at: (await at("M")).data.material.maps.colour.at,
                         bytes: ((await at("T")).data.program.image || "").length }));

  //! AND IT SURVIVES THE FILE BY THE SAME ROUTE IT ARRIVED BY. An edit that
  //! lands but is not saved is the same defect one step later.
  const saved = JSON.parse(await mdl.modelText());
  const stored = saved.features.find(f => f.id === "T");
  check("and an edited-in image is in the saved file",
        !!stored && String(stored.args.image) === IMAGE,
        stored ? String(stored.args.image || "").length + " characters" : "missing");

  //! A key that really is not there must still be refused. Opening setCode to
  //! blobs would be a bad fix if it opened it to everything.
  let wrong = null;
  try { await mdl.run({ op: "code", id: "T", key: "role", text: "Colour" }); }
  catch (err) { wrong = err.message; }
  check("but a code edit onto a choice is still refused", !!wrong,
        wrong || "it was allowed, which it must not be");
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
