// The way out of the mesh side, as surfaces rather than facets.
//
// A Catmull-Clark cage MEANS a smooth surface, and that surface is not a
// tessellation of it - it is a piecewise polynomial with a closed form. On any
// quad whose four corners all have four faces on them, the limit surface is
// EXACTLY the uniform bicubic B-spline over the sixteen vertices around that
// quad. That is the theorem the whole of this module rests on, and it is why
// the conversion is a change of basis rather than a fit: there is nothing to
// fit, the answer is already a B-spline and the only work is writing it in the
// basis OpenCascade reads.
//
// So the function here is the one a \ref Geom_SphericalSurface is: something
// that takes a small piece of data and hands back a map from (u, v) to a
// point. A sphere takes a centre and a radius and evaluates with sine and
// cosine; this takes a face of a mesh and its neighbours and evaluates with
// the Bernstein polynomials. Same kind of object, different input.
//
//     mesh + face  ->  16 poles  ->  Geom_BSplineSurface  ->  (u,v) -> point
//
// WHERE IT IS EXACT AND WHERE IT IS NOT. At an EXTRAORDINARY vertex - three
// faces at a point, or five, or seven - the Catmull-Clark limit surface is
// provably NOT a polynomial or a rational one. It is an infinite nest of
// bicubic patches shrinking onto the point, and no finite number of poles
// writes it down. Every converter that exists approximates there: Maya's
// Subdiv to NURBS, Rhino's ToNURBS, and this. What is used here is the
// construction of
//
//   Loop and Schaefer, "Approximating Catmull-Clark Subdivision Surfaces with
//   Bicubic Patches", ACM TOG 27(1), 2008
//
// whose three masks reduce, when every corner has valence four, to ordinary
// B-spline knot insertion - so the regular case comes out EXACT and only the
// star of an extraordinary vertex is approximate. The corners of every patch
// sit on the true limit surface whatever the valence, because the corner mask
// is the limit-position mask of Halstead, Kass and DeRose. What is lost is
// tangent continuity ACROSS a patch edge that ends on an extraordinary vertex:
// the two patches share that edge exactly, so the shell is watertight, but
// their normals disagree slightly along it. \ref worstKink measures that
// disagreement rather than leaving it to be discovered on screen, and one more
// level of subdivision before converting quarters it.
//
// THE THREE MASKS, for a quad face at a corner v with valence n, where a and b
// are v's neighbours IN THAT FACE and c is the far corner of it:
//
//   interior   b11 = (n v + 2a + 2b + c) / (n + 5)
//   edge       the mean of the two interior poles at v in the faces sharing
//              the edge  =  (2n v + 4w + 2a + 2b + c + d) / (2n + 10)
//   corner     the mean of the interior poles at v in ALL n faces
//              =  (n^2 v + 4 Sum(neighbours) + Sum(diagonals)) / (n(n+5))
//
// and the third of those is the Catmull-Clark limit position, which is what
// makes the patches meet. Because the edge pole is a mean over the two faces
// of an edge and the corner pole a mean over all faces of a vertex, every pole
// on a shared boundary is computed from the mesh and not from either patch -
// so two neighbouring patches cannot disagree about it. The shell is watertight
// by construction, not by tolerance.
//
// BOUNDARIES AND CREASES come from the appendix of the same paper. A rim edge
// takes its poles at the thirds, which makes the boundary curve exactly the
// uniform cubic B-spline through the rim polygon - exact, not approximate -
// and a rim vertex is placed at the midpoint of its two rim poles, which is
// the same curve's limit point. A vertex with only one face on it stays where
// it is. A CREASE is the same thing in the middle of a surface, and a crease
// strictly between 0 and 1 is interpolated between the smooth construction and
// the sharp one - which is exactly what the subdivision rule itself does to a
// half crease, so the patches and the cage agree, but neither is exact there.

import {
  topologyOf, edgeKey, edgeEnds, cageOf, catmullClark,
  pmAdd, pmSub, pmMul, pmCross, pmLen, pmUnit,
} from "./polymesh.js";

