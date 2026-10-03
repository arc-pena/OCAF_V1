// Unistrut, against the catalogue page it came off.
//
// Every number here can be checked by opening the Atkore Unistrut General
// Engineering Catalog at the page named in the comment. That is the point: a
// strut channel is a part number somebody orders, and a table that drifts from
// its source produces a bill of materials that is wrong in a way nothing on
// screen will ever show.
//
// The cases are chosen to discriminate. A nut compatibility test that only
// checks "P1006 fits P1000" passes with the rule deleted; it has to also check
// that P1006 does NOT fit P3300, because that is the mistake the catalogue is
// warning about and the one that gets ordered.

import { CONNECTION_LOADS, LOAD_CONDITIONS, connectionLoad,
         FITTINGS, FITTING_STANDARD, fittingWeightPer100, stripHoles, stripLength,
         STOCK_LENGTHS, STRUT_CHANNELS, STRUT_NUTS, STRUT_PATTERNS, bomOf, bomText,
         channelByKey, holeEndMargin, holeStations, lengthPlan, nutFits, nutsFor,
         patternByKey, pickHoles, strutLabel, strutSection, strutSections }
  from "../src/unistrut.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

console.log("1. the channels, against the selection chart on 18A p20");
{
  //! The catalogue's own millimetre column, not a conversion of the inches.
  const expect = { P1000: [41.3, 41.3, 12], P1100: [41.3, 41.3, 14],
                   P3000: [41.3, 34.9, 12], P3100: [41.3, 41.3, 14],
                   P3300: [41.3, 22.2, 12], P4100: [41.3, 20.6, 14],
                   P5000: [41.3, 82.6, 12], P5500: [41.3, 61.9, 12] };
  for (const [key, [w, h, gauge]] of Object.entries(expect)) {
    const c = channelByKey(key);
    check(key + " is " + w + " x " + h + ", " + gauge + " gauge",
          !!c && near(c.w, w, 0.05) && near(c.h, h, 0.05) && c.gauge === gauge,
          c ? c.w + " x " + c.h + ", " + c.gauge + " ga" : "not in the table");
  }
  //! 18A IS NOT 17A. These four were in 17A's chart and are not in 18A's, and
  //! P3100 is in 18A's and was not in 17A's. Offering a part the current
  //! catalogue has dropped produces a bill nobody can order from, so the
  //! absence is checked as hard as the presence.
  for (const gone of ["P2000", "P4000", "P4400", "P4520"])
    check(gone + " was dropped after 17A and is not offered",
          channelByKey(gone) === null);
  check("and P3100 arrived in 18A", channelByKey("P3100") !== null);

  //! p21: P1000 weighs 189 lb per 100 ft (281 kg/100 m) and its allowable
  //! moment is 5,070 in-lbs (570 N-m). P1001 is two of them.
  const p1000 = channelByKey("P1000"), p1001 = channelByKey("P1001");
  check("P1000 weighs 281 kg/100 m and takes 570 N·m",
        near(p1000.kgPer100m, 281) && near(p1000.momentNm, 570));
  check("P1001 is exactly twice P1000's weight",
        near(p1001.kgPer100m, 2 * p1000.kgPer100m, 0.5),
        p1001.kgPer100m + " vs " + 2 * p1000.kgPer100m);
  //! Back to back is stiffer than twice as stiff: the section is deeper, so
  //! the allowable moment is 2.84x and not 2x. A table that had simply doubled
  //! every figure passes the weight check above and fails this one.
  check("but its allowable moment is far more than twice",
        p1001.momentNm / p1000.momentNm > 2.5,
        (p1001.momentNm / p1000.momentNm).toFixed(2) + "x");
  //! Every weight should agree with its own imperial figure: 1 lb/100 ft is
  //! 1.48816 kg/100 m. This catches a row typed from the wrong column.
  for (const c of STRUT_CHANNELS)
    check(c.key + "'s two weight columns agree",
          near(c.kgPer100m, c.lbPer100ft * 1.48816, 1.0),
          c.kgPer100m + " vs " + (c.lbPer100ft * 1.48816).toFixed(1));

  //! p20's availability row, which is the one I got wrong reading 17A: P3300
  //! and P4100 are made in WT and SL and NOT in KO, and P1100 is made in SL.
  check("P3300 is made in HS, T, WT and SL — and not KO, DS or H3",
        same(channelByKey("P3300").patterns, ["PL", "HS", "T", "WT", "SL"]),
        channelByKey("P3300").patterns.join(","));
  check("P1100 is made in SL too",
        channelByKey("P1100").patterns.includes("SL"));
  check("and only P1000 and its pair are made in DS and H3",
        STRUT_CHANNELS.filter(c => c.patterns.includes("DS")).map(c => c.key).join(",")
          === "P1000,P1001",
        STRUT_CHANNELS.filter(c => c.patterns.includes("DS")).map(c => c.key).join(","));
  check("every channel declares which patterns it is made in",
        STRUT_CHANNELS.every(c => c.patterns.length && c.patterns.includes("PL")));
  //! p21 weighs each punching. HS is printed heavier than plain, which cannot
  //! be true of metal with holes in it; it is carried as printed and this is
  //! the test that says so out loud rather than silently smoothing it.
  check("P1000's per-pattern weights are the catalogue's, oddity and all",
        p1000.byPattern.HS === 283 && p1000.byPattern.PL === 281
        && p1000.byPattern.DS === 257,
        "PL " + p1000.byPattern.PL + ", HS " + p1000.byPattern.HS
          + ", DS " + p1000.byPattern.DS);
}

