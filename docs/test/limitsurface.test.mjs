// The cage as surfaces rather than facets: Catmull-Clark's limit surface
// written as NURBS, which is what Maya's Subdiv to NURBS and Rhino's ToNURBS
// mean and what \ref limitsurface.js does.
//
// THE SUBDIVISION IS THE GROUND TRUTH, so it is also the instrument. Nothing
// here is checked against a number transcribed from a paper: the regular case
// is checked against the uniform bicubic B-spline worked out independently in
// this file, the corner poles are checked against a limit-position mask that
// is itself proved by being a fixed point of the repository's own
// \ref catmullClark, and the whole surface is checked against the solid that
// the faceted conversion builds out of a deeply subdivided cage. If the
// construction were wrong in any of the ways it could plausibly be wrong -
// a mask coefficient, an index, a parameter direction - one of those three
// disagrees.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { catmullClark, topologyOf, pmAdd, pmMul, pmSub, pmLen } from "../src/polymesh.js";
import { limitPatches, limitPoles, patchPoint, patchNormal, limitSeat, worstKink }
  from "../src/limitsurface.js";
import { readFileSync } from "fs";

const WASM_DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const initModule = (await import(WASM_DIR + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

/* --------------------------------------------------------- the test cages */

//! A flat grid with a wobble on it, so the arithmetic is exercised in all
//! three coordinates rather than only in z.
function grid(cols, rows, bump = 1) {
  const points = [], faces = [];
  for (let j = 0; j <= rows; j++) for (let i = 0; i <= cols; i++)
    points.push([i * 100, j * 100, bump * Math.sin(i * 1.1) * Math.cos(j * 0.7) * 100]);
  const id = (i, j) => j * (cols + 1) + i;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++)
    faces.push([id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1)]);
  return { points, faces, creases: {}, corners: {} };
}

//! A CLOSED cage where every single vertex has four faces on it - so the whole
//! surface is regular and the patches have to be the limit surface exactly,
//! with no extraordinary vertex anywhere to hide an error behind.
function torus(big = 8, small = 6) {
  const points = [], faces = [];
  for (let i = 0; i < big; i++) for (let j = 0; j < small; j++) {
    const a = 2 * Math.PI * i / big, b = 2 * Math.PI * j / small;
    const r = 500 + 180 * Math.cos(b);
    points.push([r * Math.cos(a), r * Math.sin(a), 180 * Math.sin(b)]);
  }
  const id = (i, j) => (((i % big) + big) % big) * small + (((j % small) + small) % small);
  for (let i = 0; i < big; i++) for (let j = 0; j < small; j++)
    faces.push([id(i, j), id(i + 1, j), id(i + 1, j + 1), id(i, j + 1)]);
  return { points, faces, creases: {}, corners: {} };
}

const CUBE = { points: [[0,0,0],[300,0,0],[300,300,0],[0,300,0],
                        [0,0,300],[300,0,300],[300,300,300],[0,300,300]],
               faces: [[0,3,2,1],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]],
               creases: {}, corners: {} };

//! Where old vertex v lands after one Catmull-Clark step. The new points go
//! down face points first, then edge points, then the moved old vertices - so
//! index 0 of a subdivided cage is a FACE CENTRE, not the first vertex. Worth
//! stating: tracking a vertex by its old index reads as the construction being
//! wrong and is the test being wrong.
const movedTo = (mesh, v) => mesh.faces.length + topologyOf(mesh).edges.size + v;

console.log("1. a regular quad comes out as exactly the uniform bicubic B-spline");
{
  // The B-spline to Bezier conversion, worked out here from the definition of
  // the uniform cubic B-spline rather than taken from the module under test.
  const M = [[1/6, 4/6, 1/6, 0], [0, 4/6, 2/6, 0], [0, 2/6, 4/6, 0], [0, 1/6, 4/6, 1/6]];
  const { patches, cage } = limitPatches(grid(6, 6), { levels: 0 });
  const id = (i, j) => j * 7 + i;
  const fi = cage.faces.findIndex(f => f[0] === id(2, 2) && f[1] === id(3, 2));
  const patch = patches.find(p => p.face === fi);
  check("the middle of the grid is a quad with four valence-four corners", !!patch);
  let worst = 0;
  for (let k = 0; k < 4; k++) for (let l = 0; l < 4; l++) {
    let b = [0, 0, 0];
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const w = M[k][i] * M[l][j], p = cage.points[id(1 + i, 1 + j)];
      b = [b[0] + w * p[0], b[1] + w * p[1], b[2] + w * p[2]];
    }
    worst = Math.max(worst, pmLen(pmSub(b, patch.poles[k][l])));
  }
  check("all sixteen poles agree with it", worst < 1e-9,
        "worst " + worst.toExponential(2) + " mm");
}

