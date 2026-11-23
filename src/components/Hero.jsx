import { useEffect, useState } from 'react';
import PhoneMockup from './PhoneMockup.jsx';
import './Hero.css';

export default function Hero({ card }) {
  const [done, setDone] = useState(false);

  // Loop the "payment confirmed" animation on the phone.
  useEffect(() => {
    const id = setInterval(() => setDone((d) => !d), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero" id="top">
      <div className="container text-center">
        <p className="eyebrow hero__eyebrow">Strawberry Pay</p>
        <h1 className="headline-hero hero__title">
          Checkout,
          <br />
          <span className="gradient-text">freshly squeezed.</span>
        </h1>
        <p className="subhead hero__sub">
          One tap. No forms. No card numbers.
          <br className="hide-sm" /> The faster, safer way to pay — and get paid.
        </p>
        <div className="cta-row">
          <a href="#get-started" className="btn">Get started</a>
          <a href="#benefits" className="link-arrow">Learn more</a>
        </div>
      </div>
      <div className="hero__visual">
        <div className="hero__glow" />
        <PhoneMockup done={done} card={card} />
      </div>
    </section>
  );
}
