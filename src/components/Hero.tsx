import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Reveal } from './Reveal';
import { SvgNetwork } from './SvgNetwork';
import { heroNodes, heroProtocols, scenarios, stats, techStrip, LINKEDIN } from '../data/content';
import { ACCENT_HEX, RING_PCT, nodeAngle } from './heroGeometry';
import { ResumeButton } from './ResumeLock';
import { Download, Arrow } from './Icons';
import { useReducedMotion } from '../hooks/useMedia';
import { useMotionPreference } from '../hooks/motion';

const HeroScene = lazy(() => import('./HeroScene'));

function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}


function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  useEffect(() => {
    const el = ref.current; if (!el || reduce) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => { const p = Math.min(1, (t - t0) / 1400); el.textContent = Math.round(to * (1 - (1 - p) ** 3)) + suffix; if (p < 1) raf = requestAnimationFrame(step); };
      raf = requestAnimationFrame(step);
    });
    io.observe(el); return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, suffix, reduce]);
  return <span ref={ref}>{to}{suffix}</span>;
}

export function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(0);
  const { paused } = useMotionPreference();
  const [use3D, setUse3D] = useState(false);
  const [visible, setVisible] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  const nodeEls = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // Mobile adaptation: phones and low-power devices get the animated SVG network instead of WebGL.
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    const capable = innerWidth >= 760 && (navigator.hardwareConcurrency || 4) >= 4 && !nav.connection?.saveData;
    if (!capable || !webglOK()) { setUse3D(false); return; }
    // Defer the WebGL bundle until the browser is idle so text renders first.
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(() => setUse3D(true), { timeout: 1200 }) : window.setTimeout(() => setUse3D(true), 600);
    return () => { if (!w.requestIdleCallback) clearTimeout(id); };
  }, [reduce]);
  useEffect(() => {
    const el = stage.current; if (!el) return;
    let inView = true;
    const sync = () => setVisible(inView && document.visibilityState === 'visible');
    const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; sync(); });
    io.observe(el);
    const vis = sync;
    document.addEventListener('visibilitychange', vis);
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', vis); };
  }, []);

  const sc = active !== null ? scenarios[heroNodes[active].name] : null;

  return (
    <section id="home" className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <h1 className="rise" style={{ animationDelay: '80ms' }}>
            SAP <span className="hero-accent">BTP</span><br />Integration<br />Architect<span className="title-period">.</span>
          </h1>
          <p className="speciality rise" style={{ animationDelay: '240ms' }}>SAP Integration Suite · Enterprise Integration</p>
          <p className="intro rise" style={{ animationDelay: '320ms' }}>17+ years of experience designing and delivering enterprise integration solutions across SAP and non-SAP landscapes.</p>
          <div className="actions rise" style={{ animationDelay: '400ms' }}>
            <a className="btn btn-primary" href="#architecture">Explore Architecture <Arrow /></a>
            <a className="btn btn-ghost" href="#experience">View Experience</a>
            <ResumeButton className="text-link"><Download /> Download Resume</ResumeButton>
          </div>
          <a className="text-link li-link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">Connect on LinkedIn</a>
          <p className="availability"><span />Open to remote architecture engagements</p>
        </div>

        <div className="hero-system">
          <div className="scene-toolbar"><span>Explore the integration network</span></div>
          <div className="stage" ref={stage} aria-label="Interactive conceptual SAP integration network" role="group">
            <div className="stage-grid" aria-hidden="true" />
            {!use3D && <svg className="stage-globe" viewBox="0 0 100 100" aria-hidden="true"><g fill="none" stroke="currentColor" strokeWidth=".2"><circle cx="50" cy="50" r="29" />{[10,20,27].map(r => <ellipse key={r} cx="50" cy="50" rx={r} ry="29" />)}{[9,18,25].map(r => <ellipse key={r} cx="50" cy="50" rx="29" ry={r} />)}<ellipse cx="50" cy="50" rx="34" ry="13" transform="rotate(-32 50 50)" /></g></svg>}
            {use3D && <Suspense fallback={null}><HeroScene running={visible && !paused} active={active} /></Suspense>}
            {/* SVG connector layer is shared by WebGL and non-WebGL modes so lines stay attached to the bobbing DOM nodes. */}
            <SvgNetwork nodes={heroNodes} active={active} running={visible && !paused} reduce={reduce && paused} nodeEls={nodeEls} />
            <div className="core-card">
              <span className="core-sym" aria-hidden="true"><svg viewBox="0 0 32 32" width="24" height="24"><path d="m16 3 12 7v13l-12 7-12-7V10Z M4 10l12 7 12-7M16 17v13" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg></span>
              <strong>SAP BTP</strong><span>Integration Suite</span><small>Cloud Integration / CPI</small>
            </div>
            <ul className="node-list">
              {heroNodes.map((n, i) => {
                const a = nodeAngle(i, heroNodes.length);
                return (
                  <li key={n.name} ref={(e) => { nodeEls.current[i] = e; }} style={{ left: `${50 + Math.cos(a) * RING_PCT}%`, top: `${50 - Math.sin(a) * RING_PCT}%`, ['--c' as string]: ACCENT_HEX[n.accent] }}>
                    <button type="button" className={`node${active === i ? ' on' : ''}`} aria-pressed={active === i}
                      onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)}>{n.name}</button>
                  </li>
                );
              })}
            </ul>
            <div className="protocols" aria-hidden="true">{heroProtocols.map((p, i) => { const a = Math.PI / 2 + Math.PI / 10 - (i * 2 * Math.PI) / heroProtocols.length - Math.PI / 5; return <span key={p} style={{ left: `${50 + Math.cos(a) * RING_PCT * 0.6}%`, top: `${50 - Math.sin(a) * RING_PCT * 0.6}%` }}>{p}</span>; })}</div>
          </div>
          <div className="insight" role="status" aria-live="polite">
            <span className="insight-dot" style={sc && active !== null ? { background: ACCENT_HEX[heroNodes[active].accent] } : undefined} />
            {sc ? (<div><strong>{sc.title}</strong><span>{sc.detail}</span><code>{sc.protocol}</code>{sc.related.length > 0 && <em>Related: {sc.related.join(' · ')}</em>}</div>)
              : (<div><strong>Connected enterprise landscapes</strong><span>Explore a node to view a representative integration scenario.</span></div>)}
          </div>
          <p className="caption">Select a system to explore · Conceptual scenarios across professional experience</p>
        </div>
      </div>

      <div className="wrap stats">
        {stats.map((s, i) => (
          <Reveal as="article" key={s.label} className="glass stat" delay={i * 0.08}>
            <strong>{s.count ? <Counter to={s.count} suffix="+" /> : s.value}</strong><span>{s.label}</span>
          </Reveal>
        ))}
      </div>
      <div className="tech-strip" aria-label="Core technologies">
        <div className="marquee">
          {[0, 1].map((k) => <div key={k} className="marquee-row" aria-hidden={k === 1 ? true : undefined}>{techStrip.map((t) => <span key={t}>{t}</span>)}</div>)}
        </div>
      </div>
    </section>
  );
}
