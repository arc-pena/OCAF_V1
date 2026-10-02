"""Build dist/rmuh-diagram-flow.html (one page) + dist/img/ (the option images it reads).
Script order matters: the shared diagram helpers first, then data, engine, writers, app."""
from pathlib import Path
import shutil
root = Path(__file__).parent; src = root / 'src'
scripts = [root.parent / 'ux' / 'src' / 'diagrams.js'] + [src / n for n in ['xl-data.js', 'data.js', 'engine.js', 'pdf.js', 'xlsx.js', 'app.js']]
page = (src / 'index.html').read_text()
for marker, body in [('/*STYLES*/', (src / 'flow.css').read_text()), ('/*SCRIPTS*/', '\n'.join(p.read_text() for p in scripts))]:
    assert page.count(marker) == 1, marker
    page = page.replace(marker, body)
dist = root / 'dist'; (dist / 'img').mkdir(parents=True, exist_ok=True)
(dist / 'rmuh-diagram-flow.html').write_text(page)
for f in (root / 'img-src' / 'img').glob('*.jpg'): shutil.copy(f, dist / 'img' / f.name)
shutil.copy(root.parent.parent / 'out' / 'RMUH_v1_preview.png', dist / 'img' / 'RMUH_v1_preview.png')
print('page', len(page) // 1024, 'KB ·', len(list((dist / 'img').iterdir())), 'images')
