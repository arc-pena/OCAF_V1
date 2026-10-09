// A lattice, and the coordinates that carry a mesh through its deformation.
//
// WHY LINEAR PRECISION IS THE TEST. Mean value coordinates have one property
// that is both the reason to use them and impossible to see by eye: they
// reproduce linear functions exactly. If the cage is moved by an affine map -
// scaled, sheared, turned, translated - every point inside it must move by
// EXACTLY that map, to the last bit, and not approximately. A deformation that
// is slightly wrong there looks completely convincing on screen and is wrong
// everywhere: stretch a cage to twice its width and the model comes back 1.98
// times as wide, which nobody would ever notice and which makes the node
// useless for anything dimensional.
//
// So that is what most of this file checks, with maps whose answer is known
// before the program runs.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { DEFORMS } from "../src/ocaf.js";
import { boundsOf, topologyOf, pmLen, pmSub } from "../src/polymesh.js";
import { cageMoved, cageTriangles, latticeCage, meanValueCoords,
         morphThrough, sameCage } from "../src/cagemorph.js";
import { readFileSync } from "fs";

const WASM_DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const initModule = (await import(WASM_DIR + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const show = p => "(" + p.map(v => Math.round(v * 1e6) / 1e6).join(", ") + ")";

const BOX = { lo: [0, 0, 0], hi: [100, 100, 100] };
//! A scatter of points inside and outside the cage, including some exactly ON
//! its faces - which is the case a coordinate system defined only in the
//! interior gets wrong, and a lattice fitted to a bounding box has hundreds of.
const PROBES = [[50, 50, 50], [10, 90, 33], [1, 1, 1], [0, 50, 50], [100, 100, 100],
                [50, 0, 50], [-40, 50, 50], [50, 50, 170], [99.9, 0.1, 50]];

/* ===================================================================== 1. shape

   The lattice is hollow on purpose, and the count is the thing anybody will
   check first: 4 x 4 x 4 is 125 points in a solid grid and 98 on its surface. */

console.log("\n1. the lattice");
{
  const two = latticeCage(BOX, { nx: 2, ny: 2, nz: 2 });
  check("2 × 2 × 2 is 26 control points — 27 in a solid grid, less the one inside",
        two.points.length === 26, String(two.points.length));
  check("and 24 faces, four to a side", two.faces.length === 24, String(two.faces.length));
  //! V − E + F = 2 for anything that is a closed surface of one piece. It is
  //! the cheapest possible proof that the six sides were stitched to each
  //! other rather than left as six loose sheets sharing coordinates.
  const topo = topologyOf(two);
  let open = 0, over = 0;
  for (const [, e] of topo.edges) {
    if (e.faces.length === 1) open++;
    else if (e.faces.length > 2) over++;
  }
  check("closed: no open edges and nothing non-manifold", open === 0 && over === 0,
        open + " open, " + over + " over");
  check("Euler: 26 − 48 + 24 = 2, so it is one closed box",
        two.points.length - topo.edges.size + two.faces.length === 2,
        two.points.length + " − " + topo.edges.size + " + " + two.faces.length);

  const four = latticeCage(BOX, { nx: 4, ny: 4, nz: 4 });
  check("4 × 4 × 4 is 98 — the 125 of a solid grid less the 27 inside it",
        four.points.length === 98, String(four.points.length));
  check("and 96 faces, sixteen to a side", four.faces.length === 96);

  const bounds = boundsOf(four);
  check("it is exactly the box it was given",
        bounds.lo.every((v, i) => Math.abs(v - BOX.lo[i]) < 1e-12)
        && bounds.hi.every((v, i) => Math.abs(v - BOX.hi[i]) < 1e-12),
        show(bounds.lo) + " .. " + show(bounds.hi));

  const padded = latticeCage(BOX, { nx: 1, ny: 1, nz: 1, padding: 25 });
  const out = boundsOf(padded);
  check("padding stands it off on every side",
        out.lo.every(v => Math.abs(v + 25) < 1e-12)
        && out.hi.every(v => Math.abs(v - 125) < 1e-12), show(out.lo) + " .. " + show(out.hi));

  //! A FLAT MODEL STILL GETS A BOX. Zero thickness means every control point
  //! on that side lands on its opposite number: no volume, no coordinates,
  //! NaN for every vertex.
  const flat = latticeCage({ lo: [0, 0, 0], hi: [100, 100, 0] }, { nx: 1, ny: 1, nz: 1 });
  const thin = boundsOf(flat);
  check("a flat model still gets a box with thickness in it",
        thin.hi[2] - thin.lo[2] > 0.1, String(thin.hi[2] - thin.lo[2]));
}

/* ======================================================= 2. linear precision

   The property the whole node stands on, in four flavours.                  */

console.log("\n2. an affine move of the cage is an affine move of the model");
{
  const rest = latticeCage(BOX, { nx: 3, ny: 2, nz: 2 });
  const through = map => {
    const moved = { ...rest, points: rest.points.map(map) };
    const got = morphThrough(PROBES, rest, moved);
    let worst = 0;
    PROBES.forEach((p, i) => {
      const d = pmLen(pmSub(got.points[i], map(p)));
      if (d > worst) worst = d;
    });
    return { worst, outside: got.outside };
  };

  const still = through(p => p.slice());
  check("a cage that has not moved does not move the model",
        still.worst < 1e-9, still.worst.toExponential(2) + " mm");

  const shifted = through(p => [p[0] + 37, p[1] - 11, p[2] + 4]);
  check("translated: every point follows by exactly the same vector",
        shifted.worst < 1e-9, shifted.worst.toExponential(2) + " mm");

  //! THE ONE THAT MATTERS DIMENSIONALLY. Stretch the cage to twice its width
  //! and the model must be exactly twice as wide, not 1.98 times.
  const stretched = through(p => [p[0] * 2, p[1], p[2]]);
  check("stretched 2× in X: exactly 2×, not nearly",
        stretched.worst < 1e-9, stretched.worst.toExponential(2) + " mm");

  const sheared = through(p => [p[0] + 0.4 * p[2], p[1] - 0.2 * p[0], p[2] * 1.3 + 5]);
  check("sheared and scaled and shifted at once: still exact",
        sheared.worst < 1e-9, sheared.worst.toExponential(2) + " mm");

  const a = 0.7;
  const turned = through(p => [p[0] * Math.cos(a) - p[1] * Math.sin(a),
                               p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]]);
  check("turned 40°: still exact, so a cage move is rigid when it should be",
        turned.worst < 1e-9, turned.worst.toExponential(2) + " mm");

  check("and nothing was left behind - the coordinates work outside the cage too",
        still.outside === 0 && sheared.outside === 0, String(sheared.outside));
}

/* ====================================================== 3. the coordinates

   Underneath the morph: they have to sum to something and they have to
   reproduce the point itself.                                              */

console.log("\n3. the coordinates themselves");
{
  const cage = latticeCage(BOX, { nx: 2, ny: 2, nz: 2 });
  const tris = cageTriangles(cage);
  check("a quad cage fans into twice as many triangles", tris.length === 48,
        String(tris.length));

  let worstBack = 0, worstSum = 0;
  for (const p of PROBES) {
    const w = meanValueCoords(cage.points, tris, p);
    let total = 0;
    const back = [0, 0, 0];
    for (let i = 0; i < w.length; i++) total += w[i];
    for (let i = 0; i < w.length; i++)
      for (let a = 0; a < 3; a++) back[a] += cage.points[i][a] * w[i] / total;
    worstBack = Math.max(worstBack, pmLen(pmSub(back, p)));
    worstSum = Math.max(worstSum, Math.abs(1 - w.reduce((s, v) => s + v, 0) / total));
  }
  check("they reproduce the point they were taken at, to 1e-9",
        worstBack < 1e-9, worstBack.toExponential(2) + " mm");
  check("and they are a partition of unity once normalised", worstSum < 1e-12);

  //! ON a control point the limit is that point, and the arithmetic that
  //! would produce it divides by zero on the way.
  const onPoint = meanValueCoords(cage.points, tris, cage.points[7]);
  check("standing on a control point gives that point and nothing else",
        onPoint[7] === 1 && onPoint.reduce((s, v) => s + v, 0) === 1);

  //! And on a FACE of the cage - which is where a bounding-box lattice puts a
  //! great deal of the model - the planar case has to take over cleanly.
  const onFace = meanValueCoords(cage.points, tris, [50, 50, 0]);
  const sum = onFace.reduce((s, v) => s + v, 0);
  check("standing on a face gives finite coordinates, not an infinity",
        Number.isFinite(sum) && sum > 0, String(sum));
}

/* ======================================================= 4. a local change

   One control point moved is not an affine map, so there is no closed form to
   check against - but there are two things that must be true of it, and both
   would break under a sign error that the affine tests above cannot see.    */

console.log("\n4. moving one control point");
{
  const rest = latticeCage(BOX, { nx: 2, ny: 2, nz: 2 });
  //! The control point nearest the top middle, pulled 50 mm up.
  let top = 0;
  rest.points.forEach((p, i) => { if (p[2] > rest.points[top][2] - 1e-9 && p[0] === 50 && p[1] === 50) top = i; });
  const moved = { ...rest, points: rest.points.map((p, i) =>
    i === top ? [p[0], p[1], p[2] + 50] : p.slice()) };

  const near = [50, 50, 90], far = [50, 50, 10];
  const got = morphThrough([near, far], rest, moved);
  const movedNear = pmLen(pmSub(got.points[0], near));
  const movedFar = pmLen(pmSub(got.points[1], far));
  check("the point under the one that moved follows it most",
        movedNear > movedFar * 2, movedNear.toFixed(2) + " mm against " + movedFar.toFixed(2));
  check("and it follows it UPWARDS, not down", got.points[0][2] > near[2],
        show(got.points[0]));

  const went = cageMoved(rest, moved);
  check("cageMoved counts the one that moved and how far",
        went.moved === 1 && Math.abs(went.most - 50) < 1e-12, JSON.stringify(went));
  check("and reports nothing when the two are the same cage",
        cageMoved(rest, rest).moved === 0);
}

/* ================================================= 5. refusing the wrong pair

   The one thing the node cannot work out for itself.                        */

console.log("\n5. two cages that are not the same cage");
{
  const a = latticeCage(BOX, { nx: 2, ny: 2, nz: 2 });
  const b = latticeCage(BOX, { nx: 3, ny: 2, nz: 2 });
  check("a different number of points is refused and says so",
        /different numbers of points/.test(sameCage(a, b) || ""), sameCage(a, b));
  const wound = { ...a, faces: a.faces.map((f, i) => (i === 3 ? f.slice().reverse() : f)) };
  check("the same points wound differently is refused too",
        /wound differently/.test(sameCage(a, wound) || ""), sameCage(a, wound));
  check("and the same cage is accepted", sameCage(a, { ...a }) === null);
  let threw = "";
  try { morphThrough([[0, 0, 0]], a, b); } catch (e) { threw = e.message; }
  check("the morph itself refuses rather than deforming by nonsense",
        /have to be the same cage/.test(threw), threw);
}

/* ====================================================== 6. in the document

   The chain a person would build: a model, a lattice round it, something that
   moves the lattice, and the morph.                                         */

console.log("\n6. wired up in a document");
{
  const kernel = await createWasmKernel({ initModule,
    wasmBinary: readFileSync(WASM_DIR + "/replicad_single.wasm") });
  const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                        select: () => {}, selected: () => null });
  const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);

  const box = await mdl.run({ op: "add", type: "MeshBox", name: "Model" });
  for (const [k, v] of [["dx", 200], ["dy", 200], ["dz", 600],
                        ["segX", 4], ["segY", 4], ["segZ", 12]])
    await mdl.run({ op: "set", id: box.id, key: k, value: v });

  const lattice = await mdl.run({ op: "add", type: "CageLattice", name: "Lattice" });
  await mdl.run({ op: "connect", id: lattice.id, key: "mesh", from: box.id, mode: "only" });
  for (const [k, v] of [["nx", 1], ["ny", 1], ["nz", 3]])
    await mdl.run({ op: "set", id: lattice.id, key: k, value: v });
  const cage = await at(lattice.id);
  check("the lattice builds round the model", cage.built && !cage.error,
        cage.error || cage.note);
  check("and says how many control points, and that it is hollow",
        /\d+ control points/.test(cage.note || "") && /hollow/.test(cage.note || ""),
        cage.note);

  //! THE WHOLE IDEA: the lattice is an ordinary mesh, so an ordinary deformer
  //! drives it. Nothing here knows it is a lattice.
  const bend = await mdl.run({ op: "add", type: "CageDeform", name: "Bend the cage" });
  await mdl.run({ op: "connect", id: bend.id, key: "mesh", from: lattice.id, mode: "only" });
  await mdl.run({ op: "set", id: bend.id, key: "kind", value: DEFORMS.indexOf("Bend") });
  await mdl.run({ op: "set", id: bend.id, key: "angle", value: 60 });
  const bent = await at(bend.id);
  check("a deformer bends the lattice like any other mesh", bent.built && !bent.error,
        bent.error || bent.note);

  const morph = await mdl.run({ op: "add", type: "CageMorph", name: "Morph" });
  await mdl.run({ op: "connect", id: morph.id, key: "mesh", from: box.id, mode: "only" });
  await mdl.run({ op: "connect", id: morph.id, key: "rest", from: lattice.id, mode: "only" });
  await mdl.run({ op: "connect", id: morph.id, key: "moved", from: bend.id, mode: "only" });
  const done = await at(morph.id);
  check("and the model follows the cage", done.built && !done.error,
        done.error || done.note);
  check("the note says how far the cage went and how far the model did",
        /control points moved/.test(done.note || "")
        && /the mesh followed by at most/.test(done.note || ""), done.note);
  check("nothing was left behind, so the cage was closed", !/left where they were/
        .test(done.note || ""), done.note);

  //! THE MISTAKE EVERYBODY MAKES WITH THIS NODE: the same cage wired into both
  //! inputs. It builds, it is the right shape, and it has done nothing.
  await mdl.run({ op: "connect", id: morph.id, key: "moved", from: lattice.id,
                  mode: "only" });
  check("the same cage in both inputs says so rather than silently doing nothing",
        /THE CAGE HAS NOT MOVED/.test((await at(morph.id)).note || ""),
        (await at(morph.id)).note);
  await mdl.run({ op: "connect", id: morph.id, key: "moved", from: bend.id, mode: "only" });

  //! A cage that is not the same cage is refused by name at build time, not
  //! silently deformed by the difference between two unrelated meshes.
  const other = await mdl.run({ op: "add", type: "CageLattice", name: "Another" });
  await mdl.run({ op: "connect", id: other.id, key: "mesh", from: box.id, mode: "only" });
  for (const [k, v] of [["nx", 2], ["ny", 2], ["nz", 2]])
    await mdl.run({ op: "set", id: other.id, key: k, value: v });
  await mdl.run({ op: "connect", id: morph.id, key: "moved", from: other.id, mode: "only" });
  check("a different lattice is refused by name",
        /not the same cage/.test((await at(morph.id)).error || ""),
        (await at(morph.id)).error);
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