const clampCrease = t => Math.max(0, Math.min(1, +t || 0));
const lerp = (a, b, t) => pmAdd(a, pmMul(pmSub(b, a), t));

/* ------------------------------------------------------- reading the cage */

//! How sharp an edge is, by the same rule \ref catmullClark uses - so the
//! patches put their arrises exactly where the subdivided cage puts its own.
export function creaseReader(mesh, topo, sharpBoundary = true) {
  return key => {
    const set = mesh.creases && mesh.creases[key];
    if (set !== undefined) return clampCrease(set);
    const edge = topo.edges.get(key);
    return sharpBoundary && edge && edge.faces.length === 1 ? 1 : 0;
  };
}

//! What each vertex is, in the three kinds Pixar named: smooth, crease and
//! corner. The classification is lifted from \ref catmullClark deliberately -
//! if the patches sorted vertices differently from the subdivision they are
//! approximating, they would be smooth in places the cage is folded.
export function vertexKinds(mesh, topo, crease) {
  return mesh.points.map((p, i) => {
    const around = topo.vertEdges[i] || [];
    const faces = topo.vertFaces[i] || [];
    const sharp = around.filter(key => crease(key) > 0);
    const tag = clampCrease((mesh.corners && mesh.corners[i]) || 0);
    const rim = faces.length < around.length;
    const pinned = tag >= 1 || sharp.length > 2
                || (faces.length === 1 && sharp.length >= 2)
                || !faces.length || !around.length;
    // How strongly this vertex is held along a line rather than settling into
    // the surface. A rim is held completely; a crease by whichever of its two
    // creased edges gives way first.
    const held = rim || pinned ? 1
               : (sharp.length === 2 ? Math.min(...sharp.map(crease)) : 0);
    return { at: i, around, faces, sharp, tag, rim, pinned, held, k: faces.length };
  });
}

/* ------------------------------------------------------------- the masks */

//! v's neighbours within one face, and the corner opposite it. On a quad the
//! opposite corner is two steps round, which is what the mask calls the
//! diagonal.
function ringInFace(face, at) {
  const m = face.length;
  return { a: face[(at + 1) % m], b: face[(at + m - 1) % m], c: face[(at + 2) % m] };
}

const interiorMask = (P, v, a, b, c, n) =>
  pmMul(pmAdd(pmAdd(pmMul(P[v], n), pmMul(pmAdd(P[a], P[b]), 2)), P[c]), 1 / (n + 5));

//! The pole just inside the corner v of face F. The valence in the mask is the
//! vertex's own valence where the surface is smooth; where it is held - a rim,
//! a crease, a corner - the paper's appendix treats the boundary as half of a
//! closed mesh and uses twice the number of faces instead, and a vertex with
//! one face uses four. A half crease lands between the two.
export function interiorPole(mesh, kinds, face, at) {
  const v = face[at];
  const kind = kinds[v];
  const { a, b, c } = ringInFace(face, at);
  const P = mesh.points;
  const free = interiorMask(P, v, a, b, c, kind.rim ? 2 * kind.k : Math.max(1, kind.k));
  if (kind.held <= 0) return free;
  const fast = interiorMask(P, v, a, b, c, kind.k === 1 ? 4 : 2 * kind.k);
  return kind.held >= 1 ? fast : lerp(free, fast, kind.held);
}

