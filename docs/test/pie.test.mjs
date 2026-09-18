// A menu whose items are places.
//
// Two things are worth checking about a marking menu and neither of them is
// that it appears. The first is the geometry: north has to be north, the wedge
// under a flick has to be the wedge the flick was aimed at, and the dead zone
// in the middle has to mean nothing. The second is what is IN it - because the
// claim being made is that the whole program is reachable from here, and that
// is a claim you can check item by item rather than believe.
import { PIE_DEAD, PIE_MAX, chipAt, operationsFor, paged, pieAngle, pieMenu,
         ringLayout, wedgeAt } from "../src/pie.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

//! Walk a menu tree and hand back every leaf, with the path to it - which is
//! how "can this program still do X" gets asked of a tree of rings.
const leaves = (items, path = []) => items.flatMap(item => item.items
  ? leaves(item.items, [...path, item.label])
  : [{ path: [...path, item.label].join(" › "), label: item.label, item }]);
const has = (items, name) => leaves(items).some(l => new RegExp(name, "i").test(l.path));
const labels = items => items.map(i => i.label);

console.log("1. north is north, and a flick lands where it was aimed");
{
  const eight = ringLayout(8);
  check("a ring of eight starts at north", near(eight[0].mid, 0));
  check("and goes clockwise, east second", near(eight[2].mid, Math.PI / 2));
  check("with every wedge the same size",
        eight.every(w => near(w.to - w.from, Math.PI / 4)));

  // Screen coordinates: y grows downwards, so north is negative y.
  check("straight up is north", near(pieAngle(0, -100), 0));
  check("straight right is a quarter turn", near(pieAngle(100, 0), Math.PI / 2));
  check("straight down is half", near(pieAngle(0, 100), Math.PI));
  check("straight left is three quarters", near(pieAngle(-100, 0), Math.PI * 1.5));

  check("a flick north picks the first item", wedgeAt(8, 0, -100) === 0);
  check("a flick east picks the third", wedgeAt(8, 100, 0) === 2);
  check("a flick south picks the fifth", wedgeAt(8, 0, 100) === 4);
  check("a flick west picks the seventh", wedgeAt(8, -100, 0) === 6);
  // The boundary case that matters: just past the top of the last wedge has to
  // come round to the first, not fall off the end of the ring.
  check("just west of north comes back round to north", wedgeAt(8, -1, -100) === 0);
  check("and a wedge either side of a boundary is one or the other",
        wedgeAt(8, 60, -100) === 1 && wedgeAt(8, 100, -60) === 1);

  check("the middle picks nothing", wedgeAt(8, 0, 0) === -1);
  check("and so does anything inside the dead zone",
        wedgeAt(8, PIE_DEAD - 2, 0) === -1 && wedgeAt(8, 0, -(PIE_DEAD - 2)) === -1);
  check("but a pixel past it does not", wedgeAt(8, 0, -(PIE_DEAD + 2)) === 0);
  check("an empty ring has no wedges to pick", wedgeAt(0, 0, -100) === -1);

  // The chips sit on an ellipse, because words are wider than they are tall.
  const east = chipAt(Math.PI / 2), north = chipAt(0);
  check("a chip to the east is pushed further out than one to the north",
        east.r > north.r + 40, east.r.toFixed(0) + " vs " + north.r.toFixed(0));
  check("north is straight up", near(north.x, 0, 1e-9) && north.y < 0);
  check("east is straight out", near(east.y, 0, 1e-9) && east.x > 0);
}

console.log("\n2. a list too long for one ring spills, and the first places hold");
{
  const many = Array.from({ length: 30 }, (_, i) => ({ label: "n" + i, run() {} }));
  const ring = paged(many);
  check("one ring never holds more than it can aim at", ring.length <= PIE_MAX,
        String(ring.length));
  check("the last wedge is the way on", !!ring[ring.length - 1].items,
        ring[ring.length - 1].label);
  check("and the ones before it are the first of the list in order",
        ring.slice(0, PIE_MAX - 1).every((item, i) => item.label === "n" + i));
  check("nothing is lost on the way", leaves(ring).length === 30,
        String(leaves(ring).length));
  // The rule the whole menu rests on: adding to the end of a long list does not
  // move anything already placed.
  const longer = paged([...many, { label: "n30", run() {} }]);
  check("and a longer list leaves every place it already had alone",
        labels(longer).slice(0, PIE_MAX - 1).join() === labels(ring).slice(0, PIE_MAX - 1).join());
  check("a list that fits is left exactly as it is",
        paged(many.slice(0, 5)).length === 5);
}

