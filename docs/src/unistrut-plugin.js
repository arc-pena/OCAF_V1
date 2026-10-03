// The Unistrut package: channel as a part number, not as a profile.
//
// The difference this package exists for. Extruding a C section along a line
// and punching your own holes gives you a shape. It does not give you a P1000
// HS-PG, it does not know that a P4006 nut will not go in it, it does not know
// the stick comes in 10 and 20 foot lengths, and it cannot be ordered. Here the
// part number is the input and everything else follows from the catalogue in
// unistrut.js, which was read off General Engineering Catalog 18A page by page.
//
// Four nodes, and they are the four things somebody actually does:
//
//   StrutRun      a wire becomes channel. Pick the family, the punching and
//                 the finish; say which way is up and which way the slot
//                 faces; say whether the length on the drawing is cut from
//                 sticks or installed as whole sticks.
//   StrutNut      nuts into a run, chosen by the hole they go in - "the second
//                 from the end", "every other one from the third", "jump one,
//                 three, two". Refuses a nut the channel does not take.
//   StrutFitting  a catalogue fitting, generated from the one rule on p81
//                 rather than imported.
//   StrutBill     what it all is, counted by part number, with weight.
//
// Nothing here reaches past the factories into OpenCascade, and nothing here
// knows a number the catalogue does not.

import { ARG } from "./ocaf.js";
import { offerPlugin } from "./plugin.js";
import { CONNECTION_LOADS, FITTINGS, FITTING_STANDARD, STOCK_LENGTHS, STRUT_CHANNELS,
         STRUT_FINISHES, STRUT_NUTS, STRUT_PATTERNS, strutBomOf, strutBomText, channelByKey,
         connectionLoad, fittingBlank, fittingByKey, holeStations, lengthPlan,
         nutByKey, nutFits, nutsFor, patternByKey, pickHoles, strutLabel,
         strutSections } from "./unistrut.js";

const CHANNEL_KEYS = STRUT_CHANNELS.map(c => c.key);
const PATTERN_KEYS = STRUT_PATTERNS.map(p => p.key);
const FINISH_KEYS = STRUT_FINISHES.map(f => f.key);
const NUT_KEYS = STRUT_NUTS.map(n => n.key);
const FITTING_KEYS = FITTINGS.map(f => f.key);
//! A FITTING IS NOT FINISHED LIKE A CHANNEL. 18A p81 prints EG, GR, HG and DF
//! against the plates; PG and ZD are channel finishes and are not offered on
//! them, so offering the channel's list here would put a finish on a bill that
//! cannot be ordered.
const FITTING_FINISHES = [...new Set(FITTINGS.flatMap(f => f.finishes || []))];

