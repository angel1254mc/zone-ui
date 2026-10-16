import { EventTitle } from '@angel1254mc/zone-ui';

export default function EventTitleHero() {
  return (
    <div
      style={{
        width: '100%',
        minWidth: 'max-content',
        maxWidth: 700,
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        // Stands in for the event's key art.
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
      }}
    >
      <EventTitle>Night Market Festival</EventTitle>
    </div>
  );
}
