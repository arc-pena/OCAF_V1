// The renderer.
//
// One engine, two doors. The showroom is a room you walk into - the model on a
// stage, nothing else on screen. Rendered mode is the same renderer looking
// through the modelling camera, so you can leave it on while you work. Both are
// this file; neither has its own idea of what brass looks like.
//
// It is a PATH TRACER. Every pixel is a path traced from the eye through the
// scene and back to a light, and the picture is the average of many of them.
// That is why it converges rather than appears: the first frame is noisy and
// the hundredth is not, and nothing in between is wrong, only unfinished. It
// buys three things a rasteriser cannot give at any price - true soft shadows
// from the size of the source, interreflection between surfaces, and glass that
// refracts what is actually behind it.
//
// three-gpu-pathtracer over three.js, both MIT, bundled by
// scripts/build_pathtracer.mjs and vendored - see docs/vendor/README.md. The
// bundle hangs its exports off `window.PT`, which is the same shape the
// showroom used to load PlayCanvas in, so payload.js carries it unchanged: unpacked
// from the document in the single file, fetched from beside the page when
// served, and not loaded at all until somebody asks to render.
//
// THE PAGE'S OWN three IS A DIFFERENT COPY AND A DIFFERENT VERSION. The
// modelling viewport is r128 and the path tracer needs r150 or later, so they
// are two engines that never touch. Nothing of three's crosses between them:
// the kernel's triangles arrive as plain arrays and the camera arrives as six
// numbers. Pass a THREE.Vector3 from the page in here and it will be the wrong
// Vector3.

import { resource } from "./payload.js";
// The materials themselves live with the view styles: one table, so the
// renderer and the modelling view cannot disagree about what brass is.
import { materialOf } from "./styles.js";
// And the node materials, which are the other way of saying the same thing: a
// finish is a name for some numbers, a Material is a graph that makes them.
import { bakeShade, bakeSize } from "./material.js";

/* --------------------------------------------------------- environments */

// An environment is what a metal has to reflect, and it is the only light in
// the room unless a preset says otherwise. These are written as HDR: the sky is
// around 1 and a light card is 20 to 60 times that, because what makes a
// rendered part read as a photographed part is a small, very bright source. An
// environment drawn in 8-bit cannot hold that ratio - everything above white
// clips to white - and the result is the flat, evenly-lit look of a viewport
// rather than of a photograph.
//
//   sky      the overall brightness of the dome
//   cards    how many overhead strips, and how bright
//   ground   what the floor of the dome bounces back
//   floor    whether there is a real floor under the part, and how glossy
//   back     what the camera sees where nothing is - null means the dome
export const ENVIRONMENTS = [
  // A black stage: no visible backdrop, hard strips grazing the form, and the
  // floor reading only as a reflection. What the light does IS the picture.
  { key: "noir", label: "Noir", exposure: 1.15,
    sky: [0.012, 0.014, 0.018], horizon: [0.02, 0.021, 0.024], ground: [0.015, 0.015, 0.018],
    cards: 3, cardPower: 60, cardWidth: 0.030, cardLength: 0.40, cardTilt: 0.16,
    band: 0, floor: true, floorRough: 0.08, floorColor: [0.035, 0.037, 0.042],
    back: [0.016, 0.018, 0.021] },

  // A seamless white sweep with two big soft boxes over it. The reference look
  // for a product photograph, and the one that flatters a machined part.
  { key: "studio", label: "Studio", exposure: 1.25,
    sky: [0.85, 0.88, 0.92], horizon: [0.72, 0.75, 0.79], ground: [0.42, 0.43, 0.45],
    cards: 2, cardPower: 22, cardWidth: 0.16, cardLength: 0.52, cardTilt: 0.30,
    band: 0, floor: true, floorRough: 0.42, floorColor: [0.55, 0.56, 0.58],
    back: null },

  // Late sun through a window: warm and strongly from one side, so the form is
  // read by the shadow it casts rather than by its outline.
  { key: "warm", label: "Warm", exposure: 1.30,
    sky: [0.52, 0.56, 0.68], horizon: [0.72, 0.56, 0.40], ground: [0.26, 0.21, 0.17],
    cards: 1, cardPower: 48, cardWidth: 0.09, cardLength: 0.30, cardTilt: 0.46,
    band: 0.18, floor: true, floorRough: 0.30, floorColor: [0.40, 0.34, 0.29],
    back: null },

  // Dusk: a cold dome, one low warm source, and no floor - the part floats.
  { key: "dusk", label: "Dusk", exposure: 1.45,
    sky: [0.10, 0.12, 0.20], horizon: [0.16, 0.14, 0.19], ground: [0.05, 0.05, 0.07],
    cards: 1, cardPower: 30, cardWidth: 0.07, cardLength: 0.26, cardTilt: 0.60,
    band: 0.10, floor: false, floorRough: 0.2, floorColor: [0.1, 0.1, 0.12],
    back: [0.035, 0.036, 0.047] },

  // Overcast: a bright even dome and nothing else. No highlight to speak of,
  // which is exactly what you want when the question is the shape of a
  // surface rather than how it is lit.
  { key: "overcast", label: "Overcast", exposure: 1.2,
    sky: [1.05, 1.08, 1.12], horizon: [0.88, 0.90, 0.93], ground: [0.52, 0.53, 0.55],
    cards: 0, cardPower: 0, cardWidth: 0, cardLength: 0, cardTilt: 0,
    band: 0, floor: true, floorRough: 0.65, floorColor: [0.62, 0.63, 0.64],
    back: null },
];

export const findEnvironment = key =>
  ENVIRONMENTS.find(e => e.key === key) || ENVIRONMENTS[0];

