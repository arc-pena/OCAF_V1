// THE OCTAGON PLAN, IN THE PAGE. The suite proves the arithmetic; what it
// cannot prove is that the sample opens from its link, that the attractors
// arrive as NODES somebody can pick and drag, that the panel offers the
// thirty-eight sliders, and that dragging a point actually moves the city.
//
// Three different ways for correct maths to arrive as an empty screen, and all
// three have happened here: a script that lost an import, a Script node whose
// wired inputs were not drawn, and a sample whose attractors were wired to
// nothing - which looks exactly like one that is wired up, because the script
// falls back to its sliders.
//
// Shaded, not traced. There is nothing in a masterplan that needs a path
// trace, and on this machine a trace costs five seconds a sample.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "octagon.out"; writeFileSync(LOG, "");
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
page.on("pageerror", e => errs.push(String(e.message).slice(0, 220)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });

//! FROM THE LINK, because that is what the sample's own summary tells people
//! to do and it is a path with its own way of failing: a key that does not
//! match any sample leaves the page empty and says nothing.
const SITE = process.env.DRIVE_URL || "http://127.0.0.1:8199/index.html";
await page.goto(SITE + "#octagon-plan", { waitUntil: "commit" });
await page.waitForFunction(() => {
  const t = window.__cad && window.__cad.tree();
  return t && t.features.some(f => f.id === "PLAN");
}, null, { timeout: 600000 });

const feats = () => page.evaluate(() => window.__cad.tree().features.map(f =>
  ({ id: f.id, type: f.type, name: f.name, parent: f.parent,
     error: f.error, built: f.built })));
const plan = () => page.evaluate(() => {
  const f = window.__cad.entry("PLAN");
  return f && { error: f.error, note: f.note, built: f.built,
                params: (f.params || []).map(p => p.key),
                values: f.values || {},
                lists: f.lists || {}, driven: f.driven || {} };
});

const all = await feats();
log("opened with " + all.length + " nodes: " + all.map(f => f.id).join(" "));
check("the sample opened from its link", all.length === 10, String(all.length));
check("nothing in it is in error", all.every(f => !f.error),
      all.filter(f => f.error).map(f => f.id + ": " + f.error).join(" | "));

const P = await plan();
log("note: " + P.note);
check("the script built", P.built && !P.error, P.error || "");
check("it declares its thirty-eight sliders", P.params.length === 38,
      P.params.length + ": " + P.params.join(" "));
check("the three attractor points are on its input",
      (P.lists.points || []).join() === "P_HIGH,P_VOID,P_WORM",
      JSON.stringify(P.lists.points));
check("and the spline is on its curve input",
      (P.lists.curves || []).join() === "SPLINE", JSON.stringify(P.lists.curves));
check("the base height is driven by the Number node",
      P.driven.height === "N_HEIGHT", JSON.stringify(P.driven));

//! THE TRIANGLES THE VIEWPORT WAS HANDED. A plan that built and never reached
//! the screen is the failure that looks most like success.
const massing = () => page.evaluate(() => {
  const held = window.__cad.shapes.get("PLAN");
  if (!held) return null;
  const group = held.group || held;
  let tris = 0;
  const lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  group.traverse(o => {
    if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    const pos = o.geometry.attributes.position;
    tris += (o.geometry.index ? o.geometry.index.count : pos.count) / 3;
    for (let i = 0; i < pos.count; i++)
      for (let k = 0; k < 3; k++) {
        const v = pos.getComponent ? pos.getComponent(i, k) : pos.array[i * 3 + k];
        if (v < lo[k]) lo[k] = v;
        if (v > hi[k]) hi[k] = v;
      }
  });
  return { tris, lo, hi };
});
//! WAITED FOR, not assumed. The tree arrives from the kernel before the
//! triangles do, so a measurement taken the moment the nodes appear reads an
//! empty viewport - which is indistinguishable from a plan that built nothing.
await page.waitForFunction(() => {
  const held = window.__cad.shapes.get("PLAN");
  if (!held) return false;
  let tris = 0;
  (held.group || held).traverse(o => {
    if (o.isMesh && o.geometry && o.geometry.attributes.position)
      tris += o.geometry.attributes.position.count;
  });
  return tris > 0;
}, null, { timeout: 600000 });
const was = await massing();
log("massing: " + was.tris + " triangles, up to "
  + Math.round(was.hi[2] / 1000) + " m");
