import { Panel, StatGrid, StatRow } from '@angel1254mc/zone-ui';
import { WEngineImage } from 'examples/art';

export default function LargePanel() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <Panel
        variant="large"
        title="The Brimstone"
        aside={
          <StatGrid>
            <StatRow label="Level" value="60 / 60" />
            <StatRow label="ATK" value="684" />
            <StatRow label="Crit Rate" value="5%" />
          </StatGrid>
        }
      >
        <WEngineImage id="14104" alt="" />
      </Panel>
    </div>
  );
}
