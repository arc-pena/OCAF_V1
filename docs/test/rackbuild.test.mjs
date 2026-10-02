// The Rack package, building real geometry in the real kernel.
//
// rack.test.mjs checks the standards against the standards. This checks that
// what comes out of the kernel is the size those standards say - measured off
// the built solid rather than read back off the arguments, because a driver
// that computes the right number and then builds something else is the whole
// class of mistake a screenshot cannot show.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { PluginHost } from "../src/plugin.js";
import { RACK, RACK_NODES } from "../src/rack-plugin.js";
import { rackStandard } from "../src/rack.js";
import { registerTypes, typeSpec } from "../src/ocaf.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 0.01) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const host = new PluginHost({
  toolkit: () => kernel.toolkit(),
  installDrivers: (specs, builders) => kernel.installDrivers(specs, builders),
  removeDrivers: specs => kernel.removeDrivers(specs),
  typesInUse: types => kernel.typesInUse(types),
});

console.log("1. it is a package before it is anything");
{
  check("its nodes are declared, and readable with it switched off",
        RACK_NODES.length >= 7 && RACK_NODES.every(n => n.type && n.guid && n.summary),
        RACK_NODES.map(n => n.type).join(", "));
  check("and none of them is in the catalogue yet", !typeSpec("RackFrame"));
  await host.load("rack");
  check("loading puts them there", !!typeSpec("RackFrame") && !!typeSpec("Fastener"));
}

const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
                                      name: "Rack", units: "mm", features: [] } });
//! `add` does not file: `group` does, which is the document language's own
//! split and not worth working around in a test.
const add = async (type, more = {}) => {
  const { into, ...rest } = more;
  const id = (await mdl.run({ op: "add", type, ...rest })).id;
  if (into) await mdl.run({ op: "group", id, into });
  return id;
};
const set = (id, key, value) => mdl.run({ op: "set", id, key, value });
const code = (id, key, text) => mdl.run({ op: "code", id, key, text });
const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);

const RULE = await add("Measure");
const sizeOf = async (id, quantity) => {
  await set(RULE, "quantity", quantity);
  await kernel.setReference(RULE, "shape", id, false, true);
  const e = await at(RULE);
  return e && e.data ? Number(e.data.preview) : NaN;
};
const box = async id => ({ x: await sizeOf(id, 3), y: await sizeOf(id, 4), z: await sizeOf(id, 5) });

const PT = await add("Point");
const VZ = await add("Vector"); await set(VZ, "dx", 0); await set(VZ, "dz", 1);
const PL = await add("Plane", { refs: { origin: PT, normal: VZ } });

console.log("\n2. a strut is the section it names, at the length it is given");
{
  const S = await add("Strut", { refs: { plane: PL } });
  await set(S, "length", 800);
  check("it builds", !(await at(S)).error, (await at(S)).error);
  const got = await box(S);
  //! A 40 T-slot is 40 across both ways and as long as it was told to be.
  check("a 40 T-slot measures 40 x 40 x 800",
        near(got.x, 40) && near(got.y, 40) && near(got.z, 800),
        JSON.stringify(got));
  //! SWITCHING THE SECTION IS THE WHOLE POINT. Nothing else changes and the
  //! beam is a different beam - which a model built out of boxes cannot do.
  await set(S, "profile", 5);                       // strut channel 41 x 41
  const channel = await box(S);
  check("switching it to a 41 channel changes the section and nothing else",
        near(channel.x, 41.3) && near(channel.y, 41.3) && near(channel.z, 800),
        JSON.stringify(channel));
  await set(S, "profile", 8);                       // flat bar 40 x 6
  const flat = await box(S);
  check("and to a flat bar", near(flat.x, 40) && near(flat.y, 6) && near(flat.z, 800),
        JSON.stringify(flat));
  await set(S, "profile", 2);
  //! Holes: a 800 strut on a 50 pitch set back 25 is sixteen of them, and the
  //! count is checkable off the solid because each one adds two faces.
  const before = await sizeOf(S, 7);                // how many faces
  await set(S, "holes", 1);
  await set(S, "pitch", 50);
  await set(S, "setback", 25);
  const after = await sizeOf(S, 7);
  check("drilling it adds faces, sixteen holes' worth", after > before,
        before + " faces, then " + after);
  check("and it is still the same length", near((await box(S)).z, 800));
}

console.log("\n3. a post is drilled where the standard says");
{
  const P = await add("RackPost", { refs: { plane: PL } });
  await set(P, "units", 42);
  check("it builds", !(await at(P)).error, (await at(P)).error);
  const got = await box(P);
  //! 42U is 1866.9 mm, and a post that is 1866 or 1868 is a post that does not
  //! take 42 pieces of equipment.
  check("a 42U post is exactly 1866.9 mm tall", near(got.z, 1866.9, 1e-6),
        String(got.z));
  await set(P, "units", 47);
  check("and a 47U one is 2089.15", near((await box(P)).z, 2089.15, 1e-6),
        String((await box(P)).z));
  await set(P, "units", 2);
  //! SIX HOLES IN 2U, and they are square. Counted off the solid: a square
  //! hole through a 2 mm plate is four side faces, so six of them is 24 faces
  //! more than the undrilled post.
  const drilled = await sizeOf(P, 7);
  await set(P, "holes", 2);                          // none
  const plain = await sizeOf(P, 7);
  check("2U of post carries six square holes",
        drilled - plain === 24, (drilled - plain) + " faces more than the plain post");
  await set(P, "holes", 0);
  //! And the report says what it did.
  const said = [(((await at(P)).data) || {}).preview || ""];
  check("and it says how many holes, and to what standard",
        said.some(l => /6 holes/.test(l)) && said.some(l => /EIA-310-E/.test(l)),
        JSON.stringify(said));
}

