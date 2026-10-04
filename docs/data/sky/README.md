# Example skies

Equirectangular HDR, 1k, fetched by `scripts/fetch_skies.mjs` from
[Poly Haven](https://polyhaven.com). **CC0** — their licence page states it
plainly: "You can use our assets for any purpose, including commercial work.
You do not need to give credit or attribution." Credited below anyway.

**Served, not packed.** Together they are about 6 MB, and the single-file build had
1.4 MB of its 16 MB limit left when these were added. So the Skylight node
offers them on the served site and falls back to the renderer's own painted
domes in the Artifact, where fetching is not allowed at all.

| In the node | Poly Haven | By | Size |
|---|---|---|---|
| Photo studio | `studio_small_09` | Sergej Majboroda | 1.54 MB |
| Partly cloudy | `kloofendal_48d_partly_cloudy_puresky` | Greg Zaal, Jarod Guest | 1.37 MB |
| Clear sun | `syferfontein_18d_clear` | Greg Zaal | 1.43 MB |
| Low sun | `venice_sunset` | Greg Zaal | 1.37 MB |

**Photo studio** — Large softboxes on a white infinity cyc. The reference light for a product shot, and the one that flatters a detail model.

**Partly cloudy** — A bright sky with soft-edged cloud. Shadows with an edge you can see but not a hard one - the condition most of a temperate year is.

**Clear sun** — A clear sky with the sun high. Hard shadows and a strong sky-blue fill in them, which is what makes a white wall read as two colours.

**Low sun** — A low warm sun over water. Long shadows and a raking light down a facade, which is the condition an elevation is usually drawn for.
