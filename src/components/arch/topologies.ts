import type { NodeSpec, Tone } from './primitives';

// Per-capability topologies. Every label is a term already used on the site (content.ts);
// zone captions are generic architecture descriptors (cloud, on-premise, consumer/provider).
export interface ZoneSpec { x: number; y: number; w: number; h: number; label: string; tone?: Tone; boundary?: boolean }
export interface EdgeSpec { id: string; d: string; label?: string; lx?: number; ly?: number; tone?: Tone; packet?: boolean; rev?: boolean }
export interface Stage { label: string; sub?: string; zone?: string; tone?: Tone }
export interface Topology { zones: ZoneSpec[]; nodes: NodeSpec[]; edges: EdgeSpec[]; ports: [number, number][]; stages: Stage[]; flow: string }

export const W = 760, H = 340;

const hybrid: Topology = {
  flow: 'Cloud → BTP → Cloud Connector → On-premise',
  zones: [
    { x: 16, y: 30, w: 130, h: 292, label: 'CLOUD', tone: 'ext' },
    { x: 196, y: 30, w: 300, h: 292, label: 'SAP BTP · INTEGRATION SUITE', tone: 'core' },
    { x: 540, y: 30, w: 204, h: 292, label: 'ON-PREMISE', tone: 'sys', boundary: true },
  ],
  nodes: [
    { id: 'cloud', x: 28, y: 176, w: 104, h: 48, label: 'Cloud', sub: 'applications', tone: 'ext' },
    { id: 'suite', x: 250, y: 84, w: 180, h: 48, label: 'SAP Integration Suite', sub: 'SAP BTP', tone: 'core' },
    { id: 'cpi', x: 250, y: 176, w: 180, h: 48, label: 'Cloud Integration / CPI', sub: 'iFlows', tone: 'core' },
    { id: 'cc', x: 470, y: 256, w: 140, h: 44, label: 'Cloud Connector', tone: 'sec' },
    { id: 'apps', x: 560, y: 84, w: 166, h: 48, label: 'On-premise', sub: 'applications' },
    { id: 'po', x: 560, y: 176, w: 166, h: 48, label: 'SAP PO 7.5', sub: 'On-premise' },
  ],
  edges: [
    { id: 'h1', d: 'M132 200H250', label: 'REST · SOAP · OData', lx: 191, ly: 192, tone: 'core', packet: true },
    { id: 'h2', d: 'M340 132V176', tone: 'core' },
    { id: 'h3', d: 'M430 200H502V256', tone: 'core', packet: true },
    { id: 'h4', d: 'M610 278H643V224', tone: 'sec', packet: true },
    { id: 'h5', d: 'M643 176V132', label: 'IDoc · RFC', lx: 683, ly: 157, packet: true },
  ],
  ports: [[132, 200], [250, 200], [430, 200], [502, 256], [610, 278], [643, 224], [643, 176], [643, 132]],
  stages: [
    { label: 'Cloud applications', zone: 'Cloud', tone: 'ext' },
    { label: 'SAP BTP', sub: 'Integration Suite', zone: 'SAP BTP', tone: 'core' },
    { label: 'Cloud Integration / CPI', sub: 'iFlows', zone: 'SAP BTP', tone: 'core' },
    { label: 'Cloud Connector', zone: 'Connectivity', tone: 'sec' },
    { label: 'SAP PO 7.5', sub: 'On-premise applications', zone: 'On-premise network' },
  ],
};

const lane = (x: number, ys: number[], bx: number, tx: number, ty: number) => ys.map((y) => `M${x} ${y}H${bx}V${ty}H${tx}`);
const sapL = lane(204, [100, 170, 240], 247, 290, 170);
const sapR = [130, 210].map((y) => `M450 170H493V${y}H536`);
const sap: Topology = {
  flow: 'SAP systems → Integration Suite → third-party platforms',
  zones: [
    { x: 16, y: 30, w: 204, h: 292, label: 'SAP SYSTEMS', tone: 'core' },
    { x: 262, y: 30, w: 216, h: 292, label: 'INTEGRATION SUITE', tone: 'core' },
    { x: 520, y: 30, w: 224, h: 292, label: 'NON-SAP', tone: 'ext', boundary: true },
  ],
  nodes: [
    { id: 's4', x: 36, y: 80, w: 168, h: 40, label: 'S/4HANA' },
    { id: 'sf', x: 36, y: 150, w: 168, h: 40, label: 'SuccessFactors' },
    { id: 'ar', x: 36, y: 220, w: 168, h: 40, label: 'SAP Ariba' },
    { id: 'is', x: 290, y: 140, w: 160, h: 60, label: 'SAP Integration Suite', sub: 'iFlows', tone: 'core' },
    { id: 'tp', x: 536, y: 110, w: 188, h: 40, label: 'Third-party platforms', tone: 'ext' },
    { id: 'ea', x: 536, y: 190, w: 188, h: 40, label: 'Enterprise applications', tone: 'ext' },
  ],
  edges: [
    ...sapL.map((d, i) => ({ id: `s${i}`, d, tone: 'core' as Tone, packet: i !== 1 })),
    ...sapR.map((d, i) => ({ id: `t${i}`, d, packet: true, tone: 'ext' as Tone })),
  ],
  ports: [[204, 100], [204, 170], [204, 240], [290, 170], [450, 170], [536, 130], [536, 210]],
  stages: [
    { label: 'S/4HANA · SuccessFactors · SAP Ariba', zone: 'SAP systems' },
    { label: 'SAP Integration Suite', sub: 'iFlows', zone: 'Integration layer', tone: 'core' },
    { label: 'Third-party platforms', sub: 'Enterprise applications', zone: 'Non-SAP', tone: 'ext' },
  ],
};

