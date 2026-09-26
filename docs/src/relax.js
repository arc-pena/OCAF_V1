// Dynamic relaxation: a net, let go, and where it settles.
//
// Every other solver in this program answers a question with an equation. This
// one does not answer a question at all - it lets a thing move under its own
// rules until it stops, and where it stops IS the answer. That is how a cable
// net, a gridshell, a tent, a soap film and a geodesic on a surface are all
// found, and none of them can be typed in.
//
// The rules are three:
//
//   EVERY EDGE PULLS. A spring between two vertices, pulling towards a rest
//   length. Rest length nought is the one that matters: a net whose every edge
//   wants to be shorter, held open only by what is pinned, settles into the
//   least-area surface those anchors allow. That is the soap film, and it is
//   why "minimal" needs no special case here.
//
//   ANYTHING HELD IS PUT BACK, every step, onto whatever it is held to - a
//   point, a curve, a surface, or where it started. This is a projection and
//   not a force: a vertex told to live on a curve is ON the curve at every
//   step, and slides along it as the net pulls. That is the difference between
//   "attracted to" and "constrained to", and it is the thing the user asked
//   for: pick the top row, say "on that curve", and let the rest find itself.
//
//   EVERYTHING ELSE RELAXES TO ITS NEIGHBOURS, which is what is left when the
//   other two have had their say, and is why nothing has to be constrained.
//
// NOTHING HERE KNOWS WHAT A CURVE IS. A target arrives as points - a polyline
// for a curve, triangles for a surface, a plane as its own four numbers - so
// the solver is arithmetic over arrays and can be checked against answers
// worked out on paper. The kernel does the sampling; see the Hold driver.
//
// Verlet rather than force-and-velocity: position, previous position, and the
// difference between them IS the velocity, so a projection that moves a vertex
// also changes its momentum in exactly the way the constraint implies. It is
// what every cloth solver since Jakobsen 2001 uses, for that reason.

//! Named apart from every other module's, because the single-file build puts
//! them all in one scope and build.py refuses two declarations of one name -
//! which is how this was found rather than by a ReferenceError in a browser.
const rxAdd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const rxSub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const rxMul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const rxDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const rxLen = a => Math.hypot(a[0], a[1], a[2]);
const rxDist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

/* ----------------------------------------------------------- the targets

   What a vertex can be held to. Each one answers one question - where is the
   nearest point of you to this point - and that is the whole interface.     */

//! Where it started, and it does not move.
export const heldWhereItIs = () => ({ kind: "fixed" });
//! One place, exactly.
export const heldAt = p => ({ kind: "point", p: p.slice() });
//! A curve, sampled. The nearest point on a polyline is the nearest point on
//! the nearest segment, and a segment is the one piece of geometry whose
//! nearest point has a closed form.
export const heldOnCurve = pts => ({ kind: "curve", pts: pts.map(p => p.slice()) });
//! A surface, as the triangles it was tessellated into.
export const heldOnSurface = (pts, tris) =>
  ({ kind: "surface", pts: pts.map(p => p.slice()), tris: tris.slice() });
//! A plane needs no sampling: the nearest point on an infinite plane is exact,
//! and a sampled plane would hold a net inside the rectangle somebody drew.
export const heldOnPlane = (origin, normal) => {
  const n = rxLen(normal) > 1e-12 ? rxMul(normal, 1 / rxLen(normal)) : [0, 0, 1];
  return { kind: "plane", origin: origin.slice(), normal: n };
};

//! The nearest point of a segment to \p p, as a point.
function onSegment(a, b, p) {
  const along = rxSub(b, a);
  const reach = rxDot(along, along);
  if (reach < 1e-18) return a.slice();
  const t = Math.max(0, Math.min(1, rxDot(rxSub(p, a), along) / reach));
  return rxAdd(a, rxMul(along, t));
}

