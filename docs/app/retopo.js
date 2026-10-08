// Retopology: any mesh, down to the number of faces you asked for, in quads.
//
// WHAT THIS IS FOR. A mesh that arrived from somewhere else is almost never a
// cage. A scan, an STL, a Blender export, a tessellated import - they are
// thousands of triangles describing a surface, and a subdivision cage is a few
// hundred quads describing a SHAPE. You cannot push the first one about and
// you cannot sensibly convert it: \ref limitPatches on a triangle soup gives a
// patch per triangle and every vertex extraordinary.
//
// So this takes the soup and gives back a cage: as near as it can to the face
// count asked for, as many quads as the topology allows, following the surface
// it came from. Three steps, each of which is a known thing with a name:
//
//   1. TRIANGULATE, so there is one kind of face to reason about.
//   2. DECIMATE by edge collapse, scored by the QUADRIC ERROR METRIC of
//      Garland and Heckbert (SIGGRAPH 1997). Each vertex carries the sum of
//      the squared distances to the planes of the faces that were once round
//      it, as a 4x4 symmetric matrix; collapsing an edge adds the two
//      matrices, and the cost of the collapse is that matrix evaluated at
//      wherever the new vertex goes. Minimising it is a 3x3 solve.
//   3. PAIR the triangles back into quads, best first, by \ref quadrangulate -
//      which already existed and already scores a pair by how square the quad
//      would be and how flat the two triangles are to each other.
//
// WHY THE ERROR METRIC MATTERS MORE THAN THE COUNT. Any decimation can hit a
// face count; what you want is the one that spends its faces where the shape
// is. A quadric collapses a long flat run into one big quad for nothing,
// because every vertex along it has the same plane in its matrix and the cost
// is zero - and it refuses to flatten a crease, because the two planes there
// disagree and the cost is large. That is the whole reason to carry a matrix
// around rather than a distance.
//
// WHAT IT DOES NOT DO. This is not a field-aligned remesher: Instant Meshes
// and QuadriFlow solve for a cross field over the surface and extract a quad
// layout that follows curvature, and nothing here does that. The quads come
// out sized evenly and following the shape, but their EDGE FLOW is whatever
// the pairing found, not what a modeller would have drawn. Say so rather than
// implying otherwise, and measure the thing that can be measured: how far the
// result has moved from the surface it came from (\ref deviationFrom).

import {
  topologyOf, faceNormal, quadrangulate, triangulate, cageOf,
  pmAdd, pmSub, pmMul, pmCross, pmDot, pmLen, pmUnit,
} from "./polymesh.js";

/* ------------------------------------------------------------ triangles */

//! Any mesh as triangles. \ref triangulate in polymesh does the work and takes
//! a selection; everything is selected here, and the result is stripped back to
//! plain points and faces because a decimation has no use for creases it is
//! about to collapse.
export const asTriangles = mesh => {
  const got = triangulate(mesh, mesh.faces.map((f, i) => i));
  return { points: got.points.map(p => [p[0], p[1], p[2]]),
           faces: got.faces.map(f => f.slice()), creases: {}, corners: {} };
};

/* ------------------------------------------------- the quadric, as ten numbers

   A symmetric 4x4 has ten distinct entries and carrying all sixteen would be
   two thirds waste on a mesh with a hundred thousand vertices:

       [ 0  1  2  3 ]
       [ 1  4  5  6 ]
       [ 2  5  7  8 ]
       [ 3  6  8  9 ]                                                        */

const quadricOfPlane = (n, d, weight) => {
  const [a, b, c] = n;
  return [a*a, a*b, a*c, a*d, b*b, b*c, b*d, c*c, c*d, d*d].map(v => v * weight);
};

const addQuadric = (into, q) => { for (let i = 0; i < 10; i++) into[i] += q[i]; };

//! v^T Q v, which is the sum of squared distances to the planes Q was built
//! from. Never negative in exact arithmetic; rounding can take it a hair below
//! zero near a perfectly flat run, and a negative cost would sort to the front
//! of the heap and collapse the flattest places first forever.
const quadricAt = (q, p) => {
  const [x, y, z] = p;
  const got = q[0]*x*x + 2*q[1]*x*y + 2*q[2]*x*z + 2*q[3]*x
            + q[4]*y*y + 2*q[5]*y*z + 2*q[6]*y
            + q[7]*z*z + 2*q[8]*z + q[9];
  return got > 0 ? got : 0;
};

