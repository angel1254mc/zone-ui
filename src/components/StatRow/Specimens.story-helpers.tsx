// Storybook-only layout helpers. Not exported from the package.
import type { CSSProperties, ReactNode } from 'react';

const gpx = (n: number) => `calc(${n} * var(--zzz-px))`;

const caption: CSSProperties = {
  fontSize: 'var(--zzz-font-size-micro)',
  lineHeight: 'var(--zzz-line-height-single)',
  color: 'var(--zzz-color-text-muted)',
};

/** Plain row of labelled specimens for variant/state stories. */
export function Specimens({
  children,
  gap = 24,
  column = false,
}: {
  children: ReactNode;
  gap?: number;
  column?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: column ? 'column' : 'row',
        flexWrap: 'wrap',
        gap: gpx(gap),
        alignItems: column ? 'flex-start' : 'center',
      }}
    >
      {children}
    </div>
  );
}

export function Specimen({ label, children, bg }: { label: string; children: ReactNode; bg?: string }) {
  return (
    <figure
      style={{
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: gpx(8),
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          padding: bg ? gpx(16) : 0,
          background: bg,
          borderRadius: bg ? gpx(8) : 0,
        }}
      >
        {children}
      </div>
      <figcaption style={caption}>{label}</figcaption>
    </figure>
  );
}
