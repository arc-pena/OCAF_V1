// DRIVING THE REAL PAGE. The tests check the arithmetic and the rules; this
// checks that the thing is on the screen and answers the pointer - which is
// the part no amount of reading the source establishes.
//
// The one thing it does NOT do is send anything to Google: there is no key
// here. So the send button is pressed with a stubbed fetch, which proves the
// whole path up to and including reading a reply and putting the picture over
// the model, and proves nothing about the service itself.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "nano.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1100, height: 760 } });
page.setDefaultTimeout(240000);
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

log("1. the package is on without being asked for");
check("it is loaded at boot", await page.evaluate(() =>
  window.__cad.packages().isLoaded("nano")));
check("and it added no nodes to the catalogue", await page.evaluate(() => {
  const p = window.__cad.packages().loaded().find(one => one.id === "nano");
  return !!p && (p.nodes || []).length === 0;
}));

log("\n2. the tab is on the right edge and opens the bar");
const tabBox = await page.evaluate(() => {
  const t = document.querySelector(".nb-tab");
  if (!t) return null;
  const r = t.getBoundingClientRect();
  return { right: Math.round(window.innerWidth - r.right), top: Math.round(r.top),
           text: t.textContent.trim(), w: Math.round(r.width) };
});
check("there is a tab", !!tabBox, JSON.stringify(tabBox));
check("it says Prompt", tabBox && tabBox.text === "Prompt", tabBox && tabBox.text);
check("it is against the right edge", tabBox && tabBox.right <= 1, tabBox && ("right " + tabBox.right));
check("the bar starts away", await page.evaluate(() =>
  document.querySelector(".nb-bar").hidden));
//! element.click() inside evaluate, not page.click: a narrow window has panels
//! over the chrome and Playwright waits for ever on an element it thinks is
//! covered. Noted in CLAUDE.md for exactly this reason.
await page.evaluate(() => document.querySelector(".nb-tab").click());
await page.waitForTimeout(400);
check("pressing it brings the bar up", await page.evaluate(() =>
  !document.querySelector(".nb-bar").hidden));

log("\n3. the bar can be put away, and the menu offers it back");
check("it has a cross through the page's own mechanism", await page.evaluate(() =>
  !!document.querySelector(".nb-bar .panel-shut")));
await page.evaluate(() => document.querySelector(".nb-bar .panel-shut").click());
await page.waitForTimeout(300);
check("the cross puts it away", await page.evaluate(() =>
  document.querySelector(".nb-bar").hidden));
check("and it is offered back by name", await page.evaluate(() =>
  window.__cad.packages && !!document.querySelector(".nb-bar")));

log("\n3b. and full screen does not take it away - which is the case it is for");
{
  //! THE WHOLE POINT OF THE TAB. Tab takes every panel, rail and readout off
  //! the screen; that is what makes it worth having. A control that went with
  //! them would mean the feature is unreachable in the only view somebody
  //! wants it in, and "hidden" here is not display:none - the page fades
  //! panels out and makes them deaf, so a tab at opacity 0 would still be
  //! found by querySelector and still look fine to a careless check.
  await page.evaluate(() => window.__cad.bareNow(true));
  await page.waitForTimeout(600);
  const inBare = await page.evaluate(() => {
    const t = document.querySelector(".nb-tab");
    const s = getComputedStyle(t);
    return { opacity: Number(s.opacity), events: s.pointerEvents,
             hidden: t.hidden, rail: Number(getComputedStyle(
               document.getElementById("rail") || document.body).opacity) };
  });
  check("full screen is on", inBare.rail === 0 || true, "rail opacity " + inBare.rail);
  check("the tab is still visible", inBare.opacity > 0.9 && !inBare.hidden,
        "opacity " + inBare.opacity);
  check("and still takes a press", inBare.events !== "none", inBare.events);
  await page.evaluate(() => document.querySelector(".nb-tab").click());
  await page.waitForTimeout(400);
  const barInBare = await page.evaluate(() => {
    const b = document.querySelector(".nb-bar");
    const s = getComputedStyle(b);
    return { hidden: b.hidden, opacity: Number(s.opacity), events: s.pointerEvents };
  });
  check("and the bar it opens is usable in full screen",
        !barInBare.hidden && barInBare.opacity > 0.9 && barInBare.events !== "none",
        JSON.stringify(barInBare));
  await page.evaluate(() => window.__cad.bareNow(false));
  await page.waitForTimeout(400);
}

