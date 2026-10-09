// Cage deformation: an FFD lattice, and the coordinates that make one work.
//
// WHAT IT IS FOR. A cage edit in 3ds Max is a box of control points round an
// object; you drag them and the object follows. It is the right tool for
// "make this bulge here" on a mesh with ten thousand vertices in it, and in
// every package it is a manual tool: the lattice is built by the modifier, the
// points are dragged by hand, and what you did cannot be re-applied to
// anything else or driven by anything.
//
// Two nodes here, deliberately separate, because separating them is the whole
// point:
//
//     Lattice   builds the box of control points. It produces an ORDINARY
//               MESH, so everything that deforms a mesh deforms it - a soft
//               selection and a Twist, an Edit Mesh with a dragged vertex, a
//               Move driven by an expression, a point running along a curve.
//
//     Morph     takes the mesh, the lattice as it was, and the lattice as it
//               now is, and carries the first through the change between the
//               other two.
//
// So the deformation is a thing in the document with a name, and anything that
// can move a mesh can drive it. That is the bit no modeller gives you.
//
// WHY MEAN VALUE COORDINATES AND NOT A TRIVARIATE BERNSTEIN BASIS. The
// classical FFD (Sederberg & Parry, SIGGRAPH 1986) writes each point in the
// lattice's own u,v,w and evaluates a tensor-product Bézier volume. It is
// exact and it is rigid: the cage must be a box with a known i,j,k grid, so
// the moment somebody hands you a cage that is not one - a cylinder of control
// points round a limb, a cage somebody built out of curves - it has nothing to
// say. Mean value coordinates (Ju, Schaefer & Warren, SIGGRAPH 2005) are
// defined for ANY closed triangle mesh, reproduce linear functions exactly,
// are smooth everywhere and are defined outside the cage as well as inside -
// which matters, because a lattice fitted to a bounding box has geometry
// sitting exactly on its face.
//
// The price is honest and worth saying out loud: the cage acts through its
// SURFACE. A control point strictly inside the cage has no effect at all, so
// the lattice built here is hollow - a shell of control points - and asking
// for 4 x 4 x 4 gives you the 56 on the boundary and not the 8 in the middle
// that would do nothing.

import { pmCross, pmDot, pmLen, pmMul, pmSub } from "./polymesh.js";

/* ==================================================================== lattice

   A hollow box of control points, i by j by k, round a box. The points are
   generated in a fixed order and shared between the six sides through one
   map, so the lattice is a closed quad mesh - which it has to be, because the
   coordinates below are only defined against a closed one.                  */

export function latticeCage(box, divisions = {}) {
  const nx = Math.max(1, Math.round(divisions.nx || 1));
  const ny = Math.max(1, Math.round(divisions.ny || 1));
  const nz = Math.max(1, Math.round(divisions.nz || 1));
  const pad = Number(divisions.padding) || 0;
  const lo = [box.lo[0] - pad, box.lo[1] - pad, box.lo[2] - pad];
  const hi = [box.hi[0] + pad, box.hi[1] + pad, box.hi[2] + pad];
  //! A FLAT MODEL STILL GETS A BOX. A plane of geometry has zero thickness in
  //! one direction, every control point on that side lands on top of its
  //! opposite number, and the cage is degenerate - no volume, no coordinates,
  //! NaN everywhere. A millimetre of thickness is invisible and keeps it a box.
  for (let a = 0; a < 3; a++) if (hi[a] - lo[a] < 1e-6) { lo[a] -= 0.5; hi[a] += 0.5; }

  const at = (i, j, k) => [lo[0] + (hi[0] - lo[0]) * i / nx,
                           lo[1] + (hi[1] - lo[1]) * j / ny,
                           lo[2] + (hi[2] - lo[2]) * k / nz];
  const points = [];
  const index = new Map();
  const vertex = (i, j, k) => {
    const key = i + "," + j + "," + k;
    let got = index.get(key);
    if (got === undefined) { got = points.length; points.push(at(i, j, k)); index.set(key, got); }
    return got;
  };

  //! The six sides, each as a grid of quads, wound so the normal points out of
  //! the box. The winding matters: mean value coordinates take their sign from
  //! the triangle's orientation, so a cage with one side inside out gives
  //! coordinates that do not sum to one and a mesh that turns itself inside
  //! out along that face.
  const faces = [];
  const side = (count1, count2, place, flip) => {
    for (let a = 0; a < count1; a++)
      for (let b = 0; b < count2; b++) {
        const quad = [place(a, b), place(a + 1, b), place(a + 1, b + 1), place(a, b + 1)]
          .map(([i, j, k]) => vertex(i, j, k));
        faces.push(flip ? quad.reverse() : quad);
      }
  };
  side(nx, ny, (a, b) => [a, b, 0], true);        // bottom, normal -Z
  side(nx, ny, (a, b) => [a, b, nz], false);      // top,    normal +Z
  side(nx, nz, (a, b) => [a, 0, b], false);       // front,  normal -Y
  side(nx, nz, (a, b) => [a, ny, b], true);       // back,   normal +Y
  side(ny, nz, (a, b) => [0, a, b], true);        // left,   normal -X
  side(ny, nz, (a, b) => [nx, a, b], false);      // right,  normal +X
  return { points, faces, creases: {}, corners: {} };
}

