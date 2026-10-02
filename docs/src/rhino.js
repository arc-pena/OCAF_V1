// Rhino, and the two ways in.
//
// A .3dm is a Rhino document, and Rhino's own library reads one in a browser.
// What that library is NOT is Rhino: it carries the file format and none of
// the kernel. Measured against rhino3dm 8.35.0, enumerated rather than
// remembered - there is no `Mesh.createFromBrep`, and `BrepFace.getMesh`
// returns a mesh only when the FILE already carried one:
//
//     const brep = rh.Brep.createFromBox(box);   // six faces, written to a 3dm
//     back.objects().get(0).geometry().faces().get(0).getMesh(MeshType.Render)
//     → null                                    // Render, Any and Preview alike
//
// Rhino itself saves render meshes with a file, so most .3dm files draw. A file
// saved with "Save Small", or written by a script, carries none - and for those
// objects this reader has a shape it cannot draw and will say so by name and
// count rather than quietly showing less than the file holds.
//
// Which is why there are two ways in, and the second is the better one:
//
//   .3dm   - drag the Rhino file straight in. Nothing to install, limited by
//            what Rhino cached in the file.
//   .rhj   - a bridge file written BY a script running inside Rhino, where the
//            whole kernel is. It meshes at a tolerance somebody chose, keeps
//            the layer tree, the blocks, the attributes and the user strings,
//            and can point at a STEP written beside it for exact surfaces.
//
// This module is the second one's format and arithmetic: no DOM, no OpenCascade,
// nothing that needs a browser. scripts/rhino_export.py writes it; the package
// reads it; the tests drive it without either.

import { writeObj } from "./exchange.js";

/* ====================================================================== format

   A bridge file says what it is and what wrote it, in the shape the rest of
   this program already uses for its own files - name the format, version it,
   declare the units, and never ask on open.                                  */

export const BRIDGE_FORMAT = "rhino-bridge";
export const BRIDGE_VERSION = 1;

//! Rhino's unit systems, by the name the script writes, in millimetres - the
//! document unit here. Rhino stores a unit on the FILE, so nothing has to be
//! guessed and nothing has to be asked.
export const RHINO_UNITS = {
  microns: 0.001, millimeters: 1, centimeters: 10, meters: 1000,
  kilometers: 1e6, microinches: 0.0000254, mils: 0.0254, inches: 25.4,
  feet: 304.8, miles: 1609344, angstroms: 1e-7, nanometers: 1e-6,
  decimeters: 100, dekameters: 10000, hectometers: 100000,
  megameters: 1e9, gigameters: 1e12, yards: 914.4,
  //! "none" is a real Rhino answer - a document with no unit set. Treated as
  //! millimetres AND reported, because silently scaling by 1 is the same
  //! arithmetic as knowing, and a reader cannot tell the two apart later.
  none: 1, unset: 1,
};

export function bridgeScale(units) {
  const key = String(units || "").trim().toLowerCase();
  const found = RHINO_UNITS[key];
  return typeof found === "number" ? found : null;
}

/* ======================================================================= read

   Parse and CHECK. A bridge file is written by a script on somebody else's
   machine and arrives here as whatever that script produced two versions ago,
   so every failure below names the field and what was expected - "could not
   read it" is the one answer that helps nobody.                              */

