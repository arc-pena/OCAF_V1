// The diagrid masterplan script: a radial grid fitted to a site boundary, and
// blocks made of whole lattice diamonds and half ones.
//
// WHAT CANNOT BE CHECKED BY LOOKING. A plan is a picture, and a picture of a
// hundred blue rhomboids looks right whatever the rules underneath are doing.
// All five of this generator's promises are invisible in a render:
//
//   that a merged block is a STRAIGHT RUN and never a chevron - a four-cell
//   chevron looks like a four-cell bar from most angles;
//   that blocks never OVERLAP once they are allowed off the grid, which on a
//   plan drawn in flat colour is completely hidden;
//   that they still MEET AT POINTS when asked to, and come apart when not;
//   that the grid is fitted to the site rather than drawn over it;
//   that the same seed gives the same plan.
//
// So this file measures those five, in lattice coordinates where they are
// exact, and then builds the thing in the real kernel to be sure the polygons
// survive the trip.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { readFileSync } from "fs";

const WASM_DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const SRC = new URL("../../scripts/diagrid.script.js", import.meta.url).pathname;
const initModule = (await import(WASM_DIR + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

const source = readFileSync(SRC, "utf8");
//! Compiled exactly the way the Script driver compiles it, so a change that
//! breaks the feature breaks this first and says why.
const M = new Function('"use strict"; return (' + source + ");")();
const defaults = () => {
  const v = {};
  for (const p of M.params) v[p.key] = p.def;
  return v;
};
const polysOf = plan => plan.blocks.flatMap(b => b.polys);

/* ================================================================= 1. the site

   The boundary is the deliverable's one piece of borrowed data, and a ring
   that lost a point in transcription would still draw as a plausible site. */

console.log("\n1. the site boundary, as it came out of SiteBoundary.dxf");
{
  check("44 points", M.SITE.length === 44, String(M.SITE.length));
  //! 331,896 m2 computed by the shoelace off the DXF before any of this
  //! existed. In millimetres squared it is 3.319e11, and the only way to be
  //! wrong by less than a tenth of a hectare is to have the right ring.
  const ha = M.area(M.SITE) / 1e10;
  check("33.19 hectares, anti-clockwise", Math.abs(ha - 33.19) < 0.02, ha.toFixed(3) + " ha");
  const xs = M.SITE.map(p => p[0]), ys = M.SITE.map(p => p[1]);
  check("602 m by 853 m",
        Math.abs((Math.max(...xs) - Math.min(...xs)) - 602000) < 500
        && Math.abs((Math.max(...ys) - Math.min(...ys)) - 852600) < 500,
        Math.round(Math.max(...xs) - Math.min(...xs)) + " x "
        + Math.round(Math.max(...ys) - Math.min(...ys)) + " mm");
  check("the ring does not repeat its first point",
        M.SITE[0][0] !== M.SITE[M.SITE.length - 1][0]
        || M.SITE[0][1] !== M.SITE[M.SITE.length - 1][1]);
  //! The inside test is the gate everything else passes through.
  check("a point in the middle is inside and one outside is not",
        M.inside(M.SITE, [250000, 450000]) && !M.inside(M.SITE, [-50000, 450000])
        && !M.inside(M.SITE, [250000, 1200000]));
}

/* ====================================================== 2. the grid fits the site

   "Maximise the site" is a measurable claim: the fan's limits are the site's
   own extent seen from the fan's centre, so no ring and no bay is spent
   outside it, and the site is not cropped either.                          */

console.log("\n2. the fan is fitted to the boundary, not drawn over it");
{
  for (const focus of [200000, 1200000, 8000000]) {
    const p = { ...defaults(), focus };
    const f = M.frameOf(p);
    let worstAngle = 0, inside = 0;
    for (const q of M.SITE) {
      const dx = q[0] - f.from[0], dy = q[1] - f.from[1];
      const along = dx * f.look[0] + dy * f.look[1];
      const across = -dx * f.look[1] + dy * f.look[0];
      const ang = Math.atan2(across, along), rad = Math.hypot(dx, dy);
      if (ang >= f.a0 - 1e-9 && ang <= f.a1 + 1e-9 && rad >= f.r0 - 1e-6 && rad <= f.r1 + 1e-6)
        inside++;
      worstAngle = Math.max(worstAngle, Math.abs(ang));
    }
    check("focus " + (focus / 1000) + " m: every site corner is within the fan",
          inside === M.SITE.length, inside + " of " + M.SITE.length);
    //! And TIGHT: at least one corner on each of the four limits, or the fan
    //! is bigger than the site and the grid is being spent on nothing.
    const touch = { a0: 0, a1: 0, r0: 0, r1: 0 };
    for (const q of M.SITE) {
      const dx = q[0] - f.from[0], dy = q[1] - f.from[1];
      const along = dx * f.look[0] + dy * f.look[1];
      const across = -dx * f.look[1] + dy * f.look[0];
      const ang = Math.atan2(across, along), rad = Math.hypot(dx, dy);
      if (Math.abs(ang - f.a0) < 1e-9) touch.a0++;
      if (Math.abs(ang - f.a1) < 1e-9) touch.a1++;
      if (Math.abs(rad - f.r0) < 1e-6) touch.r0++;
      if (Math.abs(rad - f.r1) < 1e-6) touch.r1++;
    }
    check("  and a corner sits on each of the four limits",
          touch.a0 && touch.a1 && touch.r0 && touch.r1, JSON.stringify(touch));
  }
  //! THE SLIDER'S WHOLE RANGE IN ONE NUMBER: how much the fan splays. A
  //! centre 200 m away opens 90 degrees; 20 km away is under three, which is
  //! a parallel grid with a lean on it.
  const splay = focus => {
    const f = M.frameOf({ ...defaults(), focus });
    return (f.a1 - f.a0) * 180 / Math.PI;
  };
  const tight = splay(200000), wide = splay(20000000);
  check("a near centre makes a sunburst and a far one a parallel grid",
        tight > 60 && wide < 4 && tight > wide * 10,
        tight.toFixed(1) + "° at 200 m, " + wide.toFixed(2) + "° at 20 km");
}

/* ============================================== 3. blocks are inside the site

   Cells are kept only if all four corners are in, and the inset moves every
   vertex inward - but drift moves them back out again, and the budget for it
   is the thing that has to hold.                                           */

console.log("\n3. nothing lands outside the boundary");
{
  for (const over of [{}, { drift: 1 }, { inset: 0 }, { merge: 1, maxRun: 8 },
                      { triangles: 1 }, { squares: 1 }]) {
    const plan = M.plan({ ...defaults(), ...over });
    let out = 0, near = 0;
    for (const ring of polysOf(plan))
      for (const q of ring) {
        if (!M.inside(M.SITE, q)) out++;
        else if (M.awayFrom(M.SITE, q) < 1000) near++;
      }
    const label = Object.keys(over).length ? JSON.stringify(over) : "defaults";
    check(label + ": every vertex inside the site", out === 0,
          out + " outside, " + near + " within a metre of the line");
  }
}

/* ===================================================== 4. merged blocks are bars

   The promise is "linear blocks, not chevrons". In lattice coordinates that
   is exact and total: the cells of a block must sit at a constant step.    */

console.log("\n4. a merged block is a straight run");
{
  const plan = M.plan({ ...defaults(), merge: 1, maxRun: 8 });
  let runs = 0, straight = 0, longest = 0;
  for (const block of plan.blocks) {
    if (block.run < 2) continue;
    runs++;
    longest = Math.max(longest, block.run);
    straight++;
  }
  check("there are merged blocks to check", runs > 10, runs + " of " + plan.blocks.length);
  check("and the longest is a real bar", longest >= 4, String(longest));

  //! STRAIGHTNESS, STATED EXACTLY. Every block hands back the lattice cells
  //! it was made of, and a straight run is one whose cells step by the same
  //! (du, dv) every time. A chevron is a run whose step changes sign half way
  //! along, and there is no way to see the difference in a plan: a four-cell
  //! chevron and a four-cell bar both read as four rhomboids in a line.
  //!
  //! Checked here rather than by looking for a reflex corner in the fused
  //! polygon, which is what this test did first: the mitre offset that opens
  //! the streets moves the tips and the sides by different amounts, so the
  //! collinear vertices along a staircase pick up a fraction of a degree of
  //! bend and every single fused run read as a chevron. The polygon is the
  //! wrong place to ask.
  let bent = 0, steps = new Map();
  for (const block of plan.blocks) {
    if (block.run < 2) continue;
    const step = [block.at[1][0] - block.at[0][0], block.at[1][1] - block.at[0][1]];
    steps.set(step.join(","), (steps.get(step.join(",")) || 0) + 1);
    for (let i = 2; i < block.at.length; i++)
      if (block.at[i][0] - block.at[i - 1][0] !== step[0]
          || block.at[i][1] - block.at[i - 1][1] !== step[1]) bent++;
  }
  check("every merged block steps the same way the whole length of it",
        bent === 0, bent + " blocks change direction half way");
  check("and the steps used are the four lattice directions and nothing else",
        [...steps.keys()].every(k => ["1,1", "-1,-1", "1,-1", "-1,1", "2,0", "-2,0",
                                      "0,2", "0,-2"].includes(k)),
        [...steps.entries()].map(([k, n]) => k + "\u00d7" + n).join(" "));

  //! Point-joined runs keep their cells apart, which is the line of towers
  //! touching corner to corner rather than one long slab.
  const points = plan.blocks.filter(b => b.run > 1 && b.joint === "point");
  check("point-joined runs stay as separate towers",
        points.length > 0 && points.every(b => b.polys.length === b.run),
        points.length + " of them");

  //! And the slider does something at both ends.
  const none = M.plan({ ...defaults(), merge: 0 });
  check("merge 0 leaves every cell on its own",
        none.blocks.every(b => b.run === 1), String(none.blocks.filter(b => b.run > 1).length));
  check("merge 1 merges most of them",
        plan.blocks.filter(b => b.run > 1).length > plan.blocks.length * 0.3,
        plan.blocks.filter(b => b.run > 1).length + " merged of " + plan.blocks.length);
}

/* ============================================================ 5. no overlaps

   Off the grid, blocks slide. The budget is half the street gap each way, so
   two neighbours closing on each other just touch. Nothing in a flat plan
   would show it if that were wrong.                                        */

console.log("\n5. nothing overlaps anything, on the grid or off it");
{
  const turn = (p, q, r) =>
    Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  const crosses = (a, b, c, d) => turn(a, b, c) !== turn(a, b, d) && turn(c, d, a) !== turn(c, d, b);
  const overlap = (A, B) => {
    for (const q of A) if (M.inside(B, q)) return true;
    for (const q of B) if (M.inside(A, q)) return true;
    for (let i = 0; i < A.length; i++)
      for (let j = 0; j < B.length; j++)
        if (crosses(A[i], A[(i + 1) % A.length], B[j], B[(j + 1) % B.length])) return true;
    return false;
  };
  for (const over of [{ drift: 0 }, { drift: 0.5 }, { drift: 1 },
                      { drift: 1, inset: 1000 }, { merge: 1, drift: 1 }]) {
    const rings = polysOf(M.plan({ ...defaults(), ...over }));
    let hits = 0;
    for (let i = 0; i < rings.length; i++)
      for (let j = i + 1; j < rings.length; j++)
        if (overlap(rings[i], rings[j])) hits++;
    check(JSON.stringify(over) + ": no two blocks overlap", hits === 0,
          hits + " overlapping pairs of " + rings.length + " blocks");
  }
}

/* ====================================================== 6. where they meet

   pinch holds the tips on their lattice nodes while the sides pull in. Two
   blocks sharing a node then share a vertex to the millimetre; at pinch 0
   they share nothing at all. Counted, because on screen both look like a
   plan with gaps in it.                                                    */

console.log("\n6. meeting at points, or not");
{
  const sharedCount = pinch => {
    const plan = M.plan({ ...defaults(), pinch, inset: 14000, merge: 0, drift: 0 });
    const at = new Map();
    for (const ring of polysOf(plan))
      for (const q of ring) {
        const k = Math.round(q[0] / 5) + "," + Math.round(q[1] / 5);
        at.set(k, (at.get(k) || 0) + 1);
      }
    let shared = 0;
    for (const [, n] of at) if (n > 1) shared++;
    return { shared, total: at.size };
  };
  const held = sharedCount(1), apart = sharedCount(0);
  check("pinch 1: blocks share their tips with their neighbours",
        held.shared > 20, held.shared + " shared vertices of " + held.total);
  check("pinch 0: nothing is shared — every block is an island",
        apart.shared === 0, apart.shared + " shared vertices of " + apart.total);
}

/* ====================================================== 7. the units themselves

   Whole rhomboids, halves, and the squared one. The square is the quad
   through the four side midpoints, and a Varignon parallelogram has EXACTLY
   half the area of the quad it came from - which is a number to check rather
   than a shape to admire.                                                  */

console.log("\n7. whole units, halves and squares");
{
  const whole = M.plan({ ...defaults(), triangles: 0, squares: 0, merge: 0, inset: 0 });
  check("with no halves and no squares every block is a four-sided rhomboid",
        whole.blocks.every(b => b.polys.every(r => r.length === 4)));

  const halves = M.plan({ ...defaults(), triangles: 1, squares: 0, merge: 0, inset: 0 });
  check("halves: every block is a triangle",
        halves.blocks.every(b => b.polys.every(r => r.length === 3)),
        halves.blocks.filter(b => b.polys.some(r => r.length !== 3)).length + " that are not");
  //! A HALF IS A HALF OF THE CELL, NOT HALF ITS AREA, and the difference is
  //! the whole character of a radial grid: the cell is a rhomboid on a curved
  //! lattice, so the outer triangle is about 1% bigger than the inner one.
  //! The exact statement is that the two of them add back up to the cell, and
  //! that is what is checked - the first version of this asked for 0.5 and
  //! got 0.4943, which was the program being right.
  const cell = whole.blocks[0].polys[0];
  const cellArea = Math.abs(M.area(cell));
  const north = Math.abs(M.area(M.halfOf(cell, 0)));        // [E, N, W]
  const south = Math.abs(M.area(M.halfOf(cell, 0.26)));     // [E, S, W]
  check("the two halves of a cell add back up to it, exactly",
        Math.abs((north + south) / cellArea - 1) < 1e-12,
        ((north + south) / cellArea).toFixed(14));
  check("and neither is more than 1% off a true half",
        Math.abs(north / cellArea - 0.5) < 0.01 && Math.abs(south / cellArea - 0.5) < 0.01,
        (north / cellArea).toFixed(4) + " and " + (south / cellArea).toFixed(4));
  check("every half the generator made is one of the cell's own halves",
        halves.blocks.every(b => b.polys.every(r => r.length === 3)));

  const squares = M.plan({ ...defaults(), triangles: 0, squares: 1, merge: 0, inset: 0 });
  check("squared: every block is still four-sided",
        squares.blocks.every(b => b.polys.every(r => r.length === 4)));
  check("and the midpoint quad is exactly half the cell's area",
        Math.abs(Math.abs(M.area(squares.blocks[0].polys[0])) / cellArea - 0.5) < 1e-9,
        (Math.abs(M.area(squares.blocks[0].polys[0])) / cellArea).toFixed(12));
}

/* ============================================================ 8. the heights

   Whole storeys, within the range asked for, and some of them below ground. */

console.log("\n8. heights");
{
  const p = { ...defaults(), low: 3, high: 16, storey: 4000, down: 0.3 };
  const plan = M.plan(p);
  const hs = plan.blocks.map(b => b.height);
  check("every height is a whole number of storeys",
        hs.every(h => Math.abs(h / 4000 - Math.round(h / 4000)) < 1e-9));
  check("and within the storeys asked for",
        hs.every(h => Math.abs(h) >= 3 * 4000 - 1e-9 && Math.abs(h) <= 16 * 4000 + 1e-9),
        Math.min(...hs.map(Math.abs)) / 4000 + ".." + Math.max(...hs.map(Math.abs)) / 4000);
  const down = hs.filter(h => h < 0).length / hs.length;
  check("about three in ten go down", Math.abs(down - 0.3) < 0.15, (down * 100).toFixed(0) + "%");
  check("none at all when the share is 0",
        M.plan({ ...p, down: 0 }).blocks.every(b => b.height > 0));
  check("all of them when it is 1",
        M.plan({ ...p, down: 1 }).blocks.every(b => b.height < 0));
}

/* ============================================================== 9. the seed

   A masterplan that reshuffles itself every time the document rebuilds is
   not a masterplan.                                                        */

console.log("\n9. the same seed, the same plan");
{
  const fingerprint = p => JSON.stringify(M.plan(p).blocks.map(b =>
    [b.polys.length, b.height, Math.round(M.area(b.polys[0]))]));
  const a = fingerprint({ ...defaults(), seed: 7 });
  const b = fingerprint({ ...defaults(), seed: 7 });
  const c = fingerprint({ ...defaults(), seed: 8 });
  check("twice with the same seed is the same plan", a === b);
  check("and a different seed is a different plan", a !== c);
  check("the plan survives both ends of every slider", M.params.every(spec => {
    for (const v of [spec.min, spec.max, spec.def]) {
      if (v === undefined) continue;
      try {
        const got = M.plan({ ...defaults(), [spec.key]: v });
        if (!Array.isArray(got.blocks)) return false;
      } catch (e) { console.log("      " + spec.key + " = " + v + " threw: " + e.message);
                    return false; }
    }
    return true;
  }));
}

/* =========================================================== 10. in the kernel

   The polygons have to survive being made into faces and extruded. A plan
   that is right and a build that drops half of it look the same from inside
   plan().                                                                  */

console.log("\n10. built in the real kernel");
{
  const kernel = await createWasmKernel({ initModule,
    wasmBinary: readFileSync(WASM_DIR + "/replicad_single.wasm") });
  const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                        select: () => {}, selected: () => null });
  const sample = JSON.parse(readFileSync(
    new URL("../data/samples/diagrid_plan.json", import.meta.url).pathname, "utf8"));
  await mdl.run({ op: "model", model: sample });
  const at = async () => (await kernel.tree()).tree.features.find(f => f.id === "PLAN");
  const entry = await at();
  check("the sample's script builds", entry.built && !entry.error, entry.error || "");
  check("and declares its sliders", (entry.params || []).length === M.params.length,
        (entry.params || []).length + " of " + M.params.length);

  const meshOf = async () => (await kernel.mesh(["PLAN"])).features[0];
  const first = await meshOf();
  check("it has solids in it", first.triangles > 500, first.triangles + " triangles");

  //! THE Z RANGE IS THE ONE THING THE PLAN CANNOT FAKE: it only exists
  //! because the polygons were extruded, up and down.
  const zs = [];
  for (let i = 2; i < first.positions.length; i += 3) zs.push(first.positions[i]);
  check("extruded up and down", Math.min(...zs) < -1000 && Math.max(...zs) > 10000,
        Math.round(Math.min(...zs) / 1000) + " m to " + Math.round(Math.max(...zs) / 1000) + " m");

  //! And in plan it sits on the site, which is the whole brief.
  const xs = [], ys = [];
  for (let i = 0; i + 2 < first.positions.length; i += 3) {
    xs.push(first.positions[i]); ys.push(first.positions[i + 1]);
  }
  const sx = M.SITE.map(q => q[0]), sy = M.SITE.map(q => q[1]);
  check("and inside the boundary in plan",
        Math.min(...xs) >= Math.min(...sx) - 1 && Math.max(...xs) <= Math.max(...sx) + 1
        && Math.min(...ys) >= Math.min(...sy) - 1 && Math.max(...ys) <= Math.max(...sy) + 1,
        Math.round(Math.min(...xs)) + ".." + Math.round(Math.max(...xs)) + " east");

  await mdl.run({ op: "set", id: "PLAN", key: "rings", value: 16 });
  await mdl.run({ op: "set", id: "PLAN", key: "spokes", value: 24 });
  const finer = await meshOf();
  check("a finer grid makes more blocks", finer.triangles > first.triangles,
        finer.triangles + " against " + first.triangles);

  await mdl.run({ op: "set", id: "PLAN", key: "show", value: 2 });
  const gridOnly = await meshOf();
  //! A stream with no faces in it carries no triangle count at all, which is
  //! not the same as a count of nought and reads as undefined.
  check("the grid on its own is lines and no solids", !gridOnly.triangles,
        (gridOnly.triangles || 0) + " triangles, "
        + (gridOnly.edges || []).length / 6 + " lines");
  check("and it is still something to look at", (gridOnly.edges || []).length > 100);
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
