import { SegmentedTabs, VoicePill } from '@angel1254mc/zone-ui';

export default function TonesAndSkins() {
  return (
    <div style={{ display: 'grid', gap: 20, justifyItems: 'start' }}>
      <VoicePill name="Mira Kessler" progress={0.5} playing />
      <VoicePill name="Mira Kessler" progress={0.5} playing skin="game" />
      <div style={{ padding: 16, borderRadius: 16, background: '#efefef' }}>
        <VoicePill
          name="Mira Kessler"
          tone="light"
          trailing={
            <SegmentedTabs
              size="sm"
              aria-label="Voice language"
              defaultValue="en"
              items={[
                { value: 'en', label: 'EN' },
                { value: 'jp', label: 'JP' },
              ]}
            />
          }
        />
      </div>
    </div>
  );
}
