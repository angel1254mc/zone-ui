import {
  CombatBadge,
  NewBadge,
  RankBadge,
  RankCoin,
  SlotHexBadge,
  StatusCheck,
  StorageIcon,
} from '@angel1254mc/zone-ui';

export default function BadgesHero() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 36 }}>
      <div
        style={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
          width: 'calc(120 * var(--zzz-px))',
          height: 'calc(120 * var(--zzz-px))',
          borderRadius: 'calc(10 * var(--zzz-px))',
          background: '#292929',
          color: '#fff',
        }}
      >
        <StorageIcon size={64} />
        <NewBadge />
      </div>
      <RankBadge rank="S" size={64} />
      <RankCoin rank="S" size={52} />
      <RankCoin rank="A" size={52} />
      <CombatBadge size={56} />
      <SlotHexBadge slot={4} />
      <StatusCheck />
    </div>
  );
}
