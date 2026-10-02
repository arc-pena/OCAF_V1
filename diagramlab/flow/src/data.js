/* DiagramLab Flow — RMUH project data.
   Sources, all the user's own:
   - D1_RMUH_Diagrams.xlsx (xl-data.js): the 17 diagrams and the 49 Handbook §5 criteria with their proving diagrams.
   - "RMUH Option Plan Audit" artifact (30 Sep 2026): option images, measured GLA, anchor spacing, PUA arrival.
   - "RMUH Meeting 3 Feedback Review & Workshop 1 Plan" doc (30 Sep 2026): the client's steer and brief figures.
   Anchor positions are fractions of each image (u across, v down), read off the audit's annotated plans. Ones marked
   est were not marked on the plan and are a guess to confirm. Scale per plan is calibrated from the audit's measured
   anchor spacing (hypermarket ↔ department store), the same pair the audit measured. */

const PROJECT = {
  name: 'RMUH', full: 'Qiddiya D1 · Retail Mixed-Use Hub', stage: 'Phase B · Workshop 1, 12 Oct 2026',
  sources: [
    { id: 'xl', name: 'D1_RMUH_Diagrams.xlsx', what: '17 diagrams · 49 criteria (Handbook §5)' },
    { id: 'audit', name: 'RMUH Option Plan Audit', what: 'Measured plans of the 4 options, 30 Sep', url: 'https://claude.ai/artifact/X5vgwFm96CfEAa9vJSg5Gm' },
    { id: 'm3', name: 'Meeting 3 Feedback Review', what: 'Client steer and brief figures, 30 Sep', url: 'https://claude.ai/artifact/NbQqXZUTAVp6cRgpfeFQDM' },
  ],
  facts: [
    ['GLA target', '200,000 m² (headline; itemised schedule to reconcile)'],
    ['Trading levels', 'Client steer: 1–2 levels with a little of a 3rd (GF + L1 + ½L2)'],
    ['Site', '336,500 m²'],
    ['Mix', 'E&L ≈23,000 · F&B 37,900 · ULO 25,000 · line stores 53,570 · mini-majors 29,000 m²'],
    ['Active frontage', '≥ 70 % on primary frontages (Functional Brief)'],
    ['Parking', '9,000 bays at opening (retail 8,000 · office 600 · hotel 400), 5,000 future; ≤ 100 m walk to retail'],
    ['PUA', '10,000 passengers per hour at peak; head north or south still open'],
    ['Hotels', '725 keys: 350 midscale · 250 upper upscale · 125 boutique (Design Brief; Functional Brief says 490/150/80)'],
    ['Office', '~1,200 m² NLA per floor, 9 × 9 m grid, ~25 levels, 40,000 m² GFA'],
    ['Opening hours', 'Daily ~22:00; E&L to 04:00–06:00'],
  ],
  steer: [
    'Bring retail down to 2 trading levels, with a partial third only where an anchor pulls it.',
    'Draw one retail diagram the client can repeat back: dumbbell or figure-8, anchors at the ends, crescendo in the centre.',
    'Consolidate the ULO into one place with its own front door, placed as an anchor.',
    'Conventional parking at both dumbbell ends within ~100 m walk; robotic only as a complement.',
    'Numbers on every option: GLA, levels, active vs passive frontage, keys, NLA, bays, vehicle arrivals.',
    'The Pulse side stays clean and humane; the roof is a fifth façade; no ground-floor water.',
  ],
};

