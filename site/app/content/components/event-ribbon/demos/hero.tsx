import { EventRibbon } from '@angel1254mc/zone-ui';

export default function EventRibbonHero() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        minWidth: 'max-content',
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        // Stands in for the event's key art.
        background: 'linear-gradient(160deg, #2e3b55, #50668c 60%, #3a4a68)',
      }}
    >
      <EventRibbon>Main Story Chapter 4 Unlocked</EventRibbon>
    </div>
  );
}
