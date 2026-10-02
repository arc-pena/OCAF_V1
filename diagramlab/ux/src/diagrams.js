/* DiagramLab prototype — diagram engine.
   A sheet is A3 landscape in millimetres (viewBox 420 x 297). The content group draws the site in metres
   at 1:1000, so 1 unit = 1 m on site = 1 mm on paper. Print sizes (strokes, type) are given in pt and
   converted with PT (1 pt = 0.3528 mm), so a 6 pt label really is 6 pt on the printed A3.
   Every overlay is a <g data-k="stable/key"> so the editor, the layer list and the matrix all address
   the same object by key, never by position. */

const PT = 0.3528;
const pt = v => +(v * PT).toFixed(3);
const f = n => Math.round(n * 100) / 100;
function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
let UID = 0;
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const att = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => `${k}="${v}"`).join(' ');
const P2 = a => a.map(p => f(p[0]) + ',' + f(p[1])).join(' ');
const pg = (pts, o = {}) => `<polygon points="${P2(pts)}" ${att(o)}/>`;
const pl = (pts, o = {}) => `<polyline points="${P2(pts)}" ${att(Object.assign({ fill: 'none' }, o))}/>`;
const G = (k, inner, extra = '') => `<g data-k="${k}" ${extra}>${inner}</g>`;

function hex2rgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function rgb2hex(r) { return '#' + r.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join(''); }
function shade(h, k) { return rgb2hex(hex2rgb(h).map(v => v * (1 - k))); }
function mix(a, b, t) { const A = hex2rgb(a), B = hex2rgb(b); return rgb2hex(A.map((v, i) => v + (B[i] - v) * t)); }

/* Graphic tokens. These belong to the Style Profile, not the app chrome. Values were picked to match the
   reference sheets described in brief §2a (red external route, dashed blue internal, cyan views, green landscape). */
const TOK = {
  ext: '#D7261E', int: '#2F6BD8', view: '#14AECB', green: '#4E9F3D', axis: '#F08A24', hi: '#F2C230',
  magenta: '#D6338A', ink: '#111111', water: '#CFE2EC', park: '#D6E7CB',
  routeW: 4, loopW: 1.2, outline: 1.6, label: 6, legend: 5.5, title: 10,
};
const TOK_DEFAULT = Object.assign({}, TOK);
const PROG = {
  culture: { en: 'Culture', zh: '文化', c: '#F2BFA8', code: 'C-05-1' },
  market: { en: 'Market hall', zh: '市集', c: '#F3DC8C', code: 'C-05-2T' },
  community: { en: 'Community', zh: '社区', c: '#B4D7BF', code: 'C-06-1' },
  learning: { en: 'Learning', zh: '学习', c: '#BBCDEE', code: 'C-06-3' },
};
const SITE = { x: 108, y: 58, w: 226, d: 156 };
const WATER = [[0, 238], [60, 233], [120, 236], [180, 245], [240, 243], [300, 236], [360, 232], [400, 235], [400, 280], [0, 280]];
const PARK = [[14, 96], [84, 92], [88, 166], [18, 170]];
const CONTEXT = (() => {
  const r = rng(11), out = [];
  for (let gx = 4; gx < 392; gx += 36) for (let gy = 6; gy < 226; gy += 32) {
    const w = 15 + r() * 15, d = 12 + r() * 13, x = gx + r() * (32 - w), y = gy + r() * (28 - d), h = 6 + r() * 20;
    if (r() < .14) continue;
    if (x + w > SITE.x - 8 && x < SITE.x + SITE.w + 8 && y + d > SITE.y - 8 && y < SITE.y + SITE.d + 8) continue;
    if (x + w > 10 && x < 92 && y + d > 88 && y < 174) continue;
    if (y + d > 226) continue;
    out.push({ x, y, w, d, h });
  }
  return out;
})();

const OPTIONS = [
  { id: 'A', name: 'Terraces', zh: '台地', hex: '#0B9E8C',
    b: [{ x: 122, y: 72, w: 86, d: 46, h: 22, p: 'culture' }, { x: 224, y: 70, w: 58, d: 58, h: 38, p: 'learning' }, { x: 130, y: 142, w: 62, d: 56, h: 16, p: 'market' }, { x: 236, y: 146, w: 84, d: 52, h: 28, p: 'community' }],
    route: [[90, 226], [150, 216], [206, 204], [214, 136], [262, 136], [300, 118], [316, 86], [334, 50]] },
  { id: 'B', name: 'Courtyard', zh: '合院', hex: '#DD8318',
    b: [{ x: 124, y: 70, w: 190, d: 30, h: 26, p: 'culture' }, { x: 124, y: 104, w: 36, d: 92, h: 20, p: 'learning' }, { x: 278, y: 104, w: 36, d: 92, h: 32, p: 'community' }, { x: 172, y: 170, w: 92, d: 28, h: 14, p: 'market' }],
    route: [[90, 226], [150, 214], [166, 186], [196, 150], [244, 132], [270, 156], [272, 206], [340, 218]] },
  { id: 'C', name: 'Towers', zh: '塔楼', hex: '#7656EE',
    b: [{ x: 126, y: 76, w: 44, d: 44, h: 52, p: 'learning' }, { x: 262, y: 70, w: 46, d: 46, h: 46, p: 'community' }, { x: 204, y: 146, w: 46, d: 44, h: 40, p: 'culture' }, { x: 128, y: 160, w: 58, d: 40, h: 12, p: 'market' }],
    route: [[90, 226], [194, 214], [194, 134], [226, 126], [250, 132], [314, 130], [330, 92], [336, 52]] },
  { id: 'D', name: 'Field', zh: '田野', hex: '#D93B76',
    b: [{ x: 122, y: 74, w: 44, d: 36, h: 14, p: 'market' }, { x: 182, y: 68, w: 50, d: 40, h: 18, p: 'culture' }, { x: 250, y: 76, w: 66, d: 34, h: 22, p: 'learning' }, { x: 128, y: 136, w: 52, d: 42, h: 12, p: 'community' }, { x: 198, y: 146, w: 46, d: 50, h: 24, p: 'culture' }, { x: 262, y: 136, w: 56, d: 58, h: 16, p: 'market' }],
    route: [[90, 226], [118, 206], [186, 124], [240, 124], [252, 118], [324, 124], [338, 60]] },
];

/* ---------- projections ---------- */
function mkAxo(cx = 200, cy = 156, s = .8, q = .56, k = 1.05, ox = 200, oy = 140) {
  const a = Math.PI / 6, c = Math.cos(a), sn = Math.sin(a);
  const P = (x, y, z = 0) => { const u = x - ox, v = y - oy; return [cx + (u * c - v * sn) * s, cy + (u * sn + v * c) * s * q - z * k * s]; };
  P.inv = (X, Y) => { const A = (X - cx) / s, B = (Y - cy) / (s * q); return [ox + A * c + B * sn, oy - A * sn + B * c]; };
  return P;
}
const PROJ = {
  plan: Object.assign((x, y) => [x, y], { inv: (X, Y) => [X, Y] }),
  oblique: Object.assign((x, y, z = 0) => [x, y - z * .62], { inv: (X, Y) => [X, Y] }),
  axo: mkAxo(),
};

