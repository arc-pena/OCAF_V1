// A museum of materials: one sphere per material graph, in a grid, each one
// labelled with what it is made of.
//
// The point of it is to be LOOKED AT in Ray traced. A checker on a sphere in a
// rasteriser is a checker on a sphere; the same sphere path traced sits on a
// floor it is bouncing light off, and the glass one has what is behind it
// actually behind it. Half of these - transmission, emission, a rough metal -
// say nothing at all in the raster view, which is the honest reason the
// material editor was built against the tracer.
//
//   node scripts/build_materialgallery.mjs
//
// Writes docs/data/samples/material_gallery.json. Nothing here needs a kernel:
// it is a model file, and the kernel builds it when somebody opens it.

import { writeFileSync } from "fs";

const OUT = "docs/data/samples/material_gallery.json";
const SPACING = 320;         // mm between centres
const RADIUS = 110;
const COLS = 4;

const features = [];
const add = one => { features.push(one); return one.id; };

//! One shade node, named so the graph reads as a sentence when it is opened.
let serial = 0;
const node = (type, name, args) => add({ id: "N" + (++serial), type, name, args });
const colour = (name, rgb) => node("Shade", name, { red: rgb[0], green: rgb[1], blue: rgb[2] });

//! Each entry builds its own shade nodes and returns the Material's arguments
//! bar the body it is on. Written as a list rather than as code per sphere so
//! that what is being demonstrated is readable at a glance.
const GALLERY = [
  {
    label: "Checker plate",
    make: () => ({
      red: 0.5, green: 0.52, blue: 0.55, metalness: 1, roughness: 0.3, tiles: 2,
      colourMap: { ref: node("Checker", "Plate", {
        scale: 10,
        a: { ref: colour("Steel", [0.55, 0.57, 0.6]) },
        b: { ref: colour("Darker", [0.3, 0.31, 0.33]) },
      }) },
    }),
  },
  {
    label: "Brick",
    make: () => ({
      red: 0.5, green: 0.25, blue: 0.18, roughness: 0.9, tiles: 2,
      colourMap: { ref: node("Bricks", "Stretcher bond", {
        courses: 14, perCourse: 5, joint: 0.08,
        a: { ref: colour("Clay", [0.48, 0.22, 0.15]) },
        b: { ref: colour("Mortar", [0.72, 0.70, 0.66]) },
      }) },
    }),
  },
  {
    label: "Worn paint",
    //! THE ONE THAT NEEDS A GRAPH. A noise field, hardened into something
    //! that reads as two materials rather than a blur, used as a MASK to
    //! choose between paint and the metal under it - and the same mask fed to
    //! the roughness, because bare metal is not as glossy as the paint was.
    make: () => {
      const wear = node("NoiseShade", "Wear", {
        scale: 5, octaves: 4, gain: 0.55, seed: 11,
        a: { ref: colour("Kept", [0, 0, 0]) },
        b: { ref: colour("Gone", [1, 1, 1]) },
      });
      const hard = node("AdjustShade", "Harder", { a: { ref: wear }, how: 2, amount: 3.5 });
      return {
        red: 1, green: 1, blue: 1, roughness: 0.4, metalness: 0.5, tiles: 1,
        colourMap: { ref: node("MixShade", "Paint over steel", {
          a: { ref: colour("Paint", [0.12, 0.35, 0.6]) },
          b: { ref: colour("Steel", [0.45, 0.44, 0.42]) },
          by: { ref: hard },
        }) },
        roughMap: { ref: node("MixShade", "Rougher where it is bare", {
          a: { ref: colour("Gloss", [0.12, 0.12, 0.12]) },
          b: { ref: colour("Bare", [0.75, 0.75, 0.75]) },
          by: { ref: hard },
        }) },
      };
    },
  },
  {
    label: "Glass",
    //! Nothing a rasteriser can draw. Transmission with an index of
    //! refraction: what you see through it is bent, and what is behind it is
    //! traced rather than blended.
    make: () => ({ red: 0.85, green: 0.92, blue: 0.95, roughness: 0.02,
                   metalness: 0, transmission: 1, ior: 1.52, tiles: 1 }),
  },
  {
    label: "Brushed brass",
    make: () => ({
      red: 0.83, green: 0.66, blue: 0.31, metalness: 1, roughness: 1, tiles: 1,
      roughMap: { ref: node("Stripes", "Brushing", {
        scale: 220, width: 0.5, soft: 0.3, along: 1,
        a: { ref: colour("Fine", [0.12, 0.12, 0.12]) },
        b: { ref: colour("Finer", [0.3, 0.3, 0.3]) },
      }) },
    }),
  },
  {
    label: "Terrazzo",
    make: () => ({
      red: 1, green: 1, blue: 1, roughness: 0.25, tiles: 2,
      colourMap: { ref: node("MixShade", "Chips in cement", {
        a: { ref: colour("Cement", [0.78, 0.77, 0.74]) },
        b: { ref: colour("Chip", [0.25, 0.3, 0.28]) },
        by: { ref: node("AdjustShade", "Only the peaks", {
          how: 2, amount: 7,
          a: { ref: node("NoiseShade", "Aggregate", {
            scale: 26, octaves: 2, gain: 0.5, seed: 3,
            a: { ref: colour("Low", [0, 0, 0]) },
            b: { ref: colour("High", [1, 1, 1]) },
          }) },
        }) },
      }) },
    }),
  },
  {
    label: "Lit panel",
    //! An emissive material is a LIGHT, which is the other thing only a tracer
    //! does with one: the floor under this sphere is lit by it.
    make: () => ({ red: 0.95, green: 0.85, blue: 0.6, roughness: 0.5,
                   emission: 14, tiles: 1 }),
  },
  {
    label: "Gradient anodise",
    make: () => ({
      red: 1, green: 1, blue: 1, metalness: 1, roughness: 0.22, tiles: 1,
      colourMap: { ref: node("Gradient", "Blue to violet", {
        bias: 1.4, along: 1,
        a: { ref: colour("Blue", [0.1, 0.3, 0.7]) },
        b: { ref: colour("Violet", [0.5, 0.15, 0.6]) },
      }) },
    }),
  },
];

