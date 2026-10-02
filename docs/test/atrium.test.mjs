// The atrium's arithmetic, against answers that can be done on paper.
//
// Every check here has a value somebody can derive before the program is asked.
// Two seeds in a square make two half-squares; four seeds on a quarter grid make
// four quarters; a Voronoi PARTITIONS its boundary, so the cells must add back
// up to it exactly; a square inset by d is a square of side s-2d; and a parabola
// is a parabola. That is the whole method: if the expected number came out of
// the function being tested, the test says nothing.
import { balustradeSections, clipToward, cushionRings, ellipseLoop, galleryArea,
         insetConvex, lloyd, loopArea, loopCentroid, mullionStations, netEdges,
         offsetLoop,
         netNodes, parabolicSide, parabolicVoid, resampleLoop, roofCells, roofDome,
         scatter, shopfrontSections,
         slabEdgeSection, storeys, voidHalfWidth, voronoi } from "../src/atrium.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol;

console.log("1. the void is a parabola, and it is the parabola it was asked for");
{
  //! THE THREE NUMBERS THAT DEFINE IT, read back off the function. At the middle
  //! it is `wide`; at either end it is `ends`; and at the quarter station a
  //! parabola is three quarters of the way between them, because 1 - 0.5^2 = 0.75.
  check("at mid span the void is as wide as it was told",
        near(voidHalfWidth(0, 12000, 5000), 12000), String(voidHalfWidth(0, 12000, 5000)));
  check("and at each end it is the end width",
        near(voidHalfWidth(1, 12000, 5000), 5000) && near(voidHalfWidth(-1, 12000, 5000), 5000));
  check("at the half station a parabola is three quarters out",
        near(voidHalfWidth(0.5, 12000, 5000), 5000 + 0.75 * 7000),
        voidHalfWidth(0.5, 12000, 5000).toFixed(1) + " against 10250");
  //! A STRAIGHT TAPER IS NOT A PARABOLA, and the exponent is what says which.
  check("fullness 1 is a straight taper, half way at half",
        near(voidHalfWidth(0.5, 12000, 5000, 1), 5000 + 0.5 * 7000));
  check("and a higher fullness holds the width further out",
        voidHalfWidth(0.5, 12000, 5000, 4) > voidHalfWidth(0.5, 12000, 5000, 2));

  const loop = parabolicVoid({ length: 90000, wide: 12000, ends: 5000, stations: 24 });
  check("the loop comes back with two stations a side",
        loop.length === 48, loop.length + " points");
  //! AND THEY ARE EVENLY SPACED, which is the property the fitted curve needs:
  //! a Catmull-Rom parameterised by index overshoots through crowded points, and
  //! a rail that overshoots sweeps into something kilometres across.
  const gaps = loop.map((p, i) => {
    const q = loop[(i + 1) % loop.length];
    return Math.hypot(q[0] - p[0], q[1] - p[1]);
  });
  check("and they are evenly spaced round it",
        Math.max(...gaps) / Math.min(...gaps) < 1.15,
        Math.min(...gaps).toFixed(0) + ".." + Math.max(...gaps).toFixed(0) + " mm");

  //! THE EXTENTS ARE A POLYGON'S, NOT THE CURVE'S. The loop is a chord
  //! approximation to a parabola and two half ellipses, so it falls INSIDE the
  //! true shape by one sagitta - about 280 mm on a 4.3 m chord over the nose,
  //! whose radius of curvature is 8.3 m. What matters is that it converges, so
  //! that is what is checked rather than one number at one station count.
  const reach = n => {
    const l = parabolicVoid({ length: 90000, wide: 12000, ends: 5000, stations: n });
    const xs = l.map(p => p[0]), ys = l.map(p => p[1]);
    return [Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
  };
  const want = [90000 + 2 * 0.6 * 5000, 24000];
  const coarse = reach(24), fine = reach(200);
  check("it is as long as its length plus its two noses, to within a chord",
        Math.abs(coarse[0] - want[0]) < want[0] * 0.01,
        coarse[0].toFixed(0) + " against " + want[0]);
  check("and as wide as twice the half width",
        Math.abs(coarse[1] - want[1]) < want[1] * 0.01,
        coarse[1].toFixed(0) + " against " + want[1]);
  check("and more stations converge on both, rather than wandering",
        Math.abs(fine[0] - want[0]) < Math.abs(coarse[0] - want[0])
          && Math.abs(fine[1] - want[1]) < Math.abs(coarse[1] - want[1]),
        "at 200 stations " + fine.map(n => n.toFixed(0)).join(" x "));
  check("it is centred on its own origin",
        near(loopCentroid(loop)[0], 0, 1) && near(loopCentroid(loop)[1], 0, 1e-6),
        loopCentroid(loop).map(n => n.toFixed(3)).join(", "));

  //! ONE SIDE OF IT IS AN OPEN RUN, which is what a facade with no corridor in
  //! front of it is swept along. Both ends are on the end stations and every
  //! point is on one side of the axis.
  const side = parabolicSide({ length: 90000, wide: 12000, ends: 5000, stations: 24 });
  check("one side is an open run from end to end", side.length === 25,
        side.length + " points");
  check("it spans the length and nothing more",
        near(side[0][0], -45000, 1) && near(side[side.length - 1][0], 45000, 1),
        side[0][0].toFixed(0) + " .. " + side[side.length - 1][0].toFixed(0));
  check("and every point of it is on its own side of the axis",
        side.every(p => p[1] > 0) &&
        parabolicSide({ length: 90000, wide: 12000, ends: 5000, side: -1 })
          .every(p => p[1] < 0));
  check("the open run is evenly spaced too", (() => {
    const g = side.slice(1).map((p, i) => Math.hypot(p[0] - side[i][0], p[1] - side[i][1]));
    return Math.max(...g) / Math.min(...g) < 1.15;
  })());

  //! AND IT IS NOT AN ELLIPSE. An ellipse of the same bounding box would have
  //! area pi*a*b; a parabolic lens is fuller than that, and the difference is
  //! the thing somebody is choosing when they choose a parabola.
  const ell = Math.PI * 45000 * 12000;
  check("a parabolic void is fuller than the ellipse round it",
        loopArea(loop) > ell, (loopArea(loop) / 1e6).toFixed(0) + " m2 against "
        + (ell / 1e6).toFixed(0) + " m2");
}

console.log("\n2. areas and centroids, on shapes whose answers are known");
{
  const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
  check("a 10 square has area 100", near(loopArea(square), 100));
  check("and its centroid is its middle",
        near(loopCentroid(square)[0], 5) && near(loopCentroid(square)[1], 5));
  const tri = [[0, 0], [6, 0], [0, 4]];
  check("a 6 by 4 right triangle has area 12", near(loopArea(tri), 12));
  check("and its centroid is a third of the way along each leg",
        near(loopCentroid(tri)[0], 2) && near(loopCentroid(tri)[1], 4 / 3));
  //! WOUND THE OTHER WAY IS THE SAME AREA. Which way a loop runs is decided by
  //! the order somebody drew it in, and an area that changes sign with it is an
  //! area that reports a void as negative floor space.
  check("winding does not change the area",
        near(loopArea([...square].reverse()), 100));
}

console.log("\n3. the Voronoi is a Voronoi - cut by bisectors, and it partitions");
{
  const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
  //! TWO SEEDS MAKE TWO HALVES. The bisector of (2,5) and (8,5) is x = 5, so
  //! each cell is a 5 by 10 rectangle of area 50. No approximation can be
  //! closer than exact, and this is the case where exact is checkable.
  const two = voronoi([[2, 5], [8, 5]], square);
  check("two seeds split the square on their bisector",
        near(loopArea(two[0]), 50, 1e-9) && near(loopArea(two[1]), 50, 1e-9),
        two.map(c => loopArea(c).toFixed(3)).join(" + "));
  check("and the split is at x = 5",
        near(Math.max(...two[0].map(p => p[0])), 5, 1e-9));

  //! FOUR SEEDS ON A QUARTER GRID MAKE FOUR QUARTERS, each 25.
  const grid = [[2.5, 2.5], [7.5, 2.5], [2.5, 7.5], [7.5, 7.5]];
  const four = voronoi(grid, square);
  check("four seeds on a quarter grid make four quarters",
        four.every(c => near(loopArea(c), 25, 1e-9)),
        four.map(c => loopArea(c).toFixed(3)).join(", "));

  //! AND A VORONOI PARTITIONS ITS BOUNDARY. Every point of the region belongs to
  //! exactly one cell, so the areas must sum to the region's own - which is the
  //! check that catches a clip that drops a sliver, and a clip that keeps one
  //! twice. Done on an awkward scatter rather than a tidy one.
  const seeds = scatter(40, 5, 5, 11).map(p => [p[0] + 5, p[1] + 5]);
  const cells = voronoi(seeds, square);
  const sum = cells.reduce((s, c) => s + loopArea(c), 0);
  check("the cells of a scatter add back up to the square they are in",
        near(sum, 100, 1e-7), sum.toFixed(9) + " against 100");
  check("and every one of them is a real polygon",
        cells.every(c => c.length >= 3 && loopArea(c) > 0), cells.length + " cells");

  //! THE SAME SEED IS THE SAME ROOF. A pattern that comes out differently every
  //! time the file is opened is not a model of anything.
  const a = scatter(20, 100, 60, 3), b = scatter(20, 100, 60, 3);
  check("the scatter repeats exactly for a given seed",
        JSON.stringify(a) === JSON.stringify(b));
  check("and a different seed is a different scatter",
        JSON.stringify(scatter(20, 100, 60, 4)) !== JSON.stringify(a));
  check("every seed lands inside the ellipse it was asked for",
        a.every(([x, y]) => (x * x) / 10000 + (y * y) / 3600 <= 1));
}

console.log("\n4. Lloyd relaxation evens the cells out without making a grid");
{
  const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
  //! A REGULAR GRID IS ALREADY ITS OWN ANSWER. Each cell's centroid is its own
  //! seed, so relaxation must not move it - which is the fixed point the
  //! algorithm is defined by and the first thing a wrong centroid breaks.
  const grid = [[2.5, 2.5], [7.5, 2.5], [2.5, 7.5], [7.5, 7.5]];
  const still = lloyd(grid, square, 3);
  check("a regular grid is a fixed point of Lloyd",
        still.every((p, i) => near(p[0], grid[i][0], 1e-9) && near(p[1], grid[i][1], 1e-9)),
        still.map(p => p.map(n => n.toFixed(3)).join("/")).join(" "));

  //! AND ON A SCATTER IT EVENS THE AREAS. Measured as the spread of cell areas
  //! before and after: that is what relaxation is FOR, and "it looks better" is
  //! not a measurement.
  const seeds = scatter(30, 5, 5, 19).map(p => [p[0] + 5, p[1] + 5]);
  const spread = list => {
    const areas = voronoi(list, square).map(loopArea);
    const mean = areas.reduce((s, n) => s + n, 0) / areas.length;
    return Math.sqrt(areas.reduce((s, n) => s + (n - mean) ** 2, 0) / areas.length) / mean;
  };
  const before = spread(seeds), after = spread(lloyd(seeds, square, 3));
  check("three rounds of Lloyd halve the spread of cell areas",
        after < before * 0.6, before.toFixed(3) + " -> " + after.toFixed(3));
  //! AND IT STILL PARTITIONS AFTERWARDS.
  const sum = voronoi(lloyd(seeds, square, 3), square).reduce((s, c) => s + loopArea(c), 0);
  check("and the relaxed cells still add up to the square", near(sum, 100, 1e-7));
}

console.log("\n5. clipping, inset, and the cases that should come back with nothing");
{
  const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
  //! A SQUARE INSET BY 2 IS A SQUARE OF SIDE 6, area 36. Checkable before asking.
  const in2 = insetConvex(square, 2);
  check("a 10 square inset by 2 is a 6 square", near(loopArea(in2), 36, 1e-9),
        loopArea(in2).toFixed(6));
  check("and it is still centred where it was",
        near(loopCentroid(in2)[0], 5, 1e-9) && near(loopCentroid(in2)[1], 5, 1e-9));
  //! AND AN INSET THAT HAS EATEN THE POLYGON COMES BACK WITH NOTHING, not with a
  //! bow tie. This is the failure that would look like success: a cell too small
  //! for its web width gives a wound-backwards scrap that still has three points
  //! and still lofts, into a cushion turned inside out.
  check("inset past the middle gives nothing at all", insetConvex(square, 5.1) === null);
  check("inset by exactly half gives nothing either", insetConvex(square, 5) === null);
  check("a zero inset is the polygon itself", insetConvex(square, 0) === square);

  //! THE HALF-PLANE CLIP ON ITS OWN. The bisector of (0,0) and (10,0) is x = 5.
  const half = clipToward(square, [0, 5], [10, 5]);
  check("clipping toward a seed keeps that seed's side",
        near(loopArea(half), 50, 1e-9) && Math.max(...half.map(p => p[0])) <= 5 + 1e-9);
}

console.log("\n6. the roof surface, and the net laid on it");
{
  const dome = roofDome({ length: 90000, width: 30000, rise: 9000 });
  check("the crown is the rise above the springing", near(dome.lift(0, 0), 9000));
  check("and the springing is at zero both ways",
        near(dome.lift(45000, 0), 0, 1e-6) && near(dome.lift(0, 15000), 0, 1e-6));
  //! A PARABOLOID IS A QUARTER DOWN AT HALF THE SPAN, because 1 - 0.5^2 = 0.75.
  check("at half the span it is three quarters up",
        near(dome.lift(22500, 0), 6750, 1e-6), dome.lift(22500, 0).toFixed(1));
  check("the normal at the crown is straight up",
        near(dome.normal(0, 0)[2], 1, 1e-12));
  check("and it leans outwards away from the crown",
        dome.normal(20000, 0)[0] > 0 && dome.normal(20000, 0)[2] > 0,
        dome.normal(20000, 0).map(n => n.toFixed(3)).join(", "));
  check("every normal is a unit vector",
        [[0, 0], [20000, 5000], [40000, 0]].every(([x, y]) =>
          near(Math.hypot(...dome.normal(x, y)), 1, 1e-12)));

  const cells = roofCells({ length: 90000, width: 30000, count: 40, seed: 5, relax: 2 });
  check("the roof has cells in it", cells.length >= 30, cells.length + " cells");
  const area = cells.reduce((s, c) => s + loopArea(c), 0);
  const ell = loopArea(ellipseLoop(45000, 15000, 72));
  check("and they tile the springing ellipse exactly",
        near(area / ell, 1, 1e-9), (area / ell).toFixed(12));

  //! EVERY WALL ONCE. Two cells share a wall; built per cell, every member in
  //! the roof is modelled twice - twice the steel in the bill, twice the
  //! triangles, and two faces in the same place for the renderer to fight over.
  //!
  //! COUNTED ON A TILING WHOSE ANSWER CAN BE STATED. Four seeds on a quarter
  //! grid in a 10 square make four quarters: eight segments round the outside,
  //! where each side of the square is split at its midpoint, and four arms from
  //! the middle out to those midpoints. Twelve members, sixteen cell sides, and
  //! the four interior arms are exactly the ones counted twice.
  const quarters = voronoi([[2.5, 2.5], [7.5, 2.5], [2.5, 7.5], [7.5, 7.5]],
                           [[0, 0], [10, 0], [10, 10], [0, 10]]);
  const qEdges = netEdges(quarters, 0.001), qNodes = netNodes(quarters, 0.001);
  check("four quarters have twelve members, not sixteen",
        qEdges.length === 12, qEdges.length + " members from 16 cell sides");
  check("and nine junctions: four corners, four midpoints and the middle",
        qNodes.length === 9, qNodes.length + " junctions");
  const edges = netEdges(cells);
  const naive = cells.reduce((s, c) => s + c.length, 0);
  check("on the real roof too, no wall is built twice",
        edges.length < naive && edges.length > naive / 2,
        edges.length + " members against " + naive + " cell sides");
  //! Euler's formula for a planar subdivision: V - E + F = 2, counting the
  //! outside as a face. A net that loses a member or doubles a node fails it.
  const nodes = netNodes(cells);
  check("the net satisfies Euler's V - E + F = 2",
        nodes.length - edges.length + cells.length + 1 === 2,
        nodes.length + " - " + edges.length + " + " + (cells.length + 1));
}

console.log("\n7. the cushions sit inside their cells and bulge both ways");
{
  const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
  const rings = cushionRings(square, { rise: 2, drop: 1, rings: 2 });
  check("a cushion is a ladder of rings, widest in the middle",
        rings.length === 5, rings.length + " rings");
  const mid = rings[Math.floor(rings.length / 2)];
  check("the widest ring is the opening itself and is at the clamp line",
        near(mid.z, 0) && near(loopArea(mid.loop), 100, 1e-9));
  check("it swells above the clamp line and below it",
        rings[0].z < 0 && rings[rings.length - 1].z > 0,
        rings.map(r => r.z.toFixed(2)).join(" "));
  check("by the rise above and the drop below",
        rings[rings.length - 1].z < 2 && rings[0].z > -1,
        rings[0].z.toFixed(3) + " .. " + rings[rings.length - 1].z.toFixed(3));
  check("every ring is smaller than the clamp ring",
        rings.every((r, i) => i === 2 || loopArea(r.loop) < 100));
  check("and every ring is concentric with the opening",
        rings.every(r => near(loopCentroid(r.loop)[0], 5, 1e-9)
                      && near(loopCentroid(r.loop)[1], 5, 1e-9)));
}

console.log("\n8. the sections, which are what actually gets built");
{
  //! A SECTION HERE IS TWO CHAINS, NOT ONE OUTLINE, because every one of them is
  //! run along a HORIZONTAL plan curve - so it is either a plan ring with a
  //! height, or a stack of plan rings. `face` looks into the void, `back` meets
  //! the floor plate, and across is positive AWAY from the void.
  const sec = slabEdgeSection({ depth: 1500, bevel: 350, back: 2500 });
  check("the slab edge has a face and a back", sec.face.length === 3 && sec.back.length === 3);
  check("it is as deep as the floor zone, from the walking level down",
        near(sec.face[0][1], 0) && near(sec.face[2][1], -1500),
        JSON.stringify(sec.face));
  check("and reaches back as far as it was told", near(sec.back[0][0], 2500));
  //! THE BEVEL IS SHARP AND IT IS AT THE BOTTOM. The face is vertical for the
  //! first 1150 and then steps back by exactly the chamfer over the last 350 -
  //! a chamfer, not a radius, which is the brief.
  check("the face is vertical for the depth less the chamfer",
        near(sec.face[0][0], 0) && near(sec.face[1][0], 0)
          && near(sec.face[1][1], -(1500 - 350)));
  check("then steps back by exactly the chamfer, over exactly the chamfer",
        near(sec.face[2][0], 350) && near(sec.face[2][1] - sec.face[1][1], -350),
        "across " + sec.face[2][0] + " over " + (sec.face[1][1] - sec.face[2][1]));
  check("and the back of the band is straight, so only the face chamfers",
        sec.back.every(p => near(p[0], 2500)));
  //! A BEVEL BIGGER THAN THE BAND IS NOT A BEVEL. Clamped rather than refused,
  //! because somebody dragging a slider past the end should watch the chamfer
  //! stop growing, not watch the model disappear.
  const silly = slabEdgeSection({ depth: 400, bevel: 9000, back: 600 });
  check("a chamfer larger than the band is held to what fits",
        silly.bevel <= 350 && silly.bevel > 0 && silly.face.every(p =>
          Number.isFinite(p[0] + p[1])), "chamfer came out " + silly.bevel);
  check("and the band is never shallower than its own chamfer",
        silly.reach > silly.bevel, silly.reach + " back, " + silly.bevel + " chamfer");

  //! THE BALUSTRADE, as three prisms rather than one solid.
  const bal = balustradeSections({ height: 1100, glass: 21, setback: 120 });
  check("a balustrade is glass, a capping rail and a shoe",
        !!bal.glass && !!bal.rail && !!bal.shoe);
  check("the glass is the thickness it was given",
        near(bal.glass.across[1] - bal.glass.across[0], 21),
        JSON.stringify(bal.glass));
  check("the rail caps it at the handrail height", near(bal.rail.to, 1100));
  check("and it all stands back from the slab edge by the setback",
        bal.glass.across[0] > 0 && near((bal.glass.across[0] + bal.glass.across[1]) / 2, 120));
  //! THE GLASS IS HOUSED IN THE RAIL, not butted under it. A capping rail that
  //! only touches the top edge of a glass balustrade is one that comes off.
  check("the glass runs up into the rail rather than butting under it",
        bal.glass.to > bal.rail.from && bal.glass.to < bal.rail.to,
        bal.glass.to + " inside " + bal.rail.from + ".." + bal.rail.to);
  check("and it starts inside its shoe rather than on top of it",
        bal.glass.from > 0 && bal.glass.from < bal.shoe.to,
        bal.glass.from + " inside the shoe's 0.." + bal.shoe.to);

  //! THE SHOPFRONT. Glass between mullions with a signage band over it.
  const shop = shopfrontSections({ height: 4200, band: 700, mullion: 90 });
  check("the shopfront glass stops under its signage band", near(shop.glass.to, 3500));
  check("and the band runs from there to the head",
        near(shop.band.from, 3500) && near(shop.band.to, 4200));
  check("the mullion is as wide as it was told", near(shop.mullion.half * 2, 90));
  check("and it runs the height of the glass, not of the band",
        near(shop.mullion.to, 3500) && near(shop.mullion.from, 0));
  check("a shopfront with no band is a flush facade",
        shopfrontSections({ height: 6000, band: 0 }).band === null);

  //! AND THE BAYS ARE EQUAL. A shopfront set out at a fixed pitch from one end
  //! leaves whatever is left over as a stub bay at the other, which is the one
  //! thing a facade contractor will not accept.
  const set = mullionStations(10000, 1500);
  check("mullions divide the run into equal bays",
        set.bays === 7 && near(set.step, 10000 / 7, 1e-9),
        set.bays + " bays of " + set.step.toFixed(1));
  check("and there is a mullion at each end",
        near(set.at[0], 0) && near(set.at[set.at.length - 1], 10000));
  check("a run shorter than one bay still gets one bay",
        mullionStations(400, 1500).bays === 1);
}

console.log("\n8b. the set-back, which is how every other rail is laid out");
{
  //! EVERY RAIL IN AN ATRIUM IS THE VOID SET BACK BY SOMETHING, so the offset
  //! has to hold its distance - and the measurement is the PERPENDICULAR
  //! distance from the offset back to the original, at every point, not the
  //! difference between two half widths.
  const loop = parabolicVoid({ length: 90000, wide: 11500, ends: 4600, stations: 60 });
  const nearest = (p, l) => {
    let best = Infinity;
    for (let i = 0; i < l.length; i++) {
      const a = l[i], b = l[(i + 1) % l.length];
      const ex = b[0] - a[0], ey = b[1] - a[1], len = ex * ex + ey * ey;
      let t = len > 0 ? ((p[0] - a[0]) * ex + (p[1] - a[1]) * ey) / len : 0;
      t = Math.max(0, Math.min(1, t));
      best = Math.min(best, Math.hypot(p[0] - a[0] - ex * t, p[1] - a[1] - ey * t));
    }
    return best;
  };
  for (const back of [140, 2600, 11600]) {
    const out = offsetLoop(loop, back, true);
    const got = out.map(p => nearest(p, loop));
    check("set back " + back + " holds its distance all the way round",
          Math.min(...got) > back * 0.99 && Math.max(...got) < back * 1.05,
          Math.min(...got).toFixed(0) + ".." + Math.max(...got).toFixed(0));
  }
  //! AND IT GROWS, rather than shrinking - the void is the hole, so setting back
  //! from it is going out into the floor plate. Which way a loop was drawn must
  //! not decide that, so it is checked on the loop and on its reverse.
  const grown = offsetLoop(loop, 2600, true);
  check("a positive set-back grows the loop", loopArea(grown) > loopArea(loop),
        (loopArea(grown) / 1e6).toFixed(0) + " m2 from "
        + (loopArea(loop) / 1e6).toFixed(0));
  const backwards = offsetLoop([...loop].reverse(), 2600, true);
  check("and it grows it whichever way round the loop was drawn",
        Math.abs(loopArea(backwards) - loopArea(grown)) < loopArea(grown) * 0.01,
        (loopArea(backwards) / 1e6).toFixed(0) + " m2 either way");
  //! A NEGATIVE SET-BACK SHRINKS IT, which is what a balustrade standing inside
  //! the edge needs.
  check("a negative set-back shrinks it",
        loopArea(offsetLoop(loop, -1000, true)) < loopArea(loop));
  //! AND THE POINTS STAY EVENLY SPACED, because an offset crowds them on the
  //! outside of a turn and the ring built from them is a polyline.
  const gaps = grown.map((p, i) => {
    const q = grown[(i + 1) % grown.length];
    return Math.hypot(q[0] - p[0], q[1] - p[1]);
  });
  check("the set-back loop is still evenly spaced",
        Math.max(...gaps) / Math.min(...gaps) < 1.2,
        Math.min(...gaps).toFixed(0) + ".." + Math.max(...gaps).toFixed(0));
}

console.log("\n9. the storeys, and what a gallery is worth");
{
  //! THE BRIEF'S OWN ARITHMETIC: two retail floors at 6 m, three above at 4.5.
  const list = storeys({ retail: 6000, retailFloors: 2, upper: 4500, upperFloors: 3 });
  check("ground, two galleries and three above it", list.length === 6,
        list.map(s => s.z).join(", "));
  check("the galleries are 6 m floor to floor",
        near(list[1].z, 6000) && near(list[2].z, 12000));
  check("and the floors above them are 4.5",
        near(list[3].z, 16500) && near(list[5].z, 25500));
  check("the galleries are galleries and the rest are flush",
        list[1].kind === "gallery" && list[2].kind === "gallery"
          && list[3].kind === "flush" && list[5].kind === "flush");

  const loop = parabolicVoid({ length: 90000, wide: 12000, ends: 5000 });
  const got = galleryArea(loop, 9000);
  check("a gallery reports the void it is round and its own perimeter",
        got.inner > 0 && got.perimeter > 180000,
        (got.inner / 1e6).toFixed(0) + " m2 void, "
        + (got.perimeter / 1000).toFixed(0) + " m round");
  //! A RING ROUND A LOOP IS ITS PERIMETER TIMES ITS WIDTH, plus the corners.
  //! Checked against the arithmetic rather than against itself.
  check("and the ring it gains is perimeter times width plus the corners",
        near(got.ring, got.perimeter * 9000 + Math.PI * 9000 * 9000, 1e-6),
        (got.ring / 1e6).toFixed(0) + " m2");
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