//! Every pole of every patch, computed once from the mesh and shared. This is
//! the function that makes the result watertight: a pole on a boundary between
//! two patches is worked out HERE, from the cage, and both patches are handed
//! the same number. Nothing is sewn together afterwards that was not already
//! identical.
export function limitPoles(mesh, { sharpBoundary = true } = {}, topo = topologyOf(mesh)) {
  const crease = creaseReader(mesh, topo, sharpBoundary);
  const kinds = vertexKinds(mesh, topo, crease);
  const P = mesh.points;

  // The interior poles, four to a quad, each from its own corner's ring.
  const inside = mesh.faces.map((face, fi) =>
    face.map((v, at) => interiorPole(mesh, kinds, face, at)));

  // The poles along each edge: the mean of the interior poles at that end, one
  // from each face of the edge. A rim or a crease overrides with the thirds of
  // the edge, which is the cubic B-spline of the rim polygon written in Bezier
  // form - so a creased line is exactly a cubic through the cage, not nearly.
  const along = new Map();
  for (const [key, edge] of topo.edges) {
    const { a, b } = edge;
    const held = crease(key);
    const thirds = [pmMul(pmAdd(pmMul(P[a], 2), P[b]), 1 / 3),
                    pmMul(pmAdd(P[a], pmMul(P[b], 2)), 1 / 3)];
    if (edge.faces.length < 2 || held >= 1) { along.set(key, thirds); continue; }
    const mean = end => {
      let sum = [0, 0, 0], seen = 0;
      for (const fi of edge.faces) {
        const at = mesh.faces[fi].indexOf(end);
        if (at < 0) continue;
        sum = pmAdd(sum, inside[fi][at]);
        seen++;
      }
      return seen ? pmMul(sum, 1 / seen) : P[end];
    };
    const free = [mean(a), mean(b)];
    along.set(key, held <= 0 ? free
                 : [lerp(free[0], thirds[0], held), lerp(free[1], thirds[1], held)]);
  }

  // And the pole at each vertex: the mean of the interior poles all round it,
  // which is the Catmull-Clark limit position - so every patch corner sits on
  // the true surface however odd the valence is.
  const corners = P.map((p, i) => {
    const kind = kinds[i];
    if (kind.pinned) return [p[0], p[1], p[2]];
    let seat;
    if (kind.rim) {
      // Held along the rim: the limit point of the cubic B-spline through it.
      const open = kind.around.filter(key => topo.edges.get(key).faces.length === 1).slice(0, 2);
      seat = ridgePoint(P, i, open) || [p[0], p[1], p[2]];
    } else {
      let sum = [0, 0, 0];
      for (const fi of kind.faces) {
        const at = mesh.faces[fi].indexOf(i);
        if (at >= 0) sum = pmAdd(sum, inside[fi][at]);
      }
      seat = kind.faces.length ? pmMul(sum, 1 / kind.faces.length) : [p[0], p[1], p[2]];
    }
    if (!kind.rim && kind.sharp.length === 2) {
      const ridge = ridgePoint(P, i, kind.sharp);
      if (ridge) seat = lerp(seat, ridge, Math.min(...kind.sharp.map(crease)));
    }
    if (kind.tag > 0) seat = lerp(seat, p, kind.tag);
    return seat;
  });

  return { corners, along, inside, kinds, crease, topo };
}

//! Where a vertex sits on the cubic B-spline through a line of the cage - the
//! (1, 4, 1)/6 limit of the (1, 6, 1)/8 rule the subdivision uses on a rim.
function ridgePoint(P, i, keys) {
  if (keys.length !== 2) return null;
  const ends = keys.map(key => {
    const [a, b] = edgeEnds(key);
    return P[a === i ? b : a];
  });
  if (!ends[0] || !ends[1]) return null;
  return pmMul(pmAdd(pmAdd(ends[0], ends[1]), pmMul(P[i], 4)), 1 / 6);
}

/* ------------------------------------------------------------ the patches */

