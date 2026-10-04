// The architectural material catalogue.
//
// A library of numbers is the easiest thing in a program to get quietly wrong,
// because every entry is plausible and nothing ever throws. So the checks here
// are the ones that would catch a typed digit: that every entry is complete,
// that the physics of each quantity holds, and above all that the table agrees
// with ITSELF - a colour whose luminance is not the reflectance the same row
// claims is a row that is lying about one of its own numbers.
//
// That last check found a real conflation when it was first run: nineteen rows
// disagreed, and all nineteen were metals and glass. They were not wrong - a
// metal's colour is F0, its specular reflectance, and a glass's colour is the
// tint light picks up going THROUGH it, and neither is the luminous reflectance
// a daylight calculation wants. The fix was to say which quantity is which,
// per row, and to check the rule only where it holds.

import { readFileSync } from "fs";

const book = JSON.parse(readFileSync("docs/data/materials/architectural.json", "utf8"));

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
//! Rec. 709, the same weights the renderer's tone mapping and the material
//! arithmetic use. One definition of brightness in the program.
const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
const dielectric = m => !m.metalness && !m.transmission;

console.log("1. every entry is complete and in a group that exists");
{
  const groups = new Set(book.groups.map(g => g.key));
  check("there are materials", book.materials.length > 50,
        book.materials.length + " in " + book.groups.length + " groups");
  check("every one has a key, a name, a group, a colour and a roughness",
        book.materials.every(m => m.key && m.name && m.group
          && Array.isArray(m.colour) && m.colour.length === 3
          && typeof m.roughness === "number"),
        book.materials.filter(m => !m.key || !m.name || !m.group).map(m => m.name).join(", ")
        || "all complete");
  check("every group a material names is declared",
        book.materials.every(m => groups.has(m.group)),
        [...new Set(book.materials.filter(m => !groups.has(m.group)).map(m => m.group))].join(", ")
        || "all declared");
  //! A duplicate key does not throw - it silently makes one material
  //! unreachable, and which one depends on the order of a lookup.
  const keys = book.materials.map(m => m.key);
  check("and no key is used twice", new Set(keys).size === keys.length,
        keys.filter((k, i) => keys.indexOf(k) !== i).join(", ") || "all distinct");
  check("every group has something in it",
        book.groups.every(g => book.materials.some(m => m.group === g.key)),
        book.groups.filter(g => !book.materials.some(m => m.group === g.key))
          .map(g => g.key).join(", ") || "all used");
}

console.log("\n2. the numbers are physically possible");
{
  const outside = (m, key, lo, hi) =>
    m[key] !== undefined && !(m[key] >= lo && m[key] <= hi);
  for (const [key, lo, hi] of [["roughness", 0, 1], ["metalness", 0, 1],
                               ["transmission", 0, 1], ["reflectance", 0, 1]]) {
    const bad = book.materials.filter(m => outside(m, key, lo, hi));
    check(key + " is between " + lo + " and " + hi, !bad.length,
          bad.map(m => m.key + "=" + m[key]).join(", ") || "all inside");
  }
  const dark = book.materials.filter(m => m.colour.some(v => v < 0 || v > 1));
  check("every colour channel is inside 0..1", !dark.length,
        dark.map(m => m.key).join(", ") || "all inside");

  //! An index of refraction below 1 is a material light travels through
  //! FASTER than vacuum, which is not a building product.
  const silly = book.materials.filter(m => m.ior !== undefined && (m.ior < 1 || m.ior > 3));
  check("and any index of refraction is a real one", !silly.length,
        silly.map(m => m.key + "=" + m.ior).join(", ") || "all real");
  //! The published values, which anybody can look up: soda-lime glass is 1.52
  //! and polycarbonate is 1.585. If these drift, the table has been edited by
  //! somebody who did not look them up.
  const glass = book.materials.find(m => m.key === "glass-clear");
  check("clear glass is 1.52, the published value for soda-lime",
        glass && Math.abs(glass.ior - 1.52) < 1e-9, glass && String(glass.ior));
  const poly = book.materials.find(m => m.key === "polycarbonate");
  check("and polycarbonate is 1.585",
        poly && Math.abs(poly.ior - 1.585) < 1e-9, poly && String(poly.ior));
}

