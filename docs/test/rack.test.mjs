// The rack standards, against the standards.
//
// Every number in rack.js is a number somebody else decided, so every check
// here is against the published value rather than against the program. A rack
// that is 2 mm out over 42U looks perfect and does not accept equipment, and
// the only way to know is to check the arithmetic against the inch fractions
// it came from - which is what this does, by computing each one from 25.4 mm
// to the inch rather than by repeating the millimetre figure.
import { FASTENERS, ORV3_FASTENERS, ORV3_FOOT, RACK_STANDARDS, STRUT_PROFILES,
         bomLines, bomOf, fastener, hexOutline, holeCentres, holeName, orv3Screw,
         rackHeight, rackStandard, strutHoles, strutProfile,
         unitBottom } from "../src/rack.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol;
const inch = n => n * 25.4;

console.log("1. EIA-310-E, computed from the inch fractions it is written in");
{
  const eia = rackStandard("eia310");
  check("1U is 1.75 inches", near(eia.unit, inch(1.75)), eia.unit + " vs " + inch(1.75));
  check("the panel is 19 inches", near(eia.panel, inch(19)), String(eia.panel));
  //! THE TWO THAT ARE NOT INCH FRACTIONS, and they are the two somebody will
  //! "correct" one day by converting in their head. The standard prints them
  //! as rounded metric and the rounded metric is what parts are made to: a
  //! cage nut is made to 9.5, and 3/8" - 9.525 - is a loose hole. So they are
  //! checked against the printed figure, and separately shown to be NEAR the
  //! inch conversion but not equal to it, which is the fact worth recording.
  check("the hole columns are the printed 465.1 mm", near(eia.columns, 465.1),
        String(eia.columns));
  check("which is 18.312 inches to within 25 microns, and not exactly",
        Math.abs(eia.columns - inch(18.312)) < 0.03
        && !near(eia.columns, inch(18.312), 1e-6),
        (inch(18.312) - eia.columns).toFixed(4) + " mm apart");
  check("the cage-nut hole is the printed 9.5 mm square", near(eia.square, 9.5),
        String(eia.square));
  check("which is 3/8 of an inch to within 25 microns, and not exactly",
        Math.abs(eia.square - inch(0.375)) < 0.03 && !near(eia.square, inch(0.375), 1e-6),
        (inch(0.375) - eia.square).toFixed(4) + " mm apart");
  //! THE PATTERN, which is the one nobody remembers and everybody gets wrong:
  //! 1/2", then 5/8", then 5/8", and round again. Checked as the GAPS rather
  //! than as the positions, because it is the gaps the standard states.
  const at = eia.holes;
  check("three holes to a U", at.length === 3, String(at.length));
  check("the first is 1/4 inch above the boundary", near(at[0], inch(0.25)), String(at[0]));
  check("then 5/8, then 5/8",
        near(at[1] - at[0], inch(0.625)) && near(at[2] - at[1], inch(0.625)),
        (at[1] - at[0]) + ", " + (at[2] - at[1]));
  check("and 1/2 to the first hole of the next unit",
        near(eia.unit + at[0] - at[2], inch(0.5)), String(eia.unit + at[0] - at[2]));
  //! And they add up: the three gaps within a U plus the one across the
  //! boundary is exactly 1U. If this fails the pattern drifts up the rack.
  check("so the pattern closes exactly on one U",
        near((at[1] - at[0]) + (at[2] - at[1]) + (eia.unit + at[0] - at[2]), eia.unit));
}

