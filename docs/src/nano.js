// Nano Banana: the arithmetic, the request and the reply.
//
// Nothing here touches the DOM, the network or the model. What is here is the
// shape of a call to Google's image model and the shape of what comes back,
// so that the one part of this feature that cannot be driven in a test - an
// HTTP request to somebody else's service, needing somebody's key - is
// reduced to two pure functions that CAN be.
//
// WHAT IS NOT CHECKED HERE, said plainly: no test in this repository has ever
// reached the Gemini API. There is no key in this container and asking for one
// would be asking for a credential. So the request below is built from
// Google's published documentation for the image models and the reply is read
// TOLERANTLY - every documented place the bytes have lived is looked in, and
// when none of them has anything the reply's own error text is handed back
// rather than a guess. If Google moves the field, this says so in words
// instead of failing silently, and the model name is a setting rather than a
// constant so it can be followed without a release.

/* ------------------------------------------------------------- the prompts

   Suggestions, not a menu of everything possible: a short list of the things
   people actually ask an image model to do to a view out of a CAD program,
   written so that each one reads as an instruction about THIS picture rather
   than a description of a different one. The last clause of each is the one
   that matters - it is what stops the model redrawing the building.          */

export const PROMPT_IDEAS = [
  { label: "Photographic, as built",
    text: "Render this exact geometry as a photograph of the finished building. "
        + "Keep every edge, opening and proportion where it is. Natural daylight, "
        + "real materials, no new elements." },
  { label: "Overcast daylight",
    text: "Light this view as an overcast afternoon: soft shadows, cool even sky, "
        + "damp ground. Do not move the camera or change the geometry." },
  { label: "Late afternoon sun",
    text: "Light this view as low late-afternoon sun from the left, long soft "
        + "shadows, warm highlights on the upper surfaces. Geometry unchanged." },
  { label: "Dusk, interior lights on",
    text: "Dusk. The sky has gone deep blue, the interior lights are on and spill "
        + "out through the glazing. Keep the geometry and camera exactly as given." },
  { label: "Add people and planting",
    text: "Add plausible people at a believable scale and some planting, on the "
        + "ground plane only. Change nothing about the building itself." },
  { label: "Site context",
    text: "Place this building in a plausible surrounding street: neighbouring "
        + "facades, pavement, parked cars, a few trees. The building in the "
        + "middle stays exactly as drawn." },
  { label: "Concrete and glass",
    text: "Finish the surfaces as board-marked in-situ concrete with clear "
        + "glazing in slim dark frames. Keep all geometry and the camera." },
  { label: "Timber and brick",
    text: "Finish the surfaces as warm vertical timber cladding over a dark brick "
        + "base. Keep all geometry and the camera." },
  { label: "Watercolour",
    text: "Redraw this as a loose architectural watercolour: wet edges, white "
        + "paper showing through, pencil underdrawing. Keep the composition." },
  { label: "Measured ink drawing",
    text: "Redraw this as a fine-line ink elevation drawing on white, with hatched "
        + "shadows and no colour. Keep every line where it is." },
  { label: "Clean white model",
    text: "Present this as a white card architectural model on a white "
        + "background, soft studio light, visible card thickness at the edges." },
  { label: "Night, lit from within",
    text: "Night. The building is lit only from inside and by a few ground-level "
        + "spots. Deep shadows, no moonlight. Geometry unchanged." },
];

/* --------------------------------------------------------- the model to ask

   The published image models, newest first. A LIST rather than a constant,
   because this is the one thing in the feature most likely to be out of date
   before anybody reads this file: the name moves faster than a release does,
   so it is a setting with a default, and an unknown name typed into the gear
   is passed through untouched rather than rejected.                         */

export const NANO_MODELS = [
  "gemini-3.1-flash-image",
  "gemini-3-pro-image",
  "gemini-3.1-flash-lite-image",
  "gemini-2.5-flash-image",
];

export const NANO_DEFAULT_MODEL = NANO_MODELS[0];
export const NANO_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";

