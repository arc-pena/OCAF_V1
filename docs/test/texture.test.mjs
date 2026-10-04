// Reading a material somebody dropped on the window.
//
// Two halves, and both are checkable without a browser. The zip's own format
// is bytes at offsets, so it is arithmetic; the naming is a question with a
// right answer for every library anybody actually downloads from, so the
// answers are written out and compared rather than eyeballed.
//
// The real ambientCG zip is here as the one case that is not a fixture: if the
// file is not on disk the section says so and is skipped, because a test that
// silently passes when its subject is missing is worse than no test.

import { BESIDE, IMAGE_TYPES, MAP_ROLES, materialFromFiles, nameFor, readZip,
         roleInfo, roleOf, unpack } from "../src/texture.js";
import { existsSync, readFileSync } from "fs";

let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console.log((ok ? "  ok   " : "  FAIL ") + name + (detail ? "  — " + detail : ""));
};

console.log("1. a filename says what the file is for, in every library's dialect");
{
  //! WRITTEN OUT BY LIBRARY, because each of these is a real filename from a
  //! real download and the whole job of roleOf is to answer the same for all
  //! of them. If a library changes its convention this is where it shows.
  const cases = [
    // ambientCG
    ["Concrete034_1K-JPG_Color.jpg", "colour"],
    ["Concrete034_1K-JPG_Roughness.jpg", "roughness"],
    ["Concrete034_1K-JPG_NormalGL.jpg", "normal"],
    ["Concrete034_1K-JPG_NormalDX.jpg", "normalDX"],
    ["Concrete034_1K-JPG_Displacement.jpg", "height"],
    ["Metal032_1K-JPG_Metalness.jpg", "metalness"],
    ["Bricks075A_1K-JPG_AmbientOcclusion.jpg", "occlusion"],
    // Poly Haven
    ["concrete_floor_02_diff_1k.jpg", "colour"],
    ["concrete_floor_02_rough_1k.jpg", "roughness"],
    ["concrete_floor_02_nor_gl_1k.jpg", "normal"],
    ["concrete_floor_02_ao_1k.jpg", "occlusion"],
    ["concrete_floor_02_disp_1k.png", "height"],
    // Substance / Quixel / a generic export
    ["T_Wall_basecolor.png", "colour"],
    ["T_Wall_metallic.png", "metalness"],
    ["T_Wall_normal.png", "normal"],
    ["surface_albedo.jpg", "colour"],
    ["surface_ORM.png", "orm"],
    ["oak_opacity.png", "opacity"],
    ["sign_emissive.jpg", "emission"],
    // A folder off somebody's drive
    ["rough.png", "roughness"],
    ["color.jpg", "colour"],
    ["ao.jpg", "occlusion"],
  ];
  let wrong = [];
  for (const [name, want] of cases) {
    const got = roleOf(name);
    if (got !== want) wrong.push(name + " -> " + got + ", wanted " + want);
  }
  check(cases.length + " filenames from five libraries all read correctly", !wrong.length,
        wrong.join("; ") || "every one");

  //! THE ONE THAT MUST NOT MATCH. A thumbnail, a logo, a readme. Reading a
  //! preview image as the colour map is how a material installs looking like
  //! a picture of itself in a frame.
  for (const name of ["Concrete034.png", "preview.jpg", "thumbnail.png", "logo.svg",
                      "Concrete034_1K-JPG.blend", "notes.txt"])
    check("  " + name + " is not a map", roleOf(name) === null, String(roleOf(name)));

  //! GL BEFORE DX, AND BOTH BEFORE PLAIN. A normal map's green points up in
  //! OpenGL and down in DirectX; the two are the same picture and using one
  //! for the other lights every bump from the wrong side.
  check("GL is preferred over a plain normal",
        roleOf("x_NormalGL.jpg") === "normal" && roleOf("x_Normal.jpg") === "normal");
  check("and DX is told apart from it",
        roleOf("x_NormalDX.jpg") === "normalDX");
  //! basecolor before color, or "basecolor" would match the general pattern
  //! first and the specific one would never run.
  check("and the specific patterns are tried before the general",
        roleOf("T_basecolor.png") === "colour" && roleOf("T_ORM.png") === "orm");

  check("every role says what it is and which space it is in",
        MAP_ROLES.every(one => one.role && one.says && /^(srgb|linear)$/.test(one.space)));
  check("and colour maps are sRGB while data maps are not",
        roleInfo("colour").space === "srgb" && roleInfo("roughness").space === "linear"
        && roleInfo("emission").space === "srgb" && roleInfo("normal").space === "linear");
}

