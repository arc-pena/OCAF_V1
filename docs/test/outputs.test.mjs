// A SCRIPT THAT PUBLISHES PIECES OF WHAT IT BUILT.
//
// A feature has one result, and that does not change here. What changes is
// that it may also NAME the pieces that result was assembled from, so the
// massing of a masterplan can be deformed without its squares coming too.
//
// The names are declared, like the parameters and for the same reason: the
// Output nodes that carry them have to exist before anything can be wired to
// one, and compiling the code to find out would run the script twice per
// rebuild.
//
// What is checked here is the whole of what that costs:
//
//   the nodes appear, one per declared name, filed under the script;
//   they build, and what they build is the piece and not the whole;
//   a wire onto one SURVIVES the script being edited, which is the only
//     reason to keep nodes rather than make them fresh every time;
//   renaming an output takes the old node away and brings a new one;
//   and a script that declares an output and builds nothing for it says so,
//     on the script, where the mistake is.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR
  || new URL("../.kernel/package/dist", import.meta.url).pathname;
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

const kernel = await createWasmKernel({ initModule: init,
                                        wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null });
const feats = async () => (await kernel.tree()).tree.features;
const at = async id => (await feats()).find(f => f.id === id);
const under = async id => (await feats()).filter(f => f.parent === id);
const sizeOf = async id => {
  const got = (await kernel.mesh([id])).features[0];
  if (!got || !got.positions.length) return null;
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i + 2 < got.positions.length; i += 3)
    for (let k = 0; k < 3; k++) {
      const v = got.positions[i + k];
      if (v < lo[k]) lo[k] = v;
      if (v > hi[k]) hi[k] = v;
    }
  return { tris: got.triangles, lo, hi };
};

//! A BOX AND A PLATE, in one script, far enough apart that a measurement can
//! tell which is which: the box is 40 wide at the origin, the plate is 10
//! wide and starts at x = 500. Nothing about the sizes is incidental - every
//! claim below is read off them.
const TWO = `({
  params: [{ key: "size", label: "Size", def: 40, min: 10, max: 100, step: 1 }],
  outputs: [{ key: "block", label: "The block" }, { key: "plate", label: "The plate" }],
  build(p, k) {
    const block = k.box(p.size, p.size, p.size);
    const plate = k.box(10, 10, 2, { at: [500, 0, 0] });
    return { shape: k.compound([block, plate]), parts: { block, plate } };
  }
})`;

console.log("1. the outputs appear as nodes under the script");
await mdl.run({ op: "model", model: { format: "ocaf-parametric-model", version: 1,
                                      name: "Outputs", units: "mm", features: [] } });
const SC = (await mdl.run({ op: "add", type: "Script", name: "Two things" })).id;
await mdl.run({ op: "code", id: SC, key: "code", text: TWO });
{
  const kids = await under(SC);
  check("two declared outputs make two nodes", kids.length === 2,
        kids.map(f => f.name + " (" + f.type + ")").join(", "));
  check("they are Output nodes", kids.every(f => f.type === "Output"));
  check("each says which output it is",
        kids.map(f => (f.texts || {}).part).sort().join() === "block,plate",
        JSON.stringify(kids.map(f => (f.texts || {}).part)));
  check("they are named after the labels the script gave",
        kids.map(f => f.name).sort().join() === "The block,The plate",
        kids.map(f => f.name).join());
  check("and they all built", kids.every(f => f.built && !f.error),
        kids.map(f => f.error).filter(Boolean).join(" | "));

  //! AND THE SCRIPT STANDS DOWN FROM THE VIEW. Its outputs are what it
  //! built, so drawn as well as them it is drawn twice - twice the triangles
  //! and a flicker where the two copies of one face meet. The feature is
  //! still there and still gives the whole to anything wired to it; it is
  //! only the drawing that defers.
  check("the script stops drawing itself once its outputs do",
        (await at(SC)).visible === false, String((await at(SC)).visible));
  check("and its outputs are the ones on screen",
        kids.every(f => f.visible !== false));
}

