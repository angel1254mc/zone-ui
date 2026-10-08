import { EffectNameBar, EffectText } from '@angel1254mc/zone-ui';

export default function EffectTextHero() {
  return (
    <div style={{ display: 'grid', gap: 14, width: '100%', maxWidth: 452, padding: 20, background: '#000' }}>
      <EffectNameBar>Scorching Breath</EffectNameBar>
      <EffectText markup="Upon hitting an enemy with a {kw}Basic Attack{/kw}, the equipper's ATK increases by {val}3.5%{/val} for {val}8s{/val}. Stacks up to {val}4{/val} times." />
    </div>
  );
}
