// Builds docs/src/figure.js — the scale figure's mesh, from a CC0 source.
//
//     node scripts/build_figure.mjs [path/to/base.obj]
//
// WHY A SCRIPT AND NOT A COMMITTED BLOB. A mesh in the source with no account
// of where it came from is a mesh nobody may ship. This one has an account: it
// is the MakeHuman hm08 base mesh, which its copyright holders released as CC0
// in September 2020 - the statement is in the header of the file itself, and it
// is reproduced in the module this writes. Run this script and you get the same
// module back, from the same source, which is what makes the provenance
// checkable rather than asserted.
//
// WHAT IT DOES TO IT, and why each step is needed:
//
//   1. KEEPS ONLY `g body`. The hm08 file is a modelling rig as well as a
//      figure: `helper-tights` is the cage MakeHuman fits clothes to and the
//      172 `joint-*` groups are little octahedra marking the skeleton. All of
//      them are inside or around the body, so a naive read gives a lumpy blob
//      with boxes in it and extents 990 mm wide for a figure 1.8 m tall.
//
//   2. DECIMATES BY VERTEX CLUSTERING. 13,380 quads is not what a scale figure
//      in a data hall should cost - there are six racks in the scene and the
//      figure is there to say how big they are. Vertices are snapped to a grid
//      and averaged inside each cell, which keeps the silhouette and loses the
//      knuckles. Quadric edge collapse would keep more shape per face; it is
//      also several hundred lines, and at this size the difference is not
//      visible at a scale figure's distance.
//
//   3. NORMALISES TO UNIT HEIGHT, Z UP. MakeHuman is Y-up in decimetres; this
//      program is Z-up in millimetres. The mesh is written with its height
//      exactly 1, its feet on z = 0 and its centre of area on the z axis, so
//      the driver's height argument is a multiplication and nothing else - a
//      figure asked for 1800 mm is 1800.00 mm tall.
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "src", "figure.js");
const SRC = process.argv[2] || "/tmp/claude-0/base.obj";

//! The cell, in units of the figure's height. 0.014 of 1.8 m is 25 mm, picked
//! off the table this prints rather than by taste: it is the coarsest grid at
//! which the figure still has a neck, and at 25 mm a facet on a 1.8 m person
//! standing beside a 2.1 m rack is smaller than the rack's own hole pitch.
const CELL = Number(process.env.CELL || 0.014);

/* ------------------------------------------------- 1. read, keeping the body */

const text = readFileSync(SRC, "utf8");
const points = [];
const faces = [];
//! THE SKELETON MARKERS ARE KEPT, as a map from joint name to the centroid of
//! the little octahedron that marks it. They are not geometry - they are thrown
//! away with the rest of the rig - but they are the file's own statement of
//! where the shoulder is, which is exactly what posing the arms needs and what
//! would otherwise have to be guessed from the silhouette.
const joints = new Map();
let group = "";
for (const line of text.split("\n")) {
  if (line.startsWith("v ")) {
    const [, x, y, z] = line.split(/\s+/);
    points.push([Number(x), Number(y), Number(z)]);
  } else if (line.startsWith("g ")) {
    group = line.slice(2).trim();
  } else if (line.startsWith("f ")) {
    const face = line.trim().split(/\s+/).slice(1)
      //! v/vt, so the vertex index is what is before the slash. 1-based in OBJ.
      .map(one => Number(one.split("/")[0]) - 1);
    if (group === "body") faces.push(face);
    else if (group.startsWith("joint-")) {
      let bag = joints.get(group);
      if (!bag) joints.set(group, bag = new Set());
      for (const i of face) bag.add(i);
    }
  }
}
const jointAt = name => {
  const bag = joints.get(name);
  if (!bag) return null;
  const list = [...bag];
  return [0, 1, 2].map(k => list.reduce((s, i) => s + points[i][k], 0) / list.length);
};
if (!faces.length) {
  console.log("no `g body` faces in " + SRC + " - is this the hm08 base mesh?");
  process.exit(1);
}
console.log("read " + points.length + " vertices, " + faces.length
  + " faces in `g body` (of the whole file)");

/* ------------------------------------------------------- 1b. arms, brought down

   The hm08 base mesh stands in an A-pose - arms out and down at about 45 - and
   measured at 1.8 m tall that figure is 1072 mm across. A scale figure is there
   to say how wide a corridor is, and one that is itself a metre wide says the
   wrong thing: it reads as a person with their arms out, and every aisle behind
   it looks narrower than it is. So the arms come down before anything else
   happens, on the full-resolution mesh, where there is enough geometry left for
   the shoulder to bend without creasing.

   WHERE THE SHOULDER IS COMES OUT OF THE FILE. The 172 joint-* groups are the
   rig's own markers, and the centroid of joint-l-shoulder IS the left shoulder.
   Guessing it from the silhouette is what makes a posed mesh look dislocated;
   this is the file saying where to bend.                                     */