export const UNISTRUT_NODES = [
  { type: "StrutRun", guid: "9a1b2c30-0140-4c00-9e00-caf000000140",
    category: "operation", produces: "solid",
    summary: "Channel along a wire. Every straight part of the wire becomes a piece of "
           + "the family and punching you pick, so a rectangle of four lines is four "
           + "pieces and a bill of four. Which way the slot faces is a quarter turn "
           + "about the run, taken from the Up wire or from world Z.",
    args: [ARG.ref("path", "Path", ["wire", "curve", "edge", "sketch"]),
           ARG.choice("channel", "Channel", CHANNEL_KEYS, 0),
           ARG.choice("pattern", "Punching", PATTERN_KEYS, 0),
           ARG.choice("finish", "Finish", FINISH_KEYS, 0),
           ARG.spare("up", "Up", ["vector", "plane"]),
           ARG.choice("facing", "Slot faces", ["Up", "Down", "Left", "Right"], 0),
           ARG.real("roll", "Roll", 0, -360, 360, 15, "°"),
           ARG.choice("length", "Length", ["Follow the wire", "Cut from sticks",
                                           "Whole sticks"], 0)] },

  { type: "StrutNut", guid: "9a1b2c30-0141-4c00-9e00-caf000000141",
    category: "operation", produces: "solid",
    summary: "Channel nuts into a run, picked by the hole they go in. The rule is "
           + "written the way somebody says it: 3, or 2 5 9, or -1 for the last, or "
           + "2..7, or \"every 2 from 3\", or \"jump 1 3 2\" for a walk that repeats. "
           + "A nut the channel does not take is refused by name rather than drawn.",
    args: [ARG.ref("run", "Run", ["solid"]),
           ARG.choice("nut", "Nut", NUT_KEYS, 0),
           ARG.code("where", "Holes", "all",
                    "which holes: 3 | 2,5,9 | -1 | 2..7 | every 2 from 3 | jump 1 3 2"),
           ARG.choice("side", "Side", ["Into the slot", "Both webs"], 0)] },

  { type: "StrutFitting", guid: "9a1b2c30-0142-4c00-9e00-caf000000142",
    category: "solid", produces: "solid",
    summary: "A catalogue fitting, generated from the rule in the box on 18A p81 - a "
           + "41.3 mm strip of 6.4 mm plate punched 14.3 at 47.6 centres. A flat plate "
           + "is a run of holes, an ell is two arms, a tee three, a cross four.",
    args: [ARG.choice("part", "Part", FITTING_KEYS, 0),
           ARG.spare("at", "At", ["point"]),
           ARG.spare("plane", "On", ["plane"]),
           ARG.choice("finish", "Finish", FITTING_FINISHES, 0)] },

  { type: "StrutBill", guid: "9a1b2c30-0143-4c00-9e00-caf000000143",
    category: "analysis", produces: "text",
    summary: "The bill, read off the model. Wire a set into it and it counts every run, "
           + "nut and fitting by PART NUMBER, with the metres, the weight from the "
           + "catalogue's kg per 100, and the offcut when the run is cut from sticks. "
           + "A bill written beside a model is wrong by the second revision.",
    args: [ARG.ref("of", "Of", ARG.ANY, true),
           ARG.choice("show", "Show", ["Everything", "Channel only", "Nuts and fittings"], 0)] },
];

/* ===================================================================== drivers

   Built from the manifest so the worker can build them too - see plugin.js.
   Nothing in here calls kit.toolkit() at load time: that is the silent hang the
   package suite checks for.                                                   */

