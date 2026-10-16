import { useState } from 'react';
import { TabPanel, WebTabs } from '@angel1254mc/zone-ui';

const sections = [
  { value: 'latest', label: 'Latest', body: 'The newest patch notes and event schedules.' },
  { value: 'news', label: 'News', body: 'Stories from the city and its residents.' },
  { value: 'notices', label: 'Notices', body: 'Maintenance windows and account updates.' },
];

export default function WithPanels() {
  const [section, setSection] = useState('latest');
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start', width: '100%', maxWidth: 640 }}>
      <WebTabs
        id="news-tabs"
        aria-label="News categories"
        items={sections}
        value={section}
        onValueChange={setSection}
      />
      {sections.map((item) => (
        <TabPanel key={item.value} tabsId="news-tabs" value={item.value} hidden={item.value !== section}>
          {item.body}
        </TabPanel>
      ))}
    </div>
  );
}
