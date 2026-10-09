// Soft selection: a weight field made of geometry, and the deformers that
// read it.
//
// WHAT HAS TO BE CHECKED HERE AND CANNOT BE CHECKED BY LOOKING. A soft
// selection is a picture of a blob: at a glance a falloff over 100 mm and one
// over 140 looks the same, a weight of 0.5 and one of 0.6 look the same, and a
// deformer that rotates by w·angle instead of moving a fraction of the way to
// the rotated position looks the same until the angle is large. So every
// number below is one that can be worked out on paper first - the half-radius
// of a linear falloff is exactly 0.5, a right-angle rotation of (10,0,0) is
// exactly (0,10,0), a bar of length L bent through a right angle puts its end
// at exactly (2L/pi, 2L/pi) - and the test is whether the program agrees.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { BLENDS, DEFORMS, FALLOFFS, meshWeights, meshWeightTail,
         meshTailAt } from "../src/ocaf.js";
import { templateMesh, pmLen, pmSub } from "../src/polymesh.js";
import { deformPoints, distanceFrom, falloffAt, movedBy, softWeights, spanAlong,
         spinPoint, ssMesh, ssPlane, ssPoint, ssRun, weightTally,
         weightedCentre } from "../src/softselect.js";
import { readFileSync } from "fs";

const WASM_DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const initModule = (await import(WASM_DIR + "/replicad_single.js")).default;

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;
const nearPoint = (p, q, tol = 1e-9) => pmLen(pmSub(p, q)) <= tol;
const show = p => "(" + p.map(v => (Math.round(v * 1000) / 1000)).join(", ") + ")";

/* ======================================================= 1. the falloff curves

   Every one of them must reach both ends exactly, because a falloff that does
   not reach 0 leaves the whole mesh faintly moving and one that does not reach
   1 never fully catches the vertex you aimed at. The middles are the numbers
   that tell the five curves apart.                                          */

console.log("\n1. the falloff curves");
{
  for (const style of FALLOFFS) {
    check(style + " is 0 outside and 1 at the attractor",
          falloffAt(style, 0) === 0 && falloffAt(style, 1) === 1,
          style + ": " + falloffAt(style, 0) + " .. " + falloffAt(style, 1));
  }
  //! Each of these is the formula evaluated by hand at a half.
  check("Smooth at half is 0.5 — 0.25·(3−1)", near(falloffAt("Smooth", 0.5), 0.5));
  check("Linear at half is 0.5", near(falloffAt("Linear", 0.5), 0.5));
  check("Sharp at half is 0.25 — a quarter the weight at half the way in",
        near(falloffAt("Sharp", 0.5), 0.25));
  check("Dome at half is √0.75 = 0.8660254…",
        near(falloffAt("Dome", 0.5), Math.sqrt(0.75)));
  check("Hard is 1 everywhere inside and 0 outside",
        falloffAt("Hard", 0.001) === 1 && falloffAt("Hard", 0) === 0);
  //! Monotone, which is the one property all five share and the one a wrong
  //! sign anywhere would break.
  let monotone = true;
  for (const style of FALLOFFS)
    for (let i = 1; i <= 100; i++)
      if (falloffAt(style, i / 100) < falloffAt(style, (i - 1) / 100) - 1e-12) monotone = false;
  check("all five rise all the way in", monotone);
  check("anything outside 0..1 is clamped rather than extrapolated",
        falloffAt("Linear", -3) === 0 && falloffAt("Linear", 7) === 1);
}

/* ==================================================== 2. what each kind means

   The four attractors differ only in how far away they say a point is, so
   this is where the difference between "a ball round a point" and "a slab
   through the whole model" actually lives.                                  */