/* A document, as the menu is handed one. Small enough to read, with one of
   everything the menu asks about. */
const SCHEMA = [
  { type: "Point", category: "datum", summary: "A location in space. More words." },
  { type: "Plane", category: "datum", summary: "A planar datum" },
  { type: "Sketch", category: "curve", summary: "A 2D drawing on a plane" },
  { type: "Cube", category: "body", summary: "A box" },
  { type: "Pad", category: "operation", summary: "Extrude a profile",
    args: [{ key: "profile", kind: "ref", accepts: "curve", consumes: true }] },
  { type: "Fillet", category: "operation", summary: "Round the edges",
    args: [{ key: "of", kind: "ref", accepts: "solid", consumes: true }] },
  { type: "Imported", category: "body", hidden: true, summary: "never offered" },
];
const ran = [];
const act = new Proxy({}, { get: (_, key) => (...args) => ran.push(key + "(" + args.join() + ")") });
const world = (extra = {}) => ({
  selected: null, containers: [], types: SCHEMA,
  categories: [{ key: "datum", label: "Datums" }, { key: "curve", label: "Curves" },
               { key: "body", label: "Bodies" }, { key: "operation", label: "Operations" }],
  accepts: (accepts, entry) => String(accepts).split(",").includes(entry.produces),
  formats: [{ key: "step", name: "STEP", read: true, write: true, short: "solids" },
            { key: "dxf", name: "DXF", read: true, write: true, short: "drawings" }],
  styles: [{ key: "shaded", label: "Shaded", summary: "For modelling. Grey." },
           { key: "arctic", label: "Arctic", summary: "Form, and nothing else." }],
  style: "shaded",
  modes: [], mode: null, packages: { loaded: [], available: [] },
  staging: false, sketching: null, sketchTools: [], relations: [],
  stage: {}, bare: false, tree: true, panel: false,
  can: { undo: true, redo: false },
  act, ...extra,
});

console.log("\n3. with nothing selected, everything the program does is in there");
{
  const ring = pieMenu(world());
  check("the ring fits on the screen", ring.length <= PIE_MAX, labels(ring).join(" · "));
  for (const [what, where] of [
    ["a node to add", "Add › Datums › Point"],
    ["a body", "Add › Bodies › Cube"],
    ["fitting the view", "View › Fit"],
    ["a standard view", "View › Top"],
    ["a graphic style", "Style › Arctic"],
    ["the showroom", "Showroom"],
    ["the node graph", "Nodes"],
    ["ai", "AI"],
    ["the packages shelf", "Packages › The shelf"],
    ["opening a file", "Document › Open a file"],
    ["exporting", "Document › Export › STEP"],
    ["the model file", "Document › Model file"],
    ["samples", "Document › Samples"],
    ["undo", "Document › Undo"],
    ["full screen", "Interface › Full screen"],
    ["the tree", "Interface › Specification tree"],
  ]) check(what + " is reachable", has(ring, where.replace(/ › /g, ".*")), where);

  check("a node nobody adds by hand is not offered", !has(ring, "Imported"));
  check("redo is not offered when there is nothing to redo", !has(ring, "Redo"));
  check("and nothing about a selection is offered when there is none",
        !has(ring, "Delete") && !has(ring, "Apply"));

  // The items are places, so the order they come in is the whole contract.
  check("Add is always the first place", ring[0].label === "Add", ring[0].label);
}

console.log("\n4. and it is contextual");
{
  const profile = { id: "SK1", name: "Sketch.1", produces: "curve", category: "curve" };
  const ring = pieMenu(world({ selected: profile,
    containers: [{ id: "BO1", name: "PartBody", type: "Body" },
                 { id: "GS1", name: "Set.1", type: "GeometricalSet" }] }));
  check("what can be done to it comes with it", has(ring, "Apply.*Pad"), labels(ring).join(" · "));
  check("and what cannot does not", !has(ring, "Apply.*Fillet"),
        "a Fillet takes a solid, and this is a curve");
  check("its definition is one flick away", has(ring, "Edit.*Definition"));
  check("so is deleting it", has(ring, "Edit.*Delete"));
  check("so is filing it in a set", has(ring, "Edit.*Move into.*PartBody"));
  check("hiding it is there too", has(ring, "Edit.*Hide"));
  check("and Add has not moved", ring[0].label === "Add");

  const solid = { id: "PA1", name: "Pad.1", produces: "solid", category: "body" };
  const onSolid = pieMenu(world({ selected: solid }));
  check("a solid is offered the operations a solid takes", has(onSolid, "Apply.*Fillet"));
  check("and not the ones it does not", !has(onSolid, "Apply.*Pad"));
  check("a body already eaten by something is offered nothing to do to it",
        operationsFor(world({ selected: { ...solid, consumedBy: "FI1" } })).length === 0);

  const shown = pieMenu(world({ selected: solid, hidden: true }));
  check("something hidden is offered showing, not hiding", has(shown, "Edit.*Show"));
}

