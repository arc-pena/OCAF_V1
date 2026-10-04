// Bundles the rendering engine into one classic script, vendored.
//
// The renderer is three-gpu-pathtracer over three.js, and all three packages
// are ES modules that import each other by bare name. Neither of this
// project's two targets can resolve a bare name: the single file concatenates
// its modules into one scope with the import statements stripped, and the
// served site imports by relative path. So they are bundled here, once, into
// one IIFE that hangs its exports off `window.PT` - which is exactly the shape
// the showroom used to load PlayCanvas in, and means payload.js can carry it
// unchanged.
//
// The result is committed under docs/vendor/ rather than built on demand,
// because a build that needs npm and a bundler to be reachable is a build that
// fails on a train. Run this when a version moves; it prints what it made.
//
//   node scripts/build_pathtracer.mjs
//
// Everything it pulls is MIT. The versions are pinned here and recorded in
// docs/vendor/README.md, which is the only place the page ever says what it is
// running.

import { execFileSync } from "child_process";
import { mkdtempSync, mkdirSync, cpSync, writeFileSync, readFileSync, statSync } from "fs";
import { gzipSync } from "zlib";
import { tmpdir } from "os";
import { join } from "path";

const PINS = {
  "three": "0.166.1",
  "three-mesh-bvh": "0.7.8",
  "three-gpu-pathtracer": "0.0.23",
};
const ESBUILD = "esbuild@0.23.1";
const OUT = "docs/vendor/pathtracer.bundle.js";

//! What the page is allowed to reach for. Named rather than `export *` so the
//! bundle carries only what render.js actually uses, and so a name that goes
//! away in a later version fails HERE, at build time, with the name in the
//! error - rather than as `undefined is not a constructor` on first paint.
const ENTRY = `
import * as THREE from "three";
import { MeshBVH, SAH, CENTER, AVERAGE } from "three-mesh-bvh";
import { WebGLPathTracer, PhysicalCamera, EquirectCamera, DenoiseMaterial,
         BlurredEnvMapGenerator, GradientEquirectTexture, ProceduralEquirectTexture,
         ShapedAreaLight, PhysicalSpotLight, FogVolumeMaterial } from "three-gpu-pathtracer";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
//! Radiance .hdr is the format a sky is distributed in and no browser decodes
//! it. three's own loader does, and it is 6 kB - cheaper than any of the
//! alternatives and already the one everybody's files were written for.
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
window.PT = {
  THREE, REVISION: THREE.REVISION,
  MeshBVH, SAH, CENTER, AVERAGE,
  WebGLPathTracer, PhysicalCamera, EquirectCamera, DenoiseMaterial,
  BlurredEnvMapGenerator, GradientEquirectTexture, ProceduralEquirectTexture,
  ShapedAreaLight, PhysicalSpotLight, FogVolumeMaterial,
  FullScreenQuad, RoomEnvironment, RGBELoader,
  versions: ${JSON.stringify(PINS)},
};
`;

const work = mkdtempSync(join(tmpdir(), "ptbundle-"));
const modules = join(work, "node_modules");
mkdirSync(modules, { recursive: true });

console.log("fetching " + Object.entries(PINS).map(([n, v]) => n + "@" + v).join(", "));
for (const [name, version] of Object.entries(PINS)) {
  execFileSync("npm", ["pack", name + "@" + version], { cwd: work, stdio: "pipe" });
  const tarball = name.replace(/\//g, "-") + "-" + version + ".tgz";
  const into = join(work, "unpack-" + name);
  mkdirSync(into, { recursive: true });
  execFileSync("tar", ["xzf", join(work, tarball), "-C", into]);
  cpSync(join(into, "package"), join(modules, name), { recursive: true });
}

writeFileSync(join(work, "entry.js"), ENTRY);
console.log("bundling with " + ESBUILD);
const log = execFileSync("npx", ["--yes", ESBUILD, join(work, "entry.js"), "--bundle",
  "--format=iife", "--minify", "--target=es2020", "--legal-comments=none",
  "--outfile=" + join(work, "bundle.js")], { encoding: "utf8", stdio: ["pipe", "pipe", "pipe"] });
if (log.trim()) console.log(log.trim());

//! The header is the only thing this script adds to the bundle, and it is
//! there so that a copy of this file found on its own says what it is.
const made = readFileSync(join(work, "bundle.js"), "utf8");
const header = "/* The rendering engine, bundled by scripts/build_pathtracer.mjs.\n"
  + Object.entries(PINS).map(([n, v]) => "   " + n + " " + v + " (MIT)").join("\n")
  + "\n   Do not edit: re-run the script. */\n";
writeFileSync(OUT, header + made);

const raw = statSync(OUT).size, packed = gzipSync(readFileSync(OUT), { level: 9 }).length;
console.log("wrote " + OUT + "  " + (raw / 1024).toFixed(0) + " kB  ("
            + (packed / 1024).toFixed(0) + " kB packed)");
