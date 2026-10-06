// IS A CURVE'S HIGHLIGHT WORKING, AND IS IT VISIBLE? Two different questions
// and the report conflates them: "selection or highlighting in curves and
// sketches are not working on the viewport they need to be more visibly
// glowing". The code plainly changes the line's colour, so this asks the page
// rather than guessing which half is wrong - the material's colour before and
// after, AND how many pixels on screen actually changed.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "glow.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 900, height: 640 } });
page.setDefaultTimeout(180000);
const errs = [];
page.on("pageerror", e => errs.push(String(e.message).slice(0, 200)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });
await page.goto("http://127.0.0.1:8199/index.html", { waitUntil: "commit" });
await page.waitForFunction(() => document.querySelectorAll("#tree .node").length > 0);

//! A CIRCLE, which is the plainest curve feature there is.
//! A CIRCLE NEEDS A PLANE. The first version of this drive gave it only a
//! centre, so it built red and `shapes` had no entry for it - the measurement
//! came back {"missing":true} and said nothing at all about highlighting. The
//! plane is taken from whatever the starting document already has.
const id = await page.evaluate(async () => {
  const tree = window.__cad.packages().kit.tree().features;
  const plane = tree.find(f => f.produces === "plane");
  if (!plane) return { error: "no plane in the document: "
    + [...new Set(tree.map(f => f.produces))].join(",") };
  const c = await window.__cad.run({ op: "add", type: "Circle",
                                     refs: { plane: plane.id } });
  await window.__cad.run({ op: "set", id: c.id, key: "radius", value: 300 });
  return { id: c.id, plane: plane.id };
});
log("circle: " + JSON.stringify(id));
if (id.error) { log(id.error); await browser.close(); process.exit(1); }
const which = id.id;
await page.waitForTimeout(3000);
await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(800);

//! WHAT THE LINE'S MATERIAL SAYS, and how many objects the group holds - so a
//! highlight that paints nothing because there is nothing of that type to
//! paint is told apart from one that paints the wrong colour.
const lineState = () => page.evaluate(one => {
  const held = window.__cad.shapes.get(one);
  if (!held) return { missing: true };
  const out = [];
  held.group.traverse(o => {
    if (o.isLineSegments && o.material && o.material.isLineBasicMaterial)
      out.push({ colour: "#" + o.material.color.getHexString().toUpperCase(),
                 visible: o.visible, opacity: o.material.opacity,
                 glow: !!o.userData.glow });
    if (o.userData && o.userData.glow)
      out.push({ ribbon: true, visible: o.visible });
  });
  return { solid: !!held.group.userData.solid,
           curve: !!held.group.userData.curve, lines: out };
}, which);

log("\n1. does the highlight change anything at all");
log("  the feature built: " + JSON.stringify(await page.evaluate(one => {
  const f = window.__cad.entry(one);
  return f ? { type: f.type, error: f.error || null, produces: f.produces } : "no row";
}, which)));
log("  plain:    " + JSON.stringify(await lineState()));
await page.evaluate(one => window.__cad.select(one), which);
await page.waitForTimeout(700);
log("  selected: " + JSON.stringify(await lineState()));

//! HOW MANY PIXELS CHANGE, counted by DIFFING the two pictures rather than by
//! comparing colour tallies.
//!
//! The first version of this tallied colours and compared the top twelve, and
//! reported "0 px" for a glow that was plainly drawing - because a translucent
//! band over a graded backdrop produces hundreds of distinct blends, not one
//! new flat colour, and none of them is common enough to reach a top-twelve
//! list. The instrument was wrong, not the thing measured, and it said zero
//! with complete confidence. A diff cannot make that mistake.
const shot = async () => page.evaluate(async () => {
  const url = window.__cad.packages().kit.snapshot("image/png");
  const img = await new Promise(done => { const o = new Image(); o.onload = () => done(o); o.src = url; });
  const c = document.createElement("canvas");
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const pen = c.getContext("2d", { willReadFrequently: true });
  pen.drawImage(img, 0, 0);
  return [...pen.getImageData(0, 0, c.width, c.height).data];
});
const differing = (a, b) => {
  let n = 0;
  for (let i = 0; i < a.length; i += 4)
    if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2]) n++;
  return n;
};