console.log("\n2. the four kinds of attractor");
{
  check("a point is just the distance", near(distanceFrom(ssPoint([0, 0, 0]), [3, 4, 0]), 5));

  //! A SEGMENT IS CLAMPED TO ITS ENDS. Unclamped, every segment reports the
  //! distance to its infinite line and a point forty millimetres off the end
  //! of a curve comes back as being ON it.
  const run = ssRun([[0, 0, 0], [100, 0, 0]]);
  check("a curve is the distance to the nearest place ON it",
        near(distanceFrom(run, [50, 30, 0]), 30));
  check("and off the end it is the distance to the END, not to the line",
        near(distanceFrom(run, [-40, 0, 0]), 40),
        String(distanceFrom(run, [-40, 0, 0])));
  const ring = ssRun([[0, 0, 0], [100, 0, 0], [100, 100, 0], [0, 100, 0]], true);
  check("a closed curve joins up — the gap between last and first is not a gap",
        near(distanceFrom(ring, [-10, 50, 0]), 10));

  //! A PLANE MEASURES ALONG ITS NORMAL, which is the whole reason to pick one:
  //! the zone of influence is a slab and the selection runs the full width of
  //! the model however far out it goes.
  const plane = ssPlane([0, 0, 0], [0, 0, 1]);
  check("a plane is the distance along its normal, whatever x and y are",
        near(distanceFrom(plane, [9999, -4321, 25]), 25));
  check("and it is the same underneath", near(distanceFrom(plane, [0, 0, -25]), 25));
  const front = ssPlane([0, 0, 0], [0, 0, 1], "Front");
  check("one-sided leaves the other side out altogether, not far away",
        near(distanceFrom(front, [0, 0, 25]), 25)
        && distanceFrom(front, [0, 0, -25]) === Infinity);

  //! A MESH ATTRACTS FROM ITS SURFACE. Measured to the nearest VERTEX instead,
  //! a point over the middle of a big triangle would report the distance to a
  //! corner - and the field gets a bump at every vertex of the attractor,
  //! which reads as a broken falloff.
  const sheet = { points: [[-100, -100, 0], [100, -100, 0], [100, 100, 0], [-100, 100, 0]],
                  faces: [[0, 1, 2, 3]] };
  const over = ssMesh(sheet);
  check("a mesh is the distance to its SURFACE, not to its nearest vertex",
        near(distanceFrom(over, [0, 0, 40]), 40), String(distanceFrom(over, [0, 0, 40])));
  check("and past its border it is the distance to the border",
        near(distanceFrom(over, [140, 0, 0]), 40), String(distanceFrom(over, [140, 0, 0])));
}

/* ============================================================ 3. the field

   Distance into weight, with the numbers chosen so the answer is exact.     */

console.log("\n3. distance into weight");
{
  const points = [[0, 0, 0], [50, 0, 0], [100, 0, 0], [250, 0, 0]];
  const w = softWeights(points, [ssPoint([0, 0, 0])],
                        { radius: 100, falloff: "Linear" });
  check("on the attractor is 1", near(w[0], 1));
  check("half way out of a linear falloff is exactly a half", near(w[1], 0.5), String(w[1]));
  check("at the edge of the zone it is 0", near(w[2], 0));
  check("outside it is 0 and not negative", w[3] === 0);

  //! A zone of nothing is a hard pick of what the attractor touches. Dividing
  //! by it is how every weight became NaN and the whole mesh vanished.
  const none = softWeights(points, [ssPoint([50, 0, 0])], { radius: 0 });
  check("a zone of zero picks what it touches rather than making NaN",
        none[1] === 1 && none[0] === 0 && none.every(Number.isFinite), JSON.stringify(none));

  const empty = softWeights(points, [], { radius: 100 });
  check("no attractors selects nothing", empty.every(v => v === 0));
}

/* ==================================================== 4. several attractors

   Three points along a curve are three soft selections, and what happens
   where two of them overlap is the one thing that has to be a choice.       */

