// Racks: the standards, the sections, and the fasteners.
//
// Everything in here is a number somebody else decided. That is the point of
// it: a rack is not a shape somebody draws, it is a shape a standard fixes, and
// a modeller that lets you draw a 43 mm U is a modeller that will let you build
// something that does not fit. So the numbers live in one table, each one
// against the document it comes from, and the geometry is generated from them.
//
// WHERE EACH NUMBER COMES FROM, because "it looked about right" is how a rack
// ends up 2 mm out over 42U:
//
//   EIA-310-E, and IEC 60297-3-100 which agrees with it, fix the 19-inch rack.
//   Most of that row is an exact inch fraction, written here as the millimetre
//   it converts to at 25.4 mm/inch, exactly:
//
//     1U            1.75"     44.45 mm
//     panel width   19"       482.6 mm
//     the pattern   5/8", 5/8", 1/2" - three holes per U, at 6.35, 22.225 and
//                   38.1 mm above the bottom of that U, repeating every 44.45
//
//   TWO OF THEM ARE NOT, and this is the kind of thing that gets "corrected"
//   by somebody converting inches in their head. The standard prints these two
//   as rounded metric, and the rounded metric is the normative figure:
//
//     hole columns  465.1 mm   (18.312" would be 465.1248 - 25 microns out)
//     square holes  9.5 mm     (3/8" would be 9.525 - the cage nut is made to
//                               the 9.5, and a 9.525 hole is a loose one)
//
//   So they are written as the standard writes them, and the test checks them
//   against the standard rather than against the conversion.
//
//   OCP Open Rack v3 is the hyperscale one, and it is a different rack: the
//   unit is the OpenU of 48 mm, the equipment is 21 inches wide, and the frame
//   is 600 mm across so it lands on a 600 mm floor tile. Those four numbers are
//   published and are here. ITS POST HOLE PATTERN IS NOT, because this has not
//   been read off the specification and a hole pattern invented to look right
//   is the one mistake in this whole file that would not show up until parts
//   were ordered. A post on that standard takes its pattern from the node.
//
// The sections are a different kind of fact: they are what the extrusion
// suppliers publish, and the ones here are the sizes a rack is actually built
// from. Each one is an outline in the section's own plane, in millimetres,
// which is exactly what the modeller extrudes - so switching a beam's profile
// is switching which of these it asks for, and nothing else changes.

/* ------------------------------------------------------------ the standards */

