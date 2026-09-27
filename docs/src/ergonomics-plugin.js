// The Human Ergonomics package: a rigged mannequin, its reach, and its walk.
//
// A modeller that can hold a machine room but cannot say whether somebody can
// reach the top of a rack, get down the aisle beside it, or stand up under the
// runway has not modelled the thing anybody is actually asking about. That is
// what Delmia, Jack and Ramsis are for, and it is one question asked four ways:
// can they REACH it, can they SEE it, can they FIT, and can they HOLD the
// posture it takes. This package answers the first, the third and the fourth,
// and gives the eye position for the second.
//
// WHY A WOODEN MANNEQUIN and not the entourage figures. An entourage figure is
// a photograph of a person: it is the right size and it is there to be looked
// at. A mannequin is a MECHANISM - every joint is a number somebody can set,
// and what it is for is to be put in a posture and measured. The two are
// different tools and this package is the second one; the Racks package's
// Entourage node is the first.
//
// EVERY NUMBER COMES OUT OF ergonomics.js, where it sits against the paper it
// came from - Drillis & Contini for the segment lengths, Winter for the masses,
// the Froude relation for walking speed. Nothing here invents a dimension. What
// this file does is turn those numbers into geometry and into answers.
//
// AND WHAT IS NOT CLAIMED. A real ergonomics tool picks a POPULATION - ANSUR
// II, a national survey, a percentile within one - because a 5th percentile
// woman and a 95th percentile man are not one body scaled. This package does
// not ship those tables and will not invent them: the proportions are set
// explicitly instead, as multipliers on a published mean, which is what
// actually moves a reach envelope. Give it a table and they become presets.

import { ARG } from "./ocaf.js";
import { offerPlugin } from "./plugin.js";
import { GRIP, NECK_PITCH_DOWN, NECK_PITCH_UP, NECK_YAW, PREFERRED_FROUDE, RUN_FROUDE,
         canReach, centreOfMass, gait, lookAt, pose, proportions, reaches,
         walkOf } from "./ergonomics.js";

/* -------------------------------------------------------------- the nodes */

//! HOW IT IS HELD UP, and the controls change with it - which is the whole of
//! what "support" means. Standing on a point you set three offsets; on a plane
//! you set two, across and along; on a curve you set one, how far down it. And
//! whichever it is, the figure turns about its own axis.
const SUPPORTS = ["A point", "A plane", "A curve"];
const ENVELOPES = ["Off", "Circles", "Spheres"];

