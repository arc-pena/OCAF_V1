/* DiagramLab prototype — Board and node graph.
   Node types are declared as data. The card on the board, the inspector form and the matrix override
   popover are all generated from NODE_TYPES, so a parameter appears identically in all three. */

const FAM = { input: ['Input', 'var(--port-text)'], prepare: ['Prepare', 'var(--port-raster)'], vector: ['Generate · vector', 'var(--port-vector)'], raster: ['Generate · raster', 'var(--port-raster)'], style: ['Style', 'var(--port-style)'], compose: ['Compose', 'var(--port-scene)'], output: ['Output', 'var(--fg)'] };
const PORT = { Raster: 'var(--port-raster)', Vector: 'var(--port-vector)', Text: 'var(--port-text)', Mask: 'var(--port-mask)', Anchors: 'var(--port-anchors)', Scene: 'var(--port-scene)', Style: 'var(--port-style)' };
const ANCHORS = ['plaza-entrance', 'ramp', 'auditorium', 'core', 'roof-garden', 'bridge'];
const NODE_TYPES = {
  optionDrawing: { fam: 'input', title: 'Option Drawing', in: [], out: [['Image', 'Raster']], params: [{ k: 'option', l: 'Option', t: 'enum', o: ['A', 'B', 'C', 'D'] }, { k: 'slot', l: 'Slot', t: 'enum', o: ['plan L0', 'plan L1', 'section', 'site', 'axo view'] }, { k: 'camera', l: 'Camera', t: 'enum', o: ['From sidecar JSON', 'Solve from 4 points'] }] },
  anchors: { fam: 'input', title: 'Anchors', in: [], out: [['Anchors', 'Anchors']], params: [{ k: 'names', l: 'Names', t: 'tags' }] },
  brief: { fam: 'input', title: 'Brief', in: [], out: [['Brief', 'Text']], params: [{ k: 'text', l: 'Brief', t: 'text' }] },
  styleProfile: { fam: 'style', title: 'Style Profile', in: [], out: [['Tokens', 'Style']], params: [{ k: 'profile', l: 'Profile', t: 'enum', o: ['Office standard v3', 'v4 draft'] }] },
  ghost: { fam: 'prepare', title: 'Ghost Massing', in: [['Image', 'Raster'], ['ID pass', 'Mask']], out: [['Image', 'Raster']], params: [{ k: 'opacity', l: 'Opacity', t: 'range' }, { k: 'plates', l: 'Floor plates', t: 'bool' }, { k: 'spacing', l: 'Plate spacing', t: 'unit', d: 'model' }] },
  route: { fam: 'vector', title: 'Route / Spline', in: [['Walkable', 'Raster'], ['Anchors', 'Anchors'], ['Brief', 'Text']], out: [['Path', 'Vector']], params: [{ k: 'from', l: 'From', t: 'enum', o: ANCHORS }, { k: 'to', l: 'To', t: 'enum', o: ANCHORS }, { k: 'via', l: 'Via', t: 'tags' }, { k: 'width', l: 'Width', t: 'unit', d: 'print' }, { k: 'radius', l: 'Corner radius', t: 'unit', d: 'model' }, { k: 'z', l: 'Z-order', t: 'seg', o: ['Under massing', 'Over'] }] },
  loops: { fam: 'vector', title: 'Loop Arrows', in: [['Regions', 'Anchors']], out: [['Loops', 'Vector']], params: [{ k: 'inset', l: 'Inset', t: 'unit', d: 'model' }, { k: 'dash', l: 'Dash', t: 'unit', d: 'print' }] },
  labels: { fam: 'vector', title: 'Labels & Legend', in: [['Layers', 'Vector'], ['Style', 'Style']], out: [['Labels', 'Text']], params: [{ k: 'lang', l: 'Languages', t: 'seg', o: ['zh + en', 'zh', 'en'] }, { k: 'layout', l: 'Layout', t: 'seg', o: ['Stacked', 'Inline'] }] },
  applyStyle: { fam: 'style', title: 'Apply Style Profile', in: [['Vector', 'Vector'], ['Style', 'Style']], out: [['Styled', 'Vector']], params: [{ k: 'tokens', l: 'Token set', t: 'enum', o: ['circulation', 'program', 'analysis'] }] },
  stack: { fam: 'compose', title: 'Layer Stack', in: [['Base', 'Raster'], ['Routes', 'Vector'], ['Loops', 'Vector'], ['Labels', 'Text']], out: [['Scene', 'Scene']], params: [{ k: 'order', l: 'Order', t: 'enum', o: ['By z-rule', 'Manual'] }] },
  review: { fam: 'style', title: 'Standards Review', in: [['Scene', 'Scene'], ['Style', 'Style']], out: [['Scene', 'Scene']], params: [{ k: 'mode', l: 'Mode', t: 'enum', o: ['Report only', 'Suggest', 'Auto-fix with review', 'Fully automatic'] }, { k: 'passes', l: 'Max passes', t: 'enum', o: ['1', '2', '3', '5'] }] },
};
const NODES = [
  { id: 'n1', type: 'optionDrawing', x: 40, y: 600, st: 'cached', cost: '$0.00' },
  { id: 'n2', type: 'anchors', x: 40, y: 830, st: 'cached', cost: '$0.00' },
  { id: 'n3', type: 'brief', x: 40, y: 990, st: 'cached', cost: '$0.00' },
  { id: 'n4', type: 'ghost', x: 300, y: 600, st: 'cached', cost: '$0.00', thumb: 'base' },
  { id: 'n5', type: 'route', x: 300, y: 820, st: 'cached', cost: '$0.06', thumb: 'route' },
  { id: 'n12', type: 'styleProfile', x: 300, y: 1110, st: 'cached', cost: '$0.00' },
  { id: 'n6', type: 'loops', x: 560, y: 600, st: 'cached', cost: '$0.00' },
  { id: 'n8', type: 'applyStyle', x: 560, y: 800, st: 'cached', cost: '$0.00' },
  { id: 'n7', type: 'labels', x: 560, y: 980, st: 'stale', cost: '$0.03' },
  { id: 'n10', type: 'stack', x: 810, y: 640, st: 'stale', cost: '$0.00' },
  { id: 'n9', type: 'review', x: 810, y: 900, st: 'running', cost: '$0.11' },
];
const NODE_VALS = {
  n1: { option: 'A', slot: 'axo view', camera: 'From sidecar JSON' }, n2: { names: ['plaza-entrance', 'ramp', 'roof-garden'] }, n3: { text: TEMPLATES[3].brief },
  n12: { profile: 'Office standard v3' }, n4: { opacity: 80, plates: true, spacing: '4.2 m' },
  n5: { from: 'plaza-entrance', to: 'roof-garden', via: ['ramp'], width: '4 pt', radius: '4 m', z: 'Under massing' },
  n6: { inset: '5 m', dash: '3pt' }, n8: { tokens: 'circulation' }, n7: { lang: 'zh + en', layout: 'Stacked' }, n10: { order: 'By z-rule' }, n9: { mode: 'Suggest', passes: '3' },
};
const EDGES = [['n1', 0, 'n4', 0], ['n1', 0, 'n5', 0], ['n2', 0, 'n5', 1], ['n3', 0, 'n5', 2], ['n2', 0, 'n6', 0], ['n5', 0, 'n8', 0], ['n12', 0, 'n8', 1], ['n8', 0, 'n7', 0], ['n12', 0, 'n7', 1], ['n4', 0, 'n10', 0], ['n8', 0, 'n10', 1], ['n6', 0, 'n10', 2], ['n7', 0, 'n10', 3], ['n10', 0, 'n9', 0], ['n12', 0, 'n9', 1], ['n9', 0, 'df-A', 0]];
const STC = { cached: 'var(--ok)', running: 'var(--accent)', stale: 'var(--stale)', failed: 'var(--err)' };

