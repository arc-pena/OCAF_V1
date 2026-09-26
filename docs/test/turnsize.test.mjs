// A request that fits, whatever is loaded.
//
// "The turns exceed the 64 KiB limit", on a large model, the moment the AI
// panel was used. The briefing was budgeted - documentBrief caps the document
// at 40,000 characters and sends a shape instead of a reading above that - and
// that is what got a six-thousand-feature building into the FIRST turn at all.
//
// The first turn is not the request. Three things were not budgeted:
//
//   · every tool result went in whole. `look` with the id of a folder of four
//     hundred walls is one result far over the whole allowance, and it is the
//     call most likely to be made on exactly the model that cannot afford it.
//   · results accumulate: twenty-four rounds of them are all still there on the
//     twenty-fourth request.
//   · the conversation accumulates across questions, with the briefing riding
//     in the first turn for ever.
//
// So the numbers here are bytes, because the limit is bytes and a character is
// not one, and every check is against a model big enough to have broken it.
import { briefing, bytesOf, cutTo, documentBrief, documentDigest, featureBrief,
         fitMessages, RESULT_BYTES, TURN_BYTES } from "../src/agent.js";
import { schemaJson } from "../src/ocaf.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};
const KiB = n => (n / 1024).toFixed(1) + " KiB";

//! A BUILDING. 6,010 features is the size named in agent.js as the one that
//! broke, in folders, with names as long as an IFC import really gives them.
function building(n = 6010) {
  const features = [{ id: "L0", type: "Level", name: "Ground floor", args: { elevation: 0 } }];
  for (let i = 0; i < 40; i++)
    features.push({ id: "GS" + i, type: "GeometricalSet",
                    name: "Zone " + i + " — external envelope and openings" });
  for (let i = features.length; i < n; i++)
    features.push({
      id: "W" + i, type: "Cube", parent: "GS" + (i % 40),
      name: "Basic Wall:SFS Partition 146mm:Standard:" + (900000 + i),
      args: { dx: 3000 + (i % 7) * 100, dy: 146, dz: 3200,
              origin: { ref: "P" + i }, plane: { ref: "PL" + (i % 12) } },
    });
  return { format: "ocaf-parametric-model", version: 1, name: "Tower", units: "mm", features };
}

const model = building();
const whole = JSON.stringify(model);
console.log("  the model: " + model.features.length.toLocaleString() + " features, "
  + KiB(bytesOf(whole)) + "\n");

/* ------------------------------------------------------- cutting, in bytes */
{
  check("a short string is not cut", cutTo("hello", 1000) === "hello");
  const long = "x".repeat(50000);
  check("a long one is cut to the budget", bytesOf(cutTo(long, 4096)) <= 4096,
        String(bytesOf(cutTo(long, 4096))));
  check("and says it was cut, and how big it really was",
        /49,?\d*\d| characters in all/.test(cutTo(long, 4096)));

  //! BYTES, NOT CHARACTERS. Every character here is three bytes, so a cut that
  //! counted characters would leave this three times over the limit - which is
  //! the whole reason the limit was being missed.
  const wide = "設計図面".repeat(4000);
  check("a string of three-byte characters is cut by BYTES",
        bytesOf(cutTo(wide, 4096)) <= 4096,
        bytesOf(wide) + " bytes in, " + bytesOf(cutTo(wide, 4096)) + " out");
}

/* -------------------------------------------------- the briefing, on a building */
{
  const brief = documentBrief(model);
  check("a building is sent as its shape rather than whole",
        brief.length < whole.length / 10 && /too large to send/.test(brief),
        KiB(bytesOf(brief)) + " against " + KiB(bytesOf(whole)));

  const opening = briefing(schemaJson(), model, []);
  //! THE WHOLE OPENING TURN, catalogue and all, has to leave room for an answer.
  check("and the whole opening turn is inside the budget",
        bytesOf(opening) < TURN_BYTES, KiB(bytesOf(opening)) + " of " + KiB(TURN_BYTES));
}

