// Unistrut, as a catalogue rather than as a shape.
//
// The difference this module exists for: a strut channel is not "a C section I
// drew, with holes I punched". It is a PART NUMBER. P1000 HS is 41.3 mm square,
// 12 gauge, with 14.3 mm holes at 47.6 mm centres, it comes in 10 and 20 foot
// sticks, it weighs 281 kg per 100 m, and a P1006-1420 nut fits it while a
// P4006-1420 does not. Every one of those facts belongs to the part, so every
// one of them is in the table below and none of them is typed in by hand.
//
// SOURCE. Atkore Unistrut / Power-Strut General Engineering Catalog, NUMBER
// 18A, 276 pages, read page by page rather than recalled:
//
//   p18  materials, finishes, standard lengths (10 ft and 20 ft, ±1/8")
//   p20  the channel selection chart - width, height, gauge, section
//        properties, and which hole patterns each family is made in
//   p21  P1000 and P1001 in full: section dimensions in millimetres, every
//        hole pattern with its hole size, spacing and its own weight
//   p28  P1100, P1101, P3100 and P3101, and P3100's own channel-nut list
//   p65  the spring nuts, by the depth of channel they are made for
//   p66  the nuts without springs, including the two different rules
//        "Any Channel" and "Any Channel EXCEPT P3300, P4100"
//
// EDITION MATTERS. 18A is not 17A with a new cover: 17A listed P2000, P4000,
// P4400 and P4520 and 18A does not, and 18A carries P3100 and P3101 which 17A
// did not. The table below is 18A's range, so a part it offers is a part that
// can still be bought.
//
// Imperial is what the catalogue is drawn in and millimetres are what it is
// dimensioned in; the millimetre figures below are the catalogue's own, not a
// conversion of the inch ones, because those two disagree in the last digit and
// the metric page is the one a metric model should follow.
//
// WHAT IS CATALOGUE AND WHAT IS MODELLED. The numbers are catalogue. The
// section OUTLINE is modelled from the catalogue's dimensions - the lip return
// radius is not dimensioned anywhere, so the corners here are square and the
// section is a few tenths fuller than the real cold-formed one at each bend.
// The nut BODIES are modelled to fit the channel they are declared against;
// their part numbers, threads and weights are catalogue.

/* ==================================================================== finishes

   p21. These are suffixes on the part number, so they belong to the part and
   not to a colour picker.                                                    */

export const STRUT_FINISHES = [
  { key: "PG", name: "Pre-galvanized", spec: "ASTM A653 G90",
    colour: [0.70, 0.72, 0.74], gloss: 0.32 },
  { key: "HG", name: "Hot-dipped galvanized", spec: "ASTM A123",
    colour: [0.62, 0.65, 0.68], gloss: 0.22 },
  { key: "PL", name: "Plain", spec: "no coating, oiled",
    colour: [0.52, 0.54, 0.57], gloss: 0.40 },
  { key: "GR", name: "Perma Green III", spec: "green epoxy",
    colour: [0.18, 0.38, 0.24], gloss: 0.30 },
  { key: "DF", name: "Unistrut Defender", spec: "ASTM A1046",
    colour: [0.66, 0.67, 0.64], gloss: 0.25 },
  { key: "ZD", name: "Electro-galvanized", spec: "ASTM B633",
    colour: [0.74, 0.76, 0.78], gloss: 0.45 },
];

/* ============================================================== hole patterns

   p24, drawn for P1000 and used across the 1-5/8" families. The catalogue
   gives a hole or slot size and a spacing; where it dimensions a distance from
   the end it is recorded, and where it does not, the run is CENTRED - which is
   what a cut piece of channel actually looks like and is the only choice that
   does not invent an end condition the catalogue never stated.               */

