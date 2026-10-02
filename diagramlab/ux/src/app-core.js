/* DiagramLab prototype — shell, shared state and the Matrix.
   One state object stands in for the document model: every view reads CELLS / TOK / S and writes through
   the same few functions (setCell, pushHistory), the way the real app writes only through applyOps(). */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const IC = {
  logo: '<path d="M4 18L10 6l4 8 2-3 4 7z" fill="currentColor" stroke="none"/>',
  board: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  matrix: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>',
  editor: '<path d="M4 20l3-9 9-6 3 3-6 9-9 3z"/><circle cx="11.5" cy="12.5" r="1.5"/>',
  present: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
  play: '<path d="M7 5l12 7-12 7V5z"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/><path d="M19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7L19 16z"/>',
  shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  chev: '<path d="M9 6l6 6-6 6"/>', chevd: '<path d="M6 9l6 6 6-6"/>', chevl: '<path d="M15 6l-6 6 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
  select: '<path d="M5 3l14 8-6 1.5L10 19 5 3z" fill="currentColor"/>',
  direct: '<path d="M5 3l14 8-6 1.5L10 19 5 3z"/>',
  pen: '<path d="M12 20l6-7-6-10-6 10 6 7z"/><path d="M12 3v8.5"/><circle cx="12" cy="13" r="1.5"/>',
  pencil: '<path d="M4 20l1-4L16 5l3 3L8 19l-4 1z"/>',
  text: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>',
  rect: '<rect x="4" y="6" width="16" height="12" rx="1"/>',
  ellipse: '<ellipse cx="12" cy="12" rx="8" ry="6"/>',
  hand: '<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v8a7 7 0 0 1-7 7h-.5A6.5 6.5 0 0 1 4 16l-1.6-3a1.5 1.5 0 0 1 2.6-1.5L8 15"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
  auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
  export: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
  filter: '<path d="M4 5h16l-6 8v6l-4-2v-4L4 5z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  loupe: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M8 19v2M16 19v2"/>',
  slides: '<rect x="3" y="5" width="18" height="12" rx="1.5"/><path d="M10 9l5 2-5 2V9z"/>',
  sheet: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 8h18M9 8v12M15 8v12"/>',
  check: '<path d="M5 12l5 5 9-10"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  more: '<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>',
  comment: '<path d="M4 5h16v11H9l-5 4V5z"/>',
  anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M8 11h8"/>',
  wire: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 6c6 0 4 12 10 12"/>',
  frame: '<path d="M7 3v18M17 3v18M3 7h18M3 17h18"/>',
  sticky: '<path d="M4 4h16v10l-6 6H4V4z"/><path d="M14 20v-6h6"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  swatch: '<circle cx="8" cy="9" r="4"/><circle cx="16" cy="9" r="4"/><circle cx="12" cy="16" r="4"/>',
  send: '<path d="M5 12h13M13 6l6 6-6 6"/>',
  history: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  detach: '<path d="M9 15l6-6"/><path d="M11 6l1-1a4 4 0 0 1 6 6l-1 1M13 18l-1 1a4 4 0 0 1-6-6l1-1"/>',
  push: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  flag: '<path d="M5 21V4M5 4h12l-2 4 2 4H5"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/>',
  node: '<rect x="3" y="6" width="8" height="12" rx="2"/><rect x="14" y="6" width="7" height="6" rx="2"/><path d="M11 9h3"/>',
  image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 8"/>',
  vector: '<path d="M5 19C9 5 15 19 19 5"/><rect x="3" y="17" width="4" height="4"/><rect x="17" y="3" width="4" height="4"/>',
  textl: '<path d="M6 6h12M12 6v12"/>',
  mask: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="5" fill="currentColor"/>',
  upload: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
  compare: '<rect x="3" y="5" width="8" height="14" rx="1"/><rect x="13" y="5" width="8" height="14" rx="1"/>',
};
const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;
function hydrateIcons(root = document) { $$('[data-ic]', root).forEach(el => { if (!el.firstChild) el.innerHTML = ic(el.dataset.ic); }); }

const key = (t, o) => `${t.id}:${o.id}`;
const T = id => TEMPLATES.find(t => t.id === id);
const O = id => OPTIONS.find(o => o.id === id);
const parseKey = k => { const [t, o] = k.split(':'); return [T(t), O(o)]; };
const ST = {
  approved: { l: 'Approved', c: 'ok' }, ready: { l: 'Ready', c: 'neutral' }, review: { l: 'Needs review', c: 'warn' },
  stale: { l: 'Stale', c: 'stale' }, failed: { l: 'Failed', c: 'err' }, queued: { l: 'Queued', c: 'neutral' },
  running: { l: 'Running', c: 'info' }, blocked: { l: 'Blocked', c: 'err' },
};
const pill = s => `<span class="pill ${ST[s].c}">${ST[s].l}</span>`;
const optTag = (id, label = true) => `<span class="opt ${id}"><i></i>${label ? 'Option ' + id : id}</span>`;

