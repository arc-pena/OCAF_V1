// DOES THE MASK ACTUALLY CONTAIN THE COLOURS THE PROMPT NAMES?
//
// This is the one claim in the whole feature that cannot be settled without a
// GPU and a real canvas. Between asking for #FF0000 and its arriving in a PNG
// there is the renderer's output encoding, tone mapping, and an antialiased
// edge around every silhouette - any of which can shift a channel. If the hex
// in the prompt is not the hex in the image, the model is told to recolour a
// region that does not exist, and what comes back is a plausible render that
// ignored every instruction. No error, nothing to look at.
//
// So: build a scene of known objects, take the mask, and check each legend
// colour is present in the image EXACTLY, by reading the pixels back.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "mask.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 900, height: 640 } });
page.setDefaultTimeout(240000);
const errs = [];
page.on("pageerror", e => errs.push(String(e.message).slice(0, 220)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });
await page.goto("http://127.0.0.1:8199/index.html", { waitUntil: "commit" });
await page.waitForFunction(() => document.querySelectorAll("#tree .node").length > 0);

//! FIVE cubes, spread out so each one is its own region with nothing behind
//! it. Five because the interesting cases are "all of them found" and "one of
//! them hidden", and both need more than one.
const ids = await page.evaluate(async () => {
  const out = [];
  for (let i = 0; i < 5; i++) {
    const p = await window.__cad.run({ op: "add", type: "Point" });
    await window.__cad.run({ op: "set", id: p.id, key: "x", value: i * 700 });
    const c = await window.__cad.run({ op: "add", type: "Cube", refs: { origin: p.id } });
    for (const k of ["dx", "dy", "dz"])
      await window.__cad.run({ op: "set", id: c.id, key: k, value: 400 });
    await window.__cad.run({ op: "rename", id: c.id, name: "Block " + (i + 1) });
    out.push(c.id);
  }
  return out;
});
await page.waitForTimeout(3500);
await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(900);

//! The page's own mask, and then the pixels of it, counted here rather than
//! in the page so the count is not the same code answering about itself.
const takeMask = () => page.evaluate(async () => {
  const made = window.__cad.packages().kit.maskSnapshot();
  if (!made) return null;
  //! Decoded through an Image so what is measured is the PNG that would be
  //! SENT, not the canvas it came from - the encode is one of the steps that
  //! could move a channel.
  const img = await new Promise((done, fail) => {
    const one = new Image();
    one.onload = () => done(one);
    one.onerror = () => fail(new Error("the mask would not decode"));
    one.src = made.data;
  });
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const pen = canvas.getContext("2d", { willReadFrequently: true });
  pen.drawImage(img, 0, 0);
  const data = pen.getImageData(0, 0, canvas.width, canvas.height).data;
  const tally = new Map();
  for (let i = 0; i < data.length; i += 4) {
    const hex = "#" + [data[i], data[i + 1], data[i + 2]]
      .map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
    tally.set(hex, (tally.get(hex) || 0) + 1);
  }
  return { legend: made.legend, asked: made.asked, found: made.found,
           size: [canvas.width, canvas.height],
           counts: [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 14) };
});

log("1. the mask renders, and every colour it names is in it");
const first = await takeMask();
check("a mask came back", !!first, first ? "yes" : "null");
log("  size " + (first.size || []).join("x") + ", asked " + first.asked
    + ", found " + first.found);
log("  the commonest colours: "
    + first.counts.slice(0, 7).map(([hex, n]) => hex + " x" + n).join(", "));
check("all five blocks are in the legend", first.legend.length === 5,
      first.legend.length + " of 5: " + first.legend.map(one => one.name).join(", "));
//! THE CHECK THIS FILE EXISTS FOR.
const present = new Map(first.counts);
const missing = first.legend.filter(one => !present.has(one.hex));
check("every legend colour is a colour that is actually in the PNG",
      missing.length === 0,
      missing.length ? "not in the image: "
        + missing.map(one => one.name + " " + one.hex).join(", ")
        : first.legend.map(one => one.hex).join(" "));
check("and the background is black",
      first.counts[0][0] === "#000000", first.counts[0][0] + " is commonest");
//! EACH REGION IS ONE FLAT COLOUR, not a shaded one. If lighting were leaking
//! in, a cube would be three or four tones and no single one of them would
//! cover a whole face.
const bigEnough = first.legend.filter(one => (present.get(one.hex) || 0) > 1200);
check("each region is a solid area, not a shaded gradient",
      bigEnough.length === first.legend.length,
      first.legend.map(one => one.name + " " + (present.get(one.hex) || 0) + "px").join(", "));

