// The Rack package: data-centre racks, to LOD 400.
//
// A rack is the easiest thing in the world to model badly. Four posts, some
// shelves, a box for a server - it looks right in ten minutes and it is wrong
// in every way that matters: the U pitch is 44 mm instead of 44.45, the holes
// are evenly spaced instead of 5/8-5/8-1/2, the strut is drawn as a plain box
// with no slot for the fixing to go in, and there is no bolt anywhere because
// bolts are fiddly. None of that shows on screen. All of it shows on site.
//
// So this package is built the other way round. Every dimension comes out of
// rack.js, where it sits against the standard it came from; every beam is an
// extrusion of a NAMED SECTION which can be switched for another without
// touching anything else; every hole is generated from the pattern rather than
// drawn; and every fastener is a real fastener with its standard on it.
//
// WHAT LOD 400 MEANS HERE, since it is a term people use loosely: the model
// carries the geometry and the information needed to fabricate and assemble
// from it. Concretely -
//
//   · sections are the supplier's published sections, switchable by name;
//   · holes are where the standard puts them, not where they look right;
//   · fasteners are modelled to the standard they conform to, and a Fastener
//     takes the supplier's OWN STEP file as an input - wire it and the
//     modelled stand-in is replaced by the bought part;
//   · every part carries a supplier reference you fill in, and the Bill node
//     reads them back off the model as a bill of materials.
//
// AND WHAT IS NOT CLAIMED. This package does not ship anybody's part files and
// does not print a part number it has not read - see the note in rack.js. It
// ships the geometry of the standards, the machinery to swap in the bought
// part, and a bill that carries whatever reference you put on it.

import { ARG, F } from "./ocaf.js";
import { offerPlugin } from "./plugin.js";
import { FASTENERS, RACK_STANDARDS, STRUT_PROFILES, bomLines, fastener, hexOutline,
         holeCentres, rackHeight, rackStandard, strutHoles, strutProfile } from "./rack.js";

const standardNames = RACK_STANDARDS.map(one => one.name);
const profileNames = STRUT_PROFILES.map(one => one.name);
const fastenerNames = FASTENERS.map(one => one.name);

/* -------------------------------------------------------------- the nodes */

