// The hot aisle containment ribbon, as it ships.
//
// scripts/build_hacribbon.mjs refuses to write the sample unless every claim in
// it holds, so this is not that test again. This one opens the file that SHIPPED
// and asks the same questions of it, because the file and the drivers move
// independently: a change to TrussFrame or to BusDuct leaves the 345 nodes in
// docs/data/samples/hac_ribbon.json exactly as they were and changes what they
// build. Every failure this suite has ever caught would have looked, on screen,
// like a data hall.
//
// WHAT IT IS ABOUT. A floor-supported hot aisle containment unit: seven
// prefabricated modules butted into a 33.6 m ribbon, forty-two racks a side
// standing under welded HSS 6 x 6 portal trusses, three layers of fibre tray on
// each cold side and two of low voltage plus the busway on each hot side on
// Unistrut arms, and a DN250 technical water supply and return over the top
// chords. One module is a model and six are instances of it; the twelve racks
// inside the module are instances of three designs, so the file is two levels of
// instancing deep and editing the GPU rack edits fifty-six racks.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { PluginHost } from "../src/plugin.js";
//! Imported for its side effect: a package puts itself on the shelf when its
//! module loads, and this sample is built out of its nodes.
import "../src/rack-plugin.js";
import { PIPES, pipeDuty, rackHeight } from "../src/rack.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 0.5) => Number.isFinite(a) && Math.abs(a - b) <= tol;

const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const host = new PluginHost({
  toolkit: () => kernel.toolkit(),
  installDrivers: (specs, builders) => kernel.installDrivers(specs, builders),
  removeDrivers: specs => kernel.removeDrivers(specs),
  typesInUse: types => kernel.typesInUse(types),
});
await host.load("rack");
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
const kit = kernel.toolkit();

const model = JSON.parse(readFileSync("docs/data/samples/hac_ribbon.json", "utf8"));
const began = Date.now();
const out = await mdl.run({ op: "model", model });
const seconds = (Date.now() - began) / 1000;
const rows = out.tree.features;

const F = kit.F, doc = kit.doc();
const featureOf = id => doc.features().find(one => F.id(one) === id);
const shapeOf = id => { const f = featureOf(id); return f ? F.shape(f) : null; };
const boxOf = id => { const s = shapeOf(id); return s ? kit.extents(s) : null; };
//! A module is seven parts, so its extent is the union of theirs - and a SET has
//! no shape of its own, which reads as null rather than as nothing built.
const PARTS = ["MS", "MA", "MT", "MB", "MW", "MR", "MK"];
const unionOf = ids => {
  const boxes = ids.map(boxOf).filter(Boolean);
  if (!boxes.length) return null;
  const low = [0, 1, 2].map(i => Math.min(...boxes.map(b => b.low[i])));
  const high = [0, 1, 2].map(i => Math.max(...boxes.map(b => b.high[i])));
  return { low, high, size: [0, 1, 2].map(i => high[i] - low[i]) };
};
const tellOf = async id => {
  const answer = await kernel.tree();
  const row = (answer.tree || answer).features.find(one => one.id === id);
  return String((row && row.data ? row.data.preview : "") || "");
};
const meshOf = id => {
  const f = featureOf(id);
  const data = f && F.data(f);
  return data && data.kind === "mesh" ? F.triples(data) : null;
};

//! The numbers the sample is of, restated here rather than imported, so that a
//! generator that changes its mind has to change this file too.
const MODULES = 7, MOD = 4800, RIBBON = MODULES * MOD;
const RACKS_SIDE = 42, UNITS = 48, PLINTH = 100, CLEAR = 3000, TDEPTH = 700;
const AISLE = 1200, DEPTH = 1200, ROOF = 2990;

console.log("1. it opens, and every node in it builds");
{
  const bad = rows.filter(f => f.error);
  check("nothing is in error", bad.length === 0,
        bad.slice(0, 4).map(f => f.id + ": " + f.error).join(" | "));
  check("it is the size it says it is", model.features.length === 365,
        String(model.features.length) + " nodes");
  check("and it opens in a few seconds headless", seconds < 30, seconds.toFixed(1) + " s");
  check("it asks for the package it is built out of",
        (model.needs || []).includes("rack"), JSON.stringify(model.needs));
}

