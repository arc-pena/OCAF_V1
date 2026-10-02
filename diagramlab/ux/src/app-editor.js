/* DiagramLab prototype — Editor.
   The layer list is not a hand-written fixture: it is read back from the rendered diagram's <g data-k>
   groups, so the tree always matches what is on the page, and every layer is addressed by its stable key. */

const LAYER_NODE = { base: 'Ghost Massing', circulation: 'Route / Spline', labels: 'Labels & Legend', views: 'Arrows and Flows', landscape: 'Arrows and Flows', program: 'Zones / Poché', analysis: 'Prompt-to-Vector', levels: 'Symbols', site: 'Zones / Poché', symbols: 'Symbols', roof: 'Zones / Poché', structure: 'Prompt-to-Vector', section: 'Extract PDF Vectors', massing: 'Zones / Poché', axo: 'Zones / Poché', phasing: 'Zones / Poché', highlight: 'Highlight overlay', inset: 'Inset panel', frame: 'Sheet template' };
function layerMeta(k, cellKey) {
  const seg = k.split('/')[0];
  const kind = k === 'frame/title' ? 'text' : seg === 'base' || k === 'base/soft-shadow' ? 'raster' : seg === 'labels' || /tags|list/.test(k) ? 'text' : 'vector';
  const ed = CELLS[cellKey].edited && k === 'circulation/external-route';
  const prov = seg === 'frame' ? 'profile' : (S.ed.manual || new Set()).has(k) ? 'manual' : ed ? 'edited' : 'gen';
  return { kind, prov, node: LAYER_NODE[seg] || 'Prompt-to-Vector' };
}
function openEditor(k) { S.ed.k = k; S.ed.layer = k.startsWith('circ:') ? 'circulation/external-route' : null; S.ed.zoom = 0; S.ed.pan = [0, 0]; S.ed.pending = null; setMode('editor'); }

