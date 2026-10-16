import { BatteryIcon, Button, DennyIcon, HomeIcon, PolychromeIcon, ResourceBar, TopBar } from '@angel1254mc/zone-ui';

export default function TopBarHero() {
  return (
    <TopBar
      onBack={() => {}}
      left={
        <Button size="md" width="compact" icon={<HomeIcon />}>
          City
        </Button>
      }
      right={
        <ResourceBar
          items={[
            { label: 'Battery Charge', value: 180, max: 240, icon: <BatteryIcon />, onAdd: () => {} },
            { label: 'Dennies', value: 76418, icon: <DennyIcon />, onAdd: () => {} },
            { label: 'Polychrome', value: 1600, icon: <PolychromeIcon />, onAdd: () => {} },
          ]}
        />
      }
    />
  );
}