//! MakeHuman's own frame, before anything is turned: +X to the figure's left,
//! +Y up, +Z forward. Everything in this step is in that frame; the turn into
//! this program's Z-up happens afterwards, in step 2.
const ARM_OUT = Number(process.env.ARM_OUT || 7);    // degrees off vertical, kept
const ARM_R = Number(process.env.ARM_R || 1.4);      // the capsule's radius, measured
for (const side of ["l", "r"]) {
  const shoulder = jointAt("joint-" + side + "-shoulder");
  const hand = jointAt("joint-" + side + "-hand");
  if (!shoulder || !hand) {
    console.log("no " + side + " shoulder/hand marker - the arms are left as they are");
    continue;
  }
  const elbow = jointAt("joint-" + side + "-elbow") || hand;
  const sign = side === "l" ? 1 : -1;
  //! WHICH VERTICES ARE THE ARM, and this is the part that has to be right.
  //! "Further out in x than the shoulder" is the obvious test and it is wrong:
  //! the hip and the whole leg on that side are further out than the shoulder
  //! too, so the first attempt swung each leg out sideways - and then the second
  //! side's pass caught the first side's swung leg and threw it across the
  //! figure, which is how a 1.8 m person came out 1033 mm wide with a foot where
  //! its shoulder should be.
  //!
  //! A CAPSULE ABOUT THE SHOULDER-TO-HAND CHORD fixes the legs and leaves the
  //! hand behind: the arm BENDS at the elbow, so the hand sits 1.7 units off
  //! that chord and a capsule wide enough to reach it is wide enough to reach
  //! the chest. Measured: the figure came out 815 mm across with its hands
  //! still out. So the region follows the RIG - shoulder to elbow to hand, and
  //! half a hand further for the fingers, which the wrist marker is not at the
  //! end of - and distance is to that polyline. A leg is nowhere near it
  //! whatever its x is, and neither is the chest.
  const bones = [shoulder, elbow, hand,
                 [hand[0] + (hand[0] - elbow[0]) * 0.55,
                  hand[1] + (hand[1] - elbow[1]) * 0.55,
                  hand[2] + (hand[2] - elbow[2]) * 0.55]];
  const legs = [];
  for (let i = 0; i + 1 < bones.length; i++) {
    const d = [0, 1, 2].map(k => bones[i + 1][k] - bones[i][k]);
    legs.push({ at: bones[i], d, len2: d[0] * d[0] + d[1] * d[1] + d[2] * d[2],
                before: legs.length ? legs[legs.length - 1].before
                                    + Math.sqrt(legs[legs.length - 1].len2) : 0 });
  }
  const reach = legs.reduce((s, one) => s + Math.sqrt(one.len2), 0);
  //! How far down the arm the nearest point of the arm is, and how far off it -
  //! the two numbers the two falloffs are over.
  const nearest = p => {
    let best = { off: Infinity, along: 0 };
    for (const bone of legs) {
      const from = [p[0] - bone.at[0], p[1] - bone.at[1], p[2] - bone.at[2]];
      let t = (from[0] * bone.d[0] + from[1] * bone.d[1] + from[2] * bone.d[2]) / bone.len2;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const off = Math.hypot(from[0] - bone.d[0] * t, from[1] - bone.d[1] * t,
                             from[2] - bone.d[2] * t);
      if (off < best.off) best = { off, along: bone.before + t * Math.sqrt(bone.len2) };
    }
    return best;
  };
  //! WHERE THE ARM IS TO POINT, in three dimensions and not two. The first
  //! version turned the arm in the coronal plane only and left every z alone,
  //! which brings the hands down in FRONT of the thighs rather than beside
  //! them: the hand marker is 1.76 forward of the shoulder and the fingers
  //! reach 3.21, so the figure came out 457 mm deep with its hands held out.
  //! One rotation, about the axis that takes the arm's own direction to the one
  //! wanted, does both at once - and is also the only way the elbow keeps its
  //! shape, because two successive rotations in named planes shear it.
  const straight = Math.hypot(hand[0] - shoulder[0], hand[1] - shoulder[1],
                              hand[2] - shoulder[2]);
  const facing = [(hand[0] - shoulder[0]) / straight, (hand[1] - shoulder[1]) / straight,
                  (hand[2] - shoulder[2]) / straight];
  //! Down; a few degrees out, so the arm clears the hip; and a touch forward,
  //! so it hangs the way an arm hangs rather than pinned back like a soldier's.
  const outward = Math.sin(ARM_OUT * Math.PI / 180);
  const downward = Math.cos(ARM_OUT * Math.PI / 180);
  const wanted = (one => one.map(k => k / Math.hypot(...one)))([sign * outward, -downward, 0.10]);
  const across = [facing[1] * wanted[2] - facing[2] * wanted[1],
                  facing[2] * wanted[0] - facing[0] * wanted[2],
                  facing[0] * wanted[1] - facing[1] * wanted[0]];
  const sine = Math.hypot(across[0], across[1], across[2]);
  const cosine = facing[0] * wanted[0] + facing[1] * wanted[1] + facing[2] * wanted[2];
  //! The axis to turn about, and how far. Degenerate only if the arm already
  //! points where it is wanted, in which case the angle is nothing anyway.
  const spin = sine > 1e-9 ? across.map(one => one / sine) : [0, 0, 1];
  const by = Math.atan2(sine, cosine);
  //! THE BLEND, and it is what stops the shoulder creasing. Two falloffs, not
  //! one: along the arm, so the deltoid stretches over the bend rather than
  //! shearing along one ring of vertices; and across it, so what is just inside
  //! the capsule is let go of rather than dragged. Either one on its own leaves
  //! a crease somebody can see.
  const ramp = reach * 0.30;
  const soft = t => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
  let moved = 0;
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const near = nearest(p);
    if (near.off >= ARM_R) continue;
    const k = soft(near.along / ramp) * soft((ARM_R - near.off) / (ARM_R * 0.3));
    if (k <= 1e-6) continue;
    //! Rodrigues, about the shoulder: the same rotation every vertex of the arm
    //! gets, by as much of it as this vertex is entitled to.
    const a = by * k, c = Math.cos(a), s = Math.sin(a);
    const v = [p[0] - shoulder[0], p[1] - shoulder[1], p[2] - shoulder[2]];
    const dot = spin[0] * v[0] + spin[1] * v[1] + spin[2] * v[2];
    const turn = [spin[1] * v[2] - spin[2] * v[1], spin[2] * v[0] - spin[0] * v[2],
                  spin[0] * v[1] - spin[1] * v[0]];
    points[i] = [0, 1, 2].map(axis => shoulder[axis] + v[axis] * c + turn[axis] * s
                                    + spin[axis] * dot * (1 - c));
    moved++;
  }
  console.log(side + " arm: shoulder at " + shoulder.map(n => n.toFixed(2)).join(", ")
    + " \u00b7 reach " + reach.toFixed(2) + " \u00b7 turned "
    + (by * 180 / Math.PI).toFixed(1) + "\u00b0 \u00b7 " + moved + " vertices");
}

