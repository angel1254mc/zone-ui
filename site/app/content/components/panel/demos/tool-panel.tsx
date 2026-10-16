import { Panel, StatGrid, StatRow } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

export default function ToolPanel() {
  return (
    <Panel
      variant="tool"
      headerLabel="Crafting"
      lowerTexturedFrom={300}
      lower={
        <StatGrid>
          <StatRow label="Battery Charge" value="20 / 60" />
          <StatRow label="Prepaid Power Card" value="6 / 1" />
        </StatGrid>
      }
    >
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ width: 120, height: 120, flex: 'none' }}>
          <ItemImage id="502" alt="" />
        </div>
        <div>
          <p style={{ margin: 0, fontSize: 'var(--zzz-font-size-title)', lineHeight: 1.2 }}>Ether Battery × 7</p>
          <p style={{ margin: '12px 0 0', color: 'var(--zzz-color-text-secondary)' }}>
            Gain 60 Battery Charge when used.
          </p>
        </div>
      </div>
    </Panel>
  );
}