//! The floor the spheres stand on, so there is something for the light to
//! bounce off and something for a shadow to land on. Without it every sphere
//! is lit only by the dome and the gallery reads as eight stickers.
const slabOrigin = add({ id: "SLAB0", type: "Point", name: "Slab corner",
  args: { x: -SPACING, y: -SPACING, z: -RADIUS - 24 } });
add({ id: "SLAB", type: "Cube", name: "Floor slab",
  args: { origin: { ref: slabOrigin },
          dx: SPACING * (COLS + 1), dy: SPACING * (Math.ceil(GALLERY.length / COLS) + 1),
          dz: 24 } });

GALLERY.forEach((entry, i) => {
  const col = i % COLS, row = Math.floor(i / COLS);
  const x = col * SPACING, y = -row * SPACING;
  const centre = add({ id: "C" + i, type: "Point", name: entry.label + " centre",
                       args: { x, y, z: 0 } });
  const ball = add({ id: "S" + i, type: "Sphere", name: entry.label,
                     args: { center: { ref: centre }, radius: RADIUS } });
  add({ id: "T" + i, type: "Tag", name: entry.label + " label",
        args: { at: { ref: centre }, note: entry.label, lift: RADIUS + 60 } });
  add({ id: "M" + i, type: "Material", name: entry.label + " material",
        args: { of: [{ ref: ball }], ...entry.make() } });
});

const model = {
  format: "ocaf-parametric-model", version: 1,
  name: "Material gallery", units: "mm",
  note: "One sphere per material graph. Open it in Ray traced or in the "
      + "showroom: the glass refracts, the lit panel lights the slab, and the "
      + "worn paint is a noise field used as a mask on both the colour and the "
      + "roughness. Built by scripts/build_materialgallery.mjs.",
  features,
};
writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("wrote " + OUT + "  " + GALLERY.length + " materials, "
            + features.length + " features");
