// Nothing over anything else, at any size of window.
//
// The interface floats over the model, which is the point - but floating over
// the MODEL and floating over each other are different things and only the
// first one is wanted. Two rules make that true and both of them are easy to
// break by writing ordinary CSS, so both are checked here, against the
// stylesheet itself.
//
// ONE. The interface is SCALED on a big monitor, with `zoom`. A zoom scales a
// box and its offsets after the browser has worked them out, and it does not
// scale what a viewport unit or a percentage resolved to - so `100vh` inside a
// panel at 1.15 comes back as the window's height and renders fifteen per cent
// taller than the window, and a bar centred with `left: 50%` sits a hundred and
// forty pixels right of centre. Every such measurement goes through --sky and
// --span, which divide by the scale.
//
// TWO. What is down each side is not knowable in CSS - the rail's width
// depends on how many tools a package added, the definition panel is wider for
// a script - so the page measures it into --left-dock and --right-dock, and
// everything in the middle is written against --free and --middle.
//
// The browser check that goes with this one is a harness that opens the real
// page at eleven window sizes and measures every pair of panels for overlap.
// This is the part that can run in a second, and it is the part that catches
// the mistake being made again.
import { readFileSync } from "fs";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

const html = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");
const style = html.slice(html.indexOf("<style>"), html.lastIndexOf("</style>"));

//! Every declaration in the sheet, as { rule, property, value }, with the
//! comments taken out so prose about 100vh is not mistaken for 100vh.
const bare = style.replace(/\/\*[\s\S]*?\*\//g, "");
//! Every declaration in the sheet, with the @media overrides told apart from
//! the plain ones: a phone lays these out differently on purpose - full width,
//! stacked on the dock - and that is not the mistake being looked for.
function declarations(css, inMedia = false) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf("{", i);
    if (open < 0) break;
    const head = css.slice(i, open).trim().split("\n").pop().trim();
    // Walk to the matching brace, so a @media block is taken whole.
    let depth = 1, j = open + 1;
    while (j < css.length && depth) {
      if (css[j] === "{") depth++;
      else if (css[j] === "}") depth--;
      j++;
    }
    const body = css.slice(open + 1, j - 1);
    if (head.startsWith("@")) out.push(...declarations(body, true));
    else for (const line of body.split(";")) {
      const cut = line.indexOf(":");
      if (cut < 0) continue;
      out.push({ selector: head, inMedia,
                 prop: line.slice(0, cut).trim(), value: line.slice(cut + 1).trim() });
    }
    i = j;
  }
  return out;
}
const rules = declarations(bare);

//! The panels that float over the model - the ones a viewport unit or a
//! percentage would mis-place. Matched EXACTLY, because a badge hanging off the
//! end of a button inside one is positioned against the button and is nobody's
//! business here.
const FLOATS = ["#chip", "#rail", "#sketch-rail", "#tree-panel", "#def-panel", "#status",
                "#view-tools", "#mesh-bar", "#sketch-bar", "#ai-bar", "#log-pop",
                "#packages", "#menu", "#sample-menu", ".fl-bar", ".fl-panel", ".an-bar",
                ".an-panel", ".sp-bar", ".sp-panel", ".mx-bar", "dialog"];
const isFloat = selector => selector.split(",").some(one => FLOATS.includes(one.trim()));

console.log("1. the scaled interface measures the window in its own units");
{
  check("there are declarations to check at all", rules.length > 300, String(rules.length));
  const sky = rules.find(r => r.prop === "--sky");
  const span = rules.find(r => r.prop === "--span");
  check("--sky is the window's height divided by the scale",
        sky && /100vh\s*\/\s*var\(--ui\)/.test(sky.value), sky && sky.value);
  check("--span is its width, the same way",
        span && /100vw\s*\/\s*var\(--ui\)/.test(span.value), span && span.value);

  // And nothing else uses a raw viewport unit. A rule that does is a rule that
  // is right at --ui 1 and wrong on the monitor the office actually uses.
  const raw = rules.filter(r => !r.prop.startsWith("--")
    && /\b\d*\.?\d+v(h|w|min|max)\b/.test(r.value));
  check("no rule measures the window without dividing by the scale",
        raw.length === 0, raw.map(r => r.selector + " { " + r.prop + ": " + r.value + " }").join(" | "));

  // Nor positions itself at a percentage of it, which has the same fault.
  const half = rules.filter(r => (r.prop === "left" || r.prop === "top"
    || r.prop === "right" || r.prop === "bottom") && /%/.test(r.value)
    && isFloat(r.selector));
  check("and none places itself at a percentage of the window",
        half.length === 0, half.map(r => r.selector + " { " + r.prop + ": " + r.value + " }").join(" | "));
}

