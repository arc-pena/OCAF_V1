// Builds docs/data/samples/octagon_plan.json — the octagon masterplan, as one
// Script feature with its sliders: a rectangle on every node of the diagrid,
// an octagon in every diamond, and an attractor that pulls the heights up.
//
//     node scripts/build_octagrid_sample.mjs
//
// The script itself lives in scripts/octagrid.script.js and is embedded here
// rather than written twice: that file is what docs/test/diagrid.test.mjs
// drives, so what the sample ships and what the tests measure cannot drift
// apart.
//
// THE SITE is SiteBoundary.dxf as supplied: three polylines and three
// quadratic splines on layer NEW-PlotLine, chained into one closed ring of 44
// points, 33.2 hectares, 602 x 853 m. The two tiny splines are fillets at the
// kinks; the long one is the curved west edge, sampled at 24 segments. Metres
// in the file (INSUNITS 6), millimetres here, so everything is x1000.
import { createWasmKernel } from "../docs/src/wasm-kernel.js";
import { Mdl } from "../docs/src/mdl.js";
import { readFileSync, writeFileSync } from "fs";

const WASM = process.env.OCJS_DIR
  || new URL("../docs/.kernel/package/dist", import.meta.url).pathname;
const OUT = new URL("../docs/data/samples/octagon_plan.json", import.meta.url).pathname;
const SRC = new URL("./octagrid.script.js", import.meta.url).pathname;

const code = readFileSync(SRC, "utf8");

//! THE ATTRACTORS ARE NODES IN THE GRAPH, not numbers in the script. Three
//! Points and a spline through four more are wired into the Script's own
//! inputs; the script reads them in the order they are wired and lets them
//! overrule its sliders. Drag a point in the viewport and the city answers,
//! which is the whole difference between a parameter and a handle.
const ref = id => ({ ref: id });
const point = (id, name, x, y) =>
  ({ id, type: "Point", name, args: { kind: "Coordinates", x, y, z: 0 } });

const spline = [[60000, 700000], [250000, 560000], [430000, 430000], [520000, 250000]];