export const ERGO_NODES = [
  { type: "Mannequin", guid: "9a1b2c31-0001-4c00-9e00-caf100000001", category: "body",
    produces: "solid",
    summary: "A rigged wooden mannequin, to a stature and a build, in a posture you set. "
           + "Every segment length is a published fraction of stature, so a 1.9 m figure "
           + "has a 1.9 m person's reach rather than a scaled-up drawing - and every "
           + "joint is a number: how far the hips are dropped, how far the trunk is bent "
           + "and turned, where each arm points, where the head looks. Wire something "
           + "into Looking at and the head turns to it as far as a neck turns, and says "
           + "when that is not far enough. It reports its own centre of mass and whether "
           + "that falls over its feet, which is what makes a posture one somebody could "
           + "actually hold.",
    args: [ARG.ref("plane", "Plane", ["plane"]),
           //! WHAT IT STANDS ON. Optional: a mannequin with nothing wired in
           //! stands on its plane's origin, which is what everything else in
           //! this program does.
           ARG.choice("support", "Stands on", SUPPORTS, 0),
           ARG.spare("on", "Support", ["point", "plane", "curve"]),
           ARG.when(ARG.real("dx", "Across", 0, -100000, 100000, 10), "support", 0),
           ARG.when(ARG.real("dy", "Along", 0, -100000, 100000, 10), "support", 0),
           ARG.when(ARG.real("dz", "Up", 0, -100000, 100000, 10), "support", 0),
           ARG.when(ARG.real("h", "Across the plane", 0, -100000, 100000, 10), "support", 1),
           ARG.when(ARG.real("v", "Along the plane", 0, -100000, 100000, 10), "support", 1),
           //! ON A CURVE IT IS A LENGTH, not a fraction. "Four metres down the
           //! aisle" is a thing somebody says; "0.36 of the way along" is not,
           //! and it changes meaning the moment the aisle gets longer.
           ARG.when(ARG.real("along", "Along the path", 0, 0, 1000000, 50), "support", 2),
           ARG.real("turn", "Facing", 0, -360, 360, 15, "°"),

           ARG.real("stature", "Stature", 1727, 900, 2200, 5),
           //! THE BUILD, as multipliers on the published means. Longer legs on
           //! the same stature is a shorter trunk, which is what the words mean
           //! and what the arithmetic does.
           ARG.real("arms", "Arm length", 1, 0.7, 1.3, 0.01, ""),
           ARG.real("legs", "Leg length", 1, 0.7, 1.3, 0.01, ""),
           ARG.real("torso", "Torso length", 1, 0.7, 1.3, 0.01, ""),
           ARG.real("shoulders", "Shoulder width", 1, 0.7, 1.4, 0.01, ""),
           ARG.real("girth", "Girth", 1, 0.6, 1.8, 0.01, ""),

           //! THE PELVIS WIDGET'S NUMBER. 0 is standing, 1 is a full squat -
           //! and the hips go BACK as they go down, because straight down is a
           //! posture nobody can hold.
           ARG.real("squat", "Hips down", 0, 0, 1, 0.01, ""),
           ARG.real("lean", "Trunk bend", 0, -30, 90, 1, "°"),
           ARG.real("twist", "Trunk turn", 0, -90, 90, 1, "°"),

           ARG.real("leftOut", "Left arm out", 8, -30, 180, 1, "°"),
           ARG.real("leftUp", "Left arm forward", 0, -60, 180, 1, "°"),
           ARG.real("leftElbow", "Left elbow", 0, 0, 150, 1, "°"),
           ARG.real("rightOut", "Right arm out", 8, -30, 180, 1, "°"),
           ARG.real("rightUp", "Right arm forward", 0, -60, 180, 1, "°"),
           ARG.real("rightElbow", "Right elbow", 0, 0, 150, 1, "°"),

           //! THE HEAD, two ways. With nothing wired into Looking at it is the
           //! two angles; with something wired in they are worked out from it
           //! and shown, so switching between the two is not a jump.
           ARG.spare("lookAt", "Looking at", ARG.ANY),
           ARG.real("headYaw", "Head turn", 0, -90, 90, 1, "°"),
           ARG.real("headPitch", "Head tilt", 0, -60, 45, 1, "°"),
           ARG.text("name", "Who", "", "a name for this person") ] },

  { type: "ReachEnvelope", guid: "9a1b2c31-0002-4c00-9e00-caf100000002",
    category: "analysis", produces: "curve",
    summary: "The volume a mannequin's hands can work in, drawn - the normal working "
           + "area the forearm sweeps, the maximum the whole arm reaches, and the "
           + "extended one it gets to by bending forward. A separate feature so it can "
           + "be switched off in the tree and given its own transparency, which is what "
           + "you want of something drawn over the thing it is about. Circles are three "
           + "great circles a shoulder, the way the Vitruvian figure is drawn; Spheres "
           + "is the surface, for looking through.",
    args: [ARG.ref("of", "Of", ["solid"], false),
           ARG.choice("draw", "Draw", ENVELOPES, 1),
           ARG.choice("which", "Which", ["Normal", "Maximum", "Both", "All three"], 2),
           ARG.choice("arms", "Arms", ["Both", "Left", "Right"], 0)] },

  { type: "Reach", guid: "9a1b2c31-0003-4c00-9e00-caf100000003",
    category: "analysis", produces: "text",
    summary: "Whether a mannequin can reach a point, and by how much it misses. The "
           + "answer is which envelope the point falls in - normal, maximum, reachable "
           + "only by bending forward, or out of reach - because those are four "
           + "different findings: work that happens all day belongs inside the normal "
           + "one, and a thing 300 mm outside maximum is a thing somebody needs a step "
           + "for.",
    args: [ARG.ref("of", "Mannequin", ["solid"], false),
           ARG.ref("to", "Reach to", ["point", "solid", "curve", "plane"], false),
           ARG.choice("hand", "Hand", ["Either", "Left", "Right"], 0),
           ARG.real("bend", "Bending to", 45, 0, 90, 5, "°")] },

  { type: "Gait", guid: "9a1b2c31-0004-4c00-9e00-caf100000004",
    category: "analysis", produces: "text",
    summary: "How long it takes this person to walk that path, and at what pace. Speed "
           + "comes out of LEG LENGTH rather than stature - the Froude relation, which "
           + "is why a child is not a small adult with the same gait - and step length, "
           + "cadence and the number of steps follow from it. Wire the path a mannequin "
           + "is standing on into it and drag the mannequin along: what it reports is "
           + "the walk that placement is part of.",
    args: [ARG.ref("of", "Mannequin", ["solid"], false),
           ARG.ref("path", "Path", ["curve"], false),
           ARG.real("effort", "Froude number", PREFERRED_FROUDE, 0.02, 0.8, 0.01, ""),
           ARG.real("load", "Carrying", 0, 0, 50, 1, "kg")] },
];

