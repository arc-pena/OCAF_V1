// Choosing a colour.
//
// A row of swatches answers "which of these", and most of the time that is the
// question. This answers "which colour", which is a different one and needs a
// different instrument: a square you drag in, a hue strip beside it, and the
// numbers underneath for when you already know them.
//
// It is Blender's arrangement rather than the browser's `<input type=color>`,
// for three reasons that matter here:
//
//   the browser's one is the operating system's, so it looks like a different
//   program every time and cannot be themed with the rest of this page;
//
//   it does not open where you clicked - on Windows it is a modal in the
//   middle of the screen - so you lose sight of the thing you are colouring;
//
//   and it has no idea the page is working in LINEAR light. A material's
//   colour here is linear 0..1, what a person types is sRGB hex, and the
//   conversion between them is a factor of about 2.2 that nobody notices
//   until the renders all come out pale.
//
// So: hex in and out is sRGB, because that is what a hex code has always
// meant and what anybody pastes from a brand guide. The value it hands back
// is LINEAR, because that is what the renderer and the material table want.
// The conversion is in one place, here, and is the real sRGB transfer
// function rather than pow(2.2) - they differ by enough to see in a dark grey.

/* ------------------------------------------------------- colour spaces */

//! The sRGB transfer function and its inverse, as the standard writes them.
//! The straight line near black is not a rounding detail: pow(1/2.2) alone
//! puts the first few values of an 8-bit ramp in the wrong place, which is
//! exactly where a shadow lives.
export const toLinear = v =>
  v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
export const toSrgb = v =>
  v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;

const held = v => (v < 0 ? 0 : v > 1 ? 1 : v);
const byte = v => Math.round(held(v) * 255);

//! Linear triple -> "#rrggbb" in sRGB, which is what a person reads.
export const linearToHex = rgb =>
  "#" + rgb.slice(0, 3).map(v => byte(toSrgb(held(v))).toString(16).padStart(2, "0")).join("");

//! "#rrggbb" or "#rgb" -> linear triple. Anything unreadable comes back as
//! mid grey rather than as null: a colour field that answers with nothing is
//! a colour field that paints an object black the first time somebody
//! mistypes.
export function hexToLinear(hex) {
  const text = String(hex || "").trim().replace(/^#/, "");
  const full = text.length === 3 ? text.split("").map(c => c + c).join("") : text;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return [0.5, 0.5, 0.5];
  return [0, 2, 4].map(i => toLinear(parseInt(full.slice(i, i + 2), 16) / 255));
}

/* ------------------------------------------------------------ hue, etc */

//! HSV from sRGB, both 0..1. The picker works in sRGB on purpose: a hue
//! square laid out in linear light has almost all of its area in the top
//! quarter of the brightness, and dragging through the bottom of it does
//! nothing you can see.
export function rgbToHsv([r, g, b]) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d > 1e-9) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h, max <= 1e-9 ? 0 : d / max, max];
}

export function hsvToRgb([h, s, v]) {
  const i = Math.floor(h * 6) % 6;
  const f = h * 6 - Math.floor(h * 6);
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  const table = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]];
  return table[(i + 6) % 6];
}

/* ------------------------------------------------- the picker, as a DOM */

