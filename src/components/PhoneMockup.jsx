import Logo from './Logo.jsx';
import { cardLabel } from '../cards.js';
import './PhoneMockup.css';

// Shown on the phone when Wallet has no cards.
const FALLBACK_CARD = { brand: 'Citrus Card', last4: '4821', color: null };

// A CSS-drawn phone showing a Strawberry Pay checkout sheet.
export default function PhoneMockup({ done = false, card }) {
  const shown = card ?? FALLBACK_CARD;
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone__screen">
        <div className="phone__island" />
        <div className="phone__store">
          <div className="phone__product" />
          <div className="phone__lines">
            <span style={{ width: '70%' }} />
            <span style={{ width: '45%' }} />
          </div>
        </div>

        <div className="sheet">
          <div className="sheet__head">
            <Logo size={20} color="#1d1d1f" />
            <span className="sheet__cancel">Cancel</span>
          </div>
          <div className="sheet__card">
            <div className="mini-card" style={shown.color ? { background: shown.color } : undefined} />
            <div>
              <div className="sheet__label">{cardLabel(shown)}</div>
              <div className="sheet__muted">•••• {shown.last4}</div>
            </div>
          </div>
          <div className="sheet__row">
            <span className="sheet__muted">Ship to</span>
            <span>Home</span>
          </div>
          <div className="sheet__row">
            <span className="sheet__muted">Contact</span>
            <span>you@example.com</span>
          </div>
          <div className="sheet__total">
            <span>Pay Grove Market</span>
            <strong>$42.00</strong>
          </div>
          <div className={`sheet__confirm ${done ? 'is-done' : ''}`}>
            <span className="sheet__check">✓</span>
            <span className="sheet__confirm-text">{done ? 'Done' : 'Confirm with Side Button'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