/* ====================================================== mean value coordinates

   Ju, Schaefer & Warren, "Mean Value Coordinates for Closed Triangular
   Meshes", SIGGRAPH 2005, the pseudo-code in figure 4, written out as it
   stands. The two early exits in it are not optimisations and both of them
   matter: a point ON a vertex takes that vertex's value, and a point in the
   PLANE of a triangle but outside it contributes nothing from that triangle,
   because the formula divides by a sine that is zero there.                 */

const MVC_EPS = 1e-9;

export function meanValueCoords(cagePoints, triangles, p, into) {
  const n = cagePoints.length;
  const w = into || new Float64Array(n);
  w.fill(0);
  const d = new Float64Array(n);
  const u = new Array(n);
  for (let i = 0; i < n; i++) {
    const r = pmSub(cagePoints[i], p);
    const len = pmLen(r);
    //! Sitting on a control point. Every other weight is zero and this one is
    //! one - the limit is right and the arithmetic that would produce it
    //! divides by this zero.
    if (len < MVC_EPS) { w[i] = 1; return w; }
    d[i] = len;
    u[i] = pmMul(r, 1 / len);
  }
  for (const tri of triangles) {
    const [i0, i1, i2] = tri;
    const u0 = u[i0], u1 = u[i1], u2 = u[i2];
    const l0 = pmLen(pmSub(u1, u2)), l1 = pmLen(pmSub(u2, u0)), l2 = pmLen(pmSub(u0, u1));
    const t0 = 2 * Math.asin(Math.min(1, l0 / 2));
    const t1 = 2 * Math.asin(Math.min(1, l1 / 2));
    const t2 = 2 * Math.asin(Math.min(1, l2 / 2));
    const h = (t0 + t1 + t2) / 2;
    if (Math.PI - h < MVC_EPS) {
      //! On the triangle itself: the coordinates are the planar barycentric
      //! ones and every other cage vertex drops out. Returned rather than
      //! accumulated, exactly as the paper has it.
      w.fill(0);
      w[i0] = Math.sin(t0) * d[i1] * d[i2];
      w[i1] = Math.sin(t1) * d[i2] * d[i0];
      w[i2] = Math.sin(t2) * d[i0] * d[i1];
      return w;
    }
    const c0 = 2 * Math.sin(h) * Math.sin(h - t0) / (Math.sin(t1) * Math.sin(t2)) - 1;
    const c1 = 2 * Math.sin(h) * Math.sin(h - t1) / (Math.sin(t2) * Math.sin(t0)) - 1;
    const c2 = 2 * Math.sin(h) * Math.sin(h - t2) / (Math.sin(t0) * Math.sin(t1)) - 1;
    const det = pmDot(u0, pmCross(u1, u2));
    const sign = det < 0 ? -1 : 1;
    const s0 = sign * Math.sqrt(Math.max(0, 1 - c0 * c0));
    const s1 = sign * Math.sqrt(Math.max(0, 1 - c1 * c1));
    const s2 = sign * Math.sqrt(Math.max(0, 1 - c2 * c2));
    //! In the plane of this triangle but outside it. The paper says ignore the
    //! triangle, and it means it: the weights it would contribute are infinite
    //! and they cancel against the neighbour's.
    if (Math.abs(s0) < MVC_EPS || Math.abs(s1) < MVC_EPS || Math.abs(s2) < MVC_EPS) continue;
    w[i0] += (t0 - c1 * t2 - c2 * t1) / (d[i0] * Math.sin(t1) * s2);
    w[i1] += (t1 - c2 * t0 - c0 * t2) / (d[i1] * Math.sin(t2) * s0);
    w[i2] += (t2 - c0 * t1 - c1 * t0) / (d[i2] * Math.sin(t0) * s1);
  }
  return w;
}