export function readBridge(text) {
  let raw;
  try { raw = typeof text === "string" ? JSON.parse(text) : text; }
  catch (err) { throw new Error("this is not JSON — " + err.message); }
  if (!raw || typeof raw !== "object")
    throw new Error("this is not a bridge file: the top of it is not an object");
  if (raw.format !== BRIDGE_FORMAT)
    throw new Error("this says it is \"" + (raw.format || "nothing in particular")
      + "\" and a bridge file says \"" + BRIDGE_FORMAT + "\"");
  //! FORWARD, NOT BACKWARD. A file from a NEWER script may hold fields this
  //! reader does not know, and ignoring them is right; a file from an older
  //! one is read as it always was. Only a major jump is refused, and by number.
  if (!(raw.version >= 1))
    throw new Error("version " + JSON.stringify(raw.version) + " is not a version this reads");
  if (raw.version > BRIDGE_VERSION)
    throw new Error("this file is version " + raw.version + " and this build reads "
      + BRIDGE_VERSION + " — update the page, or re-export with the matching script");

  const scale = bridgeScale(raw.units);
  if (scale === null)
    throw new Error("the units say \"" + raw.units + "\", which is not a Rhino unit system");

  const layers = asArray(raw.layers).map((l, i) => ({
    id: String(l.id != null ? l.id : "L" + i),
    name: String(l.name == null ? "" : l.name),
    parent: l.parent == null ? null : String(l.parent),
    colour: colourOf(l.colour),
    visible: l.visible !== false,
  }));
  const blocks = asArray(raw.blocks).map((b, i) => ({
    id: String(b.id != null ? b.id : "B" + i),
    name: String(b.name == null ? "" : b.name),
    objects: asArray(b.objects).map(String),
  }));
  const objects = asArray(raw.objects).map((o, i) => readObject(o, i));

  return {
    format: raw.format, version: raw.version,
    name: String(raw.name == null ? "" : raw.name),
    units: String(raw.units), scale,
    source: raw.source && typeof raw.source === "object" ? raw.source : {},
    exact: raw.exact && typeof raw.exact === "object" ? raw.exact : null,
    layers, blocks, objects,
  };
}

function readObject(o, i) {
  const id = String(o.id != null ? o.id : "O" + i);
  const mesh = o.mesh ? readMesh(o.mesh, id) : null;
  return {
    id,
    layer: o.layer == null ? null : String(o.layer),
    name: String(o.name == null ? "" : o.name),
    kind: String(o.kind || "unknown"),
    colour: colourOf(o.colour),
    user: o.user && typeof o.user === "object" ? o.user : null,
    block: o.block == null ? null : String(o.block),
    xform: readXform(o.xform),
    mesh,
    //! WHY THERE IS NO MESH, in the script's own words. An object that Rhino
    //! could not mesh and an object the script was told to skip are different
    //! facts, and the count at the end has to be able to tell them apart.
    missing: mesh ? null : String(o.missing || "no mesh in the file"),
  };
}

//! Vertices flat, faces flat in FOURS. Rhino's mesh faces are quads, and a
//! triangle is a quad whose last two corners are the same one - that is
//! Rhino's own convention, so storing it that way loses nothing and makes the
//! array a fixed stride that packs and parses quickly.
function readMesh(m, id) {
  const v = numbers(m.v), f = ints(m.f);
  if (!v.length) return null;
  if (v.length % 3)
    throw new Error("object " + id + " has " + v.length + " vertex numbers, which is not a multiple of 3");
  if (f.length % 4)
    throw new Error("object " + id + " has " + f.length + " face indices, which is not a multiple of 4");
  const corners = v.length / 3;
  for (let i = 0; i < f.length; i++)
    if (!(f[i] >= 0 && f[i] < corners))
      throw new Error("object " + id + " refers to corner " + f[i] + " of " + corners);
  return { v, f, corners, faces: f.length / 4 };
}

//! Rhino writes a transform row by row, 16 numbers. Anything else is no
//! transform at all rather than a half-read one.
function readXform(x) {
  const m = numbers(x);
  return m.length === 16 ? m : null;
}

const asArray = v => (Array.isArray(v) ? v : []);
const numbers = v => (Array.isArray(v) ? v.filter(n => Number.isFinite(n)) : []);
const ints = v => (Array.isArray(v) ? v.map(n => Math.trunc(n)).filter(Number.isFinite) : []);

//! 0..255 from Rhino, 0..1 here. Null stays null: "this object has no colour
//! of its own, use the layer's" is a fact worth keeping, and [0,0,0] is black.
function colourOf(c) {
  if (!Array.isArray(c) || c.length < 3) return null;
  const out = c.slice(0, 3).map(n => (Number.isFinite(n) ? Math.min(1, Math.max(0, n / 255)) : 0));
  return out;
}

