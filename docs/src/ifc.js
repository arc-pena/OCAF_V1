// IFC, read as a model rather than as a picture.
//
// WHAT THIS IS FOR. An IFC file opened in a viewer is triangles: you can look
// at the wall, you cannot change its thickness. But a wall in an IFC file is
// almost never triangles - it is an IfcExtrudedAreaSolid over an
// IfcArbitraryClosedProfileDef, which is to say a closed outline and a depth,
// which is to say exactly the Extrude node this program already has. The
// geometry in a building model is a small vocabulary used over and over, and
// nearly all of it is already in the catalogue.
//
// So the import does not tessellate. It reads the entities, and writes the
// model language - the same edits a hand makes - so what arrives is a
// parametric tree with the building's own structure in it: project, site,
// building, storey, element, each a geometrical set, and inside each element
// the nodes that build it. Change the depth and the slab gets thicker.
//
// ON IFCOPENSHELL. What is ported here is its MAPPING - the correspondence in
// IfcGeom's mapping/ between an IFC representation item and a modelling
// operation - which is the part of it that matters when the geometry is going
// to be rebuilt by somebody else's kernel. Its code is not: IfcOpenShell has
// no browser distribution, its WASM road is a Python runtime an order of
// magnitude larger than this whole page, and what it would be carried in for
// is its own OpenCascade, which is already here. The file format it reads is
// ISO 10303-21, which is text, and reading it is the first two hundred lines
// below.
//
// WHAT IS IN HERE AND WHAT IS NOT. Everything in this file is arithmetic over
// text: it takes an IFC file and gives back a list of edits. It knows nothing
// about OpenCascade, nothing about the document, and nothing about the page,
// which is what makes the mapping testable on its own - every check in
// ifc.test.mjs is a small IFC file in, a list of edits out, with no kernel
// anywhere near it.

/* ============================================================ ISO 10303-21

   The STEP physical file, which is what an IFC file is. Instances numbered
   with a hash, attributes positional, references by number:

       #42= IFCEXTRUDEDAREASOLID(#38,#41,#12,3000.);

   That is the whole format, plus the spellings for null ($), derived (*),
   enumerations (.TRUE.), lists ((1.,0.,0.)) and defined types wrapping a
   value (IFCPOSITIVELENGTHMEASURE(200.)).                                   */

//! A value that was written as an enumeration rather than as a string, kept
//! apart from one because IFC uses both and they mean different things: an
//! IfcBooleanOperator is .DIFFERENCE. and a name is 'Difference'.
export const ifcEnum = name => ({ enum: name });
//! A value wrapped in the name of a defined type - IFCLENGTHMEASURE(200.) -
//! which is how IFC carries units of measure through property sets.
export const ifcTyped = (type, value) => ({ type, value });

const DIGIT = /[0-9]/;

