// A material somebody dropped on the window.
//
// Every PBR library ships the same thing in a different envelope: a handful of
// images, one per channel, named by a convention nobody agreed on. ambientCG
// writes `Concrete034_1K-JPG_Roughness.jpg`, Poly Haven writes
// `concrete_floor_02_rough_1k.jpg`, Quixel writes `..._Roughness.jpg`, a
// Substance export writes `basecolor` and `metallic`, and somebody's folder
// off a hard drive writes `rough.png`. They are all the same material.
//
// So this reads the ENVELOPE - a zip, or a pile of files, or one image - and
// works out what each file is FOR by its name, and nothing above it has to
// know which library it came from.
//
// It is pure. No DOM, no decoding of the images themselves: what comes back is
// which bytes play which part, and the page turns those into textures. Which
// means the hard parts - the zip's own format, and the naming - are checked
// against bytes worked out on paper rather than by dropping something and
// looking at it.

/* --------------------------------------------------------- what a map is */

//! THE CHANNELS A MATERIAL HAS, and how to recognise each one in a filename.
//!
//! Order matters: the first role whose pattern matches wins, so the specific
//! ones come before the general. `AmbientOcclusion` has to be tried before
//! `occlusion`, and both before anything matching `o`; `basecolor` before
//! `color`, because "basecolorroughness" is a real filename somebody ships.
export const MAP_ROLES = [
  { role: "normal", space: "linear",
    //! GL FIRST, ALWAYS. A normal map's green channel points up in OpenGL and
    //! down in DirectX, and the two are the same picture: a DX map used as a
    //! GL one lights every bump from the wrong side, which looks like the
    //! light being in the wrong place rather than like a broken texture.
    match: /(?:^|[_\-. ])(?:normalgl|nor_gl|normal_gl|normalopengl)(?:[_\-. ]|$)/i,
    says: "bumps, OpenGL convention" },
  { role: "normalDX", space: "linear",
    match: /(?:^|[_\-. ])(?:normaldx|nor_dx|normal_dx|normaldirectx)(?:[_\-. ]|$)/i,
    says: "bumps, DirectX convention - green is upside down" },
  { role: "orm", space: "linear",
    //! Occlusion, roughness and metalness packed into one image's three
    //! channels. glTF's own convention and increasingly everybody's.
    match: /(?:^|[_\-. ])(?:orm|arm|occlusionroughnessmetallic|rma)(?:[_\-. ]|$)/i,
    says: "occlusion, roughness and metal packed into one image" },
  { role: "colour", space: "srgb",
    match: /(?:^|[_\-. ])(?:basecolor|base_color|albedo|diffuse|diff|col|color|colour)(?:[_\-. ]|$)/i,
    says: "what colour it is" },
  { role: "roughness", space: "linear",
    match: /(?:^|[_\-. ])(?:roughness|rough|rgh)(?:[_\-. ]|$)/i,
    says: "how scattered its reflection is" },
  { role: "metalness", space: "linear",
    match: /(?:^|[_\-. ])(?:metalness|metallic|metal|mtl)(?:[_\-. ]|$)/i,
    says: "whether it is metal" },
  { role: "occlusion", space: "linear",
    match: /(?:^|[_\-. ])(?:ambientocclusion|occlusion|ao)(?:[_\-. ]|$)/i,
    says: "where light does not reach into its own crevices" },
  { role: "height", space: "linear",
    match: /(?:^|[_\-. ])(?:displacement|height|disp|bump)(?:[_\-. ]|$)/i,
    says: "how far in or out, for displacement" },
  { role: "opacity", space: "linear",
    match: /(?:^|[_\-. ])(?:opacity|alpha|mask)(?:[_\-. ]|$)/i,
    says: "where it is not there at all" },
  { role: "emission", space: "srgb",
    match: /(?:^|[_\-. ])(?:emission|emissive|emit)(?:[_\-. ]|$)/i,
    says: "where it glows by itself" },
  { role: "normal", space: "linear",
    //! Last, and deliberately: a plain `normal` is only a normal map if
    //! neither GL nor DX was said, and those are checked at the top.
    match: /(?:^|[_\-. ])(?:normal|nor|nrm)(?:[_\-. ]|$)/i,
    says: "bumps" },
];

