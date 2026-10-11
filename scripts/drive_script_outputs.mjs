// THE OUTPUTS, IN THE PAGE. Three claims that cannot be checked anywhere but
// here: the rows are IN the tree under the script, the nodes are IN the graph
// with wires you can drop on, and the city is drawn ONCE - the script having
// stood down in favour of the pieces it published.
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
  return t && t.features.some(f => f.type === "Output");
}, null, { timeout: 600000 });
await page.waitForTimeout(4000);

const rows = await page.evaluate(() => window.__cad.tree().features.map(f =>
  ({ id: f.id, type: f.type, name: f.name, parent: f.parent || null,
     visible: f.visible, built: !!f.built, error: f.error || null })));
log("the document: " + rows.map(f => f.id + (f.parent ? "<" + f.parent : "")).join(" "));
const outs = rows.filter(f => f.type === "Output");
check("the script published three outputs", outs.length === 3,
      outs.map(f => f.name).join(", "));
check("and they are filed under it", outs.every(f => f.parent === "PLAN"));
check("they all built", outs.every(f => f.built && !f.error),
      outs.map(f => f.error).filter(Boolean).join(" | "));
check("the script itself stands down from the view",
      rows.find(f => f.id === "PLAN").visible === false);

//! THE TREE, as a reader sees it: the three names have to be ON SCREEN,
//! indented under the script. Read off the markup rather than off the model,
//! because the branch is drawn only for a container and these are under a
//! body - which is exactly the line that had to change.
const tree = await page.evaluate(() => {
  const li = [...document.querySelectorAll("#tree li.holds")]
    .find(one => one.textContent.includes("Octagon masterplan"));
  if (!li) return null;
  return { under: [...li.querySelectorAll(".branch .node")]
             .map(n => n.textContent.replace(/\s+/g, " ").trim().slice(0, 30)) };
});
log("tree: " + JSON.stringify(tree));
check("the tree draws them under the script", !!tree && tree.under.length >= 3,
      tree ? tree.under.join(" | ") : "the script has no branch in the tree");

//! DRAWN ONCE. The three outputs are the same geometry as the script's own,
//! so if both are on screen every face is there twice - which costs twice
//! and flickers where the copies meet, and which no screenshot would show.
const drawn = await page.evaluate(() => {
  const out = [];
  for (const [id, held] of window.__cad.shapes) {
    const g = held.group || held;
    let tris = 0;
    g.traverse(o => {
      if (o.isMesh && o.geometry && o.geometry.attributes.position) {
        const i = o.geometry.index;
        tris += (i ? i.count : o.geometry.attributes.position.count) / 3;
      }
    });
    if (tris) out.push({ id, tris, visible: g.visible });
  }
  return out;
});
log("drawn: " + JSON.stringify(drawn));
const onScreen = drawn.filter(one => one.visible).reduce((n, one) => n + one.tris, 0);
check("the city is on screen once, not twice",
      onScreen > 1000 && onScreen < 3000, onScreen + " triangles");
check("and it is the outputs that are drawing it",
      drawn.filter(one => one.visible).every(one => one.id !== "PLAN"),
      drawn.filter(one => one.visible).map(one => one.id).join(","));

await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1500);
await page.screenshot({ path: D + "outputs-tree.png" });

//! AND ONE OF THEM, FED TO SOMETHING ELSE - which is the request. The massing
//! is moved 300 m east; the squares and the setting out must stay where they
//! are, which is what tells "the massing alone" from "the whole plan".
const before = await page.evaluate(() => {
  const held = window.__cad.shapes.get("PLAN");
  return !!held;
});
const moved = await page.evaluate(async () => {
  const outs = window.__cad.tree().features.filter(f => f.type === "Output");
  const massing = outs.find(f => f.name === "Massing");
  const plazas = outs.find(f => f.name === "Plazas");
  const vec = await window.__cad.run({ op: "add", type: "Vector", name: "East" });
  await window.__cad.run({ op: "set", id: vec.id, key: "dx", value: 1 });
  await window.__cad.run({ op: "set", id: vec.id, key: "dy", value: 0 });
  await window.__cad.run({ op: "set", id: vec.id, key: "dz", value: 0 });
  const mv = await window.__cad.run({ op: "add", type: "Move", name: "Shifted massing" });
  await window.__cad.run({ op: "connect", id: mv.id, key: "shape", from: massing.id });
  await window.__cad.run({ op: "connect", id: mv.id, key: "direction", from: vec.id });
  await window.__cad.run({ op: "set", id: mv.id, key: "distance", value: 300000 });
  return { mv: mv.id, massing: massing.id, plazas: plazas.id };
});
await page.waitForTimeout(5000);
const after = await page.evaluate((ids) => {
  const span = id => {
    const held = window.__cad.shapes.get(id);
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
    return { lo: Math.round(lo / 1000), hi: Math.round(hi / 1000), tris,
             visible: g.visible };
  };
  const f = window.__cad.entry(ids.mv);
  return { move: span(ids.mv), massing: span(ids.massing), plazas: span(ids.plazas),
           error: (f || {}).error || null };
}, moved);
log("after the move: " + JSON.stringify(after));
check("the Move took the massing output", !after.error, after.error || "");
check("the moved massing is 300 m east of the site",
      after.move && after.move.lo > 330 && after.move.lo < 350,
      after.move ? after.move.lo + ".." + after.move.hi + " m" : "(nothing built)");
check("the massing output stood down, having been eaten",
      after.massing && after.massing.visible === false,
      JSON.stringify(after.massing));
check("and the squares did not move with it",
      after.plazas && after.plazas.visible && after.plazas.lo < 100,
      JSON.stringify(after.plazas));

await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1500);
await page.screenshot({ path: D + "outputs-moved.png" });

//! THE GRAPH: the outputs are nodes with ports, at the top level, which is
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
check("the graph has the outputs on it as nodes of their own",
      !!graph && graph.nodes.filter(n => /Massing|Plazas|Setting/.test(n)).length === 3,
      graph ? graph.nodes.join(" | ") : "no graph");
await page.waitForTimeout(600);
await page.screenshot({ path: D + "outputs-graph.png" });

check("no page errors", errs.length === 0, errs.join(" | "));
log(bad ? "\n" + bad + " FAILED" : "\nall good");
await browser.close();
process.exit(bad ? 1 : 0);