const api: Topology = {
  flow: 'Consumer → API Management → provider',
  zones: [
    { x: 16, y: 30, w: 196, h: 292, label: 'CONSUMER', tone: 'ext' },
    { x: 252, y: 30, w: 256, h: 292, label: 'API LAYER', tone: 'api' },
    { x: 548, y: 30, w: 196, h: 292, label: 'PROVIDER', tone: 'sys' },
  ],
  nodes: [
    { id: 'c', x: 32, y: 144, w: 160, h: 64, label: 'Business', sub: 'applications', tone: 'ext' },
    { id: 'am', x: 284, y: 132, w: 192, h: 88, label: 'API Management', sub: 'REST · SOAP · OData', tone: 'api' },
    { id: 'p', x: 568, y: 144, w: 160, h: 64, label: 'Business', sub: 'applications' },
  ],
  edges: [
    { id: 'a1', d: 'M192 164H284', label: 'request', lx: 238, ly: 156, tone: 'api', packet: true },
    { id: 'a2', d: 'M284 190H192', label: 'response', lx: 238, ly: 206, tone: 'api', packet: true },
    { id: 'a3', d: 'M476 164H568', label: 'request', lx: 522, ly: 156, tone: 'api', packet: true },
    { id: 'a4', d: 'M568 190H476', label: 'response', lx: 522, ly: 206, tone: 'api', packet: true },
    { id: 'a5', d: 'M380 220V262', tone: 'api' },
  ],
  ports: [[192, 164], [192, 190], [284, 164], [284, 190], [476, 164], [476, 190], [568, 164], [568, 190]],
  stages: [
    { label: 'Business applications', zone: 'Consumer', tone: 'ext' },
    { label: 'API Management', sub: 'REST · SOAP · OData', zone: 'API layer', tone: 'api' },
    { label: 'Business applications', zone: 'Provider' },
  ],
};

const sfTargets = ['ERP', 'Active Directory', 'Payroll', 'Kronos', 'BW', 'External systems'];
const sfY = sfTargets.map((_, i) => 58 + i * 44);
const sf: Topology = {
  flow: 'Employee Central → CPI / Integration Center → targets',
  zones: [
    { x: 16, y: 30, w: 186, h: 292, label: 'SUCCESSFACTORS', tone: 'core' },
    { x: 222, y: 30, w: 218, h: 292, label: 'INTEGRATION', tone: 'core' },
    { x: 520, y: 30, w: 224, h: 292, label: 'TARGET SYSTEMS', tone: 'sys', boundary: true },
  ],
  nodes: [
    { id: 'ec', x: 32, y: 150, w: 152, h: 56, label: 'Employee Central', sub: 'OData APIs', tone: 'core' },
    { id: 'cpi', x: 242, y: 106, w: 178, h: 48, label: 'CPI', sub: 'Cloud Integration', tone: 'core' },
    { id: 'ic', x: 242, y: 202, w: 178, h: 48, label: 'Integration Center', sub: 'SuccessFactors', tone: 'core' },
    ...sfTargets.map((t, i) => ({ id: `t${i}`, x: 548, y: sfY[i], w: 176, h: 32, label: t, tone: (i === 5 ? 'ext' : 'sys') as Tone })),
  ],
  edges: [
    { id: 'f1', d: 'M184 178H213V130H242', tone: 'core', packet: true },
    { id: 'f2', d: 'M184 178H213V226H242', tone: 'core', packet: true },
    { id: 'f3', d: 'M420 130H480', tone: 'core' },
    { id: 'f4', d: 'M420 226H480', tone: 'core' },
    { id: 'fb', d: `M480 ${sfY[0] + 16}V${sfY[5] + 16}`, tone: 'core' },
    ...sfY.map((y, i) => ({ id: `fo${i}`, d: `M480 ${y + 16}H548`, packet: i % 2 === 0 })),
  ],
  ports: [[184, 178], [242, 130], [242, 226], [420, 130], [420, 226], ...sfY.map((y) => [548, y + 16] as [number, number])],
  stages: [
    { label: 'Employee Central', sub: 'OData APIs', zone: 'SuccessFactors', tone: 'core' },
    { label: 'CPI · Integration Center', zone: 'Integration', tone: 'core' },
    { label: 'ERP · Active Directory · Payroll', sub: 'Kronos · BW · External systems', zone: 'Target systems' },
  ],
};

