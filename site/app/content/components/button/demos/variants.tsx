import { Button, EnhanceIcon } from '@angel1254mc/zone-ui';

export default function Variants() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
      <Button>Default</Button>
      <Button variant="sub" icon={<EnhanceIcon />} aria-label="Enhance" />
      <div style={{ background: '#F58DB0', padding: 16 }}>
        <Button variant="mission">Go</Button>
      </div>
    </div>
  );
}
