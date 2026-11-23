import { useState } from 'react';
import Logo from './Logo.jsx';
import { Link } from '../router.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import Avatar from './Avatar.jsx';
import './Nav.css';

const links = [
  { href: '#benefits', label: 'Why Strawberry Pay' },
  { href: '#security', label: 'Security' },
  { href: '#how', label: 'How It Works' },
  { href: '#accept', label: 'For Business' },
  { href: '#faq', label: 'FAQ' },
];

export default function Nav({ user, onSignOut }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={`globalnav ${open ? 'is-open' : ''}`}>
        <nav className="globalnav__inner" aria-label="Global">
          <a href="#top" className="globalnav__brand" aria-label="Strawberry Pay home">
            <Logo size={18} />
          </a>
          <ul className="globalnav__links">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="globalnav__end">
            <ThemeToggle />
            {user ? (
              <div className="globalnav__account">
                <Link to="/dashboard" className="globalnav__hello" title="Go to your dashboard">
                  <Avatar user={user} size={22} />
                  Hi, {user.name.split(' ')[0]}
                </Link>
                <button type="button" className="globalnav__signout" onClick={onSignOut}>
                  Sign out
                </button>
              </div>
            ) : (
              <div className="globalnav__account">
                <Link to="/signin" className="globalnav__signin">Sign in</Link>
                <Link to="/signup" className="btn btn--sm">Sign up</Link>
              </div>
            )}
            <button
              className="globalnav__toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </nav>
      </header>

      {/* Secondary "local nav" — sticky product bar */}
      <div className="localnav">
        <div className="localnav__inner">
          <span className="localnav__title">Strawberry Pay</span>
          <div className="localnav__right">
            <a href="#how" className="localnav__link">Overview</a>
            <a href="#accept" className="localnav__link">Merchants</a>
            <a href="#get-started" className="btn btn--sm">Get started</a>
          </div>
        </div>
      </div>
    </>
  );
}