/* ================================================================ transforms

   A block instance in Rhino carries a 4x4. Most of them are a turn and a
   move - which the Instance node can say exactly - and the rest have a scale
   or a shear in them, which it cannot. Telling the two apart is arithmetic,
   so it is done here and the reader never guesses.                          */

export function decomposeXform(m) {
  if (!m || m.length !== 16) return null;
  //! Rhino's transform is ROW MAJOR and the translation is the last column,
  //! so the axes are the columns of the top-left 3x3 and NOT its rows. Reading
  //! it the other way transposes every rotation, which looks almost right on a
  //! symmetric block and is wrong on everything else.
  const col = j => [m[j], m[4 + j], m[8 + j]];
  const origin = [m[3], m[7], m[11]];
  const x = col(0), y = col(1), z = col(2);
  const lx = vlen(x), ly = vlen(y), lz = vlen(z);
  if (!(lx > 0 && ly > 0 && lz > 0)) return null;
  const ux = scaled(x, 1 / lx), uy = scaled(y, 1 / ly), uz = scaled(z, 1 / lz);
  //! Rigid means the axes are still perpendicular and still the same length.
  //! 1e-6 is tighter than any transform a person builds by snapping in Rhino
  //! and looser than the float noise of composing a few rotations.
  const square = Math.abs(vdot(ux, uy)) < 1e-6 && Math.abs(vdot(uy, uz)) < 1e-6
              && Math.abs(vdot(ux, uz)) < 1e-6;
  const even = Math.abs(lx - ly) < 1e-9 * lx && Math.abs(ly - lz) < 1e-9 * ly;
  //! A mirrored block is rigid by every test above and still cannot be an
  //! Instance: the node turns and scales a part, it does not reflect one.
  const mirrored = vdot(vcross(ux, uy), uz) < 0;
  return { origin, x: ux, y: uy, z: uz, scale: lx,
           rigid: square && even && !mirrored, mirrored, scales: [lx, ly, lz] };
}

const vlen = v => Math.hypot(v[0], v[1], v[2]);
const vdot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const scaled = (v, k) => [v[0] * k, v[1] * k, v[2] * k];
const vcross = (a, b) => [a[1] * b[2] - a[2] * b[1],
                         a[2] * b[0] - a[0] * b[2],
                         a[0] * b[1] - a[1] * b[0]];

//! A point through a Rhino transform, for the objects that have to be baked
//! because their transform is not something Instance can say.
export function applyXform(m, p) {
  if (!m || m.length !== 16) return [p[0], p[1], p[2]];
  return [
    m[0] * p[0] + m[1] * p[1] + m[2] * p[2] + m[3],
    m[4] * p[0] + m[5] * p[1] + m[6] * p[2] + m[7],
    m[8] * p[0] + m[9] * p[1] + m[10] * p[2] + m[11],
  ];
}

/* ===================================================================== meshes

   Out as OBJ, because that is what the MeshImported node reads and because an
   OBJ and a Rhino mesh are the same thing said twice. The corners stay SHARED:
   written one face at a time a box becomes twenty-four corners and twelve
   triangles with no edge joining them, which shades faceted and cannot be
   smoothed - the same trap the IFC reader documents.                         */

export function meshObj(mesh, name, scale = 1, xform = null) {
  if (!mesh || !mesh.corners) return null;
  const points = [];
  for (let i = 0; i < mesh.corners; i++) {
    const p = [mesh.v[i * 3], mesh.v[i * 3 + 1], mesh.v[i * 3 + 2]];
    const t = xform ? applyXform(xform, p) : p;
    points.push([t[0] * scale, t[1] * scale, t[2] * scale]);
  }
  const faces = [];
  for (let i = 0; i < mesh.faces; i++) {
    const a = mesh.f[i * 4], b = mesh.f[i * 4 + 1];
    const c = mesh.f[i * 4 + 2], d = mesh.f[i * 4 + 3];
    //! The quad-is-a-triangle convention, read back. A face written [a,b,c,c]
    //! is a triangle and emitting it as a four-cornered OBJ face would give it
    //! a zero-length edge, which some readers drop and others draw as a crack.
    faces.push(d === c ? [a, b, c] : [a, b, c, d]);
  }
  return writeObj([{ name: name || "mesh", points, faces }], "");
}