export const RACK_STANDARDS = [
  {
    key: "eia310",
    name: "EIA-310-E · 19 inch",
    from: "EIA-310-E / IEC 60297-3-100. Every number is an exact inch fraction.",
    unit: 44.45,                 // 1.75"
    unitName: "U",
    panel: 482.6,                // 19"
    columns: 465.1,              // as printed; 18.312" is 465.1248 - see the header
    //! Three holes to a U, measured from the bottom of that U. 5/8", 5/8" and
    //! then 1/2" to the first hole of the next one - which is why a rack's
    //! holes look evenly spaced and are not.
    holes: [6.35, 22.225, 38.1],
    square: 9.5,                 // as printed; 3/8" is 9.525 - see the header
    flange: 15.875,              // 5/8" from the hole column to the flange edge
    depth: 1000,
  },
  {
    key: "orv3",
    name: "OCP Open Rack V3 \u00b7 48 mm OpenU",
    //! READ OFF THE SPECIFICATION, at last. Open Compute Project, "Open Rack
    //! Base Frame V3 Specification", revision 1.1, 5 March 2024. Section and
    //! figure numbers are given against each figure below, because a number
    //! without one is a number nobody can check.
    //!
    //! This row was a stub for a long time and said so: the OpenU and a couple
    //! of widths, and `holes: null` with a note that the pattern had NOT been
    //! read off the specification. It is read off it now.
    //!
    //! ONE FIGURE HAS CHANGED AND IT WAS MINE. The row used to carry 537 as a
    //! "21 inch equipment width". That number is not in this document. What the
    //! base frame specification fixes is the FRAME: 540.40 between the latch
    //! datums and 539.40 between the shelf inner surfaces (Figure 6.1.1). The
    //! width of the IT gear itself belongs to the IT equipment specification,
    //! which is a different document and is not this one - so the frame's own
    //! numbers are here and the equipment width is not invented from memory.
    from: "OCP Open Rack Base Frame V3, rev 1.1, 5 March 2024 \u00b7 \u00a76.1.1 frame, "
        + "\u00a76.1.2 OpenU. All dimensions are after paint (nominal 120 \u00b5m a layer).",
    //! §6.1.2, Figure 6.1.2.1. The frame carries both: 48 mm OpenU, and
    //! 44.45 mm EIA-310-D rack units as an option (§6.1.3).
    unit: 48,
    unitName: "OU",
    //! Figure 6.1.1. Latch datum to latch datum, which the drawing labels RACK
    //! WIDTH. The shelf inner surfaces are 539.40 \u00b1 1.05 and the inner
    //! vertical members 543.40 \u00b1 0.91.
    panel: 540.40,
    innerMembers: 543.40,
    shelfWidth: 539.40,
    overallWidth: 600.24,
    //! THE HOLE PATTERN, Figures 6.1.2.1 and 6.1.2.2, details E, F and J. Two
    //! holes to an OpenU, at 9 and 33 mm above that unit's own boundary - which
    //! is a different animal from EIA's three at 6.35 / 22.225 / 38.1, and is
    //! why a pattern invented to look right would have been wrong everywhere.
    holes: [9, 33],
    //! The round holes are Ø4.50 +0.075/-0 before paint, Ø4.26 painted, on the
    //! side members; the front face carries Ø5.40 +0.075/-0, Ø5.16 painted
    //! (Figure 6.1.2.2). Both take thread-forming screws - see ORV3_FASTENERS.
    bore: 4.5,
    borePainted: 4.26,
    frontBore: 5.4,
    frontBorePainted: 5.16,
    //! ORv3 HAS NO SQUARE CAGE-NUT HOLE. It is a thread-forming-screw rack, so
    //! the EIA figure would be meaningless here and is left out rather than
    //! carried across.
    square: null,
    //! §6.1.2.2: OU boundary to the front face of the outer member.
    flange: 33.0,
    //! Figure 6.1.1, OVERALL DEPTH REF. Datum A to the IT shelf stop is
    //! 789.0 \u00b1 1.04, to the rear inner member 669.06 \u00b1 0.9.
    depth: 1068.24,
    shelfStop: 789.0,
  },
  {
    key: "metav3",
    name: "Meta Open Rack V3 \u00b7 44 OU",
    //! Meta's own frame on the Open Rack V3 interface. "Meta Open Rack Frame V3
    //! Specification", revision 1.3, 3 June 2024. Unusually for these, its
    //! headline dimensions are in the PROSE rather than in a drawing, so they
    //! are quoted here as the document states them (\u00a76.1) - nominal, not
    //! toleranced.
    from: "Meta Open Rack Frame V3, rev 1.3, 3 June 2024 \u00b7 \u00a76.1 dimensions, "
        + "\u00a76.2 load, \u00a76.3 capacity, \u00a77.5 mounting points.",
    unit: 48,
    unitName: "OU",
    //! \u00a76.1.3 width 600 nominal, \u00a76.1.4 depth 1068 nominal,
    //! \u00a76.1.2 height 2286 (90 inches) floor to frame top.
    panel: 540.40,               // the ORv3 interface it is built to
    overallWidth: 600,
    depth: 1068,
    height: 2286,
    //! \u00a76.3: 44 OpenU or 47 RU, and 88 half-OpenU.
    units: 44,
    unitsRU: 47,
    //! The OU interface is Open Rack V3's, so the hole pattern is that one.
    holes: [9, 33],
    bore: 4.5,
    square: null,
    flange: 33.0,
    //! \u00a76.2: 1400 kg of IT, excluding the rack itself. Above 800 kg it
    //! wants a 1-OpenU cross brace, recommended between 18OU and 27OU and
    //! defaulting to 23OU - which is a real modelling decision, not a note.
    loadKg: 1400,
    braceAboveKg: 800,
    braceAtOU: 23,
    braceRange: [18, 27],
  },

  {
    key: "orw",
    name: "OCP Open Rack Wide \u00b7 ORW",
    //! "Open Rack Wide (ORW) Base Specification", V1.0.0. The vertical
    //! interface is Open Rack's - 48 mm OpenU, holes 9 and 33 above each
    //! boundary - and the frame is tapped M6 x 1.0 rather than taking
    //! thread-forming screws like ORv3 (Figure 4.2.2.1, details C and D).
    //!
    //! ITS OVERALL FRAME WIDTH IS NOT HERE, and that is the one number the word
    //! "Wide" is about. The frame cross-section (Figure 4.2.1.1) is drawn at a
    //! scale where I could not read the width callout with confidence, and the
    //! full-resolution copy is in the specification's Appendix A. A width
    //! guessed from the rack's NAME would be the exact mistake this file exists
    //! to avoid, so it is absent and a frame on this standard takes its width
    //! as an argument until somebody reads the appendix.
    from: "OCP Open Rack Wide (ORW) Base Specification V1.0.0 \u00b7 \u00a74.2.2 vertical "
        + "OU. Frame width not transcribed - see Figure 4.2.1.1 and Appendix A.",
    unit: 48,
    unitName: "OU",
    panel: null,
    overallWidth: null,
    depth: null,
    //! \u00a74.2.2 and Figure 4.2.2.1: 44 OU positions, measured at 1, 23 and 44.
    units: 44,
    holes: [9, 33],
    //! Tapped, not thread-forming: M6 x 1.0P through the front and rear inner
    //! verticals, at 24 mm (half-OU) spacing, with RU positions at 44.45 and
    //! 22.23 for the EIA option.
    thread: "M6 x 1.0",
    bore: 5.4,
    square: null,
    flange: 33.0,
    //! Front inner M6 centreline to rear inner M6 centreline, both sides.
    railToRail: 541.3,
  },

];

