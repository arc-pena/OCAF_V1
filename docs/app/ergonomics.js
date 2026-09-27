// The human body, as numbers.
//
// A modeller that can hold a machine room but cannot say whether a person can
// reach the top of a rack, get down the aisle beside it, or stand up under the
// runway has not modelled the thing anybody is actually asking about. That is
// what an ergonomics tool is for - Delmia's, Jack's, Ramsis' - and the whole of
// it rests on a table of body proportions and a few published relations.
//
// NOTHING HERE TOUCHES THE KERNEL OR THE DOM. It is arithmetic over numbers, so
// every figure below can be checked against the paper it came from without a
// browser and without a solid. The package that draws a mannequin reads this;
// so does the one that asks whether a point can be reached.
//
// WHERE THE NUMBERS COME FROM, one by one, because in this field the difference
// between a computed number and a plausible one is the difference between an
// answer and a decoration:
//
//   SEGMENT LENGTHS are Drillis & Contini (1966), the table every biomechanics
//   text reproduces: each segment as a fraction of stature. It is a mean for an
//   adult population and it is the reason a 1.9 m person's arm is longer than a
//   1.6 m person's by the same ratio, which is roughly - not exactly - true.
//
//   SEGMENT MASSES are Winter, *Biomechanics and Motor Control of Human
//   Movement*, as fractions of body mass. They are here so the centre of mass
//   can be computed, which is what turns a posture into a question about
//   balance.
//
//   PREFERRED WALKING SPEED is the Froude relation, v = sqrt(Fr g L) with L the
//   leg length: people of different sizes walk at the same DIMENSIONLESS speed,
//   not the same speed. Fr = 0.25 is the preferred-walking figure; the walk-run
//   transition is about 0.5. Alexander, *Principles of Animal Locomotion*.
//
//   STEP LENGTH is Grieve & Gear's 0.415 of stature, and cadence follows from
//   the two, which is how a gait is specified.
//
// AND WHAT IS NOT HERE, said plainly. A real ergonomics tool picks a POPULATION
// - ANSUR II, a national survey, a percentile within one - because a 5th
// percentile Japanese woman and a 95th percentile Dutch man are not the same
// body scaled. This package does not ship those tables and will not invent
// them, so the proportions are set explicitly instead: arm, leg, torso and
// shoulder as multipliers on the fractions below, which is what actually
// changes a reach envelope. Give it a table and these become presets.

/* ------------------------------------------------------ the body, as ratios */

//! Drillis & Contini (1966). Every length a fraction of stature H. Heights are
//! from the floor; lengths are between the joints named.
export const SEGMENTS = {
  ankle: 0.039,            // floor to the ankle joint
  knee: 0.285,             // floor to the knee joint
  hip: 0.530,              // floor to the hip joint (greater trochanter)
  shoulder: 0.818,         // floor to the shoulder joint (acromion)
  chin: 0.870,             // floor to the chin
  eye: 0.936,              // floor to the eye - which is what "can they see it"
  thigh: 0.245,            // hip to knee
  shank: 0.246,            // knee to ankle
  upperArm: 0.186,         // shoulder to elbow
  forearm: 0.146,          // elbow to wrist
  hand: 0.108,             // wrist to the tip of the middle finger
  foot: 0.152,             // heel to toe
  footWidth: 0.055,
  shoulderWidth: 0.259,    // biacromial
  hipWidth: 0.191,         // bi-trochanteric
  chestDepth: 0.174,
  headHeight: 0.130,
};

//! Winter's segment masses, as fractions of body mass. Used for the centre of
//! mass and nothing else - and the centre of mass is used for one question,
//! which is whether a posture is one somebody could hold.
export const MASSES = {
  head: 0.081, trunk: 0.497, upperArm: 0.028, forearm: 0.016,
  hand: 0.006, thigh: 0.100, shank: 0.0465, foot: 0.0145,
};

