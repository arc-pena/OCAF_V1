// The colour picker's arithmetic.
//
// The DOM half of it has to be looked at. This is the half that can be wrong
// in a way nobody sees until every render comes out pale: the conversion
// between what a person types (sRGB hex) and what the model stores (linear).
// A factor of 2.2 in the wrong direction looks like a slightly different
// colour, not like a bug.

import { closePicker, hexToLinear, hsvToRgb, linearToHex, rgbToHsv, toLinear,
         toSrgb } from "../src/picker.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-6) => Number.isFinite(a) && Math.abs(a - b) <= tol;

console.log("1. the transfer function is sRGB, not pow(2.2)");
{
  //! THE STANDARD'S OWN ANCHORS. 0 and 1 are fixed points; mid grey is the
  //! one everybody can check - 0.5 sRGB is 0.2140 linear, which is why a
  //! "50 % grey" is nowhere near half as bright as white.
  check("black stays black", near(toLinear(0), 0) && near(toSrgb(0), 0));
  check("white stays white", near(toLinear(1), 1) && near(toSrgb(1), 1));
  check("sRGB 0.5 is linear 0.2140", near(toLinear(0.5), 0.21404114, 1e-7),
        toLinear(0.5).toFixed(8));
  //! The straight line near black is the part pow(1/2.2) gets wrong, and it
  //! is exactly where a shadow lives. At sRGB 0.04 the standard is linear
  //! 0.003096; pow(2.2) would say 0.001070 - a third of it.
  check("and the toe near black is the straight line, not a power",
        near(toLinear(0.04), 0.04 / 12.92, 1e-12),
        toLinear(0.04).toExponential(4) + " vs pow " + Math.pow(0.04, 2.2).toExponential(4));
  check("which is three times what pow(2.2) would say",
        toLinear(0.04) / Math.pow(0.04, 2.2) > 2.5,
        (toLinear(0.04) / Math.pow(0.04, 2.2)).toFixed(2) + "x");

  //! Round trip, over the whole range, to within a part in ten million.
  let worst = 0;
  for (let i = 0; i <= 1000; i++) {
    const v = i / 1000;
    worst = Math.max(worst, Math.abs(toSrgb(toLinear(v)) - v));
  }
  check("and it inverts itself everywhere", worst < 1e-9, "worst " + worst.toExponential(2));
}

console.log("\n2. hex is sRGB and the value is linear");
{
  //! THE ONE THAT MATTERS. #808080 is mid grey on screen and 0.2140 in the
  //! model. Read it as linear 0.502 and every material is twice as bright as
  //! it should be, which is the bug this test exists for.
  const grey = hexToLinear("#808080");
  check("#808080 is 0.2159 linear, not 0.502",
        near(grey[0], toLinear(128 / 255), 1e-9), grey[0].toFixed(5));
  check("white is one", hexToLinear("#ffffff").every(v => near(v, 1)));
  check("black is nought", hexToLinear("#000000").every(v => near(v, 0)));

  //! Round trip through the 8-bit hex, which is lossy by at most half a step.
  for (const hex of ["#000000", "#ffffff", "#808080", "#1a2b3c", "#cc7733", "#0a6cb0"])
    check("  " + hex + " survives the round trip", linearToHex(hexToLinear(hex)) === hex,
          linearToHex(hexToLinear(hex)));

  //! Short form, because people type it.
  check("#abc is read as #aabbcc",
        linearToHex(hexToLinear("#abc")) === "#aabbcc", linearToHex(hexToLinear("#abc")));
  check("and a hash is optional",
        linearToHex(hexToLinear("cc7733")) === "#cc7733");

  //! NONSENSE IS GREY, NOT NULL. A colour field that answers with nothing
  //! paints the object black the first time somebody mistypes.
  check("nonsense comes back as something drawable",
        hexToLinear("not a colour").every(v => v >= 0 && v <= 1),
        JSON.stringify(hexToLinear("not a colour")));
  check("and so does an empty string",
        hexToLinear("").every(v => v >= 0 && v <= 1));
}

console.log("\n3. HSV round trips, including the awkward places");
{
  //! Grey has no hue and no saturation, and the commonest HSV bug is a
  //! divide by the zero that is max-min.
  const [h, s, v] = rgbToHsv([0.5, 0.5, 0.5]);
  check("grey has no saturation and does not divide by zero",
        near(s, 0) && near(v, 0.5) && Number.isFinite(h), JSON.stringify([h, s, v]));
  check("black is all zeroes", rgbToHsv([0, 0, 0]).every(n => near(n, 0)));

  //! The six corners of the cube, which is where the sextant arithmetic is
  //! decided. Red is hue 0, yellow 1/6, green 2/6, cyan 3/6, blue 4/6,
  //! magenta 5/6 - worked out from the definition, not from the code.
  const corners = [
    [[1, 0, 0], 0], [[1, 1, 0], 1 / 6], [[0, 1, 0], 2 / 6],
    [[0, 1, 1], 3 / 6], [[0, 0, 1], 4 / 6], [[1, 0, 1], 5 / 6],
  ];
  for (const [rgb, hue] of corners)
    check("  hue of " + JSON.stringify(rgb) + " is " + hue.toFixed(3),
          near(rgbToHsv(rgb)[0], hue, 1e-9), rgbToHsv(rgb)[0].toFixed(6));

  let worst = 0;
  for (let i = 0; i < 400; i++) {
    const rgb = [(i * 37 % 101) / 100, (i * 61 % 101) / 100, (i * 13 % 101) / 100];
    const back = hsvToRgb(rgbToHsv(rgb));
    for (let k = 0; k < 3; k++) worst = Math.max(worst, Math.abs(back[k] - rgb[k]));
  }
  check("and four hundred colours survive the trip both ways",
        worst < 1e-9, "worst " + worst.toExponential(2));
}

console.log("\n4. the picker works in sRGB on purpose");
{
  //! WHY THE SQUARE IS NOT LINEAR. Laid out in linear light, half the
  //! square's height covers the top 80 % of the brightness and the bottom
  //! half is almost all nearly-black - so dragging through the dark end does
  //! nothing you can see. In sRGB the value axis is perceptual and the drag
  //! is even. This measures that: the midpoint of the axis.
  const linearMid = 0.5;                    // halfway down a linear square
  const srgbMid = toLinear(0.5);            // halfway down an sRGB one
  check("halfway down an sRGB square is a quarter of the light, not half",
        srgbMid < linearMid * 0.5,
        srgbMid.toFixed(4) + " vs " + linearMid.toFixed(4));
  //! And the thing that makes it worth it: equal steps down the sRGB axis
  //! are roughly equal steps in what a person sees. Over the top half of the
  //! axis a linear square spends more than three quarters of its light.
  const topHalfLinear = 1 - 0.5;
  const topHalfSrgb = 1 - toLinear(0.5);
  check("so a linear square wastes its lower half",
        topHalfSrgb > topHalfLinear * 1.5,
        (topHalfSrgb * 100).toFixed(0) + "% of the light in the top half, "
        + "against " + (topHalfLinear * 100).toFixed(0) + "%");
}

console.log("\n5. closing when nothing is open is not an error");
{
  //! Called from the page's Escape handler and from its click-away handler,
  //! both of which fire whether or not a picker is up.
  let threw = null;
  try { closePicker(); closePicker(); } catch (e) { threw = e.message; }
  check("closing twice with nothing open is quiet", threw === null, threw || "quiet");
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
