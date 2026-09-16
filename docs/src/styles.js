// What the model looks like.
//
// Two separate things live here, because they are two halves of one question.
//
// A MATERIAL is a property of an object: this bracket is brass, that slab is
// concrete. It is held on the feature, travels in the model file, and is the
// same fact whichever window is looking - the modelling view and the showroom
// read it from the same table.
//
// A VIEW STYLE is a property of the WINDOW: how the whole model is drawn at
// this moment. Shaded is for modelling and says nothing about materials.
// Rendered obeys them. Arctic ignores them on purpose - everything is the same
// white clay, lit by nothing but its own shape, so what you are looking at is
// the FORM and not the paint. That is what Rhino's Arctic is for and what
// Enscape's white mode is for, and the reason both of them draw a black line
// along every sharp edge: without it a white model against a white background
// loses its corners.
//
// The arctic pass is written here rather than in the app because it is a
// renderer, not an interface: four passes, two render targets and about a
// hundred lines of GLSL, and none of it knows what a feature is.

/* ------------------------------------------------------------- materials */

//! The material library. A finish is a name for a set of numbers a person
//! recognises - "brass" rather than metalness 1, gloss 0.8 - and it is the
//! whole of what most objects need. Anything more particular is an override
//! on top of one, which is how Rhino's material properties work: pick the
//! closest thing, then move the sliders.
export const FINISHES = [
  // What everything is until somebody says otherwise. A material a person has
  // not chosen should look like a part, not like chrome - and every sample in
  // this document that asks for a finish nobody ever wrote lands here too.
  { key: "default",  label: "Default",        color: [0.58, 0.63, 0.67], metalness: 0.12, gloss: 0.45 },
  { key: "aluminium",label: "Aluminium",      color: [0.80, 0.82, 0.84], metalness: 1,    gloss: 0.55 },
  { key: "steel",    label: "Brushed steel",  color: [0.62, 0.65, 0.68], metalness: 1,    gloss: 0.62 },
  { key: "chrome",   label: "Chrome",         color: [0.88, 0.90, 0.93], metalness: 1,    gloss: 0.96 },
  { key: "brass",    label: "Brass",          color: [0.83, 0.66, 0.31], metalness: 1,    gloss: 0.80 },
  { key: "anodised", label: "Anodised black", color: [0.09, 0.10, 0.11], metalness: 0.85, gloss: 0.45 },
  { key: "paint",    label: "Gloss paint",    color: [0.16, 0.42, 0.66], metalness: 0.05, gloss: 0.92 },
  { key: "matte",    label: "Matte white",    color: [0.90, 0.90, 0.89], metalness: 0.02, gloss: 0.22 },
  { key: "oak",      label: "Oak",            color: [0.71, 0.53, 0.31], metalness: 0,    gloss: 0.35 },
  { key: "concrete", label: "Concrete",       color: [0.60, 0.59, 0.56], metalness: 0,    gloss: 0.12 },
  { key: "glass",    label: "Glass",          color: [0.78, 0.86, 0.90], metalness: 0.02, gloss: 0.98,
    opacity: 0.22 },
];

export const findFinish = key => FINISHES.find(f => f.key === key) || FINISHES[0];

//! What an object is actually made of: the finish it names, with whatever it
//! says for itself on top. One answer, in one shape, for every renderer -
//! because "the showroom shows brass and the viewport shows grey" is not two
//! opinions about a material, it is a bug.
//!
//! Gloss and roughness are the same number said two ways round. Both are here
//! because the two renderers ask for different ones, and converting it twice
//! in two places is how they drift apart.
export function materialOf(appearance) {
  const finish = findFinish(appearance && appearance.finish);
  const own = appearance || {};
  const number = (value, fallback) => (typeof value === "number" ? value : fallback);
  const gloss = Math.min(1, Math.max(0, number(own.gloss, finish.gloss)));
  return {
    finish: finish.key,
    label: finish.label,
    color: Array.isArray(own.color) && own.color.length === 3 ? own.color : finish.color,
    metalness: Math.min(1, Math.max(0, number(own.metalness, finish.metalness))),
    gloss,
    roughness: Math.min(1, Math.max(0.02, 1 - gloss)),
    opacity: Math.min(1, Math.max(0.02, number(own.opacity, number(finish.opacity, 1)))),
  };
}

