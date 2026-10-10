import { EffectNameBar, EffectText, SectionLabel, StatRow } from '@angel1254mc/zone-ui';

export default function ItemDetail() {
  const gap = 'calc(7 * var(--zzz-px))';
  const sectionGap = 'calc(10 * var(--zzz-px))';
  return (
    <section
      aria-label="Steel Cushion"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: 'calc(452 * var(--zzz-px))',
        padding: 'calc(20 * var(--zzz-px))',
        boxSizing: 'border-box',
        background: '#000',
      }}
    >
      <SectionLabel>Base Stat</SectionLabel>
      <StatRow label="Base ATK" value="684" style={{ marginTop: gap }} />

      <SectionLabel style={{ marginTop: sectionGap }}>Advanced Stat</SectionLabel>
      <StatRow label="CRIT Rate" value="24%" style={{ marginTop: gap }} />

      <SectionLabel style={{ marginTop: sectionGap }}>W-Engine Effect</SectionLabel>
      <EffectNameBar style={{ marginTop: gap }}>Heavy Swing</EffectNameBar>
      <EffectText
        style={{ marginTop: 'calc(12 * var(--zzz-px))' }}
        markup="Physical DMG increases by {val}20%{/val}. DMG against enemies hit from behind increases by a further {val}25%{/val}."
      />
    </section>
  );
}
