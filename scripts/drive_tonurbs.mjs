// MESH TO NURBS, in the page rather than in a test: does the node appear, does
// it build, and does what comes back look like a smooth body rather than the
// cage it came from.
//
// The test suite proves the arithmetic against the subdivision and the volume
// against the faceted conversion. What it cannot prove is that the node is
// reachable, that the panel draws its arguments, and that the result goes down
// the viewport pipe - which are three different ways for correct maths to
// arrive as an empty screen. Shaded, not traced: there is nothing here that
// needs a path trace, and a path trace on this machine costs five seconds a
// sample.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "tonurbs.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 900, height: 620 } });
page.setDefaultTimeout(300000);
const errs = [];
page.on("pageerror", e => errs.push(String(e.message).slice(0, 220)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });
await page.goto("http://127.0.0.1:8199/index.html", { waitUntil: "commit" });
await page.waitForFunction(() => document.querySelectorAll("#tree .node").length > 0);

//! Adding it IS the catalogue check: an unknown type throws by name, so a node
//! that never reached the page cannot get past this line.
//! THE CHAIN SOMEBODY ACTUALLY BUILDS, and the point of this drive: a cage,
//! creases put on it where they are editing it, and the converter straight
//! after. No Subdivide node anywhere - the Catmull-Clark is inside the
//! converter. A Subdivide is still allowed in front of it and is read back
//! past, which section 11 of the suite covers; what is checked HERE is that
//! nobody has to put one there.
const made = await page.evaluate(async () => {
  const cage = await window.__cad.run({ op: "add", type: "MeshBox", name: "Cage" });
  const edit = await window.__cad.run({ op: "add", type: "EditMesh", name: "Creased" });
  await window.__cad.run({ op: "connect", id: edit.id, key: "mesh", from: cage.id });
  const smooth = await window.__cad.run({ op: "add", type: "MeshToNurbs", name: "Smooth" });
  await window.__cad.run({ op: "connect", id: smooth.id, key: "mesh", from: edit.id });
  return { cage: cage.id, edit: edit.id, smooth: smooth.id };
});

await page.waitForTimeout(3000);

const entry = await page.evaluate(id => {
  const f = window.__cad.entry(id);
  return f && { built: f.built, error: f.error, note: f.note, produces: f.produces };
}, made.smooth);
log("note: " + (entry && entry.note));
check("it built in the page", entry && entry.built && !entry.error, entry && entry.error);
check("and the note carries the honest number",
      /out of tangent|IS the limit surface/.test((entry && entry.note) || ""));
check("six patches - the cage's topology, not the subdivided mesh's",
      /\b6 NURBS patches/.test((entry && entry.note) || ""), entry && entry.note);

// The triangles the viewport was handed: a body that built but never reached
// the screen is the failure that looks most like success.
const drawn = await page.evaluate(id => {
  const held = window.__cad.shapes.get(id);
  if (!held) return -1;
  let tris = 0;
  const group = held.group || held;
  group.traverse && group.traverse(o => {
    if (o.isMesh && o.geometry && o.geometry.attributes && o.geometry.attributes.position)
      tris += (o.geometry.index ? o.geometry.index.count
                                : o.geometry.attributes.position.count) / 3;
  });
  return tris;
}, made.smooth);
check("and it reached the viewport as triangles", drawn > 100, Math.round(drawn) + " triangles");

//! The panel, asked the way a person reads it rather than by its markup: the
//! argument labels have to be ON SCREEN, because an accuracy dial nobody can
//! reach is the same as not having one.
const panel = await page.evaluate(id => {
  window.__cad.select(id);
  const box = document.getElementById("def");
  return box ? box.textContent.replace(/\s+/g, " ") : "";
}, made.smooth);
log("panel reads: " + panel.slice(0, 200));
for (const label of ["Mesh", "Refine first", "Open edges", "Sewing tolerance", "Make", "Convert"])
  check("the panel offers " + JSON.stringify(label), panel.includes(label));

await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1200);
await page.screenshot({ path: D + "tonurbs.png" });

// And the comparison that makes the point: the faceted conversion of the same
// cage at the same level, side by side.
//! And the creases, put on from the mesh editor the way a person would, with
//! the converter already downstream of it - so what the screenshot shows is a
//! cage, a crease and a B-Rep, with no subdivision node in the chain.
await page.evaluate(async (ids) => {
  await window.__cad.run({ op: "meshop", id: ids.edit, ops: [
    { op: "crease", level: "edge", at: ["4,5", "5,6", "6,7", "4,7"], args: { amount: 1 } },
  ] });
}, made);
await page.waitForTimeout(3000);
await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1200);
await page.screenshot({ path: D + "tonurbs-creased.png" });
const creased = await page.evaluate(id => (window.__cad.entry(id) || {}).note, made.smooth);
log("creased note: " + creased);
check("it still builds with creases on the cage", /NURBS patch/.test(creased || ""), creased);

//! AND THE POINT OF THE REFINEMENT DIAL: it buys smoothness and costs no
//! faces. Six patches at level 0 and six at level 3, each divided 8x8 inside.
for (const levels of [1, 3]) {
  await page.evaluate(async (at) => {
    await window.__cad.run({ op: "set", id: at.id, key: "levels", value: at.levels });
  }, { id: made.smooth, levels });
  await page.waitForTimeout(4000);
  const note = await page.evaluate(id => (window.__cad.entry(id) || {}).note, made.smooth);
  log("levels " + levels + ": " + note);
  const span = 1 << levels;
  check("level " + levels + " is still six patches, " + span + "x" + span + " spans each",
        new RegExp("^6 NURBS patches of " + span + "\\u00d7" + span + " spans").test(note || ""),
        note);
}

check("no page errors", errs.length === 0, errs.join(" | "));
log(bad ? "\n" + bad + " FAILED" : "\nall good");
await browser.close();
process.exit(bad ? 1 : 0);