console.log("\n2. a rack of 42U, and where its holes are");
{
  check("42U is 1866.9 mm", near(rackHeight("eia310", 42), 1866.9, 1e-9),
        String(rackHeight("eia310", 42)));
  //! 47U is the tall one a hyperscale row uses, and it has to come out at an
  //! exact inch too.
  check("47U is 2089.15 mm", near(rackHeight("eia310", 47), inch(1.75 * 47), 1e-9),
        String(rackHeight("eia310", 47)));
  const holes = holeCentres("eia310", 42);
  check("126 holes up a 42U post", holes.length === 126, String(holes.length));
  check("the first is 6.35 mm up", near(holes[0], 6.35));
  //! THE LAST ONE IS THE CHECK THAT MATTERS: 41 units of 44.45 plus 38.1. Get
  //! the pattern wrong by a tenth and this is 12 mm out by the top of the rack.
  check("and the last is 41 units up plus 38.1",
        near(holes[125], 41 * 44.45 + 38.1), String(holes[125]));
  check("every gap is 5/8, 5/8 or 1/2 of an inch",
        holes.slice(1).every((v, i) => [inch(0.625), inch(0.5)]
          .some(g => near(v - holes[i], g))), "");
  check("unit 1 starts at the floor and unit 42 at 41 units up",
        near(unitBottom("eia310", 1), 0) && near(unitBottom("eia310", 42), 41 * 44.45));
  check("and a hole says which U it is in", holeName("eia310", 0) === "U1.1"
        && holeName("eia310", 3) === "U2.1" && holeName("eia310", 125) === "U42.3",
        holeName("eia310", 125));
}

console.log("\n3. the hyperscale rack, read off the specification at last");
{
  //! THIS SECTION USED TO CHECK THAT THE ANSWER WAS ABSENT. The row carried no
  //! hole pattern and said in words that it had not been read off the
  //! specification, and the test asserted exactly that - which was the right
  //! thing to assert while it was true. The specification is here now (OCP Open
  //! Rack Base Frame V3, rev 1.1, 5 March 2024), so the checks are against it.
  const ocp = rackStandard("orv3");
  check("an OpenU is 48 mm", near(ocp.unit, 48), String(ocp.unit));
  //! Figure 6.1.1: latch datum to latch datum, which the drawing calls RACK
  //! WIDTH. The 537 this row used to carry was not from this document - the
  //! IT gear's own width belongs to the IT equipment specification.
  check("the rack width is the latch datums, 540.40", near(ocp.panel, 540.40), String(ocp.panel));
  check("the inner vertical members are 543.40 apart",
        near(ocp.innerMembers, 543.40), String(ocp.innerMembers));
  check("and the frame is 600.24 overall", near(ocp.overallWidth, 600.24), String(ocp.overallWidth));
  check("1068.24 deep", near(ocp.depth, 1068.24), String(ocp.depth));

  //! THE PATTERN, Figures 6.1.2.1 and 6.1.2.2. Two holes to an OpenU at 9 and
  //! 33 above that unit's own boundary - which is a different animal from
  //! EIA's three at 6.35 / 22.225 / 38.1, and is exactly why inventing one
  //! would have been wrong at every hole rather than nearly right.
  check("two holes to an OpenU, at 9 and 33 above its boundary",
        Array.isArray(ocp.holes) && ocp.holes.length === 2
          && near(ocp.holes[0], 9) && near(ocp.holes[1], 33),
        JSON.stringify(ocp.holes));
  const up = holeCentres("orv3", 4);
  check("so a 4 OU post has eight holes", up.length === 8, String(up.length));
  check("the first at 9 and the last at 3 OU plus 33",
        near(up[0], 9) && near(up[7], 3 * 48 + 33), JSON.stringify([up[0], up[7]]));
  //! EVERY GAP IS 24 OR 24, because 9 to 33 is 24 and 33 to the next 9 is 24 -
  //! the ORv3 pattern really is evenly spaced, which is the opposite of EIA's
  //! and is worth asserting so nobody "fixes" one to match the other.
  const gaps = up.slice(1).map((v, i) => Math.round((v - up[i]) * 1000) / 1000);
  check("and unlike EIA every gap is the same 24 mm",
        gaps.every(g => near(g, 24)), JSON.stringify([...new Set(gaps)]));

  //! IT IS NOT A CAGE-NUT RACK. Square holes are an EIA feature; ORv3 takes
  //! thread-forming screws straight into the sheet (\u00a76.8), so carrying the
  //! EIA square across would describe a rack that does not exist.
  check("it has no square cage-nut hole", ocp.square === null, String(ocp.square));
  check("a 4.5 hole takes an M5 thread-forming screw to DIN 7500",
        /M5 thread-forming, DIN 7500/.test((orv3Screw(4.5) || {}).screw || ""),
        JSON.stringify(orv3Screw(4.5)));
  check("and a 5.4 hole an M6",
        /M6 thread-forming, DIN 7500/.test((orv3Screw(5.4) || {}).screw || ""),
        JSON.stringify(orv3Screw(5.4)));
  check("every screw row cites its clause",
        ORV3_FASTENERS.every(one => /\u00a76\.8/.test(one.from)),
        ORV3_FASTENERS.map(one => one.from).join(" | "));

  //! \u00a76.7, all SHALLs.
  check("a levelling foot is at least 30 mm and driven by an 8 mm hex",
        ORV3_FOOT.swivelDia === 30 && ORV3_FOOT.driver === 8,
        JSON.stringify(ORV3_FOOT));

  //! And a pattern given on the node still overrides the standard's.
  const given = holeCentres("orv3", 4, [12, 24, 36]);
  check("a pattern typed on the node still wins",
        given.length === 12 && near(given[0], 12) && near(given[11], 3 * 48 + 36),
        JSON.stringify([given[0], given[11]]));
}

