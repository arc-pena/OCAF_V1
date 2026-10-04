// WHAT THROWS THE TRACE AWAY.
//
// An idle trace does not stop - measured: 23 rises, no falls, 48 seconds. So
// whatever a person is seeing as "it pauses on its own" is something they did.
// The suspect is refreshTrace(), which rebuilds the whole traced scene and
// therefore resets the average to zero. It is called from applyState, so EVERY
// rebuild resets it - and a rebuild happens on edits that cannot change the
// picture at all, like renaming a node.
//
// This does one thing at a time and reads the count before and after. A count
// that goes back to 0 for something that did not change the picture is work
// thrown away, and from the outside it is indistinguishable from a stall.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "resets.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 320, height: 240 } });
page.setDefaultTimeout(900000);
const errs = [];
page.on("pageerror", e => errs.push(String(e.message).slice(0, 200)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });
await page.goto("http://127.0.0.1:8199/index.html", { waitUntil: "commit" });
await page.waitForFunction(() => document.querySelectorAll("#tree .node").length > 0);

const ids = await page.evaluate(async () => {
  const o = await window.__cad.run({ op: "add", type: "Point" });
  const c = await window.__cad.run({ op: "add", type: "Cube", refs: { origin: o.id } });
  for (const k of ["dx", "dy", "dz"])
    await window.__cad.run({ op: "set", id: c.id, key: k, value: 400 });
  const p2 = await window.__cad.run({ op: "add", type: "Point" });
  await window.__cad.run({ op: "set", id: p2.id, key: "x", value: 900 });
  const c2 = await window.__cad.run({ op: "add", type: "Cube", refs: { origin: p2.id } });
  for (const k of ["dx", "dy", "dz"])
    await window.__cad.run({ op: "set", id: c2.id, key: k, value: 300 });
  return { cube: c.id, other: c2.id };
});
await page.waitForTimeout(2500);
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForFunction(() => window.__cad.showroomReady && window.__cad.showroomReady(),
                           null, { timeout: 600000 });

const samples = () => page.evaluate(() => window.__cad.samples());
//! Let it get a count worth losing, so a reset is unmistakable.
const settle = async (seconds = 12) => {
  await page.waitForTimeout(seconds * 1000);
  return await samples();
};

async function trial(what, doIt) {
  const before = await settle(12);
  await doIt();
  await page.waitForTimeout(2500);
  const after = await samples();
  log(what.padEnd(34) + " " + String(before).padStart(4) + " -> "
      + String(after).padStart(4) + (after < before ? "   THROWN AWAY" : "   kept"));
}

//! THINGS THAT CANNOT CHANGE THE PICTURE. Each of these goes through the same
//! rebuild as a geometry change, and the trace should not care about any.
await trial("renaming a node", () =>
  page.evaluate(id => window.__cad.run({ op: "rename", id, name: "Renamed " + Date.now() }),
                ids.other));
await trial("selecting a body", () =>
  page.evaluate(id => window.__cad.select(id), ids.other));
await trial("opening the tree's menu", () =>
  page.evaluate(() => { const n = document.querySelector("#tree .node"); if (n) n.click(); }));

//! AND THINGS THAT DO. These SHOULD reset, and are here so that the test can
//! tell "throws nothing away" from "throws everything away".
await trial("moving the camera", () => page.evaluate(() => window.__cad.turn(0.3)));
await trial("changing a size", () =>
  page.evaluate(id => window.__cad.run({ op: "set", id, key: "dx", value: 460 }), ids.cube));
await trial("hiding a body", () =>
  page.evaluate(id => window.__cad.run({ op: "shown", id, on: false }), ids.other));

log("errors: " + (errs.length ? errs.slice(0, 4).join(" | ") : "none"));
await browser.close();
log("=== resets drive done ===");