//! Where the collapse should put the new vertex: the minimum of v^T Q v, which
//! is a 3x3 solve. A flat run or a straight crease makes that matrix singular -
//! there is a whole line or plane of equally good answers - and then the best
//! of the two ends and the midpoint is taken instead, which is what Garland
//! and Heckbert do and what keeps a long flat wall from drifting sideways.
function bestPlace(q, a, b) {
  const m = [q[0], q[1], q[2], q[1], q[4], q[5], q[2], q[5], q[7]];
  const det = m[0]*(m[4]*m[8] - m[5]*m[7])
            - m[1]*(m[3]*m[8] - m[5]*m[6])
            + m[2]*(m[3]*m[7] - m[4]*m[6]);
  const scale = Math.abs(m[0]) + Math.abs(m[4]) + Math.abs(m[7]) + 1e-30;
  if (Math.abs(det) > 1e-10 * scale * scale * scale) {
    const r = [-q[3], -q[6], -q[8]];
    const at = [
      (r[0]*(m[4]*m[8] - m[5]*m[7]) - m[1]*(r[1]*m[8] - m[5]*r[2]) + m[2]*(r[1]*m[7] - m[4]*r[2])) / det,
      (m[0]*(r[1]*m[8] - m[5]*r[2]) - r[0]*(m[3]*m[8] - m[5]*m[6]) + m[2]*(m[3]*r[2] - r[1]*m[6])) / det,
      (m[0]*(m[4]*r[2] - r[1]*m[7]) - m[1]*(m[3]*r[2] - r[1]*m[6]) + r[0]*(m[3]*m[7] - m[4]*m[6])) / det,
    ];
    if (at.every(Number.isFinite)) return { at, cost: quadricAt(q, at) };
  }
  let best = null;
  for (const at of [a, b, pmMul(pmAdd(a, b), 0.5)]) {
    const cost = quadricAt(q, at);
    if (!best || cost < best.cost) best = { at: [at[0], at[1], at[2]], cost };
  }
  return best;
}

/* --------------------------------------------------------- the heap

   Lazy, because keeping a heap exact under a million updates costs more than
   throwing stale entries away when they surface. Every vertex carries a
   version that ticks when it moves; an entry whose versions no longer match
   is dropped on the way out and the edge is re-costed then.                 */

function makeHeap() {
  const items = [];
  const up = i => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (items[p].cost <= items[i].cost) break;
      [items[p], items[i]] = [items[i], items[p]];
      i = p;
    }
  };
  const down = i => {
    for (;;) {
      const l = i * 2 + 1, r = l + 1;
      let small = i;
      if (l < items.length && items[l].cost < items[small].cost) small = l;
      if (r < items.length && items[r].cost < items[small].cost) small = r;
      if (small === i) break;
      [items[small], items[i]] = [items[i], items[small]];
      i = small;
    }
  };
  return {
    size: () => items.length,
    push(item) { items.push(item); up(items.length - 1); },
    pop() {
      if (!items.length) return null;
      const top = items[0], last = items.pop();
      if (items.length) { items[0] = last; down(0); }
      return top;
    },
  };
}

/* ----------------------------------------------------------- decimation */

