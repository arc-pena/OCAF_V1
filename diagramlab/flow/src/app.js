/* DiagramLab Flow — the app. Five steps, one pipeline per diagram, every change through applyOps(). */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const IC = {
  logo: '<path d="M4 18L10 6l4 8 2-3 4 7z" fill="currentColor" stroke="none"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>', auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
  eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>', eyeoff: '<path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7a9.6 9.6 0 0 0 5.4-1.6"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>', up: '<path d="M12 19V5M6 11l6-6 6 6"/>', down: '<path d="M12 5v14M6 13l6 6 6-6"/>', plus: '<path d="M12 5v14M5 12h14"/>',
  sparkle: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>', upload: '<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>',
  swap: '<path d="M7 7h11l-3-3M17 17H6l3 3"/>', pin: '<path d="M12 21s-6-5.7-6-11a6 6 0 0 1 12 0c0 5.3-6 11-6 11z"/><circle cx="12" cy="10" r="2"/>', undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>', check: '<path d="M5 12l5 5 9-10"/>', send: '<path d="M5 12h13M13 6l6 6-6 6"/>',
};
const ic = n => `<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n] || ''}</svg>`;
function hydrate(r = document) { $$('[data-ic]', r).forEach(el => { if (!el.firstChild) el.innerHTML = ic(el.dataset.ic); }); }

/* ---------- state ---------- */
const OPTS = RMUH_OPTIONS;
const ST = { step: 1, optId: 'flux', viewSel: 'flux-gf', anchorSel: null, placing: null, xl: XL_DEFAULT, brief: '', D: {}, dId: 'D07', node: null, layerSel: null, undo: [], busy: false, exported: {}, checked: {} };
const opt = () => OPTS.find(o => o.id === ST.optId);
const cur = () => ST.D[ST.dId];
const row = id => ST.xl.diagrams.find(r => r.id === id);
let SEQ = 0; const uid = p => p + (++SEQ).toString(36);
function toast(html, action) { const el = document.createElement('div'); el.className = 'toast'; el.innerHTML = `<span>${html}</span>`; if (action) { const b = document.createElement('button'); b.textContent = action[0]; b.onclick = () => { action[1](); el.remove(); }; el.appendChild(b); } const host = $('#toasts'); host.appendChild(el); while (host.children.length > 2) host.firstChild.remove(); setTimeout(() => el.remove(), 5200); }
function save() { try { localStorage.setItem('dl-flow', JSON.stringify({ D: ST.D, brief: ST.brief.slice(0, 60000), anchors: OPTS.map(o => ({ id: o.id, name: o.name, tag: o.tag, views: o.views.filter(v => !v.url.startsWith('data:')).map(v => ({ id: v.id, name: v.name, anchors: v.anchors, loop: v.loop })) })), xl: ST.xl.source === XL_DEFAULT.source ? null : ST.xl, exported: ST.exported, checked: ST.checked })); } catch (e) {} }
function load() {
  try {
    const s = JSON.parse(localStorage.getItem('dl-flow') || 'null'); if (!s) return;
    ST.D = s.D || {}; ST.brief = s.brief || ''; ST.exported = s.exported || {}; ST.checked = s.checked || {}; if (s.xl) ST.xl = s.xl;
    (s.anchors || []).forEach(a => { const o = OPTS.find(x => x.id === a.id); if (!o) return; o.name = a.name || o.name; o.tag = a.tag || o.tag; a.views.forEach(av => { const v = o.views.find(x => x.id === av.id); if (v) { v.name = av.name; if (av.anchors) v.anchors = av.anchors; if (av.loop) v.loop = av.loop; } }); });
  } catch (e) {}
}

/* ---------- diagrams from recipes ---------- */
function mkLayer(type, extra = {}) { const T = LTYPES[type]; return Object.assign({ id: uid('L'), type, name: T.name, on: true, color: T.color, width: T.width, dash: !!T.dash, dx: 0, dy: 0 }, extra); }
function mkBg(kind, prompt) { return { id: uid('B'), kind, label: BG_KINDS[kind].label, prompt: prompt || '', on: true }; }
function makeDiagram(id, plan, by) {
  const r = row(id) || { id, name: id, show: '', succeeds: '' };
  return { id, name: r.name, show: r.show, succeeds: r.succeeds, read: plan.background || 'GF plan', readId: {}, bg: (plan.bg || []).map(k => mkBg(k)), layers: (plan.layers || []).map(t => mkLayer(t)), by, reasoning: plan.reasoning || [plan.why].filter(Boolean), risks: plan.risks || [], prompts: [] };
}
function recipeFor(id) { const r = RECIPES[id] || { bg: ['wash'], layers: ['site', 'legend'], why: 'Generic start: washed plan with the site boundary.' }; return { background: 'GF plan', bg: r.bg, layers: r.layers, why: r.why }; }
function setStatus(id, optName, s) { const r = row(id); if (!r) return; const order = ['Not started', 'In progress', 'Drawn', 'Checked']; if (order.indexOf(s) > order.indexOf(r.status[optName] || 'Not started')) r.status[optName] = s; }
function snapshot(label) { ST.undo.push({ label, d: JSON.stringify(ST.D) }); if (ST.undo.length > 60) ST.undo.shift(); }
function undo() { const u = ST.undo.pop(); if (!u) return toast('Nothing to undo'); ST.D = JSON.parse(u.d); renderAll(); toast(`Undid: ${esc(u.label)}`); }

/* ---------- the one chokepoint for edits ---------- */
function applyOps(d, ops, label) {
  snapshot(label || 'Edit'); const done = [];
  const findL = ref => { if (!ref) return null; const r = String(ref).toLowerCase(); return d.layers.find(L => L.id === ref) || d.layers.find(L => L.type === r) || d.layers.find(L => L.name.toLowerCase().includes(r)); };
  for (const op of ops || []) {
    try {
      if (op.op === 'bg' && BG_KINDS[op.kind]) { if (op.kind !== 'camera' && op.kind !== 'restyle' && d.bg.some(b => b.kind === op.kind && b.on)) { done.push(`${BG_KINDS[op.kind].label} is already on`); continue; } d.bg.push(mkBg(op.kind, op.prompt)); done.push(`Background: ${BG_KINDS[op.kind].label}`); }
      else if (op.op === 'background' && op.view) { const ok = opt().views.some(v => v.name === op.view); if (ok) { d.read = op.view; done.push(`Background image: ${op.view}`); } }
      else if (op.op === 'add' && LTYPES[op.type]) {
        const ex = { };
        if (op.type === 'text') { ex.text = op.text || 'Label'; ex.at = op.at || [200, 40]; ex.name = 'Text · ' + (op.text || 'Label').slice(0, 24); }
        if (op.type === 'arrow') { ex.from = op.from || [120, 200]; ex.to = op.to || [220, 140]; }
        if (op.color) ex.color = op.color;
        const L = mkLayer(op.type, ex); const li = d.layers.findIndex(x => x.type === 'legend');
        if (li >= 0 && op.type !== 'legend') d.layers.splice(li, 0, L); else d.layers.push(L);
        ST.layerSel = L.id; done.push(`Added ${L.name}`);
      } else {
        const L = findL(op.layer); if (!L) continue;
        if (op.op === 'style') { if (op.color) L.color = op.color; if (op.width) L.width = +op.width; if (op.dash != null) L.dash = !!op.dash; done.push(`Restyled ${L.name}`); }
        if (op.op === 'move') { L.dx = (L.dx || 0) + (+op.dx || 0); L.dy = (L.dy || 0) + (+op.dy || 0); done.push(`Moved ${L.name}`); }
        if (op.op === 'hide') { L.on = false; done.push(`Hid ${L.name}`); }
        if (op.op === 'show') { L.on = true; done.push(`Showed ${L.name}`); }
        if (op.op === 'remove') { d.layers = d.layers.filter(x => x !== L); done.push(`Removed ${L.name}`); }
        if (op.op === 'text' && op.text) { L.text = op.text; done.push(`Changed text of ${L.name}`); }
      }
    } catch (e) { done.push(`Skipped one step: ${e.message}`); }
  }
  if (!done.length) ST.undo.pop();
  save(); return done;
}