function valText(p, v) { if (v == null) return '—'; if (Array.isArray(v)) return v.join(', '); if (typeof v === 'boolean') return v ? 'on' : 'off'; if (p.t === 'range') return v + '%'; return String(v); }
function paramForm(decl, pre, vals) {
  return decl.params.map(p => {
    const id = `${pre}-${p.k}`, v = vals[p.k];
    let ctl;
    if (p.t === 'enum') ctl = `<select class="input" id="${id}">${p.o.map(o => `<option${o === v ? ' selected' : ''}>${o}</option>`).join('')}</select>`;
    else if (p.t === 'seg') ctl = `<div class="seg sm" id="${id}">${p.o.map(o => `<button type="button" aria-pressed="${o === v}" data-v="${o}">${o}</button>`).join('')}</div>`;
    else if (p.t === 'bool') ctl = `<button class="toggle" role="switch" id="${id}" aria-checked="${!!v}"></button>`;
    else if (p.t === 'range') ctl = `<input type="range" class="slider" id="${id}" min="0" max="100" value="${v}">`;
    else if (p.t === 'unit') ctl = unitField(id, v, p.d);
    else if (p.t === 'tags') ctl = `<div style="display:flex;gap:4px;flex-wrap:wrap" id="${id}">${(v || []).map(x => `<span class="chip">${x}</span>`).join('')}<button class="chip" type="button">${ic('plus')}</button></div>`;
    else ctl = `<textarea class="input" rows="3" id="${id}">${esc(v || '')}</textarea>`;
    return `<div class="field"><label for="${id}">${p.l}</label>${ctl}</div>`;
  }).join('');
}
function wireParamForm(decl, pre, vals, onChange) {
  decl.params.forEach(p => {
    const id = `${pre}-${p.k}`, el = document.getElementById(id); if (!el) return;
    if (p.t === 'seg') $$('button', el).forEach(b => b.onclick = () => { $$('button', el).forEach(x => x.setAttribute('aria-pressed', String(x === b))); vals[p.k] = b.dataset.v; onChange(p.k); });
    else if (p.t === 'bool') el.onclick = () => { vals[p.k] = !vals[p.k]; el.setAttribute('aria-checked', String(vals[p.k])); onChange(p.k); };
    else if (p.t === 'unit') wireUnit(id, p.d, (v, raw) => { vals[p.k] = raw; onChange(p.k); });
    else if (p.t !== 'tags') el.onchange = () => { vals[p.k] = p.t === 'range' ? +el.value : el.value; onChange(p.k); };
  });
}
function nodeCard(n) {
  const d = NODE_TYPES[n.type], vals = NODE_VALS[n.id], fam = FAM[d.fam];
  const ports = d.in.map((p, i) => `<div class="port in" data-port="in${i}"><span class="dot" style="background:${PORT[p[1]]}"></span>${p[0]}</div>`).join('') + d.out.map((p, i) => `<div class="port out" data-port="out${i}">${p[0]} <span class="faint">${p[1]}</span><span class="dot" style="background:${PORT[p[1]]}"></span></div>`).join('');
  const prm = d.params.slice(0, 3).map(p => `<div class="p"><span>${p.l}</span><span>${esc(valText(p, vals[p.k]))}</span></div>`).join('');
  let th = '';
  if (n.thumb === 'route') th = `<svg viewBox="40 20 340 240">${drawRoute(PROJ.axo, S.routes['circ:A'] || OPTIONS[0].route, 6)}</svg>`;
  if (n.thumb === 'base') th = `<svg viewBox="40 20 340 240">${sortB(PROJ.axo, OPTIONS[0].b).map(b => prism(PROJ.axo, b, { top: '#fff', side: '#fff', stroke: '#333', sw: 1, plates: 4.2, psw: .5 })).join('')}</svg>`;
  return `<div class="node" data-id="${n.id}" style="left:${n.x}px;top:${n.y}px"><div class="nh"><span class="fam" style="background:${fam[1]}">${ic(d.fam === 'input' ? 'upload' : d.fam === 'style' ? 'shield' : d.fam === 'compose' ? 'layers' : d.fam === 'prepare' ? 'image' : 'vector')}</span><b>${d.title}</b><span class="st" title="${n.st}" style="background:${STC[n.st]}"></span></div>
    <div class="ports">${ports}</div><div class="params">${prm}</div>
    <div class="nf">${th ? `<span class="thumb">${th}</span>` : ''}<span>${n.st === 'running' ? 'running · pass 2 of 3' : n.st}</span><span style="margin-left:auto" class="mono">${n.cost}</span></div></div>`;
}

