/* DiagramLab prototype — Style Profile, the UX system reference page, keyboard map and boot. */

const RULES = [
  { t: 'Circulation is one colour per route type and never sits on top of labels.', src: 'From 6 of 7 references', sev: 'warn', on: true, fix: true },
  { t: 'At most two accent colours per diagram.', src: 'From 7 of 7 references', sev: 'warn', on: true, fix: false },
  { t: 'Labels in sentence case, 6 pt minimum at print size.', src: 'Written by FR', sev: 'block', on: true, fix: true },
  { t: 'Line weights come from the stroke scale only: 0.25 / 0.5 / 1 / 2 / 4 pt.', src: 'Extracted from vector PDFs', sev: 'warn', on: true, fix: true },
  { t: 'Every label carries zh and en. Machine translations stay unreviewed until accepted.', src: 'Written by FR', sev: 'warn', on: true, fix: false },
  { t: 'The legend lists only layers present, grouped by plot code.', src: 'From 5 of 7 references', sev: 'info', on: true, fix: true },
  { t: 'Raster layers are at least 300 ppi at placed size.', src: 'Print standard', sev: 'block', on: true, fix: false },
  { t: 'In axo views, routes pass under massing.', src: 'From reference 2', sev: 'info', on: false, fix: true },
];
const AGENT_MODES = ['Off', 'Report only', 'Suggest', 'Auto-fix with review', 'Fully automatic'];
const PF = { mode: 'Suggest', ledger: [{ id: 'l1', t: 'You moved the legend from bottom-left to bottom-right in 5 of 6 diagrams.', rule: 'Legend sits bottom-right inside the margin.' }, { id: 'l2', t: 'You rejected 3 agent proposals that thickened the internal loops.', rule: 'Internal circulation stays at 1.2 pt.' }] };