//! The aspect ratios the service takes, with the one that means "whatever the
//! picture already is" first - which is what a view out of a viewport wants
//! almost every time, because the point is to compare it with the viewport.
export const NANO_RATIOS = ["match the viewport", "1:1", "3:2", "2:3", "4:3", "3:4",
                            "16:9", "9:16", "5:4", "4:5", "21:9"];
export const NANO_SIZES = ["1K", "2K", "512px", "4K"];

//! The ratio of a picture, as one of the service's own names, so that "match
//! the viewport" is an answer rather than an absence. Nearest wins; a shape
//! that is not close to any of them falls back to not asking at all, because
//! a wrong ratio crops the building.
export function ratioFor(width, height) {
  if (!(width > 0) || !(height > 0)) return null;
  const want = width / height;
  const named = NANO_RATIOS.filter(name => /^\d+:\d+$/.test(name));
  let best = null;
  for (const name of named) {
    const [w, h] = name.split(":").map(Number);
    const gap = Math.abs(Math.log(w / h) - Math.log(want));
    if (!best || gap < best.gap) best = { name, gap };
  }
  //! A twelfth in log terms is about the difference between 3:2 and 16:9 -
  //! close enough to be the same intent, and further than that is a shape
  //! nobody listed, where saying nothing is better than saying the wrong one.
  return best && best.gap < 0.08 ? best.name : null;
}

/* ------------------------------------------------------- the references

   MULTI-REFERENCE IN-CONTEXT LEARNING, which is a long name for: send the
   view AND a handful of pictures of what it should be like, and say which is
   which.

   The service takes several images in one call - up to fourteen, and the
   published per-model breakdown is narrower than that total:

     gemini-3.1-flash-lite-image   up to 14 object images
     gemini-3.1-flash-image        up to 10 object, 4 character, 3 style
     gemini-3-pro-image            up to 6 object, 5 character

   What it does NOT publish is any way to LABEL one. There is no role field,
   no name, no caption - the images arrive as an ordered list and that is all
   the model is told. So the labels below are not an API feature and must not
   be described as one: they are a sentence this page writes into the prompt,
   naming each picture in the order they are sent, because a model given six
   unlabelled photographs has to guess which one was the mood board and which
   one was the building.
   
   Whether that sentence helps is not something any test here can establish,
   because nothing here reaches the service. It is a reasonable way to use an
   ordered list and it is visible in the request, which is the most that can
   honestly be claimed for it.                                              */

export const MAX_REFERENCES = 14;

//! WHAT A REFERENCE IS FOR. The key is stored; the sentence is what the model
//! is actually told. Written as instructions about THIS view rather than
//! descriptions of the reference, for the same reason every suggested prompt
//! ends by forbidding the geometry from moving.
export const REFERENCE_ROLES = [
  { key: "style", label: "Style",
    says: "the overall look, mood and treatment to follow" },
  { key: "material", label: "Material",
    says: "a surface finish to apply to the building" },
  { key: "context", label: "Context",
    says: "the kind of surroundings to place it in" },
  { key: "lighting", label: "Lighting",
    says: "the light, time of day and weather to match" },
  { key: "palette", label: "Palette",
    says: "the colours to work within" },
  { key: "object", label: "Object",
    says: "an object to include in the scene" },
  { key: "person", label: "Person",
    says: "a person to include, at a believable scale" },
  { key: "detail", label: "Detail",
    says: "a detail or component to reproduce faithfully" },
];

export const roleInfoFor = key =>
  REFERENCE_ROLES.find(one => one.key === key) || REFERENCE_ROLES[0];

//! HOW BIG A REFERENCE IS SENT. A mood board photograph off a phone is four
//! thousand pixels wide and three megabytes; six of those is eighteen
//! megabytes of base64 in one POST, for a model that is going to look at them
//! at a fraction of that. 1024 on the long edge is enough to read a style off
//! and keeps the whole call to a size that will actually leave the browser.
export const REFERENCE_MAX_EDGE = 1024;

