import { useEffect, useState } from 'react';
import Logo from './Logo.jsx';
import SideMenu, { MENU_ITEMS } from './SideMenu.jsx';
import AccountSection from './AccountSection.jsx';
import CardsSection from './CardsSection.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { Link, navigate } from '../router.jsx';
import './Dashboard.css';

// Made-up purchases so the dashboard has something to show.
// daysAgo is turned into a real date relative to today.
const SAMPLE_ACTIVITY = [
  { merchant: 'Grove Market', category: 'Groceries', amount: 42.0, daysAgo: 0 },
  { merchant: 'Peel & Press Juice', category: 'Food & drink', amount: 7.5, daysAgo: 1 },
  { merchant: 'Metro Transit', category: 'Transport', amount: 2.75, daysAgo: 1 },
  { merchant: 'Zest Books', category: 'Shopping', amount: 18.99, daysAgo: 3 },
  { merchant: 'Rind Cinema', category: 'Entertainment', amount: 24.0, daysAgo: 5 },
  { merchant: 'Clementine Café', category: 'Food & drink', amount: 11.2, daysAgo: 8 },
];

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const shortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

function dayLabel(daysAgo) {
  if (daysAgo === 0) return 'Today';
  if (daysAgo === 1) return 'Yesterday';
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return shortDate.format(d);
}

// Works out which section is on screen so the side menu can highlight it:
// the last section whose top has scrolled past ~1/3 of the screen,
// or the final section once the page is scrolled to the bottom.
function useActiveSection(ids, enabled) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    if (!enabled) return;
    function update() {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(ids[ids.length - 1]);
        return;
      }
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight / 3) current = id;
      }
      setActive(current);
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [ids, enabled]);
  return active;
}

const SECTION_IDS = MENU_ITEMS.map((m) => m.id);

export default function Dashboard({ user, cards, onAddCard, onRenameCard, onRemoveCard, onSignOut, onUserChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS, !!user);

  // Only signed-in people can see the dashboard; everyone else goes to sign in.
  useEffect(() => {
    if (!user) navigate('/signin');
  }, [user]);

  useEffect(() => {
    document.title = 'Strawberry Pay Dashboard';
    return () => {
      document.title = 'Why Strawberry Pay';
    };
  }, []);

  if (!user) return null;

  const spent = SAMPLE_ACTIVITY.reduce((sum, t) => sum + t.amount, 0);
  const firstName = user.name.split(' ')[0];

  function handleSignOut() {
    onSignOut();
    navigate('/');
  }

  return (
    <div className="dash">
      <SideMenu
        user={user}
        active={active}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSignOut={handleSignOut}
      />

      {/* Top bar, only shown on small screens where the side menu is hidden */}
      <header className="dash__top">
        <button
          type="button"
          className="dash__menu-btn"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        <Link to="/" className="dash__brand" aria-label="Strawberry Pay home">
          <Logo size={20} />
        </Link>
        <ThemeToggle className="dash__top-theme" />
      </header>

      <main className="dash__main">
        <section id="overview" className="dash__section">
          <h1 className="dash__title">Hi, {firstName}</h1>
          <p className="dash__sub">Here's your Strawberry Pay activity. All of it is sample data.</p>

          <div className="dash__stats">
            <div className="dash__stat">
              <span>Spent in the last 7 days</span>
              <strong>{money.format(spent)}</strong>
            </div>
            <div className="dash__stat">
              <span>Payments</span>
              <strong>{SAMPLE_ACTIVITY.length}</strong>
            </div>
            <div className="dash__stat">
              <span>Cards in Wallet</span>
              <strong>{cards.length}</strong>
            </div>
          </div>
        </section>

        <CardsSection cards={cards} onAddCard={onAddCard} onRename={onRenameCard} onRemove={onRemoveCard} />

        <section id="activity" className="dash__panel dash__section">
          <div className="dash__panel-head">
            <h2>Recent activity</h2>
          </div>
          <ul className="dash__activity">
            {SAMPLE_ACTIVITY.map((t) => (
              <li key={t.merchant}>
                <span className="dash__avatar" aria-hidden="true">
                  {t.merchant[0]}
                </span>
                <div className="dash__activity-main">
                  <strong>{t.merchant}</strong>
                  <span>
                    {t.category} · {dayLabel(t.daysAgo)}
                  </span>
                </div>
                <span className="dash__amount">−{money.format(t.amount)}</span>
              </li>
            ))}
          </ul>
        </section>

        <AccountSection user={user} onUserChange={onUserChange} onSignOut={handleSignOut} />
      </main>
    </div>
  );
}