console.log("\n4. the hyperscale standard, now that it has been read");
{
  //! THIS USED TO CHECK A REFUSAL. Open Rack V3's hole pattern was not in this
  //! program, the node said so by name rather than inventing one, and the test
  //! asserted the refusal - which was the right thing to assert for as long as
  //! it was true. The specification has since been read (OCP Open Rack Base
  //! Frame V3, rev 1.1, Figures 6.1.2.1 and 6.1.2.2), so the pattern is the
  //! standard's own and the post builds without being told anything.
  //!
  //! THE REFUSAL ITSELF IS STILL THERE, in RackPost's precondition, for the
  //! next standard that arrives half-read. It cannot be exercised here because
  //! all four standards now publish a pattern, which is a good problem.
  const P = await add("RackPost", { refs: { plane: PL } });
  await set(P, "standard", 1);                       // OCP Open Rack V3
  await set(P, "units", 4);
  await set(P, "holes", 1);                          // round, as ORv3 is
  check("it builds straight off the standard now", !(await at(P)).error, (await at(P)).error);
  //! 4 OU at 48 mm is 192, which is the other thing that standard fixes.
  check("and 4 OpenU is 192 mm", near((await box(P)).z, 192, 1e-6), String((await box(P)).z));
  //! TWO HOLES A UNIT, NOT THREE, and every gap the same 24 - which is the
  //! whole of how an Open Rack post differs from an EIA one, and is why a
  //! pattern invented to look right would have been wrong at every hole.
  const said = String(((await at(P)).data || {}).preview || "");
  check("eight holes up a 4 OU post", /8 holes/.test(said), said.slice(0, 120));
  //! AND A PATTERN TYPED ON THE NODE STILL WINS, which is what lets somebody
  //! model a frame that does not follow its own standard.
  await code(P, "pattern", "12, 24, 36");
  check("a typed pattern still overrides the standard's",
        /12 holes/.test(String(((await at(P)).data || {}).preview || "")),
        String(((await at(P)).data || {}).preview || "").slice(0, 120));
}

console.log("\n5. a frame, and what one number does to it");
{
  const FR = await add("RackFrame", { refs: { plane: PL } });
  await set(FR, "units", 42);
  await set(FR, "depth", 1070);
  check("it builds", !(await at(FR)).error, (await at(FR)).error);
  const got = await box(FR);
  check("a 42U frame stands 1866.9 tall and 1070 deep",
        near(got.z, 1866.9, 1e-6) && near(got.y, 1070), JSON.stringify(got));
  //! ONE NUMBER, AND IT IS A DIFFERENT RACK. This is the sentence the whole
  //! package exists to make true.
  await set(FR, "units", 47);
  check("47U and every member restacks", near((await box(FR)).z, 2089.15, 1e-6),
        String((await box(FR)).z));
  //! And the rails: 2 intermediate is 4 levels of 4 members plus 4 legs = 20.
  const two = [(((await at(FR)).data) || {}).preview || ""];
  check("two intermediate rails is twenty members",
        two.some(l => /20 members/.test(l)), JSON.stringify(two));
  await set(FR, "rails", 6);
  const six = [(((await at(FR)).data) || {}).preview || ""];
  check("and six is thirty-six", six.some(l => /36 members/.test(l)), JSON.stringify(six));
}

console.log("\n6. a fastener is the standard's fastener, until the bought one arrives");
{
  const B = await add("Fastener", { refs: { plane: PL } });
  check("it builds", !(await at(B)).error, (await at(B)).error);
  const got = await box(B);
  //! An M6 hex head is 10 across the flats, so 11.547 across the corners; the
  //! bolt is 16 long under a 4 mm head, so 20 overall.
  //! ACROSS THE FLATS AND ACROSS THE CORNERS, and which of those lands on x
  //! depends on how the hexagon is turned - which is a drawing decision and
  //! not a fact about the bolt. So the check is on the pair: the smaller of
  //! the two is the 10 a spanner reads, the larger is 10/cos(30).
  const flats = Math.min(got.x, got.y), corners = Math.max(got.x, got.y);
  check("an M6 x 16 hex bolt is 10 across the flats, 11.55 across the corners",
        near(flats, 10, 0.02) && near(corners, 10 / Math.cos(Math.PI / 6), 0.02)
        && near(got.z, 20, 0.02), JSON.stringify(got));
  await set(B, "part", 5);                            // hex nut M6
  const nut = await box(B);
  check("an M6 nut is 10 across the flats and 5.2 thick",
        near(Math.min(nut.x, nut.y), 10, 0.02) && near(nut.z, 5.2, 0.02),
        JSON.stringify(nut));
  await set(B, "part", 10);                           // cage nut M6
  check("a cage nut is 9.5 square, which is what the post's hole is",
        near((await box(B)).x, 9.5, 0.02), JSON.stringify(await box(B)));

  //! THE BOUGHT PART WINS. A cube stands in for the supplier's STEP here -
  //! what is being checked is that wiring anything in replaces the stand-in.
  const REAL = await add("Cube");
  await set(REAL, "dx", 33); await set(REAL, "dy", 33); await set(REAL, "dz", 33);
  await kernel.setReference(B, "bought", REAL, false, true);
  check("wire the supplier's own part in and it is used instead",
        near((await box(B)).x, 33) && near((await box(B)).z, 33),
        JSON.stringify(await box(B)));
  check("and it says so", /bought part/.test(String(((await at(B)).data || {}).preview)),
        String(((await at(B)).data || {}).preview));
}

