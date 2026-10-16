import { MissionCard } from '@angel1254mc/zone-ui';
import { ItemImage } from 'examples/art';

export default function EventColours() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <MissionCard
        title="Spend 600 Battery Charge during the event"
        theme={{ ornament: '#F3A445' }}
        reward={<ItemImage id="502" alt="" />}
        rewardLabel="Ether Battery"
      />
      <MissionCard
        title="Defeat 30 Ethereals in Operation Matrix"
        theme={{ ring: '#6C63D9', body: '#F2B233' }}
        reward={<ItemImage id="103040" alt="" />}
        rewardLabel="Hi-Fi Master Copy"
      />
    </div>
  );
}