console.log("2. the patch corners sit on the limit surface, at every valence");
{
  for (const n of [3, 4, 5, 6, 8]) {
    // A wheel of n quads round one vertex, inside two more rings so the ring
    // the masks read is complete.
    const points = [[0, 0, 40]], faces = [];
    const ring = (r, k) => {
      const out = [];
      for (let i = 0; i < n * 2; i++) {
        const a = Math.PI * 2 * i / (n * 2);
        points.push([Math.cos(a) * r * (1 + 0.1 * (i % 3)), Math.sin(a) * r,
                     k * 30 * Math.cos(a * 3)]);
        out.push(points.length - 1);
      }
      return out;
    };
    const r1 = ring(100, 1), r2 = ring(200, -1), r3 = ring(300, 1);
    for (let i = 0; i < n; i++)
      faces.push([0, r1[2 * i], r1[2 * i + 1], r1[(2 * i + 2) % (2 * n)]]);
    for (const [a, b] of [[r1, r2], [r2, r3]])
      for (let i = 0; i < 2 * n; i++)
        faces.push([a[i], b[i], b[(i + 1) % (2 * n)], a[(i + 1) % (2 * n)]]);
    const mesh = { points, faces, creases: {}, corners: {} };
    const topo = topologyOf(mesh);
    check("n=" + n + ": the wheel really has valence " + n,
          topo.vertFaces[0].length === n && topo.vertEdges[0].length === n);

    const seat = limitSeat(mesh, 0);
    check("n=" + n + ": the patch corner is that limit position",
          pmLen(pmSub(seat, limitPoles(mesh).corners[0])) < 1e-10);

    //! WHY THE LIMIT MASK IS THE RIGHT ONE, with no tolerance in the question.
    //! The limit position is the left eigenvector of the subdivision matrix for
    //! eigenvalue one, so applying the mask, subdividing, and applying it again
    //! has to give the SAME point. A wrong mask drifts.
    let fine = mesh, here = 0, drift = 0; const walk = [];
    for (let s = 0; s < 4; s++) {
      walk.push(pmLen(pmSub(fine.points[here], seat)));
      const was = fine;
      fine = catmullClark(fine);
      here = movedTo(was, here);
      drift = Math.max(drift, pmLen(pmSub(limitSeat(fine, here), seat)));
    }
    check("n=" + n + ": four levels of subdivision do not move it", drift < 1e-9,
          "drift " + drift.toExponential(2) + " mm");
    //! And that it is the LIMIT rather than some other fixed point: the vertex
    //! itself has to walk onto it.
    check("n=" + n + ": and the vertex walks onto it", walk[3] < walk[0] * 0.3,
          walk.map(w => w.toFixed(3)).join(" -> "));
  }
}

//! A point on a merged patch: find which span of the grid the parameter lands
//! in and evaluate the Bezier on those four poles each way. That IS the
//! definition of a cubic B-spline whose interior knots are threefold, and it
//! is written here rather than imported so the test does not take the module's
//! word for the convention.
const spanPoint = (grid, span, u, v) => {
  const cell = t => Math.min(span - 1, Math.max(0, Math.floor(t * span)));
  const i = cell(u), j = cell(v);
  const four = [[], [], [], []];
  for (let x = 0; x < 4; x++)
    for (let y = 0; y < 4; y++) four[x][y] = grid[i * 3 + x][j * 3 + y];
  return patchPoint(four, u * span - i, v * span - j);
};

console.log("3. refining does not move the surface, and the merge keeps its parameters");
{
  //! \p levels is sold as buying smoothness for nothing, so two things have to
  //! hold and both are checked here. The surface must not MOVE when it is
  //! refined - on a cage that is regular everywhere it is already exact, so
  //! any movement is an error - and the merged patch must carry the same (u, v)
  //! as the unrefined one, which is what says the sub-patches were folded back
  //! in the right places. A wrong quarter turn anywhere scrambles the
  //! quadrants and this goes wrong by the size of the model.
  const flat = limitPatches(torus(8, 6), { levels: 0 });
  const byFace = new Map(flat.patches.map(p => [p.face, p]));
  for (const levels of [1, 2]) {
    const deep = limitPatches(torus(8, 6), { levels });
    check("level " + levels + " is still one patch per cage face",
          deep.patches.length === flat.patches.length,
          deep.patches.length + " against " + flat.patches.length);
    check("level " + levels + " divides each patch into " + (1 << levels) + " spans",
          deep.span === (1 << levels) && deep.patches[0].poles.length === 3 * (1 << levels) + 1,
          deep.patches[0].poles.length + " poles across");
    let worst = 0, compared = 0;
    for (const patch of deep.patches) {
      const was = byFace.get(patch.face);
      for (let a = 0; a <= 6; a++) for (let b = 0; b <= 6; b++) {
        const u = a / 6, v = b / 6;
        worst = Math.max(worst, pmLen(pmSub(spanPoint(patch.poles, deep.span, u, v),
                                            patchPoint(was.poles, u, v))));
        compared++;
      }
    }
    check("and it is the same surface at the same parameters", worst < 1e-9 && compared > 1000,
          compared + " points, worst " + worst.toExponential(2) + " mm");
  }
}

