import { BatteryIcon, DennyIcon, PolychromeIcon, ResourceBar, TopBar } from '@angel1254mc/zone-ui';

export default function InTheTopBar() {
  return (
    <TopBar
      title="Store"
      onBack={() => {}}
      right={
        <ResourceBar
          items={[
            { label: 'Battery Charge', value: 132, max: 240, icon: <BatteryIcon />, onAdd: () => {} },
            { label: 'Dennies', value: 1250830, icon: <DennyIcon />, onAdd: () => {} },
            { label: 'Polychrome', value: 4820, icon: <PolychromeIcon />, onAdd: () => {} },
          ]}
        />
      }
    />
  );
}
