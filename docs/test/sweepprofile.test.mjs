// What you can sweep, and which way up it goes.
//
// TWO THINGS THAT LOOKED LIKE ONE. "I cannot select a Rotate as the profile of
// a sweep" is not a sweep bug at all: Move, Rotate, Mirror, Scale, Transform,
// Axis to axis, Place at, Trim and Join every one declared that they produce a
// SOLID, because that is what they are usually asked for - and every one of
// them takes a curve as readily. So turning a sketch and sweeping the result,
// which is the plainest thing a modeller does, could not be wired up: the
// Rotate said "solid" and a sweep's profile takes a curve. A transform now says
// what went into it.
//
// The second is that a section is drawn on a plane square across the rail, and
// which way is UP on that plane is whatever OpenCascade's arithmetic reached.
// A gutter came out on its side and the only cure was to redraw the sketch.
// Twist turns the section about the rail's own tangent before it sets off.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { acceptsFrom } from "../src/ocaf.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const kernel = await createWasmKernel({ initModule: init, wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, apply: () => {}, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
const kit = kernel.toolkit();
const at = async id => ((await kernel.tree()).tree.features).find(f => f.id === id);
const box = id => {
  const body = kit.bodies({ notCategories: [], sewMeshes: false, visible: false })
    .find(b => b.id === id);
  return body ? kit.extents(body.shape) : null;
};

//! A 400 x 200 rectangle on the XY plane, and a rail 1000 long up the Z axis.
//! Everything below is measured against those two numbers.
const square = (w, h) => ({ elements: [
  { id: "l1", type: "line", a: [-w / 2, -h / 2], b: [w / 2, -h / 2] },
  { id: "l2", type: "line", a: [w / 2, -h / 2], b: [w / 2, h / 2] },
  { id: "l3", type: "line", a: [w / 2, h / 2], b: [-w / 2, h / 2] },
  { id: "l4", type: "line", a: [-w / 2, h / 2], b: [-w / 2, -h / 2] },
], constraints: [] });

const BASE = {
  format: "ocaf-parametric-model", version: 1, name: "S", units: "mm",
  features: [
    { id: "O", type: "Point", args: { kind: "Coordinates", x: 0, y: 0, z: 0 } },
    { id: "T", type: "Point", args: { kind: "Coordinates", x: 0, y: 0, z: 1000 } },
    { id: "VZ", type: "Vector", args: { dx: 0, dy: 0, dz: 1 } },
    { id: "VX", type: "Vector", args: { dx: 1, dy: 0, dz: 0 } },
    { id: "PL", type: "Plane", args: { kind: "Origin and normal", origin: { ref: "O" },
                                       normal: { ref: "VZ" }, xdir: { ref: "VX" }, size: 600 } },
    { id: "SK", type: "Sketch", name: "Section",
      args: { plane: { ref: "PL" }, drawing: square(400, 200),
              faces: "Leave as wires", solve: "Solve" } },
    { id: "RAIL", type: "Line", name: "Rail",
      args: { kind: "Between two points", from: { ref: "O" }, to: { ref: "T" } } },
  ],
};
const load = extra => kernel.loadModel({ ...BASE, features: [...BASE.features, ...extra] });

/* --------------------------------- a transform says what went into it */
{
  await load([
    { id: "RO", type: "Rotate", name: "Turned",
      args: { shape: { ref: "SK" }, axis: { ref: "VZ" }, through: { ref: "O" },
              start: 0, end: 30 } },
    { id: "MV", type: "Move", name: "Moved",
      args: { shape: { ref: "RO" }, kind: "Along a direction",
              direction: { ref: "VX" }, distance: 0 } },
  ]);
  const rot = await at("RO"), mov = await at("MV");
  check("a rotated curve is still a curve", rot.produces === "curve", rot.produces);
  check("and so is one that was then moved", mov.produces === "curve", mov.produces);
  //! THE CHECK THAT MATTERS: this is the one acceptsFrom asks, and the one that
  //! refused the wire. Before, rot.produces was "solid" and this was false.
  check("so a sweep's profile will take it", acceptsFrom(["curve"], rot));

  //! The other direction, because a transform that said "curve" about
  //! everything would be the same bug facing the other way.
  await mdl.run({ op: "add", type: "Cube", id: "BX", name: "Block" });
  await mdl.run({ op: "add", type: "Rotate", id: "R2", name: "Turned block" });
  await mdl.run({ op: "connect", id: "R2", key: "shape", from: "BX", mode: "only" });
  check("a rotated solid is still a solid", (await at("R2")).produces === "solid",
        (await at("R2")).produces);

  //! Nothing wired in has to answer SOMETHING, or an empty Rotate could not be
  //! wired up in the first place. Loaded rather than added: adding one wires it
  //! to a sensible default, which is the opposite of the case being asked for.
  await load([{ id: "R3", type: "Rotate", name: "Empty", args: { start: 0, end: 30 } }]);
  check("a transform with nothing wired in falls back to what the catalogue says",
        (await at("R3")).produces === "solid", (await at("R3")).produces);
}

