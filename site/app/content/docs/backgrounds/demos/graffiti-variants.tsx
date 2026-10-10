import { GraffitiLayer, Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

export default function GraffitiVariants() {
  return (
    <div style={{ display: 'grid' }}>
      {/* variant="agent": over pure black */}
      <div style={{ position: 'relative', height: u(520), overflow: 'hidden', background: '#000' }}>
        <GraffitiLayer />
        <div style={{ position: 'relative', padding: u(28) }}>
          <Text role="label" tone="muted">
            variant="agent"
          </Text>
        </div>
      </div>
      {/* variant="dialog": inside a dialog band, drifting */}
      <div style={{ padding: `${u(80)} 0`, background: '#101010' }}>
        <div
          style={{
            position: 'relative',
            height: u(300),
            overflow: 'hidden',
            background: 'var(--zzz-color-surface-dialog-band)',
          }}
        >
          <GraffitiLayer variant="dialog" drift />
          <div style={{ position: 'relative', padding: u(28) }}>
            <Text role="label" tone="muted">
              variant="dialog" drift
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
