// Soft selection, and what you can do to one.
//
// WHAT THIS IS FOR. In 3ds Max or Maya a soft selection is a thing you make
// with the mouse: pick some vertices, drag a falloff slider, push them about,
// and the shape you get is the shape you happened to get. It is the single
// most useful mesh tool there is and the single least repeatable, because the
// selection is a list of vertex indices and the deformation is a drag.
//
// Here it is neither. An attractor is GEOMETRY - a point, a curve, a plane,
// another mesh - and the selection is the distance field it makes, re-measured
// every time anything upstream moves. Move the attractor point and the bulge
// follows it. Lengthen the curve and the ridge grows. Change the cage's
// resolution underneath and the same selection comes back, because it was
// never a list of indices in the first place.
//
// THE REPRESENTATION. A weight per vertex, in 0..1, carried on the mesh
// itself - see meshWeights in ocaf.js for how it is stored, and streamMesh for
// how it is drawn. That is what makes the deformers below composable: each one
// takes a mesh that already knows which parts of it are selected and how
// strongly, so Move then Twist then Bend is three nodes over one selection
// rather than three selections.
//
// WHAT EVERY DEFORMER DOES WITH A WEIGHT. The same thing, and it is worth
// saying once here rather than six times below:
//
//     p' = p + w · (T(p) - p)
//
// The transform T is computed in full and then the vertex is moved a fraction
// w of the way to it. For a translation that is exactly "move it w times as
// far". For a rotation it is NOT "rotate it by w·angle" - it is a straight
// line towards the rotated position, which is what every package does and what
// makes a half-weighted vertex sit between its neighbours rather than on an
// arc of its own. The difference shows at large angles and it is the lerp that
// looks right.
//
// NOTHING HERE TOUCHES OPENCASCADE OR THE DOM. It is arithmetic over arrays,
// which is what makes docs/test/softselect.test.mjs able to check it against
// numbers worked out on paper.

import { asTriangles } from "./retopo.js";
import { turnAbout } from "./factory.js";
import { pmAdd, pmCross, pmDot, pmLen, pmMul, pmSub, pmUnit } from "./polymesh.js";

/* ===================================================================== falloff

   t is "how far in", 1 at the attractor and 0 at the edge of the zone. The
   curve maps that to a weight. Every one of these is exact at both ends -
   f(0) = 0 and f(1) = 1 - because a falloff that does not reach zero leaves
   the whole mesh faintly moving, and one that does not reach one never fully
   grabs the vertex you aimed at.                                            */

//! THE NAMES THEMSELVES LIVE IN THE CATALOGUE, in ocaf.js beside the node
//! that offers them, because that list is what a person picks from and a
//! second copy here would be a second thing to keep in step. Everything in
//! this file is keyed by the name and falls back to the sensible one, so a
//! name this does not know is a soft failure and not a NaN.
export function falloffAt(style, t) {
  const u = t <= 0 ? 0 : t >= 1 ? 1 : t;
  switch (style) {
    //! Hermite smoothstep. Zero slope at both ends, so the moved region meets
    //! the still one without a crease - this is the one to want nine times out
    //! of ten and so it is first.
    case "Smooth": return u * u * (3 - 2 * u);
    case "Linear": return u;
    //! u², zero slope at the OUTSIDE only: a narrow peak with a long thin
    //! skirt. A spike, and the way to get one.
    case "Sharp": return u * u;
    //! A quarter circle: √(1-(1-u)²). Flat on top and steep at the rim, which
    //! is the shape of a dome and the one that reads as "lift this whole area".
    case "Dome": return Math.sqrt(u * (2 - u));
    //! No falloff at all - everything inside the radius, fully. A hard
    //! selection, which is still a selection and is sometimes exactly it.
    case "Hard": return u > 0 ? 1 : 0;
    default: return u * u * (3 - 2 * u);
  }
}

/* ================================================================= attractors

   Each one answers one question: how far is this point from me. Nothing else.
   The weight, the falloff and the blending are the same arithmetic whatever
   asked, so the kinds differ only in this one function - which is why adding
   "distance to a surface" later is one case and not a second system.         */

export const ssPoint = at => ({ kind: "point", at });

//! A curve, already sampled. This takes the polyline rather than the curve
//! because nothing in here is allowed to know what OpenCascade is: the driver
//! samples the wire and hands the run over. \p closed joins the last point
//! back to the first, so a circle attracts as a ring and not as an arc with
//! a gap in it.
export const ssRun = (points, closed = false) => ({ kind: "run", points, closed });