export const STRUT_PATTERNS = [
  { key: "PL", name: "Plain", face: "none",
    summary: "No holes. The section only." },
  { key: "HS", name: "HS — holes in the back", face: "back",
    hole: { kind: "round", d: 14.3 }, pitch: 47.6,
    summary: "9/16\" (14.3 mm) holes at 1-7/8\" (47.6 mm) centres, in the back of "
           + "the channel." },
  { key: "H3", name: "H3 — holes in both sides", face: "sides",
    hole: { kind: "round", d: 14.3 }, pitch: 47.6,
    summary: "The same 14.3 mm holes at 47.6 mm centres, through both webs instead "
           + "of the back." },
  { key: "T", name: "T — short slots", face: "back",
    hole: { kind: "slot", long: 28.6, wide: 14.3 }, pitch: 50.8,
    summary: "1-1/8\" x 9/16\" (28.6 x 14.3 mm) slots at 2\" (50.8 mm) centres." },
  { key: "WT", name: "WT — wide slots", face: "back",
    hole: { kind: "slot", long: 50.8, wide: 17.5 }, pitch: 76.2,
    summary: "2\" x 11/16\" (50.8 x 17.5 mm) slots at 3\" (76.2 mm) centres." },
  { key: "SL", name: "SL — long slots", face: "back",
    hole: { kind: "slot", long: 76.2, wide: 10.3 }, pitch: 101.6,
    summary: "3\" x 13/32\" (76.2 x 10.3 mm) slots at 4\" (101.6 mm) centres." },
  { key: "DS", name: "DS — slots in both sides", face: "sides",
    hole: { kind: "slot", long: 69.9, wide: 22.2 }, pitch: 88.9,
    summary: "2-3/4\" x 7/8\" (69.9 x 22.2 mm) slots at 3-1/2\" (88.9 mm) centres, "
           + "through both webs — pipe clamps mount on either side." },
  { key: "KO", name: "KO — knockouts", face: "back",
    hole: { kind: "round", d: 22.2 }, pitch: 152.4,
    summary: "7/8\" (22.2 mm) knockouts at 6\" (152.4 mm) centres." },
];

export const patternByKey = key =>
  STRUT_PATTERNS.find(p => p.key === String(key || "PL").toUpperCase()) || STRUT_PATTERNS[0];

/* ================================================================== channels

   p23's selection chart for the dimensions, gauge and section properties, and
   p24 for P1000's own. `patterns` is the catalogue's own availability row: a
   P3300 is not made in SL or H3 and asking for one should be refused by name
   rather than drawn.                                                         */

const WIDTH = 41.3;                 // every 1-5/8" family is this wide

