// What a surface is made of, as arithmetic.
//
// A finish in styles.js is a name for a set of numbers - brass, concrete,
// matte white - and for most parts that is the whole of what is wanted. This is
// the other end: a material built out of nodes, so that a thing can be checker
// plate, or brick, or painted steel with the paint worn off the edges, without
// anybody having to add "worn paint" to a list.
//
// It is PURE. No DOM, no kernel, no three.js, no canvas. A node graph resolves
// to a plain, serialisable description - a SHADE PROGRAM - and this file can
// evaluate one at any point on a surface. Which means two things:
//
//   the drivers can assemble a program in the worker, where there is no canvas
//   and nothing to draw on; and
//
//   every pattern in here can be checked against a number worked out on paper,
//   which is the only way to know that a checker has its squares the right way
//   round rather than merely having squares.
//
// The renderer turns a program into a texture by evaluating it over a grid. It
// is the only part of this that needs a browser, and it is six lines.
//
// Coordinates are the surface's own (u, v), both running 0..1 over whatever the
// renderer decides a tile is. Colours are LINEAR, 0..1 per channel, never
// gamma - the renderer is working in linear light and a texture that is not is
// a texture that is wrong by about 2.2 everywhere.

/* ------------------------------------------------------------------ noise */

//! A hash from two integers to [0, 1). Deterministic, cheap and with no state,
//! so the same point always answers the same whichever order a texture is
//! baked in - which matters, because a texture baked twice must be the same
//! texture or a material changes when you look away.
//!
//! PERIODIC on purpose: the lattice coordinates are wrapped to `period` before
//! hashing, so the field repeats exactly and a baked tile meets itself at the
//! seam. Without that there is a visible line down every repeat, and it is the
//! kind of thing nobody sees until it is on a wall forty metres long.
export function hash2(x, y, period = 256, seed = 0) {
  const xi = ((x % period) + period) % period;
  const yi = ((y % period) + period) % period;
  let h = (xi * 374761393 + yi * 668265263 + seed * 2246822519) | 0;
  h = (h ^ (h >>> 13)) | 0;
  h = Math.imul(h, 1274126177) | 0;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967296;
}

//! Smoothstep, which is what makes value noise look like cloud rather than like
//! a bilinear stretch of a small bitmap. The first derivative is zero at both
//! ends, so the lattice lines do not show.
const smooth = t => t * t * (3 - 2 * t);

//! VALUE NOISE on an integer lattice, one octave. Between 0 and 1, continuous,
//! and periodic over `period` lattice cells.
export function valueNoise(x, y, period = 256, seed = 0) {
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = smooth(x - x0), fy = smooth(y - y0);
  const a = hash2(x0, y0, period, seed), b = hash2(x0 + 1, y0, period, seed);
  const c = hash2(x0, y0 + 1, period, seed), d = hash2(x0 + 1, y0 + 1, period, seed);
  const top = a + (b - a) * fx, bottom = c + (d - c) * fx;
  return top + (bottom - top) * fy;
}

//! Octaves of it, each twice the frequency and `gain` times the amplitude.
//! Normalised by the amplitudes actually used, so the answer stays in 0..1
//! whatever the gain - an fBm that is not normalised quietly washes out as
//! octaves are added, which reads as "more detail makes it paler".
export function fractalNoise(x, y, { octaves = 4, gain = 0.5, period = 256, seed = 0 } = {}) {
  let sum = 0, amplitude = 1, total = 0, frequency = 1;
  const rounds = Math.max(1, Math.min(8, Math.round(octaves)));
  for (let i = 0; i < rounds; i++) {
    sum += valueNoise(x * frequency, y * frequency, period * frequency, seed + i * 17) * amplitude;
    total += amplitude;
    amplitude *= gain;
    frequency *= 2;
  }
  return total > 0 ? sum / total : 0;
}

/* -------------------------------------------------------- shade programs */

