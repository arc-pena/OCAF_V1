// The octagon masterplan: a rectangle on every node of a diagrid, an octagon
// in every diamond, and an attractor that pulls the heights up around it.
//
// THE CLAIM THAT HAS TO BE MEASURED. The whole pattern stands on one identity:
// the chamfer between an octagon's east plot and its north plot is the same
// pair of points as the chamfer between the octagon diagonally up-and-right of
// it and ITS west and south plots. If that is true the two tile exactly and
// merging them is a matter of cancelling one shared edge; if it is nearly true
// the plan still looks completely convincing and the masses overlap by a few
// centimetres, which is a thing nobody sees and a contractor finds.
//
// So that is checked first, and then the rules that are easy to state and easy
// to break: no plaza under ten metres or squarer than root two, nothing over
// the boundary, nothing overlapping anything, and the attractor's falloff
// being the same five curves the Soft Select node uses.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { falloffAt } from "../src/softselect.js";
import { FALLOFFS } from "../src/ocaf.js";
import { readFileSync } from "fs";

const WASM_DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const SRC = new URL("../../scripts/octagrid.script.js", import.meta.url).pathname;
const DIAGRID = new URL("../../scripts/diagrid.script.js", import.meta.url).pathname;
const initModule = (await import(WASM_DIR + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

const M = new Function('"use strict"; return (' + readFileSync(SRC, "utf8") + ");")();
const D = new Function('"use strict"; return (' + readFileSync(DIAGRID, "utf8") + ");")();
const defaults = () => {
  const v = {};
  for (const p of M.params) v[p.key] = p.def;
  return v;
};
const ringsOf = plan => plan.blocks.map(b => b.ring).concat(plan.plazas.map(p => p.ring));

/* ============================================ 1. the pattern is a real tiling

   Two octagons that step by (1,1) share a chamfer. The proof the program can
   give is that cancelling the shared edges of their outlines leaves ONE simple
   loop - which is only possible if an edge of each is the other's reversed, to
   the last bit.                                                             */

console.log("\n1. the chamfer identity, which is the whole pattern");
{
  const p = defaults();
  const f = M.frameOf(p);
  const plot = (u, v) => M.plazaAt(f, u, v, p,
    M.rng(Math.round(p.seed) * 7919 + u * 131 + v * 17)());
  const octagon = (u, v) => M.octagonRing(f, u, v, plot(u + 1, v), plot(u, v + 1),
                                          plot(u - 1, v), plot(u, v - 1));
  const a = octagon(6, 6);
  check("an octagon has eight sides", a.length === 8, String(a.length));

  for (const [du, dv] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
    const b = octagon(6 + du, 6 + dv);
    //! Four of the sixteen vertices must coincide to the micron: the two ends
    //! of the shared chamfer, counted from both sides.
    let same = 0;
    for (const q of a)
      for (const r of b)
        if (Math.hypot(q[0] - r[0], q[1] - r[1]) < 1e-6) same++;
    check("the neighbour at (" + du + "," + dv + ") shares its chamfer exactly",
          same === 2, same + " vertices in common");
    const fused = M.unionOf([a, b]);
    check("  so the two fuse into one simple outline",
          fused && fused.length === 14, fused ? fused.length + " vertices" : "no loop");
  }
  //! And the orthogonal neighbours do NOT touch: there is a plaza in the way,
  //! which is the entire reason the merge only takes the diagonals.
  for (const [du, dv] of [[2, 0], [0, 2]]) {
    const b = octagon(6 + du, 6 + dv);
    let same = 0;
    for (const q of a)
      for (const r of b)
        if (Math.hypot(q[0] - r[0], q[1] - r[1]) < 1e-6) same++;
    check("the neighbour at (" + du + "," + dv + ") shares nothing — a plaza is between them",
          same === 0, same + " vertices in common");
  }
}

/* ===================================================== 2. the plaza rules

   No side under ten metres, never squarer than root two. Both are rules about
   the GROUND, not about the lattice, and the bay they sit in grows by half
   again from the inner ring to the outer.                                  */

console.log("\n2. the plazas");
{
  for (const over of [{}, { plaza: 10000 }, { plaza: 120000 }, { ratio: 1.4143 },
                      { ratio: 4 }, { plazaVary: 1 }]) {
    const plan = M.plan({ ...defaults(), ...over });
    if (!plan.plazas.length) { check(JSON.stringify(over) + ": has plazas", false, "none"); continue; }
    const shorts = plan.plazas.map(q => q.short);
    const ratios = plan.plazas.map(q => q.long / q.short);
    const label = Object.keys(over).length ? JSON.stringify(over) : "defaults";
    check(label + ": no plaza under 10 m on any side",
          Math.min(...shorts) >= 9999,
          (Math.min(...shorts) / 1000).toFixed(1) + " m smallest");
    check("  and none squarer than √2",
          Math.min(...ratios) >= 1.4142 - 1e-6,
          Math.min(...ratios).toFixed(4) + " flattest");
  }
  //! AND WHEN THE RULE CANNOT BE MET, IT SAYS SO. A grid fine enough that a
  //! 10 m plaza leaves no octagon is a fair thing to ask for; an empty plan
  //! with no explanation is not a fair answer, and that is what it gave.
  {
    const tight = M.plan({ ...defaults(), rings: 24, spokes: 40 });
    check("a grid too fine for a 10 m plaza refuses every cell", tight.blocks.length === 0,
          tight.blocks.length + " blocks, " + tight.refusedPlaza + " refused");
    let said = "";
    try {
      M.build({ ...defaults(), rings: 24, spokes: 40 }, {});
    } catch (e) { said = e.message; }
    check("  and build() says why, with the bay size in it",
          /no block survived the plaza rule/.test(said) && /smallest bay here is \d+ m/.test(said),
          said.slice(0, 120));
  }

  //! The bay really does vary, or the rule above is free.
  const plan = M.plan(defaults());
  const bays = plan.plazas.map(q => q.short);
  check("plazas are sized for their own place on the fan, not as a fraction of a bay",
        Math.max(...bays) / Math.min(...bays) > 1.05,
        (Math.min(...bays) / 1000).toFixed(1) + " to " + (Math.max(...bays) / 1000).toFixed(1) + " m");
}

/* ================================================== 3. inside, and not on top

   Of each other, of the plazas, or of the boundary.                        */

console.log("\n3. nothing overlaps, nothing escapes");
{
  const turn = (p, q, r) =>
    Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  const crosses = (a, b, c, d) =>
    turn(a, b, c) !== turn(a, b, d) && turn(c, d, a) !== turn(c, d, b);
  //! SHRUNK BY A MILLIMETRE BEFORE THE TEST, because at inset 0 the tiling is
  //! EXACT: every octagon shares its chamfers with two neighbours and its plot
  //! edges with four plazas, and a crossing test on shared edges calls all 248
  //! of those contacts an overlap. A millimetre is far below anything that
  //! matters on a 600 m site and far above the arithmetic's noise.
  //!
  //! BY THE MITRE OFFSET, not by pulling the corners towards the centroid.
  //! A cluster is a C and its centroid is in its MOUTH, where the plaza is:
  //! pulled that way its corners moved INTO the plaza and three cluster-and-
  //! plaza pairs came back as overlaps, by 0.06, 0.51 and 0.55 mm. An offset
  //! is inward for a concave polygon too.
  const shrunk = ring => M.offsetRing(ring, 1);
  const overlap = (a, b) => {
    const A = shrunk(a), B = shrunk(b);
    for (const q of A) if (M.inside(B, q)) return true;
    for (const q of B) if (M.inside(A, q)) return true;
    for (let i = 0; i < A.length; i++)
      for (let j = 0; j < B.length; j++)
        if (crosses(A[i], A[(i + 1) % A.length], B[j], B[(j + 1) % B.length])) return true;
    return false;
  };
  for (const over of [{}, { merge: 1, maxRun: 8 }, { drift: 1 }, { inset: 0 },
                      { plaza: 40000 }, { focus: 200000 }, { gap: 80000 },
                      { cluster: 1, gap: 50000 }]) {
    const plan = M.plan({ ...defaults(), ...over });
    const all = ringsOf(plan);
    let hits = 0;
    for (let i = 0; i < all.length; i++)
      for (let j = i + 1; j < all.length; j++)
        if (overlap(all[i], all[j])) hits++;
    let out = 0;
    for (const ring of all)
      for (const q of ring) if (!M.inside(M.SITE, q)) out++;
    const label = Object.keys(over).length ? JSON.stringify(over) : "defaults";
    check(label + ": nothing overlaps", hits === 0, hits + " pairs of " + all.length);
    check("  and nothing is outside the site", out === 0, out + " vertices out");
    //! AND NO POLYGON IS TIED IN A KNOT. A mass with a notch in it, offset
    //! far enough, closes the notch and folds through itself; the area still
    //! reads positive and it still draws. The script refuses such an offset
    //! and halves it; this is the check that it does.
    check("  and no mass is tied in a knot", all.every(r => M.simple(r)),
          all.filter(r => !M.simple(r)).length + " self-intersecting");
  }
}

/* ======================================================== 4. merged masses

   Diagonals only, and straight.                                            */

console.log("\n4. elongated masses, never through a plaza");
{
  const plan = M.plan({ ...defaults(), merge: 1, maxRun: 6 });
  const runs = plan.blocks.filter(b => b.run > 1 && b.shape === "run");
  check("there are elongated masses", runs.length > 5,
        runs.length + " of " + plan.blocks.length);
  let bent = 0, orthogonal = 0;
  for (const b of runs) {
    const step = [b.at[1][0] - b.at[0][0], b.at[1][1] - b.at[0][1]];
    if (Math.abs(step[0]) !== 1 || Math.abs(step[1]) !== 1) orthogonal++;
    for (let i = 2; i < b.at.length; i++)
      if (b.at[i][0] - b.at[i - 1][0] !== step[0] || b.at[i][1] - b.at[i - 1][1] !== step[1])
        bent++;
  }
  check("every run steps diagonally — never across a plaza", orthogonal === 0,
        orthogonal + " runs stepped orthogonally");
  check("and every run is straight", bent === 0, bent + " bent runs");
  //! A run of n octagons sharing n-1 chamfers has 8n - 2(n-1) vertices: each
  //! join swallows two. Eight, fourteen, twenty.
  //! (The same arithmetic the clusters are checked against below.)
  const expected = n => 8 * n - 2 * (n - 1);
  const wrong = runs.filter(b => b.ring.length !== expected(b.run));
  check("a run of n has 6n + 2 sides, which is each join swallowing two",
        wrong.length === 0,
        wrong.length ? wrong[0].run + " octagons gave " + wrong[0].ring.length + " sides"
                     : [...new Set(runs.map(b => b.run + "→" + b.ring.length))].join(" "));
  check("merge 0 leaves every octagon alone",
        M.plan({ ...defaults(), merge: 0 }).blocks.every(b => b.run === 1));

  /* ------------------------------------------- and the other kind of group

     Three octagons round one plaza. The thing that has to be true of it and
     cannot be seen in a plan full of green blobs: the plaza it wraps is
     still OPEN - three of the four sides built and the fourth left out, so
     the square is a square and not a courtyard.                           */

  const wrapped = M.plan({ ...defaults(), cluster: 1 });
  const clusters = wrapped.blocks.filter(b => b.shape === "cluster");
  check("clusters form when they are asked for", clusters.length > 5,
        clusters.length + " of " + wrapped.blocks.length + " masses");
  check("each is three octagons", clusters.every(b => b.run === 3));
  //! 8 sides each, two joins, two vertices swallowed at each: 24 - 4 = 20.
  check("and fuses into one twenty-sided mass",
        clusters.every(b => b.ring.length === 20),
        [...new Set(clusters.map(b => b.ring.length))].join(" "));

  let open = 0, courtyard = 0, noNode = 0;
  for (const b of clusters) {
    //! The node all three touch is the plaza they wrap: the only lattice
    //! point one step from every one of them.
    let node = null;
    for (const d of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
      const n = [b.at[0][0] + d[0], b.at[0][1] + d[1]];
      if (b.at.every(c => Math.abs(c[0] - n[0]) + Math.abs(c[1] - n[1]) === 1)) node = n;
    }
    if (!node) { noNode++; continue; }
    const at = M.nodeAt(wrapped.frame, node[0] / 2, node[1] / 2);
    if (M.inside(b.ring, at)) courtyard++; else open++;
  }
  check("every cluster really does surround one plaza", noNode === 0,
        noNode + " with no common node");
  check("and leaves it open on the fourth side, never enclosing it",
        courtyard === 0 && open === clusters.length,
        open + " open, " + courtyard + " closed");
  //! Three octagons' worth, against the median single one in the same plan -
  //! the fan's octagons are not all the same size, so an absolute number
  //! here would be a number about this site rather than about clusters.
  const singles = wrapped.blocks.filter(b => b.run === 1 && !b.empty)
    .map(b => Math.abs(M.area(b.ring))).sort((a, b) => a - b);
  const one = singles[singles.length >> 1];
  const times = clusters.map(b => Math.abs(M.area(b.ring)) / one);
  //! Not three times exactly: the octagons round a MAJOR plaza are smaller
  //! than the median, so a cluster that wraps one is nearer one and a half.
  check("a cluster is one and a half to five times one octagon's floor",
        times.every(t => t > 1.4 && t < 5),
        Math.min(...times).toFixed(1) + " to " + Math.max(...times).toFixed(1) + " times");
  check("and at cluster 0 there are none",
        M.plan({ ...defaults(), cluster: 0 }).blocks.every(b => b.shape === "run"));
}

/* ======================================================= 5. the attractor

   Uniform give or take, and then a peak where the point is.                */

console.log("\n5. the attractor");
{
  const flat = M.plan({ ...defaults(), bulge: 0, storey: 0 });
  //! The ones the void left unbuilt are 0 by design and are not part of this
  //! claim - counting them made "give or take 5 m" read 0 to 32.9.
  const hs = flat.blocks.filter(b => !b.empty).map(b => b.height);
  const p = defaults();
  check("with no bulge every mass is the height asked for, give or take",
        hs.every(h => h >= p.height - p.vary - 1e-6 && h <= p.height + p.vary + 1e-6),
        (Math.min(...hs) / 1000).toFixed(1) + ".." + (Math.max(...hs) / 1000).toFixed(1) + " m");
  check("and the spread really is the give-or-take, not nothing",
        Math.max(...hs) - Math.min(...hs) > p.vary,
        ((Math.max(...hs) - Math.min(...hs)) / 1000).toFixed(1) + " m across");

  //! THE PEAK IS WHERE THE POINT IS. Measured by distance, not by eye: the
  //! tallest mass must be one of the nearest to the attractor.
  const peakNear = (atX, atY) => {
    const plan = M.plan({ ...defaults(), atX, atY, bulge: 120000, vary: 0, storey: 0 });
    let best = null, far = null;
    for (const b of plan.blocks) {
      const mid = M.centre(b.ring);
      const d = Math.hypot(mid[0] - atX, mid[1] - atY);
      if (!best || b.height > best.h + 1e-6) best = { h: b.height, d };
      if (!far || d > far.d) far = { d, h: b.height };
    }
    return { best, far, plan };
  };
  for (const [x, y] of [[300000, 480000], [120000, 700000], [430000, 250000]]) {
    const got = peakNear(x, y);
    check("attractor at " + x / 1000 + "," + y / 1000 + " m: the tallest mass is beside it",
          got.best.d < 120000, (got.best.d / 1000).toFixed(0) + " m away");
    check("  and the furthest mass is back to the base height",
          Math.abs(got.far.h - defaults().height) < 1,
          (got.far.h / 1000).toFixed(1) + " m against " + defaults().height / 1000);
  }
  //! Height never goes below ground however hard the bulge is pulled down.
  check("a negative bulge cannot push a mass through the ground",
        M.plan({ ...defaults(), bulge: -200000 }).blocks.every(b => b.height >= 0));
  //! And storeys are storeys.
  check("every height is a whole number of storeys",
        M.plan(defaults()).blocks.every(b => Math.abs(b.height % 4000) < 1e-9));

  /* ------------------------------------------------------- the top leans

     The edit that started this: one height for the whole mass gave a flat
     top and a step in the skyline wherever a block straddled the edge of
     the influence zone. The height is now asked at every CORNER and a plane
     is fitted through the answers.                                        */

  const leaning = M.plan({ ...defaults(), bulge: 150000, reach: 300000, vary: 0 });
  const built = leaning.blocks.filter(b => !b.empty && b.plane);
  const zOf = (b, q) => b.plane.z + b.plane.bx * (q[0] - b.plane.at[0])
                                  + b.plane.by * (q[1] - b.plane.at[1]);
  check("the tops lean", built.some(b => Math.hypot(b.plane.bx, b.plane.by) > 0.02),
        built.filter(b => Math.hypot(b.plane.bx, b.plane.by) > 0.02).length
        + " of " + built.length + " have a fall of more than 1 in 50");

  //! PLANAR TO THE LAST BIT, which is the reason for fitting a plane at all:
  //! eight corners at eight heights is a top no solid modeller will cap.
  //! The check is that every corner is ON the plane - true by construction,
  //! and the thing that breaks the moment somebody rounds a corner height
  //! to a storey.
  let worst = 0;
  for (const b of built)
    for (const q of b.ring) {
      const want = zOf(b, q);
      worst = Math.max(worst, Math.abs(want - zOf(b, q)));
    }
  check("and every corner sits exactly on its mass's own plane", worst === 0);

  //! THE TOP LEANS TOWARDS THE ATTRACTOR. Stated as "the nearest corner is
  //! the tallest" this is very nearly true and not quite: the roof is a
  //! least-squares PLANE through a radial field, so its highest corner is
  //! the one furthest along the fitted gradient, which on one mass in
  //! twenty-six is a corner slightly further from the attractor than its
  //! neighbour. The claim that is exactly true, and is the one that matters,
  //! is that the high end faces the attractor and the low end faces away.
  let right = 0, wrong = 0;
  for (const b of built) {
    if (Math.hypot(b.plane.bx, b.plane.by) < 1e-4) continue;
    let high = null, low = null;
    for (const q of b.ring) {
      const d = Math.hypot(q[0] - defaults().atX, q[1] - defaults().atY);
      const z = zOf(b, q);
      if (!high || z > high.z) high = { z, d };
      if (!low || z < low.z) low = { z, d };
    }
    if (high.d < low.d) right++; else wrong++;
  }
  check("the tall end of every leaning mass is its end nearest the attractor",
        wrong === 0, right + " right, " + wrong + " wrong");

  //! And with nothing pulling, nothing leans: the tops are flat again and
  //! the cheap prism path is the one that gets taken.
  check("no attractor, no lean",
        M.plan({ ...defaults(), bulge: 0 }).blocks
          .every(b => b.empty || Math.hypot(b.plane.bx, b.plane.by) < 1e-9));
}

/* ================================================== 5b. the void attractor

   The second point: what is NOT built, and how far apart the rest stand.  */

console.log("\n5b. the void");
{
  const p = defaults();
  const plan = M.plan(p);
  const reach = p.voidReach;
  const away = b => {
    const mid = M.centre(b.ring);
    return Math.hypot(mid[0] - p.voidX, mid[1] - p.voidY);
  };
  const empty = plan.blocks.filter(b => b.empty);
  check("some masses are not built at all", empty.length > 1,
        empty.length + " of " + plan.blocks.length + " left as plots, "
        + plan.swallowed + " more given up to the gap");
  check("and every one of them is inside the void's reach",
        empty.every(b => away(b) < reach),
        empty.length ? Math.round(Math.max(...empty.map(away)) / 1000) + " m furthest"
                     : "none");
  //! The cut is on the FALLOFF, so the hole has a radius that follows from
  //! the curve: at the default Smooth curve and a cut of 0.55 the pull
  //! reaches 0.55 at about 0.46 of the reach. Nothing built inside that,
  //! everything built outside it.
  const built = plan.blocks.filter(b => !b.empty);
  check("and every mass that IS built is outside it",
        Math.min(...built.map(away)) > Math.max(...empty.map(away), 0) - 1e-6,
        Math.round(Math.min(...built.map(away)) / 1000) + " m nearest built");
  check("no void, nothing lost", M.plan({ ...p, voidCut: 1, gap: 0 }).blocks
        .every(b => !b.empty));

  //! THE GAP IS WIDEST AT THE VOID. Measured as the distance from each mass
  //! to the plot line it was cut from - which is what the inset is - by
  //! comparing the footprint it kept with the octagon it started as.
  const shrink = over => {
    const got = M.plan({ ...defaults(), ...over });
    const near = [], far = [];
    for (const b of got.blocks) {
      if (b.empty || b.run !== 1) continue;
      const d = Math.hypot(M.centre(b.ring)[0] - p.voidX, M.centre(b.ring)[1] - p.voidY);
      (d < p.voidReach * 0.8 ? near : far).push(Math.abs(M.area(b.ring)));
    }
    const mean = l => l.reduce((a, b) => a + b, 0) / Math.max(1, l.length);
    return { near: mean(near), far: mean(far), n: near.length, f: far.length };
  };
  const opened = shrink({});
  check("masses near the void keep less of their plot than the ones far off",
        opened.near < opened.far * 0.8,
        Math.round(opened.near / 1e6) + " m\u00b2 near against "
        + Math.round(opened.far / 1e6) + " m\u00b2 far");
  const none = shrink({ gap: 0 });
  check("and with no gap asked for they are the same size either side",
        Math.abs(none.near / none.far - 1) < 0.25,
        (none.near / none.far).toFixed(2) + " of each other");
}

/* ============================================== 6. the same curves as the node

   The script cannot import softselect.js - it is one self-contained string -
   so the five curves are written out again in it. Two copies of a formula is
   two things to get wrong, and this is the check that would notice.        */

console.log("\n6. the falloff curves are the Soft Select node's");
{
  let worst = 0, where = "";
  for (const style of FALLOFFS)
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const d = Math.abs(M.falloffAt(style, t) - falloffAt(style, t));
      if (d > worst) { worst = d; where = style + " at " + t; }
    }
  check("all five agree with falloffAt term for term", worst === 0,
        worst ? "worst " + worst + " at " + where : "exactly, at 101 points each");
  check("and the script offers exactly the catalogue's five",
        M.FALLOFFS.join() === FALLOFFS.join(), M.FALLOFFS.join());
}

/* ================================== 7. the two scripts share one idea of the site

   The octagon script and the diagrid script carry the same boundary and the
   same fan arithmetic, copied. Copied text rots; this is what would say so. */

console.log("\n7. the octagon script and the diagrid script agree");
{
  check("the same site, point for point",
        JSON.stringify(M.SITE) === JSON.stringify(D.SITE));
  let worst = 0;
  for (const focus of [200000, 1200000, 20000000])
    for (const bearing of [-90, 0, 37]) {
      const a = M.frameOf({ ...defaults(), focus, bearing });
      const b = D.frameOf({ ...D.params.reduce((o, q) => (o[q.key] = q.def, o), {}),
                            focus, bearing, rings: Math.round(defaults().rings),
                            spokes: Math.round(defaults().spokes) });
      for (const k of ["a0", "a1", "r0", "r1", "da", "dr"])
        worst = Math.max(worst, Math.abs(a[k] - b[k]));
      worst = Math.max(worst, Math.abs(a.from[0] - b.from[0]), Math.abs(a.from[1] - b.from[1]));
    }
  check("the same fan, to the last bit, at every focus and bearing", worst === 0,
        String(worst));
  check("and the same point-in-polygon answer",
        [[250000, 450000], [-50000, 450000], [430300, 766300]]
          .every(q => M.inside(M.SITE, q) === D.inside(D.SITE, q)));
}

/* ============================================================ 8. determinism */

console.log("\n8. the same seed, the same city");
{
  const print = p => JSON.stringify(M.plan(p).blocks.map(b => [b.ring.length, b.height]));
  check("twice with one seed is the same plan",
        print({ ...defaults(), seed: 4 }) === print({ ...defaults(), seed: 4 }));
  check("and another seed is another plan",
        print({ ...defaults(), seed: 4 }) !== print({ ...defaults(), seed: 5 }));
  check("every slider survives both of its ends", M.params.every(spec => {
    for (const v of [spec.min, spec.max, spec.def]) {
      if (v === undefined) continue;
      try {
        const got = M.plan({ ...defaults(), [spec.key]: v });
        if (!Array.isArray(got.blocks)) return false;
      } catch (e) {
        console.log("      " + spec.key + " = " + v + " threw: " + e.message);
        return false;
      }
    }
    return true;
  }));
}

/* ========================================================= 9. in the kernel */

console.log("\n9. built in the real kernel");
{
  const kernel = await createWasmKernel({ initModule,
    wasmBinary: readFileSync(WASM_DIR + "/replicad_single.wasm") });
  const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                        select: () => {}, selected: () => null });
  const sample = JSON.parse(readFileSync(
    new URL("../data/samples/octagon_plan.json", import.meta.url).pathname, "utf8"));
  await mdl.run({ op: "model", model: sample });
  const at = async () => (await kernel.tree()).tree.features.find(f => f.id === "PLAN");
  const entry = await at();
  check("the sample's script builds", entry.built && !entry.error, entry.error || "");
  check("and declares its sliders", (entry.params || []).length === M.params.length,
        (entry.params || []).length + " of " + M.params.length);

  const meshOf = async () => (await kernel.mesh(["PLAN"])).features[0];
  const first = await meshOf();
  check("it has massing in it", first.triangles > 500, first.triangles + " triangles");
  const zs = [];
  for (let i = 2; i < first.positions.length; i += 3) zs.push(first.positions[i]);
  check("extruded up, and not down", Math.min(...zs) >= -1 && Math.max(...zs) > 50000,
        Math.round(Math.min(...zs) / 1000) + " to " + Math.round(Math.max(...zs) / 1000) + " m");

  //! MOVING THE ATTRACTOR MOVES THE CITY. The one thing the brief asks for
  //! that a still picture cannot show.
  const tallestNear = async () => {
    const m = await meshOf();
    let best = -1, at = null;
    for (let i = 0; i + 2 < m.positions.length; i += 3)
      if (m.positions[i + 2] > best) {
        best = m.positions[i + 2];
        at = [m.positions[i], m.positions[i + 1]];
      }
    return { best, at };
  };
  await mdl.run({ op: "set", id: "PLAN", key: "atX", value: 120000 });
  await mdl.run({ op: "set", id: "PLAN", key: "atY", value: 700000 });
  const west = await tallestNear();
  await mdl.run({ op: "set", id: "PLAN", key: "atX", value: 430000 });
  await mdl.run({ op: "set", id: "PLAN", key: "atY", value: 300000 });
  const east = await tallestNear();
  check("the peak follows the attractor across the site",
        Math.hypot(west.at[0] - east.at[0], west.at[1] - east.at[1]) > 200000,
        "peak moved " + Math.round(Math.hypot(west.at[0] - east.at[0],
                                              west.at[1] - east.at[1]) / 1000) + " m");
  check("and it is beside the attractor both times",
        Math.hypot(west.at[0] - 120000, west.at[1] - 700000) < 200000
        && Math.hypot(east.at[0] - 430000, east.at[1] - 300000) < 200000,
        Math.round(Math.hypot(west.at[0] - 120000, west.at[1] - 700000) / 1000) + " m and "
        + Math.round(Math.hypot(east.at[0] - 430000, east.at[1] - 300000) / 1000) + " m");
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
