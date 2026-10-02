// The arithmetic a retail atrium is laid out by. No kernel, no DOM.
//
// WHAT THIS IS FOR. Look at a photograph of a mall atrium and almost nothing in
// it is a curved surface. The slabs are FLAT - dead flat, one level, one
// thickness - and what sweeps is their EDGE: a plan curve, and a section run
// along it. The cladding band under the handrail, the balustrade, the shopfront
// behind it and the soffit above are the same plan curve with four different
// sections on it. So the whole of the geometry below is two things: curves in
// plan, and sections in a plane. Everything else is a sweep.
//
// The one genuinely doubly-curved thing is the roof, and even that is a
// network: thick walkable structural members on a paraboloid, with an inflated
// ETFE cushion in every cell the network leaves. The cells are a Voronoi
// tessellation, which is what gives the pattern its "grown" look - cells of
// even area and uneven shape - and it is computed here rather than drawn.
//
// WHAT IS COMPUTED AND WHAT IS A CHOICE. The Voronoi is exact: each cell is the
// bounding region clipped by one half-plane per other seed, which is the
// definition of a Voronoi cell rather than an approximation of one. Lloyd
// relaxation is the published algorithm and it is run a stated number of times.
// The parabola is a parabola. Everything else on this page - how deep a slab
// edge is, how far back a balustrade stands, what a cushion rises to - is a
// DIMENSION somebody sets, and this module only does arithmetic with it.

/* ================================================== the plan curve, as a sketch

   THE ATRIUM VOID IS A PARABOLA EACH SIDE. Not a circle, not an ellipse, not a
   free spline: the two long edges of the void are parabolas facing away from
   each other and meeting at a blunt nose at each end. One number opens it in
   the middle, one holds the ends apart, and one says how fast it fills out.

   Which matters because every other curve in the model is this one offset:
   the balustrade is it set back, the shopfront is it set back further, and the
   slab's outer boundary is it offset by the gallery's width. Change the void
   and the whole floor plate follows, which is the point of drawing it once. */

//! The half width of the void at a station t in -1..1 along its length. At the
//! middle this is `wide`; at either end it is `ends`; `fullness` is the power -
//! 2 is the parabola, 1 is a straight taper, and above 2 the sides run straight
//! for longer and turn harder at the ends.
export const voidHalfWidth = (t, wide, ends, fullness = 2) =>
  ends + (wide - ends) * (1 - Math.pow(Math.abs(t), fullness));

