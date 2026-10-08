import { DriveDiscCategoryIcon, NewBadge, SlotHexBadge, StorageIcon } from '@angel1254mc/zone-ui';

const tile = {
  position: 'relative',
  display: 'grid',
  placeItems: 'center',
  width: 'calc(120 * var(--zzz-px))',
  height: 'calc(120 * var(--zzz-px))',
  borderRadius: 'calc(10 * var(--zzz-px))',
  background: '#292929',
  color: '#fff',
} as const;

export default function OnCorners() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>
      {/* NEW! hangs past the top-right corner by default. */}
      <div style={tile}>
        <StorageIcon size={64} />
        <NewBadge />
      </div>

      {/* Move it to the other corner and nudge it with an offset in design units. */}
      <div style={tile}>
        <StorageIcon size={64} />
        <NewBadge placement="top-left" offset={[12, 10]} />
      </div>

      {/* A gear card with its slot number on the top-left corner. */}
      <div style={{ ...tile, border: 'calc(4 * var(--zzz-px)) solid var(--zzz-color-rarity-s)', background: '#000' }}>
        <DriveDiscCategoryIcon size={56} />
        <SlotHexBadge slot={2} placement="top-left" />
      </div>
    </div>
  );
}