/* ---------- document state ---------- */
const S = {
  mode: 'matrix', prevMode: 'matrix', theme: 'system',
  sel: new Set(['circ:A']), selRow: null, filter: 'all', compact: false,
  routes: {}, extra: {}, hidden: {},
  ed: { k: 'circ:A', layer: 'circulation/external-route', tool: 'direct', zoom: 0, pan: [0, 0], tab: 'design', scope: 'instance', pending: null, fixed: new Set() },
  hist: [], tokRev: 0,
};
const CELLS = {};
(function seed() {
  const r = rng(42);
  TEMPLATES.forEach(t => OPTIONS.forEach(o => {
    const x = r();
    CELLS[key(t, o)] = { status: x < .46 ? 'approved' : x < .82 ? 'ready' : 'review', cost: +(0.28 + r() * .7).toFixed(2), ovr: [], edited: false, rev: 0, stars: Math.floor(r() * 4) + (r() < .3 ? 2 : 0), flag: r() < .12 ? ['#E5484D', '#F5B400', '#30A46C'][Math.floor(r() * 3)] : null, reason: '', ver: 3 + Math.floor(r() * 6) };
  }));
  ['program:C', 'ground:C', 'roof:C', 'keyed:C', 'land:C'].forEach(k => Object.assign(CELLS[k], { status: 'stale', reason: 'C_plans.pdf page 3 replaced 2 h ago' }));
  Object.assign(CELLS['exploded:D'], { status: 'failed', reason: '1 of 6 layers failed · Image Edit rate-limited after 3 retries. The other 5 layers are intact.' });
  Object.assign(CELLS['roof:D'], { status: 'blocked', reason: 'Missing anchor “roof-garden”' });
  Object.assign(CELLS['circ:A'], { status: 'review', edited: true, ovr: [{ id: 'o1', what: 'Route / Spline · corner radius', val: '6 m', tpl: '4 m', kind: 'param' }] });
  CELLS['circ:C'].ovr.push({ id: 'o2', what: 'Brief addendum', val: '“In Option C the route crosses the bridge.”', tpl: '—', kind: 'brief' });
  CELLS['views:B'].ovr.push({ id: 'o3', what: 'Hidden layer · views/room-view-ticks', val: 'hidden', tpl: 'visible', kind: 'hidden', layer: 'views/room-view-ticks' });
  S.hidden['views:B'] = new Set(['views/room-view-ticks']);
  CELLS['sustain:A'].ovr.push({ id: 'o4', what: 'Labels & Legend · layout', val: 'Inline', tpl: 'Stacked', kind: 'param' });
  S.routes['circ:A'] = OPTIONS[0].route.map(p => p.slice()); S.routes['circ:A'][3] = [222, 150];
})();

const thumbs = {};
function ctxFor(k) {
  const c = CELLS[k];
  return { route: S.routes[k], extraRoutes: S.extra[k], routeW: c.routeW };
}
function thumb(t, o) {
  const k = key(t, o), c = CELLS[k], rev = c.rev + '.' + S.tokRev;
  if (thumbs[k] && thumbs[k].rev === rev) return thumbs[k].svg;
  let svg = diagram(t, o, ctxFor(k));
  (S.hidden[k] || []).forEach(L => { svg = svg.replace(`<g data-k="${L}" >`, `<g data-k="${L}" display="none">`); });
  thumbs[k] = { rev, svg };
  return svg;
}
function bump(k) { CELLS[k].rev++; }

/* ---------- toasts, popovers, history ---------- */
function toast(html, action) {
  const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = `<span>${html}</span>`;
  if (action) { const b = document.createElement('button'); b.textContent = action[0]; b.onclick = () => { action[1](); el.remove(); }; el.appendChild(b); }
  $('#toasts').appendChild(el); setTimeout(() => el.remove(), 4600);
}
let popEl = null;
function closePop() { if (popEl) { popEl.remove(); popEl = null; } }
function openPop(anchor, html, mount, place = 'below') {
  closePop();
  popEl = document.createElement('div'); popEl.className = 'popover'; popEl.innerHTML = html; document.body.appendChild(popEl);
  hydrateIcons(popEl);
  const r = anchor.getBoundingClientRect(), pw = popEl.offsetWidth, ph = popEl.offsetHeight;
  let x = Math.min(Math.max(16, r.left), innerWidth - pw - 16), y = place === 'above' ? r.top - ph - 8 : r.bottom + 8;
  if (y + ph > innerHeight - 8) y = Math.max(8, r.top - ph - 8);
  popEl.style.left = x + 'px'; popEl.style.top = y + 'px';
  if (mount) mount(popEl);
  setTimeout(() => document.addEventListener('pointerdown', outside), 0);
  function outside(e) { if (popEl && !popEl.contains(e.target)) { closePop(); } document.removeEventListener('pointerdown', outside); }
  return popEl;
}
function pushHistory(label, undo) { S.hist.push({ label, undo }); if (S.hist.length > 50) S.hist.shift(); }
function undo() { const h = S.hist.pop(); if (!h) { toast('Nothing to undo'); return; } h.undo(); toast(`Undid <b>${h.label}</b>`); }