/* --------------------------------------------- what an Open Rack is bolted with

   §6.8 of the same document, and it is unusually specific: the rack is not
   built with cage nuts and bolts at all, it is built with THREAD-FORMING SCREWS
   driven straight into the sheet. Which screw goes in which hole is decided by
   the hole's diameter before paint, so the two are kept together here.        */

export const ORV3_FASTENERS = [
  { bore: 4.5, screw: "M5 thread-forming, DIN 7500",
    stripOut: 6.25, torque: 5, cycles: 5,
    from: "OCP Open Rack Base Frame V3 rev 1.1 \u00a76.8.1" },
  { bore: 5.4, screw: "M6 thread-forming, DIN 7500",
    stripOut: 6.25, torque: 5, cycles: 5,
    from: "OCP Open Rack Base Frame V3 rev 1.1 \u00a76.8.2" },
];

//! Which screw a hole of this size takes, by the diameter BEFORE paint - which
//! is how the specification indexes them, and is not the diameter you would
//! measure on a finished frame.
export const orv3Screw = bore =>
  ORV3_FASTENERS.find(one => Math.abs(one.bore - bore) < 0.01) || null;

//! §6.7, and every one of these is a SHALL. A levelling foot that does not
//! meet them is not an Open Rack foot, so they are here to be checked against
//! rather than remembered.
export const ORV3_FOOT = {
  swivelDia: 30,      // 6.7.1, at least
  liftsCasters: 15,   // 6.7.2, minimum off the floor
  driver: 8,          // 6.7.4, hex across flats
  maxTorque: 35,      // 6.7.5, N-m to raise or lower fully loaded
  from: "OCP Open Rack Base Frame V3 rev 1.1 \u00a76.7",
};

export const rackStandard = key =>
  RACK_STANDARDS.find(one => one.key === key) || RACK_STANDARDS[0];