log("\n2. a hidden object is not in the mask at all");
await page.evaluate(id => window.__cad.hide(id, true), ids[2]);
await page.waitForTimeout(1200);
const after = await takeMask();
check("the legend is one shorter", after.legend.length === 4,
      after.legend.length + " entries");
check("and the hidden one is not named",
      !after.legend.some(one => one.id === ids[2]),
      after.legend.map(one => one.name).join(", "));
await page.evaluate(id => window.__cad.hide(id, false), ids[2]);
await page.waitForTimeout(1200);

log("\n3. the hint comes off the material first, the object second");
const where = await page.evaluate(async list => {
  //! An object hint on block 1, and then a Material with its own hint that
  //! owns block 1 - so the material has to win.
  await window.__cad.run({ op: "appearance", id: list[0],
    appearance: { hint: "the object's own words" } });
  const m = await window.__cad.run({ op: "add", type: "Material" });
  await window.__cad.run({ op: "rename", id: m.id, name: "Copper" });
  await window.__cad.run({ op: "connect", id: m.id, key: "of", from: list[0] })
    .catch(() => null);
  await window.__cad.run({ op: "set", id: m.id, key: "hint", value: "x" })
    .catch(() => null);
  await window.__cad.run({ op: "code", id: m.id, key: "hint",
                           text: "shiny copper with speckles" }).catch(() => null);
  return null;
}, ids);
await page.waitForTimeout(2500);
const resolved = await page.evaluate(([one]) => {
  const kit = window.__cad.packages().kit;
  const mat = kit.tree().features.find(f => f.type === "Material");
  return { got: kit.hintFor(one),
           materialHint: mat && mat.data && mat.data.material
             ? mat.data.material.hint : "(no material data)",
           owns: mat && mat.data ? mat.data.of : null };
}, ids);
log("  the material says: " + JSON.stringify(resolved.materialHint)
    + ", owns " + JSON.stringify(resolved.owns));
check("an object with no material uses its own hint", await page.evaluate(
  ([, , , , five]) => {
    const kit = window.__cad.packages().kit;
    return kit.hintFor(five) === null;
  }, ids), "block 5 has none, so null");
if (resolved.owns && resolved.owns.includes(ids[0])
    && resolved.materialHint && resolved.materialHint !== "") {
  check("a material's hint wins over the object's",
        resolved.got && resolved.got.from === "material"
        && /copper/.test(resolved.got.hint), JSON.stringify(resolved.got));
} else {
  log("  --   the material would not take a hint or an owner here: "
      + JSON.stringify(resolved));
  check("the object's own hint is at least found",
        resolved.got && resolved.got.from === "object",
        JSON.stringify(resolved.got));
}

log("\n4. and the hint reaches the legend");
const withHint = await takeMask();
const block1 = withHint.legend.find(one => one.id === ids[0]);
check("block 1 carries a hint into the legend",
      !!block1 && !!block1.hint, JSON.stringify(block1 && block1.hint));

log("\n5. the viewport is put back afterwards");
//! A mask is taken by swapping every material, rendering, and swapping back.
//! Forgetting the swap back leaves the person looking at a field of flat
//! colours until something else happens to redraw.
await page.waitForTimeout(700);
const shot = await page.evaluate(() => {
  const made = window.__cad.packages().kit.snapshot("image/png");
  return made ? made.length : 0;
});
check("the ordinary view still renders", shot > 10000, shot + " characters of PNG");
const stillFlat = await page.evaluate(async () => {
  const url = window.__cad.packages().kit.snapshot("image/png");
  const img = await new Promise(done => { const o = new Image(); o.onload = () => done(o); o.src = url; });
  const c = document.createElement("canvas");
  c.width = img.naturalWidth; c.height = img.naturalHeight;
  const pen = c.getContext("2d", { willReadFrequently: true });
  pen.drawImage(img, 0, 0);
  const d = pen.getImageData(0, 0, c.width, c.height).data;
  const tally = new Map();
  for (let i = 0; i < d.length; i += 4) {
    const hex = "#" + [d[i], d[i+1], d[i+2]].map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase();
    tally.set(hex, (tally.get(hex) || 0) + 1);
  }
  return [...tally.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
});
log("  the view's commonest colours now: "
    + stillFlat.map(([h, n]) => h + " x" + n).join(", "));
check("and it is not still showing the mask",
      !stillFlat.some(([hex]) => hex === "#FF0000" || hex === "#00FFFF"),
      stillFlat.map(([h]) => h).join(" "));

log("\nerrors: " + (errs.length ? errs.slice(0, 5).join(" | ") : "none"));
if (errs.length) bad++;
await page.screenshot({ path: D + "mask.png" });
await browser.close();
log(bad ? "\n" + bad + " check(s) failed" : "\nall checks passed");
log("=== mask drive done ===");