/* ------------------------------------ and it really sweeps, end to end */
{
  await load([
    { id: "RO", type: "Rotate", name: "Turned section",
      args: { shape: { ref: "SK" }, axis: { ref: "VZ" }, through: { ref: "O" },
              start: 0, end: 90 } },
    { id: "SW", type: "Sweep", name: "Swept",
      args: { profile: { ref: "RO" }, spine: { ref: "RAIL" }, cap: "Solid" } },
  ]);
  const row = await at("SW");
  check("a Rotate sweeps along a rail", row.built && !row.error, String(row.error));
  //! 400 x 200 turned a quarter turn about Z is 200 x 400, then swept 1000 up.
  //! Derived before the program was asked; a sweep that ignored the Rotate
  //! would measure 400 x 200 x 1000 and look perfectly correct on screen.
  const b = box("SW");
  const ok = b && Math.abs(b.size[0] - 200) < 1 && Math.abs(b.size[1] - 400) < 1
             && Math.abs(b.size[2] - 1000) < 1;
  check("and it sweeps the section AS TURNED, not as drawn", ok,
        b ? b.size.map(Math.round).join(" x ") : "no body");
}

/* ------------------------------------------------------------- twist */
{
  await load([
    { id: "SW", type: "Sweep", name: "Plain",
      args: { profile: { ref: "SK" }, spine: { ref: "RAIL" }, cap: "Solid" } },
    { id: "SW2", type: "Sweep", name: "Twisted",
      args: { profile: { ref: "SK" }, spine: { ref: "RAIL" }, cap: "Solid", twist: 90 } },
  ]);
  const plain = box("SW"), turned = box("SW2");
  check("a sweep with no twist is 400 x 200",
        Math.abs(plain.size[0] - 400) < 1 && Math.abs(plain.size[1] - 200) < 1,
        plain.size.map(Math.round).join(" x "));
  //! The rail runs up Z, so a twist of 90 about it swaps the section's two
  //! sides and changes nothing else. Same volume, both ways.
  check("twisted 90° about the rail it is 200 x 400",
        Math.abs(turned.size[0] - 200) < 1 && Math.abs(turned.size[1] - 400) < 1,
        turned.size.map(Math.round).join(" x "));
  check("and the rail is untouched: still 1000 long",
        Math.abs(turned.size[2] - 1000) < 1, String(Math.round(turned.size[2])));
  //! THE CHECK THAT TELLS A TURN FROM A SHEAR. Swapping the two sides of the
  //! box is also what a section drawn the other way round would do, and what a
  //! sweep that quietly rebuilt the profile would do. The volume is what says
  //! the section is the same section: 400 x 200 x 1000 = 8e7 mm3 either way.
  const vol = id => {
    const body = kit.bodies({ notCategories: [], sewMeshes: false, visible: false })
      .find(b => b.id === id);
    if (!body) return null;
    const props = new kit.oc.GProp_GProps();
    kit.oc.BRepGProp.VolumeProperties(body.shape, props, false, false, false);
    return Math.abs(props.Mass());
  };
  const a = vol("SW"), t = vol("SW2");
  check("the same section, turned: the volume does not move",
        a && t && Math.abs(a - t) / a < 1e-6 && Math.abs(a - 8e7) / 8e7 < 1e-6,
        `${a} vs ${t}`);

  //! A twist of nothing is a twist of nothing - the wire is not rebuilt, and an
  //! old file with no twist on it opens exactly as it did.
  await mdl.run({ op: "set", id: "SW2", key: "twist", value: 0 });
  const back = box("SW2");
  check("twist 0 is the sweep it always was",
        Math.abs(back.size[0] - 400) < 1 && Math.abs(back.size[1] - 200) < 1,
        back.size.map(Math.round).join(" x "));
}