console.log("\n2. what they carry is the piece, not the whole");
{
  const whole = await sizeOf(SC);
  const kids = await under(SC);
  const block = kids.find(f => f.name === "The block");
  const plate = kids.find(f => f.name === "The plate");
  const b = await sizeOf(block.id), q = await sizeOf(plate.id);
  //! The script's own shape spans both: 0 to 510 across.
  check("the script itself still gives the lot",
        Math.abs(whole.hi[0] - 510) < 1e-6 && Math.abs(whole.lo[0]) < 1e-6,
        whole.lo[0] + ".." + whole.hi[0]);
  check("the block output is the 40 box at the origin",
        Math.abs(b.hi[0] - 40) < 1e-6 && Math.abs(b.lo[0]) < 1e-6,
        b.lo[0] + ".." + b.hi[0]);
  check("the plate output is the 10 plate out at 500",
        Math.abs(q.lo[0] - 500) < 1e-6 && Math.abs(q.hi[0] - 510) < 1e-6,
        q.lo[0] + ".." + q.hi[0]);
  //! 12 triangles a box, so the two pieces and the whole agree by count too -
  //! which is the check that would notice an output quietly carrying the
  //! compound instead of its own piece.
  check("and the two pieces are the whole, triangle for triangle",
        b.tris + q.tris === whole.tris,
        b.tris + " + " + q.tris + " = " + whole.tris);
}

console.log("\n3. an output is a feature, so it can be wired like one");
let MOVED;
{
  MOVED = (await mdl.run({ op: "add", type: "Move", name: "Pushed" })).id;
  const block = (await under(SC)).find(f => f.name === "The block");
  let wired = null;
  for (const key of ["shape", "of", "body", "what"]) {
    try { await mdl.run({ op: "connect", id: MOVED, key, from: block.id }); wired = key; break; }
    catch (e) { /* not that input */ }
  }
  check("a Move takes the block output", !!wired, wired || "nothing accepted it");
  if (wired) {
    //! Along +x by 1000, which is the Move node's own first pattern: a
    //! direction and a distance.
    const VX = (await mdl.run({ op: "add", type: "Vector", name: "East" })).id;
    await mdl.run({ op: "set", id: VX, key: "dx", value: 1 });
    await mdl.run({ op: "set", id: VX, key: "dy", value: 0 });
    await mdl.run({ op: "set", id: VX, key: "dz", value: 0 });
    await mdl.run({ op: "connect", id: MOVED, key: "direction", from: VX });
    await mdl.run({ op: "set", id: MOVED, key: "distance", value: 1000 });
    const got = await sizeOf(MOVED);
    check("and moves it, which is the block and not the plan",
          got && Math.abs(got.lo[0] - 1000) < 1e-6 && Math.abs(got.hi[0] - 1040) < 1e-6,
          got ? got.lo[0] + ".." + got.hi[0] : "(nothing built)");
  }
}

console.log("\n4. the wire survives the script being edited");
{
  const before = (await under(SC)).map(f => f.id).join();
  await mdl.run({ op: "set", id: SC, key: "size", value: 60 });
  const after = (await under(SC)).map(f => f.id).join();
  check("turning a slider keeps the same output nodes", before === after,
        before + " -> " + after);
  const got = await sizeOf(MOVED);
  check("and what is wired to one follows the new size",
        got && Math.abs(got.hi[0] - 1060) < 1e-6,
        got ? String(got.hi[0]) : "(nothing)");

  //! Editing the CODE is the harder case: the feature is recompiled, its
  //! parameters are reconciled, and the outputs must come through that
  //! without being torn down - or every wire onto one would be cut by
  //! typing in the editor.
  await mdl.run({ op: "code", id: SC, key: "code",
                  text: TWO.replace("k.box(10, 10, 2", "k.box(10, 10, 4") });
  const edited = (await under(SC)).map(f => f.id).join();
  check("editing the code keeps them too", edited === before, edited);
  check("and the wire is still on", !!(await at(MOVED)).built);
}

