import { BatteryIcon, DennyIcon, PolychromeIcon, ResourceBar } from '@angel1254mc/zone-ui';

export default function CurrencyPillHero() {
  return (
    <ResourceBar
      items={[
        { label: 'Battery Charge', value: 20, max: 240, icon: <BatteryIcon />, onAdd: () => {} },
        { label: 'Dennies', value: 76418, icon: <DennyIcon />, onAdd: () => {} },
        { label: 'Polychrome', value: 193, icon: <PolychromeIcon />, onAdd: () => {} },
      ]}
    />
  );
}
