/* DiagramLab Flow — SVG sheet → layered PDF, written by hand (no library: the artifact host only loads
   scripts from public CDNs, and a writer we own can emit optional content groups, which is the point).
   Output: A3 landscape. One PDF layer (OCG) per pipeline layer, named by its key. The background is
   rasterised once at 300 ppi and placed as its own layer under the vectors; overlays stay vector, text
   stays live text. Latin uses Helvetica; Chinese uses the Adobe CJK font STSong-Light (not embedded:
   Acrobat and Preview supply it; embedding the office typeface comes with the real export worker). */

const MM = 72 / 25.4;
function parseColor(c, doc) {
  if (!c || c === 'none' || c === 'transparent') return null;
  if (c.startsWith('url(')) {
    const g = doc.getElementById(c.slice(5, -1)); if (!g) return null;
    const stops = [...g.querySelectorAll('stop')]; if (!stops.length) return null;
    const cs = stops.map(s => parseColor(s.getAttribute('stop-color'), doc)).filter(Boolean);
    const op = stops.reduce((a, s) => a + +(s.getAttribute('stop-opacity') ?? 1), 0) / stops.length;
    return { rgb: [0, 1, 2].map(i => cs.reduce((a, x) => a + x.rgb[i], 0) / cs.length), op };
  }
  if (c[0] === '#') { let h = c.slice(1); if (h.length === 3) h = h.split('').map(x => x + x).join(''); return { rgb: [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16) / 255), op: 1 }; }
  const m = /rgba?\(([^)]+)\)/.exec(c); if (m) { const v = m[1].split(',').map(parseFloat); return { rgb: v.slice(0, 3).map(x => x / 255), op: v[3] ?? 1 }; }
  if (c === 'white') return { rgb: [1, 1, 1], op: 1 }; if (c === 'black') return { rgb: [0, 0, 0], op: 1 };
  return null;
}
const mul = (A, B) => [A[0] * B[0] + A[2] * B[1], A[1] * B[0] + A[3] * B[1], A[0] * B[2] + A[2] * B[3], A[1] * B[2] + A[3] * B[3], A[0] * B[4] + A[2] * B[5] + A[4], A[1] * B[4] + A[3] * B[5] + A[5]];
function parseTransform(t) {
  let M = [1, 0, 0, 1, 0, 0]; if (!t) return M;
  t.replace(/(\w+)\(([^)]*)\)/g, (_, fn, a) => {
    const v = a.split(/[\s,]+/).filter(Boolean).map(parseFloat);
    if (fn === 'translate') M = mul(M, [1, 0, 0, 1, v[0], v[1] || 0]);
    if (fn === 'scale') M = mul(M, [v[0], 0, 0, v[1] ?? v[0], 0, 0]);
    if (fn === 'matrix') M = mul(M, v);
    if (fn === 'rotate') { const r = v[0] * Math.PI / 180; M = mul(M, [Math.cos(r), Math.sin(r), -Math.sin(r), Math.cos(r), 0, 0]); }
  });
  return M;
}
const n = v => (Math.round(v * 1000) / 1000).toString();
function pathOps(d) {
  const t = d.match(/[MLHVCZQmlhvcz]|-?\d*\.?\d+(?:e-?\d+)?/g) || []; let i = 0, cmd = '', x = 0, y = 0, sx = 0, sy = 0, out = '';
  const num = () => parseFloat(t[i++]);
  while (i < t.length) {
    if (/[a-zA-Z]/.test(t[i])) cmd = t[i++];
    switch (cmd) {
      case 'M': x = num(); y = num(); sx = x; sy = y; out += `${n(x)} ${n(y)} m `; cmd = 'L'; break;
      case 'L': x = num(); y = num(); out += `${n(x)} ${n(y)} l `; break;
      case 'H': x = num(); out += `${n(x)} ${n(y)} l `; break;
      case 'V': y = num(); out += `${n(x)} ${n(y)} l `; break;
      case 'C': { const a = [num(), num(), num(), num(), num(), num()]; out += a.map(n).join(' ') + ' c '; x = a[4]; y = a[5]; break; }
      case 'Q': { const a = [num(), num(), num(), num()]; out += `${n(x + 2 / 3 * (a[0] - x))} ${n(y + 2 / 3 * (a[1] - y))} ${n(a[2] + 2 / 3 * (a[0] - a[2]))} ${n(a[3] + 2 / 3 * (a[1] - a[3]))} ${n(a[2])} ${n(a[3])} c `; x = a[2]; y = a[3]; break; }
      case 'Z': case 'z': out += 'h '; x = sx; y = sy; break;
      default: i++;
    }
  }
  return out;
}
function ellipseOps(cx, cy, rx, ry) {
  const k = .5523;
  return `${n(cx + rx)} ${n(cy)} m ${n(cx + rx)} ${n(cy + ry * k)} ${n(cx + rx * k)} ${n(cy + ry)} ${n(cx)} ${n(cy + ry)} c ${n(cx - rx * k)} ${n(cy + ry)} ${n(cx - rx)} ${n(cy + ry * k)} ${n(cx - rx)} ${n(cy)} c ${n(cx - rx)} ${n(cy - ry * k)} ${n(cx - rx * k)} ${n(cy - ry)} ${n(cx)} ${n(cy - ry)} c ${n(cx + rx * k)} ${n(cy - ry)} ${n(cx + rx)} ${n(cy - ry * k)} ${n(cx + rx)} ${n(cy)} c h `;
}
const WIN = { '•': 0x95, '½': 0xBD, '±': 0xB1, '·': 0xB7, '–': 0x96, '—': 0x97, '×': 0xD7, '’': 0x92, '‘': 0x91, '“': 0x93, '”': 0x94, '°': 0xB0, 'é': 0xE9, '…': 0x85 };
// Standard Helvetica has no glyphs for these; spell them out rather than print '?'.
const SUBST = { '→': '->', '←': '<-', '↔': '<->', '≥': '>=', '≤': '<=', '≈': '~', '²': '2', '✓': 'v', '✕': 'x', '−': '-' };
function latin(s) {
  s = [...s].map(ch => SUBST[ch] ?? ch).join('');
  let o = '';
  for (const ch of s) { const c = ch.charCodeAt(0); let b = c < 128 ? c : WIN[ch] ?? 63; if (b === 40 || b === 41 || b === 92) o += '\\' + ch; else if (b < 32 || b > 126) o += '\\' + b.toString(8).padStart(3, '0'); else o += String.fromCharCode(b); }
  return '(' + o + ')';
}
const isCJK = ch => /[⺀-鿿　-〿＀-￯]/.test(ch);
function cjkHex(s) { let h = ''; for (const ch of s) h += ch.charCodeAt(0).toString(16).padStart(4, '0'); return '<' + h + '>'; }
let measureCtx;
function textWidth(s, size, bold) {
  measureCtx = measureCtx || document.createElement('canvas').getContext('2d');
  let w = 0, run = '';
  const flush = () => { if (run) { measureCtx.font = `${bold ? 'bold ' : ''}100px Helvetica, Arial, sans-serif`; w += measureCtx.measureText(run).width / 100 * size; run = ''; } };
  for (const ch of s) { if (isCJK(ch)) { flush(); w += size; } else run += ch; }
  flush(); return w;
}