console.log("\n5. renaming an output replaces the node, and dropping one removes it");
{
  await mdl.run({ op: "code", id: SC, key: "code",
                  text: TWO.replace('{ key: "plate", label: "The plate" }',
                                    '{ key: "slab", label: "The slab" }')
                           .replace("parts: { block, plate }", "parts: { block, slab: plate }") });
  const kids = await under(SC);
  check("the renamed one is a different node with the new name",
        kids.length === 2 && kids.some(f => f.name === "The slab")
        && !kids.some(f => f.name === "The plate"),
        kids.map(f => f.name).join());

  await mdl.run({ op: "code", id: SC, key: "code", text: `({
    params: [], outputs: [{ key: "block", label: "The block" }],
    build(p, k) { const block = k.box(40, 40, 40); return { shape: block, parts: { block } }; }
  })` });
  const left = await under(SC);
  check("dropping an output takes its node away", left.length === 1,
        left.map(f => f.name).join());
  check("and nothing is left loose in the document",
        (await feats()).filter(f => f.type === "Output" && !f.parent).length === 0);

  //! ONE FEATURE, ONE ROW. Renaming an output deletes a feature and adds one
  //! in the same breath, which nothing in the program had ever done before -
  //! and the document reported the new one TWICE, under one id, in the tree
  //! and in the saved file. addFeature minted the id after making the label,
  //! and minting asks the document what is already in it, and asking rebuilds
  //! the feature list - which by then already held the new label. So it was
  //! filed once by the rebuild and once by the add.
  const all = await feats();
  const twice = all.map(f => f.id).filter((id, i, list) => list.indexOf(id) !== i);
  check("and every feature in the document is in it exactly once",
        twice.length === 0, twice.join(", ") || all.map(f => f.id).join(","));

  //! AND WHAT WAS WIRED TO IT SAYS SO. The block output survived this edit,
  //! so the Move still has it; what matters is that the rename in between
  //! took the plate's node away and the document stayed consistent rather
  //! than keeping a wire to a feature that is gone.
  const move = await at(MOVED);
  check("the Move is still wired to the output that remains",
        !!move.built && !move.error, move.error || "");
}

console.log("\n6. it says what is wrong, on the thing that is wrong");
{
  await mdl.run({ op: "code", id: SC, key: "code", text: `({
    params: [], outputs: [{ key: "block" }, { key: "missing" }],
    build(p, k) { const block = k.box(40, 40, 40); return { shape: block, parts: { block } }; }
  })` });
  const f = await at(SC);
  check("a declared output the build did not fill is reported on the script",
        !!f.error && /the output 'missing'/.test(f.error), f.error || "(no error)");

  await mdl.run({ op: "code", id: SC, key: "code", text: `({
    params: [], outputs: [{ key: "block" }],
    build(p, k) { return k.box(40, 40, 40); }
  })` });
  const g = await at(SC);
  check("so is a build that declares outputs and returns none",
        !!g.error && /returned no parts/.test(g.error), g.error || "(no error)");

  const twice = await (async () => {
    await mdl.run({ op: "code", id: SC, key: "code", text: `({
      params: [], outputs: [{ key: "a" }, { key: "a" }],
      build(p, k) { return k.box(1, 1, 1); } })` });
    return (await at(SC)).error || "";
  })();
  check("two outputs cannot share a key", /share the key/.test(twice), twice);
}

