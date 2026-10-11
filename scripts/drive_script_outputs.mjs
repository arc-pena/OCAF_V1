// THE OUTPUTS AND THE CAGE OVER THEM, IN THE PAGE.
//
// Four claims that cannot be checked anywhere but here: the rows are IN the
// tree under the script, the nodes are IN the graph with ports you can drop a
// wire on, the city is drawn ONCE - the script having stood down in favour of
// the pieces it published - and the cage edit on top overrides the massing
// while leaving the squares where they are.
//
// Shaded, not traced: there is nothing here that needs a path trace, and on
// this machine a trace costs five seconds a sample.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/claude-0/";
const LOG = D + "outputs.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
page.setDefaultTimeout(600000);
const errs = [];
page.on("pageerror", e => errs.push(String(e.message).slice(0, 200)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });
const SITE = process.env.DRIVE_URL || "http://127.0.0.1:8199/index.html";
await page.goto(SITE + "#octagon-plan", { waitUntil: "commit" });
await page.waitForFunction(() => {
  const t = window.__cad && window.__cad.tree && window.__cad.tree();
  return t && t.features.some(f => f.id === "MORPH" && f.built);
}, null, { timeout: 600000 });
await page.waitForTimeout(4000);

const rows = await page.evaluate(() => window.__cad.tree().features.map(f =>
  ({ id: f.id, type: f.type, name: f.name, parent: f.parent || null,
     visible: f.visible, built: !!f.built, error: f.error || null,
     produces: f.produces, preview: (f.data || {}).preview || null,
     note: f.note || null, consumedBy: f.consumedBy || null })));
log("the document: " + rows.map(f => f.id + (f.parent ? "<" + f.parent : "")).join(" "));
check("the sample opened whole", rows.length === 19, String(rows.length));
check("nothing in it is in error", rows.every(f => !f.error),
      rows.filter(f => f.error).map(f => f.id + ": " + f.error).join(" | "));
const outs = rows.filter(f => f.type === "Output");
check("the script published three outputs", outs.length === 3,
      outs.map(f => f.name).join(", "));
check("and they are filed under it", outs.every(f => f.parent === "PLAN"));
check("the script itself stands down from the view",
      rows.find(f => f.id === "PLAN").visible === false);

//! THE CAGE, read off its own note rather than off the code: the box it made
//! is the MASSING's bounding box, which is the half of the request that says
//! a lattice needs nothing but extents.
const cage = rows.find(f => f.id === "CAGE");
log("cage: " + cage.note);
check("the lattice took the massing, which is a solid, straight in",
      /control points round a/.test(cage.note || ""), cage.note);
check("and its box is the input's own bounding box",
      /the input's own bounding box/.test(cage.note || ""), cage.note);
const morph = rows.find(f => f.id === "MORPH");
log("morph: " + morph.note);
//! NOTHING WAS TESSELLATED. The script builds n-gons, so what reaches the
//! morph is already a mesh - the note says "tessellated here" only when it
//! had to make one out of a body, and here it did not.
check("the morph took the massing's mesh as it was, with nothing to convert",
      !/tessellated here/.test(morph.note || ""), morph.note);
const massOut = rows.find(f => f.id === "O_MASS");
log("the massing output: gives " + massOut.produces + " · " + massOut.preview);
check("the massing output is a mesh and says so", massOut.produces === "mesh",
      massOut.produces);
check("and carries the arrises, so a conversion back would keep them",
      /creased edges/.test(massOut.preview || ""), massOut.preview);
check("while the setting out is curves, which a mesh cannot carry",
      rows.find(f => f.id === "O_SET").produces === "solid",
      rows.find(f => f.id === "O_SET").produces);
check("and the plan itself is a mesh, not a pile of solids",
      rows.find(f => f.id === "PLAN").produces === "mesh",
      rows.find(f => f.id === "PLAN").produces);
check("and the cage actually moved it",
      /control points moved/.test(morph.note || "")
      && !/THE CAGE HAS NOT MOVED/.test(morph.note || ""), morph.note);

//! WHAT IS ON SCREEN. The morph has eaten the massing, so the massing is not
//! drawn; the squares and the setting out are not in the cage and are.
const span = (id) => page.evaluate((one) => {
  const held = window.__cad.shapes.get(one);
  if (!held) return null;
  const g = held.group || held;
  let lo = Infinity, hi = -Infinity, tris = 0;
  g.updateWorldMatrix(true, true);
  g.traverse(o => {
    if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    o.updateWorldMatrix(true, false);
    const e = o.matrixWorld.elements, pos = o.geometry.attributes.position;
    const i = o.geometry.index;
    tris += (i ? i.count : pos.count) / 3;
    for (let k = 0; k < pos.count; k++) {
      const x = e[0] * pos.getX(k) + e[4] * pos.getY(k) + e[8] * pos.getZ(k) + e[12];
      if (x < lo) lo = x;
      if (x > hi) hi = x;
    }
  });
  return { lo: Math.round(lo / 100) / 10, hi: Math.round(hi / 100) / 10, tris,
           visible: g.visible };
}, id);
const massing = await span("O_MASS"), morphed = await span("MORPH");
const squares = await span("O_PLAZ");
log("east edges — massing " + JSON.stringify(massing) + " morphed "
  + JSON.stringify(morphed) + " squares " + JSON.stringify(squares));
check("the massing has stood down, the morph having eaten it",
      massing && massing.visible === false, JSON.stringify(massing));
check("the morph is what is drawn in its place",
      morphed && morphed.visible && morphed.tris > 1000, JSON.stringify(morphed));
check("and it reaches further east than the massing did, which is the pull",
      morphed && massing && morphed.hi > massing.hi + 5,
      massing && morphed ? massing.hi + " -> " + morphed.hi + " m" : "(nothing)");
check("while the squares, which are not in the cage, have not moved",
      squares && squares.visible && Math.abs(squares.hi - 519.5) < 1,
      JSON.stringify(squares));
//! AND THE CAGE IS NOT ON TOP OF IT. A lattice is a box the size of the
//! whole city, shaded like everything else, and the first screenshot of this
//! sample was exactly that: a grey box with the site boundary peeping out
//! from under it. It is put away in the file; the eye in the tree is how you
//! get it back.
const cageDrawn = await span("CPULL");
check("and the cage itself is put away, not sitting over the city",
      !cageDrawn || !cageDrawn.visible, JSON.stringify(cageDrawn));

await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1500);
await page.screenshot({ path: D + "outputs-moved.png" });

