// Telling a trackpad from a wheel, and what a swipe on one means.
//
// WHAT THIS CANNOT CHECK, first, because it is the most important thing about
// the whole feature: no Mac trackpad has touched this code. These tests run in
// a Linux container with no trackpad in it, so there is no way from here to
// confirm that a real two-finger swipe produces the deltas assumed below. What
// IS checked is the classifier against event shapes - the quantised notches a
// wheel sends and the fractional two-axis streams a trackpad sends, including
// the specific values browsers are known to report - and the mapping against
// arithmetic that can be worked out on paper.
//
// So the useful question for this file is not "does it work on a Mac" but
// "when it is wrong, will anybody be able to tell why". Every check below
// names the device it is pretending to be.

import {
  PAD_X, PAD_Y, SURE_AT, TRACKPAD_ORBIT, TRACKPAD_ZOOM, WHEEL_NOTCH, WHEEL_ZOOM,
  classifyWheel, gestureFor, looksLikeMac, newPointerMemory,
} from "../src/trackpad.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

//! A STREAM OF EVENTS, classified in order, the way the handler sees them.
const feed = events => {
  const memory = newPointerMemory();
  const said = events.map(one => classifyWheel(one, memory));
  return { kind: said[said.length - 1], said, memory };
};
//! The two devices, as they actually report. A wheel notch is a big whole
//! number on one axis; a trackpad swipe is a stream of small, often
//! fractional, two-axis deltas a few milliseconds apart.
const wheelNotches = (n, step = 100) =>
  Array.from({ length: n }, (_, i) =>
    ({ deltaX: 0, deltaY: step, deltaMode: 0, timeStamp: i * 120 }));
const padSwipe = (n, dy = 4.5, dx = 1.25) =>
  Array.from({ length: n }, (_, i) =>
    ({ deltaX: dx, deltaY: dy, deltaMode: 0, timeStamp: i * 8 }));

console.log("1. a mouse wheel is recognised as a mouse");
{
  //! THE VALUES BROWSERS ACTUALLY SEND. 100 is Chrome's, 120 is the Windows
  //! convention, 53 and 57 are Firefox's on macOS. All whole, all one axis.
  for (const step of [53, 57, 100, 120, 240]) {
    const got = feed(wheelNotches(5, step));
    check("notches of " + step + " read as a mouse", got.kind === "mouse",
          got.kind + " after " + got.said.length + " events");
  }
  //! AND IT MUST NOT TAKE LONG. A wheel that spends half a second being
  //! classified is a wheel that zooms wrongly for half a second.
  const quick = feed(wheelNotches(2));
  check("two notches are enough to decide", quick.kind === "mouse",
        quick.said.join(" -> "));
  //! LINES OR PAGES ARE A NOTCHED DEVICE, whatever the numbers look like.
  const lines = feed(Array.from({ length: 3 }, (_, i) =>
    ({ deltaX: 0, deltaY: 3, deltaMode: 1, timeStamp: i * 120 })));
  check("deltas in lines read as a mouse", lines.kind === "mouse", lines.kind);
}

console.log("\n2. a trackpad is recognised as a trackpad");
{
  const got = feed(padSwipe(6));
  check("a two-axis fractional stream reads as a trackpad",
        got.kind === "trackpad", got.said.join(" -> "));
  //! A PINCH IS THE ONE NEAR-CERTAINTY. macOS browsers report one as a wheel
  //! event with ctrlKey set, synthesised; nothing else does that.
  const pinch = feed([{ deltaX: 0, deltaY: -8.5, deltaMode: 0,
                        ctrlKey: true, timeStamp: 0 }]);
  check("a single pinch settles it at once", pinch.kind === "trackpad",
        pinch.said.join(" -> "));
  //! AND IT STAYS SETTLED, because a trackpad swiped slowly can look like a
  //! wheel for an event or two and the mode must not flap mid-gesture.
  const memory = newPointerMemory();
  classifyWheel({ deltaX: 0, deltaY: -8.5, deltaMode: 0, ctrlKey: true, timeStamp: 0 }, memory);
  const after = wheelNotches(8).map(one => classifyWheel(one, memory));
  check("and nothing afterwards talks it out of it",
        after.every(one => one === "trackpad"),
        new Set(after).size + " distinct answers");

  //! A SLOW SWIPE, which is the hard case: whole numbers, one axis, but small
  //! and close together.
  const slow = feed(Array.from({ length: 8 }, (_, i) =>
    ({ deltaX: 0, deltaY: 2, deltaMode: 0, timeStamp: i * 10 })));
  check("a slow one-axis swipe of small whole steps still reads as a trackpad",
        slow.kind === "trackpad", slow.said.join(" -> "));
}

