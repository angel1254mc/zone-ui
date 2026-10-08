import { HatchBackground, Stage, Text } from '@angel1254mc/zone-ui';

export default function Ultrawide() {
  return (
    <Stage width={2520} height={1080}>
      <HatchBackground />
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <Text role="eventTitle" outline="event" style={{ fontSize: 'calc(140 * var(--zzz-px))' }}>
          2520 × 1080
        </Text>
      </div>
    </Stage>
  );
}