console.log("\n2. one module, seven places, and the racks a level deeper");
{
  //! IsPartner IS THE QUESTION THAT SETTLES IT: two shapes are partners when
  //! they share a TShape, whatever location each is at. Counting solids or
  //! comparing bounding boxes would pass just as happily for seven copies, and
  //! seven copies is the thing this file exists to not be.
  //!
  //! AND IT IS SEVEN CLAIMS, not one. A module here is seven parts - steel,
  //! arms, trays, busway, water, deck, racks - because a module arrives as seven
  //! packages and because an instance is ONE body wearing ONE colour, so a
  //! module instanced whole would put six sevenths of this ribbon in flat grey
  //! however carefully the inside of it was painted.
  for (const part of PARTS) {
    const home = shapeOf(part), second = shapeOf("I" + part);
    check(part + " is instanced down the ribbon, not copied",
          !!home && !!second && second.IsPartner(home),
          (home ? "" : "no part ") + (second ? "" : "no instance"));
  }
  const gpu = shapeOf("GPU"), inside = shapeOf("IA3");
  check("and a rack inside the module is the same geometry as its design",
        !!inside && !!gpu && inside.IsPartner(gpu));
  check("the racks part is a thousand solids and more",
        kit.countSubShapes(shapeOf("MK"), kit.SOLID) > 1000,
        kit.countSubShapes(shapeOf("MK"), kit.SOLID) + " solids");
  //! AND NOTHING IN THE MODULE REACHES PAST ITS OWN LENGTH, or the modules
  //! cannot be butted. A part is a body as well as a folder and its body takes
  //! in every datum vertex filed in it, so a placement point for a rack turned
  //! 180 - which lies beyond the far end of what it places - stretched this to
  //! 9000 once, and with it every instance of it, the box the viewer frames the
  //! model with, and the first pass of every clash check.
  const box = unionOf(PARTS);
  check("nothing in the module reaches past its own length",
        box.low[0] >= -0.5 && box.high[0] <= MOD + 0.5,
        "x " + box.low[0].toFixed(1) + ".." + box.high[0].toFixed(1));
  const ribbon = unionOf(PARTS.map(one => "A" + one));
  check("the ribbon is " + MODULES + " modules long",
        near(ribbon.high[0], RIBBON), ribbon.high[0].toFixed(0) + " mm");
}

console.log("\n3. about forty racks a side, which is what the brief asks for");
{
  //! A COLUMN COSTS A BAY. It is 152.4 square on the rack row's own centreline
  //! and a 595.1 rack in a 600 bay has 4.9 mm to give, so the bays the frames
  //! stand in cannot hold racks - and the model does that arithmetic rather than
  //! somebody laying it out by eye.
  const said = await tellOf("X_RACKS");
  const got = Number(/(-?[\d.]+)/.exec(said)?.[1]);
  check("the model works out how many racks a side it has",
        got === RACKS_SIDE, said.trim());
  check("and that is about forty", got >= 36 && got <= 44, String(got));
  const frames = Number(/(-?[\d.]+)/.exec(await tellOf("X_FRAMES"))?.[1]);
  check("with two portal trusses a module", frames === MODULES * 2 + 1, String(frames));
  //! AND ALL THREE DESIGNS ARE IN IT, in their own bays rather than on top of
  //! each other at the origin, which is what a part drawn at its own origin and
  //! never placed looks like.
  const bays = ["GPU", "MGT", "FIB"].map(id => boxOf(id).low[0]);
  check("the three designs stand in three different bays",
        new Set(bays.map(n => Math.round(n))).size === 3,
        bays.map(n => n.toFixed(0)).join(", "));
}

console.log("\n4. the racks go UNDER it, with room for what the arms carry");
{
  const gpu = boxOf("GPU"), truss = boxOf("TF1"), roof = boxOf("RF");
  check("a rack is as tall as its units and its feet make it",
        near(gpu.high[2], rackHeight("eia310", UNITS) + PLINTH, 1),
        gpu.high[2].toFixed(1) + " mm");
  check("the bottom chord's underside is the clear height",
        near(truss.high[2], CLEAR + TDEPTH, 1),
        "truss top " + truss.high[2].toFixed(0));
  const gap = CLEAR - gpu.high[2];
  check("so everything the arms carry lives in the gap between", gap > 700 && gap < 800,
        gap.toFixed(1) + " mm of services zone");
  check("the aisle roof bears under the chord rather than inside it",
        roof.high[2] <= CLEAR + 0.01 && near(roof.low[2], ROOF, 0.01),
        "z " + roof.low[2].toFixed(0) + ".." + roof.high[2].toFixed(0));
  check("and it covers the aisle and only the aisle",
        near(roof.low[1], DEPTH) && near(roof.high[1], DEPTH + AISLE),
        "y " + roof.low[1].toFixed(0) + ".." + roof.high[1].toFixed(0));
}