//! \p want triangles, or as near as the topology will allow. \p keepRim locks
//! the vertices on an open boundary where a mesh has one, so a decimated sheet
//! still has the outline it was cut to.
export function decimate(tris, want, { keepRim = true } = {}) {
  const points = tris.points.map(p => [p[0], p[1], p[2]]);
  const faces = tris.faces.map(f => f.slice());
  const alive = faces.map(() => true);
  let living = faces.length;
  if (living <= want || living < 2) return { points, faces: faces.filter((f, i) => alive[i]), collapses: 0 };

  // Who touches what. Sets rather than arrays: a vertex on a decimating mesh
  // gains and loses faces constantly and splice() on a hot path is what makes
  // a decimator take a minute instead of a second.
  const around = points.map(() => new Set());
  faces.forEach((f, i) => f.forEach(v => around[v].add(i)));

  const planeOf = f => {
    const [a, b, c] = f.map(i => points[i]);
    const n = pmCross(pmSub(b, a), pmSub(c, a));
    const area = pmLen(n) / 2;
    const unit = pmUnit(n);
    return { unit, d: -pmDot(unit, a), area };
  };

  const quadrics = points.map(() => new Array(10).fill(0));
  faces.forEach(f => {
    const { unit, d, area } = planeOf(f);
    if (!area) return;
    const q = quadricOfPlane(unit, d, area);
    for (const v of f) addQuadric(quadrics[v], q);
  });

  //! THE BOUNDARY, held by a plane rather than by a rule. Garland's trick: for
  //! every edge with one face on it, add a plane through that edge at right
  //! angles to the face, weighted heavily. The rim then costs a great deal to
  //! move and nothing special has to be special-cased in the collapse.
  const topo = topologyOf({ points, faces });
  const onRim = points.map(() => false);
  for (const [key, edge] of topo.edges) {
    if (edge.faces.length !== 1) continue;
    onRim[edge.a] = onRim[edge.b] = true;
    if (!keepRim) continue;
    const f = faces[edge.faces[0]];
    const { unit, area } = planeOf(f);
    const along = pmSub(points[edge.b], points[edge.a]);
    const side = pmUnit(pmCross(along, unit));
    if (!pmLen(side)) continue;
    const q = quadricOfPlane(side, -pmDot(side, points[edge.a]), area * 1000);
    addQuadric(quadrics[edge.a], q);
    addQuadric(quadrics[edge.b], q);
  }

  const gone = points.map(() => false);
  const version = points.map(() => 0);
  const heap = makeHeap();
  const sum = (u, v) => {
    const q = quadrics[u].slice();
    addQuadric(q, quadrics[v]);
    return q;
  };
  const offer = (u, v) => {
    if (gone[u] || gone[v]) return;
    const got = bestPlace(sum(u, v), points[u], points[v]);
    heap.push({ cost: got.cost, at: got.at, u, v, vu: version[u], vv: version[v] });
  };
  for (const [key, edge] of topo.edges) offer(edge.a, edge.b);

  //! THE LINK CONDITION. Collapsing an edge is only safe when the vertices the
  //! two ends share are exactly the tips of the triangles on that edge.
  //! Anything else folds the surface onto itself: the mesh still has faces and
  //! still draws, and it is no longer a surface. This is the check that makes
  //! the difference between a decimator and a shredder, and it cannot be seen
  //! on screen until something downstream refuses to sew.
  const neighbours = v => {
    const out = new Set();
    for (const fi of around[v]) for (const w of faces[fi]) if (w !== v) out.add(w);
    return out;
  };
  const shared = (u, v) => [...around[u]].filter(fi => faces[fi].includes(v));

  let collapses = 0;
  while (living > want && heap.size()) {
    const top = heap.pop();
    const { u, v, at } = top;
    if (gone[u] || gone[v] || version[u] !== top.vu || version[v] !== top.vv) continue;
    const both = shared(u, v);
    if (both.length !== 2) continue;              // a rim edge, or already odd
    const tips = new Set();
    for (const fi of both) for (const w of faces[fi]) if (w !== u && w !== v) tips.add(w);
    const common = [...neighbours(u)].filter(w => neighbours(v).has(w));
    if (common.length !== tips.size || common.some(w => !tips.has(w))) continue;
    //! THE RIM IS HELD BY REFUSING TO REMOVE IT, not only by the heavy plane
    //! quadric above. v is the vertex that goes, so an open outline keeps every
    //! vertex it had and cannot creep inwards - which the bounding box of a
    //! decimated sheet does NOT catch, because the corners are the last thing
    //! to move and the only thing a bounding box sees.
    if (keepRim && onRim[v]) continue;

    //! AND IT MUST NOT TURN A TRIANGLE INSIDE OUT. A collapse that is cheap by
    //! the metric can still fold a sliver over its neighbour, and a folded
    //! triangle is a hole with the wrong sign. Asked of every face that
    //! survives, before anything is changed.
    const moving = [...around[u], ...around[v]].filter(fi => !both.includes(fi));
    let flips = false;
    for (const fi of moving) {
      const was = faces[fi];
      const now = was.map(w => (w === u || w === v ? -1 : w));
      const corner = [points[was[0]], points[was[1]], points[was[2]]];
      was.forEach((w, k) => { if (w === u || w === v) corner[k] = at; });
      const before = pmCross(pmSub(points[was[1]], points[was[0]]),
                             pmSub(points[was[2]], points[was[0]]));
      const after = pmCross(pmSub(corner[1], corner[0]), pmSub(corner[2], corner[0]));
      if (pmLen(after) < 1e-18 || pmDot(pmUnit(before), pmUnit(after)) < 0.1) { flips = true; break; }
    }
    if (flips) continue;

    // Do it: u moves, v goes, the two shared faces go with it.
    points[u] = at;
    addQuadric(quadrics[u], quadrics[v]);
    for (const fi of both) {
      alive[fi] = false; living--;
      for (const w of faces[fi]) around[w].delete(fi);
    }
    for (const fi of [...around[v]]) {
      faces[fi] = faces[fi].map(w => (w === v ? u : w));
      around[v].delete(fi);
      around[u].add(fi);
    }
    gone[v] = true;
    //! ONLY u's VERSION TICKS. Bumping the neighbours' as well looks like
    //! being careful and starves the heap: an entry for an edge (w, x) that
    //! has not moved and whose quadrics have not changed is still perfectly
    //! good, and invalidating it without re-offering it loses that edge
    //! forever. The decimation then stops early with the heap full of entries
    //! it refuses to believe - a divided box stalled at 78 faces, having spent
    //! its last collapses rounding the arrises off because the cheap ones in
    //! the middle of the faces were no longer on offer.
    version[u]++;
    collapses++;
    for (const w of neighbours(u)) offer(u, w);
  }

  //! Renumbered on the way out, so what comes back has no holes in it and no
  //! vertex nothing refers to.
  const moved = new Array(points.length).fill(-1);
  const out = [];
  for (let i = 0; i < points.length; i++)
    if (!gone[i]) { moved[i] = out.length; out.push(points[i]); }
  const kept = [];
  faces.forEach((f, i) => {
    if (!alive[i]) return;
    const ring = f.map(w => moved[w]);
    if (ring[0] === ring[1] || ring[1] === ring[2] || ring[2] === ring[0]) return;
    kept.push(ring);
  });
  return { points: out, faces: kept, collapses };
}

