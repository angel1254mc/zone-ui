import { SegmentedTabs } from '@angel1254mc/zone-ui';

const items = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'archive', label: 'Archive' },
];

export default function Surfaces() {
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <SegmentedTabs aria-label="Black track" items={items} defaultValue="daily" />
      <SegmentedTabs aria-label="Mesh track" items={items} defaultValue="weekly" surface="mesh" />
    </div>
  );
}
