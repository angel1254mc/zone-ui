import { StatusGrid } from '@angel1254mc/zone-ui';
import type { StatusGridStatus } from '@angel1254mc/zone-ui';

const days: StatusGridStatus[] = [
  'success',
  'success',
  'warning',
  'success',
  'error',
  'success',
  'success',
  'success',
  'success',
  'success',
  'neutral',
  'success',
  'success',
  'success',
  'success',
  'warning',
  'success',
  'success',
  'success',
  'success',
  'success',
  'success',
  'success',
  'error',
  'success',
  'success',
  'success',
  'success',
  'success',
  'empty',
];

const tooltips: Partial<Record<StatusGridStatus, string>> = {
  success: '5 of 5 correct',
  warning: '3 of 5 correct, played late',
  error: 'Missed',
  neutral: 'Skipped',
  empty: 'Not played yet',
};

export default function StreakCalendar() {
  return (
    <StatusGrid
      columns={7}
      aria-label="Daily streak"
      hideLabels
      items={days.map((status, i) => ({
        status,
        labelText: `Day ${i + 1}`,
        current: i === 29,
        tooltip: tooltips[status],
      }))}
    />
  );
}
