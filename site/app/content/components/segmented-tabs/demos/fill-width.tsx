import { SegmentedTabs } from '@angel1254mc/zone-ui';

export default function FillWidth() {
  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <SegmentedTabs
        aria-label="News"
        width="fill"
        surface="mesh"
        defaultValue="news"
        items={[
          { value: 'all', label: 'All' },
          { value: 'news', label: 'News' },
          { value: 'notices', label: 'Notices' },
          { value: 'events', label: 'Events' },
        ]}
      />
    </div>
  );
}
