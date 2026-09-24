// What a slider IS.
//
// A slider has always had a range and it has always come from the catalogue, so
// every Cube in every document agreed that a length runs 1 to 4000 in 1s. That
// is a statement about cubes. "Bays, 1 to 12, whole numbers" is a statement
// about a building, and there was nowhere to put it.
//
// So a range is stored per feature and per argument, and the two things worth
// checking are the two that would look right while being wrong:
//
//   IT IS A RANGE, NOT A CAP. Clamping was taken out of setParameter once
//   already, because a 9 m wall silently became 4 m when a cube's slider
//   stopped there. Giving sliders their own ranges is exactly the change that
//   would put that back by accident.
//
//   IT SURVIVES THE FILE. A range that lives only in the running page is a
//   range that is gone tomorrow, and nothing on screen would say so.
import { createWasmKernel } from "../src/wasm-kernel.js";
import { Mdl } from "../src/mdl.js";
import { Doc, cleanRange, sliderRange, sliderSpan } from "../src/ocaf.js";
import { readFileSync } from "fs";

const DIR = process.env.OCJS_DIR || "/tmp/oc/rep/package/dist";
const init = (await import(DIR + "/replicad_single.js")).default;
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const kernel = await createWasmKernel({ initModule: init, wasmBinary: readFileSync(DIR + "/replicad_single.wasm") });
const mdl = new Mdl({ kernel, apply: () => {}, setNode: () => {}, readLayout: () => ({}),
                      select: () => {}, selected: () => null, picked: () => [] });
const at = async id => ((await kernel.tree()).tree.features).find(f => f.id === id);

/* ----------------------------------------------- the arithmetic on its own */
{
  const arg = { key: "dx", min: 1, max: 4000, step: 1 };
  check("with nothing stored a slider is what the catalogue declared",
        sliderRange(arg, null).min === 1 && sliderRange(arg, null).max === 4000
        && sliderRange(arg, null).custom === false);
  const own = sliderRange(arg, { dx: { min: 90, max: 300, step: 10, whole: true } });
  check("and what was stored when there is something stored",
        own.min === 90 && own.max === 300 && own.step === 10 && own.whole && own.custom,
        JSON.stringify(own));

  //! Upside down is a typo. Refusing it teaches nobody anything.
  const flipped = cleanRange(arg, { min: 300, max: 90, step: 10 }, null);
  check("a range typed the wrong way round is turned the right way up",
        flipped.min === 90 && flipped.max === 300, JSON.stringify(flipped));

  //! A step bigger than the range is a slider with one position on it.
  check("a step wider than the range is cut to the range",
        cleanRange(arg, { min: 0, max: 10, step: 400 }, null).step === 10);

  //! Whole numbers are whole all the way through - the ends as well as the step.
  const whole = cleanRange(arg, { min: 0.4, max: 11.6, step: 0.25, whole: true }, null);
  check("a whole-number slider is whole at both ends and in its step",
        whole.min === 0 && whole.max === 12 && whole.step === 1, JSON.stringify(whole));

  let refused = "";
  try { cleanRange(arg, { min: 5, max: 5, step: 1 }, null); }
  catch (e) { refused = e.message; }
  check("a slider with nowhere to travel is refused", /somewhere to travel/.test(refused),
        refused);
  refused = "";
  try { cleanRange(arg, { min: 0, max: 10, step: 0 }, null); }
  catch (e) { refused = e.message; }
  check("and so is a step of zero", /more than zero/.test(refused), refused);

  //! The track still stretches past its declared ends to hold a value that is
  //! outside them, which is what makes a range a range and not a cap.
  const span = sliderSpan({ min: 90, max: 300, step: 10 }, 9000);
  check("the track stretches to hold a value past the end of it",
        span.max >= 9000, JSON.stringify(span));
}