/* ---------- Claude (the sample capability) with a built-in fallback ---------- */
let AI = null, DL = null;
const capReady = (async () => { try { if (window.claude && window.claude.use) { [AI, DL] = await Promise.all([claude.use('sample'), claude.use('downloads')]); } } catch (e) {} setAiChip(); })();
function setAiChip() { const c = $('#aiChip'); c.className = 'chip ' + (AI ? 'ai' : 'offline'); $('#aiTxt').textContent = AI ? 'Claude: connected' : 'Claude: built-in rules'; c.title = AI ? 'Proposals and prompts are answered by Claude.' : 'Claude is not reachable from this view, so proposals come from the built-in recipes and prompts from a keyword parser.'; }
function briefContext(o) {
  return `PROJECT: ${PROJECT.full}. ${PROJECT.stage}.
KEY FIGURES:\n${PROJECT.facts.map(f => '- ' + f[0] + ': ' + f[1]).join('\n')}
CLIENT STEER (Meeting 3):\n${PROJECT.steer.map(s => '- ' + s).join('\n')}
OPTION ${o.name} · ${o.tag}: ${o.idea} Audit: wow ${o.audit.wow}, day-one ${o.audit.day1}, "${o.audit.verdict}". Levels ${o.audit.levels}; GF+L1+½L2 ${o.audit.gla.filter(x => x != null).reduce((a, b) => a + b, 0).toFixed(0)}k m² of 200k; anchors ${o.audit.anchorsM} m apart; block depth ${o.audit.depth}; GF junctions ${o.audit.junctions}; ULO ${o.audit.ulo}; mix ${o.audit.mix}; PUA route passes a parking deck, ≈${o.audit.puaM} m to a shopfront.
${ST.brief ? 'COMPETITION BRIEF (pasted by the user, may be partial):\n' + ST.brief.slice(0, 40000) : ''}`;
}
function rowContext(id) {
  const r = row(id), cr = ST.xl.criteria.filter(c => c.proof.includes(id));
  return `DIAGRAM ${id} · ${r.name}\nWhat to show: ${r.show}\nSucceeds when: ${r.succeeds}\nScored under (Handbook §5):\n${cr.map(c => `- ${c.id} ${c.domain} / ${c.name}: ${c.question} Look for: ${c.look}`).join('\n') || '- (no criterion names this diagram)'}`;
}
const MENU = () => `Background steps allowed (kind): ${Object.keys(BG_KINDS).join(', ')}.\nOverlay layers allowed (type): ${Object.entries(LTYPES).map(([k, v]) => `${k} (${v.name})`).join('; ')}.\nBackground images available: ${[...new Set(OPTS.flatMap(o => o.views.filter(v => v.kind === 'view').map(v => v.name)))].join(', ')}. Overlays only draw on views that have anchors placed; today that is "GF plan".`;
function cleanPlan(p) {
  const views = new Set(OPTS.flatMap(o => o.views.map(v => v.name)));
  return { background: views.has(p.background) ? p.background : 'GF plan', bg: (p.bg || []).filter(k => BG_KINDS[k] && k !== 'camera' && k !== 'restyle').slice(0, 3), layers: [...new Set((p.layers || []).filter(t => LTYPES[t]))].slice(0, 6), reasoning: (p.reasoning || []).map(String).slice(0, 8), risks: (p.risks || []).map(String).slice(0, 5) };
}
async function propose(id) {
  const o = opt();
  if (!AI) { const r = recipeFor(id); return Object.assign(cleanPlan({ background: r.background, bg: r.bg, layers: r.layers }), { reasoning: [r.why], by: 'built-in recipe' }); }
  const prompt = `You plan architectural competition diagrams for an architect. Propose the first iteration of ONE diagram as a pipeline.\n\n${briefContext(o)}\n\n${rowContext(id)}\n\n${MENU()}\n\nReply with only JSON: {"background":"GF plan","bg":["wash"],"layers":["site","loop","legend"],"reasoning":["one sentence per point, each naming the criterion id (e.g. C1.04) or the client steer it serves"],"risks":["what this diagram will expose about option ${o.name}, using the audit numbers"]}. Use 2–5 layers, end with "legend" when the diagram has a key. Write plainly.`;
  const r = await AI.json(prompt, { modelTier: 'default' });
  return Object.assign(cleanPlan(r), { by: 'Claude' });
}
async function proposeAll() {
  const o = opt();
  const rows = ST.xl.diagrams.map(r => rowContext(r.id)).join('\n\n');
  const prompt = `You plan a set of architectural competition diagrams. Propose the first iteration of EVERY diagram below as a pipeline, driven by each row of the team's Excel tracker.\n\n${briefContext(o)}\n\n${rows}\n\n${MENU()}\n\nReply with only JSON: {"diagrams":[{"id":"D01","background":"GF plan","bg":["wash"],"layers":["site","parti","legend"],"reasoning":["two short sentences naming the criteria ids served"]}]} with one entry per diagram id.`;
  const r = await AI.json(prompt, { modelTier: 'default' });
  return (r.diagrams || []).map(x => Object.assign(cleanPlan(x), { id: x.id, by: 'Claude' }));
}
/* Built-in parser for prompts when Claude is not reachable. Covers the common verbs; anything else is said plainly. */
const COLORS = { red: '#D7261E', blue: '#1F5FAE', green: '#2E7D32', orange: '#E07B00', black: '#111111', grey: '#777777', gray: '#777777', purple: '#7A4FD0', magenta: '#D6338A', pink: '#D6338A', cyan: '#14AECB', yellow: '#F2C230', teal: '#2A9D8F' };
const TYPEWORDS = [['loop', /loop|retail diagram|dumbbell|figure.?8/], ['journeys', /journey|footfall|route|node/], ['parking', /parking|bays|car park/], ['frontage', /frontage|active|passive|folly/], ['districts', /district|precinct/], ['ulo', /\bulo\b/], ['arrival', /arrival|mode|taxi|pudo|vip/], ['servicing', /servic|boh|dock|core/], ['office', /office/], ['hotels', /hotel|keys/], ['climate', /shade|climate|cool|summer/], ['clock', /hours|clock|ramadan|calendar|late/], ['phasing', /phase/], ['gla', /\bgla\b|area|m²|m2/], ['legend', /legend|key\b/], ['site', /site|boundary|red line/], ['edges', /edge/], ['parti', /parti|spine/], ['aspirations', /aspiration|wish/]];
function parsePrompt(text, scope) {
  const t = text.toLowerCase(), ops = [];
  if (scope === 'bg') {
    const map = [['wash', /wash|fade|lighter|lighten|faint/], ['desaturate', /black and white|b&w|grey|gray|mono|desat/], ['ghost', /ghost|white model/], ['figure', /figure.?ground|silhouette/], ['night', /night|dark/], ['warm', /warm|sunset|golden/], ['contrast', /contrast|punch|sharper/], ['camera', /camera|angle|viewpoint|bird|eye.?level|from the/]];
    map.forEach(([k, re]) => { if (re.test(t)) ops.push({ op: 'bg', kind: k, prompt: text }); });
    const v = OPTS[0].views.find(v => t.includes(v.name.toLowerCase())); if (v) ops.unshift({ op: 'background', view: v.name });
    if (!ops.length) ops.push({ op: 'bg', kind: 'restyle', prompt: text });
    return { ops, reply: 'Read with the built-in parser.' };
  }
  const type = (TYPEWORDS.find(([, re]) => re.test(t)) || [])[0];
  const color = Object.keys(COLORS).find(c => new RegExp('\\b' + c + '\\b').test(t));
  const num = (+(t.match(/(\d+(?:\.\d+)?)\s*mm/) || [])[1]) || 10;
  const quoted = (text.match(/["“](.+?)["”]/) || [])[1];
  if (/\b(add|show|draw|put|include)\b/.test(t) && quoted && !type) ops.push({ op: 'add', type: 'text', text: quoted, at: [200, 30] });
  else if (/\b(add|draw|include|put)\b/.test(t) && type) ops.push({ op: 'add', type, color: color && COLORS[color] });
  else if (type && /\b(hide|turn off)\b/.test(t)) ops.push({ op: 'hide', layer: type });
  else if (type && /\b(remove|delete|drop)\b/.test(t)) ops.push({ op: 'remove', layer: type });
  else if (type && /\bshow\b/.test(t)) ops.push({ op: 'show', layer: type });
  if (type && color && !ops.some(o => o.op === 'add')) ops.push({ op: 'style', layer: type, color: COLORS[color] });
  const L = type && cur() && cur().layers.find(x => x.type === type);
  if (type && /thick|bolder|heavier|wider/.test(t)) ops.push({ op: 'style', layer: type, width: +(((L && L.width) || 2) * 1.5).toFixed(2) });
  if (type && /thinner|lighter line|finer/.test(t)) ops.push({ op: 'style', layer: type, width: +(((L && L.width) || 2) / 1.5).toFixed(2) });
  if (type && /dash/.test(t)) ops.push({ op: 'style', layer: type, dash: !/solid|no dash/.test(t) });
  if (type && /\b(left|right|up|down)\b/.test(t) && /move|shift|nudge/.test(t)) { const d = t.match(/\b(left|right|up|down)\b/)[1]; ops.push({ op: 'move', layer: type, dx: d === 'left' ? -num : d === 'right' ? num : 0, dy: d === 'up' ? -num : d === 'down' ? num : 0 }); }
  if (quoted && type === undefined && !ops.length) ops.push({ op: 'add', type: 'text', text: quoted, at: [200, 30] });
  return { ops, reply: ops.length ? 'Read with the built-in parser.' : 'The built-in parser did not recognise that. Name a layer (loop, parking, journeys, frontage, ULO, legend…) and a change (add, hide, red, thicker, move left 10 mm).' };
}
async function promptOps(text, scope) {
  if (!AI) return parsePrompt(text, scope);
  const d = cur(), o = opt();
  const layers = d.layers.map(L => `${L.id}: ${L.type} "${L.name}" colour ${L.color} width ${L.width}pt ${L.on ? 'visible' : 'hidden'} offset ${L.dx || 0},${L.dy || 0} mm`).join('\n');
  const prompt = `You edit one architectural diagram through operations. The user said: "${text}"\n\nScope: ${scope === 'bg' ? 'the background image steps' : 'the overlay layers'}.\n${rowContext(d.id)}\n\n${briefContext(o)}\n\nCurrent background: ${d.read} with steps ${d.bg.map(b => b.kind).join(', ') || 'none'}.\nCurrent layers:\n${layers}\n\n${MENU()}\nThe drawing area is 400 × 266 mm (x right, y down).\n\nReply with only JSON: {"ops":[...],"reply":"one or two sentences: what you changed and how it serves the brief"}. Ops: {"op":"bg","kind":"wash","prompt":"..."} | {"op":"background","view":"GF plan"} | {"op":"add","type":"loop","color":"#hex"} | {"op":"add","type":"text","text":"...","at":[x,y]} | {"op":"style","layer":"<id or type>","color":"#hex","width":3,"dash":true} | {"op":"move","layer":"<id>","dx":10,"dy":0} | {"op":"hide"|"show"|"remove","layer":"<id>"} | {"op":"text","layer":"<id>","text":"..."}. Use "camera" or "restyle" bg kinds only when the user asks for a new viewpoint or a new look the filters cannot make.`;
  return await AI.json(prompt, { modelTier: 'quick', cache: false });
}

