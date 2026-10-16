import { Capsule, MaterialsCategoryIcon } from '@angel1254mc/zone-ui';

const costs = [
  { name: 'Alloy Plate', owned: 120, required: 60 },
  { name: 'Circuit Core', owned: 20, required: 60 },
  { name: 'Signal Chip', owned: 3, required: 5 },
];

export default function CraftingCosts() {
  return (
    <ul
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
        margin: 0,
        padding: 24,
        listStyle: 'none',
        borderRadius: 16,
        background: '#1a1a1a',
      }}
    >
      {costs.map(({ name, owned, required }) => {
        const short = owned < required;
        return (
          <li
            key={name}
            aria-label={`${name}: ${owned} of ${required}`}
            style={{ display: 'grid', gap: 'calc(8 * var(--zzz-px))', width: 'calc(104 * var(--zzz-px))' }}
          >
            <div
              style={{
                display: 'grid',
                placeItems: 'center',
                aspectRatio: '1',
                borderRadius: 'calc(10 * var(--zzz-px))',
                background: '#000',
                color: '#fff',
              }}
            >
              <MaterialsCategoryIcon size={48} />
            </div>
            <Capsule size="lg">
              {short ? <span style={{ color: 'var(--zzz-color-danger-text)' }}>{owned}</span> : owned}/{required}
            </Capsule>
          </li>
        );
      })}
    </ul>
  );
}