/* ---------- geometry helpers ---------- */
function crPath(P, closed) {
  const n = P.length; if (n < 2) return '';
  let d = `M${f(P[0][0])} ${f(P[0][1])}`;
  const segs = closed ? n : n - 1;
  for (let i = 0; i < segs; i++) {
    const p0 = P[closed ? (i - 1 + n) % n : Math.max(i - 1, 0)], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[closed ? (i + 2) % n : Math.min(i + 2, n - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + (closed ? 'Z' : '');
}
function crSample(P, steps = 10) {
  const out = [], n = P.length;
  for (let i = 0; i < n - 1; i++) {
    const p0 = P[Math.max(i - 1, 0)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(i + 2, n - 1)];
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(j => .5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  out.push(P[n - 1].slice());
  return out;
}
function dirAt(S, i) { const a = S[Math.max(i - 1, 0)], b = S[Math.min(i + 1, S.length - 1)]; let dx = b[0] - a[0], dy = b[1] - a[1]; const l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; }
function head(tip, dir, len, wid, o) {
  const b = [tip[0] - dir[0] * len, tip[1] - dir[1] * len];
  return pg([tip, [b[0] - dir[1] * wid / 2, b[1] + dir[0] * wid / 2], [b[0] + dir[1] * wid / 2, b[1] - dir[0] * wid / 2]], o);
}
/* Tapered flow arrow (brief §2a primitive): spine spline, start/end width, arrowhead, fill or gradient. */
function taper(P, w0, w1, fill, op = 1, hs = 2) {
  const S = crSample(P, 10), n = S.length, L = [], R = [];
  for (let i = 0; i < n; i++) {
    const [dx, dy] = dirAt(S, i), w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
    L.push([S[i][0] - dy * w, S[i][1] + dx * w]); R.push([S[i][0] + dy * w, S[i][1] - dx * w]);
  }
  const e = S[n - 1], [dx, dy] = dirAt(S, n - 1), hw = w1 * hs, hl = w1 * hs * 1.15;
  const tip = [e[0] + dx * hl, e[1] + dy * hl];
  const pts = [...L, [e[0] - dy * hw, e[1] + dx * hw], tip, [e[0] + dy * hw, e[1] - dx * hw], ...R.reverse()];
  return pg(pts, { fill, 'fill-opacity': op });
}
function gradDef(id, a, b, c1, c2, o1 = 1, o2 = 1) {
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}"><stop offset="0" stop-color="${c1}" stop-opacity="${o1}"/><stop offset="1" stop-color="${c2}" stop-opacity="${o2}"/></linearGradient>`;
}
function rectPts(b, inset = 0) { return [[b.x + inset, b.y + inset], [b.x + b.w - inset, b.y + inset], [b.x + b.w - inset, b.y + b.d - inset], [b.x + inset, b.y + b.d - inset]]; }
function roundRectPts(b, inset, r) {
  const x0 = b.x + inset, y0 = b.y + inset, x1 = b.x + b.w - inset, y1 = b.y + b.d - inset;
  return [[x0 + r, y0], [x1 - r, y0], [x1, y0 + r], [x1, y1 - r], [x1 - r, y1], [x0 + r, y1], [x0, y1 - r], [x0, y0 + r]];
}
function hull(points) {
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (const q of p.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
const ctr = b => [b.x + b.w / 2, b.y + b.d / 2];

/* Text: every label holds zh + en (brief §2a bilingual text); layout 'stack' (zh over en) or 'inline'. */
function bi(x, y, zh, en, size = TOK.label, o = {}) {
  const fs = pt(size), anchor = o.anchor || 'middle', fill = o.fill || '#111', w = o.weight || 500;
  if (o.inline) return `<text class="dg" x="${f(x)}" y="${f(y)}" font-size="${fs}" text-anchor="${anchor}" fill="${fill}" font-weight="${w}"><tspan class="dg-zh">${esc(zh)}</tspan> ${esc(en)}</text>`;
  return `<text class="dg" x="${f(x)}" y="${f(y)}" font-size="${fs}" text-anchor="${anchor}" fill="${fill}" font-weight="${w}"><tspan class="dg-zh" x="${f(x)}">${esc(zh)}</tspan><tspan x="${f(x)}" dy="${f(fs * 1.1)}" font-size="${pt(size * .82)}" font-weight="400">${esc(en)}</tspan></text>`;
}
function txt(x, y, s, size, o = {}) {
  return `<text class="dg" x="${f(x)}" y="${f(y)}" font-size="${pt(size)}" ${att({ 'text-anchor': o.anchor, fill: o.fill, 'font-weight': o.weight, 'letter-spacing': o.ls })}>${esc(s)}</text>`;
}

/* Legend: auto-built rows, swatch + inline bilingual text, bottom-right inside the margin. */
function legend(items, x, y, o = {}) {
  const fs = pt(TOK.legend), row = fs * 2.2, w = o.w || 64, h = items.length * row + (o.title ? row * 1.1 : 0) + 3.4;
  const X = x === 'r' ? 398 - w : x, Y = y === 'b' ? 264 - h : y;
  let s = `<rect x="${f(X)}" y="${f(Y)}" width="${w}" height="${f(h)}" fill="#fff" fill-opacity=".94" stroke="#111" stroke-width="${pt(.5)}"/>`;
  let cy = Y + 1.7;
  if (o.title) { s += `<text class="dg" x="${f(X + 2.6)}" y="${f(cy + row * .62)}" font-size="${pt(TOK.legend)}" font-weight="600"><tspan class="dg-zh">${esc(o.title[0])}</tspan> ${esc(o.title[1])}</text>`; cy += row * 1.1; }
  for (const it of items) {
    const sx = X + 2.6, my = cy + row / 2;
    if (it.t === 'fill') s += `<rect x="${f(sx)}" y="${f(my - 1.4)}" width="5" height="2.8" fill="${it.c}" stroke="#111" stroke-width="${pt(.5)}"/>`;
    else if (it.t === 'dash') s += `<line x1="${f(sx)}" y1="${f(my)}" x2="${f(sx + 5)}" y2="${f(my)}" stroke="${it.c}" stroke-width="${pt(1.2)}" stroke-dasharray="${pt(2.4)} ${pt(1.4)}"/>`;
    else if (it.t === 'dot') s += `<circle cx="${f(sx + 2.5)}" cy="${f(my)}" r="1.1" fill="${it.c}"/>`;
    else if (it.t === 'tri') s += pg([[sx + 1, my - 1.4], [sx + 4, my], [sx + 1, my + 1.4]], { fill: it.c });
    else if (it.t === 'taper') s += taper([[sx, my], [sx + 3.8, my]], .5, 1.4, it.c, .9, 1);
    else if (it.t === 'circle') s += `<circle cx="${f(sx + 2.5)}" cy="${f(my)}" r="1.5" fill="${it.c}" fill-opacity=".25" stroke="${it.c}" stroke-width="${pt(.8)}"/>`;
    else s += `<line x1="${f(sx)}" y1="${f(my)}" x2="${f(sx + 5)}" y2="${f(my)}" stroke="${it.c}" stroke-width="${pt(it.w || 2)}" stroke-linecap="round"/>`;
    s += `<text class="dg" x="${f(sx + 7.4)}" y="${f(my + fs * .36)}" font-size="${fs}"><tspan class="dg-zh">${esc(it.zh)}</tspan> ${esc(it.en)}</text>`;
    cy += row;
  }
  return G('labels/legend', s);
}
function scaleBar(x, y) {
  let s = '';
  for (let i = 0; i < 5; i++) s += `<rect x="${x + i * 10}" y="${y}" width="10" height="1.2" fill="${i % 2 ? '#fff' : '#111'}" stroke="#111" stroke-width="${pt(.4)}"/>`;
  s += txt(x, y + 4.2, '0', 4.6) + txt(x + 20, y + 4.2, '20', 4.6, { anchor: 'middle' }) + txt(x + 50, y + 4.2, '50 m', 4.6, { anchor: 'middle' });
  s += `<g transform="translate(${x + 62},${y - 2})">${pg([[0, -5], [2.4, 2], [0, .8], [-2.4, 2]], { fill: '#111' })}${txt(0, 6.2, 'N', 4.6, { anchor: 'middle', weight: 600 })}</g>`;
  return G('symbols/scale-north', s);
}

/* ---------- base layers ---------- */
function prism(P, b, o) {
  const c = rectPts(b), z0 = b.z || 0, z1 = z0 + b.h;
  const B = c.map(q => P(q[0], q[1], z0)), T = c.map(q => P(q[0], q[1], z1));
  const faces = [0, 1, 2, 3].map(i => { const j = (i + 1) % 4; return { i, poly: [B[i], B[j], T[j], T[i]], d: (B[i][1] + B[j][1]) / 2 }; }).sort((a, b) => a.d - b.d);
  const sh = o.shades || [.16, .3, .08, .24];
  let s = '';
  for (const fc of faces) s += pg(fc.poly, { fill: o.side ? shade(o.side, sh[fc.i]) : 'none', 'fill-opacity': o.op, stroke: o.stroke || 'none', 'stroke-width': o.sw, 'stroke-linejoin': 'round' });
  if (o.plates) for (let z = z0 + o.plates; z < z1 - .5; z += o.plates) s += pg(c.map(q => P(q[0], q[1], z)), { fill: 'none', stroke: o.plateStroke || o.stroke, 'stroke-width': o.psw || o.sw, 'stroke-opacity': .5 });
  s += pg(T, { fill: o.top, 'fill-opacity': o.op, stroke: o.stroke || 'none', 'stroke-width': o.sw, 'stroke-linejoin': 'round' });
  return s;
}
const sortB = (P, arr) => arr.slice().sort((a, b) => P(a.x + a.w / 2, a.y + a.d / 2, 0)[1] - P(b.x + b.w / 2, b.y + b.d / 2, 0)[1]);
function ground(P, st) {
  let s = pg([[0, 0], [400, 0], [400, 280], [0, 280]].map(p => P(p[0], p[1], 0)), { fill: st.ground || '#fff' });
  s += pg(WATER.map(p => P(p[0], p[1], 0)), { fill: st.water || TOK.water });
  s += pg(PARK.map(p => P(p[0], p[1], 0)), { fill: st.park || TOK.park });
  return s;
}
function contextLayer(P, st, mode) {
  let s = ground(P, st);
  if (mode === 'plan') s += CONTEXT.map(b => `<rect x="${f(b.x)}" y="${f(b.y)}" width="${f(b.w)}" height="${f(b.d)}" ${att({ fill: st.fill, stroke: st.stroke, 'stroke-width': st.sw })}/>`).join('');
  else s += sortB(P, CONTEXT).map(b => prism(P, b, { top: st.top || st.fill, side: st.side || st.fill, stroke: st.stroke, sw: st.sw, shades: st.shades })).join('');
  return G('base/context', s);
}

/* ---------- renderers, one per template archetype ---------- */
const R = {};

R.views = (o, c) => {
  const P = PROJ.oblique, u = c.uid;
  let defs = `<linearGradient id="fg${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E9E9E9"/><stop offset="1" stop-color="#9C9C9C"/></linearGradient>`;
  const st = { top: `url(#fg${u})`, side: '#8C8C8C', stroke: '#111', sw: pt(.35), water: '#E4ECEF', park: '#EEF3EA' };
  let s = ground(P, st) + sortB(P, CONTEXT).map(b => prism(P, b, Object.assign({}, st, { side: '#8C8C8C' }))).join('');
  s = G('base/context', s);
  const cor = [[[30, 186], [70, 156], [114, 134]], [[176, 268], [192, 236], [204, 214]], [[398, 128], [366, 120], [340, 112]], [[226, 6], [232, 30], [238, 52]]];
  let g = '';
  cor.forEach((p, i) => { defs += gradDef(`gc${u}${i}`, p[0], p[p.length - 1], TOK.green, TOK.green, .18, .9); g += taper(p, 13, 4.4, `url(#gc${u}${i})`, 1, 1.6); });
  const mass = sortB(P, o.b).map(b => prism(P, b, { top: `url(#fg${u})`, side: '#7E7E7E', stroke: '#111', sw: pt(.8) })).join('');
  let v = '', ch = '';
  const [scx, scy] = [SITE.x + SITE.w / 2, SITE.y + SITE.d / 2];
  o.b.forEach(b => {
    const [cx, cy] = ctr(b); let dx = cx - scx, dy = cy - scy; const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
    const a = P(cx + dx * b.w * .35, cy + dy * b.d * .35, b.h), e = [a[0] + dx * 30, a[1] + dy * 30];
    v += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(e[0])}" y2="${f(e[1])}" stroke="${TOK.view}" stroke-width="${pt(1.6)}"/>` + head([e[0] + dx * 3.2, e[1] + dy * 3.2], [dx, dy], 3.2, 2.6, { fill: TOK.view });
    for (let x = b.x + 4; x < b.x + b.w - 2; x += 6) { const [X, Y] = P(x, b.y + b.d, b.h); ch += pl([[X - 1.4, Y + .9], [X, Y + 2.4], [X + 1.4, Y + .9]], { stroke: TOK.view, 'stroke-width': pt(.7) }); }
  });
  const lg = legend([{ t: 'taper', c: TOK.green, zh: '绿化廊道', en: 'Greenery corridor' }, { t: 'line', c: TOK.view, zh: '主要视线', en: 'Main view', w: 1.6 }, { t: 'tri', c: TOK.view, zh: '房间视野', en: 'Room view' }, { t: 'fill', c: '#BDBDBD', zh: '建筑', en: 'Building' }], 'r', 'b', { title: ['图例', 'Legend'] });
  return `<defs>${defs}</defs>${s}${G('landscape/green-corridors', g)}${G('base/massing', mass)}${G('views/view-arrows', v)}${G('views/room-view-ticks', ch)}${lg}`;
};

function drawRoute(P, pts, w) {
  const S = pts.map(p => P(p[0], p[1], 0)), n = S.length;
  const sm = crSample(S, 10), d = dirAt(sm, sm.length - 1), e = S[n - 1], W = pt(w);
  return `<path d="${crPath(S)}" fill="none" stroke="${TOK.ext}" stroke-width="${W}" stroke-linecap="round" stroke-linejoin="round"/>` +
    head([e[0] + d[0] * W * 2.6, e[1] + d[1] * W * 2.6], d, W * 3.4, W * 3.2, { fill: TOK.ext }) +
    `<circle cx="${f(S[0][0])}" cy="${f(S[0][1])}" r="${f(W * .95)}" fill="#fff" stroke="${TOK.ext}" stroke-width="${f(W * .55)}"/>`;
}
R.circ = (o, c) => {
  const P = PROJ.axo, route = c.route || o.route;
  const ctx = contextLayer(P, { fill: '#F5F5F5', top: '#FAFAFA', side: '#EEEEEE', stroke: '#9A9A9A', sw: pt(.3), water: '#E2ECF1', park: '#E6EFE0', shades: [.03, .07, .02, .05] }, 'axo');
  const extra = (c.extraRoutes || []).map(r => `<g data-k="${r.k}"><path d="${crPath(r.pts.map(p => P(p[0], p[1], 0)))}" fill="none" stroke="${TOK.axis}" stroke-width="${pt(2.4)}" stroke-dasharray="${pt(5)} ${pt(3)}" stroke-linecap="round"/></g>`).join('');
  const mass = sortB(P, o.b).map(b => prism(P, b, { top: '#FFFFFF', side: '#FFFFFF', op: .8, stroke: '#3A3A3A', sw: pt(.5), plates: 4.2, psw: pt(.3), shades: [.03, .08, .01, .06] })).join('');
  let loops = '';
  o.b.forEach((b, i) => {
    if (b.w < 30 || b.d < 26) return;
    const L = roundRectPts(b, 5, 4).map(q => P(q[0], q[1], b.h));
    loops += `<path d="${crPath(L, true)}" fill="none" stroke="${TOK.int}" stroke-width="${pt(TOK.loopW)}" stroke-dasharray="${pt(3)} ${pt(2)}"/>`;
    const a = L[i % 2 ? 4 : 0], bb = L[i % 2 ? 5 : 1], d = [bb[0] - a[0], bb[1] - a[1]], l = Math.hypot(...d) || 1;
    const m = [(a[0] + bb[0]) / 2, (a[1] + bb[1]) / 2];
    loops += head([m[0] + d[0] / l * 1.6, m[1] + d[1] / l * 1.6], [d[0] / l, d[1] / l], 2.2, 2, { fill: TOK.int });
  });
  const lg = legend([{ t: 'line', c: TOK.ext, zh: '外部流线', en: 'External circulation', w: 3 }, { t: 'dash', c: TOK.int, zh: '内部流线', en: 'Internal circulation' }].concat(c.extraRoutes && c.extraRoutes.length ? [{ t: 'dash', c: TOK.axis, zh: '服务流线', en: 'Service route' }] : []), 'r', 'b', { title: ['图例', 'Legend'], w: 66 });
  return `${ctx}${G('circulation/external-route', drawRoute(P, route, c.routeW || TOK.routeW))}${G('base/massing', mass)}${extra}${G('circulation/internal-loops', loops)}${G('labels/place-names', bi(...P(60, 252, 0), '滨水广场', 'River plaza', 5.5))}${lg}`;
};

R.ground = (o, c) => {
  const P = PROJ.plan, phase = c.v === 'phase';
  const ctx = contextLayer(P, { fill: '#CFCFCF', water: TOK.water, park: TOK.park }, 'plan');
  const PH = ['#F4D06F', '#9FD1C9', '#C9B6E8'];
  let z = '', lab = '';
  o.b.forEach((b, i) => {
    const fill = phase ? PH[i % 3] : PROG[b.p].c;
    z += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}" fill="${fill}" stroke="#111" stroke-width="${pt(TOK.outline)}"/>`;
    z += `<rect x="${b.x + 2.6}" y="${b.y + 2.6}" width="${b.w - 5.2}" height="${b.d - 5.2}" fill="none" stroke="#111" stroke-width="${pt(.5)}" stroke-dasharray="${pt(2)} ${pt(1.5)}"/>`;
    const [cx, cy] = ctr(b);
    if (phase) lab += `<circle cx="${cx}" cy="${cy - 2}" r="4.4" fill="#111"/>` + txt(cx, cy - .4, String(i % 3 + 1), 13, { anchor: 'middle', fill: '#fff', weight: 700 }) + bi(cx, cy + 6.4, ['一期', '二期', '三期'][i % 3], 'Phase ' + (i % 3 + 1), 5.5);
    else lab += bi(cx, cy - 1, PROG[b.p].zh, PROG[b.p].en, 6);
  });
  const bd = `<rect x="${SITE.x - 6}" y="${SITE.y - 6}" width="${SITE.w + 12}" height="${SITE.d + 12}" fill="none" stroke="${TOK.ext}" stroke-width="${pt(1.2)}" stroke-dasharray="${pt(6)} ${pt(3)}"/>`;
  const ex = SITE.x - 6, ey = SITE.y + SITE.d - 18;
  const ent = pg([[ex - 7, ey - 3.2], [ex - 1, ey], [ex - 7, ey + 3.2]], { fill: '#111' }) + pg([[200, SITE.y + SITE.d + 13], [203.2, SITE.y + SITE.d + 7], [196.8, SITE.y + SITE.d + 7]], { fill: TOK.ext }) + pg([[SITE.x + SITE.w + 13, SITE.y + 26], [SITE.x + SITE.w + 7, SITE.y + 29.2], [SITE.x + SITE.w + 7, SITE.y + 22.8]], { fill: TOK.int });
  const del = [[SITE.x + SITE.w - 20, SITE.y + SITE.d - 4], [SITE.x + SITE.w - 30, SITE.y + SITE.d - 4], [SITE.x + 40, SITE.y + 2]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="1.4" fill="${TOK.axis}"/>`).join('');
  const dropPts = [[SITE.x + SITE.w + 30, SITE.y + 150], [SITE.x + SITE.w + 14, SITE.y + 118], [SITE.x + SITE.w - 6, SITE.y + 108]];
  const drop = `<path d="${crPath(dropPts)}" fill="none" stroke="${TOK.axis}" stroke-width="${pt(1.4)}" stroke-dasharray="${pt(3)} ${pt(2)}"/>` + head([SITE.x + SITE.w - 9, SITE.y + 107.6], [-1, -.12], 3, 2.6, { fill: TOK.axis });
  const items = phase ? [{ t: 'fill', c: PH[0], zh: '一期', en: 'Phase 1 · 2028' }, { t: 'fill', c: PH[1], zh: '二期', en: 'Phase 2 · 2030' }, { t: 'fill', c: PH[2], zh: '三期', en: 'Phase 3 · 2032' }]
    : Object.values(PROG).map(p => ({ t: 'fill', c: p.c, zh: p.zh, en: p.en }));
  items.push({ t: 'tri', c: '#111', zh: '场地入口', en: 'Site entrance' }, { t: 'tri', c: TOK.ext, zh: '人行入口', en: 'Pedestrian' }, { t: 'tri', c: TOK.int, zh: '停车入口', en: 'Parking' }, { t: 'dot', c: TOK.axis, zh: '卸货点', en: 'Delivery' }, { t: 'dash', c: TOK.ext, zh: '用地红线', en: 'Site boundary' });
  return `${ctx}${G(phase ? 'phasing/zones' : 'program/zones', z)}${G('site/boundary', bd)}${G('symbols/entrances', ent + del)}${G('circulation/drop-off', drop)}${G('labels/zones', lab)}${scaleBar(12, 252)}${legend(items, 'r', 'b', { title: ['图例', 'Legend'], w: 60 })}`;
};

R.keyed = (o, c) => {
  const P = PROJ.plan, u = c.uid;
  const ctx = contextLayer(P, { fill: '#ECECEC', water: '#EEF4F6', park: '#EEF4EA' }, 'plan');
  const mass = o.b.map(b => `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}" fill="#DCDCDC" stroke="#B8B8B8" stroke-width="${pt(.4)}"/>`).join('');
  let defs = '', g = '';
  [[[30, 192], [76, 168], [116, 150]], [[200, 270], [206, 240], [214, 220]]].forEach((p, i) => { defs += gradDef(`kc${u}${i}`, p[0], p[2], TOK.green, TOK.green, .15, .85); g += taper(p, 14, 4.6, `url(#kc${u}${i})`, 1, 1.6); });
  const ax = [[[112, 132], [220, 134], [330, 126]], [[219, 52], [216, 136], [212, 222]]];
  let rb = '';
  ax.forEach(p => {
    rb += `<path d="${crPath(p)}" fill="none" stroke="${TOK.axis}" stroke-opacity=".38" stroke-width="9"/>`;
    const S = crSample(p, 8), d1 = dirAt(S, S.length - 1), d0 = dirAt(S, 0);
    rb += head([p[2][0] + d1[0] * 6, p[2][1] + d1[1] * 6], d1, 6, 12, { fill: TOK.axis, 'fill-opacity': .5 }) + head([p[0][0] - d0[0] * 6, p[0][1] - d0[1] * 6], [-d0[0], -d0[1]], 6, 12, { fill: TOK.axis, 'fill-opacity': .5 });
  });
  const hc = [[216, 134, 15], [150, 214, 10], [312, 128, 11]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${TOK.hi}" fill-opacity=".2" stroke="${TOK.hi}" stroke-width="${pt(1.2)}"/>`).join('');
  const CAT = [{ c: TOK.green, zh: '景观', en: 'Landscape', it: [['滨水草坪', 'Riverside lawn'], ['林荫步道', 'Shaded walk'], ['屋顶花园', 'Roof garden']], at: [[60, 182], [150, 226], [o.b[1].x + 10, o.b[1].y + 10]] },
    { c: TOK.axis, zh: '空间轴线', en: 'Spatial axes', it: [['东西文化轴', 'East–west culture axis'], ['南北滨水轴', 'North–south river axis']], at: [[300, 120], [222, 64]] },
    { c: TOK.int, zh: '节点', en: 'Nodes', it: [['中央广场', 'Central square'], ['市集入口', 'Market entrance'], ['码头', 'Pier']], at: [[226, 140], [140, 206], [330, 238]] }];
  let mk = '';
  CAT.forEach(cat => cat.at.forEach((p, i) => { mk += `<circle cx="${p[0]}" cy="${p[1]}" r="3.4" fill="${cat.c}" stroke="#fff" stroke-width="${pt(.8)}"/>` + txt(p[0], p[1] + 1.7, String(i + 1), 7, { anchor: 'middle', fill: '#fff', weight: 700 }); }));
  const lv = [[176, 108, '+36.00'], [300, 176, '+28.50'], [96, 244, '+12.00']].map(([x, y, t]) => pg([[x - 1.6, y - 2.6], [x + 1.6, y - 2.6], [x, y]], { fill: '#111' }) + txt(x + 2.4, y - .4, t, 5.5, { weight: 500 })).join('');
  let list = `<rect x="4" y="4" width="78" height="${CAT.reduce((a, c) => a + 6.4 + c.it.length * 4.6, 4)}" fill="#fff" fill-opacity=".94"/>`, ly = 8;
  CAT.forEach(cat => {
    list += `<rect x="7" y="${ly}" width="44" height="4.6" rx="2.3" fill="${cat.c}"/>` + `<text class="dg" x="9.4" y="${ly + 3.3}" font-size="${pt(5.5)}" fill="#fff" font-weight="600"><tspan class="dg-zh">${cat.zh}</tspan> ${cat.en}</text>`;
    ly += 6.4;
    cat.it.forEach((it, i) => { list += `<circle cx="9.6" cy="${ly + 1.3}" r="1.7" fill="${cat.c}"/>` + txt(9.6, ly + 2.3, String(i + 1), 4.5, { anchor: 'middle', fill: '#fff', weight: 700 }) + `<text class="dg" x="13.2" y="${ly + 2.6}" font-size="${pt(5.2)}"><tspan class="dg-zh">${it[0]}</tspan> ${it[1]}</text>`; ly += 4.6; });
  });
  return `<defs>${defs}</defs>${ctx}${G('base/massing', mass)}${G('landscape/green-corridors', g)}${G('analysis/axes', rb)}${G('analysis/highlights', hc)}${G('analysis/markers', mk)}${G('levels/elevation-tags', lv)}${G('labels/category-list', list)}`;
};

R.prog = (o, c) => {
  const P = PROJ.axo, u = c.uid, hl = c.v === 'highlight';
  const ctx = contextLayer(P, { top: '#E7E7E7', side: '#D2D2D2', fill: '#E7E7E7', stroke: '#9C9C9C', sw: pt(.25), water: '#DCE6EA', park: '#E1EADB' }, 'axo');
  let mass = '', tags = '';
  const big = o.b.reduce((a, b) => (b.w * b.d * b.h > a.w * a.d * a.h ? b : a));
  sortB(P, o.b).forEach(b => {
    if (hl) {
      mass += prism(P, b, b === big ? { top: TOK.magenta, side: TOK.magenta, op: .55, stroke: '#111', sw: pt(1) } : { top: '#EFEFEF', side: '#D8D8D8', stroke: '#888', sw: pt(.3) });
    } else mass += prism(P, b, { top: PROG[b.p].c, side: PROG[b.p].c, stroke: '#333', sw: pt(.4), shades: [.1, .22, .05, .17] });
  });
  if (hl) for (let i = 1; i <= Math.min(5, Math.floor(big.h / 4.2)); i++) {
    const a = P(big.x + big.w, big.y + big.d, i * 4.2 + 1), e = [a[0] + 24, a[1] - 6 - i * 1.2];
    tags += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(e[0])}" y2="${f(e[1])}" stroke="#111" stroke-width="${pt(.5)}" stroke-dasharray="${pt(1.5)} ${pt(1)}"/>` + txt(e[0] + 1, e[1] + 1, 'F0' + (i + 1), 5.5, { weight: 600 });
  }
  // bubble inset: separate diagram, translucent overlapping program circles + gradient arrows
  const ix = 6, iy = 6, iw = 112, ih = 78;
  let inset = `<rect x="${ix}" y="${iy}" width="${iw}" height="${ih}" fill="#fff" fill-opacity=".92" stroke="#111" stroke-width="${pt(.5)}"/>`;
  if (hl) {
    inset += txt(ix + 4, iy + 6, '三层平面 Level 3 plan', 5.5, { weight: 600 });
    const rooms = [['#F2BFA8', 0, 0, .5, .55], ['#BBCDEE', .5, 0, .5, .35], ['#F3DC8C', .5, .35, .5, .65], ['#B4D7BF', 0, .55, .5, .45]];
    rooms.forEach(([col, x, y, w, h]) => { inset += `<rect x="${f(ix + 10 + x * 92)}" y="${f(iy + 10 + y * 60)}" width="${f(w * 92)}" height="${f(h * 60)}" fill="${col}" stroke="#111" stroke-width="${pt(.6)}"/>`; });
    inset += `<line x1="${ix + iw}" y1="${iy + ih}" x2="${f(P(big.x, big.y, big.h)[0])}" y2="${f(P(big.x, big.y, big.h)[1])}" stroke="#111" stroke-width="${pt(.5)}" stroke-dasharray="${pt(1.5)} ${pt(1)}"/>`;
  } else {
    inset += pg([[ix + 18, iy + 66], [ix + 96, iy + 66], [ix + 104, iy + 18], [ix + 30, iy + 18]], { fill: 'none', stroke: '#555', 'stroke-width': pt(.5), 'stroke-dasharray': `${pt(2)} ${pt(1.4)}` });
    const pos = o.b.map((b, i) => [ix + 26 + (b.x - SITE.x) / SITE.w * 70, iy + 22 + (b.y - SITE.y) / SITE.d * 40, Math.sqrt(b.w * b.d) / 4.2]);
    let defs = '';
    pos.forEach((p, i) => {
      if (i) { const a = pos[i - 1]; defs += gradDef(`ba${u}${i}`, a, p, '#777', '#111', .1, .8); inset += taper([[a[0], a[1]], [(a[0] + p[0]) / 2, (a[1] + p[1]) / 2 - 4], [p[0] - (p[0] - a[0]) * .35, p[1] - (p[1] - a[1]) * .35]], 2.4, 1, `url(#ba${u}${i})`, 1, 1.4); }
    });
    pos.forEach((p, i) => { const pr = PROG[o.b[i].p]; inset += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${f(p[2])}" fill="${pr.c}" fill-opacity=".62" stroke="${shade(pr.c, .35)}" stroke-width="${pt(.5)}"/>` + bi(p[0], p[1], pr.zh, pr.en, 5); });
    inset = `<defs>${defs}</defs>` + inset;
  }
  const items = hl ? [{ t: 'fill', c: TOK.magenta, zh: '社区中心', en: 'Community centre' }, { t: 'fill', c: '#EFEFEF', zh: '其他建筑', en: 'Other buildings' }]
    : Object.values(PROG).map(p => ({ t: 'fill', c: p.c, zh: p.code + ' ' + p.zh, en: p.en }));
  return `${ctx}${G(hl ? 'highlight/overlay' : 'program/massing', mass)}${G('labels/floor-tags', tags)}${G(hl ? 'inset/floor-plan' : 'program/bubble-inset', inset)}${legend(items, 'r', 'b', { title: hl ? ['图例', 'Legend'] : ['地块', 'Plot code'], w: 66 })}`;
};

R.roof = (o, c) => {
  const P = PROJ.plan, u = c.uid;
  let defs = `<filter id="sb${u}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter><radialGradient id="rg${u}"><stop offset="0" stop-color="#C8E3AE"/><stop offset="1" stop-color="#93C27A"/></radialGradient>`;
  const sh = (b, k) => pg(hull(rectPts(b).concat(rectPts(b).map(p => [p[0] + b.h * .55 * k, p[1] + b.h * .38 * k]))), { fill: '#000', 'fill-opacity': .16 });
  let ctx = ground(P, { water: '#D3E5EE', park: '#DCEBD3' }) + `<g filter="url(#sb${u})">${CONTEXT.map(b => sh(b, .8)).join('')}</g>` + CONTEXT.map(b => `<rect x="${f(b.x)}" y="${f(b.y)}" width="${f(b.w)}" height="${f(b.d)}" fill="#fff" stroke="#A0A0A0" stroke-width="${pt(.3)}"/>`).join('');
  const shadows = `<g filter="url(#sb${u})">${o.b.map(b => sh(b, 1)).join('')}</g>`;
  let roofs = '', gardens = '', dat = '';
  o.b.forEach((b, i) => {
    roofs += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}" fill="#fff" stroke="#111" stroke-width="${pt(TOK.outline)}"/>`;
    [1, .7, .4].forEach((w, k) => { const s = 2.4 * (k + 1); if (b.w > 2 * s + 6 && b.d > 2 * s + 6) roofs += `<rect x="${b.x + s}" y="${b.y + s}" width="${b.w - 2 * s}" height="${b.d - 2 * s}" fill="none" stroke="#111" stroke-width="${pt(w)}"/>`; });
    if (i % 2 === 0 && b.w > 30) gardens += `<rect x="${b.x + 9.6}" y="${b.y + 9.6}" width="${b.w - 19.2}" height="${b.d - 19.2}" fill="url(#rg${u})" stroke="${shade('#93C27A', .3)}" stroke-width="${pt(.4)}"/>`;
    const x = b.x + b.w - 6, y = b.y + 6, lv = '+' + (12 + b.h).toFixed(2);
    dat += `<circle cx="${x}" cy="${y}" r="1.8" fill="none" stroke="${TOK.ext}" stroke-width="${pt(.7)}"/><line x1="${x - 3}" y1="${y}" x2="${x + 3}" y2="${y}" stroke="${TOK.ext}" stroke-width="${pt(.5)}"/><line x1="${x}" y1="${y - 3}" x2="${x}" y2="${y + 3}" stroke="${TOK.ext}" stroke-width="${pt(.5)}"/><polyline points="${x + 1.3},${y - 1.3} ${x + 6},${y - 6} ${x + 18},${y - 6}" fill="none" stroke="${TOK.ext}" stroke-width="${pt(.5)}"/>` + txt(x + 6.6, y - 7, lv, 5.5, { fill: TOK.ext, weight: 600 });
  });
  dat += `<circle cx="300" cy="252" r="1.8" fill="none" stroke="${TOK.ext}" stroke-width="${pt(.7)}"/><line x1="297" y1="252" x2="303" y2="252" stroke="${TOK.ext}" stroke-width="${pt(.5)}"/><line x1="300" y1="249" x2="300" y2="255" stroke="${TOK.ext}" stroke-width="${pt(.5)}"/>` + txt(304, 251, '-10.00', 5.5, { fill: TOK.ext, weight: 600 });
  const mid = SITE.x + SITE.w / 2;
  const plots = `<rect x="${SITE.x - 4}" y="${SITE.y - 4}" width="${SITE.w / 2 + 2}" height="${SITE.d + 8}" fill="none" stroke="${TOK.ext}" stroke-width="${pt(.9)}" stroke-dasharray="${pt(5)} ${pt(2.5)}"/><rect x="${mid + 2}" y="${SITE.y - 4}" width="${SITE.w / 2 + 2}" height="${SITE.d + 8}" fill="none" stroke="${TOK.ext}" stroke-width="${pt(.9)}" stroke-dasharray="${pt(5)} ${pt(2.5)}"/>` + txt(SITE.x - 2, SITE.y - 6, 'C-05', 5, { fill: TOK.ext, weight: 600 }) + txt(mid + 4, SITE.y - 6, 'C-06', 5, { fill: TOK.ext, weight: 600 });
  const labels = bi(130, 258, '运河', 'Canal', 6.5) + bi(50, 132, '滨水公园', 'Riverside park', 6);
  return `<defs>${defs}</defs>${G('base/context', ctx)}${G('base/soft-shadow', shadows)}${G('roof/outlines', roofs)}${G('roof/gardens', gardens)}${G('site/plot-boundaries', plots)}${G('levels/datum-markers', dat)}${G('labels/place-names', labels)}${scaleBar(12, 252)}`;
};

R.section = (o, c) => {
  const v = c.v || 'sun', u = c.uid, gy = 196, sx = x => 26 + (x - SITE.x) * 1.5, H = h => h * 2.6;
  const cutY = SITE.y + SITE.d / 2;
  let defs = `<pattern id="ht${u}" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="3" stroke="#111" stroke-width="${pt(.35)}"/></pattern>`;
  let base = `<rect x="0" y="0" width="400" height="280" fill="#fff"/>` + `<rect x="0" y="${gy}" width="400" height="84" fill="url(#ht${u})"/>` + `<rect x="${sx(SITE.x + SITE.w) + 12}" y="${gy}" width="80" height="84" fill="#D3E5EE"/>` + `<line x1="0" y1="${gy}" x2="400" y2="${gy}" stroke="#111" stroke-width="${pt(1.4)}"/>`;
  base += txt(sx(SITE.x + SITE.w) + 52, gy + 10, '-10.00', 5.5, { anchor: 'middle', fill: TOK.ext, weight: 600 });
  let beyond = '', cut = '';
  const sorted = o.b.slice().sort((a, b) => a.x - b.x);
  sorted.forEach(b => {
    const x = sx(b.x), w = b.w * 1.5, h = H(b.h), isCut = b.y <= cutY && b.y + b.d >= cutY;
    if (!isCut) { beyond += `<rect x="${f(x)}" y="${f(gy - h)}" width="${f(w)}" height="${f(h)}" fill="#EFEFEF" stroke="#B5B5B5" stroke-width="${pt(.4)}"/>`; return; }
    cut += `<rect x="${f(x)}" y="${f(gy - h)}" width="${f(w)}" height="${f(h)}" fill="#fff" stroke="#111" stroke-width="${pt(.6)}"/>`;
    for (let z = 0; z <= h + .1; z += 4.2 * 2.6) cut += `<rect x="${f(x)}" y="${f(gy - z - .8)}" width="${f(w)}" height=".9" fill="#111"/>`;
    cut += `<rect x="${f(x)}" y="${f(gy - h)}" width="1.1" height="${f(h)}" fill="#111"/><rect x="${f(x + w - 1.1)}" y="${f(gy - h)}" width="1.1" height="${f(h)}" fill="#111"/>`;
  });
  let ov = '';
  if (v === 'sun' || v === 'eco') {
    ov += `<circle cx="34" cy="30" r="9" fill="${TOK.hi}"/>`;
    sorted.forEach((b, i) => { const x = sx(b.x) + b.w * .75, y = gy - H(b.h); ov += `<line x1="40" y1="34" x2="${f(x)}" y2="${f(y)}" stroke="${TOK.hi}" stroke-width="${pt(1)}" stroke-dasharray="${pt(3)} ${pt(2)}"/>`; });
    if (v === 'sun') ov += bi(56, 26, '夏至 76°', 'Summer solstice', 6, { anchor: 'start' }) + `<path d="M 16 ${gy} A 60 60 0 0 1 76 ${gy - 60}" fill="none" stroke="${TOK.axis}" stroke-width="${pt(.8)}" stroke-dasharray="${pt(2)} ${pt(2)}"/>` + bi(84, gy - 62, '冬至 31°', 'Winter solstice', 6, { anchor: 'start' });
  }
  if (v === 'wind' || v === 'eco') {
    let defs2 = '';
    [[[4, gy - 24], [70, gy - 30], [150, gy - 18], [230, gy - 40], [330, gy - 70]], [[4, gy - 60], [90, gy - 80], [200, gy - 120], [300, gy - 132]], [[4, gy - 8], [100, gy - 10], [190, gy - 6]]].forEach((p, i) => { defs2 += gradDef(`wd${u}${i}`, p[0], p[p.length - 1], TOK.int, TOK.int, .1, .85); ov += taper(p, 2, 5, `url(#wd${u}${i})`, 1, 1.4); });
    defs += defs2;
    if (v === 'wind') ov += bi(10, gy - 90, '夏季主导风向 SE', 'Prevailing summer wind', 6, { anchor: 'start' }) + bi(300, gy - 150, '烟囱效应', 'Stack effect', 6, { anchor: 'start' });
  }
  if (v === 'eco') {
    sorted.forEach(b => { const x = sx(b.x), y = gy - H(b.h); for (let k = 2; k < b.w * 1.5 - 4; k += 5) ov += pg([[x + k, y - .5], [x + k + 3.6, y - 3], [x + k + 4.4, y - 2.2], [x + k + .8, y + .3]], { fill: '#2A3A6B' }); });
    for (let k = 0; k < 6; k++) ov += `<line x1="${120 + k * 30}" y1="10" x2="${116 + k * 30}" y2="34" stroke="${TOK.int}" stroke-width="${pt(.8)}"/>`;
    ov += `<rect x="150" y="${gy + 8}" width="60" height="16" fill="#D3E5EE" stroke="#111" stroke-width="${pt(.6)}"/>` + bi(180, gy + 15, '雨水回收', 'Rainwater tank', 5.5) + bi(26, 60, '光伏屋面', 'PV roofs', 6, { anchor: 'start' });
  }
  if (v === 'people') {
    const r = rng(o.id.charCodeAt(0));
    sorted.forEach(b => { const x = sx(b.x), w = b.w * 1.5, h = H(b.h); for (let z = 0; z < h - 4; z += 4.2 * 2.6) for (let k = 0; k < 3; k++) { const px = x + 4 + r() * (w - 8), py = gy - z - .9; ov += `<circle cx="${f(px)}" cy="${f(py - 3.4)}" r=".7" fill="#111"/><line x1="${f(px)}" y1="${f(py - 2.7)}" x2="${f(px)}" y2="${f(py)}" stroke="#111" stroke-width="${pt(.8)}"/>`; } });
    const cs = [['从滨水广场进入', 'Arrive from the river plaza'], ['穿过市集大厅', 'Through the market hall'], ['坡道上升', 'Up the ramp'], ['屋顶花园', 'Roof garden']];
    cs.forEach((cc, i) => { const x = 40 + i * 84, y = 22 + (i % 2) * 12; ov += `<circle cx="${x}" cy="${y}" r="3.4" fill="${TOK.ext}"/>` + txt(x, y + 1.7, String(i + 1), 7, { anchor: 'middle', fill: '#fff', weight: 700 }) + bi(x + 5.4, y - 1, cc[0], cc[1], 5.5, { anchor: 'start' }); });
    ov += `<path d="${crPath([[20, gy - 2], [90, gy - 4], [150, gy - 30], [220, gy - 70], [280, gy - H(sorted[sorted.length - 1].h) - 2]])}" fill="none" stroke="${TOK.ext}" stroke-width="${pt(2)}" stroke-dasharray="${pt(4)} ${pt(2)}"/>`;
  }
  const lg = { sun: [{ t: 'dash', c: TOK.hi, zh: '日照', en: 'Sun ray' }, { t: 'dash', c: TOK.axis, zh: '太阳高度角', en: 'Sun altitude' }], wind: [{ t: 'taper', c: TOK.int, zh: '气流', en: 'Air flow' }], eco: [{ t: 'fill', c: '#2A3A6B', zh: '光伏', en: 'PV' }, { t: 'taper', c: TOK.int, zh: '自然通风', en: 'Natural ventilation' }, { t: 'line', c: TOK.int, zh: '雨水', en: 'Rainwater', w: .8 }], people: [{ t: 'dash', c: TOK.ext, zh: '叙事路径', en: 'Narrative route' }] }[v];
  lg.push({ t: 'fill', c: '#111', zh: '剖切', en: 'Cut' }, { t: 'fill', c: '#EFEFEF', zh: '远景', en: 'Beyond' });
  return `<defs>${defs}</defs>${G('base/section', base)}${G('section/beyond', beyond)}${G('section/cut', cut)}${G('analysis/overlay', ov)}${legend(lg, 'r', 'b', { title: ['图例', 'Legend'], w: 62 })}`;
};

R.site = (o) => {
  const P = PROJ.plan;
  const ctx = contextLayer(P, { fill: '#1C1C1C', water: '#BCD6E3', park: '#CDE2C2' }, 'plan');
  const mass = o.b.map(b => `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}" fill="${TOK.ext}"/>`).join('');
  const [cx, cy] = [SITE.x + SITE.w / 2, SITE.y + SITE.d / 2];
  const rings = [[110, '5 分钟', '5 min walk'], [190, '10 分钟', '10 min walk']].map(([r, zh, en]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#555" stroke-width="${pt(.6)}" stroke-dasharray="${pt(3)} ${pt(2)}"/>` + `<rect x="${cx + r * .7 - 1}" y="${cy - r * .7 - 6}" width="30" height="8" fill="#fff"/>` + bi(cx + r * .7 + 14, cy - r * .7 - 2.6, zh, en, 5.5)).join('');
  const metro = [[0, 40], [100, 34], [200, 28], [300, 44], [400, 60]];
  const tr = `<path d="${crPath(metro)}" fill="none" stroke="#2F6BD8" stroke-width="${pt(3)}"/>` + [[100, 34], [300, 44]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.6" fill="#fff" stroke="#2F6BD8" stroke-width="${pt(1.4)}"/>`).join('') + bi(100, 26, '地铁2号线 江滨站', 'Metro L2 · Riverside', 5.5);
  const bd = `<rect x="${SITE.x - 6}" y="${SITE.y - 6}" width="${SITE.w + 12}" height="${SITE.d + 12}" fill="none" stroke="${TOK.ext}" stroke-width="${pt(1.4)}" stroke-dasharray="${pt(6)} ${pt(3)}"/>`;
  return `${ctx}${G('site/rings', rings)}${G('site/transit', tr)}${G('base/massing', mass)}${G('site/boundary', bd)}${scaleBar(12, 252)}${legend([{ t: 'fill', c: TOK.ext, zh: '本项目', en: 'This project' }, { t: 'fill', c: '#1C1C1C', zh: '现状建筑', en: 'Existing' }, { t: 'line', c: '#2F6BD8', zh: '地铁', en: 'Metro', w: 3 }, { t: 'dash', c: '#555', zh: '步行半径', en: 'Walking radius' }], 'r', 'b', { title: ['图例', 'Legend'] })}`;
};

R.evo = (o) => {
  const stages = [{ cx: 72, s: .36 }, { cx: 200, s: .36 }, { cx: 328, s: .36 }];
  let s = '<rect width="400" height="280" fill="#fff"/>';
  const lab = [['体量', 'Site volume'], ['切分', 'Split and lift'], ['塑形', 'Shape and program']];
  stages.forEach((st, i) => {
    const P = mkAxo(st.cx, 150, st.s, .56, 1.05, SITE.x + SITE.w / 2, SITE.y + SITE.d / 2);
    s += pg([[SITE.x, SITE.y], [SITE.x + SITE.w, SITE.y], [SITE.x + SITE.w, SITE.y + SITE.d], [SITE.x, SITE.y + SITE.d]].map(p => P(p[0], p[1], 0)), { fill: '#F3F3F3', stroke: '#999', 'stroke-width': pt(.4) });
    if (i === 0) s += prism(P, { x: SITE.x + 10, y: SITE.y + 10, w: SITE.w - 20, d: SITE.d - 20, h: 30 }, { top: '#fff', side: '#fff', stroke: '#111', sw: pt(.7), shades: [.06, .14, .03, .1] });
    if (i === 1) { const hs = o.b.map(b => b.h); const mx = Math.max(...hs); sortB(P, [{ x: SITE.x + 10, y: SITE.y + 10, w: SITE.w / 2 - 14, d: SITE.d - 20, h: mx * .8 }, { x: SITE.x + SITE.w / 2 + 4, y: SITE.y + 10, w: SITE.w / 2 - 14, d: SITE.d - 20, h: mx * .6 }]).forEach(b => { s += prism(P, b, { top: '#fff', side: '#fff', stroke: '#111', sw: pt(.7), shades: [.06, .14, .03, .1] }); }); }
    if (i === 2) sortB(P, o.b).forEach(b => { s += prism(P, b, { top: PROG[b.p].c, side: PROG[b.p].c, stroke: '#111', sw: pt(.6), shades: [.1, .22, .05, .17] }); });
    s += `<circle cx="${st.cx - 48}" cy="44" r="4" fill="#111"/>` + txt(st.cx - 48, 45.9, '0' + (i + 1), 6.5, { anchor: 'middle', fill: '#fff', weight: 700 }) + bi(st.cx - 42, 43, lab[i][0], lab[i][1], 6.5, { anchor: 'start' });
    if (i < 2) s += taper([[st.cx + 44, 150], [st.cx + 64, 150]], 3, 2.2, '#9A9A9A', 1, 1.4);
  });
  return G('massing/stages', s) + legend(Object.values(PROG).map(p => ({ t: 'fill', c: p.c, zh: p.zh, en: p.en })), 'r', 'b', { title: ['功能', 'Program'] });
};

R.gradient = (o, c) => {
  const P = PROJ.plan, u = c.uid, e = o.route[0];
  const ctx = contextLayer(P, { fill: '#E3E3E3', water: '#E4EEF2', park: '#E9F1E4' }, 'plan');
  const maxD = 260;
  const mass = o.b.map(b => { const [cx, cy] = ctr(b), t = Math.min(1, Math.hypot(cx - e[0], cy - e[1]) / maxD); return `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}" fill="${mix(TOK.axis, TOK.int, t)}" fill-opacity=".85" stroke="#111" stroke-width="${pt(1)}"/>` + bi(cx, cy - 1, t < .5 ? '公共' : '私密', (t < .5 ? 'Public ' : 'Private ') + Math.round((1 - t) * 100) + '%', 5.5); }).join('');
  const field = `<defs><radialGradient id="rf${u}" cx="${e[0]}" cy="${e[1]}" r="200" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${TOK.axis}" stop-opacity=".35"/><stop offset="1" stop-color="${TOK.axis}" stop-opacity="0"/></radialGradient><linearGradient id="gb${u}"><stop offset="0" stop-color="${TOK.axis}"/><stop offset="1" stop-color="${TOK.int}"/></linearGradient></defs><rect width="400" height="280" fill="url(#rf${u})"/>`;
  const bar = `<rect x="12" y="246" width="70" height="4" fill="url(#gb${u})"/>` + bi(12, 256, '公共', 'Public', 5.5, { anchor: 'start' }) + bi(82, 256, '私密', 'Private', 5.5, { anchor: 'end' });
  return `${ctx}${G('analysis/public-field', field)}${G('program/gradient-zones', mass)}${G('labels/gradient-bar', bar)}${G('circulation/entrance', `<circle cx="${e[0]}" cy="${e[1]}" r="2.6" fill="#111"/>` + bi(e[0] + 4, e[1] + 1, '主入口', 'Main entrance', 5.5, { anchor: 'start' }))}`;
};

R.structure = (o) => {
  const P = PROJ.plan;
  const ctx = contextLayer(P, { fill: '#EDEDED', water: '#EEF4F6', park: '#F0F5EC' }, 'plan');
  let grid = '', cols = '', cores = '';
  const sp = 16.8, xs = [], ys = [];
  for (let x = SITE.x; x <= SITE.x + SITE.w + .1; x += sp) xs.push(x);
  for (let y = SITE.y; y <= SITE.y + SITE.d + .1; y += sp) ys.push(y);
  xs.forEach((x, i) => { grid += `<line x1="${f(x)}" y1="${SITE.y - 10}" x2="${f(x)}" y2="${SITE.y + SITE.d + 4}" stroke="#888" stroke-width="${pt(.3)}" stroke-dasharray="${pt(6)} ${pt(1.5)} ${pt(1)} ${pt(1.5)}"/><circle cx="${f(x)}" cy="${SITE.y - 13}" r="2.6" fill="#fff" stroke="#111" stroke-width="${pt(.5)}"/>` + txt(x, SITE.y - 11.8, String.fromCharCode(65 + i), 5, { anchor: 'middle', weight: 600 }); });
  ys.forEach((y, i) => { grid += `<line x1="${SITE.x - 10}" y1="${f(y)}" x2="${SITE.x + SITE.w + 4}" y2="${f(y)}" stroke="#888" stroke-width="${pt(.3)}" stroke-dasharray="${pt(6)} ${pt(1.5)} ${pt(1)} ${pt(1.5)}"/><circle cx="${SITE.x - 13}" cy="${f(y)}" r="2.6" fill="#fff" stroke="#111" stroke-width="${pt(.5)}"/>` + txt(SITE.x - 13, y + 1.2, String(i + 1), 5, { anchor: 'middle', weight: 600 }); });
  const mass = o.b.map(b => `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}" fill="#fff" stroke="#111" stroke-width="${pt(.8)}"/>`).join('');
  o.b.forEach(b => {
    xs.forEach(x => ys.forEach(y => { if (x > b.x + 1 && x < b.x + b.w - 1 && y > b.y + 1 && y < b.y + b.d - 1) cols += `<rect x="${f(x - .8)}" y="${f(y - .8)}" width="1.6" height="1.6" fill="#111"/>`; }));
    const [cx, cy] = ctr(b); cores += `<rect x="${f(cx - 4)}" y="${f(cy - 5)}" width="8" height="10" fill="#111"/><line x1="${f(cx - 4)}" y1="${f(cy - 5)}" x2="${f(cx + 4)}" y2="${f(cy + 5)}" stroke="#fff" stroke-width="${pt(.4)}"/>`;
  });
  return `${ctx}${G('structure/grid', grid)}${G('base/massing', mass)}${G('structure/columns', cols)}${G('structure/cores', cores)}${scaleBar(12, 252)}${legend([{ t: 'fill', c: '#111', zh: '核心筒', en: 'Core' }, { t: 'dot', c: '#111', zh: '柱 16.8 m 柱网', en: 'Column, 16.8 m grid' }, { t: 'dash', c: '#888', zh: '轴网', en: 'Grid line' }], 'r', 'b', { title: ['图例', 'Legend'], w: 66 })}`;
};

R.landscape = (o, c) => {
  const P = PROJ.plan, u = c.uid, r = rng(o.id.charCodeAt(0) * 7);
  const ctx = contextLayer(P, { fill: '#E4E4E4', water: TOK.water, park: '#D2E6C4' }, 'plan');
  let defs = `<radialGradient id="lf${u}"><stop offset="0" stop-color="#E3F0D6"/><stop offset="1" stop-color="#B9D9A0"/></radialGradient>`;
  const inB = (x, y, m = 2) => o.b.some(b => x > b.x - m && x < b.x + b.w + m && y > b.y - m && y < b.y + b.d + m);
  let land = `<rect x="${SITE.x}" y="${SITE.y}" width="${SITE.w}" height="${SITE.d}" fill="url(#lf${u})"/>`;
  let trees = '';
  for (let i = 0; i < 90; i++) { const x = SITE.x + r() * SITE.w, y = SITE.y + r() * (SITE.d + 30), rr = 1.6 + r() * 2.6; if (inB(x, y, rr + 1) || y > 234) continue; trees += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rr)}" fill="#7DB563" fill-opacity=".8" stroke="#4E8A3A" stroke-width="${pt(.4)}"/>`; }
  const mass = o.b.map(b => `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}" fill="#fff" stroke="#111" stroke-width="${pt(.8)}"/>`).join('');
  let cor = '';
  [[[60, 130], [96, 134], [124, 136]], [[220, 232], [218, 222], [216, 212]], [[86, 168], [100, 196], [112, 210]]].forEach((p, i) => { defs += gradDef(`lc${u}${i}`, p[0], p[2], TOK.green, TOK.green, .2, .9); cor += taper(p, 10, 4, `url(#lc${u}${i})`, 1, 1.6); });
  return `<defs>${defs}</defs>${ctx}${G('landscape/fills', land)}${G('landscape/trees', trees)}${G('base/massing', mass)}${G('landscape/green-corridors', cor)}${scaleBar(12, 252)}${legend([{ t: 'fill', c: '#B9D9A0', zh: '景观绿地', en: 'Landscape' }, { t: 'circle', c: '#4E8A3A', zh: '乔木', en: 'Trees' }, { t: 'taper', c: TOK.green, zh: '绿化廊道', en: 'Green corridor' }], 'r', 'b', { title: ['图例', 'Legend'] })}`;
};

R.exploded = (o) => {
  const big = o.b.reduce((a, b) => (b.w * b.d * b.h > a.w * a.d * a.h ? b : a));
  const [cx, cy] = ctr(big);
  // Fit the slab to roughly 150 mm of sheet width whatever the footprint (Option B's 190 m slab overflowed at a fixed 1.5).
  const P = mkAxo(190, 214, Math.min(1.5, 118 / Math.max(big.w, big.d)), .56, 1.05, cx, cy);
  const n = Math.max(3, Math.min(5, Math.round(big.h / 8))), gap = 15;
  const cols = [PROG.market.c, PROG.culture.c, PROG.learning.c, PROG.community.c, PROG.culture.c];
  let s = '<rect width="400" height="280" fill="#fff"/>';
  s += pg(rectPts(big).map(q => P(q[0], q[1], 0)), { fill: 'none', stroke: '#888', 'stroke-width': pt(.5), 'stroke-dasharray': `${pt(3)} ${pt(2)}` });
  rectPts(big).forEach(q => { const a = P(q[0], q[1], 0), b = P(q[0], q[1], (n - 1) * gap + 2); s += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" stroke="#999" stroke-width="${pt(.4)}" stroke-dasharray="${pt(2)} ${pt(2)}"/>`; });
  let tags = '';
  for (let i = 0; i < n; i++) {
    const z = i * gap;
    s += prism(P, { x: big.x, y: big.y, w: big.w, d: big.d, h: 1.6, z }, { top: cols[i], side: cols[i], stroke: '#111', sw: pt(.6), shades: [.15, .3, .1, .25] });
    const m1 = P(big.x + big.w * .45, big.y, z + 1.6), m2 = P(big.x + big.w * .45, big.y + big.d, z + 1.6), m3 = P(big.x, big.y + big.d * .5, z + 1.6), m4 = P(big.x + big.w * .45, big.y + big.d * .5, z + 1.6);
    s += `<line x1="${f(m1[0])}" y1="${f(m1[1])}" x2="${f(m2[0])}" y2="${f(m2[1])}" stroke="#111" stroke-width="${pt(.5)}"/><line x1="${f(m3[0])}" y1="${f(m3[1])}" x2="${f(m4[0])}" y2="${f(m4[1])}" stroke="#111" stroke-width="${pt(.5)}"/>`;
    const a = P(big.x + big.w, big.y + big.d * .5, z + .8);
    tags += `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(a[0] + 40)}" y2="${f(a[1])}" stroke="#111" stroke-width="${pt(.5)}" stroke-dasharray="${pt(1.5)} ${pt(1)}"/>` + txt(a[0] + 42, a[1] + 1.4, 'F0' + (i + 1), 6, { weight: 700 }) + bi(a[0] + 54, a[1] + .2, ['市集', '展厅', '阅览', '工作坊', '屋顶花园'][i], ['Market', 'Gallery', 'Reading room', 'Workshops', 'Roof garden'][i], 5.2, { anchor: 'start', inline: true });
  }
  return G('axo/exploded-floors', s) + G('labels/floor-tags', tags) + legend(Object.values(PROG).map(p => ({ t: 'fill', c: p.c, zh: p.zh, en: p.en })), 'r', 'b', { title: ['功能', 'Program'] });
};

/* ---------- templates (the 17 rows of the reference job) ---------- */
const TEMPLATES = [
  { n: '01', id: 'site', en: 'Site context', zh: '场地环境', r: 'site', brief: 'Place the quarter in its city: river, metro and 5 and 10 minute walking radii.' },
  { n: '02', id: 'evo', en: 'Massing evolution', zh: '体量演变', r: 'evo', brief: 'Three steps from site volume to final massing. One idea per step.' },
  { n: '03', id: 'program', en: 'Program distribution', zh: '功能分布', r: 'prog', brief: 'Program by colour on the massing, with a bubble diagram of adjacencies grouped by plot code.' },
  { n: '04', id: 'circ', en: 'Circulation', zh: '流线分析', r: 'circ', brief: 'Show the public route from the river plaza to the roof garden and emphasise the ramp. Internal loops on each roof.' },
  { n: '05', id: 'gradient', en: 'Public / private gradient', zh: '公共私密梯度', r: 'gradient', brief: 'Fade from public at the main entrance to private at the far edge of the site.' },
  { n: '06', id: 'structure', en: 'Structure', zh: '结构体系', r: 'structure', brief: 'One 16.8 m grid across all buildings; cores in solid black.' },
  { n: '07', id: 'daylight', en: 'Daylight', zh: '日照分析', r: 'section', v: 'sun', brief: 'Section through the site with summer and winter sun angles reaching each roof.' },
  { n: '08', id: 'vent', en: 'Ventilation', zh: '通风分析', r: 'section', v: 'wind', brief: 'Prevailing summer wind and the stack effect through the tallest volume.' },
  { n: '09', id: 'land', en: 'Landscape', zh: '景观策略', r: 'landscape', brief: 'Continuous ground of planting between buildings; corridors from the park and the river.' },
  { n: '10', id: 'phasing', en: 'Phasing', zh: '分期建设', r: 'ground', v: 'phase', brief: 'Three phases, 2028–2032, numbered on the ground plan.' },
  { n: '11', id: 'sustain', en: 'Sustainability strategy', zh: '可持续策略', r: 'section', v: 'eco', brief: 'PV roofs, rainwater capture and natural ventilation on one section.' },
  { n: '12', id: 'exploded', en: 'Exploded axonometric', zh: '爆炸轴测', r: 'exploded', brief: 'Exploded floors of the main building with floor tags and program colours.' },
  { n: '13', id: 'narr', en: 'Section narrative', zh: '剖面叙事', r: 'section', v: 'people', brief: 'Four numbered moments of a visit, from the river plaza to the roof garden.' },
  { n: '14', id: 'views', en: 'Views and green areas', zh: '视线与绿地', r: 'views', brief: 'Plan-oblique figure-ground. Green corridors, cyan main views, chevrons for room views.' },
  { n: '15', id: 'ground', en: 'Ground plan', zh: '首层平面', r: 'ground', brief: 'Program zones, entrances by type, delivery and drop-off, site boundary.' },
  { n: '16', id: 'keyed', en: 'Key spatial analysis', zh: '关键空间分析', r: 'keyed', brief: 'Washed-out context. Corridors, axes, highlights and numbered markers keyed to the category list.' },
  { n: '17', id: 'roof', en: 'Roof plan', zh: '屋顶平面', r: 'roof', brief: 'Roof outlines with terrace offsets, roof gardens, datum levels and plot boundaries.' },
];

/* Full sheet: A3 frame + bilingual title block + content in site metres. */
function diagram(t, o, ctx = {}) {
  const u = ++UID;
  const c = Object.assign({ uid: u, v: t.v }, ctx);
  const inner = R[t.r](o, c);
  const title = `<text class="dg dg-zh" x="10" y="12.6" font-size="${pt(TOK.title)}" font-weight="600">${esc(t.zh)} · 方案${o.id}</text>` +
    `<text class="dg" x="410" y="12.6" font-size="${pt(TOK.title)}" font-weight="600" text-anchor="end">${esc(t.en)} · Option ${o.id}</text>` +
    `<line x1="10" y1="288" x2="410" y2="288" stroke="#111" stroke-width="${pt(.5)}"/>` +
    `<text class="dg" x="10" y="293.4" font-size="${pt(5.5)}"><tspan class="dg-zh">滨水文化街区</tspan> Riverside Cultural Quarter · ${esc(o.name)}</text>` +
    `<text class="dg" x="410" y="293.4" font-size="${pt(5.5)}" text-anchor="end">RCQ-${o.id}-${t.n} · ${t.r === 'section' ? '1:650' : '1:1000'} @ A3</text>`;
  return `<svg class="dg-svg" viewBox="0 0 420 297" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(t.en)}, Option ${o.id}">` +
    `<rect width="420" height="297" fill="#fff"/><defs><clipPath id="cl${u}"><rect width="400" height="266"/></clipPath></defs>` +
    `<g data-k="frame/title">${title}</g>` +
    `<g class="dg-content" transform="translate(10,19)" clip-path="url(#cl${u})">${inner}</g>` +
    (ctx.editor ? `<g id="edOverlay" transform="translate(10,19)"></g>` : '') + `</svg>`;
}

/* Small plan drawings for asset cards on the board (stand-ins for the imported PDF pages). */
function assetPlan(o, kind) {
  let s = `<svg viewBox="96 46 250 180" xmlns="http://www.w3.org/2000/svg"><rect x="96" y="46" width="250" height="180" fill="#fff"/>`;
  if (kind === 'axo') {
    const P = mkAxo(221, 150, .6, .56, 1.05, 221, 136);
    s += sortB(P, o.b).map(b => prism(P, b, { top: '#fff', side: '#fff', stroke: '#222', sw: .5, shades: [.05, .12, .02, .09] })).join('');
  } else {
    s += `<rect x="${SITE.x}" y="${SITE.y}" width="${SITE.w}" height="${SITE.d}" fill="none" stroke="#bbb" stroke-width=".5" stroke-dasharray="3 2"/>`;
    o.b.forEach(b => {
      s += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.d}" fill="none" stroke="#111" stroke-width="1.6"/>`;
      if (kind !== 'site') for (let x = b.x + 12; x < b.x + b.w - 4; x += 14) s += `<line x1="${x}" y1="${b.y}" x2="${x}" y2="${b.y + b.d}" stroke="#555" stroke-width=".4"/>`;
      if (kind !== 'site') s += `<line x1="${b.x}" y1="${b.y + b.d * .45}" x2="${b.x + b.w}" y2="${b.y + b.d * .45}" stroke="#555" stroke-width=".4"/>`;
    });
  }
  return s + '</svg>';
}
