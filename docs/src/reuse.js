// A geometrical set from another file, brought in as a feature.
//
// THE ARGUMENT. Put a point, a plane, a circle, an extrude and a fillet in a
// geometrical set and you have described something - a mullion, a stair, a
// window head. What that set needs from the rest of the document is whatever
// its contents read from outside it, and that list is its argument list in
// every sense that matters. So a set IS a user-defined feature already; what
// was missing was the ability to take one out of one file and put it in
// another, which is the whole of this file.
//
// Copied, not referenced. A set instantiated here is a real set with real
// features in it, wired to each other exactly as they were, and editable
// afterwards like anything else - because a feature you cannot open is a
// feature you cannot fix at four o'clock on a Friday. What is NOT copied is
// anything the set read from outside itself: those arrive unwired, and they
// are what the definition panel then asks you for.
//
// Nothing here knows about the kernel or the DOM. It reads one model file and
// writes a list of edits, which is a pure function of the two and can be
// checked without either.

/* ----------------------------------------------------------- reading it */

//! The features of a model file, sanity-checked enough that a file somebody
//! hand-edited loses the entry it got wrong rather than the whole import.
export function featuresOf(model) {
  if (!model || !Array.isArray(model.features)) return [];
  return model.features.filter(one => one && one.id && one.type);
}

//! Everything filed under a set, and everything filed under those, and so on.
//! Not the set itself: the caller decides whether it wants the folder.
export function contentsOf(model, setId, deep = true) {
  const all = featuresOf(model);
  const out = [];
  const walk = holder => {
    for (const one of all) {
      if (one.parent !== holder || out.includes(one)) continue;
      out.push(one);
      if (deep) walk(one.id);
    }
  };
  walk(setId);
  return out;
}

//! WHAT A FILE OFFERS. Every geometrical set in it, with how much is in each
//! and what each would ask for - so the thing a person chooses from is a list
//! of features rather than a list of ids.
export function setsIn(model, { isSet = one => /set$/i.test(one.type) } = {}) {
  return featuresOf(model).filter(isSet).map(one => {
    const inside = contentsOf(model, one.id);
    return { id: one.id, name: one.name || one.id, type: one.type,
             holds: inside.length, inputs: inputsOf(model, one.id).length };
  });
}

/* --------------------------------------------------------- the wires in it

   A wire is written two ways in a model file - { ref: "PT1" } for one, and
   [{ ref: "PT1" }, { ref: "PT2" }] for a list - and a driven number writes a
   third, { value: 40, from: "NU1" }. All three are wires and all three have
   to be followed, or an imported set arrives with half its plumbing.       */

//! Every wire an entry holds, as { key, to, at }: which argument, what it
//! points at, and where in the list it sits (null when it is a single wire).
export function wiresIn(entry) {
  const out = [];
  for (const [key, value] of Object.entries((entry && entry.args) || {})) {
    if (!value || typeof value !== "object") continue;
    if (Array.isArray(value)) {
      value.forEach((one, at) => {
        if (one && typeof one === "object" && one.ref) out.push({ key, to: String(one.ref), at });
      });
      continue;
    }
    if (value.ref) { out.push({ key, to: String(value.ref), at: null }); continue; }
    if (value.from) out.push({ key, to: String(value.from), at: null, drives: true });
  }
  return out;
}

//! What a set reads from OUTSIDE itself - its inputs, in the sense the panel
//! means. Each one says which feature inside holds the wire and which of its
//! arguments it is, because that is what has to be supplied afterwards.
export function inputsOf(model, setId) {
  const inside = new Set([setId, ...contentsOf(model, setId).map(one => one.id)]);
  const out = [];
  for (const entry of contentsOf(model, setId))
    for (const wire of wiresIn(entry))
      if (!inside.has(wire.to))
        out.push({ holder: entry.id, holderName: entry.name || entry.id,
                   key: wire.key, to: wire.to, at: wire.at, drives: !!wire.drives });
  return out;
}

/* --------------------------------------------------------- writing it out

   ORDER MATTERS AND NOTHING ELSE DOES. A feature cannot be wired to one that
   has not been made yet, so every feature is added first and every wire made
   afterwards - which also means a set with a cycle inside it, if such a thing
   were ever written, arrives whole rather than half.                       */