console.log("3b. and the fold is exact on a cage where refining really does change it");
{
  //! Section 3 compares a refined cage against an unrefined one, which only
  //! says anything where the two ARE the same surface - a regular cage. On a
  //! cube cage every corner is extraordinary, so level 1 genuinely differs from
  //! level 0 and that comparison cannot be made. What can: every sub-patch the
  //! refinement built must still be exactly inside the merged surface, read out
  //! of the merged pole grid independently of how it was written in.
  for (const levels of [1, 2]) {
    const got = limitPatches(CUBE, { levels });
    const byBase = new Map(got.patches.map(p => [p.face, p]));
    let worst = 0, corners = 0;
    for (const fine of got.fine) {
      const merged = byBase.get(fine.place.base), s = got.span, t = fine.place.turn;
      for (const [x, y] of [[0, 0], [1, 0], [1, 1], [0, 1]]) {
        const rot = t === 1 ? [1 - y, x] : t === 2 ? [1 - x, 1 - y]
                  : t === 3 ? [y, 1 - x] : [x, y];
        worst = Math.max(worst, pmLen(pmSub(
          patchPoint(fine.poles, x, y),
          spanPoint(merged.poles, s, (fine.place.i + rot[0]) / s, (fine.place.j + rot[1]) / s))));
        corners++;
      }
    }
    //! EXACTLY zero: the fold moves poles, it does not compute them, so there
    //! is nothing for a tolerance to absorb.
    check("level " + levels + ": every sub-patch corner is on the merged surface",
          worst === 0, corners + " corners, worst " + worst + " mm");
  }
}

console.log("4. watertight because the poles are shared, not because they are close");
{
  //! Checked on MERGED patches, at a refinement level, because that is the
  //! case that could go wrong now: a merged patch's boundary is a whole run of
  //! poles rather than four, and if the folding wrote any of them from the
  //! wrong sub-patch the two sides of a cage edge would disagree. They cannot
  //! differ by a little - either the run is the same numbers or the fold is
  //! broken - so this asks for EXACTLY zero.
  const got = limitPatches(grid(4, 4, 1), { levels: 2 });
  const topo = topologyOf(got.base);
  const byFace = new Map(got.patches.map(p => [p.face, p]));
  const last = 3 * got.span;
  const side = (patch, a, b) => {
    const c = patch.corners, ia = c.indexOf(a), ib = c.indexOf(b);
    const fwd = (ia + 1) % 4 === ib, from = fwd ? ia : ib;
    const run = [];
    for (let t = 0; t <= last; t++)
      run.push(from === 0 ? patch.poles[t][0] : from === 1 ? patch.poles[last][t]
             : from === 2 ? patch.poles[last - t][last] : patch.poles[0][last - t]);
    return fwd ? run : run.reverse();
  };
  let worst = 0, shared = 0, poles = 0;
  for (const [, edge] of topo.edges) {
    if (edge.faces.length !== 2) continue;
    const one = side(byFace.get(edge.faces[0]), edge.a, edge.b);
    const two = side(byFace.get(edge.faces[1]), edge.a, edge.b);
    shared++;
    for (let i = 0; i <= last; i++) {
      worst = Math.max(worst, pmLen(pmSub(one[i], two[i])));
      poles++;
    }
  }
  check("every shared boundary is the same run of poles from both sides", worst === 0,
        shared + " shared edges, " + poles + " poles, worst disagreement " + worst);
}

console.log("5. the kink, where it is and how fast it goes");
{
  const flat = limitPatches(grid(5, 5), { levels: 0 });
  const none = worstKink(flat.cage, flat.fine, flat.poles);
  check("a regular cage has no extraordinary vertex and no kink at all",
        none.extraordinary === 0 && none.worst === 0);

  const seen = [];
  for (const levels of [0, 1, 2, 3]) {
    const got = limitPatches(CUBE, { levels });
    const k = worstKink(got.cage, got.fine, got.poles);
    seen.push(k.worst);
    check("cube at level " + levels + ": " + got.patches.length + " patches, "
          + k.extraordinary + " extraordinary vertices", k.extraordinary === 8,
          "worst kink " + k.worst.toFixed(4) + " deg");
  }
  //! The claim the node's note makes to the user, checked: each level roughly
  //! halves it. If this ever stops being true the note is lying.
  check("each level makes the kink smaller", seen.every((w, i) => !i || w < seen[i - 1]),
        seen.map(w => w.toFixed(3)).join(" > "));
  check("and roughly halves it", seen[3] < seen[0] / 8, seen[0].toFixed(3) + " -> " + seen[3].toFixed(3));
}