//! A closed loop resampled so its points are EVENLY SPACED along it. Which is
//! not housekeeping: the curve these become is a Catmull-Rom parameterised by
//! INDEX, and a uniform parameterisation through unevenly spaced points
//! overshoots - the shorter the span either side of a point, the harder the
//! curve whips past it.
//!
//! Measured, on this void. Laid out by station - 24 even steps in t down each
//! parabola, then a nose - the points crowd where the parabola turns and the
//! fitted spline bulges to 128 x 61 m where the polygon through the same points
//! is 96 x 24. Swept with a 2.5 m section that came out 1.4 KILOMETRES across,
//! because a sweep amplifies every loop the rail makes. The same points as a
//! POLYLINE were right all along, which is what said it was the fit and not the
//! geometry.
export function resampleLoop(loop, count) {
  const n = Math.max(3, Math.round(count));
  if (loop.length < 3) return loop;
  const lengths = [0];
  for (let i = 1; i <= loop.length; i++) {
    const a = loop[i - 1], b = loop[i % loop.length];
    lengths.push(lengths[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = lengths[lengths.length - 1];
  if (!(total > 0)) return loop;
  const out = [];
  let at = 1;
  for (let i = 0; i < n; i++) {
    const want = (total * i) / n;
    while (at < lengths.length - 1 && lengths[at] < want) at++;
    const back = lengths[at] - lengths[at - 1];
    const f = back > 1e-12 ? (want - lengths[at - 1]) / back : 0;
    const a = loop[at - 1], b = loop[at % loop.length];
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
  }
  return out;
}

//! The void as a closed loop of points in plan, centred on the origin with its
//! length along x: down one parabola, round the nose, back along the other, and
//! round the far nose.
//!
//! THE NOSE IS A HALF ELLIPSE, not a corner and not a guess. The two parabolas
//! arrive at the end station `ends` apart and leaning in, and left to meet there
//! the void ends in a crease; carried round on a half ellipse of `ends` by
//! `ends x nose` they meet with a blunt end whose depth is a number somebody
//! sets. Nose 0 is a flat end, 1 is a half round.
export function parabolicVoid({ length = 90000, wide = 12000, ends = 5000,
                                fullness = 2, stations = 24, nose = 0.6 } = {}) {
  const half = length / 2;
  const bulge = Math.max(0, ends * nose);
  //! Laid out densely first and resampled after, because what the spline wants
  //! is even spacing and what the SHAPE wants is a parabola and an ellipse.
  const fine = 160, round = 48;
  const dense = [];
  const side = sign => {
    for (let i = 0; i <= fine; i++) {
      const t = sign > 0 ? -1 + (2 * i) / fine : 1 - (2 * i) / fine;
      dense.push([t * half, sign * voidHalfWidth(t, wide, ends, fullness)]);
    }
  };
  side(1);
  for (let i = 1; i < round; i++) {
    const a = (Math.PI * i) / round;
    dense.push([half + bulge * Math.sin(a), ends * Math.cos(a)]);
  }
  side(-1);
  for (let i = 1; i < round; i++) {
    const a = (Math.PI * i) / round;
    dense.push([-half - bulge * Math.sin(a), -ends * Math.cos(a)]);
  }
  return resampleLoop(dense, Math.max(8, Math.round(stations)) * 2);
}

//! A LOOP OFFSET BY A DISTANCE, IN ARITHMETIC. Every rail in an atrium is the
//! void set back by something - the balustrade a little, the shopfront a
//! corridor, the facade over the shops the same again - so this is the move the
//! whole plan is laid out by, and it is done here rather than asked of the
//! kernel.
//!
//! WHY NOT THE KERNEL'S OFFSET. Measured, on this void. OpenCascade offsets the
//! fitted spline into a polycurve of 225 EDGES - arcs and lines, joined at best
//! tangentially - and sweeping a section along that overflowed the JavaScript
//! stack outright. Re-fitting it to one spline fixed that, and then the fit
//! itself became the problem: through 240 points it was right, through 400 it
//! followed the joins between those 225 edges, span into curvature spikes, and
//! swept into a shape 782 METRES tall. A rail whose correctness depends on how
//! finely it was sampled is not a rail.
//!
//! Widening the parabola instead - adding the setback to both half widths - is
//! exact at mid span and at the ends and wrong by up to 4.9 m round the noses,
//! which in a 9 m corridor is most of it.
//!
//! So: move every point along its own bisector, mitred so the perpendicular
//! distance is exactly the offset at every point including the corners. A void
//! is convex, being two parabolas and two half ellipses, so an outward offset of
//! it cannot cross itself, and the result is an evenly spaced point list that
//! fits to ONE clean spline - which is what the sweep wanted all along.
export function offsetLoop(loop, distance, closed = true) {
  const n = loop.length;
  if (n < 3 || Math.abs(distance) < 1e-9) return loop;
  //! WHICH WAY IS OUT. For a loop running anticlockwise the outward normal is
  //! the RIGHT of travel; clockwise, the left. Measured off the loop rather than
  //! assumed, because which way round a curve runs is decided by the order
  //! somebody drew it in.
  const way = signedLoopArea(loop) >= 0 ? -1 : 1;
  const unit = (ax, ay) => {
    const d = Math.hypot(ax, ay);
    return d > 1e-12 ? [ax / d, ay / d] : [0, 0];
  };
  const out = [];
  for (let i = 0; i < n; i++) {
    const p = loop[i];
    const prev = loop[(i - 1 + n) % n], next = loop[(i + 1) % n];
    const back = closed || i > 0 ? unit(p[0] - prev[0], p[1] - prev[1]) : null;
    const on = closed || i < n - 1 ? unit(next[0] - p[0], next[1] - p[1]) : null;
    //! An edge's own outward normal is its tangent turned a quarter turn the
    //! way `way` says.
    const normalOf = t => [way * -t[1], way * t[0]];
    const a = back ? normalOf(back) : null, b = on ? normalOf(on) : null;
    let nx, ny;
    if (a && b) { nx = a[0] + b[0]; ny = a[1] + b[1]; }
    else if (a) { nx = a[0]; ny = a[1]; }
    else { nx = b[0]; ny = b[1]; }
    const bis = unit(nx, ny);
    //! MITRED. The bisector is shorter than the offset by the cosine of half the
    //! turn, so a corner offset along the plain bisector pulls in - which on a
    //! blunt nose, where the turn is sharpest, is exactly where it shows.
    const reference = a || b;
    const cos = bis[0] * reference[0] + bis[1] * reference[1];
    const reach = distance / (Math.abs(cos) > 0.2 ? cos : 0.2);
    out.push([p[0] + bis[0] * reach, p[1] + bis[1] * reach]);
  }
  //! Resampled afterwards, because an offset crowds the points on the outside of
  //! a turn and spreads them on the inside - and even spacing is the whole
  //! reason the fit through them behaves.
  return closed ? resampleLoop(out, n) : out;
}

//! ONE SIDE OF THE VOID, AS AN OPEN RUN. Which is not a convenience: the two
//! sides of a mall atrium get different buildings. Galleries wrap the whole
//! void, but the flush facade over the shops on one side has no corridor in
//! front of it and stops where that side stops - so it needs a rail that is one
//! parabola and not a loop, and an offset of a loop is still a loop.
//!
//! `side` is +1 for the one at positive y and -1 for the other, and the run goes
//! from nose to nose the way the loop does.
export function parabolicSide({ length = 90000, wide = 12000, ends = 5000,
                                fullness = 2, stations = 24, side = 1 } = {}) {
  const half = length / 2;
  const way = side < 0 ? -1 : 1;
  const fine = 160;
  const dense = [];
  for (let i = 0; i <= fine; i++) {
    const t = way > 0 ? -1 + (2 * i) / fine : 1 - (2 * i) / fine;
    dense.push([t * half, way * voidHalfWidth(t, wide, ends, fullness)]);
  }
  //! Resampled evenly for the same reason the loop is - a fit through crowded
  //! points overshoots - but as an OPEN run, so the last station is the end and
  //! not one step short of coming back round.
  const n = Math.max(4, Math.round(stations));
  const out = [];
  const lengths = [0];
  for (let i = 1; i < dense.length; i++)
    lengths.push(lengths[i - 1]
      + Math.hypot(dense[i][0] - dense[i - 1][0], dense[i][1] - dense[i - 1][1]));
  const total = lengths[lengths.length - 1];
  let at = 1;
  for (let i = 0; i <= n; i++) {
    const want = (total * i) / n;
    while (at < lengths.length - 1 && lengths[at] < want) at++;
    const back = lengths[at] - lengths[at - 1];
    const f = back > 1e-12 ? (want - lengths[at - 1]) / back : 0;
    const a = dense[at - 1], b = dense[at];
    out.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
  }
  return out;
}

//! The area a closed plan loop encloses, by the shoelace sum. Used to check a
//! void against the floor plate it is cut out of, and to find a cell's centre.
export function signedLoopArea(loop) {
  let sum = 0;
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i], b = loop[(i + 1) % loop.length];
    sum += a[0] * b[1] - b[0] * a[1];
  }
  return sum / 2;
}

export const loopArea = loop => Math.abs(signedLoopArea(loop));

export function loopCentroid(loop) {
  let cx = 0, cy = 0, twice = 0;
  for (let i = 0; i < loop.length; i++) {
    const a = loop[i], b = loop[(i + 1) % loop.length];
    const cross = a[0] * b[1] - b[0] * a[1];
    twice += cross;
    cx += (a[0] + b[0]) * cross;
    cy += (a[1] + b[1]) * cross;
  }
  if (Math.abs(twice) < 1e-12) {
    const n = loop.length || 1;
    return [loop.reduce((s, p) => s + p[0], 0) / n, loop.reduce((s, p) => s + p[1], 0) / n];
  }
  return [cx / (3 * twice), cy / (3 * twice)];
}

/* ===================================================== the sections, in a plane

   Each of these is a section in the sweeping plane, in (across, up), with the
   origin AT THE SLAB EDGE ON THE WALKING LEVEL - the one point every section in
   an atrium is actually dimensioned from. ACROSS IS POSITIVE AWAY FROM THE VOID,
   into the floor plate; up is positive upwards.

   AND THEY COME BACK AS TWO CHAINS, not as one outline. A section here is swept
   along a horizontal plan curve, so every one of them is either a PRISM - two
   across values and a height, which is a plan ring extruded straight up - or a
   TAPER, where the across value changes with height, which is a stack of plan
   rings lofted. Written as one closed outline instead, the only way to build it
   is to pipe the outline along the rail, and that is what this package spent an
   afternoon finding out does not hold up: see planSolid in atrium-plugin.js. */

//! A prismatic part: a ring between two across values, from one height to
//! another. The glass, the capping rail, the shoe, the signage band, the sill -
//! everything in an atrium except the slab edge itself.
const prism = (from, to, inner, outer) =>
  ({ across: [Math.min(inner, outer), Math.max(inner, outer)],
     from: Math.min(from, to), to: Math.max(from, to) });

//! THE SLAB EDGE, which is the band you see from across the void and the thing
//! this whole model is about. A floor plate 1.5 m deep, clad to its edge, and
//! the cladding turned under in a SHARP BEVEL rather than a radius - which is
//! what gives the band its hard shadow line along the bottom and is the detail
//! that reads from thirty metres away.
//!
//!   (0,0) ._________________  back
//!         |                 |
//!         |   face          |   depth
//!         |                 |
//!   bevel  \________________|
//!
//! The two chains are the two faces of it: `face` is the one looking into the
//! void, vertical and then chamfered back; `back` is the one meeting the flat
//! plate. Each runs top to bottom.
export function slabEdgeSection({ depth = 1500, bevel = 350, back = 2500,
                                  upstand = 0 } = {}) {
  const d = Math.max(50, depth);
  const b = Math.max(0, Math.min(bevel, d - 50, back - 50));
  const k = Math.max(b + 50, back);
  const u = Math.max(0, upstand);
  return {
    face: [[0, u], [0, -(d - b)], [b, -d]],
    back: [[k, u], [k, -(d - b)], [k, -d]],
    depth: d, bevel: b, reach: k,
  };
}

//! THE BALUSTRADE, as the three things it is really made of. Frameless
//! structural glass standing in a shoe at the slab edge, with a capping rail
//! along the top of it. Three parts rather than one outline because they are
//! three materials and get three finishes: a balustrade drawn as one solid is a
//! balustrade you cannot see through, which is the entire point of a glass one.
export function balustradeSections({ height = 1100, glass = 21, setback = 120,
                                     railWidth = 90, railDepth = 55,
                                     shoe = 180, shoeHeight = 150 } = {}) {
  const h = Math.max(300, height);
  const t = Math.max(6, glass) / 2;
  const x = Math.max(0, setback);
  const rw = Math.max(t * 2, railWidth) / 2, rh = Math.max(10, railDepth);
  const sw = Math.max(t * 2, shoe) / 2, sh = Math.max(0, shoeHeight);
  return {
    //! The glass runs from inside its shoe up INTO the rail, not up to it: a
    //! capping rail that only touches the top edge of the glass is a capping
    //! rail that comes off.
    glass: prism(sh * 0.5, h - rh * 0.5, x - t, x + t),
    rail: prism(h - rh, h, x - rw, x + rw),
    shoe: sh > 0 ? prism(0, sh, x - sw, x + sw) : null,
    height: h,
  };
}

//! A SHOPFRONT, OR ANY OTHER GLAZED WALL ON A CURVE. The mullion is a box at a
//! station, the glass is a thin ring between the mullions, and the head carries
//! a signage band - which in a mall is not decoration, it is how the elevation
//! is divided.
export function shopfrontSections({ height = 4200, glass = 32, mullion = 90,
                                    depth = 180, band = 700, sill = 0 } = {}) {
  const h = Math.max(500, height);
  const b = Math.max(0, Math.min(band, h - 200));
  const s = Math.max(0, Math.min(sill, h - b - 100));
  const g = Math.max(6, glass) / 2, m = Math.max(g * 2, mullion) / 2;
  const d = Math.max(m * 2, depth);
  return {
    glass: prism(s, h - b, -g, g),
    //! The band is the full depth of the mullion zone, because it is a box of
    //! signage hung on the front of the slab rather than a sticker on the glass.
    band: b > 0 ? prism(h - b, h, -d / 2, d / 2) : null,
    sill: s > 0 ? prism(0, s, -d / 2, d / 2) : null,
    mullion: { half: m, depth: d, from: s, to: h - b },
    height: h, band_: b,
  };
}

//! WHERE THE MULLIONS GO. Not "every 1500 from one end", which leaves whatever
//! is left over as a stub bay at the other - a shopfront is set out so the bays
//! are equal and the pitch is whatever that makes it.
export function mullionStations(total, pitch) {
  const length = Math.max(0, total);
  const want = Math.max(50, pitch);
  const bays = Math.max(1, Math.round(length / want));
  const step = length / bays;
  const at = [];
  for (let i = 0; i <= bays; i++) at.push(i * step);
  return { at, step, bays };
}

/* ================================================= the roof, and its cells

   A THICK WALKABLE NETWORK WITH A CUSHION IN EVERY CELL. The surface is a
   paraboloid over an elliptical plan - one rise, two spans - and the network on
   it is the Voronoi tessellation of a relaxed set of seeds. Voronoi because the
   cells come out even in AREA and uneven in SHAPE, which is what a structural
   net wants and what the pattern reads as; a hexagonal grid reads as a grid. */

//! The height of the roof surface over a plan point, and the surface normal
//! there. A paraboloid: z = rise (1 - u^2 - v^2) on u = 2x/length, v = 2y/width,
//! so the crown is at the centre and the springing is the ellipse u^2+v^2 = 1.
export function roofDome({ length = 90000, width = 30000, rise = 9000,
                           base = 0 } = {}) {
  const a = Math.max(1, length) / 2, b = Math.max(1, width) / 2;
  const lift = (x, y) => base + rise * (1 - (x * x) / (a * a) - (y * y) / (b * b));
  //! The normal of z = f(x,y) is (-df/dx, -df/dy, 1) normalised. Written out
  //! rather than sampled, because a sampled normal on a shallow dome is mostly
  //! sampling error.
  const normal = (x, y) => {
    const fx = (-2 * rise * x) / (a * a), fy = (-2 * rise * y) / (b * b);
    const n = [-fx, -fy, 1];
    const len = Math.hypot(n[0], n[1], n[2]);
    return [n[0] / len, n[1] / len, n[2] / len];
  };
  const inside = (x, y) => (x * x) / (a * a) + (y * y) / (b * b) <= 1;
  return { lift, normal, inside, a, b, rise, base };
}

//! An ellipse as a closed polygon, which is the bounding region the cells are
//! clipped to - the roof's own springing line.
export function ellipseLoop(a, b, steps = 72) {
  const n = Math.max(8, Math.round(steps));
  const loop = [];
  for (let i = 0; i < n; i++) {
    const th = (2 * Math.PI * i) / n;
    loop.push([a * Math.cos(th), b * Math.sin(th)]);
  }
  return loop;
}

//! A convex polygon clipped to the half-plane nearer `a` than `b` - which is to
//! say, cut by the perpendicular bisector of ab. Sutherland-Hodgman against one
//! line. This single function IS the Voronoi: a cell is its region clipped by
//! one of these for every other seed, and that is the definition rather than an
//! approximation of it.
export function clipToward(poly, a, b) {
  //! The bisector as a line: points p with n.p <= c are on a's side, where n is
  //! b - a and c is n . (a+b)/2.
  const nx = b[0] - a[0], ny = b[1] - a[1];
  const c = (nx * (a[0] + b[0]) + ny * (a[1] + b[1])) / 2;
  const side = p => nx * p[0] + ny * p[1] - c;
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const sp = side(p), sq = side(q);
    if (sp <= 0) out.push(p);
    if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) {
      const t = sp / (sp - sq);
      out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
    }
  }
  return out;
}