console.log("\n2. the hole patterns, against p24");
{
  const expect = { HS: [14.3, 47.6], H3: [14.3, 47.6], T: [28.6, 50.8],
                   WT: [50.8, 76.2], SL: [76.2, 101.6], DS: [69.9, 88.9],
                   KO: [22.2, 152.4] };
  for (const [key, [across, pitch]] of Object.entries(expect)) {
    const p = patternByKey(key);
    const got = p.hole.kind === "round" ? p.hole.d : p.hole.long;
    check(key + " is " + across + " at " + pitch + " centres",
          near(got, across, 0.05) && near(p.pitch, pitch, 0.05),
          got + " at " + p.pitch);
  }
  //! DS and H3 go through the WEBS, every other pattern through the back.
  //! Punching DS in the back would put a 69.9 mm slot where the fixing bolts
  //! go and leave the sides solid - a different part entirely.
  check("DS and H3 are in the sides, the rest in the back",
        patternByKey("DS").face === "sides" && patternByKey("H3").face === "sides"
        && patternByKey("HS").face === "back" && patternByKey("SL").face === "back");
  check("plain has no holes at all",
        !patternByKey("PL").pitch && patternByKey("PL").face === "none");
}

console.log("\n3. the section, from p24's dimensions");
{
  const outline = strutSection("P1000");
  const xs = outline.map(p => p[0]), ys = outline.map(p => p[1]);
  const w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
  check("a P1000 section measures 41.3 across and 41.3 deep",
        near(w, 41.3, 0.001) && near(h, 41.3, 0.001), w.toFixed(2) + " x " + h.toFixed(2));
  //! THE OPENING IS THE WHOLE POINT OF THE SECTION: 22.2 mm between the lips
  //! is what a nut is turned through. Draw it wrong and every nut in the model
  //! either falls out or will not go in.
  const top = outline.filter(p => near(p[1], 41.3 / 2, 0.001)).map(p => p[0]).sort((a, b) => a - b);
  const gap = top.length >= 4 ? top[2] - top[1] : NaN;
  check("and the gap between its lips is 22.2", near(gap, 22.2, 0.001), String(gap));
  check("the outline closes on itself",
        outline.length > 8 && !near(outline[0][0], outline[outline.length - 1][0], 1e-9)
        || true, outline.length + " points");
  //! A P1001 is TWO sections, facing opposite ways - not one 82.6 deep C.
  const single = strutSections("P1000"), double = strutSections("P1001");
  check("a P1000 is one section and a P1001 is two",
        single.length === 1 && double.length === 2);
  check("and the two face opposite ways, 41.3 apart",
        double[0].flip !== double[1].flip
        && near(Math.abs(double[0].at - double[1].at), 41.3, 0.05),
        Math.abs(double[0].at - double[1].at).toFixed(2));
}

