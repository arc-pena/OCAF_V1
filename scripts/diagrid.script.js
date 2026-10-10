// A DIAGRID MASTERPLAN, AS ONE SCRIPT NODE.
//
// This is the source of the Script feature in docs/data/samples/diagrid_plan.json,
// kept as a file so it can be read, edited and TESTED - docs/test/diagrid.test.mjs
// evaluates this very text and measures what plan() returns. Paste it into any
// Script node and it runs; scripts/build_diagrid_sample.mjs embeds it.
//
// WHAT IT MAKES. A diamond lattice laid on a RADIAL grid fitted to the site, and
// blocks made of whole lattice units and half ones - exactly the way a macro
// shape is outlined on a diagrid by hand: three diamonds in a row, a diamond and
// two halves, a single triangle. Every block is extruded to a random number of
// storeys, up or down.
//
// THE FOUR THINGS THAT MAKE IT A MASTERPLAN AND NOT A PATTERN
//
//   The grid is fitted to the boundary, not drawn over it. \p focus puts the
//   fan's centre that far beyond the site along its own long axis, and the
//   angular and radial limits are then the site's own extent about that point -
//   so the grid always covers the site and never much more. Wind focus up and
//   the fan opens out into a parallel grid; wind it down and it closes into a
//   tight sunburst. One slider, the whole range of configurations.
//
//   Blocks merge along ONE lattice direction at a time, so a merged block is
//   always a straight run - three diamonds up the slope, four around the ring -
//   and never a chevron. The two diagonal directions share edges; the two
//   orthogonal ones meet at the diamonds' points, which is a different and
//   equally wanted thing: a line of towers touching corner to corner.
//
//   \p drift takes a block OFF the grid. Its edges stay parallel to the lattice
//   it came from, but it slides up to a fraction of a bay, so the plan reads as
//   a family of parallel lines rather than a snapped-to-nodes tiling.
//
//   \p pinch decides where blocks meet. At 0 every block is inset the same all
//   round and they are separated everywhere. At 1 the two TIPS of each block
//   stay on their lattice nodes while the sides pull in - so blocks still touch
//   at points and the gaps between them read as streets.
//
// THE SITE is the one in SiteBoundary.dxf: 44 points, 33.2 hectares, 602 x 853 m,
// in millimetres here because the document is. Replace SITE with any closed
// ring of [x, y] and everything else refits to it.
({
  params: [
    //! THE GRID
    { key: "rings", label: "Rings", def: 9, min: 2, max: 30, step: 1, unit: "" },
    { key: "spokes", label: "Bays around", def: 14, min: 2, max: 60, step: 1, unit: "" },
    //! Where the fan's centre sits, measured from the site's own middle along
    //! its long axis. 1.2 km on a 850 m site is a gentle splay; 300 m is a
    //! sunburst; 20 km is a parallel grid with a 2 degree lean.
    { key: "focus", label: "Fan centre, beyond the site", def: 1200000,
      min: 150000, max: 20000000, step: 10000 },
    { key: "bearing", label: "Turn the fan", def: 0, min: -180, max: 180, step: 1,
      unit: "°" },

    //! THE BLOCKS
    { key: "merge", label: "How often blocks merge", def: 0.55, min: 0, max: 1, step: 0.05,
      unit: "" },
    { key: "maxRun", label: "Longest run", def: 4, min: 1, max: 8, step: 1, unit: "" },
    { key: "alongRings", label: "Run around the fan →", def: 0.5, min: 0, max: 1,
      step: 0.05, unit: "" },
    { key: "triangles", label: "Halves", def: 0.25, min: 0, max: 1, step: 0.05, unit: "" },
    { key: "squares", label: "Squared", def: 0.15, min: 0, max: 1, step: 0.05, unit: "" },
    { key: "drift", label: "Off the grid", def: 0, min: 0, max: 1, step: 0.05, unit: "" },

    //! THE GAPS
    { key: "inset", label: "Street gap", def: 9000, min: 0, max: 60000, step: 500 },
    { key: "pinch", label: "Keep the tips on the nodes", def: 0.7, min: 0, max: 1,
      step: 0.05, unit: "" },
    { key: "margin", label: "Keep off the boundary", def: 12000, min: 0, max: 200000,
      step: 1000 },

    //! THE HEIGHTS
    { key: "storey", label: "Storey", def: 4000, min: 2500, max: 8000, step: 100 },
    { key: "low", label: "Fewest storeys", def: 3, min: 1, max: 60, step: 1, unit: "" },
    { key: "high", label: "Most storeys", def: 16, min: 1, max: 120, step: 1, unit: "" },
    { key: "down", label: "Share that go down", def: 0.12, min: 0, max: 1, step: 0.02,
      unit: "" },
    { key: "seed", label: "Seed", def: 7, min: 1, max: 999, step: 1, unit: "" },
    { key: "show", label: "Draw", options: ["The blocks", "Blocks and the grid",
                                            "The grid only"], def: 0 },
  ],

  //! The plot line out of SiteBoundary.dxf, in millimetres. Anti-clockwise,
  //! which the point-in-polygon below does not care about but the mitre offset
  //! does: it takes the interior to be on the left.
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

  /* ------------------------------------------------------------- the frame

     Where the fan's centre goes, and which way it looks.                   */

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

  /* ---------------------------------------------------------------- the plan

     Pure: numbers in, polygons out, no kernel. This is what the test drives. */

  plan(p) {
    const f = this.frameOf(p);
    const spokes = Math.max(1, Math.round(p.spokes));
    const ringCount = Math.max(1, Math.round(p.rings));
    const rnd = this.rng(Math.round(p.seed));
    const margin = Math.max(0, p.margin);

    //! A DIAMOND SPANS TWO BAYS AND TWO RINGS, with its four corners on the
    //! lattice at (u±1, v) and (u, v±1). That is what makes the pattern a
    //! diagrid rather than a grid: every cell is a rhomboid standing on its
    //! point, and the two halves of one are the triangles.
    const cells = new Map();
    const key = (u, v) => u + "," + v;
    for (let v = 1; v < 2 * ringCount; v++)
      for (let u = 1; u < 2 * spokes; u++) {
        if ((u + v) % 2 !== 0) continue;
        const corners = [[u + 1, v], [u, v + 1], [u - 1, v], [u, v - 1]]
          .map(([a, b]) => this.nodeAt(f, a / 2, b / 2));
        //! ANTI-CLOCKWISE, ALWAYS. Bay number increases anti-clockwise about
        //! the fan's centre and ring number increases outwards, which is a
        //! LEFT-handed pair: taken in order the corners come out clockwise,
        //! every inward normal in offsetRing would point outward, and the
        //! street gap would make the blocks bigger.
        if (this.area(corners) < 0) corners.reverse();
        //! INSIDE MEANS ALL FOUR CORNERS INSIDE, and far enough off the line.
        //! Testing the centre only puts half a block over the pavement, which
        //! on a 33 hectare site is four or five of them.
        let ok = true;
        for (const c of corners)
          if (!this.inside(this.SITE, c) || this.awayFrom(this.SITE, c) < margin) {
            ok = false; break;
          }
        if (ok) cells.set(key(u, v), { u, v, corners });
      }

    /* ------------------------------------------------------------- merging

       A run goes one way and keeps going. The two diagonal steps share an
       edge, so those runs fuse into one polygon; the two orthogonal steps
       meet at the diamonds' points, so those stay separate polygons that
       happen to touch - which is the line of towers, and is why a block holds
       a LIST of rings rather than one.                                      */

    const DIRS = [[1, 1, "edge"], [1, -1, "edge"], [2, 0, "point"], [0, 2, "point"]];
    const used = new Set();
    const order = [...cells.values()];
    for (let i = order.length - 1; i > 0; i--) {         // seeded shuffle
      const j = Math.floor(rnd() * (i + 1));
      const t = order[i]; order[i] = order[j]; order[j] = t;
    }

    const blocks = [];
    for (const cell of order) {
      if (used.has(key(cell.u, cell.v))) continue;
      let want = 1;
      if (rnd() < p.merge) want = 2 + Math.floor(rnd() * Math.max(0, Math.round(p.maxRun) - 1));
      //! The direction. alongRings leans between the two that run around the
      //! fan and the two that run out along it; which of each pair is a coin.
      const around = rnd() < p.alongRings;
      const pair = around ? [DIRS[0], DIRS[2]] : [DIRS[1], DIRS[3]];
      const dir = pair[rnd() < 0.5 ? 0 : 1];
      const run = [cell];
      used.add(key(cell.u, cell.v));
      //! BOTH WAYS ALONG THE LINE. Forwards only, a seed whose neighbour has
      //! already gone stops at one - and because runs eat their neighbours in
      //! clumps, that happened to two attempts in three: asking for 55% merged
      //! gave 14 merged blocks out of 81. Growing backwards as well is still
      //! one straight line, and it is the difference between a plan of
      //! single cells and a plan of bars.
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
      blocks.push({ cells: run, joint: dir[2] });
    }

    /* -------------------------------------------------------- shaping each

       A block is whole units and half ones. A single cell may be a half (a
       triangle) or squared; a run may end in a half, which is the pointed
       termination you draw when a macro shape runs out mid-diamond.         */

    const out = [];
    for (const block of blocks) {
      const shaped = [];
      const n = block.cells.length;
      block.cells.forEach((cell, i) => {
        let ring = cell.corners;
        const last = i === n - 1 && n > 1;
        if (n === 1) {
          const roll = rnd();
          if (roll < p.triangles) ring = this.halfOf(ring, rnd());
          else if (roll < p.triangles + p.squares) ring = this.squareOf(ring);
        } else if (last && rnd() < p.triangles) {
          ring = this.halfOf(ring, rnd());
        }
        shaped.push(ring);
      });

      //! Edge-joined runs of WHOLE cells become one polygon; anything else
      //! stays as its parts. See unionOf for why that is exact here.
      let polys = shaped;
      if (block.joint === "edge" && n > 1 && shaped.every(r => r.length === 4)) {
        const fused = this.unionOf(shaped);
        if (fused) polys = [fused];
      }

      //! THE GAP, and where it is not taken. The two vertices furthest from
      //! the block's middle are its tips; \p pinch holds them where they are,
      //! so neighbouring blocks still meet there while their sides open up
      //! into streets.
      if (p.inset > 0) {
        polys = polys.map(ring => {
          const mid = this.centre(ring);
          const far = ring.map(q => Math.hypot(q[0] - mid[0], q[1] - mid[1]));
          const sorted = far.slice().sort((a, b) => b - a);
          const tip = sorted.length > 1 ? sorted[1] - 1 : Infinity;
          const dists = far.map(d => p.inset * (d >= tip ? 1 - p.pinch : 1));
          const moved = this.offsetRing(ring, dists);
          //! An inset bigger than the block turns it inside out. Measured
          //! rather than assumed: the sign of the area says so, and a block
          //! that has eaten itself is dropped instead of drawn knotted.
          return this.area(moved) * this.area(ring) > 0 ? moved : null;
        }).filter(Boolean);
      }
      if (!polys.length) continue;

      //! OFF THE GRID. The whole block slides, so its edges stay parallel to
      //! the lattice and only its position stops being a node - which is the
      //! point: a family of parallel lines rather than a snapped tiling.
      //!
      //! THE BUDGET IS THE GAP THE INSET LEFT, and that is not a stylistic
      //! choice. A drift measured against the bay (90 m here) walks blocks
      //! straight through their neighbours.
      //!
      //! And the gap is NOT the inset: \p pinch holds the tips back, so where
      //! two blocks meet at a node the clearance between them is only
      //! 2(1-pinch) x inset, and a budget that ignored that overlapped a pair
      //! at pinch 0.7 - one pair in ninety, which is exactly the kind of
      //! thing nobody sees in a plan. So drift spends the slack pinch leaves,
      //! and at pinch 1 there is none: holding the tips on the nodes and
      //! sliding off the grid are opposite instructions.
      if (p.drift > 0 && p.inset > 0 && p.pinch < 1) {
        const budget = p.drift * (1 - p.pinch) * p.inset / 2;
        const dx = (rnd() * 2 - 1) * budget, dy = (rnd() * 2 - 1) * budget;
        polys = polys.map(r => r.map(q => [q[0] + dx, q[1] + dy]));
      }

      //! THE HEIGHT, in whole storeys, up or down.
      const low = Math.min(Math.round(p.low), Math.round(p.high));
      const high = Math.max(Math.round(p.low), Math.round(p.high));
      const storeys = low + Math.floor(rnd() * (high - low + 1));
      const sign = rnd() < p.down ? -1 : 1;
      //! WHICH CELLS IT IS MADE OF, handed back with it. Not needed to draw
      //! anything - it is what lets the test state the straightness claim
      //! exactly, in lattice steps, rather than inferring it from a polygon
      //! that the street gap has already rounded off.
      out.push({ polys, storeys, height: sign * storeys * p.storey, run: n,
                 joint: block.joint, at: block.cells.map(c => [c.u, c.v]) });
    }
    return { blocks: out, frame: f, cells: cells.size };
  },

  //! One of the four half-diamonds: the triangle on one side of one diagonal.
  halfOf(ring, roll) {
    const pick = Math.floor(roll * 4) % 4;
    const [e, n, w, s] = ring;                       // as built: +u, +v, -u, -v
    return [[e, n, w], [e, s, w], [n, e, s], [n, w, s]][pick];
  },

  //! The diamond squared: the quad through the midpoints of its four sides,
  //! which on a rhomboid is a parallelogram and on a square-ish bay is the
  //! square the user drew. Always inside the cell, so it never overlaps a
  //! neighbour.
  squareOf(ring) {
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    return [mid(ring[0], ring[1]), mid(ring[1], ring[2]),
            mid(ring[2], ring[3]), mid(ring[3], ring[0])];
  },

  /* THE UNION OF CELLS THAT SHARE EDGES, by cancelling the shared ones.
     Exact here and only here: every cell's corners are lattice nodes, so two
     neighbours' shared edge is the same pair of points in opposite order, and
     what is left after the pairs cancel is the outline. A general polygon
     union would be a thousand lines and would not be any more right.      */
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
      if (next.has(a)) return null;                  // not a simple outline
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
    const parts = [];
    const show = Math.round(p.show);

    if (show !== 2) {
      for (const block of made.blocks)
        for (const ring of block.polys) {
          const wire = k.polyline(ring.map(q => [q[0], q[1], 0]), { closed: true });
          //! A block of no height is a plot, not a building: the face on its
          //! own is the right answer and prism would refuse a zero vector.
          parts.push(Math.abs(block.height) < 1
            ? k.face(wire)
            : k.prism(k.face(wire), [0, 0, block.height]));
        }
    }
    if (show !== 0) {
      //! The lattice itself, as lines on the ground - what the blocks were cut
      //! from. Drawn from the same frame, so it cannot drift out of step with
      //! them.
      const f = made.frame;
      const spokes = Math.max(1, Math.round(p.spokes));
      const rings = Math.max(1, Math.round(p.rings));
      for (let u = 0; u <= spokes; u++)
        parts.push(k.polyline([this.nodeAt(f, u, 0), this.nodeAt(f, u, rings)]
          .map(q => [q[0], q[1], 0])));
      for (let v = 0; v <= rings; v++) {
        const run = [];
        for (let u = 0; u <= spokes * 4; u++) run.push(this.nodeAt(f, u / 4, v));
        parts.push(k.polyline(run.map(q => [q[0], q[1], 0])));
      }
    }
    //! The boundary always, because a plan you cannot see the edge of is a
    //! pattern.
    parts.push(k.polyline(this.SITE.map(q => [q[0], q[1], 0]), { closed: true }));
    return k.compound(parts);
  },
})