//! A NORMAL ADULT MASS FOR A STATURE, so a centre of mass can be computed from
//! a figure whose weight nobody set. BMI 23 is the middle of the healthy band,
//! and it is stated rather than hidden because it is an assumption and not a
//! measurement.
export const massFor = stature => 23 * (stature / 1000) * (stature / 1000);

//! HOW THE PROPORTIONS ARE VARIED. Each one multiplies the fractions above.
//! 1 is the Drillis & Contini mean; a long-armed person is 1.06 and it shows
//! up in the reach envelope, which is the point.
export const BUILD = { arms: 1, legs: 1, torso: 1, shoulders: 1, girth: 1 };

export function proportions(stature, over = {}) {
  const k = { ...BUILD, ...over };
  const H = stature;
  const S = SEGMENTS;
  //! LEG LENGTH IS SCALED AT THE JOINTS, not by stretching the whole figure:
  //! longer legs on the same stature means a shorter trunk, which is what the
  //! word means. So the hip rises and the shoulder stays where the torso
  //! multiplier puts it.
  const thigh = H * S.thigh * k.legs;
  const shank = H * S.shank * k.legs;
  const ankle = H * S.ankle;
  const hip = ankle + thigh + shank;
  const torso = (H * S.shoulder - H * S.hip) * k.torso;
  return {
    stature: H, mass: massFor(H),
    ankle, knee: ankle + shank, hip, thigh, shank,
    shoulder: hip + torso, torso,
    upperArm: H * S.upperArm * k.arms,
    forearm: H * S.forearm * k.arms,
    hand: H * S.hand * k.arms,
    foot: H * S.foot, footWidth: H * S.footWidth * k.girth,
    shoulderWidth: H * S.shoulderWidth * k.shoulders,
    hipWidth: H * S.hipWidth * k.girth,
    chestDepth: H * S.chestDepth * k.girth,
    headHeight: H * S.headHeight,
    //! Where the eyes are, which is the other half of an ergonomic question:
    //! reach says whether a hand gets there, sight says whether anybody can
    //! see it. Carried up and down with the torso rather than fixed to
    //! stature, so a figure that bends its knees lowers its eyes too.
    eye: hip + torso + (H * S.eye - H * S.shoulder),
  };
}

/* ------------------------------------------------------------- the reaches */

//! THE THREE ENVELOPES ANYBODY LAYS OUT AGAINST, and they are three different
//! questions rather than three sizes of the same one.
//!
//!   NORMAL (the "normal working area"): forearm only, the upper arm hanging at
//!   the side. This is where work that is done all day has to be - reaching
//!   past it a thousand times a shift is what an ergonomist is looking for.
//!
//!   MAXIMUM: the whole arm from the shoulder, trunk upright. Occasional
//!   reaching; nothing repetitive belongs out here.
//!
//!   EXTENDED: with the trunk bent forward from the hip. A thing that can only
//!   be reached like this is a thing somebody bends for, which is a different
//!   finding from "cannot reach".
//!
//! The grip point is not the fingertip: what a hand can USE something at is
//! about the middle of the grip, so the hand's contribution is the length to
//! the middle knuckle rather than to the end of the finger. 0.7 of the hand
//! segment, which is where that lands.
export const GRIP = 0.7;

export function reaches(body) {
  const grip = body.hand * GRIP;
  return { normal: body.forearm + grip,
           maximum: body.upperArm + body.forearm + grip, grip };
}

//! HOW FAR THE SHOULDER TRAVELS when somebody bends forward, which is what the
//! third envelope actually is: the same arm about a shoulder somewhere else.
//! It is NOT a bigger sphere about where the shoulder was - and that is not a
//! refinement, it is the difference between a right answer and a wrong one.
//! Bending forward to reach something ABOVE you makes it further away, and a
//! scalar "extended reach" says it makes it nearer: the first version of this
//! told a 1.9 m person they could reach the top of a 48U rack by bending
//! forward, which is the exact opposite of true.
export function leanTravel(body, leanDegrees) {
  const a = leanDegrees * Math.PI / 180;
  return { forward: body.torso * Math.sin(a), down: body.torso * (1 - Math.cos(a)) };
}