//! An id nothing in the document is using. Names are made the same way a
//! person would: the set's name with a number after it when there is already
//! one of those.
export function freshId(want, taken) {
  const base = String(want || "F").replace(/[^A-Za-z0-9_]/g, "").slice(0, 12) || "F";
  if (!taken.has(base)) return base;
  for (let i = 2; i < 10000; i++) {
    const tried = base + "_" + i;
    if (!taken.has(tried)) return tried;
  }
  return base + "_" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function freshName(want, taken) {
  const base = String(want || "Set").trim() || "Set";
  if (!taken.has(base)) return base;
  for (let i = 2; i < 10000; i++) {
    const tried = base + "." + i;
    if (!taken.has(tried)) return tried;
  }
  return base + " " + Math.random().toString(36).slice(2, 6);
}

//! THE WHOLE OF IT: one set out of one model, as a list of edits this
//! document can be handed. Also the list of what was left unwired, so
//! whatever asked for this can say what has to be supplied.
//!
//! \p spec is asked for a type's arguments, so a choice written in the file
//! as its own words - "Closed", "Make faces" - goes back to the number the
//! document stores. Without it, choices are left at their defaults rather
//! than guessed at, because a guessed choice is a silently different model.
export function instantiateEdits(model, setId, { taken = new Set(),
                                                 takenNames = new Set(),
                                                 spec = null,
                                                 name = null } = {}) {
  const all = featuresOf(model);
  const set = all.find(one => one.id === setId);
  if (!set) throw new Error("that file has no set called " + setId);
  const members = contentsOf(model, setId);
  const inside = new Set([setId, ...members.map(one => one.id)]);

  const used = new Set(taken);
  const usedNames = new Set(takenNames);
  const renamed = new Map();
  const rebadge = entry => {
    const id = freshId(entry.id, used);
    used.add(id);
    renamed.set(entry.id, id);
    return id;
  };

  const edits = [];
  const setId2 = rebadge(set);
  const setName = freshName(name || set.name || "Set", usedNames);
  usedNames.add(setName);
  edits.push({ op: "add", type: set.type, id: setId2, name: setName, refs: {} });

  for (const entry of members) {
    const id = rebadge(entry);
    const given = freshName(entry.name || entry.type, usedNames);
    usedNames.add(given);
    edits.push({ op: "add", type: entry.type, id, name: given, refs: {} });
  }

  // Filed away second, so a set's contents are put into a set that exists.
  for (const entry of members)
    edits.push({ op: "group", id: renamed.get(entry.id),
                 into: renamed.get(entry.parent) || setId2 });

  // Then the numbers, the text and the picks - everything that is a value
  // rather than a wire.
  const dropped = [];
  for (const entry of members) {
    const id = renamed.get(entry.id);
    const args = entry.args || {};
    const types = spec ? spec(entry.type) : null;
    for (const [key, value] of Object.entries(args)) {
      const arg = types ? (types.args || []).find(one => one.key === key) : null;
      if (value === null || value === undefined) continue;
      if (Array.isArray(value)) continue;                      // a list of wires
      if (typeof value === "object") {
        // { value, from } - the number is stored, the wire is made later.
        if (value.from !== undefined && Number.isFinite(Number(value.value)))
          edits.push({ op: "set", id, key, value: Number(value.value) });
        else if (value.ref === undefined && arg && arg.kind === "edits")
          // Vertices somebody moved by hand, one edit each - which is how the
          // language spells them, and the only op there is for it.
          for (const [at, to] of Object.entries(value))
            if (Array.isArray(to) && to.length >= 3)
              edits.push({ op: "vertex", id, index: Number(at),
                           x: Number(to[0]), y: Number(to[1]), z: Number(to[2]) });
        continue;
      }
      if (typeof value === "number") { edits.push({ op: "set", id, key, value }); continue; }
      if (typeof value === "string") {
        if (arg && arg.kind === "choice") {
          const at = (arg.options || []).indexOf(value);
          if (at >= 0) edits.push({ op: "set", id, key, value: at });
          continue;
        }
        if (arg && arg.kind === "sketch") {
          edits.push({ op: "sketch", id, drawing: value });
          continue;
        }
        edits.push({ op: "code", id, key, text: value });
        continue;
      }
    }
    if (entry.appearance && typeof entry.appearance === "object")
      edits.push({ op: "appearance", id, appearance: entry.appearance });
    // The picks, which are their own kind of text.
    for (const [key, value] of Object.entries(args)) {
      const arg = types ? (types.args || []).find(one => one.key === key) : null;
      if (arg && arg.kind === "subs" && Array.isArray(value) && value.length)
        edits.push({ op: "pick", id, key, picks: value });
    }
  }

  // And last the wires, now that everything they could point at exists.
  for (const entry of members) {
    const id = renamed.get(entry.id);
    for (const wire of wiresIn(entry)) {
      if (!inside.has(wire.to)) {
        // A WIRE THAT LEFT THE SET IS AN INPUT. It arrives unwired on
        // purpose: the whole point of reusing a set somewhere else is that
        // the somewhere else is different, and a wire quietly pointed at
        // whatever happened to be lying about would be worse than an empty
        // field that says what it wants.
        dropped.push({ id, holder: entry.name || entry.id, key: wire.key,
                       was: wire.to, drives: !!wire.drives });
        continue;
      }
      const to = renamed.get(wire.to);
      if (to) edits.push({ op: "connect", id, key: wire.key, from: to });
    }
  }

  return { edits, id: setId2, name: setName, inputs: dropped,
           renamed: Object.fromEntries(renamed) };
}

//! One line about what is about to arrive, for the dialogue and the log.
export function saysReuse(one) {
  if (!one) return "nothing to instantiate";
  const holds = one.holds || 0, inputs = one.inputs || 0;
  return one.name + " · " + (holds ? holds + (holds === 1 ? " feature" : " features")
                                        : "empty")
       + " · " + (inputs ? inputs + (inputs === 1 ? " input" : " inputs")
                              : "nothing to supply");
}
