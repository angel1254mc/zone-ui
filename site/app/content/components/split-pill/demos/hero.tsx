import { FireIcon, RuptureIcon, SplitPill } from '@angel1254mc/zone-ui';

export default function SplitPillHero() {
  return (
    <div style={{ padding: 24, borderRadius: 16, background: 'var(--zzz-color-surface-agent-info)' }}>
      <SplitPill
        aria-label="Element and specialty"
        items={[
          { icon: <FireIcon />, label: 'Fire' },
          { icon: <RuptureIcon style={{ color: 'var(--zzz-color-icon-specialty)' }} />, label: 'Rupture' },
        ]}
      />
    </div>
  );
}
