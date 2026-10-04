// The example skies, fetched from Poly Haven.
//
// A skylight lights everything from every direction at once, and what makes
// that worth having is that the directions are a REAL place: the shadows are
// that sky's and the reflections are of somewhere that exists. The renderer
// can paint a dome out of arithmetic - it does, and that is what the built-in
// skies are - but an arithmetic dome has no sun through a window in it and no
// building on the horizon to reflect.
//
//   node scripts/fetch_skies.mjs
//
// Four of them, at 1k, chosen for what architects actually light with rather
// than for what looks dramatic: a photographic studio, an overcast sky, a
// clear sunny one and a low sun. 1k rather than 2k because a sky is used as
// LIGHT here, and light is low frequency - at 2k each one is four times the
// size and the only thing that improves is how sharp it is when you point the
// camera straight at it.
//
// SERVED ONLY. Six megabytes cannot go in a 16 MB single file that is already
// at 14.6, so these sit beside the page like the kernel does. In the Artifact
// the Skylight node falls back to the painted domes and says so.
//
// Everything on Poly Haven is CC0 - their own licence page says so, and was
// read rather than remembered: "You can use our assets for any purpose,
// including commercial work. You do not need to give credit or attribution".
// The authors are recorded anyway in docs/data/sky/README.md, because not
// being obliged to credit somebody is a poor reason not to.

import { writeFileSync, mkdirSync } from "fs";

const OUT = "docs/data/sky";
const RES = "1k";

//! key          what the Skylight node calls it
//! asset        Poly Haven's own id, which is how to find it again
const SKIES = [
  { key: "studio", asset: "studio_small_09",
    name: "Photo studio",
    why: "Large softboxes on a white infinity cyc. The reference light for a "
       + "product shot, and the one that flatters a detail model." },
  { key: "overcast", asset: "kloofendal_48d_partly_cloudy_puresky",
    name: "Partly cloudy",
    why: "A bright sky with soft-edged cloud. Shadows with an edge you can see "
       + "but not a hard one - the condition most of a temperate year is." },
  { key: "clear", asset: "syferfontein_18d_clear",
    name: "Clear sun",
    why: "A clear sky with the sun high. Hard shadows and a strong sky-blue "
       + "fill in them, which is what makes a white wall read as two colours." },
  { key: "sunset", asset: "venice_sunset",
    name: "Low sun",
    why: "A low warm sun over water. Long shadows and a raking light down a "
       + "facade, which is the condition an elevation is usually drawn for." },
];

mkdirSync(OUT, { recursive: true });
const made = [];

for (const sky of SKIES) {
  const info = await (await fetch("https://api.polyhaven.com/info/" + sky.asset)).json();
  const files = await (await fetch("https://api.polyhaven.com/files/" + sky.asset)).json();
  const file = files.hdri && files.hdri[RES] && files.hdri[RES].hdr;
  if (!file || !file.url) { console.log("no " + RES + " hdr for " + sky.asset); continue; }

  const bytes = new Uint8Array(await (await fetch(file.url)).arrayBuffer());
  const name = sky.key + ".hdr";
  writeFileSync(OUT + "/" + name, bytes);
  made.push({ ...sky, file: name, bytes: bytes.length,
              authors: Object.keys(info.authors || {}),
              description: info.description || "" });
  console.log("wrote " + OUT + "/" + name + "  " + (bytes.length / 1048576).toFixed(2) + " MB");
}

//! The manifest the page reads, so the node's menu and the files cannot
//! disagree about what is there.
writeFileSync(OUT + "/index.json", JSON.stringify({
  note: "Equirectangular HDR skies, 1k, CC0 from polyhaven.com. Served beside "
      + "the page, not packed into the single file - see docs/data/sky/README.md.",
  resolution: RES,
  skies: made.map(({ key, asset, name, why, file, bytes, authors }) =>
    ({ key, asset, name, why, file, bytes, authors })),
}, null, 1));

writeFileSync(OUT + "/README.md",
  "# Example skies\n\n"
  + "Equirectangular HDR, " + RES + ", fetched by `scripts/fetch_skies.mjs` from\n"
  + "[Poly Haven](https://polyhaven.com). **CC0** — their licence page states it\n"
  + "plainly: \"You can use our assets for any purpose, including commercial work.\n"
  + "You do not need to give credit or attribution.\" Credited below anyway.\n\n"
  + "**Served, not packed.** Together they are about "
  + (made.reduce((s, one) => s + one.bytes, 0) / 1048576).toFixed(0)
  + " MB, and the single-file build had\n"
  + "1.4 MB of its 16 MB limit left when these were added. So the Skylight node\n"
  + "offers them on the served site and falls back to the renderer's own painted\n"
  + "domes in the Artifact, where fetching is not allowed at all.\n\n"
  + "| In the node | Poly Haven | By | Size |\n|---|---|---|---|\n"
  + made.map(one => "| " + one.name + " | `" + one.asset + "` | "
      + one.authors.join(", ") + " | " + (one.bytes / 1048576).toFixed(2) + " MB |").join("\n")
  + "\n\n"
  + made.map(one => "**" + one.name + "** — " + one.why).join("\n\n") + "\n");
console.log("wrote " + OUT + "/index.json and README.md");