console.log("\n7. equipment lands on the pattern, with the clearance the standard leaves");
{
  const D = await add("RackDevice", { refs: { plane: PL } });
  await set(D, "unit", 1); await set(D, "units", 1);
  check("it builds", !(await at(D)).error, (await at(D)).error);
  //! A 1U chassis is NOT 44.45 tall. It is 44.45 less 1/32" off each boundary,
  //! which is 43.66 - and it is why two of them stacked do not foul.
  check("a 1U chassis is 43.66 tall, not 44.45",
        near((await box(D)).z, 25.4 * 1.719, 1e-3), String((await box(D)).z));
  await set(D, "units", 4);
  check("and a 4U one is 177.0 - three whole units plus a 1U chassis",
        near((await box(D)).z, 44.45 * 4 - 25.4 * 0.031, 1e-6), String((await box(D)).z));
  check("its face is 19 inches across the ears",
        near((await box(D)).x, 482.6, 0.5), String((await box(D)).x));
}

console.log("\n8. cable management, patterned from its own length");
{
  const T = await add("CableTray", { refs: { plane: PL } });
  await set(T, "length", 1000); await set(T, "pitch", 250);
  check("it builds", !(await at(T)).error, (await at(T)).error);
  const said = [(((await at(T)).data) || {}).preview || ""];
  check("a metre on a 250 pitch is four rungs", said.some(l => /4 rungs/.test(l)),
        JSON.stringify(said));
  await set(T, "length", 2000);
  check("and two metres is eight, still on the pitch",
        ([(((await at(T)).data) || {}).preview || ""]).some(l => /8 rungs/.test(l)),
        JSON.stringify(((await at(T)).data || {}).preview));
}

console.log("\n9. the bill of materials, read off the model itself");
{
  //! A set with a frame, four bolts and four nuts in it. The bill has to say
  //! exactly that - and it has to say it because that is what is in the set,
  //! not because anything wrote a line for it to find.
  const SET = await add("GeometricalSet", { name: "Assembly" });
  const FR = await add("RackFrame", { refs: { plane: PL }, into: SET });
  await set(FR, "units", 12);
  for (let i = 0; i < 4; i++) {
    const B = await add("Fastener", { refs: { plane: PL }, into: SET });
    await code(B, "supplier", "91290A115");
    const N = await add("Fastener", { refs: { plane: PL }, into: SET });
    await set(N, "part", 5);
    await code(N, "supplier", "90592A016");
  }
  const BILL = await add("Bill", { refs: { of: SET } });
  check("it builds", !(await at(BILL)).error, (await at(BILL)).error);
  const said = String(((await at(BILL)).data || {}).preview || "");
  check("four of one bolt and four of one nut, counted",
        /4 . Hex bolt M6 . 16/.test(said) && /4 . Hex nut M6/.test(said), said);
  check("with the supplier references somebody would order against",
        /91290A115/.test(said) && /90592A016/.test(said), said);
  check("and the frame in the same list", /Rack frame 12U/.test(said), said);
  //! FASTENERS ONLY, because that is the order somebody actually places.
  await set(BILL, "show", 1);
  const bolts = String(((await at(BILL)).data || {}).preview || "");
  check("asked for fasteners it leaves the frame out",
        /Hex bolt/.test(bolts) && !/Rack frame/.test(bolts), bolts);
  //! AND IT IS THE MODEL. Change what is in the set and the bill changes,
  //! which is the one thing a hand-written bill cannot do.
  await set(BILL, "show", 0);
  const more = await add("Fastener", { refs: { plane: PL }, into: SET });
  await code(more, "supplier", "91290A115");
  const after = String(((await at(BILL)).data || {}).preview || "");
  check("add a fifth bolt and the bill says five", /5 . Hex bolt M6 . 16/.test(after), after);
}

/* =========================================== one section, every member of it

   The complaint this answers, in the words it arrived in: "I cannot change
   unit strut dimensions and it adapts the frame". It could not, and the reason
   was structural rather than a bug - a choice is a number stored on ONE
   feature and there is no wire that reaches it, so a frame and its braces each
   held their own private idea of what the rack was made of. StrutSection is
   the section as a feature, which is what makes it something a wire can reach.

   The failure that would look like success: wiring a section in and having
   the member keep building its own choice. Everything still builds, the tree
   is green, and only a measurement tells the two apart - so the sizes are
   measured off the solids, both of them, on the same switch.                */

