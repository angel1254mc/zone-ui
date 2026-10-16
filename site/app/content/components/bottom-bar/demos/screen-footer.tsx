import { BottomBar, Button, Screen, TopBar } from '@angel1254mc/zone-ui';

export default function ScreenFooter() {
  return (
    <div style={{ height: 380 }}>
      <Screen
        background="hatch"
        topBar={<TopBar title="Storage" onBack={() => {}} />}
        bottomBar={
          <BottomBar hints={[{ keyCap: 'T', label: 'Lock' }]} right={<Button width="compact">Dismantle</Button>} />
        }
        uid="1000000001"
      />
    </div>
  );
}
