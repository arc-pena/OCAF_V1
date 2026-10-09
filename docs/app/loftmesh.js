// Cages made from curves: lofts and sweeps that stay low-poly and stay live.
//
// THE POINT OF THESE. A subdivision cage is normally pushed into shape by
// hand, and that is the right way to make a character and the wrong way to
// make a handrail. A handrail is a section and a path, and it ought to be
// typed in. So these build the CAGE from curves - a few dozen quads, not a
// tessellation - and the two resolutions stay arguments: how many faces round
// the section, how many along the run. Change either and the whole thing is
// rebuilt from the curves, because the curves are what the shape IS.
//
// WHY A CAGE RATHER THAN A SURFACE. A swept B-Rep is finished the moment it
// exists: to twist it, taper it or pull one end sideways you start again. A
// cage can be pushed about, creased, bridged into its neighbour and then
// turned into exact NURBS by \ref limitPatches - so the parametric route and
// the hand-modelled route are the same object at different moments.
//
// THE THREE THINGS THAT GO WRONG, all of them here rather than in the driver,
// because all three are arithmetic and arithmetic can be tested:
//
//   1. UNEVEN SAMPLING. A curve walked by parameter bunches its points where
//      the parameterisation is dense - at the ends of a spline, round the
//      tight part of a fillet - and the cage comes out with quads four times
//      the size of their neighbours. \ref evenRing walks by ARC LENGTH.
//
//   2. TWIST BETWEEN SECTIONS. Two circles sampled independently start at
//      whatever point their own parameterisation starts at, and lofting them
//      index to index wraps the surface by however far apart those are.
//      \ref alignRing rotates and if need be reverses each ring against the
//      one before it.
//
//   3. TWIST ALONG A PATH. A Frenet frame is built from the curve's second
//      derivative, so it spins through a tight bend and FLIPS RIGHT OVER at an
//      inflection - a section swept along an S comes out with a half turn in
//      the middle of it. \ref transportFrames carries the frame forward by
//      double reflection (Wang, Jüttler, Zheng and Liu, ACM TOG 27(1), 2008),
//      which has no second derivative in it and cannot flip.

import { pmAdd, pmSub, pmMul, pmCross, pmDot, pmLen, pmUnit, pmMid } from "./polymesh.js";

/* ------------------------------------------------------ even by arc length */

//! \p count points spread evenly ALONG a polyline rather than evenly through
//! its indices. An open run keeps both ends; a closed one spreads \p count
//! points round the whole loop and does not repeat the first.
export function evenRing(points, count, closed = true, phase = 0) {
  const want = Math.max(closed ? 3 : 2, Math.round(count));
  const list = points.map(p => [p[0], p[1], p[2]]);
  if (list.length < 2) return new Array(want).fill(list[0] || [0, 0, 0]);
  const walk = closed ? list.concat([list[0]]) : list;
  const run = [0];
  for (let i = 1; i < walk.length; i++) run.push(run[i - 1] + pmLen(pmSub(walk[i], walk[i - 1])));
  const total = run[run.length - 1];
  if (!(total > 0)) return new Array(want).fill(list[0]);

  const out = [];
  const steps = closed ? want : want - 1;
  //! \p phase slides the start point along the loop by a fraction of ONE STEP,
  //! which is what lets a ring be lined up exactly rather than to the nearest
  //! index. Only meaningful on a closed loop: an open run's ends are its ends.
  const from = closed ? total * (((phase % 1) + 1) % 1) / steps : 0;
  let at = 1;
  for (let k = 0; k < want; k++) {
    //! THE WRAP IS FOR CLOSED LOOPS ONLY. Taking the modulo on an open run puts
    //! its LAST point back at its first - total % total is 0 - so a sweep's far
    //! station landed at the near end of the path and the section appeared to
    //! turn over by 127 degrees in one step. An open run has ends; that is what
    //! makes it open.
    const raw = from + total * (k / steps);
    const target = closed ? raw % total : Math.min(raw, total);
    if (target < run[at - 1]) at = 1;
    while (at < run.length - 1 && run[at] < target) at++;
    const back = run[at] - run[at - 1];
    const t = back > 1e-12 ? (target - run[at - 1]) / back : 0;
    out.push(pmAdd(walk[at - 1], pmMul(pmSub(walk[at], walk[at - 1]), t)));
  }
  return out;
}

