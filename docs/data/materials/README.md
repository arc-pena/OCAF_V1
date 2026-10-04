# Materials

Two libraries, because they answer two different questions.

## `architectural.json` — 72 surfaces as numbers

Concrete, masonry, stone, timber, metals, glass, paint, floors, fabric and
roofing, as PBR parameters. Twelve kilobytes, so it rides in **both** builds.

The file states the provenance of each quantity and the tests enforce the part
that can be enforced — that for a dielectric the colour's luminance is the
reflectance the same row claims. See `docs/test/catalogue.test.mjs`.

## `textured.json` and the folders beside it — 6 materials as images

Real PBR maps: colour, roughness, the OpenGL normal, and metalness where there
is one. **CC0 from [ambientCG](https://ambientcg.com)**, fetched by
`scripts/fetch_materials.mjs`.

| Folder | What it is | Maps |
|---|---|---|
| `Concrete034` | Concrete, fair-faced | colour, roughness, normal |
| `Bricks105` | Brick | colour, roughness, normal |
| `WoodFloor043` | Wood floor | colour, roughness, normal, metalness |
| `Metal049A` | Brushed metal | colour, roughness, normal, metalness |
| `PaintedPlaster017` | Painted plaster | colour, roughness, normal |
| `Tiles139` | Tile | colour, roughness, normal |

**Only the maps the renderer reads.** A 1K-JPG set off ambientCG is three to
eight megabytes and most of that is a Blender file, a USD stage, a 16-bit
displacement and a second normal map in the DirectX convention. The three or
four that are used come to about 1.5 MB, which is the difference between six
materials here and one.

**Served, not packed.** Nine megabytes cannot go in a 16 MB single file that is
already at 14.7, so the Artifact offers the parametric library and says why the
textured one is not there.

## Bringing your own

Drop a zip — or a folder's worth of images — on the window. `docs/src/texture.js`
reads the envelope and works out what each file is for, in the dialect of every
library anybody downloads from: ambientCG's `_Color.jpg`, Poly Haven's
`_diff_1k.jpg`, Substance's `basecolor`, Quixel's, or a folder with `rough.png`
in it. It installs one `Texture` node per map and one `Material` wired to them,
so the maps end up on ordinary wires in the node graph — unwire the roughness
and put a `Checker` there instead.

The bytes go **in the document**, like every other blob here: a model file that
needs a folder of JPEGs beside it opens grey on somebody else's machine. A 1K
set is about 1.3 MB; the page says how much it added, and says so loudly past
8 MB.
