import { HomeIcon, Text } from '@angel1254mc/zone-ui';

const sizes = [14, 22, 28, 34, 45, 60];

export default function IconSizes() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: 'calc(32 * var(--zzz-px))' }}>
      {sizes.map((size) => (
        <div key={size} style={{ display: 'grid', justifyItems: 'center', gap: 'calc(10 * var(--zzz-px))' }}>
          <HomeIcon size={size} />
          <Text role="label" tone="muted">
            {size}
          </Text>
        </div>
      ))}
      <div style={{ display: 'grid', justifyItems: 'center', gap: 'calc(10 * var(--zzz-px))' }}>
        <span style={{ fontSize: 'calc(40 * var(--zzz-px))', lineHeight: 1 }}>
          <HomeIcon />
        </span>
        <Text role="label" tone="muted">
          1em
        </Text>
      </div>
    </div>
  );
}