//! The same, as the record that is written into the document. Only what
//! differs from the finish is kept, so a model file says "brass" rather than
//! four numbers that happen to be brass - and a finish whose numbers are
//! changed later changes everything wearing it.
export function appearanceOf(finishKey, overrides = {}) {
  const finish = findFinish(finishKey);
  const out = { finish: finish.key, color: finish.color };
  for (const key of ["color", "metalness", "gloss", "opacity"]) {
    const value = overrides[key];
    if (value === undefined || value === null) continue;
    const same = key === "color"
      ? Array.isArray(value) && value.every((v, i) => Math.abs(v - finish.color[i]) < 1e-3)
      : Math.abs(value - (key === "opacity" ? (finish.opacity || 1) : finish[key])) < 1e-3;
    if (same && key !== "color") delete out[key];
    else out[key] = value;
  }
  return out;
}

//! #rrggbb from the 0..1 triple the document holds, and back. The document
//! keeps linear-ish triples because that is what both renderers take; a colour
//! input is hex because that is what a person is given.
export const hexOf = rgb =>
  "#" + rgb.map(v => Math.round(Math.min(1, Math.max(0, v)) * 255)
    .toString(16).padStart(2, "0")).join("");
export const rgbOf = hex => {
  const clean = String(hex || "").replace("#", "");
  const full = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean;
  const n = parseInt(full, 16);
  return Number.isFinite(n) && full.length === 6
    ? [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255] : [0.5, 0.5, 0.5];
};

/* ----------------------------------------------------------- view styles */

//! The three ways of looking, and what each one is FOR. The flags are read by
//! the viewport rather than interpreted: a style is a row in this table and
//! adding a fourth is adding a row.
export const VIEW_STYLES = [
  { key: "shaded", label: "Shaded",
    summary: "For modelling. One neutral grey on everything, tangent edges drawn, "
           + "datums and the grid where you left them.",
    materials: false, edges: true, datums: true, ground: true, clay: null },
  { key: "rendered", label: "Rendered",
    summary: "What things are made of. Every body wears its own material, lit by a "
           + "sky and a floor; no tangent edges, because a rendered view has no "
           + "wireframe in it.",
    materials: true, edges: false, datums: false, ground: true, clay: null },
  { key: "arctic", label: "Arctic",
    summary: "Form, and nothing else. One white clay everywhere, shaded by ambient "
           + "occlusion so the shape of a corner is the only thing that darkens it, "
           + "with a black line along every sharp edge and silhouette.",
    materials: false, edges: false, datums: false, ground: false,
    clay: [0.88, 0.885, 0.89] },
];

export const findStyle = key => VIEW_STYLES.find(s => s.key === key) || VIEW_STYLES[0];

/* --------------------------------------------------------------- arctic

   Ambient occlusion and ink, in four passes.

   1. The model is drawn into a buffer holding nothing but a view-space normal
      and a linear depth, packed into one RGBA8 texture: the normal
      octahedrally in two channels, the depth as a 16-bit pair in the other
      two. That is everything the next two passes need and it costs one extra
      draw of the geometry.

   2. Ambient occlusion, at half resolution because it is a low-frequency
      thing. The estimator is McGuire's Alchemy AO: for a ring of neighbours,
      how far each one sticks up out of the plane of the point being shaded,
      over the square of how far away it is. No light, no shadow map, no
      randomness that has to be filtered out later - just the geometry
      disagreeing with its own tangent plane.

   3. The model again, in clay, into the canvas.

   4. One full-screen quad, multiplied over it, carrying the blurred occlusion
      AND the lines. The lines are found here rather than drawn as geometry
      because the interesting ones are not in the model: a silhouette is an
      edge between a surface and whatever is behind it, and which edge that is
      changes every time the camera moves. Both kinds fall out of the same
      buffer - a jump in depth is a silhouette, a jump in normal is a crease -
      which is why a fillet's tangent edge draws no line and the corner of a
      box does.                                                              */

const QUAD_VERTEX = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