//! The sixteen poles of one quad, laid out as poles[i][j] with i along the
//! edge from the first corner to the second and j along the edge from the
//! first corner to the fourth. Anticlockwise seen from outside, so du x dv is
//! the outward normal and the face comes out the right way round.
export function patchFor(mesh, poles, fi) {
  const face = mesh.faces[fi];
  if (face.length !== 4) return null;
  const [v0, v1, v2, v3] = face;
  const { corners, along, inside } = poles;
  // Which end of a stored edge pair belongs to which vertex.
  const end = (a, b) => {
    const pair = along.get(edgeKey(a, b));
    if (!pair) return null;
    return a < b ? pair : [pair[1], pair[0]];
  };
  const e01 = end(v0, v1), e12 = end(v1, v2), e23 = end(v2, v3), e30 = end(v3, v0);
  if (!e01 || !e12 || !e23 || !e30) return null;
  const b = [[null, null, null, null], [null, null, null, null],
             [null, null, null, null], [null, null, null, null]];
  b[0][0] = corners[v0]; b[3][0] = corners[v1];
  b[3][3] = corners[v2]; b[0][3] = corners[v3];
  b[1][0] = e01[0]; b[2][0] = e01[1];
  b[3][1] = e12[0]; b[3][2] = e12[1];
  b[2][3] = e23[0]; b[1][3] = e23[1];
  b[0][2] = e30[0]; b[0][1] = e30[1];
  b[1][1] = inside[fi][0]; b[2][1] = inside[fi][1];
  b[2][2] = inside[fi][2]; b[1][2] = inside[fi][3];
  return { face: fi, corners: [v0, v1, v2, v3], poles: b };
}

//! A cage in, bicubic patches out. \p levels is subdivided off first: it does
//! not change the surface being described - the Catmull-Clark limit of a
//! subdivided cage is the same surface - it only shrinks the neighbourhood of
//! each extraordinary vertex, which is the only place the patches are not the
//! surface. So levels is an accuracy dial with a known direction.
export function limitPatches(mesh, { levels = 0, sharpBoundary = true } = {}) {
  let cage = cageOf(mesh);
  let quadded = 0;
  for (let i = 0; i < Math.max(0, Math.round(levels)); i++)
    cage = catmullClark(cage, { sharpBoundary });
  // Every face has to be a quad, and one level of Catmull-Clark makes any mesh
  // into one - a triangle becomes three quads, a hexagon six. So a cage that
  // is not all quads is subdivided once rather than refused, and says so.
  if (cage.faces.some(face => face.length !== 4)) {
    cage = catmullClark(cage, { sharpBoundary });
    quadded = 1;
  }
  const poles = limitPoles(cage, { sharpBoundary });
  const patches = [];
  for (let fi = 0; fi < cage.faces.length; fi++) {
    const patch = patchFor(cage, poles, fi);
    if (patch) patches.push(patch);
  }
  return { patches, cage, poles, quadded, levels: Math.max(0, Math.round(levels)) };
}

/* ------------------------------------------------------- evaluating a patch

   The same arithmetic Geom_BSplineSurface does in C++, written here so the
   tests can check the poles against the subdivision without a kernel, and so
   the kink measurement below has something to measure.                       */

const bern = t => {
  const s = 1 - t;
  return [s * s * s, 3 * s * s * t, 3 * s * t * t, t * t * t];
};
const dbern = t => {
  const s = 1 - t;
  return [-3 * s * s, 3 * s * s - 6 * s * t, 6 * s * t - 3 * t * t, 3 * t * t];
};

const blend = (poles, bu, bv) => {
  let x = 0, y = 0, z = 0;
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++) {
      const w = bu[i] * bv[j], p = poles[i][j];
      x += w * p[0]; y += w * p[1]; z += w * p[2];
    }
  return [x, y, z];
};

export const patchPoint = (poles, u, v) => blend(poles, bern(u), bern(v));
export const patchDu = (poles, u, v) => blend(poles, dbern(u), bern(v));
export const patchDv = (poles, u, v) => blend(poles, bern(u), dbern(v));

//! The outward normal, with the one degeneracy a bicubic can have guarded: at
//! a corner where three poles coincide a first derivative vanishes, and the
//! normal has to be taken a hair inside instead of reported as zero.
export function patchNormal(poles, u, v) {
  let n = pmCross(patchDu(poles, u, v), patchDv(poles, u, v));
  if (pmLen(n) < 1e-12) {
    const uu = Math.min(0.999, Math.max(0.001, u)), vv = Math.min(0.999, Math.max(0.001, v));
    n = pmCross(patchDu(poles, uu, vv), patchDv(poles, uu, vv));
  }
  return pmUnit(n);
}