const ANCHOR_DEFS = [
  { k: 'hyper', name: 'Hypermarket', kind: 'anchor' }, { k: 'dept', name: 'Department store', kind: 'anchor' },
  { k: 'crescendo', name: 'Crescendo / plaza', kind: 'node' }, { k: 'ulo', name: 'ULO', kind: 'ulo' },
  { k: 'pua', name: 'PUA station', kind: 'transit' }, { k: 'pulse', name: 'The Pulse landing', kind: 'edge' },
  { k: 'deck', name: 'Parking deck at PUA', kind: 'parking' }, { k: 'parkW', name: 'Parking west', kind: 'parking' }, { k: 'parkE', name: 'Parking east', kind: 'parking' },
  { k: 'office', name: 'Office', kind: 'tower' }, { k: 'hotelMS', name: 'Midscale hotel', kind: 'tower' }, { k: 'hotelUU', name: 'Upper upscale hotel', kind: 'tower' }, { k: 'hotelB', name: 'ULO / boutique hotel', kind: 'tower' },
  { k: 'gcs', name: 'GCS (via the Pulse)', kind: 'edge' }, { k: 'boulevard', name: 'Boulevard', kind: 'edge' }, { k: 'desert', name: 'Desert Terrace', kind: 'edge' },
];
const SITE_POLY = [[.105, .27], [.30, .265], [.43, .20], [.58, .06], [.83, .12], [.90, .40], [.88, .49], [.96, .74], [.62, .86], [.40, .89], [.09, .89]];
const EDGE_EST = { gcs: [.40, .03, 1], boulevard: [.55, .93, 0], desert: [.06, .56, 1] };