/* ---------- checks: the brief, measured ---------- */
function checksFor(d, o) {
  const M = measure(d, o); if (!M) return [];
  const has = t => d.layers.some(L => L.type === t && L.on);
  const v = findView(o, d), g = v && geo(v);
  const P = (state, t, val, layer) => ({ state, t, val, layer });
  const need = (t, ok, val) => has(t) ? P(ok ? 'pass' : 'fail', '', val) : P('todo', '', `Add the “${LTYPES[t].name}” layer`);
  const C = {
    D01: [['Spine, anchors, crescendo, ULO and towers in one drawing', need('parti', true, '5 kinds of mark: few enough to redraw from memory')]],
    D02: [['Every edge has a declared role; PUA head shown reversible', need('edges', true, 'Pulse, GCS, PUA, Boulevard, Desert Terrace')], ['Positions of GCS, Boulevard and Desert Terrace confirmed', g && ['gcs', 'boulevard', 'desert'].some(k => g.est(k)) ? P('warn', '', 'Estimated in this prototype. Confirm them in step 1.') : P('pass', '', 'Placed')]],
    D03: [['Closed loop on the trading level, anchors at the ends', need('loop', g && g.loop.length > 2, `Anchors ${o.audit.anchorsM} m apart (audit)`)], ['Retail on 2 + partial 3 levels (client steer)', P(/5/.test(o.audit.levels) ? 'fail' : /3/.test(o.audit.levels) ? 'warn' : 'pass', '', `As drawn: ${o.audit.levels}`)], ['Legible ground floor', P(/^5\b/.test(o.audit.junctions) ? 'pass' : 'warn', '', `GF junctions ${o.audit.junctions}`)]],
    D04: [['GF + L1 + ½L2 carries 200,000 m²', has('gla') ? P(M.gla.onLevels >= 200 ? 'pass' : 'fail', '', `${M.gla.onLevels.toFixed(0)}k m², ${Math.max(0, 200 - M.gla.onLevels).toFixed(0)}k short`) : P('todo', '', 'Add the GLA chart')]],
    D05: [['≥ 70 % active on primary frontages', has('frontage') ? P(M.frontage.pct >= 70 ? 'pass' : 'fail', '', `${M.frontage.pct} % active along the loop`) : P('todo', '', 'Add the frontage layer')], ['Double-sided F&B promenade visible', P('todo', '', 'Draw the promenade as its own layer (F&B 37,900 m² in the brief)')]],
    D06: [['8–12 named districts across three precincts', need('districts', true, '9 districts placed along the loop')], ['Districts differ by section and volume, not decor', P('todo', '', 'Needs a section per district')]],
    D07: [['No stretch over 150 m without a node', has('journeys') ? P(M.journeys.maxGap <= 150 ? 'pass' : 'fail', '', `Longest gap ${Math.round(M.journeys.maxGap)} m`) : P('todo', '', 'Add the journeys layer')], ['Journeys start at the PUA, not the car park', P(M.arrival.passesDeck ? 'fail' : 'pass', '', M.arrival.passesDeck ? `PUA route passes the parking deck (≈${o.audit.puaM} m)` : 'Clear of the deck')], ['A generator every 200–250 m', M.journeys.perimeter ? P(M.journeys.perimeter / 4 <= 250 ? 'pass' : 'warn', '', `${Math.round(M.journeys.perimeter)} m loop, 4 generators`) : P('todo', '', '')]],
    D08: [['The ULO is one place', P(M.ulo.pieces <= 1 ? 'pass' : 'fail', '', `${M.ulo.pieces} piece${M.ulo.pieces === 1 ? '' : 's'} on the plan today`)], ['Own front door on the Pulse', need('ulo', true, 'Drawn from the Pulse landing')]],
    D09: [['PUA arrival reaches retail without passing a parking deck', P(M.arrival.passesDeck ? 'fail' : 'pass', '', `≈${o.audit.puaM} m from station to shopfront (audit)`)], ['Vehicle numbers for every mode', P('warn', '', 'Taxi, PUDO and cycle are TBC: ask Systematica')]],
    D10: [['9,000 bays at opening (8,000 / 600 / 400)', need('parking', true, 'Stated on the sheet')], ['Conventional parking within 100 m of retail', has('parking') ? P(M.parking.worst <= 100 ? 'pass' : 'fail', '', M.parking.items.filter(x => x.name !== 'P deck').map(x => `${x.name} ${Math.round(x.m)} m`).join(' · ')) : P('todo', '', '')], ['Conversion at 6.0 m floor-to-floor drawn both ways', P('todo', '', 'Needs a section')]],
    D11: [['Service traffic never crosses customer circulation', need('servicing', true, 'Perimeter ring drawn; check docks against the loop')], ['No point more than 60 m from a core', has('servicing') ? P(M.servicing.maxM <= 60 ? 'pass' : 'fail', '', `Farthest ${Math.round(M.servicing.maxM)} m`) : P('todo', '', '')]],
    D12: [['Car and PUA entries meet in one lobby', need('office', true, `PUA → lobby ${Math.round(M.office.puaM || 0)} m`)], ['View cones to the Desert Terrace and the Pulse', g && g.est('desert') ? P('warn', '', 'Desert Terrace position is estimated') : P('pass', '', '')]],
    D13: [['Each hotel has its own front door and BOH', need('hotels', true, 'Three addresses drawn')], ['725 keys fit the massing', P('todo', '', 'Key-count test per tower still to draw')]],
    D14: [['Comfortable route in peak summer', need('climate', true, 'Shade along the whole loop')], ['No ground-floor water', P(o.audit.water ? 'fail' : 'pass', '', o.audit.water ? 'The current render shows ground-floor water' : 'None shown')], ['Roof designed, not left over', P('todo', '', 'Needs a roof plan view')]],
    D15: [['Late-trading zone closes independently without cutting routes', need('clock', true, 'E&L zone around the ULO')], ['Ramadan, Eid and events on the calendar', need('clock', true, 'Indicative calendar strip')]],
    D16: [['Credible phase-one opening', need('phasing', true, 'Phase 1 = the full loop')], ['Phase two (+20 % GLA) without breaking the loop', need('phasing', true, 'Extension at the department-store end')]],
    D17: [['Wish list captured', need('aspirations', true, `${ASPIRATIONS.length} items`)]],
  };
  return (C[d.id] || []).map(([t, p]) => Object.assign(p, { t }));
}
RMUH_OPTIONS.forEach(o => { o.audit.water = o.id === 'flux' || o.id === 'orbit'; });

/* ---------- pipeline nodes ---------- */
function nodesOf(d) {
  const o = opt(), v = findView(o, d);
  return [{ kind: 'read', step: 3, t: 'Read', s: v ? `${o.name} · ${v.name}` : `${d.read} missing` }]
    .concat(d.bg.map(b => ({ kind: 'bg', step: 3, t: b.label, s: b.prompt ? '“' + b.prompt + '”' : BG_KINDS[b.kind].hint, ref: b, off: !b.on, warn: b.kind === 'camera' || b.kind === 'restyle' })))
    .concat(d.layers.map(L => ({ kind: 'layer', step: 4, t: L.name, s: 'over · ' + L.type, ref: L, off: !L.on })))
    .concat([{ kind: 'sheet', step: 5, t: 'Sheet A3', s: 'title, frame' }, { kind: 'write', step: 5, t: 'Write PDF / SVG', s: `RMUH_${o.name}_${d.id}` }]);
}
const stepCol = s => `var(--s${s})`;

/* ---------- render: top, left, centre, right ---------- */
const STEPS = [['Options', 'Images and anchors'], ['Diagram', 'From the Excel'], ['Background', 'Pick and adjust'], ['Overlays', 'Layers and prompts'], ['Export', 'PDF or SVG']];
function stepDone(i) { const d = cur(); return i === 1 ? true : i === 2 ? Object.keys(ST.D).length > 0 : i === 3 ? !!(d && findView(opt(), d)) : i === 4 ? !!(d && d.layers.length) : i === 5 ? !!(d && ST.exported[d.id + ':' + ST.optId]) : false; }
function renderSteps() {
  $('#steps').innerHTML = STEPS.map((s, i) => `${i ? '<span class="bar"></span>' : ''}<button class="step ${stepDone(i + 1) && ST.step !== i + 1 ? 'done' : ''}" data-s="${i + 1}" ${ST.step === i + 1 ? 'aria-current="step"' : ''}><span class="n">${stepDone(i + 1) && ST.step !== i + 1 ? '✓' : i + 1}</span><span class="lbl">${s[0]}</span></button>`).join('');
  $$('#steps .step').forEach(b => b.onclick = () => goStep(+b.dataset.s));
}
function goStep(n) {
  if (n > 2 && !cur()) { toast('Pick a diagram in step 2 first.'); n = 2; }
  ST.step = n; ST.placing = null;
  const d = cur();
  if (d) { const N = nodesOf(d); ST.node = n === 3 ? d.bg.length : n === 4 ? (d.layers.length ? N.length - 3 : d.bg.length) : N.length - 1; }
  renderAll();
}
function renderAll() { renderSteps(); renderOtabs(); renderLeft(); renderViewer(); renderStrip(); renderRight(); }
function renderOtabs() { $('#otabs').innerHTML = OPTS.map(o => `<button aria-pressed="${o.id === ST.optId}" data-o="${o.id}"><i style="background:${o.color}"></i>${esc(o.name)}</button>`).join(''); $$('#otabs button').forEach(b => b.onclick = () => { ST.optId = b.dataset.o; if (ST.step === 1) ST.viewSel = opt().views[0].id; renderAll(); }); }
function footer(back, next, nextLbl) { return `<div class="col-f">${back ? `<button class="btn" data-go="${back}">← Back</button>` : ''}${next ? `<button class="btn primary" data-go="${next}">${nextLbl || 'Next'} →</button>` : ''}</div>`; }
function colHead(n, title, p) { return `<div class="col-h"><h2><span class="n">${n}</span>${title}</h2><p>${p}</p></div>`; }