console.log("\n4. three attractors at once");
{
  //! Chosen so the two weights are exactly 0.5 and 0.25 under a linear
  //! falloff: the vertex is 50 from one attractor and 75 from the other, with
  //! a zone of 100.
  const vertex = [[0, 0, 0]];
  const two = [ssPoint([50, 0, 0]), ssPoint([-75, 0, 0])];
  const largest = softWeights(vertex, two, { radius: 100, falloff: "Linear", blend: "Largest" });
  const sum = softWeights(vertex, two, { radius: 100, falloff: "Linear", blend: "Sum" });
  const mean = softWeights(vertex, two, { radius: 100, falloff: "Linear", blend: "Average" });
  check("Largest takes the stronger of the two — 0.5", near(largest[0], 0.5), String(largest[0]));
  check("Sum piles them up — 0.75", near(sum[0], 0.75), String(sum[0]));
  check("Average holds them down — 0.375", near(mean[0], 0.375), String(mean[0]));
  //! The property that makes Largest the default.
  const piled = softWeights([[0, 0, 0]], [ssPoint([0, 0, 0]), ssPoint([0, 0, 0])],
                            { radius: 100, blend: "Sum" });
  check("Sum is still clamped to 1 — two attractors on one vertex is not 2",
        piled[0] === 1);

  //! THREE POINTS ALONG A LINE ARE THREE BUMPS, which is the thing the user
  //! asked for and the thing a single blended blob would not be. Measured
  //! rather than asserted: the field has three maxima and two dips between
  //! them.
  const along = [];
  for (let x = 0; x <= 600; x += 10) along.push([x, 0, 0]);
  const three = softWeights(along, [ssPoint([100, 0, 0]), ssPoint([300, 0, 0]),
                                    ssPoint([500, 0, 0])],
                            { radius: 80, falloff: "Smooth", blend: "Largest" });
  let peaks = 0;
  for (let i = 1; i + 1 < three.length; i++)
    if (three[i] >= 0.999 && three[i - 1] < 0.999) peaks++;
  const dips = three.filter(v => v === 0).length;
  check("three points make three separate bumps with gaps between them",
        peaks === 3 && dips > 0, peaks + " peaks, " + dips + " vertices untouched");
}

/* ======================================================= 5. the weight rule

   p' = p + w·(T(p) − p), for every deformation. This is the section that pins
   it: at half weight a right-angle rotation lands on the MIDPOINT OF THE
   CHORD and not on the arc at 45 degrees. The two are 1.1 mm apart on a 10 mm
   arm, which is why reading it off the screen proves nothing.               */

console.log("\n5. the weight rule, where it is visible");
{
  const arm = [[10, 0, 0]];
  const full = deformPoints(arm, [1], { kind: "Rotate", centre: [0, 0, 0],
                                        axis: [0, 0, 1], angle: 90 });
  check("a right angle about Z takes (10,0,0) to (0,10,0)",
        nearPoint(full[0], [0, 10, 0], 1e-12), show(full[0]));

  const half = deformPoints(arm, [0.5], { kind: "Rotate", centre: [0, 0, 0],
                                          axis: [0, 0, 1], angle: 90 });
  check("at half weight it lands on the middle of the chord, (5,5,0)",
        nearPoint(half[0], [5, 5, 0], 1e-12), show(half[0]));
  //! The 45° point is (7.0711, 7.0711); the chord's middle is (5, 5). They are
  //! √2·(10/√2 − 5) = 2.9289 mm apart on a 10 mm arm - a third of the arm, so
  //! the two rules are not a subtlety and getting it wrong is visible.
  const onArc = [10 * Math.cos(Math.PI / 4), 10 * Math.sin(Math.PI / 4), 0];
  check("which is 2.93 mm from the 45° point, so the two rules are tellable apart",
        Math.abs(pmLen(pmSub(half[0], onArc)) - Math.SQRT2 * (10 * Math.SQRT1_2 - 5)) < 1e-9,
        pmLen(pmSub(half[0], onArc)).toFixed(4) + " mm apart");

  const still = deformPoints(arm, [0], { kind: "Rotate", centre: [0, 0, 0],
                                         axis: [0, 0, 1], angle: 90 });
  check("weight 0 does not move at all", nearPoint(still[0], [10, 0, 0], 0));
}

/* ============================================================ 6. each kind

   One number each, worked out first.                                        */

