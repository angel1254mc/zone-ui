import { DennyIcon, FilterIcon, FireIcon, SearchIcon, StarIcon, Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

export default function IconColors() {
  return (
    <div style={{ display: 'grid', gap: u(28), justifyItems: 'start' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: u(28) }}>
        <FilterIcon size={45} />
        <FilterIcon size={45} style={{ color: 'var(--zzz-color-text-muted)' }} />
        <FilterIcon size={45} style={{ color: 'var(--zzz-accent)' }} />
        <FilterIcon size={45} style={{ color: 'var(--zzz-color-danger-text)' }} />
        <span
          style={{
            display: 'inline-flex',
            gap: u(14),
            padding: `${u(10)} ${u(22)}`,
            borderRadius: 'var(--zzz-radius-pill)',
            background: 'var(--zzz-accent)',
            color: 'var(--zzz-color-accent-on)',
          }}
        >
          <SearchIcon size={34} />
          <StarIcon size={34} />
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: u(28) }}>
        <FireIcon size={45} />
        <DennyIcon size={45} />
        <Text role="label" tone="muted">
          Own palette: colour has no effect
        </Text>
      </div>
    </div>
  );
}
