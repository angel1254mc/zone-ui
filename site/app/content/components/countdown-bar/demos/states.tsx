import { CountdownBar } from '@angel1254mc/zone-ui';

export default function States() {
  return (
    <div style={{ display: 'grid', gap: 24, width: '100%', maxWidth: 560 }}>
      <CountdownBar durationMs={30_000} secondsLeft={22} />
      <CountdownBar durationMs={30_000} secondsLeft={8} />
      <CountdownBar durationMs={30_000} secondsLeft={2} />
      <CountdownBar durationMs={30_000} secondsLeft={0} expiredLabel="Too slow!" />
    </div>
  );
}
