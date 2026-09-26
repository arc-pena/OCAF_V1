// Claude, on the other side of the same door.
//
// Everything in this program that edits the model does it by writing one line
// of the model description language and sending it down one channel. The node
// graph does it, a slider does it, a click in the sketcher does it. So there is
// nothing left to build for an assistant to do it too: it is handed the same op
// table, the same catalogue and the same document, and its edits go through
// `mdl.run` exactly as a drag of a wire does.
//
// That is the whole design. No second path into the model, no special
// permission, nothing an assistant can do that a person could not have typed
// into the console themselves - which is also why watching it work is watching
// nodes appear and wire themselves up, rather than a part arriving from
// nowhere.
//
// The asking is the page's own `sample` capability: in a published Artifact the
// viewer's Claude answers, on their account, and the page never sees a key.
// Opened any other way there is nobody to ask, and the panel says so instead of
// pretending.

import { mdlSchema } from "./mdl.js";

//! The catalogue, small enough to send. One line a feature: what it makes, and
//! what each argument takes. The summaries carry the intent, and they are what
//! stops a request for a roof turning into a box.
//! THE FIRST SENTENCE OF IT. The catalogue is 83 types and their summaries run
//! to 31 KiB - more than half of what a whole turn is allowed - and the
//! summaries are the part that grows, because every node added this year added
//! one. So the briefing carries the sentence that says what a node is FOR,
//! which is what stops a request for a roof becoming a box, and the rest is one
//! `node` call away. Same trick as the document: the shape first, and read the
//! part you actually need.
const firstSentence = (text, most = 190) => {
  const whole = String(text || "").replace(/\s+/g, " ").trim();
  const stop = whole.search(/\.\s/);
  const one = stop > 0 ? whole.slice(0, stop + 1) : whole;
  return one.length <= most ? one : one.slice(0, most - 1).replace(/\s\S*$/, "") + "…";
};

export function catalogueBrief(schema, { full = false } = {}) {
  return (schema.types || []).map(spec => {
    const args = (spec.args || []).map(arg => {
      if (arg.kind === "real") return arg.key + "=number";
      if (arg.kind === "choice") return arg.key + "=" + arg.options.map(o => JSON.stringify(o)).join("|");
      if (arg.kind === "ref") return arg.key + "=wire<" + arg.accepts + ">";
      if (arg.kind === "refs") return arg.key + "=wires<" + arg.accepts + ">";
      if (arg.kind === "sketch") return arg.key + "=drawing";
      if (arg.kind === "edits") return arg.key + "=vertex offsets";
      return arg.key + "=" + arg.kind;
    }).join(" ");
    return spec.type + " [" + spec.category + " -> " + spec.produces + "] " + args
         + "\n    " + (full ? spec.summary : firstSentence(spec.summary));
  }).join("\n");
}

//! One type, in full: every word of its summary and every argument with what it
//! takes, its options and its default. What the briefing's one line leaves out.
export function nodeBrief(schema, type) {
  const spec = (schema.types || []).find(one => one.type === type);
  if (!spec) {
    const near = (schema.types || []).map(one => one.type)
      .filter(one => one.toLowerCase().includes(String(type || "").toLowerCase()));
    return { found: false, note: 'there is no node type called "' + type + '"',
             perhaps: near.slice(0, 8) };
  }
  return {
    found: true, type: spec.type, category: spec.category, produces: spec.produces,
    summary: spec.summary,
    args: (spec.args || []).map(arg => ({
      key: arg.key, label: arg.label, kind: arg.kind,
      ...(arg.options ? { options: arg.options } : {}),
      ...(arg.accepts ? { accepts: arg.accepts } : {}),
      ...(arg.default === undefined ? {} : { default: arg.default }),
      ...(arg.min === undefined ? {} : { min: arg.min, max: arg.max, step: arg.step }),
      ...(arg.showWhen ? { onlyWhen: arg.showWhen } : {}),
    })),
  };
}

//! The geometry API underneath the catalogue: the two factories and what each
//! of them can do. A node is a driver and a driver is one factory call, so
//! knowing the factories is knowing what the components are made of - which is
//! what tells the difference between a component that is missing and one that
//! is there under another name. It is also the honest answer to "can it do X":
//! if no factory does X, no node does either.
export function apiBrief(api) {
  if (!api || !api.factories) return "";
  return api.factories.map(factory =>
    factory.name + " - " + factory.makes + "\n"
    + factory.operations.map(op =>
        "  " + op.name + "(" + op.takes + ") -> " + op.gives
        + "\n      " + op.summary).join("\n")).join("\n\n");
}

