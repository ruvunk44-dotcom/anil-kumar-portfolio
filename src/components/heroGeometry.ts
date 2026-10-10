import type { Accent } from '../data/content';
export const RING_R = 3.0;
// camera z=10, fov 45 → visible half-height 10·tan(22.5°); overlay radius as a % of the square stage.
export const RING_PCT = (RING_R / (10 * Math.tan((22.5 * Math.PI) / 180))) * 50;
export const nodeAngle = (i: number, n: number) => Math.PI / 2 - (i * 2 * Math.PI) / n;
// Accents resolve through CSS tokens so they adapt to the active theme.
export const ACCENT_HEX: Record<Accent, string> = { cyan: 'var(--a-cyan)', violet: 'var(--a-violet)', emerald: 'var(--a-emerald)', amber: 'var(--a-amber)', blue: 'var(--a-blue)', slate: 'var(--a-slate)' };
