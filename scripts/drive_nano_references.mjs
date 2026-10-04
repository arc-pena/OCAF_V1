// THE REFERENCE PANEL, on the real page.
//
// Three ways in, and one of them has a trap in it: the page already listens
// for a drop on the WINDOW, and two or more images dropped together are read
// as a PBR material and installed as Texture nodes in the document. That is
// the right answer for the window and exactly the wrong one for a mood board,
// so the panel catches the drop itself. Whether it does is not readable from
// the source - it depends on which phase the window's listener is on - so it
// is measured here, by counting the document's nodes before and after.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "refs.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1100, height: 780 } });
page.setDefaultTimeout(180000);
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
await page.evaluate(() => document.querySelector(".nb-tab").click());
await page.waitForTimeout(400);

const nodes = () => page.evaluate(() => window.__cad.packages().kit.tree()
  .features.filter(f => f.type === "Material" || f.type === "Texture").length);
const rows = () => page.evaluate(() => document.querySelectorAll(".nb-ref").length);

log("1. a button on the bar, and a panel that closes");
check("the bar has a References button", await page.evaluate(() =>
  !!document.querySelector(".nb-refs-btn")));
check("the panel starts away", await page.evaluate(() =>
  document.querySelector(".nb-refs").hidden));
await page.evaluate(() => document.querySelector(".nb-refs-btn").click());
await page.waitForTimeout(350);
check("the button opens it", await page.evaluate(() =>
  !document.querySelector(".nb-refs").hidden));
check("it carries the page's own cross", await page.evaluate(() =>
  !!document.querySelector(".nb-refs .panel-shut")));
check("and it says what it is for while empty", await page.evaluate(() =>
  /style|material|street|light/.test(document.querySelector(".nb-refs-body").textContent)),
  await page.evaluate(() => document.querySelector(".nb-refs-body").textContent.slice(0, 60)));

log("\n2. opening a file");
await page.setInputFiles(".nb-file", ["/tmp/claude-0/big.png"]);
await page.waitForTimeout(1200);
check("one reference is listed", (await rows()) === 1, (await rows()) + " rows");
const first = await page.evaluate(() => {
  const row = document.querySelector(".nb-ref");
  return { thumb: (row.querySelector(".nb-thumb").src || "").slice(0, 22),
           role: row.querySelector(".nb-role").value,
           said: row.querySelector(".nb-fine").textContent };
});
check("with a thumbnail", /^data:image/.test(first.thumb), first.thumb);
check("and a role you can change", !!first.role, first.role);
//! THE SHRINK, MEASURED. The source is 2400 px wide on purpose: if it went
//! out at that size, six references would be a POST nothing sends.
check("it was drawn down to a workable size",
      /1024×/.test(first.said) && /from 2400/.test(first.said), first.said);

log("\n3. dropping on the panel does NOT install a material");
const before = await nodes();
const two = ["/tmp/claude-0/big.png", "/tmp/claude-0/stub.png"].map(p =>
  readFileSync(p).toString("base64"));
await page.evaluate(async pair => {
  const dt = new DataTransfer();
  pair.forEach((b64, i) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
    dt.items.add(new File([bytes], "mood" + i + ".png", { type: "image/png" }));
  });
  document.querySelector(".nb-refs").dispatchEvent(
    new DragEvent("drop", { dataTransfer: dt, bubbles: true, cancelable: true }));
}, two);
await page.waitForTimeout(1800);
check("both dropped pictures became references", (await rows()) === 3,
      (await rows()) + " rows");
//! THE WHOLE POINT OF CATCHING THE DROP ON THE PANEL. Two images dropped on
//! the window are a PBR material; dropped on the panel they must be a mood
//! board and nothing else.
check("and the document gained no Material or Texture nodes",
      (await nodes()) === before, before + " -> " + (await nodes()));

log("\n4. pasting one");
await page.evaluate(b64 => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
  const dt = new DataTransfer();
  dt.items.add(new File([bytes], "pasted.png", { type: "image/png" }));
  window.dispatchEvent(new ClipboardEvent("paste",
    { clipboardData: dt, bubbles: true, cancelable: true }));
}, two[1]);
await page.waitForTimeout(1500);
check("a pasted picture becomes a reference", (await rows()) === 4,
      (await rows()) + " rows");