check("it reached the viewport as triangles", was.tris > 1000, String(was.tris));
check("and it stands up off the ground", was.hi[2] > 50000,
      Math.round(was.hi[2] / 1000) + " m");

//! THE PANEL, read the way a person reads it. A slider nobody can reach is the
//! same as not having one, and the wired inputs are what this request was
//! about: Points and Curves have to be ON the node.
const panel = await page.evaluate(() => {
  window.__cad.select("PLAN");
  const box = document.getElementById("def");
  return box ? box.textContent.replace(/\s+/g, " ") : "";
});
log("panel: " + panel.slice(0, 400));
for (const label of ["Points", "Curves", "Wormhole east", "Its reach",
                     "How far it drags", "Spline reach", "Height it adds",
                     "Gap it opens"])
  check("the panel offers " + JSON.stringify(label), panel.includes(label), "");
//! AND SAYS WHICH OF THEM IS BEING DRIVEN. A declared parameter is an
//! argument now, so the panel owes it what it owes every other slider: the
//! name of whatever is driving it, and a way to pull the wire off. Drawn as a
//! slider of its own instead, the handle looked live and the number under it
//! was being ignored - which is exactly how it behaved until this asked.
check("and says the base height is driven by the Number node",
      /driven by\s*Base height/.test(panel) && panel.includes("Unwire"),
      panel.slice(Math.max(0, panel.indexOf("driven by")), panel.indexOf("driven by") + 90));

await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1500);
await page.screenshot({ path: D + "octagon-plan.png" });

//! DRAGGING THE WORMHOLE. Not a slider - the POINT, edited as a node, which is
//! the whole difference between a parameter and a handle. What has to change
//! is the lattice itself, so the footprints move; the heights are left alone
//! by this one, which is how it is told apart from the height attractor.
//! THE BUILT GROUND, FROM THE TRIANGLES. The whole plan arrives as ONE merged
//! geometry, so bounding boxes cannot tell one mass from another: the first
//! version of this measured the bounding box of the lot and reported the same
//! number twice, which is a check that cannot fail.
//!
//! Every mass is a prism, so each contributes its plan area TWICE - once from
//! the top, once from the bottom - and its walls contribute nothing, because a
//! vertical triangle projects to a line. So half the sum of |z of the cross
//! product|, halved again for top-and-bottom, IS the built area; the centre of
//! gravity is the same sum weighted by each triangle's middle.
const ground = () => page.evaluate(() => {
  const held = window.__cad.shapes.get("PLAN");
  if (!held) return null;
  let area = 0, cx = 0, cy = 0, tris = 0;
  (held.group || held).traverse(o => {
    if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
    //! THROUGH THE WORLD MATRIX, because the viewport does not keep a body's
    //! vertices where the kernel put them: this mesh's own box runs -243..238
    //! east while the site runs 39..520, and the difference is carried on the
    //! group above it. Measured in the local frame, the city's centre of
    //! gravity came out 800 m from a wormhole standing in the middle of it -
    //! and the number still MOVED when the point was dragged, so the check
    //! passed. An area is the same in either frame; a position is not.
    o.updateWorldMatrix(true, false);
    const e = o.matrixWorld.elements;
    const wx = (x, y, z) => e[0] * x + e[4] * y + e[8] * z + e[12];
    const wy = (x, y, z) => e[1] * x + e[5] * y + e[9] * z + e[13];
    const pos = o.geometry.attributes.position, idx = o.geometry.index;
    const n = idx ? idx.count : pos.count;
    for (let i = 0; i + 2 < n; i += 3) {
      const a = idx ? idx.getX(i) : i, b = idx ? idx.getX(i + 1) : i + 1,
            c = idx ? idx.getX(i + 2) : i + 2;
      const ax = wx(pos.getX(a), pos.getY(a), pos.getZ(a)),
            ay = wy(pos.getX(a), pos.getY(a), pos.getZ(a)),
            bx = wx(pos.getX(b), pos.getY(b), pos.getZ(b)),
            by = wy(pos.getX(b), pos.getY(b), pos.getZ(b)),
            px = wx(pos.getX(c), pos.getY(c), pos.getZ(c)),
            py = wy(pos.getX(c), pos.getY(c), pos.getZ(c));
      const w = Math.abs((bx - ax) * (py - ay) - (px - ax) * (by - ay)) / 2;
      area += w;
      cx += w * (ax + bx + px) / 3;
      cy += w * (ay + by + py) / 3;
      tris++;
    }
  });
  return { area: area / 2, at: area > 0 ? [cx / area, cy / area] : [0, 0], tris };
});
const before = await ground();
//! WHERE IT SAYS THE CITY IS, against the site the sample is drawn on - the
//! check that tells a centre of gravity from a number in the wrong frame.
log("the built ground is " + Math.round(before.area / 1e6) + " m\u00b2 centred on "
  + Math.round(before.at[0] / 1000) + ", " + Math.round(before.at[1] / 1000) + " m");