export const RACK_NODES = [
  //! THE SECTION, AS A FEATURE OF ITS OWN. A choice on an argument is a number
  //! stored on that one feature and it cannot be wired, so a frame, its braces
  //! and its rails each carried their OWN idea of what section the rack was
  //! built from - and changing the rack's section meant changing every one of
  //! them by hand, which is not a parametric model, it is a model with
  //! parameters in it. This is the section itself: one feature, wired into
  //! every member that is made of it, changed in one place.
  { type: "StrutSection", guid: "9a1b2c30-00db-4c00-9e00-caf0000000db", category: "data",
    produces: "text",
    summary: "One section, shared. Wire it into a Strut, a rack frame or a cable tray and "
           + "that member is made of this section - so switching a whole rack from a 40 "
           + "T-slot to a 45, or to a 41 mm channel, is one change in one place instead of "
           + "one per beam. A member with nothing wired in keeps its own choice, so this "
           + "is something to reach for and not something to have to set up.",
    args: [ARG.choice("profile", "Section", profileNames, 2)] },

  { type: "Strut", guid: "9a1b2c30-00d4-4c00-9e00-caf0000000d4", category: "body",
    produces: "solid",
    summary: "A length of strut, extruded from a named section and drilled on a pitch. "
           + "The section is a choice, so a beam changes from a 40 T-slot to a 41 mm "
           + "channel without anything else moving - which is the whole reason for "
           + "modelling a frame this way rather than as boxes. Holes are generated from "
           + "the pitch and the set-back, so a longer strut gets more of them.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.choice("profile", "Section", profileNames, 2),
           ARG.real("length", "Length", 1000, 10, 12000, 5),
           ARG.choice("holes", "Holes", ["None", "Round, through", "Round, one face"], 0),
           ARG.when(ARG.real("bore", "Hole", 9, 1, 40, 0.5), "holes", 1),
           ARG.when(ARG.real("pitch", "Pitch", 50, 5, 1000, 1), "holes", 1),
           ARG.when(ARG.real("setback", "First hole at", 25, 0, 1000, 1), "holes", 1),
           ARG.when(ARG.real("bore2", "Hole", 9, 1, 40, 0.5), "holes", 2),
           ARG.when(ARG.real("pitch2", "Pitch", 50, 5, 1000, 1), "holes", 2),
           ARG.when(ARG.real("setback2", "First hole at", 25, 0, 1000, 1), "holes", 2),
           ARG.text("supplier", "Supplier ref", "", "your own part number"),
           //! APPENDED, because an argument's place in this list IS its tag in
           //! the document and inserting one renumbers every argument after it.
           ARG.spare("section", "Section from", ["StrutSection"])] },

  { type: "RackPost", guid: "9a1b2c30-00d5-4c00-9e00-caf0000000d5", category: "body",
    produces: "solid",
    summary: "One mounting post, drilled to the standard: square cage-nut holes, round "
           + "clearance holes or tapped, at the standard's own pattern - three to a U at "
           + "5/8, 5/8 and 1/2 of an inch, which is the spacing everybody draws evenly "
           + "and is not. Height is in units, so 42U and 47U are one number apart. The "
           + "flange is bent from one plate, so the section is right at the corner where "
           + "the equipment ear lands.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.choice("standard", "Standard", standardNames, 0),
           ARG.real("units", "Height", 42, 1, 60, 1, "U"),
           ARG.choice("holes", "Holes", ["Square, for cage nuts", "Round clearance", "None"], 0),
           ARG.real("width", "Flange width", 50, 20, 200, 1),
           ARG.real("wall", "Thickness", 2, 0.5, 10, 0.1),
           ARG.real("bore", "Round hole", 7, 1, 20, 0.1),
           //! The pattern the standard does not publish, when it does not.
           ARG.text("pattern", "Hole pattern", "", "mm up each unit, comma separated"),
           ARG.text("supplier", "Supplier ref", "", "your own part number")] },

  { type: "RackFrame", guid: "9a1b2c30-00d6-4c00-9e00-caf0000000d6", category: "body",
    produces: "solid",
    summary: "The whole frame in one node: four posts at the standard's hole spacing, "
           + "the base and top rails between them, and as many intermediate rails as you "
           + "ask for, spread evenly up the height. Change the height in U and every rail "
           + "restacks. Change the section and every member changes with it. This is the "
           + "node that shows what a parametric frame is: two numbers and it is a "
           + "different rack.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.choice("standard", "Standard", standardNames, 0),
           ARG.real("units", "Height", 42, 1, 60, 1, "U"),
           ARG.real("depth", "Depth", 1070, 200, 2000, 10),
           ARG.choice("profile", "Frame section", profileNames, 2),
           ARG.real("rails", "Intermediate rails", 2, 0, 12, 1, ""),
           ARG.choice("posts", "Mounting posts", ["Front and back", "Front only", "None"], 0),
           ARG.real("postWidth", "Post flange", 50, 20, 200, 1),
           ARG.text("supplier", "Supplier ref", "", "your own part number"),
           ARG.spare("section", "Section from", ["StrutSection"])] },

  { type: "Fastener", guid: "9a1b2c30-00d7-4c00-9e00-caf0000000d7", category: "body",
    produces: "solid",
    summary: "A bolt, nut, washer or cage nut, modelled to the standard it conforms to - "
           + "across the flats, head height and pitch all from the standard, not drawn by "
           + "eye. WIRE THE SUPPLIER'S OWN STEP FILE into Bought part and it is used "
           + "instead, which is the LOD 400 path: modelled until the real file arrives, "
           + "the real file after that. The supplier reference travels with it into the "
           + "bill of materials and into a STEP export.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.choice("part", "Part", fastenerNames, 0),
           ARG.real("length", "Length", 0, 0, 300, 0.5),
           ARG.choice("thread", "Thread", ["Drawn as a cylinder", "Cut, as a helix"], 0),
           ARG.ref("bought", "Bought part", ["solid"]),
           ARG.text("supplier", "Supplier ref", "", "your own part number")] },

  { type: "CableTray", guid: "9a1b2c30-00d8-4c00-9e00-caf0000000d8", category: "body",
    produces: "solid",
    summary: "A ladder tray: two side rails of a named section with rungs across them on "
           + "a pitch. The rungs are patterned from the length, so a longer tray gets "
           + "more of them and they stay on the pitch - which is what cable management "
           + "has to do to be worth modelling at all.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.real("length", "Length", 1000, 100, 12000, 10),
           ARG.real("width", "Width", 300, 50, 1200, 10),
           ARG.choice("profile", "Side rail", profileNames, 6),
           ARG.real("pitch", "Rung pitch", 250, 25, 2000, 5),
           ARG.real("rung", "Rung", 20, 5, 100, 1),
           ARG.text("supplier", "Supplier ref", "", "your own part number"),
           ARG.spare("section", "Section from", ["StrutSection"])] },

  { type: "RackDevice", guid: "9a1b2c30-00d9-4c00-9e00-caf0000000d9", category: "body",
    produces: "solid",
    summary: "A piece of equipment in the rack, at a unit number: chassis, ears, and the "
           + "gap the standard leaves round it so two of them stacked do not foul. Give "
           + "it the U it sits at and the U it is tall and it lands exactly on the hole "
           + "pattern - which is the check that the frame and the equipment agree.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.choice("standard", "Standard", standardNames, 0),
           //! NOT "at": the placement point is already called that, on every
           //! node in this package and in the catalogue. Two arguments with one
           //! key is a model file that refuses to open, and it opens by
           //! refusing the wire rather than the argument - "NODE.at references
           //! an unknown feature" - which sends you looking in the wrong place.
           ARG.real("unit", "At unit", 1, 1, 60, 1, "U"),
           ARG.real("units", "Height", 1, 1, 20, 1, "U"),
           ARG.real("depth", "Depth", 750, 50, 1500, 5),
           ARG.real("inset", "Set back", 25, -200, 400, 1),
           ARG.choice("ears", "Mounting", ["Ears both sides", "No ears"], 0),
           ARG.text("supplier", "Supplier ref", "", "make and model")] },

  { type: "Bill", guid: "9a1b2c30-00da-4c00-9e00-caf0000000da", category: "analysis",
    produces: "text",
    summary: "The bill of materials, read off the model. Wire a set into it and it walks "
           + "everything inside, counts each distinct part and prints it with whatever "
           + "supplier reference the part carries. A bill written beside a model is wrong "
           + "by the second revision; this one cannot be, because it is the model.",
    //! ANYTHING. A bill is of a set, usually - but it is also of one part, and
    //! an EMPTY set produces nothing, so a list of kinds would refuse the wire
    //! at exactly the moment somebody makes the set and then fills it.
    args: [ARG.ref("of", "Of", ARG.ANY, true),
           ARG.choice("show", "Show", ["Everything", "Fasteners only", "Sections only"], 0)] },
];