//! HOW TALL A RACK OF n UNITS IS, and it is the only sum in a rack that
//! everybody gets right and then puts the holes on wrong.
export const rackHeight = (standard, units) => rackStandard(standard).unit * units;

//! WHERE EVERY MOUNTING HOLE IS UP A POST, from the bottom of unit 1. The list
//! a post is drilled from and the list a device is bolted to are this same
//! list, which is the whole reason it is a function rather than a drawing.
//!
//! \p pattern overrides the standard's own - which is how a post on a standard
//!    whose pattern is not published here gets one.
export function holeCentres(standard, units, pattern = null) {
  const spec = rackStandard(standard);
  const within = pattern && pattern.length ? pattern.slice() : spec.holes;
  if (!within || !within.length) return [];
  const out = [];
  for (let u = 0; u < units; u++)
    for (const at of within) out.push(u * spec.unit + at);
  return out;
}

//! The bottom of unit \p u, counting from 1 at the floor, which is how racks
//! are numbered and how every piece of equipment is specified.
export const unitBottom = (standard, u) => rackStandard(standard).unit * (u - 1);

//! WHICH HOLE IS WHICH, for a label or a bolt list: unit number and which of
//! the three within it. Racks are numbered from 1, and a U number in a data
//! centre is a location - "the switch is at U41" - so this has to agree with
//! the sticker on the rail.
export function holeName(standard, index, pattern = null) {
  const spec = rackStandard(standard);
  const within = (pattern && pattern.length ? pattern : spec.holes) || [];
  if (!within.length) return "";
  const per = within.length;
  return "U" + (Math.floor(index / per) + 1) + "." + ((index % per) + 1);
}

/* ------------------------------------------------------------- the sections

   Each one is a closed outline in the section's own plane, in millimetres,
   centred on the origin. The modeller extrudes exactly this, so a beam's
   profile is switched by asking for a different one and nothing else changes.

   T-slotted aluminium is drawn as its envelope with the slot mouths cut into
   it: the real extrusion has an internal web and a fillet in every corner, and
   at LOD 400 what matters is the envelope, the slot positions and the bore -
   which is what a fixing sees. The channel sections are drawn as the folded
   steel they are, to the published wall thickness.                          */

const rectOutline = (w, h) => [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];

//! A T-slot extrusion's envelope with a slot cut into the middle of each face.
//! Walked face by face rather than written out, so 20, 30, 40 and 45 are the
//! same shape at four sizes and cannot drift apart.
function tSlotOutline(size, slot, depth) {
  const h = size / 2, m = slot / 2, d = depth;
  const out = [];
  //! One side, from corner to corner, with the slot notched into the middle of
  //! it; then the whole thing turned three times. The notch is the mouth only:
  //! a real T-slot widens inside, and what a fixing sees is the mouth.
  const side = [[-h, -h], [-m, -h], [-m, -h + d], [m, -h + d], [m, -h], [h, -h]];
  for (let turn = 0; turn < 4; turn++) {
    const c = Math.cos((turn * Math.PI) / 2), s = Math.sin((turn * Math.PI) / 2);
    for (const [x, y] of side) out.push([x * c - y * s, x * s + y * c]);
  }
  return out;
}

//! A strut channel: the folded C with its lips turned back in, which is what a
//! Unistrut-pattern section is and why a nut can be turned into it.
function channelOutline(w, h, wall, lip) {
  const x = w / 2, y = h / 2, t = wall, l = lip;
  return [
    [-x, -y], [x, -y], [x, y], [x - t, y], [x - t, -y + t + l],
    [x - t - l, -y + t + l], [x - t - l, -y + t],
    [-x + t + l, -y + t], [-x + t + l, -y + t + l], [-x + t, -y + t + l],
    [-x + t, y], [-x, y],
  ];
}

