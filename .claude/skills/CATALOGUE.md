# The catalogue

Eight practice skills, distilled from building the OCAF parametric modeller in
`docs/` — roughly 57,000 lines of source and tests, a WebAssembly geometry
kernel, two publication targets and 42 test suites.

They are not about CAD. They are about the class of problem this turned out to
be: **software with a hard, foreign core, an output you cannot verify by
looking at it, and a persisted format other people's files depend on.** Nine
tenths of what was learned transfers to simulation, graphics, compilers, audio,
robotics, data pipelines — anything where "it ran and produced something" is a
long way from "it is right".

Each skill was written from a specific failure in this repository. The
failures are named in them on purpose: a rule with a scar attached gets
followed when somebody is in a hurry, and a rule without one does not.

## The eight

| skill | the question it answers |
|---|---|
| **probe-the-binding** | What does this foreign library *actually* expose, as opposed to what its documentation says? |
| **measured-truth** | How do I know this is right, when looking at it proves nothing? |
| **degrade-and-report** | What should this do when it cannot do all of what it was asked? |
| **one-way-through** | Where is the single place that decides this, and why are there two? |
| **append-only-model** | Will the files people already saved still open after this change? |
| **one-source-two-targets** | How does one source tree ship as two artefacts with opposite constraints? |
| **evidence-in-prose** | How do I write this down so the next person does not undo it? |
| **surgical-edits** | How do I change ten thousand lines without the edit silently doing nothing? |

## The four ideas underneath them

**1. Ask, do not predict.** The deny-list of surface types was wrong; the
ladder that tries and asks for less was right. The binding that "did not carry
a B-spline fitter" carried one under a different name. Predicting the behaviour
of a system you cannot see inside is how a year gets lost. Enumerate it, call
it, measure it.

**2. A number, or it did not happen.** Every claim in this project that held up
is one somebody could recompute: a perimeter of exactly 800 − 4(2r − πr/2), one
face instead of forty-eight, 0.000001° at a fillet join, 178,244,255 lit and
14,20,28 from behind. Every claim that turned out to be wrong was a claim
somebody had looked at and found plausible.

**3. Partial and explained beats complete and silent.** "4 corners rounded · 1
too tight for 60" is a position to work from. A wire that quietly loses an edge
is not, and neither is a patch that reports success while sailing 883 mm past
the point it was told to pass through. The worst outcome is never a refusal; it
is a confident wrong answer.

**4. Write down why, not what.** The code says what. The comment exists to stop
the decision being undone — so it carries the measurement that settled it, the
road that was tried and rejected, and the thing that broke last time. About
3,300 of them here, and they are the reason a fix made in week one could be
correctly overturned in week twelve.

## Using them

They live in `.claude/skills/` and load automatically in this repository.

To use them on other projects, copy the folders into `~/.claude/skills/` —
they are deliberately written to be portable, and the examples are labelled as
examples rather than as the subject.

They also read perfectly well as an essay. If you are new to this codebase,
read **one-way-through** and **measured-truth** first; they explain more about
why the code looks the way it does than the README does.

## The ninth, already here

`plugin-making` predates these and is the odd one out: it is specific to this
modeller rather than general. It is the worked example of **one-way-through**'s
last section — extension by declaration, inert until asked.
