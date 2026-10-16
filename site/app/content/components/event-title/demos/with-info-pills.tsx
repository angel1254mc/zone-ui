import { ClockIcon, EventDescription, EventTitle, InfoAlertIcon, InfoPill } from '@angel1254mc/zone-ui';

export default function WithInfoPills() {
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
        background: 'linear-gradient(100deg, #e9f4f2, #f4d9e3 55%, #f6e7ec)',
      }}
    >
      <EventTitle>Night Market Festival</EventTitle>
      <div style={{ display: 'flex', gap: 'calc(4 * var(--zzz-px))', marginTop: 'calc(24 * var(--zzz-px))' }}>
        <InfoPill icon={<ClockIcon />}>12d</InfoPill>
        <InfoPill icon={<InfoAlertIcon />} onClick={() => {}}>
          Event Details
        </InfoPill>
      </div>
      <EventDescription style={{ marginTop: 'calc(12 * var(--zzz-px))' }}>
        {
          'The lanterns are up and the stalls\nare open! Play mini-games around\nthe night market to earn tickets\nand trade them for a limited outfit.'
        }
      </EventDescription>
    </div>
  );
}
