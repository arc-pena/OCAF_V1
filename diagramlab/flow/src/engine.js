/* DiagramLab Flow — render engine.
   A diagram is one straight pipeline, read left to right like a Nuke tree:
     Read (a named view of an option) → background steps → overlay layers → Sheet → Write (PDF / SVG).
   renderSheet() is the only renderer: the viewer, the node thumbnails and both exporters call it, so what you see
   is what is written. Overlays never hold coordinates of their own: they draw from named anchors placed on the
   background image (fractions of the image), so one recipe runs on every option and moving an anchor moves every
   diagram that uses it. Helpers (pt, f, esc, pg, crPath, crSample, dirAt, head, taper, legend, txt, TOK, UID)
   come from ux/src/diagrams.js. */

const BG_KINDS = {
  wash: { label: 'Wash out', hint: 'Fade and desaturate so the overlays read first' },
  desaturate: { label: 'Black and white', hint: 'Remove all colour' },
  ghost: { label: 'Ghost', hint: 'Very light grey, linework only' },
  figure: { label: 'Figure-ground', hint: 'Hard black and white' },
  night: { label: 'Night', hint: 'Dark blue mood for late trading' },
  warm: { label: 'Warm light', hint: 'Late-afternoon warmth' },
  contrast: { label: 'More contrast', hint: 'Punchier tones' },
  camera: { label: 'Change camera', hint: 'New viewpoint. Needs the image model' },
  restyle: { label: 'Restyle (image model)', hint: 'Free-text restyle. Needs the image model' },
};
const FILTERS = {
  wash: '<feColorMatrix type="saturate" values=".3"/><feComponentTransfer><feFuncR type="linear" slope=".42" intercept=".58"/><feFuncG type="linear" slope=".42" intercept=".58"/><feFuncB type="linear" slope=".42" intercept=".58"/></feComponentTransfer>',
  desaturate: '<feColorMatrix type="saturate" values="0"/>',
  ghost: '<feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".25" intercept=".75"/><feFuncG type="linear" slope=".25" intercept=".75"/><feFuncB type="linear" slope=".25" intercept=".75"/></feComponentTransfer>',
  figure: '<feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncR type="discrete" tableValues="0 0 1 1 1"/><feFuncG type="discrete" tableValues="0 0 1 1 1"/><feFuncB type="discrete" tableValues="0 0 1 1 1"/></feComponentTransfer>',
  night: '<feColorMatrix type="matrix" values=".3 0 0 0 0  0 .36 0 0 .03  0 0 .52 0 .1  0 0 0 1 0"/>',
  warm: '<feColorMatrix type="matrix" values="1.04 0 0 0 .05  0 1 0 0 .02  0 0 .84 0 0  0 0 0 1 0"/>',
  contrast: '<feComponentTransfer><feFuncR type="linear" slope="1.35" intercept="-.17"/><feFuncG type="linear" slope="1.35" intercept="-.17"/><feFuncB type="linear" slope="1.35" intercept="-.17"/></feComponentTransfer>',
};
const CW = 400, CH = 266;

function findView(o, d) { return o.views.find(v => v.id === (d.readId || {})[o.id]) || o.views.find(v => v.name === d.read); }
/* Image rectangle in content units, fitted whole (meet) so the drawing is never cropped. */
function imgRect(v) {
  const w = v.w || 1500, h = v.h || 1006, s = Math.min(CW / w, CH / h);
  return { x: (CW - w * s) / 2, y: (CH - h * s) / 2, w: w * s, h: h * s };
}
function geo(v) {
  const R = imgRect(v);
  const P = a => [R.x + a[0] * R.w, R.y + a[1] * R.h];
  const A = k => (v.anchors && v.anchors[k]) ? P(v.anchors[k]) : null;
  let mpu = null;
  if (v.scale) { const a = A(v.scale.pair[0]), b = A(v.scale.pair[1]); if (a && b) mpu = v.scale.m / Math.hypot(a[0] - b[0], a[1] - b[1]); }
  return { R, P, A, mpu, est: k => !!(v.anchors && v.anchors[k] && v.anchors[k][2]), loop: (v.loop || []).map(P), site: (v.site || []).map(P), ulos: (v.ulos || []).map(P) };
}
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
function segDist(p, a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy || 1; let t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l; t = Math.max(0, Math.min(1, t)); return dist(p, [a[0] + t * dx, a[1] + t * dy]); }
function nearestOn(poly, p) { let best = null, bd = 1e9, bi = 0; poly.forEach((q, i) => { const dd = dist(p, q); if (dd < bd) { bd = dd; best = q; bi = i; } }); return { p: best, d: bd, i: bi }; }
function centroid(poly) { return poly.reduce((a, p) => [a[0] + p[0] / poly.length, a[1] + p[1] / poly.length], [0, 0]); }