if (process.env.DEBUG_POSE) {
  const b = new Set(); for (const f of faces) for (const i of f) b.add(i);
  const l = [...b];
  const ex = k => [Math.min(...l.map(i => points[i][k])), Math.max(...l.map(i => points[i][k]))];
  console.log("DEBUG body x " + ex(0).map(n => n.toFixed(2)).join("..")
    + " y " + ex(1).map(n => n.toFixed(2)).join("..")
    + " z " + ex(2).map(n => n.toFixed(2)).join(".."));
  const w = l.reduce((a, i) => points[i][0] > points[a][0] ? i : a, l[0]);
  console.log("DEBUG widest " + points[w].map(n => n.toFixed(2)).join(", "));
}

/* ------------------------------------------- 2. normalise: unit height, Z up */

//! Only the vertices the body uses. The helper cage's vertices are in the same
//! list, and taking the extents of the whole list is how a 1.8 m figure comes
//! out 0.99 m wide.
const used = new Set();
for (const face of faces) for (const i of face) used.add(i);
const mine = [...used].sort((a, b) => a - b);
const where = new Map(mine.map((from, to) => [from, to]));

//! MakeHuman: +Y up, +Z forward, +X to the figure's left. Here: +Z up, and the
//! figure faces +Y, so it stands the way a rack does and "turn" works on it.
const turned = mine.map(i => { const [x, y, z] = points[i]; return [x, z, y]; });
const lo = [0, 1, 2].map(k => Math.min(...turned.map(p => p[k])));
const hi = [0, 1, 2].map(k => Math.max(...turned.map(p => p[k])));
const tall = hi[2] - lo[2];
const mid = [0, 1].map(k => (lo[k] + hi[k]) / 2);
const unit = turned.map(([x, y, z]) => [(x - mid[0]) / tall, (y - mid[1]) / tall,
                                        (z - lo[2]) / tall]);
