import Reveal from './Reveal.jsx';
import './Sections.css';

const tiles = [
  {
    size: 'wide',
    tone: 'accent',
    eyebrow: 'Speed',
    title: 'Pay in seconds.\nNot minutes.',
    body: 'Skip the typing. Strawberry Pay fills in your card, shipping and contact details with a single tap.',
    art: 'speed',
  },
  {
    size: 'tall',
    tone: 'dark',
    eyebrow: 'Privacy',
    title: 'Your number stays yours.',
    body: 'Merchants never see your actual card number. Every purchase uses a unique, one-time code.',
    art: 'lock',
  },
  {
    tone: 'light',
    eyebrow: 'Everywhere',
    title: 'Online, in apps, in stores.',
    body: 'Look for the Strawberry Pay mark at checkout — or just tap your phone at the register.',
    art: 'globe',
  },
  {
    tone: 'light',
    eyebrow: 'Rewards',
    title: 'Keep every perk.',
    body: 'Your card’s points, miles and cash back work exactly the way they always have.',
    art: 'star',
  },
  {
    size: 'wide',
    tone: 'soft',
    eyebrow: 'Easy setup',
    title: 'Add a card in under a minute.',
    body: 'Scan your card with your camera, verify with your bank, and you’re ready to go.',
    art: 'cards',
  },
];

function Art({ type }) {
  switch (type) {
    case 'speed':
      return (
        <div className="art art--speed">
          <span>0.8</span><small>sec</small>
        </div>
      );
    case 'lock':
      return (
        <svg className="art art--icon" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="12" y="28" width="40" height="30" rx="8" fill="#e11d48" />
          <path d="M20 28v-8a12 12 0 0 1 24 0v8" fill="none" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" />
          <circle cx="32" cy="42" r="4" fill="#000" />
        </svg>
      );
    case 'globe':
      return (
        <svg className="art art--icon" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="24" fill="none" stroke="#e11d48" strokeWidth="4" />
          <ellipse cx="32" cy="32" rx="10" ry="24" fill="none" stroke="#e11d48" strokeWidth="4" />
          <path d="M8 32h48M12 20h40M12 44h40" stroke="#e11d48" strokeWidth="4" />
        </svg>
      );
    case 'star':
      return (
        <svg className="art art--icon" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M32 6l7.6 16.4L58 24.6 44.6 37l3.6 18.2L32 46.4 15.8 55.2 19.4 37 6 24.6l18.4-2.2z" fill="#e11d48" />
        </svg>
      );
    case 'cards':
      return (
        <div className="art art--cards">
          <div className="card-stack card-stack--1" />
          <div className="card-stack card-stack--2" />
          <div className="card-stack card-stack--3" />
        </div>
      );
    default:
      return null;
  }
}

export default function Benefits() {
  return (
    <section className="section section--alt" id="benefits">
      <div className="container-wide">
        <Reveal className="text-center section-head">
          <p className="eyebrow">Why Strawberry Pay</p>
          <h2 className="headline">Simple. Private. Secure.<br />Everything checkout should be.</h2>
        </Reveal>

        <div className="bento">
          {tiles.map((t, i) => (
            <Reveal
              key={t.title}
              delay={i * 80}
              className={`tile tile--${t.tone} ${t.size ? `tile--${t.size}` : ''}`}
            >
              <div className="tile__copy">
                <p className="tile__eyebrow">{t.eyebrow}</p>
                <h3 className="tile__title">
                  {t.title.split('\n').map((line, j) => (
                    <span key={j}>{line}<br /></span>
                  ))}
                </h3>
                <p className="tile__body">{t.body}</p>
              </div>
              <Art type={t.art} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
