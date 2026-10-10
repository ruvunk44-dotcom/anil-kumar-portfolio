import { useEffect, useRef, useState, type ReactNode } from 'react';
import { EMAIL, LINKEDIN, LOCATION } from '../../data/content';
import { ResumeButton } from '../ResumeLock';
import { PacketLayer } from '../flow/PacketLayer';
import { useMedia, useReducedMotion } from '../../hooks/useMedia';

// Route geometry (viewBox 400x300, stretched with preserveAspectRatio="none"; strokes stay 1px via non-scaling-stroke).
// Origin port (0,150) -> router (220,150) -> three channel ports on the right edge, aligned to the channel rows (1/6, 3/6, 5/6).
const RX = 220, ENDS = [50, 150, 250];
const route = (y: number) => y === 150 ? `M0 150H400` : `M0 150H${RX}C${RX + 50} 150 ${RX + 40} ${y} ${RX + 90} ${y}H400`;

type Ch = { key: string; idx: string; label: string; meta: string; dir: 'right' | 'out' | 'down' };
const CHANNELS: Ch[] = [
  { key: 'email', idx: 'CH.01', label: 'Email', meta: EMAIL, dir: 'right' },
  { key: 'linkedin', idx: 'CH.02', label: 'LinkedIn', meta: LINKEDIN.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''), dir: 'out' },
  { key: 'resume', idx: 'CH.03', label: 'Resume', meta: 'Access code required · PDF', dir: 'down' },
];

export const ArrowGlyph = ({ dir }: { dir: Ch['dir'] | 'up' }) => {
  const d = { right: 'M3 8h10M9 4l4 4-4 4', out: 'M4 12l8-8M6 4h6v6', down: 'M8 3v10M4 9l4 4 4-4', up: 'M8 13V3M4 7l4-4 4 4' }[dir];
  return <svg className={`cx-arr cx-arr-${dir}`} viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d={d} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square" /></svg>;
};

