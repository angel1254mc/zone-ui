import { useState } from 'react';
import { EffectNameBar, EffectText } from '@angel1254mc/zone-ui';

export default function Expandable() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'grid', gap: 26, width: '100%', maxWidth: 452, padding: 20, background: '#000' }}>
      {/* The chevron hangs below the bar without taking space, so leave a gap after it. */}
      <EffectNameBar expandable expanded={open} onExpandedChange={setOpen} controls="effect-details">
        Steady Rhythm
      </EffectNameBar>
      <EffectText markup="Dealing {kw}Ether DMG{/kw} grants a stack of {kw}Rhythm{/kw}, up to {val}3{/val} stacks." />
      <EffectText
        id="effect-details"
        hidden={!open}
        tone="muted"
        markup="Each stack increases the equipper's Impact by {b}4%{/b}. Stacks last {b}10s{/b} and are lost when the equipper is switched out."
      />
    </div>
  );
}