check("and the centre of it is on the site, where the city is",
      before.at[0] > 39000 && before.at[0] < 520000
      && before.at[1] > 61000 && before.at[1] < 835000,
      Math.round(before.at[0] / 1000) + ", " + Math.round(before.at[1] / 1000)
      + " m, against a site 39..520 east by 61..835 north");
await page.evaluate(async () => {
  await window.__cad.run({ op: "set", id: "P_WORM", key: "x", value: 180000 });
  await window.__cad.run({ op: "set", id: "P_WORM", key: "y", value: 760000 });
  await window.__cad.run({ op: "set", id: "PLAN", key: "warpPull", value: 0.6 });
});
await page.waitForTimeout(2500);
const after = await ground();
const moved = Math.hypot(before.at[0] - after.at[0], before.at[1] - after.at[1]);
log("the wormhole moved the built ground's centre of gravity by "
  + Math.round(moved / 1000) + " m, and its area from "
  + Math.round(before.area / 1e6) + " to " + Math.round(after.area / 1e6)
  + " m² over " + before.tris + " -> " + after.tris + " triangles");
//! TOWARDS IT, which is the whole of what a wormhole is. "Something changed"
//! would pass for any edit at all; what has to be true of THIS one is that
//! the ground the city stands on ends up nearer the point than it was.
const pull = at => Math.hypot(at[0] - 180000, at[1] - 760000);
log("  and from " + Math.round(pull(before.at) / 1000) + " m off the wormhole to "
  + Math.round(pull(after.at) / 1000) + " m");
check("dragging the wormhole point drags the city towards it",
      moved > 2000 && pull(after.at) < pull(before.at),
      Math.round(moved / 1000) + " m, now " + Math.round(pull(after.at) / 1000)
      + " m off it");
//! The mass COUNT is not one of the claims, and it was until this ran: a warp
//! moves the lattice's nodes, which resizes the plazas, which changes which
//! plots pass the plaza rule - so 2,310 triangles became 2,780 and the city
//! was right both times. Reported, not asserted.
log("  over " + before.tris + " -> " + after.tris
  + " triangles, which a warp is allowed to change: moving the nodes resizes "
  + "the plazas, and the plaza rule then admits a different set of plots");
const warped = await plan();
check("and it still builds afterwards", warped.built && !warped.error, warped.error || "");
await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1500);
await page.screenshot({ path: D + "octagon-wormhole.png" });

//! AND THAT IT IS THE WORMHOLE DOING IT. Moving the point changed the model -
//! but so would wiring it to the wrong thing, and the script reads three
//! points in the order they arrive. With the drag turned off the third point
//! must do NOTHING, which is what tells "it is the wormhole" apart from "it is
//! being read as the height attractor".
await page.evaluate(async () => {
  await window.__cad.run({ op: "set", id: "PLAN", key: "warpPull", value: 0 });
});
await page.waitForTimeout(2500);
const still = await ground();
await page.evaluate(async () => {
  await window.__cad.run({ op: "set", id: "P_WORM", key: "x", value: 505000 });
  await window.__cad.run({ op: "set", id: "P_WORM", key: "y", value: 110000 });
});
await page.waitForTimeout(2500);
const deaf = await ground();
log("with the drag at nought, moving the point 700 m left the built ground at "
  + Math.round(still.area / 1e6) + " -> " + Math.round(deaf.area / 1e6) + " m²");
