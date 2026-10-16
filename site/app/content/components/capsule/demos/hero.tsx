import type { ReactNode } from 'react';
import { Capsule, DriveDiscCategoryIcon, MaterialsCategoryIcon, WEngineCategoryIcon } from '@angel1254mc/zone-ui';

function Tile({ icon, rarity, children }: { icon: ReactNode; rarity: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: 'calc(10 * var(--zzz-px))', width: 'calc(118 * var(--zzz-px))' }}>
      <div
        style={{
          display: 'grid',
          placeItems: 'center',
          aspectRatio: '1',
          borderRadius: 'calc(12 * var(--zzz-px))',
          border: 'calc(4 * var(--zzz-px)) solid #404040',
          borderBottom: `calc(15 * var(--zzz-px)) solid ${rarity}`,
          background: '#000',
          color: '#fff',
        }}
      >
        {icon}
      </div>
      {children}
    </div>
  );
}

export default function CapsuleHero() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 24,
        padding: 24,
        borderRadius: 16,
        background: '#1a1a1a',
      }}
    >
      <Tile icon={<WEngineCategoryIcon size={56} />} rarity="var(--zzz-color-rarity-s)">
        <Capsule>Lv. 60</Capsule>
      </Tile>
      <Tile icon={<MaterialsCategoryIcon size={56} />} rarity="var(--zzz-color-rarity-a)">
        <Capsule>×30</Capsule>
      </Tile>
      <Tile icon={<DriveDiscCategoryIcon size={56} />} rarity="var(--zzz-color-rarity-b)">
        <Capsule>Lv. 15</Capsule>
      </Tile>
    </div>
  );
}
