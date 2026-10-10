import { expertise } from '../../data/content';
import { Reveal } from '../Reveal';
import { SectionHead } from '../SectionHead';
const capabilities = [
  { label: 'Cloud integration', detail: 'Connect cloud and on-premise landscapes.', nodes: ['SAP applications', 'Integration Suite', 'External systems'] },
  { label: 'Integration foundations', detail: 'From XI/PI to modern integration flows.', nodes: ['XI/PI', 'PI/PO', 'CPI'] },
  { label: 'Application landscape', detail: 'Connect business processes across enterprise applications.', nodes: ['S/4HANA', 'SuccessFactors', 'Ariba'] },
  { label: 'Interfaces & protocols', detail: 'API-based, real-time and batch connectivity.', nodes: ['REST', 'OData', 'IDoc'] },
  { label: 'Business connectivity', detail: 'Structured exchange across business partners.', nodes: ['Partner', 'EDI / B2B', 'Enterprise'] },
  { label: 'Architecture & governance', detail: 'Secure connections. Maintainable integration.', nodes: ['Identity', 'Secure integration', 'Governance'] },
];
export function Expertise() {
  return (
    <section id="expertise" className={`section band capability-section`}>
      <div className="wrap">
        <div className="capability-heading">
          <SectionHead kicker="02 · Capabilities" title="Core expertise" sub="Technical depth across the integration lifecycle." />
        </div>
        <div className="capability-grid">
          {expertise.map((x, i) => (
            <Reveal key={x.title} as="article" delay={i * 0.05} className={`capability capability-${i}`}>
              <header className="capability-meta"><span>{String(i + 1).padStart(2, '0')} / {capabilities[i].label}</span></header>
              <div className="capability-body">
                <div className="capability-copy"><h3>{x.title}</h3><p>{capabilities[i].detail}</p></div>
                <div className="capability-diagram" aria-hidden="true">
                  {capabilities[i].nodes.map((node, index) => <span className={`capability-node${index === 1 ? ' capability-core' : ''}`} key={node}>{node}</span>)}
                  <span className="capability-wire"><span /></span>
                </div>
              </div>
              <ul className="capability-skills" aria-label={`${x.title} skills`}>{x.items.map(t => <li key={t}>{t}</li>)}</ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