await page.evaluate(() => window.__cad.select(null));
await page.waitForTimeout(700);
const plainShot = await shot();
await page.evaluate(one => window.__cad.select(one), which);
await page.waitForTimeout(900);
const litShot = await shot();
log("\n2. how many pixels the highlight actually changes");
log("  selected changes " + differing(plainShot, litShot) + " px of "
    + (plainShot.length / 4) + "");

await page.evaluate(() => window.__cad.select(null));
await page.waitForTimeout(800);
log("\n3. and hovering it");
//! THE HALF THAT REALLY WAS NOT WORKING. three.js defaults Line.threshold to
//! one world unit, which on a model in millimetres is sub-pixel - so a curve
//! could not be pointed at. Checked by aiming at the projected position of
//! one of the circle's own vertices, which is as fair a shot as exists.
//! WHERE ON SCREEN THE CIRCLE IS, taken from its own geometry through the
//! page's own camera rather than guessed - a one-pixel line is not something
//! to aim at by eye.
const hovered = await page.evaluate(one => {
  const held = window.__cad.shapes.get(one);
  const lines = [];
  held.group.traverse(o => { if (o.isLineSegments && o.geometry) lines.push(o); });
  const pos = lines[0].geometry.attributes.position.array;
  const THREE = window.__cad.packages().kit.THREE;
  const v = new THREE.Vector3(pos[0], pos[1], pos[2]);
  held.group.updateMatrixWorld(true);
  held.group.localToWorld(v);
  v.project(window.__cad.camera);
  const rect = document.querySelector("#viewport canvas").getBoundingClientRect();
  return [Math.round(rect.left + (v.x * 0.5 + 0.5) * rect.width),
          Math.round(rect.top + (-v.y * 0.5 + 0.5) * rect.height)];
}, which);
//! DISPATCHED ON THE CANVAS, not driven with page.mouse. The circle's
//! projected position can sit under a floating panel at this window size -
//! CLAUDE.md warns about exactly that for the toolbar - and then the real
//! pointer never reaches the viewport's own listener and the measurement says
//! "nothing under the pointer" about a pick that works perfectly. Checked
//! below rather than assumed: the drive reports what is at that point.
log("  what is at that point: " + await page.evaluate(([x, y]) => {
  const el = document.elementFromPoint(x, y);
  return el ? (el.tagName + (el.id ? "#" + el.id : "") + "." + (el.className || "")) : "nothing";
}, hovered));
await page.evaluate(([x, y]) => {
  const canvas = document.querySelector("#viewport canvas");
  for (const [dx, dy] of [[3, 3], [0, 0]])
    canvas.dispatchEvent(new PointerEvent("pointermove", {
      clientX: x + dx, clientY: y + dy, bubbles: true, cancelable: true,
      pointerId: 1, pointerType: "mouse", isPrimary: true }));
}, hovered);
await page.waitForTimeout(700);
//! THREE QUESTIONS, not one: does the raycast resolve, does the page's own
//! hover path resolve, and did the dispatched event reach it. Asking only the
//! last of the three is how five probes in a row reported "null" about a pick
//! that works.
const asked = await page.evaluate(([x, y]) => ({
  raycast: window.__cad.underAt(x, y),
  hoverPath: window.__cad.hoverAt(x, y),
}), hovered);
log("  the raycast finds:   " + JSON.stringify(asked.raycast));
log("  the hover path finds: " + JSON.stringify(asked.hoverPath));
const under = await page.evaluate(() => window.__cad.hovered());
log("  what is under the pointer: " + JSON.stringify(under)
    + (under === which ? "  (the circle)" : "  (NOT the circle)"));
const hotShot = await shot();
log("  hovering changes " + differing(plainShot, hotShot) + " px");
log("  the glow ribbon is in the group: " + JSON.stringify(await lineState()));
await page.screenshot({ path: D + "glow.png" });

log("\nerrors: " + (errs.length ? errs.slice(0, 4).join(" | ") : "none"));
await browser.close();
log("=== glow drive done ===");