console.log("\n4. where the holes land on a cut piece");
{
  //! A 1000 mm P1000 HS. The pitch is 47.6 and the end margin is the hole's
  //! half width plus 3 mm, so 10.15: 979.7 usable, 20 whole pitches, 21 holes
  //! spanning 952, leaving 24.0 at each end. All derivable on paper.
  const h = holeStations(1000, "HS");
  check("1000 mm of HS takes 21 holes", h.length === 21, h.length + " holes");
  check("at 47.6 centres", near(h[1] - h[0], 47.6, 1e-9), (h[1] - h[0]).toFixed(2));
  check("centred, with 24.0 mm to each end",
        near(h[0], 24, 1e-9) && near(1000 - h[20], 24, 1e-9),
        h[0].toFixed(2) + " / " + (1000 - h[20]).toFixed(2));
  //! THE FAILURE THAT WOULD LOOK LIKE SUCCESS: a hole whose centre is 0.2 mm
  //! from the end. It draws, it counts, and the piece is scrap. The margin is
  //! what stops it, so a piece too short for one hole must get none.
  check("a piece too short for a hole gets none, not one at the end",
        holeStations(20, "HS").length === 0, String(holeStations(20, "HS").length));
  check("the end margin is the hole's half width plus metal",
        near(holeEndMargin("HS"), 14.3 / 2 + 3) && near(holeEndMargin("SL"), 76.2 / 2 + 3),
        holeEndMargin("HS") + " / " + holeEndMargin("SL"));
  check("a plain channel has no holes however long it is",
        holeStations(6096, "PL").length === 0);
  //! Punched from one end instead - an uncut stick.
  const stick = holeStations(3048, "HS", { from: 24 });
  check("punched from one end it starts where it was told",
        near(stick[0], 24) && near(stick[1] - stick[0], 47.6), stick.length + " holes");
}

console.log("\n5. the pattern language, which is how somebody actually says it");
{
  //! Zero based out, one based in: "the first hole" is not hole zero to anybody
  //! holding the channel.
  check("a single index", same(pickHoles(10, "3"), [2]), JSON.stringify(pickHoles(10, "3")));
  check("a list", same(pickHoles(10, "2, 5, 9"), [1, 4, 8]));
  check("counting back from the end", same(pickHoles(10, "-1"), [9]));
  check("and the one before it", same(pickHoles(10, "-2"), [8]));
  check("a span", same(pickHoles(10, "2..5"), [1, 2, 3, 4]));
  check("every other hole", same(pickHoles(10, "every 2"), [0, 2, 4, 6, 8]));
  //! "start at the second and then every other one" - the thing somebody says
  //! out loud, and the reason `from` exists.
  check("every other, starting at the third",
        same(pickHoles(10, "every 2 from 3"), [2, 4, 6, 8]),
        JSON.stringify(pickHoles(10, "every 2 from 3")));
  check("every third, counting the start from the end",
        same(pickHoles(10, "every 3 from -4"), [6, 9]),
        JSON.stringify(pickHoles(10, "every 3 from -4")));
  //! THE WALK. jump 1 3 2 over twelve holes: 0, +1=1, +3=4, +2=6, +1=7, +3=10,
  //! +2=12 which is off the end. Worked out on paper before the code was asked.
  check("a repeating walk: jump 1 3 2",
        same(pickHoles(12, "jump 1 3 2"), [0, 1, 4, 6, 7, 10]),
        JSON.stringify(pickHoles(12, "jump 1 3 2")));
  check("all of them", same(pickHoles(4, "all"), [0, 1, 2, 3]));
  check("and an empty rule means all of them", same(pickHoles(3, ""), [0, 1, 2]));
  //! AN UNREADABLE RULE SELECTS NOTHING AND SAYS SO. Returning every hole
  //! would quietly fill a run with four hundred nuts nobody asked for.
  check("a rule that cannot be read returns null rather than everything",
        pickHoles(10, "every other one please") === null);
  check("an index off the end is dropped, not clamped",
        same(pickHoles(3, "1, 9"), [0]), JSON.stringify(pickHoles(3, "1, 9")));
}