function renderEditor() {
  const v = $('#v-editor'), k = S.ed.k, [t, o] = parseKey(k), c = CELLS[k];
  v.innerHTML = `<div class="ed-canvas" id="edCanvas"><div class="ed-sheet" id="edSheet"></div></div>
    <aside class="panel ed-layers" id="edLayers" aria-label="Layers"><div class="tabs" role="tablist"><button role="tab" aria-selected="true">${ic('layers')}Layers</button><button role="tab" aria-selected="false" id="edAnchTab">${ic('anchor')}Anchors</button></div><div class="panel-b" id="edTree" style="padding:6px"></div>
      <div style="padding:8px 12px;border-top:1px solid var(--line);display:flex;gap:6px;flex-wrap:wrap" class="faint"><span class="prov gen">GEN</span><span class="prov edited">EDITED</span><span class="prov manual">MANUAL</span><span class="prov profile">PROFILE</span></div></aside>
    <div class="panel ed-rail" role="toolbar" aria-label="Tools">${[['select', 'Selection (V)'], ['direct', 'Direct selection (A)'], ['pen', 'Pen (P)'], ['pencil', 'Pencil (N)'], ['rect', 'Rectangle (M)'], ['ellipse', 'Ellipse (L)'], ['text', 'Type (T)'], ['hand', 'Hand (H)']].map(x => `<button class="ib" data-tool="${x[0]}" aria-pressed="${S.ed.tool === x[0]}" title="${x[1]}">${ic(x[0])}</button>`).join('')}</div>
    <div class="panel ed-crumb"><button class="btn ghost sm" id="edTpl">${t.n} ${t.en} ${ic('chevd')}</button>
      <span style="display:flex;gap:2px">${OPTIONS.map(x => `<button class="btn ${x.id === o.id ? '' : 'ghost'} sm" data-opt="${x.id}" title="Option ${x.id}: ${x.name}">${optTag(x.id, false)}</button>`).join('')}</span>
      <span style="width:1px;height:18px;background:var(--line)"></span>
      <div class="seg sm" id="edScope"><button aria-pressed="${S.ed.scope === 'instance'}" data-s="instance">This option</button><button aria-pressed="${S.ed.scope === 'template'}" data-s="template">Template · all 4</button></div>
      ${pill(c.status)}</div>
    <div class="panel ed-zoom"><button class="ib sm" id="edOut" aria-label="Zoom out">${ic('minus')}</button><button class="btn ghost sm mono" id="edPct" title="Click for 100% print size"></button><button class="ib sm" id="edIn" aria-label="Zoom in">${ic('plus')}</button><button class="ib sm" id="edFit" aria-label="Fit">${ic('fit')}</button></div>
    <aside class="panel ed-insp" id="edInsp" aria-label="Inspector"></aside>
    <div id="edDiff"></div>`;
  drawSheet(); fitSheet(); renderTree(); renderEdInsp(); renderDiff();
  $$('.ed-rail .ib').forEach(b => b.onclick = () => setTool(b.dataset.tool));
  $$('[data-opt]', v).forEach(b => b.onclick = () => openEditor(t.id + ':' + b.dataset.opt));
  $$('#edScope button').forEach(b => b.onclick = () => { S.ed.scope = b.dataset.s; $$('#edScope button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); updateScope(); renderEdInsp(); });
  $('#edTpl').onclick = e => openPop(e.currentTarget, `<div class="menu" style="max-height:60vh;overflow:auto">${TEMPLATES.map(x => `<button data-t="${x.id}"><span class="mono faint">${x.n}</span>${x.en}<span class="hint zh">${x.zh}</span></button>`).join('')}</div>`, el => $$('button', el).forEach(b => b.onclick = () => { closePop(); openEditor(b.dataset.t + ':' + o.id); }));
  $('#edIn').onclick = () => zoomSheet(1.25); $('#edOut').onclick = () => zoomSheet(.8); $('#edFit').onclick = () => { S.ed.zoom = 0; S.ed.pan = [0, 0]; fitSheet(); };
  $('#edPct').onclick = () => { const mm = 96 / 25.4; S.ed.zoom = S.ed.zoom === mm ? 0 : mm; S.ed.pan = [0, 0]; fitSheet(); toast(S.ed.zoom ? '100% print size: 1 mm on paper = 1 mm on screen. Check line weights and type here.' : 'Fit to window'); };
  $('#edAnchTab').onclick = () => toast('Anchors: plaza-entrance, ramp, roof-garden. Templates refer to them by name, so one recipe works on every option.');
  const cv = $('#edCanvas');
  cv.addEventListener('wheel', e => { e.preventDefault(); if (e.ctrlKey || e.metaKey) zoomSheet(Math.exp(-e.deltaY * .01)); else { S.ed.pan[0] -= e.deltaX; S.ed.pan[1] -= e.deltaY; placeSheet(); } }, { passive: false });
  let pan = null;
  cv.addEventListener('pointerdown', e => {
    if (e.target.closest('.handle')) return;
    const g = e.target.closest('#edSheet [data-k]');
    if (S.ed.tool === 'hand' || e.button === 1 || !g) { if (!g && S.ed.tool !== 'hand') { S.ed.layer = null; renderTree(); renderEdInsp(); drawOverlay(); updateScope(); } pan = { sx: e.clientX, sy: e.clientY, p: S.ed.pan.slice() }; cv.setPointerCapture(e.pointerId); return; }
    let deepest = g; S.ed.layer = deepest.dataset.k; renderTree(); renderEdInsp(); drawOverlay(); updateScope();
  });
  cv.addEventListener('pointermove', e => { if (!pan) return; S.ed.pan = [pan.p[0] + e.clientX - pan.sx, pan.p[1] + e.clientY - pan.sy]; placeSheet(); });
  cv.addEventListener('pointerup', () => pan = null);
}
function setTool(t) { S.ed.tool = t; $$('.ed-rail .ib').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tool === t))); if (t === 'pen' || t === 'pencil' || t === 'rect' || t === 'ellipse' || t === 'text') toast(`${t[0].toUpperCase() + t.slice(1)} tool: drawn content becomes a manual layer, equal to generated ones.`); }