console.log("6. a crease is held exactly, because the rim rule is a real cubic");
{
  //! The normal of one patch at a fraction along one of its four sides.
  const normalAlong = (patch, a, b, t) => {
    const c = patch.corners, ia = c.indexOf(a), ib = c.indexOf(b);
    const fwd = (ia + 1) % 4 === ib, from = fwd ? ia : ib, u = fwd ? t : 1 - t;
    const at = [[u, 0], [1, u], [1 - u, 1], [0, 1 - u]][from];
    return patchNormal(patch.poles, at[0], at[1]);
  };
  const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1,
    a[0] * b[0] + a[1] * b[1] + a[2] * b[2]))) * 180 / Math.PI;
  const across = (got, a, b) => {
    const two = got.patches.filter(p => p.corners.includes(a) && p.corners.includes(b));
    if (two.length !== 2) return null;
    let worst = 0;
    for (let i = 1; i < 4; i++)
      worst = Math.max(worst, angle(normalAlong(two[0], a, b, i / 4),
                                    normalAlong(two[1], a, b, i / 4)));
    return worst;
  };

  //! A CREASED CHAIN, not a single edge: a crease that runs right across the
  //! cage, so every vertex on it has exactly two creased edges and is the
  //! crease vertex the rules are written for. One lone creased edge is a DART,
  //! whose end is a vertex that is creased on one side and smooth on the other,
  //! and no bicubic patch holds that exactly - it leaks about half a degree
  //! onto the neighbouring edge. Worth knowing; not what this measures.
  const g = { ...grid(6, 6, 1), creases: {} };
  for (let i = 0; i < 6; i++) g.creases[(14 + i) + "," + (15 + i)] = 1;   // the row j=2
  const got = limitPatches(g, { levels: 0 });
  const a = got.cage.points[16], b = got.cage.points[17];
  const third = [(2*a[0]+b[0])/3, (2*a[1]+b[1])/3, (2*a[2]+b[2])/3];
  check("a creased edge takes its poles at the thirds of the cage edge",
        pmLen(pmSub(got.poles.along.get("16,17")[0], third)) < 1e-12,
        pmLen(pmSub(got.poles.along.get("16,17")[0], third)).toExponential(2));

  //! AND THAT IT IS ACTUALLY A FOLD. This is the check that tells a crease
  //! which works from one which is merely stored: the same cage, the same
  //! edge, the same measurement - only the crease differs.
  const plain = limitPatches(grid(6, 6, 1), { levels: 0 });
  check("without the crease the two patches are smooth across it",
        across(plain, 16, 17) < 1e-9, "break " + across(plain, 16, 17) + " deg");
  check("with it they fold", across(got, 16, 17) > 0.5,
        "break " + across(got, 16, 17).toFixed(3) + " deg against 0 without it");
  //! And nothing else moved: two rows away the surface is as smooth as it was,
  //! so what the crease changed is the crease.
  check("and an edge two rows away is untouched", across(got, 30, 31) < 1e-4,
        "break " + across(got, 30, 31).toExponential(2) + " deg, "
        + Math.round(across(got, 16, 17) / across(got, 30, 31)) + "x smaller than the fold");
}

/* ===================================================== and now the kernel */

const kernel = await createWasmKernel({
  initModule, wasmBinary: readFileSync(WASM_DIR + "/replicad_single.wasm"),
});
const mdl = new Mdl({
  kernel, setNode: () => {}, readLayout: () => ({}), select: () => {}, selected: () => null,
});
const tree = async () => (await kernel.tree()).tree;
const at = async id => (await tree()).features.find(f => f.id === id);
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
  name: "Limit", units: "mm", features: [] } });

//! Volume through the document's own measurement node, because that is the
//! only honest way in from outside: it is the same number a user would read.
const gauge = async from => {
  const m = await mdl.run({ op: "add", type: "Measure", name: "V" });
  await mdl.run({ op: "connect", id: m.id, key: "shape", from });
  await mdl.run({ op: "set", id: m.id, key: "quantity", value: 2 });
  const got = await at(m.id);
  await mdl.run({ op: "delete", id: m.id });
  return Number(got.data && got.data.preview);
};

console.log("7. the node builds the smooth surface, not the cage");
const cage = await mdl.run({ op: "add", type: "MeshBox", name: "Cage" });
const smooth = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Smooth" });
await mdl.run({ op: "connect", id: smooth.id, key: "mesh", from: cage.id });
let box = 0, nurbs = 0;
{
  const entry = await at(smooth.id);
  check("it built", entry.built && !entry.error, entry.error || entry.note);
  check("six patches, one per quad of the cage", /^6 NURBS patch/.test(entry.note || ""),
        entry.note);
  check("sewn into a solid", /sewn into a solid/.test(entry.note || ""), entry.note);
  check("and the note says where it is not exact",
        /8 extraordinary vertices/.test(entry.note || ""), entry.note);

  const cageEntry = await at(cage.id);
  const faceted = await mdl.run({ op: "add", type: "MeshToShape", name: "Facets" });
  await mdl.run({ op: "connect", id: faceted.id, key: "mesh", from: cage.id });
  box = await gauge(faceted.id);                       // level 0: the cage itself
  nurbs = await gauge(smooth.id);
  //! THE CHECK THAT TELLS THE TWO CONVERSIONS APART. Both make six faces out
  //! of a cube cage. The faceted one makes the CUBE; this one makes the smooth
  //! body the cube cage means, which is a good deal smaller. A conversion that
  //! had quietly fallen back to planes would pass every other check here.
  check("and it is nothing like the cage - the cage is the box, this is the limit surface",
        nurbs > 0 && nurbs < box * 0.75,
        "cage " + (box / 1e9).toFixed(4) + " m3 vs smooth " + (nurbs / 1e9).toFixed(4) + " m3");
  await mdl.run({ op: "delete", id: faceted.id });
}