export const STRUT_PROFILES = [
  { key: "ts20", name: "T-slot 20 × 20", w: 20, h: 20, bore: 4.2,
    from: "20 series aluminium extrusion, 6 mm slot",
    outline: () => tSlotOutline(20, 6, 2.2) },
  { key: "ts30", name: "T-slot 30 × 30", w: 30, h: 30, bore: 6.8,
    from: "30 series aluminium extrusion, 8 mm slot",
    outline: () => tSlotOutline(30, 8, 3) },
  { key: "ts40", name: "T-slot 40 × 40", w: 40, h: 40, bore: 10.5,
    from: "40 series aluminium extrusion, 10 mm slot",
    outline: () => tSlotOutline(40, 10, 3.5) },
  { key: "ts45", name: "T-slot 45 × 45", w: 45, h: 45, bore: 10.5,
    from: "45 series aluminium extrusion, 10 mm slot",
    outline: () => tSlotOutline(45, 10, 3.5) },
  { key: "ts4080", name: "T-slot 40 × 80", w: 80, h: 40, bore: 10.5,
    from: "40 series, double width",
    outline: () => {
      //! Two 40s side by side: the envelope of the pair with a slot in the
      //! middle of each of the six faces it has.
      const h = 20, m = 5, d = 3.5;
      return [
        [-40, -h], [-25, -h], [-25, -h + d], [-15, -h + d], [-15, -h],
        [15, -h], [15, -h + d], [25, -h + d], [25, -h], [40, -h],
        [40, -m], [40 - d, -m], [40 - d, m], [40, m], [40, h],
        [25, h], [25, h - d], [15, h - d], [15, h],
        [-15, h], [-15, h - d], [-25, h - d], [-25, h], [-40, h],
        [-40, m], [-40 + d, m], [-40 + d, -m], [-40, -m],
      ];
    } },
  { key: "p1000", name: "Strut channel 41 × 41", w: 41.3, h: 41.3, bore: 14,
    from: "Unistrut P1000 pattern, 2.5 mm wall, 41.3 mm square",
    outline: () => channelOutline(41.3, 41.3, 2.5, 6.5) },
  { key: "p3300", name: "Strut channel 41 × 21", w: 41.3, h: 20.6, bore: 14,
    from: "Unistrut P3300 pattern, 2.5 mm wall, half height",
    outline: () => channelOutline(41.3, 20.6, 2.5, 5) },
  { key: "angle", name: "Equal angle 40 × 40 × 4", w: 40, h: 40, bore: 9,
    from: "Hot-rolled equal angle, 4 mm",
    outline: () => [[-20, -20], [20, -20], [20, -16], [-16, -16], [-16, 20], [-20, 20]] },
  { key: "flat", name: "Flat bar 40 × 6", w: 40, h: 6, bore: 9,
    from: "Plain flat, for a rail or a stiffener",
    outline: () => rectOutline(40, 6) },
  { key: "rhs", name: "Box section 40 × 40 × 2", w: 40, h: 40, bore: 9,
    from: "Cold-formed RHS, 2 mm wall - drawn as its envelope",
    outline: () => rectOutline(40, 40) },
];

export const strutProfile = key =>
  STRUT_PROFILES.find(one => one.key === key) || STRUT_PROFILES[2];

//! THE HOLES ALONG A STRUT, as distances from one end. A strut is a beam with
//! a line of holes in it and the holes are what make it a KIT rather than a
//! piece of steel: they are on a pitch, they start a set-back from the end, and
//! the last one is a whole pitch from the other end or the section is wrong.
export function strutHoles(length, pitch, setback) {
  if (!(pitch > 0) || !(length > 0)) return [];
  const out = [];
  const first = Math.max(0, setback);
  for (let at = first; at <= length - first + 1e-9; at += pitch) out.push(Math.round(at * 1e4) / 1e4);
  return out;
}

