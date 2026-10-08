import { BarChart } from '@angel1254mc/zone-ui';

export default function WeekInReview() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <BarChart
        label="Correct answers per day"
        max={5}
        yAxisLabel="Correct"
        data={[
          { label: 'Mon', value: 3 },
          { label: 'Tue', value: 5, highlight: true, marker: 'Best' },
          { label: 'Wed', value: 2 },
          { label: 'Thu', value: 4 },
          { label: 'Fri', value: 1 },
          { label: 'Sat', value: 4 },
          { label: 'Sun', value: 4, highlight: true, marker: 'Today' },
        ]}
      />
    </div>
  );
}