//! A plane attracts along its NORMAL: the distance is how far off the plane
//! you are, not how far from its middle, so the zone of influence is a slab
//! of thickness 2·radius and the selection runs the whole width of the model.
//! \p side cuts the slab in half when only one face of it is wanted.
export const ssPlane = (origin, normal, side = "Both sides") =>
  ({ kind: "plane", origin, normal: pmUnit(normal), side });

//! Another mesh, as its triangles. Distance to the SURFACE, not to the nearest
//! vertex: a coarse attractor mesh measured vertex-to-vertex gives a lumpy
//! field with a bump at every vertex of it, which looks like a bug in the
//! falloff and is not.
export const ssMesh = mesh => ({ kind: "mesh", triangles: trianglesOf(mesh) });

function trianglesOf(mesh) {
  const tris = asTriangles(mesh);
  return tris.faces.map(face => [tris.points[face[0]], tris.points[face[1]],
                                 tris.points[face[2]]]);
}

//! Distance from a point to a segment, clamped to its ends. The t is clamped
//! BEFORE it is used, which is the whole of it: unclamped, every segment of a
//! polyline reports the distance to its infinite line and a point off the end
//! of a curve is attracted to a place the curve does not reach.
function toSegment(p, a, b) {
  const ab = pmSub(b, a), ap = pmSub(p, a);
  const len2 = pmDot(ab, ab);
  if (len2 < 1e-18) return pmLen(ap);
  const t = Math.max(0, Math.min(1, pmDot(ap, ab) / len2));
  return pmLen(pmSub(ap, pmMul(ab, t)));
}

//! Point to triangle, the full case analysis rather than the plane distance.
//! A point beyond an edge of the triangle is nearer that EDGE than the plane,
//! and using the plane distance there is how an attractor mesh ends up with
//! influence leaking out sideways past its own border.
function toTriangle(p, tri) {
  const [a, b, c] = tri;
  const ab = pmSub(b, a), ac = pmSub(c, a), ap = pmSub(p, a);
  const n = pmCross(ab, ac);
  const area2 = pmDot(n, n);
  if (area2 < 1e-18) {
    //! A degenerate triangle is a segment; measuring to its longest side is
    //! right and dividing by its zero area is not.
    return Math.min(toSegment(p, a, b), toSegment(p, b, c), toSegment(p, c, a));
  }
  //! Barycentric, off the same cross products - inside the triangle the
  //! perpendicular distance is the answer and no edge needs testing.
  const d = pmDot(n, ap) / area2;
  const foot = pmSub(ap, pmMul(n, d));
  const u = pmDot(pmCross(ab, foot), n) / area2;
  const v = pmDot(pmCross(foot, ac), n) / area2;
  if (u >= 0 && v >= 0 && u + v <= 1) return Math.abs(pmDot(n, ap)) / Math.sqrt(area2);
  return Math.min(toSegment(p, a, b), toSegment(p, b, c), toSegment(p, c, a));
}

//! How far this point is from this attractor. Infinity means "not in play at
//! all" - the one-sided plane uses it for everything behind itself, and that
//! is different from "very far away", which would still blend.
export function distanceFrom(attractor, p) {
  switch (attractor.kind) {
    case "point": return pmLen(pmSub(p, attractor.at));
    case "run": {
      const run = attractor.points;
      if (!run.length) return Infinity;
      if (run.length === 1) return pmLen(pmSub(p, run[0]));
      let best = Infinity;
      const last = attractor.closed ? run.length : run.length - 1;
      for (let i = 0; i < last; i++) {
        const d = toSegment(p, run[i], run[(i + 1) % run.length]);
        if (d < best) best = d;
      }
      return best;
    }
    case "plane": {
      const s = pmDot(pmSub(p, attractor.origin), attractor.normal);
      if (attractor.side === "Front" && s < 0) return Infinity;
      if (attractor.side === "Back" && s > 0) return Infinity;
      return Math.abs(s);
    }
    case "mesh": {
      let best = Infinity;
      for (const tri of attractor.triangles) {
        const d = toTriangle(p, tri);
        if (d < best) best = d;
      }
      return best;
    }
    default: return Infinity;
  }
}

/* =================================================================== the field

   WHY BLENDING IS A CHOICE AND NOT A DECISION. Three points along a curve fed
   to one node mean three bulges, and what should happen where two of them
   overlap is a question about the shape somebody wants, not about geometry:
   Largest keeps each bulge its own height and is what a modeller means by
   "three soft selections"; Sum lets them pile up, which is how you build a
   ridge out of a line of points; Average holds the total down. Largest is the
   default because it is the only one of the three that cannot exceed what one
   attractor on its own would have done.                                     */