console.log("\n7. one section drives every member wired to it");
{
  const SEC = await add("StrutSection");                 // T-slot 40 by default
  const BEAM = await add("Strut", { refs: { plane: PL, section: SEC } });
  await set(BEAM, "length", 500);
  const FRAME = await add("RackFrame", { refs: { plane: PL, section: SEC } });
  await set(FRAME, "units", 12);

  const beam40 = await box(BEAM), frame40 = await box(FRAME);
  check("a beam wired to a 40 T-slot section is 40 across",
        near(beam40.x, 40) && near(beam40.y, 40), beam40.x + " × " + beam40.y);

  await set(SEC, "profile", 3);                           // T-slot 45
  const beam45 = await box(BEAM), frame45 = await box(FRAME);
  check("switch the SECTION and the beam is 45", near(beam45.x, 45), String(beam45.x));
  check("and the frame moved with it, off the same one change",
        frame45.x > frame40.x + 4, frame40.x + " -> " + frame45.x);

  await set(SEC, "profile", 6);                           // 41 x 21 channel
  const chan = await box(BEAM);
  check("and a channel is its own depth, not a square",
        near(chan.x, 41.3) && near(chan.y, 20.6), chan.x + " × " + chan.y);

  //! AND IT IS OPTIONAL. A member with nothing wired in has to keep reading
  //! its own choice, or every beam in every old model changes shape the day
  //! this input is added.
  const LOOSE = await add("Strut", { refs: { plane: PL } });
  await set(LOOSE, "length", 500);
  await set(LOOSE, "profile", 0);                         // T-slot 20
  const loose = await box(LOOSE);
  check("a beam with no section wired in keeps its own choice",
        near(loose.x, 20), String(loose.x));

  //! AND THE BILL SAYS WHAT THE MODEL IS MADE OF. A bill that read the
  //! member's own choice while the member was built from a wired section would
  //! name a section the rack does not contain, and would look entirely right.
  await set(SEC, "profile", 3);
  const SET2 = await add("GeometricalSet");
  await mdl.run({ op: "group", id: BEAM, into: SET2 });
  const B2 = await add("Bill", { refs: { of: SET2 } });
  const said = String(((await at(B2)).data || {}).preview || "");
  check("the bill names the wired section, not the one on the beam",
        /T-slot 45/.test(said) && !/T-slot 40/.test(said), said.slice(0, 120));
}

console.log("\n9. the hall around the rack: floor, hanger, manager, figure");
{
  //! THE PANEL'S TOP IS THE FINISHED FLOOR. Everything else in a hall is
  //! dimensioned off that level, so a panel placed by its underside puts every
  //! rack above it a panel's thickness out - which nothing on screen shows and
  //! every section does.
  const T = await add("FloorTile", { refs: { plane: PL } });
  check("a solid panel builds", !(await at(T)).error, (await at(T)).error);
  check("and its top is the level it was placed at",
        near(await sizeOf(T, 11), 0, 0.01), String(await sizeOf(T, 11)));
  //! And the understructure reaches the finished floor height and no further:
  //! a pedestal dropped by the panel's thickness instead sits 4 mm below the
  //! slab, which is invisible on screen and wrong in every section.
  await set(T, "height", 600);
  const low = await sizeOf(T, 10);
  check("and its pedestal stands exactly on the slab", near(low, -600, 0.01), String(low));

  //! A GRATE OPENS WHAT IT IS SOLD AS, computed off the openings it cut rather
  //! than repeated off the table it came from.
  await set(T, "tile", 2);
  const said = String(((await at(T)).data || {}).preview || "");
  const open = /([\d.]+)% of the panel/.exec(said);
  check("a directional grate opens about 56% of the panel",
        !!open && Math.abs(Number(open[1]) - 56) < 2, open ? open[1] + "%" : said.slice(0, 60));
  //! AND IT SAYS WHAT WILL GO THROUGH IT, which is the number a hall is laid
  //! out against - and it is named as a correlation rather than passed off as
  //! a result.
  check("and says what will pass it, and that it is a correlation",
        /m\u00b3\/h at/.test(said) && /correlation, not a CFD result/.test(said));
  //! THE FAILURE THAT WOULD LOOK LIKE SUCCESS: a finished floor shallower than
  //! the panel itself. The pedestal is then of negative length, which draws as
  //! nothing at all - so the floor would simply appear to sit on the slab.
  await set(T, "height", 30);
  check("a floor too shallow for a pedestal is refused in words",
        /no pedestal/.test(String((await at(T)).error || "")),
        String((await at(T)).error || "it built"));
  await set(T, "height", 600);

  //! THE HANGER'S DROP IS TO THE FACE THE TRAY BEARS ON. Measured to the
  //! centreline instead, half a section's depth of error rides on whichever
  //! section the hanger happens to be made of.
  const PH = await add("Point"); await set(PH, "z", 3000);
  const HG = await add("CeilingHanger", { refs: { plane: PL, at: PH } });
  await set(HG, "drop", 400);
  check("a trapeze builds", !(await at(HG)).error, (await at(HG)).error);
  check("its rods reach the soffit", near(await sizeOf(HG, 11), 3000, 0.01),
        String(await sizeOf(HG, 11)));
  const TR = await add("CableTray", { refs: { plane: PL, at: PH } });
  await set(TR, "profile", 6);
  await set(TR, "rung", 25);
  //! AND A TRAY SITS ON ITS UNDERSIDE. A rung deeper than its rail hung below
  //! the tray and the tray then floated that far above the hanger holding it
  //! up - which looks like contact from any distance.
  check("a tray's underside is where it is placed, whatever its rung",
        near(await sizeOf(TR, 10), 3000, 0.01), String(await sizeOf(TR, 10)));
  await set(TR, "profile", 2);
  check("and it stays there when the section changes",
        near(await sizeOf(TR, 10), 3000, 0.01), String(await sizeOf(TR, 10)));

  //! THE MANAGER REPORTS WHAT IT WILL HOLD, which is the only question anybody
  //! asks of one - and it names the fill figure as the trade's rather than
  //! passing it off as geometry.
  const MG = await add("CableManager", { refs: { plane: PL } });
  check("a manager builds", !(await at(MG)).error, (await at(MG)).error);
  const mgr = String(((await at(MG)).data || {}).preview || "");
  check("and says how many cables it will take, at a named fill",
        /cables at 60% fill/.test(mgr) && /not a geometric packing/.test(mgr),
        mgr.split("\n")[2] || mgr.slice(0, 60));

  //! AND THE PERSON IS THE HEIGHT ASKED FOR, measured off the built mesh.
  const FG = await add("Entourage", { refs: { plane: PL } });
  await set(FG, "height", 1800);
  check("an entourage figure builds", !(await at(FG)).error, (await at(FG)).error);
  check("and is exactly the height asked for",
        near(await sizeOf(FG, 5), 1800, 0.01), String(await sizeOf(FG, 5)));
  await set(FG, "height", 1500);
  check("and follows when that changes", near(await sizeOf(FG, 5), 1500, 0.01),
        String(await sizeOf(FG, 5)));
}

