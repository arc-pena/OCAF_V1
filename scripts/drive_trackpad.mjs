// TRACKPAD NAVIGATION, on the real page.
//
// WHAT THIS CANNOT DO, said first: there is no Mac and no trackpad here. So
// this does not prove the feature works on somebody's laptop - it proves that
// wheel events SHAPED like a trackpad's move the camera the way Blender does,
// and that wheel events shaped like a mouse's still only zoom. The gap between
// those two statements is the shape of the events, which is the one thing
// taken from published values rather than measured.
import { chromium } from "/tmp/claude-0/node_modules/playwright/index.mjs";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
const D = process.env.DRIVE_OUT || "/tmp/";
const LOG = D + "pad.out"; writeFileSync(LOG, "");
const log = (...a) => appendFileSync(LOG, a.join(" ") + "\n");
let bad = 0;
const check = (name, ok, detail = "") => {
  if (!ok) bad++;
  log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  - " + detail : ""));
};
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 900, height: 640 } });
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
await page.evaluate(() => window.__cad.fit());
await page.waitForTimeout(700);

//! THE CAMERA, as four numbers. Everything below is a before-and-after on
//! these: an orbit moves yaw and pitch and nothing else, a pan moves the
//! target and nothing else, a zoom moves the distance and nothing else. That
//! last clause is the one that catches a gesture doing two things at once.
const camera = () => page.evaluate(() => ({
  yaw: +window.__cad.view.yaw.toFixed(6),
  pitch: +window.__cad.view.pitch.toFixed(6),
  distance: +window.__cad.view.distance.toFixed(4),
  target: window.__cad.view.target.toArray().map(v => +v.toFixed(3)),
}));
//! Dispatched onto the canvas as a real WheelEvent, so it goes through the
//! page's own listener with its own preventDefault and its own classifier.
const wheel = (bits, times = 1, gap = 8) => page.evaluate(
  async ([one, n, ms]) => {
    const el = document.querySelector("#viewport canvas");
    for (let i = 0; i < n; i++) {
      el.dispatchEvent(new WheelEvent("wheel", {
        deltaX: one.deltaX || 0, deltaY: one.deltaY || 0,
        deltaMode: one.deltaMode || 0,
        ctrlKey: !!one.ctrlKey, shiftKey: !!one.shiftKey, metaKey: !!one.metaKey,
        bubbles: true, cancelable: true,
      }));
      if (ms) await new Promise(go => setTimeout(go, ms));
    }
  }, [bits, times, gap]);
const kindNow = () => page.evaluate(() => window.__cad.pointerKind
  ? window.__cad.pointerKind() : "(no hook)");

log("1. a mouse wheel still only zooms, which is the promise to everybody else");
{
  const was = await camera();
  await wheel({ deltaY: 100 }, 3, 120);
  const now = await camera();
  check("the device reads as a mouse", (await kindNow()) === "mouse", await kindNow());
  check("the distance changed", now.distance !== was.distance,
        was.distance + " -> " + now.distance);
  //! TWELVE PER CENT A NOTCH, three notches: 1.12^3 = 1.404928.
  check("by twelve per cent a notch",
        Math.abs(now.distance / was.distance - Math.pow(1.12, 3)) < 0.002,
        (now.distance / was.distance).toFixed(5) + " against " + Math.pow(1.12, 3).toFixed(5));
  check("and nothing else moved",
        now.yaw === was.yaw && now.pitch === was.pitch
        && now.target.join() === was.target.join(),
        JSON.stringify({ yaw: now.yaw - was.yaw, pitch: now.pitch - was.pitch }));
}

