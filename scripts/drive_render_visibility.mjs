// FOUR REPORTED FAULTS, each measured rather than looked at.
//
//  1. a hidden body still rendered in the ray trace
//  2. the render bar came back only on the first entry into Ray traced
//  3. panels were BEHIND the Nano Banana image
//  4. Tab should take the panels away and leave the render
//
// Three of the four are only visible in a running page: one is a z-index, one
// is a CSS fade, and one depends on which branch of a function was reached on
// a second visit. None of them is readable from the source with any
// confidence, which is why this exists.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "setcase.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
//! Small, because section 1 needs the path tracer and the engine's first act
//! is a very large shader compile. See CLAUDE.md: a big window here measures
//! SwiftShader, not the page.
const page = await browser.newPage({ viewport: { width: 420, height: 320 } });
page.setDefaultTimeout(900000);
const errs = [];
page.on("pageerror", e => errs.push(String(e.message).slice(0, 220)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });
await page.goto("http://127.0.0.1:8199/index.html", { waitUntil: "commit" });
await page.waitForFunction(() => document.querySelectorAll("#tree .node").length > 0);

//! TWO bodies, far apart, so "is it in the render" is answered by the
//! renderer's own part list rather than by looking at a noisy picture.
const ids = await page.evaluate(async () => {
  const made = {};
  const o = await window.__cad.run({ op: "add", type: "Point" });
  const a = await window.__cad.run({ op: "add", type: "Cube", refs: { origin: o.id } });
  for (const k of ["dx", "dy", "dz"])
    await window.__cad.run({ op: "set", id: a.id, key: k, value: 300 });
  const p2 = await window.__cad.run({ op: "add", type: "Point" });
  await window.__cad.run({ op: "set", id: p2.id, key: "x", value: 900 });
  const b = await window.__cad.run({ op: "add", type: "Cube", refs: { origin: p2.id } });
  for (const k of ["dx", "dy", "dz"])
    await window.__cad.run({ op: "set", id: b.id, key: k, value: 300 });
  made.a = a.id; made.b = b.id;
  return made;
});
await page.waitForTimeout(3000);
log("starting the engine (minutes, on this machine)…");
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForFunction(() => window.__cad.showroomReady && window.__cad.showroomReady(),
                           null, { timeout: 900000 });
await page.waitForTimeout(2000);

const inRender = id => page.evaluate(which => !!window.__cad.renderParts(which), id);

log("\n1. a hidden body is not in the ray trace");
check("both bodies are in the render to begin with",
      (await inRender(ids.a)) && (await inRender(ids.b)));
//! Through the hide set - the eye in the tree - which is a different thing
//! from the document's own `visible` flag. The trace only ever read the
//! second, which is the whole fault.
await page.evaluate(id => window.__cad.hide(id, true), ids.b);
await page.waitForTimeout(3000);
check("hiding one takes it out of the render", !(await inRender(ids.b)),
      (await inRender(ids.b)) ? "still there" : "gone");
check("and leaves the other alone", await inRender(ids.a));
await page.evaluate(id => window.__cad.hide(id, false), ids.b);
await page.waitForTimeout(3000);
check("showing it again puts it back", await inRender(ids.b));

//! AND A SET, because hiddenHere walks up to the parents: switching off a set
//! has to take its contents out of the trace too.
const set = await page.evaluate(async which => {
  const made = await window.__cad.run({ op: "add", type: "GeometricalSet" });
  //! `group`, which is the op's real name - "file a feature under a set".
  await window.__cad.run({ op: "group", id: which, into: made.id });
  return made.id;
}, ids.b).catch(() => null);
if (set) {
  await page.waitForTimeout(2500);
  const filed = await page.evaluate(([one, where]) => {
    const f = window.__cad.packages().kit.tree().features.find(x => x.id === one);
    return f && f.parent === where;
  }, [ids.b, set]);
  if (filed) {
    await page.evaluate(id => window.__cad.hide(id, true), set);
    await page.waitForTimeout(3000);
    check("hiding a SET takes what is inside it out too", !(await inRender(ids.b)),
          (await inRender(ids.b)) ? "still there" : "gone");
    await page.evaluate(id => window.__cad.hide(id, false), set);
    await page.waitForTimeout(2500);
  } else log("  --   the body would not file into a set, skipped");
} else log("  --   no way to file into a set here, skipped");

log("\n2. the render bar comes back on EVERY entry, not just the first");
const barUp = () => page.evaluate(() => !document.getElementById("trace-bar").hidden);
check("it is up now", await barUp());
//! THE CASE THAT WAS BROKEN: cross it, leave the style, come back. The bar
//! was built on the first entry and only shown by the code that built it, so
//! the second entry left it hidden with its "put away" flag already cleared -
//! which made the next press of the button toggle it to away and look dead.
await page.evaluate(() => document.querySelector("#trace-bar .panel-shut").click());
await page.waitForTimeout(400);
check("the cross puts it away", !(await barUp()));
await page.evaluate(() => window.__cad.style("shaded"));
await page.waitForTimeout(1200);
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForTimeout(3000);
check("coming back into Ray traced brings it back", await barUp());
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForTimeout(400);
check("pressing the button again puts it away", !(await barUp()));
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForTimeout(400);
check("and again brings it back", await barUp());