export const STRUT_CHANNELS = [
  { key: "P1000", name: "P1000 — 1-5/8\" x 1-5/8\", 12 ga", w: WIDTH, h: 41.3,
    gauge: 12, wall: 2.7, kgPer100m: 281, lbPer100ft: 189, momentNm: 570,
    area: 0.555, inertia: 0.185, modulus: 0.202,
    patterns: ["PL", "HS", "T", "WT", "KO", "SL", "DS", "H3"], nutGroup: "A",
    //! p21 weighs each punching separately, and the figures are the
    //! catalogue's own even where they are surprising: HS comes out at 190 lb
    //! against plain's 189, which is heavier after metal has been removed.
    //! Carried as printed rather than corrected - a table that quietly
    //! disagrees with the page it cites is worse than one with an oddity in it.
    byPattern: { PL: 281, HS: 283, H3: 260, T: 275, WT: 275, SL: 275, DS: 257, KO: 275 },
    summary: "The one everybody means by Unistrut. 12 gauge, square, and the "
           + "section every fitting in the catalogue is cut for." },
  { key: "P1001", name: "P1001 — back to back, 12 ga", w: WIDTH, h: 82.6,
    gauge: 12, wall: 2.7, kgPer100m: 562, lbPer100ft: 378, momentNm: 1620,
    area: 1.111, inertia: 0.928, modulus: 0.571,
    patterns: ["PL", "HS", "T", "WT", "KO", "SL", "DS", "H3"], nutGroup: "A",
    doubled: true,
    summary: "Two P1000s welded back to back, 3-1/4\" deep. Two and a half times "
           + "the allowable moment of one." },
  { key: "P1100", name: "P1100 — 1-5/8\" x 1-5/8\", 14 ga", w: WIDTH, h: 41.3,
    gauge: 14, wall: 1.9, kgPer100m: 211, lbPer100ft: 142, momentNm: 460,
    area: 0.418, inertia: 0.145, modulus: 0.162,
    patterns: ["PL", "HS", "T", "WT", "KO", "SL"], nutGroup: "A",
    summary: "P1000's lighter gauge — the same outside, 14 gauge instead of 12." },
  { key: "P1101", name: "P1101 — back to back, 14 ga", w: WIDTH, h: 82.6,
    gauge: 14, wall: 1.9, kgPer100m: 423, lbPer100ft: 284, momentNm: 1280,
    area: 0.835, inertia: 0.733, modulus: 0.451,
    patterns: ["PL", "HS", "T", "WT", "KO", "SL"], nutGroup: "A", doubled: true,
    summary: "The 14 gauge back-to-back pair." },
  { key: "P3000", name: "P3000 — 1-5/8\" x 1-3/8\", 12 ga", w: WIDTH, h: 34.9,
    gauge: 12, wall: 2.7, kgPer100m: 253, lbPer100ft: 170, momentNm: 430,
    area: 0.500, inertia: 0.120, modulus: 0.153,
    patterns: ["PL", "HS", "T", "WT", "KO", "SL"], nutGroup: "A",
    summary: "A little shallower than P1000 and still takes a P1000 nut." },
  { key: "P3100", name: "P3100 — 1-5/8\" x 1-5/8\", 14 ga", w: WIDTH, h: 41.3,
    gauge: 14, wall: 1.9, kgPer100m: 211, lbPer100ft: 142, momentNm: 460,
    area: 0.418, inertia: 0.145, modulus: 0.162,
    patterns: ["PL", "HS", "T", "WT", "KO", "SL"], nutGroup: "A",
    //! p28 prints P3100's own channel-nut list and it is the P1000 series, so
    //! the group below is the catalogue's statement and not an inference from
    //! its being the same size as a P1100.
    summary: "The same size and gauge as a P1100, and nutted the same way." },
  { key: "P3300", name: "P3300 — 1-5/8\" x 7/8\", 12 ga", w: WIDTH, h: 22.2,
    gauge: 12, wall: 2.7, kgPer100m: 199, lbPer100ft: 134, momentNm: 200,
    area: 0.395, inertia: 0.037, modulus: 0.072,
    patterns: ["PL", "HS", "T", "WT", "SL"], nutGroup: "B",
    summary: "Half height, 12 gauge. Takes the shallow P4000-series nut, not a "
           + "P1000 one, and is not made with knockouts." },
  { key: "P4100", name: "P4100 — 1-5/8\" x 13/16\", 14 ga", w: WIDTH, h: 20.6,
    gauge: 14, wall: 1.9, kgPer100m: 146, lbPer100ft: 98, momentNm: 150,
    area: 0.290, inertia: 0.026, modulus: 0.054,
    patterns: ["PL", "HS", "T", "WT", "SL"], nutGroup: "B",
    summary: "The shallowest and lightest channel in the 18A range." },
  { key: "P5000", name: "P5000 — 1-5/8\" x 3-1/4\", 12 ga", w: WIDTH, h: 82.6,
    gauge: 12, wall: 2.7, kgPer100m: 305, lbPer100ft: 205, momentNm: 1780,
    area: 0.897, inertia: 1.098, modulus: 0.627,
    patterns: ["PL", "HS", "T", "WT", "KO", "SL"], nutGroup: "C",
    summary: "A deep single channel — one piece, not a welded pair, and three "
           + "times the allowable moment of a P1000." },
  { key: "P5500", name: "P5500 — 1-5/8\" x 2-7/16\", 12 ga", w: WIDTH, h: 61.9,
    gauge: 12, wall: 2.7, kgPer100m: 247, lbPer100ft: 166, momentNm: 1110,
    area: 0.726, inertia: 0.522, modulus: 0.390,
    patterns: ["PL", "HS", "T", "WT", "KO", "SL"], nutGroup: "C",
    summary: "Between P1000 and P5000 in depth, and takes the P5500-series nut." },
];

export const channelByKey = key =>
  STRUT_CHANNELS.find(c => c.key === String(key || "P1000").toUpperCase()) || null;