function drawSheet() {
  const k = S.ed.k, [t, o] = parseKey(k);
  let svg = diagram(t, o, Object.assign({ editor: true }, ctxFor(k)));
  (S.hidden[k] || []).forEach(L => { svg = svg.replace(`<g data-k="${L}" >`, `<g data-k="${L}" display="none">`); });
  $('#edSheet').innerHTML = svg;
  if (S.ed.pending) $$(`#edSheet [data-k="${S.ed.pending.k}"]`).forEach(g => g.classList.add('pending'));
  drawOverlay();
}
function canvasBox() {
  const cv = $('#edCanvas'), W = cv.clientWidth, H = cv.clientHeight;
  const L = innerWidth > 760 ? (innerWidth > 980 ? 340 : 296) : 60, Rr = innerWidth > 760 ? (innerWidth > 1180 ? 320 : 284) : 12;
  return { x: L, y: 64, w: Math.max(200, W - L - Rr), h: Math.max(160, H - 64 - 96) };
}
function fitSheet() { const b = canvasBox(); if (!S.ed.zoom) S.ed.fitZ = Math.min(b.w / 420, b.h / 297); placeSheet(); }
function zoomSheet(k) { S.ed.zoom = Math.min(12, Math.max(.4, (S.ed.zoom || S.ed.fitZ) * k)); placeSheet(); }
function placeSheet() {
  const b = canvasBox(), z = S.ed.zoom || S.ed.fitZ, el = $('#edSheet'); if (!el) return;
  el.style.width = 420 * z + 'px'; el.style.height = 297 * z + 'px';
  el.style.left = (b.x + b.w / 2 - 210 * z + S.ed.pan[0]) + 'px'; el.style.top = (b.y + b.h / 2 - 148.5 * z + S.ed.pan[1]) + 'px';
  $('#edPct').textContent = Math.round(z / (96 / 25.4) * 100) + '%';
  drawOverlay();
}

/* Overlay: bounding box of the selected layer, and live Bézier anchors for routes. */
function drawOverlay() {
  const ov = $('#edOverlay'); if (!ov) return;
  const z = S.ed.zoom || S.ed.fitZ || 2, px = 1 / z, k = S.ed.k;
  let h = '';
  const L = S.ed.layer && $(`#edSheet .dg-content [data-k="${S.ed.layer}"]`);
  if (L && L.getAttribute('display') !== 'none') {
    try { const bb = L.getBBox(); if (bb.width) h += `<rect x="${bb.x - 3 * px}" y="${bb.y - 3 * px}" width="${bb.width + 6 * px}" height="${bb.height + 6 * px}" fill="none" stroke="var(--accent)" stroke-width="${px}" stroke-dasharray="${4 * px} ${3 * px}"/>`; } catch (e) {}
  }
  if (S.ed.layer === 'circulation/external-route' && k.startsWith('circ:')) {
    const pts = (S.routes[k] || parseKey(k)[1].route).map(p => PROJ.axo(p[0], p[1], 0));
    const n = pts.length;
    pts.forEach((p, i) => {
      const p0 = pts[Math.max(i - 1, 0)], p2 = pts[Math.min(i + 1, n - 1)], tx = (p2[0] - p0[0]) / 6, ty = (p2[1] - p0[1]) / 6;
      if (i > 0 && i < n - 1) h += `<line x1="${p[0] - tx}" y1="${p[1] - ty}" x2="${p[0] + tx}" y2="${p[1] + ty}" stroke="var(--accent)" stroke-width="${px}"/><circle cx="${p[0] - tx}" cy="${p[1] - ty}" r="${2.5 * px}" fill="var(--accent)"/><circle cx="${p[0] + tx}" cy="${p[1] + ty}" r="${2.5 * px}" fill="var(--accent)"/>`;
    });
    pts.forEach((p, i) => { h += `<rect class="handle" data-i="${i}" x="${p[0] - 4 * px}" y="${p[1] - 4 * px}" width="${8 * px}" height="${8 * px}" fill="#fff" stroke="var(--accent)" stroke-width="${1.5 * px}"><title>Anchor ${i + 1}: drag to edit. The edit is stored against circulation/external-route.</title></rect>`; });
  }
  ov.innerHTML = h;
  $$('.handle', ov).forEach(hd => hd.addEventListener('pointerdown', startHandleDrag));
}
function startHandleDrag(e) {
  e.preventDefault(); e.stopPropagation();
  const k = S.ed.k, i = +e.target.dataset.i, svg = $('#edSheet svg'), ov = $('#edOverlay');
  if (!S.routes[k]) S.routes[k] = parseKey(k)[1].route.map(p => p.slice());
  const before = S.routes[k].map(p => p.slice()), wasEdited = CELLS[k].edited;
  const move = ev => {
    const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    const q = pt.matrixTransform(ov.getScreenCTM().inverse());
    S.routes[k][i] = PROJ.axo.inv(q.x, q.y);
    $('#edSheet [data-k="circulation/external-route"]').innerHTML = drawRoute(PROJ.axo, S.routes[k], CELLS[k].routeW || TOK.routeW);
    drawOverlay();
  };
  const up = () => {
    removeEventListener('pointermove', move); removeEventListener('pointerup', up);
    CELLS[k].edited = true; bump(k); renderTree();
    pushHistory('Move anchor', () => { S.routes[k] = before; CELLS[k].edited = wasEdited; bump(k); drawSheet(); renderTree(); });
    if (!wasEdited) toast('Manual edit stored against <b>circulation/external-route</b>. It is re-applied when the node re-runs.', ['Undo', undo]);
  };
  addEventListener('pointermove', move); addEventListener('pointerup', up);
}