//! CAN THIS BODY, IN THIS POSTURE, REACH THAT POINT. \p from is the shoulder,
//! \p to the target, both in the same frame. The answer is which envelope it
//! falls in and by how far - "300 mm outside maximum" is a finding somebody can
//! act on and "no" is not.
//! \p from is the shoulder as the figure stands; \p bent is where that same
//! shoulder gets to when it leans forward, which the caller works out by posing
//! the figure again. Two positions, one arm - and the answer says which of them
//! it took.
export function canReach(body, from, to, bent = null) {
  const span = reaches(body);
  const far = at => Math.hypot(to[0] - at[0], to[1] - at[1], to[2] - at[2]);
  const away = far(from);
  const leaning = bent ? far(bent) : Infinity;
  const zone = away <= span.normal ? "normal"
             : away <= span.maximum ? "maximum"
             : leaning <= span.maximum ? "extended" : "out of reach";
  //! HOW FAR SHORT, measured from whichever position gets closest - which for
  //! something overhead is the upright one, because leaning forward moved the
  //! shoulder away from it.
  const nearest = Math.min(away, leaning);
  const over = zone === "out of reach" ? nearest - span.maximum : 0;
  return { away, leaning, nearest, zone, over, ...span,
           helped: leaning < away };
}

/* ------------------------------------------------------------------- gait */

export const GRAVITY = 9.81;
//! The Froude number people walk at by preference. The walk-to-run transition
//! is about 0.5, which is why this is not a free parameter: a figure "walking"
//! at Fr 0.6 is a figure running.
export const PREFERRED_FROUDE = 0.25;
export const RUN_FROUDE = 0.5;
//! Grieve & Gear: step length is about 0.415 of stature at a preferred pace.
export const STEP_OF_STATURE = 0.415;

//! HOW FAST THIS BODY WALKS, from its LEG LENGTH rather than from its height -
//! which is the whole content of the Froude relation and the reason a child is
//! not a small adult with the same gait. Everything is in millimetres in and
//! metres per second out, because that is how each is quoted.
export function gait(body, froude = PREFERRED_FROUDE) {
  const legs = (body.hip - body.ankle) / 1000;                  // metres
  const speed = Math.sqrt(Math.max(0, froude) * GRAVITY * legs);  // m/s
  const step = body.stature / 1000 * STEP_OF_STATURE;             // metres
  //! Two steps to a stride, and cadence is quoted in steps a minute.
  const cadence = step > 0 ? speed / step * 60 : 0;
  return { legs, speed, step, stride: step * 2, cadence, froude,
           running: froude >= RUN_FROUDE };
}

//! How long a walk takes, and how many steps it is. \p distance in millimetres.
export function walkOf(body, distance, froude = PREFERRED_FROUDE) {
  const how = gait(body, froude);
  const metres = Math.max(0, distance) / 1000;
  return { ...how, distance: metres,
           seconds: how.speed > 0 ? metres / how.speed : Infinity,
           steps: how.step > 0 ? metres / how.step : 0 };
}

/* ------------------------------------------------------------- the posture */

