// The Atrium package: a retail atrium, built the way one is drawn.
//
// WHAT IT IS FOR, and why it is a package rather than six more nodes in the
// catalogue. Look at a photograph of a mall atrium and almost nothing in it is
// a curved surface. The floor plates are FLAT - one level, one thickness - and
// what sweeps is their EDGE. The band you read from across the void is a
// section run along a plan curve; the balustrade on top of it is a second
// section on the same curve; the shopfront behind it is a third, and the soffit
// over it is the underside of the next flat plate. Draw the curve once and the
// whole storey follows.
//
// So every node in here takes a RAIL and a set of dimensions, and sweeps. The
// only node that does anything else is the roof, which is the one genuinely
// doubly-curved thing in the building and is a network rather than a surface.
//
// WHAT IS COMPUTED AND WHAT IS A CHOICE. The void's plan is a parabola because
// that is what it was specified as. The roof's cells are a Voronoi tessellation,
// computed exactly - each cell is its region clipped by one half-plane per other
// seed - and relaxed by Lloyd's algorithm a stated number of times. The dome is
// a paraboloid, so its height and its normal are differentiated rather than
// sampled. Everything else - how deep a floor zone is, how far back a
// balustrade stands, what a cushion is inflated to - is a DIMENSION somebody
// sets, and this package does arithmetic with it and does not invent it.
//
// NO MANUFACTURER'S ANYTHING. There is no glass, no extrusion, no ETFE foil and
// no structural section in here with a product name on it, because none was
// given to this repository. The sizes are the ones on the feature.

import { ARG } from "./ocaf.js";
import { offerPlugin } from "./plugin.js";
import { balustradeSections, cushionRings, insetConvex, loopArea, loopCentroid,
         mullionStations, netEdges, netNodes, offsetLoop, parabolicSide,
         parabolicVoid, roofCells, roofDome, shopfrontSections, signedLoopArea,
         slabEdgeSection } from "./atrium.js";

/* ------------------------------------------------------------- the nodes */

//! Every swept node takes the same two: the rail it runs on, and which side of
//! it the section stands. Written once because the alternative is six copies
//! that drift, and because "which side" is the single argument somebody
//! actually reaches for when a band comes out facing into the floor plate.
const RAIL_ARGS = [
  ARG.ref("rail", "Rail", ["curve"], true),
  ARG.choice("side", "Section stands", ["Towards the void", "Away from it"], 0),
];

