import { Spinner } from '@angel1254mc/zone-ui';

export default function SpinnerHero() {
  return (
    <div style={{ display: 'flex', gap: 56, alignItems: 'center' }}>
      <Spinner size={64} />
      <Spinner variant="chevrons" size={64} />
    </div>
  );
}
