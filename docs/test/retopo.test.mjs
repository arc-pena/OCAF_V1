// Retopology: any mesh down to a cage of about the number of faces you asked
// for, in quads.
//
// THE COUNT IS THE EASY HALF AND THE ONE THAT PROVES NOTHING. A retopology
// that hit the face count and lost the shape is still a mesh: it draws, it is
// closed, it has exactly the right number of faces, and it is wrong. So every
// section here measures something the count cannot see - how far the result
// moved from the surface it came from, whether the arrises are still arrises,
// whether the thing is still a surface at all.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { templateMesh, topologyOf, faceNormal, pmSub, pmLen, pmDot } from "../src/polymesh.js";
import { retopologise, deviationFrom, asTriangles, decimate } from "../src/retopo.js";
import { readFileSync } from "fs";

const WASM_DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const initModule = (await import(WASM_DIR + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

const BOX = () => templateMesh("box", { dx: 400, dy: 400, dz: 400, segX: 6, segY: 6, segZ: 6 });
const BALL = () => templateMesh("sphere", { radius: 500, rings: 16, sides: 32 });
const RING = () => templateMesh("torus", { inner: 200, outer: 500, sides: 32, rings: 24 });

//! Open and non-manifold edges. A decimator that drops the link condition
//! produces meshes that look perfectly good and are no longer surfaces - two
//! faces folded onto one edge draws exactly like one face.
const edgesOf = mesh => {
  const topo = topologyOf(mesh);
  let open = 0, over = 0;
  for (const [, e] of topo.edges) {
    if (e.faces.length === 1) open++;
    else if (e.faces.length > 2) over++;
  }
  return { open, over, total: topo.edges.size };
};

console.log("1. it lands on the face count it was given");
{
  for (const [name, make, wants] of [["box", BOX, [200, 100, 40]],
                                     ["sphere", BALL, [150, 60]],
                                     ["torus", RING, [300, 120]]]) {
    const mesh = make();
    for (const want of wants) {
      const got = retopologise(mesh, { faces: want });
      //! WITHIN A TENTH, not exactly. Pairing t triangles into quads gives
      //! t - p faces and p is whatever the matching found, so the count is
      //! aimed at and then reported - see the note the node writes. A tolerance
      //! wider than this would stop the check meaning anything.
      check(name + ": " + want + " asked, " + got.faces + " made",
            Math.abs(got.faces - want) <= Math.max(2, want * 0.1),
            got.quads + " quads, " + got.tris + " triangles");
    }
  }
}

console.log("2. and it is still a surface afterwards");
{
  //! THE LINK CONDITION, which is the one thing in the decimation that cannot
  //! be seen. A collapse that joins two vertices sharing more than the two
  //! triangles on their edge folds the mesh onto itself: the result still has
  //! faces, still draws, still measures a volume, and is not a manifold. It
  //! would then refuse to sew downstream and the message would be about
  //! sewing.
  for (const [name, make] of [["box", BOX], ["sphere", BALL], ["torus", RING]]) {
    const mesh = make();
    const was = edgesOf(mesh);
    check(name + " starts closed and manifold", was.open === 0 && was.over === 0,
          was.open + " open, " + was.over + " non-manifold");
    for (const want of [200, 60, 20]) {
      const got = retopologise(mesh, { faces: want });
      const now = edgesOf(got.mesh);
      check(name + " at " + got.faces + " faces is still closed and manifold",
            now.open === 0 && now.over === 0,
            now.open + " open, " + now.over + " non-manifold");
    }
  }
}

console.log("3. a flat run costs nothing and a crease is not crossed");
{
  //! THE WHOLE POINT OF CARRYING A MATRIX rather than a distance. Every vertex
  //! in the middle of a box's face has one plane in its quadric, so collapsing
  //! it costs exactly zero and the face comes back as a handful of big quads.
  //! Every vertex on an arris has two planes that disagree, so moving it costs
  //! a great deal and the arris stays where it was drawn. A decimator scored by
  //! edge length would round the box off and still hit the face count.
  const box = BOX();
  for (const want of [150, 60, 20]) {
    const got = retopologise(box, { faces: want });
    const off = deviationFrom(box, got.mesh);
    check("box at " + got.faces + " faces has not moved at all",
          off.worst < 1e-9, "worst " + off.worst.toExponential(2) + " mm");
  }
  //! And the faces really are flat - a quad merged across an arris would be a
  //! bent quad, and bending is the only place it would show.
  const got = retopologise(box, { faces: 60 });
  let bend = 0;
  for (const face of got.mesh.faces) {
    if (face.length < 4) continue;
    const n = faceNormal(got.mesh, face);
    const at = face.map(i => got.mesh.points[i]);
    const mid = at.reduce((a, p) => [a[0]+p[0], a[1]+p[1], a[2]+p[2]], [0,0,0]).map(v => v / face.length);
    let far = 0, size = 1e-9;
    for (const p of at) {
      far = Math.max(far, Math.abs(pmDot(n, pmSub(p, mid))));
      size = Math.max(size, pmLen(pmSub(p, mid)));
    }
    bend = Math.max(bend, far / size);
  }
  check("and no quad was merged across one", bend < 1e-9,
        "worst bend " + (bend * 100).toFixed(3) + "% of its own size");
}

console.log("4. a curved shape keeps its shape, and gives it up gracefully");
{
  //! The number that says whether it worked. A sphere cannot come back exact -
  //! fewer faces IS a coarser sphere - so what is checked is that the error
  //! behaves: small when there are faces to spend, growing as they are taken
  //! away, and never wild.
  const ball = BALL();
  const seen = [];
  for (const want of [300, 150, 60, 24]) {
    const got = retopologise(ball, { faces: want });
    const off = deviationFrom(ball, got.mesh);
    seen.push(off.worst / off.size);
    check("sphere at " + String(got.faces).padStart(3) + " faces is within "
          + (100 * off.worst / off.size).toFixed(2) + "% of the original",
          off.worst / off.size < 0.25,
          "mean " + (100 * off.mean / off.size).toFixed(3) + "%");
  }
  check("and the error grows as the faces go, rather than jumping about",
        seen.every((v, i) => !i || v >= seen[i - 1] - 1e-9),
        seen.map(v => (v * 100).toFixed(2) + "%").join(" < "));
}

console.log("5. the pairing: as many quads as the matching can find");
{
  //! The augmenting pass in \ref quadrangulate, measured where it matters.
  //! Greedy best-first matching strands triangles that nothing is wrong with,
  //! and on a decimated organic mesh that was a third of the gap.
  const ball = BALL();
  for (const angle of [40, 70]) {
    const got = retopologise(ball, { faces: 200, angle });
    const share = got.quads / got.faces;
    check("sphere, pairing up to " + angle + "°: "
          + Math.round(share * 100) + "% quads", share > 0.6,
          got.quads + " quads, " + got.tris + " triangles");
  }
  //! And asking for triangles really gives triangles, so the choice is a
  //! choice rather than a label.
  const flat = retopologise(ball, { faces: 200, quads: false });
  check("triangles only gives no quads at all",
        flat.quads === 0 && flat.tris === flat.faces, flat.faces + " faces");
}

console.log("6. an open mesh keeps its outline");
{
  //! A decimated sheet that lost its boundary is a sheet of a different size,
  //! and nothing about the face count says so. The rim is held by a heavy
  //! plane quadric rather than by locking vertices, so a straight run of rim
  //! still simplifies - what must not happen is the outline MOVING.
  const sheet = templateMesh("grid", { width: 600, depth: 600, cols: 12, rows: 12 });
  const was = edgesOf(sheet);
  check("the sheet starts open", was.open > 0, was.open + " open edges");
  const got = retopologise(sheet, { faces: 40 });
  const now = edgesOf(got.mesh);
  check("and is still open afterwards", now.open > 0, now.open + " open edges");
  const corners = m => {
    const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
    for (const p of m.points) for (let i = 0; i < 3; i++) {
      lo[i] = Math.min(lo[i], p[i]); hi[i] = Math.max(hi[i], p[i]);
    }
    return [lo, hi];
  };
  const [lo0, hi0] = corners(sheet), [lo1, hi1] = corners(got.mesh);
  check("and it is exactly the same size", pmLen(pmSub(lo0, lo1)) < 1e-9
        && pmLen(pmSub(hi0, hi1)) < 1e-9,
        "[" + lo1.map(Math.round) + "] .. [" + hi1.map(Math.round) + "]");
  //! EVERY RIM VERTEX IS STILL THERE, which the bounding box above cannot
  //! tell you: the corners are the last thing to move, so an outline that has
  //! crept inwards everywhere else still measures the same box. The rim is
  //! held by refusing to remove a vertex that is on it, so this is exact.
  const rimOf = m => {
    const topo = topologyOf(m);
    const on = new Set();
    for (const [, e] of topo.edges)
      if (e.faces.length === 1) { on.add(m.points[e.a].join()); on.add(m.points[e.b].join()); }
    return on;
  };
  const was2 = rimOf(sheet), now2 = rimOf(got.mesh);
  check("and every rim vertex is exactly where it was",
        was2.size === now2.size && [...was2].every(k => now2.has(k)),
        now2.size + " of " + was2.size + " kept");
  check("while the inside did come down", got.faces < sheet.faces.length,
        sheet.faces.length + " faces -> " + got.faces);
}

/* ====================================================== and in the kernel */

const kernel = await createWasmKernel({
  initModule, wasmBinary: readFileSync(WASM_DIR + "/replicad_single.wasm"),
});
const mdl = new Mdl({
  kernel, setNode: () => {}, readLayout: () => ({}), select: () => {}, selected: () => null,
});
const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
  name: "Retopo", units: "mm", features: [] } });

