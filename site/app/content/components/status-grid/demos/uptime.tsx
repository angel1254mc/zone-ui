import { StatusGrid } from '@angel1254mc/zone-ui';
import type { StatusGridStatus } from '@angel1254mc/zone-ui';

/** Ninety days, most fully up, with a few degraded and outage days. */
const days = Array.from({ length: 90 }, (_, i) => {
  const r = (i * 37 + 11) % 97;
  const status: StatusGridStatus = r < 3 ? 'error' : r < 8 ? 'warning' : 'success';
  return { status, day: i + 1 };
});

const tooltips: Record<StatusGridStatus, string> = {
  success: '100%',
  warning: '99.2% (degraded)',
  error: '93.0% (outage)',
  neutral: 'No data',
  empty: 'No data',
};

export default function Uptime() {
  return (
    <StatusGrid
      size="sm"
      glyphs={false}
      hideLabels
      aria-label="Uptime, last 90 days"
      items={days.map(({ status, day }) => ({
        status,
        labelText: `Day ${day}`,
        tooltip: `Day ${day}: ${tooltips[status]}`,
      }))}
    />
  );
}