//! What the assistant is told before it is asked anything. The rules are the
//! ones a person working here would be given, and the first of them is the one
//! this whole program is built on.
//! What packages there are. A loaded one's nodes are already in the catalogue,
//! so what is added here is why it exists and what its own API can do. The ones
//! NOT loaded get a line each, because "there is a Climate package that would
//! answer that, ask them to load it" is a far better answer than inventing a
//! node or saying it cannot be done.
export function packagesBrief(packages) {
  if (!packages) return "";
  const out = [];
  for (const p of packages.loaded || []) {
    out.push("LOADED  " + p.name + " (" + p.id + ") - " + p.summary);
    if (p.nodes.length) out.push("    nodes: " + p.nodes.join(", "));
    if (p.view) out.push("    adds the " + p.view + " mode to the interface");
    if (p.api && p.api.operations)
      for (const op of p.api.operations)
        out.push("    " + p.api.name + "." + op.name + "(" + op.takes + ") -> " + op.gives
               + "\n        " + op.summary);
  }
  for (const p of packages.available || []) {
    out.push("AVAILABLE, not loaded  " + p.name + " (" + p.id + ") - " + p.summary);
    if (p.nodes.length) out.push("    would add: " + p.nodes.join(", ")
      + (p.view ? ", and the " + p.view + " mode" : ""));
  }
  return out.join("\n");
}

//! What can be read and written, and the one rule about which. Said here
//! because a request to import something is a request the assistant can act
//! on - the import op takes the file's text - and because a format that is not
//! in this list is one to say no to rather than one to try.
export function exchangeBrief(formats) {
  if (!formats || !formats.length) return "No file exchange in this build.";
  const line = f => "  " + f.name + " (" + f.extensions.join(", ") + ") "
    + (f.read && f.write ? "in and out" : f.read ? "in only" : "out only")
    + (f.structure ? ", carries several parts" : "")
    + "\n      " + f.summary;
  return `The "import" edit reads a file into the document; the interface writes
files out, from the burger menu, which you cannot press. An import is stored as
the geometry itself, so it rebuilds without the reader that read it, and it has
no parameters to turn - it is dead geometry that anything downstream can still
move, cut, fillet and measure. A mesh keeps the faces it was authored with, so
a quad cage from Blender stays a quad cage and can be subdivided here.

Only a format that carries several parts can be broken up ("as":"parts");
everything else comes in as one object.

${formats.map(line).join("\n")}`;
}

/* ====================================== the document, when it will not fit

   A TURN HAS A SIZE, and a building is bigger than it.

   The briefing carried `JSON.stringify(model)` - the whole document, every
   feature, every argument - and for anything anybody models by hand that is
   right: it is a few hundred lines, it is exact, and an assistant that can see
   all of it never has to guess. An IFC building is 6,010 features and 2.3 MB,
   which is thirty-five times what the turn is allowed to carry, and the answer
   that came back was not a bad answer but "the turns exceed the 64 KiB limit".

   So over a budget it is sent as its SHAPE instead: what it is made of, the
   folders it is filed into, the features that are not in one, and the last few
   that were added - which is what somebody asked to change a building actually
   works from. The exact reading of any part of it is one `look` away, by id,
   and the briefing says so.

   Nothing changes for a part. Under the budget the document goes whole, as it
   always did, because a digest of forty features would be worse than the
   forty features.                                                          */

//! HOW MUCH OF THE DOCUMENT ONE TURN MAY CARRY, in characters. The limit that
//! bit is 64 KiB for the whole turn, and the briefing around this is a good
//! twenty thousand characters of catalogue, so the document gets forty.
const DOC_BUDGET = 40000;

//! How many of a long list are worth printing. Past a couple of hundred lines
//! of "one more wall" nothing is learnt and the budget is gone.
const LIST_CAP = 150;

const featureLine = f => {
  const args = f.args ? Object.entries(f.args)
    .map(([k, v]) => k + "=" + (typeof v === "string" && v.length > 40
                                ? JSON.stringify(v.slice(0, 40) + "…") : JSON.stringify(v)))
    .join(" ") : "";
  return "  " + f.id + " " + f.type + ' "' + (f.name || "") + '"'
       + (f.parent ? " in " + f.parent : "") + (args ? "   " + args : "");
};

//! What is in it, by kind, commonest first.
function census(features) {
  const tally = new Map();
  for (const f of features) tally.set(f.type, (tally.get(f.type) || 0) + 1);
  return [...tally].sort((a, b) => b[1] - a[1])
    .map(([type, n]) => "  " + n + " × " + type).join("\n");
}

//! The document as a shape rather than as a reading of it.
export function documentDigest(model) {
  const features = model.features || [];
  const kids = new Map();
  for (const f of features) if (f.parent) kids.set(f.parent, (kids.get(f.parent) || 0) + 1);
  const sets = features.filter(f => kids.has(f.id));
  const loose = features.filter(f => !f.parent && !kids.has(f.id));
  const by = new Map(features.map(one => [one.id, one]));
  const depth = f => {
    let n = 0, at = f;
    while (at && at.parent && n < 12) { at = by.get(at.parent); n++; }
    return n;
  };
  const shallow = sets.slice().sort((a, b) => (kids.get(b.id) || 0) - (kids.get(a.id) || 0));

  return `The document is ${features.length.toLocaleString()} features and too large to send
whole, so what follows is its shape rather than a reading of it. Use the look
tool with the id of a feature or a folder to read that part exactly - that is
how to find out what anything actually is before changing it.

  name  ${model.name || "(unnamed)"}
  units ${model.units || "mm"}

WHAT IT IS MADE OF
${census(features)}

THE FOLDERS, biggest first${sets.length > LIST_CAP ? " (" + LIST_CAP + " of " + sets.length + ")" : ""}
${shallow.slice(0, LIST_CAP).map(f => featureLine(f)
    + "   [" + kids.get(f.id) + " items, depth " + depth(f) + "]").join("\n")}

FEATURES IN NO FOLDER${loose.length > LIST_CAP ? " (" + LIST_CAP + " of " + loose.length + ")" : ""}
${loose.slice(0, LIST_CAP).map(featureLine).join("\n") || "  (none)"}

THE LAST ${Math.min(60, features.length)} FEATURES ADDED, which is usually where the work is
${features.slice(-60).map(featureLine).join("\n")}`;
}

