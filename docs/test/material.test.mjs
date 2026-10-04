// The material arithmetic.
//
// Every number here can be worked out on paper before the program is asked,
// which is the point of keeping the patterns pure. A checker either has its
// squares the right way round or it does not, and that is a fact about
// Math.floor and not about whether the render looked nice.

import { BLACK, DEFAULT_MATERIAL, SHADE_OPS, WHITE, bakeShade, bakeSize,
         constantShade, evalShade, fractalNoise, hash2, luminanceOf, needsBaking,
         valueNoise } from "../src/material.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol;
const sameColour = (c, want, tol = 1e-9) =>
  Array.isArray(c) && c.length >= 3 && c.every((v, i) => near(v, want[i], tol));
const say = c => Array.isArray(c) ? "[" + c.map(v => v.toFixed(3)).join(", ") + "]" : String(c);

const RED = [1, 0, 0], BLUE = [0, 0, 1];
const red = constantShade(RED), blue = constantShade(BLUE);

console.log("1. a checker has its squares where arithmetic says");
{
  //! SIX SQUARES ACROSS. Square 0 runs 0 to 1/6, square 1 from 1/6 to 2/6.
  //! At (0.08, 0.08) both indices are 0, sum 0, even -> a. At (0.25, 0.08)
  //! the u index is 1 and the v index 0, sum 1, odd -> b. Worked out before
  //! the program was asked, which is the only way this test means anything.
  const board = { op: "checker", scale: 6, a: red, b: blue };
  check("the first square is the first colour",
        sameColour(evalShade(board, 0.08, 0.08), RED), say(evalShade(board, 0.08, 0.08)));
  check("the one beside it is the second",
        sameColour(evalShade(board, 0.25, 0.08), BLUE), say(evalShade(board, 0.25, 0.08)));
  check("the one below it is the second too",
        sameColour(evalShade(board, 0.08, 0.25), BLUE), say(evalShade(board, 0.08, 0.25)));
  check("and the one diagonally is the first again",
        sameColour(evalShade(board, 0.25, 0.25), RED), say(evalShade(board, 0.25, 0.25)));

  //! THE COUNT IS THE COUNT. Walking one row of a 6-square board must change
  //! colour five times - a board that read "scale" as the SIZE of a square
  //! rather than the number of them would change 1/6 as often and still look
  //! exactly like a checker.
  let changes = 0, was = null;
  for (let i = 0; i < 600; i++) {
    const here = luminanceOf(evalShade(board, (i + 0.5) / 600, 0.08));
    if (was !== null && Math.abs(here - was) > 1e-9) changes++;
    was = here;
  }
  check("six squares across means five changes along a row", changes === 5, changes + " changes");
}

console.log("\n2. stripes run the way they are told, and only that way");
{
  const bands = { op: "stripes", scale: 4, width: 0.5, along: "u", a: red, b: blue };
  //! Four repeats across u: 0..0.125 is a, 0.125..0.25 is b, and so on.
  check("u stripes change along u",
        sameColour(evalShade(bands, 0.06, 0.5), RED)
        && sameColour(evalShade(bands, 0.19, 0.5), BLUE),
        say(evalShade(bands, 0.06, 0.5)) + " then " + say(evalShade(bands, 0.19, 0.5)));
  check("and do not change along v",
        sameColour(evalShade(bands, 0.06, 0.1), evalShade(bands, 0.06, 0.9)));

  const down = { ...bands, along: "v" };
  check("v stripes change along v, not u",
        sameColour(evalShade(down, 0.1, 0.06), evalShade(down, 0.9, 0.06))
        && !sameColour(evalShade(down, 0.5, 0.06), evalShade(down, 0.5, 0.19)));

  //! A PINSTRIPE IS MOSTLY NOT THE STRIPE. width is the fraction of each
  //! repeat that is the first colour, so 0.1 must be a tenth of the area -
  //! read as "the width in repeats" instead it would be ten times too wide.
  const thin = { op: "stripes", scale: 1, width: 0.1, a: red, b: blue };
  let hits = 0;
  for (let i = 0; i < 1000; i++)
    if (sameColour(evalShade(thin, (i + 0.5) / 1000, 0.5), RED)) hits++;
  check("a 0.1 stripe covers a tenth of the repeat", Math.abs(hits - 100) <= 2, hits + "/1000");

  //! A soft edge must still reach both colours in the middle of each band,
  //! or it is a gradient wearing a stripe's name.
  const soft = { op: "stripes", scale: 1, width: 0.5, soft: 0.1, a: red, b: blue };
  check("a soft stripe still reaches both colours",
        sameColour(evalShade(soft, 0.25, 0.5), RED, 1e-6)
        && sameColour(evalShade(soft, 0.75, 0.5), BLUE, 1e-6),
        say(evalShade(soft, 0.25, 0.5)) + " / " + say(evalShade(soft, 0.75, 0.5)));
  check("and is partway between them on the boundary",
        Math.abs(evalShade(soft, 0.5, 0.5)[0] - 0.5) < 0.5
        && !sameColour(evalShade(soft, 0.5, 0.5), RED)
        && !sameColour(evalShade(soft, 0.5, 0.5), BLUE),
        say(evalShade(soft, 0.5, 0.5)));
}