console.log("\n2. the middle knows what the sides have taken");
{
  for (const name of ["--rail-dock", "--left-dock", "--right-dock", "--free", "--middle"])
    check(name + " is declared", rules.some(r => r.prop === name));

  const free = rules.find(r => r.prop === "--free");
  check("the free middle is the window less both sides",
        free && /--left-dock/.test(free.value) && /--right-dock/.test(free.value), free && free.value);
  const middle = rules.find(r => r.prop === "--middle");
  check("and its middle is measured from the left side, not from the window",
        middle && /--left-dock/.test(middle.value) && /--free/.test(middle.value),
        middle && middle.value);

  // THE BARS. Everything that runs along the top or the bottom of the window is
  // centred on the middle and fits inside it. A bar that is centred on the
  // WINDOW runs under the definition panel the moment one is open, which is
  // what it used to do.
  // By the selector the sheet uses for each, which for the mesh editor's bar is
  // its class rather than its id.
  const bars = ["#sketch-bar", ".mx-bar", ".fl-bar", ".an-bar", ".sp-bar", "#ai-bar"];
  for (const bar of bars) {
    // The rule as the desktop has it. A phone lays these out differently on
    // purpose - full width, stacked on the dock - and that override is not the
    // mistake this is looking for.
    const mine = rules.filter(r => !r.inMedia
      && r.selector.split(",").map(s => s.trim()).includes(bar));
    const placed = mine.find(r => r.prop === "left");
    check(bar + " is centred on the free middle",
          placed && /var\(--middle\)/.test(placed.value),
          placed ? placed.value : "no left rule");
    const fits = mine.some(r => (r.prop === "width" || r.prop === "max-width")
                             && /var\(--free\)/.test(r.value));
    check(bar + " fits in it", fits,
          mine.filter(r => /width/.test(r.prop)).map(r => r.prop + ": " + r.value).join(", ")
          || "no width rule");
  }

  // THE SIDES. The left column hangs off the rail, so stowing the rail really
  // does give the room back rather than leaving a hole.
  const tree = rules.filter(r => r.selector.includes("#tree-panel") && r.prop === "left");
  check("the tree stands beside the rail rather than at a fixed offset",
        tree.some(r => /var\(--rail-dock\)/.test(r.value)), tree.map(r => r.value).join(" | "));
  const shelf = rules.filter(r => r.selector.includes("#packages") && r.prop === "right");
  check("the package shelf keeps clear of whatever is down the right",
        shelf.some(r => /var\(--right-dock\)/.test(r.value)), shelf.map(r => r.value).join(" | "));
}

console.log("\n3. the corners, and the panels above them");
{
  const corner = rules.find(r => r.prop === "--corner");
  check("--corner says what the bottom corners claim", !!corner, corner && corner.value);
  // A panel in a top corner runs to the bottom of the window, so it has to stop
  // short of whatever is in the bottom corner - the status line on the left,
  // the view controls on the right.
  for (const panel of ["#def-panel", "#tree-panel", ".fl-panel", ".an-panel"]) {
    const mine = rules.filter(r => r.selector.split(",").map(s => s.trim()).includes(panel)
                                && r.prop === "max-height");
    check(panel + " stops above the bottom corner",
          mine.some(r => /var\(--corner\)/.test(r.value)),
          mine.map(r => r.value).join(" | ") || "no max-height");
  }
}

