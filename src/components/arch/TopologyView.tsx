import { ArchitectureNode, ArchitectureZone, ConnectionPath, SystemPort, TopologyCanvas } from './primitives';
import { H, W, type Topology } from './topologies';

export function TopologyView({ t, title }: { t: Topology; title: string }) {
  return (
    <TopologyCanvas w={W} h={H} label={`${title}: ${t.flow}`} className="topo-desk">
      {t.zones.map((z) => <ArchitectureZone key={z.label} {...z} />)}
      {t.edges.map((e, i) => <ConnectionPath key={e.id} id={`edge-${e.id}`} d={e.d} label={e.label} lx={e.lx} ly={e.ly} tone={e.tone} reverse={e.rev} delay={180 + i * 50} flow={i % 3 === 2 ? 'both' : 'out'} />)}
      {t.nodes.map((n, i) => <ArchitectureNode key={n.id} n={n} delay={i * 45} emphasis={n.tone === 'core'} />)}
      {t.ports.map(([x, y], i) => <SystemPort key={i} x={x} y={y} />)}
    </TopologyCanvas>
  );
}

// Mobile: same topology expressed as a vertical, readable flow.
export function TopologyStack({ t, title }: { t: Topology; title: string }) {
  return (
    <ol className="topo-stack" aria-label={`${title}: ${t.flow}`}>
      {t.stages.map((s, i) => (
        <li key={i} className={`fstage fstage-${s.tone ?? 'sys'}`} style={{ animationDelay: `${i * 60}ms` }}>
          {s.zone && <span className="fstage-zone">{s.zone}</span>}
          <span className="fstage-box"><strong>{s.label}</strong>{s.sub && <small>{s.sub}</small>}</span>
        </li>
      ))}
    </ol>
  );
}