/* ------------------------------------------- one tool result, on a big folder */
{
  //! THE CALL MOST LIKELY TO BE MADE. "What is in Zone 3" on a building is 150
  //! features; before this it was 400 lines whatever they weighed.
  const one = featureBrief(model, "GS3");
  check("reading a big folder comes back inside one result's budget",
        bytesOf(JSON.stringify(one)) <= RESULT_BYTES,
        KiB(bytesOf(JSON.stringify(one))) + " of " + KiB(RESULT_BYTES));
  //! AND SAYS HOW MANY IT DID NOT SHOW. An assistant that cannot tell a short
  //! folder from a shortened one will answer as though the folder were short.
  check("and it still reports the true count, not the shown one",
        one.insideCount > one.inside.length && one.insideCount > 100,
        one.inside.length + " shown of " + one.insideCount);
}

/* --------------------------------------- and the conversation as it grows */
{
  //! TWENTY-FOUR ROUNDS of a tool answering with a big folder. This is the
  //! shape that actually failed: no single piece is absurd and the sum is.
  const opening = briefing(schemaJson(), model, []);
  const messages = [{ role: "user", content: opening + "\n\nWHAT TO BUILD\nmove the core" }];
  for (let i = 0; i < 24; i++) {
    messages.push({ role: "assistant", content: [
      { type: "text", text: "Reading zone " + i },
      { type: "tool_use", id: "t" + i, name: "look", input: { id: "GS" + i } }] });
    messages.push({ role: "user", content: [
      { type: "tool_result", tool_use_id: "t" + i,
        content: JSON.stringify(featureBrief(model, "GS" + i)) }] });
  }
  const before = messages.reduce((n, m) => n + bytesOf(m.content), 0);
  check("twenty-four rounds of honest tool results really does blow the limit",
        before > 64 * 1024, KiB(before));

  fitMessages(messages);
  const after = messages.reduce((n, m) => n + bytesOf(m.content), 0);
  check("fitting brings it back inside the budget",
        after <= TURN_BYTES, KiB(before) + " → " + KiB(after) + ", budget " + KiB(TURN_BYTES));

  //! WHAT IS GIVEN UP IS THE OLDEST, AND IT SAYS SO. An assistant working from
  //! a result that was silently emptied is worse off than one told it is gone.
  const first = messages[2].content[0].content;
  check("the oldest result is given up, in words",
        /was given up to keep this conversation inside one turn/.test(first), first.slice(0, 80));
  //! THE QUESTION IS NEVER TOUCHED. Everything else in the request can be asked
  //! for again - the catalogue is fixed, the document is one `look` away - and
  //! the question cannot. So the briefing IS shortened when a long conversation
  //! about a large model leaves nothing else to give up, and when that happens
  //! it says so and the question still arrives whole.
  check("the question always survives, whole",
        messages[0].content.endsWith("\n\nWHAT TO BUILD\nmove the core"),
        messages[0].content.slice(-60));
  check("and if the briefing had to be shortened, it says so",
        messages[0].content.length === (opening + "\n\nWHAT TO BUILD\nmove the core").length
        || /the opening briefing, shortened/.test(messages[0].content),
        bytesOf(messages[0].content) + " bytes");
  //! Nor is the newest exchange, or the assistant would be answering about a
  //! conversation it can no longer see.
  const last = messages[messages.length - 1].content[0].content;
  check("and the newest result is still there in full",
        !/was given up/.test(last), last.slice(0, 60));
}

/* --------------------------------------------- a part is untouched by any of it */
{
  //! NOTHING CHANGES FOR A PART, which is the thing most easily broken by a
  //! budget: forty features must still go whole, exactly, because a digest of
  //! forty features is worse than the forty features.
  const part = { format: "ocaf-parametric-model", version: 1, name: "Bracket", units: "mm",
    features: Array.from({ length: 40 }, (_, i) =>
      ({ id: "F" + i, type: "Cube", name: "Block " + i, args: { dx: 10 + i } })) };
  const brief = documentBrief(part);
  check("a forty-feature part still goes whole, exactly",
        brief === JSON.stringify(part), brief.slice(0, 60));
  const messages = [{ role: "user", content: "hello" },
                    { role: "assistant", content: [{ type: "text", text: "hi" }] },
                    { role: "user", content: [{ type: "tool_result", tool_use_id: "a",
                                               content: brief }] }];
  const was = JSON.stringify(messages);
  fitMessages(messages);
  check("and a short conversation is not touched at all", JSON.stringify(messages) === was);
}

console.log(failures ? "\n" + failures + " failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
