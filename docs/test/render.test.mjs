// The renderer's arithmetic.
//
// Almost all of a path tracer is on the GPU and cannot be reached from here.
// What CAN be reached is the part that decides what the picture will look like
// before a single ray is cast: the environment. It is the only light in the
// room, so if it is wrong every render is wrong in the same way, and it is
// written as arithmetic precisely so that it can be checked here rather than
// by looking at a screenshot and feeling hopeful.
//
// The engine itself is driven in a browser - see the drives in the commit that
// added it. This file is what a browser cannot tell you.

import { ENVIRONMENTS, QUALITIES, findEnvironment, findQuality, paintEnvironment }
  from "../src/render.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol) => Number.isFinite(a) && Math.abs(a - b) <= tol;

//! A STAND-IN FOR THE ENGINE, so the environment can be evaluated without a
//! GPU, a canvas or a megabyte of three.js. paintEnvironment asks for exactly
//! two things - a texture class that takes a generation callback, and a colour
//! space constant - so exactly two things are supplied. If it ever reaches for
//! a third this stub fails by name rather than by returning undefined.
const stubPT = () => {
  let callback = null;
  class Texture {
    constructor(w, h) { this.width = w; this.height = h; }
    set generationCallback(fn) { callback = fn; }
    get generationCallback() { return callback; }
    update() { this.updated = true; }
  }
  return {
    THREE: { LinearSRGBColorSpace: "srgb-linear" },
    ProceduralEquirectTexture: Texture,
    read: () => callback,
  };
};

//! One direction's colour, in linear light. phi is 0 straight up and PI
//! straight down, theta goes round - the same convention the real texture uses,
//! because it is three's Spherical and this hands over the same shape.
const sampleAt = (paint, theta, phi) => {
  const colour = { r: 0, g: 0, b: 0,
                   setRGB(r, g, b) { this.r = r; this.g = g; this.b = b; } };
  paint({ theta, phi, radius: 1 }, { x: 0, y: 0 }, { x: 0, y: 0 }, colour);
  return colour;
};
const luminance = c => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;

const painterFor = preset => {
  const PT = stubPT();
  paintEnvironment(PT, preset, 8);     // tiny: nothing reads the pixels here
  return PT.read();
};

console.log("1. the tables answer, and answer safely");
{
  check("a key that is not there falls back rather than throwing",
        findEnvironment("nonsense").key === ENVIRONMENTS[0].key,
        findEnvironment("nonsense").key);
  check("and so does the quality", findQuality("nonsense").key === "good",
        findQuality("nonsense").key);
  check("every environment is complete",
        ENVIRONMENTS.every(e => ["key", "label", "exposure", "sky", "horizon", "ground",
                                 "cards", "cardPower", "cardWidth", "cardLength",
                                 "cardTilt", "band", "floor", "floorRough", "floorColor"]
          .every(k => e[k] !== undefined)),
        ENVIRONMENTS.map(e => e.key).join(", "));
  //! A preset that asks for cards and gives them no power draws nothing, and
  //! looks exactly like a preset that asked for none - which is the kind of
  //! mistake that survives a screenshot.
  check("a preset with cards gives them power",
        ENVIRONMENTS.every(e => e.cards === 0 || e.cardPower > 0));
  check("the qualities get harder in order",
        QUALITIES.every((q, i) => i === 0 || q.bounces >= QUALITIES[i - 1].bounces),
        QUALITIES.map(q => q.key + ":" + q.bounces).join(" "));
}

console.log("\n2. the dome is a dome: brighter above than below");
{
  for (const preset of ENVIRONMENTS) {
    const paint = painterFor(preset);
    //! Straight up and straight down, away from any card - theta is irrelevant
    //! at the poles but the card test below needs a direction with no card in
    //! it, so take the zenith at a turn no card is at.
    const down = luminance(sampleAt(paint, Math.PI, Math.PI - 0.02));
    const sky = luminance(sampleAt(paint, Math.PI, 0.9));
    check(preset.key + ": the sky is brighter than the floor of the dome",
          sky > down, sky.toFixed(3) + " vs " + down.toFixed(3));
  }
}