console.log("\n6. the six deformations");
{
  const at = [[10, 7, 0]];
  const moved = deformPoints(at, [0.5], { kind: "Move", by: [100, 0, 0] });
  check("Move at half weight goes half as far", nearPoint(moved[0], [60, 7, 0], 1e-12),
        show(moved[0]));

  const bigger = deformPoints(at, [1], { kind: "Scale", centre: [0, 0, 0], scale: 2 });
  check("Scale doubles everything about the centre",
        nearPoint(bigger[0], [20, 14, 0], 1e-12), show(bigger[0]));

  const stretched = deformPoints(at, [1], { kind: "Scale", centre: [0, 0, 0], scale: 2,
                                            axis: [1, 0, 0], uniform: false });
  check("Scale along one axis leaves the other alone — (20,7,0) and not (20,14,0)",
        nearPoint(stretched[0], [20, 7, 0], 1e-12), show(stretched[0]));

  //! TWIST. The angle is spread over how far the mesh reaches along the axis,
  //! so a bar twisted 90 degrees has 45 at one end and −45 at the other and
  //! the twist END TO END is the number typed in.
  const bar = [[10, 0, 0], [10, 0, 50], [10, 0, 100]];
  const twisted = deformPoints(bar, null, { kind: "Twist", centre: [0, 0, 50],
                                            axis: [0, 0, 1], angle: 90 });
  const r = 10 * Math.SQRT1_2;
  check("Twist: the far end turns +45°", nearPoint(twisted[2], [r, r, 100], 1e-9),
        show(twisted[2]));
  check("the near end turns −45°", nearPoint(twisted[0], [r, -r, 0], 1e-9),
        show(twisted[0]));
  check("and the middle does not turn at all", nearPoint(twisted[1], [10, 0, 50], 1e-9),
        show(twisted[1]));

  //! BEND. A bar of length L bent through a right angle becomes a quarter
  //! circle of radius R = L/(pi/2) = 2L/pi, so its free end is at
  //! (R, R) = (2L/pi, 2L/pi) = (63.662, 63.662) for L = 100. Nothing about
  //! that number can be fudged.
  const L = 100;
  const spine = [];
  for (let i = 0; i <= 50; i++) spine.push([L * i / 50, 0, 0]);
  const bent = deformPoints(spine, null, { kind: "Bend", centre: [0, 0, 0],
                                           axis: [1, 0, 0], into: [0, 1, 0], angle: 90 });
  const R = 2 * L / Math.PI;
  check("Bend: a right angle puts the end of a 100 mm bar at (63.662, 63.662)",
        nearPoint(bent[50], [R, R, 0], 1e-9), show(bent[50]));
  check("the centre of the bend does not move", nearPoint(bent[0], [0, 0, 0], 1e-12));
  //! AND NOTHING STRETCHES. The arc is the same length as the bar it came
  //! from, which is the property that separates a bend from a shear with a
  //! curve drawn on it.
  let arc = 0;
  for (let i = 1; i < bent.length; i++) arc += pmLen(pmSub(bent[i], bent[i - 1]));
  check("and the bar is still 100 mm long along its arc", Math.abs(arc - L) < 0.02,
        arc.toFixed(4) + " mm");
  const unbent = deformPoints(spine, null, { kind: "Bend", centre: [0, 0, 0],
                                             axis: [1, 0, 0], angle: 0 });
  check("a bend of zero is not a division by zero",
        unbent.every((p, i) => nearPoint(p, spine[i], 0)));

  //! PINCH, outwards from the centre: every point on a circle of 10 pushed
  //! out 5 lands on a circle of 15.
  const ringPoints = [];
  for (let i = 0; i < 12; i++)
    ringPoints.push([10 * Math.cos(i), 10 * Math.sin(i), 0]);
  const puffed = deformPoints(ringPoints, null, { kind: "Pinch", centre: [0, 0, 0],
                                                  amount: 5 });
  check("Pinch outwards puts a 10 mm ring on a 15 mm one",
        puffed.every(p => near(pmLen(p), 15, 1e-9)), show(puffed[0]));
  const pinched = deformPoints(ringPoints, null, { kind: "Pinch", centre: [0, 0, 0],
                                                   amount: -4 });
  check("and a negative amount pulls it in to 6 mm",
        pinched.every(p => near(pmLen(p), 6, 1e-9)));
}