/* ---------- background ---------- */
function bgState(d, o, upto = Infinity) {
  const v = findView(o, d);
  if (!v) return { missing: true, notes: [] };
  const filters = [], notes = [];
  d.bg.forEach((op, i) => {
    if (!op.on || i >= upto) return;
    if (op.kind === 'camera' || op.kind === 'restyle') notes.push(`“${op.prompt || BG_KINDS[op.kind].label}” is recorded as an image-model step. The prototype cannot call the image model, so the image is unchanged.`);
    else filters.push(op.kind);
  });
  return { view: v, filters, notes };
}
function backgroundSvg(st, u) {
  if (st.missing) return '';
  const R = imgRect(st.view), fid = 'bf' + u, chain = st.filters.map(k => FILTERS[k]).join('');
  return (chain ? `<defs><filter id="${fid}" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">${chain}</filter></defs>` : '') +
    `<g data-k="background" data-layer="background" data-name="Background · ${esc(st.view.name)}"${chain ? ` filter="url(#${fid})"` : ''}><rect width="${CW}" height="${CH}" fill="#fff"/>` +
    `<image href="${st.view.url}" x="${f(R.x)}" y="${f(R.y)}" width="${f(R.w)}" height="${f(R.h)}" preserveAspectRatio="none"/></g>`;
}

/* ---------- drawing helpers in content units ---------- */
const lbl = (x, y, s, size, o = {}) => txt(x, y, s, size, o);
function pill(x, y, s, bg, size = 6, fg = '#fff', anchor = 'start') {
  const fs = pt(size), w = s.length * fs * .56 + fs * 1.2, h = fs * 1.7, X = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return `<rect x="${f(X)}" y="${f(y - h * .72)}" width="${f(w)}" height="${f(h)}" rx="${f(h / 2)}" fill="${bg}"/>` + `<text class="dg" x="${f(X + fs * .6)}" y="${f(y)}" font-size="${fs}" font-weight="600" fill="${fg}">${esc(s)}</text>`;
}
function disc(p, r, fill, label, size = 6, fg = '#fff') { return `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r}" fill="${fill}"/>` + (label ? txt(p[0], p[1] + pt(size) * .35, label, size, { anchor: 'middle', fill: fg, weight: 700 }) : ''); }
function arrowLine(a, b, c, w, dash, o = {}) {
  const v = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...v) || 1, u = [v[0] / l, v[1] / l], W = pt(w);
  const e = [b[0] - u[0] * W * 2.4, b[1] - u[1] * W * 2.4];
  return `<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(e[0])}" y2="${f(e[1])}" stroke="${c}" stroke-width="${W}" stroke-linecap="round"${dash ? ` stroke-dasharray="${f(W * 2.5)} ${f(W * 1.6)}"` : ''}/>` + head(b, u, W * 3.4, W * 3, { fill: c }) + (o.both ? head(a, [-u[0], -u[1]], W * 3.4, W * 3, { fill: c }) : '');
}
const polyD = (pts, closed) => 'M' + pts.map(p => f(p[0]) + ' ' + f(p[1])).join(' L') + (closed ? 'Z' : '');
function panel(x, y, w, h) { return `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="#fff" fill-opacity=".94" stroke="#111" stroke-width="${pt(.5)}"/>`; }
const mtxt = m => m == null ? '—' : Math.round(m) + ' m';