export const ATRIUM_NODES = [
  { type: "AtriumVoid", guid: "9a1b2c30-0130-4c00-9e00-caf000000130", category: "curve",
    produces: "curve",
    summary: "The hole in the floor plate, in plan - and therefore the sketch the whole "
           + "storey is swept from. Both long sides are PARABOLAS facing away from each "
           + "other, meeting at a blunt nose at either end: one number opens it in the "
           + "middle, one holds the ends apart, and Fullness says how fast it fills out "
           + "- 2 is the parabola, 1 is a straight taper, higher runs the sides straight "
           + "for longer. Put one on each level and give them different widths and the "
           + "galleries step over each other, which is the whole move.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.real("length", "Length", 90000, 1000, 400000, 500),
           ARG.real("wide", "Half width at mid", 12000, 200, 100000, 100),
           ARG.real("ends", "Half width at ends", 5000, 100, 100000, 100),
           ARG.real("fullness", "Fullness", 2, 1, 6, 0.1, ""),
           ARG.real("stations", "Stations a side", 24, 4, 200, 1, ""),
           ARG.real("nose", "Nose", 0.6, 0, 3, 0.05, ""),
           //! APPENDED, as every new argument is: an argument's place in this
           //! list is its tag on disk, so one inserted anywhere but the end
           //! makes every saved void read its nose as its fullness.
           ARG.choice("run", "Run", ["Closed loop", "One side", "The other side"], 0),
           //! THE RAIL EVERY OTHER SWEEP ON THIS LEVEL RUNS ON. The balustrade
           //! stands back a little from the void, the shopfront a corridor, the
           //! facade over the shops the same again - so a set-back void is not
           //! a convenience, it is how a plan is laid out. Offset in arithmetic
           //! rather than with a parallel curve: see offsetLoop in atrium.js
           //! for the 782-metre sweep that settled that.
           ARG.real("offset", "Set back", 0, -50000, 50000, 50)] },

  { type: "SlabEdge", guid: "9a1b2c30-0131-4c00-9e00-caf000000131", category: "body",
    produces: "solid",
    summary: "The band you see from across the void: a floor zone swept along the "
           + "gallery's own plan curve, clad to the edge of slab and turned under in a "
           + "SHARP CHAMFER rather than a radius - which is what gives the band its hard "
           + "shadow line along the bottom and is the detail that reads from thirty "
           + "metres. Depth is the structural zone, Back is how far in the section "
           + "reaches, and the flat plate behind it is a Gallery floor on the same rail.",
    args: [...RAIL_ARGS,
           ARG.real("depth", "Floor zone", 1500, 100, 6000, 25),
           ARG.real("bevel", "Chamfer", 350, 0, 3000, 10),
           ARG.real("back", "Reaches back", 2500, 200, 20000, 50),
           ARG.real("upstand", "Upstand", 0, 0, 2000, 10),
           ARG.text("supplier", "Specification", "", "your own cladding reference")] },

  { type: "GalleryFloor", guid: "9a1b2c30-0132-4c00-9e00-caf000000132", category: "body",
    produces: "solid",
    summary: "The flat plate behind the edge band - the bit people walk on. It is a "
           + "ring: the void is the hole, Reaches back is where the swept edge stops and "
           + "this starts, and Width is how far the gallery goes before the shopfront. "
           + "Give it an outer boundary instead and it fills to that, which is what a "
           + "real floor plate does at the building line.",
    args: [ARG.ref("rail", "Void", ["curve"], true),
           ARG.spare("outer", "Outer boundary", ["curve"]),
           ARG.real("inset", "Reaches back", 2500, 0, 20000, 50),
           ARG.real("width", "Width", 9000, 500, 100000, 100),
           ARG.real("depth", "Floor zone", 1500, 50, 6000, 25)] },

  { type: "Balustrade", guid: "9a1b2c30-0133-4c00-9e00-caf000000133", category: "body",
    produces: "solid",
    summary: "Frameless structural glass in a shoe with a capping rail along the top of "
           + "it, swept along a rail. Three separate bodies, because they are three "
           + "materials and a balustrade drawn as one solid is a balustrade you cannot "
           + "see through - which is the entire point of a glass one. Posts turns it "
           + "into the other kind, uprights at a pitch with the glass between them.",
    args: [...RAIL_ARGS,
           ARG.real("height", "Height", 1100, 300, 3000, 25),
           ARG.real("setback", "Set back", 120, 0, 3000, 10),
           ARG.real("glass", "Glass", 21, 6, 100, 1),
           ARG.real("railWidth", "Capping rail", 90, 20, 400, 5),
           ARG.real("railDepth", "Rail depth", 55, 10, 300, 5),
           ARG.real("shoe", "Shoe", 180, 0, 600, 10),
           ARG.real("shoeHeight", "Shoe height", 150, 0, 1000, 10),
           ARG.choice("posts", "Posts", ["None - frameless", "At a pitch"], 0),
           ARG.when(ARG.real("pitch", "Post pitch", 1500, 200, 6000, 50), "posts", 1),
           ARG.when(ARG.real("post", "Post", 60, 20, 400, 5), "posts", 1),
           ARG.text("supplier", "Specification", "", "your own balustrade reference")] },

  { type: "Shopfront", guid: "9a1b2c30-0134-4c00-9e00-caf000000134", category: "body",
    produces: "solid",
    summary: "A glazed wall on a curve: glass between mullions set out in EQUAL BAYS, a "
           + "signage band across the head and a sill under it. The retail frontage "
           + "behind a gallery, and - with no gallery in front of it and the band turned "
           + "off - the flush facade of whatever sits above the shops. The bays are "
           + "equal because a facade set out at a fixed pitch from one end leaves a stub "
           + "bay at the other, which is the one thing a facade contractor will not take.",
    args: [...RAIL_ARGS,
           ARG.real("height", "Height", 4200, 500, 40000, 50),
           ARG.real("pitch", "Mullion pitch", 1500, 200, 12000, 25),
           ARG.real("mullion", "Mullion", 90, 20, 600, 5),
           ARG.real("depth", "Mullion depth", 180, 30, 1200, 10),
           ARG.real("glass", "Glass", 32, 6, 120, 1),
           ARG.real("band", "Signage band", 700, 0, 4000, 25),
           ARG.real("sill", "Sill", 0, 0, 4000, 25),
           ARG.text("supplier", "Specification", "", "your own facade reference"),
           //! WHICH HALF OF IT TO BUILD. Glass and frame are two materials and
           //! want two finishes, so a facade is usually two features on one
           //! rail - and the one that is only the frame must not also sweep a
           //! pane of glass a millimetre thick 260 m round an atrium, which is
           //! what asking for it by setting the glass thin did: "memory access
           //! out of bounds", from inside the kernel, on two of the six.
           ARG.choice("parts", "Build",
                      ["Glass and frame", "Glass only", "Frame only"], 0)] },

  { type: "RoofNet", guid: "9a1b2c30-0135-4c00-9e00-caf000000135", category: "body",
    produces: "solid",
    summary: "The roof over the void: a network of thick walkable structural members on "
           + "a shallow paraboloid, with an inflated ETFE cushion in every cell the "
           + "network leaves. The pattern is a VORONOI tessellation of a relaxed scatter "
           + "- computed, not drawn - which is what gives it cells of even area and "
           + "uneven shape. A hexagonal grid reads as a grid; this reads as grown. Seed "
           + "picks which scatter, and the same seed is the same roof every time. Build "
           + "the structure and the cushions as two features on the same numbers and "
           + "they take two finishes.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.real("length", "Length", 90000, 1000, 400000, 500),
           ARG.real("width", "Width", 30000, 1000, 400000, 500),
           ARG.real("rise", "Rise", 9000, 100, 100000, 100),
           ARG.real("cells", "Cells", 70, 4, 400, 1, ""),
           ARG.real("seed", "Seed", 7, 1, 9999, 1, ""),
           ARG.real("relax", "Relax", 2, 0, 12, 1, ""),
           ARG.real("member", "Member width", 900, 100, 6000, 25),
           ARG.real("deep", "Member depth", 1800, 100, 8000, 25),
           ARG.real("cushion", "Cushion rise", 900, 0, 6000, 25),
           ARG.real("drop", "Cushion drop", 650, 0, 6000, 25),
           ARG.choice("parts", "Build",
                      ["Structure and cushions", "Structure only", "Cushions only"], 0),
           ARG.text("supplier", "Specification", "", "your own reference")] },

  { type: "FlaredColumn", guid: "9a1b2c30-0136-4c00-9e00-caf000000136", category: "body",
    produces: "solid",
    summary: "A column that opens out into a capital as it meets the soffit - the one "
           + "at the bottom of every atrium photograph. A profile turned about its own "
           + "axis, so the flare is a curve you set rather than a cone: Flare says how "
           + "much of the height it takes to open out, and Sharpness whether it leaves "
           + "the shaft early and lazily or late and hard.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.real("height", "Height", 6000, 300, 40000, 50),
           ARG.real("shaft", "Shaft diameter", 900, 50, 8000, 25),
           ARG.real("head", "Head diameter", 3600, 50, 20000, 50),
           ARG.real("foot", "Foot diameter", 1200, 50, 8000, 25),
           ARG.real("flare", "Flare", 0.55, 0.05, 1, 0.01, ""),
           ARG.real("sharpness", "Sharpness", 2.6, 1, 8, 0.1, ""),
           ARG.real("steps", "Steps", 16, 3, 80, 1, "")] },
];

