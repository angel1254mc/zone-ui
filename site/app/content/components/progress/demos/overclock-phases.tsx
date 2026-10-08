import { OverclockBar } from '@angel1254mc/zone-ui';

const phases = [
  { current: 0, next: 1 },
  { current: 2, next: 3 },
  { current: 4, next: 5 },
  { current: 5, next: 5 },
];

export default function OverclockPhases() {
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      {phases.map((p) => (
        <OverclockBar key={`${p.current}-${p.next}`} current={p.current} next={p.next} />
      ))}
    </div>
  );
}