console.log("\n3. and the two are never confused in the direction that hurts");
{
  //! THE EXPENSIVE MISTAKE. A wheel read as a trackpad gets the trackpad's
  //! sensitivity, and a notch of 100 at the trackpad's zoom rate is a factor
  //! of e. One notch would cross the whole scene. So this case has to be
  //! right outright, not on balance.
  const memory = newPointerMemory();
  const once = classifyWheel({ deltaX: 0, deltaY: 100, deltaMode: 0, timeStamp: 0 }, memory);
  check("a single big notch never reads as a trackpad", once !== "trackpad", once);
  check("and the score is already leaning to the mouse", memory.score < 0,
        "score " + memory.score);
  //! A FAST FLICK ON A FREE-SPINNING WHEEL: notches close together, which is
  //! one of the trackpad signals - so the big whole step has to outweigh it.
  const flick = feed(Array.from({ length: 6 }, (_, i) =>
    ({ deltaX: 0, deltaY: 120, deltaMode: 0, timeStamp: i * 8 })));
  check("a fast flick of a wheel is still a mouse", flick.kind === "mouse",
        flick.said.join(" -> "));
  //! HOW FAST IT DECIDES, which is not the same as the threshold and the first
  //! version of this check confused the two. The threshold is on a SCORE, and
  //! an unambiguous trackpad event - fractional, two axes, small, quick -
  //! scores past it on its own. So a clear swipe is recognised on the first
  //! event, which is what somebody wants; only an ambiguous one takes several.
  check("an unmistakable swipe is recognised on the first event",
        feed(padSwipe(1)).kind === "trackpad", feed(padSwipe(1)).kind);
  //! AND THE THRESHOLD ITSELF, shown with a stream that leans by exactly one
  //! each time: whole numbers on one axis, small, and slow enough not to earn
  //! the quickness point. That takes SURE_AT events by construction, so a
  //! change to the constant shows up here rather than quietly altering how
  //! readily the mode flips.
  const crawl = n => feed(Array.from({ length: n }, (_, i) =>
    ({ deltaX: 0, deltaY: 3, deltaMode: 0, timeStamp: i * 200 })));
  check("a stream worth one point each takes " + SURE_AT + " of them",
        crawl(SURE_AT).kind === "trackpad" && crawl(SURE_AT - 1).kind !== "trackpad",
        "at " + (SURE_AT - 1) + ": " + crawl(SURE_AT - 1).kind
          + " (score " + crawl(SURE_AT - 1).memory.score + "), at " + SURE_AT + ": "
          + crawl(SURE_AT).kind + " (score " + crawl(SURE_AT).memory.score + ")");
  check("and the notch it compares against is " + WHEEL_NOTCH,
        WHEEL_NOTCH > 2 && WHEEL_NOTCH < 53,
        "below Firefox's smallest notch of 53, above any trackpad frame");
}