//! The Voronoi cells of a set of seeds inside a convex boundary. O(n^2) and
//! exact, which for the hundred-odd cells a roof has is the right trade: a
//! Delaunay triangulation would be faster and would have to be right about
//! degenerate cases that a clip simply does not have.
export function voronoi(seeds, boundary) {
  return seeds.map(seed => {
    let cell = boundary;
    for (const other of seeds) {
      if (other === seed) continue;
      if (cell.length < 3) break;
      cell = clipToward(cell, seed, other);
    }
    return cell;
  });
}

//! Lloyd's algorithm: move every seed to the centre of its own cell and do it
//! again. Two or three rounds is what turns a scatter into a net of even cells
//! while leaving the shapes irregular; run it to convergence and it tends to a
//! hexagonal grid, which is exactly what this pattern is not supposed to be.
export function lloyd(seeds, boundary, rounds = 2) {
  let at = seeds;
  for (let r = 0; r < Math.max(0, rounds); r++)
    at = voronoi(at, boundary).map((cell, i) =>
      cell.length >= 3 ? loopCentroid(cell) : at[i]);
  return at;
}

//! A reproducible scatter. A roof that comes out differently every time it is
//! opened is not a model of anything, so the seed is an argument and the
//! generator is written here rather than taken from Math.random.
export function scatter(count, a, b, seed = 1) {
  let state = (seed >>> 0) || 1;
  const next = () => {
    //! xorshift32 - four lines, no library, and the same numbers on every
    //! machine, which is the only property this needs.
    state ^= state << 13; state >>>= 0;
    state ^= state >>> 17;
    state ^= state << 5; state >>>= 0;
    return state / 4294967296;
  };
  const out = [];
  let guard = 0;
  while (out.length < Math.max(1, count) && guard++ < count * 200) {
    const x = (next() * 2 - 1) * a, y = (next() * 2 - 1) * b;
    if ((x * x) / (a * a) + (y * y) / (b * b) <= 0.98) out.push([x, y]);
  }
  return out;
}

