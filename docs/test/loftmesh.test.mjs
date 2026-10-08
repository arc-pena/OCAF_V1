// Cages built from curves: the loft and the sweep.
//
// EVERY SECTION HERE IS ONE OF THE THREE WAYS THIS GOES WRONG, because all
// three produce a mesh that draws perfectly and is the wrong shape. Sampled by
// parameter instead of by length a cage has quads four times their neighbours'
// size; sections lined up by index have a wrap in them; a frame built from the
// second derivative flips over at an inflection and puts half a turn in the
// middle of a sweep. None of those throw.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { topologyOf, faceNormal, pmSub, pmLen, pmDot, pmUnit, pmMid } from "../src/polymesh.js";
import { evenRing, alignSections, transportFrames, sweepCage, loftThrough, sectionPlane }
  from "../src/loftmesh.js";
import { readFileSync } from "fs";

const WASM_DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const initModule = (await import(WASM_DIR + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const circle = (r, z, turn = 0, n = 64) => Array.from({ length: n }, (_, i) => {
  const a = turn + 2 * Math.PI * i / n;
  return [r * Math.cos(a), r * Math.sin(a), z];
});
const edgesOf = mesh => {
  const topo = topologyOf(mesh);
  let open = 0, over = 0;
  for (const [, e] of topo.edges) {
    if (e.faces.length === 1) open++; else if (e.faces.length > 2) over++;
  }
  return { open, over };
};

console.log("1. evenly along the length, not evenly through the parameter");
{
  //! A line whose points are at t^3: walked by index they bunch at one end by
  //! a factor of forty. Walked by arc length every step is the same.
  const bunched = [];
  for (let i = 0; i <= 40; i++) bunched.push([Math.pow(i / 40, 3) * 100, 0, 0]);
  const got = evenRing(bunched, 11, false);
  const gaps = [];
  for (let i = 1; i < got.length; i++) gaps.push(pmLen(pmSub(got[i], got[i - 1])));
  check("eleven points on a cubed-parameter line step evenly",
        Math.max(...gaps) - Math.min(...gaps) < 1e-9,
        gaps[0].toFixed(4) + " .. " + Math.max(...gaps).toFixed(4) + " (even is 10)");
  check("and it keeps both ends", pmLen(pmSub(got[0], bunched[0])) < 1e-9
        && pmLen(pmSub(got[10], bunched[40])) < 1e-9);
  //! A closed loop spreads its points round the whole thing and does NOT put
  //! one on top of the first - a repeated vertex is a zero-length edge, which
  //! sews into a degenerate face and is only ever noticed much later.
  const loop = evenRing(circle(100, 0), 12, true);
  check("a closed ring does not repeat its first point",
        loop.length === 12 && pmLen(pmSub(loop[0], loop[11])) > 1,
        "first to last " + pmLen(pmSub(loop[0], loop[11])).toFixed(3));
}

console.log("2. sections lined up, so the loft has no wrap in it");
{
  //! Two identical circles, the second starting a third of a turn round. Lofted
  //! index to index that is a 120 degree wrap; the along-edges would come out
  //! at sqrt(200^2 + 173^2) = 265 instead of 200.
  const cage = loftThrough([circle(100, 0), circle(100, 200, 2 * Math.PI / 3)], { around: 16 });
  let longest = 0;
  for (const f of cage.faces) {
    const p = f.map(i => cage.points[i]);
    for (let i = 0; i < 4; i++) longest = Math.max(longest, pmLen(pmSub(p[i], p[(i + 1) % 4])));
  }
  //! EXACTLY 200: whole-index rotation leaves 120 modulo 22.5 degrees, which at
  //! radius 100 is a 13 mm shear and gives 200.427. The phase search takes it
  //! out, so this is the check that the refinement is doing anything.
  //! Under a thousandth of a millimetre. Without the phase search it is
  //! 200.427 - the bound is four hundred times tighter than the fault it is
  //! there to catch, and no tighter than the bisection can actually hold.
  check("a prism from circles a third out of phase is not skewed",
        Math.abs(longest - 200) < 1e-3,
        "longest edge " + longest.toFixed(9) + ", asked 200 (unfixed: 200.427)");
  check("and it is a surface", edgesOf(cage).over === 0);

  //! A section given BACKWARDS is turned round rather than lofted into a
  //! pinched hourglass - which is what index-to-index does with it.
  const back = circle(100, 200).slice().reverse();
  const flipped = loftThrough([circle(100, 0), back], { around: 16 });
  let worst = 0;
  for (const f of flipped.faces) {
    const p = f.map(i => flipped.points[i]);
    for (let i = 0; i < 4; i++) worst = Math.max(worst, pmLen(pmSub(p[i], p[(i + 1) % 4])));
  }
  check("and a section given backwards is turned round, not pinched",
        Math.abs(worst - 200) < 1e-3, "longest edge " + worst.toFixed(9));
}

console.log("3. a frame that does not flip at an inflection");
{
  //! An S in the xz plane. Its curvature changes sign in the middle, which is
  //! exactly where a Frenet frame turns over.
  const path = [];
  for (let i = 0; i <= 60; i++)
    path.push([i / 60 * 600, 0, Math.sin(i / 60 * 2 * Math.PI) * 120]);
  const tangents = path.map((p, i) =>
    pmUnit(pmSub(path[Math.min(60, i + 1)], path[Math.max(0, i - 1)])));
  const frames = transportFrames(path, tangents);
  let turn = 0, square = 0;
  for (let i = 0; i < frames.length; i++) {
    square = Math.max(square, Math.abs(pmDot(frames[i].r, frames[i].t)));
    if (i) turn = Math.max(turn, Math.acos(Math.max(-1, Math.min(1,
      pmDot(frames[i].r, frames[i - 1].r)))) * 180 / Math.PI);
  }
  check("the reference direction never jumps", turn < 20, "worst step " + turn.toFixed(3) + "°");
  check("and stays square to the path", square < 1e-12, "worst r·t " + square.toExponential(2));

  //! And the sweep that rides on it: every station's ring is still a circle of
  //! the radius asked for, about the path. A flipped frame does not change the
  //! radius - it turns the section over - so this is checked separately below.
  const tube = sweepCage(circle(40, 0), path, { around: 12, along: 20 });
  let lo = Infinity, hi = 0;
  for (let k = 0; (k + 1) * 12 <= tube.points.length; k++) {
    const ring = tube.points.slice(k * 12, k * 12 + 12);
    const mid = pmMid(ring);
    for (const p of ring) { const r = pmLen(pmSub(p, mid)); lo = Math.min(lo, r); hi = Math.max(hi, r); }
  }
  check("the swept tube keeps its radius", hi - lo < 0.1 && Math.abs(hi - 40) < 0.1,
        lo.toFixed(4) + " .. " + hi.toFixed(4) + ", asked 40");
  check("and is a surface with the right face count",
        tube.faces.length === 12 * 20 && edgesOf(tube).over === 0,
        tube.faces.length + " faces");

  //! THE FLIP ITSELF. Follow one marked point of the section down the run: with
  //! a frame that is carried forward it drifts smoothly, and with one that
  //! turns over it jumps to the far side in a single step.
  let jump = 0;
  for (let k = 1; (k + 1) * 12 <= tube.points.length; k++) {
    const a = tube.points[(k - 1) * 12], b = tube.points[k * 12];
    const ringA = tube.points.slice((k - 1) * 12, k * 12);
    const ringB = tube.points.slice(k * 12, k * 12 + 12);
    const da = pmUnit(pmSub(a, pmMid(ringA))), db = pmUnit(pmSub(b, pmMid(ringB)));
    jump = Math.max(jump, Math.acos(Math.max(-1, Math.min(1, pmDot(da, db)))) * 180 / Math.PI);
  }
  check("and the section does not turn over between stations", jump < 25,
        "worst " + jump.toFixed(2) + "° (a flip is ~180°)");
}

console.log("4. closed runs and caps");
{
  const ring = circle(300, 0, 0, 48);
  const torus = sweepCage(circle(60, 0), ring, { around: 10, along: 16, closedPath: true });
  const shut = edgesOf(torus);
  check("a sweep round a closed path closes", shut.open === 0 && shut.over === 0,
        torus.faces.length + " faces");
  const capped = sweepCage(circle(60, 0), [[0, 0, 0], [0, 0, 400]],
                           { around: 10, along: 4, caps: true });
  const sealed = edgesOf(capped);
  check("and a capped straight sweep closes too", sealed.open === 0 && sealed.over === 0,
        capped.faces.length + " faces");
  //! CONSISTENTLY WOUND, which the caps are the only chance to get wrong: a cap
  //! wound the same way as the tube is a cap facing inwards, and nothing about
  //! the face count or the edge count says so.
  let clash = 0;
  const seen = new Set();
  for (const f of capped.faces) for (let i = 0; i < f.length; i++) {
    const k = f[i] + ">" + f[(i + 1) % f.length];
    if (seen.has(k)) clash++; else seen.add(k);
  }
  check("every face is wound the same way round as its neighbour", clash === 0,
        clash + " clashes");
}

console.log("5. twist and taper, which are why it is a cage");
{
  const straight = [[0, 0, 0], [0, 0, 400]];
  const plain = sweepCage(circle(60, 0), straight, { around: 16, along: 8 });
  const turned = sweepCage(circle(60, 0), straight, { around: 16, along: 8, twist: 0.25 });
  const first = p => pmUnit(pmSub(p.points[0], pmMid(p.points.slice(0, 16))));
  const last = p => {
    const at = p.points.length - 16;
    return pmUnit(pmSub(p.points[at], pmMid(p.points.slice(at))));
  };
  const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1, pmDot(a, b)))) * 180 / Math.PI;
  check("no twist means the far end is where the near end is",
        angle(first(plain), last(plain)) < 1e-6,
        angle(first(plain), last(plain)).toFixed(4) + "°");
  check("a quarter turn of twist turns the far end 90°",
        Math.abs(angle(first(turned), last(turned)) - 90) < 1e-6,
        angle(first(turned), last(turned)).toFixed(4) + "°");
  const cone = sweepCage(circle(60, 0), straight, { around: 16, along: 8, taper: 0.25 });
  const radius = (p, at) => pmLen(pmSub(p.points[at], pmMid(p.points.slice(at, at + 16))));
  check("and tapering to a quarter ends a quarter of the size",
        Math.abs(radius(cone, cone.points.length - 16) - 15) < 1e-6,
        radius(cone, cone.points.length - 16).toFixed(4) + " from 60");
}

