import { useId } from 'react';

export default function Logo({ size = 20, color = 'currentColor' }) {
  // Each logo on the page needs its own gradient id.
  const gradientId = `logo-bg-${useId().replace(/:/g, '')}`;
  return (
    <span className="logo" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color }}>
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        {/* App-style icon: a white strawberry with a green top on a red rounded square */}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff6b81" />
            <stop offset="0.55" stopColor="#f43f5e" />
            <stop offset="1" stopColor="#c8102e" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
        <path d="M16 11.2c5.3 0 8.6 2.4 8.6 6 0 4.3-4.4 8.6-8.6 10.3-4.2-1.7-8.6-6-8.6-10.3 0-3.6 3.3-6 8.6-6z" fill="#fff" />
        {/* seeds */}
        <g fill="#f43f5e">
          <ellipse cx="12.2" cy="15.6" rx=".7" ry="1" />
          <ellipse cx="16" cy="15.2" rx=".7" ry="1" />
          <ellipse cx="19.8" cy="15.6" rx=".7" ry="1" />
          <ellipse cx="14" cy="19" rx=".7" ry="1" />
          <ellipse cx="18" cy="19" rx=".7" ry="1" />
          <ellipse cx="16" cy="22.6" rx=".7" ry="1" />
        </g>
        {/* leafy top */}
        <path d="M16 12.6l-2.2-1.8-3.4.9 1.9-2.2-1.4-2.6 3.1 1.2L16 5.4l2 2.7 3.1-1.2-1.4 2.6 1.9 2.2-3.4-.9z" fill="#2fbf5b" />
      </svg>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: size * 0.9, letterSpacing: '-0.02em' }}>
        Pay
      </span>
    </span>
  );
}
