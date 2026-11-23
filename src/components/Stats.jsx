import Reveal from './Reveal.jsx';
import './Sections.css';

const stats = [
  { value: '2×', label: 'faster than typing card details' },
  { value: '85%', label: 'of shoppers say one-tap checkout matters' },
  { value: '0', label: 'card numbers shared with merchants' },
];

export default function Stats() {
  return (
    <section className="section stats">
      <div className="container">
        <div className="stats__grid">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 120} className="stat">
              <div className="stat__value gradient-text">{s.value}</div>
              <p className="stat__label">{s.label}</p>
            </Reveal>
          ))}
        </div>
        <p className="footnote text-center">Figures are illustrative for this demo.</p>
      </div>
    </section>
  );
}
