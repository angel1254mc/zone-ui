import { SegmentedTabs } from '@angel1254mc/zone-ui';

export default function SegmentedTabsHero() {
  return (
    <SegmentedTabs
      aria-label="Manage item"
      defaultValue="craft"
      items={[
        { value: 'craft', label: 'Craft' },
        { value: 'dismantle', label: 'Dismantle' },
        { value: 'destroy', label: 'Destroy' },
      ]}
    />
  );
}
