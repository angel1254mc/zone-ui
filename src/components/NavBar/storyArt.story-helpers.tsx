/**
 * Story-only artwork for the web components (NavBar / SiteFooter stories). Original SVG, no brand
 * or game assets. Not exported from the library.
 */
import type { CSSProperties, ReactNode } from 'react';

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

/** Placeholder wordmark: three slanted bars + "ZZZ·UI". */
export function DemoLogo({ height = 54 }: { height?: number }) {
  return (
    <svg
      viewBox="0 0 230 54"
      style={{ height: gpx(height), width: 'auto', display: 'block' }}
      role="img"
      aria-label="Zone"
    >
      <g fill="currentColor">
        <path d="M6 44 22 10h14L20 44Z" />
        <path d="M30 44 46 10h14L44 44Z" opacity=".7" />
        <path d="M54 44 70 10h14L68 44Z" opacity=".45" />
      </g>
      <text x="96" y="38" fill="currentColor" fontSize="30" fontWeight="900" style={{ fontStretch: '125%' }}>
        ZZZ·UI
      </text>
    </svg>
  );
}

const glyph = (d: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
    {d}
  </svg>
);

/** Generic social glyphs (not brand logos). */
export const socialGlyphs = {
  video: glyph(
    <path
      d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5ZM10 8.5v7l6-3.5Z"
      fillRule="evenodd"
    />
  ),
  chat: glyph(<path d="M4 5h16v11H10l-5 4v-4H4Z" />),
  camera: glyph(<path d="M4 7h3.5L9 4.5h6L16.5 7H20v12H4Zm8 2.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" fillRule="evenodd" />),
  bolt: glyph(<path d="M13 2 4 14h6l-1 8 9-12h-6Z" />),
  note: glyph(<path d="M9 4h11v12.5a3 3 0 1 1-2-2.8V8h-7v10.5a3 3 0 1 1-2-2.8Z" />),
  link: glyph(
    <path d="M10 14a4 4 0 0 1 0-5.7l3-3a4 4 0 0 1 5.7 5.7l-1.5 1.5-1.4-1.4 1.5-1.5a2 2 0 0 0-2.9-2.9l-3 3a2 2 0 0 0 0 2.9Zm4-4a4 4 0 0 1 0 5.7l-3 3a4 4 0 0 1-5.7-5.7l1.5-1.5 1.4 1.4-1.5 1.5a2 2 0 0 0 2.9 2.9l3-3a2 2 0 0 0 0-2.9Z" />
  ),
};

export const demoSocial = [
  { label: 'Video channel', href: '#video', icon: socialGlyphs.video },
  { label: 'Community chat', href: '#chat', icon: socialGlyphs.chat },
  { label: 'Photo feed', href: '#photos', icon: socialGlyphs.camera },
  { label: 'Live streams', href: '#live', icon: socialGlyphs.bolt },
  { label: 'Soundtrack', href: '#music', icon: socialGlyphs.note },
  { label: 'Copy link', href: '#share', icon: socialGlyphs.link },
];

const circle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: gpx(44),
  height: gpx(44),
  padding: 0,
  border: 0,
  borderRadius: '50%',
  background: 'transparent',
  color: '#FFF',
  cursor: 'pointer',
};

/** Round header actions (disc with grey ring, account glyphs). */
export function DemoActions() {
  return (
    <>
      <button
        type="button"
        aria-label="Music"
        className="zzz-focusable"
        style={{
          ...circle,
          width: gpx(62),
          height: gpx(62),
          background: '#8F8F8F',
          border: `${gpx(4)} solid #BDBDBD`,
          color: '#2A2A2A',
        }}
      >
        <span style={{ width: gpx(34), height: gpx(34), display: 'flex' }}>{socialGlyphs.note}</span>
      </button>
      <button type="button" aria-label="Share" className="zzz-focusable" style={circle}>
        <svg
          viewBox="0 0 24 24"
          style={{ width: gpx(32), height: gpx(32) }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
        >
          <circle cx="7" cy="7" r="3.2" />
          <circle cx="17" cy="12" r="3.2" />
          <circle cx="7" cy="18" r="3.2" />
        </svg>
      </button>
      <button type="button" aria-label="Account" className="zzz-focusable" style={circle}>
        <svg
          viewBox="0 0 24 24"
          style={{ width: gpx(32), height: gpx(32) }}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
        >
          <circle cx="12" cy="7.5" r="4" />
          <path d="M4.5 21v-2.5A4.5 4.5 0 0 1 9 14h6a4.5 4.5 0 0 1 4.5 4.5V21Z" />
        </svg>
      </button>
    </>
  );
}