/* ====================================================================== nuts

   p73. The compatibility column is the valuable part and is kept as a GROUP
   rather than a list of channels, because that is how the catalogue states it:
   a nut fits a depth of channel, not a part number.

     A  P1000, P1100, P2000, P3000      - the full-depth 1-5/8" channels
     B  P3300, P4000, P4100, P4400, P4520 - the shallow ones
     C  P5000, P5500
     *  any channel                                                           */

export const STRUT_NUTS = [
  //! p65. Spring nuts, by the depth of channel they are made for.
  { key: "P1006-1420", name: "P1006-1420", thread: "1/4-20", fits: ["A"], spring: true, kgPer100: 3.2 },
  { key: "P1007", name: "P1007", thread: "5/16-18", fits: ["A"], spring: true, kgPer100: 2.7 },
  { key: "P1008", name: "P1008", thread: "3/8-16", fits: ["A"], spring: true, kgPer100: 4.5 },
  { key: "P1009", name: "P1009", thread: "7/16-14", fits: ["A"], spring: true, kgPer100: 4.1 },
  { key: "P1010", name: "P1010", thread: "1/2-13", fits: ["A"], spring: true, kgPer100: 5.4 },
  { key: "P1012S", name: "P1012S", thread: "5/8-11", fits: ["A"], spring: true, kgPer100: 9.5 },
  { key: "P4006-1420", name: "P4006-1420", thread: "1/4-20", fits: ["B"], spring: true, kgPer100: 3.2 },
  { key: "P4008", name: "P4008", thread: "3/8-16", fits: ["B"], spring: true, kgPer100: 4.1 },
  { key: "P4010", name: "P4010", thread: "1/2-13", fits: ["B"], spring: true, kgPer100: 3.6 },
  { key: "P5506-1420", name: "P5506-1420", thread: "1/4-20", fits: ["C"], spring: true, kgPer100: 3.2 },
  { key: "P5508", name: "P5508", thread: "3/8-16", fits: ["C"], spring: true, kgPer100: 4.5 },
  { key: "P5510", name: "P5510", thread: "1/2-13", fits: ["C"], spring: true, kgPer100: 5.4 },
  //! p66. "Any Channel", which is what makes these the safe default while the
  //! channel is still being chosen.
  { key: "P3006-1420", name: "P3006-1420", thread: "1/4-20", fits: ["*"], spring: false, kgPer100: 2.7 },
  { key: "P3008", name: "P3008", thread: "3/8-16", fits: ["*"], spring: false, kgPer100: 4.1 },
  { key: "P3016-1420", name: "P3016-1420", thread: "1/4-20", fits: ["*"], spring: false,
    kgPer100: 1.8, thin: true },
  //! And the ones p66 lists as "Any Channel EXCEPT P3300, P4100" - a different
  //! rule from "Any Channel" on the same page, and the one most likely to be
  //! flattened into it.
  { key: "P3010", name: "P3010", thread: "1/2-13", fits: ["A", "C"], spring: false, kgPer100: 5.0,
    note: "p66: any channel except P3300 and P4100" },
  { key: "P1012", name: "P1012", thread: "5/8-11", fits: ["A", "C"], spring: false, kgPer100: 9.1,
    note: "p66: any channel except P3300 and P4100" },
  { key: "P1023", name: "P1023", thread: "3/4-10", fits: ["A", "C"], spring: false, kgPer100: 9.1 },
  { key: "P3013", name: "P3013", thread: "1/2-13", fits: ["B"], spring: false, kgPer100: 3.6,
    note: "the P3300 and P4100 counterpart of P3010" },
  { key: "P4012", name: "P4012", thread: "5/8-11", fits: ["B"], spring: false, kgPer100: 5.0 },
  //! Twist-in nuts: no spring, turned a quarter turn into the channel.
  { key: "P1006T1420", name: "P1006T1420", thread: "1/4-20", fits: ["*"], spring: false,
    kgPer100: 3.2, twist: true },
  { key: "P1008T", name: "P1008T", thread: "3/8-16", fits: ["*"], spring: false,
    kgPer100: 4.5, twist: true },
  { key: "P1010T", name: "P1010T", thread: "1/2-13", fits: ["A", "C"], spring: false,
    kgPer100: 5.4, twist: true, note: "p66: any channel except P3300 and P4100" },
  { key: "P4010T", name: "P4010T", thread: "1/2-13", fits: ["B"], spring: false,
    kgPer100: 3.6, twist: true },
];

