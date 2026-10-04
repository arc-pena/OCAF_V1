// IS THE POINTER ACCURATE, not just working.
//
// Picking was proved to WORK after the missing-import fault: hover found a
// body, a click selected it, the panel opened. None of that says the answer is
// right at the EDGE of a thing, which is the only place it can be wrong in a
// way that matters - a silhouette that answers two pixels wide of where it is
// drawn makes a small face impossible to hit and nobody can say why.
//
// So this does not ask "did it find something". It works out where the model's
// own geometry PROJECTS to on the screen, through the page's own camera, then
// binary-searches for the pixel where the answer changes and compares the two.
// Any disagreement is in pixels and is either acceptable or is a number to fix.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "pick2.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1200, height: 820 } });
page.setDefaultTimeout(240000);
const errs = [];
page.on("pageerror", e => errs.push(String(e.message).slice(0, 220)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });
await page.goto("http://127.0.0.1:8199/index.html", { waitUntil: "commit" });
await page.waitForFunction(() => document.querySelectorAll("#tree .node").length > 0);

//! ONE CUBE, at the origin, 400 on a side. Simple on purpose: its corners are
//! known exactly, so where it should be on the screen is arithmetic rather
//! than a guess, and any disagreement is the pointer's.
const made = await page.evaluate(async () => {
  const o = await window.__cad.run({ op: "add", type: "Point" });
  const c = await window.__cad.run({ op: "add", type: "Cube", refs: { origin: o.id } });
  for (const k of ["dx", "dy", "dz"])
    await window.__cad.run({ op: "set", id: c.id, key: k, value: 400 });
  //! AND A MARK SOMEWHERE OF ITS OWN. The document already has a point at
  //! (0,0,0) - the datum origin - so a second one there means two coincident
  //! marks, and asking "did it find MY point" has no answer. This one is on a
  //! corner of the cube, which is where a mark actually gets in the way.
  const m = await window.__cad.run({ op: "add", type: "Point" });
  await window.__cad.run({ op: "set", id: m.id, key: "x", value: 400 });
  await window.__cad.run({ op: "set", id: m.id, key: "y", value: 400 });
  await window.__cad.run({ op: "set", id: m.id, key: "z", value: 400 });
  return { cube: c.id, origin: o.id, mark: m.id };
});
await page.waitForTimeout(2500);
await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(900);

check("the raycaster is offered the model at all",
      (await page.evaluate(() => window.__cad.pickCount())) > 0,
      (await page.evaluate(() => window.__cad.pickCount())) + " meshes offered");

//! WHERE THE GEOMETRY IS ON THE SCREEN. Through the page's own camera and its
//! own canvas rectangle, which is the same pair the raycaster uses - so this
//! is not a second opinion about the projection, it is the same projection
//! read forwards.
const project = points => page.evaluate(list => {
  const cam = window.__cad.camera;
  const rect = document.querySelector("#viewport canvas").getBoundingClientRect();
  const THREE = window.__cad.packages().kit.THREE;
  //! The model group carries the Z-up rotation, so a point in model
  //! coordinates has to go through it exactly as a triangle does.
  const group = window.__cad.packages().kit.world;
  group.updateMatrixWorld(true);
  return list.map(p => {
    const v = new THREE.Vector3(p[0], p[1], p[2]);
    group.localToWorld(v);
    v.project(cam);
    return [rect.left + (v.x * 0.5 + 0.5) * rect.width,
            rect.top + (-v.y * 0.5 + 0.5) * rect.height];
  });
}, points);

const corners = [];
for (const x of [0, 400]) for (const y of [0, 400]) for (const z of [0, 400])
  corners.push([x, y, z]);
const shot = await project(corners);
const xs = shot.map(p => p[0]), ys = shot.map(p => p[1]);
const box = { left: Math.min(...xs), right: Math.max(...xs),
              top: Math.min(...ys), bottom: Math.max(...ys) };
log("the cube projects to x " + box.left.toFixed(1) + ".." + box.right.toFixed(1)
    + ", y " + box.top.toFixed(1) + ".." + box.bottom.toFixed(1));

//! THE REAL POINTER, through the page's own handlers - not a synthetic event
//! with made-up coordinates, because the thing being measured is how the page
//! turns a client position into a feature.
const hoverAt = async (x, y) => {
  await page.mouse.move(x, y);
  return await page.evaluate(() => window.__cad.hovered());
};