console.log("\n5. fibre on the cold side, low voltage on the hot, on their arms");
{
  //! WHICH SIDE EACH LAYER IS ON is the brief's own sentence and the one thing
  //! in the geometry that is a choice rather than a consequence. Row A's racks
  //! run y 0..1200 and the contained aisle is 1200..2400.
  const fibre = boxOf("TRAF0"), lv = boxOf("TRAL0");
  check("the fibre tray is out past the rack fronts", fibre.low[1] < 0,
        "y " + fibre.low[1].toFixed(0) + ".." + fibre.high[1].toFixed(0));
  check("and the low voltage tray is over the aisle", lv.low[1] >= DEPTH - 21,
        "y " + lv.low[1].toFixed(0) + ".." + lv.high[1].toFixed(0));
  //! A TRAY BEARS ON ITS UNDERSIDE AND AN ARM CARRIES ON ITS TOP FACE, so the
  //! two are the same number. This is the check that would catch a section
  //! change parting them, which looks like nothing at all.
  for (const [tray, arm] of [["TRAF0", "ARAF0"], ["TRAL0", "ARAL0"], ["TRBF2", "ARBF2"]]) {
    const t = boxOf(tray), a = boxOf(arm);
    //! The arm's own box is its back plate, which stands proud of the channel
    //! both ways, so what the tray has to meet is inside it and not at the top.
    check(tray + " sits within its arm's own height",
          t.low[2] > a.low[2] && t.low[2] < a.high[2],
          "tray underside " + t.low[2].toFixed(1) + " in arm " + a.low[2].toFixed(1)
          + ".." + a.high[2].toFixed(1));
  }
  //! AND NOT ONE OF THE ARMS IS OVERLOADED. This is the failure that would look
  //! like success: a hundred and sixty-eight brackets drawn at a reach none of
  //! them is rated for looks exactly like a hundred and sixty-eight brackets.
  const arms = rows.filter(f => f.type === "StrutArm");
  const over = [];
  for (const one of arms)
    if (/brace it, shorten it/.test(await tellOf(one.id))) over.push(one.id);
  check("twelve arm designs, and none of them carries more than it holds",
        arms.length === 12 && over.length === 0,
        arms.length + " designs" + (over.length ? ", over: " + over.join(" ") : ""));
}