export const nutByKey = key => STRUT_NUTS.find(n => n.key === key) || null;

//! Which nuts will actually go in this channel, by the catalogue's own rule.
//! Asked BEFORE a nut is placed, so an impossible assembly is refused by name
//! rather than drawn and ordered.
export function nutsFor(channelKey) {
  const channel = channelByKey(channelKey);
  if (!channel) return [];
  return STRUT_NUTS.filter(n => n.fits.includes("*") || n.fits.includes(channel.nutGroup));
}

export function nutFits(nutKey, channelKey) {
  const nut = nutByKey(nutKey), channel = channelByKey(channelKey);
  if (!nut || !channel) return false;
  return nut.fits.includes("*") || nut.fits.includes(channel.nutGroup);
}

/* ================================================================= the section

   The folded C, from p24's dimensions: 41.3 wide, the lips turned in 9.5 from
   each edge leaving a 22.2 mm opening, and returned 7.1 mm back down into the
   channel. Square corners - see the header: the bend radius is not dimensioned
   in the catalogue and inventing one would put a number in a drawing that the
   source does not support.

   Drawn with the OPENING UP and the back at the bottom, with the origin at the
   centre of the section, so "which way is the slot facing" is a rotation about
   the run and nothing else.                                                  */

export const STRUT_OPENING = 22.2;
export const STRUT_LIP_RETURN = 7.1;

export function strutSection(channel) {
  const c = typeof channel === "string" ? channelByKey(channel) : channel;
  if (!c) return null;
  const x = c.w / 2, y = c.h / 2, t = c.wall;
  const lip = (c.w - STRUT_OPENING) / 2;          // 9.5 on a 41.3 channel
  const r = STRUT_LIP_RETURN;
  //! Anticlockwise from the bottom left, back at -y and opening at +y.
  return [
    [-x, -y], [x, -y],                            // the back, outside
    [x, y], [x - lip, y],                         // up the right web, in along the lip
    [x - lip, y - r],                             // the lip return, pointing down
    [x - lip - t, y - r], [x - lip - t, y - t],   // back up and in
    [x - t, y - t], [x - t, -y + t],              // down the inside of the web
    [-x + t, -y + t], [-x + t, y - t],            // along the inside of the back, up the left
    [-x + lip + t, y - t], [-x + lip + t, y - r],
    [-x + lip, y - r], [-x + lip, y],
    [-x, y],
  ];
}

//! A P1001 is two P1000s back to back, so it is drawn as two sections rather
//! than as one tall one - which is what it is, and which is why its openings
//! face opposite ways.
export function strutSections(channel) {
  const c = typeof channel === "string" ? channelByKey(channel) : channel;
  if (!c) return [];
  if (!c.doubled) return [{ outline: strutSection(c), at: 0, flip: false }];
  const one = { ...c, h: c.h / 2, doubled: false };
  const half = c.h / 4;
  return [{ outline: strutSection(one), at: half, flip: false },
          { outline: strutSection(one), at: -half, flip: true }];
}

/* ========================================================== holes along a run

   Where the holes are, which is the thing the whole package turns on: a nut
   goes IN A HOLE, a fitting bolts THROUGH one, and a bill of materials counts
   them. The catalogue gives a pitch and nothing about the ends, so a cut piece
   is punched symmetrically about its middle - which is what you get when a
   stick is cut, and is the only end condition the source supports.           */

//! The smallest distance from the end of a cut piece to the centre of a hole:
//! the hole's own half width plus a little metal. Below this the punch would
//! break out of the end and the piece would be scrap, so a hole that close is
//! not drawn at all.
export const holeEndMargin = pattern => {
  const p = typeof pattern === "string" ? patternByKey(pattern) : pattern;
  if (!p || !p.hole) return 0;
  const across = p.hole.kind === "round" ? p.hole.d : p.hole.long;
  return across / 2 + 3;
};

