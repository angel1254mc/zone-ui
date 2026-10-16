import { Button, Panel, StatGrid, StatRow } from '@angel1254mc/zone-ui';

export default function PanelHero() {
  return (
    <Panel headerLabel="DETAIL" title="The Brimstone" footer={<Button width="wide">Equip</Button>}>
      <StatGrid>
        <StatRow label="ATK" value="684" />
        <StatRow label="HP" value="2,330" />
        <StatRow label="Crit Rate" value="5%" highlight />
        <StatRow label="Crit DMG" value="50%" />
        <StatRow label="Anomaly Proficiency" value="85" />
      </StatGrid>
    </Panel>
  );
}