function planView(id, file, A, loop, ulos, scale) {
  return { id, name: 'GF plan', kind: 'view', src: 'img', url: 'img/annot_' + file + '.jpg', w: 1500, h: 1006, note: 'Audit-annotated ground floor. Replace with a clean CAD export when you have one.', anchors: A, loop, ulos, site: SITE_POLY, scale };
}
const RMUH_OPTIONS = [
  { id: 'flux', name: 'Flux', tag: 'Play through Choice', color: '#D2691E',
    idea: 'Diagrid of three atria in a continuous loop, oriented to GCS and the Pulse.',
    audit: { wow: 3.0, day1: 3.0, verdict: 'Right diagram, wrong blocks', gla: [61.6, 60.5, 30.6], drawn: 243.1, levels: 'GF + 3', anchorsM: 457, depth: '51–54 m', junctions: '5 · 6 dead ends', puaM: 213, ulo: 'Atrium circles, ≈5,000 m² vs 25,000', mix: 'E&L 59k · F&B 7k · ULO 5k' },
    views: [
      planView('flux-gf', 'Flux', { hyper: [.254, .644], dept: [.656, .45], crescendo: [.443, .507], ulo: [.443, .507], pua: [.744, .184], pulse: [.416, .219], deck: [.70, .317], parkW: [.33, .78], parkE: [.66, .62], office: [.618, .325], hotelMS: [.657, .402], hotelUU: [.30, .40, 1], hotelB: [.47, .47, 1] },
        [[.29, .62], [.31, .54], [.42, .50], [.47, .46], [.58, .45], [.62, .43], [.66, .46], [.61, .49], [.52, .52], [.44, .56], [.36, .61]], [[.443, .507]], { pair: ['hyper', 'dept'], m: 457 }),
      { id: 'flux-r', name: 'Render', kind: 'view', src: 'img', url: 'img/r_Flux.jpg', w: 0, h: 0, anchors: {} },
      { id: 'flux-a', name: 'Axo', kind: 'view', src: 'img', url: 'img/r_FluxAxo.jpg', w: 0, h: 0, anchors: {} },
      { id: 'flux-d', name: 'GF depth', kind: 'view', src: 'img', url: 'img/depth_Flux_GF.jpg', w: 0, h: 0, anchors: {} },
      { id: 'flux-m', name: 'RMUH_v1 canopy study', kind: 'mood', src: 'img', url: 'img/RMUH_v1_preview.png', w: 960, h: 960, anchors: {}, note: 'From this repo: out/RMUH_v1_preview.png' },
    ] },
  { id: 'nexus', name: 'Nexus', tag: 'Play through Convergence', color: '#7A4FD0',
    idea: 'Main plaza at the Pulse/PUA arrival; broken-up ground plane of courtyards.',
    audit: { wow: 3.5, day1: 3.5, verdict: 'Closest to a leasable plan', gla: [75.6, 72.1, 29.5], drawn: 217.4, levels: 'GF + 2 + upper', anchorsM: 512, depth: '19–22 m', junctions: '25 · 13 dead ends', puaM: 200, ulo: '7+ pieces, three in the centre', mix: 'E&L 35k · F&B 45k · ULO 29k' },
    views: [
      planView('nexus-gf', 'Nexus', { hyper: [.206, .643], dept: [.662, .456], crescendo: [.45, .42], ulo: [.46, .48], pua: [.744, .20], pulse: [.40, .087], deck: [.687, .353], parkW: [.27, .78], parkE: [.62, .62], office: [.54, .54], hotelMS: [.42, .666], hotelUU: [.337, .384], hotelB: [.493, .295] },
        [[.22, .62], [.25, .52], [.30, .45], [.42, .42], [.55, .41], [.64, .42], [.66, .47], [.58, .53], [.47, .57], [.35, .60]], [[.244, .437], [.293, .475], [.456, .437], [.456, .493], [.437, .522], [.593, .457], [.40, .63]], { pair: ['hyper', 'dept'], m: 512 }),
      { id: 'nexus-r', name: 'Render', kind: 'view', src: 'img', url: 'img/r_Nexus.jpg', w: 0, h: 0, anchors: {} },
      { id: 'nexus-a', name: 'Axo', kind: 'view', src: 'img', url: 'img/r_NexusAxo.jpg', w: 0, h: 0, anchors: {} },
      { id: 'nexus-d', name: 'GF depth', kind: 'view', src: 'img', url: 'img/depth_Nexus_GF.jpg', w: 0, h: 0, anchors: {} },
    ] },
  { id: 'tecton', name: 'Tecton', tag: 'Play through Discovery', color: '#2E8B57',
    idea: 'Stacked solid-and-void volumes on a compact footprint.',
    audit: { wow: 2.5, day1: 1.5, verdict: 'Fails the level steer', gla: [43.0, 56.1, 24.9], drawn: 226.0, levels: '5–6', anchorsM: 368, depth: '20–43 m', junctions: '20', puaM: 217, ulo: 'Boxes woven through atria', mix: 'E&L 48k · F&B n/a · ULO 22k' },
    views: [
      planView('tecton-gf', 'Tecton', { hyper: [.297, .657], dept: [.619, .494], crescendo: [.45, .48], ulo: [.467, .52], pua: [.744, .20], pulse: [.375, .096], deck: [.674, .307], parkW: [.33, .78], parkE: [.66, .62], office: [.674, .429], hotelMS: [.519, .261], hotelUU: [.234, .359], hotelB: [.465, .28] },
        [[.29, .34], [.40, .30], [.44, .45], [.50, .49], [.60, .38], [.56, .34], [.47, .52], [.40, .58], [.29, .58]], [[.345, .42], [.37, .475], [.467, .52], [.549, .418]], { pair: ['hyper', 'dept'], m: 368 }),
      { id: 'tecton-r', name: 'Render', kind: 'view', src: 'img', url: 'img/r_Tecton.jpg', w: 0, h: 0, anchors: {} },
      { id: 'tecton-a', name: 'Axo', kind: 'view', src: 'img', url: 'img/r_TectonAxo.jpg', w: 0, h: 0, anchors: {} },
      { id: 'tecton-d', name: 'GF depth', kind: 'view', src: 'img', url: 'img/depth_Tecton_GF.jpg', w: 0, h: 0, anchors: {} },
    ] },
  { id: 'orbit', name: 'Orbit', tag: 'Play through Constant Movement', color: '#1F6FB2',
    idea: 'Elevated orbits loop the anchors on one meandering route.',
    audit: { wow: 4.5, day1: 2.0, verdict: 'Strong idea, anchors bunched', gla: [65.8, 64.8, null], drawn: 130.6, levels: '5–6, 2 drawn', anchorsM: 154, depth: '21–31 m', junctions: '15 · 9 dead ends', puaM: 182, ulo: '5 pieces inside the loops', mix: 'E&L 23k · F&B 14k · ULO 10k (2 levels)' },
    views: [
      planView('orbit-gf', 'Orbit', { hyper: [.231, .657], dept: [.374, .643], crescendo: [.46, .45], ulo: [.46, .45], pua: [.744, .20], pulse: [.431, .263], deck: [.693, .343], parkW: [.33, .78], parkE: [.66, .62], office: [.664, .432], hotelMS: [.646, .475], hotelUU: [.232, .453], hotelB: [.40, .515] },
        [[.25, .55], [.27, .45], [.33, .42], [.40, .42], [.47, .40], [.53, .34], [.58, .36], [.60, .44], [.55, .50], [.47, .55], [.40, .60], [.30, .62]], [[.371, .463], [.445, .43], [.459, .49], [.541, .367], [.541, .441]], { pair: ['hyper', 'dept'], m: 154 }),
      { id: 'orbit-r', name: 'Render', kind: 'view', src: 'img', url: 'img/r_Orbit.jpg', w: 0, h: 0, anchors: {} },
      { id: 'orbit-a', name: 'Axo', kind: 'view', src: 'img', url: 'img/r_OrbitAxo.jpg', w: 0, h: 0, anchors: {} },
      { id: 'orbit-d', name: 'GF depth', kind: 'view', src: 'img', url: 'img/depth_Orbit_GF.jpg', w: 0, h: 0, anchors: {} },
    ] },
];
RMUH_OPTIONS.forEach(o => { const v = o.views[0]; Object.entries(EDGE_EST).forEach(([k, a]) => { if (!v.anchors[k]) v.anchors[k] = a; }); });

