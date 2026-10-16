import { IconButton, MinusIcon, PlusIcon, SearchIcon } from '@angel1254mc/zone-ui';

export default function Presets() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <IconButton size="stepper" icon={<MinusIcon />} label="Decrease" />
        <IconButton size="stepper" icon={<PlusIcon />} label="Increase" />
      </div>
      <div style={{ background: '#F58DB0', padding: 12, display: 'flex' }}>
        <IconButton size="mission" icon={<SearchIcon />} label="Mission details" />
      </div>
    </div>
  );
}
