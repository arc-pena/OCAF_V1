// Wiring and piping: routes, cables and connectors, as arithmetic.
//
// WHAT A HARNESS IS. A cable is not a line on a drawing - it is a diameter, a
// bend radius it will not go below, a length somebody has to order, and two
// ends that have to be the right connector. CATIA's wiring workbench is built
// on exactly that: you say where a run starts, where it goes, where it ends,
// and the geometry follows from the cable you chose.
//
// So this file is the numbers and none of the geometry. It rounds a polyline
// into something sweepable, it knows what a Cat6A cable and an LC duplex
// connector actually measure, and it can say whether a route is legal for the
// cable on it. harness-plugin.js turns those into shapes.
//
// WHERE THE NUMBERS COME FROM, and this is the whole of the honesty here:
//
//   MODELLED to a published standard, named per entry - TIA-568 for the copper
//   pair cables, IEC 60320 for the power cordage, the SFF committee's
//   mechanical drawings for the pluggable optics cages. A cable's OUTSIDE
//   DIAMETER varies between manufacturers within a standard; the figure here
//   is a typical one for a common construction and is labelled as typical.
//
//   The MINIMUM BEND RADIUS is the one number nobody should take from a
//   catalogue's middle: it is quoted as a multiple of the outside diameter and
//   that multiple IS standardised - four times for an unloaded copper patch
//   cable, ten times under load, ten to fifteen for fibre. That multiple is
//   what is stored, and the radius is computed from it, so a cable that is
//   swapped for a fatter one gets a bigger minimum radius rather than keeping
//   the thin one's.
//
//   NOTHING HERE IS A PART NUMBER, and no manufacturer's part file is shipped.
//   Every connector is the envelope its standard defines, which is the thing
//   that decides whether it fits in the space - and a Route will take a bought
//   STEP on its ends instead, exactly as a Fastener does.

/* ------------------------------------------------------------ the cables */

//! bend is a MULTIPLE of the outside diameter, not a radius: that is the form
//! the standards quote it in and the form that stays right when the cable is
//! swapped. od is a typical outside diameter for a common construction.
export const CABLE_TYPES = [
  { key: "cat6a", name: "Cat6A U/FTP", od: 7.1, bend: 4, colour: "#2f6fb5",
    from: "TIA-568.2-D · 4-pair 23 AWG, typical outside diameter",
    carries: "10GBASE-T to 100 m" },
  { key: "cat6", name: "Cat6 U/UTP", od: 5.7, bend: 4, colour: "#4a90d9",
    from: "TIA-568.2-D · 4-pair 23 AWG, typical",
    carries: "1000BASE-T, 10GBASE-T to 55 m" },
  { key: "om4", name: "OM4 duplex fibre", od: 3.0, bend: 10, colour: "#8f5fd0",
    from: "IEC 60793-2-10 A1a.3 · 2 mm duplex zipcord, typical",
    carries: "100GBASE-SR4 to 150 m" },
  { key: "os2", name: "OS2 duplex fibre", od: 3.0, bend: 10, colour: "#f0d000",
    from: "ITU-T G.652.D · 2 mm duplex zipcord, typical",
    carries: "single mode, long reach" },
  { key: "mpo12", name: "OM4 MPO-12 trunk", od: 4.5, bend: 10, colour: "#8f5fd0",
    from: "IEC 61754-7 · 12-fibre round trunk, typical",
    carries: "parallel optics, 12 fibres" },
  { key: "dac", name: "DAC twinax 100G", od: 6.0, bend: 10, colour: "#3a3a3a",
    from: "SFF-8665 / QSFP28 direct attach, typical",
    carries: "100G to 3 m passive" },
  { key: "c13", name: "Power cord C13", od: 8.0, bend: 6, colour: "#1e1e1e",
    from: "IEC 60320 C13 · 3 x 1.0 mm2 H05VV-F, typical",
    carries: "10 A, 250 V" },
  { key: "c19", name: "Power cord C19", od: 11.0, bend: 6, colour: "#1e1e1e",
    from: "IEC 60320 C19 · 3 x 2.5 mm2 H05VV-F, typical",
    carries: "16 A, 250 V" },
  { key: "earth", name: "Earth bond 16 mm2", od: 8.5, bend: 6, colour: "#2f9e44",
    from: "BS 7671 · 16 mm2 green/yellow single core",
    carries: "protective bonding" },
  //! A PIPE IS THE SAME OBJECT. A route with a section swept along it is a
  //! pipe as readily as a cable, and cooling is why a rack has pipes in it.
  { key: "cw22", name: "Chilled water 22 mm", od: 22.0, bend: 3, colour: "#1f9bcf",
    from: "BS EN 1057 · 22 mm copper tube, 0.9 mm wall", wall: 0.9,
    carries: "chilled water" },
  { key: "cw28", name: "Chilled water 28 mm", od: 28.0, bend: 3, colour: "#1f9bcf",
    from: "BS EN 1057 · 28 mm copper tube, 0.9 mm wall", wall: 0.9,
    carries: "chilled water" },
];

