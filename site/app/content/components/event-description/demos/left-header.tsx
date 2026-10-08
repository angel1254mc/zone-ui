import { ClockIcon, EventDescription, EventTitle, InfoPill } from '@angel1254mc/zone-ui';

export default function LeftHeader() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 16,
        width: '100%',
        padding: 24,
        boxSizing: 'border-box',
        borderRadius: 16,
        background: 'linear-gradient(200deg, #2e3b55, #50668c 60%, #3a4a68)',
      }}
    >
      <EventTitle align="start">Signal Relay</EventTitle>
      <InfoPill icon={<ClockIcon />}>9d</InfoPill>
      <EventDescription align="start">
        {
          'Restore the relay towers across\nthe city before the storm hits,\nand claim rewards for every\ntower you bring online.'
        }
      </EventDescription>
    </div>
  );
}
