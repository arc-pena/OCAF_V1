# Morphit narratives

Scroll-driven pages whose 3D background is a parametric model rebuilt live in
the browser by Morphit's kernel. No modelling interface is on screen.

- `kernel/`: the kernel, copied byte for byte out of the Morphit single-file
  build (`replicad_single.wasm.gz`, `kernel-worker.js.gz`) and `kernel.js`, its
  headless page side. `probe-hac*.html` are the headless probes used to measure
  the model before the story was written.
- `hac-narrative/`: **Spec to data hall**, the investor demo. How the OCP Open
  Rack V3 base frame specification became data in Morphit's standards table,
  and how that drives a 33.6 m ribbon of floor-supported hot aisle
  containment (358 features). Includes live controls that rebuild the hall.

Serve the folder (`python3 -m http.server 8765` from `web/`) and open
`http://localhost:8765/hac-narrative/`.

`hac_ribbon.json` is the "Data hall ribbon" sample with the two entourage
figures and their clash node removed, and a new `N_UPITCH` parameter replacing
five hard-coded 44.45 mm unit pitches so the rack standard can change the hall.