//! THE TWO-LINK SOLVE that every joint in a leg or an arm is. Given where the
//! chain starts and where it has to end, and the two lengths, where the middle
//! joint goes. \p forward is the direction the joint bends towards - a knee
//! goes forward and an elbow goes back, and that is the only difference
//! between them.
//!
//! OVER-EXTENSION IS ANSWERED, NOT THROWN. Asked for an end further away than
//! the two links reach, a solver that throws leaves a figure with no legs; one
//! that returns a straight line leaves a figure standing where it was asked to
//! stand, with its knee locked, which is exactly what a person does.
export function twoLink(from, to, first, second, forward) {
  const d = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
  const span = Math.hypot(d[0], d[1], d[2]);
  const reachable = first + second;
  if (span < 1e-6) return { at: [...from], locked: true, short: reachable };
  const u = [d[0] / span, d[1] / span, d[2] / span];
  if (span >= reachable - 1e-9)
    return { at: [from[0] + u[0] * first, from[1] + u[1] * first, from[2] + u[2] * first],
             locked: true, short: span - reachable };
  //! The cosine rule, then out along the bend direction made square to the
  //! chain - so a knee bends forward of the line from hip to ankle and not
  //! along it, whatever direction "forward" was handed as.
  const t = (first * first - second * second + span * span) / (2 * span);
  const out = Math.sqrt(Math.max(0, first * first - t * t));
  const dot = forward[0] * u[0] + forward[1] * u[1] + forward[2] * u[2];
  let n = [forward[0] - u[0] * dot, forward[1] - u[1] * dot, forward[2] - u[2] * dot];
  const across = Math.hypot(n[0], n[1], n[2]);
  if (across < 1e-9) n = [0, 1, 0];
  else n = [n[0] / across, n[1] / across, n[2] / across];
  return { at: [from[0] + u[0] * t + n[0] * out,
                from[1] + u[1] * t + n[1] * out,
                from[2] + u[2] * t + n[2] * out],
           locked: false, short: 0 };
}

const egTurnZ = (p, deg) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]];
};
const egTurnX = (p, deg) => {
  const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
  return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c];
};
const egAdd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const egSub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const egLen = a => Math.hypot(a[0], a[1], a[2]);
const egUnit = a => { const n = egLen(a); return n > 1e-12 ? [a[0] / n, a[1] / n, a[2] / n] : [0, 0, 1]; };

//! HOW FAR A FULL SQUAT DROPS THE HIP, as a fraction of the standing hip
//! height. A deep squat puts the hip at about 28% of stature where standing is
//! 53%, so the drop is a bit under half. Measured off the table rather than
//! chosen: 1 - 0.28/0.53.
export const SQUAT_DROP = 1 - 0.28 / SEGMENTS.hip;

