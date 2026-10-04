// Nano Banana: the request, the reply, and the zip.
//
// WHAT THIS CAN AND CANNOT CHECK, said first because it matters more than
// anything below. No test here reaches Google. There is no API key in the
// container these run in and asking for one would be asking for a credential,
// so the one thing that would prove the feature works end to end - a real
// render coming back - is not something this file can do. The user's first
// call is the first real call.
//
// What it CAN do is make the two places that would silently be wrong into
// pure functions and pin them down: the shape of what is sent, and the reading
// of what comes back. Those are where a quiet failure would live - a request
// the service rejects with a message nobody reads, or a reply whose image is
// one field name away from being found and is reported as "no image".

import {
  MAX_REFERENCES, NANO_DEFAULT_MODEL, NANO_ENDPOINT, NANO_RATIOS, PROMPT_IDEAS,
  REFERENCE_MAX_EDGE, REFERENCE_ROLES,
  base64Bytes, crc32, dataUrlParts, galleryName, imageFromReply, maskBrief,
  maskColour, maskColourCount, nanoRequest, ratioFor, referenceBrief, roleInfoFor, storeZip,
  troubleFromReply,
} from "../src/nano.js";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

const PIC = "iVBORw0KGgo=";

console.log("1. the request is the shape the service documents");
{
  const made = nanoRequest({ prompt: " a photograph ", image: PIC, key: "K" });
  check("it goes to the interactions endpoint", made.url === NANO_ENDPOINT, made.url);
  check("the key rides in a header, not the query",
        made.headers["x-goog-api-key"] === "K" && !/key=/.test(made.url),
        Object.keys(made.headers).join(", "));
  check("the model defaults to the newest published one",
        made.body.model === NANO_DEFAULT_MODEL, made.body.model);
  check("the prompt is trimmed and first",
        made.body.input[0].type === "text" && made.body.input[0].text === "a photograph",
        JSON.stringify(made.body.input[0]));
  check("the picture is second, with its type",
        made.body.input[1].type === "image" && made.body.input[1].data === PIC
        && made.body.input[1].mime_type === "image/png",
        JSON.stringify({ ...made.body.input[1], data: "…" }));
  //! NOT ASKED FOR WHEN THERE IS NOTHING TO ASK. An empty response_format is a
  //! field the service has to interpret, and "whatever the input was" is the
  //! right answer for a viewport grab.
  check("and nothing is said about shape unless something was asked",
        made.body.response_format === undefined,
        JSON.stringify(made.body.response_format));

  const shaped = nanoRequest({ prompt: "x", image: PIC, key: "K",
                               ratio: "16:9", size: "2K" });
  check("a shape and a size go in response_format",
        shaped.body.response_format.aspect_ratio === "16:9"
        && shaped.body.response_format.image_size === "2K"
        && shaped.body.response_format.type === "image",
        JSON.stringify(shaped.body.response_format));
}

console.log("\n2. and it refuses to build one that cannot work");
{
  //! EACH REFUSAL BY NAME. A request sent without a key comes back 401 and the
  //! person is told the key was not accepted - which is true and useless when
  //! the real answer is that they never typed one.
  const refuses = (what, args) => {
    let said = null;
    try { nanoRequest(args); } catch (err) { said = err.message; }
    check(what, !!said, said || "it was built, which it must not be");
    return said;
  };
  refuses("no prompt is refused here rather than by the service",
          { image: PIC, key: "K" });
  refuses("no picture likewise", { prompt: "x", key: "K" });
  const noKey = refuses("and no key says where a key goes",
                        { prompt: "x", image: PIC });
  check("by naming the gear", /gear/.test(noKey || ""), noKey);
}