/* ------------------------------------------------------------ the drivers */

function rackDrivers(kit) {
  const K = kit.toolkit();
  const { F: KF, hybrid: H, shape: S } = K;

  //! WHERE A NODE SITS. Every one of these takes a plane and an optional point,
  //! exactly like the catalogue's own bodies, so a rack part is placed the way
  //! everything else in this program is placed and nothing new has to be learnt.
  //! planeAxis hands back a gp_Ax2 - the thing the box and cylinder factories
  //! want - and this package also needs to do its own arithmetic in that frame,
  //! so the three directions are read off it once. Read off the Ax2 rather
  //! than recomputed from the plane's normal, because the X direction a plane
  //! carries is the one everything else in the document is already lined up to.
  const frameOf = f => {
    const plane = KF.reference(f, "plane");
    const ax = plane ? K.planeAxis(plane) : null;
    let origin = [0, 0, 0], x = [1, 0, 0], z = [0, 0, 1];
    if (ax) {
      const at = ax.Location(), dir = ax.Direction(), along = ax.XDirection();
      origin = [at.X(), at.Y(), at.Z()];
      z = [dir.X(), dir.Y(), dir.Z()];
      x = [along.X(), along.Y(), along.Z()];
    }
    const put = K.readPoint(KF.reference(f, "at"));
    if (put) origin = put;
    const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
    return { origin, x, y, z };
  };
  const world = (frame, u, v, w) => [
    frame.origin[0] + frame.x[0] * u + frame.y[0] * v + frame.z[0] * w,
    frame.origin[1] + frame.x[1] * u + frame.y[1] * v + frame.z[1] * w,
    frame.origin[2] + frame.x[2] * u + frame.y[2] * v + frame.z[2] * w,
  ];

  //! A box in the node's own frame, from one corner, sized along the frame's
  //! three directions. Written once because every part in here is made of them.
  const slab = (frame, at, du, dv, dw) => {
    const corner = world(frame, at[0], at[1], at[2]);
    const ax = new K.oc.gp_Ax2(
      new K.oc.gp_Pnt(corner[0], corner[1], corner[2]),
      new K.oc.gp_Dir(frame.z[0], frame.z[1], frame.z[2]),
      new K.oc.gp_Dir(frame.x[0], frame.x[1], frame.x[2]));
    return S.box(ax, Math.abs(du) || 0.01, Math.abs(dv) || 0.01, Math.abs(dw) || 0.01);
  };

  //! A round hole, as a cylinder to cut with. Longer than the thing it goes
  //! through at both ends, because a cut that ends exactly on a face leaves a
  //! zero-thickness sliver that every kernel in the world reports differently.
  const drill = (frame, at, way, radius, through) => {
    const start = world(frame, at[0], at[1], at[2]);
    const dir = way === "u" ? frame.x : way === "v" ? frame.y : frame.z;
    const back = [start[0] - dir[0], start[1] - dir[1], start[2] - dir[2]];
    const ax = new K.oc.gp_Ax2(new K.oc.gp_Pnt(back[0], back[1], back[2]),
                               new K.oc.gp_Dir(dir[0], dir[1], dir[2]));
    return S.cylinder(ax, radius, through + 2);
  };

  //! An outline in the node's own frame, extruded along its normal. This is the
  //! one place a named section becomes geometry, so switching a section really
  //! is switching which list of points is asked for.
  const extrudeOutline = (frame, outline, at, length, along = "z") => {
    const dir = along === "u" ? frame.x : along === "v" ? frame.y : frame.z;
    const flat = along === "u" ? [frame.y, frame.z]
               : along === "v" ? [frame.z, frame.x] : [frame.x, frame.y];
    const pts = outline.map(([a, b]) => {
      const p = world(frame, at[0], at[1], at[2]);
      return [p[0] + flat[0][0] * a + flat[1][0] * b,
              p[1] + flat[0][1] * a + flat[1][1] * b,
              p[2] + flat[0][2] * a + flat[1][2] * b];
    });
    const wire = H.polyline(pts, true);
    const face = H.fill(wire);
    return S.pad(face, [dir[0] * length, dir[1] * length, dir[2] * length]);
  };

  //! ONE CUT, NOT A HUNDRED AND FORTY-FOUR. This took the tools one at a time,
  //! and each one was a whole boolean: a full intersection of the tool against
  //! a post that had grown more faces with every hole before it. Four posts of
  //! 144 holes was fifty-odd seconds of the minute a rack took to open, and
  //! the same fifty seconds every time the height moved - which is what turns
  //! a parametric model into one nobody drags. OpenCascade takes a compound as
  //! the tool of a cut and does the lot in one pass, so that is what it gets.
  const cutAll = (solid, tools) => {
    if (!tools.length) return solid;
    return tools.length === 1 ? S.remove(solid, tools[0])
                              : S.remove(solid, K.compoundOf(tools));
  };

  //! WHAT A MEMBER IS MADE OF. A wired StrutSection wins over the member's own
  //! choice, which is what makes one section change a whole frame; a member
  //! with nothing wired in reads its own, which is what makes the wire optional
  //! rather than something everybody has to set up before they can draw a beam.
  const sectionOf = (f, fallback) => {
    const shared = KF.reference(f, "section");
    const pick = shared ? K.F.choice(shared, "profile", fallback)
                        : K.F.choice(f, "profile", fallback);
    return STRUT_PROFILES[pick] || STRUT_PROFILES[fallback] || STRUT_PROFILES[2];
  };

  const supplierOf = f => String(KF.code(f, "supplier", "") || "").trim();

  //! WHAT A PART IS, read off the feature itself - its type, its arguments and
  //! the supplier reference on it. Not a string the driver writes into its own
  //! output for the Bill to parse back out: a bill that is assembled from
  //! smuggled text is a bill that goes wrong the first time somebody renames
  //! something, and a bill has to be exactly as true as the model.
  const partOf = one => {
    const spec = KF.spec(one);
    if (!spec) return null;
    const supplier = supplierOf(one);
    const round = v => Math.round(v);
    switch (spec.type) {
      case "Fastener": {
        const it = FASTENERS[KF.choice(one, "part", 0)] || FASTENERS[0];
        const bought = KF.reference(one, "bought");
        return { name: it.name, kind: "fastener", supplier,
                 from: bought ? "the bought part, as supplied" : it.from };
      }
      case "Strut": {
        //! THROUGH THE SAME READING THE DRIVER USES. A bill that read the
        //! member's own choice while the member was built from a wired section
        //! would order the section the rack is not made of - and would look
        //! right, because the number it read is really on the feature.
        const it = sectionOf(one, 2);
        return { name: it.name + " \u00b7 " + round(KF.real(one, "length", 1000)) + " mm",
                 kind: "section", from: it.from, supplier };
      }
      case "RackPost": {
        const std = RACK_STANDARDS[KF.choice(one, "standard", 0)] || RACK_STANDARDS[0];
        const units = Math.round(KF.real(one, "units", 42));
        return { name: "Rack post " + units + std.unitName, kind: "section",
                 from: std.name, supplier };
      }
      case "RackFrame": {
        const std = RACK_STANDARDS[KF.choice(one, "standard", 0)] || RACK_STANDARDS[0];
        const it = sectionOf(one, 2);
        return { name: "Rack frame " + Math.round(KF.real(one, "units", 42)) + std.unitName
                   + " \u00b7 " + it.name, kind: "section", from: std.name, supplier };
      }
      case "CableTray":
        return { name: "Cable tray " + round(KF.real(one, "width", 300)) + " \u00d7 "
                   + round(KF.real(one, "length", 1000)) + " mm",
                 kind: "section", from: "ladder tray", supplier };
      case "RackDevice": {
        const std = RACK_STANDARDS[KF.choice(one, "standard", 0)] || RACK_STANDARDS[0];
        const units = Math.round(KF.real(one, "units", 1));
        return { name: supplier || ("Device " + units + std.unitName), kind: "device",
                 from: units + std.unitName + " at " + std.unitName
                   + Math.round(KF.real(one, "unit", 1)), supplier };
      }
      default: return null;
    }
  };

  const readPattern = f => {
    const text = String(KF.code(f, "pattern", "") || "").trim();
    if (!text) return null;
    const list = text.split(/[,\s]+/).map(Number).filter(Number.isFinite);
    return list.length ? list : null;
  };

  return {
    //! IT BUILDS NOTHING. A section is not a body - it is what bodies are made
    //! of - so what it produces is its own description, which is what the tree
    //! shows and what tells you at a glance what the rack is made of.
    StrutSection: {
      precondition: f => null,
      build: f => {
        const spec = STRUT_PROFILES[K.F.choice(f, "profile", 2)] || strutProfile("ts40");
        return { data: K.text([spec.name, spec.from,
                               spec.w + " \u00d7 " + spec.h + " mm"]) };
      },
    },

    Strut: {
      precondition: f => {
        if (KF.real(f, "length", 1000) <= 0) return "a strut needs a length";
        return null;
      },
      build: f => {
        const frame = frameOf(f);
        const spec = sectionOf(f, 2);
        const length = KF.real(f, "length", 1000);
        let solid = extrudeOutline(frame, spec.outline(), [0, 0, 0], length, "z");
        const mode = K.F.choice(f, "holes", 0);
        if (mode > 0) {
          const bore = KF.real(f, mode === 1 ? "bore" : "bore2", 9) / 2;
          const pitch = KF.real(f, mode === 1 ? "pitch" : "pitch2", 50);
          const setback = KF.real(f, mode === 1 ? "setback" : "setback2", 25);
          const tools = strutHoles(length, pitch, setback).map(at =>
            drill(frame, [-spec.w / 2 - 1, 0, at], "u", bore,
                  mode === 1 ? spec.w + 2 : spec.w / 2 + 1));
          if (tools.length) solid = cutAll(solid, tools);
        }
        return { shape: solid,
                 data: K.text([spec.name, spec.from,
                               Math.round(length) + " mm long"]) };
      },
    },

    RackPost: {
      precondition: f => {
        const spec = rackStandard(RACK_STANDARDS[K.F.choice(f, "standard", 0)].key);
        if (K.F.choice(f, "holes", 0) !== 2 && !spec.holes && !readPattern(f))
          return spec.name + " does not publish a post hole pattern here - type one into "
            + "Hole pattern, as millimetres up each " + spec.unitName;
        return null;
      },
      build: f => {
        const frame = frameOf(f);
        const spec = RACK_STANDARDS[K.F.choice(f, "standard", 0)] || RACK_STANDARDS[0];
        const units = Math.max(1, Math.round(KF.real(f, "units", 42)));
        const width = KF.real(f, "width", 50);
        const wall = KF.real(f, "wall", 2);
        const high = rackHeight(spec.key, units);
        const mode = K.F.choice(f, "holes", 0);
        //! AN ANGLE, not a flat: the post is bent from one plate so the ear of
        //! a device lands on the flange and the load goes into the web. Drawn
        //! as the two legs it is, which is what decides where the hole column
        //! sits relative to the frame.
        const leg = [[0, 0], [width, 0], [width, wall], [wall, wall], [wall, width], [0, width]];
        let solid = extrudeOutline(frame, leg, [0, 0, 0], high, "z");
        const at = holeCentres(spec.key, units, readPattern(f));
        const tools = [];
        //! The hole column sits half the flange width in from the corner, which
        //! is where the standard's 465.1 between columns is measured to.
        const line = width / 2;
        for (const z of at) {
          if (mode === 0) {
            const s = spec.square;
            tools.push(slab(frame, [line - s / 2, -1, z - s / 2], s, wall + 2, s));
          } else if (mode === 1) {
            tools.push(drill(frame, [line, -1, z], "v", KF.real(f, "bore", 7) / 2, wall + 2));
          }
        }
        if (tools.length) solid = cutAll(solid, tools);
        return { shape: solid,
                 data: K.text([spec.name, units + spec.unitName + " · "
                                 + high.toFixed(2) + " mm",
                               at.length + " holes · "
                                 + (mode === 0 ? spec.square + " mm square"
                                    : mode === 1 ? "ø" + KF.real(f, "bore", 7) : "none")]) };
      },
    },

    RackFrame: {
      precondition: f => (KF.real(f, "depth", 1070) > 0 ? null : "a frame needs a depth"),
      build: f => {
        const frame = frameOf(f);
        const spec = RACK_STANDARDS[K.F.choice(f, "standard", 0)] || RACK_STANDARDS[0];
        const units = Math.max(1, Math.round(KF.real(f, "units", 42)));
        const depth = KF.real(f, "depth", 1070);
        const section = sectionOf(f, 2);
        const rails = Math.max(0, Math.round(KF.real(f, "rails", 2)));
        const postWidth = KF.real(f, "postWidth", 50);
        const high = rackHeight(spec.key, units);
        const w = section.w, h = section.h;
        //! THE FRAME IS AS WIDE AS THE STANDARD SAYS, plus the posts it has to
        //! carry: the hole columns are 465.1 apart and everything else is
        //! measured out from there, which is why this is a sum and not a
        //! parameter somebody types.
        const inner = spec.columns + postWidth;
        const across = inner + w * 2;
        const parts = [];
        //! Four legs.
        for (const [u, v] of [[0, 0], [across - w, 0], [0, depth - h], [across - w, depth - h]])
          parts.push(extrudeOutline(frame, section.outline(),
                                    [u + w / 2, v + h / 2, 0], high, "z"));
        //! Rails across the front and back, and along the sides, at the bottom,
        //! the top, and evenly between - which is the pattern the user asked
        //! for: one number, and the rack restacks.
        const levels = [h / 2];
        for (let i = 1; i <= rails; i++) levels.push((high * i) / (rails + 1));
        levels.push(high - h / 2);
        //! FROM WHERE EACH ONE STARTS, not from the middle of where it ends up.
        //! extrudeOutline centres the section on the point it is given and runs
        //! from there, so a rail that spans between the legs starts at the
        //! inside face of one of them - which put the frame 455 mm deeper than
        //! it was asked for until it was measured.
        for (const z of levels) {
          parts.push(extrudeOutline(frame, section.outline(), [w, h / 2, z],
                                    across - w * 2, "u"));
          parts.push(extrudeOutline(frame, section.outline(), [w, depth - h / 2, z],
                                    across - w * 2, "u"));
          parts.push(extrudeOutline(frame, section.outline(), [w / 2, h, z],
                                    depth - h * 2, "v"));
          parts.push(extrudeOutline(frame, section.outline(), [across - w / 2, h, z],
                                    depth - h * 2, "v"));
        }
        const bill = [
          spec.name + " · " + units + spec.unitName,
          section.name,
          across.toFixed(1) + " × " + depth + " × " + high.toFixed(1) + " mm",
          (4 + levels.length * 4) + " members",
        ];
        return { shape: K.compoundOf(parts), data: K.text(bill) };
      },
    },

    Fastener: {
      precondition: f => null,
      build: f => {
        const frame = frameOf(f);
        const spec = FASTENERS[K.F.choice(f, "part", 0)] || fastener("hex-m6-16");
        const bought = KF.reference(f, "bought");
        const supplier = supplierOf(f);
        const bill = [spec.name, spec.from + (supplier ? " \u00b7 " + supplier : "")];
        //! THE BOUGHT PART WINS. Wire the supplier's own STEP in and the
        //! modelled stand-in is not built at all - which is the whole point of
        //! having the input, and is why this is the first thing asked.
        if (bought && KF.shape(bought))
          return { shape: K.asItWas ? K.asItWas(KF.shape(bought)) : KF.shape(bought),
                   data: K.text([...bill, "the bought part, as supplied"]),
                   note: "the bought part" };
        const length = KF.real(f, "length", 0) || spec.length || 16;
        const r = spec.thread / 2;
        let solid;
        if (spec.kind === "nut") {
          solid = extrudeOutline(frame, hexOutline(spec.flats), [0, 0, 0], spec.headHeight, "z");
          solid = S.remove(solid, drill(frame, [0, 0, -1], "z", r, spec.headHeight + 2));
        } else if (spec.kind === "washer") {
          const ax = new K.oc.gp_Ax2(
            new K.oc.gp_Pnt(...world(frame, 0, 0, 0)),
            new K.oc.gp_Dir(frame.z[0], frame.z[1], frame.z[2]));
          solid = S.remove(S.cylinder(ax, spec.headDia / 2, spec.headHeight),
                           drill(frame, [0, 0, -1], "z", r * 1.1, spec.headHeight + 2));
        } else if (spec.kind === "cage") {
          //! A cage nut is a square of spring steel wrapped round a nut, and
          //! what matters is the square: it is what fits the 9.5 mm hole.
          const s = spec.flats;
          solid = slab(frame, [-s / 2, -s / 2, 0], s, s, spec.headHeight);
          solid = S.add(solid, extrudeOutline(frame, hexOutline(s * 0.9),
                                              [0, 0, spec.headHeight], 4, "z"));
          solid = S.remove(solid, drill(frame, [0, 0, -1], "z", r, spec.headHeight + 6));
        } else {
          //! A bolt: head, then shank. The head is a hexagon across the flats
          //! or a cylinder with a socket, depending on which it is.
          const head = spec.kind === "cap"
            ? S.remove(
                S.cylinder(new K.oc.gp_Ax2(new K.oc.gp_Pnt(...world(frame, 0, 0, 0)),
                                           new K.oc.gp_Dir(frame.z[0], frame.z[1], frame.z[2])),
                           (spec.headDia || spec.flats) / 2, spec.headHeight),
                extrudeOutline(frame, hexOutline(spec.drive || 4),
                               [0, 0, spec.headHeight - (spec.drive || 4) * 0.6],
                               (spec.drive || 4) * 0.6 + 1, "z"))
            : extrudeOutline(frame, hexOutline(spec.flats), [0, 0, 0], spec.headHeight, "z");
          const shankAx = new K.oc.gp_Ax2(
            new K.oc.gp_Pnt(...world(frame, 0, 0, -length)),
            new K.oc.gp_Dir(frame.z[0], frame.z[1], frame.z[2]));
          solid = S.add(head, S.cylinder(shankAx, r, length));
        }
        return { shape: solid,
                 data: K.text([...bill, "modelled to the standard · wire the "
                   + "supplier's STEP into Bought part to replace it"]) };
      },
    },

    CableTray: {
      precondition: f => (KF.real(f, "length", 1000) > 0 ? null : "a tray needs a length"),
      build: f => {
        const frame = frameOf(f);
        const section = sectionOf(f, 6);
        const length = KF.real(f, "length", 1000);
        const width = KF.real(f, "width", 300);
        const pitch = KF.real(f, "pitch", 250);
        const rung = KF.real(f, "rung", 20);
        const parts = [
          extrudeOutline(frame, section.outline(), [0, 0, 0], length, "u"),
          extrudeOutline(frame, section.outline(), [0, width, 0], length, "u"),
        ];
        //! THE RUNGS ARE PATTERNED FROM THE LENGTH, which is the difference
        //! between a tray that is modelled and a tray that is drawn: make it
        //! longer and there are more of them, still on the pitch.
        const at = strutHoles(length, pitch, pitch / 2);
        for (const x of at)
          parts.push(slab(frame, [x - rung / 2, 0, -rung / 2], rung, width, rung));
        return { shape: K.compoundOf(parts),
                 data: K.text([section.name,
                               at.length + " rungs at " + pitch + " mm"]) };
      },
    },

    RackDevice: {
      precondition: f => null,
      build: f => {
        const frame = frameOf(f);
        const spec = RACK_STANDARDS[K.F.choice(f, "standard", 0)] || RACK_STANDARDS[0];
        const at = Math.max(1, Math.round(KF.real(f, "unit", 1)));
        const units = Math.max(1, Math.round(KF.real(f, "units", 1)));
        const depth = KF.real(f, "depth", 750);
        const inset = KF.real(f, "inset", 25);
        const ears = K.F.choice(f, "ears", 0) === 0;
        //! THE GAP THE STANDARD LEAVES, and it is one gap and not two. A 1U
        //! chassis is not 44.45 tall: EIA-310-E caps it at 1.719 inches, which
        //! is 44.45 less 0.031 of an inch - 0.787 mm IN TOTAL, split between
        //! the two boundaries. Taking 0.031" off each end instead makes every
        //! 1U device 42.86 and looks perfectly reasonable on screen; it is
        //! 0.8 mm of daylight per unit that is not there in the rack.
        const clear = 25.4 * 0.031;
        const high = spec.unit * units - clear;
        const low = spec.unit * (at - 1) + clear / 2;
        //! PLACED FROM ITS OWN POINT, and the point is the left-hand end of the
        //! panel: put it where the panel starts and the panel starts there.
        //! The first version worked the width out from the standard's hole
        //! spacing and put the chassis wherever that landed, which is a hidden
        //! offset - and a hidden offset in a node whose whole job is to land on
        //! a hole pattern is the one thing that must not be hidden.
        const bodyWide = spec.panel - 40;
        const ear = 20;
        const parts = [slab(frame, [ear, inset, low], bodyWide, depth, high)];
        if (ears) {
          //! The ears reach out to the full panel width and are 2 mm thick,
          //! which is what stands between the chassis and the post.
          parts.push(slab(frame, [0, inset - 2, low], ear, 2, high));
          parts.push(slab(frame, [ear + bodyWide, inset - 2, low], ear, 2, high));
        }
        return { shape: K.compoundOf(parts),
                 data: K.text([(supplierOf(f) || ("Device " + units + spec.unitName)),
                               "at " + spec.unitName + at + ", " + units
                                 + spec.unitName + " tall",
                               high.toFixed(2) + " mm over "
                                 + (spec.unit * units).toFixed(2) + " of rack"]) };
      },
    },

    Bill: {
      precondition: f => (KF.reference(f, "of") ? null : "nothing wired in to count"),
      build: f => {
        const want = K.F.choice(f, "show", 0);
        const of = KF.reference(f, "of");
        //! WALKED OFF THE MODEL, and off the model only. Wire a set in and this
        //! is every feature filed inside it, however deep; wire one part in and
        //! it is that part. What each one IS comes from its own type and its
        //! own arguments - see partOf - so a bill cannot disagree with the
        //! thing it is a bill of, which is the only property a bill needs.
        const doc = K.doc ? K.doc() : null;
        const found = [of, ...(doc && doc.isContainer(of) ? doc.within(of) : [])];
        //! A PATTERN IS AS MANY PARTS AS IT MAKES. An Array of twelve bolts is
        //! one feature in the tree and twelve bolts in the van, and a bill that
        //! counts the feature is a bill that orders one. So a pattern is
        //! followed to what it repeats and that part is counted its own number
        //! of times - which is the only reason patterning parts is safe.
        //! AND WHAT HAS BEEN CONSUMED IS NOT A PART. An Array takes its source
        //! - the catalogue says so, with `consumes` on the argument - so the
        //! one bolt the pattern was made from is not a bolt in the van beside
        //! the twenty-four it made. Counting it gave 25 where there are 24,
        //! which is exactly the kind of quietly-wrong number a bill must not
        //! have. Asked of the catalogue rather than special-cased for Array,
        //! so an extrude that eats its profile is handled by the same line.
        const eaten = new Set();
        for (const one of found) {
          const spec = KF.spec(one);
          for (const arg of (spec && spec.args) || []) {
            if (arg.kind !== "ref" || !arg.consumes) continue;
            const source = KF.reference(one, arg.key);
            if (source) eaten.add(source);
          }
        }
        const parts = [];
        for (const one of found) {
          if (eaten.has(one)) continue;
          const spec = KF.spec(one);
          if (spec && spec.type === "Array") {
            const source = partOf(KF.reference(one, "source"));
            if (!source) continue;
            const many = KF.choice(one, "mode", 0) === 1
              ? Math.max(1, Math.round(KF.real(one, "count", 6)))
              : Math.max(1, Math.round(KF.real(one, "countX", 3)))
                * Math.max(1, Math.round(KF.real(one, "countY", 1)))
                * Math.max(1, Math.round(KF.real(one, "countZ", 1)));
            for (let i = 0; i < many; i++) parts.push(source);
            continue;
          }
          const part = partOf(one);
          if (part) parts.push(part);
        }
        const kept = parts.filter(one => want === 0
          || (want === 1 && one.kind === "fastener")
          || (want === 2 && one.kind === "section"));
        const lines = bomLines(kept);
        const total = kept.reduce((n, one) => n + 1, 0);
        return { data: K.text(lines.length
          ? [...lines, "", total + " parts \u00b7 " + lines.length + " lines"]
          : ["nothing in there is a part this package knows about"]) };
      },
    },
  };
}

