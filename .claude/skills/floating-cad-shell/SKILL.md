---
name: floating-cad-shell
description: How to lay out a professional application interface that floats over a 3D viewport without ever colliding with itself - measured docks, a scale variable instead of viewport units, a specification tree that searches and folds, a definition panel generated from a declaration, radial menus, and heads-up feedback. Use this whenever you are building the chrome around a 3D or canvas application, whenever panels overlap at some window size, whenever the UI is scaled or zoomed, whenever you are adding a tree/outliner/property panel/toolbar/context menu, and when deciding what belongs on screen at all.
---

# The floating shell

The interface floats over the model, which is the point — but floating over the
*model* and floating over *each other* are different things and only the first
one is wanted. Everything here is in service of that and of one budget:

> The modeller is one page and one page has a budget: the tools on the rail,
> the types in the catalogue, the words in the assistant's briefing. Everything
> that *could* be there costs something for everyone who does not want it.

Reference: `docs/src/app.js` and the stylesheet in `docs/src/index.html`.

## Never write a viewport unit

The interface is **scaled** on a large monitor with CSS `zoom`. A zoom scales a
box and its offsets *after* the browser has resolved them, and it does not
scale what a viewport unit or a percentage resolved to. So `100vh` inside a
panel at 1.15 comes back as the window's height and renders fifteen per cent
taller than the window, and a bar centred with `left: 50%` sits a hundred and
forty pixels right of centre.

Every such measurement goes through two variables that divide by the scale:

```css
--ui:   1.15;                    /* the interface scale */
--sky:  calc(100vh / var(--ui));
--span: calc(100vw / var(--ui));
```

This is a rule that ordinary CSS breaks by accident, so it is enforced by a
test that parses the stylesheet and fails on a raw `vw`/`vh`. Any rule you can
state in a sentence can usually be a test in twenty lines — write it the first
time it is broken, not the third.

## Measure the docks; do not guess them

What is down each side is not knowable in CSS. The tool rail's width depends on
how many tools a package added; the definition panel is wider for a script. So
the page **measures** and publishes them, and everything in the middle is
written against the result:

```css
--left-dock  --right-dock  --rail-w  --dock-h  --bar-h
--free:   /* what is left across the middle */
--middle: /* its centre */
```

A centred readout uses `--middle`, not `50%`. A full-width strip uses `--free`,
not `100%`. Re-measure on resize, on panel open/close, and after a package
loads.

Back it with a harness that opens the real page at ~11 window sizes in several
states and measures **every pair of panels for overlap**, reporting `every
state clean` or naming the pair. Layout regressions are invisible until a user
on a laptop finds them.

## The specification tree

The tree is the document's own order, and it earns its space by doing five
things well:

- **Fold and unfold** with `−`/`+`, remembered per node. A set that is shut
  stays shut — *except* that a search opens what it found, because folding was
  a decision and hiding the answer to what you just typed is not.
- **Search in place.** Double-click the header and it becomes a search field;
  type and the tree filters live, keeping ancestors of matches so context
  survives. Autocomplete on container names.
- **Zoom the text.** `−`/`+` on the panel header, persisted. A spec tree is
  read all day.
- **Show state, not just names.** A consumed feature is struck through; an
  errored one is marked; hidden ones carry an eye that is always present
  (pressed or not) rather than appearing on hover — a control you have to know
  about before you can find it is not a control.
- **Full names.** Truncating the one place a name is authoritative is a false
  economy; let the panel be wide enough or let the row wrap.

Selection conventions are the file-list ones, unchanged: plain click selects,
shift extends a range, Ctrl/Cmd toggles one. A right-click *on* the selection
is about the selection; one outside it takes the selection with it, so the menu
is never offering to delete four things you can no longer see marked.

## The definition panel is generated, never written

Every field is drawn from the catalogue declaration (see
`ocaf-document-model`): a `real` becomes a slider plus a typed value field, a
`ref` becomes a drop target with a dropdown filtered by its declared `kinds`, a
`choice` becomes a segmented control, a `when()` field appears and disappears
as its controlling choice changes.

The payoff is that **adding a feature type touches no interface code**. The
moment you find yourself writing a bespoke panel for one type, either the
declaration vocabulary is missing something (add an `ARG` kind) or that type is
doing too much.

Show the document underneath the field — `0:1:1:4:3 · TDataStd_Real` — in small
mono type. It costs nothing, it makes the model legible, and it turns bug
reports into precise ones.

## Radial menus for the frequent, lists for the rest

A pie menu at the pointer is faster than any toolbar for a small, stable set of
actions, because the gesture becomes muscle memory and direction is easier to
remember than position. Keep it to one ring of at most eight, put the most-used
at the cardinal points, and let a drag-through commit without a second click.

Everything else goes in the rail or a menu. Resist adding to the ring: its
value comes entirely from being small enough to be remembered.

## Heads-up feedback

A transient readout near the pointer or at the foot of the viewport is where a
modeller talks to you: the live value during a drag, what was just built, why
something is refusing.

Two rules learned by getting them wrong:

- **It must go away.** A temporary slider that persists past the value being
  set is worse than no slider. Give it a linger and an explicit Done.
- **A note is not an error.** A feature that built, and built what was asked,
  but has something to say about how — "12 faces sewn into a solid", "4 corners
  rounded · 1 too tight for 60" — needs somewhere to say it that does not stop
  the feature. Keep them visually distinct.

## Modes announce themselves and always have a way out

Sketching, mesh editing, looking through a camera, sectioning, presenting — each
is a mode. Each one puts a bar on screen saying what the mode is and what the
keys do, and each one exits on Esc. The status line during a mode is the right
place for the navigation convention, because that is exactly when someone has
forgotten it.

## Style is a property of the document, not of the app

Render styles, section styles and appearance belong on the feature and save
with the model. Keep them **outside the argument list** so they drive no
geometry and order no rebuild — XCAF keeps colour beside a shape for the same
reason.

## What to leave out

The strongest interface decision in this project was the package system: a
domain that is not general — climate analysis, pedestrian flow, packing —
declares itself as data and stays *off* until asked for, so its nodes are not
in the catalogue, not on the rail, and not in the assistant's briefing until
somebody wants them. Be honest in comments about what that actually saves (in
a single-file build every byte ships regardless; what you save is interface
budget, parse time and prompt size). See `one-way-through` for the pattern and
`plugin-making` for the worked example.