//! AT THE TOP LEVEL, NOT FILED IN A SET. A set is one node in the graph with
//! its own graph inside it - Grasshopper's cluster - so attractors tidied into
//! a folder draw as a single box, and opening the Nodes view on this sample
//! showed two nodes and no handles at all. The whole point of the arrangement
//! is to be able to SEE it: three points, four more on a spline, the curve
//! through them and a number, all wired into the script.
const model = {
  format: "ocaf-parametric-model", version: 1, name: "Octagon plan", units: "mm",
  features: [
    point("P_HIGH", "Height attractor", 300000, 480000),
    point("P_VOID", "Void attractor", 170000, 250000),
    point("P_WORM", "Wormhole", 420000, 620000),
    ...spline.map(([x, y], i) => point("S" + i, "Spline point " + (i + 1), x, y)),
    { id: "SPLINE", type: "Interpolate", name: "Spline attractor",
      args: { points: spline.map((_, i) => ref("S" + i)), closed: "Open", degree: 3 } },
    //! A Number driving one of the script's own parameters, because that is
    //! the other half of what this sample is for: every declared parameter is
    //! an argument now, so a slider node can drive it like any other.
    { id: "N_HEIGHT", type: "Number", name: "Base height", args: { value: 28000 } },

    { id: "PLAN", type: "Script", name: "Octagon masterplan",
      args: { code,
              points: [ref("P_HIGH"), ref("P_VOID"), ref("P_WORM")],
              curves: [ref("SPLINE")],
              height: { value: 28000, from: "N_HEIGHT" },
              splineGap: 12000 },
      appearance: { finish: "concrete" } },

    //! THE THREE OUTPUTS, WRITTEN DOWN rather than left to appear. The script
    //! declares them and the kernel makes one node per name on its own, with
    //! ids of its own - which is fine until something in the file has to
    //! WIRE to one. Named here, the reconciler finds them already there and
    //! leaves them alone, and the cage below can point at the massing.
    { id: "O_MASS", type: "Output", name: "Massing", parent: "PLAN",
      args: { from: ref("PLAN"), part: "massing" } },
    { id: "O_PLAZ", type: "Output", name: "Plazas", parent: "PLAN",
      args: { from: ref("PLAN"), part: "plazas" } },
    { id: "O_SET", type: "Output", name: "Setting out", parent: "PLAN",
      args: { from: ref("PLAN"), part: "setting" } },

    /* ------------------------------------- and a cage edit over the top of it

       THE POINT OF THE OUTPUTS, demonstrated: a lattice round the MASSING
       alone, a copy of it pulled towards the east corner of the site, and the
       massing carried through the difference. The squares and the setting-out
       lines are not in the cage and do not move, which is the whole reason
       the script publishes three things rather than one.

       The lattice takes the massing - a solid - straight in: a cage needs
       nothing but the extents of what it goes round. The morph takes it
       straight in too and tessellates it, and says so in its note.        */

    //! The site's easternmost corner, which is a real vertex of the boundary.
    point("C_EAST", "Site corner", 602000, 320300),
    { id: "V_PULL", type: "Vector", name: "Towards the corner",
      args: { dx: 0.927, dy: -0.375, dz: 0 } },

    { id: "CAGE", type: "CageLattice", name: "Cage round the massing",
      args: { mesh: ref("O_MASS"), nx: 3, ny: 3, nz: 2, padding: 20000,
              fit: "The input's bounding box" } },
    //! A soft selection made of the corner point: the control points nearest
    //! it are fully selected and it falls away to nothing 400 m out, so the
    //! cage is pulled at one end and held at the other.
    { id: "CSEL", type: "SoftSelect", name: "Near the corner",
      args: { mesh: ref("CAGE"), attractors: [ref("C_EAST")],
              radius: 400000, falloff: "Smooth" } },
    { id: "CPULL", type: "CageDeform", name: "Pull towards the corner",
      args: { mesh: ref("CSEL"), kind: "Move", by: ref("V_PULL"), distance: 45000 } },
    { id: "MORPH", type: "CageMorph", name: "Massing, morphed",
      args: { mesh: ref("O_MASS"), rest: ref("CAGE"), moved: ref("CPULL") },
      appearance: { finish: "concrete" } },
  ],
  //! THE DEFORMED CAGE IS PUT AWAY, because it is a box the size of the
  //! whole city and shaded like everything else: left on, it is all you see
  //! - the first screenshot of this sample was a grey box with a site
  //! boundary peeping out from under it. The eye in the tree brings it back,
  //! which is what you do when you want to push its control points about.
  //! The cage it came from and the soft selection on it are already away,
  //! having been eaten by the two nodes that read them.
  hidden: ["CPULL"],
};