export function unistrutDrivers(kit) {
  const K = kit.toolkit();
  const { F, hybrid: H, shape: S } = K;

  const vsub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const vlen = v => Math.hypot(v[0], v[1], v[2]);
  const vunit = v => { const l = vlen(v) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
  const vcross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2],
                            a[0] * b[1] - a[1] * b[0]];
  const vdot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  //! THE STRAIGHT PIECES OF A PATH, taken off the wire's own EDGES rather than
  //! off samples of it. Unistrut is cut and bolted, not rolled - 18A p18 says
  //! curved channel is a special order from the service centre - so a run is
  //! the straight pieces of its path and a bill counts them separately.
  //!
  //! The first version of this sampled the curve at four hundred points and
  //! split where the direction changed, which looked right and was not: on a
  //! 1000 x 800 rectangle the step is 9 mm, so the sample that straddles each
  //! corner belongs to neither side and became a segment of its own. Six
  //! pieces, 999.0, 8.1, 792.0 twice over - and because every piece buys a
  //! whole stick, the bill quoted six 10 ft sticks for a frame that needs
  //! four. 18.29 m against 12.19. Nothing on screen would have shown it.
  //!
  //! An edge has ends. There is no sampling and no tolerance.
  const segmentsOf = wire => {
    const edges = K.subShapes(wire, K.EDGE, K.oc.TopoDS.Edge);
    const out = [];
    for (const edge of edges) {
      //! sampleCurve wants a WIRE. Handed a bare edge it refuses by type -
      //! "Expected null or instance of TopoDS_Wire" - so each edge is wrapped
      //! before it is asked anything.
      const curve = K.sampleCurve(K.wireFrom(edge) || edge, 64);
      const a = curve.at(0), b = curve.at(1);
      const mid = curve.at(curve.byLength(0.5));
      const chord = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
      //! Straight within a tenth of a millimetre is straight: one piece.
      if (vlen(vsub(mid, chord)) < 0.1) { out.push([a, b]); continue; }
      //! A CURVED EDGE IS CUT INTO CHORDS, and that is a real decision rather
      //! than a fallback - curved channel is made, but to order, so a curve
      //! drawn here becomes the straight pieces somebody would actually bolt
      //! up. Twelve to an edge, which on a 2 m radius is a 4 mm rise.
      const n = 12;
      for (let i = 0; i < n; i++)
        out.push([curve.at(curve.byLength(i / n)), curve.at(curve.byLength((i + 1) / n))]);
    }
    //! A wire with no edges this build can walk still has two ends.
    if (!out.length) {
      const curve = K.sampleCurve(wire, 2);
      out.push([curve.at(0), curve.at(1)]);
    }
    return out.filter(([a, b]) => vlen(vsub(b, a)) > 1);
  };

  //! The frame a section is drawn in: z along the run, y the way the slot
  //! faces, x across. `up` is a wire or world Z, and is made perpendicular to
  //! the run rather than used raw - a run that is not level would otherwise
  //! get a sheared section.
  const frameFor = (from, to, up, facing, roll) => {
    const z = vunit(vsub(to, from));
    let hint = up && vlen(up) > 1e-9 ? vunit(up) : [0, 0, 1];
    //! A vertical run has no "up" to speak of, so the hint falls back to Y -
    //! without this a column gets a zero-length cross product and no section.
    if (Math.abs(vdot(hint, z)) > 0.999) hint = Math.abs(z[2]) > 0.9 ? [0, 1, 0] : [0, 0, 1];
    let x = vunit(vcross(hint, z));
    let y = vunit(vcross(z, x));
    const quarter = { Up: 0, Left: 1, Down: 2, Right: 3 }[facing] || 0;
    const turn = (quarter * Math.PI) / 2 + (roll * Math.PI) / 180;
    const c = Math.cos(turn), s = Math.sin(turn);
    const rx = [x[0] * c + y[0] * s, x[1] * c + y[1] * s, x[2] * c + y[2] * s];
    const ry = [y[0] * c - x[0] * s, y[1] * c - x[1] * s, y[2] * c - x[2] * s];
    return { origin: from, x: rx, y: ry, z };
  };

  const at = (frame, u, v, w) => [
    frame.origin[0] + frame.x[0] * u + frame.y[0] * v + frame.z[0] * w,
    frame.origin[1] + frame.x[1] * u + frame.y[1] * v + frame.z[1] * w,
    frame.origin[2] + frame.x[2] * u + frame.y[2] * v + frame.z[2] * w,
  ];

  const extrude = (frame, outline, w0, length, lift = 0) => {
    const pts = outline.map(([u, v]) => at(frame, u, v + lift, w0));
    const face = H.fill(H.polyline(pts, true));
    return S.pad(face, [frame.z[0] * length, frame.z[1] * length, frame.z[2] * length]);
  };

  //! ONE BOOLEAN, NOT SIXTY-FOUR. A 3 m stick of HS has 64 holes and each one
  //! taken separately is a whole cut against a solid that has grown a face
  //! every time. The rack package learnt this the expensive way; a compound of
  //! tools goes through in one pass.
  const cutAll = (solid, tools) =>
    !tools.length ? solid
      : tools.length === 1 ? S.remove(solid, tools[0])
                           : S.remove(solid, K.compoundOf(tools));

  //! A hole or a slot, as a tool long enough to go through whatever it meets.
  //! S.cylinder takes an AXIS first, as a raw gp_Ax2, then the radius and the
  //! height. Called as (radius, height, options) it reads the options object
  //! as the height and fails with "cylinder height must be greater than zero" -
  //! which is what it did, and is why this follows the rack package's drill()
  //! rather than a signature read off a wrapper further down the file.
  const axisAt = (point, dir) =>
    new K.oc.gp_Ax2(new K.oc.gp_Pnt(point[0], point[1], point[2]),
                    new K.oc.gp_Dir(dir[0], dir[1], dir[2]));

  const holeTool = (frame, pattern, u, w, across) => {
    const deep = 400;
    const dir = across ? frame.x : frame.y;
    const centre = across ? at(frame, -deep / 2, u, w) : at(frame, u, -deep / 2, w);
    if (pattern.hole.kind === "round")
      return S.cylinder(axisAt(centre, dir), pattern.hole.d / 2, deep);
    //! A slot is a rectangle with a half round at each end, swept through.
    const half = pattern.hole.wide / 2, run = (pattern.hole.long - pattern.hole.wide) / 2;
    const ring = [];
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI / 2 - (i * Math.PI) / 12;
      ring.push([run + half * Math.cos(a), half * Math.sin(a)]);
    }
    for (let i = 0; i <= 12; i++) {
      const a = -Math.PI / 2 - (i * Math.PI) / 12;
      ring.push([-run + half * Math.cos(a), half * Math.sin(a)]);
    }
    //! Drawn in the plane the slot lies in: along the run, and across the face.
    const pts = ring.map(([a, b]) => across
      ? at(frame, -deep / 2, u + b, w + a)
      : at(frame, b, -deep / 2, w + a));
    const face = H.fill(H.polyline(pts, true));
    return S.pad(face, [dir[0] * deep, dir[1] * deep, dir[2] * deep]);
  };

  const readUp = f => {
    const wired = F.reference(f, "up");
    if (!wired) return null;
    const v = K.readVector ? K.readVector(wired) : null;
    if (v && vlen(v) > 1e-9) return v;
    const axis = K.planeAxis ? K.planeAxis(wired) : null;
    return axis && axis.normal ? axis.normal : null;
  };

  //! What a run IS, read off the feature - so StrutNut and StrutBill ask the
  //! run rather than being told again. Two copies of the same fact is how a
  //! bill stops matching the model.
  const runSpec = f => {
    const channel = channelByKey(CHANNEL_KEYS[F.choice(f, "channel", 0)]);
    const pattern = patternByKey(PATTERN_KEYS[F.choice(f, "pattern", 0)]);
    const finish = FINISH_KEYS[F.choice(f, "finish", 0)];
    return { channel, pattern, finish,
             facing: ["Up", "Down", "Left", "Right"][F.choice(f, "facing", 0)] || "Up",
             roll: F.real(f, "roll", 0),
             policy: ["exact", "cut", "stock"][F.choice(f, "length", 0)] || "exact" };
  };

  const runPieces = f => {
    const path = F.reference(f, "path");
    if (!path) return null;
    const wire = K.wireFrom(F.shape(path));
    if (!wire) return null;
    const spec = runSpec(f);
    const up = readUp(f);
    return segmentsOf(wire).map(([a, b]) => {
      const drawn = vlen(vsub(b, a));
      const plan = lengthPlan(drawn, spec.policy, STOCK_LENGTHS);
      //! "Whole sticks" draws the STICK, not the line - that is what gets
      //! installed, and a model that drew the line would hide the overhang.
      const length = spec.policy === "stock" ? plan.bought : drawn;
      return { from: a, to: b, drawn, length, plan, spec, up };
    });
  };

  const drivers = {};

  drivers.StrutRun = {
    precondition: f => {
      const path = F.reference(f, "path");
      if (!path) return "nothing wired in to run along";
      if (!F.shape(path)) return F.name(path) + " has not been built";
      const spec = runSpec(f);
      if (!spec.channel) return "that is not a channel in the catalogue";
      //! THE CATALOGUE'S OWN AVAILABILITY ROW. 18A p20 says which punchings
      //! each family is made in, and a P3300 KO is not a part that can be
      //! bought - so it is refused here rather than drawn and ordered.
      if (!spec.channel.patterns.includes(spec.pattern.key))
        return spec.channel.key + " is not made in " + spec.pattern.key
             + " — 18A p20 lists " + spec.channel.patterns.join(", ");
      return null;
    },
    build: f => {
      const pieces = runPieces(f);
      if (!pieces || !pieces.length) return null;
      const solids = [];
      for (const piece of pieces) {
        const { spec } = piece;
        const frame = frameFor(piece.from, piece.to, piece.up, spec.facing, spec.roll);
        for (const part of strutSections(spec.channel)) {
          let solid = extrude(frame, part.outline, 0, piece.length, part.at);
          if (spec.pattern.pitch) {
            const stations = holeStations(piece.length, spec.pattern);
            const across = spec.pattern.face === "sides";
            const tools = stations.map(w =>
              holeTool(frame, spec.pattern, part.at, w, across));
            solid = cutAll(solid, tools);
          }
          solids.push(solid);
        }
      }
      //! `note`, not `data`. A bare { preview } object is accepted by the
      //! document and never surfaces, because the tree only emits data that
      //! carries a recognised kind - which is why this showed nothing while
      //! the bill, returning K.text(), showed everything.
      return { shape: solids.length === 1 ? solids[0] : K.compoundOf(solids),
               note: runSays(f) };
    },
  };

  //! THE ONE LINE A RUN SHOWS. `preview` is not a driver hook - it lives in the
  //! data a build returns, which is why the first version of this showed
  //! nothing at all while every other check passed.
  const runSays = f => {
      const pieces = runPieces(f);
      if (!pieces) return "";
      const spec = pieces[0].spec;
      const total = pieces.reduce((s, p) => s + p.drawn, 0);
      const bought = pieces.reduce((s, p) => s + p.plan.bought, 0);
      const kg = (spec.channel.kgPer100m / 100) * (bought / 1000);
      return [strutLabel(spec.channel.key, spec.pattern.key, spec.finish),
              pieces.length + (pieces.length === 1 ? " piece" : " pieces"),
              (total / 1000).toFixed(2) + " m drawn",
              spec.policy === "exact" ? "cut to the drawing"
                : (bought / 1000).toFixed(2) + " m bought",
              kg.toFixed(1) + " kg"].join(" · ");
  };

  drivers.StrutNut = {
    precondition: f => {
      const run = F.reference(f, "run");
      if (!run) return "nothing wired in to put nuts in";
      if (F.spec(run).type !== "StrutRun") return F.name(run) + " is not a strut run";
      const spec = runSpec(run);
      if (!spec.pattern.pitch)
        return F.name(run) + " is plain channel — there are no holes to put a nut in";
      const nut = NUT_KEYS[F.choice(f, "nut", 0)];
      //! 18A p65 and p66 say which channels take which nut, and this is the
      //! mistake that gets ordered: a P1006 is a full depth nut and will not
      //! sit in a 22.2 mm deep P3300.
      if (!nutFits(nut, spec.channel.key))
        return nut + " does not fit a " + spec.channel.key + " — that channel takes "
             + nutsFor(spec.channel.key).slice(0, 4).map(n => n.key).join(", ") + "…";
      return null;
    },
    build: f => {
      const run = F.reference(f, "run");
      const pieces = runPieces(run);
      if (!pieces) return null;
      const nut = nutByKey(NUT_KEYS[F.choice(f, "nut", 0)]);
      const rule = F.code(f, "where", "all");
      const bodies = [];
      for (const piece of pieces) {
        const { spec } = piece;
        const frame = frameFor(piece.from, piece.to, piece.up, spec.facing, spec.roll);
        const stations = holeStations(piece.length, spec.pattern);
        const chosen = pickHoles(stations.length, rule);
        //! An unreadable rule selects NOTHING - see unistrut.js. Drawing every
        //! hole instead would fill a 3 m run with sixty-four nuts nobody asked
        //! for and look deliberate.
        //! An unreadable rule places nothing - but the node still has to
        //! PRODUCE something or the document reports "the driver produced
        //! nothing", which reads as a broken node rather than as an empty one.
        if (!chosen) continue;
        for (const part of strutSections(spec.channel)) {
          for (const i of chosen) {
            const w = stations[i];
            if (w == null) continue;
            bodies.push(nutBody(frame, spec.channel, nut, part.at, w));
          }
        }
      }
      return { shape: bodies.length === 1 ? bodies[0] : K.compoundOf(bodies),
               note: nutSays(f) };
    },
  };

  const nutSays = f => {
      const run = F.reference(f, "run");
      if (!run || F.spec(run).type !== "StrutRun") return "";
      const pieces = runPieces(run);
      if (!pieces) return "";
      const spec = runSpec(run);
      const nut = NUT_KEYS[F.choice(f, "nut", 0)];
      const rule = F.code(f, "where", "all");
      let holes = 0, placed = 0;
      for (const piece of pieces) {
        const stations = holeStations(piece.length, spec.pattern);
        holes += stations.length;
        const chosen = pickHoles(stations.length, rule);
        placed += chosen ? chosen.length : 0;
      }
      const sections = strutSections(spec.channel).length;
      return [nut, placed * sections + " placed", "of " + holes + " holes",
              pickHoles(1, rule) === null ? "the rule could not be read" : rule]
        .join(" · ");
  };

  //! A channel nut, to the proportions of the real one. P1007 as supplied
  //! measures 34.42 x 20.39 across - the 20.4 drops through the 22.2 mm slot
  //! and the 34.4 hooks under the lips when it is turned - so the body here is
  //! cut from the CHANNEL's own opening rather than from a number typed in,
  //! and a nut in a P5500 comes out the same size as one in a P1000 because
  //! the slot is the same. The supplied STEP is exact and can be placed as an
  //! Imported body where the thread itself has to be seen.
  const nutBody = (frame, channel, nut, lift, w) => {
    const opening = 22.2;
    const long = 34.4, wide = 20.4;
    const thick = nut && nut.thin ? 6.4 : 11.1;
    //! It sits inside the channel with its top against the underside of the
    //! lips, which is where the catalogue's lip return puts it.
    const top = channel.h / 2 - 7.1;
    const pts = [[-wide / 2, 0], [wide / 2, 0], [wide / 2, -thick], [-wide / 2, -thick]];
    const face = H.fill(H.polyline(pts.map(([u, v]) =>
      at(frame, u, v + lift + top, w - long / 2)), true));
    return S.pad(face, [frame.z[0] * long, frame.z[1] * long, frame.z[2] * long]);
  };

  drivers.StrutFitting = {
    precondition: f => fittingByKey(FITTING_KEYS[F.choice(f, "part", 0)])
      ? null : "that is not a fitting in the table",
    build: f => {
      const part = fittingByKey(FITTING_KEYS[F.choice(f, "part", 0)]);
      const blank = fittingBlank(part);
      if (!blank) return null;
      const where = F.reference(f, "at");
      const origin = where ? K.readPoint(where) || [0, 0, 0] : [0, 0, 0];
      const plane = F.reference(f, "plane");
      const axis = plane && K.planeAxis ? K.planeAxis(plane) : null;
      const frame = axis
        ? { origin, x: axis.x || [1, 0, 0], y: axis.y || [0, 1, 0],
            z: axis.normal || [0, 0, 1] }
        : { origin, x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
      //! Each arm is its own slab and they are added, so the square where a
      //! tee's arms cross is solid once rather than three times.
      const slabs = blank.rects.map(r => {
        const pts = [[r.x0, r.y0], [r.x1, r.y0], [r.x1, r.y1], [r.x0, r.y1]];
        const face = H.fill(H.polyline(pts.map(([u, v]) => at(frame, u, v, 0)), true));
        return S.pad(face, [frame.z[0] * blank.thickness, frame.z[1] * blank.thickness,
                            frame.z[2] * blank.thickness]);
      });
      let solid = slabs.length === 1 ? slabs[0] : slabs.reduce((a, b) => S.add(a, b));
      const bore = blank.holes.map(([u, v]) =>
        S.cylinder(axisAt(at(frame, u, v, -blank.thickness), frame.z),
                   FITTING_STANDARD.holeDiameter / 2, blank.thickness * 4));
      return { shape: cutAll(solid, bore), note: fittingSays(f) };
    },
  };

  const fittingSays = f => {
      const part = fittingByKey(FITTING_KEYS[F.choice(f, "part", 0)]);
      if (!part) return "";
      const blank = fittingBlank(part);
      const bits = [part.key, part.name,
                    blank.holes.length + " holes",
                    part.kgPer100 + " kg/100 (catalogue)"];
      if (part.confirmed === false)
        bits.push("shape not settled by the published weight");
      return bits.join(" · ");
  };

  drivers.StrutBill = {
    precondition: f => F.reference(f, "of") ? null : "nothing wired in to count",
    //! A text node publishes from build, as { data: K.text(...) } - there is no
    //! separate text hook, which the rack package's own Bill is the precedent
    //! for. Returning a string from build would have produced a node that
    //! builds without error and shows nothing.
    build: f => {
      const of = F.reference(f, "of");
      if (!of) return null;
      const show = ["Everything", "Channel only", "Nuts and fittings"][F.choice(f, "show", 0)];
      const items = [];
      const walk = one => {
        const spec = F.spec(one);
        if (!spec) return;
        if (spec.type === "StrutRun" && show !== "Nuts and fittings") {
          const pieces = runPieces(one) || [];
          for (const p of pieces)
            items.push({ part: strutLabel(p.spec.channel.key, p.spec.pattern.key,
                                          p.spec.finish),
                         kind: "channel", length: p.plan.bought || p.drawn, count: 1,
                         kgPer100m: p.spec.channel.kgPer100m, drop: p.plan.drop });
        }
        if (spec.type === "StrutNut" && show !== "Channel only") {
          const run = F.reference(one, "run");
          const nut = nutByKey(NUT_KEYS[F.choice(one, "nut", 0)]);
          const pieces = run ? runPieces(run) || [] : [];
          const rule = F.code(one, "where", "all");
          let n = 0;
          for (const p of pieces) {
            const stations = holeStations(p.length, p.spec.pattern);
            const chosen = pickHoles(stations.length, rule);
            n += (chosen ? chosen.length : 0) * strutSections(p.spec.channel).length;
          }
          if (nut && n) items.push({ part: nut.key, kind: "nut", count: n,
                                     kgPer100: nut.kgPer100 });
        }
        if (spec.type === "StrutFitting" && show !== "Channel only") {
          const part = fittingByKey(FITTING_KEYS[F.choice(one, "part", 0)]);
          if (part) items.push({ part: part.key, kind: "fitting", count: 1,
                                 kgPer100: part.kgPer100 });
        }
        //! K.doc is a FUNCTION returning the document, not the document.
        const doc = K.doc ? K.doc() : null;
        if (doc && doc.isContainer(one))
          for (const child of doc.within(one)) walk(child);
      };
      walk(of);
      //! K.text takes the LINES, not the text - passing a string gives a
      //! `data.lines` that is a string, and the tree's preview then calls
      //! .slice().join() on it and throws a long way from here.
      return { data: K.text(items.length ? strutBomText(strutBomOf(items)).split("\n")
                                         : ["nothing in there is Unistrut"]) };
    },
  };

  return drivers;
}

