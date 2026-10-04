// The example textured materials, fetched from ambientCG.
//
// The drop handler installs a material from any library's zip, which is the
// part that matters - nobody's texture library is going to live in this
// repository. These are here so that there is something to look at and
// something to take apart on a page nobody has dropped anything on yet.
//
//   node scripts/fetch_materials.mjs
//
// ONLY THE MAPS THAT ARE USED. A 1K-JPG set is three to eight megabytes and
// most of that is a Blender file, a USD stage, a 16-bit displacement and a
// second normal map in the other convention. Colour, roughness and the OpenGL
// normal are what the renderer reads; taking those three is about 1.3 MB and
// is the difference between six materials and one.
//
// Everything on ambientCG is CC0 - their licence page says so and was read
// rather than remembered. Recorded in docs/data/materials/README.md anyway.

import { writeFileSync, mkdirSync, readFileSync, existsSync } from "fs";
import { execFileSync } from "child_process";

const OUT = "docs/data/materials";
const RES = "1K-JPG";
//! Architectural, and chosen for what a scheme is actually made of rather than
//! for what photographs well: a fair-faced concrete, a brick, a floorboard, a
//! brushed metal, a painted plaster and a tile.
const WANT = [
  { id: "Concrete034", group: "concrete", name: "Concrete, fair-faced" },
  { id: "Bricks105", group: "masonry", name: "Brick" },
  { id: "WoodFloor043", group: "timber", name: "Wood floor" },
  { id: "Metal049A", group: "metal", name: "Brushed metal" },
  { id: "PaintedPlaster017", group: "paint", name: "Painted plaster" },
  { id: "Tiles139", group: "floor", name: "Tile" },
];
//! What the renderer reads, by the name ambientCG writes it under.
const KEEP = { Color: "colour", Roughness: "roughness", NormalGL: "normal",
               Metalness: "metalness" };

mkdirSync(OUT, { recursive: true });
const made = [];

for (const want of WANT) {
  //! Cached, because this fetches four megabytes a time and the download URL
  //! is predictable - the API call is only there to confirm the asset exists,
  //! and asking again for a file already on disk is a round trip that can fail
  //! for reasons that have nothing to do with this script. One did.
  const tmp = "/tmp/claude-0/" + want.id + ".zip";
  if (!existsSync(tmp)) {
    execFileSync("curl", ["-sSL", "-m", "300", "-o", tmp,
      "https://ambientcg.com/get?file=" + want.id + "_" + RES + ".zip"]);
    if (readFileSync(tmp).length < 10000) {
      console.log(want.id + ": the download came back empty");
      continue;
    }
  }
  const asset = { displayName: want.name };

  //! Unzipped with the system's own, because this script runs once on a
  //! machine with one and the browser's reader is the thing being fed, not the
  //! thing being used here.
  const dir = OUT + "/" + want.id;
  mkdirSync(dir, { recursive: true });
  const listing = execFileSync("unzip", ["-Z1", tmp], { encoding: "utf8" }).trim().split("\n");
  const maps = {};
  let bytes = 0;
  for (const [tag, role] of Object.entries(KEEP)) {
    const name = listing.find(one => new RegExp("_" + tag + "[.]jpg$", "i").test(one));
    if (!name) continue;
    execFileSync("unzip", ["-o", "-j", tmp, name, "-d", dir], { stdio: "pipe" });
    const plain = role + ".jpg";
    execFileSync("mv", [dir + "/" + name.split("/").pop(), dir + "/" + plain]);
    bytes += readFileSync(dir + "/" + plain).length;
    maps[role] = plain;
  }
  if (!maps.colour) { console.log(want.id + ": no colour map, skipped"); continue; }
  made.push({ ...want, asset: want.id, maps, bytes,
              credit: asset.displayName || want.id });
  console.log("wrote " + dir + "  " + Object.keys(maps).join(", ")
              + "  " + (bytes / 1048576).toFixed(2) + " MB");
}

writeFileSync(OUT + "/textured.json", JSON.stringify({
  note: "Textured PBR materials, 1K JPEG, CC0 from ambientCG.com. Served beside "
      + "the page, not packed into the single file. Only the maps the renderer "
      + "reads are kept - colour, roughness, the OpenGL normal and metalness "
      + "where there is one - which is about a fifth of what the original zip "
      + "holds. Drop any library's zip on the window to install your own.",
  resolution: RES,
  materials: made,
}, null, 1));
console.log("wrote " + OUT + "/textured.json  " + made.length + " materials, "
            + (made.reduce((n, one) => n + one.bytes, 0) / 1048576).toFixed(1) + " MB");
