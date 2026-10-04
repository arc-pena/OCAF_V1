// THE RENDER BAR: does the button toggle it, and does pause mean pause.
//
// Split out of the Nano Banana drive, which asked for the path tracer in an
// 1100 x 760 window and timed out after ten minutes without ever getting a
// first sample. That is not a fault in the page: SwiftShader costs about 20
// microseconds a pixel a sample and the engine's first act is to compile one
// very large shader, so the window size IS the measurement here. Small on
// purpose. None of these timings say anything about a real GPU.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "pausebar.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 360, height: 280 } });
page.setDefaultTimeout(600000);
const errs = [];
page.on("pageerror", e => errs.push(String(e.message).slice(0, 220)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });
await page.goto("http://127.0.0.1:8199/index.html", { waitUntil: "commit" });
await page.waitForFunction(() => document.querySelectorAll("#tree .node").length > 0);
await page.evaluate(async () => {
  const o = await window.__cad.run({ op: "add", type: "Point" });
  const c = await window.__cad.run({ op: "add", type: "Cube", refs: { origin: o.id } });
  for (const k of ["dx", "dy", "dz"])
    await window.__cad.run({ op: "set", id: c.id, key: k, value: 400 });
});
await page.waitForTimeout(2500);
log("starting the engine (minutes, on this machine)…");
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForFunction(() => window.__cad.showroomReady && window.__cad.showroomReady(),
                           null, { timeout: 900000 });
await page.waitForTimeout(1500);

const barUp = () => page.evaluate(() => !document.getElementById("trace-bar").hidden);
const count = () => page.evaluate(() => window.__cad.samples());
const readout = () => page.evaluate(() =>
  document.getElementById("trace-count").textContent);

log("\n1. the raytrace button toggles its bar, the way Arctic's does");
check("entering Ray traced puts the bar up", await barUp());
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForTimeout(400);
check("pressing it again puts the bar away", !(await barUp()));
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForTimeout(400);
check("and again brings it back", await barUp());
//! AND IT DID NOT TOUCH THE TRACE. A panel about a thing that is running must
//! not switch the thing off, or crossing it becomes a destructive act.
const beforeToggle = await count();
await page.evaluate(() => window.__cad.style("raytraced"));
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForTimeout(2500);
check("and putting it away does not stop the trace",
      (await count()) >= beforeToggle, beforeToggle + " -> " + (await count()));

log("\n2. pause means pause, and play means from the model as it is");
const running = await count();
await page.waitForTimeout(5000);
check("it is collecting", (await count()) > running,
      running + " -> " + (await count()));
const atPause = await count();
await page.evaluate(() => document.getElementById("trace-run").click());
await page.waitForTimeout(6000);
const held = await count();
check("pause holds the count", Math.abs(held - atPause) <= 1,
      atPause + " -> " + held);
check("the readout says paused", /paused/.test(await readout()), await readout());
check("and the button offers play", await page.evaluate(() =>
  document.getElementById("trace-run").getAttribute("aria-pressed") === "false"
  && document.getElementById("trace-run").textContent.includes("▶")),
  await page.evaluate(() => document.getElementById("trace-run").textContent));

//! THE INTERACTION THAT MATTERED, and the reason pause is not just a flag on
//! the engine. An edit while paused used to rebuild the traced scene, which
//! throws the average away - so pausing and then editing destroyed the very
//! frame pause was pressed to keep, and left nothing collecting to replace it.
await page.evaluate(async () => {
  const cube = window.__cad.packages().kit.tree().features.find(f => f.type === "Cube");
  await window.__cad.run({ op: "set", id: cube.id, key: "dy", value: 520 });
});
await page.waitForTimeout(3000);
const afterEdit = await count();
check("an edit while paused does not destroy the held picture",
      Math.abs(afterEdit - held) <= 1, held + " -> " + afterEdit);
check("but the readout admits the model has moved on",
      /model has changed/.test(await readout()), await readout());
await page.evaluate(() => document.getElementById("trace-run").click());
await page.waitForTimeout(5000);
check("play collects again", (await count()) > 0 && !/paused/.test(await readout()),
      await readout());

log("\n3. and a pause survives a trip through another style");
await page.evaluate(() => document.getElementById("trace-run").click());
await page.waitForTimeout(600);
await page.evaluate(() => window.__cad.style("shaded"));
await page.waitForTimeout(1200);
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForTimeout(5000);
check("it comes back still paused", /paused/.test(await readout()), await readout());
await page.evaluate(() => document.getElementById("trace-run").click());
await page.waitForTimeout(3000);
check("and play still works afterwards", !/paused/.test(await readout()), await readout());

log("\nerrors: " + (errs.length ? errs.slice(0, 5).join(" | ") : "none"));
if (errs.length) bad++;
await browser.close();
log(bad ? "\n" + bad + " check(s) failed" : "\nall checks passed");
log("=== pausebar drive done ===");