//! The nearest point of a triangle to \p p. The plane's foot when the foot is
//! inside the triangle, and the nearest point of the nearest edge when it is
//! not - which is the whole of the case analysis, written out rather than
//! solved with barycentric inequalities because this is the version that is
//! obviously right when somebody reads it in two years.
function onTriangle(a, b, c, p) {
  const ab = rxSub(b, a), ac = rxSub(c, a);
  const n = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2],
             ab[0] * ac[1] - ab[1] * ac[0]];
  const area2 = rxLen(n);
  if (area2 < 1e-18) return onSegment(a, b, p);
  const unit = rxMul(n, 1 / area2);
  const foot = rxSub(p, rxMul(unit, rxDot(rxSub(p, a), unit)));
  //! Inside, by the sign of the three edge cross products against the normal.
  const side = (u, v) => {
    const e = rxSub(v, u), w = rxSub(foot, u);
    return rxDot([e[1] * w[2] - e[2] * w[1], e[2] * w[0] - e[0] * w[2],
                e[0] * w[1] - e[1] * w[0]], unit);
  };
  if (side(a, b) >= 0 && side(b, c) >= 0 && side(c, a) >= 0) return foot;
  let best = null, away = Infinity;
  for (const [u, v] of [[a, b], [b, c], [c, a]]) {
    const q = onSegment(u, v, p);
    const d = rxDist(q, p);
    if (d < away) { away = d; best = q; }
  }
  return best;
}

//! WHERE A HELD VERTEX BELONGS, given where it has drifted to. One function,
//! every kind of target, and the only thing the solver ever asks of one.
export function nearestOnHold(target, p, was) {
  if (!target) return p;
  switch (target.kind) {
    case "fixed":  return (was || p).slice();
    case "point":  return target.p.slice();
    case "plane":
      return rxSub(p, rxMul(target.normal, rxDot(rxSub(p, target.origin), target.normal)));
    case "curve": {
      const pts = target.pts;
      if (pts.length === 0) return p;
      if (pts.length === 1) return pts[0].slice();
      let best = null, away = Infinity;
      for (let i = 0; i + 1 < pts.length; i++) {
        const q = onSegment(pts[i], pts[i + 1], p);
        const d = rxDist(q, p);
        if (d < away) { away = d; best = q; }
      }
      return best;
    }
    case "surface": {
      const { pts, tris } = target;
      if (!tris.length) return p;
      let best = null, away = Infinity;
      for (let i = 0; i + 2 < tris.length; i += 3) {
        const q = onTriangle(pts[tris[i]], pts[tris[i + 1]], pts[tris[i + 2]], p);
        const d = rxDist(q, p);
        if (d < away) { away = d; best = q; }
      }
      return best;
    }
    default: return p;
  }
}

/* ------------------------------------------------------------ the solver */

//! The springs a mesh has: one per edge, each remembering how long it was
//! drawn. Faces of any number of corners, so a quad cage gives four springs a
//! face and an n-gon gives n.
export function springsOf(mesh) {
  const seen = new Set();
  const springs = [];
  for (const face of mesh.faces || []) {
    for (let i = 0; i < face.length; i++) {
      const a = face[i], b = face[(i + 1) % face.length];
      if (a === b) continue;
      const key = a < b ? a + "," + b : b + "," + a;
      if (seen.has(key)) continue;
      seen.add(key);
      springs.push([Math.min(a, b), Math.max(a, b)]);
    }
  }
  //! A MESH WITH NO FACES IS A CHAIN. The minimal-tension curve the user asked
  //! for first is exactly this: a run of points, pinned at the ends, every
  //! link pulling - and there is no face anywhere in it. Rather than making
  //! them build a degenerate strip, a mesh that arrives with points and no
  //! faces is read as the polyline through them.
  if (!springs.length && (mesh.points || []).length > 1)
    for (let i = 0; i + 1 < mesh.points.length; i++) springs.push([i, i + 1]);
  return springs;
}

//! What a spring wants to be.
//!
//!   "keep"    as long as it was drawn - a net that holds its size
//!   "zero"    nothing at all - every edge pulls as hard as it can, and what
//!             is left when the anchors have had their say is the least-area
//!             surface between them. The soap film, and the reason "minimal"
//!             is not a mode in here.
//!   "even"    the average of the mesh's own edges, which is what evens out a
//!             grid stretched unevenly over something
export const RELAX_RESTS = ["keep", "zero", "even"];