console.log("\n3b. and the two racks built on that same interface");
{
  //! META'S FRAME, whose headline numbers are in the prose rather than in a
  //! drawing (\u00a76.1) - so they are quoted as stated: nominal, untoleranced.
  const meta = rackStandard("metav3");
  check("Meta's V3 frame is 2286 tall, 600 wide, 1068 deep",
        meta.height === 2286 && meta.overallWidth === 600 && meta.depth === 1068,
        [meta.height, meta.overallWidth, meta.depth].join(" x "));
  check("it holds 44 OpenU or 47 RU", meta.units === 44 && meta.unitsRU === 47,
        meta.units + " / " + meta.unitsRU);
  check("rated 1400 kg, wanting a cross brace above 800",
        meta.loadKg === 1400 && meta.braceAboveKg === 800, JSON.stringify(meta.loadKg));
  check("with the brace defaulting to 23 OU, inside the 18-27 range",
        meta.braceAtOU === 23 && meta.braceRange[0] === 18 && meta.braceRange[1] === 27,
        JSON.stringify(meta.braceRange));
  check("and it is the same OU interface", JSON.stringify(meta.holes) === "[9,33]",
        JSON.stringify(meta.holes));

  //! OPEN RACK WIDE. Its vertical interface is Open Rack's and is here; its
  //! FRAME WIDTH is not, because the cross-section is drawn too small to read
  //! and the full-resolution copy is in the specification's appendix. A width
  //! guessed from the word "Wide" is the one mistake this file exists to avoid.
  const orw = rackStandard("orw");
  check("ORW shares the 48 mm OpenU and its 9/33 pattern",
        orw.unit === 48 && JSON.stringify(orw.holes) === "[9,33]",
        orw.unit + " " + JSON.stringify(orw.holes));
  check("it is TAPPED M6 x 1.0, not thread-forming like ORv3",
        orw.thread === "M6 x 1.0", String(orw.thread));
  check("44 OU positions", orw.units === 44, String(orw.units));
  check("its frame width is absent rather than guessed from its name",
        orw.overallWidth === null && orw.panel === null,
        JSON.stringify([orw.overallWidth, orw.panel]));
  check("and the row says where to read it",
        /Appendix A/.test(orw.from), orw.from);
}

console.log("\n4. the sections, as closed outlines at their published sizes");
{
  for (const spec of STRUT_PROFILES) {
    const out = spec.outline();
    let lo = [Infinity, Infinity], hi = [-Infinity, -Infinity];
    for (const p of out) {
      lo = [Math.min(lo[0], p[0]), Math.min(lo[1], p[1])];
      hi = [Math.max(hi[0], p[0]), Math.max(hi[1], p[1])];
    }
    const w = hi[0] - lo[0], h = hi[1] - lo[1];
    check(spec.name + " measures what it says it does",
          near(w, spec.w, 1e-6) && near(h, spec.h, 1e-6),
          w.toFixed(3) + " × " + h.toFixed(3) + " against " + spec.w + " × " + spec.h);
    check("  and it is a closed outline of at least four corners",
          out.length >= 4 && out.every(p => p.length === 2 && p.every(Number.isFinite)));
    //! CENTRED ON THE ORIGIN, every one of them, because a beam is placed by
    //! its centreline and a section that is off-centre puts the beam somewhere
    //! else - which looks like a modelling mistake and is a table mistake.
    check("  and it is centred on its own origin",
          near((lo[0] + hi[0]) / 2, 0, 1e-6) && near((lo[1] + hi[1]) / 2, 0, 1e-6),
          ((lo[0] + hi[0]) / 2).toFixed(4) + ", " + ((lo[1] + hi[1]) / 2).toFixed(4));
  }
  //! A T-slot has a slot in the middle of every face, and they are what a
  //! fixing slides into: four mouths on a square section, and each one on the
  //! centreline of its face.
  const forty = strutProfile("ts40").outline();
  check("a 40 T-slot has four slot mouths, one per face",
        forty.length === 24, String(forty.length));
  check("and a profile asked for by a name nobody has is the 40, not a crash",
        strutProfile("nonsense").key === "ts40");
}

