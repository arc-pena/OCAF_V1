// Cutting the model open, and how the cut is drawn.
//
// A section is not a debugging aid. It is the drawing: a plan is a horizontal
// section at a metre and a half, an elevation is what is left when everything
// in front of the wall is taken away, and the difference between a section
// that reads and one that does not is entirely in how the cut face is drawn.
// So there is a plane you drag, and there is a STYLE - and the style is the
// half that matters.
//
// Four of them, and they are the four an architect already knows:
//
//   open      the cut is hollow. You see inside, and the walls are paper.
//   capped    the cut face is filled. The building reads as solid.
//   poche     filled, and hatched. The oldest convention there is: what the
//             plane passed through is poche, what is beyond it is not.
//   outline   hollow, with the cut edge drawn heavy. The line drawing.
//
// Nothing here knows about three.js or the DOM. Which way a plane faces, where
// its handle sits and how far it may travel are arithmetic; the stencil work
// that fills a cut face is not, and lives where the renderer does.

/* -------------------------------------------------------------- the planes */

//! The three a building is cut on, and the words for them. A plan is a cut on
//! Z; a section through a street is a cut on X or Y; and calling them that
//! rather than "clip plane 1" is the difference between a tool and a control
//! panel.
export const SECTION_AXES = [
  { key: "x", normal: [1, 0, 0], label: "Along X", cut: "looking east" },
  { key: "y", normal: [0, 1, 0], label: "Along Y", cut: "looking north" },
  { key: "z", normal: [0, 0, 1], label: "Level", cut: "a plan" },
];

export const SECTION_STYLES = [
  { key: "open", label: "Open",
    hint: "the cut is hollow - you see inside, and the walls are paper thin",
    caps: false, hatch: false, edge: false },
  { key: "capped", label: "Capped",
    hint: "the cut face is filled, so the building reads as solid",
    caps: true, hatch: false, edge: true },
  { key: "poche", label: "Poché",
    hint: "filled and hatched - what the plane passed through, the way a plan says it",
    caps: true, hatch: true, edge: true },
  { key: "outline", label: "Outline",
    hint: "hollow, with the cut edge drawn heavy - the line drawing",
    caps: false, hatch: false, edge: true },
];

export const styleNamed = key =>
  SECTION_STYLES.find(one => one.key === key) || SECTION_STYLES[0];

/* ------------------------------------------------------------ where it sits

   A CUT IS A PLACE, NOT A FRACTION. "Halfway through" means nothing the moment
   the model grows a wing; "at +3000" is a level somebody can build to. So the
   offset is kept in millimetres and the slider is only a way of reaching it -
   which is also why the slider's ends have to be the model's own extents
   rather than a pair of numbers somebody guessed.                          */

//! How far along a normal the two ends of a box reach. The travel a section
//! plane has, in the model's own units.
export function travelOf(low, high, normal) {
  if (!low || !high) return { from: -1000, to: 1000 };
  let from = 0, to = 0;
  for (let i = 0; i < 3; i++) {
    const a = low[i] * normal[i], b = high[i] * normal[i];
    from += Math.min(a, b);
    to += Math.max(a, b);
  }
  // A hair past either end, so a plane parked at the limit really is clear of
  // the model rather than shaving a face off it.
  const margin = Math.max(1, (to - from) * 0.02);
  return { from: from - margin, to: to + margin };
}

//! Where a plane starts life: the middle of what it is cutting, because a
//! section that opens on nothing looks like a section that does not work.
export const halfway = travel => (travel.from + travel.to) / 2;

//! The plane, as a normal and a constant, the way a renderer wants it.
//!
//! WHICH HALF IS KEPT is not a detail. "Level +1500" means a plan: everything
//! BELOW that height stays and everything above it is taken away, because that
//! is what you are standing in when you read a plan. Kept the other way round
//! it is still a section, but it is a section of the roof, and nobody pressing
//! "Level" meant that. Flipped asks for the other half on purpose.
//!
//! A renderer keeps what satisfies normal.p + constant >= 0, so keeping the
//! low side means pointing the plane's normal DOWN the axis.
export function planeOf(normal, offset, flipped) {
  const way = flipped ? normal : normal.map(v => -v);
  return { normal: way, constant: flipped ? -offset : offset };
}

//! Is a point on the kept side? What a handle uses to decide which way its
//! arrow points, and what a test uses to say the cut is really cutting.
export function keeps(plane, at) {
  return plane.normal[0] * at[0] + plane.normal[1] * at[1] + plane.normal[2] * at[2]
       + plane.constant >= 0;
}

//! Two directions across a plane, for drawing its outline and its handle. Any
//! pair will do as long as they are square to the normal and to each other.
export function acrossOf(normal) {
  const other = Math.abs(normal[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  const u = unit(cross(other, normal)) || [1, 0, 0];
  return [u, unit(cross(normal, u)) || [0, 1, 0]];
}

const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2],
                         a[0] * b[1] - a[1] * b[0]];
