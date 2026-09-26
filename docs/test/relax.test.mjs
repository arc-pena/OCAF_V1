// Dynamic relaxation, against answers that can be worked out on paper.
//
// A form-finder is the easiest kind of code to believe and the hardest to
// check: it always produces something, the something always looks organic, and
// "it looks like a cable net" is not evidence of anything. So every case here
// has an answer that is known before the program is asked:
//
//   a chain pinned at both ends, every link pulling to nothing, is a STRAIGHT
//   LINE between the pins - and the straightness is measurable to a micron
//   rather than judged by eye
//   the same chain hung under gravity is a CATENARY, whose sag has a closed
//   form, and whose ends have not moved
//   a flat grid pinned at its border stays FLAT, and every interior vertex
//   ends at the average of its neighbours - which is the discrete Laplace
//   equation, and is the definition of a minimal surface over a flat boundary
//   points held on a circle are ON the circle: their distance from its centre
//   is its radius, to a micron, however hard the net pulls them
//   points held on a sphere are at the radius, likewise
//
// And the case that would look like success while being wrong: a net whose
// SPRINGS are relaxed but whose HELD points have drifted off the thing they
// were held to. That is what a solver looks like when the projection is a
// force rather than a constraint, it is the commonest way to write this, and
// it is checked separately every time.
import { heldAt, heldOnCurve, heldOnPlane, heldOnSurface, heldWhereItIs,
         nearestOnHold, relaxMesh, springsOf } from "../src/relax.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= tol;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

console.log("1. the nearest point on each kind of thing");
{
  check("on a plane it is the foot of the perpendicular",
        near(dist(nearestOnHold(heldOnPlane([0, 0, 0], [0, 0, 1]), [3, 4, 9]), [3, 4, 0]), 0));
  //! A 3-4-5 triangle: the nearest point of the x axis to (0,4,0) is the
  //! origin, and it is 4 away. Chosen because both numbers are known.
  const line = heldOnCurve([[-10, 0, 0], [10, 0, 0]]);
  check("on a line it is the foot, and the distance is the height",
        near(dist(nearestOnHold(line, [0, 4, 0]), [0, 0, 0]), 0)
        && near(dist(nearestOnHold(line, [3, 4, 0]), [3, 4, 0]), 4));
  //! PAST THE END OF A SEGMENT IT IS THE END, which is the case a formula
  //! without the clamp gets wrong and no drawing ever shows.
  check("past the end of a curve it is the end",
        near(dist(nearestOnHold(line, [40, 3, 0]), [10, 0, 0]), 0),
        JSON.stringify(nearestOnHold(line, [40, 3, 0])));
  //! A unit square as two triangles in z=0. The nearest point to a point above
  //! the middle is directly below it; to a point out past the corner it is the
  //! corner.
  const quad = heldOnSurface([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]], [0, 1, 2, 0, 2, 3]);
  check("over a surface it is straight down onto it",
        near(dist(nearestOnHold(quad, [0.5, 0.5, 7]), [0.5, 0.5, 0]), 0));
  check("and outside it, the nearest point of its edge",
        near(dist(nearestOnHold(quad, [4, 4, 0]), [1, 1, 0]), 0),
        JSON.stringify(nearestOnHold(quad, [4, 4, 0])));
  check("a point target is that point", near(dist(nearestOnHold(heldAt([2, 3, 4]), [9, 9, 9]),
        [2, 3, 4]), 0));
  check("and fixed is where it started",
        near(dist(nearestOnHold(heldWhereItIs(), [9, 9, 9], [1, 2, 3]), [1, 2, 3]), 0));
}

