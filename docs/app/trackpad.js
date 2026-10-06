// Telling a trackpad from a wheel, and what a gesture on one means.
//
// WHY THIS IS A MODULE AND NOT A BRANCH IN THE WHEEL HANDLER. Both halves of
// it are guesses about hardware the page cannot ask about directly, and a
// guess that cannot be tested is a guess nobody can fix. So the deciding is
// pure: it takes wheel events as plain data and answers; the viewport does the
// moving. Everything below can therefore be driven with recorded events and
// checked against numbers, which is the only honest way to work on something
// whose real test is somebody's hand on their own laptop.
//
// WHAT HAS NOT BEEN TESTED, said first because it matters most: no Mac
// trackpad has touched this code. The container these tests run in is Linux
// with no trackpad, so what is checked here is the classifier against event
// shapes - including ones recorded from real devices and published in browser
// bug reports - and the mapping against arithmetic. The first real trackpad to
// use it is the user's.
//
// THE MAPPING IS BLENDER'S, on macOS:
//
//   two-finger swipe          orbit
//   Shift + two-finger swipe  pan
//   pinch                     zoom
//
// Confirmed from Blender's own documentation and from the macOS guides that
// describe it. One addition is NOT Blender's and is marked as such below:
// Command with a two-finger swipe also zooms, because a pinch is awkward to
// repeat and some trackpads report it badly.

/* -------------------------------------------------- what kind of device

   There is no API for "is this a trackpad". What there is:

     A PINCH ON macOS ARRIVES AS A WHEEL EVENT WITH ctrlKey SET, synthesised
     by the browser, whether or not Control is held. Nothing else does this, so
     it is the one signal here that is close to proof rather than inference.

     A MOUSE WHEEL IS QUANTISED. It turns in notches, so deltaY comes in whole
     numbers and usually large ones - 100 and 120 are the common values, 53 and
     57 appear on Firefox - and deltaX is exactly zero because a wheel has one
     axis.

     A TRACKPAD IS CONTINUOUS. It reports pixels, often fractional, usually
     small, in a stream of events a few milliseconds apart, and it reports BOTH
     axes because a finger moves in two dimensions.

   None of those is decisive on its own: a slow trackpad swipe can produce a
   whole number, and a free-spinning wheel can produce a fast stream. So they
   are weighed rather than switched on, and the answer only changes when the
   evidence is one-sided - because flipping the navigation mode in the middle
   of a gesture is the failure that would feel broken rather than merely wrong.
*/

//! Big enough that no trackpad produces it from a finger moving at a plausible
//! speed in one frame, and small enough that the common wheel notches are over
//! it. The wheel values seen in the wild are 53, 57, 100 and 120.
export const WHEEL_NOTCH = 40;

//! How one-sided the evidence has to be before the answer changes. Four is two
//! frames of a trackpad stream, which is quick enough that the first swipe
//! after plugging in a mouse behaves correctly, and slow enough that one
//! stray event cannot flip it.
export const SURE_AT = 4;

export const newPointerMemory = () => ({
  score: 0,            // negative leans mouse, positive leans trackpad
  kind: "unknown",
  pinched: false,      // a pinch has been seen, which only a trackpad sends
  seen: 0,
  last: 0,
});

