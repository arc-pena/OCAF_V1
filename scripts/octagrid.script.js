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

    //! THE MASSES
    { key: "merge", label: "How often masses join", def: 0.5, min: 0, max: 1, step: 0.05,
      unit: "" },
    { key: "maxRun", label: "Longest run", def: 3, min: 1, max: 8, step: 1, unit: "" },
    { key: "alongRings", label: "Run around the fan →", def: 0.5, min: 0, max: 1,
      step: 0.05, unit: "" },
    { key: "inset", label: "Pull off the plot line", def: 2500, min: 0, max: 40000,
      step: 250 },
    { key: "drift", label: "Off the grid", def: 0, min: 0, max: 1, step: 0.05, unit: "" },
    { key: "margin", label: "Keep off the boundary", def: 10000, min: 0, max: 200000,
      step: 1000 },

    //! THE HEIGHTS
    { key: "height", label: "Height", def: 28000, min: 4000, max: 300000, step: 1000 },
    { key: "vary", label: "Give or take", def: 5000, min: 0, max: 60000, step: 500 },
    { key: "storey", label: "Round to storeys of", def: 4000, min: 0, max: 8000, step: 100 },

    //! THE ATTRACTOR
    { key: "atX", label: "Attractor east", def: 300000, min: -200000, max: 800000,
      step: 5000 },
    { key: "atY", label: "Attractor north", def: 480000, min: -200000, max: 1100000,
      step: 5000 },
    { key: "reach", label: "Its reach", def: 320000, min: 10000, max: 1500000, step: 10000 },
    { key: "bulge", label: "Height it adds", def: 90000, min: -200000, max: 400000,
      step: 5000 },
    { key: "falloff", label: "Falloff", options: ["Smooth", "Linear", "Sharp", "Dome",
                                                  "Hard"], def: 0 },

    { key: "seed", label: "Seed", def: 4, min: 1, max: 999, step: 1, unit: "" },
    { key: "show", label: "Draw", options: ["Massing and plazas", "The massing only",
                                            "The plan only"], def: 0 },
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
    return { from, look, a0, a1, r0, r1,
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
    return [f.from[0] + dx, f.from[1] + dy];
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

  plazaAt(f, u, v, p, roll) {
    //! The bay and the ring AT THIS NODE, in millimetres on the ground. Two
    //! lattice steps are one bay, which is why the span is taken across
    //! u-1 .. u+1 and halved nowhere: that distance IS the bay.
    const bay = this.spanBetween(f, [u - 1, v], [u + 1, v]);
    const ring = this.spanBetween(f, [u, v - 1], [u, v + 1]);
    const ratio = Math.max(Math.SQRT2, p.ratio);
    //! \p plazaVary moves each plaza's size by up to a quarter either way at
    //! the default, which is what keeps the octagons from being 180 copies of
    //! one octagon.
    const scale = 1 + (roll * 2 - 1) * p.plazaVary * 0.4;
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
    return { hw: short / bay, hd: long / ring, short, long, bay, ring,
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
        const roll = this.rng(Math.round(p.seed) * 7919 + u * 131 + v * 17)();
        plots.set(key(u, v), this.plazaAt(f, u, v, p, roll));
      }

    //! THE OCTAGONS. A diamond is kept when all eight of its corners are in
    //! the site - not its centre, which would hang a quarter of a block over
    //! the boundary.
    const cells = new Map();
    let refusedPlaza = 0;
    for (let v = 1; v < 2 * ringCount; v++)
      for (let u = 1; u < 2 * spokes; u++) {
        if ((u + v) % 2 !== 0) continue;
        const E = plots.get(key(u + 1, v)), N = plots.get(key(u, v + 1));
        const W = plots.get(key(u - 1, v)), S = plots.get(key(u, v - 1));
        if (!E || !N || !W || !S) continue;
        if (!(E.kept && N.kept && W.kept && S.kept)) { refusedPlaza++; continue; }
        const ring = this.octagonRing(f, u, v, E, N, W, S);
        if (this.area(ring) < 0) ring.reverse();     // the lattice frame is left-handed
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

    const blocks = [];
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
      blocks.push({ cells: run, step: dir });
    }

    /* ------------------------------------------------------- shaping and height */

    const out = [];
    const storey = Math.max(0, p.storey);
    const reach = Math.max(1, p.reach);
    const style = this.FALLOFFS[Math.round(p.falloff)] || this.FALLOFFS[0];
    for (const block of blocks) {
      let ring = block.cells.length > 1
        ? this.unionOf(block.cells.map(c => c.ring))
        : block.cells[0].ring;
      if (!ring) ring = block.cells[0].ring;

      if (p.inset > 0) {
        const moved = this.offsetRing(ring, p.inset);
        if (this.area(moved) * this.area(ring) > 0) ring = moved;
      }
      //! Off the grid, by at most half the gap the inset opened, so two
      //! neighbours closing on each other still cannot meet. The plazas are
      //! the other thing in the way, and they do not move.
      if (p.drift > 0 && p.inset > 0) {
        const budget = p.drift * p.inset / 2;
        const dx = (rnd() * 2 - 1) * budget, dy = (rnd() * 2 - 1) * budget;
        ring = ring.map(q => [q[0] + dx, q[1] + dy]);
      }

      //! THE HEIGHT. Uniform, give or take \p vary - that is the semi-regular
      //! massing - and then the attractor adds its bulge, measured from the
      //! mass's own middle so a long run leans as a whole rather than
      //! stepping.
      const mid = this.centre(ring);
      const away = Math.hypot(mid[0] - p.atX, mid[1] - p.atY);
      const pull = this.falloffAt(style, 1 - away / reach);
      let height = p.height + (rnd() * 2 - 1) * p.vary + p.bulge * pull;
      if (storey > 0) height = Math.round(height / storey) * storey;
      //! A mass of no height is a plot. Below one storey it is drawn flat
      //! rather than as a sliver, and a bulge of -200 m cannot push it
      //! through the ground.
      height = Math.max(0, height);
      out.push({ ring, height, run: block.cells.length, pull,
                 at: block.cells.map(c => [c.u, c.v]) });
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
      plazas.push({ ring, short: half.short, long: half.long, touching: near.length });
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
             bay, ring };
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

  build(p, k) {
    const made = this.plan(p);
    const show = Math.round(p.show);
    const parts = [];

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

    for (const block of made.blocks) {
      const wire = k.polyline(block.ring.map(q => [q[0], q[1], 0]), { closed: true });
      parts.push(show === 2 || block.height < 1
        ? k.face(wire)
        : k.prism(k.face(wire), [0, 0, block.height]));
    }
    //! The plazas are drawn flat, always: they are the thing between the
    //! buildings and a plan without them is a plan of islands.
    if (show !== 1)
      for (const plaza of made.plazas)
        parts.push(k.face(k.polyline(plaza.ring.map(q => [q[0], q[1], 0]), { closed: true })));

    //! THE ATTRACTOR, drawn where it is: a ring at its reach and a mast at
    //! its centre. A slider pair you cannot see the effect of is a slider
    //! pair nobody will touch.
    const circle = [];
    for (let i = 0; i <= 64; i++) {
      const a = i / 64 * Math.PI * 2;
      circle.push([p.atX + Math.cos(a) * p.reach, p.atY + Math.sin(a) * p.reach, 0]);
    }
    parts.push(k.polyline(circle, { closed: true }));
    parts.push(k.polyline([[p.atX, p.atY, 0],
                           [p.atX, p.atY, p.height + Math.max(0, p.bulge)]]));
    parts.push(k.polyline(this.SITE.map(q => [q[0], q[1], 0]), { closed: true }));
    return k.compound(parts);
  },
})
