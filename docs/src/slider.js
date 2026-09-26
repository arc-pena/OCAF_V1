// What a slider IS, edited.
//
// A slider has always had a range, and it has always come from the catalogue:
// a fillet radius travels 0 to 200 because that suits fillets. That is a good
// default and a bad answer. The bays in a building go 1 to 12 and there is no
// such thing as 4.5 of them; a wall is 90 to 300 in tens; a survey coordinate
// wants millions. None of those are facts about "every real number in the
// program", which is the only thing the catalogue can say.
//
// So the range belongs to the feature, it is stored in the document beside the
// value (see F.range in ocaf.js), and this is the window that sets it.
// Grasshopper puts that window behind a double-click on the slider, which is
// the right gesture for it: it is the one part of a slider you cannot reach by
// dragging.
//
// TWO HOSTS, ONE EDITOR. The definition panel lives in the page; the node graph
// may be popped out into a window of its own with a stylesheet of its own. So
// nothing here reaches for `document`, everything is built in the document it
// is handed, and the stylesheet is carried along and added once per document.

import { cappedTo, sliderSpan } from "./ocaf.js";

//! WHAT THE HANDLE SHOWS, kept true to what the model will hold. Both hosts
//! push a number without rebuilding their own panel - a rebuild in the middle
//! of a drag would take the slider out from under the hand - so whatever the
//! handle is drawn at after a typed number is whatever this puts it at.
//!
//! Two things went wrong without it, and the second was the bad one:
//!
//!   · typing 1500 into a slider whose track ends at 1000 left the handle at
//!     the end of the track. The model held 1500; the slider said 1000.
//!   · the next drag then sent that 1000, so a number typed past the end of a
//!     track was destroyed by touching the handle.
//!
//! So a value the slider may keep (see cappedTo: a range set on the feature is
//! a cap, the catalogue's is not) stretches the track to hold it instead.
export function holdOnTrack(slider, shape, value) {
  const kept = cappedTo(shape && shape.custom ? shape : null, value);
  if (!Number.isFinite(kept)) return kept;
  const span = sliderSpan(shape, kept);
  if (Number(slider.min) !== span.min) slider.min = String(span.min);
  if (Number(slider.max) !== span.max) slider.max = String(span.max);
  slider.value = String(kept);
  return kept;
}

//! Scoped to .sl-pop and its own classes, so it cannot land on anything else
//! in either host. The colours are read from whichever stylesheet is around it
//! - the page and the graph both publish the same three - and fall back to
//! plain values in a document that publishes neither.
export const SLIDER_CSS = `
.sl-pop {
  position: fixed; z-index: 9000; width: 248px; padding: 10px 11px 9px;
  border: 1px solid var(--g-line, rgba(20,40,60,.18));
  border-radius: 9px; background: var(--g-node, #fff);
  color: var(--g-ink, #15212b);
  box-shadow: var(--g-shadow, 0 1px 2px rgba(16,28,38,.1), 0 10px 30px rgba(16,28,38,.16));
  font-family: var(--g-sans, ui-sans-serif, system-ui, sans-serif); font-size: 11.5px;
}
.sl-pop, .sl-pop * { box-sizing: border-box; }
.sl-pop button, .sl-pop input { font: inherit; color: inherit; }
.sl-head {
  display: flex; align-items: baseline; gap: 6px; margin-bottom: 8px;
  font-weight: 600; font-size: 11.5px;
}
.sl-head .sl-of { font-weight: 400; color: var(--g-ink-3, #7d8d99); font-size: 10px; }
.sl-kind { display: flex; gap: 3px; margin-bottom: 8px; }
.sl-kind button {
  flex: 1; height: 22px; border: 1px solid var(--g-line, rgba(20,40,60,.18));
  background: transparent; border-radius: 5px; font-size: 10.5px; cursor: pointer;
}
.sl-kind button[aria-pressed="true"] {
  background: var(--g-accent, #0a6cb0); border-color: var(--g-accent, #0a6cb0);
  color: var(--g-accent-ink, #fff);
}
.sl-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
.sl-grid label {
  display: block; font-size: 9.5px; letter-spacing: .04em; text-transform: uppercase;
  color: var(--g-ink-3, #7d8d99); margin-bottom: 2px;
}
.sl-grid input {
  width: 100%; height: 23px; padding: 0 5px; text-align: right;
  border: 1px solid var(--g-line, rgba(20,40,60,.18)); border-radius: 5px;
  background: transparent;
  font-family: var(--g-mono, ui-monospace, Menlo, monospace); font-size: 10.5px;
}
.sl-grid input:focus { outline: none; border-color: var(--g-accent, #0a6cb0); }
.sl-note { margin-top: 7px; font-size: 10px; color: var(--g-ink-3, #7d8d99); line-height: 1.35; }
.sl-note.sl-bad { color: var(--g-bad, #bb3a2c); }
.sl-feet { display: flex; align-items: center; gap: 5px; margin-top: 9px; }
.sl-feet .sl-gap { flex: 1; }
.sl-feet button {
  height: 23px; padding: 0 9px; border: 1px solid var(--g-line, rgba(20,40,60,.18));
  background: transparent; border-radius: 5px; font-size: 10.5px; cursor: pointer;
}
.sl-feet button.sl-go {
  background: var(--g-accent, #0a6cb0); border-color: var(--g-accent, #0a6cb0);
  color: var(--g-accent-ink, #fff); font-weight: 600;
}
.sl-feet button[disabled] { opacity: .4; cursor: default; }
`;

