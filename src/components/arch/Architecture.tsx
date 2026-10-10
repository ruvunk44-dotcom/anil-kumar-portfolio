import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { PacketLayer } from '../flow/PacketLayer';
import { capabilities } from '../../data/content';
import { useMedia } from '../../hooks/useMedia';
import { SectionHead } from '../SectionHead';
import { topologies } from './topologies';
import { TopologyStack, TopologyView } from './TopologyView';

export function Architecture() {
  const [sel, setSel] = useState(0);
  const [visible, setVisible] = useState(false);
  const section = useRef<HTMLElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = section.current; if (!el) return;
    let inView = false;
    const sync = () => setVisible(inView && document.visibilityState === 'visible');
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; sync(); });
    observer.observe(el); document.addEventListener('visibilitychange', sync);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
  }, []);
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setSel(current => (current + 1) % capabilities.length), 3000);
    return () => clearTimeout(timer);
  }, [visible, sel]);
  const narrow = useMedia('(max-width: 720px)');
  const canvas = useRef<HTMLDivElement>(null);
  const c = capabilities[sel];
  const t = topologies[c.id];
  const n = capabilities.length;
  useEffect(() => {
    if (!narrow || !tabs.current || !visible) return;
    const active = tabs.current.children[sel] as HTMLElement;
    tabs.current.scrollTo({ left: active.offsetLeft - tabs.current.offsetLeft, behavior: 'smooth' });
  }, [sel, narrow, visible]);
  const onKey = (e: KeyboardEvent) => {
    const k = e.key;
    const next = k === 'ArrowDown' || k === 'ArrowRight' ? (sel + 1) % n : k === 'ArrowUp' || k === 'ArrowLeft' ? (sel - 1 + n) % n : k === 'Home' ? 0 : k === 'End' ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault(); setSel(next); document.getElementById(`cap-tab-${capabilities[next].id}`)?.focus();
  };
  return (
    <section id="architecture" ref={section} className="section arch3">
      <div className="wrap">
        <SectionHead kicker="04 · Architecture" title="Enterprise integration architecture" sub="Practical capabilities for connected enterprise landscapes." />
        <div className="architecture-playback">
          <span>Auto-play · next capability every 3 seconds</span>
        </div>
        <div className={`ws${!visible ? ' architecture-paused' : ''}`}>
          <div className="ws-tabs" ref={tabs} role="tablist" aria-label="Integration capabilities" aria-orientation="horizontal" onKeyDown={onKey}>
            {capabilities.map((x, i) => (
              <button key={x.id} id={`cap-tab-${x.id}`} role="tab" aria-selected={sel === i} aria-controls="cap-panel" tabIndex={sel === i ? 0 : -1}
                className={`ws-tab${sel === i ? ' on' : ''}`} onClick={() => setSel(i)}>
                <span className="idx">{String(i + 1).padStart(2, '0')}</span><span className="nm">{x.title}</span>{sel === i && <span key={sel} className="architecture-timer" aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div id="cap-panel" role="tabpanel" aria-labelledby={`cap-tab-${c.id}`} className="ws-panel" data-cap={c.id}>
            <header className="ws-head">
              <div>
                <span className="ws-meta">CAPABILITY {String(sel + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
              <dl className="ws-spec">
                <div><dt>Flow</dt><dd>{t.flow}</dd></div>
                <div><dt>Components</dt><dd>{c.chips.join(' · ')}</dd></div>
              </dl>
            </header>
            <div className="ws-canvas" key={c.id} ref={canvas}>
              {narrow ? <TopologyStack t={t} title={c.title} /> : <TopologyView t={t} title={c.title} />}
              {!narrow && <PacketLayer root={canvas} deps={[c.id]} />}
            </div>
            <footer className="ws-legend" aria-hidden="true">
              <span><i className="lg lg-core" />SAP / BTP</span><span><i className="lg lg-sys" />Enterprise system</span>
              <span><i className="lg lg-ext" />External</span><span><i className="lg lg-dash" />Network boundary</span>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