//! The pixel at which the answer changes, found by halving rather than by
//! walking - a scanline of 600 real pointer moves takes a minute and this
//! takes nine moves, to the pixel.
async function edgeBetween(missX, hitX, y, wanted) {
  let miss = missX, hit = hitX;
  for (let i = 0; i < 12 && Math.abs(hit - miss) > 1; i++) {
    const mid = Math.round((miss + hit) / 2);
    const found = await hoverAt(mid, y);
    if (found === wanted) hit = mid; else miss = mid;
  }
  return hit;
}

log("\n1. the silhouette answers where it is drawn");
{
  const midY = Math.round((box.top + box.bottom) / 2);
  const midX = Math.round((box.left + box.right) / 2);
  const onIt = await hoverAt(midX, midY);
  check("the middle of the cube is the cube", onIt === made.cube,
        String(onIt));
  //! OUTSIDE IT IS NOTHING - and this is the half that catches a pointer that
  //! is merely generous. A pick that answers "the cube" everywhere would pass
  //! every test that only asks whether the cube can be found.
  const off = await hoverAt(Math.round(box.left) - 60, midY);
  check("sixty pixels clear of it is nothing", off === null, String(off));

  const leftEdge = await edgeBetween(Math.round(box.left) - 60,
                                     midX, midY, made.cube);
  //! The silhouette at this height is not necessarily the bounding box's left
  //! edge - a cube seen in three-quarter view has its leftmost point at one
  //! corner only - so the comparison is against the projected hull at THIS
  //! scanline, worked out from the same corners.
  const hull = await page.evaluate(([list, y]) => {
    const cam = window.__cad.camera;
    const rect = document.querySelector("#viewport canvas").getBoundingClientRect();
    const THREE = window.__cad.packages().kit.THREE;
    const group = window.__cad.packages().kit.world;
    group.updateMatrixWorld(true);
    const flat = list.map(p => {
      const v = new THREE.Vector3(p[0], p[1], p[2]);
      group.localToWorld(v); v.project(cam);
      return [rect.left + (v.x * 0.5 + 0.5) * rect.width,
              rect.top + (-v.y * 0.5 + 0.5) * rect.height];
    });
    //! Where the scanline crosses each edge of the projected cube, which is
    //! the exact silhouette at that height whatever the view angle is.
    const edges = [];
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
      const a = list[i], b = list[j];
      //! Only the twelve real edges: two corners that differ in one axis.
      const differs = [0, 1, 2].filter(k => a[k] !== b[k]).length;
      if (differs === 1) edges.push([flat[i], flat[j]]);
    }
    const hits = [];
    for (const [a, b] of edges) {
      if ((a[1] - y) * (b[1] - y) > 0) continue;
      const t = (y - a[1]) / ((b[1] - a[1]) || 1e-9);
      hits.push(a[0] + t * (b[0] - a[0]));
    }
    return hits.length ? [Math.min(...hits), Math.max(...hits)] : null;
  }, [corners, midY]);
  check("the scanline crosses the cube", !!hull, JSON.stringify(hull));
  const gap = Math.abs(leftEdge - hull[0]);
  check("and the pointer's left edge is where the geometry's is",
        gap <= 2, "found at " + leftEdge + ", drawn at " + hull[0].toFixed(1)
                  + " - " + gap.toFixed(1) + " px out");

  const rightEdge = await edgeBetween(Math.round(box.right) + 60, midX, midY, made.cube);
  const gapR = Math.abs(rightEdge - hull[1]);
  check("and so is the right edge",
        gapR <= 2, "found at " + rightEdge + ", drawn at " + hull[1].toFixed(1)
                   + " - " + gapR.toFixed(1) + " px out");
}