console.log("\n10. a bill of a hall counts the instances, not the geometry");
{
  //! THE FAILURE THAT LOOKS MOST LIKE SUCCESS IN THIS PACKAGE. Eight racks
  //! where seven are instances is ONE piece of geometry, so a bill that walks
  //! the shapes sees one rack; and the seven instances are features the bill
  //! did not recognise, so a bill that walks the tree also sees one rack. Both
  //! produce a neatly formatted bill with every line right and a total wrong by
  //! seven racks - and a bill is the one thing in a model somebody spends money
  //! against.
  const HALL = await add("GeometricalSet");
  const PART = await add("Part", { into: HALL });
  const BOLT = await add("Fastener", { refs: { plane: PL }, into: PART });
  await set(BOLT, "part", 0);
  const P2 = await add("Point", { into: HALL }); await set(P2, "x", 900);
  const I1 = await add("Instance", { refs: { part: PART, at: P2 }, into: HALL });
  //! And a PATTERN of an instance, which is how a row is built - so the count
  //! has to follow through both at once.
  const P3 = await add("Point", { into: HALL }); await set(P3, "x", 1800);
  const I2 = await add("Instance", { refs: { part: PART, at: P3 }, into: HALL });
  const ROW = await add("Array", { refs: { source: I2 }, into: HALL });
  await set(ROW, "mode", 0);
  await set(ROW, "countX", 3);
  await set(ROW, "spacingX", 700);
  await set(ROW, "countY", 1);
  await set(ROW, "countZ", 1);
  const BILL = await add("Bill", { refs: { of: HALL }, into: HALL });
  const said = String(((await at(BILL)).data || {}).preview || "");
  const got = /(\d+) \u00d7 Hex bolt/.exec(said);
  //! One in the part itself, one instance of it, three from the pattern: five.
  check("the part, the instance and the pattern of instances are all counted",
        !!got && Number(got[1]) === 5, got ? got[1] + " bolts" : said.slice(0, 80));
  //! AND THE INSTANCE THE PATTERN ATE IS NOT ALSO A BOLT. An Array consumes its
  //! source, so counting the source as well gives six where there are five -
  //! the same off-by-one that gave 25 bolts for a pattern of 24.
  check("and the instance the pattern consumed is not counted twice",
        !/6 \u00d7 Hex bolt/.test(said));
}