/* Overlay catalogue. Each type draws from named anchors on the background image, so one recipe works on every option. */
const LTYPES = {
  site: { name: 'Site boundary', color: '#C0392B', width: 1.2, dash: true },
  parti: { name: 'Parti', color: '#111111', width: 6, needs: ['hyper', 'dept', 'crescendo', 'ulo'] },
  edges: { name: 'Site edges and roles', color: '#1F5FAE', width: 2, needs: ['pua', 'pulse', 'gcs', 'boulevard', 'desert'] },
  loop: { name: 'Retail loop', color: '#E07B00', width: 5, needs: ['hyper', 'dept', 'crescendo'] },
  frontage: { name: 'Active / passive frontage', color: '#E4572E', width: 3.5, needs: ['parkW', 'parkE', 'deck'] },
  districts: { name: 'Named districts', color: '#333333', width: 6, needs: [] },
  journeys: { name: 'Journeys and nodes', color: '#1F5FAE', width: 2.4, needs: ['pua', 'pulse', 'parkW', 'parkE', 'office', 'hotelMS', 'crescendo'] },
  ulo: { name: 'ULO as one place', color: '#D6338A', width: 2, needs: ['ulo', 'pulse'] },
  arrival: { name: 'Arrival by mode', color: '#1F5FAE', width: 2.4, needs: ['pua', 'deck', 'parkW', 'parkE', 'boulevard', 'crescendo'] },
  parking: { name: 'Parking reach (100 m)', color: '#555555', width: 1.4, needs: ['parkW', 'parkE', 'deck', 'hyper', 'dept'] },
  servicing: { name: 'Servicing and BOH', color: '#8B5A2B', width: 1.6, dash: true, needs: ['hyper', 'dept'] },
  office: { name: 'Office arrival and views', color: '#1F6FB2', width: 2, needs: ['office', 'pua', 'pulse', 'desert'] },
  hotels: { name: 'Hotels', color: '#7A4FD0', width: 2, needs: ['hotelMS', 'hotelUU', 'hotelB'] },
  climate: { name: 'Shade and comfort', color: '#2A9D8F', width: 10, needs: [] },
  clock: { name: 'Activation clock', color: '#222222', width: 6, needs: ['ulo', 'hyper', 'dept', 'crescendo'] },
  phasing: { name: 'Phasing', color: '#6C757D', width: 1.6, needs: ['dept'] },
  gla: { name: 'GLA per level', color: '#1F3F66', width: 6, needs: [] },
  aspirations: { name: 'Aspirations list', color: '#111111', width: 7, needs: [] },
  text: { name: 'Text', color: '#111111', width: 8, needs: [] },
  arrow: { name: 'Arrow', color: '#E07B00', width: 6, needs: [] },
  legend: { name: 'Legend', color: '#111111', width: 5.5, needs: [] },
};

/* First-iteration recipe per diagram: which view, which background steps, which overlays, and why.
   Claude can replace any of this from the Excel row; this table is the fallback when Claude is not reachable. */
