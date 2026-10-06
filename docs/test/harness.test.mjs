// Routes, cables and connectors — against numbers worked out on paper.
//
// A cable run is the kind of thing that looks right from any angle and is
// wrong by 30%: a path that quietly dropped a corner still draws a cable, and
// a bend radius that is not checked is a fibre nobody notices was ruined. So
// every number here is one a reader can derive before the program is asked.
//
// THE ONE WORTH WRITING DOWN. Two 100 mm legs meeting square, rounded at 20:
// the tangent point sits back from the corner by r*tan(45) = 20, so the run is
// 80 straight, a quarter circle of radius 20, and 80 straight -
//   80 + 20*pi/2 + 80 = 191.4159...
// which is the whole of what roundedRoute has to get right.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { PluginHost } from "../src/plugin.js";
import "../src/harness-plugin.js";
import { CABLE_TYPES, CONNECTORS, bendRadius, cableType, checkRoute,
         roundedRoute, setbackFor } from "../src/harness.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 0.001) => Number.isFinite(a) && Math.abs(a - b) <= tol;

console.log("1. the path, against arithmetic anybody can redo");
{
  const square = roundedRoute([[0, 0, 0], [100, 0, 0], [100, 100, 0]], 20);
  check("a right-angle corner rounds to straight, arc, straight",
        square.segments.map(s => s.kind).join(",") === "line,arc,line",
        square.segments.map(s => s.kind).join(","));
  check("and the run is 80 + 20*pi/2 + 80",
        near(square.length, 80 + 20 * Math.PI / 2 + 80),
        square.length.toFixed(4) + " vs " + (80 + 20 * Math.PI / 2 + 80).toFixed(4));
  check("the corner turns a right angle",
        near(square.corners[0].turn, Math.PI / 2), String(square.corners[0].turn));
  check("and keeps the radius it was asked for",
        near(square.corners[0].radius, 20), String(square.corners[0].radius));

  //! THE SET-BACK IS WHAT MAKES A SHALLOW CORNER CHEAP AND A HAIRPIN DEAR, and
  //! it is the number that decides whether a corner fits on its leg at all.
  check("a 90 degree corner sets back by the radius", near(setbackFor(20, Math.PI / 2), 20));
  check("a 60 degree turn sets back by r*tan(30)",
        near(setbackFor(20, Math.PI / 3), 20 * Math.tan(Math.PI / 6)));

  //! A STRAIGHT LINE HAS NO CORNER. Rounding one puts an arc of no length in
  //! the middle of a straight, which no sweep in any kernel will accept.
  const straight = roundedRoute([[0, 0, 0], [50, 0, 0], [100, 0, 0]], 20);
  check("three points in a line stay one straight run",
        straight.segments.length === 1 && near(straight.length, 100),
        straight.segments.length + " segments, " + straight.length + " mm");

  //! AND A CORNER TOO BIG FOR ITS LEG IS SHRUNK AND SAID, not failed. Two 30 mm
  //! legs cannot carry a 40 mm radius: it would need 40 of set-back on a 30 leg.
  const tight = roundedRoute([[0, 0, 0], [30, 0, 0], [30, 30, 0]], 40);
  check("a corner too big for its leg is shrunk to fit",
        tight.corners[0].radius < 40 && tight.corners[0].radius > 0,
        tight.corners[0].radius.toFixed(2));
  check("and says that it was", tight.tight.length === 1, JSON.stringify(tight.tight));
}

console.log("\n2. the bend limit is a multiple of the cable, not a stored radius");
{
  //! THE POINT OF STORING THE MULTIPLE. Swap a thin cable for a fat one and the
  //! limit has to move with it; a stored radius keeps the thin one's.
  const cat6a = cableType("cat6a"), om4 = cableType("om4");
  check("Cat6A at 4x its 7.1 mm diameter bends to 28.4",
        near(bendRadius("cat6a"), 7.1 * 4, 0.01), String(bendRadius("cat6a")));
  check("OM4 at 10x its 3 mm diameter bends to 30",
        near(bendRadius("om4"), 30, 0.01), String(bendRadius("om4")));
  check("and a fatter cable of the same kind bends wider",
        bendRadius("c19") > bendRadius("c13"),
        bendRadius("c13") + " -> " + bendRadius("c19"));
  //! UNLOADED IS HALF, which is the distinction every standard draws between a
  //! cable being pulled in and a cable tied down and left.
  check("unloaded is the lesser figure", bendRadius("cat6a", false) < bendRadius("cat6a", true));

  //! AND THE CHECK NAMES THE CORNER. "Somewhere it is too tight" is not
  //! something anybody can act on.
  const route = roundedRoute([[0, 0, 0], [200, 0, 0], [200, 200, 0]], 12);
  const verdict = checkRoute(route, om4, true);
  check("a 12 mm corner is too tight for OM4, and it is named",
        !verdict.ok && verdict.tight.length === 1 && verdict.tight[0].at === 1,
        JSON.stringify(verdict.tight.map(t => t.at + "@" + t.radius.toFixed(1))));
  const fine = checkRoute(roundedRoute([[0, 0, 0], [200, 0, 0], [200, 200, 0]], 60), om4, true);
  check("and a 60 mm corner is fine for it", fine.ok, JSON.stringify(fine.tight));
  check("Cat6A needs less room than OM4 here",
        checkRoute(roundedRoute([[0,0,0],[200,0,0],[200,200,0]], 29), cat6a).ok,
        "28.4 needed");
}