log("\n2. a trackpad swipe orbits");
{
  await page.reload({ waitUntil: "commit" });
  await page.waitForFunction(() => document.querySelectorAll("#tree .node").length > 0);
  await page.waitForTimeout(2500);
  await page.evaluate(() => window.__cad.fit());
  await page.waitForTimeout(600);
  const was = await camera();
  //! A two-finger swipe: fractional, both axes, a few milliseconds apart.
  await wheel({ deltaX: 6.25, deltaY: -4.5 }, 8, 8);
  const now = await camera();
  check("the device reads as a trackpad", (await kindNow()) === "trackpad",
        await kindNow());
  check("the yaw turned", now.yaw !== was.yaw,
        was.yaw + " -> " + now.yaw);
  check("and the pitch tilted", now.pitch !== was.pitch,
        was.pitch + " -> " + now.pitch);
  //! THE ARITHMETIC. Eight events of 6.25 at 0.0026 radians per unit is
  //! 8 x 6.25 x 0.0026 = 0.13 radians, subtracted from the yaw.
  check("by the published rate, to the radian",
        Math.abs((was.yaw - now.yaw) - 8 * 6.25 * 0.0026) < 1e-6,
        "turned " + (was.yaw - now.yaw).toFixed(6) + ", expected "
          + (8 * 6.25 * 0.0026).toFixed(6));
  //! AND THE RIGHT WAY ROUND, which this drive did not check and should have.
  //! It measured the MAGNITUDE of the turn and was satisfied, so it passed on
  //! a vertical axis that was inverted - reported from a real trackpad as
  //! "when you drag down it moves up". A rate with no direction in it is half
  //! a measurement.
  //!
  //! Fingers down the pad arrive as a NEGATIVE deltaY on macOS, and a pointer
  //! dragged down raises the pitch - so a swipe down must raise it too.
  const before = await camera();
  await wheel({ deltaX: 0, deltaY: -10 }, 4, 8);
  const tilted = await camera();
  check("swiping down tilts the way dragging down does",
        tilted.pitch > before.pitch,
        "pitch " + before.pitch + " -> " + tilted.pitch);
  //! Fingers right arrive as a positive deltaX, and a pointer dragged right
  //! lowers the yaw - confirmed correct on a real trackpad before the fix.
  const side = await camera();
  await wheel({ deltaX: 10, deltaY: 0 }, 4, 8);
  const turned = await camera();
  check("and swiping right turns the way dragging right does",
        turned.yaw < side.yaw, "yaw " + side.yaw + " -> " + turned.yaw);
  //! AND IT DID NOT ALSO ZOOM, which is the thing that would make a swipe
  //! unusable without being obviously wrong.
  check("the distance did not change", now.distance === was.distance,
        was.distance + " -> " + now.distance);
  check("nor did the target", now.target.join() === was.target.join(),
        was.target.join() + " -> " + now.target.join());
}

log("\n3. shift and a swipe pans");
{
  const was = await camera();
  await wheel({ deltaX: 6.25, deltaY: -4.5, shiftKey: true }, 6, 8);
  const now = await camera();
  check("the target moved", now.target.join() !== was.target.join(),
        was.target.join() + " -> " + now.target.join());
  //! AND THE PAN AGREES WITH THE ORBIT about which way is which. The two used
  //! to derive their axes separately - the orbit took deltaX as it came, the
  //! pan negated it - so sideways meant two different things and fixing one
  //! would have left the other wrong in the opposite direction.
  const pre = await camera();
  await wheel({ deltaX: 10, deltaY: -10, shiftKey: true }, 4, 8);
  const panned = await camera();
  const moved = [0, 1, 2].map(i => panned.target[i] - pre.target[i]);
  check("a shift-swipe down and right moves the target, not the camera",
        moved.some(v => Math.abs(v) > 1e-6)
        && panned.yaw === pre.yaw && panned.pitch === pre.pitch,
        "target by " + moved.map(v => v.toFixed(2)).join(",")
          + ", yaw " + (panned.yaw - pre.yaw));
  check("and the camera did not turn",
        now.yaw === was.yaw && now.pitch === was.pitch,
        "yaw " + (now.yaw - was.yaw) + ", pitch " + (now.pitch - was.pitch));
  check("nor change distance", now.distance === was.distance,
        was.distance + " -> " + now.distance);
}