check("with the drag at nought the wormhole point does nothing at all",
      Math.abs(deaf.area - still.area) < 1 && deaf.tris === still.tris,
      Math.round(still.area) + " vs " + Math.round(deaf.area) + " mm², "
      + still.tris + " vs " + deaf.tris + " triangles");
await page.evaluate(async () => {
  await window.__cad.run({ op: "set", id: "P_WORM", key: "x", value: 180000 });
  await window.__cad.run({ op: "set", id: "P_WORM", key: "y", value: 760000 });
  await window.__cad.run({ op: "set", id: "PLAN", key: "warpPull", value: 0.35 });
});
await page.waitForTimeout(2500);

//! AND THE SPLINE. Moving one of its four Points re-fits the curve, and the
//! curve raises what is near it - so the tallest thing in the city should
//! follow it. Measured as the peak, which is the one number a reader can check
//! against the screenshot.
const peak = async () => (await massing()).hi[2];
const wasPeak = await peak();
await page.evaluate(async () => {
  await window.__cad.run({ op: "set", id: "PLAN", key: "splineBulge", value: 220000 });
});
await page.waitForTimeout(2500);
const nowPeak = await peak();
log("the spline's bulge took the peak from " + Math.round(wasPeak / 1000)
  + " m to " + Math.round(nowPeak / 1000) + " m");
check("the spline raises the city along it", nowPeak > wasPeak + 20000,
      Math.round(wasPeak / 1000) + " m to " + Math.round(nowPeak / 1000) + " m");

//! THE GAP IT OPENS, which is the half of the request that is not height: the
//! masses beside the spline keep less of their plots, so the ground they stand
//! on shrinks while the city stays the same size.
await page.evaluate(async () => {
  await window.__cad.run({ op: "set", id: "PLAN", key: "splineGap", value: 0 });
});
await page.waitForTimeout(2500);
const shut = await ground();
await page.evaluate(async () => {
  await window.__cad.run({ op: "set", id: "PLAN", key: "splineGap", value: 40000 });
});
await page.waitForTimeout(2500);
const open = await ground();
log("the spline's gap took the built ground from " + Math.round(shut.area / 1e6)
  + " m² at nought to " + Math.round(open.area / 1e6) + " m² at 40 m, over "
  + shut.tris + " -> " + open.tris + " triangles");
check("the spline's gap takes ground away from the masses beside it",
      open.area < shut.area * 0.97,
      Math.round(open.area / 1e6) + " vs " + Math.round(shut.area / 1e6) + " m²");

await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1500);
await page.screenshot({ path: D + "octagon-spline.png" });

//! THE GRAPH, because "add the points to the node graph" is a claim about a
//! drawing: the eleven nodes have to be IN it, with the wires from the points
//! to the script drawn.
const graph = await page.evaluate(async () => {
  //! element.click() rather than page.click: the definition panel overlaps
  //! the chip, and Playwright waits for ever on an element it thinks is
  //! covered.
  const btn = document.getElementById("btn-graph");
  if (!btn) return null;
  btn.click();
  await new Promise(r => setTimeout(r, 1500));
  const host = document.querySelector(".g-root");
  if (!host) return null;
  //! Fitted, or the window opens on whichever corner of the drawing the
  //! last view left it at and the screenshot is of three nodes and some wire.
  //! Tidied THEN fitted. Nothing has laid this graph out - the sample carries
  //! no layout - so the nodes come up in a column, and a fit on a column is a
  //! column that fills the window.
  const press = want => {
    const b = [...document.querySelectorAll(".g-btn")]
      .find(one => one.textContent.trim().toLowerCase().includes(want));
    if (b) b.click();
  };
  //! Tidy is a batch of move edits that go through the kernel and come back,
  //! so the fit has to wait for them to land or it frames where the nodes
  //! used to be.
  press("tidy");
  await new Promise(r => setTimeout(r, 2500));
  press("fit");
  await new Promise(r => setTimeout(r, 900));
  return { nodes: host.querySelectorAll(".g-node").length,
           wires: host.querySelectorAll(".g-wires path").length,
           ports: host.querySelectorAll(".g-port").length };
});
log("graph: " + JSON.stringify(graph));
check("the graph opened", !!graph, graph ? graph.nodes + " nodes" : "no .g-root in the page");
if (graph) {
  //! ALL TEN, at the top level. This is the check that found the attractors
  //! filed in a set: a set is ONE node in the graph with its own graph inside
  //! it, so the Nodes view opened on two boxes - the folder and the script -
  //! and not one of the handles the sample is about was in the drawing.
  check("the graph draws all ten nodes", graph.nodes === 10, String(graph.nodes));
  //! Four points into the spline, the spline into the script, three points
  //! into the script, the number into the script: eight.
  check("and the wires between them", graph.wires >= 8, String(graph.wires));
  //! THE PORTS ARE THE POINT OF THE SECOND HALF OF THE REQUEST: a declared
  //! parameter is an argument, so it has a socket on the node and a Number can
  //! be dropped on it. Thirty-eight parameters, three inputs and an output.
  check("and a socket for every parameter, so a slider can be dropped on one",
        graph.ports >= 38, String(graph.ports) + " ports");
  await page.screenshot({ path: D + "octagon-graph.png" });
}