console.log("\n2. a pile of files adds up to one material");
{
  const files = [
    { name: "Concrete034_1K-JPG/Concrete034_1K-JPG_Color.jpg" },
    { name: "Concrete034_1K-JPG/Concrete034_1K-JPG_Roughness.jpg" },
    { name: "Concrete034_1K-JPG/Concrete034_1K-JPG_NormalGL.jpg" },
    { name: "Concrete034_1K-JPG/Concrete034_1K-JPG_Displacement.jpg" },
    { name: "Concrete034_1K-JPG/Concrete034_1K-JPG.blend" },
    { name: "Concrete034_1K-JPG/Concrete034.png" },
  ];
  const made = materialFromFiles(files);
  check("it finds the four maps", Object.keys(made.maps).sort().join(",")
        === "colour,height,normal,roughness", Object.keys(made.maps).join(","));
  check("and names it after what the files share",
        made.name === "Concrete034", made.name);
  check("and says what it left beside", made.beside.includes("Concrete034_1K-JPG.blend"),
        made.beside.join(", "));
  check("and what it did not recognise", made.ignored.includes("Concrete034.png"),
        made.ignored.join(", "));
  check("and that it is usable", made.usable === true);

  //! A DUPLICATE ROLE KEEPS THE FIRST AND SAYS SO. A folder with both a JPG
  //! and a PNG colour map is common; using both is not a thing.
  const twice = materialFromFiles([
    { name: "a_Color.jpg" }, { name: "a_Color.png" }, { name: "a_Rough.jpg" }]);
  check("a second colour map is kept out of the way, not used",
        twice.duplicates.length === 1 && twice.maps.colour.name === "a_Color.jpg",
        twice.duplicates.join(", "));

  //! A DX NORMAL AND NOTHING ELSE is still better than no normal - used, and
  //! the fact that its green is upside down carried so the page can flip it.
  const dx = materialFromFiles([{ name: "b_Color.jpg" }, { name: "b_NormalDX.jpg" }]);
  check("a DirectX normal alone is used, and flagged to be flipped",
        !!dx.maps.normal && dx.flipGreen === true && !dx.maps.normalDX,
        dx.said);
  const both = materialFromFiles([{ name: "b_NormalGL.jpg" }, { name: "b_NormalDX.jpg" },
                                  { name: "b_Color.jpg" }]);
  check("and with both, GL wins and nothing is flipped",
        both.maps.normal.name === "b_NormalGL.jpg" && both.flipGreen === false);

  //! A FOLDER OF PICTURES IS NOT A MATERIAL. Installing a grey nothing and
  //! saying it worked is the failure this guards.
  const nope = materialFromFiles([{ name: "holiday.jpg" }, { name: "cat.png" }]);
  check("a folder with no maps in it is not usable", nope.usable === false, nope.said);
  check("and says so rather than installing nothing",
        /no maps/.test(nope.said), nope.said);

  //! A Mac archive's shadow files, which are in every zip made on a Mac and
  //! are named after the real ones - so they match every pattern.
  const mac = materialFromFiles([
    { name: "x_Color.jpg" }, { name: "__MACOSX/._x_Color.jpg" }, { name: "x_Rough.jpg" }]);
  check("a Mac archive's shadow files are skipped",
        !mac.duplicates.length && Object.keys(mac.maps).length === 2,
        mac.duplicates.join(", ") || "clean");
}

console.log("\n3. the zip is read from its central directory");
{
  const ZIP = "/tmp/claude-0/c34.zip";
  if (!existsSync(ZIP)) {
    console.log("  -- skipped: " + ZIP + " is not here. Fetch it with:");
    console.log('     curl -sSL -o /tmp/claude-0/c34.zip "https://ambientcg.com/get?file=Concrete034_1K-JPG.zip"');
    failures++;                      // a skipped section is not a passing one
    console.log("  FAIL the real zip was not available to read");
  } else {
    const bytes = new Uint8Array(readFileSync(ZIP));
    const entries = readZip(bytes);
    check("it lists every entry", entries.length === 10, entries.length + " entries");
    const colour = entries.find(one => /_Color\.jpg$/.test(one.name));
    check("and finds the colour map", !!colour, colour && colour.name);
    //! NOT A BYTE COUNT I TYPED. The first version of this asserted 269629
    //! because that is roughly what the listing showed, and the real figure is
    //! 269501 - so the only thing it tested was my arithmetic. A size read out
    //! of the directory and compared with the size read out of the directory
    //! is circular anyway. What is NOT circular is below: the extracted bytes
    //! have to be a whole JPEG and have to be exactly as long as the directory
    //! promised, and a reader that is a few bytes out fails both.
    check("the colour map is a quarter of a megabyte, as a 1K JPEG should be",
          colour.size > 200000 && colour.size < 400000, colour.size + " bytes");

    //! THE BYTES ARE REALLY THE FILE. A zip reader that is a few bytes out
    //! returns something that is still a Uint8Array and still the right
    //! length - so the check is the JPEG's own magic number, which is the one
    //! thing that cannot be right by accident.
    const data = await unpack(colour);
    check("and the bytes start with a JPEG's own marker",
          data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
          [...data.slice(0, 3)].map(v => v.toString(16)).join(" "));
    check("and end with one", data[data.length - 2] === 0xff && data[data.length - 1] === 0xd9,
          [...data.slice(-2)].map(v => v.toString(16)).join(" "));
    check("and are the length the directory said",
          data.length === colour.size, data.length + " vs " + colour.size);

    //! And the whole thing adds up to a material.
    const made = materialFromFiles(entries);
    check("the zip is a material with four maps",
          made.usable && Object.keys(made.maps).sort().join(",")
            === "colour,height,normal,roughness",
          made.name + ": " + made.said);
    check("named after the asset", made.name === "Concrete034", made.name);
  }
}

console.log("\n4. a file that is not a zip says so rather than guessing");
{
  let said = null;
  try { readZip(new Uint8Array([1, 2, 3, 4, 5])); } catch (e) { said = e.message; }
  check("a few random bytes are refused by name", /not a zip/.test(String(said)), String(said));
  let big = null;
  try { readZip(new Uint8Array(200000)); } catch (e) { big = e.message; }
  check("and so is a large file with no directory in it",
        /not a zip/.test(String(big)), String(big));
}

console.log(failures ? "\n" + failures + " check(s) failed" : "\nall checks passed");
process.exit(failures ? 1 : 0);