export const cableType = key =>
  CABLE_TYPES.find(one => one.key === key) || CABLE_TYPES[0];

//! THE RADIUS A CABLE WILL NOT GO BELOW, computed from its own diameter rather
//! than stored. Under load is the figure that applies to a run that is tied
//! into a tray and staying there, which is every run in a rack.
export function bendRadius(cable, loaded = true) {
  const spec = typeof cable === "string" ? cableType(cable) : cable;
  if (!spec) return 0;
  return spec.od * spec.bend * (loaded ? 1 : 0.5);
}

/* -------------------------------------------------------- the connectors */

//! The ENVELOPE each one occupies, which is what decides whether it fits. w is
//! across the latch, h is the body height, deep is how far it stands off the
//! face it plugs into - the number that says whether a door will shut.
export const CONNECTORS = [
  { key: "none", name: "No connector", w: 0, h: 0, deep: 0, from: "" },
  { key: "rj45", name: "RJ45 plug", w: 11.7, h: 8.0, deep: 30.0,
    from: "IEC 60603-7 / TIA-568 · 8P8C with boot" },
  { key: "lc-duplex", name: "LC duplex", w: 12.8, h: 8.4, deep: 32.0,
    from: "IEC 61754-20 · 1.25 mm ferrule pair with boot" },
  { key: "mpo", name: "MPO-12", w: 12.4, h: 7.0, deep: 34.0,
    from: "IEC 61754-7 · 12-fibre ferrule with boot" },
  { key: "qsfp28", name: "QSFP28", w: 18.35, h: 8.5, deep: 52.0,
    from: "SFF-8665 · QSFP28 pluggable module" },
  { key: "qsfpdd", name: "QSFP-DD", w: 18.35, h: 8.5, deep: 62.0,
    from: "QSFP-DD MSA rev 6 · double-density pluggable" },
  { key: "sfp28", name: "SFP28", w: 13.4, h: 8.5, deep: 45.0,
    from: "SFF-8402 · SFP28 pluggable module" },
  { key: "c14", name: "C14 inlet plug", w: 27.0, h: 19.5, deep: 40.0,
    from: "IEC 60320 C14 · appliance inlet" },
  { key: "c20", name: "C20 inlet plug", w: 30.0, h: 24.0, deep: 46.0,
    from: "IEC 60320 C20 · appliance inlet" },
  { key: "lug", name: "Ring lug M8", w: 20.0, h: 4.0, deep: 30.0,
    from: "DIN 46234 · compression ring terminal" },
];

export const connectorType = key =>
  CONNECTORS.find(one => one.key === key) || CONNECTORS[0];

/* ------------------------------------------------------------- the route

   A RUN OF STRAIGHTS WITH ROUNDED CORNERS. A polyline cannot be swept: at a
   corner the section has nowhere to point, and every sweep builder in every
   kernel either fails or produces a spike. Rounding the corner is not a
   cosmetic step, it is what makes the path a path - and it is also the real
   constraint, because a cable that turns tighter than its bend radius is a
   cable that has been damaged.

   So this takes the corner points somebody clicked and hands back the run as
   straights and arcs. An arc is given as its three points - the two tangent
   points and one on the turn - because that is what a circular arc is built
   from and it keeps this file free of any geometry library.                */

const hnSub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const hnAdd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const hnMul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const hnLen = a => Math.hypot(a[0], a[1], a[2]);
const hnUnit = a => { const l = hnLen(a); return l < 1e-12 ? [0, 0, 0] : hnMul(a, 1 / l); };
const hnDot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

//! The turn at a corner, in radians: 0 is dead straight, PI is doubling back.
export function cornerAngle(before, at, after) {
  const a = hnUnit(hnSub(before, at)), b = hnUnit(hnSub(after, at));
  if (!hnLen(a) || !hnLen(b)) return 0;
  return Math.PI - Math.acos(Math.max(-1, Math.min(1, hnDot(a, b))));
}

//! WHAT A CORNER OF THIS ANGLE COSTS ALONG EACH LEG. The tangent point sits
//! back from the corner by r*tan(turn/2), and a corner needing more than half
//! its shorter leg cannot be rounded at that radius - which is the check that
//! turns "the sweep failed" into "that corner is too tight for this cable".
export const setbackFor = (radius, turn) => radius * Math.tan(turn / 2);