console.log("\n3. the reply is read wherever the bytes are");
{
  const long = "A".repeat(600);
  //! THE SHAPE GOOGLE DOCUMENTS TODAY.
  check("an Interaction's outputImage",
        (imageFromReply({ interaction: { outputImage: { data: long } } }) || {}).data === long);
  check("and its snake_case spelling",
        (imageFromReply({ interaction: { output_image: { data: long } } }) || {}).data === long);
  //! THE SHAPE IT DOCUMENTED BEFORE. A page that knows only one of these
  //! breaks on a morning when nothing here changed, and the failure reads as
  //! "the model returned no image" - which blames the model.
  check("a candidate's inlineData part",
        (imageFromReply({ candidates: [{ content: { parts: [
          { text: "here you are" },
          { inlineData: { mimeType: "image/jpeg", data: long } }] } }] }) || {}).data === long);
  check("and the type comes with it",
        (imageFromReply({ candidates: [{ content: { parts: [
          { inlineData: { mimeType: "image/jpeg", data: long } }] } }] }) || {}).mime
        === "image/jpeg");
  //! NOT FOOLED BY A SHORT STRING called data. A reply full of ids and
  //! cursors has "data" fields all over it; a picture is not twelve bytes.
  check("a short field called data is not a picture",
        imageFromReply({ data: "abc", interaction: { id: "x" } }) === null);
  check("and an empty reply is not one either",
        imageFromReply({}) === null && imageFromReply(null) === null);
}

console.log("\n4. and when there are none, the reason is the service's own words");
{
  check("the error message is preferred over anything invented",
        troubleFromReply({ error: { message: "API key not valid" } }, 400)
        === "API key not valid");
  //! A REFUSAL IS NOT A FAULT IN THIS PAGE, and saying "the reply had no image"
  //! for one would send somebody looking in the wrong place.
  check("a refusal is named as one",
        /IMAGE_SAFETY/.test(troubleFromReply({ finishReason: "IMAGE_SAFETY" }, 200)),
        troubleFromReply({ finishReason: "IMAGE_SAFETY" }, 200));
  check("404 points at the model name",
        /model/.test(troubleFromReply({}, 404)), troubleFromReply({}, 404));
  check("403 points at the key",
        /key/.test(troubleFromReply({}, 403)), troubleFromReply({}, 403));
  check("429 says to wait",
        /wait/.test(troubleFromReply({}, 429)), troubleFromReply({}, 429));
}

console.log("\n5. a data URL is taken apart the way the service wants it");
{
  const parts = dataUrlParts("data:image/png;base64," + PIC);
  check("the type and the bytes come out separately",
        parts.mime === "image/png" && parts.data === PIC, JSON.stringify(parts));
  //! A canvas can hand back a percent-encoded URL for some types, and sending
  //! those bytes as base64 would send rubbish that decodes to nothing.
  check("a URL that is not base64 is refused rather than mangled",
        dataUrlParts("data:image/svg+xml,%3Csvg/%3E") === null);
  check("and something that is not a data URL at all",
        dataUrlParts("https://example.test/a.png") === null);
}

console.log("\n6. the viewport's shape becomes one the service knows");
{
  check("16:9 is recognised", ratioFor(1920, 1080) === "16:9", String(ratioFor(1920, 1080)));
  check("a square is 1:1", ratioFor(800, 800) === "1:1", String(ratioFor(800, 800)));
  check("and a portrait phone", ratioFor(900, 1600) === "9:16", String(ratioFor(900, 1600)));
  //! A SHAPE NOBODY LISTED. Asking for the nearest would crop the building, so
  //! the answer is to say nothing and let the service keep what it was given.
  check("a letterbox nobody lists asks for nothing",
        ratioFor(3000, 500) === null, String(ratioFor(3000, 500)));
  check("and a window with no size at all",
        ratioFor(0, 0) === null, String(ratioFor(0, 0)));
  check("the first option is the one that means 'as it is'",
        !/^\d+:\d+$/.test(NANO_RATIOS[0]), NANO_RATIOS[0]);
}