//! Whole under the budget, its shape over it.
export function documentBrief(model, budget = DOC_BUDGET) {
  const whole = JSON.stringify(model);
  if (bytesOf(whole) <= budget) return whole;
  const digest = documentDigest(model);
  return cutTo(digest, budget, "the shape of the document, cut to fit the turn");
}

//! As many of them as fit a byte budget. A list capped by COUNT is a list whose
//! size depends on how long the names happen to be, which is the same as not
//! being capped at all.
function someOf(features, budget) {
  const out = [];
  let used = 0;
  for (const f of features) {
    const line = featureLine(f).trim();
    used += bytesOf(line) + 4;
    if (used > budget) break;
    out.push(line);
  }
  return out;
}

//! One feature and everything touching it: what it is, what is inside it, what
//! it is wired to and what is wired to it. The answer to "what is GS4".
export function featureBrief(model, id) {
  const features = model.features || [];
  const one = features.find(f => f.id === id);
  if (!one) return { found: false, note: 'no feature with id "' + id + '"' };
  const inside = features.filter(f => f.parent === id);
  const mentions = f => JSON.stringify(f.args || {}).includes('"' + id + '"');
  const readers = features.filter(f => f.id !== id && mentions(f));
  return {
    found: true,
    feature: one,
    //! BY BYTES, NOT BY COUNT. Four hundred features was the cap and four
    //! hundred walls is eighty thousand characters - one tool result over the
    //! whole allowance for a turn, on exactly the document that cannot afford
    //! it. The count is still reported in full, so "I can see 90 of 412" is
    //! something the assistant knows rather than something it has to guess.
    inside: someOf(inside, RESULT_BYTES * 0.45),
    insideCount: inside.length,
    usedBy: someOf(readers, RESULT_BYTES * 0.2),
    usedByCount: readers.length,
  };
}

export function briefing(schema, model, packages) {
  const head = headBrief(schema, packages);
  return withDocument(head, model);
}

//! Everything the briefing says that is not the document. Separated because the
//! document's budget is whatever this leaves - see withDocument.
function headBrief(schema, packages) {
  const ops = mdlSchema().ops.map(op =>
    "  " + op.op + "(" + op.fields.join(", ") + ")"
    + (op.rebuilds ? "" : "   [changes only the view]")
    + "\n      " + op.summary
    + "\n      e.g. " + JSON.stringify(op.example)).join("\n");

  return `You are working inside a parametric CAD modeller. You edit the model
the same way every other part of the interface does:
by sending edits in its model description language. Nothing else reaches the
document, and each edit you send is applied live in front of the person asking,
so they watch the part being built.

HOW TO WORK
- Call run_edits with a list of edits. Send them in dependency order: a feature
  must exist before anything is wired to it.
- Give every feature an "id" of your own choosing when you add it, and a "name"
  a person would recognise ("Roof slab", not "Extrude.4"). The id is how every
  later edit refers to it, so choose it up front rather than waiting to be told
  one: {"op":"add","type":"Cube","id":"BASE","name":"Base block"} and then
  {"op":"set","id":"BASE","key":"dx","value":240}.
- Work in stages of a handful of edits rather than one huge list, and look at
  what run_edits reports back before the next stage. If something errors, fix
  it before building on it.
- Prefer nodes wired to nodes. A Script takes no inputs, so it is not part of
  the graph - reach for one only when the move is genuinely beyond the
  components, and say why.
- What an input accepts is what a source PRODUCES, not its type name. Any
  number input can be driven by anything producing numbers.
- Sizes are millimetres. Building-scale work is thousands of them.
- Past about a dozen nodes, file them into sets as you go: a GeometricalSet for
  wireframe and surfaces, a Body for solids, and "group" to put a node in one.
  A set is a folder - it holds nothing, builds nothing and consumes nothing, so
  it can never change the part - but it lets the person read forty nodes as
  four groups, and it can say what feeds it from outside.
- When you are finished, say in one or two sentences what you built and which
  numbers are worth turning.

THE EDITS
${ops}

THE COMPONENTS
${catalogueBrief(schema)}

Each node above carries the one sentence that says what it is FOR. Every node
has more to say than that - which arguments apply to which setting, what the
choices mean, what the defaults are - and the "node" tool reads the whole of
one by name. Use it before reaching for a node you have not used here before.

THE GEOMETRY UNDERNEATH THEM
Every component above is a driver over one call into one of these two
factories, split the way CATIA splits them: everything that is not a solid is
hybrid, everything that is, is not. You cannot call these directly - you build
by wiring components - but they say what the kernel can actually do, so a
component you cannot find is either here under another name or genuinely not
there. Do not invent a component that is not in the list above.

${apiBrief(schema.api)}

PACKAGES
Components that are not general live in packages, and a package is off until
somebody loads it. You cannot load one yourself - it is a switch in the
interface, under the packages button in the toolbar - but you can see what is
on the shelf, and asking for one is the right answer when a request needs it.
Never use a node from a package that is not loaded: it is not in the catalogue
above, so it does not exist yet.

${packagesBrief(packages)}

FILES
${exchangeBrief(schema.exchange)}

THE DOCUMENT AS IT STANDS
`;
}