function renderProfile() {
  const v = $('#v-profile');
  const pal = [['circulation/external', TOK.ext, 'Red external route'], ['circulation/internal', TOK.int, 'Dashed blue'], ['views/main', TOK.view, 'Cyan view'], ['landscape/green', TOK.green, 'Green corridor'], ['analysis/axis', TOK.axis, 'Orange ribbon'], ['analysis/highlight', TOK.hi, 'Yellow circle'], ['emphasis/highlight', TOK.magenta, 'Building highlight'], ['ink', TOK.ink, 'Outlines, type'], ...Object.entries(PROG).map(([k, p]) => ['program/' + k, p.c, p.code + ' ' + p.en]), ['ground/water', TOK.water, 'Water tint'], ['ground/park', TOK.park, 'Landscape tint']];
  v.innerHTML = `<div class="pf"><div class="pf-head"><div><span class="eyebrow">Style Profile · trained from 7 reference sheets</span><h1>Office standard <span class="faint">v3</span></h1><p>Tokens and rules the Graphic Standards Agent checks every diagram against. Nothing here changes without your approval, and every version is kept.</p></div>
      <span style="flex:1"></span><div style="display:grid;gap:6px"><span class="eyebrow">Agent mode</span><div class="seg sm" id="pfMode">${AGENT_MODES.map(m => `<button aria-pressed="${m === PF.mode}">${m}</button>`).join('')}</div></div></div>
    <div class="pf-grid">
      <div class="card"><div class="card-h"><h3>Tokens</h3><span class="chip">Extracted</span></div><div class="card-b">
        <span class="eyebrow">Palette · named swatches with roles</span><div class="swatches">${pal.map(p => `<div class="swatch"><span class="c" style="background:${p[1]}"></span><b>${p[2]}</b><span class="r">${p[0]}</span></div>`).join('')}</div>
        <span class="eyebrow">Stroke scale</span><div class="strokes">${[.25, .5, 1, 2, 4].map(w => `<div class="s"><span>${w} pt</span><i style="height:${Math.max(1, w * 96 / 72)}px"></i></div>`).join('')}</div>
        <span class="eyebrow">Type · CJK and Latin paired on one baseline</span>
        <div style="display:grid;gap:4px;padding:10px;border:1px solid var(--line);border-radius:8px"><span style="font-size:20px;font-weight:600"><span class="zh">流线分析</span> Circulation</span><span class="mono faint" style="font-size:11px">Title 10 pt · label 6 pt · legend 5.5 pt · stacked zh over en</span><span class="faint" style="font-size:11.5px">Latin and CJK faces are stand-ins until the office typefaces are confirmed (open question 6).</span></div>
        <span class="eyebrow">Arrows and primitives</span>
        <svg viewBox="0 0 300 70" style="width:100%;height:auto;background:#fff;border-radius:8px;border:1px solid var(--line)">${taper([[14, 50], [60, 30], [100, 24]], 12, 4, TOK.green, .85, 1.6)}<path d="M130 50 C150 20 170 20 190 40" fill="none" stroke="${TOK.ext}" stroke-width="3"/>${head([196, 46], [.7, .7], 8, 8, { fill: TOK.ext })}<rect x="214" y="20" width="36" height="28" rx="6" fill="none" stroke="${TOK.int}" stroke-width="1.6" stroke-dasharray="4 3"/><circle cx="276" cy="34" r="8" fill="${TOK.int}"/><text x="276" y="38" font-size="10" fill="#fff" text-anchor="middle" font-weight="700" class="dg">3</text></svg>
      </div></div>
      <div class="card"><div class="card-h"><h3>Rulebook</h3><span class="faint" style="font-size:12px">${RULES.filter(r => r.on).length} of ${RULES.length} on</span><button class="btn sm" id="pfAdd">${ic('plus')}Rule</button></div><div class="card-b" style="gap:0" id="pfRules">${RULES.map((r, i) => `<div class="rule"><button class="toggle" role="switch" aria-checked="${r.on}" data-on="${i}" aria-label="Enable rule"></button><div><div class="t">${esc(r.t)}</div><div class="src">${esc(r.src)}</div></div>
        <div class="ctl"><div class="seg sm" data-sev="${i}">${['info', 'warn', 'block'].map(s => `<button aria-pressed="${r.sev === s}">${s}</button>`).join('')}</div><label style="display:flex;gap:6px;align-items:center;font-size:12px"><button class="toggle" role="switch" aria-checked="${r.fix}" data-fix="${i}" aria-label="Auto-fix allowed"></button>Auto-fix</label></div></div>`).join('')}</div></div>
      <div style="display:grid;gap:16px">
        <div class="card"><div class="card-h"><h3>Corrections ledger</h3><span class="chip accent">${PF.ledger.length} proposals</span></div><div class="card-b"><div class="ledger">${PF.ledger.map(l => `<div class="it prop"><span>${esc(l.t)}</span><span><b>Proposed rule:</b> ${esc(l.rule)}</span><div style="display:flex;gap:6px"><button class="btn primary sm" data-ok="${l.id}">Approve</button><button class="btn sm" data-no="${l.id}">Dismiss</button></div></div>`).join('') || '<span class="faint">No pending proposals.</span>'}
          <div class="it"><span class="faint">28 Sep · Rejected “raise label size to 7 pt” on Ground plan × B.</span></div></div></div></div>
        <div class="card"><div class="card-h"><h3>Agent limits</h3></div><div class="card-b">
          <div class="field"><label>Scope</label><span style="font-size:12px">Generated layers only. Locked and manual layers are never touched.</span></div>
          <div class="field"><label>Edit types</label><div style="display:flex;gap:4px;flex-wrap:wrap"><span class="chip accent">Restyle</span><span class="chip accent">Move / resize</span><span class="chip">Add / remove</span><span class="chip">Re-generate raster</span></div></div>
          <div class="field"><label>Budget</label><span class="mono" style="font-size:12px">3 passes · $0.40 per diagram</span></div>
          <div class="field"><label>Cross-matrix</label><span style="display:flex;gap:8px;align-items:center;font-size:12px"><button class="toggle" role="switch" aria-checked="true" id="pfX"></button>Harmonise each row across options</span></div></div></div>
        <div class="card"><div class="card-h"><h3>References</h3><span class="faint" style="font-size:12px">Stand-ins for the office sheets</span></div><div class="card-b"><div class="refs">${[['views', 'Views and green areas'], ['circ', 'Circulation'], ['ground', 'Ground plan'], ['keyed', 'Key spatial analysis'], ['program', 'Program analysis'], ['roof', 'Roof plan']].map((r, i) => `<figure><div class="p">${thumb(T(r[0]), O(i === 1 ? 'B' : 'A'))}</div><figcaption><span class="mono faint">R${i + 1}</span> ${r[1]}</figcaption></figure>`).join('')}</div></div></div>
      </div></div></div>`;
  $$('#pfMode button').forEach(b => b.onclick = () => { PF.mode = b.textContent; $$('#pfMode button').forEach(x => x.setAttribute('aria-pressed', String(x === b))); toast(`Agent mode: <b>${PF.mode}</b>. Applies to every template unless a template overrides it.`); });
  $$('[data-on]', v).forEach(b => b.onclick = () => { const r = RULES[+b.dataset.on]; r.on = !r.on; b.setAttribute('aria-checked', String(r.on)); });
  $$('[data-fix]', v).forEach(b => b.onclick = () => { const r = RULES[+b.dataset.fix]; r.fix = !r.fix; b.setAttribute('aria-checked', String(r.fix)); });
  $$('[data-sev]', v).forEach(g => $$('button', g).forEach(b => b.onclick = () => { RULES[+g.dataset.sev].sev = b.textContent; $$('button', g).forEach(x => x.setAttribute('aria-pressed', String(x === b))); }));
  $$('[data-ok]', v).forEach(b => b.onclick = () => { const l = PF.ledger.find(x => x.id === b.dataset.ok); PF.ledger = PF.ledger.filter(x => x !== l); RULES.push({ t: l.rule, src: 'Learned from your corrections', sev: 'info', on: true, fix: true }); renderProfile(); toast('Rule added. Profile saved as v4 draft; v3 stays available.'); });
  $$('[data-no]', v).forEach(b => b.onclick = () => { PF.ledger = PF.ledger.filter(x => x.id !== b.dataset.no); renderProfile(); });
  $('#pfX').onclick = e => { const t = e.currentTarget; t.setAttribute('aria-checked', String(t.getAttribute('aria-checked') !== 'true')); };
  $('#pfAdd').onclick = () => { $('#promptIn').focus(); $('#promptIn').value = 'Never place two arrows of the same colour closer than 4 mm'; };
}