function renderLeft() {
  const L = $('#left'); const d = cur(), o = opt();
  if (ST.step === 1) {
    const v = o.views.find(x => x.id === ST.viewSel) || o.views[0];
    L.innerHTML = colHead(1, 'Set up the design options', 'Each option holds the images a diagram can use as its background. Name it, add views and moods, and place anchors on the plan so overlays know where things are.') +
      `<div class="col-b">${OPTS.map(x => `<div class="card opt-card ${x.id === o.id ? 'sel' : ''}" data-oc="${x.id}"><div class="opt-head"><span class="sw" style="background:${x.color}"></span><input value="${esc(x.name)}" data-oname="${x.id}" aria-label="Option name"><span class="faint" style="font-size:11.5px;white-space:nowrap">${x.views.length} images</span></div>${x.id === o.id ? `<input class="input" value="${esc(x.tag)}" data-otag="${x.id}" aria-label="One-line idea"><div class="tiles">${x.views.map(t => `<div class="tile ${t.id === v.id ? 'sel' : ''}" data-v="${t.id}" title="${esc(t.note || t.name)}"><div class="th"><img src="${t.url}" alt="" loading="lazy"></div><span class="kind">${t.kind}</span>${Object.keys(t.anchors || {}).length ? `<span class="anc">${Object.keys(t.anchors).length} anchors</span>` : ''}<div class="cap"><span>${esc(t.name)}</span></div></div>`).join('')}<button class="tile add" id="addImg">${ic('upload')}Add views or moods<br><span class="faint">PNG, JPG</span></button></div>` : ''}</div>`).join('')}
      <div class="card" style="padding:12px;display:grid;gap:10px"><div class="sec-h"><b>${esc(v.name)}</b><span class="faint">${v.kind}</span></div>
        <div class="field"><label for="vName">Name</label><input class="input" id="vName" value="${esc(v.name)}"></div>
        <div class="field"><label for="vKind">Use as</label><select class="input" id="vKind"><option value="view"${v.kind === 'view' ? ' selected' : ''}>View (background)</option><option value="mood"${v.kind === 'mood' ? ' selected' : ''}>Mood (style reference)</option></select></div>
        <div style="display:flex;gap:6px"><button class="btn sm" id="vReplace">${ic('swap')}Replace image</button><button class="btn sm ghost" id="vRemove">${ic('x')}Remove</button></div>
        ${v.note ? `<span class="hint">${esc(v.note)}</span>` : ''}
        <div class="sec"><div class="sec-h"><span class="eyebrow">Anchors on this image</span><span class="faint" style="font-size:11.5px">click one, then click the image</span></div>
        <div class="anchors">${ANCHOR_DEFS.map(a => { const p = (v.anchors || {})[a.k]; return `<div class="arow ${ST.placing === a.k ? 'sel' : ''}" data-a="${a.k}"><span class="d" style="background:${p ? (p[2] ? 'var(--warn)' : 'var(--ok)') : 'var(--line-2)'}"></span><span>${a.name}</span><span class="faint" style="font-size:11px">${p ? (p[2] ? 'estimated' : 'placed') : 'not placed'}</span></div>`; }).join('')}</div>
        <span class="hint">Green: read off the audit plan. Amber: a guess to confirm. Overlays only draw on images whose anchors they need are placed.</span></div></div></div>` + footer(0, 2, 'Choose a diagram');
    $$('[data-oc]').forEach(c => c.addEventListener('click', e => { if (e.target.closest('input,.tile,button')) return; ST.optId = c.dataset.oc; ST.viewSel = opt().views[0].id; renderAll(); }));
    $$('[data-oname]').forEach(i => i.onchange = () => { OPTS.find(x => x.id === i.dataset.oname).name = i.value.trim() || 'Option'; save(); renderAll(); });
    $$('[data-otag]').forEach(i => i.onchange = () => { OPTS.find(x => x.id === i.dataset.otag).tag = i.value.trim(); save(); });
    $$('.tile[data-v]').forEach(t => t.onclick = () => { ST.viewSel = t.dataset.v; ST.placing = null; renderAll(); });
    $('#addImg').onclick = () => { ST.fileMode = 'add'; $('#fileIn').multiple = true; $('#fileIn').click(); };
    $('#vReplace').onclick = () => { ST.fileMode = 'replace'; $('#fileIn').multiple = false; $('#fileIn').click(); };
    $('#vRemove').onclick = () => { if (o.views.length < 2) return toast('An option needs at least one image.'); o.views = o.views.filter(x => x !== v); ST.viewSel = o.views[0].id; save(); renderAll(); toast(`Removed ${esc(v.name)} from ${esc(o.name)}.`); };
    $('#vName').onchange = e => { const old = v.name; v.name = e.target.value.trim() || old; Object.values(ST.D).forEach(dd => { if (dd.read === old && o.views[0] === v) dd.read = v.name; }); save(); renderAll(); };
    $('#vKind').onchange = e => { v.kind = e.target.value; save(); renderAll(); };
    $$('.arow').forEach(r => r.onclick = () => { ST.placing = ST.placing === r.dataset.a ? null : r.dataset.a; renderLeft(); renderViewer(); });
  } else if (ST.step === 2) {
    const r = row(ST.dId), drafted = Object.keys(ST.D).length;
    L.innerHTML = colHead(2, 'Choose a diagram', `Your Excel lists ${ST.xl.diagrams.length} diagrams. Claude drafts each one from its row: what to show, when it succeeds, and the criteria it proves.`) +
      `<div class="col-b"><div class="sec"><button class="btn primary block" id="draftAll">${ic('sparkle')}Draft first iteration of all ${ST.xl.diagrams.length} from the Excel</button><span class="hint">${drafted} of ${ST.xl.diagrams.length} drafted. Each draft is only a starting pipeline; you edit it in steps 3 and 4.</span></div>
      <div class="dlist">${ST.xl.diagrams.map(x => `<button class="drow ${x.id === ST.dId ? 'sel' : ''}" data-d="${x.id}"><span class="id">${x.id}</span><span class="nm">${esc(x.name)}${ST.D[x.id] ? '' : ' <span class="faint">· not drafted</span>'}</span><span class="sdots" title="${OPTS.map(oo => oo.name + ': ' + (x.status[oo.name] || 'Not started')).join(' · ')}">${OPTS.map(oo => `<i class="${{ 'In progress': 's-prog', Drawn: 's-drawn', Checked: 's-checked' }[x.status[oo.name]] || ''}"></i>`).join('')}</span></button>`).join('')}</div>
      ${r ? `<div class="brief-box"><b>${r.id} · ${esc(r.name)}</b><span><span class="faint">Show:</span> ${esc(r.show)}</span><span><span class="faint">Succeeds when:</span> ${esc(r.succeeds || '—')}</span></div>
      ${ST.D[r.id] ? `<div class="proposal"><b>Current pipeline · by ${esc(ST.D[r.id].by)}</b><ol><li>Background: ${esc(ST.D[r.id].read)}${ST.D[r.id].bg.length ? ', ' + ST.D[r.id].bg.map(b => b.label.toLowerCase()).join(', ') : ''}</li>${ST.D[r.id].layers.map(L => `<li>${esc(L.name)}</li>`).join('')}<li>A3 sheet → PDF / SVG</li></ol><div style="display:flex;gap:6px"><button class="btn sm" id="reprop">${ic('sparkle')}Propose again</button><button class="btn sm primary" data-go="3">Edit it →</button></div></div>`
      : `<button class="btn primary block" id="propOne">${ic('sparkle')}Propose a workflow for ${r.id}</button>`}` : ''}</div>` + footer(1, cur() ? 3 : 0, 'Background');
    $$('.drow').forEach(b => b.onclick = () => { ST.dId = b.dataset.d; ST.layerSel = null; const dd = cur(); if (dd) ST.node = nodesOf(dd).length - 1; renderAll(); });
    const doOne = async () => { ST.busy = true; renderRight(); try { const p = await propose(ST.dId); ST.D[ST.dId] = makeDiagram(ST.dId, p, p.by); OPTS.forEach(oo => setStatus(ST.dId, oo.name, 'In progress')); ST.node = nodesOf(cur()).length - 1; save(); toast(`${ST.dId} drafted by ${p.by}.`); } catch (e) { toast(`Claude could not answer (${esc(e.code || e.message)}). Using the built-in recipe.`); const p = recipeFor(ST.dId); ST.D[ST.dId] = makeDiagram(ST.dId, Object.assign(p, { reasoning: [p.why] }), 'built-in recipe'); } ST.busy = false; renderAll(); };
    if ($('#propOne')) $('#propOne').onclick = doOne;
    if ($('#reprop')) $('#reprop').onclick = doOne;
    $('#draftAll').onclick = async () => {
      ST.busy = true; renderRight(); const btn = $('#draftAll'); btn.disabled = true; btn.innerHTML = 'Drafting…';
      let plans = null, by = 'built-in recipe';
      if (AI) { try { plans = await proposeAll(); by = 'Claude'; } catch (e) { toast(`Claude could not answer (${esc(e.code || e.message)}). Using the built-in recipes.`); } }
      ST.xl.diagrams.forEach(x => { const p = (plans || []).find(q => q.id === x.id) || Object.assign(recipeFor(x.id), { reasoning: [recipeFor(x.id).why] }); ST.D[x.id] = makeDiagram(x.id, p, plans && plans.find(q => q.id === x.id) ? by : 'built-in recipe'); OPTS.forEach(oo => setStatus(x.id, oo.name, 'In progress')); });
      ST.busy = false; save(); ST.node = nodesOf(cur()).length - 1; renderAll(); toast(`${ST.xl.diagrams.length} diagrams drafted by ${by}. Step through them, or go to step 5 to export the set.`);
    };
  } else if (ST.step === 3) {
    const views = o.views.filter(v => v.kind === 'view');
    L.innerHTML = colHead(3, 'Background', `Pick which image sits behind ${d.id}. The choice is a view name, so every option uses its own “${esc(d.read)}”. Then change it step by step.`) +
      `<div class="col-b"><div class="sec"><span class="eyebrow">Image · ${esc(o.name)}</span><div class="tiles">${views.map(v => `<div class="tile ${v.name === d.read ? 'sel' : ''}" data-read="${esc(v.name)}"><div class="th"><img src="${v.url}" alt=""></div>${Object.keys(v.anchors || {}).length ? '<span class="anc">anchors</span>' : ''}<div class="cap"><span>${esc(v.name)}</span></div></div>`).join('')}</div><span class="hint">Images without anchors take the background change but no overlays until you place anchors in step 1.</span></div>
      <div class="sec"><span class="eyebrow">Background steps, in order</span><div class="bglist">${d.bg.length ? d.bg.map((b, i) => `<div class="bgrow ${ST.node === i + 1 ? 'sel' : ''} ${b.on ? '' : 'off'}" data-b="${b.id}"><span class="sw" style="background:var(--s3)"></span><span class="nm" title="${esc(b.prompt)}">${esc(b.label)}${b.kind === 'camera' || b.kind === 'restyle' ? ' <span class="faint">· image model</span>' : ''}</span><span style="display:flex"><button class="ib" data-bt="${b.id}" aria-label="On or off">${ic(b.on ? 'eye' : 'eyeoff')}</button><button class="ib" data-bu="${b.id}" aria-label="Move up">${ic('up')}</button><button class="ib" data-bx="${b.id}" aria-label="Remove">${ic('x')}</button></span></div>`).join('') : '<span class="hint">None yet. The image is used as it is.</span>'}</div>
      <div class="presets">${['wash', 'desaturate', 'ghost', 'figure', 'night', 'warm', 'contrast'].map(k => `<button class="chip" data-pre="${k}">${ic('plus')}${BG_KINDS[k].label}</button>`).join('')}</div></div>
      ${promptBox('bg', 'Describe the background change, e.g. “wash it out and make it black and white” or “view it from a lower camera angle”')}
      ${histHtml(d, 'bg')}</div>` + footer(2, 4, 'Overlays');
    $$('[data-read]').forEach(t => t.onclick = () => { snapshot('Background image'); d.read = t.dataset.read; save(); renderAll(); });
    $$('[data-bt]').forEach(b => b.onclick = e => { e.stopPropagation(); const x = d.bg.find(q => q.id === b.dataset.bt); snapshot('Toggle'); x.on = !x.on; save(); renderAll(); });
    $$('[data-bu]').forEach(b => b.onclick = e => { e.stopPropagation(); const i = d.bg.findIndex(q => q.id === b.dataset.bu); if (i > 0) { snapshot('Reorder'); [d.bg[i - 1], d.bg[i]] = [d.bg[i], d.bg[i - 1]]; save(); renderAll(); } });
    $$('[data-bx]').forEach(b => b.onclick = e => { e.stopPropagation(); snapshot('Remove step'); d.bg = d.bg.filter(q => q.id !== b.dataset.bx); ST.node = d.bg.length; save(); renderAll(); });
    $$('.bgrow').forEach(r => r.onclick = () => { ST.node = d.bg.findIndex(q => q.id === r.dataset.b) + 1; renderAll(); });
    $$('[data-pre]').forEach(b => b.onclick = () => { applyOps(d, [{ op: 'bg', kind: b.dataset.pre }], BG_KINDS[b.dataset.pre].label); ST.node = d.bg.length; renderAll(); });
    wirePrompt('bg');
  } else if (ST.step === 4) {
    const sel = d.layers.find(x => x.id === ST.layerSel);
    L.innerHTML = colHead(4, 'Overlays', 'Each layer is one idea drawn on top. Click a layer on the sheet to select it, drag to move it, drag its anchor dots to fit the plan. Or just ask.') +
      `<div class="col-b">${promptBox('ov', 'Tell Claude what to change, e.g. “make the loop thicker and red”, “add a label \\“Crescendo on the Pulse\\””, “move the legend left 20 mm”')}
      <div class="sec"><div class="sec-h"><span class="eyebrow">Layers, bottom to top</span><button class="btn sm" id="addLayer">${ic('plus')}Add</button></div><div class="lylist">${d.layers.map(x => { const miss = (LTYPES[x.type].needs || []).filter(k => !geo(findView(o, d) || o.views[0]).A(k)); return `<div class="lyrow ${x.id === ST.layerSel ? 'sel' : ''} ${x.on ? '' : 'off'}" data-l="${x.id}"><span class="sw" style="background:${x.color}"></span><span class="nm">${esc(x.name)}${miss.length ? ` <span class="warn">· needs ${miss.length} anchor${miss.length > 1 ? 's' : ''}</span>` : ''}</span><span style="display:flex"><button class="ib" data-lt="${x.id}" aria-label="On or off">${ic(x.on ? 'eye' : 'eyeoff')}</button><button class="ib" data-lu="${x.id}" aria-label="Move down the stack">${ic('down')}</button><button class="ib" data-lx="${x.id}" aria-label="Remove">${ic('x')}</button></span></div>`; }).join('') || '<span class="hint">No layers yet.</span>'}</div></div>
      ${sel ? `<div class="card" style="padding:12px;display:grid;gap:8px"><b>${esc(sel.name)}</b>
        <div class="field"><label for="lColor">Colour</label><input type="color" id="lColor" value="${sel.color}" style="width:44px;height:28px;border:0;background:none;padding:0"></div>
        <div class="field"><label for="lWidth">${sel.type === 'text' || sel.type === 'legend' ? 'Size (pt)' : 'Line (pt)'}</label><input class="input" id="lWidth" type="number" step="0.1" min="0.2" value="${sel.width}"></div>
        <div class="field"><label>Dashed</label><button class="toggle" role="switch" id="lDash" aria-checked="${!!sel.dash}"></button></div>
        ${sel.type === 'text' ? `<div class="field"><label for="lText">Text</label><input class="input" id="lText" value="${esc(sel.text || '')}"></div>` : ''}
        ${sel.type === 'legend' ? `<div class="field"><label>Corner</label><select class="input" id="lPos"><option value="br"${sel.pos !== 'bl' ? ' selected' : ''}>Bottom right</option><option value="bl"${sel.pos === 'bl' ? ' selected' : ''}>Bottom left</option></select></div>` : ''}
        <div class="field"><label>Offset</label><span class="mono">${(sel.dx || 0).toFixed(1)}, ${(sel.dy || 0).toFixed(1)} mm <button class="btn sm ghost" id="lReset">Reset</button></span></div>
        <span class="hint">Anchors this layer uses: ${(LTYPES[sel.type].needs || []).map(k => (ANCHOR_DEFS.find(a => a.k === k) || {}).name).join(', ') || 'none'}. Moving an anchor moves it for every diagram on ${esc(o.name)}.</span></div>` : ''}
      ${histHtml(d, 'ov')}</div>` + footer(3, 5, 'Export');
    $$('.lyrow').forEach(r => r.onclick = () => { ST.layerSel = r.dataset.l; ST.node = 1 + d.bg.length + d.layers.findIndex(x => x.id === r.dataset.l); renderAll(); });
    $$('[data-lt]').forEach(b => b.onclick = e => { e.stopPropagation(); const x = d.layers.find(q => q.id === b.dataset.lt); snapshot('Toggle'); x.on = !x.on; save(); renderAll(); });
    $$('[data-lu]').forEach(b => b.onclick = e => { e.stopPropagation(); const i = d.layers.findIndex(q => q.id === b.dataset.lu); if (i > 0) { snapshot('Reorder'); [d.layers[i - 1], d.layers[i]] = [d.layers[i], d.layers[i - 1]]; save(); renderAll(); } });
    $$('[data-lx]').forEach(b => b.onclick = e => { e.stopPropagation(); snapshot('Remove layer'); d.layers = d.layers.filter(q => q.id !== b.dataset.lx); if (ST.layerSel === b.dataset.lx) ST.layerSel = null; save(); renderAll(); toast('Layer removed.', ['Undo', undo]); });
    $('#addLayer').onclick = e => openMenu(e.currentTarget, Object.entries(LTYPES).map(([k, t]) => [k, t.name, t.color]), k => { const extra = k === 'text' ? { text: 'Label', at: [200, 30] } : k === 'arrow' ? { from: [120, 200], to: [220, 140] } : {}; applyOps(d, [Object.assign({ op: 'add', type: k }, extra)], 'Add layer'); renderAll(); });
    if (sel) {
      const set = (fn, label) => { snapshot(label); fn(); save(); renderViewer(); renderStrip(); renderRight(); };
      $('#lColor').oninput = e => set(() => sel.color = e.target.value, 'Colour');
      $('#lWidth').onchange = e => set(() => sel.width = Math.max(.2, +e.target.value || sel.width), 'Width');
      $('#lDash').onclick = e => { set(() => sel.dash = !sel.dash, 'Dash'); e.currentTarget.setAttribute('aria-checked', String(sel.dash)); };
      if ($('#lText')) $('#lText').onchange = e => set(() => { sel.text = e.target.value; sel.name = 'Text · ' + e.target.value.slice(0, 24); }, 'Text');
      if ($('#lPos')) $('#lPos').onchange = e => set(() => sel.pos = e.target.value, 'Legend corner');
      $('#lReset').onclick = () => { set(() => { sel.dx = 0; sel.dy = 0; }, 'Reset offset'); renderLeft(); };
    }
    wirePrompt('ov');
  } else {
    const k = d.id + ':' + o.id, ex = ST.exported[k];
    L.innerHTML = colHead(5, 'Export', 'A layered A3 PDF opens in Illustrator or Acrobat with one layer per overlay, live text, and the background as a 300 ppi image. SVG keeps every layer as a named group.') +
      `<div class="col-b"><div class="sec"><span class="eyebrow">What</span>
        <label class="ropt"><input type="radio" name="what" value="one" checked><span>${d.id} for ${esc(o.name)}</span><span></span></label>
        <label class="ropt"><input type="radio" name="what" value="row"><span>${d.id} for all 4 options</span><span class="faint">4 pages</span></label>
        <label class="ropt"><input type="radio" name="what" value="col"><span>Every drafted diagram for ${esc(o.name)}</span><span class="faint">${Object.keys(ST.D).length} pages</span></label></div>
      <div class="sec"><button class="btn primary block" id="exPdf">${ic('file')}Export layered PDF</button><button class="btn block" id="exSvg">${ic('file')}Export SVG (this sheet)</button><span class="hint">File: RMUH_${esc(o.name)}_${d.id}_${esc(d.name.replace(/[^\w]+/g, '-'))}.pdf</span></div>
      ${ex ? `<div class="brief-box"><b>Last export · ${esc(ex.when)}</b><span>${ex.pages} page${ex.pages > 1 ? 's' : ''} · ${(ex.size / 1024 / 1024).toFixed(2)} MB · ${esc(ex.how)}</span><span class="faint">Layers: ${ex.layers.map(esc).join(', ')}</span><span class="faint">Background: ${esc(ex.raster)}</span></div>` : ''}
      <div class="sec"><span class="eyebrow">Tracker</span><span class="hint">Exporting marks the diagram Drawn for that option in the Excel tracker. Mark it Checked once the reasoning panel is green.</span>
        <div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" id="markChk">${ic('check')}Mark ${d.id} Checked for ${esc(o.name)}</button><button class="btn sm" id="dlCsv">${ic('file')}Tracker as CSV</button></div></div></div>` + footer(4, 0);
    const what = () => ($$('input[name="what"]').find(r => r.checked) || {}).value;
    $('#exPdf').onclick = async e => { const b = e.currentTarget; b.disabled = true; b.textContent = 'Writing PDF…'; try { await exportPdf(what()); } catch (err) { toast('Export failed: ' + esc(err.message || err)); } b.disabled = false; b.innerHTML = ic('file') + 'Export layered PDF'; };
    $('#exSvg').onclick = () => exportSvg();
    $('#markChk').onclick = () => { setStatus(d.id, o.name, 'Checked'); ST.checked[k] = true; save(); renderAll(); toast(`${d.id} marked Checked for ${esc(o.name)}.`); };
    $('#dlCsv').onclick = () => saveFile('D1_RMUH_Diagrams_tracker.csv', trackerCsv(), 'text/csv');
  }
  $$('[data-go]', L).forEach(b => b.onclick = () => goStep(+b.dataset.go));
  hydrate(L);
}
function promptBox(scope, ph) { return `<form class="promptbox" id="pf-${scope}"><textarea id="pt-${scope}" rows="2" placeholder="${esc(ph)}" aria-label="Prompt"></textarea><div class="row"><span class="faint" style="font-size:11.5px;flex:1">${AI ? 'Claude reads the brief, the Excel row and the layers' : 'Built-in parser (Claude not reachable here)'}</span><button class="btn primary sm" type="submit">${ic('send')}Apply</button></div></form>`; }
function histHtml(d, scope) { const h = d.prompts.filter(p => p.scope === scope).slice(-6).reverse(); return h.length ? `<div class="sec"><span class="eyebrow">Prompt history</span><div class="hist">${h.map(p => `<div class="h"><span class="q">“${esc(p.q)}”</span><span class="a">${esc(p.a)}</span><span class="faint" style="font-size:11px">${esc(p.by)} · ${p.done.map(esc).join(' · ') || 'no change'}</span></div>`).join('')}</div></div>` : ''; }
function wirePrompt(scope) {
  const f = $('#pf-' + scope), t = $('#pt-' + scope);
  t.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); f.requestSubmit(); } });
  f.onsubmit = async e => {
    e.preventDefault(); const q = t.value.trim(); if (!q) return; const d = cur();
    f.classList.add('busy'); t.disabled = true;
    let res, by = AI ? 'Claude' : 'built-in parser';
    try { res = await promptOps(q, scope); } catch (err) { res = parsePrompt(q, scope); by = 'built-in parser (Claude: ' + (err.code || 'error') + ')'; }
    const done = applyOps(d, res.ops || [], q);
    d.prompts.push({ q, a: res.reply || '', by, done, scope });
    if (scope === 'bg') ST.node = d.bg.length; else if (ST.layerSel) ST.node = 1 + d.bg.length + d.layers.findIndex(x => x.id === ST.layerSel);
    save(); renderAll(); toast(done.length ? done.map(esc).join(' · ') : 'Nothing changed. ' + esc(res.reply || ''), done.length ? ['Undo', undo] : null);
  };
}
function openMenu(anchor, items, onPick) {
  const m = document.createElement('div'); m.className = 'menu'; m.innerHTML = items.map(([k, n, c]) => `<button data-k="${k}"><span class="sw" style="background:${c}"></span>${esc(n)}</button>`).join('');
  document.body.appendChild(m); const r = anchor.getBoundingClientRect(); m.style.left = Math.min(r.left, innerWidth - 240) + 'px'; m.style.top = Math.min(r.bottom + 6, innerHeight - m.offsetHeight - 8) + 'px';
  const close = ev => { if (!m.contains(ev.target)) { m.remove(); document.removeEventListener('pointerdown', close); } };
  setTimeout(() => document.addEventListener('pointerdown', close), 0);
  $$('button', m).forEach(b => b.onclick = () => { m.remove(); document.removeEventListener('pointerdown', close); onPick(b.dataset.k); });
}