//! WHAT IS LEFT, rather than a number chosen in advance.
//!
//! DOC_BUDGET was 40,000 characters and the comment above it said the rest of
//! the briefing was "a good twenty thousand". It is not: every node added since
//! added a summary, and the catalogue reached 31 KiB on its own - so the
//! opening turn measured 60 KiB against a 64 KiB limit and the first question
//! asked of a large model failed before it was read. A budget that does not
//! know what it is sharing with is not a budget.
function withDocument(head, model) {
  const room = Math.max(4000, TURN_BYTES - bytesOf(head) - TURN_HEADROOM);
  return head + documentBrief(model, room);
}

/* ==========================================================================
   Who answers.

   Two of them, and the difference is whose account pays. Published as an
   Artifact, the page asks the person reading it - their Claude account, no key,
   nothing to set up, and the runtime runs the tool loop. Served as an ordinary
   web page there is nobody to ask, so the person brings a key of their own and
   this file runs the same loop against the Messages API itself.

   Both are the same function to everything above: turns in, tools available,
   text out. So `ask` below does not know which one it got, and neither does the
   panel.
   ========================================================================== */

//! Where a key comes from and what it is worth saying about it. Named here
//! rather than in the interface because the interface should not be the place
//! that knows what an API key is.
export const KEY_HOME = "https://console.anthropic.com/settings/keys";
export const MODELS = [
  { id: "claude-sonnet-5", label: "Sonnet 5", note: "quick, and enough for most parts" },
  { id: "claude-opus-5", label: "Opus 5", note: "slower and dearer; better at long builds" },
];
export const DEFAULT_MODEL = MODELS[0].id;

//! The key lives in this browser and nowhere else: not in the model file, not
//! in the briefing, not on any server of ours - there is no server of ours.
//! That also means anything that can run script on this origin can read it,
//! which is why the interface says so and offers to forget it.
const KEY_STORE = "ocafcad/anthropic-key";
const MODEL_STORE = "ocafcad/anthropic-model";

const storedKey = () => {
  try { return localStorage.getItem(KEY_STORE) || ""; } catch (e) { return ""; }
};
const storedModel = () => {
  try { return localStorage.getItem(MODEL_STORE) || DEFAULT_MODEL; }
  catch (e) { return DEFAULT_MODEL; }
};
const keep = (key, model) => {
  try {
    if (key) { localStorage.setItem(KEY_STORE, key); localStorage.setItem(MODEL_STORE, model); }
    else { localStorage.removeItem(KEY_STORE); localStorage.removeItem(MODEL_STORE); }
  } catch (e) { /* a private window keeps nothing, and the key still works today */ }
};

//! Enough of the key to recognise it by, and not enough to use.
export const maskKey = key => {
  const text = String(key || "");
  return text.length > 12 ? text.slice(0, 7) + "…" + text.slice(-4) : "a key";
};

const API = "https://api.anthropic.com/v1/messages";
const MAX_TURNS = 24;          // tool round trips before it is a runaway, not a build

/* ============================================== keeping a request inside the turn

   THE BRIEFING WAS BUDGETED AND NOTHING ELSE WAS.

   documentBrief caps the document at 40,000 characters and documentDigest
   sends a shape instead of a reading, which is what got a 6,010-feature
   building into the first turn at all. But the first turn is not the request:

     · every TOOL RESULT is pushed into the conversation whole. `look` with an
       id on a folder of four hundred walls, or a schedule, is one result far
       over the whole allowance - and it is the call most likely to be made on
       exactly the model that cannot afford it.
     · results ACCUMULATE. Twenty-four rounds of them are still in `messages`
       on the twenty-fourth request.
     · `this.turns` accumulates across asks, and the briefing rides in the
       first one for ever.

   So the budget is kept here, once, on the thing that is actually sent, in
   BYTES - the limit is 64 KiB and a character is not a byte. Two rules:
   a result is cut as it is made, and the oldest results are given up first
   when the conversation as a whole will not fit. What is given up says so, in
   place, so the assistant can ask again rather than quietly working from a
   result it cannot see.                                                     */

