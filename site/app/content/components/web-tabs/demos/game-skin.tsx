import { WebTabs } from '@angel1254mc/zone-ui';

export default function GameSkin() {
  return (
    <div style={{ padding: 24, borderRadius: 16, background: '#000' }}>
      <WebTabs
        aria-label="Menu sections"
        skin="game"
        defaultValue="stats"
        items={[
          { value: 'stats', label: 'Base Stats' },
          { value: 'skills', label: 'Skills' },
          { value: 'equipment', label: 'Equipment' },
          { value: 'discs', label: 'Drive Discs' },
        ]}
      />
    </div>
  );
}
