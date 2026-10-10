import { useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { ResumeProvider } from './components/ResumeLock';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { About, Expertise, Experience, Architecture, Landscape, Certifications, Journey, Education, Contact, Footer } from './components/Sections';

function Atmosphere() {
  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const root = document.documentElement;
    let raf = 0, x = 0, y = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; if (!raf) raf = requestAnimationFrame(() => { root.style.setProperty('--px', `${x}px`); root.style.setProperty('--py', `${y}px`); raf = 0; }); };
    const prog = () => { const h = document.documentElement.scrollHeight - innerHeight; root.style.setProperty('--progress', String(h > 0 ? scrollY / h : 0)); };
    if (fine.matches) addEventListener('pointermove', move, { passive: true });
    addEventListener('scroll', prog, { passive: true }); prog();
    return () => { removeEventListener('pointermove', move); removeEventListener('scroll', prog); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="atmo" aria-hidden="true">
      <div className="mesh" /><div className="grid" /><div className="spot" /><div className="grain" /><div className="vignette" />
      <div className="progress" />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ResumeProvider>
        <Atmosphere />
        <a className="skip" href="#main">Skip to content</a>
        <Nav />
        <main id="main">
          <Hero />
          <About />
          <Expertise />
          <Experience />
          <Architecture />
          <Landscape />
          <Certifications />
          <Journey />
          <Education />
          <Contact />
        </main>
        <Footer />
      </ResumeProvider>
    </MotionConfig>
  );
}