console.log("\n7. the zip is a zip");
{
  //! AGAINST A KNOWN NUMBER, not against itself. The CRC-32 of "123456789" is
  //! 0xCBF43926 - it is the check value every CRC implementation is published
  //! with, so if this agrees the table and the loop are both right.
  check("the checksum matches the published check value",
        crc32(new TextEncoder().encode("123456789")) === 0xCBF43926,
        "0x" + crc32(new TextEncoder().encode("123456789")).toString(16).toUpperCase());

  const one = new Uint8Array([1, 2, 3, 4, 5]);
  const two = new TextEncoder().encode("hello");
  const zip = storeZip([{ name: "a.png", bytes: one }, { name: "b.txt", bytes: two }]);
  const view = new DataView(zip.buffer);
  check("it starts with a local file header", view.getUint32(0, true) === 0x04034b50,
        "0x" + view.getUint32(0, true).toString(16));
  check("and ends with an end-of-central-directory",
        view.getUint32(zip.length - 22, true) === 0x06054b50,
        "0x" + view.getUint32(zip.length - 22, true).toString(16));
  check("which counts both files",
        view.getUint16(zip.length - 22 + 8, true) === 2,
        String(view.getUint16(zip.length - 22 + 8, true)));
  //! THE OFFSET IN THE END RECORD HAS TO POINT AT THE DIRECTORY. Get this
  //! wrong and the file is exactly the right length, opens in nothing, and
  //! the only error anybody sees is "the archive is corrupt".
  const centre = view.getUint32(zip.length - 22 + 16, true);
  check("and points at a real central directory header",
        view.getUint32(centre, true) === 0x02014b50,
        "at " + centre + ": 0x" + view.getUint32(centre, true).toString(16));
  check("whose stored size is the file's own",
        view.getUint32(centre + 24, true) === one.length,
        String(view.getUint32(centre + 24, true)));
  check("and whose checksum is the file's own",
        view.getUint32(centre + 16, true) === crc32(one),
        "0x" + view.getUint32(centre + 16, true).toString(16));
  //! STORED, NOT DEFLATED - so the bytes are findable in the file as they are,
  //! which is the one property that makes method 0 worth choosing.
  check("the bytes are in there uncompressed",
        [...zip].join(",").includes([...two].join(",")));
}

console.log("\n8. a saved file says when it was made and what was asked for");
{
  const when = new Date(2026, 2, 9, 14, 5, 3).getTime();
  const name = galleryName({ when, prompt: "Late afternoon sun, long shadows!",
                             mime: "image/png" }, 0);
  check("the stamp sorts chronologically", /^20260309-140503-01-/.test(name), name);
  check("the words are in it, tidied", /late-afternoon-sun-long-shadows/.test(name), name);
  check("and the extension follows the type",
        /\.png$/.test(name)
        && /\.jpg$/.test(galleryName({ when, prompt: "x", mime: "image/jpeg" }, 1)),
        name);
  //! Two renders in the same second must not be the same file name, or a zip
  //! of them quietly holds one.
  check("two in the same second do not collide",
        galleryName({ when, prompt: "x" }, 0) !== galleryName({ when, prompt: "x" }, 1),
        galleryName({ when, prompt: "x" }, 1));
}

console.log("\n9. base64 becomes the bytes it stood for");
{
  const bytes = base64Bytes("aGVsbG8=", s => Buffer.from(s, "base64").toString("binary"));
  check("hello comes back as five bytes",
        bytes.length === 5 && new TextDecoder().decode(bytes) === "hello",
        bytes.length + " bytes");
}

console.log("\n10. every suggested prompt says the geometry must not move");
{
  //! THE ONE THING THAT MAKES THESE USEFUL. An image model handed a view of a
  //! building will happily hand back a different, better-looking building, and
  //! the person comparing the two will not notice for a while. Every
  //! suggestion therefore ends by forbidding it - and this is the check that
  //! a new one added later does too.
  const quiet = PROMPT_IDEAS.filter(idea =>
    !/(geometry|unchanged|exactly as|keep every|where it is|composition|change nothing|stays exactly|all geometry|visible card)/i
      .test(idea.text));
  check("none of them lets the building change",
        quiet.length === 0,
        quiet.length ? quiet.map(i => i.label).join(", ")
                     : PROMPT_IDEAS.length + " suggestions");
  check("and each has a label short enough for the menu",
        PROMPT_IDEAS.every(i => i.label.length <= 34),
        PROMPT_IDEAS.map(i => i.label.length).join(" "));
}