//! UTF-8 bytes, which is what the limit counts. JSON.stringify(...).length is
//! characters: a drawing full of mm and × and — measures short and then fails.
const BYTES = new TextEncoder();
export const bytesOf = value =>
  BYTES.encode(typeof value === "string" ? value : JSON.stringify(value || "")).length;

//! 64 KiB is the limit; this is what the conversation may have of it. The rest
//! is the tool schemas, the system prompt and the JSON around it all - measured
//! at about 6 KB of tool definitions alone.
export const TURN_BYTES = 52 * 1024;
//! And what any ONE tool result may have. Big enough for a folder of a hundred
//! features read exactly; small enough that four of them still fit.
export const RESULT_BYTES = 12 * 1024;
//! What the briefing leaves for everything that is not the briefing: the tool
//! schemas (about 6 KiB), the question itself, and room for the answer to be
//! written without the next round being over before it starts.
export const TURN_HEADROOM = 10 * 1024;

//! Cut to a byte budget, on a character boundary, with the size it was. The
//! note is not decoration: an assistant that cannot tell a short answer from a
//! shortened one will believe the folder has six walls in it.
export function cutTo(text, budget, why = "cut to fit the turn") {
  const whole = String(text == null ? "" : text);
  if (bytesOf(whole) <= budget) return whole;
  //! Bytes to characters is not a ratio, so the end is found by halving rather
  //! than by dividing - a drawing of CJK names would be cut to a third of the
  //! length a ratio predicts, and one of ASCII would be cut too little.
  let lo = 0, hi = whole.length;
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (bytesOf(whole.slice(0, mid)) <= budget - 120) lo = mid; else hi = mid - 1;
  }
  return whole.slice(0, lo) + "\n… (" + why + "; " + whole.length.toLocaleString()
       + " characters in all — ask for a part of it with look)";
}

//! WHAT IS GIVEN UP FIRST, and it is the oldest tool results. They are the
//! biggest thing in a long conversation and the least valuable: what was said
//! about them is still there, and anything still needed can be looked up again.
//! The first user turn - the briefing and the question - is never touched, and
//! neither is the last exchange, or the assistant would be answering about a
//! conversation it can no longer see.
export function fitMessages(messages, budget = TURN_BYTES) {
  const total = () => messages.reduce((n, m) => n + bytesOf(m.content) + 24, 0);
  if (total() <= budget) return messages;
  for (let i = 1; i < messages.length - 2 && total() > budget; i++) {
    const turn = messages[i];
    if (!Array.isArray(turn.content)) continue;
    let gave = false;
    turn.content = turn.content.map(block => {
      if (block.type !== "tool_result") return block;
      const was = bytesOf(block.content);
      if (was <= 400) return block;
      gave = true;
      return { ...block, content: "(an earlier result of " + was.toLocaleString()
        + " bytes was given up to keep this conversation inside one turn — "
        + "run the tool again if you still need it)" };
    });
    if (!gave) continue;
  }
  //! Still over: the oldest text turns go next. Said rather than silently
  //! dropped, so the assistant knows there was something there.
  for (let i = 1; i < messages.length - 2 && total() > budget; i++) {
    if (typeof messages[i].content !== "string") continue;
    messages[i].content = cutTo(messages[i].content, 2000, "an earlier turn, shortened");
  }
  //! AND STILL OVER: the briefing itself is the weight. Twenty rounds into a
  //! long conversation about a large model, 42 KiB of catalogue and document
  //! shape is the biggest thing in the request and the least current - the
  //! document has been read properly by the tools several times since. So it
  //! goes last, and the QUESTION is kept whole: everything else can be asked
  //! for again and the question cannot.
  if (total() > budget && typeof messages[0].content === "string") {
    const whole = messages[0].content;
    const asked = whole.lastIndexOf("\n\nWHAT TO BUILD\n");
    const question = asked >= 0 ? whole.slice(asked) : "";
    const room = Math.max(1500, budget - (total() - bytesOf(whole)) - bytesOf(question) - 200);
    messages[0].content = cutTo(whole.slice(0, asked >= 0 ? asked : whole.length), room,
      "the opening briefing, shortened as this conversation grew — the catalogue is "
      + "unchanged and `look` still reads any part of the document") + question;
  }
  return messages;
}

