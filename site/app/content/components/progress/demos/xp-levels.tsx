import { XpBar } from '@angel1254mc/zone-ui';

export default function XpLevels() {
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <XpBar value={0} max={6000} />
      <XpBar value={2350} max={6000} />
      <XpBar value={6000} max={6000} />
    </div>
  );
}