/* ---------- UX system reference page ---------- */
function tokHex(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }
function renderSystem() {
  const v = $('#v-system');
  const tok = (n, l) => `<div class="tok"><div class="c" style="background:var(${n})"></div><div class="m"><b>${l}</b><code>${n} · ${tokHex(n)}</code></div></div>`;
  const neutrals = [['--bg', 'App ground'], ['--canvas', 'Canvas'], ['--surface', 'Panel'], ['--surface-2', 'Panel inset'], ['--surface-3', 'Control fill'], ['--line', 'Hairline'], ['--line-2', 'Control border'], ['--fg', 'Text'], ['--fg-2', 'Secondary text'], ['--fg-3', 'Tertiary text']];
  const sem = [['--accent', 'Accent · selection, AI, primary'], ['--ok', 'Approved, cached'], ['--warn', 'Needs review, override'], ['--err', 'Failed, blocked'], ['--stale', 'Stale']];
  const opts = [['--opt-a', 'Option A'], ['--opt-b', 'Option B'], ['--opt-c', 'Option C'], ['--opt-d', 'Option D']];
  const ports = Object.keys(PORT).map(p => [`--port-${p.toLowerCase()}`, p + ' port']);
  v.innerHTML = `<div class="sys"><div class="sys-in">
    <header><span class="eyebrow">DiagramLab · UX system · first pass · 2 Oct 2026</span><h1>A calm studio where the diagrams are the only colour on screen</h1>
      <p class="lede">This page is the reference for the prototype around it: principles, tokens, components and the interaction patterns the brief asks for in §13. Every screen in this file is built from these pieces, so changing a token here changes the product.</p></header>

    <section><h2>Principles</h2><p class="sub">Five rules decide arguments about the interface.</p><div class="prin">
      ${[['The work is the hero', 'Chrome is neutral grey with one accent. Saturated colour on screen belongs to the diagrams and the four option tags.'], ['One document, four views', 'Board, Matrix, Editor and Present are views of the same model. A route edited in the Editor is already updated in its Matrix cell.'], ['Every AI result is a layer', 'Generated content arrives as named, editable layers behind a diff preview. Nothing is committed without an undo step.'], ['Scope is visible before anything runs', 'The prompt bar always shows what it acts on (layer, diagram, template, matrix) and runs show cost and time first.'], ['Real units everywhere', 'Sheets are drawn in millimetres, strokes and type in points. Fields accept 12mm, 2pt or span/3, and 100% zoom is true print size.']].map(p => `<div class="card"><b>${p[0]}</b><p>${p[1]}</p></div>`).join('')}</div></section>

    <section><h2>Shell anatomy</h2><p class="sub">Floating panels over a full-bleed canvas. Panels are measured from fixed insets and collapse to icons or slide-overs as the window narrows; they never overlap each other.</p>
      <div class="anat">${anatomySvg()}</div></section>

    <section><h2>Colour</h2><p class="sub">Neutrals carry a slight blue bias toward the accent. Status colours are semantic and never used as decoration. Option tags are the only categorical colours in the chrome. Diagram colours are not here: they live in the Style Profile.</p>
      <span class="eyebrow">Neutrals</span><div class="tokgrid">${neutrals.map(n => tok(...n)).join('')}</div>
      <span class="eyebrow" style="margin-top:16px">Accent and status</span><div class="tokgrid">${sem.map(n => tok(...n)).join('')}</div>
      <span class="eyebrow" style="margin-top:16px">Design options</span><div class="tokgrid">${opts.map(n => tok(...n)).join('')}</div>
      <span class="eyebrow" style="margin-top:16px">Node port types</span><div class="tokgrid">${ports.map(n => tok(...n)).join('')}</div></section>

    <section><h2>Type</h2><p class="sub">Geist for UI at 12–13 px, Geist Mono for values, keys and file names. CJK falls back to the system's Simplified Chinese face. Diagram type is set in points by the Style Profile, not by this scale.</p>
      <div class="typescale">${[['Display', 'font-size:34px;font-weight:600;letter-spacing:-0.03em', '34 / 600 / -3%', 'This page only'], ['Title', 'font-size:22px;font-weight:600;letter-spacing:-0.02em', '22 / 600', 'Profile, empty states'], ['Heading', 'font-size:15px;font-weight:600', '15 / 600', 'View titles'], ['Body', 'font-size:13px', '13 / 400', 'Default UI text'], ['Small', 'font-size:12px', '12 / 400–500', 'Fields, inspector'], ['Eyebrow', 'font-size:10.5px;font-weight:600;letter-spacing:.07em;text-transform:uppercase', '10.5 / 600 / caps', 'Section labels'], ['Mono', 'font-family:var(--mono);font-size:11.5px', '11.5 mono', 'Values, keys, files']].map(r => `<div class="r"><code>${r[0]}</code><span style="${r[1]}">Circulation × Option A <span class="zh">流线分析</span></span><code>${r[2]} · ${r[3]}</code></div>`).join('')}</div></section>

    <section><h2>Space, radius, elevation</h2><p class="sub">8 px grid with a 4 px half-step. Panels 12 px radius, controls 7 px, chips fully round. Two shadows only: resting panels and popovers. Paper gets its own shadow so sheets read as objects.</p>
      <div class="comp"><div class="card"><div class="demo">${[4, 8, 12, 16, 24, 32, 48].map(s => `<div style="display:grid;gap:4px;justify-items:center"><span style="width:${s}px;height:${s}px;background:var(--accent-soft);border:1px solid var(--accent-line)"></span><span class="mono faint">${s}</span></div>`).join('')}</div></div>
      <div class="card"><div class="demo"><span style="width:72px;height:48px;border-radius:12px;background:var(--surface);box-shadow:var(--shadow);border:1px solid var(--line)"></span><span style="width:72px;height:48px;border-radius:12px;background:var(--surface);box-shadow:var(--shadow-pop)"></span><span style="width:68px;height:48px;background:#fff;box-shadow:var(--paper-shadow)"></span></div><p class="note">Panel · popover · paper</p></div></div></section>

    <section><h2>Components</h2><p class="sub">Live, using the same CSS as the product.</p><div class="comp">
      <div class="card"><span class="eyebrow">Buttons</span><div class="demo"><button class="btn primary">${ic('play')}Run 68 cells</button><button class="btn">${ic('export')}Export</button><button class="btn ghost">Ghost</button><button class="ib" aria-label="Icon">${ic('more')}</button></div><p class="note">One primary per surface. Icon buttons always carry a label for assistive tech.</p></div>
      <div class="card"><span class="eyebrow">Segmented control</span><div class="demo"><div class="seg">${['Board', 'Matrix', 'Editor', 'Present'].map((x, i) => `<button aria-pressed="${i === 1}">${x}</button>`).join('')}</div><div class="seg sm"><button aria-pressed="true">This option</button><button aria-pressed="false">Template · all 4</button></div></div><p class="note">Mode switches and mutually exclusive settings.</p></div>
      <div class="card"><span class="eyebrow">Status</span><div class="demo">${Object.keys(ST).map(pill).join('')}</div><p class="note">Shape and colour together, so status survives greyscale printing and colour blindness.</p></div>
      <div class="card"><span class="eyebrow">Provenance and options</span><div class="demo"><span class="prov gen">GEN</span><span class="prov edited">EDITED</span><span class="prov manual">MANUAL</span><span class="prov profile">PROFILE</span>${OPTIONS.map(o => optTag(o.id)).join('')}</div><p class="note">Every layer says who made it. Option tags appear identically in all four views.</p></div>
      <div class="card"><span class="eyebrow">Unit field · live</span><div style="display:grid;gap:8px"><div class="field"><label for="sysU1">Stroke</label>${unitField('sysU1', '0.5mm + hair', 'print')}</div><div class="field"><label for="sysU2">Bay</label>${unitField('sysU2', 'span/3', 'model')}</div></div><p class="note">Accepts units and expressions. Try 12mm, 2pt*2 or floor*3. Print values resolve to pt, model values to m.</p></div>
      <div class="card"><span class="eyebrow">Override marker</span><div class="ovr-row"><span class="what">Route / Spline · corner radius<span class="ovr"></span></span><span style="display:flex;gap:2px"><button class="ib sm" title="Push to template">${ic('push')}</button><button class="ib sm" title="Reset">${ic('undo')}</button></span><span class="vals">6 m · template 4 m</span></div><p class="note">An amber dot means “stored on this instance only”. Push promotes it to all options; reset removes it.</p></div>
      <div class="card"><span class="eyebrow">Prompt bar</span><div style="display:flex;align-items:center;gap:8px;padding:6px 6px 6px 10px;border:1px solid var(--line);border-radius:14px;box-shadow:var(--shadow)"><span class="sparkle">${ic('sparkle')}</span><span class="chip accent">Layer · circulation/public-route</span><span class="faint" style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">route it via the ramp instead</span><kbd>⌘K</kbd></div><p class="note">One bar everywhere. The scope chip is part of the sentence and can be changed before sending.</p></div>
      <div class="card"><span class="eyebrow">AI diff preview</span><div class="diffbar" style="position:static;transform:none;justify-self:start"><span class="sparkle">${ic('sparkle')}</span><span><b>1 layer added</b></span><button class="btn sm">Reject</button><button class="btn primary sm">Accept</button></div><p class="note">Non-blocking: work continues while it waits. Accept commits one undo step.</p></div>
      <div class="card"><span class="eyebrow">Node card</span><div style="position:relative;height:208px">${nodeCard(Object.assign({}, NODES.find(n => n.id === 'n5'), { x: 8, y: 0 }))}</div><p class="note">Generated from the node declaration, like the inspector and the override popover.</p></div>
    </div></section>

    <section><h2>Patterns</h2><p class="sub">The behaviours that make bulk work safe.</p><div class="comp">
      <div class="card"><b>Estimate before run</b><p class="note">Every run (cell, row, column, selection, all) opens a summary first: cells to recompute, cells served from cache, cost, time and remaining budget. Blocked cells are listed and skipped.</p></div>
      <div class="card"><b>Degrade and report</b><p class="note">A failed layer marks the cell “1 layer failed” and keeps the other layers. The reason is in the inspector, with a retry for that layer only.</p></div>
      <div class="card"><b>Staleness is explicit</b><p class="note">Replacing a source PDF greys the dependent cells with the reason. Nothing re-runs until you say so.</p></div>
      <div class="card"><b>Edits survive re-runs</b><p class="note">A dragged anchor is stored against the layer's stable key and re-applied after regeneration. If it can no longer apply it is flagged, never dropped.</p></div>
    </div>
    <span class="eyebrow" style="margin-top:16px">Empty state · a new matrix teaches its own set-up</span>
    <div class="empty-demo"><b style="font-size:15px">Set up the options once, then every template runs on all of them</b><div class="steps">${[['Drop options', 'A folder or multi-page PDF per option. Pages are matched to slots like “Level 0 plan”.', true], ['Register', 'Scale, origin, north and page frame per option, checked against the others in one overlay.', false], ['Place anchors', 'plaza-entrance, ramp, roof-garden… Missing anchors show as blockers per cell.', false]].map((s, i) => `<div class="s ${s[2] ? 'done' : ''}"><span class="n">${s[2] ? '✓' : i + 1}</span><b>${s[0]}</b><span class="muted">${s[1]}</span></div>`).join('')}</div></div></section>

    <section><h2>Keyboard</h2><p class="sub">Illustrator shortcuts where they exist, Lightroom keys in Present.</p><div class="keys">
      ${[['Board / Matrix / Editor / Present', ['⌘1', '⌘2', '⌘3', '⌘4']], ['Prompt bar', ['⌘K']], ['Selection / direct selection', ['V', 'A']], ['Pen / type', ['P', 'T']], ['Group / ungroup', ['⌘G', '⌘⇧G']], ['Send backward / forward', ['⌘[', '⌘]']], ['Undo', ['⌘Z']], ['Grid / loupe / slideshow / sheets', ['G', 'E', 'S', 'B']], ['Next / previous diagram', ['←', '→']], ['Other options, same diagram', ['↑', '↓']], ['Rate / colour label', ['1–5', '6–9']], ['100% print size', ['Z']], ['Exit, close, deselect', ['Esc']]].map(k => `<div class="k"><span>${k[0]}</span><span>${k[1].map(x => `<kbd>${x}</kbd>`).join('')}</span></div>`).join('')}</div>
      <p class="note faint" style="margin-top:8px">In a browser tab ⌘1–⌘4 may be taken by the browser, so plain 1–4 also switch modes outside text fields and Present.</p></section>

    <section><h2>Screens in this prototype</h2><p class="sub">The six mock-ups §13 asks to approve before building the UI.</p><div class="screens">
      ${[['board', 'Board', 'Inputs, the circulation recipe as wires, live frames, reference set'], ['matrix', 'Matrix', '17 × 4 live cells, filters, batch run with estimate, cell inspector'], ['editor', 'Editor', 'Layers from stable keys, Bézier handles, inspector, AI diff'], ['profile', 'Style Profile', 'Tokens, rulebook, agent mode, corrections ledger'], ['present-grid', 'Present · Grid', 'Survey, ratings, colour labels, group by'], ['present-loupe', 'Present · Loupe', 'One at a time, 100% print size, filmstrip']].map(s => `<button data-go="${s[0]}"><b>${s[1]}</b><small>${s[2]}</small></button>`).join('')}</div></section>

    <section><h2>Open questions that change the UX</h2><p class="sub">From brief §17. Each has a default in this prototype until answered.</p><div class="qs">
      ${[['Single user or shared from day one?', 'Comments and avatars are shown; editing is single-user.'], ['Which typefaces does the office use?', 'Geist + system CJK as stand-ins; the profile shows the slot.'], ['Sheet size and count?', 'A1 sheets with six diagrams; ARCH D and A0 are presets.'], ['AI budget per matrix run?', '$180 project cap, shown in every run estimate.'], ['Source of option drawings?', 'PDF and PNG with camera sidecars; a direct modeller adapter would fill registration and anchors.'], ['Pilot templates for M3–M4?', 'Circulation, Program, Massing evolution, Exploded axo are the most developed rows.']].map((q, i) => `<div class="q"><span>${String(i + 1).padStart(2, '0')}</span><span><b>${q[0]}</b><br><span class="muted">${q[1]}</span></span></div>`).join('')}</div></section>
  </div></div>`;
  wireUnit('sysU1', 'print', () => {}); wireUnit('sysU2', 'model', () => {});
  $$('[data-go]', v).forEach(b => b.onclick = () => { const g = b.dataset.go; if (g.startsWith('present')) { S.pr.sub = g === 'present-grid' ? 'grid' : 'loupe'; S.pr.compare = S.pr.only = null; setMode('present'); } else setMode(g); });
}
function anatomySvg() {
  const box = (x, y, w, h, l, s, fill = 'var(--surface)') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fill}" stroke="var(--line-2)"/><text x="${x + 10}" y="${y + 20}" font-size="12" font-weight="600" fill="var(--fg)" font-family="Geist, sans-serif">${l}</text><text x="${x + 10}" y="${y + 36}" font-size="11" fill="var(--fg-3)" font-family="Geist Mono, monospace">${s}</text>`;
  return `<svg viewBox="0 0 960 440" role="img" aria-label="Shell layout diagram"><rect x="0" y="0" width="960" height="440" rx="10" fill="var(--canvas)"/>
    <rect x="0" y="0" width="960" height="40" fill="var(--surface)" stroke="var(--line)"/><text x="14" y="25" font-size="12" font-weight="600" fill="var(--fg)" font-family="Geist, sans-serif">Top bar · 48 px · project, mode switch, run chip</text>
    <rect x="390" y="8" width="180" height="24" rx="7" fill="var(--surface-3)"/><text x="480" y="24" text-anchor="middle" font-size="11" fill="var(--fg-2)" font-family="Geist, sans-serif">Board · Matrix · Editor · Present</text>
    ${box(12, 52, 200, 300, 'Left panel', 'w 264 · layers / outline')}${box(222, 52, 36, 170, '', '')}
    <text x="228" y="240" font-size="10" fill="var(--fg-3)" font-family="Geist Mono, monospace">tools</text>
    ${box(684, 52, 264, 300, 'Inspector', 'w 296 · from declarations')}
    <rect x="300" y="90" width="340" height="240" fill="#fff" stroke="var(--line-2)"/><text x="470" y="215" text-anchor="middle" font-size="12" fill="#888" font-family="Geist, sans-serif">Work: sheet, board or grid</text>
    ${box(330, 52, 280, 28, '', '')}<text x="470" y="71" text-anchor="middle" font-size="11" fill="var(--fg-2)" font-family="Geist, sans-serif">Context crumb · instance · scope</text>
    <rect x="250" y="372" width="460" height="44" rx="12" fill="var(--surface)" stroke="var(--line-2)"/><text x="264" y="399" font-size="12" fill="var(--fg)" font-family="Geist, sans-serif">Prompt bar ⌘K · scope chip · always bottom-centre · 16 px from edge</text>
    <text x="12" y="372" font-size="11" fill="var(--fg-3)" font-family="Geist Mono, monospace">insets 12 px · gap 8 px</text>
    <text x="12" y="390" font-size="11" fill="var(--fg-3)" font-family="Geist Mono, monospace">&lt;1180 inspector 260 · &lt;980 labels collapse</text>
    <text x="12" y="408" font-size="11" fill="var(--fg-3)" font-family="Geist Mono, monospace">&lt;760 panels become slide-overs</text></svg>`;
}