const BD = { x: 40, y: 60, z: .62, sel: 'n5', wires: true };
const FRAMES = [
  { id: 'f-in', x: 0, y: 0, w: 1760, h: 420, t: 'Option inputs', s: '4 options · 8 assets · registered' },
  { id: 'f-circ', x: 0, y: 540, w: 1760, h: 720, t: 'Circulation', s: 'Template 04 · recipe of 11 nodes' },
  { id: 'f-ref', x: 1860, y: 0, w: 760, h: 1260, t: 'Reference set', s: '7 sheets · trained Style Profile v3' },
];
function renderBoard() {
  const v = $('#v-board');
  v.innerHTML = `<div class="bd-canvas ${BD.wires ? '' : 'wires-off'}" id="bdCanvas"><div class="bd-world" id="bdWorld"></div></div>
    <div class="panel bd-tools" role="toolbar" aria-label="Board tools">
      ${[['select', 'Select (V)'], ['hand', 'Hand (H)'], ['frame', 'Frame (F)'], ['sticky', 'Sticky note (N)'], ['text', 'Text (T)'], ['upload', 'Import files'], ['comment', 'Comment (C)']].map((t, i) => `<button class="ib" aria-pressed="${i === 0}" title="${t[1]}" data-tool="${t[0]}">${ic(t[0])}</button>`).join('')}</div>
    <div class="panel bd-top"><span class="eyebrow">Recipe</span><button class="toggle" role="switch" id="wiresT" aria-checked="${BD.wires}"></button><label for="wiresT" style="font-size:12px;white-space:nowrap">Show wires</label><span style="width:1px;height:18px;background:var(--line)"></span><button class="btn ghost sm" id="bdArrange">${ic('grid')}Auto-arrange</button><button class="btn ghost sm" id="bdSearch">${ic('search')}Search</button></div>
    <div class="panel bd-mini"><svg id="bdMini" viewBox="0 0 200 120" aria-label="Minimap"></svg><div class="zm"><button class="ib sm" id="bdOut" aria-label="Zoom out">${ic('minus')}</button><span class="mono num" id="bdZ"></span><button class="ib sm" id="bdIn" aria-label="Zoom in">${ic('plus')}</button><button class="ib sm" id="bdFit" aria-label="Fit">${ic('fit')}</button></div></div>
    <aside class="panel bd-insp" id="bdInsp"></aside>`;
  const w = $('#bdWorld');
  let h = FRAMES.map(f => `<div class="bd-frame" style="left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px"><div class="ttl">${ic('frame')}${f.t} <span class="faint">${f.s}</span></div></div>`).join('');
  OPTIONS.forEach((o, i) => {
    const x0 = 24 + i * 434;
    h += `<div style="position:absolute;left:${x0}px;top:18px;font-weight:600;display:flex;gap:8px;align-items:center;white-space:nowrap">${optTag(o.id)}<span class="faint" style="font-weight:400">${o.name} · scale 1:500 · north 12°</span></div>`;
    [['plan', 'Plan L0', 'PDF p.3 · vector', 'A'], ['axo', 'Axo view', 'PNG + camera.json', 'B']].forEach((a, j) => {
      h += `<div class="asset" style="left:${x0 + j * 208}px;top:48px"><div class="th">${assetPlan(o, a[0])}</div><div class="cap"><div class="row"><b>${a[1]}</b><span class="pill ok">Registered</span></div><span class="faint">${o.id}_${a[0] === 'plan' ? 'plans.pdf' : 'axo.png'} · ${a[2]}</span></div></div>`;
    });
  });
  h += `<div class="sticky" style="left:1480px;top:290px">Jury brief asks for a clear public route from the river. Make the ramp the hero in every option.<div class="by">FR · 29 Sep</div></div>`;
  h += `<div class="sticky" style="left:1040px;top:1150px;background:#D6F0E4;color:#0D3B27;transform:rotate(1deg)">Option C: the route crosses the bridge. Stored as a cell addendum, not on the template.<div class="by">MK · yesterday</div></div>`;
  h += NODES.map(nodeCard).join('');
  OPTIONS.forEach((o, i) => {
    const x = 1040 + (i % 2) * 360, y = 590 + Math.floor(i / 2) * 290, k = 'circ:' + o.id;
    h += `<div class="dframe ${i === 0 ? 'df-main' : ''}" data-k="${k}" id="df-${o.id}" style="left:${x}px;top:${y}px"><div class="ttl">${optTag(o.id, false)} Circulation × ${o.id} ${pill(CELLS[k].status)}</div><div class="pap">${thumb(T('circ'), o)}</div></div>`;
  });
  const refs = [['views', 'A', 'Views and green areas'], ['circ', 'B', 'Internal and external circulation'], ['ground', 'A', 'Ground plan'], ['keyed', 'A', 'Key spatial analysis'], ['program', 'A', 'Program analysis'], ['hl', 'A', 'Community centre – market'], ['roof', 'A', 'Roof plan']];
  refs.forEach((r, i) => {
    const x = 1884 + (i % 2) * 360, y = 40 + Math.floor(i / 2) * 300;
    const svg = r[0] === 'hl' ? diagram(T('program'), O('A'), { v: 'highlight' }) : thumb(T(r[0]), O(r[1]));
    h += `<div class="dframe" style="left:${x}px;top:${y}px"><div class="ttl"><span class="mono faint">R${i + 1}</span> ${r[2]}</div><div class="pap">${svg}</div></div>`;
  });
  h += `<div class="pin" style="left:1250px;top:548px"><span class="avatar sm" style="background:var(--opt-a)">MK</span><span class="bub">Can the red route sit under the auditorium overhang?</span></div>`;
  h += `<svg class="bd-wires" id="bdWires" width="2700" height="1300"></svg>`;
  w.innerHTML = h;
  applyBoardView(); drawWires(); renderBoardInsp(); drawMini();

  const cv = $('#bdCanvas');
  let drag = null;
  cv.addEventListener('pointerdown', e => {
    const nh = e.target.closest('.node .nh'), node = e.target.closest('.node'), df = e.target.closest('.dframe[data-k]');
    if (node) { BD.sel = node.dataset.id; $$('.node').forEach(n => n.classList.toggle('sel', n === node)); $$('.dframe').forEach(n => n.classList.remove('sel')); renderBoardInsp(); }
    if (df) { $$('.dframe').forEach(n => n.classList.toggle('sel', n === df)); }
    if (nh) { const n = NODES.find(q => q.id === node.dataset.id); drag = { kind: 'node', n, el: node, sx: e.clientX, sy: e.clientY, ox: n.x, oy: n.y }; nh.setPointerCapture(e.pointerId); return; }
    if (!node && !df && !e.target.closest('.asset,.sticky')) { drag = { kind: 'pan', sx: e.clientX, sy: e.clientY, ox: BD.x, oy: BD.y }; cv.classList.add('panning'); cv.setPointerCapture(e.pointerId); }
  });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    if (drag.kind === 'pan') { BD.x = drag.ox + e.clientX - drag.sx; BD.y = drag.oy + e.clientY - drag.sy; applyBoardView(); }
    else { drag.n.x = Math.round((drag.ox + (e.clientX - drag.sx) / BD.z) / 8) * 8; drag.n.y = Math.round((drag.oy + (e.clientY - drag.sy) / BD.z) / 8) * 8; drag.el.style.left = drag.n.x + 'px'; drag.el.style.top = drag.n.y + 'px'; drawWires(); }
  });
  const end = () => { drag = null; cv.classList.remove('panning'); drawMini(); };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  cv.addEventListener('dblclick', e => { const df = e.target.closest('.dframe[data-k]'); if (df) openEditor(df.dataset.k); });
  cv.addEventListener('wheel', e => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) { const r = cv.getBoundingClientRect(); zoomBoard(Math.exp(-e.deltaY * .01), e.clientX - r.left, e.clientY - r.top); }
    else { BD.x -= e.deltaX; BD.y -= e.deltaY; applyBoardView(); drawMini(); }
  }, { passive: false });
  $('#wiresT').onclick = e => { BD.wires = !BD.wires; e.currentTarget.setAttribute('aria-checked', String(BD.wires)); cv.classList.toggle('wires-off', !BD.wires); };
  $('#bdIn').onclick = () => zoomBoard(1.2); $('#bdOut').onclick = () => zoomBoard(1 / 1.2); $('#bdFit').onclick = fitBoard;
  $('#bdArrange').onclick = () => { NODES.forEach((n, i) => { n.x = 40 + Math.floor(i / 3) * 250; n.y = 600 + (i % 3) * 210; }); $$('.node').forEach(el => { const n = NODES.find(q => q.id === el.dataset.id); el.style.left = n.x + 'px'; el.style.top = n.y + 'px'; }); drawWires(); toast('Nodes arranged in dependency order.'); };
  $('#bdSearch').onclick = e => openPop(e.currentTarget, `<input class="input" placeholder="Search items, prompts and layer names" style="width:280px" id="bdQ"><div class="menu" style="margin-top:6px"><button>${ic('vector')}circulation/external-route <span class="hint">layer</span></button><button>${ic('node')}Route / Spline <span class="hint">node</span></button><button>${ic('sparkle')}“route it via the ramp instead” <span class="hint">prompt</span></button></div>`, el => $('#bdQ', el).focus());
  $$('.bd-tools .ib').forEach(b => b.onclick = () => { $$('.bd-tools .ib').forEach(x => x.setAttribute('aria-pressed', String(x === b))); if (b.dataset.tool === 'upload') toast('Drop PDFs, images, SVG or DXF anywhere on the board. A folder per option creates the options.'); });
}
function applyBoardView() {
  const w = $('#bdWorld'), cv = $('#bdCanvas'); if (!w) return;
  w.style.transform = `translate(${BD.x}px,${BD.y}px) scale(${BD.z})`;
  const s = 16 * BD.z;
  cv.style.backgroundImage = `radial-gradient(var(--dot) ${Math.max(.8, BD.z)}px, transparent ${Math.max(1, BD.z * 1.2)}px)`;
  cv.style.backgroundSize = `${s}px ${s}px`; cv.style.backgroundPosition = `${BD.x}px ${BD.y}px`;
  $('#bdZ').textContent = Math.round(BD.z * 100) + '%';
}
function zoomBoard(k, cx, cy) {
  const cv = $('#bdCanvas'); cx = cx ?? cv.clientWidth / 2; cy = cy ?? cv.clientHeight / 2;
  const z = Math.min(2.5, Math.max(.15, BD.z * k)); k = z / BD.z;
  BD.x = cx - (cx - BD.x) * k; BD.y = cy - (cy - BD.y) * k; BD.z = z; applyBoardView(); drawMini();
}
function fitBoard() { const cv = $('#bdCanvas'); BD.z = Math.min((cv.clientWidth - 80) / 2620, (cv.clientHeight - 100) / 1300); BD.x = 40; BD.y = 50; applyBoardView(); drawMini(); }
function portPos(id, dir, i) {
  const w = $('#bdWorld'), wr = w.getBoundingClientRect();
  let el;
  if (id.startsWith('df-')) { el = $('#' + id + ' .pap'); const r = el.getBoundingClientRect(); return [(r.left - wr.left) / BD.z, (r.top + r.height / 2 - wr.top) / BD.z]; }
  el = $(`.node[data-id="${id}"] [data-port="${dir}${i}"] .dot`); if (!el) return [0, 0];
  const r = el.getBoundingClientRect(); return [(r.left + r.width / 2 - wr.left) / BD.z, (r.top + r.height / 2 - wr.top) / BD.z];
}
function drawWires() {
  const svg = $('#bdWires'); if (!svg) return;
  svg.innerHTML = EDGES.map(([a, ai, b, bi]) => {
    const p = portPos(a, 'out', ai), q = portPos(b, 'in', bi), dx = Math.max(40, Math.abs(q[0] - p[0]) * .45);
    const type = NODE_TYPES[NODES.find(n => n.id === a).type].out[ai][1];
    return `<path d="M${p[0]} ${p[1]} C${p[0] + dx} ${p[1]} ${q[0] - dx} ${q[1]} ${q[0]} ${q[1]}" fill="none" stroke="${PORT[type]}" stroke-width="2" stroke-opacity=".75"/>`;
  }).join('');
}
function drawMini() {
  const m = $('#bdMini'), cv = $('#bdCanvas'); if (!m || !cv) return;
  const W = 2620, H = 1300, s = Math.min(200 / W, 120 / H), ox = (200 - W * s) / 2, oy = (120 - H * s) / 2;
  let h = FRAMES.map(f => `<rect x="${ox + f.x * s}" y="${oy + f.y * s}" width="${f.w * s}" height="${f.h * s}" rx="2" fill="var(--surface)" stroke="var(--line-2)"/>`).join('');
  h += NODES.map(n => `<rect x="${ox + n.x * s}" y="${oy + n.y * s}" width="${208 * s}" height="${150 * s}" fill="var(--fg-3)"/>`).join('');
  const vx = -BD.x / BD.z, vy = -BD.y / BD.z, vw = cv.clientWidth / BD.z, vh = cv.clientHeight / BD.z;
  h += `<rect x="${ox + vx * s}" y="${oy + vy * s}" width="${vw * s}" height="${vh * s}" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1"/>`;
  m.innerHTML = h;
  m.onclick = e => { const r = m.getBoundingClientRect(), wx = ((e.clientX - r.left) * 200 / r.width - ox) / s, wy = ((e.clientY - r.top) * 120 / r.height - oy) / s; BD.x = cv.clientWidth / 2 - wx * BD.z; BD.y = cv.clientHeight / 2 - wy * BD.z; applyBoardView(); drawMini(); };
}
function renderBoardInsp() {
  const p = $('#bdInsp'); if (!p) return;
  const n = NODES.find(q => q.id === BD.sel); if (!n) { p.hidden = true; return; }
  p.hidden = false;
  const d = NODE_TYPES[n.type], vals = NODE_VALS[n.id];
  p.innerHTML = `<div class="panel-h"><span class="fam" style="width:18px;height:18px;border-radius:5px;background:${FAM[d.fam][1]}"></span><h3>${d.title}</h3><span class="pill ${n.st === 'cached' ? 'ok' : n.st === 'running' ? 'info' : 'stale'}">${n.st}</span></div>
    <div class="panel-b"><div class="sec"><span class="eyebrow">${FAM[d.fam][0]} · parameters</span>${paramForm(d, 'bn', vals)}</div>
    <div class="sec"><span class="eyebrow">Ports</span>${d.in.map(q => `<div style="display:flex;gap:6px;align-items:center;font-size:12px"><span class="sw" style="background:${PORT[q[1]]};border-radius:50%;width:10px;height:10px"></span>in · ${q[0]} <span class="faint">${q[1]}</span></div>`).join('')}${d.out.map(q => `<div style="display:flex;gap:6px;align-items:center;font-size:12px"><span class="sw" style="background:${PORT[q[1]]};border-radius:50%;width:10px;height:10px"></span>out · ${q[0]} <span class="faint">${q[1]}</span></div>`).join('')}</div>
    <div class="sec"><span class="eyebrow">Cache</span><dl class="kv"><dt>Key</dt><dd>sha256:${(n.id.charCodeAt(1) * 9301 + 49297).toString(16)}e4…</dd><dt>Last run</dt><dd>${n.cost} · 1.8 s</dd></dl><span class="faint" style="font-size:11.5px">Changing a parameter re-runs this node and everything downstream. Upstream results stay cached.</span></div></div>`;
  wireParamForm(d, 'bn', vals, () => {
    const down = new Set([n.id]); let grew = true;
    while (grew) { grew = false; EDGES.forEach(([a, , b]) => { if (down.has(a) && !down.has(b)) { down.add(b); grew = true; } }); }
    NODES.forEach(q => { if (down.has(q.id) && q.id !== n.id) q.st = 'stale'; });
    n.st = 'running';
    $$('.node').forEach(el => { const q = NODES.find(x => x.id === el.dataset.id); el.querySelector('.st').style.background = STC[q.st]; });
    const cnt = [...down].filter(x => x.startsWith('n')).length;
    toast(`${cnt} downstream node${cnt > 1 ? 's' : ''} marked stale; ${NODES.length - cnt} upstream results reused from cache.`);
    setTimeout(() => { NODES.forEach(q => { if (down.has(q.id)) q.st = 'cached'; }); const old = $$('.node'); old.forEach(el => { const q = NODES.find(x => x.id === el.dataset.id); el.outerHTML = nodeCard(q); }); $$('.node').forEach(el => el.classList.toggle('sel', el.dataset.id === BD.sel)); drawWires(); renderBoardInsp(); }, 1400);
  });
}