console.log("\n11. references ride with the view, and the prompt says which is which");
{
  //! WHAT COULD BE SILENTLY WRONG HERE, which is the only reason this section
  //! exists: the ORDER. The service is handed a flat list of images with no
  //! labels - it has no role field, no captions, nothing - so the only way to
  //! say "the third one is the mood board" is to write it into the text. Two
  //! places deciding that order independently is how a prompt comes to call
  //! image 3 the mood board while image 3 is the building, and the result
  //! would be a plausible render of the wrong intent. No error, nothing to
  //! look at.
  const A = "A".repeat(400), B = "B".repeat(400), VIEW = "V".repeat(400);
  const made = nanoRequest({
    prompt: "make it evening", image: VIEW, key: "K",
    references: [{ role: "style", data: A, mime: "image/jpeg", name: "mood.jpg" },
                 { role: "material", data: B, mime: "image/png", name: "brick.png",
                   note: "the darker one" }],
  });
  const images = made.body.input.filter(one => one.type === "image");
  check("the text comes first", made.body.input[0].type === "text");
  check("then every reference, in order",
        images.length === 3 && images[0].data === A && images[1].data === B,
        images.map(one => one.data[0]).join(","));
  //! THE VIEW AFTER THE REFERENCES, which is the check that matters: a
  //! reference appended after it would be numbered as the view by the brief.
  //! With no mask the view is also the last image; with one it is second to
  //! last, and section 14 below pins that.
  check("and the view comes after them",
        images[images.length - 1].data === VIEW,
        images[images.length - 1].data[0]);
  check("each reference keeps its own type",
        images[0].mime_type === "image/jpeg" && images[1].mime_type === "image/png",
        images.map(one => one.mime_type).join(", "));

  const text = made.body.input[0].text;
  check("the brief numbers them the way they are sent",
        /Image 1 is a style reference/.test(text)
        && /Image 2 is a material reference/.test(text),
        text.slice(0, 70));
  check("and names the view by the right number",
        /Image 3 is the view to work on/.test(text),
        (text.match(/Image \d is the view[^.]*/) || ["missing"])[0]);
  check("a note on a reference reaches the prompt",
        /the darker one/.test(text));
  check("and the person's own words are still in there",
        text.includes("make it evening"));

  //! NO REFERENCES, NO BRIEF. A prompt that opens by explaining an empty list
  //! of images is a prompt with instructions in it about nothing.
  const plain = nanoRequest({ prompt: "just this", image: VIEW, key: "K" });
  check("with no references the prompt is untouched",
        plain.body.input[0].text === "just this", plain.body.input[0].text);
  check("and only the view is sent",
        plain.body.input.filter(one => one.type === "image").length === 1);
}

console.log("\n12. and the service's own limits are respected");
{
  const VIEW = "V".repeat(400);
  //! FOURTEEN IS THE PUBLISHED CEILING across the image models; the per-model
  //! breakdowns are narrower still. Sending more would be a request the
  //! service refuses, and a refusal for a reason the person cannot see.
  check("the ceiling is the published one", MAX_REFERENCES === 14,
        String(MAX_REFERENCES));
  const many = Array.from({ length: 20 }, (_, i) =>
    ({ role: "object", data: String(i).padStart(400, "x"), mime: "image/jpeg" }));
  const made = nanoRequest({ prompt: "x", image: VIEW, key: "K", references: many });
  const images = made.body.input.filter(one => one.type === "image");
  check("twenty references are cut to fourteen plus the view",
        images.length === MAX_REFERENCES + 1, images.length + " images");
  check("and the brief still names the view correctly",
        new RegExp("Image " + (MAX_REFERENCES + 1) + " is the view")
          .test(made.body.input[0].text),
        (made.body.input[0].text.match(/Image \d+ is the view[^.]*/) || ["missing"])[0]);

  //! A REFERENCE WITH NO BYTES is dropped rather than sent as an empty image,
  //! which would be a request the service rejects for a reason nobody can see.
  const gappy = nanoRequest({ prompt: "x", image: VIEW, key: "K",
    references: [{ role: "style", data: "" }, { role: "style", data: "Q".repeat(400) },
                 null] });
  check("an empty reference is dropped, not sent",
        gappy.body.input.filter(one => one.type === "image").length === 2);
  check("and the numbering closes up behind it",
        /Image 2 is the view to work on/.test(gappy.body.input[0].text),
        (gappy.body.input[0].text.match(/Image \d is the view[^.]*/) || ["missing"])[0]);
}