/* ------------------------------------------------------- how far it moved

   THE NUMBER THAT SAYS WHETHER IT WORKED. A retopology that hit the face count
   and lost the shape is the failure that looks like success - it is a mesh,
   it draws, it has the right number of faces. So the result is measured
   against the surface it came from: every vertex of the new mesh, and every
   face centre, to the nearest point on the old one.                         */

//! Nearest point on a triangle to p. The standard region walk - Ericson's
//! Real-Time Collision Detection, 5.1.5 - written out because every short cut
//! for it is wrong on one of the seven regions.
function nearestOnTriangle(p, a, b, c) {
  const ab = pmSub(b, a), ac = pmSub(c, a), ap = pmSub(p, a);
  const d1 = pmDot(ab, ap), d2 = pmDot(ac, ap);
  if (d1 <= 0 && d2 <= 0) return a;
  const bp = pmSub(p, b), d3 = pmDot(ab, bp), d4 = pmDot(ac, bp);
  if (d3 >= 0 && d4 <= d3) return b;
  const vc = d1 * d4 - d3 * d2;
  if (vc <= 0 && d1 >= 0 && d3 <= 0) return pmAdd(a, pmMul(ab, d1 / (d1 - d3)));
  const cp = pmSub(p, c), d5 = pmDot(ab, cp), d6 = pmDot(ac, cp);
  if (d6 >= 0 && d5 <= d6) return c;
  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) return pmAdd(a, pmMul(ac, d2 / (d2 - d6)));
  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && d4 - d3 >= 0 && d5 - d6 >= 0)
    return pmAdd(b, pmMul(pmSub(c, b), (d4 - d3) / ((d4 - d3) + (d5 - d6))));
  const denom = 1 / (va + vb + vc);
  return pmAdd(a, pmAdd(pmMul(ab, vb * denom), pmMul(ac, vc * denom)));
}

//! A grid over the triangles, so the measurement is not quadratic. The cell is
//! sized from the mesh rather than guessed: about one triangle to a cell.
function gridOf(tris) {
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const p of tris.points) for (let i = 0; i < 3; i++) {
    lo[i] = Math.min(lo[i], p[i]); hi[i] = Math.max(hi[i], p[i]);
  }
  const span = Math.max(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) || 1;
  const steps = Math.max(1, Math.min(64, Math.round(Math.cbrt(tris.faces.length))));
  const cell = span / steps;
  const bins = new Map();
  const key = p => [0, 1, 2].map(i => Math.floor((p[i] - lo[i]) / cell)).join(",");
  tris.faces.forEach((f, i) => {
    const seen = new Set();
    for (const v of f) {
      const k = key(tris.points[v]);
      if (seen.has(k)) continue;
      seen.add(k);
      if (!bins.has(k)) bins.set(k, []);
      bins.get(k).push(i);
    }
  });
  return { lo, cell, bins, tris, span };
}

