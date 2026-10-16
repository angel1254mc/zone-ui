import { BarChart } from '@angel1254mc/zone-ui';

/** Seconds per stage of a five-stage run. */
const stages = [
  { label: 'Stage 1', value: 74 },
  { label: 'Stage 2', value: 102 },
  { label: 'Stage 3', value: 61 },
  { label: 'Stage 4', value: 138 },
  { label: 'Stage 5', value: 95 },
];

const minutes = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export default function RunTimes() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <BarChart
        label="Clear time per stage"
        data={stages}
        fill="light"
        highlight={2}
        markerLabel="Fastest"
        formatValue={minutes}
        height={220}
      />
    </div>
  );
}