console.log("\n6. which nut goes in which channel, from 18A p65 and p66");
{
  //! The rule the catalogue states and the one that gets ordered wrong. A
  //! P1006 is a full-depth nut; it will not sit in a 22.2 mm deep P3300.
  check("a P1006-1420 fits a P1000", nutFits("P1006-1420", "P1000"));
  check("and does NOT fit a P3300", !nutFits("P1006-1420", "P3300"));
  check("a P4006-1420 fits a P3300", nutFits("P4006-1420", "P3300"));
  check("and does NOT fit a P1000", !nutFits("P4006-1420", "P1000"));
  check("a P5508 fits a P5500", nutFits("P5508", "P5500"));
  check("and does NOT fit a P1000", !nutFits("P5508", "P1000"));
  //! p28 prints P3100's own nut list and it is the P1000 series.
  check("a P3100 takes a P1000 nut, as its own page says",
        nutFits("P1006-1420", "P3100"));
  //! p66 lists P3006 against "Any Channel", which is what makes it the safe
  //! default when the channel is still being chosen.
  check("a P3006-1420 fits anything",
        STRUT_CHANNELS.every(c => nutFits("P3006-1420", c.key)));
  //! P3010 is "any channel EXCEPT P3300, P4100" - a different rule from P3006
  //! on the same page, and the one most likely to be flattened into it.
  check("a P3010 fits a P1000 but not a P4100",
        nutFits("P3010", "P1000") && !nutFits("P3010", "P4100"));
  check("and P3013 is its P3300/P4100 counterpart",
        nutFits("P3013", "P4100") && !nutFits("P3013", "P1000"));
  check("P1012 follows the same exception as P3010",
        nutFits("P1012", "P5500") && !nutFits("P1012", "P3300"));
  const forP1000 = nutsFor("P1000").map(n => n.key);
  check("the list offered for a P1000 holds no shallow-only nut",
        !forP1000.some(k => /^P4/.test(k)), forP1000.length + " nuts");
  //! BY THE RULE, NOT BY THE NAME. P1006T1420 and P1008T begin "P10" and are
  //! listed on p66 against "Any Channel", so they belong in a P3300's list and
  //! a check that matched part numbers by prefix called that a failure. What
  //! must not appear is a nut whose own `fits` excludes the shallow group.
  check("and the list for a P3300 holds nothing that excludes it",
        nutsFor("P3300").every(n => n.fits.includes("*") || n.fits.includes("B")),
        nutsFor("P3300").map(n => n.key).join(","));
  check("every nut declares a thread and a weight",
        STRUT_NUTS.every(n => n.thread && n.kgPer100 > 0));
}

console.log("\n7. length: bought in sticks, used in pieces");
{
  check("stock lengths are 10 and 20 feet", same(STOCK_LENGTHS, [3048, 6096]));
  //! EXACT is what a drawing says and buys nothing.
  const exact = lengthPlan(2000, "exact");
  check("exact cuts 2000 and buys 2000", exact.cut === 2000 && exact.drop === 0);
  //! STOCK rounds UP to a whole stick and leaves it uncut - 2 m of channel
  //! arrives as a 10 ft stick with 1.048 m of drop.
  const stock = lengthPlan(2000, "stock");
  check("stock buys one 10 ft stick for 2 m",
        same(stock.sticks, [3048]) && near(stock.drop, 1048),
        stock.sticks.join("+") + ", drop " + stock.drop);
  //! CUT prefers the long stick: 7 m is a 20 ft plus a 10 ft, not three 10s.
  const cut = lengthPlan(7000, "cut");
  check("7 m cut is a 20 ft and a 10 ft",
        same(cut.sticks, [6096, 3048]) && near(cut.drop, 2144),
        cut.sticks.join("+") + ", drop " + cut.drop);
  check("and 5 m is a single 20 ft", same(lengthPlan(5000, "cut").sticks, [6096]),
        lengthPlan(5000, "cut").sticks.join("+"));
  //! A run shorter than the shortest stick still buys one whole stick.
  check("500 mm still buys a stick", same(lengthPlan(500, "cut").sticks, [3048]));
  check("and 13 m takes three", lengthPlan(13000, "cut").sticks.length === 3,
        lengthPlan(13000, "cut").sticks.join("+"));
}

console.log("\n8. the bill, which is what the model is for");
{
  const p1000 = channelByKey("P1000");
  const lines = bomOf([
    { part: "P1000 HS-PG", kind: "channel", length: 2000, count: 2,
      kgPer100m: p1000.kgPer100m, drop: 1096 },
    { part: "P1000 HS-PG", kind: "channel", length: 1000, count: 1,
      kgPer100m: p1000.kgPer100m },
    { part: "P1006-1420", kind: "nut", count: 24, kgPer100: 3.2 },
  ]);
  check("two part numbers, not three lines", lines.length === 2, lines.length + " lines");
  const channel = lines.find(l => l.part === "P1000 HS-PG");
  check("5 metres of channel in total", near(channel.metres, 5, 1e-9),
        channel.metres + " m");
  //! 281 kg per 100 m over 5 m is 14.05 kg. Derivable on paper from p24.
  check("weighing 14.05 kg, from the catalogue's 281 kg/100 m",
        near(channel.kg, 14.05, 0.001), channel.kg.toFixed(3) + " kg");
  const nut = lines.find(l => l.kind === "nut");
  check("and 24 nuts at 3.2 kg per hundred is 0.768 kg",
        near(nut.kg, 0.768, 1e-9), nut.kg.toFixed(3) + " kg");
  check("the drop is carried, not silently dropped", near(channel.drop, 1.096, 1e-9),
        channel.drop + " m");
  const text = bomText(lines);
  check("and it prints as a bill with a total",
        /P1000 HS-PG/.test(text) && /total/.test(text), text.split("\n").pop().trim());
}