//! The whole vocabulary, declared rather than written as a switch, so the node
//! catalogue, the evaluator and the tests all read one list. `inputs` are the
//! slots that take another program; everything else is a number on the node.
export const SHADE_OPS = {
  colour:   { inputs: [], summary: "one colour, everywhere" },
  checker:  { inputs: ["a", "b"], summary: "squares, alternating" },
  stripes:  { inputs: ["a", "b"], summary: "bands across u or v" },
  gradient: { inputs: ["a", "b"], summary: "one colour fading into another" },
  noise:    { inputs: ["a", "b"], summary: "fractal value noise between two colours" },
  bricks:   { inputs: ["a", "b"], summary: "courses, with every other one offset" },
  mix:      { inputs: ["a", "b", "by"], summary: "two shades, blended by a third" },
  adjust:   { inputs: ["a"], summary: "invert, brighten or harden one shade" },
  //! AN IMAGE. It has no inputs because a photograph is not made of anything
  //! else, and the pure evaluator cannot read it - there is no image decoder
  //! here, on purpose. See evalShade.
  image:    { inputs: [], summary: "a photograph, read by the renderer" },
};

export const WHITE = [1, 1, 1];
export const BLACK = [0, 0, 0];

//! A constant colour, which is what every unwired input falls back to - so an
//! incomplete graph still evaluates rather than throwing, and what it draws is
//! obviously incomplete rather than obviously wrong.
export const constantShade = colour => ({ op: "colour", colour: colour.slice(0, 3) });

const clamp01 = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t,
                            a[1] + (b[1] - a[1]) * t,
                            a[2] + (b[2] - a[2]) * t];
//! Rec. 709, the same weights the renderer's tone mapping uses. A mask has to
//! be ONE number and a shade is three, so something has to decide; this is what
//! every compositor has decided since television.
export const luminanceOf = c => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