log("\n5. a URL");
//! SAME ORIGIN, so this measures the code rather than somebody else's CORS
//! header. A cross-origin picture is refused by the browser before the fetch
//! starts and the panel says so by name - that path cannot be driven here
//! without depending on a third party staying up.
await page.evaluate(() => {
  const url = document.querySelector(".nb-url");
  url.value = "http://127.0.0.1:8199/data/materials/Concrete034/colour.jpg";
  document.querySelector(".nb-url-add").click();
});
await page.waitForTimeout(2500);
check("a URL adds one too", (await rows()) === 5, (await rows()) + " rows");

log("\n6. switching one off, and naming what each is for");
await page.evaluate(() => {
  const rows = [...document.querySelectorAll(".nb-ref")];
  rows[0].querySelector(".nb-role").value = "style";
  rows[0].querySelector(".nb-role").dispatchEvent(new Event("change"));
  rows[1].querySelector(".nb-role").value = "material";
  rows[1].querySelector(".nb-role").dispatchEvent(new Event("change"));
  const note = rows[0].querySelector(".nb-ref-note");
  note.value = "the one with the deep shadows";
  note.dispatchEvent(new Event("input"));
  //! The last one is switched OFF: a reference kept but not sent is the
  //! difference between a mood board and a queue.
  rows[4].querySelector(".nb-ref-use").click();
});
await page.waitForTimeout(600);
check("the count on the button follows what is switched on", await page.evaluate(() =>
  /References 4/.test(document.querySelector(".nb-refs-btn").textContent)),
  await page.evaluate(() => document.querySelector(".nb-refs-btn").textContent));
check("and the footer says how many will go", await page.evaluate(() =>
  /4 of 5/.test(document.querySelector(".nb-refs-note").textContent)),
  await page.evaluate(() => document.querySelector(".nb-refs-note").textContent));

log("\n7. and the call carries them, in order, with the view last");
const PNG = readFileSync("/tmp/claude-0/stub.png").toString("base64");
await page.evaluate(b64 => {
  window.__sent = null;
  window.fetch = async (url, opts) => {
    window.__sent = { body: JSON.parse(opts.body) };
    return { status: 200, text: async () =>
      JSON.stringify({ interaction: { outputImage: { data: b64 } } }) };
  };
}, PNG);
await page.evaluate(() => {
  const key = document.querySelector(".nb-key");
  key.value = "not-a-real-key";
  key.dispatchEvent(new Event("input"));
  const p = document.querySelector(".nb-prompt");
  p.value = "an evening photograph of this";
  p.dispatchEvent(new Event("input"));
});
await page.evaluate(() => document.querySelector(".nb-send").click());
await page.waitForTimeout(2500);
const sent = await page.evaluate(() => window.__sent);
const images = sent ? sent.body.input.filter(one => one.type === "image") : [];
check("four references and the view were sent", images.length === 5,
      images.length + " images");
check("the text leads",
      sent && sent.body.input[0].type === "text");
check("the brief names each one and the view last",
      /Image 1 is a style reference/.test(sent.body.input[0].text)
      && /Image 2 is a material reference/.test(sent.body.input[0].text)
      && /Image 5 is the view to work on/.test(sent.body.input[0].text),
      (sent.body.input[0].text.match(/Image \d is the view[^.]*/) || ["missing"])[0]);
check("the note typed on a reference went with it",
      /deep shadows/.test(sent.body.input[0].text));
check("and the person's own prompt is still there",
      /an evening photograph of this/.test(sent.body.input[0].text));
//! THE VIEW IS THE BIG ONE - a 1100x780 grab is far larger than a 1024 px
//! reference - which is a cheap way to confirm the last image really is the
//! viewport and not the fifth photograph.
const last = images[images.length - 1].data.length;
check("the last image is the viewport grab", last > 60000,
      Math.round(last * 0.75 / 1024) + " kB last, references "
        + images.slice(0, 4).map(one => Math.round(one.data.length * 0.75 / 1024)).join("/") + " kB");

log("\n8. and the gallery remembers what it was made from");
await page.evaluate(() => document.querySelector(".nb-shelf-btn").click());
await page.waitForTimeout(500);
check("the entry says how many references went with it", await page.evaluate(() =>
  /4 references/.test(document.querySelector(".nb-item").textContent)),
  await page.evaluate(() => document.querySelector(".nb-item .nb-fine").textContent));

log("\nerrors: " + (errs.length ? errs.slice(0, 5).join(" | ") : "none"));
if (errs.length) bad++;
await page.screenshot({ path: D + "refs.png" });
await browser.close();
log(bad ? "\n" + bad + " check(s) failed" : "\nall checks passed");
log("=== refs drive done ===");
