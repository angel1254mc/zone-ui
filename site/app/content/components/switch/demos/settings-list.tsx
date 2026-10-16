import { useId } from 'react';
import { Switch, Text } from '@angel1254mc/zone-ui';

function SettingRow({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const id = useId();
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
      <Text as="label" htmlFor={id} role="body">
        {label}
      </Text>
      <Switch id={id} defaultChecked={defaultChecked} />
    </div>
  );
}

export default function SettingsList() {
  return (
    <div style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 380 }}>
      <SettingRow label="Vibration" defaultChecked />
      <SettingRow label="Show damage numbers" defaultChecked />
      <SettingRow label="Skip watched cutscenes" />
      <SettingRow label="Auto-battle" />
    </div>
  );
}
