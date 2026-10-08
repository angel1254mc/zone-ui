import { useState } from 'react';
import { ClockIcon, InfoAlertIcon, InfoPill } from '@angel1254mc/zone-ui';

export default function EventDetails() {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        display: 'grid',
        gap: 16,
        justifyItems: 'start',
        width: '100%',
        maxWidth: 520,
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
        color: '#222',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 11 }}>
        <InfoPill icon={<ClockIcon />}>25d</InfoPill>
        <InfoPill
          icon={<InfoAlertIcon />}
          aria-expanded={open}
          aria-controls="event-rules"
          onClick={() => setOpen((o) => !o)}
        >
          Event Details
        </InfoPill>
      </div>
      <p id="event-rules" hidden={!open} style={{ margin: 0 }}>
        Check in once a day for 7 days. Missed days can be made up with a Check-In Card until the event ends.
      </p>
    </div>
  );
}