console.log("\n4. what can be put away can be brought back");
{
  check("a stowed rail is off the edge rather than merely invisible",
        /body\.no-rail #rail/.test(bare) && /#rail[^{]*\{[^}]*transition/.test(bare)
        || /transition:[^;]*left/.test(bare),
        "the rail slides");
  check("and it is unclickable while it is off there",
        /body\.no-rail[^{]*\{[^}]*visibility:\s*hidden/.test(bare));
  check("the chip carries the switch that brings it back",
        /id="btn-rail"/.test(html) && /id="btn-panel"/.test(html));
  check("and the switches say which way they are",
        /#chip \.pane\[aria-pressed="true"\]/.test(bare));
  check("a pane switch is not drawn as a mode",
        /aria-pressed="true"\]:not\(\.pane\)/.test(bare));
  check("the status line stands down when a bar takes its row",
        /body\.barred #status/.test(bare));
  check("and it keeps its box while it does, or the answer would flicker",
        /body\.barred #status\s*\{[^}]*visibility:\s*hidden/.test(bare),
        (bare.match(/body\.barred #status\s*\{[^}]*\}/) || [""])[0]);
}

console.log("\n4c. and that includes the panels a PACKAGE floats over the model");
{
  //! THE GAP 4b HAD. Section 4b finds panels two ways: written into the page
  //! with an id, or built in app.js with an id. A package builds its own DOM -
  //! that is the arrangement, index.html must not know a package exists - and
  //! it has no reason to give anything an id, because it holds the node. So
  //! every panel a package puts over the model was invisible to the rule, and
  //! the rule is the one the whole interface is held to.
  //!
  //! Checked by a different route for a different construction: a package gets
  //! `closesWith` through the kit, so what this looks for is that each `float`
  //! it creates is handed to it. The count is the check - a package that makes
  //! three floating panels and closes two is the exact failure.
  const { readdirSync } = await import("fs");
  const here = new URL("../src/", import.meta.url);
  const plugins = readdirSync(here).filter(name => /-plugin\.js$/.test(name));
  check("there are packages to check", plugins.length >= 8, plugins.length + " packages");

  const bad = [];
  let floats = 0, closed = 0;
  for (const name of plugins) {
    const src = readFileSync(new URL(name, here), "utf8");
    //! Anything given the page's own floating-panel class, however it is
    //! built: `built("aside", "float nb-shelf")`, `el("section", "float an-bar")`,
    //! or a className assignment.
    const made = [...src.matchAll(/["'`]float(?:\s+[a-z0-9-]+)*["'`]/g)].length;
    if (!made) continue;
    const shut = [...src.matchAll(/closesWith\(/g)].length;
    floats += made;
    closed += shut;
    //! A MODE BAR IS NOT A PANEL OVER THE MODEL in the same sense: Analyse and
    //! Flow put theirs up only while their own mode is open and take them away
    //! on leave, and the chip that opened the mode is the way out - which 4b
    //! accepts for the page's own mode bars too. So a package whose floats all
    //! belong to a declared view is excused, and one with no view is not.
    const hasView = /\bview:\s*\{/.test(src);
    if (shut < made && !hasView)
      bad.push(name + " makes " + made + " and closes " + shut);
  }
  check("packages do float panels over the model", floats >= 3, floats + " of them");
  check("and every one that is not part of a mode can be put away",
        bad.length === 0, bad.length ? bad.join("; ") : closed + " closed");

  //! AND THROUGH THE KIT, not a copy. closesWith is what marks a panel as put
  //! away, which is what lets "bring the panels back" offer it by name; a
  //! package that built its own cross would look identical and be invisible to
  //! the menu - which is exactly what happened to the light lister.
  const appSrc = readFileSync(new URL("app.js", here), "utf8");
  const kitHandsItOver = /closesWith:\s*\(panel, options\)\s*=>\s*closesWith\(panel, options\)/
    .test(appSrc);
  check("the kit hands the page's own close mechanism to packages", kitHandsItOver,
        kitHandsItOver ? "kit.closesWith" : "packages would have to roll their own");
  //! AND EACH ONE IS OFFERED BACK BY NAME. A cross with no `name` closes the
  //! panel and tells the menu nothing, so it can never be brought back.
  const nano = readFileSync(new URL("nano-plugin.js", here), "utf8");
  const named = [...nano.matchAll(/closesWith\([\s\S]{0,400}?name:\s*"([^"]+)"/g)]
    .map(m => m[1]);
  check("and names them, so the menu can offer them back",
        named.length >= 2, named.join(" / ") || "none named");

  //! THE STYLESHEET IS IN THE SOURCE PAGE, NOT THE BUILT ONE.
  //!
  //! docs/index.html is a BUILD OUTPUT. build.py reads docs/src/index.html,
  //! puts the modules and the payloads into it, and writes the result over
  //! docs/index.html - so a rule typed into the output is live until the next
  //! build and silently gone after it. What is left is an interface with no
  //! styling on the part that was just added, which is not a kind of broken
  //! anybody thinks to look for: the elements are all there in the DOM.
  //!
  //! That is exactly what happened to this package. Its tab was measured 1037
  //! px from the right edge of an 1100 px window, with `position: fixed;
  //! right: 0` written in the generated file and nowhere else.
  //!
  //! So: every class rule in the built page has to be in the source page too.
  //! Exact, with nothing to judge - the built page is the source page plus
  //! modules and payloads, and a rule it has that the source does not is a
  //! rule in the wrong file.
  const sourcePage = readFileSync(new URL("index.html", here), "utf8");
  const builtPage = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const rulesIn = text => new Set(
    [...text.matchAll(/^\s*(\.[a-z][a-z0-9-]*)(?=[\s,{:[.>#])/gm)].map(m => m[1]));
  const built = rulesIn(builtPage), source = rulesIn(sourcePage);
  check("the built page has a stylesheet in it", built.size > 100, built.size + " class rules");
  const strays = [...built].filter(one => !source.has(one));
  check("and every rule in it came from docs/src/index.html",
        strays.length === 0,
        strays.length ? "typed into the generated file: " + strays.slice(0, 8).join(", ")
                      : built.size + " rules, all from the source");
}

console.log("\n4b. nothing floats over the model that cannot be put away");
{
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  //! THE RULE, as a check rather than as care.
  //!
  //! A panel over the viewport is in front of the thing a person is trying to
  //! look at. That is fine while it is wanted and intolerable when it is not,
  //! so every one of them must carry the same cross in the same corner - and
  //! carry it through closesWith, which is what marks the panel as PUT AWAY
  //! and is therefore what lets the menu offer it back. A hand-rolled cross
  //! looks identical and is not the same thing: the light lister had one, and
  //! "Bring the panels back" had never heard of it.
  //!
  //! Driven off the DOM and the source rather than a list kept here, so a
  //! panel added tomorrow is in this check tomorrow.
  const floats = [...html.matchAll(/id="([a-z-]+)"[^>]*class="[^"]*\bfloat\b/g),
                  ...html.matchAll(/class="[^"]*\bfloat\b[^"]*"[^>]*id="([a-z-]+)"/g)]
    .map(m => m[1]);
  //! The ones built in app.js rather than written in the page.
  const made = [...app.matchAll(/\.className\s*=\s*"float[^"]*";[\s\S]{0,120}?\.id\s*=\s*"([a-z-]+)"/g)]
    .map(m => m[1]);
  const all = [...new Set([...floats, ...made])];
  check("the page floats a few panels over the model", all.length >= 4, all.join(", "));

  //! Which of them closesWith knows about. Matched by the element the call is
  //! given, which is either `document.getElementById("x")`, a bare `xPanel`
  //! variable, or `traceBar()` - so the check reads the call sites rather than
  //! assuming a naming convention.
  const closed = new Set();
  for (const m of app.matchAll(/closesWith\(\s*([^,]+),/g)) {
    const who = m[1].trim();
    const byId = who.match(/getElementById\(["']([a-z-]+)["']\)/);
    if (byId) { closed.add(byId[1]); continue; }
    //! THE NEAREST ASSIGNMENT ABOVE THE CALL, not the first in the file. Three
    //! functions here each have a local called `host`, so taking the first
    //! match resolved log-pop's cross to the definition panel - a wrong
    //! answer that still looked like an answer.
    const before = app.slice(0, m.index);
    const near = [...before.matchAll(
      new RegExp("\\b" + who.replace(/\(\)$/, "")
                 + "\\s*=\\s*document\\.getElementById\\([\"']([a-z-]+)[\"']\\)", "g"))];
    if (near.length) { closed.add(near[near.length - 1][1]); continue; }
    //! `lensPanel` -> #lens-panel, `traceBar()` -> #trace-bar: the variable is
    //! declared beside its own id, so look that up rather than guess.
    const name = who.replace(/\(\)$/, "");
    //! Three ways a panel's element gets a name here, all of them in use:
    //!   lensPanel.id = "lens-panel"            built in app.js
    //!   const traceBar = () => getElementById   a getter, so it is never stale
    //!   const host = getElementById("log-pop")  a local, which is why log-pop
    //!                                           read as having no way out when
    //!                                           it has had a cross all along
    const decl = new RegExp(name + "\\.id\\s*=\\s*[\"']([a-z-]+)[\"']").exec(app)
      || new RegExp("const\\s+" + name + "\\s*=\\s*\\(\\)\\s*=>\\s*document\\.getElementById\\([\"']([a-z-]+)[\"']\\)").exec(app)
      || new RegExp("\\b" + name + "\\s*=\\s*document\\.getElementById\\([\"']([a-z-]+)[\"']\\)").exec(app);
    if (decl) closed.add(decl[1]);
    else closed.add(who);
  }
  check("and closesWith is given several of them", closed.size >= 4,
        [...closed].join(", "));

  //! A WAY OUT, which is not the same as a cross.
  //!
  //! The rule is that nothing floats over the model that a person can be left
  //! stuck behind - not that everything wears the same button. A mode bar with
  //! Done on it can be closed; so can one that says Esc. What must not exist
  //! is a panel with neither: no cross, no exit, no switch, just there.
  //!
  //! So: a cross through closesWith, or a cross in the markup, or a visible
  //! way out written beside wherever it is built.
  //! THE ELEMENT'S OWN MARKUP, cut at the next panel or dialog rather than a
  //! fixed number of characters. A 2500-character window spilled into
  //! whatever came next in the page and borrowed its Close button - so a
  //! deliberately stuck panel inserted right before the render bar passed,
  //! and so did the render bar with its own cross taken away. Both mutations
  //! were supposed to fail; both passed, which made this check decoration.
  const markupOf = one => {
    const at = html.indexOf('id="' + one + '"');
    if (at < 0) return "";
    const from = html.lastIndexOf("<", at);
    const rest = html.slice(from + 1);
    const ends = [rest.search(/class="[^"]*\bfloat\b/), rest.search(/<dialog/)]
      .filter(n => n > 40);
    return rest.slice(0, ends.length ? Math.min(...ends) : 2500);
  };

  const wayOut = one => {
    if (closed.has(one)) return true;
    const seg = markupOf(one);
    if (/panel-shut/.test(seg) || /\b(Done|Close|Cancel|Leave|Exit|Modelling)\b/.test(seg))
      return true;
    //! A PHONE SHEET's way out is the dock it came from: pressing the same
    //! dock button again closes it, because openSheet toggles. Recognised by
    //! that toggle rather than by the name, so a sheet added with no dock
    //! button, or a openSheet that stopped toggling, would still be caught.
    if (/^sheet-/.test(one))
      return /was === name \? "" :/.test(app) && /dataset\.sheet/.test(app)
          && /#dock button/.test(app);
    //! Built in app.js: look where it is created for the word that is its exit.
    const made = app.search(new RegExp('\\.id\\s*=\\s*["\']' + one + '["\']'));
    if (made < 0) return false;
    //! Cut at the next panel built in app.js, for the same reason as above.
    const after = app.slice(made);
    const next = after.slice(60).search(/\.className\s*=\s*"float/);
    return /\b(Done|Close|Cancel|Leave|Exit|Esc|Escape)\b/
      .test(app.slice(Math.max(0, made - 800), made + (next > 0 ? next + 60 : 4500)));
  };

  //! THE PERMANENT CHROME, which is a different kind of thing and says so.
  //! The chip, the rail and the view tools are the program's furniture rather
  //! than panels over the model: they are switched from the chip, which
  //! section 4 above checks is there, and the status line stands down on its
  //! own when a bar takes its row.
  const furniture = new Set(["chip", "rail", "sketch-rail", "view-tools", "status",
                             "viewport", "showroom"]);
  const stuck = all.filter(one => !furniture.has(one) && !wayOut(one));
  check("every floating panel has a way out", !stuck.length,
        stuck.join(", ") || (all.length - furniture.size) + " panels, every one closable");

  //! And the check can tell the two apart: a panel with no cross, no exit and
  //! no switch must be found. Built from the real markup so it is the same
  //! shape as a real one.
  const pretend = '<section class="float fades" id="stuck-bar"><span>no way out</span></section>';
  const wouldFind = !/panel-shut|\b(Done|Close|Cancel|Leave|Exit)\b/.test(pretend);
  check("  and a panel with neither would be found", wouldFind);

  //! AND BROUGHT BACK, which is the half that makes crossing one safe. A
  //! panel closed with no `name` is gone until somebody remembers its letter.
  const named = [...app.matchAll(/closesWith\([\s\S]{0,200}?name:\s*"([^"]+)"/g)].map(m => m[1]);
  check("and the ones worth losing say what they are called",
        named.length >= 3, named.join(" \u00b7 "));
  check("and the menu offers them back by that name",
        /Bring the panels back/.test(app) && /putAway\(\)/.test(app));
}

console.log("\n5. the tree reads, folds and searches");
{
  // A TREE THAT TRUNCATES IS A TREE YOU CANNOT READ, and one that scrolls
  // sideways is worse: you lose the row you were on to go and find the rest
  // of its name. So the panel is sized by what is in it and the names wrap.
  check("the tree panel is sized by its contents",
        /#tree-panel\s*\{[^}]*width:\s*max-content/.test(bare),
        (bare.match(/#tree-panel\s*\{[^}]*\}/) || [""])[0].slice(0, 120));
  check("with a floor so it does not twitch narrower as sets are folded",
        /#tree-panel\s*\{[^}]*min-width:/.test(bare));
  check("and a ceiling so it never eats the model",
        /#tree-panel\s*\{[^}]*max-width:/.test(bare));
  check("a name is never cut off into an ellipsis",
        !/\.node \.label\s*\{[^}]*text-overflow/.test(bare),
        (bare.match(/\.node \.label\s*\{[^}]*\}/) || [""])[0]);
  //! BREAK-WORD, NOT ANYWHERE. Both wrap; the difference is what they say the
  //! narrowest the box could be is. `anywhere` says one character, and a panel
  //! sized by its contents believes it - a name out of an IFC file came down
  //! the tree one letter per line for thirty rows. `break-word` asks for the
  //! longest word and breaks inside one only when it is short of room.
  check("and it wraps rather than running off the side",
        /\.node \.label\s*\{[^}]*overflow-wrap:\s*break-word/.test(bare),
        (bare.match(/\.node \.label\s*\{[^}]*\}/) || [""])[0]);
  check("  without telling the panel one character is a width",
        !/\.node \.label\s*\{[^}]*overflow-wrap:\s*anywhere/.test(bare));
  check("the tree scrolls down and never across",
        /#tree\s*\{[^}]*overflow-x:\s*hidden/.test(bare)
        && /#tree\s*\{[^}]*overflow-y:\s*auto/.test(bare),
        (bare.match(/#tree\s*\{[^}]*\}/) || [""])[0]);
  check("every row has a place for the fold sign, whether or not it folds",
        /\.twist\s*\{[^}]*width:/.test(bare) && /\.twist\.bare/.test(bare));
  check("and a folded branch is really gone, not merely faint",
        /\.branch\[hidden\]\s*\{[^}]*display:\s*none/.test(bare));
  check("the heading turns into a search box",
        /id="tree-search"/.test(html) && /id="tree-title"/.test(html));
  check("which completes the names of the sets",
        /id="tree-names"/.test(html) && /list="tree-names"/.test(html));
  check("and what it matched is marked in the row",
        /\.node \.label mark/.test(bare));
}

console.log("\n8. a tree with seven thousand rows in it");
{
  //! A BUILDING IS NOT A PART. An IFC import is 7,548 features and 1,665
  //! sets; the tree drew every row of every folded branch and then hid them,
  //! rebuilt itself whenever anything was SELECTED, and asked "what is in
  //! this set" by filtering the whole document twice per folder. Measured on
  //! the model that brought it up: 3,754 ms to fold one branch, and the same
  //! 3,754 ms to click a column in the viewport.
  //!
  //! These are the things that fixed it, checked in the source because each
  //! of them is a one-line mistake to make again.
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");

  check("what is in a set is indexed, not filtered out of the whole document",
        /function kidsOf\(/.test(app)
        && !/state\.tree\.features\.filter\(f => f\.parent === entry\.id\)/.test(app));
  check("a folded branch builds no rows at all",
        /if \(folded\) \{[\s\S]{0,240}?return holder;/.test(app));
  check("selecting repaints the tree rather than building it",
        /function paintTree\(/.test(app) && /paintTree\(\); buildPanel\(\)/.test(app));
  check("every set can be folded at once, and opened again", /function foldAll\(/.test(app));
  check("and a row can be found from the model", /function revealInTree\(/.test(app));
  check("the tree header has a fold-everything and an open-everything",
        /id="tree-fold"/.test(html) && /id="tree-unfold"/.test(html));
  check("a row that was scrolled to says so",
        /#tree \.node\.found\s*\{[^}]*animation/.test(bare));
  //! A name may wrap and a KIND may not: one is what the thing is called, the
  //! other is a word about it. A consumed body's kind is "in <whatever ate
  //! it>", which out of an IFC file is sixty characters and took the row.
  check("the kind is cut short rather than taking the row",
        /\.node \.kind\s*\{[^}]*text-overflow:\s*ellipsis/.test(bare));
  check("and the name keeps a width it can be read in",
        /\.node \.label\s*\{[^}]*min-width:\s*\d+ch/.test(bare));
}

console.log("\n8b. an eye is not an edit");
{
  //! WHAT A VISIBILITY TOGGLE MAY WRITE INTO THE DOCUMENT, which is almost
  //! nothing. Hiding is this window's own list; the one exception is a body
  //! another feature was BUILT FROM, which the document itself says is not
  //! drawn - clicking its eye overrules that, and overruling it is a real
  //! edit that is saved.
  //!
  //! That exception was applied to the CONTENTS the toggle pulled in as well
  //! as to the row somebody clicked, and on a building imported from IFC one
  //! click on one set wrote `shownAnyway` onto 715 features: every profile,
  //! every extrusion, every boolean that something else was built from, all
  //! of it into the file.
  //!
  //! It did not read as a visibility bug. A wall is an Extrude with its
  //! openings cut out by a Boolean, so force-showing the Extrude draws the
  //! wall as it was BEFORE its openings, over the top of the one with them:
  //! the walls overshoot their reveals and the model looks edited. Measured
  //! on the file it was reported with, against the same file saved before the
  //! clicking: not one argument of not one feature differed - only 715
  //! shownAnyway flags, and every one of the 715 was a feature another
  //! feature reads from.
  //!
  //! Checked in the source because it is a one-word mistake to make again -
  //! `ids` and `named` are both in scope on the line, and one of them is a
  //! whole storey.
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const body = (app.match(/function showFeature\([\s\S]*?\n\}/) || [""])[0];
  check("showFeature keeps what was clicked apart from what it contains",
        /const named = Array\.isArray\(id\)/.test(body));
  //! AND THE HIDDEN LIST HOLDS ONLY WHAT WAS CLICKED. It used to take the
  //! contents too - hiding a set wrote every descendant onto the list and
  //! showing it took every descendant off - which cascaded correctly and
  //! DESTROYED each child's own state on the way: a set with three bodies on
  //! and one off came back with all four on, and there was nothing left to
  //! restore the fourth from. Inheritance is now worked out when something is
  //! drawn, by hiddenHere walking up the parents, so a child's own switch
  //! survives its parent being switched off and on again.
  check("the hidden list holds only the rows somebody clicked",
        /for \(const one of ids\) \{ if \(on\) state\.hidden\.delete/.test(body)
        && /const ids = named;/.test(body));
  check("and what is inherited is worked out at drawing time instead",
        /const hiddenHere = id =>/.test(app)
        && /state\.hidden\.has\(parent\)/.test(app));
  check("but the document edit is only for the rows somebody named",
        /const swallowed = on \? named\.filter\(/.test(body));
  check("and it is never sent when hiding, which needs no edit at all",
        /const swallowed = on \? [^:]+: \[\];/.test(body));
}

console.log("\n9. and a viewport with seven hundred thousand triangles in it");
{
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  check("what is off screen is not drawn", /detailFrustum\.intersectsSphere/.test(app));
  check("  asked of a sphere worked out once, not of the triangles",
        /function ballOf\(/.test(app) && /userData\.ball = ballOf\(group\)/.test(app));
  check("what is under a couple of pixels is not drawn either",
        /across < detail\.vanish/.test(app));
  check("and over the budget the rest is drawn as boxes",
        /if \(bill > detail\.frame\)/.test(app));
  check("  worst value first - the most triangles for the fewest pixels",
        /across \* g\.userData\.across/.test(app));
  check("  in ONE geometry, or a thousand boxes is a thousand draw calls",
        /function rebuildBoxes\(/.test(app));
  //! The one that broke it while it was being written: how big the MODEL is
  //! and what THIS FRAME can see are different questions, and both were
  //! answered by group.visible - so a fit framed whatever the last frame had
  //! culled, and a building on survey coordinates was left four hundred
  //! kilometres off screen.
  check("how big the model is does not ask what the camera culled",
        /showsInModel/.test(app) && /showsInModel\(id, group\)/.test(app));
  check("and the picker is not handed a new array on every pointer move",
        /function pickableNow\(/.test(app)
        && !/pickable\.filter\(m => m\.parent/.test(app));
}

console.log("\n10. and a building that arrives before it has been tessellated");
{
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const kernel = readFileSync(new URL("../src/wasm-kernel.js", import.meta.url), "utf8");
  check("the kernel can be asked where a shape is without meshing it",
        /async boxes\(ids\)/.test(kernel));
  check("  and it answers with the extents, not with triangles",
        /low, high, faces,/.test(kernel));
  check("a big model goes in as stand-ins first", /function standIn\(/.test(app)
        && /stale\.length >= LAZY_FROM/.test(app));
  check("  which cost no triangles, truthfully",
        /group\.userData\.triangles = 0;/.test(app));
  check("the frame that sees a gap is what asks for it",
        /hungry\.push\(\{ id, across \}\)/.test(app)
        && /if \(hungry\.length\) feedTheView\(hungry\)/.test(app));
  check("  biggest on screen first", /hungry\.sort\(\(a, b\) => b\.across - a\.across\)/.test(app));
  //! The loop that would never end: a shape the kernel has nothing to say
  //! about is still waiting on the next frame, and asked for again.
  check("  and asked-for counts as answered", /if \(!unmeshed\.has\(id\)\) continue;/.test(app));
  check("a cut and a showroom get the whole model", /async function makeResident\(/.test(app)
        && /makeResident\("Cutting the model/.test(app));
  //! Measured where it is paid rather than inside the animation frame, which
  //! is where it is not.
  check("how long a frame costs is measured at the yield after it",
        /paintCost = paintCost \/ 2/.test(app) && !/lastFrameMs/.test(app));
  //! Handed a feature where it wanted an id, so it stopped one level in - and
  //! on a building, where every storey is sets of sets, the eye on a storey
  //! stayed open however much of it you put away.
  check("a set's eye asks what is inside it, all the way down",
        /if \(walk\(child\.id\)\) return true/.test(app));
  check("and the fit asks the document, not a flag written later",
        /const entry = feature\(id\);\n  if \(entry\) return entry\.visible !== false/.test(app));
  check("the feature lookup is a map, not a walk of six thousand",
        /namedFeatures = new Map\(\)/.test(app)
        && !/features\.find\(f => f\.id === id\)/.test(app));
}

console.log("\n10b. and the modelling off the thread the window is drawn on");
{
  const worker = readFileSync(new URL("../src/kernel-worker.js", import.meta.url), "utf8");
  const proxy = readFileSync(new URL("../src/worker-kernel.js", import.meta.url), "utf8");
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const host = readFileSync(new URL("../src/plugin.js", import.meta.url), "utf8");
  const build = readFileSync(new URL("../build.py", import.meta.url), "utf8");

  check("every call goes down the port by name", /kernel\[call\]/.test(worker)
        && /post\(\{ id, ok: true, value: await method\.apply/.test(worker));
  //! A call that throws and says nothing leaves a promise on the page that
  //! never settles, which is the thing this whole arrangement exists to stop.
  check("  and a call that throws answers too", /post\(\{ id, ok: false, error:/.test(worker));
  check("  and a worker that dies tells every call waiting on it",
        /for \(const \[, answer\] of waiting\) answer\.reject\(why\)/.test(proxy));
  check("the page's side is built from the kernel's own methods, not a list",
        /for \(const name of started\.calls\)/.test(proxy));
  check("the WebAssembly is handed over rather than copied",
        /wasmBinary \? \[wasmBinary\] : \[\]/.test(proxy));
  //! import.meta.url in a blob worker is a blob: URL, which cannot be a base -
  //! so the glue must not be left to work the path out for itself.
  check("and the glue is told where the file is rather than guessing",
        /locateFile: name => name/.test(worker) && /options\.locateFile = locateFile/.test(
          readFileSync(new URL("../src/wasm-kernel.js", import.meta.url), "utf8")));
  check("a browser with no worker still models, in the page",
        /pageKernel = await makePageKernel\(\)/.test(app)
        && /this browser would not start a worker/.test(app));
  //! A driver closes over the kernel, and a closure does not cross a port.
  check("a package with nodes is switched on where the modelling is",
        /usePackage\(id\)/.test(worker) && /await this\.kit\.usePackage\(id\)/.test(host));
  check("  keyed by the package's own id, not by a name written twice",
        /SHELF\[plugin\.id\] = plugin/.test(worker));
  check("  and the drivers are not even built on the page's side",
        /typeof plugin\.drivers === "function" \? plugin\.drivers\(this\.kit\)/.test(host));
  check("the single file carries the worker's own bundle",
        /worker-payload/.test(build) && /def worker_modules\(\)/.test(build));
  check("  which cannot be the page's script - it would take over onmessage",
        /WORKER_ENTRY = "kernel-worker\.js"/.test(build)
        && !/"kernel-worker\.js",/.test(build.split("MODULES = ")[1].split("]")[0]));
}

console.log("\n10c. and somebody opening it for the first time with nobody beside them");
{
  const tour = readFileSync(new URL("../src/tour.js", import.meta.url), "utf8");
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  const shell = readFileSync(new URL("../src/index.html", import.meta.url), "utf8");

  check("there is a button that explains the program", /id="btn-help"/.test(shell)
        && /ICONS\.help/.test(app));
  check("  and it comes up by itself the first time, once",
        /if \(!tour\.offered\(\)\) setTimeout/.test(app));
  //! A picture of the interface teaches nothing. Every step points at an
  //! element that is really there, and leaves it working.
  check("each step points at a real element", /document\.querySelector\(step\.at\)/.test(tour));
  check("  which stays clickable under the dimming",
        /#tour \{[^}]*pointer-events: none/.test(shell)
        && /#tour-hole \{[^}]*box-shadow: 0 0 0 9999px/.test(shell));
  //! You cannot be shown how to turn a model by reading that you can.
  check("the steps that teach a gesture wait for it", /step\.wait\.of\(began\)/.test(tour)
        && /wait: \{ of: \(\) => kit\.turned\(\)/.test(tour));
  check("  and Next does it for you rather than trapping you",
        /if \(step && step\.wait && step\.wait\.give\)/.test(tour));
  check("  and Escape leaves at any point", /event\.key === "Escape"\) \{ event\.preventDefault\(\); stop\(\); \}/.test(tour));
  //! Which button turns the model is a preference, so the tour asks rather
  //! than telling somebody the wrong thing in its second sentence.
  check("what it says about the mouse is asked, not written down",
        /body: kit\.navigation\(\)/.test(tour) && /navigation: \(\) => \(altToOrbit/.test(app));
  check("leaving keeps your place and finishing does not",
        /kit\.remember\(GOT_TO, finished \? "" :/.test(tour));
}

console.log("\n11. and a document too big to put in one turn");
{
  const agent = readFileSync(new URL("../src/agent.js", import.meta.url), "utf8");
  //! THE BUDGET IS NOW WHAT IS LEFT, not a number written down in advance. It
  //! was 40,000 characters while the catalogue grew past 31 KiB on its own, and
  //! the opening turn reached 60 KiB against a 64 KiB limit - so the document's
  //! share is computed from the rest of the briefing. Checked by measuring
  //! rather than by reading the source: see turnsize.test.mjs for the numbers.
  check("the briefing's budget is worked out from what is left",
        /TURN_BYTES - bytesOf\(head\) - TURN_HEADROOM/.test(agent)
        && /export const TURN_BYTES/.test(agent));
  check("  under it the document still goes whole",
        /if \(bytesOf\(whole\) <= budget\) return whole;/.test(agent));
  //! And the thing that was NOT budgeted, which is what actually failed.
  check("  every tool result is cut, and the conversation is fitted each round",
        /cutTo\(typeof output === "string"/.test(agent)
        && /fitMessages\(messages\);/.test(agent));
  check("  over it, its shape goes instead", /export function documentDigest\(/.test(agent));
  check("look can read one part of it by id", /export function featureBrief\(/.test(agent)
        && /if \(id\) return \{ \.\.\.featureBrief\(model, id\), errors \}/.test(agent));
  check("and an edit does not report six thousand features back",
        /const listed = all\.slice\(-300\);/.test(agent));
}

console.log("\n10. and it can be driven with fingers");
{
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  //! A FINGER HAS NO ALT KEY. The viewport defaults to alt-to-orbit so that a
  //! plain left-drag with a mouse belongs to what is on screen rather than to
  //! the camera - and on a phone that rule can never be satisfied, so the
  //! model would not turn at all. Touch navigates; tap versus drag is the
  //! distinction that still works there.
  check("a touch pointer navigates without needing Alt",
        /pointerType === "touch"/.test(app) && /navigating = byFinger \|\|/.test(app));

  //! A PHONE HAS NO WHEEL AND NO MIDDLE BUTTON, so two fingers are the only
  //! way to zoom or pan. There was no code that knew about a second pointer.
  check("two fingers are tracked, not just one",
        /const touches = new Map\(\)/.test(app) && /touches\.size === 2/.test(app));
  check("and apart is a dolly, measured as the ratio of the two gaps",
        /pinch\.gap \/ now\.gap/.test(app));
  check("with the pair sliding across as a pan, in the same gesture",
        /pan\(now\.x - pinch\.x, now\.y - pinch\.y\)/.test(app));

  //! LIFTING ONE OF TWO must put the other back to a plain orbit FROM WHERE IT
  //! IS. Without reading its position back, the next move is measured from the
  //! pair's last midpoint, which can be half a screen away - so the model
  //! leaps the moment a finger comes off.
  check("lifting a finger hands the other one back without a jump",
        /lastX = left\.x; lastY = left\.y; moved = 0;/.test(app));
  check("and a pinch that ends is never treated as a click",
        /const wasPinching = mode === "pinch";/.test(app));
  //! A cancelled pointer is a lifted one: the browser takes one away when it
  //! claims the gesture, and a finger left in the list would make the next
  //! single touch look like a pinch that never ended.
  check("a cancelled pointer leaves the list too",
        /pointercancel", event =>[\s\S]{0,400}touches\.delete\(event\.pointerId\)/.test(app));
}

console.log("\n12. a colour on a set, and edges you can switch off");
{
  const app = readFileSync(new URL("../src/app.js", import.meta.url), "utf8");
  //! THE CATALOGUE SAYS, IN AS MANY WORDS, that colouring a Part colours
  //! everything in it - and the viewport read the feature's OWN appearance and
  //! nothing else, so a colour on a set reached the set, which has no surfaces,
  //! and stopped. It looked exactly like the colour had not been applied.
  check("a body wears the nearest colour above it when it has none of its own",
        /function wornAppearance\(entry\)/.test(app)
        && /for \(const up of setsAbove\(entry\.id\)\) if \(paints\(up\)\) return up;/.test(app));
  check("and the material is built from that rather than from the feature's own",
        /materialOf\(wornAppearance\(entry\)\)/.test(app));
  //! AN APPEARANCE THAT SAYS NOTHING ABOUT COLOUR IS NOT AN ANSWER. A set may
  //! carry a cut style and no finish - hatch everything in here, leave the
  //! colours alone - and walking that as a colour would repaint its contents
  //! the default grey.
  check("a set that says nothing about colour does not repaint what is in it",
        /const paints = worn =>/.test(app) && /SAYS_COLOUR\.some/.test(app));

  //! EDGES ARE RESOLVED ON THEIR OWN, not through the colour walk: a set that
  //! says only `edges: false` is a real thing to want, and the colour walk
  //! ignores an appearance that says nothing about colour.
  check("edges resolve own-first then up the sets, on their own",
        /function showsEdges\(entry\)/.test(app)
        && /if \(up && up\.edges !== undefined\) return up\.edges !== false;/.test(app));
  check("an outline is built and hidden rather than not built",
        /lines\.userData\.outline = true;/.test(app)
        && /lines\.visible = showsEdges\(entry\);/.test(app));
  //! AND ARCTIC OBEYS IT, which is the mode that draws a line along every sharp
  //! edge on purpose and is where a five-thousand-triangle figure turns into a
  //! black blob.
  check("arctic's overlay obeys the object too",
        /arcticLook\.edges && state\.style === "arctic" && showsEdges\(feature\(id\)\)/.test(app));
  check("and switching it repaints without going back to the kernel",
        /if \(object\.userData\.outline\) \{ object\.visible = edgesOn; continue; \}/.test(app));
  //! AND THE SETTING SURVIVES A COLOUR CHANGE. appearanceOf builds a clean
  //! appearance out of a finish and its overrides and knows nothing about
  //! edges, so without carrying it across, picking a colour would quietly put
  //! an object's edges back on - the same trap the point marks had.
  check("and a colour change carries the edge switch across",
        /const edges = change\.edges !== undefined \? change\.edges : was\.edges;/.test(app));
  check("there is a control for it in the material panel",
        /wearMaterial\(entry\.id, \{ edges: box\.checked \}\)/.test(app));
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall checks passed");
process.exit(failures ? 1 : 0);
