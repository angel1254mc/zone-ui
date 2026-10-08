import { BottomBar, Button, DennyIcon, Screen, Stage, StatRow, Text, TopBar } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

export default function SubPage() {
  return (
    <Stage>
      <Screen
        background="hatch"
        uid="1000000001"
        onBack={() => {}}
        topBar={<TopBar title="W-Engine Overclocking" onBack={() => {}} />}
        bottomBar={
          <BottomBar
            right={
              <>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: u(10) }}>
                  <DennyIcon size={40} />
                  <Text role="condensedMd">12,000</Text>
                </span>
                <Button width="wide">Confirm</Button>
              </>
            }
          />
        }
      >
        <div style={{ display: 'grid', gap: u(12), width: u(640), padding: `${u(80)} ${u(140)}` }}>
          <StatRow label="Base ATK" value="594" />
          <StatRow label="ATK" value="25%" />
          <StatRow label="Level" value="60" />
        </div>
      </Screen>
    </Stage>
  );
}