/* ----------------------------------------------------------- the drivers */

function atriumDrivers(kit) {
  const K = kit.toolkit();
  const { F: KF, hybrid: H, shape: S } = K;
  const UP = [0, 0, 1];

  const vec = {
    add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2],
                      a[0] * b[1] - a[1] * b[0]],
    unit: a => {
      const n = Math.hypot(a[0], a[1], a[2]);
      return n > 1e-12 ? [a[0] / n, a[1] / n, a[2] / n] : [0, 0, 0];
    },
  };

  //! Where a node sits, as the rest of this program places things: a plane for
  //! the orientation and an optional point that overrides its origin.
  const frameOf = f => {
    const plane = KF.reference(f, "plane");
    const ax = plane ? K.planeAxis(plane) : null;
    let origin = [0, 0, 0], x = [1, 0, 0], z = [0, 0, 1];
    if (ax) {
      const at = ax.Location(), dir = ax.Direction(), along = ax.XDirection();
      origin = [at.X(), at.Y(), at.Z()];
      z = [dir.X(), dir.Y(), dir.Z()];
      x = [along.X(), along.Y(), along.Z()];
    }
    const put = K.readPoint(KF.reference(f, "at"));
    if (put) origin = put;
    return { origin, x, z, y: vec.cross(z, x) };
  };

  const railOf = (f, key = "rail") => {
    const source = KF.reference(f, key);
    if (!source) return null;
    const shape = KF.shape(source);
    return shape ? K.wireFrom(shape) : null;
  };

  /* ------------------------------------------------- a section on a plan curve

     NOTHING IN HERE IS PIPED ALONG A RAIL, and that is the measurement this
     package turns on rather than a preference.

     Every section in an atrium is swept along a HORIZONTAL plan curve, so every
     one of them is a plan ring given a height - a prism - except the slab edge,
     whose section steps in at the bottom, which is a stack of plan rings lofted.
     Both can be built with a fill and a pad, which are the two most reliable
     calls in the kernel.

     Piping the section along the rail instead is the obvious road and it does
     not hold up. Measured, on this void, sweeping a 1.5 m and a 4.5 m section
     along a fitted spline at three station counts and three set-backs - nine
     rails whose maximum drift from their own control points ran from 265 mm
     down to 22 mm:

       stations  set back   drift   1.5 m section   4.5 m section
             30         0   265mm   96 x 23 m  ok   96 x 23 m  ok
             30      2600   240mm   208 x 177 m     208 x 177 m
             30     11600   247mm   119 x 46 m      416 x 818 m
             60         0    93mm   113 x 272 m     113 x 272 m
             60      2600    67mm   101 x 28 m ok   101 x 28 m ok
             60     11600    93mm   119 x 46 m ok   119 x 46 m ok
            120         0    32mm   3734 x 2653 m   3734 x 2653 m
            120      2600    22mm   106 x 28 m ok   106 x 28 m ok
            120     11600    28mm   164 x 93 m      164 x 93 m

     Four of nine right. The failures do not track the drift - the rail that fits
     its points to 265 mm sweeps correctly and the one that fits to 32 mm sweeps
     into a shape three and a half KILOMETRES across - and they do not track the
     station count or the set-back either. A construction whose correctness is
     that unrelated to anything one can measure about its input is not a
     construction, it is a coin toss, and the same nine rails as POLYLINES came
     out right nine times out of nine.

     So the rail is read as a plan loop, offset in arithmetic, and extruded. */

  //! A rail read as an evenly spaced plan loop, with the height it sits at.
  //! Sampled rather than asked for, so anything that produces a curve can be
  //! wired in - a void, a sketch, an imported line - and not only this package's
  //! own node.
  const planOf = (wire, want = 1200) => {
    const curve = K.sampleCurve(wire, 1200);
    const ends = curve.at(0), far = curve.at(1);
    const closed = Math.hypot(far[0] - ends[0], far[1] - ends[1], far[2] - ends[2]) < 1;
    const n = Math.max(40, Math.min(360, Math.round(curve.total / Math.max(200, want))));
    const pts = [];
    const count = closed ? n : n + 1;
    for (let i = 0; i < count; i++)
      pts.push(curve.at(curve.byLength(i / (closed ? n : n))));
    const z = pts.reduce((sum, p) => sum + p[2], 0) / pts.length;
    const rise = Math.max(...pts.map(p => p[2])) - Math.min(...pts.map(p => p[2]));
    return { loop: pts.map(p => [p[0], p[1]]), z, rise, closed, curve,
             total: curve.total };
  };

  //! The plan loop offset outward by a distance, as a closed wire at a height.
  //!
  //! AND AS A POLYLINE, NOT A FITTED CURVE. Measured, building the same two
  //! things from the same points both ways - the ring filled and padded, and
  //! three rings lofted:
  //!
  //!     points   polyline            B-spline
  //!         80   0.08 s / 0.12 s     11.24 s /  17.00 s
  //!        140   0.03 s / 0.12 s     49.13 s /  69.42 s
  //!        240   0.06 s / 0.24 s    148.00 s / 215.09 s
  //!
  //! Both answers agree to about 20 mm. The fit costs between a hundred and two
  //! and a half thousand times as much, and it gets worse the finer the curve -
  //! so the better the rail, the longer the storey takes. At a point every 1.2 m
  //! the facets are 22 mm off the true arc round the sharpest thing in the plan,
  //! which is the nose, and nothing measurable anywhere else.
  const ringAt = (plan, across, z) => {
    const base = Math.abs(across) > 1e-9
      ? offsetLoop(plan.loop, across, plan.closed) : plan.loop;
    return H.polyline(base.map(([x, y]) => [x, y, z]), plan.closed);
  };

  //! AND FOR AN OPEN RUN, THE RIBBON ITSELF. An open rail bounds no face, so the
  //! two sides of the section are joined at the ends into one closed loop -
  //! which is what a length of facade is in plan.
  const ribbonAt = (plan, inner, outer, z) => {
    const a = offsetLoop(plan.loop, outer, false);
    const b = offsetLoop(plan.loop, inner, false);
    return H.polyline([...a, ...b.slice().reverse()].map(([x, y]) => [x, y, z]), true);
  };

  //! A PRISM: the ring between two across values, from one height to another.
  const prismSolid = (plan, part) => {
    const [a0, a1] = part.across;
    const base = plan.z + part.from, high = part.to - part.from;
    if (!(high > 1e-6)) return null;
    const face = plan.closed
      ? H.fillWithHoles(ringAt(plan, a1, base), [ringAt(plan, a0, base)])
      : H.fill(ribbonAt(plan, a0, a1, base));
    return S.pad(face, [0, 0, high]);
  };

  //! A TAPER: the same ring where the across values change with height, as the
  //! slab edge's does when it chamfers back at the bottom.
  //!
  //! BUILT A LEVEL AT A TIME, so the boolean is the size of the chamfer and not
  //! the size of the building. A ring is two closed loops and a loft wants one,
  //! so a tapered ring is the plug of everything inside its back face less the
  //! plug of everything inside its front - and done in one piece over the whole
  //! 1.5 m that is two plugs the width of the atrium subtracted from each other,
  //! which measured at 180 seconds. Split at every level where the section
  //! changes, the straight 1.15 m is a plain prism with no boolean at all and
  //! only the 350 mm chamfer costs one.
  const taperSolid = (plan, section) => {
    const levels = section.face.map((p, i) =>
      ({ u: p[1], a0: p[0], a1: section.back[i][0] }));
    levels.sort((one, two) => one.u - two.u);
    const pieces = [];
    for (let i = 0; i + 1 < levels.length; i++) {
      const low = levels[i], high = levels[i + 1];
      if (high.u - low.u < 1e-6) continue;
      if (Math.abs(low.a0 - high.a0) < 1e-9 && Math.abs(low.a1 - high.a1) < 1e-9) {
        pieces.push(prismSolid(plan, { across: [low.a0, low.a1],
                                       from: low.u, to: high.u }));
        continue;
      }
      const plug = pick => S.loft([
        plan.closed ? ringAt(plan, low[pick], plan.z + low.u)
                    : ribbonAt(plan, low.a0 - 1e5, low[pick], plan.z + low.u),
        plan.closed ? ringAt(plan, high[pick], plan.z + high.u)
                    : ribbonAt(plan, high.a0 - 1e5, high[pick], plan.z + high.u)], true);
      pieces.push(S.remove(plug("a1"), plug("a0")));
    }
    const made = pieces.filter(Boolean);
    return made.length === 1 ? made[0] : K.compoundOf(made);
  };

  //! AN UPRIGHT AT A STATION ALONG THE RAIL, square to it: a post, a mullion.
  //! Built from the rail's own direction there rather than from the world's,
  //! which on a curve is the whole difference between a facade and a row of
  //! fence posts.
  const stationBox = (plan, u, across, wide, high, deep, from = 0) => {
    if (!(high > 1e-6)) return null;
    const at = plan.curve.at(u);
    const t = plan.curve.tangent(u);
    const run = Math.hypot(t[0], t[1]);
    if (!(run > 1e-9)) return null;
    const way = [t[0] / run, t[1] / run, 0];
    //! The outward normal of the plan at this station, which is the direction
    //! `across` is measured in - the left of travel for a loop drawn one way
    //! and the right for the other, so it is taken from the loop's own winding.
    const sign = plan.closed && signedLoopArea(plan.loop) >= 0 ? -1 : 1;
    const out = [sign * -way[1], sign * way[0], 0];
    const base = [at[0] + out[0] * across - way[0] * deep / 2,
                  at[1] + out[1] * across - way[1] * deep / 2,
                  plan.z + from];
    const corner = (a, b) => [base[0] + out[0] * a + way[0] * b,
                              base[1] + out[1] * a + way[1] * b, base[2]];
    const face = H.fill(H.polyline([corner(-wide / 2, 0), corner(wide / 2, 0),
                                    corner(wide / 2, deep), corner(-wide / 2, deep)],
                                   true));
    return S.pad(face, [0, 0, high]);
  };

  const finishNote = f => {
    const said = String(KF.code(f, "supplier", "") || "").trim();
    return said ? [said] : [];
  };

  return {

    /* ------------------------------------------------- the plan sketch */

    AtriumVoid: {
      precondition: f => {
        if (KF.real(f, "length", 90000) <= 0) return "a void needs a length";
        if (KF.real(f, "wide", 12000) <= 0) return "a void needs a width";
        return null;
      },
      build: f => {
        const frame = frameOf(f);
        const length = KF.real(f, "length", 90000);
        const wide = KF.real(f, "wide", 12000);
        const ends = Math.min(KF.real(f, "ends", 5000), wide);
        const fullness = KF.real(f, "fullness", 2);
        const stations = KF.real(f, "stations", 24);
        const run = K.F.choice(f, "run", 0);
        const back = KF.real(f, "offset", 0);
        const drawn = run === 0
          ? parabolicVoid({ length, wide, ends, fullness, stations,
                            nose: KF.real(f, "nose", 0.6) })
          : parabolicSide({ length, wide, ends, fullness, stations,
                            side: run === 1 ? 1 : -1 });
        const loop = Math.abs(back) > 1e-9
          ? offsetLoop(drawn, back, run === 0) : drawn;
        //! Laid out in the node's own frame, so a void on a plane at z = 12000
        //! is at the walking level of the gallery it belongs to and everything
        //! swept along it lands there too.
        const pts = loop.map(([a, b]) => vec.add(frame.origin,
          vec.add(vec.mul(frame.x, a), vec.mul(frame.y, b))));
        //! THROUGH THE POINTS RATHER THAN NEAR THEM, and closed only when the
        //! run is a loop. The balustrade, the floor plate and the shopfront are
        //! all set-back copies of this one curve, so a curve that misses its own
        //! control points misses them by a different amount at every station.
        const wire = H.spline(pts, run === 0, 16);
        const said = ["Atrium void · " + Math.round(length) + " long, "
                        + Math.round(wide * 2) + " across the middle",
                      Math.round(ends * 2) + " across the ends · parabolic sides at "
                        + fullness.toFixed(1),
                      run === 0 ? (loopArea(loop) / 1e6).toFixed(0)
                                  + " m² of hole in the plate"
                                : "one side only, as an open run - a facade with no "
                                  + "corridor in front of it stops where that side "
                                  + "stops, and an offset of a loop is still a loop",
                      ...(Math.abs(back) > 1e-9
                        ? ["set back " + Math.round(back) + " · mitred along each "
                           + "point's own bisector, so the perpendicular distance "
                           + "holds round the noses, where widening the parabola "
                           + "instead would be 4.9 m out"] : [])];
        return { shape: wire, data: K.text(said) };
      },
    },

    /* ------------------------------------------------ the swept edge band */

    SlabEdge: {
      precondition: f => (KF.reference(f, "rail") ? null : "a slab edge needs a rail"),
      build: f => {
        const wire = railOf(f);
        if (!wire) throw new Error("that rail has no curve on it");
        const plan = planOf(wire);
        const depth = KF.real(f, "depth", 1500);
        const bevel = KF.real(f, "bevel", 350);
        const back = KF.real(f, "back", 2500);
        const section = slabEdgeSection({ depth, bevel, back,
                                          upstand: KF.real(f, "upstand", 0) });
        const body = taperSolid(plan, section);
        if (!body) throw new Error("that section will not close");
        const said = ["Slab edge · " + Math.round(depth) + " floor zone, "
                        + Math.round(section.bevel) + " chamfer",
                      "reaches " + Math.round(section.reach) + " back · "
                        + Math.round(plan.total) + " of edge at level "
                        + Math.round(plan.z),
                      //! SAID OUT LOUD, because it is the brief: the cladding
                      //! runs to the edge of slab and turns under on a CHAMFER,
                      //! not on a radius, and the two look nothing alike in a
                      //! raking light - a chamfer leaves a line along the bottom
                      //! of the band and that line is what you read it by.
                      "a chamfer and not a radius: the band's bottom edge is a "
                        + "line, which is what casts the shadow you see it by",
                      ...finishNote(f)];
        return { shape: body, data: K.text(said) };
      },
    },

    /* --------------------------------------------------- the flat plate */

    GalleryFloor: {
      precondition: f => (KF.reference(f, "rail") ? null : "a floor needs a void to go round"),
      build: f => {
        const wire = railOf(f);
        if (!wire) throw new Error("that void has no curve on it");
        const inset = KF.real(f, "inset", 2500);
        const width = KF.real(f, "width", 9000);
        const depth = KF.real(f, "depth", 1500);
        //! GROWING A CLOSED LOOP IS A POSITIVE DISTANCE, whichever way round it
        //! was drawn. parallelCurve settles that itself, and the winding - which
        //! this used to apply here as a sign - belongs only to which side a
        //! SECTION stands on. Offset by a signed distance instead and a
        //! clockwise void was asked to shrink by 11.5 m, which it refused,
        //! correctly and by name: the inside of a turn along it was nearer than
        //! that, so the offset would have crossed itself.
        //! parallelCurve HANDS BACK AN ANSWER, NOT A SHAPE. It tries both sides,
        //! measures which one landed where the sign said, and returns the shape
        //! it kept together with a note saying how many runs there were and how
        //! the corners were turned - so what comes out is { shape, note } and
        //! the shape is inside it. Passed on whole it reaches the kernel as a
        //! plain object, and the error names the type it could not convert
        //! rather than the field that was missing: "Cannot pass [object Object]
        //! as a TopoDS_Face", and then "shape.ShapeType is not a function".
        //! Through wireFrom afterwards because the shape may be a compound of
        //! runs even when there was only ever one loop.
        const offset = (from, by) => {
          const got = H.parallelCurve(from, by);
          return K.wireFrom(got && got.shape ? got.shape : got);
        };
        const inner = inset > 1 ? offset(wire, inset) : wire;
        const outerRef = KF.reference(f, "outer");
        const outer = outerRef && KF.shape(outerRef)
          ? K.wireFrom(KF.shape(outerRef))
          : offset(wire, inset + width);
        //! A plate is a face WITH A HOLE IN IT, which is one call and not a
        //! boolean: filled as two faces and subtracted, a 90 m plate costs a
        //! second and comes back with the seam down the middle that every
        //! boolean on a swept ring leaves.
        const face = H.fillWithHoles(outer, [inner]);
        const body = S.pad(face, [0, 0, -Math.abs(depth)]);
        const said = ["Gallery floor · " + Math.round(width) + " wide, "
                        + Math.round(depth) + " floor zone",
                      "from " + Math.round(inset) + " behind the edge band"
                        + (outerRef ? " out to its own boundary" : " out to the offset"),
                      "the plate is flat: everything curved about this storey is "
                        + "in the EDGE, which is a sketch and a section"];
        return { shape: body, data: K.text(said) };
      },
    },

    /* ---------------------------------------------------- the balustrade */

    Balustrade: {
      precondition: f => (KF.reference(f, "rail") ? null : "a balustrade needs a rail"),
      build: f => {
        const wire = railOf(f);
        if (!wire) throw new Error("that rail has no curve on it");
        const plan = planOf(wire);
        const flip = K.F.choice(f, "side", 0) === 1 ? -1 : 1;
        const spec = {
          height: KF.real(f, "height", 1100), glass: KF.real(f, "glass", 21),
          setback: KF.real(f, "setback", 120), railWidth: KF.real(f, "railWidth", 90),
          railDepth: KF.real(f, "railDepth", 55), shoe: KF.real(f, "shoe", 180),
          shoeHeight: KF.real(f, "shoeHeight", 150),
        };
        const cut = balustradeSections(spec);
        const hand = part => part && ({ ...part,
          across: flip > 0 ? part.across : [-part.across[1], -part.across[0]] });
        const parts = [prismSolid(plan, hand(cut.glass)),
                       prismSolid(plan, hand(cut.rail))];
        if (cut.shoe) parts.push(prismSolid(plan, hand(cut.shoe)));
        //! AND THE OTHER KIND OF BALUSTRADE. Uprights at a pitch, set out so the
        //! bays are equal - the same rule as a shopfront's mullions, and for the
        //! same reason.
        const posted = K.F.choice(f, "posts", 0) === 1;
        let uprights = 0;
        if (posted) {
          const wide = KF.real(f, "post", 60);
          const set = mullionStations(plan.total, KF.real(f, "pitch", 1500));
          for (const station of set.at) {
            const u = Math.min(1, station / Math.max(1, plan.total));
            const box = stationBox(plan, u, flip * spec.setback, wide, spec.height, wide);
            if (box) { parts.push(box); uprights++; }
          }
        }
        const said = ["Balustrade · " + Math.round(spec.height) + " high, "
                        + Math.round(spec.glass) + " glass",
                      "set back " + Math.round(spec.setback) + " · "
                        + Math.round(plan.total) + " of rail"
                        + (posted ? " · " + uprights + " posts" : " · frameless"),
                      "glass, capping rail and shoe as three bodies, because they "
                        + "are three materials and only one of them is meant to be "
                        + "seen through",
                      ...finishNote(f)];
        return { shape: K.compoundOf(parts.filter(Boolean)), data: K.text(said) };
      },
    },

    /* ----------------------------------------------------- the shopfront */

    Shopfront: {
      precondition: f => (KF.reference(f, "rail") ? null : "a shopfront needs a rail"),
      build: f => {
        const wire = railOf(f);
        if (!wire) throw new Error("that rail has no curve on it");
        const plan = planOf(wire);
        const flip = K.F.choice(f, "side", 0) === 1 ? -1 : 1;
        const spec = {
          height: KF.real(f, "height", 4200), glass: KF.real(f, "glass", 32),
          mullion: KF.real(f, "mullion", 90), depth: KF.real(f, "depth", 180),
          band: KF.real(f, "band", 700), sill: KF.real(f, "sill", 0),
        };
        const cut = shopfrontSections(spec);
        const want = K.F.choice(f, "parts", 0);
        const hand = part => part && ({ ...part,
          across: flip > 0 ? part.across : [-part.across[1], -part.across[0]] });
        const parts = [];
        if (want !== 2) parts.push(prismSolid(plan, hand(cut.glass)));
        if (want !== 1) {
          if (cut.band) parts.push(prismSolid(plan, hand(cut.band)));
          if (cut.sill) parts.push(prismSolid(plan, hand(cut.sill)));
        }
        //! THE MULLIONS, in equal bays. Each one is square to the glass at its
        //! own station rather than to the world, which on a curve is the whole
        //! difference between a facade and a row of fence posts.
        const set = mullionStations(plan.total, KF.real(f, "pitch", 1500));
        for (const station of want === 1 ? [] : set.at) {
          const u = Math.min(1, station / Math.max(1, plan.total));
          const box = stationBox(plan, u, 0, cut.mullion.half * 2,
                                 cut.mullion.to - cut.mullion.from,
                                 cut.mullion.depth, cut.mullion.from);
          if (box) parts.push(box);
        }
        const said = ["Shopfront · " + Math.round(spec.height) + " high · "
                        + ["glass and frame", "glass only", "frame only"][want]
                        + " · " + set.bays + " bays of " + Math.round(set.step),
                      Math.round(plan.total) + " of frontage"
                        + (spec.band > 0 ? " · " + Math.round(spec.band) + " signage band"
                                         : " · no band - a flush facade"),
                      "equal bays, because a facade set out at a fixed pitch from "
                        + "one end leaves a stub bay at the other",
                      ...finishNote(f)];
        return { shape: K.compoundOf(parts.filter(Boolean)), data: K.text(said) };
      },
    },

    /* ------------------------------------------------------- the roof */

    RoofNet: {
      precondition: f => {
        if (KF.real(f, "member", 900) <= 0) return "a member needs a width";
        if (KF.real(f, "rise", 9000) <= 0) return "a dome needs a rise";
        return null;
      },
      build: f => {
        const frame = frameOf(f);
        const length = KF.real(f, "length", 90000);
        const width = KF.real(f, "width", 30000);
        const rise = KF.real(f, "rise", 9000);
        const member = KF.real(f, "member", 900);
        const deep = KF.real(f, "deep", 1800);
        const parts = K.F.choice(f, "parts", 0);
        const dome = roofDome({ length, width, rise });
        //! ONE CALL FOR THE CELLS, so the structure and the cushions cannot
        //! disagree about where a cell is. Built as two features on the same
        //! numbers they are the same tessellation; built from two generators
        //! they are two roofs in the same place.
        const cells = roofCells({ length, width, count: KF.real(f, "cells", 70),
                                  seed: Math.round(KF.real(f, "seed", 7)),
                                  relax: Math.round(KF.real(f, "relax", 2)) });
        const put = (x, y, lift = 0) => vec.add(frame.origin,
          vec.add(vec.mul(frame.x, x),
                  vec.add(vec.mul(frame.y, y), vec.mul(frame.z, dome.lift(x, y) + lift))));
        const normalAt = (x, y) => {
          const n = dome.normal(x, y);
          return vec.unit(vec.add(vec.mul(frame.x, n[0]),
            vec.add(vec.mul(frame.y, n[1]), vec.mul(frame.z, n[2]))));
        };

        const built = [];
        let members = 0, nodes = 0, cushions = 0, skipped = 0;
        if (parts !== 2) {
          //! A MEMBER PER WALL, AND EACH WALL ONCE. Two cells share a wall, so a
          //! net built cell by cell builds the whole roof twice: twice the
          //! steel, twice the triangles, and two faces in the same place for the
          //! renderer to fight over.
          for (const [a, b] of netEdges(cells, 1)) {
            const pa = put(a[0], a[1]), pb = put(b[0], b[1]);
            const along = vec.sub(pb, pa);
            const run = Math.hypot(along[0], along[1], along[2]);
            if (run < member * 0.6) { skipped++; continue; }
            const way = vec.mul(along, 1 / run);
            //! The member's own up is the roof's normal at its middle, so a
            //! walkable top really is the top as you stand on it.
            const up = normalAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
            const side = vec.unit(vec.cross(way, up));
            //! Drawn with its top on the surface and its depth hung below:
            //! structure under the walking line is structure you do not trip on.
            const half = member / 2;
            const corner = (s, u) => vec.add(pa,
              vec.add(vec.mul(side, s * half), vec.mul(up, u)));
            const face = H.fill(H.polyline([corner(-1, 0), corner(1, 0),
                                            corner(1, -deep), corner(-1, -deep)], true));
            built.push(S.pad(face, along));
            members++;
          }
          //! AND SOMETHING IN EVERY JUNCTION. Three members meeting at a point
          //! leave a wedge of nothing between them, which from below is a hole
          //! in the roof at every node in it.
          for (const p of netNodes(cells, 1)) {
            const at = put(p[0], p[1]);
            const up = normalAt(p[0], p[1]);
            const base = vec.add(at, vec.mul(up, -deep));
            built.push(S.cylinder(new K.oc.gp_Ax2(
              new K.oc.gp_Pnt(base[0], base[1], base[2]),
              new K.oc.gp_Dir(up[0], up[1], up[2])), member / 2, deep));
            nodes++;
          }
        }
        if (parts !== 1) {
          const lift = KF.real(f, "cushion", 900), drop = KF.real(f, "drop", 650);
          for (const cell of cells) {
            //! THE OPENING, not the cell. A cushion is clamped to the inside
            //! face of the members round it, so it is the cell pulled in by half
            //! a member - and a cell narrower than one member has no opening at
            //! all, which is a thing to skip rather than to build inside out.
            const opening = insetConvex(cell, member / 2);
            if (!opening || loopArea(opening) < member * member) { skipped++; continue; }
            const rings = cushionRings(opening, { rise: lift, drop, rings: 1 });
            const centre = loopCentroid(opening);
            const axis = normalAt(centre[0], centre[1]);
            const wires = rings.map(ring => H.polyline(
              ring.loop.map(([x, y]) => vec.add(put(x, y), vec.mul(axis, ring.z))), true));
            try { built.push(S.loft(wires, false)); cushions++; }
            catch { skipped++; }
          }
        }
        if (!built.length) throw new Error("that roof came out with nothing in it");
        const span = Math.round(Math.min(length, width));
        const said = ["Roof net · " + cells.length + " cells over "
                        + Math.round(length) + " × " + Math.round(width),
                      members + " members " + Math.round(member) + " × "
                        + Math.round(deep) + " · " + nodes + " junctions · "
                        + cushions + " cushions",
                      "rise " + Math.round(rise) + " on a " + span
                        + " span · a paraboloid, so the height and the normal are "
                        + "differentiated rather than sampled",
                      "the cells are a Voronoi tessellation of a Lloyd-relaxed "
                        + "scatter - computed, not drawn - which is what makes them even "
                        + "in area and uneven in shape",
                      ...(skipped ? [skipped + " cells were too small for a member to "
                                     + "pass through and were left out"] : []),
                      ...finishNote(f)];
        return { shape: K.compoundOf(built), data: K.text(said) };
      },
    },

    /* ------------------------------------------------------ the column */

    FlaredColumn: {
      precondition: f => (KF.real(f, "height", 6000) > 0 ? null : "a column needs a height"),
      build: f => {
        const frame = frameOf(f);
        const height = KF.real(f, "height", 6000);
        const shaft = KF.real(f, "shaft", 900) / 2;
        const head = Math.max(shaft, KF.real(f, "head", 3600) / 2);
        const foot = Math.max(shaft, KF.real(f, "foot", 1200) / 2);
        const flare = Math.min(0.99, Math.max(0.02, KF.real(f, "flare", 0.55)));
        const sharp = KF.real(f, "sharpness", 2.6);
        const steps = Math.max(3, Math.round(KF.real(f, "steps", 16)));
        //! THE PROFILE, in (radius, height), turned about the column's own axis.
        //! A cone would be two lines; the flare is what makes it a column and not
        //! a funnel, so the shape of it is a curve somebody sets.
        const profile = [[0, 0], [foot, 0]];
        const from = height * (1 - flare);
        profile.push([shaft, from * 0.55]);
        for (let i = 1; i <= steps; i++) {
          const t = i / steps;
          profile.push([shaft + (head - shaft) * Math.pow(t, sharp),
                        from + (height - from) * t]);
        }
        profile.push([0, height]);
        const pts = profile.map(([r, z]) => vec.add(frame.origin,
          vec.add(vec.mul(frame.x, r), vec.mul(frame.z, z))));
        const body = H.revolve(H.fill(H.polyline(pts, true)), frame.origin, frame.z, 360);
        const said = ["Flared column · " + Math.round(height) + " high",
                      Math.round(shaft * 2) + " shaft opening to "
                        + Math.round(head * 2) + " at the head",
                      "the flare takes the top " + Math.round(flare * 100)
                        + "% of the height, at a sharpness of " + sharp.toFixed(1)];
        return { shape: body, data: K.text(said) };
      },
    },
  };
}