//! THE SILHOUETTE AT ONE HEIGHT, which is what a scanline can be compared
//! against. Lifted out of section 1, where it was written inline, because
//! section 2 needs the same figure and was using a bounding box instead.
const hullAt = y => page.evaluate(([list, atY]) => {
  const cam = window.__cad.camera;
  const rect = document.querySelector("#viewport canvas").getBoundingClientRect();
  const THREE = window.__cad.packages().kit.THREE;
  const group = window.__cad.packages().kit.world;
  group.updateMatrixWorld(true);
  //! IN FRONT OF THE CAMERA, or there is nothing to compare. Zoomed far enough
  //! in, the camera is INSIDE the cube: some corners are behind it, project to
  //! nonsense, and the ray only meets back faces - which front-facing
  //! materials are not tested against, so the pointer correctly finds nothing.
  //! That is a view, not a fault, and it is reported rather than measured.
  const eye = new THREE.Vector3();
  cam.getWorldPosition(eye);
  const flat = [], depths = [];
  for (const p of list) {
    const v = new THREE.Vector3(p[0], p[1], p[2]);
    group.localToWorld(v);
    depths.push(v.clone().sub(eye).dot(cam.getWorldDirection(new THREE.Vector3())));
    v.project(cam);
    flat.push([rect.left + (v.x * 0.5 + 0.5) * rect.width,
               rect.top + (-v.y * 0.5 + 0.5) * rect.height]);
  }
  if (Math.min(...depths) <= 0) return { inside: true };
  const edges = [];
  for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) {
    const a = list[i], b = list[j];
    if ([0, 1, 2].filter(k => a[k] !== b[k]).length === 1) edges.push([flat[i], flat[j]]);
  }
  const hits = [];
  for (const [a, b] of edges) {
    if ((a[1] - atY) * (b[1] - atY) > 0) continue;
    const t = (atY - a[1]) / ((b[1] - a[1]) || 1e-9);
    hits.push(a[0] + t * (b[0] - a[0]));
  }
  const xs = flat.map(f => f[0]), ys = flat.map(f => f[1]);
  return hits.length
    ? { left: Math.min(...hits), right: Math.max(...hits),
        box: { left: Math.min(...xs), right: Math.max(...xs),
               top: Math.min(...ys), bottom: Math.max(...ys) } }
    : { missed: true };
}, [corners, y]);

log("\n2. and it stays accurate at any zoom");
{
  //! NOT FOUR TIMES IN. Fitting a 400 mm cube puts the camera about 700 mm
  //! from its centre, so a quarter of that is 175 mm - inside the cube. The
  //! factors here keep the camera outside it, which is the only range where
  //! "where is the silhouette" is a question with an answer.
  for (const [label, by] of [["zoomed in, 1.7x", 0.6], ["zoomed out, 5x", 5],
                             ["zoomed out, 20x", 4]]) {
    await page.evaluate(f => window.__cad.zoom(f), by);
    await page.waitForTimeout(500);
    const probe = await project(corners);
    const ys2 = probe.map(p => p[1]);
    const midY = Math.round((Math.min(...ys2) + Math.max(...ys2)) / 2);
    const seen = await hullAt(midY);
    if (seen.inside) { log("  --   " + label + ": the camera is inside the model, skipped"); continue; }
    if (seen.missed) { log("  --   " + label + ": the scanline misses it, skipped"); continue; }
    const midX = Math.round((seen.left + seen.right) / 2);
    const across = seen.right - seen.left;
    if (midX < 2 || midX > 1198 || midY < 2 || midY > 818) {
      log("  --   " + label + ": off screen, skipped");
      continue;
    }
    const onIt = await hoverAt(midX, midY);
    check(label + ": the middle is still the cube", onIt === made.cube,
          Math.round(across) + " px across, got " + onIt);
    const clear = Math.round(Math.max(14, across * 0.4));
    const off = await hoverAt(Math.max(1, Math.round(seen.left) - clear), midY);
    check(label + ": and " + clear + " px clear of it is nothing", off === null, String(off));
    const found = await edgeBetween(Math.max(1, Math.round(seen.left) - clear),
                                   midX, midY, made.cube);
    //! TWO PIXELS, WHATEVER THE SIZE. Not a share of the cube: the error being
    //! looked for is in the mapping from a client position to a ray, and that
    //! is in pixels - so a tolerance that grew with the object would hide
    //! exactly the fault at the zoom where it matters most.
    check(label + ": the edge is within two pixels of the drawing",
          Math.abs(found - seen.left) <= 2,
          "found " + found + ", drawn at " + seen.left.toFixed(1)
            + " - " + Math.abs(found - seen.left).toFixed(1) + " px out");
  }
  await page.evaluate(() => window.__cad.fit());
  await page.waitForTimeout(600);
}

