import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTheme } from '../hooks/theme';
function Sphere({ active }: { active: number | null }) {
  const theme = useTheme(), group = useRef<THREE.Group>(null), globe = useRef<THREE.Group>(null), satellites = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const light = theme === 'light', color = light ? '#0070f2' : '#56dcf4';
  const geometry = useMemo(() => {
    const a: number[] = [], r = 2.06;
    for (let j = 1; j < 16; j++) { const p = Math.PI * j / 16; for (let i = 0; i < 96; i++) for (const k of [i, i + 1]) { const t = k * Math.PI * 2 / 96; a.push(r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)); } }
    for (let j = 0; j < 24; j++) { const t = j * Math.PI * 2 / 24; for (let i = 0; i < 48; i++) for (const k of [i, i + 1]) { const p = k * Math.PI / 48; a.push(r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)); } }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); return g;
  }, []);
  const dust = useMemo(() => {
    const a = new Float32Array(240 * 3); let seed = 19; const random = () => (seed = seed * 16807 % 2147483647) / 2147483647;
    for (let i = 0; i < 240; i++) { const r = 2.5 + random() * 1.2, t = random() * Math.PI * 2, p = Math.acos(2 * random() - 1); a.set([r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); return g;
  }, []);
  useEffect(() => {
    const fine = matchMedia('(hover:hover) and (pointer:fine)');
    const move = (e: PointerEvent) => { pointer.current = { x: e.clientX / innerWidth * 2 - 1, y: e.clientY / innerHeight * 2 - 1 }; };
    if (fine.matches) addEventListener('pointermove', move, { passive: true });
    return () => removeEventListener('pointermove', move);
  }, []);
  useFrame((state, dt) => {
    const smooth = 1 - Math.exp(-dt * 3);
    if (group.current) { group.current.rotation.y += (pointer.current.x * .22 - group.current.rotation.y) * smooth; group.current.rotation.x += (pointer.current.y * .15 - group.current.rotation.x) * smooth; }
    if (globe.current) globe.current.rotation.y += Math.min(dt, .05) * .09;
    if (satellites.current) satellites.current.children.forEach((s, i) => { const t = state.clock.elapsedTime * (.15 + i * .025) + i * 1.2; s.position.set(Math.cos(t) * (2.4 + i * .08), Math.sin(t) * (1.1 + i * .13), Math.sin(t + .8) * 1.7); });
  });
  return <group ref={group}>
    <group ref={globe} rotation={[.2, .3, -.28]}>
      <mesh><sphereGeometry args={[2, 40, 32]} /><meshBasicMaterial color={light ? '#d6e9ff' : '#071c30'} transparent opacity={light ? .28 : .6} /></mesh>
      <lineSegments geometry={geometry}><lineBasicMaterial color={color} transparent opacity={.36} /></lineSegments>
      <points geometry={dust}><pointsMaterial color={color} size={.018} transparent opacity={.65} /></points>
    </group>
    {[0, 1, 2].map(i => <mesh key={i} rotation={[1.05 + i * .5, i * .7, .25]}><torusGeometry args={[2.45 + i * .22, .008, 6, 128]} /><meshBasicMaterial color={i === 1 ? (light ? '#5353b4' : '#8795ff') : color} transparent opacity={.4} /></mesh>)}
    <group ref={satellites}>{[0, 1, 2, 3, 4].map(i => <mesh key={i}><sphereGeometry args={[active !== null && i === active % 5 ? .075 : .042, 12, 8]} /><meshBasicMaterial color={i === 1 ? '#a2a6ff' : color} /></mesh>)}</group>
  </group>;
}
export default function HeroScene({ running, active }: { running: boolean; active: number | null }) {
  return <Canvas className="hero-canvas" frameloop={running ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true, alpha: true, powerPreference: 'default' }} aria-hidden="true"><Sphere active={active} /></Canvas>;
}