/* ------------------------------------------------------------ the package */

export const ATRIUM = offerPlugin({
  id: "atrium",
  name: "Atrium & Galleries",
  version: 1,
  summary: "A retail atrium the way one is actually drawn: flat floor plates whose "
         + "EDGES are swept. A parabolic void in plan is the sketch, and the band you "
         + "see from across it, the balustrade on top of it and the shopfront behind it "
         + "are three sections on that one curve. Over the top, a roof of thick walkable "
         + "members on a Voronoi net with an inflated ETFE cushion in every cell.",
  needs: [],
  nodes: ATRIUM_NODES,
  api: {
    name: "AtriumFactory",
    summary: "The plan curves, the sections and the roof's tessellation, as arithmetic.",
    operations: [
      { name: "parabolicVoid", takes: "length, wide, ends, fullness", gives: "loop",
        summary: "The void in plan: two parabolas facing away from each other." },
      { name: "slabEdgeSection", takes: "depth, bevel, back", gives: "section",
        summary: "The floor zone clad to the edge and chamfered under it." },
      { name: "voronoi", takes: "seeds, boundary", gives: "cells",
        summary: "Exact Voronoi cells, each one its region clipped by a half-plane "
               + "per other seed." },
      { name: "roofCells", takes: "length, width, count, seed, relax", gives: "cells",
        summary: "The roof's tessellation: scattered, Lloyd-relaxed, clipped to the "
               + "springing ellipse. The same seed is the same roof." },
    ],
  },
  drivers: atriumDrivers,
  async start() {
    //! Nothing to unpack. Every number this package knows is a dimension on a
    //! feature, and the one table in it - the Voronoi - is computed when a roof
    //! asks for it. A package that loads instantly is one nobody minds loading.
    return { sections: ["slab edge", "balustrade", "shopfront"] };
  },
});