/* ============================================================ the layer tree

   Rhino layers nest, and the nesting is what a person recognises when the
   model arrives. Flattening it is the single most common way an import loses
   the thing its owner cared about, so it is rebuilt here exactly.            */

export function layerTree(layers) {
  const byId = new Map(layers.map(l => [l.id, { ...l, children: [] }]));
  const roots = [];
  for (const layer of byId.values()) {
    const parent = layer.parent != null ? byId.get(layer.parent) : null;
    //! A layer whose parent is missing is a root rather than a dropped layer.
    //! Rhino files edited by scripts do have these, and losing the objects on
    //! one because its parent went away is a far worse answer than a flat row.
    if (parent && parent !== layer) parent.children.push(layer);
    else roots.push(layer);
  }
  return { roots, byId };
}

//! "Steel::Primary" is how Rhino writes a nested layer's full name, and it is
//! what somebody will search the tree for.
export function layerPath(layer, byId) {
  const parts = [];
  let at = layer, guard = 0;
  while (at && guard++ < 64) {
    parts.unshift(at.name || "(unnamed)");
    at = at.parent != null ? byId.get(at.parent) : null;
  }
  return parts.join("::");
}

/* ================================================================= the model

   What the reader hands back: an ordinary model file, so it opens the way
   every model file opens - one edit, one undo step, one redraw. Nothing about
   a Rhino document reaches further in than this function.                    */

