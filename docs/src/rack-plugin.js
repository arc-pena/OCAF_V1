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
import { PERFORATIONS, THREADS, openArea, perforation, perforationCentres,
         threadProfile } from "./rack.js";
import { FLOOR_PEDESTAL, FLOOR_TILES, HANGER_RODS, ROD_STRESS_AREA, rodCapacity,
         tileFlow, tilePitch } from "./rack.js";
import { ENTOURAGE, ENTOURAGE_NAMES, entourageAt } from "./entourage.js";
import { FASTENERS, RACK_STANDARDS, STRUT_PROFILES, bomLines, fastener, hexOutline,
         holeCentres, rackHeight, rackStandard, strutHoles, strutProfile } from "./rack.js";

const standardNames = RACK_STANDARDS.map(one => one.name);
const profileNames = STRUT_PROFILES.map(one => one.name);
const fastenerNames = FASTENERS.map(one => one.name);
const perforationNames = PERFORATIONS.map(one => one.name);
const threadNames = THREADS.map(one => one.name);
const tileNames = FLOOR_TILES.map(one => one.name);

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
           ARG.spare("section", "Section from", ["StrutSection"]),
           //! APPENDED. Only read when the standard publishes no width of its
           //! own - Open Rack Wide is the case, and the feature says so.
           ARG.real("width", "Frame width", 0, 0, 2000, 5)] },

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

  { type: "RackDoor", guid: "9a1b2c30-00dc-4c00-9e00-caf0000000dc", category: "body",
    produces: "solid",
    summary: "A perforated rack door, at the level of detail one is bought at. The "
           + "panel is punched - round on a square or a 60 degree pitch, oblong slots, "
           + "or hex - and what it REPORTS is the open area, computed off the holes it "
           + "actually cut: that percentage is what a door is specified by, because "
           + "below about 65% the door is the restriction rather than the fans. It "
           + "carries a frame, a returned edge, hinges and a lock, and it says when it "
           + "misses the open area it was asked for.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.real("units", "Height", 48, 1, 60, 1, "U"),
           ARG.real("width", "Width", 600, 200, 1200, 5),
           ARG.real("sheet", "Sheet", 1.5, 0.5, 6, 0.1),
           ARG.real("frame", "Frame border", 40, 0, 200, 5),
           ARG.choice("perf", "Perforation", perforationNames, 1),
           //! 5.5 on a 6 mm staggered pitch is 76% open, which is what a modern
           //! high-density door is bought at. 4 on 6 is 40% - a perfectly real
           //! punch, and a door that would be the restriction rather than the fans.
           ARG.real("hole", "Hole", 5.5, 0.5, 40, 0.5),
           ARG.when(ARG.real("slot", "Slot length", 12, 1, 120, 1), "perf", 3),
           ARG.real("pitchX", "Pitch across", 6, 1, 200, 0.5),
           //! A 60 degree pattern's row pitch IS its across-pitch times root
           //! three over two; 5.196 to 6 is what makes the pattern triangular.
           ARG.real("pitchY", "Pitch up", 5.196, 1, 200, 0.001),
           ARG.real("wantOpen", "Open area wanted", 70, 0, 95, 1, "%"),
           ARG.choice("lock", "Lock", ["None", "Swing handle", "Cam lock"], 1),
           ARG.choice("hinge", "Hinge side", ["Left", "Right", "None"], 0),
           ARG.text("supplier", "Supplier ref", "", "your own part number")] },

  { type: "LevellingFoot", guid: "9a1b2c30-00dd-4c00-9e00-caf0000000dd", category: "body",
    produces: "solid",
    summary: "A screwable levelling foot: a base, a threaded stud and an adjusting nut. "
           + "A loaded rack is over a tonne standing on four of these, so the thread is "
           + "geometry rather than a note - Cut gives a real helical ISO 68-1 groove "
           + "swept along a true helix, which is what LOD 400 means and what costs "
           + "something to build. Plain leaves a smooth stud for when it does not.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.choice("thread", "Thread", threadNames, 4),
           ARG.real("stud", "Stud length", 90, 10, 400, 5),
           ARG.real("travel", "Adjustment", 40, 0, 200, 5),
           ARG.real("base", "Base", 80, 20, 300, 5),
           ARG.real("plate", "Base thickness", 10, 2, 50, 1),
           ARG.choice("cut", "Thread", ["Plain stud", "Cut thread"], 0),
           ARG.text("supplier", "Supplier ref", "", "your own part number"),
           //! APPENDED - an argument's place in this list is its tag.
           ARG.when(ARG.real("threaded", "Threaded length", 60, 5, 200, 5), "cut", 1)] },

  //! ------------------------------------------------------------- the hall

  { type: "FloorTile", guid: "9a1b2c30-00de-4c00-9e00-caf0000000de", category: "body",
    produces: "solid",
    summary: "One raised access floor panel, on the 600 module, with the pedestal and "
           + "the stringers that carry it. Solid, punched or a cast directional grate - "
           + "and what it REPORTS is the open area it actually cut and the air that will "
           + "pass through it at plenum pressure, which is what a hall is laid out "
           + "against: a cabinet drawing 15 kW in front of a solid panel is a cabinet "
           + "that overheats, and the model is where that should be visible.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.choice("tile", "Panel", tileNames, 0),
           ARG.real("grid", "Module", 600, 300, 1200, 5),
           //! ZERO MEANS THE PANEL'S OWN, which is 32 for a steel panel and 38
           //! for a casting. Two thicknesses for one panel - one in the table
           //! and one as a default here - is two ideas of the same thing, and
           //! the one that wins is whichever the driver happens to read.
           ARG.real("thick", "Panel", 0, 0, 80, 1),
           //! The panel is the module less the joint between panels, so two
           //! panels on adjacent modules do not share a face.
           ARG.real("joint", "Joint", 1, 0, 10, 0.5),
           ARG.choice("under", "Understructure",
                      ["Pedestal and stringers", "Pedestal only", "None"], 0),
           ARG.real("height", "Finished floor", 600, 100, 1800, 10),
           ARG.real("plenum", "Plenum pressure", 25, 0, 100, 1, "Pa"),
           ARG.text("supplier", "Supplier ref", "", "your own part number")] },

  { type: "CeilingHanger", guid: "9a1b2c30-00df-4c00-9e00-caf0000000df", category: "body",
    produces: "solid",
    summary: "The trapeze a cable runway hangs from: two threaded rods to the slab, a "
           + "channel across them and the nuts that hold it. A runway drawn floating at "
           + "2.6 m is a drawing; this is what holds it there, and it says what the rods "
           + "will carry - so a 450 ladder full of copper on M8 drops is something the "
           + "model objects to rather than something site finds out.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.real("span", "Rod centres", 700, 100, 3000, 10),
           ARG.real("drop", "Drop", 500, 50, 3000, 10),
           ARG.choice("rod", "Rod", HANGER_RODS, 2),
           ARG.choice("profile", "Cross member", profileNames, 6),
           ARG.real("load", "Load carried", 60, 0, 2000, 5, "kg"),
           ARG.text("supplier", "Supplier ref", "", "your own part number"),
           ARG.spare("section", "Section from", ["StrutSection"])] },

  { type: "CableManager", guid: "9a1b2c30-00f3-4c00-9e00-caf0000000f3", category: "body",
    produces: "solid",
    summary: "A vertical cable manager: the channel down the side of the rack and the "
           + "pairs of fingers that hold the bundles off it, on a pitch, with the tie "
           + "slots between them. Modelled rather than drawn as a box, because the whole "
           + "question a manager answers is how much cable fits - so it reports the "
           + "cross-section it leaves and how many of a given cable that is.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           ARG.real("units", "Height", 48, 1, 60, 1, "U"),
           ARG.real("width", "Width", 150, 50, 600, 5),
           ARG.real("depth", "Depth", 200, 50, 800, 5),
           ARG.real("sheet", "Sheet", 1.5, 0.8, 5, 0.1),
           ARG.real("pitch", "Finger pitch", 88.9, 20, 400, 0.05),
           ARG.real("finger", "Finger", 40, 10, 200, 5),
           ARG.real("cable", "Cable", 6.2, 1, 40, 0.1),
           ARG.text("supplier", "Supplier ref", "", "your own part number")] },

  //! A MESH AND NOT A SOLID, which is the one node in this package that is. A
  //! person is not a machined part - nothing downstream will fillet one or
  //! section it or write it to STEP as a solid - and five thousand triangles
  //! placed a few times in a hall is nothing, where the same figure sewn into a
  //! B-Rep shell is minutes of booleans for something that is only looked at.
  //!
  //! IT WAS CALLED ScaleFigure and carried one mesh. The type is renamed and
  //! the choice of figure is APPENDED, which is the only safe way to add one:
  //! an argument's place in this list is its tag in the document, so putting
  //! `figure` before `height` would turn every saved height into a figure.
  { type: "Entourage", guid: "9a1b2c30-00f4-4c00-9e00-caf0000000f4", category: "mesh",
    produces: "mesh",
    summary: "A person, from a library, for scale. A hall drawn without one is a picture "
           + "of a rack: there is nothing in the frame to measure a 2.1 m frame or a 1.2 "
           + "m aisle against, and a corridor reads the same whether it is 900 wide or "
           + "1800. Every figure stands ON the point it is given - the anchor baked into "
           + "each one is the bottom of its bounding box, centred in plan - and Facing "
           + "turns it about that same point, so somebody can be pointed at whatever "
           + "they should be looking at. They are all turned to face one way to begin "
           + "with, so changing which figure it is does not change where they look.",
    args: [ARG.ref("plane", "Plane", ["plane"]), ARG.spare("at", "At", ["point"]),
           //! 1727 IS THE TALLEST OF THE FOUR AS SUPPLIED. They arrived all
           //! normalised to one height in the file they came from, so their
           //! heights RELATIVE TO EACH OTHER did not survive that export -
           //! which is why height is set per placement, and why the default is
           //! the tallest rather than an average of something that is not
           //! there. A figure that is not standing - the one leaning - is
           //! shorter than its own standing height by however far it leans.
           ARG.real("height", "Height", 1727, 300, 2500, 5),
           ARG.real("turn", "Facing", 0, -360, 360, 15, "\u00b0"),
           //! APPENDED - see above.
           ARG.choice("figure", "Figure", ENTOURAGE_NAMES, 0)] },

  { type: "Clash", guid: "9a1b2c30-00f5-4c00-9e00-caf0000000f5", category: "analysis",
    produces: "text",
    summary: "Interference between two things, or inside one. Wire the racks into This "
           + "and the floor into Against and it says whether anything is inside anything "
           + "else, by how much, and which parts - which is the question a coordinated "
           + "model exists to answer and the one nothing on screen will tell you, because "
           + "a leg through a floor panel looks exactly like a leg standing on it. Boxes "
           + "is instant and exact for anything square to the axes; Solids is the true "
           + "answer and costs a boolean per pair it has to ask about.",
    args: [ARG.ref("a", "This", ARG.ANY, true),
           ARG.ref("b", "Against", ARG.ANY),
           //! A TOLERANCE, because touching is not clashing. Two parts that
           //! share a face - a panel resting on a stringer, a foot standing on
           //! a floor - overlap by zero and by rounding, and a clash report
           //! that lists every joint in the model is a clash report nobody
           //! reads. 1 mm is the figure the trade uses for a hard clash.
           ARG.real("tolerance", "Allow", 1, 0, 100, 0.5),
           ARG.choice("how", "Test", ["Bounding boxes", "Boxes, then solids"], 0),
           ARG.real("budget", "Pairs to open up", 200, 1, 5000, 10),
           ARG.real("show", "List", 8, 1, 100, 1, "")] },

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
      case "RackDoor": {
        const units = Math.round(KF.real(one, "units", 48));
        const perf = PERFORATIONS[KF.choice(one, "perf", 1)] || PERFORATIONS[1];
        return { name: "Rack door " + units + "U \u00b7 " + Math.round(KF.real(one, "width", 600))
                   + " wide \u00b7 " + perf.name, kind: "part",
                 from: perf.from || "sheet door", supplier };
      }
      case "LevellingFoot": {
        const it = THREADS[KF.choice(one, "thread", 4)] || THREADS[4];
        return { name: "Levelling foot " + it.name + " \u00b7 "
                   + round(KF.real(one, "base", 80)) + " base", kind: "part",
                 from: "ISO 261 " + it.name + " \u00d7 " + it.pitch, supplier };
      }
      case "Entourage":
        //! NOT A PART. A person is in the model to be looked at, and a bill
        //! that orders one is a bill nobody will read the rest of.
        return null;
      case "FloorTile": {
        const it = FLOOR_TILES[KF.choice(one, "tile", 0)] || FLOOR_TILES[0];
        return { name: it.name, kind: "section", from: it.from, supplier };
      }
      case "CeilingHanger": {
        const rod = HANGER_RODS[KF.choice(one, "rod", 2)] || "M12";
        return { name: "Trapeze hanger \u00b7 " + rod + " rods, "
                   + round(KF.real(one, "span", 700)) + " centres",
                 kind: "section", from: "threaded rod and channel", supplier };
      }
      case "CableManager":
        return { name: "Vertical manager " + Math.round(KF.real(one, "units", 48))
                   + "U \u00b7 " + round(KF.real(one, "width", 150)) + " wide",
                 kind: "section", from: "cable manager", supplier };
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
        //! THE HOLE IS THE STANDARD'S SIZE where the standard fixes one. Open
        //! Rack V3 drills 4.5 and 5.4 before paint, because those are the two
        //! sizes its thread-forming screws are specified against (§6.8), so
        //! falling back on this node's generic 7 would model a post that no
        //! screw in the specification fits. EIA fixes a SQUARE hole instead and
        //! publishes no round one, so there the node's own number still stands.
        const standardBore = Number.isFinite(spec.bore) && spec.bore > 0 ? spec.bore : null;
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
            tools.push(drill(frame, [line, -1, z], "v", KF.real(f, "bore", standardBore ?? 7) / 2, wall + 2));
          }
        }
        if (tools.length) solid = cutAll(solid, tools);
        return { shape: solid,
                 data: K.text([spec.name, units + spec.unitName + " · "
                                 + high.toFixed(2) + " mm",
                               at.length + " holes · "
                                 + (mode === 0 ? spec.square + " mm square"
                                    : mode === 1 ? "\u00f8" + KF.real(f, "bore", standardBore ?? 7) : "none")]) };
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
        //! HOW WIDE THE FRAME IS, asked of the standard in the order the
        //! standards actually publish it - because they do not all publish the
        //! same thing, and assuming they do is how this broke.
        //!
        //! EIA-310-E fixes the HOLE COLUMNS (465.1) and everything else is
        //! measured out from them, so there the width is a sum. Open Rack V3
        //! publishes the FRAME instead - 600.24 overall, Figure 6.1.1 - and has
        //! no column spacing to add up; reading spec.columns there gave
        //! undefined, the sum came out NaN, and the extrusion failed with
        //! "BRep_API: command not done", which says nothing about a missing
        //! number. And Open Rack Wide publishes a width this program has not
        //! read, so there it HAS to come from the node.
        //!
        //! So: the standard's own frame width if it has one, else the columns
        //! plus the posts they carry, else what the node was told - and the
        //! feature says which of the three it used, because "600 wide" from the
        //! specification and "600 wide" because somebody typed it are different
        //! claims.
        const told = KF.real(f, "width", 0);
        const fromSpec = Number.isFinite(spec.overallWidth) && spec.overallWidth > 0
          ? spec.overallWidth : null;
        const fromColumns = Number.isFinite(spec.columns) && spec.columns > 0
          ? spec.columns + postWidth + w * 2 : null;
        const across = fromSpec ?? fromColumns ?? (told > 0 ? told : 600);
        const widthFrom = fromSpec ? "the standard's own frame width"
          : fromColumns ? "the standard's hole columns plus the posts"
          : told > 0 ? "the width set on this feature - the standard does not publish one here"
          : "600 as a fallback - neither the standard nor this feature says";
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
          Math.round(across * 100) / 100 + " mm wide, from " + widthFrom,
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
        //! A TRAY IS PLACED BY WHAT IT SITS ON, which is its UNDERSIDE and not
        //! its centreline. Placed by the centreline it was, every height in a
        //! hall carried a correction of half whatever section the tray happened
        //! to be made of - and the correction was written into the model file
        //! as a number, so switching the section from a 41 channel to a 40
        //! T-slot moved the tray 10 mm off the hanger holding it up. The
        //! hanger's drop is to the face the tray bears on for the same reason;
        //! between them there is now no offset anywhere in a runway.
        const parts = [
          extrudeOutline(frame, section.outline(), [0, 0, section.h / 2], length, "u"),
          extrudeOutline(frame, section.outline(), [0, width, section.h / 2], length, "u"),
        ];
        //! THE RUNGS ARE PATTERNED FROM THE LENGTH, which is the difference
        //! between a tray that is modelled and a tray that is drawn: make it
        //! longer and there are more of them, still on the pitch.
        const at = strutHoles(length, pitch, pitch / 2);
        //! THE RUNGS ARE WELDED BETWEEN THE RAILS, flush with their undersides -
        //! not centred on the rails' centreline, which is what this did and
        //! which hangs a rung deeper than its rail below the tray. A tray is
        //! placed by what it SITS ON, so its underside has to be one surface
        //! and it has to be the rails: a 25 mm rung in a 20.6 channel put the
        //! lowest point of the tray 2.2 mm under its own rails, and the tray
        //! then floated that far over the hanger holding it up.
        //! And the rungs are welded between the rails from the same underside,
        //! rather than centred on the rails' centreline - a rung deeper than
        //! its rail hung below the tray and was the lowest thing on it.
        for (const x of at)
          parts.push(slab(frame, [x - rung / 2, 0, 0], rung, width, rung));
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

    RackDoor: {
      precondition: f => {
        if (KF.real(f, "width", 600) <= KF.real(f, "frame", 40) * 2)
          return "the frame border is wider than the door";
        return null;
      },
      build: f => {
        const frame = frameOf(f);
        const spec = PERFORATIONS[K.F.choice(f, "perf", 1)] || perforation("round-staggered");
        const units = Math.max(1, Math.round(KF.real(f, "units", 48)));
        const high = rackHeight("eia310", units);
        const wide = KF.real(f, "width", 600);
        const sheet = KF.real(f, "sheet", 1.5);
        const border = KF.real(f, "frame", 40);

        //! THE PANEL, then its returned edge - a door is a folded sheet, and the
        //! return down each side is most of what makes it stiff.
        const parts = [slab(frame, [0, 0, 0], wide, sheet, high)];
        const lip = 20;
        parts.push(slab(frame, [0, sheet, 0], sheet, lip, high));
        parts.push(slab(frame, [wide - sheet, sheet, 0], sheet, lip, high));
        parts.push(slab(frame, [0, sheet, 0], wide, lip, sheet));
        parts.push(slab(frame, [0, sheet, high - sheet], wide, lip, sheet));

        //! THE PUNCH, inside the border only. The centres come from the same
        //! function that computes the open area, so the number reported and the
        //! holes cut cannot be about different patterns.
        const hole = KF.real(f, "hole", 4);
        const slot = KF.real(f, "slot", 12);
        const pitchX = KF.real(f, "pitchX", 6), pitchY = KF.real(f, "pitchY", 5.2);
        const innerW = wide - 2 * border, innerH = high - 2 * border;
        let centres = [];
        if (spec.kind !== "none")
          centres = perforationCentres(innerW, innerH, pitchX, pitchY, spec.stagger, hole);
        const tools = [];
        for (const [x, y] of centres) {
          const at = [border + x, -1, border + y];
          if (spec.kind === "round" || spec.kind === "hex")
            tools.push(drill(frame, at, "v", hole / 2, sheet + 2));
          else {
            //! A SLOT IS TWO BORES AND THE BAR BETWEEN THEM, which is what a
            //! slotted punch leaves and is why it opens more area than a round
            //! one of the same web width.
            const run = Math.max(0, slot - hole);
            tools.push(drill(frame, at, "v", hole / 2, sheet + 2));
            if (run > 0) {
              tools.push(drill(frame, [at[0] + run, at[1], at[2]], "v", hole / 2, sheet + 2));
              tools.push(slab(frame, [at[0], -1, at[2] - hole / 2], run, sheet + 2, hole));
            }
          }
        }
        let door = tools.length ? cutAll(S.assemble(parts), K.compoundOf(tools))
                                : S.assemble(parts);

        //! THE LOCK AND THE HINGES, which are the parts nobody models and are
        //! the difference between a door and a rectangle.
        const extra = [];
        const lock = K.F.choice(f, "lock", 1);
        const hinge = K.F.choice(f, "hinge", 0);
        const latchX = hinge === 0 ? wide - border / 2 : border / 2;
        if (lock === 1) {
          //! A swing handle sits in a pocket and stands proud of the face.
          extra.push(slab(frame, [latchX - 30, -18, high / 2 - 60], 60, 18, 120));
          extra.push(drill(frame, [latchX, -30, high / 2], "v", 9, 34));
        } else if (lock === 2) {
          extra.push(drill(frame, [latchX, -12, high / 2], "v", 10, 26));
        }
        if (hinge !== 2) {
          const hingeX = hinge === 0 ? border / 2 : wide - border / 2;
          for (const z of [high * 0.15, high * 0.85])
            extra.push(drill(frame, [hingeX, -14, z], "v", 8, 28));
        }
        if (extra.length) door = S.add(door, K.compoundOf(extra));

        //! WHAT IT OPENS, off the holes that were cut. This is the number a
        //! door is specified by, so it is computed rather than claimed - and a
        //! door that misses what it was asked for says so on the feature.
        const open = spec.kind === "none" ? 0
          : openArea(centres.length, spec.kind, hole, slot, innerW, innerH);
        const want = KF.real(f, "wantOpen", 70) / 100;
        const said = ["Rack door " + units + "U \u00b7 " + Math.round(wide) + " wide",
                      spec.name + (spec.from ? " \u00b7 " + spec.from : ""),
                      centres.length.toLocaleString() + " holes",
                      "open area " + (open * 100).toFixed(1) + "%"];
        const supplier = supplierOf(f);
        if (supplier) said.push(supplier);
        const note = spec.kind !== "none" && open < want
          ? "open area is " + (open * 100).toFixed(1) + "%, under the "
            + Math.round(want * 100) + "% asked for - close the pitch or open the hole"
          : null;
        if (note) said.push(note);
        return { shape: door, data: K.text(said), ...(note ? { note } : {}) };
      },
    },

    LevellingFoot: {
      precondition: f => null,
      build: f => {
        const frame = frameOf(f);
        const spec = THREADS[K.F.choice(f, "thread", 4)] || THREADS[4];
        const iso = threadProfile(spec);
        const studLong = KF.real(f, "stud", 90);
        const baseDia = KF.real(f, "base", 80);
        const plate = KF.real(f, "plate", 10);
        const travel = KF.real(f, "travel", 40);
        const cut = K.F.choice(f, "cut", 0) === 1;
        let short = null;

        const axisAt = w => new K.oc.gp_Ax2(
          new K.oc.gp_Pnt(...world(frame, 0, 0, w)),
          new K.oc.gp_Dir(frame.z[0], frame.z[1], frame.z[2]));

        //! The base pad that stands on the floor, then the stud up out of it.
        const parts = [S.cylinder(axisAt(0), baseDia / 2, plate)];
        let stud = S.cylinder(axisAt(plate), spec.d / 2, studLong);

        if (cut) {
          //! A REAL THREAD: the ISO 68-1 groove swept along a true helix and
          //! taken out of the stud. It is the expensive option and it is
          //! offered rather than assumed, because a rack with four of these on
          //! it is four helical sweeps every time anything upstream moves.
          //! HOW MANY TURNS THIS WILL ACTUALLY CUT, and it is not "all of them".
          //! Measured at M20 x 2.5, cutting a swept helical vee out of the
          //! major cylinder: 3 turns 0.51 s, 6 turns 0.69 s, 12 turns 1.35 s,
          //! 24 turns 3.25 s - linear and cheap - and then 42 turns takes 40
          //! seconds and FAILS, "the result came back open". The sweep gets
          //! long enough that the boolean gives up on it.
          //!
          //! So the threaded length is a parameter with a working default
          //! rather than the whole stud, which is also how a real one is drawn:
          //! what matters is the length the nut runs on. Asked for more than
          //! the cut will take, it threads what it can AND SAYS SO on the
          //! feature - a stud that is quietly threaded for a third of what the
          //! panel says is worse than one that admits it.
          const TURNS_THAT_CUT = 24;
          const from = plate + spec.pitch;
          const room = Math.max(0, studLong - 2 * spec.pitch);
          const asked = Math.min(KF.real(f, "threaded", 60), room);
          const wanted = Math.max(1, Math.floor(asked / spec.pitch));
          const turns = Math.min(wanted, TURNS_THAT_CUT);
          if (turns < wanted)
            short = Math.round(turns * spec.pitch) + " mm of thread cut, of the "
              + Math.round(asked) + " asked for - past about " + TURNS_THAT_CUT
              + " turns the helical cut stops being reliable";
          const spine = H.helix(axisAt(from), spec.d / 2, spec.pitch, turns);
          //! The cutter's section, in the plane through the axis: a vee from
          //! the crest down to the root, which is where d3 rather than D1 is
          //! the number that matters - they differ by a quarter of a
          //! millimetre at M12 and that is a stud that does not fit its nut.
          const r = spec.d / 2, root = iso.boltMinor / 2;
          const inward = world(frame, root, 0, from);
          const up = world(frame, r + 0.2, 0, from + spec.pitch / 2);
          const down = world(frame, r + 0.2, 0, from - spec.pitch / 2);
          const vee = H.polyline([down, up, inward], true);
          stud = S.remove(stud, S.rib(vee, spine));
        }
        parts.push(stud);

        //! THE ADJUSTING NUT, which is how a foot is a levelling foot: it is
        //! what the rack sits on and what is turned to bring it up.
        const nutAt = plate + Math.min(travel, studLong - spec.pitch * 2);
        parts.push(S.remove(
          extrudeOutline(frame, hexOutline(spec.flats), [0, 0, nutAt], spec.pitch * 4, "z"),
          drill(frame, [0, 0, nutAt - 1], "z", iso.nutMinor / 2, spec.pitch * 4 + 2)));

        const supplier = supplierOf(f);
        return { shape: S.assemble(parts),
                 data: K.text(["Levelling foot " + spec.name + " \u00d7 " + Math.round(studLong),
                               "ISO 68-1 \u00b7 " + spec.name + " \u00d7 " + spec.pitch
                                 + " \u00b7 root \u00f8" + iso.boltMinor.toFixed(3),
                               cut ? "thread cut as a true helix"
                                   : "plain stud - switch Thread to Cut for the real groove",
                               Math.round(baseDia) + " mm base",
                               ...(short ? [short] : []),
                               ...(supplier ? [supplier] : [])]),
                 ...(short ? { note: short } : {}) };
      },
    },

    /* --------------------------------------------------------- the hall */

    FloorTile: {
      precondition: f => {
        if (KF.real(f, "grid", 600) <= KF.real(f, "joint", 1) * 2)
          return "the joint is wider than the module";
        if (K.F.choice(f, "under", 0) !== 2) {
          const spec = FLOOR_TILES[K.F.choice(f, "tile", 0)] || FLOOR_TILES[0];
          const told = KF.real(f, "thick", 0);
          const deep = told > 0 ? told : (spec.thick || 32);
          const least = deep + FLOOR_PEDESTAL.headPlate + FLOOR_PEDESTAL.basePlate;
          if (KF.real(f, "height", 600) <= least)
            return "a finished floor of " + Math.round(KF.real(f, "height", 600))
              + " leaves no pedestal under a " + Math.round(deep) + " panel";
        }
        return null;
      },
      build: f => {
        const frame = frameOf(f);
        const spec = FLOOR_TILES[K.F.choice(f, "tile", 0)] || FLOOR_TILES[0];
        const grid = KF.real(f, "grid", 600);
        const joint = KF.real(f, "joint", 1);
        const told = KF.real(f, "thick", 0);
        const thick = told > 0 ? told : (spec.thick || 32);
        const under = K.F.choice(f, "under", 0);
        const ffh = KF.real(f, "height", 600);
        const side = grid - joint;

        //! THE PANEL sits under z = 0 with its TOP at z = 0, so the point a
        //! tile is placed at is a point on the finished floor - which is the
        //! level everything else in a hall is dimensioned from. A panel placed
        //! by its underside means every rack above it is 32 mm out, and it is
        //! the kind of 32 mm that is only found by sectioning.
        const parts = [slab(frame, [joint / 2, joint / 2, -thick], side, side, thick)];

        //! THE PUNCH. Same two functions as the rack door - the centres that
        //! are cut and the area that is reported come from one place, so the
        //! percentage on the feature is about the holes in the model.
        const hole = spec.hole || 0;
        const slot = spec.slot || 0;
        //! How much LONGER than its centre an opening reaches, which is nothing
        //! for a round hole and the whole slot for a grate.
        const run = 0;
        //! The border a panel is not punched through, which is where it sits on
        //! the stringer and where the lifter's suction cup goes.
        //! A PUNCHED PANEL HAS A WIDER BORDER THAN A CASTING, because the
        //! border is what it is stiff on: a steel panel needs 25 mm of unbroken
        //! sheet round the edge, a cast grate has its own frame in the casting
        //! and runs its vanes almost out to it.
        const margin = spec.kind === "slot" ? 12 : 25;
        const field = side - 2 * margin;
        const pitch = tilePitch(spec, field, side);
        const long = pitch.slot || 0;
        let centres = [];
        //! THE FIELD IS SHORT BY THE LENGTH OF A SLOT, and this is not a
        //! refinement - a grate whose last row of slots ran off the edge cut
        //! the panel in two along its own boundary, and OpenCascade returned
        //! "the result came back open", which is true and unhelpful. A round
        //! hole is its own length; a slot is 82 mm longer than its centre.
        if (spec.kind === "slot" && pitch.x > 0) {
          //! ONE ROW, the length of the field. perforationCentres lays out a
          //! grid of centres and a vane is not one - asked for a row of
          //! openings as long as the field it is in, it computed a height of
          //! nothing and returned none at all, and the panel came out solid
          //! with "0.0% open" printed on it.
          const usable = field - hole;
          const cols = Math.max(1, Math.floor(usable / pitch.x) + 1);
          const spread = hole / 2 + (usable - (cols - 1) * pitch.x) / 2;
          for (let c = 0; c < cols; c++) centres.push([spread + c * pitch.x, 0]);
        } else if (spec.kind !== "none" && hole > 0 && pitch.x > 0) {
          //! HALF A HOLE OF MARGIN, not a whole one. The field is already
          //! inset by the border; asking for another hole's width inside that
          //! threw away 24 mm of a 549 field and cost the panel two points of
          //! open area it had been sized for. Half a hole is what keeps the
          //! outermost hole inside the field, and is all that is needed.
          centres = perforationCentres(field, field, pitch.x, pitch.y,
                                       !!spec.stagger, hole / 2);
        }
        const tools = [];
        for (const [x, y] of centres) {
          const at = [joint / 2 + margin + x, joint / 2 + margin + y, -thick - 1];
          if (spec.kind === "round") tools.push(drill(frame, at, "z", hole / 2, thick + 2));
          //! ONE BOX PER OPENING and not a box between two bores. See holeArea:
          //! the gap between a cast grate's vanes is a rectangle, the stadium
          //! belongs to a punched sheet, and the three-piece version was both
          //! wrong by 4% and forty seconds of tangent booleans that failed.
          else tools.push(slab(frame, [at[0] - hole / 2, at[1], -thick - 1],
                               hole, long, thick + 2));
        }
        let panel = cutAll(parts[0], tools);

        //! THE UNDERSTRUCTURE. One pedestal at the tile's own corner, so a
        //! field of tiles on the module gets a pedestal at every intersection
        //! and not four at every tile.
        const extra = [];
        const ped = FLOOR_PEDESTAL;
        if (under !== 2) {
          //! THE FINISHED FLOOR HEIGHT IS SLAB TO FINISHED FLOOR, which is what
          //! the number means everywhere it is used: it is the depth of plenum
          //! the air has to get down. So the pedestal's base plate sits on
          //! z = -ffh exactly, and the tube is what is left after the panel,
          //! the head and the base are taken off it. Dropping the tube by
          //! ffh - thick instead puts the base 4 mm below the slab, which
          //! nothing on screen shows and every section does.
          const drop = ffh - thick - ped.headPlate;
          extra.push(slab(frame, [-ped.head / 2, -ped.head / 2, -thick - ped.headPlate],
                          ped.head, ped.head, ped.headPlate));
          const at = world(frame, 0, 0, -ffh + ped.basePlate);
          extra.push(S.cylinder(new K.oc.gp_Ax2(new K.oc.gp_Pnt(at[0], at[1], at[2]),
                                                new K.oc.gp_Dir(frame.z[0], frame.z[1], frame.z[2])),
                                ped.tube / 2, drop - ped.basePlate));
          extra.push(slab(frame, [-ped.base / 2, -ped.base / 2, -ffh],
                          ped.base, ped.base, ped.basePlate));
        }
        if (under === 0) {
          //! Stringers along the two edges the tile owns, so a field of them
          //! makes a grid with no member laid twice.
          const s = ped.stringer;
          const top = -thick - ped.headPlate;
          extra.push(slab(frame, [ped.head / 2, -s.w / 2, top - s.h], grid - ped.head, s.w, s.h));
          extra.push(slab(frame, [-s.w / 2, ped.head / 2, top - s.h], s.w, grid - ped.head, s.h));
        }
        if (extra.length) panel = S.add(panel, K.compoundOf(extra));

        //! TWO OPEN AREAS AND THEY ARE BOTH TRUE, which is the trap in a floor
        //! panel and the reason both are printed. A panel is SOLD on the open
        //! area of its PATTERN - the hole against the cell it sits in - and that
        //! is the 25 or the 56 on the data sheet. What passes air is the pattern
        //! over the WHOLE PANEL, and the unpunched border round the edge takes
        //! four or five points off it. Quoting the first and computing the air
        //! from it overstates a hall's floor by about a fifth.
        const cut = spec.kind === "none" ? 0
          : openArea(centres.length, spec.kind, hole, long, field, field);
        const whole = spec.kind === "none" ? 0
          : openArea(centres.length, spec.kind, hole, long, side, side);
        const pressure = KF.real(f, "plenum", 25);
        const flow = tileFlow(whole, grid, pressure);
        const said = [spec.name, spec.from,
                      Math.round(side) + " \u00d7 " + Math.round(side) + " \u00d7 "
                        + Math.round(thick) + " on a " + Math.round(grid) + " module"];
        if (spec.kind !== "none") {
          said.push(centres.length.toLocaleString() + " openings \u00b7 "
            + (cut * 100).toFixed(1) + "% of the punched field, "
            + (whole * 100).toFixed(1) + "% of the panel (sold at "
            + Math.round((spec.open || 0) * 100) + "%)");
          said.push((flow * 3600).toFixed(0) + " m\u00b3/h at " + Math.round(pressure)
            + " Pa \u00b7 sharp-edged orifice, Cd 0.62 - a correlation, not a CFD result");
        }
        if (under !== 2) said.push("finished floor " + Math.round(ffh) + " mm");
        const supplier = supplierOf(f);
        if (supplier) said.push(supplier);
        return { shape: panel, data: K.text(said) };
      },
    },

    CeilingHanger: {
      precondition: f => {
        if (KF.real(f, "drop", 500) <= 0) return "a hanger needs a drop";
        return null;
      },
      build: f => {
        const frame = frameOf(f);
        const section = sectionOf(f, 6);
        const span = KF.real(f, "span", 700);
        const drop = KF.real(f, "drop", 500);
        const rod = HANGER_RODS[K.F.choice(f, "rod", 2)] || "M12";
        const dia = Number(rod.slice(1)) || 12;

        //! THE POINT IS THE SLAB, and the trapeze hangs BELOW it - so a hanger
        //! placed at the soffit puts its channel at soffit less the drop, which
        //! is where the tray goes. Placing it by the channel instead means
        //! every drop length change moves the tray, which is backwards: the
        //! slab does not move and the tray is what you are setting.
        //! THE DROP IS TO THE SURFACE THE TRAY SITS ON - the TOP of the cross
        //! member - and not to its centreline. That is the number somebody sets
        //! when they set a runway height, so it is the number the argument
        //! means; measured to the centreline instead, half a section's depth
        //! of error rides on whichever section the hanger happens to be made
        //! of, which is the worst kind of hidden offset there is.
        //! IT CROSSES WHAT IT CARRIES. A cable tray runs along its frame's X and
        //! is `width` across its Y - so a trapeze holding one up runs across
        //! its Y too, with a rod each side of the tray. Built along X, as this
        //! was, the cross member lies ALONG the tray between two rods in line
        //! with it, which from above is a second tray beside the first and
        //! holds nothing up at all.
        const parts = [];
        const below = drop + section.h + 8;
        for (const across of [0, span]) {
          const at = world(frame, 0, across, -below);
          parts.push(S.cylinder(new K.oc.gp_Ax2(new K.oc.gp_Pnt(at[0], at[1], at[2]),
                                                new K.oc.gp_Dir(frame.z[0], frame.z[1], frame.z[2])),
                                dia / 2, below));
          //! A nut under the channel and one over it, which is how a trapeze is
          //! levelled and is the only reason the channel stays where it is put.
          for (const z of [-drop - section.h - 8, -drop]) {
            const outline = hexOutline(dia * 1.6);
            parts.push(extrudeOutline(frame, outline, [0, across, z], 8, "z"));
          }
        }
        //! The cross member, on the frame's own section family, with its top
        //! face exactly at the drop and a little of it past each rod.
        parts.push(extrudeOutline(frame, section.outline(), [0, -40, -drop - section.h / 2],
                                  span + 80, "v"));

        const holds = rodCapacity(rod) * 2;
        const load = KF.real(f, "load", 60);
        const note = load > holds
          ? "two " + rod + " rods carry about " + Math.round(holds) + " kg and this "
            + "trapeze is carrying " + Math.round(load) + " - go up a rod size or "
            + "halve the spacing"
          : null;
        const said = [rod + " trapeze \u00b7 " + Math.round(span) + " centres, "
                        + Math.round(drop) + " to the bearing face",
                      section.name,
                      "two rods hold about " + Math.round(holds) + " kg \u00b7 "
                        + ROD_STRESS_AREA[rod] + " mm\u00b2 stress area at 48 MPa working",
                      "carrying " + Math.round(load) + " kg"];
        const supplier = supplierOf(f);
        if (supplier) said.push(supplier);
        if (note) said.push(note);
        return { shape: K.compoundOf(parts), data: K.text(said), ...(note ? { note } : {}) };
      },
    },

    CableManager: {
      precondition: f => null,
      build: f => {
        const frame = frameOf(f);
        const units = Math.max(1, Math.round(KF.real(f, "units", 48)));
        const high = rackHeight("eia310", units);
        const wide = KF.real(f, "width", 150);
        const deep = KF.real(f, "depth", 200);
        const sheet = KF.real(f, "sheet", 1.5);
        const pitch = Math.max(20, KF.real(f, "pitch", 88.9));
        const finger = KF.real(f, "finger", 40);

        //! THE CHANNEL: a back and two returns, which is a manager rather than
        //! a box. The fingers stand off the back in pairs with the tie slot
        //! between them - the slot is what a cable tie goes through and is the
        //! reason a manager is not a shelf.
        const parts = [slab(frame, [0, 0, 0], wide, sheet, high),
                       slab(frame, [0, 0, 0], sheet, deep, high),
                       slab(frame, [wide - sheet, 0, 0], sheet, deep, high)];
        const at = strutHoles(high, pitch, pitch / 2);
        for (const z of at) {
          parts.push(slab(frame, [sheet, sheet, z - sheet], wide - 2 * sheet, finger, sheet * 2));
          //! The tie slot, as a gap in the middle of the finger rather than a
          //! hole cut afterwards: two stubs with daylight between them.
          parts.push(slab(frame, [sheet, sheet + finger, z - sheet], 25, 12, sheet * 2));
          parts.push(slab(frame, [wide - sheet - 25, sheet + finger, z - sheet], 25, 12, sheet * 2));
        }

        //! WHAT IT WILL HOLD, which is the whole question a manager answers.
        //! The usable window is between the returns and out to the end of the
        //! fingers, and the packing figure is the honest one: round cables in a
        //! rectangular duct fill about 60% of it, not 100%, and the trade's own
        //! fill tables are built on 40 to 60.
        const cable = KF.real(f, "cable", 6.2);
        const window = (wide - 2 * sheet) * finger;
        const fill = 0.6;
        const many = cable > 0 ? Math.floor(window * fill / (Math.PI * cable * cable / 4)) : 0;
        const said = ["Vertical manager \u00b7 " + units + "U, " + Math.round(wide)
                        + " \u00d7 " + Math.round(deep),
                      at.length + " finger pairs at " + pitch.toFixed(1) + " mm",
                      "window " + Math.round(window) + " mm\u00b2 \u00b7 about " + many
                        + " \u00d7 \u00d8" + cable + " cables at 60% fill",
                      "60% fill is the trade's own figure for round cable in a duct, "
                        + "not a geometric packing"];
        const supplier = supplierOf(f);
        if (supplier) said.push(supplier);
        return { shape: K.compoundOf(parts), data: K.text(said) };
      },
    },

    Entourage: {
      precondition: f => (KF.real(f, "height", 1727) > 0 ? null : "a person needs a height"),
      build: f => {
        const frame = frameOf(f);
        const height = KF.real(f, "height", 1727);
        const pick = ENTOURAGE[K.F.choice(f, "figure", 0)] || ENTOURAGE[0];
        //! TURNED IN THE FRAME'S OWN PLANE, about the point it stands on - which
        //! is the anchor baked into every figure in the library: the bottom of
        //! its bounding box, centred in plan. Turning about anything else moves
        //! the person as well as facing them, which is not what somebody
        //! dragging a Facing slider is asking for.
        const turn = KF.real(f, "turn", 0) * Math.PI / 180;
        const c = Math.cos(turn), s = Math.sin(turn);
        const across = [frame.x[0] * c + frame.y[0] * s, frame.x[1] * c + frame.y[1] * s,
                        frame.x[2] * c + frame.y[2] * s];
        const facing = [-frame.x[0] * s + frame.y[0] * c, -frame.x[1] * s + frame.y[1] * c,
                        -frame.x[2] * s + frame.y[2] * c];
        const mesh = entourageAt(pick.key, height, frame.origin, across, facing, frame.z);
        return { data: K.packMesh(K.checkMesh(mesh, pick.name)) };
      },
    },

    Clash: {
      precondition: f => (KF.reference(f, "a") ? null : "nothing wired in to check"),
      build: f => {
        const doc = K.doc ? K.doc() : null;
        const tol = Math.max(0, KF.real(f, "tolerance", 1));
        const solids = K.F.choice(f, "how", 0) === 1;
        const budget = Math.max(1, Math.round(KF.real(f, "budget", 200)));
        const show = Math.max(1, Math.round(KF.real(f, "show", 8)));

        //! EVERY SOLID UNDER ONE SIDE, with the name of the feature it came
        //! from. Exploded to solids rather than left as one box a feature: a
        //! rack's bounding box is the whole rack, and "the rack overlaps the
        //! floor" is true of every rack ever built and says nothing. It is the
        //! LEG that is in the panel, and a leg is a solid.
        //!
        //! A CONTAINER'S OWN COMPOUND IS SKIPPED - it is the same geometry as
        //! its contents, and counting both makes every part clash with itself.
        const gather = (of, into, seen, guard, skip) => {
          if (!of || guard > 20) return;
          const spec = KF.spec(of);
          if (!spec) return;
          const id = KF.id(of);
          //! NOT WHAT IS ALREADY ON THE OTHER SIDE. "The model against its
          //! floor" is a thing somebody asks, and the floor is IN the model -
          //! so without this the floor is on both sides and every panel clashes
          //! with itself, 42 mm deep and six million cubic millimetres, which
          //! is true and useless. A against B means A less B.
          if (skip && skip.has(id)) return;
          if (seen.has(id)) return;
          seen.add(id);
          const container = spec.category === "container"
            || ["Part", "Product"].includes(spec.type);
          if (container && doc) {
            for (const one of doc.contents(of)) gather(one, into, seen, guard + 1, skip);
            return;
          }
          if (spec.category === "datum" || spec.category === "data"
              || spec.category === "analysis") return;
          if (doc && doc.consumedBy(of)) return;
          const name = KF.name(of);
          const shape = KF.shape(of);
          if (!shape || shape.IsNull()) {
            //! A MESH HAS NO B-REP AND IS STILL IN THE WAY. A scale figure, a
            //! scanned part, half the IFC in the world - none of them has a
            //! shape to explode, and skipping them reported "0 solids, 0
            //! pairs" for a person standing in a rack, which passes. Its
            //! points are its extents and that is a real answer: a box test is
            //! all a mesh can be asked for here anyway, and the node says so.
            const data = KF.data(of);
            if (!data || data.kind !== "mesh") return;
            const points = K.F.triples(data);
            if (!points.length) return;
            const low = [0, 1, 2].map(k => Math.min(...points.map(one => one[k])));
            const high = [0, 1, 2].map(k => Math.max(...points.map(one => one[k])));
            into.push({ name, shape: null, mesh: true, box: { low, high } });
            return;
          }
          //! subShapes wants the cast as well as the kind - the explorer hands
          //! back a TopoDS_Shape and Solid() is what makes it a solid.
          const found = K.subShapes(shape, K.SOLID, K.oc.TopoDS.Solid);
          //! A SHAPE WITH NO SOLIDS IN IT IS STILL SOMETHING. A mesh feature,
          //! a surface, a swept sheet - none of them explode to solids, and
          //! dropping them would leave a scale figure standing inside a rack
          //! with nothing reported. Taken whole, by its bounding box.
          if (!found.length) into.push({ name, shape, box: K.extents(shape) });
          else for (const solid of found)
            into.push({ name, shape: solid, box: K.extents(solid) });
        };

        //! THE OTHER SIDE FIRST, so what it holds can be kept out of this one.
        const mine = [], theirs = [];
        const other = KF.reference(f, "b");
        const theirIds = new Set();
        if (other) gather(other, theirs, theirIds, 0, null);
        gather(KF.reference(f, "a"), mine, new Set(), 0, other ? theirIds : null);

        //! HOW MUCH TWO BOXES ARE INSIDE EACH OTHER, on the axis they overlap
        //! LEAST. That least axis is the depth of the interference: a leg
        //! 110 mm into a 32 mm panel overlaps 110 in x and y and 32 in z, and
        //! 32 is how far in it is.
        const bite = (one, two) => {
          let least = Infinity;
          for (let k = 0; k < 3; k++) {
            const over = Math.min(one.box.high[k], two.box.high[k])
                       - Math.max(one.box.low[k], two.box.low[k]);
            if (over <= tol) return 0;
            least = Math.min(least, over);
          }
          return least;
        };

        const pairs = [];
        const against = other ? theirs : mine;
        let looked = 0;
        for (let i = 0; i < mine.length; i++) {
          //! Against itself, only each pair once and never a part against
          //! itself - which would report every solid in the model.
          const from = other ? 0 : i + 1;
          for (let j = from; j < against.length; j++) {
            looked++;
            const deep = bite(mine[i], against[j]);
            if (deep > 0) pairs.push({ a: mine[i], b: against[j], deep });
          }
        }
        pairs.sort((one, two) => two.deep - one.deep);

        //! AND THEN THE TRUE ANSWER, for as many as the budget allows. A box
        //! test over-reports: a cable through the rung of a tray has boxes
        //! that overlap and geometry that does not, and so does anything that
        //! is not square to the axes. The common volume settles it - and it is
        //! a boolean per pair, so it is asked of the worst ones first and what
        //! it could not reach is SAID rather than dropped.
        let opened = 0, real = pairs;
        if (solids && pairs.length) {
          real = [];
          for (const pair of pairs) {
            //! A mesh has no B-Rep to intersect, so the box answer is the
            //! only one there is for that pair - and it is reported as such
            //! rather than counted against the budget.
            if (pair.a.mesh || pair.b.mesh) { real.push({ ...pair, boxOnly: true }); continue; }
            if (opened >= budget) { real.push({ ...pair, untested: true }); continue; }
            opened++;
            let volume = 0;
            try {
              const both = new K.oc.BRepAlgoAPI_Common(pair.a.shape, pair.b.shape);
              both.Build();
              if (both.IsDone()) {
                const props = new K.oc.GProp_GProps();
                K.oc.BRepGProp.VolumeProperties(both.Shape(), props, false, false, false);
                volume = Math.abs(props.Mass());
                props.delete();
              }
            } catch (err) { volume = -1; }        // it would not cut: say so
            if (volume < 0) real.push({ ...pair, unknown: true });
            else if (volume > tol * tol * tol) real.push({ ...pair, volume });
          }
        }

        const said = [];
        const both = other ? KF.name(KF.reference(f, "a")) + " against " + KF.name(other)
                           : "inside " + KF.name(KF.reference(f, "a"));
        said.push(both + " \u00b7 " + mine.length + (other ? " + " + theirs.length : "")
          + " solids, " + looked.toLocaleString() + " pairs");
        const hard = real.filter(one => !one.untested);
        if (!hard.length) {
          said.push("no interference over " + tol + " mm");
        } else {
          said.push(hard.length + (hard.length === 1 ? " clash" : " clashes")
            + " over " + tol + " mm");
          for (const one of hard.slice(0, show))
            said.push("  " + one.a.name + " \u00d7 " + one.b.name + " \u00b7 "
              + one.deep.toFixed(1) + " mm in"
              + (one.volume !== undefined ? ", " + Math.round(one.volume) + " mm\u00b3" : "")
              + (one.unknown ? " (the boolean would not run - box only)" : "")
              + (one.boxOnly ? " (a mesh - boxes only)" : ""));
          if (hard.length > show) said.push("  \u2026 and " + (hard.length - show) + " more");
        }
        said.push(solids
          ? "boxes, then the common volume of " + opened + " pair"
            + (opened === 1 ? "" : "s")
          : "bounding boxes only - exact for anything square to the axes, and it "
            + "over-reports anything that is not");
        const left = real.filter(one => one.untested).length;
        if (left) said.push(left + " box overlap" + (left === 1 ? "" : "s")
          + " were not opened up - the budget is " + budget);
        const note = hard.length
          ? hard.length + " clash" + (hard.length === 1 ? "" : "es") + " over " + tol
            + " mm \u00b7 worst " + hard[0].deep.toFixed(1) + " mm: "
            + hard[0].a.name + " \u00d7 " + hard[0].b.name
          : null;
        return { data: K.text(said), ...(note ? { note } : {}) };
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
        //! WHAT HAS BEEN CONSUMED IS NOT A PART. An Array takes its source - the
        //! catalogue says so, with `consumes` on the argument - so the one bolt
        //! the pattern was made from is not a bolt in the van beside the
        //! twenty-four it made. Counting it gave 25 where there are 24, which is
        //! exactly the quietly-wrong number a bill must not have. Asked of the
        //! catalogue rather than special-cased for Array, so an extrude that
        //! eats its profile is handled by the same line.
        //!
        //! AND ASKED OF THE WHOLE DOCUMENT, not of what is being counted. A
        //! part's source can be eaten by a pattern filed somewhere else
        //! entirely, and a bill of one set could not see it.
        const eaten = new Set();
        for (const one of (doc ? doc.features() : found)) {
          const spec = KF.spec(one);
          for (const arg of (spec && spec.args) || []) {
            if (arg.kind !== "ref" || !arg.consumes) continue;
            const source = KF.reference(one, arg.key);
            if (source) eaten.add(KF.id(source));
          }
        }

        //! WHAT ONE FEATURE IS WORTH, and the three cases are different things.
        //!
        //!   A PATTERN is as many of what it repeats as it makes. An Array of
        //!   twelve bolts is one feature in the tree and twelve bolts in the
        //!   van, and a bill that counts the feature orders one.
        //!
        //!   AN INSTANCE is a whole part again. Eight racks where seven are
        //!   instances is eight racks to buy - and the first version of this
        //!   counted the one it could see and quoted a hall at an eighth of its
        //!   cost. That is the failure that looks most like success here: the
        //!   bill was neatly formatted, every line was right, and the total was
        //!   wrong by seven racks.
        //!
        //!   ANYTHING ELSE is itself, once, times however many of it there are.
        //!
        //! Recursive, because a pattern of instances is both at once - which is
        //! exactly how a row of racks is built.
        const partsOf = (one, times, out, guard) => {
          if (guard > 12 || !one) return;
          const spec = KF.spec(one);
          if (!spec) return;
          if (spec.type === "Array") {
            const many = KF.choice(one, "mode", 0) === 1
              ? Math.max(1, Math.round(KF.real(one, "count", 6)))
              : Math.max(1, Math.round(KF.real(one, "countX", 3)))
                * Math.max(1, Math.round(KF.real(one, "countY", 1)))
                * Math.max(1, Math.round(KF.real(one, "countZ", 1)));
            partsOf(KF.reference(one, "source"), times * many, out, guard + 1);
            return;
          }
          if (spec.type === "Instance") {
            const part = KF.reference(one, "part");
            if (!part || !doc) return;
            const inside = doc.isContainer(part) ? doc.within(part) : [part];
            for (const each of inside) {
              if (eaten.has(KF.id(each))) continue;
              partsOf(each, times, out, guard + 1);
            }
            return;
          }
          const part = partOf(one);
          if (part) for (let i = 0; i < times; i++) out.push(part);
        };

        const parts = [];
        for (const one of found) {
          if (eaten.has(KF.id(one))) continue;
          partsOf(one, 1, parts, 0);
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