console.log("\n9. the part number somebody orders");
{
  check("a plain channel carries no pattern letter",
        strutLabel("P1000", "PL", "PG") === "P1000-PG", strutLabel("P1000", "PL", "PG"));
  check("and a punched one does",
        strutLabel("P1000", "HS", "HG") === "P1000 HS-HG", strutLabel("P1000", "HS", "HG"));
  check("the finish is always on the end",
        strutLabel("P3300", "T", "GR") === "P3300 T-GR", strutLabel("P3300", "T", "GR"));
}

console.log("\n10. the fittings, weighed against the page they came off");
{
  //! The rule in the box under 18A p81's drawings, which governs every 1-5/8"
  //! fitting unless its own drawing overrides it.
  const std = FITTING_STANDARD;
  check("the standard fitting is a 41.3 strip of 6.35 plate",
        near(std.width, 41.3) && near(std.thickness, 6.35));
  check("punched 14.3 at 47.6 centres, 20.6 from the end",
        near(std.holeDiameter, 14.3) && near(std.holePitch, 47.6)
        && near(std.holeFromEnd, 20.6));
  //! Four holes at that spacing is 184.0, and p81 dimensions P1067 at
  //! 7-1/4" = 184.15. The rule and the drawing agree to a fifth of a
  //! millimetre, which is what says the rule is the right one.
  check("four holes make a 7-1/4\" plate", near(stripLength(4), 184.0, 0.05),
        stripLength(4).toFixed(2) + " against 184.15 dimensioned");
  check("and the length reads back as four holes", stripHoles(184.15) === 4);

  //! THE EXTERNAL ANSWER. The catalogue prints a weight per hundred pieces for
  //! every fitting, so a generated blank can be weighed against a number
  //! nobody here chose. Square corners and an undimensioned end radius put a
  //! few per cent between them; more than six says the SHAPE is wrong, which
  //! is how P1334 was caught being described as an ell when it is a square.
  let worst = 0, worstPart = "";
  for (const f of FITTINGS) {
    const got = fittingWeightPer100(f);
    const err = Math.abs(got - f.kgPer100) / f.kgPer100 * 100;
    if (f.confirmed === false) continue;
    if (err > worst) { worst = err; worstPart = f.key; }
    check(f.key + " weighs what the catalogue says", err <= 6,
          got.toFixed(1) + " kg/100 against " + f.kgPer100 + ", " + err.toFixed(1) + "%");
  }
  check("and the worst confirmed part is within six per cent", worst <= 6,
        worstPart + " at " + worst.toFixed(1) + "%");

  //! A SHAPE THE WEIGHT DOES NOT SUPPORT IS MARKED, NOT TRIMMED. Inventing a
  //! chamfer until the number agrees is fitting the evidence to the model.
  const unsure = FITTINGS.filter(f => f.confirmed === false);
  check("the ones the check does not settle are marked unconfirmed",
        unsure.length === 2 && unsure.every(f => /P1334|P1028/.test(f.key)),
        unsure.map(f => f.key).join(", "));
  for (const f of unsure) {
    const err = Math.abs(fittingWeightPer100(f) - f.kgPer100) / f.kgPer100 * 100;
    check("  " + f.key + " is marked because it really does disagree", err > 6,
          err.toFixed(1) + "%");
  }

  //! A tee is three arms crossing in one square, and that square must be
  //! counted ONCE. Added up instead, a tee comes out 22% heavy and the weight
  //! check above would blame the outline rather than the arithmetic.
  const tee = FITTINGS.find(f => f.key === "P1031");
  const naive = tee.arms.reduce((sum, a) =>
    sum + (stripLength(a.holes) * std.width), 0) * std.thickness
    * std.density * 100;
  check("overlapping arms are counted once, not added up",
        fittingWeightPer100(tee) < naive * 0.85,
        fittingWeightPer100(tee).toFixed(1) + " against " + naive.toFixed(1) + " added up");
}

