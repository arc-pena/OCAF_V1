---
name: surgical-edits
description: How to change code safely in a large file or a large codebase using scripted edits - anchoring on text you have actually read, failing atomically, checking the literal bytes of unicode punctuation, and never creating a file whose name you have not checked is free. Use this whenever you are about to apply a multi-part patch with a script or heredoc, whenever an edit silently does nothing, whenever a file has thousands of lines and a unique anchor is hard to find, whenever you are writing a new test or module file, and whenever a patch has to touch several places that must all land or none.
---

# Surgical edits

Working in files of six and ten thousand lines, with a build that refuses
duplicate declarations, the mechanics of *applying* a change become a source of
bugs in their own right. These are the ones that actually cost time here.

## A failed assertion discards the whole script

A Python patch script that verifies each anchor before replacing it, and writes
the file at the end, throws away **every** edit when the fourth assertion
fails. You then have a script that printed a traceback and a file that is
unchanged — which is the correct behaviour, but it looks identical to "the
script ran and did nothing" if you were not watching.

Two habits:

- **Assert first, write last, and print something on success.** `print("ok")`
  at the end. Its absence is the signal.
- **Verify the result, not the exit code.** `grep` for the new text, or
  `node --check`, immediately after. A patch that reports success and changes
  nothing is the expensive failure.

## Anchor on bytes you have actually seen

The single most common cause of a silently-failing patch here was unicode
punctuation. Source in this project contains both literal `·` and `—` **and**
escaped `·` and `—`, sometimes in adjacent lines. A heredoc anchor
written with the wrong one never matches:

```bash
sed -n '2230,2250p' file.js | cat -A | cut -c1-110    # see the real bytes
```

When in doubt, do not anchor on prose at all. Anchor on **line indices found by
a unique predicate**, which sidesteps the encoding question entirely:

```python
lines = io.open(p, encoding="utf8").read().split("\n")
def only(pred, what):
    hits = [i for i, l in enumerate(lines) if pred(l)]
    assert len(hits) == 1, (what, hits)          # ambiguous anchor fails loudly
    return hits[0]

a = only(lambda l: "THE ONE SURFACE THIS BUILD CANNOT" in l, "block start")
b = only(lambda l: l.strip().startswith("const NO_TANGENCY"), "block end")
assert b > a
lines[a:b + 1] = new_block.split("\n")
```

`only()` is the useful part: it fails when an anchor matches twice, which is
the case that would otherwise patch the wrong site and look fine.

## Never write a file whose name you have not checked

A new test suite was created as `samples.test.mjs` — and silently overwrote an
existing 199-line suite of the same name. It was caught only because
`git status` showed `M` where `A` was expected, and because the suite count
stayed at 40 when it should have gone to 41.

Before `Write` on any path you believe is new:

```bash
ls path/ | grep name        # or: git ls-files | grep name
```

And after: check the counts you expect to have changed actually changed. A
staged-file list that says `M` for a file you just created is telling you
something.

## Keep a restore point for anything non-trivial

```bash
cp docs/src/wasm-kernel.js /tmp/scratch/wk.bak
```

Cheap, and it turns "the patch half-applied and I do not know what state this
is in" from a crisis into `cp` back. Use it before any multi-site patch, and
before any experiment you intend to undo — including deliberately reverting a
fix to measure what it did.

## Reverting to measure is a first-class technique

The cleanest proof that a change did something is the same measurement with the
change backed out and then restored:

```bash
cp src/app.js /tmp/app.bak
sed -i 's/THREE.DoubleSide/THREE.FrontSide/' src/app.js
<build> && <measure>                       # the "before" number
cp /tmp/app.bak src/app.js && <build>      # restored
```

**Rebuild after restoring.** A generated artefact left over from the
experimental build is the reason a later run reported `side=0` and sent the
investigation down a false trail for ten minutes. Anything derived — a bundle,
a test page, a dist folder — has to be regenerated after any source change,
including the one that undoes a change.

## Leave nothing behind

Debug lines survive into commits. `console.log("DEBUG face kind:", …)` sat in
the kernel across a build and a publish. Before staging:

```bash
grep -rn "DEBUG\|console.log\|__DBG\|TODO(me)" src/ | grep -v <known-legit>
```

Better: gate temporary instrumentation on a global that cannot be true in
production (`if (globalThis.__FCDBG) …`), so a leftover is inert — and still
grep for it.

## Understand the harness before blaming the code

An investigation into a fillet failure went looking at arc geometry. The actual
cause was the harness: creating a node in a document that already has datums
auto-wired the Origin in as the first point, so the polyline had five points
and a spike, not four. The node was behaving correctly.

Before concluding the code is wrong, print the **input as the program received
it**, not as you intended it:

```js
const model = await kernel.model();
say(JSON.stringify(model.features.find(x => x.id === "PLY").args));
// → {"points":[{"ref":"PT1"},{"ref":"FP0"},…]}   ← PT1 was not asked for
```

That one line would have saved the detour. Make it the first diagnostic, not
the last.

## Scale the tool to the job

- One occurrence, text you have read → `Edit`.
- Several sites that must all land → one Python script with `only()` anchors and
  a `print("ok")`.
- A mechanical rename across many files → `sed -i` with a `grep -c` before and
  after, so you know how many it touched.
- Anything you cannot describe as a precise textual transform → do it by hand.
  A clever regex applied to 10,000 lines is a bad trade.