/* ====================================================== 7. the small helpers

   The centre and the span are where a deformation gets its meaning, and both
   of them are defaults a person never sees until they are wrong.            */

console.log("\n7. centre, span and tally");
{
  const points = [[0, 0, 0], [100, 0, 0]];
  check("the centre of a selection is weighted, not the middle of the mesh",
        nearPoint(weightedCentre(points, [0, 1]), [100, 0, 0], 1e-12),
        show(weightedCentre(points, [0, 1])));
  check("with nothing selected it falls back to the centroid",
        nearPoint(weightedCentre(points, [0, 0]), [50, 0, 0], 1e-12));
  check("and with no weights at all it is the centroid",
        nearPoint(weightedCentre(points, null), [50, 0, 0], 1e-12));

  const span = spanAlong([[0, 0, -30], [0, 0, 70]], [0, 0, 0], [0, 0, 1]);
  check("the span along an axis is measured from the centre both ways",
        span.span === 100 && span.low === -30 && span.high === 70, JSON.stringify(span));

  const tally = weightTally([0, 0.5, 1, 1, 0.0000001]);
  check("the tally counts what was touched and what was caught whole",
        tally.touched === 3 && tally.full === 2 && tally.of === 5,
        JSON.stringify(tally));

  const went = movedBy([[0, 0, 0], [1, 0, 0]], [[0, 0, 0], [1, 0, 4]]);
  check("and movedBy reports how many and how far", went.moved === 1 && went.most === 4);

  check("spinPoint is a rotation and not a scale",
        near(pmLen(pmSub(spinPoint([3, 4, 0], [0, 0, 0], [0, 0, 1], 1.1), [0, 0, 0])), 5,
             1e-12));
}

/* ================================================= 8. the two lists agreeing

   The names live in the catalogue and the arithmetic is keyed by them, which
   is one list instead of two and one join that could silently rot: rename a
   falloff in ocaf.js and every mesh quietly gets the default curve. This is
   the test that would notice.                                               */

console.log("\n8. the catalogue's names and the arithmetic");
{
  //! A name the arithmetic knows gives a curve of its own; an unknown one
  //! falls back to Smooth. So every name must differ from Smooth SOMEWHERE,
  //! except Smooth.
  const fingerprint = style => [0.25, 0.5, 0.75].map(t => falloffAt(style, t)).join(",");
  const smooth = fingerprint("Smooth");
  const unknown = fingerprint("Bananas");
  check("an unknown falloff falls back rather than breaking", unknown === smooth);
  for (const style of FALLOFFS)
    if (style !== "Smooth")
      check(style + " is answered by name", fingerprint(style) !== smooth, fingerprint(style));

  //! The same for the deformations: each one has to do something a Move does
  //! not, or it is not wired up.
  const probe = [[10, 3, 7]];
  const spec = { centre: [0, 0, 0], axis: [0, 0, 1], by: [1, 0, 0], angle: 45,
                 scale: 2, amount: 5, into: [0, 1, 0] };
  const asMove = deformPoints(probe, null, { ...spec, kind: "Move" })[0];
  for (const kind of DEFORMS)
    if (kind !== "Move")
      check(kind + " is answered by name",
            !nearPoint(deformPoints(probe, null, { ...spec, kind })[0], asMove, 1e-9),
            show(deformPoints(probe, null, { ...spec, kind })[0]));
  check("and the blends are three different answers",
        new Set(BLENDS.map(blend =>
          softWeights([[0, 0, 0]], [ssPoint([50, 0, 0]), ssPoint([-75, 0, 0])],
                      { radius: 100, falloff: "Linear", blend })[0])).size === 3);
}