log("\n3. every panel draws OVER the Nano Banana image");
const PNG = readFileSync("/tmp/claude-0/stub.png").toString("base64");
await page.evaluate(() => document.querySelector(".nb-tab").click());
await page.waitForTimeout(400);
await page.evaluate(b64 => {
  window.fetch = async () => ({ status: 200, text: async () =>
    JSON.stringify({ interaction: { outputImage: { data: b64 } } }) });
  const key = document.querySelector(".nb-key");
  key.value = "k"; key.dispatchEvent(new Event("input"));
  const p = document.querySelector(".nb-prompt");
  p.value = "an evening photograph"; p.dispatchEvent(new Event("input"));
}, PNG);
await page.evaluate(() => document.querySelector(".nb-send").click());
await page.waitForTimeout(2500);
check("the image is up", await page.evaluate(() =>
  !document.querySelector(".nb-over").hidden));
//! WHAT IS ACTUALLY ON TOP, asked of the browser rather than worked out from
//! the stylesheet. elementFromPoint is the one answer that cannot be wrong
//! about stacking.
const onTop = await page.evaluate(() => {
  const out = {};
  const over = document.querySelector(".nb-over");
  const zOver = Number(getComputedStyle(over).zIndex);
  out.image = zOver;
  //! Every panel that floats over the model, and whether it is in front.
  out.behind = [];
  for (const panel of document.querySelectorAll(".float, #tree-panel, #def-panel, #rail")) {
    if (panel.hidden || !panel.offsetWidth) continue;
    const z = Number(getComputedStyle(panel).zIndex);
    if (Number.isFinite(z) && z <= zOver)
      out.behind.push((panel.id || panel.className.split(" ").pop()) + "@" + z);
  }
  //! And the real test: point at the middle of a visible panel and ask what
  //! the browser would hand the click to.
  const panel = document.getElementById("tree-panel");
  if (panel && !panel.hidden && panel.offsetWidth) {
    const r = panel.getBoundingClientRect();
    const hit = document.elementFromPoint(Math.round(r.left + r.width / 2),
                                          Math.round(r.top + 12));
    out.overTree = hit ? (hit.closest("#tree-panel") ? "the tree" : hit.className) : "nothing";
  } else out.overTree = "the tree is not up";
  return out;
});
log("  the image sits at z-index " + onTop.image);
check("no floating panel is at or below it", onTop.behind.length === 0,
      onTop.behind.join(", ") || "none");
check("and a point on the tree panel still belongs to the tree",
      /the tree|not up/.test(onTop.overTree), onTop.overTree);

log("\n4. Tab takes the panels away and leaves the render");
await page.evaluate(() => window.__cad.bareNow(true));
await page.waitForTimeout(900);
const bared = await page.evaluate(() => {
  const look = one => {
    const el = document.querySelector(one);
    if (!el) return null;
    const s = getComputedStyle(el);
    return { opacity: Number(s.opacity), events: s.pointerEvents, hidden: el.hidden };
  };
  return { bar: look(".nb-bar"), tab: look(".nb-tab"), image: look(".nb-over"),
           tree: look("#tree-panel") };
});
check("the prompt bar goes with the rest",
      bared.bar && bared.bar.opacity === 0, JSON.stringify(bared.bar));
check("the image stays - it IS the view being asked for",
      bared.image && bared.image.opacity > 0.9 && !bared.image.hidden,
      JSON.stringify(bared.image));
check("and the edge tab stays, as the way back in",
      bared.tab && bared.tab.opacity > 0.9 && bared.tab.events !== "none",
      JSON.stringify(bared.tab));
//! PRESSING IT PUTS THE PANELS BACK, because a bar that is faded and deaf is
//! not something to open.
await page.evaluate(() => document.querySelector(".nb-tab").click());
await page.waitForTimeout(900);
const after = await page.evaluate(() => ({
  bare: document.body.classList.contains("bare"),
  bar: Number(getComputedStyle(document.querySelector(".nb-bar")).opacity),
  shut: document.querySelector(".nb-bar").hidden,
}));
check("pressing the tab leaves full screen", !after.bare, JSON.stringify(after));
check("and the bar it opens is usable", after.bar > 0.9 && !after.shut,
      JSON.stringify(after));

log("\nerrors: " + (errs.length ? errs.slice(0, 5).join(" | ") : "none"));
if (errs.length) bad++;
await page.screenshot({ path: D + "setcase.png" });
await browser.close();
log(bad ? "\n" + bad + " check(s) failed" : "\nall checks passed");
log("=== setcase drive done ===");