/* ---------- keyboard and boot ---------- */
document.addEventListener('keydown', e => {
  const inField = e.target.closest && e.target.closest('input, textarea, select, [contenteditable]');
  const mod = e.metaKey || e.ctrlKey;
  if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); if (!$('#prompt').hidden) $('#promptIn').focus(); return; }
  if (mod && e.key.toLowerCase() === 'z' && !inField) { e.preventDefault(); undo(); return; }
  if ((mod || e.altKey) && /^[1-4]$/.test(e.key)) { e.preventDefault(); setMode(['board', 'matrix', 'editor', 'present'][+e.key - 1]); return; }
  if (inField) { if (e.key === 'Escape') e.target.blur(); return; }
  if (S.mode === 'present') { if (presentKey(e)) e.preventDefault(); return; }
  if (/^[1-4]$/.test(e.key) && !mod) { setMode(['board', 'matrix', 'editor', 'present'][+e.key - 1]); return; }
  if (e.key === '/') { e.preventDefault(); $('#promptIn').focus(); return; }
  if (e.key === 'Escape') { closePop(); if (S.mode === 'editor') { S.ed.layer = null; renderTree(); renderEdInsp(); drawOverlay(); updateScope(); } if (S.mode === 'matrix') { S.sel.clear(); S.selRow = null; refreshSel(); } return; }
  if (S.mode === 'editor') { const m = { v: 'select', a: 'direct', p: 'pen', n: 'pencil', m: 'rect', l: 'ellipse', t: 'text', h: 'hand' }[e.key.toLowerCase()]; if (m && !mod) setTool(m); }
});
$('#v-present').addEventListener('pointermove', idleChrome);
addEventListener('resize', () => { if (S.mode === 'editor') fitSheet(); if (S.mode === 'board') drawMini(); });