export const UNISTRUT = offerPlugin({
  id: "unistrut",
  name: "Unistrut",
  version: 1,
  summary: "Strut channel as a part number: pick the family and the punching, run it "
         + "along a wire, put nuts in the holes you name, and read the bill off the "
         + "model. From General Engineering Catalog 18A.",
  needs: [],
  nodes: UNISTRUT_NODES,

  api: {
    name: "Unistrut",
    summary: "The 18A catalogue, and what can be made from it.",
    operations: [
      { name: "channelByKey", takes: "P1000…", gives: "the channel",
        summary: "Dimensions, gauge, both weight columns, allowable moment and which "
               + "punchings it is made in." },
      { name: "nutsFor", takes: "a channel", gives: "the nuts that fit it",
        summary: "18A p65 and p66's compatibility rule, which is why a P4006 is not "
               + "offered for a P1000." },
      { name: "pickHoles", takes: "a count and a rule", gives: "hole indices",
        summary: "3 | 2,5,9 | -1 | 2..7 | every 2 from 3 | jump 1 3 2. An unreadable "
               + "rule gives null rather than everything." },
      { name: "lengthPlan", takes: "a length and a policy", gives: "sticks and drop",
        summary: "Cut to the drawing, cut from 10 and 20 foot sticks, or installed as "
               + "whole sticks." },
      { name: "connectionLoad", takes: "a fitting and a gauge", gives: "allowable loads",
        summary: "18A p79, by position, with its conditions. Refuses without a gauge, "
               + "because the load belongs to the connection and not to the fitting." },
    ],
  },

  resources: [],

  //! THE SILENT HANG, and the suite catches it. start() must NOT call
  //! kit.toolkit(): a toolkit is the WebAssembly module itself, and on a
  //! served page the modelling is in a worker while the page's kernel is a
  //! proxy - so a package that builds its drivers here asks the worker to post
  //! a compiled module back across the port, and loading never finishes.
  //!
  //! The manifest's own `drivers` is what both sides use instead, each
  //! building from the same declaration where its own kernel lives. This
  //! package has nothing to unpack, so start does nothing at all.
  async start() {
    return { sections: ["channel", "nuts", "fittings"] };
  },

  drivers: unistrutDrivers,
});