//! THE RESET, both of them. The pull back to nought puts the morph back to
//! the plan - the cage is then the same cage in both inputs, which the morph
//! says out loud rather than quietly doing nothing. And the lattice's own
//! box, taken off the input and typed and put back, is the other one.
await page.evaluate(async () => {
  await window.__cad.run({ op: "set", id: "CPULL", key: "distance", value: 0 });
});
await page.waitForTimeout(4000);
const still = await span("MORPH");
const quiet = await page.evaluate(() => (window.__cad.entry("MORPH") || {}).note);
log("with the pull at nought: " + JSON.stringify(still) + "  note: " + quiet);
check("taking the pull to nought puts the massing back where it was",
      still && massing && Math.abs(still.hi - massing.hi) < 1,
      still ? still.hi + " against " + massing.hi + " m" : "(nothing)");
check("and the morph says the cage has not moved rather than going quiet",
      /THE CAGE HAS NOT MOVED/.test(quiet || ""), quiet);
await page.evaluate(async () => {
  await window.__cad.run({ op: "set", id: "CPULL", key: "distance", value: 45000 });
});
await page.waitForTimeout(3500);

const boxes = await page.evaluate(async () => {
  const note = () => (window.__cad.entry("CAGE") || {}).note || "";
  const was = note();
  await window.__cad.run({ op: "set", id: "CAGE", key: "fit", value: 1 });
  await window.__cad.run({ op: "set", id: "CAGE", key: "sizeX", value: 900000 });
  await window.__cad.run({ op: "set", id: "CAGE", key: "sizeY", value: 900000 });
  await window.__cad.run({ op: "set", id: "CAGE", key: "sizeZ", value: 400000 });
  await new Promise(r => setTimeout(r, 2500));
  const typed = note();
  await window.__cad.run({ op: "set", id: "CAGE", key: "fit", value: 0 });
  await new Promise(r => setTimeout(r, 2500));
  return { was, typed, back: note(),
           kept: (window.__cad.entry("CAGE") || {}).values.sizeY };
});
log("box: " + JSON.stringify(boxes));
check("a typed size holds the cage still",
      /900000 × 900000 × 400000 mm box/.test(boxes.typed)
      && /does not follow the input/.test(boxes.typed), boxes.typed);
check("and putting Box back on the bounding box is the reset",
      boxes.back === boxes.was, boxes.back);
check("with the typed size kept, not thrown away", boxes.kept === 900000,
      String(boxes.kept));

await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1500);
await page.screenshot({ path: D + "outputs-cage.png" });

//! THE GRAPH: the outputs and the cage chain as nodes with ports, which is
//! what "as outputs i can feed to another element" means in that window.
const graph = await page.evaluate(async () => {
  const btn = document.getElementById("btn-graph");
  if (!btn) return null;
  btn.click();
  await new Promise(r => setTimeout(r, 1500));
  const host = document.querySelector(".g-root");
  if (!host) return null;
  const press = want => {
    const b = [...document.querySelectorAll(".g-btn")]
      .find(one => one.textContent.trim().toLowerCase().includes(want));
    if (b) b.click();
  };
  press("tidy");
  await new Promise(r => setTimeout(r, 2500));
  press("fit");
  await new Promise(r => setTimeout(r, 900));
  return { nodes: [...host.querySelectorAll(".g-node")]
             .map(n => (n.querySelector(".g-head") || n).textContent.replace(/\s+/g, " ").trim().slice(0, 24)),
           wires: host.querySelectorAll(".g-wires path").length };
});
log("graph: " + JSON.stringify(graph));
check("the graph has every node on it, outputs and cage alike",
      !!graph && graph.nodes.length === 19, graph ? String(graph.nodes.length) : "no graph");
//! BY ID, not by name: "Massing" is also in "Massing, morphed" and in "Cage
//! round the massing", so matching on the word counted five of three.
check("and the outputs are nodes of their own",
      !!graph && ["O_MASS", "O_PLAZ", "O_SET"]
        .every(id => graph.nodes.some(n => n.endsWith(id))),
      graph ? graph.nodes.join(" | ") : "");
await page.waitForTimeout(600);
await page.screenshot({ path: D + "outputs-graph.png" });

check("no page errors", errs.length === 0, errs.join(" | "));
log(bad ? "\n" + bad + " FAILED" : "\nall good");
await browser.close();
process.exit(bad ? 1 : 0);
