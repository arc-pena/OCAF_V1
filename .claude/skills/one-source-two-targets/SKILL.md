---
name: one-source-two-targets
description: How to ship one source tree as two artefacts with opposite constraints - a single self-contained file and a served folder of files, or a desktop build and a web build, or an offline bundle and a CDN deployment. Covers the per-resource runtime switch, using the build script as the enforcement point for rules that would otherwise be "remember to", and writing a delivery contract so neither target is ever published without the other. Use this whenever a project must exist in two shapes, whenever you are adding a resource that one build inlines and the other fetches, whenever a rule is being kept by discipline instead of by a check, and whenever publishing is more than one step.
---

# One source, two targets

This program is published two ways and they want opposite things of it.

| | |
|---|---|
| `parametric-cad.html` | ONE file. A published Artifact may not fetch at run time, so a 22 MB WebAssembly kernel, a renderer and every package's data travel inside the page, gzipped and base64'd. |
| `index.html` + `app/` + `kernel/` | Files. A web server may be fetched from, so those are served as files and the source modules go across as they are, imported natively. |

Same source. The difference is a build script and one module.

## One switch, per resource, at run time

Do not branch on a build flag. Branch on what is *actually there*, once, in one
place, and let nothing above it know which build it is in:

```js
//! One resource, from wherever this page keeps it. `url` is only reached for
//! when the page carries no payload element - which is the whole of the
//! difference between the two builds.
export async function resource(elementId, url, what, type) {
  const bytes = packedBytes(elementId);       // a payload element, or null
  if (bytes) return inflate(bytes, type);
  if (!url) throw new Error("this page is missing its " + what);
  return await fetch(url);
}
```

Two properties make this worth doing:

- **It returns the same type either way.** A `Response` from an inflated gzip
  stream and a `Response` from `fetch` are the same thing to everything
  downstream, including the streaming WebAssembly compiler — which is why the
  kernel can be compiled while it is still being inflated.
- **It fails in words.** "could not load the Climate package's site table from
  data/cities.json — this page has to be served over http to load its own
  files" beats "failed to fetch".

## The trap the two builds set for each other

**In the bundled build every module shares one scope, so a missing import is
invisible. Served as modules it is a `ReferenceError` before the first frame.**

This has to be a check, not a rule, because the build you test in is usually
the one that forgives it. So the build script parses each module's imports and
refuses any name used but not imported.

The general form: **whenever two targets differ, find the mistake that only one
of them punishes, and make the build punish it for both.**

## The build script is the enforcement point

Anything that would otherwise be written in a contributing guide as "remember
to" belongs in the build as a `sys.exit`. This build refuses:

- a top-level name declared in two modules (they are concatenated into one
  scope, so the second silently wins);
- a name used without an import (see above);
- `import { X as Y }` anywhere — aliases make a concatenated build unreadable
  and a grep for a symbol lie;
- a data file listed but absent, **and a data file present but unlisted** —
  because an unlisted file loads in the served build and not in the bundled
  one, which is the kind of difference only somebody else ever finds.

Both directions matter. A one-way check catches half the drift:

```python
_on_disk = {f.name for f in sorted((DATA / "samples").glob("*.json"))}
_listed  = {name for _, name in SAMPLES}
if _on_disk != _listed:
    sys.exit("data/samples does not match SAMPLES in build.py: " + ...)
```

Each refusal should name the file and say what to do. A build that exits with
"missing" and a path costs a minute; a build that exits with a stack trace
costs an afternoon.

## Order is an interface when you concatenate

If one target staples modules together, the order of that list is load-bearing,
and the reason belongs beside it:

```python
# handle, gizmo and camera come before the kernel: the kernel's own drivers
# read from them - a camera's frustum is the same arithmetic the viewport
# looks through one with - and in the single file everything shares one
# scope, so the order is the order.
```

New modules go into the list in dependency order. That is a thing to say out
loud in the project's instructions, because it is invisible until it breaks.

## Say what the second shape actually costs

Be honest in comments about what a mechanism does and does not buy. From the
package system here:

> In a single-file page every byte is in the file whether a package is loaded
> or not. Do not write comments pretending otherwise. What loading really
> changes: its data is unpacked only on load; its drivers and views are only
> built on load; its nodes are not in the catalogue, on the rail, or in the
> assistant's briefing until then.

A comment that overstates a benefit is worse than no comment: the next person
optimises the wrong thing.

## Write the delivery contract down

Two targets means publishing is two steps after one build, and "I forgot the
other one" is the default failure. Put the contract at the top of the project's
instructions file, with the exact commands and the exact URL:

```
python3 docs/build.py          # writes BOTH

1. the Artifact - publish docs/parametric-cad.html to the existing URL so the
   link never changes: https://claude.ai/artifact/<id>
   Pass that URL; publishing without it makes a second artifact.
2. GitHub Pages - commit and push is what publishes it.

Never publish one without the other.
```

Name the failure mode beside the instruction ("publishing without it makes a
second artifact"). Instructions that say only what to do get followed until
someone is in a hurry; instructions that say what breaks get followed.

## The checklist for a new resource

1. Add it to the build's manifest, **and** add the both-ways check.
2. Reach for it through the one switch, by name, never by build flag.
3. Give the switch a `what` string that reads as English in an error.
4. Load it lazily — on the click that needs it, not on page load.
5. Build both targets and open both before saying it works.
