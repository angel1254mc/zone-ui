import type { CSSProperties, ReactNode } from 'react';
import { Text } from '@angel1254mc/zone-ui';

const u = (n: number) => `calc(${n} * var(--zzz-px))`;

const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: `${u(16)} ${u(40)}` };
const plate = (background: string): CSSProperties => ({
  background,
  padding: `${u(10)} ${u(18)}`,
  borderRadius: u(10),
});

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'grid', gap: u(10) }}>
      <Text role="label" tone="muted">
        {label}
      </Text>
      {children}
    </div>
  );
}

export default function TextModifiers() {
  return (
    <div style={{ display: 'grid', gap: u(36), width: '100%' }}>
      <Group label="italic">
        <div style={row}>
          <Text role="button">Craft</Text>
          <Text role="button" italic>
            Craft
          </Text>
        </div>
      </Group>

      <Group label="outline: sm, md, event, new">
        <div style={{ ...row, ...plate('#3A5F7A') }}>
          <Text role="bodyXl" outline="sm">
            Next stop
          </Text>
          <Text role="titlePill" italic outline="md">
            Lv. 60
          </Text>
          <Text role="eventTitle" outline="event">
            Event
          </Text>
          <Text role="badgeNew" italic outline="new" tone="soft">
            NEW!
          </Text>
        </div>
      </Group>

      <Group label="deboss and tracked">
        <div style={row}>
          <span style={plate('#252525')}>
            <Text role="caption" deboss>
              Agent info
            </Text>
          </span>
          <Text role="condensedInterstitial" tracked="interstitial" italic>
            Select
          </Text>
        </div>
      </Group>

      <Group label="fit: shrinks to its box, never below 16 units">
        <div style={{ display: 'grid', gap: u(8) }}>
          {['Anomaly Mastery', 'Anomaly Proficiency'].map((s) => (
            <div key={s} style={{ width: u(230), background: '#1A1A1A', padding: `${u(4)} ${u(8)}` }}>
              <Text role="body" fit>
                {s}
              </Text>
            </div>
          ))}
        </div>
      </Group>
    </div>
  );
}
