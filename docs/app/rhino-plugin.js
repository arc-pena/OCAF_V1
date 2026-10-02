// The Rhino package: two ways a Rhino model gets in here.
//
// It adds no nodes. What it adds is two file extensions, and a Rhino model
// arrives as an ORDINARY MODEL FILE - layers as sets, meshes as MeshImported,
// blocks as one body with an Instance per placement - so it opens on the undo
// stack like anything else and nothing about Rhino reaches further in.
//
//   .rhj  the bridge file, written by scripts/rhino_export.py inside Rhino.
//         The whole kernel is there, so it meshes at a tolerance somebody
//         chose and carries the layer tree, the blocks, the colours and the
//         user strings. This is the one to use.
//
//   .3dm  the Rhino file itself, through Rhino's own rhino3dm. Nothing to
//         install and limited by what Rhino cached: rhino3dm carries the file
//         format and none of the kernel, so a Brep saved without a render
//         mesh cannot be drawn by it at all. Those arrive named and counted.
//
// WHY .3dm IS NOT IN THE SINGLE FILE. rhino3dm is 1.01 MB packed and the
// Artifact had 1.11 MB of its 16 MB left when this was written - it would fit,
// with 0.6% to spare, which is not a margin. So the library is served beside
// the page and a .3dm works on the served site; in the single file the reader
// says so and points at the bridge script, which is the better path anyway.

import { offerPlugin } from "./plugin.js";
import { resource } from "./payload.js";
import { bridgeFrom3dm, bridgeModel, readBridge } from "./rhino.js";

//! Loaded once, on the first .3dm, and never in the single-file build - a
//! 2.7 MB WebAssembly download is not something to do on the chance somebody
//! might open a Rhino file.
let loading = null;
async function rhinoLibrary() {
  if (loading) return loading;
  loading = (async () => {
    let make;
    try {
      make = (await import("../vendor/rhino3dm.module.min.js")).default;
    } catch (err) {
      throw new Error("this build does not carry Rhino's library, so it cannot open a "
        + ".3dm directly. Open the served copy of this page, or export a .rhj from "
        + "Rhino with scripts/rhino_export.py — which carries more than a .3dm can "
        + "anyway, because it runs where Rhino's kernel is");
    }
    //! The bytes rather than a path: `resource` already knows whether this
    //! page unpacks its pieces or fetches them, and handing emscripten the
    //! finished bytes means it never has to guess a URL.
    const answer = await resource("rhino3dm-wasm", "vendor/rhino3dm.wasm",
                                  "Rhino's library", "application/wasm");
    const wasmBinary = new Uint8Array(await answer.arrayBuffer());
    return make({ wasmBinary });
  })().catch(err => { loading = null; throw err; });
  return loading;
}

export const RHINO = offerPlugin({
  id: "rhino",
  name: "Rhino",
  version: 1,
  summary: "Opens Rhino models — the .3dm itself, or a bridge file written by a script "
         + "inside Rhino that carries the layer tree, the blocks and the attributes.",
  needs: [],

  //! NO NODES. This package teaches the page two file extensions and nothing
  //! else, so there is nothing to put on the rail and nothing to register in
  //! the catalogue - and a model it opens needs no package to open again.
  nodes: [],

  api: {
    name: "RhinoBridge",
    summary: "Rhino models, as model files.",
    operations: [
      { name: "readBridge", takes: "text", gives: "a bridge model",
        summary: "Parses a .rhj and checks it, naming the field and the expectation "
               + "when it will not read." },
      { name: "bridgeFrom3dm", takes: "bytes, rhino3dm", gives: "a bridge model",
        summary: "The same shape, read from a .3dm with Rhino's own library. Limited "
               + "to what Rhino cached in the file." },
      { name: "bridgeModel", takes: "bridge, options", gives: "{ model, report, say }",
        summary: "The model file, plus a count of what came in and what did not and "
               + "why. Blocks become one body and an Instance per placement." },
    ],
  },

  resources: [],

  async start(kit) {
    const drops = [];
    if (kit.addReader) {
      drops.push(kit.addReader({
        key: "rhino-bridge",
        name: "Rhino bridge",
        extensions: [".rhj"],
        short: "a Rhino model, with its layers and blocks",
        summary: "Written by scripts/rhino_export.py from inside Rhino, where the whole "
               + "kernel is. Carries the layer tree, block definitions and their "
               + "placements, object colours and every user string.",
        open(text, name) {
          const bridge = readBridge(text);
          const { model, say } = bridgeModel(bridge);
          if (!model.features.length)
            throw new Error("there is nothing in that bridge file to build");
          return { model: { ...model, name: model.name || stem(name) }, say };
        },
      }));

      drops.push(kit.addReader({
        key: "rhino-3dm",
        name: "Rhino 3DM",
        extensions: [".3dm"],
        //! THE BYTES, not the text. A .3dm is binary and reading it as a
        //! string mangles it long before the reader sees it.
        binary: true,
        short: "a Rhino file, as Rhino saved it",
        summary: "Read with Rhino's own rhino3dm, which carries the file format and not "
               + "the kernel — so meshes and anything Rhino cached a render mesh for "
               + "come in, and a surface saved without one is named and counted rather "
               + "than quietly missing.",
        async open(bytes, name) {
          const rh = await rhinoLibrary();
          const bridge = bridgeFrom3dm(bytes, rh, { name: stem(name) });
          const { model, say } = bridgeModel(bridge);
          if (!model.features.length)
            throw new Error("nothing in that file has geometry this can draw — "
              + "if it is all surfaces, re-save it from Rhino without \"Save Small\", "
              + "or export a .rhj with scripts/rhino_export.py");
          return { model, say };
        },
      }));
    }
    return { drivers: {}, view: null, dispose: () => drops.forEach(drop => drop && drop()) };
  },
});

const stem = name => String(name || "Rhino model").replace(/\.(rhj|3dm)$/i, "");