//! Shared by the buffer that writes the normals and the passes that read them.
const OCT = `
vec2 octEncode(vec3 n) {
  n /= (abs(n.x) + abs(n.y) + abs(n.z));
  vec2 e = n.xy;
  if (n.z < 0.0) e = (1.0 - abs(n.yx)) * vec2(n.x >= 0.0 ? 1.0 : -1.0, n.y >= 0.0 ? 1.0 : -1.0);
  return e * 0.5 + 0.5;
}
vec3 octDecode(vec2 e) {
  e = e * 2.0 - 1.0;
  vec3 n = vec3(e.x, e.y, 1.0 - abs(e.x) - abs(e.y));
  float t = max(-n.z, 0.0);
  n.x += n.x >= 0.0 ? -t : t;
  n.y += n.y >= 0.0 ? -t : t;
  return normalize(n);
}
vec2 packDepth(float v) {
  v = clamp(v, 0.0, 1.0) * 255.0;
  float hi = floor(v);
  return vec2(hi / 255.0, v - hi);
}
float unpackDepth(vec2 v) { return v.x + v.y / 255.0; }`;

const BUFFER_VERTEX = `
varying vec3 vNormal;
varying float vDepth;
void main() {
  vec4 seen = modelViewMatrix * vec4(position, 1.0);
  vNormal = normalMatrix * normal;
  vDepth = -seen.z;
  gl_Position = projectionMatrix * seen;
}`;

const BUFFER_FRAGMENT = `
precision highp float;
uniform float reach;
varying vec3 vNormal;
varying float vDepth;
${OCT}
void main() {
  vec3 n = normalize(vNormal);
  // Both sides of a surface face the camera as far as this is concerned: a
  // single-sided sheet seen from behind is still a surface with an edge.
  if (!gl_FrontFacing) n = -n;
  gl_FragColor = vec4(octEncode(n), packDepth(vDepth / reach));
}`;

const AO_FRAGMENT = `
precision highp float;
uniform sampler2D buffer;
uniform vec2 pixel;            // 1 / size of the buffer being read
uniform vec2 focal;            // tan(fov/2) * aspect, tan(fov/2)
uniform float reach;           // what depth 1.0 means, in world units
uniform float radius;          // how far around a point counts, in world units
uniform float strength;
varying vec2 vUv;
${OCT}

vec3 seenAt(vec2 uv, float depth) {
  return vec3((uv * 2.0 - 1.0) * focal, -1.0) * depth;
}

void main() {
  vec4 here = texture2D(buffer, vUv);
  float depth = unpackDepth(here.zw) * reach;
  // Nothing was drawn here. Depth 1.0 is the cleared background.
  if (unpackDepth(here.zw) >= 0.999) { gl_FragColor = vec4(1.0); return; }

  vec3 at = seenAt(vUv, depth);
  vec3 n = octDecode(here.xy);

  // How big the radius is on screen at this distance. A point twice as far
  // away gets half the ring, which is what keeps the occlusion world-sized
  // rather than screen-sized.
  float span = radius / (depth * focal.y * 2.0);
  float turn = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 6.2831853;

  float sum = 0.0;
  const int TAPS = 12;
  for (int i = 0; i < TAPS; i++) {
    float t = (float(i) + 0.5) / float(TAPS);
    float angle = turn + t * 6.2831853 * 3.0;         // a spiral, not a circle
    vec2 offset = vec2(cos(angle), sin(angle)) * span * t;
    vec2 uv = vUv + offset;
    if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) continue;
    vec4 other = texture2D(buffer, uv);
    float otherDepth = unpackDepth(other.zw);
    if (otherDepth >= 0.999) continue;
    vec3 to = seenAt(uv, otherDepth * reach) - at;
    float far2 = dot(to, to);
    // The bias keeps a flat surface from occluding itself through the
    // quantisation in the depth buffer.
    sum += max(0.0, dot(to, n) - depth * 0.0015) / (far2 + 0.0001);
  }

  // Contrast on the way out. The estimator is linear in how much geometry is
  // in the way, and a linear ramp reads as haze; what a person recognises as
  // a corner is the last quarter of it going dark quickly.
  float ao = max(0.0, 1.0 - strength * radius * sum / float(TAPS));
  gl_FragColor = vec4(vec3(pow(ao, 1.5)), 1.0);
}`;