/* ------------------------------------------------------------ the fasteners

   A bolt is the one part of a rack nobody should be modelling. It is bought,
   it conforms to a standard, and the supplier publishes a STEP file of it - so
   what this table holds is the standard each one conforms to and the handful of
   dimensions that decide whether it fits, and the geometry generated from them
   is a stand-in until the bought part's own file is wired in.

   NOTHING HERE IS A McMASTER-CARR PART NUMBER, and that is deliberate. This
   file cannot reach mcmaster.com and will not print a part number it has not
   read: a number that is nearly right is worse than no number, because
   somebody orders against it. What the Fastener node carries instead is a
   SUPPLIER field you fill in, which travels into the model, into the bill of
   materials and into the STEP export beside the part - and an input for the
   supplier's own STEP file, which replaces the stand-in geometry entirely when
   it is wired. That is the LOD 400 path: modelled to the standard until the
   bought part arrives, and the bought part after that.                      */

export const FASTENERS = [
  { key: "hex-m6-16", name: "Hex bolt M6 × 16", kind: "bolt",
    from: "ISO 4017 / DIN 933, fully threaded",
    thread: 6, pitch: 1, length: 16, flats: 10, headHeight: 4 },
  { key: "hex-m6-20", name: "Hex bolt M6 × 20", kind: "bolt",
    from: "ISO 4017 / DIN 933, fully threaded",
    thread: 6, pitch: 1, length: 20, flats: 10, headHeight: 4 },
  { key: "hex-m8-25", name: "Hex bolt M8 × 25", kind: "bolt",
    from: "ISO 4017 / DIN 933, fully threaded",
    thread: 8, pitch: 1.25, length: 25, flats: 13, headHeight: 5.3 },
  { key: "hex-m10-30", name: "Hex bolt M10 × 30", kind: "bolt",
    from: "ISO 4017 / DIN 933, fully threaded",
    thread: 10, pitch: 1.5, length: 30, flats: 17, headHeight: 6.4 },
  { key: "shcs-m6-16", name: "Socket head cap screw M6 × 16", kind: "cap",
    from: "ISO 4762 / DIN 912",
    thread: 6, pitch: 1, length: 16, flats: 10, headHeight: 6, headDia: 10, drive: 5 },
  { key: "nut-m6", name: "Hex nut M6", kind: "nut",
    from: "ISO 4032 / DIN 934", thread: 6, pitch: 1, flats: 10, headHeight: 5.2 },
  { key: "nut-m8", name: "Hex nut M8", kind: "nut",
    from: "ISO 4032 / DIN 934", thread: 8, pitch: 1.25, flats: 13, headHeight: 6.8 },
  { key: "nut-m10", name: "Hex nut M10", kind: "nut",
    from: "ISO 4032 / DIN 934", thread: 10, pitch: 1.5, flats: 17, headHeight: 8.4 },
  { key: "washer-m6", name: "Washer M6", kind: "washer",
    from: "ISO 7089 / DIN 125 A", thread: 6, headDia: 12, headHeight: 1.6 },
  { key: "washer-m8", name: "Washer M8", kind: "washer",
    from: "ISO 7089 / DIN 125 A", thread: 8, headDia: 16, headHeight: 1.6 },
  //! The one fastener that is particular to a rack, and the reason a rack post
  //! has square holes in it at all.
  { key: "cage-m6", name: "Cage nut M6", kind: "cage",
    from: "Fits a 9.5 mm square hole, EIA-310-E",
    thread: 6, pitch: 1, flats: 9.5, headHeight: 1.1, headDia: 12.7 },
  { key: "rack-1032", name: "Rack screw 10-32 × 1/2", kind: "cap",
    from: "10-32 UNF, the North American rack thread",
    thread: 4.83, pitch: 0.794, length: 12.7, flats: 8, headHeight: 3, headDia: 9.5, drive: 4 },
];

export const fastener = key => FASTENERS.find(one => one.key === key) || FASTENERS[0];

//! A hexagon across the flats, as a closed outline - a head, a nut, and the
//! hole a spanner goes on. Across the FLATS, because that is the number a
//! standard gives and a spanner reads; across the corners is flats/cos(30).
export function hexOutline(flats) {
  const r = flats / 2 / Math.cos(Math.PI / 6);
  const out = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3 + Math.PI / 6;
    out.push([Math.round(r * Math.cos(a) * 1e6) / 1e6, Math.round(r * Math.sin(a) * 1e6) / 1e6]);
  }
  return out;
}

