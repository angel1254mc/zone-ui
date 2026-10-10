import type { ReactNode } from 'react';
import { GiftIcon, HourglassIcon, RecommendBadge, StatusCheck, TargetLoopIcon, Text } from '@angel1254mc/zone-ui';

function EventRow({ icon, badge, title }: { icon: ReactNode; badge?: ReactNode; title: string }) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'calc(16 * var(--zzz-px))',
        padding: 'calc(12 * var(--zzz-px)) calc(18 * var(--zzz-px))',
        background: '#1f1f1f',
      }}
    >
      <span style={{ position: 'relative', display: 'inline-grid', placeItems: 'center' }}>
        {icon}
        {badge}
      </span>
      <Text italic>{title}</Text>
    </li>
  );
}

export default function ListRows() {
  return (
    <ul style={{ display: 'grid', gap: 4, width: '100%', maxWidth: 340, margin: 0, padding: 0, listStyle: 'none' }}>
      <EventRow
        icon={<TargetLoopIcon size={32} />}
        badge={<RecommendBadge placement="top-left" />}
        title="Weekly Bounty"
      />
      <EventRow icon={<HourglassIcon size={32} />} badge={<StatusCheck placement="top-left" />} title="Arcade Night" />
      <EventRow icon={<GiftIcon size={32} />} title="Daily Check-In" />
    </ul>
  );
}