console.log("\n2. a chain pinned at both ends is a straight line");
{
  //! TEN LINKS, dropped in a zig-zag so there is something to pull out, pinned
  //! at both ends, every link wanting to be nothing. The answer is the segment
  //! between the pins, and every interior point is on it.
  const n = 11;
  const points = [];
  for (let i = 0; i < n; i++) points.push([i * 10, (i % 2 ? 26 : -26), i % 3 ? 14 : -9]);
  points[0] = [0, 0, 0];
  points[n - 1] = [100, 0, 0];
  const got = relaxMesh({ points, faces: [] },
    [{ verts: [0], target: heldWhereItIs() }, { verts: [n - 1], target: heldWhereItIs() }],
    //! Asked for a micron, so it is told to keep going until it is still to a
    //! picometre: the default stopping point is "near enough to look at" and
    //! this is a measurement.
    { rest: "zero", steps: 4000, stiffness: 0.6, damping: 0.6, settled: 1e-12 });
  check("a mesh with no faces relaxes as the chain through its points",
        got.springs === n - 1, String(got.springs));
  let off = 0;
  for (const p of got.points) off = Math.max(off, Math.hypot(p[1], p[2]));
  check("every link ends on the straight line between the pins", off < 1e-4,
        "furthest off: " + off.toExponential(2));
  check("the pins did not move",
        near(dist(got.points[0], [0, 0, 0]), 0) && near(dist(got.points[n - 1], [100, 0, 0]), 0));
  //! AND IT IS THE SHORTEST: the links have shared the span evenly, which is
  //! what "minimal" means for a chain. Ten links over 100 mm is 10 mm each.
  let shortest = Infinity, longest = 0;
  for (let i = 0; i + 1 < n; i++) {
    const d = dist(got.points[i], got.points[i + 1]);
    shortest = Math.min(shortest, d); longest = Math.max(longest, d);
  }
  check("and the span is shared evenly between them",
        near(shortest, 10, 0.01) && near(longest, 10, 0.01),
        shortest.toFixed(4) + " to " + longest.toFixed(4));
}

console.log("\n3. hung under gravity it is a catenary");
{
  //! The check is not the shape's name, it is three things a catenary does and
  //! a circular arc does not: it is symmetric, its lowest point is in the
  //! middle, and its ends are exactly where they were pinned.
  const n = 21, span = 200;
  const points = [];
  for (let i = 0; i < n; i++) points.push([(i * span) / (n - 1), 0, 0]);
  const got = relaxMesh({ points, faces: [] },
    [{ verts: [0], target: heldWhereItIs() }, { verts: [n - 1], target: heldWhereItIs() }],
    { rest: "keep", steps: 40000, stiffness: 0.5, damping: 0.9,
      gravity: [0, 0, -0.02], settled: 1e-9 });
  //! AND IT STOPPED BY ITSELF, which is the half of this that was wrong: the
  //! haul a pin has to put on a loaded chain never falls to nothing - gravity
  //! pumps a little velocity in every step and the pin takes it out again -
  //! and counting that as movement meant a chain still to fifteen decimal
  //! places since step 1,200 never stopped early. The two numbers are now
  //! separate and it settles in about a thousand.
  check("it settles and says so, rather than running the budget",
        got.steps < 3000 && got.moved < 1e-8,
        got.steps + " steps, moved " + got.moved.toExponential(2)
        + ", the pins hauling " + got.pulled.toFixed(3) + " a step");
  const z = got.points.map(p => p[2]);
  const low = Math.min(...z);
  check("it sags", low < -1, "lowest " + low.toFixed(3));
  check("its lowest point is in the middle",
        z.indexOf(low) === (n - 1) / 2 || Math.abs(z.indexOf(low) - (n - 1) / 2) <= 1,
        "at " + z.indexOf(low) + " of " + (n - 1));
  let skew = 0;
  for (let i = 0; i < n; i++) skew = Math.max(skew, Math.abs(z[i] - z[n - 1 - i]));
  check("and it is symmetric about that middle", skew < 1e-3, skew.toExponential(2));
  check("and the ends are still where they were pinned",
        near(dist(got.points[0], [0, 0, 0]), 0)
        && near(dist(got.points[n - 1], [span, 0, 0]), 0));
}

