// The body, against the papers it comes from.
//
// Every number in ergonomics.js is somebody else's measurement, so every check
// here is against the published value rather than against the program. A
// mannequin whose centre of mass is at 52% of its height instead of 57% looks
// exactly like one whose is right, and every balance answer it gives is wrong.
import { GRAVITY, MASSES, PREFERRED_FROUDE, RUN_FROUDE, SEGMENTS, STEP_OF_STATURE,
         canReach, centreOfMass, gait, leanTravel, lookAt, massFor, NECK_PITCH_DOWN,
         NECK_PITCH_UP, NECK_YAW, pose, proportions, reaches, twoLink,
         walkOf } from "../src/ergonomics.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const near = (a, b, tol = 1e-9) => Number.isFinite(a) && Math.abs(a - b) <= tol;

console.log("1. the segment table is Drillis & Contini's, and it closes");
{
  //! THE TABLE HAS TO BE SELF-CONSISTENT or it is two tables. Hip height less
  //! ankle height is thigh plus shank, by definition of where the joints are -
  //! and a table where it is not is one somebody has edited half of.
  check("thigh + shank + ankle is the hip height",
        near(SEGMENTS.thigh + SEGMENTS.shank + SEGMENTS.ankle, SEGMENTS.hip, 0.001),
        (SEGMENTS.thigh + SEGMENTS.shank + SEGMENTS.ankle).toFixed(3)
          + " vs " + SEGMENTS.hip);
  //! And the published values themselves, which is what makes this a check and
  //! not a restatement: 0.818 of stature to the shoulder, 0.936 to the eye.
  check("the shoulder is at 0.818 of stature", SEGMENTS.shoulder === 0.818);
  check("the eye is at 0.936", SEGMENTS.eye === 0.936);
  check("the head is 0.130 of stature", SEGMENTS.headHeight === 0.130);
  //! Winter's masses add to one, or a centre of mass computed from them is not
  //! a centre of mass of anything.
  const whole = MASSES.head + MASSES.trunk + 2 * (MASSES.upperArm + MASSES.forearm
    + MASSES.hand + MASSES.thigh + MASSES.shank + MASSES.foot);
  check("Winter's segment masses add up to the body", near(whole, 1, 0.005),
        whole.toFixed(4));
}

console.log("\n2. a body of a stature, and what the multipliers do");
{
  const H = 1727;
  const b = proportions(H);
  check("the hip is 0.530 of stature", near(b.hip, H * 0.530, 1e-9), b.hip.toFixed(1));
  check("the shoulder is 0.818", near(b.shoulder, H * 0.818, 1e-6), b.shoulder.toFixed(1));
  check("the eye is 0.936", near(b.eye, H * 0.936, 1e-6), b.eye.toFixed(1));
  check("mass at BMI 23 is 68.6 kg", near(b.mass, 23 * 1.727 * 1.727, 1e-9),
        b.mass.toFixed(1) + " kg");
  //! LONGER LEGS ON THE SAME STATURE IS A SHORTER TRUNK. That is what the words
  //! mean, and a multiplier that stretched the whole figure would be a
  //! multiplier for stature, which there already is.
  const longer = proportions(H, { legs: 1.1 });
  check("longer legs raise the hip", longer.hip > b.hip,
        b.hip.toFixed(0) + " -> " + longer.hip.toFixed(0));
  check("  and the shoulder goes up with it, not the trunk stretching",
        near(longer.shoulder - longer.hip, b.shoulder - b.hip, 1e-6),
        (longer.shoulder - longer.hip).toFixed(1));
  const armed = proportions(H, { arms: 1.1 });
  check("longer arms reach further",
        near(reaches(armed).maximum, reaches(b).maximum * 1.1, 1e-6),
        Math.round(reaches(b).maximum) + " -> " + Math.round(reaches(armed).maximum));
}

