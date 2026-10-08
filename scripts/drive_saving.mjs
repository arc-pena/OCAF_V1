// SAVING FROM A WEB SERVER, which is where it did not work.
//
// The page has a save LADDER: the viewer's own downloads surface if there is
// one, then the browser's ordinary anchor download, then the text on screen.
// Only the PNG export had the middle rung; every text export - STEP, BREP,
// OBJ, STL, DXF and the model file - went straight from "no viewer surface" to
// "here is a text box", and refused anything over two megabytes outright. So
// the page saved files inside the Artifact and would not save them from a
// server, which is exactly backwards.
//
// There is no way to check this except in a browser: `claude` is undefined
// here, which is the whole point, and what has to be observed is a download
// actually starting.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "saving.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1000, height: 700 },
                                     acceptDownloads: true });
page.setDefaultTimeout(300000);
const errs = [];
page.on("pageerror", e => errs.push(String(e.message).slice(0, 200)));
const three = readFileSync("/tmp/claude-0/three/package/build/three.min.js", "utf8");
await page.route("**/three.min.js", r => r.fulfill({ contentType: "application/javascript", body: three }));
await page.addInitScript(() => { try { localStorage.setItem("ocafcad/tour-seen", "yes"); } catch (e) {} });
await page.goto("http://127.0.0.1:8199/index.html", { waitUntil: "commit" });
await page.waitForFunction(() => document.querySelectorAll("#tree .node").length > 0);

check("there is no viewer save surface here, which is the case under test",
      await page.evaluate(() => typeof claude === "undefined"));

//! Something to export: a body, so the geometry formats have geometry.
await page.evaluate(async () => {
  const o = await window.__cad.run({ op: "add", type: "Point" });
  const c = await window.__cad.run({ op: "add", type: "Cube", refs: { origin: o.id } });
  for (const k of ["dx", "dy", "dz"]) await window.__cad.run({ op: "set", id: c.id, key: k, value: 120 });
});
await page.waitForTimeout(2500);

//! The export runs behind a menu; what is under test is the saving, not the
//! menu, so it is called the way the menu calls it.
for (const [key, ending] of [["model", ".model.json"], ["step", ".step"],
                             ["obj", ".obj"], ["stl", ".stl"]]) {
  let got = null;
  try {
    const [download] = await Promise.all([
      page.waitForEvent("download", { timeout: 120000 }),
      page.evaluate(k => window.__cad.exportAs(k), key),
    ]);
    got = download.suggestedFilename();
  } catch (err) { got = "(no download: " + String(err.message).split("\n")[0] + ")"; }
  check(key + " downloads a file", !!got && got.endsWith(ending), got);
}

//! And the text box is NOT what happens any more - a dialog standing open
//! would mean the ladder fell through to its bottom rung.
check("no 'copy this text' dialog was needed",
      await page.evaluate(() => { const d = document.getElementById("step-dialog");
        return !d || !d.open; }));

check("no page errors", errs.length === 0, errs.join(" | "));
log(bad ? "\n" + bad + " FAILED" : "\nall good");
await browser.close();
process.exit(bad ? 1 : 0);
