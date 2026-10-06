// The form-finder, as two nodes in a real document.
//
// relax.test.mjs checks the arithmetic against answers worked out on paper.
// This checks the half that arithmetic cannot: that a Hold really does turn a
// curve in the parametric model into something the solver can be held to, that
// a chain of Holds is gathered by the Relax below them, that a Hold on its own
// changes NOTHING, and that the whole thing rebuilds when the curve it is held
// to is moved - which is the only reason to do any of this parametrically.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
                                      name: "Nets", units: "mm", features: [] } });
const add = async (type, more = {}) => (await mdl.run({ op: "add", type, ...more })).id;
const set = (id, key, value) => mdl.run({ op: "set", id, key, value });
const code = (id, key, text) => mdl.run({ op: "code", id, key, text });
const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);

//! The cage vertices of a built mesh, in the order the mesh holds them - which
//! is the order a Hold's vertex numbers mean. The viewer is sent these
//! unsplit, beside the triangles, exactly so the handles land on them.
const vertsOf = async id => {
  const got = (await kernel.mesh([id])).features[0];
  const v = (got && got.vertices) || [];
  const out = [];
  for (let i = 0; i + 2 < v.length; i += 3) out.push([v[i], v[i + 1], v[i + 2]]);
  return out;
};

const PT = await add("Point");
const VZ = await add("Vector"); await set(VZ, "dx", 0); await set(VZ, "dz", 1);
const PL = await add("Plane", { refs: { origin: PT, normal: VZ } });

console.log("1. a grid, and a curve in the model to hold it to");
{
  const GRID = await add("MeshGrid", { refs: { plane: PL } });
  await set(GRID, "width", 400); await set(GRID, "depth", 400);
  await set(GRID, "cols", 8); await set(GRID, "rows", 8);
  const before = await vertsOf(GRID);
  check("the grid builds", before.length === 81, String(before.length));
  check("and it is flat", before.every(p => near(p[2], 0)));

  //! A circle 200 above the grid, in the model. This is the thing the user
  //! asked for: pick a row, say "on that curve", and let the rest follow.
  const HIGH = await add("Point"); await set(HIGH, "z", 200);
  const HPL = await add("Plane", { refs: { origin: HIGH, normal: VZ } });
  const RING = await add("Circle", { refs: { plane: HPL } });
  await set(RING, "radius", 150);
  check("the circle builds", !(await at(RING)).error, (await at(RING)).error);

  //! The top row of the grid, by index: a 9 x 9 grid numbered row by row.
  const top = [];
  for (let i = 0; i < 9; i++) top.push(72 + i);
  const HOLD = await add("Hold", { refs: { mesh: GRID, onto: RING } });
  await code(HOLD, "verts", JSON.stringify(top));
  check("the hold builds", !(await at(HOLD)).error, (await at(HOLD)).error);

  //! THE CHECK THAT A HOLD IS A PROMISE AND NOT AN EDIT. Everything downstream
  //! of it reads the mesh it was given; a Hold that quietly pulled the mesh
  //! about would make a chain of them impossible to reason about, because the
  //! second one would be picking vertices on a mesh the first had moved.
  const held = await vertsOf(HOLD);
  check("and it changes nothing at all: the mesh comes out as it went in",
        held.length === before.length
        && held.every((p, i) => near(p[0], before[i][0]) && near(p[1], before[i][1])
                             && near(p[2], before[i][2])),
        held.length + " vertices");

  //! Pin the bottom row too, so the net has something to pull against.
  const bottom = [];
  for (let i = 0; i < 9; i++) bottom.push(i);
  const PIN = await add("Hold", { refs: { mesh: HOLD } });
  await code(PIN, "verts", JSON.stringify(bottom));

  const RELAX = await add("Relax", { refs: { mesh: PIN } });
  await set(RELAX, "rest", 1);                // pull to nothing
  await set(RELAX, "steps", 2000);
  check("the relax builds", !(await at(RELAX)).error, (await at(RELAX)).error);
  const after = await vertsOf(RELAX);
  check("it hands back a mesh of the same size", after.length === before.length,
        String(after.length));

  //! EVERY HELD VERTEX IS ON THE CIRCLE. 200 up, 150 out - and the tolerance
  //! is the sagitta of one chord of the sampled circle, which is arithmetic
  //! rather than a number chosen until it passed.
  let worstRing = 0, worstZ = 0;
  for (const v of top) {
    const p = after[v];
    worstRing = Math.max(worstRing, Math.abs(Math.hypot(p[0], p[1]) - 150));
    worstZ = Math.max(worstZ, Math.abs(p[2] - 200));
  }
  const sagitta = 150 * (1 - Math.cos(Math.PI / 200));
  check("every vertex of the held row is ON the circle",
        worstRing <= sagitta + 1e-6 && worstZ < 1e-6,
        worstRing.toFixed(5) + " off the radius, " + worstZ.toExponential(1) + " off its plane");
  //! AND THEY MOVED THERE. A hold that merely left them where they started
  //! would pass the line above and be no use.
  let slid = 0;
  for (const v of top)
    slid = Math.max(slid, Math.hypot(after[v][0] - before[v][0], after[v][1] - before[v][1],
                                     after[v][2] - before[v][2]));
  check("and they travelled to get there", slid > 100, slid.toFixed(1) + " mm");
  check("the pinned row did not move",
        bottom.every(v => near(after[v][0], before[v][0], 1e-9)
                       && near(after[v][2], before[v][2], 1e-9)));
  //! AND THE MIDDLE, WHICH NOBODY CONSTRAINED, IS BETWEEN THEM.
  const middle = after[36];
  check("and the rows nobody constrained are stretched between the two",
        middle[2] > 5 && middle[2] < 195, "the centre sits at z " + middle[2].toFixed(1));

  //! WHAT IT DID, in words, because a relaxation that ran out of steps and one
  //! that settled look the same on screen.
  const said = (await at(RELAX)).note || "";
  check("and it says how far it got, and whether that was far enough",
        /steps/.test(said) && /settled|still moving/.test(said), said);

  /* ------------------------------------------ and it is parametric, which is
     the whole reason for doing it this way rather than in a mesh editor. */
  await set(RING, "radius", 60);
  const tighter = await vertsOf(RELAX);
  let worstNow = 0;
  for (const v of top) worstNow = Math.max(worstNow,
    Math.abs(Math.hypot(tighter[v][0], tighter[v][1]) - 60));
  check("change the circle and the whole net is found again",
        worstNow <= 60 * (1 - Math.cos(Math.PI / 200)) + 1e-6, worstNow.toFixed(5));
  await set(HIGH, "z", 320);
  const taller = await vertsOf(RELAX);
  check("move the circle up and it follows",
        top.every(v => near(taller[v][2], 320, 1e-6)), String(taller[72][2]));
}