//! THE ENVIRONMENT, DRAWN RATHER THAN LOADED. A published page may not fetch,
//! so there is no .hdr to load even if one were wanted - and a dome this simple
//! is better written as arithmetic anyway, because then it has no resolution.
//!
//! The callback is handed a spherical coordinate per texel: phi is 0 straight
//! up and PI straight down, theta goes round. The colour is written in LINEAR
//! light with no clamp, which is what lets a card be sixty.
export function paintEnvironment(PT, preset, size = 512) {
  const { THREE } = PT;
  const texture = new PT.ProceduralEquirectTexture(size * 2, size);
  const sky = preset.sky, horizon = preset.horizon, ground = preset.ground;

  //! Where the cards hang. Evenly spaced round the dome, tilted down from the
  //! zenith by cardTilt - straight overhead gives a top highlight and nothing
  //! down the sides, which is the mistake that makes a render look like a
  //! viewport. 40 degrees off vertical is where a photographer puts a soft box.
  const cards = [];
  for (let i = 0; i < preset.cards; i++) {
    const turn = preset.cards === 1 ? 0.62 : (i / preset.cards) + 0.12;
    cards.push({ theta: (turn * 2 - 1) * Math.PI, phi: preset.cardTilt * Math.PI });
  }

  texture.generationCallback = (polar, uv, coord, color) => {
    //! phi is 0 at the top. Fold it to a height from -1 at the floor to +1 at
    //! the zenith, then blend sky to horizon to ground across it.
    const up = Math.cos(polar.phi);
    let r, g, b;
    if (up >= 0) {
      const t = Math.pow(up, 0.65);
      r = horizon[0] + (sky[0] - horizon[0]) * t;
      g = horizon[1] + (sky[1] - horizon[1]) * t;
      b = horizon[2] + (sky[2] - horizon[2]) * t;
    } else {
      const t = Math.pow(-up, 0.5);
      r = horizon[0] + (ground[0] - horizon[0]) * t;
      g = horizon[1] + (ground[1] - horizon[1]) * t;
      b = horizon[2] + (ground[2] - horizon[2]) * t;
    }

    //! A GRAZING BAND just above the horizon, for the long highlight down the
    //! side of an upright form. Narrow, and only where a preset asks for it.
    if (preset.band > 0) {
      const d = Math.abs(up - 0.10) / 0.09;
      if (d < 1) {
        const k = (1 - d * d) * preset.band * 12;
        r += k; g += k * 0.97; b += k * 0.9;
      }
    }

    //! THE CARDS. An angular distance on the sphere, so a card is a round-ended
    //! strip however the texture is laid out - which is the difference between
    //! a highlight that stays the same shape as the part turns and one that
    //! stretches towards the poles with the equirect projection.
    for (const card of cards) {
      let dTheta = polar.theta - card.theta;
      while (dTheta > Math.PI) dTheta -= Math.PI * 2;
      while (dTheta < -Math.PI) dTheta += Math.PI * 2;
      //! Along the card, scaled down near the pole the way a real strip is:
      //! sin(phi) is the circumference at this height.
      const along = dTheta * Math.sin(Math.max(polar.phi, 0.08)) / preset.cardLength;
      const across = (polar.phi - card.phi) / preset.cardWidth;
      const d = Math.hypot(Math.max(0, Math.abs(along) - 0.6) * 2.2, across);
      if (d < 1.6) {
        //! A soft edge rather than a hard one: a card with a hard edge draws a
        //! hard-edged reflection, which reads as a bug rather than as a light.
        const k = Math.pow(Math.max(0, 1 - d / 1.6), 2.2) * preset.cardPower;
        r += k; g += k; b += k;
      }
    }

    color.setRGB(r, g, b, THREE.LinearSRGBColorSpace);
  };
  texture.update();
  return texture;
}

/* --------------------------------------------------------- the bundle */

//! Runs the engine source in global scope. A published page may not fetch it,
//! so it travels inside the document, gzipped, and is unpacked on first use;
//! served from a web server it is a file beside the page. Not loaded at all
//! until somebody opens a renderer, either way.
export async function loadEngine(payloadId, payloadUrl) {
  if (window.PT) return window.PT;
  const source = await (await resource(payloadId, payloadUrl, "the rendering engine")).text();
  const script = document.createElement("script");
  script.textContent = source;
  document.head.appendChild(script);
  if (!window.PT) throw new Error("the rendering engine did not start");
  return window.PT;
}

/* --------------------------------------------------------- the engine */

//! How hard it is trying. A path tracer has one real quality dial - how many
//! samples have been averaged - but a few things decide how FAST those samples
//! arrive and how far the light is allowed to go before it is given up on.
export const QUALITIES = [
  { key: "draft",  label: "Draft",  bounces: 3, transmissive: 2, scale: 0.5,  target: 48,
    summary: "half resolution, three bounces — for turning the part around" },
  { key: "good",   label: "Good",   bounces: 5, transmissive: 4, scale: 1,    target: 256,
    summary: "full resolution, five bounces — the working setting" },
  { key: "final",  label: "Final",  bounces: 10, transmissive: 8, scale: 1,   target: 1500,
    summary: "ten bounces — for the picture you keep" },
];
export const findQuality = key => QUALITIES.find(q => q.key === key) || QUALITIES[1];

//! CANDELA, FOR EVERY KIND OF LIGHT. The document asks for one number in one
//! unit, because a lighting schedule is written in candela and a person
//! comparing a downlight with a soft box should be comparing like with like.
//!
//! three does not take one number. A point light's intensity IS candela; an
//! area light's is NITS, candela per square metre, because what matters about
//! a panel is how bright its surface is rather than how much it adds up to. So
//! a 4000 cd point source and a 4000 cd panel are the same amount of light,
//! and without this conversion the panel would be as many times too bright as
//! it has square metres.
//!
//! The model is in millimetres, so the area is scaled by a million on the way.
const nitsFor = (candela, widthMm, heightMm) => {
  const area = Math.max(1e-9, (widthMm / 1000) * (heightMm / 1000));
  return candela / area;
};

export class RenderEngine {
  constructor({ canvas, payloadId, payloadUrl }) {
    this.canvas = canvas;
    this.payloadId = payloadId;
    this.payloadUrl = payloadUrl || null;
    this.PT = null;
    this.parts = new Map();        // feature id -> { mesh, material, name }
    this.environment = "studio";
    this.exposure = 1;
    this.quality = "good";
    this.turntable = false;
    this.selected = null;
    this.reflection = 0.42;
    this.onPick = () => {};
    this.onSample = () => {};
    //! Said to the page rather than thrown. A skylight with no image yet is
    //! not a reason to stop rendering everything else.
    this.onTrouble = () => {};
    this.orbit = { yaw: -35, pitch: 22, distance: 900, target: [0, 0, 0] };
    this.bounds = null;
    this.lights = [];
    this.sky = null;
    this.size = [1, 1];
    //! Set while an export is running. The frame loop keeps its hands off the
    //! renderer meanwhile - two things resizing one canvas is how you get an
    //! export at the wrong size with a screenful of the other one in it.
    this.exporting = false;
    this.paused = false;
  }

  get ready() { return !!this.renderer; }
  get samples() { return this.tracer ? Math.floor(this.tracer.samples) : 0; }
  get targetSamples() { return findQuality(this.quality).target; }

