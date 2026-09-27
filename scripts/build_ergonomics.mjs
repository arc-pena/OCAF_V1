// Builds docs/data/samples/ergonomics_study.json — can somebody work this rack.
//
//     node scripts/build_ergonomics.mjs
//
// WHAT THIS IS FOR. A rack is 2.1 m of equipment and the questions anybody asks
// about one are not about the rack: can the person who racks it reach the top
// unit, can they get at the bottom one without lying down, can they see the
// port they are patching, and is the aisle wide enough to work in. Those are
// ergonomic questions and they are answered by geometry - which means they can
// be answered IN the model, against the same rack everything else is measured
// against, rather than in somebody's head.
//
// THE THREE PEOPLE:
//
//   TALL   a 1.9 m person reaching the top unit of a 48U rack. The reach
//          envelopes are drawn round them, so where the answer comes from is
//          visible rather than asserted.
//   SHORT  a 1.55 m person, same rack, same unit. This is the pair the whole
//          file is about: a rack somebody can work is not a rack everybody can.
//   LOW    somebody squatting at the bottom of the rack, which is what the
//          first two units are actually reached at - and the centre of mass
//          says whether that is a posture anybody can hold.
//
// And one walking the aisle, because the aisle is the other half of the layout
// and its width is decided by somebody getting down it.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { PluginHost } from "../docs/src/plugin.js";
import { ERGO } from "../docs/src/ergonomics-plugin.js";
import { RACK } from "../docs/src/rack-plugin.js";
import { gait, proportions, reaches } from "../docs/src/ergonomics.js";
import { rackHeight } from "../docs/src/rack.js";
import { readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "docs", "data", "samples", "ergonomics_study.json");
const WASM = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";

const UNITS = 48, U = 44.45, DEPTH = 1000;
const TOP_U = 48;                      // the unit being reached for
const AISLE = 1200;
const TALL = 1900, SHORT = 1550;

const features = [];
const add = (id, type, more = {}) => {
  const { refs, wire, args, ...rest } = more;
  const made = { ...(args || {}) };
  for (const [key, from] of Object.entries(refs || {}))
    made[key] = Array.isArray(from) ? from.map(one => ({ ref: one })) : { ref: from };
  for (const [key, [from, value]] of Object.entries(wire || {}))
    made[key] = { value, from };
  features.push({ id, type, ...rest, ...(Object.keys(made).length ? { args: made } : {}) });
  return id;
};
const set = (id, name, parent = "E", appearance = null) =>
  add(id, "GeometricalSet", { name, ...(parent ? { parent } : {}),
                              ...(appearance ? { appearance } : {}) });
const num = (id, name, value, parent) =>
  add(id, "Number", { name, parent, args: { value } });
const at = (id, name, x, y, z, parent, wired) =>
  add(id, "Point", { name, parent, args: { x, y, z }, ...(wired ? { wire: wired } : {}) });
const expr = (id, name, js, wired, parent) => {
  const args = { formula: js };
  for (const [key, [from, value]] of Object.entries(wired || {})) args[key] = { value, from };
  return add(id, "Expression", { name, parent, args });
};

add("E", "GeometricalSet", { name: "Ergonomics · can somebody work this rack" });

/* ------------------------------------------------------------ parameters */

set("P", "00 Parameters");
num("N_UNITS", "Rack height", UNITS, "P");
num("N_TALL", "Tall person", TALL, "P");
num("N_SHORT", "Short person", SHORT, "P");
num("N_AISLE", "Aisle", AISLE, "P");
num("N_UNIT", "Working at unit", TOP_U, "P");
//! WHERE THAT UNIT IS, in millimetres off the floor. This is the number the
//! whole study turns on, and it is an Expression over the unit rather than a
//! height somebody typed - so moving the equipment moves the question.
expr("X_UNITZ", "That unit is at (mm)", "(a - 1) * 44.45 + 22",
     { a: ["N_UNIT", TOP_U] }, "P");

/* ------------------------------------------------------------- the rack */

