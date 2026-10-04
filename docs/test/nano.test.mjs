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
  NANO_DEFAULT_MODEL, NANO_ENDPOINT, NANO_RATIOS, PROMPT_IDEAS,
  base64Bytes, crc32, dataUrlParts, galleryName, imageFromReply, nanoRequest,
  ratioFor, storeZip, troubleFromReply,
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

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
