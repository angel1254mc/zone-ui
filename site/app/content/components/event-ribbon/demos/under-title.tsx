import { EventRibbon, EventTitle } from '@angel1254mc/zone-ui';

export default function UnderTitle() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 'calc(23 * var(--zzz-px))',
        width: '100%',
        minWidth: 'max-content',
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        background: 'linear-gradient(160deg, #2e3b55, #50668c 60%, #3a4a68)',
      }}
    >
      <EventTitle size={47}>Beneath the Old Line</EventTitle>
      <EventRibbon>Main Story Chapter 4 Unlocked</EventRibbon>
    </div>
  );
}