export function holeStations(length, pattern, options = {}) {
  const p = typeof pattern === "string" ? patternByKey(pattern) : pattern;
  if (!p || !p.pitch || !(length > 0)) return [];
  const pitch = options.pitch || p.pitch;
  const margin = options.margin != null ? options.margin : holeEndMargin(p);

  //! `from` punches from one end, which is what an uncut stick looks like.
  //! Without it the piece is punched symmetrically about its middle, which is
  //! what a cut piece looks like and is the only end condition the catalogue
  //! supports - it gives a pitch and says nothing about ends.
  if (options.from != null) {
    const out = [];
    for (let u = options.from; u <= length - margin; u += pitch)
      if (u >= margin) out.push(u);
    return out;
  }

  const usable = length - margin * 2;
  if (usable < 0) return [];
  const count = Math.floor(usable / pitch) + 1;
  const span = (count - 1) * pitch;
  const start = (length - span) / 2;
  const out = [];
  for (let i = 0; i < count; i++) out.push(start + i * pitch);
  return out;
}

/* ======================================================= choosing which holes

   The pattern language. What somebody actually says when they are putting nuts
   in a run is "second hole from the bottom", or "start at the second and then
   every other one", or "jump one, jump three, jump two, and again" - and none
   of those is a number you can type into a spacing field. So they are all one
   grammar here, over the INDEX of the hole rather than over millimetres:

     "3"              the third hole
     "2, 5, 9"        those three
     "-1"             the last one; -2 the one before it
     "2..7"           the third through the eighth
     "every 2"        every other hole, from the first
     "every 2 from 3" every other hole, starting at the fourth
     "every 3 from -4" counting from the end
     "jump 1 3 2"     a repeating walk: forward 1, then 3, then 2, then 1 again

   Indices are ZERO BASED in the result and ONE BASED in the text, because the
   text is what a person writes and "the first hole" is not hole zero to
   anybody who is holding the channel.                                        */

export function pickHoles(count, rule) {
  const text = String(rule == null ? "" : rule).trim();
  if (!count) return [];
  if (!text || /^all$/i.test(text)) return range(count);

  const at = i => {
    //! Negative counts from the end, as it does everywhere else a person
    //! writes an index: -1 is the last hole.
    const k = i < 0 ? count + i : i - 1;
    return k >= 0 && k < count ? k : null;
  };

  const jump = text.match(/^jump\s+([\d\s,]+)$/i);
  if (jump) {
    const steps = jump[1].split(/[\s,]+/).map(Number).filter(n => Number.isFinite(n) && n > 0);
    if (!steps.length) return [];
    const out = [];
    for (let i = 0, k = 0; i < count; k++) {
      out.push(i);
      i += steps[k % steps.length];
    }
    return out.filter(i => i < count);
  }

  const every = text.match(/^every\s+(\d+)(?:\s+from\s+(-?\d+))?$/i);
  if (every) {
    const step = Math.max(1, parseInt(every[1], 10));
    const first = every[2] != null ? at(parseInt(every[2], 10)) : 0;
    if (first == null) return [];
    const out = [];
    for (let i = first; i < count; i += step) out.push(i);
    return out;
  }

  const span = text.match(/^(-?\d+)\s*\.\.\s*(-?\d+)$/);
  if (span) {
    const a = at(parseInt(span[1], 10)), b = at(parseInt(span[2], 10));
    if (a == null || b == null) return [];
    const lo = Math.min(a, b), hi = Math.max(a, b);
    return range(hi - lo + 1).map(i => i + lo);
  }

  const list = text.split(/[\s,]+/).filter(Boolean).map(Number);
  if (list.length && list.every(Number.isFinite)) {
    const out = [];
    for (const n of list) { const k = at(n); if (k != null && !out.includes(k)) out.push(k); }
    return out.sort((a, b) => a - b);
  }
  //! An unreadable rule selects NOTHING and says so to its caller, rather than
  //! quietly selecting everything - a run that silently grew four hundred nuts
  //! is a worse answer than one that grew none.
  return null;
}