const INK_FRAGMENT = `
precision highp float;
uniform sampler2D ao;
uniform sampler2D buffer;
uniform vec2 pixel;            // 1 / size of the full-resolution buffer
uniform vec2 aoPixel;          // 1 / size of the occlusion buffer
uniform float reach;
uniform float crease;          // cos of the angle that counts as sharp
uniform float ink;             // how black the line is
uniform float thickness;
varying vec2 vUv;
${OCT}

void main() {
  // The occlusion, blurred. Three by three of a half-resolution buffer is a
  // six pixel blur on screen, which is enough for a twelve-tap estimator.
  float shade = 0.0;
  for (int x = -1; x <= 1; x++)
    for (int y = -1; y <= 1; y++)
      shade += texture2D(ao, vUv + vec2(float(x), float(y)) * aoPixel).r;
  shade /= 9.0;

  vec4 here = texture2D(buffer, vUv);
  float depth = unpackDepth(here.zw);
  vec3 n = octDecode(here.xy);

  float line = 0.0;
  if (depth < 0.999) {
    vec2 step = pixel * thickness;
    // Eight ways round, not four. A ridge that runs diagonally across the
    // pixel grid is missed by half its neighbours by the four-way test, and
    // what that looks like is a dashed line.
    for (int i = 0; i < 8; i++) {
      float turn = float(i) * 0.78539816;              // 45 degrees each
      vec2 way = vec2(cos(turn), sin(turn));
      vec4 other = texture2D(buffer, vUv + way * step);
      float otherDepth = unpackDepth(other.zw);
      // A silhouette: the neighbour is a long way behind this surface. The
      // allowance grows with distance because the depth buffer's own step
      // does, and a hard number would draw lines all over a distant floor.
      if (otherDepth >= 0.999 || otherDepth - depth > 0.004 + depth * 0.02) { line = 1.0; break; }
      // A crease: the neighbour faces somewhere else entirely. A curved face
      // turns by a degree or two a pixel and never trips this; the corner of
      // a box turns by ninety.
      if (dot(n, octDecode(other.xy)) < crease) { line = 1.0; break; }
    }
  }

  float dark = shade * (1.0 - line * ink);
  gl_FragColor = vec4(vec3(dark), 1.0);
}`;