//! Reads one IFC file. The whole text, one pass, no regular expressions over
//! the body: a building model is tens of megabytes and a backtracking match
//! over it is not a thing anybody should wait for.
export function readIfc(text) {
  const source = String(text || "");
  let i = 0;
  const end = source.length;

  const skip = () => {
    for (;;) {
      while (i < end) {
        const c = source.charCodeAt(i);
        if (c === 32 || c === 9 || c === 10 || c === 13) i++; else break;
      }
      if (source.charCodeAt(i) === 47 && source.charCodeAt(i + 1) === 42) {   // comment
        const shut = source.indexOf("*/", i + 2);
        i = shut < 0 ? end : shut + 2;
        continue;
      }
      return;
    }
  };

  //! A quoted string, with the two escapes anybody actually meets: a doubled
  //! quote, and ISO 10646 in \X2\....\X0\, which is how every non-ASCII name
  //! written by a European authoring tool arrives.
  const readString = () => {
    i++;                                        // the opening quote
    let out = "";
    while (i < end) {
      const c = source[i];
      if (c === "'") {
        if (source[i + 1] === "'") { out += "'"; i += 2; continue; }
        i++; return out;
      }
      if (c === "\\") {
        const tag = source.slice(i, i + 4).toUpperCase();
        if (tag === "\\X2\\" || tag === "\\X4\\") {
          const wide = tag === "\\X4\\" ? 8 : 4;
          let j = i + 4, run = "";
          while (j + wide <= end && /^[0-9A-Fa-f]+$/.test(source.slice(j, j + wide))) {
            run += String.fromCodePoint(parseInt(source.slice(j, j + wide), 16));
            j += wide;
          }
          const shut = source.slice(j, j + 4).toUpperCase();
          out += run;
          i = shut === "\\X0\\" ? j + 4 : j;
          continue;
        }
        if (source.slice(i, i + 3).toUpperCase() === "\\X\\") {
          out += String.fromCharCode(parseInt(source.slice(i + 3, i + 5), 16));
          i += 5; continue;
        }
        if (source.slice(i, i + 3).toUpperCase() === "\\S\\") {
          out += String.fromCharCode(source.charCodeAt(i + 3) + 128);
          i += 4; continue;
        }
        out += c; i++; continue;
      }
      out += c; i++;
    }
    return out;
  };

  //! One attribute. Recursive, because a list holds values and a defined type
  //! wraps one.
  const readValue = () => {
    skip();
    const c = source[i];
    if (c === undefined) return null;
    if (c === "$") { i++; return null; }
    if (c === "*") { i++; return undefined; }              // derived in a subtype
    if (c === "'") return readString();
    if (c === "#") {
      i++;
      let n = "";
      while (i < end && DIGIT.test(source[i])) n += source[i++];
      return { ref: Number(n) };
    }
    if (c === ".") {
      const shut = source.indexOf(".", i + 1);
      const name = source.slice(i + 1, shut < 0 ? end : shut);
      i = shut < 0 ? end : shut + 1;
      return ifcEnum(name);
    }
    if (c === "(") {
      i++;
      const list = [];
      for (;;) {
        skip();
        if (source[i] === ")") { i++; return list; }
        if (source[i] === ",") { i++; continue; }
        if (i >= end) return list;
        list.push(readValue());
      }
    }
    if (c === '"') {                                        // binary, kept as text
      const shut = source.indexOf('"', i + 1);
      const raw = source.slice(i + 1, shut < 0 ? end : shut);
      i = shut < 0 ? end : shut + 1;
      return { binary: raw };
    }
    if (c === "-" || c === "+" || c === "." || DIGIT.test(c)) {
      let n = "";
      while (i < end && /[0-9+\-.eE]/.test(source[i])) n += source[i++];
      return Number(n);
    }
    // A keyword: either a defined type wrapping a value, or a bare token.
    let word = "";
    while (i < end && /[A-Za-z0-9_]/.test(source[i])) word += source[i++];
    skip();
    if (source[i] === "(") {
      i++;
      const list = [];
      for (;;) {
        skip();
        if (source[i] === ")") { i++; break; }
        if (source[i] === ",") { i++; continue; }
        if (i >= end) break;
        list.push(readValue());
      }
      return ifcTyped(word.toUpperCase(), list.length === 1 ? list[0] : list);
    }
    return word;
  };

  const header = {};
  const entities = new Map();
  const byType = new Map();
  const file = (type, id, args) => {
    const entity = { id, type, args };
    entities.set(id, entity);
    const list = byType.get(type);
    if (list) list.push(id); else byType.set(type, [id]);
    return entity;
  };

  let section = "";
  while (i < end) {
    skip();
    if (i >= end) break;
    if (source[i] === "#") {
      i++;
      let n = "";
      while (i < end && DIGIT.test(source[i])) n += source[i++];
      skip();
      if (source[i] === "=") i++;
      skip();
      let word = "";
      while (i < end && /[A-Za-z0-9_]/.test(source[i])) word += source[i++];
      skip();
      const args = source[i] === "(" ? readValue() : [];
      //! A COMPLEX INSTANCE - #5=(IFCA(..)IFCB(..)) - is several partial
      //! entities at one number. Rare, and never load-bearing for geometry, so
      //! the first of them is kept and the rest passed over rather than
      //! refusing the file for it.
      if (!word && Array.isArray(args)) {
        while (i < end && source[i] !== ";") i++;
        i++;
        continue;
      }
      file(word.toUpperCase(), Number(n), Array.isArray(args) ? args : [args]);
      while (i < end && source[i] !== ";") i++;
      i++;
      continue;
    }
    // A bare keyword: a section marker, or a header entry.
    let word = "";
    while (i < end && /[A-Za-z0-9_\-]/.test(source[i])) word += source[i++];
    const key = word.toUpperCase();
    if (key === "HEADER" || key === "DATA") { section = key; i++; continue; }
    if (key === "ENDSEC") { section = ""; i++; continue; }
    if (key === "ISO" || key === "END" || !key) { i++; continue; }
    skip();
    if (source[i] === "(") {
      const args = readValue();
      if (section === "HEADER") header[key] = args;
    }
    while (i < end && source[i] !== ";") i++;
    i++;
  }

  const said = header.FILE_SCHEMA && header.FILE_SCHEMA[0];
  const schema = Array.isArray(said) ? String(said[0] || "") : String(said || "");
  return { schema: schema.toUpperCase(), header, entities, byType,
           //! The inverse attributes IFC leaves to the reader to build. Every
           //! relationship in the file points from the relationship to its
           //! ends, so "what is in this storey" is a search unless it is
           //! indexed once - and on a real model it is asked for thousands of
           //! times.
           pointingAt: inverseIndex(entities) };
}

//! id -> [ids of entities that name it], which is how IfcRelAggregates and
//! IfcRelContainedInSpatialStructure are followed backwards.
function inverseIndex(entities) {
  const index = new Map();
  const note = (to, from) => {
    const list = index.get(to);
    if (list) { if (!list.includes(from)) list.push(from); } else index.set(to, [from]);
  };
  const walk = (value, from) => {
    if (!value) return;
    if (Array.isArray(value)) { for (const one of value) walk(one, from); return; }
    if (typeof value === "object") {
      if (typeof value.ref === "number") { note(value.ref, from); return; }
      if (value.value !== undefined) walk(value.value, from);
    }
  };
  for (const [id, entity] of entities) walk(entity.args, id);
  return index;
}