function nearestTriangleTo(grid, p) {
  const { lo, cell, bins, tris } = grid;
  const home = [0, 1, 2].map(i => Math.floor((p[i] - lo[i]) / cell));
  let best = Infinity;
  for (let reach = 0; reach < 24; reach++) {
    for (let dx = -reach; dx <= reach; dx++)
      for (let dy = -reach; dy <= reach; dy++)
        for (let dz = -reach; dz <= reach; dz++) {
          // Only the shell of the box, so a ring is not walked twice.
          if (reach && Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz)) !== reach) continue;
          const list = bins.get((home[0]+dx) + "," + (home[1]+dy) + "," + (home[2]+dz));
          if (!list) continue;
          for (const fi of list) {
            const f = tris.faces[fi];
            const at = nearestOnTriangle(p, tris.points[f[0]], tris.points[f[1]], tris.points[f[2]]);
            best = Math.min(best, pmLen(pmSub(p, at)));
          }
        }
    // Once something has been found, one more ring is enough: nothing outside
    // it can be nearer than the ring already walked.
    if (best < Infinity && best <= reach * cell) break;
  }
  return best;
}

//! How far \p after has moved from \p before, as the worst and the average
//! over every vertex and every face centre of the result.
export function deviationFrom(before, after) {
  const grid = gridOf(asTriangles(before));
  const asks = after.points.slice();
  for (const face of after.faces) {
    let sum = [0, 0, 0];
    for (const v of face) sum = pmAdd(sum, after.points[v]);
    asks.push(pmMul(sum, 1 / face.length));
  }
  let worst = 0, total = 0, n = 0;
  for (const p of asks) {
    const d = nearestTriangleTo(grid, p);
    if (!Number.isFinite(d)) continue;
    worst = Math.max(worst, d);
    total += d; n++;
  }
  return { worst, mean: n ? total / n : 0, size: grid.span, samples: n };
}

/* ------------------------------------------------------------ the whole of it */

//! Any mesh in, a cage of about \p faces faces out.
//!
//! THE COUNT IS AIMED AT, NOT DECREED. Pairing t triangles into quads gives
//! t - p faces, where p is how many pairs the matching found, and a perfect
//! matching is p = t/2. So t = 2 * faces is the right target to decimate to -
//! and when the matching comes up short the answer overshoots, so it is
//! measured and the decimation is run again a little lower. Three tries, which
//! is enough to land inside a few per cent; saying the real number afterwards
//! matters more than hitting it exactly.
export function retopologise(mesh, { faces = 200, angle = 40, keepRim = true,
                                     quads = true, tries = 3 } = {}) {
  const want = Math.max(4, Math.round(faces));
  const from = cageOf(mesh);
  const tris = asTriangles(from);
  if (!tris.faces.length) throw new Error("that mesh has no faces to work from");

  let best = null;
  let target = quads ? want * 2 : want;
  for (let go = 0; go < Math.max(1, tries); go++) {
    const small = decimate(tris, target, { keepRim });
    let got = { points: small.points, faces: small.faces, creases: {}, corners: {} };
    if (quads && got.faces.length > 1) {
      const all = got.faces.map((f, i) => i);
      const paired = quadrangulate(got, all, angle);
      got = { points: paired.points, faces: paired.faces, creases: {}, corners: {} };
    }
    const count = got.faces.length;
    if (!best || Math.abs(count - want) < Math.abs(best.faces.length - want)) best = got;
    if (count <= want || !quads) break;
    // Overshot: the matching left triangles unpaired, so aim lower by exactly
    // the surplus rather than by a guess.
    const next = Math.max(4, target - (count - want) * 2);
    if (next >= target) break;
    target = next;
  }

  const quadCount = best.faces.filter(f => f.length === 4).length;
  return {
    mesh: best,
    faces: best.faces.length,
    quads: quadCount,
    tris: best.faces.length - quadCount,
    from: tris.faces.length,
  };
}