/* --------------------------------------------------------- the honest bit

   HOW FAR FROM SMOOTH THE RESULT IS, in degrees, measured rather than
   asserted. Two patches that share an edge always share it exactly - the poles
   came from the cage, not from either patch - so there is never a gap. What
   there can be is a tangent break, and only along an edge with an
   extraordinary vertex at one end. This walks exactly those edges, takes the
   normal from both sides at a few places along each, and reports the worst
   angle between them. Everywhere else the number is zero to rounding, which is
   the regular case being exact and is worth seeing.                          */

export function worstKink(cage, patches, poles, samples = 5) {
  const topo = poles.topo || topologyOf(cage);
  const byFace = new Map(patches.map(p => [p.face, p]));
  const odd = poles.kinds.map(kind => !kind.rim && !kind.pinned && kind.k !== 4);
  let worst = 0, where = null, counted = 0;
  for (const [key, edge] of topo.edges) {
    if (edge.faces.length !== 2) continue;
    if (!odd[edge.a] && !odd[edge.b]) continue;
    const one = byFace.get(edge.faces[0]), two = byFace.get(edge.faces[1]);
    if (!one || !two) continue;
    counted++;
    for (let s = 0; s <= samples; s++) {
      const t = s / samples;
      const a = normalOnEdge(one, edge.a, edge.b, t);
      const b = normalOnEdge(two, edge.a, edge.b, t);
      if (!a || !b) continue;
      const dot = Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2]));
      const angle = Math.acos(dot) * 180 / Math.PI;
      if (angle > worst) { worst = angle; where = key; }
    }
  }
  return { worst, where, edges: counted,
           extraordinary: odd.reduce((n, yes) => n + (yes ? 1 : 0), 0) };
}

//! The normal of one patch at a fraction along one of its four sides, found by
//! which pair of its corners the edge is.
function normalOnEdge(patch, a, b, t) {
  const c = patch.corners;
  const ia = c.indexOf(a), ib = c.indexOf(b);
  if (ia < 0 || ib < 0) return null;
  const forward = (ia + 1) % 4 === ib;
  if (!forward && (ib + 1) % 4 !== ia) return null;      // a diagonal, not a side
  const from = forward ? ia : ib;
  const s = forward ? t : 1 - t;
  // Sides in order: 0 is v=0 going along u, 1 is u=1 along v, 2 is v=1 back
  // along u, 3 is u=0 back along v.
  const at = [[s, 0], [1, s], [1 - s, 1], [0, 1 - s]][from];
  return patchNormal(patch.poles, at[0], at[1]);
}

/* ----------------------------------------------------------- the oracle

   The subdivision is the thing being approximated, so it is also what says
   whether the approximation is right. \ref limitSeat applies the limit mask to
   a cage; applying it, subdividing, and applying it again at the same vertex
   has to give the same point to the last bit, because the mask is the left
   eigenvector of the subdivision matrix for eigenvalue one. That is a test
   with no tolerance in it, and it is what the suite checks.                  */

export function limitSeat(mesh, i, topo = topologyOf(mesh)) {
  const faces = topo.vertFaces[i] || [];
  const around = topo.vertEdges[i] || [];
  const n = faces.length;
  if (!n || n !== around.length) return null;            // only for the smooth case
  const P = mesh.points;
  let edges = [0, 0, 0], diag = [0, 0, 0];
  for (const key of around) {
    const [a, b] = edgeEnds(key);
    edges = pmAdd(edges, P[a === i ? b : a]);
  }
  for (const fi of faces) {
    const at = mesh.faces[fi].indexOf(i);
    const face = mesh.faces[fi];
    if (face.length === 4) diag = pmAdd(diag, P[face[(at + 2) % 4]]);
    else {
      let sum = [0, 0, 0];
      for (const v of face) sum = pmAdd(sum, P[v]);
      diag = pmAdd(diag, pmMul(sum, 1 / face.length));
    }
  }
  return pmMul(pmAdd(pmAdd(pmMul(P[i], n * n), pmMul(edges, 4)), diag), 1 / (n * (n + 5)));
}
