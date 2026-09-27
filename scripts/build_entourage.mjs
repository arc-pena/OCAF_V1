// Builds docs/src/entourage.js — the entourage library, from OBJ files.
//
//     node scripts/build_entourage.mjs <file.obj> [more.obj ...]
//
// WHY A SCRIPT AND NOT FOUR COMMITTED BLOBS. The same reason as
// build_figure.mjs: a mesh in the source with no account of where it came from
// is a mesh nobody can check. This one writes the account into the module it
// generates - which file, how many faces it had, what was done to it - so the
// next person can run it again over the same files and get the same module.
//
// WHERE THESE CAME FROM. They were supplied by the owner of this repository, as
// Rhino OBJ exports, to be used in it. NO LICENCE IS ASSERTED HERE: unlike the
// CC0 figure in figure.js, which carries its dedication in its own header,
// these arrived without one, so what this module can honestly say is who put
// them here and for what. Anybody redistributing this repository should check
// that before shipping them.
//
// WHAT IS DONE TO EACH ONE:
//
//   1. ANCHORED AT THE BOTTOM OF ITS BOUNDING BOX, CENTRED. Every one of these
//      arrived somewhere else in plan - they were laid out in a row in the file
//      they were exported from, and one is 1.8 m from the origin. A figure
//      placed at a point has to arrive AT that point, standing on it, so the
//      anchor is the centre of the bounding box in plan and its bottom in z.
//
//   2. NORMALISED TO A HEIGHT OF EXACTLY ONE, so the driver's height is a
//      multiplication and a figure asked for 1800 measures 1800.00.
//
//   3. DECIMATED BY VERTEX CLUSTERING. 24,000 to 60,000 triangles each is not
//      what a scale figure costs: there are eight racks in the hall and the
//      figure is there to say how big they are. Same method as
//      build_figure.mjs - vertices snapped to a grid and averaged inside each
//      cell - which keeps the silhouette and loses the knuckles.
import { readFileSync, writeFileSync } from "fs";
import { dirname, join, basename } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "src", "entourage.js");
const CELL = Number(process.env.CELL || 0.014);       // 25 mm at 1.8 m
const SCALE = 10000;                                   // fixed point, 1/10000 of height

const files = process.argv.slice(2);
if (!files.length) {
  console.log("give it some OBJ files");
  process.exit(1);
}

/* --------------------------------------------------------------- one file */

function read(path) {
  const text = readFileSync(path, "utf8");
  const points = [];
  const faces = [];
  let name = "";
  for (const line of text.split("\n")) {
    if (line.startsWith("v ")) {
      const t = line.split(/\s+/);
      points.push([Number(t[1]), Number(t[2]), Number(t[3])]);
    } else if (line.startsWith("o ") && !name) {
      name = line.slice(2).trim();
    } else if (line.startsWith("f ")) {
      faces.push(line.trim().split(/\s+/).slice(1)
        .map(one => Number(one.split("/")[0]) - 1));
    }
  }
  return { name: name || basename(path, ".obj"), points, faces };
}

//! ANCHORED AND NORMALISED, in that order, and both off the BOUNDING BOX of the
//! vertices the faces actually use. Taking the extents of the whole vertex list
//! is how a figure ends up standing beside itself - see build_figure.mjs, where
//! an unused helper cage made a 1.8 m person a metre wide.
function settle(model) {
  const used = new Set();
  for (const face of model.faces) for (const i of face) used.add(i);
  const order = [...used].sort((a, b) => a - b);
  const place = new Map(order.map((from, to) => [from, to]));
  const points = order.map(i => model.points[i]);
  const low = [0, 1, 2].map(k => Math.min(...points.map(p => p[k])));
  const high = [0, 1, 2].map(k => Math.max(...points.map(p => p[k])));
  const tall = high[2] - low[2];
  if (!(tall > 0)) throw new Error(model.name + " has no height");
  //! The bottom of the bounding box, centred in plan. That IS the anchor the
  //! node places on, so it is baked in here rather than worked out at run time
  //! by every driver that ever uses one of these.
  const mid = [(low[0] + high[0]) / 2, (low[1] + high[1]) / 2, low[2]];
  let here = points.map(p => [(p[0] - mid[0]) / tall, (p[1] - mid[1]) / tall,
                              (p[2] - mid[2]) / tall]);

  //! AND TURNED TO FACE THE SAME WAY AS EVERY OTHER FIGURE. These arrived
  //! pointing in four different directions - two of the four are side-on to the
  //! others - so a dropdown that swapped one for another swapped which way the
  //! person was looking as well, which is not what a dropdown is for. `turn` on
  //! the node is then the only thing that decides where somebody looks, which
  //! is what it is there for.
  //!
  //! THE AXIS COMES OUT OF THE PLAN BOX. A standing person is wider across the
  //! shoulders than they are front to back, so the long side of the plan box is
  //! the shoulder line - and that is put on X, which leaves the figure facing
  //! along Y. It holds for all four of these, including the one with a leg
  //! stretched out behind it, because the stretch is along the same axis.
  const spanOf = k => {
    const v = here.map(p => p[k]);
    return Math.max(...v) - Math.min(...v);
  };
  let turned = 0;
  if (spanOf(1) > spanOf(0)) {
    here = here.map(p => [p[1], -p[0], p[2]]);
    turned = 90;
  }
  //! AND WHICH WAY ALONG IT, from the feet. Toes reach forward of the ankles
  //! and heels do not reach back as far, so the feet's centre in plan is ahead
  //! of the body's - by a couple of centimetres on a person, which is small but
  //! is the same sign every time. Measured rather than eyeballed, and the
  //! figure it is least sure about is the one leaning on one leg; a figure that
  //! comes out backwards is one `turn` of 180 away from right, which is the
  //! argument that exists for exactly this.
  {
    const feet = here.filter(p => p[2] < 0.12);
    if (feet.length > 20) {
      const mean = list => list.reduce((n, p) => n + p[1], 0) / list.length;
      if (mean(feet) < mean(here)) {
        here = here.map(p => [-p[0], -p[1], p[2]]);
        turned = (turned + 180) % 360;
      }
    }
  }
  return {
    name: model.name,
    faces: model.faces.map(face => face.map(i => place.get(i))),
    points: here,
    turned,
    was: { tall, wide: high[0] - low[0], deep: high[1] - low[1] },
  };
}