export const IMAGE_TYPES = /\.(?:jpe?g|png|webp|avif|bmp|tga|exr|hdr)$/i;
//! What a library ships beside the images and nobody here can use: a Blender
//! file, a USD stage, a Godot resource, a MaterialX graph. Named rather than
//! "anything that is not an image" so a dropped set can SAY what it ignored,
//! which is how somebody finds out their textures were in a folder nobody read.
export const BESIDE = /\.(?:blend|usdc?a?|mtlx|tres|sbsar|spp|mat|json|txt|md|xml)$/i;

//! The role a file plays, by its name alone. Null when nothing matches - a
//! preview thumbnail, a logo, a readme that happens to be a png.
export function roleOf(filename) {
  const name = String(filename || "").split("/").pop();
  if (!IMAGE_TYPES.test(name)) return null;
  //! The extension off first, so `..._Color.jpg` does not have to match the
  //! dot, and the resolution tag out, so `_1K-JPG_` does not look like a role.
  const stem = name.replace(IMAGE_TYPES, "").replace(/[_\-. ](?:\d+k|\d{3,5}px?)(?=[_\-. ]|$)/gi, "");
  for (const one of MAP_ROLES) if (one.match.test(stem)) return one.role;
  return null;
}

export const roleInfo = role => MAP_ROLES.find(one => one.role === role) || null;

/* ------------------------------------------------------------------- zip */

const u16 = (b, at) => b[at] | (b[at + 1] << 8);
const u32 = (b, at) => (b[at] | (b[at + 1] << 8) | (b[at + 2] << 16) | (b[at + 3] << 24)) >>> 0;

//! WHAT IS IN A ZIP, from its central directory - which is at the END of the
//! file and is the only authoritative list of what it holds. Walking the local
//! headers from the front instead is the mistake every hand-written zip reader
//! makes: a local header may say the size is zero and put it in a descriptor
//! AFTER the data, which is what a zip written by streaming looks like, and
//! there is no way to find the end of such an entry by reading forwards.
//!
//! Returns the entries with their raw bytes still compressed; `unpack` below
//! is the step that needs a decompressor and is therefore the step that is
//! async.
export function readZip(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  //! The end-of-central-directory record, found by looking backwards for its
  //! signature. It is 22 bytes plus a comment of up to 65535, so the search
  //! never has to go further back than that.
  let end = -1;
  for (let i = b.length - 22; i >= Math.max(0, b.length - 22 - 65535); i--)
    if (u32(b, i) === 0x06054b50) { end = i; break; }
  if (end < 0) throw new Error("that is not a zip file");

  const count = u16(b, end + 10);
  let at = u32(b, end + 16);
  const out = [];
  for (let i = 0; i < count && at + 46 <= b.length; i++) {
    if (u32(b, at) !== 0x02014b50) break;
    const method = u16(b, at + 10);
    const compressed = u32(b, at + 20);
    const size = u32(b, at + 24);
    const nameLen = u16(b, at + 28);
    const extraLen = u16(b, at + 30);
    const commentLen = u16(b, at + 32);
    const localAt = u32(b, at + 42);
    const name = new TextDecoder().decode(b.subarray(at + 46, at + 46 + nameLen));
    at += 46 + nameLen + extraLen + commentLen;
    if (name.endsWith("/")) continue;                 // a folder, not a file
    //! The local header's own name and extra lengths, because they are NOT
    //! the same as the central directory's - the extra field in particular is
    //! routinely different, and using the central one puts the read a few
    //! bytes into the data.
    if (u32(b, localAt) !== 0x04034b50) continue;
    const from = localAt + 30 + u16(b, localAt + 26) + u16(b, localAt + 28);
    out.push({ name, method, size, bytes: b.subarray(from, from + compressed) });
  }
  return out;
}