export const PICKER_CSS = `
.cp-wrap { position: relative; }
.cp-swatch {
  width: 100%; height: 26px; border-radius: 6px; cursor: pointer;
  border: 1px solid var(--line); padding: 0;
  /* The chequerboard shows through anything translucent, which is the only
     way a swatch can say "this is glass" rather than "this is pale blue". */
  background-image:
    linear-gradient(45deg, rgba(128,128,128,.28) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(128,128,128,.28) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(128,128,128,.28) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(128,128,128,.28) 75%);
  background-size: 10px 10px;
  background-position: 0 0, 0 5px, 5px -5px, -5px 0;
}
.cp-swatch i { display: block; width: 100%; height: 100%; border-radius: 5px; }
.cp-pop {
  position: fixed; z-index: 70; width: 232px; padding: 10px;
  border-radius: 9px; background: var(--panel-solid); border: 1px solid var(--line);
  box-shadow: var(--shadow);
}
.cp-pop[hidden] { display: none; }
.cp-field { display: flex; gap: 8px; }
.cp-sv {
  position: relative; width: 174px; height: 132px; border-radius: 5px;
  cursor: crosshair; touch-action: none;
}
.cp-hue {
  position: relative; width: 16px; height: 132px; border-radius: 5px;
  cursor: ns-resize; touch-action: none;
  background: linear-gradient(to bottom, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%,
                              #00f 67%, #f0f 83%, #f00 100%);
}
.cp-dot {
  position: absolute; width: 11px; height: 11px; margin: -6px 0 0 -6px;
  border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.5);
  pointer-events: none;
}
.cp-bar {
  position: absolute; left: -2px; right: -2px; height: 3px; margin-top: -2px;
  border: 1px solid #fff; border-radius: 2px; box-shadow: 0 0 0 1px rgba(0,0,0,.5);
  pointer-events: none;
}
.cp-nums { display: flex; gap: 5px; margin-top: 9px; align-items: center; }
.cp-nums input {
  min-width: 0; flex: 1; font-family: var(--mono); font-size: 11px;
  padding: 3px 5px; border-radius: 5px; border: 1px solid var(--line);
  background: var(--panel-2); color: var(--ink);
}
.cp-nums input.cp-hex { flex: 1.6; text-transform: lowercase; }
.cp-nums input:focus { outline: none; border-color: var(--accent); }
.cp-recent { display: flex; gap: 3px; margin-top: 8px; flex-wrap: wrap; }
.cp-recent button {
  width: 18px; height: 18px; border-radius: 4px; padding: 0; cursor: pointer;
  border: 1px solid var(--line);
}
.cp-note { margin-top: 7px; font-size: 10px; color: var(--ink-3); line-height: 1.45; }
`;

//! The colours this session has chosen, newest first. Kept in memory rather
//! than in localStorage: a recent colour is about the thing you are working
//! on now, and a fortnight-old swatch at the top of the list is noise.
const recent = [];
const keepColour = hex => {
  const at = recent.indexOf(hex);
  if (at >= 0) recent.splice(at, 1);
  recent.unshift(hex);
  recent.length = Math.min(recent.length, 10);
};

let open = null;        // the one popup, because two would both be "the" colour

//! Closes whatever is open. Exported because the page closes popups on Escape
//! and on a click elsewhere, and this has to go with them.
export function closePicker() {
  if (!open) return;
  open.pop.remove();
  window.removeEventListener("pointerdown", open.away, true);
  window.removeEventListener("keydown", open.key, true);
  open = null;
}

//! A swatch that opens a picker when it is clicked.
//!
//!   value()   the colour now, as a LINEAR triple
//!   onPick    called while dragging, with a linear triple - live, so the
//!             model updates under the cursor
//!   onDone    called when the drag ends or a number is typed; this is the
//!             one that should write to the document. Dragging a hue strip
//!             fires onPick sixty times a second and every one of those as an
//!             undo step would make the undo stack useless.
//! WHICH SPACE THE CALLER'S NUMBERS ARE IN.
//!
//! Not every colour in this program means the same thing. A Material node's
//! red/green/blue go to the renderer as LINEAR - render.js says so, with
//! LinearSRGBColorSpace, right there in the call. An object's `appearance`
//! has been a straight 0..255/255 mapping since before any of this, and the
//! viewport draws it that way; changing what those numbers mean would repaint
//! every document ever saved.
//!
//! So the picker is told which it is handling, and the only thing that changes
//! is whether hex goes through the transfer function. Nothing else differs:
//! the square, the strip and the drag are in sRGB either way, because that is
//! where a brightness axis is worth dragging through - see the test.
const SPACES = {
  linear: { in: toSrgb, out: toLinear },
  //! Already sRGB, or near enough that nobody has ever had to think about it.
  srgb: { in: v => v, out: v => v },
};
const spaceOf = key => SPACES[key] || SPACES.linear;

