import { useEffect, useState } from 'react';

// Dark mode on/off switch.
// The choice is saved in this browser so it survives reloads. Until someone
// picks, the site follows the device's own light/dark setting.
// index.html applies the saved theme before the page appears, so there's no white flash.

const STORAGE_KEY = 'strawberry-pay-theme';

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage can be blocked (e.g. private browsing). The switch still works for this visit.
  }
}

// Keeps every toggle on the page in sync, even if there's more than one.
function useTheme() {
  const [theme, setTheme] = useState(currentTheme);
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(currentTheme()));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return [theme, (next) => applyTheme(next)];
}

const SUN = (
  <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
);
const MOON = <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />;

function Icon({ dark }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {dark ? MOON : SUN}
    </svg>
  );
}

// variant="icon": a small round button (top bars).
// variant="row":  a full-width menu row with a switch (dashboard side menu).
export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const [theme, setTheme] = useTheme();
  const dark = theme === 'dark';
  const toggle = () => setTheme(dark ? 'light' : 'dark');

  if (variant === 'row') {
    return (
      <button type="button" role="switch" aria-checked={dark} className={`side__item theme-row ${className}`} onClick={toggle}>
        <Icon dark={dark} />
        Dark mode
        <span className={`theme-switch ${dark ? 'is-on' : ''}`} aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`theme-icon ${className}`}
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Dark mode"
      title={dark ? 'Turn off dark mode' : 'Turn on dark mode'}
    >
      <Icon dark={dark} />
    </button>
  );
}