/* ---------- units and expressions (brief §13: fields accept 12mm, 2pt, span/3) ---------- */
const UNITS = { print: { base: 'pt', u: { pt: 1, mm: 1 / PT, in: 72, px: .75 }, vars: { hair: .25, base: 1 } }, model: { base: 'm', u: { m: 1, mm: .001, cm: .01, ft: .3048 }, vars: { span: 16.8, floor: 4.2, grid: 16.8 } } };
function evalUnit(str, dim = 'print') {
  const D = UNITS[dim]; const src = String(str).trim(); let i = 0;
  const ws = () => { while (src[i] === ' ') i++; };
  function atom() {
    ws();
    if (src[i] === '(') { i++; const v = expr(); ws(); if (src[i++] !== ')') throw 0; return v; }
    if (src[i] === '-') { i++; return -atom(); }
    const m = /^(\d+(?:\.\d*)?|\.\d+)\s*([a-z]+)?/i.exec(src.slice(i));
    if (m) { i += m[0].length; const u = m[2] ? m[2].toLowerCase() : D.base; if (!(u in D.u)) throw 0; return parseFloat(m[1]) * D.u[u]; }
    const v = /^[a-z_]+/i.exec(src.slice(i)); if (v && v[0] in D.vars) { i += v[0].length; return D.vars[v[0]]; }
    throw 0;
  }
  function term() { let v = atom(); for (;;) { ws(); if (src[i] === '*') { i++; v *= atom(); } else if (src[i] === '/') { i++; v /= atom(); } else return v; } }
  function expr() { let v = term(); for (;;) { ws(); if (src[i] === '+') { i++; v += term(); } else if (src[i] === '-') { i++; v -= term(); } else return v; } }
  try { const v = expr(); ws(); if (i !== src.length || !isFinite(v)) return null; return v; } catch (e) { return null; }
}
function unitField(id, val, dim, onSet, overridden) {
  const v = evalUnit(val, dim);
  return `<div class="unit" data-dim="${dim}"><input class="input" id="${id}" value="${esc(val)}" spellcheck="false"><span class="res">${v == null ? '?' : (+v.toFixed(2)) + ' ' + UNITS[dim].base}</span></div>`;
}
function wireUnit(id, dim, onSet) {
  const inp = $('#' + id); if (!inp) return;
  const box = inp.parentElement, res = box.querySelector('.res');
  const upd = commit => { const v = evalUnit(inp.value, dim); box.classList.toggle('bad', v == null); res.textContent = v == null ? 'invalid' : (+v.toFixed(2)) + ' ' + UNITS[dim].base; if (commit && v != null) onSet(v, inp.value); };
  inp.addEventListener('input', () => upd(false));
  inp.addEventListener('change', () => upd(true));
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { upd(true); inp.blur(); } });
}

