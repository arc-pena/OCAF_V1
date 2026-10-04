// Every module must stand on its own imports.
//
// This is the rule CLAUDE.md states and that, until this file, nothing
// enforced. It matters because the two builds hide it from each other: the
// single file staples every module into ONE scope, so a name used without
// being imported resolves to whoever else declared it and works perfectly;
// served as modules it is a ReferenceError before the first frame.
//
// It has now happened three times. The last one was `trimNumber` in app.js -
// used in the light lister, exported by ocaf.js, never imported. The single
// file was fine. On the served site the rebuild threw part way through, which
// left the pick list empty, and what a person SAW was not an error: the model
// on screen, nothing highlighting under the pointer, and a right-click saying
// there was nothing there. A missing import does not look like a missing
// import, which is why it needs a test rather than care.
//
// The check: for every module, every name that some OTHER module in src/
// exports, used here as a bare identifier, must be imported here or declared
// here. Narrow on purpose - it says nothing about globals or about names
// nobody exports - which is what keeps it quiet enough to be worth running.

import { readFileSync, readdirSync } from "fs";

const DIR = "docs/src";
const files = readdirSync(DIR).filter(name => name.endsWith(".js"));

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

//! Comments and strings out, so a name in a sentence is not a use of it. Done
//! in one pass so a quote inside a comment cannot open a string.
function code(text) {
  let out = "", i = 0;
  while (i < text.length) {
    const c = text[i], d = text[i + 1];
    if (c === "/" && d === "/") { while (i < text.length && text[i] !== "\n") i++; continue; }
    if (c === "/" && d === "*") { i += 2; while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++; i += 2; continue; }
    //! A REGEX LITERAL, which is not code that uses names - `[0-9a-fA-F]`
    //! inside one was being read as a use of `F`, which ocaf.js exports. A
    //! slash starts a regex only where a value cannot already have ended, so
    //! the character before it decides: after `(`, `,`, `=`, `:`, `[`, `!`,
    //! `&`, `|`, `?`, `{`, `}`, `;`, `return` or a line start, it is a regex;
    //! after a name or a bracket it is division.
    if (c === "/" && /[(,=:[!&|?{};\n]\s*$/.test(out + " ".repeat(0))) {
      i++;
      while (i < text.length && text[i] !== "/") {
        if (text[i] === "\\") i++;
        if (text[i] === "[") { while (i < text.length && text[i] !== "]") i++; }
        i++;
      }
      i++;
      while (i < text.length && /[gimsuy]/.test(text[i])) i++;
      out += "/RE/"; continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      const quote = c; i++;
      while (i < text.length && text[i] !== quote) { if (text[i] === "\\") i++; i++; }
      i++; out += '""'; continue;
    }
    out += c; i++;
  }
  return out;
}

//! What a module exports, by name. Covers the three forms this codebase uses:
//! `export const X`, `export function X`, `export class X`, and the list form
//! `export { X, Y as Z }`.
function exportsOf(text) {
  const names = new Set();
  for (const m of text.matchAll(/\bexport\s+(?:async\s+)?(?:const|let|var|function\*?|class)\s+([A-Za-z_$][\w$]*)/g))
    names.add(m[1]);
  for (const m of text.matchAll(/\bexport\s*\{([^}]*)\}/g))
    for (const piece of m[1].split(","))
      names.add((piece.split(/\bas\b/).pop() || "").trim());
  names.delete("");
  return names;
}

//! What a module imports, by the name it is bound to here.
function importsOf(text) {
  const names = new Set();
  //! The module name may be EMPTY here, and that is not a typo: this runs on
  //! the stripped text, where every string literal has been replaced by `""`
  //! so that a name mentioned in a comment is not counted as a use. The first
  //! version of this required a character between the quotes and therefore
  //! matched no import at all - which made the check report every imported
  //! name in the program as missing, six hundred and fifty of them, and
  //! report its own control case as failing too. A check that fails on
  //! everything is a check nobody reads.
  for (const m of text.matchAll(/\bimport\s+([^;]*?)\s+from\s*["'][^"']*["']/g)) {
    const clause = m[1];
    for (const piece of (clause.match(/\{([^}]*)\}/) || [, ""])[1].split(","))
      names.add((piece.split(/\bas\b/).pop() || "").trim());
    const bare = clause.replace(/\{[^}]*\}/g, "").replace(/\*\s+as\s+/g, "")
                       .split(",").map(s => s.trim()).filter(Boolean);
    for (const one of bare) names.add(one);
  }
  names.delete("");
  return names;
}