/* ================================================ 9. the weights in the file

   The selection rides on the end of the packed face list, behind a sentinel
   of its own, because a mesh is two arrays in an OCAF label and a soft
   selection has to travel downstream to be any use. A mesh written before
   this existed has to keep reading, which is the half that is easy to break.  */

console.log("\n9. the selection, stored");
{
  const faces = [4, 0, 1, 2, 3, 3, 0, 1, 2];
  check("a mesh with no tail at all has no weights", meshWeights({ faces }) === null);
  check("and the faces still read", meshTailAt(faces) === faces.length);

  const weights = [0, 0.5, 1, 0.125];
  const withTail = faces.concat(meshWeightTail(weights));
  const back = meshWeights({ faces: withTail });
  check("weights come back as they went in, to a thousandth",
        back && back.length === 4 && near(back[0], 0) && near(back[1], 0.5)
        && near(back[2], 1) && near(back[3], 0.125), JSON.stringify(back));

  //! BEHIND THE CREASES, which were there first and are optional, so this is
  //! the arrangement that has to survive: faces, then creases, then weights.
  const creased = faces.concat([0, 1, 0, 1, 800, 1, 2, 500]).concat(meshWeightTail(weights));
  const afterCreases = meshWeights({ faces: creased });
  check("and they are still found behind a crease table",
        afterCreases && afterCreases.length === 4 && near(afterCreases[1], 0.5),
        JSON.stringify(afterCreases));

  check("nothing selected writes nothing, so an untouched mesh packs as it did",
        meshWeightTail([0, 0, 0]).length === 0 && meshWeightTail([]).length === 0);
  check("a weight out of range is clamped rather than stored wrong",
        meshWeights({ faces: faces.concat(meshWeightTail([5, -2])) })
          .every(w => w >= 0 && w <= 1));
}

/* ====================================================== 10. in the document

   Through the real kernel, as a person would wire it: a cage, a point, a
   selection, a deformation.                                                 */