set("R", "01 The rack", "E", { finish: "paint", color: [0.85, 0.42, 0.08] });
at("PT0", "Origin", 0, 0, 0, "R");
add("VZ", "Vector", { name: "Up", parent: "R", args: { dx: 0, dy: 0, dz: 1 } });
add("PL0", "Plane", { name: "Floor", parent: "R", refs: { origin: "PT0", normal: "VZ" } });
//! TWO RACKS, SIDE BY SIDE, one person at each - which is what makes the
//! comparison a fair one. Two people at ONE rack are two people at different
//! angles to it, and the difference in the answer is then partly the layout.
add("FRAME", "RackFrame", { name: "Rack · 48U", parent: "R",
  refs: { plane: "PL0" }, wire: { units: ["N_UNITS", UNITS] },
  args: { standard: 0, depth: DEPTH, profile: 2, rails: 3, posts: 0, postWidth: 50,
          supplier: "frame" } });
at("PTR2", "Second rack at", 1500, 0, 0, "R");
add("FRAME2", "RackFrame", { name: "Rack · 48U, the same", parent: "R",
  refs: { plane: "PL0", at: "PTR2" }, wire: { units: ["N_UNITS", UNITS] },
  args: { standard: 0, depth: DEPTH, profile: 2, rails: 3, posts: 0, postWidth: 50,
          supplier: "frame" } });
//! The unit being worked at, drawn - because "U48" is not a place until it is
//! somewhere, and the reach checks below are to THESE points.
at("PTU", "The unit being worked at", 300, -20, (TOP_U - 1) * U + 22, "R",
   { z: ["X_UNITZ", (TOP_U - 1) * U + 22] });
at("PTU2", "The same unit, second rack", 1800, -20, (TOP_U - 1) * U + 22, "R",
   { z: ["X_UNITZ", (TOP_U - 1) * U + 22] });
at("PTLOW", "The bottom unit", -700, -20, 22, "R");

/* ---------------------------------------------------------- the people */

set("H", "02 The people");
//! FACING THE RACK, which is at +y of where they stand: a mannequin's own y is
//! the way it faces, and the floor plane's y is +y, so a Facing of nothing.
//! 450 FROM THE FACE, which is where somebody racking equipment stands: close
//! enough to work and far enough for the door to swing. Standing 700 back, as
//! this first did, put the unit out of reach of BOTH of them - which is a true
//! answer to a question nobody asked.
at("PTT", "Tall, at the rack", 300, -450, 0, "H");
add("MT", "Mannequin", { name: "Tall · 1.9 m", parent: "H",
  refs: { plane: "PL0", on: "PTT", lookAt: "PTU" },
  wire: { stature: ["N_TALL", TALL] },
  args: { support: 0, turn: 0, leftOut: 12, leftUp: 95, leftElbow: 15,
          rightOut: 12, rightUp: 95, rightElbow: 15, name: "Tall" } });
at("PTS", "Short, at the second rack", 1800, -450, 0, "H");
add("MS", "Mannequin", { name: "Short · 1.55 m", parent: "H",
  refs: { plane: "PL0", on: "PTS", lookAt: "PTU2" },
  wire: { stature: ["N_SHORT", SHORT] },
  args: { support: 0, turn: 0, leftOut: 12, leftUp: 140, leftElbow: 0,
          rightOut: 12, rightUp: 140, rightElbow: 0, name: "Short" } });
//! AND SOMEBODY DOWN AT THE BOTTOM OF IT, which is the posture the first two
//! units are actually worked at. The centre of mass says whether it is one
//! anybody holds.
//! CLOSER IN THAN THE OTHERS, at 250, because that is where somebody squatting
//! at the foot of a rack actually is - you cannot squat at arm's length and
//! work the bottom unit, and the reach check says so if you try.
at("PTL", "Low, at the rack", -700, -250, 0, "H");
add("ML", "Mannequin", { name: "Squatting at the foot", parent: "H",
  refs: { plane: "PL0", on: "PTL", lookAt: "PTLOW" },
  args: { support: 0, turn: 0, stature: 1727, squat: 0.95, lean: 25,
          leftOut: 10, leftUp: 50, leftElbow: 40,
          rightOut: 10, rightUp: 50, rightElbow: 40, name: "Low" } });

