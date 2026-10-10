import { BarChart } from '@angel1254mc/zone-ui';
import type { BarChartDatum } from '@angel1254mc/zone-ui';

const votes: BarChartDatum[] = [
  { label: 'Attack', value: 412, color: 'rarity-s' },
  { label: 'Stun', value: 268, color: 'rarity-a' },
  { label: 'Anomaly', value: 341, color: 'rarity-b' },
  { label: 'Support', value: 190, color: 'rarity-c' },
  { label: 'Defense', value: 155 },
];

export default function PollResults() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <BarChart label="Favourite specialty" data={votes} valueDisplay="both" yAxisLabel="Votes" />
    </div>
  );
}