console.log("\n13. every role says what it is for, in the voice of an instruction");
{
  check("there are enough kinds to be useful", REFERENCE_ROLES.length >= 6,
        REFERENCE_ROLES.length + " roles");
  const bad = REFERENCE_ROLES.filter(one =>
    !one.key || !one.label || !one.says || one.says.length < 12);
  check("each has a key, a label and a sentence", bad.length === 0,
        bad.map(one => one.key || "?").join(", "));
  const keys = new Set(REFERENCE_ROLES.map(one => one.key));
  check("and the keys are distinct", keys.size === REFERENCE_ROLES.length,
        keys.size + " of " + REFERENCE_ROLES.length);
  //! AN UNKNOWN ROLE MUST NOT LOSE THE PICTURE. A saved reference from a
  //! version with a role this one has never heard of should still be sent as
  //! something rather than dropped or crashed on.
  check("an unknown role falls back rather than throwing",
        roleInfoFor("no-such-role").key === REFERENCE_ROLES[0].key,
        roleInfoFor("no-such-role").key);
  check("and the brief for one still reads",
        /Image 1 is a/.test(referenceBrief([{ role: "nonsense", data: "x" }])),
        referenceBrief([{ role: "nonsense", data: "x" }]).slice(0, 48));

  //! THE SHRINK SIZE. A mood board off a phone is 4000 px and 3 MB; six of
  //! those is eighteen megabytes of base64 in one POST. The number is a
  //! judgement, so what is checked is that it is a judgement somebody made
  //! rather than a stray value.
  check("references are sent at a workable size",
        REFERENCE_MAX_EDGE >= 512 && REFERENCE_MAX_EDGE <= 2048,
        REFERENCE_MAX_EDGE + " px on the long edge");
}

console.log("\n14. the object mask is numbered against the view it describes");
{
  //! WHAT WOULD BE SILENTLY WRONG. The mask is the one image that has to be
  //! named RELATIVE to another: "image 3 is a map for image 2". Every other
  //! image only needs its own number. So there are two numbers to get right
  //! and they come from the length of the reference list - which means adding
  //! a reference must move both, together. If they ever drift, the prompt
  //! tells the model to apply a colour map to a photograph of a mood board,
  //! and what comes back is a plausible render of nothing anybody asked for.
  const VIEW = "V".repeat(400), MASK = "M".repeat(400), REF = "R".repeat(400);
  const legend = [{ hex: "#FF0000", name: "Cladding", hint: "shiny copper" },
                  { hex: "#00FF00", name: "Slab" }];

  const plain = nanoRequest({ prompt: "evening", image: VIEW, key: "K",
                              mask: { data: MASK }, legend });
  const pics = plain.body.input.filter(one => one.type === "image");
  check("the view comes before the mask",
        pics.length === 2 && pics[0].data === VIEW && pics[1].data === MASK,
        pics.map(one => one.data[0]).join(","));
  check("and the brief numbers them 1 and 2",
        /Image 2 is a colour-coded object map for image 1/.test(plain.body.input[0].text),
        (plain.body.input[0].text.match(/Image \d is a colour-coded[^:]*/) || ["missing"])[0]);

  //! THE SAME THING WITH REFERENCES IN FRONT, which is where the two numbers
  //! can drift apart.
  const withRefs = nanoRequest({ prompt: "evening", image: VIEW, key: "K",
    mask: { data: MASK }, legend,
    references: [{ role: "style", data: REF }, { role: "context", data: REF }] });
  const many = withRefs.body.input.filter(one => one.type === "image");
  check("two references, then the view, then the mask",
        many.length === 4 && many[2].data === VIEW && many[3].data === MASK,
        many.map(one => one.data[0]).join(","));
  const text = withRefs.body.input[0].text;
  check("the brief calls the view image 3",
        /Image 3 is the view to work on/.test(text),
        (text.match(/Image \d is the view[^.]*/) || ["missing"])[0]);
  check("and the mask image 4, pointing back at 3",
        /Image 4 is a colour-coded object map for image 3/.test(text),
        (text.match(/Image \d is a colour-coded object map for image \d/) || ["missing"])[0]);

  //! NO MASK, NO MASK TALK. A prompt that explains a colour map that was not
  //! sent is a prompt telling the model to look for something that is not
  //! there.
  const none = nanoRequest({ prompt: "evening", image: VIEW, key: "K" });
  check("with no mask the prompt says nothing about one",
        !/colour-coded/.test(none.body.input[0].text), none.body.input[0].text);
  check("and only the view is sent",
        none.body.input.filter(one => one.type === "image").length === 1);
}