log("\n4. a pinch zooms");
{
  const was = await camera();
  //! macOS reports a pinch as a wheel event with ctrlKey set, synthesised.
  await wheel({ deltaY: 12, ctrlKey: true }, 4, 10);
  const now = await camera();
  check("the distance changed", now.distance !== was.distance,
        was.distance + " -> " + now.distance);
  //! exp(12 x 0.01) per event, four events: exp(0.48) = 1.616074.
  check("by the published rate",
        Math.abs(now.distance / was.distance - Math.exp(4 * 12 * 0.01)) < 0.01,
        (now.distance / was.distance).toFixed(5) + " against "
          + Math.exp(0.48).toFixed(5));
  check("and nothing turned",
        now.yaw === was.yaw && now.pitch === was.pitch);
  //! REVERSIBLE, which a linear zoom is not: pinching back the same amount
  //! has to land where it started.
  await wheel({ deltaY: -12, ctrlKey: true }, 4, 10);
  const back = await camera();
  check("pinching back returns to where it was",
        Math.abs(back.distance - was.distance) < 0.01,
        was.distance + " -> " + now.distance + " -> " + back.distance);
}

log("\n5. and the preference overrules the guess");
{
  //! A MAC WITH A MOUSE IN IT is the case the override exists for: the page
  //! has already decided this device is a trackpad, and saying "mouse" has to
  //! put the wheel back to a zoom at once.
  check("it is still reading as a trackpad", (await kindNow()) === "trackpad",
        await kindNow());
  await page.evaluate(() => window.__cad.pointerWant("mouse"));
  check("the preference takes effect", (await kindNow()) === "mouse", await kindNow());
  const was = await camera();
  await wheel({ deltaX: 6.25, deltaY: -4.5 }, 3, 8);
  const now = await camera();
  check("a swipe now zooms rather than orbiting",
        now.yaw === was.yaw && now.distance !== was.distance,
        "yaw " + (now.yaw - was.yaw) + ", distance " + was.distance + " -> " + now.distance);
  await page.evaluate(() => window.__cad.pointerWant("trackpad"));
  const forced = await camera();
  await wheel({ deltaY: 100 }, 2, 200);
  const after = await camera();
  //! A NOTCH HAS NO SIDEWAYS COMPONENT, so it tilts the pitch and leaves the
  //! yaw alone. The first version of this check asked about the yaw and
  //! reported "yaw -0.85 -> -0.85" as a failure - the probe encoding a wrong
  //! model of the thing it was measuring, which the printed numbers are what
  //! made obvious.
  check("and forcing trackpad makes even a notch orbit",
        after.pitch !== forced.pitch && after.distance === forced.distance,
        "pitch " + forced.pitch + " -> " + after.pitch
          + ", distance held at " + after.distance);
  //! THE EXPECTATION CARRIES PAD_Y, because a notch's deltaY goes through the
  //! same axis convention a swipe does: 100 reported becomes -100 of
  //! finger-equivalent movement. Written out as -1 rather than left implicit,
  //! so that the number here and the constant in the module are visibly the
  //! same decision - this check failed with "tilted -0.520000, expected
  //! 0.520000" when the module was corrected and the drive was not.
  const PAD_Y = -1;
  check("by the trackpad rate, not the wheel's",
        Math.abs((after.pitch - forced.pitch) - 2 * 100 * 0.0026 * PAD_Y) < 1e-6,
        "tilted " + (after.pitch - forced.pitch).toFixed(6) + ", expected "
          + (2 * 100 * 0.0026 * PAD_Y).toFixed(6));
  await page.evaluate(() => window.__cad.pointerWant("auto"));
}

log("\nerrors: " + (errs.length ? errs.slice(0, 5).join(" | ") : "none"));
if (errs.length) bad++;
await browser.close();
log(bad ? "\n" + bad + " check(s) failed" : "\nall checks passed");
log("=== pad drive done ===");