function renderTree() {
  const k = S.ed.k, groups = $$('#edSheet .dg-content > [data-k], #edSheet [data-k="frame/title"]').map(g => g.dataset.k);
  const keys = [...new Set(groups)].reverse();
  const bySeg = [];
  keys.forEach(x => { const s = x.split('/')[0]; let g = bySeg.find(q => q.s === s); if (!g) bySeg.push(g = { s, items: [] }); g.items.push(x); });
  const hid = S.hidden[k] || new Set();
  const row = (x, d) => {
    const m = layerMeta(x, k), off = hid.has(x), locked = x === 'frame/title';
    const kic = { raster: 'image', vector: 'vector', text: 'textl' }[m.kind];
    return `<div class="lyr ${S.ed.layer === x ? 'sel' : ''} ${off ? 'off' : ''} ${S.ed.pending && S.ed.pending.k === x ? 'new' : ''}" style="--d:${d}" data-k="${x}" title="${m.node}"><span></span><span class="k">${ic(kic)}</span><span class="nm mono">${x.split('/').slice(1).join('/') || x}</span><span class="prov ${m.prov}">${{ gen: 'GEN', edited: 'EDITED', manual: 'MANUAL', profile: 'PROFILE' }[m.prov]}</span><span style="display:flex">${locked ? `<span class="ib sm" title="Locked: comes from the sheet template">${ic('lock')}</span>` : `<button class="ib sm hide-ic ${off ? 'on' : ''}" data-eye="${x}" aria-label="${off ? 'Show' : 'Hide'} layer">${ic(off ? 'eyeoff' : 'eye')}</button>`}</span></div>`;
  };
  $('#edTree').innerHTML = bySeg.map(g => `<div class="lyr" style="--d:0"><span class="tw">${ic('chevd')}</span><span class="k">${ic('folder')}</span><span class="nm" style="font-weight:600">${g.s}</span><span class="faint num" style="font-size:11px">${g.items.length}</span><span></span></div>` + g.items.map(x => row(x, 1)).join('')).join('');
  $$('#edTree .lyr[data-k]').forEach(el => el.onclick = e => {
    if (e.target.closest('[data-eye]')) {
      const L = e.target.closest('[data-eye]').dataset.eye; const set = S.hidden[k] || (S.hidden[k] = new Set()); const c = CELLS[k];
      if (set.has(L)) { set.delete(L); c.ovr = c.ovr.filter(x => !(x.kind === 'hidden' && x.layer === L)); }
      else { set.add(L); c.ovr.push({ id: 'h' + Date.now(), what: 'Hidden layer · ' + L, val: 'hidden', tpl: 'visible', kind: 'hidden', layer: L }); toast(`Hiding <b>${L}</b> is stored as an override on Option ${k.split(':')[1]} only.`); }
      bump(k); drawSheet(); renderTree(); return;
    }
    S.ed.layer = el.dataset.k; renderTree(); renderEdInsp(); drawOverlay(); updateScope();
  });
}