console.log("\n3. the reaches, and the trap in the third one");
{
  const b = proportions(1727);
  const span = reaches(b);
  //! The normal working area is the FOREARM, which is the whole distinction:
  //! it is where work that happens all day belongs, and it is half the maximum.
  check("normal is forearm plus grip",
        near(span.normal, b.forearm + b.hand * 0.7, 1e-9), Math.round(span.normal));
  check("maximum is the whole arm",
        near(span.maximum, b.upperArm + b.forearm + b.hand * 0.7, 1e-9),
        Math.round(span.maximum));
  check("and maximum is getting on for twice normal",
        span.maximum / span.normal > 1.7 && span.maximum / span.normal < 2,
        (span.maximum / span.normal).toFixed(2));

  //! THE FAILURE THAT LOOKS LIKE SUCCESS, and it is the whole reason the third
  //! envelope is not a number. Bending forward moves the shoulder FORWARD and
  //! DOWN - so for something overhead it is further away, not nearer. A scalar
  //! "extended reach" of maximum + travel says the opposite, and told a 1.9 m
  //! person they could reach the top of a 48U rack by bending forward.
  const travel = leanTravel(b, 45);
  check("bending 45 moves the shoulder forward", travel.forward > 300,
        Math.round(travel.forward) + " mm forward");
  check("  and down by about a third as much again", travel.down > 100,
        Math.round(travel.down) + " mm down");
  const shoulder = [0, 0, 1413];
  const overhead = [0, 300, 2100];
  const bent = [0, travel.forward, 1413 - travel.down];
  const got = canReach(b, shoulder, overhead, bent);
  check("something overhead is FURTHER from the bent shoulder", !got.helped,
        Math.round(got.away) + " upright vs " + Math.round(got.leaning) + " bent");
  check("  so bending does not bring it into reach", got.zone === "out of reach",
        got.zone);
  //! And forward of you, at waist height, it does help - which is the case the
  //! envelope is FOR.
  const ahead = [0, 900, 900];
  const forward = canReach(b, shoulder, ahead, bent);
  check("something low and forward IS nearer from the bent shoulder", forward.helped,
        Math.round(forward.away) + " upright vs " + Math.round(forward.leaning) + " bent");
  check("  and bending brings it into reach", forward.zone === "extended", forward.zone);
}

console.log("\n4. the two-link solve, on a triangle that can be done on paper");
{
  //! 3-4-5. A chain of 3 and 4 whose ends are 5 apart makes a right angle at
  //! the middle joint. The foot of that joint is 3*3/5 = 1.8 along the line
  //! from the start, and it stands 3*4/5 = 2.4 off it - which is the altitude
  //! of a 3-4-5 triangle, and both are numbers anybody can do on paper.
  const got = twoLink([0, 0, 0], [5, 0, 0], 3, 4, [0, 1, 0]);
  check("the joint is 1.8 along the line", near(got.at[0], 1.8, 1e-9), got.at[0].toFixed(4));
  check("and 2.4 off it", near(got.at[1], 2.4, 1e-9), got.at[1].toFixed(4));
  check("and it is not locked", !got.locked);
  //! OVER-EXTENSION IS ANSWERED AND NOT THROWN. A solver that throws leaves a
  //! figure with no legs; one that straightens the chain leaves a person
  //! standing with a locked knee, which is what a person does.
  const far = twoLink([0, 0, 0], [10, 0, 0], 3, 4, [0, 1, 0]);
  check("asked for further than it reaches it locks straight", far.locked);
  check("  with the joint on the line", near(far.at[1], 0, 1e-9) && near(far.at[0], 3, 1e-9),
        far.at.map(n => n.toFixed(2)).join(", "));
  check("  and says how far short it is", near(far.short, 3, 1e-9), far.short.toFixed(2));
}

console.log("\n5. the posture, and the balance it is solved for");
{
  const b = proportions(1727);
  const standing = pose(b, {});
  const mass = centreOfMass(standing);
  //! WINTER'S FIGURE: an adult's centre of mass stands at about 57% of their
  //! height. This is the one number that checks the whole chain at once - the
  //! segment lengths, the segment masses and the pose that puts them where they
  //! are - and it is a number from a textbook rather than from this program.
  check("a standing body's centre of mass is at 57% of its height",
        Math.abs(mass.at[2] / 1727 - 0.57) < 0.01,
        (mass.at[2] / 1727 * 100).toFixed(1) + "%");
  check("and it is over the feet", mass.balanced, Math.round(mass.margin) + " mm inside");

  //! THE HIPS GO BACK BECAUSE THEY HAVE TO. Dropping straight down puts the
  //! mass in front of the toes; a fixed fraction of the drop is a guess that is
  //! wrong at some depth. It is solved, so every posture below balances or
  //! there is something wrong with the solve.
  for (const [squat, lean] of [[0, 0], [0.5, 0], [1, 0], [0, 45], [0.8, 25], [0, 70]]) {
    const posed = pose(b, { squat, lean });
    const com = centreOfMass(posed);
    check("squat " + squat + ", bent " + lean + " balances",
          com.balanced, "hips " + Math.round(-posed.hipBack) + " back, margin "
            + Math.round(com.margin));
  }
  //! AND A FULL SQUAT PUTS THE HIP WHERE A FULL SQUAT PUTS IT: about 0.28 of
  //! stature, against 0.53 standing.
  const deep = pose(b, { squat: 1 });
  check("a full squat drops the hip to about 0.28 of stature",
        Math.abs(deep.pelvis[2] / 1727 - 0.28) < 0.02,
        (deep.pelvis[2] / 1727).toFixed(3));
  //! AND THE BALANCE SOLVE CAN BE TURNED OFF, because a posture somebody is
  //! asking about may be one nobody can hold - and answering "it balances"
  //! about it by moving the hips is answering a different question.
  const raw = pose(b, { squat: 1, balance: false });
  check("without the solve the hips do not move", raw.hipBack === 0);
}

