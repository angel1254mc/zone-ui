import { ClockIcon, InfoAlertIcon, InfoPill } from '@angel1254mc/zone-ui';

export default function InfoPillHero() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 11,
        padding: 24,
        borderRadius: 16,
        // Stands in for the event's key art.
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
      }}
    >
      <InfoPill icon={<ClockIcon />}>66d</InfoPill>
      <InfoPill icon={<InfoAlertIcon />} onClick={() => {}}>
        Event Details
      </InfoPill>
    </div>
  );
}