export function bridgeModel(bridge, options = {}) {
  const want = {
    blocks: options.blocks === "bake" ? "bake" : "instance",
    empty: options.empty === "keep" ? "keep" : "drop",
    ...options,
  };
  const features = [];
  const report = { meshes: 0, faces: 0, instances: 0, baked: 0, skipped: 0,
                   layers: 0, blocks: 0, missing: new Map() };
  let n = 0;
  const put = (type, name, args, parent, appearance) => {
    const id = "R" + (++n);
    const f = { id, type, name };
    if (parent) f.parent = parent;
    if (args) f.args = args;
    if (appearance) f.appearance = appearance;
    features.push(f);
    return id;
  };

  const root = put("GeometricalSet", bridge.name || "Rhino model", null, null);

  /* ---- the blocks, built once each so an instance is not a copy ---- */
  const blockSet = new Map();
  if (want.blocks === "instance" && bridge.blocks.length) {
    const shelf = put("GeometricalSet", "Blocks", null, root);
    report.blocks = bridge.blocks.length;
    const byId = new Map(bridge.objects.map(o => [o.id, o]));
    for (const block of bridge.blocks) {
      const set = put("GeometricalSet", block.name || "block", null, shelf);
      let built = 0;
      for (const memberId of block.objects) {
        const member = byId.get(memberId);
        if (!member) continue;
        //! A block's members are drawn in the block's OWN coordinates and the
        //! instance's transform places them, so no xform is applied here. The
        //! scale still is: the whole document is being brought to millimetres.
        //! AS A SHAPE, not a mesh - and this is the whole reason a block is
        //! worth building once. Instance places `F.shape(part)`, and a mesh
        //! has no shape, so an Instance of a set of meshes fails its
        //! precondition by name: "has nothing built in it to place". Found by
        //! opening one in a browser, where the instance arrived as a failed
        //! node while every unit test passed - the tests checked the model
        //! file, which was well formed, and not that the kernel could build it.
        //!
        //! MeshToShape is the expensive step here, and it runs once per block
        //! DEFINITION. A bracket placed four hundred times costs one of these
        //! and four hundred Instances, which is the trade the whole scheme is
        //! for; baking it would cost four hundred copies of the geometry.
        if (addMesh(member, set, bridge.scale, null, true)) built++;
      }
      if (built) blockSet.set(block.id, set);
      else features.splice(features.findIndex(f => f.id === set), 1);
    }
  }

  /* ---- the layers, nested as they were ---- */
  const tree = layerTree(bridge.layers);
  const setFor = new Map();
  const onLayer = new Map();
  for (const o of bridge.objects) {
    if (!o.layer) continue;
    if (!onLayer.has(o.layer)) onLayer.set(o.layer, []);
    onLayer.get(o.layer).push(o);
  }
  //! A layer is made only when something is on it or under it, so a Rhino
  //! file with four hundred empty layers does not arrive as four hundred
  //! empty folders. "keep" is there for when the tree itself is the point.
  const used = new Set();
  const mark = layer => {
    const has = (onLayer.get(layer.id) || []).length > 0;
    const below = layer.children.map(mark).some(Boolean);
    if (has || below || want.empty === "keep") { used.add(layer.id); return true; }
    return false;
  };
  tree.roots.forEach(mark);

  const makeSet = (layer, parent) => {
    if (!used.has(layer.id)) return null;
    const look = layer.colour ? { finish: "default", color: layer.colour } : null;
    const id = put("GeometricalSet", layer.name || "(unnamed)", null, parent, look);
    setFor.set(layer.id, id);
    report.layers++;
    for (const child of layer.children) makeSet(child, id);
    return id;
  };
  const layerRoot = bridge.layers.length ? put("GeometricalSet", "Layers", null, root) : root;
  tree.roots.forEach(layer => makeSet(layer, layerRoot));

  /* ---- and the objects ---- */
  const loose = [];
  for (const o of bridge.objects) {
    //! A block's members are drawn inside the block, not again out here.
    if (want.blocks === "instance" && isMember(o, bridge)) continue;
    const into = (o.layer && setFor.get(o.layer)) || layerRoot;
    if (o.block) { placeBlock(o, into); continue; }
    if (!addMesh(o, into, bridge.scale, o.xform)) loose.push(o);
  }

  return { model: modelFile(bridge, features), report, say: saying(bridge, report) };

  function isMember(o, b) {
    if (!isMember.set) {
      isMember.set = new Set();
      for (const block of b.blocks) for (const id of block.objects) isMember.set.add(id);
    }
    return isMember.set.has(o.id);
  }

  function addMesh(o, into, scale, xform, asShape) {
    if (!o.mesh) {
      report.skipped++;
      report.missing.set(o.missing, (report.missing.get(o.missing) || 0) + 1);
      return false;
    }
    const obj = meshObj(o.mesh, o.name || o.kind, scale, xform);
    if (!obj) { report.skipped++; return false; }
    report.meshes++;
    report.faces += o.mesh.faces;
    const look = o.colour ? { finish: "default", color: o.colour } : null;
    const mesh = put("MeshImported", o.name || o.kind,
      { obj, source: "Rhino " + o.kind, smooth: "Faceted" }, into, asShape ? null : look);
    //! MeshToShape CONSUMES the mesh, so the set is left holding one shape
    //! rather than a shape and the mesh it came from drawn on top of it.
    if (asShape)
      put("MeshToShape", (o.name || o.kind) + " solid",
        { mesh: { ref: mesh }, levels: 0, boundary: "Keep sharp",
          tolerance: 0.1, solid: "A solid if it closes" }, into, look);
    return true;
  }

  function placeBlock(o, into) {
    const set = blockSet.get(o.block);
    const parts = decomposeXform(o.xform);
    //! An instance this program can SAY is one body at another place; one it
    //! cannot - sheared, mirrored, scaled unevenly - is baked, and counted
    //! separately so the report can say how many and why.
    if (set && parts && parts.rigid) {
      report.instances++;
      const at = put("Point", (o.name || "block") + " at",
        { x: parts.origin[0] * bridge.scale, y: parts.origin[1] * bridge.scale,
          z: parts.origin[2] * bridge.scale }, into);
      put("Instance", o.name || "instance",
        { part: { ref: set }, at: { ref: at }, scale: parts.scale }, into);
      return;
    }
    report.baked++;
    const byId = new Map(bridge.objects.map(x => [x.id, x]));
    const block = bridge.blocks.find(b => b.id === o.block);
    for (const memberId of (block ? block.objects : [])) {
      const member = byId.get(memberId);
      if (member) addMesh(member, into, bridge.scale, o.xform);
    }
  }
}