const dataUrlCache = {};
async function toDataUrl(url) {
  if (dataUrlCache[url]) return dataUrlCache[url];
  const blob = await (await fetch(url)).blob();
  return dataUrlCache[url] = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
}
/* Rasterise the background group alone, at 300 ppi of its printed size. */
async function rasterBackground(svgDoc, ppi = 300) {
  const content = svgDoc.querySelector('.dg-content'), bg = content && content.querySelector('[data-k="background"]');
  if (!bg) return null;
  for (const im of bg.querySelectorAll('image')) {
    const href = im.getAttribute('href') || im.getAttribute('xlink:href') || '';
    if (href && !href.startsWith('data:')) im.setAttribute('href', await toDataUrl(href));
  }
  const defs = [...svgDoc.querySelectorAll('defs')].map(x => new XMLSerializer().serializeToString(x)).join('');
  const W = Math.round(400 / 25.4 * ppi), H = Math.round(266 / 25.4 * ppi);
  const src = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 400 266">${defs}${new XMLSerializer().serializeToString(bg)}</svg>`;
  const url = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' }));
  try {
    const img = new Image(); img.decoding = 'sync';
    await new Promise((res, rej) => { img.onload = res; img.onerror = () => rej(new Error('background did not decode')); img.src = url; });
    const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
    const g = cv.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.drawImage(img, 0, 0, W, H);
    const blob = await new Promise(r => cv.toBlob(r, 'image/jpeg', .9));
    return { bytes: new Uint8Array(await blob.arrayBuffer()), W, H, ppi };
  } finally { URL.revokeObjectURL(url); }
}

