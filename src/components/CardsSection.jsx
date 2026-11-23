import { useEffect, useRef, useState } from 'react';
import { NICKNAME_MAX, cardLabel } from '../cards.js';

// The "Your cards" part of the dashboard: shows each card with
// Rename and Remove buttons, and an "Add a card" button.
export default function CardsSection({ cards, onAddCard, onRename, onRemove }) {
  const [notice, setNotice] = useState('');

  // Hide the "Card removed" / "Card renamed" message after a few seconds.
  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(id);
  }, [notice]);

  return (
    <section id="cards" className="dash__panel dash__section">
      <div className="dash__panel-head">
        <h2>Your cards</h2>
        <button type="button" className="btn btn--sm" onClick={onAddCard}>
          Add a card
        </button>
      </div>

      <p className="acct__notice cards__notice" role="status" hidden={!notice}>
        ✓ {notice}
      </p>

      {cards.length === 0 ? (
        <div className="cards__empty">
          <p>No cards in your Wallet.</p>
          <button type="button" className="acct__link" onClick={onAddCard}>
            Add your first card
          </button>
        </div>
      ) : (
        <ul className="dash__cards">
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onRename={(nickname) => {
                onRename(card.id, nickname);
                setNotice('Card renamed.');
              }}
              onRemove={() => {
                onRemove(card.id);
                setNotice(`${cardLabel(card)} •••• ${card.last4} was removed.`);
              }}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function CardItem({ card, onRename, onRemove }) {
  // 'view' | 'rename' | 'confirm-remove'
  const [mode, setMode] = useState('view');
  const [draft, setDraft] = useState('');
  const inputRef = useRef(null);
  const label = cardLabel(card);

  useEffect(() => {
    if (mode === 'rename') inputRef.current?.select();
  }, [mode]);

  function startRename() {
    setDraft(label);
    setMode('rename');
  }

  function saveRename(event) {
    event.preventDefault();
    const next = draft.trim();
    // Saving an empty name goes back to the card's brand name.
    if (next !== label) onRename(next);
    setMode('view');
  }

  return (
    <li className="cards__item">
      <div className="dash__card" style={{ background: card.color }}>
        <div className="dash__card-top">
          <span className="dash__card-label">{label}</span>
          <span className="dash__card-brand">{card.brand}</span>
        </div>
        <span className="dash__card-number">•••• {card.last4}</span>
        <span className="dash__card-name">{card.name}</span>
      </div>

      {mode === 'view' && (
        <div className="cards__actions">
          <button type="button" className="acct__link" onClick={startRename} aria-label={`Rename ${label}`}>
            Rename
          </button>
          <button
            type="button"
            className="acct__link cards__danger"
            onClick={() => setMode('confirm-remove')}
            aria-label={`Remove ${label}`}
          >
            Remove
          </button>
        </div>
      )}

      {mode === 'rename' && (
        <form className="cards__rename" onSubmit={saveRename}>
          <label className="field">
            <span>Card nickname</span>
            <input
              ref={inputRef}
              value={draft}
              maxLength={NICKNAME_MAX}
              placeholder={card.brand}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setMode('view')}
            />
          </label>
          <div className="acct__buttons">
            <button type="button" className="acct__cancel" onClick={() => setMode('view')}>
              Cancel
            </button>
            <button type="submit" className="btn btn--sm">
              Save
            </button>
          </div>
        </form>
      )}

      {mode === 'confirm-remove' && (
        <div className="cards__confirm" role="alertdialog" aria-label={`Remove ${label}?`}>
          <p>
            Remove <strong>{label}</strong> •••• {card.last4} from Wallet?
          </p>
          <div className="acct__buttons">
            <button type="button" className="acct__cancel" onClick={() => setMode('view')} autoFocus>
              Cancel
            </button>
            <button type="button" className="btn btn--sm cards__remove-btn" onClick={onRemove}>
              Remove
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