//! \p mesh    { points, faces } - faces optional, see springsOf
//! \p holds   [{ verts: [index], target }] - later ones win where they overlap
//! \returns   { points, steps, moved, pulled } - moved is the furthest any
//!            vertex went on the last step, which is what "settled" means;
//!            pulled is the furthest a projection had to haul a held vertex
//!            back, which is how hard the constraints are working
export function relaxMesh(mesh, holds = [], options = {}) {
  const {
    steps = 200, stiffness = 0.5, damping = 0.9, rest = "keep",
    restLength = null, gravity = null, settled = 1e-5,
  } = options;

  const points = (mesh.points || []).map(p => p.slice());
  const start = points.map(p => p.slice());
  const springs = springsOf(mesh);
  if (!points.length || !springs.length)
    return { points, steps: 0, moved: 0, springs: springs.length };

  //! Measured on the mesh as it arrived, before anything has moved: a rest
  //! length taken from a net that has already been pulled about is a rest
  //! length that remembers the pulling.
  const drawn = springs.map(([a, b]) => rxDist(start[a], start[b]));
  const evenly = drawn.reduce((sum, v) => sum + v, 0) / drawn.length;
  const wants = springs.map((_, i) => Number.isFinite(restLength) ? restLength
    : rest === "zero" ? 0 : rest === "even" ? evenly : drawn[i]);

  //! WHO IS HELD TO WHAT. A vertex named twice is held by the last thing that
  //! named it, which is what makes "constrain some, then constrain some more"
  //! behave the way a person means it: the newest instruction wins.
  const held = new Map();
  for (const hold of holds)
    for (const v of hold.verts || [])
      if (v >= 0 && v < points.length) held.set(v, hold.target);

  const previous = points.map(p => p.slice());
  const move = points.map(() => [0, 0, 0]);
  const share = points.map(() => 0);
  let moved = 0, pulled = 0, ran = 0;

  for (let step = 0; step < Math.max(0, steps); step++) {
    ran = step + 1;
    //! Verlet: where it was going is where it was, subtracted from where it is.
    for (let i = 0; i < points.length; i++) {
      const p = points[i], q = previous[i];
      const next = [p[0] + (p[0] - q[0]) * damping,
                    p[1] + (p[1] - q[1]) * damping,
                    p[2] + (p[2] - q[2]) * damping];
      if (gravity) { next[0] += gravity[0]; next[1] += gravity[1]; next[2] += gravity[2]; }
      previous[i] = p;
      points[i] = next;
    }
    //! Every spring, all at once rather than one after another: a Gauss-Seidel
    //! pass over a net makes the vertex that happens to be first in the list
    //! matter, and on a symmetric net that shows as a lopsided answer. So the
    //! corrections are gathered and applied together, which is Jacobi, which
    //! is symmetric.
    for (let i = 0; i < points.length; i++) { move[i][0] = move[i][1] = move[i][2] = 0; share[i] = 0; }
    for (let s = 0; s < springs.length; s++) {
      const [a, b] = springs[s];
      const along = rxSub(points[b], points[a]);
      const now = rxLen(along);
      if (now < 1e-12) continue;
      const pull = ((now - wants[s]) / now) * stiffness * 0.5;
      for (let k = 0; k < 3; k++) {
        move[a][k] += along[k] * pull;
        move[b][k] -= along[k] * pull;
      }
      share[a]++; share[b]++;
    }
    for (let i = 0; i < points.length; i++) {
      if (!share[i]) continue;
      const p = points[i];
      p[0] += move[i][0] / share[i] * 2;
      p[1] += move[i][1] / share[i] * 2;
      p[2] += move[i][2] / share[i] * 2;
    }
    //! AND THEN WHAT IS HELD IS PUT BACK. Last, so it is the thing that is
    //! true at the end of the step: a vertex on a curve is on the curve in
    //! every state anybody ever sees, never "nearly, until the next pass".
    //! TWO DIFFERENT NUMBERS, and mixing them cost an afternoon. How far a
    //! projection has to HAUL a held vertex back each step is a measure of how
    //! hard the constraint is working, and under a load it never falls to
    //! nothing: gravity pumps a little velocity in every step and the
    //! constraint takes it out again, for ever. How far the NET moved between
    //! one step and the next is the settling measure, and it does go to
    //! nothing. Counting the haul as movement meant a chain that had been
    //! still to fifteen decimal places since step 2,000 reported 0.6 mm of
    //! movement at step 40,000 and never stopped early.
    pulled = 0;
    for (const [v, target] of held) {
      const want = nearestOnHold(target, points[v], start[v]);
      pulled = Math.max(pulled, rxDist(want, points[v]));
      points[v] = want;
    }
    moved = 0;
    for (let i = 0; i < points.length; i++)
      moved = Math.max(moved, rxDist(points[i], previous[i]));
    if (moved < settled) break;
  }

  return { points, steps: ran, moved, pulled, springs: springs.length };
}