//! THE SENTENCE THAT SAYS WHICH PICTURE IS WHICH. Numbered from the order the
//! images are sent in, with the view named last because that is where it is
//! put - see nanoRequest, which builds both from the same list so the words
//! and the order cannot drift apart.
export function referenceBrief(references) {
  const used = (references || []).filter(one => one && one.data);
  if (!used.length) return "";
  const lines = used.map((one, at) => {
    const role = roleInfoFor(one.role);
    return "Image " + (at + 1) + " is a " + role.label.toLowerCase()
      + " reference: " + role.says
      + (one.note ? " \u2014 " + String(one.note).trim() : "") + ".";
  });
  //! AND WHICH ONE IS THE BUILDING. Without this the view is just the last of
  //! seven pictures and the model has no reason to treat it as the subject.
  lines.push("Image " + (used.length + 1)
    + " is the view to work on: keep its geometry, camera and composition, "
    + "and apply the references above to it.");
  return lines.join(" ");
}

/* ---------------------------------------------------------- the object mask

   A SECOND IMAGE THAT SAYS WHICH PIXEL IS WHICH OBJECT.

   A prompt can say "make the cladding timber" and the model has to work out
   from the picture which part of it is cladding. Often it does; when a facade
   has four materials on it, it guesses. So the view goes with a second image
   in which every visible object is one flat unique colour, and the prompt
   names each colour and says what that object should be.

   The colours are generated here and the LEGEND IS CORRECTED FROM THE RENDER
   rather than trusted: see maskColour. Three things can move a colour between
   asking for it and its arriving in a PNG - the renderer's output encoding,
   tone mapping, and antialiasing along every silhouette - so what goes in the
   prompt is the colour that is actually in the image, found by reading the
   pixels back. An object with no pixels left after that is occluded, and
   naming a colour the mask does not contain is worse than saying nothing.   */

//! WELL SEPARATED BY CONSTRUCTION, AND NEVER BLACK.
//!
//! The first version stepped the hue by the golden angle, which spreads hues
//! evenly but says nothing about RGB distance - and a test over forty indices
//! found #9500FF and #8100FF twenty apart in summed channel distance. That is
//! still clear of the six the page matches within, but it gets thinner with
//! every object and the failure it leads to is two objects read as one region.
//!
//! So the colours come off a COARSE GRID instead, ordered farthest-point
//! first: every channel is one of a few widely spaced values, which puts a
//! floor under how close any two can be, and the ordering means that the
//! first n of them are about as spread as n colours off that grid can be.
//! Black is dropped because black is the mask's background, and an object
//! coloured like the background is one the prompt names and the model cannot
//! find.
//! ONE SEQUENCE, REFINED IN TIERS, with nothing repeated.
//!
//! The first attempt kept a palette per grid and stepped from one to the next
//! when it ran out. The grids overlap - 0 and 255 are in all of them - so the
//! step produced a DUPLICATE: index 60 came back #0000FF, which index 2 had
//! already had. Two objects with one colour is two objects read as one region,
//! which is the exact failure the whole palette exists to avoid, and a probe
//! over sixty-one indices found it as "closest pair 0 apart".
//!
//! So it is built once as a single list: the coarse grid in farthest-point
//! order, then whatever the finer grid adds that is not already in it, and so
//! on. Any prefix is well spread, nothing appears twice, and the tiers only
//! ever extend the sequence rather than replacing it.
let MASK_PALETTE = null;

function maskPalette() {
  if (MASK_PALETTE) return MASK_PALETTE;
  const gap = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
  const out = [];
  const had = new Set();
  const take = one => {
    const key = (one.r << 16) | (one.g << 8) | one.b;
    if (had.has(key)) return false;
    had.add(key);
    out.push(one);
    return true;
  };
  for (const steps of [4, 6, 11]) {
    const levels = Array.from({ length: steps },
      (_, i) => Math.round((i * 255) / (steps - 1)));
    const left = [];
    for (const r of levels) for (const g of levels) for (const b of levels) {
      //! Near-black goes with black: the mask's background is black, and a
      //! #003300 region against it is one nobody can separate.
      if (r + g + b < 120) continue;
      const key = (r << 16) | (g << 8) | b;
      if (had.has(key)) continue;
      left.push({ r, g, b });
    }
    //! FARTHEST POINT FIRST, measured against everything already in the
    //! sequence - including the earlier tiers - so a tier's additions are
    //! placed in the gaps the coarse grid left rather than beside each other.
    if (!out.length && left.length) {
      const red = left.findIndex(one => one.r === 255 && !one.g && !one.b);
      take(left.splice(red < 0 ? 0 : red, 1)[0]);
    }
    while (left.length) {
      let bestAt = 0, bestGap = -1;
      for (let i = 0; i < left.length; i++) {
        let near = Infinity;
        for (const one of out) near = Math.min(near, gap(left[i], one));
        if (near > bestGap) { bestGap = near; bestAt = i; }
      }
      take(left.splice(bestAt, 1)[0]);
    }
  }
  MASK_PALETTE = out.map(one => ({ ...one,
    hex: "#" + [one.r, one.g, one.b]
      .map(v => v.toString(16).padStart(2, "0")).join("").toUpperCase() }));
  return MASK_PALETTE;
}