function CopyEmail({ onDone }: { onDone: (ok: boolean) => void }) {
  const [done, setDone] = useState(false);
  useEffect(() => { if (!done) return; const t = setTimeout(() => setDone(false), 1800); return () => clearTimeout(t); }, [done]);
  async function copy() {
    try { await navigator.clipboard.writeText(EMAIL); setDone(true); onDone(true); } catch { onDone(false); }
  }
  return (
    <button type="button" className={`cx-copy${done ? ' done' : ''}`} onClick={copy} aria-label={`Copy email address ${EMAIL}`}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <g className="i-copy" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="5.5" y="5.5" width="8" height="8" /><path d="M10.5 3.5v-1h-8v8h1" /></g>
        <path className="i-ok" d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <span>{done ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

function ChannelRow({ c, i, on, setOn, children }: { c: Ch; i: number; on: number | null; setOn: (n: number | null) => void; children: (cls: string, inner: ReactNode) => ReactNode }) {
  const inner = (
    <>
      <span className="cx-port cx-port-in" aria-hidden="true" />
      <span className="cx-idx" aria-hidden="true">{c.idx}</span>
      <span className="cx-lbl">{c.label}</span>
      <span className="cx-meta">{c.meta}</span>
      <ArrowGlyph dir={c.dir} />
    </>
  );
  return (
    <li className={`cx-ch${on === i ? ' on' : ''}`} onMouseEnter={() => setOn(i)} onMouseLeave={() => setOn(null)} onFocus={() => setOn(i)} onBlur={() => setOn(null)}>
      {children('cx-ch-a', inner)}
    </li>
  );
}

export function Contact() {
  const sec = useRef<HTMLElement>(null);
  const net = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState<number | null>(null);
  const [live, setLive] = useState(false);
  const [toast, setToast] = useState('');
  const reduce = useReducedMotion();
  const wide = useMedia('(min-width: 961px)', true);

  // One-time entrance: routes draw in once the section is reached (quick + simple under reduced motion via CSS).
  useEffect(() => {
    const el = sec.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el); return () => io.disconnect();
  }, []);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(''), 2600); return () => clearTimeout(t); }, [toast]);

  return (
    <section id="contact" ref={sec} className={`section cx${live ? ' live' : ''}${on !== null ? ' has-on' : ''}`} aria-labelledby="contact-title">
      <div className="wrap">
        <div className="cx-frame">
          <header className="cx-bar" aria-hidden="true">
            <span>Enquiry routing</span>
            <span className="cx-bar-r">Route · {String(CHANNELS.length).padStart(2, '0')} channels</span>
          </header>
          <div className="cx-grid">
            <div className="cx-id">
              <span className="kicker">09 · Contact</span>
              <h2 id="contact-title">Professional enquiries</h2>
              <p className="cx-lede">Open to remote SAP BTP and enterprise integration architecture engagements.</p>
              <dl className="cx-facts">
                <div><dt>Location</dt><dd>{LOCATION}</dd></div>
                <div><dt>Email</dt><dd className="cx-mail"><a href={`mailto:${EMAIL}`}>{EMAIL}</a><CopyEmail onDone={(ok) => setToast(ok ? 'Email address copied to clipboard' : 'Could not copy. Please use the email link.')} /></dd></div>
              </dl>
            </div>

            <div className="cx-net" ref={net} aria-hidden="true">
              <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="cx-svg">
                <path className="cx-grid-ln" d="M0 150H400" vectorEffect="non-scaling-stroke" />
                {ENDS.map((y, i) => (
                  <g key={y}>
                    <path className="cx-rt-base" d={route(y)} pathLength={1} vectorEffect="non-scaling-stroke" style={{ transitionDelay: `${0.25 + i * 0.12}s` }} />
                    <path className={`cx-rt${on === i ? ' on' : ''}`} d={route(y)} vectorEffect="non-scaling-stroke" data-flow="out" />
                  </g>
                ))}
              </svg>
              <span className="cx-node cx-origin" style={{ left: 0, top: '50%' }}><i className="port" /><em>Inquiry</em></span>
              <span className="cx-node cx-router" data-hub style={{ left: `${(RX / 400) * 100}%`, top: '50%' }}><i /><em>Router</em></span>
              {ENDS.map((y, i) => <span key={y} className={`cx-node cx-end${on === i ? ' on' : ''}`} style={{ left: '100%', top: `${(y / 300) * 100}%` }}><i className="port" /></span>)}
              {wide && !reduce && live && <PacketLayer root={net} perPath={1} dur={[5.5, 8]} reverseShare={0} />}
            </div>

            <ul className="cx-chs" aria-label="Contact channels">
              <ChannelRow c={CHANNELS[0]} i={0} on={on} setOn={setOn}>
                {(cls, inner) => <a className={cls} href={`mailto:${EMAIL}`} aria-label={`Email ${EMAIL}`}>{inner}</a>}
              </ChannelRow>
              <ChannelRow c={CHANNELS[1]} i={1} on={on} setOn={setOn}>
                {(cls, inner) => <a className={cls} href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile (opens in a new tab)">{inner}</a>}
              </ChannelRow>
              <ChannelRow c={CHANNELS[2]} i={2} on={on} setOn={setOn}>
                {(cls, inner) => <ResumeButton className={cls}><span className="sr-only">Download resume (access code required)</span><span aria-hidden="true" className="cx-contents">{inner}</span></ResumeButton>}
              </ChannelRow>
            </ul>
          </div>
        </div>
      </div>
      <div className="cx-toast" role="status" aria-live="polite">{toast && <span>{toast}</span>}</div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="wrap footer cx-foot">
      <span>© {new Date().getFullYear()} Anil Kumar</span>
      <span className="cx-foot-mid">SAP BTP · Integration Suite · Enterprise Integration</span>
      <a href="#home" className="cx-top">Back to top <ArrowGlyph dir="up" /></a>
    </footer>
  );
}