async function pdfPage(svgString, gs, gsName, usedCJK) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const root = doc.documentElement;
  const layers = []; // {name, ops}
  const raster = await rasterBackground(doc).catch(e => ({ error: e.message }));
  const report = { layers: [], raster: raster && !raster.error ? `${raster.W} × ${raster.H} px · ${raster.ppi} ppi` : (raster && raster.error) || 'none' };

  function emit(el, M, opacity, out) {
    if (el.nodeType !== 1) return;
    const tag = el.tagName;
    if (tag === 'defs' || tag === 'clipPath' || tag === 'linearGradient' || tag === 'radialGradient' || tag === 'filter' || tag === 'title') return;
    if (el.getAttribute('display') === 'none') return;
    const M2 = mul(M, parseTransform(el.getAttribute('transform')));
    const op = opacity * +(el.getAttribute('opacity') ?? 1);
    if (tag === 'g' || tag === 'svg') { for (const c of el.childNodes) emit(c, M2, op, out); return; }
    const fill = parseColor(el.getAttribute('fill') ?? (tag === 'text' ? '#111' : (tag === 'line' || tag === 'polyline') ? 'none' : '#000'), doc);
    const stroke = parseColor(el.getAttribute('stroke'), doc);
    const fo = op * +(el.getAttribute('fill-opacity') ?? 1) * (fill ? fill.op : 1), so = op * +(el.getAttribute('stroke-opacity') ?? 1) * (stroke ? stroke.op : 1);
    let o = `q ${M2.map(n).join(' ')} cm /${gsName(fo, so)} gs `;
    if (tag === 'text') {
      if (!fill) return;
      const size = +el.getAttribute('font-size') || 2, anchor = el.getAttribute('text-anchor') || 'start', boldP = +(el.getAttribute('font-weight') || 400) >= 600;
      const lines = []; let line = { x: +el.getAttribute('x') || 0, y: +el.getAttribute('y') || 0, runs: [] }; lines.push(line);
      for (const c of el.childNodes) {
        if (c.nodeType === 3) { if (c.textContent) line.runs.push({ s: c.textContent, size, bold: boldP }); continue; }
        if (c.tagName !== 'tspan') continue;
        if (c.hasAttribute('x')) { line = { x: +c.getAttribute('x'), y: line.y + (+c.getAttribute('dy') || 0), runs: [] }; lines.push(line); }
        line.runs.push({ s: c.textContent, size: +c.getAttribute('font-size') || size, bold: c.hasAttribute('font-weight') ? +c.getAttribute('font-weight') >= 600 : boldP });
      }
      o += `${fill.rgb.map(n).join(' ')} rg `;
      lines.forEach(L => {
        const w = L.runs.reduce((a, r) => a + textWidth(r.s, r.size, r.bold), 0);
        let x = L.x - (anchor === 'middle' ? w / 2 : anchor === 'end' ? w : 0);
        L.runs.forEach(r => {
          let seg = '', cj = null;
          const flush = () => { if (!seg) return; if (cj) usedCJK.v = true; o += `BT /${cj ? 'F3' : r.bold ? 'F2' : 'F1'} ${n(r.size)} Tf 1 0 0 -1 ${n(x)} ${n(L.y)} Tm ${cj ? cjkHex(seg) : latin(seg)} Tj ET `; x += textWidth(seg, r.size, r.bold); seg = ''; };
          for (const ch of r.s) { const k = isCJK(ch); if (cj !== null && k !== cj) flush(); cj = k; seg += ch; }
          flush();
        });
      });
      out.push(o + 'Q'); return;
    }
    let p = '';
    const a = k => +el.getAttribute(k) || 0;
    if (tag === 'rect') p = `${n(a('x'))} ${n(a('y'))} ${n(a('width'))} ${n(a('height'))} re `;
    else if (tag === 'circle') p = ellipseOps(a('cx'), a('cy'), a('r'), a('r'));
    else if (tag === 'ellipse') p = ellipseOps(a('cx'), a('cy'), a('rx'), a('ry'));
    else if (tag === 'line') p = `${n(a('x1'))} ${n(a('y1'))} m ${n(a('x2'))} ${n(a('y2'))} l `;
    else if (tag === 'polyline' || tag === 'polygon') { const v = (el.getAttribute('points') || '').trim().split(/[\s,]+/).map(parseFloat); for (let i = 0; i + 1 < v.length; i += 2) p += `${n(v[i])} ${n(v[i + 1])} ${i ? 'l' : 'm'} `; if (tag === 'polygon') p += 'h '; }
    else if (tag === 'path') p = pathOps(el.getAttribute('d') || '');
    else return;
    if (fill) o += `${fill.rgb.map(n).join(' ')} rg `;
    if (stroke) {
      o += `${stroke.rgb.map(n).join(' ')} RG ${n(+el.getAttribute('stroke-width') || 1)} w `;
      if (el.getAttribute('stroke-linecap') === 'round') o += '1 J ';
      if (el.getAttribute('stroke-linejoin') === 'round') o += '1 j ';
      const da = el.getAttribute('stroke-dasharray'); if (da && da !== 'none') o += `[${da.split(/[\s,]+/).map(parseFloat).map(n).join(' ')}] 0 d `;
    }
    o += p + (fill && stroke ? 'B' : fill ? 'f' : stroke ? 'S' : 'n') + ' Q';
    out.push(o);
  }

  const content = root.querySelector('.dg-content');
  const CM = parseTransform(content.getAttribute('transform'));
  const clipRect = content.querySelector('clipPath rect') || doc.querySelector('clipPath rect');
  const clip = `${n(CM[4])} ${n(CM[5])} ${n(+clipRect.getAttribute('width'))} ${n(+clipRect.getAttribute('height'))} re W n `;
  if (raster && !raster.error) { layers.push({ name: 'background (raster)', ops: [`q 400 0 0 -266 ${n(CM[4])} ${n(CM[5] + 266)} cm /Im0 Do Q`] }); report.layers.push({ name: 'background', kind: 'raster' }); }
  for (const g of content.children) {
    if (g.getAttribute('data-k') === 'background' || g.tagName === 'defs') continue;
    const out = []; emit(g, CM, 1, out);
    layers.push({ name: g.getAttribute('data-name') ? `${g.getAttribute('data-name')}` : g.getAttribute('data-k'), ops: out, clip: true });
    report.layers.push({ name: g.getAttribute('data-name') || g.getAttribute('data-k'), kind: 'vector' });
  }
  const frame = root.querySelector('[data-k="sheet/title"]');
  if (frame) { const out = []; emit(frame, [1, 0, 0, 1, 0, 0], 1, out); layers.push({ name: 'sheet frame', ops: out }); report.layers.push({ name: 'sheet frame', kind: 'text' }); }

  return { layers, raster: raster && !raster.error ? raster : null, clip, report };
}