//! The cells of a roof, in plan: scattered, relaxed, and clipped to the
//! springing ellipse. One call, so the structure and the cushions cannot
//! disagree about where a cell is.
export function roofCells({ length = 90000, width = 30000, count = 70,
                            seed = 7, relax = 2, steps = 72 } = {}) {
  const a = Math.max(1, length) / 2, b = Math.max(1, width) / 2;
  const boundary = ellipseLoop(a, b, steps);
  const seeds = lloyd(scatter(count, a, b, seed), boundary, relax);
  return voronoi(seeds, boundary).filter(cell => cell.length >= 3);
}

//! THE EDGES OF THE NET, EACH ONE ONCE. Two cells share a wall, and a structure
//! built per cell builds every member twice - which doubles the steel, doubles
//! the triangles and leaves two coincident faces for the renderer to flicker
//! between. Keyed on the rounded midpoint, which is the one thing the two cells
//! agree on exactly.
export function netEdges(cells, tolerance = 1) {
  const seen = new Map();
  for (const cell of cells)
    for (let i = 0; i < cell.length; i++) {
      const p = cell[i], q = cell[(i + 1) % cell.length];
      if (Math.hypot(q[0] - p[0], q[1] - p[1]) < tolerance) continue;
      const key = [Math.round((p[0] + q[0]) / (2 * tolerance)),
                   Math.round((p[1] + q[1]) / (2 * tolerance))].join(",");
      if (!seen.has(key)) seen.set(key, [p, q]);
    }
  return [...seen.values()];
}