function modelFile(bridge, features) {
  return {
    format: "ocaf-parametric-model", version: 1,
    name: bridge.name || "Rhino model",
    units: "mm",
    features,
  };
}

//! What it did, in numbers, because an import that quietly brought in less
//! than the file holds is the failure nobody notices.
function saying(bridge, report) {
  const lines = [];
  lines.push((bridge.name || "the Rhino model") + " · " + report.meshes.toLocaleString()
    + " meshes, " + report.faces.toLocaleString() + " faces, on "
    + report.layers + " layer" + (report.layers === 1 ? "" : "s"));
  if (report.blocks)
    lines.push(report.blocks + " block" + (report.blocks === 1 ? "" : "s") + " · "
      + report.instances + " placed as instances, built once each"
      + (report.baked ? ", " + report.baked + " baked because the transform scales or mirrors" : ""));
  if (report.skipped) {
    const why = [...report.missing.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([reason, count]) => count + " " + reason);
    lines.push(report.skipped + " object" + (report.skipped === 1 ? "" : "s")
      + " came in with no geometry — " + why.join("; "));
  }
  if (bridge.exact && bridge.exact.step)
    lines.push("exact surfaces were written beside it as " + bridge.exact.step
      + " — open that too for solids you can boolean and fillet");
  if (bridge.units === "none" || bridge.units === "unset")
    lines.push("the file declares no unit system, so it was read as millimetres");
  return lines;
}

/* ============================================================== a .3dm, read

   The other way in, and the limited one. Everything here takes the rhino3dm
   module as an ARGUMENT rather than importing it: this file stays free of the
   browser and of a 2.7 MB WebAssembly download, and the tests drive the real
   library in node without either.

   What this can and cannot do is a property of rhino3dm, not of this code.
   Enumerated against 8.35.0 and confirmed on a round-tripped file: Mesh has no
   `createFromBrep`, and a Brep's faces answer `getMesh(Render)` with null
   unless the file already carried one. So a .3dm draws exactly what Rhino
   cached in it. For everything else there is the bridge file.               */

export function unitNameOf(rh, value) {
  for (const key of Object.keys(rh.UnitSystem)) {
    const entry = rh.UnitSystem[key];
    if (entry && typeof entry.value === "number" && entry.value === value)
      return key.toLowerCase();
  }
  return "none";
}

//! Rhino's mesh faces come out of this library as [a, b, c, d] with a triangle
//! written [a, b, c, c] - the same convention the bridge file uses, so the two
//! readers share one mesh path rather than each having its own.
function meshRows(mesh, into) {
  if (!mesh) return 0;
  const verts = mesh.vertices(), faces = mesh.faces();
  const base = into.v.length / 3;
  const count = verts.count;
  for (let i = 0; i < count; i++) {
    const p = verts.get(i);
    if (!p) continue;
    into.v.push(p[0], p[1], p[2]);
  }
  let added = 0;
  for (let i = 0; i < faces.count; i++) {
    const f = faces.get(i);
    if (!f) continue;
    into.f.push(f[0] + base, f[1] + base, f[2] + base, f[3] + base);
    added++;
  }
  return added;
}

//! A Brep's cached render mesh, face by face. Appended rather than welded:
//! two faces of a Brep meet along an edge whose corners they do not share,
//! and joining them here would smooth a corner that is not smooth.
function cachedMesh(rh, geometry) {
  const into = { v: [], f: [] };
  let faces = null;
  try { faces = geometry.faces(); } catch (err) { return null; }
  if (!faces || !faces.count) return null;
  let any = 0;
  for (let i = 0; i < faces.count; i++) {
    let got = null;
    try { got = faces.get(i).getMesh(rh.MeshType.Render); } catch (err) { got = null; }
    if (got) any += meshRows(got, into);
  }
  return any ? into : null;
}

