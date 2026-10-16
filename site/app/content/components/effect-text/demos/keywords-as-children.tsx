import { AttackIcon, EffectText, Keyword, Value } from '@angel1254mc/zone-ui';

export default function KeywordsAsChildren() {
  return (
    <div style={{ width: '100%', maxWidth: 452, padding: 20, background: '#000' }}>
      <EffectText density="paragraph">
        For characters with the <Keyword icon={<AttackIcon />}>Attack</Keyword> specialty, CRIT Rate increases by{' '}
        <Value>12%</Value> while their HP is above <Value>50%</Value>.
      </EffectText>
    </div>
  );
}