/* ----------------------------------------------------------- no twist here

   TWO RINGS OF THE SAME SIZE, lined up. Every rotation of the second ring is
   tried against the first, both ways round, and the one whose points sit
   nearest the first ring's wins. It is O(n^2) and n is a cage's worth - forty,
   sixty - so it is nothing, and the alternative is a loft with a wrap in it
   that nobody can see the cause of.                                          */

export function alignRing(previous, ring, closed = true) {
  const n = ring.length;
  if (!previous || previous.length !== n) return ring;
  const costOf = order => {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const d = pmSub(previous[i], order[i]);
      sum += d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
    }
    return sum;
  };
  let best = ring, cheapest = costOf(ring);
  const turns = closed ? n : 1;
  for (const way of [ring, ring.slice().reverse()])
    for (let shift = 0; shift < turns; shift++) {
      //! A reversed CLOSED ring has to be rotated as well, because reversing
      //! moves the start point to the far end of the loop. Reversing an OPEN
      //! run must not be rotated - its ends are its ends.
      const order = closed ? way.slice(shift).concat(way.slice(0, shift)) : way;
      const cost = costOf(order);
      if (cost < cheapest) { cheapest = cost; best = order; }
      if (!closed) break;
    }
  return best;
}

//! Every section at the same count, in the same direction, starting at the
//! same place - which is what makes the quads line up.
//!
//! ROTATING BY WHOLE INDICES IS NOT ENOUGH, and the leftover is visible. Two
//! identical circles a third of a turn out of phase, lofted at sixteen points:
//! the best whole-step rotation leaves 120 modulo 22.5 degrees, which at
//! radius 100 is a 13 mm shear, and the prism comes out skewed. So each
//! section is RE-SAMPLED at the phase that fits, by a sweep of the step
//! followed by a short bisection - 200.427 mm along-edges became 200.000.
const PHASE_TRIES = 32, PHASE_REFINES = 24;

export function alignSections(sections, around, closed = true) {
  const rings = [];
  for (const section of sections) {
    if (!rings.length) { rings.push(evenRing(section, around, closed)); continue; }
    const previous = rings[rings.length - 1];
    const costOf = phase => {
      const ring = alignRing(previous, evenRing(section, around, closed, phase), closed);
      let sum = 0;
      for (let i = 0; i < ring.length; i++) {
        const d = pmSub(previous[i], ring[i]);
        sum += d[0] * d[0] + d[1] * d[1] + d[2] * d[2];
      }
      return { cost: sum, ring };
    };
    if (!closed) { rings.push(costOf(0).ring); continue; }
    let best = costOf(0), bestPhase = 0;
    for (let k = 1; k < PHASE_TRIES; k++) {
      const phase = k / PHASE_TRIES, got = costOf(phase);
      if (got.cost < best.cost) { best = got; bestPhase = phase; }
    }
    let span = 1 / PHASE_TRIES;
    for (let k = 0; k < PHASE_REFINES; k++) {
      span /= 2;
      for (const phase of [bestPhase - span, bestPhase + span]) {
        const got = costOf(phase);
        if (got.cost < best.cost) { best = got; bestPhase = phase; }
      }
    }
    rings.push(best.ring);
  }
  return rings;
}

/* --------------------------------------------------- rings between rings */

//! \p along spans between each pair of sections, so a two-section loft with
//! along 3 has three rows of quads and four rings. Straight interpolation:
//! the sections are the cage's own control rings and the subdivision is what
//! curves the run between them.
export function fillAlong(rings, along = 1, closedAlong = false) {
  const steps = Math.max(1, Math.round(along));
  if (steps === 1 && !closedAlong) return rings;
  const spans = closedAlong ? rings.length : rings.length - 1;
  const out = [];
  for (let s = 0; s < spans; s++) {
    const a = rings[s], b = rings[(s + 1) % rings.length];
    for (let k = 0; k < steps; k++) {
      const t = k / steps;
      out.push(a.map((p, i) => pmAdd(p, pmMul(pmSub(b[i], p), t))));
    }
  }
  if (!closedAlong) out.push(rings[rings.length - 1]);
  return out;
}

/* ------------------------------------------------------------- the cage */

