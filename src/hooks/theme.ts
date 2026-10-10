import { useSyncExternalStore } from 'react';
export type Theme = 'light' | 'dark';
const KEY = 'ak-theme', EV = 'ak-theme-change';
const stored = (): Theme | null => { try { const t = localStorage.getItem(KEY); return t === 'light' || t === 'dark' ? t : null; } catch { return null; } };
const system = (): Theme => (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
export const getTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

function apply(t: Theme, animate: boolean) {
  const d = document.documentElement;
  if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    d.classList.add('theme-anim'); clearTimeout((apply as unknown as { t?: number }).t);
    (apply as unknown as { t?: number }).t = window.setTimeout(() => d.classList.remove('theme-anim'), 360);
  }
  d.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'light' ? '#f6f7f9' : '#030405');
  dispatchEvent(new Event(EV));
}
export function setTheme(t: Theme) { try { localStorage.setItem(KEY, t); } catch { /* storage unavailable */ } apply(t, true); }

if (typeof window !== 'undefined') {
  // Follow the OS setting until the visitor makes an explicit choice.
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (!stored()) apply(system(), true); });
  if (!document.documentElement.dataset.theme) apply(stored() ?? system(), false);
}
const sub = (f: () => void) => { addEventListener(EV, f); return () => removeEventListener(EV, f); };
export const useTheme = () => useSyncExternalStore(sub, getTheme, () => 'dark' as Theme);