/* ------------------------------------------------------------------ the bill

   The thing that makes a model LOD 400 rather than a picture of one: every
   part, how many, and what to order against. A bill that is written by hand
   beside a model is a bill that is wrong by the second revision, so this one
   is read off the model.                                                    */

//! \p parts  [{ name, supplier, from, kind }] - one entry per instance
//! \returns  one row per distinct part, with its count, in the order first seen
export function bomOf(parts) {
  const rows = new Map();
  for (const part of parts || []) {
    const key = [part.name, part.supplier || "", part.from || ""].join("\u0000");
    const had = rows.get(key);
    if (had) { had.count++; continue; }
    rows.set(key, { name: part.name, supplier: part.supplier || "",
                    from: part.from || "", kind: part.kind || "", count: 1 });
  }
  return [...rows.values()];
}

//! The bill as lines somebody can read, longest run first is NOT what this
//! does: it keeps the order the model is in, because a bill that matches the
//! tree is a bill you can check against the tree.
export function bomLines(parts) {
  return bomOf(parts).map(row =>
    String(row.count).padStart(4, " ") + " × " + row.name
    + (row.supplier ? "  · " + row.supplier : "")
    + (row.from ? "  · " + row.from : ""));
}

/* ======================================================= doors and perforation

   A DATA CENTRE DOOR IS A PERCENTAGE. Front and rear doors are perforated
   because the air has to get through them, and the number every specification
   is written around is the OPEN AREA - the fraction of the panel that is hole.
   ASHRAE TC 9.9 and every hyperscale spec want it high; 80% is the figure a
   modern high-density rack door is bought against, and below about 65% the
   door starts to be the restriction rather than the fans.

   So the perforation is not decoration here. The pattern and the pitch decide
   the number, the number is computed off the geometry that was actually built,
   and a door that does not make its target says so.                        */

//! The patterns a door is actually punched in. `open` is the fraction of the
//! pitch cell that is hole, worked out per pattern below rather than stored,
//! because it is the thing being checked and a stored one cannot be wrong in a
//! way anybody notices.
export const PERFORATIONS = [
  { key: "none", name: "Solid", kind: "none" },
  { key: "round-staggered", name: "Round, staggered 60°", kind: "round", stagger: true,
    from: "the standard ventilation punch: round holes on a triangular pitch" },
  { key: "round-square", name: "Round, square pitch", kind: "round", stagger: false,
    from: "round holes on a square pitch" },
  { key: "oblong", name: "Oblong slots", kind: "oblong", stagger: true,
    from: "slotted punch: more open area for the same web width" },
  { key: "hex", name: "Hexagonal", kind: "hex", stagger: true,
    from: "hex punch: the highest open area for a given web" },
];

export const perforation = key =>
  PERFORATIONS.find(one => one.key === key) || PERFORATIONS[1];

//! WHERE EVERY HOLE GOES, as centres within a width x height panel. Staggered
//! rows are offset half a pitch, which is what makes a 60 degree pattern and is
//! why it opens more area than a square one for the same web.
export function perforationCentres(width, height, pitchX, pitchY, stagger, margin = 0) {
  const out = [];
  if (!(width > 0 && height > 0 && pitchX > 0 && pitchY > 0)) return out;
  const usableW = width - 2 * margin, usableH = height - 2 * margin;
  if (usableW <= 0 || usableH <= 0) return out;
  const rows = Math.floor(usableH / pitchY) + 1;
  for (let r = 0; r < rows; r++) {
    const y = margin + r * pitchY + (usableH - (rows - 1) * pitchY) / 2;
    const shift = stagger && (r % 2) ? pitchX / 2 : 0;
    const cols = Math.floor((usableW - shift) / pitchX) + 1;
    const spread = (usableW - shift - (cols - 1) * pitchX) / 2;
    for (let c = 0; c < cols; c++) {
      const x = margin + shift + spread + c * pitchX;
      if (x < margin - 1e-9 || x > width - margin + 1e-9) continue;
      out.push([x, y]);
    }
  }
  return out;
}