console.log("\n6. the busway feeds every rack, and the water says what it carries");
{
  const bus = await tellOf("BDA");
  const taps = /(\d+) tap-off boxes at (\d+)/.exec(bus);
  check("there is a tap-off on the rack pitch", taps && Number(taps[2]) === 600,
        taps && taps[0]);
  check("and at least one for every rack under the run",
        taps && Number(taps[1]) >= 6, taps && taps[1]);
  const packs = /(\d+) joint packs/.exec(bus);
  check("one joint pack a length, so butted modules do not double up",
        packs && Number(packs[1]) === 1, packs && packs[1]);
  check("the busway housing is a size somebody set, and says so",
        /ships nobody's catalogue/.test(bus));

  const water = await tellOf("PS");
  const kw = Number(/carries (\d+) kW/.exec(water)?.[1]);
  //! CHECKED AGAINST THE ARITHMETIC AND NOT AGAINST ITSELF: Q = m c dT for DN250
  //! schedule 40 at the velocity and rise the sample sets.
  const want = pipeDuty(PIPES[5], 1.8, 15, "sch40").kilowatts;
  check("the supply main reports Q = m c dT", near(kw, want, 2), kw + " kW");
  check("which is about 5.7 MW for the ribbon", kw > 5000 && kw < 6500, kw + " kW");
  check("and it names the standard its sizes come from", /ASME B36.10M/.test(water));
  //! THE MAIN IS OVER THE TRUSS AND ITS TEES REACH DOWN BETWEEN THE CHORDS,
  //! which is what keeps it out of the sealed aisle and off the roof. A tee
  //! drawn inside a 152 mm chord is a tee from every angle.
  const pipe = boxOf("PS"), bearer = boxOf("BRS");
  check("the main rests on its bearers over the top chord",
        pipe.high[2] > CLEAR + TDEPTH && near(bearer.high[2], CLEAR + TDEPTH + 41.3, 0.5),
        "main to " + pipe.high[2].toFixed(0) + ", bearer top "
        + bearer.high[2].toFixed(1));
  check("and its tees land in the gap between the chords, not in one",
        pipe.low[2] > CLEAR + 152.4 && pipe.low[2] < CLEAR + TDEPTH - 152.4,
        "tees down to " + pipe.low[2].toFixed(0));
}

console.log("\n7. two people, as rulers");
{
  for (const [id, want] of [["PERSON", 1727], ["PERSON2", 1650]]) {
    const points = meshOf(id);
    check(id + " has a mesh", !!points && points.length > 500,
          points ? points.length + " vertices" : "none");
    if (!points) continue;
    const z = points.map(p => p[2]);
    const low = Math.min(...z), high = Math.max(...z);
    check(id + " is the height it was asked for", near(high - low, want, 0.01),
          (high - low).toFixed(2) + " mm");
    check("and is standing on the slab", Math.abs(low) < 0.01, low.toFixed(3));
  }
  //! AND THE ONE IN THE AISLE FITS IN IT, which is the measurement a containment
  //! unit is judged by and the reason there is somebody in there at all.
  check("somebody can stand up inside the contained aisle", ROOF - 1727 > 300,
        (ROOF - 1727) + " mm over the taller figure's head");
}

console.log("\n8. and it is coordinated, by geometry rather than by looking");
{
  for (const id of ["CL_STEEL", "CL_SERV", "CL_ARMS", "CL_JOIN", "CL_PERSON"]) {
    const said = await tellOf(id);
    check(id + " finds nothing inside anything else", /no interference/.test(said),
          said.split(" · ").slice(1, 3).join(" · "));
  }
  //! AND THE CHECKS ARE NOT VACUOUS. A clash test that finds nothing because it
  //! looked at nothing passes every time, so the pair count says it looked.
  const pairs = Number(/([\d,]+) pairs/.exec(await tellOf("CL_STEEL"))?.[1]
                       .replace(/,/g, ""));
  check("the steel check compared thousands of pairs", pairs > 10000,
        pairs.toLocaleString() + " pairs");

  //! AND ONE OF THEM REALLY WOULD FIND SOMETHING. The clearance this file is
  //! about is the one between the rack tops and the services above them, so the
  //! racks are grown into the tray zone and the same nodes have to say so.
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: 56 });
  const grown = (await tellOf("CL_ARMS")) + (await tellOf("CL_SERV"));
  await mdl.run({ op: "set", id: "N_UNITS", key: "value", value: UNITS });
  const after = (await tellOf("CL_ARMS")) + (await tellOf("CL_SERV"));
  const found = /(\d+) clash/.exec(grown);
  check("grown to 56U the racks clash with what is over them", !!found,
        found ? found[1] + " clashes" : "nothing found");
  check("and back at " + UNITS + "U it is clear again",
        (after.match(/no interference/g) || []).length === 2,
        after.slice(0, 80));
}

console.log("\n9. and it can be drawn");
{
  //! EIGHTY-FOUR RACKS IS EIGHTY-FOUR MESHES however few designs they come from:
  //! an instance shares a TShape and still has its own triangles at its own
  //! location. So the cost of drawing it is measured here, where a number can be
  //! acted on, rather than found in somebody's browser.
  const bodies = kit.bodies({ notCategories: ["datum", "data"], sewMeshes: false });
  let total = 0;
  for (const b of bodies) {
    try { total += (kit.tessellate(b.shape, kit.deflectionFor(b.shape)) || {}).triangles || 0; }
    catch { /* a body that will not tessellate is caught by section 1 */ }
  }
  console.log("       " + bodies.length + " bodies, " + total.toLocaleString()
    + " triangles at the viewer's own deflection");
  check("the ribbon is inside the budget a page can open", total < 1200000,
        total.toLocaleString() + " triangles");
  check("and it is not empty either", total > 100000, total.toLocaleString());
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
