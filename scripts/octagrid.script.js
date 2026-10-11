// AN OCTAGON MASTERPLAN, AS ONE SCRIPT NODE.
//
// Source of the Script feature in docs/data/samples/octagon_plan.json, kept as
// a file so it can be read, edited and TESTED — docs/test/octagrid.test.mjs
// evaluates this very text. Paste it into any Script node and it runs;
// scripts/build_octagrid_sample.mjs embeds it.
//
// WHERE THE PATTERN COMES FROM, which is the whole of it: this IS the diagrid,
// with a rectangle dropped on every node.
//
// The diamond lattice has two kinds of point - the centres of the diamonds and
// the NODES where four of them meet. Put a rectangle on every node, long axis
// running out along the fan, in a 1:2 proportion. Now look at one diamond: the
// four rectangles round it present four different faces to it. The two to
// either side show their LONG sides; the two above and below show their SHORT
// sides. Join those four sides with four chamfers and you have an OCTAGON, and
// it is the diamond with its points cut off by its own neighbours' plots.
//
// That tiles the plane exactly, and the proof is in one line: the chamfer
// between this octagon's east rectangle and its north one runs between two
// rectangle corners - and the octagon diagonally up-and-right of it, whose
// west and south rectangles are those same two, draws the same chamfer
// backwards. Nothing is left over between them. Both rectangles may be any
// size at all and it still holds, which is what lets every plaza be sized in
// METRES for its own place on the fan rather than as a fraction of a bay.
//
// WHAT IS BUILT AND WHAT IS NOT. The octagons are the massing and the
// rectangles are the plazas between them: a rectangle is never extruded. Two
// octagons that share a chamfer can be fused into one elongated mass, and a
// run of them is a street-long building; the plazas stay open between the
// orthogonal neighbours, which is how the interstitial space survives the
// merging.
//
// THE HEIGHTS ARE NEARLY UNIFORM AND THEN THEY ARE NOT. Every mass takes the
// same height give or take \p vary, which is the semi-regular massing you
// start from; then the ATTRACTOR at (\p atX, \p atY) adds up to \p bulge at
// its own position and less as it fades, on the same five falloff curves the
// Soft Select node uses - docs/test/octagrid.test.mjs checks the two agree
// term for term. Move the attractor and the city grows a peak around it.
//
// WHAT IS WIRED INTO THE NODE BEATS WHAT IS TYPED INTO IT. Three Points on
// the Script's Points input are, in order, the height attractor, the void and
// the WORMHOLE - which drags the lattice itself towards it, so the plots, the
// octagons and the plazas all lean in together and the tiling stays a tiling.
// A curve on its Curves input is the spline attractor: it raises what is near
// it AND opens a gap along it, so one spline can be a high street with a cut
// down the middle of it. The sliders of the same name are the fallback, for a
// node with nothing wired to it.
//
// Every parameter below is an ARGUMENT on the node, so any of them can be
// driven by a Number: drop a slider node on the graph, wire it to Height, and
// the whole city answers to it.
//
// THE SITE is SiteBoundary.dxf: 44 points, 33.2 hectares, 602 x 853 m, in
// millimetres. Replace SITE with any closed ring of [x, y] and everything
// refits to it.
({
  params: [
    //! THE GRID
    { key: "rings", label: "Rings", def: 7, min: 2, max: 24, step: 1, unit: "" },
    { key: "spokes", label: "Bays around", def: 10, min: 2, max: 40, step: 1, unit: "" },
    { key: "focus", label: "Fan centre, beyond the site", def: 1200000,
      min: 150000, max: 20000000, step: 10000 },
    { key: "bearing", label: "Turn the fan", def: 0, min: -180, max: 180, step: 1,
      unit: "°" },

    //! THE PLAZAS, which are what make the octagons
    { key: "plaza", label: "Plaza, short side", def: 16000, min: 10000, max: 120000,
      step: 500 },
    { key: "ratio", label: "Plaza proportion", def: 2, min: 1.4143, max: 4, step: 0.05,
      unit: "" },
    { key: "plazaVary", label: "Plazas vary", def: 0.25, min: 0, max: 1, step: 0.05,
      unit: "" },

    //! THE PLAZAS THAT ARE MORE THAN PLAZAS. A share of the nodes take a
    //! bigger rectangle and the octagons round them give way, which is how a
    //! plan gets a square rather than a hundred light wells.
    { key: "grand", label: "Share of plazas that are major", def: 0.18, min: 0, max: 1,
      step: 0.02, unit: "" },
    { key: "grandScale", label: "How much bigger", def: 1.9, min: 1, max: 3.5, step: 0.05,
      unit: "" },

    //! THE MASSES
    { key: "merge", label: "How often masses join", def: 0.5, min: 0, max: 1, step: 0.05,
      unit: "" },
    { key: "maxRun", label: "Longest run", def: 3, min: 1, max: 8, step: 1, unit: "" },
    { key: "alongRings", label: "Run around the fan →", def: 0.5, min: 0, max: 1,
      step: 0.05, unit: "" },
    //! A GROUP IS NOT ALWAYS A LINE. This share of them wraps three octagons
    //! round one plaza instead - a court open on one side, which a straight
    //! run can never make.
    { key: "cluster", label: "Groups that wrap a plaza", def: 0.35, min: 0, max: 1,
      step: 0.05, unit: "" },
    { key: "inset", label: "Pull off the plot line", def: 1000, min: 0, max: 40000,
      step: 250 },
    { key: "drift", label: "Off the grid", def: 0, min: 0, max: 1, step: 0.05, unit: "" },
    { key: "margin", label: "Keep off the boundary", def: 10000, min: 0, max: 200000,
      step: 1000 },

    //! THE HEIGHTS
    { key: "height", label: "Height", def: 28000, min: 4000, max: 300000, step: 1000 },
    { key: "vary", label: "Give or take", def: 5000, min: 0, max: 60000, step: 500 },
    { key: "storey", label: "Round to storeys of", def: 4000, min: 0, max: 8000, step: 100 },

    //! THE HEIGHT ATTRACTOR
    { key: "atX", label: "Attractor east", def: 300000, min: -200000, max: 800000,
      step: 5000 },
    { key: "atY", label: "Attractor north", def: 480000, min: -200000, max: 1100000,
      step: 5000 },
    { key: "reach", label: "Its reach", def: 340000, min: 10000, max: 1500000, step: 10000 },
    { key: "bulge", label: "Height it adds", def: 120000, min: -200000, max: 400000,
      step: 5000 },
    { key: "falloff", label: "Falloff", options: ["Smooth", "Linear", "Sharp", "Dome",
                                                  "Hard"], def: 0 },

    //! THE SECOND ATTRACTOR, which takes away rather than adds: round it
    //! nothing is built at all, and between there and nowhere the masses
    //! stand further apart.
    { key: "voidX", label: "Void east", def: 170000, min: -200000, max: 800000,
      step: 5000 },
    { key: "voidY", label: "Void north", def: 250000, min: -200000, max: 1100000,
      step: 5000 },
    { key: "voidReach", label: "Its reach", def: 260000, min: 10000, max: 1500000,
      step: 10000 },
    { key: "voidCut", label: "Nothing is built above", def: 0.55, min: 0.01, max: 1,
      step: 0.01, unit: "" },
    { key: "gap", label: "Gap it opens", def: 16000, min: 0, max: 80000, step: 500 },

    //! THE WORMHOLE. Not a height and not a gap: it drags the LATTICE ITSELF
    //! towards itself, so the plots, the octagons and the plazas all lean in
    //! together and the tiling stays a tiling.
    { key: "warpX", label: "Wormhole east", def: 420000, min: -200000, max: 800000,
      step: 5000 },
    { key: "warpY", label: "Wormhole north", def: 620000, min: -200000, max: 1100000,
      step: 5000 },
    { key: "warpReach", label: "Its reach", def: 300000, min: 10000, max: 1500000,
      step: 10000 },
    { key: "warpPull", label: "How far it drags", def: 0.35, min: 0, max: 0.8, step: 0.01,
      unit: "" },

    //! AND A CURVE TO ATTRACT TO, wired into the node's Curves input rather
    //! than typed in: a spline through three or four Points, which are nodes
    //! in the graph you can drag. It raises what is near it and opens a gap
    //! along it, so one curve can be a high street or a cut through the plan.
    { key: "splineReach", label: "Spline reach", def: 150000, min: 10000, max: 800000,
      step: 5000 },
    { key: "splineBulge", label: "Height it adds", def: 60000, min: -200000, max: 400000,
      step: 5000 },
    { key: "splineGap", label: "Gap it opens", def: 0, min: 0, max: 80000, step: 500 },

    { key: "seed", label: "Seed", def: 4, min: 1, max: 999, step: 1, unit: "" },
    { key: "show", label: "Draw", options: ["Massing and plazas", "The massing only",
                                            "The plan only"], def: 0 },
  ],

  //! WHAT IT PUBLISHES. The whole plan is still what the feature itself
  //! gives; these are the three things it is made of, each carried by a node
  //! of its own under this one, so the massing can be deformed, cut, measured
  //! or exported without the squares and the setting-out lines coming too.
  outputs: [
    { key: "massing", label: "Massing" },
    { key: "plazas", label: "Plazas" },
    { key: "setting", label: "Setting out" },
  ],

  SITE: [
    [430300, 766300], [452200, 835300], [7300, 856500], [2100, 780900], [0, 704200],
    [400, 681200], [1200, 658300], [2500, 635600], [4300, 613000], [6600, 590500],
    [9300, 568200], [12600, 546000], [16300, 523900], [20500, 502000], [25200, 480200],
    [30400, 458500], [36000, 437000], [42200, 415600], [48800, 394300], [55900, 373200],
    [63400, 352100], [71500, 331300], [80000, 310500], [89100, 289900], [98600, 269400],
    [108600, 249100], [119000, 228900], [130000, 208800], [141400, 188800],
    [185400, 119900], [245700, 41100], [282700, 3900], [602000, 320300],
    [558600, 364100], [549900, 443700], [549300, 444700], [548700, 445800],
    [505200, 517100], [500200, 524300], [458500, 556100], [426500, 634900],
    [437000, 712400], [430000, 761800], [429900, 764100],
  ],
  /* ------------------------------------------------------------- the small
     arithmetic. Everything below is plane geometry on [x, y] pairs.        */

  //! mulberry32. A seeded generator, because a masterplan whose towers move
  //! every time the document rebuilds is not a masterplan. The same seed and
  //! the same sliders give the same plan, every time, on any machine.
  rng(seed) {
    let a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  },

  //! Crossing number. The classic half-open rule on y, so a point level with a
  //! vertex is counted once rather than twice or not at all.
  inside(ring, p) {
    let hit = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[i], b = ring[j];
      if ((a[1] > p[1]) !== (b[1] > p[1])
          && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) hit = !hit;
    }
    return hit;
  },

  //! Distance to the boundary itself, which is what \p margin is measured in.
  //! Inside-ness alone would let a block's corner sit on the pavement.
  awayFrom(ring, p) {
    let best = Infinity;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const a = ring[j], b = ring[i];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const len2 = dx * dx + dy * dy;
      let t = len2 > 0 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const d = Math.hypot(p[0] - (a[0] + dx * t), p[1] - (a[1] + dy * t));
      if (d < best) best = d;
    }
    return best;
  },

  //! A MITRE OFFSET WITH A DIFFERENT DISTANCE AT EACH VERTEX, which is what
  //! \p pinch needs: the tips are held while the sides come in. The vertex
  //! moves along the bisector by d / cos(half the turn), the standard mitre,
  //! and a spike sharper than about 20 degrees is clamped rather than sent to
  //! infinity - a sliver block is still a block.
  offsetRing(ring, dist) {
    const n = ring.length;
    if (n < 3) return ring.slice();
    const hand = this.area(ring) < 0 ? -1 : 1;
    const out = [];
    for (let i = 0; i < n; i++) {
      const prev = ring[(i - 1 + n) % n], here = ring[i], next = ring[(i + 1) % n];
      const inDir = this.unit([here[0] - prev[0], here[1] - prev[1]]);
      const outDir = this.unit([next[0] - here[0], next[1] - here[1]]);
      // Interior on the left of the run, so the inward normal is the left one.
      //! And guarded again here, because offsetRing is also handed a block
      //! that has been through halfOf, squareOf and unionOf.
      const nIn = [-inDir[1] * hand, inDir[0] * hand];
      const nOut = [-outDir[1] * hand, outDir[0] * hand];
      const sum = [nIn[0] + nOut[0], nIn[1] + nOut[1]];
      const denom = 1 + (nIn[0] * nOut[0] + nIn[1] * nOut[1]);
      const d = Array.isArray(dist) ? dist[i] : dist;
      if (denom < 0.06) { out.push([here[0] + nIn[0] * d, here[1] + nIn[1] * d]); continue; }
      out.push([here[0] + sum[0] / denom * d, here[1] + sum[1] / denom * d]);
    }
    return out;
  },

  //! NO TWO EDGES THAT ARE NOT NEIGHBOURS MAY CROSS. Twenty vertices is a
  //! hundred and ninety pairs, which is nothing, and it is the only honest
  //! way to know an offset has not folded a polygon through itself.
  simple(ring) {
    const n = ring.length;
    const side = (p, q, r) =>
      Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
    for (let i = 0; i < n; i++)
      for (let j = i + 2; j < n; j++) {
        if (i === 0 && j === n - 1) continue;          // they share a vertex
        const a = ring[i], b = ring[(i + 1) % n], c = ring[j], d = ring[(j + 1) % n];
        if (side(a, b, c) !== side(a, b, d) && side(c, d, a) !== side(c, d, b)) return false;
      }
    return true;
  },

  unit(v) {
    const l = Math.hypot(v[0], v[1]);
    return l > 1e-9 ? [v[0] / l, v[1] / l] : [0, 0];
  },

  area(ring) {
    let a = 0;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++)
      a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
    return a / 2;
  },

  centre(ring) {
    let x = 0, y = 0;
    for (const p of ring) { x += p[0]; y += p[1]; }
    return [x / ring.length, y / ring.length];
  },

  frameOf(p) {
    const site = this.SITE;
    const mid = this.centre(site);
    //! The site's own long axis, by the second moment of its outline. A fan
    //! that splays across the short way wastes most of its rings on the
    //! boundary, and which way is long is a fact about the site rather than
    //! something to ask for.
    let sxx = 0, syy = 0, sxy = 0;
    for (const q of site) {
      const dx = q[0] - mid[0], dy = q[1] - mid[1];
      sxx += dx * dx; syy += dy * dy; sxy += dx * dy;
    }
    const axis = 0.5 * Math.atan2(2 * sxy, sxx - syy) + p.bearing * Math.PI / 180;
    const look = [Math.cos(axis), Math.sin(axis)];
    const focus = Math.max(1, p.focus);
    const from = [mid[0] - look[0] * focus, mid[1] - look[1] * focus];

    //! THE LIMITS ARE THE SITE'S OWN, which is the whole of "maximise the
    //! site": the fan is exactly as wide and as deep as the boundary is, seen
    //! from there, so no ring and no bay is spent on ground that is not in it.
    let a0 = Infinity, a1 = -Infinity, r0 = Infinity, r1 = -Infinity;
    for (const q of site) {
      const dx = q[0] - from[0], dy = q[1] - from[1];
      //! Measured against the look direction rather than against +x, so the
      //! branch cut of atan2 is behind the fan and never through it.
      const along = dx * look[0] + dy * look[1];
      const across = -dx * look[1] + dy * look[0];
      const ang = Math.atan2(across, along);
      const rad = Math.hypot(dx, dy);
      if (ang < a0) a0 = ang;
      if (ang > a1) a1 = ang;
      if (rad < r0) r0 = rad;
      if (rad > r1) r1 = rad;
    }
    //! THE WORMHOLE RIDES ON THE FRAME, so every node this frame makes is
    //! already dragged. Put anywhere else it would have to be applied in
    //! four places - the plots, the octagons, the plazas, the drawn grid -
    //! and the first one anybody forgot would tear the tiling open.
    return { from, look, a0, a1, r0, r1,
             warp: { x: p.warpX, y: p.warpY, reach: Math.max(1, p.warpReach),
                     pull: Math.max(0, Math.min(0.8, p.warpPull)),
                     style: this.FALLOFFS[Math.round(p.falloff)] || this.FALLOFFS[0] },
             da: (a1 - a0) / Math.max(1, Math.round(p.spokes)),
             dr: (r1 - r0) / Math.max(1, Math.round(p.rings)) };
  },

  //! Lattice node (u, v) in the world. u counts bays around the fan, v counts
  //! rings out from the centre.
  nodeAt(f, u, v) {
    const ang = f.a0 + u * f.da, rad = f.r0 + v * f.dr;
    const c = Math.cos(ang), s = Math.sin(ang);
    // look rotated by ang, times the radius
    const dx = (f.look[0] * c - f.look[1] * s) * rad;
    const dy = (f.look[1] * c + f.look[0] * s) * rad;
    return this.warped(f, [f.from[0] + dx, f.from[1] + dy]);
  },

  //! THE WORMHOLE, applied to one node. The node is moved a FRACTION of the
  //! way to the hole, and the fraction is the falloff - so the pull is
  //! strongest at the centre and nothing at the rim, and a node outside the
  //! reach does not move at all.
  //!
  //! A FRACTION RATHER THAN A DISTANCE, and at most 0.8 of it. Moving every
  //! node a fixed distance towards a point turns the lattice inside out the
  //! moment the distance is bigger than the gap between two nodes: they swap
  //! sides. A fraction cannot reorder them, because it is monotone in the
  //! distance - two nodes on a ray stay in the order they were in.
  warped(f, q) {
    const w = f.warp;
    if (!w || w.pull <= 0) return q;
    const dx = w.x - q[0], dy = w.y - q[1];
    const d = Math.hypot(dx, dy);
    if (!(d > 1e-9) || d >= w.reach) return q;
    const k = w.pull * this.falloffAt(w.style, 1 - d / w.reach);
    return [q[0] + dx * k, q[1] + dy * k];
  },


  /* ---------------------------------------------------------- the five curves

     The same five the Soft Select node offers, written out here because a
     Script feature is one self-contained string and cannot import anything.
     docs/test/octagrid.test.mjs checks these against falloffAt in
     softselect.js at a hundred points on each curve, so the two cannot drift
     apart without something saying so.                                     */

  FALLOFFS: ["Smooth", "Linear", "Sharp", "Dome", "Hard"],

  falloffAt(style, t) {
    const u = t <= 0 ? 0 : t >= 1 ? 1 : t;
    switch (style) {
      case "Smooth": return u * u * (3 - 2 * u);
      case "Linear": return u;
      case "Sharp": return u * u;
      case "Dome": return Math.sqrt(u * (2 - u));
      case "Hard": return u > 0 ? 1 : 0;
      default: return u * u * (3 - 2 * u);
    }
  },

  /* ------------------------------------------------------------ the plazas

     ONE RECTANGLE PER NODE, sized in metres rather than in bays. The bay
     round the fan grows with the radius - 43 m at the inner ring and 70 m at
     the outer, on this site - so a plaza held at a fraction of a bay would be
     half the size at one end of the plan and the rule is in metres: no side
     under ten, and never squarer than root two.                            */

  plazaAt(f, u, v, p, roll, grand) {
    //! The bay and the ring AT THIS NODE, in millimetres on the ground. Two
    //! lattice steps are one bay, which is why the span is taken across
    //! u-1 .. u+1 and halved nowhere: that distance IS the bay.
    const bay = this.spanBetween(f, [u - 1, v], [u + 1, v]);
    const ring = this.spanBetween(f, [u, v - 1], [u, v + 1]);
    const ratio = Math.max(Math.SQRT2, p.ratio);
    //! \p plazaVary moves each plaza's size by up to a quarter either way at
    //! the default, which is what keeps the octagons from being 180 copies of
    //! one octagon.
    const scale = (1 + (roll * 2 - 1) * p.plazaVary * 0.4)
      //! AND SOME PLAZAS ARE MORE THAN PLAZAS. A share of the nodes take the
      //! bigger rectangle; the octagons round them are made from their plots
      //! and so give way by exactly as much, which is why a major square
      //! needs no other machinery than a bigger number here.
      * (grand ? Math.max(1, p.grandScale) : 1);
    let short = Math.max(10000, p.plaza * scale);
    let long = short * ratio;
    //! AND IT HAS TO FIT. Two rectangles either side of an octagon must leave
    //! something between them, so neither half-extent may reach the next
    //! node: 0.45 of the way is the clamp, and when the rule bites it is the
    //! PLAZA that gives, never the octagon - a zero-area octagon is a face
    //! OpenCascade refuses and a plaza 9 m across is a plaza.
    //! THE PROPORTION GIVES BEFORE THE SIZE DOES. Ten metres is a floor and
    //! root two is a floor; the 1:2 asked for is a preference between them.
    //! Clamping both sides together to keep 1:2 exactly made a 27 m ring
    //! refuse a plaza it could hold at 1:1.6, so the long side is capped
    //! first and the ratio walks down towards root two before anything is
    //! given up.
    const FIT = 0.45;                       // of the bay, each way, at most
    short = Math.min(short, FIT * bay);
    long = Math.min(long, FIT * ring);
    if (long < short * Math.SQRT2) short = Math.min(short, long / Math.SQRT2);
    if (long > short * ratio) long = short * ratio;
    return { hw: short / bay, hd: long / ring, short, long, bay, ring, grand: !!grand,
             kept: short >= 9999 && long >= short * 1.4142 - 1 };
  },

  //! How far apart two lattice points are on the ground.
  spanBetween(f, a, b) {
    const p = this.nodeAt(f, a[0] / 2, a[1] / 2), q = this.nodeAt(f, b[0] / 2, b[1] / 2);
    return Math.hypot(q[0] - p[0], q[1] - p[1]);
  },

  rectRing(f, u, v, half) {
    return [[u - half.hw, v - half.hd], [u + half.hw, v - half.hd],
            [u + half.hw, v + half.hd], [u - half.hw, v + half.hd]]
      .map(([a, b]) => this.nodeAt(f, a / 2, b / 2));
  },

  /* THE OCTAGON, out of the four rectangles round a diamond. Eight vertices:
     the east plot's long side, a chamfer, the north plot's short side, a
     chamfer, and so on round. In lattice coordinates first, because that is
     where the four plots' edges are simply numbers, and mapped to the ground
     at the end.                                                            */
  octagonRing(f, u, v, E, N, W, S) {
    return [
      [u + 1 - E.hw, v - E.hd], [u + 1 - E.hw, v + E.hd],
      [u + N.hw, v + 1 - N.hd], [u - N.hw, v + 1 - N.hd],
      [u - 1 + W.hw, v + W.hd], [u - 1 + W.hw, v - W.hd],
      [u - S.hw, v - 1 + S.hd], [u + S.hw, v - 1 + S.hd],
    ].map(([a, b]) => this.nodeAt(f, a / 2, b / 2));
  },

  /* ---------------------------------------------------------------- the plan

     Pure: numbers in, polygons out, no kernel. This is what the test drives. */

  //! WHAT IS WIRED IN, BEFORE ANYTHING IS BUILT. The Script node hands over
  //! the Points and Curves on its inputs as plain numbers, in the order they
  //! were wired, and they OVERRULE the sliders of the same name: the first
  //! point is the height attractor, the second the void, the third the
  //! wormhole. The sliders stay as the fallback, so the node still works
  //! with nothing wired to it, and the graph is the better way round - a
  //! point you drag in the viewport beats two numbers you type.
  withWired(p, wired) {
    const points = (wired && wired.points) || [];
    const at = { ...p };
    if (points[0]) { at.atX = points[0][0]; at.atY = points[0][1]; }
    if (points[1]) { at.voidX = points[1][0]; at.voidY = points[1][1]; }
    if (points[2]) { at.warpX = points[2][0]; at.warpY = points[2][1]; }
    at.spline = (wired && wired.curves && wired.curves[0]) || null;
    at.wiredPoints = points.length;
    return at;
  },

  //! How far a point on the ground is from the wired spline. The curve
  //! arrives as a polyline, so this is the distance to the nearest place ON
  //! it, clamped to each segment's ends - the same measure the Soft Select
  //! node's curve attractor uses, and for the same reason: unclamped, a
  //! point off the end of the spline reads as being on it.
  alongSpline(run, q) {
    if (!run || run.length < 2) return Infinity;
    let best = Infinity;
    for (let i = 0; i + 1 < run.length; i++) {
      const a = run[i], b = run[i + 1];
      const dx = b[0] - a[0], dy = b[1] - a[1];
      const len2 = dx * dx + dy * dy;
      let t = len2 > 1e-12 ? ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / len2 : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const d = Math.hypot(q[0] - (a[0] + dx * t), q[1] - (a[1] + dy * t));
      if (d < best) best = d;
    }
    return best;
  },

  plan(p) {
    const f = this.frameOf(p);
    const spokes = Math.max(1, Math.round(p.spokes));
    const ringCount = Math.max(1, Math.round(p.rings));
    const rnd = this.rng(Math.round(p.seed));
    const margin = Math.max(0, p.margin);
    const key = (u, v) => u + "," + v;

    //! EVERY NODE'S PLAZA FIRST, because an octagon is made of its four
    //! neighbours' plazas and cannot be worked out until they exist. Rolled
    //! from the node's own coordinates rather than from the sequence, so a
    //! plaza is the same size however the cells are later visited.
    const plots = new Map();
    for (let v = 0; v <= 2 * ringCount; v++)
      for (let u = 0; u <= 2 * spokes; u++) {
        if ((u + v) % 2 === 0) continue;             // nodes are the odd points
        //! ROLLED FROM THE NODE'S OWN COORDINATES, twice: once for the size
        //! and once for whether this is a major square. Rolling from the
        //! sequence instead would move every plaza the moment anything
        //! upstream changed the order cells are visited in.
        const draw = this.rng(Math.round(p.seed) * 7919 + u * 131 + v * 17);
        const roll = draw();
        const grand = draw() < p.grand;
        plots.set(key(u, v), this.plazaAt(f, u, v, p, roll, grand));
      }

    //! THE OCTAGONS. A diamond is kept when all eight of its corners are in
    //! the site - not its centre, which would hang a quarter of a block over
    //! the boundary.
    const cells = new Map();
    let refusedPlaza = 0, folded = 0;
    for (let v = 1; v < 2 * ringCount; v++)
      for (let u = 1; u < 2 * spokes; u++) {
        if ((u + v) % 2 !== 0) continue;
        const E = plots.get(key(u + 1, v)), N = plots.get(key(u, v + 1));
        const W = plots.get(key(u - 1, v)), S = plots.get(key(u, v - 1));
        if (!E || !N || !W || !S) continue;
        if (!(E.kept && N.kept && W.kept && S.kept)) { refusedPlaza++; continue; }
        const ring = this.octagonRing(f, u, v, E, N, W, S);
        if (this.area(ring) < 0) ring.reverse();     // the lattice frame is left-handed
        //! AND IT MUST STILL BE AN OCTAGON. The wormhole drags the lattice
        //! about, and a cell close enough to the middle of it can be dragged
        //! through itself. The fractional pull makes that rare rather than
        //! impossible, so it is checked rather than argued about.
        if (!this.simple(ring) || Math.abs(this.area(ring)) < 1e6) { folded++; continue; }
        let ok = true;
        for (const q of ring)
          if (!this.inside(this.SITE, q) || this.awayFrom(this.SITE, q) < margin) {
            ok = false; break;
          }
        if (ok) cells.set(key(u, v), { u, v, ring });
      }

    /* ------------------------------------------------------------- merging

       ONLY THE DIAGONALS. Two octagons that step by (1,1) or (1,-1) share a
       chamfer and fuse into one mass; two that step by (2,0) or (0,2) have a
       PLAZA between them and must not. That is the whole difference between
       an elongated building and a building that has eaten the square.     */

    const DIRS = [[1, 1], [1, -1]];
    const used = new Set();
    const order = [...cells.values()];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const t = order[i]; order[i] = order[j]; order[j] = t;
    }

    //! THE FOUR OCTAGONS ROUND ONE PLAZA, in cycle order. Consecutive ones
    //! share a chamfer - (u+1,v) and (u,v+1) step by (-1,+1), which is a
    //! diagonal - so any three in a row make one C-shaped mass with the
    //! plaza in its mouth. All four would close the plaza into a courtyard,
    //! which is a different thing and not what was asked for.
    const ROUND = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    const blocks = [];

    //! THE CLUSTERS ARE TAKEN FIRST, in a pass of their own, and that is not
    //! tidiness. Tried inside the main loop they almost never formed: three
    //! free octagons round one node is a strict thing to ask for, and by the
    //! time a cell came up its neighbours had been eaten by the straight runs
    //! - four attempts, nought clusters, on the default settings. Given first
    //! claim they succeed, and what is left still makes runs.
    for (const cell of order) {
      if (used.has(key(cell.u, cell.v))) continue;
      if (rnd() >= p.merge * p.cluster) continue;
      const node = ROUND.map(d => [cell.u + d[0], cell.v + d[1]])[Math.floor(rnd() * 4) % 4];
      const round = ROUND.map(d => cells.get(key(node[0] + d[0], node[1] + d[1])));
      const start = Math.floor(rnd() * 4) % 4;
      for (let turn = 0; turn < 4; turn++) {
        const three = [0, 1, 2].map(i => round[(start + turn + i) % 4]);
        if (!three.every(c => c && !used.has(key(c.u, c.v)))) continue;
        if (!three.some(c => c.u === cell.u && c.v === cell.v)) continue;
        for (const c of three) used.add(key(c.u, c.v));
        blocks.push({ cells: three, shape: "cluster", about: node });
        break;
      }
    }

    for (const cell of order) {
      if (used.has(key(cell.u, cell.v))) continue;
      let want = 1;
      if (rnd() < p.merge) want = 2 + Math.floor(rnd() * Math.max(0, Math.round(p.maxRun) - 1));

      const dir = DIRS[rnd() < p.alongRings ? 0 : 1];
      const run = [cell];
      used.add(key(cell.u, cell.v));
      //! Both ways along the line, for the reason the diagrid script gives:
      //! forwards only, a seed whose neighbour has gone stops at one.
      for (const way of [1, -1]) {
        let u = cell.u, v = cell.v;
        while (run.length < want) {
          u += dir[0] * way; v += dir[1] * way;
          const next = cells.get(key(u, v));
          if (!next || used.has(key(u, v))) break;
          used.add(key(u, v));
          if (way > 0) run.push(next); else run.unshift(next);
        }
      }
      blocks.push({ cells: run, shape: "run", step: dir });
    }

    /* ------------------------------------------------------- shaping and height */

    const out = [];
    let swallowed = 0;
    const storey = Math.max(0, p.storey);
    const reach = Math.max(1, p.reach);
    const voidReach = Math.max(1, p.voidReach);
    const splineReach = Math.max(1, p.splineReach);
    const style = this.FALLOFFS[Math.round(p.falloff)] || this.FALLOFFS[0];
    const pullAt = (q, x, y, r) =>
      this.falloffAt(style, 1 - Math.hypot(q[0] - x, q[1] - y) / r);
    for (const block of blocks) {
      let ring = block.cells.length > 1
        ? this.unionOf(block.cells.map(c => c.ring))
        : block.cells[0].ring;
      if (!ring) ring = block.cells[0].ring;
      const mid = this.centre(ring);

      //! THE VOID ATTRACTOR DRIVES THE GAP. At its centre the masses are
      //! pulled \p gap off their plot lines and stand as far apart as they
      //! ever will; out at its reach there is only \p inset left, and at
      //! inset 0 they touch along their chamfers the way the tiling does.
      const hollow = pullAt(mid, p.voidX, p.voidY, voidReach);
      //! THE SPLINE DOES BOTH. Near it the masses stand further apart and
      //! higher - a street with a cut down it - and it is the same falloff
      //! and the same reach for the two, so a curve that opens a gap also
      //! raises what it has opened.
      const along = p.spline
        ? this.falloffAt(style, 1 - this.alongSpline(p.spline, mid) / splineReach) : 0;
      const back = p.inset + p.gap * hollow + p.splineGap * along;
      const was = Math.abs(this.area(ring));
      if (back > 0) {
        //! THE OFFSET CAN TIE A KNOT, and only on the concave ones. A run or
        //! a cluster has a notch in it where a plaza sits, and a mitre offset
        //! big enough closes that notch and sends the reflex corner out
        //! through the far wall: at a 10 m gap one mass put a corner 439 mm
        //! inside the plaza it wraps. The area still reads positive and the
        //! thing still draws, which is why this is checked rather than
        //! assumed. Halve and try again, and give the plot up if it will not
        //! come clean.
        let want = back;
        for (let tries = 0; tries < 4; tries++) {
          const moved = this.offsetRing(ring, want);
          //! AND IT MUST STAY INSIDE WHAT IT CAME FROM. A mitre at a REFLEX
          //! corner - the mouth of a notch - moves the vertex out of the
          //! body on purpose, which is right until the offset is wider than
          //! the notch: at an 80 m gap twenty-two masses had grown out
          //! through their own notches into their neighbours, and two
          //! corners had left the site. An inward offset that lands outside
          //! the ring it came from is not an inward offset.
          if (this.area(moved) * this.area(ring) > 0 && this.simple(moved)
              && moved.every(q => this.inside(ring, q) || this.awayFrom(ring, q) < 1)) {
            ring = moved;
            break;
          }
          want /= 2;
          if (tries === 3) { ring = null; }
        }
        if (!ring) { swallowed++; continue; }
      }
      //! AND WHAT THE GAP HAS EATEN IS NOT A BUILDING. A 36 m gap on a 40 m
      //! octagon leaves a splinter: the sign of the area still says it is a
      //! polygon, it draws, and the plan fills with grit round the void. A
      //! quarter of what it started as is the line - below that the plot is
      //! given up to the negative space, which is what the void is for.
      if (Math.abs(this.area(ring)) < was * 0.25) { swallowed++; continue; }
      //! Off the grid, by at most half the gap that was opened, so two
      //! neighbours closing on each other still cannot meet. The plazas are
      //! the other thing in the way, and they do not move.
      if (p.drift > 0 && back > 0) {
        const budget = p.drift * back / 2;
        const dx = (rnd() * 2 - 1) * budget, dy = (rnd() * 2 - 1) * budget;
        ring = ring.map(q => [q[0] + dx, q[1] + dy]);
      }

      //! AND IT DECIDES WHAT IS NOT BUILT AT ALL. Above \p voidCut the block
      //! keeps its plot and takes no height: a hole in the massing with a
      //! soft edge, because the cut is on the falloff rather than on the
      //! distance.
      const jitter = (rnd() * 2 - 1) * p.vary;
      if (hollow >= p.voidCut) {
        out.push({ ring, height: 0, plane: null, run: block.cells.length,
                   pull: 0, hollow, empty: true, shape: block.shape,
                   at: block.cells.map(c => [c.u, c.v]) });
        continue;
      }

      //! THE HEIGHT, VERTEX BY VERTEX. Asking the attractor once, at the
      //! middle, gave every mass one height and a flat top - and a 60 m
      //! block that straddles the edge of the influence zone is then either
      //! wholly in it or wholly out, which is the step you can see in the
      //! skyline. Asked at each corner instead, the corner nearest the
      //! attractor gets the most and the far one least.
      //!
      //! THE TOP IS STILL ONE FLAT FACE, because the heights are fitted with
      //! a PLANE through the corner values rather than used raw: eight
      //! corners at eight heights is a top no solid modeller will cap. The
      //! plane is the least-squares fit, so it leans the way the field does
      //! and the face is planar to the last bit.
      //! AND THE SPLINE IS ASKED AT EVERY CORNER TOO, so a mass alongside it
      //! leans towards it exactly as it leans towards the point attractor.
      const zs = ring.map(q => p.height + jitter
        + p.bulge * pullAt(q, p.atX, p.atY, reach)
        + (p.spline ? p.splineBulge
            * this.falloffAt(style, 1 - this.alongSpline(p.spline, q) / splineReach) : 0));
      let mean = 0;
      for (const z of zs) mean += z;
      mean /= zs.length;
      let sxx = 0, sxy = 0, syy = 0, sxz = 0, syz = 0;
      ring.forEach((q, i) => {
        const dx = q[0] - mid[0], dy = q[1] - mid[1], dz = zs[i] - mean;
        sxx += dx * dx; sxy += dx * dy; syy += dy * dy;
        sxz += dx * dz; syz += dy * dz;
      });
      const det = sxx * syy - sxy * sxy;
      let bx = 0, by = 0;
      if (Math.abs(det) > 1e-9) {
        bx = (sxz * syy - syz * sxy) / det;
        by = (syz * sxx - sxz * sxy) / det;
      }
      //! Only the level is rounded to a storey. Rounding each corner would
      //! put them on different planes again, which is the whole thing this
      //! avoids.
      if (storey > 0) mean = Math.round(mean / storey) * storey;
      const plane = { z: mean, bx, by, at: mid };
      const corners = ring.map(q => mean + bx * (q[0] - mid[0]) + by * (q[1] - mid[1]));
      const low = Math.min(...corners);
      //! A slope steep enough to put a corner underground is flattened until
      //! it does not. It takes a 400 m bulge on a 10 m reach to get there,
      //! and the answer "a building with a corner below the pavement" is
      //! worse than a shallower roof.
      if (low < storey && Math.max(...corners) > storey) {
        const k = (mean - storey) / Math.max(1e-9, mean - low);
        plane.bx *= k; plane.by *= k;
      }
      out.push({ ring, height: Math.max(0, mean), plane, run: block.cells.length,
                 pull: pullAt(mid, p.atX, p.atY, reach), hollow, empty: false,
                 shape: block.shape, at: block.cells.map(c => [c.u, c.v]) });
    }

    //! THE PLAZAS THEMSELVES, for drawing: every node whose four octagons -
    //! or any of them - were kept. A plaza with nothing round it is a piece
    //! of the site nobody is using, not a square.
    const plazas = [];
    for (const [k, half] of plots) {
      const [u, v] = k.split(",").map(Number);
      const near = [[u + 1, v], [u - 1, v], [u, v + 1], [u, v - 1]]
        .filter(([a, b]) => cells.has(key(a, b)));
      if (near.length < 2) continue;
      const ring = this.rectRing(f, u, v, half);
      if (this.area(ring) < 0) ring.reverse();
      if (ring.some(q => !this.inside(this.SITE, q))) continue;
      plazas.push({ ring, short: half.short, long: half.long, grand: half.grand,
                    touching: near.length, at: [u, v] });
    }

    //! THE TIGHTEST BAY ON THE FAN, so a refusal can say WHY rather than
    //! handing back an empty plan. At 24 rings by 40 bays this site's bays are
    //! 24 m across and a 10 m plaza at 1:2 leaves no octagon between the
    //! plots: every cell is refused and the plan comes back empty, which
    //! looks exactly like a bug.
    let bay = Infinity, ring = Infinity;
    for (const [k, half] of plots) {
      if (half.bay < bay) bay = half.bay;
      if (half.ring < ring) ring = half.ring;
    }
    return { blocks: out, plazas, frame: f, cells: cells.size, refusedPlaza,
             swallowed, folded, bay, ring };
  },

  /* THE UNION OF OCTAGONS THAT SHARE A CHAMFER, by cancelling the shared
     edges. Exact here because the chamfer between two diagonal neighbours is
     the same two rectangle corners drawn from both sides - see the header. */
  unionOf(rings) {
    const at = new Map();
    const id = p => {
      const k = Math.round(p[0] / 10) + "," + Math.round(p[1] / 10);
      if (!at.has(k)) at.set(k, p);
      return k;
    };
    const edges = new Map();
    for (const ring of rings)
      for (let i = 0; i < ring.length; i++) {
        const a = id(ring[i]), b = id(ring[(i + 1) % ring.length]);
        if (edges.get(b + "|" + a)) edges.delete(b + "|" + a);
        else edges.set(a + "|" + b, [a, b]);
      }
    if (!edges.size) return null;
    const next = new Map();
    for (const [, [a, b]] of edges) {
      if (next.has(a)) return null;
      next.set(a, b);
    }
    const start = next.keys().next().value;
    const loop = [];
    let here = start;
    for (let guard = 0; guard < 1000; guard++) {
      loop.push(at.get(here));
      here = next.get(here);
      if (here === undefined) return null;
      if (here === start) break;
    }
    return loop.length === next.size ? loop : null;
  },

  /* --------------------------------------------------------------- the solid */

  build(raw, k, wired) {
    const p = this.withWired(raw, wired);
    const made = this.plan(p);
    const show = Math.round(p.show);
    const parts = [];
    //! THE THREE THINGS THIS PLAN IS, kept apart as they are made. The whole
    //! is still what the feature gives; these are what the Output nodes under
    //! it carry, so the massing can be deformed, cut or exported without the
    //! squares and the setting-out lines coming with it.
    const massing = [], squares = [], setting = [];

    //! REFUSED BY NAME, not by an empty compound. The plaza rule is a rule
    //! about the ground - ten metres, never squarer than root two - and a
    //! grid fine enough to break it is a legitimate thing to ask for and an
    //! illegitimate thing to answer with nothing.
    if (!made.blocks.length) {
      const m = v => (v / 1000).toFixed(0);
      throw new Error("no block survived the plaza rule: at " + Math.round(p.rings)
        + " rings by " + Math.round(p.spokes) + " bays the smallest bay here is "
        + m(made.bay) + " m by " + m(made.ring) + " m, and a " + m(p.plaza)
        + " m plaza at 1:" + (+p.ratio).toFixed(2)
        + " leaves no octagon between the plots. Use fewer rings or bays, a "
        + "smaller plaza, or a shallower proportion"
        + (made.refusedPlaza ? " — " + made.refusedPlaza + " cells were refused" : ""));
    }

    const keep = (one, into) => { parts.push(one); into.push(one); return one; };
    for (const block of made.blocks) {
      const base = k.polyline(block.ring.map(q => [q[0], q[1], 0]), { closed: true });
      if (show === 2 || block.height < 1 || !block.plane) { keep(k.face(base), massing); continue; }
      const pl = block.plane;
      const z = q => pl.z + pl.bx * (q[0] - pl.at[0]) + pl.by * (q[1] - pl.at[1]);
      const tilt = Math.hypot(pl.bx, pl.by);
      //! A FLAT TOP IS A PRISM AND A LEANING ONE IS A LOFT. Below a
      //! millimetre of fall across the whole block the two are the same
      //! solid, and the prism is the one that cannot produce a degenerate
      //! ruled face - so the cheap path is taken when it is honest to.
      if (tilt < 1e-6) { keep(k.prism(k.face(base), [0, 0, pl.z]), massing); continue; }
      const top = k.polyline(block.ring.map(q => [q[0], q[1], Math.max(1, z(q))]),
                             { closed: true });
      keep(k.loft([base, top], { solid: true, ruled: true }), massing);
    }
    //! The plazas are drawn flat, always: they are the thing between the
    //! buildings and a plan without them is a plan of islands.
    if (show !== 1)
      for (const plaza of made.plazas)
        keep(k.face(k.polyline(plaza.ring.map(q => [q[0], q[1], 0]), { closed: true })), squares);

    //! THE ATTRACTOR, drawn where it is: a ring at its reach and a mast at
    //! its centre. A slider pair you cannot see the effect of is a slider
    //! pair nobody will touch.
    const circleAt = (x, y, r) => {
      const run = [];
      for (let i = 0; i <= 64; i++) {
        const a = i / 64 * Math.PI * 2;
        run.push([x + Math.cos(a) * r, y + Math.sin(a) * r, 0]);
      }
      return k.polyline(run, { closed: true });
    };
    keep(circleAt(p.atX, p.atY, p.reach), setting);
    keep(k.polyline([[p.atX, p.atY, 0],
                     [p.atX, p.atY, p.height + Math.max(0, p.bulge)]]), setting);
    //! The void's ring too, and the smaller ring where its cut bites - the
    //! line inside which nothing is built. Two attractors you cannot see are
    //! two attractors nobody will move.
    keep(circleAt(p.voidX, p.voidY, p.voidReach), setting);
    const cut = this.FALLOFFS[Math.round(p.falloff)] || this.FALLOFFS[0];
    let bite = 0;
    for (let i = 100; i >= 0; i--)
      if (this.falloffAt(cut, 1 - i / 100) >= p.voidCut) { bite = i / 100; break; }
    if (bite > 0) keep(circleAt(p.voidX, p.voidY, p.voidReach * bite), setting);
    keep(k.polyline(this.SITE.map(q => [q[0], q[1], 0]), { closed: true }), setting);
    //! AND THE THREE, PUBLISHED. An empty one would be an output carrying
    //! nothing, which the kernel refuses by name - so a setting with no
    //! massing in it (every plot given to the void, say) publishes the site
    //! line it always has rather than an empty compound.
    return {
      shape: k.compound(parts),
      parts: {
        massing: k.compound(massing.length ? massing : setting),
        plazas: k.compound(squares.length ? squares : setting),
        setting: k.compound(setting),
      },
    };
  },
})