(function boot() {
  hydrateIcons();
  try { S.theme = localStorage.getItem('dl-theme') || 'system'; } catch (e) {}
  applyTheme();
  $('#themeBtn').onclick = () => { S.theme = { system: 'light', light: 'dark', dark: 'system' }[S.theme]; applyTheme(); toast(`Theme: ${S.theme}`); };
  $$('#modes button').forEach(b => b.onclick = () => setMode(b.dataset.mode));
  $('#profileBtn').onclick = () => setMode('profile');
  $('#sysBtn').onclick = () => setMode('system');
  $('#brandBtn').onclick = e => openPop(e.currentTarget, `<div class="menu"><button data-g="system">${ic('swatch')}UX system reference</button><button data-g="profile">${ic('shield')}Style Profile</button><button data-g="board">${ic('board')}Board</button></div>`, el => $$('button', el).forEach(b => b.onclick = () => { closePop(); setMode(b.dataset.g); }));
  $('#projBtn').onclick = e => openPop(e.currentTarget, `<div style="display:grid;gap:8px;width:280px"><b>Riverside Cultural Quarter</b><span class="muted" style="font-size:12px">Sample project made for this prototype: 4 design options, 17 diagram templates, A1 boards. Not real competition data.</span><dl class="kv"><dt>Units</dt><dd>mm · print in pt</dd><dt>Budget</dt><dd>$41.20 of $180 used</dd><dt>Profile</dt><dd>Office standard v3</dd></dl></div>`);
  $('#scopeChip').onclick = scopeMenu;
  $('#prompt').addEventListener('submit', e => { e.preventDefault(); const t = $('#promptIn').value.trim(); if (!t) return; $('#promptIn').value = ''; $('#promptIn').blur(); onPrompt(t); });
  const start = (location.hash || '').replace('#', '');
  setMode(VIEWS.includes(start) ? start : 'matrix');
})();
