import { HatchBackground, Stage, Text } from '@angel1254mc/zone-ui';

export default function Letterbox() {
  return (
    <div
      style={{
        resize: 'both',
        overflow: 'hidden',
        width: 480,
        height: 320,
        minWidth: 160,
        minHeight: 120,
        maxWidth: '100%',
      }}
    >
      <Stage>
        <HatchBackground />
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <Text role="eventTitle" outline="event" style={{ fontSize: 'calc(140 * var(--zzz-px))' }}>
            1920 × 1080
          </Text>
        </div>
      </Stage>
    </div>
  );
}