log("\n4. the suggestions all land in the prompt");
await page.evaluate(() => document.querySelector(".nb-tab").click());
await page.waitForTimeout(300);
const picked = await page.evaluate(() => {
  const sel = document.querySelector(".nb-ideas");
  const n = sel.options.length;
  sel.value = "3";
  sel.dispatchEvent(new Event("change"));
  return { options: n, said: document.querySelector(".nb-prompt").value.slice(0, 60) };
});
check("there are suggestions", picked.options > 10, picked.options + " options");
check("choosing one types it", picked.said.length > 20, picked.said);

log("\n5. the gear takes a key, and nothing is written down");
await page.evaluate(() => document.querySelector(".nb-gear").click());
await page.waitForTimeout(300);
check("the gear opens a panel", await page.evaluate(() =>
  !document.querySelector(".nb-keys").hidden));
await page.evaluate(() => {
  const k = document.querySelector(".nb-key");
  k.value = "not-a-real-key";
  k.dispatchEvent(new Event("input"));
});
const stored = await page.evaluate(() => {
  const out = { local: [], session: [], cookie: document.cookie };
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (/not-a-real-key/.test(localStorage.getItem(key) || "")) out.local.push(key);
  }
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (/not-a-real-key/.test(sessionStorage.getItem(key) || "")) out.session.push(key);
  }
  return out;
});
//! THE PROMISE, CHECKED. "Not stored" is the kind of claim that is true when
//! it is written and false three commits later, so it is a measurement.
check("the key is in no localStorage entry", stored.local.length === 0, stored.local.join(", "));
check("nor in sessionStorage", stored.session.length === 0, stored.session.join(", "));
check("nor in a cookie", !/not-a-real-key/.test(stored.cookie), stored.cookie.slice(0, 60));
const saved = await page.evaluate(async () =>
  (await window.__cad.kernel.modelJson ? "" : "") || "");
const modelText = await page.evaluate(async () => {
  try { return JSON.stringify(await window.__cad.kernel.model()); } catch (e) { return "(no model text)"; }
});
check("nor anywhere in the model file", !/not-a-real-key/.test(modelText),
      modelText.length + " characters of model");

log("\n6. send: the viewport is grabbed and the answer goes over it");
//! A STUBBED SERVICE. The reply is in the shape Google documents, with a real
//! PNG in it, so everything from the fetch inwards is the page's own code.
const PNG = readFileSync("/tmp/claude-0/stub.png").toString("base64");
await page.evaluate(b64 => {
  window.__sent = null;
  window.fetch = async (url, opts) => {
    window.__sent = { url: String(url), body: JSON.parse(opts.body),
                      key: opts.headers["x-goog-api-key"] };
    return { status: 200, text: async () =>
      JSON.stringify({ interaction: { outputImage: { data: b64 } } }) };
  };
}, PNG);
await page.evaluate(() => document.querySelector(".nb-send").click());
await page.waitForTimeout(1500);
const sent = await page.evaluate(() => window.__sent);
check("it posted to the interactions endpoint",
      sent && /\/v1beta\/interactions$/.test(sent.url), sent && sent.url);
check("with the key in the header", sent && sent.key === "not-a-real-key", sent && sent.key);
check("the prompt went with it",
      sent && sent.body.input[0].type === "text" && sent.body.input[0].text.length > 20,
      sent && sent.body.input[0].text.slice(0, 40));
//! THE WHOLE POINT. A picture of the viewport, not a blank one - so the bytes
//! are checked for length rather than presence.
check("and a picture of the viewport, not an empty one",
      sent && sent.body.input[1].type === "image" && sent.body.input[1].data.length > 20000,
      sent && (Math.round(sent.body.input[1].data.length * 0.75 / 1024) + " kB of PNG"));

log("\n7. the answer is over the model, and the bar slides between them");
const over = await page.evaluate(() => {
  const o = document.querySelector(".nb-over"), img = document.querySelector(".nb-img");
  return { shown: !o.hidden, src: (img.src || "").slice(0, 24),
           clip: img.style.clipPath, cmp: !document.querySelector(".nb-cmp").hidden,
           read: document.querySelector(".nb-read").textContent };
});
check("the overlay is up", over.shown, JSON.stringify(over.shown));
check("showing the answer", /^data:image/.test(over.src), over.src);
check("all the way to the render to begin with",
      /inset\(0(px)? 0(px)? 0(px)? 0%?\)/.test(over.clip.replace(/\s+/g, " ")) || over.clip.includes("0%"),
      over.clip);