console.log("\n4. the gestures are Blender's");
{
  const swipe = { deltaX: 30, deltaY: -20, deltaMode: 0 };
  //! A BARE SWIPE ORBITS. This is the mapping the whole feature is for: on
  //! every other web page a bare swipe scrolls, so getting this wrong makes
  //! the viewport feel like a document.
  const orbit = gestureFor(swipe, "trackpad");
  check("a bare swipe orbits", orbit.how === "orbit", orbit.how);
  check("and turns by the published rate",
        near(orbit.dx, 30 * PAD_X * TRACKPAD_ORBIT)
        && near(orbit.dy, -20 * PAD_Y * TRACKPAD_ORBIT),
        orbit.dx.toFixed(5) + " / " + orbit.dy.toFixed(5) + " radians");
  //! SHIFT PANS.
  const pan = gestureFor({ ...swipe, shiftKey: true }, "trackpad");
  check("shift and a swipe pans", pan.how === "pan", pan.how);

  //! THE INVARIANT THAT ACTUALLY MATTERS, and the one this file did not have
  //! until a real trackpad was used: every gesture has to agree with a
  //! POINTER DRAG about which way is which, and they have to agree with each
  //! other. The first version pinned the signs it happened to have written -
  //! the orbit took deltaX as it came and the pan negated it - so it passed
  //! on a mapping where sideways meant two different things, and the fault
  //! only showed up as "when you drag down it moves up".
  //!
  //! Expressed as: a swipe and a drag of the same hand movement must produce
  //! the same sign on both axes, for both gestures.
  const asDrag = one => ({ x: Math.sign(one.dx), y: Math.sign(one.dy) });
  //! Fingers down the pad. macOS reports that as a NEGATIVE deltaY, which is
  //! the measurement the module's PAD_Y encodes.
  const down = { deltaX: 0, deltaY: -10, deltaMode: 0 };
  //! A pointer dragged down is a POSITIVE dy, and the viewport adds it to the
  //! pitch - so a swipe down must also come out positive or the view tilts
  //! the wrong way.
  check("a swipe down tilts the same way a drag down does",
        asDrag(gestureFor(down, "trackpad")).y === 1,   // -10 reported, PAD_Y flips it
        "dy " + gestureFor(down, "trackpad").dy.toFixed(5));
  check("and so does a shift-swipe down",
        asDrag(gestureFor({ ...down, shiftKey: true }, "trackpad")).y === 1,
        "dy " + gestureFor({ ...down, shiftKey: true }, "trackpad").dy);
  //! Fingers right the pad, reported as a positive deltaX - confirmed correct
  //! on a real trackpad before any of this was changed.
  //! Fingers right the pad arrive as a POSITIVE deltaX and must come out
  //! negative, the same as the vertical: macOS reverses both axes. The first
  //! version of this check asserted positive, because the first report from a
  //! real trackpad said the horizontal was correct - which it was not; it had
  //! been judged on diagonal swipes while the vertical was still inverted.
  const right = { deltaX: 10, deltaY: 0, deltaMode: 0 };
  check("a swipe right turns the same way a drag right does",
        Math.sign(gestureFor(right, "trackpad").dx) === PAD_X,
        "dx " + gestureFor(right, "trackpad").dx.toFixed(5));
  check("and so does a shift-swipe right",
        Math.sign(gestureFor({ ...right, shiftKey: true }, "trackpad").dx) === PAD_X,
        "dx " + gestureFor({ ...right, shiftKey: true }, "trackpad").dx);
  //! AND THE TWO GESTURES AGREE WITH EACH OTHER, which is the check that
  //! would have caught the real fault: the orbit and the pan deriving their
  //! axes separately.
  for (const [name, one] of [["down", down], ["right", right]]) {
    const o = asDrag(gestureFor(one, "trackpad"));
    const q = asDrag(gestureFor({ ...one, shiftKey: true }, "trackpad"));
    check("the orbit and the pan agree about " + name,
          o.x === q.x && o.y === q.y,
          "orbit " + JSON.stringify(o) + " pan " + JSON.stringify(q));
  }
  //! A PINCH ZOOMS.
  const pinch = gestureFor({ deltaX: 0, deltaY: 100, deltaMode: 0, ctrlKey: true },
                           "trackpad");
  check("a pinch zooms", pinch.how === "zoom", pinch.how);
  check("and a pinch of 100 is about a doubling",
        near(pinch.scale, Math.exp(100 * TRACKPAD_ZOOM), 1e-9)
        && pinch.scale > 2.6 && pinch.scale < 2.8,
        "scale " + pinch.scale.toFixed(3));
  //! EXPONENTIAL, NOT LINEAR, which is what makes a zoom reversible: pinching
  //! out and back by the same amount has to land where it started.
  const out = gestureFor({ deltaY: 40, deltaMode: 0, ctrlKey: true }, "trackpad");
  const back = gestureFor({ deltaY: -40, deltaMode: 0, ctrlKey: true }, "trackpad");
  check("zooming out and back returns to the same distance",
        near(out.scale * back.scale, 1, 1e-12),
        (out.scale * back.scale).toFixed(12));
  //! COMMAND ALSO ZOOMS - this one is not Blender's and the test says so, so
  //! nobody later reads it as a fact about Blender.
  const meta = gestureFor({ ...swipe, metaKey: true }, "trackpad");
  check("command and a swipe zooms (this page's addition, not Blender's)",
        meta.how === "zoom", meta.how);
}