/* ---------- overlays ---------- */
const OVER = {
  site(o, g, L) { return g.site.length ? `<path d="${polyD(g.site, true)}" fill="none" stroke="${L.color}" stroke-width="${pt(L.width)}" stroke-dasharray="${pt(6)} ${pt(2)} ${pt(1)} ${pt(2)}"/>` : ''; },
  parti(o, g, L) {
    const h = g.A('hyper'), dpt = g.A('dept'), c = g.A('crescendo'), u = g.A('ulo');
    let s = `<path d="${crPath([h, c, dpt])}" fill="none" stroke="${L.color}" stroke-width="${pt(L.width)}" stroke-linecap="round" stroke-opacity=".85"/>`;
    ['office', 'hotelMS', 'hotelUU', 'hotelB'].forEach(k => { const p = g.A(k); if (p) s += `<rect x="${f(p[0] - 2.2)}" y="${f(p[1] - 2.2)}" width="4.4" height="4.4" fill="#111"/>`; });
    s += `<rect x="${f(u[0] - 7)}" y="${f(u[1] - 7)}" width="14" height="14" rx="3" fill="#D6338A" fill-opacity=".9"/>` + txt(u[0], u[1] + 1.2, 'ULO', 6.5, { anchor: 'middle', fill: '#fff', weight: 700 });
    s += `<circle cx="${f(c[0])}" cy="${f(c[1] - 12)}" r="4" fill="none" stroke="#E07B00" stroke-width="${pt(2)}"/>` + txt(c[0] + 6, c[1] - 11, 'Crescendo', 6.5, { weight: 700 });
    s += disc(h, 7, '#111', 'A', 8) + disc(dpt, 7, '#111', 'A', 8) + txt(h[0], h[1] + 12, 'Hypermarket', 6, { anchor: 'middle', weight: 600 }) + txt(dpt[0], dpt[1] + 12, 'Department store', 6, { anchor: 'middle', weight: 600 });
    return s;
  },
  edges(o, g, L) {
    const C = centroid(g.site.length ? g.site : [[200, 133]]);
    const role = [['pua', 'PUA head · north or south, reversible', '#1F5FAE', true], ['pulse', 'The Pulse · to GCS', '#2E7D32'], ['gcs', 'GCS', '#2E7D32'], ['boulevard', 'Boulevard', '#555555'], ['desert', 'Desert Terrace', '#A0522D']];
    let s = '';
    role.forEach(([k, name, col, both]) => {
      const p = g.A(k); if (!p) return;
      const v = [p[0] - C[0], p[1] - C[1]], l = Math.hypot(...v) || 1, u = [v[0] / l, v[1] / l];
      const a = [p[0] - u[0] * 12, p[1] - u[1] * 12], b = [p[0] + u[0] * 6, p[1] + u[1] * 6];
      s += arrowLine(a, b, col, 2.4, false, { both }) + pill(b[0] + 3, b[1] + (u[1] > 0 ? 6 : -3), name + (g.est(k) ? ' (position to confirm)' : ''), col, 6);
    });
    return s;
  },
  loop(o, g, L) {
    if (!g.loop.length) return '';
    const S = g.loop.concat([g.loop[0]]);
    let s = `<path d="${crPath(g.loop, true)}" fill="none" stroke="${L.color}" stroke-width="${pt(L.width)}" stroke-opacity=".9" stroke-linejoin="round"/>`;
    for (let i = 0; i < S.length - 1; i += 2) { const a = S[i], b = S[i + 1], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], v = [b[0] - a[0], b[1] - a[1]], l = Math.hypot(...v) || 1; s += head([m[0] + v[0] / l * 2, m[1] + v[1] / l * 2], [v[0] / l, v[1] / l], 3, 3, { fill: '#fff' }); }
    s += disc(g.A('hyper'), 6.5, '#111', 'A', 7.5) + disc(g.A('dept'), 6.5, '#111', 'A', 7.5);
    const c = g.A('crescendo'); s += `<circle cx="${f(c[0])}" cy="${f(c[1])}" r="5.5" fill="#fff" stroke="#E07B00" stroke-width="${pt(2.5)}"/>`;
    s += pill(c[0] + 8, c[1] + 2, 'Crescendo', '#E07B00', 6);
    return s;
  },
  frontage(o, g, L, M) {
    const segs = M.frontage.segs;
    let s = segs.map(sg => { const col = sg.cls === 'active' ? '#E4572E' : sg.cls === 'folly' ? '#8E44AD' : '#9AA0A6'; return [-1, 1].map(side => { const n = [-(sg.b[1] - sg.a[1]) / sg.len * side * 3.2, (sg.b[0] - sg.a[0]) / sg.len * side * 3.2]; return `<line x1="${f(sg.a[0] + n[0])}" y1="${f(sg.a[1] + n[1])}" x2="${f(sg.b[0] + n[0])}" y2="${f(sg.b[1] + n[1])}" stroke="${col}" stroke-width="${pt(L.width)}" stroke-linecap="round"/>`; }).join(''); }).join('');
    s += panel(6, 6, 92, 22) + txt(10, 15, `Active ${M.frontage.pct} % of primary frontage`, 7, { weight: 700 }) + txt(10, 23, `Target ≥ 70 % · ${M.frontage.pct >= 70 ? 'meets' : 'short'} · measured on the loop`, 5.5, { fill: '#444' });
    return s;
  },
  districts(o, g, L) {
    if (!g.loop.length) return '';
    const n = Math.min(DISTRICTS.length, 9), S = crSample(g.loop.concat([g.loop[0]]), 6), step = (S.length - 1) / n;
    let s = '';
    for (let i = 0; i < n; i++) { const p = S[Math.round(i * step)], name = DISTRICTS[i], col = PRECINCT_C[PRECINCT[name]]; const off = [p[0] + (i % 2 ? 10 : -10), p[1] + (i % 2 ? -8 : 8)]; s += `<line x1="${f(p[0])}" y1="${f(p[1])}" x2="${f(off[0])}" y2="${f(off[1])}" stroke="${col}" stroke-width="${pt(.7)}"/><circle cx="${f(p[0])}" cy="${f(p[1])}" r="2" fill="${col}"/>` + pill(off[0], off[1], name, col, 6, '#fff', i % 2 ? 'start' : 'end'); }
    return s;
  },
  journeys(o, g, L, M) {
    const modes = [['pua', '#1F5FAE', 'PUA'], ['pulse', '#2E7D32', 'Pulse'], ['parkW', '#777', 'Car west'], ['parkE', '#777', 'Car east'], ['hotelMS', '#7A4FD0', 'Hotel'], ['office', '#0F8B8D', 'Office']];
    const c = g.A('crescendo');
    let s = '';
    modes.forEach(([k, col, name]) => { const a = g.A(k); if (!a) return; const n = nearestOn(g.loop, a); s += `<path d="${crPath([a, n.p, c])}" fill="none" stroke="${col}" stroke-width="${pt(L.width)}" stroke-linecap="round" stroke-opacity=".9"/>` + head(c, (() => { const v = [c[0] - n.p[0], c[1] - n.p[1]], l = Math.hypot(...v) || 1; return [v[0] / l, v[1] / l]; })(), 3, 2.8, { fill: col }) + pill(a[0] + 3, a[1] - 3, name, col, 5.5); });
    M.journeys.nodes.forEach(p => { s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="2" fill="#fff" stroke="#111" stroke-width="${pt(.8)}"/>`; });
    M.journeys.gens.forEach(p => { s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="4" fill="#F2C230" stroke="#111" stroke-width="${pt(.8)}"/>`; });
    if (M.journeys.worst) { const w = M.journeys.worst; s += `<line x1="${f(w[0][0])}" y1="${f(w[0][1])}" x2="${f(w[1][0])}" y2="${f(w[1][1])}" stroke="#C0392B" stroke-width="${pt(3)}" stroke-dasharray="${pt(3)} ${pt(2)}"/>` + pill((w[0][0] + w[1][0]) / 2, (w[0][1] + w[1][1]) / 2 - 3, `Longest gap ${mtxt(M.journeys.maxGap)}`, M.journeys.maxGap > 150 ? '#C0392B' : '#2E7D32', 5.5, '#fff', 'middle'); }
    return s;
  },
  ulo(o, g, L, M) {
    const u = g.A('ulo'), p = g.A('pulse');
    let s = g.ulos.map(q => `<circle cx="${f(q[0])}" cy="${f(q[1])}" r="3.4" fill="none" stroke="${L.color}" stroke-width="${pt(1.6)}" stroke-dasharray="${pt(2)} ${pt(1.2)}"/>`).join('');
    s += `<circle cx="${f(u[0])}" cy="${f(u[1])}" r="16" fill="${L.color}" fill-opacity=".25" stroke="${L.color}" stroke-width="${pt(2)}"/>` + txt(u[0], u[1] + 1.5, 'ULO', 9, { anchor: 'middle', weight: 700, fill: '#7B1048' });
    s += arrowLine(p, [u[0] + (p[0] - u[0]) * .22, u[1] + (p[1] - u[1]) * .22], '#7B1048', 2.4, false) + pill(p[0] + 4, p[1] + 10, 'Front door on the Pulse', '#7B1048', 6);
    if (g.ulos.length > 1) s += pill(u[0] - 20, u[1] + 24, `Today: ${g.ulos.length} pieces → consolidate into one`, '#C0392B', 5.5);
    return s;
  },
  arrival(o, g, L, M) {
    const c = g.A('crescendo'), pua = g.A('pua'), b = g.A('boulevard');
    let s = arrowLine(pua, c, '#1F5FAE', 3, false) + pill(pua[0] + 4, pua[1] - 4, 'PUA · 10,000 pax/h peak', '#1F5FAE', 6);
    if (M.arrival.passesDeck) s += pill((pua[0] + c[0]) / 2 + 4, (pua[1] + c[1]) / 2, `Passes the parking deck · ≈${o.audit.puaM} m to a shopfront`, '#C0392B', 5.5);
    ['parkW', 'parkE'].forEach((k, i) => { const p = g.A(k); s += arrowLine(b, p, '#666', 2.2, false) + (i ? '' : pill(p[0] - 30, p[1] + 9, 'Car · 9,000 bays at opening', '#666', 5.5)); });
    const h = g.A('hyper'), dpt = g.A('dept'), pul = g.A('pulse');
    s += arrowLine([b[0] - 30, b[1]], h, '#E07B00', 1.8, true) + pill(h[0] - 50, h[1] + 14, 'Taxi / ride-hail / PUDO · n TBC', '#E07B00', 5.5);
    s += arrowLine([b[0] + 30, b[1]], dpt, '#B8860B', 1.8, true) + pill(dpt[0] + 6, dpt[1] + 12, 'VIP / VVIP / Royal · Functional Brief p.27', '#B8860B', 5.5);
    s += arrowLine(pul, c, '#2E7D32', 1.6, true) + pill(pul[0] - 46, pul[1] + 14, 'Cycle / micromobility · n TBC', '#2E7D32', 5.5);
    return s;
  },
  parking(o, g, L, M) {
    let s = '';
    M.parking.items.forEach(it => {
      s += `<circle cx="${f(it.p[0])}" cy="${f(it.p[1])}" r="${f(it.r)}" fill="#555" fill-opacity=".07" stroke="#555" stroke-width="${pt(.8)}" stroke-dasharray="${pt(3)} ${pt(2)}"/>` + `<rect x="${f(it.p[0] - 4)}" y="${f(it.p[1] - 4)}" width="8" height="8" rx="1.5" fill="#555"/>` + txt(it.p[0], it.p[1] + 2, 'P', 7, { anchor: 'middle', fill: '#fff', weight: 700 });
      s += `<line x1="${f(it.p[0])}" y1="${f(it.p[1])}" x2="${f(it.to[0])}" y2="${f(it.to[1])}" stroke="${it.m <= 100 ? '#2E7D32' : '#C0392B'}" stroke-width="${pt(1.6)}"/>` + pill((it.p[0] + it.to[0]) / 2, (it.p[1] + it.to[1]) / 2, `${it.name} → ${it.toName} ${mtxt(it.m)}`, it.m <= 100 ? '#2E7D32' : '#C0392B', 5.5, '#fff', 'middle');
    });
    s += panel(6, 6, 104, 30) + txt(10, 14, 'Day one 9,000 bays', 7, { weight: 700 }) + txt(10, 21, 'Retail 8,000 · Office 600 · Hotel 400 · future 5,000', 5.5) + txt(10, 28, 'Dashed circles: 100 m walk, drawn to scale', 5.5, { fill: '#444' });
    return s;
  },
  servicing(o, g, L, M) {
    const C = centroid(g.site), ring = g.site.map(p => [C[0] + (p[0] - C[0]) * .9, C[1] + (p[1] - C[1]) * .9]);
    let s = `<path d="${polyD(ring, true)}" fill="none" stroke="${L.color}" stroke-width="${pt(L.width)}" stroke-dasharray="${pt(5)} ${pt(2.5)}"/>`;
    ['hyper', 'dept', 'ulo', 'office'].forEach(k => { const a = g.A(k); if (!a) return; const n = nearestOn(ring, a); s += `<line x1="${f(n.p[0])}" y1="${f(n.p[1])}" x2="${f(a[0])}" y2="${f(a[1])}" stroke="${L.color}" stroke-width="${pt(1)}"/>` + pg([[n.p[0] - 3, n.p[1] + 2], [n.p[0] + 3, n.p[1] + 2], [n.p[0], n.p[1] - 3]], { fill: L.color }); });
    M.servicing.cores.forEach(p => { s += `<rect x="${f(p[0] - 2)}" y="${f(p[1] - 2)}" width="4" height="4" fill="#111"/>`; });
    s += panel(6, 6, 100, 22) + txt(10, 14, 'Perimeter BOH ring and cross-docks', 6.5, { weight: 700 }) + txt(10, 22, `Farthest point on the loop from a core: ${mtxt(M.servicing.maxM)}`, 5.5, { fill: M.servicing.maxM > 60 ? '#C0392B' : '#2E7D32' });
    return s;
  },
  office(o, g, L, M) {
    const of = g.A('office'), pua = g.A('pua'), pul = g.A('pulse'), de = g.A('desert');
    const cone = (to, col) => { const v = [to[0] - of[0], to[1] - of[1]], l = Math.hypot(...v) || 1, u = [v[0] / l, v[1] / l], n = [-u[1], u[0]], R = 60; return pg([of, [of[0] + u[0] * R + n[0] * 22, of[1] + u[1] * R + n[1] * 22], [of[0] + u[0] * R - n[0] * 22, of[1] + u[1] * R - n[1] * 22]], { fill: col, 'fill-opacity': .18, stroke: col, 'stroke-width': pt(.6) }); };
    let s = cone(de, '#A0522D') + cone(pul, '#2E7D32');
    s += arrowLine(pua, of, '#1F5FAE', 2, false) + pill((pua[0] + of[0]) / 2 + 3, (pua[1] + of[1]) / 2, `PUA → lobby ${mtxt(M.office.puaM)}`, '#1F5FAE', 5.5);
    s += `<rect x="${f(of[0] - 5)}" y="${f(of[1] - 5)}" width="10" height="10" fill="${L.color}"/>` + pill(of[0] + 7, of[1] + 3, 'Office lobby: car + PUA meet', L.color, 6);
    return s;
  },
  hotels(o, g, L) {
    const H = [['hotelMS', 'Midscale · 350 keys', '#2A9D8F'], ['hotelUU', 'Upper upscale · 250 keys', '#7A4FD0'], ['hotelB', 'Boutique (ULO) · 125 keys', '#D6338A']];
    let s = '';
    H.forEach(([k, name, col]) => { const p = g.A(k); if (!p) return; s += `<rect x="${f(p[0] - 4.5)}" y="${f(p[1] - 4.5)}" width="9" height="9" fill="${col}" stroke="#111" stroke-width="${pt(.6)}"/>` + pg([[p[0] - 2.4, p[1] + 9], [p[0] + 2.4, p[1] + 9], [p[0], p[1] + 5.5]], { fill: '#111' }) + pill(p[0] + 7, p[1] + 2, name + (g.est(k) ? ' (position to confirm)' : ''), col, 6); });
    s += panel(6, 6, 108, 22) + txt(10, 14, '725 keys · own front door and BOH each', 6.5, { weight: 700 }) + txt(10, 22, 'Design Brief split; Functional Brief says 490/150/80', 5.5, { fill: '#444' });
    return s;
  },
  climate(o, g, L) {
    if (!g.loop.length) return '';
    let s = `<defs><pattern id="sh${o.id}" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="3" stroke="${L.color}" stroke-width=".6"/></pattern></defs>`;
    s += `<path d="${crPath(g.loop, true)}" fill="none" stroke="url(#sh${o.id})" stroke-width="${L.width}" stroke-opacity=".9"/>`;
    s += `<path d="${crPath(g.loop, true)}" fill="none" stroke="#1F5FAE" stroke-width="${pt(1.6)}" stroke-dasharray="${pt(3)} ${pt(2)}"/>`;
    s += arrowLine([CW - 20, CH - 20], [CW - 60, CH - 60], '#E07B00', 2, false) + pill(CW - 120, CH - 14, 'Peak summer sun', '#E07B00', 5.5);
    s += panel(6, 6, 104, 30) + txt(10, 14, 'Shaded route end to end', 7, { weight: 700 }) + txt(10, 21, 'Hatch: canopy shade · blue: conditioned route', 5.5) + txt(10, 28, 'No ground-floor water · roof as fifth façade', 5.5, { fill: '#444' });
    return s;
  },
  clock(o, g, L) {
    const B = [['hyper', 'Daily needs · 10:00–22:00', '#2E7D32'], ['dept', 'Leisure & Fashion · 10:00–24:00', '#C2185B'], ['ulo', 'E&L · to 04:00–06:00, closes on its own', '#6A1B9A'], ['crescendo', 'Ramadan late hours · Eid · events', '#E07B00']];
    let s = ''; B.forEach(([k, t, c], i) => { const p = g.A(k); if (p) s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="3" fill="${c}" stroke="#fff" stroke-width="${pt(.8)}"/>` + pill(p[0] + 5, p[1] + (i % 2 ? 8 : -4), t, c, 6); });
    const u = g.A('ulo'); s += `<circle cx="${f(u[0])}" cy="${f(u[1])}" r="18" fill="#6A1B9A" fill-opacity=".14" stroke="#6A1B9A" stroke-width="${pt(1)}" stroke-dasharray="${pt(2)} ${pt(1.5)}"/>`;
    const months = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
    s += panel(6, CH - 30, 150, 24) + txt(10, CH - 22, 'Calendar (indicative)', 6, { weight: 700 });
    months.forEach((m, i) => { s += txt(12 + i * 11.5, CH - 10, m, 5.5, { anchor: 'middle' }); });
    s += `<rect x="${f(12 + 1.5 * 11.5)}" y="${CH - 18}" width="${f(11.5)}" height="3" fill="#6A1B9A"/>` + `<rect x="${f(12 + 9.3 * 11.5)}" y="${CH - 18}" width="${f(23)}" height="3" fill="#E07B00"/>`;
    return s;
  },
  phasing(o, g, L) {
    const d = g.A('dept'); let s = '';
    if (g.loop.length) s += `<path d="${crPath(g.loop, true)}" fill="none" stroke="#111" stroke-width="${pt(4)}"/>` + pill(g.loop[0][0] - 10, g.loop[0][1] + 10, 'Phase 1 · opening', '#111', 6);
    s += `<rect x="${f(d[0] + 6)}" y="${f(d[1] - 26)}" width="44" height="40" rx="3" fill="#6C757D" fill-opacity=".12" stroke="#6C757D" stroke-width="${pt(1.4)}" stroke-dasharray="${pt(4)} ${pt(2)}"/>` + pill(d[0] + 8, d[1] + 22, 'Phase 2 · +20 % GLA ≈ 40,000 m²', '#6C757D', 5.5);
    s += panel(6, 6, 96, 22) + txt(10, 14, 'Growth without breaking the loop', 6.5, { weight: 700 }) + txt(10, 22, 'Parking 9,000 → 5,000 converts at 6.0 m floor-to-floor', 5.5, { fill: '#444' });
    return s;
  },
  gla(o, g, L) {
    const a = o.audit, x0 = 40, y0 = 70, W = 330, H = 120, max = 260, sx = v => x0 + v / max * W;
    const cols = ['#1F3F66', '#4F76A6', '#A9BFDB'], names = ['Ground floor', 'Level 1', 'Half of level 2'];
    let s = panel(x0 - 30, y0 - 30, W + 50, H + 30) + txt(x0 - 22, y0 - 18, `${o.name} · retail area on GF + L1 + ½L2 (k m²)`, 8, { weight: 700 });
    let acc = 0; a.gla.forEach((v, i) => { if (v == null) { s += `<rect x="${f(sx(acc))}" y="${y0 + 10}" width="${f(sx(30) - sx(0))}" height="30" fill="none" stroke="#888" stroke-dasharray="2 2"/>` + txt(sx(acc) + 3, y0 + 28, 'L2 not drawn', 5.5); return; } s += `<rect x="${f(sx(acc))}" y="${y0 + 10}" width="${f(sx(v) - sx(0))}" height="30" fill="${cols[i]}"/>` + txt(sx(acc) + 3, y0 + 52, `${names[i]} ${v}k`, 5.5, { fill: '#222' }); acc += v; });
    s += txt(sx(acc) + 4, y0 + 29, `${Math.round(acc)}k`, 9, { weight: 700 });
    s += `<line x1="${f(sx(200))}" y1="${y0}" x2="${f(sx(200))}" y2="${y0 + 66}" stroke="#B8321F" stroke-width="${pt(1.5)}" stroke-dasharray="${pt(4)} ${pt(2)}"/>` + txt(sx(200) + 3, y0 + 64, 'Brief 200k', 6, { fill: '#B8321F', weight: 700 });
    s += `<line x1="${f(sx(a.drawn))}" y1="${y0 + 4}" x2="${f(sx(a.drawn))}" y2="${y0 + 46}" stroke="#111" stroke-width="${pt(1.2)}"/><circle cx="${f(sx(a.drawn))}" cy="${y0 + 2}" r="2" fill="#fff" stroke="#111" stroke-width="${pt(1)}"/>` + txt(sx(a.drawn) + 3, y0 + 2, `As drawn ${a.drawn}k on ${a.levels}`, 5.5);
    [0, 50, 100, 150, 200, 250].forEach(v => { s += `<line x1="${f(sx(v))}" y1="${y0 + 80}" x2="${f(sx(v))}" y2="${y0 + 84}" stroke="#111" stroke-width="${pt(.5)}"/>` + txt(sx(v), y0 + 90, v + 'k', 5.5, { anchor: 'middle' }); });
    s += txt(x0 - 22, y0 + H - 6, 'Source: RMUH Option Plan Audit, 30 Sep. Tenant zones incl. tenant BOH, ±10 %.', 5.5, { fill: '#555' });
    return s;
  },
  aspirations(o, g, L) {
    const items = L.items || ASPIRATIONS; let s = panel(CW - 150, 10, 140, 18 + items.length * 9) + txt(CW - 144, 21, 'Design aspirations · not yet drawn', 7, { weight: 700 });
    items.forEach((t, i) => { s += txt(CW - 144, 32 + i * 9, '• ' + t, 6); }); return s;
  },
  text(o, g, L) { return txt(L.at[0], L.at[1], L.text || 'Label', L.width, { fill: L.color, weight: 600 }); },
  arrow(o, g, L) { return taper([L.from, [(L.from[0] + L.to[0]) / 2, (L.from[1] + L.to[1]) / 2 - 6], L.to], L.width, L.width * .4, L.color, .9, 1.6); },
};
const LEG = {
  site: L => [{ t: 'dash', c: L.color, zh: '', en: 'Site boundary' }],
  parti: () => [{ t: 'line', c: '#111', zh: '', en: 'Spine', w: 4 }, { t: 'dot', c: '#111', zh: '', en: 'Anchor' }, { t: 'fill', c: '#D6338A', zh: '', en: 'ULO' }],
  edges: () => [{ t: 'line', c: '#1F5FAE', zh: '', en: 'Transit edge' }, { t: 'line', c: '#2E7D32', zh: '', en: 'Pulse edge' }],
  loop: L => [{ t: 'line', c: L.color, zh: '', en: 'Retail loop', w: 4 }, { t: 'dot', c: '#111', zh: '', en: 'Anchor at the end' }],
  frontage: () => [{ t: 'line', c: '#E4572E', zh: '', en: 'Active' }, { t: 'line', c: '#9AA0A6', zh: '', en: 'Passive' }, { t: 'line', c: '#8E44AD', zh: '', en: 'Folly' }],
  districts: () => Object.entries(PRECINCT_C).map(([n, c]) => ({ t: 'fill', c, zh: '', en: n })),
  journeys: () => [{ t: 'line', c: '#1F5FAE', zh: '', en: 'PUA' }, { t: 'line', c: '#2E7D32', zh: '', en: 'Pulse' }, { t: 'line', c: '#777', zh: '', en: 'Car' }, { t: 'dot', c: '#F2C230', zh: '', en: 'Generator' }],
  ulo: L => [{ t: 'circle', c: L.color, zh: '', en: 'ULO, one place' }],
  arrival: () => [{ t: 'line', c: '#1F5FAE', zh: '', en: 'PUA' }, { t: 'line', c: '#666', zh: '', en: 'Car' }, { t: 'dash', c: '#E07B00', zh: '', en: 'Taxi / PUDO' }, { t: 'dash', c: '#B8860B', zh: '', en: 'VIP / Royal' }],
  parking: () => [{ t: 'circle', c: '#555', zh: '', en: '100 m walk' }],
  servicing: L => [{ t: 'dash', c: L.color, zh: '', en: 'BOH ring' }, { t: 'fill', c: '#111', zh: '', en: 'Core' }],
  office: () => [{ t: 'fill', c: '#A0522D', zh: '', en: 'View cone' }],
  hotels: () => [{ t: 'fill', c: '#2A9D8F', zh: '', en: 'Midscale' }, { t: 'fill', c: '#7A4FD0', zh: '', en: 'Upper upscale' }, { t: 'fill', c: '#D6338A', zh: '', en: 'Boutique' }],
  climate: L => [{ t: 'line', c: L.color, zh: '', en: 'Shade' }, { t: 'dash', c: '#1F5FAE', zh: '', en: 'Cool route' }],
  clock: () => [{ t: 'fill', c: '#6A1B9A', zh: '', en: 'Late trading' }],
  phasing: () => [{ t: 'line', c: '#111', zh: '', en: 'Phase 1' }, { t: 'dash', c: '#6C757D', zh: '', en: 'Phase 2' }],
};

/* ---------- measurements: computed from anchors, scaled by the plan's calibrated metres per unit ---------- */
function measure(d, o) {
  const v = findView(o, d); if (!v) return null;
  const g = geo(v), m = u => g.mpu ? u * g.mpu : null, M = { mpu: g.mpu, view: v.name };
  const loopSegs = g.loop.map((a, i) => { const b = g.loop[(i + 1) % g.loop.length]; return { a, b, len: dist(a, b) || 1 }; });
  // Frontage: passive within 35 m of a parking anchor; folly within 40 m of the Pulse landing (pavilions); else active.
  const near = (p, k, r) => { const q = g.A(k); return q && m(dist(p, q)) != null && m(dist(p, q)) < r; };
  let act = 0, tot = 0;
  M.frontage = { segs: loopSegs.map(sg => { const mid = [(sg.a[0] + sg.b[0]) / 2, (sg.a[1] + sg.b[1]) / 2]; const cls = ['parkW', 'parkE', 'deck'].some(k => near(mid, k, 35)) ? 'passive' : near(mid, 'pulse', 40) ? 'folly' : 'active'; tot += sg.len; if (cls === 'active') act += sg.len; return Object.assign({ cls }, sg); }) };
  M.frontage.pct = tot ? Math.round(act / tot * 100) : 0;
  // Journeys: nodes are loop vertices; generators are anchors, ULO and crescendo. Gap = longest loop segment.
  const gens = ['hyper', 'dept', 'ulo', 'crescendo'].map(g.A).filter(Boolean);
  let worst = null, mg = 0; loopSegs.forEach(sg => { const L = m(sg.len); if (L != null && L > mg) { mg = L; worst = [sg.a, sg.b]; } });
  M.journeys = { nodes: g.loop, gens, maxGap: mg || null, worst, perimeter: m(loopSegs.reduce((a, s) => a + s.len, 0)) };
  // Arrival: does the PUA → crescendo line pass within 25 m of the parking deck?
  const pua = g.A('pua'), cr = g.A('crescendo'), deck = g.A('deck');
  // 60 m, not 25: anchors sit on the deck's symbol, and the audit traced the station route past the deck itself in all four options.
  M.arrival = { passesDeck: !!(pua && cr && deck && m(segDist(deck, pua, cr)) < 60), puaM: o.audit.puaM };
  // Parking reach: each parking anchor to the nearest retail anchor.
  M.parking = { items: [['parkW', 'P west'], ['parkE', 'P east'], ['deck', 'P deck']].map(([k, name]) => { const p = g.A(k); if (!p) return null; const cands = [['hyper', 'hypermarket'], ['dept', 'dept store']].map(([q, qn]) => [g.A(q), qn]).filter(x => x[0]); const best = cands.reduce((a, c) => dist(p, c[0]) < dist(p, a[0]) ? c : a, cands[0]); return { p, name, to: best[0], toName: best[1], m: m(dist(p, best[0])), r: g.mpu ? 100 / g.mpu : 20 }; }).filter(Boolean) };
  M.parking.worst = Math.max(...M.parking.items.filter(x => x.name !== 'P deck').map(x => x.m || 0));
  // Servicing: cores every second loop vertex; worst distance from any loop point to a core.
  const cores = g.loop.filter((_, i) => i % 2 === 0); let smax = 0;
  crSample(g.loop.concat([g.loop[0]]), 6).forEach(p => { const dd = Math.min(...cores.map(c => dist(p, c))); smax = Math.max(smax, dd); });
  M.servicing = { cores, maxM: m(smax) };
  const of = g.A('office'); M.office = { puaM: of && pua ? m(dist(of, pua)) : null };
  M.ulo = { pieces: g.ulos.length };
  M.gla = { onLevels: o.audit.gla.reduce((a, x) => a + (x || 0), 0), drawn: o.audit.drawn };
  return M;
}

function overlaySvg(d, o, v, upto = Infinity) {
  const g = geo(v), M = measure(d, o); const missing = [];
  let s = '';
  d.layers.forEach((L, i) => {
    if (i >= upto || !L.on) return;
    const need = (LTYPES[L.type].needs || []).filter(k => !g.A(k));
    if (need.length) { missing.push({ layer: L.name, need }); return; }
    if (L.type !== 'legend' && L.type !== 'text' && L.type !== 'arrow' && !['gla', 'aspirations', 'climate', 'districts'].includes(L.type) && !g.loop.length && ['loop', 'frontage', 'journeys', 'servicing', 'phasing'].includes(L.type)) { missing.push({ layer: L.name, need: ['loop'] }); return; }
    let inner;
    if (L.type === 'legend') { const items = []; d.layers.slice(0, i).forEach(x => { if (x.on && LEG[x.type]) items.push(...LEG[x.type](x)); }); inner = items.length ? legend(items, L.pos === 'bl' ? 4 : 'r', 'b', { title: ['', 'Legend'], w: 58 }).replace(/^<g data-k="labels\/legend" >/, '').replace(/<\/g>$/, '') : ''; }
    else inner = OVER[L.type](o, g, L, M);
    s += `<g data-k="${L.id}" data-layer="${L.id}" data-name="${esc(L.name)}"${L.dx || L.dy ? ` transform="translate(${f(L.dx || 0)},${f(L.dy || 0)})"` : ''}>${inner}</g>`;
  });
  return { svg: s, missing, M };
}

/* stage = how many pipeline nodes to include. Node order: read, bg…, layers…, sheet, write. */
function renderSheet(d, o, stage = Infinity, extra = '') {
  const u = ++UID, nbg = d.bg.length, nl = d.layers.length;
  const st = bgState(d, o, Math.max(0, Math.min(nbg, stage - 1)));
  if (st.missing) return { missing: true, svg: '', st };
  const ov = overlaySvg(d, o, st.view, Math.max(0, Math.min(nl, stage - 1 - nbg)));
  const showFrame = stage > 1 + nbg + nl;
  const frame = showFrame ? `<g data-k="sheet/title" data-layer="sheet" data-name="Sheet frame">` +
    `<text class="dg" x="10" y="12.6" font-size="${pt(TOK.title)}" font-weight="700">${esc(d.id)} · ${esc(d.name)}</text>` +
    `<text class="dg" x="410" y="12.6" font-size="${pt(TOK.title)}" font-weight="600" text-anchor="end">${esc(o.name)} · ${esc(o.tag)}</text>` +
    `<line x1="10" y1="288" x2="410" y2="288" stroke="#111" stroke-width="${pt(.5)}"/>` +
    `<text class="dg" x="10" y="293.4" font-size="${pt(5.5)}">Qiddiya D1 RMUH · ${esc(d.succeeds || '').slice(0, 120)}</text>` +
    `<text class="dg" x="410" y="293.4" font-size="${pt(5.5)}" text-anchor="end">${esc(st.view.name)} · A3</text></g>` : '';
  const svg = `<svg class="dg-svg" viewBox="0 0 420 297" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">` +
    `<rect width="420" height="297" fill="#fff"/><defs><clipPath id="cl${u}"><rect width="${CW}" height="${CH}"/></clipPath></defs>${frame}` +
    `<g class="dg-content" transform="translate(10,19)" clip-path="url(#cl${u})">${backgroundSvg(st, u)}${ov.svg}</g>` +
    `<g class="vw-handles" transform="translate(10,19)">${extra}</g></svg>`;
  return { svg, st, missing: false, overlayMissing: ov.missing, M: ov.M };
}