//! Every junction in the net, once. Where three or more members meet there has
//! to be something filling the corner, or the net is a pile of beams with gaps
//! at every node.
export function netNodes(cells, tolerance = 1) {
  const seen = new Map();
  for (const cell of cells)
    for (const p of cell) {
      const key = [Math.round(p[0] / tolerance), Math.round(p[1] / tolerance)].join(",");
      if (!seen.has(key)) seen.set(key, p);
    }
  return [...seen.values()];
}

//! A convex polygon pulled in by a distance, for the opening a cushion sits in.
//! Convex is not an assumption here - a Voronoi cell IS convex, being an
//! intersection of half-planes - so each edge can be moved in along its own
//! inward normal and the corners found by intersecting the neighbours.
export function insetConvex(poly, distance) {
  const n = poly.length;
  if (n < 3 || distance <= 0) return poly;
  const centre = loopCentroid(poly);
  const lines = [];
  for (let i = 0; i < n; i++) {
    const p = poly[i], q = poly[(i + 1) % n];
    const ex = q[0] - p[0], ey = q[1] - p[1];
    const len = Math.hypot(ex, ey);
    if (len < 1e-9) continue;
    //! The inward normal is whichever of the two points at the centroid, which
    //! is inside a convex polygon by construction.
    let nx = -ey / len, ny = ex / len;
    if (nx * (centre[0] - p[0]) + ny * (centre[1] - p[1]) < 0) { nx = -nx; ny = -ny; }
    lines.push({ nx, ny, c: nx * p[0] + ny * p[1] + distance });
  }
  if (lines.length < 3) return poly;
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const a = lines[i], b = lines[(i + 1) % lines.length];
    const det = a.nx * b.ny - b.nx * a.ny;
    if (Math.abs(det) < 1e-12) continue;
    out.push([(a.c * b.ny - b.c * a.ny) / det, (a.nx * b.c - b.nx * a.c) / det]);
  }
  //! AN INSET THAT HAS EATEN THE POLYGON STILL PRODUCES CORNERS, and that is the
  //! trap. Intersecting the moved-in edge lines pairwise always gives points: a
  //! 10 square inset by 4.9 gives a tidy 0.2 square at the middle, and inset by
  //! 5.1 gives ANOTHER tidy 0.2 square at the middle - same size, same winding,
  //! same positive area, and empty. Area cannot tell them apart and neither can
  //! the sign; both were tried. What tells them apart is the definition: a
  //! corner of the inset belongs to it only if it is on the inner side of EVERY
  //! one of the lines, and at 5.1 not one of the four is. Left to pass, a cell
  //! narrower than twice the web it is cut from lofts into a cushion turned
  //! inside out, which renders perfectly and is a hole in the roof.
  if (out.length < 3) return null;
  const scale = Math.sqrt(Math.abs(signedLoopArea(poly))) || 1;
  const slack = scale * 1e-7;
  const held = out.every(p =>
    lines.every(l => l.nx * p[0] + l.ny * p[1] - l.c >= -slack));
  return held && loopArea(out) > 0 ? out : null;
}

