import { EventDescription } from '@angel1254mc/zone-ui';

export default function EventDescriptionHero() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 700,
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        // Stands in for the event's key art.
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
      }}
    >
      <EventDescription>
        {
          'The lanterns are up and the stalls\nare open! Play mini-games around\nthe night market to earn tickets\nand trade them for a limited outfit.'
        }
      </EventDescription>
    </div>
  );
}