console.log("body " + [0, 1, 2].map(k => ((hi[k] - lo[k]) / tall).toFixed(3)).join(" × ")
  + " of its own height  (at 1800 mm: "
  + [0, 1, 2].map(k => ((hi[k] - lo[k]) / tall * 1800).toFixed(0)).join(" × ") + " mm)");

const body = faces.map(face => face.map(i => where.get(i)));

/* ------------------------------------------------ 3. decimate by clustering */

function decimate(cell) {
  const key = p => [Math.round(p[0] / cell), Math.round(p[1] / cell),
                    Math.round(p[2] / cell)].join(",");
  //! The cell's AVERAGE and not its centre. Snapping to centres quantises the
  //! silhouette into visible steps at this cell size; averaging keeps the
  //! surface where the surface was and only loses the detail below the cell.
  const cells = new Map();
  const of = unit.map(p => {
    const k = key(p);
    let cluster = cells.get(k);
    if (!cluster) cells.set(k, cluster = { sum: [0, 0, 0], n: 0, index: cells.size });
    cluster.sum[0] += p[0]; cluster.sum[1] += p[1]; cluster.sum[2] += p[2];
    cluster.n++;
    return cluster;
  });
  const out = [...cells.values()].map(c => c.sum.map(s => s / c.n));
  const seen = new Set();
  const kept = [];
  for (const face of body) {
    //! Consecutive duplicates collapse - that is what an edge shorter than the
    //! cell becomes - and a face left with fewer than three corners is gone.
    const to = [];
    for (const i of face) {
      const at = of[i].index;
      if (to.length && to[to.length - 1] === at) continue;
      to.push(at);
    }
    while (to.length > 1 && to[0] === to[to.length - 1]) to.pop();
    if (to.length < 3) continue;
    //! And two faces that have collapsed onto the same corners are one face.
    const id = [...to].sort((a, b) => a - b).join(",");
    if (seen.has(id)) continue;
    seen.add(id);
    kept.push(to);
  }
  //! Vertices no face reaches any more are dropped, or checkMesh counts them.
  const live = new Set();
  for (const face of kept) for (const i of face) live.add(i);
  const order = [...live].sort((a, b) => a - b);
  const place = new Map(order.map((from, to) => [from, to]));
  return { points: order.map(i => out[i]),
           faces: kept.map(face => face.map(i => place.get(i))) };
}

console.log("\n  cell   at 1800 mm   vertices   faces");
for (const cell of [0.006, 0.008, 0.011, 0.014, 0.02]) {
  const got = decimate(cell);
  console.log("  " + cell.toFixed(3) + "   " + (cell * 1800).toFixed(1).padStart(7)
    + " mm   " + String(got.points.length).padStart(7) + "   "
    + String(got.faces.length).padStart(5) + (cell === CELL ? "   <- chosen" : ""));
}

const mesh = decimate(CELL);
//! The height is checked AFTER decimating, because averaging inside a cell
//! pulls the topmost vertex down: the scalp's cell has vertices below it. So
//! the mesh is stretched back to exactly 1 and that is what is written, which
//! is what lets the driver's height be a multiplication.
{
  const z = mesh.points.map(p => p[2]);
  const low = Math.min(...z), high = Math.max(...z);
  const span = high - low;
  const x = mesh.points.map(p => p[0]), y = mesh.points.map(p => p[1]);
  const cx = (Math.min(...x) + Math.max(...x)) / 2;
  const cy = (Math.min(...y) + Math.max(...y)) / 2;
  mesh.points = mesh.points.map(([px, py, pz]) =>
    [(px - cx) / span, (py - cy) / span, (pz - low) / span]);
}

/* ---------------------------------------------------------- 4. write it out */

//! FIXED POINT, four places of a unit height - a quarter of a millimetre at
//! 1.8 m, which is finer than the cell it was decimated on by a factor of
//! eighty. Written as one string of integers rather than as a nested array
//! literal because it is a third of the size and neither is readable: what is
//! readable is the module's header, which says what this is and where it is
//! from.
const SCALE = 10000;
const coords = mesh.points.flatMap(p => p.map(v => Math.round(v * SCALE))).join(" ");
const facing = mesh.faces.flatMap(face => [face.length, ...face]).join(" ");