console.log("\n3. the noise is noise, and it tiles");
{
  check("one octave stays between 0 and 1", (() => {
    let lo = 1, hi = 0;
    for (let i = 0; i < 4000; i++) {
      const n = valueNoise((i % 200) * 0.137, Math.floor(i / 200) * 0.291);
      lo = Math.min(lo, n); hi = Math.max(hi, n);
    }
    return lo >= 0 && hi <= 1 && hi - lo > 0.5;
  })(), "exercised over 4000 points");

  //! THE SEAM. The field is periodic over `period` lattice cells, so a point
  //! and the same point one period along must be identical - not close, the
  //! same. Without it there is a visible line down every repeat of every
  //! texture, and nobody sees it until it is on a long wall.
  let worst = 0;
  for (let i = 0; i < 400; i++) {
    const x = (i * 0.173) % 7, y = (i * 0.431) % 5;
    worst = Math.max(worst, Math.abs(valueNoise(x, y, 8) - valueNoise(x + 8, y, 8)));
    worst = Math.max(worst, Math.abs(valueNoise(x, y, 8) - valueNoise(x, y + 8, 8)));
  }
  //! Not exactly equal, and it cannot be: the hash takes integers and is
  //! exact, but `x + 8` loses bits in the fraction that is interpolated, so
  //! the two answers differ in the last place. Without the periodicity the
  //! difference would be around 0.5 - four thousand million times this - so a
  //! threshold here is not a weakened test, it is the only true one.
  check("and repeats over its period, to the last bit",
        worst < 1e-9, "worst difference " + worst.toExponential(2));

  //! CONTINUOUS. A hash with no interpolation also stays in 0..1 and also
  //! tiles; what it is not is smooth, and smooth is the whole difference
  //! between noise and television static.
  let biggestStep = 0;
  for (let i = 1; i < 2000; i++)
    biggestStep = Math.max(biggestStep,
      Math.abs(valueNoise(i * 0.001, 0.5) - valueNoise((i - 1) * 0.001, 0.5)));
  check("and is continuous, not static", biggestStep < 0.02,
        "biggest step over 0.001 is " + biggestStep.toFixed(5));

  //! Deterministic, because a texture baked twice must be the same texture.
  check("and the same point always answers the same",
        valueNoise(3.7, 1.2) === valueNoise(3.7, 1.2)
        && hash2(11, 29) === hash2(11, 29));

  //! An fBm that is not normalised by the amplitudes it used gets paler as
  //! octaves are added, which reads as "more detail makes it washed out".
  const oneOctave = [], eightOctaves = [];
  for (let i = 0; i < 500; i++) {
    const x = i * 0.021, y = i * 0.037;
    oneOctave.push(fractalNoise(x, y, { octaves: 1 }));
    eightOctaves.push(fractalNoise(x, y, { octaves: 8 }));
  }
  const mean = a => a.reduce((s, n) => s + n, 0) / a.length;
  check("octaves do not wash the field out",
        Math.abs(mean(oneOctave) - mean(eightOctaves)) < 0.08,
        mean(oneOctave).toFixed(3) + " vs " + mean(eightOctaves).toFixed(3));
  check("and more of them really is more detail", (() => {
    const step = n => {
      let big = 0;
      for (let i = 1; i < 600; i++)
        big = Math.max(big, Math.abs(fractalNoise(i * 0.002, 0.3, { octaves: n })
                                   - fractalNoise((i - 1) * 0.002, 0.3, { octaves: n })));
      return big;
    };
    return step(6) > step(1) * 1.5;
  })());
}

