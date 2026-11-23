import Reveal from './Reveal.jsx';
import './Sections.css';

const items = [
  {
    title: 'Tokenized payments',
    body: 'Your card is replaced with a device-specific number that’s useless to anyone else.',
  },
  {
    title: 'Biometric approval',
    body: 'Every payment is confirmed with your face, fingerprint or passcode. Nobody else can pay as you.',
  },
  {
    title: 'No purchase history sold',
    body: 'Strawberry Pay doesn’t keep track of what you buy, and we never sell your data. Period.',
  },
  {
    title: 'Lost your phone?',
    body: 'Suspend or erase your cards remotely in moments, from any browser.',
  },
];

export default function Security() {
  return (
    <section className="section section--dark" id="security">
      <div className="container">
        <Reveal className="text-center section-head">
          <p className="eyebrow">Security</p>
          <h2 className="headline">Built to protect.<br /><span className="gradient-text">From the core.</span></h2>
          <p className="lede section-lede">
            Security and privacy are at the heart of Strawberry Pay — designed in from day one, not added later.
          </p>
        </Reveal>
        <div className="security__grid">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 80} className="security__card">
              <div className="security__dot" />
              <h3 className="security__title">{it.title}</h3>
              <p className="security__body">{it.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