//! THE WHOLE FIGURE, AS JOINTS. Its own frame: x across the body to its left,
//! y the way it faces, z up, and the origin BETWEEN ITS FEET ON THE FLOOR -
//! which is what lets a mannequin be placed on a point the way everything else
//! in this program is placed on a point.
//!
//! Every angle is in degrees and every one of them is a thing somebody would
//! say out loud: how far the hips are dropped, how far the trunk is bent, which
//! way it is turned, where each arm is pointing, where the head is looking.
function poseWith(body, P, hipBack) {
  const half = body.hipWidth / 2;
  const squat = Math.max(0, Math.min(1, P.squat));

  //! THE FEET STAY WHERE THEY ARE. Everything else in a posture is measured
  //! from them, because they are the only part of a standing person that is
  //! not free to move.
  const ankleL = [half, 0, body.ankle];
  const ankleR = [-half, 0, body.ankle];

  //! THE HIPS DROP AND GO BACK. Straight down is not a squat - it is a posture
  //! nobody can hold, because the centre of mass leaves the feet. Going back by
  //! about a third of the drop is what keeps it over them, and the centre of
  //! mass below says whether it worked.
  const standing = body.hip;
  const drop = (standing - body.ankle) * squat * SQUAT_DROP;
  const pelvis = [0, hipBack, standing - drop];
  const hipL = [half, pelvis[1], pelvis[2]];
  const hipR = [-half, pelvis[1], pelvis[2]];

  //! A knee bends forward; that is the only thing that makes it a knee.
  const kneeL = twoLink(hipL, ankleL, body.thigh, body.shank, [0, 1, 0]).at;
  const kneeR = twoLink(hipR, ankleR, body.thigh, body.shank, [0, 1, 0]).at;

  //! THE TRUNK, from the pelvis: turned about the vertical, then bent forward
  //! about the across-axis. In that order, because a person turns and then
  //! bends, and doing it the other way round bends them sideways.
  //! BENDING FORWARD IS A NEGATIVE ROTATION ABOUT +X, which is the sign trap in
  //! this whole file. A right-handed turn about +x takes +z to MINUS y - so
  //! egTurnX(up, +lean) bends the figure BACKWARDS, and every number downstream
  //! stays plausible: the balance solver obligingly moves the hips the other
  //! way, the figure balances, and the only thing that says anything is wrong
  //! is that bending forward to reach something in front of you moves your
  //! shoulder further from it. Which is what it did.
  const up = egTurnZ(egTurnX([0, 0, body.torso], -P.lean), P.twist);
  const chest = egAdd(pelvis, up);
  const across = egTurnZ(egTurnX([1, 0, 0], -P.lean), P.twist);
  const facing = egTurnZ(egTurnX([0, 1, 0], -P.lean), P.twist);
  const shoulderL = egAdd(chest, [across[0] * body.shoulderWidth / 2,
                                across[1] * body.shoulderWidth / 2,
                                across[2] * body.shoulderWidth / 2]);
  const shoulderR = egSub(chest, [across[0] * body.shoulderWidth / 2,
                                across[1] * body.shoulderWidth / 2,
                                across[2] * body.shoulderWidth / 2]);

  //! AN ARM, from its shoulder. Hanging straight down to begin with; `out`
  //! swings it away from the body, `up` swings it forward, `elbow` bends it.
  //! Built in the trunk's own frame, so an arm follows the trunk when the trunk
  //! turns - which is the whole reason the trunk is solved first.
  const arm = (shoulder, side, how) => {
    const down = [-up[0], -up[1], -up[2]];
    const outward = [across[0] * side, across[1] * side, across[2] * side];
    //! Abduction: from straight down, towards the outward direction.
    const a = how.out * Math.PI / 180, b = how.up * Math.PI / 180;
    const dir = egUnit([
      down[0] * Math.cos(a) + outward[0] * Math.sin(a),
      down[1] * Math.cos(a) + outward[1] * Math.sin(a),
      down[2] * Math.cos(a) + outward[2] * Math.sin(a)]);
    //! Flexion: and then forward, about the across-axis of the body.
    const swung = egUnit([
      dir[0] * Math.cos(b) + facing[0] * Math.sin(b),
      dir[1] * Math.cos(b) + facing[1] * Math.sin(b),
      dir[2] * Math.cos(b) + facing[2] * Math.sin(b)]);
    const elbow = egAdd(shoulder, [swung[0] * body.upperArm, swung[1] * body.upperArm,
                                 swung[2] * body.upperArm]);
    //! The forearm bends about the elbow, in the plane of the upper arm and
    //! the body's facing - which is how an elbow bends and why it cannot bend
    //! backwards.
    const e = how.elbow * Math.PI / 180;
    const bendTo = egUnit([facing[0], facing[1], facing[2]]);
    const dot = bendTo[0] * swung[0] + bendTo[1] * swung[1] + bendTo[2] * swung[2];
    const side2 = egUnit([bendTo[0] - swung[0] * dot, bendTo[1] - swung[1] * dot,
                        bendTo[2] - swung[2] * dot]);
    const fore = egUnit([swung[0] * Math.cos(e) + side2[0] * Math.sin(e),
                       swung[1] * Math.cos(e) + side2[1] * Math.sin(e),
                       swung[2] * Math.cos(e) + side2[2] * Math.sin(e)]);
    const wrist = egAdd(elbow, [fore[0] * body.forearm, fore[1] * body.forearm,
                              fore[2] * body.forearm]);
    const grip = egAdd(wrist, [fore[0] * body.hand * GRIP, fore[1] * body.hand * GRIP,
                             fore[2] * body.hand * GRIP]);
    return { shoulder, elbow, wrist, grip };
  };

  const neck = egAdd(chest, [up[0] * 0.08, up[1] * 0.08, up[2] * 0.08]);
  //! THE HEAD SITS SO ITS CROWN IS THE STATURE. Placed by a fraction of the
  //! head's own height instead, as this was, a 1727 mm figure measured 1686
  //! from sole to crown and its eyes came out 24 mm below the published eye
  //! height - a 2% error in the one number the whole thing is scaled by, which
  //! nothing on screen shows. The offset is what puts the top of the head at
  //! the stature when the figure is standing, and it rides with the trunk from
  //! there.
  const crown = body.stature - body.headHeight / 2;
  const rise = Math.max(body.headHeight * 0.2, crown - (body.shoulder + body.torso * 0.08));
  //! Turned in the trunk's own frame, so a figure that has bent forward and is
  //! looking up is looking where it is looking.
  const headUp = egTurnZ(egTurnX(egUnit(up), P.headPitch), P.headYaw);
  const headCentre = egAdd(neck, [headUp[0] * rise, headUp[1] * rise, headUp[2] * rise]);
  //! The eyes are on the front of that head, which is what makes a look-at
  //! visible and is where a sightline starts.
  const nose = body.headHeight * 0.4;
  const eyeAt = egAdd(headCentre, [facing[0] * nose, facing[1] * nose, facing[2] * nose]);

  return {
    body, set: P, hipBack,
    ankleL, ankleR, kneeL, kneeR, hipL, hipR, pelvis,
    chest, neck, headCentre, headTop: egAdd(headCentre, [headUp[0] * body.headHeight * 0.5,
                                                       headUp[1] * body.headHeight * 0.5,
                                                       headUp[2] * body.headHeight * 0.5]),
    eye: eyeAt,
    across, facing, up: egUnit(up),
    left: arm(shoulderL, 1, P.leftArm),
    right: arm(shoulderR, -1, P.rightArm),
  };
}

