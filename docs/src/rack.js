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
    name: "OCP Open Rack v3 · 21 inch",
    from: "Open Compute Project Open Rack v3. The OpenU, the equipment width "
        + "and the frame width are published; the post hole pattern here is NOT "
        + "from the specification - set it on the post.",
    unit: 48,                    // one OpenU
    unitName: "OU",
    panel: 537,                  // 21" equipment width
    columns: 465.1,
    holes: null,                 // see `from` - not invented
    square: 9.5,
    flange: 15.875,
    depth: 1068,
  },
];

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
