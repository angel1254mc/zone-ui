import { useState } from 'react';
import { ClockIcon, EventCtaButton, EventTitle, InfoPill } from '@angel1254mc/zone-ui';

export default function OnEventArt() {
  const [entered, setEntered] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 32,
        width: '100%',
        minWidth: 'max-content',
        minHeight: 300,
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        // Stands in for the event's key art.
        background: 'linear-gradient(160deg, #2e3b55, #50668c 60%, #3a4a68)',
      }}
    >
      <EventTitle as="h2">Night Market Festival</EventTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 16 }}>
        <InfoPill icon={<ClockIcon />}>{entered ? 'Entered' : '12d'}</InfoPill>
        <EventCtaButton onClick={() => setEntered(true)}>Go</EventCtaButton>
      </div>
    </div>
  );
}