const range = n => Array.from({ length: n }, (_, i) => i);

/* ====================================================================== length

   Unistrut is bought in sticks and used in pieces, and which of those a model
   means changes the bill of materials completely. Three policies, and the one
   a job actually uses is the middle one:

     exact   the run is the length the wire is. What a drawing says.
     cut     sticks are bought and cut; the offcut is counted as drop.
     stock   the run is rounded UP to a whole stick and not cut at all, which
             is what happens when nobody wants a saw on site.                 */

export const STOCK_LENGTHS = [3048, 6096];    // 10 ft and 20 ft, p21

export function lengthPlan(needed, policy = "cut", stock = STOCK_LENGTHS) {
  const want = Math.max(0, Number(needed) || 0);
  const sticks = [...stock].sort((a, b) => a - b);
  if (policy === "exact" || !sticks.length)
    return { cut: want, bought: want, drop: 0, sticks: [], policy: "exact" };

  if (policy === "stock") {
    const fit = sticks.find(s => s >= want);
    //! Longer than the longest stick: it takes whole sticks and a last one,
    //! and the last one is still a whole stick under this policy.
    const whole = fit ? [fit] : [];
    if (!fit) {
      let left = want;
      while (left > 0) { whole.push(sticks[sticks.length - 1]); left -= sticks[sticks.length - 1]; }
    }
    const bought = whole.reduce((s, v) => s + v, 0);
    return { cut: want, bought, drop: bought - want, sticks: whole, policy: "stock" };
  }

  //! CUT. Buy the fewest sticks that cover it, preferring the longest - which
  //! is how it is actually ordered, because a 20 foot stick is cheaper per
  //! metre than two 10s and leaves one cut instead of two.
  const long = sticks[sticks.length - 1];
  const whole = [];
  let left = want;
  while (left > long) { whole.push(long); left -= long; }
  if (left > 0) {
    const fit = sticks.find(s => s >= left);
    whole.push(fit || long);
  }
  const bought = whole.reduce((s, v) => s + v, 0);
  return { cut: want, bought, drop: bought - want, sticks: whole, policy: "cut" };
}

/* ======================================================================== BOM

   What the model is for. A bill that counts PART NUMBERS, with the length and
   the weight that follow from the catalogue, so a run drawn on a wire can be
   ordered without anybody measuring the drawing.                             */

export function strutLabel(channelKey, patternKey, finishKey) {
  const parts = [String(channelKey || "P1000")];
  const pattern = String(patternKey || "PL").toUpperCase();
  if (pattern !== "PL") parts.push(pattern);
  const finish = String(finishKey || "PG").toUpperCase();
  return parts.join(" ") + "-" + finish;
}

export function bomOf(items) {
  const lines = new Map();
  for (const item of items || []) {
    const key = item.part;
    if (!lines.has(key))
      lines.set(key, { part: key, kind: item.kind, count: 0, metres: 0, kg: 0,
                       drop: 0, note: item.note || "" });
    const line = lines.get(key);
    line.count += item.count != null ? item.count : 1;
    if (item.length) line.metres += (item.length * (item.count || 1)) / 1000;
    if (item.drop) line.drop += item.drop / 1000;
    if (item.kgPer100m && item.length)
      line.kg += (item.kgPer100m / 100) * (item.length / 1000) * (item.count || 1);
    if (item.kgPer100) line.kg += (item.kgPer100 / 100) * (item.count || 1);
  }
  return [...lines.values()].sort((a, b) =>
    a.kind === b.kind ? a.part.localeCompare(b.part) : a.kind.localeCompare(b.kind));
}

export function bomText(lines) {
  const out = [];
  let kg = 0;
  for (const line of lines) {
    kg += line.kg;
    const bits = [line.part.padEnd(16)];
    bits.push(line.metres ? line.metres.toFixed(2).padStart(8) + " m"
                          : String(line.count).padStart(8) + "  ");
    bits.push(line.kg.toFixed(1).padStart(8) + " kg");
    if (line.drop > 0.001) bits.push("drop " + line.drop.toFixed(2) + " m");
    out.push(bits.join("  "));
  }
  out.push("".padEnd(16) + " ".repeat(10) + kg.toFixed(1).padStart(8) + " kg total");
  return out.join("\n");
}

