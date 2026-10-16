import { WebTabs } from '@angel1254mc/zone-ui';

export default function WebTabsHero() {
  return (
    <WebTabs
      aria-label="News categories"
      defaultValue="news"
      items={[
        { value: 'latest', label: 'Latest' },
        { value: 'news', label: 'News' },
        { value: 'notices', label: 'Notices' },
        { value: 'events', label: 'Events' },
      ]}
    />
  );
}