//! Everything this module declares for itself, at any depth. Deliberately
//! generous - a name declared in a function still means this file is not
//! borrowing somebody else's - because a false alarm here costs more than a
//! miss: a test nobody believes gets switched off.
function declaredIn(text) {
  const names = new Set();
  //! EVERY DECLARATOR, not only the first. `const fine = 160, round = 48;`
  //! declares both, and reading only the first reported `round` as borrowed
  //! from ocaf.js - which exports one.
  for (const m of text.matchAll(/\b(?:const|let|var)\s+([^;=]*(?:=[^;,]*(?:,[^;=]*)?)*);?/g))
    for (const piece of m[1].split(","))
      names.add((piece.split("=")[0] || "").replace(/[{}[\]().]/g, " ").trim().split(/\s+/)[0] || "");
  for (const m of text.matchAll(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of text.matchAll(/\b(?:function\*?|class)\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  //! Destructured bindings: `const { a, b } = x` and `const [a, b] = x`.
  //! Destructures, including ones that run over several lines and carry
  //! defaults - `{ a, sketchRelation = -1, b } = world` declares all three.
  for (const m of text.matchAll(/[{[]([^{}[\]]{0,600})[}\]]\s*=[^=]/g))
    for (const piece of m[1].split(","))
      names.add((piece.split(":").pop() || "").replace(/=.*/s, "")
                .replace(/[.()]/g, "").trim());
  //! Parameters, roughly: anything inside the parentheses of a function.
  for (const m of text.matchAll(/(?:function\*?\s*[\w$]*\s*|\b)\(([^()]{0,400})\)\s*(?:=>|\{)/g))
    for (const piece of m[1].split(","))
      names.add((piece.split("=")[0] || "").replace(/[{}[\].]/g, "").trim());
  //! METHODS, of a class or an object literal. `spin(dt) {` declares `spin`
  //! here as surely as `const spin =` would, and without this every method
  //! whose name some other module also exports is reported - which was ten of
  //! the eleven findings the first time this ran.
  for (const m of text.matchAll(/^[ \t]*(?:async\s+|get\s+|set\s+|static\s+)*([A-Za-z_$][\w$]*)\s*\([^()]{0,300}\)\s*\{/gm))
    names.add(m[1]);
  //! And object shorthand: `{ round }` passes `round` along, it does not use
  //! a `round` from somewhere else.
  for (const m of text.matchAll(/[{,]\s*([A-Za-z_$][\w$]*)\s*[,}]/g)) names.add(m[1]);
  names.delete("");
  return names;
}

const text = new Map(files.map(name => [name, readFileSync(DIR + "/" + name, "utf8")]));
const bare = new Map([...text].map(([name, body]) => [name, code(body)]));
const exported = new Map([...bare].map(([name, body]) => [name, exportsOf(body)]));

console.log("1. the modules are readable and export things");
{
  check("every module parsed", bare.size === files.length, files.length + " modules");
  const total = [...exported.values()].reduce((n, set) => n + set.size, 0);
  check("and between them they export a few hundred names", total > 200, total + " exports");
}

console.log("\n2. nothing borrows a name the single file would have lent it");
{
  const trouble = [];
  for (const [name, body] of bare) {
    const mine = new Set([...declaredIn(body), ...importsOf(body)]);
    //! Names some OTHER module exports. A module may of course use its own.
    const elsewhere = new Map();
    for (const [other, names] of exported) {
      if (other === name) continue;
      for (const one of names) if (!elsewhere.has(one)) elsewhere.set(one, other);
    }
    for (const [one, from] of elsewhere) {
      if (mine.has(one)) continue;
      //! A bare use: not a property (`.x`), not a key (`x:`), not a string.
      const used = new RegExp("(^|[^.\\w$'\"])" + one.replace(/\$/g, "\\$")
                              + "(?![\\w$])(?!\\s*:)", "m");
      if (used.test(body)) trouble.push(name + " uses " + one + ", exported by " + from);
    }
  }
  check("no module uses a name it has not imported", !trouble.length,
        trouble.slice(0, 12).join("; ") + (trouble.length > 12
          ? " … and " + (trouble.length - 12) + " more" : "") || "all stand alone");
}

console.log("\n3. and the check can tell the two apart");
{
  //! A test of a check has to be shown failing on the thing it is for, or it
  //! is a test that cannot fail. `trimNumber` is the real one: exported by
  //! ocaf.js, used by app.js, and imported there - take the import away and
  //! this must find it.
  const app = bare.get("app.js");
  check("app.js really does import trimNumber",
        importsOf(app).has("trimNumber"));
  const without = app.replace(/sliderSpan, trimNumber, typeSpec/, "sliderSpan, typeSpec");
  check("and with the import removed the check finds it",
        !importsOf(without).has("trimNumber")
        && /(^|[^.\w$'"])trimNumber(?![\w$])(?!\s*:)/m.test(without),
        "used " + (without.match(/trimNumber/g) || []).length + " times, imported 0");
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