export function roundedRoute(points, radius) {
  const via = (points || []).filter(p => Array.isArray(p) && p.length === 3);
  const out = { segments: [], corners: [], tight: [], length: 0 };
  if (via.length < 2) return out;
  if (!(radius > 0)) {
    for (let i = 0; i < via.length - 1; i++)
      out.segments.push({ kind: "line", from: via[i], to: via[i + 1] });
    out.length = out.segments.reduce((n, s) => n + hnLen(hnSub(s.to, s.from)), 0);
    return out;
  }

  //! WORKED OUT FOR EVERY CORNER FIRST, then assembled - because a corner's
  //! set-back eats into the leg on both sides of it and two tight corners in a
  //! row can overlap. Deciding one corner at a time cannot see that.
  const cut = new Array(via.length).fill(0);
  for (let i = 1; i < via.length - 1; i++) {
    const turn = cornerAngle(via[i - 1], via[i], via[i + 1]);
    //! A corner that is not a corner is left alone: rounding a straight line
    //! puts an arc of no length in the middle of it, which nothing can sweep.
    if (turn < 1e-6 || Math.abs(turn - Math.PI) < 1e-9) continue;
    cut[i] = setbackFor(radius, turn);
  }
  //! AND THEN SHRUNK TO FIT. Where two set-backs overlap along one leg they
  //! are scaled back together, which keeps the corner radius as large as the
  //! geometry allows instead of failing - and what had to be given up is
  //! reported rather than swallowed.
  for (let i = 0; i < via.length - 1; i++) {
    const leg = hnLen(hnSub(via[i + 1], via[i]));
    const want = cut[i] + cut[i + 1];
    if (want > leg && want > 0) {
      const squeeze = leg / want * 0.999;
      if (cut[i]) cut[i] *= squeeze;
      if (cut[i + 1]) cut[i + 1] *= squeeze;
      out.tight.push({ at: i + 1, leg, wanted: want });
    }
  }

  let from = via[0];
  for (let i = 1; i < via.length - 1; i++) {
    const here = via[i];
    if (!cut[i]) continue;
    const back = hnUnit(hnSub(via[i - 1], here)), on = hnUnit(hnSub(via[i + 1], here));
    const start = hnAdd(here, hnMul(back, cut[i]));
    const end = hnAdd(here, hnMul(on, cut[i]));
    //! THE MIDDLE OF THE ARC, which is the third point a circular arc is made
    //! from: out from the corner along the bisector by the sagitta.
    const bisect = hnUnit(hnAdd(back, on));
    const turn = cornerAngle(via[i - 1], here, via[i + 1]);
    const r = cut[i] / Math.tan(turn / 2);
    const middle = hnAdd(here, hnMul(bisect, r / Math.cos(turn / 2) - r));
    if (hnLen(hnSub(start, from)) > 1e-9)
      out.segments.push({ kind: "line", from, to: start });
    out.segments.push({ kind: "arc", from: start, through: middle, to: end, radius: r });
    out.corners.push({ at: i, turn, radius: r, point: here });
    from = end;
  }
  const last = via[via.length - 1];
  if (hnLen(hnSub(last, from)) > 1e-9) out.segments.push({ kind: "line", from, to: last });

  //! THE LENGTH SOMEBODY ORDERS. A straight is its two ends apart; an arc is
  //! r times the angle it turns through, and the angle is recovered from the
  //! chord - 2*asin(chord / 2r) - rather than carried along, so this is right
  //! for any arc in the list and not only for the ones built above.
  out.length = 0;
  for (const s of out.segments) {
    if (s.kind === "line") { out.length += hnLen(hnSub(s.to, s.from)); continue; }
    const chord = hnLen(hnSub(s.to, s.from));
    out.length += 2 * s.radius * Math.asin(Math.min(1, chord / (2 * s.radius)));
  }
  return out;
}

//! WHETHER A ROUTE IS LEGAL FOR THE CABLE ON IT. Reported rather than refused:
//! a run that is 5 mm inside its bend radius is a run somebody needs to know
//! about, and refusing to draw it tells them nothing about where.
export function checkRoute(route, cable, loaded = true) {
  const least = bendRadius(cable, loaded);
  const bad = (route.corners || []).filter(c => c.radius < least - 1e-9);
  return { least, tight: bad,
           ok: bad.length === 0 && (route.tight || []).length === 0,
           squeezed: route.tight || [] };
}