/* ===================================================== and in the kernel */

const kernel = await createWasmKernel({
  initModule, wasmBinary: readFileSync(WASM_DIR + "/replicad_single.wasm"),
});
const mdl = new Mdl({
  kernel, setNode: () => {}, readLayout: () => ({}), select: () => {}, selected: () => null,
});
const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
  name: "Loft", units: "mm", features: [] } });

console.log("6. the nodes, and the resolution staying live");
{
  //! A plane needs an origin AND a normal - connecting only the origin leaves
  //! it unbuilt, the circle on it unbuilt, and the sweep complaining about its
  //! section, which is three steps from the thing that is actually missing.
  const origin = await mdl.run({ op: "add", type: "Point", name: "O" });
  const up = await mdl.run({ op: "add", type: "Vector", name: "Z" });
  await mdl.run({ op: "set", id: up.id, key: "dz", value: 1 });
  const plane = await mdl.run({ op: "add", type: "Plane", name: "P" });
  await mdl.run({ op: "connect", id: plane.id, key: "origin", from: origin.id });
  await mdl.run({ op: "connect", id: plane.id, key: "normal", from: up.id });
  const section = await mdl.run({ op: "add", type: "Circle", name: "Section" });
  await mdl.run({ op: "connect", id: section.id, key: "plane", from: plane.id });
  await mdl.run({ op: "set", id: section.id, key: "radius", value: 50 });

  const a = await mdl.run({ op: "add", type: "Point", name: "A" });
  const b = await mdl.run({ op: "add", type: "Point", name: "B" });
  await mdl.run({ op: "set", id: b.id, key: "z", value: 400 });
  const path = await mdl.run({ op: "add", type: "Polyline", name: "Path" });
  for (const p of [a, b]) await mdl.run({ op: "connect", id: path.id, key: "points", from: p.id });

  const swept = await mdl.run({ op: "add", type: "MeshSweep", name: "Swept" });
  await mdl.run({ op: "connect", id: swept.id, key: "section", from: section.id });
  await mdl.run({ op: "connect", id: swept.id, key: "path", from: path.id });

  let entry = await at(swept.id);
  check("it built", entry.built && !entry.error, entry.error || entry.note);
  check("and it is a mesh", entry.produces === "mesh" && entry.data.kind === "mesh");
  check("12 round by 8 along is 96 faces", entry.data.faces === 96,
        entry.data.preview + " · " + entry.note);

  //! THE WHOLE POINT: the resolution is an argument, not something baked in
  //! when the sweep ran. Changing it rebuilds from the curves.
  await mdl.run({ op: "set", id: swept.id, key: "around", value: 24 });
  await mdl.run({ op: "set", id: swept.id, key: "along", value: 3 });
  entry = await at(swept.id);
  check("and changing both rebuilds it from the curves", entry.data.faces === 72,
        entry.data.preview);

  //! And it is a cage, so it feeds the smooth side.
  const smooth = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Smooth" });
  await mdl.run({ op: "connect", id: smooth.id, key: "mesh", from: swept.id });
  const made = await at(smooth.id);
  check("the NURBS conversion takes it", made.built && !made.error, made.error || made.note);
  check("one patch per cage face", /^72 NURBS patch/.test(made.note || ""), made.note);
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