/* ================================================== the Aisle Containment System

   Atkore/UBS "Unistrut Aisle Containment System with Cable Management", data
   sheet UCON-CUT-6147-2305 (2023), read off the sheet rather than recalled.
   It is in this module because it is a CATALOGUED PRODUCT with a fixed option
   set, not a thing somebody draws: the sheet's own "Product Options" are
   height, aisle width, aisle length, how many cantilever arms, and which door.

   What it is made of, from the frame table on sheet 2:

     columns        PG steel HSS 4 x 4
     cantilever arms PG steel grade 1008, Unistrut P1001 - the back-to-back
                    channel already in the table above
     door assembly  aluminium extrusion
     panels         6 mm twinwall polycarbonate, ASTM E84 flame spread < 25
                    and smoke developed < 450

   The three aisle widths and three heights are the sheet's, in inches, and are
   the only ones offered; bay width is fixed at 72". Aisle length is variable
   and arm spacing is custom, which is why those two are numbers here and the
   others are choices.                                                        */

export const CONTAINMENT = {
  source: "Atkore / Unistrut Buffalo Supports, UCON-CUT-6147-2305 (2023)",
  //! Inches on the sheet, millimetres here, exact: 1 in = 25.4 mm.
  aisleWidths: [1219.2, 1524, 1828.8],            //  48", 60", 72"
  aisleHeights: [3657.6, 3962.4, 4267.2],         // 144", 156", 168"
  bayWidth: 1828.8,                               //  72", fixed
  column: { kind: "HSS", size: 101.6, wall: 6.35, material: "PG steel",
            note: "HSS 4 x 4 on the sheet; the wall is not dimensioned there" },
  arm: { channel: "P1001", material: "PG steel grade 1008" },
  panel: { thickness: 6, material: "twinwall polycarbonate",
           flameSpread: 25, smokeDeveloped: 450, test: "ASTM E84" },
  doors: ["Sliding", "Swing"],

  //! THE CROSS BRACING, AND WHERE IT IS NOT. On the sheet's render the X
  //! bracing sits in the CROSS-AISLE vertical plane and only in the storey
  //! ABOVE the containment roof - the zone carrying the cantilever arms. The
  //! enclosure below it is unbraced.
  //!
  //! Which is the only place it could go, and the reason is worth keeping: the
  //! arms hang tray loads out on both sides of a frame two bays wide, so the
  //! tower above the aisle is a sway frame and has to be triangulated. The
  //! storey below is a door and polycarbonate panels for its whole length, and
  //! you cannot put a diagonal through a door.
  //!
  //! Read off the render, not off a dimensioned drawing: the sheet's two line
  //! elevations show the frame WITHOUT the bracing, so the member size and
  //! which bays are braced are not stated anywhere here. Modelled as every
  //! bay unless told otherwise, and said so rather than guessed quietly.
  bracing: { plane: "cross-aisle", storey: "above the containment roof",
             pattern: "X", bays: "not stated on the sheet",
             member: "not dimensioned on the sheet",
             from: "the 3D render; the line elevations omit it" },
  summary: "A floor-supported hot aisle containment frame: HSS 4x4 columns at "
         + "72\" bays, P1001 cantilever arms carrying cable tray at custom "
         + "spacings, twinwall polycarbonate roof panels and a sliding or "
         + "swing door at the end of the aisle.",
};

//! The sheet offers three widths and three heights and nothing between them,
//! so a model that asks for 1500 mm is asking for a product that is not made.
//! Rounded to the nearest offered size and SAID, rather than drawn to order.
export function containmentFit(wanted, offered) {
  const want = Number(wanted);
  if (!Number.isFinite(want)) return { value: offered[0], asked: wanted, moved: true };
  let best = offered[0];
  for (const v of offered) if (Math.abs(v - want) < Math.abs(best - want)) best = v;
  return { value: best, asked: want, moved: Math.abs(best - want) > 0.5 };
}