//! AND THE HIPS GO BACK AS FAR AS THEY HAVE TO, which is not a style of squat -
//! it is the only one anybody can do. Dropping straight down puts the centre of
//! mass in front of the toes and the person falls over; a fixed fraction of the
//! drop is a guess that is wrong at some depth. So it is SOLVED: the hips move
//! back until the mass is over the middle of the feet, which is what a person
//! does without being told.
//!
//! A few steps of the secant method, and it converges in three or four because
//! the relation is nearly linear over the range a hip can travel. Bounded, and
//! the last try is kept rather than thrown: a posture that will not balance -
//! leaning 80 degrees forward with the knees locked - is a real posture that a
//! person really cannot hold, and the answer to it is the unbalanced figure and
//! the number saying so, not an exception.
export function pose(body, set = {}) {
  const P = {
    squat: 0, lean: 0, twist: 0,
    leftArm: { out: 8, up: 0, elbow: 0 },
    rightArm: { out: 8, up: 0, elbow: 0 },
    headYaw: 0, headPitch: 0, balance: true,
    ...set,
  };
  if (P.balance === false) return poseWith(body, P, 0);
  //! Over the middle of the base of support, which is a little forward of the
  //! ankle: a foot reaches further in front of it than behind.
  const want = body.foot * 0.2;
  const reach = body.hip * 0.45;                 // as far back as a hip goes
  let a = 0, b = -reach * Math.max(0.05, Math.min(1, P.squat)) - body.torso
                  * Math.sin(Math.max(0, P.lean) * Math.PI / 180) * 0.5;
  let best = poseWith(body, P, a);
  let fa = centreOfMass(best).at[1] - want;
  if (Math.abs(fa) < 1) return best;
  let posedB = poseWith(body, P, b);
  let fb = centreOfMass(posedB).at[1] - want;
  for (let i = 0; i < 8 && Math.abs(fb) > 1; i++) {
    if (Math.abs(fb - fa) < 1e-9) break;
    const next = Math.max(-reach, Math.min(reach, b - fb * (b - a) / (fb - fa)));
    a = b; fa = fb;
    b = next;
    posedB = poseWith(body, P, b);
    fb = centreOfMass(posedB).at[1] - want;
  }
  return posedB;
}

//! WHERE A HEAD HAS TO BE TURNED TO LOOK AT SOMETHING, in the trunk's own
//! frame. Given back as the two angles the pose takes, so "look at that" and
//! "turn your head 30 degrees" are the same two numbers and the panel shows
//! what the look-at worked out.
//!
//! AND IT IS CLAMPED TO WHAT A NECK DOES. A head that swivels 150 degrees to
//! look at something behind it is not a finding about the model, it is a
//! finding about the model being wrong: comfortable head rotation is about 60
//! degrees each way and 30 up or down, and past that a person turns their
//! whole body. So the angles are clamped and the shortfall is reported.
export const NECK_YAW = 60, NECK_PITCH_UP = 30, NECK_PITCH_DOWN = 45;