console.log("\n5. a sketch is its own interface, and so is its ring");
{
  const ring = pieMenu(world({
    sketching: { id: "SK1", name: "Sketch.1" },
    sketchTools: [{ key: "select", label: "Select", hint: "" },
                  { key: "line", label: "Polyline", hint: "2 clicks" }],
    relations: [{ key: "coincident", label: "Coincident", hint: "two ends meet" },
                { key: "tangent", label: "Tangent", hint: "" }],
    sketchTool: "line", sketchPicked: 2, sketchRelation: 3, construction: true }));
  check("the drawing tools are there", has(ring, "Draw.*Polyline"), labels(ring).join(" · "));
  check("and so are the relations", has(ring, "Relate.*Coincident"));
  check("the relation under the cursor can be taken off", has(ring, "Relate.*Delete relation"));
  check("construction geometry is a toggle and it says so",
        ring.some(i => i.label === "Construction" && i.on === true));
  check("there is a way out", has(ring, "Done"));
  check("and looking at the paper square on", has(ring, "Square on"));
  check("the modelling ring is not offered on top of it", !has(ring, "Add.*Cube"));
  check("the tool in hand is marked",
        leaves(ring).some(l => l.label === "Polyline" && l.item.on === true));
}

console.log("\n6. modes, packages and the showroom are all reachable and all leavable");
{
  const loaded = world({
    modes: [{ key: "flow", label: "Flow", title: "people moving" }],
    packages: { loaded: [{ id: "crowd", name: "Flow & Floor Plate", summary: "crowds" }],
                available: [{ id: "climate", name: "Climate", summary: "sun and wind" }] } });
  const ring = pieMenu(loaded);
  check("a mode a loaded package brought is a flick away", has(ring, "Packages.*Flow"),
        labels(ring).join(" · "));
  check("a package on the shelf can be loaded", has(ring, "Packages.*Climate"));
  check("and a loaded one put away", has(ring, "Packages.*Flow & Floor Plate"));

  const inMode = pieMenu(world({ ...loaded, mode: { key: "flow", label: "Flow" } }));
  check("inside a mode there is a way out of it", has(inMode, "Leave Flow"),
        labels(inMode).join(" · "));
  check("and the view and the style still work while you are in one",
        has(inMode, "View.*Fit") && has(inMode, "Style.*Arctic"));

  const stage = pieMenu(world({ staging: true, stage: { ground: true, spin: false } }));
  check("the showroom has its own ring", has(stage, "Leave"), labels(stage).join(" · "));
  check("with the things the showroom actually has",
        has(stage, "Ground") && has(stage, "Reflection") && has(stage, "Turntable"));
  check("and what is on is marked on",
        stage.some(i => i.label === "Ground" && i.on === true)
        && stage.some(i => i.label === "Turntable" && !i.on));
}

console.log("\n7. every item does something, and it is the thing it says");
{
  const all = leaves(pieMenu(world({ selected: { id: "SK1", name: "Sketch.1",
                                                 produces: "curve", category: "curve" },
                                     containers: [{ id: "BO1", name: "PartBody", type: "Body" }] })));
  check("there is no item with nothing behind it",
        all.every(l => typeof l.item.run === "function"),
        all.filter(l => typeof l.item.run !== "function").map(l => l.path).join(", "));
  check("and there are enough of them to be the whole program",
        all.length > 30, all.length + " commands");

  ran.length = 0;
  for (const l of all) l.item.run();
  check("every one of them calls something", ran.length === all.length);
  const wanted = ["add(Point)", "style(arctic)", "look(top)", "exportAs(step)", "bare(true)",
                  "showroom()", "undo()", "del()", "moveInto(BO1)"];
  for (const call of wanted)
    check("“" + call + "” is one of them", ran.includes(call));
}

console.log("\n8. full screen says the way back out of itself");
{
  const out = pieMenu(world({ bare: true }));
  check("in full screen the Interface ring offers the panels back",
        has(out, "Interface.*Show the panels"), labels(out).join(" · "));
  check("and it is marked as the state it is in",
        leaves(out).some(l => /Show the panels/.test(l.label) && l.item.on === true));
  const inn = pieMenu(world({ bare: false }));
  check("and out of it, full screen", has(inn, "Interface.*Full screen"));
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