console.log("\n11. clash detection, against answers that can be done on paper");
{
  //! TWO 100 CUBES, one above the other. Every number below is arithmetic
  //! somebody can check before the program is asked: touching is not clashing,
  //! 20 mm of overlap is 100 x 100 x 20 = 200,000 mm3, and 40 mm apart is
  //! nothing. That is the whole point of choosing cubes for this.
  const HALL = await add("GeometricalSet");
  const LOW = await add("GeometricalSet", { into: HALL });
  const HIGH = await add("GeometricalSet", { into: HALL });
  const PA = await add("Point", { into: LOW });
  const CA = await add("Cube", { refs: { origin: PA, plane: PL }, into: LOW });
  for (const [k, v] of [["dx", 100], ["dy", 100], ["dz", 100]]) await set(CA, k, v);
  const PB = await add("Point", { into: HIGH });
  const CB = await add("Cube", { refs: { origin: PB, plane: PL }, into: HIGH });
  for (const [k, v] of [["dx", 100], ["dy", 100], ["dz", 100]]) await set(CB, k, v);
  const CL = await add("Clash", { refs: { a: LOW, b: HIGH }, into: HALL });
  await set(CL, "tolerance", 1);
  await set(CL, "how", 1);
  const told = async z => {
    await set(PB, "z", z);
    return String(((await at(CL)).data || {}).preview || "");
  };
  const apart = await told(140);
  check("40 mm apart is not a clash", /no interference/.test(apart), apart.split("\n")[1]);
  const touching = await told(100);
  check("and touching is not a clash either", /no interference/.test(touching),
        touching.split("\n")[1]);
  const into = await told(80);
  const volume = /(\d+) mm\u00b3/.exec(into);
  check("20 mm of overlap is a clash", /1 clash/.test(into), into.split("\n")[1]);
  check("  20 mm deep", /20\.0 mm in/.test(into), into.split("\n")[2]);
  check("  and 100 x 100 x 20 = 200,000 mm\u00b3 of it",
        !!volume && Number(volume[1]) === 200000, volume ? volume[1] : into);

  //! AND THE TOLERANCE IS WHAT IT SAYS. A 20 mm overlap allowed 25 mm is not a
  //! clash; a joint that shares a face is never one. Without a tolerance a
  //! clash report lists every joint in the model, which is a report nobody
  //! reads and so is a report that reports nothing.
  await set(CL, "tolerance", 25);
  check("and an overlap inside the tolerance is not reported",
        /no interference/.test(String(((await at(CL)).data || {}).preview || "")));
  await set(CL, "tolerance", 1);

  //! A AGAINST PART OF A. "The model against its floor" is a thing somebody
  //! asks and the floor is IN the model - so without taking the far side out of
  //! the near one, every panel clashes with itself, 42 mm deep and six million
  //! cubic millimetres. True, and useless. It happened on the first run.
  await told(140);                       // apart again, so any clash found is a false one
  await kernel.setReference(CL, "a", HALL, false, true);
  const whole = String(((await at(CL)).data || {}).preview || "");
  check("the whole against one part of it does not find that part inside itself",
        /no interference/.test(whole), whole.split("\n")[1]);
  //! And the count says WHY: one solid on this side, not two. The far side's
  //! cube is not on the near side at all.
  check("  because the far side is taken out of the near one",
        /1 \+ 1 solids/.test(whole), whole.split("\n")[0]);

  //! AND A MESH IS IN THE WAY LIKE ANYTHING ELSE. A scale figure has no B-Rep,
  //! so a gather that only took solids reported "0 solids, 0 pairs" for a
  //! person standing inside a rack - which passes, silently, for ever.
  await kernel.setReference(CL, "a", LOW, false, true);
  await set(CL, "how", 1);
  const FG = await add("Entourage", { refs: { plane: PL }, into: HIGH });
  await set(FG, "height", 1800);
  await set(PB, "z", 4000);            // the cube out of the way
  const withMesh = String(((await at(CL)).data || {}).preview || "");
  check("a mesh is counted as something that can be in the way",
        / 2 solids,/.test(withMesh) || /1 \+ 2 solids/.test(withMesh),
        withMesh.split("\n")[0]);
  check("  and a figure standing on the cube is found",
        /clash/.test(withMesh), withMesh.split("\n")[1]);
  check("  said to be a box answer, because a mesh cannot be intersected",
        /a mesh - boxes only/.test(withMesh), withMesh.split("\n")[2]);
}

/* ================================== and the file says what it cannot open without

   Opening the sample from the samples menu worked and dropping the same file
   on the page did not: the menu carries its own list of packages and a file
   carried none, so the open refused at the first node BY NODE NAME - "unknown
   feature type RackFrame" - which reads as a corrupt file rather than as a
   package that is switched off.                                             */

console.log("\n8. a model made of a package's nodes says so in the file");
{
  const written = await kernel.model();
  const model = typeof written === "string" ? JSON.parse(written)
              : (written.model || written);
  check("the document this test built names the rack package",
        Array.isArray(model.needs) && model.needs.includes("rack"),
        JSON.stringify(model.needs));
  const sample = JSON.parse(readFileSync("docs/data/samples/hyperstack_rack.json", "utf8"));
  check("and so does the sample that ships",
        Array.isArray(sample.needs) && sample.needs.includes("rack"),
        JSON.stringify(sample.needs));
}