/* ---------- viewer ---------- */
function handleSvg(v, keys, px) {
  const g = geo(v); let s = '';
  keys.forEach(k => { const p = g.A(k); if (!p) return; const est = g.est(k), nm = (ANCHOR_DEFS.find(a => a.k === k) || {}).name || k; s += `<g class="anc-h" data-anc="${k}" style="cursor:grab"><circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(5 * px)}" fill="${est ? '#F5B400' : '#2D5BFF'}" stroke="#fff" stroke-width="${f(1.5 * px)}"/><text x="${f(p[0] + 7 * px)}" y="${f(p[1] + 3 * px)}" font-size="${f(10 * px)}" font-family="Geist, sans-serif" font-weight="600" fill="#111" stroke="#fff" stroke-width="${f(3 * px)}" paint-order="stroke">${esc(nm)}${est ? ' ?' : ''}</text></g>`; });
  return s;
}
function renderViewer() {
  const stg = $('#stage'), o = opt();
  if (ST.step === 1) {
    const v = o.views.find(x => x.id === ST.viewSel) || o.views[0], g = geo(v), R = g.R;
    const px = 420 / Math.max(300, stg.clientWidth - 36);
    const extra = (g.site.length ? `<path d="${polyD(g.site, true)}" fill="none" stroke="#C0392B" stroke-width="${f(1.2 * px)}" stroke-dasharray="${f(6 * px)} ${f(3 * px)}"/>` : '') + (g.loop.length ? `<path d="${crPath(g.loop, true)}" fill="none" stroke="#E07B00" stroke-width="${f(2 * px)}" stroke-opacity=".8"/>` + g.loop.map((p, i) => `<rect class="loop-h" data-loop="${i}" x="${f(p[0] - 3 * px)}" y="${f(p[1] - 3 * px)}" width="${f(6 * px)}" height="${f(6 * px)}" fill="#fff" stroke="#E07B00" stroke-width="${f(1.4 * px)}" style="cursor:grab"/>`).join('') : '') + handleSvg(v, ANCHOR_DEFS.map(a => a.k), px);
    $('#viewing').innerHTML = `Viewing <b>${esc(o.name)} · ${esc(v.name)}</b> · ${ST.placing ? `click the image to place <b>${esc(ANCHOR_DEFS.find(a => a.k === ST.placing).name)}</b>` : 'drag anchors and loop points to fit the drawing'}`;
    stg.innerHTML = `<div class="sheet ${ST.placing ? 'placing' : ''}" id="sheet"><svg class="dg-svg" viewBox="-10 -19 420 297" xmlns="http://www.w3.org/2000/svg"><rect x="-10" y="-19" width="420" height="297" fill="#fff"/><image href="${v.url}" x="${f(R.x)}" y="${f(R.y)}" width="${f(R.w)}" height="${f(R.h)}" preserveAspectRatio="none"/><g class="vw-handles">${extra}</g></svg></div>`;
    wireViewer(v);
    return;
  }
  const d = cur();
  if (!d) { $('#viewing').textContent = 'No diagram yet'; stg.innerHTML = `<div class="empty"><b>Pick a diagram from your Excel</b><span>Each row becomes a pipeline: background, overlays, sheet, file. Claude drafts it; you adjust only what you want.</span></div>`; return; }
  const N = nodesOf(d); if (ST.node == null || ST.node >= N.length) ST.node = N.length - 1;
  const stage = ST.node + 1, v = findView(o, d);
  const sel = ST.step === 4 && d.layers.find(x => x.id === ST.layerSel);
  const px = 420 / Math.max(300, stg.clientWidth - 36);
  const res = renderSheet(d, o, stage, sel && v ? handleSvg(v, LTYPES[sel.type].needs || [], px) : '');
  $('#viewing').innerHTML = `Viewing <b>${esc(N[ST.node].t)}</b> · ${d.id} ${esc(d.name)} × ${esc(o.name)}`;
  if (res.missing) { stg.innerHTML = `<div class="empty"><b>${esc(o.name)} has no image called “${esc(d.read)}”</b><span>Add or rename one in step 1, or pick another background in step 3.</span><button class="btn" id="goBg">Choose background</button></div>`; $('#goBg').onclick = () => goStep(3); return; }
  const notes = (res.st.notes || []).concat((res.overlayMissing || []).map(m => `${m.layer} needs anchors on “${res.st.view.name}”: ${m.need.map(k => (ANCHOR_DEFS.find(a => a.k === k) || { name: k }).name).join(', ')}. Place them in step 1.`));
  stg.innerHTML = (notes.length ? `<div class="banner warn">${esc(notes[0])}${notes.length > 1 ? ` (+${notes.length - 1} more)` : ''}</div>` : '') + `<div class="sheet" id="sheet">${res.svg}</div>`;
  wireViewer(v);
}
function svgPoint(evt) { const h = $('#sheet .vw-handles'); const svg = h.ownerSVGElement, p = svg.createSVGPoint(); p.x = evt.clientX; p.y = evt.clientY; return p.matrixTransform(h.getScreenCTM().inverse()); }
function wireViewer(v) {
  const sheet = $('#sheet'); if (!sheet) return; const d = cur(), o = opt();
  sheet.addEventListener('pointerdown', e => {
    const anc = e.target.closest('[data-anc]'), lp = e.target.closest('[data-loop]');
    if (ST.step === 1 && ST.placing && !anc && !lp) { const p = svgPoint(e), R = imgRect(v); v.anchors = v.anchors || {}; v.anchors[ST.placing] = [+((p.x - R.x) / R.w).toFixed(4), +((p.y - R.y) / R.h).toFixed(4)]; const nm = ANCHOR_DEFS.find(a => a.k === ST.placing).name; ST.placing = null; save(); renderAll(); toast(`${esc(nm)} placed on ${esc(o.name)} · ${esc(v.name)}.`); return; }
    if (anc || lp) {
      e.preventDefault(); const R = imgRect(v); const before = JSON.stringify({ a: v.anchors, l: v.loop });
      const move = ev => { const p = svgPoint(ev), u = [+((p.x - R.x) / R.w).toFixed(4), +((p.y - R.y) / R.h).toFixed(4)]; if (anc) v.anchors[anc.dataset.anc] = u; else v.loop[+lp.dataset.loop] = u; renderViewer(); };
      const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); if (JSON.stringify({ a: v.anchors, l: v.loop }) !== before) { save(); renderAll(); toast(anc ? `Moved ${esc((ANCHOR_DEFS.find(a => a.k === anc.dataset.anc) || {}).name)} on ${esc(o.name)}. Every diagram that uses it has updated.` : 'Loop point moved.'); } };
      addEventListener('pointermove', move); addEventListener('pointerup', up); return;
    }
    if (ST.step === 4 && d) {
      const g = e.target.closest('[data-layer]'); if (!g || g.dataset.layer === 'background' || g.dataset.layer === 'sheet') { ST.layerSel = null; renderLeft(); renderViewer(); return; }
      const L = d.layers.find(x => x.id === g.dataset.layer); if (!L) return;
      if (ST.layerSel !== L.id) { ST.layerSel = L.id; ST.node = 1 + d.bg.length + d.layers.indexOf(L); }
      const p0 = svgPoint(e), o0 = [L.dx || 0, L.dy || 0]; let moved = false; snapshot('Move ' + L.name);
      const move = ev => { const p = svgPoint(ev); L.dx = o0[0] + p.x - p0.x; L.dy = o0[1] + p.y - p0.y; moved = true; const gg = $(`#sheet [data-layer="${L.id}"]`); if (gg) gg.setAttribute('transform', `translate(${f(L.dx)},${f(L.dy)})`); };
      const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); if (!moved) ST.undo.pop(); save(); renderAll(); };
      addEventListener('pointermove', move); addEventListener('pointerup', up);
    }
  });
}
function renderStrip() {
  const d = cur(), host = $('#nodes');
  $('#stripH').innerHTML = [[3, 'Background · step 3'], [4, 'Overlays · step 4'], [5, 'Output · step 5']].map(([s, t]) => `<span><i style="background:${stepCol(s)}"></i>${t}</span>`).join('') + '<span style="margin-left:auto">Click a node to view the pipeline up to that point</span>';
  if (ST.step === 1 || !d) { host.innerHTML = `<span class="hint" style="padding:20px">${ST.step === 1 ? 'Step 1 sets up the images. The pipeline of the selected diagram appears here from step 2.' : 'Draft a diagram in step 2 to see its pipeline.'}</span>`; return; }
  const N = nodesOf(d), o = opt();
  host.innerHTML = N.map((n, i) => `${i ? '<span class="wire"></span>' : ''}<button class="node ${i === ST.node ? 'sel' : ''} ${n.off ? 'off' : ''}" data-i="${i}" title="${esc(n.t + ' · ' + n.s)}"><span class="band" style="background:${stepCol(n.step)}"></span><span class="th">${(renderSheet(d, o, i + 1).svg || '')}</span><span class="t"><b>${esc(n.t)}</b><span>${esc(n.s)}</span></span>${n.warn ? '<span class="err" title="Needs the image model"></span>' : ''}</button>`).join('');
  $$('.node', host).forEach(b => b.onclick = () => { const i = +b.dataset.i, n = N[i]; ST.node = i; if (n.kind === 'layer') { ST.layerSel = n.ref.id; if (ST.step !== 4) ST.step = 4; } else if (n.kind === 'bg' || n.kind === 'read') { if (ST.step !== 3) ST.step = 3; } else if (ST.step < 5 && n.kind === 'write') ST.step = 5; renderAll(); });
  const s = $('.node.sel', host); if (s) s.scrollIntoView({ block: 'nearest', inline: 'nearest' });
}

