import { WebTabs } from '@angel1254mc/zone-ui';

export default function LightPage() {
  return (
    <div style={{ padding: 24, borderRadius: 16, background: '#EFEFEF' }}>
      <WebTabs
        aria-label="Site sections"
        defaultValue="events"
        items={[
          { value: 'home', label: 'Home' },
          { value: 'news', label: 'News' },
          { value: 'events', label: 'Events' },
          { value: 'support', label: 'Support' },
        ]}
      />
    </div>
  );
}