/* ------------------------------------------------- built before it is written */
const initModule = (await import(WASM + "/replicad_single.js")).default;
const kernel = await createWasmKernel({ initModule,
  wasmBinary: readFileSync(WASM + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null });
await mdl.run({ op: "model", model });
const at = async () => (await kernel.tree()).tree.features.find(f => f.id === "PLAN");
const says = async id => (await kernel.tree()).tree.features.find(f => f.id === id);

let bad = 0;
const say = line => console.log("  " + line);
const entry = await at();
if (entry.error) { say("FAILED — " + entry.error); bad++; }
say((entry.params || []).length + " sliders: "
  + (entry.params || []).map(p => p.key).join(" "));
//! THE WIRES, CHECKED. A sample whose attractors are wired to nothing looks
//! exactly like one whose attractors are wired up: the script falls back to
//! its sliders and the plan comes out plausible either way.
const wiredPoints = ((await says("PLAN")).lists || {}).points || [];
const wiredCurves = ((await says("PLAN")).lists || {}).curves || [];
say("wired in: " + wiredPoints.length + " points (" + wiredPoints.join(", ") + ") and "
  + wiredCurves.length + " curve (" + wiredCurves.join(", ") + ")");
if (wiredPoints.length !== 3 || wiredCurves.length !== 1) {
  say("  ^ the attractors are not wired - not written"); bad++;
}
const driver = ((await says("PLAN")).driven || {}).height;
say("and the base height is driven by " + (driver || "nothing"));
if (driver !== "N_HEIGHT") { say("  ^ the Number is not driving it - not written"); bad++; }

//! AND THE THREE OUTPUTS, which are nodes the script makes rather than rows
//! in this file: they appear under it when it is opened. Checked by what they
//! BUILT, because an output that carries an empty compound looks exactly like
//! one that carries the massing until something is asked to mesh it.
const kids = (await kernel.tree()).tree.features.filter(f => f.parent === "PLAN");
say(kids.length + " outputs: " + kids.map(f => f.name).join(", "));
if (kids.length !== 3) { say("  ^ the script's outputs are not there - not written"); bad++; }
for (const kid of kids) {
  const got = (await kernel.mesh([kid.id])).features[0];
  const n = got ? got.triangles : 0;
  const edges = got && got.edges ? got.edges.length : 0;
  say("  " + kid.name + ": " + n + " triangles, " + edges + " edges, gives "
      + kid.produces + (kid.error ? "  ERROR " + kid.error : ""));
  if (kid.error || (!n && !edges)) { say("  ^ it carries nothing - not written"); bad++; }
}
//! N-GONS, NOT B-REP, which is what makes every mesh tool downstream work
//! without a conversion node and what makes this a tenth of the memory. The
//! massing and the plazas are meshes; the setting out is curves, because a
//! line on the ground is not a surface.
{
  const plan = await says("PLAN");
  const kinds = kids.map(f => f.name + "=" + f.produces).join(" ");
  say("the plan gives " + plan.produces + " \u00b7 " + kinds);
  if (plan.produces !== "mesh") { say("  ^ the plan is not a mesh - not written"); bad++; }
  const want = { Massing: "mesh", Plazas: "mesh", "Setting out": "solid" };
  for (const kid of kids)
    if (kid.produces !== want[kid.name]) {
      say("  ^ " + kid.name + " gives " + kid.produces + ", wanted " + want[kid.name]
          + " - not written");
      bad++;
    }
  //! AND THE ARRISES ARE MARKED. Every edge of a building is one, and a
  //! Mesh to NURBS downstream reads exactly this to keep the city square
  //! rather than rounding it off.
  const mass = await says("O_MASS");
  const creased = mass.data && mass.data.preview || "";
  say("the massing's mesh: " + creased);
  if (!/crease/.test(creased)) {
    say("  ^ the massing carries no creases, so a conversion would round it off"
        + " - not written");
    bad++;
  }
}

//! AND THE CAGE EDIT OVER THE TOP. Four nodes that have to build, and one
//! claim that is the whole reason they are here: the massing moves and the
//! squares do not. Measured as the eastern edge of each, because the pull is
//! eastward and that is the number it changes.
const spanOf = async (id, axis) => {
  const got = (await kernel.mesh([id])).features[0];
  if (!got || !got.positions.length) return null;
  let lo = Infinity, hi = -Infinity;
  for (let i = axis; i < got.positions.length; i += 3) {
    if (got.positions[i] < lo) lo = got.positions[i];
    if (got.positions[i] > hi) hi = got.positions[i];
  }
  return { lo: Math.round(lo / 100) / 10, hi: Math.round(hi / 100) / 10 };
};
for (const id of ["CAGE", "CSEL", "CPULL", "MORPH"]) {
  const node = await says(id);
  say(node.name + ": " + (node.error ? "FAILED \u2014 " + node.error
                                     : (node.note || "built")));
  if (node.error) bad++;
}
{
  const was = await spanOf("O_MASS", 0), now = await spanOf("MORPH", 0);
  const squares = await spanOf("O_PLAZ", 0);
  say("massing " + (was ? was.lo + ".." + was.hi : "?") + " m east, morphed "
      + (now ? now.lo + ".." + now.hi : "?") + " m, squares "
      + (squares ? squares.lo + ".." + squares.hi : "?") + " m");
  if (!now || !was || Math.abs(now.hi - was.hi) < 5) {
    say("  ^ the cage did not move the massing - not written"); bad++;
  }
  if (!squares || Math.abs(squares.hi - 519.5) > 1) {
    say("  ^ the squares moved with it, which is what the outputs are for - not written");
    bad++;
  }
}

//! WHAT IT ACTUALLY MADE, measured off the mesh rather than off the script's
//! own arithmetic - a plan() that returns a hundred polygons and a build()
//! that drops them all would look identical from the inside.
const mesh = (await kernel.mesh(["PLAN"])).features[0];
const xs = [], ys = [], zs = [];
for (let i = 0; i + 2 < mesh.positions.length; i += 3) {
  xs.push(mesh.positions[i]); ys.push(mesh.positions[i + 1]); zs.push(mesh.positions[i + 2]);
}
const round = v => Math.round(v / 100) / 10;
say(mesh.triangles + " triangles · " + round(Math.min(...xs)) + ".." + round(Math.max(...xs))
  + " m east, " + round(Math.min(...ys)) + ".." + round(Math.max(...ys)) + " m north, "
  + round(Math.min(...zs)) + ".." + round(Math.max(...zs)) + " m up");

//! AND THAT THE SLIDERS DRIVE IT. A Script feature whose code throws on a
//! setting somebody will certainly try is a sample that breaks the first time
//! it is touched, so the ends of the four that change the most are driven
//! here rather than left to the person who opens it.
for (const [key, value] of [["rings", 2], ["rings", 24], ["spokes", 2], ["spokes", 40],
                            ["focus", 150000], ["focus", 20000000], ["merge", 1],
                            ["inset", 0], ["inset", 40000], ["drift", 1],
                            ["plaza", 10000], ["plaza", 120000], ["ratio", 4],
                            ["bulge", -200000], ["bulge", 400000], ["reach", 10000],
                            ["falloff", 4], ["show", 2],
                            //! The wormhole and the spline, both ends. The
                            //! wormhole at full drag is the one that can fold
                            //! a cell inside out, and a gap wider than the
                            //! plot is the one that can leave nothing.
                            ["warpPull", 0], ["warpPull", 0.8],
                            ["warpReach", 10000], ["warpReach", 1500000],
                            ["splineReach", 10000], ["splineReach", 800000],
                            ["splineBulge", -200000], ["splineBulge", 400000],
                            ["splineGap", 0], ["splineGap", 80000]]) {
  await mdl.run({ op: "set", id: "PLAN", key, value });
  const got = await at();
  //! A NAMED REFUSAL IS NOT A FAILURE. Asking for 24 rings on this site with a
  //! 16 m plaza is a fair thing to try and the answer is that the bay cannot
  //! hold it; what would be a failure is a crash, or an empty model with
  //! nothing said. So the plaza rule's own refusal passes and is reported.
  if (got.error && /plaza rule/.test(got.error)) {
    say("refused at " + key + " = " + value + ", by name: "
      + got.error.replace(/^no block survived the plaza rule: /, ""));
  } else if (got.error) {
    say("FAILED at " + key + " = " + value + " \u2014 " + got.error); bad++;
  }
  const spec = (got.params || []).find(p => p.key === key);
  await mdl.run({ op: "set", id: "PLAN", key, value: spec ? spec.def : value });
}
say("every slider end builds");

if ((await at()).error) { say("FAILED after the sweep"); bad++; }
if (bad) process.exit(1);

writeFileSync(OUT, JSON.stringify(model, null, 1));
console.log("wrote " + OUT + "  (" + Math.round(code.length / 1024) + " kB of script)");
