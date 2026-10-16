import { BatteryIcon, DennyIcon, PolychromeIcon, ResourceBar, Text, TopBar } from '@angel1254mc/zone-ui';
import { AgentImage, NamecardImage } from 'examples/art';

export default function OverArt() {
  return (
    <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
      <NamecardImage id="ImgCardEvent04" alt="" style={{ position: 'absolute', inset: 0 }} />
      <TopBar
        background="translucent"
        left={
          <span
            className="zzz-mat-pill"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              height: 44,
              padding: '0 20px 0 3px',
              borderRadius: 22,
            }}
          >
            <span style={{ width: 38, height: 38, borderRadius: '50%', overflow: 'hidden' }}>
              <AgentImage seed={7} crop="circle" alt="" />
            </span>
            <Text role="label">Proxy</Text>
            <Text role="condensedSm" tone="secondary">
              Lv.60
            </Text>
          </span>
        }
        right={
          <ResourceBar
            items={[
              { label: 'Battery Charge', value: 20, max: 240, icon: <BatteryIcon />, onAdd: () => {} },
              { label: 'Dennies', value: 75918, icon: <DennyIcon />, onAdd: () => {} },
              { label: 'Polychrome', value: 193, icon: <PolychromeIcon />, onAdd: () => {} },
            ]}
          />
        }
      />
    </div>
  );
}