//! Rings in, quads out. One quad per (ring pair, step round), plus caps if the
//! ends are closed loops and somebody wants them filled.
//!
//! WOUND SO THE OUTSIDE IS OUT, which is decided by the order the rings are
//! given in and the direction they run. Nothing here can know which way is out
//! on its own - a loft is a surface before it is a solid - so what this
//! guarantees is CONSISTENCY: every quad is wound the same way round as its
//! neighbour, and \ref faceNormal of one tells you about all of them.
export function loftCage(rings, { closedAround = true, closedAlong = false, caps = false } = {}) {
  if (rings.length < 2) throw new Error("a loft needs at least two rings");
  const n = rings[0].length;
  if (rings.some(r => r.length !== n))
    throw new Error("every ring has to have the same number of points");
  const points = [];
  const index = rings.map(ring => ring.map(p => {
    points.push([p[0], p[1], p[2]]);
    return points.length - 1;
  }));
  const faces = [];
  const spans = closedAlong ? rings.length : rings.length - 1;
  const steps = closedAround ? n : n - 1;
  for (let s = 0; s < spans; s++) {
    const a = index[s], b = index[(s + 1) % rings.length];
    for (let i = 0; i < steps; i++) {
      const j = (i + 1) % n;
      faces.push([a[i], b[i], b[j], a[j]]);
    }
  }
  //! CAPPED WITH AN N-GON, and that is where the extraordinary vertices come
  //! from. Subdividing a twelve-sided cap puts a vertex of valence twelve in
  //! the middle of it with a ring of valence-three vertices round it, and those
  //! are exactly the places the NURBS conversion cannot be exact: measured on a
  //! twelve-sided swept tube, 26 extraordinary vertices and patches meeting
  //! 26.3 degrees out of tangent, on a body whose WALL is exact everywhere.
  //!
  //! A grid of quads would spend those better - four corners of valence three
  //! per cap instead of a star - and Euler says a closed surface cannot have
  //! none whatever you do, so it is only ever a question of where to spend
  //! them. polymesh's gridFill is the obvious tool and it is BROKEN: on a plain
  //! twelve-ring it leaves fourteen open edges and six non-manifold ones,
  //! because its interior rows take their ends from loop vertices that are
  //! already in the opposite run. Until that is fixed this stays an n-gon,
  //! which is at least a surface.
  if (caps && !closedAlong && closedAround) {
    faces.push(index[0].slice());
    faces.push(index[index.length - 1].slice().reverse());
  }
  return { points, faces, creases: {}, corners: {} };
}

/* ------------------------------------------ a frame that cannot flip over

   DOUBLE REFLECTION. The frame at the next station is the frame at this one,
   reflected in the plane between the two points and then in the plane between
   the reflected tangent and the real one. Two reflections are a rotation, the
   rotation is the smallest one that takes this tangent to the next, and NO
   SECOND DERIVATIVE APPEARS ANYWHERE - which is the whole of why it does not
   spin at a tight bend or flip at an inflection, and a Frenet frame does
   both.                                                                     */

