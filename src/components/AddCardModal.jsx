import { useEffect, useRef, useState } from 'react';
import './AddCardModal.css';

// DEMO ONLY: nothing typed here is saved or sent anywhere.
// When the form is submitted, only the brand, last 4 digits, name and
// card colour go back to the page. The full number and CVC are thrown away.

const COLORS = [
  { id: 'strawberry', label: 'Strawberry', value: 'linear-gradient(135deg, #ff6b81, #e11d48)' },
  { id: 'midnight', label: 'Midnight', value: 'linear-gradient(135deg, #3a3a3c, #0b0b0c)' },
  { id: 'ocean', label: 'Ocean', value: 'linear-gradient(135deg, #4fa3ff, #0a4fd6)' },
  { id: 'mint', label: 'Mint', value: 'linear-gradient(135deg, #5fe0b0, #0f9d6e)' },
];

// Work out the card network from the first digits.
function detectBrand(digits) {
  if (/^4/.test(digits)) return 'Visa';
  if (/^3[47]/.test(digits)) return 'Amex';
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return 'Mastercard';
  if (/^6(011|5)/.test(digits)) return 'Discover';
  return 'Card';
}

// The Luhn checksum catches most typos in card numbers.
function passesLuhn(digits) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return sum % 10 === 0;
}

// Amex groups digits 4-6-5; every other brand uses groups of 4.
function formatNumber(digits) {
  if (detectBrand(digits) === 'Amex') {
    return [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean).join(' ');
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function validate({ name, number, expiry, cvc }) {
  const errors = {};
  const brand = detectBrand(number);

  if (!name.trim()) errors.name = 'Enter the name on the card.';

  const lengthOk = brand === 'Amex' ? number.length === 15 : number.length >= 13 && number.length <= 19;
  if (!lengthOk || !passesLuhn(number)) errors.number = 'Check the card number.';

  const m = expiry.match(/^(\d{2})\/(\d{2})$/);
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) {
    errors.expiry = 'Use MM/YY.';
  } else {
    // A card stays valid until the end of its expiry month.
    const endOfMonth = new Date(2000 + Number(m[2]), Number(m[1]), 1);
    if (endOfMonth <= new Date()) errors.expiry = 'This card has expired.';
  }

  const cvcLength = brand === 'Amex' ? 4 : 3;
  if (cvc.length !== cvcLength) errors.cvc = `Enter the ${cvcLength}-digit code.`;

  return errors;
}

const EMPTY = { name: '', number: '', expiry: '', cvc: '' };

export default function AddCardModal({ open, onClose, onAdd }) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState(EMPTY);
  const [color, setColor] = useState(COLORS[0]);
  const [errors, setErrors] = useState({});

  // Open and close the browser's built-in <dialog>. It handles focus and the Esc key.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Clear the form every time the dialog closes so card details don't linger.
  function handleClose() {
    setForm(EMPTY);
    setErrors({});
    setColor(COLORS[0]);
    onClose();
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleExpiry(raw) {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    update('expiry', digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onAdd({
      brand: detectBrand(form.number),
      last4: form.number.slice(-4),
      name: form.name.trim(),
      color: color.value,
    });
    handleClose();
  }

  const brand = detectBrand(form.number);
  const maxDigits = brand === 'Amex' ? 15 : 19;

  return (
    <dialog
      ref={dialogRef}
      className="addcard"
      aria-labelledby="addcard-title"
      onClose={handleClose}
      onClick={(e) => {
        // Clicking the dark backdrop (outside the panel) closes the dialog.
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <form className="addcard__panel" onSubmit={handleSubmit} noValidate autoComplete="off">
        <div className="addcard__head">
          <h2 id="addcard-title">Add a card</h2>
          <button type="button" className="addcard__close" onClick={handleClose} aria-label="Close">
            ×
          </button>
        </div>

        <p className="addcard__demo">
          This is a demo. Use a test number like <code>4242 4242 4242 4242</code>. Don't enter a real card.
        </p>

        {/* Live preview of the card being added */}
        <div className="addcard__preview" style={{ background: color.value }}>
          <span className="addcard__preview-brand">{brand}</span>
          <span className="addcard__preview-number">
            {form.number ? formatNumber(form.number) : '•••• •••• •••• ••••'}
          </span>
          <div className="addcard__preview-foot">
            <span>{form.name || 'YOUR NAME'}</span>
            <span>{form.expiry || 'MM/YY'}</span>
          </div>
        </div>

        <label className="field">
          <span>Name on card</span>
          <input
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            aria-invalid={!!errors.name}
          />
          {errors.name && <small>{errors.name}</small>}
        </label>

        <label className="field">
          <span>Card number</span>
          <input
            inputMode="numeric"
            value={formatNumber(form.number)}
            onChange={(e) => update('number', e.target.value.replace(/\D/g, '').slice(0, maxDigits))}
            placeholder="1234 5678 9012 3456"
            aria-invalid={!!errors.number}
          />
          {errors.number && <small>{errors.number}</small>}
        </label>

        <div className="field-row">
          <label className="field">
            <span>Expiry</span>
            <input
              inputMode="numeric"
              value={form.expiry}
              onChange={(e) => handleExpiry(e.target.value)}
              placeholder="MM/YY"
              aria-invalid={!!errors.expiry}
            />
            {errors.expiry && <small>{errors.expiry}</small>}
          </label>
          <label className="field">
            <span>Security code</span>
            <input
              inputMode="numeric"
              value={form.cvc}
              onChange={(e) => update('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
              placeholder={brand === 'Amex' ? '1234' : '123'}
              aria-invalid={!!errors.cvc}
            />
            {errors.cvc && <small>{errors.cvc}</small>}
          </label>
        </div>

        <fieldset className="addcard__colors">
          <legend>Card colour</legend>
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`swatch ${c.id === color.id ? 'is-selected' : ''}`}
              style={{ background: c.value }}
              onClick={() => setColor(c)}
              aria-label={c.label}
              aria-pressed={c.id === color.id}
            />
          ))}
        </fieldset>

        <button type="submit" className="btn addcard__submit">
          Add to Strawberry Pay
        </button>
      </form>
    </dialog>
  );
}