/* ------------------------------------------------------- reading it back out

   Small accessors, because an IFC attribute is positional and every mapping
   below would otherwise be full of args[3][1].value.                        */

export const isRef = v => !!v && typeof v === "object" && typeof v.ref === "number";
//! A number, whether it was written bare or wrapped in a measure type.
export function asNumber(value, fallback = 0) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && value.value !== undefined)
    return asNumber(value.value, fallback);
  return fallback;
}
export function asText(value, fallback = "") {
  if (typeof value === "string") return value;
  if (value && typeof value === "object") {
    if (typeof value.enum === "string") return value.enum;
    if (value.value !== undefined) return asText(value.value, fallback);
  }
  return fallback;
}
export const asList = value => Array.isArray(value) ? value : value == null ? [] : [value];

//! The entity a reference points at, or nothing.
export const follow = (model, value) =>
  isRef(value) ? model.entities.get(value.ref) || null : null;
export const followAll = (model, value) =>
  asList(value).map(one => follow(model, one)).filter(Boolean);

//! Every entity of a type, as entities rather than as numbers.
export const ofType = (model, type) =>
  (model.byType.get(String(type).toUpperCase()) || [])
    .map(id => model.entities.get(id));

//! Everything that names this one - the inverse attributes, filtered by type.
export function pointingAt(model, entity, type) {
  const want = type ? String(type).toUpperCase() : null;
  return (model.pointingAt.get(entity && entity.id) || [])
    .map(id => model.entities.get(id))
    .filter(one => one && (!want || one.type === want));
}

/* --------------------------------------------------------------- the units

   IFC says what its numbers mean, and a file that does not say millimetres is
   not a file to guess about: a metre-based model read as millimetres is a
   building a thousand times too small, which looks exactly like nothing at
   all.                                                                      */

const SI_PREFIX = {
  EXA: 1e18, PETA: 1e15, TERA: 1e12, GIGA: 1e9, MEGA: 1e6, KILO: 1e3, HECTO: 1e2,
  DECA: 1e1, DECI: 1e-1, CENTI: 1e-2, MILLI: 1e-3, MICRO: 1e-6, NANO: 1e-9,
  PICO: 1e-12, FEMTO: 1e-15, ATTO: 1e-18,
};
//! The imperial ones IFC allows, in metres, because a US file states them as
//! a conversion onto an SI unit and the conversion is the only thing that
//! says which.
const IMPERIAL = { INCH: 0.0254, FOOT: 0.3048, YARD: 0.9144, MILE: 1609.344 };

//! How many millimetres one length in this file is. Millimetres because that
//! is what the document works in.
export function ifcScale(model) {
  for (const assignment of ofType(model, "IFCUNITASSIGNMENT"))
    for (const unit of followAll(model, assignment.args[0])) {
      if (unit.type === "IFCSIUNIT" && asText(unit.args[2]) === "LENGTHUNIT") {
        const prefix = SI_PREFIX[asText(unit.args[3]).toUpperCase()] || 1;
        return prefix * 1000;                       // metres are the SI length
      }
      if (unit.type === "IFCCONVERSIONBASEDUNIT" && asText(unit.args[1]) === "LENGTHUNIT") {
        const named = asText(unit.args[2]).toUpperCase().replace(/[^A-Z]/g, "");
        const measure = follow(model, unit.args[3]);
        const factor = measure ? asNumber(measure.args[0], 0) : 0;
        if (factor) {
          //! The conversion is onto the SI unit named beside it, which for a
          //! length is nearly always the metre - so the factor is in metres
          //! and a thousand of them are a millimetre's worth.
          const onto = follow(model, measure.args[1]);
          const prefix = onto && onto.type === "IFCSIUNIT"
            ? (SI_PREFIX[asText(onto.args[3]).toUpperCase()] || 1) : 1;
          return factor * prefix * 1000;
        }
        for (const [name, metres] of Object.entries(IMPERIAL))
          if (named.startsWith(name)) return metres * 1000;
      }
    }
  return 1;                                          // said nothing: take it as mm
}

//! And the same question for angles, which IFC states in radians or in
//! degrees and which every mapping below wants in degrees.
export function ifcAngleScale(model) {
  for (const assignment of ofType(model, "IFCUNITASSIGNMENT"))
    for (const unit of followAll(model, assignment.args[0])) {
      if (unit.type === "IFCSIUNIT" && asText(unit.args[2]) === "PLANEANGLEUNIT")
        return 180 / Math.PI;                        // radians, which SI means
      if (unit.type === "IFCCONVERSIONBASEDUNIT" && asText(unit.args[1]) === "PLANEANGLEUNIT")
        return 1;                                    // stated in degrees already
    }
  return 180 / Math.PI;
}
