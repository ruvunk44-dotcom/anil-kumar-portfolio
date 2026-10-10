import { setTheme, useTheme } from '../hooks/theme';

// Custom sun/moon glyph: one disc; rays retract and a crescent mask slides in for dark.
export function ThemeToggle({ className = '' }: { className?: string }) {
  const t = useTheme(), light = t === 'light';
  return (
    <button type="button" className={`theme-btn ${className}`} aria-pressed={light} aria-label="Light mode" title={light ? 'Switch to dark mode' : 'Switch to light mode'} onClick={() => setTheme(light ? 'dark' : 'light')}>
      <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" className="tg">
        <mask id={`tgm-${className || 'x'}`}><rect width="20" height="20" fill="#fff" /><circle className="tg-cut" cx="14.5" cy="5.5" r="4.2" fill="#000" /></mask>
        <circle className="tg-disc" cx="10" cy="10" r="4.6" fill="none" stroke="currentColor" strokeWidth="1.3" mask={`url(#tgm-${className || 'x'})`} />
        <g className="tg-rays" stroke="currentColor" strokeWidth="1.3" strokeLinecap="square">
          <path d="M10 1.5v1.8M10 16.7v1.8M1.5 10h1.8M16.7 10h1.8M4 4l1.3 1.3M14.7 14.7 16 16M4 16l1.3-1.3M14.7 5.3 16 4" />
        </g>
      </svg>
    </button>
  );
}