console.log("\n5. a wheel keeps the behaviour it always had");
{
  //! THE PROMISE TO EVERYBODY WHO IS NOT ON A TRACKPAD: nothing changes. The
  //! viewport's wheel was a twelve per cent dolly a notch, and it still is.
  const down = gestureFor({ deltaX: 0, deltaY: 100, deltaMode: 0 }, "mouse");
  check("a notch down is a zoom", down.how === "zoom", down.how);
  check("of twelve per cent", near(down.scale, 1 + WHEEL_ZOOM),
        "scale " + down.scale);
  const up = gestureFor({ deltaX: 0, deltaY: -100, deltaMode: 0 }, "mouse");
  check("and a notch up is the other way", near(up.scale, 1 - WHEEL_ZOOM),
        "scale " + up.scale);
  //! AN UNDECIDED DEVICE BEHAVES AS A WHEEL, because that is what the page
  //! did before and because a wrong orbit is more startling than a wrong
  //! zoom.
  const unknown = gestureFor({ deltaX: 0, deltaY: 100, deltaMode: 0 }, "unknown");
  check("and so does a device not yet decided", unknown.how === "zoom",
        unknown.how);
  //! A WHEEL REPORTING LINES has to be scaled before the sign is taken, or a
  //! browser that reports 3 lines zooms by the same 12% as one reporting 100
  //! pixels - which is correct here only by luck, so the check is that the
  //! delta was converted at all.
  const lines = gestureFor({ deltaX: 0, deltaY: 3, deltaMode: 1 }, "mouse");
  check("lines are converted to something like pixels", near(lines.dy, 48),
        lines.dy + " from 3 lines");
}

console.log("\n6. natural direction inverts the orbit and nothing else");
{
  const swipe = { deltaX: 30, deltaY: -20, deltaMode: 0 };
  const plain = gestureFor(swipe, "trackpad", false);
  const flipped = gestureFor(swipe, "trackpad", true);
  check("the orbit reverses", near(flipped.dx, -plain.dx) && near(flipped.dy, -plain.dy),
        plain.dx.toFixed(5) + " becomes " + flipped.dx.toFixed(5));
  //! AND THE PAN DOES NOT. Blender's preference is about the orbit; a pan
  //! that reversed with it would be a pan going the wrong way for everybody
  //! who turned the preference on for the orbit's sake.
  const pan = gestureFor({ ...swipe, shiftKey: true }, "trackpad", true);
  const panPlain = gestureFor({ ...swipe, shiftKey: true }, "trackpad", false);
  check("the pan is unaffected", near(pan.dx, panPlain.dx) && near(pan.dy, panPlain.dy),
        pan.dx + " either way");
  const zoom = gestureFor({ deltaY: 40, deltaMode: 0, ctrlKey: true }, "trackpad", true);
  const zoomPlain = gestureFor({ deltaY: 40, deltaMode: 0, ctrlKey: true }, "trackpad", false);
  check("and so is the zoom", near(zoom.scale, zoomPlain.scale),
        zoom.scale.toFixed(4));
}

console.log("\n7. the platform guess is only a guess, and says so");
{
  check("a Mac user agent reads as a Mac",
        looksLikeMac({ platform: "MacIntel", userAgent: "Mozilla/5.0 (Macintosh)" }));
  check("userAgentData is preferred over the deprecated platform",
        looksLikeMac({ userAgentData: { platform: "macOS" }, platform: "" }));
  check("a Windows one does not",
        !looksLikeMac({ platform: "Win32", userAgent: "Mozilla/5.0 (Windows NT 10.0)" }));
  check("a Linux one does not",
        !looksLikeMac({ platform: "Linux x86_64", userAgent: "Mozilla/5.0 (X11; Linux)" }));
  check("and nothing at all does not throw", !looksLikeMac(null) && !looksLikeMac({}));
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
