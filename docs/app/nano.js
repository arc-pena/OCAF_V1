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
                              size = null } = {}) {
  const said = String(prompt || "").trim();
  if (!said) throw new Error("there is no prompt to send");
  if (!image) throw new Error("there is no picture to send");
  if (!key) throw new Error("there is no API key - the gear on the prompt bar takes one");
  const input = [{ type: "text", text: said },
                 { type: "image", mime_type: mime, data: image }];
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