//! ONE POINT OF ONE PROGRAM. Depth-limited, because a program arrives from a
//! document and a document can be edited into a cycle - and an evaluator that
//! recurses for ever on a bad file takes the page with it.
export function evalShade(program, u, v, depth = 0) {
  if (!program || typeof program !== "object" || depth > 24) return BLACK;
  const at = (slot, fallback) => (program[slot]
    ? evalShade(program[slot], u, v, depth + 1) : fallback);

  switch (program.op) {
    case "colour":
      return Array.isArray(program.colour) ? program.colour : WHITE;

    //! AN IMAGE, WHICH THIS CANNOT READ, and says so by answering with a
    //! neutral value rather than with black.
    //!
    //! Decoding a JPEG needs a decoder, and this file deliberately has none:
    //! it is the arithmetic, it runs in a worker and in a test, and dragging
    //! an image decoder in here to make `evalShade` complete would make every
    //! other thing it does depend on one. So a texture evaluates to the middle
    //! of its own role - mid grey for a colour, half rough, not metal, flat
    //! for a normal - which is what the surface would be if the image were
    //! missing, and is a sane thing for a bake or a test to get.
    //!
    //! The renderer does not come through here for one of these. It sees
    //! `op: "image"` and makes a real texture out of the bytes.
    case "image": {
      const neutral = {
        colour: [0.5, 0.5, 0.5], roughness: [0.5, 0.5, 0.5], metalness: BLACK,
        normal: [0.5, 0.5, 1], occlusion: WHITE, height: [0.5, 0.5, 0.5],
        opacity: WHITE, emission: BLACK,
      };
      return neutral[program.role] || [0.5, 0.5, 0.5];
    }

    //! SQUARES. scale is how many squares across the tile, so 8 gives an
    //! 8 x 8 board - which is how a person thinks about it, and is not the
    //! same as "the size of a square" by a factor that is easy to get wrong.
    case "checker": {
      const n = Math.max(0.001, program.scale || 8);
      const cell = Math.floor(u * n) + Math.floor(v * n);
      return ((cell % 2) + 2) % 2 === 0 ? at("a", WHITE) : at("b", BLACK);
    }

    //! BANDS. `along` says which way they run; `width` is the fraction of each
    //! repeat that is the first colour, so 0.5 is even and 0.1 is a pinstripe.
    case "stripes": {
      const n = Math.max(0.001, program.scale || 8);
      const t = ((((program.along === "v" ? v : u) * n) % 1) + 1) % 1;
      const width = clamp01(program.width === undefined ? 0.5 : program.width);
      //! THE EDGE, as a fraction of a repeat. Zero is a hard band; anything
      //! else ramps in over that distance at BOTH boundaries of the band,
      //! because a band has two of them and softening one makes a sawtooth.
      //! Capped at half the band, past which the two ramps would meet and the
      //! band would never reach its own colour.
      const edge = Math.min(Math.max(0, program.soft || 0), width / 2, (1 - width) / 2);
      if (edge <= 0) return t < width ? at("a", WHITE) : at("b", BLACK);
      //! The ramp STRADDLES the boundary - half of it inside the band, half
      //! out - so the half-way point lands exactly where the hard edge would
      //! have been and the band keeps the width it was asked for. Ramping
      //! inwards from the boundary instead, which is the obvious way to write
      //! it, quietly narrows every band by the softness.
      const ramp = x => clamp01(x / edge + 0.5);
      const k = Math.min(ramp(t), ramp(width - t));
      return lerp3(at("b", BLACK), at("a", WHITE), smooth(clamp01(k)));
    }

    case "gradient": {
      const t = clamp01(program.along === "v" ? v : u);
      const shaped = Math.pow(t, Math.max(0.05, program.bias || 1));
      return lerp3(at("a", BLACK), at("b", WHITE), shaped);
    }

    case "noise": {
      const n = Math.max(0.001, program.scale || 6);
      const value = fractalNoise(u * n, v * n, {
        octaves: program.octaves === undefined ? 4 : program.octaves,
        gain: program.gain === undefined ? 0.5 : program.gain,
        //! The period is in LATTICE CELLS and the lattice is `scale` cells
        //! across the tile, so a tile that is to repeat seamlessly must have an
        //! integer number of them. Rounding the scale here is what makes the
        //! seam disappear; leaving it to the user never works, because the
        //! seam is off the edge of the preview.
        period: Math.max(1, Math.round(n)),
        seed: program.seed || 0,
      });
      return lerp3(at("a", BLACK), at("b", WHITE), clamp01(value));
    }

    //! COURSES, offset by half a brick on alternate rows. Measured in tiles
    //! rather than millimetres: a material does not know how big the wall is.
    case "bricks": {
      const courses = Math.max(0.001, program.courses || 8);
      const perCourse = Math.max(0.001, program.perCourse || 4);
      const joint = clamp01(program.joint === undefined ? 0.06 : program.joint);
      const row = Math.floor(v * courses);
      const inRow = v * courses - row;
      const offset = (row % 2 === 0) ? 0 : 0.5;
      const alongRow = (u * perCourse + offset) % 1;
      //! The joint is a fraction of a brick, and it is taken off BOTH ends of
      //! both axes, so a joint of 0.06 is a 6 % mortar line and not a 12 % one.
      const inJoint = inRow < joint / 2 || inRow > 1 - joint / 2
                   || alongRow < joint / 2 || alongRow > 1 - joint / 2;
      return inJoint ? at("b", [0.7, 0.68, 0.64]) : at("a", [0.55, 0.28, 0.2]);
    }

    case "mix": {
      const by = program.by ? luminanceOf(evalShade(program.by, u, v, depth + 1))
                            : clamp01(program.amount === undefined ? 0.5 : program.amount);
      return lerp3(at("a", BLACK), at("b", WHITE), clamp01(by));
    }

    case "adjust": {
      const c = at("a", WHITE);
      const amount = program.amount === undefined ? 1 : program.amount;
      if (program.how === "invert") return [1 - c[0], 1 - c[1], 1 - c[2]];
      if (program.how === "gain") return c.map(v2 => clamp01(v2 * amount));
      if (program.how === "contrast")
        return c.map(v2 => clamp01((v2 - 0.5) * Math.max(0, amount) + 0.5));
      if (program.how === "gamma")
        return c.map(v2 => clamp01(Math.pow(clamp01(v2), 1 / Math.max(0.01, amount))));
      return c;
    }

    default:
      return BLACK;
  }
}