//! Vertex clustering. Snap to a grid, average inside each cell, drop the faces
//! that collapse. The cell's AVERAGE and not its centre: snapping to centres
//! quantises the silhouette into steps you can see at this cell size.
function decimate(model, cell) {
  const cells = new Map();
  const of = model.points.map(p => {
    const key = [Math.round(p[0] / cell), Math.round(p[1] / cell),
                 Math.round(p[2] / cell)].join(",");
    let bag = cells.get(key);
    if (!bag) cells.set(key, bag = { sum: [0, 0, 0], n: 0, index: cells.size });
    bag.sum[0] += p[0]; bag.sum[1] += p[1]; bag.sum[2] += p[2];
    bag.n++;
    return bag;
  });
  const moved = [...cells.values()].map(one => one.sum.map(v => v / one.n));
  const seen = new Set();
  const kept = [];
  for (const face of model.faces) {
    const to = [];
    for (const i of face) {
      const at = of[i].index;
      if (to.length && to[to.length - 1] === at) continue;
      to.push(at);
    }
    while (to.length > 1 && to[0] === to[to.length - 1]) to.pop();
    if (to.length < 3) continue;
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
  const points = order.map(i => moved[i]);
  //! AND STRETCHED BACK TO EXACTLY ONE. Averaging inside a cell pulls the
  //! topmost vertex down - the scalp's cell has vertices below it - so a figure
  //! asked for 1800 would come out 1793 and look perfectly fine. Re-anchored
  //! too, for the same reason and in the same place: the bottom of the
  //! bounding box, centred in plan.
  const low = [0, 1, 2].map(k => Math.min(...points.map(p => p[k])));
  const high = [0, 1, 2].map(k => Math.max(...points.map(p => p[k])));
  const span = high[2] - low[2];
  const mid = [(low[0] + high[0]) / 2, (low[1] + high[1]) / 2, low[2]];
  return {
    points: points.map(p => [(p[0] - mid[0]) / span, (p[1] - mid[1]) / span,
                             (p[2] - mid[2]) / span]),
    faces: kept.map(face => face.map(i => place.get(i))),
  };
}

/* ------------------------------------------------------------- every file */

const KEY = name => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const TITLE = name => name.charAt(0).toUpperCase() + name.slice(1);

const made = [];
for (const path of files) {
  const raw = read(path);
  const settled = settle(raw);
  if (settled.turned) console.log("  (turned " + settled.turned
    + "\u00b0 so it faces +Y like the rest)");
  const small = decimate(settled, CELL);
  const z = small.points.map(p => p[2]);
  const x = small.points.map(p => p[0]), y = small.points.map(p => p[1]);
  made.push({
    key: KEY(raw.name), name: TITLE(raw.name), file: basename(path),
    was: raw.faces.length, points: small.points, faces: small.faces,
    wide: Math.max(...x) - Math.min(...x), deep: Math.max(...y) - Math.min(...y),
    tall: Math.max(...z) - Math.min(...z),
  });
  const one = made[made.length - 1];
  console.log(one.name.padEnd(22) + raw.faces.length.toString().padStart(7) + " -> "
    + one.faces.length.toString().padStart(6) + " faces, "
    + one.points.length.toString().padStart(6) + " vertices  · at 1800 mm: "
    + (one.wide * 1800).toFixed(0) + " × " + (one.deep * 1800).toFixed(0)
    + " × " + (one.tall * 1800).toFixed(0) + " mm");
}

/* ------------------------------------------------------------ write it out */

const packed = made.map(one => {
  const coords = one.points.flatMap(p => p.map(v => Math.round(v * SCALE))).join(" ");
  const facing = one.faces.flatMap(face => [face.length, ...face]).join(" ");
  return `  { key: ${JSON.stringify(one.key)}, name: ${JSON.stringify(one.name)},
    from: ${JSON.stringify("Rhino OBJ supplied for this repository, \u201c" + one.name
      + "\u201d \u00b7 " + one.was.toLocaleString() + " triangles decimated to "
      + one.faces.length.toLocaleString() + " \u00b7 no licence asserted")},
    points: "${coords}",
    faces: "${facing}" },`;
}).join("\n");

const source = `// The entourage library.
//
// A hall drawn without people in it is a picture of a rack, not of a room: there
// is nothing in the frame to measure a 2.1 m frame or a 1.2 m aisle against, and
// a corridor reads the same whether it is 900 mm wide or 1800. So this module
// carries the figures, and everything else about one - where it stands, which
// way it faces, how tall it is - is a parameter on the node that places it.
//
// WHERE THESE CAME FROM, because a mesh with no provenance is a mesh nobody can
// check. They were supplied by the owner of this repository as Rhino OBJ
// exports, to be used in it. NO LICENCE IS ASSERTED: the CC0 figure in
// figure.js carries its dedication in its own header and can be shown to be
// free; these arrived without one, so what can honestly be said is who put them
// here and what for. Anybody redistributing this repository should settle that
// before shipping them.
//
// HOW THEY WERE PREPARED. \\c scripts/build_entourage.mjs, which is how to do it
// again. Each one is anchored at the BOTTOM OF ITS BOUNDING BOX, CENTRED IN
// PLAN - they were laid out in a row in the file they came from and one of them
// was 1.8 m from the origin, so a figure placed at a point has to be brought to
// that point first - then normalised to a height of exactly one, then decimated
// by vertex clustering on a ${(CELL * 1800).toFixed(0)} mm grid at 1.8 m.
//
// THE UNIT HEIGHT IS THE POINT OF IT. A scale figure whose height is 1793 mm
// when 1800 was asked for is not a scale reference, it is a decoration. The
// normalising happens here, in the source, and the driver multiplies.

//! Each figure as two strings of integers: the coordinates in ten-thousandths
//! of its height, and the faces packed [sides, i, j, ...]. Strings because this
//! is tens of thousands of numbers and neither an array literal nor a string of
//! one is readable - what is readable is the paragraph above.
export const ENTOURAGE = [
${packed}
];

export const entourage = key =>
  ENTOURAGE.find(one => one.key === key) || ENTOURAGE[0];

//! Every figure's name, in the order the list is in - which is the order a
//! choice argument stores, so the two must not drift apart.
export const ENTOURAGE_NAMES = ENTOURAGE.map(one => one.name);

//! Unpacked once per figure on first ask and kept. Parsing a couple of hundred
//! thousand characters is a few milliseconds and a figure is placed more than
//! once in a hall, so it is not a few milliseconds each time.
const unpacked = new Map();
export function entourageMesh(key) {
  const one = entourage(key);
  const had = unpacked.get(one.key);
  if (had) return had;
  const numbers = one.points.split(" ");
  const points = [];
  for (let i = 0; i < numbers.length; i += 3)
    points.push([Number(numbers[i]) / ${SCALE}, Number(numbers[i + 1]) / ${SCALE},
                 Number(numbers[i + 2]) / ${SCALE}]);
  const packed = one.faces.split(" ").map(Number);
  const faces = [];
  for (let i = 0; i < packed.length; ) {
    const sides = packed[i++];
    faces.push(packed.slice(i, i + sides));
    i += sides;
  }
  const mesh = { points, faces };
  unpacked.set(one.key, mesh);
  return mesh;
}

//! ONE FIGURE, AT A HEIGHT, IN A FRAME. \\p origin is where it stands - the
//! bottom of its bounding box, centred in plan, which is what was baked in - and
//! the three directions are the frame it stands in. One multiplication per
//! coordinate, which is the whole of what normalising in the source bought.
export function entourageAt(key, height, origin, x, y, z) {
  const mesh = entourageMesh(key);
  return {
    points: mesh.points.map(p => {
      const u = p[0] * height, v = p[1] * height, w = p[2] * height;
      return [origin[0] + x[0] * u + y[0] * v + z[0] * w,
              origin[1] + x[1] * u + y[1] * v + z[1] * w,
              origin[2] + x[2] * u + y[2] * v + z[2] * w];
    }),
    faces: mesh.faces.map(face => face.slice()),
  };
}
`;

writeFileSync(OUT, source);
console.log("\nwrote " + OUT + "  " + (source.length / 1024).toFixed(0) + " kB  ("
  + made.length + " figures)");