console.log("\n6b. a script in error keeps drawing through its outputs");
{
  //! THE CASE THAT WOULD BE AN EMPTY SCREEN. A script that publishes has
  //! stood down from the view in favour of its outputs, so if they refused
  //! whenever it did, one bad edit would leave nothing on screen - which is
  //! the complaint this whole thing started from. The pieces it last
  //! published are still there, exactly as the shape it last built is.
  await mdl.run({ op: "code", id: SC, key: "code", text: TWO });
  const was = await sizeOf((await under(SC)).find(f => f.name === "The block").id);
  await mdl.run({ op: "code", id: SC, key: "code", text: TWO.replace(
    "const block = k.box(p.size, p.size, p.size);",
    "if (true) throw new Error('nope'); const block = k.box(1, 1, 1);") });
  const script = await at(SC);
  check("the script says what went wrong", !!script.error, script.error || "(none)");
  const kids = await under(SC);
  check("its outputs do not take the blame", kids.every(f => !f.error),
        kids.map(f => f.name + ": " + f.error).filter(one => /: ./.test(one)).join(" | "));
  const now = await sizeOf(kids.find(f => f.name === "The block").id);
  check("and they still carry what was last built",
        now && was && Math.abs(now.hi[0] - was.hi[0]) < 1e-9,
        now ? now.hi[0] + " against " + was.hi[0] : "(nothing)");
  await mdl.run({ op: "code", id: SC, key: "code", text: TWO });
  check("and come back when the script does", !(await at(SC)).error);
}

/* ====================================== 6c2. a script that builds a MESH

   A thousand blocks as B-Rep prisms is a thousand solids for the kernel to
   carry, tessellate and boolean; the same thousand as n-gons is a list of
   points and a list of faces. So a script may build one, and what it hands
   downstream then has to SAY it is a mesh - or a mesh input will not take it
   and a solid input will take it and fail.                               */

console.log("\n6e. a script may build a mesh instead of a shape");
{
  //! A square prism as six n-gons: two quads and four sides. Written out by
  //! hand so every number below can be checked on paper - 8 vertices, 6
  //! faces, and 100 across.
  const PRISM = `({
    params: [], outputs: [{ key: "block", label: "The block" }],
    build() {
      const pts = [], n = 100;
      for (const z of [0, 60])
        for (const [x, y] of [[0, 0], [n, 0], [n, n], [0, n]]) pts.push([x, y, z]);
      const faces = [[3, 2, 1, 0], [4, 5, 6, 7],
                     [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
      //! Every edge of a building is an arris, so every edge is creased -
      //! which is what a Mesh to NURBS downstream reads to keep it sharp.
      const creases = {};
      for (const face of faces)
        for (let i = 0; i < face.length; i++) {
          const a = face[i], b = face[(i + 1) % face.length];
          creases[a < b ? a + "," + b : b + "," + a] = 1;
        }
      const mesh = { points: pts, faces, creases };
      return { mesh, parts: { block: mesh } };
    }
  })`;
  await mdl.run({ op: "code", id: SC, key: "code", text: PRISM });
  const f = await at(SC);
  //! \p built means "it has a SHAPE", and this one deliberately has not -
  //! what it has is mesh data, which is the whole point of the section.
  check("it runs without complaint", !f.error, f.error || "");
  check("and what it made is a mesh, not a shape",
        f.data && f.data.kind === "mesh", JSON.stringify(f.data && f.data.kind));
  check("eight vertices and six faces, as written",
        f.data && f.data.count === 8 && f.data.faces === 6,
        JSON.stringify(f.data));
  //! WHAT IT SAYS IT GIVES. The catalogue says a Script produces a solid;
  //! this one did not, and anything downstream has to be told the truth or
  //! a mesh input will refuse the wire.
  check("and it reports itself as producing a mesh", f.produces === "mesh", f.produces);

  const kid = (await under(SC))[0];
  check("the output carries the mesh too", kid && kid.produces === "mesh",
        kid ? kid.produces : "(no output)");
  check("and says how many vertices", /8 vertices/.test((kid || {}).note || ""),
        (kid || {}).note);

  //! THE POINT OF ALL OF IT: a mesh tool takes it, with no conversion node
  //! in between. A lattice is the one the request was about.
  const cage = (await mdl.run({ op: "add", type: "CageLattice", name: "Cage" })).id;
  await mdl.run({ op: "connect", id: cage, key: "mesh", from: kid.id, mode: "only" });
  const box = await at(cage);
  check("a cage lattice takes the script's mesh output straight in",
        box.built && !box.error, box.error || "");
  check("and its box is the prism's own, to the millimetre",
        /100 × 100 × 60 mm box/.test(box.note || ""), box.note);

  //! AND THE CREASES TRAVEL. They are on the mesh, not on the node that set
  //! them, so a Mesh to NURBS downstream reads them off whatever arrives.
  const nurbs = (await mdl.run({ op: "add", type: "MeshToNurbs", name: "Back to NURBS" })).id;
  await mdl.run({ op: "connect", id: nurbs, key: "mesh", from: kid.id, mode: "only" });
  const solid = await at(nurbs);
  check("and a Mesh to NURBS takes it as well", solid.built && !solid.error,
        solid.error || solid.note);
  //! Six patches, one per creased n-gon - which is the whole claim about
  //! creases: uncreased, the subdivision would round the box off and the
  //! patch count would not be six.
  check("coming back as the six flat faces it went in as, because of the creases",
        /\b6 NURBS patches/.test(solid.note || ""), solid.note);

  //! Taken out again. Section 7 drops the outputs these are wired to, which
  //! rightly cuts the wires, and section 8 would then be checking that a
  //! lattice with nothing wired in fails - which it should, and which is
  //! not what that section is about.
  await mdl.run({ op: "delete", id: nurbs });
  await mdl.run({ op: "delete", id: cage });
}

