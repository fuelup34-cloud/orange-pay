import { useEffect } from 'react';
import Logo from './Logo.jsx';
import { Link } from '../router.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import Avatar from './Avatar.jsx';

// Simple line icons drawn with SVG so no icon library is needed.
const ICONS = {
  overview: <path d="M4 13h6V4H4v9zm0 7h6v-5H4v5zm10 0h6v-9h-6v9zm0-16v5h6V4h-6z" />,
  cards: <path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11zM3 9.5h18M6.5 15h4" />,
  activity: <path d="M3 12h4l3-7 4 14 3-7h4" />,
  account: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0" />,
  home: <path d="M4 11l8-7 8 7M6 9.5V20h12V9.5" />,
  signout: <path d="M10 5H5v14h5M14 8l4 4-4 4M18 12H9" />,
};

function Icon({ name }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

export const MENU_ITEMS = [
  { id: 'overview', label: 'Overview' },
  { id: 'cards', label: 'Cards' },
  { id: 'activity', label: 'Activity' },
  { id: 'account', label: 'Account' },
];

// The dashboard's side menu. On wide screens it's always visible;
// on phones it slides in as a drawer when `open` is true.
export default function SideMenu({ user, active, open, onClose, onSignOut }) {
  // Close the drawer with the Esc key.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <>
      <div className={`side__backdrop ${open ? 'is-open' : ''}`} onClick={onClose} aria-hidden="true" />
      <aside className={`side ${open ? 'is-open' : ''}`} aria-label="Dashboard menu">
        <Link to="/" className="side__brand" aria-label="Strawberry Pay home">
          <Logo size={22} />
        </Link>

        <nav className="side__nav">
          {MENU_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`side__item ${active === item.id ? 'is-active' : ''}`}
              aria-current={active === item.id ? 'true' : undefined}
              onClick={onClose}
            >
              <Icon name={item.id} />
              {item.label}
            </a>
          ))}
        </nav>

        <div className="side__foot">
          <div className="side__user">
            <Avatar user={user} size={34} />
            <div className="side__user-text">
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          </div>
          <ThemeToggle variant="row" />
          <Link to="/" className="side__item">
            <Icon name="home" />
            Back to site
          </Link>
          <button type="button" className="side__item side__signout" onClick={onSignOut}>
            <Icon name="signout" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