console.log("7. the node, and what it says it did");
{
  const cage = await mdl.run({ op: "add", type: "MeshTemplate", name: "Ball" });
  await mdl.run({ op: "set", id: cage.id, key: "kind", value: 10 });     // sphere
  await mdl.run({ op: "set", id: cage.id, key: "sides", value: 32 });
  await mdl.run({ op: "set", id: cage.id, key: "rings", value: 16 });
  const thin = await mdl.run({ op: "add", type: "Retopologise", name: "Cage" });
  await mdl.run({ op: "connect", id: thin.id, key: "mesh", from: cage.id });
  await mdl.run({ op: "set", id: thin.id, key: "faces", value: 120 });

  const entry = await at(thin.id);
  check("it built", entry.built && !entry.error, entry.error || entry.note);
  check("and it is a mesh", entry.produces === "mesh" && entry.data.kind === "mesh");
  check("the note says what it made and how far it moved",
        /triangles → \d+ faces/.test(entry.note || "")
        && /% of its size/.test(entry.note || ""), entry.note);

  //! THE REASON THIS NODE EXISTS: what comes out is a cage, so the NURBS
  //! conversion gives a patch per cage face instead of one per triangle.
  const smooth = await mdl.run({ op: "add", type: "MeshToNurbs", name: "Smooth" });
  await mdl.run({ op: "connect", id: smooth.id, key: "mesh", from: thin.id });
  const made = await at(smooth.id);
  check("and the NURBS conversion takes it", made.built && !made.error,
        made.error || made.note);
  const patches = Number((made.note || "").match(/^(\d+) NURBS/)?.[1]);
  check("one patch per cage face, not per triangle", patches > 0 && patches < 300,
        made.note);

  //! Asking for more faces than there are is refused by name rather than
  //! quietly handing the mesh back.
  await mdl.run({ op: "set", id: thin.id, key: "faces", value: 90000 });
  check("asking for more than it has is refused, by name",
        /already has \d+ faces/.test((await at(thin.id)).error || ""),
        (await at(thin.id)).error);
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