export function colourSwatch({ value, onPick, onDone, title = "Colour",
                               space = "linear" }) {
  const wrap = document.createElement("div");
  wrap.className = "cp-wrap";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "cp-swatch";
  button.title = title;
  const fill = document.createElement("i");
  button.appendChild(fill);
  wrap.appendChild(button);

  const how = spaceOf(space);
  const paint = () => {
    fill.style.background = "#" + value().slice(0, 3)
      .map(v => byte(how.in(held(v))).toString(16).padStart(2, "0")).join("");
  };
  paint();

  button.addEventListener("click", event => {
    event.stopPropagation();
    if (open && open.owner === button) return closePicker();
    closePicker();
    openPicker(button, { value, how,
                         onPick: c => { onPick(c); paint(); },
                         onDone: c => { onDone(c); paint(); } });
  });

  //! So a caller can repaint it when the document changes underneath.
  wrap.refresh = paint;
  return wrap;
}

function openPicker(owner, { value, onPick, onDone, how = SPACES.linear }) {
  const pop = document.createElement("div");
  pop.className = "cp-pop";

  const field = document.createElement("div");
  field.className = "cp-field";
  const sv = document.createElement("div");
  sv.className = "cp-sv";
  const dot = document.createElement("div");
  dot.className = "cp-dot";
  sv.appendChild(dot);
  const hue = document.createElement("div");
  hue.className = "cp-hue";
  const bar = document.createElement("div");
  bar.className = "cp-bar";
  hue.appendChild(bar);
  field.appendChild(sv);
  field.appendChild(hue);
  pop.appendChild(field);

  const nums = document.createElement("div");
  nums.className = "cp-nums";
  const hex = document.createElement("input");
  hex.className = "cp-hex";
  hex.spellcheck = false;
  hex.setAttribute("aria-label", "Hex");
  const fields = { r: null, g: null, b: null };
  nums.appendChild(hex);
  for (const key of ["r", "g", "b"]) {
    const box = document.createElement("input");
    box.setAttribute("aria-label", key.toUpperCase());
    box.spellcheck = false;
    fields[key] = box;
    nums.appendChild(box);
  }
  pop.appendChild(nums);

  const strip = document.createElement("div");
  strip.className = "cp-recent";
  pop.appendChild(strip);

  const note = document.createElement("div");
  note.className = "cp-note";
  note.textContent = "Hex is sRGB, the way a hex code is always read. "
                   + "What the model stores is linear.";
  pop.appendChild(note);

  //! The picker's own state is HSV in sRGB. Everything that leaves it is
  //! converted once, on the way out - see the header.
  let hsv = rgbToHsv(value().map(v => held(how.in(v))));

  //! Back into whatever the caller's numbers mean. Named `asValue` rather
  //! than `asLinear` because it is only linear when the caller said so.
  const asValue = () => hsvToRgb(hsv).map(how.out);

  const show = () => {
    const srgb = hsvToRgb(hsv);
    const flat = "#" + srgb.map(v => byte(v).toString(16).padStart(2, "0")).join("");
    //! The square is "this hue, white across, black down", which is what
    //! Blender, Photoshop and every other picker draws - two gradients over a
    //! flat hue, in that order.
    const pure = "#" + hsvToRgb([hsv[0], 1, 1])
      .map(v => byte(v).toString(16).padStart(2, "0")).join("");
    sv.style.background =
      "linear-gradient(to top, #000, rgba(0,0,0,0)), "
      + "linear-gradient(to right, #fff, rgba(255,255,255,0)), " + pure;
    dot.style.left = (hsv[1] * 100) + "%";
    dot.style.top = ((1 - hsv[2]) * 100) + "%";
    bar.style.top = (hsv[0] * 100) + "%";
    if (document.activeElement !== hex) hex.value = flat;
    for (const [i, key] of ["r", "g", "b"].entries())
      if (document.activeElement !== fields[key])
        fields[key].value = String(byte(srgb[i]));
  };

  const drawRecent = () => {
    strip.textContent = "";
    for (const one of recent) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.style.background = one;
      chip.title = one;
      chip.addEventListener("click", () => {
        hsv = rgbToHsv(hexToLinear(one).map(toSrgb));   // a chip is always sRGB hex
        show();
        onDone(asValue());
      });
      strip.appendChild(chip);
    }
  };
  drawRecent();
  show();

  //! Dragging. Pointer capture so the drag survives leaving the square -
  //! which it will, because the useful colours are at the edges.
  const drag = (element, move) => {
    let going = false;
    const at = event => {
      const box = element.getBoundingClientRect();
      move(held((event.clientX - box.left) / box.width),
           held((event.clientY - box.top) / box.height));
      show();
      onPick(asValue());
    };
    element.addEventListener("pointerdown", event => {
      going = true;
      element.setPointerCapture(event.pointerId);
      at(event);
      event.preventDefault();
      event.stopPropagation();
    });
    element.addEventListener("pointermove", event => { if (going) at(event); });
    const stop = () => {
      if (!going) return;
      going = false;
      const picked = asValue();
      keepColour("#" + hsvToRgb(hsv).map(v => byte(v).toString(16).padStart(2, "0")).join(""));
      drawRecent();
      onDone(picked);
    };
    element.addEventListener("pointerup", stop);
    element.addEventListener("pointercancel", stop);
  };
  drag(sv, (x, y) => { hsv = [hsv[0], x, 1 - y]; });
  drag(hue, (x, y) => { hsv = [y >= 1 ? 0.9999 : y, hsv[1], hsv[2]]; });

  //! Typed numbers commit on Enter or on leaving the field, never per
  //! keystroke: "#1" is a valid prefix of "#1a2b3c" and is also a colour, and
  //! repainting the model to it while somebody is halfway through typing is
  //! how a field fights the person using it.
  const commit = () => {
    const typed = hex.value.trim();
    if (/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(typed)) {
      hsv = rgbToHsv(hexToLinear(typed).map(toSrgb));   // typed hex is sRGB
    } else {
      const srgb = ["r", "g", "b"].map(key => held(Number(fields[key].value) / 255));
      if (srgb.every(Number.isFinite)) hsv = rgbToHsv(srgb);
    }
    show();
    const picked = asValue();
    keepColour("#" + hsvToRgb(hsv).map(v => byte(v).toString(16).padStart(2, "0")).join(""));
    drawRecent();
    onDone(picked);
  };
  for (const box of [hex, fields.r, fields.g, fields.b]) {
    box.addEventListener("change", commit);
    box.addEventListener("keydown", event => {
      event.stopPropagation();          // the page has single-letter shortcuts
      if (event.key === "Enter") { event.preventDefault(); commit(); box.blur(); }
      if (event.key === "Escape") closePicker();
    });
  }

  document.body.appendChild(pop);
  //! Placed under the swatch, and nudged back on screen rather than allowed
  //! off the bottom - which is where it would go for a material near the foot
  //! of a long definition panel.
  const box = owner.getBoundingClientRect();
  const size = pop.getBoundingClientRect();
  pop.style.left = Math.max(8, Math.min(innerWidth - size.width - 8, box.left)) + "px";
  pop.style.top = (box.bottom + size.height + 8 < innerHeight
    ? box.bottom + 6 : Math.max(8, box.top - size.height - 6)) + "px";

  const away = event => { if (!pop.contains(event.target) && event.target !== owner) closePicker(); };
  const key = event => { if (event.key === "Escape") { closePicker(); event.stopPropagation(); } };
  window.addEventListener("pointerdown", away, true);
  window.addEventListener("keydown", key, true);
  open = { owner, pop, away, key };
}
