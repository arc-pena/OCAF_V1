// Turn a folder of STEP files into a parts library.
//
// The point is that this is a PIPELINE and not a transcription. Parts arrive a
// few at a time, from McMaster-Carr or from a manufacturer, and each one has to
// become: exact geometry the modeller can place, a part number somebody can
// order, and a measured size so a fitting can be matched to a channel without
// anybody opening the file. Doing that by hand once is fine; doing it by hand
// forty times is how a library goes stale.
//
// What it writes, into docs/data/parts/:
//   <part>.brep   the exact B-Rep, which is far smaller than the STEP and is
//                 the format the Imported node already reads
//   index.json    part number, description, source file, measured bounding box,
//                 solid count, and the unit the STEP declared
//
// NOTHING IS INVENTED. The part number and the description are split off the
// supplier's own filename; the size is measured off the geometry. Where a file
// transfers with errors that is recorded against the part rather than smoothed
// over - a fitting that arrived in two pieces is a fact somebody needs.
//
//   node scripts/ingest_parts.mjs <folder-or-file>...

import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "fs";
import { basename, extname, join, resolve } from "path";

const OUT = resolve("docs/data/parts");
const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";

//! McMaster names a file "<part>_<size> <words>.STEP" and Unistrut names it
//! "<part>.stp". Both give the part number first, which is the only thing that
//! has to be exact - the rest is description and is kept as written.
function describe(file) {
  const stem = basename(file, extname(file));
  //! The uploads folder prefixes a hash and a dash; it is not part of the name.
  const clean = stem.replace(/^[0-9a-f]{8}-/, "");
  const m = clean.match(/^([A-Z0-9][A-Z0-9-]*?)[_ ](.+)$/i);
  if (!m) return { part: clean, description: "" };
  return { part: m[1], description: m[2].replace(/[_]/g, " ").trim() };
}

//! The size in the supplier's own description, in millimetres, so the measured
//! geometry can be checked against the name it arrived under. "7-1/2 Long" is
//! seven and a half INCHES on a McMaster page, and a file that comes in at
//! 7.5 mm has been read in the wrong unit.
function statedLength(description) {
  const m = String(description).match(/^(\d+)(?:-(\d+)-(\d+))?\s/);
  if (!m) return null;
  const whole = Number(m[1]);
  const frac = m[2] && m[3] ? Number(m[2]) / Number(m[3]) : 0;
  return (whole + frac) * 25.4;
}

const kernel = await createWasmKernel({
  initModule: (await import(WASM + "/replicad_single.js")).default,
  wasmBinary: readFileSync(WASM + "/replicad_single.wasm"),
});
const K = kernel.toolkit();
const { oc } = K;

const files = [];
for (const arg of process.argv.slice(2)) {
  const path = resolve(arg);
  //! withFileTypes, because a folder whose name ends in .step is a folder and
  //! readFileSync on one fails with EISDIR rather than with anything that says
  //! what happened.
  //! BRACES, and they are load bearing. Without them the `else` binds to the
  //! inner `if` rather than the outer one, so every entry in the folder that
  //! was NOT a STEP file pushed the FOLDER onto the list - and the first thing
  //! read was a directory, which fails as EISDIR a long way from the cause.
  if (statSync(path).isDirectory()) {
    for (const entry of readdirSync(path, { withFileTypes: true })) {
      if (entry.isFile() && /\.(step|stp)$/i.test(entry.name))
        files.push(join(path, entry.name));
    }
  } else {
    files.push(path);
  }
}
if (!files.length) { console.log("nothing to ingest"); process.exit(0); }
mkdirSync(OUT, { recursive: true });

const index = [];
for (const file of files.sort()) {
  const { part, description } = describe(file);
  const text = readFileSync(file, "utf8");
  const declared = (text.match(/SI_UNIT\s*\(\s*\.?([A-Z]*)\.?\s*,\s*\.METRE\./) || [])[1] || "";
  let note = "";
  //! Everything OpenCascade says while reading goes to stderr; a file that
  //! transfers with complaints is still a part, and the complaint is recorded.
  oc.FS.writeFile("/in.step", text);
  const reader = new oc.STEPControl_Reader();
  const status = String(reader.ReadFile("/in.step"));
  if (status !== "IFSelect_RetDone") {
    index.push({ part, description, source: basename(file), error: "refused: " + status });
    console.log(part.padEnd(12) + " REFUSED " + status);
    continue;
  }
  const roots = reader.NbRootsForTransfer();
  reader.TransferRoots(new oc.Message_ProgressRange());
  const shape = reader.OneShape();
  const e = K.extents(shape);
  const brep = oc.BRepToolsWrapper.Write(shape);
  writeFileSync(join(OUT, part + ".brep"), brep);

  const size = e.size.map(v => Math.round(v * 100) / 100);
  const longest = Math.max(...size);
  const stated = statedLength(description);
  //! THE UNIT CHECK, and it is free: the supplier wrote the length in the
  //! name. A 3" bracket that measures 76.2 mm was read correctly; one that
  //! measures 3 mm was read as millimetres when the file said inches.
  if (stated && Math.abs(longest - stated) > Math.max(2, stated * 0.06))
    note = "measures " + longest.toFixed(1) + " mm against " + stated.toFixed(1)
         + " mm stated in its name — check the unit";

  index.push({ part, description, source: basename(file), declaredUnit: declared || "unstated",
               roots, size, low: e.low.map(v => Math.round(v * 100) / 100),
               brep: part + ".brep", brepBytes: brep.length, note });
  console.log(part.padEnd(12) + size.map(v => String(v).padStart(7)).join(" x ")
    + "  roots " + roots + "  brep " + (brep.length / 1024).toFixed(0) + " kB"
    + (stated ? "  stated " + stated.toFixed(1) : "")
    + (note ? "  ** " + note : ""));
}

writeFileSync(join(OUT, "index.json"), JSON.stringify(
  { format: "parts-index", version: 1, written: new Date().toISOString().slice(0, 10),
    note: "Geometry as supplied by the manufacturer. Part numbers and descriptions "
        + "are the supplier's own filenames; sizes are measured off the geometry.",
    parts: index }, null, 1));
console.log("\n" + index.length + " parts -> docs/data/parts/index.json");
