---
name: probe-the-binding
description: How to work against a foreign surface you did not build and cannot read - a WebAssembly module, an FFI layer, an embind/pybind wrapper, a vendored SDK, an undocumented HTTP API. Enumerate what is actually there at run time and test each call before believing it. Use this whenever a capability appears to be "not available in this build", whenever you are about to write a fallback or an approximation because a binding seems missing, whenever a library call fails in a way the upstream documentation does not explain, and whenever you catch yourself reasoning about a wrapper from the C++/upstream docs rather than from the wrapper. Also use before writing any deny-list of types or features a dependency "cannot handle".
---

# Probe the binding

A wrapper is not the library. It is a subset of the library, renamed by a
generator, with holes in it that nobody wrote down. Every serious mistake in
this project's kernel work came from reasoning about the wrapper from the
upstream library's documentation instead of asking the wrapper what it has.

The cost is not small. One of these mistakes stood for a year: a B-spline
fitter was believed unusable, so every curve in the program — sketched splines,
blend curves, interpolated curves, parabolas, projected curves — was handed on
as the polyline it had been sampled as, and extruding one produced forty-eight
flat strips instead of one surface. The fitter was there the whole time.

## Enumerate before you conclude

Before writing "this build does not carry X", list what it does carry and grep
that list. One script, run once, cached in a scratch file:

```js
const oc = await init({ wasmBinary: readFileSync(WASM) });
const names = Object.keys(oc);
for (const n of names.filter(n => /BSpline|Array1|Interpolate|Approx/.test(n)).sort()) {
  const v = oc[n];
  console.log(n.padEnd(46),
    typeof v === "function"
      ? "class(" + (v.prototype ? Object.getOwnPropertyNames(v.prototype).length - 1 : 0) + ")"
      : typeof v === "object" && v ? "enum{" + Object.keys(v).length + "}"
      : typeof v);
}
```

Then call the thing. A name in the list is not a working call.

## The four ways a name lies

**A typedef is not the name it is published under.** `TColgp_Array1OfPnt` is a
typedef of `NCollection_Array1<gp_Pnt>`, and the binding generator publishes
the template instantiation: `NCollection_Array1_gp_Pnt`. Searching for the
typedef returns nothing, which reads exactly like "not bound". Whenever a name
is absent, search for what it is an alias *of*, and for the underlying
container, before concluding anything.

**An enum can be exported and empty.** `Extrema_ExtFlag` was present as an
object with no keys, so `oc.Extrema_ExtFlag.Extrema_ExtFlag_MIN` was
`undefined`, and every constructor overload that took it threw before it ran.
Caught, that reads as "the two shapes never came near each other" — so a
nearest-face search silently returned face 0 every time and a point constraint
silently reported nothing. Check `Object.keys(someEnum).length`, not just that
the enum exists.

**Overload naming is a property of the generator, not the library.** This build
resolves overloads by arity under one plain name; other builds of the same
library append `_1`, `_2`, `_3`. Code written against the wrong convention
fails with `oc.Foo_2 is not a constructor`, which reads like a missing feature.
Print the matching names (`Object.keys(oc).filter(k => /^Foo/.test(k))`) rather
than guessing a suffix.

**An out-parameter comes back as an object.** C++ `Bar(N, Standard_Real& t)`
becomes embind's `Bar(N) → {t: 160}`. Read as a number it is `NaN`, and `NaN`
travels: it became a trim fraction, failed every comparison it was put through,
and surfaced as "no arc of that radius fits" with nothing wrong with the
radius. When a numeric result makes no sense, `console.log` its `typeof` before
anything else.

Write the accessor defensively once, at the boundary:

```js
const par = gap.ParOnEdgeS2(1);
const u = typeof par === "number" ? par : par && par.t;
if (!Number.isFinite(u)) return null;
```

## A trap is not an exception

A wasm module handed a class it was not compiled with does not refuse — it
traps ("null function or function signature mismatch"), sometimes catchably and
sometimes not, and the trap arrives at the *next* call rather than the one that
caused it. Long-running builders are the worst case: an `Add()` that is
accepted can collapse on the `Build()` that follows it, with no saying which
`Add` was to blame.

So: wrap the builder, not the call; and recover by asking for less rather than
by predicting what will fail (see `degrade-and-report`).

## Never write a deny-list of types

The tempting fix, after a trap, is a list: "this build cannot hold a tangency
to a surface of extrusion". That list was wrong. The faces that trapped were
cones — and a cone built on its own held a tangency perfectly well, as did
planes, cylinders, surfaces of revolution and B-spline patches, all tried.

It was not the class that could not be held. It was that particular geometry,
and no list of type names can know that in advance.

A deny-list also fails silently in the other direction: it stops you trying the
thing that would have worked. Prefer a ladder that asks for less on failure.

## Record what you found

Findings about a binding are expensive and they evaporate. Put them where the
next person hits them — in the comment beside the call, with the name that
failed and what it was actually called:

```js
//! Loaded and performed rather than constructed with arguments: this build
//! binds BRepExtrema_DistShapeShape but NOT the Extrema_ExtFlag enum its
//! longer constructors take, so every one of those throws before it runs.
```

And when you overturn an earlier finding, say what the earlier one got wrong.
The comment that said "this kernel carries no B-spline fitter" was written in
good faith; the one that replaced it names the typedef, so the next person
cannot repeat it.

## The checklist

1. Enumerate the surface and grep it — do not search for one name.
2. Search for the alias, the template, and the container, not just the typedef.
3. Check enums have keys.
4. Print the matching names before guessing an overload suffix.
5. Call it once in a scratch script and print the result's `typeof`.
6. Measure the result against something you can compute independently.
7. Write the finding into the comment beside the call.