console.log("\n4. bricks are offset courses with a joint between them");
{
  const wall = { op: "bricks", courses: 4, perCourse: 2, joint: 0.1,
                 a: red, b: blue };
  //! Course 0 runs v 0..0.25 and starts flush; course 1 runs 0.25..0.5 and is
  //! offset half a brick. Two bricks per course, so u = 0.5 is a perpend in
  //! course 0 and the middle of a brick in course 1 - which is the whole of
  //! what bond is.
  //!
  //! The first version of this had the two the other way round and failed. The
  //! arithmetic was right and the expectation was wrong, which is the way round
  //! you want it: at u = 0.5 the along-row coordinate is (0.5 x 2 + 0) mod 1 =
  //! 0 in course 0, which is a joint, and (1.0 + 0.5) mod 1 = 0.5 in course 1,
  //! which is dead centre of a brick.
  const onJoint = evalShade(wall, 0.5, 0.12);
  const midBrick = evalShade(wall, 0.5, 0.37);
  check("a course is offset from the one below it",
        sameColour(onJoint, BLUE) && sameColour(midBrick, RED),
        say(onJoint) + " then " + say(midBrick));
  //! And the SAME point two courses up must be back in phase.
  check("and back in phase two courses up",
        sameColour(evalShade(wall, 0.5, 0.12), evalShade(wall, 0.5, 0.62)),
        say(evalShade(wall, 0.5, 0.12)) + " / " + say(evalShade(wall, 0.5, 0.62)));
  //! A joint of 0.1 taken off both ends of both axes leaves a brick covering
  //! 0.9 x 0.9 = 81 % of its cell. A joint taken off one end only would leave
  //! 90 %, and a joint applied twice would leave 64 %.
  let brick = 0, total = 0;
  for (let i = 0; i < 300; i++)
    for (let j = 0; j < 300; j++) {
      total++;
      if (sameColour(evalShade(wall, (i + 0.5) / 300, (j + 0.5) / 300), RED)) brick++;
    }
  check("and the joint takes 19 % of the wall",
        Math.abs(brick / total - 0.81) < 0.01, (brick / total * 100).toFixed(1) + "% brick");
}

console.log("\n5. a graph that is wrong does not take the page with it");
{
  //! A document can be edited into a cycle, and a program arrives FROM a
  //! document. An evaluator that recurses for ever on a bad file hangs the
  //! tab, and a hung tab is the one failure a user cannot work around.
  const loop = { op: "adjust", how: "gain", amount: 1 };
  loop.a = loop;
  let answered = null;
  const began = Date.now();
  try { answered = evalShade(loop, 0.5, 0.5); } catch (e) { answered = "threw: " + e.message; }
  check("a cycle answers rather than recursing for ever",
        Array.isArray(answered) && Date.now() - began < 1000,
        say(answered) + " in " + (Date.now() - began) + " ms");

  check("an unknown operation is black, not undefined",
        sameColour(evalShade({ op: "nonsense" }, 0.5, 0.5), BLACK));
  check("and nothing at all is black too",
        sameColour(evalShade(null, 0.5, 0.5), BLACK));
  //! An unwired input falls back to a constant, so a half-built graph draws
  //! something obviously unfinished rather than throwing.
  check("an unwired slot falls back rather than throwing",
        sameColour(evalShade({ op: "checker", scale: 2 }, 0.1, 0.1), WHITE),
        say(evalShade({ op: "checker", scale: 2 }, 0.1, 0.1)));
}

