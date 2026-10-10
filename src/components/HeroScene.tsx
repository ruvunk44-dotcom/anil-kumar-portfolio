import { useMemo, useRef, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RING_R } from './heroGeometry';
import { useTheme } from '../hooks/theme';

// Per-theme scene palette: on paper the additive-looking glow washes out, so light uses deeper inks at higher opacity.
const PAL = {
  dark: { core: '#22d3ee', coreO: 0.22, wire: '#38bdf8', wireO: 0.55, shell: '#8b5cf6', shellO: 0.35, o1: '#22d3ee', o1O: 0.35, o2: '#8b5cf6', o2O: 0.25, ring: '#64748b', ringO: 0.25, pts: '#94a3b8', ptsO: 0.6 },
  light: { core: '#0284c7', coreO: 0.16, wire: '#0369a1', wireO: 0.7, shell: '#6d28d9', shellO: 0.42, o1: '#0369a1', o1O: 0.5, o2: '#6d28d9', o2O: 0.38, ring: '#475569', ringO: 0.4, pts: '#334155', ptsO: 0.5 },
};
const usePal = () => PAL[useTheme()];

// Window-level pointer so the HTML node overlay above the canvas still drives parallax.
const pointer = { x: 0, y: 0 };
if (typeof window !== 'undefined') window.addEventListener('pointermove', (e) => { pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = -((e.clientY / innerHeight) * 2 - 1); }, { passive: true });

interface Props { running: boolean }

function Core() {
  const c = usePal();
  const outer = useRef<THREE.Mesh>(null), inner = useRef<THREE.Mesh>(null), shell = useRef<THREE.LineSegments>(null);
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.05, 1)), []);
  useFrame((s, dt) => {
    if (outer.current) outer.current.rotation.y += dt * 0.15;
    if (shell.current) { shell.current.rotation.y -= dt * 0.08; shell.current.rotation.x += dt * 0.05; }
    if (inner.current) inner.current.scale.setScalar(1 + Math.sin(s.clock.elapsedTime * 1.6) * 0.04);
  });
  return (
    <group>
      <mesh ref={inner}><sphereGeometry args={[0.55, 32, 32]} /><meshBasicMaterial color={c.core} transparent opacity={c.coreO} /></mesh>
      <mesh ref={outer}><icosahedronGeometry args={[0.8, 0]} /><meshBasicMaterial color={c.wire} wireframe transparent opacity={c.wireO} /></mesh>
      <lineSegments ref={shell} geometry={edges}><lineBasicMaterial color={c.shell} transparent opacity={c.shellO} /></lineSegments>
    </group>
  );
}

function Orbits() {
  const c = usePal();
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (g.current) { g.current.children[0].rotation.z += dt * 0.05; g.current.children[1].rotation.z -= dt * 0.035; } });
  return (
    <group ref={g}>
      <mesh rotation={[1.2, 0, 0]}><torusGeometry args={[1.7, 0.006, 8, 160]} /><meshBasicMaterial color={c.o1} transparent opacity={c.o1O} /></mesh>
      <mesh rotation={[1.0, 0.6, 0]}><torusGeometry args={[2.2, 0.005, 8, 160]} /><meshBasicMaterial color={c.o2} transparent opacity={c.o2O} /></mesh>
      <mesh><torusGeometry args={[RING_R, 0.004, 8, 200]} /><meshBasicMaterial color={c.ring} transparent opacity={c.ringO} /></mesh>
    </group>
  );
}

function Particles() {
  const c = usePal();
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const n = 520, a = new Float32Array(n * 3);
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < n; i++) { const r = 2 + rnd() * 5, th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1); a.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph) - 2], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); return g;
  }, []);
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.02;
    ref.current.rotation.x += (pointer.y * 0.12 - ref.current.rotation.x) * 0.04;
    ref.current.rotation.z += (pointer.x * 0.08 - ref.current.rotation.z) * 0.04;
  });
  return <points ref={ref} geometry={geo}><pointsMaterial size={0.02} color={c.pts} transparent opacity={c.ptsO} sizeAttenuation /></points>;
}

function Tilt({ children }: { children: ReactNode }) {
  const g = useRef<THREE.Group>(null);
  useFrame(() => { if (g.current) { g.current.rotation.y += (pointer.x * 0.25 - g.current.rotation.y) * 0.05; g.current.rotation.x += (-pointer.y * 0.2 - g.current.rotation.x) * 0.05; } });
  return <group ref={g}>{children}</group>;
}

export default function HeroScene({ running }: Props) {
  return (
    <Canvas className="hero-canvas" frameloop={running ? 'always' : 'never'} dpr={[1, 1.75]} camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} aria-hidden="true">
      <Particles />
      <Tilt><Core /><Orbits /></Tilt>
    </Canvas>
  );
}
