"""Inline src/ into one self-contained page: dist/diagramlab-ux.html.
The artifact host serves a single file, so styles and scripts are concatenated, never fetched."""
from pathlib import Path
src = Path(__file__).parent / 'src'
page = (src / 'index.html').read_text()
app = '\n'.join((src / f).read_text() for f in ['app-core.js', 'app-board.js', 'app-editor.js', 'app-present.js', 'app-system.js'])
for marker, body in [('/*STYLES*/', (src / 'styles.css').read_text()), ('/*DIAGRAMS*/', (src / 'diagrams.js').read_text()), ('/*APP*/', app)]:
    assert page.count(marker) == 1, marker
    page = page.replace(marker, body)
out = Path(__file__).parent / 'dist' / 'diagramlab-ux.html'
out.parent.mkdir(exist_ok=True)
out.write_text(page)
print(out, len(page) // 1024, 'KB')