console.log("8. on a regular cage it IS the limit surface, and refining proves it");
{
  //! THE PROOF, and the reason this section uses a torus. Every vertex of it
  //! has four faces, so there is no extraordinary vertex anywhere and the
  //! patches must be the limit surface EXACTLY. Two things follow and both are
  //! checked, because either one alone could be true of a wrong answer:
  //!
  //!   the volume must not move at all when the cage is refined first - a
  //!   wrong construction would converge onto something as levels went up,
  //!   and converging is exactly what being right looks like from a distance;
  //!
  //!   and the faceted conversion, coming at the same surface by brute force
  //!   from the other side, must walk onto this number and not another, at the
  //!   O(h^2) rate a facet approximation has - the gap quartering per level.
  const ring = await mdl.run({ op: "add", type: "MeshTemplate", name: "Torus" });
  await mdl.run({ op: "set", id: ring.id, key: "kind", value: 11 });
  const asNurbs = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Smooth" });
  await mdl.run({ op: "connect", id: asNurbs.id, key: "mesh", from: ring.id });
  check("the torus cage is regular throughout",
        /regular throughout/.test((await at(asNurbs.id)).note || ""),
        (await at(asNurbs.id)).note);

  const held = [];
  for (const levels of [0, 1, 2, 3]) {
    await mdl.run({ op: "set", id: asNurbs.id, key: "levels", value: levels });
    held.push(await gauge(asNurbs.id));
  }
  const drift = Math.max(...held.map(v => Math.abs(v - held[0]) / held[0]));
  check("refining the cage first does not move the volume at all", drift < 1e-6,
        held.map(v => (v / 1e9).toFixed(7)).join("  ") + " m3, drift "
        + drift.toExponential(2));

  const asFacets = await mdl.run({ op: "add", type: "MeshToShape", name: "Facets" });
  await mdl.run({ op: "connect", id: asFacets.id, key: "mesh", from: ring.id });
  const gap = [];
  for (const levels of [2, 3, 4]) {
    await mdl.run({ op: "set", id: asFacets.id, key: "levels", value: levels });
    gap.push((await gauge(asFacets.id) - held[0]) / held[0]);
  }
  check("the faceted conversion walks onto that same number",
        gap.every(g => g > 0) && gap[1] < gap[0] / 3 && gap[2] < gap[1] / 3,
        gap.map(g => (g * 100).toFixed(4) + "%").join(" > "));
  check("and is within a third of a percent by level 4", gap[2] < 0.0035,
        (gap[2] * 100).toFixed(4) + "%");
  await mdl.run({ op: "delete", id: asFacets.id });
  await mdl.run({ op: "delete", id: asNurbs.id });
  await mdl.run({ op: "delete", id: ring.id });
}

console.log("9. and on the worst cage there is, it says how far off it is");
{
  //! A CUBE CAGE IS THE WORST CASE AVAILABLE: all eight vertices are
  //! extraordinary and every patch has four of them, so there is not one
  //! regular quad in it to be exact about. What the conversion must do here is
  //! not be perfect - it cannot be - but converge fast and SAY SO, which is
  //! what \p levels and the note are for.
  const walk = [];
  for (const levels of [0, 1, 2, 3]) {
    await mdl.run({ op: "set", id: smooth.id, key: "levels", value: levels });
    walk.push(await gauge(smooth.id));
  }
  const off = walk.map(v => Math.abs(v - walk[3]) / walk[3]);
  check("level 0 of a cage with no regular quad in it is several percent out",
        off[0] > 0.02 && off[0] < 0.1, (off[0] * 100).toFixed(2) + "% below converged");
  check("one level of refinement all but fixes it", off[1] < 0.002,
        (off[1] * 100).toFixed(3) + "%");
  check("and by level 2 it has stopped moving", off[2] < 2e-4,
        walk.map(v => (v / 1e9).toFixed(7)).join("  ") + " m3");
  await mdl.run({ op: "set", id: smooth.id, key: "levels", value: 1 });
}

console.log("10. and it is a body like any other - it takes a boolean");
{
  const origin = await mdl.run({ op: "add", type: "Point", name: "At" });
  const bar = await mdl.run({ op: "add", type: "Cube", name: "Bar" });
  //! The converted body sits 10 mm inside its own cage - the limit surface of
  //! a cube cage pulls in that far - so this is placed to pass THROUGH the top
  //! of it. A tool that misses the body and a tool that swallows it whole both
  //! come back as "they do not meet", and neither says anything about surfaces.
  for (const [key, value] of [["x", -40], ["y", -40], ["z", 60]])
    await mdl.run({ op: "set", id: origin.id, key, value });
  await mdl.run({ op: "connect", id: bar.id, key: "origin", from: origin.id });
  for (const [key, value] of [["dx", 400], ["dy", 400], ["dz", 400]])
    await mdl.run({ op: "set", id: bar.id, key, value });
  const cut = await mdl.run({ op: "add", type: "Boolean", name: "Cut" });
  await mdl.run({ op: "connect", id: cut.id, key: "a", from: smooth.id });
  await mdl.run({ op: "connect", id: cut.id, key: "b", from: bar.id });
  await mdl.run({ op: "set", id: cut.id, key: "op", value: 1 });        // difference
  const entry = await at(cut.id);
  check("a boolean against a NURBS body works", entry.built && !entry.error,
        entry.error || entry.note);
}