export function bridgeFrom3dm(bytes, rh, options = {}) {
  const doc = rh.File3dm.fromByteArray(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes));
  if (!doc) throw new Error("this is not a Rhino file, or it is a version this cannot open");

  const units = unitNameOf(rh, doc.settings().modelUnitSystem.value);
  const fromObject = rh.ObjectColorSource.ColorFromObject.value;

  const layerTable = doc.layers();
  const layers = [];
  const indexToId = new Map();
  for (let i = 0; i < layerTable.count; i++) {
    const layer = layerTable.get(i);
    const colour = layer.color || {};
    layers.push({
      id: String(layer.id), name: layer.name || "",
      //! Rhino writes an all-zero guid for a layer with no parent, and that is
      //! not a layer - left as-is it makes every root layer a child of nothing
      //! in particular, and the tree comes out flat.
      parent: emptyGuid(layer.parentLayerId) ? null : String(layer.parentLayerId),
      colour: [colour.r | 0, colour.g | 0, colour.b | 0],
      visible: layer.visible !== false,
    });
    indexToId.set(i, String(layer.id));
  }

  const defs = doc.instanceDefinitions();
  const blocks = [];
  const memberOf = new Map();
  for (let i = 0; i < defs.count; i++) {
    const def = defs.get(i);
    const ids = (def.getObjectIds ? def.getObjectIds() : []) || [];
    blocks.push({ id: String(def.id), name: def.name || "block",
                  objects: [...ids].map(String) });
    for (const id of ids) memberOf.set(String(id), String(def.id));
  }

  const objectTable = doc.objects();
  const objects = [];
  for (let i = 0; i < objectTable.count; i++) {
    const item = objectTable.get(i);
    const attributes = item.attributes();
    const geometry = item.geometry();
    const kind = geometry && geometry.constructor ? geometry.constructor.name.toLowerCase() : "unknown";
    const layerId = indexToId.get(attributes.layerIndex) || null;
    if (options.skipHidden && layerId) {
      const layer = layers.find(l => l.id === layerId);
      if (layer && !layer.visible) continue;
    }
    const colour = attributes.colorSource && attributes.colorSource.value === fromObject
      ? (c => [c.r | 0, c.g | 0, c.b | 0])(attributes.objectColor || {})
      : null;
    const row = { id: String(attributes.id), layer: layerId,
                  name: attributes.name || "", kind, colour };

    if (geometry instanceof rh.InstanceReference) {
      row.block = String(geometry.parentIdefId);
      row.xform = xformRows(geometry.xform);
      objects.push(row);
      continue;
    }
    if (geometry instanceof rh.Mesh) {
      const into = { v: [], f: [] };
      meshRows(geometry, into);
      if (into.f.length) row.mesh = into;
      else row.missing = "a mesh with no faces";
      objects.push(row);
      continue;
    }
    //! A BREP OR AN EXTRUSION, which is most of a real Rhino file - and the
    //! case this reader is limited by. Whatever Rhino cached comes through;
    //! anything else is named, counted and reported rather than dropped.
    const cached = cachedMesh(rh, geometry);
    if (cached) row.mesh = cached;
    else row.missing = "a " + kind + " saved without a render mesh — "
                     + "re-save from Rhino without \"Save Small\", or use the bridge script";
    objects.push(row);
  }

  return readBridge({
    format: BRIDGE_FORMAT, version: BRIDGE_VERSION,
    name: options.name || "Rhino model", units,
    source: { application: "rhino3dm", archive: doc.archiveVersion },
    layers, blocks, objects,
  });
}

const emptyGuid = id =>
  !id || String(id) === "00000000-0000-0000-0000-000000000000";

//! Row major, translation in the last column - the same order the bridge file
//! uses, so decomposeXform reads both without knowing which it came from.
function xformRows(xf) {
  if (!xf) return null;
  return [xf.m00, xf.m01, xf.m02, xf.m03,
          xf.m10, xf.m11, xf.m12, xf.m13,
          xf.m20, xf.m21, xf.m22, xf.m23,
          xf.m30, xf.m31, xf.m32, xf.m33];
}