/* ------------------------------------------- what the panel asks for */
{
  const spec = (await kernel.schema()).types.find(t => t.type === "Sweep")
    || (kernel.typeSpec ? kernel.typeSpec("Sweep") : null);
  const args = (spec && spec.args) || [];
  const shown = args.filter(a => !a.showWhen).map(a => a.key);
  //! A SWEEP IS A PROFILE AND A RAIL. The other six were in front of that every
  //! time; they are still here, and still saved, and an old file still opens
  //! with whatever it set - but they are behind Show now.
  check("with Show on the basics the panel asks four questions and no more",
        shown.join(",") === "profile,spine,cap,twist,show",
        shown.join(","));
  check("and everything else is still declared",
        ["into", "guide", "hold", "corner", "scale", "easing"]
          .every(k => args.some(a => a.key === k)),
        args.map(a => a.key).join(","));
  //! An argument's index IS its OCAF child tag. Folding one away must not move
  //! it: a file written before this opens by position.
  check("nothing moved: profile, spine and cap are still tags 0, 1 and 2",
        args[0].key === "profile" && args[1].key === "spine" && args[2].key === "cap",
        args.slice(0, 3).map(a => a.key).join(","));
}

/* ------------------------- and a setting in force is never folded away

   THE TRAP THE FOLD WOULD OTHERWISE BE. A file that already scales its sweep,
   or holds the section facing a guide, would open showing the basics - with the
   setting that is deciding its shape hidden behind a chooser nobody would think
   to open. An argument whose value is not the catalogue's default shows itself,
   whatever the fold says.                                                    */
{
  //! The same rule the panel runs, restated here against the tree's own rows -
  //! argApplies lives in app.js, which has a DOM in it and cannot be imported.
  const applies = (entry, arg) => {
    if (!arg.showWhen) return true;
    const now = entry.values[arg.showWhen.key];
    if (arg.showWhen.any ? arg.showWhen.any.includes(now) : now === arg.showWhen.equals) return true;
    if (arg.kind === "ref" || arg.kind === "refs") return !!(entry.refs && entry.refs[arg.key]);
    //! def in the catalogue, default in the published schema. This runs against
    //! the schema, which is what the panel is handed.
    const was = arg.def === undefined ? arg.default : arg.def, v = entry.values[arg.key];
    if (arg.kind === "real") return Number.isFinite(v) && Number.isFinite(was) && Math.abs(v - was) > 1e-9;
    if (arg.kind === "choice") return Number.isFinite(v) && Number.isFinite(was) && v !== was;
    return false;
  };
  const spec = (await kernel.schema()).types.find(t => t.type === "Sweep");
  await load([
    { id: "SW", type: "Sweep", name: "Plain",
      args: { profile: { ref: "SK" }, spine: { ref: "RAIL" }, cap: "Solid" } },
    { id: "SW2", type: "Sweep", name: "Scaled",
      args: { profile: { ref: "SK" }, spine: { ref: "RAIL" }, cap: "Solid", scale: 2.5 } },
    { id: "SW3", type: "Sweep", name: "Frenet",
      args: { profile: { ref: "SK" }, spine: { ref: "RAIL" }, cap: "Solid", hold: "Frenet" } },
  ]);
  const shownFor = async id => {
    const entry = await at(id);
    return spec.args.filter(a => applies(entry, a)).map(a => a.key);
  };
  check("a plain sweep still asks four questions",
        (await shownFor("SW")).join(",") === "profile,spine,cap,twist,show",
        (await shownFor("SW")).join(","));
  check("but one that is scaled shows the scale that is scaling it",
        (await shownFor("SW2")).includes("scale"), (await shownFor("SW2")).join(","));
  check("and one held Frenet shows that it is",
        (await shownFor("SW3")).includes("hold"), (await shownFor("SW3")).join(","));
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
