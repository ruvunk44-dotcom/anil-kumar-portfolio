import type { ReactNode } from 'react';

// One pictogram grammar: 40-unit grid, 1.25px non-scaling strokes, 4px square nodes,
// orthogonal links, a single travelling pulse (.gp) that animates on card hover/focus.
const S = { vectorEffect: 'non-scaling-stroke' as const };
function Glyph({ children, size = 44 }: { children: ReactNode; size?: number }) {
  return <svg className="glyph" viewBox="0 0 40 40" width={size} height={size} aria-hidden="true" fill="none" strokeWidth="1.25" strokeLinecap="square">{children}</svg>;
}
const N = ({ x, y, s = 4, core }: { x: number; y: number; s?: number; core?: boolean }) => <rect className={core ? 'gn gc' : 'gn'} x={x - s / 2} y={y - s / 2} width={s} height={s} {...S} />;
const L = ({ d, dim }: { d: string; dim?: boolean }) => <path className={dim ? 'gl dim' : 'gl'} d={d} {...S} />;
const P = ({ d }: { d: string }) => <path className="gp" d={d} pathLength={100} {...S} />;

export const BTPEcosystemGlyph = () => (
  <Glyph>
    <rect className="gn gc" x="14.5" y="14.5" width="11" height="11" {...S} />
    <L d="M20 6v8.5M20 25.5V34M6 20h8.5M25.5 20H34" />
    <N x={20} y={5} /><N x={20} y={35} /><N x={5} y={20} /><N x={35} y={20} />
    <rect className="gl dim" x="17.5" y="17.5" width="5" height="5" {...S} />
    <P d="M6 20h8.5M25.5 20H34" />
  </Glyph>
);

export const PlatformEvolutionGlyph = () => (
  <Glyph>
    <L d="M5 13.5h30M5 26.5h30" />
    <L d="M11 13.5v13M29 13.5v13" dim />
    <N x={5} y={13.5} /><N x={35} y={13.5} /><N x={5} y={26.5} /><N x={35} y={26.5} core />
    <rect className="gn" x="8.5" y="5.5" width="5" height="4" {...S} /><L d="M11 9.5v4" dim />
    <rect className="gn gc" x="26.5" y="30.5" width="5" height="4" {...S} /><L d="M29 26.5v4" dim />
    <P d="M5 13.5h6v13h24" />
  </Glyph>
);

export const EnterpriseLandscapeGlyph = () => (
  <Glyph>
    <rect className="gn" x="4.5" y="5.5" width="9" height="6" {...S} /><rect className="gn" x="26.5" y="5.5" width="9" height="6" {...S} />
    <rect className="gn" x="4.5" y="28.5" width="9" height="6" {...S} /><rect className="gn" x="26.5" y="28.5" width="9" height="6" {...S} />
    <L d="M9 11.5V20h22v-8.5M9 28.5V20M31 28.5V20" />
    <rect className="gn gc" x="17" y="17.5" width="6" height="5" {...S} />
    <P d="M9 11.5V20h22v8.5" />
  </Glyph>
);

export const APIConnectivityGlyph = () => (
  <Glyph>
    <rect className="gn" x="3.5" y="12.5" width="7" height="15" {...S} /><rect className="gn" x="29.5" y="12.5" width="7" height="15" {...S} />
    <rect className="gn gc" x="16.5" y="9.5" width="7" height="21" {...S} />
    <L d="M10.5 16.5h6M23.5 16.5h6" /><L d="M16.5 23.5h-6M29.5 23.5h-6" dim />
    <N x={20} y={16.5} s={2.5} /><N x={20} y={23.5} s={2.5} />
    <P d="M10.5 16.5h19" />
  </Glyph>
);

export const B2BGlyph = () => (
  <Glyph>
    <path className="gl dim" d="M4.5 5.5h7v29h-7M35.5 5.5h-7v29h7" strokeDasharray="2 2" {...S} />
    <L d="M11.5 20h17" />
    <rect className="gn gc" x="16.5" y="16.5" width="7" height="7" {...S} />
    <L d="M18 18.5h4M18 21.5h2.5" dim />
    <N x={11.5} y={20} s={3} /><N x={28.5} y={20} s={3} />
    <P d="M11.5 20h17" />
  </Glyph>
);

export const SecurityArchitectureGlyph = () => (
  <Glyph>
    <rect className="gl dim" x="3.5" y="3.5" width="33" height="33" strokeDasharray="2 2" {...S} />
    <L d="M3.5 13.5h33M3.5 26.5h33" dim />
    <L d="M9 8.5v23M31 8.5v23" />
    <rect className="gn gc" x="16.5" y="16.5" width="7" height="7" {...S} />
    <L d="M9 20h7.5M23.5 20H31" />
    <path className="gn gc" d="M20 18.5v3" {...S} />
    <P d="M9 8.5V20h22v11.5" />
  </Glyph>
);

export const expertiseGlyphs = [BTPEcosystemGlyph, PlatformEvolutionGlyph, EnterpriseLandscapeGlyph, APIConnectivityGlyph, B2BGlyph, SecurityArchitectureGlyph];
