import { useEffect, useRef, type MutableRefObject } from 'react';
import { ACCENT_HEX, RING_PCT, nodeAngle } from './heroGeometry';
import type { Accent } from '../data/content';

interface Props { nodes: { name: string; accent: Accent }[]; active: number | null; running: boolean; reduce: boolean; nodeEls: MutableRefObject<(HTMLLIElement | null)[]> }
const DOTS = 2;

// Lightweight SVG network: one rAF loop bobs nodes, re-curves lines to follow them and moves data dots.
export function SvgNetwork({ nodes, active, running, reduce, nodeEls }: Props) {
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const svg = useRef<SVGSVGElement>(null);
  const activeRef = useRef(active);
  activeRef.current = active;
  const n = nodes.length;
  const base = nodes.map((_, i) => { const a = nodeAngle(i, n); return [50 + Math.cos(a) * RING_PCT, 50 - Math.sin(a) * RING_PCT, a] as const; });
  const curve = (i: number, dx: number, dy: number, bend: number) => {
    const [x, y, a] = base[i]; const ex = x + dx, ey = y + dy;
    const mx = (50 + ex) / 2 + Math.sin(a) * bend, my = (50 + ey) / 2 + Math.cos(a) * bend;
    return { ex, ey, mx, my, d: `M50 50 Q${mx.toFixed(2)} ${my.toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}` };
  };

  useEffect(() => {
    // Core explanatory motion runs even with reduced motion (gentler); only big effects are disabled elsewhere.
    if (!running) return;
    const k0 = reduce ? 0.5 : 1;
    let raf = 0, last = performance.now(), t = 0;
    const prog = new Float32Array(n * DOTS).map((_, k) => ((k % DOTS) / DOTS + (Math.floor(k / DOTS) * 0.137)) % 1);
    const rect = () => svg.current?.getBoundingClientRect().width || 600;
    let w = rect(); const ro = new ResizeObserver(() => { w = rect(); }); if (svg.current) ro.observe(svg.current);
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) * k0; last = now; t += dt;
      const act = activeRef.current;
      for (let i = 0; i < n; i++) {
        const ph = i * 1.7;
        const px = Math.sin(t * 0.9 + ph) * 4 * k0, py = Math.cos(t * 0.7 + ph * 1.3) * 5 * k0; // px bob
        const dx = (px / w) * 100, dy = (py / w) * 100;
        const el = nodeEls.current[i]; if (el) el.style.transform = `translate(-50%,-50%) translate(${px.toFixed(2)}px,${py.toFixed(2)}px)`;
        const c = curve(i, dx, dy, Math.sin(t * 0.6 + ph) * 1.6);
        paths.current[i]?.setAttribute('d', c.d);
        const speed = act === i ? 0.75 : 0.22;
        for (let k = 0; k < DOTS; k++) {
          const idx = i * DOTS + k; prog[idx] = (prog[idx] + dt * speed) % 1;
          const u = i % 2 ? 1 - prog[idx] : prog[idx], v = 1 - u; // odd = inbound
          const x = v * v * 50 + 2 * v * u * c.mx + u * u * c.ex, y = v * v * 50 + 2 * v * u * c.my + u * u * c.ey;
          const dEl = dots.current[idx]; if (dEl) { dEl.setAttribute('cx', x.toFixed(2)); dEl.setAttribute('cy', y.toFixed(2)); dEl.style.opacity = String(Math.sin(Math.PI * u) * (act === null || act === i ? 1 : 0.25)); }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, running, n]);


  return (
    <svg ref={svg} className={`hero-static${active !== null ? ' has-active' : ''}${running ? '' : ' paused'}${reduce ? ' gentle' : ''}`} viewBox="0 0 100 100" aria-hidden="true">
      <defs><filter id="dotglow" x="-2" y="-2" width="5" height="5"><feGaussianBlur stdDeviation=".6" /></filter></defs>
      <circle cx="50" cy="50" r={RING_PCT} className="ring" />
      {nodes.map((nd, i) => (
        <path key={nd.name} ref={(e) => { paths.current[i] = e; }} d={curve(i, 0, 0, 0).d}
          className={`link ${i % 2 ? 'in' : 'out'}${active === i ? ' on' : ''}`} style={{ stroke: ACCENT_HEX[nd.accent], color: ACCENT_HEX[nd.accent], animationDelay: `${-i * 0.37}s` }} />
      ))}
      {nodes.flatMap((nd, i) => Array.from({ length: DOTS }, (_, k) => (
        <g key={`${nd.name}-${k}`} style={{ color: ACCENT_HEX[nd.accent] }}>
          <circle ref={(e) => { dots.current[i * DOTS + k] = e; }} cx="50" cy="50" r={active === i ? 0.75 : 0.55} className="pkt" style={{ opacity: 0 }} />
        </g>
      )))}
    </svg>
  );
}
