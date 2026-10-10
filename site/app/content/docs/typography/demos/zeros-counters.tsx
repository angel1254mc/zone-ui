import { Text, Zeros } from '@angel1254mc/zone-ui';

export default function ZerosCounters() {
  return (
    <div style={{ display: 'grid', gap: 'calc(20 * var(--zzz-px))', justifyItems: 'start' }}>
      <Text role="bodyXl">
        <Zeros value={76418} digits={8} />
      </Text>
      <Text role="bodyXl">
        <Zeros value={1180} digits={8} />
      </Text>
      <Text role="bodyXl">
        <Zeros value={20} digits={3} />
        /240
      </Text>
    </div>
  );
}
