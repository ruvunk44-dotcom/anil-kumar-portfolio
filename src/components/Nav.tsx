import { useEffect, useRef, useState } from 'react';
import { nav, LINKEDIN, EMAIL } from '../data/content';
import { ResumeButton } from './ResumeLock';
import { Lock } from './Icons';
import { ThemeToggle } from './ThemeToggle';
import { useReducedMotion } from '../hooks/useMedia';

export function Nav() {
  const [active, setActive] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const dlg = useRef<HTMLDialogElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 24);
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    nav.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => { removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);

  const openMenu = () => { dlg.current?.showModal(); btn.current?.setAttribute('aria-expanded', 'true'); };
  const closeMenu = (target?: string) => {
    const d = dlg.current; if (!d?.open) return;
    d.classList.add('closing');
    setTimeout(() => {
      d.close(); d.classList.remove('closing'); btn.current?.setAttribute('aria-expanded', 'false');
      if (target) { history.replaceState(null, '', `#${target}`); document.getElementById(target)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
      else btn.current?.focus();
    }, reduce ? 0 : 200);
  };
  useEffect(() => {
    const m = matchMedia('(min-width: 1025px)');
    const f = (e: MediaQueryListEvent) => { if (e.matches) closeMenu(); };
    m.addEventListener('change', f); return () => m.removeEventListener('change', f);
  });

  return (
    <>
      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-wrap">
          <a className="brand" href="#home"><span className="monogram">AK</span><span className="brand-name">Anil Kumar</span></a>
          <nav aria-label="Main navigation" className="desk-nav">
            {nav.map(([id, label]) => <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>{label}</a>)}
          </nav>
          <ThemeToggle className="hdr" />
          <ResumeButton className="btn btn-primary btn-sm nav-resume"><Lock /> Download Resume</ResumeButton>
          <button ref={btn} className="menu-btn" aria-expanded="false" aria-controls="mobile-navigation" onClick={openMenu}>
            Menu <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
          </button>
        </div>
      </header>
      <dialog ref={dlg} id="mobile-navigation" className="mobile-dialog" aria-label="Portfolio navigation" onCancel={(e) => { e.preventDefault(); closeMenu(); }}>
        <div className="dialog-top">
          <span className="brand"><span className="monogram">AK</span><span className="brand-name">Anil Kumar</span></span>
          <span className="dialog-top-r"><ThemeToggle className="dlg" />
          <button className="close-menu" aria-label="Close menu" onClick={() => closeMenu()}><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.5" /></svg></button></span>
        </div>
        <nav aria-label="Mobile navigation" className="mobile-nav">
          {nav.map(([id, label], i) => (
            <a key={id} href={`#${id}`} style={{ ['--i' as string]: i }} onClick={(e) => { e.preventDefault(); closeMenu(id); }}><span>{String(i + 1).padStart(2, '0')}</span>{label}</a>
          ))}
        </nav>
        <div className="dialog-contact">
          <a className="btn btn-ghost" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a className="btn btn-ghost" href={`mailto:${EMAIL}`}>Email</a>
          <ResumeButton className="btn btn-primary" onBeforeOpen={() => closeMenu()}><Lock /> Download Resume</ResumeButton>
        </div>
      </dialog>
    </>
  );
}