console.log("\n3. every catalogue entry says where it is from");
{
  check("every cable names its standard and a bend multiple",
        CABLE_TYPES.every(one => one.from && one.od > 0 && one.bend > 0),
        CABLE_TYPES.filter(one => !one.from).map(one => one.key).join(","));
  //! NO PART NUMBERS. The claim in the header is that none is invented, and a
  //! test is the only thing that keeps a claim like that true.
  const looksLikeAPartNumber = /\b[0-9]{4,}[A-Z]{1,3}[0-9]{2,}\b/;
  check("and none of them smuggles in a part number",
        !CABLE_TYPES.some(one => looksLikeAPartNumber.test(one.from + one.name)),
        CABLE_TYPES.filter(one => looksLikeAPartNumber.test(one.from)).map(o => o.key).join(","));
  //! AN ENVELOPE IS THE POINT OF A CONNECTOR HERE. It is the number that says
  //! whether the door shuts, so one without a depth is one that cannot answer
  //! the only question it is being asked.
  const real = CONNECTORS.filter(one => one.key !== "none");
  check("every connector has an envelope that could be checked for fit",
        real.every(one => one.w > 0 && one.h > 0 && one.deep > 0 && one.from),
        real.filter(one => !(one.deep > 0)).map(one => one.key).join(","));
}

console.log("\n4. and it builds, in the real kernel");
const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const host = new PluginHost({
  toolkit: () => kernel.toolkit(),
  installDrivers: (specs, builders) => kernel.installDrivers(specs, builders),
  removeDrivers: specs => kernel.removeDrivers(specs),
  typesInUse: types => kernel.typesInUse(types),
});
await host.load("harness");
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
                                      name: "Harness", units: "mm", features: [] } });
const add = async (type, more = {}) => (await mdl.run({ op: "add", type, ...more })).id;
const set = (id, key, value) => mdl.run({ op: "set", id, key, value });
const at = async id => (await kernel.tree()).tree.features.find(f => f.id === id);
const K = kernel.toolkit();
const boxOf = id => {
  const b = K.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
    .find(one => one.id === id);
  return b ? K.extents(b.shape) : null;
};

const pt = async (x, y, z) => {
  const id = await add("Point");
  await set(id, "x", x); await set(id, "y", y); await set(id, "z", z);
  return id;
};
const A = await pt(0, 0, 0), B = await pt(400, 0, 0), C = await pt(400, 300, 0),
      D = await pt(400, 300, 200);
const ROUTE = await add("Route", { refs: { through: [A, B, C, D] } });
await set(ROUTE, "radius", 60);
{
  check("a route through four points builds", !(await at(ROUTE)).error, (await at(ROUTE)).error);
  const said = String(((await at(ROUTE)).data || {}).preview || "");
  check("and reports two rounded corners", /2 rounded corners/.test(said), said);
  //! THE LENGTH ON THE FEATURE IS THE LENGTH THE ARITHMETIC GIVES - the two are
  //! computed by one function precisely so a bill and a build cannot disagree.
  const want = roundedRoute([[0,0,0],[400,0,0],[400,300,0],[400,300,200]], 60).length;
  check("and the length the arithmetic gives",
        new RegExp(Math.round(want) + " mm long").test(said), said + " vs " + want.toFixed(1));
}

const CABLE = await add("Cable", { refs: { route: ROUTE } });
{
  check("a cable on it builds", !(await at(CABLE)).error, (await at(CABLE)).error);
}

