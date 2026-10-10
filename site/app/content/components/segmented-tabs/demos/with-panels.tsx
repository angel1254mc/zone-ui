import { useState } from 'react';
import { SegmentedTabs, TabPanel } from '@angel1254mc/zone-ui';

const tabs = [
  { value: 'stats', label: 'Base Stats', body: 'HP 7,673 · ATK 938 · DEF 606' },
  { value: 'skills', label: 'Skills', body: 'Basic Attack, Dodge, Assist, Special, Chain' },
  { value: 'equipment', label: 'Equipment', body: 'W-Engine and six Drive Disc slots' },
];

export default function WithPanels() {
  const [tab, setTab] = useState('stats');
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <SegmentedTabs
        id="agent-tabs"
        aria-label="Agent"
        surface="mesh"
        items={tabs}
        value={tab}
        onValueChange={setTab}
      />
      {tabs.map((t) => (
        <TabPanel key={t.value} tabsId="agent-tabs" value={t.value} hidden={t.value !== tab}>
          {t.body}
        </TabPanel>
      ))}
    </div>
  );
}
