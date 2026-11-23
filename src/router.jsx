import { useEffect, useState } from 'react';

// A tiny router: the page shown depends on the URL path (/, /signin, /signup).
// The links that start with "#" still scroll within the home page as before.

export function navigate(path) {
  if (path === window.location.pathname) return;
  window.history.pushState({}, '', path);
  // Tell useRoute() listeners that the path changed.
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

export function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onChange = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onChange); // also fires on Back/Forward
    return () => window.removeEventListener('popstate', onChange);
  }, []);
  return path;
}

// Use in place of <a> for links to another page. It changes the page without a full reload.
export function Link({ to, onClick, ...rest }) {
  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e);
        // Let ctrl/cmd-click still open the link in a new tab.
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        navigate(to);
      }}
      {...rest}
    />
  );
}