console.log("\n10. wired up in a document");
{
  const kernel = await createWasmKernel({ initModule,
    wasmBinary: readFileSync(WASM_DIR + "/replicad_single.wasm") });
  const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                        select: () => {}, selected: () => null });
  const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);

  const box = await mdl.run({ op: "add", type: "MeshBox", name: "Cage" });
  for (const [k, v] of [["dx", 400], ["dy", 400], ["dz", 400],
                        ["segX", 8], ["segY", 8], ["segZ", 8]])
    await mdl.run({ op: "set", id: box.id, key: k, value: v });
  const cage = await at(box.id);
  check("a cage to work on", cage.built && !cage.error, cage.error || cage.note);

  const point = await mdl.run({ op: "add", type: "Point", name: "Attractor" });
  //! Off the grid lines on purpose: at (200, 0, 0) the attractor sits exactly
  //! on a vertex of this cage, and a test for "a zone too small to reach
  //! anything" would then reach exactly one thing.
  for (const [k, v] of [["x", 200], ["y", 7], ["z", 0]])
    await mdl.run({ op: "set", id: point.id, key: k, value: v });

  const soft = await mdl.run({ op: "add", type: "SoftSelect", name: "Soft" });
  await mdl.run({ op: "connect", id: soft.id, key: "mesh", from: box.id });
  await mdl.run({ op: "connect", id: soft.id, key: "attractors", from: point.id });
  await mdl.run({ op: "set", id: soft.id, key: "radius", value: 150 });
  let sel = await at(soft.id);
  check("the selection builds", sel.built && !sel.error, sel.error || sel.note);
  check("and says how many vertices it caught, of how many",
        /\d+ of \d+ vertices/.test(sel.note || ""), sel.note);
  const caught = Number((sel.note || "").match(/^(\d+) of (\d+)/)?.[1]);
  const ofAll = Number((sel.note || "").match(/^(\d+) of (\d+)/)?.[2]);
  check("some but not all of the cage — a selection, not a mesh-wide one",
        caught > 0 && caught < ofAll, caught + " of " + ofAll);

  //! THE FAILURE THAT LOOKS LIKE SUCCESS. A zone too small to reach anything
  //! builds, draws, and is the same mesh; everything downstream silently does
  //! nothing. It has to SAY so.
  await mdl.run({ op: "set", id: soft.id, key: "radius", value: 0.0001 });
  check("a selection that caught nothing says NOTHING SELECTED",
        /NOTHING SELECTED/.test((await at(soft.id)).note || ""), (await at(soft.id)).note);
  await mdl.run({ op: "set", id: soft.id, key: "radius", value: 150 });

  //! Nothing to attract to is refused by name rather than selecting all of it
  //! or none of it.
  const orphan = await mdl.run({ op: "add", type: "SoftSelect", name: "Orphan" });
  await mdl.run({ op: "connect", id: orphan.id, key: "mesh", from: box.id });
  check("with no attractor it refuses and says what to wire in",
        /nothing to attract to/.test((await at(orphan.id)).error || ""),
        (await at(orphan.id)).error);
  await mdl.run({ op: "delete", id: orphan.id });

  const vector = await mdl.run({ op: "add", type: "Vector", name: "Out" });
  for (const [k, v] of [["dx", 1], ["dy", 0], ["dz", 0]])
    await mdl.run({ op: "set", id: vector.id, key: k, value: v });

  const push = await mdl.run({ op: "add", type: "CageDeform", name: "Push" });
  await mdl.run({ op: "connect", id: push.id, key: "mesh", from: soft.id });
  await mdl.run({ op: "connect", id: push.id, key: "by", from: vector.id });
  await mdl.run({ op: "set", id: push.id, key: "distance", value: 80 });
  const pushed = await at(push.id);
  check("the deformation builds", pushed.built && !pushed.error, pushed.error || pushed.note);
  check("and reports how many moved and how far",
        /\d+ of \d+ vertices moved, the furthest by/.test(pushed.note || ""), pushed.note);

  //! THE WHOLE CLAIM OF THE NODE, measured: the vertices that moved are the
  //! ones the selection caught, and the furthest any of them went is the
  //! distance asked for - no more, because a weight cannot exceed 1.
  const went = Number((pushed.note || "").match(/furthest by ([\d.]+) mm/)?.[1]);
  const movedCount = Number((pushed.note || "").match(/^move: (\d+) of/)?.[1]);
  //! NEVER FURTHER THAN THE DISTANCE ASKED FOR, because a weight cannot
  //! exceed 1 - and here not quite as far either, since the attractor sits
  //! between vertices so none of them is fully caught. A deformer that moved
  //! something 80.3 mm would mean a weight above 1, which would mean the
  //! falloff had escaped its own range.
  check("nothing moves further than the distance asked for",
        went > 0 && went <= 80 + 1e-9, String(went) + " of 80 mm");
  const strongest = 1 - 0; // the note is in vertices, so this is the check below
  check("and it got most of the way there, so the selection is biting",
        went > 60, String(went));
  check("and only the selected vertices moved", movedCount === caught,
        movedCount + " moved, " + caught + " selected");

  //! Without a selection it is a whole-object modifier, which is the other
  //! half of what this node is for.
  const all = await mdl.run({ op: "add", type: "CageDeform", name: "All of it" });
  await mdl.run({ op: "connect", id: all.id, key: "mesh", from: box.id });
  await mdl.run({ op: "connect", id: all.id, key: "by", from: vector.id });
  const every = await at(all.id);
  check("with no soft selection it deforms the whole mesh and says so",
        /no soft selection/.test(every.note || "")
        && Number((every.note || "").match(/^move: (\d+) of (\d+)/)?.[1]) === ofAll,
        every.note);

  //! AND THE SELECTION SURVIVES THE DEFORMER, so Move then Twist is two nodes
  //! over one selection. That is the whole reason the weights ride on the
  //! mesh instead of being a second output.
  const twist = await mdl.run({ op: "add", type: "CageDeform", name: "Then twist" });
  await mdl.run({ op: "connect", id: twist.id, key: "mesh", from: push.id });
  //! A choice is set by the index of the option - DEFORMS[3] is Twist.
  await mdl.run({ op: "set", id: twist.id, key: "kind", value: DEFORMS.indexOf("Twist") });
  await mdl.run({ op: "set", id: twist.id, key: "angle", value: 60 });
  const twisted = await at(twist.id);
  check("a second deformer reads the same selection off the mesh",
        twisted.built && !/no soft selection/.test(twisted.note || "")
        && Number((twisted.note || "").match(/^twist: (\d+) of/)?.[1]) === caught,
        twisted.note);

  //! A Subdivide in between has changed the vertices, so the selection cannot
  //! survive it - and the honest behaviour is to drop it rather than apply a
  //! stale weight list to new vertices.
  const finer = await mdl.run({ op: "add", type: "Subdivide", name: "Finer" });
  await mdl.run({ op: "connect", id: finer.id, key: "mesh", from: soft.id });
  const after = await mdl.run({ op: "add", type: "CageDeform", name: "After" });
  await mdl.run({ op: "connect", id: after.id, key: "mesh", from: finer.id });
  await mdl.run({ op: "connect", id: after.id, key: "by", from: vector.id });
  check("but a Subdivide between them drops it, rather than keeping a stale one",
        /no soft selection/.test((await at(after.id)).note || ""), (await at(after.id)).note);

  //! A CURVE ATTRACTOR THROUGH THE REAL KERNEL, because the polyline comes out
  //! of OpenCascade and none of the arithmetic above exercises that join. A
  //! line between two points along one edge of the cage: what it selects is a
  //! BAND the length of the line, which is the thing a point attractor cannot
  //! do and the reason the kind exists.
  const far = await mdl.run({ op: "add", type: "Point", name: "Far end" });
  for (const [k, v] of [["x", 400], ["y", 7], ["z", 0]])
    await mdl.run({ op: "set", id: far.id, key: k, value: v });
  const line = await mdl.run({ op: "add", type: "Line", name: "Edge line" });
  await mdl.run({ op: "set", id: line.id, key: "kind", value: 1 });
  await mdl.run({ op: "connect", id: line.id, key: "from", from: point.id, mode: "only" });
  await mdl.run({ op: "connect", id: line.id, key: "to", from: far.id, mode: "only" });
  check("a line to attract to", (await at(line.id)).built, (await at(line.id)).error);

  const byCurve = await mdl.run({ op: "add", type: "SoftSelect", name: "By a curve" });
  await mdl.run({ op: "connect", id: byCurve.id, key: "mesh", from: box.id });
  await mdl.run({ op: "connect", id: byCurve.id, key: "attractors", from: line.id });
  await mdl.run({ op: "set", id: byCurve.id, key: "radius", value: 150 });
  const ringSel = await at(byCurve.id);
  const alongLine = Number((ringSel.note || "").match(/^(\d+) of/)?.[1]);
  check("a curve attracts along its whole length",
        ringSel.built && /curve/.test(ringSel.note || ""), ringSel.error || ringSel.note);
  check("and catches more than the point at one end of it did",
        alongLine > caught, alongLine + " along the line, " + caught + " round the point");

  //! And something that cannot be a distance is refused by name rather than
  //! quietly leaving the selection empty. The document refuses the WIRE, which
  //! is better than refusing the build: it never gets made.
  const number = await mdl.run({ op: "add", type: "Number", name: "Just a number" });
  const bad = await mdl.run({ op: "add", type: "SoftSelect", name: "Bad" });
  await mdl.run({ op: "connect", id: bad.id, key: "mesh", from: box.id });
  let refusal = "";
  try {
    await mdl.run({ op: "connect", id: bad.id, key: "attractors", from: number.id });
  } catch (e) { refusal = e.message; }
  check("a number cannot be attracted to, and the wire is refused by name",
        /Attractors takes point or curve or plane or mesh/.test(refusal), refusal);
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall good");
process.exit(failures ? 1 : 0);
