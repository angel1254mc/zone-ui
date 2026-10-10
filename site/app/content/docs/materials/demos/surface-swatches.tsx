import { Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const SURFACES = ['zzz-mat-textured', 'zzz-mat-textured zzz-mat-textured--body', 'zzz-mat-drawer', 'zzz-bg-hatch'];

export default function SurfaceSwatches() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${u(260)}, 1fr))`,
        gap: u(28),
        width: '100%',
      }}
    >
      {SURFACES.map((classes) => (
        <figure key={classes} style={{ display: 'grid', gap: u(12), margin: 0 }}>
          <div className={classes} style={{ height: u(170), borderRadius: u(12) }} />
          <figcaption>
            <Text role="label" tone="muted">
              .{classes.split(' ').at(-1)}
            </Text>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
