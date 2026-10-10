import { Spinner } from '@angel1254mc/zone-ui';

export default function TonesAndSizes() {
  return (
    <div style={{ display: 'grid', gap: 32, justifyItems: 'center' }}>
      <div style={{ display: 'flex', gap: 40, alignItems: 'center' }}>
        <Spinner />
        <Spinner tone="white" />
        <span style={{ color: 'var(--zzz-color-sage-base)' }}>
          <Spinner tone="current" />
        </span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Spinner size={22} />
        <Spinner size={40} />
        <Spinner size={80} />
        <Spinner variant="chevrons" size={22} />
        <Spinner variant="chevrons" size={44} />
        <Spinner variant="chevrons" size={88} />
      </div>
    </div>
  );
}