export function softWeights(points, attractors, options = {}) {
  const radius = Math.max(0, Number(options.radius) || 0);
  const style = options.falloff || "Smooth";
  const blend = options.blend || "Largest";
  const out = new Array(points.length).fill(0);
  if (!attractors.length) return out;
  for (let i = 0; i < points.length; i++) {
    let largest = 0, sum = 0, counted = 0;
    for (const attractor of attractors) {
      const d = distanceFrom(attractor, points[i]);
      if (!Number.isFinite(d)) continue;
      counted++;
      //! A ZONE OF ZERO is a hard pick of what the attractor touches, not an
      //! empty selection. Dividing by it would make every weight NaN and the
      //! whole mesh vanish, which is what it did.
      const t = radius <= 1e-9 ? (d <= 1e-9 ? 1 : 0) : 1 - d / radius;
      const w = falloffAt(style, t);
      if (w > largest) largest = w;
      sum += w;
    }
    out[i] = blend === "Largest" ? largest
      : blend === "Sum" ? Math.min(1, sum)
      : counted ? sum / counted : 0;
  }
  return out;
}

//! What a selection actually caught, for the note. "0.42 of the mesh" means
//! nothing to anybody; "31 of 218 vertices, strongest 1.00" is checkable.
export function weightTally(weights) {
  let touched = 0, full = 0, strongest = 0, total = 0;
  for (const w of weights) {
    if (w > 1e-6) touched++;
    if (w > 0.999) full++;
    if (w > strongest) strongest = w;
    total += w;
  }
  return { touched, full, strongest, total, of: weights.length };
}

/* =================================================================== deformers

   One function with a kind, rather than six functions, because they differ
   only in T and share every other line: the weight rule, the centre, the span
   and the frame. Six copies of that is six places for the weight rule to
   drift.                                                                     */

//! Σw·p / Σw, and the plain centroid when nothing is selected. THE DEFAULT
//! CENTRE OF EVERY DEFORMATION, because a twist about the middle of the whole
//! mesh when you have selected its nose is a twist about a point nowhere near
//! what is moving, and having to wire a point in to say something that obvious
//! would make the node tiresome to use.
export function weightedCentre(points, weights) {
  let total = 0;
  const sum = [0, 0, 0];
  for (let i = 0; i < points.length; i++) {
    const w = weights ? weights[i] : 1;
    if (!(w > 0)) continue;
    total += w;
    sum[0] += points[i][0] * w; sum[1] += points[i][1] * w; sum[2] += points[i][2] * w;
  }
  if (total > 1e-12) return pmMul(sum, 1 / total);
  if (!points.length) return [0, 0, 0];
  const plain = points.reduce((a, p) => pmAdd(a, p), [0, 0, 0]);
  return pmMul(plain, 1 / points.length);
}

//! How far the mesh reaches along the axis, measured from the centre. Twist
//! and Bend are both "this much over the whole length", so they need a length,
//! and the honest one is the model's own: an angle per millimetre is a number
//! nobody can picture, and a span typed in by hand is a number that stops
//! being true the moment the cage changes.
export function spanAlong(points, centre, axis) {
  let low = 0, high = 0;
  for (const p of points) {
    const s = pmDot(pmSub(p, centre), axis);
    if (s < low) low = s;
    if (s > high) high = s;
  }
  return { low, high, span: Math.max(high - low, 1e-9) };
}

//! A POINT turned about a LINE, which is a vector turned about a direction
//! with the centre taken off and put back. The Rodrigues itself is factory's
//! and stays factory's: two of it would be two things to get wrong, and the
//! build refuses the second declaration anyway.
export const spinPoint = (p, centre, axis, angle) =>
  pmAdd(centre, turnAbout(pmSub(p, centre), axis, angle));