/* Many sheets → one PDF. Layers with the same name share one OCG, so "Retail loop" toggles on every page at once. */
async function sheetsToPdf(svgStrings, meta = {}) {
  const gs = new Map(); const gsName = (ca, CA) => { const k = n(ca) + '/' + n(CA); if (!gs.has(k)) gs.set(k, { name: 'GS' + gs.size, ca, CA }); return gs.get(k).name; };
  const pages = []; const usedCJK = { v: false }; for (const s of svgStrings) pages.push(await pdfPage(s, gs, gsName, usedCJK));
  const PW = 420 * MM, PH = 297 * MM;
  const parts = []; const offs = []; let len = 0;
  function latin1(s) { const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 255; return b; }
  const push = x => { const b = typeof x === 'string' ? latin1(x) : x; parts.push(b); len += b.length; };
  const obj = (id, body) => { offs[id] = len; push(`${id} 0 obj\n`); if (Array.isArray(body)) body.forEach(push); else push(body); push('\nendobj\n'); };
  // fixed ids: 1 catalog, 2 pages, 3-5 fonts F1 F2 F3, 6 CID font, 7 descriptor, 8 info
  let next = 9;
  const ocgByName = new Map(); pages.forEach(pg => pg.layers.forEach(L => { if (!ocgByName.has(L.name)) ocgByName.set(L.name, next++); }));
  const pageIds = pages.map(pg => ({ page: next++, content: next++, img: pg.raster ? next++ : 0 }));
  const ocgs = [...ocgByName.values()].map(x => x + ' 0 R').join(' ');
  push('%PDF-1.6\n%\xE2\xE3\xCF\xD3\n');
  obj(1, `<< /Type /Catalog /Pages 2 0 R /OCProperties << /OCGs [${ocgs}] /D << /Name (Layers) /Order [${ocgs}] /ON [${ocgs}] >> >> >>`);
  obj(2, `<< /Type /Pages /Kids [${pageIds.map(p => p.page + ' 0 R').join(' ')}] /Count ${pages.length} >>`);
  obj(3, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  obj(4, '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  obj(5, '<< /Type /Font /Subtype /Type0 /BaseFont /STSong-Light /Encoding /UniGB-UCS2-H /DescendantFonts [6 0 R] >>');
  obj(6, '<< /Type /Font /Subtype /CIDFontType0 /BaseFont /STSong-Light /CIDSystemInfo << /Registry (Adobe) /Ordering (GB1) /Supplement 2 >> /FontDescriptor 7 0 R /DW 1000 >>');
  obj(7, '<< /Type /FontDescriptor /FontName /STSong-Light /Flags 6 /FontBBox [-25 -254 1000 880] /ItalicAngle 0 /Ascent 880 /Descent -120 /CapHeight 880 /StemV 93 >>');
  obj(8, `<< /Title ${latin(meta.title || 'DiagramLab diagrams')} /Creator (DiagramLab Flow prototype) /Producer (DiagramLab hand-written PDF writer) >>`);
  ocgByName.forEach((id, name) => obj(id, `<< /Type /OCG /Name ${latin(name)} >>`));
  const gsDict = [...gs.values()].map(g => `/${g.name} << /Type /ExtGState /ca ${n(g.ca)} /CA ${n(g.CA)} >>`).join(' ');
  pages.forEach((pg, pi) => {
    const ids = pageIds[pi];
    let stream = `${n(MM)} 0 0 ${n(-MM)} 0 ${n(PH)} cm 1 1 1 rg 0 0 420 297 re f `;
    const props = [];
    pg.layers.forEach((L, i) => { const oc = ocgByName.get(L.name); props.push(`/L${oc} ${oc} 0 R`); stream += `/OC /L${oc} BDC q ${L.clip ? pg.clip : ''}${L.ops.join('\n')} Q EMC\n`; });
    const sb = latin1(stream);
    obj(ids.page, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${n(PW)} ${n(PH)}] /TrimBox [0 0 ${n(PW)} ${n(PH)}] /Contents ${ids.content} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R${usedCJK.v ? ' /F3 5 0 R' : ''} >> /ExtGState << ${gsDict} >> /Properties << ${[...new Set(props)].join(' ')} >>${ids.img ? ` /XObject << /Im0 ${ids.img} 0 R >>` : ''} >> >>`);
    obj(ids.content, [`<< /Length ${sb.length} >>\nstream\n`, sb, '\nendstream']);
    if (ids.img) obj(ids.img, [`<< /Type /XObject /Subtype /Image /Width ${pg.raster.W} /Height ${pg.raster.H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${pg.raster.bytes.length} >>\nstream\n`, pg.raster.bytes, '\nendstream']);
  });
  const xref = len;
  let x = `xref\n0 ${next}\n0000000000 65535 f \n`;
  for (let i = 1; i < next; i++) x += String(offs[i]).padStart(10, '0') + ' 00000 n \n';
  push(x + `trailer\n<< /Size ${next} /Root 1 0 R /Info 8 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
  const out = new Uint8Array(len); let p = 0; parts.forEach(b => { out.set(b, p); p += b.length; });
  return { bytes: out, reports: pages.map(pg => pg.report), size: len };
}

/* SVG export: the same sheet, with each layer as a named top-level group (Illustrator and Inkscape read these as layers). */
function sheetToSvg(svgString) {
  const doc = new DOMParser().parseFromString(svgString, 'image/svg+xml');
  const root = doc.documentElement;
  root.setAttribute('xmlns:inkscape', 'http://www.inkscape.org/namespaces/inkscape');
  root.setAttribute('width', '420mm'); root.setAttribute('height', '297mm');
  root.querySelectorAll('.vw-handles').forEach(x => x.remove());
  root.querySelectorAll('[data-layer]').forEach(g => {
    const name = g.getAttribute('data-name') || g.getAttribute('data-k');
    g.setAttribute('id', name.replace(/[^\w-]+/g, '_')); g.setAttribute('inkscape:groupmode', 'layer'); g.setAttribute('inkscape:label', name);
  });
  const style = doc.createElementNS('http://www.w3.org/2000/svg', 'style');
  style.textContent = '.dg{font-family:Helvetica,Arial,"PingFang SC","Noto Sans CJK SC",sans-serif}.dg-zh{font-family:"PingFang SC","Noto Sans CJK SC","Microsoft YaHei",sans-serif}';
  root.insertBefore(style, root.firstChild);
  return '<?xml version="1.0" encoding="UTF-8"?>\n' + new XMLSerializer().serializeToString(root);
}