console.log("11. a Subdivide in front of it is read back past, not converted");
{
  //! THE COMPLAINT THIS ANSWERS: a cube cage with a Subdivide on it came back
  //! as ninety-six NURBS faces. Subdividing does not change the limit surface -
  //! section 8 measures that, to every digit - so those ninety-six describe
  //! exactly what six describe, and six is the topology the person drew.
  const cage2 = await mdl.run({ op: "add", type: "MeshBox", name: "Cage2" });
  const sub = await mdl.run({ op: "add", type: "Subdivide", name: "Smoothed" });
  await mdl.run({ op: "connect", id: sub.id, key: "mesh", from: cage2.id });
  await mdl.run({ op: "set", id: sub.id, key: "levels", value: 2 });
  const after = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Converted" });
  await mdl.run({ op: "connect", id: after.id, key: "mesh", from: sub.id });

  const note = (await at(after.id)).note || "";
  check("it converts the cage, not the subdivided mesh", /\b6 NURBS patches/.test(note), note);
  check("and says that it stepped back", /read back past 1 Subdivide to Cage2/.test(note), note);

  //! And it is the SAME BODY, not merely the same count - which is the half of
  //! this that could silently be wrong.
  const direct = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Direct" });
  await mdl.run({ op: "connect", id: direct.id, key: "mesh", from: cage2.id });
  const [a, b] = [await gauge(after.id), await gauge(direct.id)];
  check("and it is the identical body", Math.abs(a - b) < Math.abs(b) * 1e-9,
        (a / 1e9).toFixed(7) + " vs " + (b / 1e9).toFixed(7) + " m3");

  //! Asking for it the other way still works, because somebody may genuinely
  //! want a patch per subdivided face - more patches round an extraordinary
  //! vertex is more accuracy there.
  await mdl.run({ op: "set", id: after.id, key: "source", value: 1 });
  check("and taking the mesh as it arrives still gives one patch per face",
        /^96 NURBS patches/.test((await at(after.id)).note || ""), (await at(after.id)).note);
  await mdl.run({ op: "set", id: after.id, key: "source", value: 0 });

  //! THE FAILURE THAT WOULD LOOK LIKE SUCCESS. An Edit Mesh after the Subdivide
  //! is work done at that level - vertices pushed about on the fine cage - and
  //! stepping past it would throw that work away and still produce a smooth,
  //! plausible, wrong body. The walk has to stop at anything that is not a
  //! Subdivide.
  const edit = await mdl.run({ op: "add", type: "EditMesh", name: "Pushed" });
  await mdl.run({ op: "connect", id: edit.id, key: "mesh", from: sub.id });
  await mdl.run({ op: "connect", id: after.id, key: "mesh", from: edit.id });
  const guarded = (await at(after.id)).note || "";
  check("an Edit Mesh in the way stops the walk", !/read back past/.test(guarded), guarded);
  check("so the edited topology is what gets converted",
        /^96 NURBS patches/.test(guarded), guarded);
}

console.log("12. creases: a hard one is held exactly, and that pins the corner rule");
{
  //! THE BILINEAR PATCH, worked out here from its own definition rather than
  //! taken from the module under test - a flat quad written as a bicubic. The
  //! poles of a bilinear raised to degree three sit ON the surface at the
  //! thirds, so this is the flat quad through four cage points and nothing else.
  const bilinear = (points, face) => {
    const [a, b, c, d] = face.map(i => points[i]);
    const at = (u, v) => {
      const w = [(1 - u) * (1 - v), u * (1 - v), u * v, (1 - u) * v];
      return [0, 1, 2].map(k => a[k] * w[0] + b[k] * w[1] + c[k] * w[2] + d[k] * w[3]);
    };
    const poles = [];
    for (let i = 0; i < 4; i++) {
      poles.push([]);
      for (let j = 0; j < 4; j++) poles[i].push(at(i / 3, j / 3));
    }
    return poles;
  };

  //! Crease every edge of a cube cage hard and the Catmull-Clark limit surface
  //! IS the cube: every fold is held, every corner is held, nothing moves. So
  //! the patches have to come out pole for pole identical to the flat quads.
  //!
  //! THIS IS THE CHECK THAT PINNED THE CORNER MASK DOWN. A vertex can be held
  //! along a LINE - a crease running through it, where the surface still curves
  //! across - or held at a POINT, where three creases meet and nothing passes
  //! through smoothly. They take different masks, and using the line mask at a
  //! corner left the interior poles pulled in: the body still measured the
  //! right volume, because a planar patch is planar whatever its middle poles
  //! are, and the faces were visibly soft.
  const hard = { ...CUBE, points: CUBE.points.map(p => p.slice()), creases: {} };
  for (const [key] of topologyOf(CUBE).edges) hard.creases[key] = 1;
  const creased = limitPatches(hard, { levels: 0 });
  let worst = 0;
  for (const patch of creased.patches) {
    const flat = bilinear(hard.points, CUBE.faces[patch.face]);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++)
      worst = Math.max(worst, pmLen(pmSub(patch.poles[i][j], flat[i][j])));
  }
  check("every edge creased hard gives exactly the flat quads, pole for pole",
        worst < 1e-12, "worst " + worst.toExponential(2) + " mm over "
        + creased.patches.length + " patches");

  //! AND IT IS NOT REPORTED AS AN ERROR. The note is the one thing in this node
  //! whose whole job is to say where it is not exact, so a fold somebody asked
  //! for must not appear in it. Creasing every edge of a cube cage makes the
  //! surface exact everywhere, and the measurement has to agree - before this
  //! it called that cage 87.9 degrees out of tangent.
  const kink = worstKink(creased.cage, creased.fine, creased.poles);
  check("and a deliberate fold is not counted as being out of tangent",
        kink.worst === 0 && kink.edges === 0,
        kink.edges + " edges measured, worst " + kink.worst.toFixed(4) + " deg");
  const loose = limitPatches(CUBE, { levels: 0 });
  check("while the same cage uncreased still is", 
        worstKink(loose.cage, loose.fine, loose.poles).worst > 5,
        worstKink(loose.cage, loose.fine, loose.poles).worst.toFixed(3) + " deg");

  //! A VERTEX WEIGHT ON ITS OWN, nowhere near a creased edge: the patch corner
  //! has to sit exactly on the cage vertex, because that is what a corner means
  //! to the subdivision.
  const tagged = { ...grid(4, 4, 1), corners: { 12: 1 } };
  check("a vertex weight of 1 pins the patch corner onto the cage vertex",
        pmLen(pmSub(limitPoles(tagged).corners[12], tagged.points[12])) < 1e-12);
  const way = pmLen(pmSub(limitPoles(grid(4, 4, 1)).corners[12], tagged.points[12]));
  const half = pmLen(pmSub(limitPoles({ ...grid(4, 4, 1), corners: { 12: 0.5 } }).corners[12],
                           tagged.points[12]));
  check("and half a weight lands half way there", Math.abs(half - way / 2) < 1e-9,
        "loose " + way.toFixed(4) + " mm, half " + half.toFixed(4) + " mm");
}

