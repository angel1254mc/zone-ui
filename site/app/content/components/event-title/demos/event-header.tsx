import { EventDescription, EventRibbon, EventTitle } from '@angel1254mc/zone-ui';

export default function EventHeader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        width: '100%',
        minWidth: 'max-content',
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        // Stands in for the event's key art.
        background: 'linear-gradient(160deg, #2e3b55, #50668c 60%, #3a4a68)',
      }}
    >
      <EventTitle size={47}>Beneath the Old Line</EventTitle>
      <EventRibbon style={{ marginTop: 'calc(23 * var(--zzz-px))' }}>Main Story Chapter 4 Unlocked</EventRibbon>
      <EventDescription style={{ marginTop: 'calc(32 * var(--zzz-px))' }}>
        {'The last train left years ago.\nFollow the tracks under the city\nand find out who still rides it.'}
      </EventDescription>
    </div>
  );
}