//! \p event { deltaX, deltaY, deltaMode, ctrlKey, timeStamp }
//! \p memory from newPointerMemory, carried between calls and MUTATED
//! \return "trackpad" | "mouse" | "unknown"
export function classifyWheel(event, memory) {
  const m = memory;
  m.seen++;
  const dx = Number(event.deltaX) || 0;
  const dy = Number(event.deltaY) || 0;
  const mode = Number(event.deltaMode) || 0;
  const when = Number(event.timeStamp) || 0;
  const apart = m.last ? when - m.last : Infinity;
  m.last = when;

  //! A PINCH SETTLES IT, AND STAYS SETTLED. Only a multi-touch device sends
  //! one, so once a pinch has been seen the device is a trackpad until the
  //! page is reloaded - a mouse plugged in afterwards cannot un-send it, but
  //! it also cannot pinch, so it will keep working through the wheel path.
  if (event.ctrlKey && dy !== 0 && mode === 0) {
    m.pinched = true;
    m.kind = "trackpad";
    return m.kind;
  }
  if (m.pinched) return "trackpad";

  //! LINES OR PAGES ARE A WHEEL. A trackpad reports pixels; a browser that
  //! reports lines is describing a notched device.
  if (mode !== 0) m.score -= 2;
  else {
    let lean = 0;
    //! A FRACTION CANNOT COME FROM A NOTCH.
    if (!Number.isInteger(dy) || !Number.isInteger(dx)) lean += 2;
    //! TWO AXES AT ONCE is a finger, not a wheel.
    if (dx !== 0 && Math.abs(dx) < WHEEL_NOTCH) lean += 1;
    //! A SMALL STEP, repeated quickly, is a finger. A notch is big and the
    //! gaps between notches are long.
    if (Math.abs(dy) > 0 && Math.abs(dy) < WHEEL_NOTCH) lean += 1;
    if (apart < 40) lean += 1;
    //! AND A BIG WHOLE STEP WITH NO SIDEWAYS IS A WHEEL, which is the one
    //! case that has to win outright or a wheel on a Mac gets trackpad
    //! navigation and becomes unusably fast.
    if (Math.abs(dy) >= WHEEL_NOTCH && dx === 0 && Number.isInteger(dy)) lean = -3;
    m.score += lean || -1;
  }
  m.score = Math.max(-12, Math.min(12, m.score));
  if (m.score >= SURE_AT) m.kind = "trackpad";
  else if (m.score <= -SURE_AT) m.kind = "mouse";
  return m.kind;
}

/* ------------------------------------------------------- what the gesture is

   One function, so that the wheel handler has no opinions of its own and the
   mapping can be read in one place and compared with Blender's.             */

//! HOW FAR A FINGER GOES. Blender's trackpad orbit turns about a quarter turn
//! across a trackpad; these are in radians per pixel of reported delta and
//! are a third of the drag sensitivity, because a two-finger swipe reports
//! several times the pixels a dragged pointer does for the same hand movement.
//! Both numbers are a judgement and are the first thing to change if it feels
//! wrong - which is why they are named here and not buried in the handler.
export const TRACKPAD_ORBIT = 0.0026;

//! A pan is in pixels and wants no scaling at all: the view should move with
//! the fingers, which is what makes it feel like dragging the sheet.
export const TRACKPAD_PAN = 1;

//! A pinch's deltaY is already roughly proportional to the fraction pinched,
//! and macOS sends it with a factor of about a hundred. 0.01 per unit makes a
//! pinch of 100 a doubling, which is about what Blender does.
export const TRACKPAD_ZOOM = 0.01;

//! AND A WHEEL'S NOTCH, unchanged from what the viewport had: twelve per cent
//! a notch. Kept here so both devices' zoom is one table rather than two.
export const WHEEL_ZOOM = 0.12;

//! WHICH WAY EACH REPORTED AXIS RUNS, against a pointer dragged the same way.
//! Separate constants rather than one "invert" flag because they are not the
//! same answer - which is the whole finding above - and named here so that the
//! next person with a different trackpad has one obvious place to look.
//! BOTH AXES ARE REVERSED against a pointer dragged the same way, which is
//! macOS's natural-scrolling convention applied to the whole trackpad rather
//! than to the vertical only.
//!
//! It took two reports to establish, and the first one was wrong in a way
//! worth recording: with the vertical inverted, "left and right is correct"
//! was judged on diagonal swipes whose vertical component was fighting the
//! hand - so the horizontal read as right when it was not. Only once the
//! vertical was fixed could the horizontal be judged on its own, and then it
//! was plainly inverted too.
//!
//! The lesson is in the shape of the fix rather than the value: two
//! constants, one per axis, so that correcting one cannot move the other.
//! Had this been a single "invert" flag, the second report would have
//! un-fixed the first.
export const PAD_X = -1;   // deltaX arrives reversed
export const PAD_Y = -1;   // and so does deltaY