const RECIPES = {
  D01: { bg: ['wash'], layers: ['site', 'parti', 'legend'], why: 'The parti must be redrawable from memory, so the plan is washed back and only five marks go on top: spine, two anchors, crescendo, ULO.' },
  D02: { bg: ['wash'], layers: ['site', 'edges', 'legend'], why: 'Every edge gets a declared role. The reversible PUA head is shown with a two-way arrow.' },
  D03: { bg: ['wash', 'desaturate'], layers: ['loop', 'legend'], why: 'The client asked for one retail diagram they can repeat back: anchors at the ends, crescendo in the centre, a closed loop.' },
  D04: { bg: ['wash'], layers: ['gla'], why: 'Numbers first: GF + L1 + ½L2 against 200,000 m², from the audit measurements.' },
  D05: { bg: ['wash', 'desaturate'], layers: ['loop', 'frontage', 'legend'], why: 'Frontage is measured, not described: active, passive and folly along the loop with the share against 70 %.' },
  D06: { bg: ['wash'], layers: ['loop', 'districts', 'legend'], why: 'Districts are named and placed along the loop so the narrative and the plan tell the same story.' },
  D07: { bg: ['wash', 'desaturate'], layers: ['journeys', 'legend'], why: 'Journeys start at the PUA and the Pulse, not the car park. Node spacing is measured against 150 m.' },
  D08: { bg: ['wash'], layers: ['ulo', 'loop', 'legend'], why: 'The ULO as one place with a front door on the Pulse, placed where there is depth.' },
  D09: { bg: ['wash'], layers: ['arrival', 'legend'], why: 'Every mode gets a drawn route and a number. The PUA arrival must not pass a parking deck.' },
  D10: { bg: ['wash', 'desaturate'], layers: ['parking', 'legend'], why: 'Conventional parking at both dumbbell ends, with the 100 m walk drawn to scale.' },
  D11: { bg: ['wash', 'desaturate'], layers: ['servicing', 'loop', 'legend'], why: 'Service traffic on the perimeter, never crossing the customer loop.' },
  D12: { bg: ['wash'], layers: ['office', 'legend'], why: 'Car and PUA entries meet in one lobby; view cones to the Desert Terrace and the Pulse.' },
  D13: { bg: ['wash'], layers: ['hotels', 'legend'], why: 'Three addresses, three tiers, one family; keys stated against 725.' },
  D14: { bg: ['warm'], layers: ['climate', 'legend'], why: 'A shaded route end to end in peak summer; roof as the fifth façade; no ground-floor water.' },
  D15: { bg: ['night'], layers: ['clock', 'legend'], why: 'The late-trading E&L zone closes independently without cutting the loop.' },
  D16: { bg: ['wash'], layers: ['loop', 'phasing', 'legend'], why: 'A credible phase-one opening; phase two (+20 % GLA) absorbed without breaking the loop.' },
  D17: { bg: ['wash'], layers: ['aspirations'], why: 'The wish list, so nothing wanted is lost between workshops.' },
};

const DISTRICTS = ['Fashion Gallery', 'Atelier Row', 'Sports Arena', 'Family Market', 'Daily Needs', 'The Crescendo', 'Food Hall', 'Night Souk', 'Design Quarter', 'Kids Kingdom'];
const PRECINCT = { 'Fashion Gallery': 'Leisure & Fashion', 'Atelier Row': 'Leisure & Fashion', 'Design Quarter': 'Leisure & Fashion', 'Sports Arena': 'Entertainment & Leisure', 'Night Souk': 'Entertainment & Leisure', 'Kids Kingdom': 'Entertainment & Leisure', 'The Crescendo': 'Entertainment & Leisure', 'Family Market': 'Daily Needs', 'Daily Needs': 'Daily Needs', 'Food Hall': 'Daily Needs' };
const PRECINCT_C = { 'Leisure & Fashion': '#C2185B', 'Entertainment & Leisure': '#6A1B9A', 'Daily Needs': '#2E7D32' };
const ASPIRATIONS = ['One ULO with a front door on the Pulse', 'Orbit loop as the play route over the ULO', 'Roof as a designed fifth façade', 'Double-sided F&B promenade in shade', 'Pulse principles agreed at Workshop 1', 'Driverless pods to the plaza'];