log("\n3. a mark beats the body it sits on, and only within a dozen pixels");
{
  //! THE RULE, MEASURED. A point is a few pixels across and sits ON the thing
  //! it was made from, so nearest-hit-wins would make it unpickable - the code
  //! therefore gives the ray a radius said to be "a dozen pixels". Whether it
  //! IS a dozen depends on arithmetic that uses the camera's distance to the
  //! TARGET as a stand-in for the depth of the point, which is only the same
  //! number when the point is at the centre of the view.
  const at = (await project([[400, 400, 400]]))[0];
  const onMark = await hoverAt(Math.round(at[0]), Math.round(at[1]));
  check("pointing straight at a mark on a corner finds the mark",
        onMark === made.mark, onMark + " (wanted " + made.mark + ")");
  //! HOW FAR AWAY IT STILL WINS, in pixels. The code says "a dozen" and works
  //! it out from the camera's distance to the TARGET, which is a stand-in for
  //! the depth of the point and is only the same number when the point is at
  //! the centre of the view. This is the measurement of what it actually is.
  let reach = 0;
  for (let d = 1; d <= 60; d++) {
    const found = await hoverAt(Math.round(at[0]) + d, Math.round(at[1]));
    if (found !== made.mark) break;
    reach = d;
  }
  log("  the mark wins out to " + reach + " px from its centre, on a corner");
  check("which is about the dozen pixels the code says it is",
        reach >= 5 && reach <= 24, reach + " px");
}

log("\n4. and a right-click knows what is under it");
{
  //! THE REPORTED SYMPTOM, EXACTLY. "I cannot right-click over them, it says
  //! nothing under pointer." The cause last time was an exception during the
  //! rebuild that left the pick list empty - so the model drew, nothing
  //! highlighted, and the menu had nothing to be about. This asks for the
  //! menu's own words rather than for a pick, because the words are what was
  //! reported.
  const seen = await hullAt(Math.round((box.top + box.bottom) / 2));
  const y = Math.round((box.top + box.bottom) / 2);
  const x = Math.round((seen.left + seen.right) / 2);
  const under = await hoverAt(x, y);
  check("the pointer is over a body", under === made.cube, String(under));

  const menuNow = () => page.evaluate(() => {
    const m = document.getElementById("menu");
    const s = getComputedStyle(m);
    return { hidden: m.hidden, display: s.display,
             text: m.textContent.replace(/\s+/g, " ").trim().slice(0, 80) };
  });
  //! TWO WAYS, to tell the page apart from the harness. A real right click
  //! goes through the browser's own contextmenu machinery; a dispatched event
  //! goes straight to the page's listener. If the first says nothing and the
  //! second says the body's name, the fault is in the drive and not in the
  //! program - which is worth knowing before changing any code.
  await page.mouse.click(x, y, { button: "right" });
  await page.waitForTimeout(450);
  const real = await menuNow();
  log("  a real right click  -> " + JSON.stringify(real));

  await page.evaluate(() => { document.getElementById("menu").hidden = true; });
  await page.evaluate(([cx, cy]) => {
    document.querySelector("#viewport canvas").dispatchEvent(new MouseEvent("contextmenu",
      { clientX: cx, clientY: cy, bubbles: true, cancelable: true, button: 2 }));
  }, [x, y]);
  await page.waitForTimeout(450);
  const sent = await menuNow();
  log("  a dispatched contextmenu -> " + JSON.stringify(sent));

  const good = one => !one.hidden && one.display !== "none"
    && one.text.length > 0 && !/nothing under/i.test(one.text);
  check("the menu comes up and is about the body",
        good(real) || good(sent),
        "real: " + (good(real) ? "yes" : "no") + ", dispatched: "
          + (good(sent) ? "yes" : "no") + " - " + (sent.text || real.text || "empty"));
  check("and it does not say there is nothing there",
        !/nothing under/i.test(real.text + " " + sent.text),
        (real.text + " | " + sent.text).slice(0, 90));
}

log("\nerrors: " + (errs.length ? errs.slice(0, 5).join(" | ") : "none"));
if (errs.length) bad++;
await page.screenshot({ path: D + "pick2.png" });
await browser.close();
log(bad ? "\n" + bad + " check(s) failed" : "\nall checks passed");
log("=== pick2 drive done ===");
