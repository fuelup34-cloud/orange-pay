import { useState } from 'react';
import Reveal from './Reveal.jsx';
import './Sections.css';

const faqs = [
  {
    q: 'Is there a fee to use Strawberry Pay?',
    a: 'No. Strawberry Pay is free for shoppers. Your bank’s usual card terms apply, and you keep all of your card’s rewards.',
  },
  {
    q: 'Which cards work with Strawberry Pay?',
    a: 'Most debit, credit and prepaid cards from participating banks. You can check eligibility when you add a card in Wallet.',
  },
  {
    q: 'Where can I use it?',
    a: 'Anywhere you see the Strawberry Pay mark online or in apps, and at any store that accepts contactless payments.',
  },
  {
    q: 'What happens if I lose my phone?',
    a: 'Every payment needs your face, fingerprint or passcode. You can also suspend or remove your cards remotely.',
  },
  {
    q: 'How do merchants get started?',
    a: 'Most payment processors support Strawberry Pay already. Turn it on in your dashboard or add our button with a few lines of code.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="section" id="faq">
      <div className="container faq">
        <Reveal className="text-center section-head">
          <h2 className="headline">Questions? Answers.</h2>
        </Reveal>
        <div className="faq__list">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className={`faq__item ${isOpen ? 'is-open' : ''}`}>
                <button
                  className="faq__q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  {f.q}
                  <span className="faq__icon" aria-hidden="true">+</span>
                </button>
                <div className="faq__a">
                  <div>
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
