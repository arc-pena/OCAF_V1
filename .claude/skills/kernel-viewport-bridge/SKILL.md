---
name: kernel-viewport-bridge
description: How to put a B-Rep kernel on screen with Three.js - tessellation streams, one scene group per feature, incremental refresh driven by revision counters, materials and render styles, raycast picking, section planes with stencil capping, and the sidedness rules that decide whether a surface is visible at all. Use this whenever you are drawing kernel geometry in Three.js or any scene graph, whenever a surface renders dark or invisible or faceted, whenever redraw is too slow, whenever you are adding a render style or a clipping plane, and when designing the viewport layer of a CAD or simulation front end.
---

# Kernel to viewport

The viewport owns no geometry. The kernel holds the document and the B-Rep; the
page mirrors the tree and draws the triangles it is handed. Everything below
follows from taking that seriously.

Reference: `docs/src/app.js` (viewport, picking, styles) and
`docs/src/styles.js` (post-processing) in this repository.

## The stream, and one group per feature

A kernel hands back, per feature, a flat stream:

```js
{ id, revision, positions: Float32Array, normals, index, edges: [...] }
```

which becomes one `THREE.Group` per feature holding a `Mesh` for the surfaces,
`LineSegments` for the edges and `Points` for vertices. Keep a cache:

```js
const shapes = new Map();   // feature id -> { revision, group }
const pickable = [];        // the meshes a raycast may hit
```

Three things earn their place here:

- **The group is the unit of everything.** Hide, select, clip, dispose and
  restyle all operate on the group, so none of them has to know what is inside.
- **Edges come from the kernel, not from `EdgesGeometry`.** A B-Rep knows its
  real edges; deriving them from the mesh gives you tessellation artefacts and
  loses the tangent/sharp distinction.
- **If the stream arrives without normals, `computeVertexNormals()`** — the
  arctic style reads its creases off normals and silently draws none otherwise.

## Refresh by revision, not by rebuilding the scene

This is the only reason the revision counter on a feature exists:

```js
for (const entry of tree.features) {
  const have = shapes.get(entry.id);
  if (entry.built && (!have || have.revision !== entry.revision)) stale.push(entry.id);
}
// ask the kernel for exactly those meshes
```

Dragging a slider on one feature in a document of two hundred re-tessellates
the handful that actually changed. Without it, every frame of a drag is a full
scene rebuild and the application feels like a batch process.

Always dispose what you replace — geometries and materials both — or a long
editing session leaks the GPU dry:

```js
group.traverse(o => {
  if (o.geometry) o.geometry.dispose();
  if (o.material) [].concat(o.material).forEach(m => m.dispose());
});
```

## Draw every surface from both sides

WebGL discards the back of a face by default. That is right for a closed solid
and **wrong for everything else a CAD kernel makes**: a filled surface, a swept
skin, a drafted face and a loft are all sheets, and which side is the front is
whatever the kernel decided when it built it. Half come out facing away, and a
face facing away is not drawn dark — it is not drawn at all, and you look
straight through a surface that is there.

Two halves to the fix, and the second is easy to miss:

```js
const TURN_BACK_FACES = shader => {
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <normal_fragment_begin>",
    "#include <normal_fragment_begin>\n\tnormal = gl_FrontFacing ? normal : -normal;");
};
const bothSides = material => {
  material.side = THREE.DoubleSide;
  material.onBeforeCompile = TURN_BACK_FACES;   // lights the far side
  return material;
};
```

Without the shader patch the back face draws but is lit by a normal pointing
away from every light, so it comes back ambient-only — a flat near-black patch
that reads as broken. **Check whether your Three.js revision flips it for you**
rather than assuming: r128 does not, measured as `178,244,255` lit versus
`14,20,28` from behind.

Route every surface material through `bothSides()` rather than setting `side`
at each construction site. The bug this fixes was one branch of three that
forgot the flag.

The one legitimate exception is stencil counting for section caps, below.

## Styles change where the numbers come from, not what is drawn

Three styles over one material path:

| style | colour source | lighting |
|---|---|---|
| shaded | one neutral grey | key 0.78 / fill 0.32 / ambient 0.55 |
| rendered | the object's own material + env map | 0.55 / 0.22 / 0.32 |
| arctic | one white clay for everything | 0.10 / 0.06 / 0.98 — nearly all ambient |

> Arctic is nearly all ambient on purpose: the only thing that may darken a
> white model is its own shape, and a key light across it would be telling you
> about the light instead.

Arctic gets its form from a post pass rather than from lighting: render normals
and depth into a buffer (octahedral-encoded normal in `rg`, packed depth in
`ba`), compute ambient occlusion from that buffer, then an ink pass that draws
a line where depth or normal jumps. The buffer shader must flip the normal for
back faces too — same rule as above:

```glsl
vec3 n = normalize(vNormal);
// Both sides of a surface face the camera as far as this is concerned: a
// single-sided sheet seen from behind is still a surface with an edge.
if (!gl_FrontFacing) n = -n;
```

## Picking: raycast for bodies, anchors for sub-shapes

Body picking is an ordinary raycast against `pickable`, filtered to visible
parents. Sub-shape picking (a face, an edge, a vertex to fillet or constrain)
needs more, because **an index into a tessellation is not a stable name** — it
changes the moment anything upstream is edited.

Store an **anchor**: a geometric fingerprint that can be matched again after a
rebuild — for an edge, its midpoint and length; for a face, a point on it and
its normal; for a vertex, its position. On reload, resolve anchors to current
sub-shapes by nearest match within a tolerance, and report the ones that no
longer resolve:

```
"none of the corners picked are on this curve any more"
"3 picked edges lost"
```

Saying a pick was lost is far better than silently filleting a different edge.
See `direct-manipulation-widgets` for the interaction side of this.

## Section planes: clip, then cap with a stencil

`THREE.Plane` clipping leaves a solid looking hollow. To cap it you count
front and back faces into the stencil buffer and draw a lid where the count is
non-zero:

```js
const backs = base.clone();
backs.side = THREE.BackSide;
backs.stencilZPass = THREE.IncrementWrapStencilOp;
const fronts = base.clone();
fronts.side = THREE.FrontSide;
fronts.stencilZPass = THREE.DecrementWrapStencilOp;
```

**This is the one place sidedness must stay single.** It is about sidedness
itself.

Two traps, both found the hard way:

- **Do not wrap the pair in a `Group`.** A Group's own `renderOrder` becomes
  the group order of everything under it, and the sort is by group order
  *first* — so two counting copies inside a `renderOrder: 0` group render
  before every lid whatever their own order says. Every object's count went
  into the stencil, the first lid drew over all of them, and the rest were
  rejected as coplanar. Return the pair, not a group.
- **Clipping planes are per-material.** Keep the plane objects alive between
  frames and move their constant, so dragging the section is a uniform update
  rather than a world rebuild.

## The camera, and cameras as features

Keep the camera as `{ target, distance, yaw, pitch, fov }` and derive the
position, rather than storing a position and reverse-engineering the rest:

```js
camera.position.set(
  target.x + distance * cos(pitch) * cos(yaw),
  target.y + distance * cos(pitch) * sin(yaw),
  target.z + distance * sin(pitch));
camera.up.set(0, 0, 1);
camera.lookAt(target);
```

Near and far planes must **follow** the camera. A fixed far plane means a
30 m building simply vanishes when you pull back far enough to see it, which
looks exactly like "fit does not fit":

```js
const span = Math.max(view.span, 1);
camera.near = Math.max(0.05, Math.min(view.distance * 0.02, span * 0.02));
```

If cameras are also document features, the frustum arithmetic is shared between
the viewport and the camera driver — put it in one module both import
(`camera.js`) so a camera's drawn frustum and what you see looking through it
cannot disagree.

## Drive it in a real browser

Rendering is the domain where unit tests prove least. Keep Playwright harnesses
and treat screenshots as authoritative — `readPixels` after present reads a
cleared buffer and proves nothing. Drive the app's real gestures, not internal
state: setting `view.pitch` directly changed nothing here because nothing asked
for a redraw, and two "different" screenshots came back byte-identical. See
`measured-truth`.