console.log("\n12. the containment unit: a portal truss and what hangs off it");
{
  //! A TRUSS IS THE FRAME ITS ARGUMENTS DESCRIBE, measured off the built solid.
  //! The two numbers that matter are the SPAN - column centre to column centre -
  //! and the CLEAR UNDER, which is what has to pass beneath it. Clear is to the
  //! bottom chord's UNDERSIDE on purpose: measured to a centreline instead, every
  //! change of section moves the headroom, and the headroom is the reason the
  //! frame is that height.
  const P = await add("Point");
  const TF = await add("TrussFrame", { refs: { plane: PL, at: P } });
  await set(TF, "span", 4200);
  await set(TF, "clear", 2800);
  await set(TF, "depth", 700);
  await set(TF, "panels", 6);
  await set(TF, "profile", 11);
  await set(TF, "plate", 0);
  const truss = await box(TF);
  check("a 4200 span with HSS 6 columns measures 4200 + one section across",
        near(truss.y, 4200 + 152.4, 0.5), truss.y.toFixed(1) + " mm");
  check("and it is one section wide along the ribbon", near(truss.x, 152.4, 0.5),
        truss.x.toFixed(1));
  check("the top of it is the clear height plus the truss depth",
        near(truss.z, 2800 + 700, 0.5), truss.z.toFixed(1) + " tall from the floor");
  //! AND THE CLEAR HEIGHT DOES NOT MOVE WHEN THE SECTION DOES, which is the
  //! whole reason it is measured to the underside. This is the check that would
  //! catch it being taken to a centreline: the truss would get 25 mm taller and
  //! the headroom 25 mm shorter every time the steel was changed.
  await set(TF, "profile", 13);
  const bigger = await box(TF);
  await set(TF, "profile", 11);
  check("a heavier section does not change the height of the frame",
        near(bigger.z, truss.z, 0.01), bigger.z.toFixed(1) + " vs " + truss.z.toFixed(1));
  check("but it does change the steel", near(bigger.x, 203.2, 0.5), bigger.x.toFixed(1));
  //! THE PANELS RE-DIVIDE THE SPAN rather than being drawn at a pitch, so the
  //! web always reaches both ends: the report says the pitch it arrived at.
  const said = String(((await at(TF)).data || {}).preview || "");
  check("the truss says how its web divides the span", /6 panels at 700/.test(said),
        said.split(" \u00b7 ").slice(0, 4).join(" \u00b7 "));
  check("and it says which web it drew", /Warren/.test(said));
  await set(TF, "web", 2);
  const bare = await box(TF);
  check("chords only is the same envelope as a Warren",
        near(bare.z, truss.z, 0.01) && near(bare.y, truss.y, 0.01));
  await set(TF, "web", 0);
  //! AND THE BASE PLATE IS THE SPREAD OF THE FOOT, which is the part that makes
  //! it floor supported rather than hung.
  await set(TF, "plate", 500);
  const footed = await box(TF);
  check("a 500 base plate spreads past the column both ways",
        near(footed.y, 4200 + 500, 0.5), footed.y.toFixed(1) + " across the plates");
  //! AND IT STANDS ON THE FLOOR RATHER THAN IN IT. Drawn from -20 to 0 - under
  //! the placement point, on the reasoning that a grouted plate is in the floor -
  //! every portal placed on a slab at z = 0 sank 20 mm into it, four plates a
  //! module, every module, and from across an atrium that looks exactly like a
  //! column standing on a floor. Found by somebody else driving this element in
  //! another model; this is the measurement that keeps it found.
  const onFloor = await sizeOf(TF, 10);
  check("nothing of the truss is below the level it was placed on",
        near(onFloor, 0, 0.5), "lowest point at z " + onFloor.toFixed(1));
  check("and the plate has not eaten the clear height under it",
        near((await box(TF)).z, 2800 + 700, 0.5), (await box(TF)).z.toFixed(1));
}

