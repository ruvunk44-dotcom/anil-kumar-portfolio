import { Reveal } from './Reveal';
export function SectionHead({ title, sub, id }: { kicker: string; title: string; sub?: string; id?: string }) {
  return (
    <Reveal className="section-head">
      <h2 id={id}>{title}</h2>
      {sub && <p>{sub}</p>}
    </Reveal>
  );
}