//! \p event the wheel event, as data
//! \p kind "trackpad" | "mouse" | "unknown"
//! \p natural true to invert the orbit direction, as Blender's "Natural
//!    Trackpad Direction" does
//! \return { how, dx, dy, scale } - how is "orbit" | "pan" | "zoom";
//!    dx and dy are radians for an orbit and pixels for a pan; scale is the
//!    factor to multiply the camera distance by for a zoom.
export function gestureFor(event, kind, natural = false) {
  const dx = Number(event.deltaX) || 0;
  const dy = Number(event.deltaY) || 0;
  const mode = Number(event.deltaMode) || 0;
  //! DELTAS IN LINES OR PAGES, scaled to something like pixels before any of
  //! the numbers below are applied to them. A browser reporting lines and a
  //! handler assuming pixels is a zoom that moves sixteen times too little.
  const per = mode === 1 ? 16 : mode === 2 ? 400 : 1;
  const px = dx * per, py = dy * per;

  //! A PINCH IS A ZOOM, whoever sent it. On macOS the browser reports one as
  //! ctrl+wheel; a person actually holding Control on a mouse means to zoom as
  //! well, so the two needing the same answer is lucky rather than awkward.
  if (event.ctrlKey)
    return { how: "zoom", dx: 0, dy: py, scale: Math.exp(py * TRACKPAD_ZOOM) };

  if (kind !== "trackpad")
    //! A WHEEL IS A ZOOM, in notches, exactly as it was before any of this.
    return { how: "zoom", dx: 0, dy: py,
             scale: 1 + Math.sign(py) * WHEEL_ZOOM };

  //! COMMAND ALSO ZOOMS, and this one is NOT Blender's - it is here because a
  //! pinch is awkward to repeat and some trackpads report it poorly, so there
  //! has to be a way to zoom with a swipe. Named in the menu so it is
  //! discoverable rather than folklore.
  if (event.metaKey)
    return { how: "zoom", dx: 0, dy: py, scale: Math.exp(py * TRACKPAD_ZOOM) };

  //! AS IF A POINTER HAD BEEN DRAGGED THIS FAR, worked out ONCE and used by
  //! every gesture below.
  //!
  //! Reported from a real Mac trackpad, which is the first measurement this
  //! module has had from one: left and right already matched a drag, up and
  //! down did not - "when you drag down it moves up". So deltaX arrives with
  //! the same sign as a pointer moving the same way and deltaY arrives
  //! reversed, which is macOS applying its natural-scrolling convention to
  //! the vertical axis only.
  //!
  //! THE WORSE FAULT THAT FINDING EXPOSED. The orbit and the pan used to
  //! derive their axes separately - the orbit took deltaX as it came, the pan
  //! negated it - so the two gestures disagreed about which way sideways was,
  //! and correcting one would have left the other wrong in the opposite
  //! direction. One pair of numbers now, so they cannot drift apart: whatever
  //! is true of the orbit's axes is true of the pan's by construction.
  const fx = px * PAD_X;
  const fy = py * PAD_Y;

  //! SHIFT PANS. Blender's mapping, and the one every macOS application that
  //! has a canvas in it uses. Handed the finger-equivalent deltas exactly as
  //! the pointer drag hands pan() its own, so the viewport needs no second
  //! opinion about signs.
  if (event.shiftKey)
    return { how: "pan", dx: fx * TRACKPAD_PAN, dy: fy * TRACKPAD_PAN, scale: 1 };

  //! AND A BARE SWIPE ORBITS, which is the whole point: on a trackpad the
  //! commonest thing to want is to turn the model over, and on every other
  //! web page a bare swipe scrolls - so this is the one mapping that has to be
  //! got right or the viewport feels like a document.
  const turn = natural ? -1 : 1;
  return { how: "orbit", dx: fx * TRACKPAD_ORBIT * turn,
           dy: fy * TRACKPAD_ORBIT * turn, scale: 1 };
}

/* ------------------------------------------------------------ the platform

   Only used to decide the DEFAULT. The classifier works on any platform and
   the preference overrides both, so this is a starting guess and nothing
   more - which is why it is allowed to be the loose check that it is.       */

//! \p nav something shaped like navigator
export function looksLikeMac(nav) {
  if (!nav) return false;
  //! userAgentData first, because navigator.platform is deprecated and some
  //! browsers have begun freezing it. Neither is reliable alone, which is
  //! another reason this only picks a default.
  const said = (nav.userAgentData && nav.userAgentData.platform)
    || nav.platform || "";
  if (/mac/i.test(said)) return true;
  //! An iPad reporting itself as a Mac is still a device whose gestures are
  //! touch, which the viewport already handles through pointer events.
  return /Macintosh|Mac OS X/i.test(nav.userAgent || "");
}