//! THE AREA ONE HOLE TAKES OUT. Computed per shape so the open-area figure is
//! about the hole that was actually cut and not about a round one every time.
export function holeArea(kind, size, slot = 0) {
  if (kind === "round") return Math.PI * (size / 2) * (size / 2);
  //! A slot is a rectangle with a half-circle on each end - its area is the
  //! rectangle plus one whole circle, not the rectangle plus two half-guesses.
  if (kind === "oblong") return size * Math.max(0, slot - size) + Math.PI * (size / 2) * (size / 2);
  //! A regular hexagon across the flats: 2/sqrt(3) times the square on them.
  if (kind === "hex") return size * size * Math.sqrt(3) / 2 * (2 / Math.sqrt(3)) * 0.8660254;
  return 0;
}

//! What a door actually opens, off the holes that were actually placed.
export function openArea(holes, kind, size, slot, width, height) {
  const panel = width * height;
  if (!(panel > 0)) return 0;
  return holes * holeArea(kind, size, slot) / panel;
}

/* ============================================================ threads and feet

   A LEVELLING FOOT IS THE PART THAT CARRIES THE RACK. A loaded 48U rack is
   comfortably over a tonne, it stands on four of these, and the thread in them
   is what takes the load - so at LOD 400 the thread is geometry rather than a
   note on a drawing. These are the ISO metric coarse figures, which is the one
   table where the numbers are exact rather than typical.                    */

//! ISO 724 / ISO 261 coarse pitch. d is the nominal (major) diameter, pitch is
//! the coarse pitch, and the minor diameter is computed from them by the
//! standard's own relation rather than stored, so it cannot drift from them.
export const THREADS = [
  { key: "m8", name: "M8", d: 8, pitch: 1.25, flats: 13 },
  { key: "m10", name: "M10", d: 10, pitch: 1.5, flats: 17 },
  { key: "m12", name: "M12", d: 12, pitch: 1.75, flats: 19 },
  { key: "m16", name: "M16", d: 16, pitch: 2.0, flats: 24 },
  { key: "m20", name: "M20", d: 20, pitch: 2.5, flats: 30 },
  { key: "m24", name: "M24", d: 24, pitch: 3.0, flats: 36 },
];

export const thread = key => THREADS.find(one => one.key === key) || THREADS[2];

//! THE ISO 68-1 PROFILE, which is what makes a thread an M12 rather than a
//! groove 12 mm across. H is the height of the sharp triangle the profile is
//! cut from, and the flanks are truncated off it: H/8 at the crest, H/4 at the
//! root.
//!
//! THERE ARE TWO MINOR DIAMETERS AND THEY ARE BOTH REAL, which is the trap
//! here and is worth the extra field. The NUT's minor - the hole a tap leaves -
//! is D1 = d - 2*(5/8)H = 10.106 at M12 x 1.75. The BOLT's minor, at the
//! bottom of its rounded root, is d3 = d - 2*(17/24)H = 9.853. Both are
//! tabulated for M12 and picking the wrong one models a stud 0.25 mm too fat
//! or a tapped hole 0.25 mm too tight - which is exactly the size of error
//! that assembles perfectly on screen and does not in a rack.
export function threadProfile(spec) {
  const one = typeof spec === "string" ? thread(spec) : spec;
  const H = one.pitch * Math.sqrt(3) / 2;
  return { H, major: one.d,
           //! D1, the tapped hole.
           nutMinor: one.d - 2 * (5 / 8) * H,
           //! d3, the bottom of an external thread's root.
           boltMinor: one.d - 2 * (17 / 24) * H,
           pitchDia: one.d - 2 * (3 / 8) * H,
           //! How deep the groove is cut into the stud, crest to root.
           depth: (one.d - (one.d - 2 * (17 / 24) * H)) / 2 };
}