//! The Messages API, spoken directly from the browser, with the same signature
//! the Artifact runtime's sampler has. Anthropic allows this from a page only
//! with the header below, which is also the header that says out loud what it
//! means: the key is in the browser, and a browser is not a secret place.
export function directSample({ key, model }) {
  return async function sample(turns, options = {}) {
    const tools = (options.tools || []).map(tool => ({
      name: tool.name,
      description: tool.description,
      // The runtime spells it inputSchema; the API spells it input_schema. A
      // tool that takes nothing still has to say so.
      input_schema: tool.inputSchema || { type: "object", properties: {} },
    }));
    const byName = new Map((options.tools || []).map(tool => [tool.name, tool]));
    const messages = turns.map(turn => ({ role: turn.role, content: turn.content }));
    let text = "";

    for (let round = 0; round < MAX_TURNS; round++) {
      //! BEFORE EVERY REQUEST, not once at the start: the conversation grows by
      //! a tool result each round, and the round that goes over is the round
      //! that fails.
      fitMessages(messages);
      const answer = await stream({
        key, model: model || DEFAULT_MODEL, messages, tools,
        signal: options.signal,
        onText: piece => {
          text += piece;
          if (options.onText) options.onText({ text });
        },
      });

      if (answer.stop_reason !== "tool_use") return { text: text.trim() };

      // What it said and what it asked for go back as one assistant turn, and
      // the results come back as one user turn. That is the shape the API
      // wants, and it is why the whole conversation stays in `messages`.
      messages.push({ role: "assistant", content: answer.content });
      const results = [];
      for (const block of answer.content) {
        if (block.type !== "tool_use") continue;
        const tool = byName.get(block.name);
        let output, failed = false;
        try {
          if (!tool) throw new Error("there is no tool called " + block.name);
          output = await tool.execute(block.input || {}, { signal: options.signal });
        } catch (err) {
          failed = true;
          output = { error: (err && err.message) || String(err) };
        }
        results.push({
          type: "tool_result", tool_use_id: block.id,
          //! CUT HERE, where every tool's answer passes, rather than in each
          //! tool: a tool that forgets is a tool that takes the whole turn down,
          //! and there is no reason for twenty of them to each remember.
          content: cutTo(typeof output === "string" ? output : JSON.stringify(output),
                         RESULT_BYTES, "this result was cut to fit the turn"),
          ...(failed ? { is_error: true } : {}),
        });
      }
      messages.push({ role: "user", content: results });
      if (options.signal && options.signal.aborted) return { text: text.trim() };
    }
    return { text: text.trim() };
  };
}

//! One request, streamed. Text arrives a piece at a time so the answer can be
//! watched being written; a tool call arrives as JSON in pieces and is only
//! worth anything once it is whole.
async function stream({ key, model, messages, tools, signal, onText }) {
  let response;
  try {
    response = await fetch(API, {
      method: "POST",
      signal,
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({ model, max_tokens: 8000, stream: true, messages,
                             ...(tools.length ? { tools } : {}) }),
    });
  } catch (err) {
    if (err && err.name === "AbortError") throw Object.assign(new Error("stopped"), { code: "cancelled" });
    throw Object.assign(new Error("could not reach Anthropic - " +
      ((err && err.message) || "the request failed")), { code: "unreachable" });
  }

  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json();
      detail = (body && body.error && body.error.message) || "";
    } catch (e) { /* not every failure is JSON */ }
    throw Object.assign(new Error(detail || response.statusText),
                        { code: "http_" + response.status, status: response.status });
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  const content = [];
  let open = null, buffer = "", stop_reason = null;

  const handle = event => {
    if (event.type === "content_block_start") {
      open = event.content_block.type === "tool_use"
        ? { type: "tool_use", id: event.content_block.id, name: event.content_block.name, json: "" }
        : { type: "text", text: "" };
    } else if (event.type === "content_block_delta" && open) {
      if (event.delta.type === "text_delta") { open.text += event.delta.text; onText(event.delta.text); }
      else if (event.delta.type === "input_json_delta") open.json += event.delta.partial_json;
    } else if (event.type === "content_block_stop" && open) {
      if (open.type === "tool_use") {
        let input = {};
        try { input = open.json ? JSON.parse(open.json) : {}; } catch (e) { input = {}; }
        content.push({ type: "tool_use", id: open.id, name: open.name, input });
      } else if (open.text) content.push({ type: "text", text: open.text });
      open = null;
    } else if (event.type === "message_delta" && event.delta) {
      stop_reason = event.delta.stop_reason || stop_reason;
    } else if (event.type === "error") {
      throw Object.assign(new Error((event.error && event.error.message) || "the stream failed"),
                          { code: "stream" });
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    // Server-sent events: blank line ends a message, and only the data lines
    // carry anything worth reading.
    let cut;
    while ((cut = buffer.indexOf("\n\n")) >= 0) {
      const chunk = buffer.slice(0, cut);
      buffer = buffer.slice(cut + 2);
      for (const line of chunk.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try { handle(JSON.parse(payload)); }
        catch (err) { if (err && err.code) throw err; }
      }
    }
  }
  return { content, stop_reason };
}

/* ==========================================================================
   The panel.
   ========================================================================== */

export class Agent {
  constructor(options) {
    this.mdl = options.mdl;
    this.read = options.read;                 // async () -> { schema, model, errors }
    this.onBusy = options.onBusy || (() => {});
    this.doc = options.doc || document;
    this.turns = [];                          // the conversation, kept by the page
    this.running = null;                      // the AbortController of the live call
    this.sample = undefined;                  // undefined = not asked yet, null = no
    this.through = null;                      // "page", "key", or nobody
    this.pace = 90;                           // ms between edits, so it can be watched
  }