  async start() {
    if (this.renderer) return;
    const PT = this.PT = await loadEngine(this.payloadId, this.payloadUrl);
    const THREE = PT.THREE;

    const renderer = this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas, antialias: false, alpha: false,
      preserveDrawingBuffer: true,          // so an export can read the canvas
    });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(1);              // a path tracer pays for every pixel

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 1, 100000);

    //! OpenCascade is Z-up and three is Y-up, so every part hangs under one
    //! group that carries the change of frame. The triangles are never touched.
    this.model = new THREE.Group();
    this.model.rotation.x = -Math.PI / 2;
    this.scene.add(this.model);

    this.buildGround();

    this.tracer = new PT.WebGLPathTracer(renderer);
    //! Shown while the samples are still arriving, and while the camera moves.
    //! A rasterised preview of the same scene is a far better thing to look at
    //! than four samples of path tracing, and it costs one frame.
    this.tracer.rasterizeScene = true;
    this.tracer.renderToCanvas = true;
    this.tracer.dynamicLowRes = true;
    this.tracer.lowResScale = 0.25;
    this.tracer.renderDelay = 60;
    this.tracer.minSamples = 3;
    this.tracer.fadeDuration = 350;
    this.tracer.textureSize.set(1024, 1024);

    this.applyQuality(this.quality);
    this.applyEnvironment(this.environment);
    this.bindPointer();
    this._raycaster = new THREE.Raycaster();
  }

  dispose() {
    if (!this.renderer) return;
    for (const [, part] of this.parts) this.disposePart(part);
    this.parts.clear();
    this.dropTextures();
    this.disposeLights();
    if (this.envMap) this.envMap.dispose();
    if (this.ground) { this.ground.geometry.dispose(); this.ground.material.dispose(); }
    this.renderer.dispose();
    this.renderer = null;
    this.tracer = null;
  }

  disposePart(part) {
    this.model.remove(part.mesh);
    part.mesh.geometry.dispose();
    part.material.dispose();
  }

  /* ------------------------------------------------------------- the stage */

  buildGround() {
    const THREE = this.PT.THREE;
    //! A disc rather than a plane, and a big one. The path tracer traces real
    //! geometry, so what is under the part is what casts the shadow and what
    //! carries the reflection - but a square floor shows its corners in a
    //! wide shot, and a disc does not.
    const geometry = new THREE.CircleGeometry(1, 96);
    geometry.rotateX(-Math.PI / 2);
    this.groundMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8a8d90, roughness: 0.4, metalness: 0,
    });
    this.ground = new THREE.Mesh(geometry, this.groundMaterial);
    this.ground.scale.setScalar(50000);
    this.scene.add(this.ground);
  }

  applyEnvironment(key) {
    const preset = findEnvironment(key);
    this.environment = preset.key;
    if (!this.renderer) return;
    const THREE = this.PT.THREE;

    if (this.envMap) this.envMap.dispose();
    this.envMap = paintEnvironment(this.PT, preset, 512);
    this.scene.environment = this.envMap;
    //! The backdrop is either the dome itself or a flat colour. A flat one is
    //! what makes the black stage read as a stage rather than as a room.
    this.scene.background = preset.back
      ? new THREE.Color().setRGB(preset.back[0], preset.back[1], preset.back[2],
                                 THREE.LinearSRGBColorSpace)
      : this.envMap;

    this.groundMaterial.color.setRGB(preset.floorColor[0], preset.floorColor[1],
                                     preset.floorColor[2], THREE.LinearSRGBColorSpace);
    this.presetExposure = preset.exposure;
    this.setExposure(this.exposure);
    this.setGroundVisible(preset.floor !== false);
    this.setReflection(preset.floorRough === undefined ? 0.4 : 1 - preset.floorRough);
    this.refreshScene();
  }

  applyQuality(key) {
    this.quality = findQuality(key).key;
    if (!this.tracer) return;
    const q = findQuality(this.quality);
    this.tracer.bounces = q.bounces;
    this.tracer.transmissiveBounces = q.transmissive;
    this.tracer.renderScale = q.scale;
    this.restart();
  }

  setExposure(value) {
    this.exposure = value;
    if (this.renderer) this.renderer.toneMappingExposure = value * (this.presetExposure || 1);
  }

  setGroundVisible(visible) {
    if (!this.ground) return;
    this.ground.visible = !!visible;
    this.refreshScene();
  }

  //! What used to be a mirrored copy of the part held back to a fraction of its
  //! brightness. A path tracer does not need the trick: the floor reflects
  //! because it is a surface with a roughness, so the dial is that roughness.
  setReflection(strength) {
    this.reflection = strength;
    if (!this.groundMaterial) return;
    this.groundMaterial.roughness = Math.max(0.02, 1 - strength);
    this.groundMaterial.metalness = 0;
    this.refreshMaterials();
  }

  /* ---------------------------------------------------------------- maps */

  //! A shade program, baked into a texture.
  //!
  //! CACHED BY WHAT IT IS, not by which feature it came from. Two bodies
  //! wearing the same material share one texture, and a rebuild that did not
  //! change the program re-uses it - which matters because baking is the one
  //! thing here that costs real time: a 1024 map is a million evaluations of
  //! the program, on the main thread, and doing it again on every edit would
  //! make the renderer feel broken.
  textureFor(program, tiles, kind) {
    if (!program) return null;
    if (!this._textures) this._textures = new Map();
    //! The image's own bytes are the key's bulk, so a material with four 1 MB
    //! maps would make a four-megabyte string every time this is called. The
    //! length and the first forty characters of the base64 identify it well
    //! enough: two different images of the same length whose first thirty
    //! bytes agree would be the same JPEG header and a coincidence nobody has
    //! had.
    //! The key is taken BEFORE the bytes are looked up, from what identifies
    //! the image rather than from the image: which feature holds it, and what
    //! is being done to it. Keying on the base64 would mean building the
    //! megabyte string on every call, which is the cost this change exists to
    //! remove.
    const stamp = program.op === "image"
      ? "image|" + program.role + "|" + program.flip + "|" + program.brightness
        + "|" + (program.at || "") + "|" + (program.image || "").length
      : JSON.stringify(program);
    const key = kind + "|" + tiles + "|" + stamp;
    const had = this._textures.get(key);
    if (had) return had;

    const THREE = this.PT.THREE;
    //! A PHOTOGRAPH, not a program to evaluate. The browser decodes it; this
    //! only has to say which colour space it is in and how it repeats.
    if (program.op === "image") {
      //! The bytes live on the Texture node this points at. Looked up rather
      //! than carried, so one image is in the document once however many
      //! materials wear it.
      const held = program.image ? program
        : (program.at && this.imagery ? this.imagery.get(program.at) : null);
      if (!held || !held.image) return null;
      program = { ...program, image: held.image };
      const texture = new THREE.Texture();
      texture.colorSpace = program.space === "srgb" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(tiles, tiles);
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      const image = new Image();
      image.onload = () => {
        texture.image = image;
        texture.needsUpdate = true;
        //! The scene was handed over before this arrived, so the tracer is
        //! holding a texture with no pixels in it. Re-reading the materials is
        //! cheap - it does not touch the BVH - and is what puts the picture in.
        this.refreshMaterials();
        this.restart();
      };
      image.onerror = () => this.onTrouble("a texture would not decode"
        + (program.from ? " \u2014 " + program.from : ""));
      //! The bytes are base64 in the document, which is what a data URL is
      //! already, so there is nothing to decode here: the browser does it.
      image.src = "data:image/*;base64," + program.image;
      this._textures.set(key, texture);
      return texture;
    }
    const size = bakeSize(program);
    const linear = bakeShade(program, size, tiles);
    const bytes = new Uint8Array(size * size * 4);
    //! COLOUR IS SEEN, EVERYTHING ELSE IS READ. A colour map is encoded to
    //! sRGB and tagged as such, because eight bits spread linearly puts almost
    //! all of them above mid grey and bands every shadow. A roughness or metal
    //! map is a NUMBER the shader uses as it stands, so it is written raw and
    //! tagged as no colour space at all - encode one of those and every rough
    //! surface comes out polished.
    const encode = kind === "colour"
      ? v => (v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055)
      : v => v;
    for (let i = 0, j = 0; i < linear.length; i += 3, j += 4) {
      bytes[j] = Math.round(Math.min(1, Math.max(0, encode(linear[i]))) * 255);
      bytes[j + 1] = Math.round(Math.min(1, Math.max(0, encode(linear[i + 1]))) * 255);
      bytes[j + 2] = Math.round(Math.min(1, Math.max(0, encode(linear[i + 2]))) * 255);
      bytes[j + 3] = 255;
    }
    const texture = new THREE.DataTexture(bytes, size, size, THREE.RGBAFormat);
    texture.colorSpace = kind === "colour" ? THREE.SRGBColorSpace : THREE.NoColorSpace;
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
    this._textures.set(key, texture);
    return texture;
  }

  //! Nothing in the cache is wanted any more. Called when the scene is thrown
  //! away rather than on every edit, because the whole point of the cache is
  //! that an edit to one node does not re-bake the other nine.
  dropTextures() {
    if (!this._textures) return;
    for (const [, texture] of this._textures) texture.dispose();
    this._textures.clear();
  }

  //! A Material feature, onto a body. The node graph has already resolved
  //! itself into numbers and programs by the time it gets here - see the
  //! drivers in wasm-kernel.js - so this is assignment and baking, no
  //! evaluation of a graph and no walking of the document.
  applyMaterial(id, made) {
    const part = this.parts.get(id);
    if (!part || !made) return;
    const THREE = this.PT.THREE;
    const m = part.material;
    const tiles = made.tiles || 1;

    m.color.setRGB(made.colour[0], made.colour[1], made.colour[2], THREE.LinearSRGBColorSpace);
    m.roughness = Math.max(0.015, made.roughness);
    m.metalness = made.metalness;
    m.transmission = made.transmission || 0;
    m.ior = made.ior || 1.5;
    m.opacity = 1;
    m.transparent = false;
    if (m.transmission > 0)
      m.thickness = this.bounds
        ? Math.max(1, this.bounds.getSize(new THREE.Vector3()).length() * 0.02) : 4;

    //! EMISSION IS A LIGHT, so it is not clamped at one. A strip of LED in a
    //! ceiling is a hundred times the brightness of the white paper beside it
    //! and the whole room is lit by the difference; held at 1 it would be a
    //! pale grey rectangle lighting nothing.
    const emit = made.emissionStrength || 0;
    m.emissive.setRGB(made.colour[0] * emit, made.colour[1] * emit,
                      made.colour[2] * emit, THREE.LinearSRGBColorSpace);
    m.emissiveIntensity = 1;

    const maps = made.maps || {};
    const put = (slot, kind) => {
      const texture = this.textureFor(maps[kind], tiles, kind);
      if (m[slot] && m[slot] !== texture) { /* owned by the cache; never disposed here */ }
      m[slot] = texture;
    };
    put("map", "colour");
    put("roughnessMap", "roughness");
    put("metalnessMap", "metalness");
    put("emissiveMap", "emission");
    put("normalMap", "normal");
    put("aoMap", "occlusion");
    //! A DIRECTX NORMAL, FLIPPED HERE rather than in the image. three has a
    //! scale for exactly this and it costs nothing; re-encoding a megabyte of
    //! JPEG with its green inverted costs a second and loses quality.
    if (m.normalMap) {
      const dx = maps.normal && maps.normal.flip;
      m.normalScale = new THREE.Vector2(1, dx ? -1 : 1);
    }
    //! A map multiplies the value beside it, so a roughness map on a material
    //! whose roughness is 0.2 can never make anything rougher than 0.2. The
    //! number becomes the CEILING once a map is wired, which is almost never
    //! what was meant - so the scalars go to one and the map carries it.
    if (m.roughnessMap) m.roughness = 1;
    if (m.metalnessMap) m.metalness = 1;
    if (m.map) m.color.setRGB(1, 1, 1, THREE.LinearSRGBColorSpace);
    m.needsUpdate = true;
  }

  /* ------------------------------------------------------------- the parts */

  //! Takes the triangles the kernel already streamed, as they are. Datums are
  //! modelling aids and have no place in a picture, so only bodies come through.
  setScene(features, meshes) {
    const THREE = this.PT.THREE;
    for (const [, part] of this.parts) this.disposePart(part);
    this.parts.clear();

    for (const entry of features) {
      if (!entry.visible || entry.category === "datum") continue;
      const stream = meshes.get(entry.id);
      if (!stream || !stream.positions || !stream.index || !stream.index.length) continue;

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position",
        new THREE.BufferAttribute(Float32Array.from(stream.positions), 3));
      if (stream.normals && stream.normals.length === stream.positions.length)
        geometry.setAttribute("normal",
          new THREE.BufferAttribute(Float32Array.from(stream.normals), 3));
      geometry.setIndex(new THREE.BufferAttribute(Uint32Array.from(stream.index), 1));
      if (!geometry.attributes.normal) geometry.computeVertexNormals();

      const material = new THREE.MeshPhysicalMaterial();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = entry.name || entry.id;
      mesh.userData.id = entry.id;
      this.model.add(mesh);
      this.parts.set(entry.id, { mesh, material, name: entry.name });
      this.paint(entry.id, entry.appearance, true);
    }

    this.measure();
    //! MATERIALS LAST, and only after measure(), because a transmissive
    //! material needs a thickness and a thickness is a fraction of how big the
    //! thing is. Painted over the finish rather than instead of it: a body
    //! with no Material pointed at it keeps the one it had, which is what
    //! makes every model built before materials existed still correct.
    this.applyMaterials(features);
    //! AFTER the materials, because a light that is seen is a material too -
    //! and before refreshScene, because the tracer reads the lights when the
    //! scene is handed over.
    this.applyLights(features);
    this.refreshScene();
  }

  //! Every Material in the document, onto the bodies each one names. The list
  //! is walked in tree order and the last one wins, so a material added later
  //! overrides an earlier one on the same body - the same rule the tree uses
  //! everywhere else, and the one a person expects from stacking.
  applyMaterials(features) {
    //! WHERE THE IMAGES ARE. A Material's map says which feature holds its
    //! bytes rather than carrying them - see shadeFrom in the kernel - so this
    //! is the index that turns one into the other. Built per rebuild from the
    //! tree that is already in hand, which costs nothing: it is a map of a
    //! dozen ids to programs that are already here.
    this.imagery = new Map();
    for (const entry of features)
      if (entry.data && entry.data.program && entry.data.program.op === "image")
        this.imagery.set(entry.id, entry.data.program);
    //! WHO A MATERIAL OWNS, so that changing a finish on a body that has one
    //! does not quietly undo it. The finish swatches are still live - a body
    //! wears both - but the Material is the more particular statement and the
    //! more particular statement wins. Delete the Material and the finish is
    //! still underneath, which is what makes trying one out safe.
    this.materialled = new Set();
    for (const entry of features) {
      if (entry.type !== "Material") continue;
      const data = entry.data;
      if (!data || data.kind !== "material" || !data.material) continue;
      for (const id of data.of || []) {
        this.applyMaterial(id, data.material);
        this.materialled.add(id);
      }
    }
  }

  //! Where everything is, in the renderer's own frame - which is only true
  //! after the Z-up group's rotation has been applied, so the matrices are
  //! updated first. The floor is then put under the lowest point of it.
  measure() {
    const THREE = this.PT.THREE;
    this.scene.updateMatrixWorld(true);
    const box = new THREE.Box3();
    let any = false;
    for (const [, part] of this.parts) {
      part.mesh.geometry.computeBoundingBox();
      const one = new THREE.Box3().setFromObject(part.mesh);
      if (any) box.union(one); else { box.copy(one); any = true; }
    }
    if (!any) { this.bounds = null; return; }
    this.bounds = box;
    const centre = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3()).length();
    this.ground.position.y = box.min.y;
    this.ground.scale.setScalar(Math.max(5000, size * 30));
    this.orbit.target = [centre.x, centre.y, centre.z];
    this.orbit.distance = Math.max(10, size * 1.7);
    //! A path tracer is unforgiving about a near plane: set it far too close
    //! and the depth of the first hit is lost in the float, which reads as a
    //! haze over everything. Scaled to the model, like everything else here.
    this.camera.near = Math.max(0.01, size / 5000);
    this.camera.far = Math.max(1000, size * 200);
    this.camera.updateProjectionMatrix();
    this.place();
  }

  paint(id, appearance, quiet = false) {
    const part = this.parts.get(id);
    if (!part) return;
    //! See applyMaterials: a body a Material owns keeps it.
    if (this.materialled && this.materialled.has(id)) return;
    const THREE = this.PT.THREE;
    const made = materialOf(appearance);
    const m = part.material;

    m.color.setRGB(made.color[0], made.color[1], made.color[2], THREE.LinearSRGBColorSpace);
    m.metalness = made.metalness;
    //! The table stores GLOSS, which is how a person thinks about a finish, and
    //! three wants ROUGHNESS, which is the other end of the same stick.
    m.roughness = Math.max(0.015, 1 - made.gloss);

    //! GLASS IS NOT A FADED SOLID. The rasteriser could only blend it, so the
    //! table says opacity; a path tracer can refract, so an opacity under one
    //! becomes real transmission with a thickness and an index. This is the one
    //! place the two renderers differ about a material, and the difference is
    //! that this one is right.
    if (made.opacity < 0.999) {
      m.transmission = 1 - made.opacity;
      m.ior = 1.5;
      m.thickness = this.bounds
        ? Math.max(1, this.bounds.getSize(new THREE.Vector3()).length() * 0.02) : 4;
      m.opacity = 1;
      m.transparent = false;
      m.roughness = Math.min(m.roughness, 0.08);
    } else {
      m.transmission = 0;
      m.opacity = 1;
      m.transparent = false;
    }
    m.needsUpdate = true;
    if (!quiet) this.refreshMaterials();
  }

  /* ---------------------------------------------------------------- lights

     A light in the document is a few numbers; a light in the tracer is one of
     five things its shader knows how to sample. This is the one place the two
     meet.

     THE SOURCE IS INVISIBLE BY DEFAULT, and that is not an omission - it is
     how an analytic light works. The shader aims rays AT the light and knows
     its radiance; camera rays never hit it, because there is nothing there to
     hit. So "and is seen" is a thing that has to be ADDED - a thin emissive
     plate at the light's own place - and the cost of adding it is said on
     screen rather than hidden: an emissive surface is found by rays that
     happen to wander into it, so it is noisier than the light it stands for.  */

  disposeLights() {
    for (const one of this.lights || []) {
      if (one.parent) one.parent.remove(one);
      if (one.geometry) one.geometry.dispose();
      if (one.material) one.material.dispose();
      if (one.target && one.target.parent) one.target.parent.remove(one.target);
    }
    this.lights = [];
  }

  //! Every light in the document, into the scene. Z-up to Y-up like
  //! everything else, through the one mapping in setCameraFromZUp's comment.
  //!
  //! A light that is switched off is simply not built: the tracer collects
  //! `visible` lights, and building one and hiding it would leave it in the
  //! material and light tables costing a slot for nothing.
  applyLights(features) {
    const THREE = this.PT.THREE;
    this.lastFeatures = features;
    this.disposeLights();
    //! A SKYLIGHT REPLACED THE ENVIRONMENT, so deleting one has to put the
    //! preset's dome back. Noticed by comparing what was there last time:
    //! without this, removing the only skylight leaves the scene lit by a sky
    //! that is no longer in the document, which looks like the delete failing.
    const hadSky = !!this.sky;
    this.sky = null;
    const toY = ([x, y, z]) => new THREE.Vector3(x, z, -y);

    for (const entry of features) {
      const said = entry.data && entry.data.light;
      if (!said || !said.on) continue;
      if (entry.visible === false) continue;
      const colour = new THREE.Color().setRGB(said.colour[0], said.colour[1], said.colour[2],
                                              THREE.LinearSRGBColorSpace);

      if (said.kind === "sky") { this.applySky(said); continue; }

      if (said.kind === "point") {
        const light = new THREE.PointLight(colour, said.power);
        light.position.copy(toY(said.at));
        //! The source has a SIZE, which is the whole of why a shadow has a
        //! soft edge. three calls it `distance` on a PointLight and means
        //! something else by it; the tracer reads `radius`, which the library
        //! adds for exactly this.
        light.radius = said.radius;
        light.userData.feature = entry.id;
        this.scene.add(light);
        this.lights.push(light);
        if (said.seen) this.lights.push(this.seenPlate(toY(said.at), null, colour,
                                                       said.radius, true));
        continue;
      }

      if (said.kind === "target") {
        const at = toY(said.at), target = toY(said.target);
        if (said.shape === 0) {
          //! A SPOT, with the two angles a lighting plan carries. three has
          //! one angle and a penumbra fraction, so the pair is converted:
          //! `angle` is the field's half-angle and `penumbra` is how much of
          //! it is the falloff rather than the hot centre.
          const field = Math.max(said.field, said.hotspot + 0.5);
          const light = new this.PT.PhysicalSpotLight(colour, said.power);
          light.angle = field * Math.PI / 360;
          light.penumbra = Math.max(0, Math.min(1, 1 - said.hotspot / field));
          light.decay = 2;
          light.radius = Math.max(1, said.width / 2);
          light.position.copy(at);
          light.target.position.copy(target);
          this.scene.add(light);
          this.scene.add(light.target);
          light.userData.feature = entry.id;
          this.lights.push(light);
          if (said.seen)
            this.lights.push(this.seenPlate(at, target, colour, light.radius, true));
          continue;
        }
        //! A SOFT BOX, rectangular or circular. ShapedAreaLight is the
        //! library's own RectAreaLight with a flag, and the flag is the whole
        //! difference between a panel and a disc.
        const circular = said.shape === 2;
        const w = said.width, h = circular ? said.width : said.height;
        //! A disc of diameter w has area pi r^2, not w x h - so the circular
        //! case is given its real area rather than the square it fits in,
        //! which would make every disc 27 % dimmer than the panel beside it.
        const area = circular ? [w, w * Math.PI / 4] : [w, h];
        const light = new this.PT.ShapedAreaLight(colour, nitsFor(said.power, area[0], area[1]),
                                                  w, h);
        light.isCircular = circular;
        light.position.copy(at);
        light.lookAt(target);
        light.userData.feature = entry.id;
        this.scene.add(light);
        this.lights.push(light);
        if (said.seen)
          this.lights.push(this.seenPlate(at, target, colour, circular ? w / 2 : 0,
                                          circular, circular ? 0 : [w, h]));
      }
    }
    if (hadSky && !this.sky) this.applyEnvironment(this.environment);
  }

  //! THE SOURCE, WHEN SOMEBODY WANTS TO SEE IT. A thin emissive plate facing
  //! the camera-ward side, at the light's own size. Emissive geometry in a
  //! path tracer is a real light, so this one is deliberately weak compared
  //! with the analytic light beside it - it is there to be LOOKED at, not to
  //! light the room, and making it carry the room's light would double every
  //! lamp and triple the noise.
  seenPlate(at, target, colour, radius, round, rect) {
    const THREE = this.PT.THREE;
    const geometry = rect
      ? new THREE.PlaneGeometry(rect[0], rect[1])
      : new THREE.SphereGeometry(Math.max(radius, 1), 20, 14);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x000000, roughness: 1,
      emissive: colour, emissiveIntensity: 1, side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(at);
    if (rect && target) mesh.lookAt(target);
    this.scene.add(mesh);
    return mesh;
  }

  //! THE DOME. A skylight replaces the environment the preset put there - it
  //! IS the environment - so the two cannot both be in force and the light
  //! wins, because somebody who added a skylight meant it.
  applySky(said) {
    const THREE = this.PT.THREE;
    //! A BUILT-IN SKY IS ONE OF THE PAINTED DOMES. The renderer already draws
    //! four environments as arithmetic - sky, horizon, ground and light cards,
    //! in high dynamic range - and a skylight choosing one of them is the same
    //! dome asked for from the document instead of from the render bar. So
    //! there is nothing to fetch, nothing to wait for, and it works in the
    //! single file where fetching is not allowed at all.
    //!
    //! Cached, because painting one is 512 x 1024 evaluations of the dome and
    //! doing it on every rebuild would make dragging a light's rotation feel
    //! like dragging the whole model.
    //! THE REAL SKY IF IT CAN BE REACHED, the painted one if it cannot.
    //!
    //! "Overcast" means overcast. Whether it is a photograph of an overcast
    //! sky or four lines of arithmetic that look like one depends on where
    //! this page is: served, the HDR is a file beside it; in the single file,
    //! fetching is not allowed at all and there is nothing to fetch. So the
    //! node asks for a CONDITION and the renderer answers with the best source
    //! it has - and says which, so nobody has to guess why one is sharper.
    //!
    //! Asked for once and remembered. The fetch is started here and the dome
    //! is painted meanwhile, so a skylight lights the scene on the first frame
    //! and sharpens when the file lands rather than showing nothing until it
    //! does.
    let texture = said.sky === 4 ? this.loadedSky : this.skyFile(said.sky);
    if (!texture && said.sky !== 4) texture = this.builtInSky(said.sky);
    if (!texture) {
      //! Asked for a file and none has arrived. Say so rather than leaving the
      //! scene lit by whatever was there before, which looks like the skylight
      //! working.
      this.onTrouble("that skylight has no image yet \u2014 open one on its Image field");
      return;
    }
    this.scene.environment = texture;
    this.scene.background = said.seen ? texture : null;
    this.skySource = said.sky === 4 ? "the image you opened"
      : (this.skyFiles && this.skyFiles.get(["studio", "overcast", "clear", "sunset"][said.sky])
         ? "a photographed sky" : "a painted dome");
    this.scene.environmentIntensity = said.power;
    this.scene.backgroundIntensity = said.power;
    this.scene.environmentRotation = new THREE.Euler(0, said.turn * Math.PI / 180, 0);
    this.scene.backgroundRotation = new THREE.Euler(0, said.turn * Math.PI / 180, 0);
    this.sky = said;
  }

  //! The photographed sky for a condition, once it has arrived. Null until it
  //! has, and null for ever in the single file, where there is nothing beside
  //! the page to fetch.
  //!
  //! One request per sky per session, whether it worked or not: a page with no
  //! sky files beside it must not ask four times on every rebuild.
  skyFile(which) {
    const keys = ["studio", "overcast", "clear", "sunset"];
    const key = keys[Math.max(0, Math.min(keys.length - 1, Math.round(which || 0)))];
    if (!this.skyFiles) this.skyFiles = new Map();
    if (this.skyFiles.has(key)) return this.skyFiles.get(key);
    this.skyFiles.set(key, null);                       // asked; do not ask again
    if (!this.skyUrl) return null;
    new this.PT.RGBELoader().load(this.skyUrl + key + ".hdr",
      texture => {
        texture.mapping = this.PT.THREE.EquirectangularReflectionMapping;
        this.skyFiles.set(key, texture);
        //! The scene is already lit by the painted dome, so this is a swap
        //! rather than a first paint: rebuild the lights and start the
        //! average again, because the light has genuinely changed.
        if (this.sky && this.lastFeatures) {
          this.applyLights(this.lastFeatures);
          this.refreshScene();
        }
      },
      undefined,
      () => { /* no file beside this page; the painted dome stands */ });
    return null;
  }

  //! The four built-in domes, by the Skylight node's own order. Named here
  //! rather than by index at the call site so that adding one is adding a row.
  builtInSky(which) {
    const keys = ["studio", "overcast", "warm", "dusk"];
    const key = keys[Math.max(0, Math.min(keys.length - 1, Math.round(which || 0)))];
    if (!this.skies) this.skies = new Map();
    if (!this.skies.has(key))
      this.skies.set(key, paintEnvironment(this.PT, findEnvironment(key), 512));
    return this.skies.get(key);
  }

  //! AN IMAGE SOMEBODY OPENED, as an equirectangular environment. The page
  //! reads the file - it is the page that has a FileReader - and hands over
  //! the decoded pixels; nothing here knows what a .hdr is.
  //!
  //! Radiance .hdr is the format a sky is actually distributed in, and it is
  //! not something a browser decodes: the loader is in the bundle, and the
  //! page passes the bytes. An ordinary JPEG or PNG works too and is tagged
  //! sRGB, which is right for it and wrong for an HDR - which is why the two
  //! are told apart by the caller rather than guessed at here.
  setSkyImage(data, { width, height, float = false }) {
    const THREE = this.PT.THREE;
    if (this.loadedSky) this.loadedSky.dispose();
    const texture = new THREE.DataTexture(data, width, height,
      THREE.RGBAFormat, float ? THREE.FloatType : THREE.UnsignedByteType);
    texture.mapping = THREE.EquirectangularReflectionMapping;
    texture.colorSpace = float ? THREE.NoColorSpace : THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.minFilter = texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    this.loadedSky = texture;
    return texture;
  }

  /* ------------------------------------------------------------ the tracer */

  //! The scene has changed shape, so the BVH and the material tables have to be
  //! rebuilt. Expensive - this is the one call that walks every triangle - so
  //! it is never made from a frame loop, only from an edit.
  refreshScene() {
    if (!this.tracer || this.exporting) return;
    this.tracer.setScene(this.scene, this.camera);
  }

  //! ONLY THE MATERIALS CHANGED. setScene walks every triangle into a BVH;
  //! this re-reads the material table and the textures and leaves the BVH
  //! alone. Painting a part is the commonest thing anybody does in a renderer
  //! and it must not cost what adding a part costs - on a building that is the
  //! difference between a swatch answering at once and the window stopping
  //! for a second every time you touch one.
  refreshMaterials() {
    if (!this.tracer || this.exporting) return;
    this.tracer.updateMaterials();
  }

  //! The camera moved, or a dial did. Cheap: throws the average away and starts
  //! collecting again, which is all a path tracer means by "redraw".
  restart() {
    if (this.tracer) this.tracer.updateCamera();
  }

  //! ONE FRAME. Called from the page's own loop rather than running its own, so
  //! a renderer in a mode nobody is looking at costs nothing.
  tick(dt = 0) {
    if (!this.tracer || this.exporting) return;
    if (this.turntable && dt) { this.orbit.yaw += dt * 9; this.place(); }
    this.tracer.pausePathTracing = this.paused;
    this.tracer.renderSample();
    this.onSample(this.samples, this.targetSamples);
  }

  /* -------------------------------------------------------------- viewing */

  place() {
    if (!this.camera) return;
    const yaw = this.orbit.yaw * Math.PI / 180;
    const pitch = this.orbit.pitch * Math.PI / 180;
    const [tx, ty, tz] = this.orbit.target;
    const cp = Math.cos(pitch);
    this.camera.position.set(
      tx + this.orbit.distance * cp * Math.sin(yaw),
      ty + this.orbit.distance * Math.sin(pitch),
      tz + this.orbit.distance * cp * Math.cos(yaw));
    this.camera.lookAt(tx, ty, tz);
    this.restart();
  }

  //! THE OTHER DOOR. Rendered mode looks through the modelling camera, which
  //! belongs to a different copy of three in a different version - so it
  //! arrives as numbers. Z-up, like the kernel and like the viewport, and
  //! turned into this renderer's Y-up here, in the one place that knows.
  setCameraFromZUp({ eye, target, fov }) {
    if (!this.camera) return;
    const toY = ([x, y, z]) => [x, z, -y];
    const [ex, ey, ez] = toY(eye);
    const [tx, ty, tz] = toY(target);
    this.camera.position.set(ex, ey, ez);
    //! LOOKING STRAIGHT DOWN is the one direction an up vector cannot answer.
    //! In TOP the view direction is within a few degrees of the up axis, and
    //! lookAt resolves the roll from a cross product that is nearly zero - so
    //! the picture spins on its own axis for a pixel of camera movement, and
    //! every spin throws the average away and starts again. Tilted up is a
    //! point exactly on the far side, which is well defined and is what the
    //! modelling view's own near-vertical cap already gives it.
    const look = [tx - ex, ty - ey, tz - ez];
    const len = Math.hypot(look[0], look[1], look[2]) || 1;
    const vertical = Math.abs(look[1] / len);
    this.camera.up.set(0, 1, 0);
    if (vertical > 0.9995) this.camera.up.set(0, 0, look[1] > 0 ? 1 : -1);
    this.camera.lookAt(tx, ty, tz);
    if (fov && Math.abs(fov - this.camera.fov) > 1e-4) {
      this.camera.fov = fov;
      this.camera.updateProjectionMatrix();
    }
    this.orbit.target = [tx, ty, tz];
    this.orbit.distance = Math.hypot(ex - tx, ey - ty, ez - tz);
    this.restart();
  }

  //! Eases the view to a hero framing, so arriving is a move rather than a cut.
  frame(fromOrbit, duration = 900) {
    if (!this.bounds) return;
    const THREE = this.PT.THREE;
    const size = this.bounds.getSize(new THREE.Vector3()).length();
    const start = { ...this.orbit, target: [...this.orbit.target] };
    if (fromOrbit) Object.assign(start, fromOrbit, { target: [...this.orbit.target] });
    const end = { yaw: -35, pitch: 18, distance: size * 1.75 };
    const began = performance.now();
    const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = () => {
      const t = Math.min(1, (performance.now() - began) / duration);
      const k = ease(t);
      this.orbit.yaw = start.yaw + (end.yaw - start.yaw) * k;
      this.orbit.pitch = start.pitch + (end.pitch - start.pitch) * k;
      this.orbit.distance = start.distance + (end.distance - start.distance) * k;
      this.place();
      if (t < 1) requestAnimationFrame(step);
    };
    Object.assign(this.orbit, start);
    this.place();
    requestAnimationFrame(step);
  }

  spin(dt) { if (this.turntable) { this.orbit.yaw += dt * 9; this.place(); } }

  resize(width, height) {
    if (!this.renderer || this.exporting) return;
    const w = Math.max(1, Math.round(width)), h = Math.max(1, Math.round(height));
    if (this.size[0] === w && this.size[1] === h) return;
    this.size = [w, h];
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.restart();
  }

  /* --------------------------------------------------------------- export */

  //! THE PICTURE YOU KEEP. Renders at whatever size is asked for, however long
  //! it takes, and hands back a PNG. It is not the canvas scaled up: the
  //! renderer is resized, the samples are collected at that size, and the
  //! viewport is put back afterwards - so a 4000 px export is 4000 px of
  //! rendering rather than 4000 px of a 1000 px picture.
  //!
  //! Yields to the browser between samples on purpose. A tight loop would hold
  //! the thread for minutes and the page would be reported as hung.
  async toImage({ width, height, samples = 400, onProgress = () => {},
                  shouldStop = () => false } = {}) {
    if (!this.tracer) throw new Error("the renderer has not started");
    if (this.exporting) throw new Error("an export is already running");
    const w = Math.max(1, Math.round(width || this.size[0]));
    const h = Math.max(1, Math.round(height || this.size[1]));
    const was = { size: [...this.size], scale: this.tracer.renderScale,
                  delay: this.tracer.renderDelay, fade: this.tracer.fadeDuration,
                  min: this.tracer.minSamples, low: this.tracer.dynamicLowRes };

    this.exporting = true;
    try {
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      //! Nothing in the way of the picture: no preview, no fade, no low-res
      //! stand-in. Every one of those is there to make MOVING look good, and
      //! an export is not moving.
      this.tracer.renderScale = 1;
      this.tracer.renderDelay = 0;
      this.tracer.fadeDuration = 0;
      this.tracer.minSamples = 1;
      this.tracer.dynamicLowRes = false;
      //! AND IT IS NOT PAUSED. The frame loop pauses the tracer when the
      //! renderer is not the thing on screen, and that flag is sticky - an
      //! export started from a paused renderer collected nothing, for ever,
      //! because the loop below waits for a sample count that cannot move.
      //! Found by a drive that sat in the export for twenty minutes.
      this.tracer.pausePathTracing = false;
      this.tracer.setScene(this.scene, this.camera);
      this.tracer.updateCamera();

      //! Stopping is a legitimate end, not a failure: a path trace at ninety
      //! samples is the same picture as one at four hundred, slightly noisier,
      //! and handing back what has been collected is better than handing back
      //! nothing. So the loop breaks and the blob is read either way.
      //!
      //! AND IT GIVES UP rather than spinning. If the sample count has not
      //! moved in this many frames something is wrong that waiting will not
      //! fix - a lost context, a shader that would not compile, a flag like
      //! the one above - and an export that hangs is worse than one that says
      //! what happened, because a hang looks like slowness and slowness is
      //! what a path trace looks like anyway.
      let stuck = 0, had = -1;
      while (this.tracer.samples < samples && !shouldStop()) {
        this.tracer.renderSample();
        const got = Math.floor(this.tracer.samples);
        stuck = got > had ? 0 : stuck + 1;
        had = got;
        if (stuck > 240)
          throw new Error("the renderer stopped collecting samples at " + got
                          + " of " + samples);
        onProgress(got, samples);
        await new Promise(go => requestAnimationFrame(go));
      }
      //! Read it in the same frame it was drawn in. preserveDrawingBuffer is
      //! on for exactly this - without it the buffer is cleared at the end of
      //! the frame and toBlob answers with a transparent rectangle, which is
      //! the failure that looks like an export working.
      const blob = await new Promise(done => this.canvas.toBlob(done, "image/png"));
      if (!blob) throw new Error("the browser would not read the picture back");
      return blob;
    } finally {
      this.exporting = false;
      this.tracer.renderScale = was.scale;
      this.tracer.renderDelay = was.delay;
      this.tracer.fadeDuration = was.fade;
      this.tracer.minSamples = was.min;
      this.tracer.dynamicLowRes = was.low;
      this.size = [-1, -1];
      this.resize(was.size[0], was.size[1]);
      this.tracer.setScene(this.scene, this.camera);
    }
  }

  /* -------------------------------------------------------------- picking */

  bindPointer() {
    const el = this.canvas;
    let mode = null, lastX = 0, lastY = 0, moved = 0;

    el.addEventListener("pointerdown", event => {
      mode = (event.shiftKey || event.button === 1 || event.button === 2) ? "pan" : "orbit";
      lastX = event.clientX; lastY = event.clientY; moved = 0;
      el.setPointerCapture(event.pointerId);
    });
    el.addEventListener("pointermove", event => {
      if (!mode) return;
      const dx = event.clientX - lastX, dy = event.clientY - lastY;
      lastX = event.clientX; lastY = event.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (mode === "orbit") {
        this.orbit.yaw -= dx * 0.4;
        this.orbit.pitch = Math.max(-8, Math.min(80, this.orbit.pitch + dy * 0.3));
      } else {
        const scale = this.orbit.distance * 0.0016;
        this.orbit.target[0] -= dx * scale * Math.cos(this.orbit.yaw * Math.PI / 180);
        this.orbit.target[2] += dx * scale * Math.sin(this.orbit.yaw * Math.PI / 180);
        this.orbit.target[1] += dy * scale;
      }
      this.place();
    });
    el.addEventListener("pointerup", event => {
      if (mode === "orbit" && moved < 4) this.pick(event);
      mode = null;
    });
    el.addEventListener("pointercancel", () => { mode = null; });
    el.addEventListener("contextmenu", event => event.preventDefault());
    el.addEventListener("wheel", event => {
      event.preventDefault();
      this.orbit.distance = Math.max(0.5, Math.min(2e6,
        this.orbit.distance * (1 + Math.sign(event.deltaY) * 0.12)));
      this.place();
    }, { passive: false });
  }

  //! Against the triangles, not the bounding boxes. The showroom used to pick
  //! by box because its engine had nothing cheaper; three has a raycaster, so
  //! clicking a hole in a bracket now picks what is behind the hole.
  pick(event) {
    const rect = this.canvas.getBoundingClientRect();
    const PT = this.PT;
    const point = new PT.THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1);
    this._raycaster.setFromCamera(point, this.camera);
    const hits = this._raycaster.intersectObjects(
      [...this.parts.values()].map(p => p.mesh), false);
    this.onPick(hits.length ? hits[0].object.userData.id : null);
  }

  //! A renderer does not draw selection handles; the part lifts a little out
  //! of the floor instead. Under the Z-up group, local +Z is world up.
  highlight(id) {
    this.selected = id;
    let moved = false;
    for (const [key, part] of this.parts) {
      const want = key === id ? Math.max(1, this.orbit.distance * 0.012) : 0;
      if (Math.abs(part.mesh.position.z - want) < 1e-6) continue;
      part.mesh.position.z = want;
      moved = true;
    }
    if (moved) this.refreshScene();
  }
}