//! A CUSHION'S RINGS. An ETFE cushion is two foils clamped at the same
//! perimeter and inflated, so in section it is a lens: widest at the clamp line
//! and swelling both ways. Given the opening it sits in, this is the ladder of
//! rings a loft through them makes that lens - scaled about the opening's own
//! centre, which is what keeps a cushion inside an irregular cell.
export function cushionRings(opening, { rise = 900, drop = 650, rings = 2 } = {}) {
  const centre = loopCentroid(opening);
  const at = (scale, z) => ({
    z, loop: opening.map(p => [centre[0] + (p[0] - centre[0]) * scale,
                               centre[1] + (p[1] - centre[1]) * scale]),
  });
  const n = Math.max(1, Math.round(rings));
  const out = [];
  //! Below the clamp line, smallest first - a loft wants its sections in the
  //! order they occur along the run and OpenCascade orders them by where they
  //! sit, so a ring out of order is a cushion with a kink in it.
  for (let i = n; i >= 1; i--) {
    const f = i / (n + 1);
    out.push(at(Math.cos((f * Math.PI) / 2), -drop * Math.sin((f * Math.PI) / 2)));
  }
  out.push(at(1, 0));
  for (let i = 1; i <= n; i++) {
    const f = i / (n + 1);
    out.push(at(Math.cos((f * Math.PI) / 2), rise * Math.sin((f * Math.PI) / 2)));
  }
  return out;
}