//! One at a time, whichever document it was opened in. Two of these on screen
//! would be two answers to the same question.
let live = null;

export function closeSliderEditor() {
  if (live) live();
}

//! \p near is the slider itself: the window sits under it, pushed back onto the
//! screen if it would hang off. \p base is what the catalogue declares, so the
//! window can say what "reset" would go back to.
export function openSliderEditor({ doc, near, title, unit, range, base, value,
                                   onApply, onReset }) {
  closeSliderEditor();
  if (!doc.getElementById("slider-css")) {
    const style = doc.createElement("style");
    style.id = "slider-css";
    style.textContent = SLIDER_CSS;
    doc.head.appendChild(style);
  }

  const pop = doc.createElement("div");
  pop.className = "sl-pop";
  const say = n => (Number.isFinite(n) ? String(Math.round(n * 1e6) / 1e6) : "");
  pop.innerHTML =
    '<div class="sl-head">' + escape(title || "Slider") +
      (unit ? '<span class="sl-of">' + escape(unit) + "</span>" : "") + "</div>" +
    '<div class="sl-kind">' +
      '<button type="button" data-kind="real">Real</button>' +
      '<button type="button" data-kind="whole">Whole numbers</button>' +
    "</div>" +
    '<div class="sl-grid">' +
      '<div><label for="sl-min">Min</label><input id="sl-min" type="number" step="any" value="'
        + say(range.min) + '"></div>' +
      '<div><label for="sl-max">Max</label><input id="sl-max" type="number" step="any" value="'
        + say(range.max) + '"></div>' +
      '<div><label for="sl-step">Step</label><input id="sl-step" type="number" step="any" min="0" value="'
        + say(range.step) + '"></div>' +
    "</div>" +
    '<div class="sl-note" data-slot="note"></div>' +
    '<div class="sl-feet">' +
      '<button type="button" data-do="reset"' + (range.custom ? "" : " disabled") +
        ">Catalogue</button><span class=\"sl-gap\"></span>" +
      '<button type="button" data-do="cancel">Cancel</button>' +
      '<button type="button" class="sl-go" data-do="apply">Apply</button>' +
    "</div>";
  doc.body.appendChild(pop);

  const box = { min: pop.querySelector("#sl-min"), max: pop.querySelector("#sl-max"),
                step: pop.querySelector("#sl-step") };
  const kind = [...pop.querySelectorAll(".sl-kind button")];
  const note = pop.querySelector('[data-slot="note"]');
  let whole = !!range.whole;

  //! WHAT IT WILL DO, BEFORE IT DOES IT. The rules that make a range sensible -
  //! turning an upside-down one the right way up, rounding a whole-number one -
  //! live in cleanRange, on the far side of an edit. Saying the same thing here
  //! would be saying it twice; showing what is about to happen is not.
  const sayIt = () => {
    const min = Number(box.min.value), max = Number(box.max.value);
    const step = Number(box.step.value);
    const bad = [];
    if (!Number.isFinite(min) || !Number.isFinite(max)) bad.push("min and max must be numbers");
    else if (min === max) bad.push("min and max are the same - the handle has nowhere to go");
    if (!(step > 0)) bad.push("the step must be more than zero");
    note.classList.toggle("sl-bad", bad.length > 0);
    if (bad.length) { note.textContent = bad[0]; return false; }
    const span = Math.abs(max - min);
    const stops = Math.floor(span / Math.min(step, span)) + 1;
    //! AND WHAT IT WILL DO TO THE NUMBER ON IT. A range set here is a cap, so
    //! a max below the value standing on the slider changes that value - which
    //! is right, and must not be a surprise found afterwards.
    const lo = Math.min(min, max), hi = Math.max(min, max);
    const caught = Number.isFinite(value) && (value < lo || value > hi)
      ? " · " + say(value) + " becomes " + say(value < lo ? lo : hi) : "";
    note.textContent = (whole ? "Whole numbers. " : "")
      + stops.toLocaleString() + (stops === 1 ? " position" : " positions")
      + " · a number outside this is brought back to it" + caught
      + (range.custom || base ? " · catalogue: " + say(base.min) + " to " + say(base.max)
                                 + " in " + say(base.step) + " (no cap)" : "");
    return true;
  };

  const paint = () => {
    for (const button of kind)
      button.setAttribute("aria-pressed",
        String((button.dataset.kind === "whole") === whole));
    sayIt();
  };
  for (const button of kind)
    button.addEventListener("click", () => {
      whole = button.dataset.kind === "whole";
      //! Shown rounded the moment the kind changes, rather than at Apply, so
      //! nobody types 0.25 into a whole-number step and finds out later.
      if (whole) {
        for (const key of ["min", "max"])
          if (Number.isFinite(Number(box[key].value)))
            box[key].value = String(Math.round(Number(box[key].value)));
        box.step.value = String(Math.max(1, Math.round(Number(box.step.value) || 1)));
      }
      paint();
    });
  for (const input of Object.values(box)) input.addEventListener("input", sayIt);
  paint();

  const apply = () => {
    if (!sayIt()) return;
    close();
    onApply({ min: Number(box.min.value), max: Number(box.max.value),
              step: Number(box.step.value), whole });
  };
  pop.querySelector('[data-do="apply"]').addEventListener("click", apply);
  pop.querySelector('[data-do="cancel"]').addEventListener("click", () => close());
  const reset = pop.querySelector('[data-do="reset"]');
  reset.addEventListener("click", () => { close(); onReset(); });

  pop.addEventListener("keydown", event => {
    if (event.key === "Enter") { event.preventDefault(); apply(); }
    else if (event.key === "Escape") { event.preventDefault(); close(); }
    //! The graph reads single keys as shortcuts and the page reads Delete; a
    //! window with three number boxes in it must not be typed through to
    //! either of them.
    event.stopPropagation();
  });
  //! Everything a host might act on, stopped at the window's edge. A
  //! pointerdown inside it must not start a node drag or clear the selection.
  for (const name of ["pointerdown", "mousedown", "click", "dblclick", "wheel"])
    pop.addEventListener(name, event => event.stopPropagation());

  const elsewhere = event => { if (!pop.contains(event.target)) close(); };
  //! Capture, because both hosts stop these events on their own way up.
  doc.addEventListener("pointerdown", elsewhere, true);
  const away = () => close();
  const view = doc.defaultView;
  view.addEventListener("resize", away);
  view.addEventListener("blur", away);
  //! Anchored to the slider it was opened from, and the slider moves when the
  //! panel or the canvas scrolls. Rather than follow it, go away: a window
  //! pointing at nothing is worse than one that closed.
  doc.addEventListener("scroll", away, true);

  function close() {
    if (live !== close) return;
    live = null;
    doc.removeEventListener("pointerdown", elsewhere, true);
    doc.removeEventListener("scroll", away, true);
    view.removeEventListener("resize", away);
    view.removeEventListener("blur", away);
    pop.remove();
  }
  live = close;
  place(pop, near, view);
  box.min.focus();
  box.min.select();
  return close;
}