/* ------------------------------------------------------------ the drivers */

function ergoDrivers(kit) {
  const K = kit.toolkit();
  const { F: KF, hybrid: H, shape: S } = K;

  const vsub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const vlen = a => Math.hypot(a[0], a[1], a[2]);
  const vunit = a => { const n = vlen(a); return n > 1e-12 ? [a[0] / n, a[1] / n, a[2] / n] : [0, 0, 1]; };

  //! THE FRAME A MANNEQUIN STANDS IN. Its own x is across its body, y is the
  //! way it faces and z is up, and the origin is between its feet - so the
  //! whole of `pose` is in this frame and the only thing that happens here is
  //! putting that frame somewhere.
  const standing = f => {
    const plane = KF.reference(f, "plane");
    const ax = plane ? K.planeAxis(plane) : null;
    let origin = [0, 0, 0], x = [1, 0, 0], z = [0, 0, 1];
    if (ax) {
      const at = ax.Location(), dir = ax.Direction(), along = ax.XDirection();
      origin = [at.X(), at.Y(), at.Z()];
      z = [dir.X(), dir.Y(), dir.Z()];
      x = [along.X(), along.Y(), along.Z()];
    }
    const support = KF.choice(f, "support", 0);
    const on = KF.reference(f, "on");
    //! WHERE IT STANDS, and the three cases are three different questions.
    if (support === 2 && on) {
      //! ALONG A CURVE, BY LENGTH. A distance is what somebody says - "four
      //! metres down the aisle" - and it keeps meaning the same thing when the
      //! aisle gets longer, which a fraction does not.
      //!
      //! THE WIRE, and it takes two steps: wireFrom wants a SHAPE and
      //! sampleCurve wants a WIRE, so handing either a feature comes back as
      //! "Cannot pass [object Object] as a TopoDS_Wire" or "shape.ShapeType is
      //! not a function" - both of which name a type and not the mistake.
      const path = KF.shape(on);
      const wire = path && !path.IsNull() ? K.wireFrom(path) : null;
      const curve = wire ? K.sampleCurve(wire, 400) : null;
      if (curve && curve.total > 1e-6) {
        const want = Math.max(0, Math.min(curve.total, KF.real(f, "along", 0)));
        //! byLength, not the parameter: a curve's parameter is not its length
        //! and on anything but a straight line the two are different numbers.
        //! Walking 2.5 m down a path has to be 2.5 m of walking.
        const u = curve.byLength(want / curve.total);
        origin = curve.at(u);
        //! AND FACING THE WAY THE PATH GOES, which is what walking a path
        //! means. Facing is then a turn off that rather than an absolute
        //! bearing, so somebody walking round a corner keeps looking ahead.
        const way = curve.tangent(u);
        const side = vunit([way[1] * z[2] - way[2] * z[1],
                            way[2] * z[0] - way[0] * z[2],
                            way[0] * z[1] - way[1] * z[0]]);
        if (vlen(side) > 0.5) x = side;
      }
    } else if (support === 1 && on) {
      const put = K.planeAxis(on);
      const at = put.Location(), dir = put.Direction(), along = put.XDirection();
      const across = [along.X(), along.Y(), along.Z()];
      z = [dir.X(), dir.Y(), dir.Z()];
      x = across;
      const up = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
      const h = KF.real(f, "h", 0), v = KF.real(f, "v", 0);
      origin = [at.X() + across[0] * h + up[0] * v,
                at.Y() + across[1] * h + up[1] * v,
                at.Z() + across[2] * h + up[2] * v];
    } else {
      const put = on ? K.readPoint(on) : null;
      if (put) origin = put;
      origin = [origin[0] + KF.real(f, "dx", 0), origin[1] + KF.real(f, "dy", 0),
                origin[2] + KF.real(f, "dz", 0)];
    }
    //! AND TURNED ABOUT ITS OWN AXIS, which every support has in common.
    const turn = KF.real(f, "turn", 0) * Math.PI / 180;
    const c = Math.cos(turn), s = Math.sin(turn);
    const y0 = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]];
    const across = [x[0] * c + y0[0] * s, x[1] * c + y0[1] * s, x[2] * c + y0[2] * s];
    const facing = [-x[0] * s + y0[0] * c, -x[1] * s + y0[1] * c, -x[2] * s + y0[2] * c];
    return { origin, x: across, y: facing, z };
  };

  const world = (frame, p) => [
    frame.origin[0] + frame.x[0] * p[0] + frame.y[0] * p[1] + frame.z[0] * p[2],
    frame.origin[1] + frame.x[1] * p[0] + frame.y[1] * p[1] + frame.z[1] * p[2],
    frame.origin[2] + frame.x[2] * p[0] + frame.y[2] * p[1] + frame.z[2] * p[2],
  ];
  //! And back again, which is what a look-at target needs: it is picked in the
  //! world and the pose is solved in the body's own frame.
  const local = (frame, p) => {
    const d = vsub(p, frame.origin);
    return [d[0] * frame.x[0] + d[1] * frame.x[1] + d[2] * frame.x[2],
            d[0] * frame.y[0] + d[1] * frame.y[1] + d[2] * frame.y[2],
            d[0] * frame.z[0] + d[1] * frame.z[1] + d[2] * frame.z[2]];
  };

  //! WHERE A THING IS, for looking at and for reaching to. A point is where it
  //! is; anything else is the middle of its bounding box, which is what
  //! "look at that rack" means.
  const somewhere = one => {
    if (!one) return null;
    const point = K.readPoint(one);
    if (point) return point;
    const shape = KF.shape(one);
    if (shape && !shape.IsNull()) {
      const box = K.extents(shape);
      if (box) return [(box.low[0] + box.high[0]) / 2, (box.low[1] + box.high[1]) / 2,
                       (box.low[2] + box.high[2]) / 2];
    }
    const data = KF.data(one);
    if (data && data.kind === "mesh") {
      const pts = K.F.triples(data);
      if (pts.length) {
        const lo = [0, 1, 2].map(k => Math.min(...pts.map(p => p[k])));
        const hi = [0, 1, 2].map(k => Math.max(...pts.map(p => p[k])));
        return [0, 1, 2].map(k => (lo[k] + hi[k]) / 2);
      }
    }
    return null;
  };

  //! ONE PLACE THE POSTURE IS WORKED OUT, and every node that needs it asks
  //! here. A reach envelope that solved the pose for itself is a reach envelope
  //! that can disagree with the figure it is drawn around - which is the one
  //! thing it must never do.
  const posedOf = f => {
    const body = proportions(KF.real(f, "stature", 1727), {
      arms: KF.real(f, "arms", 1), legs: KF.real(f, "legs", 1),
      torso: KF.real(f, "torso", 1), shoulders: KF.real(f, "shoulders", 1),
      girth: KF.real(f, "girth", 1),
    });
    const frame = standing(f);
    const set = {
      squat: KF.real(f, "squat", 0),
      lean: KF.real(f, "lean", 0),
      twist: KF.real(f, "twist", 0),
      leftArm: { out: KF.real(f, "leftOut", 8), up: KF.real(f, "leftUp", 0),
                 elbow: KF.real(f, "leftElbow", 0) },
      rightArm: { out: KF.real(f, "rightOut", 8), up: KF.real(f, "rightUp", 0),
                  elbow: KF.real(f, "rightElbow", 0) },
      headYaw: KF.real(f, "headYaw", 0), headPitch: KF.real(f, "headPitch", 0),
    };
    //! LOOKING AT SOMETHING is the same two angles, worked out instead of set -
    //! so the panel shows what the look-at came to and switching it off leaves
    //! the head where it was rather than snapping it straight.
    const target = somewhere(KF.reference(f, "lookAt"));
    let looking = null;
    if (target) {
      const first = pose(body, set);
      looking = lookAt(local(frame, world(frame, first.eye)) , local(frame, target),
                       first.facing, first.across, first.up);
      set.headYaw = looking.yaw;
      set.headPitch = looking.pitch;
    }
    return { body, frame, set, looking, posed: pose(body, set) };
  };

  //! A BONE: a cylinder from one joint to the next, with a ball at each end.
  //! That is what a wooden mannequin IS - the balls are the joints and you can
  //! see where they are, which is the whole reason the thing is built this way
  //! rather than as a smooth figure.
  const bone = (frame, a, b, radius) => {
    const from = world(frame, a), to = world(frame, b);
    const span = vsub(to, from);
    const long = vlen(span);
    const out = [];
    if (long > 0.5) {
      const way = vunit(span);
      out.push(S.cylinder(new K.oc.gp_Ax2(new K.oc.gp_Pnt(from[0], from[1], from[2]),
                                          new K.oc.gp_Dir(way[0], way[1], way[2])),
                          radius, long));
    }
    return out;
  };
  const ball = (frame, at, radius) => {
    const p = world(frame, at);
    return S.sphere(new K.oc.gp_Ax2(new K.oc.gp_Pnt(p[0], p[1], p[2]),
                                    new K.oc.gp_Dir(0, 0, 1)), radius);
  };
  //! A block between two points, square to the body - the pelvis and the chest,
  //! which are not limbs and should not read as ones.
  //! A BOX FROM ONE POINT TO ANOTHER, `wide` across the body and `deep` fore
  //! and aft. An Ax2's own Y is its Z crossed with its X, so the corner has to
  //! be offset along THAT and not along the body's forward direction - the two
  //! are the same for an upright trunk and opposite for a foot, which is how
  //! this first put every figure's feet 74 mm below the floor it was standing
  //! on. Nothing on screen said so: the soles were simply inside the slab.
  const block = (frame, a, b, wide, deep, along) => {
    const from = world(frame, a), to = world(frame, b);
    const span = vsub(to, from);
    const long = vlen(span);
    if (long < 0.5) return [];
    const way = along ? vunit(along) : vunit(span);
    const side = vunit(frame.x);
    const yAxis = [way[1] * side[2] - way[2] * side[1],
                   way[2] * side[0] - way[0] * side[2],
                   way[0] * side[1] - way[1] * side[0]];
    const height = along ? Math.abs(span[0] * way[0] + span[1] * way[1] + span[2] * way[2])
                         : long;
    const corner = [from[0] - side[0] * wide / 2 - yAxis[0] * deep / 2,
                    from[1] - side[1] * wide / 2 - yAxis[1] * deep / 2,
                    from[2] - side[2] * wide / 2 - yAxis[2] * deep / 2];
    return [S.box(new K.oc.gp_Ax2(new K.oc.gp_Pnt(corner[0], corner[1], corner[2]),
                                  new K.oc.gp_Dir(way[0], way[1], way[2]),
                                  new K.oc.gp_Dir(side[0], side[1], side[2])),
                  wide, deep, Math.max(0.5, height))];
  };
  //! A FOOT, which is the one part of a mannequin that is not between two
  //! joints: it is a sole on the floor with the ankle above it. Built upright
  //! from the floor so a figure standing on a plane has its soles ON it.
  const foot = (frame, ankle, wide, longways, tall) => {
    const side = vunit(frame.x);
    const heel = [ankle[0] - wide / 2, ankle[1] - longways * 0.3, 0];
    const p = world(frame, heel);
    return [S.box(new K.oc.gp_Ax2(new K.oc.gp_Pnt(p[0], p[1], p[2]),
                                  new K.oc.gp_Dir(frame.z[0], frame.z[1], frame.z[2]),
                                  new K.oc.gp_Dir(side[0], side[1], side[2])),
                  wide, longways, tall)];
  };

  return {
    Mannequin: {
      precondition: f => {
        if (KF.real(f, "stature", 1727) < 300) return "a person needs a stature";
        if (KF.choice(f, "support", 0) !== 0 && !KF.reference(f, "on"))
          return "nothing wired into Support - wire the "
            + (KF.choice(f, "support", 0) === 1 ? "plane" : "path") + " it stands on";
        return null;
      },
      build: f => {
        const { body, frame, posed, looking } = posedOf(f);
        const b = body;
        //! THE LIMB RADII, all off girth, so a stocky figure is stocky
        //! everywhere rather than a thin figure with a wide chest.
        const g = KF.real(f, "girth", 1);
        const limb = b.stature * 0.026 * g;
        const joint = limb * 1.25;
        const parts = [];

        for (const side of ["L", "R"]) {
          const hip = posed["hip" + side], knee = posed["knee" + side],
                ankle = posed["ankle" + side];
          parts.push(...bone(frame, hip, knee, limb * 1.15));
          parts.push(...bone(frame, knee, ankle, limb));
          parts.push(ball(frame, hip, joint), ball(frame, knee, joint * 0.9),
                     ball(frame, ankle, joint * 0.75));
          //! A FOOT, and it points where the body faces. It is the base of
          //! support, so it is not decoration: the balance check is about it.
          parts.push(...foot(frame, ankle, b.footWidth, b.foot, b.ankle * 1.1));
        }

        //! A PELVIS, A WAIST AND A CHEST, and not one slab from the hips to the
        //! shoulders. A wooden mannequin's trunk is two blocks with a ball
        //! between them - that is what makes it read as a thing that bends, and
        //! it is also what stops the arms hanging inside it: as one block the
        //! full width of the shoulders it swallowed them, and a figure with its
        //! arms inside its chest is a figure whose reach you cannot see.
        const mix = (a, c, t) => [a[0] + (c[0] - a[0]) * t, a[1] + (c[1] - a[1]) * t,
                                  a[2] + (c[2] - a[2]) * t];
        const waist = mix(posed.pelvis, posed.chest, 0.36);
        parts.push(...block(frame, posed.pelvis, waist,
                            b.hipWidth * 1.08, b.chestDepth * 0.74));
        parts.push(ball(frame, waist, joint * 1.05));
        parts.push(...block(frame, mix(posed.pelvis, posed.chest, 0.44), posed.chest,
                            b.shoulderWidth * 0.80, b.chestDepth * 0.82));
        parts.push(ball(frame, posed.pelvis, joint * 1.2));

        for (const which of ["left", "right"]) {
          const arm = posed[which];
          parts.push(...bone(frame, arm.shoulder, arm.elbow, limb * 0.85));
          parts.push(...bone(frame, arm.elbow, arm.wrist, limb * 0.72));
          parts.push(ball(frame, arm.shoulder, joint), ball(frame, arm.elbow, joint * 0.8),
                     ball(frame, arm.wrist, joint * 0.6));
          //! THE GRIP, drawn as the ball it is measured to. What a hand can use
          //! a thing at is about the middle of the grip and not the fingertip,
          //! and the reach envelopes are drawn to the same point - so the ball
          //! IS the reach.
          parts.push(ball(frame, arm.grip, joint * 0.55));
        }

        parts.push(...bone(frame, posed.chest, posed.neck, limb * 0.8));
        //! THE HEAD, whose top IS the stature. A sphere half a head high,
        //! centred so that standing upright the crown lands exactly on the
        //! stature asked for - which makes "is this figure 1727 tall" a thing
        //! that can be measured off the solid rather than taken on trust.
        parts.push(ball(frame, posed.headCentre, b.headHeight / 2));
        //! The nose, which is the only way to tell from across the room which
        //! way a head is turned. A wooden mannequin has none; without one this
        //! node's look-at is invisible, which makes it useless.
        parts.push(ball(frame, posed.eye, b.headHeight * 0.13));

        const mass = centreOfMass(posed);
        const span = reaches(body);
        const said = [
          (KF.code(f, "name", "") || "Mannequin") + " · "
            + Math.round(b.stature) + " mm, " + Math.round(b.mass) + " kg at BMI 23",
          "eye " + Math.round(posed.eye[2]) + " · shoulder "
            + Math.round(posed.left.shoulder[2]) + " · grip reach "
            + Math.round(span.maximum) + " (normal " + Math.round(span.normal) + ")",
          "centre of mass " + Math.round(mass.at[2]) + " up, "
            + (mass.balanced ? Math.round(mass.margin) + " mm inside the feet"
                             : Math.round(-mass.margin) + " mm OUTSIDE the feet"),
          "segments: Drillis & Contini 1966 · masses: Winter",
        ];
        if (looking) {
          said.push("looking " + Math.round(looking.yaw) + "° across, "
            + Math.round(looking.pitch) + "° up"
            + (looking.beyond > 0.5
               ? " · " + Math.round(looking.beyond) + "° further than a neck turns"
               : ""));
        }
        const note = !mass.balanced
          ? "the centre of mass is " + Math.round(-mass.margin)
            + " mm outside the feet - nobody holds this posture"
          : looking && looking.beyond > 0.5
            ? "that is " + Math.round(looking.beyond) + "° beyond a comfortable neck "
              + "(" + NECK_YAW + "° across, " + NECK_PITCH_UP + " up / "
              + NECK_PITCH_DOWN + " down) - they would turn their body"
            : null;
        if (note && !said.includes(note)) said.push(note);
        return { shape: K.compoundOf(parts.filter(Boolean)), data: K.text(said),
                 ...(note ? { note } : {}) };
      },
    },

    ReachEnvelope: {
      precondition: f => (KF.reference(f, "of") ? null : "nothing wired in"),
      build: f => {
        const of = KF.reference(f, "of");
        const spec = KF.spec(of);
        if (!spec || spec.type !== "Mannequin")
          throw new Error(KF.name(of) + " is not a mannequin");
        const { body, frame, posed } = posedOf(of);
        const draw = KF.choice(f, "draw", 1);
        const which = KF.choice(f, "which", 2);
        const arms = KF.choice(f, "arms", 0);
        if (draw === 0) return { data: K.text(["off"]) };

        const span = reaches(body);
        const radii = [];
        if (which === 0 || which === 2 || which === 3) radii.push(["normal", span.normal]);
        if (which >= 1) radii.push(["maximum", span.maximum]);

        const shoulders = [];
        if (arms !== 2) shoulders.push(posed.left.shoulder);
        if (arms !== 1) shoulders.push(posed.right.shoulder);
        //! THE THIRD ENVELOPE IS THE SAME SPHERE SOMEWHERE ELSE - the maximum
        //! one about the shoulder as it is when the figure bends forward, which
        //! is what "extended reach" IS. Drawn as a bigger sphere about the
        //! upright shoulder - which is what a scalar extended reach amounts to -
        //! it would claim that bending forward helps you reach something
        //! overhead, and it does the opposite.
        let bentTo = 0;
        if (which === 3) {
          bentTo = 45;
          //! Balance off, for the same reason the Reach node has it off: this
          //! is the envelope of a moment, not of a posture held all day.
          const leaned = pose(body, { ...posedOf(of).set, lean: bentTo, balance: false });
          if (arms !== 2) shoulders.push(leaned.left.shoulder);
          if (arms !== 1) shoulders.push(leaned.right.shoulder);
        }

        const parts = [];
        for (const at of shoulders) {
          const p = world(frame, at);
          const centre = new K.oc.gp_Pnt(p[0], p[1], p[2]);
          for (const [, r] of radii) {
            if (draw === 2) {
              parts.push(S.sphere(new K.oc.gp_Ax2(centre, new K.oc.gp_Dir(0, 0, 1)), r));
            } else {
              //! THREE GREAT CIRCLES, which is how the Vitruvian figure is
              //! drawn and is the least that reads as a sphere without hiding
              //! the person inside it.
              for (const way of [frame.z, frame.x, frame.y])
                parts.push(H.circle(new K.oc.gp_Ax2(centre,
                  new K.oc.gp_Dir(way[0], way[1], way[2])), r));
            }
          }
        }
        const said = [ENVELOPES[draw] + " · " + shoulders.length
                        + (shoulders.length === 1 ? " shoulder" : " shoulders")
                        + (bentTo ? ", the last bent " + bentTo + "° forward" : ""),
                      ...radii.map(([name, r]) => "  " + name + " " + Math.round(r) + " mm"),
                      "to the middle of the grip, not the fingertip · "
                        + "normal is the forearm alone, which is where work that "
                        + "happens all day belongs"];
        return { shape: K.compoundOf(parts), data: K.text(said) };
      },
    },

    Reach: {
      precondition: f => {
        if (!KF.reference(f, "of")) return "no mannequin wired in";
        if (!KF.reference(f, "to")) return "nothing wired in to reach for";
        return null;
      },
      build: f => {
        const of = KF.reference(f, "of");
        const spec = KF.spec(of);
        if (!spec || spec.type !== "Mannequin")
          throw new Error(KF.name(of) + " is not a mannequin");
        const { body, frame, posed } = posedOf(of);
        const target = somewhere(KF.reference(f, "to"));
        if (!target) throw new Error("that has nowhere to reach to");
        const bend = KF.real(f, "bend", 45);
        const hand = KF.choice(f, "hand", 0);
        //! THE SAME FIGURE, BENT FORWARD, solved rather than approximated. The
        //! third envelope is this arm about THAT shoulder, and for something
        //! overhead the bent shoulder is FURTHER from it - which is true, and is
        //! what a scalar "extended reach" gets backwards: the first version of
        //! this told a 1.9 m person they could reach the top of a 48U rack by
        //! bending forward, which is the exact opposite of what happens.
        //! BALANCE OFF FOR THE BENT SHOULDER, and that is not a shortcut. A
        //! posture somebody HOLDS has to have its mass over its feet, so the
        //! Mannequin solves the hips back until it does. A REACH is not held -
        //! it is a moment, and a person reaching forward is momentarily out of
        //! static balance and catching themselves. Solved for balance the hips
        //! go back as far as the trunk comes forward and the shoulder barely
        //! travels, which said a 1.9 m person could not reach a point at waist
        //! height 700 in front of them. They can; they just cannot stand there.
        const leaned = pose(body, { ...posedOf(of).set, lean: bend, balance: false });
        const tries = [];
        if (hand !== 2) tries.push(["left", posed.left.shoulder, leaned.left.shoulder]);
        if (hand !== 1)
          tries.push(["right", posed.right.shoulder, leaned.right.shoulder]);
        let best = null;
        for (const [name, at, bent] of tries) {
          const got = canReach(body, world(frame, at), target, world(frame, bent));
          if (!best || got.nearest < best.got.nearest) best = { name, got };
        }
        const g = best.got;
        const said = [
          KF.name(KF.reference(f, "to")) + " is " + Math.round(g.away)
            + " mm from the " + best.name + " shoulder",
          g.zone === "normal" ? "inside the NORMAL working area - fine all day"
          : g.zone === "maximum" ? "inside MAXIMUM reach - occasional work only"
          : g.zone === "extended" ? "only by bending " + bend + "° forward"
          : "OUT OF REACH by " + Math.round(g.over) + " mm",
          "normal " + Math.round(g.normal) + " · maximum " + Math.round(g.maximum)
            + " · bent " + bend + "° the shoulder is " + Math.round(g.leaning)
            + " away" + (g.helped ? " - nearer"
                                  : " - FURTHER, so bending does not help"),
        ];
        const note = g.zone === "out of reach"
          ? "out of reach by " + Math.round(g.over) + " mm"
          : g.zone === "extended"
            ? "reachable only by bending " + bend + "° forward"
            : null;
        return { data: K.text(said), ...(note ? { note } : {}) };
      },
    },

    Gait: {
      precondition: f => {
        if (!KF.reference(f, "of")) return "no mannequin wired in";
        if (!KF.reference(f, "path")) return "no path wired in";
        return null;
      },
      build: f => {
        const of = KF.reference(f, "of");
        const spec = KF.spec(of);
        if (!spec || spec.type !== "Mannequin")
          throw new Error(KF.name(of) + " is not a mannequin");
        const { body } = posedOf(of);
        const path = KF.reference(f, "path");
        const shape = KF.shape(path);
        if (!shape || shape.IsNull()) throw new Error(KF.name(path) + " has not been built");
        const wire = K.wireFrom(shape);
        if (!wire) throw new Error(KF.name(path) + " is not a curve to walk");
        //! sampleCurve hands back an arc-length table, and `total` is the
        //! length of the path - which is the one number a walk is over.
        const run = K.sampleCurve(wire, 400).total;
        const effort = KF.real(f, "effort", PREFERRED_FROUDE);
        const walk = walkOf(body, run, effort);
        //! CARRYING SOMETHING SLOWS SOMEBODY DOWN, and by a published amount:
        //! about 1% of preferred speed per 1% of body mass carried, up to a
        //! third of body mass. Named as the linear fit it is, over the range
        //! it was fitted on, because outside that range it is a guess.
        const load = KF.real(f, "load", 0);
        const share = body.mass > 0 ? load / body.mass : 0;
        const slower = Math.max(0.4, 1 - share);
        const said = [
          Math.round(run) + " mm of path · "
            + (walk.seconds / slower).toFixed(1) + " s at "
            + (walk.speed * slower).toFixed(2) + " m/s",
          "leg " + (walk.legs * 1000).toFixed(0) + " mm · Froude "
            + effort.toFixed(2) + (walk.running ? " - that is a RUN, not a walk" : ""),
          "step " + Math.round(walk.step * 1000) + " mm · "
            + Math.round(walk.cadence * slower) + " steps a minute · "
            + Math.round(walk.steps) + " steps",
          "speed from leg length by the Froude relation, step from stature "
            + "(Grieve & Gear) - not a measurement of this person",
        ];
        if (load > 0)
          said.push("carrying " + Math.round(load) + " kg, "
            + Math.round(share * 100) + "% of body mass · "
            + Math.round((1 - slower) * 100) + "% slower, by the 1%-per-1% linear fit");
        const note = walk.running
          ? "Froude " + effort.toFixed(2) + " is past the walk-run transition at "
            + RUN_FROUDE + " - this figure is running"
          : null;
        return { data: K.text(said), ...(note ? { note } : {}) };
      },
    },
  };
}