function renderEdInsp() {
  const p = $('#edInsp'), k = S.ed.k, c = CELLS[k], [t, o] = parseKey(k), L = S.ed.layer;
  const tab = S.ed.tab, finds = findingsFor(k);
  const head = `<div class="tabs" role="tablist">${[['design', 'Design'], ['prov', 'Provenance'], ['std', 'Standards']].map(([id, l]) => `<button role="tab" data-tab="${id}" aria-selected="${tab === id}">${l}${id === 'std' && finds.length ? ` <span class="cnt">${finds.length}</span>` : ''}</button>`).join('')}</div>`;
  let body = '';
  if (!L) {
    body = `<div class="sec"><span class="eyebrow">Diagram</span><b>${t.en} × Option ${o.id}</b><span class="muted" style="font-size:12.5px">${esc(t.brief)}</span></div><div class="sec"><dl class="kv"><dt>Page</dt><dd>A3 landscape · 420 × 297 mm</dd><dt>Scale</dt><dd>1:1000 · 1 m = 1 mm</dd><dt>Profile</dt><dd>Office standard v3</dd><dt>Layers</dt><dd>${$$('#edSheet [data-k]').length}</dd></dl></div><div class="sec"><span class="faint" style="font-size:12px">Select a layer in the list or click it on the sheet.</span></div>`;
  } else if (tab === 'design') {
    const m = layerMeta(L, k), isRoute = L === 'circulation/external-route';
    const w = c.routeW || TOK.routeW;
    body = `<div class="sec"><div class="sec-h"><span class="mono" style="font-size:12px;overflow-wrap:anywhere">${L}</span><span class="prov ${m.prov}">${m.prov.toUpperCase()}</span></div>
      <div class="field"><label>Style token</label><select class="input"><option>${L.split('/')[0]}/${isRoute ? 'external' : L.split('/')[1] || 'default'}</option><option>emphasis/primary</option></select></div>
      ${m.kind === 'vector' ? `<div class="field"><label for="edW">Stroke${c.routeW && isRoute ? '<span class="ovr" title="Overridden on this option"></span>' : ''}</label>${unitField('edW', (isRoute ? w : 1.2) + ' pt', 'print')}</div>
      ${isRoute ? `<div class="field"><label>Dash</label><div class="seg sm"><button aria-pressed="true">Solid</button><button aria-pressed="false">Dashed</button></div></div>
      <div class="field"><label>Arrowhead</label><select class="input"><option>Triangle · 3.4×</option><option>Open chevron</option><option>None</option></select></div>
      <div class="field"><label for="edR">Corner radius<span class="ovr"></span></label>${unitField('edR', '6 m', 'model')}</div>
      <div class="field"><label>Z-order</label><div class="seg sm"><button aria-pressed="true">Under massing</button><button aria-pressed="false">Over</button></div></div>` : ''}` : ''}
      ${m.kind === 'raster' ? `<dl class="kv"><dt>Source</dt><dd>${o.id}_axo.png · 6000 × 4243</dd><dt>Effective</dt><dd>412 ppi at placed size</dd></dl><span class="pill ok">Above 300 ppi</span><div class="field"><label>Treatment</label><select class="input"><option>Ghost white</option><option>Desaturate + wash</option><option>Figure-ground</option></select></div>` : ''}
      ${m.kind === 'text' ? `<div class="field"><label>Fonts</label><span class="mono" style="font-size:11px">Geist + PingFang SC</span></div><div class="field"><label for="edT">Size</label>${unitField('edT', '6 pt', 'print')}</div><div class="field"><label>Languages</label><div class="seg sm"><button aria-pressed="true">Stacked</button><button aria-pressed="false">Inline</button><button aria-pressed="false">zh</button><button aria-pressed="false">en</button></div></div><div class="find"><span class="sev" style="background:var(--warn)"></span><span>2 translated strings are unreviewed.</span><button class="btn sm" data-ok>Review</button></div>` : ''}
      <div class="field"><label>Opacity</label><input type="range" class="slider" value="100" aria-label="Opacity"></div>
      <div class="field"><label>Blend</label><select class="input"><option>Normal</option><option>Multiply</option><option>Screen</option><option>Overlay</option><option>Darken</option><option>Lighten</option></select></div></div>
      ${S.ed.scope === 'template' ? `<div class="find" style="background:var(--accent-soft)"><span class="sev" style="background:var(--accent)"></span><span>Editing the <b>template</b>: changes apply to all 4 options. Cells with their own override keep it.</span><span></span></div>` : ''}
      <div class="sec"><span class="eyebrow">Layer actions</span><div style="display:grid;gap:6px">
        <button class="btn sm" data-act="regen">${ic('refresh')}Regenerate</button>
        <button class="btn sm" data-act="reprompt">${ic('sparkle')}Regenerate with new prompt</button>
        <button class="btn sm" data-act="agent">${ic('shield')}Ask agent to fix</button>
        <button class="btn sm" data-act="push" ${c.routeW && isRoute ? '' : 'disabled'}>${ic('push')}Push edit to template</button>
        <button class="btn sm" data-act="detach">${ic('detach')}Detach as manual layer</button></div></div>`;
  } else if (tab === 'prov') {
    const m = layerMeta(L, k), nodeId = L === 'circulation/external-route' ? 'n5' : null;
    body = `<div class="sec"><div class="prov-card"><span class="eyebrow">Prompt</span><span class="q">“${L === 'circulation/external-route' ? 'Show the public route from the river plaza to the roof garden, via the ramp. Thick red with an arrowhead.' : esc(t.brief)}”</span></div>
      <dl class="kv"><dt>Node</dt><dd>${m.node}</dd><dt>Model</dt><dd>config: reasoning.default</dd><dt>Geometry</dt><dd>${L === 'circulation/external-route' ? 'requestRoute(plaza-entrance → roof-garden, via ramp) · A* on walkable mask' : 'deterministic'}</dd><dt>Seed</dt><dd>${(k.length * 7919) % 10000}</dd><dt>Inputs</dt><dd>sha256:9f2c…a71e</dd><dt>Cost</dt><dd>$0.06 · 2.4 s</dd></dl>
      ${c.edited && L === 'circulation/external-route' ? `<div class="find"><span class="sev" style="background:var(--warn)"></span><span>1 manual edit on top of the generated path: anchor 4 moved. Re-applied after every re-run.</span><button class="btn sm" id="edReset">Reset</button></div>` : ''}</div>
      ${nodeId ? `<div class="sec"><span class="eyebrow">Producing node · same fields as on the board</span>${paramForm(NODE_TYPES.route, 'ep', NODE_VALS.n5)}<button class="btn sm" id="edOpenNode">${ic('node')}Open node on board</button></div>` : `<div class="sec"><button class="btn sm" id="edOpenNode">${ic('node')}Open producing node</button></div>`}`;
  } else {
    body = `<div class="sec"><div class="sec-h"><span class="eyebrow">Graphic Standards Agent</span><span class="chip">Suggest</span></div>${finds.length ? finds.map(findHtml).join('') + `<button class="btn sm" id="edFixAll">${ic('check')}Apply all suggestions</button>` : '<span class="faint" style="font-size:12px">This diagram passes every rule in Style Profile v3.</span>'}</div>
      <div class="sec"><span class="eyebrow">Lint · deterministic</span>${[['Palette', 'All colours on profile'], ['Strokes', 'On stroke scale'], ['Type', '1 label under 6 pt'], ['Margins', 'Inside 10 mm'], ['Raster', '412 ppi ≥ 300']].map((r, i) => `<div style="display:flex;justify-content:space-between;font-size:12px"><span>${r[0]}</span><span class="${i === 2 && finds.some(f => f.id === 'f1') ? '' : 'faint'}">${r[1]}</span></div>`).join('')}</div>
      <div class="sec"><span class="eyebrow">Critique · vision rubric</span>${[['Hierarchy', .86], ['Legibility', .78], ['Consistency with row', .92], ['Density', .7], ['Colour balance', .88]].map(r => `<div style="display:grid;grid-template-columns:1fr 80px 28px;gap:8px;align-items:center;font-size:12px"><span>${r[0]}</span><span style="height:4px;border-radius:4px;background:var(--line);overflow:hidden"><i style="display:block;height:100%;width:${r[1] * 100}%;background:var(--fg-2)"></i></span><span class="mono num">${Math.round(r[1] * 10)}/10</span></div>`).join('')}</div>`;
  }
  p.innerHTML = head + `<div class="panel-b">${body}</div>`;
  $$('[data-tab]', p).forEach(b => b.onclick = () => { S.ed.tab = b.dataset.tab; renderEdInsp(); });
  updateScope();
  wireUnit('edW', 'print', v => {
    const old = c.routeW;
    if (S.ed.scope === 'template') { const o2 = TOK.routeW; TOK.routeW = v; S.tokRev++; pushHistory('Template stroke', () => { TOK.routeW = o2; S.tokRev++; drawSheet(); }); toast(`Template stroke set to ${+v.toFixed(2)} pt: all 4 options updated.`); }
    else { c.routeW = v; bump(k); pushHistory('Stroke width', () => { c.routeW = old; bump(k); drawSheet(); renderEdInsp(); }); }
    drawSheet(); renderEdInsp();
  });
  wireUnit('edR', 'model', () => toast('Corner radius stored as an override on this option.'));
  wireUnit('edT', 'print', v => toast(v < 6 ? `${+v.toFixed(2)} pt is below the 6 pt minimum. The agent will flag it.` : 'Label size updated.'));
  $$('[data-act]', p).forEach(b => b.onclick = () => {
    const a = b.dataset.act;
    if (a === 'regen') { toast('Regenerating with the same prompt and a new seed. Your manual edits will be re-applied.'); }
    if (a === 'reprompt') { $('#promptIn').focus(); $('#promptIn').value = 'route it via the ramp instead'; }
    if (a === 'agent') { S.ed.tab = 'std'; renderEdInsp(); }
    if (a === 'push') { const v = c.routeW; TOK.routeW = v; delete c.routeW; S.tokRev++; drawSheet(); renderEdInsp(); toast(`Pushed ${+v.toFixed(2)} pt to the template: Options A–D now share it.`); }
    if (a === 'detach') { (S.ed.manual || (S.ed.manual = new Set())).add(L); renderTree(); renderEdInsp(); toast(`<b>${L}</b> is now manual: re-runs will no longer replace it.`); }
  });
  $$('[data-fix]', p).forEach(b => b.onclick = () => { S.ed.fixed.add(b.dataset.fix); renderEdInsp(); toast('Fix applied through applyOps. Undo is available.', ['Undo', () => { S.ed.fixed.delete(b.dataset.fix); renderEdInsp(); }]); });
  if ($('#edFixAll')) $('#edFixAll').onclick = () => { finds.forEach(f => f.fix && S.ed.fixed.add(f.id)); renderEdInsp(); toast(`${finds.filter(f => f.fix).length} fixes applied. Locked and manual layers were not touched.`); };
  if ($('#edReset')) $('#edReset').onclick = () => { delete S.routes[k]; c.edited = false; bump(k); drawSheet(); renderTree(); renderEdInsp(); toast('Manual edit removed. The route follows the node output again.'); };
  if ($('#edOpenNode')) $('#edOpenNode').onclick = () => { BD.sel = 'n5'; setMode('board'); renderBoard(); };
  if ($('#ep-width')) wireParamForm(NODE_TYPES.route, 'ep', NODE_VALS.n5, kk => toast(`Node parameter “${kk}” changed. The node and its downstream layers re-run; your manual edit is kept.`));
  $$('[data-ok]', p).forEach(b => b.onclick = () => { b.closest('.find').remove(); toast('2 translations accepted by FR.'); });
}