/* ------------------------------------------------------ the reach, drawn */

//! NOT `edges: false` HERE, which is what this said first and which hid the
//! envelopes entirely: they are CIRCLES, and a circle's lines are the feature.
//! The switch is for the wireframe laid over a solid.
set("V", "03 Reach envelopes", "E", { finish: "paint", color: [0.16, 0.55, 0.85] });
add("ENVT", "ReachEnvelope", { name: "Tall · normal and maximum", parent: "V",
  refs: { of: "MT" }, args: { draw: 1, which: 2, arms: 0 } });
add("ENVS", "ReachEnvelope", { name: "Short · normal and maximum", parent: "V",
  refs: { of: "MS" }, args: { draw: 1, which: 2, arms: 0 } });

/* --------------------------------------------------------- the questions */

set("Q", "04 The questions");
add("RT", "Reach", { name: "Tall → that unit", parent: "Q",
  refs: { of: "MT", to: "PTU" }, args: { hand: 0, bend: 45 } });
add("RS", "Reach", { name: "Short → the same unit", parent: "Q",
  refs: { of: "MS", to: "PTU2" }, args: { hand: 0, bend: 45 } });
add("RL", "Reach", { name: "Squatting → the bottom unit", parent: "Q",
  refs: { of: "ML", to: "PTLOW" }, args: { hand: 0, bend: 45 } });

/* ------------------------------------------------------------- the aisle */

set("W", "05 The aisle");
at("WA", "Aisle start", -1500, -1900, 0, "W");
at("WB", "Aisle end", 5500, -1900, 0, "W");
add("PATH", "Polyline", { name: "Down the aisle", parent: "W",
  refs: { points: ["WA", "WB"] } });
add("MW", "Mannequin", { name: "Walking the aisle", parent: "W",
  refs: { plane: "PL0", on: "PATH" },
  wire: { stature: ["N_TALL", TALL] },
  args: { support: 2, along: 2600, turn: 0, leftUp: 12, rightUp: -12, name: "Walking" } });
add("GAIT", "Gait", { name: "How long the aisle takes", parent: "W",
  refs: { of: "MW", path: "PATH" }, args: { effort: 0.25, load: 0 } });
add("GAIT2", "Gait", { name: "Carrying a 15 kg switch", parent: "W",
  refs: { of: "MW", path: "PATH" }, args: { effort: 0.25, load: 15 } });

const model = { format: "ocaf-parametric-model", version: 1,
                name: "Ergonomics · can somebody work this rack", units: "mm",
                needs: ["rack", "ergonomics"], features };

/* =================================================== built, then questioned */