//! A direction perpendicular to the axis, for the deformations that need a
//! second one. Taking the caller's if it has any component across the axis,
//! and anything at all if it has not - a bend with no direction given has to
//! bend SOMEWHERE, and refusing to act is a worse answer than picking.
function across(axis, want) {
  const u = pmUnit(axis);
  let v = want ? pmSub(want, pmMul(u, pmDot(u, want))) : [0, 0, 0];
  if (pmLen(v) < 1e-9) {
    const seed = Math.abs(u[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    v = pmSub(seed, pmMul(u, pmDot(u, seed)));
  }
  return pmUnit(v);
}

//! THE BEND, derived rather than fitted. The axis line through the centre is
//! bent into a circular arc of radius R = span/angle, curving towards \p into.
//! In the plane of (axis, into), with s along the axis and x across it:
//!
//!     phi = s / R        the arc the spine has turned through at s
//!     s'  = (R - x)·sin(phi)
//!     x'  = R - (R - x)·cos(phi)
//!
//! which is the point at distance R-x from the arc's centre, on the radius at
//! phi. At phi = 0 it is (0, x), so the centre of the bend does not move; the
//! arclength along the spine is R·phi = s, so nothing stretches along it.
//! A bar of length L bent a right angle puts its end at (2L/pi, 2L/pi), which
//! is a number to check it against and is what the test checks.
function bendPoint(p, centre, axis, into, curvature) {
  const u = pmUnit(axis), v = into, w = pmCross(u, v);
  const r = pmSub(p, centre);
  const s = pmDot(r, u), x = pmDot(r, v), y = pmDot(r, w);
  const R = 1 / curvature;
  const phi = s * curvature;
  const out = (R - x) * Math.sin(phi);
  const side = R - (R - x) * Math.cos(phi);
  return pmAdd(centre, pmAdd(pmAdd(pmMul(u, out), pmMul(v, side)), pmMul(w, y)));
}

/* The whole of it. \p spec is
     { kind, centre, axis, into, by, angle, scale, amount, normals, uniform }
   and which of those are read depends on the kind - see the switch. Points
   come back as a new array; nothing is written into the one handed in.      */
export function deformPoints(points, weights, spec) {
  const kind = spec.kind || "Move";
  const weightOf = i => (weights ? (weights[i] || 0) : 1);
  const centre = spec.centre || weightedCentre(points, weights);
  const axis = pmUnit(spec.axis || [0, 0, 1]);

  let transform;
  switch (kind) {
    case "Move": {
      const by = spec.by || [0, 0, 0];
      transform = p => pmAdd(p, by);
      break;
    }
    case "Rotate": {
      const angle = (spec.angle || 0) * Math.PI / 180;
      transform = p => spinPoint(p, centre, axis, angle);
      break;
    }
    case "Scale": {
      const k = spec.scale === undefined ? 1 : spec.scale;
      if (spec.uniform === false) {
        //! ONE DIMENSION, along the axis. The component across it is left
        //! exactly alone, which is what makes this a stretch and not a scale
        //! with a funny middle.
        transform = p => {
          const r = pmSub(p, centre);
          const s = pmDot(r, axis);
          return pmAdd(p, pmMul(axis, s * (k - 1)));
        };
      } else {
        transform = p => pmAdd(centre, pmMul(pmSub(p, centre), k));
      }
      break;
    }
    case "Twist": {
      const total = (spec.angle || 0) * Math.PI / 180;
      const { span } = spanAlong(points, centre, axis);
      transform = p => spinPoint(p, centre, axis,
                                 total * pmDot(pmSub(p, centre), axis) / span);
      break;
    }
    case "Bend": {
      const total = (spec.angle || 0) * Math.PI / 180;
      const { span } = spanAlong(points, centre, axis);
      const into = across(axis, spec.into);
      //! A bend of nothing is a radius of infinity, and 1/0 is where the mesh
      //! goes to NaN and disappears. Below a thousandth of a degree over the
      //! whole span there is nothing to see anyway.
      if (Math.abs(total) < 1e-7) { transform = p => p; break; }
      const curvature = total / span;
      transform = p => bendPoint(p, centre, axis, into, curvature);
      break;
    }
    case "Pinch": {
      const amount = spec.amount || 0;
      const normals = spec.normals;
      transform = (p, i) => {
        const dir = normals && normals[i] ? normals[i]
          : (pmLen(pmSub(p, centre)) > 1e-9 ? pmUnit(pmSub(p, centre)) : [0, 0, 0]);
        return pmAdd(p, pmMul(dir, amount));
      };
      break;
    }
    default: transform = p => p;
  }

  return points.map((p, i) => {
    const w = weightOf(i);
    if (!(w > 0)) return p.slice();
    const moved = transform(p, i);
    //! The one weight rule, applied in one place. See the header.
    return w >= 1 ? moved : pmAdd(p, pmMul(pmSub(moved, p), w));
  });
}

//! How far anything actually moved, for the note. A deformer wired to a
//! selection that caught nothing does nothing at all, and says nothing at all
//! unless it is asked to measure itself - which is the failure that looks
//! exactly like success.
export function movedBy(before, after) {
  let most = 0, moved = 0;
  for (let i = 0; i < before.length; i++) {
    const d = pmLen(pmSub(after[i], before[i]));
    if (d > 1e-9) moved++;
    if (d > most) most = d;
  }
  return { moved, most };
}