export const RACK = offerPlugin({
  id: "rack",
  name: "Racks & Enclosures",
  version: 1,
  summary: "Data-centre racks to LOD 400: frames and posts drilled to EIA-310-E, struts "
         + "extruded from named sections you can switch, fasteners modelled to the "
         + "standard they conform to - with an input for the supplier's own STEP file - "
         + "cable management, and a bill of materials read off the model.",
  needs: [],
  nodes: RACK_NODES,
  api: {
    name: "RackFactory",
    summary: "The standards, the sections and the fasteners, as data.",
    operations: [
      { name: "rackStandard", takes: "key", gives: "standard",
        summary: "EIA-310-E or OCP Open Rack v3, with every dimension and its source." },
      { name: "holeCentres", takes: "standard, units, pattern", gives: "numbers",
        summary: "Every mounting hole up a post, from the bottom of unit 1." },
      { name: "strutProfile", takes: "key", gives: "section",
        summary: "A named strut section and its outline, in its own plane." },
      { name: "bomOf", takes: "parts", gives: "rows",
        summary: "One row per distinct part, counted, in the order the model is in." },
    ],
  },
  drivers: rackDrivers,
  async start() {
    //! Nothing to unpack: the standards are a few hundred numbers and they are
    //! in the source, where they can be read against the document they came
    //! from. A package that loads instantly is a package nobody minds loading.
    return { standards: RACK_STANDARDS, sections: STRUT_PROFILES, fasteners: FASTENERS };
  },
});