const source = `// The scale figure's mesh.
//
// A data hall drawn without a person in it is a picture of a rack, not of a
// room. The eye has nothing to measure a 2.1 m frame against, and a corridor
// between two rows reads the same whether it is 900 mm wide or 1800. So this
// module carries one human figure, and everything else about the scale figure
// - where it stands, which way it faces, how tall it is - is a parameter on the
// node that places it.
//
// WHERE IT IS FROM, because a mesh with no provenance is a mesh nobody may
// ship. It is the MakeHuman hm08 base mesh, whose copyright holders released it
// as CC0 in September 2020. Their own statement, from the head of the file:
//
//     This asset was explicitly released as CC0 in september 2020.
//     Copyright (C) 2020 Data Collection AB, https://www.datacollection.se
//     Copyright (C) 2020 Joel Palmius
//     Copyright (C) 2020 Jonas Hauquier
//
// CC0 is a dedication to the public domain: it may be used for anything, with
// no attribution required. The attribution is here anyway, because somebody
// reading this file should be able to check the claim rather than take it.
//
// WHAT WAS DONE TO IT. \\c scripts/build_figure.mjs, which is how to do it
// again: the body group taken on its own (the file also carries the clothes-
// fitting cage and 172 skeleton markers, all of them inside the silhouette),
// decimated from ${faces.length} quads to ${mesh.faces.length} faces by vertex clustering on a
// ${(CELL * 1800).toFixed(1)} mm grid, and normalised to stand on z = 0 with its height exactly 1.
//
// THE UNIT HEIGHT IS THE POINT OF IT. A scale figure whose height is 1795 mm
// when 1800 was asked for is not a scale reference, it is a decoration. So the
// mesh is normalised here, in the source, and the driver multiplies: ask for
// 1800 and the figure measures 1800.00 mm from the floor to the top of its
// head. \\ref FIGURE_HEIGHT is that height, and the test measures it.
//
// A FIGURE FACES +Y, standing the way a rack faces, so the node's Turn reads
// the same way round on both and a figure looking at a rack is turned 180.

//! The mesh, as two strings of integers: the coordinates in ten-thousandths of
//! the figure's height, and the faces packed [sides, i, j, ...] the way the
//! kernel packs them. Strings because this is ${mesh.points.length} vertices and ${mesh.faces.length} faces
//! and neither an array literal nor a string of it is readable - what is
//! readable is the paragraph above.
const FIGURE_POINTS = "${coords}";
const FIGURE_FACES = "${facing}";

//! How tall the mesh is in its own units - exactly one, by construction, and
//! stated rather than assumed because the driver divides by nothing else.
export const FIGURE_HEIGHT = 1;

//! Where it came from, in one line, so a node's own description can carry it
//! on screen without this comment having to be read.
export const FIGURE_FROM =
  "MakeHuman hm08 base mesh, released CC0 by its copyright holders in 2020, "
  + "decimated to ${mesh.faces.length} faces";

//! The mesh itself, unpacked once on first ask and kept. Parsing ${coords.length} characters
//! is a millisecond and a scale figure is placed more than once in a hall, so
//! it is not a millisecond each time.
let unpacked = null;
export function figureMesh() {
  if (unpacked) return unpacked;
  const numbers = FIGURE_POINTS.split(" ");
  const points = [];
  for (let i = 0; i < numbers.length; i += 3)
    points.push([Number(numbers[i]) / ${SCALE}, Number(numbers[i + 1]) / ${SCALE},
                 Number(numbers[i + 2]) / ${SCALE}]);
  const packed = FIGURE_FACES.split(" ").map(Number);
  const faces = [];
  for (let i = 0; i < packed.length; ) {
    const sides = packed[i++];
    faces.push(packed.slice(i, i + sides));
    i += sides;
  }
  unpacked = { points, faces };
  return unpacked;
}

//! The figure at a height, in a frame: \\p origin is where its feet go, and the
//! three directions are the frame it stands in. One multiplication per
//! coordinate, which is the whole of what normalising in the source bought.
export function figureAt(height, origin, x, y, z) {
  const mesh = figureMesh();
  const k = height / FIGURE_HEIGHT;
  return {
    points: mesh.points.map(p => {
      const u = p[0] * k, v = p[1] * k, w = p[2] * k;
      return [origin[0] + x[0] * u + y[0] * v + z[0] * w,
              origin[1] + x[1] * u + y[1] * v + z[1] * w,
              origin[2] + x[2] * u + y[2] * v + z[2] * w];
    }),
    faces: mesh.faces.map(face => face.slice()),
  };
}
`;

writeFileSync(OUT, source);
console.log("\nwrote " + OUT + "  " + (source.length / 1024).toFixed(1) + " kB  ("
  + mesh.points.length + " vertices, " + mesh.faces.length + " faces)");
