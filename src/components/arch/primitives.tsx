import type { ReactNode } from 'react';

// Shared SVG grammar for the architecture explorer and the expertise glyphs.
// Static geometry sits on whole/half pixels and uses non-scaling strokes so 1px lines stay crisp.
const NS = { vectorEffect: 'non-scaling-stroke' as const };

export type Tone = 'core' | 'sys' | 'ext' | 'sec' | 'b2b' | 'api';

export function TopologyCanvas({ w, h, label, children, className }: { w: number; h: number; label: string; children: ReactNode; className?: string }) {
  return (
    <svg className={`topo ${className ?? ''}`} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={label} shapeRendering="geometricPrecision">
      <defs>
        <pattern id="topo-grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" className="topo-gridline" {...NS} /></pattern>
      </defs>
      <rect width={w} height={h} fill="url(#topo-grid)" className="topo-bg" />
      {children}
    </svg>
  );
}

export function ArchitectureZone({ x, y, w, h, label, meta, tone = 'sys', boundary }: { x: number; y: number; w: number; h: number; label: string; meta?: string; tone?: Tone; boundary?: boolean }) {
  return (
    <g className={`zone zone-${tone}${boundary ? ' zone-boundary' : ''}`}>
      <rect x={x + 0.5} y={y + 0.5} width={w} height={h} rx="2" {...NS} />
      <path d={`M${x + 0.5} ${y + 12.5}V${y + 0.5}H${x + 12.5}`} className="zone-corner" {...NS} />
      <ArchitectureLabel x={x + 12} y={y + 20} text={label} kind="zone" />
      {meta && <ArchitectureLabel x={x + w - 10} y={y + 20} text={meta} kind="meta" anchor="end" />}
    </g>
  );
}

export function ArchitectureLabel({ x, y, text, kind = 'edge', anchor = 'start' }: { x: number; y: number; text: string; kind?: 'zone' | 'meta' | 'edge' | 'node' | 'sub'; anchor?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} className={`lbl lbl-${kind}`} textAnchor={anchor}>{text}</text>;
}

export function SystemPort({ x, y, active }: { x: number; y: number; active?: boolean }) {
  return <rect className={`port${active ? ' on' : ''}`} x={x - 2.5} y={y - 2.5} width="5" height="5" {...NS} />;
}

export interface NodeSpec { id: string; x: number; y: number; w: number; h: number; label: string; sub?: string; tone?: Tone }

export function ArchitectureNode({ n, delay = 0, emphasis }: { n: NodeSpec; delay?: number; emphasis?: boolean }) {
  const tone = n.tone ?? 'sys';
  return (
    <g className={`anode anode-${tone}${emphasis ? ' em' : ''}`} style={{ animationDelay: `${delay}ms` }}>
      <rect x={n.x + 0.5} y={n.y + 0.5} width={n.w} height={n.h} rx="3" {...NS} />
      <path className="anode-tick" d={`M${n.x + 0.5} ${n.y + 8}V${n.y + n.h - 7}`} {...NS} />
      <text className="lbl lbl-node" x={n.x + 14} y={n.y + (n.sub ? n.h / 2 - 2 : n.h / 2 + 4)}>{n.label}</text>
      {n.sub && <text className="lbl lbl-sub" x={n.x + 14} y={n.y + n.h / 2 + 12}>{n.sub}</text>}
    </g>
  );
}

export function ConnectionPath({ id, d, label, lx, ly, tone = 'sys', reverse, delay = 0, flow }: { flow?: 'out' | 'both'; id: string; d: string; label?: string; lx?: number; ly?: number; tone?: Tone; reverse?: boolean; delay?: number }) {
  return (
    <g className={`conn conn-${tone}`} style={{ animationDelay: `${delay}ms` }}>
      <path id={id} d={d} className="conn-base" {...NS} />
      <path d={d} className={`conn-flow${reverse ? ' rev' : ''}`} {...NS} />
      {flow && <path d={d} className="conn-track" data-flow={flow} data-tone={tone} />}
      {label && lx !== undefined && ly !== undefined && (
        <g className="conn-label"><ArchitectureLabel x={lx} y={ly} text={label} kind="edge" anchor="middle" /></g>
      )}
    </g>
  );
}

