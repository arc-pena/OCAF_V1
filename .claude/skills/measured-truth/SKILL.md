---
name: measured-truth
description: How to verify work in a domain where "it looks right" is not evidence - geometry, graphics, layout, simulation, numerical code, anything with a visual or physical output. Write tests whose expected value can be derived on paper before the program is asked, pick cases that discriminate rather than cases that pass, and drive the real artefact in a real browser rather than trusting the code. Use this whenever you are about to claim something works, whenever you are writing tests for maths/geometry/rendering, whenever a bug is "visual" or "intermittent", and whenever you are tempted to verify by reading the code you just wrote. Also use before reporting a fix as done.
---

# Measured truth

In this kind of work, reading the code proves nothing and looking at the output
proves almost nothing. Both of the worst bugs in this project passed a casual
look: a fillet that met neither arm and a surface that was forty-eight flat
strips both *render*, and both render plausibly.

The rule that replaced eyeballing: **every check is a number that could have
been written down before the program was asked.**

## Write the expected value on paper first

A test whose expected value came out of the program is a test that the program
still does what it did. That is worth something, but it is not a test of
correctness and should not be described as one.

Real examples from this codebase:

| what is built | what is checked, derived first |
|---|---|
| rounded rectangle, 240 × 160, r 20 | perimeter is 800 − 4(2r − πr/2) exactly |
| slot, 240 long, 80 across | two straights of 160 plus one circle of r 40 |
| parabola arc | the arc length of y² = 4fx |
| ellipse | its own elliptic integral — which revealed a closed conic edge measures 0.05% long |
| wide flange section | area 26.1624 mm² |
| truncated cone | π h (R² + Rr + r²) / 3 |
| a sketched spline, extruded | **one** edge, **one** face — a count, not a tolerance |
| a fillet arc | the angle between curves where they join: 0.000001° |

The best of these are counts and identities, because they have no tolerance to
argue about. "One face" is a stronger claim than "smooth enough".

## Measure the built thing, not the arithmetic that made it

The fillet was computed from a half-angle and a bisector. Checking that
arithmetic would have confirmed the arithmetic. The check that found the bug
read the *built wire* back and measured the angle between each pair of edges
where they touch:

```js
const walk = new oc.BRepAdaptor_Curve(edge);
const dir = u => { const d = walk.DN(u, 1); const m = Math.hypot(d.X(), d.Y(), d.Z());
                   return [d.X()/m, d.Y()/m, d.Z()/m]; };
// ... at every join where two edges share a point, the angle between tangents
```

Read the answer out of the artefact through a different path than the one that
produced it. If the only way you can check a thing is the code that made it,
you have not checked it.

## Pick cases that discriminate

The fillet bug read one arm backwards, which turns a corner into its own
supplement. A corner and its supplement are the same number at exactly one
angle: ninety degrees. **A test suite of squares would have passed it.**

So when choosing cases, ask: what would make the wrong implementation and the
right one agree? Then avoid that. The suite that caught it runs 20°, 60°, 90°,
135° and a mixed chain — chosen because the symmetry that hides the bug only
holds at 90°.

Same discipline elsewhere:
- a closed loop *and* an open chain (closure is a separate code path);
- a straight arm *and* a curved arm (a curve has a different tangent at every point);
- a shape where the operation fails partially (one corner too tight), because
  partial-failure bookkeeping is where off-by-one association bugs live.

## Drive the artefact, in a real browser

Tests against the model layer do not catch layout, shading, culling, input or
the way two panels overlap at 1280 × 620. Keep a small harness per question and
re-run it:

```js
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium",
  args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
page.on("pageerror", e => say("PAGEERROR:", e.message));
page.on("console", m => { if (m.type() === "error") say("CONSOLE:", m.text()); });
```

Two things that repeatedly mattered:

**Screenshots are authoritative; pixel read-back is not.** A `readPixels` or a
canvas `drawImage` after the frame has been presented reads a cleared buffer
and returns all-black, which looks exactly like "the object is not drawn". If
you need a colour, render into the buffer and read it in the *same* task, in a
minimal standalone page.

**Drive the real input path.** Setting `view.pitch` directly changed nothing
because nothing asked for a redraw, and two "different" screenshots came back
byte-identical. Use the app's own gestures — the same Alt+drag a person uses —
so you are testing the path that ships.

## Prove the fix by reverting it

The strongest evidence that a change did something is the same measurement with
the change backed out. It costs two minutes:

```
before:  48 edges · 48 faces          after:  1 edge · 1 face
before:  "no arc of 30 fits"          after:  1 corner rounded, 0.000000° break
before:  back face 14,20,28           after:  back face 147,194,250
```

This also catches the case where you fixed nothing and the thing was already
working — which happened twice here, and would have been reported as a fix.

## Encode design rules as tests, not as memory

Rules that live only in someone's head get broken by ordinary code. Two that
became suites:

- **no raw `vw`/`vh` in the stylesheet** — the interface is `zoom`-scaled, and
  a viewport unit does not scale with it, so `100vh` inside a panel at 1.15
  renders fifteen per cent taller than the window. The test parses the
  stylesheet and fails on the raw unit.
- **no two panels overlap** — a harness opens the real page at eleven window
  sizes in several states and measures every pair. It reports `every state
  clean` or names the pair.

A rule you can state in a sentence can usually be a test in twenty lines. Write
it the first time the rule is broken, not the third.

## Report honestly

State what was measured and what the number was. "Tangent to 0.000001° on
corners from 20° to 135°" is a claim someone can check. "Fixed the fillet" is
not. If a part is unverified, say which part.
