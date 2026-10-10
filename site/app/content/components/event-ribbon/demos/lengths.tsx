import { EventRibbon } from '@angel1254mc/zone-ui';

export default function Lengths() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 20,
        justifyItems: 'end',
        width: '100%',
        minWidth: 'max-content',
        boxSizing: 'border-box',
        padding: 24,
        borderRadius: 16,
        background: 'linear-gradient(160deg, #2e3b55, #50668c 60%, #3a4a68)',
      }}
    >
      <EventRibbon>New Chapter</EventRibbon>
      <EventRibbon>Limited-Time Event</EventRibbon>
      <EventRibbon>Version 2.3 Main Story Chapter 4 Unlocked</EventRibbon>
    </div>
  );
}
