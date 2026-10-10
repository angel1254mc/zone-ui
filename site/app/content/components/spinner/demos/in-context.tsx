import { Button, Spinner } from '@angel1254mc/zone-ui';

export default function InContext() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
      <Button disabled icon={<Spinner size={26} tone="white" label="Saving" />}>
        Saving
      </Button>
      <div
        className="zzz-mat-panel"
        style={{ width: '100%', maxWidth: 300, height: 150, display: 'grid', placeItems: 'center', margin: 8 }}
      >
        <Spinner variant="chevrons" size={56} label="Loading agent roster" />
      </div>
    </div>
  );
}
