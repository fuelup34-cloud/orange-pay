import Reveal from './Reveal.jsx';
import './Sections.css';

const steps = [
  { n: '1', title: 'Add your card', body: 'Open Wallet and scan any debit or credit card from a participating bank.' },
  { n: '2', title: 'Choose Strawberry Pay', body: 'Tap the Strawberry Pay button online or hold your phone near the reader in store.' },
  { n: '3', title: 'Confirm and go', body: 'Double-click to approve with your face or fingerprint. That’s it — you’re done.' },
];

export default function HowItWorks() {
  return (
    <section className="section" id="how">
      <div className="container">
        <Reveal className="text-center section-head">
          <p className="eyebrow">How it works</p>
          <h2 className="headline">Three steps.<br />Then never think about it again.</h2>
        </Reveal>
        <ol className="steps">
          {steps.map((s, i) => (
            <Reveal as="li" key={s.n} delay={i * 120} className="step">
              <span className="step__num">{s.n}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__body">{s.body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
