import { EventTitle } from '@angel1254mc/zone-ui';

export default function Alignment() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 24,
        width: '100%',
        minWidth: 'max-content',
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
      }}
    >
      <EventTitle as="h2" align="start">
        Signal Relay
      </EventTitle>
      <EventTitle as="h2" align="center">
        Arcade Night
      </EventTitle>
      <EventTitle as="h2" size={47}>
        Stamp Rally
      </EventTitle>
    </div>
  );
}
