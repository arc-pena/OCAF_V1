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
const made = await page.evaluate(async () => {
  const cage = await window.__cad.run({ op: "add", type: "MeshBox", name: "Cage" });
  const smooth = await window.__cad.run({ op: "add", type: "MeshToNurbs", name: "Smooth" });
  await window.__cad.run({ op: "connect", id: smooth.id, key: "mesh", from: cage.id });
  await window.__cad.run({ op: "set", id: smooth.id, key: "levels", value: 1 });
  return { cage: cage.id, smooth: smooth.id };
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
for (const label of ["Mesh", "Refine first", "Open edges", "Sewing tolerance", "Make"])
  check("the panel offers " + JSON.stringify(label), panel.includes(label));

await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1200);
await page.screenshot({ path: D + "tonurbs.png" });

// And the comparison that makes the point: the faceted conversion of the same
// cage at the same level, side by side.
await page.evaluate(async (ids) => {
  await window.__cad.run({ op: "set", id: ids.smooth, key: "levels", value: 0 });
}, made);
await page.waitForTimeout(2500);
await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1000);
await page.screenshot({ path: D + "tonurbs-level0.png" });

check("no page errors", errs.length === 0, errs.join(" | "));
log(bad ? "\n" + bad + " FAILED" : "\nall good");
await browser.close();
process.exit(bad ? 1 : 0);