const edi: Topology = {
  flow: 'Enterprise → B2B channel → External systems',
  zones: [
    { x: 16, y: 30, w: 210, h: 292, label: 'ENTERPRISE', tone: 'sys', boundary: true },
    { x: 262, y: 30, w: 236, h: 292, label: 'B2B CHANNEL', tone: 'b2b' },
    { x: 534, y: 30, w: 210, h: 292, label: 'EXTERNAL', tone: 'ext', boundary: true },
  ],
  nodes: [
    { id: 'erp', x: 36, y: 102, w: 166, h: 48, label: 'ERP', sub: 'IDoc · XML' },
    { id: 'x12', x: 290, y: 102, w: 180, h: 48, label: 'EDI', sub: 'ANSI X12 · PIDX XML', tone: 'b2b' },
    { id: 'as2', x: 290, y: 206, w: 180, h: 48, label: 'AS2', sub: 'RNIF', tone: 'b2b' },
    { id: 'ext', x: 556, y: 206, w: 166, h: 48, label: 'External systems', tone: 'ext' },
  ],
  edges: [
    { id: 'e1', d: 'M202 126H290', label: 'IDoc', lx: 246, ly: 118, packet: true },
    { id: 'e2', d: 'M380 150V206', tone: 'b2b', packet: true },
    { id: 'e3', d: 'M470 230H556', label: 'AS2', lx: 513, ly: 222, tone: 'b2b', packet: true },
    { id: 'e4', d: 'M556 242H470', tone: 'b2b', packet: true },
  ],
  ports: [[202, 126], [290, 126], [380, 150], [380, 206], [470, 230], [470, 242], [556, 230], [556, 242], [226, 126], [534, 236]],
  stages: [
    { label: 'ERP', sub: 'IDoc · XML', zone: 'Enterprise' },
    { label: 'EDI', sub: 'ANSI X12 · PIDX XML', zone: 'B2B channel', tone: 'b2b' },
    { label: 'AS2', sub: 'RNIF', zone: 'B2B channel', tone: 'b2b' },
    { label: 'External systems', zone: 'External', tone: 'ext' },
  ],
};

const life = ['Design', 'Technical documentation', 'Testing', 'Production support'];
const lx = [24, 206, 388, 570];
const gov: Topology = {
  flow: 'Design → documentation → testing → production support',
  zones: [
    { x: 16, y: 30, w: 728, h: 102, label: 'DELIVERY LIFECYCLE', tone: 'core' },
    { x: 16, y: 148, w: 728, h: 84, label: 'STANDARDS', tone: 'sys' },
    { x: 16, y: 248, w: 728, h: 74, label: 'SECURITY', tone: 'sec' },
  ],
  nodes: [
    ...life.map((t, i) => ({ id: `l${i}`, x: lx[i], y: 62, w: 166, h: 44, label: t.split(' ')[0], sub: t.split(' ').slice(1).join(' ') || undefined, tone: 'core' as Tone })),
    ...['Standards', 'Error handling', 'Performance optimisation'].map((t, i) => ({ id: `g${i}`, x: [24, 268, 512][i], y: 176, w: 224, h: 38, label: t })),
    ...['OAuth', 'SAML', 'X.509', 'PGP'].map((t, i) => ({ id: `k${i}`, x: lx[i], y: 274, w: 166, h: 34, label: t, tone: 'sec' as Tone })),
  ],
  edges: [
    ...[0, 1, 2].map((i) => ({ id: `g${i}`, d: `M${lx[i] + 166} 84H${lx[i + 1]}`, tone: 'core' as Tone, packet: true })),
    { id: 'gv1', d: 'M136 106V176', tone: 'sys' }, { id: 'gv2', d: 'M471 106V176', tone: 'sys' }, { id: 'gv3', d: 'M653 106V176', tone: 'sys' },
  ],
  ports: [...[0, 1, 2].flatMap((i) => [[lx[i] + 166, 84], [lx[i + 1], 84]] as [number, number][]), [136, 106], [136, 176], [471, 106], [471, 176], [653, 106], [653, 176]],
  stages: [
    ...life.map((t) => ({ label: t, zone: 'Lifecycle', tone: 'core' as Tone })),
    { label: 'Standards · Error handling', sub: 'Performance optimisation', zone: 'Standards' },
    { label: 'OAuth · SAML · X.509 · PGP', zone: 'Security', tone: 'sec' },
  ],
};

export const topologies: Record<string, Topology> = { hybrid, sap, api, sf, edi, gov };