/* "Prompt a layer": Claude plans ops, geometry code computes the path, the result lands as a new
   layer behind a diff preview. Nothing is committed until Accept. */
function editorPrompt(text, done) {
  const k = S.ed.k;
  if (!k.startsWith('circ:')) { setTimeout(() => { done(); toast(`Planned 2 ops on <b>${esc(currentScope().label)}</b>: setStyle, placeLabel. Shown as a diff.`); }, 900); return; }
  const chip = document.createElement('div'); chip.className = 'agent-chip'; chip.innerHTML = `<span class="chip accent">${ic('sparkle')} Planning operations…</span>`; $('#v-editor').appendChild(chip);
  setTimeout(() => { chip.innerHTML = `<span class="chip accent">${ic('vector')} requestRoute(service-yard → market, via core) · A*</span>`; }, 800);
  setTimeout(() => {
    chip.remove(); done();
    const o = parseKey(k)[1], b = o.b;
    const pts = [[SITE.x + SITE.w + 20, SITE.y + SITE.d - 10], [b[b.length - 1].x + b[b.length - 1].w + 6, b[b.length - 1].y + b[b.length - 1].d + 6], [b[0].x + b[0].w / 2 + 20, b[b.length - 1].y + b[b.length - 1].d + 10], [b[0].x + 10, SITE.y + SITE.d + 2]];
    S.extra[k] = (S.extra[k] || []).concat([{ k: 'circulation/service-route', pts }]);
    S.ed.pending = { k: 'circulation/service-route', text };
    S.ed.layer = 'circulation/service-route';
    drawSheet(); renderTree(); renderEdInsp(); renderDiff();
  }, 1700);
}
function renderDiff() {
  const box = $('#edDiff'); if (!box) return;
  if (!S.ed.pending) { box.innerHTML = ''; return; }
  box.innerHTML = `<div class="diffbar" role="status"><span class="sparkle">${ic('sparkle')}</span><span><b>1 layer added</b> · circulation/service-route</span><button class="btn sm" id="dfRej">Reject</button><button class="btn sm" id="dfTw">Tweak</button><button class="btn primary sm" id="dfAcc">${ic('check')}Accept</button></div>`;
  const k = S.ed.k;
  $('#dfAcc').onclick = () => { S.ed.pending = null; bump(k); renderDiff(); drawSheet(); renderTree(); pushHistory('Add service route', () => { S.extra[k] = []; bump(k); drawSheet(); renderTree(); }); toast('Committed as one undo step. The Standards agent checked it: no findings.', ['Undo', undo]); };
  $('#dfRej').onclick = () => { S.extra[k] = (S.extra[k] || []).filter(x => x.k !== 'circulation/service-route'); S.ed.pending = null; S.ed.layer = null; renderDiff(); drawSheet(); renderTree(); renderEdInsp(); toast('Rejected. Nothing was written to the document.'); };
  $('#dfTw').onclick = () => { $('#promptIn').focus(); $('#promptIn').value = 'make the service route thinner and keep it behind the market'; };
}