/* ---------------------------------------------------------- the material */

//! What a Material feature resolves to. Every map is a shade program or null;
//! every scalar is a number. Nothing here is a reference to another feature,
//! on purpose - the whole description travels with the material, so the page
//! can bake it without walking the document, and so a material pasted into
//! another file still means something.
export const DEFAULT_MATERIAL = {
  kind: "material",
  colour: [0.6, 0.62, 0.64],
  roughness: 0.4,
  metalness: 0,
  transmission: 0,
  ior: 1.5,
  emission: [0, 0, 0],
  emissionStrength: 0,
  tiles: 1,
  maps: { colour: null, roughness: null, metalness: null, emission: null },
};

//! Does this material need a texture baked at all? A material whose maps are
//! all empty is a handful of numbers, and baking four 512 x 512 textures of a
//! constant colour for it would be the most expensive way possible to say
//! "grey".
export const needsBaking = material =>
  !!material && !!material.maps && Object.values(material.maps).some(Boolean);

//! HOW BIG TO BAKE. A map wants enough texels to show what it is and no more:
//! a checker of 8 squares is fine at 128, and a brick wall of 40 courses is
//! not. Driven by the finest feature in the program rather than by a setting,
//! because the person who built the graph should not have to think about it.
export function bakeSize(program, cap = 1024) {
  const finest = finestFeature(program);
  //! Eight texels across the smallest feature is the point at which a hard
  //! edge stops looking like a staircase once it is filtered. Below four it
  //! is visibly aliased; above sixteen nothing changes and the bake is four
  //! times the work.
  const want = Math.ceil(finest * 8);
  let size = 64;
  while (size < want && size < cap) size *= 2;
  return Math.min(cap, size);
}

//! The highest frequency anywhere in a program, in repeats across the tile.
function finestFeature(program, depth = 0) {
  if (!program || typeof program !== "object" || depth > 24) return 1;
  let mine = 1;
  if (program.op === "checker" || program.op === "stripes" || program.op === "noise")
    mine = Math.max(1, program.scale || 8);
  if (program.op === "bricks")
    mine = Math.max(program.courses || 8, program.perCourse || 4);
  //! A noise with octaves has features finer than its scale by a factor of two
  //! per octave, and a bake that ignores that throws the detail away - which
  //! looks like the octaves doing nothing.
  if (program.op === "noise")
    mine *= Math.pow(2, Math.max(0, (program.octaves === undefined ? 4 : program.octaves) - 1));
  for (const slot of SHADE_OPS[program.op] ? SHADE_OPS[program.op].inputs : [])
    if (program[slot]) mine = Math.max(mine, finestFeature(program[slot], depth + 1));
  return mine;
}

//! EVERY TEXEL OF ONE MAP, as linear 0..1 triples in row order. The renderer
//! turns this into a texture; nothing here knows what a texture is.
//!
//! v runs 0 at the first row. Which way up a texture goes is a decision, and
//! the decision is made here so that the evaluator, the tests and the bake all
//! agree - a map that is upside down only in the renderer is a bug nobody can
//! find from the arithmetic.
export function bakeShade(program, size, tiles = 1) {
  const data = new Float32Array(size * size * 3);
  for (let y = 0; y < size; y++) {
    const v = ((y + 0.5) / size) * tiles;
    for (let x = 0; x < size; x++) {
      const u = ((x + 0.5) / size) * tiles;
      const c = evalShade(program, u, v);
      const i = (y * size + x) * 3;
      data[i] = clamp01(c[0]); data[i + 1] = clamp01(c[1]); data[i + 2] = clamp01(c[2]);
    }
  }
  return data;
}