/* ====================================================== what the model reports */

//! The storeys of the atrium, as a list, from one floor-to-floor and one count.
//! Retail and the floors above it are different heights in every mall ever
//! built, so both are arguments and the list is the answer.
export function storeys({ ground = 0, retail = 6000, retailFloors = 2,
                          upper = 4500, upperFloors = 3 } = {}) {
  const out = [{ level: 0, z: ground, kind: "concourse" }];
  let z = ground;
  for (let i = 1; i <= Math.max(0, retailFloors); i++) {
    z += retail;
    out.push({ level: out.length, z, kind: "gallery" });
  }
  for (let i = 1; i <= Math.max(0, upperFloors); i++) {
    z += upper;
    out.push({ level: out.length, z, kind: "flush" });
  }
  return out;
}

//! The area of gallery a level gains, which is the number a retail scheme is
//! actually judged on: the plate out to the shopfront line, less the void.
export function galleryArea(voidLoop, width) {
  const inner = loopArea(voidLoop);
  //! A ring of constant width round a loop of perimeter P and area A has area
  //! P*w + pi*w^2 for a convex loop - but a void is not convex, so this is the
  //! offset loop's area less the void's, and the offset loop is what the caller
  //! has. Given only a width, the perimeter form is the honest estimate and is
  //! said to be one.
  let perimeter = 0;
  for (let i = 0; i < voidLoop.length; i++) {
    const a = voidLoop[i], b = voidLoop[(i + 1) % voidLoop.length];
    perimeter += Math.hypot(b[0] - a[0], b[1] - a[1]);
  }
  return { inner, perimeter, ring: perimeter * width + Math.PI * width * width };
}