const initModule = (await import(WASM + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule,
                                        wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const host = new PluginHost({
  toolkit: () => kernel.toolkit(),
  installDrivers: (specs, builders) => kernel.installDrivers(specs, builders),
  removeDrivers: specs => kernel.removeDrivers(specs),
  typesInUse: types => kernel.typesInUse(types),
});
await host.load("rack");
await host.load("ergonomics");
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
const kit = kernel.toolkit();

const began = Date.now();
const out = await mdl.run({ op: "model", model });
const rows = out.tree.features;
const bad = rows.filter(f => f.error);
console.log(features.length + " features · built in "
  + ((Date.now() - began) / 1000).toFixed(1) + " s");
if (bad.length) {
  for (const f of bad.slice(0, 12))
    console.log("   " + f.id + " (" + f.type + ") " + String(f.error).slice(0, 140));
  process.exit(1);
}
const fail = why => { console.log("\n" + why + " - the sample is not written"); process.exit(1); };
const tell = id => String((rows.find(f => f.id === id).data || {}).preview || "");
//! A FEATURE'S TEXT COMES BACK AS ONE LINE with its parts separated by a middle
//! dot, not as several lines - so splitting it on newlines gives one string and
//! every "line three of it" is undefined. Printed, that reads as "undefined",
//! which looks exactly like a feature that did not build.
const partsOf = said => said.split(" \u00b7 ");
const partOf = (said, re) => partsOf(said).find(one => re.test(one)) || "";
const boxOf = id => {
  const b = kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
    .find(one => one.id === id);
  return b ? kit.extents(b.shape) : null;
};

//! A MANNEQUIN STANDS ON THE FLOOR AND IS THE HEIGHT IT IS ASKED FOR, measured
//! off the solid rather than read back off the argument. Everything else here
//! is a fraction of that height: a figure 2% short has a 2% short reach and
//! every answer below is quietly wrong.
//!
//! WITHIN 40 mm, AND NOT EXACTLY, because these two are LOOKING UP at the unit
//! they are working at - and a head tilted back sits lower at the crown than a
//! head held level, by about an inch. That is true of people and it would be
//! wrong to correct for it. The exact invariant - crown on stature, head level,
//! arms down - is checked in the package's own test, where the pose is neutral.
for (const [id, want, up] of [["MT", TALL, 95], ["MS", SHORT, 140]]) {
  const box = boxOf(id);
  console.log(id + " stands with its soles at z " + box.low[2].toFixed(2)
    + ", arms up to " + box.high[2].toFixed(0));
  await mdl.run({ op: "set", id, key: "leftUp", value: 0 });
  await mdl.run({ op: "set", id, key: "rightUp", value: 0 });
  const down = boxOf(id);
  console.log("   arms down, head tilted back to look up: " + down.size[2].toFixed(1)
    + " mm of an asked-for " + want);
  if (Math.abs(down.size[2] - want) > 40) fail(id + " is not the stature it was asked for");
  if (Math.abs(down.low[2]) > 0.01) fail(id + " is not standing on the floor");
  await mdl.run({ op: "set", id, key: "leftUp", value: up });
  await mdl.run({ op: "set", id, key: "rightUp", value: up });
}

//! THE POINT OF THE WHOLE FILE. The same rack, the same unit, two people - and
//! the answer is different. If it were not, the study would be a decoration.
{
  const tall = tell("RT"), short = tell("RS");
  console.log("\ntall  · " + partsOf(tall).slice(0, 2).join(" · "));
  console.log("short · " + partsOf(short).slice(0, 2).join(" · "));
  const zoneOf = said => /NORMAL/.test(said) ? "normal"
                       : /MAXIMUM/.test(said) ? "maximum"
                       : /bending/.test(said) ? "extended" : "out of reach";
  if (zoneOf(tall) === zoneOf(short))
    fail("the tall and the short person get the same answer - the study says nothing");
  //! And it is the short one who is worse off, or something is upside down.
  const away = said => Number((/is (\d+) mm from/.exec(said) || [])[1] || 0);
  console.log("reach to U" + TOP_U + ": tall " + away(tall) + " mm, short "
    + away(short) + " mm");
  if (!(away(short) > away(tall))) fail("the shorter person is not further from it");
}

//! AND THE SQUAT IS A POSTURE SOMEBODY CAN HOLD, which is a different question
//! from whether they can reach - and the one a model can answer that a drawing
//! cannot. The centre of mass has to be over the feet.
{
  const said = tell("ML");
  console.log("\nsquatting · " + partOf(said, /centre of mass/));
  if (/OUTSIDE the feet/.test(said))
    fail("the squatting figure is falling over - that is not a posture to ship");
  const low = tell("RL");
  console.log("bottom unit · " + partsOf(low).slice(0, 2).join(" · "));
}

//! AND THE LOOK-AT WORKS, which is what makes a sightline a thing rather than a
//! claim: both figures are wired to the same point and are looking at it.
{
  for (const id of ["MT", "MS", "ML"]) {
    const said = tell(id);
    if (!/looking/.test(said)) fail(id + " is not looking at anything");
  }
  console.log("\nlooking · tall  " + partOf(tell("MT"), /^looking/));
  console.log("looking · short " + partOf(tell("MS"), /^looking/));
}

//! THE WALK, and the check that it is a walk and not a drawing: the figure has
//! to be ON the path, at the distance it was sent to.
{
  const box = boxOf("MW");
  const mid = (box.low[0] + box.high[0]) / 2;
  console.log("\nwalking  · " + partsOf(tell("GAIT")).slice(0, 3).join(" · "));
  console.log("carrying · " + partsOf(tell("GAIT2"))[0] + " · "
    + partOf(tell("GAIT2"), /slower/));
  console.log("standing at x " + mid.toFixed(0) + " of a path from -1500 (2600 along)");
  //! WITHIN 150, because what is measured is the middle of a BOUNDING BOX and
  //! this figure's arms are swinging - one forward, one back, the way they do
  //! when somebody walks - so the box is not centred on the person.
  if (Math.abs(mid - (-1500 + 2600)) > 150)
    fail("the walker is not on the path where it was sent");
  //! And moving it along the path really moves it.
  await mdl.run({ op: "set", id: "MW", key: "along", value: 5200 });
  const moved = (boxOf("MW").low[0] + boxOf("MW").high[0]) / 2;
  await mdl.run({ op: "set", id: "MW", key: "along", value: 2600 });
  console.log("sent to 5200 along: x " + moved.toFixed(0));
  if (Math.abs(moved - (-1500 + 5200)) > 150) fail("the walker does not follow the path");
  //! AND CARRYING SOMETHING IS SLOWER. A load that changed nothing would be an
  //! argument that does nothing, which is worse than not having it.
  const plain = Number((/([\d.]+) s at/.exec(tell("GAIT")) || [])[1]);
  const laden = Number((/([\d.]+) s at/.exec(tell("GAIT2")) || [])[1]);
  if (!(laden > plain)) fail("carrying 15 kg did not slow the walk down");
}

//! AND THE STUDY FOLLOWS ITS PARAMETERS. Move the unit being worked at to
//! shoulder height and the tall person's reach to it has to get SHORTER.
//!
//! NOT "LOWER IS NEARER", which was the first version of this check and is
//! false: a standing person's shoulder is at 1554 and U20 is 688 BELOW it where
//! U48 is 557 above, so dropping the unit from 48 to 20 moved it FURTHER away.
//! The distance is not monotonic in the unit number at all - it has a minimum
//! at shoulder height, which is the whole reason equipment that is touched
//! often goes there.
{
  const away = said => Number((/is (\d+) mm from/.exec(said) || [])[1] || 0);
  const at = async unit => {
    await mdl.run({ op: "set", id: "N_UNIT", key: "value", value: unit });
    const row = (await kernel.tree()).tree.features.find(f => f.id === "RT");
    return { away: away(row.data.preview), said: row.data.preview };
  };
  const high = await at(TOP_U);
  const shoulderHigh = await at(35);
  const low = await at(20);
  await mdl.run({ op: "set", id: "N_UNIT", key: "value", value: TOP_U });
  console.log("\nthe tall person's reach to that unit, by where it is:");
  console.log("   U" + TOP_U + " " + high.away + " mm \u00b7 U35 " + shoulderHigh.away
    + " mm \u00b7 U20 " + low.away + " mm");
  console.log("   at U35: " + partsOf(shoulderHigh.said)[1]);
  if (!(shoulderHigh.away < high.away && shoulderHigh.away < low.away))
    fail("shoulder height is not the nearest place to put it - "
      + "the unit is not driving the study");
  //! AND THE FINDING THAT FALLS OUT OF IT, which is worth printing because it
  //! is not the one anybody expects: standing 450 from the face, NOTHING on the
  //! rack is in the normal working area, at any height. The normal area is the
  //! forearm alone - 421 mm on this person - so working in it means standing
  //! closer than that, and a rack door and an aisle may not let you. That is an
  //! ergonomic finding about a LAYOUT, arrived at from two published fractions
  //! of a stature.
  const normal = Number((/normal (\d+)/.exec(shoulderHigh.said) || [])[1] || 0);
  console.log("   standing 450 from the face, the normal working area (" + normal
    + " mm, the forearm alone) reaches nothing on the rack:");
  console.log("   they would have to stand inside " + normal
    + " mm of it, which the door and the aisle decide.");
}

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("\nwrote " + OUT);
