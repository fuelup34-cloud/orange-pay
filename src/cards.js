// Helpers for the demo cards in Wallet.
//
// A card looks like:
//   { id, brand, last4, name, nickname, color }
//   brand    – network, e.g. "Visa"
//   name     – the cardholder's name
//   nickname – the label the user chose (falls back to the brand)

export const NICKNAME_MAX = 24;

// Every visitor starts with this sample card. It can be renamed or removed like any other.
export const SAMPLE_CARD = {
  id: 'sample',
  brand: 'Visa',
  last4: '4821',
  name: 'Sample card',
  nickname: 'Citrus Card',
  color: 'linear-gradient(135deg, #ff6b81, #e11d48)',
};

export function makeCardId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// What to call a card on screen.
export function cardLabel(card) {
  return card.nickname?.trim() || card.brand;
}