  //! Who is going to answer, worked out once and lazily: asking for a
  //! capability that is not there is how you find out it is not there.
  //!
  //! The page's own Claude comes first and costs the reader nothing to set up.
  //! Failing that, a key the person connected themselves. Failing that, nobody,
  //! and the panel says how to fix it.
  async ready() {
    if (this.sample !== undefined) return this.sample;
    try {
      this.sample = (typeof claude !== "undefined" && claude.use)
        ? await claude.use("sample") : null;
    } catch (e) { this.sample = null; }
    if (this.sample) { this.through = "page"; return this.sample; }

    const key = storedKey();
    if (key) {
      this.sample = directSample({ key, model: storedModel() });
      this.through = "key";
    }
    return this.sample;
  }

  //! How it is connected, for the interface to say out loud. Asked before
  //! `ready` has run it answers "unknown", which is the truth.
  get connection() {
    if (this.through === "page") return { how: "page", label: "your Claude account" };
    if (this.through === "key")
      return { how: "key", label: "your API key", key: maskKey(storedKey()),
               model: storedModel() };
    return { how: this.sample === undefined ? "unknown" : "none", label: "not connected" };
  }

  //! A key, kept in this browser and nowhere else. Checked before it is kept:
  //! a key that is refused should be refused now, in front of the person who
  //! pasted it, and not in the middle of building something.
  async connect(key, model) {
    const trimmed = String(key || "").trim();
    if (!trimmed) throw Object.assign(new Error("no key"), { code: "empty_key" });
    const chosen = MODELS.some(m => m.id === model) ? model : DEFAULT_MODEL;
    const sample = directSample({ key: trimmed, model: chosen });
    // One word to one model. It proves the key, the model name and that the
    // browser is allowed to talk to Anthropic at all, for a few tokens.
    await sample([{ role: "user", content: "Reply with the single word: ready" }], {});
    keep(trimmed, chosen);
    this.sample = sample;
    this.through = "key";
    this.turns = [];
    return this.connection;
  }

  //! Forgotten, here and in the browser. The next request has nobody to ask
  //! again, which is what being disconnected means.
  disconnect() {
    keep(null, null);
    if (this.through === "key") {
      // null, not undefined: the answer to "who can answer" is now known and it
      // is nobody. Undefined would mean "not asked yet", and the interface
      // would go back to saying nothing rather than offering the way in.
      this.sample = null;
      this.through = null;
    }
    this.turns = [];
    return this.connection;
  }

  stop() {
    if (this.running) this.running.abort();
    this.running = null;
    this.onBusy(false);
  }

  get busy() { return !!this.running; }

  /* ------------------------------------------------------------ the tools */

