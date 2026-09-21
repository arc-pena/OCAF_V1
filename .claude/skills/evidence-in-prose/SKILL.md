---
name: evidence-in-prose
description: How to write comments, commit messages and error strings that carry the evidence for a decision, not a restatement of the code - the measurement that settled it, the thing that went wrong, and what the next person would otherwise try. Use this whenever you are writing a comment above a non-obvious decision, whenever you are about to write a commit message, whenever a constant has a number in it that somebody chose, whenever you are overturning an earlier decision, and whenever code looks wrong but is deliberate. Also use when a codebase's comments keep going stale or keep being ignored.
---

# Evidence in prose

This codebase carries about 3,300 prose comments across 44,000 lines of source.
They are not documentation of what the code does — the code does that. They
carry the **reason**, the **measurement**, and the **failure the decision
prevents**, because those are the three things that evaporate and the three
things that cause the decision to be undone by the next person.

The test of a comment here: *would it have stopped the mistake being made
again?* A comment that only restates the line below it would not have stopped
anything, and is worse than nothing because it makes the file longer.

## Carry the number

When a constant was chosen rather than derived, the number that chose it goes
in the comment. Not "tuned empirically" — the actual measurements:

```js
//! A CLOSED RUN IS SAMPLED HARDER, and the reason is the seam. The fit is not
//! periodic - nothing here binds a periodic fitter - so where the loop comes
//! back to its start the two ends are only as parallel as the samples either
//! side of them make them. Measured: a loop of 60 samples closes with a
//! 0.63-degree kink, 120 with 0.02, and 240 with 0.004. So a closed run gets
//! at least 120 samples, which costs milliseconds and buys a join nobody can
//! see.
```

Now the next person can change it on purpose. Without the table they either
leave it alone forever or change it blind.

Same for a claim about a dependency:

```js
//! Later three.js turns the normal round for a back face on its own; the
//! revision this page carries does not, and that was measured rather than
//! assumed - one plane, one light, read off the buffer: 178,244,255 lit and
//! 14,20,28 from behind, which is the ambient term and nothing else.
```

## Name the failure, in the past tense

Code that looks redundant, ugly or over-careful gets "cleaned up" unless the
comment says what happens when it is:

```js
//! Loaded and performed rather than constructed with arguments: this build
//! binds BRepExtrema_DistShapeShape but NOT the Extrema_ExtFlag enum its
//! longer constructors take, so every one of those throws before it runs.
//! Caught, it looks like "the two never came near each other" - which is how
//! a nearest-face search came to return the first face every time, and a
//! point constraint came to report nothing at all about whether it had been
//! met. The factory always used this form; these two did not.
```

The short version of this, used throughout the project's instructions file, is
four words: **"That has happened once already."** It is the difference between
a rule someone follows and a rule someone follows when they are in a hurry.

## Say what was tried and rejected

Half the value of a comment is closing off the road the next person would take:

```js
//! MEASURED, NOT TRUSTED. Raising the number of pieces the surface is allowed
//! does not save this case - it was tried at twenty and at forty and the
//! answer was still tens of metres across - so there is nothing to do but say
//! so and name the tool that does work.
```

```js
//! A DENY-LIST WAS TRIED AND IT WAS WRONG. The draft that started this holds
//! eight tangencies as an extrude and traps as a draft of that same extrude,
//! and the faces that changed are cones - but a cone built on its own holds a
//! tangency perfectly well, as do planes, cylinders, surfaces of revolution
//! and B-spline patches. So it is not the CLASS that cannot be held.
```

## Correct the record when you overturn it

A comment written in good faith that turns out to be wrong should not be
deleted quietly — it should be replaced by one that says what the old one got
wrong, so the mistake cannot be re-derived:

> It did not have to be. This build does carry a B-spline fitter. What it does
> not carry is the name it was looked for under: `TColgp_Array1OfPnt` is a
> typedef, and the binding is published under the template it is a typedef OF —
> `NCollection_Array1_gp_Pnt` — so every search for the TColgp name came back
> empty and the conclusion was that the fitter was unusable.

## Be honest about what a mechanism buys

An overstated benefit sends the next person optimising the wrong thing:

> In a single-file page every byte is in the file whether a package is loaded
> or not. **Do not write comments pretending otherwise.** What loading really
> changes: its data is unpacked only on load; its drivers and views are only
> built on load; its nodes are not in the catalogue or in the assistant's
> briefing until then.

## Commit messages are the same discipline, at a larger grain

A good commit message here is a short essay: what was observed, what it turned
out to be, why the obvious fix was wrong, what was done instead, and what is
now measurable. Structure that works:

1. **A subject line that is a claim, not a category.** "Curves are curves, and
   a fillet arc meets both arms" — not "fix(geometry): improve curve handling".
2. **The symptom, concretely.** "A sketched spline extruded into forty-eight
   flat strips because the geometry really was forty-eight straight edges."
3. **The root cause, including why it was missed.** "What it does not carry is
   the name it was looked for under…"
4. **What is now true, with numbers.** "A sketched spline, a blend curve, an
   interpolated curve open or closed, a parabola and a projected curve are one
   edge each, and a pad off one is one face. Measured, not looked at."
5. **What was deliberately not changed, and why.** "A polyline is still a
   polyline, because that is what a polyline is."

The audience is you in four months with no context, and the second-best time to
write it is never.

## Errors are prose too

An error message is a comment that reaches a user. Same rules: say what was
wrong, in their units, and what to change.

```
the boundary does not close - a surface is filled INSIDE a loop, and 2 ends
are loose. The nearest two are 500 mm apart: BlendCurve.2 stops at
(-2202, -593, 670) and Sketch.2 stops at (-2204, -93, 670). Join them up, or
raise the tolerance past the gap if it is meant to be that rough
```

## Voice

Minor, but it is why these get read rather than skimmed.

- Whole sentences. A comment is prose, not a telegram.
- Lead with the conclusion in capitals when a block is long — `//! MEASURED,
  NOT TRUSTED.` — so it can be skimmed and still land.
- Concrete nouns from the domain: corners, arms, seams, sheets, loops. Not
  "the entity" or "the object".
- No hedging. If it was measured, say it was measured. If it is a guess, say it
  is a guess.
- Do not congratulate the code. "Elegantly handles" tells the reader nothing.
