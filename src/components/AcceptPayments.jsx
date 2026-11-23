import { useState } from 'react';
import Reveal from './Reveal.jsx';
import './Sections.css';

const tabs = [
  {
    id: 'web',
    label: 'Online',
    title: 'Add Strawberry Pay to your website.',
    body: 'Drop in our button and let customers check out without creating an account or filling in a single form field.',
    points: ['Works with major payment processors', 'Fewer abandoned carts', 'Shipping and contact info prefilled'],
  },
  {
    id: 'app',
    label: 'In apps',
    title: 'Native checkout in your app.',
    body: 'Integrate with a few lines of code and give customers a familiar, trusted payment sheet.',
    points: ['Single SDK for iOS and Android', 'Subscriptions and recurring payments', 'Built-in fraud signals'],
  },
  {
    id: 'store',
    label: 'In store',
    title: 'Contactless at the counter.',
    body: 'If your terminal accepts contactless cards, it already accepts Strawberry Pay. No new hardware required.',
    points: ['Tap to pay in under a second', 'Loyalty cards in the same tap', 'Lower risk than card-present swipes'],
  },
];

export default function AcceptPayments() {
  const [active, setActive] = useState('web');
  const tab = tabs.find((t) => t.id === active);

  return (
    <section className="section section--alt" id="accept">
      <div className="container">
        <Reveal className="text-center section-head">
          <p className="eyebrow">For business</p>
          <h2 className="headline">Accept Strawberry Pay.<br />Watch conversions climb.</h2>
        </Reveal>

        <Reveal className="tabs">
          <div className="tabs__list" role="tablist">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={t.id === active}
                className={`tabs__btn ${t.id === active ? 'is-active' : ''}`}
                onClick={() => setActive(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="tabs__panel" role="tabpanel" key={tab.id}>
            <div className="tabs__copy">
              <h3 className="headline-sm">{tab.title}</h3>
              <p className="lede">{tab.body}</p>
              <ul className="checklist">
                {tab.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a href="#get-started" className="link-arrow">See integration guide</a>
            </div>
            <div className="tabs__art">
              <button className="op-button" type="button" aria-label="Pay with Strawberry Pay (demo)">
                <svg width="20" height="20" viewBox="0 0 32 32" aria-hidden="true">
                  <path d="M16 11.2c5.3 0 8.6 2.4 8.6 6 0 4.3-4.4 8.6-8.6 10.3-4.2-1.7-8.6-6-8.6-10.3 0-3.6 3.3-6 8.6-6z" fill="#e11d48" />
                  <path d="M16 12.6l-2.2-1.8-3.4.9 1.9-2.2-1.4-2.6 3.1 1.2L16 5.4l2 2.7 3.1-1.2-1.4 2.6 1.9 2.2-3.4-.9z" fill="#2fbf5b" />
                </svg>
                Pay
              </button>
              <span className="tabs__caption">The Strawberry Pay button</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
