import { EffectText, SectionLabel } from '@angel1254mc/zone-ui';

export default function NextPhase() {
  return (
    <div style={{ display: 'grid', gap: 10, width: '100%', maxWidth: 520, padding: 20, background: '#0d0d0d' }}>
      <SectionLabel flush>Current Phase</SectionLabel>
      <EffectText
        density="paragraph"
        markup="Upon hitting an enemy with a {kw}Basic Attack{/kw}, ATK increases by {val}3.5%{/val} for 8s."
      />
      <SectionLabel flush style={{ marginTop: 12 }}>
        Next Phase
      </SectionLabel>
      <EffectText
        density="paragraph"
        tone="muted"
        markup="Upon hitting an enemy with a Basic Attack, ATK increases by {b}4.4%{/b} for 8s."
      />
    </div>
  );
}
