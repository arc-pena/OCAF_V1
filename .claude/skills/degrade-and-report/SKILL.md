---
name: degrade-and-report
description: How an operation should behave when it cannot fully succeed - ask for less rather than refusing, give up the part that does not fit rather than the whole, and always say in the result what was given up and why. Covers the retry ladder, per-element fault isolation, why a silent wrong answer is the worst outcome, and why deny-lists of types are almost always the wrong fix. Use this whenever you are writing a try/catch around a builder or solver, whenever an operation can partially succeed, whenever you are about to throw on a case that could still return something useful, whenever a result could be wrong without anyone noticing, and whenever you are tempted to hard-code a list of inputs a dependency "cannot handle".
---

# Degrade and report

Three outcomes are possible when an operation cannot do all of what it was
asked. Ranked, best first:

1. **Do what you can, and say what you gave up.** "8 edges · 4 held tangent ·
   4 edges meet a cone, which this boundary will not take a tangency against."
2. **Refuse, and say exactly why.** "The boundary does not close — 2 ends are
   loose, 500 mm apart: BlendCurve.2 stops at (-2202, -593, 670) and Sketch.2
   stops at (-2204, -93, 670)."
3. **Return something plausible and wrong, silently.** This is the one that
   costs weeks.

Everything below is machinery for staying out of (3) and getting from (2) to
(1) where it is honest to do so.

## The ladder: ask for less

When an operation takes optional strength — constraints, tolerances,
continuity, precision — and the strong form may fail in ways you cannot predict,
try it in rungs, each asking for less, and carry the reason down:

```js
const HOLD_ALL = 2, HOLD_FLATS = 1, HOLD_NONE = 0;
let got = attempt(HOLD_ALL);
let why = got.refused && got.refused.length ? got.refused[0] : "";
if (!got.ok) {
  got = attempt(HOLD_FLATS, why);
  if (!got.ok) {
    why = (got.refused && got.refused.length ? got.refused[0] : "") || why;
    got = attempt(HOLD_NONE, why);
  }
}
if (!got.ok) throw got.error;
return got.answer;
```

Three things make this work rather than just being a retry loop:

- **The rungs are meaningful to a person.** "every tangency", "only the ones
  against flat faces", "none, held in place only" — each is a thing a user can
  picture and would have chosen. Rungs that are just "tolerance × 10" teach
  nobody anything.
- **The reason travels down.** A patch that quietly drops its constraint and
  says only "it would not build" sends somebody hunting. The same patch saying
  what the kernel actually objected to sends them to the thing that is wrong.
- **The final rung still produces something.** Falling all the way through
  yields a held-in-place patch and a sentence, not an exception.

## Give up the part, not the whole

Where the work is per-item, a failure in one item is not a failure of the set.

**Per-element isolation.** One degenerate line in a drawing of five hundred
used to take the whole sketch down, because the builder raised up through the
Sketch build:

```js
//! Nothing one element is wrong about is allowed to reach the rest of the
//! drawing. A zero-length line, a circle of no radius, an arc the weld made
//! degenerate: each is one element that cannot be built, and the answer is to
//! build the other five hundred.
function sketchEdgesOf(el, frame, a, b) {
  try { return edgesOfElement(el, frame, a, b).filter(Boolean); }
  catch (e) { return []; }
}
```

**Resolving contention by dropping whole units.** Two fillets on a short edge
can both back off past its middle. What is left of that edge is nothing, it
drops out of the wire, and the wire has a hole in it — reported by the kernel
as "the wire would not join up", which sends you looking at arcs that are all
fine. The fix is not to shave both radii; it is to give up the corner taking
the bigger bite, hand back both edges it cut, and count it as too tight:

```
4 corners rounded · 1 too tight for 60
```

The rest of the curve still gets rounded. Refusing all of it over one short
edge is the worse answer.

**Fall back to the input, not to an exception.** A curve fit that will not
converge returns the polyline it was fitted to. It is the same curve either
way; the only difference is whether what is built off it comes out smooth.

## Check the thing nobody else will check

A library will often accept a malformed input and solve an under-determined
problem rather than refuse. That is outcome (3) and you have to catch it
yourself.

- **A boundary that does not close.** Handed a chain with a gap, the filling
  did not refuse — it returned a sheet that sprawled outside the curves it was
  given, which is exactly what a broken fill looks like from outside. So the
  loop is measured here, where the gap can be named, and the message carries
  both loose ends and the distance between them.
- **An answer wildly out of scale.** A patch bounded by a loop cannot be much
  bigger than the loop. Three times its own reach is generous; two hundred
  times is a failure that forgot to raise. Compare the answer's extent to the
  input's.
- **A constraint that was accepted but not met.** A point constraint is a
  request, not a guarantee — solvers weigh it against everything else and
  settle somewhere. "Passes through three points" with no number beside it
  hides a patch sailing past all three. So measure it off the surface that was
  built: `1 point to pass through, the furthest missed by 1.3922 mm`.
- **A sign or an orientation.** A measured area came back negative for a
  reversed face. Return the magnitude *and* say "inside out" — the sign was
  real information about the input, and swallowing it loses that.

## Do not deny-list types

After a crash, the tempting fix is a list of types the dependency "cannot
handle". It was wrong here, and the shape of the wrongness generalises:

The same fill held eight tangencies against an extruded solid and trapped
against a *draft of that same solid*. The faces that changed were cones — but a
cone built on its own held a tangency perfectly well, as did planes, cylinders,
surfaces of revolution and B-spline patches, every one of them tried. It was
not the class that could not be held. It was that particular geometry.

A type deny-list is a prediction, and you are predicting about a system you
cannot see inside. It fails both ways: it misses the case that actually breaks,
and it refuses cases that would have worked. **Find out by asking — a ladder —
rather than by predicting.**

## The note is part of the result

Every operation here returns a note beside its shape, and the note is written
for the person who has to decide what to do next:

```
8 edges · 8 held tangent · gap 0.0328 mm · tangency 0.1179° · 1 point to pass
through, the furthest missed by 0.0563 mm
```

```
4 corners rounded · 3 already smooth · 1 too tight for 35
```

Rules that make notes useful:

- **Units a person argues about.** A tangency as an angle in degrees, not as a
  sine. A gap in millimetres. A count as a count.
- **Say the shortfall, not just the success.** "0 held tangent" with no reason
  is the report that sends somebody looking. Name how many and why.
- **Name the thing, not the index.** "BlendCurve.2 stops at (…)" not "edge 7".
- **Suggest the fix when there is an obvious one.** "Join them up, or raise the
  tolerance past the gap if it is meant to be that rough." "For a patch that
  runs between two rails a Loft through them is the tool for it."

## Errors are for people who are mid-task

Compare:

- "BRep_API: command not done"
- "no arc of 60 fits those corners — try a smaller radius"
- "that boundary would not be taken: an edge has to lie ON the face it is held
  tangent to"

The second and third tell someone what to change. Spend the sentence.