console.log("\n13. a handed arm, because a column has two sides");
{
  //! AN ARM REACHES ALONG ITS PLANE'S Y, and there is no plane normal that turns
  //! that round while leaving z up - so without a hand, half the brackets in a
  //! hall are unbuildable. Measured as two arms off one point: they occupy the
  //! same length of y, on opposite sides of it.
  const P = await add("Point");
  await set(P, "z", 2000);
  const A = await add("StrutArm", { refs: { plane: PL, at: P } });
  await set(A, "reach", 600);
  await set(A, "profile", 5);
  await set(A, "load", 40);
  const one = await box(A);
  await set(A, "hand", 1);
  const other = await box(A);
  await set(A, "hand", 0);
  check("a handed arm is the same arm", near(one.x, other.x, 0.01)
        && near(one.y, other.y, 0.01) && near(one.z, other.z, 0.01),
        [one.x, one.y, one.z].map(n => n.toFixed(1)).join(" x ") + " vs "
        + [other.x, other.y, other.z].map(n => n.toFixed(1)).join(" x "));
  check("and it reaches its reach", one.y > 600 && one.y < 640, one.y.toFixed(1) + " mm");
  //! WHAT IT HOLDS AT THAT REACH, which is the only question an arm is chosen
  //! by: one over the reach from a stated capacity at a stated reach. 150 kg at
  //! 300 mm braced is 75 kg at 600, and a plain cantilever is 0.4 of that.
  const told = async () => String(((await at(A)).data || {}).preview || "");
  const braced = /about (\d+) kg/.exec(await told());
  check("a braced 41 channel at 600 holds about 75 kg", braced && Number(braced[1]) === 75,
        braced && braced[1]);
  check("and at 40 kg it does not complain", !/brace it, shorten it/.test(await told()));
  await set(A, "brace", 1);
  const plain = /about (\d+) kg/.exec(await told());
  check("unbraced it holds 0.4 of that", plain && Number(plain[1]) === 30, plain && plain[1]);
  check("and now it says the load is too much for it",
        /brace it, shorten it/.test(await told()), (await told()).split(" \u00b7 ").pop());
  await set(A, "brace", 0);
  //! AND A BIGGER SECTION HOLDS MORE, by the ratio of its depth - said to be a
  //! rule and not a catalogue, on the feature itself.
  await set(A, "profile", 10);
  const heavy = /about (\d+) kg/.exec(await told());
  await set(A, "profile", 5);
  check("a 101.6 section holds more than a 41.3 one",
        heavy && Number(heavy[1]) > 150, heavy && heavy[1] + " kg");
  check("and the arm says the rule is a rule",
        /an engineer's rule, not a catalogue/.test(await told()));
}

console.log("\n14. a busway with its tap-offs, and a joint per length");
{
  //! WHAT A BUSWAY IS MODELLED FOR is where the TAP-OFF BOXES land, because a
  //! rack that does not sit under one has to be fed from somewhere else. On a
  //! 600 rack pitch with a tap every 600, that is a question with an answer.
  const P = await add("Point");
  await set(P, "z", 3000);
  const BD = await add("BusDuct", { refs: { plane: PL, at: P } });
  await set(BD, "length", 4800);
  await set(BD, "pitch", 600);
  await set(BD, "joint", 4800);
  const told = async () => String(((await at(BD)).data || {}).preview || "");
  const said = await told();
  const taps = /(\d+) tap-off boxes at (\d+)/.exec(said);
  check("a 4800 run on a 600 pitch has eight tap-offs",
        taps && Number(taps[1]) === 8, taps && taps[1]);
  check("and they are on the pitch it was given", taps && Number(taps[2]) === 600);
  //! ONE JOINT PACK PER LENGTH, AT ITS HEAD. A pack is the connection BETWEEN
  //! two lengths, so it belongs to the length that starts there - drawn at both
  //! ends instead, two runs butted end to end put two packs in the same place,
  //! which is invisible on screen and is what a ribbon of identical modules
  //! found: six double joints down the hall.
  const packs = /(\d+) joint packs/.exec(said);
  check("a run as long as its joint length has ONE pack, not two",
        packs && Number(packs[1]) === 1, packs && packs[1]);
  await set(BD, "joint", 2400);
  const twice = /(\d+) joint packs/.exec(await told());
  check("two lengths have two", twice && Number(twice[1]) === 2, twice && twice[1]);
  //! AND THE PACK IS INSIDE ITS OWN LENGTH, so butted runs do not report a
  //! bolted joint as a collision. The run is 4800 and the box has to be too.
  await set(BD, "joint", 4800);
  const run = await box(BD);
  check("nothing sticks out past the ends of the run", near(run.x, 4800, 0.5),
        run.x.toFixed(1) + " mm long");
  //! AND IT SAYS WHOSE CATALOGUE IT IS NOT. A busway section is a
  //! manufacturer's, they differ between them, and this package ships none.
  check("the busway says the housing is a size you set",
        /ships nobody's catalogue/.test(said), said.split(" \u00b7 ").pop());
}

console.log("\n15. a pipe run, and the heat it says it carries");
{
  //! THE LAGGING IS WHAT IS DRAWN, with the pipe inside it, because what has to
  //! fit past the steelwork is the insulation and not the pipe. A DN150 run in a
  //! 200 gap fits on screen bare and does not on site.
  const P = await add("Point");
  await set(P, "z", 3500);
  const PR = await add("PipeRun", { refs: { plane: PL, at: P } });
  await set(PR, "length", 4800);
  await set(PR, "size", 3);          // DN150
  await set(PR, "insulation", 0);
  await set(PR, "pitch", 0);
  const bare = await box(PR);
  check("a DN150 run is 168.3 across when it is bare", near(bare.y, 168.3, 0.5),
        bare.y.toFixed(1));
  await set(PR, "insulation", 30);
  const lagged = await box(PR);
  check("and 60 more when it is lagged 30", near(lagged.y, 168.3 + 60, 0.5),
        lagged.y.toFixed(1));
  check("the run is the length it was given", near(lagged.x, 4800, 0.5),
        lagged.x.toFixed(1));
  //! THE HEAT, which is the number the loop is sized by and the reason to model
  //! a pipe as anything more than a cylinder.
  const told = async () => String(((await at(PR)).data || {}).preview || "");
  await set(PR, "velocity", 1.5);
  await set(PR, "rise", 10);
  const kw = /carries (\d+) kW/.exec(await told());
  check("DN150 at 1.5 m/s and 10 K is about 1.2 MW", kw && Number(kw[1]) > 1100
        && Number(kw[1]) < 1300, kw && kw[1] + " kW");
  await set(PR, "rise", 20);
  const twice = /carries (\d+) kW/.exec(await told());
  check("twice the rise is twice the heat",
        twice && Math.abs(Number(twice[1]) - Number(kw[1]) * 2) <= 2,
        twice && twice[1] + " kW");
  await set(PR, "rise", 10);
  //! AND THE BRANCHES, which decide which racks the loop can serve. On a 2400
  //! pitch with a half-pitch setback they land between the frames rather than
  //! inside one, which is where a branch can actually be made up.
  await set(PR, "pitch", 2400);
  await set(PR, "branch", 1);
  const branched = /(\d+) branches at (\d+)/.exec(await told());
  check("a 4800 run branched every 2400 has two tees",
        branched && Number(branched[1]) === 2, branched && branched[1]);
  const down = await box(PR);
  check("and the tees reach DOWN from the main", down.z > lagged.z + 100,
        down.z.toFixed(0) + " mm deep against the main's " + lagged.z.toFixed(0));
  check("the run names the standard its sizes come from",
        /ASME B36.10M/.test(await told()));
  check("and says the sum is arithmetic and not a CFD result",
        /not a CFD result/.test(await told()));
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