//! One entry's bytes, decompressed if they need it. Stored and deflate are the
//! two methods anything in the wild uses; anything else is refused by number
//! rather than silently handed over as rubbish.
export async function unpack(entry) {
  if (entry.method === 0) return entry.bytes;
  if (entry.method !== 8)
    throw new Error(entry.name + " uses zip method " + entry.method
                    + ", which this reads nothing of - re-save it as stored or deflate");
  if (typeof DecompressionStream !== "function")
    throw new Error("this browser cannot unpack a compressed zip (no DecompressionStream)");
  const stream = new Blob([entry.bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/* ------------------------------------------------- a material out of files */

//! A NAME FOR THE SET, from what the files have in common. `Concrete034_1K-JPG`
//! out of five files called `Concrete034_1K-JPG_Colour.jpg` and friends - the
//! longest shared beginning, tidied. Falls back to the folder, then to the
//! first file, then to "Material", so there is always something to call it.
export function nameFor(files, fallback = "Material") {
  const stems = files.map(one => String(one.name).split("/").pop().replace(IMAGE_TYPES, ""));
  if (!stems.length) return fallback;
  let shared = stems[0];
  for (const stem of stems.slice(1)) {
    let i = 0;
    while (i < shared.length && i < stem.length && shared[i] === stem[i]) i++;
    shared = shared.slice(0, i);
  }
  const folder = String(files[0].name).includes("/")
    ? String(files[0].name).split("/").slice(-2)[0] : "";
  const tidy = text => text
    .replace(/[_\-. ]*(?:\d+k|\d{3,5}px?)[_\-. ]*(?:jpe?g|png|webp)?[_\-. ]*$/i, "")
    .replace(/[_\-. ]+$/, "")
    .replace(/[_\-]+/g, " ")
    .trim();
  return tidy(shared) || tidy(folder) || tidy(stems[0]) || fallback;
}

//! THE MATERIAL A PILE OF FILES ADDS UP TO.
//!
//! Says what it found, what it could not use and what it ignored - all three,
//! because a set that silently dropped its roughness map is a material that
//! comes out shiny for a reason nobody can see. A duplicate role keeps the
//! first and says so: a folder with both a JPG and a PNG colour map is common
//! and neither is wrong, but using both is.
export function materialFromFiles(files, fallback = "Material") {
  const maps = {}, duplicates = [], ignored = [], beside = [];
  for (const file of files) {
    const name = String(file.name).split("/").pop();
    if (/^__MACOSX|^\./.test(name)) continue;          // a Mac archive's shadow
    const role = roleOf(name);
    if (!role) {
      (BESIDE.test(name) ? beside : ignored).push(name);
      continue;
    }
    if (maps[role]) { duplicates.push(name); continue; }
    maps[role] = file;
  }
  //! A DX NORMAL WHEN THERE IS NO GL ONE is still a normal map and still
  //! better than none - it is used, and the fact that its green is upside
  //! down is carried so the page can flip it rather than guess later.
  let flipGreen = false;
  if (!maps.normal && maps.normalDX) { maps.normal = maps.normalDX; flipGreen = true; }
  delete maps.normalDX;

  const used = Object.keys(maps);
  return {
    name: nameFor(files.filter(one => roleOf(one.name)), fallback),
    maps, flipGreen, duplicates, ignored, beside,
    //! A set with no colour and no roughness is not a material, it is a folder
    //! of pictures - and saying so is better than installing a grey nothing.
    usable: used.some(role => ["colour", "roughness", "metalness", "orm"].includes(role)),
    said: used.length
      ? used.map(role => role + (role === "normal" && flipGreen ? " (DirectX, flipped)" : ""))
            .join(", ")
      : "no maps anything here recognises",
  };
}