const unit = a => {
  const n = Math.hypot(a[0], a[1], a[2]);
  return n > 1e-12 ? [a[0] / n, a[1] / n, a[2] / n] : null;
};

//! One line saying where a cut is, for the bar. A level reads as a level,
//! because that is what people call it on site.
export function saysWhere(axis, offset) {
  const mm = Math.round(offset);
  if (axis === "z") return (mm >= 0 ? "+" : "−") + Math.abs(mm) + " mm";
  return axis.toUpperCase() + " " + mm + " mm";
}

//! Every plane that is switched on, ready for a renderer. Returned in a fixed
//! order so what is drawn does not shuffle when one is turned off.
export function activePlanes(cuts) {
  const out = [];
  for (const axis of SECTION_AXES) {
    const cut = cuts && cuts[axis.key];
    if (!cut || !cut.on) continue;
    out.push({ key: axis.key, ...planeOf(axis.normal, cut.offset, cut.flipped) });
  }
  return out;
}

//! A fresh set of cuts, parked in the middle of the model and all switched
//! off. What "no section" looks like before anybody has asked for one.
export function freshCuts(low, high) {
  const cuts = {};
  for (const axis of SECTION_AXES) {
    const travel = travelOf(low, high, axis.normal);
    cuts[axis.key] = { on: false, flipped: false, offset: halfway(travel), travel };
  }
  return cuts;
}

//! The travel re-measured against a model that has changed size, keeping each
//! plane where it is unless it now sits outside what there is to cut.
export function refit(cuts, low, high) {
  const out = {};
  for (const axis of SECTION_AXES) {
    const travel = travelOf(low, high, axis.normal);
    const was = (cuts && cuts[axis.key]) || {};
    const offset = Number.isFinite(was.offset)
      ? Math.max(travel.from, Math.min(travel.to, was.offset))
      : halfway(travel);
    out[axis.key] = { on: !!was.on, flipped: !!was.flipped, offset, travel };
  }
  return out;
}

/* ------------------------------------------------------- the line of the cut

   WHERE THE PLANE MEETS THE MODEL, exactly: the segments a plane makes through
   a triangle soup. A stencil fills the cut face, which is what makes a section
   read as solid - but a fill has no edge, and the edge is the drawing. This is
   the edge.

   One triangle at a time, which is the whole algorithm: work out which side of
   the plane each corner is on, and where the plane crosses the two edges that
   have a corner on either side. Two crossings, one segment. A triangle wholly
   on one side gives none, and one lying IN the plane gives none either - its
   neighbours already drew the line.                                        */

export function sectionEdges(positions, index, plane, into = []) {
  if (!positions || !index) return into;
  const [nx, ny, nz] = plane.normal;
  const d = plane.constant;
  const side = i => positions[i * 3] * nx + positions[i * 3 + 1] * ny
                  + positions[i * 3 + 2] * nz + d;
  const at = (a, b, t) => [
    positions[a * 3] + (positions[b * 3] - positions[a * 3]) * t,
    positions[a * 3 + 1] + (positions[b * 3 + 1] - positions[a * 3 + 1]) * t,
    positions[a * 3 + 2] + (positions[b * 3 + 2] - positions[a * 3 + 2]) * t];

  for (let i = 0; i + 2 < index.length; i += 3) {
    const c = [index[i], index[i + 1], index[i + 2]];
    const s = c.map(side);
    // Wholly on one side, or lying in the plane: nothing to draw here.
    if ((s[0] > 0 && s[1] > 0 && s[2] > 0) || (s[0] < 0 && s[1] < 0 && s[2] < 0)) continue;
    if (s[0] === 0 && s[1] === 0 && s[2] === 0) continue;
    const hits = [];
    for (let k = 0; k < 3; k++) {
      const a = k, b = (k + 1) % 3;
      if ((s[a] > 0) === (s[b] > 0)) continue;
      const span = s[a] - s[b];
      if (Math.abs(span) < 1e-12) continue;
      hits.push(at(c[a], c[b], s[a] / span));
    }
    if (hits.length !== 2) continue;
    into.push(hits[0][0], hits[0][1], hits[0][2], hits[1][0], hits[1][1], hits[1][2]);
  }
  return into;
}

//! How long the cut line is, all told. A number worth having: a section that
//! reads as empty because the plane is past the end of the model says so as a
//! zero rather than as a blank screen nobody can explain.
export function cutLength(flat) {
  let total = 0;
  for (let i = 0; i + 5 < flat.length; i += 6)
    total += Math.hypot(flat[i + 3] - flat[i], flat[i + 4] - flat[i + 1],
                        flat[i + 5] - flat[i + 2]);
  return total;
}
