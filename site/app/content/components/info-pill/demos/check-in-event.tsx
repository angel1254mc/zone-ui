import { ClockIcon, EventTitle, InfoAlertIcon, InfoPill } from '@angel1254mc/zone-ui';

export default function CheckInEvent() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 'calc(24 * var(--zzz-px))',
        width: '100%',
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        background: 'linear-gradient(160deg, #2e3b55, #50668c 60%, #3a4a68)',
      }}
    >
      <EventTitle as="h2">Stamp Rally</EventTitle>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 'calc(4 * var(--zzz-px))' }}>
        <InfoPill icon={<ClockIcon />}>7d</InfoPill>
        <InfoPill icon={<InfoAlertIcon />} onClick={() => {}}>
          Check-In Event
        </InfoPill>
        <InfoPill>Limited Time</InfoPill>
      </div>
    </div>
  );
}
