import { Capsule, DriveDiscCategoryIcon } from '@angel1254mc/zone-ui';

const slots = [{ level: 15 }, { level: 12 }, { level: null }, { level: null }];

export default function EquipmentSlots() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 20,
        padding: 24,
        borderRadius: 16,
        background: '#1a1a1a',
      }}
    >
      {slots.map((slot, i) => (
        <div key={i} style={{ display: 'grid', gap: 'calc(9 * var(--zzz-px))', width: 'calc(96 * var(--zzz-px))' }}>
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              aspectRatio: '1',
              borderRadius: 'calc(10 * var(--zzz-px))',
              border: `calc(4 * var(--zzz-px)) solid ${slot.level ? '#404040' : '#2c2c2c'}`,
              background: '#000',
              color: slot.level ? '#fff' : '#333',
            }}
          >
            <DriveDiscCategoryIcon size={44} />
          </div>
          {slot.level ? <Capsule>Lv. {slot.level}</Capsule> : <Capsule tone="empty" size="sm" />}
        </div>
      ))}
    </div>
  );
}
