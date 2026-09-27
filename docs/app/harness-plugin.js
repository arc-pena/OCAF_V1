// The Harness package: routes, cables, pipes and connectors.
//
// CATIA's electrical wiring workbench in the shape this modeller already has.
// A run is three things and they are three nodes, because they are edited at
// three different times: WHERE it goes (a Route - the points, and how tightly
// it may turn), WHAT is in it (a Cable - a diameter and a bend limit off a
// named standard), and WHAT IS ON THE END (a connector, chosen per end).
//
// Splitting them that way is what makes a harness maintainable. The route
// survives changing the cable; the cable survives moving the route; and a run
// that is now too tight for the cable on it SAYS SO instead of either failing
// to build or quietly bending a fibre past its limit.
//
// WHAT IT DOES NOT CLAIM. No manufacturer's part file is shipped and no part
// number is invented. Every diameter is a typical one for a common
// construction under the standard it names; every connector is the envelope
// its standard defines, which is the number that decides whether it fits.
// Each Cable has a Bought part input that replaces the modelled run entirely,
// and a Supplier ref that travels with it - the same honest path a Fastener
// takes. See the header of harness.js for which number is which.
import { ARG } from "./ocaf.js";
import { offerPlugin } from "./plugin.js";
import { CABLE_TYPES, CONNECTORS, bendRadius, cableType, checkRoute,
         connectorType, roundedRoute } from "./harness.js";

const cableNames = CABLE_TYPES.map(one => one.name);
const connectorNames = CONNECTORS.map(one => one.name);

export const HARNESS_NODES = [
  { type: "Route", guid: "9a1b2c30-00f1-4c00-9e00-caf0000000f1", category: "curve",
    produces: "curve",
    summary: "Where a run goes: the points it passes through, turned into a path that "
           + "can actually be swept. A polyline cannot be swept - at a corner the "
           + "section has nowhere to point - so the corners are rounded, and the "
           + "radius is the real constraint rather than a cosmetic one, because a "
           + "cable that turns tighter than its bend radius is a damaged cable. "
           + "Rounded for cable and pipe; spline where a run should ease rather than "
           + "turn. It reports its own length, which is the length somebody orders.",
    args: [ARG.refs("through", "Through", ["point"]),
           ARG.choice("kind", "Path", ["Rounded corners", "Spline"], 0),
           ARG.when(ARG.real("radius", "Corner radius", 50, 0, 2000, 5), "kind", 0)] },

  { type: "Cable", guid: "9a1b2c30-00f2-4c00-9e00-caf0000000f2", category: "body",
    produces: "solid",
    summary: "A cable or a pipe on a route, with a connector on each end. The section "
           + "comes from a named type - Cat6A, OM4 fibre, QSFP-DD twinax, a C13 cord, "
           + "22 mm copper - so switching what is in the run changes its diameter and "
           + "its bend limit together. It checks the route it is on against that "
           + "limit and says which corner is too tight rather than refusing to build, "
           + "because a run 5 mm inside its limit is something to be told about.",
    args: [ARG.ref("route", "Route", ["curve"]),
           ARG.choice("cable", "Cable", cableNames, 0),
           ARG.choice("startEnd", "Connector at the start", connectorNames, 0),
           ARG.choice("endEnd", "Connector at the end", connectorNames, 0),
           ARG.spare("bought", "Bought part", ["solid"]),
           ARG.text("supplier", "Supplier ref", "", "your own part number")] },
];