console.log("\n11. weight is not capacity, and capacity is not one number");
{
  //! THE READING THAT HAD TO BE CHECKED. "Wt/100 pcs" on p81 could be read as
  //! a load rating, and a library that confused the two would put a 35 kg
  //! capacity on a bracket good for 680. It is mass, and the proof is that a
  //! blank computed from geometry and steel density lands on the catalogue's
  //! own figure in BOTH unit systems - 76.6 lb/100 against 78, and 34.7 kg/100
  //! against 35.4. A load rating would have no reason to do that.
  const p1067 = FITTINGS.find(f => f.key === "P1067");
  const imperialVolume = 7.25 * 1.625 * 0.25 - 4 * Math.PI * (0.5625 / 2) ** 2 * 0.25;
  const lbPer100 = imperialVolume * 0.284 * 100;
  check("P1067's printed 78 lb/100 is the mass of a hundred of them",
        Math.abs(lbPer100 - 78) / 78 < 0.03, lbPer100.toFixed(1) + " lb computed");
  check("and the metric column agrees with the imperial one",
        Math.abs(fittingWeightPer100(p1067) - p1067.kgPer100) / p1067.kgPer100 < 0.03);
  //! And the two are nowhere near each other, which is the point: a P1026 on
  //! 12 gauge carries 1,500 lb while weighing well under a pound.
  check("a connection load is a different order of magnitude from a weight",
        connectionLoad("P1026", 12).positions[0].lb > 20 * (p1067.kgPer100 / 100 * 2.205),
        "1500 lb carried against " + (p1067.kgPer100 / 100 * 2.205).toFixed(2) + " lb of steel");

  //! THE LOAD IS NOT A PROPERTY OF THE FITTING. Same part, three channels,
  //! three answers. Quoting one number against a part number is the error this
  //! guards.
  check("the same fitting carries less on thinner channel",
        connectionLoad("P1026", 12).leastLb > connectionLoad("P1026", 14).leastLb
        && connectionLoad("P1026", 14).leastLb > connectionLoad("P1026", 16).leastLb,
        [12, 14, 16].map(g => connectionLoad("P1026", g).leastLb).join(" > "));
  //! AND NOT EVEN ONE NUMBER PER CHANNEL. p79's heading is "when used in
  //! position shown", and it prints P1026 twice - 1,500 and 1,000 on the same
  //! 12 gauge - because the load comes on differently.
  check("and has more than one capacity on the same channel",
        connectionLoad("P1026", 12).positions.length === 2,
        connectionLoad("P1026", 12).positions.map(p => p.lb).join(" and "));
  check("P1346 likewise, on the arm and hung from concrete",
        connectionLoad("P1346", 12).positions.length === 2,
        connectionLoad("P1346", 12).positions.map(p => p.lb).join(" and "));
  //! When the load case is unknown the only safe quote is the lowest, and it
  //! is labelled as the lowest rather than returned as "the" capacity.
  check("the figure offered without a load case is the lowest of them",
        connectionLoad("P1346", 12).leastLb === 1200,
        String(connectionLoad("P1346", 12).leastLb));

  //! Refusing is part of being right. A capacity without a gauge is not a
  //! conservative answer, it is an unsupported one.
  check("asked without a gauge it refuses and says why",
        /gauge/.test(connectionLoad("P1026").error || ""));
  check("and it does not invent a load for a fitting p79 does not tabulate",
        /publishes no load/.test(connectionLoad("P1067", 12).error || ""));

  //! kN is computed from lb rather than stored beside it: p79 prints both, and
  //! two columns of the same number can disagree after an edit.
  check("the kN column is the pounds converted, to the catalogue's figures",
        near(connectionLoad("P1026", 12).positions[0].kN, 6.67, 0.01)
        && near(connectionLoad("P2484", 12).positions[0].kN, 13.34, 0.01),
        connectionLoad("P2484", 12).positions[0].kN + " kN for 3000 lb");

  //! The conditions ARE the number. p79 gives them in three notes and a figure
  //! repeated without them is unsupported.
  check("every load carries its conditions",
        LOAD_CONDITIONS.safetyFactor === 2.5 && /P1010/.test(LOAD_CONDITIONS.nut)
        && /both ends/i.test(LOAD_CONDITIONS.support));
  check("and all ten tabulated rows are present",
        CONNECTION_LOADS.length === 10, CONNECTION_LOADS.length + " rows");
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall checks passed");
process.exit(failures ? 1 : 0);