/* ---------- right: brief and reasoning ---------- */
function renderRight() {
  const R = $('#right'), o = opt(), d = cur();
  const sources = `<div class="rsec"><h4>Sources</h4>${PROJECT.sources.map(s => `<div style="font-size:12px"><b>${esc(s.id === 'xl' ? ST.xl.source || s.name : s.name)}</b> <span class="faint">· ${esc(s.what)}</span></div>`).join('')}<div style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" id="xlBtn">${ic('upload')}Import updated Excel</button><button class="btn sm" id="briefBtn">${ic('upload')}Add brief text</button></div>${ST.brief ? `<span class="hint">Brief text loaded: ${ST.brief.length.toLocaleString()} characters. Claude reads it with every request.</span>` : `<span class="hint">The competition brief itself is not in this project yet. Paste or upload its text and Claude will read it.</span>`}<textarea class="input" id="briefTxt" rows="3" placeholder="Paste brief text here">${esc(ST.brief.slice(0, 2000))}</textarea></div>`;
  if (ST.step === 1 || !d) {
    R.innerHTML = `<div class="col-h"><h2>Brief</h2><p>What every diagram has to prove. Claude reads all of this with each request.</p></div><div class="col-b">
      <div class="rsec"><h4>Client steer · Meeting 3</h4>${PROJECT.steer.map(s => `<div class="quote">${esc(s)}</div>`).join('')}</div>
      <div class="rsec"><h4>Key figures</h4><dl class="facts">${PROJECT.facts.map(x => `<div><dt>${esc(x[0])}</dt><dd style="margin:0">${esc(x[1])}</dd></div>`).join('')}</dl></div>
      <div class="rsec"><h4>${esc(o.name)} · ${esc(o.tag)}</h4><span style="font-size:12.5px">${esc(o.idea)}</span><dl class="facts"><div><dt>Audit verdict</dt><dd style="margin:0">${esc(o.audit.verdict)} · wow ${o.audit.wow}, day one ${o.audit.day1}</dd></div><div><dt>GF + L1 + ½L2</dt><dd style="margin:0">${o.audit.gla.filter(x => x != null).reduce((a, b) => a + b, 0).toFixed(0)}k m² of 200k</dd></div><div><dt>Anchors apart</dt><dd style="margin:0">${o.audit.anchorsM} m</dd></div><div><dt>PUA to shop</dt><dd style="margin:0">≈${o.audit.puaM} m, past a parking deck</dd></div></dl></div>
      ${sources}</div>`;
  } else {
    const r = row(d.id), crit = ST.xl.criteria.filter(c => c.proof.includes(d.id)), checks = checksFor(d, o);
    const n = s => checks.filter(c => c.state === s).length;
    R.innerHTML = `<div class="col-h"><h2>${esc(d.id)} · reasoning</h2><p>How this diagram answers the brief for ${esc(o.name)}. Checks are measured on the plan, so they change as you edit.</p></div><div class="col-b">
      <div class="rsec"><h4>The Excel says</h4><div class="quote"><span class="faint">Show:</span> ${esc(r.show)}</div><div class="quote"><span class="faint">Succeeds when:</span> ${esc(r.succeeds || '—')}</div></div>
      <div class="rsec"><h4>Checks <span>${n('pass')} pass · ${n('fail')} fail · ${n('warn') + n('todo')} open</span></h4>${checks.map(c => `<div class="chk"><span class="st ${c.state}">${{ pass: '✓', fail: '✕', warn: '!', todo: '·' }[c.state]}</span><span>${esc(c.t)}${c.val ? `<br><span class="v">${esc(c.val)}</span>` : ''}</span></div>`).join('') || '<span class="hint">No checks defined for this row.</span>'}</div>
      <div class="rsec"><h4>Claude's thinking <span>${esc(d.by)}</span></h4>${ST.busy ? '<div class="think">Thinking…</div>' : `<div class="think">${d.reasoning.length ? `<ul>${d.reasoning.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : 'No reasoning recorded.'}${d.risks.length ? `<b>What it will expose</b><ul>${d.risks.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${d.prompts.length ? `<b>Prompt by prompt</b><ul>${d.prompts.slice(-4).map(p => `<li>“${esc(p.q)}” → ${esc(p.by === 'Claude' && p.a ? p.a : p.done.join(', ') || 'no change')}</li>`).join('')}</ul>` : ''}<span class="by">${d.by === 'Claude' ? 'Written by Claude from the Excel row, the criteria and the audit.' : 'Built-in recipe. Connect Claude for reasoning written from the Excel row and the brief.'}</span></div>`}</div>
      <div class="rsec"><h4>Scored under · ${crit.length} criteria</h4>${crit.map(c => `<div class="crit"><span class="ci">${c.id} · ${esc(c.domain)}</span><b>${esc(c.name)}</b><span class="lk">${esc(c.look)}</span></div>`).join('') || '<span class="hint">No Handbook criterion names this diagram as proof.</span>'}</div>
      <div class="rsec"><h4>Criteria coverage · ${esc(o.name)}</h4>${coverage(o)}</div>
      ${sources}</div>`;
  }
  $('#xlBtn').onclick = () => $('#xlIn').click();
  $('#briefBtn').onclick = () => $('#briefIn').click();
  $('#briefTxt').onchange = e => { ST.brief = e.target.value; save(); renderRight(); toast('Brief text saved. Claude will read it with every request.'); };
}
function coverage(o) {
  const doms = {}; ST.xl.criteria.forEach(c => { const D = doms[c.domain] || (doms[c.domain] = { n: 0, ok: 0 }); D.n++; if (c.proof.some(id => ST.D[id])) D.ok++; });
  return `<div class="cov">${Object.entries(doms).map(([k, v]) => `<div class="r"><span>${esc(k)}</span><span class="bar"><i style="width:${v.ok / v.n * 100}%"></i></span><span class="mono">${v.ok}/${v.n}</span></div>`).join('')}<span class="hint">A criterion counts once a diagram that proves it is drafted. ${ST.xl.criteria.filter(c => c.proof.some(id => ST.D[id])).length} of ${ST.xl.criteria.length} covered.</span></div>`;
}

/* ---------- export ---------- */
async function saveFile(name, data, mime) {
  await capReady;
  if (DL) { try { await DL.save({ filename: name, data: data instanceof Uint8Array ? new Blob([data], { type: mime }) : data }); return 'saved'; } catch (e) { if (e.code === 'declined') { toast('Save declined.'); return 'declined'; } if (e.code !== 'unavailable' && e.code !== 'not_granted') { toast('Save failed: ' + esc(e.message || e.code)); return 'failed'; } } }
  const url = URL.createObjectURL(new Blob([data], { type: mime })); const a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 8000); return 'downloaded';
}
async function exportPdf(what) {
  const d = cur(), o = opt(), jobs = [];
  if (what === 'row') OPTS.forEach(x => jobs.push([d, x])); else if (what === 'col') ST.xl.diagrams.forEach(r => { if (ST.D[r.id]) jobs.push([ST.D[r.id], o]); }); else jobs.push([d, o]);
  const sheets = jobs.map(([dd, oo]) => renderSheet(dd, oo).svg).filter(Boolean);
  const res = await sheetsToPdf(sheets, { title: `RMUH ${what === 'col' ? o.name + ' diagram set' : d.id + ' ' + d.name}` });
  const name = what === 'row' ? `RMUH_all-options_${d.id}_${d.name.replace(/[^\w]+/g, '-')}.pdf` : what === 'col' ? `RMUH_${o.name}_diagram-set.pdf` : `RMUH_${o.name}_${d.id}_${d.name.replace(/[^\w]+/g, '-')}.pdf`;
  const how = await saveFile(name, res.bytes, 'application/pdf');
  jobs.forEach(([dd, oo]) => { setStatus(dd.id, oo.name, 'Drawn'); ST.exported[dd.id + ':' + oo.id] = { when: new Date().toLocaleString(), pages: sheets.length, size: res.size, how, layers: [...new Set(res.reports.flatMap(r => r.layers.map(l => l.name)))], raster: res.reports[0].raster }; });
  save(); renderAll(); toast(`${name}: ${sheets.length} page${sheets.length > 1 ? 's' : ''}, ${(res.size / 1024 / 1024).toFixed(2)} MB, ${how}.`);
  return res;
}
async function exportSvg() {
  const d = cur(), o = opt(); let svg = renderSheet(d, o).svg;
  for (const m of [...svg.matchAll(/href="([^"]+)"/g)]) if (!m[1].startsWith('data:') && !m[1].startsWith('#')) { try { svg = svg.split(m[1]).join(await toDataUrl(m[1])); } catch (e) {} }
  const name = `RMUH_${o.name}_${d.id}_${d.name.replace(/[^\w]+/g, '-')}.svg`;
  const how = await saveFile(name, sheetToSvg(svg), 'image/svg+xml'); setStatus(d.id, o.name, 'Drawn'); save(); renderAll(); toast(`${name} ${how}.`);
}
function trackerCsv() {
  const q = s => '"' + String(s || '').replace(/"/g, '""') + '"';
  return [['ID', 'Diagram', 'What to show', 'Succeeds when', ...OPTS.map(o => o.name)].map(q).join(',')].concat(ST.xl.diagrams.map(r => [r.id, r.name, r.show, r.succeeds, ...OPTS.map(o => r.status[o.name] || 'Not started')].map(q).join(','))).join('\n');
}

/* ---------- files in ---------- */
$('#fileIn').onchange = async e => {
  const files = [...e.target.files]; e.target.value = ''; const o = opt();
  for (const file of files) {
    const url = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(file); });
    const img = new Image(); await new Promise(r => { img.onload = r; img.onerror = r; img.src = url; });
    if (ST.fileMode === 'replace') { const v = o.views.find(x => x.id === ST.viewSel); const same = v.w && Math.abs(v.w / v.h - img.naturalWidth / img.naturalHeight) < .01; v.url = url; v.w = img.naturalWidth; v.h = img.naturalHeight; v.note = `Replaced with ${file.name}.${same ? ' Same proportions, so the anchors were kept.' : ' Different proportions: check the anchors.'}`; toast(`${esc(v.name)} on ${esc(o.name)} replaced. Every diagram using it has updated.`); }
    else { const v = { id: uid('v'), name: file.name.replace(/\.[^.]+$/, ''), kind: 'view', src: 'img', url, w: img.naturalWidth, h: img.naturalHeight, anchors: {}, note: 'Uploaded. Place anchors so overlays can draw on it.' }; o.views.push(v); ST.viewSel = v.id; }
  }
  renderAll();
};
$('#xlIn').onchange = async e => { const file = e.target.files[0]; e.target.value = ''; if (!file) return; try { const x = xlFromSheets(await readXlsx(await file.arrayBuffer())); if (!x.diagrams.length) throw new Error('no rows starting with D01…'); x.source = file.name; ST.xl = x; Object.values(ST.D).forEach(d => { const r = row(d.id); if (r) { d.name = r.name; d.show = r.show; d.succeeds = r.succeeds; } }); save(); renderAll(); toast(`${esc(file.name)}: ${x.diagrams.length} diagrams and ${x.criteria.length} criteria loaded.`); } catch (err) { toast('Could not read that workbook: ' + esc(err.message)); } };
$('#briefIn').onchange = async e => { const file = e.target.files[0]; e.target.value = ''; if (!file) return; ST.brief = (await file.text()).slice(0, 200000); save(); renderRight(); toast(`${esc(file.name)} loaded as brief text.`); };

/* ---------- boot ---------- */
let theme = 'system';
function applyTheme() { const r = document.documentElement; if (theme === 'system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', theme); $('#themeBtn').innerHTML = ic(theme === 'light' ? 'sun' : theme === 'dark' ? 'moon' : 'auto'); try { localStorage.setItem('dl-flow-theme', theme); } catch (e) {} }
$('#themeBtn').onclick = () => { theme = { system: 'light', light: 'dark', dark: 'system' }[theme]; applyTheme(); };
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z' && !e.target.closest('input,textarea')) { e.preventDefault(); undo(); }
  if (e.key === 'Escape') { ST.placing = null; ST.layerSel = null; renderLeft(); renderViewer(); }
  if ((e.key === 'Delete' || e.key === 'Backspace') && ST.step === 4 && ST.layerSel && !e.target.closest('input,textarea')) { const d = cur(); snapshot('Remove layer'); d.layers = d.layers.filter(x => x.id !== ST.layerSel); ST.layerSel = null; save(); renderAll(); toast('Layer removed.', ['Undo', undo]); }
});
addEventListener('resize', () => renderViewer());
(function boot() {
  try { theme = localStorage.getItem('dl-flow-theme') || 'system'; } catch (e) {}
  applyTheme(); hydrate(); load();
  // First visit: the selected diagram has a built-in draft so the workflow is visible at once.
  if (!Object.keys(ST.D).length) { const p = recipeFor('D07'); ST.D.D07 = makeDiagram('D07', Object.assign(p, { reasoning: [p.why] }), 'built-in recipe'); }
  // Read every image's real size, so anchors and fitting are exact.
  OPTS.forEach(o => o.views.forEach(v => { if (v.w) return; const im = new Image(); im.onload = () => { v.w = im.naturalWidth; v.h = im.naturalHeight; renderViewer(); }; im.src = v.url; }));
  renderAll();
})();