console.log("\n6. the walk, from leg length");
{
  const b = proportions(1727);
  const g = gait(b);
  //! THE FROUDE RELATION, checked by computing it here: v = sqrt(Fr g L). A leg
  //! of 0.848 m at Fr 0.25 is 1.44 m/s, and the arithmetic is two lines.
  const legs = (b.hip - b.ankle) / 1000;
  check("speed is sqrt(Fr g L)", near(g.speed, Math.sqrt(0.25 * GRAVITY * legs), 1e-12),
        g.speed.toFixed(3) + " m/s");
  check("  which for this body is a normal walking pace",
        g.speed > 1.2 && g.speed < 1.6, g.speed.toFixed(2) + " m/s");
  check("step is 0.415 of stature",
        near(g.step, 1.727 * STEP_OF_STATURE, 1e-12), (g.step * 1000).toFixed(0) + " mm");
  check("  and cadence is a normal one", g.cadence > 105 && g.cadence < 130,
        Math.round(g.cadence) + " steps a minute");
  //! PEOPLE OF DIFFERENT SIZES WALK AT THE SAME DIMENSIONLESS SPEED, which is
  //! the content of the relation and the reason it is not "1.4 m/s for
  //! everybody": a child with half the leg length walks at 1/sqrt(2) of it.
  const child = proportions(1100);
  const cg = gait(child);
  const ratio = cg.speed / g.speed;
  const legRatio = Math.sqrt((child.hip - child.ankle) / (b.hip - b.ankle));
  check("a smaller body walks slower by the square root of its leg length",
        near(ratio, legRatio, 1e-12), ratio.toFixed(3) + " vs " + legRatio.toFixed(3));
  //! And the walk-run transition is a real thing the node has to know about.
  check("past Froude 0.5 it is a run", gait(b, 0.6).running && !gait(b, 0.3).running);
  const trip = walkOf(b, 10000);
  check("10 m takes distance over speed",
        near(trip.seconds, 10 / g.speed, 1e-12), trip.seconds.toFixed(2) + " s");
  check("  and is that many steps", near(trip.steps, 10 / g.step, 1e-12),
        trip.steps.toFixed(1));
}

console.log("\n7. looking at something, and what a neck will not do");
{
  const facing = [0, 1, 0], across = [1, 0, 0], up = [0, 0, 1];
  const straight = lookAt([0, 0, 0], [0, 1000, 0], facing, across, up);
  check("straight ahead is no turn at all",
        near(straight.yaw, 0, 1e-9) && near(straight.pitch, 0, 1e-9));
  const right = lookAt([0, 0, 0], [1000, 1000, 0], facing, across, up);
  check("45 degrees across is 45 degrees of yaw", near(right.yaw, 45, 1e-9),
        right.yaw.toFixed(2));
  //! 45 UP IS 45 OF PITCH ASKED FOR, and 30 of pitch TAKEN - because a neck
  //! does 30 up and the answer says both. Checking the taken one against 45
  //! would be checking that the clamp is not there.
  const above = lookAt([0, 0, 0], [0, 1000, 1000], facing, across, up);
  check("45 degrees up wants 45 of pitch", near(above.wantPitch, 45, 1e-9),
        above.wantPitch.toFixed(2));
  check("  and a neck gives 30 of it", near(above.pitch, NECK_PITCH_UP, 1e-9),
        above.pitch.toFixed(2));
  //! A NECK DOES NOT DO 150 DEGREES. A head that swivels to look behind it is
  //! not a finding about the model, it is the model being wrong - so the angles
  //! are clamped and the shortfall is what gets reported, because "they would
  //! have to turn their body" is the answer somebody wants.
  const behind = lookAt([0, 0, 0], [0, -1000, 0], facing, across, up);
  check("looking behind is clamped to what a neck turns",
        Math.abs(behind.yaw) <= NECK_YAW, behind.yaw.toFixed(0) + " of a wanted "
          + behind.wantYaw.toFixed(0));
  check("  and says how far beyond that it was asked to go", behind.beyond > 100,
        behind.beyond.toFixed(0) + "° further");
  const steep = lookAt([0, 0, 0], [0, 100, 1000], facing, across, up);
  check("and up is clamped tighter than down", NECK_PITCH_UP < NECK_PITCH_DOWN
        && steep.pitch === NECK_PITCH_UP, steep.pitch + " of " + steep.wantPitch.toFixed(0));
}

console.log(failures ? "\n" + failures + " FAILED" : "\nall checks passed");
process.exit(failures ? 1 : 0);