//! The arctic renderer. Given a scene and a camera it draws them - the caller
//! sets the materials, this decides what is dark.
export class Arctic {
  constructor(THREE, renderer) {
    this.THREE = THREE;
    this.renderer = renderer;
    this.width = 0;
    this.height = 0;
    this.radius = 0;
    this.reach = 0;

    this.buffer = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat, type: THREE.UnsignedByteType, depthBuffer: true,
    });
    this.occlusion = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat, type: THREE.UnsignedByteType, depthBuffer: false,
    });

    this.depthMaterial = new THREE.ShaderMaterial({
      vertexShader: BUFFER_VERTEX, fragmentShader: BUFFER_FRAGMENT,
      uniforms: { reach: { value: 1 } }, side: THREE.DoubleSide,
    });

    this.aoMaterial = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERTEX, fragmentShader: AO_FRAGMENT,
      uniforms: {
        buffer: { value: this.buffer.texture },
        pixel: { value: new THREE.Vector2() },
        focal: { value: new THREE.Vector2() },
        reach: { value: 1 }, radius: { value: 1 }, strength: { value: 2.6 },
      },
      depthTest: false, depthWrite: false,
    });

    this.inkMaterial = new THREE.ShaderMaterial({
      vertexShader: QUAD_VERTEX, fragmentShader: INK_FRAGMENT,
      uniforms: {
        ao: { value: this.occlusion.texture },
        buffer: { value: this.buffer.texture },
        pixel: { value: new THREE.Vector2() },
        aoPixel: { value: new THREE.Vector2() },
        reach: { value: 1 },
        crease: { value: Math.cos(32 * Math.PI / 180) },
        ink: { value: 0.92 },
        thickness: { value: 1.25 },
      },
      // Multiplied over the clay: this pass carries how DARK each pixel is and
      // nothing else, so it works over any background without knowing it.
      blending: THREE.MultiplyBlending, transparent: true,
      depthTest: false, depthWrite: false,
    });

    // One triangle in clip space for every full-screen pass.
    const quad = new THREE.BufferGeometry();
    quad.setAttribute("position", new THREE.Float32BufferAttribute(
      [-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    quad.setAttribute("uv", new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
    this.quad = quad;
    this.screen = new THREE.Scene();
    this.screenCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.blit = new THREE.Mesh(quad, this.aoMaterial);
    this.blit.frustumCulled = false;
    this.screen.add(this.blit);
  }

  setSize(width, height) {
    if (width === this.width && height === this.height) return;
    this.width = width;
    this.height = height;
    this.buffer.setSize(width, height);
    this.occlusion.setSize(Math.max(1, Math.round(width / 2)),
                           Math.max(1, Math.round(height / 2)));
    this.aoMaterial.uniforms.pixel.value.set(1 / width, 1 / height);
    this.inkMaterial.uniforms.pixel.value.set(1 / width, 1 / height);
    this.inkMaterial.uniforms.aoPixel.value.set(2 / width, 2 / height);
  }

  //! How far the occlusion reaches, in the model's own units, and how far away
  //! the far end of the depth buffer is. Both are set by the caller because
  //! only the caller knows how big the thing on screen is: a 2 m radius is
  //! right for a building and absurd for a bracket.
  setScale({ radius, reach }) {
    this.radius = radius;
    this.reach = reach;
  }

  //! Draws \p scene with \p camera. The caller has already put the clay
  //! materials on; this adds the shading and the ink.
  render(scene, camera) {
    const { renderer } = this;
    const size = renderer.getDrawingBufferSize(new this.THREE.Vector2());
    this.setSize(size.x, size.y);

    const reach = this.reach || camera.far;
    const radius = this.radius || reach * 0.02;
    const tan = Math.tan((camera.fov * Math.PI / 180) / 2);

    this.depthMaterial.uniforms.reach.value = reach;
    for (const material of [this.aoMaterial, this.inkMaterial])
      material.uniforms.reach.value = reach;
    this.aoMaterial.uniforms.radius.value = radius;
    this.aoMaterial.uniforms.focal.value.set(tan * camera.aspect, tan);

    const wasTarget = renderer.getRenderTarget();
    const wasOverride = scene.overrideMaterial;
    const wasAutoClear = renderer.autoClear;
    const wasClear = renderer.getClearColor(new this.THREE.Color());
    const wasAlpha = renderer.getClearAlpha();

    // 1. normals and depth. White means depth 1.0, which is "nothing here".
    scene.overrideMaterial = this.depthMaterial;
    renderer.setRenderTarget(this.buffer);
    renderer.setClearColor(0xffffff, 1);
    renderer.autoClear = true;
    renderer.render(scene, camera);
    scene.overrideMaterial = wasOverride;

    // 2. the occlusion from them.
    this.blit.material = this.aoMaterial;
    renderer.setRenderTarget(this.occlusion);
    renderer.render(this.screen, this.screenCamera);

    // 3. the model in clay.
    renderer.setRenderTarget(wasTarget);
    renderer.setClearColor(wasClear, wasAlpha);
    renderer.render(scene, camera);

    // 4. the shading and the ink, multiplied over it. autoClear OFF, and that
    // is the whole of it: a full-screen pass that clears first is a full-screen
    // pass multiplied over nothing, which is black - and over a canvas with an
    // alpha channel, invisible.
    renderer.autoClear = false;
    this.blit.material = this.inkMaterial;
    renderer.render(this.screen, this.screenCamera);

    renderer.autoClear = wasAutoClear;
  }

  dispose() {
    this.buffer.dispose();
    this.occlusion.dispose();
    this.quad.dispose();
    for (const material of [this.depthMaterial, this.aoMaterial, this.inkMaterial])
      material.dispose();
  }
}

//! The sky a rendered view is lit by, made rather than fetched: a page that
//! may not load an HDR file can still have a horizon, and this is what makes
//! chrome look like chrome instead of grey plastic. A vertical gradient with a
//! bright band where the sky meets the ground, run through the same
//! prefiltering any image-based light gets.
export function makeSky(THREE, renderer, { top = "#f3f7fb", horizon = "#ffffff",
                                           ground = "#7d838a" } = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 128;
  const paint = canvas.getContext("2d");
  const sky = paint.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, top);
  sky.addColorStop(0.46, horizon);
  sky.addColorStop(0.54, ground);
  sky.addColorStop(1, ground);
  paint.fillStyle = sky;
  paint.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  const prefilter = new THREE.PMREMGenerator(renderer);
  prefilter.compileEquirectangularShader();
  const map = prefilter.fromEquirectangular(texture).texture;
  prefilter.dispose();
  texture.dispose();
  return map;
}
