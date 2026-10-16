import type { CSSProperties, ReactNode } from 'react';
import { Text, usePressFlash } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const pill: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: 'var(--zzz-size-control-pill-width)',
  height: 'var(--zzz-size-control-pill)',
  padding: 0,
};

/** A custom button with the kit's pressed look: pointer presses use :active, keys use usePressFlash. */
function HoldButton({ children }: { children: ReactNode }) {
  const press = usePressFlash<HTMLButtonElement>();
  return (
    <button type="button" className="zzz-mat-pill zzz-pressable zzz-focusable" style={pill} {...press}>
      <Text role="button" italic>
        {children}
      </Text>
    </button>
  );
}

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

export default function PressableButton() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: u(48) }}>
      <Sample name="Press and hold, or Tab + Space">
        <HoldButton>Hold me</HoldButton>
      </Sample>
      <Sample name="[data-pressed]">
        <div className="zzz-mat-pill zzz-pressable" data-pressed="" style={pill}>
          <Text role="button" italic>
            Pressed
          </Text>
        </div>
      </Sample>
      <Sample name="--zzz-press-outset: 0">
        <div
          className="zzz-mat-pill zzz-pressable"
          data-pressed=""
          style={{ ...pill, ['--zzz-press-outset' as string]: '0px' }}
        >
          <Text role="button" italic>
            Confirm
          </Text>
        </div>
      </Sample>
    </div>
  );
}