export function harnessDrivers(kit) {
  const K = kit.toolkit();
  const { F: KF, hybrid: H, shape: S } = K;

  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const addv = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
  const hyp = a => Math.hypot(a[0], a[1], a[2]);
  const unit = a => { const l = hyp(a); return l < 1e-12 ? [0, 0, 1] : mul(a, 1 / l); };

  //! The points a route is drawn through, in the order they are wired.
  const throughOf = f => (KF.references(f, "through") || [])
    .map(one => K.readPoint(one)).filter(Boolean);

  //! THE PATH, WORKED OUT ONCE. Both the Route driver and anything reading a
  //! route back need the same answer, and computing it twice is how the length
  //! a bill reports and the length that was built come to disagree.
  const pathOf = f => {
    const via = throughOf(f);
    const spline = K.F.choice(f, "kind", 0) === 1;
    if (spline) {
      //! A SPLINE HAS NO CORNERS TO ROUND. Its whole point is that it eases
      //! rather than turns, which is what a long fibre run down a tray wants.
      return { spline: true, via, corners: [],
               length: via.slice(1).reduce((n, p, i) => n + hyp(sub(p, via[i])), 0) };
    }
    return { spline: false, via, ...roundedRoute(via, KF.real(f, "radius", 50)) };
  };

  //! The wire, built from whichever the path turned out to be.
  const wireOfPath = path => {
    if (path.spline) return H.spline(path.via, false);
    const runs = path.segments.map(one => one.kind === "line"
      ? H.polyline([one.from, one.to], false)
      : H.arc(one.from, one.through, one.to));
    return runs.length === 1 ? runs[0] : H.chain(runs);
  };

  //! WHICH WAY THE RUN LEAVES EACH END. A connector has to face along the
  //! cable or it stands across the port it is plugged into.
  const endsOf = path => {
    const via = path.via;
    if (via.length < 2) return null;
    return { start: { at: via[0], along: unit(sub(via[1], via[0])) },
             end: { at: via[via.length - 1],
                    along: unit(sub(via[via.length - 1], via[via.length - 2])) } };
  };

  //! A connector's envelope, sitting on the end of the run and facing along it.
  //! It occupies the last `deep` millimetres BEFORE the end point, so the run
  //! plus its connector finishes exactly at the port rather than through it.
  const connectorAt = (spec, end, inward) => {
    if (!spec || !spec.deep) return null;
    const along = inward ? end.along : mul(end.along, -1);
    const back = addv(end.at, mul(along, -spec.deep));
    //! Square to the run, turned any way round it: a connector's envelope is a
    //! box and which way its latch points is not something this knows.
    const up = Math.abs(along[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
    const cross = [along[1] * up[2] - along[2] * up[1],
                   along[2] * up[0] - along[0] * up[2],
                   along[0] * up[1] - along[1] * up[0]];
    //! FROM A CORNER, so the corner has to be worked out. box() builds from one
    //! - it is "a box from a corner, oriented by a plane" - and handing it the
    //! point on the cable's axis hangs the connector off to one side of the
    //! cable rather than around it. Half its width and half its height back
    //! along the two directions square to the run is where its corner is.
    const corner = addv(addv(back, mul(up, -spec.w / 2)), mul(cross, -spec.h / 2));
    const ax = new K.oc.gp_Ax2(new K.oc.gp_Pnt(corner[0], corner[1], corner[2]),
                               new K.oc.gp_Dir(along[0], along[1], along[2]),
                               new K.oc.gp_Dir(up[0], up[1], up[2]));
    return S.box(ax, spec.w, spec.h, spec.deep);
  };

  return {
    Route: {
      precondition: f => {
        const via = throughOf(f);
        if (via.length < 2) return "a route needs at least two points to go between";
        return null;
      },
      build: f => {
        const path = pathOf(f);
        const wire = wireOfPath(path);
        const tightest = path.corners && path.corners.length
          ? Math.min(...path.corners.map(one => one.radius)) : null;
        const said = [Math.round(path.length) + " mm long",
                      path.spline ? "a spline through " + path.via.length + " points"
                                  : (path.corners || []).length + " rounded corners"];
        //! SAID RATHER THAN SWALLOWED. Where two corners' set-backs overlap on
        //! one leg the radius is shrunk to fit - which is better than failing
        //! and much worse than silent, because the run now turns tighter than
        //! the number in the panel says it does.
        if (tightest !== null) said.push("tightest " + Math.round(tightest) + " mm");
        if ((path.tight || []).length)
          said.push(path.tight.length + " corner(s) shrunk to fit the leg");
        return { shape: wire, data: K.text(said) };
      },
    },

    Cable: {
      precondition: f => {
        const route = KF.reference(f, "route");
        if (!route) return "no route to run along";
        if (!KF.shape(route)) return K.F.name(route) + " has not been built";
        return null;
      },
      build: f => {
        const spec = CABLE_TYPES[K.F.choice(f, "cable", 0)] || cableType("cat6a");
        const supplier = String(KF.code(f, "supplier", "") || "").trim();
        const bill = [spec.name, spec.from + (supplier ? " · " + supplier : "")];

        //! THE BOUGHT PART WINS, as it does on a Fastener: wire a supplier's
        //! own STEP in and nothing is modelled in its place.
        const bought = KF.reference(f, "bought");
        if (bought && KF.shape(bought))
          return { shape: K.asItWas ? K.asItWas(KF.shape(bought)) : KF.shape(bought),
                   data: K.text([...bill, "the bought part, as supplied"]),
                   note: "the bought part" };

        const route = KF.reference(f, "route");
        const path = pathOf(route);
        const spine = KF.shape(route);
        const ends = endsOf(path);
        if (!ends) throw new Error("that route has no direction to run along");

        //! The section, square to the run where it starts - rib turns it along
        //! the rail from there.
        const at = ends.start.at, along = ends.start.along;
        const circle = H.circle(
          new K.oc.gp_Ax2(new K.oc.gp_Pnt(at[0], at[1], at[2]),
                          new K.oc.gp_Dir(along[0], along[1], along[2])),
          spec.od / 2);
        let solid = S.rib(circle, spine);
        //! A PIPE IS A CABLE WITH A BORE. Same route, same sweep, one more cut.
        if (spec.wall) {
          const bore = H.circle(
            new K.oc.gp_Ax2(new K.oc.gp_Pnt(at[0], at[1], at[2]),
                            new K.oc.gp_Dir(along[0], along[1], along[2])),
            spec.od / 2 - spec.wall);
          solid = S.remove(solid, S.rib(bore, spine));
        }

        const parts = [solid];
        const first = CONNECTORS[K.F.choice(f, "startEnd", 0)];
        const last = CONNECTORS[K.F.choice(f, "endEnd", 0)];
        const a = connectorAt(first, ends.start, true);
        const b = connectorAt(last, ends.end, false);
        if (a) { parts.push(a); bill.push("start: " + first.name + " · " + first.from); }
        if (b) { parts.push(b); bill.push("end: " + last.name + " · " + last.from); }

        //! WHETHER IT IS LEGAL FOR WHAT IS IN IT. Reported on the feature, so
        //! it is in the tree next to the run rather than in a console nobody
        //! reads - and named by corner, because "somewhere it is too tight" is
        //! not something anybody can act on.
        const verdict = checkRoute(path, spec, true);
        bill.push(Math.round(path.length) + " mm of cable");
        const note = verdict.ok ? null
          : verdict.tight.length + " corner(s) tighter than the "
            + Math.round(verdict.least) + " mm this cable bends to";
        if (note) bill.push(note);
        else bill.push("bends to " + Math.round(verdict.least) + " mm, and does not go under it");

        return { shape: parts.length === 1 ? parts[0] : S.assemble(parts),
                 data: K.text(bill), ...(note ? { note } : {}) };
      },
    },
  };
}

export const HARNESS = offerPlugin({
  id: "harness",
  name: "Wiring & piping",
  version: 1,
  summary: "Cable and pipe runs the way a wiring workbench does them: a route that says "
         + "where a run goes and how tightly it may turn, a cable or pipe that says what "
         + "is in it, and a connector on each end. Diameters and bend limits come from "
         + "named standards, so a run that is too tight for the fibre in it says which "
         + "corner.",
  needs: [],
  nodes: HARNESS_NODES,
  async start(kit) {
    return { drivers: harnessDrivers(kit) };
  },
});
