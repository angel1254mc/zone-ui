import { AttackIcon, Keyword, Text, Value } from '@angel1254mc/zone-ui';

export default function KeywordValue() {
  return (
    <Text
      as="p"
      role="body"
      style={{ margin: 0, maxWidth: 'calc(600 * var(--zzz-px))', lineHeight: 'var(--zzz-line-height-paragraph)' }}
    >
      After a <Keyword icon={<AttackIcon />}>Basic Attack</Keyword> hits an enemy, the wearer&apos;s ATK rises by{' '}
      <Value>3.5%</Value> for <Value>8s</Value>. Stacks up to <Value>4</Value> times.
    </Text>
  );
}
