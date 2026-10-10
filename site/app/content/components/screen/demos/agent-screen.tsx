import { Button, Screen, Stage, TopBar } from '@angel1254mc/zone-ui';
import { AgentImage } from 'examples/art';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

export default function AgentScreen() {
  return (
    <Stage>
      <Screen
        background="graffiti"
        uid="1000000001"
        onBack={() => {}}
        topBar={
          <TopBar
            background="none"
            onBack={() => {}}
            left={
              <Button size="md" width={320} twoLine avatar={<AgentImage seed={3} crop="circle" alt="" />}>
                {'Special Training\nPlan'}
              </Button>
            }
          />
        }
      >
        <div style={{ position: 'absolute', left: u(700), top: u(40), width: u(700), height: u(860) }}>
          <AgentImage seed={3} crop="full" alt="" style={{ width: '100%', height: '100%' }} />
        </div>
      </Screen>
    </Stage>
  );
}