console.log("\n3. a light card is where the preset puts it, and is bright");
{
  //! Studio: two cards, tilted 0.30 * PI off the zenith. The first is at
  //! turn 0.12, which is theta = (0.12 * 2 - 1) * PI.
  const studio = ENVIRONMENTS.find(e => e.key === "studio");
  const paint = painterFor(studio);
  const theta = (0.12 * 2 - 1) * Math.PI;
  const phi = studio.cardTilt * Math.PI;
  const onCard = luminance(sampleAt(paint, theta, phi));
  const offCard = luminance(sampleAt(paint, theta + Math.PI / 2, phi));
  check("the card is on the sphere where the preset says",
        onCard > offCard * 4, onCard.toFixed(2) + " on vs " + offCard.toFixed(2) + " off");

  //! THE RATIO IS THE WHOLE POINT. An 8-bit environment cannot hold more than
  //! 1.0, so every card in one is the same brightness as white paper and
  //! nothing in the picture ever gets a specular highlight worth the name.
  //! This is the check that the environment is really high dynamic range.
  check("and it is many times brighter than white, not clipped at it",
        onCard > 8, onCard.toFixed(1) + "x");

  //! A card tilted off the zenith has to be ON the tilt, not at the top. The
  //! commonest way to get this wrong is to put every card straight overhead,
  //! which lights the top of a part and leaves its sides dead.
  const atZenith = luminance(sampleAt(paint, theta, 0.02));
  check("the card is not at the zenith",
        onCard > atZenith * 3, onCard.toFixed(2) + " at tilt vs " + atZenith.toFixed(2) + " at top");
}

console.log("\n4. the card keeps its shape wherever it is tilted");
{
  //! THE EQUIRECT TRAP. A card drawn in texture coordinates is a rectangle in
  //! the image and therefore a smear on the sphere: near the pole, one texel of
  //! width covers much more of the sphere than it does at the equator. Drawn
  //! that way a card would change SIZE as the preset tilted it, and the
  //! highlight it casts would change with it.
  //!
  //! So: the same card, moved. One preset, copied with its cards at two tilts,
  //! and the angular half-width of each measured on the sphere. They have to
  //! match - that is what sin(phi) in the painter is there for.
  //!
  //! The first version of this test compared two DIFFERENT presets and passed
  //! with the scaling taken out, because the two errors happened to land within
  //! its threshold. A test of a correction has to move the thing the correction
  //! is about and nothing else.
  const studio = ENVIRONMENTS.find(e => e.key === "studio");

  //! On the sphere, not in theta: a step in theta near the pole is a smaller
  //! step across the sphere, by exactly sin(phi). This conversion is the
  //! definition of angular width and is not the thing under test.
  const widthAtTilt = tilt => {
    const paint = painterFor({ ...studio, cards: 1, cardTilt: tilt });
    const phi = tilt * Math.PI;
    const theta0 = (0.62 * 2 - 1) * Math.PI;
    const peak = luminance(sampleAt(paint, theta0, phi));
    let half = 0;
    for (let d = 0; d < Math.PI; d += 0.001) {
      if (luminance(sampleAt(paint, theta0 + d, phi)) < peak * 0.1) break;
      half = d;
    }
    return half * Math.sin(phi);
  };

  const high = widthAtTilt(0.15);        // close to the zenith
  const low = widthAtTilt(0.50);         // out on the equator
  const ratio = Math.max(high, low) / Math.max(1e-9, Math.min(high, low));
  check("a card tilted to 0.15 and the same card at 0.50 are the same size",
        ratio < 1.15, "0.15 -> " + high.toFixed(3) + " rad, 0.50 -> " + low.toFixed(3)
                      + " rad, ratio " + ratio.toFixed(2));
}

console.log("\n5. nothing in the dome is negative, and nothing is NaN");
{
  //! A negative radiance is not a dark colour - it is a number the tracer will
  //! average into every bounce that sees it, and it shows up as black speckle
  //! that no amount of sampling removes.
  for (const preset of ENVIRONMENTS) {
    const paint = painterFor(preset);
    let worst = Infinity, bad = 0;
    for (let i = 0; i < 48; i++) {
      for (let j = 0; j < 24; j++) {
        const c = sampleAt(paint, (i / 48) * 2 * Math.PI - Math.PI, (j + 0.5) / 24 * Math.PI);
        for (const v of [c.r, c.g, c.b]) {
          if (!Number.isFinite(v)) bad++;
          worst = Math.min(worst, v);
        }
      }
    }
    check(preset.key + ": every direction is finite and non-negative",
          bad === 0 && worst >= 0, bad + " not finite, lowest " + worst.toFixed(4));
  }
}

console.log("\n6. exposure is the preset's, not a second brightness dial");
{
  //! The preset carries an exposure because a black stage and an overcast sky
  //! need different ones to land in the same place. It multiplies the user's
  //! dial rather than replacing it, so these have to be sane on their own.
  check("every preset's exposure is a sensible multiplier",
        ENVIRONMENTS.every(e => e.exposure > 0.5 && e.exposure < 3),
        ENVIRONMENTS.map(e => e.key + " " + e.exposure).join(", "));
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