console.log("\n6. the bake is sized by what is in the program");
{
  check("a plain colour needs almost nothing", bakeSize(constantShade(RED)) === 64,
        String(bakeSize(constantShade(RED))));
  //! 8 squares x 8 texels each = 64 wanted, which is the floor; 40 courses
  //! wants 320 and so lands on 512, the next power of two above it.
  check("a 40-course wall needs more",
        bakeSize({ op: "bricks", courses: 40, perCourse: 10 }) === 512,
        String(bakeSize({ op: "bricks", courses: 40, perCourse: 10 })));
  //! OCTAVES ARE FREQUENCY. A 6-scale noise with 5 octaves has features
  //! 2^4 = 16 times finer than its scale; sizing by the scale alone would bake
  //! it at 64 and throw every octave above the first away - which looks like
  //! the octaves doing nothing at all.
  check("and octaves count towards it",
        bakeSize({ op: "noise", scale: 6, octaves: 5 })
        > bakeSize({ op: "noise", scale: 6, octaves: 1 }),
        bakeSize({ op: "noise", scale: 6, octaves: 1 }) + " -> "
        + bakeSize({ op: "noise", scale: 6, octaves: 5 }));
  check("it never goes past the cap", bakeSize({ op: "checker", scale: 9999 }) === 1024,
        String(bakeSize({ op: "checker", scale: 9999 })));

  //! A material with no maps is a handful of numbers. Baking four textures of
  //! a constant colour for it is the most expensive possible way to say grey.
  check("a material with no maps is not baked", needsBaking(DEFAULT_MATERIAL) === false);
  check("and one with a map is",
        needsBaking({ maps: { colour: constantShade(RED) } }) === true);
}

console.log("\n7. a baked map is the program, evaluated");
{
  const board = { op: "checker", scale: 2, a: red, b: blue };
  const size = 8;
  const data = bakeShade(board, size, 1);
  check("it is the right size", data.length === size * size * 3, data.length + " values");
  //! Texel (1, 1) centres on u = v = 1.5/8 = 0.1875, which is square 0 both
  //! ways on a 2-square board: sum 0, even, so the FIRST colour.
  const at = (x, y) => [data[(y * size + x) * 3], data[(y * size + x) * 3 + 1],
                        data[(y * size + x) * 3 + 2]];
  check("and texel (1,1) is what the program says at that point",
        sameColour(at(1, 1), evalShade(board, 1.5 / 8, 1.5 / 8), 1e-6), say(at(1, 1)));
  //! Texel (5, 1) centres on u = 5.5/8 = 0.6875 - square 1 across, square 0
  //! down, sum 1, odd, the SECOND colour. If v were flipped this would still
  //! be right and the one below would not, so both are checked.
  check("and texel (5,1) is the other colour", sameColour(at(5, 1), BLUE, 1e-6), say(at(5, 1)));
  check("and texel (1,5) is the other colour too",
        sameColour(at(1, 5), BLUE, 1e-6), say(at(1, 5)));

  //! TILING REPEATS THE PROGRAM, it does not stretch it. Two tiles of a
  //! 2-square board is a 4-square board, so a row has three changes in it.
  const twice = bakeShade(board, 64, 2);
  let changes = 0;
  for (let x = 1; x < 64; x++)
    if (Math.abs(twice[(1 * 64 + x) * 3] - twice[(1 * 64 + x - 1) * 3]) > 1e-9) changes++;
  check("two tiles of a 2-square board changes three times across a row",
        changes === 3, changes + " changes");

  //! Nothing outside 0..1 reaches a texture: a negative or a greater-than-one
  //! texel is not a bright colour, it is a number the sampler will do
  //! something unpredictable with.
  const wild = bakeShade({ op: "adjust", how: "gain", amount: 40, a: red }, 8, 1);
  check("and every texel is inside 0..1",
        wild.every(v => v >= 0 && v <= 1), "range " + Math.min(...wild) + ".." + Math.max(...wild));
}

console.log("\n8. the vocabulary and the evaluator agree");
{
  //! The declaration drives the catalogue, the editor and the bake sizer. An
  //! op the evaluator handles but the table does not know about would have no
  //! node in the editor and no inputs walked when the bake is sized.
  const handled = [...new Set(["colour", "checker", "stripes", "gradient", "noise",
                               "bricks", "mix", "adjust"])];
  check("every op the evaluator handles is declared",
        handled.every(op => SHADE_OPS[op]),
        handled.filter(op => !SHADE_OPS[op]).join(", ") || "all declared");
  check("and every declared op evaluates to a colour",
        Object.keys(SHADE_OPS).every(op => {
          const c = evalShade({ op, scale: 4, a: red, b: blue, by: red }, 0.3, 0.7);
          return Array.isArray(c) && c.length === 3 && c.every(Number.isFinite);
        }));
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