console.log("\n15. and it says what to do with each colour, and what not to");
{
  const said = maskBrief([{ hex: "#FF0000", name: "Cladding", hint: "shiny copper." },
                          { hex: "#00FF00", name: "Slab", hint: "" },
                          { hex: "#0000FF", name: "Glazing", hint: "clear, slim frames" }],
                         2, 1);
  check("an object with a hint gets an instruction",
        /The #FF0000 region is Cladding \u2014 shiny copper\./.test(said),
        (said.match(/The #FF0000[^.]*\./) || ["missing"])[0]);
  check("and so does the second one",
        /#0000FF region is Glazing/.test(said));
  //! A COLOUR WITH NOTHING TO SAY IS STILL NAMED. Left out, the model has a
  //! region in the mask that the prompt never mentions, and the obvious
  //! reading of that is "this one is for you to decide".
  check("an object with no hint is named and told to stay as it is",
        /no instruction of their own, so leave them as they are: #00FF00 is Slab/.test(said),
        (said.match(/no instruction[^.]*\./) || ["missing"])[0]);
  //! THE MASK MUST NOT BE PAINTED INTO THE ANSWER. Without saying so, a model
  //! handed a field of flat colours sometimes returns one.
  check("and the mask is told not to appear in the result",
        /Do not draw the mask/.test(said));
  check("the camera and the lighting are protected",
        /keep the camera, the lighting/.test(said));
  check("an empty legend says nothing at all", maskBrief([], 2, 1) === "");
}

console.log("\n16. the mask palette is usable as a palette");
{
  //! INDEX 0 MUST NOT BE BLACK, because black is the background: an object
  //! coloured like the background is an object the prompt names and the model
  //! cannot find.
  const first = maskColour(0);
  check("the first colour is not the background",
        first.r + first.g + first.b > 60, first.hex);
  //! NO TWO CLOSE ENOUGH TO CONFUSE, at any count. The page matches a
  //! rendered pixel back to its object within 3 of summed channel distance,
  //! so two colours closer than that would make two objects one region - and
  //! the whole palette has to clear it, not just the first handful.
  const TOLERANCE = 3;
  const closest = n => {
    const made = Array.from({ length: n }, (_, i) => maskColour(i));
    let nearest = Infinity, pair = "";
    for (let i = 0; i < made.length; i++)
      for (let j = i + 1; j < made.length; j++) {
        const gap = Math.abs(made[i].r - made[j].r) + Math.abs(made[i].g - made[j].g)
                  + Math.abs(made[i].b - made[j].b);
        if (gap < nearest) { nearest = gap; pair = made[i].hex + " / " + made[j].hex; }
      }
    return { nearest, pair, made };
  };
  const forty = closest(40);
  check("forty colours are far apart", forty.nearest >= 60,
        "closest pair " + forty.nearest + " apart: " + forty.pair);
  //! THE WHOLE PALETTE, which is where the first version of this was wrong:
  //! it stopped at forty, and the tier boundary at index 60 was producing an
  //! exact duplicate that a check over sixty-one indices found at once.
  const all = closest(maskColourCount());
  check("and so is the whole palette, by a clear margin",
        all.nearest > TOLERANCE * 2,
        maskColourCount() + " colours, closest pair " + all.nearest
          + " apart (tolerance " + TOLERANCE + "): " + all.pair);
  check("every one of them is distinct",
        new Set(all.made.map(one => one.hex)).size === all.made.length,
        new Set(all.made.map(one => one.hex)).size + " of " + all.made.length);
  check("and each is a legal six-digit hex",
        all.made.every(one => /^#[0-9A-F]{6}$/.test(one.hex)), all.made[0].hex);
  //! AND IT WRAPS RATHER THAN HANDING BACK NOTHING. A scene with more objects
  //! than colours is a scene where two share one, which the page resolves by
  //! dropping what it cannot separate - but maskColour must still answer.
  check("asking past the end still answers",
        /^#[0-9A-F]{6}$/.test(maskColour(maskColourCount() + 5).hex),
        maskColour(maskColourCount() + 5).hex);
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