  //! The page functions Claude may call. Both of them go through the same
  //! channel everything else does, so there is no way for one of these to do
  //! something a person could not have done by hand.
  tools(log) {
    const mdl = this.mdl;
    const pace = this.pace;
    return [
      {
        name: "run_edits",
        description: "Apply a list of edits to the model, in order, and report what "
          + "happened. Returns the id and name of every feature that now exists, and "
          + "the message from any edit that was refused. Edits are applied one at a "
          + "time and are visible as they go.",
        inputSchema: {
          type: "object",
          properties: {
            edits: {
              type: "array",
              description: "The edits, in dependency order. Each is one object in the "
                + "model description language, e.g. {\"op\":\"add\",\"type\":\"Cube\","
                + "\"name\":\"Base\"}.",
              items: { type: "object" },
            },
          },
          required: ["edits"],
        },
        execute: async (input, context) => {
          const edits = Array.isArray(input.edits) ? input.edits : [];
          if (!edits.length) throw new Error('"edits" must be a list of edits');
          // One tool call is one thing done, so it is one step to undo however
          // many edits were inside it - what the person watching would expect
          // "undo what it just did" to mean.
          const { applied, failed } = await mdl.runBatch(edits, async (trouble, edit) => {
            log(trouble ? { kind: "refused", edit, message: trouble } : { kind: "edit", edit });
            // Slow enough to be watched. The person asked to see this happen.
            if (pace) await new Promise(go => setTimeout(go, pace));
          }, context.signal);
          const { model } = await this.read();
          const all = model.features || [];
          //! WHAT EXISTS NOW - but a building has six thousand of them and the
          //! list alone is three hundred kilobytes, which is five turns' worth
          //! of room spent saying what was already in the briefing. The tail is
          //! where anything it just made is, and the count says what it is the
          //! tail of.
          const listed = all.slice(-300);
          return {
            applied,
            stopped: context.signal.aborted,
            failed: failed.slice(0, 12),
            featureCount: all.length,
            features: listed.map(f => f.id + " " + f.type + ' "' + f.name + '"'),
            ...(listed.length < all.length
                ? { note: "the last " + listed.length + " of " + all.length
                          + " features; use look with an id for any other" }
                : {}),
          };
        },
      },
      {
        name: "look",
        description: "Read the model as it stands now, and any errors on it. With no "
          + "id it is the whole document - or, when the document is too large for one "
          + "turn, its shape: what it is made of, its folders, and the newest features. "
          + "With an id it is that one feature exactly, what is inside it and what is "
          + "wired to it, which is how to read a large document a part at a time.",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "The id of one feature or folder to read. "
                    + "Leave it out for the whole document." },
          },
        },
        execute: async (input) => {
          const { model, errors } = await this.read();
          const id = input && typeof input.id === "string" ? input.id.trim() : "";
          if (id) return { ...featureBrief(model, id), errors };
          //! THE SAME BUDGET THE BRIEFING KEEPS. A tool result is a turn like
          //! any other, and "read the whole document" on a building is the one
          //! call most likely to be made and least likely to fit.
          const whole = JSON.stringify(model);
          if (whole.length <= DOC_BUDGET) return { model, errors };
          return { shape: documentDigest(model), errors,
                   note: "the document is " + whole.length.toLocaleString()
                         + " characters, too large for one turn; read any part of it "
                         + "with look and an id" };
        },
      },
      {
        //! THE OTHER HALF OF SENDING A SHAPE RATHER THAN A READING. The
        //! briefing lists every node with the one sentence that says what it is
        //! FOR, because 83 full summaries are 31 KiB and more than half a turn.
        //! Nothing is lost: this is how the rest of one is read, and the
        //! briefing says so where the catalogue is.
        name: "node",
        description: "Read one node type of the catalogue in full: everything its "
          + "summary says, and every argument with what it takes, its choices and its "
          + "default. The briefing lists every type with one line each; this is how to "
          + "read the rest of one before using it.",
        inputSchema: {
          type: "object",
          properties: {
            type: { type: "string", description: 'The node type, e.g. "Sweep" or "Point".' },
          },
          required: ["type"],
        },
        execute: async (input) => {
          const { schema } = await this.read();
          return nodeBrief(schema, (input && input.type) || "");
        },
      },
    ];
  }

  /* -------------------------------------------------------------- the turn */

  //! One request. \p onEvent is how the panel shows what is happening: the
  //! answer as it is written, and a line for every edit that lands.
  async ask(prompt, onEvent) {
    const sample = await this.ready();
    if (!sample) throw new Error("no-sample");
    if (this.running) throw new Error("still working - stop it first");

    const { schema, model, packages } = await this.read();
    // Memory-less: the whole conversation goes every time, and the briefing
    // rides on the first turn so the document it describes is the current one.
    const opening = briefing(schema, model, packages);
    const turns = this.turns.length
      ? [...this.turns, { role: "user", content: prompt }]
      : [{ role: "user", content: opening + "\n\nWHAT TO BUILD\n" + prompt }];

    this.running = new AbortController();
    this.onBusy(true);
    const log = event => onEvent(event);
    try {
      const answer = await sample(turns, {
        signal: this.running.signal,
        tools: this.tools(log),
        modelTier: "complex",
        onText: ({ text }) => onEvent({ kind: "text", text }),
      });
      this.turns = [...turns, { role: "assistant", content: answer.text }];
      // The briefing is only ever sent once; from here the document is what the
      // tools report, which is cheaper and always current.
      onEvent({ kind: "done", text: answer.text });
      return answer.text;
    } finally {
      this.running = null;
      this.onBusy(false);
    }
  }

  //! Start again: the next request carries the briefing and the document as it
  //! stands, rather than everything said so far.
  forget() { this.turns = []; }
}

//! What went wrong, in words a person can act on. The capability reports a code
//! and the page has to say what it means here.
export function agentTrouble(err) {
  const code = err && err.code;
  if (code === "not_granted" || (err && err.message === "no-sample"))
    return "Nobody is connected to answer. Press Connect and paste an Anthropic API "
         + "key - it stays in this browser, and the work is billed to your own "
         + "account. In the published Artifact this page asks your Claude account "
         + "instead and there is nothing to connect.";
  if (code === "http_401" || code === "http_403")
    return "Anthropic refused that key. Check it at console.anthropic.com, or press "
         + "Connect and paste a new one.";
  if (code === "http_400")
    return "Anthropic refused the request" + (err.message ? " - " + err.message : "")
         + ". If it names the model, connect again and pick the other one.";
  if (code === "http_429")
    return "Your account is rate limited just now, or out of credit. Give it a moment, "
         + "or check the balance at console.anthropic.com.";
  if (code && code.startsWith("http_5"))
    return "Anthropic had trouble at their end (" + code.slice(5) + "). Try again.";
  if (code === "unreachable")
    return "Could not reach Anthropic from this page. Check the connection, and that "
         + "no extension is blocking api.anthropic.com.";
  if (code === "empty_key") return "Paste a key first.";
  if (code === "cancelled") return "Stopped.";
  if (code === "rate_limited") return "Too many requests just now. Give it a moment.";
  if (code === "tools_unavailable")
    return "This view cannot run the page's own tools, so there is no way to apply "
         + "the edits it would write.";
  if (code === "empty_completion") return "No answer came back. Try asking again.";
  return (err && err.message) || "Something went wrong.";
}