export function transportFrames(points, tangents, seed = null) {
  const n = points.length;
  if (!n) return [];
  const first = pmUnit(tangents[0]);
  //! A reference direction square to the first tangent. Whatever is handed in
  //! if it is usable, and otherwise whichever world axis is least parallel to
  //! the tangent - taking one at random gives a sweep whose section is rolled
  //! differently every time the path is nudged.
  let up = seed ? pmSub(seed, pmMul(first, pmDot(seed, first))) : [0, 0, 0];
  if (pmLen(up) < 1e-9) {
    const away = Math.abs(first[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    up = pmSub(away, pmMul(first, pmDot(away, first)));
  }
  const frames = [{ at: points[0], t: first, r: pmUnit(up), s: pmUnit(pmCross(first, pmUnit(up))) }];
  for (let i = 0; i + 1 < n; i++) {
    const here = frames[i];
    const next = pmUnit(tangents[i + 1]);
    const v1 = pmSub(points[i + 1], points[i]);
    const c1 = pmDot(v1, v1);
    let r = here.r, t = here.t;
    if (c1 > 1e-18) {
      r = pmSub(here.r, pmMul(v1, 2 * pmDot(v1, here.r) / c1));
      t = pmSub(here.t, pmMul(v1, 2 * pmDot(v1, here.t) / c1));
    }
    const v2 = pmSub(next, t);
    const c2 = pmDot(v2, v2);
    if (c2 > 1e-18) r = pmSub(r, pmMul(v2, 2 * pmDot(v2, r) / c2));
    r = pmUnit(pmSub(r, pmMul(next, pmDot(r, next))));
    frames.push({ at: points[i + 1], t: next, r, s: pmUnit(pmCross(next, r)) });
  }
  return frames;
}

/* -------------------------------------------------------- a section, flat

   A SWEPT SECTION IS TWO NUMBERS PER POINT, not three. Read the curve once
   into its own plane and carry (u, v); every station then places the same
   pair against its own frame, which is what makes a sweep a sweep rather than
   a loft of curves that happen to look alike.                               */

export function sectionPlane(points) {
  const at = pmMid(points);
  //! Newell, so a section that is not quite flat - and one drawn by hand never
  //! is - still has one honest normal rather than the normal of whichever
  //! three points were asked.
  let n = [0, 0, 0];
  for (let i = 0; i < points.length; i++) {
    const p = points[i], q = points[(i + 1) % points.length];
    n = pmAdd(n, [(p[1] - q[1]) * (p[2] + q[2]),
                  (p[2] - q[2]) * (p[0] + q[0]),
                  (p[0] - q[0]) * (p[1] + q[1])]);
  }
  n = pmUnit(n);
  if (pmLen(n) < 1e-9) n = [0, 0, 1];
  let x = pmSub(points[0], at);
  x = pmSub(x, pmMul(n, pmDot(x, n)));
  if (pmLen(x) < 1e-9) {
    const away = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    x = pmSub(away, pmMul(n, pmDot(away, n)));
  }
  x = pmUnit(x);
  const y = pmUnit(pmCross(n, x));
  return { at, normal: n, x, y,
           uv: points.map(p => [pmDot(pmSub(p, at), x), pmDot(pmSub(p, at), y)]) };
}

/* ------------------------------------------------------------- the sweep */

//! A section carried along a path. \p along is how many spans down the run and
//! \p around how many round the section, and both stay arguments.
//!
//! \p twist is turns over the whole run and \p taper what the section is scaled
//! to at the far end - the two things a swept B-Rep cannot be asked for after
//! the fact, and the reason to sweep a cage at all.
export function sweepCage(section, path, { around = 12, along = 8, closedSection = true,
                                           closedPath = false, twist = 0, taper = 1,
                                           caps = false, seed = null } = {}) {
  const ring = evenRing(section, around, closedSection);
  const plane = sectionPlane(ring);
  const stations = evenRing(path, closedPath ? Math.max(3, Math.round(along))
                                             : Math.max(2, Math.round(along) + 1), closedPath);
  //! Tangents from the stations themselves, centred so a station in the middle
  //! of the run looks both ways. Reading them off the curve would be better and
  //! is not available here - this module takes points, so that every bit of it
  //! can be tested without a kernel.
  const tangents = stations.map((p, i) => {
    const before = stations[(i - 1 + stations.length) % stations.length];
    const after = stations[(i + 1) % stations.length];
    if (!closedPath && i === 0) return pmUnit(pmSub(stations[1], stations[0]));
    if (!closedPath && i === stations.length - 1)
      return pmUnit(pmSub(stations[i], stations[i - 1]));
    return pmUnit(pmSub(after, before));
  });
  const frames = transportFrames(stations, tangents, seed);

  const rings = frames.map((frame, k) => {
    const t = frames.length > 1 ? k / (frames.length - 1) : 0;
    const turn = twist * Math.PI * 2 * t;
    const cos = Math.cos(turn), sin = Math.sin(turn);
    const scale = 1 + (taper - 1) * t;
    return plane.uv.map(([u, v]) => {
      const a = (u * cos - v * sin) * scale, b = (u * sin + v * cos) * scale;
      return pmAdd(frame.at, pmAdd(pmMul(frame.r, a), pmMul(frame.s, b)));
    });
  });
  return loftCage(rings, { closedAround: closedSection, closedAlong: closedPath, caps });
}

//! The loft: sections in, cage out, with the three fixes above applied in the
//! order they have to be - even first, then aligned, then filled between.
export function loftThrough(sections, { around = 12, along = 1, closedSection = true,
                                        closedAlong = false, caps = false } = {}) {
  if (sections.length < 2) throw new Error("a loft needs at least two sections");
  const rings = alignSections(sections, around, closedSection);
  //! A closed run has to come back to the first ring, so the LAST span is
  //! aligned against the first ring as well - otherwise the seam is the one
  //! place in the loft with a wrap in it.
  if (closedAlong && rings.length > 2)
    rings[rings.length - 1] = alignRing(rings[0], rings[rings.length - 1], closedSection);
  return loftCage(fillAlong(rings, along, closedAlong),
                  { closedAround: closedSection, closedAlong, caps });
}