//! The cage's triangles, once, as index triples. The coordinates are defined
//! over triangles and a cage is quads, so every face is fanned - which is
//! exact for a planar quad and is what the lattice's faces are.
export function cageTriangles(cage) {
  const tris = [];
  for (const face of cage.faces)
    for (let i = 1; i + 1 < face.length; i++) tris.push([face[0], face[i], face[i + 1]]);
  return tris;
}

/* ====================================================================== morph

   Every point of the mesh written in the rest cage's coordinates, then read
   back out of the moved one. The coordinates are computed ONCE against the
   rest cage, which is what makes this a deformation and not a re-fit: move
   the cage again and the same coordinates give the new positions.           */

export function morphThrough(points, rest, moved) {
  if (rest.points.length !== moved.points.length)
    throw new Error("the moved cage has " + moved.points.length + " points and the one it "
      + "came from has " + rest.points.length + "; they have to be the same cage");
  const tris = cageTriangles(rest);
  const n = rest.points.length;
  const scratch = new Float64Array(n);
  let outside = 0;
  const out = points.map(p => {
    const w = meanValueCoords(rest.points, tris, p, scratch);
    let total = 0;
    for (let i = 0; i < n; i++) total += w[i];
    //! A TOTAL OF ZERO IS NOT A DEFORMATION, it is a point the coordinates
    //! could not describe - a cage that is not closed, or is inside out. The
    //! point stays where it is and the caller is told how many did, because a
    //! mesh with a handful of vertices left behind is the failure that looks
    //! like a modelling decision.
    if (Math.abs(total) < 1e-12) { outside++; return p.slice(); }
    const at = [0, 0, 0];
    for (let i = 0; i < n; i++) {
      const k = w[i] / total;
      if (k === 0) continue;
      at[0] += moved.points[i][0] * k;
      at[1] += moved.points[i][1] * k;
      at[2] += moved.points[i][2] * k;
    }
    return at;
  });
  return { points: out, outside };
}

//! Whether two cages are the same cage with the points moved - which is the
//! one thing Morph cannot work out for itself and the one thing it must be
//! sure of. Same count and same faces, so a cage subdivided or welded between
//! the two inputs is refused by name rather than quietly deforming by the
//! difference between two unrelated meshes.
export function sameCage(a, b) {
  if (a.points.length !== b.points.length) return "they have different numbers of points";
  if (a.faces.length !== b.faces.length) return "they have different numbers of faces";
  for (let i = 0; i < a.faces.length; i++) {
    if (a.faces[i].length !== b.faces[i].length) return "face " + i + " has a different number of sides";
    for (let j = 0; j < a.faces[i].length; j++)
      if (a.faces[i][j] !== b.faces[i][j]) return "face " + i + " is wound differently";
  }
  return null;
}

//! How far the cage itself was pushed, for the note - and the guard against
//! the commonest mistake with this node, which is wiring the SAME cage into
//! both inputs and wondering why nothing happens.
export function cageMoved(rest, moved) {
  let most = 0, moved_ = 0;
  for (let i = 0; i < rest.points.length; i++) {
    const d = pmLen(pmSub(moved.points[i], rest.points[i]));
    if (d > 1e-9) moved_++;
    if (d > most) most = d;
  }
  return { moved: moved_, most };
}