console.log("\n5. the holes along a strut");
{
  //! A 1000 mm strut on a 50 mm pitch set back 25: 25, 75 ... 975. Twenty
  //! holes, and the last one the same distance from its end as the first.
  const holes = strutHoles(1000, 50, 25);
  check("twenty holes on a 50 pitch in a metre", holes.length === 20, String(holes.length));
  check("the first is the set-back and the last is a set-back from the far end",
        near(holes[0], 25) && near(holes[19], 975), holes[0] + " to " + holes[19]);
  check("no pitch means no holes", strutHoles(1000, 0, 25).length === 0);
}

console.log("\n6. the fasteners, and the promise not to invent a part number");
{
  const bolt = fastener("hex-m6-16");
  check("an M6 hex bolt is 10 across the flats", near(bolt.flats, 10), String(bolt.flats));
  check("with a 1 mm pitch and a 4 mm head", near(bolt.pitch, 1) && near(bolt.headHeight, 4));
  check("every fastener says which standard it conforms to",
        FASTENERS.every(one => one.from && one.from.length > 8));
  //! NOT ONE PART NUMBER IN THE TABLE, which is the point: this file cannot
  //! reach a supplier's catalogue and will not print a number it has not read,
  //! because a number that is nearly right gets ordered against.
  check("and not one of them carries a supplier part number",
        FASTENERS.every(one => !("mcmaster" in one) && !("sku" in one)));

  //! A hexagon is specified ACROSS THE FLATS and drawn across the corners, and
  //! mixing them up makes every nut 15% too big. flats/cos(30) is the check.
  const hex = hexOutline(10);
  check("a hexagon is six corners", hex.length === 6);
  const across = Math.max(...hex.map(p => Math.hypot(p[0], p[1]))) * 2;
  check("and 10 across the flats is 11.547 across the corners",
        near(across, 10 / Math.cos(Math.PI / 6), 1e-5), across.toFixed(4));
  let flat = Infinity;
  for (let i = 0; i < 6; i++) {
    const a = hex[i], b = hex[(i + 1) % 6];
    flat = Math.min(flat, Math.hypot((a[0] + b[0]) / 2, (a[1] + b[1]) / 2) * 2);
  }
  check("which is 10 measured the way a spanner measures it", near(flat, 10, 1e-5),
        flat.toFixed(4));
}

console.log("\n7. the bill of materials, read off the parts");
{
  const parts = [
    { name: "Hex bolt M6 × 16", from: "ISO 4017", supplier: "91290A115" },
    { name: "Hex bolt M6 × 16", from: "ISO 4017", supplier: "91290A115" },
    { name: "Hex nut M6", from: "ISO 4032", supplier: "" },
    { name: "Hex bolt M6 × 16", from: "ISO 4017", supplier: "91290A115" },
  ];
  const rows = bomOf(parts);
  check("one row per distinct part", rows.length === 2, String(rows.length));
  check("counted", rows[0].count === 3 && rows[1].count === 1,
        rows.map(r => r.count).join(", "));
  check("in the order the model is in, so it can be checked against the tree",
        rows[0].name === "Hex bolt M6 × 16");
  //! THE SUPPLIER'S NUMBER TRAVELS. It is the whole reason a bill is worth
  //! having: somebody orders against it.
  check("and the supplier's own number is carried through",
        /91290A115/.test(bomLines(parts)[0]), bomLines(parts)[0]);
  //! And two parts that differ only by supplier are two rows, because they are
  //! two things to order.
  check("the same part from two suppliers is two rows",
        bomOf([{ name: "Hex nut M6", supplier: "A" }, { name: "Hex nut M6", supplier: "B" }])
          .length === 2);
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