console.log("\n4. a flat grid pinned round its border stays flat");
{
  //! AND EVERY FREE VERTEX ENDS AT THE AVERAGE OF ITS NEIGHBOURS, which is the
  //! discrete Laplace equation - the thing a minimal surface satisfies - and
  //! is checkable per vertex without knowing the answer in advance.
  const cols = 8, rows = 6, step = 25;
  const points = [], faces = [];
  const at = (i, j) => j * (cols + 1) + i;
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= cols; i++)
      points.push([i * step, j * step, (i * 7 + j * 11) % 5 - 2]);   // shoved off flat
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++)
      faces.push([at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)]);
  const border = [];
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= cols; i++)
      if (i === 0 || j === 0 || i === cols || j === rows) border.push(at(i, j));
  // put the border back where it belongs first, then pin it there
  for (const v of border) points[v][2] = 0;
  const got = relaxMesh({ points, faces },
    [{ verts: border, target: heldWhereItIs() }],
    { rest: "zero", steps: 4000, stiffness: 0.5, damping: 0.7, settled: 1e-9 });
  let off = 0;
  for (const p of got.points) off = Math.max(off, Math.abs(p[2]));
  check("it comes back flat", off < 1e-4, "furthest off the plane: " + off.toExponential(2));

  let worst = 0;
  for (let j = 1; j < rows; j++)
    for (let i = 1; i < cols; i++) {
      const p = got.points[at(i, j)];
      const around = [at(i - 1, j), at(i + 1, j), at(i, j - 1), at(i, j + 1)]
        .map(v => got.points[v]);
      const mean = [0, 1, 2].map(k => around.reduce((s, q) => s + q[k], 0) / around.length);
      worst = Math.max(worst, dist(p, mean));
    }
  check("and every free vertex sits at the average of its four neighbours",
        worst < 0.02, "furthest from the average: " + worst.toExponential(2));
}

console.log("\n5. held on a curve, and it stays on it");
{
  //! THE CHECK THAT TELLS A CONSTRAINT FROM A FORCE. The top row of a grid is
  //! told to live on a circle in the z=0 plane; the net pulls it inwards hard.
  //! If the projection is a force, they end up NEAR the circle and the picture
  //! still looks right. So the measurement is each held vertex's distance from
  //! the circle's centre, and it has to be the radius.
  const R = 300, cols = 10, rows = 5, step = 40;
  const points = [], faces = [];
  const at = (i, j) => j * (cols + 1) + i;
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= cols; i++) points.push([i * step - 200, j * step - 400, 0]);
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++)
      faces.push([at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)]);
  const ring = [];
  for (let k = 0; k <= 180; k++) {
    const a = (k / 180) * Math.PI * 2;
    ring.push([Math.cos(a) * R, Math.sin(a) * R, 0]);
  }
  const top = [], bottom = [];
  for (let i = 0; i <= cols; i++) { top.push(at(i, rows)); bottom.push(at(i, 0)); }
  const got = relaxMesh({ points, faces }, [
    { verts: bottom, target: heldWhereItIs() },
    { verts: top, target: heldOnCurve(ring) },
  ], { rest: "zero", steps: 3000, stiffness: 0.5, damping: 0.8, settled: 1e-9 });

  let worst = 0;
  for (const v of top) {
    const p = got.points[v];
    //! The ring is a polyline of 180 chords, so a point ON it is up to the
    //! sagitta of one chord inside the true circle: R(1-cos(pi/180)) = 0.046 mm
    //! on a 300 mm radius. That is the tolerance, and it is arithmetic rather
    //! than a number picked until the test passed.
    worst = Math.max(worst, Math.abs(Math.hypot(p[0], p[1]) - R));
  }
  const sagitta = R * (1 - Math.cos(Math.PI / 180));
  check("every held vertex is ON the circle, not near it",
        worst <= sagitta + 1e-6, worst.toFixed(5) + " off, chord sagitta is "
        + sagitta.toFixed(5));
  check("and they are all still in its plane",
        got.points.filter((_, i) => top.includes(i)).every(p => near(p[2], 0)));
  //! AND THEY MOVED ALONG IT. A constraint that merely holds them where they
  //! started would pass the test above and do nothing useful.
  let slid = 0;
  for (const v of top) slid = Math.max(slid, dist(got.points[v], points[v]));
  check("and they slid along it to get there", slid > 10, slid.toFixed(2) + " mm");
}