console.log("\n3. the table agrees with itself about brightness");
{
  //! THE CHECK THAT EARNS ITS KEEP. For a dielectric the colour IS the diffuse
  //! albedo, so its luminance must be the reflectance the same row claims. A
  //! mistyped digit in either number shows up here and nowhere else - both
  //! would still render, and both would still look like concrete.
  const plain = book.materials.filter(dielectric);
  const wrong = plain.filter(m =>
    Math.abs(luminance(m.colour) - m.reflectance) > 0.03);
  check(plain.length + " dielectrics have the brightness they claim", !wrong.length,
        wrong.map(m => m.key + " says " + m.reflectance
                       + " but is " + luminance(m.colour).toFixed(3)).join("; ") || "all agree");

  //! And the rule does NOT hold for the others, which is the point of saying
  //! so. If a metal's colour ever equalled its reflectance it would mean
  //! somebody had "fixed" the table by making F0 into an albedo.
  const metals = book.materials.filter(m => m.metalness >= 0.9);
  check("and the metals do not, because their colour is F0 and not an albedo",
        metals.every(m => luminance(m.colour) > m.reflectance),
        metals.length + " metals, all with F0 above their room reflectance");
  check("which the file says in words, not only in the numbers",
        /F0/.test(book.colour_note) && /not a measurement/.test(book.roughness_note));
}

console.log("\n4. the entries say what an architect would recognise");
{
  //! Spot checks against values anybody in the trade can argue with, which is
  //! what makes them worth having. White matt paint is the brightest ordinary
  //! surface in a building and is a little over 0.8; a carpet tile is one of
  //! the darkest and is well under 0.2. If these two ever cross, the table has
  //! been inverted somewhere.
  const of = key => book.materials.find(m => m.key === key);
  check("white matt paint is the brightest ordinary surface",
        of("paint-white").reflectance > 0.75, String(of("paint-white").reflectance));
  check("and a carpet tile is one of the darkest",
        of("carpet-tile").reflectance < 0.2, String(of("carpet-tile").reflectance));
  check("fair-faced concrete is in the published 0.20 to 0.40 band",
        of("concrete-fair").reflectance >= 0.2 && of("concrete-fair").reflectance <= 0.4,
        String(of("concrete-fair").reflectance));
  check("charred timber is darker than walnut, which is darker than oak",
        of("timber-charred").reflectance < of("walnut").reflectance
        && of("walnut").reflectance < of("oak").reflectance,
        [of("timber-charred").reflectance, of("walnut").reflectance,
         of("oak").reflectance].join(" < "));
  //! A mirror finish is the smoothest thing in the table and matt paint the
  //! roughest; anything else means roughness and gloss have been swapped,
  //! which is a one-character mistake that renders as a plausible picture.
  const smoothest = book.materials.reduce((a, b) => (a.roughness <= b.roughness ? a : b));
  const roughest = book.materials.reduce((a, b) => (a.roughness >= b.roughness ? a : b));
  check("the smoothest entry is a mirror or a glass, not a plaster",
        /mirror|glass|granite/.test(smoothest.key), smoothest.key + " " + smoothest.roughness);
  check("and the roughest is a felt, a carpet or a render",
        /felt|carpet|render|plaster|concrete|sedum|wool/.test(roughest.key),
        roughest.key + " " + roughest.roughness);

  //! Everything that transmits must have an index, or the renderer has
  //! nothing to refract with and the glass comes out as a grey film.
  const clear = book.materials.filter(m => m.transmission);
  check("everything that transmits has an index of refraction",
        clear.every(m => m.ior !== undefined || m.key === "blind-fabric"),
        clear.filter(m => m.ior === undefined).map(m => m.key).join(", ") || "all have one");
}

console.log("\n5. it says where its numbers came from");
{
  //! The rule from the package-making notes: say which of the three each
  //! number is - computed, modelled, or measured - and if there is no
  //! measurement, say that rather than implying one.
  check("the file states the provenance of each quantity",
        /published typical value/.test(book.reflectance)
        && /not a measurement made here/.test(book.reflectance)
        && /JUDGEMENT/.test(book.roughness_note));
  check("and does not claim to have measured anything",
        /Nothing here was measured by this program/.test(book.note), book.note.slice(-60));
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