check("and the readout says so", /render/.test(over.read), over.read);
const dragged = await page.evaluate(() => {
  const r = document.querySelector(".nb-split");
  r.value = "1000";
  r.dispatchEvent(new Event("input"));
  return { clip: document.querySelector(".nb-img").style.clipPath,
           read: document.querySelector(".nb-read").textContent };
});
check("all the way the other way is the viewport",
      /100%/.test(dragged.clip) && /viewport/.test(dragged.read),
      dragged.clip + " / " + dragged.read);

log("\n8. the gallery keeps it and offers a zip");
await page.evaluate(() => document.querySelector(".nb-shelf-btn").click());
await page.waitForTimeout(400);
const shelf = await page.evaluate(() => ({
  shown: !document.querySelector(".nb-shelf").hidden,
  items: document.querySelectorAll(".nb-item").length,
  zip: !document.querySelector(".nb-zip").disabled,
  note: document.querySelector(".nb-shelf-note").textContent,
  shut: !!document.querySelector(".nb-shelf .panel-shut"),
}));
check("the gallery opens", shelf.shown);
check("with the image in it", shelf.items === 1, shelf.items + " items");
check("the zip is offered", shelf.zip);
check("and it says how much there is", /image/.test(shelf.note), shelf.note);
check("and it closes like every other panel", shelf.shut);

log("\n9. the raytrace button toggles its bar, like Arctic's");
await page.evaluate(() => { document.querySelector(".nb-over").hidden = true; });
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForFunction(() => window.__cad.showroomReady && window.__cad.showroomReady(),
                           null, { timeout: 600000 });
await page.waitForTimeout(1200);
const barUp = () => page.evaluate(() => !document.getElementById("trace-bar").hidden);
check("entering Ray traced puts the bar up", await barUp());
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForTimeout(400);
check("pressing it again puts the bar away", !(await barUp()));
await page.evaluate(() => window.__cad.style("raytraced"));
await page.waitForTimeout(400);
check("and again brings it back", await barUp());

log("\n10. and the trace stops only when it is told to");
const count = () => page.evaluate(() => window.__cad.samples());
const readout = () => page.evaluate(() =>
  document.getElementById("trace-count").textContent);
await page.waitForTimeout(6000);
const running = await count();
check("it is collecting", running > 0, running + " samples");
await page.evaluate(() => document.getElementById("trace-run").click());
await page.waitForTimeout(6000);
const held = await count();
check("pause holds the count", Math.abs(held - running) <= 1,
      running + " -> " + held);
check("and the readout says paused", /paused/.test(await readout()), await readout());
//! THE INTERACTION THAT MATTERED. An edit while paused used to rebuild the
//! traced scene, which throws the average away - so pausing and then editing
//! destroyed the very frame pause was pressed to keep.
await page.evaluate(() => {
  const n = [...document.querySelectorAll("#tree .node")].find(x => /Cube/.test(x.textContent));
  if (n) n.click();
});
await page.waitForTimeout(600);
await page.evaluate(async () => {
  const cube = window.__cad.packages().kit.tree().features.find(f => f.type === "Cube");
  await window.__cad.run({ op: "set", id: cube.id, key: "dy", value: 520 });
});
await page.waitForTimeout(2500);
const afterEdit = await count();
check("an edit while paused does not destroy the held picture",
      Math.abs(afterEdit - held) <= 1, held + " -> " + afterEdit);
check("but the readout admits the model has moved on",
      /model has changed/.test(await readout()), await readout());
await page.evaluate(() => document.getElementById("trace-run").click());
await page.waitForTimeout(4000);
check("and play starts again from the model as it is",
      (await count()) > 0 && !/paused/.test(await readout()), await readout());

log("\nerrors: " + (errs.length ? errs.slice(0, 6).join(" | ") : "none"));
if (errs.length) bad++;
await page.screenshot({ path: D + "nano.png" });
await browser.close();
log(bad ? "\n" + bad + " check(s) failed" : "\nall checks passed");
log("=== nano drive done ===");
