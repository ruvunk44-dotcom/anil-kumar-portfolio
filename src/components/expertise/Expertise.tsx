import { expertise } from '../../data/content';
import { Reveal } from '../Reveal';
import { SectionHead } from '../SectionHead';
import { expertiseGlyphs } from './Glyphs';

// Six capability modules on a shared hairline grid. Neutral graphite by default;
// cyan is reserved for the active (hover/focus) module and its glyph's data pulse.
export function Expertise() {
  return (
    <section id="expertise" className="section band">
      <div className="wrap">
        <SectionHead kicker="02 · Capabilities" title="Core expertise" sub="Technical depth across the integration lifecycle." />
        <div className="xgrid">
          {expertise.map((x, i) => {
            const G = expertiseGlyphs[x.icon];
            return (
              <Reveal key={x.title} as="article" delay={i * 0.05} className="xmod">
                <div className="xmod-in" tabIndex={0} aria-label={`${x.title}: ${x.items.join(', ')}`}>
                  <header className="xmod-head">
                    <span className="xmod-idx">{String(i + 1).padStart(2, '0')}</span>
                    <span className="xmod-count">{String(x.items.length).padStart(2, '0')} items</span>
                  </header>
                  <G />
                  <h3>{x.title}</h3>
                  <ul className="xlist">{x.items.map((t) => <li key={t}>{t}</li>)}</ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
