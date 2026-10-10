import { useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { about, jobs, landscape, scenarios, certs, journey, education } from '../data/content';
import { ACCENT_HEX } from './heroGeometry';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { PacketLayer } from './flow/PacketLayer';
export { Expertise } from './expertise/Expertise';
export { Architecture } from './arch/Architecture';
import { useMedia } from '../hooks/useMedia';

const v = (c: string) => ({ ['--c' as string]: c }) as CSSProperties;


// Pointer-tracked light + subtle tilt; only on fine pointers (CSS disables transform for reduced motion).
function useTilt() {
  const fine = useMedia('(hover: hover) and (pointer: fine)');
  return {
    onPointerMove: (e: PointerEvent<HTMLElement>) => {
      if (!fine) return;
      const el = e.currentTarget, r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`);
      el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`); el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
    },
    onPointerLeave: (e: PointerEvent<HTMLElement>) => { e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg'); },
  };
}

export function About() {
  return (
    <section id="about" className="section wrap about">
      <Reveal className="about-title">
        <span className="kicker">01 · Introduction</span>
        <h2>{about.title[0]}<br /><span className="grad">{about.title[1]}</span></h2>
        <p>{about.sub}</p>
      </Reveal>
      <div className="about-body">
        <Reveal><p className="lead">{about.lead}</p></Reveal>
        {about.paras.map((p, i) => <Reveal key={i} delay={0.08 * (i + 1)}><p>{p}</p></Reveal>)}
      </div>
    </section>
  );
}

export function Experience() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <section id="experience" className="section wrap">
      <SectionHead kicker="03 · Career" title="Professional experience" sub="Global delivery. Hands-on technical foundations." />
      <div className="timeline-wrap">
      <div className="rail" aria-hidden="true"><motion.div className="rail-fill" style={{ scaleY }} /></div>
      <ol className="timeline" ref={ref}>
        {jobs.map((j) => (
          <Reveal as="li" key={j.date} className={`job${j.recent ? ' recent' : ''}`}>
            <span className="job-node" aria-hidden="true" />
            <div className="job-meta"><time>{j.date}</time><span>{j.location}</span></div>
            <article className="glass job-card">
              <h3>{j.role}</h3>
              <p className="company">{j.company}</p>
              <p className="project">{j.project}</p>
              <ul>{j.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </article>
          </Reveal>
        ))}
      </ol>
      </div>
    </section>
  );
}

export function Landscape() {
  const [hot, setHot] = useState<string | null>(null);
  const sc = hot ? scenarios[hot] : null;
  const Y = (i: number) => 40 + i * 64;
  const grid = useRef<HTMLDivElement>(null);
  const sideCol = (side: 'l' | 'r') => side === 'l' ? ACCENT_HEX.cyan : ACCENT_HEX.slate;
  const bank = (items: string[], side: 'l' | 'r') => (
    <ul className={`bank bank-${side}`}>
      {items.map((s) => (
        <li key={s}><button type="button" className={`sys${hot === s ? ' on' : ''}${sc?.related.includes(s) ? ' rel' : ''}`} style={v(sideCol(side))}
          onMouseEnter={() => setHot(s)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(s)} onBlur={() => setHot(null)} aria-describedby="land-detail">{s}</button></li>
      ))}
    </ul>
  );
  return (
    <section className="section wrap landscape" aria-labelledby="landscape-title">
      <SectionHead kicker="05 · Landscape" id="landscape-title" title="Selected integration landscape" sub="A conceptual view of connected technologies." />
      <Reveal>
        <figure className="glass land">
          <div className="land-grid" ref={grid}>
            <PacketLayer root={grid} perPath={2} dur={[4.5, 7]} reverseShare={0.35} />
            {bank(landscape.left, 'l')}
            <svg className="land-lines l" viewBox="0 0 100 384" preserveAspectRatio="none" aria-hidden="true">
              {landscape.left.map((s, i) => <path key={s} className={hot === s ? 'on' : ''} d={`M0 ${Y(i) + 12} C 50 ${Y(i) + 12}, 50 192, 100 192`} data-flow="out" data-tone="core" />)}
            </svg>
            <div className="land-core">
              <span className="proto">{landscape.leftProtocols.join('  |  ')}</span>
              <div className="core" data-hub><span>SAP BTP</span><strong>SAP Integration Suite</strong><span>Cloud Integration / CPI</span></div>
              <span className="proto">{landscape.rightProtocols.join('  |  ')}</span>
            </div>
            <svg className="land-lines r" viewBox="0 0 100 384" preserveAspectRatio="none" aria-hidden="true">
              {landscape.right.map((s, i) => <path key={s} className={hot === s ? 'on' : ''} d={`M0 192 C 50 192, 50 ${Y(i) + 12}, 100 ${Y(i) + 12}`} data-flow="in" />)}
            </svg>
            {bank(landscape.right, 'r')}
          </div>
          <div id="land-detail" className="land-detail" aria-live="polite">
            {sc ? <><strong>{sc.title}</strong><span>{sc.detail}</span><code>{sc.protocol}</code></> : <span>Hover or focus a system to view a representative integration scenario.</span>}
          </div>
          <figcaption>{landscape.caption}</figcaption>
        </figure>
      </Reveal>
    </section>
  );
}

export function Certifications() {
  const tilt = useTilt();
  return (
    <section id="certifications" className="section band">
      <div className="wrap">
        <SectionHead kicker="06 · Credentials" title="SAP certifications" sub="Qualifications supporting cloud integration and BTP delivery." />
        <div className="cert-grid">
          {certs.map((c, i) => (
            <Reveal as="article" key={c.title} delay={i * 0.08} className="glass cert">
              <div className="tilt-inner" style={v(ACCENT_HEX.cyan)} {...tilt}>
                <div className="cert-top"><span className="badge" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 2l2.6 2 3.2-.3.9 3.1 2.7 1.8-1.2 3 1.2 3-2.7 1.8-.9 3.1-3.2-.3L12 22l-2.6-2-3.2.3-.9-3.1-2.7-1.8 1.2-3-1.2-3 2.7-1.8.9-3.1 3.2.3Z M8.5 12l2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg></span><span className="year">{c.year}</span></div>
                <h3>{c.title}</h3><p>{c.level}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Journey() {
  return (
    <section className="section wrap journey-sec" aria-labelledby="journey-title">
      <SectionHead kicker="07 · Progression" id="journey-title" title="Career journey" sub="From SAP XI/PI to enterprise architecture." />
      <motion.div className="journey-wrap" initial="hide" whileInView="show" viewport={{ once: true, margin: '0px 0px -15% 0px' }} variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
        <motion.div className="journey-line" aria-hidden="true" variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.4, ease: 'easeInOut' } } }} />
        <motion.ol className="journey" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
        {journey.map((j, i) => (
          <motion.li key={j} variants={{ hide: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} className={i === journey.length - 1 ? 'last' : ''}>
            <span className="jdot" aria-hidden="true" /><span className="jnum">{String(i + 1).padStart(2, '0')}</span><span className="jname">{j}</span>
          </motion.li>
        ))}
        </motion.ol>
      </motion.div>
    </section>
  );
}

export function Education() {
  return (
    <section className="section wrap edu" aria-labelledby="education-title">
      <SectionHead kicker="08 · Education" id="education-title" title="Education" />
      <div className="edu-grid">
        {education.map((e, i) => (
          <Reveal as="article" key={e.title} delay={i * 0.08} className="glass edu-card">
            <span className="year">{e.year}</span><h3>{e.title}</h3><p>{e.place}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export { Contact, Footer } from './contact/Contact';
