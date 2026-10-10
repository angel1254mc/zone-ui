import type { CSSProperties, ReactNode } from 'react';
import { Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const pill: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: 'var(--zzz-size-control-pill-width)',
  height: 'var(--zzz-size-control-pill)',
};

function Sample({ name, children }: { name: string; children: ReactNode }) {
  return (
    <figure style={{ display: 'grid', justifyItems: 'start', gap: u(14), margin: 0 }}>
      {children}
      <figcaption>
        <Text role="label" tone="muted">
          {name}
        </Text>
      </figcaption>
    </figure>
  );
}

export default function AccentStates() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: u(48) }}>
      <Sample name=".zzz-accent-fill">
        <div className="zzz-mat-pill zzz-accent-fill" style={pill}>
          <Text role="button" italic>
            Craft
          </Text>
        </div>
      </Sample>
      <Sample name=".zzz-accent-ring">
        <div className="zzz-mat-pill zzz-accent-ring" style={pill}>
          <Text role="button" italic>
            Base
          </Text>
        </div>
      </Sample>
    </div>
  );
}
