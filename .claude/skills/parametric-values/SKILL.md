---
name: parametric-values
description: How to make every number in an application a typed, unit-aware, expression-capable value - so a user can type 10m in a millimetre document, write sqrt(2)*span/2 in a field, and have a reference to another parameter become a real node in the model. Covers unit tables and conversion, a safe expression parser with no eval, typed value fields, sliders that know their quantity, and promoting an inline formula to a document feature. Use this whenever you are building numeric input, sliders, property fields, a formula or expression system, unit handling, or parameter linking in any design or engineering tool.
---

# Parametric values

In a design tool every number is three things at once: a quantity with a unit,
possibly an expression, and possibly a link to another number. Treating it as a
bare float is the decision you cannot undo later, because the field, the
storage, the panel, the graph and the file format all get built on top of it.

Reference: `docs/src/formula.js` in this repository.

## Declare the quantity, not just the range

An argument declares what kind of number it is, and everything downstream reads
that:

```js
real("distance", "Distance", 40, -2000, 2000, 1)        // a length: document units
real("angle", "Angle", 45, -360, 360, 1, "°")           // an angle
real("at", "Along it", 0.5, 0, 1, 0.01, "")             // dimensionless
```

The quantity decides:

- **what a typed value means** — `10m` in a millimetre document is 10 000, but
  `10m` in an angle field is nonsense and should say so;
- **how the slider behaves** — a ratio wants 0–1 with fine steps, a length
  wants a span derived from the model's own size;
- **how the value is displayed** — `1.5 m` or `1500 mm`, `45°`, `0.5`;
- **what unit suffix the field accepts.**

Keep a units table with a name, a symbol, a quantity and a factor, and one
`convert(from, into)`. Everything else — parsing a suffix, formatting a
readout, converting on document-unit change — is that table plus a lookup.

## Parse expressions; never `eval`

A field should accept `10 * 10mm`, `span/2`, `sqrt(2) m`, `pi * r^2`. That
needs a real little parser, and it is perhaps two hundred lines:

```js
tokenise(text)                       // numbers, names, operators, unit suffixes
parse(text)                          // → an AST
namesIn(tree)                        // → the identifiers it references
evaluate(tree, { into, lookup })     // → a number, in `into` units
jsOf(tree, names, into)              // → source, for a script/codegen path
saysFormula(said)                    // → is this text an expression at all?
readValue(text, { unit, lookup, known })
```

Design notes that mattered:

- **A trailing unit is an AST node** (`scaled`), not a string strip. `sqrt(2) m`
  has to scale the *result*, and `10mm + 2cm` has to convert both operands.
- **`namesIn`** is what lets the UI know a field references `span` before
  evaluating it — so it can wire, highlight or refuse.
- **`lookup`** is injected, not global. The same parser serves a field bound to
  the document, a script sandbox and a test with a fixed table.
- **Never `eval`.** Not for safety theatre — for *diagnostics*. A parser can
  say "no parameter called `widht`" and point at the character. `eval` says
  `ReferenceError`.
- Keep a `jsOf` emitter if you also have a scripting feature: one grammar,
  two backends, no drift.

## A reference in a field becomes a node

This is the feature that turns a modeller into a parametric one. When a user
types `param1 / param2` into a value field, do not store a resolved number and
do not store an opaque string — **create an Expression feature in the document
and wire the field to it.**

What that buys:

- the expression is visible in the tree and in the node graph;
- it re-evaluates when its inputs change, through the ordinary solver, in
  dependency order, with no special casing;
- it is undoable, savable and renameable like anything else;
- several fields can share it, and the graph shows that they do;
- an error in it is a feature error with a name attached, not a silent NaN.

The rule generalises: **when an inline value acquires dependencies, promote it
to a first-class object.** Anything else means building a second, weaker
dependency system beside the one you already have.

Keep the plain cases plain, though. A literal `40` stays a literal. Promotion
happens when `saysFormula()` says the text is an expression *and* it references
something.

## The value field

One component, used everywhere, that accepts all of it:

```
40            a number, in document units
10m           a number with a unit, converted
10 x 10mm     arithmetic
span/2        a reference — promoted to a node
```

and shows, while editing, what it will resolve to. Behaviours worth copying:

- **Type-ahead resolution.** Show `= 1500 mm` under the field as they type. Most
  expression errors are caught by the user before they commit.
- **Round-trip what was typed.** Store the expression, not only its value, so
  reopening the field shows `span/2` and not `1250`.
- **Commit on Enter and blur, revert on Esc**, and leave the previous value
  visible until commit.
- **Sliders and fields are the same value.** Dragging writes the number and
  clears any expression — say so, once, rather than silently discarding a
  formula.

## Sliders need a span, not a hard range

A fixed `min`/`max` is wrong for a tool used at both bracket scale and building
scale. Derive the working span from the declaration *and* the model's own size,
and let the field accept anything outside it:

```js
sliderSpan(arg, value)   // a sensible span around the current value
clampTo(spec, value)     // what the document will actually accept
```

A slider is an affordance for the common range; the field is the escape hatch.
Never let the slider's range be the limit of what can be expressed.

## Units are a document property

The document declares its units (`"mm"`), files carry them, and imports state
them so nothing asks on open. Changing document units converts stored values
once and re-labels every field — it does not reinterpret them. Write a test for
that: the cheapest catastrophic bug in this space is a factor of 25.4 applied
twice or not at all.