console.log("\n7. a script that publishes nothing is exactly as it was");
{
  await mdl.run({ op: "code", id: SC, key: "code", text: `({
    params: [{ key: "size", label: "Size", def: 30, min: 5, max: 90, step: 1 }],
    build(p, k) { return k.box(p.size, p.size, p.size); }
  })` });
  const f = await at(SC);
  check("it builds with no outputs declared", f.built && !f.error, f.error || "");
  check("and has no nodes under it", (await under(SC)).length === 0);
  check("and draws itself again, now there is nothing else to",
        f.visible !== false, String(f.visible));
  //! Said rather than assumed: `size` is one of the parameters that survived
  //! every edit above, so it holds what it was last set to and not the
  //! default this code declares. Keeping it is the right behaviour - see the
  //! script suite - and it is not what this section is about.
  await mdl.run({ op: "set", id: SC, key: "size", value: 30 });
  const got = await sizeOf(SC);
  check("and is the box it says it is", got && Math.abs(got.hi[0] - 30) < 1e-6,
        got ? String(got.hi[0]) : "(nothing)");
}

console.log("\n8. it survives the file");
{
  //! The Move is taken out first: section 6 dropped the outputs it was wired
  //! to and the document rightly cut the wire, so leaving it here would be
  //! checking that a Move with nothing wired in fails - which it should, and
  //! which is not what this section is about.
  await mdl.run({ op: "delete", id: MOVED });
  await mdl.run({ op: "code", id: SC, key: "code", text: TWO });
  const kids = (await under(SC)).map(f => f.id).join();
  const file = await kernel.model();
  const rows = file.features.filter(one => one.type === "Output");
  check("the output nodes are written into the file", rows.length === 2,
        JSON.stringify(rows.map(r => r.name)));
  check("each says which script and which output it is",
        rows.every(r => r.parent === SC && r.args && r.args.part),
        JSON.stringify(rows.map(r => ({ parent: r.parent, part: r.args && r.args.part }))));
  const back = await kernel.loadModel(file);
  check("and the file opens with nothing failed", back.report.failed.length === 0,
        JSON.stringify(back.report.failed.map(one => one.message)));
  check("the same nodes, not a second set", (await under(SC)).map(f => f.id).join() === kids,
        (await under(SC)).map(f => f.id).join() + " vs " + kids);
  check("and they built again",
        (await under(SC)).every(f => f.built && !f.error),
        (await under(SC)).map(f => f.error).filter(Boolean).join(" | "));
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
