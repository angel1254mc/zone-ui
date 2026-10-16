import { Button, EventTitle, GraffitiLayer, Stage, Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

export default function StageHero() {
  return (
    <Stage>
      <GraffitiLayer />
      <div
        style={{ position: 'absolute', left: u(160), top: u(320), display: 'grid', gap: u(36), justifyItems: 'start' }}
      >
        <EventTitle as="h2" align="start" size={120}>
          Hollow Zero Nights
        </EventTitle>
        <Text role="bodyXl" tone="secondary">
          Ranked runs and a fresh leaderboard every week.
        </Text>
        <Button size="lg">Start</Button>
      </div>
    </Stage>
  );
}
