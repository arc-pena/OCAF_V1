# Vendored

## The rendering engine — three.js 0.166.1, three-mesh-bvh 0.7.8, three-gpu-pathtracer 0.0.23, all MIT

`pathtracer.bundle.js` is those three packages bundled into one classic script
that hangs its exports off `window.PT`. Remake it with

```sh
node scripts/build_pathtracer.mjs      # pins the versions, prints what it made
```

**Why bundled rather than imported.** All three are ES modules that import each
other by bare name, and neither of this project's two targets can resolve a bare
name: the single file concatenates its modules into one scope with the import
statements stripped, and the served site imports by relative path. One IIFE with
one global is the shape `payload.js` already carries PlayCanvas in, so nothing
above it had to change.

**Why committed rather than built on demand.** Making it needs npm *and* a
bundler to be reachable. The kernel is fetched at build time because it is one
`npm pack` and the file is used as it comes; this is two network services
agreeing to produce a byte-for-byte identical file, which is a build that fails
on a train. 863 kB, 227 kB packed.

**Why a second copy of three.** The modelling viewport is three r128 and the
path tracer needs r150 or later. They are two engines that never touch: the
kernel's triangles reach the renderer as plain arrays and the camera reaches it
as six numbers, in the kernel's own Z-up frame. Nothing of three's crosses
between them — a `Vector3` from the page is not the renderer's `Vector3`.

**Measured, not assumed.** Under this container's software renderer
(SwiftShader) a sample of a 320×240 frame takes about 1.6 s, which is about
20 µs per pixel per sample. That number says what the engine does here and
nothing at all about what it does on a GPU; it is recorded because every drive
in this repository has to size its test window against it, not as a performance
claim.

## rhino3dm 8.35.0 — MIT

McNeel's own library for reading a Rhino `.3dm`, from the npm package
`rhino3dm@8.35.0`. `rhino3dm.module.min.js` and `rhino3dm.wasm` are taken from
it unchanged; `rhino3dm.README.md` is the package's own.

**Served, not packed into the Artifact.** It is 1.01 MB gzipped and the
single-file build had 1.11 MB of its 16 MB limit left when this was added — it
would fit, with 0.6 % to spare, which is not a margin. So the Rhino package
loads it from beside the page: a `.3dm` opens on the served site, and in the
single file the reader says why not and points at the bridge script. See
`docs/src/rhino-plugin.js`.

**What it can and cannot do**, enumerated against this exact version rather
than remembered, and confirmed on a round-tripped file:

- there is no `Mesh.createFromBrep`; the library carries the file format and
  none of Rhino's kernel
- `BrepFace.getMesh(MeshType.Render)` answers with a mesh only when the file
  already held one — for a Brep written without one it is `null`, for Render,
  Any and Preview alike

So a `.3dm` read here draws exactly what Rhino cached in it. Anything else has
to come through `scripts/rhino_export.py`, which runs inside Rhino where the
kernel is.