//! MEASURED ON A STRAIGHT RUN, and this is worth the extra route rather than
//! being asserted on the bent one. A swept circle is a B-spline surface, and a
//! bounding box of one bounds its CONTROL POLYGON - for a tube round a 60 mm
//! corner the poles stand 5.2 mm outside the surface, so the bent run measures
//! 8.79 where the cable is 3.55. That is the box being conservative, exactly as
//! it is documented to be, and a test that asserted 3.55 there would be a test
//! that "failed" on correct geometry. A straight run has no such slack.
console.log("\n   the section really is the cable's own diameter");
{
  const P = await pt(0, 0, 500), Q = await pt(1000, 0, 500);
  const STRAIGHT = await add("Route", { refs: { through: [P, Q] } });
  const RUN = await add("Cable", { refs: { route: STRAIGHT } });
  const e = boxOf(RUN);
  check("a 7.1 mm Cat6A run measures 7.1 across",
        near(e.size[1], 7.1, 0.02) && near(e.size[2], 7.1, 0.02),
        e.size.map(n => n.toFixed(3)).join(","));
  check("and runs the length it was given", near(e.size[0], 1000, 0.02), String(e.size[0]));
  //! AND THE BORE IS REAL on a pipe, not a thicker line: a 22 mm tube with a
  //! 0.9 wall has a 20.2 hole, and volume is what tells a tube from a rod.
  await set(RUN, "cable", CABLE_TYPES.findIndex(one => one.key === "cw22"));
  const pipe = boxOf(RUN);
  check("22 mm copper tube measures 22 across",
        near(pipe.size[1], 22, 0.02), String(pipe.size[1]));
}

console.log("\n   switching what is in the run changes the run");
{
  const was = boxOf(CABLE).size[1];
  await set(CABLE, "cable", CABLE_TYPES.findIndex(one => one.key === "c19"));
  const now = boxOf(CABLE).size[1];
  check("an 11 mm C19 cord is fatter than a 7.1 mm Cat6A",
        now > was, was.toFixed(2) + " -> " + now.toFixed(2));
  //! AND A PIPE IS A CABLE WITH A BORE, off the same route and the same sweep.
  await set(CABLE, "cable", CABLE_TYPES.findIndex(one => one.key === "cw22"));
  const b = K.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
    .find(one => one.id === CABLE);
  check("and 22 mm copper tube comes out hollow",
        K.countSubShapes(b.shape, K.FACE) > 6, K.countSubShapes(b.shape, K.FACE) + " faces");
  await set(CABLE, "cable", 0);
}

console.log("\n   and it says when the run is too tight for what is in it");
{
  await set(CABLE, "cable", CABLE_TYPES.findIndex(one => one.key === "om4"));
  await set(ROUTE, "radius", 12);
  const said = String(((await at(CABLE)).data || {}).preview || "");
  check("a 12 mm corner is called out for OM4",
        /tighter than the 30 mm/.test(said), said);
  await set(ROUTE, "radius", 60);
  const ok = String(((await at(CABLE)).data || {}).preview || "");
  check("and a 60 mm corner is not", /does not go under it/.test(ok), ok);
}

console.log("\n   connectors sit on the ends, facing along the run");
{
  await set(CABLE, "cable", 0);
  const solidsIn = id => {
    const b = K.bodies({ notCategories: ["datum", "data"], sewMeshes: false })
      .find(one => one.id === id);
    return b ? K.countSubShapes(b.shape, K.SOLID) : 0;
  };
  const bare = solidsIn(CABLE);
  await set(CABLE, "startEnd", CONNECTORS_INDEX("rj45"));
  await set(CABLE, "endEnd", CONNECTORS_INDEX("rj45"));
  //! COUNTED, NOT MEASURED. A connector on the end of a long run sits well
  //! inside the run's own bounding box, so the envelope does not grow and a
  //! test on extents passes whether the connector was built or not.
  check("a bare run is one solid and a connectored one is three",
        bare === 1 && solidsIn(CABLE) === 3, bare + " -> " + solidsIn(CABLE));
  //! AND IT IS ROUND THE CABLE, not hanging off it: an RJ45 is 11.7 across and
  //! the cable is 7.1, so a connector centred on the axis reaches 5.85 from it
  //! and one built from a point ON the axis would reach 11.7.
  const STUB = await add("Route", { refs: { through: [await pt(0, 900, 0), await pt(200, 900, 0)] } });
  const PLUG = await add("Cable", { refs: { route: STUB } });
  await set(PLUG, "startEnd", CONNECTORS_INDEX("rj45"));
  const e = boxOf(PLUG);
  check("and the connector is centred on the cable, not hung off it",
        near(e.low[2], -5.85, 0.02) && near(e.high[2], 5.85, 0.02),
        e.low[2].toFixed(2) + " .. " + e.high[2].toFixed(2));
  const said = String(((await at(CABLE)).data || {}).preview || "");
  check("and the ends are named in what it reports",
        /RJ45 plug/.test(said), said.slice(0, 140));
}
function CONNECTORS_INDEX(key) {
  return CONNECTORS.findIndex(one => one.key === key);
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
