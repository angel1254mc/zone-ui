import { Switch } from '@angel1254mc/zone-ui';

export default function SizesAndStates() {
  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <Switch size={size} aria-label={`Off (${size})`} />
          <Switch size={size} aria-label={`On (${size})`} defaultChecked />
          <Switch size={size} aria-label={`Disabled (${size})`} disabled />
          <Switch size={size} aria-label={`Disabled on (${size})`} disabled defaultChecked />
        </div>
      ))}
    </div>
  );
}