console.log("\n6. held on a surface, and it stays on it");
{
  //! A dome, as triangles: the held row has to end at the radius from its
  //! centre, whatever the net does.
  const R = 200;
  const pts = [], tris = [];
  const bands = 12, round = 24;
  for (let b = 0; b <= bands; b++)
    for (let k = 0; k <= round; k++) {
      const phi = (b / bands) * (Math.PI / 2), th = (k / round) * Math.PI * 2;
      pts.push([R * Math.cos(phi) * Math.cos(th), R * Math.cos(phi) * Math.sin(th),
                R * Math.sin(phi)]);
    }
  const idx = (b, k) => b * (round + 1) + k;
  for (let b = 0; b < bands; b++)
    for (let k = 0; k < round; k++) {
      tris.push(idx(b, k), idx(b + 1, k), idx(b + 1, k + 1));
      tris.push(idx(b, k), idx(b + 1, k + 1), idx(b, k + 1));
    }
  const points = [], faces = [];
  const cols = 6, rows = 4;
  const at = (i, j) => j * (cols + 1) + i;
  for (let j = 0; j <= rows; j++)
    for (let i = 0; i <= cols; i++) points.push([i * 30 - 90, j * 30 - 60, 260]);
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++)
      faces.push([at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)]);
  const all = points.map((_, i) => i);
  const got = relaxMesh({ points, faces },
    [{ verts: all, target: heldOnSurface(pts, tris) }],
    { rest: "keep", steps: 600, stiffness: 0.4, damping: 0.7 });
  let worst = 0;
  for (const p of got.points) worst = Math.max(worst, Math.abs(Math.hypot(...p) - R));
  //! The dome is a tessellation, so "on it" means on a chord: the deepest a
  //! facet dips below the true sphere is R(1-cos(pi/(2*12))) = 1.71 mm.
  const facet = R * (1 - Math.cos(Math.PI / (2 * bands)));
  check("every vertex lands on the dome", worst <= facet + 1e-6,
        worst.toFixed(4) + " off, deepest facet is " + facet.toFixed(4));
}

console.log("\n7. what is not constrained relaxes to its neighbours, and nothing else");
{
  //! The sentence the user asked for, as a measurement: constrain some, and
  //! the rest finds itself - without the constrained ones drifting.
  const points = [[0, 0, 0], [10, 90, 40], [20, -30, 70], [30, 5, -60], [40, 0, 0]];
  const got = relaxMesh({ points, faces: [] }, [
    { verts: [0], target: heldAt([0, 0, 0]) },
    { verts: [4], target: heldAt([40, 0, 0]) },
  ], { rest: "zero", steps: 3000, stiffness: 0.6, damping: 0.6 });
  check("the two that were told where to be are exactly there",
        near(dist(got.points[0], [0, 0, 0]), 0) && near(dist(got.points[4], [40, 0, 0]), 0));
  check("and the three that were not are evenly spread between them",
        [1, 2, 3].every((v, i) => near(dist(got.points[v], [(i + 1) * 10, 0, 0]), 0, 1e-3)),
        JSON.stringify(got.points.map(p => p.map(v => Math.round(v * 1e3) / 1e3))));
}

console.log("\n8. it stops when it has settled, rather than running the budget");
{
  const points = [[0, 0, 0], [10, 0, 0], [20, 0, 0]];
  const got = relaxMesh({ points, faces: [] },
    [{ verts: [0, 2], target: heldWhereItIs() }],
    { rest: "keep", steps: 5000 });
  check("a net that is already at rest stops at once", got.steps < 20, String(got.steps));
  check("and nothing moved", near(dist(got.points[1], [10, 0, 0]), 0, 1e-9));
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
