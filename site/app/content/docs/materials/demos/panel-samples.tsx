import type { ReactNode } from 'react';
import { Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

function Sample({ name, children }: { name: string; children: ReactNode }) {
  return (
    <figure style={{ display: 'grid', gap: u(18), margin: 0 }}>
      {children}
      <figcaption>
        <Text role="label" tone="muted">
          {name}
        </Text>
      </figcaption>
    </figure>
  );
}

/** The ring is drawn outside the box: a 360 × 240 panel with a 5-unit ring is a 350 × 230 element. */
export default function PanelSamples() {
  return (
    <div
      className="zzz-bg-hatch"
      style={{ display: 'flex', flexWrap: 'wrap', gap: u(44), padding: u(28), borderRadius: u(16) }}
    >
      <Sample name=".zzz-mat-panel + .zzz-mat-textured header">
        <div className="zzz-mat-panel" style={{ width: u(350), height: u(230), margin: u(5), overflow: 'hidden' }}>
          <div className="zzz-mat-textured" style={{ height: u(52) }} />
        </div>
      </Sample>
      <Sample name=".zzz-mat-panel--large">
        <div className="zzz-mat-panel zzz-mat-panel--large" style={{ width: u(352), height: u(232), margin: u(4) }} />
      </Sample>
    </div>
  );
}
