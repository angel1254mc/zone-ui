import { BarChart } from '@angel1254mc/zone-ui';

const scores = [
  { label: '0', value: 112 },
  { label: '1', value: 486 },
  { label: '2', value: 1204 },
  { label: '3', value: 2371 },
  { label: '4', value: 2950 },
  { label: '5', value: 1289 },
];

export default function BarChartHero() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <BarChart
        label="Today's scores"
        data={scores}
        highlight={4}
        markerLabel="You"
        xAxisLabel="Correct answers"
        yAxisLabel="Players"
      />
    </div>
  );
}