//! Under the slider, and back on screen if that would hang it off an edge.
function place(pop, near, view) {
  const at = near.getBoundingClientRect();
  const size = pop.getBoundingClientRect();
  const margin = 8;
  let left = at.left + at.width / 2 - size.width / 2;
  left = Math.max(margin, Math.min(view.innerWidth - size.width - margin, left));
  let top = at.bottom + 6;
  //! Above it instead when there is no room below - which is most of the time
  //! for the last slider on a tall panel.
  if (top + size.height > view.innerHeight - margin)
    top = Math.max(margin, at.top - size.height - 6);
  pop.style.left = Math.round(left) + "px";
  pop.style.top = Math.round(top) + "px";
}

//! DOUBLE-CLICKING A TRACK MOVES THE HANDLE. That is what a range input does
//! with a click, and a double-click is two of them - so the gesture that opens
//! this window would, on its way in, change the number it is about to describe.
//!
//! The second click is stopped before the browser acts on it, and the value the
//! first one moved off is put back. One redundant value goes to the kernel and
//! comes straight back; that is the price of the gesture, and it is coalesced
//! with everything else in flight.
//! ON mousedown AND NOT pointerdown, which is the whole of why the first
//! version did nothing: a PointerEvent's `detail` is 0 by specification, always,
//! so "this is the second click" cannot be asked of one. MouseEvent.detail is
//! the click count, and mousedown still arrives before the browser moves the
//! handle, which is what preventDefault has to get in front of.
export function armSliderEditor(slider, { open, revert }) {
  let before = null;
  slider.addEventListener("mousedown", event => {
    if (event.detail <= 1) { before = slider.value; return; }
    if (event.detail !== 2) return;
    event.preventDefault();
    event.stopPropagation();
    if (before !== null && before !== slider.value) revert(before);
    before = null;
    open(event);
  });
  slider.addEventListener("dblclick", event => {
    event.preventDefault();
    event.stopPropagation();
  });
}

const escape = text => String(text)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