console.log("\n2. the newest hold wins where two of them name the same vertex");
{
  const GRID = await add("MeshGrid", { refs: { plane: PL } });
  await set(GRID, "cols", 3); await set(GRID, "rows", 3);
  const A = await add("Point"); await set(A, "x", 1000); await set(A, "z", 500);
  const B = await add("Point"); await set(B, "x", -1000); await set(B, "z", -500);
  const H1 = await add("Hold", { refs: { mesh: GRID, onto: A } });
  await code(H1, "verts", "[0]");
  const H2 = await add("Hold", { refs: { mesh: H1, onto: B } });
  await code(H2, "verts", "[0]");
  const R = await add("Relax", { refs: { mesh: H2 } });
  await set(R, "steps", 40);
  check("the chain builds", !(await at(R)).error, (await at(R)).error);
  const got = await vertsOf(R);
  check("the vertex is where the LAST hold put it, not the first",
        near(got[0][0], -1000, 1e-6) && near(got[0][2], -500, 1e-6),
        JSON.stringify(got[0]));
}

console.log("\n3. a hold that has lost its vertices says so rather than guessing");
{
  const GRID = await add("MeshGrid", { refs: { plane: PL } });
  await set(GRID, "cols", 2); await set(GRID, "rows", 2);      // 9 vertices
  const H = await add("Hold", { refs: { mesh: GRID } });
  await code(H, "verts", "[0, 4, 900]");
  const row = await at(H);
  check("it refuses, and says how many vertices there really are",
        /not on this mesh any more/.test(row.error || "") && /9/.test(row.error || ""),
        row.error);
  await code(H, "verts", "[]");
  check("and a hold with nothing picked says what to do about it",
        /open the mesh, select some/.test((await at(H)).error || ""), (await at(H)).error);
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
