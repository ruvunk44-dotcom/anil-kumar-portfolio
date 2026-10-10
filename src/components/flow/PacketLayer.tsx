import { useEffect, useRef, type RefObject } from 'react';
import { useReducedMotion } from '../../hooks/useMedia';
import { useMotionPreference } from '../../hooks/motion';

// One rAF loop moves small luminous packets port-to-port along every <path data-flow> inside `root`.
// Positions come from getPointAtLength mapped through getScreenCTM, so it works for any SVG scaling
// (including preserveAspectRatio="none"). Runs under reduced motion too (slower), pauses off-screen.
// data-flow="out|in|both" sets direction; data-hub on an element makes it pulse when a packet arrives.
interface Opts { perPath?: number; dur?: [number, number]; reverseShare?: number; deps?: unknown[] }

export function PacketLayer({ root, perPath = 1, dur = [4.5, 6.5], reverseShare = 0.3, deps = [] }: Opts & { root: RefObject<HTMLElement> }) {
  const layer = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { paused } = useMotionPreference();
  useEffect(() => {
    const host = root.current, box = layer.current;
    if (!host || !box || paused) return;
    const paths = [...host.querySelectorAll<SVGPathElement>('path[data-flow]')];
    const ports = [...host.querySelectorAll<SVGGraphicsElement>('.port')];
    const hub = host.querySelector<HTMLElement>('[data-hub]');
    const rnd = (k: number) => { const x = Math.sin(k * 12.9898) * 43758.5453; return x - Math.floor(x); };
    box.replaceChildren();
    const pk = paths.flatMap((p, i) => Array.from({ length: perPath }, (_, j) => {
      const k = i * 7 + j * 3 + 1, mode = p.dataset.flow;
      const rev = mode === 'in' ? rnd(k + 2) >= reverseShare : mode === 'both' ? rnd(k) < 0.5 : rnd(k + 2) < reverseShare;
      const el = document.createElement('i'); el.className = 'fpkt'; box.appendChild(el);
      return { p, el, len: p.getTotalLength(), rev, dur: dur[0] + rnd(k + 5) * (dur[1] - dur[0]), t: (rnd(k + 9) + j / perPath) % 1, tone: p.dataset.tone || '' };
    }));
    pk.forEach((q) => q.tone && q.el.classList.add(`fpkt-${q.tone}`));
    const hit = (x: number, y: number) => {
      let best: Element | null = null, bd = 14;
      for (const pt of ports) { const r = pt.getBoundingClientRect(); const d = Math.hypot(r.x + r.width / 2 - x, r.y + r.height / 2 - y); if (d < bd) { bd = d; best = pt; } }
      const tgt = best ?? (hub && (() => { const r = hub.getBoundingClientRect(); return x >= r.left - 20 && x <= r.right + 20 && y >= r.top - 20 && y <= r.bottom + 20; })() ? hub : null);
      if (!tgt) return;
      tgt.classList.remove('hit'); void (tgt as HTMLElement).getBoundingClientRect(); tgt.classList.add('hit');
    };
    const k0 = reduce ? 0.65 : 1;
    let raf = 0, last = performance.now(), vis = true;
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis) { last = performance.now(); raf = requestAnimationFrame(loop); } else cancelAnimationFrame(raf); });
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) * k0; last = now;
      const o = box.getBoundingClientRect();
      for (const q of pk) {
        const hot = q.p.classList.contains('on');
        q.t += dt / (hot ? q.dur * 0.6 : q.dur);
        if (q.t >= 1) { q.t -= 1; const e = q.p.getPointAtLength(q.rev ? 0 : q.len), m = q.p.getScreenCTM(); if (m) hit(e.x * m.a + e.y * m.c + m.e, e.x * m.b + e.y * m.d + m.f); }
        const ease = q.t < 0.5 ? 2 * q.t * q.t : 1 - (-2 * q.t + 2) ** 2 / 2;
        const s = q.rev ? 1 - ease : ease;
        const pt = q.p.getPointAtLength(s * q.len), m = q.p.getScreenCTM();
        if (!m) continue;
        const x = pt.x * m.a + pt.y * m.c + m.e - o.left, y = pt.x * m.b + pt.y * m.d + m.f - o.top;
        const fade = Math.min(1, q.t * 8, (1 - q.t) * 8);
        q.el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
        q.el.style.opacity = String(fade * (hot ? 1 : 0.85));
        q.el.classList.toggle('hot', hot);
      }
      if (vis) raf = requestAnimationFrame(loop);
    };
    io.observe(host);
    return () => { cancelAnimationFrame(raf); io.disconnect(); box.replaceChildren(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, reduce, paused, perPath, reverseShare, ...deps]);
  return <div ref={layer} className="fpkt-layer" aria-hidden="true" />;
}