//! How many objects can be told apart at all. Beyond this two share a colour,
//! and the page drops whichever it cannot separate rather than naming it
//! wrongly - see maskSnapshot, which reads the legend back out of the render.
export const maskColourCount = () => maskPalette().length;

export function maskColour(index) {
  const palette = maskPalette();
  const at = Math.max(0, Math.floor(index));
  return palette[at % palette.length];
}

//! THE SENTENCE THAT TURNS A MASK INTO INSTRUCTIONS. One line per object that
//! has something said about it, and a plain naming for the rest - the model
//! needs to know a colour is an object even when there is nothing particular
//! to do to it, or it may treat the region as something to change.
//!
//! \p legend [{ hex, name, hint }] in the order they were coloured.
export function maskBrief(legend, maskAt, viewAt) {
  const seen = (legend || []).filter(one => one && one.hex);
  if (!seen.length) return "";
  const said = ["Image " + maskAt + " is a colour-coded object map for image "
    + viewAt + ": each flat colour marks one object in the view."];
  const told = seen.filter(one => one.hint && String(one.hint).trim());
  for (const one of told)
    said.push("The " + one.hex + " region is " + (one.name || "an object")
      + " \u2014 " + String(one.hint).trim().replace(/\.*$/, "") + ".");
  const quiet = seen.filter(one => !(one.hint && String(one.hint).trim()));
  if (quiet.length)
    said.push("These regions are named but have no instruction of their own, so "
      + "leave them as they are: "
      + quiet.map(one => one.hex + " is " + (one.name || "an object")).join(", ") + ".");
  said.push("Do not draw the mask or its colours into the result, and keep the "
    + "camera, the lighting and every unmasked region as they are in image "
    + viewAt + ".");
  return said.join(" ");
}

/* --------------------------------------------------------------- the request */

//! A data URL split into what the service needs: the type and the base64.
//! Hands back null rather than throwing for anything that is not one, because
//! the caller's answer to that is a sentence on screen, not a stack trace.
export function dataUrlParts(url) {
  const match = /^data:([^;,]+)?(;base64)?,(.*)$/s.exec(String(url || ""));
  if (!match) return null;
  const mime = match[1] || "image/png";
  if (!match[2]) return null;              // percent-encoded; not what is sent
  return { mime, data: match[3] };
}

