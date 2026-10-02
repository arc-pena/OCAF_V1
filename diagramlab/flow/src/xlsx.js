/* Minimal .xlsx reader: zip central directory → inflate (DecompressionStream) → sharedStrings + sheets.
   Enough to re-import the RMUH tracker after it changes; it reads the same two tabs the build step embedded. */
async function readZip(buf) {
  const dv = new DataView(buf), u8 = new Uint8Array(buf); let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 66000); i--) if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('Not a zip file');
  const n = dv.getUint16(eocd + 10, true); let p = dv.getUint32(eocd + 16, true); const files = {};
  for (let k = 0; k < n; k++) {
    const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), el = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
    const name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nl));
    const lnl = dv.getUint16(off + 26, true), lel = dv.getUint16(off + 28, true), data = u8.subarray(off + 30 + lnl + lel, off + 30 + lnl + lel + csize);
    files[name] = { method, data }; p += 46 + nl + el + cl;
  }
  return async name => {
    const f = files[name]; if (!f) return null;
    if (f.method === 0) return new TextDecoder().decode(f.data);
    const ds = new Blob([f.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return await new Response(ds).text();
  };
}
async function readXlsx(buf) {
  const get = await readZip(buf);
  const P = s => new DOMParser().parseFromString(s, 'application/xml');
  const ss = []; const sst = await get('xl/sharedStrings.xml');
  if (sst) P(sst).querySelectorAll('si').forEach(si => ss.push([...si.querySelectorAll('t')].map(t => t.textContent).join('')));
  const wb = P(await get('xl/workbook.xml')), rels = P(await get('xl/_rels/workbook.xml.rels'));
  const sheets = {};
  for (const s of wb.querySelectorAll('sheet')) {
    const rid = s.getAttribute('r:id') || s.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships', 'id');
    const rel = [...rels.querySelectorAll('Relationship')].find(r => r.getAttribute('Id') === rid);
    const xml = await get('xl/' + rel.getAttribute('Target').replace(/^\/?xl\//, ''));
    sheets[s.getAttribute('name')] = [...P(xml).querySelectorAll('row')].map(r => { const o = {}; r.querySelectorAll('c').forEach(c => { const ref = c.getAttribute('r').replace(/\d+/g, ''), v = c.querySelector('v'), is = c.querySelector('is'); o[ref] = c.getAttribute('t') === 's' && v ? ss[+v.textContent] : v ? v.textContent : is ? is.textContent : ''; }); return o; });
  }
  return sheets;
}
/* Map the tracker's two tabs into the app's shape. Column letters follow D1_RMUH_Diagrams.xlsx. */
function xlFromSheets(sheets) {
  const D = sheets.Diagrams || Object.values(sheets)[0], C = sheets.Criteria || Object.values(sheets)[1] || [];
  const head = D.find(r => r.A === 'ID') || {};
  const opts = ['G', 'H', 'I', 'J'].map(c => head[c]).filter(Boolean);
  const diagrams = D.filter(r => /^D\d\d/.test(r.A || '')).map(r => ({ id: r.A, name: r.B || '', show: r.C || '', succeeds: r.D || '', notes: r.L || '', status: Object.fromEntries(opts.map((o, i) => [o, r['GHIJ'[i]] || 'Not started'])) }));
  const criteria = C.filter(r => /^C\d\.\d\d/.test(r.A || '')).map(r => ({ id: r.A, domain: r.B || '', name: r.C || '', question: r.D || '', proof: (r.E || '').split(',').map(x => x.trim()).filter(Boolean), look: r.F || '' }));
  return { options: opts.length ? opts : XL_DEFAULT.options, diagrams, criteria };
}