console.log("13. creases set in the mesh editor reach it, with no Subdivide in between");
{
  //! THE CHAIN THE PERSON WANTS: a cage, the creases put on where they are
  //! editing it, and the converter straight after. No Subdivide node anywhere.
  const box = await mdl.run({ op: "add", type: "MeshBox", name: "Box" });
  const edit = await mdl.run({ op: "add", type: "EditMesh", name: "Creased" });
  await mdl.run({ op: "connect", id: edit.id, key: "mesh", from: box.id });
  const nurbs = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Smooth" });
  await mdl.run({ op: "connect", id: nurbs.id, key: "mesh", from: edit.id });
  //! One level, because a bare cube cage has no regular quad in it at all and
  //! is the worst case for the approximation - section 9 measures that it has
  //! settled by here, so what is left to compare is the CREASES.
  await mdl.run({ op: "set", id: nurbs.id, key: "levels", value: 1 });
  const facets = await mdl.run({ op: "add", type: "MeshToShape", name: "Facets" });
  await mdl.run({ op: "connect", id: facets.id, key: "mesh", from: edit.id });
  await mdl.run({ op: "set", id: facets.id, key: "levels", value: 4 });

  const loose = { nurbs: await gauge(nurbs.id), facets: await gauge(facets.id) };
  //! Under a per cent, and what is left is the FACETED side's own error: a
  //! level-4 polyhedron of a body this curved is about half a per cent under,
  //! exactly as the torus in section 8 was 0.297% under at the same level. The
  //! number to watch is not this one but the gap between it and the deaf case
  //! at the bottom of this section.
  const plain = Math.abs(loose.nurbs - loose.facets) / loose.nurbs;
  check("with no creases the two nodes already agree", plain < 0.01,
        (plain * 100).toFixed(3) + "%");

  //! The four edges round the top of the cage held hard, and one corner
  //! weighted - a mix, so neither rule can be right by accident. These are the
  //! real edge keys of a MeshBox, whose top face is [4, 5, 6, 7].
  await mdl.run({ op: "meshop", id: edit.id, ops: [
    { op: "crease", level: "edge", at: ["4,5", "5,6", "6,7", "4,7"], args: { amount: 1 } },
    { op: "corner", level: "vertex", at: [0], args: { amount: 1 } },
  ] });
  const entry = await at(edit.id);
  check("the mesh editor took them", entry.built && !entry.error, entry.error || entry.note);

  const held = { nurbs: await gauge(nurbs.id), facets: await gauge(facets.id) };
  check("the converter notices them - the body changes",
        Math.abs(held.nurbs - loose.nurbs) / loose.nurbs > 0.02,
        (loose.nurbs / 1e9).toFixed(5) + " -> " + (held.nurbs / 1e9).toFixed(5) + " m3");

  //! AND THE TWO NODES MEAN THE SAME THING BY THEM. A crease is DEFINED by what
  //! the subdivision does with it, so the deeply subdivided body is the answer
  //! and the NURBS body has to be that same body. This is the whole of what was
  //! asked for: set a crease once, and the smooth mesh and the smooth B-Rep are
  //! the same shape.
  const agree = Math.abs(held.nurbs - held.facets) / held.nurbs;
  check("and they agree about the creased body as closely as about the plain one",
        agree < 0.005, (agree * 100).toFixed(3) + "%");

  //! THE FAILURE THAT WOULD LOOK LIKE SUCCESS. A converter that read the mesh
  //! and quietly ignored its creases would still build, still be watertight,
  //! still measure something plausible. What tells them apart is that it would
  //! disagree with the subdivision by far more than this.
  const deaf = Math.abs(loose.nurbs - held.facets) / held.facets;
  check("ignoring the creases would be an order of magnitude worse",
        deaf > agree * 10, "ignoring them is " + (deaf * 100).toFixed(2)
        + "% out, honouring them " + (agree * 100).toFixed(3) + "%");
}