/* ---------- mode switching ---------- */
const VIEWS = ['board', 'matrix', 'editor', 'present', 'profile', 'system'];
const rendered = {};
function setMode(m) {
  if (m === S.mode && rendered[m]) return;
  if (m === 'present' && S.mode !== 'present') S.prevMode = S.mode;
  S.mode = m;
  VIEWS.forEach(v => $('#v-' + v).classList.toggle('on', v === m));
  $$('#modes button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === m)));
  $('#profileBtn').setAttribute('aria-pressed', String(m === 'profile'));
  $('#sysBtn').setAttribute('aria-pressed', String(m === 'system'));
  $('#prompt').hidden = (m === 'present' || m === 'system');
  const R = { board: renderBoard, matrix: renderMatrix, editor: renderEditor, present: renderPresent, profile: renderProfile, system: renderSystem };
  if (!rendered[m] || m === 'matrix' || m === 'editor' || m === 'present') { R[m](); rendered[m] = true; }
  updateScope();
  try { history.replaceState(null, '', '#' + m); } catch (e) {}
}

/* ---------- theme ---------- */
function applyTheme() {
  const r = document.documentElement;
  if (S.theme === 'system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', S.theme);
  $('#themeBtn').innerHTML = ic(S.theme === 'light' ? 'sun' : S.theme === 'dark' ? 'moon' : 'auto');
  $('#themeBtn').title = 'Theme: ' + S.theme;
  try { localStorage.setItem('dl-theme', S.theme); } catch (e) {}
  if (rendered.system) renderSystem();
}

/* ---------- prompt bar and scope ---------- */
function currentScope() {
  if (S.mode === 'editor') {
    const [t, o] = parseKey(S.ed.k);
    if (S.ed.scope === 'template') return { id: 'template', label: `Template · ${t.en} (all options)` };
    return S.ed.layer ? { id: 'layer', label: `Layer · ${S.ed.layer}` } : { id: 'diagram', label: `Diagram · ${t.en} × ${o.id}` };
  }
  if (S.mode === 'matrix') {
    if (S.selRow) return { id: 'row', label: `Row · ${T(S.selRow).en}` };
    if (S.sel.size === 1) { const [t, o] = parseKey([...S.sel][0]); return { id: 'cell', label: `Cell · ${t.en} × ${o.id}` }; }
    if (S.sel.size > 1) return { id: 'selection', label: `Selection · ${S.sel.size} cells` };
    return { id: 'matrix', label: 'Matrix · 68 cells' };
  }
  if (S.mode === 'board') return { id: 'board', label: 'Board · Circulation recipe' };
  if (S.mode === 'profile') return { id: 'profile', label: 'Style Profile · v3' };
  return { id: 'none', label: '' };
}
function updateScope() { const s = currentScope(); $('#scopeChip').innerHTML = `${esc(s.label)} ${ic('chevd')}`; }
function scopeMenu() {
  const opts = S.mode === 'editor' ? [['layer', 'This layer'], ['diagram', 'This diagram'], ['template', 'Template, all 4 options'], ['matrix', 'Whole matrix']]
    : S.mode === 'matrix' ? [['cell', 'Selected cells'], ['row', 'Selected row'], ['matrix', 'Whole matrix']] : [['board', 'Board']];
  openPop($('#scopeChip'), `<div class="menu">${opts.map(o => `<button data-s="${o[0]}">${o[1]}</button>`).join('')}</div><p class="faint" style="margin:6px 8px 2px;font-size:11.5px;max-width:260px">The prompt acts on this scope. It is always shown before anything runs.</p>`, el => {
    $$('button', el).forEach(b => b.onclick = () => {
      const s = b.dataset.s;
      if (S.mode === 'editor') { S.ed.scope = s === 'template' ? 'template' : 'instance'; if (s === 'diagram') S.ed.layer = null; if (s === 'matrix') { setMode('matrix'); S.sel.clear(); S.selRow = null; renderMatrix(); } else renderEditor(); }
      if (S.mode === 'matrix') { if (s === 'matrix') { S.sel.clear(); S.selRow = null; } if (s === 'row' && !S.selRow) S.selRow = 'circ'; refreshSel(); }
      updateScope(); closePop();
    });
  }, 'above');
}
function onPrompt(text) {
  const sc = currentScope();
  const pr = $('#prompt'); pr.classList.add('busy');
  if (S.mode === 'editor') return editorPrompt(text, () => pr.classList.remove('busy'));
  setTimeout(() => {
    pr.classList.remove('busy');
    if (S.mode === 'matrix') {
      if (sc.id === 'row' || /thick|colou?r|width|weight/i.test(text)) {
        const t = T(S.selRow || 'circ');
        if (/thick|width|weight/i.test(text)) { const old = TOK.routeW; TOK.routeW = Math.min(8, TOK.routeW + 1); S.tokRev++; pushHistory('Template stroke width', () => { TOK.routeW = old; S.tokRev++; renderMatrix(); }); }
        renderMatrix();
        toast(`Template edit on <b>${t.en}</b>: 4 instances updated. Cells with their own override kept it.`, ['Undo', undo]);
      } else toast(`Planned ${3 + text.length % 4} operations for <b>${esc(sc.label)}</b>. Review the diff before it runs.`);
    } else if (S.mode === 'board') toast('Proposed slot assignments for 4 options: page 3 looks like the Level 0 plan. <b>Review</b> in the inputs frame.');
    else if (S.mode === 'profile') toast('Drafted rule “Legend sits bottom-right inside the margin”. It waits for your approval in the ledger.');
  }, 900);
}

/* ---------- MATRIX ---------- */
function renderMatrix() {
  const v = $('#v-matrix');
  if (!v.dataset.built) {
    v.dataset.built = 1;
    v.innerHTML = `
      <div class="mx-bar">
        <h2>Matrix</h2><span class="muted num">17 diagrams × 4 options = 68</span>
        <div class="seg sm" id="mxFilter" role="group" aria-label="Filter">
          <button data-f="all" aria-pressed="true">All</button>
          <button data-f="attn" aria-pressed="false">Needs attention <span class="num" id="cntAttn"></span></button>
          <button data-f="approved" aria-pressed="false">Approved <span class="num" id="cntOk"></span></button>
        </div>
        <span class="spacer"></span>
        <button class="btn ghost sm" id="mxCompare">${ic('compare')}Compare row</button>
        <button class="btn ghost sm" id="mxDensity" aria-pressed="false">${ic('grid')}Compact</button>
        <button class="btn sm" id="mxExport">${ic('export')}Export</button>
        <button class="btn primary sm" id="mxRun">${ic('play')}<span id="mxRunLbl">Run</span></button>
      </div>
      <div class="mx-main"><div class="mx-scroll" id="mxScroll"><div class="mx-grid" id="mxGrid" role="grid" aria-label="Templates by options"></div></div>
      <aside class="panel mx-insp" id="mxInsp" aria-label="Cell inspector"></aside></div>`;
    $$('#mxFilter button').forEach(b => b.onclick = () => { S.filter = b.dataset.f; $$('#mxFilter button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); applyFilter(); });
    $('#mxDensity').onclick = e => { S.compact = !S.compact; e.currentTarget.setAttribute('aria-pressed', String(S.compact)); $('#mxGrid').classList.toggle('compact', S.compact); };
    $('#mxRun').onclick = e => runPrompt(e.currentTarget);
    $('#mxExport').onclick = e => openPop(e.currentTarget, `<div class="menu">
      <button data-x="matrix">${ic('matrix')}Whole matrix <span class="hint">68 files</span></button>
      <button data-x="row">${ic('chev')}Selected row <span class="hint">4 files</span></button>
      <button data-x="col">${ic('chevd')}Option column <span class="hint">17 files</span></button></div>
      <div class="sec" style="padding:8px 8px 4px"><span class="eyebrow">Naming pattern</span><span class="mono">{project}_{option}_{nn}_{diagram}</span><span class="faint mono">RCQ_A_04_circulation.pdf</span></div>`, el => $$('button', el).forEach(b => b.onclick = () => { closePop(); toast(`Export queued: layered PDF + SVG, organised by option. A checker re-opens every PDF and writes a report next to it.`); }));
    $('#mxCompare').onclick = () => { const t = S.selRow || (S.sel.size ? [...S.sel][0].split(':')[0] : 'circ'); S.pr.sub = 'loupe'; S.pr.compare = t; setMode('present'); };
    const grid = $('#mxGrid');
    grid.addEventListener('click', e => {
      const cell = e.target.closest('.cell'), rh = e.target.closest('.mx-rowh'), ch = e.target.closest('.mx-colh');
      const act = e.target.closest('[data-act]');
      if (act) {
        e.stopPropagation(); const a = act.dataset.act, id = act.dataset.id;
        if (a === 'runrow') runCells(OPTIONS.map(o => id + ':' + o.id));
        if (a === 'runcol') runCells(TEMPLATES.map(t => t.id + ':' + id));
        if (a === 'anchor') { CELLS[id].status = 'ready'; CELLS[id].reason = ''; updateCell(id); toast('Anchor “roof-garden” placed on Option D. The cell is ready to run.'); }
        return;
      }
      if (cell) { const k = cell.dataset.k; if (e.shiftKey || e.metaKey || e.ctrlKey) { S.sel.has(k) ? S.sel.delete(k) : S.sel.add(k); } else { S.sel = new Set([k]); } S.selRow = null; refreshSel(); }
      else if (rh) { const id = rh.dataset.t; S.selRow = S.selRow === id ? null : id; S.sel = S.selRow ? new Set(OPTIONS.map(o => id + ':' + o.id)) : new Set(); refreshSel(); }
      else if (ch) { const id = ch.dataset.o; S.selRow = null; S.sel = new Set(TEMPLATES.map(t => t.id + ':' + id)); refreshSel(); }
    });
    grid.addEventListener('dblclick', e => { const cell = e.target.closest('.cell'); if (cell) openEditor(cell.dataset.k); });
    grid.addEventListener('keydown', e => { const card = e.target.closest('.card'); if (card && e.key === 'Enter') openEditor(card.closest('.cell').dataset.k); });
  }
  const g = $('#mxGrid');
  let h = `<div class="mx-corner">Templates ↓ · Options →</div>` + OPTIONS.map(colHead).join('');
  TEMPLATES.forEach(t => { h += rowHead(t) + OPTIONS.map(o => cellHtml(t, o)).join(''); });
  g.innerHTML = h;
  refreshSel(); applyFilter();
}
function colHead(o) {
  const ks = TEMPLATES.map(t => CELLS[t.id + ':' + o.id]);
  const n = s => ks.filter(c => c.status === s).length;
  const seg = [['approved', 'var(--ok)'], ['ready', 'var(--fg-3)'], ['review', 'var(--warn)'], ['stale', 'var(--stale)'], ['failed', 'var(--err)'], ['blocked', 'var(--err)']].map(([s, c]) => `<i style="width:${n(s) / 17 * 100}%;background:${c}"></i>`).join('');
  return `<div class="mx-colh" data-o="${o.id}" role="columnheader"><div class="row1">${optTag(o.id)}<span class="sub">${o.name} <span class="zh">${o.zh}</span></span><button class="ib sm act" data-act="runcol" data-id="${o.id}" title="Run all 17 diagrams for Option ${o.id}">${ic('play')}</button></div><div class="meter">${seg}</div><span class="sub num">${n('approved')} of 17 approved</span></div>`;
}
function rowHead(t) {
  const ovr = OPTIONS.reduce((a, o) => a + CELLS[t.id + ':' + o.id].ovr.length, 0);
  return `<div class="mx-rowh ${S.selRow === t.id ? 'sel' : ''}" data-t="${t.id}" role="rowheader"><div class="nm"><span class="n">${t.n}</span><span>${t.en}</span></div><span class="zh">${t.zh}</span><span class="brief">${esc(t.brief)}</span><div class="acts">${ovr ? `<span class="chip" title="Cells in this row with their own overrides">${ovr} override${ovr > 1 ? 's' : ''}</span>` : ''}<button class="ib sm act" data-act="runrow" data-id="${t.id}" title="Run this diagram for all 4 options">${ic('play')}</button></div></div>`;
}
function cellHtml(t, o) {
  const k = key(t, o), c = CELLS[k];
  let veil = '';
  if (c.status === 'blocked') veil = `<div class="veil block"><div><b>${esc(c.reason)}</b><br><button class="btn sm" style="margin-top:6px" data-act="anchor" data-id="${k}">${ic('anchor')}Place anchor</button></div></div>`;
  else if (c.status === 'stale') veil = `<div class="veil dim"><span>${esc(c.reason)}</span></div>`;
  else if (c.status === 'queued') veil = `<div class="veil dim"><span>Queued</span></div>`;
  else if (c.status === 'failed') veil = `<div class="veil" style="align-items:end;justify-items:start;padding:6px"><span class="pill err" style="background:#fff">1 layer failed</span></div>`;
  const badges = (c.ovr.length ? `<span class="badge o" title="Overrides stored on this instance only">${c.ovr.length} override${c.ovr.length > 1 ? 's' : ''}</span>` : '') + (c.edited ? `<span class="badge e" title="Manual edits layered on generated output">Edited</span>` : '');
  return `<div class="cell ${S.sel.has(k) ? 'sel' : ''}" data-k="${k}" role="gridcell"><div class="card" tabindex="0" aria-label="${esc(t.en)}, Option ${o.id}, ${ST[c.status].l}">${c.status === 'blocked' ? '' : thumb(t, o)}${veil}<div class="badges">${badges}</div>${c.status === 'running' ? `<div class="prog"><i style="width:${(c.p || 0) * 100}%"></i></div>` : ''}</div><div class="meta">${pill(c.status)}<span class="cost">${c.status === 'approved' || c.status === 'ready' ? (c.cached ? 'cached' : '$' + c.cost.toFixed(2)) : ''}</span></div></div>`;
}
function updateCell(k) {
  const el = $(`#mxGrid .cell[data-k="${k}"]`); if (!el) return;
  const [t, o] = parseKey(k); el.outerHTML = cellHtml(t, o);
  const ch = $(`#mxGrid .mx-colh[data-o="${o.id}"]`); if (ch) ch.outerHTML = colHead(o);
  applyFilter(); if (S.sel.has(k)) renderInspector();
}
function applyFilter() {
  const attn = s => ['review', 'failed', 'stale', 'blocked'].includes(s);
  let na = 0, nk = 0;
  Object.entries(CELLS).forEach(([k, c]) => {
    if (attn(c.status)) na++; if (c.status === 'approved') nk++;
    const el = $(`#mxGrid .cell[data-k="${k}"]`);
    if (el) el.classList.toggle('dimmed', S.filter === 'attn' ? !attn(c.status) : S.filter === 'approved' ? c.status !== 'approved' : false);
  });
  if ($('#cntAttn')) { $('#cntAttn').textContent = na; $('#cntOk').textContent = nk; }
}
function refreshSel() {
  $$('#mxGrid .cell').forEach(el => el.classList.toggle('sel', S.sel.has(el.dataset.k)));
  $$('#mxGrid .mx-rowh').forEach(el => el.classList.toggle('sel', el.dataset.t === S.selRow));
  const n = S.sel.size;
  if ($('#mxRunLbl')) $('#mxRunLbl').textContent = n ? `Run ${n === 1 ? 'cell' : n + ' cells'}` : 'Run all';
  renderInspector(); updateScope();
}
function renderInspector() {
  const p = $('#mxInsp'); if (!p) return;
  if (!S.sel.size) { p.classList.add('closed'); return; }
  p.classList.remove('closed');
  if (S.sel.size > 1) {
    const ks = [...S.sel], st = {};
    ks.forEach(k => st[CELLS[k].status] = (st[CELLS[k].status] || 0) + 1);
    p.innerHTML = `<div class="panel-h"><h3>${S.selRow ? T(S.selRow).en + ' · all options' : ks.length + ' cells selected'}</h3><button class="ib sm" id="inspX" aria-label="Close">${ic('x')}</button></div>
      <div class="panel-b"><div class="sec"><div style="display:flex;gap:6px;flex-wrap:wrap">${Object.entries(st).map(([s, n]) => pill(s).replace(ST[s].l, n + ' ' + ST[s].l.toLowerCase())).join('')}</div></div>
      ${S.selRow ? `<div class="sec"><span class="eyebrow">Template brief · applies to all 4</span><textarea class="input" rows="4" id="rowBrief">${esc(T(S.selRow).brief)}</textarea><span class="faint" style="font-size:11.5px">Editing the template updates every instance. Cells with their own override keep it and are flagged for review.</span></div>` : ''}
      <div class="sec"><button class="btn primary" id="inspRun">${ic('play')}Run ${ks.length} cells…</button><button class="btn" id="inspApprove">${ic('check')}Approve ready cells</button><button class="btn" id="inspCompare">${ic('compare')}Compare side by side</button></div></div>`;
    $('#inspRun').onclick = e => runPrompt(e.currentTarget);
    $('#inspApprove').onclick = () => { let n = 0; ks.forEach(k => { if (CELLS[k].status === 'ready') { CELLS[k].status = 'approved'; n++; updateCell(k); } }); toast(`${n} cells approved by FR`); };
    $('#inspCompare').onclick = () => { S.pr.sub = 'grid'; S.pr.only = ks; setMode('present'); };
    if ($('#rowBrief')) $('#rowBrief').onchange = e => { T(S.selRow).brief = e.target.value; const r = $(`.mx-rowh[data-t="${S.selRow}"] .brief`); if (r) r.textContent = e.target.value; OPTIONS.forEach(o => { const k = S.selRow + ':' + o.id; if (CELLS[k].status !== 'blocked') { CELLS[k].status = 'stale'; CELLS[k].reason = 'Template brief changed'; updateCell(k); } }); toast('Brief changed on the template. 4 cells marked stale: you choose when to re-run.', ['Run row', () => runCells(OPTIONS.map(o => S.selRow + ':' + o.id))]); };
    $('#inspX').onclick = () => { S.sel.clear(); S.selRow = null; refreshSel(); };
    return;
  }
  const k = [...S.sel][0], c = CELLS[k], [t, o] = parseKey(k);
  const finds = findingsFor(k);
  p.innerHTML = `<div class="panel-h"><h3>${t.en} × ${optTag(o.id)}</h3><button class="ib sm" id="inspX" aria-label="Close">${ic('x')}</button></div>
    <div class="panel-b">
      <div class="sec"><div class="card" style="border-radius:6px;overflow:hidden;cursor:pointer" id="inspThumb" title="Open in editor">${c.status === 'blocked' ? '<div style="aspect-ratio:420/297;display:grid;place-items:center" class="faint">No output yet</div>' : thumb(t, o)}</div>
        <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">${pill(c.status)}<span class="faint num" style="font-size:12px">v${c.ver} · ${c.status === 'approved' ? 'approved by FR' : 'not approved'}</span></div>
        ${c.reason ? `<div class="find"><span class="sev" style="background:var(--${c.status === 'stale' ? 'stale' : 'err'})"></span><span>${esc(c.reason)}</span><span></span></div>` : ''}
        <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn primary sm" id="inspOpen">${ic('editor')}Open in editor</button><button class="btn sm" id="inspRun">${ic('play')}Run</button>${c.status === 'ready' || c.status === 'review' ? `<button class="btn sm" id="inspAppr">${ic('check')}Approve</button>` : ''}</div></div>
      <div class="sec"><span class="eyebrow">Brief · from template</span><span class="muted" style="font-size:12.5px">${esc(t.brief)}</span>
        <label class="eyebrow" for="addendum">Option ${o.id} addendum</label><textarea class="input" rows="2" id="addendum" placeholder="Only for this option, e.g. “the route crosses the bridge”">${esc((c.ovr.find(x => x.kind === 'brief') || {}).val || '').replace(/^“|”$/g, '')}</textarea></div>
      <div class="sec"><div class="sec-h"><span class="eyebrow">Overrides on this cell · ${c.ovr.length}</span><button class="btn ghost sm" id="addOvr">${ic('plus')}Add</button></div>
        ${c.ovr.length ? c.ovr.map(x => `<div class="ovr-row"><span class="what">${esc(x.what)}</span><span style="display:flex;gap:2px"><button class="ib sm" data-push="${x.id}" title="Push to template: apply to all 4 options">${ic('push')}</button><button class="ib sm" data-reset="${x.id}" title="Reset to template value">${ic('undo')}</button></span><span class="vals">${esc(x.val)} · template ${esc(x.tpl)}</span></div>`).join('') : '<span class="faint" style="font-size:12px">This cell inherits everything from the template.</span>'}</div>
      <div class="sec"><div class="sec-h"><span class="eyebrow">Standards agent · ${finds.length}</span><span class="chip">Suggest mode</span></div>${finds.length ? finds.map(findHtml).join('') : '<span class="faint" style="font-size:12px">No findings against Style Profile v3.</span>'}</div>
      <div class="sec"><span class="eyebrow">Output</span><dl class="kv"><dt>Page</dt><dd>A3 landscape, 3 mm bleed</dd><dt>Presets</dt><dd>Layered PDF · SVG</dd><dt>File</dt><dd>RCQ_${o.id}_${t.n}_${t.en.toLowerCase().replace(/[^a-z]+/g, '-').replace(/-$/, '')}.pdf</dd><dt>Cost</dt><dd>$${c.cost.toFixed(2)} last run</dd></dl></div>
      <div class="sec"><span class="eyebrow">History</span>${[['v' + c.ver, c.status === 'approved' ? 'Approved by FR' : 'Generated in batch run', '2 h ago'], ['v' + (c.ver - 1), 'Manual edit · label moved', 'Yesterday'], ['v' + (c.ver - 2), 'Template brief changed', '28 Sep']].map(r => `<div style="display:flex;gap:8px;font-size:12px"><span class="mono" style="width:28px">${r[0]}</span><span style="flex:1">${r[1]}</span><span class="faint">${r[2]}</span></div>`).join('')}</div>
    </div>`;
  $('#inspX').onclick = () => { S.sel.clear(); refreshSel(); };
  $('#inspOpen').onclick = $('#inspThumb').onclick = () => openEditor(k);
  $('#inspRun').onclick = e => runPrompt(e.currentTarget, [k]);
  if ($('#inspAppr')) $('#inspAppr').onclick = () => { c.status = 'approved'; c.ver++; updateCell(k); toast(`Approved ${t.en} × ${o.id} as v${c.ver}`); };
  $('#addendum').onchange = e => {
    const v = e.target.value.trim(); c.ovr = c.ovr.filter(x => x.kind !== 'brief');
    if (v) c.ovr.push({ id: 'b' + Date.now(), what: 'Brief addendum', val: '“' + v + '”', tpl: '—', kind: 'brief' });
    updateCell(k); renderInspector(); toast(v ? 'Addendum stored on this cell only.' : 'Addendum removed.');
  };
  $$('[data-push]', p).forEach(b => b.onclick = () => { const x = c.ovr.find(q => q.id === b.dataset.push); c.ovr = c.ovr.filter(q => q !== x); OPTIONS.forEach(oo => bump(t.id + ':' + oo.id)); renderMatrix(); toast(`Pushed “${esc(x.what)}” to the template: all 4 options now use ${esc(x.val)}.`); });
  $$('[data-reset]', p).forEach(b => b.onclick = () => { const x = c.ovr.find(q => q.id === b.dataset.reset); c.ovr = c.ovr.filter(q => q !== x); if (x.kind === 'hidden' && S.hidden[k]) S.hidden[k].delete(x.layer); bump(k); updateCell(k); renderInspector(); toast(`Reset “${esc(x.what)}” to the template value.`); });
  $$('[data-fix]', p).forEach(b => b.onclick = () => { S.ed.fixed.add(b.dataset.fix); renderInspector(); toast('Fix applied as an edit op. Undo is available.'); });
  $('#addOvr').onclick = e => {
    const decl = NODE_TYPES.route;
    openPop(e.currentTarget, `<div style="display:grid;gap:8px;width:300px"><span class="eyebrow">Override a node parameter</span><span class="faint" style="font-size:12px">The same fields as the node card and the editor inspector, generated from one declaration.</span>${paramForm(decl, 'ov', NODE_VALS.n5)}<button class="btn primary sm" id="ovOk">Store on this cell</button></div>`, el => {
      wireParamForm(decl, 'ov', NODE_VALS.n5, () => {});
      $('#ovOk', el).onclick = () => { c.ovr.push({ id: 'p' + Date.now(), what: 'Route / Spline · width', val: $('#ov-width', el).value, tpl: '4 pt', kind: 'param' }); closePop(); updateCell(k); renderInspector(); toast('Override stored on this cell. The template is unchanged.'); };
    });
  };
}
function findingsFor(k) {
  const all = {
    'circ:A': [{ id: 'f1', sev: 'warn', t: 'Label “River plaza” is 5.5 pt.', r: 'Rule 3 · 6 pt minimum at print size', fix: 'Set to 6 pt' }, { id: 'f2', sev: 'warn', t: 'Legend overlaps the external route by 2.1 mm.', r: 'Rule 1 · circulation never under labels', fix: 'Move legend' }, { id: 'f3', sev: 'info', t: 'Two accent colours in use: red and blue.', r: 'Rule 2 · at most two accents', fix: '' }],
    'circ:C': [{ id: 'f4', sev: 'warn', t: 'Route crosses the bridge but the bridge is not an anchor.', r: 'Brief addendum', fix: 'Add anchor' }],
    'views:D': [{ id: 'f5', sev: 'warn', t: 'Two labels collide at the north-east corner.', r: 'Lint · label collisions', fix: 'Nudge labels' }],
    'keyed:B': [{ id: 'f6', sev: 'warn', t: 'Marker 3 has no list entry.', r: 'Rule 6 · category list in sync', fix: 'Add entry' }],
  };
  return (all[k] || (CELLS[k].status === 'review' ? [{ id: 'g' + k, sev: 'warn', t: 'Line weight 0.6 pt is not on the stroke scale.', r: 'Rule 4 · 0.25 / 0.5 / 1 / 2 / 4 pt', fix: 'Snap to 0.5 pt' }] : [])).filter(f => !S.ed.fixed.has(f.id));
}
const findHtml = f => `<div class="find"><span class="sev" style="background:var(--${f.sev === 'warn' ? 'warn' : 'info'})"></span><span>${esc(f.t)}<br><span class="rule">${esc(f.r)}</span></span>${f.fix ? `<button class="btn sm" data-fix="${f.id}">${esc(f.fix)}</button>` : '<span></span>'}</div>`;

/* ---------- batch run: estimate first, then a resumable queue with live progress ---------- */
function runPrompt(anchor, keys) {
  keys = keys || (S.sel.size ? [...S.sel] : Object.keys(CELLS));
  const runnable = keys.filter(k => CELLS[k].status !== 'blocked');
  const cached = runnable.filter(k => ['approved', 'ready'].includes(CELLS[k].status) && !CELLS[k].edited);
  const fresh = runnable.length - cached.length, cost = fresh * .62, mins = Math.max(1, Math.ceil(fresh * 34 / 6 / 60));
  const blocked = keys.length - runnable.length;
  openPop(anchor, `<div style="display:grid;gap:10px;width:280px">
    <b>Run ${runnable.length} cell${runnable.length === 1 ? '' : 's'}</b>
    <dl class="kv"><dt>Recompute</dt><dd>${fresh} cells</dd><dt>From cache</dt><dd>${cached.length} cells, inputs unchanged</dd><dt>Estimate</dt><dd>$${cost.toFixed(2)} · about ${mins} min</dd><dt>Budget left</dt><dd>$${(180 - 41.2).toFixed(2)} of $180</dd></dl>
    ${blocked ? `<span class="pill err">${blocked} blocked cell${blocked > 1 ? 's' : ''} skipped</span>` : ''}
    <span class="faint" style="font-size:11.5px">Jobs run on the server queue: closing the tab does not stop them.</span>
    <div style="display:flex;gap:6px;justify-content:flex-end"><button class="btn sm" id="rpNo">Cancel</button><button class="btn primary sm" id="rpGo">${ic('play')}Run</button></div></div>`, el => {
    $('#rpNo', el).onclick = closePop;
    $('#rpGo', el).onclick = () => { closePop(); runCells(runnable, new Set(cached)); };
  });
}
const RUN = { q: [], active: 0, total: 0, done: 0, spent: 0, timer: null, cached: new Set() };
function runCells(keys, cached) {
  keys = keys.filter(k => CELLS[k].status !== 'blocked' && CELLS[k].status !== 'running' && CELLS[k].status !== 'queued');
  if (!keys.length) return;
  cached = cached || new Set();
  keys.forEach(k => { CELLS[k].status = 'queued'; CELLS[k].p = 0; RUN.q.push(k); if (cached.has(k)) RUN.cached.add(k); updateCell(k); });
  RUN.total += keys.length; $('#runChip').hidden = false;
  if (!RUN.timer) RUN.timer = setInterval(tickRun, 110);
  updateRunChip();
}
function tickRun() {
  while (RUN.active < 6 && RUN.q.length) {
    const k = RUN.q.shift(), c = CELLS[k]; c.status = 'running'; c.p = 0; c.dur = RUN.cached.has(k) ? 4 : 9 + Math.random() * 14; RUN.active++; updateCell(k);
  }
  Object.entries(CELLS).forEach(([k, c]) => {
    if (c.status !== 'running') return;
    c.p = Math.min(1, c.p + 1 / c.dur);
    const bar = $(`#mxGrid .cell[data-k="${k}"] .prog i`); if (bar) bar.style.width = c.p * 100 + '%';
    if (c.p >= 1) {
      RUN.active--; RUN.done++;
      const wasCached = RUN.cached.delete(k);
      if (!wasCached) RUN.spent += c.cost;
      c.cached = wasCached; c.status = wasCached ? 'ready' : (Math.random() < .16 ? 'review' : 'ready'); c.reason = ''; c.ver++;
      if (k === 'exploded:D') c.status = 'review';
      bump(k); updateCell(k);
    }
  });
  updateRunChip();
  if (!RUN.q.length && !RUN.active) {
    clearInterval(RUN.timer); RUN.timer = null;
    const n = RUN.total, rev = Object.values(CELLS).filter(c => c.status === 'review').length;
    RUN.total = RUN.done = 0;
    setTimeout(() => { $('#runChip').hidden = true; }, 600);
    toast(`Run complete: ${n} cells, $${RUN.spent.toFixed(2)}. ${rev} need review.`, ['Show', () => { setMode('matrix'); $('#mxFilter [data-f="attn"]').click(); }]);
    RUN.spent = 0;
  }
}
function updateRunChip() {
  $('#runTxt').textContent = `Running ${RUN.done} of ${RUN.total} · $${RUN.spent.toFixed(2)}`;
  $('#runBar').style.width = (RUN.total ? RUN.done / RUN.total * 100 : 0) + '%';
}