export const ERGO = offerPlugin({
  id: "ergonomics",
  name: "Human Ergonomics",
  version: 1,
  summary: "A rigged wooden mannequin whose every segment is a published fraction of "
         + "stature, posed by numbers anybody would say out loud, with its reach "
         + "envelopes drawn, its centre of mass checked against its own feet, and its "
         + "walking speed worked out from its leg length. For asking whether somebody "
         + "can reach it, see it, fit past it and hold the posture it takes.",
  needs: [],
  nodes: ERGO_NODES,
  api: {
    name: "ErgonomicsFactory",
    summary: "The body, as numbers: proportions, reaches, gait and balance.",
    operations: [
      { name: "proportions", takes: "stature, build", gives: "body",
        summary: "Every segment length, from Drillis & Contini's fractions of stature." },
      { name: "reaches", takes: "body, lean", gives: "envelopes",
        summary: "Normal, maximum and extended working areas, to the grip." },
      { name: "gait", takes: "body, froude", gives: "walk",
        summary: "Speed from leg length by the Froude relation, with step and cadence." },
      { name: "centreOfMass", takes: "posed", gives: "balance",
        summary: "Where the mass is and how far inside the feet it falls." },
    ],
  },
  drivers: ergoDrivers,
  async start() {
    //! Nothing to unpack: the whole package is a few dozen published numbers,
    //! and they are in the source where they can be read against their papers.
    return { segments: "Drillis & Contini 1966", masses: "Winter" };
  },
});
