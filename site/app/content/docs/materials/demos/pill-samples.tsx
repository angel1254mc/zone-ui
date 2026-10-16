import type { ReactNode } from 'react';
import { Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

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

export default function PillSamples() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: u(48) }}>
      <Sample name=".zzz-mat-pill">
        <div
          className="zzz-mat-pill"
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 'var(--zzz-size-control-pill-width)',
            height: 'var(--zzz-size-control-pill)',
          }}
        >
          <Text role="button" italic>
            View
          </Text>
        </div>
      </Sample>
      <Sample name="circle">
        <div
          className="zzz-mat-pill"
          style={{ width: 'var(--zzz-size-control-circle)', height: 'var(--zzz-size-control-circle)' }}
        />
      </Sample>
    </div>
  );
}