console.log("14. a mesh in pieces, and a mesh whose vertices are not joined up");
{
  //! AN OBJ WRITTEN THE WAY AN EXPORTER WRITES ONE. A cube with twenty-four
  //! vertices - four to a face, none shared - which is what every STL is and
  //! what a good many OBJs are. Nothing is joined to anything, so there are six
  //! loose faces and no solid anywhere until the vertices are welded.
  const cubeAt = (x, at) => {
    const c = [[0,0,0],[0,1,0],[1,1,0],[1,0,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]]
      .map(p => [x + p[0] * 100, p[1] * 100, p[2] * 100]);
    const rings = [[0,1,2,3], [4,5,6,7], [0,3,5,4], [1,7,6,2], [0,4,7,1], [3,2,6,5]];
    let v = "", f = "";
    rings.forEach((ring, i) => {
      for (const k of ring) v += "v " + c[k].join(" ") + "\n";
      f += "f " + ring.map((_, j) => at + i * 4 + j + 1).join(" ") + "\n";
    });
    return { v, f, used: 24 };
  };
  const objOf = (...xs) => {
    let v = "", f = "", at = 0;
    for (const x of xs) { const one = cubeAt(x, at); v += one.v; f += one.f; at += one.used; }
    return "g test\n" + v + f;
  };

  const loose = await mdl.run({ op: "add", type: "MeshImported", name: "Loose" });
  await mdl.run({ op: "code", id: loose.id, key: "obj", text: objOf(0) });
  const made = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Joined" });
  await mdl.run({ op: "connect", id: made.id, key: "mesh", from: loose.id });

  //! WHAT THE WELD ACTUALLY CHANGES, and it is not what it looks like. The
  //! sewing joins the six faces into a solid whether or not the MESH was
  //! joined - coincident patch boundaries sew. What stays broken is the
  //! SURFACE: an unwelded cage is six faces that share no vertex, so every one
  //! of them is a lone patch with a boundary all the way round, and the limit
  //! surface of that is the flat quad. You get a cube back, with a watertight
  //! shell and a plausible note, and no sign that anything went wrong.
  const unwelded = (await at(made.id)).note || "";
  const flat = await gauge(made.id);
  check("unwelded, every face is its own patch and nothing is smoothed",
        /the cage is regular throughout/.test(unwelded)
        && Math.abs(flat - 100 * 100 * 100) < 1, unwelded);
  check("so it measures the cage itself, not the body the cage means",
        Math.abs(flat - 1e6) < 1, flat.toFixed(3) + " mm3 against 1000000");

  //! THE WELD THE NODE NOW DOES ITSELF, so an import does not need a Weld node
  //! in front of it to be anything but confetti.
  await mdl.run({ op: "set", id: made.id, key: "weld", value: 0.01 });
  const welded = (await at(made.id)).note || "";
  check("welded, it is one solid", /sewn into a solid/.test(welded), welded);
  check("and it says how many vertices went", /welded 16 vertices away/.test(welded), welded);
  const shut = await gauge(made.id);
  check("and NOW it is the smooth body the cage means, a third of the volume",
        shut > 0 && shut < flat * 0.4,
        (shut / 1e9).toFixed(6) + " m3 against " + (flat / 1e9).toFixed(6));

  //! A weld that found nothing says so rather than leaving somebody to wonder
  //! whether it ran. Asked of a cage that was built here, so there is genuinely
  //! nothing sitting on top of anything.
  const clean = await mdl.run({ op: "add", type: "MeshBox", name: "Clean" });
  const onto = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Onto" });
  await mdl.run({ op: "connect", id: onto.id, key: "mesh", from: clean.id });
  await mdl.run({ op: "set", id: onto.id, key: "weld", value: 0.5 });
  check("a weld that joins nothing says so",
        /nothing was close enough to weld/.test((await at(onto.id)).note || ""),
        (await at(onto.id)).note);
  await mdl.run({ op: "delete", id: onto.id });
  await mdl.run({ op: "delete", id: clean.id });

  //! TWO SEPARATE CLOSED PIECES. This is the one that was broken: the sewn
  //! result is a COMPOUND of two shells, not a shell, so nothing was made solid
  //! and a boolean against it quietly came back open. Blender's Suzanne is a
  //! head and two eyes and hit exactly this.
  await mdl.run({ op: "code", id: loose.id, key: "obj", text: objOf(0, 300) });
  await mdl.run({ op: "set", id: made.id, key: "weld", value: 0.01 });
  const two = (await at(made.id)).note || "";
  check("two separate pieces become two solids, not one shell",
        /sewn into 2 solids/.test(two), two);
  const pair = await gauge(made.id);
  check("and both are measured", Math.abs(pair - shut * 2) < shut * 1e-6,
        (pair / 1e9).toFixed(6) + " against twice " + (shut / 1e9).toFixed(6));
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