//! What to POST. Returned as data - url, headers, body - rather than sent,
//! which is what makes the shape of the call something a test can read.
export function nanoRequest({ prompt, image, mime = "image/png", key,
                              model = NANO_DEFAULT_MODEL, ratio = null,
                              size = null, references = [], mask = null,
                              legend = [] } = {}) {
  const said = String(prompt || "").trim();
  if (!said) throw new Error("there is no prompt to send");
  if (!image) throw new Error("there is no picture to send");
  if (!key) throw new Error("there is no API key - the gear on the prompt bar takes one");
  //! THE REFERENCES FIRST, THE VIEW LAST, and the words that say so built from
  //! the same list in the same order. Two places deciding the order
  //! independently is how a prompt comes to call the mood board "image 3"
  //! while image 3 is the building.
  const refs = (references || []).filter(one => one && one.data)
                                 .slice(0, MAX_REFERENCES);
  //! THE VIEW, THEN THE MASK, after the references. The mask is about the
  //! view, so it is the one image that has to be named relative to another -
  //! which is why both numbers are worked out here and handed to maskBrief
  //! rather than written into a sentence somewhere else. The brief and the
  //! list are built in one pass for the same reason they always were.
  const viewAt = refs.length + 1;
  const maskAt = viewAt + 1;
  const parts = [referenceBrief(refs)];
  if (mask && mask.data) parts.push(maskBrief(legend, maskAt, viewAt));
  const brief = parts.filter(Boolean).join(" ");
  const input = [{ type: "text", text: brief ? brief + "\n\n" + said : said }];
  for (const one of refs)
    input.push({ type: "image", mime_type: one.mime || "image/png", data: one.data });
  input.push({ type: "image", mime_type: mime, data: image });
  if (mask && mask.data)
    input.push({ type: "image", mime_type: mask.mime || "image/png", data: mask.data });
  const body = { model: model || NANO_DEFAULT_MODEL, input };
  //! ASKED FOR ONLY WHEN THERE IS SOMETHING TO ASK. An empty response_format
  //! is a field the service has to interpret, and the default - whatever the
  //! input picture is - is the right answer for a viewport grab.
  if (ratio || size) {
    body.response_format = { type: "image" };
    if (ratio) body.response_format.aspect_ratio = ratio;
    if (size) body.response_format.image_size = size;
  }
  return {
    url: NANO_ENDPOINT,
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body,
  };
}

/* ----------------------------------------------------------------- the reply

   Read tolerantly on purpose. Google has published the image bytes in two
   different shapes within a year - once under an Interaction's outputImage,
   once as an inlineData part of a candidate's content - and a page that knows
   only one of them breaks on a day nothing here changed. So every documented
   place is looked in, the first one with bytes wins, and if none of them has
   any then the reply's OWN words are what the person is told.               */

const FIELDS = ["data", "bytesBase64Encoded", "b64_json", "base64"];

function bytesIn(node, depth = 0) {
  if (!node || typeof node !== "object" || depth > 6) return null;
  if (Array.isArray(node)) {
    for (const one of node) {
      const found = bytesIn(one, depth + 1);
      if (found) return found;
    }
    return null;
  }
  //! A node that IS an image: one of the known byte fields, holding something
  //! long enough to be a picture. The length test is what stops a short
  //! "data" field somewhere unrelated being mistaken for one.
  for (const field of FIELDS) {
    const value = node[field];
    if (typeof value === "string" && value.length > 256)
      return { data: value, mime: node.mime_type || node.mimeType || "image/png" };
  }
  for (const value of Object.values(node)) {
    const found = bytesIn(value, depth + 1);
    if (found) return found;
  }
  return null;
}

//! The picture in a reply, or null. \return { data, mime } with data base64.
export function imageFromReply(reply) {
  if (!reply || typeof reply !== "object") return null;
  //! THE DOCUMENTED PLACES FIRST, in order, so that a reply which has bytes
  //! where they are supposed to be never depends on the search below.
  const named = [
    reply.interaction && reply.interaction.outputImage,
    reply.interaction && reply.interaction.output_image,
    reply.outputImage, reply.output_image,
  ];
  for (const where of named) {
    const found = where && bytesIn(where, 5);
    if (found) return found;
  }
  return bytesIn(reply);
}

//! Why there is no picture, in words a person can act on. The service's own
//! message is preferred over anything written here: it is the only thing that
//! knows whether the key is wrong, the quota is spent or the prompt was
//! refused, and paraphrasing it would lose exactly the part that matters.
export function troubleFromReply(reply, status = 0) {
  const said = reply && reply.error
    && (reply.error.message || reply.error.status || reply.error.code);
  if (said) return String(said);
  //! A REFUSAL IS NOT A FAILURE OF THIS PAGE. The models decline some prompts,
  //! and when they do the reply is well formed and has no image in it - so a
  //! finishReason or a blocked flag is worth saying by name.
  const stop = reply && (reply.finishReason
    || (reply.interaction && reply.interaction.finishReason)
    || (reply.candidates && reply.candidates[0] && reply.candidates[0].finishReason));
  if (stop && !/stop|ok/i.test(String(stop)))
    return "the model returned no image — " + stop;
  if (status === 400) return "the request was refused (400) — usually the model name or the key";
  if (status === 401 || status === 403)
    return "the key was not accepted (" + status + ")";
  if (status === 404)
    return "there is no model by that name (404) — the gear takes a different one";
  if (status === 429) return "too many requests (429) — wait and send it again";
  if (status >= 500) return "the service is having trouble (" + status + ")";
  if (status && status !== 200) return "the service answered " + status;
  return "the reply had no image in it";
}