//! AND THE PICTURES SOMEBODY WOULD ACTUALLY LOOK AT - OF THE SAMPLE AS IT
//! OPENS. Everything above drove the sliders to their ends and left them
//! there, so a screenshot taken at this point is of a 40 m gap and a 220 m
//! bulge: a true picture of the last thing the drive did and a false one of
//! the sample. So it is opened again from the link, and then photographed.
//!
//! The graph is shut, the panel is put away - it covers a third of the window,
//! so a screenshot with it open shows two thirds of a city - and the plan is
//! taken from above, which is the view a masterplan is read in.
//! RELOADED, not navigated to. The page is ALREADY at this address, so a
//! goto to the same url-with-hash is a same-document navigation: the browser
//! moves the fragment and runs nothing. The screenshot then showed the
//! sliders where the drive had left them while claiming to show the sample -
//! and the only thing that said so was the triangle count in the status bar.
await page.reload({ waitUntil: "commit" });
await page.waitForFunction(() => {
  if (!window.__cad || !window.__cad.shapes) return false;
  const held = window.__cad.shapes.get("PLAN");
  if (!held) return false;
  let tris = 0;
  (held.group || held).traverse(o => {
    if (o.isMesh && o.geometry && o.geometry.attributes.position)
      tris += o.geometry.attributes.position.count;
  });
  return tris > 0;
}, null, { timeout: 600000 });
await page.evaluate(async () => {
  //! The graph window remembers that it was open, so it comes back with the
  //! page and has to be shut again.
  const nodes = document.getElementById("btn-graph");
  if (nodes && nodes.getAttribute("aria-pressed") === "true") nodes.click();
  await new Promise(r => setTimeout(r, 600));
  const shut = document.querySelector("#def-panel .panel-shut");
  if (shut) shut.click();
});
await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(1500);
await page.screenshot({ path: D + "octagon-city.png" });

await page.evaluate(async () => {
  const top = [...document.querySelectorAll("button")].find(b => b.dataset.view === "top");
  if (top) top.click();
  await new Promise(r => setTimeout(r, 600));
  const fit = [...document.querySelectorAll("button")].find(b => b.dataset.view === "fit");
  if (fit) fit.click();
});
await page.waitForTimeout(2000);
await page.screenshot({ path: D + "octagon-top.png" });

//! AND THE NUMBER THAT SAYS WHICH MODEL WAS PHOTOGRAPHED. The status bar
//! carries the triangle count, and it is the one thing on screen that can
//! tell the sample from the sample with every slider driven to its end.
const shown = await page.evaluate(() => {
  const bar = document.getElementById("status");
  return bar ? bar.textContent.replace(/\s+/g, " ").trim() : "";
});
log("photographed: " + shown);
check("the pictures are of the sample as it opens, not of the last slider end",
      /2,310 tris/.test(shown), shown.slice(0, 90));

check("no page errors", errs.length === 0, errs.join(" | "));
log(bad ? "\n" + bad + " FAILED" : "\nall good");
await browser.close();
process.exit(bad ? 1 : 0);
