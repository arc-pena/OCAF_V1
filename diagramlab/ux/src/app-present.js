/* DiagramLab prototype — Present mode: Grid (G), Loupe (E), Slideshow (S) and Sheets, Lightroom-style.
   The chrome hides after 2 s without pointer movement so the diagrams sit alone on the neutral surround. */

S.pr = { sub: 'grid', group: 'diagram', size: 220, idx: 0, sel: null, full: false, presenter: false, sheetOpt: 'A', sheetSlots: ['site', 'circ', 'program', 'views', 'ground', 'roof'], gridOn: true, only: null, compare: null };
const NOTES = { circ: 'Start at the river plaza. The red route is the public promenade; it climbs the ramp and ends on the roof garden. Blue loops are the internal circuits on each roof.', views: 'Green corridors pull the park and the river into the site. Cyan arrows are the protected long views.', ground: 'Four program zones, three entrances by type, deliveries kept to the east edge.' };

function prItems() {
  let ks = [];
  if (S.pr.compare) { ks = OPTIONS.map(o => S.pr.compare + ':' + o.id); }
  else if (S.pr.only) ks = S.pr.only.slice();
  else TEMPLATES.forEach(t => OPTIONS.forEach(o => ks.push(key(t, o))));
  return ks.filter(k => CELLS[k].status !== 'blocked');
}
function renderPresent() {
  const v = $('#v-present');
  const sub = S.pr.sub, items = prItems();
  S.pr.idx = Math.min(S.pr.idx, items.length - 1);
  v.innerHTML = `<div class="pr-bar" role="toolbar" aria-label="Present">
      <div class="seg" id="prSub">${[['grid', 'Grid', 'G'], ['loupe', 'Loupe', 'E'], ['slides', 'Slideshow', 'S'], ['sheets', 'Sheets', 'B']].map(x => `<button data-sub="${x[0]}" aria-pressed="${sub === x[0]}">${ic(x[0] === 'slides' ? 'slides' : x[0] === 'sheets' ? 'sheet' : x[0])}${x[1]} <kbd>${x[2]}</kbd></button>`).join('')}</div>
      ${sub === 'grid' ? `<select class="input" id="prGroup" aria-label="Group by" style="width:auto"><option value="diagram"${S.pr.group === 'diagram' ? ' selected' : ''}>Group by diagram</option><option value="option"${S.pr.group === 'option' ? ' selected' : ''}>Group by option</option></select><input type="range" class="slider" id="prSize" min="140" max="420" value="${S.pr.size}" style="width:100px" aria-label="Thumbnail size">` : ''}
      ${sub === 'loupe' ? `<button class="btn sm" id="prFull">${S.pr.full ? 'Fit' : '100% print'} <kbd>Z</kbd></button>` : ''}
      ${sub === 'slides' ? `<button class="btn sm" id="prPres">${S.pr.presenter ? 'Audience view' : 'Presenter view'} <kbd>P</kbd></button>` : ''}
      ${sub === 'sheets' ? `<div class="seg sm" id="prSheetOpt">${OPTIONS.map(o => `<button data-o="${o.id}" aria-pressed="${S.pr.sheetOpt === o.id}">${optTag(o.id, false)}</button>`).join('')}</div><button class="btn sm" id="prGridT">${S.pr.gridOn ? 'Hide' : 'Show'} grid</button><button class="btn sm" id="prSheetPdf">${ic('export')}Sheet PDF</button>` : ''}
      ${S.pr.compare || S.pr.only ? `<button class="btn sm" id="prAll">Show all 68</button>` : ''}
      <button class="ib" id="prExit" title="Exit (Esc)" aria-label="Exit present">${ic('x')}</button></div>
    <div class="pr-body" id="prBody"></div>`;
  const body = $('#prBody');
  if (sub === 'grid') body.innerHTML = gridHtml(items);
  if (sub === 'loupe') body.innerHTML = loupeHtml(items);
  if (sub === 'slides') body.innerHTML = slideHtml(items);
  if (sub === 'sheets') body.innerHTML = sheetHtml();
  hydrateIcons(v);
  $$('#prSub button').forEach(b => b.onclick = () => { S.pr.sub = b.dataset.sub; renderPresent(); });
  $('#prExit').onclick = () => setMode(S.prevMode === 'present' ? 'matrix' : S.prevMode);
  if ($('#prAll')) $('#prAll').onclick = () => { S.pr.compare = S.pr.only = null; renderPresent(); };
  if ($('#prGroup')) $('#prGroup').onchange = e => { S.pr.group = e.target.value; renderPresent(); };
  if ($('#prSize')) $('#prSize').oninput = e => { S.pr.size = +e.target.value; $$('.pr-tiles').forEach(t => t.style.setProperty('--tile', S.pr.size + 'px')); };
  if ($('#prFull')) $('#prFull').onclick = () => { S.pr.full = !S.pr.full; renderPresent(); };
  if ($('#prPres')) $('#prPres').onclick = () => { S.pr.presenter = !S.pr.presenter; renderPresent(); };
  if ($('#prGridT')) $('#prGridT').onclick = () => { S.pr.gridOn = !S.pr.gridOn; renderPresent(); };
  if ($('#prSheetPdf')) $('#prSheetPdf').onclick = () => toast('Sheet PDF queued: A1, 6 diagrams placed as vectors, one layer group per diagram.');
  $$('#prSheetOpt button').forEach(b => b.onclick = () => { S.pr.sheetOpt = b.dataset.o; renderPresent(); });
  $$('.pr-tile', body).forEach(el => {
    el.onclick = () => { S.pr.sel = el.dataset.k; S.pr.idx = items.indexOf(el.dataset.k); $$('.pr-tile').forEach(x => x.classList.toggle('sel', x === el)); };
    el.ondblclick = () => { S.pr.idx = items.indexOf(el.dataset.k); S.pr.sub = 'loupe'; renderPresent(); };
  });
  $$('.pr-strip button', body).forEach(b => b.onclick = () => { S.pr.idx = +b.dataset.i; renderPresent(); });
  if (sub === 'sheets') wireSheets();
  if (sub === 'loupe') { const on = $('.pr-strip button.on'); if (on) on.scrollIntoView({ block: 'nearest', inline: 'center' }); }
  idleChrome();
}
function tile(k) {
  const [t, o] = parseKey(k), c = CELLS[k];
  return `<div class="pr-tile ${S.pr.sel === k ? 'sel' : ''}" data-k="${k}" tabindex="0" aria-label="${esc(t.en)} Option ${o.id}">${thumb(t, o)}${c.flag ? `<span class="flag" style="background:${c.flag}"></span>` : ''}<div class="ov"><span class="mono">${t.n}</span><span>${optTag(o.id, false)}</span><span class="stars">${'★'.repeat(c.stars)}${'☆'.repeat(5 - c.stars)}</span></div></div>`;
}
function gridHtml(items) {
  let groups;
  if (S.pr.compare || S.pr.only) groups = [{ h: S.pr.compare ? `${T(S.pr.compare).en} · all options at the same scale` : `${items.length} selected`, ks: items }];
  else if (S.pr.group === 'diagram') groups = TEMPLATES.map(t => ({ h: `<span class="mono">${t.n}</span> ${t.en} <span class="zh">${t.zh}</span>`, ks: items.filter(k => k.startsWith(t.id + ':')) }));
  else groups = OPTIONS.map(o => ({ h: `${optTag(o.id)} ${o.name}`, ks: items.filter(k => k.endsWith(':' + o.id)) }));
  return `<div class="pr-grid">${groups.map(g => `<div class="pr-group"><h4>${g.h}</h4><div class="pr-tiles" style="--tile:${S.pr.size}px">${g.ks.map(tile).join('')}</div></div>`).join('')}</div>`;
}
function loupeHtml(items) {
  const k = items[S.pr.idx], [t, o] = parseKey(k), c = CELLS[k];
  return `<div class="pr-loupe"><div class="pr-stagewrap ${S.pr.full ? 'full' : ''}"><div class="paper">${thumb(t, o)}</div>
    <div class="pr-info"><span class="mono">${S.pr.idx + 1} / ${items.length}</span> · ${t.en} · Option ${o.id} · ${'★'.repeat(c.stars)}${'☆'.repeat(5 - c.stars)} · ←→ next · ↑↓ other options · 1–5 rate</div></div>
    <div class="pr-strip">${items.map((x, i) => { const [tt, oo] = parseKey(x); return `<button data-i="${i}" class="${i === S.pr.idx ? 'on' : ''}" aria-label="${esc(tt.en)} ${oo.id}">${thumb(tt, oo)}</button>`; }).join('')}</div></div>
    <aside class="pr-side"><span class="eyebrow">${t.n} · ${t.zh}</span><b style="font-size:14px">${t.en} × Option ${o.id}</b><span style="color:var(--present-fg-2)">${esc(t.brief)}</span><span>${pill(c.status)}</span><span class="eyebrow">Comments · 1</span><div style="display:flex;gap:8px"><span class="avatar sm" style="background:var(--opt-a)">MK</span><span>Legend could sit one module lower on every sheet.</span></div></aside>`;
}
function slideHtml(items) {
  const k = items[S.pr.idx], [t, o] = parseKey(k), nx = items[(S.pr.idx + 1) % items.length], [t2, o2] = parseKey(nx);
  if (S.pr.presenter) return `<div class="pr-presenter"><div class="now"><span class="eyebrow" style="color:var(--present-fg-2)">Now · ${S.pr.idx + 1} of ${items.length}</span><div class="paper" style="background:#fff">${thumb(t, o)}</div></div>
    <div style="display:grid;gap:16px;align-content:start"><span class="eyebrow" style="color:var(--present-fg-2)">Next</span><div style="background:#fff">${thumb(t2, o2)}</div><div class="notes"><span class="eyebrow" style="color:var(--present-fg-2)">Notes</span>${esc(NOTES[t.id] || t.brief)}<span class="mono" style="color:var(--present-fg-2)">00:04:12 elapsed</span></div></div></div>`;
  return `<div class="pr-slide"><div class="paper" id="slidePaper">${thumb(t, o)}</div><div class="ctr">${S.pr.idx + 1} / ${items.length} · ← → · P presenter · Esc</div></div>`;
}
function sheetHtml() {
  const o = O(S.pr.sheetOpt);
  const film = TEMPLATES.map(t => `<div class="it" draggable="true" data-t="${t.id}" title="${esc(t.en)}"><span>${t.n}</span>${thumb(t, o)}</div>`).join('');
  const slots = S.pr.sheetSlots.map((tid, i) => { const t = T(tid); return `<div class="slot" data-i="${i}"><div class="im">${t && CELLS[key(t, o)].status !== 'blocked' ? thumb(t, o) : ''}</div><div class="cap">${t ? `<b>${t.n}</b><span>${t.en}</span><span class="zh" style="color:#777">${t.zh}</span>` : ''}</div></div>`; }).join('');
  return `<div class="pr-sheets"><div class="pr-film" aria-label="Filmstrip: drag onto a sheet slot">${film}</div><div class="pr-sheetwrap"><div class="a1 ${S.pr.gridOn ? 'grid-on' : ''}" id="a1">
    <div class="hd"><span class="zh">滨水文化街区 · 方案${o.id} · 分析图 2/4</span><span>Riverside Cultural Quarter · Option ${o.id} · Analysis 2/4</span></div>
    <div class="slots">${slots}</div><div class="ft"><span>A1 · 841 × 594 mm · 12-column grid, 10 mm gutters</span><span>RCQ-${o.id}-S02</span></div></div></div></div>`;
}
function wireSheets() {
  $$('.pr-film .it').forEach(it => it.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', it.dataset.t); }));
  $$('.a1 .slot').forEach(sl => {
    sl.addEventListener('dragover', e => { e.preventDefault(); sl.classList.add('over'); });
    sl.addEventListener('dragleave', () => sl.classList.remove('over'));
    sl.addEventListener('drop', e => { e.preventDefault(); const tid = e.dataTransfer.getData('text/plain'); if (!T(tid)) return; S.pr.sheetSlots[+sl.dataset.i] = tid; renderPresent(); toast(`Placed ${T(tid).en}. The same layout repeats on Options A–D.`); });
  });
}
let idleT = null;
function idleChrome() {
  const v = $('#v-present'); v.classList.remove('idle'); clearTimeout(idleT);
  if (S.mode === 'present' && S.pr.sub !== 'sheets' && S.pr.sub !== 'grid') idleT = setTimeout(() => v.classList.add('idle'), 2200);
}
function presentKey(e) {
  const items = prItems(), n = items.length, sub = S.pr.sub;
  const kk = e.key.toLowerCase();
  if (kk === 'g') { S.pr.sub = 'grid'; renderPresent(); return true; }
  if (kk === 'e') { S.pr.sub = 'loupe'; renderPresent(); return true; }
  if (kk === 's') { S.pr.sub = 'slides'; renderPresent(); return true; }
  if (kk === 'b') { S.pr.sub = 'sheets'; renderPresent(); return true; }
  if (kk === 'escape') { if (sub !== 'grid') { S.pr.sub = 'grid'; renderPresent(); } else setMode(S.prevMode === 'present' ? 'matrix' : S.prevMode); return true; }
  if (sub === 'loupe' && kk === 'z') { S.pr.full = !S.pr.full; renderPresent(); return true; }
  if (sub === 'slides' && kk === 'p') { S.pr.presenter = !S.pr.presenter; renderPresent(); return true; }
  if (kk === 'arrowright' || kk === 'arrowleft') {
    S.pr.idx = (S.pr.idx + (kk === 'arrowright' ? 1 : -1) + n) % n;
    if (sub === 'slides' && !S.pr.presenter) { const p = $('#slidePaper'); if (p) { p.style.opacity = 0; setTimeout(renderPresent, 180); return true; } }
    if (sub === 'grid') { S.pr.sel = items[S.pr.idx]; $$('.pr-tile').forEach(x => x.classList.toggle('sel', x.dataset.k === S.pr.sel)); return true; }
    renderPresent(); return true;
  }
  if ((kk === 'arrowup' || kk === 'arrowdown') && sub !== 'grid') {
    const [t, o] = parseKey(items[S.pr.idx]); const oi = OPTIONS.indexOf(o), no = OPTIONS[(oi + (kk === 'arrowdown' ? 1 : 3)) % 4];
    const j = items.indexOf(key(t, no)); if (j >= 0) { S.pr.idx = j; renderPresent(); } return true;
  }
  if (/^[0-5]$/.test(kk)) { const k = sub === 'grid' ? S.pr.sel : items[S.pr.idx]; if (k) { CELLS[k].stars = +kk; renderPresent(); toast(`Rated ${'★'.repeat(+kk) || 'no stars'}`); } return true; }
  if (/^[6-9]$/.test(kk)) { const k = sub === 'grid' ? S.pr.sel : items[S.pr.idx]; if (k) { CELLS[k].flag = { 6: '#E5484D', 7: '#F5B400', 8: '#30A46C', 9: '#2D5BFF' }[kk]; renderPresent(); } return true; }
  return false;
}