/* ----------------------------------------------------------------- the zip

   Stored, not deflated. A PNG or a JPEG is already compressed and deflating
   one again saves a fraction of a per cent for a dependency and a megabyte of
   code; method 0 is twenty lines and is what every unzipper reads first.    */

const CRC = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

//! \p files [{ name, bytes }] \return one Uint8Array, a zip of them all.
export function storeZip(files) {
  const encoder = new TextEncoder();
  const parts = [];
  const directory = [];
  let at = 0;
  for (const file of files) {
    const name = encoder.encode(file.name);
    const bytes = file.bytes;
    const sum = crc32(bytes);
    const local = new Uint8Array(30 + name.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);            // the version needed: 2.0, stored
    view.setUint16(6, 0, true);             // no flags; no encryption, no streaming
    view.setUint16(8, 0, true);             // method 0 - stored
    view.setUint16(10, 0, true);            // no time: a zip with no clock in it
    view.setUint16(12, 0x21, true);         // a date, because 0 is not a legal one
    view.setUint32(14, sum, true);
    view.setUint32(18, bytes.length, true);
    view.setUint32(22, bytes.length, true);
    view.setUint16(26, name.length, true);
    view.setUint16(28, 0, true);
    local.set(name, 30);
    parts.push(local, bytes);
    directory.push({ name, sum, size: bytes.length, at });
    at += local.length + bytes.length;
  }
  const centre = at;
  for (const one of directory) {
    const head = new Uint8Array(46 + one.name.length);
    const view = new DataView(head.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, 0, true);
    view.setUint16(14, 0x21, true);
    view.setUint32(16, one.sum, true);
    view.setUint32(20, one.size, true);
    view.setUint32(24, one.size, true);
    view.setUint16(28, one.name.length, true);
    view.setUint32(42, one.at, true);
    head.set(one.name, 46);
    parts.push(head);
    at += head.length;
  }
  const end = new Uint8Array(22);
  const view = new DataView(end.buffer);
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(8, directory.length, true);
  view.setUint16(10, directory.length, true);
  view.setUint32(12, at - centre, true);
  view.setUint32(16, centre, true);
  parts.push(end);

  const total = parts.reduce((n, part) => n + part.length, 0);
  const out = new Uint8Array(total);
  let put = 0;
  for (const part of parts) { out.set(part, put); put += part.length; }
  return out;
}

/* ------------------------------------------------------------- the gallery */

//! A file name for one render: when it was made, and the first few words of
//! what was asked for, so a folder of them can be read without opening any.
export function galleryName(entry, index = 0) {
  const when = new Date(entry.when || Date.now());
  const two = n => String(n).padStart(2, "0");
  const stamp = when.getFullYear() + two(when.getMonth() + 1) + two(when.getDate())
    + "-" + two(when.getHours()) + two(when.getMinutes()) + two(when.getSeconds());
  const words = String(entry.prompt || "").toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ").trim().split(/\s+/).slice(0, 5).join("-");
  const kind = /jpe?g/.test(entry.mime || "") ? "jpg" : "png";
  return stamp + "-" + String(index + 1).padStart(2, "0")
    + (words ? "-" + words : "") + "." + kind;
}

//! Base64 to bytes, for saving and for the zip. The browser has atob; this is
//! the one place the result has to be a byte array rather than a string.
export function base64Bytes(base64, atobFn) {
  const decode = atobFn || (typeof atob === "function" ? atob : null);
  if (!decode) throw new Error("there is no base64 decoder here");
  const binary = decode(String(base64 || ""));
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}