export function lookAt(at, target, facing, across, up) {
  const to = egSub(target, at);
  if (egLen(to) < 1e-6) return { yaw: 0, pitch: 0, turned: 0, beyond: 0 };
  const d = egUnit(to);
  const f = d[0] * facing[0] + d[1] * facing[1] + d[2] * facing[2];
  const s = d[0] * across[0] + d[1] * across[1] + d[2] * across[2];
  const u = d[0] * up[0] + d[1] * up[1] + d[2] * up[2];
  const yaw = Math.atan2(s, f) * 180 / Math.PI;
  const pitch = Math.asin(Math.max(-1, Math.min(1, u))) * 180 / Math.PI;
  const heldYaw = Math.max(-NECK_YAW, Math.min(NECK_YAW, yaw));
  const heldPitch = Math.max(-NECK_PITCH_DOWN, Math.min(NECK_PITCH_UP, pitch));
  return { yaw: heldYaw, pitch: heldPitch, wantYaw: yaw, wantPitch: pitch,
           beyond: Math.max(Math.abs(yaw - heldYaw), Math.abs(pitch - heldPitch)) };
}

/* ------------------------------------------------------------------ balance */

//! WHERE THE WHOLE BODY'S MASS IS, and whether it is over the feet. This is the
//! question a posture is right or wrong by: a figure leaning 60 degrees forward
//! with its hips over its heels is a figure falling over, and nothing on screen
//! says so.
export function centreOfMass(posed) {
  const b = posed.body;
  const mid = (a, c) => [(a[0] + c[0]) / 2, (a[1] + c[1]) / 2, (a[2] + c[2]) / 2];
  const bits = [
    [MASSES.head, posed.headCentre],
    [MASSES.trunk, mid(posed.pelvis, posed.chest)],
    [MASSES.thigh, mid(posed.hipL, posed.kneeL)],
    [MASSES.thigh, mid(posed.hipR, posed.kneeR)],
    [MASSES.shank, mid(posed.kneeL, posed.ankleL)],
    [MASSES.shank, mid(posed.kneeR, posed.ankleR)],
    [MASSES.foot, [posed.ankleL[0], posed.ankleL[1] + b.foot * 0.15, b.ankle / 2]],
    [MASSES.foot, [posed.ankleR[0], posed.ankleR[1] + b.foot * 0.15, b.ankle / 2]],
    [MASSES.upperArm, mid(posed.left.shoulder, posed.left.elbow)],
    [MASSES.upperArm, mid(posed.right.shoulder, posed.right.elbow)],
    [MASSES.forearm, mid(posed.left.elbow, posed.left.wrist)],
    [MASSES.forearm, mid(posed.right.elbow, posed.right.wrist)],
    [MASSES.hand, posed.left.grip],
    [MASSES.hand, posed.right.grip],
  ];
  let total = 0;
  const sum = [0, 0, 0];
  for (const [m, at] of bits) {
    total += m;
    sum[0] += m * at[0]; sum[1] += m * at[1]; sum[2] += m * at[2];
  }
  const at = [sum[0] / total, sum[1] / total, sum[2] / total];
  //! THE BASE OF SUPPORT is the ground the feet cover - heel to toe, and across
  //! both of them. A person is balanced when the mass falls inside it, and the
  //! margin is the useful number: 40 mm from the edge is standing, 5 mm is a
  //! posture nobody holds for a shift.
  const back = -b.foot * 0.3, front = b.foot * 0.7;
  const side = b.hipWidth / 2 + b.footWidth / 2;
  const margin = Math.min(at[1] - back, front - at[1], side - Math.abs(at[0]));
  return { at, counted: total, balanced: margin > 0, margin,
           base: { back, front, side } };
}
