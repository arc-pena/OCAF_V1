# Vendored

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