/* --------------------------------------------------- through the document */
{
  await kernel.loadModel({ format: "ocaf-parametric-model", version: 1,
                           name: "S", units: "mm", features: [] });
  await mdl.run({ op: "add", type: "Cube", id: "BX", name: "Block" });
  await mdl.run({ op: "range", id: "BX", key: "dx", min: 90, max: 300, step: 10 });
  check("a range set on one argument is published on the tree",
        JSON.stringify((await at("BX")).ranges.dx) ===
          JSON.stringify({ min: 90, max: 300, step: 10, whole: false }),
        JSON.stringify((await at("BX")).ranges));
  check("and only on the argument it was set on",
        Object.keys((await at("BX")).ranges).join() === "dx",
        Object.keys((await at("BX")).ranges).join());

  //! THE CHECK THAT MATTERS. min and max say how far the HANDLE goes. Typing a
  //! number past the end of a slider is how a 9 m wall gets into a model whose
  //! catalogue thinks walls are 300 mm, and it must keep working.
  await mdl.run({ op: "set", id: "BX", key: "dx", value: 9000 });
  check("a value past the end of its own range is kept, not clamped",
        (await at("BX")).values.dx === 9000, String((await at("BX")).values.dx));

  //! Whole numbers ARE enforced, because that is a statement about the kind of
  //! number and not about its size.
  await mdl.run({ op: "range", id: "BX", key: "dy", min: 1, max: 12, step: 1, whole: true });
  await mdl.run({ op: "set", id: "BX", key: "dy", value: 4.37 });
  check("a whole-number slider rounds whatever it is handed",
        (await at("BX")).values.dy === 4, String((await at("BX")).values.dy));

  //! Including the number already sitting on it when the kind changes.
  await mdl.run({ op: "range", id: "BX", key: "dz", min: 0, max: 50, step: 0.5 });
  await mdl.run({ op: "set", id: "BX", key: "dz", value: 12.4 });
  check("a real slider keeps its fraction", (await at("BX")).values.dz === 12.4,
        String((await at("BX")).values.dz));
  await mdl.run({ op: "range", id: "BX", key: "dz", whole: true });
  check("and turning it to whole numbers rounds the number already on it",
        (await at("BX")).values.dz === 12, String((await at("BX")).values.dz));

  //! Undo is what makes it an edit of the model rather than a setting on a
  //! window.
  await mdl.run({ op: "undo" });
  check("undo puts the slider back the way it was",
        (await at("BX")).ranges.dz.whole === false,
        JSON.stringify((await at("BX")).ranges.dz));

  await mdl.run({ op: "range", id: "BX", key: "dx", reset: true });
  check("reset takes the argument back to the catalogue",
        !((await at("BX")).ranges || {}).dx,
        JSON.stringify((await at("BX")).ranges));

  /* ------------------------------------------------ and it survives the file */
  const saved = await kernel.model();
  const written = saved.model || saved;
  const row = written.features.find(f => f.id === "BX");
  check("the file carries the ranges beside the arguments, not among them",
        !!row.ranges && row.ranges.dy.whole === true && row.args.dy === 4,
        JSON.stringify(row.ranges));
  check("and an argument with no range of its own is not written",
        !row.ranges.dx, Object.keys(row.ranges).join());

  await kernel.loadModel(written);
  const back = await at("BX");
  check("opening the file again gives the same sliders",
        JSON.stringify(back.ranges) === JSON.stringify(row.ranges),
        JSON.stringify(back.ranges));
  check("and the same numbers on them", back.values.dy === 4 && back.values.dx === 9000,
        back.values.dy + ", " + back.values.dx);

  //! A file may be written by hand or by something else. A range that is
  //! upside down in it opens rather than refusing the whole document.
  await kernel.loadModel({
    format: "ocaf-parametric-model", version: 1, name: "S", units: "mm",
    features: [{ id: "C", type: "Cube", name: "C", args: { dx: 50 },
                 ranges: { dx: { min: 400, max: 10, step: 0.3, whole: true } } }],
  });
  const fixed = (await at("C")).ranges.dx;
  check("a nonsense range in a file is made sensible rather than refused",
        fixed.min === 10 && fixed.max === 400 && fixed.step === 1 && fixed.whole === true,
        JSON.stringify(fixed));
}

/* ------------------------------------------------------ what it is not for */
{
  //! A range belongs to a real argument. Asking for one on a choice or a
  //! reference is a mistake worth a sentence rather than a silent no-op.
  await kernel.loadModel({ format: "ocaf-parametric-model", version: 1,
                           name: "S", units: "mm", features: [] });
  await mdl.run({ op: "add", type: "Plane", id: "PL", name: "Plane" });
  let refused = "";
  try { await mdl.run({ op: "range", id: "PL", key: "kind", min: 0, max: 2, step: 1 }); }
  catch (e) { refused = e.message; }
  check("a choice has no slider to shape", /no slider/.test(refused), refused);
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
